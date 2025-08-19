export interface ITextureObject {
    id: number;
    resource: GPUTexture;
    width: number;
    height: number;
    area: number;
    smooth: boolean;
}