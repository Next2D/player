import type { ShaderManager } from "../ShaderManager";

/**
 * @description グラデーションLUTのシェーダー管理クラスのコレクション
 *              Collection of gradient LUT shader management classes
 * 
 * @type {Map<string, ShaderManager>}
 * @public
 */
export const $collection: Map<string, ShaderManager> = new Map();