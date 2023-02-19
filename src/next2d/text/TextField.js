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
         * @default true
         * @private
         */
        this._$scrollEnabled = true;

        /**
         * @type {Sprite}
         * @default null
         * @private
         */
        this._$scrollSprite = null;

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

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$focus = false;

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$isComposing = false;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$thickness = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$thicknessColor = 0;

        /**
         * @type {string}
         * @default TextFormatVerticalAlign.TOP
         * @private
         */
        this._$verticalAlign = TextFormatVerticalAlign.TOP;
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
     * @public
     */
    get namespace ()
    {
        return "next2d.text.TextField";
    }

    /**
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

            this._$reset();
        }
    }

    /**
     * @description このオブジェクトでマウスまたはその他のユーザー入力メッセージを
     *
     * @member {boolean}
     * @default false
     * @public
     */
    get focus ()
    {
        return this._$focus;
    }
    set focus (focus)
    {
        if (this._$focus === !!focus) {
            return ;
        }

        this._$focus = !!focus;
        if (this._$focus) {

            if (this._$type === TextFieldType.INPUT) {

                const player = Util.$currentPlayer();

                const div = $document.getElementById(player.contentElementId);
                if (!div) {
                    return;
                }

                this._$createTextAreaElement(player._$scale);

                // setup
                const element = this._$textarea;
                const matrix  = this._$transform.concatenatedMatrix;
                const bounds  = this._$getBounds(null);

                const color = Util.$intToRGBA(
                    this._$defaultTextFormat._$color, 100
                );

                element.style.color  = `rgb(${color.R},${color.G},${color.B})`;
                element.style.left   = `${(matrix.tx + bounds.xMin + player._$tx / player._$scale / $devicePixelRatio) * player._$scale}px`;
                element.style.top    = `${(matrix.ty + bounds.yMin + player._$ty / player._$scale / $devicePixelRatio) * player._$scale}px`;
                element.style.width  = `${$Math.ceil((this.width  - 1) * player._$scale)}px`;
                element.style.height = `${$Math.ceil((this.height - 1) * player._$scale)}px`;

                // set text
                element.value = this.text;

                div.appendChild(element);

                const timer = $requestAnimationFrame;
                timer(() => { element.focus() });

                this._$doChanged();
                Util.$isUpdated = true;
                this._$textAreaActive = true;

                // focus in event
                if (this.willTrigger(FocusEvent.FOCUS_IN)) {
                    this.dispatchEvent(new FocusEvent(FocusEvent.FOCUS_IN));
                }
            }

        } else {

            // execute
            if (this._$textarea) {

                this._$textarea.dispatchEvent(
                    new $window.Event(`${Util.$PREFIX}_blur`)
                );

                if (this.willTrigger(FocusEvent.FOCUS_OUT)) {
                    this.dispatchEvent(new FocusEvent(FocusEvent.FOCUS_OUT));
                }

                this._$textarea.remove();
            }

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
     * @description スクロール機能のON/OFFの制御。
     *              Control ON/OFF of the scroll function.
     *
     * @member {boolean}
     * @default true
     * @public
     */
    get scrollEnabled ()
    {
        return this._$scrollEnabled;
    }
    set scrollEnabled (scroll_enabled)
    {
        this._$scrollEnabled = !!scroll_enabled;
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

            this._$scrollV = $Math.max(1, scroll_v);

            this._$reset();

            if (this.textHeight > this.height) {
                this._$scrollSprite.height = this.height * this.height / this.textHeight - 1;

                const parent = this._$parent;
                if (parent) {
                    // view start
                    this._$scrollSprite.alpha = 1;

                    // set position
                    this._$scrollSprite.x = this.x + this.width - this._$scrollSprite.width - 0.5;
                    this._$scrollSprite.y = this.y + 0.5
                        + (this.height - 1 - this._$scrollSprite.height)
                        / (this.maxScrollV - 1)
                        * (this._$scrollV - 1);

                    // added sprite
                    parent.addChildAt(
                        this._$scrollSprite,
                        parent.getChildIndex(this) + 1
                    );

                    // start animation
                    if (this._$scrollSprite.hasLocalVariable("job")) {
                        this._$scrollSprite.getLocalVariable("job").stop();
                    }

                    const job = Tween.add(this._$scrollSprite,
                        { "alpha" : 1 },
                        { "alpha" : 0 },
                        1
                    );

                    job.addEventListener(Event.COMPLETE, (event) =>
                    {
                        const sprite = event.target.target;
                        sprite.deleteLocalVariable("job");
                        if (sprite.parent) {
                            sprite.parent.removeChild(sprite);
                        }
                    });
                    job.start();

                    this._$scrollSprite.setLocalVariable("job", job);
                }
            }

            if (this.willTrigger(Event.SCROLL)) {
                this.dispatchEvent(new Event(Event.SCROLL, true));
            }
        }
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

                case TextMode.TEXT:
                    text += object.text;
                    break;

                case TextMode.BREAK:
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
            this._$text      = text;
            this._$htmlText  = "";
            this._$cacheText = "";
            this._$isHTML    = false;

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
                this._$textWidth = $Math.max(this._$textWidth, this._$widthTable[idx]);
            }

        }

        return this._$textWidth;
    }

    /**
     * @description 輪郭のテキスト幅です。0(デフォルト値)で無効にできます。
     *              The text width of the outline, which can be disabled with 0 (the default value).
     *
     * @member {number}
     * @default 0
     * @public
     */
    get thickness ()
    {
        return this._$thickness;
    }
    set thickness (thickness)
    {
        this._$thickness = thickness | 0;
        this._$reset();
    }

    /**
     * @description 輪郭のテキストの色です（16 進数形式）。
     *              The color of the outline text. (Hexadecimal format)
     *
     * @member {number}
     * @default 0
     * @public
     */
    get thicknessColor ()
    {
        return this._$thicknessColor;
    }
    set thicknessColor (thickness_color)
    {
        this._$thicknessColor = Util.$clamp(
            Util.$toColorInt(thickness_color), 0, 0xffffff, 0xffffff
        );
        this._$reset();
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
     * @description 縦方向の揃え位置を指定するプロパティです。
     *              This property specifies the vertical alignment position.
     *
     * @member {string}
     * @default extFormatVerticalAlign.TOP
     * @public
     */
    get verticalAlign ()
    {
        return this._$verticalAlign;
    }
    set verticalAlign (vertical_align)
    {
        switch (vertical_align) {

            case TextFormatVerticalAlign.MIDDLE:
            case TextFormatVerticalAlign.BOTTOM:
                this._$verticalAlign = vertical_align;
                break;

            default:
                this._$verticalAlign = TextFormatVerticalAlign.TOP;
                break;
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
        if (!$isNaN(width) && width > -1) {
            const bounds = this._$getBounds(null);

            const xMin = $Math.abs(bounds.xMin);
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
        if (!$isNaN(height) && height > -1) {
            const bounds = this._$getBounds(null);

            const yMin = $Math.abs(bounds.yMin);
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

            if (data[idx].mode === TextMode.BREAK) {
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

            if (obj.mode !== TextMode.TEXT) {
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
                    if (obj.mode === TextMode.WRAP) {
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

                        if (obj.mode === TextMode.WRAP
                            || obj.mode === TextMode.BREAK
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
            this._$heightCache     = Util.$getMap();

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
                    "mode"      : TextMode.BREAK,
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
                        "mode"      : TextMode.BREAK,
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

            // clear
            Util.$poolMap(this._$heightCache);
            this._$heightCache = null;
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
                            if (this._$textData.length === 1) {
                                this._$textData[0].textFormat._$align = tf._$align;
                            }
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
                            "mode"      : TextMode.BREAK,
                            "x"         : 0,
                            "yIndex"    : yIndex,
                            "textFormat": tf
                        };

                        this._$objectTable[yIndex] = obj;
                        this._$textData.push(obj);
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
                            "mode"      : TextMode.BREAK,
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
                        let src = "";
                        if (node.hasAttribute("src")) {
                            src = node.getAttribute("src");
                        }

                        let obj = null;
                        if (!Util.$loadedImages.has(src)) {

                            const width  = node.getAttribute("width") || 0;
                            const height = node.getAttribute("height") || 0;
                            const vspace = node.getAttribute("vspace") || 8;
                            const hspace = node.getAttribute("hspace") || 8;

                            let totalTextHeight = 0;
                            for (let idx = 0; idx < this._$textHeightTable.length; idx++) {
                                totalTextHeight += this._$textHeightTable[idx];
                            }

                            obj = {
                                "mode"      : TextMode.IMAGE,
                                "src"       : src,
                                "loaded"    : false,
                                "x"         : 0,
                                "y"         : totalTextHeight,
                                "width"     : width | 0,
                                "height"    : height | 0,
                                "hspace"    : hspace | 0,
                                "vspace"    : vspace | 0,
                                "textFormat": tf._$clone()
                            };

                            if (this._$imageData.length > 0) {
                                const prevImage   = this._$imageData[this._$imageData.length - 1];
                                const imageBottom = prevImage.y + prevImage.height + prevImage.vspace * 2;

                                obj.y = $Math.max(totalTextHeight, imageBottom);
                            }

                            this._$loadImage(obj);
                            Util.$loadedImages.set(src, obj);

                        } else {

                            obj = Util.$loadedImages.get(src);

                        }

                        this._$textData[this._$textData.length]   = obj;
                        this._$imageData[this._$imageData.length] = obj;
                    }
                    break;

                default:
                    this._$parseTag(node, tf, tf_copy_offset);
                    break;

            }
        }
    }

    /**
     * @param  {Object} obj
     * @return void
     * @private
     */
    _$loadImage (obj)
    {
        obj.scope = this;
        obj.image = new $Image();

        obj.image.crossOrigin = "anonymous";
        obj.image.addEventListener("load", function ()
        {
            this.loaded = true;

            // set size
            if (!this.width) {
                this.width = this.image.width | 0;
            }
            if (!this.height) {
                this.height = this.image.height | 0;
            }

            const scope = this.scope;
            this.scope  = null;

            Util.$loadedImages.set(this.src, this);
            scope._$reload();

        }.bind(obj), false);

        obj.image.src = obj.src;
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

        const matrix = this._$transform.concatenatedMatrix._$matrix;

        const boundsWidth = (this._$originBounds.xMax - this._$originBounds.xMin)
            * (matrix[0] / matrix[3]);

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
                "mode"      : TextMode.TEXT,
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
                const mode = breakCode ? TextMode.BREAK : TextMode.WRAP;
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

                    if (prevObj.mode !== TextMode.TEXT) {
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

                    while (targetObj.mode === TextMode.TEXT) {

                        height     = this._$getTextHeight(targetObj.textFormat);
                        textHeight = height + leading;

                        this._$widthTable[yIndex - 1]     += targetObj.width;
                        this._$heightTable[yIndex - 1]     = $Math.max(this._$heightTable[yIndex - 1], height);
                        this._$textHeightTable[yIndex - 1] = $Math.max(this._$textHeightTable[yIndex - 1], textHeight);

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

                        this._$heightTable[yIndex]     = $Math.max(this._$heightTable[yIndex], height);
                        this._$textHeightTable[yIndex] = $Math.max(this._$textHeightTable[yIndex], textHeight);

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

                this._$widthTable[yIndex] = $Math.max(this._$widthTable[yIndex], this._$totalWidth);

                // height data
                this._$heightTable[yIndex]     = $Math.max(this._$heightTable[yIndex], height);
                this._$textHeightTable[yIndex] = $Math.max(this._$textHeightTable[yIndex], textHeight);

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

            const div = $document.createElement("div");

            div.innerHTML             = "a";
            div.style.display         = "block";
            div.style.position        = "absolute";
            div.style.top             = "-9999px";
            div.style.left            = "-9999px";
            div.style.padding         = "0";
            div.style.margin          = "0";
            div.style.padding         = "0";
            div.style.border          = "0";
            div.style.outline         = "0";
            div.style.verticalAlign   = "bottom";
            div.style.lineHeight      = "100%";

            Util.$DIV = div;
            $document.body.appendChild(Util.$DIV);

        }

        const size   = text_format._$size;
        const font   = text_format._$font;
        const weight = text_format._$bold ? "bold" : "normal";

        // use cache
        const key = `${size}_${font}_${weight}`;
        if (this._$heightCache.has(key)) {
            return this._$heightCache.get(key);
        }

        // update dom data
        const style = Util.$DIV.style;

        const fontSize = `${size}px`;
        if (style.fontSize !== fontSize) {
            style.fontSize = fontSize;
        }
        if (style.fontFamily !== font) {
            style.fontFamily = font;
        }
        if (style.fontWeight !== weight) {
            style.fontWeight = weight;
        }

        const height = 10 > size
            ? Util.$DIV.clientHeight * size * 0.1
            : Util.$DIV.clientHeight;

        // cache
        this._$heightCache.set(key, height);
        return height;
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

        if (this._$autoSize === TextFieldAutoSize.NONE && this._$autoFontSize) {

            const fontSize = this.defaultTextFormat.size;
            if (this.width && this.textWidth
                && this.textWidth > this.width
            ) {

                while (this.textWidth > this.width) {

                    this.defaultTextFormat.size--;
                    if (1 > this.defaultTextFormat.size) {
                        this.defaultTextFormat.size = 1;
                        break;
                    }

                    this._$reset();
                    this._$getTextData();
                }

            }

            if (this.height && this.textHeight
                && this.textHeight > this.height
            ) {

                while (this.textHeight > this.height) {

                    this.defaultTextFormat.size--;
                    if (1 > this.defaultTextFormat.size) {
                        this.defaultTextFormat.size = 1;
                        break;
                    }

                    this._$reset();
                    this._$getTextData();
                }

            }

            // restore
            this.defaultTextFormat.size = fontSize;
        }

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
            const width = this.textWidth + 4
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

        } else {

            if (this._$scrollEnabled && !this._$scrollSprite) {
                this._$scrollSprite = new Sprite();
                this._$scrollSprite
                    .graphics
                    .beginFill("#000", 0.3)
                    .drawRoundRect(0, 0, 3, 3, 3);
                this._$scrollSprite._$scale9Grid = new Rectangle(1.5, 1.5, 0.1, 0.1);
            }
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
                return $Math.max(0, indent);

            case textFormat._$align === TextFormatAlign.CENTER: // format CENTER
            case this._$autoSize === TextFieldAutoSize.CENTER: // autoSize CENTER
                return $Math.max(0, width / 2 - indent - textFormat._$rightMargin - totalWidth / 2);

            case textFormat._$align === TextFormatAlign.RIGHT: // format RIGHT
            case this._$autoSize === TextFieldAutoSize.RIGHT: // autoSize RIGHT
                return $Math.max(0, width - indent - totalWidth - textFormat._$rightMargin - 2);

            // autoSize LEFT
            // format LEFT
            default:
                return $Math.max(0, indent + 2);

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

            let multiMatrix = matrix;

            const rawMatrix = this._$transform._$rawMatrix();
            if (rawMatrix[0] !== 1 || rawMatrix[1] !== 0
                || rawMatrix[2] !== 0 || rawMatrix[3] !== 1
                || rawMatrix[4] !== 0 || rawMatrix[5] !== 0
            ) {
                multiMatrix = Util.$multiplicationMatrix(matrix, rawMatrix);
            }

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
     * @param  {object} character
     * @return {void}
     * @method
     * @private
     */
    _$buildCharacter (character)
    {
        const textFormat = this.defaultTextFormat;

        textFormat.font          = character.font;
        textFormat.size          = character.size | 0;
        textFormat.align         = character.align;
        textFormat.color         = character.color | 0;
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

        // setup
        this._$type           = character.inputType;
        this._$multiline      = !!character.multiline;
        this._$wordWrap       = !!character.wordWrap;
        this._$border         = !!character.border;
        this._$scrollEnabled  = !!character.scroll;
        this._$thickness      = character.thickness | 0;
        this._$thicknessColor = character.thicknessColor | 0;

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

        if (Util.$rendererWorker && this._$stage) {
            this._$createWorkerInstance();
        }
    }

    /**
     * @return {object}
     * @method
     * @private
     */
    _$sync ()
    {
        const character = super._$sync();

        if (character) {
            this._$buildCharacter(character);
        }

        return character;
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

        this._$buildCharacter(character);

        return character;
    }

    /**
     * @param  {CanvasToWebGLContext} context
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

        let width  = $Math.ceil($Math.abs(xMax - xMin));
        let height = $Math.ceil($Math.abs(yMax - yMin));
        if (!width || !height) {
            return;
        }

        let multiMatrix = matrix;
        const rawMatrix = this._$transform._$rawMatrix();
        if (rawMatrix[0] !== 1 || rawMatrix[1] !== 0
            || rawMatrix[2] !== 0 || rawMatrix[3] !== 1
            || rawMatrix[4] !== 0 || rawMatrix[5] !== 0
        ) {
            multiMatrix = Util.$multiplicationMatrix(matrix, rawMatrix);
        }

        Util.$resetContext(context);
        context.setTransform(
            matrix[0], matrix[1], matrix[2],
            matrix[3], matrix[4], matrix[5]
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
        if (rawColor[0] !== 1 || rawColor[1] !== 1
            || rawColor[2] !== 1 || rawColor[3] !== 1
            || rawColor[4] !== 0 || rawColor[5] !== 0
            || rawColor[6] !== 0 || rawColor[7] !== 0
        ) {
            multiColor = Util.$multiplicationColor(color_transform, rawColor);
        }

        const alpha = Util.$clamp(multiColor[3] + multiColor[7] / 255, 0 ,1);
        if (!alpha) {
            return ;
        }

        let multiMatrix = matrix;
        const rawMatrix = this._$transform._$rawMatrix();
        if (rawMatrix[0] !== 1 || rawMatrix[1] !== 0
            || rawMatrix[2] !== 0 || rawMatrix[3] !== 1
            || rawMatrix[4] !== 0 || rawMatrix[5] !== 0
        ) {
            multiMatrix = Util.$multiplicationMatrix(matrix, rawMatrix);
        }

        const baseBounds = this._$getBounds(null);
        baseBounds.xMin -= this._$thickness;
        baseBounds.xMax += this._$thickness;
        baseBounds.yMin -= this._$thickness;
        baseBounds.yMax += this._$thickness;

        const bounds = Util.$boundsMatrix(baseBounds, multiMatrix);
        const xMax   = +bounds.xMax;
        const xMin   = +bounds.xMin;
        const yMax   = +bounds.yMax;
        const yMin   = +bounds.yMin;
        Util.$poolBoundsObject(bounds);

        let width  = $Math.ceil($Math.abs(xMax - xMin));
        let height = $Math.ceil($Math.abs(yMax - yMin));
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

        if (0 > xMin + width || 0 > yMin + height) {
            return;
        }

        // cache current buffer
        const manager = context._$frameBufferManager;
        const currentAttachment = manager.currentAttachment;
        if (xMin > currentAttachment.width
            || yMin > currentAttachment.height
        ) {
            return;
        }

        let xScale = +$Math.sqrt(
            multiMatrix[0] * multiMatrix[0]
            + multiMatrix[1] * multiMatrix[1]
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
            multiMatrix[2] * multiMatrix[2]
            + multiMatrix[3] * multiMatrix[3]
        );
        if (!$Number.isInteger(yScale)) {
            const value = yScale.toString();
            const index = value.indexOf("e");
            if (index !== -1) {
                yScale = +value.slice(0, index);
            }
            yScale = +yScale.toFixed(4);
        }

        const filters = this._$filters || this.filters;
        if (0 > xMin + width || 0 > yMin + height) {

            if (filters && filters.length && this._$canApply(filters)) {

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

        const blendMode = this._$blendMode || this.blendMode;
        const keys = Util.$getArray(xScale, yScale);

        const instanceId = this._$instanceId;

        const cacheStore = Util.$cacheStore();
        const cacheKeys  = cacheStore.generateKeys(
            instanceId, keys
        );

        let texture = cacheStore.get(cacheKeys);

        // texture is small or renew
        if (this._$isUpdated()) {
            cacheStore.removeCache(instanceId);
            texture = null;
        }

        if (!texture) {

            // resize
            const lineWidth  = $Math.min(1, $Math.max(xScale, yScale));
            const baseWidth  = $Math.ceil($Math.abs(baseBounds.xMax - baseBounds.xMin) * xScale);
            const baseHeight = $Math.ceil($Math.abs(baseBounds.yMax - baseBounds.yMin) * yScale);

            // alpha reset
            multiColor[3] = 1;

            // new canvas
            const canvas  = cacheStore.getCanvas();
            canvas.width  = baseWidth  + lineWidth * 2;
            canvas.height = baseHeight + lineWidth * 2;
            const ctx     = canvas.getContext("2d");

            // border and background
            if (this._$background || this._$border) {

                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(baseWidth, 0);
                ctx.lineTo(baseWidth, baseHeight);
                ctx.lineTo(0, baseHeight);
                ctx.lineTo(0, 0);

                if (this._$background) {

                    const rgb   = Util.$intToRGBA(this._$backgroundColor);
                    const alpha = $Math.max(0, $Math.min(
                        rgb.A * 255 * multiColor[3] + multiColor[7], 255)
                    ) / 255;

                    ctx.fillStyle = `rgba(${rgb.R},${rgb.G},${rgb.B},${alpha})`;
                    ctx.fill();
                }

                if (this._$border) {

                    const rgb   = Util.$intToRGBA(this._$borderColor);
                    const alpha = $Math.max(0, $Math.min(
                        rgb.A * 255 * multiColor[3] + multiColor[7], 255)
                    ) / 255;

                    ctx.lineWidth   = lineWidth;
                    ctx.strokeStyle = `rgba(${rgb.R},${rgb.G},${rgb.B},${alpha})`;
                    ctx.stroke();

                }

            }

            // mask start
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(2, 2);
            ctx.lineTo(baseWidth - 2, 2);
            ctx.lineTo(baseWidth - 2, baseHeight - 2);
            ctx.lineTo(2, baseHeight - 2);
            ctx.lineTo(2, 2);
            ctx.clip();

            ctx.beginPath();
            ctx.setTransform(xScale, 0, 0, yScale, 0, 0);
            this._$doDraw(ctx, matrix, multiColor, baseWidth / xScale);
            ctx.restore();

            texture = manager.createTextureFromCanvas(ctx.canvas);

            // set cache
            if (Util.$useCache) {
                cacheStore.set(cacheKeys, texture);
            }

            // destroy cache
            cacheStore.destroy(ctx);
        }

        let drawFilter = false;
        let offsetX = 0;
        let offsetY = 0;
        if (filters && filters.length
            && this._$canApply(filters)
        ) {

            drawFilter = true;

            texture = this._$drawFilter(
                context, texture, multiMatrix,
                filters, width, height
            );

            offsetX = texture._$offsetX;
            offsetY = texture._$offsetY;
        }

        const radianX = $Math.atan2(multiMatrix[1], multiMatrix[0]);
        const radianY = $Math.atan2(-multiMatrix[2], multiMatrix[3]);
        if (!drawFilter && (radianX || radianY)) {

            const tx = baseBounds.xMin * xScale;
            const ty = baseBounds.yMin * yScale;

            const cosX = $Math.cos(radianX);
            const sinX = $Math.sin(radianX);
            const cosY = $Math.cos(radianY);
            const sinY = $Math.sin(radianY);

            context.setTransform(
                cosX, sinX, -sinY, cosY,
                tx * cosX - ty * sinY + multiMatrix[4],
                tx * sinX + ty * cosY + multiMatrix[5]
            );

        } else {

            context.setTransform(1, 0, 0, 1,
                xMin - offsetX, yMin - offsetY
            );

        }

        // reset
        Util.$resetContext(context);

        // draw
        context._$globalAlpha = alpha;
        context._$imageSmoothingEnabled = true;
        context._$globalCompositeOperation = blendMode;

        context.drawImage(texture,
            0, 0, texture.width, texture.height, multiColor
        );

        // get cache
        Util.$poolArray(cacheKeys);
        Util.$poolBoundsObject(baseBounds);

        // pool
        if (multiMatrix !== matrix) {
            Util.$poolFloat32Array6(multiMatrix);
        }

        if (multiColor !== color_transform) {
            Util.$poolFloat32Array8(multiColor);
        }
    }

    /**
     * @param  {CanvasRenderingContext2D} context
     * @param  {Float32Array} matrix
     * @param  {Float32Array} color_transform
     * @param  {number} width
     * @return {void}
     * @method
     * @private
     */
    _$doDraw (context, matrix, color_transform, width)
    {
        // init
        const textData = this._$getTextData();

        const limitWidth  = this.width;
        const limitHeight = this.height;

        // setup
        let xOffset      = 0;
        let offsetHeight = 0;
        let currentV     = 0;

        let yOffset = 0;
        if (this._$verticalAlign !== TextFormatVerticalAlign.TOP
            && this.height > this.textHeight
        ) {

            switch (this._$verticalAlign) {

                case TextFormatVerticalAlign.MIDDLE:
                    yOffset = (this.height - this.textHeight + 2) / 2;
                    break;

                case TextFormatVerticalAlign.BOTTOM:
                    yOffset = this.height - this.textHeight + 2;
                    break;

            }

        }

        const length = textData.length;
        for (let idx = 0; idx < length; ++idx) {

            let obj = textData[idx];
            if (obj.width === 0) {
                continue;
            }

            // check
            const offsetWidth = xOffset + obj.x;
            if (this._$autoSize === TextFieldAutoSize.NONE
                && (offsetHeight > limitHeight || offsetWidth > limitWidth)
            ) {
                continue;
            }

            let tf = obj.textFormat;

            // color
            const rgb   = Util.$intToRGBA(obj.textFormat._$color);
            const alpha = $Math.max(0, $Math.min(
                rgb.A * 255 * color_transform[3] + color_transform[7], 255)
            ) / 255;

            context.fillStyle = `rgba(${rgb.R},${rgb.G},${rgb.B},${alpha})`;

            if (this._$thickness) {
                const rgb   = Util.$intToRGBA(this._$thicknessColor);
                const alpha = $Math.max(0, $Math.min(
                    rgb.A * 255 * color_transform[3] + color_transform[7], 255)
                ) / 255;
                context.lineWidth   = this._$thickness;
                context.strokeStyle = `rgba(${rgb.R},${rgb.G},${rgb.B},${alpha})`;
            }

            const yIndex = obj.yIndex | 0;
            switch (obj.mode) {

                case TextMode.BREAK:
                case TextMode.WRAP:

                    currentV++;

                    if (this.scrollV > currentV) {
                        continue;
                    }

                    offsetHeight += this._$textHeightTable[yIndex];

                    xOffset = this._$getAlignOffset(this._$objectTable[yIndex], width);
                    if (tf._$underline) {

                        const offset = obj.textFormat._$size / 12;

                        const rgb   = Util.$intToRGBA(tf._$color);
                        const alpha = $Math.max(0, $Math.min(
                            rgb.A * 255 * color_transform[3] + color_transform[7], 255)
                        ) / 255;

                        context.lineWidth   = $Math.max(1, 1 / $Math.min(matrix[0], matrix[3]));
                        context.strokeStyle = `rgba(${rgb.R},${rgb.G},${rgb.B},${alpha})`;

                        context.beginPath();
                        context.moveTo(xOffset, yOffset + offsetHeight - offset);
                        context.lineTo(xOffset + this._$widthTable[yIndex], yOffset + offsetHeight - offset);
                        context.stroke();

                    }

                    break;

                case TextMode.TEXT:
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
                        context.font = Util.$generateFontStyle(
                            tf._$font, tf._$size, tf._$italic, tf._$bold
                        );

                        if (this._$thickness) {
                            context.strokeText(obj.text, offsetWidth, yOffset + offsetY);
                        }

                        context.fillText(obj.text, offsetWidth, yOffset + offsetY);

                    }
                    break;

                case TextMode.IMAGE:

                    if (!obj.loaded) {
                        continue;
                    }

                    context.beginPath();
                    context.drawImage(obj.image,
                        obj.hspace, yOffset + obj.y,
                        obj.width, obj.height
                    );

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
        if (rawMatrix[0] !== 1 || rawMatrix[1] !== 0
            || rawMatrix[2] !== 0 || rawMatrix[3] !== 1
            || rawMatrix[4] !== 0 || rawMatrix[5] !== 0
        ) {
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

        const width  = $Math.ceil($Math.abs(xMax - xMin));
        const height = $Math.ceil($Math.abs(yMax - yMin));

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

    /**
     * @param  {number} scale
     * @return {void}
     * @method
     * @private
     */
    _$createTextAreaElement (scale)
    {
        // new text area
        if (!this._$textarea) {

            this._$textarea       = $document.createElement("textarea");
            this._$textarea.value = this.text;
            this._$textarea.id    = `${Util.$PREFIX}_TextField_${this._$instanceId}`;

            if (!this._$wordWrap) {
                this._$textarea.wrap = "off";
            }

            const textFormat = this.defaultTextFormat;

            // setup
            const style = this._$textarea.style;
            style.position         = "absolute";
            style.outline          = "0";
            style.padding          = `2px 2px 2px ${$Math.max(3, textFormat.leftMargin | 0)}px`;
            style.margin           = "0";
            style.appearance       = "none";
            style.resize           = "none";
            style.border           = this._$border ? `solid 1px #${this.borderColor.toString(16)}` : "none";
            style.overflow         = "hidden";
            style.zIndex           = 0x7fffffff;
            style.verticalAlign    = "top";
            style.backgroundColor  = this._$border || this._$background
                ? `#${this.backgroundColor.toString(16)}`
                : "transparent";

            // add blur event
            this._$textarea.addEventListener(`${Util.$PREFIX}_blur`, (event) =>
            {
                // set new text
                let value = event.target.value ? event.target.value : "";
                if (value && this._$restrict) {

                    let pattern = this._$restrict;

                    if (pattern[0] !== "[") {
                        pattern = "[" + pattern;
                    }

                    if (pattern[pattern.length - 1] !== "]") {
                        pattern += "]";
                    }

                    const found = value.match(new $RegExp(pattern, "gm"));
                    value = found ? found.join("") : "";
                }

                const div = $document.getElementById(
                    Util.$currentPlayer().contentElementId
                );

                if (div) {

                    const element = $document.getElementById(
                        `${Util.$PREFIX}_TextField_${this._$instanceId}`
                    );

                    if (element) {
                        element.remove();
                    }
                }

                this.text = value;
                this._$focus = false;
                this._$textAreaActive = false;

                this._$doChanged();
                Util.$isUpdated = true;
            });

            // input event
            this._$textarea.addEventListener("input", (event) =>
            {
                // set new text
                let value = event.target.value ? event.target.value : "";

                // SafariではInputEvent.isComposingがundefined
                if (this._$restrict && !this._$isComposing && value) {
                    let pattern = this._$restrict;

                    if (pattern[0] !== "[") {
                        pattern = "[" + pattern;
                    }

                    if (pattern[pattern.length - 1] !== "]") {
                        pattern += "]";
                    }

                    const found = value.match(new $RegExp(pattern, "gm"));
                    value = found ? found.join("") : "";
                }

                if (!this._$isComposing && this.text !== value) {

                    // update
                    this.text = value;
                    event.target.value = value;

                    if (this.willTrigger(Event.CHANGE)) {
                        this.dispatchEvent(new Event(Event.CHANGE, true));
                    }

                    const player = Util.$currentPlayer();

                    // setup
                    const element = this._$textarea;
                    const matrix  = this._$transform.concatenatedMatrix;
                    const bounds  = this._$getBounds(null);

                    element.style.left   = `${$Math.floor((matrix.tx + bounds.xMin + player._$tx / player._$scale / $devicePixelRatio) * player._$scale)}px`;
                    element.style.top    = `${$Math.floor((matrix.ty + bounds.yMin + player._$ty / player._$scale / $devicePixelRatio) * player._$scale)}px`;
                    element.style.width  = `${$Math.ceil((this.width  - 1) * player._$scale)}px`;
                    element.style.height = `${$Math.ceil((this.height - 1) * player._$scale)}px`;
                }

            });

            // IME入力開始時のevent
            this._$textarea.addEventListener("compositionstart", () =>
            {
                this._$isComposing = true;
            });

            // IME入力確定時のevent
            this._$textarea.addEventListener("compositionend", (event) =>
            {
                this._$isComposing = false;
                let value = event.target.value ? event.target.value : "";

                if (!this._$restrict || !value) {
                    return;
                }

                let pattern = this._$restrict;

                if (pattern[0] !== "[") {
                    pattern = "[" + pattern;
                }

                if (pattern[pattern.length - 1] !== "]") {
                    pattern += "]";
                }

                const found = value.match(new $RegExp(pattern, "gm"));
                value = found ? found.join("") : "";

                // update
                this.text = value;
                event.target.value = value;
            });

            // add click event
            this._$textarea.addEventListener("click", () =>
            {
                if (this.willTrigger(MouseEvent.CLICK)) {
                    this.dispatchEvent(new MouseEvent(MouseEvent.CLICK));
                }
            });

            // add mousewheel event
            this._$textarea.addEventListener(Util.$MOUSE_WHEEL, (event) =>
            {
                this.scrollV += event.deltaY;
            });

            // add scroll event
            this._$textarea.addEventListener(Util.$SCROLL, () =>
            {
                if (this._$scrollEventLock) {
                    this._$scrollEventLock = false;
                    return;
                }

                const height = parseFloat(this._$textarea.style.height);
                this.scrollV = this._$textarea.scrollTop / (this._$textarea.scrollHeight - height) * this.maxScrollV + 1;
            });

            switch (true) {

                case Util.$isTouch:
                    // down event
                    this._$textarea.addEventListener(Util.$TOUCH_START, () =>
                    {
                        const player = Util.$currentPlayer();
                        if (player) {
                            player._$state  = "down";
                        }
                    });

                    // up event
                    this._$textarea.addEventListener(Util.$TOUCH_END, () =>
                    {
                        const player = Util.$currentPlayer();
                        if (player) {
                            player._$state  = "up";
                        }
                    });
                    break;

                default:
                    // down event
                    this._$textarea.addEventListener(Util.$MOUSE_DOWN, () =>
                    {
                        const player = Util.$currentPlayer();
                        if (player) {
                            player._$state  = "down";
                        }
                    });

                    // up event
                    this._$textarea.addEventListener(Util.$MOUSE_UP, () =>
                    {
                        const player = Util.$currentPlayer();
                        if (player) {
                            player._$state  = "up";
                        }
                    });

                    break;

            }

        }

        // change style
        const tf = this.defaultTextFormat;
        const fontSize = $Math.ceil(tf.size * scale * this._$transform.concatenatedMatrix.d);
        this._$textarea.style.fontSize   = `${fontSize}px`;
        this._$textarea.style.fontFamily = tf.font;
        this._$textarea.style.lineHeight = `${(fontSize + $Math.max(0, tf.leading | 0)) / fontSize}em`;

        if (this._$autoSize !== TextFieldAutoSize.NONE) {
            this._$textarea.style.textAlign = TextFieldAutoSize.CENTER;
        } else {
            this._$textarea.style.textAlign = tf.align;
        }

        if (!this._$textarea.onkeydown) {
            this._$textarea.onkeydown = (event) =>
            {

                // set new text
                let value = event.target.value ? event.target.value : "";

                // SafariではInputEvent.isComposingがundefined
                if (this._$restrict && !this._$isComposing && value) {
                    let pattern = this._$restrict;

                    if (pattern[0] !== "[") {
                        pattern = "[" + pattern;
                    }

                    if (pattern[pattern.length - 1] !== "]") {
                        pattern += "]";
                    }

                    const found = value.match(new $RegExp(pattern, "gm"));
                    value = found ? found.join("") : "";
                }

                // update
                if (!this._$isComposing) {
                    this.text = value;
                    event.target.value = value;
                }

                // enter off
                if (event.keyCode === 13 && !this._$multiline) {
                    return false;
                }

            };
        }

        //reset
        this._$textarea.maxLength = 0x7fffffff;
        if (this._$maxChars) {
            this._$textarea.maxLength = this._$maxChars;
        }
    }

    /**
     * @return {void}
     * @method
     * @private
     */
    _$createWorkerInstance ()
    {
        if (this._$created) {
            return ;
        }
        this._$created = true;

        const bounds = this._$getBounds();

        const message = {
            "command": "createTextField",
            "instanceId": this._$instanceId,
            "xMin": bounds.xMin,
            "yMin": bounds.yMin,
            "xMax": bounds.xMax,
            "yMax": bounds.yMax,
            "textData": this._$getTextData(),
            "scrollV": this.scrollV,
            "widthTable": this._$widthTable,
            "heightTable": this._$heightTable,
            "textHeightTable": this._$textHeightTable,
            "objectTable": this._$objectTable,
            "limitWidth": this.width,
            "limitHeight": this.height,
            "textHeight": this.textHeight,
            "verticalAlign": this._$verticalAlign,
            "autoSize": this._$autoSize
        };

        if (this._$characterId > -1) {
            message.characterId = this._$characterId;
        }

        if (this._$loaderInfo) {
            message.loaderInfoId = this._$loaderInfo._$id;
        }

        if (this._$scale9Grid) {
            message.grid = {
                "x": this._$scale9Grid.x,
                "y": this._$scale9Grid.y,
                "w": this._$scale9Grid.width,
                "h": this._$scale9Grid.height
            };
        }

        Util.$rendererWorker.postMessage(message);
    }

    /**
     * @return {object}
     * @method
     * @private
     */
    _$postProperty ()
    {
        const message = super._$postProperty();

        message.textAreaActive = this._$textAreaActive;

        const bounds = this._$getBounds(null);
        message.xMin = bounds.xMin;
        message.yMin = bounds.yMin;
        message.xMax = bounds.xMax;
        message.yMax = bounds.yMax;
        Util.$poolBoundsObject(bounds);

        if (this._$isUpdated()) {

            message.textData        = this._$getTextData();
            message.scrollV         = this.scrollV;
            message.widthTable      = this._$widthTable;
            message.heightTable     = this._$heightTable;
            message.textHeightTable = this._$textHeightTable;
            message.objectTable     = this._$objectTable;
            message.limitWidth      = this.width;
            message.limitHeight     = this.height;
            message.textHeight      = this.textHeight;
            message.verticalAlign   = this._$verticalAlign;
            message.autoSize        = this._$autoSize;
            message.wordWrap        = this._$wordWrap;

            message.border = this._$border;
            if (this._$border) {
                message.borderColor = this._$borderColor;
            }

            message.background = this._$background;
            if (this._$background) {
                message.backgroundColor = this._$backgroundColor;
            }

            message.thickness = this._$thickness;
            if (this._$thickness) {
                message.thicknessColor = this._$backgroundColor;
            }
        }

        Util
            .$rendererWorker
            .postMessage(message);

        this._$posted  = true;
        this._$updated = false;
    }
}
