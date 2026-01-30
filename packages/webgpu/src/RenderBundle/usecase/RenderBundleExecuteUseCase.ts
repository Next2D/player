/**
 * @description Render Bundleを実行
 *              Execute Render Bundle in a render pass
 *
 * @param {GPURenderPassEncoder} passEncoder - レンダーパスエンコーダー
 * @param {GPURenderBundle[]} bundles - 実行するバンドルの配列
 * @return {void}
 */
export const execute = (
    passEncoder: GPURenderPassEncoder,
    bundles: GPURenderBundle[]
): void => {

    if (bundles.length === 0) {
        return;
    }

    // 複数のバンドルを一度に実行（効率的）
    passEncoder.executeBundles(bundles);
};
