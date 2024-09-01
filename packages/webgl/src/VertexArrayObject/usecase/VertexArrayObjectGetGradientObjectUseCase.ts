import type { IVertexArrayObject } from "../../interface/IVertexArrayObject";
import { $vertexBufferData } from "../../VertexArrayObject";
import { $gl } from "../../WebGLUtil";
import { execute as vertexArrayObjectCreateGradientVertexArrayObjectUseCase } from "./VertexArrayObjectCreateGradientVertexArrayObjectUseCase";

/**
 * @type {IVertexArrayObject}
 * @private
 */
let $gradientVertexArrayObject: IVertexArrayObject;

/**
 * @description グラデーション用の頂点配列オブジェクトを生成
 *              Generates a vertex array object for gradient
 * 
 * @param  {number} begin 
 * @param  {number} end 
 * @return {IVertexArrayObject}
 * @method
 * @protected
 */
export const execute = (begin: number, end: number): IVertexArrayObject =>
{
    if (!$gradientVertexArrayObject) {
        $gradientVertexArrayObject = vertexArrayObjectCreateGradientVertexArrayObjectUseCase(begin, end);
    } else {
        if ($vertexBufferData[0] !== begin 
            || $vertexBufferData[4] !== end
        ) {
            $vertexBufferData[0] = begin;
            $vertexBufferData[2] = begin;
            $vertexBufferData[4] = end;
            $vertexBufferData[6] = end;
            $gl.bufferSubData($gl.ARRAY_BUFFER, 0, $vertexBufferData);
        }
    }

    return $gradientVertexArrayObject;
};