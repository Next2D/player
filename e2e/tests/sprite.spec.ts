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
});
