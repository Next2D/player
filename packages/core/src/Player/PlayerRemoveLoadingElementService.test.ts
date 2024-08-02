import { execute } from "./PlayerRemoveLoadingElementService";
import { execute as playerLoadingAnimationService } from "./PlayerLoadingAnimationService";
import { $PREFIX } from "../CoreUtil";
import { describe, expect, it } from "vitest";

describe("PlayerRemoveLoadingElementService.js test", () =>
{
    it("execute test case1", () =>
    {
        const parent = document.createElement("div");
        parent.id = $PREFIX;
        document.body.appendChild(parent);
        expect(parent.children.length).toBe(0);

        playerLoadingAnimationService(parent);
        expect(parent.children.length).toBe(2);

        execute();
        expect(parent.children.length).toBe(0);

        parent.remove();
    });
});