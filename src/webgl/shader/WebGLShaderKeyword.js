/**
 * @class
 */
class WebGLShaderKeyword
{
    /**
     * @param {WebGLRenderingContext} gl
     * @param {boolean} isWebGL2Context
     * @constructor
     * @public
     */
    constructor (gl, isWebGL2Context)
    {
        this._$isWebGL2Context = isWebGL2Context;

        if (!isWebGL2Context) {
            gl.getExtension("OES_standard_derivatives");
        }
    }

    /**
     * @return {string}
     * @method
     * @public
     */
    version ()
    {
        return (this._$isWebGL2Context)
            ? "#version 300 es"
            : "";
    }

    /**
     * @param  {number} index
     * @return {string}
     * @method
     * @public
     */
    attribute (index)
    {
        return (this._$isWebGL2Context)
            ? `layout (location = ${index}) in`
            : "attribute";
    }

    /**
     * @param  {boolean} [centroid=false]
     * @return {string}
     * @method
     * @public
     */
    varyingOut (centroid = false)
    {
        return (this._$isWebGL2Context)
            ? `${(centroid) ? "centroid " : ""}out`
            : "varying";
    }

    /**
     * @param  {boolean} [centroid=false]
     * @return {string}
     * @method
     * @public
     */
    varyingIn (centroid = false)
    {
        return (this._$isWebGL2Context)
            ? `${(centroid) ? "centroid " : ""}in`
            : "varying";
    }

    /**
     * @return {string}
     * @method
     * @public
     */
    outColor ()
    {
        return (this._$isWebGL2Context)
            ? "out vec4 o_color;"
            : "";
    }

    /**
     * @return {string}
     * @method
     * @public
     */
    fragColor ()
    {
        return (this._$isWebGL2Context)
            ? "o_color"
            : "gl_FragColor"
    }

    /**
     * @return {string}
     * @method
     * @public
     */
    texture2D ()
    {
        return (this._$isWebGL2Context)
            ? "texture"
            : "texture2D"
    }

    /**
     * @return {string}
     * @method
     * @public
     */
    extensionDerivatives ()
    {
        return (this._$isWebGL2Context)
            ? ""
            : "#extension GL_OES_standard_derivatives : enable"
    }
}
