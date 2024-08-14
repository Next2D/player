export interface IStencilBufferObject {
    resource: WebGLRenderbuffer;
    width: number;
    height: number;
    area: number;
    dirty: boolean;
}