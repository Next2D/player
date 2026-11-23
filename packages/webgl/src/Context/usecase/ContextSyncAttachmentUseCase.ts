import type { Context } from "../../Context";
import {
    $currentAttachment,
    $physicalAttachment,
    $setAttachmentDeferred
} from "../../FrameBufferManager";
import { $bindPhysical } from "./ContextBindUseCase";

/**
 * @description 保留していた描画先の切り替え (ContextDeferBindUseCase) を、GL のフレームバッファに反映する。
 *              GL で描く処理の先頭で、$attachmentDeferred が true のときに呼ぶ。
 *              Apply the postponed render target switch (ContextDeferBindUseCase) to the GL framebuffer.
 *              Called at the start of anything that draws with GL, when $attachmentDeferred is true.
 *
 * @param  {Context} context
 * @return {void}
 * @method
 * @protected
 */
export const execute = (context: Context): void =>
{
    $setAttachmentDeferred(false);

    const attachment = $currentAttachment;
    if (!attachment) {
        return ;
    }

    $bindPhysical(context, attachment, $physicalAttachment);
};
