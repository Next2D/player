import type { IPooledTexture } from "../interface/IPooledTexture";
import { execute as texturePoolEvictOldestService } from "../service/TexturePoolEvictOldestService";

/**
 * @description テクスチャを取得または作成
 *              Acquire texture from pool or create new one
 *
 * @param  {GPUDevice} device
 * @param  {IPooledTexture[]} pool
 * @param  {number} width
 * @param  {number} height
 * @param  {GPUTextureFormat} format
 * @param  {GPUTextureUsageFlags} usage
 * @param  {number} currentFrame
 * @param  {number} maxPoolSize
 * @return {GPUTexture}
 * @method
 * @protected
 */
export const execute = (
    device: GPUDevice,
    pool: IPooledTexture[],
    width: number,
    height: number,
    format: GPUTextureFormat,
    usage: GPUTextureUsageFlags,
    currentFrame: number,
    maxPoolSize: number
): GPUTexture => {
    // プールから適切なテクスチャを検索
    // サイズ完全一致を優先、なければ大きいサイズを許容（2倍以内）
    let bestIndex = -1;
    let bestSizeMatch = Infinity;

    for (let i = 0; i < pool.length; i++) {
        const entry = pool[i];
        if (entry.inUse || entry.format !== format) {
            continue;
        }

        // サイズの一致度を計算
        if (entry.width === width && entry.height === height) {
            // 完全一致
            bestIndex = i;
            break;
        } else if (
            entry.width >= width && entry.width <= width * 2 &&
            entry.height >= height && entry.height <= height * 2
        ) {
            // サイズが大きいが許容範囲内
            const sizeMatch = (entry.width - width) + (entry.height - height);
            if (sizeMatch < bestSizeMatch) {
                bestSizeMatch = sizeMatch;
                bestIndex = i;
            }
        }
    }

    if (bestIndex >= 0) {
        // プールから取得
        const entry = pool[bestIndex];
        entry.inUse = true;
        entry.lastUsedFrame = currentFrame;
        return entry.texture;
    }

    // 新規作成
    const texture = device.createTexture({
        size: { width, height },
        format,
        usage
    });

    // プールに追加（満杯なら最も古いものを削除）
    if (pool.length >= maxPoolSize) {
        texturePoolEvictOldestService(pool);
    }

    pool.push({
        texture,
        width,
        height,
        format,
        lastUsedFrame: currentFrame,
        inUse: true
    });

    return texture;
};
