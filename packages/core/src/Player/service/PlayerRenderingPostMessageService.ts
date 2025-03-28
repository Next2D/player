
import type { IRenderMessage } from "../../interface/IRenderMessage";
import { $rendererWorker } from "../../RendererWorker";
import { stage } from "@next2d/display";
import { renderQueue } from "@next2d/render-queue";
import { $renderMatrix } from "../../CoreUtil";

/**
 * @type {Float32Array}
 * @private
 */
export const $COLOR_ARRAY_IDENTITY: Float32Array = new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);

/**
 * @type {ImageBitmap[]}
 * @private
 */
const $imageBitmaps: ImageBitmap[] = [];

/**
 * @description レンダリングメッセージ
 *              Rendering message
 *
 * @type {object}
 * @private
 */
const $message: IRenderMessage = {
    "command": "render",
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

// 受け取りイベントを登録
$rendererWorker.addEventListener("message", (event: MessageEvent): void =>
{
    if (event.data.message !== "render") {
        return ;
    }

    const buffer = event.data.buffer;
    if (renderQueue.buffer.length > buffer.length) {
        return ;
    }

    renderQueue.buffer = buffer;
});

/**
 * @description レンダリングデータを生成してworkerに送る
 *              Generate rendering data and send it to the worker
 *
 * @return {void}
 * @method
 * @protected
 */
export const execute = (): void =>
{
    renderQueue.offset   = 0;
    $options.length      = 0;
    $imageBitmaps.length = 0;
    stage.$generateRenderQueue(
        stage, $imageBitmaps, $renderMatrix, $COLOR_ARRAY_IDENTITY
    );

    if (!renderQueue.offset) {
        return ;
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
};