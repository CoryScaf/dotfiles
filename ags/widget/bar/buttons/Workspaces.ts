
const hyprland = await Service.import("hyprland")

const dispatch = (arg: string | number) => {
    Utils.execAsync(`hyprctl dispatch workspace ${arg}`)
}

const convert_to_kanji = (arg: number) => {
    switch (arg) {
        case 1:
            return "一";
        case 2:
            return "二";
        case 3:
            return "三";
        case 4:
            return "四";
        case 5:
            return "五";
        case 6:
            return "六";
        case 7:
            return "七";
        case 8:
            return "八";
        case 9:
            return "九";
        case 10:
            return "十";
    }
    return "無";
}

const Workspaces = (ws: number, monitor: string) => Widget.Box({
    children: Array.from({ length: ws || 20 }, (_, i) => i + 1).map(i => Widget.Button({
        attribute: i,
        vpack: "center",
        label: `${convert_to_kanji(i)}`,
        on_clicked: () => dispatch(i),
        setup: self => self.hook(hyprland, () => {
            self.toggleClassName("active", hyprland.active.workspace.id === i)
            self.toggleClassName("occupied", (hyprland.getWorkspace(i)?.windows || 0) > 0)
            self.toggleClassName("currentmonitor", hyprland.getWorkspace(i)?.monitor === monitor)
        }),
    })),
    setup: box => {
        if (ws === 0) {
            box.hook(hyprland.active.workspace, () => box.children.map(btn => {
                btn.visible = hyprland.workspaces.some(ws => ws.id === btn.attribute)
            }))
        }
    },
})

/*export default (monitor: string) => Widget.Button({
    class_name: "workspaces",
    on_scroll_up: () => dispatch("m+1"),
    on_scroll_down: () => dispatch("m-1"),
    on_clicked: () => App.toggleWindow("hyprland-info"),
    child: Workspaces(0, monitor),
})*/

export default (monitor: string) => Widget.EventBox({
    class_name: "workspaces",
    on_scroll_up: () => dispatch('+1'),
    on_scroll_down: () => dispatch('-1'),
    child: Workspaces(10, monitor),
});
