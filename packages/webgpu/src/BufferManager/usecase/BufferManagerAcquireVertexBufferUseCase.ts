import type { IPooledBuffer } from "../../interface/IPooledBuffer";
import { execute as bufferManagerUpperPowerOfTwoService } from "../service/BufferManagerUpperPowerOfTwoService";

/**
 * @description プールから頂点バッファを取得（または新規作成）
 *              Acquire vertex buffer from pool (or create new)
 *
 * @param  {GPUDevice} device
 * @param  {IPooledBuffer[]} pool
 * @param  {number} required_size - 必要なバイトサイズ
 * @param  {Float32Array} [data] - 初期データ
 * @return {GPUBuffer}
 * @method
 * @protected
 */
export const execute = (
    device: GPUDevice,
    pool: IPooledBuffer[],
    required_size: number,
    data?: Float32Array
): GPUBuffer => {
    // プールから適切なサイズのバッファを検索（2倍以内のサイズで最小のもの）
    let bestIndex = -1;
    let bestSize = Infinity;

    for (let i = 0; i < pool.length; i++) {
        const entry = pool[i];
        if (entry.size >= required_size && entry.size <= required_size * 2) {
            if (entry.size < bestSize) {
                bestSize = entry.size;
                bestIndex = i;
            }
        }
    }

    let buffer: GPUBuffer;

    if (bestIndex >= 0) {
        // プールから取得
        const entry = pool.splice(bestIndex, 1)[0];
        buffer = entry.buffer;
    } else {
        // 新規作成（2のべき乗に切り上げ）
        const size = bufferManagerUpperPowerOfTwoService(required_size);
        buffer = device.createBuffer({
            size: size,
            usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
        });
    }

    // データがあれば書き込み
    if (data) {
        device.queue.writeBuffer(buffer, 0, data.buffer, data.byteOffset, data.byteLength);
    }

    return buffer;
};
