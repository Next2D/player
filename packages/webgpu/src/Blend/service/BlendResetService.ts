import {
    $setFuncCode,
    $getFuncCode
} from "../../Blend";

/**
 * @description ブレンドモードをリセット（normal）に設定
 *              Reset blend mode to normal
 *              WebGPUではパイプライン再作成が必要なため、funcCodeで判定
 *              In WebGPU, pipeline recreation is required, so we use funcCode for determination
 *
 * @return {boolean} ブレンドモードが変更されたかどうか
 * @method
 * @protected
 */
export const execute = (): boolean =>
{
    // 613 = normal blend mode code
    if ($getFuncCode() !== 613) {
        $setFuncCode(613);
        return true;
    }
    return false;
};
