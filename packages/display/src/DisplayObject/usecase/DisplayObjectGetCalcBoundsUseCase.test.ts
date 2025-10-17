import { execute } from "./DisplayObjectGetCalcBoundsUseCase";
import { DisplayObject } from "../../DisplayObject";
import { describe, expect, it, vi } from "vitest";

vi.mock("../../Shape/usecase/ShapeCalcBoundsMatrixUseCase", () => ({
    execute: vi.fn(() => new Float32Array([0, 0, 100, 100]))
}));

vi.mock("../../Video/usecase/VideoCalcBoundsMatrixUseCase", () => ({
    execute: vi.fn(() => new Float32Array([0, 0, 200, 150]))
}));

vi.mock("../../TextField/usecase/TextFieldCalcBoundsMatrixUseCase", () => ({
    execute: vi.fn(() => new Float32Array([0, 0, 300, 50]))
}));

vi.mock("../../DisplayObjectContainer/usecase/DisplayObjectContainerCalcBoundsMatrixUseCase", () => ({
    execute: vi.fn(() => new Float32Array([0, 0, 400, 300]))
}));

describe("DisplayObjectGetCalcBoundsUseCase.js test", () =>
{
    it("execute test case1 - default DisplayObject", () =>
    {
        const displayObject = new DisplayObject();
        const result = execute(displayObject);
        
        expect(result).toBeInstanceOf(Float32Array);
        expect(result[0]).toBe(0);
        expect(result[1]).toBe(0);
        expect(result[2]).toBe(0);
        expect(result[3]).toBe(0);
    });

    it("execute test case2 - container DisplayObject", async () =>
    {
        const displayObject = new DisplayObject();
        displayObject.isContainerEnabled = true;

        const result = execute(displayObject);
        
        expect(result).toBeInstanceOf(Float32Array);
        expect(result[0]).toBe(0);
        expect(result[1]).toBe(0);
        expect(result[2]).toBe(400);
        expect(result[3]).toBe(300);
    });

    it("execute test case3 - shape DisplayObject", async () =>
    {
        const displayObject = new DisplayObject();
        displayObject.isShape = true;

        const result = execute(displayObject);
        
        expect(result).toBeInstanceOf(Float32Array);
        expect(result[0]).toBe(0);
        expect(result[1]).toBe(0);
        expect(result[2]).toBe(100);
        expect(result[3]).toBe(100);
    });

    it("execute test case4 - text DisplayObject", async () =>
    {
        const displayObject = new DisplayObject();
        displayObject.isText = true;

        const result = execute(displayObject);
        
        expect(result).toBeInstanceOf(Float32Array);
        expect(result[0]).toBe(0);
        expect(result[1]).toBe(0);
        expect(result[2]).toBe(300);
        expect(result[3]).toBe(50);
    });

    it("execute test case5 - video DisplayObject", async () =>
    {
        const displayObject = new DisplayObject();
        displayObject.isVideo = true;

        const result = execute(displayObject);
        
        expect(result).toBeInstanceOf(Float32Array);
        expect(result[0]).toBe(0);
        expect(result[1]).toBe(0);
        expect(result[2]).toBe(200);
        expect(result[3]).toBe(150);
    });
});
