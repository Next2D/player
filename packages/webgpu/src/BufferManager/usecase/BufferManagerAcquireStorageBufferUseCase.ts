import type { IPooledStorageBuffer } from "../../interface/IStorageBufferConfig";
import { execute as createStorageBufferService } from "../service/BufferManagerCreateStorageBufferService";

/**
 * @description プールからStorage Bufferを取得（または新規作成）
 *              Acquire Storage Buffer from pool or create new one
 *
 * メモリアロケーションを最小化するため、
 * 使用済みのバッファを再利用する。
 *
 * @param {GPUDevice} device - WebGPU device
 * @param {IPooledStorageBuffer[]} pool - Storage Bufferプール
 * @param {number} requiredSize - 必要なサイズ（バイト）
 * @param {number} currentFrame - 現在のフレーム番号
 * @return {GPUBuffer} 取得されたStorage Buffer
 */
export const execute = (
    device: GPUDevice,
    pool: IPooledStorageBuffer[],
    requiredSize: number,
    currentFrame: number
): GPUBuffer => {

    // アライメントを考慮（256バイト境界）
    const alignedSize = Math.ceil(requiredSize / 256) * 256;

    // プールから適切なサイズの未使用バッファを検索
    // 最もサイズが近いバッファを選択（メモリ効率）
    let bestMatch: IPooledStorageBuffer | null = null;
    let bestSizeDiff = Infinity;

    for (const entry of pool) {
        if (!entry.inUse && entry.size >= alignedSize) {
            const sizeDiff = entry.size - alignedSize;
            if (sizeDiff < bestSizeDiff) {
                bestMatch = entry;
                bestSizeDiff = sizeDiff;
            }
        }
    }

    if (bestMatch) {
        bestMatch.inUse = true;
        bestMatch.lastUsedFrame = currentFrame;
        return bestMatch.buffer;
    }

    // 適切なバッファがない場合は新規作成
    // 将来の再利用のために少し大きめに確保
    const createSize = Math.max(alignedSize, 16384); // 最小16KB

    const buffer = createStorageBufferService(device, {
        "size": createSize,
        "usage": GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
        "label": `storage_buffer_${pool.length}`
    });

    pool.push({
        "buffer": buffer,
        "size": createSize,
        "inUse": true,
        "lastUsedFrame": currentFrame
    });

    return buffer;
};

/**
 * @description Storage Bufferをプールに返却
 *              Release Storage Buffer back to pool
 *
 * @param {IPooledStorageBuffer[]} pool - Storage Bufferプール
 * @param {GPUBuffer} buffer - 返却するバッファ
 */
export const releaseStorageBuffer = (
    pool: IPooledStorageBuffer[],
    buffer: GPUBuffer
): void => {

    for (const entry of pool) {
        if (entry.buffer === buffer) {
            entry.inUse = false;
            return;
        }
    }
};

/**
 * @description 古いStorage Bufferをクリーンアップ
 *              Cleanup old Storage Buffers
 *
 * 一定フレーム数使用されていないバッファを解放。
 *
 * @param {IPooledStorageBuffer[]} pool - Storage Bufferプール
 * @param {number} currentFrame - 現在のフレーム番号
 * @param {number} maxAge - 最大保持フレーム数
 */
export const cleanupStorageBuffers = (
    pool: IPooledStorageBuffer[],
    currentFrame: number,
    maxAge: number = 60
): void => {

    // 古いバッファを削除
    for (let i = pool.length - 1; i >= 0; i--) {
        const entry = pool[i];
        if (!entry.inUse && currentFrame - entry.lastUsedFrame > maxAge) {
            entry.buffer.destroy();
            pool.splice(i, 1);
        }
    }
};
