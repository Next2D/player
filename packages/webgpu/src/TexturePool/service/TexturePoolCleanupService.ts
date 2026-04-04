import type { ITexturePoolBuckets } from "../../interface/IPooledTexture";

/**
 * @description 古いプールエントリをクリーンアップ（バケットMap版 LRU回収）
 *              Cleanup old pool entries (bucket Map version, LRU eviction)
 *
 * @param  {ITexturePoolBuckets} buckets - テクスチャプールバケット
 * @param  {number} current_frame - 現在のフレーム番号
 * @param  {number} threshold - フレーム数閾値
 * @param  {number[]} total_count - [0]に現在の合計数を格納
 * @return {void}
 * @method
 * @protected
 */
export const execute = (
    buckets: ITexturePoolBuckets,
    current_frame: number,
    threshold: number,
    total_count: number[]
): void => {
    const frameThreshold = current_frame - threshold;

    for (const [key, bucket] of buckets) {
        for (let i = bucket.length - 1; i >= 0; i--) {
            const entry = bucket[i];
            if (!entry.inUse && entry.lastUsedFrame < frameThreshold) {
                entry.texture.destroy();
                bucket.splice(i, 1);
                total_count[0]--;
            }
        }
        if (bucket.length === 0) {
            buckets.delete(key);
        }
    }
};
