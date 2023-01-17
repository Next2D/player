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
class Graphics
{
    /**
     * @param {DisplayObject} src
     *
     * @constructor
     * @public
     */
    constructor (src = null)
    {
        /**
         * @type {DisplayObject}
         * @default null
         * @private
         */
        this._$displayObject = src;

        this.clear();
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
    static toString ()
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
    static get namespace ()
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
    toString ()
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
    get namespace ()
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
    static get MOVE_TO ()
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
    static get CURVE_TO ()
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
    static get LINE_TO ()
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
    static get CUBIC ()
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
    static get ARC ()
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
    static get FILL_STYLE ()
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
    static get STROKE_STYLE ()
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
    static get END_FILL ()
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
    static get END_STROKE ()
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
    static get BEGIN_PATH ()
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
    static get GRADIENT_FILL ()
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
    static get GRADIENT_STROKE ()
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
    static get CLOSE_PATH ()
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
    static get BITMAP_FILL ()
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
    static get BITMAP_STROKE ()
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
    beginBitmapFill (bitmap_data, matrix = null, repeat = true, smooth = false)
    {
        // end fill
        if (this._$doFill) {
            this.endFill();
        }

        if (!this._$fills) {
            this._$fills = Util.$getArray();
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
    beginFill (color = 0, alpha = 1)
    {
        // end fill
        if (this._$doFill) {
            this.endFill();
        }

        if (!this._$fills) {
            this._$fills = Util.$getArray();
        }

        // valid
        color = Util.$clamp(Util.$toColorInt(color), 0, 0xffffff, 0);
        alpha = Util.$clamp(alpha, 0, 1, 1);

        // setup
        this._$maxAlpha = $Math.max(this._$maxAlpha, alpha);
        this._$doFill   = true;
        this._$canDraw  = true;

        // beginPath
        this._$fills.push(Graphics.BEGIN_PATH);

        // add Fill Style
        const object = Util.$intToRGBA(color, alpha);

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
        type, colors, alphas, ratios, matrix = null,
        spread_method = SpreadMethod.PAD,
        interpolation_method = InterpolationMethod.RGB,
        focal_point_ratio = 0
    ) {

        if (this._$doFill) {
            this.endFill();
        }

        if (!this._$fills) {
            this._$fills = Util.$getArray();
        }

        // setup
        const length = alphas.length;
        for (let idx = 0; idx < length; ++idx) {
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
    clear ()
    {
        // param clear
        this._$maxAlpha      = 0;
        this._$pointerX      = 0;
        this._$pointerY      = 0;
        this._$canDraw       = false;

        // fill
        this._$fillType      = 0;
        this._$fillGradient  = null;
        this._$fillBitmap    = null;
        this._$fillStyleR    = 0;
        this._$fillStyleG    = 0;
        this._$fillStyleB    = 0;
        this._$fillStyleA    = 0;
        this._$doFill        = false;

        // stroke
        this._$lineType      = 0;
        this._$lineGradient  = 0;
        this._$caps          = CapsStyle.NONE;
        this._$joints        = JointStyle.ROUND;
        this._$miterLimit    = 0;
        this._$lineWidth     = 1;
        this._$lineStyleR    = 0;
        this._$lineStyleG    = 0;
        this._$lineStyleB    = 0;
        this._$lineStyleA    = 0;
        this._$doLine        = false;

        // bounds size
        this._$xMin          = $Number.MAX_VALUE;
        this._$xMax          = -$Number.MAX_VALUE;
        this._$yMin          = $Number.MAX_VALUE;
        this._$yMax          = -$Number.MAX_VALUE;

        // init array
        if (this._$recode) {
            Util.$poolArray(this._$recode);
        }
        if (this._$fills) {
            Util.$poolArray(this._$fills);
        }
        if (this._$lines) {
            Util.$poolArray(this._$lines);
        }

        this._$buffer = null;
        this._$recode = null;
        this._$fills  = null;
        this._$lines  = null;

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
    clone ()
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
    copyFrom (graphics)
    {
        if (!(graphics instanceof Graphics)) {
            return ;
        }

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
        control_x1, control_y1, control_x2, control_y2,
        anchor_x, anchor_y
    ) {

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

        this._$margePath(Util.$getArray(
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
    curveTo (control_x, control_y, anchor_x, anchor_y)
    {

        anchor_x = +anchor_x || 0;
        anchor_y = +anchor_y || 0;

        if (this._$pointerX === anchor_x && this._$pointerY === anchor_y) {
            return this;
        }

        control_x = +control_x || 0;
        control_y = +control_y || 0;

        this._$setBounds(control_x, control_y);
        this._$setBounds(anchor_x,  anchor_y);

        this._$margePath(Util.$getArray(
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
    drawCircle (x, y, radius)
    {
        x      = +x || 0;
        y      = +y || 0;
        radius = +radius || 0;

        this._$setBounds(x - radius, y - radius);
        this._$setBounds(x + radius, y + radius);

        this._$margePath(Util.$getArray(
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
    drawEllipse (x, y, width, height)
    {
        x = +x || 0;
        y = +y || 0;
        width  = +width  || 0;
        height = +height || 0;

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
    drawRect (x, y, width, height)
    {
        // valid
        x = +x || 0;
        y = +y || 0;

        width  = +width  || 0;
        height = +height || 0;

        const xMax = x + width;
        const yMax = y + height;

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
        x, y, width, height, ellipse_width, ellipse_height = NaN
    ) {

        x = +x || 0;
        y = +y || 0;

        width  = +width  || 0;
        height = +height || 0;

        ellipse_width  = +ellipse_width  || 0;
        ellipse_height = +ellipse_height || ellipse_width;

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
    endFill ()
    {
        if (this._$doFill && this._$fills.length > 6) {

            if (!this._$recode) {
                this._$recode = Util.$getArray();
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
            this._$recode.push.apply(this._$recode, this._$fills);

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
                    this._$recode.push(this._$fillType);
                    this._$recode.push.apply(
                        this._$recode, this._$fillGradient.toArray()
                    );
                    break;

                case Graphics.BITMAP_FILL:
                    this._$recode.push(this._$fillType);
                    this._$recode.push.apply(
                        this._$recode, this._$fillBitmap.toArray()
                    );
                    break;

            }

        }

        if (this._$fills) {
            Util.$poolArray(this._$fills);
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
    endLine ()
    {
        if (this._$doLine) {

            if (!this._$recode) {
                this._$recode = Util.$getArray();
            }

            this._$recode.push.apply(this._$recode, this._$lines);

            // clear
            Util.$poolArray(this._$lines);
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
                    this._$recode.push(
                        this._$lineType,
                        this._$lineWidth,
                        this._$caps,
                        this._$joints,
                        this._$miterLimit
                    );
                    this._$recode.push.apply(
                        this._$recode, this._$lineGradient.toArray()
                    );
                    break;

                case Graphics.BITMAP_STROKE:
                    this._$recode.push(
                        this._$lineType,
                        this._$lineWidth,
                        this._$caps,
                        this._$joints,
                        this._$miterLimit
                    );
                    this._$recode.push.apply(
                        this._$recode, this._$fillBitmap.toArray()
                    );
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
        this._$caps         = CapsStyle.NONE;
        this._$joints       = JointStyle.ROUND;
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
    lineBitmapStyle (bitmap_data, matrix = null, repeat = true, smooth = false)
    {
        // end fill
        if (this._$doLine) {
            this.endLine();
        }

        if (!this._$lines) {
            this._$lines = Util.$getArray();
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
        type, colors, alphas, ratios, matrix = null,
        spread_method = SpreadMethod.PAD,
        interpolation_method = InterpolationMethod.RGB,
        focal_point_ratio = 0
    ) {

        if (!this._$doLine) {
            return this;
        }

        if (!this._$lines) {
            this._$lines = Util.$getArray();
        }

        // setup
        const length = alphas.length;
        for (let idx = 0; idx < length; ++idx) {
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
        thickness = 1, color = 0, alpha = 1,
        caps = CapsStyle.ROUND, joints = JointStyle.ROUND, miter_limit = 3
    ) {

        if (this._$doLine) {
            this.endLine();
        }

        if (!this._$lines) {
            this._$lines = Util.$getArray();
        }

        color = Util.$clamp(Util.$toColorInt(color), 0, 0xffffff, 0);
        alpha = Util.$clamp(+alpha, 0, 1, 1);

        // setup
        this._$maxAlpha = $Math.max(this._$maxAlpha, alpha);
        this._$doLine   = true;
        this._$canDraw  = true;

        // beginPath
        this._$lines.push(
            Graphics.BEGIN_PATH,
            Graphics.MOVE_TO,
            this._$pointerX,
            this._$pointerY
        );

        // add Fill Style
        const object = Util.$intToRGBA(color, alpha);

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
        if (this._$joints === JointStyle.MITER) {
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
    lineTo (x, y)
    {
        x = +x || 0;
        y = +y || 0;

        if (this._$pointerX === x && this._$pointerY === y) {
            return this;
        }

        this._$setBounds(x, y);

        this._$margePath(Util.$getArray(Graphics.LINE_TO, x, y));

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
    moveTo (x, y)
    {
        x = +x || 0;
        y = +y || 0;

        this._$pointerX = x;
        this._$pointerY = y;

        this._$setBounds(x, y);

        this._$margePath(Util.$getArray(Graphics.MOVE_TO, x, y));

        // restart
        this._$restart();

        return this;
    }

    /**
     * @param  {Renderer} renderer
     * @param  {Float32Array} matrix
     * @return void
     * @private
     */
    _$clip (renderer, matrix)
    {
        // size
        const baseBounds = this._$getBounds();

        const bounds = Util.$boundsMatrix(baseBounds, matrix);
        let width    = $Math.ceil($Math.abs(bounds.xMax - bounds.xMin));
        let height   = $Math.ceil($Math.abs(bounds.yMax - bounds.yMin));
        Util.$poolBoundsObject(baseBounds);
        Util.$poolBoundsObject(bounds);

        switch (true) {

            case width === 0:
            case height === 0:
            case width === -Util.$Infinity:
            case height === -Util.$Infinity:
            case width === Util.$Infinity:
            case height === Util.$Infinity:
                return;

            default:
                break;

        }

        renderer.clipGraphics(this, matrix);
    }

    /**
     * @param  {Renderer} renderer
     * @param  {Float32Array} matrix
     * @param  {Float32Array} color_transform
     * @param  {string} [blend_mode=BlendMode.NORMAL]
     * @param  {array}  [filters=null]
     * @return {void}
     * @method
     * @private
     */
    _$draw (
        renderer, matrix, color_transform,
        blend_mode = BlendMode.NORMAL, filters = null
    ) {

        if (!this._$maxAlpha) {
            return ;
        }

        const alpha = Util.$clamp(
            color_transform[3] + color_transform[7] / 255, 0, 1
        );

        const displayObject = this._$displayObject;

        // set grid data
        let hasGrid = displayObject._$scale9Grid !== null;

        // 9スライスを有効にしたオブジェクトが回転・傾斜成分を含む場合は
        // 9スライスは無効になる
        let parentMatrix = null;
        if (hasGrid) {
            parentMatrix = displayObject._$transform._$rawMatrix();
            hasGrid = hasGrid
                && $Math.abs(parentMatrix[1]) < 0.001
                && $Math.abs(parentMatrix[2]) < 0.0001;
        }

        // size
        const baseBounds = this._$getBounds();
        const bounds = Util.$boundsMatrix(baseBounds, matrix);
        const xMax   = bounds.xMax;
        const xMin   = bounds.xMin;
        const yMax   = bounds.yMax;
        const yMin   = bounds.yMin;
        Util.$poolBoundsObject(bounds);

        const width  = $Math.ceil($Math.abs(xMax - xMin));
        const height = $Math.ceil($Math.abs(yMax - yMin));
        switch (true) {

            case width === 0:
            case height === 0:
            case width === -Util.$Infinity:
            case height === -Util.$Infinity:
            case width === Util.$Infinity:
            case height === Util.$Infinity:
                return;

            default:
                break;

        }

        // cache current buffer
        const currentAttachment = renderer.currentAttachment;
        if (xMin > currentAttachment.width || yMin > currentAttachment.height) {
            return;
        }

        let xScale = +$Math.sqrt(
            matrix[0] * matrix[0]
            + matrix[1] * matrix[1]
        );
        if (!$Number.isInteger(xScale)) {
            const value = xScale.toString();
            const index = value.indexOf("e");
            if (index !== -1) {
                xScale = +value.slice(0, index);
            }
            xScale = +xScale.toFixed(4);
        }

        let yScale = +$Math.sqrt(
            matrix[2] * matrix[2]
            + matrix[3] * matrix[3]
        );
        if (!$Number.isInteger(yScale)) {
            const value = yScale.toString();
            const index = value.indexOf("e");
            if (index !== -1) {
                yScale = +value.slice(0, index);
            }
            yScale = +yScale.toFixed(4);
        }

        if (0 > xMin + width || 0 > yMin + height) {

            if (filters && filters.length && displayObject._$canApply(filters)) {

                let rect = new Rectangle(0, 0, width, height);
                for (let idx = 0; idx < filters.length ; ++idx) {
                    rect = filters[idx]._$generateFilterRect(rect, xScale, yScale);
                }

                if (0 > rect.x + rect.width || 0 > rect.y + rect.height) {
                    return;
                }

            } else {
                return;
            }

        }

        // get cache
        const keys = Util.$getArray(xScale, yScale);

        let uniqueId = displayObject._$instanceId;
        if (!hasGrid
            && displayObject._$loaderInfo
            && displayObject._$characterId
        ) {
            uniqueId = `${displayObject._$loaderInfo._$id}@${displayObject._$characterId}`;
        }

        const cacheStore = Util.$cacheStore();
        const cacheKeys  = cacheStore.generateKeys(
            uniqueId, keys, color_transform
        );

        Util.$poolArray(keys);

        renderer.drawGraphics(this,
            cacheKeys, baseBounds, width, height, xScale, yScale,
            matrix, color_transform, filters, alpha, blend_mode,
            xMin, yMin, hasGrid, parentMatrix
        );

        // pool
        Util.$poolArray(cacheKeys);
        Util.$poolBoundsObject(baseBounds);
    }

    /**
     * @param  {CanvasToWebGLContext} context
     * @param  {Float32Array}         color_transform
     * @param  {boolean}              [is_clip=false]
     * @return {void}
     * @method
     * @private
     */
    _$doDraw (context, color_transform, is_clip = false)
    {
        // draw
        Util.$resetContext(context);

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
    _$hit (context, matrix, options, is_clip = false)
    {
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
    _$getBounds ()
    {
        const displayObject = this._$displayObject;
        if (displayObject && displayObject._$bounds) {
            return Util.$getBoundsObject(
                displayObject._$bounds.xMin, displayObject._$bounds.xMax,
                displayObject._$bounds.yMin, displayObject._$bounds.yMax
            );
        }

        return Util.$getBoundsObject(
            this._$xMin, this._$xMax,
            this._$yMin, this._$yMax
        );
    }

    /**
     * @return {void}
     * @method
     * @private
     */
    _$restart ()
    {
        if (this._$displayObject
            && !this._$displayObject._$isUpdated()
        ) {

            this._$displayObject._$doChanged();
            Util.$isUpdated = true;

            Util
                .$cacheStore()
                .removeCache(this._$displayObject._$instanceId);

            if (this._$displayObject._$characterId) {
                Util
                    .$cacheStore()
                    .removeCache(this._$displayObject._$characterId);
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
    _$setBounds (x = 0, y = 0)
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
    _$setFillBounds (x, y)
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
    _$setLineBounds (x, y)
    {
        this._$xMin = $Math.min(this._$xMin, $Math.min(x, this._$pointerX));
        this._$xMax = $Math.max(this._$xMax, $Math.max(x, this._$pointerX));
        this._$yMin = $Math.min(this._$yMin, $Math.min(y, this._$pointerY));
        this._$yMax = $Math.max(this._$yMax, $Math.max(y, this._$pointerY));

        // correction
        const half     = this._$lineWidth / 2;
        const radian90 = 0.5 * $Math.PI;
        const radian1  = $Math.atan2(y - this._$pointerY, x - this._$pointerX); // to end point
        const radian2  = $Math.atan2(this._$pointerY - y, this._$pointerX - x); // to start point
        const radian3  = radian1 + radian90;
        const radian4  = radian1 - radian90;
        const radian5  = radian2 + radian90;
        const radian6  = radian2 - radian90;

        // init
        let x1 = x + half;
        let x2 = -half + x;
        let x3 = this._$pointerX + half;
        let x4 = -half + this._$pointerX;
        let y1 = y + half;
        let y2 = -half + y;
        let y3 = this._$pointerY + half;
        let y4 = -half + this._$pointerY;

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
        let rx1 = 0;
        let ry1 = 0;
        let rx2 = 0;
        let ry2 = 0;
        let rx3 = 0;
        let ry3 = 0;
        let rx4 = 0;
        let ry4 = 0;
        switch (this._$caps) {

            case CapsStyle.ROUND:

                if ($Math.abs(radian1) % radian90 !== 0) {
                    rx1 = x + $Math.cos(radian1) * half;
                }

                if (radian1 && $Math.abs(radian1) % $Math.PI !== 0) {
                    ry1 = y + $Math.sin(radian1) * half;
                }

                if ($Math.abs(radian2) % radian90 !== 0) {
                    rx2 = this._$pointerX + $Math.cos(radian2) * half;
                }

                if (radian2 && $Math.abs(radian2) % $Math.PI !== 0) {
                    ry2 = this._$pointerY + $Math.sin(radian2) * half;
                }

                this._$xMin = $Math.min(this._$xMin, $Math.min(rx1, rx2));
                this._$xMax = $Math.max(this._$xMax, $Math.max(rx1, rx2));
                this._$yMin = $Math.min(this._$yMin, $Math.min(ry1, ry2));
                this._$yMax = $Math.max(this._$yMax, $Math.max(ry1, ry2));

                break;

            case CapsStyle.SQUARE:

                if ($Math.abs(radian1) % radian90 !== 0) {
                    const r1cos = $Math.cos(radian1) * half;
                    rx1 = x1 + r1cos;
                    rx2 = x2 + r1cos;
                }

                if ($Math.abs(radian2) % radian90 !== 0) {
                    const r2cos = $Math.cos(radian2) * half;
                    rx3 = x3 + r2cos;
                    rx4 = x4 + r2cos;
                }

                if (radian1 && $Math.abs(radian1) % $Math.PI !== 0) {
                    const r1sin = $Math.sin(radian1) * half;
                    ry1 = y1 + r1sin;
                    ry2 = y2 + r1sin;
                }

                if (radian2 && $Math.abs(radian2) % $Math.PI !== 0) {
                    const r2sin = $Math.sin(radian2) * half;
                    ry3 = y3 + r2sin;
                    ry4 = y4 + r2sin;
                }

                this._$xMin = $Math.min(this._$xMin, $Math.min(rx1, $Math.min(rx2, $Math.min(rx3, rx4))));
                this._$xMax = $Math.max(this._$xMax, $Math.max(rx1, $Math.max(rx2, $Math.max(rx3, rx4))));
                this._$yMin = $Math.min(this._$yMin, $Math.min(ry1, $Math.min(ry2, $Math.min(ry3, ry4))));
                this._$yMax = $Math.max(this._$yMax, $Math.max(ry1, $Math.max(ry2, $Math.max(ry3, ry4))));

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
    _$margePath (data)
    {
        if (this._$doFill) {
            this._$fills.push.apply(this._$fills, data);
        }

        if (this._$doLine) {
            this._$lines.push.apply(this._$lines, data);
        }

        Util.$poolArray(data);
    }

    /**
     * @return {Float32Array}
     * @method
     * @private
     */
    _$getRecodes ()
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
            this._$recode = Util.$getArray();
        }

        if (!this._$buffer) {

            const array = Util.$getArray();

            const recode = this._$recode;
            for (let idx = 0; idx < recode.length;) {

                const type = recode[idx++];
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

                                case CapsStyle.NONE:
                                    array.push(0);
                                    break;

                                case CapsStyle.ROUND:
                                    array.push(1);
                                    break;

                                case CapsStyle.SQUARE:
                                    array.push(2);
                                    break;

                            }

                            const lineJoin = recode[idx++];
                            switch (lineJoin) {

                                case JointStyle.BEVEL:
                                    array.push(0);
                                    break;

                                case JointStyle.MITER:
                                    array.push(1);
                                    break;

                                case JointStyle.ROUND:
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
                            const type          = recode[idx++];
                            const stops         = recode[idx++];
                            const matrix        = recode[idx++];
                            const spread        = recode[idx++];
                            const interpolation = recode[idx++];
                            const focal         = recode[idx++];

                            array.push(type === GradientType.LINEAR ? 0 : 1);

                            array.push(stops.length);
                            for (let idx = 0; idx < stops.length; ++idx) {
                                const color = stops[idx];
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

                                case SpreadMethod.REFLECT:
                                    array.push(0);
                                    break;

                                case SpreadMethod.REPEAT:
                                    array.push(1);
                                    break;

                                default:
                                    array.push(2);
                                    break;

                            }

                            array.push(
                                interpolation === InterpolationMethod.LINEAR_RGB ? 0 : 1
                            );

                            array.push(focal);
                        }
                        break;

                    case Graphics.GRADIENT_STROKE:
                        {
                            array.push(recode[idx++]);

                            const lineCap = recode[idx++];
                            switch (lineCap) {

                                case CapsStyle.NONE:
                                    array.push(0);
                                    break;

                                case CapsStyle.ROUND:
                                    array.push(1);
                                    break;

                                case CapsStyle.SQUARE:
                                    array.push(2);
                                    break;

                            }

                            const lineJoin = recode[idx++];
                            switch (lineJoin) {

                                case JointStyle.BEVEL:
                                    array.push(0);
                                    break;

                                case JointStyle.MITER:
                                    array.push(1);
                                    break;

                                case JointStyle.ROUND:
                                    array.push(2);
                                    break;

                            }

                            // miterLimit
                            array.push(recode[idx++]);

                            const type          = recode[idx++];
                            const stops         = recode[idx++];
                            const matrix        = recode[idx++];
                            const spread        = recode[idx++];
                            const interpolation = recode[idx++];
                            const focal         = recode[idx++];

                            array.push(type === GradientType.LINEAR ? 0 : 1);

                            array.push(stops.length);
                            for (let idx = 0; idx < stops.length; ++idx) {
                                const color = stops[idx];
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

                                case SpreadMethod.REFLECT:
                                    array.push(0);
                                    break;

                                case SpreadMethod.REPEAT:
                                    array.push(1);
                                    break;

                                default:
                                    array.push(2);
                                    break;

                            }

                            array.push(
                                interpolation === InterpolationMethod.LINEAR_RGB ? 0 : 1
                            );

                            array.push(focal);
                        }
                        break;

                    case Graphics.BITMAP_FILL:
                        {
                            const bitmapData = recode[idx++];
                            let buffer = null;
                            switch (true) {

                                case bitmapData._$image !== null:
                                    break;

                                case bitmapData._$canvas !== null:
                                    break;

                                case bitmapData._$buffer !== null:
                                    buffer = bitmapData._$buffer;
                                    break;

                            }

                            array.push(bitmapData.width);
                            array.push(bitmapData.height);
                            array.push(this._$xMax - this._$xMin);
                            array.push(this._$yMax - this._$yMin);
                            array.push(buffer.length);
                            for (let idx = 0; idx < buffer.length; ++idx) {
                                array.push(buffer[idx]);
                            }

                            const matrix = recode[idx++];
                            if (matrix) {
                                array.push(
                                    matrix[0], matrix[1], matrix[2],
                                    matrix[3], matrix[4], matrix[5]
                                );
                            } else {
                                array.push(1, 0, 0, 1, 0, 0);
                            }

                            const repeat = recode[idx++];
                            array.push(repeat === "repeat" ? 1 : 0);

                            const smooth = recode[idx++];
                            array.push(smooth ? 1 : 0);
                        }
                        break;

                    case Graphics.BITMAP_STROKE:
                        {

                            array.push(recode[idx++]);

                            const lineCap = recode[idx++];
                            switch (lineCap) {

                                case CapsStyle.NONE:
                                    array.push(0);
                                    break;

                                case CapsStyle.ROUND:
                                    array.push(1);
                                    break;

                                case CapsStyle.SQUARE:
                                    array.push(2);
                                    break;

                            }

                            const lineJoin = recode[idx++];
                            switch (lineJoin) {

                                case JointStyle.BEVEL:
                                    array.push(0);
                                    break;

                                case JointStyle.MITER:
                                    array.push(1);
                                    break;

                                case JointStyle.ROUND:
                                    array.push(2);
                                    break;

                            }

                            // MITER LIMIT
                            array.push(recode[idx++]);

                            const bitmapData = recode[idx++];
                            let buffer = null;
                            switch (true) {

                                case bitmapData._$image !== null:
                                    break;

                                case bitmapData._$canvas !== null:
                                    break;

                                case bitmapData._$buffer !== null:
                                    buffer = bitmapData._$buffer;
                                    break;

                            }

                            array.push(bitmapData.width);
                            array.push(bitmapData.height);
                            array.push(buffer.length);
                            for (let idx = 0; idx < buffer.length; ++idx) {
                                array.push(buffer[idx]);
                            }

                            const matrix = recode[idx++];
                            if (matrix) {
                                array.push(
                                    matrix[0], matrix[1], matrix[2],
                                    matrix[3], matrix[4], matrix[5]
                                );
                            } else {
                                array.push(1, 0, 0, 1, 0, 0);
                            }

                            const repeat = recode[idx++];
                            array.push(repeat === "repeat" ? 1 : 0);

                            const smooth = recode[idx++];
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
     * @param  {Float32Array} matrix
     * @param  {Float32Array} [color_transform=null]
     * @return {void}
     * @method
     * @private
     */
    _$runTransformCommand (context, matrix, color_transform = null)
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
            return ;
        }

        let xMin =  Number.MAX_VALUE;
        let xMax = -Number.MAX_VALUE;
        let yMin =  Number.MAX_VALUE;
        let yMax = -Number.MAX_VALUE;

        const recode = this._$recode;
        const length = recode.length;
        for (let idx = 0; idx < length; ) {

            switch (recode[idx++]) {

                case Graphics.BEGIN_PATH:
                    context.beginPath();
                    break;

                case Graphics.MOVE_TO:
                    {
                        const x = recode[idx++];
                        const y = recode[idx++];

                        const tx = x * matrix[0] + y * matrix[2];
                        const ty = x * matrix[1] + y * matrix[3];

                        xMin = $Math.min(tx, xMin);
                        xMax = $Math.max(tx, xMax);
                        yMin = $Math.min(ty, yMin);
                        yMax = $Math.max(ty, yMax);

                        context.moveTo(tx, ty);
                    }
                    break;

                case Graphics.LINE_TO:
                    {
                        const x = recode[idx++];
                        const y = recode[idx++];

                        const tx = x * matrix[0] + y * matrix[2];
                        const ty = x * matrix[1] + y * matrix[3];

                        xMin = $Math.min(tx, xMin);
                        xMax = $Math.max(tx, xMax);
                        yMin = $Math.min(ty, yMin);
                        yMax = $Math.max(ty, yMax);

                        context.lineTo(tx, ty);
                    }
                    break;

                case Graphics.CURVE_TO:
                    {
                        const cx = recode[idx++];
                        const cy = recode[idx++];
                        const x  = recode[idx++];
                        const y  = recode[idx++];

                        const ctx = cx * matrix[0] + cy * matrix[2];
                        const cty = cx * matrix[1] + cy * matrix[3];
                        const tx  = x  * matrix[0] + y  * matrix[2];
                        const ty  = x  * matrix[1] + y  * matrix[3];

                        xMin = $Math.min(ctx, xMin);
                        xMax = $Math.max(ctx, xMax);
                        yMin = $Math.min(cty, yMin);
                        yMax = $Math.max(cty, yMax);

                        xMin = $Math.min(tx, xMin);
                        xMax = $Math.max(tx, xMax);
                        yMin = $Math.min(ty, yMin);
                        yMax = $Math.max(ty, yMax);

                        context.quadraticCurveTo(ctx, cty, tx, ty);
                    }
                    break;

                case Graphics.CLOSE_PATH:
                    context.closePath();
                    break;

                case Graphics.CUBIC:
                    {
                        const cp1x = recode[idx++];
                        const cp1y = recode[idx++];
                        const cp2x = recode[idx++];
                        const cp2y = recode[idx++];
                        const x    = recode[idx++];
                        const y    = recode[idx++];

                        const cp1tx = cp1x * matrix[0] + cp1y * matrix[2];
                        const cp1ty = cp1x * matrix[1] + cp1y * matrix[3];
                        const cp2tx = cp2x * matrix[0] + cp2y * matrix[2];
                        const cp2ty = cp2x * matrix[1] + cp2y * matrix[3];
                        const tx    = x * matrix[0] + y * matrix[2];
                        const ty    = x * matrix[1] + y * matrix[3];

                        xMin = $Math.min(cp1tx, xMin);
                        xMax = $Math.max(cp1tx, xMax);
                        yMin = $Math.min(cp1ty, yMin);
                        yMax = $Math.max(cp1ty, yMax);

                        xMin = $Math.min(cp2tx, xMin);
                        xMax = $Math.max(cp2tx, xMax);
                        yMin = $Math.min(cp2ty, yMin);
                        yMax = $Math.max(cp2ty, yMax);

                        xMin = $Math.min(tx, xMin);
                        xMax = $Math.max(tx, xMax);
                        yMin = $Math.min(ty, yMin);
                        yMax = $Math.max(ty, yMax);

                        context.bezierCurveTo(cp1tx, cp1ty, cp2tx, cp2ty, tx, ty);
                    }
                    break;

                case Graphics.ARC:
                    {
                        const x = recode[idx++];
                        const y = recode[idx++];
                        const radius = recode[idx++];

                        const tx = x * matrix[0] + y * matrix[2];
                        const ty = x * matrix[1] + y * matrix[3];

                        xMin = $Math.min(tx, xMin);
                        xMax = $Math.max(tx, xMax);
                        yMin = $Math.min(ty, yMin);
                        yMax = $Math.max(ty, yMax);

                        context.arc(tx, ty, radius, 0, 2 * $Math.PI);
                    }
                    break;

                case Graphics.BITMAP_FILL:
                    {

                        context._$matrix[6] -= xMin * context._$matrix[0] + yMin * context._$matrix[3];
                        context._$matrix[7] -= xMin * context._$matrix[1] + yMin * context._$matrix[4];

                        context.save();

                        const bitmapData = recode[idx++];
                        const matrix     = recode[idx++];
                        const repeat     = recode[idx++];
                        const smooth     = recode[idx++];

                        context.fillStyle = context.createPattern(
                            bitmapData._$texture, repeat, color_transform
                        );

                        if (matrix) {
                            context.transform(
                                matrix[0], matrix[1], matrix[2],
                                matrix[3], matrix[4], matrix[5]
                            );
                        }

                        context._$imageSmoothingEnabled = smooth;
                        context.fill();

                        // restore
                        context.restore();
                        context._$imageSmoothingEnabled = false;

                    }
                    break;

                default:
                    break;

            }

        }
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
        context, color_transform = null, is_clip = false, options = null
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

        const recode = this._$recode;
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

                        const fillStyle = context._$contextStyle;

                        fillStyle._$fillStyle[0] = recode[idx++] / 255;
                        fillStyle._$fillStyle[1] = recode[idx++] / 255;
                        fillStyle._$fillStyle[2] = recode[idx++] / 255;
                        fillStyle._$fillStyle[3] = color_transform[3] !== 1 || color_transform[7] !== 0
                            ? $Math.max(0, $Math.min(recode[idx++] * color_transform[3] + color_transform[7], 255)) / 255
                            : recode[idx++] / 255;

                        context._$style = fillStyle;
                    }
                    break;

                case Graphics.END_FILL:

                    if (options
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

                        const strokeStyle = context._$contextStyle;

                        strokeStyle._$strokeStyle[0] = recode[idx++] / 255;
                        strokeStyle._$strokeStyle[1] = recode[idx++] / 255;
                        strokeStyle._$strokeStyle[2] = recode[idx++] / 255;
                        strokeStyle._$strokeStyle[3] = color_transform[3] !== 1 || color_transform[7] !== 0
                            ? $Math.max(0, $Math.min(recode[idx++] * color_transform[3] + color_transform[7], 255)) / 255
                            : recode[idx++] / 255;

                        context._$style = strokeStyle;
                    }
                    break;

                case Graphics.END_STROKE:

                    if (options
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
                        if (options
                            && context.isPointInPath(options.x, options.y)
                        ) {
                            return true;
                        }

                        if (is_clip || options) {
                            idx += 6;
                            continue;
                        }

                        const type          = recode[idx++];
                        const stops         = recode[idx++];
                        const matrix        = recode[idx++];
                        const spread        = recode[idx++];
                        const interpolation = recode[idx++];
                        const focal         = recode[idx++];

                        let css = null;
                        if (type === GradientType.LINEAR) {

                            const xy = Util.$linearGradientXY(matrix);
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

                        const length = stops.length;
                        for (let idx = 0; idx < length; ++idx) {

                            const color = stops[idx];

                            if (color_transform) {

                                css.addColorStop(color.ratio, Util.$getFloat32Array4(
                                    $Math.max(0, $Math.min(color.R * color_transform[0] + color_transform[4], 255)) | 0,
                                    $Math.max(0, $Math.min(color.G * color_transform[1] + color_transform[5], 255)) | 0,
                                    $Math.max(0, $Math.min(color.B * color_transform[2] + color_transform[6], 255)) | 0,
                                    $Math.max(0, $Math.min(color.A * color_transform[3] + color_transform[7], 255)) | 0
                                ));

                            } else {

                                css.addColorStop(color.ratio, Util.$getFloat32Array4(
                                    color.R, color.G, color.B, color.A
                                ));

                            }

                        }

                        context.fillStyle = css;
                        context.fill();

                        if (type === GradientType.RADIAL) {
                            context.restore();
                        }
                    }
                    break;

                case Graphics.GRADIENT_STROKE:
                    {
                        if (options
                            && context.isPointInStroke(options.x, options.y)
                        ) {
                            return true;
                        }

                        if (is_clip || options) {
                            idx += 12;
                            continue;
                        }

                        context.lineWidth  = recode[idx++];
                        context.lineCap    = recode[idx++];
                        context.lineJoin   = recode[idx++];
                        context.miterLimit = recode[idx++];

                        const type          = recode[idx++];
                        const stops         = recode[idx++];
                        const matrix        = recode[idx++];
                        const spread        = recode[idx++];
                        const interpolation = recode[idx++];
                        const focal         = recode[idx++];

                        let css = null;
                        if (type === GradientType.LINEAR) {

                            const xy = Util.$linearGradientXY(matrix);
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

                        const length = stops.length;
                        for (let idx = 0; idx < length; ++idx) {

                            const color = stops[idx];

                            if (color_transform) {

                                css.addColorStop(color.ratio, Util.$getFloat32Array4(
                                    $Math.max(0, $Math.min(color.R * color_transform[0] + color_transform[4], 255)) | 0,
                                    $Math.max(0, $Math.min(color.G * color_transform[1] + color_transform[5], 255)) | 0,
                                    $Math.max(0, $Math.min(color.B * color_transform[2] + color_transform[6], 255)) | 0,
                                    $Math.max(0, $Math.min(color.A * color_transform[3] + color_transform[7], 255)) | 0
                                ));

                            } else {

                                css.addColorStop(color.ratio, Util.$getFloat32Array4(
                                    color.R, color.G, color.B, color.A
                                ));

                            }

                        }

                        context.strokeStyle = css;
                        context.stroke();

                        if (type === GradientType.RADIAL) {
                            context.restore();
                        }

                    }
                    break;

                case Graphics.BITMAP_FILL:
                    {
                        if (options
                            && context.isPointInPath(options.x, options.y)
                        ) {
                            return true;
                        }

                        if (is_clip || options) {
                            idx += 6;
                            continue;
                        }

                        context.save();

                        const bitmapData = recode[idx++];
                        const matrix     = recode[idx++];
                        const repeat     = recode[idx++];
                        const smooth     = recode[idx++];

                        if (matrix) {
                            context.transform(
                                matrix[0], matrix[1], matrix[2],
                                matrix[3], matrix[4], matrix[5]
                            );
                        }

                        if (repeat === "no-repeat"
                            && bitmapData.width  === this._$xMax - this._$xMin
                            && bitmapData.height === this._$yMax - this._$yMin
                        ) {

                            context.drawImage(bitmapData._$texture,
                                0, 0, bitmapData.width, bitmapData.height
                            );

                        } else {

                            context.fillStyle = context.createPattern(
                                bitmapData._$texture, repeat, color_transform
                            );

                            context._$imageSmoothingEnabled = smooth;
                            context.fill();

                        }

                        // restore
                        context.restore();
                        context._$imageSmoothingEnabled = false;

                    }
                    break;

                case Graphics.BITMAP_STROKE:
                    {
                        if (options
                            && context.isPointInStroke(options.x, options.y)
                        ) {
                            return true;
                        }

                        if (is_clip || options) {
                            idx += 9;
                            continue;
                        }

                        context.save();

                        context.lineWidth  = recode[idx++];
                        context.lineCap    = recode[idx++];
                        context.lineJoin   = recode[idx++];
                        context.miterLimit = recode[idx++];

                        const bitmapData = recode[idx++];
                        const matrix     = recode[idx++];
                        const repeat     = recode[idx++];
                        const smooth     = recode[idx++];

                        if (matrix) {
                            context.transform(
                                matrix[0], matrix[1], matrix[2],
                                matrix[3], matrix[4], matrix[5]
                            );
                        }

                        context.strokeStyle = context.createPattern(
                            bitmapData._$texture, repeat, color_transform
                        );

                        context._$imageSmoothingEnabled = smooth;
                        context.stroke();

                        // restore
                        context.restore();
                        context._$imageSmoothingEnabled = false;

                    }
                    break;

                default:
                    break;

            }
        }

        return false;
    }
}
