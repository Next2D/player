import type { IPooledTexture, ITexturePoolBuckets } from "../../interface/IPooledTexture";

/**
 * @description バケットキーを生成（exactサイズ + フォーマット）
 *              Build bucket key from exact size and format
 *
 * @param  {number} width - テクスチャ幅
 * @param  {number} height - テクスチャ高さ
 * @param  {GPUTextureFormat} format - テクスチャフォーマット
 * @return {string}
 */
const buildKey = (width: number, height: number, format: GPUTextureFormat): string =>
{
    return `${width}_${height}_${format}`;
};

/**
 * @description テクスチャを取得または作成（バケットMap検索）
 *              Acquire texture from pool or create new one (bucket Map lookup)
 *
 * @param  {GPUDevice} device - GPUデバイス
 * @param  {ITexturePoolBuckets} buckets - テクスチャプールバケット
 * @param  {number} width - テクスチャ幅
 * @param  {number} height - テクスチャ高さ
 * @param  {GPUTextureFormat} format - テクスチャフォーマット
 * @param  {GPUTextureUsageFlags} usage - テクスチャ使用フラグ
 * @param  {number} current_frame - 現在のフレーム番号
 * @param  {number} max_pool_size - プールの最大サイズ
 * @param  {number[]} total_count - [0]に現在の合計数を格納
 * @return {GPUTexture}
 * @method
 * @protected
 */
export const execute = (
    device: GPUDevice,
    buckets: ITexturePoolBuckets,
    width: number,
    height: number,
    format: GPUTextureFormat,
    usage: GPUTextureUsageFlags,
    current_frame: number,
    max_pool_size: number,
    total_count: number[]
): GPUTexture => {
    const key = buildKey(width, height, format);

    // バケットから未使用テクスチャを検索（O(1)バケット + O(n)バケット内走査）
    const bucket = buckets.get(key);
    if (bucket) {
        for (let i = 0; i < bucket.length; i++) {
            const entry = bucket[i];
            if (!entry.inUse) {
                entry.inUse = true;
                entry.lastUsedFrame = current_frame;
                return entry.texture;
            }
        }
    }

    // プールが満杯なら最も古い未使用エントリを削除（LRU回収）
    if (total_count[0] >= max_pool_size) {
        let oldestFrame = Infinity;
        let oldestKey = "";
        let oldestIdx = -1;

        for (const [bKey, bEntries] of buckets) {
            for (let i = 0; i < bEntries.length; i++) {
                const e = bEntries[i];
                if (!e.inUse && e.lastUsedFrame < oldestFrame) {
                    oldestFrame = e.lastUsedFrame;
                    oldestKey = bKey;
                    oldestIdx = i;
                }
            }
        }

        if (oldestIdx >= 0) {
            const bEntries = buckets.get(oldestKey)!;
            bEntries[oldestIdx].texture.destroy();
            bEntries.splice(oldestIdx, 1);
            if (bEntries.length === 0) {
                buckets.delete(oldestKey);
            }
            total_count[0]--;
        }
    }

    // exactサイズで新規作成
    const texture = device.createTexture({
        "size": { width, height },
        format,
        usage
    });

    const entry: IPooledTexture = {
        texture,
        width,
        height,
        format,
        "lastUsedFrame": current_frame,
        "inUse": true
    };

    if (bucket) {
        bucket.push(entry);
    } else {
        buckets.set(key, [entry]);
    }
    total_count[0]++;

    return texture;
};
