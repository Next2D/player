/**
 * @description GPUTexture → GPUTextureView キャッシュ（createView()呼び出し削減）
 *              GPUTexture to GPUTextureView cache to reduce createView() calls
 * @type {WeakMap<GPUTexture, GPUTextureView>}
 */
const $viewCache = new WeakMap<GPUTexture, GPUTextureView>();

/**
 * @description キャッシュからビューを取得、なければ生成してキャッシュに保存
 *              Get view from cache, or create and cache a new one
 * @param  {GPUTexture} texture
 * @return {GPUTextureView}
 */
export const $getOrCreateView = (texture: GPUTexture): GPUTextureView => {
    let view = $viewCache.get(texture);
    if (!view) {
        view = texture.createView();
        $viewCache.set(texture, view);
    }
    return view;
};

/**
 * @description 塗りテクスチャ用のGPUTextureUsageフラグ
 *              GPUTextureUsage flags for fill textures
 *              TEXTURE_BINDING(0x04) | COPY_DST(0x02) = 0x06
 * @type {number}
 */
const $FILL_TEXTURE_USAGE = 0x06;

/**
 * @description レンダーテクスチャ用のGPUTextureUsageフラグ
 *              GPUTextureUsage flags for render textures
 *              TEXTURE_BINDING(0x04) | COPY_DST(0x02) | RENDER_ATTACHMENT(0x10) = 0x16
 * @type {number}
 */
const $RENDER_TEXTURE_USAGE = 0x16;

/**
 * @description 同一サイズのバケットあたりの最大保持数
 *              Maximum number of textures held per same-size bucket
 * @type {number}
 */
const $MAX_BUCKET_SIZE = 32;

/**
 * @description プール全体での最大保持数（fill/render それぞれに適用）
 *              Maximum number of textures held in the entire pool (applied independently to fill/render)
 * @type {number}
 */
const $MAX_TOTAL = 256;

/**
 * @description 塗りテクスチャのオブジェクトプール
 *              Object pool for fill textures
 * @type {Map<string, GPUTexture[]>}
 */
const $pool: Map<string, GPUTexture[]> = new Map();

/**
 * @description 塗りテクスチャプールの総数
 *              Total count of textures currently held in the fill pool
 * @type {number}
 */
let $fillTotalCount = 0;

/**
 * @description レンダーテクスチャのオブジェクトプール
 *              Object pool for render textures
 * @type {Map<string, GPUTexture[]>}
 */
const $renderPool: Map<string, GPUTexture[]> = new Map();

/**
 * @description レンダーテクスチャプールの総数
 *              Total count of textures currently held in the render pool
 * @type {number}
 */
let $renderTotalCount = 0;

/**
 * @description プールから塗りテクスチャを取得、なければ新規作成
 *              Acquire a fill texture from the pool, or create a new one
 * @param  {GPUDevice} device
 * @param  {number} width
 * @param  {number} height
 * @return {GPUTexture}
 */
export const $acquireFillTexture = (device: GPUDevice, width: number, height: number): GPUTexture =>
{
    const key = `${width}_${height}`;
    const list = $pool.get(key);
    if (list && list.length > 0) {
        $fillTotalCount--;
        return list.pop()!;
    }
    return device.createTexture({
        "size": { width, height },
        "format": "rgba8unorm",
        "usage": $FILL_TEXTURE_USAGE
    });
};

/**
 * @description 塗りテクスチャをプールに返却。上限超過時は destroy する
 *              Release a fill texture back to the pool. Destroyed when limits are exceeded
 * @param  {GPUTexture} texture
 * @return {void}
 */
export const $releaseFillTexture = (texture: GPUTexture): void =>
{
    const key = `${texture.width}_${texture.height}`;
    let list = $pool.get(key);
    if (!list) {
        list = [];
        $pool.set(key, list);
    }

    if (list.length >= $MAX_BUCKET_SIZE || $fillTotalCount >= $MAX_TOTAL) {
        texture.destroy();
        return;
    }

    list.push(texture);
    $fillTotalCount++;
};

/**
 * @description プールからレンダーテクスチャを取得、なければ新規作成
 *              Acquire a render texture from the pool, or create a new one
 * @param  {GPUDevice} device
 * @param  {number} width
 * @param  {number} height
 * @return {GPUTexture}
 */
export const $acquireRenderTexture = (device: GPUDevice, width: number, height: number): GPUTexture =>
{
    const key = `${width}_${height}`;
    const list = $renderPool.get(key);
    if (list && list.length > 0) {
        $renderTotalCount--;
        return list.pop()!;
    }
    return device.createTexture({
        "size": { width, height },
        "format": "rgba8unorm",
        "usage": $RENDER_TEXTURE_USAGE
    });
};

/**
 * @description レンダーテクスチャをプールに返却。上限超過時は destroy する
 *              Release a render texture back to the pool. Destroyed when limits are exceeded
 * @param  {GPUTexture} texture
 * @return {void}
 */
export const $releaseRenderTexture = (texture: GPUTexture): void =>
{
    const key = `${texture.width}_${texture.height}`;
    let list = $renderPool.get(key);
    if (!list) {
        list = [];
        $renderPool.set(key, list);
    }

    if (list.length >= $MAX_BUCKET_SIZE || $renderTotalCount >= $MAX_TOTAL) {
        texture.destroy();
        return;
    }

    list.push(texture);
    $renderTotalCount++;
};

/**
 * @description 全テクスチャプールを破棄してクリア
 *              Destroy and clear all texture pools
 * @return {void}
 */
export const $clearFillTexturePool = (): void =>
{
    for (const [, list] of $pool) {
        for (const texture of list) {
            texture.destroy();
        }
    }
    $pool.clear();
    $fillTotalCount = 0;

    for (const [, list] of $renderPool) {
        for (const texture of list) {
            texture.destroy();
        }
    }
    $renderPool.clear();
    $renderTotalCount = 0;
};
