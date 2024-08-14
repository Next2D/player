import type { IStencilBufferObject } from "./IStencilBufferObject";

export interface IColorBufferObject {
    resource: WebGLRenderbuffer;
    stencil: IStencilBufferObject;
    width: number;
    height: number;
    area: number;
    dirty: boolean;
}