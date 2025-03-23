import type { ShaderManager } from "../../ShaderManager";

/**
 * @description ディスプレイスメントマップ・フィルタのユニフォームを設定する
 *              Set the uniform of the displacement map filter
 *
 * @param  {ShaderManager} shader_manager
 * @param  {number} map_width
 * @param  {number} map_height
 * @param  {number} base_width
 * @param  {number} base_height
 * @param  {number} point_x
 * @param  {number} point_y
 * @param  {number} scale_x
 * @param  {number} scale_y
 * @param  {number} mode
 * @param  {number} color_r
 * @param  {number} color_g
 * @param  {number} color_b
 * @param  {number} color_a
 * @return {void}
 * @method
 * @protected
 */
export const execute = (
    shader_manager: ShaderManager,
    map_width: number,
    map_height: number,
    base_width: number,
    base_height: number,
    point_x: number,
    point_y: number,
    scale_x: number,
    scale_y: number,
    mode: number,
    color_r: number,
    color_g: number,
    color_b: number,
    color_a: number
): void => {

    const textures: Int32Array | Float32Array = shader_manager.textures;
    textures[0] = 0;
    textures[1] = 1;

    const mediump: Int32Array | Float32Array = shader_manager.mediump;

    // fragment: u_uv_to_st_scale
    mediump[0] = base_width  / map_width;
    mediump[1] = base_height / map_height;
    // fragment: u_uv_to_st_offset
    mediump[2] = point_x / map_width;
    mediump[3] = (base_height - map_height - point_y) / map_height;

    // fragment: u_scale
    mediump[4] =  scale_x / base_width;
    mediump[5] = -scale_y / base_height;

    if (mode === 1) {
        // fragment: u_substitute_color
        mediump[8]  = color_r;
        mediump[9]  = color_g;
        mediump[10] = color_b;
        mediump[11] = color_a;
    }
};