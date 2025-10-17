import { execute } from "./DisplayObjectIsMaskReflectedInDisplayUseCase";
import { DisplayObject } from "../../DisplayObject";
import { describe, expect, it, vi } from "vitest";

vi.mock("../../Shape/usecase/ShapeCalcBoundsMatrixUseCase", () => ({
    execute: vi.fn(() => new Float32Array([10, 10, 110, 110]))
}));

vi.mock("../../Video/usecase/VideoCalcBoundsMatrixUseCase", () => ({
    execute: vi.fn(() => new Float32Array([20, 20, 220, 170]))
}));

vi.mock("../../TextField/usecase/TextFieldCalcBoundsMatrixUseCase", () => ({
    execute: vi.fn(() => new Float32Array([5, 5, 305, 55]))
}));

vi.mock("../../DisplayObjectContainer/usecase/DisplayObjectContainerCalcBoundsMatrixUseCase", () => ({
    execute: vi.fn(() => new Float32Array([0, 0, 400, 300]))
}));

describe("DisplayObjectIsMaskReflectedInDisplayUseCase.js test", () =>
{
    it("execute test case1 - default DisplayObject returns null", () =>
    {
        const displayObject = new DisplayObject();
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const result = execute(displayObject, matrix, 800, 600);
        
        expect(result).toBe(null);
    });

    it("execute test case2 - shape DisplayObject within renderer bounds", () =>
    {
        const displayObject = new DisplayObject();
        displayObject.isShape = true;
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        
        const result = execute(displayObject, matrix, 800, 600);
        
        expect(result).toBeInstanceOf(Float32Array);
        expect(result).not.toBe(null);
        expect(result![0]).toBe(10);
        expect(result![1]).toBe(10);
        expect(result![2]).toBe(110);
        expect(result![3]).toBe(110);
    });

    it("execute test case3 - DisplayObject with zero width returns null", async () =>
    {
        const displayObject = new DisplayObject();
        displayObject.isShape = true;
        
        // Mock to return bounds with zero width
        const { execute: shapeCalcBoundsMatrixUseCase } = await import("../../Shape/usecase/ShapeCalcBoundsMatrixUseCase");
        vi.mocked(shapeCalcBoundsMatrixUseCase).mockReturnValueOnce(new Float32Array([10, 10, 10, 110]));
        
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const result = execute(displayObject, matrix, 800, 600);
        
        expect(result).toBe(null);
    });

    it("execute test case4 - DisplayObject with zero height returns null", async () =>
    {
        const displayObject = new DisplayObject();
        displayObject.isShape = true;
        
        // Mock to return bounds with zero height
        const { execute: shapeCalcBoundsMatrixUseCase } = await import("../../Shape/usecase/ShapeCalcBoundsMatrixUseCase");
        vi.mocked(shapeCalcBoundsMatrixUseCase).mockReturnValueOnce(new Float32Array([10, 10, 110, 10]));
        
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const result = execute(displayObject, matrix, 800, 600);
        
        expect(result).toBe(null);
    });

    it("execute test case5 - DisplayObject outside renderer bounds returns null", async () =>
    {
        const displayObject = new DisplayObject();
        displayObject.isShape = true;
        
        // Mock to return bounds outside renderer area
        const { execute: shapeCalcBoundsMatrixUseCase } = await import("../../Shape/usecase/ShapeCalcBoundsMatrixUseCase");
        vi.mocked(shapeCalcBoundsMatrixUseCase).mockReturnValueOnce(new Float32Array([900, 10, 1000, 110]));
        
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const result = execute(displayObject, matrix, 800, 600);
        
        expect(result).toBe(null);
    });

    it("execute test case6 - text DisplayObject within bounds", () =>
    {
        const displayObject = new DisplayObject();
        displayObject.isText = true;
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        
        const result = execute(displayObject, matrix, 800, 600);
        
        expect(result).toBeInstanceOf(Float32Array);
        expect(result).not.toBe(null);
    });

    it("execute test case7 - video DisplayObject within bounds", () =>
    {
        const displayObject = new DisplayObject();
        displayObject.isVideo = true;
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        
        const result = execute(displayObject, matrix, 800, 600);
        
        expect(result).toBeInstanceOf(Float32Array);
        expect(result).not.toBe(null);
    });

    it("execute test case8 - container DisplayObject within bounds", () =>
    {
        const displayObject = new DisplayObject();
        displayObject.isContainerEnabled = true;
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        
        const result = execute(displayObject, matrix, 800, 600);
        
        expect(result).toBeInstanceOf(Float32Array);
        expect(result).not.toBe(null);
    });

    it("execute test case9 - bounds with negative position outside renderer", async () =>
    {
        const displayObject = new DisplayObject();
        displayObject.isShape = true;
        
        // Mock to return bounds with negative position outside renderer
        const { execute: shapeCalcBoundsMatrixUseCase } = await import("../../Shape/usecase/ShapeCalcBoundsMatrixUseCase");
        vi.mocked(shapeCalcBoundsMatrixUseCase).mockReturnValueOnce(new Float32Array([-110, -110, -10, -10]));
        
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const result = execute(displayObject, matrix, 800, 600);
        
        expect(result).toBe(null);
    });
});
