import { Sound } from "../next2d/media/Sound";
import { SoundMixer } from "../next2d/media/SoundMixer";
import { SoundTransform } from "../next2d/media/SoundTransform";
import { Video } from "../next2d/media/Video";

export interface MediaImpl {
    Sound: typeof Sound;
    SoundMixer: typeof SoundMixer;
    SoundTransform: typeof SoundTransform;
    Video: typeof Video;
}