/**
 * @description WebGPU用ステンシルバッファオブジェクトインターフェース
 *              WebGPU stencil buffer object interface
 *
 * WebGLのIStencilBufferObjectと同様の構造を持ちますが、
 * リソースはGPUTextureを使用します。
 */
export interface IStencilBufferObject
{
    id: number;
    resource: GPUTexture;
    view: GPUTextureView;
    width: number;
    height: number;
    area: number;
    dirty: boolean;
}
