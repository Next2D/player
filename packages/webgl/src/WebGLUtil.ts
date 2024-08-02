/**
 * @type {number}
 * @public
 */
export let $RENDER_SIZE: number = 2048;

/**
 * @param  {number} size
 * @return {void}
 * @method
 * @public
 */
export const $setRenderSize = (size: number): void =>
{
    $RENDER_SIZE = Math.min(4096, size / 2);
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
 */
let programId: number = 0;

/**
 * @return {number}
 * @method
 * @public
 */
export const $getProgramId = (): number =>
{
    return programId++;
};

/**
 * @param  {number} value
 * @param  {number} min
 * @param  {number} max
 * @param  {number} [default_value=null]
 * @return {number}
 * @method
 * @public
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
 * @param  {array} args
 * @return {array}
 * @method
 * @public
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
 * @param  {array} array
 * @return {void}
 * @method
 * @public
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
 * @param  {number} v
 * @return {number}
 * @method
 * @public
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
 * @param  {number} [f0=0]
 * @param  {number} [f1=0]
 * @param  {number} [f2=0]
 * @param  {number} [f3=0]
 * @return {Float32Array}
 * @method
 * @public
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
 * @param  {Float32Array} array
 * @return {void}
 * @method
 * @public
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
 * @static
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
 * @param  {Float32Array} array
 * @return {void}
 * @method
 * @static
 */
export const $poolFloat32Array9 = (array: Float32Array): void =>
{
    $float32Array9.push(array);
};

/**
 * @param   {Float32Array} m
 * @returns {Float32Array}
 * @method
 * @static
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
 * @type {Float32Array[]}
 * @private
 */
const $float32Array6: Float32Array[] = [];

/**
 * @param  {number} [f0=0]
 * @param  {number} [f1=0]
 * @param  {number} [f2=0]
 * @param  {number} [f3=0]
 * @param  {number} [f4=0]
 * @param  {number} [f5=0]
 * @return {Float32Array}
 * @method
 * @static
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
 * @static
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
 * @param  {number} [f0=0]
 * @param  {number} [f1=0]
 * @param  {number} [f2=0]
 * @param  {number} [f3=0]
 * @return {Float32Array}
 * @method
 * @static
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
 * @param  {Float32Array} array
 * @return {void}
 * @method
 * @static
 */
export const $poolInt32Array4 = (array: Int32Array): void =>
{
    $int32Array4.push(array);
};