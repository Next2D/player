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
