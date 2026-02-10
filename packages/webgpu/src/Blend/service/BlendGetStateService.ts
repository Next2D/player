import type { IBlendMode } from "../../interface/IBlendMode";
import type { IBlendState } from "../../Blend";
import { $getBlendState } from "../../Blend";

/**
 * @description ブレンドモードからWebGPUブレンドステートを取得するサービス
 *              Service to get WebGPU blend state from blend mode
 *
 * @param  {IBlendMode} mode
 * @return {IBlendState}
 * @method
 * @protected
 */
export const execute = (mode: IBlendMode): IBlendState =>
{
    return $getBlendState(mode);
};
