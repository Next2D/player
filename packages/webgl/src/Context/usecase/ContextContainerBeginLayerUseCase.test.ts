import { execute, $containerLayerStack } from "./ContextContainerBeginLayerUseCase";
import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("../../WebGLUtil", () => ({
    "$context": {
        "drawArraysInstanced": vi.fn(),
        "$mainAttachmentObject": { "width": 800, "height": 600, "label": "main" },
        "bind": vi.fn()
    }
}));

vi.mock("../../FrameBufferManager/usecase/FrameBufferManagerGetAttachmentObjectUseCase", () => ({
    "execute": vi.fn(() => ({ "width": 800, "height": 600, "label": "layer" }))
}));

describe("ContextContainerBeginLayerUseCase.js test", () => {

    beforeEach(() =>
    {
        $containerLayerStack.length = 0;
    });

    it("execute test case1 - pushes current main to stack", async () =>
    {
        const { $context } = await import("../../WebGLUtil");
        const originalMain = $context.$mainAttachmentObject;

        execute(800, 600);

        expect($containerLayerStack.length).toBe(1);
        expect($containerLayerStack[0]).toBe(originalMain);
    });

    it("execute test case2 - flushes instanced draw before switching", async () =>
    {
        const { $context } = await import("../../WebGLUtil");
        vi.mocked($context.drawArraysInstanced).mockClear();

        execute(800, 600);

        expect($context.drawArraysInstanced).toHaveBeenCalledTimes(1);
    });

    it("execute test case3 - sets new layer attachment as main", async () =>
    {
        const { $context } = await import("../../WebGLUtil");

        execute(400, 300);

        expect($context.$mainAttachmentObject).toEqual({ "width": 800, "height": 600, "label": "layer" });
    });

    it("execute test case4 - binds layer attachment", async () =>
    {
        const { $context } = await import("../../WebGLUtil");
        vi.mocked($context.bind).mockClear();

        execute(800, 600);

        expect($context.bind).toHaveBeenCalledTimes(1);
    });

    it("execute test case5 - multiple layers stack correctly", async () =>
    {
        const { $context } = await import("../../WebGLUtil");

        $context.$mainAttachmentObject = { "label": "main1" } as any;
        execute(800, 600);

        $context.$mainAttachmentObject = { "label": "main2" } as any;
        execute(400, 300);

        expect($containerLayerStack.length).toBe(2);
    });
});
