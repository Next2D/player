import type { IAttachmentObject } from "../../interface/IAttachmentObject";
import type { ITextureObject } from "../../interface/ITextureObject";
import type { IColorBufferObject } from "../../interface/IColorBufferObject";
import type { IStencilBufferObject } from "../../interface/IStencilBufferObject";
import { execute as attachmentManagerCreateAttachmentObjectService } from "../service/AttachmentManagerCreateAttachmentObjectService";
import { execute as attachmentManagerGetStencilBufferService } from "../service/AttachmentManagerGetStencilBufferService";
import { execute as attachmentManagerGetColorBufferService } from "../service/AttachmentManagerGetColorBufferService";
import { execute as attachmentManagerGetTextureService } from "../service/AttachmentManagerGetTextureService";

/**
 * @description アタッチメントオブジェクトを取得
 *              Get attachment object
 *
 * @param  {GPUDevice} device - GPUデバイス
 * @param  {IAttachmentObject[]} attachment_pool - アタッチメントプール
 * @param  {Map<string, ITextureObject[]>} texture_pool - テクスチャプール
 * @param  {IColorBufferObject[]} color_buffer_pool - カラーバッファプール
 * @param  {IStencilBufferObject[]} stencil_buffer_pool - ステンシルバッファプール
 * @param  {number} width - バッファ幅
 * @param  {number} height - バッファ高さ
 * @param  {boolean} msaa - MSAA有効フラグ
 * @param  {{ attachmentId: number, textureId: number, stencilId: number }} id_counter - ID管理カウンタ
 * @return {IAttachmentObject}
 * @method
 * @protected
 */
export const execute = (
    device: GPUDevice,
    attachment_pool: IAttachmentObject[],
    texture_pool: Map<string, ITextureObject[]>,
    color_buffer_pool: IColorBufferObject[],
    stencil_buffer_pool: IStencilBufferObject[],
    width: number,
    height: number,
    msaa: boolean,
    id_counter: { attachmentId: number; textureId: number; stencilId: number }
): IAttachmentObject => {
    // プールから再利用
    const attachment = attachment_pool.length > 0
        ? attachment_pool.pop()!
        : attachmentManagerCreateAttachmentObjectService(id_counter);

    // サイズとフラグを更新
    attachment.width = width;
    attachment.height = height;
    attachment.msaa = msaa;
    attachment.mask = false;
    attachment.clipLevel = 0;

    // ステンシルバッファを取得または作成
    const stencil = attachmentManagerGetStencilBufferService(
        device,
        stencil_buffer_pool,
        width,
        height,
        id_counter
    );

    // カラーバッファを取得または作成（ステンシルを参照）
    const color = attachmentManagerGetColorBufferService(
        device,
        color_buffer_pool,
        width,
        height,
        stencil
    );
    attachment.color = color;
    attachment.stencil = stencil;

    // テクスチャを取得
    const texture = attachmentManagerGetTextureService(
        device,
        texture_pool,
        width,
        height,
        true,
        id_counter
    );
    attachment.texture = texture;

    return attachment;
};
