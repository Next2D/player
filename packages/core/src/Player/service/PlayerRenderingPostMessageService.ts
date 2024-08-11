
import type { IResizeMessage } from "../../interface/IResizeMessage";
import { $rendererWorker } from "../../RendererWorker";
import { $player } from "../../Player";
import { $stage } from "@next2d/display";

/**
 * @type {array}
 * @private
 */
const $renderQueue: number[] = [];

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
const message: IResizeMessage = {
    "command": "render",
    "buffer": null
};

/**
 * @description Transferableオブジェクト
 *              Transferable object
 *
 * @type {Transferable[]}
 * @private
 */
const options: Transferable[] = [];

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
    $matrix[4] = ($player.rendererWidth - $stage.stageWidth * scale) / 2;
    $matrix[5] = ($player.rendererHeight - $stage.stageHeight * scale) / 2;

    $stage._$generateRenderQueue($renderQueue, $matrix);

    console.log($renderQueue.slice(0));
    const buffer = new Float32Array($renderQueue);

    message.buffer = buffer;
    options[0]     = buffer.buffer;

    // postMessage
    $rendererWorker.postMessage({
        "command": "render",
        "buffer": buffer
    }, options);

    $renderQueue.length = 0;
};