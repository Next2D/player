export interface ITextureObject {
    resource: WebGLTexture;
    width: number;
    height: number;
    area: number;
    smoothing: boolean;
    dirty: boolean;
}