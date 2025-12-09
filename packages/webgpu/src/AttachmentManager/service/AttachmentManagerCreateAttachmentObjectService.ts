import type { IAttachmentObject } from "../../interface/IAttachmentObject";

/**
 * @description 新しいアタッチメントオブジェクトを作成
 *              Create a new attachment object
 *
 * @param  {{ attachmentId: number }} idCounter
 * @return {IAttachmentObject}
 * @method
 * @protected
 */
export const execute = (
    idCounter: { attachmentId: number }
): IAttachmentObject => {
    return {
        id: idCounter.attachmentId++,
        width: 0,
        height: 0,
        clipLevel: 0,
        msaa: false,
        mask: false,
        color: null,
        texture: null,
        stencil: null
    };
};
