import type { Point } from "../../Point";

/**
 * @description (0,0) と現在のポイント間の線のセグメントを設定された長さに拡大 / 縮小します。
 *              Expands / contracts the line segment between (0,0) and the current point to the specified length.
 *
 * @param  {number} thickness
 * @return {void}
 * @method
 * @public
 */
export const execute = (src: Point, thickness: number): void =>
{
    const value = thickness / src.length;
    src.x *= value;
    src.y *= value;
};