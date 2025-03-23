import type { ShaderManager } from "../../ShaderManager";
import { execute as vertexArrayObjectBindService } from "../../../VertexArrayObject/service/VertexArrayObjectBindService";
import { $gl } from "../../../WebGLUtil";
import { $getRectVertexArrayObject } from "../../../VertexArrayObject";

/**
 * @description Textureの描画を行います。
 *              Draw Texture.
 *
 * @param  {ShaderManager} shader_manager
 * @return {void}
 * @method
 * @protected
 */
export const execute = (shader_manager: ShaderManager): void =>
{
    // setup
    shader_manager.useProgram();
    shader_manager.bindUniform();

    // bind vertex array
    vertexArrayObjectBindService($getRectVertexArrayObject());

    // draw fill
    $gl.drawArrays($gl.TRIANGLES, 0, 6);
};