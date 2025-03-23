import type { MovieClip } from "../../MovieClip";
import { execute as movieClipGoToFrameUseCase } from "./MovieClipGoToFrameUseCase";

/**
 * @description 次のフレームに移動して停止する
 *              Move to the next frame and stop
 *
 * @param  {MovieClip} movie_clip
 * @return {void}
 * @method
 * @protected
 */
export const execute = (movie_clip: MovieClip): void =>
{
    if (movie_clip.totalFrames <= movie_clip.currentFrame) {
        return ;
    }

    movie_clip.stop();
    movieClipGoToFrameUseCase(movie_clip, movie_clip.currentFrame + 1);
};