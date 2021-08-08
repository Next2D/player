/**
 * TextFormat クラスは、文字フォーマット情報を表します。
 * TextFormat クラスを使用して、テキストフィールドに特定のテキストフォーマットを作成します。
 *
 * The TextFormat class represents character formatting information.
 * Use the TextFormat class to create specific text formatting for text fields.
 *
 * @class
 * @memberOf next2d.text
 */
class TextFormat
{
    /**
     * @param {string}  [font=null]
     * @param {number}  [size=null]
     * @param {number}  [color=null]
     * @param {boolean} [bold=null]
     * @param {boolean} [italic=null]
     * @param {boolean} [underline=null]
     * @param {string}  [align=null]
     * @param {number}  [left_margin=null]
     * @param {number}  [right_margin=null]
     * @param {number}  [indent=null]
     * @param {number}  [leading=null]
     * @param {number}  [block_indent=null]
     *
     * @constructor
     * @public
     */
    constructor(
        font = null, size = null, color = null, bold = null, italic = null,
        underline = null, align = null, left_margin = null, right_margin = null,
        indent = null, leading = null, block_indent = null
    ) {

        /**
         * @type {string}
         * @default null
         * @private
         */
        this._$font = font;

        /**
         * @type {number}
         * @default null
         * @private
         */
        this._$size = size;

        /**
         * @type {number}
         * @default null
         * @private
         */
        this._$color = color;

        /**
         * @type {boolean}
         * @default null
         * @private
         */
        this._$bold = bold;

        /**
         * @type {boolean}
         * @default null
         * @private
         */
        this._$italic = italic;

        /**
         * @type {boolean}
         * @default null
         * @private
         */
        this._$underline = underline;

        /**
         * @type {string}
         * @default null
         * @private
         */
        this._$align = align;

        /**
         * @type {number}
         * @default null
         * @private
         */
        this._$leftMargin  = left_margin;

        /**
         * @type {number}
         * @default null
         * @private
         */
        this._$rightMargin = right_margin;

        /**
         * @type {number}
         * @default null
         * @private
         */
        this._$indent = indent;

        /**
         * @type {number}
         * @default null
         * @private
         */
        this._$leading = leading;

        /**
         * @type {number}
         * @default null
         * @private
         */
        this._$blockIndent   = block_indent;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$letterSpacing = 0;

        /**
         * @type {TextField}
         * @default null
         * @private
         */
        this._$textField = null;
    }

    /**
     * @description 指定されたクラスのストリングを返します。
     *              Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default [class TextFormat]
     * @method
     * @static
     */
    static toString ()
    {
        return "[class TextFormat]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return  {string}
     * @default next2d.text.TextFormat
     * @const
     * @static
     */
    static get namespace ()
    {
        return "next2d.text.TextFormat";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return  {string}
     * @default [object TextFormat]
     * @method
     * @public
     */
    toString ()
    {
        return "[object TextFormat]";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @return  {string}
     * @default next2d.text.TextFormat
     * @const
     * @static
     */
    get namespace ()
    {
        return "next2d.text.TextFormat";
    }

    /**
     * @description 段落の行揃えの設定を示します。
     *              Indicates the alignment of the paragraph.
     *
     * @member {string}
     * @default null
     * @public
     */
    get align ()
    {
        return this._$align;
    }
    set align (align)
    {
        this._$align = null;
        switch (align) {

            case TextFormatAlign.CENTER:
            case TextFormatAlign.RIGHT:
            case TextFormatAlign.LEFT:
                this._$align = align;
                break;

            default:
                break;

        }

        if (this._$textField) {
            this._$textField._$renew = true;
        }
    }

    /**
     * @description ブロックのインデントをピクセル単位で示します。
     *              Indicates the block indentation in pixels.
     *
     * @member {number}
     * @default null
     * @public
     */
    get blockIndent ()
    {
        return this._$blockIndent;
    }
    set blockIndent (block_indent)
    {
        this._$blockIndent = block_indent;
        if (this._$textField) {
            this._$textField._$renew = true;
        }
    }

    /**
     * @description テキストをボールドにするかどうかを指定します。
     *              Specifies whether the text is boldface.
     *
     * @member {boolean}
     * @default null
     * @public
     */
    get bold ()
    {
        return this._$bold;
    }
    set bold (bold)
    {
        this._$bold = bold;
        if (this._$textField) {
            this._$textField._$renew = true;
        }
    }

    /**
     * @description テキストの色を示します。
     *              Indicates the color of the text.
     *
     * @member {number}
     * @default null
     * @public
     */
    get color ()
    {
        return this._$color;
    }
    set color (color)
    {
        this._$color = Util.$clamp(color, 0, 0xffffffff, 0);
        if (this._$textField) {
            this._$textField._$renew = true;
        }
    }

    /**
     * @description このテキストフォーマットでのテキストフォント名を示すストリングです。
     *              The name of the font for text in this text format, as a string.
     *
     * @member {string}
     * @default null
     * @public
     */
    get font ()
    {
        return this._$font;
    }
    set font (font)
    {
        this._$font = font;
        if (this._$textField) {
            this._$textField._$renew = true;
        }
    }

    /**
     * @description 左インデントから段落の先頭文字までのインデントを示します。
     *              Indicates the indentation from the left margin
     *              to the first character in the paragraph.
     *
     * @member {number}
     * @default null
     * @public
     */
    get indent ()
    {
        return this._$indent;
    }
    set indent (indent)
    {
        this._$indent = indent;
        if (this._$textField) {
            this._$textField._$renew = true;
        }
    }

    /**
     * @description このテキストフォーマットのテキストをイタリックにするかどうかを示します。
     *              Indicates whether text in this text format is italicized.
     *
     * @member {boolean}
     * @default null
     * @public
     */
    get italic ()
    {
        return this._$italic;
    }
    set italic (italic)
    {
        this._$italic = italic;
        if (this._$textField) {
            this._$textField._$renew = true;
        }
    }

    /**
     * @description 行間の垂直の行送りを示す整数です。
     *              An integer representing the amount
     *              of vertical space (called leading) between lines.
     *
     * @member {number}
     * @default null
     * @public
     */
    get leading ()
    {
        return this._$leading;
    }
    set leading (leading)
    {
        this._$leading = leading;
        if (this._$textField) {
            this._$textField._$renew = true;
        }
    }

    /**
     * @description 段落の左インデントをピクセル単位で示します。
     *              The left margin of the paragraph, in pixels.
     *
     * @member {number}
     * @default null
     * @public
     */
    get leftMargin ()
    {
        return this._$leftMargin;
    }
    set leftMargin (left_margin)
    {
        this._$leftMargin = left_margin;
        if (this._$textField) {
            this._$textField._$renew = true;
        }
    }

    /**
     * @description すべての文字の間に均等に配分されるスペースの量を表す数値です。
     *              A object representing the amount
     *              of space that is uniformly distributed between all characters.
     *
     * @member {number}
     * @default 0
     * @public
     */
    get letterSpacing ()
    {
        return this._$letterSpacing;
    }
    set letterSpacing (letter_spacing)
    {
        this._$letterSpacing = letter_spacing;
        if (this._$textField) {
            this._$textField._$renew = true;
        }
    }

    /**
     * @description 段落の右インデントをピクセル単位で示します。
     *              The right margin of the paragraph, in pixels.
     *
     * @member {number}
     * @default null
     * @public
     */
    get rightMargin ()
    {
        return this._$rightMargin;
    }
    set rightMargin (right_margin)
    {
        this._$rightMargin = right_margin;
        if (this._$textField) {
            this._$textField._$renew = true;
        }
    }

    /**
     * @description このテキストフォーマットのテキストのサイズ（ピクセル単位）です。
     *              The size in pixels of text in this text format.
     *
     * @member {number}
     * @default null
     * @public
     */
    get size ()
    {
        return this._$size;
    }
    set size (size)
    {
        this._$size = size;
        if (this._$textField) {
            this._$textField._$renew = true;
        }
    }

    /**
     * @description このテキストフォーマットを使用するテキストに
     *              アンダーラインを表示する（true）か、表示しない（false）かを示します。
     *              Indicates whether the text that uses this text format
     *              is underlined (true) or not (false).
     *
     * @member {boolean}
     * @default null
     * @public
     */
    get underline ()
    {
        return this._$underline;
    }
    set underline (underline)
    {
        this._$underline = underline;
        if (this._$textField) {
            this._$textField._$renew = true;
        }
    }

    /**
     * @return {next2d.text.TextFormat}
     * @private
     */
    _$clone ()
    {
        const textFormat = new TextFormat(
            this._$font, this._$size, this._$color, this._$bold,
            this._$italic, this._$underline, this._$align,
            this._$leftMargin, this._$rightMargin,
            this._$indent, this._$leading, this._$blockIndent
        );

        textFormat._$letterSpacing = this._$letterSpacing;
        textFormat._$textField     = this._$textField;

        return textFormat;
    }

    /**
     * @param  {TextField} text_field
     * @return {void}
     * @private
     */
    _$setDefault (text_field = null)
    {
        this._$align         = TextFormatAlign.LEFT;
        this._$blockIndent   = 0;
        this._$bold          = false;
        this._$color         = 0;
        this._$font          = "sans-serif";
        this._$indent        = 0;
        this._$italic        = false;
        this._$leading       = 0;
        this._$leftMargin    = 0;
        this._$letterSpacing = 0;
        this._$rightMargin   = 0;
        this._$size          = 12;
        this._$underline     = false;
        this._$textField     = text_field;
    }

    /**
     * @param  {TextFormat} text_format
     * @return {void}
     * @private
     */
    _$merge (text_format)
    {
        if (this._$align === null) {
            this._$align = text_format._$align;
        }

        if (this._$blockIndent === null) {
            this._$blockIndent = text_format._$blockIndent;
        }

        if (this._$bold === null) {
            this._$bold = text_format._$bold;
        }

        if (this._$color === null) {
            this._$color = text_format.color;
        }

        if (this._$font === null) {
            this._$font = text_format._$font;
        }

        if (this._$indent === null) {
            this._$indent = text_format._$indent;
        }

        if (this._$italic === null) {
            this._$italic = text_format._$italic;
        }

        if (this._$leading === null) {
            this._$leading = text_format._$leading;
        }

        if (this._$leftMargin === null) {
            this._$leftMargin = text_format._$leftMargin;
        }

        if (this._$letterSpacing === null) {
            this._$letterSpacing = text_format._$letterSpacing;
        }

        if (this._$rightMargin === null) {
            this._$rightMargin = text_format._$rightMargin;
        }

        if (this._$size === null) {
            this._$size = text_format._$size;
        }

        if (this._$underline === null) {
            this._$underline = text_format._$underline;
        }
    }

    /**
     * @return {number}
     * @method
     * @private
     */
    _$widthMargin ()
    {
        return this._$indent + this._$leftMargin + this._$rightMargin;
    }

    /**
     * @return {string}
     * @method
     * @private
     */
    _$generateFontStyle ()
    {
        let fontStyle = "";
        if (this._$italic) {
            fontStyle = "italic ";
        }
        if (this._$bold) {
            fontStyle += "bold ";
        }

        return `${fontStyle}${this._$size}px '${this._$font}','system-ui','sans-serif'`;
    }
}