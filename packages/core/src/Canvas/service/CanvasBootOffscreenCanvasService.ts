import { $rendererWorker } from "../../RendererWorker";

/**
 * @description OffscreenCanvasを起動
 *              Boot offscreen canvas
 *
 * @param  {HTMLCanvasElement} canvas
 * @param  {number} ratio
 * @return {void}
 * @method
 * @public
 */
export const execute = (canvas: HTMLCanvasElement): void =>
{
    const offscreenCanvas = canvas.transferControlToOffscreen();

    // postMessage
    $rendererWorker.postMessage({
        "command": "initialize",
        "canvas": offscreenCanvas
    }, [offscreenCanvas]);
};