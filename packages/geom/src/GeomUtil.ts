/**
 * @type {Float32Array[]}
 * @private
 */
const $objectPool6: Float32Array[] = [];

/**
 * @description オブジェクトプールから Float32Array オブジェクトを取得します。
 *              Get a Float32Array object from the object pool.
 *
 * @param  {number} [f0=0]
 * @param  {number} [f1=0]
 * @param  {number} [f2=0]
 * @param  {number} [f3=0]
 * @param  {number} [f4=0]
 * @param  {number} [f5=0]
 * @return {Float32Array}
 * @method
 * @private
 */
export const $getFloat32Array6 = (
    f0: number = 1, f1: number = 0,
    f2: number = 0, f3: number = 1,
    f4: number = 0, f5: number = 0
): Float32Array => {

    const array: Float32Array = $objectPool6.pop() || new Float32Array(6);

    array[0] = f0;
    array[1] = f1;
    array[2] = f2;
    array[3] = f3;
    array[4] = f4;
    array[5] = f5;

    return array;
};

/**
 * @description 再利用する為に、オブジェクトプールに Float32Array オブジェクトを追加します。
 *              Add a Float32Array object to the object pool for reuse.
 *
 * @param {Float32Array} array
 * @method
 * @private
 */
export const $poolFloat32Array6 = (array: Float32Array): void =>
{
    $objectPool6.push(array);
};

/**
 * @type {Float32Array[]}
 * @private
 */
const $objectPool8: Float32Array[] = [];

/**
 * @description オブジェクトプールから Float32Array オブジェクトを取得します。
 *              Get a Float32Array object from the object pool.
 *
 * @param  {number} [f0=0]
 * @param  {number} [f1=0]
 * @param  {number} [f2=0]
 * @param  {number} [f3=0]
 * @param  {number} [f4=0]
 * @param  {number} [f5=0]
 * @param  {number} [f6=0]
 * @param  {number} [f7=0]
 * @return {Float32Array}
 * @method
 * @private
 */
export const $getFloat32Array8 = (
    f0: number = 1, f1: number = 1,
    f2: number = 1, f3: number = 1,
    f4: number = 0, f5: number = 0,
    f6: number = 0, f7: number = 0
): Float32Array => {

    const array: Float32Array = $objectPool8.pop() || new Float32Array(8);

    array[0] = f0;
    array[1] = f1;
    array[2] = f2;
    array[3] = f3;
    array[4] = f4;
    array[5] = f5;
    array[6] = f6;
    array[7] = f7;

    return array;
};

/**
 * @description 再利用する為に、オブジェクトプールに Float32Array オブジェクトを追加します。
 *              Add a Float32Array object to the object pool for reuse.
 *
 * @param {Float32Array} array
 * @method
 * @private
 */
export const $poolFloat32Array8 = (array: Float32Array): void =>
{
    $objectPool8.push(array);
};