import type { IBlendMode } from "./interface/IBlendMode";

/**
 * @description 現在設定されているブレンドモード
 *              The currently set blend mode
 *
 * @type {IBlendMode}
 * @default "normal"
 * @private
 */
let $currentBlendMode: IBlendMode = "normal";

/**
 * @description ブレンドモード情報を更新
 *              Update blend mode information
 *
 * @param  {string} blend_mode
 * @return {void}
 * @method
 * @protected
 */
export const $setCurrentBlendMode = (blend_mode: IBlendMode): void =>
{
    $currentBlendMode = blend_mode;
};

/**
 * @description 現在設定されているブレンドモードを返却
 *              Returns the currently set blend mode
 *
 * @return {IBlendMode}
 * @method
 * @protected
 */
export const $getCurrentBlendMode = (): IBlendMode =>
{
    return $currentBlendMode;
};
