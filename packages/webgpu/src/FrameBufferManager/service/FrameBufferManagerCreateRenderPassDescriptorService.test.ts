import { describe, it, expect } from "vitest";
import { execute } from "./FrameBufferManagerCreateRenderPassDescriptorService";

describe("FrameBufferManagerCreateRenderPassDescriptorService", () =>
{
    const createMockView = (label: string = "mockView"): GPUTextureView =>
    {
        return { label } as unknown as GPUTextureView;
    };

    describe("basic descriptor creation", () =>
    {
        it("should create descriptor with provided view", () =>
        {
            const view = createMockView("testView");

            const result = execute(view);

            expect(result.colorAttachments[0].view).toBe(view);
        });

        it("should have one color attachment", () =>
        {
            const view = createMockView();

            const result = execute(view);

            expect(result.colorAttachments).toHaveLength(1);
        });

        it("should set storeOp to store", () =>
        {
            const view = createMockView();

            const result = execute(view);

            expect(result.colorAttachments[0].storeOp).toBe("store");
        });
    });

    describe("clear value", () =>
    {
        it("should set clearValue with provided RGBA values", () =>
        {
            const view = createMockView();

            const result = execute(view, 0.5, 0.6, 0.7, 0.8);

            expect(result.colorAttachments[0].clearValue).toEqual({
                "r": 0.5,
                "g": 0.6,
                "b": 0.7,
                "a": 0.8
            });
        });

        it("should default to transparent black (0, 0, 0, 0)", () =>
        {
            const view = createMockView();

            const result = execute(view);

            expect(result.colorAttachments[0].clearValue).toEqual({
                "r": 0,
                "g": 0,
                "b": 0,
                "a": 0
            });
        });
    });

    describe("loadOp", () =>
    {
        it("should set loadOp to provided value", () =>
        {
            const view = createMockView();

            const result = execute(view, 0, 0, 0, 0, "load");

            expect(result.colorAttachments[0].loadOp).toBe("load");
        });

        it("should default loadOp to clear", () =>
        {
            const view = createMockView();

            const result = execute(view);

            expect(result.colorAttachments[0].loadOp).toBe("clear");
        });
    });

    describe("MSAA resolve target", () =>
    {
        it("should set resolveTarget when provided", () =>
        {
            const view = createMockView("msaaView");
            const resolveTarget = createMockView("resolveView");

            const result = execute(view, 0, 0, 0, 0, "clear", resolveTarget);

            expect(result.colorAttachments[0].resolveTarget).toBe(resolveTarget);
        });

        it("should not have resolveTarget when null", () =>
        {
            const view = createMockView();

            const result = execute(view, 0, 0, 0, 0, "clear", null);

            expect(result.colorAttachments[0].resolveTarget).toBeUndefined();
        });

        it("should not have resolveTarget by default", () =>
        {
            const view = createMockView();

            const result = execute(view);

            expect(result.colorAttachments[0].resolveTarget).toBeUndefined();
        });
    });
});
