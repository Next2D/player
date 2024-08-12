import type { IResizeMessage } from "../../interface/IResizeMessage";
import { $player } from "../../Player";
import { $rendererWorker } from "../../RendererWorker";

/**
 * @description リサイズメッセージ
 *              Resize message
 *
 * @type {object}
 * @private
 */
const message: IResizeMessage = {
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
        $player.rendererWidth,
        $player.rendererHeight
    ]);

    options[0] = message.buffer.buffer;

    $rendererWorker.postMessage(message, options);
};