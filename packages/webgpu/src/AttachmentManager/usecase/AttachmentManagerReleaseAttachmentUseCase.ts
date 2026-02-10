import type { IAttachmentObject } from "../../interface/IAttachmentObject";
import type { ITextureObject } from "../../interface/ITextureObject";
import type { IColorBufferObject } from "../../interface/IColorBufferObject";
import type { IStencilBufferObject } from "../../interface/IStencilBufferObject";
import { execute as attachmentManagerReleaseTextureService } from "../service/AttachmentManagerReleaseTextureService";

/**
 * @description アタッチメントを解放してプールに返却
 *              Release attachment and return to pool
 *
 * @param  {IAttachmentObject[]} attachmentPool
 * @param  {Map<string, ITextureObject[]>} texturePool
 * @param  {IColorBufferObject[]} colorBufferPool
 * @param  {IStencilBufferObject[]} stencilBufferPool
 * @param  {IAttachmentObject} attachment
 * @return {void}
 * @method
 * @protected
 */
export const execute = (
    attachmentPool: IAttachmentObject[],
    texturePool: Map<string, ITextureObject[]>,
    colorBufferPool: IColorBufferObject[],
    stencilBufferPool: IStencilBufferObject[],
    attachment: IAttachmentObject
): void => {
    // テクスチャをプールに返却
    if (attachment.texture) {
        attachmentManagerReleaseTextureService(texturePool, attachment.texture);
        attachment.texture = null;
    }

    // カラーバッファをプールに返却
    if (attachment.color) {
        colorBufferPool.push(attachment.color);
        attachment.color = null;
    }

    // ステンシルバッファをプールに返却
    if (attachment.stencil) {
        stencilBufferPool.push(attachment.stencil);
        attachment.stencil = null;
    }

    // アタッチメントをプールに返却
    attachmentPool.push(attachment);
};
