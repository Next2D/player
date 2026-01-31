import type { IPoint } from "./interface/IPoint";
import type { IPath } from "./interface/IPath";
import {
    adaptiveCubicToQuad,
    calculateAdaptiveThreshold
} from "./BezierConverter/BezierConverter";

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
     * @description フラットネス閾値（スケールに応じて調整可能）
     *              Flatness threshold for adaptive tessellation
     *              0.25 = 0.5px squared（滑らかなストローク描画用）
     */
    private $flatnessThreshold: number = 0.25;

    /**
     * @description フラットネス閾値を設定
     *              Set flatness threshold for adaptive bezier tessellation
     * @param {number} scale - 現在のスケール（行列のスケール成分）
     * @return {void}
     */
    setScale(scale: number): void
    {
        this.$flatnessThreshold = calculateAdaptiveThreshold(scale);
    }

    /**
     * @description 三次ベジェ曲線を二次ベジェ曲線に適応的に近似
     *              Adaptively approximate cubic bezier with quadratic beziers
     *
     * フラットネス（平坦度）に基づいて動的に分割数を決定。
     * 単純な曲線は少ない分割、複雑な曲線は多い分割を行う。
     *
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
        // 適応的テッセレーションで三次ベジェを二次ベジェ群に変換
        const p0: IPoint = { "x": this.$currentX, "y": this.$currentY };
        const p1: IPoint = { "x": cx1, "y": cy1 };
        const p2: IPoint = { "x": cx2, "y": cy2 };
        const p3: IPoint = { "x": x, "y": y };

        const segments = adaptiveCubicToQuad(
            p0, p1, p2, p3,
            this.$flatnessThreshold
        );

        // 各二次ベジェセグメントをパスに追加
        for (const segment of segments) {
            this.$currentPath.push(segment.ctrl.x, segment.ctrl.y, true);
            this.$currentPath.push(segment.end.x, segment.end.y, false);
        }

        this.$currentX = x;
        this.$currentY = y;
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
        const angleStep = Math.PI * 2 / segments;

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
            if (path.length < 9) { continue } // 最低3点（9要素）必要

            // 点を抽出
            const points: IPoint[] = [];
            for (let i = 0; i < path.length; i += 3) {
                points.push({ "x": path[i] as number, "y": path[i + 1] as number });
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
                "x": this.$currentPath[i] as number,
                "y": this.$currentPath[i + 1] as number
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
                    "x": path[i] as number,
                    "y": path[i + 1] as number
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
                    "x": this.$currentPath[i] as number,
                    "y": this.$currentPath[i + 1] as number
                });
            }
            if (points.length > 0) {
                allPaths.push(points);
            }
        }

        return allPaths;
    }

    /**
     * @description WebGL互換形式でパスを取得（ストローク用）
     *              [x, y, isCurve, x, y, isCurve, ...] 形式
     * @return {IPath[]}
     */
    getVerticesForStroke(): IPath[]
    {
        const vertices = [...this.$vertices];
        if (this.$currentPath.length >= 6) {
            vertices.push(this.$currentPath);
        }
        return vertices;
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
