import { describe, expect, it, vi, beforeEach } from "vitest";
import { TextureManager } from "./TextureManager";

// Mock WebGPU constants
Object.defineProperty(global, "GPUTextureUsage", {
    value: {
        TEXTURE_BINDING: 1,
        COPY_DST: 2,
        RENDER_ATTACHMENT: 4
    },
    writable: true
});

// Mock WebGPUUtil
vi.mock("../WebGPUUtil", () => ({
    $device: {
        createTexture: vi.fn(() => ({
            destroy: vi.fn()
        })),
        createSampler: vi.fn(() => ({})),
        queue: {
            copyExternalImageToTexture: vi.fn(),
            writeTexture: vi.fn()
        }
    },
    $upperPowerOfTwo: vi.fn((x: number) => {
        // Simple power of two calculation for testing
        let power = 1;
        while (power < x) power *= 2;
        return power;
    })
}));

describe("WebGPU TextureManager test", () =>
{
    let mockDevice: any;
    let mockTexture: any;

    beforeEach(async () => {
        vi.clearAllMocks();
        // Reset static state
        TextureManager.destroyAll();
        
        const webgpuUtil = await import("../WebGPUUtil");
        mockDevice = webgpuUtil.$device;
        mockTexture = mockDevice.createTexture();
    });

    it("should create new texture correctly", () =>
    {
        const textureObject = TextureManager.getTexture(100, 100);
        
        expect(mockDevice.createTexture).toHaveBeenCalledWith({
            "size": {
                "width": 128, // Rounded up to power of two
                "height": 128,
                "depthOrArrayLayers": 1
            },
            "format": "rgba8unorm",
            "usage": 7 // GPUTextureUsage.TEXTURE_BINDING | COPY_DST | RENDER_ATTACHMENT (1 | 2 | 4)
        });
        
        expect(textureObject.width).toBe(128);
        expect(textureObject.height).toBe(128);
        expect(textureObject.smooth).toBe(true);
        expect(TextureManager.activeTextureCount).toBe(1);
    });

    it("should reuse texture from pool", () =>
    {
        // Create and release a texture
        const textureObject1 = TextureManager.getTexture(64, 64);
        TextureManager.releaseTexture(textureObject1);
        
        expect(TextureManager.pooledTextureCount).toBe(1);
        expect(TextureManager.activeTextureCount).toBe(0);
        
        // Get same size texture should reuse from pool
        vi.clearAllMocks();
        const textureObject2 = TextureManager.getTexture(64, 64);
        
        expect(mockDevice.createTexture).not.toHaveBeenCalled(); // Should not create new
        expect(textureObject2).toBe(textureObject1); // Should be same object
        expect(TextureManager.pooledTextureCount).toBe(0);
        expect(TextureManager.activeTextureCount).toBe(1);
    });

    it("should create texture from ImageBitmap", () =>
    {
        const mockImageBitmap = {
            width: 32,
            height: 32
        } as ImageBitmap;
        
        const textureObject = TextureManager.createTextureFromImageBitmap(mockImageBitmap);
        
        expect(mockDevice.createTexture).toHaveBeenCalled();
        expect(mockDevice.queue.copyExternalImageToTexture).toHaveBeenCalledWith(
            { "source": mockImageBitmap },
            { "texture": expect.anything() },
            {
                "width": 32,
                "height": 32,
                "depthOrArrayLayers": 1
            }
        );
        expect(textureObject.width).toBe(32);
        expect(textureObject.height).toBe(32);
    });

    it("should create texture from ArrayBuffer", () =>
    {
        const data = new ArrayBuffer(64 * 64 * 4); // 64x64 RGBA
        const textureObject = TextureManager.createTextureFromArrayBuffer(data, 64, 64);
        
        expect(mockDevice.createTexture).toHaveBeenCalled();
        expect(mockDevice.queue.writeTexture).toHaveBeenCalledWith(
            { "texture": expect.anything() },
            data,
            {
                "bytesPerRow": 64 * 4,
                "rowsPerImage": 64
            },
            {
                "width": 64,
                "height": 64,
                "depthOrArrayLayers": 1
            }
        );
    });

    it("should create sampler correctly", () =>
    {
        const smoothSampler = TextureManager.createSampler(true);
        const nearestSampler = TextureManager.createSampler(false, "repeat");
        
        expect(mockDevice.createSampler).toHaveBeenCalledWith({
            "magFilter": "linear",
            "minFilter": "linear",
            "addressModeU": "clamp-to-edge",
            "addressModeV": "clamp-to-edge"
        });
        
        expect(mockDevice.createSampler).toHaveBeenCalledWith({
            "magFilter": "nearest",
            "minFilter": "nearest",
            "addressModeU": "repeat",
            "addressModeV": "repeat"
        });
    });

    it("should destroy textures when pool is full", () =>
    {
        // Create a counter for texture destruction tracking
        let destroyCallCount = 0;
        
        // Mock device to return different texture objects
        const textureDestroyMocks: any[] = [];
        mockDevice.createTexture.mockImplementation(() => {
            const texture = {
                destroy: vi.fn(() => {
                    destroyCallCount++;
                })
            };
            textureDestroyMocks.push(texture);
            return texture;
        });
        
        // Fill pool to capacity
        const textures = [];
        for (let i = 0; i < 51; i++) {
            const texture = TextureManager.getTexture(32, 32);
            textures.push(texture);
        }
        
        // Release all textures
        for (const texture of textures) {
            TextureManager.releaseTexture(texture);
        }
        
        expect(TextureManager.pooledTextureCount).toBe(50); // Pool limit
        expect(destroyCallCount).toBeGreaterThan(0); // At least one texture destroyed
    });

    it("should destroy all textures correctly", () =>
    {
        // Track destruction calls
        let destroyCallCount = 0;
        mockDevice.createTexture.mockImplementation(() => ({
            destroy: vi.fn(() => {
                destroyCallCount++;
            })
        }));
        
        // Create some active and pooled textures
        const texture1 = TextureManager.getTexture(32, 32);
        const texture2 = TextureManager.getTexture(64, 64);
        TextureManager.releaseTexture(texture2);
        
        expect(TextureManager.activeTextureCount).toBe(1);
        expect(TextureManager.pooledTextureCount).toBe(1);
        
        TextureManager.destroyAll();
        
        expect(destroyCallCount).toBe(2); // Both textures destroyed
        expect(TextureManager.activeTextureCount).toBe(0);
        expect(TextureManager.pooledTextureCount).toBe(0);
    });
});