import type { MovieClip } from "../../MovieClip";
import type { DisplayObjectContainer } from "../../DisplayObjectContainer";
// import { execute as movieClipPreparaActionUseCase } from "../../MovieClip/usecase/MovieClipPreparaActionUseCase";

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
        
        const displayObject = children[idx];
        if (!displayObject) {
            continue;
        }

        if (!displayObject.isContainerEnabled) {
            continue;
        }

        execute(displayObject as C);

        if (displayObject.isTimelineEnabled) {
            (displayObject as MovieClip)._$prepareActions();
        }
    }
};