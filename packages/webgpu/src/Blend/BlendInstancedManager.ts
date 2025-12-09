import type { Node } from "@next2d/texture-packer";
import type { IComplexBlendItem } from "../interface/IComplexBlendItem";
import { ShaderInstancedManager } from "../Shader/ShaderInstancedManager";
import { $getCurrentBlendMode, $setCurrentBlendMode } from "../Blend";
import { $getCurrentAtlasIndex, $setCurrentAtlasIndex, $setActiveAtlasIndex } from "../AtlasManager";
import { renderQueue } from "@next2d/render-queue";

/**
 * @description 複雑なブレンドモード描画キュー
 */
let $complexBlendQueue: IComplexBlendItem[] = [];

/**
 * @description 複雑なブレンドモードの描画キューを取得
 * @return {IComplexBlendItem[]}
 */
export const getComplexBlendQueue = (): IComplexBlendItem[] =>
{
    return $complexBlendQueue;
};

/**
 * @description 複雑なブレンドモードの描画キューをクリア
 * @return {void}
 */
export const clearComplexBlendQueue = (): void =>
{
    $complexBlendQueue = [];
};

/**
 * @description インスタンスシェーダーマネージャーのキャッシュ
 * @private
 */
const shaderManagers = new Map<string, ShaderInstancedManager>();

/**
 * @description インスタンスシェーダーマネージャーを取得
 * @return {ShaderInstancedManager}
 */
export const getInstancedShaderManager = (): ShaderInstancedManager =>
{
    const key = "blend_instanced";
    if (!shaderManagers.has(key)) {
        shaderManagers.set(key, new ShaderInstancedManager("instanced", true));
    }
    return shaderManagers.get(key)!;
};

/**
 * @description DisplayObject単体の描画をインスタンス配列に追加
 * @param {Node} node
 * @param {number} x_min
 * @param {number} y_min
 * @param {number} x_max
 * @param {number} y_max
 * @param {Float32Array} color_transform
 * @param {Float32Array} matrix
 * @param {string} blend_mode
 * @param {number} viewport_width
 * @param {number} viewport_height
 * @param {number} render_max_size
 * @param {number} global_alpha
 * @return {void}
 */
export const addDisplayObjectToInstanceArray = (
    node: Node,
    x_min: number,
    y_min: number,
    x_max: number,
    y_max: number,
    color_transform: Float32Array,
    matrix: Float32Array,
    blend_mode: string,
    viewport_width: number,
    viewport_height: number,
    render_max_size: number,
    global_alpha: number
): void => {

    // WebGL版と同じ: mulColor.a には globalAlpha を使用
    const ct0 = color_transform[0];
    const ct1 = color_transform[1];
    const ct2 = color_transform[2];
    const ct3 = global_alpha; // WebGL: $context.globalAlpha
    const ct4 = color_transform[4] / 255;
    const ct5 = color_transform[5] / 255;
    const ct6 = color_transform[6] / 255;
    const ct7 = 0;

    // シンプルなブレンドモード（インスタンス描画可能）
    const simpleBlendModes = ["normal", "layer", "add", "screen", "alpha", "erase", "copy"];
    
    if (simpleBlendModes.includes(blend_mode)) {
        // ブレンドモードまたはアトラスインデックスが変わった場合
        if ($getCurrentBlendMode() !== blend_mode || $getCurrentAtlasIndex() !== node.index) {
            // 現在のバッチを描画してから切り替え
            $setCurrentBlendMode(blend_mode as any);
            $setCurrentAtlasIndex(node.index);
            $setActiveAtlasIndex(node.index);
        }

        // インスタンスデータを配列に追加
        const shaderManager = getInstancedShaderManager();

        renderQueue.push(
            // texture rectangle (vec4) - normalized coordinates
            node.x / render_max_size, node.y / render_max_size,
            node.w / render_max_size, node.h / render_max_size,
            // texture width, height and viewport width, height (vec4)
            node.w, node.h, viewport_width, viewport_height,
            // matrix tx, ty (vec2) + padding (vec2)
            matrix[6], matrix[7], 0, 0,
            // matrix scale0, rotate0, scale1, rotate1 (vec4)
            matrix[0], matrix[1], matrix[3], matrix[4],
            // mulColor (vec4)
            ct0, ct1, ct2, ct3,
            // addColor (vec4)
            ct4, ct5, ct6, ct7
        );

        shaderManager.count++;
    } else {
        // 複雑なブレンドモード（個別描画が必要）
        // キューに追加して後で処理
        $complexBlendQueue.push({
            node,
            x_min,
            y_min,
            x_max,
            y_max,
            color_transform: new Float32Array(color_transform),
            matrix: new Float32Array(matrix),
            blend_mode,
            viewport_width,
            viewport_height,
            render_max_size,
            global_alpha
        });

        // ブレンドモードをセット
        $setCurrentBlendMode(blend_mode as any);
        $setCurrentAtlasIndex(node.index);
        $setActiveAtlasIndex(node.index);
    }
};
