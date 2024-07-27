import type { Video } from "../Video";
import { VideoEvent } from "@next2d/events";

/**
 * @description ビデオが最終フレームに達したときの処理
 *              Processing when the video reaches the last frame
 *
 * @param  {Video} video
 * @return {void}
 * @method
 * @protected
 */
export const execute = (video: Video): void =>
{
    if (video.willTrigger(VideoEvent.PLAY_END)) {
        video.dispatchEvent(new VideoEvent(VideoEvent.PLAY_END));
    }

    if (video.loop) {
        video.currentTime = 0;
        return ;
    }

    video.pause();
};