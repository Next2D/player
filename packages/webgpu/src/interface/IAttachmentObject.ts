import type { ITextureObject } from "./ITextureObject";

export interface IAttachmentObject
{
    readonly id: number;
    width: number;
    height: number;
    clipLevel: number;
    msaa: boolean;
    mask: boolean;
    texture: GPUTexture;
    textureView: GPUTextureView;
    color: GPUTexture | null;
    stencil: GPUTexture | null;
    colorTexture: ITextureObject | null;
    stencilTexture: GPUTexture | null;
    stencilView: GPUTextureView | null;
}
