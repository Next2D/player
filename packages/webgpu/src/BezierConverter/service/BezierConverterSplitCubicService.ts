import type { IPoint } from "../../interface/IPoint";

/**
 * @description 三次ベジェ曲線をパラメータt=0.5で2分割
 *              Split cubic bezier curve at t=0.5 using De Casteljau algorithm
 *
 * @param {IPoint} p0 - 始点
 * @param {IPoint} p1 - 制御点1
 * @param {IPoint} p2 - 制御点2
 * @param {IPoint} p3 - 終点
 * @return {{ first: IPoint[], second: IPoint[] }} 分割された2つの曲線
 */
export const execute = (
    p0: IPoint,
    p1: IPoint,
    p2: IPoint,
    p3: IPoint
): { first: IPoint[], second: IPoint[] } => {

    // De Casteljau algorithm at t = 0.5
    // 中点を計算することで精度を保ちながら分割

    // レベル1: 各辺の中点
    const p01: IPoint = {
        "x": (p0.x + p1.x) * 0.5,
        "y": (p0.y + p1.y) * 0.5
    };
    const p12: IPoint = {
        "x": (p1.x + p2.x) * 0.5,
        "y": (p1.y + p2.y) * 0.5
    };
    const p23: IPoint = {
        "x": (p2.x + p3.x) * 0.5,
        "y": (p2.y + p3.y) * 0.5
    };

    // レベル2: レベル1の中点
    const p012: IPoint = {
        "x": (p01.x + p12.x) * 0.5,
        "y": (p01.y + p12.y) * 0.5
    };
    const p123: IPoint = {
        "x": (p12.x + p23.x) * 0.5,
        "y": (p12.y + p23.y) * 0.5
    };

    // レベル3: 分割点
    const p0123: IPoint = {
        "x": (p012.x + p123.x) * 0.5,
        "y": (p012.y + p123.y) * 0.5
    };

    return {
        // 前半の曲線: p0 -> p01 -> p012 -> p0123
        "first": [p0, p01, p012, p0123],
        // 後半の曲線: p0123 -> p123 -> p23 -> p3
        "second": [p0123, p123, p23, p3]
    };
};
