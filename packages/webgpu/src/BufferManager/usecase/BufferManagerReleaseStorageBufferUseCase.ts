import type { IPooledStorageBuffer } from "../../interface/IStorageBufferConfig";

/**
 * @description Storage Bufferをプールに返却
 *              Release Storage Buffer back to pool
 *
 * @param {IPooledStorageBuffer[]} pool - Storage Bufferプール
 * @param {GPUBuffer} buffer - 返却するバッファ
 */
export const execute = (
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
