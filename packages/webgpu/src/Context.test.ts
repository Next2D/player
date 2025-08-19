import { describe, expect, it, vi, beforeEach } from "vitest";
import { Context } from "./Context";

// Mock WebGPU APIs
const mockDevice = {
    limits: {
        maxTextureDimension2D: 4096,
        maxBindGroups: 4
    },
    createTexture: vi.fn(),
    createBuffer: vi.fn(),
    createRenderPipeline: vi.fn(),
    createComputePipeline: vi.fn(),
    createBindGroup: vi.fn(),
    createCommandEncoder: vi.fn(),
    queue: {
        submit: vi.fn(),
        writeBuffer: vi.fn(),
        writeTexture: vi.fn()
    }
} as unknown as GPUDevice;

const mockCanvasContext = {
    configure: vi.fn(),
    getCurrentTexture: vi.fn(),
    getPreferredFormat: vi.fn(() => "bgra8unorm")
} as unknown as GPUCanvasContext;

// Mock navigator.gpu
Object.defineProperty(navigator, 'gpu', {
    value: {
        getPreferredCanvasFormat: vi.fn(() => "bgra8unorm")
    },
    writable: true
});

describe("WebGPU Context test", () =>
{
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should initialize WebGPU context correctly", () =>
    {
        const context = new Context(mockDevice, mockCanvasContext, 4, 1.0);
        
        expect(context.$device).toBe(mockDevice);
        expect(context.$canvasContext).toBe(mockCanvasContext);
        expect(context.$clearColorR).toBe(1);
        expect(context.$clearColorG).toBe(1);
        expect(context.$clearColorB).toBe(1);
        expect(context.$clearColorA).toBe(1);
        expect(context.$mainAttachmentObject).toBe(null);
        expect(context.currentAttachmentObject).toBe(null);
        expect(context.$stack).toEqual([]);
        expect(context.$attachmentStack).toEqual([]);
        expect(mockCanvasContext.configure).toHaveBeenCalledWith({
            "device": mockDevice,
            "format": "bgra8unorm",
            "alphaMode": "premultiplied"
        });
    });

    it("should handle matrix operations correctly", () =>
    {
        const context = new Context(mockDevice, mockCanvasContext, 4, 1.0);
        
        // Test setTransform
        context.setTransform(1, 2, 3, 4, 5, 6);
        expect(context.$matrix[0]).toBe(1);
        expect(context.$matrix[1]).toBe(2);
        expect(context.$matrix[2]).toBe(3);
        expect(context.$matrix[3]).toBe(4);
        expect(context.$matrix[4]).toBe(5);
        expect(context.$matrix[5]).toBe(6);

        // Test save/restore
        context.save();
        context.setTransform(10, 20, 30, 40, 50, 60);
        context.restore();
        expect(context.$matrix[0]).toBe(1);
        expect(context.$matrix[1]).toBe(2);
        expect(context.$matrix[2]).toBe(3);
        expect(context.$matrix[3]).toBe(4);
        expect(context.$matrix[4]).toBe(5);
        expect(context.$matrix[5]).toBe(6);
    });

    it("should update background color correctly", () =>
    {
        const context = new Context(mockDevice, mockCanvasContext, 4, 1.0);
        
        context.updateBackgroundColor(0.5, 0.6, 0.7, 0.8);
        expect(context.$clearColorR).toBe(0.5);
        expect(context.$clearColorG).toBe(0.6);
        expect(context.$clearColorB).toBe(0.7);
        expect(context.$clearColorA).toBe(0.8);
    });

    it("should handle transform multiplication correctly", () =>
    {
        const context = new Context(mockDevice, mockCanvasContext, 4, 1.0);
        
        // Set initial transform
        context.setTransform(1, 0, 0, 1, 0, 0); // Identity matrix
        
        // Apply transformation
        context.transform(2, 0, 0, 2, 10, 20); // Scale by 2 and translate by (10, 20)
        
        expect(context.$matrix[0]).toBe(2); // a: scale x
        expect(context.$matrix[1]).toBe(0); // b
        expect(context.$matrix[2]).toBe(0); // c
        expect(context.$matrix[3]).toBe(2); // d: scale y
        expect(context.$matrix[4]).toBe(10); // e: translate x
        expect(context.$matrix[5]).toBe(20); // f: translate y
    });
});