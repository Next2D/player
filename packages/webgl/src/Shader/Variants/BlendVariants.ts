import type { ShaderInstancedManager } from "../ShaderInstancedManager";
import type { ShaderManager } from "../ShaderManager";

/**
 * @description ブレンドのシェーダー管理クラスのコレクション
 *              Collection of blend shader management classes
 *
 * @type {Map<string, ShaderInstancedManager>}
 * @public
 */
export const $collection: Map<string, ShaderManager | ShaderInstancedManager> = new Map();