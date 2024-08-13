// .config/ags/lib/variables.ts
import GLib2 from "gi://GLib";
var clock = Variable(GLib2.DateTime.new_now_local(), {
  poll: [1000, () => GLib2.DateTime.new_now_local()]
});
var uptime = Variable(0, {
  poll: [
    60000,
    "cat /proc/uptime",
    (line) => Number.parseInt(line.split(".")[0]) / 60
  ]
});
var distro = {
  id: GLib2.get_os_info("ID"),
  logo: GLib2.get_os_info("LOGO")
};

// .config/ags/widget/bar/PanelButton.ts
var PanelButton_default = ({
  window = "",
  flat,
  child,
  setup,
  ...rest
}) => Widget.Button({
  child: Widget.Box({ child }),
  setup: (self) => {
    let open = false;
    self.toggleClassName("panel-button");
    self.toggleClassName(window);
    self.hook(App, (_, win, visible) => {
      if (win !== window)
        return;
      if (open && !visible) {
        open = false;
        self.toggleClassName("active", false);
      }
      if (visible) {
        open = true;
        self.toggleClassName("active");
      }
    });
    if (setup)
      setup(self);
  },
  ...rest
});

// .config/ags/widget/bar/buttons/Date.ts
var format = Variable("\uF017  %I:%M %p  \uF073  %a %m/%d/%Y");
var time = Utils.derive([clock, format], (c, f) => c.format(f) || "");
var Date_default = () => PanelButton_default({
  window: "datemenu",
  child: Widget.Label({
    justification: "center",
    label: time.bind()
  })
});

// .config/ags/widget/bar/buttons/Workspaces.ts
var hyprland = await Service.import("hyprland");
var dispatch = (arg) => {
  Utils.execAsync(`hyprctl dispatch workspace ${arg}`);
};
var convert_to_kanji = (arg) => {
  switch (arg) {
    case 1:
      return "\u4E00";
    case 2:
      return "\u4E8C";
    case 3:
      return "\u4E09";
    case 4:
      return "\u56DB";
    case 5:
      return "\u4E94";
    case 6:
      return "\u516D";
    case 7:
      return "\u4E03";
    case 8:
      return "\u516B";
    case 9:
      return "\u4E5D";
    case 10:
      return "\u5341";
  }
  return "\u7121";
};
var Workspaces = (ws, monitor) => Widget.Box({
  children: Array.from({ length: ws || 20 }, (_, i) => i + 1).map((i) => Widget.Button({
    attribute: i,
    vpack: "center",
    label: `${convert_to_kanji(i)}`,
    on_clicked: () => dispatch(i),
    setup: (self) => self.hook(hyprland, () => {
      self.toggleClassName("active", hyprland.active.workspace.id === i);
      self.toggleClassName("occupied", (hyprland.getWorkspace(i)?.windows || 0) > 0);
      self.toggleClassName("currentmonitor", hyprland.getWorkspace(i)?.monitor === monitor);
    })
  })),
  setup: (box) => {
    if (ws === 0) {
      box.hook(hyprland.active.workspace, () => box.children.map((btn) => {
        btn.visible = hyprland.workspaces.some((ws2) => ws2.id === btn.attribute);
      }));
    }
  }
});
var Workspaces_default = (monitor) => Widget.EventBox({
  class_name: "workspaces",
  on_scroll_up: () => dispatch("+1"),
  on_scroll_down: () => dispatch("-1"),
  child: Workspaces(10, monitor)
});

// .config/ags/widget/bar/buttons/Media.ts
var mpris = await Service.import("mpris");
var FALLBACK_ICON = "audio-x-generic-symbolic";
var getPlayer = (name = "spotify") => mpris.getPlayer(name) || mpris.players[0] || null;
var Content = (player) => {
  const revealer = Widget.Revealer({
    click_through: true,
    visible: true,
    transition: "slide_right",
    setup: (self) => {
      let current = "";
      self.hook(player, () => {
        if (current == player.track_title)
          return;
        current = player.track_title;
        self.reveal_child = true;
        Utils.timeout(3000, () => {
          !self.is_destroyed && (self.reveal_child = false);
        });
      });
    },
    child: Widget.Label({
      truncate: "end",
      max_width_chars: 64,
      label: Utils.merge([
        player.bind("track_title"),
        player.bind("track_artists")
      ], () => `  ${player.track_title} - ${player.track_artists.join(", ")}`)
    })
  });
  const playericon = Widget.Label({
    class_names: player.bind("play_back_status").transform((s) => {
      switch (s) {
        case "Playing":
          return ["glyph", "playing"];
        case "Paused":
        case "Stopped":
          return ["glyph"];
      }
    }),
    label: "\uF1BC"
  });
  return Widget.Box({
    attribute: { revealer },
    children: [
      playericon,
      revealer
    ]
  });
};
var Media_default = () => {
  let player = getPlayer();
  const btn = PanelButton_default({
    class_name: "media",
    child: Widget.Icon(FALLBACK_ICON)
  });
  const update = () => {
    player = getPlayer();
    btn.visible = !!player;
    if (!player)
      return;
    const content = Content(player);
    const { revealer } = content.attribute;
    btn.child = content;
    btn.on_primary_click = () => {
      player.playPause();
    };
    btn.on_scroll_up = () => {
      player.next();
    };
    btn.on_scroll_down = () => {
      player.previous();
    };
    btn.on_hover = () => {
      revealer.reveal_child = true;
    };
    btn.on_hover_lost = () => {
      revealer.reveal_child = false;
    };
  };
  btn.connect("leave-notify-event", (_) => {
    const { revealer } = btn.child.attribute;
    revealer.reveal_child = false;
  });
  return btn.hook(mpris, update, "notify::players");
};

// .config/ags/widget/bar/Bar.ts
import Gdk from "gi://Gdk?version=3.0";

// .config/ags/widget/bar/buttons/SystemStatus.ts
var audio = await Service.import("audio");
var bluetooth = await Service.import("bluetooth");
var SPEAKER_MUTED = "audio-disabled-symbolic";
var SPEAKER_LOW = "audio-volume-low-symbolic";
var SPEAKER_MEDIUM = "audio-volume-medium-symbolic";
var SPEAKER_HIGH = "audio-volume-high-symbolic";
var SPEAKER_OVERAMPLIFIED = "audio-volume-overamplified-symbolic";
var MicrophoneStatus = () => Widget.Label({
  class_name: "glyph"
}).hook(audio, (self) => self.visible = audio.recorders.length > 0 || audio.microphone.is_muted || false).hook(audio.microphone, (self) => {
  const vol = audio.microphone.is_muted ? 0 : audio.microphone.volume;
  const cons = [[1, "\uF130"], [0, "\uF131"]];
  self.label = cons.find(([n]) => n <= vol * 100)?.[1] || "";
});
var BluetoothStatus = () => Widget.Overlay({
  class_name: "bluetooth",
  pass_through: true,
  visible: bluetooth.bind("enabled"),
  child: Widget.Label({
    class_name: "glyph",
    label: "\uF293"
  })
});
var AudioStatus = () => Widget.Icon().hook(audio.speaker, (self) => {
  const vol = audio.speaker.is_muted ? 0 : audio.speaker.volume;
  const cons = [[101, SPEAKER_OVERAMPLIFIED], [67, SPEAKER_HIGH], [34, SPEAKER_MEDIUM], [1, SPEAKER_LOW], [0, SPEAKER_MUTED]];
  self.icon = cons.find(([n]) => n <= vol * 100)?.[1] || "";
});
var SystemStatus_default = () => PanelButton_default({
  window: "quicksettings",
  on_clicked: () => print("hello"),
  on_scroll_up: () => audio.speaker.volume += 0.02,
  on_scroll_down: () => audio.speaker.volume -= 0.02,
  child: Widget.Box([
    BluetoothStatus(),
    AudioStatus(),
    MicrophoneStatus()
  ])
});

// .config/ags/widget/bar/Bar.ts
var hyprland2 = await Service.import("hyprland");
var get_monitor_id = (monitor) => {
  for (var mt of hyprland2.monitors) {
    if (mt.name == monitor) {
      return Gdk.Display.get_default()?.get_monitor_at_point(mt.x, mt.y);
    }
  }
  return Gdk.Display.get_default()?.get_monitor_at_point(0, 0);
};
var expander = () => Widget.Box({ expand: true });
var Bar_default = (monitor) => {
  return Widget.Window({
    gdkmonitor: get_monitor_id(monitor),
    class_name: "bar",
    name: `bar${monitor}`,
    exclusivity: "exclusive",
    anchor: ["top", "left", "right"],
    child: Widget.CenterBox({
      css: "min-width: 2px; min-height: 2px;",
      start_widget: Widget.Box({
        hexpand: true,
        children: [
          Workspaces_default(monitor),
          expander(),
          SystemStatus_default()
        ]
      }),
      center_widget: Widget.Box({
        hpack: "center",
        children: [
          Date_default()
        ]
      }),
      end_widget: Widget.Box({
        hexpand: true,
        children: [
          Media_default()
        ]
      })
    })
  });
};

// .config/ags/main.ts
var hyprland3 = await Service.import("hyprland");
hyprland3.connect("monitor-added", (_hypr, monitor) => {
  var should_create = true;
  for (var wd of App.windows) {
    try {
      if (wd.name == `bar-${monitor}`) {
        should_create = false;
        break;
      }
    } catch (err) {
      App.remove_window(wd);
    }
  }
  if (should_create) {
    App.add_window(Bar_default(monitor));
  }
});
Utils.exec(["sass", `${App.configDir}/style/main.scss`, `${App.configDir}/tmp/style/main.css`]);
App.config({
  style: "./tmp/style/main.css",
  windows: [
    Bar_default("DP-1"),
    Bar_default("DP-2"),
    Bar_default("DP-3")
  ]
});
