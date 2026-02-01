import { test, expect } from "@playwright/test";
import { waitForCanvas } from "./helpers/wait-for-render";

test.describe("Maskテスト", () => {
    test("Sprite.mask（円形、矩形、星形、角丸、楕円、複雑なパス、Video、TextField）", async ({ page }) => {
        await page.goto("/e2e/pages/mask/sprite-mask.html");
        await waitForCanvas(page);

        await expect(page).toHaveScreenshot("mask-sprite.png");
    });
});
