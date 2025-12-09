import type { IPooledBuffer } from "../../interface/IPooledBuffer";

/**
 * @description プールからユニフォームバッファを取得（または新規作成）
 *              Acquire uniform buffer from pool (or create new)
 *
 * @param  {GPUDevice} device
 * @param  {IPooledBuffer[]} pool
 * @param  {number} required_size - 必要なバイトサイズ
 * @return {GPUBuffer}
 * @method
 * @protected
 */
export const execute = (
    device: GPUDevice,
    pool: IPooledBuffer[],
    required_size: number
): GPUBuffer => {
    // 16バイトアライメント
    const alignedSize = Math.ceil(required_size / 16) * 16;

    // プールから適切なサイズのバッファを検索
    for (let i = 0; i < pool.length; i++) {
        const entry = pool[i];
        if (entry.size >= alignedSize && entry.size <= alignedSize * 2) {
            return pool.splice(i, 1)[0].buffer;
        }
    }

    // 新規作成
    return device.createBuffer({
        size: alignedSize,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });
};
