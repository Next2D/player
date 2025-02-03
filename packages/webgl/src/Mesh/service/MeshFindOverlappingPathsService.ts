import type { IPath } from "../../interface/IPath";

/**
 * @description メッシュのパスの中で指定座標が含まれる線を探す
 *              Find lines in the path of the mesh that contain the specified coordinates
 *
 * @param  {number} x
 * @param  {number} y
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
    for (let idx = 0; idx < paths.length; idx += 3) {

        // カーブのコントロール座標なら終了
        if (paths[idx + 2] as boolean) {
            continue;
        }

        const dx = paths[idx    ] as number;
        const dy = paths[idx + 1] as number;

        const distance = Math.sqrt(
            Math.pow(dx - x, 2) + Math.pow(dy - y, 2)
        );

        if (distance !== r) {
            continue;
        }

        points.push(dx, dy);
    }

    return points;
};