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
 * @description WebGPUデバイス
 *              WebGPU device
 *
 * @type {GPUDevice}
 * @protected
 */
export let $device: GPUDevice;

/**
 * @description WebGPUデバイスを設定
 *              Set the WebGPU device
 *
 * @param  {GPUDevice} device
 * @return {void}
 * @method
 * @protected
 */
export const $setDevice = (device: GPUDevice): void =>
{
    $device = device;
};

/**
 * @description WebGPUキャンバスコンテキスト
 *              WebGPU canvas context
 *
 * @type {GPUCanvasContext}
 * @protected
 */
export let $canvasContext: GPUCanvasContext;

/**
 * @description WebGPUキャンバスコンテキストを設定
 *              Set the WebGPU canvas context
 *
 * @param  {GPUCanvasContext} context
 * @return {void}
 * @method
 * @protected
 */
export const $setCanvasContext = (context: GPUCanvasContext): void =>
{
    $canvasContext = context;
};

/**
 * @description 配列プール
 *              Array pool
 *
 * @type {array}
 * @protected
 */
const $arrayPool: unknown[][] = [];

/**
 * @description 配列を取得
 *              Get an array
 *
 * @return {array}
 * @method
 * @protected
 */
export const $getArray = (): unknown[] =>
{
    return $arrayPool.pop() || [];
};

/**
 * @description 配列をプールに戻す
 *              Return array to pool
 *
 * @param  {array} array
 * @return {void}
 * @method
 * @protected
 */
export const $poolArray = (array: unknown[]): void =>
{
    array.length = 0;
    $arrayPool.push(array);
};

/**
 * @description Float32Arrayプール (4要素)
 *              Float32Array pool (4 elements)
 *
 * @type {array}
 * @protected
 */
const $float32Array4: Float32Array[] = [];

/**
 * @description Float32Array (4要素) を取得
 *              Get Float32Array (4 elements)
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
 * @description 使用済みのFloat32Array (4要素) をプールに保管
 *              Store the used Float32Array (4 elements) in the pool
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
 * @description Float32Arrayプール (6要素)
 *              Float32Array pool (6 elements)
 *
 * @type {array}
 * @protected
 */
const $float32Array6: Float32Array[] = [];

/**
 * @description Float32Array (6要素) を取得
 *              Get Float32Array (6 elements)
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
 * @description 使用済みのFloat32Array (6要素) をプールに保管
 *              Store the used Float32Array (6 elements) in the pool
 *
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
 * @type {number}
 * @public
 */
let $devicePixelRatio: number = 1;

/**
 * @description デバイスのピクセル比率を設定
 *              Set the device's pixel ratio
 *
 * @param  {number} device_pixel_ratio
 * @return {void}
 * @method
 * @public
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
 * @description コンテキスト
 *              Context
 *
 * @type {Context}
 * @protected
 */
let $context: Context;

/**
 * @description コンテキストを設定
 *              Set the context
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
 * @description コンテキストを取得
 *              Get the context
 *
 * @return {Context}
 * @method
 * @protected
 */
export const $getContext = (): Context =>
{
    return $context;
};