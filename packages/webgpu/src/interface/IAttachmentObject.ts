import type { ITextureObject } from "./ITextureObject";

export interface IAttachmentObject {
    id: number;
    width: number;
    height: number;
    clipLevel: number;
    msaa: boolean;
    mask: boolean;
    texture: ITextureObject | null;
}