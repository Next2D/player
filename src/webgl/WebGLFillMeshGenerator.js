/**
 * @class
 */
class WebGLFillMeshGenerator
{
    /**
     * @param  {array}  vertices
     * @return {object}
     * @method
     * @static
     */
    static generate (vertices)
    {
        let vertexBufferLen = 0;
        for (let i = 0; i < vertices.length; i++) {
            vertexBufferLen += (vertices[i].length / 3 - 2) * 12;
        }

        this._$vertexBufferData = new $Float32Array(vertexBufferLen);
        this._$indexRanges      = Util.$getArray();
        this._$currentIndex     = 0;

        for (let i = 0; i < vertices.length; i++) {

            const first = this._$currentIndex;
            this._$generateMesh(vertices[i]);
            const count = this._$currentIndex - first;

            this._$indexRanges.push({ "first": first, "count": count });
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
    static _$generateMesh (vertex)
    {
        const vbd = this._$vertexBufferData;
        let currentIndex = this._$currentIndex;

        const length = vertex.length - 5;
        for (let v = 3; v < length; v += 3) {
            let i = currentIndex * 4;
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