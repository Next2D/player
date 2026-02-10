import { execute } from "./GradientLUTParseStopsService";
import { describe, expect, it } from "vitest";

describe("GradientLUTParseStopsService.ts method test", () =>
{
    it("test case - parse single stop", () =>
    {
        const stops = [0.5, 1, 0, 0, 1]; // ratio=0.5, r=1, g=0, b=0, a=1

        const result = execute(stops);

        expect(result.length).toBe(1);
        expect(result[0].ratio).toBe(0.5);
        expect(result[0].r).toBe(1);
        expect(result[0].g).toBe(0);
        expect(result[0].b).toBe(0);
        expect(result[0].a).toBe(1);
    });

    it("test case - parse multiple stops", () =>
    {
        const stops = [
            0, 1, 0, 0, 1,   // ratio=0, red
            1, 0, 0, 1, 1    // ratio=1, blue
        ];

        const result = execute(stops);

        expect(result.length).toBe(2);
        expect(result[0].ratio).toBe(0);
        expect(result[1].ratio).toBe(1);
    });

    it("test case - sorts stops by ratio", () =>
    {
        const stops = [
            1, 0, 0, 1, 1,   // ratio=1
            0.5, 0, 1, 0, 1, // ratio=0.5
            0, 1, 0, 0, 1    // ratio=0
        ];

        const result = execute(stops);

        expect(result.length).toBe(3);
        expect(result[0].ratio).toBe(0);
        expect(result[1].ratio).toBe(0.5);
        expect(result[2].ratio).toBe(1);
    });

    it("test case - empty stops", () =>
    {
        const stops: number[] = [];

        const result = execute(stops);

        expect(result.length).toBe(0);
    });
});
