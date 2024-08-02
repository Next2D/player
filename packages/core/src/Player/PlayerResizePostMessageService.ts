import type { ResizeMessageImpl } from "../interface/ResizeMessageImpl";
import { $player } from "../Player";
import { $rendererWorker } from "../CoreUtil";

/**
 * @description リサイズメッセージ
 *              Resize message
 *
 * @type {ResizeMessageImpl}
 * @private
 */
const message: ResizeMessageImpl = {
    "command": "resize",
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
 * @description 画面リサイズ情報をworkerに送る
 *              Send screen resize information to worker
 *
 * @return {void}
 * @method
 * @protected
 */
export const execute = (): void =>
{
    // postMessage
    message.buffer = new Float32Array([
        $player.rendererScale,
        $player.rendererWidth,
        $player.rendererHeight,
        $player.stageWidth,
        $player.stageHeight,
        $player.fullScreen ? 1 : 0
    ]);

    options[0] = message.buffer.buffer;

    $rendererWorker.postMessage(message, options);
};