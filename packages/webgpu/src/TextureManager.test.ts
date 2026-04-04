import { describe, it, expect, vi, beforeEach } from "vitest";
import { TextureManager } from "./TextureManager";

// Mock GPUTextureUsage
const GPUTextureUsage = {
    TEXTURE_BINDING: 0x04,
    COPY_DST: 0x02,
    RENDER_ATTACHMENT: 0x10
};
(globalThis as any).GPUTextureUsage = GPUTextureUsage;

// Mock service module
vi.mock("./TextureManager/service/TextureManagerInitializeSamplersService", () => ({
    "execute": vi.fn((device, samplers) => {
        samplers.set("default", { "label": "defaultSampler" });
        samplers.set("linear", { "label": "linearSampler" });
        samplers.set("nearest", { "label": "nearestSampler" });
    })
}));

describe("TextureManager", () =>
{
    const createMockDevice = (): GPUDevice =>
    {
        return {
            "createTexture": vi.fn((descriptor) => ({
                "width": descriptor.size.width,
                "height": descriptor.size.height,
                "destroy": vi.fn(),
                "createView": vi.fn(() => ({ "label": "textureView" }))
            })),
            "createSampler": vi.fn((descriptor) => ({
                "label": `sampler-${descriptor.magFilter}`
            }))
        } as unknown as GPUDevice;
    };

    beforeEach(() =>
    {
        vi.clearAllMocks();
    });

    describe("constructor", () =>
    {
        it("should create instance with device", () =>
        {
            const device = createMockDevice();
            const manager = new TextureManager(device);

            expect(manager).toBeDefined();
        });

        it("should initialize samplers on creation", () =>
        {
            const device = createMockDevice();
            const manager = new TextureManager(device);

            // Verify pre-initialized sampler is returned by createSampler
            const sampler = manager.createSampler("default");
            expect(sampler).toEqual({ "label": "defaultSampler" });
        });
    });

    describe("createTexture", () =>
    {
        it("should create texture with specified dimensions", () =>
        {
            const device = createMockDevice();
            const manager = new TextureManager(device);

            const texture = manager.createTexture("test", 256, 256);

            expect(texture).toBeDefined();
            expect(device.createTexture).toHaveBeenCalled();
        });

        it("should use rgba8unorm as default format", () =>
        {
            const device = createMockDevice();
            const manager = new TextureManager(device);

            manager.createTexture("test", 128, 128);

            expect(device.createTexture).toHaveBeenCalledWith(
                expect.objectContaining({
                    "format": "rgba8unorm"
                })
            );
        });

        it("should accept custom format", () =>
        {
            const device = createMockDevice();
            const manager = new TextureManager(device);

            manager.createTexture("test", 128, 128, "rgba16float");

            expect(device.createTexture).toHaveBeenCalledWith(
                expect.objectContaining({
                    "format": "rgba16float"
                })
            );
        });

        it("should store texture by name", () =>
        {
            const device = createMockDevice();
            const manager = new TextureManager(device);

            manager.createTexture("myTexture", 512, 512);
            const retrieved = manager.getTexture("myTexture");

            expect(retrieved).toBeDefined();
        });
    });

    describe("getTexture", () =>
    {
        it("should return undefined for non-existent texture", () =>
        {
            const device = createMockDevice();
            const manager = new TextureManager(device);

            expect(manager.getTexture("nonexistent")).toBeUndefined();
        });
    });

    describe("createSampler", () =>
    {
        it("should create new sampler", () =>
        {
            const device = createMockDevice();
            const manager = new TextureManager(device);

            const sampler = manager.createSampler("mySampler", true);

            expect(sampler).toBeDefined();
            expect(device.createSampler).toHaveBeenCalled();
        });

        it("should return existing sampler if name already exists", () =>
        {
            const device = createMockDevice();
            const manager = new TextureManager(device);

            const sampler1 = manager.createSampler("sampler", true);
            const sampler2 = manager.createSampler("sampler", false);

            expect(sampler1).toBe(sampler2);
        });

        it("should use linear filtering for smooth=true", () =>
        {
            const device = createMockDevice();
            const manager = new TextureManager(device);

            manager.createSampler("smoothSampler", true);

            expect(device.createSampler).toHaveBeenCalledWith(
                expect.objectContaining({
                    "magFilter": "linear",
                    "minFilter": "linear"
                })
            );
        });

        it("should use nearest filtering for smooth=false", () =>
        {
            const device = createMockDevice();
            const manager = new TextureManager(device);

            manager.createSampler("pixelSampler", false);

            expect(device.createSampler).toHaveBeenCalledWith(
                expect.objectContaining({
                    "magFilter": "nearest",
                    "minFilter": "nearest"
                })
            );
        });

        it("should store created sampler", () =>
        {
            const device = createMockDevice();
            const manager = new TextureManager(device);

            const created = manager.createSampler("newSampler", true);
            const retrieved = manager.createSampler("newSampler");

            expect(retrieved).toBe(created);
        });
    });

    describe("dispose", () =>
    {
        it("should destroy all textures", () =>
        {
            const device = createMockDevice();
            const manager = new TextureManager(device);

            const tex1 = manager.createTexture("tex1", 64, 64);
            const tex2 = manager.createTexture("tex2", 128, 128);

            manager.dispose();

            expect(tex1.destroy).toHaveBeenCalled();
            expect(tex2.destroy).toHaveBeenCalled();
        });

        it("should clear texture map", () =>
        {
            const device = createMockDevice();
            const manager = new TextureManager(device);

            manager.createTexture("test", 64, 64);
            manager.dispose();

            expect(manager.getTexture("test")).toBeUndefined();
        });

        it("should clear sampler map", () =>
        {
            const device = createMockDevice();
            const manager = new TextureManager(device);

            manager.createSampler("custom", true);
            manager.dispose();

            // After dispose, createSampler should create a new sampler instead of returning the old one
            const sampler = manager.createSampler("custom", true);
            expect(device.createSampler).toHaveBeenCalled();
            expect(sampler).toBeDefined();
        });
    });
});
