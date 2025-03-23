import type { DisplayObject } from "../../DisplayObject";
import type { DisplayObjectContainer } from "../../DisplayObjectContainer";
import type { Shape } from "../../Shape";
import type { Video } from "@next2d/media";
import type { TextField } from "@next2d/text";
import { Matrix } from "@next2d/geom";
import { execute as shapeCalcBoundsMatrixUseCase } from "../../Shape/usecase/ShapeCalcBoundsMatrixUseCase";
import { execute as videoCalcBoundsMatrixUseCase } from "../../Video/usecase/VideoCalcBoundsMatrixUseCase";
import { execute as textFieldCalcBoundsMatrixUseCase } from "../../TextField/usecase/TextFieldCalcBoundsMatrixUseCase";
import { execute as displayObjectGetRawMatrixUseCase } from "../../DisplayObject/usecase/DisplayObjectGetRawMatrixUseCase";
import {
    $getBoundsArray,
    $poolBoundsArray
} from "../../DisplayObjectUtil";

/**
 * @description DisplayObjectContainerのmatrixを含まないバウンディングボックスを返却
 *              Returns a bounding box that does not include the matrix of the DisplayObjectContainer
 *
 * @param  {DisplayObjectContainer} display_object_container
 * @param  {Float32Array} [matrix=null]
 * @return {Float32Array}
 * @method
 * @protected
 */
export const execute = <C extends DisplayObjectContainer>(
    display_object_container: C,
    matrix: Float32Array | null = null
): Float32Array => {

    const children = display_object_container.children;
    if (!children.length) {
        return $getBoundsArray(0, 0, 0, 0);
    }

    const rawMatrix = displayObjectGetRawMatrixUseCase(display_object_container);

    let tMatrix = matrix;
    if (rawMatrix) {
        tMatrix = matrix ? Matrix.multiply(matrix, rawMatrix) : rawMatrix;
    }

    const no = Number.MAX_VALUE;
    let xMin = no;
    let xMax = -no;
    let yMin = no;
    let yMax = -no;
    for (let idx = 0; idx < children.length; idx++) {

        const child = children[idx] as DisplayObject;
        if (!child.visible) {
            continue;
        }

        let bounds: Float32Array | null = null;
        switch (true) {

            case child.isContainerEnabled:
                bounds = execute(child as DisplayObjectContainer, tMatrix);
                break;

            case child.isShape:
                bounds = shapeCalcBoundsMatrixUseCase(child as Shape, tMatrix);
                break;

            case child.isText:
                bounds = textFieldCalcBoundsMatrixUseCase(child as TextField, tMatrix);
                break;

            case child.isVideo:
                bounds = videoCalcBoundsMatrixUseCase(child as Video, tMatrix);
                break;

        }

        if (!bounds) {
            continue;
        }

        xMin = Math.min(xMin, bounds[0]);
        yMin = Math.min(yMin, bounds[1]);
        xMax = Math.max(xMax, bounds[2]);
        yMax = Math.max(yMax, bounds[3]);

        $poolBoundsArray(bounds);
    }

    return $getBoundsArray(xMin, yMin, xMax, yMax);
};