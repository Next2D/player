import { execute } from "./PathCommandBeginPathService";
import { describe, expect, it } from "vitest";

describe("PathCommandBeginPathService.js method test", () =>
{
    it("test case", () =>
    {
        const currentPath = [1, 2, true];
        const vertices = [[1, 2, true], [3, 4, false]];

        expect(currentPath.length).toBe(3);
        expect(vertices.length).toBe(2);

        execute(currentPath, vertices);

        expect(currentPath.length).toBe(0);
        expect(vertices.length).toBe(0);
    });
});