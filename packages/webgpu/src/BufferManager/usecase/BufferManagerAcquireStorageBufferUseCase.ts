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
 * @param {number} required_size - 必要なサイズ（バイト）
 * @param {number} current_frame - 現在のフレーム番号
 * @return {GPUBuffer} 取得されたStorage Buffer
 */
export const execute = (
    device: GPUDevice,
    pool: IPooledStorageBuffer[],
    required_size: number,
    current_frame: number
): GPUBuffer => {

    // アライメントを考慮（256バイト境界）
    const alignedSize = Math.ceil(required_size / 256) * 256;

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
        bestMatch.lastUsedFrame = current_frame;
        return bestMatch.buffer;
    }

    // 適切なバッファがない場合は新規作成
    // 将来の再利用のために少し大きめに確保
    const createSize = Math.max(alignedSize, 16384); // 最小16KB

    const buffer = createStorageBufferService(device, {
        "size": createSize,
        "usage": GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.VERTEX,
        "label": `storage_buffer_${pool.length}`
    });

    pool.push({
        "buffer": buffer,
        "size": createSize,
        "inUse": true,
        "lastUsedFrame": current_frame
    });

    return buffer;
};
