import type { IAttachmentObject } from "../../interface/IAttachmentObject";
import type { IColorBufferObject } from "../../interface/IColorBufferObject";
import type { IStencilBufferObject } from "../../interface/IStencilBufferObject";
import type { Context } from "../../Context";
import { $getCurrentAttachment } from "../../FrameBufferManager";
import { execute as frameBufferManagerBindAttachmentObjectService } from "../../FrameBufferManager/service/FrameBufferManagerBindAttachmentObjectService";
import { $gl } from "../../WebGLUtil";

/**
 * @description アタッチメントオブジェクトのサイズに変更・初期化し、フレームバッファにアタッチメントオブジェクトをバインドする
 *              Change and initialize to the size of the attachment object and bind the attachment object to the frame buffer
 * 
 * @param  {Context} context
 * @param  {IAttachmentObject} attachment_object
 * @return {void}
 * @method
 * @protected
 */
export const execute = (context: Context, attachment_object: IAttachmentObject): void =>
{
    // fixed logic
    const currentAttachment = $getCurrentAttachment();

    // フレームバッファにアタッチメントオブジェクトをバインドする
    frameBufferManagerBindAttachmentObjectService(attachment_object);

    if (!currentAttachment 
        || currentAttachment.width !== attachment_object.width
        || currentAttachment.height !== attachment_object.height) 
    {
        $gl.viewport(0, 0, attachment_object.width, attachment_object.height);
    }

    // カラーバッファorステンシルバッファが、未初期化の場合はクリアする
    const object = attachment_object.msaa 
        ? attachment_object.color as IColorBufferObject
        : attachment_object.stencil as IStencilBufferObject;

    // 再利用のオブジェクトの場合は、描画情報をクリアする
    if (object.dirty) {

        object.dirty = false;

        // 無色透明で初期化
        context.clearRect(0, 0, attachment_object.width, attachment_object.height);

        // todo mask clear
    }

    // todo mask bind
};