import type { IStencilBufferObject } from "./IStencilBufferObject";

/**
 * @description WebGPU用カラーバッファオブジェクトインターフェース
 *              WebGPU color buffer object interface
 *
 * WebGLのIColorBufferObjectと同様の構造を持ちますが、
 * リソースはGPUTextureを使用します。
 */
export interface IColorBufferObject
{
    resource: GPUTexture;
    view: GPUTextureView;
    stencil: IStencilBufferObject;
    width: number;
    height: number;
    area: number;
    dirty: boolean;
}
