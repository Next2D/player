import type { DisplayObject } from "../../DisplayObject";
import type { IPlaceObject } from "../../interface/IPlaceObject";
import { execute as displayObjectGetPlaceObjectService } from "../service/DisplayObjectGetPlaceObjectService";
import { $getFloat32Array8 } from "../../DisplayObjectUtil";

/**
 * @description 現在のフレームのColorTransformを返却、存在しない場合はnullを返却
 *              Returns the ColorTransform of the current frame, or null if it does not exist.
 *
 * @param  {DisplayObject} display_object
 * @return {Float32Array | null}
 * @method
 * @protected
 */
export const execute = <D extends DisplayObject>(display_object: D): Float32Array | null =>
{
    if (display_object.$colorTransform) {
        return display_object.$colorTransform.rawData;
    }

    const placeObject: IPlaceObject | null = displayObjectGetPlaceObjectService(display_object);
    if (!placeObject || !placeObject.colorTransform) {
        return null;
    }

    if (!placeObject.typedColorTransform) {
        const colorTransform: number[] = placeObject.colorTransform;
        placeObject.typedColorTransform = $getFloat32Array8(
            colorTransform[0], colorTransform[1],
            colorTransform[2], colorTransform[3],
            colorTransform[4], colorTransform[5],
            colorTransform[6], colorTransform[7]
        );
    }

    return placeObject.typedColorTransform;
};