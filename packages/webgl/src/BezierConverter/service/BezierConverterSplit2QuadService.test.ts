import { execute } from "./BezierConverterSplit2QuadService";
import { describe, expect, it } from "vitest";
import { $bezierBuffer } from "../../BezierConverter";

describe("BezierConverterSplit2QuadService.js method test", () =>
{
    it("test case offset 0", () =>
    {
        $bezierBuffer.fill(0);
        execute(
            10, 10, 
            20, 20, 
            30, 30, 
            40, 40, 
            0
        );

        expect($bezierBuffer[0]).toBe(17.5);
        expect($bezierBuffer[1]).toBe(17.5);
        expect($bezierBuffer[2]).toBe(25);
        expect($bezierBuffer[3]).toBe(25);
        expect($bezierBuffer[4]).toBe(32.5);
        expect($bezierBuffer[5]).toBe(32.5);
        expect($bezierBuffer[6]).toBe(40);
        expect($bezierBuffer[7]).toBe(40);
        expect($bezierBuffer[8]).toBe(0);
        expect($bezierBuffer[9]).toBe(0);
        expect($bezierBuffer[10]).toBe(0);
        expect($bezierBuffer[11]).toBe(0);
        expect($bezierBuffer[12]).toBe(0);
        expect($bezierBuffer[13]).toBe(0);
        expect($bezierBuffer[14]).toBe(0);
        expect($bezierBuffer[15]).toBe(0);
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

    it("test case offset 8", () =>
    {
        $bezierBuffer.fill(0);
        execute( 
            10, 10, 
            20, 20, 
            30, 30, 
            40, 40, 
            8
        );
    
        expect($bezierBuffer[0]).toBe(0);
        expect($bezierBuffer[1]).toBe(0);
        expect($bezierBuffer[2]).toBe(0);
        expect($bezierBuffer[3]).toBe(0);
        expect($bezierBuffer[4]).toBe(0);
        expect($bezierBuffer[5]).toBe(0);
        expect($bezierBuffer[6]).toBe(0);
        expect($bezierBuffer[7]).toBe(0);
        expect($bezierBuffer[8]).toBe(17.5);
        expect($bezierBuffer[9]).toBe(17.5);
        expect($bezierBuffer[10]).toBe(25);
        expect($bezierBuffer[11]).toBe(25);
        expect($bezierBuffer[12]).toBe(32.5);
        expect($bezierBuffer[13]).toBe(32.5);
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

    it("test case offset 16", () =>
    {
        $bezierBuffer.fill(0);
        execute(
            10, 10, 
            20, 20, 
            30, 30, 
            40, 40, 
            16
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
        expect($bezierBuffer[16]).toBe(17.5);
        expect($bezierBuffer[17]).toBe(17.5);
        expect($bezierBuffer[18]).toBe(25);
        expect($bezierBuffer[19]).toBe(25);
        expect($bezierBuffer[20]).toBe(32.5);
        expect($bezierBuffer[21]).toBe(32.5);
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

    it("test case offset 24", () =>
    {
        $bezierBuffer.fill(0);
        execute(
            10, 10, 
            20, 20, 
            30, 30, 
            40, 40, 
            24
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
        expect($bezierBuffer[16]).toBe(0);
        expect($bezierBuffer[17]).toBe(0);
        expect($bezierBuffer[18]).toBe(0);
        expect($bezierBuffer[19]).toBe(0);
        expect($bezierBuffer[20]).toBe(0);
        expect($bezierBuffer[21]).toBe(0);
        expect($bezierBuffer[22]).toBe(0);
        expect($bezierBuffer[23]).toBe(0);
        expect($bezierBuffer[24]).toBe(17.5);
        expect($bezierBuffer[25]).toBe(17.5);
        expect($bezierBuffer[26]).toBe(25);
        expect($bezierBuffer[27]).toBe(25);
        expect($bezierBuffer[28]).toBe(32.5);
        expect($bezierBuffer[29]).toBe(32.5);
        expect($bezierBuffer[30]).toBe(40);
        expect($bezierBuffer[31]).toBe(40);
    });
});