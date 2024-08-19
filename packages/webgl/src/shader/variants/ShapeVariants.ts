import type { ShaderManager } from "../ShaderManager";

/**
 * @description シェーダー管理クラスのコレクション
 *              Collection of shader management classes
 * 
 * @type {Map<string, ShaderManager>}
 * @public
 */
export const $collection: Map<string, ShaderManager> = new Map();