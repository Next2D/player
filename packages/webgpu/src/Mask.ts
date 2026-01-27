/**
 * @description マスク描画中かどうか
 *              Whether the mask is being drawn
 *
 * @type {boolean}
 * @default false
 * @private
 */
let $maskDrawingState: boolean = false;

/**
 * @description マスク描画の状態をセット
 *              Set the state of mask drawing
 *
 * @param  {boolean} state
 * @return {void}
 * @method
 * @public
 */
export const $setMaskDrawing = (state: boolean): void =>
{
    $maskDrawingState = state;
};

/**
 * @description マスク描画中かどうかを返却
 *              Returns whether the mask is being drawn
 *
 * @return {boolean}
 * @method
 * @public
 */
export const $isMaskDrawing = (): boolean =>
{
    return $maskDrawingState;
};

/**
 * @description マスクテストが有効かどうか（endMask後、leaveMask前）
 *              Whether mask testing is enabled (after endMask, before leaveMask)
 *
 * @type {boolean}
 * @default false
 * @private
 */
let $maskTestEnabled: boolean = false;

/**
 * @description マスクテスト用の参照値
 *              Reference value for mask stencil test
 *
 * @type {number}
 * @default 0
 * @private
 */
let $maskStencilReference: number = 0;

/**
 * @description マスクテストの有効/無効をセット
 *              Set mask testing enabled/disabled
 *
 * @param  {boolean} enabled
 * @return {void}
 * @method
 * @public
 */
export const $setMaskTestEnabled = (enabled: boolean): void =>
{
    $maskTestEnabled = enabled;
};

/**
 * @description マスクテストが有効かどうかを返却
 *              Returns whether mask testing is enabled
 *
 * @return {boolean}
 * @method
 * @public
 */
export const $isMaskTestEnabled = (): boolean =>
{
    return $maskTestEnabled;
};

/**
 * @description マスクステンシル参照値をセット
 *              Set mask stencil reference value
 *
 * @param  {number} value
 * @return {void}
 * @method
 * @public
 */
export const $setMaskStencilReference = (value: number): void =>
{
    $maskStencilReference = value;
};

/**
 * @description マスクステンシル参照値を返却
 *              Returns mask stencil reference value
 *
 * @return {number}
 * @method
 * @public
 */
export const $getMaskStencilReference = (): number =>
{
    return $maskStencilReference;
};

/**
 * @description マスク用オフスクリーンアタッチメントのスタック
 *              Stack of offscreen attachments for mask rendering
 *
 * @type {any[]}
 * @private
 */
const $maskAttachmentStack: any[] = [];

/**
 * @description マスク用オフスクリーンアタッチメントをプッシュ
 *              Push offscreen attachment for mask rendering
 *
 * @param  {any} attachment
 * @return {void}
 * @method
 * @public
 */
export const $pushMaskAttachment = (attachment: any): void =>
{
    $maskAttachmentStack.push(attachment);
};

/**
 * @description マスク用オフスクリーンアタッチメントをポップ
 *              Pop offscreen attachment for mask rendering
 *
 * @return {any}
 * @method
 * @public
 */
export const $popMaskAttachment = (): any =>
{
    return $maskAttachmentStack.pop();
};

/**
 * @description マスク用オフスクリーンアタッチメントが使用中かどうか
 *              Whether mask offscreen attachment is in use
 *
 * @return {boolean}
 * @method
 * @public
 */
export const $hasMaskAttachment = (): boolean =>
{
    return $maskAttachmentStack.length > 0;
};

/**
 * @type {Map<number, Float32Array>}
 * @private
 */
export const $clipBounds: Map<number, Float32Array> = new Map();

/**
 * @type {Map<number, number>}
 * @private
 */
export const $clipLevels: Map<number, number> = new Map();
