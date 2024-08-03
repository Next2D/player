import type { AnimationToolDataImpl } from "../../interface/AnimationToolDataImpl";
import type { AnimationToolDataZlibImpl } from "../../interface/AnimationToolDataZlibImpl";
import type { Loader } from "../../Loader";
import { execute as loaderBuildService } from "./LoaderBuildService";

// @ts-ignore
import ZlibInflateWorker from "../worker/ZlibInflateWorker?worker&inline";

/**
 * @type {Worker}
 * @private
 */
const worker: Worker = new ZlibInflateWorker();

/**
 * @description JSONオブジェクトがzlib圧縮されている場合はworkerで解凍、無圧縮ならビルド処理を実行
 *              If the JSON object is zlib compressed, decompress it with a worker, otherwise execute the build process
 *
 * @param  {Loader} loader
 * @param  {object} object
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (loader: Loader, object: AnimationToolDataImpl | AnimationToolDataZlibImpl): Promise<void> =>
{
    if (object.type === "zlib") {
        await new Promise<void>((resolve): void =>
        {
            worker.onmessage = async (event: MessageEvent): Promise<void> =>
            {
                await loaderBuildService(loader, event.data as AnimationToolDataImpl);
                resolve();
            };

            const buffer: Uint8Array = new Uint8Array(object.buffer);
            worker.postMessage(buffer, [buffer.buffer]);
        });
    } else {
        await loaderBuildService(loader, object as AnimationToolDataImpl);
    }
};