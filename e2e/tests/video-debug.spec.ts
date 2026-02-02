import { test, expect } from "@playwright/test";

test.describe("Video Debug", () => {
    test("debug video rendering", async ({ page }) => {
        // コンソールログをキャプチャ
        const logs: string[] = [];
        page.on("console", msg => {
            logs.push(msg.text());
            console.log("BROWSER:", msg.text());
        });
        page.on("pageerror", err => {
            console.log("PAGE ERROR:", err.message);
        });

        await page.goto("/e2e/pages/video/debug.html");

        // 15秒待機
        await page.waitForTimeout(15000);

        // スクリーンショット
        await expect(page).toHaveScreenshot("video-debug.png");

        // ログを出力
        console.log("=== All logs ===");
        logs.forEach(log => console.log(log));
    });
});
