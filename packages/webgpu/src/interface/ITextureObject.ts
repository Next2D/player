/**
 * @description テクスチャオブジェクトのインターフェース
 *              Texture object interface for WebGPU
 */
export interface ITextureObject
{
    id: number;
    texture: GPUTexture;
    view: GPUTextureView;
    width: number;
    height: number;
    area: number;
    smooth: boolean;
}
