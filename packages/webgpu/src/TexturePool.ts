import type { IPooledTexture } from "./TexturePool/interface/IPooledTexture";
import { execute as texturePoolAcquireUseCase } from "./TexturePool/usecase/TexturePoolAcquireUseCase";
import { execute as texturePoolReleaseService } from "./TexturePool/service/TexturePoolReleaseService";
import { execute as texturePoolCleanupService } from "./TexturePool/service/TexturePoolCleanupService";

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
 *              Texture pool manager for WebGPU optimization
 *
 *              WebGPUではテクスチャの作成コストが高いため、
 *              同じサイズ・フォーマットのテクスチャをプールして再利用する
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
            texturePoolCleanupService(this.pool, this.currentFrame, CACHE_CLEANUP_THRESHOLD);
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
        return texturePoolAcquireUseCase(
            this.device,
            this.pool,
            width,
            height,
            format,
            usage,
            this.currentFrame,
            MAX_POOL_SIZE
        );
    }

    /**
     * @description テクスチャをプールに返却
     * @param {GPUTexture} texture - 返却するテクスチャ
     * @return {void}
     */
    release(texture: GPUTexture): void
    {
        texturePoolReleaseService(this.pool, texture, this.currentFrame);
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
