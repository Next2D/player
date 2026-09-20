import type { IPooledTexture, ITexturePoolBuckets } from "../../interface/IPooledTexture";

/**
 * @description テクスチャをプールに返却（バケットMap版）
 *              Release texture back to pool (bucket Map version)
 *
 * @param  {ITexturePoolBuckets} buckets - テクスチャプールバケット
 * @param  {GPUTexture} texture - 返却するテクスチャ
 * @param  {number} current_frame - 現在のフレーム番号
 * @return {void}
 * @method
 * @protected
 */
export const execute = (
    buckets: ITexturePoolBuckets,
    texture: GPUTexture,
    current_frame: number,
    entries?: WeakMap<GPUTexture, IPooledTexture>
): void => {
    const entry = entries?.get(texture);
    if (entry) {
        entry.inUse = false;
        entry.lastUsedFrame = current_frame;
        return;
    }
    for (const bucket of buckets.values()) {
        for (let i = 0; i < bucket.length; i++) {
            if (bucket[i].texture === texture) {
                bucket[i].inUse = false;
                bucket[i].lastUsedFrame = current_frame;
                entries?.set(texture, bucket[i]);
                return;
            }
        }
    }
};
