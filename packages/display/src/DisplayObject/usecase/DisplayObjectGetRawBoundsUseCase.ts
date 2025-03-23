import type { DisplayObject } from "../../DisplayObject";
import type { DisplayObjectContainer } from "../../DisplayObjectContainer";
import type { Shape } from "../../Shape";
import type { Video } from "@next2d/media";
import type { TextField } from "@next2d/text";
import { execute as displayObjectContainerRawBoundsMatrixUseCase } from "../../DisplayObjectContainer/usecase/DisplayObjectContainerRawBoundsMatrixUseCase";
import { execute as shapeGetRawBoundsService } from "../../Shape/service/ShapeGetRawBoundsService";
import { execute as textFieldGetRawBoundsService } from "../../TextField/service/TextFieldGetRawBoundsService";
import { execute as videoGetRawBoundsService } from "../../Video/service/VideoGetRawBoundsService";
import { $getBoundsArray } from "../../DisplayObjectUtil";

/**
 * @description matrixを含まないバウンディングボックスを返却
 *              Return bounding box without matrix
 *
 * @param  {DisplayObject} display_object
 * @return {Float32Array}
 * @method
 * @protected
 */
export const execute = <D extends DisplayObject>(display_object: D): Float32Array =>
{
    switch (true) {

        case display_object.isContainerEnabled:
            return displayObjectContainerRawBoundsMatrixUseCase(
                display_object as unknown as DisplayObjectContainer
            );

        case display_object.isShape:
            return shapeGetRawBoundsService(
                display_object as unknown as Shape
            );

        case display_object.isText:
            return textFieldGetRawBoundsService(
                display_object as unknown as TextField
            );

        case display_object.isVideo:
            return videoGetRawBoundsService(
                display_object as unknown as Video
            );

        default:
            return $getBoundsArray(0, 0, 0, 0);

    }
};