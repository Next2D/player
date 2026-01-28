/**
 * @description グラデーション変換データを計算
 *              WebGL版と同様の計算を実装
 *
 * WebGL版のフロー:
 * - Linear: v_uv = position (生の頂点座標)
 *           linearPoints = $linearGradientXY(gradientMatrix) - グラデーション行列で計算
 *           シェーダーでは t = dot(ab, ap) / dot(ab, ab) を使用
 * - Radial: v_uv = (inverse(context * gradient) * context * position).xy
 *           = (inverse(combined) * context * position).xy
 *           WebGL版: context.transform(gradient) してから inverseMatrix = inverse($context.$matrix)
 *           シェーダーでは inverse_matrix * uv_matrix * position を計算
 *           ここで uv_matrix = prevContext (gradient適用前), inverse_matrix = inverse(context * gradient)
 *
 * @param {Float32Array} gradientMatrix - グラデーション行列 [a, b, c, d, tx, ty]
 * @param {Float32Array} contextMatrix - コンテキスト行列 (9要素: 3x3行列)
 * @param {number} type - グラデーションタイプ (0: linear, 1: radial)
 * @return {object} - { inverseMatrix: Float32Array, linearPoints: Float32Array | null }
 */
export const execute = (
    gradientMatrix: Float32Array,
    contextMatrix: Float32Array,
    type: number
): { inverseMatrix: Float32Array; linearPoints: Float32Array | null } => {
    // グラデーション行列
    const ga = gradientMatrix[0];
    const gb = gradientMatrix[1];
    const gc = gradientMatrix[2];
    const gd = gradientMatrix[3];
    const gtx = gradientMatrix[4];
    const gty = gradientMatrix[5];

    if (type === 0) {
        // === Linear gradient ===
        // WebGL版と同じ: $linearGradientXY(matrix)で点a, bを計算
        // 点を計算（グラデーション行列を使って）
        // x0, y0: (-819.2, -819.2)を変換
        // x1, y1: (819.2, -819.2)を変換
        // x2, y2: (-819.2, 819.2)を変換
        const x0 = -819.2 * ga - 819.2 * gc + gtx;
        const x1 =  819.2 * ga - 819.2 * gc + gtx;
        const x2 = -819.2 * ga + 819.2 * gc + gtx;
        const y0 = -819.2 * gb - 819.2 * gd + gty;
        const y1 =  819.2 * gb - 819.2 * gd + gty;
        const y2 = -819.2 * gb + 819.2 * gd + gty;

        let vx2 = x2 - x0;
        let vy2 = y2 - y0;

        const r1 = Math.sqrt(vx2 * vx2 + vy2 * vy2);
        if (r1) {
            vx2 = vx2 / r1;
            vy2 = vy2 / r1;
        } else {
            vx2 = 0;
            vy2 = 0;
        }

        const r2 = (x1 - x0) * vx2 + (y1 - y0) * vy2;

        // 点a, b（グラデーションの始点と終点）
        // これらはグラデーション行列で変換された座標空間にある
        const linearPoints = new Float32Array([
            x0 + r2 * vx2, y0 + r2 * vy2, // 点a
            x1, y1 // 点b
        ]);

        // WebGL版と同じ:
        // v_uv = (inverse_matrix * uv_matrix * position).xy
        // ここで inverse_matrix = inverse(context), uv_matrix = context
        // つまり v_uv = inverse(context) * context * position = position (生の頂点座標)
        //
        // linearPointsはグラデーション行列変換後の座標空間にあり、
        // フラグメントシェーダーで p = v_uv (生の頂点座標) と linearPoints を使って
        // t = dot(ab, ap) / dot(ab, ab) を計算する
        //
        // シェーダーでは v_uv = inverseMatrix * position なので、
        // inverseMatrix = 単位行列 にすることで v_uv = position になる
        const inverseMatrix = new Float32Array([
            1, 0, 0,
            0, 1, 0,
            0, 0, 1
        ]);

        return { inverseMatrix, linearPoints };
    }
    // === Radial gradient ===
    // WebGL版のフロー:
    // 1. context.transform(gradient) で context行列にgradient行列を合成
    // 2. prevMatrix = 合成前のcontext行列
    // 3. inverseMatrix = inverse(context * gradient)
    // 4. シェーダー: v_uv = (inverseMatrix * prevMatrix * position).xy
    //    = inverse(context * gradient) * context * position
    //
    // これにより、position を context で変換した後、
    // gradient のローカル座標系に変換する

    // コンテキスト行列を取得 (3x3: indices 0,1,3,4,6,7 が a,b,c,d,tx,ty)
    const ca = contextMatrix[0];
    const cb = contextMatrix[1];
    const cc = contextMatrix[3];
    const cd = contextMatrix[4];
    const ctx = contextMatrix[6];
    const cty = contextMatrix[7];

    // context * gradient の合成行列を計算
    // | ca cb | * | ga gb | = | ca*ga+cb*gc  ca*gb+cb*gd |
    // | cc cd |   | gc gd |   | cc*ga+cd*gc  cc*gb+cd*gd |
    //
    // translation: | ca cb | * | gtx | + | ctx |
    //              | cc cd |   | gty |   | cty |
    const combinedA = ca * ga + cb * gc;
    const combinedB = ca * gb + cb * gd;
    const combinedC = cc * ga + cd * gc;
    const combinedD = cc * gb + cd * gd;
    const combinedTx = ca * gtx + cb * gty + ctx;
    const combinedTy = cc * gtx + cd * gty + cty;

    // 合成行列の行列式
    const det = combinedA * combinedD - combinedB * combinedC;
    if (Math.abs(det) < 1e-10) {
        return {
            "inverseMatrix": new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]),
            "linearPoints": null
        };
    }

    const invDet = 1 / det;

    // inverse(context * gradient) を計算
    const invCombinedA = combinedD * invDet;
    const invCombinedB = -combinedB * invDet;
    const invCombinedC = -combinedC * invDet;
    const invCombinedD = combinedA * invDet;
    const invCombinedTx = (combinedC * combinedTy - combinedD * combinedTx) * invDet;
    const invCombinedTy = (combinedB * combinedTx - combinedA * combinedTy) * invDet;

    // 次に inverseMatrix * contextMatrix を計算
    // これが最終的なシェーダーに渡す逆行列
    // inverse(context * gradient) * context
    const finalA = invCombinedA * ca + invCombinedB * cc;
    const finalB = invCombinedA * cb + invCombinedB * cd;
    const finalC = invCombinedC * ca + invCombinedD * cc;
    const finalD = invCombinedC * cb + invCombinedD * cd;
    const finalTx = invCombinedA * ctx + invCombinedB * cty + invCombinedTx;
    const finalTy = invCombinedC * ctx + invCombinedD * cty + invCombinedTy;

    // 最終的な逆行列（シェーダーでは v_uv = finalMatrix * position）
    const inverseMatrix = new Float32Array([
        finalA, finalB, 0,
        finalC, finalD, 0,
        finalTx, finalTy, 1
    ]);

    return { inverseMatrix, "linearPoints": null };

};
