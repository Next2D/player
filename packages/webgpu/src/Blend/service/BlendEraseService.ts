import {
    $setFuncCode,
    $getFuncCode
} from "../../Blend";

/**
 * @description ブレンドモードをEraseに設定
 *              Set blend mode to Erase
 *
 * @return {boolean} ブレンドモードが変更されたかどうか
 * @method
 * @protected
 */
export const execute = (): boolean =>
{
    // 501 = erase blend mode code
    if ($getFuncCode() !== 501) {
        $setFuncCode(501);
        return true;
    }
    return false;
};
