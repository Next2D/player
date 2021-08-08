const ConvexHullVars = {};
ConvexHullVars.vertices           = null;
ConvexHullVars.subhulls           = new Array(512);
ConvexHullVars.subhullsIndex      = 0;
ConvexHullVars.extremePoints      = new Array(32);
ConvexHullVars.extremePointsIndex = 0;
ConvexHullVars.t                  = 0;
ConvexHullVars.hulls              = [new Array(16), new Array(64), new Array(256)];
ConvexHullVars.hullsIndex         = 0;

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

        ConvexHullVars.vertices = vertices;

        this.chansAlgorithm();

        // 最後に凸包の配列を生成する
        const result = new Array(ConvexHullVars.hullsIndex * 3);
        for (let i = 0; i < ConvexHullVars.hullsIndex; i++) {
            result[i * 3    ] = vertices[ConvexHullVars.subhulls[ConvexHullVars.hulls[ConvexHullVars.t][i]]];
            result[i * 3 + 1] = vertices[ConvexHullVars.subhulls[ConvexHullVars.hulls[ConvexHullVars.t][i]] + 1];
            result[i * 3 + 2] = false;
        }

        ConvexHullVars.vertices = null;

        return result;
    }

    static chansAlgorithm ()
    {
        for (let t = 0; t < 3; t++) {
            ConvexHullVars.t = t;

            // 要素数mは、元のアルゴリズムではなくswf2js用にカスタムして計算する
            // const m = Util.$pow(2, Util.$pow(2, t));
            const m = 16 * Util.$pow(4, t);
            const m3 = m * 3;

            // 点集合を要素数mの部分集合に分割し、部分凸包(subhulls)を求める
            this.clearSubhulls();
            this.clearExtremePoints();
            const verticesLength = ConvexHullVars.vertices.length;
            for (let i = 0; i < verticesLength; i += m3) {
                this.calcSubhulls(i, Util.$min(i + m3, verticesLength));
            }

            // 部分凸包のサイズを求めるために、最後にConvexHullVars.subhullsIndexを追加する
            this.addExtremePoint(ConvexHullVars.subhullsIndex);

            // this.calcSubhulls()で流用したConvexHullVars.hullsを初期化しておく
            this.clearHulls();

            // x座標が最も小さい点を、初期の基準点にする
            // （初期の基準点まで戻ったら凸包完成判定）
            const extremeSubhullsIndex = this.getExtremeSubhullsIndex();

            // console.log("initial",extremeSubhullsIndex,ConvexHullVars.vertices[ConvexHullVars.subhulls[extremeSubhullsIndex]],ConvexHullVars.vertices[ConvexHullVars.subhulls[extremeSubhullsIndex] + 1]);

            let currentSubhullsIndex = extremeSubhullsIndex;
            let isComplete = false;
            for (;;) {
                // 基準点を、凸包(hulls)に追加する
                ConvexHullVars.hulls[ConvexHullVars.t][ConvexHullVars.hullsIndex++] = currentSubhullsIndex;

                // もし凸包サイズがmに達したら、tを更新して再計算する
                if (ConvexHullVars.hullsIndex >= m) {
                    break;
                }

                // 次の基準点候補の初期値は、基準点以外の点にする
                const currentExtremePointsIndex = this.getCurrentExtremePointsIndex(currentSubhullsIndex);
                let nextSubhullsIndex = this.getNextSubhullsIndex(currentSubhullsIndex, currentExtremePointsIndex);

                // console.log("next",nextSubhullsIndex,ConvexHullVars.vertices[ConvexHullVars.subhulls[nextSubhullsIndex]],ConvexHullVars.vertices[ConvexHullVars.subhulls[nextSubhullsIndex] + 1]);

                // 基準点から最も時計回り側にある点を、次の基準点にする
                const subhullsLength = ConvexHullVars.extremePointsIndex - 1;
                for (let i = 0; i < subhullsLength; i++) {
                    const subhullsIndex = this.binarySearch(i, currentSubhullsIndex);

                    // console.log("[point]", subhullsIndex,ConvexHullVars.vertices[ConvexHullVars.subhulls[subhullsIndex]],ConvexHullVars.vertices[ConvexHullVars.subhulls[subhullsIndex] + 1]);

                    const a = ConvexHullVars.subhulls[nextSubhullsIndex];
                    const b = ConvexHullVars.subhulls[subhullsIndex];
                    const o = ConvexHullVars.subhulls[currentSubhullsIndex];
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

    static calcSubhulls (startVerticesIndex, endVerticesIndex)
    {
        const size = endVerticesIndex - startVerticesIndex;

        this.addExtremePoint(ConvexHullVars.subhullsIndex);

        // 部分集合のサイズが1以下なら、そのまま部分凸包になる
        if (size <= 3) {
            this.addSubhull(startVerticesIndex);
            return;
        }

        // 部分集合をx座標が小さい順にソートする
        // （ソートはhullsを流用して行う）
        this.clearHulls();
        for (let i = 0; i < size; i += 3) {
            ConvexHullVars.hulls[ConvexHullVars.t][i] = startVerticesIndex + i;
            ConvexHullVars.hullsIndex++;
        }
        ConvexHullVars.hulls[ConvexHullVars.t].sort(this.compare);

        // 下包を求める
        const lowerIndex = ConvexHullVars.subhullsIndex;
        for (let i = 0; i < ConvexHullVars.hullsIndex; i++) {
            const b = ConvexHullVars.hulls[ConvexHullVars.t][i];

            while (ConvexHullVars.subhullsIndex - lowerIndex >= 2) {
                const a = ConvexHullVars.subhulls[ConvexHullVars.subhullsIndex - 1];
                const o = ConvexHullVars.subhulls[ConvexHullVars.subhullsIndex - 2];
                if (this.clockwise(a, b, o) < 0) {
                    break;
                }

                ConvexHullVars.subhullsIndex--;
            }

            if (ConvexHullVars.subhullsIndex - lowerIndex > 0) {
                const a = ConvexHullVars.subhulls[ConvexHullVars.subhullsIndex - 1];
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
        for (let i = ConvexHullVars.hullsIndex - 1; i >= 0; i--) {
            const b = ConvexHullVars.hulls[ConvexHullVars.t][i];

            while (ConvexHullVars.subhullsIndex - upperIndex >= 2) {
                const a = ConvexHullVars.subhulls[ConvexHullVars.subhullsIndex - 1];
                const o = ConvexHullVars.subhulls[ConvexHullVars.subhullsIndex - 2];
                if (this.clockwise(a, b, o) < 0) {
                    break;
                }

                ConvexHullVars.subhullsIndex--;
            }

            if (ConvexHullVars.subhullsIndex - upperIndex > 0) {
                const a = ConvexHullVars.subhulls[ConvexHullVars.subhullsIndex - 1];
                if (this.almostEquals(a, b)) {
                    ConvexHullVars.subhullsIndex--;
                }
            }

            this.addSubhull(ConvexHullVars.hulls[ConvexHullVars.t][i]);
        }

        // 上包の最後の点は、下包の最初の点と重複するので削除する
        ConvexHullVars.subhullsIndex--;
    }

    static addSubhull (subhull)
    {
        ConvexHullVars.subhulls[ConvexHullVars.subhullsIndex++] = subhull;
        if (ConvexHullVars.subhullsIndex > ConvexHullVars.subhulls.length) {
            ConvexHullVars.subhulls.length *= 2;
        }
    }

    static addExtremePoint (extremePoint)
    {
        ConvexHullVars.extremePoints[ConvexHullVars.extremePointsIndex++] = extremePoint;
        if (ConvexHullVars.extremePointsIndex > ConvexHullVars.extremePoints.length) {
            ConvexHullVars.extremePoints.length *= 2;
        }
    }

    static compare (a, b)
    {
        if (a < 0 && b < 0) {
            return 0;
        } else if (a < 0) {
            return 1;
        } else if (b < 0) {
            return -1;
        }

        const ax = ConvexHullVars.vertices[a];
        const ay = ConvexHullVars.vertices[a + 1];
        const bx = ConvexHullVars.vertices[b];
        const by = ConvexHullVars.vertices[b + 1];

        return ax - bx || ay - by;
    }

    static clockwise (a, b, o)
    {
        const ax = ConvexHullVars.vertices[a];
        const ay = ConvexHullVars.vertices[a + 1];
        const bx = ConvexHullVars.vertices[b];
        const by = ConvexHullVars.vertices[b + 1];
        const ox = ConvexHullVars.vertices[o];
        const oy = ConvexHullVars.vertices[o + 1];

        // aよりbが時計回り側にあるなら正の値を返す
        return Util.$cross(ax - ox, ay - oy, bx - ox, by - oy);
    }

    static almostEquals (a, b)
    {
        const ax = ConvexHullVars.vertices[a];
        const ay = ConvexHullVars.vertices[a + 1];
        const bx = ConvexHullVars.vertices[b];
        const by = ConvexHullVars.vertices[b + 1];

        // aとbの値がほぼ等しいかどうか
        const absX = Util.$abs(ax - bx);
        const absY = Util.$abs(ay - by);
        return absX < 0.001 && absY < 0.001;
    }

    static getExtremeSubhullsIndex()
    {
        let minIndex = 0;
        for (let i = 0; i < ConvexHullVars.extremePoints.length; i++) {
            const subhullsIndex = ConvexHullVars.extremePoints[i];
            if (subhullsIndex < 0) { break }

            const ax = ConvexHullVars.vertices[ConvexHullVars.subhulls[subhullsIndex]];
            const bx = ConvexHullVars.vertices[ConvexHullVars.subhulls[minIndex]];
            if (ax < bx) {
                minIndex = subhullsIndex;
            }
        }
        return minIndex;
    }

    static getCurrentExtremePointsIndex(currentSubhullsIndex)
    {
        // TODO 二分探索にできる
        for (let i = 0; i < ConvexHullVars.extremePoints.length; i++) {
            const subhullsIndex = ConvexHullVars.extremePoints[i + 1];
            if (currentSubhullsIndex < subhullsIndex) {
                return i;
            }
        }
    }

    static getNextSubhullsIndex(currentSubhullsIndex, currentExtremePointsIndex)
    {
        const extremeSubhullsIndex     = ConvexHullVars.extremePoints[currentExtremePointsIndex];
        const nextExtremeSubhullsIndex = ConvexHullVars.extremePoints[currentExtremePointsIndex + 1];

        const subhullsSize = nextExtremeSubhullsIndex - extremeSubhullsIndex;

        if (subhullsSize > 2) {
            const nextSubhullsIndex = currentSubhullsIndex + 1;
            if (nextSubhullsIndex < nextExtremeSubhullsIndex) {
                return nextSubhullsIndex;
            }
            return extremeSubhullsIndex;

        }
        if (nextExtremeSubhullsIndex < ConvexHullVars.extremePointsIndex - 1) {
            return nextExtremeSubhullsIndex;
        }
        return 0;

    }

    static binarySearch(extremePointsIndex, currentSubhullsIndex)
    {
        const extremeSubhullsIndex     = ConvexHullVars.extremePoints[extremePointsIndex];
        const nextExtremeSubhullsIndex = ConvexHullVars.extremePoints[extremePointsIndex + 1];

        let beginIndex = extremeSubhullsIndex;
        let endIndex   = nextExtremeSubhullsIndex;

        while (beginIndex < endIndex) {
            let prevBeginIndex = beginIndex - 1;
            let nextBeginIndex = beginIndex + 1;
            if (prevBeginIndex < extremeSubhullsIndex) {
                prevBeginIndex = nextExtremeSubhullsIndex - 1;
            }
            if (nextBeginIndex >= nextExtremeSubhullsIndex) {
                nextBeginIndex = extremeSubhullsIndex;
            }

            // 始点と基準点が同じ座標なら、始点の次の点が最も時計回り側にある点になる
            if (this.almostEquals(ConvexHullVars.subhulls[beginIndex], ConvexHullVars.subhulls[currentSubhullsIndex])) {
                return nextBeginIndex;
            }

            const beginPrev = this.clockwise(
                ConvexHullVars.subhulls[beginIndex],
                ConvexHullVars.subhulls[prevBeginIndex],
                ConvexHullVars.subhulls[currentSubhullsIndex]
            );
            const beginNext = this.clockwise(
                ConvexHullVars.subhulls[beginIndex],
                ConvexHullVars.subhulls[nextBeginIndex],
                ConvexHullVars.subhulls[currentSubhullsIndex]
            );

            const centerIndex = Util.$floor((beginIndex + endIndex) / 2);
            let prevCenterIndex = centerIndex - 1;
            let nextCenterIndex = centerIndex + 1;
            if (prevCenterIndex < extremeSubhullsIndex) {
                prevCenterIndex = nextExtremeSubhullsIndex - 1;
            }
            if (nextCenterIndex >= nextExtremeSubhullsIndex) {
                nextCenterIndex = extremeSubhullsIndex;
            }

            // 中心点と基準点が同じ座標なら、中心点の次の点が最も時計回り側にある点になる
            if (this.almostEquals(ConvexHullVars.subhulls[centerIndex], ConvexHullVars.subhulls[currentSubhullsIndex])) {
                return nextCenterIndex;
            }

            const centerPrev = this.clockwise(
                ConvexHullVars.subhulls[centerIndex],
                ConvexHullVars.subhulls[prevCenterIndex],
                ConvexHullVars.subhulls[currentSubhullsIndex]
            );
            const centerNext = this.clockwise(
                ConvexHullVars.subhulls[centerIndex],
                ConvexHullVars.subhulls[nextCenterIndex],
                ConvexHullVars.subhulls[currentSubhullsIndex]
            );

            // 中心点の前の点と次の点が、中心点より反時計回り側にあるなら、中心点が最も時計回り側にある点になる
            if (centerPrev <= 0 && centerNext <= 0) {
                return centerIndex;
            }

            // 探索する方向を求める
            const centerSide = this.clockwise(
                ConvexHullVars.subhulls[beginIndex],
                ConvexHullVars.subhulls[centerIndex],
                ConvexHullVars.subhulls[currentSubhullsIndex]
            );
            const pattern1 = centerSide   < 0 && (beginPrev <= 0 && beginNext <= 0); // 始点が最も時計回り側にあるパターン
            const pattern2 = centerSide   < 0 && (beginPrev  < 0 || beginNext  > 0); // 中心点が始点より反時計回り側にあるパターン
            const pattern3 = centerSide   > 0 && (centerPrev > 0 || centerNext < 0); // 中心点が始点より時計回り側にあるパターン
            const pattern4 = centerSide === 0 && (centerPrev > 0 || centerNext < 0); // 中心点と始点が平行しているパターン
            if (pattern1 || pattern2 || pattern3 || pattern4) {
                endIndex = centerIndex;
            } else {
                beginIndex = centerIndex + 1;
            }
        }

        return beginIndex;
    }

    static clearSubhulls ()
    {
        for (let i = 0; i < ConvexHullVars.subhulls.length; i++) {
            ConvexHullVars.subhulls[i] = -1;
        }
        ConvexHullVars.subhullsIndex = 0;
    }

    static clearExtremePoints ()
    {
        for (let i = 0; i < ConvexHullVars.extremePoints.length; i++) {
            ConvexHullVars.extremePoints[i] = -1;
        }
        ConvexHullVars.extremePointsIndex = 0;
    }

    static clearHulls ()
    {
        const hulls = ConvexHullVars.hulls[ConvexHullVars.t];
        for (let i = 0; i < hulls.length; i++) {
            hulls[i] = -1;
        }
        ConvexHullVars.hullsIndex = 0;
    }
}

//
// /**
//  * @class
//  */
// class ConvexHull
// {
//     /**
//      * @param  {array} vertices
//      * @return {array}
//      */
//     static compute (vertices)
//     {
//         // 頂点数が3以下ならそのまま返す
//         if (vertices.length <= 9) {
//             return vertices;
//         }

//         const points = Util.$getArray();
//         const verticesLength = vertices.length;
//         for (let i = 0; i < verticesLength; i += 3) {
//             points.push({
//                 "x": vertices[i],
//                 "y": vertices[i + 1]
//             });
//         }

//         // const hulls = this.giftWrapping(points);
//         // const hulls = this.monotoneChain(points);
//         const hulls = this.chansAlgorithm(points);

//         const result = Util.$getArray();
//         const hullsLength = hulls.length;
//         for (let i = 0; i < hullsLength; i++) {
//             const hull = hulls[i];
//             result.push(hull.x, hull.y, false);
//         }

//         Util.$poolArray(points);
//         Util.$poolArray(hulls);

//         return result;
//     }

//     /**
//      * @description 「Chan's Algorithm」で、点列から凸包を求める
//      * @param  {array} points
//      * @return {array}
//      * @private
//      */
//     static chansAlgorithm (points)
//     {
//         const result = Util.$getArray();

//         for (let t = 2; ; t++) {
//             result.length = 0;
//             const m = Util.$pow(2, Util.$pow(2, t));

//             // 点集合を要素数mの部分集合に分割し、部分凸包を求める
//             const subsets  = this.getSubsets(points, m);
//             const subhulls = this.getSubhulls(subsets);
//             const subhullsLength = subhulls.length;

//             // x座標が最も小さい点を、初期の基準点にする
//             const extremeHullIndex  = this.extremePointOfSubhulls(subhulls);
//             const extremePointIndex = 0;

//             let currentHullIndex  = extremeHullIndex;
//             let currentPointIndex = extremePointIndex;
//             let currentPoint      = subhulls[currentHullIndex][currentPointIndex];

//             let isComplete        = false;
//             while (true) {
//                 // 基準点を、凸包に追加する
//                 result.push(currentPoint);

//                 // もし凸包サイズがmに達したら、tを更新して再計算する
//                 if (result.length >= m) {
//                     break;
//                 }

//                 // 次の基準点候補の初期値は、基準点以外の点にする
//                 let nextHullIndex;
//                 let nextPointIndex;
//                 if (subhulls[currentHullIndex].length > 2) {
//                     nextHullIndex  = currentHullIndex;
//                     nextPointIndex = (currentPointIndex + 1) % subhulls[currentHullIndex].length;
//                 } else {
//                     nextHullIndex  = (currentHullIndex + 1) % subhulls.length;
//                     nextPointIndex = 0;
//                 }
//                 let nextPoint = subhulls[nextHullIndex][nextPointIndex];

//                 // 基準点から最も時計回り側にある点を、次の基準点にする
//                 for (let i = 0; i < subhullsLength; i++) {
//                     // const pointIndex = this.linearSearch(subhulls[i], currentPoint);
//                     const pointIndex = this.binarySearch(subhulls[i], currentPoint);
//                     const point = subhulls[i][pointIndex];

//                     if (this.orientation(nextPoint, point, currentPoint) > 0) {
//                         nextHullIndex  = i;
//                         nextPointIndex = pointIndex;
//                         nextPoint      = point;
//                     }
//                 }

//                 currentHullIndex  = nextHullIndex;
//                 currentPointIndex = nextPointIndex;
//                 currentPoint      = subhulls[currentHullIndex][currentPointIndex];

//                 // 基準点とx座標が最も小さい点が一致しているなら、凸包が完成している
//                 if (currentHullIndex === extremeHullIndex && currentPointIndex === extremePointIndex) {
//                     isComplete = true;
//                     break;
//                 }
//             }

//             Util.$poolArray(subsets);
//             Util.$poolArray(subhulls);

//             if (isComplete) {
//                 return result;
//             }
//         }
//     }

//     /**
//      * @description 点集合を、要素数mの部分集合に分割する
//      * @param  {array}  points
//      * @param  {number} m
//      * @return {array}
//      * @private
//      */
//     static getSubsets (points, m)
//     {
//         const result = Util.$getArray();
//         const length = points.length;
//         for (let i = 0; i < length; i += m) {
//             result.push(points.slice(i, Util.$min(i + m, length)));
//         }
//         return result;
//     }

//     /**
//      * @description 部分集合から、部分凸包を求める
//      * @param  {array} subsets
//      * @return {array}
//      * @private
//      */
//     static getSubhulls (subsets)
//     {
//         const result = Util.$getArray();
//         const length = subsets.length;
//         for (let i = 0; i < length; i++) {
//             result.push(this.monotoneChain(subsets[i]));
//         }
//         return result;
//     }

//     /**
//      * @description 「MonotoneChain」で、点集合から凸包を求める
//      * @param  {array} points
//      * @return {array}
//      * @private
//      */
//     static monotoneChain (points)
//     {
//         // 点集合のソートが不要なら、そのまま返す
//         if (points.length < 2) {
//             return points;
//         }

//         // 点集合をx座標が小さい順にソートする
//         points.sort(function(a, b) { return a.x - b.x || a.y - b.y; });
//         const length = points.length;

//         // 下包を求める
//         const lower = Util.$getArray();
//         for (let i = 0; i < length; i++) {
//             const point = points[i];
//             while (lower.length >= 2) {
//                 if (this.orientation(lower[lower.length - 1], point, lower[lower.length - 2]) < 0) {
//                     break;
//                 }
//                 lower.pop();
//             }

//             // 座標がほぼ同じ点は含めない
//             if (lower.length > 0) {
//                 const top = lower[lower.length - 1];
//                 const abs1 = Util.$abs(point.x - top.x);
//                 const abs2 = Util.$abs(point.y - top.y);
//                 if (abs1 < 0.001 && abs2 < 0.001) {
//                     lower.pop();
//                 }
//             }

//             lower.push(point);
//         }

//         // 上包を求める
//         const upper = Util.$getArray();
//         for (let i = length - 1; i >= 0; i--) {
//             const point = points[i];
//             while (upper.length >= 2) {
//                 if (this.orientation(upper[upper.length - 1], point, upper[upper.length - 2]) < 0) {
//                     break;
//                 }
//                 upper.pop();
//             }

//             // 座標がほぼ同じ点は含めない
//             if (upper.length > 0) {
//                 const top = upper[upper.length - 1];
//                 const abs1 = Util.$abs(point.x - top.x);
//                 const abs2 = Util.$abs(point.y - top.y);
//                 if (abs1 < 0.001 && abs2 < 0.001) {
//                     upper.pop();
//                 }
//             }

//             upper.push(point);
//         }

//         // 重複する点は削除する
//         lower.pop();
//         upper.pop();

//         // 下包と上包をマージする
//         const result = lower.concat(upper);

//         Util.$poolArray(lower);
//         Util.$poolArray(upper);

//         return result;
//     }

//     /**
//      * @param  {object} p1
//      * @param  {object} p2
//      * @param  {object} origin
//      * @return {number}
//      * @private
//      */
//     static orientation (p1, p2, origin)
//     {
//         // p1よりp2が時計回り側にあるなら正の値を返す
//         return Util.$cross(p1.x - origin.x, p1.y - origin.y, p2.x - origin.x, p2.y - origin.y);
//     }

//     /**
//      * @description 部分凸包の中で、x座標が最も小さい点を含む凸包のインデックスを返す
//      * @param  {array}  subhulls
//      * @return {number}
//      * @private
//      */
//     static extremePointOfSubhulls (subhulls)
//     {
//         const extremePoints = Util.$getArray();
//         const length = subhulls.length;
//         for (let i = 0; i < length; i++) {
//             // （x座標が小さい順にソートされている）凸包の始点を取る
//             extremePoints.push(subhulls[i][0]);
//         }

//         const result = this.extremePoint(extremePoints);

//         Util.$poolArray(extremePoints);

//         return result;
//     }

//     /**
//      * @description 点集合の中で、x座標が最も小さい点のインデックスを返す
//      * @param  {array}  points
//      * @return {number}
//      * @private
//      */
//     static extremePoint (points)
//     {
//         let minIndex = 0;
//         const length = points.length;
//         for (let i = 1; i < length; i++) {
//             if (points[i].x < points[minIndex].x) {
//                 minIndex = i;
//             }
//         }
//         return minIndex;
//     }

//     /**
//      * @description （x座標が小さい順にソートされている）凸包の中で、基準点から最も時計回り側にある点のインデックスを返す
//      * @param  {array}  hullPoints
//      * @param  {object} currentPoint
//      * @return {number}
//      * @private
//      */
//     static binarySearch (hullPoints, currentPoint)
//     {
//         const length = hullPoints.length;

//         let beginIndex = 0;
//         let endIndex   = length;

//         while (beginIndex < endIndex) {
//             // 始点と基準点が同じ座標なら、始点の次の点が最も時計回り側にある点になる
//             if (this.equalsPoint(hullPoints[beginIndex], currentPoint)) {
//                 return (beginIndex + 1) % length;
//             }
//             const beginPrev = this.orientation(hullPoints[beginIndex], hullPoints[(beginIndex + length - 1) % length], currentPoint);
//             const beginNext = this.orientation(hullPoints[beginIndex], hullPoints[(beginIndex + 1) % length], currentPoint);

//             // 中心点と基準点が同じ座標なら、中心点の次の点が最も時計回り側にある点になる
//             const centerIndex = Util.$floor((beginIndex + endIndex) / 2);
//             if (this.equalsPoint(hullPoints[centerIndex], currentPoint)) {
//                 return (centerIndex + 1) % length;
//             }
//             const centerPrev = this.orientation(hullPoints[centerIndex], hullPoints[(centerIndex + length - 1) % length], currentPoint);
//             const centerNext = this.orientation(hullPoints[centerIndex], hullPoints[(centerIndex + 1) % length], currentPoint);

//             // 中心点の前の点と次の点が、中心点より反時計回り側にあるなら、中心点が最も時計回り側にある点になる
//             if (centerPrev <= 0 && centerNext <= 0) {
//                 return centerIndex;
//             }

//             // 探索する方向を求める
//             const centerSide = this.orientation(hullPoints[beginIndex], hullPoints[centerIndex], currentPoint);
//             const ptn1 = (centerSide   < 0 && (beginPrev <= 0 && beginNext <= 0)); // 始点が最も時計回り側にあるパターン
//             const ptn2 = (centerSide   < 0 && (beginPrev  < 0 || beginNext  > 0)); // 中心点が始点より反時計回り側にあるパターン
//             const ptn3 = (centerSide   > 0 && (centerPrev > 0 || centerNext < 0)); // 中心点が始点より時計回り側にあるパターン
//             const ptn4 = (centerSide === 0 && (centerPrev > 0 || centerNext < 0)); // 中心点と始点が平行しているパターン
//             if (ptn1 || ptn2 || ptn3 || ptn4) {
//                 endIndex = centerIndex;
//             } else {
//                 beginIndex = centerIndex + 1;
//             }
//         }

//         return beginIndex;
//     }

//     /**
//      * @description 凸包の中で、基準点から最も時計回り側にある点のインデックスを返す（テスト用）
//      * @param  {array}  hullPoints
//      * @param  {object} currentPoint
//      * @return {number}
//      * @private
//      */
//     static linearSearch (hullPoints, currentPoint)
//     {
//         let minIndex = 0;
//         const length = hullPoints.length;
//         for (let i = 0; i < length; i++) {
//             if (this.equalsPoint(hullPoints[i], currentPoint)) {
//                 return (i + 1) % length;
//             }
//             if (this.orientation(hullPoints[minIndex], hullPoints[i], currentPoint) > 0) {
//                 minIndex = i;
//             }
//         }
//         return minIndex;
//     }

//     /**
//      * @param  {object} p1
//      * @param  {object} p2
//      * @return {boolean}
//      * @private
//      */
//     static equalsPoint (p1, p2)
//     {
//         return p1.x === p2.x && p1.y === p2.y;
//     }

//     /**
//      * @description 「ギフト包装法」で、点集合から凸包を求める（テスト用）
//      * @param  {array} points
//      * @return {array}
//      * @private
//      */
//     static giftWrapping (points)
//     {
//         const result = Util.$getArray();
//         const length = points.length;

//         // x座標が最も小さい点を、初期の基準点にする
//         const extremePointIndex = this.extremePoint(points);

//         let currentIndex = extremePointIndex;
//         do {
//             // 基準点を、凸包に追加する
//             result.push(points[currentIndex]);

//             let nextIndex = (currentIndex + 1) % length;
//             let nx = points[nextIndex].x - points[currentIndex].x;
//             let ny = points[nextIndex].y - points[currentIndex].y;

//             // 基準点から最も時計回り側にある点を、次の基準点にする
//             for (let i = 0; i < length; i++) {
//                 const ix = points[i].x - points[currentIndex].x;
//                 const iy = points[i].y - points[currentIndex].y;

//                 if (Util.$cross(nx, ny, ix, iy) > 0) {
//                     nextIndex = i;
//                     nx = ix;
//                     ny = iy;
//                 }
//             }

//             currentIndex = nextIndex;
//         } while (currentIndex !== extremePointIndex);

//         return result;
//     }
// }
