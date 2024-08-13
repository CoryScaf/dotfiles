import { type WindowProps } from "types/widgets/window"
import { type RevealerProps } from "types/widgets/revealer"
import { type EventBoxProps } from "types/widgets/eventbox"

type Transition = RevealerProps["transition"]
type Child = WindowProps["child"]

export const Padding = (name: string, {
    css = "",
    hexpand = true,
    vexpand = true,
}: EventBoxProps = {}) => Widget.EventBox({
    hexpand,
    vexpand,
    can_focus: false,
    child: Widget.Box({ css }),
    setup: w => w.on("button-press-event", () => App.toggleWindow(name)),
})

const PopupRevealer = (name: string,
                       child: Child,
                       transition: Transition = "slide_down",
                      ) => Widget.Box(
    { css: "padding: 1px;" },
    Widget.Revealer({
        transition,
        child: Widget.Box({
            class_name: "window-content",
            child,
        }),
        transition_duration: 10,
        setup: self => self.hook(App, (_, wname, visible) => {
            if(wname === name)
                self.reveal_child = visible;
        }),
    }),
)

const Layout = (name: string, child: Child, transition?: Transition) => ({
    "center": () => Widget.CenterBox(
        Padding(name),
        Widget.CenterBox(
            { vertical: true },
            Padding(name),
            PopupRevealer(name, child, transition),
            Padding(name),
        ),
        Padding(name),
    ),
})

type PopupWindowProps = Omit<WindowProps, "name"> & {
    name: string
    layout?: keyof ReturnType<typeof Layout>
    transition?: Transition
}

export default ({
    name,
    child,
    layout = "center",
    transition,
    exclusivity = "ignore",
    ...props
}: PopupWindowProps) => Widget.Window({
    name,
    class_names: [name, "popup-window"],
    setup: w => w.keybind("Escape", () => App.closeWindow(name)),
    visible: false,
    keymode: "on-demand",
    exclusivity,
    layer: "top",
    anchor: ["top", "bottom", "right", "left"],
    child: Layout(name, child, transition)[layout](),
    ...props,
})
