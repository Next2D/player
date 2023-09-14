import { GraphicsBitmapFill } from "./GraphicsBitmapFill";
import { GraphicsGradientFill } from "./GraphicsGradientFill";
import type { BitmapData } from "./BitmapData";
import type { Player } from "@next2d/core";
import type { Matrix, Rectangle } from "@next2d/geom";
import type {
    GraphicsParentImpl,
    CapsStyleImpl,
    JointStyleImpl,
    FilterArrayImpl,
    BlendModeImpl,
    BoundsImpl,
    DisplayObjectImpl,
    AttachmentImpl,
    PlayerHitObjectImpl,
    ColorStopImpl,
    SpreadMethodImpl,
    GradientTypeImpl,
    InterpolationMethodImpl,
    CachePositionImpl,
    ShapeModeImpl,
    GridImpl
} from "@next2d/interface";
import type {
    CanvasToWebGLContext,
    FrameBufferManager,
    CanvasGradientToWebGL
} from "@next2d/webgl";
import { $currentPlayer } from "@next2d/util";
import {
    $cacheStore,
    $doUpdated,
    $Math,
    $Number,
    $getArray,
    $poolArray,
    $toColorInt,
    $intToRGBA,
    $clamp,
    $boundsMatrix,
    $poolBoundsObject,
    $Infinity,
    $getFloat32Array6,
    $multiplicationMatrix,
    $poolFloat32Array6,
    $getBoundsObject,
    $Float32Array,
    $getFloat32Array4,
    $getInt32Array4,
    $linearGradientXY
} from "@next2d/share";

/**
 * Graphics クラスには、ベクターシェイプの作成に使用できる一連のメソッドがあります。
 * 描画をサポートする表示オブジェクトには、Sprite および Shape オブジェクトがあります。
 * これらの各クラスには、Graphics オブジェクトである graphics プロパティがあります。
 * 以下は、簡単に使用できるように用意されているヘルパー関数の一例です。
 * drawRect()、drawRoundRect()、drawCircle()、および drawEllipse()。
 *
 * The Graphics class contains a set of methods that you can use to create a vector shape.
 * Display objects that support drawing include Sprite and Shape objects.
 * Each of these classes includes a graphics property that is a Graphics object.
 * The following are among those helper functions provided for ease of use:
 * drawRect(), drawRoundRect(), drawCircle(), and drawEllipse().
 *
 * @class
 * @memberOf next2d.display
 */
export class Graphics
{
    private readonly _$displayObject: GraphicsParentImpl<any> | null;
    public _$maxAlpha: number;
    private _$pointerX: number;
    private _$pointerY: number;
    public _$canDraw: boolean;
    private _$fillType: number;
    private _$fillGradient: GraphicsGradientFill | null;
    private _$fillBitmap: GraphicsBitmapFill | null;
    private _$fillStyleR: number;
    private _$fillStyleG: number;
    private _$fillStyleB: number;
    private _$fillStyleA: number;
    private _$doFill: boolean;
    private _$lineType: number;
    private _$lineGradient: GraphicsGradientFill | null;
    private _$caps: CapsStyleImpl;
    private _$joints: JointStyleImpl;
    private _$miterLimit: number;
    private _$lineWidth: number;
    private _$lineStyleR: number;
    private _$lineStyleG: number;
    private _$lineStyleB: number;
    private _$lineStyleA: number;
    private _$doLine: boolean;
    public _$xMin: number;
    public _$xMax: number;
    public _$yMin: number;
    public _$yMax: number;
    public _$buffer: Float32Array | null;
    public _$recode: any[] | null;
    private _$fills: any[] | null;
    private _$lines: any[] | null;
    private _$uniqueKey: string;
    private _$cacheKeys: string[];
    private readonly _$cacheParams: number[];
    public _$bitmapId: number;
    public _$mode: ShapeModeImpl;
    public _$posted: boolean;

    /**
     * @param {DisplayObject} src
     *
     * @constructor
     * @public
     */
    constructor (src: GraphicsParentImpl<any> | null = null)
    {
        /**
         * @type {DisplayObject}
         * @default null
         * @private
         */
        this._$displayObject = src;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$maxAlpha = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$pointerX = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$pointerY = 0;

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$canDraw = false;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$fillType = 0;

        /**
         * @type {GraphicsGradientFill}
         * @default null
         * @private
         */
        this._$fillGradient = null;

        /**
         * @type {GraphicsGradientFill}
         * @default null
         * @private
         */
        this._$fillBitmap = null;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$fillStyleR = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$fillStyleG = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$fillStyleB = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$fillStyleA = 0;

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$doFill = false;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$lineType = 0;

        /**
         * @type {GraphicsGradientFill}
         * @default 0
         * @private
         */
        this._$lineGradient = null;

        /**
         * @type {string}
         * @default none
         * @private
         */
        this._$caps = "none";

        /**
         * @type {string}
         * @default round
         * @private
         */
        this._$joints = "round";

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$miterLimit = 0;

        /**
         * @type {number}
         * @default 1
         * @private
         */
        this._$lineWidth = 1;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$lineStyleR = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$lineStyleG = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$lineStyleB = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$lineStyleA = 0;

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$doLine = false;

        /**
         * @type {number}
         * @default Number.MAX_VALUE
         * @private
         */
        this._$xMin = $Number.MAX_VALUE;

        /**
         * @type {number}
         * @default -Number.MAX_VALUE
         * @private
         */
        this._$xMax = -$Number.MAX_VALUE;

        /**
         * @type {number}
         * @default Number.MAX_VALUE
         * @private
         */
        this._$yMin = $Number.MAX_VALUE;

        /**
         * @type {number}
         * @default -Number.MAX_VALUE
         * @private
         */
        this._$yMax = -$Number.MAX_VALUE;

        /**
         * @type {Float32Array}
         * @default null
         * @private
         */
        this._$buffer = null;

        /**
         * @type {array}
         * @default null
         * @private
         */
        this._$recode = null;

        /**
         * @type {array}
         * @default null
         * @private
         */
        this._$fills = null;

        /**
         * @type {array}
         * @default null
         * @private
         */
        this._$lines = null;

        /**
         * @type {string}
         * @default ""
         * @private
         */
        this._$uniqueKey = "";

        /**
         * @type {array}
         * @private
         */
        this._$cacheKeys = $getArray();

        /**
         * @type {array}
         * @private
         */
        this._$cacheParams = $getArray(0, 0, 0);

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$bitmapId = 0;

        /**
         * @type {string}
         * @default "shape"
         * @private
         */
        this._$mode = "shape";

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$posted = false;
    }

    /**
     * @description 指定されたクラスのストリングを返します。
     *              Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default [class Graphics]
     * @method
     * @static
     */
    static toString (): string
    {
        return "[class Graphics]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return  {string}
     * @default next2d.display.Bitmap
     * @const
     * @static
     */
    static get namespace (): string
    {
        return "next2d.display.Graphics";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return  {string}
     * @default [object Graphics]
     * @method
     * @public
     */
    toString (): string
    {
        return "[object Graphics]";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @return  {string}
     * @default next2d.display.Graphics
     * @const
     * @public
     */
    get namespace (): string
    {
        return "next2d.display.Graphics";
    }

    /**
     * @return {number}
     * @default 0
     * @const
     * @static
     * @private
     */
    static get MOVE_TO (): number
    {
        return 0;
    }

    /**
     * @return {number}
     * @default 1
     * @const
     * @static
     * @private
     */
    static get CURVE_TO (): number
    {
        return 1;
    }

    /**
     * @return {number}
     * @default 2
     * @const
     * @static
     * @private
     */
    static get LINE_TO (): number
    {
        return 2;
    }

    /**
     * @return {number}
     * @default 3
     * @const
     * @static
     * @private
     */
    static get CUBIC (): number
    {
        return 3;
    }

    /**
     * @return {number}
     * @default 4
     * @const
     * @static
     * @private
     */
    static get ARC (): number
    {
        return 4;
    }

    /**
     * @return {number}
     * @default 5
     * @const
     * @static
     * @private
     */
    static get FILL_STYLE (): number
    {
        return 5;
    }

    /**
     * @return {number}
     * @default 6
     * @const
     * @static
     * @private
     */
    static get STROKE_STYLE (): number
    {
        return 6;
    }

    /**
     * @return {number}
     * @default 7
     * @const
     * @static
     * @private
     */
    static get END_FILL (): number
    {
        return 7;
    }

    /**
     * @return {number}
     * @default 8
     * @const
     * @static
     * @private
     */
    static get END_STROKE (): number
    {
        return 8;
    }

    /**
     * @return {number}
     * @default 9
     * @const
     * @static
     * @private
     */
    static get BEGIN_PATH (): number
    {
        return 9;
    }

    /**
     * @return {number}
     * @default 10
     * @const
     * @static
     * @private
     */
    static get GRADIENT_FILL (): number
    {
        return 10;
    }

    /**
     * @return {number}
     * @default 11
     * @const
     * @static
     * @private
     */
    static get GRADIENT_STROKE (): number
    {
        return 11;
    }

    /**
     * @return {number}
     * @default 12
     * @const
     * @static
     * @private
     */
    static get CLOSE_PATH (): number
    {
        return 12;
    }

    /**
     * @return {number}
     * @default 13
     * @const
     * @static
     * @private
     */
    static get BITMAP_FILL (): number
    {
        return 13;
    }

    /**
     * @return {number}
     * @default 14
     * @const
     * @static
     * @private
     */
    static get BITMAP_STROKE (): number
    {
        return 14;
    }

    /**
     * @description 描画領域をビットマップイメージで塗りつぶします。
     *              Fills a drawing area with a bitmap image.
     *
     * @param  {BitmapData} bitmap_data
     * @param  {Matrix}     [matrix=null]
     * @param  {boolean}    [repeat=true]
     * @param  {boolean}    [smooth=false]
     * @return {Graphics}
     * @method
     * @public
     */
    beginBitmapFill (
        bitmap_data: BitmapData,
        matrix: Matrix | null = null,
        repeat: boolean = true,
        smooth: boolean = false
    ): Graphics {

        // end fill
        if (this._$doFill) {
            this.endFill();
        }

        if (!this._$fills) {
            this._$fills = $getArray();
        }

        // start
        this._$maxAlpha = 1;
        this._$doFill   = true;
        this._$canDraw  = true;

        // beginPath
        this._$fills.push(Graphics.BEGIN_PATH);

        this._$fillType   = Graphics.BITMAP_FILL;
        this._$fillBitmap = new GraphicsBitmapFill(
            bitmap_data, matrix, repeat, smooth
        );

        return this;
    }

    /**
     * @description 描画のときに他の Graphics メソッド（lineTo() や drawCircle() など）
     *              に対する今後の呼び出しに使用する単純な一色塗りを指定します。
     *              Specifies a simple one-color fill that subsequent calls
     *              to other Graphics methods (such as lineTo() or drawCircle()) use when drawing.
     *
     * @param  {string|number} [color=0]
     * @param  {number} [alpha=1.0]
     * @return {Graphics}
     * @method
     * @public
     */
    beginFill (
        color: string | number = 0,
        alpha: number = 1
    ): Graphics {

        // end fill
        if (this._$doFill) {
            this.endFill();
        }

        if (!this._$fills) {
            this._$fills = $getArray();
        }

        // valid
        color = $clamp($toColorInt(color), 0, 0xffffff, 0);
        alpha = $clamp(alpha, 0, 1, 1);

        // setup
        this._$maxAlpha = $Math.max(this._$maxAlpha, alpha);
        this._$doFill   = true;
        this._$canDraw  = true;

        // beginPath
        this._$fills.push(Graphics.BEGIN_PATH);

        // add Fill Style
        const object = $intToRGBA(color, alpha);

        this._$fillType   = Graphics.FILL_STYLE;
        this._$fillStyleR = object.R;
        this._$fillStyleG = object.G;
        this._$fillStyleB = object.B;
        this._$fillStyleA = object.A;

        return this;
    }

    /**
     * @description Graphics の他のメソッド（lineTo()、drawCircle() など）に対する、
     *              オブジェクトの後続の呼び出しに使用するグラデーション塗りを指定します。
     *              Specifies a gradient fill used by subsequent calls
     *              to other Graphics methods (such as lineTo() or drawCircle()) for the object.
     *
     * @param  {string} type
     * @param  {array}  colors
     * @param  {array}  alphas
     * @param  {array}  ratios
     * @param  {Matrix} [matrix=null]
     * @param  {string} [spread_method=SpreadMethod.PAD]
     * @param  {string} [interpolation_method=InterpolationMethod.RGB]
     * @param  {number} [focal_point_ratio=0]
     * @return {Graphics}
     * @method
     * @public
     */
    beginGradientFill (
        type: GradientTypeImpl,
        colors: number[] | string[],
        alphas: number[],
        ratios: number[],
        matrix: Matrix | null = null,
        spread_method: SpreadMethodImpl = "pad",
        interpolation_method: InterpolationMethodImpl = "rgb",
        focal_point_ratio: number = 0
    ): Graphics {

        if (this._$doFill) {
            this.endFill();
        }

        if (!this._$fills) {
            this._$fills = $getArray();
        }

        // setup
        for (let idx: number = 0; idx < alphas.length; ++idx) {
            this._$maxAlpha = $Math.max(this._$maxAlpha, alphas[idx]);
        }
        this._$doFill  = true;
        this._$canDraw = true;

        // beginPath
        this._$fills.push(Graphics.BEGIN_PATH);

        this._$fillType     = Graphics.GRADIENT_FILL;
        this._$fillGradient = new GraphicsGradientFill(
            type, colors, alphas, ratios, matrix,
            spread_method, interpolation_method,
            focal_point_ratio
        );

        return this;
    }

    /**
     * @description この Graphics オブジェクトに描画されているグラフィックをクリアし、
     *              塗りと線のスタイルの設定をリセットします。
     *              Clears the graphics that were drawn to this Graphics object,
     *              and resets fill and line style settings.
     *
     * @return {Graphics}
     * @method
     * @public
     */
    clear (): Graphics
    {
        // param clear
        this._$maxAlpha     = 0;
        this._$pointerX     = 0;
        this._$pointerY     = 0;
        this._$canDraw      = false;
        this._$bitmapId     = 0;
        this._$mode         = "shape";
        this._$posted       = false;

        // fill
        this._$fillType     = 0;
        this._$fillGradient = null;
        this._$fillBitmap   = null;
        this._$fillStyleR   = 0;
        this._$fillStyleG   = 0;
        this._$fillStyleB   = 0;
        this._$fillStyleA   = 0;
        this._$doFill       = false;

        // stroke
        this._$lineType     = 0;
        this._$lineGradient = null;
        this._$caps         = "none";
        this._$joints       = "round";
        this._$miterLimit   = 0;
        this._$lineWidth    = 1;
        this._$lineStyleR   = 0;
        this._$lineStyleG   = 0;
        this._$lineStyleB   = 0;
        this._$lineStyleA   = 0;
        this._$doLine       = false;

        // bounds size
        this._$xMin         = $Number.MAX_VALUE;
        this._$xMax         = -$Number.MAX_VALUE;
        this._$yMin         = $Number.MAX_VALUE;
        this._$yMax         = -$Number.MAX_VALUE;

        // init array
        if (this._$recode) {
            $poolArray(this._$recode);
        }
        if (this._$fills) {
            $poolArray(this._$fills);
        }
        if (this._$lines) {
            $poolArray(this._$lines);
        }

        this._$buffer = null;
        this._$recode = null;
        this._$fills  = null;
        this._$lines  = null;

        // cache clear
        this._$cacheKeys.length = 0;
        this._$uniqueKey        = "";
        this._$cacheParams.fill(0);

        // restart
        this._$restart();

        return this;
    }

    /**
     * @description すべての描画コマンドをソース Graphics オブジェクトから、呼び出し Graphics オブジェクトにコピーします。
     *              Copies all of drawing commands from the source Graphics object into the calling Graphics object.
     *
     * @return {Graphics}
     * @method
     * @public
     */
    clone (): Graphics
    {
        const graphics = new Graphics();
        graphics.copyFrom(this);
        return graphics;
    }

    /**
     * @description すべての描画コマンドをソース Graphics オブジェクトから、呼び出し Graphics オブジェクトにコピーします。
     *              Copies all of drawing commands from the source Graphics object into the calling Graphics object.
     *
     * @param  {Graphics} graphics
     * @return {void}
     * @method
     * @public
     */
    copyFrom (graphics: Graphics): void
    {
        if (graphics._$fillGradient) {
            this._$fillGradient = graphics._$fillGradient.clone();
        }

        if (graphics._$fillBitmap) {
            this._$fillBitmap = graphics._$fillBitmap.clone();
        }

        // fill
        this._$doFill       = graphics._$doFill;
        this._$fillType     = graphics._$fillType;
        this._$fillStyleR   = graphics._$fillStyleR;
        this._$fillStyleG   = graphics._$fillStyleG;
        this._$fillStyleB   = graphics._$fillStyleB;
        this._$fillStyleA   = graphics._$fillStyleA;

        if (graphics._$lineGradient) {
            this._$lineGradient = graphics._$lineGradient.clone();
        }

        // stroke
        this._$doLine       = graphics._$doLine;
        this._$lineType     = graphics._$lineType;
        this._$caps         = graphics._$caps;
        this._$joints       = graphics._$joints;
        this._$miterLimit   = graphics._$miterLimit;
        this._$lineWidth    = graphics._$lineWidth;
        this._$lineStyleR   = graphics._$lineStyleR;
        this._$lineStyleG   = graphics._$lineStyleG;
        this._$lineStyleB   = graphics._$lineStyleB;
        this._$lineStyleA   = graphics._$lineStyleA;

        // bounds
        this._$xMin         = graphics._$xMin;
        this._$xMax         = graphics._$xMax;
        this._$yMin         = graphics._$yMin;
        this._$yMax         = graphics._$yMax;

        // params
        this._$maxAlpha     = graphics._$maxAlpha;
        this._$pointerX     = graphics._$pointerX;
        this._$pointerY     = graphics._$pointerY;
        this._$canDraw      = graphics._$canDraw;

        // path params
        if (graphics._$fills) {
            this._$fills = graphics._$fills.slice(0);
        }
        if (graphics._$lines) {
            this._$lines = graphics._$lines.slice(0);
        }
        if (graphics._$recode) {
            this._$recode = graphics._$recode.slice(0);
        }
    }

    /**
     * @description 現在の描画位置から指定されたアンカーポイントに 3 次ベジェ曲線を描画します。
     *              Draws a cubic Bezier curve from the current drawing position to the specified anchor point.
     *
     * @param  {number} control_x1
     * @param  {number} control_y1
     * @param  {number} control_x2
     * @param  {number} control_y2
     * @param  {number} anchor_x
     * @param  {number} anchor_y
     * @return {Graphics}
     * @method
     * @public
     */
    cubicCurveTo (
        control_x1: number, control_y1: number,
        control_x2: number, control_y2: number,
        anchor_x: number, anchor_y: number
    ): Graphics {

        anchor_x = +anchor_x || 0;
        anchor_y = +anchor_y || 0;

        if (this._$pointerX === anchor_x && this._$pointerY === anchor_y) {
            return this;
        }

        control_x1 = +control_x1 || 0;
        control_y1 = +control_y1 || 0;
        control_x2 = +control_x2 || 0;
        control_y2 = +control_y2 || 0;

        // set bounds
        this._$setBounds(control_x1, control_y1);
        this._$setBounds(control_x2, control_y2);
        this._$setBounds(anchor_x, anchor_y);

        this._$margePath($getArray(
            Graphics.CUBIC,
            control_x1, control_y1,
            control_x2, control_y2,
            anchor_x, anchor_y
        ));

        this._$pointerX = anchor_x;
        this._$pointerY = anchor_y;

        // restart
        this._$restart();

        return this;
    }

    /**
     * @description (controlX, controlY) で指定されたコントロールポイントを使用し、
     *              現在の描画位置から (anchorX, anchorY) まで、現在の線のスタイルで 2 次ベジェ曲線を描画します。
     *              Draws a quadratic Bezier curve using the current line style from
     *              the current drawing position to (anchorX, anchorY)
     *              and using the control point that (controlX, controlY) specifies.
     *
     * @param  {number} control_x
     * @param  {number} control_y
     * @param  {number} anchor_x
     * @param  {number} anchor_y
     * @return {Graphics}
     * @method
     * @public
     */
    curveTo (
        control_x: number, control_y: number,
        anchor_x: number, anchor_y: number
    ): Graphics {

        anchor_x = +anchor_x || 0;
        anchor_y = +anchor_y || 0;

        if (this._$pointerX === anchor_x && this._$pointerY === anchor_y) {
            return this;
        }

        control_x = +control_x || 0;
        control_y = +control_y || 0;

        this._$setBounds(control_x, control_y);
        this._$setBounds(anchor_x,  anchor_y);

        this._$margePath($getArray(
            Graphics.CURVE_TO,
            control_x, control_y,
            anchor_x, anchor_y
        ));

        this._$pointerX = anchor_x;
        this._$pointerY = anchor_y;

        // restart
        this._$restart();

        return this;
    }

    /**
     * @description 円を描画します。
     *              Draws a circle.
     *
     * @param  {number} x
     * @param  {number} y
     * @param  {number} radius
     * @return {Graphics}
     * @method
     * @public
     */
    drawCircle (x: number, y: number, radius: number): Graphics
    {
        x      = +x || 0;
        y      = +y || 0;
        radius = +radius || 0;
        radius = $Math.round(radius);

        this._$setBounds(x - radius, y - radius);
        this._$setBounds(x + radius, y + radius);

        this._$margePath($getArray(
            Graphics.MOVE_TO, x + radius, y,
            Graphics.ARC, x, y, radius
        ));

        this._$pointerX = x;
        this._$pointerY = y;

        // restart
        this._$restart();

        return this;
    }

    /**
     * @description 楕円を描画します。
     *              Draws an ellipse.
     *
     * @param  {number} x
     * @param  {number} y
     * @param  {number} width
     * @param  {number} height
     * @return {Graphics}
     * @method
     * @public
     */
    drawEllipse (x: number, y: number, width: number, height: number): Graphics
    {
        x = +x || 0;
        y = +y || 0;
        width  = +width  || 0;
        height = +height || 0;

        width  = $Math.round(width);
        height = $Math.round(height);

        const hw = width  / 2; // half width
        const hh = height / 2; // half height
        const x0 = x + hw;
        const y0 = y + hh;
        const x1 = x + width;
        const y1 = y + height;
        const c  = 4 / 3 * ($Math.SQRT2 - 1);
        const cw = c * hw;
        const ch = c * hh;

        return this
            .moveTo(x0, y)
            .cubicCurveTo(x0 + cw, y,       x1,      y0 - ch, x1, y0)
            .cubicCurveTo(x1,      y0 + ch, x0 + cw, y1,      x0, y1)
            .cubicCurveTo(x0 - cw, y1,      x,       y0 + ch, x,  y0)
            .cubicCurveTo(x,       y0 - ch, x0 - cw, y,       x0, y );
    }

    /**
     * @description 矩形を描画します。
     *              Draws a rectangle.
     *
     * @param  {number} x
     * @param  {number} y
     * @param  {number} width
     * @param  {number} height
     * @return {Graphics}
     * @method
     * @public
     */
    drawRect (x: number, y: number, width: number, height: number): Graphics
    {
        // valid
        x = +x || 0;
        y = +y || 0;

        width  = +width  || 0;
        height = +height || 0;

        const xMax = $Math.round(x + width);
        const yMax = $Math.round(y + height);

        return this
            .moveTo(x,    y)
            .lineTo(x,    yMax)
            .lineTo(xMax, yMax)
            .lineTo(xMax, y)
            .lineTo(x,    y);
    }

    /**
     * @description 角丸矩形を描画します。
     *              Draws a rounded rectangle.
     *
     * @param  {number} x
     * @param  {number} y
     * @param  {number} width
     * @param  {number} height
     * @param  {number} ellipse_width
     * @param  {number} [ellipse_height=NaN]
     * @return {Graphics}
     * @method
     * @public
     */
    drawRoundRect (
        x: number, y: number,
        width: number, height: number,
        ellipse_width: number, ellipse_height: number = NaN
    ): Graphics {

        x = +x || 0;
        y = +y || 0;

        width  = +width  || 0;
        height = +height || 0;

        ellipse_width  = +ellipse_width  || 0;
        ellipse_height = +ellipse_height || ellipse_width;

        width  = $Math.round(width);
        height = $Math.round(height);
        ellipse_width  = $Math.round(ellipse_width);
        ellipse_height = $Math.round(ellipse_height);

        const hew = ellipse_width  / 2;
        const heh = ellipse_height / 2;
        const c   = 4 / 3 * ($Math.SQRT2 - 1);
        const cw  = c * hew;
        const ch  = c * heh;

        const dx0 = x   + hew;
        const dx1 = x   + width;
        const dx2 = dx1 - hew;

        const dy0 = y   + heh;
        const dy1 = y   + height;
        const dy2 = dy1 - heh;

        return this
            .moveTo(dx0, y)
            .lineTo(dx2, y)
            .cubicCurveTo(dx2 + cw, y, dx1, dy0 - ch, dx1, dy0)
            .lineTo(dx1, dy2)
            .cubicCurveTo(dx1, dy2 + ch, dx2 + cw, dy1, dx2, dy1)
            .lineTo(dx0, dy1)
            .cubicCurveTo(dx0 - cw, dy1, x, dy2 + ch, x, dy2)
            .lineTo(x, dy0)
            .cubicCurveTo(x, dy0 - ch, dx0 - cw, y, dx0, y);
    }

    /**
     * @description beginFill()、beginGradientFill()、または beginBitmapFill() メソッドへの
     *              最後の呼び出し以降に追加された線と曲線に塗りを適用します。
     *              Applies a fill to the lines and curves that were added since
     *              the last call to the beginFill(), beginGradientFill(),
     *              or beginBitmapFill() method.
     *
     * @return {Graphics}
     * @method
     * @public
     */
    endFill (): Graphics
    {
        if (this._$doFill && this._$fills && this._$fills.length > 7) {

            if (!this._$recode) {
                this._$recode = $getArray();
            }

            if (this._$fills[2] !== this._$fills[this._$fills.length - 2]
                || this._$fills[3] !== this._$fills[this._$fills.length - 1]
            ) {
                this._$fills.push(
                    Graphics.LINE_TO,
                    this._$fills[2],
                    this._$fills[3]
                );
            }
            this._$recode.push(...this._$fills);

            // fill
            switch (this._$fillType) {

                case Graphics.FILL_STYLE:
                    this._$recode.push(
                        this._$fillType,
                        this._$fillStyleR,
                        this._$fillStyleG,
                        this._$fillStyleB,
                        this._$fillStyleA,
                        Graphics.END_FILL
                    );
                    break;

                case Graphics.GRADIENT_FILL:
                    if (this._$fillGradient) {
                        this._$recode.push(
                            this._$fillType,
                            ...this._$fillGradient.toArray()
                        );
                    }
                    break;

                case Graphics.BITMAP_FILL:
                    if (this._$fillBitmap) {
                        this._$recode.push(
                            this._$fillType,
                            ...this._$fillBitmap.toArray()
                        );
                    }
                    break;

            }

        }

        if (this._$fills) {
            $poolArray(this._$fills);
            this._$fills = null;
        }

        // reset
        this._$fillType     = 0;
        this._$fillGradient = null;
        this._$fillBitmap   = null;
        this._$fillStyleR   = 0;
        this._$fillStyleG   = 0;
        this._$fillStyleB   = 0;
        this._$fillStyleA   = 0;
        this._$doFill       = false;

        // restart
        this._$restart();

        return this;
    }

    /**
     * @description lineStyle()、または lineGradientStyle() メソッドへの
     *              最後の呼び出し以降に追加された線と曲線に塗りを適用します。
     *              Applies a fill to the lines and curves that were added since
     *              the last call to the beginFill() or beginGradientFill() method.
     *
     * @return {Graphics}
     * @method
     * @public
     */
    endLine (): Graphics
    {
        if (this._$doLine && this._$lines) {

            if (!this._$recode) {
                this._$recode = $getArray();
            }

            this._$recode.push(...this._$lines);

            // clear
            $poolArray(this._$lines);
            this._$lines = null;

            // fill
            switch (this._$lineType) {

                case Graphics.STROKE_STYLE:
                    this._$recode.push(
                        this._$lineType,
                        this._$lineWidth,
                        this._$caps,
                        this._$joints,
                        this._$miterLimit,
                        this._$lineStyleR,
                        this._$lineStyleG,
                        this._$lineStyleB,
                        this._$lineStyleA,
                        Graphics.END_STROKE
                    );
                    break;

                case Graphics.GRADIENT_STROKE:
                    if (this._$lineGradient) {
                        this._$recode.push(
                            this._$lineType,
                            this._$lineWidth,
                            this._$caps,
                            this._$joints,
                            this._$miterLimit,
                            ...this._$lineGradient.toArray()
                        );
                    }
                    break;

                case Graphics.BITMAP_STROKE:
                    if (this._$fillBitmap) {
                        this._$recode.push(
                            this._$lineType,
                            this._$lineWidth,
                            this._$caps,
                            this._$joints,
                            this._$miterLimit,
                            ...this._$fillBitmap.toArray()
                        );
                    }
                    break;

            }
        }

        // reset
        this._$lineType     = 0;
        this._$lineWidth    = 0;
        this._$lineGradient = null;
        this._$lineStyleR   = 0;
        this._$lineStyleG   = 0;
        this._$lineStyleB   = 0;
        this._$lineStyleA   = 0;
        this._$caps         = "none";
        this._$joints       = "round";
        this._$miterLimit   = 0;
        this._$doLine       = false;

        // restart
        this._$restart();

        return this;
    }

    /**
     * @description 線の描画で、線として使用するビットマップを指定します。
     *              Specifies a bitmap to use for the line stroke when drawing lines.
     *
     * @param  {BitmapData} bitmap_data
     * @param  {Matrix}     [matrix=null]
     * @param  {boolean}    [repeat=true]
     * @param  {boolean}    [smooth=false]
     * @return {Graphics}
     * @method
     * @public
     */
    lineBitmapStyle (
        bitmap_data: BitmapData,
        matrix: Matrix | null = null,
        repeat: boolean = true,
        smooth: boolean = false
    ): Graphics {

        // end fill
        if (this._$doLine) {
            this.endLine();
        }

        if (!this._$lines) {
            this._$lines = $getArray();
        }

        // start
        this._$maxAlpha = 1;
        this._$doLine   = true;
        this._$canDraw  = true;

        // beginPath
        this._$lines.push(Graphics.BEGIN_PATH);

        this._$lineType   = Graphics.BITMAP_STROKE;
        this._$fillBitmap = new GraphicsBitmapFill(
            bitmap_data, matrix, repeat, smooth
        );

        return this;
    }

    /**
     * @description 線の描画で使用するグラデーションを指定します。
     *              Specifies a gradient to use for the stroke when drawing lines.
     *
     * @param  {string} type
     * @param  {array}  colors
     * @param  {array}  alphas
     * @param  {array}  ratios
     * @param  {Matrix} [matrix=null]
     * @param  {string} [spread_method=SpreadMethod.PAD]
     * @param  {string} [interpolation_method=InterpolationMethod.RGB]
     * @param  {number} [focal_point_ratio=0]
     * @return {Graphics}
     * @method
     * @public
     */
    lineGradientStyle (
        type: GradientTypeImpl,
        colors: number[], alphas: number[], ratios: number[],
        matrix: Matrix | null = null,
        spread_method: SpreadMethodImpl = "pad",
        interpolation_method: InterpolationMethodImpl = "rgb",
        focal_point_ratio: number = 0
    ): Graphics {

        if (!this._$doLine) {
            return this;
        }

        if (!this._$lines) {
            this._$lines = $getArray();
        }

        // setup
        for (let idx: number = 0; idx < alphas.length; ++idx) {
            this._$maxAlpha = $Math.max(this._$maxAlpha, alphas[idx]);
        }

        // beginPath
        this._$lines.push(Graphics.BEGIN_PATH);

        this._$lineType     = Graphics.GRADIENT_STROKE;
        this._$lineGradient = new GraphicsGradientFill(
            type, colors, alphas, ratios, matrix,
            spread_method, interpolation_method,
            focal_point_ratio
        );

        return this;
    }

    /**
     * @description lineTo() メソッドや drawCircle() メソッドなど、
     *              Graphics のメソッドの後続の呼び出しに使用する線スタイルを指定します。
     *              Specifies a line style used for subsequent calls
     *              to Graphics methods such as the lineTo() method
     *              or the drawCircle() method.
     *
     * @param  {number}  [thickness=NaN]
     * @param  {number|string} [color=0]
     * @param  {number}  [alpha=1]
     * @param  {string}  [caps=CapsStyle.NONE]
     * @param  {string}  [joints=JointStyle.ROUND]
     * @param  {number}  [miter_limit=3]
     * @return {Graphics}
     * @method
     * @public
     */
    lineStyle (
        thickness: number = 1,
        color: string | number = 0,
        alpha: number = 1,
        caps: CapsStyleImpl = "round",
        joints: JointStyleImpl = "round",
        miter_limit: number = 3
    ): Graphics {

        if (this._$doLine) {
            this.endLine();
        }

        if (!this._$lines) {
            this._$lines = $getArray();
        }

        color = $clamp($toColorInt(color), 0, 0xffffff, 0);
        alpha = $clamp(+alpha, 0, 1, 1);

        // setup
        this._$maxAlpha = $Math.max(this._$maxAlpha, alpha);
        this._$doLine   = true;
        this._$canDraw  = true;

        // beginPath
        if (this._$pointerX || this._$pointerY) {
            this._$lines.push(
                Graphics.BEGIN_PATH,
                Graphics.MOVE_TO,
                this._$pointerX,
                this._$pointerY
            );
        } else {
            this._$lines.push(Graphics.BEGIN_PATH);
        }

        // add Fill Style
        const object = $intToRGBA(color, alpha);

        // color
        this._$lineType   = Graphics.STROKE_STYLE;
        this._$lineStyleR = object.R;
        this._$lineStyleG = object.G;
        this._$lineStyleB = object.B;
        this._$lineStyleA = object.A;

        // param
        this._$lineWidth  = thickness;
        this._$caps       = `${caps}`;
        this._$joints     = `${joints}`;

        // set miter limit
        if (this._$joints === "miter") {
            this._$miterLimit = miter_limit;
        }

        return this;
    }

    /**
     * @description 現在の描画位置から (x, y) まで、現在の線のスタイルを使用して線を描画します。
     *              その後で、現在の描画位置は (x, y) に設定されます。
     *              Draws a line using the current line style from the current drawing position to (x, y);
     *              the current drawing position is then set to (x, y).
     *
     * @param   {number} x
     * @param   {number} y
     * @returns {Graphics}
     * @method
     * @public
     */
    lineTo (x: number, y: number): Graphics
    {
        x = +x || 0;
        y = +y || 0;

        if (this._$pointerX === x && this._$pointerY === y) {
            return this;
        }

        this._$setBounds(x, y);

        this._$margePath($getArray(Graphics.LINE_TO, x, y));

        this._$pointerX = x;
        this._$pointerY = y;

        // restart
        this._$restart();

        return this;
    }

    /**
     * @description 現在の描画位置を (x, y) に移動します。
     *              Moves the current drawing position to (x, y).
     *
     * @param   {number} x
     * @param   {number} y
     * @returns {Graphics}
     * @method
     * @public
     */
    moveTo (x: number, y: number): Graphics
    {
        x = +x || 0;
        y = +y || 0;

        this._$pointerX = x;
        this._$pointerY = y;

        this._$setBounds(x, y);

        let duplication = false;
        if (this._$doFill && this._$fills) {
            const isMove = this._$fills[this._$fills.length - 3] === Graphics.MOVE_TO;
            if (isMove) {
                duplication = true;
                this._$fills[this._$fills.length - 2] = x;
                this._$fills[this._$fills.length - 1] = y;
            }
        }

        if (this._$doLine && this._$lines) {
            const isMove = this._$lines[this._$lines.length - 3] === Graphics.MOVE_TO;
            if (isMove) {
                duplication = true;
                this._$lines[this._$lines.length - 2] = x;
                this._$lines[this._$lines.length - 1] = y;
            }
        }

        if (!duplication) {
            this._$margePath($getArray(Graphics.MOVE_TO, x, y));
        }

        // restart
        this._$restart();

        return this;
    }

    /**
     * @param  {CanvasToWebGLContext} context
     * @param  {Float32Array} matrix
     * @return {void}
     * @method
     * @private
     */
    _$clip (
        context: CanvasToWebGLContext,
        matrix: Float32Array
    ): void {

        // size
        const baseBounds: BoundsImpl = this._$getBounds();

        const bounds: BoundsImpl = $boundsMatrix(baseBounds, matrix);
        $poolBoundsObject(baseBounds);

        const width: number    = $Math.ceil($Math.abs(bounds.xMax - bounds.xMin));
        const height: number   = $Math.ceil($Math.abs(bounds.yMax - bounds.yMin));
        $poolBoundsObject(bounds);

        switch (true) {

            case width === 0:
            case height === 0:
            case width === -$Infinity:
            case height === -$Infinity:
            case width === $Infinity:
            case height === $Infinity:
                return;

            default:
                break;

        }

        context.reset();
        context.setTransform(
            matrix[0], matrix[1], matrix[2],
            matrix[3], matrix[4], matrix[5]
        );

        this._$doDraw(context, null, true);

        context.clip();
    }

    /**
     * @param  {CanvasToWebGLContext} context
     * @param  {Float32Array} matrix
     * @param  {Float32Array} color_transform
     * @param  {string} [blend_mode=BlendMode.NORMAL]
     * @param  {array}  [filters=null]
     * @return {void}
     * @method
     * @private
     */
    _$draw (
        context: CanvasToWebGLContext,
        matrix: Float32Array,
        color_transform: Float32Array,
        blend_mode: BlendModeImpl = "normal",
        filters: FilterArrayImpl | null = null
    ): void {

        if (!this._$maxAlpha) {
            return ;
        }

        const alpha: number = $clamp(
            color_transform[3] + color_transform[7] / 255, 0, 1
        );

        const displayObject: DisplayObjectImpl<any> = this._$displayObject;

        // set grid data
        let hasGrid: boolean = displayObject._$scale9Grid !== null;

        // 9スライスを有効にしたオブジェクトが回転・傾斜成分を含む場合は
        // 9スライスは無効になる
        const rawMatrix: Float32Array = displayObject._$transform._$rawMatrix();
        if (hasGrid) {
            hasGrid = hasGrid
                && $Math.abs(rawMatrix[1]) < 0.001
                && $Math.abs(rawMatrix[2]) < 0.0001;
        }

        // size
        const baseBounds: BoundsImpl = this._$getBounds();
        const bounds: BoundsImpl = $boundsMatrix(baseBounds, matrix);
        const xMax: number = bounds.xMax;
        const xMin: number = bounds.xMin;
        const yMax: number = bounds.yMax;
        const yMin: number = bounds.yMin;
        $poolBoundsObject(bounds);

        const width: number  = $Math.ceil($Math.abs(xMax - xMin));
        const height: number = $Math.ceil($Math.abs(yMax - yMin));
        switch (true) {

            case width === 0:
            case height === 0:
            case width === -$Infinity:
            case height === -$Infinity:
            case width === $Infinity:
            case height === $Infinity:
                return;

            default:
                break;

        }

        let xScale: number = +$Math.sqrt(
            matrix[0] * matrix[0]
            + matrix[1] * matrix[1]
        );
        if (!$Number.isInteger(xScale)) {
            const value: string = xScale.toString();
            const index: number = value.indexOf("e");
            if (index !== -1) {
                xScale = +value.slice(0, index);
            }
            xScale = +xScale.toFixed(4);
        }

        let yScale: number = +$Math.sqrt(
            matrix[2] * matrix[2]
            + matrix[3] * matrix[3]
        );
        if (!$Number.isInteger(yScale)) {
            const value: string = yScale.toString();
            const index: number = value.indexOf("e");
            if (index !== -1) {
                yScale = +value.slice(0, index);
            }
            yScale = +yScale.toFixed(4);
        }

        const canApply: boolean = filters !== null
            && filters.length > 0
            && displayObject._$canApply(filters);

        let filterBounds: BoundsImpl = $getBoundsObject(0, width, 0, height);
        if (canApply && filters) {
            for (let idx: number = 0; idx < filters.length ; ++idx) {
                filterBounds = filters[idx]
                    ._$generateFilterRect(filterBounds, xScale, yScale);
            }
        }

        // cache current buffer
        const manager: FrameBufferManager = context.frameBuffer;
        const currentAttachment: AttachmentImpl | null = manager.currentAttachment;
        if (!currentAttachment
            || xMin - filterBounds.xMin > currentAttachment.width
            || yMin - filterBounds.yMin > currentAttachment.height
        ) {
            $poolBoundsObject(filterBounds);
            return;
        }

        if (0 > xMin + filterBounds.xMax || 0 > yMin + filterBounds.yMax) {
            $poolBoundsObject(filterBounds);
            return;
        }

        $poolBoundsObject(filterBounds);

        // get cache
        if (this._$uniqueKey === "") {
            if (!hasGrid
                && displayObject._$loaderInfo
                && displayObject._$characterId
            ) {
                this._$uniqueKey = `${displayObject._$loaderInfo._$id}@${this._$bitmapId || displayObject._$characterId}`;
            } else {
                this._$uniqueKey = this._$createCacheKey();
            }
        }

        const player: Player = $currentPlayer();

        if (this._$mode === "bitmap") {

            if (!this._$cacheKeys.length) {
                this._$cacheKeys = $cacheStore.generateKeys(this._$uniqueKey);
            }

        } else {

            if (!this._$cacheKeys.length
                || this._$cacheParams[0] !== xScale
                || this._$cacheParams[1] !== yScale
                || this._$cacheParams[2] !== color_transform[7]
            ) {

                const keys: number[] = $getArray();
                keys[0] = xScale;
                keys[1] = yScale;

                this._$cacheKeys = $cacheStore.generateKeys(
                    this._$uniqueKey, keys, color_transform
                );

                $poolArray(keys);

                this._$cacheParams[0] = xScale;
                this._$cacheParams[1] = yScale;
                this._$cacheParams[2] = color_transform[7];
            }
        }

        context.cachePosition = $cacheStore.get(this._$cacheKeys);
        if (!context.cachePosition) {

            const currentAttachment: AttachmentImpl | null = manager.currentAttachment;

            if (currentAttachment && currentAttachment.mask) {
                context.stopStencil();
            }

            let width: number  = 0;
            let height: number = 0;
            if (this._$mode === "shape") {

                width  = $Math.ceil($Math.abs(baseBounds.xMax - baseBounds.xMin) * xScale);
                height = $Math.ceil($Math.abs(baseBounds.yMax - baseBounds.yMin) * yScale);

                // resize
                const textureScale: number = context._$getTextureScale(width, height);
                if (textureScale < 1) {
                    width  *= textureScale;
                    height *= textureScale;
                }

            } else {
                width  = $Math.ceil($Math.abs(baseBounds.xMax - baseBounds.xMin));
                height = $Math.ceil($Math.abs(baseBounds.yMax - baseBounds.yMin));
            }

            // create cache position
            context.cachePosition = manager.createCachePosition(width, height);
            context.bindRenderBuffer(context.cachePosition);

            // reset
            context.reset();

            if (this._$mode === "shape") {
                context.setTransform(
                    xScale, 0, 0, yScale,
                    -baseBounds.xMin * xScale,
                    -baseBounds.yMin * yScale
                );
            } else {
                context.setTransform(
                    1, 0, 0, 1,
                    -baseBounds.xMin,
                    -baseBounds.yMin
                );
            }

            if (hasGrid) {

                const mScale: number = player.scaleX;

                const baseMatrix: Float32Array = $getFloat32Array6(
                    mScale, 0, 0, mScale, 0, 0
                );

                const pMatrix: Float32Array = $multiplicationMatrix(
                    baseMatrix, rawMatrix
                );

                $poolFloat32Array6(baseMatrix);

                const aMatrixBase: Float32Array = displayObject
                    ._$parent
                    ._$transform
                    .concatenatedMatrix
                    ._$matrix;

                const aMatrix: Float32Array = $getFloat32Array6(
                    aMatrixBase[0], aMatrixBase[1], aMatrixBase[2], aMatrixBase[3],
                    aMatrixBase[4] * mScale - xMin,
                    aMatrixBase[5] * mScale - yMin
                );
                $poolFloat32Array6(aMatrixBase);

                const apMatrix: Float32Array = $multiplicationMatrix(
                    aMatrix, pMatrix
                );
                const aOffsetX: number = apMatrix[4] - (matrix[4] - xMin);
                const aOffsetY: number = apMatrix[5] - (matrix[5] - yMin);
                $poolFloat32Array6(apMatrix);

                const parentBounds: BoundsImpl = $boundsMatrix(baseBounds, pMatrix);
                const parentXMax: number   = +parentBounds.xMax;
                const parentXMin: number   = +parentBounds.xMin;
                const parentYMax: number   = +parentBounds.yMax;
                const parentYMin: number   = +parentBounds.yMin;
                const parentWidth: number  = $Math.ceil($Math.abs(parentXMax - parentXMin));
                const parentHeight: number = $Math.ceil($Math.abs(parentYMax - parentYMin));

                $poolBoundsObject(parentBounds);

                const scale9Grid: Rectangle = displayObject._$scale9Grid as NonNullable<Rectangle>;
                const grid: GridImpl = {
                    "x": scale9Grid.x,
                    "y": scale9Grid.y,
                    "w": scale9Grid.width,
                    "h": scale9Grid.height
                };

                context.grid.enable(
                    parentXMin, parentYMin, parentWidth, parentHeight,
                    baseBounds, grid, mScale,
                    pMatrix[0], pMatrix[1], pMatrix[2], pMatrix[3], pMatrix[4], pMatrix[5],
                    aMatrix[0], aMatrix[1], aMatrix[2], aMatrix[3], aMatrix[4] - aOffsetX, aMatrix[5] - aOffsetY
                );

                $poolFloat32Array6(pMatrix);
                $poolFloat32Array6(aMatrix);
            }

            // execute
            this._$doDraw(context, color_transform, false);

            if (hasGrid) {
                context.grid.disable();
            }

            manager.transferTexture(context.cachePosition);

            // set cache
            $cacheStore.set(this._$cacheKeys, context.cachePosition);

            // end draw and reset current buffer
            context._$bind(currentAttachment);
        }

        let offsetX: number = 0;
        let offsetY: number = 0;
        if (canApply) {

            const bitmapTexture: WebGLTexture | null = this._$createBitmapTexture(
                context, context.cachePosition,
                xScale, yScale, width, height
            );

            const position: CachePositionImpl = displayObject._$drawFilter(
                context, matrix, filters,
                width, height, bitmapTexture
            );

            if (position.offsetX) {
                offsetX = position.offsetX;
            }

            if (position.offsetY) {
                offsetY = position.offsetY;
            }

            // update
            context.cachePosition = position;
        }

        if (!canApply && this._$mode === "bitmap") {

            context.setTransform(
                matrix[0], matrix[1],
                matrix[2], matrix[3],
                baseBounds.xMin * matrix[0] + baseBounds.yMin * matrix[2] + matrix[4],
                baseBounds.xMin * matrix[1] + baseBounds.yMin * matrix[3] + matrix[5]
            );

        } else {

            const radianX: number = $Math.atan2(matrix[1], matrix[0]);
            const radianY: number = $Math.atan2(-matrix[2], matrix[3]);
            if (!canApply && (radianX || radianY)) {

                const tx: number = baseBounds.xMin * xScale;
                const ty: number = baseBounds.yMin * yScale;

                const cosX: number = $Math.cos(radianX);
                const sinX: number = $Math.sin(radianX);
                const cosY: number = $Math.cos(radianY);
                const sinY: number = $Math.sin(radianY);

                context.setTransform(
                    cosX, sinX, -sinY, cosY,
                    tx * cosX - ty * sinY + matrix[4],
                    tx * sinX + ty * cosY + matrix[5]
                );

            } else {

                context.setTransform(1, 0, 0, 1,
                    xMin - offsetX, yMin - offsetY
                );

            }
        }

        // draw
        if (context.cachePosition) {

            context.globalAlpha = alpha;
            context.imageSmoothingEnabled = this._$mode === "shape";
            context.globalCompositeOperation = blend_mode;

            context.drawInstance(
                xMin - offsetX, yMin - offsetY, xMax, yMax,
                color_transform
            );

            // cache position clear
            context.cachePosition = null;
        }

        // pool
        $poolBoundsObject(baseBounds);
    }

    /**
     * @return {WebGLTexture | null}
     * @method
     * @private
     */
    _$createBitmapTexture (
        context: CanvasToWebGLContext,
        position: CachePositionImpl,
        x_scale: number,
        y_scale: number,
        width: number,
        height: number
    ): WebGLTexture | null {

        if (this._$mode !== "bitmap") {
            return null;
        }

        context.drawInstacedArray();

        const manager: FrameBufferManager = context.frameBuffer;
        const currentAttachment: AttachmentImpl | null = manager.currentAttachment;

        const attachment: AttachmentImpl = manager
            .createCacheAttachment(width, height);

        context._$bind(attachment);

        context.reset();

        const parentMatrix: Float32Array = $getFloat32Array6(
            x_scale, 0, 0, y_scale,
            width / 2, height / 2
        );

        const texture: WebGLTexture = context.getTextureFromRect(position);

        const baseMatrix: Float32Array = $getFloat32Array6(
            1, 0, 0, 1,
            -texture.width / 2,
            -texture.height / 2
        );

        const scaleMatrix = $multiplicationMatrix(
            parentMatrix, baseMatrix
        );
        $poolFloat32Array6(parentMatrix);
        $poolFloat32Array6(baseMatrix);

        context.setTransform(
            scaleMatrix[0], scaleMatrix[1],
            scaleMatrix[2], scaleMatrix[3],
            scaleMatrix[4], scaleMatrix[5]
        );

        context.drawImage(texture, 0, 0, texture.width, texture.height);

        const bitmapTexture: WebGLTexture = manager.getTextureFromCurrentAttachment();
        context._$bind(currentAttachment);

        manager.releaseAttachment(attachment);
        manager.textureManager.release(texture);

        return bitmapTexture;
    }

    /**
     * @param  {CanvasToWebGLContext} context
     * @param  {Float32Array}         [color_transform=null]
     * @param  {boolean}              [is_clip=false]
     * @return {void}
     * @method
     * @private
     */
    _$doDraw (
        context: CanvasToWebGLContext,
        color_transform: Float32Array | null = null,
        is_clip: boolean = false
    ): void {

        // draw
        context.reset();
        context.beginPath();
        this._$runCommand(context, color_transform, is_clip);
    }

    /**
     * @param  {CanvasRenderingContext2D} context
     * @param  {Float32Array} matrix
     * @param  {object}  options
     * @param  {boolean} [is_clip=false]
     * @return {boolean}
     * @method
     * @private
     */
    _$hit (
        context: CanvasRenderingContext2D,
        matrix: Float32Array,
        options: PlayerHitObjectImpl,
        is_clip: boolean = false
    ): boolean {

        context.beginPath();
        context.setTransform(
            matrix[0], matrix[1], matrix[2],
            matrix[3], matrix[4], matrix[5]
        );
        return this._$runCommand(context, null, is_clip, options);
    }

    /**
     * @return {object}
     * @method
     * @private
     */
    _$getBounds (): BoundsImpl
    {
        const displayObject: DisplayObjectImpl<any> = this._$displayObject;
        if (displayObject && displayObject._$bounds) {
            return $getBoundsObject(
                displayObject._$bounds.xMin, displayObject._$bounds.xMax,
                displayObject._$bounds.yMin, displayObject._$bounds.yMax
            );
        }

        return $getBoundsObject(
            this._$xMin, this._$xMax,
            this._$yMin, this._$yMax
        );
    }

    /**
     * @return {void}
     * @method
     * @private
     */
    _$restart (): void
    {
        if (this._$displayObject) {

            // reset
            this._$displayObject._$posted = false;

            if (!this._$displayObject._$isUpdated()) {

                this._$displayObject._$doChanged();
                $doUpdated();

                $cacheStore.removeCache(this._$displayObject._$instanceId);

                if (this._$displayObject._$characterId) {
                    $cacheStore.removeCache(this._$displayObject._$characterId);
                }
            }
        }
    }

    /**
     * @param  {number} [x=0]
     * @param  {number} [y=0]
     * @return {void}
     * @method
     * @private
     */
    _$setBounds (x: number = 0, y: number = 0): void
    {
        this._$setFillBounds(x, y);
        if (this._$doLine) {
            this._$setLineBounds(x, y);
        }
    }

    /**
     * @param  {number} x
     * @param  {number} y
     * @return {void}
     * @method
     * @private
     */
    _$setFillBounds (x: number = 0, y: number = 0): void
    {
        this._$xMin = $Math.min(this._$xMin, x);
        this._$xMax = $Math.max(this._$xMax, x);
        this._$yMin = $Math.min(this._$yMin, y);
        this._$yMax = $Math.max(this._$yMax, y);
    }

    /**
     * @param  {number} x
     * @param  {number} y
     * @return {void}
     * @method
     * @private
     */
    _$setLineBounds (x: number = 0, y: number = 0): void
    {
        this._$xMin = $Math.min(this._$xMin, $Math.min(x, this._$pointerX));
        this._$xMax = $Math.max(this._$xMax, $Math.max(x, this._$pointerX));
        this._$yMin = $Math.min(this._$yMin, $Math.min(y, this._$pointerY));
        this._$yMax = $Math.max(this._$yMax, $Math.max(y, this._$pointerY));

        // correction
        const half: number     = this._$lineWidth / 2;
        const radian90: number = 0.5 * $Math.PI;
        const radian1: number  = $Math.atan2(y - this._$pointerY, x - this._$pointerX); // to end point
        const radian2: number  = $Math.atan2(this._$pointerY - y, this._$pointerX - x); // to start point
        const radian3: number  = radian1 + radian90;
        const radian4: number  = radian1 - radian90;
        const radian5: number  = radian2 + radian90;
        const radian6: number  = radian2 - radian90;

        // init
        let x1: number = x + half;
        let x2: number = -half + x;
        let x3: number = this._$pointerX + half;
        let x4: number = -half + this._$pointerX;
        let y1: number = y + half;
        let y2: number = -half + y;
        let y3: number = this._$pointerY + half;
        let y4: number = -half + this._$pointerY;

        this._$xMin = $Math.min(this._$xMin, $Math.min(x1, $Math.min(x2, $Math.min(x3, x4))));
        this._$xMax = $Math.max(this._$xMax, $Math.max(x1, $Math.max(x2, $Math.max(x3, x4))));
        this._$yMin = $Math.min(this._$yMin, $Math.min(y1, $Math.min(y2, $Math.min(y3, y4))));
        this._$yMax = $Math.max(this._$yMax, $Math.max(y1, $Math.max(y2, $Math.max(y3, y4))));

        // pointer x
        if ($Math.abs(radian3) % radian90 !== 0) {
            x1 = x + $Math.cos(radian3) * half;
        }

        if ($Math.abs(radian4) % radian90 !== 0) {
            x2 = x + $Math.cos(radian4) * half;
        }

        if ($Math.abs(radian5) % radian90 !== 0) {
            x3 = this._$pointerX + $Math.cos(radian5) * half;
        }

        if ($Math.abs(radian6) % radian90 !== 0) {
            x4 = this._$pointerX + $Math.cos(radian6) * half;
        }

        // pointer y
        if (radian3 && $Math.abs(radian3) % $Math.PI !== 0) {
            y1 = y + $Math.sin(radian3) * half;
        }

        if (radian4 && $Math.abs(radian4) % $Math.PI !== 0) {
            y2 = y + $Math.sin(radian4) * half;
        }

        if (radian5 && $Math.abs(radian5) % $Math.PI !== 0) {
            y3 = this._$pointerY + $Math.sin(radian5) * half;
        }

        if (radian6 && $Math.abs(radian6) % $Math.PI !== 0) {
            y4 = this._$pointerY + $Math.sin(radian6) * half;
        }

        this._$xMin = $Math.min(this._$xMin, $Math.min(x1, $Math.min(x2, $Math.min(x3, x4))));
        this._$xMax = $Math.max(this._$xMax, $Math.max(x1, $Math.max(x2, $Math.max(x3, x4))));
        this._$yMin = $Math.min(this._$yMin, $Math.min(y1, $Math.min(y2, $Math.min(y3, y4))));
        this._$yMax = $Math.max(this._$yMax, $Math.max(y1, $Math.max(y2, $Math.max(y3, y4))));

        // case
        switch (this._$caps) {

            case "round":

                if ($Math.abs(radian1) % radian90 !== 0) {
                    const rx1: number = x + $Math.cos(radian1) * half;
                    this._$xMin = $Math.min(this._$xMin, rx1);
                    this._$xMax = $Math.max(this._$xMax, rx1);
                }

                if (radian1 && $Math.abs(radian1) % $Math.PI !== 0) {
                    const ry1: number = y + $Math.sin(radian1) * half;
                    this._$yMin = $Math.min(this._$yMin, ry1);
                    this._$yMax = $Math.max(this._$yMax, ry1);
                }

                if ($Math.abs(radian2) % radian90 !== 0) {
                    const rx2: number = this._$pointerX + $Math.cos(radian2) * half;
                    this._$xMin = $Math.min(this._$xMin, rx2);
                    this._$xMax = $Math.max(this._$xMax, rx2);
                }

                if (radian2 && $Math.abs(radian2) % $Math.PI !== 0) {
                    const ry2: number = this._$pointerY + $Math.sin(radian2) * half;
                    this._$yMin = $Math.min(this._$yMin, ry2);
                    this._$yMax = $Math.max(this._$yMax, ry2);
                }

                break;

            case "square":

                if ($Math.abs(radian1) % radian90 !== 0) {
                    const r1cos: number = $Math.cos(radian1) * half;
                    const rx1: number = x1 + r1cos;
                    const rx2: number = x2 + r1cos;
                    this._$xMin = $Math.min(this._$xMin, $Math.min(rx1, rx2));
                    this._$xMax = $Math.max(this._$xMax, $Math.max(rx1, rx2));
                }

                if ($Math.abs(radian2) % radian90 !== 0) {
                    const r2cos: number = $Math.cos(radian2) * half;
                    const rx3: number = x3 + r2cos;
                    const rx4: number = x4 + r2cos;
                    this._$xMin = $Math.min(this._$xMin, $Math.min(rx3, rx4));
                    this._$xMax = $Math.max(this._$xMax, $Math.max(rx3, rx4));
                }

                if (radian1 && $Math.abs(radian1) % $Math.PI !== 0) {
                    const r1sin: number = $Math.sin(radian1) * half;
                    const ry1: number = y1 + r1sin;
                    const ry2: number = y2 + r1sin;
                    this._$yMin = $Math.min(this._$yMin, $Math.min(ry1, ry2));
                    this._$yMax = $Math.max(this._$yMax, $Math.max(ry1, ry2));
                }

                if (radian2 && $Math.abs(radian2) % $Math.PI !== 0) {
                    const r2sin: number = $Math.sin(radian2) * half;
                    const ry3: number = y3 + r2sin;
                    const ry4: number = y4 + r2sin;
                    this._$yMin = $Math.min(this._$yMin, $Math.min(ry3, ry4));
                    this._$yMax = $Math.max(this._$yMax, $Math.max(ry3, ry4));
                }

                break;

            default:
                break;

        }
    }

    /**
     * @param {array} data
     * @method
     * @private
     */
    _$margePath (data: any[]): void
    {
        if (this._$doFill && this._$fills) {
            this._$fills.push(...data);
        }

        if (this._$doLine && this._$lines) {
            this._$lines.push(...data);
        }

        $poolArray(data);
    }

    /**
     * @return {string}
     * @method
     * @private
     */
    _$createCacheKey (): string
    {
        if (this._$doLine) {
            this.endLine();
        }

        // fixed logic
        if (this._$doFill) {
            this.endFill();
        }

        if (!this._$recode) {
            return "";
        }

        const recodes: Float32Array = this._$getRecodes();

        let hash = 0;
        for (let idx: number = 0; idx < recodes.length; idx++) {

            const chr: number = recodes[idx];

            hash  = (hash << 5) - hash + chr;
            hash |= 0;
        }

        return `${hash}`;
    }

    /**
     * @return {Float32Array}
     * @method
     * @private
     */
    _$getRecodes (): Float32Array
    {
        // fixed logic
        if (this._$doLine) {
            this.endLine();
        }

        // fixed logic
        if (this._$doFill) {
            this.endFill();
        }

        if (!this._$recode) {
            this._$recode = $getArray();
        }

        if (!this._$buffer) {

            const array: number[] = $getArray();

            const recode: any[] = this._$recode;
            for (let idx: number = 0; idx < recode.length;) {

                const type: number = recode[idx++];
                array.push(type);
                switch (type) {

                    case Graphics.BEGIN_PATH:
                    case Graphics.END_FILL:
                    case Graphics.END_STROKE:
                    case Graphics.CLOSE_PATH:
                        break;

                    case Graphics.MOVE_TO:
                    case Graphics.LINE_TO:
                        array.push(recode[idx++], recode[idx++]);
                        break;

                    case Graphics.CURVE_TO:
                    case Graphics.FILL_STYLE:
                        array.push(
                            recode[idx++], recode[idx++],
                            recode[idx++], recode[idx++]
                        );
                        break;

                    case Graphics.CUBIC:
                        array.push(
                            recode[idx++], recode[idx++],
                            recode[idx++], recode[idx++],
                            recode[idx++], recode[idx++]
                        );
                        break;

                    case Graphics.STROKE_STYLE:
                        {
                            array.push(recode[idx++]);

                            const lineCap = recode[idx++];
                            switch (lineCap) {

                                case "none":
                                    array.push(0);
                                    break;

                                case "round":
                                    array.push(1);
                                    break;

                                case "square":
                                    array.push(2);
                                    break;

                            }

                            const lineJoin = recode[idx++];
                            switch (lineJoin) {

                                case "bevel":
                                    array.push(0);
                                    break;

                                case "miter":
                                    array.push(1);
                                    break;

                                case "round":
                                    array.push(2);
                                    break;

                            }

                            array.push(
                                recode[idx++], // MITER LIMIT
                                recode[idx++], recode[idx++],
                                recode[idx++], recode[idx++]
                            );
                        }
                        break;

                    case Graphics.ARC:
                        array.push(recode[idx++], recode[idx++], recode[idx++]);
                        break;

                    case Graphics.GRADIENT_FILL:
                        {
                            const type: GradientTypeImpl = recode[idx++];
                            const stops: ColorStopImpl[] = recode[idx++];
                            const matrix: Float32Array = recode[idx++];
                            const spread: SpreadMethodImpl = recode[idx++];
                            const interpolation: InterpolationMethodImpl = recode[idx++];
                            const focal: number = recode[idx++];

                            array.push(type === "linear" ? 0 : 1);

                            array.push(stops.length);
                            for (let idx: number = 0; idx < stops.length; ++idx) {
                                const color: ColorStopImpl = stops[idx];
                                array.push(
                                    color.ratio,
                                    color.R,
                                    color.G,
                                    color.B,
                                    color.A
                                );
                            }

                            array.push(
                                matrix[0], matrix[1], matrix[2],
                                matrix[3], matrix[4], matrix[5]
                            );

                            switch (spread) {

                                case "reflect":
                                    array.push(0);
                                    break;

                                case "repeat":
                                    array.push(1);
                                    break;

                                default:
                                    array.push(2);
                                    break;

                            }

                            array.push(
                                interpolation === "linearRGB" ? 0 : 1
                            );

                            array.push(focal);
                        }
                        break;

                    case Graphics.GRADIENT_STROKE:
                        {
                            array.push(recode[idx++]);

                            const lineCap: CapsStyleImpl = recode[idx++];
                            switch (lineCap) {

                                case "none":
                                    array.push(0);
                                    break;

                                case "round":
                                    array.push(1);
                                    break;

                                case "square":
                                    array.push(2);
                                    break;

                            }

                            const lineJoin: JointStyleImpl = recode[idx++];
                            switch (lineJoin) {

                                case "bevel":
                                    array.push(0);
                                    break;

                                case "miter":
                                    array.push(1);
                                    break;

                                case "round":
                                    array.push(2);
                                    break;

                            }

                            // miterLimit
                            array.push(recode[idx++]);

                            const type: GradientTypeImpl = recode[idx++];
                            const stops: ColorStopImpl[] = recode[idx++];
                            const matrix: Float32Array = recode[idx++];
                            const spread: SpreadMethodImpl = recode[idx++];
                            const interpolation: InterpolationMethodImpl = recode[idx++];
                            const focal: number = recode[idx++];

                            array.push(type === "linear" ? 0 : 1);

                            array.push(stops.length);
                            for (let idx: number = 0; idx < stops.length; ++idx) {
                                const color: ColorStopImpl = stops[idx];
                                array.push(
                                    color.ratio,
                                    color.R,
                                    color.G,
                                    color.B,
                                    color.A
                                );
                            }

                            array.push(
                                matrix[0], matrix[1], matrix[2],
                                matrix[3], matrix[4], matrix[5]
                            );

                            switch (spread) {

                                case "reflect":
                                    array.push(0);
                                    break;

                                case "repeat":
                                    array.push(1);
                                    break;

                                default:
                                    array.push(2);
                                    break;

                            }

                            array.push(
                                interpolation === "linearRGB" ? 0 : 1
                            );

                            array.push(focal);
                        }
                        break;

                    case Graphics.BITMAP_FILL:
                        {
                            const bitmapData: BitmapData = recode[idx++];

                            let buffer: Uint8Array;
                            if (bitmapData.image !== null || bitmapData.canvas !== null) {

                                const canvas: HTMLCanvasElement = $cacheStore.getCanvas();

                                const width: number  = bitmapData.width;
                                const height: number = bitmapData.height;
                                canvas.width  = width;
                                canvas.height = height;

                                const context: CanvasRenderingContext2D | null = canvas.getContext("2d");
                                if (!context) {
                                    throw new Error("the context is null.");
                                }

                                // @ts-ignore
                                context.drawImage(bitmapData.image || bitmapData.canvas, 0, 0);

                                buffer = new Uint8Array(
                                    context.getImageData(0, 0, width, height).data
                                );

                                $cacheStore.destroy(context);

                            } else if (bitmapData._$buffer !== null) {
                                buffer = bitmapData._$buffer;
                            } else {
                                break;
                            }

                            array.push(
                                bitmapData.width,
                                bitmapData.height,
                                this._$xMax - this._$xMin,
                                this._$yMax - this._$yMin,
                                buffer.length
                            );

                            for (let idx: number = 0; idx < buffer.length; ++idx) {
                                array.push(buffer[idx]);
                            }

                            const matrix: Float32Array = recode[idx++];
                            if (matrix) {
                                array.push(
                                    matrix[0], matrix[1], matrix[2],
                                    matrix[3], matrix[4], matrix[5]
                                );
                            } else {
                                array.push(1, 0, 0, 1, 0, 0);
                            }

                            const repeat: boolean = recode[idx++];
                            array.push(repeat ? 1 : 0);

                            const smooth: boolean = recode[idx++];
                            array.push(smooth ? 1 : 0);
                        }
                        break;

                    case Graphics.BITMAP_STROKE:
                        {

                            array.push(recode[idx++]);

                            const lineCap: CapsStyleImpl = recode[idx++];
                            switch (lineCap) {

                                case "none":
                                    array.push(0);
                                    break;

                                case "round":
                                    array.push(1);
                                    break;

                                case "square":
                                    array.push(2);
                                    break;

                            }

                            const lineJoin: JointStyleImpl = recode[idx++];
                            switch (lineJoin) {

                                case "bevel":
                                    array.push(0);
                                    break;

                                case "miter":
                                    array.push(1);
                                    break;

                                case "round":
                                    array.push(2);
                                    break;

                            }

                            // MITER LIMIT
                            array.push(recode[idx++]);

                            const bitmapData: BitmapData = recode[idx++];

                            let buffer: Uint8Array;
                            if (bitmapData.image !== null || bitmapData.canvas !== null) {

                                const canvas: HTMLCanvasElement = $cacheStore.getCanvas();

                                const width: number  = bitmapData.width;
                                const height: number = bitmapData.height;
                                canvas.width  = width;
                                canvas.height = height;

                                const context: CanvasRenderingContext2D | null = canvas.getContext("2d");
                                if (!context) {
                                    throw new Error("the context is null.");
                                }

                                // @ts-ignore
                                context.drawImage(bitmapData.image || bitmapData.canvas, 0, 0);

                                buffer = new Uint8Array(
                                    context.getImageData(0, 0, width, height).data
                                );

                                $cacheStore.destroy(context);

                            } else if (bitmapData._$buffer !== null) {
                                buffer = bitmapData._$buffer;
                            } else {
                                break;
                            }

                            array.push(
                                bitmapData.width,
                                bitmapData.height,
                                this._$xMax - this._$xMin,
                                this._$yMax - this._$yMin,
                                buffer.length
                            );

                            for (let idx: number = 0; idx < buffer.length; ++idx) {
                                array.push(buffer[idx]);
                            }

                            const matrix: Float32Array = recode[idx++];
                            if (matrix) {
                                array.push(
                                    matrix[0], matrix[1], matrix[2],
                                    matrix[3], matrix[4], matrix[5]
                                );
                            } else {
                                array.push(1, 0, 0, 1, 0, 0);
                            }

                            const repeat: boolean = recode[idx++];
                            array.push(repeat ? 1 : 0);

                            const smooth: boolean = recode[idx++];
                            array.push(smooth ? 1 : 0);
                        }
                        break;

                    default:
                        break;

                }
            }

            this._$buffer = new $Float32Array(array);
        }

        return this._$buffer.slice();
    }

    /**
     * @param  {CanvasToWebGLContext|CanvasRenderingContext2D} context
     * @param  {Float32Array} [color_transform=null]
     * @param  {boolean}      [is_clip=false]
     * @param  {object}       [options=null]
     * @return {boolean}
     * @method
     * @private
     */
    _$runCommand (
        context: CanvasToWebGLContext | CanvasRenderingContext2D,
        color_transform: Float32Array | null = null,
        is_clip: boolean = false,
        options: PlayerHitObjectImpl | null = null
    ) {
        // fixed logic
        if (this._$doLine) {
            this.endLine();
        }

        // fixed logic
        if (this._$doFill) {
            this.endFill();
        }

        if (!this._$recode) {
            return false;
        }

        const recode: any[] = this._$recode;
        const length = recode.length;
        for (let idx = 0; idx < length; ) {
            switch (recode[idx++]) {

                case Graphics.BEGIN_PATH:
                    context.beginPath();
                    break;

                case Graphics.MOVE_TO:
                    context.moveTo(recode[idx++], recode[idx++]);
                    break;

                case Graphics.LINE_TO:
                    context.lineTo(recode[idx++], recode[idx++]);
                    break;

                case Graphics.CURVE_TO:
                    context.quadraticCurveTo(
                        recode[idx++], recode[idx++],
                        recode[idx++], recode[idx++]
                    );
                    break;

                case Graphics.FILL_STYLE:
                    {
                        if (is_clip || options) {
                            idx += 4;
                            continue;
                        }

                        const color: Float32Array = $getFloat32Array4();
                        color[0] = recode[idx++] / 255;
                        color[1] = recode[idx++] / 255;
                        color[2] = recode[idx++] / 255;
                        color[3] = recode[idx++] / 255;

                        if (color_transform !== null) {
                            if (color_transform[7] !== 0) {
                                color[3] = $Math.max(0, $Math.min(
                                    color[3] * color_transform[7], 255)
                                ) / 255;
                            }
                        }

                        context.fillStyle = color;
                    }
                    break;

                case Graphics.END_FILL:

                    if (options && "isPointInPath" in context
                        && context.isPointInPath(options.x, options.y)
                    ) {
                        return true;
                    }

                    if (!is_clip && !options) {
                        context.fill();
                    }

                    break;

                case Graphics.STROKE_STYLE:
                    {
                        if (is_clip || options) {
                            idx += 8;
                            continue;
                        }

                        context.lineWidth  = recode[idx++];
                        context.lineCap    = recode[idx++];
                        context.lineJoin   = recode[idx++];
                        context.miterLimit = recode[idx++];

                        const color = $getFloat32Array4();

                        color[0] = recode[idx++] / 255;
                        color[1] = recode[idx++] / 255;
                        color[2] = recode[idx++] / 255;
                        color[3] = recode[idx++] / 255;

                        if (color_transform !== null) {
                            if (color_transform[7] !== 0) {
                                color[3] = $Math.max(0, $Math.min(
                                    color[3] + color_transform[7], 255)
                                ) / 255;
                            }
                        }

                        context.strokeStyle = color;
                    }
                    break;

                case Graphics.END_STROKE:

                    if (options && "isPointInStroke" in context
                        && context.isPointInStroke(options.x, options.y)
                    ) {
                        return true;
                    }

                    if (!is_clip && !options) {
                        context.stroke();
                    }

                    break;

                case Graphics.CLOSE_PATH:
                    context.closePath();
                    break;

                case Graphics.CUBIC:
                    context.bezierCurveTo(
                        recode[idx++], recode[idx++],
                        recode[idx++], recode[idx++],
                        recode[idx++], recode[idx++]
                    );
                    break;

                case Graphics.ARC:
                    context.arc(
                        recode[idx++], recode[idx++], recode[idx++],
                        0, 2 * $Math.PI
                    );
                    break;

                case Graphics.GRADIENT_FILL:
                    {
                        if (options && "isPointInPath" in context
                            && context.isPointInPath(options.x, options.y)
                        ) {
                            return true;
                        }

                        if (is_clip || options
                            || context instanceof CanvasRenderingContext2D // fixed logic
                        ) {
                            idx += 6;
                            continue;
                        }

                        const type: GradientTypeImpl = recode[idx++];
                        const stops: ColorStopImpl[] = recode[idx++];
                        const matrix: Float32Array = recode[idx++];
                        const spread: SpreadMethodImpl = recode[idx++];
                        const interpolation: InterpolationMethodImpl = recode[idx++];
                        const focal: number = recode[idx++];

                        let css: CanvasGradientToWebGL;
                        if (type === "linear") {

                            const xy: Float32Array = $linearGradientXY(matrix);
                            css = context.createLinearGradient(
                                xy[0], xy[1], xy[2], xy[3],
                                interpolation, spread
                            );

                        } else {

                            context.save();
                            context.transform(
                                matrix[0], matrix[1], matrix[2],
                                matrix[3], matrix[4], matrix[5]
                            );

                            css = context.createRadialGradient(
                                0, 0, 0, 0, 0, 819.2,
                                interpolation, spread, focal
                            );

                        }

                        for (let idx: number = 0; idx < stops.length; ++idx) {

                            const color: ColorStopImpl = stops[idx];

                            let alpha: number = color.A;
                            if (color_transform) {
                                if (color_transform[7] !== 0) {
                                    alpha = $Math.max(0, $Math.min(color.A + color_transform[7], 255)) | 0;
                                }
                            }

                            css.addColorStop(color.ratio, $getInt32Array4(
                                color.R, color.G, color.B, alpha
                            ));

                        }

                        context.fillStyle = css;
                        context.fill();

                        if (type === "radial") {
                            context.restore();
                        }
                    }
                    break;

                case Graphics.GRADIENT_STROKE:
                    {
                        if (options && "isPointInStroke" in context
                            && context.isPointInStroke(options.x, options.y)
                        ) {
                            return true;
                        }

                        if (is_clip || options
                            || context instanceof CanvasRenderingContext2D // fixed logic
                        ) {
                            idx += 12;
                            continue;
                        }

                        context.lineWidth  = recode[idx++];
                        context.lineCap    = recode[idx++];
                        context.lineJoin   = recode[idx++];
                        context.miterLimit = recode[idx++];

                        const type: GradientTypeImpl = recode[idx++];
                        const stops: ColorStopImpl[] = recode[idx++];
                        const matrix: Float32Array = recode[idx++];
                        const spread: SpreadMethodImpl = recode[idx++];
                        const interpolation: InterpolationMethodImpl = recode[idx++];
                        const focal: number = recode[idx++];

                        let css: CanvasGradientToWebGL;
                        if (type === "linear") {

                            const xy: Float32Array = $linearGradientXY(matrix);
                            css = context.createLinearGradient(
                                xy[0], xy[1], xy[2], xy[3],
                                interpolation, spread
                            );

                        } else {

                            context.save();
                            context.transform(
                                matrix[0], matrix[1], matrix[2],
                                matrix[3], matrix[4], matrix[5]
                            );

                            css = context.createRadialGradient(
                                0, 0, 0, 0, 0, 819.2,
                                interpolation, spread, focal
                            );

                        }

                        for (let idx = 0; idx < stops.length; ++idx) {

                            const color: ColorStopImpl = stops[idx];

                            let alpha: number = color.A;
                            if (color_transform) {
                                if (color_transform[7] !== 0) {
                                    alpha = $Math.max(0, $Math.min(color.A + color_transform[7], 255)) | 0;
                                }
                            }

                            css.addColorStop(color.ratio, $getInt32Array4(
                                color.R, color.G, color.B, alpha
                            ));

                        }

                        context.strokeStyle = css;
                        context.stroke();

                        if (type === "radial") {
                            context.restore();
                        }

                    }
                    break;

                case Graphics.BITMAP_FILL:
                    {
                        if (options && "isPointInPath" in context
                            && context.isPointInPath(options.x, options.y)
                        ) {
                            return true;
                        }

                        if (is_clip || options
                            || context instanceof CanvasRenderingContext2D // fixed logic
                        ) {
                            idx += 6;
                            continue;
                        }

                        context.save();

                        const bitmapData: BitmapData = recode[idx++];
                        const matrix: Float32Array = recode[idx++];
                        const repeat: boolean = recode[idx++];
                        const smooth: boolean = recode[idx++];

                        if (matrix) {
                            context.transform(
                                matrix[0], matrix[1], matrix[2],
                                matrix[3], matrix[4], matrix[5]
                            );
                        }

                        const texture: WebGLTexture | null = bitmapData.getTexture();
                        if (!texture || !color_transform) {
                            break;
                        }

                        context.imageSmoothingEnabled = smooth;
                        if (this._$bitmapId
                            || bitmapData.width === this._$xMax - this._$xMin
                            && bitmapData.height === this._$yMax - this._$yMin
                        ) {

                            context.drawBitmap(texture);

                        } else {

                            context.fillStyle = context.createPattern(
                                texture, repeat, color_transform
                            );

                            context.fill();
                        }

                        // restore
                        context.restore();

                        context.imageSmoothingEnabled = false;
                    }
                    break;

                case Graphics.BITMAP_STROKE:
                    {
                        if (options && "isPointInStroke" in context
                            && context.isPointInStroke(options.x, options.y)
                        ) {
                            return true;
                        }

                        if (is_clip || options
                            || context instanceof CanvasRenderingContext2D // fixed logic
                        ) {
                            idx += 9;
                            continue;
                        }

                        context.save();

                        context.lineWidth  = recode[idx++];
                        context.lineCap    = recode[idx++];
                        context.lineJoin   = recode[idx++];
                        context.miterLimit = recode[idx++];

                        const bitmapData: BitmapData = recode[idx++];
                        const matrix: Float32Array = recode[idx++];
                        const repeat: boolean = recode[idx++];
                        const smooth: boolean = recode[idx++];

                        if (matrix) {
                            context.transform(
                                matrix[0], matrix[1], matrix[2],
                                matrix[3], matrix[4], matrix[5]
                            );
                        }

                        const texture: WebGLTexture | null = bitmapData.getTexture();
                        if (!texture || !color_transform) {
                            break;
                        }

                        context.strokeStyle = context.createPattern(
                            texture, repeat, color_transform
                        );

                        context.imageSmoothingEnabled = smooth;
                        context.stroke();

                        // restore
                        context.restore();
                        context.imageSmoothingEnabled = false;

                    }
                    break;

                default:
                    break;

            }
        }

        return false;
    }
}
