import type { Node } from "@next2d/texture-packer";

/**
 * @description 複雑なブレンドモードの描画キュー
 *              Complex blend mode rendering queue
 */
export interface IComplexBlendItem {
    node: Node;
    x_min: number;
    y_min: number;
    x_max: number;
    y_max: number;
    color_transform: Float32Array;
    matrix: Float32Array;
    blend_mode: string;
    viewport_width: number;
    viewport_height: number;
    render_max_size: number;
    global_alpha: number;
}
