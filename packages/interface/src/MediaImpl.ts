import { Sound } from "../../media/src/Sound";
import { SoundMixer } from "../../media/src/SoundMixer";
import { SoundTransform } from "../../media/src/SoundTransform";
import { Video } from "../../media/src/Video";

export interface MediaImpl {
    Sound: typeof Sound;
    SoundMixer: typeof SoundMixer;
    SoundTransform: typeof SoundTransform;
    Video: typeof Video;
}