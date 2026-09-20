import { test, expect } from "@playwright/test";

test("experimental blur direct copy matches the production sampled path", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "webgpu", "WebGPU blur copy");
    await page.goto("/e2e/pages/webgpu/blur-copy.html");
    await page.waitForFunction(() => "__BLUR_COPY__" in window);
    const result = await page.evaluate(() => Reflect.get(window, "__BLUR_COPY__"));
    await testInfo.attach("blur-copy.json", { body: JSON.stringify(result), contentType: "application/json" });
    expect(result.error).toBeUndefined();
    expect(result.errors).toEqual([]);
    expect(result.results).toHaveLength(72);
    for (const row of result.results) {
        expect(row.maxDelta, JSON.stringify(row)).toBe(0);
        expect(row.copies).toEqual([0, row.expectedCopies]);
    }
});
