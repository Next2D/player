import { Graphics } from "../../Graphics";
import { execute } from "./GraphicsDrawRectService";
import { describe, expect, it } from "vitest";

describe("GraphicsDrawRectService.js test", () =>
{
    it("execute test case1", () =>
    {
        const graphics = new Graphics();

        expect(graphics.xMin).toBe(Number.MAX_VALUE);
        expect(graphics.yMin).toBe(Number.MAX_VALUE);
        expect(graphics.xMax).toBe(-Number.MAX_VALUE);
        expect(graphics.yMax).toBe(-Number.MAX_VALUE);

        graphics.beginFill();
        execute(graphics, 10, 20, 60, 100);

        expect(graphics.xMin).toBe(10);
        expect(graphics.yMin).toBe(20);
        expect(graphics.xMax).toBe(70);
        expect(graphics.yMax).toBe(120);

        const buffer = graphics.buffer;
        expect(buffer.length).toBe(22);

        expect(buffer[0]).toBe(9);
        expect(buffer[1]).toBe(0);
        expect(buffer[2]).toBe(10);
        expect(buffer[3]).toBe(20);
        expect(buffer[4]).toBe(2);
        expect(buffer[5]).toBe(10);
        expect(buffer[6]).toBe(120);
        expect(buffer[7]).toBe(2);
        expect(buffer[8]).toBe(70);
        expect(buffer[9]).toBe(120);
        expect(buffer[10]).toBe(2);
        expect(buffer[11]).toBe(70);
        expect(buffer[12]).toBe(20);
        expect(buffer[13]).toBe(2);
        expect(buffer[14]).toBe(10);
        expect(buffer[15]).toBe(20);
        expect(buffer[16]).toBe(5);
        expect(buffer[17]).toBe(0);
        expect(buffer[18]).toBe(0);
        expect(buffer[19]).toBe(0);
        expect(buffer[20]).toBe(1);
        expect(buffer[21]).toBe(7);
    });
});