import type { ITexturePoolBuckets } from "../../interface/IPooledTexture";

/**
 * @description 古いプールエントリをクリーンアップ（バケットMap版 LRU回収）
 *              Cleanup old pool entries (bucket Map version, LRU eviction)
 *
 * @param  {ITexturePoolBuckets} buckets
 * @param  {number} currentFrame
 * @param  {number} threshold - フレーム数閾値
 * @param  {number[]} totalCount - [0]に現在の合計数を格納
 * @return {void}
 * @method
 * @protected
 */
export const execute = (
    buckets: ITexturePoolBuckets,
    currentFrame: number,
    threshold: number,
    totalCount: number[]
): void => {
    const frameThreshold = currentFrame - threshold;

    for (const [key, bucket] of buckets) {
        for (let i = bucket.length - 1; i >= 0; i--) {
            const entry = bucket[i];
            if (!entry.inUse && entry.lastUsedFrame < frameThreshold) {
                entry.texture.destroy();
                bucket.splice(i, 1);
                totalCount[0]--;
            }
        }
        if (bucket.length === 0) {
            buckets.delete(key);
        }
    }
};
