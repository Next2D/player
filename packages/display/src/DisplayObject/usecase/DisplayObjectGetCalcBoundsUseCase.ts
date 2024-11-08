import type { DisplayObject } from "../../DisplayObject";
import type { DisplayObjectContainer } from "../../DisplayObjectContainer";
import type { Shape } from "../../Shape";
import type { Video } from "@next2d/media";
import type { TextField } from "@next2d/text";
import { $getArray } from "../../DisplayObjectUtil";
import { execute as shapeCalcBoundsMatrixUseCase } from "../../Shape/usecase/ShapeCalcBoundsMatrixUseCase";
import { execute as videoCalcBoundsMatrixUseCase } from "../../Video/usecase/VideoCalcBoundsMatrixUseCase";
import { execute as textFieldCalcBoundsMatrixUseCase } from "../../TextField/usecase/TextFieldCalcBoundsMatrixUseCase";
import { execute as displayObjectContainerCalcBoundsMatrixUseCase } from "../../DisplayObjectContainer/usecase/DisplayObjectContainerCalcBoundsMatrixUseCase";

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

        case display_object.isContainerEnabled:
            return displayObjectContainerCalcBoundsMatrixUseCase(
                display_object as unknown as DisplayObjectContainer
            );

        case display_object.isShape:
            return shapeCalcBoundsMatrixUseCase(
                display_object as unknown as Shape
            );

        case display_object.isText:
            return textFieldCalcBoundsMatrixUseCase(
                display_object as unknown as TextField
            );

        case display_object.isVideo:
            return videoCalcBoundsMatrixUseCase(
                display_object as unknown as Video
            );

        default:
            return $getArray(0, 0, 0, 0);

    }
};