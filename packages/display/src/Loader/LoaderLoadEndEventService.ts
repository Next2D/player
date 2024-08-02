import type { LoaderInfo } from "../LoaderInfo";
import { $headerStringToArray } from "../DisplayObjectUtil";
import { execute as loaderLoadJsonService } from "./LoaderLoadJsonService";
import {
    ProgressEvent as Next2DProgressEvent,
    IOErrorEvent,
    HTTPStatusEvent
} from "@next2d/events";

/**
 * @description 外部JSONのローディング完了イベントの実行関数
 *              Execution function for external JSON loading completion event
 *
 * @param  {LoaderInfo} loader_info
 * @param  {ProgressEvent} event
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (loader_info: LoaderInfo, event: ProgressEvent): Promise<void> =>
{
    const target = event.target as XMLHttpRequest;
    if (!target) {
        return ;
    }

    if (loader_info.willTrigger(Next2DProgressEvent.PROGRESS)) {
        loader_info.dispatchEvent(new Next2DProgressEvent(
            Next2DProgressEvent.PROGRESS, false, false,
            event.loaded, event.total
        ));
    }

    // http status event
    if (loader_info.willTrigger(HTTPStatusEvent.HTTP_STATUS)) {

        const responseHeaders = $headerStringToArray(
            target.getAllResponseHeaders()
        );

        loader_info.dispatchEvent(new HTTPStatusEvent(
            HTTPStatusEvent.HTTP_STATUS, false, false,
            target.status, target.responseURL,
            responseHeaders
        ));
    }

    if (199 < target.status && 400 > target.status) {
        await loaderLoadJsonService(loader_info, target.response);
    } else {
        if (loader_info.willTrigger(IOErrorEvent.IO_ERROR)) {
            loader_info.dispatchEvent(new IOErrorEvent(
                IOErrorEvent.IO_ERROR, false, false, target.statusText
            ));
        }
    }
};