const hyprland = await Service.import("hyprland")

export default(id: number) => {
    return Widget.Box({
        attribute: { id },
        tooltip_text: `${id}`,
        class_name: "workspace",
        vpack: "center",
        css: "min-width: 50px; min-height: 50px; background-color: red;",
        setup(box) {
            box.hook(hyprland.active.workspace, () => {
                box.toggleClassName("active", hyprland.active.workspace.id === id)
            })
        },
        child: Widget.EventBox({
            expand: true,
            on_primary_click: () => {
                App.closeWindow("hyprland-info")
                hyprland.messageAsync(`dispatch workspace ${id}`)
            },
            child: Widget.Fixed(),
        })
    })
}
