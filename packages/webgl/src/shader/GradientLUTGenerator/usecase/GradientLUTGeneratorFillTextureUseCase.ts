import type { ShaderManager } from "../../ShaderManager";
import { $gl } from "../../../WebGLUtil";
import { execute as vertexArrayObjectGetGradientObjectUseCase } from "../../../VertexArrayObject/usecase/VertexArrayObjectGetGradientObjectUseCase";
import { execute as vertexArrayObjectBindService } from "../../../VertexArrayObject/service/VertexArrayObjectBindService";

/**
 * @description グラデーションのtextureの描画を実行
 *              Execute drawing of gradient texture
 *
 * @param  {ShaderManager} shader_manager
 * @param  {number} begin
 * @param  {number} end
 * @return {void}
 * @method
 * @protected
 */
export const execute = (
    shader_manager: ShaderManager,
    begin: number,
    end: number
): void => {

    shader_manager.useProgram();
    shader_manager.bindUniform();

    vertexArrayObjectBindService(
        vertexArrayObjectGetGradientObjectUseCase(begin, end)
    );

    $gl.drawArrays($gl.TRIANGLE_STRIP, 0, 4);
};