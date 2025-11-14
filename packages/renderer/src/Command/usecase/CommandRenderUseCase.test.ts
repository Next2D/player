import { describe, expect, it, vi, beforeEach } from "vitest";

let mockIsResize = false;

vi.mock("../../RendererUtil", () => ({
    $context: {
        clearTransferBounds: vi.fn(),
        reset: vi.fn(),
        setTransform: vi.fn(),
        updateBackgroundColor: vi.fn(),
        fillBackgroundColor: vi.fn(),
        drawArraysInstanced: vi.fn(),
        transferMainCanvas: vi.fn()
    },
    $isResize: () => mockIsResize,
    $resizeComplete: vi.fn()
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

import { execute } from "./CommandRenderUseCase";
import { $context, $resizeComplete } from "../../RendererUtil";

describe("CommandRenderUseCase.js test", () =>
{
    beforeEach(() =>
    {
        vi.clearAllMocks();
        mockIsResize = false;
    });

    it("execute test case1 - renders with default background color (-1)", () =>
    {
        const renderQueue = new Float32Array([-1]);
        const imageBitmaps = null;

        execute(renderQueue, imageBitmaps);

        expect($context.clearTransferBounds).toHaveBeenCalled();
        expect($context.reset).toHaveBeenCalled();
        expect($context.setTransform).toHaveBeenCalledWith(1, 0, 0, 1, 0, 0);
        expect($context.fillBackgroundColor).toHaveBeenCalled();
        expect($context.drawArraysInstanced).toHaveBeenCalled();
        expect($context.transferMainCanvas).toHaveBeenCalled();
    });

    it("execute test case2 - renders with red background color", () =>
    {
        const renderQueue = new Float32Array([0xFF0000]);
        const imageBitmaps = null;

        execute(renderQueue, imageBitmaps);

        expect($context.updateBackgroundColor).toHaveBeenCalledWith(1, 0, 0, 1);
    });

    it("execute test case3 - renders with green background color", () =>
    {
        const renderQueue = new Float32Array([0x00FF00]);
        const imageBitmaps = null;

        execute(renderQueue, imageBitmaps);

        expect($context.updateBackgroundColor).toHaveBeenCalledWith(0, 1, 0, 1);
    });

    it("execute test case4 - renders with blue background color", () =>
    {
        const renderQueue = new Float32Array([0x0000FF]);
        const imageBitmaps = null;

        execute(renderQueue, imageBitmaps);

        expect($context.updateBackgroundColor).toHaveBeenCalledWith(0, 0, 1, 1);
    });

    it("execute test case5 - renders with white background color", () =>
    {
        const renderQueue = new Float32Array([0xFFFFFF]);
        const imageBitmaps = null;

        execute(renderQueue, imageBitmaps);

        expect($context.updateBackgroundColor).toHaveBeenCalledWith(1, 1, 1, 1);
    });

    it("execute test case6 - handles resize flag true", () =>
    {
        mockIsResize = true;

        const renderQueue = new Float32Array([-1]);
        const imageBitmaps = null;

        execute(renderQueue, imageBitmaps);

        expect($resizeComplete).toHaveBeenCalled();
    });

    it("execute test case7 - handles resize flag false", () =>
    {
        mockIsResize = false;

        const renderQueue = new Float32Array([-1]);
        const imageBitmaps = null;

        execute(renderQueue, imageBitmaps);

        expect($resizeComplete).not.toHaveBeenCalled();
    });

    it("execute test case8 - skips hidden objects", () =>
    {
        const renderQueue = new Float32Array([-1, 0, 0x01]);
        const imageBitmaps = null;

        execute(renderQueue, imageBitmaps);

        expect($context.drawArraysInstanced).toHaveBeenCalled();
    });

    it("execute test case9 - handles null image bitmaps", () =>
    {
        const renderQueue = new Float32Array([-1]);
        const imageBitmaps = null;

        execute(renderQueue, imageBitmaps);

        expect($context.transferMainCanvas).toHaveBeenCalled();
    });

    it("execute test case10 - handles empty image bitmaps array", () =>
    {
        const renderQueue = new Float32Array([-1]);
        const imageBitmaps: ImageBitmap[] = [];

        execute(renderQueue, imageBitmaps);

        expect($context.transferMainCanvas).toHaveBeenCalled();
    });

    it("execute test case11 - validates context method call order", () =>
    {
        const renderQueue = new Float32Array([-1]);
        const imageBitmaps = null;

        execute(renderQueue, imageBitmaps);

        const clearCall = $context.clearTransferBounds.mock.invocationCallOrder[0];
        const resetCall = $context.reset.mock.invocationCallOrder[0];
        const transformCall = $context.setTransform.mock.invocationCallOrder[0];
        const fillCall = $context.fillBackgroundColor.mock.invocationCallOrder[0];
        const drawCall = $context.drawArraysInstanced.mock.invocationCallOrder[0];
        const transferCall = $context.transferMainCanvas.mock.invocationCallOrder[0];

        expect(clearCall).toBeLessThan(resetCall);
        expect(resetCall).toBeLessThan(transformCall);
        expect(transformCall).toBeLessThan(fillCall);
        expect(fillCall).toBeLessThan(drawCall);
        expect(drawCall).toBeLessThan(transferCall);
    });

    it("execute test case12 - handles gray background color", () =>
    {
        const renderQueue = new Float32Array([0x808080]);
        const imageBitmaps = null;

        execute(renderQueue, imageBitmaps);

        const expectedR = (0x80) / 255;
        const expectedG = (0x80) / 255;
        const expectedB = (0x80) / 255;

        expect($context.updateBackgroundColor).toHaveBeenCalledWith(
            expect.closeTo(expectedR, 2),
            expect.closeTo(expectedG, 2),
            expect.closeTo(expectedB, 2),
            1
        );
    });

    it("execute test case13 - handles black background color (0x000000)", () =>
    {
        const renderQueue = new Float32Array([0x000000]);
        const imageBitmaps = null;

        execute(renderQueue, imageBitmaps);

        expect($context.updateBackgroundColor).toHaveBeenCalledWith(0, 0, 0, 1);
    });

    it("execute test case14 - handles empty render queue", () =>
    {
        const renderQueue = new Float32Array([-1]);
        const imageBitmaps = null;

        execute(renderQueue, imageBitmaps);

        expect($context.clearTransferBounds).toHaveBeenCalled();
        expect($context.transferMainCanvas).toHaveBeenCalled();
    });

    it("execute test case15 - handles large render queue", () =>
    {
        const renderQueue = new Float32Array(1000);
        renderQueue[0] = -1;
        const imageBitmaps = null;

        execute(renderQueue, imageBitmaps);

        expect($context.clearTransferBounds).toHaveBeenCalled();
        expect($context.drawArraysInstanced).toHaveBeenCalled();
        expect($context.transferMainCanvas).toHaveBeenCalled();
    });

    it("execute test case16 - validates return type is void", () =>
    {
        const renderQueue = new Float32Array([-1]);
        const imageBitmaps = null;

        const result = execute(renderQueue, imageBitmaps);

        expect(result).toBeUndefined();
    });
});

