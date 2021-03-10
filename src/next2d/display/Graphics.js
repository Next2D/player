/**
 * @class
 * @memberOf next2d.display
 */
class Graphics
{
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
     * @constructor
     * @public
     */
    constructor ()
    {
        this._$maxAlpha      = 0;
        this._$displayObject = null;
        this._$recode        = Util.$getArray();
        this._$fills         = Util.$getArray();
        this._$lines         = Util.$getArray();
        this._$fillType      = 0;
        this._$fillStyleR    = 0;
        this._$fillStyleG    = 0;
        this._$fillStyleB    = 0;
        this._$fillStyleA    = 0;
        this._$caps          = null;
        this._$miterLimit    = 0;
        this._$lineWidth     = 0;
        this._$lineType      = 0;
        this._$lineStyleR    = 0;
        this._$lineStyleG    = 0;
        this._$lineStyleB    = 0;
        this._$lineStyleA    = 0;
        this._$doFill        = false;
        this._$doLine        = false;
        this._$xMin          = Util.$MAX_VALUE;
        this._$xMax          = -Util.$MAX_VALUE;
        this._$yMin          = Util.$MAX_VALUE;
        this._$yMax          = -Util.$MAX_VALUE;
        this._$pointerX      = 0;
        this._$pointerY      = 0;
        this._$canDraw       = false;
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
    static toString()
    {
        return "[class Graphics]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return  {string}
     * @default next2d.display:Bitmap
     * @const
     * @static
     */
    static get namespace ()
    {
        return "next2d.display:Graphics";
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
     * @default next2d.display:Graphics
     * @const
     * @static
     */
    get namespace ()
    {
        return "next2d.display:Graphics";
    }

    /**
     * @return {number}
     * @default 0
     * @const
     * @static
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
     */
    static get BITMAP_FILL ()
    {
        return 13;
    }

    /**
     * TODO
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
        this._$maxAlpha = 1;

        // init fill style
        this.endFill();

        // start
        this._$doFill  = true;
        this._$canDraw = true;

        // beginPath
        this._$margePath(Util.$getArray(Graphics.BEGIN_PATH));

        // TODO

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
        // valid
        color = Util.$clamp(Util.$toColorInt(color), 0, 0xffffff, 0);
        alpha = Util.$clamp(alpha, 0, 1, 1);

        this._$maxAlpha = Util.$max(this._$maxAlpha, alpha);

        // end fill
        if (this._$doFill) {
            this.endFill();
        }

        // start
        this._$doFill  = true;
        this._$canDraw = true;

        // beginPath
        this._$margePath(Util.$getArray(Graphics.BEGIN_PATH));

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
     * TODO
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
     * @param  {string} [spread_method=pad]
     * @param  {string} [interpolation_method=rgb]
     * @param  {number} [focal_point_ratio=0]
     * @return {Graphics}
     * @method
     * @public
     */
    beginGradientFill (
        type, colors, alphas, ratios, matrix = null,
        spread_method = "pad", interpolation_method = "rgb", focal_point_ratio = 0
    ) {

    }

    /**
     * @description この Graphics オブジェクトに描画されているグラフィックをクリアし、
     *              塗りと線のスタイルの設定をリセットします。
     *              Clears the graphics that were drawn to this Graphics object,
     *              and resets fill and line style settings.
     *
     * @return {void}
     * @method
     * @public
     */
    clear ()
    {
        // origin param clear
        this._$maxAlpha     = 0;
        this._$lineWidth    = 0;
        this._$caps         = null;
        this._$doFill       = false;
        this._$doLine       = false;
        this._$pointerX     = 0;
        this._$pointerY     = 0;
        this._$canDraw      = false;

        // bounds size
        this._$xMin         = Util.$MAX_VALUE;
        this._$xMax         = -Util.$MAX_VALUE;
        this._$yMin         = Util.$MAX_VALUE;
        this._$yMax         = -Util.$MAX_VALUE;

        // reset array
        if (this._$recode.length) {
            this._$recode.length = 0;
        }
        if (this._$fills.length) {
            this._$fills.length = 0;
        }
        if (this._$lines.length) {
            this._$lines.length = 0;
        }

        // restart
        this._$restart();
    }

    /**
     * TODO
     * @description すべての描画コマンドをソース Graphics オブジェクトから、呼び出し Graphics オブジェクトにコピーします。
     *              Copies all of drawing commands from the source Graphics object into the calling Graphics object.
     *
     * @return {Graphics}
     * @method
     * @public
     */
    clone ()
    {

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

        anchor_x = +anchor_x * Util.$TWIPS || 0;
        anchor_y = +anchor_y * Util.$TWIPS || 0;

        if (this._$pointerX === anchor_x && this._$pointerY === anchor_y) {
            return this;
        }

        control_x1 = +control_x1 * Util.$TWIPS || 0;
        control_y1 = +control_y1 * Util.$TWIPS || 0;
        control_x2 = +control_x2 * Util.$TWIPS || 0;
        control_y2 = +control_y2 * Util.$TWIPS || 0;

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

        anchor_x = +anchor_x * Util.$TWIPS || 0;
        anchor_y = +anchor_y * Util.$TWIPS || 0;

        if (this._$pointerX === anchor_x && this._$pointerY === anchor_y) {
            return this;
        }

        control_x = +control_x * Util.$TWIPS || 0;
        control_y = +control_y * Util.$TWIPS || 0;

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
        x      = +x * Util.$TWIPS || 0;
        y      = +y * Util.$TWIPS || 0;
        radius = +radius * Util.$TWIPS || 0;

        this._$setBounds(x - radius, y - radius);
        this._$setBounds(x + radius, y + radius);

        this._$margePath(Util.$getArray(
            Graphics.ARC,
            x, y, radius
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
        const c  = 4 / 3 * (Util.$SQRT2 - 1);
        const cw = c * hw;
        const ch = c * hh;

        this.moveTo(x0, y);
        this.cubicCurveTo(x0 + cw, y,       x1,      y0 - ch, x1, y0);
        this.cubicCurveTo(x1,      y0 + ch, x0 + cw, y1,      x0, y1);
        this.cubicCurveTo(x0 - cw, y1,      x,       y0 + ch, x,  y0);
        this.cubicCurveTo(x,       y0 - ch, x0 - cw, y,       x0, y );

        return this;
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

        this
            .moveTo(x,    y)
            .lineTo(xMax, y)
            .lineTo(xMax, yMax)
            .lineTo(x,    yMax)
            .lineTo(x,    y);

        return this;
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
        const c   = 4 / 3 * (Util.$SQRT2 - 1);
        const cw  = c * hew;
        const ch  = c * heh;

        const dx0 = x   + hew;
        const dx1 = x   + width;
        const dx2 = dx1 - hew;

        const dy0 = y   + heh;
        const dy1 = y   + height;
        const dy2 = dy1 - heh;

        this.moveTo(dx0, y);
        this.lineTo(dx2, y);
        this.cubicCurveTo(dx2 + cw, y, dx1, dy0 - ch, dx1, dy0);
        this.lineTo(dx1, dy2);
        this.cubicCurveTo(dx1, dy2 + ch, dx2 + cw, dy1, dx2, dy1);
        this.lineTo(dx0, dy1);
        this.cubicCurveTo(dx0 - cw, dy1, x, dy2 + ch, x, dy2);
        this.lineTo(x, dy0);
        this.cubicCurveTo(x, dy0 - ch, dx0 - cw, y, dx0, y);

        return this;
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
        if (this._$doFill) {

            this._$recode.push.apply(this._$recode, this._$fills);

            // clear
            this._$fills.length = 0;

            // fill
            if (this._$fillType === Graphics.FILL_STYLE) {

                this._$recode.push(this._$fillType);
                this._$recode.push(this._$fillStyleR);
                this._$recode.push(this._$fillStyleG);
                this._$recode.push(this._$fillStyleB);
                this._$recode.push(this._$fillStyleA);
                this._$recode.push(Graphics.END_FILL);

                // reset
                this._$fillType   = 0;
                this._$fillStyleR = 0;
                this._$fillStyleG = 0;
                this._$fillStyleB = 0;
                this._$fillStyleA = 0;
            }

        }

        this._$doFill = false;

        // restart
        this._$restart();

        return this;
    }

    /**
     * TODO
     *
     * @return {Graphics}
     * @method
     * @public
     */
    endLine ()
    {
        if (this._$doLine) {

            this._$recode.push.apply(this._$recode, this._$lines);

            // clear
            this._$lines.length = 0;

            // fill
            if (this._$lineType === Graphics.STROKE_STYLE) {

                this._$recode.push(this._$lineType);
                this._$recode.push(this._$lineStyleR);
                this._$recode.push(this._$lineStyleG);
                this._$recode.push(this._$lineStyleB);
                this._$recode.push(this._$lineStyleA);
                this._$recode.push(Graphics.END_STROKE);

                // reset
                this._$lineType   = 0;
                this._$lineStyleR = 0;
                this._$lineStyleG = 0;
                this._$lineStyleB = 0;
                this._$lineStyleA = 0;
            }
        }

        this._$doLine = false;

        // restart
        this._$restart();

        return this;
    }

    /**
     * TODO
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
        spread_method = "pad", interpolation_method = "rgb", focal_point_ratio = 0
    ) {

    }

    /**
     * TODO
     * @description lineTo() メソッドや drawCircle() メソッドなど、
     *              Graphics のメソッドの後続の呼び出しに使用する線スタイルを指定します。
     *              Specifies a line style used for subsequent calls
     *              to Graphics methods such as the lineTo() method
     *              or the drawCircle() method.
     *
     * @param  {number}  [thickness=NaN]
     * @param  {number}  [color=0]
     * @param  {number}  [alpha=1]
     * @param  {boolean} [pixel_hinting=false]
     * @param  {string}  [scale_mode=LineScaleMode.NORMAL]
     * @param  {string}  [caps=null]
     * @param  {string}  [joints=null]
     * @param  {number}  [miter_limit=3]
     * @return {Graphics}
     * @method
     * @public
     */
    lineStyle (
        thickness = NaN, color = 0, alpha = 1, pixel_hinting = false,
        scale_mode = "normal", caps = null, joints = null, miter_limit = 3
    ) {


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
        x = +x * Util.$TWIPS || 0;
        y = +y * Util.$TWIPS || 0;

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
        x = +x * Util.$TWIPS || 0;
        y = +y * Util.$TWIPS || 0;

        this._$pointerX = x;
        this._$pointerY = y;

        this._$setBounds(x, y);

        this._$margePath(Util.$getArray(Graphics.MOVE_TO, x, y));

        // restart
        this._$restart();

        return this;
    }

    /**
     * @param  {CanvasToWebGLContext} context
     * @param  {Float32Array}  matrix
     * @param  {Float32Array}  color_transform
     * @param  {string} [blend_mode=BlendMode.NORMAL]
     * @param  {array}  [filters=null]
     * @return {void}
     * @method
     * @private
     */
    _$draw (
        context, matrix, color_transform,
        blend_mode = BlendMode.NORMAL, filters = null
    ) {

        if (!this._$maxAlpha) {
            return ;
        }

        const boundsBase = this._$getBounds();
        if (!boundsBase) {
            return ;
        }

        const alpha = Util.$clamp(
            color_transform[3] + (color_transform[7] / 255), 0, 1
        );

        const displayObject = this._$displayObject;

        // set grid data
        let hasGrid = displayObject._$scale9Grid !== null;

        // 9スライスを有効にしたオブジェクトが回転・傾斜成分を含む場合は、9スライスは無効になる
        let parentMatrix = null;
        if (hasGrid) {
            parentMatrix = displayObject._$transform._$rawMatrix();
            hasGrid = hasGrid
                && (Util.$abs(parentMatrix[1]) < 0.001)
                && (Util.$abs(parentMatrix[2]) < 0.0001);
        }

        // size
        const bounds = Util.$boundsMatrix(boundsBase, matrix);
        const xMax   = bounds.xMax;
        const xMin   = bounds.xMin;
        const yMax   = bounds.yMax;
        const yMin   = bounds.yMin;
        Util.$poolBoundsObject(bounds);

        let width  = Util.$ceil(Util.$abs(xMax - xMin));
        let height = Util.$ceil(Util.$abs(yMax - yMin));
        if (!width || !height) {
            return;
        }

        if (0 > (xMin + width) || 0 > (yMin + height)) {
            return;
        }

        // cache current buffer
        const currentBuffer = context.frameBuffer.currentAttachment;
        if (xMin > currentBuffer.width || yMin > currentBuffer.height) {
            return;
        }


        // resize
        const textureScale = context._$textureScale(width, height);
        if (textureScale < 1) {
            width  *= textureScale;
            height *= textureScale;
        }


        // get cache
        color_transform[3] = 1; // plain alpha
        const id        = displayObject._$instanceId;
        const cacheKeys = Util
            .$cacheStore()
            .generateShapeKeys(id, matrix, color_transform);

        // cache
        let texture = Util.$cacheStore().get(cacheKeys);
        if (!texture) {

            // create cache buffer
            const buffer = context
                .frameBuffer
                .createCacheAttachment(width, height, true);
            context._$bind(buffer);


            // reset
            Util.$resetContext(context);
            context.setTransform(
                matrix[0], matrix[1], matrix[2], matrix[3],
                matrix[4] - xMin,
                matrix[5] - yMin
            );

            if (hasGrid) {

                const player = Util.$currentPlayer();
                const mScale = player._$scale * player._$ratio / 20;
                const baseMatrix = Util.$getFloat32Array6(mScale, 0, 0, mScale, 0, 0);

                const pMatrix = Util.$multiplicationMatrix(
                    baseMatrix, parentMatrix
                );

                Util.$poolFloat32Array6(baseMatrix);

                const aMatrixBase = displayObject
                    ._$parent
                    ._$transform
                    ._$calculateConcatenatedMatrix()
                    ._$matrix;

                const aMatrix = Util.$getFloat32Array6(
                    aMatrixBase[0], aMatrixBase[1], aMatrixBase[2], aMatrixBase[3],
                    aMatrixBase[4] * mScale - xMin,
                    aMatrixBase[5] * mScale - yMin
                );

                const apMatrix = Util.$multiplicationMatrix(aMatrix, pMatrix);
                const aOffsetX = apMatrix[4] - (matrix[4] - xMin);
                const aOffsetY = apMatrix[5] - (matrix[5] - yMin);
                Util.$poolFloat32Array6(apMatrix);

                const parentBounds = Util.$boundsMatrix(boundsBase, pMatrix);
                const parentXMax   = +parentBounds.xMax;
                const parentXMin   = +parentBounds.xMin;
                const parentYMax   = +parentBounds.yMax;
                const parentYMin   = +parentBounds.yMin;
                const parentWidth  = Util.$ceil(Util.$abs(parentXMax - parentXMin));
                const parentHeight = Util.$ceil(Util.$abs(parentYMax - parentYMin));

                Util.$poolBoundsObject(parentBounds);

                context.grid.enable(
                    parentXMin, parentYMin, parentWidth, parentHeight,
                    boundsBase, displayObject._$scale9Grid,
                    pMatrix[0], pMatrix[1], pMatrix[2], pMatrix[3], pMatrix[4], pMatrix[5],
                    aMatrix[0], aMatrix[1], aMatrix[2], aMatrix[3], aMatrix[4] - aOffsetX, aMatrix[5] - aOffsetY
                );

                Util.$poolFloat32Array6(pMatrix);
                Util.$poolFloat32Array6(aMatrix);
            }

            this._$doDraw(context, color_transform, false);

            if (hasGrid) {
                context.grid.disable();
            }

            texture = context
                .frameBuffer
                .getTextureFromCurrentAttachment();

            // set cache
            Util.$cacheStore().set(cacheKeys, texture);

            // release buffer
            context.frameBuffer.releaseAttachment(buffer, false);

            // end draw and reset current buffer
            context._$bind(currentBuffer);

        }


        let isFilter = false;
        let offsetX  = 0;
        let offsetY  = 0;
        if (filters && filters.length) {

            const canApply = displayObject._$canApply(filters);
            if (canApply) {

                isFilter = true;

                const cacheKeys = [displayObject._$instanceId, "f"];
                let cache = Util.$cacheStore().get(cacheKeys);

                const updated = displayObject._$isFilterUpdated(
                    width, height, matrix, color_transform, filters, canApply
                );

                if (!cache || updated) {

                    // cache clear
                    if (cache) {

                        Util.$cacheStore().set(cacheKeys, null);
                        cache.layerWidth     = 0;
                        cache.layerHeight    = 0;
                        cache._$offsetX      = 0;
                        cache._$offsetY      = 0;
                        cache.matrix         = null;
                        cache.colorTransform = null;
                        context.frameBuffer.releaseTexture(cache);

                        cache = null;
                    }


                    const currentAttachment = context.frameBuffer.currentAttachment;

                    const buffer = context
                        .frameBuffer
                        .createCacheAttachment(width, height, false);
                    context._$bind(buffer);

                    const mat = Util.$multiplicationMatrix(
                        matrix, Util.$MATRIX_ARRAY_20_0_0_20_0_0
                    );


                    Util.$resetContext(context);
                    context.setTransform(
                        mat[0], mat[1], mat[2],
                        mat[3], mat[4] - xMin, mat[5] - yMin
                    );
                    context.drawImage(texture,
                        0, 0, texture.width, texture.height,
                        color_transform
                    );

                    const targetTexture = context
                        .frameBuffer
                        .getTextureFromCurrentAttachment()

                    context._$bind(currentAttachment);

                    texture = displayObject._$getFilterTexture(
                        context, filters, targetTexture, matrix, color_transform
                    );

                    context
                        .frameBuffer
                        .releaseAttachment(buffer, true);

                    Util.$cacheStore().set(cacheKeys, texture);

                }

                if (cache) {
                    texture = cache;
                }

                Util.$poolArray(cacheKeys);

                offsetX = texture._$offsetX;
                offsetY = texture._$offsetY;
            }

        }

        // reset
        Util.$resetContext(context);

        // draw
        context._$globalAlpha = alpha;
        context._$imageSmoothingEnabled = true;
        context._$globalCompositeOperation = blend_mode;

        if (isFilter) {
            context.setTransform(1, 0, 0, 1, matrix[4], matrix[5]);
            context.drawImage(texture,
                -offsetX - (matrix[4] - xMin), -offsetY - (matrix[5] - yMin),
                texture.width, texture.height, color_transform
            );
        } else {
            context.setTransform(1, 0, 0, 1, 0, 0);
            context.drawImage(texture, xMin, yMin, width, height, color_transform);
        }

        // pool
        Util.$poolArray(cacheKeys);
        if (parentMatrix) {
            Util.$poolMatrix(parentMatrix);
        }
        Util.$poolBoundsObject(boundsBase);

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

        if (!this._$command) {
            this._$command = this._$buildCommand();
        }

        // draw
        context.beginPath();
        this._$command(context, color_transform, is_clip);

        // clip or filter and blend
        if (is_clip) {
            context.clip();
        }
    }

    /**
     * @param  {Float32Array} [matrix=null]
     * @return {object}
     * @method
     * @private
     */
    _$getBounds (matrix = null)
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
        if (this._$command) {

            this._$command = null;

            if (this._$displayObject
                && !this._$displayObject._$isUpdated()
            ) {

                this._$displayObject._$doChanged();
                Util.$isUpdated = true;

                Util
                    .$cacheStore()
                    .removeCache(
                        this._$displayObject._$characterId
                        || this._$displayObject._$instanceId
                    );

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
        this._$xMin = Util.$min(this._$xMin, x);
        this._$xMax = Util.$max(this._$xMax, x);
        this._$yMin = Util.$min(this._$yMin, y);
        this._$yMax = Util.$max(this._$yMax, y);
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
        this._$xMin = Util.$min(this._$xMin, x);
        this._$xMax = Util.$max(this._$xMax, x);
        this._$yMin = Util.$min(this._$yMin, y);
        this._$yMax = Util.$max(this._$yMax, y);
    }

    /**
     * @param {array} data
     * @method
     * @private
     */
    _$margePath = function (data)
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
     * @return {Function}
     * @method
     * @private
     */
    _$buildCommand ()
    {
        if (this._$doFill) {
            this.endFill();
        }

        if (this._$doLine) {
            this.endLine();
        }

        let command = "";

        const recode = this._$recode;
        const length = recode.length;
        for (let idx = 0; idx < length; ) {

            switch (recode[idx++]) {

                case Graphics.BEGIN_PATH:
                    command += GraphicsPathCommand.BEGIN_PATH();
                    break;

                case Graphics.MOVE_TO:
                    command += GraphicsPathCommand.MOVE_TO(recode[idx++], recode[idx++]);
                    break;

                case Graphics.LINE_TO:
                    command += GraphicsPathCommand.LINE_TO(recode[idx++], recode[idx++]);
                    break;

                case Graphics.CURVE_TO:
                    command += GraphicsPathCommand.CURVE_TO(
                        recode[idx++], recode[idx++], recode[idx++], recode[idx++]
                    );
                    break;

                case Graphics.FILL_STYLE:
                    command += GraphicsPathCommand.FILL_STYLE(
                        recode[idx++], recode[idx++],
                        recode[idx++], recode[idx++]
                    );
                    break;

                case Graphics.END_FILL:
                    command += GraphicsPathCommand.END_FILL();
                    break;

                case Graphics.STROKE_STYLE:
                    break;

                case Graphics.END_STROKE:
                    break;

                case Graphics.CLOSE_PATH:
                    break;

                case Graphics.CUBIC:
                    command += GraphicsPathCommand.CUBIC(
                        recode[idx++], recode[idx++],
                        recode[idx++], recode[idx++],
                        recode[idx++], recode[idx++]
                    );
                    break;

                case Graphics.ARC:
                    break;

                case Graphics.GRADIENT_FILL:
                case Graphics.GRADIENT_STROKE:
                    break;

                case Graphics.BITMAP_FILL:
                    break;

            }

        }

        return Function("ctx", "ct", "is_clip", "options", command);
    }
}