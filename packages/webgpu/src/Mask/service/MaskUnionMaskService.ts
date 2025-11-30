import { $context } from "../../WebGPUUtil";

/**
 * @description マスクの合成処理
 *              Mask synthesis processing
 *
 * @return {void}
 * @method
 * @protected
 */
export const execute = (): void =>
{
    const currentAttachmentObject = $context.currentAttachmentObject;
    if (!currentAttachmentObject) {
        return;
    }

    // WebGPUでは、ステンシルバッファのマージは
    // レンダーパスのステンシル設定で処理される
    // ここでは状態管理のみを行う
};
