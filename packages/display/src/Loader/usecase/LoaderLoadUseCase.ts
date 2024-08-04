import type { URLRequest } from "@next2d/net";
import type { Loader } from "../../Loader";
import { $ajax } from "../../DisplayObjectUtil";
import { execute as loaderLoadstartEventService } from "../service/LoaderLoadStartEventService";
import { execute as loaderProgressEventService } from "../service/LoaderProgressEventService";
import { execute as loaderLoadEndEventUseCase } from "../usecase/LoaderLoadEndEventUseCase";

/**
 * @description 外部JSONのローディングの実行関数
 *              Execution function of external JSON loading
 * 
 * @see Loader.load
 * @param {Loader} loader 
 * @param {URLRequest} request
 * @return {Promise}
 * @method
 * @protected
 */
export const execute = async (loader: Loader, request: URLRequest): Promise<void> =>
{
    await new Promise<void>((resolve): void =>
    {
        $ajax({
            "format": request.responseDataFormat,
            "url": request.url,
            "method": request.method,
            "data": request.data,
            "headers": request.headers,
            "withCredentials": request.withCredentials,
            "event": {
                "loadstart": (event: ProgressEvent): void =>
                {
                    loaderLoadstartEventService(loader.contentLoaderInfo, event);
                },
                "progress": (event: ProgressEvent): void =>
                {
                    loaderProgressEventService(loader.contentLoaderInfo, event);
                },
                "loadend": async (event: ProgressEvent): Promise<void> =>
                {
                    await loaderLoadEndEventUseCase(loader, event);
                    resolve();
                }
            }
        });
    });
};