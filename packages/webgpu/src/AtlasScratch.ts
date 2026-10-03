import type { IAttachmentObject } from "./interface/IAttachmentObject";
import { $samples } from "./WebGPUUtil";

interface IAtlasScratch {
    color: GPUTexture;
    stencil: GPUTexture;
    owner: GPUTexture | null;
    pipeline: GPURenderPipeline;
}
let pools = new WeakMap<GPUDevice, Map<string, IAtlasScratch>>();

/** Resolved cache pages stay resident; multisample working storage is shared. */
export function atlasScratch(device: GPUDevice, width: number, height: number): IAtlasScratch {
    let pool = pools.get(device);
    if (!pool) { pool = new Map(); pools.set(device, pool) }
    const key = `${width}:${height}`;
    const cached = pool.get(key);
    if (cached) { return cached }
    const shader = device.createShaderModule({ "code": `
        @group(0) @binding(0) var image: texture_2d<f32>;
        @vertex fn vertex(@builtin(vertex_index) i: u32) -> @builtin(position) vec4f {
            let points = array<vec2f, 3>(vec2f(-1,-1),vec2f(3,-1),vec2f(-1,3));
            return vec4f(points[i],0,1);
        }
        @fragment fn fragment(@builtin(position) p: vec4f) -> @location(0) vec4f {
            return textureLoad(image,vec2i(p.xy),0);
        }` });
    const value: IAtlasScratch = {
        "color": device.createTexture({ "size": { width, height }, "format": "rgba8unorm",
            "sampleCount": $samples, "usage": GPUTextureUsage.RENDER_ATTACHMENT }),
        "stencil": device.createTexture({ "size": { width, height }, "format": "stencil8",
            "sampleCount": $samples, "usage": GPUTextureUsage.RENDER_ATTACHMENT }),
        "owner": null,
        "pipeline": device.createRenderPipeline({ "layout": "auto",
            "vertex": { "module": shader, "entryPoint": "vertex" },
            "fragment": { "module": shader, "entryPoint": "fragment", "targets": [{ "format": "rgba8unorm" }] },
            "multisample": { "count": $samples } })
    };
    pool.set(key, value);
    return value;
}

export function needsAtlasRestore(device: GPUDevice, attachment: IAttachmentObject): boolean {
    const scratch = pools.get(device)?.get(`${attachment.width}:${attachment.height}`);
    return !!scratch && attachment.msaaTexture?.resource === scratch.color
        && scratch.owner !== attachment.texture?.resource;
}

export function restoreAtlas(device: GPUDevice, encoder: GPUCommandEncoder, attachment: IAttachmentObject): void {
    const scratch = atlasScratch(device, attachment.width, attachment.height);
    if (!attachment.texture || !attachment.msaaTexture) { return }
    const pass = encoder.beginRenderPass({ "colorAttachments": [{
        "view": attachment.msaaTexture.view, "loadOp": "clear", "storeOp": "store",
        "clearValue": { "r": 0, "g": 0, "b": 0, "a": 0 }
    }] });
    pass.setPipeline(scratch.pipeline);
    pass.setBindGroup(0, device.createBindGroup({ "layout": scratch.pipeline.getBindGroupLayout(0),
        "entries": [{ "binding": 0, "resource": attachment.texture.view }] }));
    pass.draw(3); pass.end();
    scratch.owner = attachment.texture.resource;
}

/** AtlasManager destroys the shared resources along with the page attachments. */
export function resetAtlasScratch(): void { pools = new WeakMap() }
