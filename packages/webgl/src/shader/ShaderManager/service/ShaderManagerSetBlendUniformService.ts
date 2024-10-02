import type { ShaderManager } from "../../ShaderManager";

/**
 * @description ShaderManagerのブレンドモードののuniform変数を設定します。
 *              Set the uniform variable of the blend mode of ShaderManager.
 *
 * @param  {ShaderManager} shader_manager
 * @param  {number} ct0
 * @param  {number} ct1
 * @param  {number} ct2
 * @param  {number} ct3
 * @param  {number} ct4
 * @param  {number} ct5
 * @param  {number} ct6
 * @param  {number} ct7
 * @return {void}
 * @method
 * @protected
 */
export const execute = (
    shader_manager: ShaderManager,
    ct0: number, ct1: number, ct2: number, ct3: number,
    ct4: number, ct5: number, ct6: number, ct7: number
): void => {

    const textures: Int32Array | Float32Array = shader_manager.textures;
    textures[0] = 0;
    textures[1] = 1;

    const mediump: Int32Array | Float32Array = shader_manager.mediump;

    // fragment: u_color_transform_mul
    mediump[0] = ct0;
    mediump[1] = ct1;
    mediump[2] = ct2;
    mediump[3] = ct3;

    // fragment: u_color_transform_add
    mediump[4] = ct4;
    mediump[5] = ct5;
    mediump[6] = ct6;
    mediump[7] = ct7;
};