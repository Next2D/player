import type { IColorBufferObject } from "./IColorBufferObject";
import type { ITextureObject } from "./ITextureObject";
import type { IStencilBufferObject } from "./IStencilBufferObject";

export interface IAttachment {
    width: number;
    height: number;
    msaa: boolean;
    mask: boolean;
    clipLevel: number;
    color: IColorBufferObject | null;
    texture: ITextureObject | null;
    stencil: IStencilBufferObject | null;
    isActive: boolean;
}