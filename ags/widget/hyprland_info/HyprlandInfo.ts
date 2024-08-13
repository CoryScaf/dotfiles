import PopupWindow from "widget/PopupWindow"
import Workspace from "./Workspace"

const hyprland = await Service.import("hyprland")

function range(length: number, start = 1) {
    return Array.from({ length }, (_, i) => i + start)
}

const HyprlandInfo = (ws: number) => Widget.Box({
    class_name: "hyprland info horizontal",
    children: ws > 0
        ? range(ws).map(Workspace)
        : hyprland.workspaces
            .map(({ id }) => Workspace(id))
            .sort((a, b) => a.attribute.id - b.attribute.id),

    setup: w => {
        if(ws > 0)
            return;

        w.hook(hyprland, (w, id?: string) => {
            if(id === undefined)
                return;

            w.children = w.children.filter(ch => ch.attribute.id !== Number(id));
        }, "workspace-removed");
        w.hook(hyprland, (w, id?: string) => {
            if(id === undefined)
                return;

            w.children = [...w.children, Workspace(Number(id))]
                .sort((a, b) => a.attribute.id - b.attribute.id);
        }, "workspace-added");
    }
})

/*
export default () => PopupWindow({
    name: "hyprland-info",
    layout: "center",
    child: HyprlandInfo(0)
})
*/

export default () => Widget.Window({
    class_name: "popup-window",
    name: "hyprland-info",
    anchor: ["top","bottom","left","right"],
    child: Widget.Box({
        class_name: "hyprland-info horizontal",
        children: hyprland.workspaces.map(({ id }) => Workspace(id))
            .sort((a, b) => a.attribute.id - b.attribute.id),
    }),
})
