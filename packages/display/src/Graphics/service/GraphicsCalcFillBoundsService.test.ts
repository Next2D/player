import { Graphics } from "../../Graphics";
import { execute } from "./GraphicsCalcFillBoundsService";
import { describe, expect, it } from "vitest";

describe("GraphicsCalcFillBoundsService.js test", () =>
{
    it("execute test case1", () =>
    {
        const graphics = new Graphics();

        expect(graphics.xMin).toBe(Number.MAX_VALUE);
        expect(graphics.yMin).toBe(Number.MAX_VALUE);
        expect(graphics.xMax).toBe(-Number.MAX_VALUE);
        expect(graphics.yMax).toBe(-Number.MAX_VALUE);

        execute(graphics, 10, 20);

        expect(graphics.xMin).toBe(10);
        expect(graphics.yMin).toBe(20);
        expect(graphics.xMax).toBe(10);
        expect(graphics.yMax).toBe(20);

        execute(graphics, 0, 0);

        expect(graphics.xMin).toBe(0);
        expect(graphics.yMin).toBe(0);
        expect(graphics.xMax).toBe(10);
        expect(graphics.yMax).toBe(20);
    });
});