import type { IPoint } from "./interface/IPoint";
import type { IPath } from "./interface/IPath";
import { adaptiveCubicToQuad } from "./BezierConverter/BezierConverter";

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
        // stroke用は2点以上（6要素）、fill用は3点以上（9要素）が必要
        // WebGL版と同じ: stroke描画に対応するため6要素以上で保存
        if (this.$currentPath.length >= 6) {
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
     * @description 円弧を描画（WebGL版と同じ実装: 4つの三次ベジェ曲線を使用）
     * @param {number} x
     * @param {number} y
     * @param {number} radius
     * @return {void}
     */
    arc(x: number, y: number, radius: number): void
    {
        const r = radius;
        const k = radius * 0.5522847498307936; // 円を三次ベジェで近似するための定数

        // 4つの三次ベジェ曲線で円を描画
        // 始点: (x + r, y)
        // 各象限を1つの三次ベジェ曲線で描画

        // 第1象限: (x + r, y) -> (x, y + r)
        this.bezierCurveTo(
            x + r, y + k,
            x + k, y + r,
            x, y + r
        );

        // 第2象限: (x, y + r) -> (x - r, y)
        this.bezierCurveTo(
            x - k, y + r,
            x - r, y + k,
            x - r, y
        );

        // 第3象限: (x - r, y) -> (x, y - r)
        this.bezierCurveTo(
            x - r, y - k,
            x - k, y - r,
            x, y - r
        );

        // 第4象限: (x, y - r) -> (x + r, y) - 終点は始点と同じ
        this.bezierCurveTo(
            x + k, y - r,
            x + r, y - k,
            x + r, y
        );

        // 閉じた円の終点を始点座標で強制上書き（浮動小数点誤差を排除）
        // ストロークのjoin処理で始点と終点が完全一致する必要があるため
        const pathLength = this.$currentPath.length;
        if (pathLength >= 3) {
            this.$currentPath[pathLength - 3] = this.$startX;
            this.$currentPath[pathLength - 2] = this.$startY;
        }

        this.$currentX = this.$startX;
        this.$currentY = this.$startY;
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
     * @description 頂点データを取得（fill用: 3点以上が必要）
     * @return {IPath[]}
     */
    get $getVertices(): IPath[]
    {
        const vertices = [...this.$vertices];
        // fill用は3点以上（9要素）が必要
        if (this.$currentPath.length >= 9) {
            vertices.push(this.$currentPath);
        }
        return vertices;
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
