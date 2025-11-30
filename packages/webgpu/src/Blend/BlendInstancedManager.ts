import type { Node } from "@next2d/texture-packer";
import { ShaderInstancedManager } from "../Shader/ShaderInstancedManager";
import { $getCurrentBlendMode, $setCurrentBlendMode } from "../Blend";
import { $getCurrentAtlasIndex, $setCurrentAtlasIndex, $setActiveAtlasIndex } from "../AtlasManager";
import { renderQueue } from "@next2d/render-queue";

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
 * @return {void}
 */
export const addDisplayObjectToInstanceArray = (
    node: Node,
    _x_min: number,
    _y_min: number,
    _x_max: number,
    _y_max: number,
    color_transform: Float32Array,
    matrix: Float32Array,
    blend_mode: string,
    viewport_width: number,
    viewport_height: number,
    render_max_size: number
): void => {

    const ct0 = color_transform[0];
    const ct1 = color_transform[1];
    const ct2 = color_transform[2];
    const ct3 = color_transform[3]; // alpha
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

        console.log(`[WebGPU] Adding instance: count=${shaderManager.count}, offset before=${renderQueue.offset}`);

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

        console.log(`[WebGPU] After push: offset=${renderQueue.offset}, expected=${(shaderManager.count + 1) * 24}`);

        shaderManager.count++;
    } else {
        // 複雑なブレンドモード（個別描画が必要）
        // TODO: 複雑なブレンドモード処理を実装
        console.log("[WebGPU] Complex blend mode not yet implemented:", blend_mode);
        
        // 現在のバッチを描画
        $setCurrentBlendMode(blend_mode as any);
        $setCurrentAtlasIndex(node.index);
        $setActiveAtlasIndex(node.index);
    }
};
