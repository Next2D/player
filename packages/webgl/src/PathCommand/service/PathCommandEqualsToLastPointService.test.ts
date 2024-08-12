import { execute } from "./PathCommandEqualsToLastPointService";
import { describe, expect, it } from "vitest";

describe("PathCommandEqualsToLastPointService.js method test", () =>
{
    it("test case", () =>
    {
        const currentPath = [
            1, 2, false,
            3, 4, false,
            5, 6, false
        ];
        
        expect(currentPath.length).toBe(9);
        expect(execute(currentPath, 1, 2)).toBe(false);
        expect(execute(currentPath, 5, 6)).toBe(true);
    });
});