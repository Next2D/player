import { execute } from "./ShapeCommandService";
import { describe, expect, it, vi } from "vitest";

vi.mock("../../RendererUtil", () => ({
    "$context": {
        "beginPath": vi.fn(),
        "moveTo": vi.fn(),
        "lineTo": vi.fn(),
        "quadraticCurveTo": vi.fn(),
        "bezierCurveTo": vi.fn(),
        "arc": vi.fn(),
        "closePath": vi.fn(),
        "fillStyle": vi.fn(),
        "strokeStyle": vi.fn(),
        "fill": vi.fn(),
        "stroke": vi.fn(),
        "gradientFill": vi.fn(),
        "gradientStroke": vi.fn(),
        "bitmapFill": vi.fn(),
        "bitmapStroke": vi.fn(),
        "thickness": 0,
        "caps": 0,
        "joints": 0,
        "miterLimit": 0
    },
    "$getArray": vi.fn(() => [])
}));

describe("ShapeCommandService.js test", () => {

    it("execute test case1 - BEGIN_PATH command", async () =>
    {
        const { $context } = await import("../../RendererUtil");
        vi.mocked($context.beginPath).mockClear();

        const commands = new Float32Array([9]); // BEGIN_PATH = 9
        execute(commands);

        expect($context.beginPath).toHaveBeenCalledTimes(1);
    });

    it("execute test case2 - MOVE_TO command", async () =>
    {
        const { $context } = await import("../../RendererUtil");
        vi.mocked($context.moveTo).mockClear();

        const commands = new Float32Array([0, 10, 20]); // MOVE_TO = 0
        execute(commands);

        expect($context.moveTo).toHaveBeenCalledWith(10, 20);
    });

    it("execute test case3 - LINE_TO command", async () =>
    {
        const { $context } = await import("../../RendererUtil");
        vi.mocked($context.lineTo).mockClear();

        const commands = new Float32Array([2, 30, 40]); // LINE_TO = 2
        execute(commands);

        expect($context.lineTo).toHaveBeenCalledWith(30, 40);
    });

    it("execute test case4 - CURVE_TO command", async () =>
    {
        const { $context } = await import("../../RendererUtil");
        vi.mocked($context.quadraticCurveTo).mockClear();

        const commands = new Float32Array([1, 10, 20, 30, 40]); // CURVE_TO = 1
        execute(commands);

        expect($context.quadraticCurveTo).toHaveBeenCalledWith(10, 20, 30, 40);
    });

    it("execute test case5 - CUBIC command", async () =>
    {
        const { $context } = await import("../../RendererUtil");
        vi.mocked($context.bezierCurveTo).mockClear();

        const commands = new Float32Array([3, 1, 2, 3, 4, 5, 6]); // CUBIC = 3
        execute(commands);

        expect($context.bezierCurveTo).toHaveBeenCalledWith(1, 2, 3, 4, 5, 6);
    });

    it("execute test case6 - ARC command", async () =>
    {
        const { $context } = await import("../../RendererUtil");
        vi.mocked($context.arc).mockClear();

        const commands = new Float32Array([4, 50, 60, 25]); // ARC = 4
        execute(commands);

        expect($context.arc).toHaveBeenCalledWith(50, 60, 25);
    });

    it("execute test case7 - FILL_STYLE and END_FILL commands", async () =>
    {
        const { $context } = await import("../../RendererUtil");
        vi.mocked($context.fillStyle).mockClear();
        vi.mocked($context.fill).mockClear();

        // FILL_STYLE(5) r g b a, END_FILL(7)
        const commands = new Float32Array([5, 255, 128, 0, 255, 7]);
        execute(commands);

        expect($context.fillStyle).toHaveBeenCalledWith(1, 128 / 255, 0, 1);
        expect($context.fill).toHaveBeenCalledTimes(1);
    });

    it("execute test case8 - FILL_STYLE skipped in clip mode", async () =>
    {
        const { $context } = await import("../../RendererUtil");
        vi.mocked($context.fillStyle).mockClear();

        const commands = new Float32Array([5, 255, 128, 0, 255]);
        execute(commands, true);

        expect($context.fillStyle).not.toHaveBeenCalled();
    });

    it("execute test case9 - STROKE_STYLE command", async () =>
    {
        const { $context } = await import("../../RendererUtil");
        vi.mocked($context.strokeStyle).mockClear();

        // STROKE_STYLE(6) thickness caps joints miterLimit r g b a
        const commands = new Float32Array([6, 2, 1, 0, 10, 255, 0, 0, 255]);
        execute(commands);

        expect($context.thickness).toBe(2);
        expect($context.caps).toBe(1);
        expect($context.joints).toBe(0);
        expect($context.miterLimit).toBe(10);
        expect($context.strokeStyle).toHaveBeenCalledWith(1, 0, 0, 1);
    });

    it("execute test case10 - STROKE_STYLE skipped in clip mode", async () =>
    {
        const { $context } = await import("../../RendererUtil");
        vi.mocked($context.strokeStyle).mockClear();

        const commands = new Float32Array([6, 2, 1, 0, 10, 255, 0, 0, 255]);
        execute(commands, true);

        expect($context.strokeStyle).not.toHaveBeenCalled();
    });

    it("execute test case11 - END_STROKE command", async () =>
    {
        const { $context } = await import("../../RendererUtil");
        vi.mocked($context.stroke).mockClear();

        const commands = new Float32Array([8]); // END_STROKE = 8
        execute(commands);

        expect($context.stroke).toHaveBeenCalledTimes(1);
    });

    it("execute test case12 - END_STROKE skipped in clip mode", async () =>
    {
        const { $context } = await import("../../RendererUtil");
        vi.mocked($context.stroke).mockClear();

        const commands = new Float32Array([8]); // END_STROKE = 8
        execute(commands, true);

        expect($context.stroke).not.toHaveBeenCalled();
    });

    it("execute test case13 - CLOSE_PATH command", async () =>
    {
        const { $context } = await import("../../RendererUtil");
        vi.mocked($context.closePath).mockClear();

        const commands = new Float32Array([12]); // CLOSE_PATH = 12
        execute(commands);

        expect($context.closePath).toHaveBeenCalledTimes(1);
    });

    it("execute test case14 - empty commands", async () =>
    {
        const { $context } = await import("../../RendererUtil");
        vi.mocked($context.beginPath).mockClear();

        const commands = new Float32Array([]);
        execute(commands);

        expect($context.beginPath).not.toHaveBeenCalled();
    });
});
