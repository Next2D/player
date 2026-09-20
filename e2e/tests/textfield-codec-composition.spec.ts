import { test, expect } from "@playwright/test";
import { waitForCanvas, waitForRender } from "./helpers/wait-for-render";

test("composition events keep character underlines scoped through the text codec", async ({ page }) => {
    await page.goto("/e2e/pages/textfield/codec-composition.html");
    await waitForCanvas(page);
    for (const phase of ["update", "end"]) {
        const state = await page.evaluate(value => Reflect.get(window, "__compose")(value), phase);
        expect(state.text).toBe("a漢b");
        expect(state.decoded).toEqual(state.source);
        expect(state.characters).toEqual([
            { text: "a", underline: false },
            { text: "漢", underline: phase === "update" },
            { text: "b", underline: false }
        ]);
        await waitForRender(page);
    }
});
