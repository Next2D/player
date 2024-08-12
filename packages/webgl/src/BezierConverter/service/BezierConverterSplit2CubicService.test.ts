import { execute } from "./BezierConverterSplit2CubicService";
import { describe, expect, it } from "vitest";

describe("BezierConverterSplit2CubicService.js method test", () =>
{
    it("test case offset 0 8", () =>
    {
        const buffer = new Float32Array(32);

        execute(buffer, 
            10, 10, 
            20, 20, 
            30, 30, 
            40, 40, 
            0, 8
        );

        expect(buffer[0]).toBe(10);
        expect(buffer[1]).toBe(10);
        expect(buffer[2]).toBe(15);
        expect(buffer[3]).toBe(15);
        expect(buffer[4]).toBe(20);
        expect(buffer[5]).toBe(20);
        expect(buffer[6]).toBe(25);
        expect(buffer[7]).toBe(25);
        expect(buffer[8]).toBe(25);
        expect(buffer[9]).toBe(25);
        expect(buffer[10]).toBe(30);
        expect(buffer[11]).toBe(30);
        expect(buffer[12]).toBe(35);
        expect(buffer[13]).toBe(35);
        expect(buffer[14]).toBe(40);
        expect(buffer[15]).toBe(40);
        expect(buffer[16]).toBe(0);
        expect(buffer[17]).toBe(0);
        expect(buffer[18]).toBe(0);
        expect(buffer[19]).toBe(0);
        expect(buffer[20]).toBe(0);
        expect(buffer[21]).toBe(0);
        expect(buffer[22]).toBe(0);
        expect(buffer[23]).toBe(0);
        expect(buffer[24]).toBe(0);
        expect(buffer[25]).toBe(0);
        expect(buffer[26]).toBe(0);
        expect(buffer[27]).toBe(0);
        expect(buffer[28]).toBe(0);
        expect(buffer[29]).toBe(0);
        expect(buffer[30]).toBe(0);
        expect(buffer[31]).toBe(0);
    });

    it("test case offset 0 16", () =>
    {
        const buffer = new Float32Array(32);

        execute(buffer, 
            10, 10, 
            20, 20, 
            30, 30, 
            40, 40, 
            0, 16
        );

        expect(buffer[0]).toBe(10);
        expect(buffer[1]).toBe(10);
        expect(buffer[2]).toBe(15);
        expect(buffer[3]).toBe(15);
        expect(buffer[4]).toBe(20);
        expect(buffer[5]).toBe(20);
        expect(buffer[6]).toBe(25);
        expect(buffer[7]).toBe(25);
        expect(buffer[8]).toBe(0);
        expect(buffer[9]).toBe(0);
        expect(buffer[10]).toBe(0);
        expect(buffer[11]).toBe(0);
        expect(buffer[12]).toBe(0);
        expect(buffer[13]).toBe(0);
        expect(buffer[14]).toBe(0);
        expect(buffer[15]).toBe(0);
        expect(buffer[16]).toBe(25);
        expect(buffer[17]).toBe(25);
        expect(buffer[18]).toBe(30);
        expect(buffer[19]).toBe(30);
        expect(buffer[20]).toBe(35);
        expect(buffer[21]).toBe(35);
        expect(buffer[22]).toBe(40);
        expect(buffer[23]).toBe(40);
        expect(buffer[24]).toBe(0);
        expect(buffer[25]).toBe(0);
        expect(buffer[26]).toBe(0);
        expect(buffer[27]).toBe(0);
        expect(buffer[28]).toBe(0);
        expect(buffer[29]).toBe(0);
        expect(buffer[30]).toBe(0);
        expect(buffer[31]).toBe(0);
    });

    it("test case offset 16 24", () =>
    {
        const buffer = new Float32Array(32);
    
        execute(buffer, 
            10, 10, 
            20, 20, 
            30, 30, 
            40, 40, 
            16, 24
        );

        expect(buffer[0]).toBe(0);
        expect(buffer[1]).toBe(0);
        expect(buffer[2]).toBe(0);
        expect(buffer[3]).toBe(0);
        expect(buffer[4]).toBe(0);
        expect(buffer[5]).toBe(0);
        expect(buffer[6]).toBe(0);
        expect(buffer[7]).toBe(0);
        expect(buffer[8]).toBe(0);
        expect(buffer[9]).toBe(0);
        expect(buffer[10]).toBe(0);
        expect(buffer[11]).toBe(0);
        expect(buffer[12]).toBe(0);
        expect(buffer[13]).toBe(0);
        expect(buffer[14]).toBe(0);
        expect(buffer[15]).toBe(0);
        expect(buffer[16]).toBe(10);
        expect(buffer[17]).toBe(10);
        expect(buffer[18]).toBe(15);
        expect(buffer[19]).toBe(15);
        expect(buffer[20]).toBe(20);
        expect(buffer[21]).toBe(20);
        expect(buffer[22]).toBe(25);
        expect(buffer[23]).toBe(25);
        expect(buffer[24]).toBe(25);
        expect(buffer[25]).toBe(25);
        expect(buffer[26]).toBe(30);
        expect(buffer[27]).toBe(30);
        expect(buffer[28]).toBe(35);
        expect(buffer[29]).toBe(35);
        expect(buffer[30]).toBe(40);
        expect(buffer[31]).toBe(40);
    });
});