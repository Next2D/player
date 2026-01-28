import { $context } from "../../WebGPUUtil";
import {
    $setMaskTestEnabled,
    $setMaskStencilReference,
    $setMaskDrawing
} from "../../Mask";
import { isDebugEnabled, logMask } from "../../Debug/DebugLogger";

/**
 * @description マスクの描画を終了
 *              End mask drawing
 *
 * WebGPU版: ビット単位のマスキングを使用（WebGL版と同様）
 * 各レベルに対応するビットが設定されたマスク値を計算し、
 * EQUALテストで累積マスク値と一致する領域のみ描画
 *
 * WebGL版: stencilFunc(EQUAL, mask & 0xff, mask)
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

    const clipLevel = currentAttachmentObject.clipLevel;

    // 累積マスク値を計算（WebGL版と同じアルゴリズム）
    // 簡略化: mask = (1 << clipLevel) - 1
    // level 1: mask = 1 (0x01)
    // level 2: mask = 3 (0x03)
    // level 3: mask = 7 (0x07)
    // ...
    const mask = (1 << clipLevel) - 1;

    // デバッグ出力: マスク値を追跡
    if (isDebugEnabled()) {
        logMask("MaskEndMaskService execute", {
            clipLevel,
            "maskValue": mask,
            "maskBinary": mask.toString(2).padStart(8, "0"),
            "isMaskTestEnabled": true,
            "isMaskDrawing": false
        });
    }

    // マスクテストを有効化
    // EQUALテストで、累積マスク値と一致するピクセルのみ描画を許可
    $setMaskTestEnabled(true);
    $setMaskStencilReference(mask & 0xFF); // EQUAL テスト用の参照値

    // マスク描画フェーズは終了
    $setMaskDrawing(false);
};
