import type { Video } from "../../Video";
import { Event } from "@next2d/events";

/**
 * @description 再生可能処理
 *              Playable processing
 *
 * @param  {Video} video
 * @return {Promise}
 * @method
 * @protected
 */
export const execute = async (video: Video,): Promise<void> =>
{
    if (video.autoPlay) {
        await video.play();
    }

    video._$changed();

    if (video.willTrigger(Event.COMPLETE)) {
        video.dispatchEvent(new Event(Event.COMPLETE));
    }
};