import type { IRemoveCacheMessage } from "../../interface/IRemoveCacheMessage";
import { stage } from "@next2d/display";
import { $rendererWorker } from "../../RendererWorker";

/**
 * @description リサイズメッセージ
 *              Resize message
 *
 * @type {object}
 * @private
 */
const message: IRemoveCacheMessage = {
    "command": "removeClear",
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
 * @description worker側のキャッシュキーを削除する
 *              Remove the cache key on the worker side
 *
 * @return {void}
 * @method
 * @protected
 */
export const execute = (): void =>
{
    const buffer = new Float32Array(stage.$remoceCacheKeys);
    stage.$remoceCacheKeys.length = 0;

    message.buffer = buffer;
    options[0] = buffer.buffer;

    // postMessage
    $rendererWorker.postMessage(message, options);
};