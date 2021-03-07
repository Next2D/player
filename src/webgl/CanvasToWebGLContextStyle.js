/**
 * @class
 */
class CanvasToWebGLContextStyle
{
    /**
     * @constructor
     */
    constructor ()
    {
        this._$fillStyle   = Util.$getFloat32Array(1, 1, 1, 1);
        this._$strokeStyle = Util.$getFloat32Array(1, 1, 1, 1);
        this._$lineWidth   = 1;
        this._$lineCap     = 0;
        this._$lineJoin    = 0;
        this._$miterLimit  = 5;
    }
}
