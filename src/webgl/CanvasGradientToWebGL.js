/**
 * @class
 */
class CanvasGradientToWebGL
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        this._$rgb             = InterpolationMethod.RGB;
        this._$mode            = SpreadMethod.PAD;
        this._$focalPointRatio = 0;
        this._$points          = Util.$getFloat32Array6(); // fixed size 6
        this._$stops           = Util.$getArray();
        this._$type            = null;
    }

    /**
     * @param  {number} x0
     * @param  {number} y0
     * @param  {number} x1
     * @param  {number} y1
     * @param  {string} [rgb=InterpolationMethod.RGB]
     * @param  {string} [mode=SpreadMethod.PAD]
     * @return {CanvasGradientToWebGL}
     * @method
     * @public
     */
    linear (
        x0, y0, x1, y1,
        rgb = InterpolationMethod.RGB, mode = SpreadMethod.PAD
    ) {

        this._$type      = GradientType.LINEAR;
        this._$points[0] = x0;
        this._$points[1] = y0;
        this._$points[2] = x1;
        this._$points[3] = y1;
        this._$rgb       = rgb;
        this._$mode      = mode;

        if (this._$stops.length) {
            this._$stops.length = 0;
        }

        return this;
    }

    /**
     * @param  {number} x0
     * @param  {number} y0
     * @param  {number} r0
     * @param  {number} x1
     * @param  {number} y1
     * @param  {number} r1
     * @param  {string} [rgb=InterpolationMethod.RGB]
     * @param  {string} [mode=SpreadMethod.PAD]
     * @param  {number} [focal_point_ratio=0]
     * @return {CanvasGradientToWebGL}
     * @method
     * @public
     */
    radial (
        x0, y0, r0, x1, y1, r1,
        rgb = InterpolationMethod.RGB, mode = SpreadMethod.PAD,
        focal_point_ratio = 0
    ) {

        this._$type            = GradientType.RADIAL;
        this._$points[0]       = x0;
        this._$points[1]       = y0;
        this._$points[2]       = r0;
        this._$points[3]       = x1;
        this._$points[4]       = y1;
        this._$points[5]       = r1;
        this._$rgb             = rgb;
        this._$mode            = mode;
        this._$focalPointRatio = Util.$clamp(focal_point_ratio, -0.975, 0.975, 0);

        if (this._$stops.length) {
            this._$stops.length = 0;
        }

        return this;
    }

    /**
     * @param  {number} offset
     * @param  {array}  color
     * @return {void}
     * @method
     * @public
     */
    addColorStop (offset, color)
    {
        // add
        this._$stops.push([offset, color]);

        // sort
        this._$stops.sort(function(a, b)
        {
            switch (true) {

                case a[0] > b[0]:
                    return 1;

                case b[0] > a[0]:
                    return -1;

                default:
                    return 0;

            }
        });
    }
}
