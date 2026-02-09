import { ShaderSource } from "./ShaderSource";
import { $samples } from "../WebGPUUtil";

const VERTEX_BUFFER_LAYOUT_4F: GPUVertexBufferLayout = {
    "arrayStride": 4 * 4,
    "attributes": [
        { "shaderLocation": 0, "offset": 0, "format": "float32x2" },
        { "shaderLocation": 1, "offset": 2 * 4, "format": "float32x2" }
    ]
};

const BLEND_PREMULTIPLIED_ALPHA: GPUBlendState = {
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

export class PipelineManager
{
    private device: GPUDevice;
    private format: GPUTextureFormat;
    private pipelines: Map<string, GPURenderPipeline>;
    private bindGroupLayouts: Map<string, GPUBindGroupLayout>;
    private sampleCount: number;
    private shaderModuleCache: Map<string, GPUShaderModule> = new Map();
    private filterBindGroupLayouts: Map<number, GPUBindGroupLayout> = new Map();

    constructor(device: GPUDevice, format: GPUTextureFormat)
    {
        this.device = device;
        this.format = format;
        this.pipelines = new Map();
        this.bindGroupLayouts = new Map();
        this.sampleCount = $samples;

        this.initialize();
    }

    private getOrCreateShaderModule(key: string, code: string): GPUShaderModule
    {
        let module = this.shaderModuleCache.get(key);
        if (!module) {
            module = this.device.createShaderModule({ code });
            this.shaderModuleCache.set(key, module);
        }
        return module;
    }

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

    private lazyInitGroups: Set<string> = new Set();
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

    preloadLazyGroups(): void
    {
        const groups = ["blur_filter", "texture_copy", "bitmap_sync", "filter", "complex_blend"];
        for (const group of groups) {
            this.ensureLazyGroup(group);
        }
    }

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

        const vertexShaderModule = this.getOrCreateShaderModule("fillVertex", ShaderSource.getFillVertexShader());

        const fragmentShaderModule = this.getOrCreateShaderModule("fillFragment", ShaderSource.getFillFragmentShader());

        const vertexBufferLayout = VERTEX_BUFFER_LAYOUT_4F;
        const blendState = BLEND_PREMULTIPLIED_ALPHA;
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

    private createStencilFillPipelines(): void
    {
        const vertexBufferLayout = VERTEX_BUFFER_LAYOUT_4F;
        const stencilWritePipeline = this.device.createRenderPipeline({
            "layout": "auto",
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
            "layout": "auto",
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
            "layout": "auto",
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
            "layout": "auto",
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
            "layout": "auto",
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
            "layout": "auto",
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
            "layout": "auto",
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

    private createClipPipeline(): void
    {
        const vertexBufferLayout = VERTEX_BUFFER_LAYOUT_4F;
        const clipWritePipeline = this.device.createRenderPipeline({
            "layout": "auto",
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
                "layout": "auto",
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
                "layout": "auto",
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

    private createMaskUnionPipelines(): void
    {
        const vertexBufferLayout = VERTEX_BUFFER_LAYOUT_4F;

        const vertexShaderModule = this.getOrCreateShaderModule("stencilWriteVertex", ShaderSource.getStencilWriteVertexShader());
        const fragmentShaderModule = this.getOrCreateShaderModule("stencilWriteFragment", ShaderSource.getStencilWriteFragmentShader());
        for (let level = 1; level <= 8; level++) {
            const mask = 1 << level - 1;
            const upperBitsMask = ~mask & 0xFF;
            const mergePipeline = this.device.createRenderPipeline({
                "layout": "auto",
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
                "layout": "auto",
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

        const blendState = BLEND_PREMULTIPLIED_ALPHA;
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

        const vertexShaderModule = this.getOrCreateShaderModule("gradientFillVertex", ShaderSource.getGradientFillVertexShader());

        const fragmentShaderModule = this.getOrCreateShaderModule("gradientFillFragment", ShaderSource.getGradientFillFragmentShader());
        const stencilFragmentShaderModule = this.getOrCreateShaderModule("gradientFillStencilFragment", ShaderSource.getGradientFillStencilFragmentShader());

        const vertexBufferLayout = VERTEX_BUFFER_LAYOUT_4F;
        const blendState = BLEND_PREMULTIPLIED_ALPHA;
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

        const vertexBufferLayout = VERTEX_BUFFER_LAYOUT_4F;
        const blendState = BLEND_PREMULTIPLIED_ALPHA;
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

    private createFilterPipelineWithLayout(
        name: string,
        fragmentShaderCode: string,
        textureCount: number,
        blend: GPUBlendState
    ): void
    {
        let bindGroupLayout = this.filterBindGroupLayouts.get(textureCount);
        if (!bindGroupLayout) {
            const entries: GPUBindGroupLayoutEntry[] = [
                { "binding": 0, "visibility": GPUShaderStage.FRAGMENT, "buffer": { "type": "uniform" } },
                { "binding": 1, "visibility": GPUShaderStage.FRAGMENT, "sampler": {} }
            ];
            for (let i = 0; i < textureCount; i++) {
                entries.push({ "binding": 2 + i, "visibility": GPUShaderStage.FRAGMENT, "texture": {} });
            }
            bindGroupLayout = this.device.createBindGroupLayout({ "entries": entries });
            this.filterBindGroupLayouts.set(textureCount, bindGroupLayout);
        }

        this.bindGroupLayouts.set(name, bindGroupLayout);

        const pipelineLayout = this.device.createPipelineLayout({ "bindGroupLayouts": [bindGroupLayout] });
        const vertexShaderModule = this.getOrCreateShaderModule("blurFilterVertex", ShaderSource.getBlurFilterVertexShader());
        const fragmentShaderModule = this.getOrCreateShaderModule(`filter_${name}`, fragmentShaderCode);

        this.pipelines.set(name, this.createFullscreenQuadPipeline(
            pipelineLayout, vertexShaderModule, fragmentShaderModule, "rgba8unorm", blend
        ));
    }

    private createFullscreenQuadPipeline(
        pipelineLayout: GPUPipelineLayout,
        vertexModule: GPUShaderModule,
        fragmentModule: GPUShaderModule,
        format: GPUTextureFormat,
        blend: GPUBlendState,
        multisampleCount?: number,
        depthStencil?: GPUDepthStencilState
    ): GPURenderPipeline
    {
        const descriptor: GPURenderPipelineDescriptor = {
            "layout": pipelineLayout,
            "vertex": {
                "module": vertexModule,
                "entryPoint": "main",
                "buffers": []
            },
            "fragment": {
                "module": fragmentModule,
                "entryPoint": "main",
                "targets": [{ "format": format, "blend": blend }]
            },
            "primitive": {
                "topology": "triangle-list",
                "cullMode": "none"
            }
        };

        if (multisampleCount && multisampleCount > 1) {
            descriptor.multisample = { "count": multisampleCount };
        }

        if (depthStencil) {
            descriptor.depthStencil = depthStencil;
        }

        return this.device.createRenderPipeline(descriptor);
    }

    getPipeline(name: string): GPURenderPipeline | undefined
    {
        let pipeline = this.pipelines.get(name);
        if (!pipeline) {
            this.ensureLazyGroup(name);
            pipeline = this.pipelines.get(name);
        }
        return pipeline;
    }

    getBindGroupLayout(name: string): GPUBindGroupLayout | undefined
    {
        let layout = this.bindGroupLayouts.get(name);
        if (!layout) {
            this.ensureLazyGroup(name);
            layout = this.bindGroupLayouts.get(name);
        }
        return layout;
    }

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

    dispose(): void
    {
        this.pipelines.clear();
        this.bindGroupLayouts.clear();
        this.shaderModuleCache.clear();
        this.filterBindGroupLayouts.clear();
    }
}
