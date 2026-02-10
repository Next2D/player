import type { IPooledStorageBuffer } from "../../interface/IStorageBufferConfig";

/**
 * @description 古いStorage Bufferをクリーンアップ
 *              Cleanup old Storage Buffers
 *
 * 一定フレーム数使用されていないバッファを解放。
 *
 * @param {IPooledStorageBuffer[]} pool - Storage Bufferプール
 * @param {number} current_frame - 現在のフレーム番号
 * @param {number} max_age - 最大保持フレーム数
 */
export const execute = (
    pool: IPooledStorageBuffer[],
    current_frame: number,
    max_age: number = 60
): void => {

    // 古いバッファを削除
    for (let i = pool.length - 1; i >= 0; i--) {
        const entry = pool[i];
        if (!entry.inUse && current_frame - entry.lastUsedFrame > max_age) {
            entry.buffer.destroy();
            pool.splice(i, 1);
        }
    }
};
