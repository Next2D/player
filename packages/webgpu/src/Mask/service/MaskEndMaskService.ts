import { $context } from "../../WebGPUUtil";

/**
 * @description マスクの描画を終了
 *              End mask drawing
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

    // WebGPUではステンシル設定はレンダーパスの作成時に設定されるため、
    // ここでは状態を保持するだけで実際の設定は行わない
    // 実際のステンシル操作はレンダーパス開始時に clipLevel を参照して設定される
};
