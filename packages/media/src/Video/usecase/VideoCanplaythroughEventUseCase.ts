import type { Video } from "../../Video";
import { Event } from "@next2d/events";
import { execute as videoApplyChangesService } from "../service/VideoApplyChangesService";
import {
    $isAudioContext,
    $mutedVideos
} from "../../MediaUtil";

/**
 * @description 再生可能処理
 *              Playable processing
 *
 * @param  {Video} video
 * @return {Promise}
 * @method
 * @protected
 */
export const execute = async (video: Video): Promise<void> =>
{
    if (video.autoPlay) {
        if (!$isAudioContext()) {
            video.muted = true;
            $mutedVideos.push(video);
        }
        await video.play();
    }

    video.loaded = true;
    videoApplyChangesService(video);

    if (video.willTrigger(Event.COMPLETE)) {
        video.dispatchEvent(new Event(Event.COMPLETE));
    }
};