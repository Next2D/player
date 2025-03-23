import { execute } from "./PathCommandLineToUseCase";
import { describe, expect, it } from "vitest";
import {
    $currentPath,
    $vertices
} from "../../PathCommand";

describe("PathCommandLineToUseCase.js method test", () =>
{
    it("test case", () =>
    {
        $currentPath.length = 0;
        $vertices.length = 0;
        
        expect($currentPath.length).toBe(0);
        expect($vertices.length).toBe(0);

        execute(0, 0);
        expect($currentPath.length).toBe(3);
        expect($vertices.length).toBe(0);
        expect($currentPath[0]).toBe(0);
        expect($currentPath[1]).toBe(0);
        expect($currentPath[2]).toBe(false);

        execute(0, 0);
        expect($currentPath.length).toBe(3);
        expect($vertices.length).toBe(0);
        expect($currentPath[0]).toBe(0);
        expect($currentPath[1]).toBe(0);
        expect($currentPath[2]).toBe(false);

        execute(10, 10);
        expect($currentPath.length).toBe(6);
        expect($vertices.length).toBe(0);
        expect($currentPath[0]).toBe(0);
        expect($currentPath[1]).toBe(0);
        expect($currentPath[2]).toBe(false);
        expect($currentPath[3]).toBe(10);
        expect($currentPath[4]).toBe(10);
        expect($currentPath[5]).toBe(false);
    });
});