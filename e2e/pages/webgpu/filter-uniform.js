import { FrameBufferManager } from "/packages/webgpu/src/FrameBufferManager.ts";
import { BufferManager, DynamicUniformAllocator } from "/packages/webgpu/src/BufferManager.ts";
import { TextureManager } from "/packages/webgpu/src/TextureManager.ts";
import { PipelineManager } from "/packages/webgpu/src/Shader/PipelineManager.ts";
import { execute as applyFilter } from "/packages/webgpu/src/Context/usecase/ContextApplyFilterUseCase.ts";
import { execute as endLayer } from "/packages/webgpu/src/Context/usecase/ContextContainerEndLayerUseCase.ts";
import { extendedFilterBatches } from "./extended-filter-cases.js";
import { execute as resolveAttachment } from "/packages/webgpu/src/FrameBufferManager/service/FrameBufferManagerResolveAttachmentService.ts";
import { $setMaskTestEnabled, $setMaskStencilReference } from "/packages/webgpu/src/Mask.ts";

// Exercise real filter usecases/managers. The reference uploads each uniform to
// a separate buffer, independently of the arena's staging/offset/flush logic.
export async function compareFilterUniform({ extended = false, container = false } = {}) {
    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) throw new Error("WebGPU adapter unavailable");
    const device = await adapter.requestDevice();
    device.pushErrorScope("validation");
    const width = 64, height = 48, stride = 256;
    let cases = 0, maxDelta = 0, differentChannels = 0;
    const counts = [];
    const batches = extended ? extendedFilterBatches : [[
        [1, 2, 3, 1], [6, 0x00ccff, 0.7, 4, 3, 2, 1, 0, 0], [5, 3, 45, 0, 0.6, 3, 4, 1, 1, 0, 0, 0]
    ]];
    const sequences = [
        ["normal", "add", "screen"],
        ["normal", "multiply", "overlay"],
        ["normal", "erase", "normal"]
    ];
    try {
        for (const format of ["rgba8unorm", "bgra8unorm"]) {
            const pipelineManager = new PipelineManager(device, format);
            for (const msaa of [false, true]) for (const masked of container ? [false] : [false, true]) {
                for (const sequence of sequences) for (const batch of batches) {
                    const outputs = [];
                    for (const legacy of [true, false]) {
                        const frameBufferManager = new FrameBufferManager(device, format);
                        const bufferManager = new BufferManager(device);
                        // Force growth within a single encoded sequence, before submit.
                        bufferManager.dynamicUniform.dispose();
                        bufferManager.dynamicUniform = new DynamicUniformAllocator(device, 256);
                        let allocations = 0;
                        const allocate = bufferManager.allocateUniformBinding.bind(bufferManager);
                        bufferManager.allocateUniformBinding = data => {
                            allocations++;
                            if (!legacy) return allocate(data);
                            const buffer = device.createBuffer({ size: data.byteLength,
                                usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST });
                            device.queue.writeBuffer(buffer, 0, data);
                            return { buffer, offset: 0, size: data.byteLength };
                        };
                        const textureManager = new TextureManager(device);
                        const main = frameBufferManager.createAttachment("main", width, height, msaa, masked);
                        const atlas = frameBufferManager.createAttachment("atlas", 15, 11);
                        const data = new Uint8Array(15 * 11 * 4);
                        for (let i = 0; i < 15 * 11; i++) {
                            const alpha = [0, 64, 128, 255][i % 4];
                            data.set([(i * 13) % (alpha + 1), (i * 7) % (alpha + 1), alpha / 2, alpha], i * 4);
                        }
                        device.queue.writeTexture({ texture: atlas.texture.resource }, data,
                            { bytesPerRow: 60 }, [15, 11]);
                        const commandEncoder = device.createCommandEncoder();
                        const originalBegin = commandEncoder.beginRenderPass.bind(commandEncoder);
                        let resolves = 0;
                        commandEncoder.beginRenderPass = descriptor => {
                            const colorAttachments = Array.from(descriptor.colorAttachments, attachment => {
                                if (!attachment) return attachment;
                                const copy = { ...attachment };
                                // Use identical eager resolves in both variants to isolate uniforms.
                                if (msaa && copy.view === main.msaaTexture.view) {
                                    copy.resolveTarget = main.texture.view;
                                }
                                if (copy.resolveTarget) resolves++;
                                return copy;
                            });
                            return originalBegin({ ...descriptor, colorAttachments });
                        };
                        const target = msaa ? main.msaaTexture.view : main.texture.view;
                        const clear = { colorAttachments: [{ view: target, loadOp: "clear", storeOp: "store",
                            clearValue: [0.04, 0.08, 0.12, 0.5] }] };
                        if (masked) {
                            clear.depthStencilAttachment = {
                                view: msaa ? main.msaaStencil.view : main.stencil.view,
                                stencilLoadOp: "clear", stencilStoreOp: "store", stencilClearValue: 0
                            };
                        }
                        const clearPass = commandEncoder.beginRenderPass(clear);
                        if (masked) {
                            // Populate only a central rectangle with stencil 1, leaving color intact.
                            const module = device.createShaderModule({ code: `
                                @vertex fn vs(@builtin(vertex_index) i: u32) -> @builtin(position) vec4<f32> {
                                    let p = array<vec2<f32>, 3>(vec2(-1.0,-1.0),vec2(3.0,-1.0),vec2(-1.0,3.0));
                                    return vec4(p[i],0.0,1.0);
                                }
                                @fragment fn fs() -> @location(0) vec4<f32> { return vec4(0.0); }
                            ` });
                            clearPass.setPipeline(device.createRenderPipeline({ layout: "auto",
                                vertex: { module, entryPoint: "vs" },
                                fragment: { module, entryPoint: "fs", targets: [{ format, writeMask: 0 }] },
                                multisample: { count: msaa ? 4 : 1 },
                                depthStencil: { format: "stencil8",
                                    stencilFront: { compare: "always", passOp: "replace" },
                                    stencilBack: { compare: "always", passOp: "replace" } }
                            }));
                            clearPass.setStencilReference(1);
                            clearPass.setScissorRect(9, 7, 30, 25);
                            clearPass.draw(3);
                        }
                        clearPass.end();
                        main.msaaDirty = false;
                        const config = { device, commandEncoder, bufferManager, frameBufferManager,
                            pipelineManager, textureManager, mainAttachment: main, frameTextures: [] };
                        for (let step = 0; step < sequence.length; step++) {
                            $setMaskTestEnabled(masked);
                            $setMaskStencilReference(1);
                            const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
                            const colors = new Float32Array([0.8, 1, 0.6, 0.7, 0, 0, 0, 0]);
                            const bounds = new Float32Array([step * 7 - 1.25, step * 4 + 3.5, 15, 11]);
                            const params = new Float32Array(batch[step]);
                            if (container) {
                                endLayer(atlas, main, "", sequence[step], matrix, colors, true, bounds, params,
                                    "", "", 15, 11, config, bufferManager);
                            } else {
                                applyFilter({ x: 0, y: 0, w: 15, h: 11, index: 0 }, 15, 11, false,
                                    matrix, colors, sequence[step], bounds, params, config, main.texture.view, bufferManager);
                            }
                            main.msaaDirty = false;
                        }
                        $setMaskTestEnabled(false);
                        resolveAttachment(commandEncoder, frameBufferManager, main);
                        // A second reader must not resolve again without intervening writes.
                        const beforeSecondRead = resolves;
                        resolveAttachment(commandEncoder, frameBufferManager, main);
                        if (resolves !== beforeSecondRead) throw new Error("Redundant second-reader resolve");
                        const readback = device.createBuffer({ size: stride * height,
                            usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ });
                        commandEncoder.copyTextureToBuffer({ texture: main.texture.resource },
                            { buffer: readback, bytesPerRow: stride }, [width, height]);
                        bufferManager.dynamicUniform.flush();
                        device.queue.submit([commandEncoder.finish()]);
                        await readback.mapAsync(GPUMapMode.READ);
                        outputs.push({ data: new Uint8Array(readback.getMappedRange()).slice(), resolves, allocations });
                        if (new Set(outputs.at(-1).data).size <= 4) throw new Error("Filter output contains only clear color");
                        readback.unmap();
                        readback.destroy();
                        frameBufferManager.flushPendingReleases();
                        bufferManager.dispose();
                        // Device destruction below also releases the small per-case attachments/pools.
                    }
                    for (let i = 0; i < outputs[0].data.length; i++) {
                        const delta = Math.abs(outputs[0].data[i] - outputs[1].data[i]);
                        maxDelta = Math.max(maxDelta, delta);
                        if (delta) differentChannels++;
                        if (delta > 0) throw new Error(JSON.stringify({ format, msaa, masked, container, sequence, batch: batches.indexOf(batch), i, delta }));
                    }
                    if (outputs[0].resolves !== outputs[1].resolves || outputs[0].allocations !== outputs[1].allocations
                        || outputs[1].allocations < 10) {
                        throw new Error("Uniform comparison did not exercise identical multi-pass sequences");
                    }
                    counts.push({ format, msaa, masked, container, sequence, batch: batches.indexOf(batch), resolves: outputs[1].resolves, allocations: outputs[1].allocations });
                    cases++;
                }
            }
        }
        const error = await device.popErrorScope();
        if (error) throw new Error(error.message);
        return { cases, maxDelta, differentChannels, counts };
    } finally {
        $setMaskTestEnabled(false);
        device.destroy();
    }
}
