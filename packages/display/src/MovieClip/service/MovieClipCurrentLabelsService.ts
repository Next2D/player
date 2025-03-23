
import type { FrameLabel } from "../../FrameLabel";
import type { MovieClip } from "../../MovieClip";

/**
 * @description 指定のMovieClipのフレームラベルを全て返却、なければnullを返却
 *              Returns all frame labels of the specified MovieClip, otherwise returns null.
 *
 * @param {MovieClip} movei_clip
 * @return {FrameLabel[] | null}
 * @method
 * @protected
 */
export const execute = (movei_clip: MovieClip): FrameLabel[] | null =>
{
    return !movei_clip.$labels || !movei_clip.$labels.size
        ? null
        : Array.from(movei_clip.$labels.values());
};