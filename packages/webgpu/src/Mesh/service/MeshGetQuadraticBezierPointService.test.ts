import { describe, it, expect } from "vitest";
import { execute } from "./MeshGetQuadraticBezierPointService";

describe("MeshGetQuadraticBezierPointService", () =>
{
    it("should return start point at t=0", () =>
    {
        const start = { "x": 0, "y": 0 };
        const control = { "x": 50, "y": 100 };
        const end = { "x": 100, "y": 0 };

        const result = execute(0, start, control, end);

        expect(result.x).toBeCloseTo(0, 5);
        expect(result.y).toBeCloseTo(0, 5);
    });

    it("should return end point at t=1", () =>
    {
        const start = { "x": 0, "y": 0 };
        const control = { "x": 50, "y": 100 };
        const end = { "x": 100, "y": 0 };

        const result = execute(1, start, control, end);

        expect(result.x).toBeCloseTo(100, 5);
        expect(result.y).toBeCloseTo(0, 5);
    });

    it("should return midpoint at t=0.5 for symmetric curve", () =>
    {
        const start = { "x": 0, "y": 0 };
        const control = { "x": 50, "y": 100 };
        const end = { "x": 100, "y": 0 };

        const result = execute(0.5, start, control, end);

        // At t=0.5: (1-0.5)^2*0 + 2*(1-0.5)*0.5*50 + 0.5^2*100 = 50
        expect(result.x).toBeCloseTo(50, 5);
        // At t=0.5: (1-0.5)^2*0 + 2*(1-0.5)*0.5*100 + 0.5^2*0 = 50
        expect(result.y).toBeCloseTo(50, 5);
    });

    it("should calculate point on straight line", () =>
    {
        const start = { "x": 0, "y": 0 };
        const control = { "x": 50, "y": 50 };  // midpoint for straight line
        const end = { "x": 100, "y": 100 };

        const result = execute(0.5, start, control, end);

        expect(result.x).toBeCloseTo(50, 5);
        expect(result.y).toBeCloseTo(50, 5);
    });

    it("should handle negative coordinates", () =>
    {
        const start = { "x": -100, "y": -100 };
        const control = { "x": 0, "y": 0 };
        const end = { "x": 100, "y": 100 };

        const result = execute(0, start, control, end);
        expect(result.x).toBeCloseTo(-100, 5);
        expect(result.y).toBeCloseTo(-100, 5);

        const resultEnd = execute(1, start, control, end);
        expect(resultEnd.x).toBeCloseTo(100, 5);
        expect(resultEnd.y).toBeCloseTo(100, 5);
    });

    it("should interpolate at t=0.25", () =>
    {
        const start = { "x": 0, "y": 0 };
        const control = { "x": 0, "y": 100 };
        const end = { "x": 100, "y": 100 };

        const result = execute(0.25, start, control, end);

        // B(0.25) = (0.75)^2 * (0,0) + 2 * 0.75 * 0.25 * (0,100) + (0.25)^2 * (100,100)
        // x = 0 + 0 + 0.0625 * 100 = 6.25
        // y = 0 + 0.375 * 100 + 0.0625 * 100 = 43.75
        expect(result.x).toBeCloseTo(6.25, 5);
        expect(result.y).toBeCloseTo(43.75, 5);
    });
});
