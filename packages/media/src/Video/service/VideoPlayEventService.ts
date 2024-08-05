import type { Video } from "../../Video";
import { $getPlayingVideos } from "../../MediaUtil";
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
    if (video.willTrigger(VideoEvent.PLAY)) {
        video.dispatchEvent(new VideoEvent(VideoEvent.PLAY));
    }

    video._$changed();

    const playingVideos = $getPlayingVideos();
    const index = playingVideos.indexOf(video);
    if (index > -1) {
        playingVideos.splice(index, 1);
    }

    playingVideos.push(video);

    return requestAnimationFrame(() =>
    {
        execute(video);
    });
};