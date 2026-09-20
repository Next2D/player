import { test, expect } from "@playwright/test";

for (const readback of [false, true]) {
    test(`reused text canvas matches fresh pixels after state and size changes (defaultContext=${readback})`, async ({ page }) => {
        await page.goto(`/e2e/pages/textfield/scratch-canvas.html${readback ? "?readback" : ""}`);
        await page.waitForFunction(() => "__SCRATCH_RESULT__" in window);
        const result = await page.evaluate(() => Reflect.get(window, "__SCRATCH_RESULT__"));
        expect(result.error).toBeUndefined();
        expect(result.cases).toBe(48);
        expect(result.painted).toBeGreaterThan(0);
        expect(result.maxDelta).toBe(0);
    });
}
