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
    private _$colorTramsform: boolean;

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
         * @type {WebGLVertexArrayObject}
         * @private
         */
        this._$instanceVertexArray = this._$getCommonVertexArray();

        /**
         * @type {WebGLVertexArrayObject}
         * @private
         */
        this._$commonVertexArray = this._$getVertexArray(0, 1);

        /**
         * @type {boolean}
         * @private
         */
        this._$colorTramsform = false;
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

        this._$gl.enableVertexAttribArray(1);
        this._$gl.enableVertexAttribArray(2);
        this._$gl.enableVertexAttribArray(3);
        this._$gl.enableVertexAttribArray(4);

        this._$gl.vertexAttribDivisor(1, 1);
        this._$gl.vertexAttribDivisor(2, 1);
        this._$gl.vertexAttribDivisor(3, 1);
        this._$gl.vertexAttribDivisor(4, 1);

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
        this._$gl.bindBuffer(this._$gl.ARRAY_BUFFER, this._$gl.createBuffer());
        this._$gl.bufferData(
            this._$gl.ARRAY_BUFFER,
            new Float32Array(instance.rect),
            this._$gl.DYNAMIC_DRAW
        );
        this._$gl.vertexAttribPointer(1, 4, this._$gl.FLOAT, false, 0, 0);

        // texture and viewport width and height
        this._$gl.bindBuffer(this._$gl.ARRAY_BUFFER, this._$gl.createBuffer());
        this._$gl.bufferData(
            this._$gl.ARRAY_BUFFER,
            new Float32Array(instance.size),
            this._$gl.DYNAMIC_DRAW
        );
        this._$gl.vertexAttribPointer(2, 4, this._$gl.FLOAT, false, 0, 0);

        // matrix x,y offset
        this._$gl.bindBuffer(this._$gl.ARRAY_BUFFER, this._$gl.createBuffer());
        this._$gl.bufferData(
            this._$gl.ARRAY_BUFFER,
            new Float32Array(instance.offset),
            this._$gl.DYNAMIC_DRAW
        );
        this._$gl.vertexAttribPointer(3, 2, this._$gl.FLOAT, false, 0, 0);

        // matrix scale0, rotate0, scale1 rotate1
        this._$gl.bindBuffer(this._$gl.ARRAY_BUFFER, this._$gl.createBuffer());
        this._$gl.bufferData(
            this._$gl.ARRAY_BUFFER,
            new Float32Array(instance.matrix),
            this._$gl.DYNAMIC_DRAW
        );
        this._$gl.vertexAttribPointer(4, 4, this._$gl.FLOAT, false, 0, 0);

        // color transform
        if (instance.addColor.length) {

            this._$gl.bindBuffer(this._$gl.ARRAY_BUFFER, this._$gl.createBuffer());
            this._$gl.bufferData(
                this._$gl.ARRAY_BUFFER,
                new Float32Array(instance.mulColor),
                this._$gl.DYNAMIC_DRAW
            );

            if (!this._$colorTramsform) {
                this._$gl.enableVertexAttribArray(5);
                this._$gl.vertexAttribDivisor(5, 1);
            }

            this._$gl.vertexAttribPointer(5, 4, this._$gl.FLOAT, false, 0, 0);

            this._$gl.bindBuffer(this._$gl.ARRAY_BUFFER, this._$gl.createBuffer());
            this._$gl.bufferData(
                this._$gl.ARRAY_BUFFER,
                new Float32Array(instance.addColor),
                this._$gl.DYNAMIC_DRAW
            );

            if (!this._$colorTramsform) {
                this._$gl.enableVertexAttribArray(6);
                this._$gl.vertexAttribDivisor(6, 1);
            }

            this._$gl.vertexAttribPointer(6, 4, this._$gl.FLOAT, false, 0, 0);

            this._$colorTramsform = true;

        } else {

            if (this._$colorTramsform) {
                this._$gl.disableVertexAttribArray(5);
                this._$gl.disableVertexAttribArray(6);
                this._$colorTramsform = false;
            }

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