import { Graphics } from "../../Graphics";
import { execute } from "./GraphicsMargePathService";
import { describe, expect, it } from "vitest";

describe("GraphicsMargePathService.js test", () =>
{
    it("execute test case1", () =>
    {
        const graphics = new Graphics();

        const fill = [];
        expect(fill.length).toBe(0);

        const line = [];
        expect(line.length).toBe(0);

        execute(graphics, true, true, fill, line, 10, 20);

        expect(fill.length).toBe(2);
        expect(fill[0]).toBe(10);
        expect(fill[1]).toBe(20);

        expect(line.length).toBe(2);
        expect(line[0]).toBe(10);
        expect(line[1]).toBe(20);
    });
});