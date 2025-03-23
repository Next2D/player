import { Context } from "../../Context";
import { execute } from "./ContextSetTransformService";
import { describe, expect, it, vi } from "vitest";

describe("ContextSetTransformService.js method test", () =>
{
    it("test case", () =>
    {
        const matrix = new Float32Array(9);

        expect(matrix[0]).toBe(0);
        expect(matrix[1]).toBe(0);
        expect(matrix[2]).toBe(0);
        expect(matrix[3]).toBe(0);
        expect(matrix[4]).toBe(0);
        expect(matrix[5]).toBe(0);
        expect(matrix[6]).toBe(0);
        expect(matrix[7]).toBe(0);
        expect(matrix[8]).toBe(0);
        
        execute(matrix, 1, 2, 3, 4, 5, 6);

        expect(matrix[0]).toBe(1);
        expect(matrix[1]).toBe(2);
        expect(matrix[2]).toBe(0);
        expect(matrix[3]).toBe(3);
        expect(matrix[4]).toBe(4);
        expect(matrix[5]).toBe(0);
        expect(matrix[6]).toBe(5);
        expect(matrix[7]).toBe(6);
        expect(matrix[8]).toBe(0);
    });
});