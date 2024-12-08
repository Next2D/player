import type { ShaderManager } from "../../ShaderManager";
import { execute as vertexArrayObjectBindService } from "../../../VertexArrayObject/service/VertexArrayObjectBindService";
import { $gl } from "../../../WebGLUtil";
import { execute as blendResetService } from "../../../Blend/service/BlendResetService";
import { IStrokeVertexArrayObject } from "../../../interface/IStrokeVertexArrayObject";

/**
 * @description シェーダーマネージャのストローク描画を実行します。
 *              Execute the stroke drawing of the shader manager.
 *
 * @param  {ShaderManager} shader_manager
 * @param  {IStrokeVertexArrayObject} vertex_array_object
 * @return {void}
 * @method
 * @protected
 */
export const execute = (
    shader_manager: ShaderManager,
    vertex_array_object: IStrokeVertexArrayObject
): void => {

    // setup
    shader_manager.useProgram();
    shader_manager.bindUniform();

    // set alpha
    blendResetService();

    // bind vertex array
    vertexArrayObjectBindService(vertex_array_object);

    $gl.drawElements(
        $gl.TRIANGLES,
        vertex_array_object.indexCount,
        $gl.UNSIGNED_SHORT, 0
    );
};