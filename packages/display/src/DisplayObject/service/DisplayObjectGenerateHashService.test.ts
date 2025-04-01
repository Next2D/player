import { execute } from "./DisplayObjectGenerateHashService";
import { describe, expect, it } from "vitest";

describe("DisplayObjectGenerateHashService.js test", () =>
{
    it("execute test", () =>
    {
        expect(execute(new Float32Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]))).toBe(9749870);
    });
});