import type { ShaderInstancedManager } from "../../ShaderInstancedManager";
import { execute as vertexArrayObjectBindAttributeUseCase } from "../../../VertexArrayObject/usecase/VertexArrayObjectBindAttributeUseCase";
import { $gl } from "../../../WebGLUtil";

/**
 * @description インスタンシング描画を実行します。
 *              Execute instanced drawing.
 *
 * @param  {ShaderInstancedManager} shader_instanced_manager
 * @return {void}
 * @method
 * @protected
 */
export const execute = (shader_instanced_manager: ShaderInstancedManager): void =>
{
    // setup
    shader_instanced_manager.useProgram();
    shader_instanced_manager.bindUniform();

    // bind data
    vertexArrayObjectBindAttributeUseCase(shader_instanced_manager);

    // draw
    $gl.drawArraysInstanced($gl.TRIANGLES, 0, 6, shader_instanced_manager.count);
};