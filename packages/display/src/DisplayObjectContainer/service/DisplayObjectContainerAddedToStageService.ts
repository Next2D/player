import type { DisplayObjectContainer } from "../../DisplayObjectContainer";

/**
 * @description ステージに追加された DisplayObjectContainer の子要素のADDED_TO_STAGEイベントを発行
 *              Issue ADDED_TO_STAGE events for child elements of DisplayObjectContainer added to the stage
 *
 * @param  {DisplayObjectContainer} display_object_container
 * @return {void}
 * @method
 * @protected
 */
export const execute = <P extends DisplayObjectContainer>(
    display_object_container: P
): void => {

    const children = display_object_container._$getChildren();
    for (let idx = 0; idx < children.length; ++idx) {

        const child = children[idx];
        if (!child) {
            continue;
        }

        child._$dispatchAddedEvent();
    }
}