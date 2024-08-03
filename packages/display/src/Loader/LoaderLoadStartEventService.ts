import type { LoaderInfo } from "../LoaderInfo";
import {
    Event,
    ProgressEvent as Next2DProgressEvent
} from "@next2d/events";

/**
 * @description 外部JSONの読み込みが開始イベントの実行関数
 *              Execution function of the external JSON loading start event
 *
 * @param  {LoaderInfo} loader_info
 * @param  {ProgressEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (loader_info: LoaderInfo, event: ProgressEvent): void =>
{
    if (loader_info.willTrigger(Event.OPEN)) {
        loader_info.dispatchEvent(new Event(Event.OPEN));
    }

    if (loader_info.willTrigger(Next2DProgressEvent.PROGRESS)) {
        loader_info.dispatchEvent(new Next2DProgressEvent(
            Next2DProgressEvent.PROGRESS, false,
            event.loaded, event.total
        ));
    }
};