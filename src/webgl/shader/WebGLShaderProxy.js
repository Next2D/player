/**
 * @class
 */
class WebGLShaderProxy
{
    /**
     * @param {CanvasToWebGLContext}  context
     * @param {WebGLRenderingContext} gl
     * @param {WebGLShaderKeyword}    keyword
     * @param {function} vertexSource
     * @param {function} fragmentSource
     * @constructor
     * @public
     */
    constructor (context, gl, keyword, vertexSource, fragmentSource)
    {
        this._$context        = context;
        this._$gl             = gl;
        this._$keyword        = keyword;
        this._$vertexSource   = vertexSource;
        this._$fragmentSource = fragmentSource;
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
