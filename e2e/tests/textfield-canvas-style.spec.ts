import { test, expect } from "@playwright/test";

for (const wire of [false, true]) {
    for (const mixed of [false, true]) {
        for (const readback of [false, true]) {
            test(`text style reuse matches reference pixels (mixed=${mixed}, readback=${readback}, wire=${wire})`, async ({ page }, testInfo) => {
                const params = new URLSearchParams();
                if (wire) params.set("wire", "");
                if (mixed) params.set("mixed", "");
                if (readback) params.set("readback", "");
                await page.goto(`/e2e/pages/textfield/canvas-style.html?${params}`);
                await page.waitForFunction(() => "__SCRATCH_RESULT__" in window);
                const result = await page.evaluate(() => Reflect.get(window, "__SCRATCH_RESULT__"));
                await testInfo.attach("style-result", {
                    body: JSON.stringify(result), contentType: "application/json"
                });
                expect(result.error).toBeUndefined();
                expect(result.cases).toBe(48);
                expect(result.painted).toBeGreaterThan(0);
                expect(result.translucent).toBeGreaterThan(0);
                expect(result.maxDelta).toBe(0);
                expect(result.pathMismatches).toBe(0);
                expect(result.afterWrites.beginPath).toBeLessThan(result.beforeWrites.beginPath);
                expect(result.afterWrites.font).toBeLessThan(result.beforeWrites.font);
                expect(result.afterWrites.fillStyle).toBeLessThan(result.beforeWrites.fillStyle);
            });
        }
    }
}
