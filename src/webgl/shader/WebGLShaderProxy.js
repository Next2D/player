/**
 * @class
 */
class WebGLShaderProxy
{
    /**
     * @param {CanvasToWebGLContext}  context
     * @param {WebGLRenderingContext} gl
     * @param {WebGLShaderKeyword}    keyword
     * @param {function} vertex_source
     * @param {function} fragment_source
     * @constructor
     * @public
     */
    constructor (context, gl, keyword, vertex_source, fragment_source)
    {
        this._$context        = context;
        this._$gl             = gl;
        this._$keyword        = keyword;
        this._$vertexSource   = vertex_source;
        this._$fragmentSource = fragment_source;
        this._$instance       = null;
    }

    /**
     * @memberof WebGLShaderProxy#
     * @property {CanvasToWebGLShader}
     * @readonly
     * @public
     */
    get instance ()
    {
        if (!this._$instance) {
            this._$instance = new CanvasToWebGLShader(
                this._$gl, this._$context,
                this._$vertexSource(this._$keyword),
                this._$fragmentSource(this._$keyword)
            );
        }
        return this._$instance;
    }
}
