/**
 * @class
 */
class VertexArrayObjectManager
{
    /**
     * @param {WebGLRenderingContext} gl
     * @constructor
     * @public
     */
    constructor (gl)
    {
        this._$gl                    = gl;
        this._$fillVertexArrayPool   = [];
        this._$strokeVertexArrayPool = [];
        this._$boundVertexArray      = null;
        this._$fillAttrib_vertex     = 0;
        this._$fillAttrib_bezier     = 1;
        this._$strokeAttrib_vertex   = 0;
        this._$strokeAttrib_option1  = 1;
        this._$strokeAttrib_option2  = 2;
        this._$strokeAttrib_type     = 3;
        this._$vertexBufferData      = new $Float32Array([0, 0, 0, 1, 1, 0, 1, 1]);

        this._$commonVertexArray = this._$getVertexArray(0, 1);
    }

    /**
     * @param  {number} begin
     * @param  {number} end
     * @return {WebGLVertexArrayObject}
     * @method
     * @private
     */
    _$getVertexArray (begin, end)
    {
        const vertexArray = this._$gl.createVertexArray();
        this.bind(vertexArray);

        const vertexBuffer = this._$gl.createBuffer();
        this._$gl.bindBuffer(this._$gl.ARRAY_BUFFER, vertexBuffer);

        this._$vertexBufferData[0] = begin;
        this._$vertexBufferData[2] = begin;
        this._$vertexBufferData[4] = end;
        this._$vertexBufferData[6] = end;
        this._$gl.bufferData(this._$gl.ARRAY_BUFFER, this._$vertexBufferData, this._$gl.STATIC_DRAW);

        this._$gl.enableVertexAttribArray(0);
        this._$gl.vertexAttribPointer(0, 2, this._$gl.FLOAT, false, 0, 0);

        return vertexArray;
    }

    /**
     * @return {WebGLVertexArrayObject}
     * @method
     * @private
     */
    _$getFillVertexArray ()
    {
        if (this._$fillVertexArrayPool.length) {
            return this._$fillVertexArrayPool.pop();
        }

        const vertexArray = this._$gl.createVertexArray();
        this.bind(vertexArray);

        const vertexBuffer = this._$gl.createBuffer();
        vertexArray.vertexBuffer = vertexBuffer;
        vertexArray.vertexLength = 0;
        this._$gl.bindBuffer(this._$gl.ARRAY_BUFFER, vertexBuffer);

        this._$gl.enableVertexAttribArray(0);
        this._$gl.enableVertexAttribArray(1);
        this._$gl.vertexAttribPointer(this._$fillAttrib_vertex, 2, this._$gl.FLOAT, false, 16, 0);
        this._$gl.vertexAttribPointer(this._$fillAttrib_bezier, 2, this._$gl.FLOAT, false, 16, 8);

        return vertexArray;
    }

    /**
     * @return {WebGLVertexArrayObject}
     * @method
     * @private
     */
    _$getStrokeVertexArray ()
    {
        if (this._$strokeVertexArrayPool.length) {
            return this._$strokeVertexArrayPool.pop();
        }

        const vertexArray = this._$gl.createVertexArray();
        this.bind(vertexArray);

        const vertexBuffer = this._$gl.createBuffer();
        vertexArray.vertexBuffer = vertexBuffer;
        vertexArray.vertexLength = 0;
        this._$gl.bindBuffer(this._$gl.ARRAY_BUFFER, vertexBuffer);

        const indexBuffer = this._$gl.createBuffer();
        vertexArray.indexBuffer = indexBuffer;
        vertexArray.indexLength  = 0;
        this._$gl.bindBuffer(this._$gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

        this._$gl.enableVertexAttribArray(0);
        this._$gl.enableVertexAttribArray(1);
        this._$gl.enableVertexAttribArray(2);
        this._$gl.enableVertexAttribArray(3);
        this._$gl.vertexAttribPointer(this._$strokeAttrib_vertex,  2, this._$gl.FLOAT, false, 28, 0);
        this._$gl.vertexAttribPointer(this._$strokeAttrib_option1, 2, this._$gl.FLOAT, false, 28, 8);
        this._$gl.vertexAttribPointer(this._$strokeAttrib_option2, 2, this._$gl.FLOAT, false, 28, 16);
        this._$gl.vertexAttribPointer(this._$strokeAttrib_type,    1, this._$gl.FLOAT, false, 28, 24);

        return vertexArray;
    }

    /**
     * @param vertices
     * @return {WebGLVertexArrayObject}
     * @method
     * @public
     */
    createFill (vertices)
    {
        const mesh = WebGLFillMeshGenerator.generate(vertices);
        const vertexBufferData = mesh.vertexBufferData;

        const vertexArray = this._$getFillVertexArray();
        vertexArray.indexRanges = mesh.indexRanges;
        this.bind(vertexArray);

        this._$gl.bindBuffer(this._$gl.ARRAY_BUFFER, vertexArray.vertexBuffer);

        if (vertexArray.vertexLength < vertexBufferData.length) {
            vertexArray.vertexLength = Util.$upperPowerOfTwo(vertexBufferData.length);
            this._$gl.bufferData(this._$gl.ARRAY_BUFFER, vertexArray.vertexLength * 4, this._$gl.DYNAMIC_DRAW);
        }

        this._$gl.bufferSubData(this._$gl.ARRAY_BUFFER, 0, vertexBufferData);

        return vertexArray;
    }

    /**
     * @param vertices
     * @param lineCap
     * @param lineJoin
     * @return {WebGLVertexArrayObject}
     * @method
     * @public
     */
    createStroke (vertices, lineCap, lineJoin)
    {
        const mesh = WebGLStrokeMeshGenerator.generate(vertices, lineCap, lineJoin);
        const vertexBufferData = mesh.vertexBufferData;
        const indexBufferData  = mesh.indexBufferData;

        const vertexArray = this._$getStrokeVertexArray();
        vertexArray.indexCount = indexBufferData.length;
        this.bind(vertexArray);

        this._$gl.bindBuffer(this._$gl.ARRAY_BUFFER, vertexArray.vertexBuffer);
        this._$gl.bindBuffer(this._$gl.ELEMENT_ARRAY_BUFFER, vertexArray.indexBuffer);

        if (vertexArray.vertexLength < vertexBufferData.length) {
            vertexArray.vertexLength = Util.$upperPowerOfTwo(vertexBufferData.length);
            this._$gl.bufferData(this._$gl.ARRAY_BUFFER, vertexArray.vertexLength * 4, this._$gl.DYNAMIC_DRAW);
        }

        if (vertexArray.indexLength < indexBufferData.length) {
            vertexArray.indexLength = Util.$upperPowerOfTwo(indexBufferData.length);
            this._$gl.bufferData(this._$gl.ELEMENT_ARRAY_BUFFER, vertexArray.indexLength * 2, this._$gl.DYNAMIC_DRAW);
        }

        this._$gl.bufferSubData(this._$gl.ARRAY_BUFFER, 0, vertexBufferData);
        this._$gl.bufferSubData(this._$gl.ELEMENT_ARRAY_BUFFER, 0, indexBufferData);

        return vertexArray;
    }

    /**
     * @param  {WebGLVertexArrayObject} vertexArray
     * @return {void}
     * @method
     * @public
     */
    release (vertexArray)
    {
        if (!vertexArray.indexBuffer) {
            this._$fillVertexArrayPool.push(vertexArray);
        } else {
            this._$strokeVertexArrayPool.push(vertexArray);
        }
    }

    /**
     * @param  {WebGLVertexArrayObject} vertexArray
     * @return {void}
     * @method
     * @public
     */
    bind (vertexArray)
    {
        if (!vertexArray) {
            this._$boundVertexArray = null;
        } else if (vertexArray === this._$boundVertexArray) {
            return;
        } else {
            this._$boundVertexArray = vertexArray;
        }

        this._$gl.bindVertexArray(vertexArray);
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    bindCommonVertexArray ()
    {
        this.bind(this._$commonVertexArray);
    }

    /**
     * @param  {number} begin
     * @param  {number} end
     * @return {void}
     * @method
     * @public
     */
    bindGradientVertexArray (begin, end)
    {
        const vertexArray = this._$getVertexArray(begin, end);
        this.bind(vertexArray);
    }
}