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