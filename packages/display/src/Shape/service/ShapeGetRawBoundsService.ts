import type { Shape } from "../../Shape";
import { $getArray } from "../../DisplayObjectUtil";

/**
 * @description Shapeのローカルバウンディングボックスを取得します。
 *              Get the local bounding box of the Shape.
 *
 * @param  {Shape} shape
 * @return {number[]}
 * @protected
 */
export const execute = (shape: Shape): number[] =>
{
    const graphics = shape.graphics;
    return $getArray(
        graphics.xMin,
        graphics.yMin,
        graphics.xMax,
        graphics.yMax
    );
};