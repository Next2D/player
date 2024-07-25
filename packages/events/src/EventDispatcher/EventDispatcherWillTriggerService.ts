import type { EventDispatcherImpl } from "../interface/EventDispatcherImpl";

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
export const execute = (
    scope: EventDispatcherImpl<any>,
    type: string
): boolean => {

    if (scope.hasEventListener(type)) {
        return true;
    }

    if ("parent" in scope) {

        let parent = scope.parent as EventDispatcherImpl<any> | null;
        while (parent) {

            if (parent.hasEventListener(type)) {
                return true;
            }

            parent = parent.parent;
        }
    }

    return false;
};