import type { IPooledBuffer } from "../../interface/IPooledBuffer";

/**
 * @description プールの最大サイズ
 *              Maximum pool size
 * @type {number}
 * @const
 */
const MAX_POOL_SIZE: number = 32;

/**
 * @description ユニフォームバッファをプールに返却
 *              Release uniform buffer back to pool
 *
 * @param  {IPooledBuffer[]} pool
 * @param  {GPUBuffer} buffer
 * @return {void}
 * @method
 * @protected
 */
export const execute = (
    pool: IPooledBuffer[],
    buffer: GPUBuffer
): void => {
    if (pool.length >= MAX_POOL_SIZE) {
        // プールが満杯の場合、最も小さいバッファを破棄
        let smallestIndex = 0;
        let smallestSize = pool[0].size;

        for (let i = 1; i < pool.length; i++) {
            if (pool[i].size < smallestSize) {
                smallestSize = pool[i].size;
                smallestIndex = i;
            }
        }

        pool[smallestIndex].buffer.destroy();
        pool.splice(smallestIndex, 1);
    }

    pool.push({
        buffer,
        size: buffer.size
    });
};
