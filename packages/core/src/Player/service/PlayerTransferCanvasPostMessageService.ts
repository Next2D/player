
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
    "bgColor": 0xffffff,
    "bgAlpha": 0,
    "width": 0,
    "height": 0,
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
 * @param  {HTMLCanvasElement} transferred_canvas
 * @param  {number} [bg_color=0xffffff]
 * @param  {number} [bg_alpha=0]
 * @return {Promise<HTMLCanvasElement>}
 * @method
 * @protected
 */
export const execute = async <D extends DisplayObject> (
    display_object: D,
    matrix: Float32Array,
    color_transform: Float32Array,
    transferred_canvas: HTMLCanvasElement,
    bg_color: number = 0xffffff,
    bg_alpha: number = 0
): Promise<HTMLCanvasElement> => {

    return await new Promise<HTMLCanvasElement>((resolve): void =>
    {
        renderQueue.offset   = 0;
        $options.length      = 0;
        $imageBitmaps.length = 0;

        stage.$generateRenderQueue(
            display_object, $imageBitmaps, matrix, color_transform
        );

        if (!renderQueue.offset) {
            return resolve(transferred_canvas);
        }

        // update buffer
        $message.buffer  = renderQueue.buffer;
        $message.width   = transferred_canvas.width;
        $message.height  = transferred_canvas.height;
        $message.bgColor = bg_color;
        $message.bgAlpha = bg_alpha;
        $message.length  = renderQueue.offset;
        $options.push(renderQueue.buffer.buffer);

        // postMessage
        $message.imageBitmaps = null;
        if ($imageBitmaps.length) {
            $message.imageBitmaps = $imageBitmaps;
            $options.push(...$imageBitmaps);
        }

        const drawCanvas = (event: MessageEvent): void =>
        {
            if (event.data.message !== "capture") {
                return ;
            }

            const buffer = event.data.buffer;
            if (renderQueue.buffer.length < buffer.length) {
                renderQueue.buffer = buffer;
            }

            const context = transferred_canvas.getContext("2d") as CanvasRenderingContext2D;
            context.drawImage(event.data.imageBitmap, 0, 0);

            $rendererWorker.removeEventListener("message", drawCanvas);
            return resolve(transferred_canvas);
        };

        $rendererWorker.addEventListener("message", drawCanvas);
        $rendererWorker.postMessage($message, $options);
    });
};