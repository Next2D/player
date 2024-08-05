import type { Video } from "../../Video";
import { Event } from "@next2d/events";

/**
 * @description 再生可能処理
 *              Playable processing
 *
 * @param  {Video} video
 * @param  {HTMLVideoElement} element
 * @return {Promise}
 * @method
 * @protected
 */
export const execute = async (
    video: Video,
    element: HTMLVideoElement
): Promise<void> => {

    if (video.autoPlay) {

        await video.play();

    } else {
        await element.play();
        element.pause();
        element.currentTime = 0;
    }

    video._$changed();

    if (video.willTrigger(Event.COMPLETE)) {
        video.dispatchEvent(new Event(Event.COMPLETE));
    }
};