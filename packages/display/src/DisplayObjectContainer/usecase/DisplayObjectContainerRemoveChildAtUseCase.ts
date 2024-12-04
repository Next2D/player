import type { DisplayObjectContainer } from "../../DisplayObjectContainer";
import { execute as displayObjectContainerGetChildAtService } from "../service/DisplayObjectContainerGetChildAtService";
import { execute as displayObjectContainerRemoveChildUseCase } from "./DisplayObjectContainerRemoveChildUseCase";

/**
 * @description 指定されたインデックスから子を削除する。
 *              Remove a child from the specified index.
 *
 * @param  {DisplayObjectContainer} display_object_container
 * @param  {number} index
 * @return {void}
 * @method
 * @protected
 */
export const execute = <C extends DisplayObjectContainer>(
    display_object_container: C,
    index: number
): void => {

    const displayObject = displayObjectContainerGetChildAtService(
        display_object_container, index
    );

    if (!displayObject) {
        return ;
    }

    displayObjectContainerRemoveChildUseCase(
        display_object_container, displayObject
    );
};