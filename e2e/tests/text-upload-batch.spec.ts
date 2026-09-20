import { test, expect } from "@playwright/test";

test("batched text uploads preserve exact GPU pixels across rollover and source reuse", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "webgpu", "WebGPU texture upload test");
    await page.goto("/e2e/pages/webgpu/text-upload-batch.html");
    await page.waitForFunction(() => "__UPLOAD_RESULT__" in window);
    const result = await page.evaluate(() => Reflect.get(window, "__UPLOAD_RESULT__"));
    await testInfo.attach("upload-pixels.json", { body: JSON.stringify(result), contentType: "application/json" });
    expect(result.error).toBeUndefined();
    expect(result.errors).toEqual([]);
    expect(result.results).toHaveLength(48);
    expect(result.externalCopies).toBeGreaterThan(1);
    expect(result.externalCopies).toBeLessThan(48);
    expect(result.painted).toBeGreaterThan(0);
    expect(result.results[0].expectedPainted).toBeGreaterThan(0);
    expect(result.results[24].expectedPainted).toBeGreaterThan(0);
    for (const row of result.results) {
        expect(row.maxDelta).toBe(0);
        expect(row.actualPainted).toBe(row.expectedPainted);
    }
});
