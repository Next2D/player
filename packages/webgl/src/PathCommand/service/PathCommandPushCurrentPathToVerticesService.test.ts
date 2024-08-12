import { execute } from "./PathCommandPushCurrentPathToVerticesService";
import { describe, expect, it } from "vitest";

describe("PathCommandPushCurrentPathToVerticesService.js method test", () =>
{
    it("test case", () =>
    {
        const currentPath = [
            1, 2, false,
            3, 4, false,
            5, 6, true
        ];

        const vertices = [];
        
        expect(currentPath.length).toBe(9);
        expect(vertices.length).toBe(0);
        
        execute(currentPath, vertices);

        expect(currentPath.length).toBe(0);
        expect(vertices.length).toBe(1);
        expect(vertices[0][0]).toBe(1);
        expect(vertices[0][1]).toBe(2);
        expect(vertices[0][2]).toBe(false);
        expect(vertices[0][3]).toBe(3);
        expect(vertices[0][4]).toBe(4);
        expect(vertices[0][5]).toBe(false);
        expect(vertices[0][6]).toBe(5);
        expect(vertices[0][7]).toBe(6);
        expect(vertices[0][8]).toBe(true);

    });
});