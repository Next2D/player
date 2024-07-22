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

        expect(p3.toString()).toBe("(x=20, y=20)");
        expect(p4.toString()).toBe("(x=40, y=40)");
        expect(p5.toString()).toBe("(x=30, y=30)");
        expect(p6.toString()).toBe("(x=30, y=30)");
    });

    it("add test case2", () =>
    {
        const p1 = new Point(-10, -10);
        const p2 = new Point(20, -20);

        const p3 = p1.add(p1);
        const p4 = p2.add(p2);
        const p5 = p1.add(p2);
        const p6 = p2.add(p1);

        expect(p3.toString()).toBe("(x=-20, y=-20)");
        expect(p4.toString()).toBe("(x=40, y=-40)");
        expect(p5.toString()).toBe("(x=10, y=-30)");
        expect(p6.toString()).toBe("(x=10, y=-30)");
    });

    it("add test case3", () =>
    {
        const p1 = new Point(0, 10);
        const p2 = new Point(20, 0);

        const p3 = p1.add(p1);
        const p4 = p2.add(p2);
        const p5 = p1.add(p2);
        const p6 = p2.add(p1);

        expect(p3.toString()).toBe("(x=0, y=20)");
        expect(p4.toString()).toBe("(x=40, y=0)");
        expect(p5.toString()).toBe("(x=20, y=10)");
        expect(p6.toString()).toBe("(x=20, y=10)");
    });

});