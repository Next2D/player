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

            // 必ずグラデーション用のバッファをバインドしてから更新する。
            // バインドせずに bufferSubData を実行すると、直前まで
            // ARRAY_BUFFER にバインドされていた塗りメッシュのバッファを破壊する。
            $gl.bindBuffer($gl.ARRAY_BUFFER, $gradientVertexArrayObject.vertexBuffer);
            $gl.bufferSubData($gl.ARRAY_BUFFER, 0, $vertexBufferData);
        }
    }

    return $gradientVertexArrayObject;
};