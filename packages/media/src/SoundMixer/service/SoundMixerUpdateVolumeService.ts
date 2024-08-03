import type { Sound } from "../../Sound";
import type { Video } from "../../Video";
import {
    $clamp,
    $setVolume,
    $getSounds,
    $getVideos
} from "../../MediaUtil";

/**
 * @description 再生中のサウンドとビデオの全ての音量を更新
 *              Updates the volume of all playing sounds and videos.
 *
 * @param {number} volume
 * @method
 * @public
 */
export const execute = (volume: number): void =>
{
    volume = $clamp(volume, 0, 1, 1);

    // update volume
    $setVolume(volume);

    const sounds: Sound[] = $getSounds();
    for (let idx: number = 0; idx < sounds.length; ++idx) {

        const sound: Sound = sounds[idx];
        if (!sound) {
            continue;
        }

        sound.volume = volume;
    }

    const videos: Video[] = $getVideos();
    for (let idx: number = 0; idx < videos.length; ++idx) {

        const video: Video = videos[idx];
        if (!video) {
            continue;
        }

        video.volume = volume;
    }
};