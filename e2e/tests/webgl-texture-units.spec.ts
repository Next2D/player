import { test, expect } from '@playwright/test';

test('texture-unit pruning preserves pixels, bindings and active unit 0', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'webgl', 'WebGL-only comparison');
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('/e2e/pages/webgl/texture-units.html');
    await page.waitForFunction(() => window['__RESULT__'] !== null);
    const result = await page.evaluate(() => window['__RESULT__']);
    await testInfo.attach('texture-units', { body: JSON.stringify(result), contentType: 'application/json' });
    expect(errors).toEqual([]); expect(result.error).toBeUndefined();
    expect(result.rows).toHaveLength(480);
    expect(result.rows.every(row=>row.maxDelta===0 && row.nonzero && row.switches[1]<=row.switches[0])).toBe(true);
    expect(result.rows.reduce((n,row)=>n+row.switches[1],0)).toBeLessThan(result.rows.reduce((n,row)=>n+row.switches[0],0));
});
