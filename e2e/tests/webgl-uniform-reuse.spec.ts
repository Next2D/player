import { test, expect } from '@playwright/test';

for (const variant of ['inline', 'weak']) test(`WebGL uniform reuse (${variant}) preserves pixels and program-local values`, async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'webgl', 'WebGL-only diagnostic');
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`/e2e/pages/webgl/uniform-reuse.html?${variant}`);
    await page.waitForFunction(() => window['__RESULT__'] !== null);
    const result = await page.evaluate(() => window['__RESULT__']);
    await testInfo.attach('uniform-reuse', { body: JSON.stringify(result), contentType: 'application/json' });
    expect(errors).toEqual([]);
    expect(result.error).toBeUndefined();
    expect(result.rows).toHaveLength(64);
    expect(result.rows.every(row => row.maxDelta === 0 && row.nonzero)).toBe(true);
    expect(result.counts[0]).toBe(128);
    expect(result.counts[1]).toBeLessThan(result.counts[0]);
});
