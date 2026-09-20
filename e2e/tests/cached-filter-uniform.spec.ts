import { test, expect } from "@playwright/test";

test("cached bindings read updated texels from the same texture view", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "webgpu", "WebGPU cached binding regression");
    await page.goto("/e2e/pages/webgpu/cached-filter-uniform.html?contents");
    await page.waitForFunction(() => "__CACHED_FILTER_RESULT__" in window);
    const result = await page.evaluate(() => Reflect.get(window, "__CACHED_FILTER_RESULT__"));
    await testInfo.attach("cached-binding-content-update", { body: JSON.stringify(result), contentType: "application/json" });
    expect(result.error).toBeUndefined();
    expect(result.cases).toBe(80);
    expect(result.frames).toBe(240);
    expect(result.maxDelta).toBe(0);
});

test("cached color transform matches two-pass output across sizes and overlapping draws", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "webgpu", "WebGPU cached color transform regression");
    await page.goto("/e2e/pages/webgpu/cached-filter-uniform.html?stress");
    await page.waitForFunction(() => "__CACHED_FILTER_RESULT__" in window);
    const result = await page.evaluate(() => Reflect.get(window, "__CACHED_FILTER_RESULT__"));
    await testInfo.attach("cached-ct-stress", { body: JSON.stringify(result), contentType: "application/json" });
    expect(result.error).toBeUndefined();
    expect(result.cases).toBe(240);
    expect(result.frames).toBe(720);
    expect(result.maxDelta).toBe(0);
    expect(result.currentPasses).toBeLessThan(result.baselinePasses);
});

for (const transitions of [false, true]) {
    test(`cached color transform preserves 8-bit rounding and clamping (transitions=${transitions})`, async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== "webgpu", "WebGPU cached color transform regression");
        await page.goto(`/e2e/pages/webgpu/cached-filter-uniform.html?edges${transitions ? "&transitions" : ""}`);
        await page.waitForFunction(() => "__CACHED_FILTER_RESULT__" in window);
        const result = await page.evaluate(() => Reflect.get(window, "__CACHED_FILTER_RESULT__"));
        await testInfo.attach("cached-ct-rounding", { body: JSON.stringify(result), contentType: "application/json" });
        expect(result.error).toBeUndefined();
        expect(result.cases).toBe(80);
        expect(result.frames).toBe(240);
        expect(result.maxDelta).toBe(0);
        expect(result.currentPasses).toBeLessThan(result.baselinePasses);
    });
}

test("cached filter output matches independent uniforms across frames and view replacement", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "webgpu", "WebGPU cached uniform regression");
    await page.goto("/e2e/pages/webgpu/cached-filter-uniform.html");
    await page.waitForFunction(() => "__CACHED_FILTER_RESULT__" in window);
    const result = await page.evaluate(() => Reflect.get(window, "__CACHED_FILTER_RESULT__"));
    await testInfo.attach("cached-filter-uniform-comparison", { body: JSON.stringify(result), contentType: "application/json" });
    expect(result.error).toBeUndefined();
    expect(result.cases).toBe(80);
    expect(result.frames).toBe(240);
    expect(result.maxDelta).toBe(0);
    expect(result.currentPasses).toBeLessThan(result.baselinePasses);
});

test("cached output pass merging preserves blend, flush and target transitions", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "webgpu", "WebGPU cached pass regression");
    await page.goto("/e2e/pages/webgpu/cached-filter-uniform.html?transitions");
    await page.waitForFunction(() => "__CACHED_FILTER_RESULT__" in window);
    const result = await page.evaluate(() => Reflect.get(window, "__CACHED_FILTER_RESULT__"));
    await testInfo.attach("cached-pass-transitions", { body: JSON.stringify(result), contentType: "application/json" });
    expect(result.error).toBeUndefined();
    expect(result.cases).toBe(80);
    expect(result.frames).toBe(240);
    expect(result.maxDelta).toBe(0);
    expect(result.currentPasses).toBeLessThan(result.baselinePasses);
});
