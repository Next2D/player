import type { DisplayObject } from "../../DisplayObject";
import type { Shape } from "../../Shape";
import { $getArray } from "../../DisplayObjectUtil";
import { execute as shapeCalcBoundsMatrixUseCase } from "../../Shape/usecase/ShapeCalcBoundsMatrixUseCase";
import { execute as displayObjectGetRawMatrixUseCase } from "./DisplayObjectGetRawMatrixUseCase";

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
                display_object as unknown as Shape, 
                displayObjectGetRawMatrixUseCase(display_object)
            );

        // todo

        default:
            return $getArray(0, 0, 0, 0)

    }
};