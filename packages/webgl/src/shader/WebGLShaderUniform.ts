import type { UniformDataImpl } from "../interface/UniformDataImpl";
import {
    $getMap,
    $Float32Array,
    $Int32Array
} from "@next2d/share";

/**
 * @class
 */
export class WebGLShaderUniform
{
    private readonly _$gl: WebGL2RenderingContext;
    private readonly _$array: UniformDataImpl[];
    private readonly _$map: Map<string, UniformDataImpl>;

    /**
     * @param {WebGL2RenderingContext} gl
     * @param {WebGLProgram} program
     * @constructor
     * @public
     */
    constructor (gl: WebGL2RenderingContext, program: WebGLProgram)
    {
        /**
         * @type {WebGL2RenderingContext}
         * @private
         */
        this._$gl = gl;

        /**
         * @type {array}
         * @private
         */
        this._$array = [];

        /**
         * @type {Map}
         * @private
         */
        this._$map = $getMap();

        const activeUniforms: number = this._$gl.getProgramParameter(program, this._$gl.ACTIVE_UNIFORMS);
        for (let i: number = 0; i < activeUniforms; i++) {

            const info: WebGLActiveInfo|null = this._$gl.getActiveUniform(program, i);
            if (!info) {
                throw new Error("the WebGLActiveInfo is null.");
            }

            const name: string = info.name.endsWith("[0]")
                ? info.name.slice(0, -3)
                : info.name;

            const location: WebGLUniformLocation | null = this._$gl.getUniformLocation(program, name);
            if (!location) {
                throw new Error("the WebGLUniformLocation is null.");
            }

            // WebGLの仕様でuniformのint型のデフォルト値は0に設定されるため、
            // sampler2D（size=1）の値の更新は不要
            if (info.type === this._$gl.SAMPLER_2D && info.size === 1) {
                continue;
            }

            const data: UniformDataImpl = {};
            switch (info.type) {

                // uniformの値の設定は、gl.uniform4[fi]v()が最速のため、
                // 可能な限りFloat32Arrayに値をパックして転送するようにする
                case this._$gl.FLOAT_VEC4:
                    data.method = this._$gl.uniform4fv.bind(this._$gl, location);
                    data.array  = new $Float32Array(4 * info.size);
                    data.assign = -1;
                    break;

                case this._$gl.INT_VEC4:
                    data.method = this._$gl.uniform4iv.bind(this._$gl, location);
                    data.array  = new $Int32Array(4 * info.size);
                    data.assign = -1;
                    break;

                // uniformの値の設定は、programに保持されるため、
                // sampler2Dは一度だけ設定するようにする
                case this._$gl.SAMPLER_2D:
                    data.method = this._$gl.uniform1iv.bind(this._$gl, location);
                    data.array  = new $Int32Array(info.size);
                    data.assign = 1;
                    break;

                case this._$gl.FLOAT:
                case this._$gl.FLOAT_VEC2:
                case this._$gl.FLOAT_VEC3:
                case this._$gl.FLOAT_MAT2:
                case this._$gl.FLOAT_MAT3:
                case this._$gl.FLOAT_MAT4:
                case this._$gl.INT:
                case this._$gl.INT_VEC2:
                case this._$gl.INT_VEC3:
                default:
                    throw new Error("Use gl.FLOAT_VEC4 or gl.INT_VEC4 instead");
            }

            this._$array.push(data);
            this._$map.set(name, data);
        }
    }

    /**
     * @param  {string} name
     * @return {Int32Array|Float32Array}
     * @method
     * @public
     */
    getArray (name: string): Int32Array|Float32Array
    {
        const data: UniformDataImpl|void = this._$map.get(name);
        if (!data || !data.array) {
            throw new Error("the UniformData is null.");
        }
        return data.array;
    }

    /**
     * @member {Int32Array|Float32Array}
     * @readonly
     * @public
     */
    get textures (): Int32Array|Float32Array
    {
        const data: UniformDataImpl|void = this._$map.get("u_textures");
        if (!data || !data.array) {
            throw new Error("the UniformData is null.");
        }
        return data.array;
    }

    /**
     * @member {Int32Array|Float32Array}
     * @readonly
     * @public
     */
    get highp (): Int32Array|Float32Array
    {
        const data: UniformDataImpl|void = this._$map.get("u_highp");
        if (!data || !data.array) {
            throw new Error("the UniformData is null.");
        }
        return data.array;
    }

    /**
     * @member {Int32Array|Float32Array}
     * @readonly
     * @public
     */
    get mediump (): Int32Array|Float32Array
    {
        const data: UniformDataImpl|void = this._$map.get("u_mediump");
        if (!data || !data.array) {
            throw new Error("the UniformData is null.");
        }
        return data.array;
    }

    /**
     * @member {Int32Array|Float32Array}
     * @readonly
     * @public
     */
    get integer (): Int32Array|Float32Array
    {
        const data: UniformDataImpl|void = this._$map.get("u_integer");
        if (!data || !data.array) {
            throw new Error("the UniformData is null.");
        }
        return data.array;
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    bindUniforms (): void
    {
        const length: number = this._$array.length;
        for (let i: number = 0; i < length; i++) {

            const data: UniformDataImpl = this._$array[i];
            if (data.method === undefined || data.assign === undefined) {
                continue;
            }

            if (data.assign < 0) {

                data.method(data.array);

            } else if (data.assign > 0) {

                data.assign--;
                data.method(data.array);

            }
        }
    }
}