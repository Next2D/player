import { test, expect } from "@playwright/test";

test("composite bindings preserve pixels through resource changes and reduce creations", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "webgpu", "WebGPU composite bindings");
    await page.goto("/e2e/pages/webgpu/composite-binding.html");
    await page.waitForFunction(() => "__COMPOSITE_BINDING__" in window);
    const result = await page.evaluate(() => Reflect.get(window, "__COMPOSITE_BINDING__"));
    await testInfo.attach("composite-binding.json", { body: JSON.stringify(result), contentType: "application/json" });
    expect(result.error).toBeUndefined();
    expect(result.errors).toEqual([]);
    expect(result.results).toHaveLength(120);
    const totals = new Map<string, number[]>();
    for (const row of result.results) {
        expect(row.maxDelta, JSON.stringify(row)).toBe(0);
        expect(row.nonzero).toBe(true);
        const total = totals.get(row.name) || [0, 0];
        total[0] += row.groups[0]; total[1] += row.groups[1]; totals.set(row.name, total);
    }
    expect(totals.size).toBe(5);
    for (const [name, [before, after]] of totals) expect(after, name).toBeLessThan(before);
});
