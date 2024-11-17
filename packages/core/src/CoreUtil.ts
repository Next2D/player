import type { IPlayerHitObject } from "./interface/IPlayerHitObject";
import type { IDisplayObject } from "./interface/IDisplayObject";

/**
 * @type {string}
 * @const
 */
export const $PREFIX: string = "__next2d__";

/**
 * @type {number}
 * @const
 */
export const $devicePixelRatio: number = Math.min(2, window.devicePixelRatio);

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

const canvas = document.createElement("canvas");
canvas.width = canvas.height = 1;

/**
 * @type {CanvasRenderingContext2D}
 * @const
 */
export const $hitContext: CanvasRenderingContext2D = canvas.getContext("2d") as NonNullable<CanvasRenderingContext2D>;

/**
 * @type {HTMLDivElement}
 * @private
 */
let $mainElement: HTMLDivElement | null = null;

/**
 * @description メインのコンテナになるDivElementを設定します。
 *              Set the DivElement to be the main container.
 *
 * @param  {HTMLDivElement} element
 * @method
 * @protected
 */
export const $setMainElement = (element: HTMLDivElement): void =>
{
    $mainElement = element;
};

/**
 * @description メインのコンテナになるDivElementを取得します。
 *             Get the DivElement to be the main container.
 *
 * @return {HTMLDivElement}
 * @method
 * @protected
 */
export const $getMainElement = (): HTMLDivElement =>
{
    return $mainElement as NonNullable<HTMLDivElement>;
};

/**
 * @description マウス、タップ時の画面のmatrix情報
 *              Screen matrix information when mouse or tap is pressed
 *
 * @type {Float32Array}
 * @protected
 */
export const $hitMatrix: Float32Array = new Float32Array([1, 0, 0, 1, 0, 0]);

/**
 * @description マウス、タップがヒットしたDisplayObjectを取得します。
 *              Get the DisplayObject that the mouse or tap hit.
 *
 * @type {IPlayerHitObject}
 * @protected
 */
export const $hitObject: IPlayerHitObject = {
    "x": 0,
    "y": 0,
    "pointer": "",
    "hit": null
};

/**
 * @description マウス、タップがヒットしたDisplayObjectを取得します。
 *             Get the DisplayObject that the mouse or tap hit.
 *
 * @type {IDisplayObject<any> | null}
 * @private
 */
let $rollOverDisplayObject: IDisplayObject<any> | null = null;

/**
 * @description マウス、タップがヒットしたDisplayObjectを取得します。
 *              Get the DisplayObject that the mouse or tap hit.
 *
 * @param  {IDisplayObject<any>} displayObject
 * @return {void}
 * @method
 * @protected
 */
export const $setRollOverDisplayObject = (displayObject: IDisplayObject<any> | null): void =>
{
    $rollOverDisplayObject = displayObject;
};

/**
 * @description マウス、タップがヒットしたDisplayObjectを取得します。
 *              Get the DisplayObject that the mouse or tap hit.
 *
 * @return {IDisplayObject<any>}
 * @method
 * @protected
 */
export const $getRollOverDisplayObject = (): IDisplayObject<any> | null =>
{
    return $rollOverDisplayObject;
};