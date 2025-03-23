import type {
    Sound,
    SoundMixer,
    SoundTransform,
    Video
} from "@next2d/media";

export interface IMedia {
    Sound: typeof Sound;
    SoundMixer: typeof SoundMixer;
    SoundTransform: typeof SoundTransform;
    Video: typeof Video;
}