import { execute as vertexArrayObjectCreateInstancedVertexArrayObjectUseCase } from "./VertexArrayObjectCreateInstancedVertexArrayObjectUseCase";
import {
    $setInstancedVertexArrayObject,
    $setAttributeWebGLBuffer
} from "../../VertexArrayObject";

/**
 * @description VertexArrayObjectの起動ユースケース
 *              VertexArrayObject boot use case
 *
 * @param  {WebGL2RenderingContext} gl
 * @return {void}
 * @method
 * @protected
 */
export const execute = (gl: WebGL2RenderingContext): void =>
{
    // インスタンス用のバッファをセット
    // fixed logic
    $setAttributeWebGLBuffer(gl);

    $setInstancedVertexArrayObject(
        vertexArrayObjectCreateInstancedVertexArrayObjectUseCase()
    );
};