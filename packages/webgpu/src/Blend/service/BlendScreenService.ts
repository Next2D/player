import {
    $setFuncCode,
    $getFuncCode
} from "../../Blend";

/**
 * @description ブレンドモードをScreenに設定
 *              Set blend mode to Screen
 *
 * @return {boolean} ブレンドモードが変更されたかどうか
 * @method
 * @protected
 */
export const execute = (): boolean =>
{
    // 301 = screen blend mode code
    if ($getFuncCode() !== 301) {
        $setFuncCode(301);
        return true;
    }
    return false;
};
