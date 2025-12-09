/**
 * @description テクスチャオブジェクトのインターフェース
 *              Texture object interface for WebGPU
 *
 * WebGLのITextureObjectと互換性を持つために
 * resourceプロパティを持ちます。
 */
export interface ITextureObject
{
    id: number;
    resource: GPUTexture;
    view: GPUTextureView;
    width: number;
    height: number;
    area: number;
    smooth: boolean;
}
