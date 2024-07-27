import type { Sound } from "../Sound";
import type { Video } from "../Video";
import {
    $getSounds,
    $getVideos
} from "../MediaUtil";

/**
 * @description 再生中のサウンドとビデオの全ての再生を停止
 *              Stops all playing sounds and videos.
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    // sounds
    const sounds: Sound[] = $getSounds();
    for (let idx: number = 0; idx < sounds.length; ++idx) {
        const sound = sounds[idx];
        if (!sound) {
            continue;
        }
        sound.stop();
    }

    // videos
    const videos: Video[] = $getVideos();
    for (let idx: number = 0; idx < videos.length; ++idx) {
        const video: Video = videos[idx];
        if (!video) {
            continue;
        }
        video.pause();
    }

    // reset
    sounds.length = 0;
    videos.length = 0;
};