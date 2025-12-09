import type { IPooledTexture } from "../interface/IPooledTexture";

/**
 * @description テクスチャをプールに返却
 *              Release texture back to pool
 *
 * @param  {IPooledTexture[]} pool
 * @param  {GPUTexture} texture
 * @param  {number} currentFrame
 * @return {void}
 * @method
 * @protected
 */
export const execute = (
    pool: IPooledTexture[],
    texture: GPUTexture,
    currentFrame: number
): void => {
    for (const entry of pool) {
        if (entry.texture === texture) {
            entry.inUse = false;
            entry.lastUsedFrame = currentFrame;
            return;
        }
    }
};
