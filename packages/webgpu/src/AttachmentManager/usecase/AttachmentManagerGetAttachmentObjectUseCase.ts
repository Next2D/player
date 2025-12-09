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
 * @param  {GPUDevice} device
 * @param  {IAttachmentObject[]} attachmentPool
 * @param  {Map<string, ITextureObject[]>} texturePool
 * @param  {IColorBufferObject[]} colorBufferPool
 * @param  {IStencilBufferObject[]} stencilBufferPool
 * @param  {number} width
 * @param  {number} height
 * @param  {boolean} msaa
 * @param  {{ attachmentId: number, textureId: number, stencilId: number }} idCounter
 * @return {IAttachmentObject}
 * @method
 * @protected
 */
export const execute = (
    device: GPUDevice,
    attachmentPool: IAttachmentObject[],
    texturePool: Map<string, ITextureObject[]>,
    colorBufferPool: IColorBufferObject[],
    stencilBufferPool: IStencilBufferObject[],
    width: number,
    height: number,
    msaa: boolean,
    idCounter: { attachmentId: number; textureId: number; stencilId: number }
): IAttachmentObject => {
    // プールから再利用
    const attachment = attachmentPool.length > 0
        ? attachmentPool.pop()!
        : attachmentManagerCreateAttachmentObjectService(idCounter);

    // サイズとフラグを更新
    attachment.width = width;
    attachment.height = height;
    attachment.msaa = msaa;
    attachment.mask = false;
    attachment.clipLevel = 0;

    // ステンシルバッファを取得または作成
    const stencil = attachmentManagerGetStencilBufferService(
        device,
        stencilBufferPool,
        width,
        height,
        idCounter
    );

    // カラーバッファを取得または作成（ステンシルを参照）
    const color = attachmentManagerGetColorBufferService(
        device,
        colorBufferPool,
        width,
        height,
        stencil
    );
    attachment.color = color;
    attachment.stencil = stencil;

    // テクスチャを取得
    const texture = attachmentManagerGetTextureService(
        device,
        texturePool,
        width,
        height,
        true,
        idCounter
    );
    attachment.texture = texture;

    return attachment;
};
