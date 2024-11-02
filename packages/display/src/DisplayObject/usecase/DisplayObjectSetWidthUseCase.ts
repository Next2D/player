import type { DisplayObject } from "../../DisplayObject";
import { execute as displayObjectGetRawBoundsUseCase } from "./DisplayObjectGetRawBoundsUseCase";
import { execute as displayObjectSetScaleXUseCase } from "./DisplayObjectSetScaleXUseCase";

/**
 * @description DisplayObjectの幅を設定します
 * 　　　　　　　　Sets the width of the DisplayObject
 *
 * @param  {DisplayObject} display_object 
 * @param  {number} width 
 * @return {void}
 * @method
 * @protected
 */
export const execute = <D extends DisplayObject>(display_object: D, width: number): void =>
{
    width = +width;
    if (isNaN(width) || 0 > width) {
        return ;
    }

    const rawBounds = displayObjectGetRawBoundsUseCase(display_object);

    let rawWidth = Math.abs(rawBounds[2] - rawBounds[0]);
    switch (true) {

        case rawWidth === 0:
        case rawWidth === Infinity:
        case rawWidth === -Infinity:
            return ;

        default:
            rawWidth = +rawWidth.toFixed(2);
            break;

    }

    displayObjectSetScaleXUseCase(display_object, width / rawWidth);
};