import { test, expect } from "@playwright/test";

test("experimental unrolled blur matches the production loop on the GPU", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "webgpu", "WebGPU blur shader");
    await page.goto("/e2e/pages/webgpu/blur-unroll.html");
    await page.waitForFunction(() => "__BLUR_UNROLL__" in window);
    const result = await page.evaluate(() => Reflect.get(window, "__BLUR_UNROLL__"));
    await testInfo.attach("blur-unroll.json", { body: JSON.stringify(result), contentType: "application/json" });
    expect(result.error).toBeUndefined();
    expect(result.errors).toEqual([]);
    expect(result.results).toHaveLength(384);
    for (const row of result.results) {
        expect(row.nonzero).toBe(true);
        expect(row.maxDelta, JSON.stringify(row)).toBe(0);
    }
});
