import type { Video } from "../../Video";
import { $getPlayingVideos } from "../../MediaUtil";
import { VideoEvent } from "@next2d/events";
import { execute as videoApplyChangesService } from "../service/VideoApplyChangesService";

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

    videoApplyChangesService(video);

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