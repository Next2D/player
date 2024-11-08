import type { DisplayObject } from "../../DisplayObject";
import { execute as displayObjectGetRawBoundsUseCase } from "./DisplayObjectGetRawBoundsUseCase";
import { execute as displayObjectSetScaleYUseCase } from "./DisplayObjectSetScaleYUseCase";

/**
 * @description DisplayObjectの高さを設定します
 *              Sets the height of the DisplayObject
 *
 * @param  {DisplayObject} display_object
 * @param  {number} height
 * @return {void}
 * @method
 * @protected
 */
export const execute = <D extends DisplayObject>(display_object: D, height: number): void =>
{
    height = +height;
    if (isNaN(height) || 0 > height) {
        return ;
    }

    const rawBounds = displayObjectGetRawBoundsUseCase(display_object);

    let rawHeight = Math.abs(rawBounds[3] - rawBounds[1]);
    switch (true) {

        case rawHeight === 0:
        case rawHeight === Infinity:
        case rawHeight === -Infinity:
            return ;

        default:
            rawHeight = +rawHeight.toFixed(2);
            break;

    }

    displayObjectSetScaleYUseCase(display_object, height / rawHeight);
};