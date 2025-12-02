import type { IPoint } from "../../interface/IPoint";

/**
 * @description ストローク用のアウトラインメッシュを生成
 * @param {IPoint[]} path
 * @param {number} thickness
 * @return {IPoint[][]}
 */
export const generateStrokeOutline = (path: IPoint[], thickness: number): IPoint[][] =>
{
    if (path.length < 2) {
        return [];
    }

    const leftPoints: IPoint[] = [];
    const rightPoints: IPoint[] = [];

    for (let i = 0; i < path.length; i++) {
        const current = path[i];
        
        let dirX = 0;
        let dirY = 0;

        if (i === 0) {
            // 最初の点: 次の点への方向
            const next = path[i + 1];
            dirX = next.x - current.x;
            dirY = next.y - current.y;
        } else if (i === path.length - 1) {
            // 最後の点: 前の点からの方向
            const prev = path[i - 1];
            dirX = current.x - prev.x;
            dirY = current.y - prev.y;
        } else {
            // 中間の点: 前後の平均方向
            const prev = path[i - 1];
            const next = path[i + 1];
            dirX = (next.x - prev.x) / 2;
            dirY = (next.y - prev.y) / 2;
        }

        // 正規化
        const len = Math.sqrt(dirX * dirX + dirY * dirY);
        if (len > 0) {
            dirX /= len;
            dirY /= len;
        }

        // 垂直ベクトル
        const perpX = -dirY;
        const perpY = dirX;

        // 左右の点を生成
        leftPoints.push({
            x: current.x + perpX * thickness,
            y: current.y + perpY * thickness
        });

        rightPoints.push({
            x: current.x - perpX * thickness,
            y: current.y - perpY * thickness
        });
    }

    // 左側→右側の逆順で閉じたパスを作成
    const outline = [...leftPoints, ...rightPoints.reverse()];
    
    return [outline];
};

/**
 * @description ストロークメッシュを生成
 * @param {IPoint[][]} paths
 * @param {number} thickness
 * @return {Float32Array}
 */
export const generateStrokeMesh = (paths: IPoint[][], thickness: number): Float32Array =>
{
    const triangles: number[] = [];

    for (const path of paths) {
        const outlines = generateStrokeOutline(path, thickness);
        
        for (const outline of outlines) {
            if (outline.length < 3) continue;

            // 単純な三角形分割（扇形）
            for (let i = 1; i < outline.length - 1; i++) {
                triangles.push(
                    outline[0].x, outline[0].y, 0, 0,
                    outline[i].x, outline[i].y, 0, 0,
                    outline[i + 1].x, outline[i + 1].y, 0, 0
                );
            }
        }
    }

    return new Float32Array(triangles);
};
