import { describe, it, expect } from "vitest";
import { execute } from "./BufferManagerCreateRectVerticesService";

describe("BufferManagerCreateRectVerticesService", () =>
{
    it("should create vertices for unit rectangle", () =>
    {
        const result = execute(0, 0, 1, 1);

        expect(result).toBeInstanceOf(Float32Array);
        // 6 vertices * 4 components (x, y, u, v) = 24
        expect(result.length).toBe(24);
    });

    it("should have correct positions for origin rectangle", () =>
    {
        const result = execute(0, 0, 10, 20);

        // First triangle: (0,0), (10,0), (0,20)
        expect(result[0]).toBe(0);   // x
        expect(result[1]).toBe(0);   // y
        expect(result[4]).toBe(10);  // x
        expect(result[5]).toBe(0);   // y
        expect(result[8]).toBe(0);   // x
        expect(result[9]).toBe(20);  // y

        // Second triangle: (10,0), (10,20), (0,20)
        expect(result[12]).toBe(10); // x
        expect(result[13]).toBe(0);  // y
        expect(result[16]).toBe(10); // x
        expect(result[17]).toBe(20); // y
        expect(result[20]).toBe(0);  // x
        expect(result[21]).toBe(20); // y
    });

    it("should have correct texture coordinates", () =>
    {
        const result = execute(0, 0, 1, 1);

        // First triangle tex coords
        expect(result[2]).toBe(0);   // u (top-left)
        expect(result[3]).toBe(0);   // v
        expect(result[6]).toBe(1);   // u (top-right)
        expect(result[7]).toBe(0);   // v
        expect(result[10]).toBe(0);  // u (bottom-left)
        expect(result[11]).toBe(1);  // v

        // Second triangle tex coords
        expect(result[14]).toBe(1);  // u (top-right)
        expect(result[15]).toBe(0);  // v
        expect(result[18]).toBe(1);  // u (bottom-right)
        expect(result[19]).toBe(1);  // v
        expect(result[22]).toBe(0);  // u (bottom-left)
        expect(result[23]).toBe(1);  // v
    });

    it("should handle offset position", () =>
    {
        const result = execute(100, 200, 50, 30);

        // Check first vertex position
        expect(result[0]).toBe(100);
        expect(result[1]).toBe(200);

        // Check corner positions
        expect(result[4]).toBe(150);  // x + width
        expect(result[5]).toBe(200);  // y
        expect(result[16]).toBe(150); // x + width
        expect(result[17]).toBe(230); // y + height
    });

    it("should handle negative positions", () =>
    {
        const result = execute(-10, -20, 30, 40);

        expect(result[0]).toBe(-10);
        expect(result[1]).toBe(-20);
        expect(result[4]).toBe(20);   // -10 + 30
        expect(result[9]).toBe(20);   // -20 + 40
    });

    it("should handle zero dimensions", () =>
    {
        const result = execute(5, 5, 0, 0);

        expect(result).toBeInstanceOf(Float32Array);
        expect(result.length).toBe(24);
        // All position x should be 5
        expect(result[0]).toBe(5);
        expect(result[4]).toBe(5);
    });
});
