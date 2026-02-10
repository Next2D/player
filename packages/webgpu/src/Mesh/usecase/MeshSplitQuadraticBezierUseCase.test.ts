import { describe, it, expect } from "vitest";
import { execute } from "./MeshSplitQuadraticBezierUseCase";

describe("MeshSplitQuadraticBezierUseCase", () =>
{
    describe("basic splitting", () =>
    {
        it("should split a simple quadratic bezier at t=0.5", () =>
        {
            const start = { x: 0, y: 0 };
            const control = { x: 50, y: 100 };
            const end = { x: 100, y: 0 };

            const result = execute(start, control, end, 0.5);

            expect(result).toHaveLength(2);
            expect(result[0]).toHaveLength(3);
            expect(result[1]).toHaveLength(3);
        });

        it("should use default t=0.5 when not specified", () =>
        {
            const start = { x: 0, y: 0 };
            const control = { x: 50, y: 100 };
            const end = { x: 100, y: 0 };

            const result = execute(start, control, end);

            expect(result).toHaveLength(2);
        });

        it("should preserve start point in left sub-curve", () =>
        {
            const start = { x: 10, y: 20 };
            const control = { x: 50, y: 100 };
            const end = { x: 100, y: 0 };

            const result = execute(start, control, end, 0.5);

            expect(result[0][0]).toEqual(start);
        });

        it("should preserve end point in right sub-curve", () =>
        {
            const start = { x: 0, y: 0 };
            const control = { x: 50, y: 100 };
            const end = { x: 90, y: 30 };

            const result = execute(start, control, end, 0.5);

            expect(result[1][2]).toEqual(end);
        });

        it("should share the split point between curves", () =>
        {
            const start = { x: 0, y: 0 };
            const control = { x: 50, y: 100 };
            const end = { x: 100, y: 0 };

            const result = execute(start, control, end, 0.5);

            // M01 (split point) is last of left and first of right
            expect(result[0][2]).toEqual(result[1][0]);
        });
    });

    describe("split at t=0.5", () =>
    {
        it("should compute correct intermediate points", () =>
        {
            const start = { x: 0, y: 0 };
            const control = { x: 100, y: 200 };
            const end = { x: 200, y: 0 };

            const result = execute(start, control, end, 0.5);

            // M0 = lerp(P0, P1, 0.5) = (50, 100)
            // M1 = lerp(P1, P2, 0.5) = (150, 100)
            // M01 = lerp(M0, M1, 0.5) = (100, 100)

            // Left curve: [P0, M0, M01] = [(0,0), (50,100), (100,100)]
            expect(result[0][0]).toEqual({ x: 0, y: 0 });
            expect(result[0][1]).toEqual({ x: 50, y: 100 });
            expect(result[0][2]).toEqual({ x: 100, y: 100 });

            // Right curve: [M01, M1, P2] = [(100,100), (150,100), (200,0)]
            expect(result[1][0]).toEqual({ x: 100, y: 100 });
            expect(result[1][1]).toEqual({ x: 150, y: 100 });
            expect(result[1][2]).toEqual({ x: 200, y: 0 });
        });
    });

    describe("split at different t values", () =>
    {
        it("should correctly split at t=0.25", () =>
        {
            const start = { x: 0, y: 0 };
            const control = { x: 100, y: 0 };
            const end = { x: 100, y: 100 };

            const result = execute(start, control, end, 0.25);

            // M0 = lerp(P0, P1, 0.25) = (25, 0)
            // M1 = lerp(P1, P2, 0.25) = (100, 25)
            // M01 = lerp(M0, M1, 0.25) = (25 + (100-25)*0.25, 0 + (25-0)*0.25) = (43.75, 6.25)

            expect(result[0][1].x).toBeCloseTo(25, 5);
            expect(result[0][1].y).toBeCloseTo(0, 5);

            expect(result[1][1].x).toBeCloseTo(100, 5);
            expect(result[1][1].y).toBeCloseTo(25, 5);
        });

        it("should correctly split at t=0.75", () =>
        {
            const start = { x: 0, y: 0 };
            const control = { x: 100, y: 0 };
            const end = { x: 100, y: 100 };

            const result = execute(start, control, end, 0.75);

            // M0 = lerp(P0, P1, 0.75) = (75, 0)
            // M1 = lerp(P1, P2, 0.75) = (100, 75)

            expect(result[0][1].x).toBeCloseTo(75, 5);
            expect(result[0][1].y).toBeCloseTo(0, 5);

            expect(result[1][1].x).toBeCloseTo(100, 5);
            expect(result[1][1].y).toBeCloseTo(75, 5);
        });

        it("should handle t=0 (split at start)", () =>
        {
            const start = { x: 0, y: 0 };
            const control = { x: 50, y: 100 };
            const end = { x: 100, y: 0 };

            const result = execute(start, control, end, 0);

            // At t=0, split point is at start
            expect(result[0][2]).toEqual(start);
            expect(result[1][0]).toEqual(start);
        });

        it("should handle t=1 (split at end)", () =>
        {
            const start = { x: 0, y: 0 };
            const control = { x: 50, y: 100 };
            const end = { x: 100, y: 0 };

            const result = execute(start, control, end, 1);

            // At t=1, split point is at end
            expect(result[0][2]).toEqual(end);
            expect(result[1][0]).toEqual(end);
        });
    });

    describe("edge cases", () =>
    {
        it("should handle horizontal line (control on line)", () =>
        {
            const start = { x: 0, y: 50 };
            const control = { x: 50, y: 50 };
            const end = { x: 100, y: 50 };

            const result = execute(start, control, end, 0.5);

            // All y values should remain 50
            expect(result[0][0].y).toBe(50);
            expect(result[0][1].y).toBe(50);
            expect(result[0][2].y).toBe(50);
            expect(result[1][1].y).toBe(50);
            expect(result[1][2].y).toBe(50);
        });

        it("should handle vertical line", () =>
        {
            const start = { x: 50, y: 0 };
            const control = { x: 50, y: 50 };
            const end = { x: 50, y: 100 };

            const result = execute(start, control, end, 0.5);

            // All x values should remain 50
            expect(result[0][0].x).toBe(50);
            expect(result[0][1].x).toBe(50);
            expect(result[0][2].x).toBe(50);
            expect(result[1][1].x).toBe(50);
            expect(result[1][2].x).toBe(50);
        });

        it("should handle single point curve", () =>
        {
            const point = { x: 50, y: 50 };

            const result = execute(point, point, point, 0.5);

            // All points should be the same
            expect(result[0][0]).toEqual(point);
            expect(result[0][1]).toEqual(point);
            expect(result[0][2]).toEqual(point);
            expect(result[1][0]).toEqual(point);
            expect(result[1][1]).toEqual(point);
            expect(result[1][2]).toEqual(point);
        });

        it("should handle negative coordinates", () =>
        {
            const start = { x: -100, y: -100 };
            const control = { x: 0, y: 100 };
            const end = { x: 100, y: -100 };

            const result = execute(start, control, end, 0.5);

            expect(result).toHaveLength(2);
            expect(result[0][0]).toEqual(start);
            expect(result[1][2]).toEqual(end);
        });

        it("should handle very small t value", () =>
        {
            const start = { x: 0, y: 0 };
            const control = { x: 50, y: 100 };
            const end = { x: 100, y: 0 };

            const result = execute(start, control, end, 0.001);

            // Split point should be much closer to start than to end
            // At t=0.001, we expect very small values
            expect(result[0][2].x).toBeLessThan(1);
            expect(result[0][2].y).toBeLessThan(1);
        });

        it("should handle very large coordinates", () =>
        {
            const start = { x: 0, y: 0 };
            const control = { x: 100000, y: 200000 };
            const end = { x: 200000, y: 0 };

            const result = execute(start, control, end, 0.5);

            expect(result[0][1].x).toBeCloseTo(50000, 0);
            expect(result[0][1].y).toBeCloseTo(100000, 0);
        });
    });
});
