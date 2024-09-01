import type { Context } from "./Context";

/**
 * @description 描画の最大サイズ
 *              Maximum size of drawing
 *
 * @type {number}
 * @protected
 */
export let $RENDER_MAX_SIZE: number = 2048;

/**
 * @description 描画の最大サイズを変更
 *              Change the maximum size of drawing
 *
 * @param  {number} size
 * @return {void}
 * @method
 * @protected
 */
export const $setRenderMaxSize = (size: number): void =>
{
    $RENDER_MAX_SIZE = Math.min(4096, size / 2);
};

/**
 * @description 描画のサンプリング数
 *              Number of samples for drawing
 *
 * @type {number}
 * @default 4
 * @protected
 */
export let $samples: number = 4;

/**
 * @description 描画のサンプリング数を変更
 *              Change the number of samples for drawing
 *
 * @param  {number} samples
 * @return {void}
 * @method
 * @protected
 */
export const $setSamples = (samples: number): void =>
{
    $samples = samples;
};

/**
 * @type {WebGL2RenderingContext}
 * @protected
 */
export let $gl: WebGL2RenderingContext;

/**
 * @description WebGL2のコンテキストをセット
 *              Set WebGL2 context
 *
 * @param  {WebGL2RenderingContext} gl
 * @return {void}
 * @method
 * @protected
 */
export const $setWebGL2RenderingContext = (gl: WebGL2RenderingContext): void =>
{
    $gl = gl;
};

/**
 * @type {Context}
 * @public
 */
export let $context: Context;

/**
 * @description 起動したコンテキストをセット
 *              Set the context that started
 *
 * @param  {Context} context
 * @return {void}
 * @method
 * @protected
 */
export const $setContext = (context: Context): void =>
{
    $context = context;
};

/**
 * @type {number}
 */
let $programId: number = 0;

/**
 * @description 管理用のユニークなプログラムIDを発行
 *              Issue a unique program ID for management
 *
 * @return {number}
 * @method
 * @protected
 */
export const $getProgramId = (): number =>
{
    return $programId++;
};

/**
 * @description 指定された値を範囲内にクランプします。
 *              Clamps the specified value within the range.
 *
 * @param  {number} value
 * @param  {number} min
 * @param  {number} max
 * @param  {number} [default_value=null]
 * @return {number}
 * @method
 * @protected
 */
export const $clamp = (
    value: number,
    min: number, max: number,
    default_value: number | null = null
): number => {

    const number: number = +value;

    return isNaN(number) && default_value !== null
        ? default_value
        : Math.min(Math.max(min, isNaN(number) ? 0 : number), max);
};

/**
 * @type {array}
 * @private
 */
const $arrays: any[] = [];

/**
 * @description プールした配列があれば再利用、なければ新規作成
 *              Reuse the pooled array if available, otherwise create a new one.
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
 * @description 使用済みの配列をプールに保管
 *              Store the used array in the pool.
 *
 * @param  {array} array
 * @return {void}
 * @method
 * @protected
 */
export const $poolArray = (array: any[] | null = null): void =>
{
    if (!array) {
        return ;
    }

    if (array.length) {
        array.length = 0;
    }

    $arrays.push(array);
};

/**
 * @description 指定された値を2の累乗に切り上げます。
 *              Rounds the specified value up to a power of two.
 *
 * @param  {number} v
 * @return {number}
 * @method
 * @protected
 */
export const $upperPowerOfTwo = (v: number): number =>
{
    v--;
    v |= v >> 1;
    v |= v >> 2;
    v |= v >> 4;
    v |= v >> 8;
    v |= v >> 16;
    v++;
    return v;
};

/**
 * @type {Float32Array[]}
 * @private
 */
const $float32Array4: Float32Array[] = [];

/**
 * @description プールしたFloat32Arrayがあれば再利用、なければ新規作成
 *              Reuse the pooled Float32Array if available, otherwise create a new one.
 *
 * @param  {number} [f0=0]
 * @param  {number} [f1=0]
 * @param  {number} [f2=0]
 * @param  {number} [f3=0]
 * @return {Float32Array}
 * @method
 * @protected
 */
export const $getFloat32Array4 = (
    f0: number = 0, f1: number = 0,
    f2: number = 0, f3: number = 0
): Float32Array => {

    const array: Float32Array = $float32Array4.pop() || new Float32Array(4);

    array[0] = f0;
    array[1] = f1;
    array[2] = f2;
    array[3] = f3;

    return array;
};

/**
 * @description 使用済みのFloat32Arrayをプールに保管
 *              Store the used Float32Array in the pool.
 *
 * @param  {Float32Array} array
 * @return {void}
 * @method
 * @protected
 */
export const $poolFloat32Array4 = (array: Float32Array): void =>
{
    $float32Array4.push(array);
};

/**
 * @type {Float32Array[]}
 * @private
 */
const $float32Array9: Float32Array[] = [];

/**
 * @description プールしたFloat32Arrayがあれば再利用、なければ新規作成
 *              Reuse the pooled Float32Array if available, otherwise create a new one.
 *
 * @param  {number} [f0=0]
 * @param  {number} [f1=0]
 * @param  {number} [f2=0]
 * @param  {number} [f3=0]
 * @param  {number} [f4=0]
 * @param  {number} [f5=0]
 * @param  {number} [f6=0]
 * @param  {number} [f7=0]
 * @param  {number} [f8=0]
 * @return {Float32Array}
 * @method
 * @protected
 */
export const $getFloat32Array9 = (
    f0: number = 0, f1: number = 0, f2: number = 0,
    f3: number = 0, f4: number = 0, f5: number = 0,
    f6: number = 0, f7: number = 0, f8: number = 0
): Float32Array => {

    const array: Float32Array = $float32Array9.pop() || new Float32Array(9);

    array[0] = f0;
    array[1] = f1;
    array[2] = f2;
    array[3] = f3;
    array[4] = f4;
    array[5] = f5;
    array[6] = f6;
    array[7] = f7;
    array[8] = f8;

    return array;
};

/**
 * @description 使用済みのFloat32Arrayをプールに保管
 *              Store the used Float32Array in the pool.
 *
 * @param  {Float32Array} array
 * @return {void}
 * @method
 * @protected
 */
export const $poolFloat32Array9 = (array: Float32Array): void =>
{
    $float32Array9.push(array);
};

/**
 * @type {Float32Array[]}
 * @private
 */
const $float32Array6: Float32Array[] = [];

/**
 * @description プールしたFloat32Arrayがあれば再利用、なければ新規作成
 *              Reuse the pooled Float32Array if available, otherwise create a new one.
 *
 * @param  {number} [f0=0]
 * @param  {number} [f1=0]
 * @param  {number} [f2=0]
 * @param  {number} [f3=0]
 * @param  {number} [f4=0]
 * @param  {number} [f5=0]
 * @return {Float32Array}
 * @method
 * @protected
 */
export const $getFloat32Array6 = (
    f0: number = 0, f1: number = 0,
    f2: number = 0, f3: number = 0,
    f4: number = 0, f5: number = 0
): Float32Array => {

    const array: Float32Array = $float32Array6.pop() || new Float32Array(6);

    array[0] = f0;
    array[1] = f1;
    array[2] = f2;
    array[3] = f3;
    array[4] = f4;
    array[5] = f5;

    return array;
};

/**
 * @param  {Float32Array} array
 * @return {void}
 * @method
 * @protected
 */
export const $poolFloat32Array6 = (array: Float32Array): void =>
{
    $float32Array6.push(array);
};

/**
 * @type {Int32Array[]}
 * @private
 */
const $int32Array4: Int32Array[] = [];

/**
 * @description プールしたInt32Arrayがあれば再利用、なければ新規作成
 *              Reuse the pooled Int32Array if available, otherwise create a new one.
 *
 * @param  {number} [f0=0]
 * @param  {number} [f1=0]
 * @param  {number} [f2=0]
 * @param  {number} [f3=0]
 * @return {Float32Array}
 * @method
 * @protected
 */
export const $getInt32Array4 = (
    f0: number = 0, f1: number = 0,
    f2: number = 0, f3: number = 0
): Int32Array => {

    const array: Int32Array = $int32Array4.pop() || new Int32Array(4);

    array[0] = f0;
    array[1] = f1;
    array[2] = f2;
    array[3] = f3;

    return array;
};

/**
 * @description 使用済みのInt32Arrayをプールに保管
 *              Store the used Int32Array in the pool.
 *
 * @param  {Float32Array} array
 * @return {void}
 * @method
 * @protected
 */
export const $poolInt32Array4 = (array: Int32Array): void =>
{
    $int32Array4.push(array);
};

/**
 * @description 逆行列を取得
 *              Get the inverse matrix
 *
 * @param   {Float32Array} m
 * @returns {Float32Array}
 * @method
 * @protected
 */
export const $inverseMatrix = (m: Float32Array): Float32Array =>
{
    const rdet: number = 1 / (m[0] * m[4] - m[3] * m[1]);
    const tx: number  = m[3] * m[7] - m[4] * m[6];
    const ty: number  = m[1] * m[6] - m[0] * m[7];

    return $getFloat32Array9(
        m[4] * rdet,  0 - m[1] * rdet, 0,
        0 - m[3] * rdet,  m[0] * rdet, 0,
        tx * rdet, ty * rdet, 1
    );
};

/**
 * @type {number}
 * @default 0
 * @private
 */
let $viewportWidth: number = 0;

/**
 * @type {number}
 * @default 0
 * @private
 */
let $viewportHeight: number = 0;

/**
 * @description ビューポートの幅を取得
 *              Get the width of the viewport
 *
 * @returns {number}
 * @method
 * @protected
 */
export const $getViewportWidth = (): number =>
{
    return $viewportWidth;
};

/**
 * @description ビューポートの高さを取得
 *              Get the height of the viewport
 *
 * @returns {number}
 * @method
 * @protected
 */
export const $getViewportHeight = (): number =>
{
    return $viewportHeight;
};

/**
 * @description ビューポートのサイズをセット
 *              Set the size of the viewport
 *
 * @param  {number} viewport_width
 * @param  {number} viewport_height
 * @return {void}
 * @method
 * @protected
 */
export const $setViewportSize = (viewport_width: number, viewport_height: number): void =>
{
    $viewportWidth  = viewport_width;
    $viewportHeight = viewport_height;
};

/**
 * @description ビューポートのサイズを取得
 *              Get the size of the viewport
 *
 * @param {Float32Array} matrix
 * @return {Float32Array}
 * @method
 * @protected
 */
export const $linearGradientXY = (matrix: Float32Array): Float32Array =>
{
    const x0: number = -819.2 * matrix[0] - 819.2 * matrix[2] + matrix[4];
    const x1: number =  819.2 * matrix[0] - 819.2 * matrix[2] + matrix[4];
    const x2: number = -819.2 * matrix[0] + 819.2 * matrix[2] + matrix[4];
    const y0: number = -819.2 * matrix[1] - 819.2 * matrix[3] + matrix[5];
    const y1: number =  819.2 * matrix[1] - 819.2 * matrix[3] + matrix[5];
    const y2: number = -819.2 * matrix[1] + 819.2 * matrix[3] + matrix[5];

    let vx2: number = x2 - x0;
    let vy2: number = y2 - y0;

    const r1: number = Math.sqrt(vx2 * vx2 + vy2 * vy2);
    if (r1) {
        vx2 = vx2 / r1;
        vy2 = vy2 / r1;
    } else {
        vx2 = 0;
        vy2 = 0;
    }

    const r2: number = (x1 - x0) * vx2 + (y1 - y0) * vy2;

    return $getFloat32Array4(x0 + r2 * vx2, y0 + r2 * vy2, x1, y1);
};