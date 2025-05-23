import type { IDictionaryTag } from "../../interface/IDictionaryTag";
import type { Loader } from "../../Loader";
import type { MovieClip } from "../../MovieClip";
import type { DisplayObject } from "../../DisplayObject";
import {
    $loaderInfoMap,
    $rootMap
} from "../../DisplayObjectUtil";

/**
 * @description DisplayObjectの基本情報を設定します。
 *              Sets the basic information of the DisplayObject.
 *
 * @param  {DisplayObject} display_object
 * @param  {object} tag
 * @param  {MovieClip} parent
 * @return {void}
 * @method
 * @protected
 */
export const execute = <D extends DisplayObject>(
    display_object: D,
    dictionary_id: number,
    tag: IDictionaryTag,
    parent: MovieClip | Loader,
    placeId: number = -1
): void => {

    const loaderInfo = parent.loaderInfo;
    if (!loaderInfo) {
        throw new Error("the loaderInfo or data is null.");
    }

    // set parent data
    display_object.parent = parent as MovieClip;
    $rootMap.set(display_object, parent.root);
    $loaderInfoMap.set(display_object, loaderInfo);

    // bind tag data
    display_object.dictionaryId = dictionary_id;
    display_object.characterId  = tag.characterId;
    display_object.clipDepth    = tag.clipDepth;
    display_object.startFrame   = tag.startFrame;
    display_object.endFrame     = tag.endFrame;
    display_object.name         = tag.name || "";

    // first frame placeId
    display_object.placeId = placeId;
};