import type { ShaderManager } from "../../ShaderManager";

/**
 * @description BitmapFilterのUniformを設定します。
 *              Set the Uniform of the BitmapFilter.
 *
 * @param  {ShaderManager} shader_manager
 * @param  {number} width
 * @param  {number} height
 * @param  {number} base_width
 * @param  {number} base_height
 * @param  {number} base_offset_x
 * @param  {number} base_offset_y
 * @param  {number} blur_width
 * @param  {number} blur_height
 * @param  {number} blur_offset_x
 * @param  {number} blur_offset_y
 * @param  {boolean} is_glow
 * @param  {number} strength
 * @param  {number} color_r1
 * @param  {number} color_g1
 * @param  {number} color_b1
 * @param  {number} color_a1
 * @param  {number} color_r2
 * @param  {number} color_g2
 * @param  {number} color_b2
 * @param  {number} color_a2
 * @param  {boolean} transforms_base
 * @param  {boolean} transforms_blur
 * @param  {boolean} applies_strength
 * @param  {boolean} is_gradient
 * @return {void}
 * @method
 * @protected
 */
export const execute = (
    shader_manager: ShaderManager,
    width: number,
    height: number,
    base_width: number,
    base_height: number,
    base_offset_x: number,
    base_offset_y: number,
    blur_width: number,
    blur_height: number,
    blur_offset_x: number,
    blur_offset_y: number,
    is_glow: boolean,
    strength: number,
    color_r1: number,
    color_g1: number,
    color_b1: number,
    color_a1: number,
    color_r2: number,
    color_g2: number,
    color_b2: number,
    color_a2: number,
    transforms_base: boolean,
    transforms_blur: boolean,
    applies_strength: boolean,
    is_gradient: boolean
): void => {

    let textures: Int32Array | Float32Array;

    // fragment: u_textures
    if (transforms_base) {

        textures = shader_manager.textures;
        textures[0] = 0;
        textures[1] = 1;
        if (is_gradient) {
            textures[2] = 2;
        }

    } else if (is_gradient) {

        textures = shader_manager.textures;
        textures[0] = 0;
        textures[1] = 2;

    }

    const mediump: Int32Array | Float32Array = shader_manager.mediump;

    let i = 0;

    if (transforms_base) {
        // fragment: u_uv_scale
        mediump[i++] = width / base_width;
        mediump[i++] = height / base_height;
        // fragment: u_uv_offset
        mediump[i++] = base_offset_x / base_width;
        mediump[i++] = (height - base_height - base_offset_y) / base_height;
    }

    if (transforms_blur) {
        // fragment: u_st_scale
        mediump[i++] = width / blur_width;
        mediump[i++] = height / blur_height;
        // fragment: u_st_offset
        mediump[i++] = blur_offset_x / blur_width;
        mediump[i++] = (height - blur_height - blur_offset_y) / blur_height;
    }

    if (is_gradient) {
        // do nothing
    } else if (is_glow) {
        // fragment: u_color
        mediump[i++] = color_r1;
        mediump[i++] = color_g1;
        mediump[i++] = color_b1;
        mediump[i++] = color_a1;
    } else {
        // fragment: u_highlight_color
        mediump[i++] = color_r1;
        mediump[i++] = color_g1;
        mediump[i++] = color_b1;
        mediump[i++] = color_a1;
        // fragment: u_shadow_color
        mediump[i++] = color_r2;
        mediump[i++] = color_g2;
        mediump[i++] = color_b2;
        mediump[i++] = color_a2;
    }

    if (applies_strength) {
        // fragment: u_strength
        mediump[i] = strength;
    }
};