import type { IVertexArrayObject } from "./interface/IVertexArrayObject";
import type { IStrokeVertexArrayObject } from "./interface/IStrokeVertexArrayObject";
import { execute as vertexArrayObjectCreateRectVertexArrayObjectUseCase } from "./VertexArrayObject/usecase/VertexArrayObjectCreateRectVertexArrayObjectUseCase";

/**
 * @type {number}
 * @private
 */
let $id: number = 0;

/**
 * @description VertexArrayObject管理用のユニークIDを返却
 *              Returns a unique ID for managing VertexArrayObject
 *
 * @return {number}
 * @method
 * @protected
 */
export const $getId = (): number =>
{
    return $id++;
};

/**
 * @description VertexArrayObjectの再利用のための配列のオブジェクトプール
 *              Object pool of array for reusing VertexArrayObject
 *
 * @type {IVertexArrayObject[]}
 * @protected
 */
export const $objectPool: IVertexArrayObject[] = [];

/**
 * @description Stroke用のVertexArrayObjectの再利用のための配列のオブジェクトプール
 *             Object pool of array for reusing VertexArrayObject for Stroke
 *
 * @type {IStrokeVertexArrayObject[]}
 * @protected
 */
export const $strokeObjectPool: IStrokeVertexArrayObject[] = [];

/**
 * @description 頂点バッファのデータ、
 *             Vertex buffer data
 *
 * @type {Float32Array}
 * @protected
 */
export const $vertexBufferData: Float32Array = new Float32Array([0, 0, 0, 1, 1, 0, 1, 1]);

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

/**
 * @description 矩形描画用のVertexArrayObject
 *              VertexArrayObject for rectangle drawing
 *
 * @type {IVertexArrayObject}
 * @protected
 */
let $rectVertexArrayObject: IVertexArrayObject;

/**
 * @description 矩形描画用のVertexArrayObjectを返却
 *              Returns the VertexArrayObject for rectangle drawing
 *
 * @return {IVertexArrayObject}
 * @method
 * @protected
 */
export const $getRectVertexArrayObject = (): IVertexArrayObject =>
{
    if (!$rectVertexArrayObject) {
        $rectVertexArrayObject = vertexArrayObjectCreateRectVertexArrayObjectUseCase();
    }
    return $rectVertexArrayObject as NonNullable<IVertexArrayObject>;
};