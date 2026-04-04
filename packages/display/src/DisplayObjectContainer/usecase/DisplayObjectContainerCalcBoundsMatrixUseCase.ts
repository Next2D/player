import type { Shape } from "../../Shape";
import type { Video } from "@next2d/media";
import type { TextField } from "@next2d/text";
import type { DisplayObject } from "../../DisplayObject";
import type { DisplayObjectContainer } from "../../DisplayObjectContainer";
import { Matrix } from "@next2d/geom";
import { execute as displayObjectGetRawMatrixUseCase } from "../../DisplayObject/usecase/DisplayObjectGetRawMatrixUseCase";
import { execute as shapeCalcBoundsMatrixUseCase } from "../../Shape/usecase/ShapeCalcBoundsMatrixUseCase";
import { execute as videoCalcBoundsMatrixUseCase } from "../../Video/usecase/VideoCalcBoundsMatrixUseCase";
import { execute as textFieldCalcBoundsMatrixUseCase } from "../../TextField/usecase/TextFieldCalcBoundsMatrixUseCase";
import {
    $getBoundsArray,
    $poolBoundsArray,
    $getFloat32Array6,
    $poolFloat32Array6
} from "../../DisplayObjectUtil";

/**
 * @description DisplayObjectContainerのバウンディングボックスを計算
 *              Calculate the bounding box of the DisplayObjectContainer
 *
 * @param  {DisplayObjectContainer} display_object_container
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

    let rawMatrix = displayObjectGetRawMatrixUseCase(display_object_container);

    // cacheAsBitmap倍率をrawMatrixに適用（ShapeCalcBoundsMatrixUseCaseと同様）
    const cacheMatrix = display_object_container.cacheAsBitmap;
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
        ? matrix
            ? Matrix.multiply(matrix, rawMatrix)
            : rawMatrix
        : matrix;

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

    if (scaledMatrix) {
        $poolFloat32Array6(scaledMatrix);
    }

    return $getBoundsArray(xMin, yMin, xMax, yMax);
};