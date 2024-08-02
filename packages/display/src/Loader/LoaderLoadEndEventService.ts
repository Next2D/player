import { Loader } from "../Loader";
import { $headerStringToArray } from "../DisplayObjectUtil";
import { execute as loaderLoadJsonService } from "./LoaderLoadJsonService";
import {
    Event,
    ProgressEvent as Next2DProgressEvent,
    IOErrorEvent,
    HTTPStatusEvent
} from "@next2d/events";

/**
 * @description 外部JSONのローディング完了イベントの実行関数
 *              Execution function for external JSON loading completion event
 *
 * @param  {Loader} loader
 * @param  {ProgressEvent} event
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (loader: Loader, event: ProgressEvent): Promise<void> =>
{
    const target = event.target as XMLHttpRequest;
    if (!target) {
        return ;
    }

    const loaderInfo = loader.contentLoaderInfo;
    if (loaderInfo.willTrigger(Next2DProgressEvent.PROGRESS)) {
        loaderInfo.dispatchEvent(new Next2DProgressEvent(
            Next2DProgressEvent.PROGRESS, false, false,
            event.loaded, event.total
        ));
    }

    // http status event
    if (loaderInfo.willTrigger(HTTPStatusEvent.HTTP_STATUS)) {

        const responseHeaders = $headerStringToArray(
            target.getAllResponseHeaders()
        );

        loaderInfo.dispatchEvent(new HTTPStatusEvent(
            HTTPStatusEvent.HTTP_STATUS, false, false,
            target.status, target.responseURL,
            responseHeaders
        ));
    }

    if (199 < target.status && 400 > target.status) {
        await loaderLoadJsonService(loader, target.response);

        if (loaderInfo.willTrigger(Event.COMPLETE)) {
            loaderInfo.dispatchEvent(new Event(Event.COMPLETE));
        }
    } else {
        if (loaderInfo.willTrigger(IOErrorEvent.IO_ERROR)) {
            loaderInfo.dispatchEvent(new IOErrorEvent(
                IOErrorEvent.IO_ERROR, false, false, target.statusText
            ));
        }
    }
};