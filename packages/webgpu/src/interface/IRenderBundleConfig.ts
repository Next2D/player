/**
 * @description Render Bundle設定インターフェース
 *              Render Bundle configuration interface
 */
export interface IRenderBundleConfig {
    /**
     * @description バンドルID
     */
    id: string;

    /**
     * @description カラーフォーマット
     */
    colorFormats: GPUTextureFormat[];

    /**
     * @description 深度/ステンシルフォーマット（オプション）
     */
    depthStencilFormat?: GPUTextureFormat;

    /**
     * @description サンプル数（MSAAの場合）
     */
    sampleCount?: number;
}

/**
 * @description キャッシュされたRender Bundle
 *              Cached Render Bundle entry
 */
export interface ICachedRenderBundle {
    /**
     * @description Render Bundle
     */
    bundle: GPURenderBundle;

    /**
     * @description 作成時のフレーム番号
     */
    createdFrame: number;

    /**
     * @description 最後に使用されたフレーム番号
     */
    lastUsedFrame: number;

    /**
     * @description バンドルが有効かどうか
     */
    valid: boolean;

    /**
     * @description コンテンツのハッシュ（変更検知用）
     */
    contentHash: number;
}
