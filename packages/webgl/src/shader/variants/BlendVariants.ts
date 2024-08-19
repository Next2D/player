import type { ShaderManager } from "../ShaderManager";

/**
 * @description ブレンドのシェーダー管理クラスのコレクション
 *              Collection of blend shader management classes
 * 
 * @type {Map<string, ShaderManager>}
 * @public
 */
export const $collection: Map<string, ShaderManager> = new Map();