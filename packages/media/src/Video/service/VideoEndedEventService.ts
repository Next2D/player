import type { Video } from "../../Video";
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
    if (video.willTrigger(VideoEvent.ENDED)) {
        video.dispatchEvent(new VideoEvent(VideoEvent.ENDED));
    }

    if (video.loop) {
        video.currentTime = 0;
        return ;
    }

    video.ended   = true;
    video.changed = false;
    video.pause();
};