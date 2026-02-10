import type { IPooledTexture, ITexturePoolBuckets } from "../../interface/IPooledTexture";

/**
 * @description バケットキーを生成（exactサイズ + フォーマット）
 *
 * @param  {number} width
 * @param  {number} height
 * @param  {GPUTextureFormat} format
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
 * @param  {GPUDevice} device
 * @param  {ITexturePoolBuckets} buckets
 * @param  {number} width
 * @param  {number} height
 * @param  {GPUTextureFormat} format
 * @param  {GPUTextureUsageFlags} usage
 * @param  {number} currentFrame
 * @param  {number} maxPoolSize
 * @param  {number[]} totalCount - [0]に現在の合計数を格納
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
    currentFrame: number,
    maxPoolSize: number,
    totalCount: number[]
): GPUTexture => {
    const key = buildKey(width, height, format);

    // バケットから未使用テクスチャを検索（O(1)バケット + O(n)バケット内走査）
    const bucket = buckets.get(key);
    if (bucket) {
        for (let i = 0; i < bucket.length; i++) {
            const entry = bucket[i];
            if (!entry.inUse) {
                entry.inUse = true;
                entry.lastUsedFrame = currentFrame;
                return entry.texture;
            }
        }
    }

    // プールが満杯なら最も古い未使用エントリを削除（LRU回収）
    if (totalCount[0] >= maxPoolSize) {
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
            totalCount[0]--;
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
        "lastUsedFrame": currentFrame,
        "inUse": true
    };

    if (bucket) {
        bucket.push(entry);
    } else {
        buckets.set(key, [entry]);
    }
    totalCount[0]++;

    return texture;
};
