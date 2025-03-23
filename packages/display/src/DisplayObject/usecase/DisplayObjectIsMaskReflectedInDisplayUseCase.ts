import type { DisplayObject } from "../../DisplayObject";
import type { DisplayObjectContainer } from "../../DisplayObjectContainer";
import type { Shape } from "../../Shape";
import type { TextField } from "@next2d/text";
import type { Video } from "@next2d/media";
import { execute as shapeCalcBoundsMatrixUseCase } from "../../Shape/usecase/ShapeCalcBoundsMatrixUseCase";
import { execute as textFieldCalcBoundsMatrixUseCase } from "../../TextField/usecase/TextFieldCalcBoundsMatrixUseCase";
import { execute as videoCalcBoundsMatrixUseCase } from "../../Video/usecase/VideoCalcBoundsMatrixUseCase";
import { execute as displayObjectContainerCalcBoundsMatrixUseCase } from "../../DisplayObjectContainer/usecase/DisplayObjectContainerCalcBoundsMatrixUseCase";

/**
 * @description DisplayObjectのマスク描画範囲を計算して、マスク描画が実行可能かどうかを返します。
 *              Calculate the mask drawing area of DisplayObject and return whether the mask drawing is executable.
 *
 * @param  {DisplayObject} display_object
 * @param  {Float32Array} matrix
 * @param  {number} renderer_width
 * @param  {number} renderer_height
 * @param  {number} point_x
 * @param  {number} point_y
 * @return {boolean}
 * @method
 * @protected
 */
export const execute = <D extends DisplayObject>(
    display_object: D,
    matrix: Float32Array,
    renderer_width: number,
    renderer_height: number,
    point_x: number,
    point_y: number
): Float32Array | null => {

    let bounds: Float32Array | null = null;
    switch (true) {

        case display_object.isContainerEnabled:
            bounds = displayObjectContainerCalcBoundsMatrixUseCase(
                display_object as unknown as DisplayObjectContainer, matrix
            );
            break;

        case display_object.isShape:
            bounds = shapeCalcBoundsMatrixUseCase(
                display_object as unknown as Shape, matrix
            );
            break;

        case display_object.isText:
            bounds = textFieldCalcBoundsMatrixUseCase(
                display_object as unknown as TextField, matrix
            );
            break;

        case display_object.isVideo:
            bounds = videoCalcBoundsMatrixUseCase(
                display_object as unknown as Video, matrix
            );
            break;

        default:
            break;

    }

    if (!bounds) {
        return null;
    }

    const xMin = bounds[0];
    const xMax = bounds[2];
    const width = Math.abs(xMax - xMin);
    if (!width) {
        return null;
    }

    const yMin = bounds[1];
    const yMax = bounds[3];
    const height = Math.abs(yMax - yMin);
    if (!height) {
        return null;
    }

    if (point_x > xMin + width
        || point_y > yMin + height
        || xMin > renderer_width
        || yMin > renderer_height
    ) {
        return null;
    }

    return bounds;
};