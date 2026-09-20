import { Context } from "/packages/webgpu/src/Context.ts";
import { FrameBufferManager } from "/packages/webgpu/src/FrameBufferManager.ts";
import { BufferManager, DynamicUniformAllocator } from "/packages/webgpu/src/BufferManager.ts";
import { TextureManager } from "/packages/webgpu/src/TextureManager.ts";
import { PipelineManager } from "/packages/webgpu/src/Shader/PipelineManager.ts";
import { WebGPUUtil } from "/packages/webgpu/src/WebGPUUtil.ts";
import { $cacheStore } from "/packages/cache/src/index.ts";
import { renderQueue } from "/packages/render-queue/src/index.ts";
import { getInstancedShaderManager } from "/packages/webgpu/src/Blend/BlendInstancedManager.ts";
import { $setActiveAtlasIndex, $setAtlasAttachmentObject } from "/packages/webgpu/src/AtlasManager.ts";
import { $setCurrentBlendMode } from "/packages/webgpu/src/Blend.ts";
import { execute as resolveAttachment } from "/packages/webgpu/src/FrameBufferManager/service/FrameBufferManagerResolveAttachmentService.ts";

// Call the production cached-output method with real GPU managers. Frame setup
// is explicit to read pixels without a swap chain or unrelated atlas work.
export async function compareCachedFilterUniform({ transitions = false, edges = false, stress = false, contents = false } = {}) {
    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) throw new Error("WebGPU adapter unavailable");
    const device = await adapter.requestDevice();
    device.pushErrorScope("validation");
    const width = 64, height = 48, stride = 256;
    const identity = new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);
    let cases = 0, frames = 0, maxDelta = 0;
    let baselinePasses = 0, currentPasses = 0;
    WebGPUUtil.setDevice(device);
    try {
        for (const format of ["rgba8unorm", "bgra8unorm"]) {
            const pipelineManager = new PipelineManager(device, format);
            for (const [sourceWidth, sourceHeight] of stress ? [[1, 1], [17, 13], [31, 19]] : [[15, 11]]) {
            for (const msaa of [false, true]) for (const dpr of [1, 2]) {
                WebGPUUtil.setDevicePixelRatio(dpr);
                for (const blend of ["normal", "add", "screen", "alpha", "erase"]) {
                    for (const withColor of [false, true]) {
                        const outputs = [];
                        const passCounts = [];
                        for (const legacy of [true, false]) {
                            const frameBufferManager = new FrameBufferManager(device, format);
                            const bufferManager = new BufferManager(device);
                            bufferManager.dynamicUniform.dispose();
                            bufferManager.dynamicUniform = new DynamicUniformAllocator(device, 256);
                            const main = frameBufferManager.createAttachment("main", width, height, msaa, false);
                            const alternate = transitions
                                ? frameBufferManager.createAttachment("alternate", width, height, msaa, false) : null;
                            const context = {
                                device, pipelineManager, frameBufferManager, bufferManager,
                                textureManager: new TextureManager(device),
                                $mainAttachmentObject: main,
                                frameStarted: true, renderPassEncoder: null,
                                cachedFilterBindGroups: new WeakMap(),
                                useOptimizedInstancing: true, renderPassIsInstanced: false,
                                drawArraysInstanced: Context.prototype.drawArraysInstanced,
                                processComplexBlendQueue: Context.prototype.processComplexBlendQueue,
                                ensureCommandEncoder() {}, bind: Context.prototype.bind
                            };
                            if (legacy) {
                                context.cachedFilterBindGroups = { get() {}, set() {} };
                                bufferManager.getIdentityUVBuffer = () => bufferManager.acquireAndWriteUniformBuffer(new Float32Array([1, 1, 0, 0]));
                                // Keep the original two-pass CT as an independent reference.
                                context.pipelineManager = {
                                    getPipeline: name => name.startsWith("cached_ct") ? undefined : pipelineManager.getPipeline(name),
                                    getBindGroupLayout: name => pipelineManager.getBindGroupLayout(name)
                                };
                                // Never recycle reference buffers across draws or frames.
                                bufferManager.acquireAndWriteUniformBuffer = data => {
                                    const buffer = device.createBuffer({ size: data.byteLength,
                                        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST });
                                    device.queue.writeBuffer(buffer, 0, data);
                                    return buffer;
                                };
                                bufferManager.allocateUniformBinding = data => ({
                                    buffer: bufferManager.acquireAndWriteUniformBuffer(data), offset: 0, size: data.byteLength
                                });
                            }
                            const textures = [0, 1].map(seed => {
                                const attachment = frameBufferManager.createAttachment("cached", sourceWidth, sourceHeight);
                                const data = new Uint8Array(sourceWidth * sourceHeight * 4);
                                for (let i = 0; i < sourceWidth * sourceHeight; i++) {
                                    const alphas = edges || stress ? [0, 1, 2, 3, 63, 127, 128, 129, 254, 255] : [0, 64, 128, 255];
                                    const alpha = alphas[(i + seed + (sourceWidth === 1 ? 5 : 0)) % alphas.length];
                                    data.set([(i * 13 + seed * 17) % (alpha + 1),
                                        (i * 7) % (alpha + 1), alpha / 2, alpha], i * 4);
                                }
                                device.queue.writeTexture({ texture: attachment.texture.resource }, data,
                                    { bytesPerRow: sourceWidth * 4 }, [sourceWidth, sourceHeight]);
                                return attachment;
                            });
                            const variantFrames = [];
                            let variantPasses = 0;
                            for (let frame = 0; frame < 3; frame++) {
                                if (contents && frame === 2) {
                                    // Same GPUTextureView, new texels: bindings may be reused,
                                    // but the sampled content must never be cached on the CPU.
                                    const data = new Uint8Array(sourceWidth * sourceHeight * 4);
                                    for (let i = 0; i < sourceWidth * sourceHeight; i++) {
                                        data.set([i % 128, 127 - i % 128, i * 7 % 128, 128], i * 4);
                                    }
                                    device.queue.writeTexture({ texture: textures[1].texture.resource }, data,
                                        { bytesPerRow: sourceWidth * 4 }, [sourceWidth, sourceHeight]);
                                }
                                frameBufferManager.beginFrame();
                                const commandEncoder = device.createCommandEncoder();
                                const beginPass = commandEncoder.beginRenderPass.bind(commandEncoder);
                                commandEncoder.beginRenderPass = descriptor => {
                                    variantPasses++;
                                    return beginPass(descriptor);
                                };
                                context.commandEncoder = commandEncoder;
                                context.$mainAttachmentObject = main;
                                context.bind(main);
                                commandEncoder.beginRenderPass({ colorAttachments: [{
                                    view: msaa ? main.msaaTexture.view : main.texture.view,
                                    loadOp: "clear", storeOp: "store", clearValue: [0.08, 0.12, 0.2, 0.7]
                                }] }).end();
                                main.msaaDirty = msaa;
                                if (alternate) {
                                    commandEncoder.beginRenderPass({ colorAttachments: [{
                                        view: msaa ? alternate.msaaTexture.view : alternate.texture.view,
                                        loadOp: "clear", storeOp: "store", clearValue: [0.02, 0.04, 0.08, 0.3]
                                    }] }).end();
                                    alternate.msaaDirty = msaa;
                                }
                                // Frame 1 replaces the cache view, frame 2 reuses that replacement.
                                $cacheStore.set("cached-uniform-gpu", "fKey", "valid");
                                $cacheStore.set("cached-uniform-gpu", "fTexture", textures[frame ? 1 : 0]);
                                for (let step = 0; step < (stress ? 32 : 8); step++) {
                                    if (transitions && step === 2 && msaa) {
                                        // Queue a real ordinary draw while cached output is open.
                                        // The next cached call must flush it in order and must not
                                        // inherit the cached pass's viewport/scissor as instanced state.
                                        $setActiveAtlasIndex(0);
                                        $setAtlasAttachmentObject(textures[0]);
                                        $setCurrentBlendMode("normal");
                                        renderQueue.pushInstanceBuffer(
                                            0.5 / 15, 0.5 / 11, 14 / 15, 10 / 11,
                                            15, 11, width, height, 12, 10, 0, 0,
                                            1, 0, 0, 1, 1, 0.6, 0.8, 0.7, 0, 0, 0, 0
                                        );
                                        getInstancedShaderManager().count++;
                                    }
                                    if (transitions && step === 2 && !msaa) context.drawArraysInstanced();
                                    if (transitions && step === 3) context.drawArraysInstanced();
                                    if (transitions && (step === 4 || step === 6)) {
                                        const target = step === 4 ? alternate : main;
                                        context.bind(target);
                                        context.$mainAttachmentObject = target;
                                    }
                                    const colors = withColor && step % 3 !== 2
                                        ? new Float32Array(stress
                                            ? [((step * 37) % 131) / 100, ((step * 11) % 117) / 100,
                                                ((step * 53) % 151) / 100, 0.013 + ((step * 7) % 101) / 100 + frame * 0.07,
                                                (step % 7 - 3) / 255, (step % 5 - 2) / 255, (step % 11 - 5) / 255, 0.1]
                                            : edges
                                            ? [0.5, 1.3, -0.2, frame === 0 ? 0.5 : 0.31 + step * 0.07 + frame * 0.05,
                                                step % 2 ? -0.03 : 0.5 / 255, 0.03, 0.7, 0.125]
                                            : [0.8, 0.9, 0.7, 0.3 + step * 0.07 + frame * 0.05, 8, 3, 5, 0])
                                        : identity;
                                    const mode = transitions
                                        ? ["normal", blend, "screen", "erase", "add", "alpha", "normal", blend][step] : blend;
                                    Context.prototype.containerDrawCachedFilter.call(context, mode,
                                        new Float32Array([dpr, 0, 0, dpr, stress ? (step * 7) % 54 : step * 9,
                                            stress ? (step * 11) % 37 : step * 5]), colors,
                                        new Float32Array([-1.25, 2.5, sourceWidth, sourceHeight]), "cached-uniform-gpu", "valid");
                                    // Reference preserves one output pass per draw, isolating
                                    // pass merging in addition to independent uniform uploads.
                                    if (legacy && context.renderPassEncoder) {
                                        context.renderPassEncoder.end();
                                        context.renderPassEncoder = null;
                                    }
                                }
                                if (context.renderPassEncoder) {
                                    context.renderPassEncoder.end();
                                    context.renderPassEncoder = null;
                                }
                                resolveAttachment(commandEncoder, frameBufferManager, main);
                                if (alternate) resolveAttachment(commandEncoder, frameBufferManager, alternate);
                                const readback = device.createBuffer({ size: stride * height * (alternate ? 2 : 1),
                                    usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ });
                                commandEncoder.copyTextureToBuffer({ texture: main.texture.resource },
                                    { buffer: readback, bytesPerRow: stride }, [width, height]);
                                if (alternate) commandEncoder.copyTextureToBuffer({ texture: alternate.texture.resource },
                                    { buffer: readback, offset: stride * height, bytesPerRow: stride }, [width, height]);
                                bufferManager.dynamicUniform.flush();
                                bufferManager.instanceBuffer.flush();
                                device.queue.submit([commandEncoder.finish()]);
                                await readback.mapAsync(GPUMapMode.READ);
                                const data = new Uint8Array(readback.getMappedRange()).slice();
                                if (new Set(data).size <= 4) throw new Error("Cached output contains only clear color");
                                variantFrames.push(data);
                                readback.unmap();
                                readback.destroy();
                                bufferManager.clearFrameBuffers();
                                frameBufferManager.flushPendingReleases();
                            }
                            if (!variantFrames[0].some((value, i) => value !== variantFrames[1][i])) {
                                throw new Error("Cache replacement did not change pixels");
                            }
                            if ((withColor || contents) && !variantFrames[1].some((value, i) => value !== variantFrames[2][i])) {
                                throw new Error("Color transform update did not change pixels");
                            }
                            outputs.push(variantFrames);
                            passCounts.push(variantPasses);
                            $cacheStore.set("cached-uniform-gpu", "fTexture", null);
                            bufferManager.dispose();
                        }
                        if (passCounts[1] >= passCounts[0]) {
                            throw new Error(JSON.stringify({ error: "No cached output passes merged", transitions, withColor, passCounts }));
                        }
                        baselinePasses += passCounts[0];
                        currentPasses += passCounts[1];
                        for (let frame = 0; frame < 3; frame++) {
                            for (let i = 0; i < outputs[0][frame].length; i++) {
                                const delta = Math.abs(outputs[0][frame][i] - outputs[1][frame][i]);
                                maxDelta = Math.max(maxDelta, delta);
                                if (delta) throw new Error(JSON.stringify({ format, msaa, dpr, blend, withColor, sourceWidth, sourceHeight, frame, i, delta,
                                    before: outputs[0][frame][i], after: outputs[1][frame][i] }));
                            }
                            frames++;
                        }
                        cases++;
                    }
                }
            }
            }
        }
        await device.queue.onSubmittedWorkDone();
        const validation = await device.popErrorScope();
        if (validation) throw new Error(validation.message);
        return { cases, frames, maxDelta, baselinePasses, currentPasses };
    } finally {
        device.destroy();
    }
}
