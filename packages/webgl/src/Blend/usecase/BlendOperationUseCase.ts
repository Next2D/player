import type { IBlendMode } from "../../interface/IBlendMode";
import { execute as blendAddService } from "../service/BlendAddService";
import { execute as blendResetService } from "../service/BlendResetService";
import { execute as blendScreenService } from "../service/BlendScreenService";
import { execute as blendAlphaService } from "../service/BlendAlphaService";
import { execute as blendEraseService } from "../service/BlendEraseService";
import { execute as blendOneZeroService } from "../service/BlendOneZeroService";

/**
 * @description 設定されたブレンドモードへ切り替える
 *              Switch to the set blend mode
 * 
 * @param  {IBlendMode} operation
 * @return {void}
 * @method
 * @protected
 */
export const execute = (operation: IBlendMode): void =>
{
    switch (operation) {

        case "add":
            blendAddService();
            break;

        case "screen":
            blendScreenService();
            break;

        case "alpha":
            blendAlphaService();
            break;

        case "erase":
            blendEraseService();
            break;

        case "copy":
            blendOneZeroService();
            break;

        default:
            blendResetService();
            break;

    }
};