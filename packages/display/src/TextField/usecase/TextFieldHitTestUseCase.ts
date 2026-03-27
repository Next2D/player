import type { IPlayerHitObject } from "../../interface/IPlayerHitObject";
import type { TextField } from "@next2d/text";
import { Matrix } from "@next2d/geom";
import { execute as displayObjectGetRawMatrixUseCase } from "../../DisplayObject/usecase/DisplayObjectGetRawMatrixUseCase";
import {
    $getFloat32Array6,
    $poolFloat32Array6
} from "../../DisplayObjectUtil";

/**
 * @description TextField のヒット判定
 *              Hit judgment of TextField
 *
 * @param  {TextField} text_field
 * @param  {CanvasRenderingContext2D} hit_context
 * @param  {Float32Array} matrix
 * @param  {IPlayerHitObject} hit_object
 * @return {boolean}
 * @method
 * @protected
 */
export const execute = (
    text_field: TextField,
    hit_context: CanvasRenderingContext2D,
    matrix: Float32Array,
    hit_object: IPlayerHitObject
): boolean => {

    const width  = Math.ceil(Math.abs(text_field.xMax - text_field.xMin));
    const height = Math.ceil(Math.abs(text_field.yMax - text_field.yMin));
    if (width <= 0 || height <= 0 ) {
        return false;
    }

    let rawMatrix = displayObjectGetRawMatrixUseCase(text_field);

    // cacheAsBitmap倍率をrawMatrixに適用
    const cacheMatrix = (text_field as any).cacheAsBitmap;
    let scaledMatrix: Float32Array | null = null;
    if (cacheMatrix) {
        const m = cacheMatrix.rawData;
        const csx = Math.sqrt(m[0] * m[0] + m[1] * m[1]);
        const csy = Math.sqrt(m[2] * m[2] + m[3] * m[3]);
        if (rawMatrix) {
            scaledMatrix = $getFloat32Array6(
                rawMatrix[0] * csx, rawMatrix[1] * csx,
                rawMatrix[2] * csy, rawMatrix[3] * csy,
                rawMatrix[4], rawMatrix[5]
            );
        } else {
            scaledMatrix = $getFloat32Array6(csx, 0, 0, csy, 0, 0);
        }
        rawMatrix = scaledMatrix;
    }

    const tMatrix = rawMatrix
        ? Matrix.multiply(matrix, rawMatrix)
        : matrix;

    if (scaledMatrix) {
        $poolFloat32Array6(scaledMatrix);
    }

    hit_context.setTransform(
        tMatrix[0], tMatrix[1], tMatrix[2],
        tMatrix[3], tMatrix[4], tMatrix[5]
    );
    hit_context.beginPath();
    hit_context.moveTo(0, 0);
    hit_context.lineTo(width, 0);
    hit_context.lineTo(width, height);
    hit_context.lineTo(0, height);
    hit_context.lineTo(0, 0);

    if (tMatrix !== matrix) {
        Matrix.release(tMatrix);
    }

    return hit_context.isPointInPath(hit_object.x, hit_object.y);
};