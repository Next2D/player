import type { MovieClip } from "../../MovieClip";
import { execute as displayObjectApplyChangesService } from "../../DisplayObject/service/DisplayObjectApplyChangesService";

/**
 * @description フレームを進める
 *              Advance the frame
 *
 * @param  {MovieClip} movie_clip
 * @return {void}
 * @method
 * @protected
 */
export const execute = <M extends MovieClip>(movie_clip: M): void =>
{
    if (movie_clip.totalFrames === 1 || !movie_clip.isPlaying) {
        return ;
    }

    movie_clip.$canAction = true;
    movie_clip.$hasTimelineHeadMoved = true;

    ++movie_clip.currentFrame;
    if (movie_clip.currentFrame > movie_clip.totalFrames) {
        movie_clip.currentFrame = 1;
    }

    displayObjectApplyChangesService(movie_clip);
};