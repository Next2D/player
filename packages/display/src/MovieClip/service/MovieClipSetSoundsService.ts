import type { MovieClip } from "../../MovieClip";
import type { Sound } from "@next2d/media";
import { $sounds } from "../../DisplayObjectUtil";

/**
 * @description MovieClipのサウンドを配列にセット
 *              Set the sound of MovieClip to an array
 *
 * @param  {MovieClip} movie_clip
 * @param  {Map} [sounds=null]
 * @return {void}
 * @method
 * @protected
 */
export const execute = (movie_clip: MovieClip, sounds: Map<number, Sound[]> | null = null): void =>
{
    if (!sounds || !sounds.size) {
        return ;
    }

    const frame = movie_clip.currentFrame;
    if (!sounds.has(frame)) {
        return ;
    }

    $sounds.push(movie_clip);
};