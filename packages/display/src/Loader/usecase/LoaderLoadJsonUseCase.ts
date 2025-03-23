import type { IAnimationToolData } from "../../interface/IAnimationToolData";
import type { IAnimationToolDataZlib } from "../../interface/IAnimationToolDataZlib";
import type { Loader } from "../../Loader";
import { execute as loaderBuildService } from "../service/LoaderBuildService";
import { $unzipWorker } from "../worker/UnzipWorker";

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
export const execute = async (loader: Loader, object: IAnimationToolData | IAnimationToolDataZlib): Promise<void> =>
{
    if (object.type === "zlib") {
        await new Promise<void>((resolve): void =>
        {
            $unzipWorker.onmessage = (event: MessageEvent): void =>
            {
                loaderBuildService(loader, event.data as IAnimationToolData);
                resolve();
            };

            const buffer: Uint8Array = new Uint8Array(object.buffer);
            $unzipWorker.postMessage(buffer, [buffer.buffer]);
        });
    } else {
        loaderBuildService(loader, object);
    }
};