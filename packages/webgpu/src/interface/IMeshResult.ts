/**
 * @description メッシュ生成結果の共通インターフェース
 *              Common interface for mesh generation results
 */
export interface IMeshResult {
    buffer: Float32Array;
    indexCount: number;
}
