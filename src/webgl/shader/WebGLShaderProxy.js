/**
 * @class
 */
class WebGLShaderProxy
{
    /**
     * @param {CanvasToWebGLContext}  context
     * @param {WebGLRenderingContext} gl
     * @param {function} vertex_source
     * @param {function} fragment_source
     * @constructor
     * @public
     */
    constructor (context, gl, vertex_source, fragment_source)
    {
        this._$context        = context;
        this._$gl             = gl;
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
                this._$vertexSource(),
                this._$fragmentSource()
            );
        }
        return this._$instance;
    }
}
