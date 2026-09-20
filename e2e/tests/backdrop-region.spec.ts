import { test, expect } from "@playwright/test";

test("background region matches copy + blend on the GPU", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "webgpu", "WebGPU shader regression");
    await page.goto("/e2e/pages/webgpu/backdrop-region.html");
    await page.waitForFunction(() => "__BACKDROP_RESULT__" in window);
    const result = await page.evaluate(() => Reflect.get(window, "__BACKDROP_RESULT__"));
    await testInfo.attach("backdrop-comparison", { body: JSON.stringify(result), contentType: "application/json" });
    expect(result.error).toBeUndefined();
    expect(result.cases).toBe(160);
    // The removed intermediate rgba8 round-trip may differ by one quantization level.
    expect(result.maxDelta).toBeLessThanOrEqual(1);
});

test("local MSAA resolve matches hardware resolve before blending", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "webgpu", "WebGPU shader regression");
    await page.goto("/e2e/pages/webgpu/msaa-backdrop.html");
    await page.waitForFunction(() => "__BACKDROP_RESULT__" in window);
    const result = await page.evaluate(() => Reflect.get(window, "__BACKDROP_RESULT__"));
    await testInfo.attach("msaa-comparison", { body: JSON.stringify(result), contentType: "application/json" });
    expect(result.error).toBeUndefined();
    expect(result.cases).toBe(320);
    expect(result.maxDelta).toBeLessThanOrEqual(1);
});
