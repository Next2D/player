import { Point } from "../../Point";
import { describe, expect, it } from "vitest";

describe("Point.js polar test case", () =>
{

    it("polar test case1", () =>
    {
        const angle = Math.PI * 2 * (30 / 360); // 30 degrees
        const point = Point.polar(4, angle);

        expect(point.x).toBe(3.464101615137755);
        expect(point.y).toBe(1.9999999999999998);
    });

    it("polar test case2", () =>
    {
        const angle = Math.PI * 2 * (45 / 360); // 30 degrees
        const point = Point.polar(4, angle);

        expect(point.x | 0).toBe(2);
        expect(point.y | 0).toBe(2);

    });

    it("polar test case3", () =>
    {
        const angle = Math.PI * 2 * (90 / 360); // 30 degrees
        const point = Point.polar(4, angle);

        expect(point.x).toBe(2.4492935982947064e-16);
        expect(point.y).toBe(4);
    });

    it("polar test case4", () =>
    {
        const angle = Math.PI * 2 * (135 / 360); // 30 degrees
        const point = Point.polar(4, angle);

        expect(point.x).toBe(-2.82842712474619);
        expect(point.y).toBe(2.8284271247461903);
    });

    it("polar test case5", () =>
    {
        const angle = Math.PI * 2 * (180 / 360); // 30 degrees
        const point = Point.polar(4, angle);

        expect(point.x).toBe(-4);
        expect(point.y).toBe(4.898587196589413e-16);
    });

    it("polar test case6", () =>
    {
        const angle = Math.PI * 2 * (225 / 360); // 30 degrees
        const point = Point.polar(4, angle);

        expect(point.x).toBe(-2.8284271247461907);
        expect(point.y).toBe(-2.82842712474619);
    });

    it("polar test case7", () =>
    {
        const angle = Math.PI * 2 * (270 / 360); // 30 degrees
        const point = Point.polar(4, angle);

        expect(point.x).toBe(-7.347880794884119e-16);
        expect(point.y).toBe(-4);
    });

    it("polar test case8", () =>
    {
        const angle = Math.PI * 2 * (315 / 360); // 30 degrees
        const point = Point.polar(4, angle);
        if (point.x > 2.8284271247461894) {
            expect(point.x).toBe(2.82842712474619);
        } else {
            expect(point.x).toBe(2.8284271247461894);
        }
        expect(point.y).toBe(-2.8284271247461907);
    });

    it("polar test case9", () =>
    {
        const angle = Math.PI * 2 * (360 / 360); // 30 degrees
        const point = Point.polar(4, angle);

        expect(point.x).toBe(4);
        expect(point.y).toBe(-9.797174393178826e-16);
    });

    it("polar test case10", () =>
    {
        const angle = Math.PI * 2 * (-30 / 360); // 30 degrees
        const point = Point.polar(4, angle);

        expect(point.x).toBe(3.464101615137755);
        expect(point.y).toBe(-1.9999999999999998);
    });

    it("polar test case11", () =>
    {
        const angle = Math.PI * 2 * (-45 / 360); // 30 degrees
        const point = Point.polar(4, angle);
        expect(point.x | 0).toBe(2);
        expect(point.y | 0).toBe(-2);
    });

    it("polar test case12", () =>
    {
        const angle = Math.PI * 2 * (-90 / 360); // 30 degrees
        const point = Point.polar(4, angle);

        expect(point.x).toBe(2.4492935982947064e-16);
        expect(point.y).toBe(-4);
    });

    it("polar test case13", () =>
    {
        const angle = Math.PI * 2 * (-135 / 360); // 30 degrees
        const point = Point.polar(4, angle);

        expect(point.x).toBe(-2.82842712474619);
        expect(point.y).toBe(-2.8284271247461903);
    });

    it("polar test case14", () =>
    {
        const angle = Math.PI * 2 * (-180 / 360); // 30 degrees
        const point = Point.polar(4, angle);

        expect(point.x).toBe(-4);
        expect(point.y).toBe(-4.898587196589413e-16);
    });

    it("polar test case15", () =>
    {
        const angle = Math.PI * 2 * (-225 / 360); // 30 degrees
        const point = Point.polar(4, angle);

        expect(point.x).toBe(-2.8284271247461907);
        expect(point.y).toBe(2.82842712474619);
    });

    it("polar test case16", () =>
    {
        const angle = Math.PI * 2 * (-270 / 360); // 30 degrees
        const point = Point.polar(4, angle);

        expect(point.x).toBe(-7.347880794884119e-16);
        expect(point.y).toBe(4);
    });

    it("polar test case17", () =>
    {
        const angle = Math.PI * 2 * (-315 / 360); // 30 degrees
        const point = Point.polar(4, angle);
        if (point.x > 2.8284271247461894) {
            expect(point.x).toBe(2.82842712474619);
        } else {
            expect(point.x).toBe(2.8284271247461894);
        }
        expect(point.y).toBe(2.8284271247461907);
    });

    it("polar test case18", () =>
    {
        const angle = Math.PI * 2 * (-360 / 360); // 30 degrees
        const point = Point.polar(4, angle);

        expect(point.x).toBe(4);
        expect(point.y).toBe(9.797174393178826e-16);
    });

    it("polar test case19", () =>
    {
        const angle = Math.PI * 2 * (30 / 360); // 30 degrees
        const point = Point.polar(0, angle);

        expect(point.x).toBe(0);
        expect(point.y).toBe(0);
    });

    it("polar test case20", () =>
    {
        const angle = Math.PI * 2 * (30 / 360); // 30 degrees
        const point = Point.polar(-4, angle);

        expect(point.x).toBe(-3.464101615137755);
        expect(point.y).toBe(-1.9999999999999998);
    });
});
