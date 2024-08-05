import type { IMedia } from "./interface/IMedia";
import {
    Sound,
    SoundMixer,
    SoundTransform,
    Video
} from "@next2d/media";

const media: IMedia = {
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