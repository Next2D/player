import { execute } from "./PathCommandClosePathUseCase";
import { describe, expect, it } from "vitest";
import {
    $currentPath,
    $vertices
} from "../../PathCommand";

describe("PathCommandClosePathUseCase.js method test", () =>
{
    it("test case", () =>
    {
        $currentPath.length = 0;
        $vertices.length = 0;

        $currentPath.push(
            1, 2, false, 
            3, 4, true, 
            5, 6, false
        );
        
        expect($currentPath.length).toBe(9);
        expect($vertices.length).toBe(0);

        execute();

        expect($currentPath.length).toBe(12);
        expect($currentPath[0]).toBe(1);
        expect($currentPath[1]).toBe(2);
        expect($currentPath[2]).toBe(false);
        expect($currentPath[3]).toBe(3);
        expect($currentPath[4]).toBe(4);
        expect($currentPath[5]).toBe(true);
        expect($currentPath[6]).toBe(5);
        expect($currentPath[7]).toBe(6);
        expect($currentPath[8]).toBe(false);
        expect($currentPath[9]).toBe(1);
        expect($currentPath[10]).toBe(2);
        expect($currentPath[11]).toBe(false);
    });
});