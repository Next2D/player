import type { IPlayerHitObject } from "../../interface/IPlayerHitObject";
import type { TextField } from "@next2d/text";
import { Matrix } from "@next2d/geom";
import { execute as displayObjectGetRawMatrixUseCase } from "../../DisplayObject/usecase/DisplayObjectGetRawMatrixUseCase";

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

    const rawMatrix = displayObjectGetRawMatrixUseCase(text_field);
    const tMatrix = rawMatrix
        ? Matrix.multiply(matrix, rawMatrix)
        : matrix;

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