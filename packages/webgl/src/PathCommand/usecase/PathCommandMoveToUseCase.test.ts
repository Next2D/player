import { execute } from "./PathCommandMoveToUseCase";
import { describe, expect, it } from "vitest";
import {
    $currentPath,
    $vertices
} from "../../PathCommand";

describe("PathCommandMoveToUseCase.js method test", () =>
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

        $currentPath.push(30, 30 ,true);
        expect($currentPath.length).toBe(6);

        execute(10, 10);
        expect($currentPath.length).toBe(3);
        expect($currentPath[0]).toBe(10);
        expect($currentPath[1]).toBe(10);
        expect($currentPath[2]).toBe(false);
        expect($vertices.length).toBe(1);
        expect($vertices[0].length).toBe(6);
        expect($vertices[0][0]).toBe(0);
        expect($vertices[0][1]).toBe(0);
        expect($vertices[0][2]).toBe(false);
        expect($vertices[0][3]).toBe(30);
        expect($vertices[0][4]).toBe(30);
        expect($vertices[0][5]).toBe(true);

    });
});