import type { DisplayObjectContainer } from "../../DisplayObjectContainer";
import { execute as movieClipAdvanceFrameUseCase } from "../../MovieClip/usecase/MovieClipAdvanceFrameUseCase";

/**
 * @description DisplayObjectContainer のフレームを進める
 *              Advance the frame of DisplayObjectContainer
 * 
 * @param  {DisplayObjectContainer} display_object_container
 * @return {void}
 * @method
 * @protected
 */
export const execute = <C extends DisplayObjectContainer>(
    display_object_container: C,
): void => {

    const children = display_object_container.children;
    for (let idx = 0; children.length > idx; ++idx) {

        const child = children[idx];
        if (!child.isContainerEnabled) {
            continue;
        }

        if (child.isTimelineEnabled) {
            movieClipAdvanceFrameUseCase(child);
        }

        execute(child);
    }
};