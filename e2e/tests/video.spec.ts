import { test, expect } from "@playwright/test";
import { waitForCanvas } from "./helpers/wait-for-render";

test.describe("Videoテスト", () => {
    test("動画表示（BlendMode, Filter適用）", async ({ page }) => {
        await page.goto("/e2e/pages/video/playback.html");
        await waitForCanvas(page);

        await expect(page).toHaveScreenshot("video-playback.png");
    });
});
