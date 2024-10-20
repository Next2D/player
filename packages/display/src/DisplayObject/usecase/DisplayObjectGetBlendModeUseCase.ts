import type { DisplayObject } from "../../DisplayObject";
import type { IBlendMode } from "../../interface/IBlendMode";
import { execute as displayObjectGetPlaceObjectService } from "../service/DisplayObjectGetPlaceObjectService";

/**
 * @description DisplayObjectのブレンドモードを返却
 *              Returns the blend mode of the DisplayObject
 * 
 * @param  {DisplayObject} display_object
 * @return {IBlendMode}
 * @method
 * @protected
 */
export const execute = <D extends DisplayObject>(display_object: D): IBlendMode =>
{
    if (display_object.$blendMode) {
        return display_object.$blendMode;
    }

    const placeObject = displayObjectGetPlaceObjectService(display_object);
    return placeObject && placeObject.blendMode 
        ? placeObject.blendMode
        : "normal";
};