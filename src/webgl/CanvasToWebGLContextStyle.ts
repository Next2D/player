import { CanvasGradientToWebGL } from "./CanvasGradientToWebGL";
import { CanvasPatternToWebGL } from "./CanvasPatternToWebGL";
import type { CapsStyle, JointStyle } from "../interface/StrokeTypeImpl";
import {
    $getFloat32Array4,
    $poolFloat32Array4,
    $Float32Array
} from "../util/RenderUtil";

/**
 * @class
 */
export class CanvasToWebGLContextStyle
{
    private _$fillStyle: Float32Array|CanvasGradientToWebGL|CanvasPatternToWebGL;
    private _$strokeStyle: Float32Array|CanvasGradientToWebGL|CanvasPatternToWebGL;
    private _$lineWidth: number;
    private _$lineCap: CapsStyle;
    private _$lineJoin: JointStyle;
    private _$miterLimit: number;

    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        this._$fillStyle   = $getFloat32Array4(1, 1, 1, 1); // fixed size 4
        this._$strokeStyle = $getFloat32Array4(1, 1, 1, 1); // fixed size 4
        this._$lineWidth   = 1;
        this._$lineCap     = "round";
        this._$lineJoin    = "round";
        this._$miterLimit  = 5;
    }

    /**
     * @member {number}
     * @default 5
     * @public
     */
    get miterLimit (): number
    {
        return this._$miterLimit;
    }
    set miterLimit (miter_limit: number)
    {
        this._$miterLimit = miter_limit;
    }

    /**
     * @member {number}
     * @default 1
     * @public
     */
    get lineWidth (): number
    {
        return this._$lineWidth;
    }
    set lineWidth (line_width: number)
    {
        this._$lineWidth = line_width;
    }

    /**
     * @member {string}
     * @default "round"
     * @public
     */
    get lineCap (): CapsStyle
    {
        return this._$lineCap;
    }
    set lineCap (line_cap: CapsStyle)
    {
        this._$lineCap = line_cap;
    }

    /**
     * @member {string}
     * @default "round"
     * @public
     */
    get lineJoin (): JointStyle
    {
        return this._$lineJoin;
    }
    set lineJoin (line_join: JointStyle)
    {
        this._$lineJoin = line_join;
    }

    /**
     * @member {Float32Array|CanvasGradientToWebGL|CanvasPatternToWebGL}
     * @public
     */
    get fillStyle (): Float32Array|CanvasGradientToWebGL|CanvasPatternToWebGL
    {
        return this._$fillStyle;
    }
    set fillStyle (style: Float32Array|CanvasGradientToWebGL|CanvasPatternToWebGL)
    {
        if (this._$fillStyle instanceof $Float32Array) {
            $poolFloat32Array4(this._$fillStyle);
        }
        this._$fillStyle = style;
    }

    /**
     * @member {Float32Array|CanvasGradientToWebGL|CanvasPatternToWebGL}
     * @public
     */
    get strokeStyle (): Float32Array|CanvasGradientToWebGL|CanvasPatternToWebGL
    {
        return this._$strokeStyle;
    }
    set strokeStyle (style: Float32Array|CanvasGradientToWebGL|CanvasPatternToWebGL)
    {
        if (this._$strokeStyle instanceof $Float32Array) {
            $poolFloat32Array4(this._$strokeStyle);
        }
        this._$strokeStyle = style;
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    clear (): void
    {
        this._$lineWidth   = 1;
        this._$lineCap     = "round";
        this._$lineJoin    = "round";
        this._$miterLimit  = 5;

        this._$clearFill();
        this._$clearStroke();
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    _$clearFill (): void
    {
        if (this._$fillStyle instanceof CanvasGradientToWebGL) {
            this._$fillStyle.dispose();
            this._$fillStyle = $getFloat32Array4(1, 1, 1, 1);
            return ;
        }

        if (this._$fillStyle instanceof CanvasPatternToWebGL) {
            this._$fillStyle.dispose();
            this._$fillStyle = $getFloat32Array4(1, 1, 1, 1);
            return ;
        }

        this._$fillStyle.fill(1);
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    _$clearStroke (): void
    {
        if (this._$strokeStyle instanceof CanvasGradientToWebGL) {
            this._$strokeStyle.dispose();
            this._$strokeStyle = $getFloat32Array4(1, 1, 1, 1);
            return ;
        }

        if (this._$strokeStyle instanceof CanvasPatternToWebGL) {
            this._$strokeStyle.dispose();
            this._$strokeStyle = $getFloat32Array4(1, 1, 1, 1);
            return ;
        }

        this._$strokeStyle.fill(1);
    }
}