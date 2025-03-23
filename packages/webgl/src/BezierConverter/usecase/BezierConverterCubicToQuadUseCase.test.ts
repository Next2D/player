import { execute } from "./BezierConverterCubicToQuadUseCase";
import { describe, expect, it } from "vitest";
import { $bezierBuffer } from "../../BezierConverter";

describe("BezierConverterCubicToQuadUseCase.js method test", () =>
{
    it("test case", () =>
    {
        $bezierBuffer.fill(0);
        execute( 
            10, 10, 
            20, 20, 
            30, 30, 
            40, 40,
        );

        expect($bezierBuffer[0]).toBe(11.875);
        expect($bezierBuffer[1]).toBe(11.875);
        expect($bezierBuffer[2]).toBe(13.75);
        expect($bezierBuffer[3]).toBe(13.75);
        expect($bezierBuffer[4]).toBe(15.625);
        expect($bezierBuffer[5]).toBe(15.625);
        expect($bezierBuffer[6]).toBe(17.5);
        expect($bezierBuffer[7]).toBe(17.5);
        expect($bezierBuffer[8]).toBe(19.375);
        expect($bezierBuffer[9]).toBe(19.375);
        expect($bezierBuffer[10]).toBe(21.25);
        expect($bezierBuffer[11]).toBe(21.25);
        expect($bezierBuffer[12]).toBe(23.125);
        expect($bezierBuffer[13]).toBe(23.125);
        expect($bezierBuffer[14]).toBe(25);
        expect($bezierBuffer[15]).toBe(25);
        expect($bezierBuffer[16]).toBe(26.875);
        expect($bezierBuffer[17]).toBe(26.875);
        expect($bezierBuffer[18]).toBe(28.75);
        expect($bezierBuffer[19]).toBe(28.75);
        expect($bezierBuffer[20]).toBe(30.625);
        expect($bezierBuffer[21]).toBe(30.625);
        expect($bezierBuffer[22]).toBe(32.5);
        expect($bezierBuffer[23]).toBe(32.5);
        expect($bezierBuffer[24]).toBe(34.375);
        expect($bezierBuffer[25]).toBe(34.375);
        expect($bezierBuffer[26]).toBe(36.25);
        expect($bezierBuffer[27]).toBe(36.25);
        expect($bezierBuffer[28]).toBe(38.125);
        expect($bezierBuffer[29]).toBe(38.125);
        expect($bezierBuffer[30]).toBe(40);
        expect($bezierBuffer[31]).toBe(40);
    });
});