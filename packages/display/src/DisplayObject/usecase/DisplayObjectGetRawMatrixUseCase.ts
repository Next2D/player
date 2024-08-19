import type { IPlaceObject } from "../../interface/IPlaceObject";
import type { DisplayObject } from "../../DisplayObject";
import { execute as displayObjectGetPlaceObjectService } from "../service/DisplayObjectGetPlaceObjectService";
import { $getFloat32Array6 } from "../../DisplayObjectUtil";

/**
 * @description DisplayObjectの内部Float32Arrayデータを返却、存在しない場合は固定のFloat32Arrayデータを返却
 *              Return the internal Float32Array data of the DisplayObject,
 *              or return a fixed Float32Array data if it does not exist.
 *
 * @param  {DisplayObject} display_object
 * @return {Float32Array | null}
 * @method
 * @protected
 */
export const execute = <D extends DisplayObject>(display_object: D): Float32Array | null => 
{
    const placeObject: IPlaceObject | null = displayObjectGetPlaceObjectService(display_object);
    if (!placeObject || !placeObject.matrix) {
        return null;
    }

    if (!placeObject.typedMatrix) {
        const matrix: number[] = placeObject.matrix;
        placeObject.typedMatrix = $getFloat32Array6(
            matrix[0], matrix[1], matrix[2],
            matrix[3], matrix[4], matrix[5]
        );
    }

    return placeObject.typedMatrix;
};