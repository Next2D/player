import { Point } from "../../Point";
import { describe, expect, it } from "vitest";

describe("Point.js add test", () =>
{
    it("add test case1", () =>
    {
        const p1 = new Point(10, 10);
        const p2 = new Point(20, 20);

        const p3 = p1.add(p1);
        const p4 = p2.add(p2);
        const p5 = p1.add(p2);
        const p6 = p2.add(p1);

        expect(p3.x).toBe(20);
        expect(p3.y).toBe(20);
        expect(p4.x).toBe(40);
        expect(p4.y).toBe(40);
        expect(p5.x).toBe(30);
        expect(p5.y).toBe(30);
        expect(p6.x).toBe(30);
        expect(p6.y).toBe(30);
    });

    it("add test case2", () =>
    {
        const p1 = new Point(-10, -10);
        const p2 = new Point(20, -20);

        const p3 = p1.add(p1);
        const p4 = p2.add(p2);
        const p5 = p1.add(p2);
        const p6 = p2.add(p1);

        expect(p3.x).toBe(-20);
        expect(p3.y).toBe(-20);
        expect(p4.x).toBe(40);
        expect(p4.y).toBe(-40);
        expect(p5.x).toBe(10);
        expect(p5.y).toBe(-30);
        expect(p6.x).toBe(10);
        expect(p6.y).toBe(-30);
    });

    it("add test case3", () =>
    {
        const p1 = new Point(0, 10);
        const p2 = new Point(20, 0);

        const p3 = p1.add(p1);
        const p4 = p2.add(p2);
        const p5 = p1.add(p2);
        const p6 = p2.add(p1);
    
        expect(p3.x).toBe(0);
        expect(p3.y).toBe(20);
        expect(p4.x).toBe(40);
        expect(p4.y).toBe(0);
        expect(p5.x).toBe(20);
        expect(p5.y).toBe(10);
        expect(p6.x).toBe(20);
        expect(p6.y).toBe(10);
    });
});