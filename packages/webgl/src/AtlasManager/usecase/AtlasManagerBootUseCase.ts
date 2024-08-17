import { execute as frameBufferManagerGetAttachmentObjectUseCase } from "../../FrameBufferManager/usecase/FrameBufferManagerGetAttachmentObjectUseCase";
import { $RENDER_MAX_SIZE } from "../../WebGLUtil";
import { $setAtlasAttachmentObject } from "../../AtlasManager";

/**
 * @description アトラスマネージャの起動ユースケース
 *              Atlas manager boot use case
 * 
 * @return {void}
 * @method
 * @protected
 */
export const execute = (): void =>
{
    const attachmentObject = frameBufferManagerGetAttachmentObjectUseCase($RENDER_MAX_SIZE, $RENDER_MAX_SIZE);
    $setAtlasAttachmentObject(attachmentObject);
};