import { ShaderSource } from "./ShaderSource";
import { $samples } from "../WebGPUUtil";

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
    private sampleCount: number;

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
        this.sampleCount = $samples;

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
        this.createMaskUnionPipelines(); // ネストされたマスク用
        this.createMaskPipeline();
        this.createBasicPipeline();
        this.createTexturePipeline();
        this.createInstancedPipeline();
        this.createGradientPipeline();
        this.createBitmapFillPipeline(); // ビットマップ塗りつぶし用
        this.createBlendPipeline();
        this.createBlurFilterPipeline(); // ブラーフィルター用
        this.createTextureCopyPipeline(); // テクスチャコピー用
        this.createBitmapSyncPipeline(); // Bitmap同期用（MSAA対応）
        this.createColorMatrixFilterPipeline(); // カラーマトリックスフィルター用
        this.createGlowFilterPipeline(); // グローフィルター用
        this.createDropShadowFilterPipeline(); // ドロップシャドウフィルター用
        this.createBevelFilterPipeline(); // ベベルフィルター用
        this.createGradientGlowFilterPipeline(); // グラデーショングローフィルター用
        this.createGradientBevelFilterPipeline(); // グラデーションベベルフィルター用
        this.createComplexBlendPipelines(); // 複雑なブレンドモード用
        this.createNodeClearPipeline(); // ノードクリア用
    }

    /**
     * @description 単色塗りつぶし用パイプラインを作成（Loop-Blinn対応・17 floats頂点フォーマット）
     *              アトラステクスチャ（rgba8unorm）とキャンバス（bgra8unorm）の両方に対応
     * @return {void}
     */
    private createFillPipeline(): void
    {
        const bindGroupLayout = this.device.createBindGroupLayout({
            "entries": [
                {
                    "binding": 0,
                    "visibility": GPUShaderStage.VERTEX,
                    "buffer": { "type": "uniform" }
                }
            ]
        });

        this.bindGroupLayouts.set("fill", bindGroupLayout);

        const pipelineLayout = this.device.createPipelineLayout({
            "bindGroupLayouts": [bindGroupLayout]
        });

        const vertexShaderModule = this.device.createShaderModule({
            "code": ShaderSource.getFillVertexShader()
        });

        const fragmentShaderModule = this.device.createShaderModule({
            "code": ShaderSource.getFillFragmentShader()
        });

        // 17 floats per vertex: position(2) + bezier(2) + color(4) + matrix(3+3+3)
        const vertexBufferLayout: GPUVertexBufferLayout = {
            "arrayStride": 17 * 4, // 17 floats (68 bytes)
            "attributes": [
                {
                    "shaderLocation": 0,
                    "offset": 0,
                    "format": "float32x2" // position (2 floats)
                },
                {
                    "shaderLocation": 1,
                    "offset": 2 * 4,
                    "format": "float32x2" // bezier (2 floats)
                },
                {
                    "shaderLocation": 2,
                    "offset": 4 * 4,
                    "format": "float32x4" // color (4 floats)
                },
                {
                    "shaderLocation": 3,
                    "offset": 8 * 4,
                    "format": "float32x3" // matrix row 0 (3 floats)
                },
                {
                    "shaderLocation": 4,
                    "offset": 11 * 4,
                    "format": "float32x3" // matrix row 1 (3 floats)
                },
                {
                    "shaderLocation": 5,
                    "offset": 14 * 4,
                    "format": "float32x3" // matrix row 2 (3 floats)
                }
            ]
        };

        const blendState: GPUBlendState = {
            "color": {
                "srcFactor": "one",
                "dstFactor": "one-minus-src-alpha",
                "operation": "add"
            },
            "alpha": {
                "srcFactor": "one",
                "dstFactor": "one-minus-src-alpha",
                "operation": "add"
            }
        };

        // アトラステクスチャ用パイプライン（rgba8unorm）- MSAA対応
        // ステンシル付きレンダーパスと互換性を持たせるためdepthStencilを追加
        const pipelineRGBA = this.device.createRenderPipeline({
            "layout": pipelineLayout,
            "vertex": {
                "module": vertexShaderModule,
                "entryPoint": "main",
                "buffers": [vertexBufferLayout]
            },
            "fragment": {
                "module": fragmentShaderModule,
                "entryPoint": "main",
                "targets": [{
                    "format": "rgba8unorm",
                    "blend": blendState
                }]
            },
            "primitive": {
                "topology": "triangle-list",
                "cullMode": "none"
            },
            "depthStencil": {
                "format": "stencil8",
                "stencilFront": {
                    "compare": "always",
                    "failOp": "keep",
                    "depthFailOp": "keep",
                    "passOp": "keep"
                },
                "stencilBack": {
                    "compare": "always",
                    "failOp": "keep",
                    "depthFailOp": "keep",
                    "passOp": "keep"
                },
                "stencilReadMask": 0x00,
                "stencilWriteMask": 0x00
            },
            "multisample": {
                "count": this.sampleCount,
                "alphaToCoverageEnabled": true // WebGL版のSAMPLE_ALPHA_TO_COVERAGEに相当
            }
        });

        // キャンバス用パイプライン（bgra8unorm）- Y軸反転シェーダーを使用
        const vertexShaderModuleMain = this.device.createShaderModule({
            "code": ShaderSource.getFillMainVertexShader()
        });

        const pipelineBGRA = this.device.createRenderPipeline({
            "layout": pipelineLayout,
            "vertex": {
                "module": vertexShaderModuleMain, // Y軸反転ありシェーダー
                "entryPoint": "main",
                "buffers": [vertexBufferLayout]
            },
            "fragment": {
                "module": fragmentShaderModule,
                "entryPoint": "main",
                "targets": [{
                    "format": this.format, // 通常はbgra8unorm
                    "blend": blendState
                }]
            },
            "primitive": {
                "topology": "triangle-list",
                "cullMode": "none"
            },
            "multisample": {
                "count": this.sampleCount,
                "alphaToCoverageEnabled": true // WebGL版のSAMPLE_ALPHA_TO_COVERAGEに相当
            }
        });

        this.pipelines.set("fill", pipelineRGBA);      // アトラス用（デフォルト）
        this.pipelines.set("fill_bgra", pipelineBGRA); // キャンバス用

        // === メインアタッチメントのステンシル付きレンダーパス用 ===
        // マスクモード時に使用（ステンシルテスト: equal で累積マスク値と一致する領域のみ描画）
        // WebGL版: stencilFunc(EQUAL, mask & 0xff, mask)
        const pipelineBGRAStencil = this.device.createRenderPipeline({
            "layout": pipelineLayout,
            "vertex": {
                "module": vertexShaderModuleMain, // Y軸反転ありシェーダー
                "entryPoint": "main",
                "buffers": [vertexBufferLayout]
            },
            "fragment": {
                "module": fragmentShaderModule,
                "entryPoint": "main",
                "targets": [{
                    "format": this.format,
                    "blend": blendState
                }]
            },
            "primitive": {
                "topology": "triangle-list",
                "cullMode": "none"
            },
            "depthStencil": {
                "format": "stencil8",
                "stencilFront": {
                    "compare": "equal", // ステンシル値 == 参照値（累積マスク値）の部分のみ描画
                    "failOp": "keep",
                    "depthFailOp": "keep",
                    "passOp": "keep" // ステンシル値は変更しない
                },
                "stencilBack": {
                    "compare": "equal",
                    "failOp": "keep",
                    "depthFailOp": "keep",
                    "passOp": "keep"
                },
                "stencilReadMask": 0xFF,
                "stencilWriteMask": 0x00
            },
            "multisample": {
                "count": this.sampleCount,
                "alphaToCoverageEnabled": true // WebGL版のSAMPLE_ALPHA_TO_COVERAGEに相当
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
            "arrayStride": 17 * 4, // 17 floats (68 bytes)
            "attributes": [
                {
                    "shaderLocation": 0,
                    "offset": 0,
                    "format": "float32x2" // position (2 floats)
                },
                {
                    "shaderLocation": 1,
                    "offset": 2 * 4,
                    "format": "float32x2" // bezier (2 floats)
                },
                {
                    "shaderLocation": 2,
                    "offset": 4 * 4,
                    "format": "float32x4" // color (4 floats)
                },
                {
                    "shaderLocation": 3,
                    "offset": 8 * 4,
                    "format": "float32x3" // matrix row 0 (3 floats)
                },
                {
                    "shaderLocation": 4,
                    "offset": 11 * 4,
                    "format": "float32x3" // matrix row 1 (3 floats)
                },
                {
                    "shaderLocation": 5,
                    "offset": 14 * 4,
                    "format": "float32x3" // matrix row 2 (3 floats)
                }
            ]
        };

        // === Pass 1: ステンシル書き込み（WebGL版と同じ: 両面を1回の描画で処理） ===
        // Front面: INCR_WRAP, Back面: DECR_WRAP
        // cullMode: none で両面を描画
        const stencilWritePipeline = this.device.createRenderPipeline({
            "layout": "auto",
            "vertex": {
                "module": this.device.createShaderModule({
                    "code": ShaderSource.getStencilWriteVertexShader()
                }),
                "entryPoint": "main",
                "buffers": [vertexBufferLayout]
            },
            "fragment": {
                "module": this.device.createShaderModule({
                    "code": ShaderSource.getStencilWriteFragmentShader()
                }),
                "entryPoint": "main",
                "targets": [{
                    "format": "rgba8unorm",
                    "writeMask": 0 // カラー書き込み無効（alphaToCoverageはアルファ値を読み取るのみ）
                }]
            },
            "primitive": {
                "topology": "triangle-list",
                "cullMode": "none", // 両面を描画
                "frontFace": "ccw"
            },
            "depthStencil": {
                "format": "stencil8",
                "stencilFront": {
                    "compare": "always",
                    "failOp": "keep",
                    "depthFailOp": "keep",
                    "passOp": "increment-wrap" // Front面（CCW）でインクリメント
                },
                "stencilBack": {
                    "compare": "always",
                    "failOp": "keep",
                    "depthFailOp": "keep",
                    "passOp": "decrement-wrap" // Back面（CW）でデクリメント
                },
                "stencilReadMask": 0xFF,
                "stencilWriteMask": 0xFF
            },
            "multisample": {
                "count": this.sampleCount,
                "alphaToCoverageEnabled": true // WebGL版のSAMPLE_ALPHA_TO_COVERAGEに相当
            }
        });
        this.pipelines.set("stencil_write", stencilWritePipeline);

        // === Pass 2: ステンシルフィル（色描画） ===
        // WebGL版と同じ: stencilFunc(NOTEQUAL, 0) + stencilOp(KEEP, ZERO, ZERO)
        // WebGL版と同じく頂点バッファを使用（同じメッシュデータ）
        const stencilFillPipeline = this.device.createRenderPipeline({
            "layout": "auto",
            "vertex": {
                "module": this.device.createShaderModule({
                    "code": ShaderSource.getStencilFillVertexShader()
                }),
                "entryPoint": "main",
                "buffers": [vertexBufferLayout] // Pass 1と同じ頂点バッファを使用
            },
            "fragment": {
                "module": this.device.createShaderModule({
                    "code": ShaderSource.getStencilFillFragmentShader()
                }),
                "entryPoint": "main",
                "targets": [{
                    "format": "rgba8unorm",
                    "blend": {
                        "color": {
                            "srcFactor": "one",
                            "dstFactor": "one-minus-src-alpha",
                            "operation": "add"
                        },
                        "alpha": {
                            "srcFactor": "one",
                            "dstFactor": "one-minus-src-alpha",
                            "operation": "add"
                        }
                    }
                }]
            },
            "primitive": {
                "topology": "triangle-list",
                "cullMode": "none"
            },
            "depthStencil": {
                "format": "stencil8",
                "stencilFront": {
                    "compare": "not-equal", // ステンシル値 != 0 の部分に描画
                    "failOp": "keep",
                    "depthFailOp": "zero", // WebGL: ZERO
                    "passOp": "zero" // WebGL: ZERO - 描画後にステンシルをクリア
                },
                "stencilBack": {
                    "compare": "not-equal",
                    "failOp": "keep",
                    "depthFailOp": "zero",
                    "passOp": "zero"
                },
                "stencilReadMask": 0xFF,
                "stencilWriteMask": 0xFF
            },
            "multisample": {
                "count": this.sampleCount
            }
        });
        this.pipelines.set("stencil_fill", stencilFillPipeline);

        // === アトラス用（非MSAA、sampleCount: 1） ===
        // アトラスはMSAAを使用しないことがあるため、sampleCount: 1 のパイプラインを作成
        const stencilWritePipelineAtlas = this.device.createRenderPipeline({
            "layout": "auto",
            "vertex": {
                "module": this.device.createShaderModule({
                    "code": ShaderSource.getStencilWriteVertexShader()
                }),
                "entryPoint": "main",
                "buffers": [vertexBufferLayout]
            },
            "fragment": {
                "module": this.device.createShaderModule({
                    "code": ShaderSource.getStencilWriteFragmentShader()
                }),
                "entryPoint": "main",
                "targets": [{
                    "format": "rgba8unorm",
                    "writeMask": 0 // カラー書き込み無効（alphaToCoverageはアルファ値を読み取るのみ）
                }]
            },
            "primitive": {
                "topology": "triangle-list",
                "cullMode": "none",
                "frontFace": "ccw"
            },
            "depthStencil": {
                "format": "stencil8",
                "stencilFront": {
                    "compare": "always",
                    "failOp": "keep",
                    "depthFailOp": "keep",
                    "passOp": "increment-wrap"
                },
                "stencilBack": {
                    "compare": "always",
                    "failOp": "keep",
                    "depthFailOp": "keep",
                    "passOp": "decrement-wrap"
                },
                "stencilReadMask": 0xFF,
                "stencilWriteMask": 0xFF
            },
            "multisample": {
                "count": this.sampleCount,
                "alphaToCoverageEnabled": true // WebGL版のSAMPLE_ALPHA_TO_COVERAGEに相当
            }
        });
        this.pipelines.set("stencil_write_atlas", stencilWritePipelineAtlas);

        // === メインキャンバス用ステンシル書き込み（bgra8unorm、Y軸反転あり） ===
        // 中抜き描画（hollow shape）のPass 1で使用
        const stencilWritePipelineMain = this.device.createRenderPipeline({
            "layout": "auto",
            "vertex": {
                "module": this.device.createShaderModule({
                    "code": ShaderSource.getStencilWriteMainVertexShader() // Y軸反転あり
                }),
                "entryPoint": "main",
                "buffers": [vertexBufferLayout]
            },
            "fragment": {
                "module": this.device.createShaderModule({
                    "code": ShaderSource.getStencilWriteFragmentShader()
                }),
                "entryPoint": "main",
                "targets": [{
                    "format": this.format, // bgra8unorm
                    "writeMask": 0
                }]
            },
            "primitive": {
                "topology": "triangle-list",
                "cullMode": "none",
                "frontFace": "ccw"
            },
            "depthStencil": {
                "format": "stencil8",
                "stencilFront": {
                    "compare": "always",
                    "failOp": "keep",
                    "depthFailOp": "keep",
                    "passOp": "increment-wrap"
                },
                "stencilBack": {
                    "compare": "always",
                    "failOp": "keep",
                    "depthFailOp": "keep",
                    "passOp": "decrement-wrap"
                },
                "stencilReadMask": 0xFF,
                "stencilWriteMask": 0xFF
            },
            "multisample": {
                "count": this.sampleCount,
                "alphaToCoverageEnabled": true // WebGL版のSAMPLE_ALPHA_TO_COVERAGEに相当
            }
        });
        this.pipelines.set("stencil_write_main", stencilWritePipelineMain);

        const stencilFillPipelineAtlas = this.device.createRenderPipeline({
            "layout": "auto",
            "vertex": {
                "module": this.device.createShaderModule({
                    "code": ShaderSource.getStencilFillVertexShader()
                }),
                "entryPoint": "main",
                "buffers": [vertexBufferLayout]
            },
            "fragment": {
                "module": this.device.createShaderModule({
                    "code": ShaderSource.getStencilFillFragmentShader()
                }),
                "entryPoint": "main",
                "targets": [{
                    "format": "rgba8unorm",
                    "blend": {
                        "color": {
                            "srcFactor": "one",
                            "dstFactor": "one-minus-src-alpha",
                            "operation": "add"
                        },
                        "alpha": {
                            // アルファは max(src, dst) で最大値を取る
                            // これにより、半透明Shapeのアルファが背景に上書きされずに保持される
                            "srcFactor": "one",
                            "dstFactor": "one",
                            "operation": "max"
                        }
                    }
                }]
            },
            "primitive": {
                "topology": "triangle-list",
                "cullMode": "none"
            },
            "depthStencil": {
                "format": "stencil8",
                "stencilFront": {
                    "compare": "not-equal",
                    "failOp": "keep",
                    "depthFailOp": "zero",
                    "passOp": "zero"
                },
                "stencilBack": {
                    "compare": "not-equal",
                    "failOp": "keep",
                    "depthFailOp": "zero",
                    "passOp": "zero"
                },
                "stencilReadMask": 0xFF,
                "stencilWriteMask": 0xFF
            },
            "multisample": {
                "count": this.sampleCount
            }
        });
        this.pipelines.set("stencil_fill_atlas", stencilFillPipelineAtlas);

        // === メインキャンバス用ステンシルフィル（bgra8unorm、Y軸反転あり） ===
        // 中抜き描画（hollow shape）のPass 2で使用
        const stencilFillPipelineMain = this.device.createRenderPipeline({
            "layout": "auto",
            "vertex": {
                "module": this.device.createShaderModule({
                    "code": ShaderSource.getStencilFillMainVertexShader() // Y軸反転あり
                }),
                "entryPoint": "main",
                "buffers": [vertexBufferLayout]
            },
            "fragment": {
                "module": this.device.createShaderModule({
                    "code": ShaderSource.getStencilFillFragmentShader()
                }),
                "entryPoint": "main",
                "targets": [{
                    "format": this.format, // bgra8unorm
                    "blend": {
                        "color": {
                            "srcFactor": "one",
                            "dstFactor": "one-minus-src-alpha",
                            "operation": "add"
                        },
                        "alpha": {
                            "srcFactor": "one",
                            "dstFactor": "one",
                            "operation": "max"
                        }
                    }
                }]
            },
            "primitive": {
                "topology": "triangle-list",
                "cullMode": "none"
            },
            "depthStencil": {
                "format": "stencil8",
                "stencilFront": {
                    "compare": "not-equal",
                    "failOp": "keep",
                    "depthFailOp": "zero",
                    "passOp": "zero"
                },
                "stencilBack": {
                    "compare": "not-equal",
                    "failOp": "keep",
                    "depthFailOp": "zero",
                    "passOp": "zero"
                },
                "stencilReadMask": 0xFF,
                "stencilWriteMask": 0xFF
            },
            "multisample": {
                "count": this.sampleCount
            }
        });
        this.pipelines.set("stencil_fill_main", stencilFillPipelineMain);

        // === Pass 2 (Masked): マスク領域内のみ描画 ===
        // マスクモード時の2パスフィル:
        // 1. clip_writeでマスク領域にmaskValue(例:1)を書き込み済み
        // 2. stencil_writeでINCR/DECRを実行（奇数カバレッジ: maskValue+1, 偶数: maskValue）
        // 3. このパイプラインで stencil > maskValue の部分のみ描画
        // passOpでステンシルをmaskValueにリセットし、後続の描画でもマスクが機能するようにする
        const stencilFillMaskedPipeline = this.device.createRenderPipeline({
            "layout": "auto",
            "vertex": {
                "module": this.device.createShaderModule({
                    "code": ShaderSource.getStencilFillVertexShader()
                }),
                "entryPoint": "main",
                "buffers": [vertexBufferLayout]
            },
            "fragment": {
                "module": this.device.createShaderModule({
                    "code": ShaderSource.getStencilFillFragmentShader()
                }),
                "entryPoint": "main",
                "targets": [{
                    "format": "rgba8unorm",
                    "blend": {
                        "color": {
                            "srcFactor": "one",
                            "dstFactor": "one-minus-src-alpha",
                            "operation": "add"
                        },
                        "alpha": {
                            "srcFactor": "one",
                            "dstFactor": "one-minus-src-alpha",
                            "operation": "add"
                        }
                    }
                }]
            },
            "primitive": {
                "topology": "triangle-list",
                "cullMode": "none"
            },
            "depthStencil": {
                "format": "stencil8",
                "stencilFront": {
                    "compare": "greater", // ステンシル値 > 参照値（maskValue）の部分のみ描画
                    "failOp": "keep",
                    "depthFailOp": "replace", // マスク値にリセット
                    "passOp": "replace" // 描画後、ステンシルをmaskValueにリセット
                },
                "stencilBack": {
                    "compare": "greater",
                    "failOp": "keep",
                    "depthFailOp": "replace",
                    "passOp": "replace"
                },
                "stencilReadMask": 0xFF,
                "stencilWriteMask": 0xFF // ステンシル書き込み有効（maskValueにリセット）
            },
            "multisample": {
                "count": this.sampleCount
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
            "arrayStride": 17 * 4,
            "attributes": [
                { "shaderLocation": 0, "offset": 0, "format": "float32x2" },
                { "shaderLocation": 1, "offset": 2 * 4, "format": "float32x2" },
                { "shaderLocation": 2, "offset": 4 * 4, "format": "float32x4" },
                { "shaderLocation": 3, "offset": 8 * 4, "format": "float32x3" },
                { "shaderLocation": 4, "offset": 11 * 4, "format": "float32x3" },
                { "shaderLocation": 5, "offset": 14 * 4, "format": "float32x3" }
            ]
        };

        // マスク書き込みパイプライン（ステンシル値を INVERT で書き込み）
        // WebGL版: gl.stencilOp(ZERO, INVERT, INVERT)
        // INVERT操作により、奇偶フィルルールでマスク形状を正しく処理
        const clipWritePipeline = this.device.createRenderPipeline({
            "layout": "auto",
            "vertex": {
                "module": this.device.createShaderModule({
                    "code": ShaderSource.getStencilWriteVertexShader()
                }),
                "entryPoint": "main",
                "buffers": [vertexBufferLayout]
            },
            "fragment": {
                "module": this.device.createShaderModule({
                    "code": ShaderSource.getStencilWriteFragmentShader()
                }),
                "entryPoint": "main",
                "targets": [{
                    "format": "rgba8unorm",
                    "writeMask": 0 // カラー書き込み無効
                }]
            },
            "primitive": {
                "topology": "triangle-list",
                "cullMode": "none"
            },
            "depthStencil": {
                "format": "stencil8",
                "stencilFront": {
                    "compare": "always",
                    "failOp": "zero",    // WebGL: ZERO
                    "depthFailOp": "invert", // WebGL: INVERT
                    "passOp": "invert"   // WebGL: INVERT
                },
                "stencilBack": {
                    "compare": "always",
                    "failOp": "zero",
                    "depthFailOp": "invert",
                    "passOp": "invert"
                },
                "stencilReadMask": 0xFF,
                "stencilWriteMask": 0xFF
            },
            "multisample": {
                "count": this.sampleCount
            }
        });
        this.pipelines.set("clip_write", clipWritePipeline);

        // メインアタッチメント用マスク書き込みパイプライン（レベル別、8レベルまでサポート）
        // WebGL版: stencilMask(1 << level - 1) でビット単位のマスク
        // 各レベルに対応するパイプラインを作成（stencilWriteMaskが異なる）
        const vertexShaderModule = this.device.createShaderModule({
            "code": ShaderSource.getStencilWriteMainVertexShader()
        });
        const fragmentShaderModule = this.device.createShaderModule({
            "code": ShaderSource.getStencilWriteFragmentShader()
        });

        for (let level = 1; level <= 8; level++) {
            const stencilWriteMask = 1 << level - 1; // level 1 → 0x01, level 2 → 0x02, ...
            const clipWriteMainPipeline = this.device.createRenderPipeline({
                "layout": "auto",
                "vertex": {
                    "module": vertexShaderModule,
                    "entryPoint": "main",
                    "buffers": [vertexBufferLayout]
                },
                "fragment": {
                    "module": fragmentShaderModule,
                    "entryPoint": "main",
                    "targets": [{
                        "format": this.format,
                        "writeMask": 0 // カラー書き込み無効
                    }]
                },
                "primitive": {
                    "topology": "triangle-list",
                    "cullMode": "none"
                },
                "depthStencil": {
                    "format": "stencil8",
                    "stencilFront": {
                        "compare": "always",
                        "failOp": "zero",
                        "depthFailOp": "invert",
                        "passOp": "invert"
                    },
                    "stencilBack": {
                        "compare": "always",
                        "failOp": "zero",
                        "depthFailOp": "invert",
                        "passOp": "invert"
                    },
                    "stencilReadMask": 0xFF,
                    "stencilWriteMask": stencilWriteMask // レベルに応じたビットのみ書き込み
                }
            });
            this.pipelines.set(`clip_write_main_${level}`, clipWriteMainPipeline);
        }

        // 後方互換性のため、clip_write_mainもlevel 1として登録
        this.pipelines.set("clip_write_main", this.pipelines.get("clip_write_main_1")!);

        // leaveMask用: 特定のビットをクリア（REPLACE操作で0に戻す）
        // WebGL版: stencilMask(1 << clipLevel), stencilOp(REPLACE, REPLACE, REPLACE)
        for (let level = 1; level <= 8; level++) {
            const stencilWriteMask = 1 << level - 1;
            const clipClearMainPipeline = this.device.createRenderPipeline({
                "layout": "auto",
                "vertex": {
                    "module": vertexShaderModule,
                    "entryPoint": "main",
                    "buffers": [vertexBufferLayout]
                },
                "fragment": {
                    "module": fragmentShaderModule,
                    "entryPoint": "main",
                    "targets": [{
                        "format": this.format,
                        "writeMask": 0
                    }]
                },
                "primitive": {
                    "topology": "triangle-list",
                    "cullMode": "none"
                },
                "depthStencil": {
                    "format": "stencil8",
                    "stencilFront": {
                        "compare": "always",
                        "failOp": "replace",
                        "depthFailOp": "replace",
                        "passOp": "replace" // 参照値（0）で置き換え
                    },
                    "stencilBack": {
                        "compare": "always",
                        "failOp": "replace",
                        "depthFailOp": "replace",
                        "passOp": "replace"
                    },
                    "stencilReadMask": 0xFF,
                    "stencilWriteMask": stencilWriteMask
                }
            });
            this.pipelines.set(`clip_clear_main_${level}`, clipClearMainPipeline);
        }
    }

    /**
     * @description ネストされたマスク用のパイプラインを作成
     *              WebGL版と同様に、レベル7を超えたステンシルビットをマージ
     *              Create pipelines for nested mask support (merging stencil bits when level exceeds 7)
     * @return {void}
     */
    private createMaskUnionPipelines(): void
    {
        // 17 floats per vertex: position(2) + bezier(2) + color(4) + matrix(3+3+3)
        const vertexBufferLayout: GPUVertexBufferLayout = {
            "arrayStride": 17 * 4,
            "attributes": [
                { "shaderLocation": 0, "offset": 0, "format": "float32x2" },
                { "shaderLocation": 1, "offset": 2 * 4, "format": "float32x2" },
                { "shaderLocation": 2, "offset": 4 * 4, "format": "float32x4" },
                { "shaderLocation": 3, "offset": 8 * 4, "format": "float32x3" },
                { "shaderLocation": 4, "offset": 11 * 4, "format": "float32x3" },
                { "shaderLocation": 5, "offset": 14 * 4, "format": "float32x3" }
            ]
        };

        const vertexShaderModule = this.device.createShaderModule({
            "code": ShaderSource.getStencilWriteMainVertexShader()
        });
        const fragmentShaderModule = this.device.createShaderModule({
            "code": ShaderSource.getStencilWriteFragmentShader()
        });

        // レベル1-8に対応するマージパイプラインとクリアパイプラインを作成
        for (let level = 1; level <= 8; level++) {
            const mask = 1 << level - 1;
            // ~mask - 1 ではなく、mask より上位のビット全てをマスク
            // WebGL版: stencilMask(~mask - 1) → level 1: 0xFE, level 2: 0xFC, ...
            const upperBitsMask = ~mask & 0xFF;

            // === mask_union_merge_N ===
            // WebGL版: stencilFunc(LEQUAL, mask, 0xff), stencilOp(ZERO, REPLACE, REPLACE)
            // ステンシル値がmask以下の場合にREPLACE（maskビットをセット）
            const mergePipeline = this.device.createRenderPipeline({
                "layout": "auto",
                "vertex": {
                    "module": vertexShaderModule,
                    "entryPoint": "main",
                    "buffers": [vertexBufferLayout]
                },
                "fragment": {
                    "module": fragmentShaderModule,
                    "entryPoint": "main",
                    "targets": [{
                        "format": this.format,
                        "writeMask": 0 // カラー書き込み無効
                    }]
                },
                "primitive": {
                    "topology": "triangle-list",
                    "cullMode": "none"
                },
                "depthStencil": {
                    "format": "stencil8",
                    "stencilFront": {
                        "compare": "less-equal", // LEQUAL: stencil <= reference
                        "failOp": "zero",     // WebGL: ZERO
                        "depthFailOp": "replace", // WebGL: REPLACE
                        "passOp": "replace"   // WebGL: REPLACE
                    },
                    "stencilBack": {
                        "compare": "less-equal",
                        "failOp": "zero",
                        "depthFailOp": "replace",
                        "passOp": "replace"
                    },
                    "stencilReadMask": 0xFF,
                    "stencilWriteMask": upperBitsMask // 上位ビットにマージ
                }
            });
            this.pipelines.set(`mask_union_merge_${level}`, mergePipeline);

            // === mask_union_clear_N ===
            // WebGL版: stencilFunc(ALWAYS, 0, 0xff), stencilOp(REPLACE, REPLACE, REPLACE)
            // 上位ビットをクリア（参照値0でREPLACE）
            const clearPipeline = this.device.createRenderPipeline({
                "layout": "auto",
                "vertex": {
                    "module": vertexShaderModule,
                    "entryPoint": "main",
                    "buffers": [vertexBufferLayout]
                },
                "fragment": {
                    "module": fragmentShaderModule,
                    "entryPoint": "main",
                    "targets": [{
                        "format": this.format,
                        "writeMask": 0 // カラー書き込み無効
                    }]
                },
                "primitive": {
                    "topology": "triangle-list",
                    "cullMode": "none"
                },
                "depthStencil": {
                    "format": "stencil8",
                    "stencilFront": {
                        "compare": "always",
                        "failOp": "replace",
                        "depthFailOp": "replace",
                        "passOp": "replace" // 参照値（0）で置き換え
                    },
                    "stencilBack": {
                        "compare": "always",
                        "failOp": "replace",
                        "depthFailOp": "replace",
                        "passOp": "replace"
                    },
                    "stencilReadMask": 0xFF,
                    "stencilWriteMask": 1 << level // clipLevelビットのみクリア
                }
            });
            this.pipelines.set(`mask_union_clear_${level}`, clearPipeline);
        }
    }

    /**
     * @description マスク用パイプラインを作成（ベジェ曲線アンチエイリアス）
     * @return {void}
     */
    private createMaskPipeline(): void
    {
        const bindGroupLayout = this.device.createBindGroupLayout({
            "entries": [
                {
                    "binding": 0,
                    "visibility": GPUShaderStage.VERTEX,
                    "buffer": { "type": "uniform" }
                }
            ]
        });

        this.bindGroupLayouts.set("mask", bindGroupLayout);

        const pipelineLayout = this.device.createPipelineLayout({
            "bindGroupLayouts": [bindGroupLayout]
        });

        const vertexShaderModule = this.device.createShaderModule({
            "code": ShaderSource.getMaskVertexShader()
        });

        const fragmentShaderModule = this.device.createShaderModule({
            "code": ShaderSource.getMaskFragmentShader()
        });

        const pipeline = this.device.createRenderPipeline({
            "layout": pipelineLayout,
            "vertex": {
                "module": vertexShaderModule,
                "entryPoint": "main",
                "buffers": [{
                    "arrayStride": 4 * 4, // 2 floats (position) + 2 floats (bezier)
                    "attributes": [
                        {
                            "shaderLocation": 0,
                            "offset": 0,
                            "format": "float32x2" // position
                        },
                        {
                            "shaderLocation": 1,
                            "offset": 2 * 4,
                            "format": "float32x2" // bezier
                        }
                    ]
                }]
            },
            "fragment": {
                "module": fragmentShaderModule,
                "entryPoint": "main",
                "targets": [{
                    "format": this.format,
                    "blend": {
                        "color": {
                            "srcFactor": "one",
                            "dstFactor": "one-minus-src-alpha",
                            "operation": "add"
                        },
                        "alpha": {
                            "srcFactor": "one",
                            "dstFactor": "one-minus-src-alpha",
                            "operation": "add"
                        }
                    }
                }]
            },
            "primitive": {
                "topology": "triangle-list",
                "cullMode": "none"
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
            "entries": [{
                "binding": 0,
                "visibility": GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
                "buffer": { "type": "uniform" }
            }]
        });

        this.bindGroupLayouts.set("basic", bindGroupLayout);

        const pipelineLayout = this.device.createPipelineLayout({
            "bindGroupLayouts": [bindGroupLayout]
        });

        const vertexShaderModule = this.device.createShaderModule({
            "code": ShaderSource.getBasicVertexShader()
        });

        const fragmentShaderModule = this.device.createShaderModule({
            "code": ShaderSource.getBasicFragmentShader()
        });

        const vertexBufferLayout: GPUVertexBufferLayout = {
            "arrayStride": 4 * 4, // 2 floats for position + 2 floats for texCoord
            "attributes": [
                {
                    "shaderLocation": 0,
                    "offset": 0,
                    "format": "float32x2"
                },
                {
                    "shaderLocation": 1,
                    "offset": 2 * 4,
                    "format": "float32x2"
                }
            ]
        };

        const blendState: GPUBlendState = {
            "color": {
                "srcFactor": "one",
                "dstFactor": "one-minus-src-alpha",
                "operation": "add"
            },
            "alpha": {
                "srcFactor": "one",
                "dstFactor": "one-minus-src-alpha",
                "operation": "add"
            }
        };

        // アトラステクスチャ用パイプライン（rgba8unorm）- MSAA対応
        const pipelineRGBA = this.device.createRenderPipeline({
            "layout": pipelineLayout,
            "vertex": {
                "module": vertexShaderModule,
                "entryPoint": "main",
                "buffers": [vertexBufferLayout]
            },
            "fragment": {
                "module": fragmentShaderModule,
                "entryPoint": "main",
                "targets": [{
                    "format": "rgba8unorm",
                    "blend": blendState
                }]
            },
            "primitive": {
                "topology": "triangle-list",
                "cullMode": "none"
            },
            "multisample": {
                "count": this.sampleCount
            }
        });

        // キャンバス用パイプライン（bgra8unorm）- Y軸反転シェーダーを使用
        const vertexShaderModuleBGRA = this.device.createShaderModule({
            "code": ShaderSource.getBasicMainVertexShader()
        });

        const pipelineBGRA = this.device.createRenderPipeline({
            "layout": pipelineLayout,
            "vertex": {
                "module": vertexShaderModuleBGRA,
                "entryPoint": "main",
                "buffers": [vertexBufferLayout]
            },
            "fragment": {
                "module": fragmentShaderModule,
                "entryPoint": "main",
                "targets": [{
                    "format": this.format, // 通常はbgra8unorm
                    "blend": blendState
                }]
            },
            "primitive": {
                "topology": "triangle-list",
                "cullMode": "none"
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
            "entries": [
                {
                    "binding": 0,
                    "visibility": GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
                    "buffer": { "type": "uniform" }
                },
                {
                    "binding": 1,
                    "visibility": GPUShaderStage.FRAGMENT,
                    "sampler": {}
                },
                {
                    "binding": 2,
                    "visibility": GPUShaderStage.FRAGMENT,
                    "texture": {}
                }
            ]
        });

        this.bindGroupLayouts.set("texture", bindGroupLayout);

        const pipelineLayout = this.device.createPipelineLayout({
            "bindGroupLayouts": [bindGroupLayout]
        });

        const vertexShaderModule = this.device.createShaderModule({
            "code": ShaderSource.getBasicVertexShader()
        });

        const fragmentShaderModule = this.device.createShaderModule({
            "code": ShaderSource.getTextureFragmentShader()
        });

        const pipeline = this.device.createRenderPipeline({
            "layout": pipelineLayout,
            "vertex": {
                "module": vertexShaderModule,
                "entryPoint": "main",
                "buffers": [{
                    "arrayStride": 4 * 4,
                    "attributes": [
                        {
                            "shaderLocation": 0,
                            "offset": 0,
                            "format": "float32x2"
                        },
                        {
                            "shaderLocation": 1,
                            "offset": 2 * 4,
                            "format": "float32x2"
                        }
                    ]
                }]
            },
            "fragment": {
                "module": fragmentShaderModule,
                "entryPoint": "main",
                "targets": [{
                    "format": this.format,
                    "blend": {
                        "color": {
                            "srcFactor": "one",
                            "dstFactor": "one-minus-src-alpha",
                            "operation": "add"
                        },
                        "alpha": {
                            "srcFactor": "one",
                            "dstFactor": "one-minus-src-alpha",
                            "operation": "add"
                        }
                    }
                }]
            },
            "primitive": {
                "topology": "triangle-list",
                "cullMode": "none"
            }
        });

        this.pipelines.set("texture", pipeline);
    }

    /**
     * @description インスタンス描画用パイプラインを作成
     *              WebGPU版は24 floats (96 bytes) per instance（padding含む）
     * @return {void}
     */
    private createInstancedPipeline(): void
    {
        const bindGroupLayout = this.device.createBindGroupLayout({
            "entries": [
                {
                    "binding": 0,
                    "visibility": GPUShaderStage.FRAGMENT,
                    "sampler": {}
                },
                {
                    "binding": 1,
                    "visibility": GPUShaderStage.FRAGMENT,
                    "texture": {}
                }
            ]
        });

        this.bindGroupLayouts.set("instanced", bindGroupLayout);

        const pipelineLayout = this.device.createPipelineLayout({
            "bindGroupLayouts": [bindGroupLayout]
        });

        const vertexShaderModule = this.device.createShaderModule({
            "code": ShaderSource.getInstancedVertexShader()
        });

        const fragmentShaderModule = this.device.createShaderModule({
            "code": ShaderSource.getInstancedFragmentShader()
        });

        // WebGPU版: 24 floats (96 bytes) per instance
        // BlendInstancedManager.ts で padding (0, 0) を追加している
        // textureRect: vec4 (offset 0)
        // textureDim: vec4 (offset 16)
        // matrixTx: vec4 (offset 32) - tx, ty, 0, 0 (padding)
        // matrixScale: vec4 (offset 48)
        // mulColor: vec4 (offset 64)
        // addColor: vec4 (offset 80)
        const instanceBufferLayout: GPUVertexBufferLayout = {
            "arrayStride": 96, // 24 floats * 4 bytes = 96 bytes
            "stepMode": "instance",
            "attributes": [
                {
                    "shaderLocation": 2,
                    "offset": 0,
                    "format": "float32x4" // textureRect (4 floats)
                },
                {
                    "shaderLocation": 3,
                    "offset": 16,
                    "format": "float32x4" // textureDim (4 floats)
                },
                {
                    "shaderLocation": 4,
                    "offset": 32,
                    "format": "float32x4" // matrixTx + padding (4 floats)
                },
                {
                    "shaderLocation": 5,
                    "offset": 48,
                    "format": "float32x4" // matrixScale (4 floats)
                },
                {
                    "shaderLocation": 6,
                    "offset": 64,
                    "format": "float32x4" // mulColor (4 floats)
                },
                {
                    "shaderLocation": 7,
                    "offset": 80,
                    "format": "float32x4" // addColor (4 floats)
                }
            ]
        };

        const pipeline = this.device.createRenderPipeline({
            "layout": pipelineLayout,
            "vertex": {
                "module": vertexShaderModule,
                "entryPoint": "main",
                "buffers": [
                    // Vertex buffer
                    {
                        "arrayStride": 4 * 4, // 2 floats position + 2 floats texCoord
                        "stepMode": "vertex",
                        "attributes": [
                            {
                                "shaderLocation": 0,
                                "offset": 0,
                                "format": "float32x2" // position
                            },
                            {
                                "shaderLocation": 1,
                                "offset": 2 * 4,
                                "format": "float32x2" // texCoord
                            }
                        ]
                    },
                    instanceBufferLayout
                ]
            },
            "fragment": {
                "module": fragmentShaderModule,
                "entryPoint": "main",
                "targets": [{
                    "format": this.format,
                    "blend": {
                        "color": {
                            "srcFactor": "one",
                            "dstFactor": "one-minus-src-alpha",
                            "operation": "add"
                        },
                        "alpha": {
                            "srcFactor": "one",
                            "dstFactor": "one-minus-src-alpha",
                            "operation": "add"
                        }
                    }
                }]
            },
            "primitive": {
                "topology": "triangle-list",
                "cullMode": "none"
            }
        });

        this.pipelines.set("instanced", pipeline);
        this.pipelines.set("instanced_normal", pipeline); // normalも同じパイプライン

        // === 各ブレンドモード用インスタンス描画パイプライン ===
        // WebGL: blendFunc(ONE, ONE)
        const addPipeline = this.device.createRenderPipeline({
            "layout": pipelineLayout,
            "vertex": {
                "module": vertexShaderModule,
                "entryPoint": "main",
                "buffers": [
                    {
                        "arrayStride": 4 * 4,
                        "stepMode": "vertex",
                        "attributes": [
                            { "shaderLocation": 0, "offset": 0, "format": "float32x2" },
                            { "shaderLocation": 1, "offset": 2 * 4, "format": "float32x2" }
                        ]
                    },
                    instanceBufferLayout
                ]
            },
            "fragment": {
                "module": fragmentShaderModule,
                "entryPoint": "main",
                "targets": [{
                    "format": this.format,
                    "blend": {
                        "color": {
                            "srcFactor": "one",
                            "dstFactor": "one",
                            "operation": "add"
                        },
                        "alpha": {
                            "srcFactor": "one",
                            "dstFactor": "one-minus-src-alpha",
                            "operation": "add"
                        }
                    }
                }]
            },
            "primitive": { "topology": "triangle-list", "cullMode": "none" }
        });
        this.pipelines.set("instanced_add", addPipeline);

        // WebGL: blendFunc(ONE_MINUS_DST_COLOR, ONE)
        const screenPipeline = this.device.createRenderPipeline({
            "layout": pipelineLayout,
            "vertex": {
                "module": vertexShaderModule,
                "entryPoint": "main",
                "buffers": [
                    {
                        "arrayStride": 4 * 4,
                        "stepMode": "vertex",
                        "attributes": [
                            { "shaderLocation": 0, "offset": 0, "format": "float32x2" },
                            { "shaderLocation": 1, "offset": 2 * 4, "format": "float32x2" }
                        ]
                    },
                    instanceBufferLayout
                ]
            },
            "fragment": {
                "module": fragmentShaderModule,
                "entryPoint": "main",
                "targets": [{
                    "format": this.format,
                    "blend": {
                        "color": {
                            "srcFactor": "one-minus-dst",
                            "dstFactor": "one",
                            "operation": "add"
                        },
                        "alpha": {
                            "srcFactor": "one",
                            "dstFactor": "one-minus-src-alpha",
                            "operation": "add"
                        }
                    }
                }]
            },
            "primitive": { "topology": "triangle-list", "cullMode": "none" }
        });
        this.pipelines.set("instanced_screen", screenPipeline);

        // WebGL: blendFunc(ZERO, SRC_ALPHA)
        const alphaPipeline = this.device.createRenderPipeline({
            "layout": pipelineLayout,
            "vertex": {
                "module": vertexShaderModule,
                "entryPoint": "main",
                "buffers": [
                    {
                        "arrayStride": 4 * 4,
                        "stepMode": "vertex",
                        "attributes": [
                            { "shaderLocation": 0, "offset": 0, "format": "float32x2" },
                            { "shaderLocation": 1, "offset": 2 * 4, "format": "float32x2" }
                        ]
                    },
                    instanceBufferLayout
                ]
            },
            "fragment": {
                "module": fragmentShaderModule,
                "entryPoint": "main",
                "targets": [{
                    "format": this.format,
                    "blend": {
                        "color": {
                            "srcFactor": "zero",
                            "dstFactor": "src-alpha",
                            "operation": "add"
                        },
                        "alpha": {
                            "srcFactor": "zero",
                            "dstFactor": "src-alpha",
                            "operation": "add"
                        }
                    }
                }]
            },
            "primitive": { "topology": "triangle-list", "cullMode": "none" }
        });
        this.pipelines.set("instanced_alpha", alphaPipeline);

        // WebGL: blendFunc(ZERO, ONE_MINUS_SRC_ALPHA)
        const erasePipeline = this.device.createRenderPipeline({
            "layout": pipelineLayout,
            "vertex": {
                "module": vertexShaderModule,
                "entryPoint": "main",
                "buffers": [
                    {
                        "arrayStride": 4 * 4,
                        "stepMode": "vertex",
                        "attributes": [
                            { "shaderLocation": 0, "offset": 0, "format": "float32x2" },
                            { "shaderLocation": 1, "offset": 2 * 4, "format": "float32x2" }
                        ]
                    },
                    instanceBufferLayout
                ]
            },
            "fragment": {
                "module": fragmentShaderModule,
                "entryPoint": "main",
                "targets": [{
                    "format": this.format,
                    "blend": {
                        "color": {
                            "srcFactor": "zero",
                            "dstFactor": "one-minus-src-alpha",
                            "operation": "add"
                        },
                        "alpha": {
                            "srcFactor": "zero",
                            "dstFactor": "one-minus-src-alpha",
                            "operation": "add"
                        }
                    }
                }]
            },
            "primitive": { "topology": "triangle-list", "cullMode": "none" }
        });
        this.pipelines.set("instanced_erase", erasePipeline);

        // WebGL: blendFunc(ONE, ZERO) - copy/layer
        const copyPipeline = this.device.createRenderPipeline({
            "layout": pipelineLayout,
            "vertex": {
                "module": vertexShaderModule,
                "entryPoint": "main",
                "buffers": [
                    {
                        "arrayStride": 4 * 4,
                        "stepMode": "vertex",
                        "attributes": [
                            { "shaderLocation": 0, "offset": 0, "format": "float32x2" },
                            { "shaderLocation": 1, "offset": 2 * 4, "format": "float32x2" }
                        ]
                    },
                    instanceBufferLayout
                ]
            },
            "fragment": {
                "module": fragmentShaderModule,
                "entryPoint": "main",
                "targets": [{
                    "format": this.format,
                    "blend": {
                        "color": {
                            "srcFactor": "one",
                            "dstFactor": "zero",
                            "operation": "add"
                        },
                        "alpha": {
                            "srcFactor": "one",
                            "dstFactor": "zero",
                            "operation": "add"
                        }
                    }
                }]
            },
            "primitive": { "topology": "triangle-list", "cullMode": "none" }
        });
        this.pipelines.set("instanced_copy", copyPipeline);
        this.pipelines.set("instanced_layer", copyPipeline); // layerもcopyと同じ

        // === マスク付きインスタンス描画パイプライン ===
        // ステンシルテスト: stencil == 参照値（累積マスク値）の部分のみ描画
        const maskedPipeline = this.device.createRenderPipeline({
            "layout": pipelineLayout,
            "vertex": {
                "module": vertexShaderModule,
                "entryPoint": "main",
                "buffers": [
                    // Vertex buffer
                    {
                        "arrayStride": 4 * 4,
                        "stepMode": "vertex",
                        "attributes": [
                            { "shaderLocation": 0, "offset": 0, "format": "float32x2" },
                            { "shaderLocation": 1, "offset": 2 * 4, "format": "float32x2" }
                        ]
                    },
                    instanceBufferLayout
                ]
            },
            "fragment": {
                "module": fragmentShaderModule,
                "entryPoint": "main",
                "targets": [{
                    "format": this.format,
                    "blend": {
                        "color": {
                            "srcFactor": "one",
                            "dstFactor": "one-minus-src-alpha",
                            "operation": "add"
                        },
                        "alpha": {
                            "srcFactor": "one",
                            "dstFactor": "one-minus-src-alpha",
                            "operation": "add"
                        }
                    }
                }]
            },
            "primitive": {
                "topology": "triangle-list",
                "cullMode": "none"
            },
            "depthStencil": {
                "format": "stencil8",
                "stencilFront": {
                    "compare": "equal", // ステンシル値 == 参照値（累積マスク値）の部分のみ描画
                    "failOp": "keep",
                    "depthFailOp": "keep",
                    "passOp": "keep" // ステンシル値は変更しない
                },
                "stencilBack": {
                    "compare": "equal",
                    "failOp": "keep",
                    "depthFailOp": "keep",
                    "passOp": "keep"
                },
                "stencilReadMask": 0xFF,
                "stencilWriteMask": 0x00 // 描画時はステンシル書き込み無効
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
            "entries": [
                {
                    "binding": 0,
                    "visibility": GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
                    "buffer": { "type": "uniform" } // GradientUniforms
                },
                {
                    "binding": 1,
                    "visibility": GPUShaderStage.FRAGMENT,
                    "sampler": {} // グラデーションLUTサンプラー
                },
                {
                    "binding": 2,
                    "visibility": GPUShaderStage.FRAGMENT,
                    "texture": {} // グラデーションLUTテクスチャ
                }
            ]
        });

        this.bindGroupLayouts.set("gradient_fill", bindGroupLayout);

        const pipelineLayout = this.device.createPipelineLayout({
            "bindGroupLayouts": [bindGroupLayout]
        });

        const vertexShaderModule = this.device.createShaderModule({
            "code": ShaderSource.getGradientFillVertexShader()
        });

        const fragmentShaderModule = this.device.createShaderModule({
            "code": ShaderSource.getGradientFillFragmentShader()
        });

        // 2パスステンシルフィル用フラグメントシェーダー（bezierチェックなし）
        const stencilFragmentShaderModule = this.device.createShaderModule({
            "code": ShaderSource.getGradientFillStencilFragmentShader()
        });

        // 17 floats per vertex (fill用と同じ)
        const vertexBufferLayout: GPUVertexBufferLayout = {
            "arrayStride": 17 * 4,
            "attributes": [
                { "shaderLocation": 0, "offset": 0, "format": "float32x2" },      // position
                { "shaderLocation": 1, "offset": 2 * 4, "format": "float32x2" },  // bezier
                { "shaderLocation": 2, "offset": 4 * 4, "format": "float32x4" },  // color
                { "shaderLocation": 3, "offset": 8 * 4, "format": "float32x3" },  // matrix row 0
                { "shaderLocation": 4, "offset": 11 * 4, "format": "float32x3" }, // matrix row 1
                { "shaderLocation": 5, "offset": 14 * 4, "format": "float32x3" }  // matrix row 2
            ]
        };

        const blendState: GPUBlendState = {
            "color": {
                "srcFactor": "one",
                "dstFactor": "one-minus-src-alpha",
                "operation": "add"
            },
            "alpha": {
                "srcFactor": "one",
                "dstFactor": "one-minus-src-alpha",
                "operation": "add"
            }
        };

        // アトラステクスチャ用（rgba8unorm）- ステンシルなし
        const pipelineRGBA = this.device.createRenderPipeline({
            "label": "gradient_fill_no_stencil_pipeline",
            "layout": pipelineLayout,
            "vertex": {
                "module": vertexShaderModule,
                "entryPoint": "main",
                "buffers": [vertexBufferLayout]
            },
            "fragment": {
                "module": fragmentShaderModule,
                "entryPoint": "main",
                "targets": [{
                    "format": "rgba8unorm",
                    "blend": blendState
                }]
            },
            "primitive": {
                "topology": "triangle-list",
                "cullMode": "none"
            },
            "multisample": {
                "count": this.sampleCount
            }
        });

        // キャンバス用（bgra8unorm）- ステンシルなし
        // Y軸反転シェーダーを使用
        const vertexShaderModuleMain = this.device.createShaderModule({
            "code": ShaderSource.getGradientFillMainVertexShader()
        });

        const pipelineBGRA = this.device.createRenderPipeline({
            "layout": pipelineLayout,
            "vertex": {
                "module": vertexShaderModuleMain, // Y軸反転ありシェーダー
                "entryPoint": "main",
                "buffers": [vertexBufferLayout]
            },
            "fragment": {
                "module": fragmentShaderModule,
                "entryPoint": "main",
                "targets": [{
                    "format": this.format,
                    "blend": blendState
                }]
            },
            "primitive": {
                "topology": "triangle-list",
                "cullMode": "none"
            },
            "multisample": {
                "count": this.sampleCount
            }
            // Note: キャンバス描画時はステンシルバッファがないためdepthStencilは設定しない
        });

        this.pipelines.set("gradient_fill", pipelineRGBA);
        this.pipelines.set("gradient_fill_no_stencil", pipelineRGBA); // 明示的にステンシルなし
        this.pipelines.set("gradient_fill_bgra", pipelineBGRA);

        // === グラデーションストローク用パイプライン（ステンシル互換） ===
        // ストロークのメッシュは既に形状を表しているためステンシルテストは不要だが、
        // beginNodeRenderingが作成するステンシル付きレンダーパスとの互換性のため
        // depthStencilを "always" で設定する
        const strokeStencilState: GPUDepthStencilState = {
            "format": "stencil8",
            "stencilFront": {
                "compare": "always",
                "failOp": "keep",
                "depthFailOp": "keep",
                "passOp": "keep"
            },
            "stencilBack": {
                "compare": "always",
                "failOp": "keep",
                "depthFailOp": "keep",
                "passOp": "keep"
            },
            "stencilReadMask": 0x00,
            "stencilWriteMask": 0x00
        };

        // アトラス用グラデーションストローク（rgba8unorm + ステンシル互換）
        const pipelineGradientStrokeAtlas = this.device.createRenderPipeline({
            "label": "gradient_stroke_atlas_pipeline",
            "layout": pipelineLayout,
            "vertex": {
                "module": vertexShaderModule,
                "entryPoint": "main",
                "buffers": [vertexBufferLayout]
            },
            "fragment": {
                "module": fragmentShaderModule,
                "entryPoint": "main",
                "targets": [{
                    "format": "rgba8unorm",
                    "blend": blendState
                }]
            },
            "primitive": {
                "topology": "triangle-list",
                "cullMode": "none"
            },
            "depthStencil": strokeStencilState,
            "multisample": {
                "count": this.sampleCount
            }
        });
        this.pipelines.set("gradient_stroke_atlas", pipelineGradientStrokeAtlas);

        // メインキャンバス用グラデーションストローク（bgra8unorm + ステンシル互換 + Y反転）
        const pipelineGradientStrokeBGRA = this.device.createRenderPipeline({
            "label": "gradient_stroke_bgra_pipeline",
            "layout": pipelineLayout,
            "vertex": {
                "module": vertexShaderModuleMain,
                "entryPoint": "main",
                "buffers": [vertexBufferLayout]
            },
            "fragment": {
                "module": fragmentShaderModule,
                "entryPoint": "main",
                "targets": [{
                    "format": this.format,
                    "blend": blendState
                }]
            },
            "primitive": {
                "topology": "triangle-list",
                "cullMode": "none"
            },
            "depthStencil": strokeStencilState,
            "multisample": {
                "count": this.sampleCount
            }
        });
        this.pipelines.set("gradient_stroke_bgra", pipelineGradientStrokeBGRA);

        // sampleCount: 1のbgra8unormパイプライン（MSAAなしのメインキャンバス用）
        const pipelineBGRA_noMSAA = this.device.createRenderPipeline({
            "layout": pipelineLayout,
            "vertex": {
                "module": vertexShaderModuleMain,
                "entryPoint": "main",
                "buffers": [vertexBufferLayout]
            },
            "fragment": {
                "module": fragmentShaderModule,
                "entryPoint": "main",
                "targets": [{
                    "format": this.format,
                    "blend": blendState
                }]
            },
            "primitive": {
                "topology": "triangle-list",
                "cullMode": "none"
            },
            "multisample": {
                "count": 1
            }
        });
        this.pipelines.set("gradient_fill_bgra_no_msaa", pipelineBGRA_noMSAA);

        // === アトラスのステンシル付きレンダーパス用（2パス処理のPass 2用） ===
        // NOT_EQUAL 0テストでグラデーションを描画し、ステンシルをクリア
        // WebGL版: stencilFunc(NOTEQUAL, 0) + stencilOp(KEEP, ZERO, ZERO)
        const pipelineRGBAStencil = this.device.createRenderPipeline({
            "layout": pipelineLayout,
            "vertex": {
                "module": vertexShaderModule, // Y軸反転なしシェーダー
                "entryPoint": "main",
                "buffers": [vertexBufferLayout]
            },
            "fragment": {
                "module": fragmentShaderModule,
                "entryPoint": "main",
                "targets": [{
                    "format": "rgba8unorm",
                    "blend": blendState
                }]
            },
            "primitive": {
                "topology": "triangle-list",
                "cullMode": "none"
            },
            "depthStencil": {
                "format": "stencil8",
                "stencilFront": {
                    "compare": "not-equal", // ステンシル値 != 0 の部分に描画
                    "failOp": "keep",
                    "depthFailOp": "zero",
                    "passOp": "zero"
                },
                "stencilBack": {
                    "compare": "not-equal",
                    "failOp": "keep",
                    "depthFailOp": "zero",
                    "passOp": "zero"
                },
                "stencilReadMask": 0xFF,
                "stencilWriteMask": 0xFF
            },
            "multisample": {
                "count": this.sampleCount
            }
        });
        this.pipelines.set("gradient_fill_stencil", pipelineRGBAStencil);

        // === アトラス用ステンシルテスト付きグラデーション ===
        // 2パスフィル処理のPass 2で使用:
        // Pass 1: stencil_write_atlas でステンシルに書き込み（INCR/DECR）
        // Pass 2: このパイプラインでステンシル != 0 の部分にグラデーションを描画
        // これにより中抜き描画（hollow shape）が正しく機能する
        // stencilFragmentShaderModule: bezierチェックなし（ステンシルで形状は決定済み）
        const pipelineRGBAStencilAtlas = this.device.createRenderPipeline({
            "layout": pipelineLayout,
            "vertex": {
                "module": vertexShaderModule,
                "entryPoint": "main",
                "buffers": [vertexBufferLayout]
            },
            "fragment": {
                "module": stencilFragmentShaderModule, // bezierチェックなし
                "entryPoint": "main",
                "targets": [{
                    "format": "rgba8unorm",
                    "blend": blendState
                }]
            },
            "primitive": {
                "topology": "triangle-list",
                "cullMode": "none"
            },
            "depthStencil": {
                "format": "stencil8",
                "stencilFront": {
                    "compare": "not-equal",
                    "failOp": "keep",
                    "depthFailOp": "zero",
                    "passOp": "zero"
                },
                "stencilBack": {
                    "compare": "not-equal",
                    "failOp": "keep",
                    "depthFailOp": "zero",
                    "passOp": "zero"
                },
                "stencilReadMask": 0xFF,
                "stencilWriteMask": 0xFF
            },
            "multisample": {
                "count": this.sampleCount
            }
        });
        this.pipelines.set("gradient_fill_stencil_atlas", pipelineRGBAStencilAtlas);

        // === メインキャンバス用ステンシルテスト付きグラデーション（Pass 2） ===
        // 中抜き描画（hollow shape）のPass 2で使用:
        // ステンシル != 0 の部分にグラデーションを描画し、ステンシルをクリア
        // stencilFragmentShaderModule: bezierチェックなし（ステンシルで形状は決定済み）
        const pipelineStencilMain = this.device.createRenderPipeline({
            "layout": pipelineLayout,
            "vertex": {
                "module": vertexShaderModuleMain, // Y軸反転ありシェーダー
                "entryPoint": "main",
                "buffers": [vertexBufferLayout]
            },
            "fragment": {
                "module": stencilFragmentShaderModule, // bezierチェックなし
                "entryPoint": "main",
                "targets": [{
                    "format": this.format, // bgra8unorm
                    "blend": blendState
                }]
            },
            "primitive": {
                "topology": "triangle-list",
                "cullMode": "none"
            },
            "depthStencil": {
                "format": "stencil8",
                "stencilFront": {
                    "compare": "not-equal", // ステンシル値 != 0 の部分に描画
                    "failOp": "keep",
                    "depthFailOp": "zero",
                    "passOp": "zero" // 描画後にステンシルをクリア
                },
                "stencilBack": {
                    "compare": "not-equal",
                    "failOp": "keep",
                    "depthFailOp": "zero",
                    "passOp": "zero"
                },
                "stencilReadMask": 0xFF,
                "stencilWriteMask": 0xFF
            },
            "multisample": {
                "count": 1 // メインキャンバス用
            }
        });
        this.pipelines.set("gradient_fill_stencil_main", pipelineStencilMain);

        // === メインアタッチメントのステンシル付きレンダーパス用 ===
        // マスクモード時に使用
        const pipelineBGRAStencil = this.device.createRenderPipeline({
            "layout": pipelineLayout,
            "vertex": {
                "module": vertexShaderModuleMain, // Y軸反転ありシェーダー
                "entryPoint": "main",
                "buffers": [vertexBufferLayout]
            },
            "fragment": {
                "module": fragmentShaderModule,
                "entryPoint": "main",
                "targets": [{
                    "format": this.format,
                    "blend": blendState
                }]
            },
            "primitive": {
                "topology": "triangle-list",
                "cullMode": "none"
            },
            "depthStencil": {
                "format": "stencil8",
                "stencilFront": {
                    "compare": "equal", // ステンシル値 == 参照値（累積マスク値）の部分のみ描画
                    "failOp": "keep",
                    "depthFailOp": "keep",
                    "passOp": "keep"
                },
                "stencilBack": {
                    "compare": "equal",
                    "failOp": "keep",
                    "depthFailOp": "keep",
                    "passOp": "keep"
                },
                "stencilReadMask": 0xFF,
                "stencilWriteMask": 0x00
            },
            "multisample": {
                "count": this.sampleCount
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
            "entries": [
                {
                    "binding": 0,
                    "visibility": GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
                    "buffer": { "type": "uniform" }
                },
                {
                    "binding": 1,
                    "visibility": GPUShaderStage.FRAGMENT,
                    "sampler": {}
                },
                {
                    "binding": 2,
                    "visibility": GPUShaderStage.FRAGMENT,
                    "texture": {}
                }
            ]
        });

        this.bindGroupLayouts.set("bitmap_fill", bindGroupLayout);

        const pipelineLayout = this.device.createPipelineLayout({
            "bindGroupLayouts": [bindGroupLayout]
        });

        const vertexShaderModule = this.device.createShaderModule({
            "code": ShaderSource.getBitmapFillVertexShader()
        });

        const fragmentShaderModule = this.device.createShaderModule({
            "code": ShaderSource.getBitmapFillFragmentShader()
        });

        // 17 floats per vertex (fill用と同じ)
        const vertexBufferLayout: GPUVertexBufferLayout = {
            "arrayStride": 17 * 4,
            "attributes": [
                { "shaderLocation": 0, "offset": 0, "format": "float32x2" },      // position
                { "shaderLocation": 1, "offset": 2 * 4, "format": "float32x2" },  // bezier
                { "shaderLocation": 2, "offset": 4 * 4, "format": "float32x4" },  // color
                { "shaderLocation": 3, "offset": 8 * 4, "format": "float32x3" },  // matrix row 0
                { "shaderLocation": 4, "offset": 11 * 4, "format": "float32x3" }, // matrix row 1
                { "shaderLocation": 5, "offset": 14 * 4, "format": "float32x3" }  // matrix row 2
            ]
        };

        const blendState: GPUBlendState = {
            "color": {
                "srcFactor": "one",
                "dstFactor": "one-minus-src-alpha",
                "operation": "add"
            },
            "alpha": {
                "srcFactor": "one",
                "dstFactor": "one-minus-src-alpha",
                "operation": "add"
            }
        };

        // アトラステクスチャ用（rgba8unorm）- ステンシルなし - MSAA対応
        const pipelineRGBA = this.device.createRenderPipeline({
            "layout": pipelineLayout,
            "vertex": {
                "module": vertexShaderModule,
                "entryPoint": "main",
                "buffers": [vertexBufferLayout]
            },
            "fragment": {
                "module": fragmentShaderModule,
                "entryPoint": "main",
                "targets": [{
                    "format": "rgba8unorm",
                    "blend": blendState
                }]
            },
            "primitive": {
                "topology": "triangle-list",
                "cullMode": "none"
            },
            "multisample": {
                "count": this.sampleCount
            }
        });

        // キャンバス用（bgra8unorm）- ステンシルなし
        // Y軸反転シェーダーを使用
        const vertexShaderModuleMain = this.device.createShaderModule({
            "code": ShaderSource.getBitmapFillMainVertexShader()
        });

        const pipelineBGRA = this.device.createRenderPipeline({
            "layout": pipelineLayout,
            "vertex": {
                "module": vertexShaderModuleMain, // Y軸反転ありシェーダー
                "entryPoint": "main",
                "buffers": [vertexBufferLayout]
            },
            "fragment": {
                "module": fragmentShaderModule,
                "entryPoint": "main",
                "targets": [{
                    "format": this.format,
                    "blend": blendState
                }]
            },
            "primitive": {
                "topology": "triangle-list",
                "cullMode": "none"
            }
            // Note: キャンバス描画時はステンシルバッファがないためdepthStencilは設定しない
        });

        this.pipelines.set("bitmap_fill", pipelineRGBA);
        this.pipelines.set("bitmap_fill_bgra", pipelineBGRA);

        // === ビットマップストローク用パイプライン（ステンシル互換） ===
        // ストロークのメッシュは既に形状を表しているためステンシルテストは不要だが、
        // beginNodeRenderingが作成するステンシル付きレンダーパスとの互換性のため
        // depthStencilを "always" で設定する
        const bitmapStrokeStencilState: GPUDepthStencilState = {
            "format": "stencil8",
            "stencilFront": {
                "compare": "always",
                "failOp": "keep",
                "depthFailOp": "keep",
                "passOp": "keep"
            },
            "stencilBack": {
                "compare": "always",
                "failOp": "keep",
                "depthFailOp": "keep",
                "passOp": "keep"
            },
            "stencilReadMask": 0x00,
            "stencilWriteMask": 0x00
        };

        // アトラス用ビットマップストローク（rgba8unorm + ステンシル互換）
        const pipelineBitmapStrokeAtlas = this.device.createRenderPipeline({
            "label": "bitmap_stroke_atlas_pipeline",
            "layout": pipelineLayout,
            "vertex": {
                "module": vertexShaderModule,
                "entryPoint": "main",
                "buffers": [vertexBufferLayout]
            },
            "fragment": {
                "module": fragmentShaderModule,
                "entryPoint": "main",
                "targets": [{
                    "format": "rgba8unorm",
                    "blend": blendState
                }]
            },
            "primitive": {
                "topology": "triangle-list",
                "cullMode": "none"
            },
            "depthStencil": bitmapStrokeStencilState,
            "multisample": {
                "count": this.sampleCount
            }
        });
        this.pipelines.set("bitmap_stroke_atlas", pipelineBitmapStrokeAtlas);

        // メインキャンバス用ビットマップストローク（bgra8unorm + ステンシル互換 + Y反転）
        const pipelineBitmapStrokeBGRA = this.device.createRenderPipeline({
            "label": "bitmap_stroke_bgra_pipeline",
            "layout": pipelineLayout,
            "vertex": {
                "module": vertexShaderModuleMain,
                "entryPoint": "main",
                "buffers": [vertexBufferLayout]
            },
            "fragment": {
                "module": fragmentShaderModule,
                "entryPoint": "main",
                "targets": [{
                    "format": this.format,
                    "blend": blendState
                }]
            },
            "primitive": {
                "topology": "triangle-list",
                "cullMode": "none"
            },
            "depthStencil": bitmapStrokeStencilState,
            "multisample": {
                "count": this.sampleCount
            }
        });
        this.pipelines.set("bitmap_stroke_bgra", pipelineBitmapStrokeBGRA);

        // === アトラスのステンシル付きレンダーパス用（2パス処理のPass 2用） ===
        // NOT_EQUAL 0テストでビットマップを描画し、ステンシルをクリア
        // WebGL版: stencilFunc(NOTEQUAL, 0) + stencilOp(KEEP, ZERO, ZERO)
        const pipelineRGBAStencil = this.device.createRenderPipeline({
            "layout": pipelineLayout,
            "vertex": {
                "module": vertexShaderModule, // Y軸反転なしシェーダー
                "entryPoint": "main",
                "buffers": [vertexBufferLayout]
            },
            "fragment": {
                "module": fragmentShaderModule,
                "entryPoint": "main",
                "targets": [{
                    "format": "rgba8unorm",
                    "blend": blendState
                }]
            },
            "primitive": {
                "topology": "triangle-list",
                "cullMode": "none"
            },
            "depthStencil": {
                "format": "stencil8",
                "stencilFront": {
                    "compare": "not-equal", // ステンシル値 != 0 の部分に描画
                    "failOp": "keep",
                    "depthFailOp": "zero", // ステンシルをクリア
                    "passOp": "zero"
                },
                "stencilBack": {
                    "compare": "not-equal",
                    "failOp": "keep",
                    "depthFailOp": "zero",
                    "passOp": "zero"
                },
                "stencilReadMask": 0xFF,
                "stencilWriteMask": 0xFF
            },
            "multisample": {
                "count": this.sampleCount
            }
        });
        this.pipelines.set("bitmap_fill_stencil", pipelineRGBAStencil);

        // === メインアタッチメントのステンシル付きレンダーパス用 ===
        // マスクモード時に使用
        const pipelineBGRAStencil = this.device.createRenderPipeline({
            "layout": pipelineLayout,
            "vertex": {
                "module": vertexShaderModuleMain, // Y軸反転ありシェーダー
                "entryPoint": "main",
                "buffers": [vertexBufferLayout]
            },
            "fragment": {
                "module": fragmentShaderModule,
                "entryPoint": "main",
                "targets": [{
                    "format": this.format,
                    "blend": blendState
                }]
            },
            "primitive": {
                "topology": "triangle-list",
                "cullMode": "none"
            },
            "depthStencil": {
                "format": "stencil8",
                "stencilFront": {
                    "compare": "equal", // ステンシル値 == 参照値（累積マスク値）の部分のみ描画
                    "failOp": "keep",
                    "depthFailOp": "keep",
                    "passOp": "keep"
                },
                "stencilBack": {
                    "compare": "equal",
                    "failOp": "keep",
                    "depthFailOp": "keep",
                    "passOp": "keep"
                },
                "stencilReadMask": 0xFF,
                "stencilWriteMask": 0x00
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
            "entries": [
                {
                    "binding": 0,
                    "visibility": GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
                    "buffer": { "type": "uniform" }
                },
                {
                    "binding": 1,
                    "visibility": GPUShaderStage.FRAGMENT,
                    "buffer": { "type": "uniform" }
                },
                {
                    "binding": 2,
                    "visibility": GPUShaderStage.FRAGMENT,
                    "sampler": {}
                },
                {
                    "binding": 3,
                    "visibility": GPUShaderStage.FRAGMENT,
                    "texture": {}
                },
                {
                    "binding": 4,
                    "visibility": GPUShaderStage.FRAGMENT,
                    "sampler": {}
                },
                {
                    "binding": 5,
                    "visibility": GPUShaderStage.FRAGMENT,
                    "texture": {}
                }
            ]
        });

        this.bindGroupLayouts.set("blend", bindGroupLayout);

        const pipelineLayout = this.device.createPipelineLayout({
            "bindGroupLayouts": [bindGroupLayout]
        });

        const vertexShaderModule = this.device.createShaderModule({
            "code": ShaderSource.getBasicVertexShader()
        });

        const fragmentShaderModule = this.device.createShaderModule({
            "code": ShaderSource.getBlendFragmentShader()
        });

        const pipeline = this.device.createRenderPipeline({
            "layout": pipelineLayout,
            "vertex": {
                "module": vertexShaderModule,
                "entryPoint": "main",
                "buffers": [{
                    "arrayStride": 4 * 4,
                    "attributes": [
                        {
                            "shaderLocation": 0,
                            "offset": 0,
                            "format": "float32x2"
                        },
                        {
                            "shaderLocation": 1,
                            "offset": 2 * 4,
                            "format": "float32x2"
                        }
                    ]
                }]
            },
            "fragment": {
                "module": fragmentShaderModule,
                "entryPoint": "main",
                "targets": [{
                    "format": this.format,
                    "blend": {
                        "color": {
                            "srcFactor": "one",
                            "dstFactor": "one-minus-src-alpha",
                            "operation": "add"
                        },
                        "alpha": {
                            "srcFactor": "one",
                            "dstFactor": "one-minus-src-alpha",
                            "operation": "add"
                        }
                    }
                }]
            },
            "primitive": {
                "topology": "triangle-list",
                "cullMode": "none"
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
            "entries": [
                {
                    "binding": 0,
                    "visibility": GPUShaderStage.FRAGMENT,
                    "buffer": { "type": "uniform" }
                },
                {
                    "binding": 1,
                    "visibility": GPUShaderStage.FRAGMENT,
                    "sampler": {}
                },
                {
                    "binding": 2,
                    "visibility": GPUShaderStage.FRAGMENT,
                    "texture": {}
                }
            ]
        });

        this.bindGroupLayouts.set("blur_filter", bindGroupLayout);

        // 一般的なブラー値用のパイプラインを事前に作成（halfBlur = 1〜16）
        const vertexShaderModule = this.device.createShaderModule({
            "code": ShaderSource.getBlurFilterVertexShader()
        });

        const pipelineLayout = this.device.createPipelineLayout({
            "bindGroupLayouts": [bindGroupLayout]
        });

        for (let halfBlur = 1; halfBlur <= 16; halfBlur++) {
            const fragmentShaderModule = this.device.createShaderModule({
                "code": ShaderSource.getBlurFilterFragmentShader(halfBlur)
            });

            // ブラーフィルターはtemp_アタッチメント（rgba8unorm）にレンダリングする
            const pipeline = this.device.createRenderPipeline({
                "layout": pipelineLayout,
                "vertex": {
                    "module": vertexShaderModule,
                    "entryPoint": "main",
                    "buffers": [] // フルスクリーンクワッドなので頂点バッファ不要
                },
                "fragment": {
                    "module": fragmentShaderModule,
                    "entryPoint": "main",
                    "targets": [{
                        "format": "rgba8unorm",
                        "blend": {
                            "color": {
                                "srcFactor": "one",
                                "dstFactor": "zero",
                                "operation": "add"
                            },
                            "alpha": {
                                "srcFactor": "one",
                                "dstFactor": "zero",
                                "operation": "add"
                            }
                        }
                    }]
                },
                "primitive": {
                    "topology": "triangle-list",
                    "cullMode": "none"
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
            "entries": [
                {
                    "binding": 0,
                    "visibility": GPUShaderStage.FRAGMENT,
                    "buffer": { "type": "uniform" }
                },
                {
                    "binding": 1,
                    "visibility": GPUShaderStage.FRAGMENT,
                    "sampler": {}
                },
                {
                    "binding": 2,
                    "visibility": GPUShaderStage.FRAGMENT,
                    "texture": {}
                }
            ]
        });

        this.bindGroupLayouts.set("texture_copy", bindGroupLayout);

        const pipelineLayout = this.device.createPipelineLayout({
            "bindGroupLayouts": [bindGroupLayout]
        });

        const vertexShaderModule = this.device.createShaderModule({
            "code": ShaderSource.getBlurFilterVertexShader() // 同じフルスクリーンクワッド
        });

        const fragmentShaderModule = this.device.createShaderModule({
            "code": ShaderSource.getTextureCopyFragmentShader()
        });

        const pipeline = this.device.createRenderPipeline({
            "layout": pipelineLayout,
            "vertex": {
                "module": vertexShaderModule,
                "entryPoint": "main",
                "buffers": []
            },
            "fragment": {
                "module": fragmentShaderModule,
                "entryPoint": "main",
                "targets": [{
                    "format": this.format,
                    "blend": {
                        "color": {
                            "srcFactor": "one",
                            "dstFactor": "zero",
                            "operation": "add"
                        },
                        "alpha": {
                            "srcFactor": "one",
                            "dstFactor": "zero",
                            "operation": "add"
                        }
                    }
                }]
            },
            "primitive": {
                "topology": "triangle-list",
                "cullMode": "none"
            }
        });

        this.pipelines.set("texture_copy", pipeline);

        // RGBA8形式用テクスチャコピーパイプライン（フィルター内部処理用）
        // temp_アタッチメントはrgba8unormフォーマットを使用するため
        const pipelineRGBA8 = this.device.createRenderPipeline({
            "layout": pipelineLayout,
            "vertex": {
                "module": vertexShaderModule,
                "entryPoint": "main",
                "buffers": []
            },
            "fragment": {
                "module": fragmentShaderModule,
                "entryPoint": "main",
                "targets": [{
                    "format": "rgba8unorm",
                    "blend": {
                        "color": {
                            "srcFactor": "one",
                            "dstFactor": "zero",
                            "operation": "add"
                        },
                        "alpha": {
                            "srcFactor": "one",
                            "dstFactor": "zero",
                            "operation": "add"
                        }
                    }
                }]
            },
            "primitive": {
                "topology": "triangle-list",
                "cullMode": "none"
            }
        });
        this.pipelines.set("texture_copy_rgba8", pipelineRGBA8);

        // Erase用テクスチャコピーパイプライン（Bevelフィルターなど用）
        // ソースのアルファ値に基づいてデスティネーションを消去
        // blend: src=ZERO, dst=ONE_MINUS_SRC_ALPHA（WebGLのblendEraseServiceと同等）
        // BlurTextureCopyFragmentを使用: 範囲外は透明として処理
        const eraseFragmentShaderModule = this.device.createShaderModule({
            "code": ShaderSource.getBlurTextureCopyFragmentShader()
        });

        const eraseTexturePipeline = this.device.createRenderPipeline({
            "layout": pipelineLayout,
            "vertex": {
                "module": vertexShaderModule,
                "entryPoint": "main",
                "buffers": []
            },
            "fragment": {
                "module": eraseFragmentShaderModule,
                "entryPoint": "main",
                "targets": [{
                    "format": "rgba8unorm",
                    "blend": {
                        "color": {
                            "srcFactor": "zero",
                            "dstFactor": "one-minus-src-alpha",
                            "operation": "add"
                        },
                        "alpha": {
                            "srcFactor": "zero",
                            "dstFactor": "one-minus-src-alpha",
                            "operation": "add"
                        }
                    }
                }]
            },
            "primitive": {
                "topology": "triangle-list",
                "cullMode": "none"
            }
        });
        this.pipelines.set("texture_erase", eraseTexturePipeline);

        // ブラーフィルター用テクスチャコピーパイプライン（オフセット位置にコピー、範囲外透明）
        const blurCopyFragmentShaderModule = this.device.createShaderModule({
            "code": ShaderSource.getBlurTextureCopyFragmentShader()
        });

        const blurTextureCopyPipeline = this.device.createRenderPipeline({
            "layout": pipelineLayout,
            "vertex": {
                "module": vertexShaderModule,
                "entryPoint": "main",
                "buffers": []
            },
            "fragment": {
                "module": blurCopyFragmentShaderModule,
                "entryPoint": "main",
                "targets": [{
                    "format": "rgba8unorm",
                    "blend": {
                        "color": {
                            "srcFactor": "one",
                            "dstFactor": "zero",
                            "operation": "add"
                        },
                        "alpha": {
                            "srcFactor": "one",
                            "dstFactor": "zero",
                            "operation": "add"
                        }
                    }
                }]
            },
            "primitive": {
                "topology": "triangle-list",
                "cullMode": "none"
            }
        });
        this.pipelines.set("blur_texture_copy", blurTextureCopyPipeline);

        // フィルター出力用（アルファブレンド版）- texture_copyと同じシェーダー、ブレンドモードが異なる
        const filterBlendPipeline = this.device.createRenderPipeline({
            "layout": pipelineLayout,
            "vertex": {
                "module": vertexShaderModule,
                "entryPoint": "main",
                "buffers": []
            },
            "fragment": {
                "module": fragmentShaderModule,
                "entryPoint": "main",
                "targets": [{
                    "format": this.format,
                    "blend": {
                        "color": {
                            "srcFactor": "one",
                            "dstFactor": "one-minus-src-alpha",
                            "operation": "add"
                        },
                        "alpha": {
                            "srcFactor": "one",
                            "dstFactor": "one-minus-src-alpha",
                            "operation": "add"
                        }
                    }
                }]
            },
            "primitive": {
                "topology": "triangle-list",
                "cullMode": "none"
            }
        });
        this.pipelines.set("filter_blend", filterBlendPipeline);

        // スワップチェーン用（既存のthis.formatと同じなので削除候補だが互換性のため残す）
        const pipelineBGRA = this.device.createRenderPipeline({
            "layout": pipelineLayout,
            "vertex": {
                "module": vertexShaderModule,
                "entryPoint": "main",
                "buffers": []
            },
            "fragment": {
                "module": fragmentShaderModule,
                "entryPoint": "main",
                "targets": [{
                    "format": this.format,
                    "blend": {
                        "color": {
                            "srcFactor": "one",
                            "dstFactor": "zero",
                            "operation": "add"
                        },
                        "alpha": {
                            "srcFactor": "one",
                            "dstFactor": "zero",
                            "operation": "add"
                        }
                    }
                }]
            },
            "primitive": {
                "topology": "triangle-list",
                "cullMode": "none"
            }
        });
        this.pipelines.set("texture_copy_bgra", pipelineBGRA);

        // フィルター出力用パイプライン（アルファブレンド、範囲チェック付き）
        const filterOutputShaderModule = this.device.createShaderModule({
            "code": ShaderSource.getFilterOutputFragmentShader()
        });

        const filterOutputPipeline = this.device.createRenderPipeline({
            "layout": pipelineLayout,
            "vertex": {
                "module": vertexShaderModule,
                "entryPoint": "main",
                "buffers": []
            },
            "fragment": {
                "module": filterOutputShaderModule,
                "entryPoint": "main",
                "targets": [{
                    "format": this.format,
                    "blend": {
                        "color": {
                            "srcFactor": "one",
                            "dstFactor": "one-minus-src-alpha",
                            "operation": "add"
                        },
                        "alpha": {
                            "srcFactor": "one",
                            "dstFactor": "one-minus-src-alpha",
                            "operation": "add"
                        }
                    }
                }]
            },
            "primitive": {
                "topology": "triangle-list",
                "cullMode": "none"
            }
        });
        this.pipelines.set("filter_output", filterOutputPipeline);

        // === フィルター出力用ブレンドモード対応パイプライン ===

        // ADD ブレンドモード用（加算ブレンド）
        const filterOutputAddPipeline = this.device.createRenderPipeline({
            "layout": pipelineLayout,
            "vertex": {
                "module": vertexShaderModule,
                "entryPoint": "main",
                "buffers": []
            },
            "fragment": {
                "module": filterOutputShaderModule,
                "entryPoint": "main",
                "targets": [{
                    "format": this.format,
                    "blend": {
                        "color": {
                            "srcFactor": "one",
                            "dstFactor": "one",
                            "operation": "add"
                        },
                        "alpha": {
                            "srcFactor": "one",
                            "dstFactor": "one",
                            "operation": "add"
                        }
                    }
                }]
            },
            "primitive": {
                "topology": "triangle-list",
                "cullMode": "none"
            }
        });
        this.pipelines.set("filter_output_add", filterOutputAddPipeline);

        // SCREEN ブレンドモード用
        const filterOutputScreenPipeline = this.device.createRenderPipeline({
            "layout": pipelineLayout,
            "vertex": {
                "module": vertexShaderModule,
                "entryPoint": "main",
                "buffers": []
            },
            "fragment": {
                "module": filterOutputShaderModule,
                "entryPoint": "main",
                "targets": [{
                    "format": this.format,
                    "blend": {
                        "color": {
                            "srcFactor": "one",
                            "dstFactor": "one-minus-src",
                            "operation": "add"
                        },
                        "alpha": {
                            "srcFactor": "one",
                            "dstFactor": "one-minus-src-alpha",
                            "operation": "add"
                        }
                    }
                }]
            },
            "primitive": {
                "topology": "triangle-list",
                "cullMode": "none"
            }
        });
        this.pipelines.set("filter_output_screen", filterOutputScreenPipeline);

        // ALPHA ブレンドモード用（デスティネーションアルファを使用）
        const filterOutputAlphaPipeline = this.device.createRenderPipeline({
            "layout": pipelineLayout,
            "vertex": {
                "module": vertexShaderModule,
                "entryPoint": "main",
                "buffers": []
            },
            "fragment": {
                "module": filterOutputShaderModule,
                "entryPoint": "main",
                "targets": [{
                    "format": this.format,
                    "blend": {
                        "color": {
                            "srcFactor": "zero",
                            "dstFactor": "src-alpha",
                            "operation": "add"
                        },
                        "alpha": {
                            "srcFactor": "zero",
                            "dstFactor": "src-alpha",
                            "operation": "add"
                        }
                    }
                }]
            },
            "primitive": {
                "topology": "triangle-list",
                "cullMode": "none"
            }
        });
        this.pipelines.set("filter_output_alpha", filterOutputAlphaPipeline);

        // ERASE ブレンドモード用
        const filterOutputErasePipeline = this.device.createRenderPipeline({
            "layout": pipelineLayout,
            "vertex": {
                "module": vertexShaderModule,
                "entryPoint": "main",
                "buffers": []
            },
            "fragment": {
                "module": filterOutputShaderModule,
                "entryPoint": "main",
                "targets": [{
                    "format": this.format,
                    "blend": {
                        "color": {
                            "srcFactor": "zero",
                            "dstFactor": "one-minus-src-alpha",
                            "operation": "add"
                        },
                        "alpha": {
                            "srcFactor": "zero",
                            "dstFactor": "one-minus-src-alpha",
                            "operation": "add"
                        }
                    }
                }]
            },
            "primitive": {
                "topology": "triangle-list",
                "cullMode": "none"
            }
        });
        this.pipelines.set("filter_output_erase", filterOutputErasePipeline);

        // === 位置変換付きテクスチャ描画パイプライン（複雑なブレンド結果の描画用） ===
        this.createPositionedTexturePipeline();

        // === スケール変換パイプライン（複雑なブレンドモードでスケールが適用されている場合に使用） ===
        this.createTextureScalePipeline();
    }

    /**
     * @description 位置変換付きテクスチャ描画パイプラインを作成
     *              複雑なブレンドモードの結果をメインアタッチメントに描画するために使用
     * @return {void}
     */
    private createPositionedTexturePipeline(): void
    {
        const bindGroupLayout = this.device.createBindGroupLayout({
            "entries": [
                {
                    "binding": 0,
                    "visibility": GPUShaderStage.VERTEX,
                    "buffer": { "type": "uniform" }
                },
                {
                    "binding": 1,
                    "visibility": GPUShaderStage.FRAGMENT,
                    "sampler": {}
                },
                {
                    "binding": 2,
                    "visibility": GPUShaderStage.FRAGMENT,
                    "texture": {}
                }
            ]
        });

        this.bindGroupLayouts.set("positioned_texture", bindGroupLayout);

        const pipelineLayout = this.device.createPipelineLayout({
            "bindGroupLayouts": [bindGroupLayout]
        });

        const vertexShaderModule = this.device.createShaderModule({
            "code": ShaderSource.getPositionedTextureVertexShader()
        });

        const fragmentShaderModule = this.device.createShaderModule({
            "code": ShaderSource.getPositionedTextureFragmentShader()
        });

        // BGRA形式（メインアタッチメント用）
        const pipeline = this.device.createRenderPipeline({
            "layout": pipelineLayout,
            "vertex": {
                "module": vertexShaderModule,
                "entryPoint": "main",
                "buffers": []
            },
            "fragment": {
                "module": fragmentShaderModule,
                "entryPoint": "main",
                "targets": [{
                    "format": this.format,
                    "blend": {
                        "color": {
                            "srcFactor": "one",
                            "dstFactor": "one-minus-src-alpha",
                            "operation": "add"
                        },
                        "alpha": {
                            "srcFactor": "one",
                            "dstFactor": "one-minus-src-alpha",
                            "operation": "add"
                        }
                    }
                }]
            },
            "primitive": {
                "topology": "triangle-list",
                "cullMode": "none"
            }
        });
        this.pipelines.set("positioned_texture", pipeline);

        // RGBA形式（一時アタッチメント用）
        const pipelineRGBA = this.device.createRenderPipeline({
            "layout": pipelineLayout,
            "vertex": {
                "module": vertexShaderModule,
                "entryPoint": "main",
                "buffers": []
            },
            "fragment": {
                "module": fragmentShaderModule,
                "entryPoint": "main",
                "targets": [{
                    "format": "rgba8unorm",
                    "blend": {
                        "color": {
                            "srcFactor": "one",
                            "dstFactor": "one-minus-src-alpha",
                            "operation": "add"
                        },
                        "alpha": {
                            "srcFactor": "one",
                            "dstFactor": "one-minus-src-alpha",
                            "operation": "add"
                        }
                    }
                }]
            },
            "primitive": {
                "topology": "triangle-list",
                "cullMode": "none"
            }
        });
        this.pipelines.set("positioned_texture_rgba", pipelineRGBA);

        // RGBA形式 + MSAA対応（アトラステクスチャへのbitmap/TextField描画用）
        // ノード再利用時に以前の内容が透けないよう、完全上書き（dstFactor: zero）を使用
        const pipelineMsaa = this.device.createRenderPipeline({
            "layout": pipelineLayout,
            "vertex": {
                "module": vertexShaderModule,
                "entryPoint": "main",
                "buffers": []
            },
            "fragment": {
                "module": fragmentShaderModule,
                "entryPoint": "main",
                "targets": [{
                    "format": "rgba8unorm",
                    "blend": {
                        "color": {
                            "srcFactor": "one",
                            "dstFactor": "zero",
                            "operation": "add"
                        },
                        "alpha": {
                            "srcFactor": "one",
                            "dstFactor": "zero",
                            "operation": "add"
                        }
                    }
                }]
            },
            "primitive": {
                "topology": "triangle-list",
                "cullMode": "none"
            },
            "multisample": {
                "count": 4
            },
            // アトラステクスチャにはステンシルバッファがあるため
            "depthStencil": {
                "format": "stencil8",
                "stencilFront": {
                    "compare": "always",
                    "failOp": "keep",
                    "depthFailOp": "keep",
                    "passOp": "keep"
                },
                "stencilBack": {
                    "compare": "always",
                    "failOp": "keep",
                    "depthFailOp": "keep",
                    "passOp": "keep"
                }
            }
        });
        this.pipelines.set("bitmap_render_msaa", pipelineMsaa);

        // RGBA形式（アトラステクスチャへのbitmap/TextField描画用）非MSAA版
        // ノード再利用時に以前の内容が透けないよう、完全上書き（dstFactor: zero）を使用
        const pipelineNonMsaa = this.device.createRenderPipeline({
            "layout": pipelineLayout,
            "vertex": {
                "module": vertexShaderModule,
                "entryPoint": "main",
                "buffers": []
            },
            "fragment": {
                "module": fragmentShaderModule,
                "entryPoint": "main",
                "targets": [{
                    "format": "rgba8unorm",
                    "blend": {
                        "color": {
                            "srcFactor": "one",
                            "dstFactor": "zero",
                            "operation": "add"
                        },
                        "alpha": {
                            "srcFactor": "one",
                            "dstFactor": "zero",
                            "operation": "add"
                        }
                    }
                }]
            },
            "primitive": {
                "topology": "triangle-list",
                "cullMode": "none"
            },
            // アトラステクスチャにはステンシルバッファがあるため
            "depthStencil": {
                "format": "stencil8",
                "stencilFront": {
                    "compare": "always",
                    "failOp": "keep",
                    "depthFailOp": "keep",
                    "passOp": "keep"
                },
                "stencilBack": {
                    "compare": "always",
                    "failOp": "keep",
                    "depthFailOp": "keep",
                    "passOp": "keep"
                }
            }
        });
        this.pipelines.set("bitmap_render", pipelineNonMsaa);
    }

    /**
     * @description スケール変換パイプラインを作成
     *              複雑なブレンドモードでスケールが適用されている場合に、
     *              元のテクスチャをスケール変換するために使用
     * @return {void}
     */
    private createTextureScalePipeline(): void
    {
        const bindGroupLayout = this.device.createBindGroupLayout({
            "entries": [
                {
                    "binding": 0,
                    "visibility": GPUShaderStage.VERTEX,
                    "buffer": { "type": "uniform" }
                },
                {
                    "binding": 1,
                    "visibility": GPUShaderStage.FRAGMENT,
                    "sampler": {}
                },
                {
                    "binding": 2,
                    "visibility": GPUShaderStage.FRAGMENT,
                    "texture": {}
                }
            ]
        });

        this.bindGroupLayouts.set("texture_scale", bindGroupLayout);

        const pipelineLayout = this.device.createPipelineLayout({
            "bindGroupLayouts": [bindGroupLayout]
        });

        const vertexShaderModule = this.device.createShaderModule({
            "code": ShaderSource.getTextureScaleVertexShader()
        });

        const fragmentShaderModule = this.device.createShaderModule({
            "code": ShaderSource.getPositionedTextureFragmentShader()
        });

        // RGBA形式（一時アタッチメント用）
        const pipeline = this.device.createRenderPipeline({
            "layout": pipelineLayout,
            "vertex": {
                "module": vertexShaderModule,
                "entryPoint": "main",
                "buffers": []
            },
            "fragment": {
                "module": fragmentShaderModule,
                "entryPoint": "main",
                "targets": [{
                    "format": "rgba8unorm",
                    "blend": {
                        "color": {
                            "srcFactor": "one",
                            "dstFactor": "zero",
                            "operation": "add"
                        },
                        "alpha": {
                            "srcFactor": "one",
                            "dstFactor": "zero",
                            "operation": "add"
                        }
                    }
                }]
            },
            "primitive": {
                "topology": "triangle-list",
                "cullMode": "none"
            }
        });
        this.pipelines.set("texture_scale", pipeline);

        // 複雑なブレンドモード用スケール変換パイプライン（テクスチャ座標Y反転あり）
        const blendVertexShaderModule = this.device.createShaderModule({
            "code": ShaderSource.getTextureScaleBlendVertexShader()
        });

        const blendPipeline = this.device.createRenderPipeline({
            "layout": pipelineLayout,
            "vertex": {
                "module": blendVertexShaderModule,
                "entryPoint": "main",
                "buffers": []
            },
            "fragment": {
                "module": fragmentShaderModule,
                "entryPoint": "main",
                "targets": [{
                    "format": "rgba8unorm",
                    "blend": {
                        "color": {
                            "srcFactor": "one",
                            "dstFactor": "zero",
                            "operation": "add"
                        },
                        "alpha": {
                            "srcFactor": "one",
                            "dstFactor": "zero",
                            "operation": "add"
                        }
                    }
                }]
            },
            "primitive": {
                "topology": "triangle-list",
                "cullMode": "none"
            }
        });
        this.pipelines.set("texture_scale_blend", blendPipeline);
    }

    /**
     * @description Bitmap同期用パイプラインを作成
     *              writeTextureで書き込んだ内容をMSAAテクスチャにコピーするために使用
     *              特定のnode領域のみをコピーするためにuniformで座標を指定
     * @return {void}
     */
    private createBitmapSyncPipeline(): void
    {
        // bitmap_sync専用のbind group layoutを作成
        // uniformはvertex shaderで使用（座標計算用）
        const bindGroupLayout = this.device.createBindGroupLayout({
            "entries": [
                {
                    "binding": 0,
                    "visibility": GPUShaderStage.VERTEX,
                    "buffer": { "type": "uniform" }
                },
                {
                    "binding": 1,
                    "visibility": GPUShaderStage.FRAGMENT,
                    "sampler": { "type": "filtering" }
                },
                {
                    "binding": 2,
                    "visibility": GPUShaderStage.FRAGMENT,
                    "texture": { "sampleType": "float" }
                }
            ]
        });
        this.bindGroupLayouts.set("bitmap_sync", bindGroupLayout);

        const pipelineLayout = this.device.createPipelineLayout({
            "bindGroupLayouts": [bindGroupLayout]
        });

        // BitmapSync用vertex shader（node領域の座標計算）
        const vertexShaderModule = this.device.createShaderModule({
            "code": ShaderSource.getBitmapSyncVertexShader()
        });

        // BitmapSync用fragment shader（uniformsなしでシンプルにサンプリング）
        const fragmentShaderModule = this.device.createShaderModule({
            "code": ShaderSource.getBitmapSyncFragmentShader()
        });

        // RGBA8形式（アトラステクスチャ用）- MSAAサンプルカウント対応
        const pipeline = this.device.createRenderPipeline({
            "layout": pipelineLayout,
            "vertex": {
                "module": vertexShaderModule,
                "entryPoint": "main",
                "buffers": []
            },
            "fragment": {
                "module": fragmentShaderModule,
                "entryPoint": "main",
                "targets": [{
                    "format": "rgba8unorm",
                    "blend": {
                        "color": {
                            "srcFactor": "one",
                            "dstFactor": "zero",
                            "operation": "add"
                        },
                        "alpha": {
                            "srcFactor": "one",
                            "dstFactor": "zero",
                            "operation": "add"
                        }
                    }
                }]
            },
            "primitive": {
                "topology": "triangle-list",
                "cullMode": "none"
            },
            // MSAAテクスチャに描画するためsampleCountを設定
            "multisample": {
                "count": 4 // $samplesと同じ値
            }
        });
        this.pipelines.set("bitmap_sync", pipeline);
    }

    /**
     * @description カラーマトリックスフィルター用パイプラインを作成
     * @return {void}
     */
    private createColorMatrixFilterPipeline(): void
    {
        const bindGroupLayout = this.device.createBindGroupLayout({
            "entries": [
                {
                    "binding": 0,
                    "visibility": GPUShaderStage.FRAGMENT,
                    "buffer": { "type": "uniform" }
                },
                {
                    "binding": 1,
                    "visibility": GPUShaderStage.FRAGMENT,
                    "sampler": {}
                },
                {
                    "binding": 2,
                    "visibility": GPUShaderStage.FRAGMENT,
                    "texture": {}
                }
            ]
        });

        this.bindGroupLayouts.set("color_matrix_filter", bindGroupLayout);

        const pipelineLayout = this.device.createPipelineLayout({
            "bindGroupLayouts": [bindGroupLayout]
        });

        const vertexShaderModule = this.device.createShaderModule({
            "code": ShaderSource.getBlurFilterVertexShader() // 同じフルスクリーンクワッド
        });

        const fragmentShaderModule = this.device.createShaderModule({
            "code": ShaderSource.getColorMatrixFilterFragmentShader()
        });

        const pipeline = this.device.createRenderPipeline({
            "layout": pipelineLayout,
            "vertex": {
                "module": vertexShaderModule,
                "entryPoint": "main",
                "buffers": []
            },
            "fragment": {
                "module": fragmentShaderModule,
                "entryPoint": "main",
                "targets": [{
                    "format": "rgba8unorm",
                    "blend": {
                        "color": {
                            "srcFactor": "one",
                            "dstFactor": "zero",
                            "operation": "add"
                        },
                        "alpha": {
                            "srcFactor": "one",
                            "dstFactor": "zero",
                            "operation": "add"
                        }
                    }
                }]
            },
            "primitive": {
                "topology": "triangle-list",
                "cullMode": "none"
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
            "entries": [
                {
                    "binding": 0,
                    "visibility": GPUShaderStage.FRAGMENT,
                    "buffer": { "type": "uniform" }
                },
                {
                    "binding": 1,
                    "visibility": GPUShaderStage.FRAGMENT,
                    "sampler": {}
                },
                {
                    "binding": 2,
                    "visibility": GPUShaderStage.FRAGMENT,
                    "texture": {}
                },
                {
                    "binding": 3,
                    "visibility": GPUShaderStage.FRAGMENT,
                    "texture": {}
                }
            ]
        });

        this.bindGroupLayouts.set("glow_filter", bindGroupLayout);

        const pipelineLayout = this.device.createPipelineLayout({
            "bindGroupLayouts": [bindGroupLayout]
        });

        const vertexShaderModule = this.device.createShaderModule({
            "code": ShaderSource.getBlurFilterVertexShader()
        });

        const fragmentShaderModule = this.device.createShaderModule({
            "code": ShaderSource.getGlowFilterFragmentShader()
        });

        const pipeline = this.device.createRenderPipeline({
            "layout": pipelineLayout,
            "vertex": {
                "module": vertexShaderModule,
                "entryPoint": "main",
                "buffers": []
            },
            "fragment": {
                "module": fragmentShaderModule,
                "entryPoint": "main",
                "targets": [{
                    "format": "rgba8unorm",
                    "blend": {
                        "color": {
                            "srcFactor": "one",
                            "dstFactor": "one-minus-src-alpha",
                            "operation": "add"
                        },
                        "alpha": {
                            "srcFactor": "one",
                            "dstFactor": "one-minus-src-alpha",
                            "operation": "add"
                        }
                    }
                }]
            },
            "primitive": {
                "topology": "triangle-list",
                "cullMode": "none"
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
            "entries": [
                {
                    "binding": 0,
                    "visibility": GPUShaderStage.FRAGMENT,
                    "buffer": { "type": "uniform" }
                },
                {
                    "binding": 1,
                    "visibility": GPUShaderStage.FRAGMENT,
                    "sampler": {}
                },
                {
                    "binding": 2,
                    "visibility": GPUShaderStage.FRAGMENT,
                    "texture": {}
                },
                {
                    "binding": 3,
                    "visibility": GPUShaderStage.FRAGMENT,
                    "texture": {}
                }
            ]
        });

        this.bindGroupLayouts.set("drop_shadow_filter", bindGroupLayout);

        const pipelineLayout = this.device.createPipelineLayout({
            "bindGroupLayouts": [bindGroupLayout]
        });

        const vertexShaderModule = this.device.createShaderModule({
            "code": ShaderSource.getBlurFilterVertexShader()
        });

        const fragmentShaderModule = this.device.createShaderModule({
            "code": ShaderSource.getDropShadowFilterFragmentShader()
        });

        const pipeline = this.device.createRenderPipeline({
            "layout": pipelineLayout,
            "vertex": {
                "module": vertexShaderModule,
                "entryPoint": "main",
                "buffers": []
            },
            "fragment": {
                "module": fragmentShaderModule,
                "entryPoint": "main",
                "targets": [{
                    "format": "rgba8unorm",
                    "blend": {
                        "color": {
                            "srcFactor": "one",
                            "dstFactor": "one-minus-src-alpha",
                            "operation": "add"
                        },
                        "alpha": {
                            "srcFactor": "one",
                            "dstFactor": "one-minus-src-alpha",
                            "operation": "add"
                        }
                    }
                }]
            },
            "primitive": {
                "topology": "triangle-list",
                "cullMode": "none"
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
            "entries": [
                {
                    "binding": 0,
                    "visibility": GPUShaderStage.FRAGMENT,
                    "buffer": { "type": "uniform" }
                },
                {
                    "binding": 1,
                    "visibility": GPUShaderStage.FRAGMENT,
                    "sampler": {}
                },
                {
                    "binding": 2,
                    "visibility": GPUShaderStage.FRAGMENT,
                    "texture": {}
                },
                {
                    "binding": 3,
                    "visibility": GPUShaderStage.FRAGMENT,
                    "texture": {}
                }
            ]
        });

        this.bindGroupLayouts.set("bevel_filter", bindGroupLayout);

        const pipelineLayout = this.device.createPipelineLayout({
            "bindGroupLayouts": [bindGroupLayout]
        });

        const vertexShaderModule = this.device.createShaderModule({
            "code": ShaderSource.getBlurFilterVertexShader()
        });

        const fragmentShaderModule = this.device.createShaderModule({
            "code": ShaderSource.getBevelFilterFragmentShader()
        });

        const pipeline = this.device.createRenderPipeline({
            "layout": pipelineLayout,
            "vertex": {
                "module": vertexShaderModule,
                "entryPoint": "main",
                "buffers": []
            },
            "fragment": {
                "module": fragmentShaderModule,
                "entryPoint": "main",
                "targets": [{
                    "format": "rgba8unorm",
                    "blend": {
                        "color": {
                            "srcFactor": "one",
                            "dstFactor": "one-minus-src-alpha",
                            "operation": "add"
                        },
                        "alpha": {
                            "srcFactor": "one",
                            "dstFactor": "one-minus-src-alpha",
                            "operation": "add"
                        }
                    }
                }]
            },
            "primitive": {
                "topology": "triangle-list",
                "cullMode": "none"
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
            "entries": [
                {
                    "binding": 0,
                    "visibility": GPUShaderStage.FRAGMENT,
                    "buffer": { "type": "uniform" }
                },
                {
                    "binding": 1,
                    "visibility": GPUShaderStage.FRAGMENT,
                    "sampler": {}
                },
                {
                    "binding": 2,
                    "visibility": GPUShaderStage.FRAGMENT,
                    "texture": {}
                },
                {
                    "binding": 3,
                    "visibility": GPUShaderStage.FRAGMENT,
                    "texture": {}
                },
                {
                    "binding": 4,
                    "visibility": GPUShaderStage.FRAGMENT,
                    "texture": {}
                }
            ]
        });

        this.bindGroupLayouts.set("gradient_glow_filter", bindGroupLayout);

        const pipelineLayout = this.device.createPipelineLayout({
            "bindGroupLayouts": [bindGroupLayout]
        });

        const vertexShaderModule = this.device.createShaderModule({
            "code": ShaderSource.getBlurFilterVertexShader()
        });

        const fragmentShaderModule = this.device.createShaderModule({
            "code": ShaderSource.getGradientGlowFilterFragmentShader()
        });

        const pipeline = this.device.createRenderPipeline({
            "layout": pipelineLayout,
            "vertex": {
                "module": vertexShaderModule,
                "entryPoint": "main",
                "buffers": []
            },
            "fragment": {
                "module": fragmentShaderModule,
                "entryPoint": "main",
                "targets": [{
                    "format": "rgba8unorm",
                    "blend": {
                        "color": {
                            "srcFactor": "one",
                            "dstFactor": "one-minus-src-alpha",
                            "operation": "add"
                        },
                        "alpha": {
                            "srcFactor": "one",
                            "dstFactor": "one-minus-src-alpha",
                            "operation": "add"
                        }
                    }
                }]
            },
            "primitive": {
                "topology": "triangle-list",
                "cullMode": "none"
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
            "entries": [
                {
                    "binding": 0,
                    "visibility": GPUShaderStage.FRAGMENT,
                    "buffer": { "type": "uniform" }
                },
                {
                    "binding": 1,
                    "visibility": GPUShaderStage.FRAGMENT,
                    "sampler": {}
                },
                {
                    "binding": 2,
                    "visibility": GPUShaderStage.FRAGMENT,
                    "texture": {}
                },
                {
                    "binding": 3,
                    "visibility": GPUShaderStage.FRAGMENT,
                    "texture": {}
                },
                {
                    "binding": 4,
                    "visibility": GPUShaderStage.FRAGMENT,
                    "texture": {}
                }
            ]
        });

        this.bindGroupLayouts.set("gradient_bevel_filter", bindGroupLayout);

        const pipelineLayout = this.device.createPipelineLayout({
            "bindGroupLayouts": [bindGroupLayout]
        });

        const vertexShaderModule = this.device.createShaderModule({
            "code": ShaderSource.getBlurFilterVertexShader()
        });

        const fragmentShaderModule = this.device.createShaderModule({
            "code": ShaderSource.getGradientBevelFilterFragmentShader()
        });

        const pipeline = this.device.createRenderPipeline({
            "layout": pipelineLayout,
            "vertex": {
                "module": vertexShaderModule,
                "entryPoint": "main",
                "buffers": []
            },
            "fragment": {
                "module": fragmentShaderModule,
                "entryPoint": "main",
                "targets": [{
                    "format": "rgba8unorm",
                    "blend": {
                        "color": {
                            "srcFactor": "one",
                            "dstFactor": "one-minus-src-alpha",
                            "operation": "add"
                        },
                        "alpha": {
                            "srcFactor": "one",
                            "dstFactor": "one-minus-src-alpha",
                            "operation": "add"
                        }
                    }
                }]
            },
            "primitive": {
                "topology": "triangle-list",
                "cullMode": "none"
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
            "entries": [
                {
                    "binding": 0,
                    "visibility": GPUShaderStage.FRAGMENT,
                    "buffer": { "type": "uniform" }
                },
                {
                    "binding": 1,
                    "visibility": GPUShaderStage.FRAGMENT,
                    "sampler": {}
                },
                {
                    "binding": 2,
                    "visibility": GPUShaderStage.FRAGMENT,
                    "texture": {}
                },
                {
                    "binding": 3,
                    "visibility": GPUShaderStage.FRAGMENT,
                    "texture": {}
                }
            ]
        });

        this.bindGroupLayouts.set("complex_blend", bindGroupLayout);

        const pipelineLayout = this.device.createPipelineLayout({
            "bindGroupLayouts": [bindGroupLayout]
        });

        // 複雑なブレンド用の専用頂点シェーダー（Y軸反転なし）
        const vertexShaderModule = this.device.createShaderModule({
            "code": ShaderSource.getComplexBlendVertexShader()
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
                "code": ShaderSource.getComplexBlendFragmentShader(blendMode)
            });

            const pipeline = this.device.createRenderPipeline({
                "layout": pipelineLayout,
                "vertex": {
                    "module": vertexShaderModule,
                    "entryPoint": "main",
                    "buffers": []
                },
                "fragment": {
                    "module": fragmentShaderModule,
                    "entryPoint": "main",
                    "targets": [{
                        "format": "rgba8unorm",
                        "blend": {
                            "color": {
                                "srcFactor": "one",
                                "dstFactor": "zero",
                                "operation": "add"
                            },
                            "alpha": {
                                "srcFactor": "one",
                                "dstFactor": "zero",
                                "operation": "add"
                            }
                        }
                    }]
                },
                "primitive": {
                    "topology": "triangle-list",
                    "cullMode": "none"
                }
            });

            this.pipelines.set(`complex_blend_${blendMode}`, pipeline);
        }

        // 複雑なブレンド用テクスチャコピーパイプライン（Y軸反転なし）
        this.createComplexBlendCopyPipeline();

        // 複雑なブレンド用スケール変換パイプライン（Y軸反転なし）
        this.createComplexBlendScalePipeline();

        // 複雑なブレンド用結果描画パイプライン（Y軸反転なし）
        this.createComplexBlendOutputPipeline();

        // フィルター＋複雑なブレンド用結果描画パイプライン（Y軸反転あり）
        this.createFilterComplexBlendOutputPipeline();
    }

    /**
     * @description 複雑なブレンド用テクスチャコピーパイプラインを作成
     *              mainAttachmentからdstAttachmentへのコピー用（Y軸反転なし）
     * @return {void}
     */
    private createComplexBlendCopyPipeline(): void
    {
        const bindGroupLayout = this.bindGroupLayouts.get("texture_copy");
        if (!bindGroupLayout) {
            return;
        }

        const pipelineLayout = this.device.createPipelineLayout({
            "bindGroupLayouts": [bindGroupLayout]
        });

        // 複雑なブレンド用の専用頂点シェーダー（Y軸反転なし）
        const vertexShaderModule = this.device.createShaderModule({
            "code": ShaderSource.getComplexBlendCopyVertexShader()
        });

        const fragmentShaderModule = this.device.createShaderModule({
            "code": ShaderSource.getTextureCopyFragmentShader()
        });

        const pipeline = this.device.createRenderPipeline({
            "layout": pipelineLayout,
            "vertex": {
                "module": vertexShaderModule,
                "entryPoint": "main",
                "buffers": []
            },
            "fragment": {
                "module": fragmentShaderModule,
                "entryPoint": "main",
                "targets": [{
                    "format": "rgba8unorm",
                    "blend": {
                        "color": {
                            "srcFactor": "one",
                            "dstFactor": "zero",
                            "operation": "add"
                        },
                        "alpha": {
                            "srcFactor": "one",
                            "dstFactor": "zero",
                            "operation": "add"
                        }
                    }
                }]
            },
            "primitive": {
                "topology": "triangle-list",
                "cullMode": "none"
            }
        });

        this.pipelines.set("complex_blend_copy", pipeline);
    }

    /**
     * @description 複雑なブレンド用スケール変換パイプラインを作成
     *              アトラスからsrcAttachmentへのスケール変換用（Y軸反転なし）
     * @return {void}
     */
    private createComplexBlendScalePipeline(): void
    {
        const bindGroupLayout = this.bindGroupLayouts.get("texture_scale");
        if (!bindGroupLayout) {
            return;
        }

        const pipelineLayout = this.device.createPipelineLayout({
            "bindGroupLayouts": [bindGroupLayout]
        });

        // 複雑なブレンド用の専用スケール変換頂点シェーダー（Y軸反転なし）
        const vertexShaderModule = this.device.createShaderModule({
            "code": ShaderSource.getComplexBlendScaleVertexShader()
        });

        // texture_scaleパイプラインと同じフラグメントシェーダーを使用
        const fragmentShaderModule = this.device.createShaderModule({
            "code": ShaderSource.getPositionedTextureFragmentShader()
        });

        const pipeline = this.device.createRenderPipeline({
            "layout": pipelineLayout,
            "vertex": {
                "module": vertexShaderModule,
                "entryPoint": "main",
                "buffers": []
            },
            "fragment": {
                "module": fragmentShaderModule,
                "entryPoint": "main",
                "targets": [{
                    "format": "rgba8unorm",
                    "blend": {
                        "color": {
                            "srcFactor": "one",
                            "dstFactor": "zero",
                            "operation": "add"
                        },
                        "alpha": {
                            "srcFactor": "one",
                            "dstFactor": "zero",
                            "operation": "add"
                        }
                    }
                }]
            },
            "primitive": {
                "topology": "triangle-list",
                "cullMode": "none"
            }
        });

        this.pipelines.set("complex_blend_scale", pipeline);
    }

    /**
     * @description 複雑なブレンド用結果描画パイプラインを作成
     *              ブレンド結果をmainAttachmentに描画する用（Y軸反転なし）
     * @return {void}
     */
    private createComplexBlendOutputPipeline(): void
    {
        const bindGroupLayout = this.bindGroupLayouts.get("positioned_texture");
        if (!bindGroupLayout) {
            return;
        }

        const pipelineLayout = this.device.createPipelineLayout({
            "bindGroupLayouts": [bindGroupLayout]
        });

        // 複雑なブレンド用の専用出力頂点シェーダー（Y軸反転なし）
        const vertexShaderModule = this.device.createShaderModule({
            "code": ShaderSource.getComplexBlendOutputVertexShader()
        });

        const fragmentShaderModule = this.device.createShaderModule({
            "code": ShaderSource.getPositionedTextureFragmentShader()
        });

        const pipeline = this.device.createRenderPipeline({
            "layout": pipelineLayout,
            "vertex": {
                "module": vertexShaderModule,
                "entryPoint": "main",
                "buffers": []
            },
            "fragment": {
                "module": fragmentShaderModule,
                "entryPoint": "main",
                "targets": [{
                    "format": this.format,
                    "blend": {
                        "color": {
                            "srcFactor": "one",
                            "dstFactor": "one-minus-src-alpha",
                            "operation": "add"
                        },
                        "alpha": {
                            "srcFactor": "one",
                            "dstFactor": "one-minus-src-alpha",
                            "operation": "add"
                        }
                    }
                }]
            },
            "primitive": {
                "topology": "triangle-list",
                "cullMode": "none"
            }
        });

        this.pipelines.set("complex_blend_output", pipeline);
    }

    /**
     * @description フィルター＋複雑なブレンド用結果描画パイプラインを作成
     *              フィルター適用後のブレンド結果をmainAttachmentに描画する用（Y軸反転あり）
     * @return {void}
     */
    private createFilterComplexBlendOutputPipeline(): void
    {
        const bindGroupLayout = this.bindGroupLayouts.get("positioned_texture");
        if (!bindGroupLayout) {
            return;
        }

        const pipelineLayout = this.device.createPipelineLayout({
            "bindGroupLayouts": [bindGroupLayout]
        });

        // フィルター＋複雑なブレンド用の専用出力頂点シェーダー（Y軸反転あり）
        const vertexShaderModule = this.device.createShaderModule({
            "code": ShaderSource.getFilterComplexBlendOutputVertexShader()
        });

        const fragmentShaderModule = this.device.createShaderModule({
            "code": ShaderSource.getPositionedTextureFragmentShader()
        });

        const pipeline = this.device.createRenderPipeline({
            "layout": pipelineLayout,
            "vertex": {
                "module": vertexShaderModule,
                "entryPoint": "main",
                "buffers": []
            },
            "fragment": {
                "module": fragmentShaderModule,
                "entryPoint": "main",
                "targets": [{
                    "format": this.format,
                    "blend": {
                        "color": {
                            "srcFactor": "one",
                            "dstFactor": "one-minus-src-alpha",
                            "operation": "add"
                        },
                        "alpha": {
                            "srcFactor": "one",
                            "dstFactor": "one-minus-src-alpha",
                            "operation": "add"
                        }
                    }
                }]
            },
            "primitive": {
                "topology": "triangle-list",
                "cullMode": "none"
            }
        });

        this.pipelines.set("filter_complex_blend_output", pipeline);
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
     * @description ノードクリア用パイプラインを作成
     *              アトラスノード領域を透明にクリアするために使用
     * @return {void}
     */
    private createNodeClearPipeline(): void
    {
        // シンプルな頂点バッファレイアウト（position: vec2のみ）
        const vertexBufferLayout: GPUVertexBufferLayout = {
            "arrayStride": 2 * 4, // 2 floats (8 bytes)
            "attributes": [
                {
                    "shaderLocation": 0,
                    "offset": 0,
                    "format": "float32x2" // position (2 floats)
                }
            ]
        };

        // ノードクリア用パイプライン（アトラス用、ステンシル付き）
        const nodeClearPipeline = this.device.createRenderPipeline({
            "layout": "auto",
            "vertex": {
                "module": this.device.createShaderModule({
                    "code": ShaderSource.getNodeClearVertexShader()
                }),
                "entryPoint": "main",
                "buffers": [vertexBufferLayout]
            },
            "fragment": {
                "module": this.device.createShaderModule({
                    "code": ShaderSource.getNodeClearFragmentShader()
                }),
                "entryPoint": "main",
                "targets": [{
                    "format": "rgba8unorm", // アトラスフォーマット
                    "blend": {
                        // ソースで完全に上書き（クリア）
                        "color": {
                            "srcFactor": "one",
                            "dstFactor": "zero",
                            "operation": "add"
                        },
                        "alpha": {
                            "srcFactor": "one",
                            "dstFactor": "zero",
                            "operation": "add"
                        }
                    },
                    "writeMask": GPUColorWrite.ALL
                }]
            },
            "primitive": {
                "topology": "triangle-list",
                "cullMode": "none"
            },
            "depthStencil": {
                "format": "stencil8",
                // ステンシルテストなし、ステンシルをクリア
                "stencilFront": {
                    "compare": "always",
                    "failOp": "zero",
                    "depthFailOp": "zero",
                    "passOp": "zero"
                },
                "stencilBack": {
                    "compare": "always",
                    "failOp": "zero",
                    "depthFailOp": "zero",
                    "passOp": "zero"
                },
                "stencilReadMask": 0xFF,
                "stencilWriteMask": 0xFF
            },
            "multisample": {
                "count": this.sampleCount // アトラスのMSAA設定に合わせる
            }
        });
        this.pipelines.set("node_clear_atlas", nodeClearPipeline);
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
