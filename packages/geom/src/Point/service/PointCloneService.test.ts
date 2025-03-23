import { Point } from "../../Point";
import { describe, expect, it } from "vitest";

describe("Point.js property valid test and clone test", () =>
{
    it("clone test", function () {

        // origin
        const point1 = new Point(0, 0);

        // clone
        const point2 = point1.clone();
        point2.x = 10;
        point2.y = 20;

        // origin
        expect(point1.x).toBe(0);
        expect(point1.y).toBe(0);

        // clone
        expect(point2.x).toBe(10);
        expect(point2.y).toBe(20);
        expect(point2.length).toBe(22.360679774997898);

        expect(point2.x).toBe(10);
        expect(point2.y).toBe(20);
    });
});