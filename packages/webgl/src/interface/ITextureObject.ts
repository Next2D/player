export interface ITextureObject {
    resource: WebGLTexture | null;
    width: number;
    height: number;
    area: number;
    smoothing: boolean;
    dirty: boolean;
}