import type { IAttachmentObject } from "../../interface/IAttachmentObject";
import type { IColorBufferObject } from "../../interface/IColorBufferObject";
import type { IStencilBufferObject } from "../../interface/IStencilBufferObject";
import type { Context } from "../../Context";
import {
    $currentAttachment,
    $setCurrentAttachment,
    $physicalAttachment,
    $attachmentDeferred,
    $setAttachmentDeferred,
    $isFramebufferBound
} from "../../FrameBufferManager";
import { execute as frameBufferManagerBindAttachmentObjectService } from "../../FrameBufferManager/service/FrameBufferManagerBindAttachmentObjectService";
import { execute as maskBindUseCase } from "../../Mask/usecase/MaskBindUseCase";
import {
    $gl,
    $setViewportSize
} from "../../WebGLUtil";

/**
 * @description GL のフレームバッファを attachment_object に切り替える
 *              Switch the GL framebuffer to attachment_object
 *
 * @param  {Context} context
 * @param  {IAttachmentObject} attachment_object
 * @param  {IAttachmentObject | null} previous 直前まで GL に付いていたアタッチメントオブジェクト
 * @return {void}
 * @method
 * @protected
 */
export const $bindPhysical = (
    context: Context,
    attachment_object: IAttachmentObject,
    previous: IAttachmentObject | null
): void => {

    // フレームバッファにアタッチメントオブジェクトをバインドする
    frameBufferManagerBindAttachmentObjectService(attachment_object);

    // ビューポートの大きさは、切り替えを保留している間に書き換わっていることがあるので必ず合わせる
    $setViewportSize(attachment_object.width, attachment_object.height);
    if (!previous
        || previous.width !== attachment_object.width
        || previous.height !== attachment_object.height)
    {
        $gl.viewport(0, 0, attachment_object.width, attachment_object.height);
    }

    // カラーバッファorステンシルバッファが、未初期化の場合はクリアする
    const object = attachment_object.msaa
        ? attachment_object.color as IColorBufferObject
        : attachment_object.stencil as IStencilBufferObject;

    // 再利用のオブジェクトの場合は、描画情報をクリアする
    // テクスチャプールから再利用されたテクスチャ(dirty)もステイル内容を含むためクリア対象
    // clearColorは初期化時に(0,0,0,0)で固定済みのためそのまま使用
    const texture = attachment_object.texture;
    if (object.dirty || texture && texture.dirty) {
        object.dirty = false;
        if (texture) {
            texture.dirty = false;
        }
        context.clearRect(0, 0, attachment_object.width, attachment_object.height);
    }

    // mask bind
    maskBindUseCase(attachment_object.mask);
};

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
    // 描画先の切り替えを保留している間 (ContextDeferBindUseCase): GL にはまだ前の描画先が付いている
    if ($attachmentDeferred) {
        $setAttachmentDeferred(false);

        const physical = $physicalAttachment;
        if (physical
            && physical.id === attachment_object.id
            && $isFramebufferBound
        ) {
            // GL に付いたままの描画先へ戻るだけ: 何も切り替えずに済む
            $setCurrentAttachment(attachment_object);
            $setViewportSize(attachment_object.width, attachment_object.height);
            return ;
        }

        $bindPhysical(context, attachment_object, physical);
        return ;
    }

    // fixed logic
    const currentAttachment = $currentAttachment;
    if (currentAttachment
        && attachment_object.id === currentAttachment.id
    ) {
        return ;
    }

    $bindPhysical(context, attachment_object, currentAttachment);
};
