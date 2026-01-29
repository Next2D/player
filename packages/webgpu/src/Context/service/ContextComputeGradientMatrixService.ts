import {
    isDebugEnabled,
    logGradient,
    logMatrix3x3
} from "../../Debug/DebugLogger";

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

        // デバッグ出力
        if (isDebugEnabled()) {
            logGradient("Linear Gradient Computed", {
                "type": 0,
                gradientMatrix,
                contextMatrix,
                inverseMatrix,
                linearPoints
            });
            logMatrix3x3("Linear inverseMatrix", inverseMatrix);
            logMatrix3x3("Linear linearPoints", linearPoints);
        }

        return { inverseMatrix, linearPoints };
    }
    // === Radial gradient ===
    // WebGPU版: グラデーション行列の逆行列のみを使用
    // シェーダーでは v_uv = inverse(gradient) * position
    // これにより、ローカル座標をグラデーション空間（-819.2 to 819.2）に変換
    //
    // 注意: WebGL版とは異なり、contextMatrixにはアトラスオフセットが含まれているため、
    // contextMatrixを使った合成は行わない

    // グラデーション行列の行列式
    const det = ga * gd - gb * gc;
    if (Math.abs(det) < 1e-10) {
        return {
            "inverseMatrix": new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]),
            "linearPoints": null
        };
    }

    const invDet = 1 / det;

    // inverse(gradient) を計算
    const invA = gd * invDet;
    const invB = -gb * invDet;
    const invC = -gc * invDet;
    const invD = ga * invDet;
    const invTx = (gc * gty - gd * gtx) * invDet;
    const invTy = (gb * gtx - ga * gty) * invDet;

    // 逆行列（シェーダーでは v_uv = inverseMatrix * position）
    const inverseMatrix = new Float32Array([
        invA, invB, 0,
        invC, invD, 0,
        invTx, invTy, 1
    ]);

    // デバッグ出力
    if (isDebugEnabled()) {
        logGradient("Radial Gradient Computed", {
            "type": 1,
            gradientMatrix,
            contextMatrix,
            inverseMatrix,
            "linearPoints": null
        });
        logMatrix3x3("Radial inverseMatrix", inverseMatrix);
        console.log("[Radial Debug] Gradient matrix:", {
            "a": ga, "b": gb, "c": gc, "d": gd,
            "tx": gtx, "ty": gty, det
        });
        console.log("[Radial Debug] Inverse gradient:", {
            "a": invA, "b": invB, "c": invC, "d": invD,
            "tx": invTx, "ty": invTy
        });
    }

    return { inverseMatrix, "linearPoints": null };

};
