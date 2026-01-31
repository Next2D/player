import { describe, it, expect, vi, beforeEach } from "vitest";
import { RenderBundleManager } from "./RenderBundleManager";

// Mock service and usecase modules
vi.mock("./service/RenderBundleCreateService", () => ({
    "execute": vi.fn((device, config, recordCallback) => {
        // Simulate recording callback
        const mockEncoder = {
            "setPipeline": vi.fn(),
            "setBindGroup": vi.fn(),
            "draw": vi.fn()
        };
        recordCallback(mockEncoder);
        return { "label": config.id };
    })
}));

vi.mock("./usecase/RenderBundleExecuteUseCase", () => ({
    "execute": vi.fn((passEncoder, bundles) => {
        passEncoder.executeBundles(bundles);
    })
}));

describe("RenderBundleManager", () =>
{
    const createMockDevice = (): GPUDevice =>
    {
        return {
            "createRenderBundleEncoder": vi.fn(() => ({
                "setPipeline": vi.fn(),
                "setBindGroup": vi.fn(),
                "draw": vi.fn(),
                "finish": vi.fn(() => ({}))
            }))
        } as unknown as GPUDevice;
    };

    const createMockPassEncoder = (): GPURenderPassEncoder =>
    {
        return {
            "executeBundles": vi.fn()
        } as unknown as GPURenderPassEncoder;
    };

    beforeEach(() =>
    {
        vi.clearAllMocks();
    });

    describe("constructor", () =>
    {
        it("should create instance with device and format", () =>
        {
            const device = createMockDevice();
            const manager = new RenderBundleManager(device, "bgra8unorm");

            expect(manager).toBeDefined();
        });

        it("should initialize with empty stats", () =>
        {
            const device = createMockDevice();
            const manager = new RenderBundleManager(device, "bgra8unorm");

            const stats = manager.getStats();
            expect(stats.totalBundles).toBe(0);
            expect(stats.validBundles).toBe(0);
        });
    });

    describe("beginFrame", () =>
    {
        it("should increment frame number", () =>
        {
            const device = createMockDevice();
            const manager = new RenderBundleManager(device, "bgra8unorm");

            manager.beginFrame();
            manager.beginFrame();
            manager.beginFrame();

            // Should not throw
            expect(() => manager.beginFrame()).not.toThrow();
        });

        it("should trigger cleanup at frame intervals", () =>
        {
            const device = createMockDevice();
            const manager = new RenderBundleManager(device, "bgra8unorm");

            // Run for 60 frames to trigger cleanup
            for (let i = 0; i < 60; i++) {
                manager.beginFrame();
            }

            expect(() => manager.beginFrame()).not.toThrow();
        });
    });

    describe("getOrCreateBundle", () =>
    {
        it("should create new bundle", () =>
        {
            const device = createMockDevice();
            const manager = new RenderBundleManager(device, "bgra8unorm");
            const callback = vi.fn();

            const bundle = manager.getOrCreateBundle("test", 12345, callback);

            expect(bundle).toBeDefined();
        });

        it("should cache bundle", () =>
        {
            const device = createMockDevice();
            const manager = new RenderBundleManager(device, "bgra8unorm");
            const callback = vi.fn();

            manager.getOrCreateBundle("test", 12345, callback);

            const stats = manager.getStats();
            expect(stats.totalBundles).toBe(1);
        });

        it("should return cached bundle for same id and hash", () =>
        {
            const device = createMockDevice();
            const manager = new RenderBundleManager(device, "bgra8unorm");
            const callback = vi.fn();

            const bundle1 = manager.getOrCreateBundle("test", 12345, callback);
            const bundle2 = manager.getOrCreateBundle("test", 12345, callback);

            expect(bundle1).toBe(bundle2);
        });

        it("should create new bundle when hash changes", () =>
        {
            const device = createMockDevice();
            const manager = new RenderBundleManager(device, "bgra8unorm");
            const callback = vi.fn();

            const bundle1 = manager.getOrCreateBundle("test", 12345, callback);
            const bundle2 = manager.getOrCreateBundle("test", 67890, callback);

            expect(bundle1).not.toBe(bundle2);
        });

        it("should accept custom color formats", () =>
        {
            const device = createMockDevice();
            const manager = new RenderBundleManager(device, "bgra8unorm");
            const callback = vi.fn();

            const bundle = manager.getOrCreateBundle("test", 12345, callback, {
                "colorFormats": ["rgba8unorm"]
            });

            expect(bundle).toBeDefined();
        });

        it("should accept depth stencil format", () =>
        {
            const device = createMockDevice();
            const manager = new RenderBundleManager(device, "bgra8unorm");
            const callback = vi.fn();

            const bundle = manager.getOrCreateBundle("test", 12345, callback, {
                "depthStencilFormat": "depth24plus-stencil8"
            });

            expect(bundle).toBeDefined();
        });

        it("should accept sample count", () =>
        {
            const device = createMockDevice();
            const manager = new RenderBundleManager(device, "bgra8unorm");
            const callback = vi.fn();

            const bundle = manager.getOrCreateBundle("test", 12345, callback, {
                "sampleCount": 4
            });

            expect(bundle).toBeDefined();
        });
    });

    describe("executeBundles", () =>
    {
        it("should execute multiple bundles", () =>
        {
            const device = createMockDevice();
            const manager = new RenderBundleManager(device, "bgra8unorm");
            const passEncoder = createMockPassEncoder();
            const callback = vi.fn();

            manager.getOrCreateBundle("bundle1", 111, callback);
            manager.getOrCreateBundle("bundle2", 222, callback);

            manager.executeBundles(passEncoder, ["bundle1", "bundle2"]);

            expect(passEncoder.executeBundles).toHaveBeenCalled();
        });

        it("should skip non-existent bundles", () =>
        {
            const device = createMockDevice();
            const manager = new RenderBundleManager(device, "bgra8unorm");
            const passEncoder = createMockPassEncoder();
            const callback = vi.fn();

            manager.getOrCreateBundle("bundle1", 111, callback);

            // Include a non-existent bundle
            manager.executeBundles(passEncoder, ["bundle1", "nonexistent"]);

            expect(passEncoder.executeBundles).toHaveBeenCalled();
        });

        it("should skip invalid bundles", () =>
        {
            const device = createMockDevice();
            const manager = new RenderBundleManager(device, "bgra8unorm");
            const passEncoder = createMockPassEncoder();
            const callback = vi.fn();

            manager.getOrCreateBundle("bundle1", 111, callback);
            manager.invalidateBundle("bundle1");

            manager.executeBundles(passEncoder, ["bundle1"]);

            // Should not call executeBundles with any bundles
            expect(passEncoder.executeBundles).not.toHaveBeenCalled();
        });
    });

    describe("executeBundle", () =>
    {
        it("should execute single bundle", () =>
        {
            const device = createMockDevice();
            const manager = new RenderBundleManager(device, "bgra8unorm");
            const passEncoder = createMockPassEncoder();
            const callback = vi.fn();

            const bundle = manager.getOrCreateBundle("test", 12345, callback);
            manager.executeBundle(passEncoder, bundle);

            expect(passEncoder.executeBundles).toHaveBeenCalled();
        });
    });

    describe("invalidateBundle", () =>
    {
        it("should mark bundle as invalid", () =>
        {
            const device = createMockDevice();
            const manager = new RenderBundleManager(device, "bgra8unorm");
            const callback = vi.fn();

            manager.getOrCreateBundle("test", 12345, callback);
            manager.invalidateBundle("test");

            const stats = manager.getStats();
            expect(stats.validBundles).toBe(0);
        });

        it("should not throw for non-existent bundle", () =>
        {
            const device = createMockDevice();
            const manager = new RenderBundleManager(device, "bgra8unorm");

            expect(() => manager.invalidateBundle("nonexistent")).not.toThrow();
        });
    });

    describe("invalidateAll", () =>
    {
        it("should mark all bundles as invalid", () =>
        {
            const device = createMockDevice();
            const manager = new RenderBundleManager(device, "bgra8unorm");
            const callback = vi.fn();

            manager.getOrCreateBundle("bundle1", 111, callback);
            manager.getOrCreateBundle("bundle2", 222, callback);
            manager.getOrCreateBundle("bundle3", 333, callback);

            manager.invalidateAll();

            const stats = manager.getStats();
            expect(stats.totalBundles).toBe(3);
            expect(stats.validBundles).toBe(0);
        });
    });

    describe("removeBundle", () =>
    {
        it("should remove bundle from cache", () =>
        {
            const device = createMockDevice();
            const manager = new RenderBundleManager(device, "bgra8unorm");
            const callback = vi.fn();

            manager.getOrCreateBundle("test", 12345, callback);
            manager.removeBundle("test");

            const stats = manager.getStats();
            expect(stats.totalBundles).toBe(0);
        });

        it("should not throw for non-existent bundle", () =>
        {
            const device = createMockDevice();
            const manager = new RenderBundleManager(device, "bgra8unorm");

            expect(() => manager.removeBundle("nonexistent")).not.toThrow();
        });
    });

    describe("getStats", () =>
    {
        it("should return correct bundle counts", () =>
        {
            const device = createMockDevice();
            const manager = new RenderBundleManager(device, "bgra8unorm");
            const callback = vi.fn();

            manager.getOrCreateBundle("bundle1", 111, callback);
            manager.getOrCreateBundle("bundle2", 222, callback);
            manager.invalidateBundle("bundle2");

            const stats = manager.getStats();
            expect(stats.totalBundles).toBe(2);
            expect(stats.validBundles).toBe(1);
        });
    });

    describe("calculateHash", () =>
    {
        it("should calculate hash from values", () =>
        {
            const hash = RenderBundleManager.calculateHash([1, 2, 3, 4, 5]);

            expect(typeof hash).toBe("number");
        });

        it("should return different hash for different values", () =>
        {
            const hash1 = RenderBundleManager.calculateHash([1, 2, 3]);
            const hash2 = RenderBundleManager.calculateHash([4, 5, 6]);

            expect(hash1).not.toBe(hash2);
        });

        it("should return same hash for same values", () =>
        {
            const hash1 = RenderBundleManager.calculateHash([1, 2, 3]);
            const hash2 = RenderBundleManager.calculateHash([1, 2, 3]);

            expect(hash1).toBe(hash2);
        });

        it("should handle empty array", () =>
        {
            const hash = RenderBundleManager.calculateHash([]);

            expect(hash).toBe(0);
        });
    });

    describe("destroy", () =>
    {
        it("should clear all bundles", () =>
        {
            const device = createMockDevice();
            const manager = new RenderBundleManager(device, "bgra8unorm");
            const callback = vi.fn();

            manager.getOrCreateBundle("bundle1", 111, callback);
            manager.getOrCreateBundle("bundle2", 222, callback);

            manager.destroy();

            const stats = manager.getStats();
            expect(stats.totalBundles).toBe(0);
        });
    });

    describe("cache cleanup", () =>
    {
        it("should remove old bundles after max age", () =>
        {
            const device = createMockDevice();
            const manager = new RenderBundleManager(device, "bgra8unorm");
            const callback = vi.fn();

            manager.getOrCreateBundle("oldBundle", 111, callback);

            // Run enough frames to trigger cleanup (60 frames interval + max age of 60)
            for (let i = 0; i < 121; i++) {
                manager.beginFrame();
            }

            const stats = manager.getStats();
            expect(stats.totalBundles).toBe(0);
        });

        it("should keep recently used bundles", () =>
        {
            const device = createMockDevice();
            const manager = new RenderBundleManager(device, "bgra8unorm");
            const callback = vi.fn();

            manager.getOrCreateBundle("activeBundle", 111, callback);

            // Run frames but keep accessing the bundle
            for (let i = 0; i < 121; i++) {
                manager.beginFrame();
                if (i % 30 === 0) {
                    // Access the bundle to update its last used frame
                    manager.getOrCreateBundle("activeBundle", 111, callback);
                }
            }

            const stats = manager.getStats();
            expect(stats.totalBundles).toBe(1);
        });

        it("should remove invalid bundles during cleanup", () =>
        {
            const device = createMockDevice();
            const manager = new RenderBundleManager(device, "bgra8unorm");
            const callback = vi.fn();

            manager.getOrCreateBundle("invalidBundle", 111, callback);
            manager.invalidateBundle("invalidBundle");

            // Run 60 frames to trigger cleanup
            for (let i = 0; i < 60; i++) {
                manager.beginFrame();
            }

            const stats = manager.getStats();
            expect(stats.totalBundles).toBe(0);
        });
    });
});
