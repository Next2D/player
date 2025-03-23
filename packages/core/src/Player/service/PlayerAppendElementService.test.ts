import { execute } from "./PlayerAppendElementService";
import { $setCanvas, $setMainElement } from "../../CoreUtil";
import { $textArea } from "@next2d/text";
import { describe, expect, it } from "vitest";

describe("PlayerAppendElementService.js test", () =>
{
    it("execute test case", () =>
    {
        const div = document.createElement("div");
        $setMainElement(div);

        const canvas = document.createElement("canvas");
        $setCanvas(canvas);
        
        expect(div.children.length).toBe(0);
        execute();

        expect(div.children[0]).toBe(canvas);
        expect(div.children[1]).toBe($textArea);
        expect(div.children.length).toBe(2);
    });
});