import type { DisplayObject } from "../../DisplayObject";
import type { DisplayObjectContainer } from "../../DisplayObjectContainer";
import { $parentMap } from "../../DisplayObjectUtil";

/**
 * @description 指定のDisplayObjectContainerに子要素を追加する
 *              Add a child element to the specified DisplayObjectContainer
 * 
 * @param  {DisplayObjectContainer} display_object_container
 * @param  {DisplayObject} display_object
 * @return {void}
 * @method
 * @public
 */
export const execute = <P extends DisplayObjectContainer, D extends DisplayObject>(
    display_object_container: P,
    display_object: D
): void => {

    // init
    $parentMap.set(display_object, display_object_container);

    // if (!child._$stage || !child._$root) {
    //     child._$stage = this._$stage;
    //     child._$root  = this._$root;
    // }

    // // setup
    // if (child instanceof DisplayObjectContainer) {
    //     child._$setParentAndStage();
    //     child._$wait = true;
    // }

    // // added event
    // if (!child._$added) {
    //     if (child.willTrigger(Next2DEvent.ADDED)) {
    //         child.dispatchEvent(
    //             new Next2DEvent(Next2DEvent.ADDED, true)
    //         );
    //     }
    //     child._$added = true;
    // }

    // if (this._$stage !== null && !child._$addedStage) {

    //     if (child.willTrigger(Next2DEvent.ADDED_TO_STAGE)) {
    //         child.dispatchEvent(
    //             new Next2DEvent(Next2DEvent.ADDED_TO_STAGE)
    //         );
    //     }

    //     child._$addedStage = true;

    //     // set params
    //     if (child instanceof DisplayObjectContainer) {
    //         child._$executeAddedToStage();
    //     }

    // }

    // this._$doChanged();
    // child._$active  = true;
    // child._$updated = true;
    // child._$isNext  = true;
};