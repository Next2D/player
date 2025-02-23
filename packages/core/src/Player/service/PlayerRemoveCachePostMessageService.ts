import type { IRemoveCacheMessage } from "../../interface/IRemoveCacheMessage";
import { $cacheStore } from "@next2d/cache";
import { $rendererWorker } from "../../RendererWorker";

/**
 * @description リサイズメッセージ
 *              Resize message
 *
 * @type {object}
 * @private
 */
const message: IRemoveCacheMessage = {
    "command": "removeCache",
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
    const buffer = new Float32Array($cacheStore.$removeIds);
    $cacheStore.$removeIds.length = 0;

    message.buffer = buffer;
    options[0] = buffer.buffer;

    // postMessage
    $rendererWorker.postMessage(message, options);
};