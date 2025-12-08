import {
    $setFuncCode,
    $getFuncCode
} from "../../Blend";

/**
 * @description ブレンドモードをAddに設定
 *              Set blend mode to Add
 *
 * @return {boolean} ブレンドモードが変更されたかどうか
 * @method
 * @protected
 */
export const execute = (): boolean =>
{
    // 101 = add blend mode code
    if ($getFuncCode() !== 101) {
        $setFuncCode(101);
        return true;
    }
    return false;
};
