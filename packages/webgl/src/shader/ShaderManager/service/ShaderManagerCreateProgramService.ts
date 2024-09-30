import type { IProgramObject } from "../../../interface/IProgramObject";
import { $gl } from "../../../WebGLUtil";

/**
 * @description シェーダープログラムID
 *              Shader program ID
 *
 * @type {number}
 * @private
 */
let $programId: number = 0;

/**
 * @description 指定のシェーダープログラムを生成する
 *              Generates the specified shader program
 *
 * @param  {string} vertex_source
 * @param  {string} fragment_source
 * @return {IProgramObject}
 * @method
 * @protected
 */
export const execute = (vertex_source: string, fragment_source: string): IProgramObject =>
{
    const program: WebGLProgram = $gl.createProgram() as NonNullable<WebGLProgram>;

    const vertexShader: WebGLShader = $gl.createShader($gl.VERTEX_SHADER) as NonNullable<WebGLShader>;
    $gl.shaderSource(vertexShader, vertex_source);
    $gl.compileShader(vertexShader);

    const fragmentShader: WebGLShader = $gl.createShader($gl.FRAGMENT_SHADER) as NonNullable<WebGLShader>;
    $gl.shaderSource(fragmentShader, fragment_source);
    $gl.compileShader(fragmentShader);

    $gl.attachShader(program, vertexShader);
    $gl.attachShader(program, fragmentShader);
    $gl.linkProgram(program);

    $gl.detachShader(program, vertexShader);
    $gl.detachShader(program, fragmentShader);

    $gl.deleteShader(vertexShader);
    $gl.deleteShader(fragmentShader);

    return {
        "id": $programId++,
        "resource": program
    };
};