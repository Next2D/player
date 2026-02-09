/**
 * @description プールされたテクスチャ
 *              Pooled texture interface
 */
export interface IPooledTexture {
    texture: GPUTexture;
    width: number;
    height: number;
    format: GPUTextureFormat;
    lastUsedFrame: number;
    inUse: boolean;
}

/**
 * @description バケットキーからテクスチャ配列へのマップ
 *              キーは "${po2Width}_${po2Height}_${format}" 形式
 */
export type ITexturePoolBuckets = Map<string, IPooledTexture[]>;
