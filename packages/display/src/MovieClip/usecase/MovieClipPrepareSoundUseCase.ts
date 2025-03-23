import type { MovieClip } from "../../MovieClip";
import { execute as movieClipSetSoundsService } from "../service/MovieClipSetSoundsService";

/**
 * @description MovieClipの現在のフレームのサウンドを登録
 *              Register the sound of the current frame of MovieClip
 *
 * @param  {MovieClip} movie_clip
 * @return {void}
 * @method
 * @protected
 */
export const execute = (movie_clip: MovieClip): void =>
{
    if (!movie_clip.$canSound) {
        return ;
    }

    movie_clip.$canSound = false;

    // set frame sound
    movieClipSetSoundsService(movie_clip, movie_clip.$sounds);
};