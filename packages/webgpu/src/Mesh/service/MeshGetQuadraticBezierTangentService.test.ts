import { describe, it, expect } from "vitest";
import { execute } from "./MeshGetQuadraticBezierTangentService";

describe("MeshGetQuadraticBezierTangentService", () =>
{
    it("should return tangent at start (t=0)", () =>
    {
        const start = { "x": 0, "y": 0 };
        const control = { "x": 50, "y": 100 };
        const end = { "x": 100, "y": 0 };

        const result = execute(0, start, control, end);

        // At t=0: 2*(1-0)*(control - start) = 2*(50, 100) = (100, 200)
        expect(result.x).toBeCloseTo(100, 5);
        expect(result.y).toBeCloseTo(200, 5);
    });

    it("should return tangent at end (t=1)", () =>
    {
        const start = { "x": 0, "y": 0 };
        const control = { "x": 50, "y": 100 };
        const end = { "x": 100, "y": 0 };

        const result = execute(1, start, control, end);

        // At t=1: 2*1*(end - control) = 2*(50, -100) = (100, -200)
        expect(result.x).toBeCloseTo(100, 5);
        expect(result.y).toBeCloseTo(-200, 5);
    });

    it("should return tangent at midpoint (t=0.5)", () =>
    {
        const start = { "x": 0, "y": 0 };
        const control = { "x": 50, "y": 100 };
        const end = { "x": 100, "y": 0 };

        const result = execute(0.5, start, control, end);

        // At t=0.5: 2*0.5*(control-start) + 2*0.5*(end-control)
        // = (50, 100) + (50, -100) = (100, 0)
        expect(result.x).toBeCloseTo(100, 5);
        expect(result.y).toBeCloseTo(0, 5);
    });

    it("should return constant tangent for straight line", () =>
    {
        const start = { "x": 0, "y": 0 };
        const control = { "x": 50, "y": 50 };
        const end = { "x": 100, "y": 100 };

        const result0 = execute(0, start, control, end);
        const result05 = execute(0.5, start, control, end);
        const result1 = execute(1, start, control, end);

        // For a straight line, tangent direction is constant
        expect(result0.x).toBeCloseTo(result05.x, 5);
        expect(result0.y).toBeCloseTo(result05.y, 5);
        expect(result05.x).toBeCloseTo(result1.x, 5);
        expect(result05.y).toBeCloseTo(result1.y, 5);
    });

    it("should handle vertical curve", () =>
    {
        const start = { "x": 0, "y": 0 };
        const control = { "x": 0, "y": 50 };
        const end = { "x": 0, "y": 100 };

        const result = execute(0.5, start, control, end);

        // Pure vertical tangent
        expect(result.x).toBeCloseTo(0, 5);
        expect(result.y).toBeCloseTo(100, 5);
    });

    it("should handle horizontal curve", () =>
    {
        const start = { "x": 0, "y": 0 };
        const control = { "x": 50, "y": 0 };
        const end = { "x": 100, "y": 0 };

        const result = execute(0.5, start, control, end);

        // Pure horizontal tangent
        expect(result.x).toBeCloseTo(100, 5);
        expect(result.y).toBeCloseTo(0, 5);
    });
});
