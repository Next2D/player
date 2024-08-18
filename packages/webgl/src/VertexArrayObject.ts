import { IVertexArrayObject } from "./interface/IVertexArrayObject";

/**
 * @description VertexArrayObjectの再利用のための配列のオブジェクトプール、
 *              Object pool of array for reusing VertexArrayObject
 * 
 * @type {IVertexArrayObject[]}
 * @protected
 */
export const $objectPool: IVertexArrayObject[] = [];

/**
 * @description 頂点バッファのデータ、
 *             Vertex buffer data
 * 
 * @type {Float32Array}
 * @protected
 */
export const $vertexBufferData: Float32Array = new Float32Array([0, 0, 0, 1, 1, 0, 1, 1]);

/**
 * @description インデックスバッファのデータ、
 *              Index buffer data
 * 
 * @type {Uint16Array}
 * @protected
 */
let $attributeBuffer: Float32Array = new Float32Array(22);

/**
 * @description InstancedArrayで利用する変数情報を更新
 *              Update variable information used in InstancedArray
 *
 * @param  {Float32Array} buffer
 * @return {void}
 * @method
 * @protected
 */
export const $setAttributeBuffer = (buffer: Float32Array): void => 
{
    $attributeBuffer = buffer;
};

/**
 * @description InstancedArrayで利用する変数情報を返却
 *              Returns variable information used in InstancedArray
 * 
 * @return {Float32Array}
 * @method
 * @protected
 */
export const $getAttributeBuffer = (): Float32Array => 
{
    return $attributeBuffer;
};