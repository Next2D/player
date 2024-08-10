import { execute } from "./PlayerApplyContainerElementStyleService";
import { describe, expect, it } from "vitest";

describe("PlayerApplyContainerElementStyleService.js test", () =>
{
    it("execute test case1", () =>
    {
        try {

            execute(document.createElement("div"));

        } catch (error) {

            expect(error.message).toBe("parent element is null.");

        }
    });

    it("execute test case2", () =>
    {
        const div = document.createElement("div");

        const parent = document.createElement("div");
        parent.appendChild(div);

        expect(div.style.display).toBe("");
        expect(div.style.alignItems).toBe("");
        expect(div.style.justifyContent).toBe("");
        expect(div.style.backgroundColor).toBe("");
        expect(div.style.overflow).toBe("");
        expect(div.style.padding).toBe("");
        expect(div.style.margin).toBe("");
        expect(div.style.userSelect).toBe("");
        expect(div.style.outline).toBe("");

        execute(div);

        expect(div.style.display).toBe("flex");
        expect(div.style.alignItems).toBe("center");
        expect(div.style.justifyContent).toBe("center");
        expect(div.style.backgroundColor).toBe("transparent");
        expect(div.style.overflow).toBe("hidden");
        expect(div.style.padding).toBe("0px");
        expect(div.style.margin).toBe("0px");
        expect(div.style.userSelect).toBe("none");
        expect(div.style.outline).toBe("none");
    });

    it("execute test case3", () =>
    {
        const div = document.createElement("div");

        const parent = document.createElement("div");
        parent.appendChild(div);

        expect(div.style.width).toBe("");
        expect(div.style.height).toBe("");

        execute(div, 100, 200);

        expect(div.style.width).toBe("100px");
        expect(div.style.height).toBe("200px");
    });
});