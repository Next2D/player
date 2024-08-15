import type { Context } from "../../Context";
import { execute as frameBufferManagerReleaseAttachmentObjectUseCase } from "../../FrameBufferManager/usecase/FrameBufferManagerReleaseAttachmentObjectUseCase";
import { execute as frameBufferManagerGetAttachmentObjectUseCase } from "../../FrameBufferManager/usecase/FrameBufferManagerGetAttachmentObjectUseCase";
import { execute as frameBufferManagerUnBindAttachmentObjectService } from "../../FrameBufferManager/service/FrameBufferManagerUnBindAttachmentObjectService";
import { $getCurrentAttachment } from "../../FrameBufferManager";

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
    // todo clearInstacedArray

    if (context.$mainAttachment) {
        frameBufferManagerReleaseAttachmentObjectUseCase(context.$mainAttachment);
      
        // unbind
        if (context.$mainAttachment === $getCurrentAttachment()) {
            frameBufferManagerUnBindAttachmentObjectService();
        }
    }

    // new attachment object
    context.$mainAttachment = frameBufferManagerGetAttachmentObjectUseCase(width, height, true);
    context.bind(context.$mainAttachment);
};