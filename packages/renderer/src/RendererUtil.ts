import type { Context } from "@next2d/webgl";

/**
 * @type {number}
 * @public
 */
export const $samples: number = 4;

/**
 * @type {number}
 * @public
 */
export let $devicePixelRatio: number = 1;

/**
 * @description 画面の解像度を設定
 *              Set screen resolution
 *
 * @param  {number} ratio
 * @return {void}
 * @method
 * @public
 */
export const $setDevicePixelRatio = (ratio: number): void =>
{
    $devicePixelRatio = ratio;
};

/**
 * @type {Context}
 * @public
 */
export let $context: Context;

/**
 * @description Next2DのWebGLの描画コンテキストを設定
 *              Set the drawing context of Next2D's WebGL
 *
 * @param  {number} context
 * @return {void}
 * @method
 * @public
 */
export const $setContext = (context: Context): void =>
{
    $context = context;
};

/**
 * @type {CanvasToWebGLContext}
 * @public
 */
export let $canvas: OffscreenCanvas;

/**
 * @description OffscreenCanvasをutilの変数のセット
 *              Set OffscreenCanvas to util variable
 *
 * @param  {OffscreenCanvas} canvas
 * @return {void}
 * @method
 * @public
 */
export const $setCanvas = (canvas: OffscreenCanvas): void =>
{
    $canvas = canvas;
};

/**
 * @type {WebGL2RenderingContext}
 * @public
 */
export let $gl: WebGL2RenderingContext;

/**
 * @description WebGL2のコンテキストをセット
 *              Set WebGL2 context
 *
 * @param  {WebGL2RenderingContext} gl
 * @return {void}
 * @method
 * @public
 */
export const $setWebGL2RenderingContext = (gl: WebGL2RenderingContext): void =>
{
    $gl = gl;
};

/**
 * @type {number}
 * @public
 */
export let $rendererWidth: number = 0;

/**
 * @type {number}
 * @public
 */
export let $rendererHeight: number = 0;

/**
 * @description 描画エリアの幅を設定
 *              Set the width of the drawing area
 *
 * @param  {number} width
 * @param  {number} height
 * @return {void}
 * @method
 * @public
 */
export const $setRendererSize = (width: number, height: number): void =>
{
    $rendererWidth  = width;
    $rendererHeight = height;
};

/**
 * @description 使用済みになったArrayのプール配列
 *              Pool array of used Array.
 *
 * @type {array[]}
 * @const
 * @protected
 */
export const $arrays: any[] = [];

/**
 * @description プールされたArrayがあればプールから、なければ新規作成して返却
 *              If there is a pooled Array, return it from the pool,
 *              otherwise create a new one and return it.
 *
 * @param  {array} args
 * @return {array}
 * @method
 * @protected
 */
export const $getArray = (...args: any[]): any[] =>
{
    const array: any[] = $arrays.pop() || [];
    if (args.length) {
        array.push(...args);
    }
    return array;
};

/**
 * @description 使用済みになったArrayをプール
 *              Pool used Array.
 *
 * @param  {array} array
 * @return {void}
 * @method
 * @protected
 */
export const $poolArray = (array: any[]): void =>
{
    if (array.length) {
        array.length = 0;
    }

    $arrays.push(array);
};