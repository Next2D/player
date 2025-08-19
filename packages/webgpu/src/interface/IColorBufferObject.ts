import type { IStencilBufferObject } from "./IStencilBufferObject";

export interface IColorBufferObject {
    resource: GPUTexture; // WebGPU uses textures for render targets instead of renderbuffers
    stencil: IStencilBufferObject;
    width: number;
    height: number;
    area: number;
    dirty: boolean;
}