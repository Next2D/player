/**
 * @description マスク描画中かどうかの状態フラグ
 *              Flag indicating whether mask drawing is in progress
 *
 * @type {boolean}
 */
let $maskDrawingState: boolean = false;

/**
 * @description マスク描画状態を設定する
 *              Set the mask drawing state
 *
 * @param {boolean} state - マスク描画中かどうか / whether mask drawing is active
 * @return {void}
 */
export const $setMaskDrawing = (state: boolean): void =>
{
    $maskDrawingState = state;
};

/**
 * @description マスク描画中かどうかを返す
 *              Returns whether mask drawing is currently active
 *
 * @return {boolean}
 */
export const $isMaskDrawing = (): boolean =>
{
    return $maskDrawingState;
};

/**
 * @description マスクテストが有効かどうかのフラグ
 *              Flag indicating whether mask (stencil) testing is enabled
 *
 * @type {boolean}
 */
let $maskTestEnabled: boolean = false;

/**
 * @description マスクステンシル参照値
 *              Mask stencil reference value used for stencil comparison
 *
 * @type {number}
 */
let $maskStencilReference: number = 0;

/**
 * @description マスクテストの有効/無効を設定する
 *              Enable or disable mask (stencil) testing
 *
 * @param {boolean} enabled - 有効にするかどうか / whether to enable
 * @return {void}
 */
export const $setMaskTestEnabled = (enabled: boolean): void =>
{
    $maskTestEnabled = enabled;
};

/**
 * @description マスクテストが有効かどうかを返す
 *              Returns whether mask (stencil) testing is enabled
 *
 * @return {boolean}
 */
export const $isMaskTestEnabled = (): boolean =>
{
    return $maskTestEnabled;
};

/**
 * @description マスクステンシル参照値を設定する
 *              Set the mask stencil reference value
 *
 * @param {number} value - ステンシル参照値 / stencil reference value
 * @return {void}
 */
export const $setMaskStencilReference = (value: number): void =>
{
    $maskStencilReference = value;
};

/**
 * @description マスクステンシル参照値を取得する
 *              Get the current mask stencil reference value
 *
 * @return {number}
 */
export const $getMaskStencilReference = (): number =>
{
    return $maskStencilReference;
};

/**
 * @description クリップ境界のマップ（キー: ID、値: バウンディングボックス）
 *              Map of clip bounds (key: ID, value: bounding box as Float32Array)
 *
 * @type {Map<number, Float32Array>}
 */
export const $clipBounds: Map<number, Float32Array> = new Map();

/**
 * @description クリップレベルのマップ（キー: ID、値: クリップ深度）
 *              Map of clip levels (key: ID, value: clip depth)
 *
 * @type {Map<number, number>}
 */
export const $clipLevels: Map<number, number> = new Map();

/**
 * @description マスク関連の全状態をリセットする
 *              Reset all mask-related state to initial values
 *
 * @return {void}
 */
export const $resetMaskState = (): void =>
{
    $maskDrawingState = false;
    $maskTestEnabled = false;
    $maskStencilReference = 0;
    $clipBounds.clear();
    $clipLevels.clear();
};
