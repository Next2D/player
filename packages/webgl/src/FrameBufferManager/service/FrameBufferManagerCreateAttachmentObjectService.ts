import type { IAttachment } from "../../interface/IAttachment";

/**
 * @description FrameBufferManagerのアタッチメントオブジェクトを新規作成
 *              Create a new attachment object for FrameBufferManager
 *
 * @return {IAttachment}
 * @method
 * @protected
 */
export const execute = (): IAttachment => 
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