import { clock } from "lib/variables"
import PanelButton from "../PanelButton"

const format = Variable("  %I:%M %p    %a %m/%d/%Y")

const time = Utils.derive([clock, format], (c, f) => c.format(f) || "")

export default () => PanelButton({
    window: "datemenu",
    child: Widget.Label({
        justification: "center",
        label: time.bind(),
    }),
})

