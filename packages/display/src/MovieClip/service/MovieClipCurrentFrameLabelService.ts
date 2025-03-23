
import type { FrameLabel } from "../../FrameLabel";
import type { MovieClip } from "../../MovieClip";

/**
 * @description 現在のフレームラベルがあれば返却、なければnullを返却
 *              Returns the current frame label if it exists, otherwise returns null.
 *
 * @param  {MovieClip} movei_clip
 * @return {FrameLabel | null}
 * @method
 * @protected
 */
export const execute = (movei_clip: MovieClip): FrameLabel | null =>
{
    if (!movei_clip.$labels) {
        return null;
    }

    const frame = movei_clip.currentFrame;
    if (!movei_clip.$labels.has(frame)) {
        return null;
    }

    return movei_clip.$labels.get(frame) || null;
};