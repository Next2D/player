/**
 * @description テクスチャプールマネージャー
 *              Texture pool manager for WebGPU optimization
 *
 *              WebGPUではテクスチャの作成コストが高いため、
 *              同じサイズ・フォーマットのテクスチャをプールして再利用する
 */

interface IPooledTexture {
    texture: GPUTexture;
    width: number;
    height: number;
    format: GPUTextureFormat;
    lastUsedFrame: number;
    inUse: boolean;
}

/**
 * @description プールの最大サイズ
 */
const MAX_POOL_SIZE = 32;

/**
 * @description キャッシュのクリーンアップ閾値（フレーム数）
 */
const CACHE_CLEANUP_THRESHOLD = 180; // 3秒（60FPS想定）

/**
 * @description テクスチャプールマネージャー
 */
export class TexturePool
{
    private device: GPUDevice;
    private pool: IPooledTexture[];
    private currentFrame: number;

    /**
     * @param {GPUDevice} device
     * @constructor
     */
    constructor(device: GPUDevice)
    {
        this.device = device;
        this.pool = [];
        this.currentFrame = 0;
    }

    /**
     * @description フレーム開始時に呼び出し
     * @return {void}
     */
    beginFrame(): void
    {
        this.currentFrame++;

        // 定期的にプールをクリーンアップ
        if (this.currentFrame % 60 === 0) {
            this.cleanup();
        }
    }

    /**
     * @description テクスチャを取得または作成
     * @param {number} width - テクスチャの幅
     * @param {number} height - テクスチャの高さ
     * @param {GPUTextureFormat} format - テクスチャフォーマット
     * @param {GPUTextureUsageFlags} usage - テクスチャ使用フラグ
     * @return {GPUTexture}
     */
    acquire(
        width: number,
        height: number,
        format: GPUTextureFormat = "rgba8unorm",
        usage: GPUTextureUsageFlags = GPUTextureUsage.TEXTURE_BINDING |
                                      GPUTextureUsage.COPY_DST |
                                      GPUTextureUsage.RENDER_ATTACHMENT
    ): GPUTexture {
        // プールから適切なテクスチャを検索
        // サイズ完全一致を優先、なければ大きいサイズを許容（2倍以内）
        let bestIndex = -1;
        let bestSizeMatch = Infinity;

        for (let i = 0; i < this.pool.length; i++) {
            const entry = this.pool[i];
            if (entry.inUse || entry.format !== format) {
                continue;
            }

            // サイズの一致度を計算
            if (entry.width === width && entry.height === height) {
                // 完全一致
                bestIndex = i;
                break;
            } else if (
                entry.width >= width && entry.width <= width * 2 &&
                entry.height >= height && entry.height <= height * 2
            ) {
                // サイズが大きいが許容範囲内
                const sizeMatch = (entry.width - width) + (entry.height - height);
                if (sizeMatch < bestSizeMatch) {
                    bestSizeMatch = sizeMatch;
                    bestIndex = i;
                }
            }
        }

        if (bestIndex >= 0) {
            // プールから取得
            const entry = this.pool[bestIndex];
            entry.inUse = true;
            entry.lastUsedFrame = this.currentFrame;
            return entry.texture;
        }

        // 新規作成
        const texture = this.device.createTexture({
            size: { width, height },
            format,
            usage
        });

        // プールに追加（満杯なら最も古いものを削除）
        if (this.pool.length >= MAX_POOL_SIZE) {
            this.evictOldest();
        }

        this.pool.push({
            texture,
            width,
            height,
            format,
            lastUsedFrame: this.currentFrame,
            inUse: true
        });

        return texture;
    }

    /**
     * @description テクスチャをプールに返却
     * @param {GPUTexture} texture - 返却するテクスチャ
     * @return {void}
     */
    release(texture: GPUTexture): void
    {
        for (const entry of this.pool) {
            if (entry.texture === texture) {
                entry.inUse = false;
                entry.lastUsedFrame = this.currentFrame;
                return;
            }
        }
    }

    /**
     * @description 古いプールエントリをクリーンアップ
     * @return {void}
     * @private
     */
    private cleanup(): void
    {
        const threshold = this.currentFrame - CACHE_CLEANUP_THRESHOLD;

        for (let i = this.pool.length - 1; i >= 0; i--) {
            const entry = this.pool[i];
            if (!entry.inUse && entry.lastUsedFrame < threshold) {
                entry.texture.destroy();
                this.pool.splice(i, 1);
            }
        }
    }

    /**
     * @description 最も古い未使用エントリを削除
     * @return {void}
     * @private
     */
    private evictOldest(): void
    {
        let oldestIndex = -1;
        let oldestFrame = Infinity;

        for (let i = 0; i < this.pool.length; i++) {
            const entry = this.pool[i];
            if (!entry.inUse && entry.lastUsedFrame < oldestFrame) {
                oldestFrame = entry.lastUsedFrame;
                oldestIndex = i;
            }
        }

        if (oldestIndex >= 0) {
            this.pool[oldestIndex].texture.destroy();
            this.pool.splice(oldestIndex, 1);
        }
    }

    /**
     * @description プール統計を取得
     * @return {{ total: number, inUse: number, available: number }}
     */
    getStats(): { total: number; inUse: number; available: number }
    {
        let inUse = 0;
        let available = 0;

        for (const entry of this.pool) {
            if (entry.inUse) {
                inUse++;
            } else {
                available++;
            }
        }

        return {
            total: this.pool.length,
            inUse,
            available
        };
    }

    /**
     * @description 解放
     * @return {void}
     */
    dispose(): void
    {
        for (const entry of this.pool) {
            entry.texture.destroy();
        }
        this.pool = [];
    }
}

/**
 * @description グローバルテクスチャプールインスタンス
 */
let $texturePool: TexturePool | null = null;

/**
 * @description テクスチャプールを初期化
 * @param {GPUDevice} device
 * @return {void}
 */
export const initTexturePool = (device: GPUDevice): void =>
{
    $texturePool = new TexturePool(device);
};

/**
 * @description テクスチャプールを取得
 * @return {TexturePool | null}
 */
export const getTexturePool = (): TexturePool | null =>
{
    return $texturePool;
};

/**
 * @description テクスチャプールをクリア
 * @return {void}
 */
export const clearTexturePool = (): void =>
{
    if ($texturePool) {
        $texturePool.dispose();
    }
};
