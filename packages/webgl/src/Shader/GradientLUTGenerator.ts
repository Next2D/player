import type { IAttachmentObject } from "../interface/IAttachmentObject";
import type { ITextureObject } from "../interface/ITextureObject";
import { execute as frameBufferManagerGetAttachmentObjectUseCase } from "../FrameBufferManager/usecase/FrameBufferManagerGetAttachmentObjectUseCase";
import { execute as textureManagerReleaseTextureObjectUseCase } from "../TextureManager/usecase/TextureManagerReleaseTextureObjectUseCase";

/**
 * @description 解像度別のAttachmentObjectキャッシュ
 *              Attachment object cache by resolution
 *
 * @type {Map<number, IAttachmentObject>}
 * @private
 */
const $gradientAttachmentObjects: Map<number, IAttachmentObject> = new Map();

/**
 * @description stops+interpolation をキーにした LUT テクスチャの LRU キャッシュ。
 *              ヒット時は LUT の生成描画(FBO切替+drawArrays)を丸ごとスキップできる。
 *              Content-addressed LRU cache of LUT textures keyed by
 *              stops+interpolation. On hit the whole LUT generation pass
 *              (FBO switch + drawArrays) is skipped.
 *
 * @type {Map<string, ITextureObject>}
 * @private
 */
const $shapeLUTCache: Map<string, ITextureObject> = new Map();

/**
 * @description LUTキャッシュの最大エントリ数(1エントリ=最大1024×1 RGBA8 ≒ 4KB)
 *              Maximum number of cached LUT entries
 *
 * @type {number}
 * @const
 */
const $SHAPE_LUT_CACHE_MAX: number = 32;

/**
 * @description キャッシュからLUTテクスチャを取得。ヒット時はLRU順を更新。
 *              Get a cached LUT texture. Refreshes LRU order on hit.
 *
 * @param  {string} key
 * @return {ITextureObject | null}
 * @method
 * @protected
 */
export const $getShapeLUTFromCache = (key: string): ITextureObject | null =>
{
    const textureObject = $shapeLUTCache.get(key);
    if (!textureObject) {
        return null;
    }

    // LRU: 再挿入で最新扱いにする
    $shapeLUTCache.delete(key);
    $shapeLUTCache.set(key, textureObject);

    return textureObject;
};

/**
 * @description LUTテクスチャをキャッシュへ格納。上限超過時は最古のエントリを解放。
 *              Store a LUT texture into the cache, evicting the oldest entry
 *              when the cache exceeds its capacity.
 *
 * @param  {string} key
 * @param  {ITextureObject} texture_object
 * @return {void}
 * @method
 * @protected
 */
export const $setShapeLUTToCache = (key: string, texture_object: ITextureObject): void =>
{
    $shapeLUTCache.set(key, texture_object);

    if ($shapeLUTCache.size > $SHAPE_LUT_CACHE_MAX) {
        for (const [oldestKey, oldestTexture] of $shapeLUTCache) {
            $shapeLUTCache.delete(oldestKey);
            textureManagerReleaseTextureObjectUseCase(oldestTexture);
            break;
        }
    }
};

/**
 * @description LUTキャッシュを全て解放してクリア
 *              Release and clear the entire LUT cache
 *
 * @return {void}
 * @method
 * @protected
 */
export const $clearShapeLUTCache = (): void =>
{
    for (const textureObject of $shapeLUTCache.values()) {
        textureManagerReleaseTextureObjectUseCase(textureObject);
    }
    $shapeLUTCache.clear();
};

/**
 * @description ストップ数に応じた適応的な解像度を返却
 *              Returns adaptive resolution based on stop count
 *
 * @param  {number} stopsLength
 * @return {number}
 * @method
 * @protected
 */
export const $getAdaptiveResolution = (stopsLength: number): number =>
{
    if (stopsLength <= 4) {
        return 256;
    }
    if (stopsLength <= 8) {
        return 512;
    }
    return 1024;
};

/**
 * @description 指定解像度のAttachmentObjectを返却
 *              Returns AttachmentObject with specified resolution
 *
 * @param  {number} resolution
 * @return {IAttachmentObject}
 * @method
 * @protected
 */
export const $getGradientAttachmentObjectWithResolution = (resolution: number): IAttachmentObject =>
{
    if (!$gradientAttachmentObjects.has(resolution)) {
        const attachment = frameBufferManagerGetAttachmentObjectUseCase(resolution, 1, false);
        $gradientAttachmentObjects.set(resolution, attachment);
    }
    return $gradientAttachmentObjects.get(resolution) as NonNullable<IAttachmentObject>;
};

/**
 * @description デフォルトの512解像度のAttachmentObjectを返却（後方互換性）
 *              Returns default 512 resolution AttachmentObject (backward compatibility)
 *
 * @return {IAttachmentObject}
 * @method
 * @protected
 */
export const $getGradientAttachmentObject = (): IAttachmentObject =>
{
    return $getGradientAttachmentObjectWithResolution(512);
};

/**
 * @type {number}
 * @private
 */
let $maxLength: number = 0;

/**
 * @description 最大長を返却
 *              Returns the maximum length
 *
 * @return {number}
 * @method
 * @protected
 */
export const $getGradientLUTGeneratorMaxLength = (): number =>
{
    return $maxLength;
};

/**
 * @description 最大長を設定
 *              Set the maximum length
 *
 * @param  {WebGL2RenderingContext} gl
 * @return {void}
 * @method
 * @protected
 */
export const $setGradientLUTGeneratorMaxLength = (gl: WebGL2RenderingContext): void =>
{
    $maxLength = Math.floor(gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS) * 0.75);
};

/**
 * @type {Float32Array}
 * @private
 */
export const $rgbToLinearTable: Float32Array = new Float32Array(256);

/**
 * @type {Float32Array}
 * @private
 */
export const $rgbIdentityTable: Float32Array = new Float32Array(256);

for (let idx = 0; idx < 256; ++idx) {
    const t = idx / 255;
    $rgbToLinearTable[idx] = Math.pow(t, 2.23333333);
    $rgbIdentityTable[idx] = t;
}