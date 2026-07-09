import type { IAttachmentObject } from "../interface/IAttachmentObject";

/**
 * @description フィルター用グラデーションLUTの共有アタッチメント
 *              Shared attachment for filter gradient LUT
 *              注意: グラデーションLUTは共有テクスチャに描画されるため、
 *              キャッシュは使用しません。各フレームで再描画が必要です。
 *              Note: Gradient LUT is drawn to a shared texture, so caching
 *              is not used. Re-drawing is required each frame.
 *
 * @type {IAttachmentObject | null}
 * @private
 */
let $filterGradientAttachment: IAttachmentObject | null = null;

/**
 * @description GPUDeviceの参照
 *              Reference to GPUDevice
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
export const $setFilterGradientLUTDevice = (device: GPUDevice): void =>
{
    $device = device;
};

/**
 * @description フィルター用グラデーションLUTのAttachmentObjectを返却
 *              Returns AttachmentObject for filter gradient LUT
 *
 * @return {IAttachmentObject}
 * @method
 * @protected
 */
export const $getFilterGradientAttachmentObject = (): IAttachmentObject =>
{
    if (!$filterGradientAttachment && $device) {
        const resolution = 256;

        // 1xN テクスチャを作成
        const texture = $device.createTexture({
            "size": { "width": resolution, "height": 1 },
            "format": "rgba8unorm",
            "usage": GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT
        });

        $filterGradientAttachment = {
            "id": -256, // フィルター用に負のIDを使用
            "width": resolution,
            "height": 1,
            "clipLevel": 0,
            "msaa": false,
            "mask": false,
            "color": null,
            "texture": {
                "id": -256,
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
    }

    return $filterGradientAttachment as NonNullable<IAttachmentObject>;
};

/**
 * @description フィルター用グラデーションLUTの共有アタッチメントを破棄してクリア
 *              Destroy and clear filter gradient LUT shared attachment
 *
 * @return {void}
 * @method
 * @protected
 */
export const $clearFilterGradientAttachment = (): void =>
{
    if ($filterGradientAttachment?.texture?.resource) {
        $filterGradientAttachment.texture.resource.destroy();
    }
    $filterGradientAttachment = null;
};

// === フィルター用グラデーションLUTテクスチャキャッシュ ===
// fill側(Gradient/GradientLUTCache.ts の $lutCache)と同じ stops キー + TTL 方式。
// キーが異なるグラデーションは別テクスチャになるため、
// 同一フレーム内の複数フィルター適用でも上書き問題は発生しない。

/**
 * @description フィルターLUTキャッシュエントリ
 *              Filter LUT cache entry
 */
interface IFilterGradientLUTEntry {
    texture: GPUTexture;
    view: GPUTextureView;
    lastUsedFrame: number;
}

/**
 * @type {Map<string, IFilterGradientLUTEntry>}
 * @private
 */
const $filterLUTCache: Map<string, IFilterGradientLUTEntry> = new Map();

/**
 * @type {number}
 * @private
 */
let $filterLUTCurrentFrame: number = 0;

/**
 * @description フィルターLUTキャッシュのTTL(フレーム数)
 *              TTL for the filter LUT cache in frames
 *
 * @type {number}
 * @const
 */
const $FILTER_LUT_TTL: number = 60;

/**
 * @description フィルターLUTのキャッシュキーを生成
 *              Build a cache key for a filter gradient LUT
 *
 * @param  {Float32Array | number[]} ratios
 * @param  {Float32Array | number[]} colors
 * @param  {Float32Array | number[]} alphas
 * @return {string}
 * @private
 */
const $buildFilterLUTKey = (
    ratios: Float32Array | number[],
    colors: Float32Array | number[],
    alphas: Float32Array | number[]
): string =>
{
    return `${ratios.join(",")}_${colors.join(",")}_${alphas.join(",")}`;
};

/**
 * @description キャッシュからフィルターLUTを取得。ヒットしなければ null。
 *              Retrieve a filter LUT from the cache. Returns null on miss.
 *
 * @param  {Float32Array | number[]} ratios
 * @param  {Float32Array | number[]} colors
 * @param  {Float32Array | number[]} alphas
 * @return {IFilterGradientLUTEntry | null}
 * @method
 * @protected
 */
export const $getFilterLUTFromCache = (
    ratios: Float32Array | number[],
    colors: Float32Array | number[],
    alphas: Float32Array | number[]
): IFilterGradientLUTEntry | null =>
{
    const entry = $filterLUTCache.get($buildFilterLUTKey(ratios, colors, alphas));
    if (entry) {
        entry.lastUsedFrame = $filterLUTCurrentFrame;
        return entry;
    }
    return null;
};

/**
 * @description フィルターLUTをキャッシュに格納
 *              Store a filter LUT into the cache
 *
 * @param  {Float32Array | number[]} ratios
 * @param  {Float32Array | number[]} colors
 * @param  {Float32Array | number[]} alphas
 * @param  {GPUTexture} texture
 * @param  {GPUTextureView} view
 * @return {IFilterGradientLUTEntry}
 * @method
 * @protected
 */
export const $putFilterLUTToCache = (
    ratios: Float32Array | number[],
    colors: Float32Array | number[],
    alphas: Float32Array | number[],
    texture: GPUTexture,
    view: GPUTextureView
): IFilterGradientLUTEntry =>
{
    const entry: IFilterGradientLUTEntry = {
        texture,
        view,
        "lastUsedFrame": $filterLUTCurrentFrame
    };
    $filterLUTCache.set($buildFilterLUTKey(ratios, colors, alphas), entry);
    return entry;
};

/**
 * @description フレーム終了時にTTL超過エントリを解放
 *              Release entries that exceed the TTL at the end of each frame
 *
 * @return {void}
 * @method
 * @protected
 */
export const $cleanupFilterLUTCache = (): void =>
{
    $filterLUTCurrentFrame++;
    for (const [key, entry] of $filterLUTCache) {
        if ($filterLUTCurrentFrame - entry.lastUsedFrame > $FILTER_LUT_TTL) {
            entry.texture.destroy();
            $filterLUTCache.delete(key);
        }
    }
};

/**
 * @description 全フィルターLUTキャッシュを破棄
 *              Destroy and clear the entire filter LUT cache
 *
 * @return {void}
 * @method
 * @protected
 */
export const $clearFilterLUTCache = (): void =>
{
    for (const entry of $filterLUTCache.values()) {
        entry.texture.destroy();
    }
    $filterLUTCache.clear();
    $filterLUTCurrentFrame = 0;
};
