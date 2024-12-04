import type { IPlayerHitObject } from "../../interface/IPlayerHitObject";
import type { DisplayObject } from "../../DisplayObject";
import type { DisplayObjectContainer } from "../../DisplayObjectContainer";
import type { Shape } from "../../Shape";
import type { TextField } from "@next2d/text";
import type { Video } from "@next2d/media";
import { execute as displayObjectGetRawBoundsUseCase } from "./DisplayObjectGetRawBoundsUseCase";
import { execute as displayObjectCalcBoundsMatrixService } from "../service/DisplayObjectCalcBoundsMatrixService";
import { execute as displayObjectGetRawMatrixUseCase } from "./DisplayObjectGetRawMatrixUseCase";
import { execute as displayObjectContainerMouseHitUseCase } from "../../DisplayObjectContainer/usecase/DisplayObjectContainerMouseHitUseCase";
import { execute as shapeHitTestUseCase } from "../../Shape/usecase/ShapeHitTestUseCase";
import { execute as textFieldHitTestUseCase } from "../../TextField/usecase/TextFieldHitTestUseCase";
import { execute as videoHitTestUseCase } from "../../Video/usecase/VideoHitTestUseCase";
import {
    Rectangle,
    Point
} from "@next2d/geom";
import {
    $MATRIX_ARRAY_IDENTITY,
    $poolArray
} from "../../DisplayObjectUtil";

const canvas  = document.createElement("canvas");
canvas.width  = 1;
canvas.height = 1;

/**
 * @type {CanvasRenderingContext2D}
 * @private
 */
const $hitContext: CanvasRenderingContext2D = canvas.getContext("2d") as CanvasRenderingContext2D;

/**
 * @type {IPlayerHitObject}
 * @private
 */
const $hitObject: IPlayerHitObject = {
    "x": 0,
    "y": 0,
    "pointer": "",
    "hit": null
};

/**
 * @description 指定された DisplayObject が指定された座標にヒットしているかどうかを返します
 *              Returns whether the specified DisplayObject hits the specified coordinates
 *
 * @param  {DisplayObject} display_object
 * @param  {number} x
 * @param  {number} y
 * @param  {boolean} [shape_flag=false]
 * @return {boolean}
 * @method
 * @protected
 */
export const execute = <D extends DisplayObject>(
    display_object: D,
    x: number,
    y: number,
    shape_flag: boolean = false
): boolean => {

    if (shape_flag) {

        const parent = display_object.parent;

        const matrix = parent
            ? parent.concatenatedMatrix.rawData
            : $MATRIX_ARRAY_IDENTITY;

        $hitContext.setTransform(1, 0, 0, 1, 0, 0);
        $hitContext.beginPath();

        $hitObject.x = x;
        $hitObject.y = y;
        $hitObject.hit = null;

        switch (true) {

            case display_object.isContainerEnabled:
                return displayObjectContainerMouseHitUseCase(
                    display_object as unknown as DisplayObjectContainer,
                    $hitContext,
                    matrix,
                    $hitObject
                );

            case display_object.isShape:
                return shapeHitTestUseCase(
                    display_object as unknown as Shape,
                    $hitContext,
                    matrix,
                    $hitObject
                );

            case display_object.isText:
                return textFieldHitTestUseCase(
                    display_object as unknown as TextField,
                    $hitContext,
                    matrix,
                    $hitObject
                );

            case display_object.isVideo:
                return videoHitTestUseCase(
                    display_object as unknown as Video,
                    $hitContext,
                    matrix,
                    $hitObject
                );

            default:
                return false;

        }
    }

    const rawBounds = displayObjectGetRawBoundsUseCase(display_object);
    const martix = displayObjectGetRawMatrixUseCase(display_object);
    const bounds = displayObjectCalcBoundsMatrixService(
        rawBounds[0], rawBounds[1],
        rawBounds[2], rawBounds[3],
        martix ? martix : $MATRIX_ARRAY_IDENTITY
    );

    // pool
    $poolArray(rawBounds);

    const rectangle = new Rectangle(
        bounds[0], bounds[1],
        Math.abs(bounds[2] - bounds[0]),
        Math.abs(bounds[3] - bounds[1])
    );

    // pool
    $poolArray(bounds);

    const parent = display_object.parent;
    const point = parent
        ? parent.globalToLocal(new Point(x, y))
        : new Point(x, y);

    return rectangle.containsPoint(point);
};