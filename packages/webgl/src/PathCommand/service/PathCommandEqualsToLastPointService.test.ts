import { execute } from "./PathCommandEqualsToLastPointService";
import { describe, expect, it } from "vitest";
import { $currentPath } from "../../PathCommand";

describe("PathCommandEqualsToLastPointService.js method test", () =>
{
    it("test case", () =>
    {
        $currentPath.length = 0;
        $currentPath.push(
            1, 2, false,
            3, 4, false,
            5, 6, false
        );
        
        expect($currentPath.length).toBe(9);
        expect(execute(1, 2)).toBe(false);
        expect(execute(5, 6)).toBe(true);
    });
});