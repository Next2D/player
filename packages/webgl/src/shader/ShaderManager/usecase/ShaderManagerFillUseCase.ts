import type { ShaderManager } from "../../ShaderManager";
import type { IVertexArrayObject } from "../../../interface/IVertexArrayObject";
import { execute as vertexArrayObjectBindService } from "../../../VertexArrayObject/service/VertexArrayObjectBindService";
import { $gl } from "../../../WebGLUtil";
import { execute as blendResetService } from "../../../Blend/service/BlendResetService";

/**
 * @description シェーダーマネージャの塗り実行します。
 *              Execute ShaderManager fill.
 *
 * @param  {ShaderManager} shader_manager
 * @param  {IVertexArrayObject} vertex_array_object
 * @return {void}
 * @method
 * @protected
 */
export const execute = (
    shader_manager: ShaderManager,
    vertex_array_object: IVertexArrayObject
): void => {

    // setup
    shader_manager.useProgram();
    shader_manager.bindUniform();

    // set alpha
    blendResetService();

    // bind vertex array
    vertexArrayObjectBindService(vertex_array_object);

    // draw fill
    $gl.drawArrays($gl.TRIANGLES, 0, vertex_array_object.indexCount);
};