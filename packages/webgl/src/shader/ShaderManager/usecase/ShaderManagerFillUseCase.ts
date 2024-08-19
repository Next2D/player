import type { ShaderManager } from "../../ShaderManager";
import type { IVertexArrayObject } from "../../../interface/IVertexArrayObject";
import type { IIndexRange } from "../../../interface/IIndexRange";
import { execute as vertexArrayObjectBindService } from "../../../VertexArrayObject/service/VertexArrayObjectBindService";
import { $gl } from "../../../WebGLUtil";

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
    shader_manager.useProgram()
    shader_manager.bindUniform();

    // set alpha
    // this._$context.blend.reset();

    // bind vertex array
    vertexArrayObjectBindService(vertex_array_object);

    // draw fill
    const indexRanges = vertex_array_object.indexRanges as IIndexRange[];
    const range = indexRanges[indexRanges.length - 1];
    $gl.drawArrays($gl.TRIANGLES, 0, range.first + range.count);
}