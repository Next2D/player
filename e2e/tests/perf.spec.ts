import { test, expect } from "@playwright/test";

/**
 * パフォーマンスベンチマーク
 *
 * フレームタイム（rAF間隔）の中央値/p95を計測し、閾値超過で失敗する。
 * 環境差のノイズがあるため、閾値は「壊滅的な速度劣化」を検出する緩い値。
 * 詳細な数値はコンソール出力とアノテーションで追跡する。
 *
 * 実行方法（通常のe2e実行ではスキップされる）:
 *   npm run test:e2e:perf              # 両レンダラ
 *   PERF=1 npx playwright test tests/perf.spec.ts --project=webgl
 */

const RUN_PERF = !!process.env.PERF;

interface IPerfResult {
    median: number;
    p95: number;
    mean: number;
    frames: number;
}

// 閾値は実測値の約3倍を目安に設定（実測: Apple Silicon 120Hz, 2026-07）。
//   webgl:  sprites 8.3 / filters 8.3 / text 8.3 / blend 8.3 (全てvsync張り付き)
//   webgpu: sprites 8.3 / filters 9.7 (p95 41.6) / text 8.3 / blend 15.5 (p95 50.1)
// 恒常的に超える場合はレンダリングパイプラインの回帰を疑うこと。
// 注意: 閾値はマシン依存。別環境でベースラインを取り直す場合は
// npm run test:e2e:perf の出力を参照して更新する。
const THRESHOLDS: Record<string, { median: number; p95: number }> = {
    "sprites": { "median": 30, "p95": 60 },
    "filters": { "median": 35, "p95": 100 },
    "text":    { "median": 30, "p95": 60 },
    "blend":   { "median": 45, "p95": 120 }
};

test.describe("パフォーマンスベンチマーク", () => {

    test.skip(!RUN_PERF, "PERF=1 が設定されたときのみ実行");

    for (const scenario of Object.keys(THRESHOLDS)) {

        test(`${scenario} - フレームタイム計測`, async ({ page }, testInfo) => {

            test.setTimeout(120000);

            await page.goto(`/e2e/pages/perf/${scenario}.html`);

            const handle = await page.waitForFunction(
                () => (window as any).__PERF_RESULT__,
                { "timeout": 90000 }
            );
            const result = await handle.jsonValue() as IPerfResult;

            const summary = `median=${result.median.toFixed(2)}ms `
                + `p95=${result.p95.toFixed(2)}ms `
                + `mean=${result.mean.toFixed(2)}ms `
                + `frames=${result.frames}`;

            console.log(`[perf][${testInfo.project.name}] ${scenario}: ${summary}`);
            testInfo.annotations.push({ "type": "perf", "description": summary });

            const threshold = THRESHOLDS[scenario];
            expect(result.median, `${scenario} median frame time`).toBeLessThan(threshold.median);
            expect(result.p95, `${scenario} p95 frame time`).toBeLessThan(threshold.p95);
        });
    }
});
