import Bar from "widget/bar/Bar"

const hyprland = await Service.import("hyprland")

hyprland.connect("monitor-added", (_hypr, monitor) => {
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
        App.add_window(Bar(monitor));
    }
});

Utils.exec(["sass", `${App.configDir}/style/main.scss`, `${App.configDir}/tmp/style/main.css`])
App.config({
    style: "./tmp/style/main.css",
    windows: [
        Bar("DP-1"),
        Bar("DP-2"),
        Bar("DP-3"),
    ]
});
