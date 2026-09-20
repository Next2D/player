import { test, expect } from "@playwright/test";

test("blur binding reuse preserves updated uniforms and textures through resource changes", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "webgpu", "WebGPU bindings");
    await page.goto("/e2e/pages/webgpu/blur-binding.html");
    await page.waitForFunction(() => "__BLUR_BINDING__" in window);
    const result = await page.evaluate(() => Reflect.get(window, "__BLUR_BINDING__"));
    await testInfo.attach("blur-binding.json", { body: JSON.stringify(result), contentType: "application/json" });
    expect(result.error).toBeUndefined();
    expect(result.errors).toEqual([]);
    expect(result.results).toHaveLength(24);
    let before = 0, after = 0;
    for (const row of result.results) {
        expect(row.maxDelta, JSON.stringify(row)).toBe(0);
        expect(row.nonzero).toBe(true);
        before += row.groups[0]; after += row.groups[1];
    }
    expect(after).toBeLessThan(before);
    expect(result.results.some((row: { groups: number[] }) => row.groups[1] === 0)).toBe(true);
});
