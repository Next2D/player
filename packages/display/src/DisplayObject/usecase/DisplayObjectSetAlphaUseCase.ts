import { ColorTransform } from "@next2d/geom";
import type { DisplayObject } from "../../DisplayObject";
import { $clamp } from "../../DisplayObjectUtil";
import { execute as displayObjectApplyChangesService } from "../service/DisplayObjectApplyChangesService";

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
    if (display_object.$colorTransform) {
        const rawData = display_object.$colorTransform.rawData;
        rawData[3] = alpha;
        rawData[7] = 0;
    } else {
        display_object.$colorTransform = new ColorTransform(1, 1, 1, alpha);
    }
    
    displayObjectApplyChangesService(display_object);
};