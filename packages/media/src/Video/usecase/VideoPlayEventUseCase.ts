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
    if (video.paused || !video.loaded) {
        return 0;
    }

    if (video.willTrigger(VideoEvent.PLAY)) {
        video.dispatchEvent(new VideoEvent(VideoEvent.PLAY));
    }

    videoApplyChangesService(video);

    const playingVideos = $getPlayingVideos();
    if (playingVideos.indexOf(video) === -1) {
        playingVideos.push(video);
    }

    if (video.$context && video.$videoElement) {
        video.$context.drawImage(video.$videoElement,
            0, 0, video.videoWidth, video.videoHeight
        );
    }

    return requestAnimationFrame((): void =>
    {
        execute(video);
    });
};