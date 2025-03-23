import type { ShaderManager } from "../../ShaderManager";

/**
 * @description ぼかしフィルターのUniformを設定します。
 *              Set the Uniform of the blur filter.
 *
 * @param  {ShaderManager} shader_manager
 * @param  {number} width
 * @param  {number} height
 * @param  {boolean} is_horizontal
 * @param  {number} fraction
 * @param  {number} samples
 * @return {void}
 * @method
 * @protected
 */
export const execute = (
    shader_manager: ShaderManager,
    width: number,
    height: number,
    is_horizontal: boolean,
    fraction: number,
    samples: number
): void => {

    const mediump: Int32Array | Float32Array = shader_manager.mediump;

    // fragment: u_offset
    if (is_horizontal) {
        mediump[0] = 1 / width;
        mediump[1] = 0;
    } else {
        mediump[0] = 0;
        mediump[1] = 1 / height;
    }

    // fragment: u_fraction
    mediump[2] = fraction;

    // fragment: u_samples
    mediump[3] = samples;
};