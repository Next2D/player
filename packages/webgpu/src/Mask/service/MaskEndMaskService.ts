import { $context } from "../../WebGPUUtil";
import {
    $setMaskTestEnabled,
    $setMaskStencilReference,
    $setMaskDrawing
} from "../../Mask";

/**
 * @description マスクの描画を終了
 *              End mask drawing
 *
 * WebGPU版: INVERT操作後、NOT-EQUALテストで非ゼロステンシルの領域のみ描画
 * WebGL版はビット単位のマスキングを使用するが、WebGPUでは動的に変更できないため
 * シンプルなNOT-EQUAL 0テストを使用
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

    // マスクテストを有効化
    // INVERT操作後、カバーされたピクセルはステンシル値が非ゼロ（0xFF）になる
    // NOT-EQUAL 0テストで、非ゼロのピクセルのみ描画を許可
    $setMaskTestEnabled(true);
    $setMaskStencilReference(0); // NOT-EQUAL 0 テスト用

    // マスク描画フェーズは終了
    $setMaskDrawing(false);
};
