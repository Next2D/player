import { Graphics } from "../../Graphics";
import { execute } from "./GraphicsCalcBoundsUseCase";
import { describe, expect, it, beforeEach } from "vitest";

describe("GraphicsCalcBoundsUseCase.js test", () =>
{
    let graphics: Graphics;

    beforeEach(() =>
    {
        graphics = new Graphics();
    });

    it("execute test case1 - single point without line", () =>
    {
        expect(graphics.xMin).toBe(Number.MAX_VALUE);
        expect(graphics.yMin).toBe(Number.MAX_VALUE);
        expect(graphics.xMax).toBe(-Number.MAX_VALUE);
        expect(graphics.yMax).toBe(-Number.MAX_VALUE);

        execute(graphics, false, 0, 0, 0, "none", 10, 20);

        expect(graphics.xMin).toBe(10);
        expect(graphics.yMin).toBe(20);
        expect(graphics.xMax).toBe(10);
        expect(graphics.yMax).toBe(20);
    });

    it("execute test case2 - multiple points without line", () =>
    {
        execute(graphics, false, 0, 0, 0, "none", 10, 20, 30, 40, 50, 60);

        expect(graphics.xMin).toBe(10);
        expect(graphics.yMin).toBe(20);
        expect(graphics.xMax).toBe(50);
        expect(graphics.yMax).toBe(60);
    });

    it("execute test case3 - negative coordinates without line", () =>
    {
        execute(graphics, false, 0, 0, 0, "none", -10, -20, 30, 40);

        expect(graphics.xMin).toBe(-10);
        expect(graphics.yMin).toBe(-20);
        expect(graphics.xMax).toBe(30);
        expect(graphics.yMax).toBe(40);
    });

    it("execute test case4 - single point with line enabled", () =>
    {
        execute(graphics, true, 0, 0, 5, "none", 10, 20);

        // Line bounds should be calculated from position (0, 0) to point (10, 20)
        // and back, extending bounds by line width
        expect(graphics.xMin).toBeLessThanOrEqual(0);
        expect(graphics.yMin).toBeLessThanOrEqual(0);
        expect(graphics.xMax).toBeGreaterThanOrEqual(10);
        expect(graphics.yMax).toBeGreaterThanOrEqual(20);
    });

    it("execute test case5 - multiple points with line enabled", () =>
    {
        execute(graphics, true, 5, 5, 2, "none", 10, 10, 20, 20);

        // Line bounds calculation should extend the bounds
        expect(graphics.xMin).toBeLessThanOrEqual(5);
        expect(graphics.yMin).toBeLessThanOrEqual(5);
        expect(graphics.xMax).toBeGreaterThanOrEqual(20);
        expect(graphics.yMax).toBeGreaterThanOrEqual(20);
    });

    it("execute test case6 - line with round caps", () =>
    {
        execute(graphics, true, 0, 0, 10, "round", 100, 100);

        // Round caps should extend bounds further than square caps
        expect(graphics.xMin).toBeLessThan(0);
        expect(graphics.yMin).toBeLessThan(0);
        expect(graphics.xMax).toBeGreaterThan(100);
        expect(graphics.yMax).toBeGreaterThan(100);
    });

    it("execute test case7 - line with square caps", () =>
    {
        execute(graphics, true, 0, 0, 10, "square", 100, 100);

        // Square caps should extend bounds
        expect(graphics.xMin).toBeLessThanOrEqual(0);
        expect(graphics.yMin).toBeLessThanOrEqual(0);
        expect(graphics.xMax).toBeGreaterThanOrEqual(100);
        expect(graphics.yMax).toBeGreaterThanOrEqual(100);
    });

    it("execute test case8 - no points (empty args)", () =>
    {
        execute(graphics, false, 0, 0, 0, "none");

        // Bounds should remain at initial values
        expect(graphics.xMin).toBe(Number.MAX_VALUE);
        expect(graphics.yMin).toBe(Number.MAX_VALUE);
        expect(graphics.xMax).toBe(-Number.MAX_VALUE);
        expect(graphics.yMax).toBe(-Number.MAX_VALUE);
    });

    it("execute test case9 - zero line width with line enabled", () =>
    {
        execute(graphics, true, 10, 10, 0, "none", 20, 20);

        // Even with zero line width, fill bounds should be calculated
        expect(graphics.xMin).toBeLessThanOrEqual(10);
        expect(graphics.yMin).toBeLessThanOrEqual(10);
        expect(graphics.xMax).toBeGreaterThanOrEqual(20);
        expect(graphics.yMax).toBeGreaterThanOrEqual(20);
    });

    it("execute test case10 - large line width", () =>
    {
        execute(graphics, true, 50, 50, 20, "none", 100, 100);

        // Large line width should significantly extend bounds
        const xRange = graphics.xMax - graphics.xMin;
        const yRange = graphics.yMax - graphics.yMin;

        expect(xRange).toBeGreaterThan(50);
        expect(yRange).toBeGreaterThan(50);
    });

    it("execute test case11 - sequential calls accumulate bounds", () =>
    {
        execute(graphics, false, 0, 0, 0, "none", 10, 10);
        
        expect(graphics.xMin).toBe(10);
        expect(graphics.yMin).toBe(10);
        expect(graphics.xMax).toBe(10);
        expect(graphics.yMax).toBe(10);

        execute(graphics, false, 0, 0, 0, "none", 50, 50);

        expect(graphics.xMin).toBe(10);
        expect(graphics.yMin).toBe(10);
        expect(graphics.xMax).toBe(50);
        expect(graphics.yMax).toBe(50);

        execute(graphics, false, 0, 0, 0, "none", 5, 5);

        expect(graphics.xMin).toBe(5);
        expect(graphics.yMin).toBe(5);
        expect(graphics.xMax).toBe(50);
        expect(graphics.yMax).toBe(50);
    });

    it("execute test case12 - default parameter values", () =>
    {
        // Test with minimal parameters, relying on defaults
        execute(graphics, false, undefined, undefined, undefined, undefined, 15, 25);

        expect(graphics.xMin).toBe(15);
        expect(graphics.yMin).toBe(25);
        expect(graphics.xMax).toBe(15);
        expect(graphics.yMax).toBe(25);
    });

    it("execute test case13 - odd number of coordinates (should process pairs)", () =>
    {
        // Pass odd number of args - last value should be ignored
        // as the function processes pairs of x,y
        execute(graphics, false, 0, 0, 0, "none", 10, 20, 30, 40, 50);

        // (10,20) and (30,40) should be processed
        // The incomplete pair (50, undefined) will result in NaN for y
        expect(graphics.xMin).toBeLessThanOrEqual(10);
        expect(graphics.xMax).toBeGreaterThanOrEqual(30);
        // Since NaN is involved, just check that bounds were updated
        expect(graphics.xMin).not.toBe(Number.MAX_VALUE);
        expect(graphics.xMax).not.toBe(-Number.MAX_VALUE);
    });

    it("execute test case14 - horizontal line with line enabled", () =>
    {
        execute(graphics, true, 0, 50, 4, "none", 100, 50);

        // Horizontal line should extend bounds in x direction
        expect(graphics.xMin).toBeLessThanOrEqual(0);
        expect(graphics.xMax).toBeGreaterThanOrEqual(100);
        // Y bounds should be around 50, extended by line width
        expect(graphics.yMin).toBeLessThan(50);
        expect(graphics.yMax).toBeGreaterThan(50);
    });

    it("execute test case15 - vertical line with line enabled", () =>
    {
        execute(graphics, true, 50, 0, 4, "none", 50, 100);

        // Vertical line should extend bounds in y direction
        expect(graphics.yMin).toBeLessThanOrEqual(0);
        expect(graphics.yMax).toBeGreaterThanOrEqual(100);
        // X bounds should be around 50, extended by line width
        expect(graphics.xMin).toBeLessThan(50);
        expect(graphics.xMax).toBeGreaterThan(50);
    });
});
