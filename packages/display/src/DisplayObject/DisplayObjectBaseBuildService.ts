import type { DictionaryTagImpl } from "../interface/DictionaryTagImpl";
import type { Character } from "../interface/Character";
import type { LoaderInfo } from "../LoaderInfo";
import type { DisplayObject } from "../DisplayObject";
import type { DisplayObjectContainer } from "../DisplayObjectContainer";

/**
 * @description DisplayObjectの基礎となる情報を設定、個別のCharacterを返却
 *              Sets the underlying information for DisplayObject and returns individual Character
 *
 * @param  {DisplayObject} display_object
 * @param  {object} tag
 * @param  {DisplayObjectContainer} parent
 * @return {void}
 * @method
 * @public
 */
export const execute = <D extends DisplayObject, P extends DisplayObjectContainer>(
    display_object: D,
    tag: DictionaryTagImpl,
    parent: P
): Character<any> => {

    const loaderInfo = parent._$loaderInfo as LoaderInfo;
    if (!loaderInfo || !loaderInfo.data) {
        throw new Error("the loaderInfo or data is nul.");
    }

    // setup
    display_object._$parent     = parent;
    display_object._$root       = parent._$root;
    display_object._$stage      = parent._$stage;
    display_object._$loaderInfo = loaderInfo;

    // bind tag data
    display_object._$characterId = tag.characterId | 0;
    display_object._$clipDepth   = tag.clipDepth | 0;
    display_object._$startFrame  = tag.startFrame | 0;
    display_object._$endFrame    = tag.endFrame | 0;
    display_object._$name        = tag.name || "";

    return loaderInfo.data.characters[tag.characterId];
};