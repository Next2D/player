import { beforeEach, expect, it, vi } from "vitest";
import { atlasScratch, needsAtlasRestore, resetAtlasScratch, restoreAtlas } from "./AtlasScratch";
import type { IAttachmentObject } from "./interface/IAttachmentObject";

beforeEach(() => {
    resetAtlasScratch();
    vi.stubGlobal("GPUTextureUsage", { RENDER_ATTACHMENT: 16 });
});

it("shares multisample storage while restoring independent resolved pages", () => {
    const createTexture = vi.fn(() => ({ createView: () => ({}), destroy: vi.fn() }));
    const device = { createTexture, createShaderModule: vi.fn(), createBindGroup: vi.fn(),
        createRenderPipeline: vi.fn(() => ({ getBindGroupLayout: vi.fn() })) } as unknown as GPUDevice;
    const scratch = atlasScratch(device, 4096, 4096);
    expect(atlasScratch(device, 4096, 4096)).toBe(scratch);
    expect(createTexture).toHaveBeenCalledTimes(2);
    const attachment = (): IAttachmentObject => ({ width: 4096, height: 4096,
        texture: { resource: {}, view: {} }, msaaTexture: { resource: scratch.color, view: {} }
    } as unknown as IAttachmentObject);
    const first = attachment(), second = attachment();
    const pass = { setPipeline: vi.fn(), setBindGroup: vi.fn(), draw: vi.fn(), end: vi.fn() };
    const beginRenderPass = vi.fn(() => pass);
    const encoder = { beginRenderPass } as unknown as GPUCommandEncoder;
    expect(needsAtlasRestore(device, first)).toBe(true);
    restoreAtlas(device, encoder, first);
    expect(needsAtlasRestore(device, first)).toBe(false);
    expect(needsAtlasRestore(device, second)).toBe(true);
    restoreAtlas(device, encoder, second);
    expect(needsAtlasRestore(device, first)).toBe(true);
    expect(beginRenderPass).toHaveBeenCalledTimes(2);
    expect(beginRenderPass.mock.calls[0][0].colorAttachments[0].resolveTarget).toBeUndefined();
    expect(pass.draw).toHaveBeenCalledWith(3);
    resetAtlasScratch();
    expect(atlasScratch(device, 4096, 4096)).not.toBe(scratch);
    expect(createTexture).toHaveBeenCalledTimes(4);
});
