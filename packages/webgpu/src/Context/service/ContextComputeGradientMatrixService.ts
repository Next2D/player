/**
 * @description グラデーション変換行列を計算
 *              WebGL版と同様の計算: 逆行列を使ってグラデーション空間に変換
 *
 * @param {Float32Array} matrix - グラデーション行列 [a, b, c, d, tx, ty]
 * @param {number} type - グラデーションタイプ (0: linear, 1: radial)
 * @return {Float32Array} - 3x3行列
 */
export const execute = (matrix: Float32Array, type: number): Float32Array => {
    // グラデーション行列の逆行列を計算
    // matrix = [a, b, c, d, tx, ty]
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

    // WebGL版のグラデーション座標系:
    // Linear: x = -819.2 to 819.2 → 0 to 1
    // Radial: 中心(0, 0)、半径819.2
    const scale = 1 / 819.2;

    if (type === 0) {
        // Linear gradient: xを0-1に正規化
        // x' = (x + 819.2) / 1638.4 = x * scale * 0.5 + 0.5
        return new Float32Array([
            ia * scale * 0.5, ib * scale * 0.5, 0,
            ic * scale * 0.5, id * scale * 0.5, 0,
            itx * scale * 0.5 + 0.5, ity * scale * 0.5 + 0.5, 1
        ]);
    } else {
        // Radial gradient: 距離を0-1に正規化
        return new Float32Array([
            ia * scale, ib * scale, 0,
            ic * scale, id * scale, 0,
            itx * scale, ity * scale, 1
        ]);
    }
};
