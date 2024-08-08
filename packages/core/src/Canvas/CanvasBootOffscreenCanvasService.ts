import { $rendererWorker } from "../RendererWorker";

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
export const execute = (
    canvas: HTMLCanvasElement,
    ratio: number
): void => {

    const offscreenCanvas = canvas.transferControlToOffscreen();
    const buffer = new Float32Array([ratio]);

    // postMessage
    $rendererWorker.postMessage({
        "command": "initialize",
        "canvas": offscreenCanvas,
        "buffer": buffer
    }, [offscreenCanvas, buffer.buffer]);
};