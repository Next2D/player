import type { ShaderManager } from "../ShaderManager";

/**
 * @description フィルターのシェーダー管理クラスのコレクション
 *              Collection of filter shader management classes
 *
 * @type {Map<string, ShaderInstancedManager>}
 * @public
 */
export const $collection: Map<string, ShaderManager> = new Map();