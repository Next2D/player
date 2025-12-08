import {
    $resetStencilMode,
    $setColorMaskEnabled,
    $setSampleAlphaToCoverageEnabled
} from "../../Stencil";

/**
 * @description ステンシル状態キャッシュをリセット
 *              Reset stencil state cache
 *
 * @return {void}
 * @method
 * @protected
 */
export const execute = (): void =>
{
    $resetStencilMode();
    $setColorMaskEnabled(true);
    $setSampleAlphaToCoverageEnabled(false);
};
