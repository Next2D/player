import { Page } from "@playwright/test";

/**
 * 描画完了を待機するヘルパー関数
 * Next2Dのレンダリングが完了するまで待機
 */
export async function waitForRender(page: Page, timeout: number = 10000): Promise<void>
{
    // テストページで設定される __E2E_RENDER_COMPLETE__ フラグを待機
    await page.waitForFunction(() => {
        return (window as any).__E2E_RENDER_COMPLETE__ === true;
    }, { timeout });

    // ワーカースレッドでのレンダリング完了を待つため、より長い時間待機
    await page.waitForTimeout(1000);

    // 複数フレーム待機して描画が完全に安定することを確認
    await page.evaluate(() => {
        return new Promise<void>((resolve) => {
            let frameCount = 0;
            const waitFrames = () => {
                frameCount++;
                if (frameCount >= 5) {
                    resolve();
                } else {
                    requestAnimationFrame(waitFrames);
                }
            };
            requestAnimationFrame(waitFrames);
        });
    });

    // 追加の安定化待機
    await page.waitForTimeout(500);
}

/**
 * 特定の条件で描画完了を待機
 */
export async function waitForCondition(
    page: Page,
    condition: () => boolean | Promise<boolean>,
    timeout: number = 5000
): Promise<void>
{
    await page.waitForFunction(condition, { timeout });
}

/**
 * Canvasが描画されるまで待機
 */
export async function waitForCanvas(page: Page, timeout: number = 30000): Promise<void>
{
    await page.waitForSelector("canvas", { timeout });
    await waitForRender(page, timeout);
}
