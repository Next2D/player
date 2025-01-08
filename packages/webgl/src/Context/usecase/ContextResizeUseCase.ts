import type { Context } from "../../Context";
import { execute as frameBufferManagerReleaseAttachmentObjectUseCase } from "../../FrameBufferManager/usecase/FrameBufferManagerReleaseAttachmentObjectUseCase";
import { execute as frameBufferManagerGetAttachmentObjectUseCase } from "../../FrameBufferManager/usecase/FrameBufferManagerGetAttachmentObjectUseCase";
import { execute as frameBufferManagerUnBindAttachmentObjectService } from "../../FrameBufferManager/service/FrameBufferManagerUnBindAttachmentObjectService";
import { execute as atlasManagerResetUseCase } from "../../AtlasManager/usecase/AtlasManagerResetUseCase";

/**
 * @description メインのアタッチメントオブジェクトをリサイズする
 *              Resize the main attachment object
 *
 * @param  {Context} context
 * @param  {number} width
 * @param  {number} height
 * @return {void}
 * @method
 * @protected
 */
export const execute = (context: Context, width: number, height: number): void =>
{
    // clear InstacedArray
    context.clearArraysInstanced();

    if (context.$stackAttachmentObject.length) {
        for (let idx = 0; idx < context.$stackAttachmentObject.length; ++idx) {
            const attachmentObject = context.$stackAttachmentObject[idx];
            if (!attachmentObject) {
                continue;
            }
            frameBufferManagerReleaseAttachmentObjectUseCase(attachmentObject);
        }
    } else {
        if (context.$mainAttachmentObject) {
            frameBufferManagerReleaseAttachmentObjectUseCase(context.$mainAttachmentObject);
        }
    }

    // reset node
    atlasManagerResetUseCase();

    // unbind
    frameBufferManagerUnBindAttachmentObjectService();

    // new attachment object
    context.$mainAttachmentObject = frameBufferManagerGetAttachmentObjectUseCase(width, height, true);
    context.bind(context.$mainAttachmentObject);
};