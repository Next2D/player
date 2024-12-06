import type { MovieClip } from "../../MovieClip";
import { execute as displayObjectApplyChangesService } from "../../DisplayObject/service/DisplayObjectApplyChangesService";
import { execute as movieClipPrepareActionUseCase } from "./MovieClipPrepareActionUseCase";
import { execute as movieClipPrepareSoundUseCase } from "./MovieClipPrepareSoundUseCase";

/**
 * @description フレームを進める
 *              Advance the frame
 *
 * @param  {MovieClip} movie_clip
 * @return {void}
 * @method
 * @protected
 */
export const execute = (movie_clip: MovieClip): void =>
{
    if (movie_clip.totalFrames === 1 || !movie_clip.isPlaying) {
        return ;
    }

    if (movie_clip.$wait) {
        movie_clip.$wait = false;
        return ;
    }

    movie_clip.$canSound  = true;
    movie_clip.$canAction = true;
    movie_clip.$hasTimelineHeadMoved = true;

    ++movie_clip.currentFrame;
    if (movie_clip.currentFrame > movie_clip.totalFrames) {
        movie_clip.currentFrame = 1;
    }

    // サウンドがあればセット
    movieClipPrepareSoundUseCase(movie_clip);

    // アクションがあればセット
    movieClipPrepareActionUseCase(movie_clip);

    // 表示オブジェクトの変更を適用
    displayObjectApplyChangesService(movie_clip);
};