import { Graphics } from "../../Graphics";
import { execute } from "./GraphicsCalcLineBoundsService";
import { describe, expect, it } from "vitest";

describe("GraphicsCalcLineBoundsService.js test", () =>
{
    it("execute test", () =>
    {
        const graphics = new Graphics();

        expect(graphics.xMin).toBe(Number.MAX_VALUE);
        expect(graphics.yMin).toBe(Number.MAX_VALUE);
        expect(graphics.xMax).toBe(-Number.MAX_VALUE);
        expect(graphics.yMax).toBe(-Number.MAX_VALUE);

        execute(graphics, 10, 20, 30, 40, 50, "none");

        expect(graphics.xMin).toBe(-7.677669529663685);
        expect(graphics.yMin).toBe(2.322330470336315);
        expect(graphics.xMax).toBe(47.67766952966369);
        expect(graphics.yMax).toBe(57.67766952966369);
    });
});