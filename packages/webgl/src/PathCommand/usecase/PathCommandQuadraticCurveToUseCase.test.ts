import { execute } from "./PathCommandQuadraticCurveToUseCase";
import { describe, expect, it } from "vitest";
import {
    $currentPath,
    $vertices
} from "../../PathCommand";

describe("PathCommandQuadraticCurveToUseCase.js method test", () =>
{
    it("test case", () =>
    {
        $currentPath.length = 0;
        $vertices.length = 0;
        
        expect($currentPath.length).toBe(0);
        expect($vertices.length).toBe(0);

        execute(10, 20, 30, 40);
        expect($currentPath.length).toBe(9);
        expect($vertices.length).toBe(0);
        expect($currentPath[0]).toBe(0);
        expect($currentPath[1]).toBe(0);
        expect($currentPath[2]).toBe(false);
        expect($currentPath[3]).toBe(10);
        expect($currentPath[4]).toBe(20);
        expect($currentPath[5]).toBe(true);
        expect($currentPath[6]).toBe(30);
        expect($currentPath[7]).toBe(40);
        expect($currentPath[8]).toBe(false);
    });
});