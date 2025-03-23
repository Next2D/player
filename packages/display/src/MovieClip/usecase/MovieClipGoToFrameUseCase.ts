import type { MovieClip } from "../../MovieClip";
import { execute as movieClipGetFrameForLabelService } from "../service/MovieClipGetFrameForLabelService";
import { execute as displayObjectApplyChangesService } from "../../DisplayObject/service/DisplayObjectApplyChangesService";
import { execute as movieClipPrepareActionUseCase } from "./MovieClipPrepareActionUseCase";

/**
 * @description 指定フレームに移動する
 *              Move to the specified frame
 *
 * @param {MovieClip} movie_clip
 * @param {string | number} value
 * @return {void}
 * @method
 * @protected
 */
export const execute = (movie_clip: MovieClip, value: string | number): void =>
{
    if (movie_clip.totalFrames === 1) {
        return ;
    }

    let frame = +value;
    if (isNaN(frame)) {
        frame = movieClipGetFrameForLabelService(movie_clip, `${value}`);
    }

    if (1 > frame) {
        frame = 1;
    }

    // 移動先が現在のフレームと同じ場合は何もしない
    if (movie_clip.currentFrame === frame) {
        return ;
    }

    // 最大フレーム数を超えた場合
    if (frame > movie_clip.totalFrames) {

        if (movie_clip.currentFrame === movie_clip.totalFrames) {
            return ;
        }

        // フラグを更新
        movie_clip.$wait                 = true;
        movie_clip.$canSound             = true;
        movie_clip.$canAction            = true;
        movie_clip.$hasTimelineHeadMoved = true;

        // fixed logic
        movie_clip.currentFrame = movie_clip.totalFrames;

        // アクション準備
        movieClipPrepareActionUseCase(movie_clip);

        // 更新
        displayObjectApplyChangesService(movie_clip);

        return ;
    }

    // フレームをセット
    movie_clip.currentFrame = frame;

    // フラグを更新
    movie_clip.$wait                 = true;
    movie_clip.$canSound             = true;
    movie_clip.$canAction            = true;
    movie_clip.$hasTimelineHeadMoved = true;

    // 更新
    displayObjectApplyChangesService(movie_clip);

    // アクション準備
    movieClipPrepareActionUseCase(movie_clip);
};