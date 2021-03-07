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
        this._$points          = Util.$getFloat32Array(0,0,0,0,0,0);
        this._$stops           = Util.$getArray();
        this._$type            = null;
    }

    /**
     * @return {CanvasGradientToWebGL}
     * @method
     * @private
     */
    _$initialization ()
    {
        // reset
        this._$type  = null;
        if (this._$stops.length) {
            this._$stops.length = 0;
        }

        const length = arguments.length;
        if (!length) {

            // reset
            this._$rgb             = InterpolationMethod.RGB;
            this._$mode            = SpreadMethod.PAD;
            this._$focalPointRatio = 0;
            this._$points.fill(0);

            return this;
        }


        if (length === 6) {

            this._$type = GradientType.LINEAR;

            if (this._$points && this._$points.length === 4) {

                this._$points[0] = arguments[0];
                this._$points[1] = arguments[1];
                this._$points[2] = arguments[2];
                this._$points[3] = arguments[3];

            } else {

                this._$points = Util.$getFloat32Array(
                    arguments[0], arguments[1], arguments[2], arguments[3]
                );

            }

            this._$rgb  = arguments[4] || InterpolationMethod.RGB;
            this._$mode = arguments[5] || SpreadMethod.PAD;

            return this;
        }

        this._$type = GradientType.RADIAL;
        if (this._$points && this._$points.length === 6) {

            this._$points[0] = arguments[0];
            this._$points[1] = arguments[1];
            this._$points[2] = arguments[2];
            this._$points[3] = arguments[3];
            this._$points[4] = arguments[4];
            this._$points[5] = arguments[5];

        } else {

            this._$points = Util.$getFloat32Array(
                arguments[0], arguments[1], arguments[2],
                arguments[3], arguments[4], arguments[5]
            );

        }

        this._$rgb             = arguments[6] || InterpolationMethod.RGB;
        this._$mode            = arguments[7] || SpreadMethod.PAD;
        this._$focalPointRatio = Util.$clamp(arguments[8], -0.975, 0.975, 0);

        return this;
    }

    /**
     * @param {number} offset
     * @param {array}  color
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

                case (a[0] > b[0]):
                    return 1;

                case (b[0] > a[0]):
                    return -1;

                default:
                    return 0;

            }
        });
    }
}