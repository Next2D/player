import { ShaderSource } from "/packages/webgpu/src/Shader/ShaderSource.ts";

// Compare the removed nearest-copy + blend sequence against the region shader
// with actual GPU readback. No screenshot baseline is generated from the new path.
export async function compareBackdropPaths({ localResolve = false, backdropFormat = "rgba8unorm" } = {}) {
    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) throw new Error("WebGPU adapter unavailable");
    const device = await adapter.requestDevice();
    device.pushErrorScope("validation");
    const owned = [];
    const texture = (width, height, sampleCount = 1, format = "rgba8unorm") => {
        const result = device.createTexture({ size: [width, height], sampleCount, format,
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | (sampleCount === 1
                ? GPUTextureUsage.COPY_DST | GPUTextureUsage.COPY_SRC : 0) });
        owned.push(result);
        return result;
    };
    const buffer = (size, usage, data) => {
        const result = device.createBuffer({ size, usage, mappedAtCreation: !!data });
        if (data) {
            new Float32Array(result.getMappedRange()).set(data);
            result.unmap();
        }
        owned.push(result);
        return result;
    };
    const pipeline = (fragment, sampleCount = 1, format = "rgba8unorm") => device.createRenderPipeline({
        layout: "auto",
        vertex: { module: device.createShaderModule({ code: ShaderSource.getComplexBlendVertexShader() }), entryPoint: "main" },
        fragment: { module: device.createShaderModule({ code: fragment }), entryPoint: "main", targets: [{ format }] },
        primitive: { topology: "triangle-list" }, multisample: { count: sampleCount }
    });
    const oldBlend = pipeline(ShaderSource.getUnifiedComplexBlendFragmentShader(localResolve));
    const newBlend = pipeline(ShaderSource.getUnifiedComplexBlendFragmentShader(true, localResolve));
    const copy = pipeline(ShaderSource.getTextureCopyFragmentShader());
    const copyMsaa = pipeline(ShaderSource.getTextureCopyFragmentShader(), 4, backdropFormat);
    const distinctMsaa = pipeline(ShaderSource.getTextureCopyFragmentShader()
        .replace("fn main(input: VertexOutput)", "fn main(input: VertexOutput, @builtin(sample_index) sample: u32)")
        .replace("let uv = input.texCoord * uniforms.scale + uniforms.offset;", `
            let uv = input.texCoord * uniforms.scale + uniforms.offset + vec2<f32>(f32(sample) / 31.0, f32(sample) * 3.0 / 23.0);
            if ((u32(input.position.x) + sample) % 5u == 0u) { discard; }
        `), 4, backdropFormat);
    const nearest = device.createSampler();
    const linear = device.createSampler({ minFilter: "linear", magFilter: "linear" });
    const pattern = (target, seed) => {
        const data = new Uint8Array(target.width * target.height * 4);
        for (let y = 0; y < target.height; y++) for (let x = 0; x < target.width; x++) {
            const at = (y * target.width + x) * 4;
            const alpha = [0, 64, 128, 255][(x + 3 * y + seed) % 4];
            data.set([(x * 17 + seed) % (alpha + 1), (y * 23 + seed) % (alpha + 1),
                (x * 31 + y * 7) % (alpha + 1), alpha], at);
        }
        device.queue.writeTexture({ texture: target }, data, { bytesPerRow: target.width * 4 }, [target.width, target.height]);
    };
    const draw = (encoder, renderPipeline, output, uniforms, sampler, inputs, resolveTarget) => {
        const uniform = buffer(uniforms.byteLength, GPUBufferUsage.UNIFORM, uniforms);
        const entries = [{ binding: 0, resource: { buffer: uniform } }, { binding: 1, resource: sampler },
            ...inputs.map((input, index) => ({ binding: index + 2, resource: input.createView() }))];
        const group = device.createBindGroup({ layout: renderPipeline.getBindGroupLayout(0), entries });
        const pass = encoder.beginRenderPass({ colorAttachments: [{ view: output.createView(),
            resolveTarget: resolveTarget?.createView(), loadOp: "clear", storeOp: "store" }] });
        pass.setPipeline(renderPipeline);
        pass.setBindGroup(0, group);
        pass.draw(6);
        pass.end();
    };
    let cases = 0;
    let maxDelta = 0;
    let differentChannels = 0;
    try {
        const configurations = localResolve
            ? [{ samples: 4, distinct: false }, { samples: 4, distinct: true }]
            : [{ samples: 1, distinct: false }, { samples: 4, distinct: false }];
        for (const { samples, distinct } of configurations) for (let mode = 0; mode < 8; mode++) {
            for (const [x, y, width, height] of [[0, 0, 1, 1], [3, 5, 9, 7], [29, 21, 9, 7], [0, 19, 7, 9], [0, 0, 35, 27]]) {
                for (const transform of [false, true]) {
                    const backdrop = texture(31, 23);
                    const source = texture(width, height);
                    pattern(backdrop, 11);
                    pattern(source, 19);
                    const encoder = device.createCommandEncoder();
                    let resolved = backdrop;
                    let multisampled;
                    if (samples === 4) {
                        resolved = texture(31, 23, 1, backdropFormat);
                        multisampled = texture(31, 23, 4, backdropFormat);
                        draw(encoder, distinct ? distinctMsaa : copyMsaa, multisampled, new Float32Array([1, 1, 0, 0]), nearest, [backdrop], resolved);
                    }
                    const oldBackdrop = texture(width, height);
                    draw(encoder, copy, oldBackdrop, new Float32Array([width / 31, height / 23, x / 31, y / 23]), nearest, [resolved]);
                    const oldOutput = texture(width, height);
                    const newOutput = texture(width, height);
                    const colors = new Float32Array(transform
                        ? [0.7, 1.2, 0.5, 0.6, 0.1, 0, 0.15, 0, mode, 0, 0, 0]
                        : [1, 1, 1, 1, 0, 0, 0, 0, mode, 0, 0, 0]);
                    if (localResolve) {
                        colors[9] = x;
                        colors[10] = y;
                    }
                    draw(encoder, oldBlend, oldOutput, colors, linear, [localResolve ? resolved : oldBackdrop, source]);
                    colors[9] = x;
                    colors[10] = y;
                    draw(encoder, newBlend, newOutput, colors, linear, [localResolve ? multisampled : resolved, source]);
                    const stride = 256;
                    const offset = stride * height;
                    const readback = buffer(offset * 2, GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ);
                    encoder.copyTextureToBuffer({ texture: oldOutput }, { buffer: readback, bytesPerRow: stride }, [width, height]);
                    encoder.copyTextureToBuffer({ texture: newOutput }, { buffer: readback, offset, bytesPerRow: stride }, [width, height]);
                    device.queue.submit([encoder.finish()]);
                    await readback.mapAsync(GPUMapMode.READ);
                    const pixels = new Uint8Array(readback.getMappedRange());
                    for (let row = 0; row < height; row++) for (let column = 0; column < width * 4; column++) {
                        const at = row * stride + column;
                        const delta = Math.abs(pixels[at] - pixels[offset + at]);
                        if (delta) differentChannels++;
                        maxDelta = Math.max(maxDelta, delta);
                        if (delta > 1) {
                            const detail = { distinct, backdropFormat, samples, mode, x, y, width, height, transform, row, column, delta,
                                old: Array.from(pixels.slice(row * stride + (column >> 2) * 4, row * stride + (column >> 2) * 4 + 4)),
                                current: Array.from(pixels.slice(offset + row * stride + (column >> 2) * 4, offset + row * stride + (column >> 2) * 4 + 4)) };
                            readback.unmap();
                            if (localResolve) {
                                const px = Math.min(30, x + (column >> 2));
                                const py = Math.min(22, y + row);
                                const data = buffer(80, GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC);
                                const read = buffer(80, GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ);
                                const inspect = device.createComputePipeline({ layout: "auto", compute: { entryPoint: "main",
                                    module: device.createShaderModule({ code: `
                                        @group(0) @binding(0) var input: texture_multisampled_2d<f32>;
                                        @group(0) @binding(1) var<storage, read_write> output: array<vec4<f32>, 4>;
                                        @compute @workgroup_size(1) fn main() {
                                            for (var i = 0; i < 4; i++) { output[i] = textureLoad(input, vec2<i32>(${px}, ${py}), i); }
                                        }` }) } });
                                const debug = device.createCommandEncoder();
                                const pass = debug.beginComputePass();
                                pass.setPipeline(inspect);
                                pass.setBindGroup(0, device.createBindGroup({ layout: inspect.getBindGroupLayout(0), entries: [
                                    { binding: 0, resource: multisampled.createView() }, { binding: 1, resource: { buffer: data } }
                                ] }));
                                pass.dispatchWorkgroups(1);
                                pass.end();
                                debug.copyBufferToBuffer(data, 0, read, 0, 64);
                                debug.copyTextureToBuffer({ texture: resolved, origin: [px, py] }, { buffer: read, offset: 64 }, [1, 1]);
                                device.queue.submit([debug.finish()]);
                                await read.mapAsync(GPUMapMode.READ);
                                const mapped = read.getMappedRange();
                                detail.sampleValues = Array.from(new Float32Array(mapped, 0, 16)).map(value => value * 255);
                                detail.resolved = Array.from(new Uint8Array(mapped, 64, 4));
                                read.unmap();
                            }
                            throw new Error(JSON.stringify(detail));
                        }
                    }
                    readback.unmap();
                    for (const resource of owned.splice(0)) resource.destroy();
                    cases++;
                }
            }
        }
        const error = await device.popErrorScope();
        if (error) throw new Error(error.message);
        return { cases, maxDelta, differentChannels };
    } finally {
        for (const resource of owned) resource.destroy();
        device.destroy();
    }
}
