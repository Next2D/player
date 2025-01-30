
import type { ICaptureMessage } from "../../interface/ICaptureMessage";
import type { DisplayObject } from "@next2d/display";
import { stage } from "@next2d/display";
import { renderQueue } from "@next2d/render-queue";
import { $rendererWorker } from "../../RendererWorker";

/**
 * @description キャプチャーメッセージ
 *              Capture message
 *
 * @type {object}
 * @private
 */
const $message: ICaptureMessage = {
    "command": "capture",
    "buffer": null,
    "length": 0,
    "imageBitmaps": null
};

/**
 * @description Transferableオブジェクト
 *              Transferable object
 *
 * @type {Transferable[]}
 * @private
 */
const $options: Transferable[] = [];

/**
 * @type {ImageBitmap[]}
 * @private
 */
const $imageBitmaps: ImageBitmap[] = [];

/**
 * @description レンダリングデータを生成してworkerに送る
 *              Generate rendering data and send it to the worker
 *
 * @param  {D} display_object
 * @param  {Float32Array} matrix
 * @param  {Float32Array} color_transform
 * @return {void}
 * @method
 * @protected
 */
export const execute = async <D extends DisplayObject> (
    display_object: D,
    matrix: Float32Array,
    color_transform: Float32Array,
    transferred_canvas: HTMLCanvasElement
): Promise<HTMLCanvasElement> => {

    renderQueue.offset   = 0;
    $options.length      = 0;
    $imageBitmaps.length = 0;

    stage.$generateRenderQueue(
        display_object, $imageBitmaps, matrix, color_transform
    );

    if (!renderQueue.offset) {
        return transferred_canvas;
    }

    // update buffer
    $message.buffer = renderQueue.buffer;
    $message.length = renderQueue.offset;
    $options.push(renderQueue.buffer.buffer);

    // postMessage
    $message.imageBitmaps = null;
    if ($imageBitmaps.length) {
        $message.imageBitmaps = $imageBitmaps;
        $options.push(...$imageBitmaps);
    }

    $rendererWorker.postMessage($message, $options);

    // canvasに描画
    await new Promise<void>((resolve): void =>
    {
        const drawCanvas = (event: MessageEvent): void =>
        {
            $rendererWorker.removeEventListener("message", drawCanvas);
            if (event.data.message !== "capture") {
                return ;
            }

            const buffer = event.data.buffer;
            if (renderQueue.buffer.length > buffer.length) {
                return ;
            }

            renderQueue.buffer = buffer;

            const context = transferred_canvas.getContext("2d") as CanvasRenderingContext2D;
            context.drawImage(event.data.imageBitmap, 0, 0,
                transferred_canvas.width, transferred_canvas.height
            );

            resolve();
        };

        $rendererWorker.addEventListener("message", drawCanvas);
    });

    return transferred_canvas;
};