import { test, expect } from "@playwright/test";
import { waitForCanvas } from "./helpers/wait-for-render";

test.describe("DisplayObjectテスト", () => {
    test("プロパティ（visible, alpha, rotation, scale, 複合transform）", async ({ page }) => {
        await page.goto("/e2e/pages/display-object/properties.html");
        await waitForCanvas(page);

        await expect(page).toHaveScreenshot("display-object-properties.png");
    });

    test("ColorTransform（色乗算、色オフセット、alpha、親子累積）", async ({ page }) => {
        await page.goto("/e2e/pages/display-object/color-transform.html");
        await waitForCanvas(page);

        await expect(page).toHaveScreenshot("display-object-color-transform.png");
    });

    test("ネストされたtransform（scale, rotation, position, alphaの累積）", async ({ page }) => {
        await page.goto("/e2e/pages/display-object/nested-transforms.html");
        await waitForCanvas(page);

        await expect(page).toHaveScreenshot("display-object-nested-transforms.png");
    });
});
