import { describe, it, expect } from "vitest";
import { execute } from "./ContextComputeGradientMatrixService";

describe("ContextComputeGradientMatrixService", () =>
{
    describe("Linear gradient (type = 0)", () =>
    {
        it("should return identity inverse matrix for linear gradient", () =>
        {
            const gradientMatrix = new Float32Array([1, 0, 0, 1, 0, 0]);
            const contextMatrix = new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);

            const result = execute(gradientMatrix, contextMatrix, 0);

            // For linear gradient, inverseMatrix is always identity
            expect(result.inverseMatrix[0]).toBe(1);
            expect(result.inverseMatrix[1]).toBe(0);
            expect(result.inverseMatrix[2]).toBe(0);
            expect(result.inverseMatrix[3]).toBe(0);
            expect(result.inverseMatrix[4]).toBe(1);
            expect(result.inverseMatrix[5]).toBe(0);
            expect(result.inverseMatrix[6]).toBe(0);
            expect(result.inverseMatrix[7]).toBe(0);
            expect(result.inverseMatrix[8]).toBe(1);
        });

        it("should compute linear points for identity gradient matrix", () =>
        {
            const gradientMatrix = new Float32Array([1, 0, 0, 1, 0, 0]);
            const contextMatrix = new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);

            const result = execute(gradientMatrix, contextMatrix, 0);

            expect(result.linearPoints).not.toBeNull();
            expect(result.linearPoints).toBeInstanceOf(Float32Array);
            expect(result.linearPoints!.length).toBe(4);
        });

        it("should compute linear points with scaled gradient matrix", () =>
        {
            const gradientMatrix = new Float32Array([2, 0, 0, 2, 0, 0]);
            const contextMatrix = new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);

            const result = execute(gradientMatrix, contextMatrix, 0);

            expect(result.linearPoints).not.toBeNull();
            // Points are scaled by factor of 2
            // x0 = -819.2 * 2 - 819.2 * 0 + 0 = -1638.4
            // y0 = -819.2 * 0 - 819.2 * 2 + 0 = -1638.4
        });

        it("should compute linear points with translated gradient matrix", () =>
        {
            const gradientMatrix = new Float32Array([1, 0, 0, 1, 100, 200]);
            const contextMatrix = new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);

            const result = execute(gradientMatrix, contextMatrix, 0);

            expect(result.linearPoints).not.toBeNull();
            // Translation affects the computed points
        });

        it("should handle rotated gradient matrix for linear", () =>
        {
            const angle = Math.PI / 4;
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);
            const gradientMatrix = new Float32Array([cos, sin, -sin, cos, 0, 0]);
            const contextMatrix = new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);

            const result = execute(gradientMatrix, contextMatrix, 0);

            expect(result.linearPoints).not.toBeNull();
            expect(result.inverseMatrix).toBeInstanceOf(Float32Array);
        });
    });

    describe("Radial gradient (type = 1)", () =>
    {
        it("should compute inverse gradient matrix for radial", () =>
        {
            const gradientMatrix = new Float32Array([2, 0, 0, 2, 0, 0]);
            const contextMatrix = new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);

            const result = execute(gradientMatrix, contextMatrix, 1);

            // Inverse of scale(2, 2): scale(0.5, 0.5)
            expect(result.inverseMatrix[0]).toBeCloseTo(0.5, 5);  // invA = d / det = 2 / 4
            expect(result.inverseMatrix[1]).toBeCloseTo(0, 5);    // invB
            expect(result.inverseMatrix[3]).toBeCloseTo(0, 5);    // invC
            expect(result.inverseMatrix[4]).toBeCloseTo(0.5, 5);  // invD = a / det = 2 / 4
            expect(result.linearPoints).toBeNull();
        });

        it("should compute inverse for translated gradient", () =>
        {
            const gradientMatrix = new Float32Array([1, 0, 0, 1, 100, 200]);
            const contextMatrix = new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);

            const result = execute(gradientMatrix, contextMatrix, 1);

            // det = 1
            expect(result.inverseMatrix[0]).toBeCloseTo(1, 5);
            expect(result.inverseMatrix[4]).toBeCloseTo(1, 5);
            // invTx = (c * ty - d * tx) / det = (0 * 200 - 1 * 100) / 1 = -100
            expect(result.inverseMatrix[6]).toBeCloseTo(-100, 5);
            // invTy = (b * tx - a * ty) / det = (0 * 100 - 1 * 200) / 1 = -200
            expect(result.inverseMatrix[7]).toBeCloseTo(-200, 5);
            expect(result.linearPoints).toBeNull();
        });

        it("should return identity for singular gradient matrix", () =>
        {
            const gradientMatrix = new Float32Array([1, 2, 2, 4, 0, 0]); // det = 0
            const contextMatrix = new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);

            const result = execute(gradientMatrix, contextMatrix, 1);

            // Returns identity for singular matrix
            expect(result.inverseMatrix[0]).toBe(1);
            expect(result.inverseMatrix[1]).toBe(0);
            expect(result.inverseMatrix[2]).toBe(0);
            expect(result.inverseMatrix[3]).toBe(0);
            expect(result.inverseMatrix[4]).toBe(1);
            expect(result.inverseMatrix[5]).toBe(0);
            expect(result.inverseMatrix[6]).toBe(0);
            expect(result.inverseMatrix[7]).toBe(0);
            expect(result.inverseMatrix[8]).toBe(1);
            expect(result.linearPoints).toBeNull();
        });

        it("should return identity for near-singular gradient matrix", () =>
        {
            const gradientMatrix = new Float32Array([1e-11, 0, 0, 1e-11, 0, 0]);
            const contextMatrix = new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);

            const result = execute(gradientMatrix, contextMatrix, 1);

            expect(result.inverseMatrix[0]).toBe(1);
            expect(result.inverseMatrix[4]).toBe(1);
            expect(result.inverseMatrix[8]).toBe(1);
        });

        it("should handle rotated gradient matrix for radial", () =>
        {
            const angle = Math.PI / 2; // 90 degrees
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);
            const gradientMatrix = new Float32Array([cos, sin, -sin, cos, 0, 0]);
            const contextMatrix = new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);

            const result = execute(gradientMatrix, contextMatrix, 1);

            // det = cos^2 + sin^2 = 1
            // Inverse of rotation by 90° is rotation by -90°
            expect(result.inverseMatrix[0]).toBeCloseTo(cos, 5);   // invA = d / det
            expect(result.inverseMatrix[1]).toBeCloseTo(-sin, 5);  // invB = -b / det
            expect(result.inverseMatrix[3]).toBeCloseTo(sin, 5);   // invC = -c / det
            expect(result.inverseMatrix[4]).toBeCloseTo(cos, 5);   // invD = a / det
        });

        it("should compute inverse for combined scale and translation", () =>
        {
            const gradientMatrix = new Float32Array([2, 0, 0, 3, 10, 20]);
            const contextMatrix = new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);

            const result = execute(gradientMatrix, contextMatrix, 1);

            // det = 2 * 3 - 0 * 0 = 6
            expect(result.inverseMatrix[0]).toBeCloseTo(3 / 6, 5);  // invA = d / det = 0.5
            expect(result.inverseMatrix[4]).toBeCloseTo(2 / 6, 5);  // invD = a / det = 1/3
            // invTx = (c * ty - d * tx) / det = (0 * 20 - 3 * 10) / 6 = -5
            expect(result.inverseMatrix[6]).toBeCloseTo(-5, 5);
            // invTy = (b * tx - a * ty) / det = (0 * 10 - 2 * 20) / 6 = -40/6
            expect(result.inverseMatrix[7]).toBeCloseTo(-40 / 6, 5);
        });
    });

    describe("Return type validation", () =>
    {
        it("should return object with correct properties for linear", () =>
        {
            const gradientMatrix = new Float32Array([1, 0, 0, 1, 0, 0]);
            const contextMatrix = new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);

            const result = execute(gradientMatrix, contextMatrix, 0);

            expect(result).toHaveProperty("inverseMatrix");
            expect(result).toHaveProperty("linearPoints");
            expect(result.inverseMatrix).toBeInstanceOf(Float32Array);
            expect(result.linearPoints).toBeInstanceOf(Float32Array);
        });

        it("should return object with correct properties for radial", () =>
        {
            const gradientMatrix = new Float32Array([1, 0, 0, 1, 0, 0]);
            const contextMatrix = new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);

            const result = execute(gradientMatrix, contextMatrix, 1);

            expect(result).toHaveProperty("inverseMatrix");
            expect(result).toHaveProperty("linearPoints");
            expect(result.inverseMatrix).toBeInstanceOf(Float32Array);
            expect(result.linearPoints).toBeNull();
        });

        it("should return 9-element inverse matrix", () =>
        {
            const gradientMatrix = new Float32Array([1, 0, 0, 1, 0, 0]);
            const contextMatrix = new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);

            const result = execute(gradientMatrix, contextMatrix, 1);

            expect(result.inverseMatrix.length).toBe(9);
        });

        it("should return 4-element linear points for linear gradient", () =>
        {
            const gradientMatrix = new Float32Array([1, 0, 0, 1, 0, 0]);
            const contextMatrix = new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);

            const result = execute(gradientMatrix, contextMatrix, 0);

            expect(result.linearPoints!.length).toBe(4);
        });
    });

    describe("Edge cases", () =>
    {
        it("should handle very large gradient values", () =>
        {
            const gradientMatrix = new Float32Array([1000, 0, 0, 1000, 10000, 10000]);
            const contextMatrix = new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);

            const result = execute(gradientMatrix, contextMatrix, 1);

            expect(result.inverseMatrix).toBeInstanceOf(Float32Array);
            expect(result.inverseMatrix[0]).toBeCloseTo(0.001, 5);
        });

        it("should handle very small non-singular gradient values", () =>
        {
            const gradientMatrix = new Float32Array([0.001, 0, 0, 0.001, 0, 0]);
            const contextMatrix = new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);

            const result = execute(gradientMatrix, contextMatrix, 1);

            expect(result.inverseMatrix[0]).toBeCloseTo(1000, 1);
        });

        it("should handle negative gradient scale", () =>
        {
            const gradientMatrix = new Float32Array([-1, 0, 0, -1, 0, 0]);
            const contextMatrix = new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);

            const result = execute(gradientMatrix, contextMatrix, 1);

            // det = (-1) * (-1) - 0 * 0 = 1
            expect(result.inverseMatrix[0]).toBeCloseTo(-1, 5);
            expect(result.inverseMatrix[4]).toBeCloseTo(-1, 5);
        });

        it("should handle zero vector normalization in linear gradient", () =>
        {
            // When vx2 and vy2 are both 0, normalization sets them to 0
            // This happens when x2 = x0 and y2 = y0
            // With gc = 0 and gd = 0, the calculation becomes:
            // x2 - x0 = (-819.2 * ga + 819.2 * 0) - (-819.2 * ga - 819.2 * 0) = 0
            // y2 - y0 = (-819.2 * gb + 819.2 * 0) - (-819.2 * gb - 819.2 * 0) = 0
            const gradientMatrix = new Float32Array([1, 0, 0, 0, 0, 0]);
            const contextMatrix = new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);

            expect(() => execute(gradientMatrix, contextMatrix, 0)).not.toThrow();
        });
    });
});
