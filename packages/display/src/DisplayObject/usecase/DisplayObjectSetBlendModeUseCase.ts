import type { DisplayObject } from "../../DisplayObject";
import { execute as displayObjectApplyChangesService } from "../service/DisplayObjectApplyChangesService";
import type { IBlendMode } from "../../interface/IBlendMode";

/**
 * @description DisplayObjectのブレンドモードをセット
 *              Set the blend mode of the DisplayObject
 * 
 * @param  {DisplayObject} display_object
 * @param  {IBlendMode} blend_mode
 * @return {void}
 * @method
 * @protected
 */
export const execute = <D extends DisplayObject>(display_object: D, blend_mode: IBlendMode): void =>
{
    if (display_object.$blendMode === blend_mode) {
        return ;
    }
    display_object.$blendMode = blend_mode;
    displayObjectApplyChangesService(display_object);
};