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
        // @ifdef GL_ERROR_CHECK
        if (!this._$gl.getShaderParameter(vertexShader, this._$gl.COMPILE_STATUS)) {
            const infoLog = this._$gl.getShaderInfoLog(vertexShader);
            throw new Error("vertex shader compilation failed: " + infoLog + "\n" + vertex_source);
        }
        // @endif

        const fragmentShader = this._$gl.createShader(this._$gl.FRAGMENT_SHADER);
        this._$gl.shaderSource(fragmentShader, fragment_source);
        this._$gl.compileShader(fragmentShader);
        // @ifdef GL_ERROR_CHECK
        if (!this._$gl.getShaderParameter(fragmentShader, this._$gl.COMPILE_STATUS)) {
            const infoLog = this._$gl.getShaderInfoLog(fragmentShader);
            throw new Error("fragment shader compilation failed: " + infoLog + "\n" + fragment_source);
        }
        // @endif

        if (!this._$context._$isWebGL2Context) {
            // https://www.khronos.org/registry/OpenGL-Refpages/es2.0/xhtml/glBindAttribLocation.xml
            //
            // It is also permissible to bind a generic attribute index to an attribute variable name that is never used in a vertex shader.
            // 頂点シェーダ内で使用されていない属性変数名を属性インデックスにバインドすることができる。
            //
            // If name was bound previously, that information is lost. Thus you cannot bind one user-defined attribute variable to multiple indices,
            // but you can bind multiple user-defined attribute variables to the same index.
            // 属性変数名を複数のインデックスにバインドすることはできないが、複数の属性変数名を1つのインデックスにバインドすることはできる。

            // 上に引用した仕様により、以下の属性変数名がシェーダに存在しなくても問題なく、
            // また、a_bezier と a_option1 のどちらも 1 にバインドすることも問題ない。

            this._$gl.bindAttribLocation(program, 0, "a_vertex");
            this._$gl.bindAttribLocation(program, 1, "a_bezier");
            this._$gl.bindAttribLocation(program, 1, "a_option1");
            this._$gl.bindAttribLocation(program, 2, "a_option2");
            this._$gl.bindAttribLocation(program, 3, "a_type");
        }

        this._$gl.attachShader(program, vertexShader);
        this._$gl.attachShader(program, fragmentShader);
        this._$gl.linkProgram(program);
        // @ifdef GL_ERROR_CHECK
        if (!this._$gl.getProgramParameter(program, this._$gl.LINK_STATUS)) {
            const infoLog = this._$gl.getProgramInfoLog(program);
            throw new Error("link program failed: " + infoLog + "\n" + vertex_source + "\n========\n" + fragment_source);
        }
        // @endif

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
        // @ifdef DEBUG
        if (window.glstats) {
            glstats.ondraw();
        }
        // @endif

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
        // @ifdef DEBUG
        if (window.glstats) {
            glstats.ondraw();
        }
        // @endif

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
        // @ifdef DEBUG
        if (window.glstats) {
            glstats.ondraw();
        }
        // @endif

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
        // @ifdef DEBUG
        if (window.glstats) {
            glstats.ondraw();
        }
        // @endif

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
        // @ifdef DEBUG
        if (window.glstats) {
            glstats.ondraw();
        }
        // @endif

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
        // @ifdef DEBUG
        if (window.glstats) {
            glstats.ondraw();
        }
        // @endif

        // setup
        this._$attachProgram();

        // ここでblendの設定はしない
        // this._$context.blend.reset();

        // update data
        this._$uniform.bindUniforms();

        // bind vertex array
        this._$context.vao.bind(vertex_array);

        // draw fill
        this._$gl.drawArrays(this._$gl.POINTS, first, count);
    }
}
