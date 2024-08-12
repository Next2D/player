import type { IPath } from "../../interface/IPath";
import { execute } from "./PathCommandLineToUseCase";
import { describe, expect, it } from "vitest";

describe("PathCommandLineToUseCase.js method test", () =>
{
    it("test case", () =>
    {
        const currentPath: IPath = [];
        const vertices: IPath[] = [];
        
        expect(currentPath.length).toBe(0);
        expect(vertices.length).toBe(0);

        execute(currentPath, vertices, 0, 0);
        expect(currentPath.length).toBe(3);
        expect(vertices.length).toBe(0);
        expect(currentPath[0]).toBe(0);
        expect(currentPath[1]).toBe(0);
        expect(currentPath[2]).toBe(false);

        execute(currentPath, vertices, 0, 0);
        expect(currentPath.length).toBe(3);
        expect(vertices.length).toBe(0);
        expect(currentPath[0]).toBe(0);
        expect(currentPath[1]).toBe(0);
        expect(currentPath[2]).toBe(false);

        execute(currentPath, vertices, 10, 10);
        expect(currentPath.length).toBe(6);
        expect(vertices.length).toBe(0);
        expect(currentPath[0]).toBe(0);
        expect(currentPath[1]).toBe(0);
        expect(currentPath[2]).toBe(false);
        expect(currentPath[3]).toBe(10);
        expect(currentPath[4]).toBe(10);
        expect(currentPath[5]).toBe(false);
    });
});