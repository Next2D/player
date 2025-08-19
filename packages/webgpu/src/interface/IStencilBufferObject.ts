export interface IStencilBufferObject {
    id: number;
    resource: GPUTexture; // WebGPU uses depth-stencil textures
    width: number;
    height: number;
    area: number;
    dirty: boolean;
}