import type { Shape } from "../../Shape";
import type { Video } from "@next2d/media";
import type { TextField } from "@next2d/text";
import type { DisplayObject } from "../../DisplayObject";
import type { DisplayObjectContainer } from "../../DisplayObjectContainer";
import { Matrix } from "@next2d/geom";
import { execute as displayObjectGetRawMatrixUseCase } from "../../DisplayObject/usecase/DisplayObjectGetRawMatrixUseCase";
import { execute as shapeCalcLayerBoundsUseCase } from "../../Shape/usecase/ShapeCalcLayerBoundsUseCase";
import { execute as videoCalcLayerBoundsUseCase } from "../../Video/usecase/VideoCalcLayerBoundsUseCase";
import { execute as textFieldCalcLayerBoundsUseCase } from "../../TextField/usecase/TextFieldCalcLayerBoundsUseCase";
import {
    $getBoundsArray,
    $poolBoundsArray
} from "../../DisplayObjectUtil";

/**
 * @description DisplayObjectContainerのレイヤー境界を取得します。
 *              子孫のフィルター適用後のboundsを考慮した境界を返却します。
 *              Get the layer bounds of DisplayObjectContainer.
 *              Returns bounds considering filter-expanded bounds of descendants.
 *
 * @param  {DisplayObjectContainer} display_object_container
 * @param  {Float32Array | null} matrix
 * @return {Float32Array}
 * @method
 * @public
 */
export const execute = <P extends DisplayObjectContainer> (
    display_object_container: P,
    matrix: Float32Array | null = null
): Float32Array => {

    const children = display_object_container.children;
    if (!children.length) {
        return $getBoundsArray(0, 0, 0, 0);
    }

    const rawMatrix = displayObjectGetRawMatrixUseCase(display_object_container);
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
        if (!child || !child.visible) {
            continue;
        }

        let bounds: Float32Array | null = null;
        switch (true) {

            case child.isContainerEnabled:
                bounds = execute(child as DisplayObjectContainer, tMatrix);
                break;

            case child.isShape:
                bounds = shapeCalcLayerBoundsUseCase(child as Shape, tMatrix);
                break;

            case child.isText:
                bounds = textFieldCalcLayerBoundsUseCase(child as TextField, tMatrix);
                break;

            case child.isVideo:
                bounds = videoCalcLayerBoundsUseCase(child as Video, tMatrix);
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
