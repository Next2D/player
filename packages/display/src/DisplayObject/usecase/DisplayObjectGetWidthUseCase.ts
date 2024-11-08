import type { DisplayObject } from "../../DisplayObject";
import { $poolArray } from "../../DisplayObjectUtil";
import { execute as displayObjectGetCalcBoundsUseCase } from "./DisplayObjectGetCalcBoundsUseCase";

/**
 * @description DisplayObjectの幅を返却
 *              DisplayObject width returned
 *
 * @param  {DisplayObject} display_object
 * @return {number}
 * @method
 * @protected
 */
export const execute = <D extends DisplayObject>(display_object: D): number =>
{
    const bounds = displayObjectGetCalcBoundsUseCase(display_object);

    const width: number = Math.abs(bounds[2] - bounds[0]);
    $poolArray(bounds);

    switch (true) {

        case width === 0:
        case width === Infinity:
        case width === -Infinity:
            return 0;

        default:
            return +width.toFixed(2);

    }
};