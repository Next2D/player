import type { IVertexArrayObject } from "../../interface/IVertexArrayObject";
import { execute as vertexArrayObjectCreateFillObjectService } from "../service/VertexArrayObjectCreateFillObjectService";
import { execute as vertexArrayObjectBindService } from "../service/VertexArrayObjectBindService";
import { $gl } from "../../WebGLUtil";
import {
    $getAttributeBuffer,
    $attributeWebGLBuffer
} from "../../VertexArrayObject";

/**
 * @description インスタンス用の頂点配列オブジェクトを生成します。
 *              Generates a vertex array object for instances.
 *
 * @return {IVertexArrayObject}
 * @method
 * @protected
 */
export const execute = (): IVertexArrayObject =>
{
    const vertexArrayObject = vertexArrayObjectCreateFillObjectService();
    vertexArrayObjectBindService(vertexArrayObject);

    $gl.bindBuffer($gl.ARRAY_BUFFER, vertexArrayObject.vertexBuffer);
    $gl.bufferData($gl.ARRAY_BUFFER, new Float32Array([0, 0, 0, 1, 1, 0, 1, 1]), $gl.STATIC_DRAW);
    $gl.enableVertexAttribArray(0);
    $gl.vertexAttribPointer(0, 2, $gl.FLOAT, false, 0, 0);

    $gl.bindBuffer($gl.ARRAY_BUFFER, $attributeWebGLBuffer);

    const attributeBuffer = $getAttributeBuffer();
    $gl.bufferData($gl.ARRAY_BUFFER, attributeBuffer.byteLength, $gl.DYNAMIC_DRAW);

    // texture rectangle
    $gl.enableVertexAttribArray(1);
    $gl.vertexAttribPointer(1, 4, $gl.FLOAT, false, 88, 0);
    $gl.vertexAttribDivisor(1, 1);

    // texture width, height and viewport width, height
    $gl.enableVertexAttribArray(2);
    $gl.vertexAttribPointer(2, 4, $gl.FLOAT, false, 88, 16);
    $gl.vertexAttribDivisor(2, 1);

    // matrix tx, ty
    $gl.enableVertexAttribArray(3);
    $gl.vertexAttribPointer(3, 2, $gl.FLOAT, false, 88, 32);
    $gl.vertexAttribDivisor(3, 1);

    // matrix scale0, rotate0, scale1, rotate1
    $gl.enableVertexAttribArray(4);
    $gl.vertexAttribPointer(4, 4, $gl.FLOAT, false, 88, 40);
    $gl.vertexAttribDivisor(4, 1);

    // mulColor
    $gl.enableVertexAttribArray(5);
    $gl.vertexAttribPointer(5, 4, $gl.FLOAT, false, 88, 56);
    $gl.vertexAttribDivisor(5, 1);

    // addColor
    $gl.enableVertexAttribArray(6);
    $gl.vertexAttribPointer(6, 4, $gl.FLOAT, false, 88, 72);
    $gl.vertexAttribDivisor(6, 1);

    return vertexArrayObject;
};