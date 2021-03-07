/**
 * @class
 */
class ConvexHull
{
    /**
     * @param  {array} vertices
     * @return {array}
     */
    static compute (vertices)
    {
        // 頂点数が3以下ならそのまま返す
        if (vertices.length <= 9) {
            return vertices;
        }

        const points = Util.$getArray();
        const verticesLength = vertices.length;
        for (let i = 0; i < verticesLength; i += 3) {
            points.push({
                "x": vertices[i],
                "y": vertices[i + 1]
            });
        }

        // const hulls = this.giftWrapping(points);
        // const hulls = this.monotoneChain(points);
        const hulls = this.chansAlgorithm(points);

        const result = Util.$getArray();
        const hullsLength = hulls.length;
        for (let i = 0; i < hullsLength; i++) {
            const hull = hulls[i];
            result.push(hull.x, hull.y, false);
        }

        Util.$poolArray(points);
        Util.$poolArray(hulls);

        return result;
    }

    /**
     * @description 「Chan's Algorithm」で、点列から凸包を求める
     * @param  {array} points
     * @return {array}
     * @private
     */
    static chansAlgorithm (points)
    {
        const result = Util.$getArray();

        for (let t = 2; ; t++) {
            result.length = 0;
            const m = Util.$pow(2, Util.$pow(2, t));

            // 点集合を要素数mの部分集合に分割し、部分凸包を求める
            const subsets  = this.getSubsets(points, m);
            const subhulls = this.getSubhulls(subsets);
            const subhullsLength = subhulls.length;

            // x座標が最も小さい点を、初期の基準点にする
            const extremeHullIndex  = this.extremePointOfSubhulls(subhulls);
            const extremePointIndex = 0;

            let currentHullIndex  = extremeHullIndex;
            let currentPointIndex = extremePointIndex;
            let currentPoint      = subhulls[currentHullIndex][currentPointIndex];
            let isComplete        = false;
            while (true) {
                // 基準点を、凸包に追加する
                result.push(currentPoint);

                // もし凸包サイズがmに達したら、tを更新して再計算する
                if (result.length >= m) {
                    break;
                }

                // 次の基準点候補の初期値は、基準点以外の点にする
                let nextHullIndex;
                let nextPointIndex;
                if (subhulls[currentHullIndex].length > 2) {
                    nextHullIndex  = currentHullIndex;
                    nextPointIndex = (currentPointIndex + 1) % subhulls[currentHullIndex].length;
                } else {
                    nextHullIndex  = (currentHullIndex + 1) % subhulls.length;
                    nextPointIndex = 0;
                }
                let nextPoint = subhulls[nextHullIndex][nextPointIndex];

                // 基準点から最も時計回り側にある点を、次の基準点にする
                for (let i = 0; i < subhullsLength; i++) {
                    // const pointIndex = this.linearSearch(subhulls[i], currentPoint);
                    const pointIndex = this.binarySearch(subhulls[i], currentPoint);
                    const point = subhulls[i][pointIndex];

                    if (this.orientation(nextPoint, point, currentPoint) > 0) {
                        nextHullIndex  = i;
                        nextPointIndex = pointIndex;
                        nextPoint      = point;
                    }
                }

                currentHullIndex  = nextHullIndex;
                currentPointIndex = nextPointIndex;
                currentPoint      = subhulls[currentHullIndex][currentPointIndex];

                // 基準点とx座標が最も小さい点が一致しているなら、凸包が完成している
                if (currentHullIndex === extremeHullIndex && currentPointIndex === extremePointIndex) {
                    isComplete = true;
                    break;
                }
            }

            Util.$poolArray(subsets);
            Util.$poolArray(subhulls);

            if (isComplete) {
                return result;
            }
        }
    }

    /**
     * @description 点集合を、要素数mの部分集合に分割する
     * @param  {array}  points
     * @param  {number} m
     * @return {array}
     * @private
     */
    static getSubsets (points, m)
    {
        const result = Util.$getArray();
        const length = points.length;
        for (let i = 0; i < length; i += m) {
            result.push(points.slice(i, Util.$min(i + m, length)));
        }
        return result;
    }

    /**
     * @description 部分集合から、部分凸包を求める
     * @param  {array} subsets
     * @return {array}
     * @private
     */
    static getSubhulls (subsets)
    {
        const result = Util.$getArray();
        const length = subsets.length;
        for (let i = 0; i < length; i++) {
            result.push(this.monotoneChain(subsets[i]));
        }
        return result;
    }

    /**
     * @description 「MonotoneChain」で、点集合から凸包を求める
     * @param  {array} points
     * @return {array}
     * @private
     */
    static monotoneChain (points)
    {
        // 点集合のソートが不要なら、そのまま返す
        if (points.length < 2) {
            return points;
        }

        // 点集合をx座標が小さい順にソートする
        points.sort(function(a, b) { return a.x - b.x || a.y - b.y; });
        const length = points.length;

        // 下包を求める
        const lower = Util.$getArray();
        for (let i = 0; i < length; i++) {
            const point = points[i];
            while (lower.length >= 2) {
                if (this.orientation(lower[lower.length - 1], point, lower[lower.length - 2]) < 0) {
                    break;
                }
                lower.pop();
            }

            // 座標がほぼ同じ点は含めない
            if (lower.length > 0) {
                const top = lower[lower.length - 1];
                const abs1 = Util.$abs(point.x - top.x);
                const abs2 = Util.$abs(point.y - top.y);
                if (abs1 < 0.001 && abs2 < 0.001) {
                    lower.pop();
                }
            }

            lower.push(point);
        }

        // 上包を求める
        const upper = Util.$getArray();
        for (let i = length - 1; i >= 0; i--) {
            const point = points[i];
            while (upper.length >= 2) {
                if (this.orientation(upper[upper.length - 1], point, upper[upper.length - 2]) < 0) {
                    break;
                }
                upper.pop();
            }

            // 座標がほぼ同じ点は含めない
            if (upper.length > 0) {
                const top = upper[upper.length - 1];
                const abs1 = Util.$abs(point.x - top.x);
                const abs2 = Util.$abs(point.y - top.y);
                if (abs1 < 0.001 && abs2 < 0.001) {
                    upper.pop();
                }
            }

            upper.push(point);
        }

        // 重複する点は削除する
        lower.pop();
        upper.pop();

        // 下包と上包をマージする
        const result = lower.concat(upper);

        Util.$poolArray(lower);
        Util.$poolArray(upper);

        return result;
    }

    /**
     * @param  {object} p1
     * @param  {object} p2
     * @param  {object} origin
     * @return {number}
     * @private
     */
    static orientation (p1, p2, origin)
    {
        // p1よりp2が時計回り側にあるなら正の値を返す
        return Util.$cross(p1.x - origin.x, p1.y - origin.y, p2.x - origin.x, p2.y - origin.y);
    }

    /**
     * @description 部分凸包の中で、x座標が最も小さい点を含む凸包のインデックスを返す
     * @param  {array}  subhulls
     * @return {number}
     * @private
     */
    static extremePointOfSubhulls (subhulls)
    {
        const extremePoints = Util.$getArray();
        const length = subhulls.length;
        for (let i = 0; i < length; i++) {
            // （x座標が小さい順にソートされている）凸包の始点を取る
            extremePoints.push(subhulls[i][0]);
        }

        const result = this.extremePoint(extremePoints);

        Util.$poolArray(extremePoints);

        return result;
    }

    /**
     * @description 点集合の中で、x座標が最も小さい点のインデックスを返す
     * @param  {array}  points
     * @return {number}
     * @private
     */
    static extremePoint (points)
    {
        let minIndex = 0;
        const length = points.length;
        for (let i = 1; i < length; i++) {
            if (points[i].x < points[minIndex].x) {
                minIndex = i;
            }
        }
        return minIndex;
    }

    /**
     * @description （x座標が小さい順にソートされている）凸包の中で、基準点から最も時計回り側にある点のインデックスを返す
     * @param  {array}  hullPoints
     * @param  {object} currentPoint
     * @return {number}
     * @private
     */
    static binarySearch (hullPoints, currentPoint)
    {
        const length = hullPoints.length;

        let beginIndex = 0;
        let endIndex   = length;

        while (beginIndex < endIndex) {
            // 始点と基準点が同じ座標なら、始点の次の点が最も時計回り側にある点になる
            if (this.equalsPoint(hullPoints[beginIndex], currentPoint)) {
                return (beginIndex + 1) % length;
            }
            const beginPrev = this.orientation(hullPoints[beginIndex], hullPoints[(beginIndex + length - 1) % length], currentPoint);
            const beginNext = this.orientation(hullPoints[beginIndex], hullPoints[(beginIndex + 1) % length], currentPoint);

            // 中心点と基準点が同じ座標なら、中心点の次の点が最も時計回り側にある点になる
            const centerIndex = Util.$floor((beginIndex + endIndex) / 2);
            if (this.equalsPoint(hullPoints[centerIndex], currentPoint)) {
                return (centerIndex + 1) % length;
            }
            const centerPrev = this.orientation(hullPoints[centerIndex], hullPoints[(centerIndex + length - 1) % length], currentPoint);
            const centerNext = this.orientation(hullPoints[centerIndex], hullPoints[(centerIndex + 1) % length], currentPoint);

            // 中心点の前の点と次の点が、中心点より反時計回り側にあるなら、中心点が最も時計回り側にある点になる
            if (centerPrev <= 0 && centerNext <= 0) {
                return centerIndex;
            }

            // 探索する方向を求める
            const centerSide = this.orientation(hullPoints[beginIndex], hullPoints[centerIndex], currentPoint);
            const ptn1 = (centerSide   < 0 && (beginPrev <= 0 && beginNext <= 0)); // 始点が最も時計回り側にあるパターン
            const ptn2 = (centerSide   < 0 && (beginPrev  < 0 || beginNext  > 0)); // 中心点が始点より反時計回り側にあるパターン
            const ptn3 = (centerSide   > 0 && (centerPrev > 0 || centerNext < 0)); // 中心点が始点より時計回り側にあるパターン
            const ptn4 = (centerSide === 0 && (centerPrev > 0 || centerNext < 0)); // 中心点と始点が平行しているパターン
            if (ptn1 || ptn2 || ptn3 || ptn4) {
                endIndex = centerIndex;
            } else {
                beginIndex = centerIndex + 1;
            }
        }

        return beginIndex;
    }

    /**
     * @description 凸包の中で、基準点から最も時計回り側にある点のインデックスを返す（テスト用）
     * @param  {array}  hullPoints
     * @param  {object} currentPoint
     * @return {number}
     * @private
     */
    static linearSearch (hullPoints, currentPoint)
    {
        let minIndex = 0;
        const length = hullPoints.length;
        for (let i = 0; i < length; i++) {
            if (this.equalsPoint(hullPoints[i], currentPoint)) {
                return (i + 1) % length;
            }
            if (this.orientation(hullPoints[minIndex], hullPoints[i], currentPoint) > 0) {
                minIndex = i;
            }
        }
        return minIndex;
    }

    /**
     * @param  {object} p1
     * @param  {object} p2
     * @return {boolean}
     * @private
     */
    static equalsPoint (p1, p2)
    {
        return p1.x === p2.x && p1.y === p2.y;
    }

    /**
     * @description 「ギフト包装法」で、点集合から凸包を求める（テスト用）
     * @param  {array} points
     * @return {array}
     * @private
     */
    static giftWrapping (points)
    {
        const result = Util.$getArray();
        const length = points.length;

        // x座標が最も小さい点を、初期の基準点にする
        const extremePointIndex = this.extremePoint(points);

        let currentIndex = extremePointIndex;
        do {
            // 基準点を、凸包に追加する
            result.push(points[currentIndex]);

            let nextIndex = (currentIndex + 1) % length;
            let nx = points[nextIndex].x - points[currentIndex].x;
            let ny = points[nextIndex].y - points[currentIndex].y;

            // 基準点から最も時計回り側にある点を、次の基準点にする
            for (let i = 0; i < length; i++) {
                const ix = points[i].x - points[currentIndex].x;
                const iy = points[i].y - points[currentIndex].y;

                if (Util.$cross(nx, ny, ix, iy) > 0) {
                    nextIndex = i;
                    nx = ix;
                    ny = iy;
                }
            }

            currentIndex = nextIndex;
        } while (currentIndex !== extremePointIndex);

        return result;
    }
}
