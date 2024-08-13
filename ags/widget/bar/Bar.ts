import Date from "./buttons/Date"
import Workspaces from "./buttons/Workspaces"
import Media from "./buttons/Media"
import Gdk from 'gi://Gdk?version=3.0';
import SystemStatus from "./buttons/SystemStatus";
const hyprland = await Service.import("hyprland")

const get_monitor_id = (monitor: string) => {
    for (var mt of hyprland.monitors) {
        if (mt.name == monitor) {
            return Gdk.Display.get_default()?.get_monitor_at_point(mt.x, mt.y);
        }
    }
    return Gdk.Display.get_default()?.get_monitor_at_point(0, 0);
}

const expander = () => Widget.Box({ expand: true });

export default (monitor: string) => {
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
                    Workspaces(monitor),
                    expander(),
                    SystemStatus(),
                ],
            }),
            center_widget: Widget.Box({
                hpack: "center",
                children: [
                    Date(),
                ],
            }),
            end_widget: Widget.Box({
                hexpand: true,
                children: [
                    Media(),
                ],
            }),
        }),
    });
}
