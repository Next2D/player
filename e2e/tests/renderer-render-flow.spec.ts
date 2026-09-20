import { test, expect } from "@playwright/test";

test("real RAF flow stays bounded and renders the latest masked/filter/text state", async ({ page }, testInfo) => {
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto("/e2e/pages/renderer/render-flow.html");
    await page.waitForFunction(() => {
        const flow = Reflect.get(window, "__FLOW__");
        return flow?.ready || flow?.error;
    });
    expect(await page.evaluate(() => Reflect.get(window, "__FLOW__").error)).toBeUndefined();
    const initial = await page.locator("canvas").first().screenshot();
    await page.evaluate(() => { void Reflect.get(window, "__startFlow")(false); });
    await page.waitForFunction(() => {
        const flow = Reflect.get(window, "__FLOW__");
        return flow.done || flow.error;
    });
    const flow = await page.evaluate(() => Reflect.get(window, "__FLOW__"));
    await testInfo.attach("renderer-flow", { body: JSON.stringify(flow), contentType: "application/json" });
    expect(flow.error).toBeUndefined();
    expect(flow.enabled).toBe(true);
    expect(flow.maxPending).toBe(1);
    expect(flow.updates).toBe(45);
    expect(flow.updatesWhilePending).toBeGreaterThan(0);
    expect(flow.enterFrames).toBeGreaterThan(0);
    expect(flow.pending).toBe(0);
    expect(flow.ack).toBe(flow.sent);
    expect(flow.sent).toBeGreaterThanOrEqual(flow.finalMinimumSent);
    const actual = await page.locator("canvas").first().screenshot();
    expect(actual.equals(initial), "final rendered state must differ from the initial image").toBe(false);
    await page.waitForTimeout(300);
    expect(await page.evaluate(() => Reflect.get(window, "__FLOW__").sent)).toBe(flow.sent);

    // Same update history, but the reference waits for every render ACK. This
    // checks coalescing without conflating it with existing history-dependent pixels.
    // Exact PNG equality tests canvas pixels without changing snapshot baselines.
    await page.reload();
    await page.waitForFunction(() => {
        const state = Reflect.get(window, "__FLOW__");
        return state?.ready || state?.error;
    });
    expect(await page.evaluate(() => Reflect.get(window, "__FLOW__").error)).toBeUndefined();
    await page.evaluate(() => { void Reflect.get(window, "__startFlow")(true); });
    await page.waitForFunction(() => {
        const state = Reflect.get(window, "__FLOW__");
        return state.done || state.error;
    });
    expect(await page.evaluate(() => Reflect.get(window, "__FLOW__").error)).toBeUndefined();
    const reference = await page.locator("canvas").first().screenshot();
    await testInfo.attach("final-image", { body: actual, contentType: "image/png" });
    await testInfo.attach("reference-image", { body: reference, contentType: "image/png" });
    expect(actual.equals(reference), "coalesced latest state must match ACK-paced updates").toBe(true);
    expect(errors).toEqual([]);
});
