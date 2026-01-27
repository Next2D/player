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
        this.createClipPipeline(); // マスククリッピング用
        this.createMaskPipeline();
        this.createBasicPipeline();
        this.createTexturePipeline();
        this.createInstancedPipeline();
        this.createGradientPipeline();
        this.createBitmapFillPipeline(); // ビットマップ塗りつぶし用
        this.createBlendPipeline();
        this.createBlurFilterPipeline(); // ブラーフィルター用
        this.createTextureCopyPipeline(); // テクスチャコピー用
        this.createColorMatrixFilterPipeline(); // カラーマトリックスフィルター用
        this.createGlowFilterPipeline(); // グローフィルター用
        this.createDropShadowFilterPipeline(); // ドロップシャドウフィルター用
        this.createBevelFilterPipeline(); // ベベルフィルター用
        this.createGradientGlowFilterPipeline(); // グラデーショングローフィルター用
        this.createGradientBevelFilterPipeline(); // グラデーションベベルフィルター用
        this.createComplexBlendPipelines(); // 複雑なブレンドモード用
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

        // キャンバス用パイプライン（bgra8unorm）- Y軸反転シェーダーを使用
        const vertexShaderModuleMain = this.device.createShaderModule({
            code: ShaderSource.getFillMainVertexShader()
        });

        const pipelineBGRA = this.device.createRenderPipeline({
            layout: pipelineLayout,
            vertex: {
                module: vertexShaderModuleMain, // Y軸反転ありシェーダー
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

        // === メインアタッチメントのステンシル付きレンダーパス用 ===
        // マスクモード時に使用（ステンシルテスト: not-equal 0 でマスク領域のみ描画）
        const pipelineBGRAStencil = this.device.createRenderPipeline({
            layout: pipelineLayout,
            vertex: {
                module: vertexShaderModuleMain, // Y軸反転ありシェーダー
                entryPoint: "main",
                buffers: [vertexBufferLayout]
            },
            fragment: {
                module: fragmentShaderModule,
                entryPoint: "main",
                targets: [{
                    format: this.format,
                    blend: blendState
                }]
            },
            primitive: {
                topology: "triangle-list",
                cullMode: "none"
            },
            depthStencil: {
                format: "stencil8",
                stencilFront: {
                    compare: "not-equal", // ステンシル値 != 0 の部分のみ描画（マスク領域）
                    failOp: "keep",
                    depthFailOp: "keep",
                    passOp: "keep" // ステンシル値は変更しない
                },
                stencilBack: {
                    compare: "not-equal",
                    failOp: "keep",
                    depthFailOp: "keep",
                    passOp: "keep"
                },
                stencilReadMask: 0xFF,
                stencilWriteMask: 0x00
            }
        });
        this.pipelines.set("fill_bgra_stencil", pipelineBGRAStencil); // マスク付きキャンバス用
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

        // === Pass 2 (Masked): マスク領域内のみ描画 ===
        // マスクモード時の2パスフィル:
        // 1. clip_writeでマスク領域にmaskValue(例:1)を書き込み済み
        // 2. stencil_writeでINCR/DECRを実行（奇数カバレッジ: maskValue+1, 偶数: maskValue）
        // 3. このパイプラインで stencil > maskValue の部分のみ描画
        // passOpでステンシルをmaskValueにリセットし、後続の描画でもマスクが機能するようにする
        const stencilFillMaskedPipeline = this.device.createRenderPipeline({
            layout: "auto",
            vertex: {
                module: this.device.createShaderModule({
                    code: ShaderSource.getStencilFillVertexShader()
                }),
                entryPoint: "main",
                buffers: [vertexBufferLayout]
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
                    compare: "greater", // ステンシル値 > 参照値（maskValue）の部分のみ描画
                    failOp: "keep",
                    depthFailOp: "replace", // マスク値にリセット
                    passOp: "replace" // 描画後、ステンシルをmaskValueにリセット
                },
                stencilBack: {
                    compare: "greater",
                    failOp: "keep",
                    depthFailOp: "replace",
                    passOp: "replace"
                },
                stencilReadMask: 0xFF,
                stencilWriteMask: 0xFF // ステンシル書き込み有効（maskValueにリセット）
            }
        });
        this.pipelines.set("stencil_fill_masked", stencilFillMaskedPipeline);
    }

    /**
     * @description マスククリッピング用パイプラインを作成
     *              WebGL版: stencilMask(1 << level - 1) でビット単位のマスク
     *              ステンシル値を replace で書き込み、マスク領域を定義
     * @return {void}
     */
    private createClipPipeline(): void
    {
        // 17 floats per vertex: position(2) + bezier(2) + color(4) + matrix(3+3+3)
        const vertexBufferLayout: GPUVertexBufferLayout = {
            arrayStride: 17 * 4,
            attributes: [
                { shaderLocation: 0, offset: 0, format: "float32x2" },
                { shaderLocation: 1, offset: 2 * 4, format: "float32x2" },
                { shaderLocation: 2, offset: 4 * 4, format: "float32x4" },
                { shaderLocation: 3, offset: 8 * 4, format: "float32x3" },
                { shaderLocation: 4, offset: 11 * 4, format: "float32x3" },
                { shaderLocation: 5, offset: 14 * 4, format: "float32x3" }
            ]
        };

        // マスク書き込みパイプライン（ステンシル値を INVERT で書き込み）
        // WebGL版: gl.stencilOp(ZERO, INVERT, INVERT)
        // INVERT操作により、奇偶フィルルールでマスク形状を正しく処理
        const clipWritePipeline = this.device.createRenderPipeline({
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
                cullMode: "none"
            },
            depthStencil: {
                format: "stencil8",
                stencilFront: {
                    compare: "always",
                    failOp: "zero",    // WebGL: ZERO
                    depthFailOp: "invert", // WebGL: INVERT
                    passOp: "invert"   // WebGL: INVERT
                },
                stencilBack: {
                    compare: "always",
                    failOp: "zero",
                    depthFailOp: "invert",
                    passOp: "invert"
                },
                stencilReadMask: 0xFF,
                stencilWriteMask: 0xFF
            }
        });
        this.pipelines.set("clip_write", clipWritePipeline);

        // メインアタッチメント用マスク書き込みパイプライン（BGRA8Unorm等のデバイスフォーマット用）
        // Y軸反転シェーダーを使用（インスタンス描画と同じ座標系）
        // WebGL版と同様にINVERT操作を使用
        const clipWriteMainPipeline = this.device.createRenderPipeline({
            layout: "auto",
            vertex: {
                module: this.device.createShaderModule({
                    code: ShaderSource.getStencilWriteMainVertexShader()
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
                    format: this.format, // デバイスの推奨フォーマット（BGRA8Unorm等）
                    writeMask: 0 // カラー書き込み無効
                }]
            },
            primitive: {
                topology: "triangle-list",
                cullMode: "none"
            },
            depthStencil: {
                format: "stencil8",
                stencilFront: {
                    compare: "always",
                    failOp: "zero",    // WebGL: ZERO
                    depthFailOp: "invert", // WebGL: INVERT
                    passOp: "invert"   // WebGL: INVERT
                },
                stencilBack: {
                    compare: "always",
                    failOp: "zero",
                    depthFailOp: "invert",
                    passOp: "invert"
                },
                stencilReadMask: 0xFF,
                stencilWriteMask: 0xFF
            }
        });
        this.pipelines.set("clip_write_main", clipWriteMainPipeline);
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

        // キャンバス用パイプライン（bgra8unorm）- Y軸反転シェーダーを使用
        const vertexShaderModuleBGRA = this.device.createShaderModule({
            code: ShaderSource.getBasicMainVertexShader()
        });

        const pipelineBGRA = this.device.createRenderPipeline({
            layout: pipelineLayout,
            vertex: {
                module: vertexShaderModuleBGRA,
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
        this.pipelines.set("basic_bgra", pipelineBGRA); // キャンバス用（Y軸反転）
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

        // === マスク付きインスタンス描画パイプライン ===
        // ステンシルテスト: stencil != 0 の部分のみ描画（INVERT操作後の非ゼロ領域）
        const maskedPipeline = this.device.createRenderPipeline({
            layout: pipelineLayout,
            vertex: {
                module: vertexShaderModule,
                entryPoint: "main",
                buffers: [
                    // Vertex buffer
                    {
                        arrayStride: 4 * 4,
                        stepMode: "vertex",
                        attributes: [
                            { shaderLocation: 0, offset: 0, format: "float32x2" },
                            { shaderLocation: 1, offset: 2 * 4, format: "float32x2" }
                        ]
                    },
                    // Instance buffer
                    {
                        arrayStride: 4 * 24,
                        stepMode: "instance",
                        attributes: [
                            { shaderLocation: 2, offset: 0, format: "float32x4" },
                            { shaderLocation: 3, offset: 4 * 4, format: "float32x4" },
                            { shaderLocation: 4, offset: 8 * 4, format: "float32x4" },
                            { shaderLocation: 5, offset: 12 * 4, format: "float32x4" },
                            { shaderLocation: 6, offset: 16 * 4, format: "float32x4" },
                            { shaderLocation: 7, offset: 20 * 4, format: "float32x4" }
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
            },
            depthStencil: {
                format: "stencil8",
                stencilFront: {
                    compare: "not-equal", // ステンシル値 != 0 の部分のみ描画（マスク領域）
                    failOp: "keep",
                    depthFailOp: "keep",
                    passOp: "keep" // ステンシル値は変更しない
                },
                stencilBack: {
                    compare: "not-equal",
                    failOp: "keep",
                    depthFailOp: "keep",
                    passOp: "keep"
                },
                stencilReadMask: 0xFF,
                stencilWriteMask: 0x00 // 描画時はステンシル書き込み無効
            }
        });
        this.pipelines.set("instanced_masked", maskedPipeline);
    }

    /**
     * @description グラデーションフィル用パイプラインを作成
     *              17 floats頂点フォーマット + LUTテクスチャ
     * @return {void}
     */
    private createGradientPipeline(): void
    {
        // グラデーションフィル用バインドグループレイアウト
        const bindGroupLayout = this.device.createBindGroupLayout({
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
                    buffer: { type: "uniform" } // GradientUniforms
                },
                {
                    binding: 1,
                    visibility: GPUShaderStage.FRAGMENT,
                    sampler: {} // グラデーションLUTサンプラー
                },
                {
                    binding: 2,
                    visibility: GPUShaderStage.FRAGMENT,
                    texture: {} // グラデーションLUTテクスチャ
                }
            ]
        });

        this.bindGroupLayouts.set("gradient_fill", bindGroupLayout);

        const pipelineLayout = this.device.createPipelineLayout({
            bindGroupLayouts: [bindGroupLayout]
        });

        const vertexShaderModule = this.device.createShaderModule({
            code: ShaderSource.getGradientFillVertexShader()
        });

        const fragmentShaderModule = this.device.createShaderModule({
            code: ShaderSource.getGradientFillFragmentShader()
        });

        // 17 floats per vertex (fill用と同じ)
        const vertexBufferLayout: GPUVertexBufferLayout = {
            arrayStride: 17 * 4,
            attributes: [
                { shaderLocation: 0, offset: 0, format: "float32x2" },      // position
                { shaderLocation: 1, offset: 2 * 4, format: "float32x2" },  // bezier
                { shaderLocation: 2, offset: 4 * 4, format: "float32x4" },  // color
                { shaderLocation: 3, offset: 8 * 4, format: "float32x3" },  // matrix row 0
                { shaderLocation: 4, offset: 11 * 4, format: "float32x3" }, // matrix row 1
                { shaderLocation: 5, offset: 14 * 4, format: "float32x3" }  // matrix row 2
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

        // アトラステクスチャ用（rgba8unorm）- ステンシルなし
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

        // キャンバス用（bgra8unorm）- ステンシルなし
        // Y軸反転シェーダーを使用
        const vertexShaderModuleMain = this.device.createShaderModule({
            code: ShaderSource.getGradientFillMainVertexShader()
        });

        const pipelineBGRA = this.device.createRenderPipeline({
            layout: pipelineLayout,
            vertex: {
                module: vertexShaderModuleMain, // Y軸反転ありシェーダー
                entryPoint: "main",
                buffers: [vertexBufferLayout]
            },
            fragment: {
                module: fragmentShaderModule,
                entryPoint: "main",
                targets: [{
                    format: this.format,
                    blend: blendState
                }]
            },
            primitive: {
                topology: "triangle-list",
                cullMode: "none"
            }
            // Note: キャンバス描画時はステンシルバッファがないためdepthStencilは設定しない
        });

        this.pipelines.set("gradient_fill", pipelineRGBA);
        this.pipelines.set("gradient_fill_bgra", pipelineBGRA);

        // === アトラスのステンシル付きレンダーパス用 ===
        // 2パスステンシルフィルのレンダーパス内でgradientFillが呼ばれた場合に使用
        const pipelineRGBAStencil = this.device.createRenderPipeline({
            layout: pipelineLayout,
            vertex: {
                module: vertexShaderModule, // Y軸反転なしシェーダー
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
            },
            depthStencil: {
                format: "stencil8",
                stencilFront: {
                    compare: "always",
                    failOp: "keep",
                    depthFailOp: "keep",
                    passOp: "keep"
                },
                stencilBack: {
                    compare: "always",
                    failOp: "keep",
                    depthFailOp: "keep",
                    passOp: "keep"
                },
                stencilReadMask: 0x00,
                stencilWriteMask: 0x00
            }
        });
        this.pipelines.set("gradient_fill_stencil", pipelineRGBAStencil);

        // === メインアタッチメントのステンシル付きレンダーパス用 ===
        // マスクモード時に使用
        const pipelineBGRAStencil = this.device.createRenderPipeline({
            layout: pipelineLayout,
            vertex: {
                module: vertexShaderModuleMain, // Y軸反転ありシェーダー
                entryPoint: "main",
                buffers: [vertexBufferLayout]
            },
            fragment: {
                module: fragmentShaderModule,
                entryPoint: "main",
                targets: [{
                    format: this.format,
                    blend: blendState
                }]
            },
            primitive: {
                topology: "triangle-list",
                cullMode: "none"
            },
            depthStencil: {
                format: "stencil8",
                stencilFront: {
                    compare: "not-equal", // ステンシル値 != 0 の部分のみ描画（マスク領域）
                    failOp: "keep",
                    depthFailOp: "keep",
                    passOp: "keep"
                },
                stencilBack: {
                    compare: "not-equal",
                    failOp: "keep",
                    depthFailOp: "keep",
                    passOp: "keep"
                },
                stencilReadMask: 0xFF,
                stencilWriteMask: 0x00
            }
        });
        this.pipelines.set("gradient_fill_bgra_stencil", pipelineBGRAStencil);
    }

    /**
     * @description ビットマップ塗りつぶし用パイプラインを作成
     *              17 floats頂点フォーマット対応
     * @return {void}
     */
    private createBitmapFillPipeline(): void
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

        this.bindGroupLayouts.set("bitmap_fill", bindGroupLayout);

        const pipelineLayout = this.device.createPipelineLayout({
            bindGroupLayouts: [bindGroupLayout]
        });

        const vertexShaderModule = this.device.createShaderModule({
            code: ShaderSource.getBitmapFillVertexShader()
        });

        const fragmentShaderModule = this.device.createShaderModule({
            code: ShaderSource.getBitmapFillFragmentShader()
        });

        // 17 floats per vertex (fill用と同じ)
        const vertexBufferLayout: GPUVertexBufferLayout = {
            arrayStride: 17 * 4,
            attributes: [
                { shaderLocation: 0, offset: 0, format: "float32x2" },      // position
                { shaderLocation: 1, offset: 2 * 4, format: "float32x2" },  // bezier
                { shaderLocation: 2, offset: 4 * 4, format: "float32x4" },  // color
                { shaderLocation: 3, offset: 8 * 4, format: "float32x3" },  // matrix row 0
                { shaderLocation: 4, offset: 11 * 4, format: "float32x3" }, // matrix row 1
                { shaderLocation: 5, offset: 14 * 4, format: "float32x3" }  // matrix row 2
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

        // アトラステクスチャ用（rgba8unorm）- ステンシルなし
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

        // キャンバス用（bgra8unorm）- ステンシルなし
        // Y軸反転シェーダーを使用
        const vertexShaderModuleMain = this.device.createShaderModule({
            code: ShaderSource.getBitmapFillMainVertexShader()
        });

        const pipelineBGRA = this.device.createRenderPipeline({
            layout: pipelineLayout,
            vertex: {
                module: vertexShaderModuleMain, // Y軸反転ありシェーダー
                entryPoint: "main",
                buffers: [vertexBufferLayout]
            },
            fragment: {
                module: fragmentShaderModule,
                entryPoint: "main",
                targets: [{
                    format: this.format,
                    blend: blendState
                }]
            },
            primitive: {
                topology: "triangle-list",
                cullMode: "none"
            }
            // Note: キャンバス描画時はステンシルバッファがないためdepthStencilは設定しない
        });

        this.pipelines.set("bitmap_fill", pipelineRGBA);
        this.pipelines.set("bitmap_fill_bgra", pipelineBGRA);

        // === アトラスのステンシル付きレンダーパス用 ===
        // 2パスステンシルフィルのレンダーパス内でbitmapFillが呼ばれた場合に使用
        const pipelineRGBAStencil = this.device.createRenderPipeline({
            layout: pipelineLayout,
            vertex: {
                module: vertexShaderModule, // Y軸反転なしシェーダー
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
            },
            depthStencil: {
                format: "stencil8",
                stencilFront: {
                    compare: "always",
                    failOp: "keep",
                    depthFailOp: "keep",
                    passOp: "keep"
                },
                stencilBack: {
                    compare: "always",
                    failOp: "keep",
                    depthFailOp: "keep",
                    passOp: "keep"
                },
                stencilReadMask: 0x00,
                stencilWriteMask: 0x00
            }
        });
        this.pipelines.set("bitmap_fill_stencil", pipelineRGBAStencil);

        // === メインアタッチメントのステンシル付きレンダーパス用 ===
        // マスクモード時に使用
        const pipelineBGRAStencil = this.device.createRenderPipeline({
            layout: pipelineLayout,
            vertex: {
                module: vertexShaderModuleMain, // Y軸反転ありシェーダー
                entryPoint: "main",
                buffers: [vertexBufferLayout]
            },
            fragment: {
                module: fragmentShaderModule,
                entryPoint: "main",
                targets: [{
                    format: this.format,
                    blend: blendState
                }]
            },
            primitive: {
                topology: "triangle-list",
                cullMode: "none"
            },
            depthStencil: {
                format: "stencil8",
                stencilFront: {
                    compare: "not-equal", // ステンシル値 != 0 の部分のみ描画（マスク領域）
                    failOp: "keep",
                    depthFailOp: "keep",
                    passOp: "keep"
                },
                stencilBack: {
                    compare: "not-equal",
                    failOp: "keep",
                    depthFailOp: "keep",
                    passOp: "keep"
                },
                stencilReadMask: 0xFF,
                stencilWriteMask: 0x00
            }
        });
        this.pipelines.set("bitmap_fill_bgra_stencil", pipelineBGRAStencil);
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
     * @description ブラーフィルター用パイプラインを作成
     *              動的にhalf_blur値に応じたシェーダーを生成
     * @return {void}
     */
    private createBlurFilterPipeline(): void
    {
        const bindGroupLayout = this.device.createBindGroupLayout({
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.FRAGMENT,
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

        this.bindGroupLayouts.set("blur_filter", bindGroupLayout);

        // 一般的なブラー値用のパイプラインを事前に作成（halfBlur = 1〜16）
        const vertexShaderModule = this.device.createShaderModule({
            code: ShaderSource.getBlurFilterVertexShader()
        });

        const pipelineLayout = this.device.createPipelineLayout({
            bindGroupLayouts: [bindGroupLayout]
        });

        for (let halfBlur = 1; halfBlur <= 16; halfBlur++) {
            const fragmentShaderModule = this.device.createShaderModule({
                code: ShaderSource.getBlurFilterFragmentShader(halfBlur)
            });

            const pipeline = this.device.createRenderPipeline({
                layout: pipelineLayout,
                vertex: {
                    module: vertexShaderModule,
                    entryPoint: "main",
                    buffers: [] // フルスクリーンクワッドなので頂点バッファ不要
                },
                fragment: {
                    module: fragmentShaderModule,
                    entryPoint: "main",
                    targets: [{
                        format: "rgba8unorm",
                        blend: {
                            color: {
                                srcFactor: "one",
                                dstFactor: "zero",
                                operation: "add"
                            },
                            alpha: {
                                srcFactor: "one",
                                dstFactor: "zero",
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

            this.pipelines.set(`blur_filter_${halfBlur}`, pipeline);
        }
    }

    /**
     * @description テクスチャコピー用パイプラインを作成
     *              フィルター処理間のテクスチャ転送に使用
     * @return {void}
     */
    private createTextureCopyPipeline(): void
    {
        const bindGroupLayout = this.device.createBindGroupLayout({
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.FRAGMENT,
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

        this.bindGroupLayouts.set("texture_copy", bindGroupLayout);

        const pipelineLayout = this.device.createPipelineLayout({
            bindGroupLayouts: [bindGroupLayout]
        });

        const vertexShaderModule = this.device.createShaderModule({
            code: ShaderSource.getBlurFilterVertexShader() // 同じフルスクリーンクワッド
        });

        const fragmentShaderModule = this.device.createShaderModule({
            code: ShaderSource.getTextureCopyFragmentShader()
        });

        const pipeline = this.device.createRenderPipeline({
            layout: pipelineLayout,
            vertex: {
                module: vertexShaderModule,
                entryPoint: "main",
                buffers: []
            },
            fragment: {
                module: fragmentShaderModule,
                entryPoint: "main",
                targets: [{
                    format: "rgba8unorm",
                    blend: {
                        color: {
                            srcFactor: "one",
                            dstFactor: "zero",
                            operation: "add"
                        },
                        alpha: {
                            srcFactor: "one",
                            dstFactor: "zero",
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

        this.pipelines.set("texture_copy", pipeline);

        // スワップチェーン用（bgra8unorm）
        const pipelineBGRA = this.device.createRenderPipeline({
            layout: pipelineLayout,
            vertex: {
                module: vertexShaderModule,
                entryPoint: "main",
                buffers: []
            },
            fragment: {
                module: fragmentShaderModule,
                entryPoint: "main",
                targets: [{
                    format: this.format,
                    blend: {
                        color: {
                            srcFactor: "one",
                            dstFactor: "zero",
                            operation: "add"
                        },
                        alpha: {
                            srcFactor: "one",
                            dstFactor: "zero",
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
        this.pipelines.set("texture_copy_bgra", pipelineBGRA);
    }

    /**
     * @description カラーマトリックスフィルター用パイプラインを作成
     * @return {void}
     */
    private createColorMatrixFilterPipeline(): void
    {
        const bindGroupLayout = this.device.createBindGroupLayout({
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.FRAGMENT,
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

        this.bindGroupLayouts.set("color_matrix_filter", bindGroupLayout);

        const pipelineLayout = this.device.createPipelineLayout({
            bindGroupLayouts: [bindGroupLayout]
        });

        const vertexShaderModule = this.device.createShaderModule({
            code: ShaderSource.getBlurFilterVertexShader() // 同じフルスクリーンクワッド
        });

        const fragmentShaderModule = this.device.createShaderModule({
            code: ShaderSource.getColorMatrixFilterFragmentShader()
        });

        const pipeline = this.device.createRenderPipeline({
            layout: pipelineLayout,
            vertex: {
                module: vertexShaderModule,
                entryPoint: "main",
                buffers: []
            },
            fragment: {
                module: fragmentShaderModule,
                entryPoint: "main",
                targets: [{
                    format: "rgba8unorm",
                    blend: {
                        color: {
                            srcFactor: "one",
                            dstFactor: "zero",
                            operation: "add"
                        },
                        alpha: {
                            srcFactor: "one",
                            dstFactor: "zero",
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

        this.pipelines.set("color_matrix_filter", pipeline);
    }

    /**
     * @description グローフィルター用パイプラインを作成
     * @return {void}
     */
    private createGlowFilterPipeline(): void
    {
        const bindGroupLayout = this.device.createBindGroupLayout({
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.FRAGMENT,
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
                },
                {
                    binding: 3,
                    visibility: GPUShaderStage.FRAGMENT,
                    texture: {}
                }
            ]
        });

        this.bindGroupLayouts.set("glow_filter", bindGroupLayout);

        const pipelineLayout = this.device.createPipelineLayout({
            bindGroupLayouts: [bindGroupLayout]
        });

        const vertexShaderModule = this.device.createShaderModule({
            code: ShaderSource.getBlurFilterVertexShader()
        });

        const fragmentShaderModule = this.device.createShaderModule({
            code: ShaderSource.getGlowFilterFragmentShader()
        });

        const pipeline = this.device.createRenderPipeline({
            layout: pipelineLayout,
            vertex: {
                module: vertexShaderModule,
                entryPoint: "main",
                buffers: []
            },
            fragment: {
                module: fragmentShaderModule,
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
            }
        });

        this.pipelines.set("glow_filter", pipeline);
    }

    /**
     * @description ドロップシャドウフィルター用パイプラインを作成
     * @return {void}
     */
    private createDropShadowFilterPipeline(): void
    {
        const bindGroupLayout = this.device.createBindGroupLayout({
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.FRAGMENT,
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
                },
                {
                    binding: 3,
                    visibility: GPUShaderStage.FRAGMENT,
                    texture: {}
                }
            ]
        });

        this.bindGroupLayouts.set("drop_shadow_filter", bindGroupLayout);

        const pipelineLayout = this.device.createPipelineLayout({
            bindGroupLayouts: [bindGroupLayout]
        });

        const vertexShaderModule = this.device.createShaderModule({
            code: ShaderSource.getBlurFilterVertexShader()
        });

        const fragmentShaderModule = this.device.createShaderModule({
            code: ShaderSource.getDropShadowFilterFragmentShader()
        });

        const pipeline = this.device.createRenderPipeline({
            layout: pipelineLayout,
            vertex: {
                module: vertexShaderModule,
                entryPoint: "main",
                buffers: []
            },
            fragment: {
                module: fragmentShaderModule,
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
            }
        });

        this.pipelines.set("drop_shadow_filter", pipeline);
    }

    /**
     * @description ベベルフィルター用パイプラインを作成
     * @return {void}
     */
    private createBevelFilterPipeline(): void
    {
        const bindGroupLayout = this.device.createBindGroupLayout({
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.FRAGMENT,
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
                },
                {
                    binding: 3,
                    visibility: GPUShaderStage.FRAGMENT,
                    texture: {}
                }
            ]
        });

        this.bindGroupLayouts.set("bevel_filter", bindGroupLayout);

        const pipelineLayout = this.device.createPipelineLayout({
            bindGroupLayouts: [bindGroupLayout]
        });

        const vertexShaderModule = this.device.createShaderModule({
            code: ShaderSource.getBlurFilterVertexShader()
        });

        const fragmentShaderModule = this.device.createShaderModule({
            code: ShaderSource.getBevelFilterFragmentShader()
        });

        const pipeline = this.device.createRenderPipeline({
            layout: pipelineLayout,
            vertex: {
                module: vertexShaderModule,
                entryPoint: "main",
                buffers: []
            },
            fragment: {
                module: fragmentShaderModule,
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
            }
        });

        this.pipelines.set("bevel_filter", pipeline);
    }

    /**
     * @description グラデーショングローフィルター用パイプラインを作成
     * @return {void}
     */
    private createGradientGlowFilterPipeline(): void
    {
        const bindGroupLayout = this.device.createBindGroupLayout({
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.FRAGMENT,
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
                },
                {
                    binding: 3,
                    visibility: GPUShaderStage.FRAGMENT,
                    texture: {}
                },
                {
                    binding: 4,
                    visibility: GPUShaderStage.FRAGMENT,
                    texture: {}
                }
            ]
        });

        this.bindGroupLayouts.set("gradient_glow_filter", bindGroupLayout);

        const pipelineLayout = this.device.createPipelineLayout({
            bindGroupLayouts: [bindGroupLayout]
        });

        const vertexShaderModule = this.device.createShaderModule({
            code: ShaderSource.getBlurFilterVertexShader()
        });

        const fragmentShaderModule = this.device.createShaderModule({
            code: ShaderSource.getGradientGlowFilterFragmentShader()
        });

        const pipeline = this.device.createRenderPipeline({
            layout: pipelineLayout,
            vertex: {
                module: vertexShaderModule,
                entryPoint: "main",
                buffers: []
            },
            fragment: {
                module: fragmentShaderModule,
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
            }
        });

        this.pipelines.set("gradient_glow_filter", pipeline);
    }

    /**
     * @description グラデーションベベルフィルター用パイプラインを作成
     * @return {void}
     */
    private createGradientBevelFilterPipeline(): void
    {
        const bindGroupLayout = this.device.createBindGroupLayout({
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.FRAGMENT,
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
                },
                {
                    binding: 3,
                    visibility: GPUShaderStage.FRAGMENT,
                    texture: {}
                },
                {
                    binding: 4,
                    visibility: GPUShaderStage.FRAGMENT,
                    texture: {}
                }
            ]
        });

        this.bindGroupLayouts.set("gradient_bevel_filter", bindGroupLayout);

        const pipelineLayout = this.device.createPipelineLayout({
            bindGroupLayouts: [bindGroupLayout]
        });

        const vertexShaderModule = this.device.createShaderModule({
            code: ShaderSource.getBlurFilterVertexShader()
        });

        const fragmentShaderModule = this.device.createShaderModule({
            code: ShaderSource.getGradientBevelFilterFragmentShader()
        });

        const pipeline = this.device.createRenderPipeline({
            layout: pipelineLayout,
            vertex: {
                module: vertexShaderModule,
                entryPoint: "main",
                buffers: []
            },
            fragment: {
                module: fragmentShaderModule,
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
            }
        });

        this.pipelines.set("gradient_bevel_filter", pipeline);
    }

    /**
     * @description 複雑なブレンドモード用パイプラインを作成
     *              subtract, multiply, lighten, darken, overlay, hardlight, difference, invert
     * @return {void}
     */
    private createComplexBlendPipelines(): void
    {
        const bindGroupLayout = this.device.createBindGroupLayout({
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.FRAGMENT,
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
                },
                {
                    binding: 3,
                    visibility: GPUShaderStage.FRAGMENT,
                    texture: {}
                }
            ]
        });

        this.bindGroupLayouts.set("complex_blend", bindGroupLayout);

        const pipelineLayout = this.device.createPipelineLayout({
            bindGroupLayouts: [bindGroupLayout]
        });

        const vertexShaderModule = this.device.createShaderModule({
            code: ShaderSource.getBlurFilterVertexShader() // フルスクリーンクワッド
        });

        const blendModes = [
            "subtract",
            "multiply",
            "lighten",
            "darken",
            "overlay",
            "hardlight",
            "difference",
            "invert"
        ];

        for (const blendMode of blendModes) {
            const fragmentShaderModule = this.device.createShaderModule({
                code: ShaderSource.getComplexBlendFragmentShader(blendMode)
            });

            const pipeline = this.device.createRenderPipeline({
                layout: pipelineLayout,
                vertex: {
                    module: vertexShaderModule,
                    entryPoint: "main",
                    buffers: []
                },
                fragment: {
                    module: fragmentShaderModule,
                    entryPoint: "main",
                    targets: [{
                        format: this.format,
                        blend: {
                            color: {
                                srcFactor: "one",
                                dstFactor: "zero",
                                operation: "add"
                            },
                            alpha: {
                                srcFactor: "one",
                                dstFactor: "zero",
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

            this.pipelines.set(`complex_blend_${blendMode}`, pipeline);
        }
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
