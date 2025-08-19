import { describe, expect, it, vi, beforeEach } from "vitest";
import { execute, detectAvailableBackends, type RenderingBackend } from "./CommandInitializeUnifiedContextService";

// Mock the individual initialization services
vi.mock("./CommandInitializeContextService", () => ({
    execute: vi.fn()
}));

vi.mock("./CommandInitializeWebGPUContextService", () => ({
    execute: vi.fn()
}));

// Mock OffscreenCanvas
const mockCanvas = {} as OffscreenCanvas;

// Mock navigator.gpu
Object.defineProperty(navigator, "gpu", {
    value: {
        requestAdapter: vi.fn()
    },
    writable: true
});

describe("CommandInitializeUnifiedContextService test", () =>
{
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should detect WebGL support correctly", async () =>
    {
        // Mock successful WebGL context creation
        const mockGetContext = vi.fn();
        mockGetContext.mockReturnValueOnce({} as WebGL2RenderingContext); // WebGL2 supported
        
        Object.defineProperty(global, "OffscreenCanvas", {
            value: vi.fn(() => ({
                getContext: mockGetContext
            })),
            writable: true
        });

        // Mock no WebGPU support
        (navigator.gpu.requestAdapter as any).mockResolvedValue(null);

        const backends = await detectAvailableBackends();
        expect(backends.webgl).toBe(true);
        expect(backends.webgpu).toBe(false);
    });

    it("should detect WebGPU support correctly", async () =>
    {
        // Mock failed WebGL context creation
        const mockGetContext = vi.fn();
        mockGetContext.mockReturnValueOnce(null); // WebGL2 not supported
        
        Object.defineProperty(global, "OffscreenCanvas", {
            value: vi.fn(() => ({
                getContext: mockGetContext
            })),
            writable: true
        });

        // Mock successful WebGPU adapter
        (navigator.gpu.requestAdapter as any).mockResolvedValue({} as GPUAdapter);

        const backends = await detectAvailableBackends();
        expect(backends.webgl).toBe(false);
        expect(backends.webgpu).toBe(true);
    });

    it("should handle no WebGPU navigator support", async () =>
    {
        // Mock failed WebGL context creation
        const mockGetContext = vi.fn();
        mockGetContext.mockReturnValueOnce(null);
        
        Object.defineProperty(global, "OffscreenCanvas", {
            value: vi.fn(() => ({
                getContext: mockGetContext
            })),
            writable: true
        });

        // Mock no navigator.gpu
        Object.defineProperty(navigator, "gpu", {
            value: undefined,
            writable: true
        });

        const backends = await detectAvailableBackends();
        expect(backends.webgl).toBe(false);
        expect(backends.webgpu).toBe(false);
    });
});