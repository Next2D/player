import type { IAttachmentObject } from "../interface/IAttachmentObject";
import { $releaseFillTexture } from "../FillTexturePool";

/**
 * @description 解像度別のAttachmentObjectキャッシュ
 *              Attachment object cache by resolution
 *              注意: グラデーションLUTは共有テクスチャに描画されるため、
 *              キャッシュは使用しません。各フレームで再描画が必要です。
 *              Note: Gradient LUT is drawn to a shared texture, so caching
 *              is not used. Re-drawing is required each frame.
 *
 * @type {Map<number, IAttachmentObject>}
 * @private
 */
const $gradientAttachmentObjects: Map<number, IAttachmentObject> = new Map();

/**
 * @description GPUDeviceの参照
 *              Reference to the GPUDevice
 * @type {GPUDevice | null}
 * @private
 */
let $device: GPUDevice | null = null;

/**
 * @description GPUDeviceを設定
 *              Set GPUDevice
 *
 * @param  {GPUDevice} device
 * @return {void}
 * @method
 * @protected
 */
export const $setGradientLUTDevice = (device: GPUDevice): void =>
{
    $device = device;
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
    if (!$gradientAttachmentObjects.has(resolution) && $device) {
        // 1xN テクスチャを作成
        const texture = $device.createTexture({
            "size": { "width": resolution, "height": 1 },
            "format": "rgba8unorm",
            "usage": GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT
        });

        const attachment: IAttachmentObject = {
            "id": resolution,
            "width": resolution,
            "height": 1,
            "clipLevel": 0,
            "msaa": false,
            "mask": false,
            "color": null,
            "texture": {
                "id": resolution,
                "resource": texture,
                "view": texture.createView(),
                "width": resolution,
                "height": 1,
                "area": resolution,
                "smooth": true
            },
            "stencil": null,
            "msaaTexture": null,
            "msaaStencil": null
        };

        $gradientAttachmentObjects.set(resolution, attachment);
    }

    return $gradientAttachmentObjects.get(resolution) as NonNullable<IAttachmentObject>;
};

/**
 * @description デフォルトの256解像度のAttachmentObjectを返却
 *              Returns default 256 resolution AttachmentObject
 *
 * @return {IAttachmentObject}
 * @method
 * @protected
 */
export const $getGradientAttachmentObject = (): IAttachmentObject =>
{
    return $getGradientAttachmentObjectWithResolution(256);
};

/**
 * @description 全ての共有アタッチメントを破棄してクリア
 *              Destroy and clear all shared attachments
 *
 * @return {void}
 * @method
 * @protected
 */
export const $clearGradientAttachmentObjects = (): void =>
{
    for (const attachment of $gradientAttachmentObjects.values()) {
        if (attachment.texture?.resource) {
            attachment.texture.resource.destroy();
        }
    }
    $gradientAttachmentObjects.clear();
};

// === Gradient LUT テクスチャキャッシュ ===

/**
 * @description グラデーションLUTキャッシュエントリのインターフェース
 *              Interface for gradient LUT cache entry
 */
interface IGradientLUTEntry {
    texture: GPUTexture;
    view: GPUTextureView;
    lastUsedFrame: number;
}

/**
 * @description キー文字列からLUTエントリへのキャッシュマップ
 *              Cache map from key string to LUT entry
 * @type {Map<string, IGradientLUTEntry>}
 * @private
 */
const $lutCache: Map<string, IGradientLUTEntry> = new Map();

/**
 * @description 現在のフレーム番号（TTL計算に使用）
 *              Current frame number used for TTL calculation
 * @type {number}
 * @private
 */
let $currentFrame: number = 0;

/**
 * @description LUTキャッシュのTTL（フレーム数）
 *              TTL for LUT cache in number of frames
 * @type {number}
 * @constant
 * @private
 */
const $LUT_TTL: number = 60;

/**
 * @description グラデーションLUTのキャッシュキーを生成する
 *              Build a cache key string for a gradient LUT
 *
 * @param  {number[]} stops - グラデーションストップ配列 / Gradient stop array
 * @param  {number} spread - スプレッドメソッド / Spread method
 * @param  {number} interpolation - 補間方法 / Interpolation method
 * @return {string} キャッシュキー文字列 / Cache key string
 * @private
 */
const $buildLUTKey = (
    stops: number[],
    spread: number,
    interpolation: number
): string =>
{
    return `${spread}_${interpolation}_${stops.join(",")}`;
};

/**
 * @description キャッシュからLUTテクスチャを取得する。ヒットしなければnullを返す。
 *              Retrieve a LUT texture from the cache. Returns null on cache miss.
 *
 * @param  {number[]} stops - グラデーションストップ配列 / Gradient stop array
 * @param  {number} spread - スプレッドメソッド / Spread method
 * @param  {number} interpolation - 補間方法 / Interpolation method
 * @return {IGradientLUTEntry | null} キャッシュエントリまたはnull / Cache entry or null
 * @method
 * @protected
 */
export const $getLUTFromCache = (
    stops: number[],
    spread: number,
    interpolation: number
): IGradientLUTEntry | null =>
{
    const key = $buildLUTKey(stops, spread, interpolation);
    const entry = $lutCache.get(key);
    if (entry) {
        entry.lastUsedFrame = $currentFrame;
        return entry;
    }
    return null;
};

/**
 * @description LUTテクスチャをキャッシュに格納する
 *              Store a LUT texture into the cache
 *
 * @param  {number[]} stops - グラデーションストップ配列 / Gradient stop array
 * @param  {number} spread - スプレッドメソッド / Spread method
 * @param  {number} interpolation - 補間方法 / Interpolation method
 * @param  {GPUTexture} texture - GPUテクスチャ / GPU texture
 * @param  {GPUTextureView} view - GPUテクスチャビュー / GPU texture view
 * @return {void}
 * @method
 * @protected
 */
export const $putLUTToCache = (
    stops: number[],
    spread: number,
    interpolation: number,
    texture: GPUTexture,
    view: GPUTextureView
): void =>
{
    const key = $buildLUTKey(stops, spread, interpolation);
    $lutCache.set(key, {
        texture,
        view,
        "lastUsedFrame": $currentFrame
    });
};

/**
 * @description フレーム終了時にTTL超過エントリを解放する
 *              Release entries that exceed TTL at the end of each frame
 *
 * @return {void}
 * @method
 * @protected
 */
export const $cleanupLUTCache = (): void =>
{
    $currentFrame++;
    for (const [key, entry] of $lutCache) {
        if ($currentFrame - entry.lastUsedFrame > $LUT_TTL) {
            $releaseFillTexture(entry.texture);
            $lutCache.delete(key);
        }
    }
};

/**
 * @description 全LUTキャッシュを破棄する
 *              Destroy and clear the entire LUT cache
 *
 * @return {void}
 * @method
 * @protected
 */
export const $clearLUTCache = (): void =>
{
    for (const entry of $lutCache.values()) {
        $releaseFillTexture(entry.texture);
    }
    $lutCache.clear();
    $currentFrame = 0;
};
