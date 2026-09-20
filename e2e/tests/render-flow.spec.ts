import { test, expect } from "@playwright/test";

test("WebGPU flow control bounds real RAF submissions and drains after updates", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "webgpu", "WebGPU flow control");
    await page.goto("/e2e/pages/webgpu/render-flow.html");
    await page.waitForFunction(() => {
        const flow = Reflect.get(window, "__FLOW__");
        return flow.error || (flow.updated && flow.sent >= flow.finalMinimumSent && flow.pending === 0);
    });
    const result = await page.evaluate(() => Reflect.get(window, "__FLOW__"));
    await testInfo.attach("render-flow.json", { body: JSON.stringify(result), contentType: "application/json" });
    expect(result.error).toBeUndefined();
    expect(result.enabled).toBe(true);
    expect(result.updates).toBe(45);
    expect(result.sent).toBeGreaterThan(2);
    expect(result.ack).toBe(result.sent);
    expect(result.maxPending).toBe(1);
    // No queued commands should arrive after the source stops changing.
    await page.waitForTimeout(300);
    const drained = await page.evaluate(() => Reflect.get(window, "__FLOW__"));
    expect(drained.pending).toBe(0);
});
