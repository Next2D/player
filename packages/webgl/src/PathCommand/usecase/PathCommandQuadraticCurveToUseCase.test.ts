import type { IPath } from "../../interface/IPath";
import { execute } from "./PathCommandQuadraticCurveToUseCase";
import { describe, expect, it } from "vitest";

describe("PathCommandQuadraticCurveToUseCase.js method test", () =>
{
    it("test case", () =>
    {
        const currentPath: IPath = [];
        const vertices: IPath[] = [];
        
        expect(currentPath.length).toBe(0);
        expect(vertices.length).toBe(0);

        execute(currentPath, vertices, 10, 20, 30, 40);
        expect(currentPath.length).toBe(9);
        expect(vertices.length).toBe(0);
        expect(currentPath[0]).toBe(0);
        expect(currentPath[1]).toBe(0);
        expect(currentPath[2]).toBe(false);
        expect(currentPath[3]).toBe(10);
        expect(currentPath[4]).toBe(20);
        expect(currentPath[5]).toBe(true);
        expect(currentPath[6]).toBe(30);
        expect(currentPath[7]).toBe(40);
        expect(currentPath[8]).toBe(false);
    });
});