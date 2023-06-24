import { Sound } from "../next2d/media/Sound";
import { SoundMixer } from "../next2d/media/SoundMixer";
import { SoundTransform } from "../next2d/media/SoundTransform";
import { Video } from "../next2d/media/Video";
import type { MediaImpl } from "../interface/MediaImpl";

const media: MediaImpl = {
    Sound,
    SoundMixer,
    SoundTransform,
    Video
};

Object.entries(media).forEach(([key, MediaClass]) =>
{
    Object.defineProperty(media, key, {
        get()
        {
            return MediaClass;
        }
    });
});

export { media };