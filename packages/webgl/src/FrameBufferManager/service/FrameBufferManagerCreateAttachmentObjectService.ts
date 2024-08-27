import type { IAttachmentObject } from "../../interface/IAttachmentObject";

/**
 * @type {number}
 * @private
 */
let $id: number = 0;

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
        "id": $id++,
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