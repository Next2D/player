import { ShaderSource } from "./ShaderSource";

/**
 * @description WebGPUのパイプライン管理クラス
 *              WebGPU pipeline manager class
 */
export class PipelineManager
{
    private device: GPUDevice;
    private format: GPUTextureFormat;
    private pipelines: Map<string, GPURenderPipeline>;
    private bindGroupLayouts: Map<string, GPUBindGroupLayout>;

    /**
     * @param {GPUDevice} device
     * @param {GPUTextureFormat} format
     * @constructor
     */
    constructor(device: GPUDevice, format: GPUTextureFormat)
    {
        this.device = device;
        this.format = format;
        this.pipelines = new Map();
        this.bindGroupLayouts = new Map();
        
        this.initialize();
    }

    /**
     * @description パイプラインの初期化
     * @return {void}
     */
    private initialize(): void
    {
        this.createFillPipeline();
        this.createMaskPipeline();
        this.createBasicPipeline();
        this.createTexturePipeline();
        this.createInstancedPipeline();
        this.createGradientPipeline();
        this.createBlendPipeline();
    }

    /**
     * @description 単色塗りつぶし用パイプラインを作成（Loop-Blinn対応・17 floats頂点フォーマット）
     * @return {void}
     */
    private createFillPipeline(): void
    {
        const bindGroupLayout = this.device.createBindGroupLayout({
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.VERTEX,
                    buffer: { type: "uniform" }
                }
            ]
        });

        this.bindGroupLayouts.set("fill", bindGroupLayout);

        const pipelineLayout = this.device.createPipelineLayout({
            bindGroupLayouts: [bindGroupLayout]
        });

        const vertexShaderModule = this.device.createShaderModule({
            code: ShaderSource.getFillVertexShader()
        });

        const fragmentShaderModule = this.device.createShaderModule({
            code: ShaderSource.getFillFragmentShader()
        });

        // 17 floats per vertex: position(2) + bezier(2) + color(4) + matrix(3+3+3)
        const pipeline = this.device.createRenderPipeline({
            layout: pipelineLayout,
            vertex: {
                module: vertexShaderModule,
                entryPoint: "main",
                buffers: [{
                    arrayStride: 17 * 4, // 17 floats (68 bytes)
                    attributes: [
                        {
                            shaderLocation: 0,
                            offset: 0,
                            format: "float32x2" // position (2 floats)
                        },
                        {
                            shaderLocation: 1,
                            offset: 2 * 4,
                            format: "float32x2" // bezier (2 floats)
                        },
                        {
                            shaderLocation: 2,
                            offset: 4 * 4,
                            format: "float32x4" // color (4 floats)
                        },
                        {
                            shaderLocation: 3,
                            offset: 8 * 4,
                            format: "float32x3" // matrix row 0 (3 floats)
                        },
                        {
                            shaderLocation: 4,
                            offset: 11 * 4,
                            format: "float32x3" // matrix row 1 (3 floats)
                        },
                        {
                            shaderLocation: 5,
                            offset: 14 * 4,
                            format: "float32x3" // matrix row 2 (3 floats)
                        }
                    ]
                }]
            },
            fragment: {
                module: fragmentShaderModule,
                entryPoint: "main",
                targets: [{
                    format: this.format,
                    blend: {
                        color: {
                            srcFactor: "one",
                            dstFactor: "one-minus-src-alpha",
                            operation: "add"
                        },
                        alpha: {
                            srcFactor: "one",
                            dstFactor: "one-minus-src-alpha",
                            operation: "add"
                        }
                    }
                }]
            },
            primitive: {
                topology: "triangle-list",
                cullMode: "none"
            }
        });

        this.pipelines.set("fill", pipeline);
    }

    /**
     * @description マスク用パイプラインを作成（ベジェ曲線アンチエイリアス）
     * @return {void}
     */
    private createMaskPipeline(): void
    {
        const bindGroupLayout = this.device.createBindGroupLayout({
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.VERTEX,
                    buffer: { type: "uniform" }
                }
            ]
        });

        this.bindGroupLayouts.set("mask", bindGroupLayout);

        const pipelineLayout = this.device.createPipelineLayout({
            bindGroupLayouts: [bindGroupLayout]
        });

        const vertexShaderModule = this.device.createShaderModule({
            code: ShaderSource.getMaskVertexShader()
        });

        const fragmentShaderModule = this.device.createShaderModule({
            code: ShaderSource.getMaskFragmentShader()
        });

        const pipeline = this.device.createRenderPipeline({
            layout: pipelineLayout,
            vertex: {
                module: vertexShaderModule,
                entryPoint: "main",
                buffers: [{
                    arrayStride: 4 * 4, // 2 floats (position) + 2 floats (bezier)
                    attributes: [
                        {
                            shaderLocation: 0,
                            offset: 0,
                            format: "float32x2" // position
                        },
                        {
                            shaderLocation: 1,
                            offset: 2 * 4,
                            format: "float32x2" // bezier
                        }
                    ]
                }]
            },
            fragment: {
                module: fragmentShaderModule,
                entryPoint: "main",
                targets: [{
                    format: this.format,
                    blend: {
                        color: {
                            srcFactor: "one",
                            dstFactor: "one-minus-src-alpha",
                            operation: "add"
                        },
                        alpha: {
                            srcFactor: "one",
                            dstFactor: "one-minus-src-alpha",
                            operation: "add"
                        }
                    }
                }]
            },
            primitive: {
                topology: "triangle-list",
                cullMode: "none"
            }
            // Note: Stencil support disabled for now (requires depth-stencil attachment)
            // TODO: Add depth-stencil configuration when implementing two-pass rendering
        });

        this.pipelines.set("mask", pipeline);
    }

    /**
     * @description 基本的なパイプラインを作成
     * @return {void}
     */
    private createBasicPipeline(): void
    {
        const bindGroupLayout = this.device.createBindGroupLayout({
            entries: [{
                binding: 0,
                visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
                buffer: { type: "uniform" }
            }]
        });

        this.bindGroupLayouts.set("basic", bindGroupLayout);

        const pipelineLayout = this.device.createPipelineLayout({
            bindGroupLayouts: [bindGroupLayout]
        });

        const vertexShaderModule = this.device.createShaderModule({
            code: ShaderSource.getBasicVertexShader()
        });

        const fragmentShaderModule = this.device.createShaderModule({
            code: ShaderSource.getBasicFragmentShader()
        });

        const pipeline = this.device.createRenderPipeline({
            layout: pipelineLayout,
            vertex: {
                module: vertexShaderModule,
                entryPoint: "main",
                buffers: [{
                    arrayStride: 4 * 4, // 2 floats for position + 2 floats for texCoord
                    attributes: [
                        {
                            shaderLocation: 0,
                            offset: 0,
                            format: "float32x2"
                        },
                        {
                            shaderLocation: 1,
                            offset: 2 * 4,
                            format: "float32x2"
                        }
                    ]
                }]
            },
            fragment: {
                module: fragmentShaderModule,
                entryPoint: "main",
                targets: [{
                    format: this.format,
                    blend: {
                        color: {
                            srcFactor: "one",
                            dstFactor: "one-minus-src-alpha",
                            operation: "add"
                        },
                        alpha: {
                            srcFactor: "one",
                            dstFactor: "one-minus-src-alpha",
                            operation: "add"
                        }
                    }
                }]
            },
            primitive: {
                topology: "triangle-list",
                cullMode: "none"
            }
        });

        this.pipelines.set("basic", pipeline);
    }

    /**
     * @description テクスチャ用パイプラインを作成
     * @return {void}
     */
    private createTexturePipeline(): void
    {
        const bindGroupLayout = this.device.createBindGroupLayout({
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
                    buffer: { type: "uniform" }
                },
                {
                    binding: 1,
                    visibility: GPUShaderStage.FRAGMENT,
                    sampler: {}
                },
                {
                    binding: 2,
                    visibility: GPUShaderStage.FRAGMENT,
                    texture: {}
                }
            ]
        });

        this.bindGroupLayouts.set("texture", bindGroupLayout);

        const pipelineLayout = this.device.createPipelineLayout({
            bindGroupLayouts: [bindGroupLayout]
        });

        const vertexShaderModule = this.device.createShaderModule({
            code: ShaderSource.getBasicVertexShader()
        });

        const fragmentShaderModule = this.device.createShaderModule({
            code: ShaderSource.getTextureFragmentShader()
        });

        const pipeline = this.device.createRenderPipeline({
            layout: pipelineLayout,
            vertex: {
                module: vertexShaderModule,
                entryPoint: "main",
                buffers: [{
                    arrayStride: 4 * 4,
                    attributes: [
                        {
                            shaderLocation: 0,
                            offset: 0,
                            format: "float32x2"
                        },
                        {
                            shaderLocation: 1,
                            offset: 2 * 4,
                            format: "float32x2"
                        }
                    ]
                }]
            },
            fragment: {
                module: fragmentShaderModule,
                entryPoint: "main",
                targets: [{
                    format: this.format,
                    blend: {
                        color: {
                            srcFactor: "one",
                            dstFactor: "one-minus-src-alpha",
                            operation: "add"
                        },
                        alpha: {
                            srcFactor: "one",
                            dstFactor: "one-minus-src-alpha",
                            operation: "add"
                        }
                    }
                }]
            },
            primitive: {
                topology: "triangle-list",
                cullMode: "none"
            }
        });

        this.pipelines.set("texture", pipeline);
    }

    /**
     * @description インスタンス描画用パイプラインを作成
     * @return {void}
     */
    private createInstancedPipeline(): void
    {
        const bindGroupLayout = this.device.createBindGroupLayout({
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.FRAGMENT,
                    sampler: {}
                },
                {
                    binding: 1,
                    visibility: GPUShaderStage.FRAGMENT,
                    texture: {}
                }
            ]
        });

        this.bindGroupLayouts.set("instanced", bindGroupLayout);

        const pipelineLayout = this.device.createPipelineLayout({
            bindGroupLayouts: [bindGroupLayout]
        });

        const vertexShaderModule = this.device.createShaderModule({
            code: ShaderSource.getInstancedVertexShader()
        });

        const fragmentShaderModule = this.device.createShaderModule({
            code: ShaderSource.getInstancedFragmentShader()
        });

        const pipeline = this.device.createRenderPipeline({
            layout: pipelineLayout,
            vertex: {
                module: vertexShaderModule,
                entryPoint: "main",
                buffers: [
                    // Vertex buffer
                    {
                        arrayStride: 4 * 4, // 2 floats position + 2 floats texCoord
                        stepMode: "vertex",
                        attributes: [
                            {
                                shaderLocation: 0,
                                offset: 0,
                                format: "float32x2" // position
                            },
                            {
                                shaderLocation: 1,
                                offset: 2 * 4,
                                format: "float32x2" // texCoord
                            }
                        ]
                    },
                    // Instance buffer
                    {
                        arrayStride: 4 * 24, // 24 floats per instance (with padding)
                        stepMode: "instance",
                        attributes: [
                            {
                                shaderLocation: 2,
                                offset: 0,
                                format: "float32x4" // textureRect (4 floats)
                            },
                            {
                                shaderLocation: 3,
                                offset: 4 * 4,
                                format: "float32x4" // textureDim (4 floats)
                            },
                            {
                                shaderLocation: 4,
                                offset: 8 * 4,
                                format: "float32x4" // matrixTx (vec2) + padding (vec2) = 4 floats
                            },
                            {
                                shaderLocation: 5,
                                offset: 12 * 4,
                                format: "float32x4" // matrixScale (4 floats)
                            },
                            {
                                shaderLocation: 6,
                                offset: 16 * 4,
                                format: "float32x4" // mulColor (4 floats)
                            },
                            {
                                shaderLocation: 7,
                                offset: 20 * 4,
                                format: "float32x4" // addColor (4 floats)
                            }
                        ]
                    }
                ]
            },
            fragment: {
                module: fragmentShaderModule,
                entryPoint: "main",
                targets: [{
                    format: this.format,
                    blend: {
                        color: {
                            srcFactor: "one",
                            dstFactor: "one-minus-src-alpha",
                            operation: "add"
                        },
                        alpha: {
                            srcFactor: "one",
                            dstFactor: "one-minus-src-alpha",
                            operation: "add"
                        }
                    }
                }]
            },
            primitive: {
                topology: "triangle-list",
                cullMode: "none"
            }
        });

        this.pipelines.set("instanced", pipeline);
    }

    /**
     * @description グラデーション用パイプラインを作成
     * @return {void}
     */
    private createGradientPipeline(): void
    {
        const bindGroupLayout = this.device.createBindGroupLayout({
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
                    buffer: { type: "uniform" }
                },
                {
                    binding: 1,
                    visibility: GPUShaderStage.FRAGMENT,
                    buffer: { type: "uniform" }
                },
                {
                    binding: 2,
                    visibility: GPUShaderStage.FRAGMENT,
                    sampler: {}
                },
                {
                    binding: 3,
                    visibility: GPUShaderStage.FRAGMENT,
                    texture: {}
                }
            ]
        });

        this.bindGroupLayouts.set("gradient", bindGroupLayout);

        const pipelineLayout = this.device.createPipelineLayout({
            bindGroupLayouts: [bindGroupLayout]
        });

        const vertexShaderModule = this.device.createShaderModule({
            code: ShaderSource.getBasicVertexShader()
        });

        const fragmentShaderModule = this.device.createShaderModule({
            code: ShaderSource.getGradientFragmentShader()
        });

        const pipeline = this.device.createRenderPipeline({
            layout: pipelineLayout,
            vertex: {
                module: vertexShaderModule,
                entryPoint: "main",
                buffers: [{
                    arrayStride: 4 * 4,
                    attributes: [
                        {
                            shaderLocation: 0,
                            offset: 0,
                            format: "float32x2"
                        },
                        {
                            shaderLocation: 1,
                            offset: 2 * 4,
                            format: "float32x2"
                        }
                    ]
                }]
            },
            fragment: {
                module: fragmentShaderModule,
                entryPoint: "main",
                targets: [{
                    format: this.format,
                    blend: {
                        color: {
                            srcFactor: "one",
                            dstFactor: "one-minus-src-alpha",
                            operation: "add"
                        },
                        alpha: {
                            srcFactor: "one",
                            dstFactor: "one-minus-src-alpha",
                            operation: "add"
                        }
                    }
                }]
            },
            primitive: {
                topology: "triangle-list",
                cullMode: "none"
            }
        });

        this.pipelines.set("gradient", pipeline);
    }

    /**
     * @description ブレンド用パイプラインを作成
     * @return {void}
     */
    private createBlendPipeline(): void
    {
        const bindGroupLayout = this.device.createBindGroupLayout({
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
                    buffer: { type: "uniform" }
                },
                {
                    binding: 1,
                    visibility: GPUShaderStage.FRAGMENT,
                    buffer: { type: "uniform" }
                },
                {
                    binding: 2,
                    visibility: GPUShaderStage.FRAGMENT,
                    sampler: {}
                },
                {
                    binding: 3,
                    visibility: GPUShaderStage.FRAGMENT,
                    texture: {}
                },
                {
                    binding: 4,
                    visibility: GPUShaderStage.FRAGMENT,
                    sampler: {}
                },
                {
                    binding: 5,
                    visibility: GPUShaderStage.FRAGMENT,
                    texture: {}
                }
            ]
        });

        this.bindGroupLayouts.set("blend", bindGroupLayout);

        const pipelineLayout = this.device.createPipelineLayout({
            bindGroupLayouts: [bindGroupLayout]
        });

        const vertexShaderModule = this.device.createShaderModule({
            code: ShaderSource.getBasicVertexShader()
        });

        const fragmentShaderModule = this.device.createShaderModule({
            code: ShaderSource.getBlendFragmentShader()
        });

        const pipeline = this.device.createRenderPipeline({
            layout: pipelineLayout,
            vertex: {
                module: vertexShaderModule,
                entryPoint: "main",
                buffers: [{
                    arrayStride: 4 * 4,
                    attributes: [
                        {
                            shaderLocation: 0,
                            offset: 0,
                            format: "float32x2"
                        },
                        {
                            shaderLocation: 1,
                            offset: 2 * 4,
                            format: "float32x2"
                        }
                    ]
                }]
            },
            fragment: {
                module: fragmentShaderModule,
                entryPoint: "main",
                targets: [{
                    format: this.format,
                    blend: {
                        color: {
                            srcFactor: "one",
                            dstFactor: "one-minus-src-alpha",
                            operation: "add"
                        },
                        alpha: {
                            srcFactor: "one",
                            dstFactor: "one-minus-src-alpha",
                            operation: "add"
                        }
                    }
                }]
            },
            primitive: {
                topology: "triangle-list",
                cullMode: "none"
            }
        });

        this.pipelines.set("blend", pipeline);
    }

    /**
     * @description パイプラインを取得
     * @param {string} name
     * @return {GPURenderPipeline | undefined}
     */
    getPipeline(name: string): GPURenderPipeline | undefined
    {
        return this.pipelines.get(name);
    }

    /**
     * @description バインドグループレイアウトを取得
     * @param {string} name
     * @return {GPUBindGroupLayout | undefined}
     */
    getBindGroupLayout(name: string): GPUBindGroupLayout | undefined
    {
        return this.bindGroupLayouts.get(name);
    }

    /**
     * @description 解放
     * @return {void}
     */
    dispose(): void
    {
        this.pipelines.clear();
        this.bindGroupLayouts.clear();
    }
}
