// @ts-ignore
import RendererWorker from "@next2d/renderer?worker&inline";

/**
 * @type {Worker}
 * @public
 */
export const $rendererWorker: Worker = new RendererWorker();

/**
 * @type {number}
 * @const
 */
export const $LOAD_START: number = 1;

/**
 * @type {number}
 * @const
 */
export const $LOAD_END: number = 2;

/**
 * @type {string}
 * @const
 */
export const $PREFIX: string = "__next2d__";

/**
 * @type {number}
 * @const
 */
export const $devicePixelRatio: number = window.devicePixelRatio;

/**
 * @param  {number} value
 * @param  {number} min
 * @param  {number} max
 * @param  {number} [default_value=null]
 * @return {number}
 * @method
 * @static
 */
export const $clamp = (
    value: number,
    min: number,
    max: number,
    default_value: number | null = null
): number => {

    const number: number = +value;

    return isNaN(number) && default_value !== null
        ? default_value
        : Math.min(Math.max(min, isNaN(number) ? 0 : number), max);
};

/**
 * @type {number}
 * @public
 */
export let $stageWidth: number = 0;

/**
 * @type {number}
 * @public
 */
export let $stageHeight: number = 0;

/**
 * @description ステージサイズを設定
 *              Set stage size
 *
 * @param  {number} width
 * @return {void}
 * @method
 * @public
 */
export const $setStageSize = (width: number, height: number): void =>
{
    $stageWidth  = width;
    $stageHeight = height;
};