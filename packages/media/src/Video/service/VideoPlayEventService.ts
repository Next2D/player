import type { Video } from "../../Video";
import { VideoEvent } from "@next2d/events";

/**
 * @description ビデオ再生中のイベント処理関数
 *              Event processing function during video playback
 *
 * @param  {Video} video
 * @return {void}
 * @method
 * @protected
 */
export const execute = (video: Video): number =>
{
    if (!video.stage) {
        video.pause();
        return -1;
    }

    if (video.willTrigger(VideoEvent.PLAY)) {
        video.dispatchEvent(new VideoEvent(VideoEvent.PLAY));
    }

    video._$doChanged();

    return requestAnimationFrame(() =>
    {
        execute(video);
    });
};