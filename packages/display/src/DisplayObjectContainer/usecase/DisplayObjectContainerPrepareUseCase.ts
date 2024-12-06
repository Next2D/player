import type { MovieClip } from "../../MovieClip";
import type { DisplayObject } from "../../DisplayObject";
import type { DisplayObjectContainer } from "../../DisplayObjectContainer";
import { execute as movieClipPrepareActionUseCase } from "../../MovieClip/usecase/MovieClipPrepareActionUseCase";
import { execute as movieClipPrepareSoundUseCase } from "../../MovieClip/usecase/MovieClipPrepareSoundUseCase";

/**
 * @description 子孫のサウンド・アクションを準備する
 *              Prepare sound and action of descendants
 *
 * @param  {DisplayObjectContainer} display_object_container
 * @return {void}
 * @method
 * @protected
 */
export const execute = <C extends DisplayObjectContainer>(display_object_container: C): void =>
{
    const children = display_object_container.children;
    for (let idx = children.length - 1; idx > -1; --idx) {

        const displayObject = children[idx] as DisplayObject;
        if (!displayObject) {
            continue;
        }

        if (!displayObject.isContainerEnabled) {
            continue;
        }

        execute(displayObject as C);

        // タイムラインが有効な場合
        if (!displayObject.isTimelineEnabled) {
            continue;
        }

        // サウンドを登録
        movieClipPrepareSoundUseCase(displayObject as MovieClip);

        // アクションを登録
        movieClipPrepareActionUseCase(displayObject as MovieClip);
    }
};