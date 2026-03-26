import type { IAttachmentObject } from "../../interface/IAttachmentObject";
import type { ITextureObject } from "../../interface/ITextureObject";
import type { IColorBufferObject } from "../../interface/IColorBufferObject";
import type { IStencilBufferObject } from "../../interface/IStencilBufferObject";
import { execute as attachmentManagerReleaseTextureService } from "../service/AttachmentManagerReleaseTextureService";

/**
 * @description アタッチメントを解放してプールに返却
 *              Release attachment and return to pool
 *
 * @param  {IAttachmentObject[]} attachment_pool - アタッチメントプール
 * @param  {Map<string, ITextureObject[]>} texture_pool - テクスチャプール
 * @param  {IColorBufferObject[]} color_buffer_pool - カラーバッファプール
 * @param  {IStencilBufferObject[]} stencil_buffer_pool - ステンシルバッファプール
 * @param  {IAttachmentObject} attachment - 解放するアタッチメント
 * @return {void}
 * @method
 * @protected
 */
export const execute = (
    attachment_pool: IAttachmentObject[],
    texture_pool: Map<string, ITextureObject[]>,
    color_buffer_pool: IColorBufferObject[],
    stencil_buffer_pool: IStencilBufferObject[],
    attachment: IAttachmentObject
): void => {
    // テクスチャをプールに返却
    if (attachment.texture) {
        attachmentManagerReleaseTextureService(texture_pool, attachment.texture);
        attachment.texture = null;
    }

    // カラーバッファをプールに返却
    if (attachment.color) {
        color_buffer_pool.push(attachment.color);
        attachment.color = null;
    }

    // ステンシルバッファをプールに返却
    if (attachment.stencil) {
        stencil_buffer_pool.push(attachment.stencil);
        attachment.stencil = null;
    }

    // アタッチメントをプールに返却
    attachment_pool.push(attachment);
};
