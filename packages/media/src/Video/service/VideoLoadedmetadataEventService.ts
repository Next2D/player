import type { Video } from "../../Video";

/**
 * @description Videoオブジェクトの幅と高さを更新する
 *              Update the width and height of the Video object
 *
 * @param  {HTMLVideoElement} element
 * @param  {Video} video
 * @return {void}
 * @method
 * @protected
 */
export const execute = (
    element: HTMLVideoElement,
    video: Video
): void => {

    // update metadata
    video.currentTime = 0;
    video.duration    = element.duration;
    video.videoWidth  = element.videoWidth;
    video.videoHeight = element.videoHeight;

    // reset
    const offscreenCanvas = new OffscreenCanvas(video.videoWidth, video.videoHeight);
    video.$context = offscreenCanvas.getContext("2d");
    video.$offscreenCanvas = offscreenCanvas;
};