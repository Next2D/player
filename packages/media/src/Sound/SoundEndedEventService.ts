import type { Sound } from "../Sound";
import { Event } from "@next2d/events";

/**
 * @description サウンドデータの再生終了時のイベント実行関数
 *              Event execution function when sound data playback ends
 *
 * @param  {Sound} sound
 * @return {void}
 * @method
 * @public
 */
export const execute = (sound: Sound): void =>
{
    if (sound.canLoop) {

        sound.play();

    } else {

        sound.stop();

        if (sound.willTrigger(Event.SOUND_COMPLETE)) {
            sound.dispatchEvent(new Event(Event.SOUND_COMPLETE));
        }
    }
};