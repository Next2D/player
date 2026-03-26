/**
 * @description メッシュ生成結果の共通インターフェース
 *              Common interface for mesh generation results
 */
export interface IMeshResult {
    /**
     * @description 頂点データバッファ
     *              Vertex data buffer
     */
    buffer: Float32Array;
    /**
     * @description インデックスの数（描画する三角形の頂点数）
     *              Number of indices (vertex count for drawing triangles)
     */
    indexCount: number;
}
