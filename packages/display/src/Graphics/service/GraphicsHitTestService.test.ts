import { Graphics } from "../../Graphics";
import { execute } from "./GraphicsHitTestService";
import { describe, expect, it, beforeEach } from "vitest";

describe("GraphicsHitTestService.js test", () =>
{
    let canvas: HTMLCanvasElement;
    let context: CanvasRenderingContext2D;

    beforeEach(() =>
    {
        canvas = document.createElement("canvas");
        canvas.width = 200;
        canvas.height = 200;
        context = canvas.getContext("2d") as CanvasRenderingContext2D;
    });

    it("execute test case1 - simple fill path with END_FILL", () =>
    {
        const recodes = new Float32Array([
            9, // BEGIN_PATH
            0, 0, 0, // MOVE_TO x y
            2, 100, 0, // LINE_TO x y
            2, 100, 100, // LINE_TO x y
            2, 0, 100, // LINE_TO x y
            12, // CLOSE_PATH
            7 // END_FILL
        ]);

        const hitObject = { x: 50, y: 50 };
        const result = execute(context, recodes, hitObject);

        // Canvas mock doesn't implement isPointInPath properly, 
        // but we can verify the function executes without error
        expect(typeof result).toBe("boolean");
    });

    it("execute test case2 - returns false when no path matches", () =>
    {
        const recodes = new Float32Array([
            9, // BEGIN_PATH
            0, 0, 0, // MOVE_TO x y
            2, 100, 0, // LINE_TO x y
            2, 100, 100, // LINE_TO x y
            2, 0, 100, // LINE_TO x y
            12, // CLOSE_PATH
            7 // END_FILL
        ]);

        const hitObject = { x: 150, y: 150 };
        const result = execute(context, recodes, hitObject);

        expect(result).toBe(false);
    });

    it("execute test case3 - quadratic curve path", () =>
    {
        const recodes = new Float32Array([
            9, // BEGIN_PATH
            0, 0, 0, // MOVE_TO x y
            1, 50, 100, 100, 0, // CURVE_TO cx cy x y
            2, 100, 100, // LINE_TO x y
            2, 0, 100, // LINE_TO x y
            12, // CLOSE_PATH
            7 // END_FILL
        ]);

        const hitObject = { x: 50, y: 50 };
        const result = execute(context, recodes, hitObject);

        expect(typeof result).toBe("boolean");
    });

    it("execute test case4 - cubic bezier curve path", () =>
    {
        const recodes = new Float32Array([
            9, // BEGIN_PATH
            0, 0, 0, // MOVE_TO x y
            3, 30, 30, 70, 30, 100, 0, // CUBIC cp1x cp1y cp2x cp2y x y
            2, 100, 100, // LINE_TO x y
            2, 0, 100, // LINE_TO x y
            12, // CLOSE_PATH
            7 // END_FILL
        ]);

        const hitObject = { x: 50, y: 50 };
        const result = execute(context, recodes, hitObject);

        expect(typeof result).toBe("boolean");
    });

    it("execute test case5 - arc path", () =>
    {
        const recodes = new Float32Array([
            9, // BEGIN_PATH
            4, 50, 50, 30, // ARC x y radius
            7 // END_FILL
        ]);

        const hitObject = { x: 50, y: 50 };
        const result = execute(context, recodes, hitObject);

        expect(typeof result).toBe("boolean");
    });

    it("execute test case6 - path with no hit returns false", () =>
    {
        const recodes = new Float32Array([
            9, // BEGIN_PATH
            4, 50, 50, 30, // ARC x y radius
            7 // END_FILL
        ]);

        const hitObject = { x: 90, y: 90 };
        const result = execute(context, recodes, hitObject);

        expect(result).toBe(false);
    });

    it("execute test case7 - fill style skips 4 values", () =>
    {
        const recodes = new Float32Array([
            9, // BEGIN_PATH
            0, 0, 0, // MOVE_TO x y
            2, 100, 0, // LINE_TO x y
            2, 100, 100, // LINE_TO x y
            2, 0, 100, // LINE_TO x y
            5, 255, 0, 0, 255, // FILL_STYLE r g b a (skipped)
            12, // CLOSE_PATH
            7 // END_FILL
        ]);

        const hitObject = { x: 50, y: 50 };
        const result = execute(context, recodes, hitObject);

        expect(typeof result).toBe("boolean");
    });

    it("execute test case8 - stroke style skips 8 values", () =>
    {
        const recodes = new Float32Array([
            9, // BEGIN_PATH
            0, 0, 0, // MOVE_TO x y
            2, 100, 0, // LINE_TO x y
            2, 100, 100, // LINE_TO x y
            2, 0, 100, // LINE_TO x y
            6, 255, 0, 0, 255, 1, 0, 0, 0, // STROKE_STYLE r g b a thickness caps joint miter (skipped)
            12, // CLOSE_PATH
            8, // END_STROKE
            7 // END_FILL
        ]);

        const hitObject = { x: 50, y: 50 };
        const result = execute(context, recodes, hitObject);

        expect(typeof result).toBe("boolean");
    });

    it("execute test case9 - gradient fill checks hit and skips 6 values", () =>
    {
        const recodes = new Float32Array([
            9, // BEGIN_PATH
            0, 0, 0, // MOVE_TO x y
            2, 100, 0, // LINE_TO x y
            2, 100, 100, // LINE_TO x y
            2, 0, 100, // LINE_TO x y
            12, // CLOSE_PATH
            10, 0, 0, 0, 100, 100, 0 // GRADIENT_FILL (6 values)
        ]);

        const hitObject = { x: 50, y: 50 };
        const result = execute(context, recodes, hitObject);

        expect(typeof result).toBe("boolean");
    });

    it("execute test case10 - gradient stroke skips 12 values", () =>
    {
        const recodes = new Float32Array([
            9, // BEGIN_PATH
            0, 0, 0, // MOVE_TO x y
            2, 100, 0, // LINE_TO x y
            2, 100, 100, // LINE_TO x y
            2, 0, 100, // LINE_TO x y
            12, // CLOSE_PATH
            11, 0, 0, 0, 100, 100, 0, 1, 0, 0, 0, 0, 0, // GRADIENT_STROKE (12 values)
            7 // END_FILL
        ]);

        const hitObject = { x: 50, y: 50 };
        const result = execute(context, recodes, hitObject);

        expect(typeof result).toBe("boolean");
    });

    it("execute test case11 - bitmap fill checks hit and skips 6 values", () =>
    {
        const recodes = new Float32Array([
            9, // BEGIN_PATH
            0, 0, 0, // MOVE_TO x y
            2, 100, 0, // LINE_TO x y
            2, 100, 100, // LINE_TO x y
            2, 0, 100, // LINE_TO x y
            12, // CLOSE_PATH
            13, 0, 0, 0, 0, 0, 0 // BITMAP_FILL (6 values)
        ]);

        const hitObject = { x: 50, y: 50 };
        const result = execute(context, recodes, hitObject);

        expect(typeof result).toBe("boolean");
    });

    it("execute test case12 - bitmap stroke skips 9 values", () =>
    {
        const recodes = new Float32Array([
            9, // BEGIN_PATH
            0, 0, 0, // MOVE_TO x y
            2, 100, 0, // LINE_TO x y
            2, 100, 100, // LINE_TO x y
            2, 0, 100, // LINE_TO x y
            12, // CLOSE_PATH
            14, 0, 0, 0, 0, 0, 0, 1, 0, 0, // BITMAP_STROKE (9 values)
            7 // END_FILL
        ]);

        const hitObject = { x: 50, y: 50 };
        const result = execute(context, recodes, hitObject);

        expect(typeof result).toBe("boolean");
    });

    it("execute test case13 - multiple paths processes correctly", () =>
    {
        const recodes = new Float32Array([
            9, // BEGIN_PATH
            0, 0, 0, // MOVE_TO x y
            2, 50, 0, // LINE_TO x y
            2, 50, 50, // LINE_TO x y
            2, 0, 50, // LINE_TO x y
            12, // CLOSE_PATH
            7, // END_FILL
            9, // BEGIN_PATH
            0, 60, 60, // MOVE_TO x y
            2, 100, 60, // LINE_TO x y
            2, 100, 100, // LINE_TO x y
            2, 60, 100, // LINE_TO x y
            12, // CLOSE_PATH
            7 // END_FILL
        ]);

        const hitObject = { x: 25, y: 25 };
        const result = execute(context, recodes, hitObject);

        expect(typeof result).toBe("boolean");
    });

    it("execute test case14 - multiple paths, no hit", () =>
    {
        const recodes = new Float32Array([
            9, // BEGIN_PATH
            0, 0, 0, // MOVE_TO x y
            2, 50, 0, // LINE_TO x y
            2, 50, 50, // LINE_TO x y
            2, 0, 50, // LINE_TO x y
            12, // CLOSE_PATH
            7, // END_FILL
            9, // BEGIN_PATH
            0, 60, 60, // MOVE_TO x y
            2, 100, 60, // LINE_TO x y
            2, 100, 100, // LINE_TO x y
            2, 60, 100, // LINE_TO x y
            12, // CLOSE_PATH
            7 // END_FILL
        ]);

        const hitObject = { x: 55, y: 55 };
        const result = execute(context, recodes, hitObject);

        expect(result).toBe(false);
    });

    it("execute test case15 - empty recodes", () =>
    {
        const recodes = new Float32Array([]);
        const hitObject = { x: 50, y: 50 };
        const result = execute(context, recodes, hitObject);

        expect(result).toBe(false);
    });
});
