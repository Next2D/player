import { execute } from "./PlayerCreateContainerElementService";
import { $PREFIX } from "../CoreUtil";
import { describe, expect, it } from "vitest";

describe("PlayerCreateContainerElementService.js test", () =>
{
    it("execute test case1", () =>
    {
        const div = execute();
        expect(div.id).toBe($PREFIX);
        expect(div.tabIndex).toBe(-1);
    });
});