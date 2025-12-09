import type { IPooledTexture } from "../interface/IPooledTexture";

/**
 * @description 最も古い未使用エントリを削除
 *              Evict the oldest unused pool entry
 *
 * @param  {IPooledTexture[]} pool
 * @return {void}
 * @method
 * @protected
 */
export const execute = (pool: IPooledTexture[]): void => {
    let oldestIndex = -1;
    let oldestFrame = Infinity;

    for (let i = 0; i < pool.length; i++) {
        const entry = pool[i];
        if (!entry.inUse && entry.lastUsedFrame < oldestFrame) {
            oldestFrame = entry.lastUsedFrame;
            oldestIndex = i;
        }
    }

    if (oldestIndex >= 0) {
        pool[oldestIndex].texture.destroy();
        pool.splice(oldestIndex, 1);
    }
};
