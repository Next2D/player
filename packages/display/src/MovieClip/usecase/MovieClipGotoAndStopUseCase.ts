import type { MovieClip } from "../../MovieClip";
import { execute as movieClipGoToFrameUseCase } from "./MovieClipGoToFrameUseCase";

/**
 * @description 指定フレームに移動して停止する
 *              Move to the specified frame and stop
 *
 * @param  {MovieClip} movie_clip
 * @param  {string | number} frame
 * @return {void}
 * @method
 * @protected
 */
export const execute = (movie_clip: MovieClip, frame: string | number): void =>
{
    movie_clip.stop();
    movieClipGoToFrameUseCase(movie_clip, frame);
    movie_clip.$wait = false;
};