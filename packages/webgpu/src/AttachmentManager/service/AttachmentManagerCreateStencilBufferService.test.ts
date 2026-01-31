import { describe, it, expect, vi, beforeEach } from "vitest";
import { execute } from "./AttachmentManagerCreateStencilBufferService";

// Mock GPUTextureUsage
const GPUTextureUsage = {
    RENDER_ATTACHMENT: 0x10
};
(globalThis as any).GPUTextureUsage = GPUTextureUsage;

describe("AttachmentManagerCreateStencilBufferService", () =>
{
    let idCounter: { stencilId: number };

    const createMockDevice = () =>
    {
        const mockView = { "label": "mockView" };
        const mockTexture = {
            "createView": vi.fn(() => mockView)
        };
        return {
            "createTexture": vi.fn(() => mockTexture),
            "_mockTexture": mockTexture,
            "_mockView": mockView
        } as unknown as GPUDevice & { _mockTexture: any; _mockView: any };
    };

    beforeEach(() =>
    {
        idCounter = { "stencilId": 0 };
    });

    it("should create texture with correct dimensions", () =>
    {
        const device = createMockDevice();

        execute(device, 256, 512, idCounter);

        expect(device.createTexture).toHaveBeenCalledWith(
            expect.objectContaining({
                "size": { "width": 256, "height": 512 }
            })
        );
    });

    it("should create texture with depth24plus-stencil8 format", () =>
    {
        const device = createMockDevice();

        execute(device, 256, 256, idCounter);

        expect(device.createTexture).toHaveBeenCalledWith(
            expect.objectContaining({
                "format": "depth24plus-stencil8"
            })
        );
    });

    it("should create texture with RENDER_ATTACHMENT usage", () =>
    {
        const device = createMockDevice();

        execute(device, 256, 256, idCounter);

        expect(device.createTexture).toHaveBeenCalledWith(
            expect.objectContaining({
                "usage": GPUTextureUsage.RENDER_ATTACHMENT
            })
        );
    });

    it("should return object with incremented id", () =>
    {
        const device = createMockDevice();
        idCounter.stencilId = 5;

        const result = execute(device, 256, 256, idCounter);

        expect(result.id).toBe(5);
        expect(idCounter.stencilId).toBe(6);
    });

    it("should increment id counter for each call", () =>
    {
        const device = createMockDevice();

        const result1 = execute(device, 256, 256, idCounter);
        const result2 = execute(device, 256, 256, idCounter);
        const result3 = execute(device, 256, 256, idCounter);

        expect(result1.id).toBe(0);
        expect(result2.id).toBe(1);
        expect(result3.id).toBe(2);
    });

    it("should return object with resource property", () =>
    {
        const device = createMockDevice();

        const result = execute(device, 256, 256, idCounter);

        expect(result.resource).toBeDefined();
    });

    it("should return object with view from createView", () =>
    {
        const device = createMockDevice();

        const result = execute(device, 256, 256, idCounter);

        expect(result.view).toBe((device as any)._mockView);
    });

    it("should return object with correct dimensions", () =>
    {
        const device = createMockDevice();

        const result = execute(device, 800, 600, idCounter);

        expect(result.width).toBe(800);
        expect(result.height).toBe(600);
    });

    it("should return object with calculated area", () =>
    {
        const device = createMockDevice();

        const result = execute(device, 100, 50, idCounter);

        expect(result.area).toBe(5000);
    });

    it("should return object with dirty set to false", () =>
    {
        const device = createMockDevice();

        const result = execute(device, 256, 256, idCounter);

        expect(result.dirty).toBe(false);
    });
});
