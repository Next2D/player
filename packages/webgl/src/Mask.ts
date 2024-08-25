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