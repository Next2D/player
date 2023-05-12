/**
 * @class
 */
class WebGLShaderUniform
{
    /**
     * @param {WebGLRenderingContext} gl
     * @param {WebGLProgram}          program
     * @constructor
     * @public
     */
    constructor (gl, program)
    {
        this._$gl     = gl;
        this._$array = [];
        this._$map    = new Map();

        const activeUniforms = this._$gl.getProgramParameter(program, this._$gl.ACTIVE_UNIFORMS);
        for (let i = 0; i < activeUniforms; i++) {
            const info = this._$gl.getActiveUniform(program, i);
            const name = info.name.endsWith("[0]") ? info.name.slice(0, -3) : info.name;

            // console.log("info:", info.name, info.type, info.size);

            const data = {};
            const location = this._$gl.getUniformLocation(program, name);

            // WebGLの仕様でuniformのint型のデフォルト値は0に設定されるため、
            // sampler2D（size=1）の値の更新は不要
            if (info.type === this._$gl.SAMPLER_2D && info.size === 1) {
                continue;
            }

            switch (info.type) {
                // uniformの値の設定は、gl.uniform4[fi]v()が最速のため、
                // 可能な限りFloat32Arrayに値をパックして転送するようにする
                case this._$gl.FLOAT_VEC4:
                    data.method = this._$gl.uniform4fv.bind(this._$gl, location);
                    data.array = new $Float32Array(4 * info.size);
                    data.assign = -1;
                    break;
                case this._$gl.INT_VEC4:
                    data.method = this._$gl.uniform4iv.bind(this._$gl, location);
                    data.array = new Int32Array(4 * info.size);
                    data.assign = -1;
                    break;
                // uniformの値の設定は、programに保持されるため、
                // sampler2Dは一度だけ設定するようにする
                case this._$gl.SAMPLER_2D:
                    data.method = this._$gl.uniform1iv.bind(this._$gl, location);
                    data.array = new Int32Array(info.size);
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

        // console.log(this._$map);
        // console.log("------------------");
    }

    /**
     * @param {string} name
     * @method
     * @public
     */
    getArray (name)
    {
        return this._$map.get(name).array;
    }

    /**
     * @memberof WebGLShaderUniform#
     * @property {Int32Array}
     * @return {Int32Array}
     * @readonly
     * @public
     */
    get textures ()
    {
        return this._$map.get("u_textures").array;
    }

    /**
     * @memberof WebGLShaderUniform#
     * @property {Float32Array}
     * @return {Float32Array}
     * @readonly
     * @public
     */
    get highp ()
    {
        return this._$map.get("u_highp").array;
    }

    /**
     * @memberof WebGLShaderUniform#
     * @property {Float32Array}
     * @return {Float32Array}
     * @readonly
     * @public
     */
    get mediump ()
    {
        return this._$map.get("u_mediump").array;
    }

    /**
     * @memberof WebGLShaderUniform#
     * @property {Int32Array}
     * @return   {Int32Array}
     * @readonly
     * @public
     */
    get integer ()
    {
        return this._$map.get("u_integer").array;
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    bindUniforms ()
    {
        const length = this._$array.length;
        for (let i = 0; i < length; i++) {
            const data = this._$array[i];
            if (data.assign < 0) {
                data.method(data.array);
            } else if (data.assign > 0) {
                data.assign--;
                data.method(data.array);
            }
        }
    }
}