/**
 * @class
 */
class WebGLStrokeMeshGenerator
{
    /**
     * @param  {array}  vertices
     * @param  {string} lineCap
     * @param  {string} lineJoin
     * @return {object}
     * @method
     * @static
     */
    static generate (vertices, lineCap, lineJoin)
    {
        this._$vertexBufferData = this._$vertexBufferData || new Util.$Float32Array(1024);
        this._$vertexBufferPos = 0;

        this._$indexBufferData = this._$indexBufferData || new Util.$Int16Array(256);
        this._$indexBufferPos = 0;

        this._$lineCap  = lineCap;
        this._$lineJoin = lineJoin;

        for (let i = 0; i < vertices.length; i++) {
            const vertexBeginOffset = this._$vertexBufferPos;
            this._$generateLineSegment(vertices[i]);
            const vertexEndOffset   = this._$vertexBufferPos;

            this._$generateLineJoin(vertexBeginOffset, vertexEndOffset);
            this._$generateLineCap(vertexBeginOffset, vertexEndOffset);
        }

        return {
            "vertexBufferData": this._$vertexBufferData.slice(0, this._$vertexBufferPos),
            "indexBufferData" : this._$indexBufferData.slice(0, this._$indexBufferPos)
        };
    }

    /**
     * @param  {number} deltaLength
     * @return {void}
     * @method
     * @static
     * @private
     */
    static _$expandVertexBufferIfNeeded(deltaLength) {
        if (this._$vertexBufferPos + deltaLength > this._$vertexBufferData.length) {
            const biggerBuffer = new Util.$Float32Array(this._$vertexBufferData.length * 2);
            biggerBuffer.set(this._$vertexBufferData);
            this._$vertexBufferData = biggerBuffer;
        }
    }

    /**
     * @param  {number} deltaLength
     * @return {void}
     * @method
     * @static
     * @private
     */
    static _$expandIndexBufferIfNeeded(deltaLength) {
        if (this._$indexBufferPos + deltaLength > this._$indexBufferData.length) {
            const biggerBuffer = new Util.$Int16Array(this._$indexBufferData.length * 2);
            biggerBuffer.set(this._$indexBufferData);
            this._$indexBufferData = biggerBuffer;
        }
    }

    /**
     * @param  {array} vertex
     * @return {void}
     * @method
     * @static
     * @private
     */
    static _$generateLineSegment (vertex)
    {
        const length = vertex.length - 5;
        for (let v = 0; v < length; v += 3) {
            if (vertex[v + 2]) {
                continue;
            }

            if (vertex[v + 5]) {
                this._$addQuadSegmentMesh(
                    vertex[v],     vertex[v + 1],
                    vertex[v + 3], vertex[v + 4],
                    vertex[v + 6], vertex[v + 7]
                );
            } else {
                this._$addLineSegmentMesh(
                    vertex[v],     vertex[v + 1],
                    vertex[v + 3], vertex[v + 4]
                );
            }
        }
    }

    /**
     * @param  {number} x1 線分の始点のx座標
     * @param  {number} y1 線分の始点のy座標
     * @param  {number} cx 線分の制御点のx座標
     * @param  {number} cy 線分の制御点のy座標
     * @param  {number} x2 線分の終点のx座標
     * @param  {number} y2 線分の終点のy座標
     * @return {void}
     * @method
     * @static
     * @private
     */
    static _$addQuadSegmentMesh (x1, y1, cx, cy, x2, y2)
    {
        const div = 11;

        let stx = x1;
        let sty = y1;
        for (let i = 1; i < div; i++) {
            const t = i / div;
            const rt = 1 - t;
            const edx = (x1 * rt + cx * t) * rt + (cx * rt + x2 * t) * t;
            const edy = (y1 * rt + cy * t) * rt + (cy * rt + y2 * t) * t;
            this._$addLineSegmentMesh(stx, sty, edx, edy, 2);

            stx = edx;
            sty = edy;
        }
        this._$addLineSegmentMesh(stx, sty, x2, y2);
    }

    /**
     * @param  {number} x1 線分の始点のx座標
     * @param  {number} y1 線分の始点のy座標
     * @param  {number} x2 線分の終点のx座標
     * @param  {number} y2 線分の終点のy座標
     * @param  {number} [type = 1]
     * @return {void}
     * @method
     * @static
     * @private
     */
    static _$addLineSegmentMesh (x1, y1, x2, y2, type = 1)
    {
        const index0 = this._$vertexBufferPos / 7;
        const index1 = index0 + 1;
        const index2 = index0 + 2;
        const index3 = index0 + 3;

        this._$expandIndexBufferIfNeeded(6);
        const ibd = this._$indexBufferData;
        let ibp = this._$indexBufferPos;

        ibd[ibp++] = index0;
        ibd[ibp++] = index1;
        ibd[ibp++] = index3;

        ibd[ibp++] = index3;
        ibd[ibp++] = index2;
        ibd[ibp++] = index0;

        this._$indexBufferPos = ibp;

        this._$expandVertexBufferIfNeeded(28);
        const vbd = this._$vertexBufferData;
        let vbp = this._$vertexBufferPos;

        vbd[vbp++] = x1;
        vbd[vbp++] = y1;
        vbd[vbp++] = x2;
        vbd[vbp++] = y2;
        vbd[vbp++] = 1;
        vbd[vbp++] = 1;
        vbd[vbp++] = 1;

        vbd[vbp++] = x1;
        vbd[vbp++] = y1;
        vbd[vbp++] = x2;
        vbd[vbp++] = y2;
        vbd[vbp++] = -1;
        vbd[vbp++] = -1;
        vbd[vbp++] = 1;

        vbd[vbp++] = x2;
        vbd[vbp++] = y2;
        vbd[vbp++] = x1;
        vbd[vbp++] = y1;
        vbd[vbp++] = -1;
        vbd[vbp++] = -1;
        vbd[vbp++] = type;

        vbd[vbp++] = x2;
        vbd[vbp++] = y2;
        vbd[vbp++] = x1;
        vbd[vbp++] = y1;
        vbd[vbp++] = 1;
        vbd[vbp++] = 1;
        vbd[vbp++] = type;

        this._$vertexBufferPos = vbp;
    }

    /**
     * @param  {number} vertexBeginOffset 結合対象の頂点の範囲（開始）
     * @param  {number} vertexEndOffset   結合対象の頂点の範囲（終了）
     * @return {void}
     * @method
     * @static
     * @private
     */
    static _$generateLineJoin (vertexBeginOffset, vertexEndOffset)
    {
        const vbd = this._$vertexBufferData;
        const length = vertexEndOffset - 55;
        for (let v = vertexBeginOffset; v < length; v += 28) {
            const indexOffset = v / 7;
            this._$addLineJoinMesh(
                vbd[v],      vbd[v + 1],
                vbd[v + 21], vbd[v + 22], vbd[v + 27],
                vbd[v + 49], vbd[v + 50],
                indexOffset + 2, indexOffset + 3, indexOffset + 4, indexOffset + 5
            );
        }
    }

    /**
     * @param  {number} x1           線分Aの始点のx座標
     * @param  {number} y1           線分Aの始点のy座標
     * @param  {number} x2           結合点のx座標
     * @param  {number} y2           結合点のy座標
     * @param  {number} type         線分タイプ
     * @param  {number} x3           線分Bの終点のx座標
     * @param  {number} y3           線分Bの終点のy座標
     * @param  {number} indexOffset2 線分Aの凸側の頂点インデックス
     * @param  {number} indexOffset3 線分Aの凹側の頂点インデックス
     * @param  {number} indexOffset4 線分Bの凸側の頂点インデックス
     * @param  {number} indexOffset5 線分Bの凹側の頂点インデックス
     * @return {void}
     * @method
     * @static
     * @private
     */
    static _$addLineJoinMesh (x1, y1, x2, y2, type, x3, y3, indexOffset2, indexOffset3, indexOffset4, indexOffset5)
    {
        // AとBがほぼ平行なら、結合せずに終了
        const ax = x2 - x1;
        const ay = y2 - y1;
        const bx = x3 - x2;
        const by = y3 - y2;
        const det = Util.$cross(ax, ay, bx, by);
        if ($Math.abs(det) < 0.0001) { return }

        // 分割したベジェ曲線はベベルで結合する
        if (type === 2) {
            this._$addBevelJoinMesh(x2, y2, indexOffset4, indexOffset2, indexOffset3, indexOffset5);
            return;
        }

        // 結合タイプに合わせたメッシュを追加する
        switch (this._$lineJoin) {
            case JointStyle.ROUND:
                this._$addRoundJoinMesh(x2, y2);
                break;
            case JointStyle.MITER:
                this._$addMiterJoinMesh(x2, y2, x1, y1, x3, y3, indexOffset4, indexOffset2, indexOffset3, indexOffset5);
                break;
            default:
                this._$addBevelJoinMesh(x2, y2, indexOffset4, indexOffset2, indexOffset3, indexOffset5);
                break;
        }
    }

    /**
     * @param  {number} x 結合点のx座標
     * @param  {number} y 結合点のy座標
     * @return {void}
     * @method
     * @static
     * @private
     */
    static _$addRoundJoinMesh (x, y)
    {
        const index0 = this._$vertexBufferPos / 7;

        this._$expandIndexBufferIfNeeded(57);
        const ibd = this._$indexBufferData;
        let ibp = this._$indexBufferPos;

        for (let i = 1; i < 18; i++) {
            const indexN = index0 + i;
            ibd[ibp++] = index0;
            ibd[ibp++] = indexN;
            ibd[ibp++] = indexN + 1;
        }
        ibd[ibp++] = index0;
        ibd[ibp++] = index0 + 18;
        ibd[ibp++] = index0 + 1;

        this._$indexBufferPos = ibp;

        this._$expandVertexBufferIfNeeded(133);
        const vbd = this._$vertexBufferData;
        let vbp = this._$vertexBufferPos;

        vbd[vbp++] = x;
        vbd[vbp++] = y;
        vbd[vbp++] = 0;
        vbd[vbp++] = 0;
        vbd[vbp++] = 0;
        vbd[vbp++] = 0;
        vbd[vbp++] = 0;

        for (let i = 0; i < 18; i++) {
            vbd[vbp++] = x;
            vbd[vbp++] = y;
            vbd[vbp++] = 0;
            vbd[vbp++] = 0;
            vbd[vbp++] = 0;
            vbd[vbp++] = 0;
            vbd[vbp++] = 30 + i;
        }

        this._$vertexBufferPos = vbp;
    }

    /**
     * @param  {number} x      結合点のx座標
     * @param  {number} y      結合点のy座標
     * @param  {number} ax     線分Aの始点のx座標
     * @param  {number} ay     線分Aの始点のy座標
     * @param  {number} bx     線分Bの終点のx座標
     * @param  {number} by     線分Bの終点のy座標
     * @param  {number} index1
     * @param  {number} index4
     * @param  {number} index5
     * @param  {number} index8
     * @return {void}
     * @method
     * @static
     * @private
     */
    static _$addMiterJoinMesh (x, y, ax, ay, bx, by, index1, index4, index5, index8)
    {
        const index0 = this._$vertexBufferPos / 7;
        const index2 = index0 + 1;
        const index3 = index0 + 2;
        const index6 = index0 + 3;
        const index7 = index0 + 4;

        this._$expandIndexBufferIfNeeded(18);
        const ibd = this._$indexBufferData;
        let ibp = this._$indexBufferPos;

        ibd[ibp++] = index0;
        ibd[ibp++] = index1;
        ibd[ibp++] = index2;

        ibd[ibp++] = index0;
        ibd[ibp++] = index2;
        ibd[ibp++] = index3;

        ibd[ibp++] = index0;
        ibd[ibp++] = index3;
        ibd[ibp++] = index4;

        ibd[ibp++] = index0;
        ibd[ibp++] = index5;
        ibd[ibp++] = index6;

        ibd[ibp++] = index0;
        ibd[ibp++] = index6;
        ibd[ibp++] = index7;

        ibd[ibp++] = index0;
        ibd[ibp++] = index7;
        ibd[ibp++] = index8;

        this._$indexBufferPos = ibp;

        this._$expandVertexBufferIfNeeded(35);
        const vbd = this._$vertexBufferData;
        let vbp = this._$vertexBufferPos;

        vbd[vbp++] = x;
        vbd[vbp++] = y;
        vbd[vbp++] = ax;
        vbd[vbp++] = ay;
        vbd[vbp++] = bx;
        vbd[vbp++] = by;
        vbd[vbp++] = 0;

        vbd[vbp++] = x;
        vbd[vbp++] = y;
        vbd[vbp++] = ax;
        vbd[vbp++] = ay;
        vbd[vbp++] = bx;
        vbd[vbp++] = by;
        vbd[vbp++] = 21;

        vbd[vbp++] = x;
        vbd[vbp++] = y;
        vbd[vbp++] = ax;
        vbd[vbp++] = ay;
        vbd[vbp++] = bx;
        vbd[vbp++] = by;
        vbd[vbp++] = 22;

        vbd[vbp++] = x;
        vbd[vbp++] = y;
        vbd[vbp++] = ax;
        vbd[vbp++] = ay;
        vbd[vbp++] = bx;
        vbd[vbp++] = by;
        vbd[vbp++] = 23;

        vbd[vbp++] = x;
        vbd[vbp++] = y;
        vbd[vbp++] = ax;
        vbd[vbp++] = ay;
        vbd[vbp++] = bx;
        vbd[vbp++] = by;
        vbd[vbp++] = 24;

        this._$vertexBufferPos = vbp;
    }

    /**
     * @param  {number} x      結合点のx座標
     * @param  {number} y      結合点のy座標
     * @param  {number} index1
     * @param  {number} index2
     * @param  {number} index3
     * @param  {number} index4
     * @return {void}
     * @method
     * @static
     * @private
     */
    static _$addBevelJoinMesh (x, y, index1, index2, index3, index4)
    {
        const index0 = this._$vertexBufferPos / 7;

        this._$expandIndexBufferIfNeeded(6);
        const ibd = this._$indexBufferData;
        let ibp = this._$indexBufferPos;

        ibd[ibp++] = index0;
        ibd[ibp++] = index1;
        ibd[ibp++] = index2;

        ibd[ibp++] = index0;
        ibd[ibp++] = index3;
        ibd[ibp++] = index4;

        this._$indexBufferPos = ibp;

        this._$expandVertexBufferIfNeeded(7);
        const vbd = this._$vertexBufferData;
        let vbp = this._$vertexBufferPos;

        vbd[vbp++] = x;
        vbd[vbp++] = y;
        vbd[vbp++] = 0;
        vbd[vbp++] = 0;
        vbd[vbp++] = 0;
        vbd[vbp++] = 0;
        vbd[vbp++] = 0;

        this._$vertexBufferPos = vbp;
    }

    /**
     * @param  {number} vertexBeginOffset 結合対象の頂点の範囲（開始）
     * @param  {number} vertexEndOffset   結合対象の頂点の範囲（終了）
     * @return {void}
     * @method
     * @static
     * @private
     */
    static _$generateLineCap (vertexBeginOffset, vertexEndOffset)
    {
        const vbd = this._$vertexBufferData;
        const stx1 = vbd[vertexBeginOffset];
        const sty1 = vbd[vertexBeginOffset + 1];
        const stx2 = vbd[vertexBeginOffset + 2];
        const sty2 = vbd[vertexBeginOffset + 3];
        const edx1 = vbd[vertexEndOffset - 7];
        const edy1 = vbd[vertexEndOffset - 6];
        const edx2 = vbd[vertexEndOffset - 5];
        const edy2 = vbd[vertexEndOffset - 4];

        const indexBeginOffset = vertexBeginOffset / 7;
        const indexEndOffset   = vertexEndOffset / 7;

        // 始点st1と終点ed1が同じなら、線端は追加せずに結合する
        if (stx1 === edx1 && sty1 === edy1) {
            this._$addLineJoinMesh(
                edx2, edy2, stx1, sty1, stx2, sty2,
                indexEndOffset - 2, indexEndOffset - 1,
                indexBeginOffset, indexBeginOffset + 1
            );
            return;
        }

        // 始点の線端を追加する
        this._$addLineCapMesh(stx1, sty1, stx2, sty2, indexBeginOffset, indexBeginOffset + 1);

        // 終点の線端を追加する
        this._$addLineCapMesh(edx1, edy1, edx2, edy2, indexEndOffset - 1, indexEndOffset - 2);
    }

    /**
     * @param  {number} x1     線端のx座標
     * @param  {number} y1     線端のy座標
     * @param  {number} x2     もう一方の端点のx座標
     * @param  {number} y2     もう一方の端点のy座標
     * @param  {number} index1 端点から反時計回り側の頂点インデックス
     * @param  {number} index2 端点から時計回り側の頂点インデックス
     * @return {void}
     * @method
     * @static
     * @private
     */
    static _$addLineCapMesh (x1, y1, x2, y2, index1, index2)
    {
        // 線端タイプに合わせたメッシュを追加する
        switch (this._$lineCap) {
            case CapsStyle.ROUND:
                this._$addRoundJoinMesh(x1, y1);
                break;
            case CapsStyle.SQUARE:
                this._$addSquareCapMesh(x1, y1, x2, y2, index1, index2);
                break;
        }
    }

    /**
     * @param  {number} x1     線端のx座標
     * @param  {number} y1     線端のy座標
     * @param  {number} x2     もう一方の端点のx座標
     * @param  {number} y2     もう一方の端点のy座標
     * @param  {number} index1 端点から反時計回り側の頂点インデックス
     * @param  {number} index2 端点から時計回り側の頂点インデックス
     * @return {void}
     * @method
     * @static
     * @private
     */
    static _$addSquareCapMesh (x1, y1, x2, y2, index1, index2)
    {
        const index3 = this._$vertexBufferPos / 7;
        const index4 = index3 + 1;

        this._$expandIndexBufferIfNeeded(6);
        const ibd = this._$indexBufferData;
        let ibp = this._$indexBufferPos;

        ibd[ibp++] = index1;
        ibd[ibp++] = index3;
        ibd[ibp++] = index4;

        ibd[ibp++] = index4;
        ibd[ibp++] = index2;
        ibd[ibp++] = index1;

        this._$indexBufferPos = ibp;

        this._$expandVertexBufferIfNeeded(14);
        const vbd = this._$vertexBufferData;
        let vbp = this._$vertexBufferPos;

        vbd[vbp++] = x1;
        vbd[vbp++] = y1;
        vbd[vbp++] = x2;
        vbd[vbp++] = y2;
        vbd[vbp++] = -1;
        vbd[vbp++] = -1;
        vbd[vbp++] = 10;

        vbd[vbp++] = x1;
        vbd[vbp++] = y1;
        vbd[vbp++] = x2;
        vbd[vbp++] = y2;
        vbd[vbp++] = 1;
        vbd[vbp++] = 1;
        vbd[vbp++] = 10;

        this._$vertexBufferPos = vbp;
    }
}