import type { MediaImpl } from "./interface/MediaImpl";
import {
    Sound,
    SoundMixer,
    SoundTransform,
    Video
} from "@next2d/media";

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