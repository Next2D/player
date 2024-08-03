import type { Matrix } from "@next2d/geom";
import type { PlaceObjectImpl } from "../../interface/PlaceObjectImpl";
import type { DisplayObjectImpl } from "../../interface/DisplayObjectImpl";
import { execute as displayObjectGetPlaceObjectService } from "./DisplayObjectGetPlaceObjectService";
import { $getFloat32Array6 } from "../../DisplayObjectUtil";

/**
 * @type {Float32Array}
 * @const
 */
const $MATRIX_ARRAY_IDENTITY: Float32Array = new Float32Array([1, 0, 0, 1, 0, 0]);

/**
 * @description DisplayObjectの内部Float32Arrayデータを返却、存在しない場合は固定のFloat32Arrayデータを返却
 *              Return the internal Float32Array data of the DisplayObject,
 *              or return a fixed Float32Array data if it does not exist.
 *
 * @param  {DisplayObject} display_object
 * @param  {Matrix | null} [matrix=null]
 * @return {Float32Array}
 * @method
 * @protected
 */
export const execute = (
    display_object: DisplayObjectImpl<any>,
    matrix: Matrix | null = null
): Float32Array => {

    if (matrix) {
        return matrix.rawData;
    }

    const placeObject: PlaceObjectImpl | null = displayObjectGetPlaceObjectService(display_object);
    if (!placeObject || !placeObject.matrix) {
        return $MATRIX_ARRAY_IDENTITY;
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