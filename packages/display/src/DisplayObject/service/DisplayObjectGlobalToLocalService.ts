import type { DisplayObject } from "../../DisplayObject";
import { Point, Matrix } from "@next2d/geom";

/**
 * @description point オブジェクトを表示オブジェクトの（ローカル）座標からステージ（グローバル）座標に変換します。
 *              Converts the point object from the display object's (local) coordinates to the Stage (global) coordinates.
 *
 * @param  {DisplayObject} display_object
 * @param  {Point} point
 * @return {Point}
 * @method
 * @protected
 */
export const execute = <D extends DisplayObject>(display_object: D, point: Point): Point =>
{
    const matrix = display_object.concatenatedMatrix;
    matrix.invert();

    const newPoint = new Point(
        point.x * matrix.a + point.y * matrix.c + matrix.tx,
        point.x * matrix.b + point.y * matrix.d + matrix.ty
    );

    Matrix.release(matrix.rawData);

    return newPoint;
};