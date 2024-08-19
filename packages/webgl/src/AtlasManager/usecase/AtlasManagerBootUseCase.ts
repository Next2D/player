import { execute as frameBufferManagerGetAttachmentObjectUseCase } from "../../FrameBufferManager/usecase/FrameBufferManagerGetAttachmentObjectUseCase";
import { $RENDER_MAX_SIZE } from "../../WebGLUtil";
import { TexturePacker } from "@next2d/texture-packer";
import {
    $setAtlasAttachmentObject,
    $rootNodes,
} from "../../AtlasManager";

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
    // ルートノードを登録
    $rootNodes[0] = new TexturePacker(0, $RENDER_MAX_SIZE, $RENDER_MAX_SIZE);

    const attachmentObject = frameBufferManagerGetAttachmentObjectUseCase($RENDER_MAX_SIZE, $RENDER_MAX_SIZE);
    $setAtlasAttachmentObject(attachmentObject);
};