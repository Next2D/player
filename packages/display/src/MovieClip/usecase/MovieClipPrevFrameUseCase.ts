import type { MovieClip } from "../../MovieClip";
import { execute as movieClipGoToFrameUseCase } from "./MovieClipGoToFrameUseCase";

/**
 * @description ムービークリップの再生を一つ前のフレームに移動させる
 *              Moves the playback of a movie clip to the previous frame.
 *
 * @param  {MovieClip} movie_clip
 * @return {void}
 * @method
 * @protected
 */
export const execute = (movie_clip: MovieClip): void =>
{
    if (2 > movie_clip.currentFrame) {
        return ;
    }

    movie_clip.stop();
    movieClipGoToFrameUseCase(movie_clip, movie_clip.currentFrame - 1);
};