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
    // 各マスクレベルのビットを累積OR
    // level 1: mask = 1 (0x01)
    // level 2: mask = 3 (0x03)
    // level 3: mask = 7 (0x07)
    // ...
    // 結果: mask = (1 << clipLevel) - 1
    let mask = 0;
    for (let idx = 0; idx < clipLevel; ++idx) {
        mask |= (1 << clipLevel - idx) - 1;
    }

    // マスクテストを有効化
    // EQUALテストで、累積マスク値と一致するピクセルのみ描画を許可
    $setMaskTestEnabled(true);
    $setMaskStencilReference(mask & 0xFF); // EQUAL テスト用の参照値

    // マスク描画フェーズは終了
    $setMaskDrawing(false);
};
