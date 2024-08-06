/**
 * @description HTMLVideoElementを作成して、各種イベントを設定する
 *              Create an HTMLVideoElement and set various events
 *
 * @return {HTMLVideoElement}
 * @method
 * @protected
 */
export const execute = (): HTMLVideoElement =>
{
    const element = document.createElement("video");
    element.autoplay    = false;
    element.crossOrigin = "anonymous";

    // Required for iOS
    element.setAttribute("playsinline", "");

    return element;
};