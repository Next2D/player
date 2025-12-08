import {
    $setFuncCode,
    $getFuncCode
} from "../../Blend";

/**
 * @description ブレンドモードをCopy（ONE/ZERO）に設定
 *              Set blend mode to Copy (ONE/ZERO)
 *
 * @return {boolean} ブレンドモードが変更されたかどうか
 * @method
 * @protected
 */
export const execute = (): boolean =>
{
    // 10 = one/zero blend mode code (copy)
    if ($getFuncCode() !== 10) {
        $setFuncCode(10);
        return true;
    }
    return false;
};
