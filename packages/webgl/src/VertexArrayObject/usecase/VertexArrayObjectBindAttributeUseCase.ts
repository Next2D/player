import { execute as vertexArrayObjectBindService } from "../service/VertexArrayObjectBindService";
import { $gl } from "../../WebGLUtil";
import {
    $instancedVertexArrayObject,
    $attributeWebGLBuffer
} from "../../VertexArrayObject";
import { renderQueue } from "@next2d/render-queue";

/**
 * @type {number}
 * @private
 */
let $attributeBufferLength: number = 0;

/**
 * @description インスタンス用のデータをバインドします。
 *              Binds data for instances.
 *
 * @return {void}
 * @method
 * @protected
 */
export const execute = (): void =>
{
    vertexArrayObjectBindService($instancedVertexArrayObject);

    $gl.bindBuffer($gl.ARRAY_BUFFER, $attributeWebGLBuffer);

    if (renderQueue.buffer.length > $attributeBufferLength) {

        $attributeBufferLength = renderQueue.buffer.length;

        $gl.bufferData(
            $gl.ARRAY_BUFFER,
            $attributeBufferLength * 4, // renderQueue.buffer.byteLength
            $gl.DYNAMIC_DRAW
        );
    }

    $gl.bufferSubData(
        $gl.ARRAY_BUFFER, 0,
        renderQueue.buffer.subarray(0, renderQueue.offset)
    );
};