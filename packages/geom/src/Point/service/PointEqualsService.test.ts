import { Point } from "../../Point";
import { describe, expect, it } from "vitest";

describe("Point.js equals test", () =>
{

    it("equals test case1", () =>
    {
        const p1 = new Point(10, 10);
        const p2 = new Point(10, 10);
        const p3 = new Point(10, 20);
        const p4 = new Point(20, 10);
        const p5 = new Point(20, 20);

        expect(p1.equals(p2)).toBe(true);
        expect(p1.equals(p3)).toBe(false);
        expect(p1.equals(p4)).toBe(false);
        expect(p1.equals(p5)).toBe(false);
    });

    it("equals test case2", () =>
    {
        const p1 = new Point(-10, -10);
        const p2 = new Point(-10, -10);
        const p3 = new Point(-10, -20);
        const p4 = new Point(-20, -10);
        const p5 = new Point(-20, -20);

        expect(p1.equals(p2)).toBe(true);
        expect(p1.equals(p3)).toBe(false);
        expect(p1.equals(p4)).toBe(false);
        expect(p1.equals(p5)).toBe(false);
    });

    it("equals test case3", () =>
    {
        const p1 = new Point(1, 10);
        const p2 = new Point(1, 10);
        const p3 = new Point(1, 10);
        const p4 = new Point(0, 10);
        const p5 = new Point(1, 1);

        expect(p1.equals(p2)).toBe(true);
        expect(p1.equals(p3)).toBe(true);
        expect(p1.equals(p4)).toBe(false);
        expect(p1.equals(p5)).toBe(false);
    });

    it("equals test case4", () =>
    {
        const p1 = new Point(1, 10);
        const p2 = new Point(1, 10);
        const p3 = new Point(1, 10);
        const p4 = new Point(0, 10);
        const p5 = new Point(1, 0);

        expect(p1.equals(p2)).toBe(true);
        expect(p1.equals(p3)).toBe(true);
        expect(p1.equals(p4)).toBe(false);
        expect(p1.equals(p5)).toBe(false);
    });
});