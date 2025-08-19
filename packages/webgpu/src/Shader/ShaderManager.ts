import type { IRenderPipelineObject, IComputePipelineObject } from "../interface/IPipelineObject";
import { $device } from "../WebGPUUtil";

/**
 * @description WebGPU版、利用用途に合わせたシェーダークラス
 *              WebGPU version, Shader class tailored to the intended use
 *
 * @class
 * @public
 */
export class ShaderManager
{
    /**
     * @description WebGPUレンダーパイプラインオブジェクト
     *              WebGPU render pipeline object
     *
     * @type {IRenderPipelineObject | null}
     * @private
     */
    private readonly _$renderPipelineObject: IRenderPipelineObject | null;

    /**
     * @description WebGPUコンピュートパイプラインオブジェクト
     *              WebGPU compute pipeline object
     *
     * @type {IComputePipelineObject | null}
     * @private
     */
    private readonly _$computePipelineObject: IComputePipelineObject | null;

    /**
     * @description バインドグループレイアウト
     *              Bind group layout
     *
     * @type {GPUBindGroupLayout}
     * @private
     */
    private readonly _$bindGroupLayout: GPUBindGroupLayout;

    /**
     * @description バインドグループ
     *              Bind group
     *
     * @type {GPUBindGroup | null}
     * @private
     */
    private _$bindGroup: GPUBindGroup | null;

    /**
     * @description ユニフォームバッファー
     *              Uniform buffer
     *
     * @type {GPUBuffer}
     * @private
     */
    private readonly _$uniformBuffer: GPUBuffer;

    /**
     * @description ユニフォームデータ
     *              Uniform data
     *
     * @type {Float32Array}
     * @private
     */
    private readonly _$uniformData: Float32Array;

    /**
     * @param {string} vertex_source
     * @param {string} fragment_source
     * @param {string} [compute_source=""]
     * @param {number} [uniform_buffer_size=256]
     * @constructor
     * @public
     */
    constructor (
        vertex_source: string,
        fragment_source: string,
        compute_source: string = "",
        uniform_buffer_size: number = 256
    ) {
        this._$bindGroup = null;

        // Create uniform buffer
        this._$uniformBuffer = $device.createBuffer({
            "size": uniform_buffer_size,
            "usage": GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });

        this._$uniformData = new Float32Array(uniform_buffer_size / 4);

        // Create bind group layout
        this._$bindGroupLayout = $device.createBindGroupLayout({
            "entries": [
                {
                    "binding": 0,
                    "visibility": GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT | GPUShaderStage.COMPUTE,
                    "buffer": {
                        "type": "uniform"
                    }
                }
            ]
        });

        // Create render pipeline if vertex and fragment shaders are provided
        if (vertex_source && fragment_source) {
            this._$renderPipelineObject = this.createRenderPipeline(vertex_source, fragment_source);
        } else {
            this._$renderPipelineObject = null;
        }

        // Create compute pipeline if compute shader is provided
        if (compute_source) {
            this._$computePipelineObject = this.createComputePipeline(compute_source);
        } else {
            this._$computePipelineObject = null;
        }

        // Create bind group
        this.updateBindGroup();
    }

    /**
     * @description レンダーパイプラインを作成
     *              Create render pipeline
     *
     * @param  {string} vertex_source
     * @param  {string} fragment_source
     * @return {IRenderPipelineObject}
     * @method
     * @private
     */
    private createRenderPipeline (vertex_source: string, fragment_source: string): IRenderPipelineObject
    {
        const vertexShader = $device.createShaderModule({
            "code": vertex_source
        });

        const fragmentShader = $device.createShaderModule({
            "code": fragment_source
        });

        const pipelineLayout = $device.createPipelineLayout({
            "bindGroupLayouts": [this._$bindGroupLayout]
        });

        const pipeline = $device.createRenderPipeline({
            "layout": pipelineLayout,
            "vertex": {
                "module": vertexShader,
                "entryPoint": "main"
            },
            "fragment": {
                "module": fragmentShader,
                "entryPoint": "main",
                "targets": [
                    {
                        "format": "bgra8unorm",
                        "blend": {
                            "color": {
                                "srcFactor": "src-alpha",
                                "dstFactor": "one-minus-src-alpha",
                                "operation": "add"
                            },
                            "alpha": {
                                "srcFactor": "one",
                                "dstFactor": "one-minus-src-alpha",
                                "operation": "add"
                            }
                        }
                    }
                ]
            },
            "primitive": {
                "topology": "triangle-list"
            }
        });

        return {
            "id": Date.now(), // Simple ID generation
            "resource": pipeline
        };
    }

    /**
     * @description コンピュートパイプラインを作成
     *              Create compute pipeline
     *
     * @param  {string} compute_source
     * @return {IComputePipelineObject}
     * @method
     * @private
     */
    private createComputePipeline (compute_source: string): IComputePipelineObject
    {
        const computeShader = $device.createShaderModule({
            "code": compute_source
        });

        const pipelineLayout = $device.createPipelineLayout({
            "bindGroupLayouts": [this._$bindGroupLayout]
        });

        const pipeline = $device.createComputePipeline({
            "layout": pipelineLayout,
            "compute": {
                "module": computeShader,
                "entryPoint": "main"
            }
        });

        return {
            "id": Date.now(), // Simple ID generation
            "resource": pipeline
        };
    }

    /**
     * @description バインドグループを更新
     *              Update bind group
     *
     * @return {void}
     * @method
     * @private
     */
    private updateBindGroup (): void
    {
        this._$bindGroup = $device.createBindGroup({
            "layout": this._$bindGroupLayout,
            "entries": [
                {
                    "binding": 0,
                    "resource": {
                        "buffer": this._$uniformBuffer
                    }
                }
            ]
        });
    }

    /**
     * @description レンダーパイプラインを使用
     *              Use render pipeline
     *
     * @param  {GPURenderPassEncoder} pass_encoder
     * @return {void}
     * @method
     * @public
     */
    useRenderPipeline (pass_encoder: GPURenderPassEncoder): void
    {
        if (this._$renderPipelineObject && this._$bindGroup) {
            pass_encoder.setPipeline(this._$renderPipelineObject.resource);
            pass_encoder.setBindGroup(0, this._$bindGroup);
        }
    }

    /**
     * @description コンピュートパイプラインを使用
     *              Use compute pipeline
     *
     * @param  {GPUComputePassEncoder} pass_encoder
     * @return {void}
     * @method
     * @public
     */
    useComputePipeline (pass_encoder: GPUComputePassEncoder): void
    {
        if (this._$computePipelineObject && this._$bindGroup) {
            pass_encoder.setPipeline(this._$computePipelineObject.resource);
            pass_encoder.setBindGroup(0, this._$bindGroup);
        }
    }

    /**
     * @description ユニフォームデータを更新
     *              Update uniform data
     *
     * @param  {Float32Array} data
     * @param  {number} [offset=0]
     * @return {void}
     * @method
     * @public
     */
    updateUniforms (data: Float32Array, offset: number = 0): void
    {
        this._$uniformData.set(data, offset);
        $device.queue.writeBuffer(this._$uniformBuffer, offset * 4, data);
    }

    /**
     * @description ユニフォームデータを取得
     *              Get uniform data
     *
     * @type {Float32Array}
     * @readonly
     * @public
     */
    get uniformData (): Float32Array
    {
        return this._$uniformData;
    }

    /**
     * @description レンダーパイプラインオブジェクトを取得
     *              Get render pipeline object
     *
     * @type {IRenderPipelineObject | null}
     * @readonly
     * @public
     */
    get renderPipelineObject (): IRenderPipelineObject | null
    {
        return this._$renderPipelineObject;
    }

    /**
     * @description コンピュートパイプラインオブジェクトを取得
     *              Get compute pipeline object
     *
     * @type {IComputePipelineObject | null}
     * @readonly
     * @public
     */
    get computePipelineObject (): IComputePipelineObject | null
    {
        return this._$computePipelineObject;
    }

    /**
     * @description リソースを破棄
     *              Destroy resources
     *
     * @return {void}
     * @method
     * @public
     */
    destroy (): void
    {
        this._$uniformBuffer.destroy();
    }
}