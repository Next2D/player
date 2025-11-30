import type { Context as WebGLContext } from "@next2d/webgl";
import type { Context as WebGPUContext } from "@next2d/webgpu";
import type { IRGBA } from "./interface/IRGBA";

/**
 * @type {number}
 * @public
 */
export const $samples: number = 4;

/**
 * @type {WebGLContext | WebGPUContext}
 * @public
 */
export let $context: WebGLContext | WebGPUContext;

/**
 * @description Next2Dの描画コンテキストを設定（WebGLまたはWebGPU）
 *              Set the drawing context of Next2D (WebGL or WebGPU)
 *
 * @param  {WebGLContext | WebGPUContext} context
 * @return {void}
 * @method
 * @public
 */
export const $setContext = (context: WebGLContext | WebGPUContext): void =>
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
 * @type {number}
 * @public
 */
let $rendererWidth: number = 0;

/**
 * @description 描画エリアの幅を返却
 *              Returns the width of the drawing area
 *
 * @return {number}
 * @method
 * @protected
 */
export const $getRendererWidth = (): number =>
{
    return $rendererWidth;
};

/**
 * @type {number}
 * @public
 */
let $rendererHeight: number = 0;

/**
 * @description 描画エリアの高さを返却
 *              Returns the height of the drawing area
 *
 * @return {number}
 * @method
 * @protected
 */
export const $getRendererHeight = (): number =>
{
    return $rendererHeight;
};

/**
 * @type {boolean}
 * @private
 */
let $resizeState: boolean = false;

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
    $resizeState    = true;
    $rendererWidth  = width;
    $rendererHeight = height;
};

/**
 * @description リサイズ中かどうかを取得
 *              Get whether it is being resized
 *
 * @return {boolean}
 * @method
 * @public
 */
export const $isResize = (): boolean =>
{
    return $resizeState;
};

/**
 * @description リサイズ処理完了
 *              Resize processing complete
 *
 * @return {void}
 * @method
 * @public
 */
export const $resizeComplete = (): void =>
{
    $canvas.width  = $rendererWidth;
    $canvas.height = $rendererHeight;
    $resizeState = false;
};

/**
 * @description 使用済みになったBoundsのArrayのプール配列
 *              Pool array of used Bounds Array.
 *
 * @type {Float32Array[]}
 * @const
 * @private
 */
const $boundsArrays: Float32Array[] = [];

/**
 * @description プールされたArrayがあればプールから、なければ新規作成して返却
 *              If there is a pooled Array, return it from the pool,
 *              otherwise create a new one and return it.
 *
 * @param  {number} x_min
 * @param  {number} y_min
 * @param  {number} x_max
 * @param  {number} y_max
 * @return {number[]}
 * @method
 * @protected
 */
export const $getBoundsArray = (
    x_min: number, y_min: number,
    x_max: number, y_max: number
): Float32Array => {

    const array = $boundsArrays.length
        ? $boundsArrays.pop() as unknown as Float32Array
        : new Float32Array(4);

    array[0] = x_min;
    array[1] = y_min;
    array[2] = x_max;
    array[3] = y_max;

    return array;
};

/**
 * @description 使用済みになったBoundsのArrayをプール
 *              Pool used Bounds Array.
 *
 * @param {Float32Array} array
 * @method
 * @protected
 */
export const $poolBoundsArray = (array: Float32Array): void =>
{
    $boundsArrays.push(array);
};

/**
 * @description 使用済みになったArrayのプール配列
 *              Pool array of used Array.
 *
 * @type {array[]}
 * @const
 * @private
 */
const $arrays: Array<any[]> = [];

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

/**
 * @param   {number} color
 * @param   {number} [alpha=1]
 * @returns {IRGBA}
 * @method
 * @static
 */
export const $intToRGBA = (color: number, alpha: number = 1): IRGBA =>
{
    return {
        "R": (color & 0xff0000) >> 16,
        "G": (color & 0x00ff00) >> 8,
        "B": color & 0x0000ff,
        "A": alpha * 255
    };
};