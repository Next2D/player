import {
    InterpolationMethod,
    SpreadMethod,
    GradientType
} from "../interface/GradientTypeImpl";
import {
    $getFloat32Array6,
    $getArray,
    $clamp,
    $poolFloat32Array4,
    $poolFloat32Array6
} from "../player/util/RenderUtil";

/**
 * @class
 */
export class CanvasGradientToWebGL
{
    private _$rgb: InterpolationMethod;
    private _$mode: SpreadMethod;
    private _$type: GradientType;
    private _$focalPointRatio: number;
    private readonly _$points: Float32Array;
    private readonly _$stops: any[];

    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        /**
         * @type {string}
         * @default InterpolationMethod.RGB
         * @private
         */
        this._$rgb = "rgb";

        /**
         * @type {string}
         * @default SpreadMethod.PAD
         * @private
         */
        this._$mode = "pad";

        /**
         * @type {string}
         * @default GradientType.LINEAR
         * @private
         */
        this._$type = "linear";

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$focalPointRatio = 0;

        /**
         * @type {Float32Array}
         * @private
         */
        this._$points = $getFloat32Array6();

        /**
         * @type {array}
         * @private
         */
        this._$stops = $getArray();
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    dispose (): void
    {
        const stops = this._$stops;
        for (let idx: number = 0; idx < stops.length; ++idx) {
            $poolFloat32Array4(stops[idx][1]);
        }
        $poolFloat32Array6(this._$points);
    }

    /**
     * @member {string}
     * @readonly
     * @public
     */
    get mode (): SpreadMethod
    {
        return this._$mode;
    }

    /**
     * @member {string}
     * @readonly
     * @public
     */
    get type (): GradientType
    {
        return this._$type;
    }

    /**
     * @member {string}
     * @readonly
     * @public
     */
    get rgb (): InterpolationMethod
    {
        return this._$rgb;
    }

    /**
     * @member {Float32Array}
     * @readonly
     * @public
     */
    get points (): Float32Array
    {
        return this._$points;
    }

    /**
     * @member {number}
     * @readonly
     * @public
     */
    get focalPointRatio (): number
    {
        return this._$focalPointRatio;
    }

    /**
     * @member {array}
     * @readonly
     * @public
     */
    get stops (): any[]
    {
        // sort
        this._$stops.sort((a, b) =>
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

        return this._$stops;
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
        x0: number, y0: number, x1: number, y1: number,
        rgb: InterpolationMethod = "rgb",
        mode: SpreadMethod = "pad"
    ): CanvasGradientToWebGL {

        this._$type      = "linear";
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
        x0: number, y0: number, r0: number, x1: number, y1: number, r1: number,
        rgb: InterpolationMethod = "rgb",
        mode: SpreadMethod = "pad",
        focal_point_ratio: number = 0
    ): CanvasGradientToWebGL {

        this._$type            = "radial";
        this._$points[0]       = x0;
        this._$points[1]       = y0;
        this._$points[2]       = r0;
        this._$points[3]       = x1;
        this._$points[4]       = y1;
        this._$points[5]       = r1;
        this._$rgb             = rgb;
        this._$mode            = mode;
        this._$focalPointRatio = $clamp(focal_point_ratio, -0.975, 0.975, 0);

        if (this._$stops.length) {
            this._$stops.length = 0;
        }

        return this;
    }

    /**
     * @param  {number} offset
     * @param  {Float32Array} color
     * @return {void}
     * @method
     * @public
     */
    addColorStop (offset: number, color: Float32Array): void
    {
        this._$stops.push($getArray(offset, color));
    }
}
