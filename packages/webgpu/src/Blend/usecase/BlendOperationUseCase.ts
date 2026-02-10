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
 * @return {boolean} ブレンドモードが変更されたかどうか
 * @method
 * @protected
 */
export const execute = (operation: IBlendMode): boolean =>
{
    switch (operation) {

        case "add":
            return blendAddService();

        case "screen":
            return blendScreenService();

        case "alpha":
            return blendAlphaService();

        case "erase":
            return blendEraseService();

        case "copy":
            return blendOneZeroService();

        default:
            return blendResetService();

    }
};
