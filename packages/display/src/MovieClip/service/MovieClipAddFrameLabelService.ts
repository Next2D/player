import type { FrameLabel } from "../../FrameLabel";
import type { MovieClip } from "../../MovieClip";

/**
 * @description ラベル情報をマップに追加
 *              Add label information to map
 *
 * @param  {MovieClip} movei_clip
 * @param  {FrameLabel} frame_label
 * @return {void}
 * @method
 * @protected
 */
export const execute = (movei_clip: MovieClip, frame_label: FrameLabel): void =>
{
    if (!movei_clip.$labels) {
        movei_clip.$labels = new Map();
    }
    movei_clip.$labels.set(frame_label.frame, frame_label);
};