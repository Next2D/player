import type { MovieClip } from "../../MovieClip";
import { $actions } from "../../DisplayObjectUtil";

/**
 * @description MovieClipのアクションを配列にセット
 *              Set the action of MovieClip to an array
 *
 * @param  {MovieClip} movie_clip
 * @param  {Map} [actions=null]
 * @return {void}
 * @method
 * @protected
 */
export const execute = (movie_clip: MovieClip, actions: Map<number, Function[]> | null = null): void =>
{
    if (!actions || !actions.size) {
        return ;
    }

    const frame = movie_clip.currentFrame;
    if (!actions.has(frame)) {
        return ;
    }

    $actions.push(movie_clip);
};