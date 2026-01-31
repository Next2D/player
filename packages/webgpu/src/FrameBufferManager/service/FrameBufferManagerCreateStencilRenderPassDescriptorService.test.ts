import { describe, it, expect } from "vitest";
import { execute } from "./FrameBufferManagerCreateStencilRenderPassDescriptorService";

describe("FrameBufferManagerCreateStencilRenderPassDescriptorService", () =>
{
    const createMockView = (label: string = "mockView"): GPUTextureView =>
    {
        return { label } as unknown as GPUTextureView;
    };

    describe("color attachment", () =>
    {
        it("should create descriptor with provided color view", () =>
        {
            const colorView = createMockView("colorView");
            const stencilView = createMockView("stencilView");

            const result = execute(colorView, stencilView);

            expect(result.colorAttachments[0].view).toBe(colorView);
        });

        it("should have one color attachment", () =>
        {
            const colorView = createMockView();
            const stencilView = createMockView();

            const result = execute(colorView, stencilView);

            expect(result.colorAttachments).toHaveLength(1);
        });

        it("should set clearValue to transparent black", () =>
        {
            const colorView = createMockView();
            const stencilView = createMockView();

            const result = execute(colorView, stencilView);

            expect(result.colorAttachments[0].clearValue).toEqual({
                "r": 0,
                "g": 0,
                "b": 0,
                "a": 0
            });
        });

        it("should set storeOp to store", () =>
        {
            const colorView = createMockView();
            const stencilView = createMockView();

            const result = execute(colorView, stencilView);

            expect(result.colorAttachments[0].storeOp).toBe("store");
        });

        it("should set colorLoadOp to provided value", () =>
        {
            const colorView = createMockView();
            const stencilView = createMockView();

            const result = execute(colorView, stencilView, "clear");

            expect(result.colorAttachments[0].loadOp).toBe("clear");
        });

        it("should default colorLoadOp to load", () =>
        {
            const colorView = createMockView();
            const stencilView = createMockView();

            const result = execute(colorView, stencilView);

            expect(result.colorAttachments[0].loadOp).toBe("load");
        });
    });

    describe("depth stencil attachment", () =>
    {
        it("should include depthStencilAttachment", () =>
        {
            const colorView = createMockView();
            const stencilView = createMockView();

            const result = execute(colorView, stencilView);

            expect(result.depthStencilAttachment).toBeDefined();
        });

        it("should set stencil view correctly", () =>
        {
            const colorView = createMockView();
            const stencilView = createMockView("stencilView");

            const result = execute(colorView, stencilView);

            expect(result.depthStencilAttachment?.view).toBe(stencilView);
        });

        it("should set stencilClearValue to 0", () =>
        {
            const colorView = createMockView();
            const stencilView = createMockView();

            const result = execute(colorView, stencilView);

            expect(result.depthStencilAttachment?.stencilClearValue).toBe(0);
        });

        it("should set stencilLoadOp to provided value", () =>
        {
            const colorView = createMockView();
            const stencilView = createMockView();

            const result = execute(colorView, stencilView, "load", "load");

            expect(result.depthStencilAttachment?.stencilLoadOp).toBe("load");
        });

        it("should default stencilLoadOp to clear", () =>
        {
            const colorView = createMockView();
            const stencilView = createMockView();

            const result = execute(colorView, stencilView);

            expect(result.depthStencilAttachment?.stencilLoadOp).toBe("clear");
        });

        it("should set stencilStoreOp to store", () =>
        {
            const colorView = createMockView();
            const stencilView = createMockView();

            const result = execute(colorView, stencilView);

            expect(result.depthStencilAttachment?.stencilStoreOp).toBe("store");
        });
    });

    describe("MSAA resolve target", () =>
    {
        it("should set resolveTarget when provided", () =>
        {
            const colorView = createMockView("msaaView");
            const stencilView = createMockView();
            const resolveTarget = createMockView("resolveView");

            const result = execute(colorView, stencilView, "load", "clear", resolveTarget);

            expect(result.colorAttachments[0].resolveTarget).toBe(resolveTarget);
        });

        it("should not have resolveTarget when null", () =>
        {
            const colorView = createMockView();
            const stencilView = createMockView();

            const result = execute(colorView, stencilView, "load", "clear", null);

            expect(result.colorAttachments[0].resolveTarget).toBeUndefined();
        });

        it("should not have resolveTarget by default", () =>
        {
            const colorView = createMockView();
            const stencilView = createMockView();

            const result = execute(colorView, stencilView);

            expect(result.colorAttachments[0].resolveTarget).toBeUndefined();
        });
    });
});
