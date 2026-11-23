import type { IAttachmentObject } from "./IAttachmentObject";

export interface IGradientLUTSlot {
    attachment: IAttachmentObject;
    hash: number;
    interpolation: number;
    length: number;
    stops: number[];
    pass: number;
}
