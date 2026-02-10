import type { IPoint } from "../../interface/IPoint";

/**
 * @description 三次ベジェ曲線のフラットネス（平坦度）を計算
 *              Calculate flatness of cubic bezier curve
 *
 * フラットネスは曲線がどれだけ直線に近いかを示す値。
 * 制御点から始点-終点を結ぶ直線までの最大距離を計算。
 *
 * @param {IPoint} p0 - 始点
 * @param {IPoint} p1 - 制御点1
 * @param {IPoint} p2 - 制御点2
 * @param {IPoint} p3 - 終点
 * @return {number} フラットネス値（距離の2乗）
 */
export const execute = (
    p0: IPoint,
    p1: IPoint,
    p2: IPoint,
    p3: IPoint
): number => {

    // 始点から終点へのベクトル
    const dx = p3.x - p0.x;
    const dy = p3.y - p0.y;

    // ベクトルの長さの2乗
    const lengthSq = dx * dx + dy * dy;

    // 始点と終点が同じ場合、制御点からの最大距離を返す
    if (lengthSq < 1e-10) {
        const d1 = (p1.x - p0.x) * (p1.x - p0.x) + (p1.y - p0.y) * (p1.y - p0.y);
        const d2 = (p2.x - p0.x) * (p2.x - p0.x) + (p2.y - p0.y) * (p2.y - p0.y);
        return Math.max(d1, d2);
    }

    // 制御点から直線への距離を計算（クロス積を使用）
    // 距離 = |cross product| / |line length|
    // 距離の2乗を計算して sqrt を避ける

    // 制御点1から直線への距離の2乗
    const cross1 = (p1.x - p0.x) * dy - (p1.y - p0.y) * dx;
    const d1 = cross1 * cross1 / lengthSq;

    // 制御点2から直線への距離の2乗
    const cross2 = (p2.x - p0.x) * dy - (p2.y - p0.y) * dx;
    const d2 = cross2 * cross2 / lengthSq;

    // 最大距離を返す
    return Math.max(d1, d2);
};
