import { describe, it, expect, vi, beforeEach } from "vitest";
import type { IRenderBundleConfig } from "../../interface/IRenderBundleConfig";
import { execute } from "./RenderBundleCreateService";

describe("RenderBundleCreateService", () =>
{
    const createMockDevice = () =>
    {
        const mockBundle = { "label": "mockBundle" };
        const mockEncoder = {
            "finish": vi.fn(() => mockBundle)
        };

        return {
            "createRenderBundleEncoder": vi.fn(() => mockEncoder),
            "_mockEncoder": mockEncoder,
            "_mockBundle": mockBundle
        } as unknown as GPUDevice & { _mockEncoder: any; _mockBundle: any };
    };

    const createConfig = (overrides: Partial<IRenderBundleConfig> = {}): IRenderBundleConfig =>
    {
        return {
            "id": "test_bundle",
            "colorFormats": ["rgba8unorm"] as GPUTextureFormat[],
            "depthStencilFormat": "stencil8",
            "sampleCount": 1,
            ...overrides
        };
    };

    describe("encoder creation", () =>
    {
        it("should create render bundle encoder with correct label", () =>
        {
            const device = createMockDevice();
            const config = createConfig({ "id": "my_bundle" });
            const callback = vi.fn();

            execute(device, config, callback);

            expect(device.createRenderBundleEncoder).toHaveBeenCalledWith(
                expect.objectContaining({
                    "label": "render_bundle_my_bundle"
                })
            );
        });

        it("should create encoder with correct color formats", () =>
        {
            const device = createMockDevice();
            const config = createConfig({
                "colorFormats": ["bgra8unorm", "rgba16float"] as GPUTextureFormat[]
            });
            const callback = vi.fn();

            execute(device, config, callback);

            expect(device.createRenderBundleEncoder).toHaveBeenCalledWith(
                expect.objectContaining({
                    "colorFormats": ["bgra8unorm", "rgba16float"]
                })
            );
        });

        it("should create encoder with depth stencil format", () =>
        {
            const device = createMockDevice();
            const config = createConfig({ "depthStencilFormat": "depth24plus-stencil8" });
            const callback = vi.fn();

            execute(device, config, callback);

            expect(device.createRenderBundleEncoder).toHaveBeenCalledWith(
                expect.objectContaining({
                    "depthStencilFormat": "depth24plus-stencil8"
                })
            );
        });

        it("should create encoder with sample count", () =>
        {
            const device = createMockDevice();
            const config = createConfig({ "sampleCount": 4 });
            const callback = vi.fn();

            execute(device, config, callback);

            expect(device.createRenderBundleEncoder).toHaveBeenCalledWith(
                expect.objectContaining({
                    "sampleCount": 4
                })
            );
        });

        it("should default sample count to 1 when not specified", () =>
        {
            const device = createMockDevice();
            const config: IRenderBundleConfig = {
                "id": "test",
                "colorFormats": ["rgba8unorm"] as GPUTextureFormat[],
                "depthStencilFormat": "stencil8"
                // sampleCount not specified
            };
            const callback = vi.fn();

            execute(device, config, callback);

            expect(device.createRenderBundleEncoder).toHaveBeenCalledWith(
                expect.objectContaining({
                    "sampleCount": 1
                })
            );
        });
    });

    describe("callback execution", () =>
    {
        it("should call record callback with encoder", () =>
        {
            const device = createMockDevice();
            const config = createConfig();
            const callback = vi.fn();

            execute(device, config, callback);

            expect(callback).toHaveBeenCalledWith((device as any)._mockEncoder);
        });

        it("should call callback before finish", () =>
        {
            const device = createMockDevice();
            const config = createConfig();
            const callOrder: string[] = [];

            const callback = vi.fn(() => {
                callOrder.push("callback");
            });
            ((device as any)._mockEncoder.finish as ReturnType<typeof vi.fn>).mockImplementation(() => {
                callOrder.push("finish");
                return (device as any)._mockBundle;
            });

            execute(device, config, callback);

            expect(callOrder).toEqual(["callback", "finish"]);
        });
    });

    describe("bundle finish", () =>
    {
        it("should finish encoder with correct label", () =>
        {
            const device = createMockDevice();
            const config = createConfig({ "id": "finished_bundle" });
            const callback = vi.fn();

            execute(device, config, callback);

            expect((device as any)._mockEncoder.finish).toHaveBeenCalledWith({
                "label": "render_bundle_finished_bundle"
            });
        });

        it("should return the finished bundle", () =>
        {
            const device = createMockDevice();
            const config = createConfig();
            const callback = vi.fn();

            const result = execute(device, config, callback);

            expect(result).toBe((device as any)._mockBundle);
        });
    });
});
