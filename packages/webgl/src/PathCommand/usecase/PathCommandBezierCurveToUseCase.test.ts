import { execute } from "./PathCommandBezierCurveToUseCase";
import { describe, expect, it } from "vitest";
import {
    $currentPath,
    $vertices
} from "../../PathCommand";

describe("PathCommandBezierCurveToUseCase.js method test", () =>
{
    it("test case", () =>
    {
        $currentPath.length = 0;
        $vertices.length = 0;
        
        expect($currentPath.length).toBe(0);
        expect($vertices.length).toBe(0);

        execute(10, 10, 20, 20, 30, 30);
        expect($currentPath.length).toBe(51);
        expect($vertices.length).toBe(0);
        expect($currentPath[0]).toBe(0);
        expect($currentPath[1]).toBe(0);
        expect($currentPath[2]).toBe(false);
        expect($currentPath[3]).toBe(1.875);
        expect($currentPath[4]).toBe(1.875);
        expect($currentPath[5]).toBe(true);
        expect($currentPath[6]).toBe(3.75);
        expect($currentPath[7]).toBe(3.75);
        expect($currentPath[8]).toBe(false);
        expect($currentPath[9]).toBe(5.625);
        expect($currentPath[10]).toBe(5.625);
        expect($currentPath[11]).toBe(true);
        expect($currentPath[12]).toBe(7.5);
        expect($currentPath[13]).toBe(7.5);
        expect($currentPath[14]).toBe(false);
        expect($currentPath[15]).toBe(9.375);
        expect($currentPath[16]).toBe(9.375);
        expect($currentPath[17]).toBe(true);
        expect($currentPath[18]).toBe(11.25);
        expect($currentPath[19]).toBe(11.25);
        expect($currentPath[20]).toBe(false);
        expect($currentPath[21]).toBe(13.125);
        expect($currentPath[22]).toBe(13.125);
        expect($currentPath[23]).toBe(true);
        expect($currentPath[24]).toBe(15);
        expect($currentPath[25]).toBe(15);
        expect($currentPath[26]).toBe(false);
        expect($currentPath[27]).toBe(16.875);
        expect($currentPath[28]).toBe(16.875);
        expect($currentPath[29]).toBe(true);
        expect($currentPath[30]).toBe(18.75);
        expect($currentPath[31]).toBe(18.75);
        expect($currentPath[32]).toBe(false);
        expect($currentPath[33]).toBe(20.625);
        expect($currentPath[34]).toBe(20.625);
        expect($currentPath[35]).toBe(true);
        expect($currentPath[36]).toBe(22.5);
        expect($currentPath[37]).toBe(22.5);
        expect($currentPath[38]).toBe(false);
        expect($currentPath[39]).toBe(24.375);
        expect($currentPath[40]).toBe(24.375);
        expect($currentPath[41]).toBe(true);
        expect($currentPath[42]).toBe(26.25);
        expect($currentPath[43]).toBe(26.25);
        expect($currentPath[44]).toBe(false);
        expect($currentPath[45]).toBe(28.125);
        expect($currentPath[46]).toBe(28.125);
        expect($currentPath[47]).toBe(true);
        expect($currentPath[48]).toBe(30);
        expect($currentPath[49]).toBe(30);
        expect($currentPath[50]).toBe(false);
    });
});