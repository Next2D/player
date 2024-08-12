import { execute } from "./BezierConverterCubicToQuadUseCase";
import { describe, expect, it } from "vitest";

describe("BezierConverterCubicToQuadUseCase.js method test", () =>
{
    it("test case", () =>
    {
        const buffer = new Float32Array(32);
        execute(buffer, 
            10, 10, 
            20, 20, 
            30, 30, 
            40, 40,
        );

        expect(buffer[0]).toBe(11.875);
        expect(buffer[1]).toBe(11.875);
        expect(buffer[2]).toBe(13.75);
        expect(buffer[3]).toBe(13.75);
        expect(buffer[4]).toBe(15.625);
        expect(buffer[5]).toBe(15.625);
        expect(buffer[6]).toBe(17.5);
        expect(buffer[7]).toBe(17.5);
        expect(buffer[8]).toBe(19.375);
        expect(buffer[9]).toBe(19.375);
        expect(buffer[10]).toBe(21.25);
        expect(buffer[11]).toBe(21.25);
        expect(buffer[12]).toBe(23.125);
        expect(buffer[13]).toBe(23.125);
        expect(buffer[14]).toBe(25);
        expect(buffer[15]).toBe(25);
        expect(buffer[16]).toBe(26.875);
        expect(buffer[17]).toBe(26.875);
        expect(buffer[18]).toBe(28.75);
        expect(buffer[19]).toBe(28.75);
        expect(buffer[20]).toBe(30.625);
        expect(buffer[21]).toBe(30.625);
        expect(buffer[22]).toBe(32.5);
        expect(buffer[23]).toBe(32.5);
        expect(buffer[24]).toBe(34.375);
        expect(buffer[25]).toBe(34.375);
        expect(buffer[26]).toBe(36.25);
        expect(buffer[27]).toBe(36.25);
        expect(buffer[28]).toBe(38.125);
        expect(buffer[29]).toBe(38.125);
        expect(buffer[30]).toBe(40);
        expect(buffer[31]).toBe(40);
    });
});