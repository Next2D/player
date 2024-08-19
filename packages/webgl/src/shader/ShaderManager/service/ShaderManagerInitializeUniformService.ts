import type { IUniformData } from "../../../interface/IUniformData";
import { $gl } from "../../../WebGLUtil";

/**
 * @description uniform変数の初期化
 *              Initialize uniform variables
 * 
 * @param {WebGLProgram} program 
 * @param {Map} map 
 * @method
 * @protected
 */
export const execute = (program: WebGLProgram, map: Map<string, IUniformData>): void => 
{
    const count: number = $gl.getProgramParameter(program, $gl.ACTIVE_UNIFORMS);
    for (let idx: number = 0; idx < count; ++idx) {

        const info: WebGLActiveInfo = $gl.getActiveUniform(program, idx) as NonNullable<WebGLActiveInfo>;

        const name: string = info.name.endsWith("[0]")
            ? info.name.slice(0, -3)
            : info.name;

        const location: WebGLUniformLocation = $gl.getUniformLocation(program, name) as NonNullable<WebGLUniformLocation>;

        // WebGLの仕様でuniformのint型のデフォルト値は0に設定されるため、
        // sampler2D（size=1）の値の更新は不要
        if (info.type === $gl.SAMPLER_2D && info.size === 1) {
            continue;
        }

        const data: IUniformData = {};
        switch (info.type) {

            // uniformの値の設定は、gl.uniform4[fi]v()が最速のため、
            // 可能な限りFloat32Arrayに値をパックして転送するようにする
            case $gl.FLOAT_VEC4:
                data.method = $gl.uniform4fv.bind($gl, location);
                data.array  = new Float32Array(4 * info.size);
                data.assign = -1;
                break;

            case $gl.INT_VEC4:
                data.method = $gl.uniform4iv.bind($gl, location);
                data.array  = new Int32Array(4 * info.size);
                data.assign = -1;
                break;

            // uniformの値の設定は、programに保持されるため、
            // sampler2Dは一度だけ設定するようにする
            case $gl.SAMPLER_2D:
                data.method = $gl.uniform1iv.bind($gl, location);
                data.array  = new Int32Array(info.size);
                data.assign = 1;
                break;

            case $gl.FLOAT:
            case $gl.FLOAT_VEC2:
            case $gl.FLOAT_VEC3:
            case $gl.FLOAT_MAT2:
            case $gl.FLOAT_MAT3:
            case $gl.FLOAT_MAT4:
            case $gl.INT:
            case $gl.INT_VEC2:
            case $gl.INT_VEC3:
            default:
                throw new Error("Use gl.FLOAT_VEC4 or gl.INT_VEC4 instead");

        }

        map.set(name, data);
    }
};