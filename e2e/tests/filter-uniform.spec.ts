import { test, expect } from "@playwright/test";

test("filter uniform arena matches independent uploads through growth", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "webgpu", "WebGPU uniform regression");
    await page.goto("/e2e/pages/webgpu/filter-uniform.html");
    await page.waitForFunction(() => "__FILTER_UNIFORM_RESULT__" in window);
    const result = await page.evaluate(() => Reflect.get(window, "__FILTER_UNIFORM_RESULT__"));
    await testInfo.attach("filter-uniform-comparison", { body: JSON.stringify(result), contentType: "application/json" });
    expect(result.error).toBeUndefined();
    expect(result.cases).toBe(24);
    expect(result.maxDelta).toBe(0);
});

for (const container of [false, true]) {
    test(`extended filter uniforms match independent uploads (container=${container})`, async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== "webgpu", "WebGPU uniform regression");
        await page.goto(`/e2e/pages/webgpu/filter-uniform-extended.html${container ? "?container" : ""}`);
        await page.waitForFunction(() => "__FILTER_UNIFORM_RESULT__" in window);
        const result = await page.evaluate(() => Reflect.get(window, "__FILTER_UNIFORM_RESULT__"));
        await testInfo.attach("extended-filter-uniform-comparison", { body: JSON.stringify(result), contentType: "application/json" });
        expect(result.error).toBeUndefined();
        expect(result.cases).toBe(container ? 48 : 96);
        expect(result.maxDelta).toBe(0);
    });
}
