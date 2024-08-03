import type { Sound } from "../Sound";
import { ProgressEvent as Next2DProgressEvent } from "@next2d/events";

/**
 * @description サウンドデータのローディング中のイベント実行関数
 *              Event execution function during sound data loading
 *
 * @param  {Sound} sound
 * @param  {ProgressEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (sound: Sound, event: ProgressEvent): void =>
{
    if (sound.willTrigger(Next2DProgressEvent.PROGRESS)) {
        sound.dispatchEvent(new Next2DProgressEvent(
            Next2DProgressEvent.PROGRESS, false,
            event.loaded, event.total
        ));
    }
};