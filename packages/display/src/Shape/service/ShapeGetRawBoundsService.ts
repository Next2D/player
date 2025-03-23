import type { Shape } from "../../Shape";
import { $getBoundsArray } from "../../DisplayObjectUtil";

/**
 * @description Shapeのローカルバウンディングボックスを取得します。
 *              Get the local bounding box of the Shape.
 *
 * @param  {Shape} shape
 * @return {Float32Array}
 * @protected
 */
export const execute = (shape: Shape): Float32Array =>
{
    const graphics = shape.graphics;
    return $getBoundsArray(
        graphics.xMin,
        graphics.yMin,
        graphics.xMax,
        graphics.yMax
    );
};