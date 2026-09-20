import { test, expect } from "@playwright/test";

for (const control of [true, false]) {
    test("paired blur precision audit (control=" + control + ")", async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== "webgpu", "WebGPU shader experiment");
        await page.goto("/e2e/pages/webgpu/blur-pair.html" + (control ? "?control" : ""));
        await page.waitForFunction(() => "__BLUR_PAIR__" in window);
        const result = await page.evaluate(() => Reflect.get(window, "__BLUR_PAIR__"));
        await testInfo.attach("blur-pair-" + (control ? "control" : "candidate") + ".json", {
            body: JSON.stringify(result), contentType: "application/json"
        });
        expect(result.error).toBeUndefined();
        expect(result.errors).toEqual([]);
        expect(result.control).toBe(control);
        expect(result.results).toHaveLength(1120);
        expect(result.shaders).toHaveLength(16);
        for (const row of result.results) {
            expect(row.nonzero).toBe(true);
            expect(Number.isInteger(row.maxDelta)).toBe(true);
            expect(row.maxDelta).toBeGreaterThanOrEqual(0);
            expect(row.maxDelta).toBeLessThanOrEqual(255);
            // Audit only: this does not assert that the candidate is equivalent.
            // Unchanged shaders must still produce exactly equal pixels.
            if (control || row.radius <= 2) expect(row.maxDelta, JSON.stringify(row)).toBe(0);
        }
        if (!control) {
            for (const shader of result.shaders) {
                if (shader.radius <= 2) continue;
                expect(shader.source).not.toContain("for (var i:");
                expect(shader.staticTextureSamples).toBe(3 + 2 * Math.ceil((shader.radius - 1) / 2));
            }
        }
    });
}
