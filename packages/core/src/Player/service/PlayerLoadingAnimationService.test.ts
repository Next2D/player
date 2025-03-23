import { execute } from "./PlayerLoadingAnimationService";
import { describe, expect, it } from "vitest";

describe("PlayerLoadingAnimationService.js test", () =>
{
    it("execute test case1", () =>
    {
        const div = document.createElement("div");
        expect(div.children.length).toBe(0);
        execute(div);
        expect(div.children.length).toBe(2);
    });
});