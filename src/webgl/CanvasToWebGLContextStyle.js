/**
 * @class
 */
class CanvasToWebGLContextStyle
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        this._$fillStyle   = new Util.$window.Float32Array([1, 1, 1, 1]); // fixed size 4
        this._$strokeStyle = new Util.$window.Float32Array([1, 1, 1, 1]); // fixed size 4
        this._$lineWidth   = 1;
        this._$lineCap     = 0;
        this._$lineJoin    = 0;
        this._$miterLimit  = 5;
    }
}