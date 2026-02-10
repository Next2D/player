import type { IPath } from "../../interface/IPath";

/**
 * @description メッシュのパスの中で指定座標が含まれる線を探す
 *              Find the lines containing the specified coordinates in the mesh path
 *
 * @param  {number} x
 * @param  {number} y
 * @param  {number} r
 * @param  {IPath} paths
 * @return {number[]}
 * @method
 * @protected
 */
export const execute = (
    x: number,
    y: number,
    r: number,
    paths: IPath
): number[] => {

    const points: number[] = [];
    // 浮動小数点誤差を考慮した許容範囲
    const epsilon = 0.0001;

    for (let idx = 0; idx < paths.length; idx += 3) {

        // カーブのコントロール座標ならスキップ
        if (paths[idx + 2] as boolean) {
            continue;
        }

        const dx = paths[idx] as number;
        const dy = paths[idx + 1] as number;

        const distance = Math.sqrt(
            Math.pow(dx - x, 2) + Math.pow(dy - y, 2)
        );

        // 浮動小数点誤差を考慮した比較
        if (Math.abs(distance - r) > epsilon) {
            continue;
        }

        points.push(dx, dy);
    }

    return points;
};