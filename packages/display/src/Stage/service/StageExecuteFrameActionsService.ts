import type { MovieClip } from "../../MovieClip";
import { $actions } from "../../DisplayObjectUtil";

/**
 * @description フレームアクションがなくなるまで実行
 *              Execute until there are no frame actions
 * 
 * @return {void}
 * @method
 * @protected
 */
export const execute = (): void =>
{
    while ($actions.length) {

        const actionMap = $actions.pop() as Map<number, Function[]>;
        const movieClip = $actions.pop() as MovieClip;

        const frame = movieClip.currentFrame;
        if (!actionMap.has(frame)) {
            continue;
        }

        const actions = actionMap.get(frame) as Function[];
        if (!actions) {
            continue;
        }

        for (let idx = 0; idx < actions.length; idx++) {
            try {
                actions[idx].apply(movieClip);
            } catch (error) {
                console.error(error);
            }
        }
    }
};