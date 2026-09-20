import { test, expect } from "@playwright/test";
import { waitForCanvas, waitForRender } from "./helpers/wait-for-render";

test("TextField cache matches forced rasterization after motion, scale and content changes", async ({ page }) => {
    await page.goto("/e2e/pages/textfield/raster-cache.html");
    await waitForCanvas(page);
    const canvas = page.locator("canvas").first();
    let previous = await canvas.screenshot();
    for (let step = 1; step <= 6; step++) {
        await page.evaluate(value => {
            (window as unknown as { __rasterStep: (step: number) => void }).__rasterStep(value);
        }, step);
        await waitForRender(page);
        const cached = await canvas.screenshot();
        expect(cached, `step ${step} must change the rendered image`).not.toEqual(previous);
        await page.evaluate(() => {
            (window as unknown as { __forceRaster: () => void }).__forceRaster();
        });
        await waitForRender(page);
        expect(await canvas.screenshot(), `raster step ${step}`).toEqual(cached);
        previous = cached;
    }
});
