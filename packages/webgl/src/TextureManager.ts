import type { ITextureObject } from "./interface/ITextureObject";

/**
 * @description 現在のアクティブなテクスチャーの番号
 *              Number of the currently binded active texture
 *
 * @type {number}
 * @protected
 */
export let $activeTextureUnit: number = -1;

/**
 * @description 現在
 * @param {number} unit
 * @return {void}
 * @method
 * @protected
 */
export const $setActiveTextureUnit = (unit: number): void =>
{
    $activeTextureUnit = unit;
};

/**
 * @description 現在bindされてるテクスチャの配列
 *              Array of currently binded textures
 *
 * @type {Array}
 * @protected
 */
export const $boundTextures: Array<ITextureObject | null> = [null, null, null];

/**
 * @description 再利用可能なテクスチャのプール。texStorage2D は immutable のため
 *              (width, height) の完全一致キーで管理する。
 *              Pool of reusable textures. Keyed by exact (width, height) match
 *              because texStorage2D allocates immutable storage.
 *
 * @type {Map<number, ITextureObject[]>}
 * @protected
 */
export const $texturePool: Map<number, ITextureObject[]> = new Map();

/**
 * @description プール全体の保持数
 *              Total number of pooled textures
 *
 * @type {number}
 * @private
 */
let $texturePoolCount: number = 0;

/**
 * @description バケット毎の最大保持数
 *              Maximum number of pooled textures per size bucket
 *
 * @type {number}
 * @const
 */
const $TEXTURE_POOL_BUCKET_MAX: number = 4;

/**
 * @description プール全体の最大保持数
 *              Maximum total number of pooled textures
 *
 * @type {number}
 * @const
 */
const $TEXTURE_POOL_TOTAL_MAX: number = 32;

/**
 * @description (width, height) からプールキーを生成
 *              Generate a pool key from (width, height)
 *
 * @param  {number} width
 * @param  {number} height
 * @return {number}
 * @method
 * @protected
 */
export const $getTexturePoolKey = (width: number, height: number): number =>
{
    return width * 65536 + height;
};

/**
 * @description 完全一致サイズの再利用テクスチャを取得。なければ null。
 *              Acquire a pooled texture with the exact size, or null.
 *
 * @param  {number} width
 * @param  {number} height
 * @return {ITextureObject | null}
 * @method
 * @protected
 */
export const $acquirePooledTexture = (width: number, height: number): ITextureObject | null =>
{
    const bucket = $texturePool.get($getTexturePoolKey(width, height));
    if (!bucket || !bucket.length) {
        return null;
    }

    --$texturePoolCount;

    const textureObject = bucket.pop() as ITextureObject;
    textureObject.pooled = false;

    return textureObject;
};

/**
 * @description テクスチャをプールに返却。上限超過なら false を返す(呼び出し側で削除)。
 *              Return a texture to the pool. Returns false when the pool is full
 *              (the caller should delete the texture).
 *
 * @param  {ITextureObject} texture_object
 * @return {boolean}
 * @method
 * @protected
 */
export const $releaseTextureToPool = (texture_object: ITextureObject): boolean =>
{
    // 二重返却ガード
    if (texture_object.pooled) {
        return true;
    }

    if ($texturePoolCount >= $TEXTURE_POOL_TOTAL_MAX) {
        return false;
    }

    const key = $getTexturePoolKey(texture_object.width, texture_object.height);

    let bucket = $texturePool.get(key);
    if (!bucket) {
        bucket = [];
        $texturePool.set(key, bucket);
    }

    if (bucket.length >= $TEXTURE_POOL_BUCKET_MAX) {
        return false;
    }

    texture_object.pooled = true;
    texture_object.dirty  = true;
    bucket.push(texture_object);
    ++$texturePoolCount;

    return true;
};