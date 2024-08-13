import { execute } from "./BezierConverterSplit2CubicService";
import { describe, expect, it } from "vitest";
import { $bezierBuffer } from "../../BezierConverter";

describe("BezierConverterSplit2CubicService.js method test", () =>
{
    it("test case offset 0 8", () =>
    {
        $bezierBuffer.fill(0);
        execute(
            10, 10, 
            20, 20, 
            30, 30, 
            40, 40, 
            0, 8
        );

        expect($bezierBuffer[0]).toBe(10);
        expect($bezierBuffer[1]).toBe(10);
        expect($bezierBuffer[2]).toBe(15);
        expect($bezierBuffer[3]).toBe(15);
        expect($bezierBuffer[4]).toBe(20);
        expect($bezierBuffer[5]).toBe(20);
        expect($bezierBuffer[6]).toBe(25);
        expect($bezierBuffer[7]).toBe(25);
        expect($bezierBuffer[8]).toBe(25);
        expect($bezierBuffer[9]).toBe(25);
        expect($bezierBuffer[10]).toBe(30);
        expect($bezierBuffer[11]).toBe(30);
        expect($bezierBuffer[12]).toBe(35);
        expect($bezierBuffer[13]).toBe(35);
        expect($bezierBuffer[14]).toBe(40);
        expect($bezierBuffer[15]).toBe(40);
        expect($bezierBuffer[16]).toBe(0);
        expect($bezierBuffer[17]).toBe(0);
        expect($bezierBuffer[18]).toBe(0);
        expect($bezierBuffer[19]).toBe(0);
        expect($bezierBuffer[20]).toBe(0);
        expect($bezierBuffer[21]).toBe(0);
        expect($bezierBuffer[22]).toBe(0);
        expect($bezierBuffer[23]).toBe(0);
        expect($bezierBuffer[24]).toBe(0);
        expect($bezierBuffer[25]).toBe(0);
        expect($bezierBuffer[26]).toBe(0);
        expect($bezierBuffer[27]).toBe(0);
        expect($bezierBuffer[28]).toBe(0);
        expect($bezierBuffer[29]).toBe(0);
        expect($bezierBuffer[30]).toBe(0);
        expect($bezierBuffer[31]).toBe(0);
    });

    it("test case offset 0 16", () =>
    {
        $bezierBuffer.fill(0);
        execute( 
            10, 10, 
            20, 20, 
            30, 30, 
            40, 40, 
            0, 16
        );

        expect($bezierBuffer[0]).toBe(10);
        expect($bezierBuffer[1]).toBe(10);
        expect($bezierBuffer[2]).toBe(15);
        expect($bezierBuffer[3]).toBe(15);
        expect($bezierBuffer[4]).toBe(20);
        expect($bezierBuffer[5]).toBe(20);
        expect($bezierBuffer[6]).toBe(25);
        expect($bezierBuffer[7]).toBe(25);
        expect($bezierBuffer[8]).toBe(0);
        expect($bezierBuffer[9]).toBe(0);
        expect($bezierBuffer[10]).toBe(0);
        expect($bezierBuffer[11]).toBe(0);
        expect($bezierBuffer[12]).toBe(0);
        expect($bezierBuffer[13]).toBe(0);
        expect($bezierBuffer[14]).toBe(0);
        expect($bezierBuffer[15]).toBe(0);
        expect($bezierBuffer[16]).toBe(25);
        expect($bezierBuffer[17]).toBe(25);
        expect($bezierBuffer[18]).toBe(30);
        expect($bezierBuffer[19]).toBe(30);
        expect($bezierBuffer[20]).toBe(35);
        expect($bezierBuffer[21]).toBe(35);
        expect($bezierBuffer[22]).toBe(40);
        expect($bezierBuffer[23]).toBe(40);
        expect($bezierBuffer[24]).toBe(0);
        expect($bezierBuffer[25]).toBe(0);
        expect($bezierBuffer[26]).toBe(0);
        expect($bezierBuffer[27]).toBe(0);
        expect($bezierBuffer[28]).toBe(0);
        expect($bezierBuffer[29]).toBe(0);
        expect($bezierBuffer[30]).toBe(0);
        expect($bezierBuffer[31]).toBe(0);
    });

    it("test case offset 16 24", () =>
    {
        $bezierBuffer.fill(0);
        execute(
            10, 10, 
            20, 20, 
            30, 30, 
            40, 40, 
            16, 24
        );

        expect($bezierBuffer[0]).toBe(0);
        expect($bezierBuffer[1]).toBe(0);
        expect($bezierBuffer[2]).toBe(0);
        expect($bezierBuffer[3]).toBe(0);
        expect($bezierBuffer[4]).toBe(0);
        expect($bezierBuffer[5]).toBe(0);
        expect($bezierBuffer[6]).toBe(0);
        expect($bezierBuffer[7]).toBe(0);
        expect($bezierBuffer[8]).toBe(0);
        expect($bezierBuffer[9]).toBe(0);
        expect($bezierBuffer[10]).toBe(0);
        expect($bezierBuffer[11]).toBe(0);
        expect($bezierBuffer[12]).toBe(0);
        expect($bezierBuffer[13]).toBe(0);
        expect($bezierBuffer[14]).toBe(0);
        expect($bezierBuffer[15]).toBe(0);
        expect($bezierBuffer[16]).toBe(10);
        expect($bezierBuffer[17]).toBe(10);
        expect($bezierBuffer[18]).toBe(15);
        expect($bezierBuffer[19]).toBe(15);
        expect($bezierBuffer[20]).toBe(20);
        expect($bezierBuffer[21]).toBe(20);
        expect($bezierBuffer[22]).toBe(25);
        expect($bezierBuffer[23]).toBe(25);
        expect($bezierBuffer[24]).toBe(25);
        expect($bezierBuffer[25]).toBe(25);
        expect($bezierBuffer[26]).toBe(30);
        expect($bezierBuffer[27]).toBe(30);
        expect($bezierBuffer[28]).toBe(35);
        expect($bezierBuffer[29]).toBe(35);
        expect($bezierBuffer[30]).toBe(40);
        expect($bezierBuffer[31]).toBe(40);
    });
});