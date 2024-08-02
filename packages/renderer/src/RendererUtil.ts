import type { CanvasToWebGLContext } from "@next2d/webgl";
import { RendererDisplayObjectContainer } from "./RendererDisplayObjectContainer";

/**
 * @type {RendererDisplayObjectContainer}
 * @public
 */
export const $rendererStage: RendererDisplayObjectContainer = new RendererDisplayObjectContainer();

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
 * @type {CanvasToWebGLContext}
 * @public
 */
export let $context: CanvasToWebGLContext;

/**
 * @description Next2DのWebGLの描画コンテキストを設定
 *              Set the drawing context of Next2D's WebGL
 *
 * @param  {number} context
 * @return {void}
 * @method
 * @public
 */
export const $setContext = (context: CanvasToWebGLContext): void =>
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
 * @description 描画エリアの幅を設定
 *              Set the width of the drawing area
 *
 * @param  {number} width
 * @return {void}
 * @method
 * @public
 */
export const $setRendererWidth = (width: number): void =>
{
    $rendererWidth = width;
};

/**
 * @type {number}
 * @public
 */
export let $rendererHeight: number = 0;

/**
 * @description 描画エリアの高さを設定
 *              Set the height of the drawing area
 *
 * @param  {number} height
 * @return {void}
 * @method
 * @public
 */
export const $setRendererHeight = (height: number): void =>
{
    $rendererHeight = height;
};

/**
 * @type {Float32Array}
 * @public
 */
export const $rendererMatrix: Float32Array = new Float32Array([1, 0, 0, 1, 0, 0]);