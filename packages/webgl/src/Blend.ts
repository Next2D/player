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
 * @param {string} blend_mode
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

/**
 * @description 現在設定されているアトラスアタッチメントオブジェクトのインデックス値
 *              Index value of the currently set atlas attachment object
 * 
 * @type {number}
 * @default 0
 * @private
 */
let $currentAtlasIndex: number = 0;

/**
 * @description 現在設定されているアトラスアタッチメントオブジェクトのインデックス値をセット
 *              Set the index value of the currently set atlas attachment object
 *
 * @param {number} index
 * @return {void}
 * @method
 * @protected
 */
export const $setCurrentAtlasIndex = (index: number): void =>
{
    $currentAtlasIndex = index;
};

/**
 * @description 現在設定されているアトラスアタッチメントオブジェクトのインデックス値を返却
 *              Returns the index value of the currently set atlas attachment object
 * 
 * @return {number}
 * @method
 * @protected
 */
export const $getCurrentAtlasIndex = (): number =>
{
    return $currentAtlasIndex;
};