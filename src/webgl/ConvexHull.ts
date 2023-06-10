import { ConvexHullVars } from "./ConvexHullVars";
import { $Array, $Math, $cross } from "../player/util/RenderUtil";

/**
 * @class
 */
export class ConvexHull
{
    /**
     * @param  {array} vertices
     * @return {array}
     * @method
     * @static
     */
    static compute (vertices: Array<number | boolean>): Array<number | boolean>
    {
        // 頂点数が3以下ならそのまま返す
        if (10 > vertices.length) {
            return vertices;
        }

        ConvexHullVars.vertices = vertices;

        this.chansAlgorithm();

        // 最後に凸包の配列を生成する
        const result = new $Array(ConvexHullVars.hullsIndex * 3);
        for (let i = 0; i < ConvexHullVars.hullsIndex; i++) {
            result[i * 3    ] = vertices[ConvexHullVars.subhulls[ConvexHullVars.hulls[ConvexHullVars.t][i]]];
            result[i * 3 + 1] = vertices[ConvexHullVars.subhulls[ConvexHullVars.hulls[ConvexHullVars.t][i]] + 1];
            result[i * 3 + 2] = false;
        }

        ConvexHullVars.vertices = null;

        return result;
    }

    /**
     * @return {void}
     * @method
     * @static
     */
    static chansAlgorithm (): void
    {
        const vertices: Array<number | boolean> | null = ConvexHullVars.vertices;
        if (!vertices) {
            return ;
        }

        for (let t: number = 0; t < 3; t++) {

            ConvexHullVars.t = t;

            // 要素数mは、元のアルゴリズムではなくswf2js用にカスタムして計算する
            // const m = Math.pow(2, Math.pow(2, t));
            const m: number  = 16 * $Math.pow(4, t);
            const m3: number = m * 3;

            // 点集合を要素数mの部分集合に分割し、部分凸包(subhulls)を求める
            this.clearSubhulls();
            this.clearExtremePoints();

            const verticesLength: number = vertices.length;
            for (let i: number = 0; i < verticesLength; i += m3) {
                this.calcSubhulls(i, $Math.min(i + m3, verticesLength));
            }

            // 部分凸包のサイズを求めるために、最後にConvexHullVars.subhullsIndexを追加する
            this.addExtremePoint(ConvexHullVars.subhullsIndex);

            // this.calcSubhulls()で流用したConvexHullVars.hullsを初期化しておく
            this.clearHulls();

            // x座標が最も小さい点を、初期の基準点にする
            // （初期の基準点まで戻ったら凸包完成判定）
            const extremeSubhullsIndex: number = this.getExtremeSubhullsIndex();

            // console.log("initial",extremeSubhullsIndex,ConvexHullVars.vertices[ConvexHullVars.subhulls[extremeSubhullsIndex]],ConvexHullVars.vertices[ConvexHullVars.subhulls[extremeSubhullsIndex] + 1]);

            let currentSubhullsIndex: number = extremeSubhullsIndex;
            let isComplete: boolean = false;
            for (;;) {
                // 基準点を、凸包(hulls)に追加する
                ConvexHullVars.hulls[ConvexHullVars.t][ConvexHullVars.hullsIndex++] = currentSubhullsIndex;

                // もし凸包サイズがmに達したら、tを更新して再計算する
                if (ConvexHullVars.hullsIndex >= m) {
                    break;
                }

                // 次の基準点候補の初期値は、基準点以外の点にする
                const currentExtremePointsIndex: number = this
                    .getCurrentExtremePointsIndex(currentSubhullsIndex);

                let nextSubhullsIndex: number = this
                    .getNextSubhullsIndex(
                        currentSubhullsIndex,
                        currentExtremePointsIndex
                    );

                // console.log("next",nextSubhullsIndex,ConvexHullVars.vertices[ConvexHullVars.subhulls[nextSubhullsIndex]],ConvexHullVars.vertices[ConvexHullVars.subhulls[nextSubhullsIndex] + 1]);

                // 基準点から最も時計回り側にある点を、次の基準点にする
                const subhullsLength: number = ConvexHullVars.extremePointsIndex - 1;
                for (let i: number = 0; i < subhullsLength; i++) {

                    const subhullsIndex: number = this.binarySearch(i, currentSubhullsIndex);

                    // console.log("[point]", subhullsIndex,ConvexHullVars.vertices[ConvexHullVars.subhulls[subhullsIndex]],ConvexHullVars.vertices[ConvexHullVars.subhulls[subhullsIndex] + 1]);

                    const a: number = ConvexHullVars.subhulls[nextSubhullsIndex];
                    const b: number = ConvexHullVars.subhulls[subhullsIndex];
                    const o: number = ConvexHullVars.subhulls[currentSubhullsIndex];
                    if (this.clockwise(a, b, o) > 0) {
                        nextSubhullsIndex = subhullsIndex;
                    }
                }

                currentSubhullsIndex = nextSubhullsIndex;

                // console.log("vert", currentSubhullsIndex,ConvexHullVars.vertices[ConvexHullVars.subhulls[currentSubhullsIndex]],ConvexHullVars.vertices[ConvexHullVars.subhulls[currentSubhullsIndex] + 1]);

                // 基準点とx座標が最も小さい点が一致しているなら、凸包が完成している
                if (currentSubhullsIndex === extremeSubhullsIndex) {
                    isComplete = true;
                    break;
                }
            }

            if (isComplete) {
                break;
            }
        }
    }

    /**
     * @param  {number} start_vertices_index
     * @param  {number} end_vertices_index
     * @return {void}
     * @method
     * @static
     */
    static calcSubhulls (
        start_vertices_index: number,
        end_vertices_index: number
    ): void {

        const size: number = end_vertices_index - start_vertices_index;

        this.addExtremePoint(ConvexHullVars.subhullsIndex);

        // 部分集合のサイズが1以下なら、そのまま部分凸包になる
        if (size < 4) {
            this.addSubhull(start_vertices_index);
            return;
        }

        // 部分集合をx座標が小さい順にソートする
        // （ソートはhullsを流用して行う）
        this.clearHulls();
        for (let i: number = 0; i < size; i += 3) {
            ConvexHullVars.hulls[ConvexHullVars.t][i] = start_vertices_index + i;
            ConvexHullVars.hullsIndex++;
        }
        ConvexHullVars.hulls[ConvexHullVars.t].sort(this.compare);

        // 下包を求める
        const lowerIndex: number = ConvexHullVars.subhullsIndex;
        for (let i: number = 0; i < ConvexHullVars.hullsIndex; i++) {

            const b: number = ConvexHullVars.hulls[ConvexHullVars.t][i];

            while (ConvexHullVars.subhullsIndex - lowerIndex >= 2) {
                const a: number = ConvexHullVars.subhulls[ConvexHullVars.subhullsIndex - 1];
                const o: number = ConvexHullVars.subhulls[ConvexHullVars.subhullsIndex - 2];
                if (this.clockwise(a, b, o) < 0) {
                    break;
                }

                ConvexHullVars.subhullsIndex--;
            }

            if (ConvexHullVars.subhullsIndex - lowerIndex > 0) {
                const a: number = ConvexHullVars.subhulls[ConvexHullVars.subhullsIndex - 1];
                if (this.almostEquals(a, b)) {
                    ConvexHullVars.subhullsIndex--;
                }
            }

            this.addSubhull(ConvexHullVars.hulls[ConvexHullVars.t][i]);
        }

        // 下包の最後の点は、上包の最初の点と重複するので削除する
        ConvexHullVars.subhullsIndex--;

        // 上包を求める
        const upperIndex = ConvexHullVars.subhullsIndex;
        for (let i: number = ConvexHullVars.hullsIndex - 1; i >= 0; i--) {

            const b: number = ConvexHullVars.hulls[ConvexHullVars.t][i];

            while (ConvexHullVars.subhullsIndex - upperIndex >= 2) {
                const a: number = ConvexHullVars.subhulls[ConvexHullVars.subhullsIndex - 1];
                const o: number = ConvexHullVars.subhulls[ConvexHullVars.subhullsIndex - 2];
                if (this.clockwise(a, b, o) < 0) {
                    break;
                }

                ConvexHullVars.subhullsIndex--;
            }

            if (ConvexHullVars.subhullsIndex - upperIndex > 0) {
                const a: number = ConvexHullVars.subhulls[ConvexHullVars.subhullsIndex - 1];
                if (this.almostEquals(a, b)) {
                    ConvexHullVars.subhullsIndex--;
                }
            }

            this.addSubhull(ConvexHullVars.hulls[ConvexHullVars.t][i]);
        }

        // 上包の最後の点は、下包の最初の点と重複するので削除する
        ConvexHullVars.subhullsIndex--;
    }

    /**
     * @param  {number} subhull
     * @return {void}
     * @method
     * @static
     */
    static addSubhull (subhull: number): void
    {
        ConvexHullVars.subhulls[ConvexHullVars.subhullsIndex++] = subhull;
        if (ConvexHullVars.subhullsIndex > ConvexHullVars.subhulls.length) {
            ConvexHullVars.subhulls.length *= 2;
        }
    }

    /**
     * @param  {number} extreme_point
     * @return {void}
     * @method
     * @static
     */
    static addExtremePoint (extreme_point: number): void
    {
        ConvexHullVars.extremePoints[ConvexHullVars.extremePointsIndex++] = extreme_point;
        if (ConvexHullVars.extremePointsIndex > ConvexHullVars.extremePoints.length) {
            ConvexHullVars.extremePoints.length *= 2;
        }
    }

    /**
     * @param  {number} a
     * @param  {number} b
     * @return {number}
     * @method
     * @static
     */
    static compare (a: number, b: number): number
    {
        if (a < 0 && b < 0) {
            return 0;
        } else if (a < 0) {
            return 1;
        } else if (b < 0) {
            return -1;
        }

        const vertices: Array<number | boolean> | null = ConvexHullVars.vertices;
        if (!vertices) {
            return 0;
        }

        const ax: number = +vertices[a];
        const ay: number = +vertices[a + 1];
        const bx: number = +vertices[b];
        const by: number = +vertices[b + 1];

        return ax - bx || ay - by;
    }

    /**
     * @param  {number} a
     * @param  {number} b
     * @param  {number} o
     * @return {number}
     * @method
     * @static
     */
    static clockwise (a: number, b: number, o: number): number
    {
        const vertices: Array<number | boolean> | null = ConvexHullVars.vertices;
        if (!vertices) {
            return 0;
        }

        const ax: number = +vertices[a];
        const ay: number = +vertices[a + 1];
        const bx: number = +vertices[b];
        const by: number = +vertices[b + 1];
        const ox: number = +vertices[o];
        const oy: number = +vertices[o + 1];

        // aよりbが時計回り側にあるなら正の値を返す
        return $cross(ax - ox, ay - oy, bx - ox, by - oy);
    }

    /**
     * @param  {number} a
     * @param  {number} b
     * @return {boolean}
     * @method
     * @static
     */
    static almostEquals (a: number, b: number): boolean
    {
        const vertices: Array<number | boolean> | null = ConvexHullVars.vertices;
        if (!vertices) {
            return false;
        }

        const ax: number = +vertices[a];
        const ay: number = +vertices[a + 1];
        const bx: number = +vertices[b];
        const by: number = +vertices[b + 1];

        // aとbの値がほぼ等しいかどうか
        const absX: number = $Math.abs(ax - bx);
        const absY: number = $Math.abs(ay - by);
        return absX < 0.001 && absY < 0.001;
    }

    /**
     * @return {number}
     * @method
     * @static
     */
    static getExtremeSubhullsIndex(): number
    {
        const vertices: Array<number | boolean> | null = ConvexHullVars.vertices;
        if (!vertices) {
            return 0;
        }

        let minIndex: number = 0;
        for (let i: number = 0; i < ConvexHullVars.extremePoints.length; i++) {

            const subhullsIndex: number = ConvexHullVars.extremePoints[i];
            if (subhullsIndex < 0) {
                break;
            }

            const ax: number = +vertices[ConvexHullVars.subhulls[subhullsIndex]];
            const bx: number = +vertices[ConvexHullVars.subhulls[minIndex]];
            if (ax < bx) {
                minIndex = subhullsIndex;
            }
        }
        return minIndex;
    }

    /**
     * @param  {number} current_subhulls_index
     * @return {number}
     * @method
     * @static
     */
    static getCurrentExtremePointsIndex (current_subhulls_index: number): number
    {
        // TODO 二分探索にできる
        for (let i: number = 0; i < ConvexHullVars.extremePoints.length; i++) {
            const subhullsIndex: number = ConvexHullVars.extremePoints[i + 1];
            if (current_subhulls_index < subhullsIndex) {
                return i;
            }
        }
        return 0;
    }

    /**
     * @param  {number} current_subhulls_index
     * @param  {number} current_extreme_points_index
     * @return {number}
     * @method
     * @static
     */
    static getNextSubhullsIndex (
        current_subhulls_index: number,
        current_extreme_points_index: number
    ): number {

        const extremeSubhullsIndex: number     = ConvexHullVars.extremePoints[current_extreme_points_index];
        const nextExtremeSubhullsIndex: number = ConvexHullVars.extremePoints[current_extreme_points_index + 1];

        const subhullsSize = nextExtremeSubhullsIndex - extremeSubhullsIndex;

        if (subhullsSize > 2) {
            if (current_subhulls_index < nextExtremeSubhullsIndex) {
                return current_subhulls_index;
            }
            return extremeSubhullsIndex;
        }

        if (nextExtremeSubhullsIndex < ConvexHullVars.extremePointsIndex - 1) {
            return nextExtremeSubhullsIndex;
        }

        return 0;
    }

    static binarySearch(
        extreme_points_index: number,
        current_subhulls_index: number
    ): number {

        const extremeSubhullsIndex: number     = ConvexHullVars.extremePoints[extreme_points_index];
        const nextExtremeSubhullsIndex: number = ConvexHullVars.extremePoints[extreme_points_index + 1];

        let beginIndex: number = extremeSubhullsIndex;
        let endIndex: number   = nextExtremeSubhullsIndex;

        while (beginIndex < endIndex) {

            let prevBeginIndex: number = beginIndex - 1;
            let nextBeginIndex: number = beginIndex + 1;
            if (prevBeginIndex < extremeSubhullsIndex) {
                prevBeginIndex = nextExtremeSubhullsIndex - 1;
            }

            if (nextBeginIndex >= nextExtremeSubhullsIndex) {
                nextBeginIndex = extremeSubhullsIndex;
            }

            // 始点と基準点が同じ座標なら、始点の次の点が最も時計回り側にある点になる
            if (this.almostEquals(ConvexHullVars.subhulls[beginIndex], ConvexHullVars.subhulls[current_subhulls_index])) {
                return nextBeginIndex;
            }

            const beginPrev: number = this.clockwise(
                ConvexHullVars.subhulls[beginIndex],
                ConvexHullVars.subhulls[prevBeginIndex],
                ConvexHullVars.subhulls[current_subhulls_index]
            );

            const beginNext: number = this.clockwise(
                ConvexHullVars.subhulls[beginIndex],
                ConvexHullVars.subhulls[nextBeginIndex],
                ConvexHullVars.subhulls[current_subhulls_index]
            );

            const centerIndex: number = $Math.floor((beginIndex + endIndex) / 2);
            let prevCenterIndex: number = centerIndex - 1;
            let nextCenterIndex: number = centerIndex + 1;
            if (prevCenterIndex < extremeSubhullsIndex) {
                prevCenterIndex = nextExtremeSubhullsIndex - 1;
            }

            if (nextCenterIndex >= nextExtremeSubhullsIndex) {
                nextCenterIndex = extremeSubhullsIndex;
            }

            // 中心点と基準点が同じ座標なら、中心点の次の点が最も時計回り側にある点になる
            if (this.almostEquals(ConvexHullVars.subhulls[centerIndex], ConvexHullVars.subhulls[current_subhulls_index])) {
                return nextCenterIndex;
            }

            const centerPrev: number = this.clockwise(
                ConvexHullVars.subhulls[centerIndex],
                ConvexHullVars.subhulls[prevCenterIndex],
                ConvexHullVars.subhulls[current_subhulls_index]
            );

            const centerNext: number = this.clockwise(
                ConvexHullVars.subhulls[centerIndex],
                ConvexHullVars.subhulls[nextCenterIndex],
                ConvexHullVars.subhulls[current_subhulls_index]
            );

            // 中心点の前の点と次の点が、中心点より反時計回り側にあるなら、中心点が最も時計回り側にある点になる
            if (centerPrev <= 0 && centerNext <= 0) {
                return centerIndex;
            }

            // 探索する方向を求める
            const centerSide: number = this.clockwise(
                ConvexHullVars.subhulls[beginIndex],
                ConvexHullVars.subhulls[centerIndex],
                ConvexHullVars.subhulls[current_subhulls_index]
            );

            const pattern1: boolean = centerSide   < 0 && (beginPrev <= 0 && beginNext <= 0); // 始点が最も時計回り側にあるパターン
            const pattern2: boolean = centerSide   < 0 && (beginPrev  < 0 || beginNext  > 0); // 中心点が始点より反時計回り側にあるパターン
            const pattern3: boolean = centerSide   > 0 && (centerPrev > 0 || centerNext < 0); // 中心点が始点より時計回り側にあるパターン
            const pattern4: boolean = centerSide === 0 && (centerPrev > 0 || centerNext < 0); // 中心点と始点が平行しているパターン

            if (pattern1 || pattern2 || pattern3 || pattern4) {
                endIndex = centerIndex;
            } else {
                beginIndex = centerIndex + 1;
            }
        }

        return beginIndex;
    }

    /**
     * @return {void}
     * @method
     * @static
     */
    static clearSubhulls (): void
    {
        for (let i: number = 0; i < ConvexHullVars.subhulls.length; i++) {
            ConvexHullVars.subhulls[i] = -1;
        }
        ConvexHullVars.subhullsIndex = 0;
    }

    /**
     * @return {void}
     * @method
     * @static
     */
    static clearExtremePoints (): void
    {
        for (let i: number = 0; i < ConvexHullVars.extremePoints.length; i++) {
            ConvexHullVars.extremePoints[i] = -1;
        }
        ConvexHullVars.extremePointsIndex = 0;
    }

    /**
     * @return {void}
     * @method
     * @static
     */
    static clearHulls (): void
    {
        const hulls: Float32Array = ConvexHullVars.hulls[ConvexHullVars.t];
        for (let i: number = 0; i < hulls.length; i++) {
            hulls[i] = -1;
        }
        ConvexHullVars.hullsIndex = 0;
    }
}