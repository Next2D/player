import type { MovieClip } from "../../MovieClip";
import type { DisplayObject } from "../../DisplayObject";
import type { DisplayObjectContainer } from "../../DisplayObjectContainer";
import { execute as movieClipPrepareActionUseCase } from "../../MovieClip/usecase/MovieClipPrepareActionUseCase";

/**
 * @description 子孫のアクションを準備する
 *              Prepare descendant actions
 *
 * @param  {DisplayObjectContainer} display_object_container
 * @return {void}
 * @method
 * @protected
 */
export const execute = <C extends DisplayObjectContainer>(display_object_container: C): void =>
{
    const children = display_object_container.children;
    for (let idx: number = children.length - 1; idx > -1; --idx) {

        const displayObject = children[idx] as DisplayObject;
        if (!displayObject) {
            continue;
        }

        if (!displayObject.isContainerEnabled) {
            continue;
        }

        execute(displayObject as C);

        if (displayObject.isTimelineEnabled) {
            movieClipPrepareActionUseCase(displayObject as MovieClip);
        }
    }
};