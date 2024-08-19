import type { IVertexArrayObject } from "./interface/IVertexArrayObject";

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

/**
 * @description インスタンス用のWebGLBuffer
 *              WebGLBuffer for instance
 * 
 * @type {WebGLBuffer}
 * @protected
 */
export let $attributeWebGLBuffer: WebGLBuffer;

/**
 * @description インスタンス用のWebGLBufferをセット
 *              Set the WebGLBuffer for the instance
 * 
 * @param  {WebGL2RenderingContext} gl
 * @return {void}
 * @method
 * @protected
 */
export const $setAttributeWebGLBuffer = (gl: WebGL2RenderingContext): void => 
{
    $attributeWebGLBuffer = gl.createBuffer() as NonNullable<WebGLBuffer>;
};

/**
 * @description インスタンス用のVertexArrayObject
 *              VertexArrayObject for instance
 * 
 * @type {IVertexArrayObject}
 * @protected
 */
export let $instancedVertexArrayObject: IVertexArrayObject;

/**
 * @description インスタンス用のVertexArrayObjectをセット
 *              Set the VertexArrayObject for the instance
 * 
 * @param  {IVertexArrayObject} vertex_array_object
 * @return {void}
 * @method
 * @protected
 */
export const $setInstancedVertexArrayObject = (vertex_array_object: IVertexArrayObject): void =>
{
    $instancedVertexArrayObject = vertex_array_object;
};