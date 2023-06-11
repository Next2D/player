import type { StrokeMethImpl } from "../interface/StrokeMethImpl";
import type { JointStyle, CapsStyle } from "../interface/StrokeTypeImpl";
import {
    $Float32Array,
    $Int16Array,
    $Math,
    $cross
} from "../player/util/RenderUtil";

/**
 * @class
 */
export class WebGLStrokeMeshGenerator
{
    private static _$vertexBufferData: Float32Array;
    private static _$vertexBufferPos: number;
    private static _$indexBufferData: Int16Array;
    private static _$indexBufferPos: number;
    private static _$lineCap: string;
    private static _$lineJoin: string;

    /**
     * @param  {array}  vertices
     * @param  {string} line_cap
     * @param  {string} line_join
     * @return {object}
     * @method
     * @static
     */
    static generate (
        vertices: any[],
        line_cap: CapsStyle,
        line_join: JointStyle
    ): StrokeMethImpl {

        this._$vertexBufferData = this._$vertexBufferData || new $Float32Array(1024);
        this._$vertexBufferPos = 0;

        this._$indexBufferData = this._$indexBufferData || new Int16Array(256);
        this._$indexBufferPos = 0;

        this._$lineCap  = line_cap;
        this._$lineJoin = line_join;

        for (let i: number = 0; i < vertices.length; i++) {

            const vertex_begin_offset: number = this._$vertexBufferPos;
            this._$generateLineSegment(vertices[i]);
            const vertex_end_offset: number   = this._$vertexBufferPos;

            this._$generateLineJoin(vertex_begin_offset, vertex_end_offset);
            this._$generateLineCap(vertex_begin_offset, vertex_end_offset);
        }

        return {
            "vertexBufferData": this._$vertexBufferData.slice(0, this._$vertexBufferPos),
            "indexBufferData" : this._$indexBufferData.slice(0, this._$indexBufferPos)
        };
    }

    /**
     * @param  {number} delta_length
     * @return {void}
     * @method
     * @static
     * @private
     */
    static _$expandVertexBufferIfNeeded (delta_length: number): void
    {
        if (this._$vertexBufferPos + delta_length > this._$vertexBufferData.length) {
            const biggerBuffer: Float32Array = new $Float32Array(this._$vertexBufferData.length * 2);
            biggerBuffer.set(this._$vertexBufferData);
            this._$vertexBufferData = biggerBuffer;
        }
    }

    /**
     * @param  {number} delta_length
     * @return {void}
     * @method
     * @static
     * @private
     */
    static _$expandIndexBufferIfNeeded(delta_length: number): void
    {
        if (this._$indexBufferPos + delta_length > this._$indexBufferData.length) {
            const biggerBuffer: Int16Array = new $Int16Array(this._$indexBufferData.length * 2);
            biggerBuffer.set(this._$indexBufferData);
            this._$indexBufferData = biggerBuffer;
        }
    }

    /**
     * @param  {Float32Array} vertex
     * @return {void}
     * @method
     * @static
     * @private
     */
    static _$generateLineSegment (vertex: any[]): void
    {
        const length: number = vertex.length - 5;
        for (let v: number = 0; v < length; v += 3) {

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
    static _$addQuadSegmentMesh (
        x1: number, y1: number,
        cx: number, cy: number,
        x2: number, y2: number
    ): void {

        const div: number = 11;

        let stx: number = x1;
        let sty: number = y1;
        for (let i: number = 1; i < div; i++) {

            const t: number  = i / div;
            const rt: number = 1 - t;

            const edx: number = (x1 * rt + cx * t) * rt + (cx * rt + x2 * t) * t;
            const edy: number = (y1 * rt + cy * t) * rt + (cy * rt + y2 * t) * t;

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
    static _$addLineSegmentMesh (
        x1: number, y1: number,
        x2: number, y2: number,
        type: number = 1
    ): void {

        const index0: number = this._$vertexBufferPos / 7;
        const index1: number = index0 + 1;
        const index2: number = index0 + 2;
        const index3: number = index0 + 3;

        this._$expandIndexBufferIfNeeded(6);
        const ibd: Int16Array = this._$indexBufferData;
        let ibp: number = this._$indexBufferPos;

        ibd[ibp++] = index0;
        ibd[ibp++] = index1;
        ibd[ibp++] = index3;

        ibd[ibp++] = index3;
        ibd[ibp++] = index2;
        ibd[ibp++] = index0;

        this._$indexBufferPos = ibp;

        this._$expandVertexBufferIfNeeded(28);
        const vbd: Float32Array = this._$vertexBufferData;
        let vbp: number = this._$vertexBufferPos;

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
     * @param  {number} vertex_begin_offset 結合対象の頂点の範囲（開始）
     * @param  {number} vertex_end_offset   結合対象の頂点の範囲（終了）
     * @return {void}
     * @method
     * @static
     * @private
     */
    static _$generateLineJoin (
        vertex_begin_offset: number,
        vertex_end_offset: number
    ): void {

        const vbd: Float32Array = this._$vertexBufferData;
        const length: number = vertex_end_offset - 55;
        for (let v: number = vertex_begin_offset; v < length; v += 28) {
            const indexOffset: number = v / 7;
            this._$addLineJoinMesh(
                vbd[v],      vbd[v + 1],
                vbd[v + 21], vbd[v + 22], vbd[v + 27],
                vbd[v + 49], vbd[v + 50],
                indexOffset + 2, indexOffset + 3, indexOffset + 4, indexOffset + 5
            );
        }
    }

    /**
     * @param  {number} x1            線分Aの始点のx座標
     * @param  {number} y1            線分Aの始点のy座標
     * @param  {number} x2            結合点のx座標
     * @param  {number} y2            結合点のy座標
     * @param  {number} type          線分タイプ
     * @param  {number} x3            線分Bの終点のx座標
     * @param  {number} y3            線分Bの終点のy座標
     * @param  {number} index_offset2 線分Aの凸側の頂点インデックス
     * @param  {number} index_offset3 線分Aの凹側の頂点インデックス
     * @param  {number} index_offset4 線分Bの凸側の頂点インデックス
     * @param  {number} index_offset5 線分Bの凹側の頂点インデックス
     * @return {void}
     * @method
     * @static
     * @private
     */
    static _$addLineJoinMesh (
        x1: number, y1: number,
        x2: number, y2: number,
        type: number, x3: number, y3: number,
        index_offset2: number, index_offset3: number,
        index_offset4: number = 0, index_offset5: number = 0
    ): void {

        // AとBがほぼ平行なら、結合せずに終了
        const ax: number = x2 - x1;
        const ay: number = y2 - y1;
        const bx: number = x3 - x2;
        const by: number = y3 - y2;
        const det: number = $cross(ax, ay, bx, by);
        if ($Math.abs(det) < 0.0001) {
            return ;
        }

        // 分割したベジェ曲線はベベルで結合する
        if (type === 2) {
            this._$addBevelJoinMesh(
                x2, y2,
                index_offset4, index_offset2, index_offset3, index_offset5
            );
            return;
        }

        // 結合タイプに合わせたメッシュを追加する
        switch (this._$lineJoin) {

            case "round":
                this._$addRoundJoinMesh(x2, y2);
                break;

            case "miter":
                this._$addMiterJoinMesh(
                    x2, y2, x1, y1, x3, y3,
                    index_offset4, index_offset2, index_offset3, index_offset5
                );
                break;

            default:
                this._$addBevelJoinMesh(
                    x2, y2,
                    index_offset4, index_offset2, index_offset3, index_offset5
                );
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
    static _$addRoundJoinMesh (x: number, y: number): void
    {
        const index0: number = this._$vertexBufferPos / 7;

        this._$expandIndexBufferIfNeeded(57);
        const ibd: Int16Array = this._$indexBufferData;
        let ibp: number = this._$indexBufferPos;

        for (let i: number = 1; i < 18; i++) {
            const indexN: number = index0 + i;
            ibd[ibp++] = index0;
            ibd[ibp++] = indexN;
            ibd[ibp++] = indexN + 1;
        }

        ibd[ibp++] = index0;
        ibd[ibp++] = index0 + 18;
        ibd[ibp++] = index0 + 1;

        this._$indexBufferPos = ibp;

        this._$expandVertexBufferIfNeeded(133);
        const vbd: Float32Array = this._$vertexBufferData;
        let vbp: number = this._$vertexBufferPos;

        vbd[vbp++] = x;
        vbd[vbp++] = y;
        vbd[vbp++] = 0;
        vbd[vbp++] = 0;
        vbd[vbp++] = 0;
        vbd[vbp++] = 0;
        vbd[vbp++] = 0;

        for (let i: number = 0; i < 18; i++) {
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
    static _$addMiterJoinMesh (
        x: number, y: number,
        ax: number, ay: number,
        bx: number, by: number,
        index1: number, index4: number,
        index5: number, index8: number
    ): void {

        const index0: number = this._$vertexBufferPos / 7;
        const index2: number = index0 + 1;
        const index3: number = index0 + 2;
        const index6: number = index0 + 3;
        const index7: number = index0 + 4;

        this._$expandIndexBufferIfNeeded(18);
        const ibd: Int16Array = this._$indexBufferData;
        let ibp: number = this._$indexBufferPos;

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
        const vbd: Float32Array = this._$vertexBufferData;
        let vbp: number = this._$vertexBufferPos;

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
    static _$addBevelJoinMesh (
        x: number, y: number,
        index1: number, index2: number,
        index3: number, index4: number
    ): void {

        const index0: number = this._$vertexBufferPos / 7;

        this._$expandIndexBufferIfNeeded(6);
        const ibd: Int16Array = this._$indexBufferData;
        let ibp: number = this._$indexBufferPos;

        ibd[ibp++] = index0;
        ibd[ibp++] = index1;
        ibd[ibp++] = index2;

        ibd[ibp++] = index0;
        ibd[ibp++] = index3;
        ibd[ibp++] = index4;

        this._$indexBufferPos = ibp;

        this._$expandVertexBufferIfNeeded(7);
        const vbd: Float32Array = this._$vertexBufferData;
        let vbp: number = this._$vertexBufferPos;

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
     * @param  {number} vertex_begin_offset 結合対象の頂点の範囲（開始）
     * @param  {number} vertex_end_offset   結合対象の頂点の範囲（終了）
     * @return {void}
     * @method
     * @static
     * @private
     */
    static _$generateLineCap (
        vertex_begin_offset: number,
        vertex_end_offset: number
    ): void {

        const vbd: Float32Array = this._$vertexBufferData;
        const stx1: number = vbd[vertex_begin_offset];
        const sty1: number = vbd[vertex_begin_offset + 1];
        const stx2: number = vbd[vertex_begin_offset + 2];
        const sty2: number = vbd[vertex_begin_offset + 3];
        const edx1: number = vbd[vertex_end_offset - 7];
        const edy1: number = vbd[vertex_end_offset - 6];
        const edx2: number = vbd[vertex_end_offset - 5];
        const edy2: number = vbd[vertex_end_offset - 4];

        const indexBeginOffset: number = vertex_begin_offset / 7;
        const indexEndOffset: number   = vertex_end_offset / 7;

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
    static _$addLineCapMesh (
        x1: number, y1: number,
        x2: number, y2: number,
        index1: number, index2: number
    ): void {

        // 線端タイプに合わせたメッシュを追加する
        switch (this._$lineCap) {

            case "round":
                this._$addRoundJoinMesh(x1, y1);
                break;

            case "square":
                this._$addSquareCapMesh(x1, y1, x2, y2, index1, index2);
                break;

            default:
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
    static _$addSquareCapMesh (
        x1: number, y1: number,
        x2: number, y2: number,
        index1: number, index2: number
    ): void {

        const index3: number = this._$vertexBufferPos / 7;
        const index4: number = index3 + 1;

        this._$expandIndexBufferIfNeeded(6);
        const ibd: Int16Array = this._$indexBufferData;
        let ibp: number = this._$indexBufferPos;

        ibd[ibp++] = index1;
        ibd[ibp++] = index3;
        ibd[ibp++] = index4;

        ibd[ibp++] = index4;
        ibd[ibp++] = index2;
        ibd[ibp++] = index1;

        this._$indexBufferPos = ibp;

        this._$expandVertexBufferIfNeeded(14);
        const vbd: Float32Array = this._$vertexBufferData;
        let vbp: number = this._$vertexBufferPos;

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