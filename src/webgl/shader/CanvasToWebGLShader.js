/**
 * @class
 */
class CanvasToWebGLShader
{
    /**
     * @param   {WebGLRenderingContext} gl
     * @param   {CanvasToWebGLContext}  context
     * @param   {string} vertex_source
     * @param   {string} fragment_source
     * @constructor
     * @public
     */
    constructor (gl, context, vertex_source, fragment_source)
    {
        this._$gl      = gl;
        this._$context = context;
        this._$program = this._$createProgram(vertex_source, fragment_source);
        this._$uniform = new WebGLShaderUniform(gl, this._$program);
    }

    /**
     * @return {WebGLShaderUniform}
     * @readonly
     * @public
     */
    get uniform ()
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
    _$createProgram (vertex_source, fragment_source)
    {
        const program = this._$gl.createProgram();

        // control number
        program.id = programId++;

        const vertexShader = this._$gl.createShader(this._$gl.VERTEX_SHADER);
        this._$gl.shaderSource(vertexShader, vertex_source);
        this._$gl.compileShader(vertexShader);

        const fragmentShader = this._$gl.createShader(this._$gl.FRAGMENT_SHADER);
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
     * @return void
     * @private
     */
    _$attachProgram ()
    {
        if (this._$context._$shaderList._$currentProgramId !== this._$program.id) {
            this._$context._$shaderList._$currentProgramId = this._$program.id;
            this._$gl.useProgram(this._$program);
        }
    }

    /**
     * @return void
     * @public
     */
    _$drawImage ()
    {
        this._$attachProgram();
        this._$uniform.bindUniforms();
        this._$context.vao.bindCommonVertexArray();
        this._$gl.drawArrays(this._$gl.TRIANGLE_STRIP, 0, 4);
    }

    /**
     * @param  {number} begin
     * @param  {number} end
     * @return void
     * @public
     */
    _$drawGradient (begin, end)
    {
        this._$attachProgram();
        this._$uniform.bindUniforms();
        this._$context.vao.bindGradientVertexArray(begin, end);
        this._$gl.drawArrays(this._$gl.TRIANGLE_STRIP, 0, 4);
    }

    /**
     * @param  {object} object
     * @return void
     * @public
     */
    _$stroke (object)
    {
        // setup
        this._$attachProgram();

        // set alpha
        this._$context.blend.reset();

        // update data
        this._$uniform.bindUniforms();

        // bind vertex array
        this._$context.vao.bind(object);

        // draw
        this._$gl.drawElements(this._$gl.TRIANGLES, object.indexCount, this._$gl.UNSIGNED_SHORT, 0);
    }

    /**
     * @param  {object} object
     * @return void
     * @public
     */
    _$fill (object)
    {
        // setup
        this._$attachProgram();

        // set alpha
        this._$context.blend.reset();

        // update data
        this._$uniform.bindUniforms();

        // bind vertex array
        this._$context.vao.bind(object);

        // draw fill
        const range = object.indexRanges[object.indexRanges.length - 1];
        const count = range.first + range.count;
        this._$gl.drawArrays(this._$gl.TRIANGLES, 0, count);
    }

    /**
     * @param {WebGLVertexArrayObjectOES} vertex_array
     * @param {uint} first
     * @param {uint} count
     * @public
     */
    _$containerClip (vertex_array, first, count)
    {
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
     * @param {WebGLVertexArrayObjectOES} vertex_array
     * @param {uint} first
     * @param {uint} count
     * @public
     */
    _$drawPoints (vertex_array, first, count)
    {
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
