import type { IPoint } from "./interface/IPoint";

/**
 * @description WebGPU用パスコマンド
 *              Path commands for WebGPU
 */
export class PathCommand
{
    private currentPath: IPoint[];
    private paths: IPoint[][];
    private currentPoint: IPoint;

    /**
     * @constructor
     */
    constructor()
    {
        this.currentPath = [];
        this.paths = [];
        this.currentPoint = { x: 0, y: 0 };
    }

    /**
     * @description パスを開始
     * @return {void}
     */
    beginPath(): void
    {
        this.currentPath = [];
        this.paths = [];
        this.currentPoint = { x: 0, y: 0 };
    }

    /**
     * @description パスを移動
     * @param {number} x
     * @param {number} y
     * @return {void}
     */
    moveTo(x: number, y: number): void
    {
        if (this.currentPath.length > 0) {
            this.paths.push([...this.currentPath]);
            this.currentPath = [];
        }
        this.currentPoint = { x, y };
        this.currentPath.push({ x, y });
    }

    /**
     * @description 直線を描画
     * @param {number} x
     * @param {number} y
     * @return {void}
     */
    lineTo(x: number, y: number): void
    {
        this.currentPath.push({ x, y });
        this.currentPoint = { x, y };
    }

    /**
     * @description 二次ベジェ曲線を描画
     * @param {number} cx
     * @param {number} cy
     * @param {number} x
     * @param {number} y
     * @return {void}
     */
    quadraticCurveTo(cx: number, cy: number, x: number, y: number): void
    {
        const steps = 20;
        const startX = this.currentPoint.x;
        const startY = this.currentPoint.y;

        for (let i = 1; i <= steps; i++) {
            const t = i / steps;
            const mt = 1 - t;
            
            const px = mt * mt * startX + 2 * mt * t * cx + t * t * x;
            const py = mt * mt * startY + 2 * mt * t * cy + t * t * y;
            
            this.currentPath.push({ x: px, y: py });
        }

        this.currentPoint = { x, y };
    }

    /**
     * @description 三次ベジェ曲線を描画
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
        const steps = 20;
        const startX = this.currentPoint.x;
        const startY = this.currentPoint.y;

        for (let i = 1; i <= steps; i++) {
            const t = i / steps;
            const mt = 1 - t;
            const mt2 = mt * mt;
            const mt3 = mt2 * mt;
            const t2 = t * t;
            const t3 = t2 * t;

            const px = mt3 * startX + 3 * mt2 * t * cx1 + 3 * mt * t2 * cx2 + t3 * x;
            const py = mt3 * startY + 3 * mt2 * t * cy1 + 3 * mt * t2 * cy2 + t3 * y;

            this.currentPath.push({ x: px, y: py });
        }

        this.currentPoint = { x, y };
    }

    /**
     * @description 円弧を描画
     * @param {number} x
     * @param {number} y
     * @param {number} radius
     * @return {void}
     */
    arc(x: number, y: number, radius: number): void
    {
        const steps = 32;
        for (let i = 0; i <= steps; i++) {
            const angle = (i / steps) * Math.PI * 2;
            const px = x + Math.cos(angle) * radius;
            const py = y + Math.sin(angle) * radius;
            
            if (i === 0) {
                this.moveTo(px, py);
            } else {
                this.lineTo(px, py);
            }
        }
    }

    /**
     * @description パスを閉じる
     * @return {void}
     */
    closePath(): void
    {
        if (this.currentPath.length > 0 && this.currentPath[0]) {
            const first = this.currentPath[0];
            this.currentPath.push({ x: first.x, y: first.y });
        }
    }

    /**
     * @description パスから頂点配列を生成（WebGPU用）
     * @return {Float32Array}
     */
    generateVertices(): Float32Array
    {
        const allPaths = [...this.paths];
        if (this.currentPath.length > 0) {
            allPaths.push([...this.currentPath]);
        }

        const triangles: number[] = [];

        for (const path of allPaths) {
            if (path.length < 3) continue;

            // Simple triangulation (fan triangulation from first point)
            // WebGPU用: position(x, y)のみ
            for (let i = 1; i < path.length - 1; i++) {
                // Triangle: point 0, point i, point i+1
                triangles.push(
                    path[0].x, path[0].y,
                    path[i].x, path[i].y,
                    path[i + 1].x, path[i + 1].y
                );
            }
        }

        return new Float32Array(triangles);
    }

    /**
     * @description 現在のパスを取得
     * @return {IPoint[]}
     */
    getCurrentPath(): IPoint[]
    {
        return this.currentPath;
    }

    /**
     * @description すべてのパスを取得
     * @return {IPoint[][]}
     */
    getAllPaths(): IPoint[][]
    {
        const allPaths = [...this.paths];
        if (this.currentPath.length > 0) {
            allPaths.push([...this.currentPath]);
        }
        return allPaths;
    }

    /**
     * @description リセット
     * @return {void}
     */
    reset(): void
    {
        this.currentPath = [];
        this.paths = [];
        this.currentPoint = { x: 0, y: 0 };
    }
}
