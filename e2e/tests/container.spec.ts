import { test, expect } from "@playwright/test";
import { waitForCanvas } from "./helpers/wait-for-render";

test.describe("コンテナテスト", () => {
    test("子オブジェクトの管理（z-order, addChildAt, setChildIndex, swap, remove）", async ({ page }) => {
        await page.goto("/e2e/pages/container/child-management.html");
        await waitForCanvas(page);

        await expect(page).toHaveScreenshot("container-child-management.png");
    });
});
