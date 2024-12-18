import type { IFillType } from "./interface/IFillType";
import type { IIndexRange } from "./interface/IIndexRange";

/**
 * @description IIndexRangeの再利用のための配列のオブジェクトプール、
 *              Object pool of array for reusing IIndexRange
 *
 * @type {IIndexRange[]}
 * @private
 */
export const $objectPool: IIndexRange[] = [];

/**
 * @type {Float32Array}
 * @private
 */
let $vertexBufferData: Float32Array = new Float32Array(1024);

/**
 * @description 頂点バッファのデータを返却
 *              Returns the data of the vertex buffer
 *
 * @return {Float32Array}
 * @method
 * @public
 */
export const $getVertexBufferData = (): Float32Array =>
{
    return $vertexBufferData;
};

/**
 * @description 頂点バッファのデータを設定
 *              Set the data of the vertex buffer
 *
 * @param {Float32Array} buffer
 * @method
 * @public
 */
export const $setVertexBufferData = (buffer: Float32Array): void =>
{
    $vertexBufferData = buffer;
};

/**
 * @type {Int16Array}
 * @private
 */
let $indexBufferData: Int16Array = new Int16Array(256);

/**
 * @description インデックスバッファのデータを返却
 *              Returns the data of the index buffer
 *
 * @return {Int16Array}
 * @method
 * @public
 */
export const $getIndexBufferData = (): Int16Array =>
{
    return $indexBufferData;
};

/**
 * @description インデックスバッファのデータを設定
 *              Set the data of the index buffer
 *
 * @param {Int16Array} buffer
 * @method
 * @public
 */
export const $setIndexBufferData = (buffer: Int16Array): void =>
{
    $indexBufferData = buffer;
};

/**
 * @type {number}
 * @private
 */
let $vertexBufferPosition: number = 0;

/**
 * @description 頂点バッファの位置を返却
 *              Returns the position of the vertex buffer
 *
 * @return {number}
 * @method
 * @protected
 */
export const $getVertexBufferPosition = (): number =>
{
    return $vertexBufferPosition;
};

/**
 * @description 頂点バッファの位置を設定
 *              Set the position of the vertex buffer
 *
 * @param {number} position
 * @method
 * @protected
 */
export const $setVertexBufferPosition = (position: number): void =>
{
    $vertexBufferPosition = position;
};

/**
 * @type {number}
 * @private
 */
let $indexBufferPosition: number = 0;

/**
 * @description インデックスバッファの位置を返却
 *              Returns the position of the index buffer
 *
 * @return {number}
 * @method
 * @protected
 */
export const $getIndexBufferPosition = (): number =>
{
    return $indexBufferPosition;
};

/**
 * @description インデックスバッファの位置を設定
 *              Set the position of the index buffer
 *
 * @param {number} position
 * @method
 * @protected
 */
export const $setIndexBufferPosition = (position: number): void =>
{
    $indexBufferPosition = position;
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
 * @type {Float32Array}
 * @private
 */
let $fillBuffer: Float32Array = new Float32Array(128);

/**
 * @type {number}
 * @private
 */
let $fillBufferOffset: number = 0;

/**
 * @description バッファを埋めるデータを返却
 *              Returns the data to fill the buffer
 *
 * @return {Float32Array}
 * @method
 * @protected
 */
export const $getFillBuffer = (): Float32Array =>
{
    return $fillBuffer;
};

/**
 * @description バッファを埋めるデータのオフセットを返却
 *              Returns the offset of the data to fill the buffer
 *
 * @return {number}
 * @method
 * @protected
 */
export const $getFillBufferOffset = (): number =>
{
    return $fillBufferOffset;
};

/**
 * @description バッファを埋めるデータを設定
 *              Set the data to fill the buffer
 *
 * @param  {Float32Array} buffer
 * @return {void}
 * @method
 * @protected
 */
export const $addFillBuffer = (buffer: Float32Array): void =>
{
    const length = buffer.length + $fillBufferOffset;
    if (length > $fillBuffer.length) {
        const newBuffer = new Float32Array($upperPowerOfTwo(length));
        newBuffer.set($fillBuffer);
        newBuffer.set(buffer, $fillBufferOffset);

        $fillBuffer = newBuffer;
    } else {
        $fillBuffer.set(buffer, $fillBufferOffset);
    }

    $fillBufferOffset += buffer.length;
};

/**
 * @description バッファを頂点数の配列
 *              Array of the number of vertices in the buffer
 *
 * @type {number[]}
 * @protected
 */
export const $fillBufferIndexes: number[] = [];

/**
 * @description 塗りの種類の配列
 *              Array of fill types
 *
 * @type {IFillType[]}
 * @protected
 */
export const $fillTypes: IFillType[] = [];

/**
 * @description 頂点情報の設定値を初期化
 *              Initializes the setting value of the vertex information
 *
 * @return {void}
 * @method
 * @protected
 */
export const $clearFillBufferSetting = (): void =>
{
    $fillTypes.length = 0;
    $fillBufferOffset = 0;
    $fillBufferIndexes.length = 0;
};