import type { DisplayObject } from "../../DisplayObject";
import { $poolBoundsArray } from "../../DisplayObjectUtil";
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
    $poolBoundsArray(bounds);

    switch (true) {

        case height === 0:
        case height === Infinity:
        case height === -Infinity:
            return 0;

        default:
            return Math.round(height * 100) / 100;

    }
};