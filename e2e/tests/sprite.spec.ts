import { test, expect } from "@playwright/test";
import { waitForCanvas } from "./helpers/wait-for-render";

test.describe("Sprite テスト", () => {
    test("Sprite Filter（コンテナフィルター）", async ({ page }) => {
        await page.goto("/e2e/pages/sprite/sprite-filter.html");
        await waitForCanvas(page);

        await expect(page).toHaveScreenshot("sprite-filter.png");
    });

    test("Sprite BlendMode（コンテナブレンド）", async ({ page }) => {
        await page.goto("/e2e/pages/sprite/sprite-blend.html");
        await waitForCanvas(page);

        await expect(page).toHaveScreenshot("sprite-blend.png");
    });

    test("Sprite ネストフィルター + ColorTransform", async ({ page }) => {
        await page.goto("/e2e/pages/sprite/sprite-nested-filter.html");
        await waitForCanvas(page);

        await expect(page).toHaveScreenshot("sprite-nested-filter.png", {
            maxDiffPixelRatio: 0.025,
            maxDiffPixels: 15000
        });
    });

    test("Sprite cacheAsBitmap（コンテナビットマップキャッシュ）", async ({ page }) => {
        await page.goto("/e2e/pages/sprite/cache-as-bitmap.html");
        await waitForCanvas(page);

        await expect(page).toHaveScreenshot("sprite-cache-as-bitmap.png");
    });

    test("Sprite cacheAsBitmap cache hit（キャッシュ再利用テスト）", async ({ page }) => {
        await page.goto("/e2e/pages/sprite/cache-as-bitmap-hit.html");
        await waitForCanvas(page);

        await expect(page).toHaveScreenshot("sprite-cache-as-bitmap-hit.png");
    });
});
