/**
 * @description ビットマップ変換行列を計算（逆行列）
 *              Compute bitmap transformation matrix (inverse matrix)
 *
 * @param {Float32Array} matrix - ビットマップ行列 [a, b, c, d, tx, ty]
 * @return {Float32Array} - 3x3行列
 */
export const execute = (matrix: Float32Array): Float32Array => {
    const a = matrix[0];
    const b = matrix[1];
    const c = matrix[2];
    const d = matrix[3];
    const tx = matrix[4];
    const ty = matrix[5];

    // 行列式
    const det = a * d - b * c;
    if (Math.abs(det) < 1e-10) {
        // 特異行列の場合は単位行列を返す
        return new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);
    }

    const invDet = 1 / det;

    // 逆行列を計算
    const ia = d * invDet;
    const ib = -b * invDet;
    const ic = -c * invDet;
    const id = a * invDet;
    const itx = (c * ty - d * tx) * invDet;
    const ity = (b * tx - a * ty) * invDet;

    return new Float32Array([
        ia, ib, 0,
        ic, id, 0,
        itx, ity, 1
    ]);
};
