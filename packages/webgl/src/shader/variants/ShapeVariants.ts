import type { ShaderManager } from "../ShaderManager";

/**
 * @description シェイプのシェーダー管理クラスのコレクション
 *              Collection of shape shader management classes
 *
 * @type {Map<string, ShaderManager>}
 * @public
 */
export const $collection: Map<string, ShaderManager> = new Map();