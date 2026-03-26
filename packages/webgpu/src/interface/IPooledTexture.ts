/**
 * @description プールされたテクスチャ
 *              Pooled texture interface
 */
export interface IPooledTexture {
    /**
     * @description GPUテクスチャリソース
     *              GPU texture resource
     */
    texture: GPUTexture;
    /**
     * @description テクスチャの幅（ピクセル）
     *              Width of the texture in pixels
     */
    width: number;
    /**
     * @description テクスチャの高さ（ピクセル）
     *              Height of the texture in pixels
     */
    height: number;
    /**
     * @description テクスチャフォーマット
     *              Texture format
     */
    format: GPUTextureFormat;
    /**
     * @description 最後に使用されたフレーム番号
     *              Last frame number when this texture was used
     */
    lastUsedFrame: number;
    /**
     * @description 使用中フラグ
     *              Whether this texture is currently in use
     */
    inUse: boolean;
}

/**
 * @description バケットキーからテクスチャ配列へのマップ
 *              キーは "${po2Width}_${po2Height}_${format}" 形式
 */
export type ITexturePoolBuckets = Map<string, IPooledTexture[]>;
