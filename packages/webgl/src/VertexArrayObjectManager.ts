import { WebGLFillMeshGenerator } from "./WebGLFillMeshGenerator";
import { WebGLStrokeMeshGenerator } from "./WebGLStrokeMeshGenerator";
import type { FillMeshImpl } from "./interface/FillMeshImpl";
import type { StrokeMethImpl } from "./interface/StrokeMethImpl";
import type { CapsStyleImpl } from "./interface/CapsStyleImpl";
import type { JointStyleImpl } from "./interface/JointStyleImpl";
import type { WebGLShaderInstance } from "./shader/WebGLShaderInstance";
import {
    $upperPowerOfTwo
} from "@next2d/share";

/**
 * @class
 */
export class VertexArrayObjectManager
{
    private _$gl: WebGL2RenderingContext;
    private readonly _$fillVertexArrayPool: WebGLVertexArrayObject[];
    private readonly _$strokeVertexArrayPool: WebGLVertexArrayObject[];
    private _$boundVertexArray: WebGLVertexArrayObject | null;
    private readonly _$fillAttrib_vertex: number;
    private readonly _$fillAttrib_bezier: number;
    private readonly _$strokeAttrib_vertex: number;
    private readonly _$strokeAttrib_option1: number;
    private readonly _$strokeAttrib_option2: number;
    private readonly _$strokeAttrib_type: number;
    private readonly _$vertexBufferData: Float32Array;
    private readonly _$commonVertexArray: WebGLVertexArrayObject;
    private readonly _$instanceVertexArray: WebGLVertexArrayObject;
    private readonly _$rectVertexBuffer: WebGLBuffer;
    private readonly _$sizeVertexBuffer: WebGLBuffer;
    private readonly _$offsetVertexBuffer: WebGLBuffer;
    private readonly _$matrixVertexBuffer: WebGLBuffer;
    private readonly _$mulColorVertexBuffer: WebGLBuffer;
    private readonly _$addColorVertexBuffer: WebGLBuffer;
    private _$rectBuffer: Float32Array;
    private _$sizeBuffer: Float32Array;
    private _$offsetBuffer: Float32Array;
    private _$matrixBuffer: Float32Array;
    private _$mulColorBuffer: Float32Array;
    private _$addColorBuffer: Float32Array;

    /**
     * @param {WebGL2RenderingContext} gl
     * @constructor
     * @public
     */
    constructor (gl: WebGL2RenderingContext)
    {
        /**
         * @type {WebGL2RenderingContext}
         * @private
         */
        this._$gl = gl;

        /**
         * @type {array}
         * @private
         */
        this._$fillVertexArrayPool = [];

        /**
         * @type {array}
         * @private
         */
        this._$strokeVertexArrayPool = [];

        /**
         * @type {WebGLVertexArrayObject}
         * @default null
         * @private
         */
        this._$boundVertexArray = null;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$fillAttrib_vertex = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$fillAttrib_bezier = 1;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$strokeAttrib_vertex = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$strokeAttrib_option1 = 1;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$strokeAttrib_option2 = 2;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$strokeAttrib_type = 3;

        /**
         * @type {Float32Array}
         * @default 0
         * @private
         */
        this._$vertexBufferData = new Float32Array([0, 0, 0, 1, 1, 0, 1, 1]);

        /**
         * @type {WebGLBuffer}
         * @private
         */
        this._$rectVertexBuffer = gl.createBuffer() as NonNullable<WebGLBuffer>;

        /**
         * @type {Float32Array}
         * @private
         */
        this._$rectBuffer = new Float32Array(40);

        /**
         * @type {WebGLBuffer}
         * @private
         */
        this._$sizeVertexBuffer = gl.createBuffer() as NonNullable<WebGLBuffer>;

        /**
         * @type {Float32Array}
         * @private
         */
        this._$sizeBuffer = new Float32Array(40);

        /**
         * @type {WebGLBuffer}
         * @private
         */
        this._$offsetVertexBuffer = gl.createBuffer() as NonNullable<WebGLBuffer>;

        /**
         * @type {Float32Array}
         * @private
         */
        this._$offsetBuffer = new Float32Array(20);

        /**
         * @type {WebGLBuffer}
         * @private
         */
        this._$matrixVertexBuffer = gl.createBuffer() as NonNullable<WebGLBuffer>;

        /**
         * @type {Float32Array}
         * @private
         */
        this._$matrixBuffer = new Float32Array(40);

        /**
         * @type {WebGLBuffer}
         * @private
         */
        this._$mulColorVertexBuffer = gl.createBuffer() as NonNullable<WebGLBuffer>;

        /**
         * @type {Float32Array}
         * @private
         */
        this._$mulColorBuffer = new Float32Array(4);

        /**
         * @type {WebGLBuffer}
         * @private
         */
        this._$addColorVertexBuffer = gl.createBuffer() as NonNullable<WebGLBuffer>;

        /**
         * @type {Float32Array}
         * @private
         */
        this._$addColorBuffer = new Float32Array(4);

        /**
         * @type {WebGLVertexArrayObject}
         * @private
         */
        this._$instanceVertexArray = this._$getCommonVertexArray();

        /**
         * @type {WebGLVertexArrayObject}
         * @private
         */
        this._$commonVertexArray = this._$getVertexArray(0, 1);
    }

    /**
     * @param  {number} begin
     * @param  {number} end
     * @return {WebGLVertexArrayObject}
     * @method
     * @private
     */
    _$getCommonVertexArray (): WebGLVertexArrayObject
    {
        const vertexArray: WebGLVertexArrayObject = this._$gl.createVertexArray() as NonNullable<WebGLVertexArrayObject>;
        this.bind(vertexArray);

        const vertexBuffer: WebGLBuffer = this._$gl.createBuffer() as NonNullable<WebGLBuffer>;
        this._$gl.bindBuffer(this._$gl.ARRAY_BUFFER, vertexBuffer);
        this._$gl.bufferData(this._$gl.ARRAY_BUFFER, new Float32Array([0, 0, 0, 1, 1, 0, 1, 1]), this._$gl.STATIC_DRAW);
        this._$gl.enableVertexAttribArray(0);
        this._$gl.vertexAttribPointer(0, 2, this._$gl.FLOAT, false, 0, 0);

        this._$gl.bindBuffer(this._$gl.ARRAY_BUFFER, this._$rectVertexBuffer);
        this._$gl.bufferData(this._$gl.ARRAY_BUFFER, this._$rectBuffer.byteLength, this._$gl.DYNAMIC_DRAW);
        this._$gl.enableVertexAttribArray(1);
        this._$gl.vertexAttribPointer(1, 4, this._$gl.FLOAT, false, 0, 0);
        this._$gl.vertexAttribDivisor(1, 1);

        this._$gl.bindBuffer(this._$gl.ARRAY_BUFFER, this._$sizeVertexBuffer);
        this._$gl.bufferData(this._$gl.ARRAY_BUFFER, this._$sizeBuffer.byteLength, this._$gl.DYNAMIC_DRAW);
        this._$gl.enableVertexAttribArray(2);
        this._$gl.vertexAttribPointer(2, 4, this._$gl.FLOAT, false, 0, 0);
        this._$gl.vertexAttribDivisor(2, 1);

        this._$gl.bindBuffer(this._$gl.ARRAY_BUFFER, this._$offsetVertexBuffer);
        this._$gl.bufferData(this._$gl.ARRAY_BUFFER, this._$offsetBuffer.byteLength, this._$gl.DYNAMIC_DRAW);
        this._$gl.enableVertexAttribArray(3);
        this._$gl.vertexAttribPointer(3, 2, this._$gl.FLOAT, false, 0, 0);
        this._$gl.vertexAttribDivisor(3, 1);

        this._$gl.bindBuffer(this._$gl.ARRAY_BUFFER, this._$matrixVertexBuffer);
        this._$gl.bufferData(this._$gl.ARRAY_BUFFER, this._$matrixBuffer.byteLength, this._$gl.DYNAMIC_DRAW);
        this._$gl.enableVertexAttribArray(4);
        this._$gl.vertexAttribPointer(4, 4, this._$gl.FLOAT, false, 0, 0);
        this._$gl.vertexAttribDivisor(4, 1);

        this._$gl.bindBuffer(this._$gl.ARRAY_BUFFER, this._$mulColorVertexBuffer);
        this._$gl.bufferData(this._$gl.ARRAY_BUFFER, this._$mulColorBuffer.byteLength, this._$gl.DYNAMIC_DRAW);
        this._$gl.enableVertexAttribArray(5);
        this._$gl.vertexAttribPointer(5, 4, this._$gl.FLOAT, false, 0, 0);
        this._$gl.vertexAttribDivisor(5, 1);

        this._$gl.bindBuffer(this._$gl.ARRAY_BUFFER, this._$addColorVertexBuffer);
        this._$gl.bufferData(this._$gl.ARRAY_BUFFER, this._$addColorBuffer.byteLength, this._$gl.DYNAMIC_DRAW);
        this._$gl.enableVertexAttribArray(6);
        this._$gl.vertexAttribPointer(6, 4, this._$gl.FLOAT, false, 0, 0);
        this._$gl.vertexAttribDivisor(6, 1);

        return vertexArray;
    }

    /**
     * @param  {number} begin
     * @param  {number} end
     * @return {WebGLVertexArrayObject}
     * @method
     * @private
     */
    _$getVertexArray (begin: number, end: number): WebGLVertexArrayObject
    {
        const vertexArray: WebGLVertexArrayObject = this._$gl.createVertexArray() as NonNullable<WebGLVertexArrayObject>;
        this.bind(vertexArray);

        const vertexBuffer: WebGLBuffer = this._$gl.createBuffer() as NonNullable<WebGLBuffer>;
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
    _$getFillVertexArray (): WebGLVertexArrayObject
    {
        if (this._$fillVertexArrayPool.length) {
            const vertexArray: WebGLVertexArrayObject | void = this._$fillVertexArrayPool.pop();
            if (vertexArray) {
                return vertexArray;
            }
        }

        const vertexArray: WebGLVertexArrayObject = this._$gl.createVertexArray() as NonNullable<WebGLVertexArrayObject>;
        this.bind(vertexArray);

        const vertexBuffer: WebGLBuffer = this._$gl.createBuffer() as NonNullable<WebGLBuffer>;
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
    _$getStrokeVertexArray (): WebGLVertexArrayObject
    {
        if (this._$strokeVertexArrayPool.length) {
            const vertexArray: WebGLVertexArrayObject | void = this._$strokeVertexArrayPool.pop();
            if (vertexArray) {
                return vertexArray;
            }
        }

        const vertexArray: WebGLVertexArrayObject = this._$gl.createVertexArray() as NonNullable<WebGLVertexArrayObject>;
        this.bind(vertexArray);

        const vertexBuffer: WebGLBuffer = this._$gl.createBuffer() as NonNullable<WebGLBuffer>;
        vertexArray.vertexBuffer = vertexBuffer;
        vertexArray.vertexLength = 0;
        this._$gl.bindBuffer(this._$gl.ARRAY_BUFFER, vertexBuffer);

        const indexBuffer: WebGLBuffer = this._$gl.createBuffer() as NonNullable<WebGLBuffer>;

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
     * @param  {array} vertices
     * @return {WebGLVertexArrayObject}
     * @method
     * @public
     */
    createFill (vertices: any[]): WebGLVertexArrayObject
    {
        const mesh: FillMeshImpl = WebGLFillMeshGenerator.generate(vertices);
        const vertexBufferData: Float32Array = mesh.vertexBufferData;

        const vertexArray: WebGLVertexArrayObject = this._$getFillVertexArray();
        vertexArray.indexRanges = mesh.indexRanges;
        this.bind(vertexArray);

        this._$gl.bindBuffer(this._$gl.ARRAY_BUFFER, vertexArray.vertexBuffer);

        if (vertexArray.vertexLength < vertexBufferData.length) {
            vertexArray.vertexLength = $upperPowerOfTwo(vertexBufferData.length);
            this._$gl.bufferData(this._$gl.ARRAY_BUFFER, vertexArray.vertexLength * 4, this._$gl.DYNAMIC_DRAW);
        }

        this._$gl.bufferSubData(this._$gl.ARRAY_BUFFER, 0, vertexBufferData);

        return vertexArray;
    }

    /**
     * @param  {array} vertices
     * @param  {string} lineCap
     * @param  {string} lineJoin
     * @return {WebGLVertexArrayObject}
     * @method
     * @public
     */
    createStroke (
        vertices: any[],
        lineCap: CapsStyleImpl,
        lineJoin: JointStyleImpl
    ): WebGLVertexArrayObject {

        const mesh: StrokeMethImpl = WebGLStrokeMeshGenerator.generate(vertices, lineCap, lineJoin);
        const vertexBufferData: Float32Array = mesh.vertexBufferData;
        const indexBufferData: Int16Array    = mesh.indexBufferData;

        const vertexArray: WebGLVertexArrayObject = this._$getStrokeVertexArray();
        vertexArray.indexCount = indexBufferData.length;
        this.bind(vertexArray);

        this._$gl.bindBuffer(this._$gl.ARRAY_BUFFER, vertexArray.vertexBuffer);
        this._$gl.bindBuffer(this._$gl.ELEMENT_ARRAY_BUFFER, vertexArray.indexBuffer);

        if (vertexArray.vertexLength < vertexBufferData.length) {
            vertexArray.vertexLength = $upperPowerOfTwo(vertexBufferData.length);
            this._$gl.bufferData(this._$gl.ARRAY_BUFFER, vertexArray.vertexLength * 4, this._$gl.DYNAMIC_DRAW);
        }

        if (vertexArray.indexLength < indexBufferData.length) {
            vertexArray.indexLength = $upperPowerOfTwo(indexBufferData.length);
            this._$gl.bufferData(this._$gl.ELEMENT_ARRAY_BUFFER, vertexArray.indexLength * 2, this._$gl.DYNAMIC_DRAW);
        }

        this._$gl.bufferSubData(this._$gl.ARRAY_BUFFER, 0, vertexBufferData);
        this._$gl.bufferSubData(this._$gl.ELEMENT_ARRAY_BUFFER, 0, indexBufferData);

        return vertexArray;
    }

    /**
     * @param  {WebGLVertexArrayObject} vertex_array
     * @return {void}
     * @method
     * @public
     */
    releaseFill (vertex_array: WebGLVertexArrayObject): void
    {
        this._$fillVertexArrayPool.push(vertex_array);
    }

    /**
     * @param  {WebGLVertexArrayObject} vertex_array
     * @return {void}
     * @method
     * @public
     */
    releaseStroke (vertex_array: WebGLVertexArrayObject): void
    {
        this._$strokeVertexArrayPool.push(vertex_array);
    }

    /**
     * @param  {WebGLVertexArrayObject} [vertex_array = null]
     * @return {void}
     * @method
     * @public
     */
    bind (vertex_array: WebGLVertexArrayObject | null = null): void
    {
        if (vertex_array === this._$boundVertexArray) {
            return ;
        }

        this._$boundVertexArray = vertex_array;

        this._$gl.bindVertexArray(vertex_array);
    }

    /**
     * @param  {WebGLShaderInstance} instance
     * @return {void}
     * @method
     * @public
     */
    bindInstnceArray (instance: WebGLShaderInstance): void
    {
        // bind vao
        this.bind(this._$instanceVertexArray);

        // texture rect
        this._$gl.bindBuffer(this._$gl.ARRAY_BUFFER, this._$rectVertexBuffer);
        if (instance.rect.length > this._$rectBuffer.length) {
            this._$rectBuffer = new Float32Array(instance.rect.length);
            this._$gl.bufferData(
                this._$gl.ARRAY_BUFFER,
                this._$rectBuffer.byteLength,
                this._$gl.DYNAMIC_DRAW
            );
        }
        this._$rectBuffer.set(instance.rect);
        this._$gl.bufferSubData(this._$gl.ARRAY_BUFFER, 0, this._$rectBuffer);

        // texture and viewport width and height
        this._$gl.bindBuffer(this._$gl.ARRAY_BUFFER, this._$sizeVertexBuffer);
        if (instance.size.length > this._$sizeBuffer.length) {
            this._$sizeBuffer = new Float32Array(instance.size.length);
            this._$gl.bufferData(
                this._$gl.ARRAY_BUFFER,
                this._$sizeBuffer.byteLength,
                this._$gl.DYNAMIC_DRAW
            );
        }
        this._$sizeBuffer.set(instance.size);
        this._$gl.bufferSubData(this._$gl.ARRAY_BUFFER, 0, this._$sizeBuffer);

        // matrix x,y offset
        this._$gl.bindBuffer(this._$gl.ARRAY_BUFFER, this._$offsetVertexBuffer);
        if (instance.offset.length > this._$offsetBuffer.length) {
            this._$offsetBuffer = new Float32Array(instance.offset.length);
            this._$gl.bufferData(
                this._$gl.ARRAY_BUFFER,
                this._$offsetBuffer.byteLength,
                this._$gl.DYNAMIC_DRAW
            );
        }
        this._$offsetBuffer.set(instance.offset);
        this._$gl.bufferSubData(this._$gl.ARRAY_BUFFER, 0, this._$offsetBuffer);

        // matrix scale0, rotate0, scale1 rotate1
        this._$gl.bindBuffer(this._$gl.ARRAY_BUFFER, this._$matrixVertexBuffer);
        if (instance.matrix.length > this._$matrixBuffer.length) {
            this._$matrixBuffer = new Float32Array(instance.matrix.length);
            this._$gl.bufferData(
                this._$gl.ARRAY_BUFFER,
                this._$matrixBuffer.byteLength,
                this._$gl.DYNAMIC_DRAW
            );
        }
        this._$matrixBuffer.set(instance.matrix);
        this._$gl.bufferSubData(this._$gl.ARRAY_BUFFER, 0, this._$matrixBuffer);

        // color transform
        if (instance.addColor.length) {

            this._$gl.bindBuffer(this._$gl.ARRAY_BUFFER, this._$mulColorVertexBuffer);
            if (instance.mulColor.length > this._$mulColorBuffer.length) {
                this._$mulColorBuffer = new Float32Array(instance.mulColor.length);
                this._$gl.bufferData(
                    this._$gl.ARRAY_BUFFER,
                    this._$mulColorBuffer.byteLength,
                    this._$gl.DYNAMIC_DRAW
                );
            }
            this._$mulColorBuffer.set(instance.mulColor);
            this._$gl.bufferSubData(this._$gl.ARRAY_BUFFER, 0, this._$mulColorBuffer);

            this._$gl.bindBuffer(this._$gl.ARRAY_BUFFER, this._$addColorVertexBuffer);
            if (instance.addColor.length > this._$addColorBuffer.length) {
                this._$addColorBuffer = new Float32Array(instance.addColor.length);
                this._$gl.bufferData(
                    this._$gl.ARRAY_BUFFER,
                    this._$addColorBuffer.byteLength,
                    this._$gl.DYNAMIC_DRAW
                );
            }
            this._$addColorBuffer.set(instance.addColor);
            this._$gl.bufferSubData(this._$gl.ARRAY_BUFFER, 0, this._$addColorBuffer);
        }
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    bindCommonVertexArray (): void
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
    bindGradientVertexArray (begin: number, end: number): void
    {
        const vertexArray: WebGLVertexArrayObject = this._$getVertexArray(begin, end);
        this.bind(vertexArray);
    }
}