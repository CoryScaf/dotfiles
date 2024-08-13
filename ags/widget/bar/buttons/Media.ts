import { type MprisPlayer } from "types/service/mpris";
import PanelButton from "../PanelButton";
import { Box } from "resource:///com/github/Aylur/ags/widgets/box.js";
import { Revealer } from "resource:///com/github/Aylur/ags/widgets/revealer.js";
const mpris = await Service.import("mpris");

const FALLBACK_ICON = "audio-x-generic-symbolic";

const getPlayer = (name = "spotify") => mpris.getPlayer(name) || mpris.players[0] || null;

const Content = (player: MprisPlayer) => {
    const revealer = Widget.Revealer({
        click_through: true,
        visible: true,
        transition: "slide_right",
        setup: self => {
            let current = "";
            self.hook(player, () => {
                if (current == player.track_title)
                    return;

                current = player.track_title;
                self.reveal_child = true;
                Utils.timeout(3000, () => {
                    !self.is_destroyed && (self.reveal_child = false)
                });
            });
        },
        child: Widget.Label({
            truncate: "end",
            max_width_chars: 64,
            label: Utils.merge([
                player.bind("track_title"),
                player.bind("track_artists"),
            ], () => `  ${player.track_title} - ${player.track_artists.join(", ")}`),
        }),
    });
    const playericon = Widget.Label({
        class_names: player.bind("play_back_status").transform(s => {
            switch (s) {
                case "Playing": return ["glyph", "playing"];
                case "Paused":
                case "Stopped": return ["glyph"];
            }
        }),
        label: "",
    });

    return Widget.Box({
        attribute: { revealer },
        children: [
            playericon,
            revealer,
        ],
    });
};

export default () => {
    let player = getPlayer();

    const btn = PanelButton({
        class_name: "media",
        child: Widget.Icon(FALLBACK_ICON),
    });

    const update = () => {
        player = getPlayer();
        btn.visible = !!player;

        if (!player)
            return;

        const content = Content(player);
        const { revealer } = content.attribute;
        btn.child = content;
        btn.on_primary_click = () => { player.playPause(); };
        btn.on_scroll_up = () => { player.next(); };
        btn.on_scroll_down = () => { player.previous(); };
        btn.on_hover = () => {
            revealer.reveal_child = true;
        };
        btn.on_hover_lost = () => {
            revealer.reveal_child = false;
        };
    };

    btn.connect('leave-notify-event', (_) => {
        const { revealer } = (btn.child as Box<Revealer<typeof _, typeof _>, typeof _>).attribute;
        revealer.reveal_child = false;
    });

    return btn.hook(mpris, update, "notify::players");
};
