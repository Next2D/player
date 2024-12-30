import type { DisplayObjectContainer } from "../../DisplayObjectContainer";
import { execute as movieClipAdvanceFrameUseCase } from "../../MovieClip/usecase/MovieClipAdvanceFrameUseCase";

/**
 * @description DisplayObjectContainer 内のMovieClipのフレームを1フレーム進める
 *              Advance the frame of the MovieClip in the DisplayObjectContainer by 1 frame
 *
 * @param  {DisplayObjectContainer} display_object_container
 * @return {void}
 * @method
 * @protected
 */
export const execute = <C extends DisplayObjectContainer>(
    display_object_container: C
): void => {

    const container = display_object_container.$container;
    if (container) {
        for (let idx = 0; container.length > idx; ++idx) {

            const child = container[idx];
            if (child.isTimelineEnabled) {
                movieClipAdvanceFrameUseCase(child);
            }

            execute(child);
        }
    } else {
        const caches = [];
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

            caches.push(child);
        }

        // cache
        display_object_container.$container = caches;
    }
};