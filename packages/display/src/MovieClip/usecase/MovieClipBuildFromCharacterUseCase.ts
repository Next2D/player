import type { IMovieClipCharacter } from "../../interface/IMovieClipCharacter";
import type { MovieClip } from "../../MovieClip";
import { execute as movieClipAddActionsService } from "../service/MovieClipAddActionsService";
import { execute as movieClipAddLabelsService } from "../service/MovieClipAddLabelsService";
import { execute as movieClipBuildSoundsService } from "../service/MovieClipBuildSoundsService";

/**
 * @description MovieClipのキャラクター情報を元に、MovieClipを構築
 *              Build MovieClip based on character information of MovieClip
 * @param  {MovieClip} movie_clip
 * @param  {object} character
 * @return {void}
 * @method
 * @protected
 */
export const execute = (
    movie_clip: MovieClip,
    character: IMovieClipCharacter
): void => {

    if (character.actions) {
        if (!movie_clip.$actions) {
            movie_clip.$actions = new Map();
        }
        movieClipAddActionsService(movie_clip.$actions, character.actions);
    }

    if (character.sounds) {
        if (!movie_clip.$sounds) {
            movie_clip.$sounds = new Map();
        }
        movieClipBuildSoundsService(
            movie_clip, movie_clip.$sounds, character.sounds
        );
    }

    if (character.labels) {
        if (!movie_clip.$labels) {
            movie_clip.$labels = new Map();
        }
        movieClipAddLabelsService(movie_clip.$labels, character.labels);
    }

    movie_clip.totalFrames = character.totalFrame || 1;
};