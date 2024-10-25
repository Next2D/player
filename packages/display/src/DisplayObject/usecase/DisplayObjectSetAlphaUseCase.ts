import { ColorTransform } from "@next2d/geom";
import type { DisplayObject } from "../../DisplayObject";
import { $clamp } from "../../DisplayObjectUtil";
import { execute as displayObjectApplyChangesService } from "../service/DisplayObjectApplyChangesService";
import { execute as displayObjectGetRawColorTransformUseCase } from "../usecase/DisplayObjectGetRawColorTransformUseCase";

/**
 * @description DisplayObjectのalphaを設定
 *              Set the alpha of the DisplayObject
 * 
 * @param  {DisplayObject} display_object
 * @param  {number} alpha
 * @return {void}
 * @method
 * @protected
 */
export const execute = <D extends DisplayObject>(display_object: D, alpha: number): void =>
{
    alpha = $clamp(alpha, 0, 1);
    if (display_object.$alpha === alpha) {
        return ;
    }

    display_object.$alpha = alpha;

    let colorTransform = display_object.$colorTransform;
    if (!colorTransform) {
        const rawData = displayObjectGetRawColorTransformUseCase(display_object);
        colorTransform = rawData 
            ? new ColorTransform(...rawData) 
            : new ColorTransform();
    }

    colorTransform.alphaMultiplier = alpha;
    colorTransform.alphaOffset     = 0;
    display_object.$colorTransform = colorTransform;
    displayObjectApplyChangesService(display_object);
};