import type { MovieClip } from "../../MovieClip";
import { execute as movieClipGoToFrameUseCase } from "./MovieClipGoToFrameUseCase";

/**
 * @description 指定フレームに移動して再生する
 *              Move to the specified frame and play
 *
 * @param  {MovieClip} movie_clip
 * @param  {string | number} frame
 * @return {void}
 * @method
 * @protected
 */
export const execute = (movie_clip: MovieClip, frame: string | number): void =>
{
    movie_clip.play();
    movieClipGoToFrameUseCase(movie_clip, frame);
};