import type { EventDispatcher } from "../../EventDispatcher";

/**
 * @description 先祖も含めてイベントリスナーが登録されているかどうかを判定。
 *              Determine whether an event listener is registered, including ancestors.
 *
 * @param  {EventDispatcher} scope
 * @param  {string} type
 * @return {boolean}
 * @method
 * @protected
 */
export const execute = <D extends EventDispatcher>(
    scope: D,
    type: string
): boolean => {

    if (scope.hasEventListener(type)) {
        return true;
    }

    if ("parent" in scope) {

        let parent = scope.parent as D | null;
        while (parent) {

            if (parent.hasEventListener(type)) {
                return true;
            }

            if (!("parent" in parent)) {
                break;
            }

            parent = parent.parent as D | null;
        }
    }

    return false;
};