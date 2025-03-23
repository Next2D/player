import type { LoaderInfo } from "../../LoaderInfo";
import { ProgressEvent as Next2DProgressEvent } from "@next2d/events";

/**
 * @description 外部JSONのローディング中のイベント実行関数
 *              Execution function of the external JSON loading event
 *
 * @param  {Sound} loader_info
 * @param  {ProgressEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (loader_info: LoaderInfo, event: ProgressEvent): void =>
{
    if (loader_info.willTrigger(Next2DProgressEvent.PROGRESS)) {
        loader_info.dispatchEvent(new Next2DProgressEvent(
            Next2DProgressEvent.PROGRESS, false,
            event.loaded, event.total
        ));
    }
};