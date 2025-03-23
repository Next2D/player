import type { ShaderManager } from "../../ShaderManager";

/**
 * @description ShaderManagerのブレンドモードののuniform変数を設定します。
 *              Set the uniform variable of the blend mode of ShaderManager.
 *
 * @param  {ShaderManager} shader_manager
 * @return {void}
 * @method
 * @protected
 */
export const execute = (shader_manager: ShaderManager): void =>
{
    const textures: Int32Array | Float32Array = shader_manager.textures;
    textures[0] = 0;
    textures[1] = 1;
};