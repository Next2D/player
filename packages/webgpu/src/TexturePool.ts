import type { ITexturePoolBuckets } from "./interface/IPooledTexture";
import { execute as texturePoolAcquireUseCase } from "./TexturePool/usecase/TexturePoolAcquireUseCase";
import { execute as texturePoolReleaseService } from "./TexturePool/service/TexturePoolReleaseService";
import { execute as texturePoolCleanupService } from "./TexturePool/service/TexturePoolCleanupService";

/**
 * @description プールの最大サイズ
 *              Maximum pool size for texture reuse
 * @type {number}
 */
const $MAX_POOL_SIZE = 32;

/**
 * @description キャッシュのクリーンアップ閾値（フレーム数）
 *              Cache cleanup threshold in frames (3 seconds at 60FPS)
 * @type {number}
 */
const $CACHE_CLEANUP_THRESHOLD = 180;

/**
 * @description テクスチャプールマネージャー（Power-of-2バケット版）
 *              Texture pool manager for WebGPU optimization
 *
 *              リクエストサイズをPower-of-2に切り上げてバケット化。
 *              同一バケット内で高いキャッシュヒット率を実現。
 *              LRUベースで未使用テクスチャを回収。
 */
export class TexturePool
{
    /**
     * @description WebGPUデバイスの参照
     *              Reference to the WebGPU device
     * @type {GPUDevice}
     */
    private device: GPUDevice;

    /**
     * @description Power-of-2バケットによるテクスチャプール
     *              Texture pool organized by power-of-2 buckets
     * @type {ITexturePoolBuckets}
     */
    private buckets: ITexturePoolBuckets;

    /**
     * @description 現在のフレーム番号
     *              Current frame number for LRU tracking
     * @type {number}
     */
    private currentFrame: number;

    /**
     * @description プール内のテクスチャ総数
     *              Total count of textures in the pool
     * @type {number[]}
     */
    private totalCount: number[];

    /**
     * @description テクスチャプールを生成する
     *              Create a new texture pool instance
     * @param {GPUDevice} device - WebGPUデバイス / WebGPU device
     * @constructor
     */
    constructor(device: GPUDevice)
    {
        this.device = device;
        this.buckets = new Map();
        this.currentFrame = 0;
        this.totalCount = [0];
    }

    /**
     * @description フレーム開始時に呼び出し、定期的にプールをクリーンアップする
     *              Called at the beginning of each frame; periodically cleans up the pool
     * @return {void}
     */
    beginFrame(): void
    {
        this.currentFrame++;

        // 定期的にプールをクリーンアップ（LRU回収）
        if (this.currentFrame % 60 === 0) {
            texturePoolCleanupService(this.buckets, this.currentFrame, $CACHE_CLEANUP_THRESHOLD, this.totalCount);
        }
    }

    /**
     * @description テクスチャを取得または作成する
     *              Acquire a texture from the pool or create a new one
     * @param {number} width - テクスチャの幅 / texture width
     * @param {number} height - テクスチャの高さ / texture height
     * @param {GPUTextureFormat} format - テクスチャフォーマット / texture format
     * @param {GPUTextureUsageFlags} usage - テクスチャ使用フラグ / texture usage flags
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
            this.buckets,
            width,
            height,
            format,
            usage,
            this.currentFrame,
            $MAX_POOL_SIZE,
            this.totalCount
        );
    }

    /**
     * @description テクスチャをプールに返却する
     *              Release a texture back to the pool for reuse
     * @param {GPUTexture} texture - 返却するテクスチャ / texture to release
     * @return {void}
     */
    release(texture: GPUTexture): void
    {
        texturePoolReleaseService(this.buckets, texture, this.currentFrame);
    }

    /**
     * @description プール統計を取得する
     *              Get pool statistics including total, in-use, and available counts
     * @return {{ total: number, inUse: number, available: number }}
     */
    getStats(): { total: number; inUse: number; available: number }
    {
        let inUse = 0;
        let available = 0;

        for (const bucket of this.buckets.values()) {
            for (const entry of bucket) {
                if (entry.inUse) {
                    inUse++;
                } else {
                    available++;
                }
            }
        }

        return {
            "total": this.totalCount[0],
            inUse,
            available
        };
    }

    /**
     * @description 全テクスチャを破棄しプールを解放する
     *              Destroy all textures and dispose of the pool
     * @return {void}
     */
    dispose(): void
    {
        for (const bucket of this.buckets.values()) {
            for (const entry of bucket) {
                entry.texture.destroy();
            }
        }
        this.buckets.clear();
        this.totalCount[0] = 0;
    }
}
