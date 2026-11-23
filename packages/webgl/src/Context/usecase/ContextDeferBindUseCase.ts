import type { IAttachmentObject } from "../../interface/IAttachmentObject";
import {
    $currentAttachment,
    $setCurrentAttachment,
    $setAttachmentDeferred
} from "../../FrameBufferManager";
import { $setViewportSize } from "../../WebGLUtil";

/**
 * @description 描画先を attachment_object に切り替えるが、GL のフレームバッファの切り替えは、実際に GL で
 *              描く時点まで保留する。アトラスへ図形を描いた後に元の描画先へ戻す処理で使う: 未キャッシュの
 *              図形が続くと、次の図形がすぐにアトラスへ切り替え直すので、戻す切り替えは無駄になる。
 *              現在の描画先とビューポートの大きさ (どちらも JavaScript の値) は、ここで切り替え後の値にする。
 *              Switch the render target to attachment_object, but postpone switching the GL framebuffer
 *              until something is actually drawn with GL. Used to go back to the previous target after
 *              drawing a shape into the atlas: when uncached shapes follow one another, the next one
 *              switches straight back to the atlas, so switching back in between is wasted. The current
 *              attachment and the viewport size (both JavaScript values) take their new values here.
 *
 * @param  {IAttachmentObject} attachment_object
 * @return {void}
 * @method
 * @protected
 */
export const execute = (attachment_object: IAttachmentObject): void =>
{
    const currentAttachment = $currentAttachment;
    if (currentAttachment
        && attachment_object.id === currentAttachment.id
    ) {
        return ;
    }

    $setCurrentAttachment(attachment_object);
    $setViewportSize(attachment_object.width, attachment_object.height);
    $setAttachmentDeferred(true);
};
