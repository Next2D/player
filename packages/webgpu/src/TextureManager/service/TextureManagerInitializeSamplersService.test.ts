import { describe, it, expect, vi, beforeEach } from "vitest";
import { execute } from "./TextureManagerInitializeSamplersService";

describe("TextureManagerInitializeSamplersService", () =>
{
    const createMockDevice = () =>
    {
        let samplerCount = 0;
        return {
            "createSampler": vi.fn((descriptor) => ({
                "label": `sampler_${samplerCount++}`,
                "descriptor": descriptor
            }))
        } as unknown as GPUDevice;
    };

    describe("linear sampler", () =>
    {
        it("should create linear sampler", () =>
        {
            const device = createMockDevice();
            const samplers = new Map<string, GPUSampler>();

            execute(device, samplers);

            expect(samplers.has("linear")).toBe(true);
        });

        it("should set magFilter to linear", () =>
        {
            const device = createMockDevice();
            const samplers = new Map<string, GPUSampler>();

            execute(device, samplers);

            expect(device.createSampler).toHaveBeenCalledWith(
                expect.objectContaining({
                    "magFilter": "linear"
                })
            );
        });

        it("should set minFilter to linear", () =>
        {
            const device = createMockDevice();
            const samplers = new Map<string, GPUSampler>();

            execute(device, samplers);

            expect(device.createSampler).toHaveBeenCalledWith(
                expect.objectContaining({
                    "minFilter": "linear"
                })
            );
        });

        it("should set mipmapFilter to linear for linear sampler", () =>
        {
            const device = createMockDevice();
            const samplers = new Map<string, GPUSampler>();

            execute(device, samplers);

            expect(device.createSampler).toHaveBeenCalledWith(
                expect.objectContaining({
                    "magFilter": "linear",
                    "mipmapFilter": "linear"
                })
            );
        });
    });

    describe("nearest sampler", () =>
    {
        it("should create nearest sampler", () =>
        {
            const device = createMockDevice();
            const samplers = new Map<string, GPUSampler>();

            execute(device, samplers);

            expect(samplers.has("nearest")).toBe(true);
        });

        it("should set magFilter to nearest", () =>
        {
            const device = createMockDevice();
            const samplers = new Map<string, GPUSampler>();

            execute(device, samplers);

            expect(device.createSampler).toHaveBeenCalledWith(
                expect.objectContaining({
                    "magFilter": "nearest",
                    "minFilter": "nearest"
                })
            );
        });

        it("should set mipmapFilter to nearest for nearest sampler", () =>
        {
            const device = createMockDevice();
            const samplers = new Map<string, GPUSampler>();

            execute(device, samplers);

            expect(device.createSampler).toHaveBeenCalledWith(
                expect.objectContaining({
                    "magFilter": "nearest",
                    "mipmapFilter": "nearest"
                })
            );
        });
    });

    describe("repeat sampler", () =>
    {
        it("should create repeat sampler", () =>
        {
            const device = createMockDevice();
            const samplers = new Map<string, GPUSampler>();

            execute(device, samplers);

            expect(samplers.has("repeat")).toBe(true);
        });

        it("should set addressModeU to repeat", () =>
        {
            const device = createMockDevice();
            const samplers = new Map<string, GPUSampler>();

            execute(device, samplers);

            expect(device.createSampler).toHaveBeenCalledWith(
                expect.objectContaining({
                    "addressModeU": "repeat",
                    "addressModeV": "repeat"
                })
            );
        });
    });

    describe("address mode", () =>
    {
        it("should set addressModeU to clamp-to-edge for linear", () =>
        {
            const device = createMockDevice();
            const samplers = new Map<string, GPUSampler>();

            execute(device, samplers);

            expect(device.createSampler).toHaveBeenCalledWith(
                expect.objectContaining({
                    "magFilter": "linear",
                    "addressModeU": "clamp-to-edge",
                    "addressModeV": "clamp-to-edge"
                })
            );
        });

        it("should set addressModeU to clamp-to-edge for nearest", () =>
        {
            const device = createMockDevice();
            const samplers = new Map<string, GPUSampler>();

            execute(device, samplers);

            expect(device.createSampler).toHaveBeenCalledWith(
                expect.objectContaining({
                    "magFilter": "nearest",
                    "addressModeU": "clamp-to-edge",
                    "addressModeV": "clamp-to-edge"
                })
            );
        });
    });

    describe("total samplers", () =>
    {
        it("should create exactly 4 samplers", () =>
        {
            const device = createMockDevice();
            const samplers = new Map<string, GPUSampler>();

            execute(device, samplers);

            expect(samplers.size).toBe(4);
            expect(device.createSampler).toHaveBeenCalledTimes(4);
        });
    });
});
