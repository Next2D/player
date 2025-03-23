import type { Sound } from "@next2d/media";
import type { MovieClip } from "../../MovieClip";
import { $sounds } from "../../DisplayObjectUtil";

/**
 * @description フレームにセットされたサウンドを再生
 *              Play the sound set in the frame
 *
 * @return {void}
 * @method
 * @protected
 */
export const execute = (): void =>
{
    while ($sounds.length) {

        const movieClip = $sounds.pop() as MovieClip;
        const soundsMap = movieClip.$sounds;
        if (!soundsMap) {
            continue;
        }

        const frame = movieClip.currentFrame;
        if (!soundsMap.has(frame)) {
            continue;
        }

        const sounds = soundsMap.get(frame) as Sound[];
        const soundTransform = movieClip.soundTransform;

        for (let idx = 0; idx < sounds.length; idx++) {

            const sound = sounds[idx];
            if (!sound) {
                continue;
            }

            if (soundTransform) {
                sound.volume    = soundTransform.volume;
                sound.loopCount = soundTransform.loopCount;
            }

            sound.play();
        }
    }
};