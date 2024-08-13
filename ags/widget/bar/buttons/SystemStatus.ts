import PanelButton from "../PanelButton";

const audio = await Service.import("audio");
const bluetooth = await Service.import("bluetooth");

const SPEAKER_MUTED = "audio-disabled-symbolic";
const SPEAKER_LOW = "audio-volume-low-symbolic";
const SPEAKER_MEDIUM = "audio-volume-medium-symbolic";
const SPEAKER_HIGH = "audio-volume-high-symbolic";
const SPEAKER_OVERAMPLIFIED = "audio-volume-overamplified-symbolic";

const MicrophoneStatus = () => Widget.Label({
    class_name: "glyph",
})
    .hook(audio, self =>
        self.visible = audio.recorders.length > 0
        || audio.microphone.is_muted
        || false)
    .hook(audio.microphone, self => {
        const vol = audio.microphone.is_muted ? 0 : audio.microphone.volume;
        const cons = [[1, ""], [0, ""]] as const;
        self.label = cons.find(([n]) => n <= vol * 100)?.[1] || "";
    });

const BluetoothStatus = () => Widget.Overlay({
    class_name: "bluetooth",
    pass_through: true,
    visible: bluetooth.bind("enabled"),
    child: Widget.Label({
        class_name: "glyph",
        label: "",
    }),
});

const AudioStatus = () => Widget.Icon()
    .hook(audio.speaker, self => {
        const vol = audio.speaker.is_muted ? 0 : audio.speaker.volume;
        const cons = [[101, SPEAKER_OVERAMPLIFIED], [67, SPEAKER_HIGH], [34, SPEAKER_MEDIUM], [1, SPEAKER_LOW], [0, SPEAKER_MUTED]] as const;
        self.icon = cons.find(([n]) => n <= vol * 100)?.[1] || "";
    });

export default () => PanelButton({
    window: "quicksettings",
    on_clicked: () => print("hello"),
    on_scroll_up: () => audio.speaker.volume += 0.02,
    on_scroll_down: () => audio.speaker.volume -= 0.02,
    child: Widget.Box([
        BluetoothStatus(),
        AudioStatus(),
        MicrophoneStatus(),
    ]),
});
