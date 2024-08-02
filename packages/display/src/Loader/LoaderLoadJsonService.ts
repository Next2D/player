import type { NoCodeDataImpl } from "../interface/NoCodeDataImpl";
import type { NoCodeDataZlibImpl } from "../interface/NoCodeDataZlibImpl";
import type { LoaderInfo } from "../LoaderInfo";
import { execute as loaderBuildService } from "./LoaderBuildService";

// @ts-ignore
import ZlibInflateWorker from "./ZlibInflateWorker?worker&inline";

/**
 * @type {Worker}
 * @private
 */
const worker: Worker = new ZlibInflateWorker();

/**
 * @description JSONオブジェクトがzlib圧縮されている場合はworkerで解凍、無圧縮ならビルド処理を実行
 *              If the JSON object is zlib compressed, decompress it with a worker, otherwise execute the build process
 *
 * @param  {LoaderInfo} loader_info
 * @param  {object} object
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (loader_info: LoaderInfo, object: NoCodeDataImpl | NoCodeDataZlibImpl): Promise<void> =>
{
    if (object.type === "zlib") {
        await new Promise<void>((resolve): void =>
        {
            worker.onmessage = async (event: MessageEvent): Promise<void> =>
            {
                await loaderBuildService(loader_info, event.data as NoCodeDataImpl);
                resolve();
            };

            const buffer: Uint8Array = new Uint8Array(object.buffer);
            worker.postMessage(buffer, [buffer.buffer]);
        });
    } else {
        await loaderBuildService(loader_info, object as NoCodeDataImpl);
    }
};