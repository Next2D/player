import type { IBounds } from "../../interface/IBounds";
import type { Video } from "../../Video";

/**
 * @description Videoオブジェクトの幅と高さを更新する
 *              Update the width and height of the Video object
 *
 * @param  {HTMLVideoElement} element
 * @param  {Video} video
 * @param  {object} bounds
 * @return {void}
 * @method
 * @protected
 */
export const execute = (
    element: HTMLVideoElement,
    video: Video,
    bounds: IBounds
): void => {

    // update metadata
    video.currentTime = 0;
    video.duration    = element.duration;

    bounds.xMax = element.videoWidth;
    bounds.yMax = element.videoHeight;
};