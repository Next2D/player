import type { Sound } from "../../Sound";
import type { Video } from "../../Video";
import {
    $setVolume,
    $getPlayingSounds,
    $getPlayingVideos
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
    // update volume
    $setVolume(volume);

    const playingSounds: Sound[] = $getPlayingSounds();
    for (let idx: number = 0; idx < playingSounds.length; ++idx) {

        const sound: Sound = playingSounds[idx];
        if (!sound) {
            continue;
        }

        sound.volume = volume;
    }

    const playingVideos: Video[] = $getPlayingVideos();
    for (let idx: number = 0; idx < playingVideos.length; ++idx) {

        const video: Video = playingVideos[idx];
        if (!video) {
            continue;
        }

        video.volume = volume;
    }
};