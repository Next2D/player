import { FrameLabel } from "../../FrameLabel";
import { execute } from "./MovieClipAddLabelsService";
import { describe, expect, it } from "vitest";

describe("MovieClipAddLabelsService.js test", () =>
{
    it("execute test case1", () =>
    {
        const labelMap = new Map<number, FrameLabel>();

        const labels = [
            {
                "frame": 1,
                "name": "start"
            },
            {
                "frame": 5,
                "name": "end"
            }
        ];

        expect(labelMap.size).toBe(0);
        execute(labelMap, labels);
        expect(labelMap.size).toBe(2);
        expect(labelMap.has(1)).toBe(true);
        expect(labelMap.has(2)).toBe(false);
        expect(labelMap.has(3)).toBe(false);
        expect(labelMap.has(4)).toBe(false);
        expect(labelMap.has(5)).toBe(true);
    });
});