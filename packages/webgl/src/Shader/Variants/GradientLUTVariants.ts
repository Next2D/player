import type { ShaderManager } from "../ShaderManager";

/**
 * @description シェーダーキャッシュの最大サイズ
 *              Maximum shader cache size
 *
 * @type {number}
 * @const
 */
const MAX_SHADER_CACHE_SIZE: number = 16;

/**
 * @description グラデーションLUTのシェーダー管理クラスのコレクション
 *              Collection of gradient LUT shader management classes
 *
 * @type {Map<string, ShaderManager>}
 * @public
 */
export const $collection: Map<string, ShaderManager> = new Map();

/**
 * @description 使用順序を追跡するためのキュー
 *              Queue for tracking usage order (LRU)
 *
 * @type {string[]}
 * @private
 */
const $usageOrder: string[] = [];

/**
 * @description シェーダーをキャッシュに追加（LRU方式）
 *              Add shader to cache (LRU method)
 *
 * @param  {string} key
 * @param  {ShaderManager} shader
 * @return {void}
 * @method
 * @protected
 */
export const $addToCache = (key: string, shader: ShaderManager): void =>
{
    // すでに存在する場合は使用順序を更新
    const existingIndex = $usageOrder.indexOf(key);
    if (existingIndex !== -1) {
        $usageOrder.splice(existingIndex, 1);
    }

    // キャッシュサイズ制限を超える場合、最も古いエントリを削除
    while ($collection.size >= MAX_SHADER_CACHE_SIZE && $usageOrder.length > 0) {
        const oldestKey = $usageOrder.shift();
        if (oldestKey) {
            $collection.delete(oldestKey);
        }
    }

    $collection.set(key, shader);
    $usageOrder.push(key);
};

/**
 * @description キャッシュからシェーダーを取得（使用順序を更新）
 *              Get shader from cache (update usage order)
 *
 * @param  {string} key
 * @return {ShaderManager | undefined}
 * @method
 * @protected
 */
export const $getFromCache = (key: string): ShaderManager | undefined =>
{
    const shader = $collection.get(key);
    if (shader) {
        // 使用順序を更新
        const index = $usageOrder.indexOf(key);
        if (index !== -1) {
            $usageOrder.splice(index, 1);
            $usageOrder.push(key);
        }
    }
    return shader;
};