import type { ICapsStyle } from "./interface/ICapsStyle";
import type { IJointStyle } from "./interface/IJointStyle";
import type { IGradientType } from "./interface/IGradientType";
import type { ISpreadMethod } from "./interface/ISpreadMethod";
import type { IInterpolationMethod } from "./interface/IInterpolationMethod";
import type { IPlayerHitObject } from "./interface/IPlayerHitObject";
import type { BitmapData } from "./BitmapData";
import type { Matrix } from "@next2d/geom";
import { GraphicsBitmapFill } from "./GraphicsBitmapFill";
import { GraphicsGradientFill } from "./GraphicsGradientFill";
import { execute as graphicsCalcBoundsUseCase } from "./Graphics/usecase/GraphicsCalcBoundsUseCase";
import { execute as graphicsMargePathService } from "./Graphics/service/GraphicsMargePathService";
import { execute as graphicsDrawEllipseService } from "./Graphics/service/GraphicsDrawEllipseService";
import { execute as graphicsDrawRectService } from "./Graphics/service/GraphicsDrawRectService";
import { execute as graphicsDrawRoundRectService } from "./Graphics/service/GraphicsDrawRoundRectService";
import { execute as graphicsToNumberArrayService } from "./Graphics/service/GraphicsToNumberArrayService";
import { execute as graphicsHitTestService } from "./Graphics/service/GraphicsHitTestService";
import {
    $getArray,
    $poolArray,
    $clamp,
    $convertColorStringToNumber
} from "./DisplayObjectUtil";

/**
 * @description Graphics クラスには、ベクターシェイプの作成に使用できる一連のメソッドがあります。
 *              描画をサポートする表示オブジェクトには、Sprite および Shape オブジェクトがあります。
 *              これらの各クラスには、Graphics オブジェクトである graphics プロパティがあります。
 *              以下は、簡単に使用できるように用意されているヘルパー関数の一例です。
 *              drawRect()、drawRoundRect()、drawCircle()、および drawEllipse()。
 *
 *              The Graphics class contains a set of methods that you can use to create a vector shape.
 *              Display objects that support drawing include Sprite and Shape objects.
 *              Each of these classes includes a graphics property that is a Graphics object.
 *              The following are among those helper functions provided for ease of use:
 *              drawRect(), drawRoundRect(), drawCircle(), and drawEllipse().
 *
 * @class
 * @memberOf next2d.display
 */
export class Graphics
{
    /**
     * @description グラフィックの確認フラグ
     *              Graphic confirmation flag
     *
     * @type {boolean}
     * @default false
     * @public
     */
    public isConfirmed: boolean;

    /**
     * @description グラフィックの最小x座標
     *              Minimum x coordinate of graphic
     *
     * @type {number}
     * @default Number.MAX_VALUE
     * @public
     */
    public xMin: number;

    /**
     * @description グラフィックの最小y座標
     *              Minimum y coordinate of graphic
     *
     * @type {number}
     * @default Number.MAX_VALUE
     * @public
     */
    public yMin: number;

    /**
     * @description グラフィックの最大x座標
     *              Maximum x coordinate of graphic
     *
     * @type {number}
     * @default -Number.MAX_VALUE
     * @public
     */
    public xMax: number;

    /**
     * @description グラフィックの最大y座標
     *              Maximum y coordinate of graphic
     *
     * @type {number}
     * @default -Number.MAX_VALUE
     * @public
     */
    public yMax: number;

    /**
     * @description グラフィックのコマンド配列
     *              Graphic command array
     *
     * @type {array}
     * @default null
     * @public
     */
    public $recodes: any[] | null;

    /**
     * @type {Float32Array}
     * @default null
     * @private
     */
    private _$buffer: Float32Array | null;

    /**
     * @type {number}
     * @default 0
     * @private
     */
    private _$maxAlpha: number;

    /**
     * @type {boolean}
     * @default false
     * @private
     */
    private _$isBeginning: boolean;

    /**
     * @type {number}
     * @default 0
     * @private
     */
    private _$positionX: number;

    /**
     * @type {number}
     * @default 0
     * @private
     */
    private _$positionY: number;

    /**
     * @type {boolean}
     * @default false
     * @private
     */
    private _$hasFillEnabled: boolean;

    /**
     * @type {number}
     * @default 0
     * @private
     */
    private _$fillType: number;

    /**
     * @type {number}
     * @default 0
     * @private
     */
    private _$fillColor: number;

    /**
     * @type {GraphicsGradientFill}
     * @default null
     * @private
     */
    private _$fillGradient: GraphicsGradientFill | null;

    /**
     * @type {GraphicsBitmapFill}
     * @default null
     * @private
     */
    private _$fillBitmap: GraphicsBitmapFill | null;

    /**
     * @type {array}
     * @default null
     * @private
     */
    private _$fills: any[] | null;

    /**
     * @type {boolean}
     * @default false
     * @private
     */
    private _$hasLineEnabled: boolean;

    /**
     * @type {number}
     * @default 0
     * @private
     */
    private _$lineType: number;

    /**
     * @type {number}
     * @default 0
     * @private
     */
    private _$lineColor: number;

    /**
     * @type {GraphicsGradientFill}
     * @default null
     * @private
     */
    private _$lineGradient: GraphicsGradientFill | null;

    /**
     * @type {string}
     * @default "round"
     * @private
     */
    private _$joints: IJointStyle;

    /**
     * @type {number}
     * @default 0
     * @private
     */
    private _$miterLimit: number;

    /**
     * @type {string}
     * @default "none"
     * @private
     */
    private _$caps: ICapsStyle;

    /**
     * @type {number}
     * @default 1
     * @private
     */
    private _$lineWidth: number;

    /**
     * @type {array}
     * @default null
     * @private
     */
    private _$lines: any[] | null;

    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        this.isConfirmed = false;
        this.xMin        = Number.MAX_VALUE;
        this.yMin        = Number.MAX_VALUE;
        this.xMax        = -Number.MAX_VALUE;
        this.yMax        = -Number.MAX_VALUE;

        // private
        this.$recodes     = null;
        this._$buffer      = null;
        this._$positionX   = 0;
        this._$positionY   = 0;
        this._$maxAlpha    = 0;
        this._$isBeginning = false;

        // fill
        this._$fills          = null;
        this._$hasFillEnabled = false;
        this._$fillType       = 0;
        this._$fillGradient   = null;
        this._$fillBitmap     = null;
        this._$fillColor      = 0;

        // stroke
        this._$caps           = "none";
        this._$lineWidth      = 1;
        this._$lines          = null;
        this._$hasLineEnabled = false;
        this._$lineType       = 0;
        this._$lineGradient   = null;
        this._$joints         = "round";
        this._$miterLimit     = 0;
        this._$lineColor      = 0;
    }

    /**
     * @description 描画コマンド、MoveToの識別番号
     *              Drawing command, MoveTo identification number
     *
     * @return {number}
     * @const
     * @static
     */
    static get MOVE_TO (): number
    {
        return 0;
    }

    /**
     * @description 描画コマンド、2次ベジェ曲線の識別番号
     *              Drawing command, 2nd Bezier curve identification number
     *
     * @return {number}
     * @const
     * @static
     */
    static get CURVE_TO (): number
    {
        return 1;
    }

    /**
     * @description 描画コマンド、直線の識別番号
     *              Drawing command, straight line identification number
     *
     * @return {number}
     * @const
     * @static
     */
    static get LINE_TO (): number
    {
        return 2;
    }

    /**
     * @description 描画コマンド、3次ベジェ曲線の識別番号
     *              Drawing command, 3rd Bezier curve identification number
     *
     * @return {number}
     * @const
     * @static
     */
    static get CUBIC (): number
    {
        return 3;
    }

    /**
     * @description 描画コマンド、円弧の識別番号
     *              Drawing command, arc identification number
     *
     * @return {number}
     * @const
     * @static
     */
    static get ARC (): number
    {
        return 4;
    }

    /**
     * @description 描画コマンド、塗りの識別番号
     *              Drawing command, fill identification number
     *
     * @return {number}
     * @const
     * @static
     */
    static get FILL_STYLE (): number
    {
        return 5;
    }

    /**
     * @description 描画コマンド、線の識別番号
     *              Drawing command, line identification number
     *
     * @return {number}
     * @const
     * @static
     */
    static get STROKE_STYLE (): number
    {
        return 6;
    }

    /**
     * @description 描画コマンド、塗りの終了の識別番号
     *              Drawing command, fill end identification number
     *
     * @return {number}
     * @const
     * @static
     */
    static get END_FILL (): number
    {
        return 7;
    }

    /**
     * @description 描画コマンド、線の終了の識別番号
     *              Drawing command, line end identification number
     *
     * @return {number}
     * @const
     * @static
     */
    static get END_STROKE (): number
    {
        return 8;
    }

    /**
     * @description 描画コマンド、描画開始の識別番号
     *              Drawing command, drawing start identification number
     *
     * @return {number}
     * @const
     * @static
     */
    static get BEGIN_PATH (): number
    {
        return 9;
    }

    /**
     * @description 描画コマンド、塗りのグラデーション開始の識別番号
     *              Drawing command, gradient fill start identification number
     *
     * @return {number}
     * @const
     * @static
     */
    static get GRADIENT_FILL (): number
    {
        return 10;
    }

    /**
     * @description 描画コマンド、線のグラデーション開始の識別番号
     *              Drawing command, gradient line start identification number
     *
     * @return {number}
     * @const
     * @static
     */
    static get GRADIENT_STROKE (): number
    {
        return 11;
    }

    /**
     * @description 描画コマンド、描画結合の識別番号
     *              Drawing command, drawing join identification number
     *
     * @return {number}
     * @const
     * @static
     */
    static get CLOSE_PATH (): number
    {
        return 12;
    }

    /**
     * @description 描画コマンド、Bitmapの塗りの識別番号
     *              Drawing command, Bitmap fill identification number
     *
     * @return {number}
     * @const
     * @static
     */
    static get BITMAP_FILL (): number
    {
        return 13;
    }

    /**
     * @description 描画コマンド、Bitmapの線の識別番号
     *              Drawing command, Bitmap line identification number
     *
     * @return {number}
     * @const
     * @static
     */
    static get BITMAP_STROKE (): number
    {
        return 14;
    }

    /**
     * @description 描画コマンドが実行可能かを返却
     *              Returns whether the drawing command can be executed
     *
     * @type {boolean}
     * @readonly
     * @public
     */
    get isDrawable (): boolean
    {
        if (!this._$isBeginning || !this._$maxAlpha) {
            return false;
        }

        const width  = Math.abs(this.xMax - this.xMin);
        const height = Math.abs(this.yMax - this.yMin);
        return width > 0 && height > 0;
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
        if (this._$hasFillEnabled) {
            this.endFill();
        }

        if (!this._$fills) {
            this._$fills = $getArray();
        }

        // start
        this._$maxAlpha       = 1;
        this._$hasFillEnabled = true;
        this._$isBeginning    = true;

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
        if (this._$hasFillEnabled) {
            this.endFill();
        }

        if (!this._$fills) {
            this._$fills = $getArray();
        }

        // valid
        if (typeof color === "string") {
            color = $convertColorStringToNumber(color);
        }

        color = $clamp(color, 0, 0xffffff, 0);
        alpha = $clamp(alpha, 0, 1, 1);

        // setup
        this._$maxAlpha       = Math.max(this._$maxAlpha, alpha);
        this._$hasFillEnabled = true;
        this._$isBeginning    = true;

        // beginPath
        this._$fills.push(Graphics.BEGIN_PATH);

        this._$fillType = Graphics.FILL_STYLE;

        // Color Int 32bit(RGBA)
        const red   = color >>> 16 & 0xff;
        const green = color >>> 8 & 0xff;
        const blue  = color & 0xff;
        this._$fillColor = red << 24 | green << 16 | blue << 8 | alpha * 255;

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
        type: IGradientType,
        colors: number[] | string[],
        alphas: number[],
        ratios: number[],
        matrix: Matrix | null = null,
        spread_method: ISpreadMethod = "pad",
        interpolation_method: IInterpolationMethod = "rgb",
        focal_point_ratio: number = 0
    ): Graphics {

        if (this._$hasFillEnabled) {
            this.endFill();
        }

        if (!this._$fills) {
            this._$fills = $getArray();
        }

        // setup
        for (let idx: number = 0; idx < alphas.length; ++idx) {
            this._$maxAlpha = Math.max(this._$maxAlpha, alphas[idx]);
        }
        this._$hasFillEnabled = true;
        this._$isBeginning    = true;

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
        this._$maxAlpha    = 0;
        this._$isBeginning = false;
        this._$positionX   = 0;
        this._$positionY   = 0;

        // fill
        this._$fillType       = 0;
        this._$fillGradient   = null;
        this._$fillBitmap     = null;
        this._$fillColor      = 0;
        this._$hasFillEnabled = false;

        // stroke
        this._$caps           = "none";
        this._$lineWidth      = 1;
        this._$lineType       = 0;
        this._$lineGradient   = null;
        this._$joints         = "round";
        this._$miterLimit     = 0;
        this._$lineColor      = 0;
        this._$hasLineEnabled = false;

        // bounds size
        this.xMin = Number.MAX_VALUE;
        this.xMax = -Number.MAX_VALUE;
        this.yMin = Number.MAX_VALUE;
        this.yMax = -Number.MAX_VALUE;

        // init array
        if (this.$recodes) {
            $poolArray(this.$recodes);
        }
        if (this._$fills) {
            $poolArray(this._$fills);
        }
        if (this._$lines) {
            $poolArray(this._$lines);
        }

        this._$buffer  = null;
        this.$recodes = null;
        this._$fills   = null;
        this._$lines   = null;

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
        this._$hasFillEnabled = graphics._$hasFillEnabled;
        this._$fillType       = graphics._$fillType;
        this._$fillColor      = graphics._$fillColor;

        if (graphics._$lineGradient) {
            this._$lineGradient = graphics._$lineGradient.clone();
        }

        // stroke
        this._$hasLineEnabled = graphics._$hasLineEnabled;
        this._$lineType       = graphics._$lineType;
        this._$caps           = graphics._$caps;
        this._$joints         = graphics._$joints;
        this._$miterLimit     = graphics._$miterLimit;
        this._$lineWidth      = graphics._$lineWidth;
        this._$lineColor      = graphics._$lineColor;

        // bounds
        this.xMin = graphics.xMin;
        this.xMax = graphics.xMax;
        this.yMin = graphics.yMin;
        this.yMax = graphics.yMax;

        // params
        this._$maxAlpha    = graphics._$maxAlpha;
        this._$positionX   = graphics._$positionX;
        this._$positionY   = graphics._$positionY;
        this._$isBeginning = graphics._$isBeginning;

        // path params
        if (graphics._$fills) {
            this._$fills = graphics._$fills.slice(0);
        }
        if (graphics._$lines) {
            this._$lines = graphics._$lines.slice(0);
        }
        if (graphics.$recodes) {
            this.$recodes = graphics.$recodes.slice(0);
        }

        this._$buffer = null;
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

        if (this._$positionX === anchor_x
            && this._$positionY === anchor_y
        ) {
            return this;
        }

        control_x1 = +control_x1 || 0;
        control_y1 = +control_y1 || 0;
        control_x2 = +control_x2 || 0;
        control_y2 = +control_y2 || 0;

        // calc bounds
        graphicsCalcBoundsUseCase(
            this, this._$hasLineEnabled,
            this._$positionX, this._$positionY,
            this._$lineWidth, this._$caps,
            control_x1, control_y1,
            control_x2, control_y2,
            anchor_x, anchor_y
        );

        // marge path
        graphicsMargePathService(
            this,
            this._$hasFillEnabled, this._$hasLineEnabled,
            this._$fills, this._$lines,
            Graphics.CUBIC,
            control_x1, control_y1,
            control_x2, control_y2,
            anchor_x, anchor_y
        );

        this._$positionX = anchor_x;
        this._$positionY = anchor_y;

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

        if (this._$positionX === anchor_x
            && this._$positionY === anchor_y
        ) {
            return this;
        }

        control_x = +control_x || 0;
        control_y = +control_y || 0;

        // calc bounds
        graphicsCalcBoundsUseCase(
            this, this._$hasLineEnabled,
            this._$positionX, this._$positionY,
            this._$lineWidth, this._$caps,
            control_x, control_y,
            anchor_x,  anchor_y
        );

        // marge path
        graphicsMargePathService(
            this,
            this._$hasFillEnabled, this._$hasLineEnabled,
            this._$fills, this._$lines,
            Graphics.CURVE_TO,
            control_x, control_y,
            anchor_x, anchor_y
        );

        this._$positionX = anchor_x;
        this._$positionY = anchor_y;

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
        radius = Math.round(radius);

        // calc bounds
        graphicsCalcBoundsUseCase(
            this, this._$hasLineEnabled,
            this._$positionX, this._$positionY,
            this._$lineWidth, this._$caps,
            x - radius, y - radius,
            x + radius, y + radius
        );

        // marge path
        graphicsMargePathService(
            this,
            this._$hasFillEnabled, this._$hasLineEnabled,
            this._$fills, this._$lines,
            Graphics.MOVE_TO, x + radius, y,
            Graphics.ARC, x, y, radius
        );

        this._$positionX = x;
        this._$positionY = y;

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
        return graphicsDrawEllipseService(this, x, y, width, height);
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
        return graphicsDrawRectService(this, x, y, width, height);
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
        return graphicsDrawRoundRectService(this, x, y, width, height, ellipse_width, ellipse_height);
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
        if (!this._$hasFillEnabled || !this._$fills || 8 > this._$fills.length) {
            return this;
        }

        if (!this.$recodes) {
            this.$recodes = $getArray();
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
        this.$recodes.push(...this._$fills);

        $poolArray(this._$fills);
        this._$fills = null;

        // fill
        switch (this._$fillType) {

            case Graphics.FILL_STYLE:
                this.$recodes.push(
                    this._$fillType,
                    this._$fillColor >>> 24 & 0xff,
                    this._$fillColor >>> 16 & 0xff,
                    this._$fillColor >>> 8 & 0xff,
                    this._$fillColor & 0xff,
                    Graphics.END_FILL
                );
                break;

            case Graphics.GRADIENT_FILL:
                if (this._$fillGradient) {
                    this.$recodes.push(
                        this._$fillType,
                        ...this._$fillGradient.toArray()
                    );
                }
                break;

            case Graphics.BITMAP_FILL:
                if (this._$fillBitmap) {
                    this.$recodes.push(
                        this._$fillType,
                        ...this._$fillBitmap.toArray()
                    );
                }
                break;

        }

        // reset
        this._$fillType       = 0;
        this._$fillColor      = 0;
        this._$fillGradient   = null;
        this._$fillBitmap     = null;
        this._$hasFillEnabled = false;

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
        if (!this._$hasLineEnabled || !this._$lines) {
            return this;
        }

        if (!this.$recodes) {
            this.$recodes = $getArray();
        }

        this.$recodes.push(...this._$lines);

        // clear
        $poolArray(this._$lines);
        this._$lines = null;

        // fill
        switch (this._$lineType) {

            case Graphics.STROKE_STYLE:
                this.$recodes.push(
                    this._$lineType,
                    this._$lineWidth,
                    this._$caps,
                    this._$joints,
                    this._$miterLimit,
                    this._$lineColor >>> 24 & 0xff,
                    this._$lineColor >>> 16 & 0xff,
                    this._$lineColor >>> 8 & 0xff,
                    this._$lineColor & 0xff,
                    Graphics.END_STROKE
                );
                break;

            case Graphics.GRADIENT_STROKE:
                if (this._$lineGradient) {
                    this.$recodes.push(
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
                    this.$recodes.push(
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

        // reset
        this._$lineType       = 0;
        this._$lineWidth      = 0;
        this._$lineGradient   = null;
        this._$lineColor      = 0;
        this._$caps           = "none";
        this._$joints         = "round";
        this._$miterLimit     = 0;
        this._$hasLineEnabled = false;

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
        if (this._$hasLineEnabled) {
            this.endLine();
        }

        if (!this._$lines) {
            this._$lines = $getArray();
        }

        // start
        this._$maxAlpha       = 1;
        this._$hasLineEnabled = true;
        this._$isBeginning    = true;

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
        type: IGradientType,
        colors: number[], alphas: number[], ratios: number[],
        matrix: Matrix | null = null,
        spread_method: ISpreadMethod = "pad",
        interpolation_method: IInterpolationMethod = "rgb",
        focal_point_ratio: number = 0
    ): Graphics {

        if (!this._$hasLineEnabled) {
            return this;
        }

        if (!this._$lines) {
            this._$lines = $getArray();
        }

        // setup
        for (let idx: number = 0; idx < alphas.length; ++idx) {
            this._$maxAlpha = Math.max(this._$maxAlpha, alphas[idx]);
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
        caps: ICapsStyle = "round",
        joints: IJointStyle = "round",
        miter_limit: number = 3
    ): Graphics {

        if (this._$hasLineEnabled) {
            this.endLine();
        }

        if (!this._$lines) {
            this._$lines = $getArray();
        }

        // setup
        this._$maxAlpha       = Math.max(this._$maxAlpha, alpha);
        this._$hasLineEnabled = true;
        this._$isBeginning    = true;

        // beginPath
        if (this._$positionX || this._$positionY) {
            this._$lines.push(
                Graphics.BEGIN_PATH,
                Graphics.MOVE_TO,
                this._$positionX,
                this._$positionY
            );
        } else {
            this._$lines.push(Graphics.BEGIN_PATH);
        }

        // color
        this._$lineType = Graphics.STROKE_STYLE;

        // valid
        if (typeof color === "string") {
            color = $convertColorStringToNumber(color);
        }

        color = $clamp(color, 0, 0xffffff, 0);
        alpha = $clamp(alpha, 0, 1, 1);

        // Color Int 32bit(RGBA)
        const red   = color >>> 16 & 0xff;
        const green = color >>> 8 & 0xff;
        const blue  = color & 0xff;
        this._$lineColor = red << 24 | green << 16 | blue << 8 | alpha;

        // param
        this._$lineWidth = thickness;
        this._$caps      = `${caps}`;
        this._$joints    = `${joints}`;

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

        if (this._$positionX === x && this._$positionY === y) {
            return this;
        }

        // calc bounds
        graphicsCalcBoundsUseCase(
            this, this._$hasLineEnabled,
            this._$positionX, this._$positionY,
            this._$lineWidth, this._$caps,
            x, y
        );

        // marge path
        graphicsMargePathService(
            this,
            this._$hasFillEnabled, this._$hasLineEnabled,
            this._$fills, this._$lines,
            Graphics.LINE_TO,
            x, y
        );

        this._$positionX = x;
        this._$positionY = y;

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

        this._$positionX = x;
        this._$positionY = y;

        // calc bounds
        graphicsCalcBoundsUseCase(
            this, this._$hasLineEnabled,
            this._$positionX, this._$positionY,
            this._$lineWidth, this._$caps,
            x, y
        );

        let duplication = false;
        if (this._$hasFillEnabled && this._$fills) {
            const isMove = this._$fills[this._$fills.length - 3] === Graphics.MOVE_TO;
            if (isMove) {
                duplication = true;
                this._$fills[this._$fills.length - 2] = x;
                this._$fills[this._$fills.length - 1] = y;
            }
        }

        if (this._$hasLineEnabled && this._$lines) {
            const isMove = this._$lines[this._$lines.length - 3] === Graphics.MOVE_TO;
            if (isMove) {
                duplication = true;
                this._$lines[this._$lines.length - 2] = x;
                this._$lines[this._$lines.length - 1] = y;
            }
        }

        // marge path
        if (!duplication) {
            graphicsMargePathService(
                this,
                this._$hasFillEnabled, this._$hasLineEnabled,
                this._$fills, this._$lines,
                Graphics.MOVE_TO,
                x, y
            );
        }

        return this;
    }

    /**
     * @description 指定のxy座標が描画範囲にヒットしてるかの判定
     *              Judges whether the specified xy coordinate hits the drawing range.
     *
     * @param  {CanvasRenderingContext2D} context
     * @param  {Float32Array} matrix
     * @param  {object} options
     * @return {boolean}
     * @method
     * @private
     */
    _$hit (
        context: CanvasRenderingContext2D,
        matrix: Float32Array,
        options: IPlayerHitObject
    ): boolean {

        // fixed logic
        if (this._$hasLineEnabled) {
            this.endLine();
        }

        // fixed logic
        if (this._$hasFillEnabled) {
            this.endFill();
        }

        if (!this.$recodes) {
            return false;
        }

        context.beginPath();
        context.setTransform(
            matrix[0], matrix[1], matrix[2],
            matrix[3], matrix[4], matrix[5]
        );

        return graphicsHitTestService(context, this.$recodes, options);
    }

    // /**
    //  * @return {object}
    //  * @method
    //  * @private
    //  */
    // _$getBounds (): BoundsImpl
    // {
    //     const displayObject: DisplayObjectImpl<any> = this._$displayObject;
    //     if (displayObject && displayObject._$bounds) {
    //         return $getBoundsObject(
    //             displayObject._$bounds.xMin, displayObject._$bounds.xMax,
    //             displayObject._$bounds.yMin, displayObject._$bounds.yMax
    //         );
    //     }

    //     return $getBoundsObject(
    //         this.xMin, this.xMax,
    //         this.yMin, this.yMax
    //     );
    // }

    /**
     * @description この Graphics オブジェクトに描画されているパス情報をFloat32Arrayで返却
     *              Returns the path information drawn to this Graphics object in Float32Array.
     *
     * @member {Float32Array}
     * @method
     * @public
     */
    get buffer (): Float32Array
    {
        if (this.isConfirmed && this._$buffer) {
            return this._$buffer;
        }

        // fixed logic
        if (this._$hasLineEnabled) {
            this.endLine();
        }

        // fixed logic
        if (this._$hasFillEnabled) {
            this.endFill();
        }

        const array: any[] = graphicsToNumberArrayService(this.$recodes);
        this._$buffer = new Float32Array(array);
        $poolArray(array);

        // レコードの確定フラグを更新
        this.isConfirmed = true;

        return this._$buffer;
    }
    set buffer (buffer: Float32Array)
    {
        this._$buffer      = buffer;
        this.isConfirmed   = true;
        this._$isBeginning = true;
        this._$maxAlpha    = 1;
    }
}