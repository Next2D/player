import { Graphics } from "../../Graphics";
import { execute } from "./GraphicsDrawRoundRectService";
import { describe, expect, it } from "vitest";

describe("GraphicsDrawRoundRectService.js test", () =>
{
    it("execute test case1", () =>
    {
        const graphics = new Graphics();

        expect(graphics.xMin).toBe(Number.MAX_VALUE);
        expect(graphics.yMin).toBe(Number.MAX_VALUE);
        expect(graphics.xMax).toBe(-Number.MAX_VALUE);
        expect(graphics.yMax).toBe(-Number.MAX_VALUE);

        graphics.beginFill();
        execute(graphics, 10, 20, 60, 100, 10, 20);

        expect(graphics.xMin).toBe(10);
        expect(graphics.yMin).toBe(20);
        expect(graphics.xMax).toBe(70);
        expect(graphics.yMax).toBe(120);

        const buffer = graphics.buffer;
        expect(buffer.length).toBe(50);

        expect(buffer[0]).toBe(9);
        expect(buffer[1]).toBe(0);
        expect(buffer[2]).toBe(15);
        expect(buffer[3]).toBe(20);
        expect(buffer[4]).toBe(2);
        expect(buffer[5]).toBe(65);
        expect(buffer[6]).toBe(20);
        expect(buffer[7]).toBe(3);
        expect(buffer[8]).toBe(67.76142120361328);
        expect(buffer[9]).toBe(20);
        expect(buffer[10]).toBe(70);
        expect(buffer[11]).toBe(24.47715187072754);
        expect(buffer[12]).toBe(70);
        expect(buffer[13]).toBe(30);
        expect(buffer[14]).toBe(2);
        expect(buffer[15]).toBe(70);
        expect(buffer[16]).toBe(110);
        expect(buffer[17]).toBe(3);
        expect(buffer[18]).toBe(70);
        expect(buffer[19]).toBe(115.5228500366211);
        expect(buffer[20]).toBe(67.76142120361328);
        expect(buffer[21]).toBe(120);
        expect(buffer[22]).toBe(65);
        expect(buffer[23]).toBe(120);
        expect(buffer[24]).toBe(2);
        expect(buffer[25]).toBe(15);
        expect(buffer[26]).toBe(120);
        expect(buffer[27]).toBe(3);
        expect(buffer[28]).toBe(12.23857593536377);
        expect(buffer[29]).toBe(120);
        expect(buffer[30]).toBe(10);
        expect(buffer[31]).toBe(115.5228500366211);
        expect(buffer[32]).toBe(10);
        expect(buffer[33]).toBe(110);
        expect(buffer[34]).toBe(2);
        expect(buffer[35]).toBe(10);
        expect(buffer[36]).toBe(30);
        expect(buffer[37]).toBe(3);
        expect(buffer[38]).toBe(10);
        expect(buffer[39]).toBe(24.47715187072754);
        expect(buffer[40]).toBe(12.23857593536377);
        expect(buffer[41]).toBe(20);
        expect(buffer[42]).toBe(15);
        expect(buffer[43]).toBe(20);
        expect(buffer[44]).toBe(5);
        expect(buffer[45]).toBe(0);
        expect(buffer[46]).toBe(0);
        expect(buffer[47]).toBe(0);
        expect(buffer[48]).toBe(1);
        expect(buffer[49]).toBe(7);
    });
});