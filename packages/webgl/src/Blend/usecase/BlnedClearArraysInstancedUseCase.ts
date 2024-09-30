import { execute as variantsBlendInstanceShaderService } from "../../Shader/Variants/Blend/service/VariantsBlendInstanceShaderService";

/**
 * @description リサイズなどのイベント発火時には描画情報を初期化します
 *              Initialize drawing information when an event such as resizing is fired
 *
 * @return {void}
 * @method
 * @protected
 */
export const execute = (): void =>
{
    const shaderInstancedManager = variantsBlendInstanceShaderService();
    shaderInstancedManager.clear();
};