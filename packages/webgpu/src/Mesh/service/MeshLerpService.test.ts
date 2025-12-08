import { execute } from "./MeshLerpService";
import { describe, expect, it } from "vitest";

describe("MeshLerpService.ts method test", () =>
{
    it("test case - lerp at t=0 returns first point", () =>
    {
        const pointA = { x: 0, y: 0 };
        const pointB = { x: 10, y: 10 };

        const result = execute(pointA, pointB, 0);

        expect(result.x).toBe(0);
        expect(result.y).toBe(0);
    });

    it("test case - lerp at t=1 returns second point", () =>
    {
        const pointA = { x: 0, y: 0 };
        const pointB = { x: 10, y: 10 };

        const result = execute(pointA, pointB, 1);

        expect(result.x).toBe(10);
        expect(result.y).toBe(10);
    });

    it("test case - lerp at t=0.5 returns midpoint", () =>
    {
        const pointA = { x: 0, y: 0 };
        const pointB = { x: 10, y: 20 };

        const result = execute(pointA, pointB, 0.5);

        expect(result.x).toBe(5);
        expect(result.y).toBe(10);
    });

    it("test case - lerp at t=0.25", () =>
    {
        const pointA = { x: 0, y: 0 };
        const pointB = { x: 100, y: 200 };

        const result = execute(pointA, pointB, 0.25);

        expect(result.x).toBe(25);
        expect(result.y).toBe(50);
    });
});
