import type { IBlendMode } from "../../interface/IBlendMode";
import { $setCurrentBlendMode } from "../../Blend";

/**
 * @description ブレンドモードを設定するサービス
 *              Service to set blend mode
 *
 * @param  {IBlendMode} mode
 * @return {void}
 * @method
 * @protected
 */
export const execute = (mode: IBlendMode): void =>
{
    $setCurrentBlendMode(mode);
};
