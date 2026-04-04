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
    $poolBoundsArray,
    $colorContext,
    $getFloat32Array6,
    $poolFloat32Array6
} from "../../DisplayObjectUtil";

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

        $colorContext.setTransform(1, 0, 0, 1, 0, 0);
        $colorContext.beginPath();

        $hitObject.x = x;
        $hitObject.y = y;
        $hitObject.hit = null;

        switch (true) {

            case display_object.isContainerEnabled:
                return displayObjectContainerMouseHitUseCase(
                    display_object as unknown as DisplayObjectContainer,
                    $colorContext,
                    matrix,
                    $hitObject
                );

            case display_object.isShape:
                return shapeHitTestUseCase(
                    display_object as unknown as Shape,
                    $colorContext,
                    matrix,
                    $hitObject
                );

            case display_object.isText:
                return textFieldHitTestUseCase(
                    display_object as unknown as TextField,
                    $colorContext,
                    matrix,
                    $hitObject
                );

            case display_object.isVideo:
                return videoHitTestUseCase(
                    display_object as unknown as Video,
                    $colorContext,
                    matrix,
                    $hitObject
                );

            default:
                return false;

        }
    }

    const rawBounds = displayObjectGetRawBoundsUseCase(display_object);
    const martix = displayObjectGetRawMatrixUseCase(display_object);

    // cacheAsBitmap倍率をhitTest用のmatrixに適用
    const cacheMatrix = display_object.cacheAsBitmap;
    let hitMatrix = martix ? martix : $MATRIX_ARRAY_IDENTITY;
    let scaledMatrix: Float32Array | null = null;
    if (cacheMatrix && hitMatrix) {
        const m = cacheMatrix.rawData;
        const csx = Math.sqrt(m[0] * m[0] + m[1] * m[1]);
        const csy = Math.sqrt(m[2] * m[2] + m[3] * m[3]);
        scaledMatrix = $getFloat32Array6(
            hitMatrix[0] * csx, hitMatrix[1] * csx,
            hitMatrix[2] * csy, hitMatrix[3] * csy,
            hitMatrix[4], hitMatrix[5]
        );
        hitMatrix = scaledMatrix;
    }

    const bounds = displayObjectCalcBoundsMatrixService(
        rawBounds[0], rawBounds[1],
        rawBounds[2], rawBounds[3],
        hitMatrix
    );

    // pool
    $poolBoundsArray(rawBounds);
    if (scaledMatrix) {
        $poolFloat32Array6(scaledMatrix);
    }

    const rectangle = new Rectangle(
        bounds[0], bounds[1],
        Math.abs(bounds[2] - bounds[0]),
        Math.abs(bounds[3] - bounds[1])
    );

    // pool
    $poolBoundsArray(bounds);

    const parent = display_object.parent;
    const point = parent
        ? parent.globalToLocal(new Point(x, y))
        : new Point(x, y);

    return rectangle.containsPoint(point);
};