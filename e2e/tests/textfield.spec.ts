import { test, expect } from "@playwright/test";
import { waitForCanvas } from "./helpers/wait-for-render";

test.describe("TextFieldテスト", () => {
    test("基本テキスト（text, htmlText, autoSize, background, border）", async ({ page }) => {
        await page.goto("/e2e/pages/textfield/basic.html");
        await waitForCanvas(page);

        await expect(page).toHaveScreenshot("textfield-basic.png");
    });

    test("TextFormat（font, size, color, bold, italic, underline, align, leading, letterSpacing）", async ({ page }) => {
        await page.goto("/e2e/pages/textfield/format.html");
        await waitForCanvas(page);

        await expect(page).toHaveScreenshot("textfield-format.png");
    });

    test("TextFieldBlendMode（全14種類）", async ({ page }) => {
        await page.goto("/e2e/pages/textfield/blendmode.html");
        await waitForCanvas(page);

        await expect(page).toHaveScreenshot("textfield-blendmode.png");
    });

    test("TextFieldFilter（全フィルター）", async ({ page }) => {
        await page.goto("/e2e/pages/textfield/filter.html");
        await waitForCanvas(page);

        await expect(page).toHaveScreenshot("textfield-filter.png");
    });
});
