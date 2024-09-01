import type { ShaderInstancedManager } from "../ShaderInstancedManager";

/**
 * @description ブレンドのシェーダー管理クラスのコレクション
 *              Collection of blend shader management classes
 * 
 * @type {Map<string, ShaderInstancedManager>}
 * @public
 */
export const $collection: Map<string, ShaderInstancedManager> = new Map();