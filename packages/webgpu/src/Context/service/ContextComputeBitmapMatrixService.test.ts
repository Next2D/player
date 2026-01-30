import { describe, it, expect } from "vitest";
import { execute } from "./ContextComputeBitmapMatrixService";

describe("ContextComputeBitmapMatrixService", () =>
{
    it("should compute inverse of identity matrix", () =>
    {
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]); // identity

        const result = execute(matrix);

        // Inverse of identity is identity
        expect(result[0]).toBeCloseTo(1, 5); // ia
        expect(result[1]).toBeCloseTo(0, 5); // ib
        expect(result[2]).toBeCloseTo(0, 5);
        expect(result[3]).toBeCloseTo(0, 5); // ic
        expect(result[4]).toBeCloseTo(1, 5); // id
        expect(result[5]).toBeCloseTo(0, 5);
        expect(result[6]).toBeCloseTo(0, 5); // itx
        expect(result[7]).toBeCloseTo(0, 5); // ity
        expect(result[8]).toBeCloseTo(1, 5);
    });

    it("should compute inverse of scale matrix", () =>
    {
        const matrix = new Float32Array([2, 0, 0, 3, 0, 0]); // scale(2, 3)

        const result = execute(matrix);

        // Inverse of scale(2,3) is scale(0.5, 1/3)
        expect(result[0]).toBeCloseTo(0.5, 5);      // ia = d / det = 3 / 6 = 0.5
        expect(result[1]).toBeCloseTo(0, 5);        // ib
        expect(result[3]).toBeCloseTo(0, 5);        // ic
        expect(result[4]).toBeCloseTo(1 / 3, 5);    // id = a / det = 2 / 6
    });

    it("should compute inverse of translation matrix", () =>
    {
        const matrix = new Float32Array([1, 0, 0, 1, 100, 50]); // translate(100, 50)

        const result = execute(matrix);

        // Inverse of translate(100, 50) is translate(-100, -50)
        expect(result[0]).toBeCloseTo(1, 5);
        expect(result[4]).toBeCloseTo(1, 5);
        expect(result[6]).toBeCloseTo(-100, 5);     // itx
        expect(result[7]).toBeCloseTo(-50, 5);      // ity
    });

    it("should compute inverse of rotation matrix", () =>
    {
        const angle = Math.PI / 4; // 45 degrees
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const matrix = new Float32Array([cos, sin, -sin, cos, 0, 0]);

        const result = execute(matrix);

        // Inverse of rotation is rotation by negative angle
        expect(result[0]).toBeCloseTo(cos, 5);      // ia
        expect(result[1]).toBeCloseTo(-sin, 5);     // ib
        expect(result[3]).toBeCloseTo(sin, 5);      // ic
        expect(result[4]).toBeCloseTo(cos, 5);      // id
    });

    it("should compute inverse of combined transformation", () =>
    {
        // scale(2, 2) + translate(10, 20)
        const matrix = new Float32Array([2, 0, 0, 2, 10, 20]);

        const result = execute(matrix);

        // Verify by checking that M * M^-1 = I conceptually
        // Inverse: scale(0.5) then translate(-5, -10)
        expect(result[0]).toBeCloseTo(0.5, 5);
        expect(result[4]).toBeCloseTo(0.5, 5);
        expect(result[6]).toBeCloseTo(-5, 5);       // itx = (c*ty - d*tx) / det = (0*20 - 2*10) / 4 = -5
        expect(result[7]).toBeCloseTo(-10, 5);      // ity = (b*tx - a*ty) / det = (0*10 - 2*20) / 4 = -10
    });

    it("should return identity for singular matrix", () =>
    {
        // Singular matrix (determinant = 0)
        const matrix = new Float32Array([1, 2, 2, 4, 0, 0]); // a*d - b*c = 4 - 4 = 0

        const result = execute(matrix);

        // Should return identity matrix
        expect(result[0]).toBe(1);
        expect(result[1]).toBe(0);
        expect(result[2]).toBe(0);
        expect(result[3]).toBe(0);
        expect(result[4]).toBe(1);
        expect(result[5]).toBe(0);
        expect(result[6]).toBe(0);
        expect(result[7]).toBe(0);
        expect(result[8]).toBe(1);
    });

    it("should return identity for near-singular matrix", () =>
    {
        // Near-singular matrix (determinant very close to 0)
        const matrix = new Float32Array([1e-11, 0, 0, 1e-11, 0, 0]);

        const result = execute(matrix);

        // Should return identity matrix (det < 1e-10)
        expect(result[0]).toBe(1);
        expect(result[4]).toBe(1);
        expect(result[8]).toBe(1);
    });

    it("should return Float32Array with 9 elements", () =>
    {
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);

        const result = execute(matrix);

        expect(result).toBeInstanceOf(Float32Array);
        expect(result.length).toBe(9);
    });

    it("should handle negative scale", () =>
    {
        const matrix = new Float32Array([-2, 0, 0, -2, 0, 0]); // scale(-2, -2)

        const result = execute(matrix);

        expect(result[0]).toBeCloseTo(-0.5, 5);     // ia = d / det = -2 / 4 = -0.5
        expect(result[4]).toBeCloseTo(-0.5, 5);     // id = a / det = -2 / 4 = -0.5
    });

    it("should handle skew transformation", () =>
    {
        // Skew matrix: [1, 0.5, 0.5, 1, 0, 0]
        const matrix = new Float32Array([1, 0.5, 0.5, 1, 0, 0]);

        const result = execute(matrix);

        // det = 1*1 - 0.5*0.5 = 0.75
        const det = 0.75;
        expect(result[0]).toBeCloseTo(1 / det, 5);       // ia = d / det
        expect(result[1]).toBeCloseTo(-0.5 / det, 5);    // ib = -b / det
        expect(result[3]).toBeCloseTo(-0.5 / det, 5);    // ic = -c / det
        expect(result[4]).toBeCloseTo(1 / det, 5);       // id = a / det
    });

    it("should compute correct 3x3 matrix format", () =>
    {
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);

        const result = execute(matrix);

        // Verify 3x3 matrix structure:
        // [ia, ib, 0]
        // [ic, id, 0]
        // [itx, ity, 1]
        expect(result[2]).toBe(0);  // row 1, col 3
        expect(result[5]).toBe(0);  // row 2, col 3
        expect(result[8]).toBe(1);  // row 3, col 3
    });
});
