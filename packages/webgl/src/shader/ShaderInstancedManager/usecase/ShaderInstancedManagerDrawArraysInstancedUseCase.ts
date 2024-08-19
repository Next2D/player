import type { ShaderInstancedManager } from "../../ShaderInstancedManager";
import { execute as vertexArrayObjectBindAttributeUseCase } from "../../../VertexArrayObject/usecase/VertexArrayObjectBindAttributeUseCase";
import { $gl } from "../../../WebGLUtil";

export const execute = (shader_instanced_manager: ShaderInstancedManager): void => 
{
    // setup
    shader_instanced_manager.useProgram();

    // bind data
    vertexArrayObjectBindAttributeUseCase(shader_instanced_manager);

    // draw
    $gl.drawArraysInstanced($gl.TRIANGLE_STRIP, 0, 4, shader_instanced_manager.count);
}