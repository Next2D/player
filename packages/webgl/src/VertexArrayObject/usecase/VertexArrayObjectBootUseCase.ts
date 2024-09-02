import { execute as vertexArrayObjectCreateInstancedVertexArrayObjectUseCase } from "./VertexArrayObjectCreateInstancedVertexArrayObjectUseCase";
import { execute as vertexArrayObjectCreateRectVertexArrayObjectUseCase } from "./VertexArrayObjectCreateRectVertexArrayObjectUseCase";
import {
    $setInstancedVertexArrayObject,
    $setAttributeWebGLBuffer,
    $setRectVertexArrayObject
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

    // Array Instance用のVertexArrayObjectをセット
    $setInstancedVertexArrayObject(
        vertexArrayObjectCreateInstancedVertexArrayObjectUseCase()
    );

    // 矩形描画用のVertexArrayObjectをセット
    $setRectVertexArrayObject(
        vertexArrayObjectCreateRectVertexArrayObjectUseCase()
    );
};