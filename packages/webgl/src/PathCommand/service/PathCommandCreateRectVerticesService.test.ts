
import { execute } from "./PathCommandCreateRectVerticesService";
import { describe, expect, it } from "vitest";

describe("PathCommandCreateRectVerticesService.js method test", () =>
{
    it("test case", () =>
    {
        const vertices = execute(0, 0, 100, 100);
        expect(vertices.length).toBe(1);
        expect(vertices[0].length).toBe(12);
        expect(vertices[0][0]).toBe(0);
        expect(vertices[0][1]).toBe(0);
        expect(vertices[0][2]).toBe(false);
        expect(vertices[0][3]).toBe(100);
        expect(vertices[0][4]).toBe(0);
        expect(vertices[0][5]).toBe(false);
        expect(vertices[0][6]).toBe(100);
        expect(vertices[0][7]).toBe(100);
        expect(vertices[0][8]).toBe(false);
        expect(vertices[0][9]).toBe(0);
        expect(vertices[0][10]).toBe(100);
        expect(vertices[0][11]).toBe(false);
    });
});