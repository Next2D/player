import type { IProgramObject } from "../interface/IProgramObject";
import type { IUniformData } from "../interface/IUniformData";
import { execute as shaderManagerCreateProgramService } from "./ShaderManager/service/ShaderManagerCreateProgramService";
import { execute as shaderManagerInitializeUniformService } from "./ShaderManager/service/ShaderManagerInitializeUniformService";
import { execute as shaderManagerUseProgramService } from "./ShaderManager/service/ShaderManagerUseProgramService";
import { execute as shaderManagerBindUniformService } from "./ShaderManager/service/ShaderManagerBindUniformService";

export class ShaderManager
{
    private readonly _$programObject: IProgramObject;
    private readonly _$uniformMap: Map<string, IUniformData>;
    public readonly highp: Int32Array | Float32Array;
    public readonly mediump: Int32Array | Float32Array;
    public readonly textures: Int32Array | Float32Array;

    constructor (vertex_source: string, fragment_source: string, atlas: boolean = false)
    {
        this._$programObject = shaderManagerCreateProgramService(vertex_source, fragment_source);
        this._$uniformMap    = new Map();

        shaderManagerInitializeUniformService(
            this._$programObject.resource,
            this._$uniformMap,
            atlas
        );

        const emptyArray = new Float32Array(0);
        this.highp    = this._$uniformMap.get("u_highp")?.array as Int32Array | Float32Array ?? emptyArray;
        this.mediump  = this._$uniformMap.get("u_mediump")?.array as Int32Array | Float32Array ?? emptyArray;
        this.textures = this._$uniformMap.get("u_textures")?.array as Int32Array | Float32Array ?? emptyArray;
    }

    useProgram (): void
    {
        shaderManagerUseProgramService(this._$programObject);
    }

    bindUniform (): void
    {
        shaderManagerBindUniformService(this._$uniformMap);
    }
}
