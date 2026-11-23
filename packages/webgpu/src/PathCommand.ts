import type { IPoint } from "./interface/IPoint";
import type { IPath } from "./interface/IPath";
import { adaptiveCubicToQuad } from "./BezierConverter/BezierConverter";
import {
    $nativeShape,
    $nativeStroke,
    $NATIVE_FILL_PATH,
    $setNativeFillSize
} from "./NativeShape";

/**
 * @description 経路が 1 本も無いときに返す配列
 *              The array returned when there is no path at all
 */
const $EMPTY_VERTICES: IPath[] = [];

/**
 * @description 3次ベジェ曲線を 1 本の2次ベジェ曲線で近似できる上限。
 *              (許容誤差 0.05 ピクセル * 36 / √3)² = 1.08。WebGL版と同じ。
 *              Upper limit for approximating a cubic Bezier curve with a single quadratic one.
 *              (0.05 px tolerance * 36 / √3)² = 1.08. Same as the WebGL renderer.
 */
const CUBIC_SINGLE_SEGMENT_LIMIT: number = 1.08;

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
    /**
     * @description 現在のパスデータ
     *              Current path data array
     */
    private $currentPath: IPath;

    /**
     * @description 確定済みパスの配列
     *              Array of finalized path vertices
     */
    private $vertices: IPath[];

    /**
     * @description 現在のX座標
     *              Current X coordinate
     */
    private $currentX: number;

    /**
     * @description 現在のY座標
     *              Current Y coordinate
     */
    private $currentY: number;

    /**
     * @description サブパスの開始X座標
     *              Start X coordinate of current sub-path
     */
    private $startX: number;

    /**
     * @description サブパスの開始Y座標
     *              Start Y coordinate of current sub-path
     */
    private $startY: number;

    /**
     * @description 経路を実行環境の側で組み立てているかどうか。true の間、こちらの経路は空。
     *              Whether the path is being built on the runtime side. While true, the path held
     *              here is empty.
     */
    private $native: boolean = false;

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
        if (this.$native) {
            this.$native = false;
            ($nativeShape as NonNullable<typeof $nativeShape>).reset();
        }
        this.$currentPath = [];
        this.$vertices = [];
        this.$currentX = 0;
        this.$currentY = 0;
        this.$startX = 0;
        this.$startY = 0;
    }

    /**
     * @description 描画命令の並びのうち、index から続く経路の命令をまとめて処理する。
     *              実行環境が経路の実装を提供していればそれを使い、次に処理する命令の位置を返す。
     *              使えないときは -1 を返すので、呼び出し側が moveTo などを 1 つずつ呼ぶ。
     *              Processes the run of path commands starting at index in one go. Uses the
     *              runtime's path implementation when it provides one and returns the position of
     *              the next command. Returns -1 when unavailable, in which case the caller issues
     *              moveTo and the like one by one.
     *
     * @param {Float32Array} commands
     * @param {number} index
     * @param {number} pixel_scale 曲線の座標 1 単位が画面上で何ピクセルになるか (bezierCurveTo と同じ)
     * @return {number}
     */
    pathCommands(commands: Float32Array, index: number, pixel_scale: number): number
    {
        if (!$nativeShape) {
            return -1;
        }

        if (!this.$native) {
            // こちらで経路を作り始めていたら、混ぜない
            if (this.$currentPath.length || this.$vertices.length) {
                return -1;
            }
            this.$native = true;
        }

        return $nativeShape.path(commands, index, pixel_scale);
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
     * @param {number} [pixel_scale=0] 曲線の座標 1 単位が画面上で何ピクセルになるか。渡すと、近似の誤差から
     *                                 2次ベジェ曲線の本数を決める。0 以下なら従来の分割。
     * @return {void}
     */
    bezierCurveTo(
        cx1: number, cy1: number,
        cx2: number, cy2: number,
        x: number, y: number,
        pixel_scale: number = 0
    ): void {
        // 1 本の2次ベジェ曲線で足りる曲線 (小さな図形の曲線の大半) は、その場で経路へ追加する。
        // 汎用の変換は点と区間のオブジェクトを曲線ごとに作るので、その確保を避ける。
        // 判定と制御点は汎用の変換 (getCubicSegmentCount が 1 を返す場合) と同じ式:
        //   誤差 = √3 / 36 * |P3 - 3 * P2 + 3 * P1 - P0| * pixel_scale <= 0.05
        //   ⇔ |P3 - 3 * P2 + 3 * P1 - P0|² * pixel_scale² <= 1.08
        if (pixel_scale > 0) {
            const fromX = this.$currentX;
            const fromY = this.$currentY;
            const dx = x - 3 * cx2 + 3 * cx1 - fromX;
            const dy = y - 3 * cy2 + 3 * cy1 - fromY;
            if ((dx * dx + dy * dy) * pixel_scale * pixel_scale <= CUBIC_SINGLE_SEGMENT_LIMIT) {
                this.$currentPath.push(
                    (3 * cx1 + 3 * cx2 - fromX - x) * 0.25,
                    (3 * cy1 + 3 * cy2 - fromY - y) * 0.25,
                    true,
                    x, y, false
                );
                this.$currentX = x;
                this.$currentY = y;
                return;
            }
        }

        // 適応的テッセレーションで三次ベジェを二次ベジェ群に変換
        const p0: IPoint = { "x": this.$currentX, "y": this.$currentY };
        const p1: IPoint = { "x": cx1, "y": cy1 };
        const p2: IPoint = { "x": cx2, "y": cy2 };
        const p3: IPoint = { "x": x, "y": y };

        const segments = adaptiveCubicToQuad(
            p0, p1, p2, p3,
            this.$flatnessThreshold,
            pixel_scale
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
        // 経路が実行環境の側にあるときは、目印を返す (メッシュは MeshFillGenerateUseCase が実行環境の側で作る)
        if (this.$native) {
            const size = ($nativeShape as NonNullable<typeof $nativeShape>).fillSize();
            if (size < 0) {
                return $EMPTY_VERTICES;
            }
            $setNativeFillSize(size);
            return $NATIVE_FILL_PATH;
        }

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
        // 線の生成はこちらで行うので、実行環境の側の経路を取り出す
        if (this.$native) {
            const data = ($nativeShape as NonNullable<typeof $nativeShape>).exportPath(true);
            const paths: IPath[] = [];
            const count = data[0];
            let offset = 1;
            for (let idx = 0; idx < count; ++idx) {
                const size = data[offset++];
                const path: IPath = [];
                for (let position = 0; position < size; position += 3) {
                    path.push(
                        data[offset + position],
                        data[offset + position + 1],
                        data[offset + position + 2] !== 0
                    );
                }
                offset += size;
                paths.push(path);
            }
            return paths;
        }

        const vertices = [...this.$vertices];
        if (this.$currentPath.length >= 6) {
            vertices.push(this.$currentPath);
        }
        return vertices;
    }

    /**
     * @description 線のメッシュの元になる経路を取得する。
     *              経路が実行環境の側にあり、実行環境が線の外周の計算を提供していれば、経路を線の外周へ
     *              置き換えて目印 ($NATIVE_FILL_PATH) を返す (メッシュも実行環境の側で作る)。
     *              それ以外は getVerticesForStroke と同じ経路を返すので、呼び出し側が線の外周を計算する。
     *              Returns the paths a stroke mesh is built from. When the path lives on the runtime
     *              side and the runtime provides the stroke outline computation, the path is replaced
     *              by its outline and the marker ($NATIVE_FILL_PATH) is returned (the mesh is built on
     *              the runtime side as well). Otherwise the same paths as getVerticesForStroke are
     *              returned and the caller computes the outline.
     *
     * @param  {number} half_thickness 線の太さの半分
     * @param  {number} joints
     * @param  {number} caps
     * @param  {number} pixel_scale 座標 1 単位が画面上で何ピクセルになるか
     * @return {IPath[]}
     */
    getStrokeSource(half_thickness: number, joints: number, caps: number, pixel_scale: number): IPath[]
    {
        if (this.$native && $nativeStroke) {
            const size = ($nativeShape as { strokeSize: (t: number, j: number, c: number, p: number) => number })
                .strokeSize(half_thickness, joints, caps, pixel_scale);
            if (!size) {
                return $EMPTY_VERTICES;
            }
            $setNativeFillSize(size);
            return $NATIVE_FILL_PATH;
        }
        return this.getVerticesForStroke();
    }

    /**
     * @description リセット
     * @return {void}
     */
    reset(): void
    {
        if (this.$native) {
            this.$native = false;
            ($nativeShape as NonNullable<typeof $nativeShape>).reset();
        }
        this.$currentPath = [];
        this.$vertices = [];
        this.$currentX = 0;
        this.$currentY = 0;
        this.$startX = 0;
        this.$startY = 0;
    }
}
