import type { IAttachmentObject } from "../../interface/IAttachmentObject";

/**
 * @description 新しいアタッチメントオブジェクトを作成
 *              Create a new attachment object
 *
 * @param  {{ attachmentId: number }} id_counter - ID管理カウンタ
 * @return {IAttachmentObject}
 * @method
 * @protected
 */
export const execute = (
    id_counter: { attachmentId: number }
): IAttachmentObject => {
    return {
        "id": id_counter.attachmentId++,
        "width": 0,
        "height": 0,
        "clipLevel": 0,
        "msaa": false,
        "mask": false,
        "color": null,
        "texture": null,
        "stencil": null,
        "msaaTexture": null,
        "msaaStencil": null
    };
};
