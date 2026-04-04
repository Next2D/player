import type { Node } from "@next2d/texture-packer";

/**
 * @description 複雑なブレンドモードの描画キュー
 *              Complex blend mode rendering queue
 */
export interface IComplexBlendItem {
    /**
     * @description テクスチャアトラスのノード
     *              Texture atlas node
     */
    node: Node;
    /**
     * @description 描画領域のX最小座標
     *              Minimum X coordinate of the rendering area
     */
    x_min: number;
    /**
     * @description 描画領域のY最小座標
     *              Minimum Y coordinate of the rendering area
     */
    y_min: number;
    /**
     * @description 描画領域のX最大座標
     *              Maximum X coordinate of the rendering area
     */
    x_max: number;
    /**
     * @description 描画領域のY最大座標
     *              Maximum Y coordinate of the rendering area
     */
    y_max: number;
    /**
     * @description カラー変換配列
     *              Color transform array
     */
    color_transform: Float32Array;
    /**
     * @description 変換行列
     *              Transformation matrix
     */
    matrix: Float32Array;
    /**
     * @description ブレンドモード名
     *              Blend mode name
     */
    blend_mode: string;
    /**
     * @description ビューポートの幅
     *              Viewport width
     */
    viewport_width: number;
    /**
     * @description ビューポートの高さ
     *              Viewport height
     */
    viewport_height: number;
    /**
     * @description レンダリング最大サイズ
     *              Maximum render size
     */
    render_max_size: number;
    /**
     * @description グローバル透明度
     *              Global alpha transparency
     */
    global_alpha: number;
}
