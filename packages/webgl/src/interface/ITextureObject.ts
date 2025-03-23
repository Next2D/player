export interface ITextureObject {
    id: number;
    resource: WebGLTexture;
    width: number;
    height: number;
    area: number;
    smooth: boolean;
}