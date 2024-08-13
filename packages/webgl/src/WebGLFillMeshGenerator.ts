import type { FillMeshImpl } from "./interface/IFillMesh";
import type { IndexRangeImpl } from "./interface/IIndexRange";
import { $getArray } from "./WebGLUtil";

/**
 * @class
 */
export class WebGLFillMeshGenerator
{
    private static _$vertexBufferData: Float32Array;
    private static _$indexRanges: IndexRangeImpl[];
    private static _$indexRangePool: IndexRangeImpl[] = $getArray();
    private static _$currentIndex: number;

    /**
     * @member {array}
     * @static
     */
    static get indexRangePool ()
    {
        return this._$indexRangePool;
    }

    /**
     * @param  {array} vertices
     * @return {FillMeshImpl}
     * @method
     * @static
     */
    static generate (vertices: any[]): FillMeshImpl
    {
        let vertexBufferLen: number = 0;
        for (let idx = 0; idx < vertices.length; ++idx) {
            vertexBufferLen += (vertices[idx].length / 3 - 2) * 12;
        }

        this._$vertexBufferData = new Float32Array(vertexBufferLen);
        this._$indexRanges      = $getArray();
        this._$currentIndex     = 0;

        for (let idx: number = 0; idx < vertices.length; ++idx) {

            const first: number = this._$currentIndex;
            this._$generateMesh(vertices[idx]);
            const count: number = this._$currentIndex - first;

            const indexRange: IndexRangeImpl = this._$indexRangePool.pop() || { "first": 0, "count": 0 };
            indexRange.first = first;
            indexRange.count = count;
            this._$indexRanges.push(indexRange);
        }

        return {
            "vertexBufferData": this._$vertexBufferData,
            "indexRanges"     : this._$indexRanges
        };
    }

    /**
     * @param  {array} vertex
     * @return {void}
     * @method
     * @static
     * @private
     */
    static _$generateMesh (vertex: any[]): void
    {
        const vbd: Float32Array  = this._$vertexBufferData;
        let currentIndex: number = this._$currentIndex;

        const length: number = vertex.length - 5;
        for (let v: number = 3; v < length; v += 3) {

            let i: number = currentIndex * 4;
            if (vertex[v + 2]) {

                vbd[i++] = vertex[v - 3];
                vbd[i++] = vertex[v - 2];
                vbd[i++] = 0;
                vbd[i++] = 0;

                vbd[i++] = vertex[v];
                vbd[i++] = vertex[v + 1];
                vbd[i++] = 0.5;
                vbd[i++] = 0;

                vbd[i++] = vertex[v + 3];
                vbd[i++] = vertex[v + 4];
                vbd[i++] = 1;
                vbd[i++] = 1;

            } else if (vertex[v + 5]) {

                vbd[i++] = vertex[0];
                vbd[i++] = vertex[1];
                vbd[i++] = 0.5;
                vbd[i++] = 0.5;

                vbd[i++] = vertex[v];
                vbd[i++] = vertex[v + 1];
                vbd[i++] = 0.5;
                vbd[i++] = 0.5;

                vbd[i++] = vertex[v + 6];
                vbd[i++] = vertex[v + 7];
                vbd[i++] = 0.5;
                vbd[i++] = 0.5;

            } else {

                vbd[i++] = vertex[0];
                vbd[i++] = vertex[1];
                vbd[i++] = 0.5;
                vbd[i++] = 0.5;

                vbd[i++] = vertex[v];
                vbd[i++] = vertex[v + 1];
                vbd[i++] = 0.5;
                vbd[i++] = 0.5;

                vbd[i++] = vertex[v + 3];
                vbd[i++] = vertex[v + 4];
                vbd[i++] = 0.5;
                vbd[i++] = 0.5;

            }
            currentIndex += 3;
        }

        this._$currentIndex = currentIndex;
    }
}