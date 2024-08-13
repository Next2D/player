export interface IColorBufferObject {
    colorRenderbuffer: WebGLRenderbuffer | null;
    stencilRenderbuffer: WebGLRenderbuffer | null;
    width: number;
    height: number;
    area: number;
}