import type { IAttachmentObject } from "../../interface/IAttachmentObject";

/**
 * @description FrameBufferManagerのアタッチメントオブジェクトを新規作成
 *              Create a new attachment object for FrameBufferManager
 *
 * @return {IAttachmentObject}
 * @method
 * @protected
 */
export const execute = (): IAttachmentObject => 
{
    return {
        "width": 0,
        "height": 0,
        "clipLevel": 0,
        "msaa": false,
        "mask": false,
        "color": null,
        "texture": null,
        "stencil": null
    }
};