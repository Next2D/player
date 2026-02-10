import { execute } from "./GradientLUTCalculateResolutionService";
import { describe, expect, it } from "vitest";

describe("GradientLUTCalculateResolutionService.ts method test", () =>
{
    it("test case - 2 stops returns 64", () =>
    {
        const result = execute(2);

        expect(result).toBe(64);
    });

    it("test case - 3 stops returns 128", () =>
    {
        const result = execute(3);

        expect(result).toBe(128);
    });

    it("test case - 4 stops returns 128", () =>
    {
        const result = execute(4);

        expect(result).toBe(128);
    });

    it("test case - 5 stops returns 256", () =>
    {
        const result = execute(5);

        expect(result).toBe(256);
    });

    it("test case - 8 stops returns 256", () =>
    {
        const result = execute(8);

        expect(result).toBe(256);
    });

    it("test case - 9 stops returns 512", () =>
    {
        const result = execute(9);

        expect(result).toBe(512);
    });

    it("test case - respects minResolution parameter", () =>
    {
        const result = execute(2, 128);

        expect(result).toBe(128);
    });

    it("test case - respects maxResolution parameter", () =>
    {
        const result = execute(10, 64, 256);

        expect(result).toBe(256);
    });
});
