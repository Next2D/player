import type { IPooledTexture } from "../interface/IPooledTexture";

/**
 * @description 古いプールエントリをクリーンアップ
 *              Cleanup old pool entries
 *
 * @param  {IPooledTexture[]} pool
 * @param  {number} currentFrame
 * @param  {number} threshold - フレーム数閾値
 * @return {void}
 * @method
 * @protected
 */
export const execute = (
    pool: IPooledTexture[],
    currentFrame: number,
    threshold: number
): void => {
    const frameThreshold = currentFrame - threshold;

    for (let i = pool.length - 1; i >= 0; i--) {
        const entry = pool[i];
        if (!entry.inUse && entry.lastUsedFrame < frameThreshold) {
            entry.texture.destroy();
            pool.splice(i, 1);
        }
    }
};
