import {
    $setFuncCode,
    $getFuncCode
} from "../../Blend";

/**
 * @description ブレンドモードをAlphaに設定
 *              Set blend mode to Alpha
 *
 * @return {boolean} ブレンドモードが変更されたかどうか
 * @method
 * @protected
 */
export const execute = (): boolean =>
{
    // 401 = alpha blend mode code
    if ($getFuncCode() !== 401) {
        $setFuncCode(401);
        return true;
    }
    return false;
};
