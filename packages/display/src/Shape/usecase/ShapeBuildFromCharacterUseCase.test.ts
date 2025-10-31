import { execute } from "./ShapeBuildFromCharacterUseCase";
import { Shape } from "../../Shape";
import { describe, expect, it } from "vitest";

describe("ShapeBuildFromCharacterUseCase.js test", () =>
{
    it("execute test case1 - builds shape with basic bounds", () =>
    {
        const shape = new Shape();
        const character = {
            bounds: {
                xMin: 0,
                yMin: 0,
                xMax: 100,
                yMax: 100
            }
        };

        execute(shape, character);

        expect(shape.graphics.xMin).toBe(0);
        expect(shape.graphics.yMin).toBe(0);
        expect(shape.graphics.xMax).toBe(100);
        expect(shape.graphics.yMax).toBe(100);
    });

    it("execute test case2 - builds shape with negative bounds", () =>
    {
        const shape = new Shape();
        const character = {
            bounds: {
                xMin: -50,
                yMin: -30,
                xMax: 50,
                yMax: 70
            }
        };

        execute(shape, character);

        expect(shape.graphics.xMin).toBe(-50);
        expect(shape.graphics.yMin).toBe(-30);
        expect(shape.graphics.xMax).toBe(50);
        expect(shape.graphics.yMax).toBe(70);
    });

    it("execute test case3 - builds shape with zero bounds", () =>
    {
        const shape = new Shape();
        const character = {
            bounds: {
                xMin: 0,
                yMin: 0,
                xMax: 0,
                yMax: 0
            }
        };

        execute(shape, character);

        expect(shape.graphics.xMin).toBe(0);
        expect(shape.graphics.yMin).toBe(0);
        expect(shape.graphics.xMax).toBe(0);
        expect(shape.graphics.yMax).toBe(0);
    });

    it("execute test case4 - builds shape with large bounds", () =>
    {
        const shape = new Shape();
        const character = {
            bounds: {
                xMin: 0,
                yMin: 0,
                xMax: 1920,
                yMax: 1080
            }
        };

        execute(shape, character);

        expect(shape.graphics.xMin).toBe(0);
        expect(shape.graphics.yMin).toBe(0);
        expect(shape.graphics.xMax).toBe(1920);
        expect(shape.graphics.yMax).toBe(1080);
    });

    it("execute test case5 - builds shape with decimal bounds", () =>
    {
        const shape = new Shape();
        const character = {
            bounds: {
                xMin: 10.5,
                yMin: 20.7,
                xMax: 110.5,
                yMax: 120.3
            }
        };

        execute(shape, character);

        expect(shape.graphics.xMin).toBe(10.5);
        expect(shape.graphics.yMin).toBe(20.7);
        expect(shape.graphics.xMax).toBe(110.5);
        expect(shape.graphics.yMax).toBe(120.3);
    });

    it("execute test case6 - shape graphics is defined", () =>
    {
        const shape = new Shape();
        const character = {
            bounds: {
                xMin: 10,
                yMin: 20,
                xMax: 30,
                yMax: 40
            }
        };

        expect(shape.graphics).toBeDefined();
        
        execute(shape, character);

        expect(shape.graphics).toBeDefined();
    });

    it("execute test case7 - handles multiple executions", () =>
    {
        const shape = new Shape();
        
        const character1 = {
            bounds: { xMin: 0, yMin: 0, xMax: 50, yMax: 50 }
        };
        
        execute(shape, character1);
        expect(shape.graphics.xMax).toBe(50);

        const character2 = {
            bounds: { xMin: 0, yMin: 0, xMax: 100, yMax: 100 }
        };
        
        execute(shape, character2);
        expect(shape.graphics.xMax).toBe(100);
    });

    it("execute test case8 - preserves shape instance", () =>
    {
        const shape = new Shape();
        const originalShape = shape;
        const character = {
            bounds: { xMin: 0, yMin: 0, xMax: 10, yMax: 10 }
        };

        execute(shape, character);

        expect(shape).toBe(originalShape);
    });

    it("execute test case9 - handles inverted bounds", () =>
    {
        const shape = new Shape();
        const character = {
            bounds: {
                xMin: 100,
                yMin: 100,
                xMax: 0,
                yMax: 0
            }
        };

        execute(shape, character);

        // Bounds are set as-is from character
        expect(shape.graphics.xMin).toBe(100);
        expect(shape.graphics.xMax).toBe(0);
    });

    it("execute test case10 - validates bounds structure", () =>
    {
        const shape = new Shape();
        const character = {
            bounds: {
                xMin: 5,
                yMin: 10,
                xMax: 15,
                yMax: 20
            }
        };

        execute(shape, character);

        expect(typeof shape.graphics.xMin).toBe("number");
        expect(typeof shape.graphics.yMin).toBe("number");
        expect(typeof shape.graphics.xMax).toBe("number");
        expect(typeof shape.graphics.yMax).toBe("number");
    });
});
