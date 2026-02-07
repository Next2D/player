import { test, expect } from "@playwright/test";
import { waitForCanvas } from "./helpers/wait-for-render";

test.describe("Shape描画テスト", () => {
    test.describe("Fill（塗り）", () => {
        test("beginFill - 単色塗り", async ({ page }) => {
            await page.goto("/e2e/pages/shape/fill-solid.html");
            await waitForCanvas(page);

            await expect(page).toHaveScreenshot("fill-solid.png");
        });

        test("beginGradientFill - グラデーション塗り", async ({ page }) => {
            await page.goto("/e2e/pages/shape/fill-gradient.html");
            await waitForCanvas(page);

            await expect(page).toHaveScreenshot("fill-gradient.png");
        });

        test("beginBitmapFill - ビットマップ塗り", async ({ page }) => {
            await page.goto("/e2e/pages/shape/fill-bitmap.html");
            await waitForCanvas(page);

            await expect(page).toHaveScreenshot("fill-bitmap.png");
        });
    });

    test.describe("Line（線）", () => {
        test("lineStyle - 線のスタイル（太さ、caps、joints）", async ({ page }) => {
            await page.goto("/e2e/pages/shape/line-style.html");
            await waitForCanvas(page);

            await expect(page).toHaveScreenshot("line-style.png");
        });

        test("lineGradientStyle - グラデーション線", async ({ page }) => {
            await page.goto("/e2e/pages/shape/line-gradient.html");
            await waitForCanvas(page);

            await expect(page).toHaveScreenshot("line-gradient.png");
        });

        test("lineBitmapStyle - ビットマップ線", async ({ page }) => {
            await page.goto("/e2e/pages/shape/line-bitmap.html");
            await waitForCanvas(page);

            await expect(page).toHaveScreenshot("line-bitmap.png");
        });
    });

    test.describe("図形", () => {
        test("drawRect, drawRoundRect, drawCircle, drawEllipse", async ({ page }) => {
            await page.goto("/e2e/pages/shape/shapes.html");
            await waitForCanvas(page);

            await expect(page).toHaveScreenshot("shapes.png");
        });
    });

    test.describe("パス", () => {
        test("moveTo, lineTo, curveTo, cubicCurveTo", async ({ page }) => {
            await page.goto("/e2e/pages/shape/paths.html");
            await waitForCanvas(page);

            await expect(page).toHaveScreenshot("paths.png");
        });
    });

    test.describe("scale9Grid", () => {
        test("9スライススケーリング", async ({ page }) => {
            await page.goto("/e2e/pages/shape/scale9grid.html");
            await waitForCanvas(page);

            await expect(page).toHaveScreenshot("scale9grid.png");
        });
    });

    test.describe("画像読み込み", () => {
        test("Shape.load - 画像読み込み（スケール、回転、BlendMode、Filter）", async ({ page }) => {
            await page.goto("/e2e/pages/shape/load-image.html");
            await waitForCanvas(page);

            await expect(page).toHaveScreenshot("load-image.png");
        });

        test("Shape.load - 複数画像のY軸反転チェック", async ({ page }) => {
            await page.goto("/e2e/pages/shape/load-image-flip.html");
            await waitForCanvas(page);

            await expect(page).toHaveScreenshot("load-image-flip.png");
        });
    });

    test.describe("Graphics操作", () => {
        test("clear() - クリア後の再描画", async ({ page }) => {
            await page.goto("/e2e/pages/shape/graphics-clear.html");
            await waitForCanvas(page);

            await expect(page).toHaveScreenshot("graphics-clear.png");
        });

        test("copyFrom() - Graphicsのコピー", async ({ page }) => {
            await page.goto("/e2e/pages/shape/graphics-clone.html");
            await waitForCanvas(page);

            await expect(page).toHaveScreenshot("graphics-clone.png");
        });
    });
});
