/**
 * TextField クラスは、テキストの表示と入力用の表示オブジェクトを作成するために使用されます。
 * プロパティインスペクターを使用して、テキストフィールドにインスタンス名を付けることができます。
 * また、TextField クラスのメソッドとプロパティを使用して、JavaScript でテキストフィールドを操作できます。
 *
 * The TextField class is used to create display objects for text display and input.
 * You can give a text field an instance name in the Property inspector
 * and use the methods and properties of the TextField class to manipulate it with JavaScript.
 *
 * @class
 * @memberOf next2d.text
 * @extends  InteractiveObject
 */
class TextField extends InteractiveObject
{
    /**
     * @constructor
     * @public
     */
    constructor()
    {
        super();

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$background = false;

        /**
         * @type {number}
         * @default 0xffffff
         * @private
         */
        this._$backgroundColor = 0xffffff;

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$border = false;

        /**
         * @type {number}
         * @default 0x000000
         * @private
         */
        this._$borderColor = 0x000000;

        /**
         * @type {string}
         * @default ""
         * @private
         */
        this._$htmlText = "";

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$multiline = false;

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$selectable = true;

        /**
         * @type {string}
         * @default ""
         * @private
         */
        this._$text = "";

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$wordWrap = false;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$scrollH = 0;

        /**
         * @type {number}
         * @default 1
         * @private
         */
        this._$scrollV = 1;

        /**
         * @type {number}
         * @default null
         * @private
         */
        this._$maxScrollV = null;

        /**
         * @type {number}
         * @default null
         * @private
         */
        this._$maxScrollH = null;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$maxChars = 0;

        /**
         * @type {number}
         * @default null
         * @private
         */
        this._$textColor = null;

        // TextFormat
        const textFormat = new TextFormat();
        textFormat._$setDefault(this);

        /**
         * @type {TextFormat}
         * @private
         */
        this._$defaultTextFormat = textFormat;

        /**
         * @type {TextFormat}
         * @private
         */
        this._$decisionTextFormat = textFormat;

        /**
         * @type {string}
         * @default ""
         * @private
         */
        this._$rawHtmlText = "";

        /**
         * @type {object}
         * @private
         */
        this._$bounds = {
            "xMin": 0 ,
            "xMax": 100,
            "yMin": 0 ,
            "yMax": 100
        };

        /**
         * @type {object}
         * @private
         */
        this._$originBounds = {
            "xMin": 0 ,
            "xMax": 100,
            "yMin": 0 ,
            "yMax": 100
        };

        /**
         * @type {string}
         * @default null
         * @private
         */
        this._$restrict = null;

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$isHTML = false;

        /**
         * @type {array}
         * @default null
         * @private
         */
        this._$textData = null;

        /**
         * @type {boolean}
         * @default true
         * @private
         */
        this._$renew = true;

        /**
         * @type {number}
         * @default null
         * @private
         */
        this._$textHeight = null;

        /**
         * @type {number}
         * @default null
         * @private
         */
        this._$textWidth = null;

        /**
         * @type {array}
         * @default null
         * @private
         */
        this._$widthTable = null;

        /**
         * @type {HTMLTextAreaElement}
         * @default null
         * @private
         */
        this._$textarea = null;

        /**
         * @type {string}
         * @default TextFieldAutoSize.NONE
         * @private
         */
        this._$autoSize = TextFieldAutoSize.NONE;

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$autoFontSize = false;

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$textAppending = false;

        /**
         * @type {array}
         * @default null
         * @private
         */
        this._$heightTable = null;

        /**
         * @type {array}
         * @default array
         * @private
         */
        this._$textFormatTable = [];

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$textAreaActive = false;

        /**
         * @type {number}
         * @default null
         * @private
         */
        this._$totalWidth = null;

        /**
         * @type {array}
         * @default null
         * @private
         */
        this._$objectTable = null;

        /**
         * @type {array}
         * @default null
         * @private
         */
        this._$imageData = null;

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$scroll = false;

        /**
         * @type {string}
         * @default null
         * @private
         */
        this._$type = TextFieldType.STATIC;

        /**
         * @type {array}
         * @default null
         * @private
         */
        this._$textHeightTable = null;
    }

    /**
     * @description 指定されたクラスのストリングを返します。
     *              Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default [class TextField]
     * @method
     * @static
     */
    static toString ()
    {
        return "[class TextField]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return  {string}
     * @default next2d.text.TextField
     * @const
     * @static
     */
    static get namespace ()
    {
        return "next2d.text.TextField";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return  {string}
     * @default [object TextField]
     * @method
     * @public
     */
    toString ()
    {
        return "[object TextField]";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @return  {string}
     * @default next2d.text.TextField
     * @const
     * @static
     */
    get namespace ()
    {
        return "next2d.text.TextField";
    }

    /**
     * @return  {string}
     * @default text
     * @const
     * @static
     */
    static get TEXT ()
    {
        return "text";
    }

    /**
     * @return  {string}
     * @default text
     * @const
     * @static
     */
    static get BREAK ()
    {
        return "break";
    }

    /**
     * @return  {string}
     * @default text
     * @const
     * @static
     */
    static get WRAP ()
    {
        return "wrap";
    }

    /**
     * @return  {string}
     * @default text
     * @const
     * @static
     */
    static get IMAGE ()
    {
        return "image";
    }

    /**
     * TODO
     * @description テキストサイズの自動的な拡大 / 縮小および整列を制御します。
     *              Controls automatic sizing and alignment of text size.
     *
     * @member {boolean}
     * @default false
     * @public
     */
    get autoFontSize ()
    {
        return this._$autoFontSize;
    }
    set autoFontSize (auto_font_size)
    {
        this._$autoFontSize = !!auto_font_size;
    }

    /**
     * @description テキストフィールドの自動的な拡大 / 縮小および整列を制御します。
     *              Controls automatic sizing and alignment of text fields.
     *
     * @member {string}
     * @default TextFieldAutoSize.NONE
     * @public
     */
    get autoSize ()
    {
        return this._$autoSize;
    }
    set autoSize (auto_size)
    {
        switch (auto_size) {

            case TextFieldAutoSize.CENTER:
            case TextFieldAutoSize.LEFT:
            case TextFieldAutoSize.RIGHT:
                this._$autoSize = auto_size;
                break;

            default:
                this._$autoSize = TextFieldAutoSize.NONE;
                break;

        }

        this._$reload();
    }

    /**
     * @description テキストフィールドに背景の塗りつぶしがあるかどうかを指定します。
     *              Specifies whether the text field has a background fill.
     *
     * @member {boolean}
     * @default false
     * @public
     */
    get background ()
    {
        return this._$background;
    }
    set background (background)
    {
        this._$background = !!background;
        this._$reset();
    }

    /**
     * @description テキストフィールドの背景の色です。
     *              The color of the text field background.
     *
     * @member {number}
     * @default 0xffffff
     * @public
     */
    get backgroundColor ()
    {
        return this._$backgroundColor;
    }
    set backgroundColor (background_color)
    {
        this._$backgroundColor = Util.$clamp(
            Util.$toColorInt(background_color), 0, 0xffffff, 0xffffff
        );
        this._$reset();
    }

    /**
     * @description テキストフィールドに境界線があるかどうかを指定します。
     *              Specifies whether the text field has a border.
     *
     * @member {boolean}
     * @default false
     * @public
     */
    get border ()
    {
        return this._$border;
    }
    set border (border)
    {
        this._$border = !!border;
        this._$reset();
    }

    /**
     * @description テキストフィールドの境界線の色です。
     *              The color of the text field border.
     *
     * @member {number}
     * @default 0x000000
     * @public
     */
    get borderColor ()
    {
        return this._$borderColor;
    }
    set borderColor (border_color)
    {
        this._$borderColor = Util.$clamp(
            Util.$toColorInt(border_color), 0, 0xffffff, 0
        );
        this._$reset();
    }

    /**
     * @description テキストに適用するフォーマットを指定します。
     *              Specifies the formatting to be applied to the text.
     *
     * @member {TextFormat}
     * @public
     */
    get defaultTextFormat ()
    {
        return this._$defaultTextFormat;
    }
    set defaultTextFormat (text_format)
    {
        if (text_format instanceof TextFormat) {

            text_format._$merge(this._$defaultTextFormat);
            text_format._$textField = this;

            this._$defaultTextFormat = text_format;
        }
    }

    /**
     * @description テキストフィールドの内容を HTML で表します。
     *              Contains the HTML representation of the text field contents.
     *
     * @member {string}
     * @default ""
     * @public
     */
    get htmlText ()
    {
        return this._$htmlText;
    }
    set htmlText (html_text)
    {
        if (this._$htmlText !== html_text) {
            this._$htmlText        = `${html_text}`;
            this._$rawHtmlText     = "";
            this._$text            = "";
            this._$isHTML          = true;
            this._$textFormatTable = [];
            this._$reload();
        }
    }

    /**
     * @description テキストフィールド内の文字数です。
     *              The int of characters in a text field.
     *
     * @member {number}
     * @readonly
     * @public
     */
    get length ()
    {
        return this.text.length;
    }

    /**
     * @description ユーザーが入力するときに、テキストフィールドに入力できる最大の文字数です。
     *              The maximum number of characters that the text field can contain,
     *              as entered by a user.
     *
     * @member {number}
     * @default 0
     * @public
     */
    get maxChars ()
    {
        return this._$maxChars;
    }
    set maxChars (max_chars)
    {
        this._$maxChars = max_chars | 0;
    }

    /**
     * TODO
     * @description scrollH の最大値です。
     *              The maximum value of scrollH.
     *
     * @member {number}
     * @readonly
     * @public
     */
    get maxScrollH ()
    {
        // TODO
        if (this._$maxScrollH === null) {
            this._$maxScrollH = 0;
        }
        return this._$maxScrollH;
    }

    /**
     * @description scrollV の最大値です。
     *              The maximum value of scrollV.
     *
     * @member {number}
     * @readonly
     * @public
     */
    get maxScrollV ()
    {
        if (this._$maxScrollV === null) {

            this._$maxScrollV = 1;

            this._$getTextData();

            const length    = this._$textHeightTable.length;
            const maxHeight = this.height;

            if (maxHeight > this.textHeight) {
                return this._$maxScrollV;
            }

            let textHeight = 0;

            let idx = 0;
            while (length > idx) {

                textHeight += this._$textHeightTable[idx];
                if (textHeight > maxHeight) {
                    break;
                }

                this._$maxScrollV++;
            }
        }
        return this._$maxScrollV;
    }

    /**
     * @description フィールドが複数行テキストフィールドであるかどうかを示します。
     *              Indicates whether field is a multiline text field.
     *
     * @member {boolean}
     * @default false
     * @public
     */
    get multiline ()
    {
        return this._$multiline;
    }
    set multiline (multiline)
    {
        this._$multiline = !!multiline;
        this._$reset();
    }

    /**
     * @description フィールドが複数行テキストフィールドであるかどうかを示します。
     *              Indicates whether field is a multiline text field.
     *
     * @member {number}
     * @readonly
     * @public
     */
    get numLines ()
    {
        if (this._$textData === null) {
            this._$getTextData();
        }
        return this._$objectTable.length;
    }

    /**
     * @description ユーザーがテキストフィールドに入力できる文字のセットを指定します。
     *              Indicates the set of characters that a user can enter into the text field.
     *
     * @member {string}
     * @default null
     * @public
     */
    get restrict ()
    {
        return this._$restrict;
    }
    set restrict (restrict)
    {
        this._$restrict = `${restrict}`;
    }

    /**
     * TODO
     * @description スクロール機能のON/OFFの制御。
     *              Control ON/OFF of the scroll function.
     *
     * @member {boolean}
     * @default false
     * @public
     */
    get scroll ()
    {
        return this._$scroll;
    }
    set scroll (scroll)
    {
        this._$scroll = !!scroll;
    }

    /**
     * TODO
     * @description 現在の水平スクロール位置です。
     *              The current horizontal scrolling position.
     *
     * @member {number}
     * @public
     */
    get scrollH ()
    {
        return this._$scrollH;
    }
    set scrollH (scroll_h)
    {
        scroll_h = Util.$clamp(scroll_h | 0, 0, this.maxScrollH);

        if (this._$scrollH !== scroll_h) {

            this._$scrollH = scroll_h;

            this._$reset();

            if (this.willTrigger(Event.SCROLL)) {
                this.dispatchEvent(new Event(Event.SCROLL, true));
            }
        }
    }

    /**
     * @description テキストフィールドのテキストの垂直位置です。
     *              The vertical position of text in a text field.
     *
     * @member {number}
     * @public
     */
    get scrollV ()
    {
        return this._$scrollV;
    }
    set scrollV (scroll_v)
    {
        scroll_v = Util.$clamp(scroll_v | 0, 1, this.maxScrollV);

        if (this._$scrollV !== scroll_v) {

            this._$scrollV = scroll_v;

            this._$reset();

            if (this.willTrigger(Event.SCROLL)) {
                this.dispatchEvent(new Event(Event.SCROLL, true));
            }
        }
    }

    /**
     * @description テキストフィールドが選択可能であるかどうかを示すブール値です。
     *              A Boolean value that indicates whether the text field is selectable.
     *
     * @member {boolean}
     * @default true
     * @public
     */
    get selectable ()
    {
        return this._$selectable;
    }
    set selectable (selectable)
    {
        this._$selectable = !!selectable;
    }

    /**
     * @description テキストフィールド内の現在のテキストであるストリングです。
     *              A string that is the current text in the text field.
     *
     * @member {string}
     * @default ""
     * @public
     */
    get text ()
    {
        if (!this._$isHTML) {
            return this._$text;
        }

        if (this._$rawHtmlText) {
            return this._$rawHtmlText;
        }

        let text = "";
        const textData = this._$getTextData();
        const length   = textData.length | 0;
        for (let idx = 1; idx < length; ++idx) {

            const object = textData[idx];
            switch (object.mode) {

                case TextField.TEXT:
                    text += object.text;
                    break;

                case TextField.BREAK:
                    text += "\r";
                    break;

            }
        }

        if (!this._$isHTML && this._$initText) {
            text += "\r";
        }

        this._$rawHtmlText = text;

        return text;
    }
    set text (text)
    {
        if (text === null) {
            text = "";
        }

        text = `${text}`;
        if (text !== this._$text) {
            this._$text            = text;
            this._$htmlText        = "";
            this._$cacheText       = "";
            this._$isHTML          = false;

            if (!this._$textAppending) {
                this._$textFormatTable = [];
            }

            this._$reload();
        }
    }

    /**
     * @description テキストフィールドのテキストの色です（16 進数形式）。
     *              The color of the text in a text field, in hexadecimal format.
     *
     * @member {number}
     * @public
     */
    get textColor ()
    {
        return this._$defaultTextFormat.color;
    }
    set textColor (text_color)
    {
        this._$defaultTextFormat.color = text_color;
        this._$reload();
    }

    /**
     * @description テキストの高さです（ピクセル単位）。
     *              The height of the text in pixels.
     *
     * @member {number}
     * @readonly
     * @public
     */
    get textHeight ()
    {
        if (this.text === "") {
            return 0;
        }

        if (this._$textHeight === null) {

            // setup
            this._$textHeight = 2;
            this._$getTextData();

            let leading  = this._$decisionTextFormat._$leading | 0;
            const length = this._$textHeightTable.length;
            if (length === 1) {
                this._$textHeight += leading;
            }

            for (let idx = 0; idx < length; ++idx) {
                this._$textHeight += this._$textHeightTable[idx];
            }

        }

        return this._$textHeight;
    }

    /**
     * @description テキストの幅です（ピクセル単位）。
     *              The width of the text in pixels.
     *
     * @member {number}
     * @readonly
     * @public
     */
    get textWidth ()
    {
        if (this._$textWidth === null) {

            // setup
            this._$textWidth = 0;
            this._$getTextData();

            for (let idx = 0; idx < this._$widthTable.length; ++idx) {
                this._$textWidth = Util.$max(this._$textWidth, this._$widthTable[idx]);
            }

        }

        return this._$textWidth;
    }

    /**
     * @description テキストフィールドのタイプです。
     *              The type of the text field.
     *
     * @member {string}
     * @default TextFieldType.STATIC
     * @public
     */
    get type ()
    {
        return this._$type;
    }
    set type (type)
    {
        type += "";
        if (type === TextFieldType.STATIC) {
            this._$type     = type;
            this._$textarea = null;
        } else {
            this._$type = TextFieldType.INPUT;
        }
    }

    /**
     * @description テキストフィールドのテキストを折り返すかどうかを示すブール値です。
     *              A Boolean value that indicates whether the text field has word wrap.
     *
     * @member {boolean}
     * @default false
     * @public
     */
    get wordWrap ()
    {
        return this._$wordWrap;
    }
    set wordWrap (word_wrap)
    {
        this._$wordWrap = !!word_wrap;
    }

    /**
     * @description 表示オブジェクトの幅を示します（ピクセル単位）。
     *              Indicates the width of the display object, in pixels.
     *
     * @member {number}
     * @public
     */
    get width ()
    {
        return super.width;
    }
    set width (width)
    {
        width = +width;
        if (!Util.$isNaN(width) && width > -1) {
            const bounds = this._$getBounds(null);

            const xMin = Util.$abs(bounds.xMin);
            this._$originBounds.xMax = width + xMin;
            this._$originBounds.xMin = xMin;
            this._$bounds.xMax = this._$originBounds.xMax;
            this._$bounds.xMin = this._$originBounds.xMin;

            super.width = width;

            this._$reload();
        }
    }

    /**
     * @description 表示オブジェクトの高さを示します（ピクセル単位）。
     *              Indicates the height of the display object, in pixels.
     *
     * @member {number}
     * @public
     */
    get height ()
    {
        return super.height;
    }
    set height (height)
    {
        height = +height;
        if (!Util.$isNaN(height) && height > -1) {
            const bounds = this._$getBounds(null);

            const yMin = Util.$abs(bounds.yMin);
            this._$originBounds.yMax = height + yMin;
            this._$bounds.yMax = this._$originBounds.yMax;
            this._$bounds.yMin = this._$originBounds.yMin;
            super.height = height;

            this._$reload();
        }
    }

    /**
     * @description 親 DisplayObjectContainer のローカル座標を基準にした
     *              DisplayObject インスタンスの x 座標を示します。
     *              Indicates the x coordinate
     *              of the DisplayObject instance relative to the local coordinates
     *              of the parent DisplayObjectContainer.
     *
     * @member {number}
     * @public
     */
    get x ()
    {
        const matrix = this._$transform.matrix;
        const bounds = this._$getBounds(null);
        return matrix._$matrix[4] + bounds.xMin;
    }
    set x (x)
    {
        const bounds = this._$getBounds(null);
        super.x = x - bounds.xMin;
    }

    /**
     * @description 親 DisplayObjectContainer のローカル座標を基準にした
     *              DisplayObject インスタンスの y 座標を示します。
     *              Indicates the y coordinate
     *              of the DisplayObject instance relative to the local coordinates
     *              of the parent DisplayObjectContainer.
     *
     * @member {number}
     * @public
     */
    get y ()
    {
        const matrix = this._$transform.matrix;
        const bounds = this._$getBounds(null);
        return matrix._$matrix[5] + bounds.yMin;
    }
    set y (y)
    {
        const bounds = this._$getBounds(null);
        super.y = y - bounds.yMin;
    }

    /**
     * @description newText パラメーターで指定されたストリングを、
     *              テキストフィールドのテキストの最後に付加します。
     *              Appends the string specified by the newText parameter
     *              to the end of the text of the text field.
     *
     * @param  {string} text
     * @return void
     * @method
     * @public
     */
    appendText (text)
    {
        const currentText = this.text;
        this._$textAppending = true;
        this.text = currentText + `${text}`;
        this._$textAppending = false;
    }

    /**
     * @description beginIndex パラメーターと endIndex パラメーターで指定された範囲の
     *              テキストのフォーマット情報を含む TextFormat オブジェクトを返します。
     *              Returns a TextFormat object that contains formatting information
     *              for the range of text that the beginIndex and endIndex parameters specify.
     *
     * @param  {int} [begin_index=-1]
     * @param  {int} [end_index=-1]
     * @return {TextFormat}
     * @method
     * @public
     */
    getTextFormat (begin_index = -1, end_index = -1)
    {
        begin_index |= 0;
        end_index   |= 0;

        const data   = this._$getTextData();
        const length = end_index > -1 ? end_index : data.length;

        let init = false;
        let textFormat = new TextFormat();
        let idx = begin_index > -1 ? begin_index : 0;
        for ( ; idx < length; ++idx) {

            if (data[idx].mode === TextField.BREAK) {
                continue;
            }

            const tf = data[idx].textFormat;
            if (!init) {
                init = true;
                textFormat = tf._$clone();
                continue;
            }

            textFormat._$align         = textFormat._$align         !== tf._$align         ? null : tf._$align;
            textFormat._$blockIndent   = textFormat._$blockIndent   !== tf._$blockIndent   ? null : tf._$blockIndent;
            textFormat._$bold          = textFormat._$bold          !== tf._$bold          ? null : tf._$bold;
            textFormat._$color         = textFormat._$color         !== tf._$color         ? null : tf._$color;
            textFormat._$font          = textFormat._$font          !== tf._$font          ? null : tf._$font;
            textFormat._$indent        = textFormat._$indent        !== tf._$indent        ? null : tf._$indent;
            textFormat._$italic        = textFormat._$italic        !== tf._$italic        ? null : tf._$italic;
            textFormat._$leading       = textFormat._$leading       !== tf._$leading       ? null : tf._$leading;
            textFormat._$leftMargin    = textFormat._$leftMargin    !== tf._$leftMargin    ? null : tf._$leftMargin;
            textFormat._$letterSpacing = textFormat._$letterSpacing !== tf._$letterSpacing ? null : tf._$letterSpacing;
            textFormat._$rightMargin   = textFormat._$rightMargin   !== tf._$rightMargin   ? null : tf._$rightMargin;
            textFormat._$size          = textFormat._$size          !== tf._$size          ? null : tf._$size;
            textFormat._$underline     = textFormat._$underline     !== tf._$underline     ? null : tf._$underline;

        }

        return textFormat;
    }

    /**
     * @description lineIndex パラメーターで指定された行のテキストを返します。
     *              Returns the text of the line specified by the lineIndex parameter.
     *
     * @param  {number} line_index
     * @return {string}
     * @public
     */
    getLineText (line_index)
    {
        if (!this._$text && !this._$htmlText) {
            return "";
        }

        line_index |= 0;
        let lineText = "";
        const textData = this._$getTextData();
        for (let idx = 0; idx < textData.length; idx++) {

            const obj = textData[idx];

            if (obj.yIndex > line_index) {
                break;
            }

            if (obj.yIndex !== line_index) {
                continue;
            }

            if (obj.mode !== TextField.TEXT) {
                continue;
            }

            lineText += obj.text;
        }

        return lineText;
    }

    /**
     * @description beginIndex パラメーターと endIndex パラメーターで指定された文字範囲を、
     *              newText パラメーターの内容に置き換えます。
     *              Replaces the range of characters that the beginIndex
     *              and endIndex parameters specify with the contents of the newText parameter.
     *
     * @param  {number} begin_index
     * @param  {number} end_index
     * @param  {string} new_text
     * @return {void}
     * @method
     * @public
     */
    replaceText (begin_index, end_index, new_text)
    {
        begin_index |= 0;
        end_index   |= 0;
        if (begin_index > -1 && end_index > -1 && end_index >= begin_index) {

            const text = this.text;

            if (begin_index >= text.length) {

                if (end_index >= text.length && end_index >= begin_index) {
                    this.text = text + `${new_text}`;
                }

            } else {

                this.text = text.substr(0, begin_index)
                    + `${new_text}`
                    + text.substr(end_index, text.length);

            }
        }
    }

    /**
     * @description format パラメーターで指定したテキストフォーマットを、
     *              テキストフィールド内の指定されたテキストに適用します。
     *              Applies the text formatting that the format parameter specifies
     *              to the specified text in a text field.
     *
     * @param  {TextFormat} text_format
     * @param  {number}     [begin_index=-1]
     * @param  {number}     [end_index=-1]
     * @return {void}
     * @method
     * @public
     */
    setTextFormat (text_format, begin_index = -1, end_index = -1)
    {
        // setup
        begin_index |= 0;
        end_index   |= 0;

        const textData = this._$getTextData();

        this._$reset();

        switch (true) {

            case begin_index === -1 && end_index === -1:
                {
                    const length = textData.length;
                    for (let idx = 0; idx < length; ++idx) {
                        this._$textFormatTable[idx] = text_format._$clone();
                    }
                }
                break;

            case begin_index > -1 && end_index === -1:
                {
                    let idx = begin_index + 1;
                    let obj = textData[idx];
                    if (obj.mode === TextField.WRAP) {
                        obj = textData[++idx];
                    }
                    this._$textFormatTable[idx] = text_format._$clone();
                }
                break;

            case begin_index > -1 && end_index > -1 && end_index > begin_index:
                {
                    let offset = 0;
                    for (let idx = begin_index; idx < end_index; ++idx) {

                        const obj = textData[idx];
                        if (!obj) {
                            continue;
                        }

                        if (obj.mode === TextField.WRAP
                            || obj.mode === TextField.BREAK
                        ) {
                            ++end_index;
                            --offset;
                            continue;
                        }

                        this._$textFormatTable[idx + offset] = text_format._$clone();

                    }
                }
                break;

        }

        this._$getTextData();
        this._$resize();
    }

    /**
     * @return {array}
     * @method
     * @private
     */
    _$getTextData ()
    {
        if (this._$textData === null) {

            // reset
            this._$textData        = [];
            this._$imageData       = [];
            this._$heightTable     = [];
            this._$textHeightTable = [];
            this._$objectTable     = [];
            this._$widthTable      = [];

            let tfCopyOffset = -1;
            if (this._$isHTML) {

                // html text
                let htmlText = this._$htmlText;

                const index = htmlText.search(/(< .*>|<>)/g);
                if (index > -1) {
                    htmlText = htmlText.slice(0, index);
                }

                htmlText = htmlText.replace(/\r\n/g, "\r\r");
                if (Util.$P_TAG.innerHTML !== htmlText) {
                    Util.$P_TAG.textContent = "";
                    Util.$P_TAG.insertAdjacentHTML("afterbegin", htmlText);
                }

                // setup
                let tf = this._$decisionTextFormat;
                if (this._$textData.length in this._$textFormatTable) {
                    const tft = this._$textFormatTable[this._$textData.length]._$clone();
                    tft._$merge(tf);
                    tf = tft;
                }

                // init
                this._$totalWidth         = 0;
                this._$heightTable[0]     = 0;
                this._$textHeightTable[0] = this._$getTextHeight(tf);
                this._$widthTable[0]      = 0;

                const obj = {
                    "mode"      : TextField.BREAK,
                    "x"         : 0,
                    "yIndex"    : 0,
                    "textFormat": tf._$clone()
                };

                this._$objectTable[0] = obj;
                this._$textData[0]    = obj;

                this._$parseTag(Util.$P_TAG, tf._$clone(), tfCopyOffset);

            } else {

                // plain text
                const texts = this._$multiline
                    ? this._$text.split("\n")
                    : [this._$text.replace("\n", "")];

                const length = texts.length;
                for (let idx = 0; idx < length; ++idx) {

                    // reset
                    this._$totalWidth = 0;

                    let tf = this.defaultTextFormat;

                    const yIndex = this._$wordWrap || this._$multiline
                        ? this._$heightTable.length
                        : 0;

                    this._$heightTable[yIndex]     = 0;
                    this._$textHeightTable[yIndex] = this._$getTextHeight(tf);
                    this._$widthTable[yIndex]      = 0;

                    if (yIndex) {
                        this._$heightTable[yIndex]     = this._$heightTable[yIndex - 1];
                        this._$textHeightTable[yIndex] = this._$textHeightTable[yIndex - 1];
                    }

                    if (this._$textData.length in this._$textFormatTable) {
                        const tft = this._$textFormatTable[this._$textData.length]._$clone();
                        tft._$merge(tf);
                        tf = tft;
                    }

                    const obj = {
                        "mode"      : TextField.BREAK,
                        "x"         : 0,
                        "yIndex"    : yIndex,
                        "textFormat": tf._$clone()
                    };

                    tf = this.defaultTextFormat;

                    this._$objectTable[yIndex] = obj;
                    this._$textData[this._$textData.length] = obj;

                    // parse text data
                    const text = texts[idx];
                    if (text) {
                        tfCopyOffset = this._$parseText(text, tf, tfCopyOffset);
                    }
                }
            }
        }

        return this._$textData;
    }

    /**
     * @param  {Element}    tag
     * @param  {TextFormat} text_format
     * @param  {number}     tf_copy_offset
     * @return {void}
     * @private
     */
    _$parseTag (tag, text_format, tf_copy_offset)
    {

        const childNodes = tag.childNodes;
        const length     = childNodes.length;
        for (let idx = 0; idx < length; ++idx) {

            let tf = text_format._$clone();

            const node = childNodes[idx];

            if (node.nodeType === 3) {

                tf_copy_offset = this._$parseText(node.nodeValue, tf);

                continue;

            }

            switch (node.nodeName) {

                case "P":
                    {
                        if (node.hasAttribute("align")) {
                            tf._$align = node.getAttribute("align").toLowerCase();
                        }

                        this._$parseTag(node, tf, tf_copy_offset);

                        if (!this._$multiline) {
                            break;
                        }

                        // reset
                        this._$totalWidth = this._$getImageOffsetX();

                        const yIndex = this._$heightTable.length;

                        this._$heightTable[yIndex]     = 0;
                        this._$textHeightTable[yIndex] = 0;
                        this._$widthTable[yIndex]      = 0;

                        if (yIndex) {
                            this._$heightTable[yIndex]     = this._$heightTable[yIndex - 1];
                            this._$textHeightTable[yIndex] = this._$textHeightTable[yIndex - 1];
                        }

                        if (this._$textData.length in this._$textFormatTable) {
                            const tft = this._$textFormatTable[this._$textData.length]._$clone();
                            tft._$merge(tf);
                            tf = tft;
                        }

                        const obj = {
                            "mode"      : TextField.BREAK,
                            "x"         : 0,
                            "yIndex"    : yIndex,
                            "textFormat": tf
                        };

                        this._$objectTable[yIndex] = obj;
                        this._$textData[this._$textData.length] = obj;
                    }
                    break;

                case "B": // bold
                    tf._$bold = true;
                    this._$parseTag(node, tf, tf_copy_offset);
                    break;

                case "I": // italic
                    tf._$italic = true;
                    this._$parseTag(node, tf, tf_copy_offset);
                    break;

                case "U": // underline
                    tf._$underline = true;
                    this._$parseTag(node, tf, tf_copy_offset);
                    break;

                case "FONT": // FONT
                    if (node.hasAttribute("face")) {
                        tf._$font = node.getAttribute("face");
                    }

                    if (node.hasAttribute("size")) {
                        tf._$size = node.getAttribute("size") | 0;
                    }

                    if (node.hasAttribute("color")) {
                        tf._$color = Util.$toColorInt(node.getAttribute("color"));
                    }

                    if (node.hasAttribute("letterSpacing")) {
                        tf.letterSpacing = node.getAttribute("letterSpacing") | 0;
                    }

                    this._$parseTag(node, tf, tf_copy_offset);
                    break;

                case "TEXTFORMAT": // TEXTFORMAT

                    if (node.hasAttribute("blockindent")) {
                        tf._$blockIndent = node.getAttribute("blockindent") | 0;
                    }

                    if (node.hasAttribute("indent")) {
                        tf._$indent = node.getAttribute("indent") | 0;
                    }

                    if (node.hasAttribute("leading")) {
                        tf._$leading = node.getAttribute("leading") | 0;
                    }

                    if (node.hasAttribute("leftmargin")) {
                        tf._$leftMargin = node.getAttribute("leftmargin") | 0;
                    }

                    if (node.hasAttribute("rightmargin")) {
                        tf._$rightMargin = node.getAttribute("rightmargin") | 0;
                    }

                    this._$parseTag(node, tf, tf_copy_offset);
                    break;

                case "BR": // br
                    {
                        if (!this._$multiline) {
                            break;
                        }

                        // add y index
                        const yIndex = this._$heightTable.length;

                        this._$heightTable[yIndex]     = this._$heightTable[yIndex - 1];
                        this._$textHeightTable[yIndex] = this._$textHeightTable[yIndex - 1];
                        this._$widthTable[yIndex]      = 0;

                        // reset
                        this._$totalWidth = this._$getImageOffsetX();

                        // new clone
                        tf._$indent = 0;

                        // set x offset
                        const obj = {
                            "mode"      : TextField.BREAK,
                            "x"         : 0,
                            "yIndex"    : yIndex,
                            "textFormat": tf
                        };

                        this._$objectTable[yIndex]              = obj;
                        this._$textData[this._$textData.length] = obj;
                    }
                    break;

                case "IMG":
                    {
                        const src = node.getAttribute("src") || "";

                        const width  = node.getAttribute("width") || 0;
                        const height = node.getAttribute("height") || 0;
                        const vspace = node.getAttribute("vspace") || 0;
                        const hspace = node.getAttribute("hspace") || 0;

                        let totalTextHeight = 0;
                        for (let idx = 0; idx < this._$textHeightTable.length; idx++) {
                            totalTextHeight += this._$textHeightTable[idx];
                        }

                        const obj = {
                            "mode"      : TextField.IMAGE,
                            "src"       : src,
                            "loaded"    : false,
                            "x"         : 0,
                            "y"         : totalTextHeight,
                            "width"     : width,
                            "height"    : height,
                            "hspace"    : hspace,
                            "vspace"    : vspace,
                            "textFormat": tf
                        };

                        if (this._$imageData.length > 0) {

                            const prevImage   = this._$imageData[this._$imageData.length - 1];
                            const imageBottom = prevImage.y + prevImage.height + prevImage.vspace * 2;

                            obj.y = Util.$max(totalTextHeight, imageBottom);
                        }

                        this._$textData[this._$textData.length]   = obj;
                        this._$imageData[this._$imageData.length] = obj;

                        this._$loadImage(obj);
                    }
                    break;

                default:
                    this._$parseTag(node, tf, tf_copy_offset);
                    break;

            }
        }
    }

    /**
     * @param   {string} text
     * @param   {TextFormat} text_format
     * @param   {number} tf_copy_offset
     * @returns {number}
     * @method
     * @private
     */
    _$parseText (text, text_format, tf_copy_offset)
    {

        let yIndex = this._$heightTable.length - 1 | 0;

        // new format
        let tf = text_format._$clone();

        let playerMatrix = Util.$MATRIX_ARRAY_RATIO_0_0_RATIO_0_0;

        const player = Util.$currentPlayer();
        if (player) {
            const scale = player._$scale * player._$ratio;
            playerMatrix = Util.$getFloat32Array6(scale, 0, 0, scale, 0, 0);
        }

        const matrix = Util.$multiplicationMatrix(
            this._$transform.concatenatedMatrix._$matrix,
            playerMatrix
        );

        const boundsWidth = (this._$originBounds.xMax - this._$originBounds.xMin)
            * (matrix[0] / matrix[3]);

        Util.$poolFloat32Array6(playerMatrix);
        Util.$poolFloat32Array6(matrix);

        const maxWidth = boundsWidth - tf._$widthMargin() - 4;
        for (let idx = 0; idx < text.length; ++idx) {

            tf = text_format._$clone();
            if (this._$textData.length + tf_copy_offset in this._$textFormatTable) {
                const tft = this._$textFormatTable[this._$textData.length + tf_copy_offset]._$clone();
                tft._$merge(tf);
                tf = tft;
            }

            // reset object
            const obj = {
                "mode"      : TextField.TEXT,
                "text"      : text[idx],
                "x"         : 0,
                "width"     : 0,
                "fontScale" : 0,
                "yIndex"    : yIndex,
                "textFormat": tf
            };

            let breakCode = null;
            if (this._$multiline) {
                breakCode = obj.text === "\n" || obj.text === "\r" || obj.text === "\n\r";
            }

            let leading    = yIndex ? tf._$leading : 0;
            let width      = 0;
            let height     = 0;
            let textHeight = 0;
            let wrapObj    = null;

            Util.$textContext.font = tf._$generateFontStyle();
            width = Util.$textContext.measureText(obj.text).width + tf._$letterSpacing;

            height     = this._$getTextHeight(tf);
            textHeight = height + leading;
            obj.height = height;

            if (breakCode ||
                this._$wordWrap && this._$totalWidth + width > maxWidth
            ) {

                // add y index
                this._$widthTable[++yIndex] = 0;

                obj.yIndex = yIndex;

                this._$heightTable[yIndex]     = this._$heightTable[yIndex - 1];
                this._$textHeightTable[yIndex] = this._$textHeightTable[yIndex - 1];

                // reset
                this._$totalWidth = this._$getImageOffsetX();

                // new clone
                tf = tf._$clone();
                tf._$indent = 0;

                // set x offset
                const mode = breakCode ? TextField.BREAK : TextField.WRAP;
                wrapObj = {
                    "mode"      : mode,
                    "x"         : 0,
                    "yIndex"    : yIndex,
                    "textFormat": tf
                };

                this._$objectTable[yIndex] = wrapObj;

                if (!breakCode) {
                    --tf_copy_offset;
                }

                let text        = obj.text;
                let chunkLength = 0;
                let isSeparated = true;
                const pattern   = /[0-9a-zA-Z?!;:.,？！。、；：〜]/g;

                while (text.match(pattern)) {
                    ++chunkLength;
                    const prevObj = this._$textData[this._$textData.length - chunkLength];

                    if (prevObj.mode !== TextField.TEXT) {
                        isSeparated = false;
                        break;
                    }

                    text = prevObj.text;
                }

                if (chunkLength > 1 && this._$textData[this._$textData.length - chunkLength + 1].text.match(/[0-9a-zA-Z]/g)) {
                    --chunkLength;
                }

                if (chunkLength > 0 && isSeparated) {

                    const insertIdx = this._$textData.length - chunkLength;
                    this._$textData.splice(insertIdx, 0, wrapObj);

                    // prev line
                    let offset    = 1;
                    let targetObj = this._$textData[insertIdx - offset];

                    this._$widthTable[yIndex - 1]      = 0;
                    this._$heightTable[yIndex - 1]     = 0;
                    this._$textHeightTable[yIndex - 1] = 0;

                    while (targetObj.mode === TextField.TEXT) {

                        height     = this._$getTextHeight(targetObj.textFormat);
                        textHeight = height + leading;

                        this._$widthTable[yIndex - 1]     += targetObj.width;
                        this._$heightTable[yIndex - 1]     = Util.$max(this._$heightTable[yIndex - 1], height);
                        this._$textHeightTable[yIndex - 1] = Util.$max(this._$textHeightTable[yIndex - 1], textHeight);

                        ++offset;
                        targetObj = this._$textData[insertIdx - offset];
                    }

                    // new line
                    offset = 1;
                    while (this._$textData.length > insertIdx + offset) {
                        targetObj = this._$textData[insertIdx + offset];
                        ++offset;

                        height     = this._$getTextHeight(targetObj.textFormat);
                        textHeight = height + leading;

                        this._$heightTable[yIndex]     = Util.$max(this._$heightTable[yIndex], height);
                        this._$textHeightTable[yIndex] = Util.$max(this._$textHeightTable[yIndex], textHeight);

                        targetObj.x      = this._$totalWidth;
                        targetObj.yIndex = yIndex;

                        this._$totalWidth += targetObj.width;
                    }

                } else {
                    this._$textData[this._$textData.length] = wrapObj;
                }
            }

            if (!breakCode) {

                // width data
                obj.width          = width;
                obj.x              = this._$totalWidth;
                this._$totalWidth += width;

                this._$widthTable[yIndex] = Util.$max(this._$widthTable[yIndex], this._$totalWidth);

                // height data
                this._$heightTable[yIndex]     = Util.$max(this._$heightTable[yIndex], height);
                this._$textHeightTable[yIndex] = Util.$max(this._$textHeightTable[yIndex], textHeight);

                this._$textData[this._$textData.length] = obj;

            }

        }

        return tf_copy_offset;
    }

    /**
     * @param  {TextFormat} text_format
     * @return {number}
     * @private
     */
    _$getTextHeight (text_format)
    {
        if (!Util.$DIV) {

            const div = Util.$document.createElement("div");

            div.innerHTML           = "a";
            div.style.position      = "absolute";
            div.style.top           = "-9999px";
            div.style.left          = "-9999px";
            div.style.padding       = "0";
            div.style.margin        = "0";
            div.style.padding       = "0";
            div.style.border        = "0";
            div.style.outline       = "0";
            div.style.verticalAlign = "bottom";
            div.style.lineHeight    = "100%";

            Util.$DIV = div;
            Util.$document.body.appendChild(Util.$DIV);

        }

        // update dom data
        const style = Util.$DIV.style;
        style.fontSize   = `${text_format._$size}px`;
        style.fontFamily = text_format._$font;
        style.fontWeight = text_format._$bold ? "bold" : "normal";

        return Util.$DIV.clientHeight;
    }

    /**
     * @return {number}
     * @private
     */
    _$getImageOffsetX ()
    {
        if (!this._$imageData.length) {
            return 0;
        }

        let totalTextHeight = 0;
        for (let idx = 0; idx < this._$textHeightTable.length; ++idx) {
            totalTextHeight += this._$textHeightTable[idx];
        }

        for (let idx = 0; idx < this._$imageData.length; ++idx) {

            const image = this._$imageData[idx];

            const imageHeight = image.height + image.vspace * 2;

            if (image.y <= totalTextHeight
                && totalTextHeight < image.y + imageHeight
            ) {
                return image.width + image.hspace * 2;
            }
        }

        return 0;
    }

    /**
     * @return {void}
     * @method
     * @private
     */
    _$reset ()
    {
        this._$renew           = true;
        this._$textData        = null;
        this._$imageData       = null;
        this._$textHeight      = null;
        this._$textWidth       = null;
        this._$heightTable     = null;
        this._$textHeightTable = null;
        this._$widthTable      = null;
        this._$objectTable     = null;
        this._$totalWidth      = null;
        this._$maxScrollH      = null;
        this._$maxScrollV      = null;

        this._$doChanged();
        Util.$isUpdated = true;

        // cache clear
        Util.$cacheStore().removeCache(this._$instanceId);
    }

    /**
     * @return {void}
     * @method
     * @private
     */
    _$reload ()
    {
        this._$reset();
        this._$getTextData();
        this._$resize();
    }

    /**
     * @return {void}
     * @method
     * @private
     */
    _$resize ()
    {
        // update bounds
        if (this._$autoSize !== TextFieldAutoSize.NONE) {

            const tf = this._$defaultTextFormat;
            const width = this.textWidth + 2
                + tf._$leftMargin + tf._$rightMargin;

            if (this._$wordWrap) {

                this._$bounds.xMax = this._$originBounds.xMax;
                this._$bounds.xMin = this._$originBounds.xMin;

            } else {

                switch (this._$autoSize) {

                    case TextFieldAutoSize.LEFT:
                        this._$bounds.xMax = width + this._$bounds.xMin;
                        break;

                    case TextFieldAutoSize.CENTER:
                        this._$bounds.xMax = width + this._$bounds.xMin;
                        break;

                    case TextFieldAutoSize.RIGHT:
                        this._$bounds.xMax = this._$originBounds.xMax
                            - (this._$originBounds.xMax - this._$originBounds.xMin
                                - (width - this._$originBounds.xMin));
                        break;

                    default:
                        break;

                }

            }

            // set height
            this._$bounds.yMax = this.textHeight
                + 4 + this._$originBounds.yMin;
        }
    }

    /**
     * @param  {object} obj
     * @param  {number} width
     * @return {number}
     * @private
     */
    _$getAlignOffset (obj, width)
    {

        // default
        const totalWidth = this._$widthTable[obj.yIndex];
        const textFormat = obj.textFormat;
        const indent     = textFormat._$blockIndent + textFormat._$leftMargin > 0
            ? textFormat._$blockIndent + textFormat._$leftMargin
            : 0;

        switch (true) {

            // wordWrap case
            case this._$wordWrap === false && totalWidth > width:
                return Util.$max(0, indent);

            case textFormat._$align === TextFormatAlign.CENTER: // format CENTER
            case this._$autoSize === TextFieldAutoSize.CENTER: // autoSize CENTER
                return Util.$max(0, width / 2 - indent - textFormat._$rightMargin - totalWidth / 2);

            case textFormat._$align === TextFormatAlign.RIGHT: // format RIGHT
            case this._$autoSize === TextFieldAutoSize.RIGHT: // autoSize RIGHT
                return Util.$max(0, width - indent - totalWidth - textFormat._$rightMargin - 2);

            // autoSize LEFT
            // format LEFT
            default:
                return Util.$max(0, indent + 2);

        }
    }

    /**
     * @param   {Float32Array} [matrix=null]
     * @returns {object}
     * @private
     */
    _$getBounds (matrix = null)
    {
        if (matrix) {

            const multiMatrix = Util.$multiplicationMatrix(
                matrix, this._$correctMatrix(this._$transform._$rawMatrix())
            );

            return Util.$boundsMatrix(this._$bounds, multiMatrix);
        }

        return Util.$boundsMatrix(
            this._$bounds, this._$correctMatrix(Util.$MATRIX_ARRAY_IDENTITY)
        );
    }

    /**
     * @param  {Float32Array} matrix
     * @return {Float32Array}
     * @private
     */
    _$correctMatrix (matrix)
    {
        switch (this._$autoSize) {

            case TextFieldAutoSize.CENTER:
            {
                const textWidth = this.textWidth + 4;

                const xOffset = (this._$originBounds.xMax - this._$originBounds.xMin) / 2
                        - textWidth / 2;

                return Util.$getFloat32Array6(
                    matrix[0], matrix[1], matrix[2],
                    matrix[3], matrix[4] + xOffset, matrix[5]
                );
            }

            case TextFieldAutoSize.RIGHT:
            {
                const textWidth = this.textWidth + 4;

                const xOffset = this._$originBounds.xMax - this._$originBounds.xMin
                        - (textWidth - this._$originBounds.xMin);

                return Util.$getFloat32Array6(
                    matrix[0], matrix[1], matrix[2],
                    matrix[3], matrix[4] + xOffset, matrix[5]
                );
            }

            default:
                return matrix;

        }
    }

    /**
     * @param  {object} tag
     * @param  {DisplayObjectContainer} parent
     * @return {object}
     * @method
     * @private
     */
    _$build (tag, parent)
    {
        const character = super._$build(tag, parent);

        const textFormat = this.defaultTextFormat;

        textFormat.font          = character.font;
        textFormat.size          = character.size;
        textFormat.align         = character.align;
        textFormat.color         = character.color;
        textFormat.leading       = character.leading;
        textFormat.letterSpacing = character.letterSpacing;
        textFormat.leftMargin    = character.leftMargin;
        textFormat.rightMargin   = character.rightMargin;

        switch (character.fontType) {

            case 1:
                textFormat.bold = true;
                break;

            case 2:
                textFormat.italic = true;
                break;

            case 3:
                textFormat.bold   = true;
                textFormat.italic = true;
                break;

        }

        this._$type      = character.inputType;
        this._$multiline = character.multiline;
        this._$wordWrap  = character.wordWrap;
        this._$border    = character.border;
        this._$scroll    = character.scroll;

        // bounds
        this._$bounds.xMin       = character.originBounds.xMin;
        this._$bounds.xMax       = character.originBounds.xMax;
        this._$bounds.yMin       = character.originBounds.yMin;
        this._$bounds.yMax       = character.originBounds.yMax;
        this._$originBounds.xMin = character.originBounds.xMin;
        this._$originBounds.xMax = character.originBounds.xMax;
        this._$originBounds.yMin = character.originBounds.yMin;
        this._$originBounds.yMax = character.originBounds.yMax;

        switch (character.autoSize) {

            case 1:
                this.autoSize = character.align;
                break;

            case 2:
                this.autoFontSize = true;
                break;

        }

        this.text = character.text;
    }

    /**
     * @param   {CanvasToWebGLContext} context
     * @param   {Float32Array} matrix
     * @returns {void}
     * @method
     * @private
     */
    _$clip (context, matrix)
    {
        // size
        const bounds = this._$getBounds();
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

        let multiMatrix = matrix;
        const rawMatrix = this._$transform._$rawMatrix();
        if (rawMatrix !== Util.$MATRIX_ARRAY_IDENTITY) {
            multiMatrix = Util.$multiplicationMatrix(matrix, rawMatrix);
        }

        Util.$resetContext(context);
        context.setTransform(
            multiMatrix[0], multiMatrix[1], multiMatrix[2],
            multiMatrix[3], multiMatrix[4], multiMatrix[5]
        );
        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(width, 0);
        context.lineTo(width, height);
        context.lineTo(0, height);
        context.lineTo(0, 0);
        context.clip(true);

        if (multiMatrix !== matrix) {
            Util.$poolFloat32Array6(multiMatrix);
        }
    }

    /**
     * @param  {CanvasToWebGLContext} context
     * @param  {Float32Array} matrix
     * @param  {Float32Array} color_transform
     * @return {void}
     * @method
     * @private
     */
    _$draw (context, matrix, color_transform)
    {
        if (!this._$visible || this._$textAreaActive) {
            return ;
        }

        if (!this._$background && !this._$border && !this.text) {
            return;
        }

        let multiColor = color_transform;
        const rawColor = this._$transform._$rawColorTransform();
        if (rawColor !== Util.$COLOR_ARRAY_IDENTITY) {
            multiColor = Util.$multiplicationColor(color_transform, rawColor);
        }

        const alpha = Util.$clamp(multiColor[3] + multiColor[7] / 255, 0 ,1);
        if (!alpha) {
            return ;
        }

        let multiMatrix = matrix;
        const rawMatrix = this._$transform._$rawMatrix();
        if (rawMatrix !== Util.$MATRIX_ARRAY_IDENTITY) {
            multiMatrix = Util.$multiplicationMatrix(matrix, rawMatrix);
        }

        const baseBounds = this._$getBounds(null);
        const bounds = Util.$boundsMatrix(baseBounds, multiMatrix);
        const xMax   = +bounds.xMax;
        const xMin   = +bounds.xMin;
        const yMax   = +bounds.yMax;
        const yMin   = +bounds.yMin;
        Util.$poolBoundsObject(bounds);
        Util.$poolBoundsObject(baseBounds);

        let width  = Util.$ceil(Util.$abs(xMax - xMin));
        let height = Util.$ceil(Util.$abs(yMax - yMin));
        if (!width || !height) {
            return;
        }

        if (0 > xMin + width || 0 > yMin + height) {
            return;
        }

        // area check
        const currentBuffer = context
            .frameBuffer
            .currentAttachment;

        if (xMin > currentBuffer.width || yMin > currentBuffer.height) {
            return;
        }

        const xScale = +Util.$sqrt(multiMatrix[0] * multiMatrix[0] + multiMatrix[1] * multiMatrix[1]);
        const yScale = +Util.$sqrt(multiMatrix[2] * multiMatrix[2] + multiMatrix[3] * multiMatrix[3]);

        // get cache
        const keys = Util.$getArray();
        keys[0] = xScale;
        keys[1] = yScale;

        const cacheStore = Util.$cacheStore();
        const cacheKeys  = cacheStore.generateKeys(this._$instanceId, keys, multiColor);
        let texture      = cacheStore.get(cacheKeys);

        // texture is small or renew
        if (texture && (this._$renew || this._$isUpdated())) {
            cacheStore.set(cacheKeys, null);
            cacheStore.destroy(texture);
            texture = null;
        }

        width  += 4 * Util.$devicePixelRatio;
        height += 4 * Util.$devicePixelRatio;
        if (!texture) {

            this._$renew = false;

            // alpha reset
            multiColor[3] = 1;

            // new canvas
            const canvas  = cacheStore.getCanvas();
            canvas.width  = width;
            canvas.height = height;
            const ctx     = canvas.getContext("2d");

            // border and background
            if (this._$background || this._$border) {

                ctx.beginPath();
                ctx.rotate(Util.$atan2(matrix[1], matrix[0]));
                ctx.moveTo(0, 0);
                ctx.lineTo(width, 0);
                ctx.lineTo(width, height);
                ctx.lineTo(0, height);
                ctx.lineTo(0, 0);

                if (this._$background) {

                    const rgba = Util.$generateColorTransform(
                        Util.$intToRGBA(this._$backgroundColor),
                        multiColor
                    );

                    ctx.fillStyle = `rgba(${rgba.R},${rgba.G},${rgba.B},${rgba.A})`;
                    ctx.fill();
                }

                if (this._$border) {

                    const rgba = Util.$generateColorTransform(
                        Util.$intToRGBA(this._$borderColor),
                        multiColor
                    );

                    ctx.lineWidth   = 1;
                    ctx.strokeStyle = `rgba(${rgba.R},${rgba.G},${rgba.B},${rgba.A})`;
                    ctx.stroke();

                }

            }

            // mask start
            ctx.save();
            ctx.beginPath();
            const rotate = Util.$atan2(matrix[1], matrix[0]);
            if (rotate) {
                ctx.rotate(rotate);
            }
            ctx.moveTo(2, 2);
            ctx.lineTo(width - 2, 2);
            ctx.lineTo(width - 2, height - 2);
            ctx.lineTo(2, height - 2);
            ctx.lineTo(2, 2);
            ctx.clip();

            ctx.beginPath();
            ctx.setTransform(matrix[0], matrix[1], matrix[2], matrix[3], 0, 0);
            this._$doDraw(ctx, matrix, multiColor, false, width / matrix[0]);
            ctx.restore();

            texture = context
                .frameBuffer
                .createTextureFromCanvas(ctx.canvas);

            // set cache
            cacheStore.set(cacheKeys, texture);

            // destroy cache
            cacheStore.destroy(ctx);

        }

        Util.$poolArray(cacheKeys);
        Util.$poolArray(keys);

        let isFilter  = false;
        let offsetX   = 0;
        let offsetY   = 0;
        const filters = this._$filters   || this.filters;
        if (filters && filters.length) {

            const canApply = this._$canApply(filters);
            if (canApply) {

                isFilter = true;

                const cacheKeys = [this._$instanceId, "f"];
                let cache = Util.$cacheStore().get(cacheKeys);

                const updated = this._$isFilterUpdated(
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

                    texture = this._$getFilterTexture(
                        context, filters, texture, matrix, color_transform
                    );

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
        context._$globalCompositeOperation = this._$blendMode || this.blendMode;

        context.setTransform(1, 0, 0, 1, 0, 0);
        if (isFilter) {
            context.drawImage(texture,
                xMin - offsetX, yMin - offsetY,
                texture.width, texture.height, multiColor
            );
        } else {
            context.drawImage(texture,
                xMin, yMin, width, height, multiColor
            );
        }

    }

    /**
     * @param  {CanvasRenderingContext2D} context
     * @param  {Float32Array} matrix
     * @param  {Float32Array} color_transform
     * @param  {boolean} is_clip
     * @param  {number} width
     * @return {void}
     * @method
     * @private
     */
    _$doDraw (context, matrix, color_transform, is_clip, width)
    {
        // init
        const textData = this._$getTextData();

        const limitWidth = is_clip
            ? 0
            : this.width;

        const limitHeight = is_clip
            ? 0
            : this.height;

        // setup
        let xOffset      = 0;
        let offsetHeight = 0;
        let currentV     = 0;

        const length = textData.length;
        for (let idx = 0; idx < length; ++idx) {

            let obj = textData[idx];
            if (obj.width === 0) {
                continue;
            }

            // check
            const offsetWidth = xOffset + obj.x;
            if (!is_clip
                && this._$autoSize === TextFieldAutoSize.NONE
                && (offsetHeight > limitHeight || offsetWidth > limitWidth)
            ) {
                continue;
            }

            let tf = obj.textFormat;

            // color
            if (!is_clip) {

                const rgba = Util.$generateColorTransform(
                    Util.$intToRGBA(obj.textFormat._$color),
                    color_transform
                );
                context.fillStyle = `rgba(${rgba.R},${rgba.G},${rgba.B},${rgba.A})`;

            }

            const yIndex = obj.yIndex | 0;
            switch (obj.mode) {

                case TextField.BREAK:
                case TextField.WRAP:

                    currentV++;

                    if (this.scrollV > currentV) {
                        continue;
                    }

                    offsetHeight += this._$textHeightTable[yIndex];

                    xOffset = this._$getAlignOffset(this._$objectTable[yIndex], width);
                    if (tf._$underline) {

                        const offset = obj.textFormat._$size / 12;

                        const rgba = Util.$generateColorTransform(
                            Util.$intToRGBA(tf._$color),
                            color_transform
                        );

                        context.lineWidth   = Util.$max(1, 1 / Util.$min(matrix[0], matrix[3]));
                        context.strokeStyle = `rgba(${rgba.R},${rgba.G},${rgba.B},${rgba.A})`;

                        context.beginPath();
                        context.moveTo(xOffset, offsetHeight - offset);
                        context.lineTo(xOffset + this._$widthTable[yIndex], offsetHeight - offset);
                        context.stroke();

                    }

                    break;

                case TextField.TEXT:
                    {
                        if (this.scrollV > currentV) {
                            continue;
                        }

                        let offsetY = offsetHeight - this._$heightTable[0];
                        if (!Util.$isSafari) {
                            offsetY += 2 * (obj.textFormat._$size / 12);
                        }

                        context.beginPath();
                        context.textBaseline = "top";
                        context.font = tf._$generateFontStyle();
                        context.fillText(obj.text, offsetWidth, offsetY);
                    }
                    break;

                case TextField.IMAGE:

                    if (!obj.loaded) {
                        continue;
                    }

                    context.beginPath();
                    context.drawImage(obj.image, obj.x, obj.y, obj.width, obj.height);

                    break;

            }
        }
    }

    /**
     * @param  {CanvasRenderingContext2D} context
     * @param  {Float32Array} matrix
     * @param  {object}  options
     * @return {boolean}
     * @method
     * @private
     */
    _$mouseHit (context, matrix, options)
    {
        if (!this._$visible) {
            return false;
        }

        return this._$hit(context, matrix, options);
    }

    /**
     * @param  {CanvasRenderingContext2D} context
     * @param  {Float32Array} matrix
     * @param  {object} options
     * @return {boolean}
     * @method
     * @private
     */
    _$hit (context, matrix, options)
    {
        let multiMatrix = matrix;
        const rawMatrix = this._$transform._$rawMatrix();
        if (rawMatrix !== Util.$MATRIX_ARRAY_IDENTITY) {
            multiMatrix = Util.$multiplicationMatrix(matrix, rawMatrix);
        }

        const baseBounds = this._$getBounds(null);

        const bounds = Util.$boundsMatrix(baseBounds, multiMatrix);
        const xMax   = +bounds.xMax;
        const xMin   = +bounds.xMin;
        const yMax   = +bounds.yMax;
        const yMin   = +bounds.yMin;
        Util.$poolBoundsObject(bounds);
        Util.$poolBoundsObject(baseBounds);

        const width  = Util.$ceil(Util.$abs(xMax - xMin));
        const height = Util.$ceil(Util.$abs(yMax - yMin));

        context.setTransform(1, 0, 0, 1, xMin, yMin);
        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(width, 0);
        context.lineTo(width, height);
        context.lineTo(0, height);
        context.lineTo(0, 0);

        if (multiMatrix !== matrix) {
            Util.$poolFloat32Array6(multiMatrix);
        }

        return context.isPointInPath(options.x, options.y);
    }
}