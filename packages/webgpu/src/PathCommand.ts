import type { IPoint } from "./interface/IPoint";
import type { IPath } from "./interface/IPath";

/**
 * @description WebGPU用パスコマンド（WebGL互換形式）
 *              Path commands for WebGPU (WebGL compatible format)
 *
 * パス形式: [x, y, isControlPoint, x, y, isControlPoint, ...]
 * - isControlPoint = true: 二次ベジェ曲線の制御点
 * - isControlPoint = false: 通常の頂点または終点
 */
export class PathCommand
{
    private $currentPath: IPath;
    private $vertices: IPath[];
    private $currentX: number;
    private $currentY: number;
    private $startX: number;
    private $startY: number;

    /**
     * @constructor
     */
    constructor()
    {
        this.$currentPath = [];
        this.$vertices = [];
        this.$currentX = 0;
        this.$currentY = 0;
        this.$startX = 0;
        this.$startY = 0;
    }

    /**
     * @description パスを開始
     * @return {void}
     */
    beginPath(): void
    {
        this.$currentPath = [];
        this.$vertices = [];
        this.$currentX = 0;
        this.$currentY = 0;
        this.$startX = 0;
        this.$startY = 0;
    }

    /**
     * @description パスを移動
     * @param {number} x
     * @param {number} y
     * @return {void}
     */
    moveTo(x: number, y: number): void
    {
        if (this.$currentPath.length >= 10) {
            this.$vertices.push(this.$currentPath);
        }

        this.$currentPath = [x, y, false];
        this.$currentX = x;
        this.$currentY = y;
        this.$startX = x;
        this.$startY = y;
    }

    /**
     * @description 直線を描画
     * @param {number} x
     * @param {number} y
     * @return {void}
     */
    lineTo(x: number, y: number): void
    {
        // 同じ点への移動は無視
        if (x === this.$currentX && y === this.$currentY) {
            return;
        }

        this.$currentPath.push(x, y, false);
        this.$currentX = x;
        this.$currentY = y;
    }

    /**
     * @description 二次ベジェ曲線を描画（Loop-Blinn方式対応）
     * @param {number} cx
     * @param {number} cy
     * @param {number} x
     * @param {number} y
     * @return {void}
     */
    quadraticCurveTo(cx: number, cy: number, x: number, y: number): void
    {
        // 制御点 (isControlPoint = true)
        this.$currentPath.push(cx, cy, true);
        // 終点 (isControlPoint = false)
        this.$currentPath.push(x, y, false);

        this.$currentX = x;
        this.$currentY = y;
    }

    /**
     * @description 三次ベジェ曲線を二次ベジェ曲線に近似
     * @param {number} cx1
     * @param {number} cy1
     * @param {number} cx2
     * @param {number} cy2
     * @param {number} x
     * @param {number} y
     * @return {void}
     */
    bezierCurveTo(
        cx1: number, cy1: number,
        cx2: number, cy2: number,
        x: number, y: number
    ): void {
        // 三次ベジェを複数の二次ベジェに分割して近似
        const segments = 4;
        const startX = this.$currentX;
        const startY = this.$currentY;

        for (let i = 0; i < segments; i++) {
            const t0 = i / segments;
            const t1 = (i + 1) / segments;

            // 分割区間の始点、中点、終点を計算
            const p0 = this.$getCubicPoint(startX, startY, cx1, cy1, cx2, cy2, x, y, t0);
            const p1 = this.$getCubicPoint(startX, startY, cx1, cy1, cx2, cy2, x, y, (t0 + t1) / 2);
            const p2 = this.$getCubicPoint(startX, startY, cx1, cy1, cx2, cy2, x, y, t1);

            // 二次ベジェの制御点を近似計算
            const ctrl = {
                x: 2 * p1.x - 0.5 * (p0.x + p2.x),
                y: 2 * p1.y - 0.5 * (p0.y + p2.y)
            };

            this.$currentPath.push(ctrl.x, ctrl.y, true);
            this.$currentPath.push(p2.x, p2.y, false);
        }

        this.$currentX = x;
        this.$currentY = y;
    }

    /**
     * @description 三次ベジェ曲線上の点を計算
     * @private
     */
    private $getCubicPoint(
        x0: number, y0: number,
        x1: number, y1: number,
        x2: number, y2: number,
        x3: number, y3: number,
        t: number
    ): IPoint {
        const mt = 1 - t;
        const mt2 = mt * mt;
        const mt3 = mt2 * mt;
        const t2 = t * t;
        const t3 = t2 * t;

        return {
            x: mt3 * x0 + 3 * mt2 * t * x1 + 3 * mt * t2 * x2 + t3 * x3,
            y: mt3 * y0 + 3 * mt2 * t * y1 + 3 * mt * t2 * y2 + t3 * y3
        };
    }

    /**
     * @description 円弧を二次ベジェ曲線で近似
     * @param {number} x
     * @param {number} y
     * @param {number} radius
     * @return {void}
     */
    arc(x: number, y: number, radius: number): void
    {
        // 円を8つの二次ベジェ曲線で近似
        const segments = 8;
        const angleStep = (Math.PI * 2) / segments;

        for (let i = 0; i < segments; i++) {
            const angle0 = i * angleStep;
            const angle1 = (i + 1) * angleStep;

            const cos0 = Math.cos(angle0);
            const sin0 = Math.sin(angle0);
            const cos1 = Math.cos(angle1);
            const sin1 = Math.sin(angle1);

            const x0 = x + radius * cos0;
            const y0 = y + radius * sin0;
            const x1 = x + radius * cos1;
            const y1 = y + radius * sin1;

            // 制御点（二次ベジェ近似）
            const mid = (angle0 + angle1) / 2;
            const controlRadius = radius / Math.cos((angle1 - angle0) / 2);
            const cx = x + controlRadius * Math.cos(mid);
            const cy = y + controlRadius * Math.sin(mid);

            if (i === 0) {
                this.moveTo(x0, y0);
            }

            this.$currentPath.push(cx, cy, true);
            this.$currentPath.push(x1, y1, false);
        }

        this.$currentX = x + radius;
        this.$currentY = y;
    }

    /**
     * @description パスを閉じる
     * @return {void}
     */
    closePath(): void
    {
        if (this.$currentPath.length >= 3) {
            // 始点に戻る直線
            if (this.$currentX !== this.$startX || this.$currentY !== this.$startY) {
                this.$currentPath.push(this.$startX, this.$startY, false);
            }
        }
    }

    /**
     * @description 頂点データを取得
     * @return {IPath[]}
     */
    get $getVertices(): IPath[]
    {
        const vertices = [...this.$vertices];
        if (this.$currentPath.length >= 10) {
            vertices.push(this.$currentPath);
        }
        return vertices;
    }

    /**
     * @description パスから頂点配列を生成（従来互換用・単純なfan triangulation）
     * @return {Float32Array}
     */
    generateVertices(): Float32Array
    {
        const vertices = this.$getVertices;
        const triangles: number[] = [];

        for (const path of vertices) {
            if (path.length < 9) continue; // 最低3点（9要素）必要

            // 点を抽出
            const points: IPoint[] = [];
            for (let i = 0; i < path.length; i += 3) {
                points.push({ x: path[i] as number, y: path[i + 1] as number });
            }

            // Fan triangulation
            for (let i = 1; i < points.length - 1; i++) {
                triangles.push(
                    points[0].x, points[0].y,
                    points[i].x, points[i].y,
                    points[i + 1].x, points[i + 1].y
                );
            }
        }

        return new Float32Array(triangles);
    }

    /**
     * @description 現在のパスを取得（ストローク用）
     * @return {IPoint[]}
     */
    getCurrentPath(): IPoint[]
    {
        const points: IPoint[] = [];
        for (let i = 0; i < this.$currentPath.length; i += 3) {
            points.push({
                x: this.$currentPath[i] as number,
                y: this.$currentPath[i + 1] as number
            });
        }
        return points;
    }

    /**
     * @description すべてのパスを取得（ストローク用）
     * @return {IPoint[][]}
     */
    getAllPaths(): IPoint[][]
    {
        const allPaths: IPoint[][] = [];

        for (const path of this.$vertices) {
            const points: IPoint[] = [];
            for (let i = 0; i < path.length; i += 3) {
                points.push({
                    x: path[i] as number,
                    y: path[i + 1] as number
                });
            }
            if (points.length > 0) {
                allPaths.push(points);
            }
        }

        if (this.$currentPath.length >= 3) {
            const points: IPoint[] = [];
            for (let i = 0; i < this.$currentPath.length; i += 3) {
                points.push({
                    x: this.$currentPath[i] as number,
                    y: this.$currentPath[i + 1] as number
                });
            }
            if (points.length > 0) {
                allPaths.push(points);
            }
        }

        return allPaths;
    }

    /**
     * @description リセット
     * @return {void}
     */
    reset(): void
    {
        this.$currentPath = [];
        this.$vertices = [];
        this.$currentX = 0;
        this.$currentY = 0;
        this.$startX = 0;
        this.$startY = 0;
    }
}
