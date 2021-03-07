/**
 * @class
 */
class CanvasPatternToWebGL
{
    /**
     * @param {WebGLTexture} [texture=null]
     * @param {string}       [repeat=null]
     * @param {array}        [color_transform=null]
     * @constructor
     * @public
     */
    constructor (texture = null, repeat = null, color_transform = null)
    {
        this._$initialization(texture, repeat, color_transform);
    }

    /**
     * @param  {WebGLTexture} [texture=null]
     * @param  {string}       [repeat=null]
     * @param  {array}        [color_transform=null]
     * @return {CanvasPatternToWebGL}
     * @method
     * @private
     */
    _$initialization (texture = null, repeat = null, color_transform = null)
    {
        this._$texture         = texture;
        this._$repeat          = repeat;
        this._$color_transform = color_transform;
        return this;
    }

    /**
     * @memberof CanvasToWebGLContext#
     * @property {WebGLTexture}
     * @readonly
     * @public
     */
    get texture ()
    {
        return this._$texture;
    }

    /**
     * @memberof CanvasToWebGLContext#
     * @property {string}
     * @readonly
     * @public
     */
    get repeat ()
    {
        return this._$repeat;
    }

    /**
     * @memberof CanvasToWebGLContext#
     * @property {array}
     * @readonly
     * @public
     */
    get colorTransform ()
    {
        return this._$color_transform;
    }

}