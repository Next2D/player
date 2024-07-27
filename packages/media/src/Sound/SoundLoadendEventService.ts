import type { Sound } from "../Sound";
import { execute as soundDecodeService } from "./SoundDecodeService";
import {
    Event,
    ProgressEvent as Next2DProgressEvent,
    IOErrorEvent
} from "@next2d/events";

/**
 * @description サウンドデータのローディング中のイベント実行関数
 *              Event execution function during sound data loading
 *
 * @param  {Sound} sound
 * @param  {ProgressEvent} event
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (sound: Sound, event: ProgressEvent): Promise<AudioBuffer | void> =>
{
    const target = event.target as XMLHttpRequest;
    if (!target) {
        return ;
    }

    if (sound.willTrigger(Next2DProgressEvent.PROGRESS)) {
        sound.dispatchEvent(new Next2DProgressEvent(
            Next2DProgressEvent.PROGRESS, false, false,
            event.loaded, event.total
        ));
    }

    if (199 < target.status && 400 > target.status) {
        const audioBuffer = await soundDecodeService(target.response);
        if (audioBuffer) {
            sound.audioBuffer = audioBuffer;
            if (sound.willTrigger(Event.COMPLETE)) {
                sound.dispatchEvent(new Event(Event.COMPLETE));
            }
        }
    } else {
        if (sound.willTrigger(IOErrorEvent.IO_ERROR)) {
            sound.dispatchEvent(new IOErrorEvent(
                IOErrorEvent.IO_ERROR, false, false, target.statusText
            ));
        }
    }
};