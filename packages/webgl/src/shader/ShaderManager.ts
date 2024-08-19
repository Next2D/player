import type { IProgramObject } from "../interface/IProgramObject";
import type { IUniformData } from "../interface/IUniformData";
import { execute as shaderManagerCreateProgramService } from "./ShaderManager/service/ShaderManagerCreateProgramService"
import { execute as shaderManagerInitializeUniformService } from "./ShaderManager/service/ShaderManagerInitializeUniformService"
import { execute as shaderManagerUseProgramService } from "./ShaderManager/service/ShaderManagerUseProgramService"
import { execute as shaderManagerBindUniformService } from "./ShaderManager/service/ShaderManagerBindUniformService"

/**
 * @description 利用用途に合わせたシェーダークラス
 *              Shader class tailored to the intended use
 * 
 * @class
 * @public
 */
export class ShaderManager
{
    /**
     * @description WebGLプログラムオブジェクト
     *              WebGL program object
     * 
     * @type {IProgramObject}
     * @public
     */
    private readonly _$programObject: IProgramObject

    /**
     * @description uniform変数のマップ
     *              Map of uniform variables
     *
     * @type {Map<string, IUniformData>}
     * @private
     */
    private readonly _$uniformMap: Map<string, IUniformData>

    /**
     * @param {string} vertex_source 
     * @param {string} fragment_source
     * @constructor
     * @public
     */
    constructor (vertex_source: string, fragment_source: string) 
    {
        this._$programObject = shaderManagerCreateProgramService(vertex_source, fragment_source);
        this._$uniformMap    = new Map();

        shaderManagerInitializeUniformService(
            this._$programObject.resource,
            this._$uniformMap
        );
    }

    /**
     * @description 生成したプログラムを利用します。
     *              Use the generated program.
     * 
     * @return {void}
     * @method
     * @public
     */
    useProgram (): void
    {
        shaderManagerUseProgramService(this._$programObject);
    }

    /**
     * @description uniform変数をバインドします。
     *              Bind uniform variables.
     * 
     * @return {void}
     * @method
     * @public
     */
    bindUniform (): void
    {
        shaderManagerBindUniformService(this._$uniformMap);
    }

    /**
     * @description highp uniform変数
     *              highp uniform variable
     * 
     * @type {Int32Array | Float32Array}
     * @readonly
     * @public
     */
    get highp (): Int32Array | Float32Array
    {
        const data = this._$uniformMap.get("u_highp") as NonNullable<IUniformData>;
        return data.array as Int32Array | Float32Array;
    }

    /**
     * @description mediump uniform変数
     *              mediump uniform variable
     * 
     * @type {Int32Array | Float32Array}
     * @readonly
     * @public
     */
    get mediump (): Int32Array | Float32Array
    {
        const data = this._$uniformMap.get("u_mediump") as NonNullable<IUniformData>;
        return data.array as Int32Array | Float32Array;
    }
}