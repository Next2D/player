import type { DisplayObject } from "../../DisplayObject";
import { execute as displayObjectGetRawColorTransformUseCase } from "../usecase/DisplayObjectGetRawColorTransformUseCase";

/**
 * @description DisplayObjectのalphaを返却
 *              Returns the alpha of the DisplayObject
 *
 * @param  {DisplayObject} display_object
 * @return {number}
 * @method
 * @protected
 */
export const execute = <D extends DisplayObject>(display_object: D): number =>
{
    if (display_object.$alpha !== null) {
        return display_object.$alpha;
    }

    if (display_object.$colorTransform) {
        const rawData = display_object.$colorTransform.rawData;
        return rawData[3] + rawData[7] / 255;
    }

    const colorTransform = displayObjectGetRawColorTransformUseCase(display_object);
    if (colorTransform) {
        return colorTransform[3] + colorTransform[7] / 255;
    }

    return 1;
};