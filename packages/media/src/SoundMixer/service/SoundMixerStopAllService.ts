import type { Sound } from "../../Sound";
import type { Video } from "../../Video";
import {
    $getPlayingSounds,
    $getPlayingVideos
} from "../../MediaUtil";

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
    const playingSounds: Sound[] = $getPlayingSounds();
    for (let idx: number = 0; idx < playingSounds.length; ++idx) {
        const sound = playingSounds[idx];
        if (!sound) {
            continue;
        }
        sound.stop();
    }

    // videos
    const playingVideos: Video[] = $getPlayingVideos();
    for (let idx: number = 0; idx < playingVideos.length; ++idx) {
        const video: Video = playingVideos[idx];
        if (!video) {
            continue;
        }
        video.pause();
    }

    // reset
    playingSounds.length = 0;
    playingVideos.length = 0;
};