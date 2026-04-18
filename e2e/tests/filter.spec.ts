import { test, expect } from "@playwright/test";
import { waitForCanvas } from "./helpers/wait-for-render";

test.describe("Filterテスト", () => {
    test("BlurFilter", async ({ page }) => {
        await page.goto("/e2e/pages/filter/blur.html");
        await waitForCanvas(page);

        await expect(page).toHaveScreenshot("filter-blur.png");
    });

    test("DropShadowFilter", async ({ page }) => {
        await page.goto("/e2e/pages/filter/drop-shadow.html");
        await waitForCanvas(page);

        await expect(page).toHaveScreenshot("filter-drop-shadow.png");
    });

    test("GlowFilter", async ({ page }) => {
        await page.goto("/e2e/pages/filter/glow.html");
        await waitForCanvas(page);

        await expect(page).toHaveScreenshot("filter-glow.png");
    });

    test("BevelFilter", async ({ page }) => {
        await page.goto("/e2e/pages/filter/bevel.html");
        await waitForCanvas(page);

        await expect(page).toHaveScreenshot("filter-bevel.png");
    });

    test("ColorMatrixFilter", async ({ page }) => {
        await page.goto("/e2e/pages/filter/color-matrix.html");
        await waitForCanvas(page);

        await expect(page).toHaveScreenshot("filter-color-matrix.png");
    });

    test("ConvolutionFilter", async ({ page }) => {
        await page.goto("/e2e/pages/filter/convolution.html");
        await waitForCanvas(page);

        await expect(page).toHaveScreenshot("filter-convolution.png");
    });

    test("DisplacementMapFilter", async ({ page }) => {
        await page.goto("/e2e/pages/filter/displacement.html");
        await waitForCanvas(page);

        await expect(page).toHaveScreenshot("filter-displacement.png");
    });

    test("GradientBevelFilter", async ({ page }) => {
        await page.goto("/e2e/pages/filter/gradient-bevel.html");
        await waitForCanvas(page);

        await expect(page).toHaveScreenshot("filter-gradient-bevel.png");
    });

    test("GradientGlowFilter", async ({ page }) => {
        await page.goto("/e2e/pages/filter/gradient-glow.html");
        await waitForCanvas(page);

        await expect(page).toHaveScreenshot("filter-gradient-glow.png");
    });

    test("MultiFilter", async ({ page }) => {
        await page.goto("/e2e/pages/filter/multi-filter.html");
        await waitForCanvas(page);

        await expect(page).toHaveScreenshot("filter-multi-filter.png");
    });

    test("フィルターモード（inner, knockout, hideObject, type）", async ({ page }) => {
        await page.goto("/e2e/pages/filter/filter-modes.html");
        await waitForCanvas(page);

        await expect(page).toHaveScreenshot("filter-modes.png");
    });

    test("フィルター品質（quality 1, 2, 3比較）", async ({ page }) => {
        await page.goto("/e2e/pages/filter/filter-quality.html");
        await waitForCanvas(page);

        await expect(page).toHaveScreenshot("filter-quality.png");
    });

    test("ColorMatrixFilter on Sprite with transformed Shapes (issue #274)", async ({ page }) => {
        await page.goto("/e2e/pages/filter/color-matrix-sprite-transformed.html");
        await waitForCanvas(page);

        await expect(page).toHaveScreenshot("filter-color-matrix-sprite-transformed.png");
    });

    test("全フィルター on Sprite with transformed Shapes (issue #274 regression)", async ({ page }) => {
        await page.goto("/e2e/pages/filter/filters-sprite-transformed.html");
        await waitForCanvas(page);

        await expect(page).toHaveScreenshot("filters-sprite-transformed.png");
    });
});
