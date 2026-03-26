import { ShaderSource } from "./ShaderSource";
import { $samples } from "../WebGPUUtil";

/**
 * @description 4フロートストライドの頂点バッファレイアウト（position: float32x2, uv: float32x2）
 *              Vertex buffer layout with 4-float stride (position: float32x2, uv: float32x2)
 */
const $VERTEX_BUFFER_LAYOUT_4F: GPUVertexBufferLayout = {
    "arrayStride": 4 * 4,
    "attributes": [
        { "shaderLocation": 0, "offset": 0, "format": "float32x2" },
        { "shaderLocation": 1, "offset": 2 * 4, "format": "float32x2" }
    ]
};

/**
 * @description プリマルチプライドアルファのブレンドステート
 *              Premultiplied alpha blend state for standard compositing
 */
const $BLEND_PREMULTIPLIED_ALPHA: GPUBlendState = {
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

/**
 * @description WebGPUレンダーパイプラインの管理クラス。パイプラインとバインドグループレイアウトの生成・キャッシュを行う
 *              Manager class for WebGPU render pipelines. Creates, caches, and manages pipelines and bind group layouts
 */
export class PipelineManager
{
    /**
     * @description GPUデバイスの参照
     *              Reference to the GPU device
     */
    private device: GPUDevice;
    /**
     * @description 出力テクスチャフォーマット
     *              Output texture format
     */
    private format: GPUTextureFormat;
    /**
     * @description パイプライン名からGPURenderPipelineへのキャッシュマップ
     *              Cache map from pipeline name to GPURenderPipeline
     */
    private pipelines: Map<string, GPURenderPipeline>;
    /**
     * @description バインドグループレイアウト名からGPUBindGroupLayoutへのキャッシュマップ
     *              Cache map from layout name to GPUBindGroupLayout
     */
    private bindGroupLayouts: Map<string, GPUBindGroupLayout>;
    /**
     * @description MSAAサンプル数
     *              MSAA sample count
     */
    private sampleCount: number;
    /**
     * @description シェーダーモジュールのキャッシュ
     *              Shader module cache by key
     */
    private shaderModuleCache: Map<string, GPUShaderModule> = new Map();
    /**
     * @description フィルター用バインドグループレイアウトキャッシュ（テクスチャ数別）
     *              Filter bind group layout cache indexed by texture count
     */
    private filterBindGroupLayouts: Map<number, GPUBindGroupLayout> = new Map();

    /**
     * @description PipelineManagerのコンストラクタ。GPUデバイスとフォーマットを設定し、パイプラインを初期化する
     *              Construct PipelineManager. Sets GPU device, format, and initializes pipelines
     * @param {GPUDevice} device - GPUデバイス / GPU device instance
     * @param {GPUTextureFormat} format - テクスチャフォーマット / Texture format for output
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
     * @description シェーダーモジュールをキャッシュから取得、または新規作成する
     *              Get a shader module from cache, or create and cache a new one
     * @param {string} key - キャッシュキー / Cache key
     * @param {string} code - WGSLシェーダーコード / WGSL shader source code
     * @return {GPUShaderModule} シェーダーモジュール / The shader module
     */
    private getOrCreateShaderModule(key: string, code: string): GPUShaderModule
    {
        let module = this.shaderModuleCache.get(key);
        if (!module) {
            module = this.device.createShaderModule({ code });
            this.shaderModuleCache.set(key, module);
        }
        return module;
    }

    /**
     * @description 初期パイプライン群を一括作成する
     *              Create all initial render pipelines
     */
    private initialize(): void
    {
        this.createFillPipeline();
        this.createStencilFillPipelines();
        this.createClipPipeline();
        this.createMaskUnionPipelines();
        this.createMaskPipeline();
        this.createBasicPipeline();
        this.createTexturePipeline();
        this.createInstancedPipeline();
        this.createGradientPipeline();
        this.createBitmapFillPipeline();
        this.createBlendPipeline();
        this.createNodeClearPipeline();
    }

    /**
     * @description 初期化済みの遅延グループ名セット
     *              Set of initialized lazy group names
     */
    private lazyInitGroups: Set<string> = new Set();
    /**
     * @description パイプライン名から遅延初期化グループ名への読み取り専用マップ
     *              Read-only map from pipeline name to lazy initialization group name
     */
    private readonly lazyGroupMap: ReadonlyMap<string, string> = new Map([
        ...Array.from({ "length": 16 }, (_, i): [string, string] => [`blur_filter_${i + 1}`, "blur_filter"]),
        ["blur_filter", "blur_filter"],
        ["texture_copy", "texture_copy"], ["texture_copy_rgba8", "texture_copy"], ["color_transform", "texture_copy"], ["y_flip_color_transform", "texture_copy"],
        ["texture_erase", "texture_copy"], ["blur_texture_copy", "texture_copy"],
        ["filter_blend", "texture_copy"], ["texture_copy_bgra", "texture_copy"],
        ["filter_output", "texture_copy"], ["filter_output_add", "texture_copy"],
        ["filter_output_screen", "texture_copy"], ["filter_output_alpha", "texture_copy"],
        ["filter_output_erase", "texture_copy"], ["texture_copy_bgra_msaa", "texture_copy"],
        ["filter_output_msaa", "texture_copy"], ["filter_output_add_msaa", "texture_copy"],
        ["filter_output_screen_msaa", "texture_copy"], ["filter_output_alpha_msaa", "texture_copy"],
        ["filter_output_erase_msaa", "texture_copy"],
        ["filter_output_masked", "texture_copy"], ["filter_output_masked_msaa", "texture_copy"],
        ["positioned_texture", "texture_copy"], ["positioned_texture_rgba", "texture_copy"],
        ["bitmap_render_msaa", "texture_copy"], ["bitmap_render", "texture_copy"],
        ["texture_scale", "texture_copy"], ["texture_scale_blend", "texture_copy"],
        ["bitmap_sync", "bitmap_sync"],
        ["color_matrix_filter", "filter"], ["bevel_base", "filter"],
        ["glow_filter", "filter"], ["drop_shadow_filter", "filter"],
        ["bevel_filter", "filter"], ["gradient_glow_filter", "filter"],
        ["gradient_bevel_filter", "filter"],
        ["complex_blend", "complex_blend"],
        ["complex_blend_copy", "complex_blend"],
        ["complex_blend_scale", "complex_blend"], ["complex_blend_output", "complex_blend"],
        ["complex_blend_output_msaa", "complex_blend"],
        ["filter_complex_blend_output", "complex_blend"],
        ["filter_complex_blend_output_msaa", "complex_blend"]
    ]);

    /**
     * @description 指定された名前に対応する遅延初期化グループをまだ初期化されていなければ初期化する
     *              Ensure the lazy initialization group for the given name is initialized
     * @param {string} name - パイプライン名 / Pipeline name to look up its lazy group
     */
    private ensureLazyGroup(name: string): void
    {
        const group = this.lazyGroupMap.get(name);
        if (!group || this.lazyInitGroups.has(group)) {
            return;
        }
        this.lazyInitGroups.add(group);

        switch (group) {
            case "blur_filter":
                this.createBlurFilterPipeline();
                break;
            case "texture_copy":
                this.createTextureCopyPipeline();
                break;
            case "bitmap_sync":
                this.createBitmapSyncPipeline();
                break;
            case "filter":
                this.createColorMatrixFilterPipeline();
                break;
            case "complex_blend":
                this.createComplexBlendPipelines();
                break;
        }
    }

    /**
     * @description すべての遅延初期化グループを事前にロードする
     *              Preload all lazy initialization groups eagerly
     */
    preloadLazyGroups(): void
    {
        const groups = ["blur_filter", "texture_copy", "bitmap_sync", "filter", "complex_blend"];
        for (const group of groups) {
            this.ensureLazyGroup(group);
        }
    }

    /**
     * @description 塗りつぶし描画用パイプラインを作成する（RGBA/BGRA/ステンシル対応）
     *              Create fill render pipelines (RGBA, BGRA, and stencil variants)
     */
    private createFillPipeline(): void
    {
        // Dynamic Offset対応のBindGroupLayout（fill + stencil共有）
        const dynamicBindGroupLayout = this.device.createBindGroupLayout({
            "entries": [
                {
                    "binding": 0,
                    "visibility": GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
                    "buffer": { "type": "uniform", "hasDynamicOffset": true }
                }
            ]
        });

        this.bindGroupLayouts.set("fill_dynamic", dynamicBindGroupLayout);

        const pipelineLayout = this.device.createPipelineLayout({
            "bindGroupLayouts": [dynamicBindGroupLayout]
        });

        const vertexShaderModule = this.getOrCreateShaderModule("fillVertex", ShaderSource.getFillVertexShader());

        const fragmentShaderModule = this.getOrCreateShaderModule("fillFragment", ShaderSource.getFillFragmentShader());

        const vertexBufferLayout = $VERTEX_BUFFER_LAYOUT_4F;
        const blendState = $BLEND_PREMULTIPLIED_ALPHA;
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
                "alphaToCoverageEnabled": true
            }
        });
        const pipelineBGRA = this.device.createRenderPipeline({
            "layout": pipelineLayout,
            "vertex": {
                "module": vertexShaderModule,
                "entryPoint": "main",
                "buffers": [vertexBufferLayout],
                "constants": { "yFlipSign": -1.0 }
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
                "count": this.sampleCount,
                "alphaToCoverageEnabled": true
            }
        });

        this.pipelines.set("fill", pipelineRGBA);
        this.pipelines.set("fill_bgra", pipelineBGRA);
        const pipelineBGRAStencil = this.device.createRenderPipeline({
            "layout": pipelineLayout,
            "vertex": {
                "module": vertexShaderModule,
                "entryPoint": "main",
                "buffers": [vertexBufferLayout],
                "constants": { "yFlipSign": -1.0 }
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
                    "compare": "equal",
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
                "count": this.sampleCount,
                "alphaToCoverageEnabled": true
            }
        });
        this.pipelines.set("fill_bgra_stencil", pipelineBGRAStencil);
    }

    /**
     * @description ステンシル塗りつぶし用パイプラインを作成する（書き込み・塗りつぶし・アトラス・メイン・マスク対応）
     *              Create stencil fill pipelines (write, fill, atlas, main, and masked variants)
     */
    private createStencilFillPipelines(): void
    {
        const vertexBufferLayout = $VERTEX_BUFFER_LAYOUT_4F;

        // fill_dynamicレイアウトを共有（hasDynamicOffset: true）
        const dynamicLayout = this.bindGroupLayouts.get("fill_dynamic")!;
        const stencilPipelineLayout = this.device.createPipelineLayout({
            "bindGroupLayouts": [dynamicLayout]
        });

        const stencilWritePipeline = this.device.createRenderPipeline({
            "layout": stencilPipelineLayout,
            "vertex": {
                "module": this.getOrCreateShaderModule("stencilWriteVertex", ShaderSource.getStencilWriteVertexShader()),
                "entryPoint": "main",
                "buffers": [vertexBufferLayout]
            },
            "fragment": {
                "module": this.getOrCreateShaderModule("stencilWriteFragment", ShaderSource.getStencilWriteFragmentShader()),
                "entryPoint": "main",
                "targets": [{
                    "format": "rgba8unorm",
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
                "alphaToCoverageEnabled": true
            }
        });
        this.pipelines.set("stencil_write", stencilWritePipeline);
        const stencilFillPipeline = this.device.createRenderPipeline({
            "layout": stencilPipelineLayout,
            "vertex": {
                "module": this.getOrCreateShaderModule("stencilFillVertex", ShaderSource.getStencilFillVertexShader()),
                "entryPoint": "main",
                "buffers": [vertexBufferLayout]
            },
            "fragment": {
                "module": this.getOrCreateShaderModule("stencilFillFragment", ShaderSource.getStencilFillFragmentShader()),
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
        this.pipelines.set("stencil_fill", stencilFillPipeline);
        const stencilWritePipelineAtlas = this.device.createRenderPipeline({
            "layout": stencilPipelineLayout,
            "vertex": {
                "module": this.getOrCreateShaderModule("stencilWriteVertex", ShaderSource.getStencilWriteVertexShader()),
                "entryPoint": "main",
                "buffers": [vertexBufferLayout]
            },
            "fragment": {
                "module": this.getOrCreateShaderModule("stencilWriteFragment", ShaderSource.getStencilWriteFragmentShader()),
                "entryPoint": "main",
                "targets": [{
                    "format": "rgba8unorm",
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
                "alphaToCoverageEnabled": true
            }
        });
        this.pipelines.set("stencil_write_atlas", stencilWritePipelineAtlas);
        const stencilWritePipelineMain = this.device.createRenderPipeline({
            "layout": stencilPipelineLayout,
            "vertex": {
                "module": this.getOrCreateShaderModule("stencilWriteVertex", ShaderSource.getStencilWriteVertexShader()),
                "entryPoint": "main",
                "buffers": [vertexBufferLayout],
                "constants": { "yFlipSign": -1.0 }
            },
            "fragment": {
                "module": this.getOrCreateShaderModule("stencilWriteFragment", ShaderSource.getStencilWriteFragmentShader()),
                "entryPoint": "main",
                "targets": [{
                    "format": this.format,
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
                "alphaToCoverageEnabled": true
            }
        });
        this.pipelines.set("stencil_write_main", stencilWritePipelineMain);

        const stencilFillPipelineAtlas = this.device.createRenderPipeline({
            "layout": stencilPipelineLayout,
            "vertex": {
                "module": this.getOrCreateShaderModule("stencilFillVertex", ShaderSource.getStencilFillVertexShader()),
                "entryPoint": "main",
                "buffers": [vertexBufferLayout]
            },
            "fragment": {
                "module": this.getOrCreateShaderModule("stencilFillFragment", ShaderSource.getStencilFillFragmentShader()),
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
        const stencilFillPipelineMain = this.device.createRenderPipeline({
            "layout": stencilPipelineLayout,
            "vertex": {
                "module": this.getOrCreateShaderModule("stencilFillVertex", ShaderSource.getStencilFillVertexShader()),
                "entryPoint": "main",
                "buffers": [vertexBufferLayout],
                "constants": { "yFlipSign": -1.0 }
            },
            "fragment": {
                "module": this.getOrCreateShaderModule("stencilFillFragment", ShaderSource.getStencilFillFragmentShader()),
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
        const stencilFillMaskedPipeline = this.device.createRenderPipeline({
            "layout": stencilPipelineLayout,
            "vertex": {
                "module": this.getOrCreateShaderModule("stencilFillVertex", ShaderSource.getStencilFillVertexShader()),
                "entryPoint": "main",
                "buffers": [vertexBufferLayout]
            },
            "fragment": {
                "module": this.getOrCreateShaderModule("stencilFillFragment", ShaderSource.getStencilFillFragmentShader()),
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
                    "compare": "greater",
                    "failOp": "keep",
                    "depthFailOp": "replace",
                    "passOp": "replace"
                },
                "stencilBack": {
                    "compare": "greater",
                    "failOp": "keep",
                    "depthFailOp": "replace",
                    "passOp": "replace"
                },
                "stencilReadMask": 0xFF,
                "stencilWriteMask": 0xFF
            },
            "multisample": {
                "count": this.sampleCount
            }
        });
        this.pipelines.set("stencil_fill_masked", stencilFillMaskedPipeline);
    }

    /**
     * @description クリッピング用パイプラインを作成する（レベル別の書き込み・クリア）
     *              Create clip pipelines (level-based write and clear variants)
     */
    private createClipPipeline(): void
    {
        const vertexBufferLayout = $VERTEX_BUFFER_LAYOUT_4F;
        const dynamicLayout = this.bindGroupLayouts.get("fill_dynamic")!;
        const clipPipelineLayout = this.device.createPipelineLayout({
            "bindGroupLayouts": [dynamicLayout]
        });
        const clipWritePipeline = this.device.createRenderPipeline({
            "layout": clipPipelineLayout,
            "vertex": {
                "module": this.getOrCreateShaderModule("stencilWriteVertex", ShaderSource.getStencilWriteVertexShader()),
                "entryPoint": "main",
                "buffers": [vertexBufferLayout]
            },
            "fragment": {
                "module": this.getOrCreateShaderModule("stencilWriteFragment", ShaderSource.getStencilWriteFragmentShader()),
                "entryPoint": "main",
                "targets": [{
                    "format": "rgba8unorm",
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
                "stencilWriteMask": 0xFF
            },
            "multisample": {
                "count": this.sampleCount
            }
        });
        this.pipelines.set("clip_write", clipWritePipeline);
        const vertexShaderModule = this.getOrCreateShaderModule("stencilWriteVertex", ShaderSource.getStencilWriteVertexShader());
        const fragmentShaderModule = this.getOrCreateShaderModule("stencilWriteFragment", ShaderSource.getStencilWriteFragmentShader());

        for (let level = 1; level <= 8; level++) {
            const stencilWriteMask = 1 << level - 1;
            const clipWriteMainPipeline = this.device.createRenderPipeline({
                "layout": clipPipelineLayout,
                "vertex": {
                    "module": vertexShaderModule,
                    "entryPoint": "main",
                    "buffers": [vertexBufferLayout],
                    "constants": { "yFlipSign": -1.0 }
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
                    "stencilWriteMask": stencilWriteMask
                },
                "multisample": {
                    "count": this.sampleCount,
                    "alphaToCoverageEnabled": true
                }
            });
            this.pipelines.set(`clip_write_main_${level}`, clipWriteMainPipeline);
        }
        this.pipelines.set("clip_write_main", this.pipelines.get("clip_write_main_1")!);
        for (let level = 1; level <= 8; level++) {
            const stencilWriteMask = 1 << level - 1;
            const clipClearMainPipeline = this.device.createRenderPipeline({
                "layout": clipPipelineLayout,
                "vertex": {
                    "module": vertexShaderModule,
                    "entryPoint": "main",
                    "buffers": [vertexBufferLayout],
                    "constants": { "yFlipSign": -1.0 }
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
                        "passOp": "replace"
                    },
                    "stencilBack": {
                        "compare": "always",
                        "failOp": "replace",
                        "depthFailOp": "replace",
                        "passOp": "replace"
                    },
                    "stencilReadMask": 0xFF,
                    "stencilWriteMask": stencilWriteMask
                },
                "multisample": {
                    "count": this.sampleCount
                }
            });
            this.pipelines.set(`clip_clear_main_${level}`, clipClearMainPipeline);
        }
    }

    /**
     * @description マスク合成用パイプラインを作成する（レベル別のマージ・クリア）
     *              Create mask union pipelines (level-based merge and clear variants)
     */
    private createMaskUnionPipelines(): void
    {
        const vertexBufferLayout = $VERTEX_BUFFER_LAYOUT_4F;
        const dynamicLayout = this.bindGroupLayouts.get("fill_dynamic")!;
        const maskUnionPipelineLayout = this.device.createPipelineLayout({
            "bindGroupLayouts": [dynamicLayout]
        });

        const vertexShaderModule = this.getOrCreateShaderModule("stencilWriteVertex", ShaderSource.getStencilWriteVertexShader());
        const fragmentShaderModule = this.getOrCreateShaderModule("stencilWriteFragment", ShaderSource.getStencilWriteFragmentShader());
        for (let level = 1; level <= 8; level++) {
            const mask = 1 << level - 1;
            const upperBitsMask = ~mask & 0xFF;
            const mergePipeline = this.device.createRenderPipeline({
                "layout": maskUnionPipelineLayout,
                "vertex": {
                    "module": vertexShaderModule,
                    "entryPoint": "main",
                    "buffers": [vertexBufferLayout],
                    "constants": { "yFlipSign": -1.0 }
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
                        "compare": "less-equal",
                        "failOp": "zero",
                        "depthFailOp": "replace",
                        "passOp": "replace"
                    },
                    "stencilBack": {
                        "compare": "less-equal",
                        "failOp": "zero",
                        "depthFailOp": "replace",
                        "passOp": "replace"
                    },
                    "stencilReadMask": 0xFF,
                    "stencilWriteMask": upperBitsMask
                }
            });
            this.pipelines.set(`mask_union_merge_${level}`, mergePipeline);
            const clearPipeline = this.device.createRenderPipeline({
                "layout": maskUnionPipelineLayout,
                "vertex": {
                    "module": vertexShaderModule,
                    "entryPoint": "main",
                    "buffers": [vertexBufferLayout],
                    "constants": { "yFlipSign": -1.0 }
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
                        "passOp": "replace"
                    },
                    "stencilBack": {
                        "compare": "always",
                        "failOp": "replace",
                        "depthFailOp": "replace",
                        "passOp": "replace"
                    },
                    "stencilReadMask": 0xFF,
                    "stencilWriteMask": 1 << level
                }
            });
            this.pipelines.set(`mask_union_clear_${level}`, clearPipeline);
        }
    }

    /**
     * @description マスク描画用パイプラインを作成する
     *              Create mask render pipeline
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

        const vertexShaderModule = this.getOrCreateShaderModule("maskVertex", ShaderSource.getMaskVertexShader());

        const fragmentShaderModule = this.getOrCreateShaderModule("maskFragment", ShaderSource.getMaskFragmentShader());

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

        this.pipelines.set("mask", pipeline);
    }

    /**
     * @description 基本描画パイプラインを作成する（RGBA/BGRA）
     *              Create basic render pipelines (RGBA and BGRA variants)
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

        const vertexShaderModule = this.getOrCreateShaderModule("basicVertex", ShaderSource.getBasicVertexShader());

        const fragmentShaderModule = this.getOrCreateShaderModule("basicFragment", ShaderSource.getBasicFragmentShader());

        const vertexBufferLayout: GPUVertexBufferLayout = {
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
        };

        const blendState = $BLEND_PREMULTIPLIED_ALPHA;
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
        const pipelineBGRA = this.device.createRenderPipeline({
            "layout": pipelineLayout,
            "vertex": {
                "module": vertexShaderModule,
                "entryPoint": "main",
                "buffers": [vertexBufferLayout],
                "constants": { "yFlipSign": -1.0 }
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
        });

        this.pipelines.set("basic", pipelineRGBA);
        this.pipelines.set("basic_bgra", pipelineBGRA);
    }

    /**
     * @description テクスチャ描画用パイプラインを作成する
     *              Create texture render pipeline
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

        const vertexShaderModule = this.getOrCreateShaderModule("basicVertex", ShaderSource.getBasicVertexShader());

        const fragmentShaderModule = this.getOrCreateShaderModule("textureFragment", ShaderSource.getTextureFragmentShader());

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
     * @description インスタンス描画用パイプラインを作成する（ブレンドバリアント・マスク対応）
     *              Create instanced render pipelines (blend variants and masked)
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

        const vertexShaderModule = this.getOrCreateShaderModule("instancedVertex", ShaderSource.getInstancedVertexShader());

        const fragmentShaderModule = this.getOrCreateShaderModule("instancedFragment", ShaderSource.getInstancedFragmentShader());
        const instanceBufferLayout: GPUVertexBufferLayout = {
            "arrayStride": 96,
            "stepMode": "instance",
            "attributes": [
                {
                    "shaderLocation": 2,
                    "offset": 0,
                    "format": "float32x4"
                },
                {
                    "shaderLocation": 3,
                    "offset": 16,
                    "format": "float32x4"
                },
                {
                    "shaderLocation": 4,
                    "offset": 32,
                    "format": "float32x4"
                },
                {
                    "shaderLocation": 5,
                    "offset": 48,
                    "format": "float32x4"
                },
                {
                    "shaderLocation": 6,
                    "offset": 64,
                    "format": "float32x4"
                },
                {
                    "shaderLocation": 7,
                    "offset": 80,
                    "format": "float32x4"
                }
            ]
        };

        const pipeline = this.device.createRenderPipeline({
            "layout": pipelineLayout,
            "vertex": {
                "module": vertexShaderModule,
                "entryPoint": "main",
                "buffers": [
                    {
                        "arrayStride": 4 * 4,
                        "stepMode": "vertex",
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
            "multisample": {
                "count": this.sampleCount
            }
        });

        this.pipelines.set("instanced", pipeline);
        const vertexBuffers: GPUVertexBufferLayout[] = [
            {
                "arrayStride": 4 * 4,
                "stepMode": "vertex",
                "attributes": [
                    { "shaderLocation": 0, "offset": 0, "format": "float32x2" },
                    { "shaderLocation": 1, "offset": 2 * 4, "format": "float32x2" }
                ]
            },
            instanceBufferLayout
        ];

        const blendVariants: [string, GPUBlendState][] = [
            ["instanced_add", { "color": { "srcFactor": "one", "dstFactor": "one", "operation": "add" }, "alpha": { "srcFactor": "one", "dstFactor": "one-minus-src-alpha", "operation": "add" } }],
            ["instanced_screen", { "color": { "srcFactor": "one-minus-dst", "dstFactor": "one", "operation": "add" }, "alpha": { "srcFactor": "one", "dstFactor": "one-minus-src-alpha", "operation": "add" } }],
            ["instanced_alpha", { "color": { "srcFactor": "zero", "dstFactor": "src-alpha", "operation": "add" }, "alpha": { "srcFactor": "zero", "dstFactor": "src-alpha", "operation": "add" } }],
            ["instanced_erase", { "color": { "srcFactor": "zero", "dstFactor": "one-minus-src-alpha", "operation": "add" }, "alpha": { "srcFactor": "zero", "dstFactor": "one-minus-src-alpha", "operation": "add" } }],
            ["instanced_copy", { "color": { "srcFactor": "one", "dstFactor": "zero", "operation": "add" }, "alpha": { "srcFactor": "one", "dstFactor": "zero", "operation": "add" } }]
        ];

        for (const [name, blend] of blendVariants) {
            const variantPipeline = this.device.createRenderPipeline({
                "layout": pipelineLayout,
                "vertex": {
                    "module": vertexShaderModule,
                    "entryPoint": "main",
                    "buffers": vertexBuffers
                },
                "fragment": {
                    "module": fragmentShaderModule,
                    "entryPoint": "main",
                    "targets": [{ "format": this.format, "blend": blend }]
                },
                "primitive": { "topology": "triangle-list", "cullMode": "none" },
                "multisample": { "count": this.sampleCount }
            });
            this.pipelines.set(name, variantPipeline);
        }
        const maskedPipeline = this.device.createRenderPipeline({
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
                    "compare": "equal",
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
        this.pipelines.set("instanced_masked", maskedPipeline);
    }

    /**
     * @description グラデーション塗りつぶし用パイプラインを作成する（RGBA/BGRA/ステンシル対応）
     *              Create gradient fill pipelines (RGBA, BGRA, stencil, and stroke variants)
     */
    private createGradientPipeline(): void
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

        this.bindGroupLayouts.set("gradient_fill", bindGroupLayout);

        const pipelineLayout = this.device.createPipelineLayout({
            "bindGroupLayouts": [bindGroupLayout]
        });
        this.gradientPipelineLayout = pipelineLayout;

        const vertexShaderModule = this.getOrCreateShaderModule("gradientFillVertex", ShaderSource.getGradientFillVertexShader());
        this.gradientVertexShaderModule = vertexShaderModule;

        const fragmentShaderModule = this.getOrCreateShaderModule("gradientFillFragment", ShaderSource.getGradientFillFragmentShader());
        this.gradientFragmentShaderModule = fragmentShaderModule;
        const stencilFragmentShaderModule = this.getOrCreateShaderModule("gradientFillStencilFragment", ShaderSource.getGradientFillStencilFragmentShader());
        this.gradientStencilFragmentShaderModule = stencilFragmentShaderModule;

        const vertexBufferLayout = $VERTEX_BUFFER_LAYOUT_4F;
        const blendState = $BLEND_PREMULTIPLIED_ALPHA;
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
        const pipelineBGRA = this.device.createRenderPipeline({
            "layout": pipelineLayout,
            "vertex": {
                "module": vertexShaderModule,
                "entryPoint": "main",
                "buffers": [vertexBufferLayout],
                "constants": { "yFlipSign": -1.0 }
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
        });

        this.pipelines.set("gradient_fill", pipelineRGBA);
        this.pipelines.set("gradient_fill_no_stencil", pipelineRGBA);
        this.pipelines.set("gradient_fill_bgra", pipelineBGRA);
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
        const pipelineGradientStrokeBGRA = this.device.createRenderPipeline({
            "label": "gradient_stroke_bgra_pipeline",
            "layout": pipelineLayout,
            "vertex": {
                "module": vertexShaderModule,
                "entryPoint": "main",
                "buffers": [vertexBufferLayout],
                "constants": { "yFlipSign": -1.0 }
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
        const pipelineBGRA_noMSAA = this.device.createRenderPipeline({
            "layout": pipelineLayout,
            "vertex": {
                "module": vertexShaderModule,
                "entryPoint": "main",
                "buffers": [vertexBufferLayout],
                "constants": { "yFlipSign": -1.0 }
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
        const pipelineRGBAStencil = this.device.createRenderPipeline({
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
        this.pipelines.set("gradient_fill_stencil", pipelineRGBAStencil);
        const pipelineRGBAStencilAtlas = this.device.createRenderPipeline({
            "layout": pipelineLayout,
            "vertex": {
                "module": vertexShaderModule,
                "entryPoint": "main",
                "buffers": [vertexBufferLayout]
            },
            "fragment": {
                "module": stencilFragmentShaderModule,
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
        const pipelineStencilMain = this.device.createRenderPipeline({
            "layout": pipelineLayout,
            "vertex": {
                "module": vertexShaderModule,
                "entryPoint": "main",
                "buffers": [vertexBufferLayout],
                "constants": { "yFlipSign": -1.0 }
            },
            "fragment": {
                "module": stencilFragmentShaderModule,
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
                "count": 1
            }
        });
        this.pipelines.set("gradient_fill_stencil_main", pipelineStencilMain);
        const pipelineBGRAStencil = this.device.createRenderPipeline({
            "layout": pipelineLayout,
            "vertex": {
                "module": vertexShaderModule,
                "entryPoint": "main",
                "buffers": [vertexBufferLayout],
                "constants": { "yFlipSign": -1.0 }
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
                    "compare": "equal",
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
     * @description ビットマップ塗りつぶし用パイプラインを作成する（RGBA/BGRA/ステンシル・ストローク対応）
     *              Create bitmap fill pipelines (RGBA, BGRA, stencil, and stroke variants)
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

        const vertexShaderModule = this.getOrCreateShaderModule("bitmapFillVertex", ShaderSource.getBitmapFillVertexShader());

        const fragmentShaderModule = this.getOrCreateShaderModule("bitmapFillFragment", ShaderSource.getBitmapFillFragmentShader());

        const vertexBufferLayout = $VERTEX_BUFFER_LAYOUT_4F;
        const blendState = $BLEND_PREMULTIPLIED_ALPHA;
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
        const pipelineBGRA = this.device.createRenderPipeline({
            "layout": pipelineLayout,
            "vertex": {
                "module": vertexShaderModule,
                "entryPoint": "main",
                "buffers": [vertexBufferLayout],
                "constants": { "yFlipSign": -1.0 }
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
        });

        this.pipelines.set("bitmap_fill", pipelineRGBA);
        this.pipelines.set("bitmap_fill_bgra", pipelineBGRA);
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
        const pipelineBitmapStrokeBGRA = this.device.createRenderPipeline({
            "label": "bitmap_stroke_bgra_pipeline",
            "layout": pipelineLayout,
            "vertex": {
                "module": vertexShaderModule,
                "entryPoint": "main",
                "buffers": [vertexBufferLayout],
                "constants": { "yFlipSign": -1.0 }
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
        const pipelineRGBAStencil = this.device.createRenderPipeline({
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
        this.pipelines.set("bitmap_fill_stencil", pipelineRGBAStencil);
        const pipelineBGRAStencil = this.device.createRenderPipeline({
            "layout": pipelineLayout,
            "vertex": {
                "module": vertexShaderModule,
                "entryPoint": "main",
                "buffers": [vertexBufferLayout],
                "constants": { "yFlipSign": -1.0 }
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
                    "compare": "equal",
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
     * @description ブレンド描画用パイプラインを作成する（デュアルテクスチャブレンド）
     *              Create blend render pipeline for dual-texture blending
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

        const vertexShaderModule = this.getOrCreateShaderModule("basicVertex", ShaderSource.getBasicVertexShader());

        const fragmentShaderModule = this.getOrCreateShaderModule("blendFragment", ShaderSource.getBlendFragmentShader());

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
     * @description ブラーフィルター用パイプラインを作成する（halfBlur 1〜16のバリアント）
     *              Create blur filter pipelines (halfBlur 1-16 variants)
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
        const vertexShaderModule = this.getOrCreateShaderModule("blurFilterVertex", ShaderSource.getBlurFilterVertexShader());

        const pipelineLayout = this.device.createPipelineLayout({
            "bindGroupLayouts": [bindGroupLayout]
        });

        for (let halfBlur = 1; halfBlur <= 16; halfBlur++) {
            const fragmentShaderModule = this.getOrCreateShaderModule(`blurFilterFragment_${halfBlur}`, ShaderSource.getBlurFilterFragmentShader(halfBlur));
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

            this.pipelines.set(`blur_filter_${halfBlur}`, pipeline);
        }
    }

    /**
     * @description テクスチャコピー用パイプラインを作成する（各種ブレンド・フィルター出力・MSAA対応）
     *              Create texture copy pipelines (various blend modes, filter output, MSAA variants)
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

        const vertexShaderModule = this.getOrCreateShaderModule("blurFilterVertex", ShaderSource.getBlurFilterVertexShader());

        const fragmentShaderModule = this.getOrCreateShaderModule("textureCopyFragment", ShaderSource.getTextureCopyFragmentShader());

        const BLEND_REPLACE: GPUBlendState = {
            "color": { "srcFactor": "one", "dstFactor": "zero", "operation": "add" },
            "alpha": { "srcFactor": "one", "dstFactor": "zero", "operation": "add" }
        };
        const BLEND_ALPHA: GPUBlendState = {
            "color": { "srcFactor": "one", "dstFactor": "one-minus-src-alpha", "operation": "add" },
            "alpha": { "srcFactor": "one", "dstFactor": "one-minus-src-alpha", "operation": "add" }
        };
        const BLEND_ERASE: GPUBlendState = {
            "color": { "srcFactor": "zero", "dstFactor": "one-minus-src-alpha", "operation": "add" },
            "alpha": { "srcFactor": "zero", "dstFactor": "one-minus-src-alpha", "operation": "add" }
        };

        this.pipelines.set("texture_copy", this.createFullscreenQuadPipeline(
            pipelineLayout, vertexShaderModule, fragmentShaderModule, this.format, BLEND_REPLACE
        ));
        this.pipelines.set("texture_copy_rgba8", this.createFullscreenQuadPipeline(
            pipelineLayout, vertexShaderModule, fragmentShaderModule, "rgba8unorm", BLEND_REPLACE
        ));
        const colorTransformFragmentModule = this.getOrCreateShaderModule("colorTransformFragment", ShaderSource.getColorTransformFragmentShader());
        this.pipelines.set("color_transform", this.createFullscreenQuadPipeline(
            pipelineLayout, vertexShaderModule, colorTransformFragmentModule, "rgba8unorm", BLEND_REPLACE
        ));
        const yFlipCTFragmentModule = this.getOrCreateShaderModule("yFlipColorTransformFragment", ShaderSource.getYFlipColorTransformFragmentShader());
        this.pipelines.set("y_flip_color_transform", this.createFullscreenQuadPipeline(
            pipelineLayout, vertexShaderModule, yFlipCTFragmentModule, "rgba8unorm", BLEND_REPLACE
        ));
        const blurCopyFragmentModule = this.getOrCreateShaderModule("blurTextureCopyFragment", ShaderSource.getBlurTextureCopyFragmentShader());
        this.pipelines.set("texture_erase", this.createFullscreenQuadPipeline(
            pipelineLayout, vertexShaderModule, blurCopyFragmentModule, "rgba8unorm", BLEND_ERASE
        ));
        this.pipelines.set("blur_texture_copy", this.createFullscreenQuadPipeline(
            pipelineLayout, vertexShaderModule, blurCopyFragmentModule, "rgba8unorm", BLEND_REPLACE
        ));
        this.pipelines.set("filter_blend", this.createFullscreenQuadPipeline(
            pipelineLayout, vertexShaderModule, fragmentShaderModule, this.format, BLEND_ALPHA
        ));
        this.pipelines.set("texture_copy_bgra", this.createFullscreenQuadPipeline(
            pipelineLayout, vertexShaderModule, fragmentShaderModule, this.format, BLEND_REPLACE
        ));
        const filterOutputShaderModule = this.getOrCreateShaderModule("filterOutputFragment", ShaderSource.getFilterOutputFragmentShader());
        this.pipelines.set("filter_output", this.createFullscreenQuadPipeline(
            pipelineLayout, vertexShaderModule, filterOutputShaderModule, this.format, BLEND_ALPHA
        ));
        const filterOutputBlendVariants: [string, GPUBlendState][] = [
            ["filter_output_add", { "color": { "srcFactor": "one", "dstFactor": "one", "operation": "add" }, "alpha": { "srcFactor": "one", "dstFactor": "one", "operation": "add" } }],
            ["filter_output_screen", { "color": { "srcFactor": "one", "dstFactor": "one-minus-src", "operation": "add" }, "alpha": { "srcFactor": "one", "dstFactor": "one-minus-src-alpha", "operation": "add" } }],
            ["filter_output_alpha", { "color": { "srcFactor": "zero", "dstFactor": "src-alpha", "operation": "add" }, "alpha": { "srcFactor": "zero", "dstFactor": "src-alpha", "operation": "add" } }],
            ["filter_output_erase", { "color": { "srcFactor": "zero", "dstFactor": "one-minus-src-alpha", "operation": "add" }, "alpha": { "srcFactor": "zero", "dstFactor": "one-minus-src-alpha", "operation": "add" } }]
        ];

        for (const [name, blend] of filterOutputBlendVariants) {
            this.pipelines.set(name, this.createFullscreenQuadPipeline(
                pipelineLayout, vertexShaderModule, filterOutputShaderModule, this.format, blend
            ));
        }

        // マスク付きフィルター出力パイプライン（ステンシルテスト付き）
        const filterMaskedStencil: GPUDepthStencilState = {
            "format": "stencil8",
            "stencilFront": {
                "compare": "equal",
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
        };
        this.pipelines.set("filter_output_masked", this.createFullscreenQuadPipeline(
            pipelineLayout, vertexShaderModule, filterOutputShaderModule, this.format, BLEND_ALPHA, undefined, filterMaskedStencil
        ));
        if (this.sampleCount > 1) {
            const normalBlendForMask: GPUBlendState = { "color": { "srcFactor": "one", "dstFactor": "one-minus-src-alpha", "operation": "add" }, "alpha": { "srcFactor": "one", "dstFactor": "one-minus-src-alpha", "operation": "add" } };
            this.pipelines.set("filter_output_masked_msaa", this.createFullscreenQuadPipeline(
                pipelineLayout, vertexShaderModule, filterOutputShaderModule, this.format, normalBlendForMask, this.sampleCount, filterMaskedStencil
            ));
        }

        if (this.sampleCount > 1) {
            const copyBlend: GPUBlendState = { "color": { "srcFactor": "one", "dstFactor": "zero", "operation": "add" }, "alpha": { "srcFactor": "one", "dstFactor": "zero", "operation": "add" } };
            this.pipelines.set("texture_copy_bgra_msaa", this.createFullscreenQuadPipeline(
                pipelineLayout, vertexShaderModule, fragmentShaderModule, this.format, copyBlend, this.sampleCount
            ));
            const normalBlend: GPUBlendState = { "color": { "srcFactor": "one", "dstFactor": "one-minus-src-alpha", "operation": "add" }, "alpha": { "srcFactor": "one", "dstFactor": "one-minus-src-alpha", "operation": "add" } };
            this.pipelines.set("filter_output_msaa", this.createFullscreenQuadPipeline(
                pipelineLayout, vertexShaderModule, filterOutputShaderModule, this.format, normalBlend, this.sampleCount
            ));
            for (const [name, blend] of filterOutputBlendVariants) {
                this.pipelines.set(`${name}_msaa`, this.createFullscreenQuadPipeline(
                    pipelineLayout, vertexShaderModule, filterOutputShaderModule, this.format, blend, this.sampleCount
                ));
            }
        }
        this.createPositionedTexturePipeline();
        this.createTextureScalePipeline();
    }

    /**
     * @description 位置指定テクスチャ描画用パイプラインを作成する（RGBA/ビットマップレンダー対応）
     *              Create positioned texture pipelines (RGBA, bitmap render, MSAA variants)
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

        const vertexShaderModule = this.getOrCreateShaderModule("positionedTextureVertex", ShaderSource.getPositionedTextureVertexShader());

        const fragmentShaderModule = this.getOrCreateShaderModule("positionedTextureFragment", ShaderSource.getPositionedTextureFragmentShader());
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
     * @description テクスチャスケーリング用パイプラインを作成する
     *              Create texture scale pipelines
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

        const vertexShaderModule = this.getOrCreateShaderModule("textureScaleVertex", ShaderSource.getTextureScaleVertexShader());

        const fragmentShaderModule = this.getOrCreateShaderModule("positionedTextureFragment", ShaderSource.getPositionedTextureFragmentShader());
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
        const blendVertexShaderModule = this.getOrCreateShaderModule("textureScaleBlendVertex", ShaderSource.getTextureScaleBlendVertexShader());

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
     * @description ビットマップ同期描画用パイプラインを作成する（MSAA 4x）
     *              Create bitmap sync render pipeline (MSAA 4x)
     */
    private createBitmapSyncPipeline(): void
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
        const vertexShaderModule = this.getOrCreateShaderModule("bitmapSyncVertex", ShaderSource.getBitmapSyncVertexShader());
        const fragmentShaderModule = this.getOrCreateShaderModule("bitmapSyncFragment", ShaderSource.getBitmapSyncFragmentShader());
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
            "multisample": {
                "count": 4
            }
        });
        this.pipelines.set("bitmap_sync", pipeline);
    }

    /**
     * @description カラーマトリクスフィルター・ベベル・グロー・ドロップシャドウ等のフィルターパイプラインを作成する
     *              Create filter pipelines (color matrix, bevel, glow, drop shadow, gradient glow/bevel)
     */
    private createColorMatrixFilterPipeline(): void
    {
        const BLEND_REPLACE: GPUBlendState = {
            "color": { "srcFactor": "one", "dstFactor": "zero", "operation": "add" },
            "alpha": { "srcFactor": "one", "dstFactor": "zero", "operation": "add" }
        };
        const BLEND_ALPHA: GPUBlendState = {
            "color": { "srcFactor": "one", "dstFactor": "one-minus-src-alpha", "operation": "add" },
            "alpha": { "srcFactor": "one", "dstFactor": "one-minus-src-alpha", "operation": "add" }
        };
        this.createFilterPipelineWithLayout("color_matrix_filter", ShaderSource.getColorMatrixFilterFragmentShader(), 1, BLEND_REPLACE);
        this.createFilterPipelineWithLayout("bevel_base", ShaderSource.getBevelBaseFragmentShader(), 1, BLEND_REPLACE);
        this.createFilterPipelineWithLayout("glow_filter", ShaderSource.getGlowFilterFragmentShader(), 2, BLEND_ALPHA);
        this.createFilterPipelineWithLayout("drop_shadow_filter", ShaderSource.getDropShadowFilterFragmentShader(), 2, BLEND_ALPHA);
        this.createFilterPipelineWithLayout("bevel_filter", ShaderSource.getBevelFilterFragmentShader(), 2, BLEND_ALPHA);
        this.createFilterPipelineWithLayout("gradient_glow_filter", ShaderSource.getGradientGlowFilterFragmentShader(), 3, BLEND_ALPHA);
        this.createFilterPipelineWithLayout("gradient_bevel_filter", ShaderSource.getGradientBevelFilterFragmentShader(), 3, BLEND_ALPHA);
    }

    /**
     * @description 複合ブレンド用パイプラインを作成する
     *              Create complex blend pipelines
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
        const vertexShaderModule = this.getOrCreateShaderModule("complexBlendVertex", ShaderSource.getComplexBlendVertexShader());
        const fragmentShaderModule = this.getOrCreateShaderModule("unifiedComplexBlendFragment", ShaderSource.getUnifiedComplexBlendFragmentShader());

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

        this.pipelines.set("complex_blend", pipeline);
        this.createComplexBlendCopyPipeline();
        this.createComplexBlendOutputPipeline();
    }

    /**
     * @description 複合ブレンドのコピー・スケール用パイプラインを作成する
     *              Create complex blend copy and scale pipelines
     */
    private createComplexBlendCopyPipeline(): void
    {
        const BLEND_REPLACE: GPUBlendState = {
            "color": { "srcFactor": "one", "dstFactor": "zero", "operation": "add" },
            "alpha": { "srcFactor": "one", "dstFactor": "zero", "operation": "add" }
        };
        const copyLayout = this.bindGroupLayouts.get("texture_copy");
        if (copyLayout) {
            const copyPipelineLayout = this.device.createPipelineLayout({ "bindGroupLayouts": [copyLayout] });
            const copyVS = this.getOrCreateShaderModule("complexBlendCopyVertex", ShaderSource.getComplexBlendCopyVertexShader());
            const copyFS = this.getOrCreateShaderModule("textureCopyFragment", ShaderSource.getTextureCopyFragmentShader());
            this.pipelines.set("complex_blend_copy", this.createFullscreenQuadPipeline(
                copyPipelineLayout, copyVS, copyFS, "rgba8unorm", BLEND_REPLACE
            ));
        }
        const scaleLayout = this.bindGroupLayouts.get("texture_scale");
        if (scaleLayout) {
            const scalePipelineLayout = this.device.createPipelineLayout({ "bindGroupLayouts": [scaleLayout] });
            const scaleVS = this.getOrCreateShaderModule("complexBlendScaleVertex", ShaderSource.getComplexBlendScaleVertexShader());
            const scaleFS = this.getOrCreateShaderModule("positionedTextureFragment", ShaderSource.getPositionedTextureFragmentShader());
            this.pipelines.set("complex_blend_scale", this.createFullscreenQuadPipeline(
                scalePipelineLayout, scaleVS, scaleFS, "rgba8unorm", BLEND_REPLACE
            ));
        }
    }

    /**
     * @description 複合ブレンドの出力用パイプラインを作成する（MSAA対応含む）
     *              Create complex blend output pipelines (including MSAA variants)
     */
    private createComplexBlendOutputPipeline(): void
    {
        const bindGroupLayout = this.bindGroupLayouts.get("positioned_texture");
        if (!bindGroupLayout) {
            return;
        }

        const pipelineLayout = this.device.createPipelineLayout({ "bindGroupLayouts": [bindGroupLayout] });
        const fragmentShaderModule = this.getOrCreateShaderModule("positionedTextureFragment", ShaderSource.getPositionedTextureFragmentShader());
        const blend: GPUBlendState = {
            "color": { "srcFactor": "one", "dstFactor": "one-minus-src-alpha", "operation": "add" },
            "alpha": { "srcFactor": "one", "dstFactor": "one-minus-src-alpha", "operation": "add" }
        };
        const blendOutputVS = this.getOrCreateShaderModule("complexBlendOutputVertex", ShaderSource.getComplexBlendOutputVertexShader());
        this.pipelines.set("complex_blend_output", this.createFullscreenQuadPipeline(
            pipelineLayout, blendOutputVS, fragmentShaderModule, this.format, blend
        ));
        if (this.sampleCount > 1) {
            this.pipelines.set("complex_blend_output_msaa", this.createFullscreenQuadPipeline(
                pipelineLayout, blendOutputVS, fragmentShaderModule, this.format, blend, this.sampleCount
            ));
        }
        const filterBlendOutputVS = this.getOrCreateShaderModule("filterComplexBlendOutputVertex", ShaderSource.getFilterComplexBlendOutputVertexShader());
        this.pipelines.set("filter_complex_blend_output", this.createFullscreenQuadPipeline(
            pipelineLayout, filterBlendOutputVS, fragmentShaderModule, this.format, blend
        ));
        if (this.sampleCount > 1) {
            this.pipelines.set("filter_complex_blend_output_msaa", this.createFullscreenQuadPipeline(
                pipelineLayout, filterBlendOutputVS, fragmentShaderModule, this.format, blend, this.sampleCount
            ));
        }
    }

    /**
     * @description 指定されたフラグメントシェーダーとテクスチャ数でフィルターパイプラインを作成する
     *              Create a filter pipeline with the specified fragment shader and texture count
     * @param {string} name - パイプライン名 / Pipeline name
     * @param {string} fragment_shader_code - フラグメントシェーダーコード / Fragment shader WGSL source code
     * @param {number} texture_count - テクスチャバインディング数 / Number of texture bindings
     * @param {GPUBlendState} blend - ブレンドステート / Blend state configuration
     */
    private createFilterPipelineWithLayout(
        name: string,
        fragment_shader_code: string,
        texture_count: number,
        blend: GPUBlendState
    ): void
    {
        let bindGroupLayout = this.filterBindGroupLayouts.get(texture_count);
        if (!bindGroupLayout) {
            const entries: GPUBindGroupLayoutEntry[] = [
                { "binding": 0, "visibility": GPUShaderStage.FRAGMENT, "buffer": { "type": "uniform" } },
                { "binding": 1, "visibility": GPUShaderStage.FRAGMENT, "sampler": {} }
            ];
            for (let i = 0; i < texture_count; i++) {
                entries.push({ "binding": 2 + i, "visibility": GPUShaderStage.FRAGMENT, "texture": {} });
            }
            bindGroupLayout = this.device.createBindGroupLayout({ "entries": entries });
            this.filterBindGroupLayouts.set(texture_count, bindGroupLayout);
        }

        this.bindGroupLayouts.set(name, bindGroupLayout);

        const pipelineLayout = this.device.createPipelineLayout({ "bindGroupLayouts": [bindGroupLayout] });
        const vertexShaderModule = this.getOrCreateShaderModule("blurFilterVertex", ShaderSource.getBlurFilterVertexShader());
        const fragmentShaderModule = this.getOrCreateShaderModule(`filter_${name}`, fragment_shader_code);

        this.pipelines.set(name, this.createFullscreenQuadPipeline(
            pipelineLayout, vertexShaderModule, fragmentShaderModule, "rgba8unorm", blend
        ));
    }

    /**
     * @description フルスクリーンクアッド描画用の汎用パイプラインを作成する
     *              Create a generic fullscreen quad render pipeline
     * @param {GPUPipelineLayout} pipeline_layout - パイプラインレイアウト / Pipeline layout
     * @param {GPUShaderModule} vertex_module - 頂点シェーダーモジュール / Vertex shader module
     * @param {GPUShaderModule} fragment_module - フラグメントシェーダーモジュール / Fragment shader module
     * @param {GPUTextureFormat} format - テクスチャフォーマット / Target texture format
     * @param {GPUBlendState} blend - ブレンドステート / Blend state configuration
     * @param {number} multisample_count - MSAAサンプル数（任意） / Optional MSAA sample count
     * @param {GPUDepthStencilState} depth_stencil - 深度ステンシルステート（任意） / Optional depth-stencil state
     * @return {GPURenderPipeline} レンダーパイプライン / The created render pipeline
     */
    private createFullscreenQuadPipeline(
        pipeline_layout: GPUPipelineLayout,
        vertex_module: GPUShaderModule,
        fragment_module: GPUShaderModule,
        format: GPUTextureFormat,
        blend: GPUBlendState,
        multisample_count?: number,
        depth_stencil?: GPUDepthStencilState
    ): GPURenderPipeline
    {
        const descriptor: GPURenderPipelineDescriptor = {
            "layout": pipeline_layout,
            "vertex": {
                "module": vertex_module,
                "entryPoint": "main",
                "buffers": []
            },
            "fragment": {
                "module": fragment_module,
                "entryPoint": "main",
                "targets": [{ "format": format, "blend": blend }]
            },
            "primitive": {
                "topology": "triangle-list",
                "cullMode": "none"
            }
        };

        if (multisample_count && multisample_count > 1) {
            descriptor.multisample = { "count": multisample_count };
        }

        if (depth_stencil) {
            descriptor.depthStencil = depth_stencil;
        }

        return this.device.createRenderPipeline(descriptor);
    }

    /**
     * @description 名前からレンダーパイプラインを取得する（遅延初期化を含む）
     *              Get a render pipeline by name, initializing lazy groups if needed
     * @param {string} name - パイプライン名 / Pipeline name
     * @return {GPURenderPipeline | undefined} パイプラインまたはundefined / The pipeline or undefined
     */
    getPipeline(name: string): GPURenderPipeline | undefined
    {
        let pipeline = this.pipelines.get(name);
        if (!pipeline) {
            this.ensureLazyGroup(name);
            pipeline = this.pipelines.get(name);
        }
        return pipeline;
    }

    /**
     * @description フィルターパイプラインのoverride定数バリアントを取得する。GPU warp divergenceを排除するコンパイル時分岐特殊化
     *              Get a filter pipeline variant with override constants. Compile-time branch specialization to eliminate GPU warp divergence
     * @param {string} base_name - ベースパイプライン名 / Base pipeline name
     * @param {Record<string, number>} constants - オーバーライド定数 / Override constant values
     * @return {GPURenderPipeline | undefined} パイプラインまたはundefined / The pipeline or undefined
     */
    getFilterPipeline(base_name: string, constants: Record<string, number>): GPURenderPipeline | undefined
    {
        // キャッシュキーを生成
        const keys = Object.keys(constants).sort();
        const suffix = keys.map((k) => `${k}${constants[k]}`).join("_");
        const cacheKey = `${base_name}_${suffix}`;

        let pipeline = this.pipelines.get(cacheKey);
        if (pipeline) {
            return pipeline;
        }

        // ベースグループのロードを確保
        this.ensureLazyGroup(base_name);

        const fragmentModule = this.shaderModuleCache.get(`filter_${base_name}`);
        const vertexModule = this.shaderModuleCache.get("blurFilterVertex");
        const bindGroupLayout = this.bindGroupLayouts.get(base_name);

        if (!fragmentModule || !vertexModule || !bindGroupLayout) {
            return this.pipelines.get(base_name);
        }

        const pipelineLayout = this.device.createPipelineLayout({
            "bindGroupLayouts": [bindGroupLayout]
        });

        pipeline = this.device.createRenderPipeline({
            "layout": pipelineLayout,
            "vertex": {
                "module": vertexModule,
                "entryPoint": "main",
                "buffers": []
            },
            "fragment": {
                "module": fragmentModule,
                "entryPoint": "main",
                "targets": [{
                    "format": "rgba8unorm",
                    "blend": {
                        "color": { "srcFactor": "one", "dstFactor": "one-minus-src-alpha", "operation": "add" },
                        "alpha": { "srcFactor": "one", "dstFactor": "one-minus-src-alpha", "operation": "add" }
                    }
                }],
                "constants": constants
            },
            "primitive": {
                "topology": "triangle-list",
                "cullMode": "none"
            }
        });

        this.pipelines.set(cacheKey, pipeline);
        return pipeline;
    }

    /**
     * @description グラデーションタイプとスプレッドモードに応じた特殊化パイプラインを取得する。override定数でGPU warp divergenceを排除
     *              Get a gradient pipeline specialized by gradient type and spread mode. Uses override constants to eliminate GPU warp divergence
     * @param {string} base_name - ベースパイプライン名 / Base pipeline name
     * @param {number} gradient_type - グラデーションタイプ / Gradient type identifier
     * @param {number} spread_mode - スプレッドモード / Spread mode identifier
     * @return {GPURenderPipeline | undefined} パイプラインまたはundefined / The pipeline or undefined
     */
    getGradientPipeline(base_name: string, gradient_type: number, spread_mode: number): GPURenderPipeline | undefined
    {
        const key = `${base_name}_t${gradient_type}s${spread_mode}`;
        let pipeline = this.pipelines.get(key);
        if (pipeline) {
            return pipeline;
        }

        if (!this.gradientPipelineLayout) {
            return this.getPipeline(base_name);
        }

        // ベースパイプラインと同じ構成でoverride定数を変えて作成
        pipeline = this.createGradientVariant(base_name, gradient_type, spread_mode);
        if (pipeline) {
            this.pipelines.set(key, pipeline);
            return pipeline;
        }

        // フォールバック: デフォルト定数のベースパイプラインを使用
        return this.getPipeline(base_name);
    }

    /**
     * @description グラデーション用パイプラインレイアウト
     *              Pipeline layout for gradient pipelines
     */
    private gradientPipelineLayout: GPUPipelineLayout | null = null;
    /**
     * @description グラデーション用頂点シェーダーモジュール
     *              Vertex shader module for gradient pipelines
     */
    private gradientVertexShaderModule: GPUShaderModule | null = null;
    /**
     * @description グラデーション用フラグメントシェーダーモジュール
     *              Fragment shader module for gradient pipelines
     */
    private gradientFragmentShaderModule: GPUShaderModule | null = null;
    /**
     * @description グラデーション用ステンシルフラグメントシェーダーモジュール
     *              Stencil fragment shader module for gradient pipelines
     */
    private gradientStencilFragmentShaderModule: GPUShaderModule | null = null;

    /**
     * @description グラデーションバリアントパイプラインを作成する（override定数による特殊化）
     *              Create a gradient variant pipeline with override constants for specialization
     * @param {string} base_name - ベースパイプライン名 / Base pipeline name
     * @param {number} gradient_type - グラデーションタイプ / Gradient type identifier
     * @param {number} spread_mode - スプレッドモード / Spread mode identifier
     * @return {GPURenderPipeline | undefined} パイプラインまたはundefined / The pipeline or undefined
     */
    private createGradientVariant(base_name: string, gradient_type: number, spread_mode: number): GPURenderPipeline | undefined
    {
        if (!this.gradientPipelineLayout) {
            return undefined;
        }

        const constants = {
            "GRADIENT_TYPE": gradient_type,
            "SPREAD_MODE": spread_mode
        };

        const vertexBufferLayout = $VERTEX_BUFFER_LAYOUT_4F;
        const blendState = $BLEND_PREMULTIPLIED_ALPHA;

        // ベース名からパイプライン構成を決定
        const isStencilFragment = base_name.includes("stencil_atlas") || base_name === "gradient_fill_stencil_main";
        const fragModule = isStencilFragment ? this.gradientStencilFragmentShaderModule! : this.gradientFragmentShaderModule!;
        const isBGRA = base_name.includes("bgra") || base_name === "gradient_fill_stencil_main";
        const format: GPUTextureFormat = isBGRA ? this.format : "rgba8unorm";
        const needsYFlip = base_name.includes("bgra") || base_name === "gradient_fill_stencil_main";

        const vertexConstants: Record<string, number> = {};
        if (needsYFlip) {
            vertexConstants.yFlipSign = -1.0;
        }

        let depthStencil: GPUDepthStencilState | undefined;
        let sampleCount = this.sampleCount;

        if (base_name.includes("stroke")) {
            depthStencil = {
                "format": "stencil8",
                "stencilFront": { "compare": "always", "failOp": "keep", "depthFailOp": "keep", "passOp": "keep" },
                "stencilBack": { "compare": "always", "failOp": "keep", "depthFailOp": "keep", "passOp": "keep" },
                "stencilReadMask": 0x00,
                "stencilWriteMask": 0x00
            };
        } else if (base_name === "gradient_fill_stencil" || base_name === "gradient_fill_stencil_atlas") {
            depthStencil = {
                "format": "stencil8",
                "stencilFront": { "compare": "not-equal", "failOp": "keep", "depthFailOp": "zero", "passOp": "zero" },
                "stencilBack": { "compare": "not-equal", "failOp": "keep", "depthFailOp": "zero", "passOp": "zero" },
                "stencilReadMask": 0xFF,
                "stencilWriteMask": 0xFF
            };
        } else if (base_name === "gradient_fill_stencil_main") {
            depthStencil = {
                "format": "stencil8",
                "stencilFront": { "compare": "not-equal", "failOp": "keep", "depthFailOp": "zero", "passOp": "zero" },
                "stencilBack": { "compare": "not-equal", "failOp": "keep", "depthFailOp": "zero", "passOp": "zero" },
                "stencilReadMask": 0xFF,
                "stencilWriteMask": 0xFF
            };
            sampleCount = 1;
        } else if (base_name === "gradient_fill_bgra_stencil") {
            depthStencil = {
                "format": "stencil8",
                "stencilFront": { "compare": "equal", "failOp": "keep", "depthFailOp": "keep", "passOp": "keep" },
                "stencilBack": { "compare": "equal", "failOp": "keep", "depthFailOp": "keep", "passOp": "keep" },
                "stencilReadMask": 0xFF,
                "stencilWriteMask": 0x00
            };
        } else if (base_name === "gradient_fill_bgra_no_msaa") {
            sampleCount = 1;
        }

        const descriptor: GPURenderPipelineDescriptor = {
            "layout": this.gradientPipelineLayout,
            "vertex": {
                "module": this.gradientVertexShaderModule!,
                "entryPoint": "main",
                "buffers": [vertexBufferLayout],
                "constants": Object.keys(vertexConstants).length > 0 ? vertexConstants : undefined
            },
            "fragment": {
                "module": fragModule,
                "entryPoint": "main",
                "targets": [{ "format": format, "blend": blendState }],
                "constants": constants
            },
            "primitive": { "topology": "triangle-list", "cullMode": "none" },
            "multisample": { "count": sampleCount }
        };

        if (depthStencil) {
            descriptor.depthStencil = depthStencil;
        }

        return this.device.createRenderPipeline(descriptor);
    }

    /**
     * @description 名前からバインドグループレイアウトを取得する（遅延初期化を含む）
     *              Get a bind group layout by name, initializing lazy groups if needed
     * @param {string} name - バインドグループレイアウト名 / Bind group layout name
     * @return {GPUBindGroupLayout | undefined} レイアウトまたはundefined / The layout or undefined
     */
    getBindGroupLayout(name: string): GPUBindGroupLayout | undefined
    {
        let layout = this.bindGroupLayouts.get(name);
        if (!layout) {
            this.ensureLazyGroup(name);
            layout = this.bindGroupLayouts.get(name);
        }
        return layout;
    }

    /**
     * @description ノードクリア用パイプラインを作成する（カラーとステンシルの同時クリア）
     *              Create node clear pipeline for simultaneous color and stencil clear
     */
    private createNodeClearPipeline(): void
    {
        const vertexBufferLayout: GPUVertexBufferLayout = {
            "arrayStride": 2 * 4,
            "attributes": [
                {
                    "shaderLocation": 0,
                    "offset": 0,
                    "format": "float32x2"
                }
            ]
        };
        const nodeClearPipeline = this.device.createRenderPipeline({
            "layout": "auto",
            "vertex": {
                "module": this.getOrCreateShaderModule("nodeClearVertex", ShaderSource.getNodeClearVertexShader()),
                "entryPoint": "main",
                "buffers": [vertexBufferLayout]
            },
            "fragment": {
                "module": this.getOrCreateShaderModule("nodeClearFragment", ShaderSource.getNodeClearFragmentShader()),
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
                "count": this.sampleCount
            }
        });
        this.pipelines.set("node_clear_atlas", nodeClearPipeline);
    }

    /**
     * @description すべてのパイプライン・レイアウト・シェーダーモジュールを解放する
     *              Dispose all pipelines, layouts, and shader module caches
     */
    dispose(): void
    {
        this.pipelines.clear();
        this.bindGroupLayouts.clear();
        this.shaderModuleCache.clear();
        this.filterBindGroupLayouts.clear();
    }
}
