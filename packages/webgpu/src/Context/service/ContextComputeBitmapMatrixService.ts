/**
 * @description ビットマップ行列とコンテキスト行列からテクスチャマッピング用の逆行列を計算する
 *              Computes the inverse matrix for texture mapping from bitmap and context matrices
 * @param {Float32Array} bitmap_matrix ビットマップ変換行列 / Bitmap transformation matrix
 * @param {Float32Array} context_matrix コンテキスト変換行列 / Context transformation matrix
 * @return {Float32Array} 列優先形式の3x3逆行列 / Column-major 3x3 inverse matrix
 */
export const execute = (bitmap_matrix: Float32Array, context_matrix: Float32Array): Float32Array => {
    // ビットマップ行列 [a, b, c, d, tx, ty]
    const ba = bitmap_matrix[0];
    const bb = bitmap_matrix[1];
    const bc = bitmap_matrix[2];
    const bd = bitmap_matrix[3];
    const btx = bitmap_matrix[4];
    const bty = bitmap_matrix[5];

    // コンテキスト行列 [a, b, 0, c, d, 0, tx, ty, 1]
    const ca = context_matrix[0];
    const cb = context_matrix[1];
    const cc = context_matrix[3];
    const cd = context_matrix[4];
    const ctx = context_matrix[6];
    const cty = context_matrix[7];

    // Step 1: コンテキスト行列 × ビットマップ行列 を計算
    // WebGLの$context.transform()と同じ順序: new = context × bitmap
    // Flash Matrix乗算: C × B where
    //   C = [ca, cb, cc, cd, ctx, cty], B = [ba, bb, bc, bd, btx, bty]
    // 結果:
    //   ma = ca*ba + cc*bb (x'のxからの係数)
    //   mb = ca*bc + cc*bd (x'のyからの係数)
    //   mc = cb*ba + cd*bb (y'のxからの係数)
    //   md = cb*bc + cd*bd (y'のyからの係数)
    const ma = ca * ba + cc * bb;
    const mb = ca * bc + cc * bd;
    const mc = cb * ba + cd * bb;
    const md = cb * bc + cd * bd;
    const mtx = ca * btx + cc * bty + ctx;
    const mty = cb * btx + cd * bty + cty;

    // Step 2: 合成行列の逆行列を計算
    const det = ma * md - mb * mc;
    if (Math.abs(det) < 1e-10) {
        // 特異行列の場合は単位行列を返す
        return new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);
    }

    const invDet = 1 / det;
    const ia = md * invDet;
    const ib = -mb * invDet;
    const ic = -mc * invDet;
    const id = ma * invDet;
    // Flash Matrix inverse translation:
    // inv_tx = (c*ty - d*tx)/det = (mb*mty - md*mtx)/det
    // inv_ty = (b*tx - a*ty)/det = (mc*mtx - ma*mty)/det
    const itx = (mb * mty - md * mtx) * invDet;
    const ity = (mc * mtx - ma * mty) * invDet;

    // Step 3: 逆行列 × コンテキスト行列 を計算
    // 逆行列変換: x' = ia*x + ib*y + itx, y' = ic*x + id*y + ity
    // コンテキスト変換: x' = ca*x + cc*y + ctx, y' = cb*x + cd*y + cty
    // 合成結果:
    //   ra = ia*ca + ib*cb (x'のxからの係数)
    //   rb = ia*cc + ib*cd (x'のyからの係数)
    //   rc = ic*ca + id*cb (y'のxからの係数)
    //   rd = ic*cc + id*cd (y'のyからの係数)
    const ra = ia * ca + ib * cb;
    const rb = ia * cc + ib * cd;
    const rc = ic * ca + id * cb;
    const rd = ic * cc + id * cd;
    const rtx = ia * ctx + ib * cty + itx;
    const rty = ic * ctx + id * cty + ity;

    // 結果をFlash Matrix形式に変換
    // ra = x'のxからの係数 = Flash a
    // rb = x'のyからの係数 = Flash c
    // rc = y'のxからの係数 = Flash b
    // rd = y'のyからの係数 = Flash d

    // 列優先形式で出力: col0=(a,b,0), col1=(c,d,0), col2=(tx,ty,1)
    // WGSLのmat3x3は列優先で、各列が連続して格納される
    // Flash変換: x' = a*x + c*y + tx, y' = b*x + d*y + ty
    return new Float32Array([
        ra, rc, 0,   // col0: (Flash_a, Flash_b, 0)
        rb, rd, 0,   // col1: (Flash_c, Flash_d, 0)
        rtx, rty, 1  // col2: (tx, ty, 1)
    ]);
};
