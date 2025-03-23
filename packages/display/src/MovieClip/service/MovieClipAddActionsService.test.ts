import { execute } from "./MovieClipAddActionsService";
import { describe, expect, it } from "vitest";

describe("MovieClipAddActionsService.js test", () =>
{
    it("execute test case1", () =>
    {
        const actions = new Map<number, Function[]>();

        const objects = [
            {
                "frame": 1,
                "action": "console.log('test1')"
            },
            {
                "frame": 5,
                "action": "console.log('test2')"
            }
        ];

        expect(actions.size).toBe(0);
        execute(actions, objects);
        expect(actions.size).toBe(2);
        expect(actions.has(1)).toBe(true);
        expect(actions.has(2)).toBe(false);
        expect(actions.has(3)).toBe(false);
        expect(actions.has(4)).toBe(false);
        expect(actions.has(5)).toBe(true);
        
    });
});