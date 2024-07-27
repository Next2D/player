import type { Sound } from "../Sound";
import {
    Event,
    ProgressEvent as Next2DProgressEvent
} from "@next2d/events";

/**
 * @description サウンドの読み込みが開始イベントの実行関数
 *              Execution function of the sound loading start event
 *
 * @param  {Sound} sound
 * @param  {ProgressEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (sound: Sound, event: ProgressEvent): void =>
{
    if (sound.willTrigger(Event.OPEN)) {
        sound.dispatchEvent(new Event(Event.OPEN));
    }

    if (sound.willTrigger(Next2DProgressEvent.PROGRESS)) {
        sound.dispatchEvent(new Next2DProgressEvent(
            Next2DProgressEvent.PROGRESS, false, false,
            event.loaded, event.total
        ));
    }
};