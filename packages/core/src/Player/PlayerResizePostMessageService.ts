import type { Player } from "../Player";
import type { ResizeMessageImpl } from "../interface/ResizeMessageImpl";
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
 * @param  {Player} player
 * @return {void}
 * @method
 * @protected
 */
export const execute = (player: Player): void =>
{
    // postMessage
    message.buffer = new Float32Array([
        player.rendererScale,
        player.rendererWidth,
        player.rendererHeight
    ]);

    options[0] = message.buffer.buffer;

    $rendererWorker.postMessage(message, options);
};