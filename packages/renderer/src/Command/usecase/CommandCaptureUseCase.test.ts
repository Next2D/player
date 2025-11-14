import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("../../RendererUtil", () => ({
    $context: {
        clearTransferBounds: vi.fn(),
        reset: vi.fn(),
        setTransform: vi.fn(),
        updateBackgroundColor: vi.fn(),
        fillBackgroundColor: vi.fn(),
        drawArraysInstanced: vi.fn(),
        createImageBitmap: vi.fn()
    }
}));

vi.mock("../../DisplayObjectContainer/usecase/DisplayObjectContainerRenderUseCase", () => ({
    execute: vi.fn((queue, index) => index)
}));

vi.mock("../../Shape/usecase/ShapeRenderUseCase", () => ({
    execute: vi.fn((queue, index) => index)
}));

vi.mock("../../TextField/usecase/TextFieldRenderUseCase", () => ({
    execute: vi.fn((queue, index) => index)
}));

vi.mock("../../Video/usecase/VideoRenderUseCase", () => ({
    execute: vi.fn((queue, index) => index)
}));

import { execute } from "./CommandCaptureUseCase";
import { $context } from "../../RendererUtil";

describe("CommandCaptureUseCase.js test", () =>
{
    beforeEach(() =>
    {
        vi.clearAllMocks();
        ($context.createImageBitmap as any).mockResolvedValue({} as any);
    });

    it("execute test case1 - renders empty queue with default background", async () =>
    {
        const renderQueue = new Float32Array([0]);
        const width = 640;
        const height = 480;

        await execute(renderQueue, width, height);

        expect($context.clearTransferBounds).toHaveBeenCalled();
        expect($context.reset).toHaveBeenCalled();
        expect($context.setTransform).toHaveBeenCalledWith(1, 0, 0, 1, 0, 0);
        expect($context.updateBackgroundColor).toHaveBeenCalledWith(0, 0, 0, 0);
        expect($context.fillBackgroundColor).toHaveBeenCalled();
        expect($context.drawArraysInstanced).toHaveBeenCalled();
        expect($context.createImageBitmap).toHaveBeenCalledWith(width, height);
    });

    it("execute test case2 - handles custom background color", async () =>
    {
        const renderQueue = new Float32Array([0]);
        const width = 640;
        const height = 480;
        const bgColor = 0xFF0000;
        const bgAlpha = 1.0;

        await execute(renderQueue, width, height, bgColor, bgAlpha);

        expect($context.updateBackgroundColor).toHaveBeenCalledWith(1, 0, 0, bgAlpha);
    });

    it("execute test case3 - handles custom background color with alpha", async () =>
    {
        const renderQueue = new Float32Array([0]);
        const width = 640;
        const height = 480;
        const bgColor = 0x00FF00;
        const bgAlpha = 0.5;

        await execute(renderQueue, width, height, bgColor, bgAlpha);

        expect($context.updateBackgroundColor).toHaveBeenCalledWith(0, 1, 0, bgAlpha);
    });

    it("execute test case4 - handles blue background color", async () =>
    {
        const renderQueue = new Float32Array([0]);
        const width = 640;
        const height = 480;
        const bgColor = 0x0000FF;
        const bgAlpha = 1.0;

        await execute(renderQueue, width, height, bgColor, bgAlpha);

        expect($context.updateBackgroundColor).toHaveBeenCalledWith(0, 0, 1, bgAlpha);
    });

    it("execute test case5 - handles white background color", async () =>
    {
        const renderQueue = new Float32Array([0]);
        const width = 640;
        const height = 480;
        const bgColor = 0xFFFFFF;
        const bgAlpha = 1.0;

        await execute(renderQueue, width, height, bgColor, bgAlpha);

        expect($context.updateBackgroundColor).toHaveBeenCalledWith(1, 1, 1, bgAlpha);
    });

    it("execute test case6 - processes queue with hidden object", async () =>
    {
        const renderQueue = new Float32Array([0, 0, 0x01]);
        const width = 640;
        const height = 480;

        await execute(renderQueue, width, height);

        expect($context.clearTransferBounds).toHaveBeenCalled();
        expect($context.drawArraysInstanced).toHaveBeenCalled();
    });

    it("execute test case7 - handles different canvas sizes", async () =>
    {
        const renderQueue = new Float32Array([0]);
        const width = 1920;
        const height = 1080;

        await execute(renderQueue, width, height);

        expect($context.createImageBitmap).toHaveBeenCalledWith(width, height);
    });

    it("execute test case8 - handles small canvas sizes", async () =>
    {
        const renderQueue = new Float32Array([0]);
        const width = 100;
        const height = 100;

        await execute(renderQueue, width, height);

        expect($context.createImageBitmap).toHaveBeenCalledWith(width, height);
    });

    it("execute test case9 - handles zero alpha background", async () =>
    {
        const renderQueue = new Float32Array([0]);
        const width = 640;
        const height = 480;
        const bgColor = 0xFF0000;
        const bgAlpha = 0;

        await execute(renderQueue, width, height, bgColor, bgAlpha);

        expect($context.updateBackgroundColor).toHaveBeenCalledWith(1, 0, 0, 0);
    });

    it("execute test case10 - validates return type is Promise", async () =>
    {
        const renderQueue = new Float32Array([0]);
        const width = 640;
        const height = 480;

        const result = execute(renderQueue, width, height);

        expect(result).toBeInstanceOf(Promise);
        await result;
    });

    it("execute test case11 - handles null image bitmaps", async () =>
    {
        const renderQueue = new Float32Array([0]);
        const width = 640;
        const height = 480;
        const imageBitmaps = null;

        await execute(renderQueue, width, height, 0x000000, 0, imageBitmaps);

        expect($context.createImageBitmap).toHaveBeenCalledWith(width, height);
    });

    it("execute test case12 - handles empty image bitmaps array", async () =>
    {
        const renderQueue = new Float32Array([0]);
        const width = 640;
        const height = 480;
        const imageBitmaps: ImageBitmap[] = [];

        await execute(renderQueue, width, height, 0x000000, 0, imageBitmaps);

        expect($context.createImageBitmap).toHaveBeenCalledWith(width, height);
    });

    it("execute test case13 - handles partial transparency", async () =>
    {
        const renderQueue = new Float32Array([0]);
        const width = 640;
        const height = 480;
        const bgColor = 0x808080;
        const bgAlpha = 0.75;

        await execute(renderQueue, width, height, bgColor, bgAlpha);

        const expectedR = (0x80) / 255;
        const expectedG = (0x80) / 255;
        const expectedB = (0x80) / 255;
        
        expect($context.updateBackgroundColor).toHaveBeenCalledWith(
            expect.closeTo(expectedR, 2),
            expect.closeTo(expectedG, 2),
            expect.closeTo(expectedB, 2),
            bgAlpha
        );
    });

    it("execute test case14 - validates context method call order", async () =>
    {
        const renderQueue = new Float32Array([0]);
        const width = 640;
        const height = 480;

        await execute(renderQueue, width, height);

        const clearCall = $context.clearTransferBounds.mock.invocationCallOrder[0];
        const resetCall = $context.reset.mock.invocationCallOrder[0];
        const transformCall = $context.setTransform.mock.invocationCallOrder[0];
        const fillCall = $context.fillBackgroundColor.mock.invocationCallOrder[0];
        const drawCall = $context.drawArraysInstanced.mock.invocationCallOrder[0];

        expect(clearCall).toBeLessThan(resetCall);
        expect(resetCall).toBeLessThan(transformCall);
        expect(transformCall).toBeLessThan(fillCall);
        expect(fillCall).toBeLessThan(drawCall);
    });

    it("execute test case15 - handles large render queue", async () =>
    {
        const renderQueue = new Float32Array(1000);
        renderQueue[0] = 0;
        const width = 640;
        const height = 480;

        await execute(renderQueue, width, height);

        expect($context.clearTransferBounds).toHaveBeenCalled();
        expect($context.drawArraysInstanced).toHaveBeenCalled();
    });
});

