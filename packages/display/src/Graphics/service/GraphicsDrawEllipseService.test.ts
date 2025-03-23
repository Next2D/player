import { Graphics } from "../../Graphics";
import { execute } from "./GraphicsDrawEllipseService";
import { describe, expect, it } from "vitest";

describe("GraphicsDrawEllipseService.js test", () =>
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
        expect(buffer.length).toBe(38);
        expect(buffer[0]).toBe(9);
        expect(buffer[1]).toBe(0);
        expect(buffer[2]).toBe(40);
        expect(buffer[3]).toBe(20);
        expect(buffer[4]).toBe(3);
        expect(buffer[5]).toBe(56.56854248046875);
        expect(buffer[6]).toBe(20);
        expect(buffer[7]).toBe(70);
        expect(buffer[8]).toBe(42.38576126098633);
        expect(buffer[9]).toBe(70);
        expect(buffer[10]).toBe(70);
        expect(buffer[11]).toBe(3);
        expect(buffer[12]).toBe(70);
        expect(buffer[13]).toBe(97.6142349243164);
        expect(buffer[14]).toBe(56.56854248046875);
        expect(buffer[15]).toBe(120);
        expect(buffer[16]).toBe(40);
        expect(buffer[17]).toBe(120);
        expect(buffer[18]).toBe(3);
        expect(buffer[19]).toBe(23.43145751953125);
        expect(buffer[20]).toBe(120);
        expect(buffer[21]).toBe(10);
        expect(buffer[22]).toBe(97.6142349243164);
        expect(buffer[23]).toBe(10);
        expect(buffer[24]).toBe(70);
        expect(buffer[25]).toBe(3);
        expect(buffer[26]).toBe(10);
        expect(buffer[27]).toBe(42.38576126098633);
        expect(buffer[28]).toBe(23.43145751953125);
        expect(buffer[29]).toBe(20);
        expect(buffer[30]).toBe(40);
        expect(buffer[31]).toBe(20);
        expect(buffer[32]).toBe(5);
        expect(buffer[33]).toBe(0);
        expect(buffer[34]).toBe(0);
        expect(buffer[35]).toBe(0);
        expect(buffer[36]).toBe(255);
        expect(buffer[37]).toBe(7);
    });
});