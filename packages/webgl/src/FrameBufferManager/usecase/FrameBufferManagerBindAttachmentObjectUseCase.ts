import type { IAttachmentObject } from "../../interface/IAttachmentObject";
import { $setCurrentAttachment } from "../../FrameBufferManager";

export const execute = (attachment_object: IAttachmentObject): void =>
{
    $setCurrentAttachment(attachment_object);
};