import type { DisplayObject } from "../../DisplayObject";
import type { Shape } from "../../Shape";
import { $getArray } from "../../DisplayObjectUtil";
import { execute as shapeCalcBoundsMatrixUseCase } from "../../Shape/usecase/ShapeCalcBoundsMatrixUseCase";

/**
 * @description DisplayObject のローカルバウンディングボックスを取得します。
 *              Get the local bounding box of the DisplayObject.
 * 
 * @param  {DisplayObject} display_object
 * @return {number[]}
 * @method
 * @protected
 */
export const execute = <D extends DisplayObject>(display_object: D): number[] =>
{

    switch (true) {

        case display_object.isShape:
            return shapeCalcBoundsMatrixUseCase(
                display_object as unknown as Shape
            );

        case display_object.isText:
            // todo
            return $getArray(0, 0, 0, 0);

        case display_object.isVideo:
            // todo
            return $getArray(0, 0, 0, 0);

        case display_object.isContainerEnabled:
            // todo
            return $getArray(0, 0, 0, 0);

        default:
            return $getArray(0, 0, 0, 0);

    }
};