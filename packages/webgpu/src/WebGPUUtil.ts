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
 * @type {GPUDevice}
 * @protected
 */
export let $device: GPUDevice;

/**
 * @description WebGPUデバイスをセット
 *              Set WebGPU device
 *
 * @param  {GPUDevice} device
 * @return {void}
 * @method
 * @protected
 */
export const $setWebGPUDevice = (device: GPUDevice): void =>
{
    $device = device;
};

/**
 * @type {GPUCanvasContext}
 * @protected
 */
export let $canvasContext: GPUCanvasContext;

/**
 * @description WebGPUキャンバスコンテキストをセット
 *              Set WebGPU canvas context
 *
 * @param  {GPUCanvasContext} context
 * @return {void}
 * @method
 * @protected
 */
export const $setWebGPUCanvasContext = (context: GPUCanvasContext): void =>
{
    $canvasContext = context;
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
 * @description デバイスのピクセル比率
 *              Device pixel ratio
 *
 * @type {number}
 * @default 1
 * @protected
 */
export let $devicePixelRatio: number = 1;

/**
 * @description デバイスのピクセル比率をセット
 *              Set device pixel ratio
 *
 * @param  {number} device_pixel_ratio
 * @return {void}
 * @method
 * @protected
 */
export const $setDevicePixelRatio = (device_pixel_ratio: number): void =>
{
    $devicePixelRatio = device_pixel_ratio;
};

/**
 * @description デバイスのピクセル比率を取得
 *              Get the device's pixel ratio
 *
 * @return {number}
 * @method
 * @public
 */
export const $getDevicePixelRatio = (): number =>
{
    return $devicePixelRatio;
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
    min: number,
    max: number,
    default_value: number | null = null
): number => {

    if (isNaN(value)) {
        if (default_value !== null) {
            return default_value;
        }
        return min;
    }

    return Math.max(min, Math.min(max, value));
};

/**
 * @description 2つの行列を乗算
 *              Multiply two matrices
 *
 * @param  {Float32Array} a
 * @param  {Float32Array} b
 * @return {Float32Array}
 * @method
 * @protected
 */
export const $multiplyMatrices = (a: Float32Array, b: Float32Array): Float32Array =>
{
    const a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5];
    const b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3], b4 = b[4], b5 = b[5];

    return new Float32Array([
        a0 * b0 + a2 * b1,
        a1 * b0 + a3 * b1,
        a0 * b2 + a2 * b3,
        a1 * b2 + a3 * b3,
        a0 * b4 + a2 * b5 + a4,
        a1 * b4 + a3 * b5 + a5
    ]);
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
    f0: number = 0,
    f1: number = 0,
    f2: number = 0,
    f3: number = 0
): Float32Array => {

    const array = $float32Array4.pop() || new Float32Array(4);
    array[0] = f0;
    array[1] = f1;
    array[2] = f2;
    array[3] = f3;
    return array;
};

/**
 * @description Float32Array(4)をプールに戻す
 *              Return Float32Array(4) to pool
 *
 * @param  {Float32Array} array
 * @return {void}
 * @method
 * @protected
 */
export const $poolFloat32Array4 = (array: Float32Array): void =>
{
    if ($float32Array4.length < 100) {
        $float32Array4.push(array);
    }
};

/**
 * @type {Float32Array[]}
 * @private
 */
const $float32Array9: Float32Array[] = [];

/**
 * @description プールしたFloat32Array(9)があれば再利用、なければ新規作成
 *              Reuse the pooled Float32Array(9) if available, otherwise create a new one.
 *
 * @return {Float32Array}
 * @method
 * @protected
 */
export const $getFloat32Array9 = (): Float32Array =>
{
    const array = $float32Array9.pop() || new Float32Array(9);
    array.fill(0);
    return array;
};

/**
 * @description Float32Array(9)をプールに戻す
 *              Return Float32Array(9) to pool
 *
 * @param  {Float32Array} array
 * @return {void}
 * @method
 * @protected
 */
export const $poolFloat32Array9 = (array: Float32Array): void =>
{
    if ($float32Array9.length < 100) {
        $float32Array9.push(array);
    }
};

/**
 * @type {number[][]}
 * @private
 */
const $arrays: number[][] = [];

/**
 * @description プールした配列があれば再利用、なければ新規作成
 *              Reuse the pooled array if available, otherwise create a new one.
 *
 * @return {number[]}
 * @method
 * @protected
 */
export const $getArray = (): number[] =>
{
    return $arrays.pop() || [];
};

/**
 * @description 配列をプールに戻す
 *              Return array to pool
 *
 * @param  {number[]} array
 * @return {void}
 * @method
 * @protected
 */
export const $poolArray = (array: number[]): void =>
{
    array.length = 0;
    if ($arrays.length < 100) {
        $arrays.push(array);
    }
};