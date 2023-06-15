import { Sound } from "../player/next2d/media/Sound";
import { SoundMixer } from "../player/next2d/media/SoundMixer";
import { SoundTransform } from "../player/next2d/media/SoundTransform";
import { Video } from "../player/next2d/media/Video";

export interface MediaImpl {
    Sound: typeof Sound;
    SoundMixer: typeof SoundMixer;
    SoundTransform: typeof SoundTransform;
    Video: typeof Video;
}