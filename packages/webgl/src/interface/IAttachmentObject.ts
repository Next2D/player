import type { IColorBufferObject } from "./IColorBufferObject";
import type { ITextureObject } from "./ITextureObject";
import type { IStencilBufferObject } from "./IStencilBufferObject";

export interface IAttachmentObject {
    id: number;
    width: number;
    height: number;
    clipLevel: number;
    msaa: boolean;
    mask: boolean;
    color: IColorBufferObject | null;
    texture: ITextureObject | null;
    stencil: IStencilBufferObject | null;
}