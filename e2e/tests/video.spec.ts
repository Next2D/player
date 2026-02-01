import { test, expect } from "@playwright/test";
import { waitForCanvas } from "./helpers/wait-for-render";

test.describe("Videoテスト", () => {
    test("動画表示（基本）", async ({ page }) => {
        await page.goto("/e2e/pages/video/playback.html");
        await waitForCanvas(page);

        await expect(page).toHaveScreenshot("video-playback.png");
    });

    test("動画BlendMode（全14種類）", async ({ page }) => {
        await page.goto("/e2e/pages/video/blendmode.html");
        await waitForCanvas(page);

        await expect(page).toHaveScreenshot("video-blendmode.png");
    });

    test("動画Filter（全フィルター）", async ({ page }) => {
        await page.goto("/e2e/pages/video/filter.html");
        await waitForCanvas(page);

        await expect(page).toHaveScreenshot("video-filter.png");
    });
});
