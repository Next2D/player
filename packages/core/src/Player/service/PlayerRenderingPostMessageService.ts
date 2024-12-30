
import type { IRenderMessage } from "../../interface/IRenderMessage";
import { $rendererWorker } from "../../RendererWorker";
import { $player } from "../../Player";
import { stage } from "@next2d/display";
import { renderQueue } from "@next2d/render-queue";

/**
 * @type {array}
 * @private
 */
const $bitmaps: Array<Promise<ImageBitmap>> = [];

/**
 * @type {Float32Array}
 * @private
 */
const $matrix: Float32Array = new Float32Array([1, 0, 0, 1, 0, 0]);

/**
 * @description リサイズメッセージ
 *              Resize message
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
    const scale = $player.rendererScale;

    $matrix[0] = $matrix[3] = scale;
    $matrix[4] = ($player.rendererWidth  - stage.stageWidth * scale) / 2;
    $matrix[5] = ($player.rendererHeight - stage.stageHeight * scale) / 2;

    renderQueue.offset = 0;
    $options.length    = 0;
    $bitmaps.length    = 0;
    stage.$generateRenderQueue($bitmaps, $matrix);

    if (!renderQueue.offset) {
        return ;
    }

    // update buffer
    $message.buffer = renderQueue.buffer;
    $message.length = renderQueue.offset;
    $options.push(renderQueue.buffer.buffer);

    // postMessage
    $message.imageBitmaps = null;
    if ($bitmaps.length) {
        Promise
            .all($bitmaps)
            .then((bitmaps: ImageBitmap[]): void =>
            {
                $message.imageBitmaps = bitmaps;
                $options.push(...bitmaps);
                $rendererWorker.postMessage($message, $options);
            });
    } else {
        $rendererWorker.postMessage($message, $options);
    }
};