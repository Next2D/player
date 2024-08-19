import type { ShaderInstancedManager } from "../../Shader/ShaderInstancedManager";
import { execute as vertexArrayObjectBindService } from "../service/VertexArrayObjectBindService";
import { $gl } from "../../WebGLUtil";
import {
    $instancedVertexArrayObject,
    $getAttributeBuffer,
    $setAttributeBuffer,
    $attributeWebGLBuffer
} from "../../VertexArrayObject";

/**
 * @description インスタンス用のデータをバインドします。
 *              Binds data for instances.
 * 
 * @param  {ShaderInstancedManager} shader_instanced_manager
 * @return {void}
 * @method
 * @protected
 */
export const execute = (shader_instanced_manager: ShaderInstancedManager): void =>
{
    vertexArrayObjectBindService($instancedVertexArrayObject);

    let attributeBuffer = $getAttributeBuffer();

    $gl.bindBuffer($gl.ARRAY_BUFFER, $attributeWebGLBuffer);
    if (shader_instanced_manager.attributes.length > attributeBuffer.length) {

        attributeBuffer = new Float32Array(
            shader_instanced_manager.attributes.length
        );
        $setAttributeBuffer(attributeBuffer);

        $gl.bufferData(
            $gl.ARRAY_BUFFER,
            attributeBuffer.byteLength,
            $gl.DYNAMIC_DRAW
        );
    }

    attributeBuffer.set(shader_instanced_manager.attributes);
    $gl.bufferSubData(
        $gl.ARRAY_BUFFER, 0,
        attributeBuffer.subarray(0, shader_instanced_manager.attributes.length)
    );
};