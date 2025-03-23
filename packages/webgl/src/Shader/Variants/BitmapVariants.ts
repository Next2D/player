import type { ShaderManager } from "../ShaderManager";

/**
 * @description Bitmapのシェーダー管理クラスのコレクション
 *              Collection of Bitmap shader management classes
 *
 * @type {Map<string, ShaderManager>}
 * @public
 */
export const $collection: Map<string, ShaderManager> = new Map();