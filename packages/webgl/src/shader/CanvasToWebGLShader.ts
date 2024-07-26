import type { CanvasToWebGLContext } from "../CanvasToWebGLContext";
import type { CanvasToWebGLShaderList } from "./CanvasToWebGLShaderList";
import type { IndexRangeImpl } from "../interface/IndexRangeImpl";
import { WebGLShaderUniform } from "./WebGLShaderUniform";
import { WebGLShaderInstance } from "./WebGLShaderInstance";
import { $getProgramId } from "../WebGLUtil";

/**
 * @class
 */
export class CanvasToWebGLShader
{
    private readonly _$gl: WebGL2RenderingContext;
    private readonly _$context: CanvasToWebGLContext;
    private readonly _$program: WebGLProgram;
    private readonly _$uniform: WebGLShaderUniform;
    private _$instance: WebGLShaderInstance | null;

    /**
     * @param {WebGL2RenderingContext} gl
     * @param {CanvasToWebGLContext} context
     * @param {string} vertex_source
     * @param {string} fragment_source
     * @constructor
     * @public
     */
    constructor (
        gl: WebGL2RenderingContext,
        context: CanvasToWebGLContext,
        vertex_source: string,
        fragment_source: string
    ) {

        /**
         * @type {WebGL2RenderingContext}
         * @private
         */
        this._$gl = gl;

        /**
         * @type {WebGL2RenderingContext}
         * @private
         */
        this._$context = context;

        /**
         * @type {WebGLProgram}
         * @private
         */
        this._$program = this._$createProgram(vertex_source, fragment_source);

        /**
         * @type {WebGLShaderUniform}
         * @private
         */
        this._$uniform = new WebGLShaderUniform(gl, this._$program);

        /**
         * @type {WebGLShaderInstance}
         * @default null
         * @private
         */
        this._$instance = null;
    }

    /**
     * @return {WebGLShaderInstance}
     * @readonly
     * @public
     */
    get instance (): WebGLShaderInstance
    {
        if (!this._$instance) {
            this._$instance = new WebGLShaderInstance();
        }
        return this._$instance;
    }

    /**
     * @return {WebGLShaderUniform}
     * @readonly
     * @public
     */
    get uniform (): WebGLShaderUniform
    {
        return this._$uniform;
    }

    /**
     * @param  {string} vertex_source
     * @param  {string} fragment_source
     * @return {WebGLProgram}
     * @method
     * @private
     */
    _$createProgram (vertex_source: string, fragment_source: string): WebGLProgram
    {
        const program: WebGLProgram = this._$gl.createProgram() as NonNullable<WebGLProgram>;

        // control number
        program.id = $getProgramId();

        const vertexShader: WebGLShader = this._$gl.createShader(this._$gl.VERTEX_SHADER) as NonNullable<WebGLShader>;
        this._$gl.shaderSource(vertexShader, vertex_source);
        this._$gl.compileShader(vertexShader);

        const fragmentShader: WebGLShader = this._$gl.createShader(this._$gl.FRAGMENT_SHADER) as NonNullable<WebGLShader>;
        this._$gl.shaderSource(fragmentShader, fragment_source);
        this._$gl.compileShader(fragmentShader);

        this._$gl.attachShader(program, vertexShader);
        this._$gl.attachShader(program, fragmentShader);
        this._$gl.linkProgram(program);

        this._$gl.detachShader(program, vertexShader);
        this._$gl.detachShader(program, fragmentShader);

        this._$gl.deleteShader(vertexShader);
        this._$gl.deleteShader(fragmentShader);

        return program;
    }

    /**
     * @return {void}
     * @private
     */
    _$attachProgram (): void
    {
        const shaderList: CanvasToWebGLShaderList = this._$context.shaderList;

        if (shaderList.currentProgramId !== this._$program.id) {
            shaderList.currentProgramId = this._$program.id;
            this._$gl.useProgram(this._$program);
        }
    }

    /**
     * @param  {WebGLShaderInstance} instance
     * @method
     * @public
     */
    drawArraysInstanced (instance: WebGLShaderInstance): void
    {
        // setup
        this._$attachProgram();

        // bind data
        this._$context.vao.bindInstnceArray(instance);

        // draw
        this._$gl.drawArraysInstanced(this._$gl.TRIANGLE_STRIP, 0, 4, instance.count);
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    _$drawImage (): void
    {
        this._$attachProgram();
        this._$uniform.bindUniforms();
        this._$context.vao.bindCommonVertexArray();
        this._$gl.drawArrays(this._$gl.TRIANGLE_STRIP, 0, 4);
    }

    /**
     * @param  {number} begin
     * @param  {number} end
     * @return {void}
     * @method
     * @public
     */
    _$drawGradient (begin: number, end: number): void
    {
        this._$attachProgram();
        this._$uniform.bindUniforms();
        this._$context.vao.bindGradientVertexArray(begin, end);
        this._$gl.drawArrays(this._$gl.TRIANGLE_STRIP, 0, 4);
    }

    /**
     * @param  {WebGLVertexArrayObject} vertex_array_object
     * @return {void}
     * @method
     * @public
     */
    _$stroke (vertex_array_object: WebGLVertexArrayObject): void
    {
        // setup
        this._$attachProgram();

        // set alpha
        this._$context.blend.reset();

        // update data
        this._$uniform.bindUniforms();

        // bind vertex array
        this._$context.vao.bind(vertex_array_object);

        // draw
        this._$gl.drawElements(
            this._$gl.TRIANGLES,
            vertex_array_object.indexCount,
            this._$gl.UNSIGNED_SHORT, 0
        );
    }

    /**
     * @param  {WebGLVertexArrayObject} vertex_array_object
     * @return {void}
     * @method
     * @public
     */
    _$fill (vertex_array_object: WebGLVertexArrayObject): void
    {
        // setup
        this._$attachProgram();

        // set alpha
        this._$context.blend.reset();

        // update data
        this._$uniform.bindUniforms();

        // bind vertex array
        this._$context.vao.bind(vertex_array_object);

        // draw fill
        const indexRanges: IndexRangeImpl[] = vertex_array_object.indexRanges;
        const range: IndexRangeImpl = indexRanges[indexRanges.length - 1];
        this._$gl.drawArrays(this._$gl.TRIANGLES, 0, range.first + range.count);
    }

    /**
     * @param  {WebGLVertexArrayObject} vertex_array
     * @param  {number} first
     * @param  {number} count
     * @return {void}
     * @method
     * @public
     */
    _$containerClip (
        vertex_array: WebGLVertexArrayObject, first: number, count: number
    ): void {

        // setup
        this._$attachProgram();

        // set alpha
        this._$context.blend.reset();

        // update data
        this._$uniform.bindUniforms();

        // bind vertex array
        this._$context.vao.bind(vertex_array);

        // draw fill
        this._$gl.drawArrays(this._$gl.TRIANGLES, first, count);
    }

    /**
     * @param  {WebGLVertexArrayObject} vertex_array
     * @param  {number} first
     * @param  {number} count
     * @return {void}
     * @method
     * @public
     */
    _$drawPoints (
        vertex_array: WebGLVertexArrayObject,
        first: number, count: number
    ): void {

        // setup
        this._$attachProgram();

        // update data
        this._$uniform.bindUniforms();

        // bind vertex array
        this._$context.vao.bind(vertex_array);

        // draw fill
        this._$gl.drawArrays(this._$gl.POINTS, first, count);
    }
}
