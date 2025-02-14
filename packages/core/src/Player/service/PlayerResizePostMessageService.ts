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
 * @param  {boolean} [cache_clear=true]
 * @return {void}
 * @method
 * @protected
 */
export const execute = (cache_clear: boolean = true): void =>
{
    // postMessage
    message.buffer = new Float32Array([
        $player.rendererWidth,
        $player.rendererHeight,
        cache_clear ? 1 : 0
    ]);

    options[0] = message.buffer.buffer;

    $rendererWorker.postMessage(message, options);
};