import type { DisplayObject } from "../../DisplayObject";
import { $poolArray } from "../../DisplayObjectUtil";
import { execute as displayObjectGetCalcBoundsUseCase } from "./DisplayObjectGetCalcBoundsUseCase";

/**
 * @description DisplayObjectの高さを返却
 *              DisplayObject height returned
 * 
 * @param  {DisplayObject} display_object 
 * @return {number}
 * @method
 * @protected
 */
export const execute = <D extends DisplayObject>(display_object: D): number =>
{
    const bounds = displayObjectGetCalcBoundsUseCase(display_object);

    const height: number = Math.abs(bounds[3] - bounds[1]);
    $poolArray(bounds);

    switch (true) {

        case height === 0:
        case height === Infinity:
        case height === -Infinity:
            return 0;

        default:
            return +height.toFixed(2);

    }
};