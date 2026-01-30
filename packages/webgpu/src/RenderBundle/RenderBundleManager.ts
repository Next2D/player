import type { IRenderBundleConfig, ICachedRenderBundle } from "../interface/IRenderBundleConfig";
import { execute as createRenderBundleService } from "./service/RenderBundleCreateService";
import { execute as executeRenderBundleUseCase } from "./usecase/RenderBundleExecuteUseCase";

/**
 * @description Render Bundle Manager
 *              静的ジオメトリのバンドル化と再利用を管理
 *
 * Render Bundleを使用することで：
 * - 静的ジオメトリの再描画コストを削減（10-15%）
 * - 描画コマンドのオーバーヘッドを軽減
 * - GPU側でのコマンド最適化が可能
 *
 * @class
 */
export class RenderBundleManager
{
    private device: GPUDevice;
    private preferredFormat: GPUTextureFormat;
    private bundles: Map<string, ICachedRenderBundle>;
    private frameNumber: number;

    // キャッシュの最大保持フレーム数
    private static readonly MAX_CACHE_AGE = 60;

    /**
     * @constructor
     * @param {GPUDevice} device - WebGPU device
     * @param {GPUTextureFormat} preferredFormat - 推奨テクスチャフォーマット
     */
    constructor (device: GPUDevice, preferredFormat: GPUTextureFormat)
    {
        this.device = device;
        this.preferredFormat = preferredFormat;
        this.bundles = new Map();
        this.frameNumber = 0;
    }

    /**
     * @description フレーム開始時に呼び出し
     *              Call at frame start
     */
    beginFrame (): void
    {
        this.frameNumber++;

        // 古いバンドルをクリーンアップ（60フレームごと）
        if (this.frameNumber % 60 === 0) {
            this.cleanupOldBundles();
        }
    }

    /**
     * @description Render Bundleを作成またはキャッシュから取得
     *              Create or get Render Bundle from cache
     *
     * @param {string} id - バンドルID
     * @param {number} contentHash - コンテンツのハッシュ値（変更検知用）
     * @param {(encoder: GPURenderBundleEncoder) => void} recordCallback - 描画コマンドを記録するコールバック
     * @param {Partial<IRenderBundleConfig>} options - 追加オプション
     * @return {GPURenderBundle} Render Bundle
     */
    getOrCreateBundle (
        id: string,
        contentHash: number,
        recordCallback: (encoder: GPURenderBundleEncoder) => void,
        options: Partial<IRenderBundleConfig> = {}
    ): GPURenderBundle {

        // キャッシュをチェック
        const cached = this.bundles.get(id);

        if (cached && cached.valid && cached.contentHash === contentHash) {
            // キャッシュヒット: 使用時刻を更新して返す
            cached.lastUsedFrame = this.frameNumber;
            return cached.bundle;
        }

        // キャッシュミス: 新しいバンドルを作成
        const config: IRenderBundleConfig = {
            "id": id,
            "colorFormats": options.colorFormats || [this.preferredFormat],
            "depthStencilFormat": options.depthStencilFormat,
            "sampleCount": options.sampleCount
        };

        const bundle = createRenderBundleService(this.device, config, recordCallback);

        // キャッシュに保存
        this.bundles.set(id, {
            "bundle": bundle,
            "createdFrame": this.frameNumber,
            "lastUsedFrame": this.frameNumber,
            "valid": true,
            "contentHash": contentHash
        });

        return bundle;
    }

    /**
     * @description Render Bundleを実行
     *              Execute Render Bundle
     *
     * @param {GPURenderPassEncoder} passEncoder - レンダーパスエンコーダー
     * @param {string[]} bundleIds - 実行するバンドルIDの配列
     * @return {void}
     */
    executeBundles (passEncoder: GPURenderPassEncoder, bundleIds: string[]): void
    {
        const bundles: GPURenderBundle[] = [];

        for (const id of bundleIds) {
            const cached = this.bundles.get(id);
            if (cached && cached.valid) {
                cached.lastUsedFrame = this.frameNumber;
                bundles.push(cached.bundle);
            }
        }

        if (bundles.length > 0) {
            executeRenderBundleUseCase(passEncoder, bundles);
        }
    }

    /**
     * @description 単一のRender Bundleを実行
     *              Execute single Render Bundle
     *
     * @param {GPURenderPassEncoder} passEncoder - レンダーパスエンコーダー
     * @param {GPURenderBundle} bundle - 実行するバンドル
     * @return {void}
     */
    executeBundle (passEncoder: GPURenderPassEncoder, bundle: GPURenderBundle): void
    {
        executeRenderBundleUseCase(passEncoder, [bundle]);
    }

    /**
     * @description バンドルを無効化
     *              Invalidate a bundle
     *
     * @param {string} id - バンドルID
     * @return {void}
     */
    invalidateBundle (id: string): void
    {
        const cached = this.bundles.get(id);
        if (cached) {
            cached.valid = false;
        }
    }

    /**
     * @description すべてのバンドルを無効化
     *              Invalidate all bundles
     *
     * @return {void}
     */
    invalidateAll (): void
    {
        for (const cached of this.bundles.values()) {
            cached.valid = false;
        }
    }

    /**
     * @description バンドルを削除
     *              Remove a bundle
     *
     * @param {string} id - バンドルID
     * @return {void}
     */
    removeBundle (id: string): void
    {
        this.bundles.delete(id);
    }

    /**
     * @description 古いバンドルをクリーンアップ
     *              Cleanup old bundles
     *
     * @private
     */
    private cleanupOldBundles (): void
    {
        const idsToRemove: string[] = [];

        for (const [id, cached] of this.bundles.entries()) {
            // 無効なバンドルまたは長期間使用されていないバンドルを削除
            if (!cached.valid ||
                this.frameNumber - cached.lastUsedFrame > RenderBundleManager.MAX_CACHE_AGE) {
                idsToRemove.push(id);
            }
        }

        for (const id of idsToRemove) {
            this.bundles.delete(id);
        }
    }

    /**
     * @description キャッシュの統計情報を取得
     *              Get cache statistics
     *
     * @return {{ totalBundles: number, validBundles: number }}
     */
    getStats (): { totalBundles: number; validBundles: number }
    {
        let validCount = 0;
        for (const cached of this.bundles.values()) {
            if (cached.valid) {
                validCount++;
            }
        }

        return {
            "totalBundles": this.bundles.size,
            "validBundles": validCount
        };
    }

    /**
     * @description コンテンツのハッシュを計算するヘルパー
     *              Helper to calculate content hash
     *
     * 単純な数値ハッシュを生成。
     * より複雑なコンテンツには専用のハッシュ関数を使用することを推奨。
     *
     * @param {number[]} values - ハッシュ化する値の配列
     * @return {number} ハッシュ値
     */
    static calculateHash (values: number[]): number
    {
        let hash = 0;
        for (const value of values) {
            // 単純なハッシュ関数
            const intValue = value | 0;
            hash = (hash << 5) - hash + intValue | 0;
        }
        return hash;
    }

    /**
     * @description リソースを破棄
     *              Destroy resources
     */
    destroy (): void
    {
        this.bundles.clear();
    }
}
