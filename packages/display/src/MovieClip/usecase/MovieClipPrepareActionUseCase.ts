import type { MovieClip } from "../../MovieClip";
import { execute as movieClipDispatchFrameLabelEventService } from "../service/MovieClipDispatchFrameLabelEventService";
import { execute as movieClipSetActionService } from "../service/MovieClipSetActionService";

/**
 * @description MovieClipのFrameLabel Eventを発火して、アクションを登録
 *              Fire the FrameLabel Event of MovieClip and register the action
 *
 * @param  {MovieClip} movie_clip
 * @return {void}
 * @method
 * @protected
 */
export const execute = (movie_clip: MovieClip): void =>
{
    if (!movie_clip.$canAction) {
        return ;
    }

    movie_clip.$canAction = false;

    // dispatch frame label event
    movieClipDispatchFrameLabelEventService(movie_clip, movie_clip.$labels);

    // set frame action
    movieClipSetActionService(movie_clip, movie_clip.$actions);
};