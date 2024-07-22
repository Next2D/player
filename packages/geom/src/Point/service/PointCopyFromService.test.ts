import { Point } from "../../Point";
import { describe, expect, it } from "vitest";

describe("Point.js copyFrom test", () =>
{

    it("copyFrom test case1", () =>
    {
        const p1 = new Point(10, 10);
        const p2 = new Point(20, 20);

        p1.copyFrom(p2);
        p1.x = 10;

        expect(p1.toString()).toBe("(x=10, y=20)");
        expect(p2.toString()).toBe("(x=20, y=20)");
    });

    it("copyFrom test case2", () =>
    {
        const p1 = new Point(-10, -10);
        const p2 = new Point(20, -20);

        p1.copyFrom(p2);

        expect(p1.toString()).toBe("(x=20, y=-20)");
        expect(p2.toString()).toBe("(x=20, y=-20)");
    });

    it("copyFrom test case3", () =>
    {
        const p1 = new Point(0, 10);
        const p2 = new Point(20, 0);

        p1.copyFrom(p2);

        expect(p1.toString()).toBe("(x=20, y=0)");
        expect(p2.toString()).toBe("(x=20, y=0)");
    });

    it("copyFrom test case4", () =>
    {
        const p1 = new Point(10, 10);
        const p2 = new Point(0, 20);

        p1.copyFrom(p2);

        expect(p1.toString()).toBe("(x=0, y=20)");
        expect(p2.toString()).toBe("(x=0, y=20)");
    });

});