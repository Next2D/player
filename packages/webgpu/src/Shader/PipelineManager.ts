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
        this.createStencilFillPipelines(); // 2パスステンシルフィル用
        this.createMaskPipeline();
        this.createBasicPipeline();
        this.createTexturePipeline();
        this.createInstancedPipeline();
        this.createGradientPipeline();
        this.createBlendPipeline();
    }

    /**
     * @description 単色塗りつぶし用パイプラインを作成（Loop-Blinn対応・17 floats頂点フォーマット）
     *              アトラステクスチャ（rgba8unorm）とキャンバス（bgra8unorm）の両方に対応
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
        const vertexBufferLayout: GPUVertexBufferLayout = {
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
        };

        const blendState: GPUBlendState = {
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
        };

        // アトラステクスチャ用パイプライン（rgba8unorm）
        const pipelineRGBA = this.device.createRenderPipeline({
            layout: pipelineLayout,
            vertex: {
                module: vertexShaderModule,
                entryPoint: "main",
                buffers: [vertexBufferLayout]
            },
            fragment: {
                module: fragmentShaderModule,
                entryPoint: "main",
                targets: [{
                    format: "rgba8unorm",
                    blend: blendState
                }]
            },
            primitive: {
                topology: "triangle-list",
                cullMode: "none"
            }
        });

        // キャンバス用パイプライン（bgra8unorm）
        const pipelineBGRA = this.device.createRenderPipeline({
            layout: pipelineLayout,
            vertex: {
                module: vertexShaderModule,
                entryPoint: "main",
                buffers: [vertexBufferLayout]
            },
            fragment: {
                module: fragmentShaderModule,
                entryPoint: "main",
                targets: [{
                    format: this.format, // 通常はbgra8unorm
                    blend: blendState
                }]
            },
            primitive: {
                topology: "triangle-list",
                cullMode: "none"
            }
        });

        this.pipelines.set("fill", pipelineRGBA);      // アトラス用（デフォルト）
        this.pipelines.set("fill_bgra", pipelineBGRA); // キャンバス用
    }

    /**
     * @description 2パスステンシルフィル用パイプラインを作成
     *              WebGL版のステンシルフィルと同等の処理を実現
     *
     *              WebGL版:
     *              - Pass 1: stencilOpSeparate(FRONT, INCR_WRAP) + stencilOpSeparate(BACK, DECR_WRAP)
     *                        1回の描画で両面を処理（cullMode: none）
     *              - Pass 2: stencilFunc(NOTEQUAL, 0) + stencilOp(KEEP, ZERO, ZERO)
     *
     * @return {void}
     */
    private createStencilFillPipelines(): void
    {
        // 17 floats per vertex: position(2) + bezier(2) + color(4) + matrix(3+3+3)
        const vertexBufferLayout: GPUVertexBufferLayout = {
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
        };

        // === Pass 1: ステンシル書き込み（WebGL版と同じ: 両面を1回の描画で処理） ===
        // Front面: INCR_WRAP, Back面: DECR_WRAP
        // cullMode: none で両面を描画
        const stencilWritePipeline = this.device.createRenderPipeline({
            layout: "auto",
            vertex: {
                module: this.device.createShaderModule({
                    code: ShaderSource.getStencilWriteVertexShader()
                }),
                entryPoint: "main",
                buffers: [vertexBufferLayout]
            },
            fragment: {
                module: this.device.createShaderModule({
                    code: ShaderSource.getStencilWriteFragmentShader()
                }),
                entryPoint: "main",
                targets: [{
                    format: "rgba8unorm",
                    writeMask: 0 // カラー書き込み無効
                }]
            },
            primitive: {
                topology: "triangle-list",
                cullMode: "none", // 両面を描画
                frontFace: "ccw"
            },
            depthStencil: {
                format: "stencil8",
                stencilFront: {
                    compare: "always",
                    failOp: "keep",
                    depthFailOp: "keep",
                    passOp: "increment-wrap" // Front面（CCW）でインクリメント
                },
                stencilBack: {
                    compare: "always",
                    failOp: "keep",
                    depthFailOp: "keep",
                    passOp: "decrement-wrap" // Back面（CW）でデクリメント
                },
                stencilReadMask: 0xFF,
                stencilWriteMask: 0xFF
            }
        });
        this.pipelines.set("stencil_write", stencilWritePipeline);

        // === Pass 2: ステンシルフィル（色描画） ===
        // WebGL版と同じ: stencilFunc(NOTEQUAL, 0) + stencilOp(KEEP, ZERO, ZERO)
        // WebGL版と同じく頂点バッファを使用（同じメッシュデータ）
        const stencilFillPipeline = this.device.createRenderPipeline({
            layout: "auto",
            vertex: {
                module: this.device.createShaderModule({
                    code: ShaderSource.getStencilFillVertexShader()
                }),
                entryPoint: "main",
                buffers: [vertexBufferLayout] // Pass 1と同じ頂点バッファを使用
            },
            fragment: {
                module: this.device.createShaderModule({
                    code: ShaderSource.getStencilFillFragmentShader()
                }),
                entryPoint: "main",
                targets: [{
                    format: "rgba8unorm",
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
            },
            depthStencil: {
                format: "stencil8",
                stencilFront: {
                    compare: "not-equal", // ステンシル値 != 0 の部分に描画
                    failOp: "keep",
                    depthFailOp: "zero", // WebGL: ZERO
                    passOp: "zero" // WebGL: ZERO - 描画後にステンシルをクリア
                },
                stencilBack: {
                    compare: "not-equal",
                    failOp: "keep",
                    depthFailOp: "zero",
                    passOp: "zero"
                },
                stencilReadMask: 0xFF,
                stencilWriteMask: 0xFF
            }
        });
        this.pipelines.set("stencil_fill", stencilFillPipeline);
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
     *              アトラステクスチャ（rgba8unorm）とキャンバス（bgra8unorm）の両方に対応
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

        const vertexBufferLayout: GPUVertexBufferLayout = {
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
        };

        const blendState: GPUBlendState = {
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
        };

        // アトラステクスチャ用パイプライン（rgba8unorm）
        const pipelineRGBA = this.device.createRenderPipeline({
            layout: pipelineLayout,
            vertex: {
                module: vertexShaderModule,
                entryPoint: "main",
                buffers: [vertexBufferLayout]
            },
            fragment: {
                module: fragmentShaderModule,
                entryPoint: "main",
                targets: [{
                    format: "rgba8unorm",
                    blend: blendState
                }]
            },
            primitive: {
                topology: "triangle-list",
                cullMode: "none"
            }
        });

        // キャンバス用パイプライン（bgra8unorm）
        const pipelineBGRA = this.device.createRenderPipeline({
            layout: pipelineLayout,
            vertex: {
                module: vertexShaderModule,
                entryPoint: "main",
                buffers: [vertexBufferLayout]
            },
            fragment: {
                module: fragmentShaderModule,
                entryPoint: "main",
                targets: [{
                    format: this.format, // 通常はbgra8unorm
                    blend: blendState
                }]
            },
            primitive: {
                topology: "triangle-list",
                cullMode: "none"
            }
        });

        this.pipelines.set("basic", pipelineRGBA);      // アトラス用（デフォルト）
        this.pipelines.set("basic_bgra", pipelineBGRA); // キャンバス用
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
