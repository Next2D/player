import type { DisplayObject } from "../../DisplayObject";
import { ColorTransform } from "@next2d/geom";
import { execute as displayObjectGetRawColorTransformUseCase } from "./DisplayObjectGetRawColorTransformUseCase";

/**
 * @description DisplayObject の ColorTransform を取得します。
 *              Get the ColorTransform of DisplayObject.
 *
 * @param  {D} display_object
 * @return {ColorTransform}
 * @method
 * @protected
 */
export const execute = <D extends DisplayObject> (display_object: D): ColorTransform =>
{
    const colorTransform = displayObjectGetRawColorTransformUseCase(display_object);
    return colorTransform
        ? new ColorTransform(
            colorTransform[0], colorTransform[1], colorTransform[2], colorTransform[3],
            colorTransform[4], colorTransform[5], colorTransform[6], colorTransform[7]
        )
        : new ColorTransform();
};