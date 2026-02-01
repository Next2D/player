import { test, expect } from "@playwright/test";
import { waitForCanvas } from "./helpers/wait-for-render";

test.describe("BlendModeテスト", () => {
    test("全14種類のBlendMode", async ({ page }) => {
        await page.goto("/e2e/pages/blendmode/all-modes.html");
        await waitForCanvas(page);

        await expect(page).toHaveScreenshot("blendmode-all.png");
    });
});
