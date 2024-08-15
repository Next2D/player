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