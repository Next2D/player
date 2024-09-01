export interface IStencilBufferObject {
    id: number;
    resource: WebGLRenderbuffer;
    width: number;
    height: number;
    area: number;
    dirty: boolean;
}