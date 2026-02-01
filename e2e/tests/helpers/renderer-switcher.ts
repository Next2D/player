import { Page, TestInfo } from "@playwright/test";

/**
 * 現在のテストプロジェクト（レンダラー）を取得
 */
export function getCurrentRenderer(testInfo: TestInfo): "webgl" | "webgpu"
{
    return testInfo.project.name as "webgl" | "webgpu";
}

/**
 * レンダラー固有のスナップショット名を生成
 */
export function getSnapshotName(baseName: string, testInfo: TestInfo): string
{
    const renderer = getCurrentRenderer(testInfo);
    return `${baseName}-${renderer}.png`;
}

/**
 * ページにレンダラー設定を注入
 */
export async function injectRendererConfig(page: Page, testInfo: TestInfo): Promise<void>
{
    const renderer = getCurrentRenderer(testInfo);

    await page.addInitScript((rendererType) => {
        (window as any).__NEXT2D_RENDERER__ = rendererType;
    }, renderer);
}

/**
 * レンダラータイプに応じたNext2D設定を返す
 */
export function getNext2DConfig(testInfo: TestInfo): { renderer: string }
{
    return {
        renderer: getCurrentRenderer(testInfo)
    };
}
