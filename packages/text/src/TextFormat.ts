import { TextFormatAlignImpl } from "@next2d/interface";
import {
    $clamp,
    $intToRGBA,
    $toColorInt
} from "@next2d/share";

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
export class TextFormat
{
    private _$font: string | null;
    private _$size: number | null;
    private _$color: number | null;
    private _$bold: boolean | null;
    private _$italic: boolean | null;
    private _$underline: boolean | null;
    private _$align: TextFormatAlignImpl | null;
    private _$leftMargin: number | null;
    private _$rightMargin: number | null;
    private _$leading: number | null;
    private _$letterSpacing: number | null;

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
     * @param {number}  [leading=null]
     *
     * @constructor
     * @public
     */
    constructor(
        font: string | null = null,
        size: number | null = null,
        color: number | null = null,
        bold: boolean | null = null,
        italic: boolean | null = null,
        underline: boolean | null = null,
        align: TextFormatAlignImpl | null = null,
        left_margin: number | null = null,
        right_margin: number | null = null,
        leading: number | null = null
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
        this._$color = color === null
            ? null
            : $clamp($toColorInt(color), 0, 0xffffff, 0);

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
        this._$leading = leading;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$letterSpacing = 0;
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
    static toString (): string
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
    static get namespace (): string
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
    toString (): string
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
     * @public
     */
    get namespace (): string
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
    get align (): TextFormatAlignImpl | null
    {
        return this._$align;
    }
    set align (align: TextFormatAlignImpl | null)
    {
        this._$align = align;
    }

    /**
     * @description テキストをボールドにするかどうかを指定します。
     *              Specifies whether the text is boldface.
     *
     * @member {boolean}
     * @default null
     * @public
     */
    get bold (): boolean | null
    {
        return this._$bold;
    }
    set bold (bold: boolean | null)
    {
        this._$bold = bold !== null ? !!bold : null;
    }

    /**
     * @description テキストの色を示します。
     *              Indicates the color of the text.
     *
     * @member {number}
     * @default null
     * @public
     */
    get color (): number | null
    {
        return this._$color;
    }
    set color (color: number | null)
    {
        this._$color = color;
        if (color) {
            this._$color = $clamp($toColorInt(color), 0, 0xffffff, 0);
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
    get font (): string | null
    {
        return this._$font;
    }
    set font (font: string | null)
    {
        this._$font = font !== null ? `${font}` : null;
    }

    /**
     * @description このテキストフォーマットのテキストをイタリックにするかどうかを示します。
     *              Indicates whether text in this text format is italicized.
     *
     * @member {boolean}
     * @default null
     * @public
     */
    get italic (): boolean | null
    {
        return this._$italic;
    }
    set italic (italic: boolean | null)
    {
        this._$italic = italic !== null ? !!italic : null;
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
    get leading (): number | null
    {
        return this._$leading;
    }
    set leading (leading: number | null)
    {
        this._$leading = leading;
    }

    /**
     * @description 段落の左インデントをピクセル単位で示します。
     *              The left margin of the paragraph, in pixels.
     *
     * @member {number}
     * @default null
     * @public
     */
    get leftMargin (): number | null
    {
        return this._$leftMargin;
    }
    set leftMargin (left_margin: number | null)
    {
        this._$leftMargin = left_margin;
    }

    /**
     * @description すべての文字の間に均等に配分されるスペースの量を表す数値です。
     *              A object representing the amount
     *              of space that is uniformly distributed between all characters.
     *
     * @member {number}
     * @default null
     * @public
     */
    get letterSpacing (): number | null
    {
        return this._$letterSpacing;
    }
    set letterSpacing (letter_spacing: number | null)
    {
        this._$letterSpacing = letter_spacing;
    }

    /**
     * @description 段落の右インデントをピクセル単位で示します。
     *              The right margin of the paragraph, in pixels.
     *
     * @member {number}
     * @default null
     * @public
     */
    get rightMargin (): number | null
    {
        return this._$rightMargin;
    }
    set rightMargin (right_margin: number | null)
    {
        this._$rightMargin = right_margin;
    }

    /**
     * @description このテキストフォーマットのテキストのサイズ（ピクセル単位）です。
     *              The size in pixels of text in this text format.
     *
     * @member {number}
     * @default null
     * @public
     */
    get size (): number | null
    {
        return this._$size;
    }
    set size (size: number | null)
    {
        this._$size = size ? size | 0 : null;
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
    get underline (): boolean | null
    {
        return this._$underline;
    }
    set underline (underline: boolean | null)
    {
        this._$underline = underline !== null ? !!underline : null;
    }

    /**
     * @return {string}
     * @method
     * @private
     */
    _$toStyleString (): string
    {
        let style: string = "";

        if (this._$font) {
            style += `font-family: ${this._$font};`;
        }

        if (this._$size) {
            style += `font-size: ${this._$size}px;`;
        }

        if (this._$color) {
            const color = $intToRGBA($toColorInt(this._$color));
            const R: string = color.R.toString(16).padStart(2, "0");
            const G: string = color.G.toString(16).padStart(2, "0");
            const B: string = color.B.toString(16).padStart(2, "0");
            style += `color: #${R}${G}${B};`;
        }

        if (this._$bold) {
            style += "font-weight: bold;";
        }

        if (this._$italic) {
            style += "font-style: italic;";
        }

        if (this._$underline) {
            style += "text-decoration: underline;";
        }

        if (this._$align) {
            style += `text-align: ${this._$align};`;
        }

        if (this._$leftMargin) {
            style += `margin-left: ${this._$leftMargin}px;`;
        }

        if (this._$rightMargin) {
            style += `margin-right: ${this._$rightMargin}px;`;
        }

        if (this._$leading) {
            style += `margin-bottom: ${this._$leading}px;`;
        }

        if (this._$letterSpacing) {
            style += `letter-spacing: ${this._$letterSpacing}px;`;
        }

        return style;
    }

    /**
     * @return {boolean}
     * @method
     * @private
     */
    _$isSame (text_format: TextFormat): boolean
    {
        if (this._$font !== text_format.font) {
            return false;
        }

        if (this._$size !== text_format.size) {
            return false;
        }

        if (this._$color !== text_format.color) {
            return false;
        }

        if (this._$bold !== text_format.bold) {
            return false;
        }

        if (this._$italic !== text_format.italic) {
            return false;
        }

        if (this._$underline !== text_format.underline) {
            return false;
        }

        if (this._$align !== text_format.align) {
            return false;
        }

        if (this._$leftMargin !== text_format.leftMargin) {
            return false;
        }

        if (this._$rightMargin !== text_format.rightMargin) {
            return false;
        }

        if (this._$leading !== text_format.leading) {
            return false;
        }

        if (this._$letterSpacing !== text_format.letterSpacing) {
            return false;
        }

        return true;
    }

    /**
     * @return {next2d.text.TextFormat}
     * @method
     * @private
     */
    _$clone (): TextFormat
    {
        const textFormat = new TextFormat(
            this._$font, this._$size, this._$color, this._$bold,
            this._$italic, this._$underline, this._$align,
            this._$leftMargin, this._$rightMargin, this._$leading
        );

        textFormat._$letterSpacing = this._$letterSpacing;

        return textFormat;
    }

    /**
     * @return {void}
     * @method
     * @private
     */
    _$setDefault (): void
    {
        this._$align         = "left";
        this._$bold          = false;
        this._$color         = 0;
        this._$font          = "Times New Roman";
        this._$italic        = false;
        this._$leading       = 0;
        this._$leftMargin    = 0;
        this._$letterSpacing = 0;
        this._$rightMargin   = 0;
        this._$size          = 12;
        this._$underline     = false;
    }

    /**
     * @param  {TextFormat} text_format
     * @return {void}
     * @method
     * @private
     */
    _$merge (text_format: TextFormat): void
    {
        if (this._$align === null) {
            this._$align = text_format._$align;
        }

        if (this._$bold === null) {
            this._$bold = text_format._$bold;
        }

        if (this._$color === null) {
            this._$color = text_format._$color;
        }

        if (this._$font === null) {
            this._$font = text_format._$font;
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
    _$widthMargin (): number
    {
        let width = 0;

        if (this._$leftMargin) {
            width += this._$leftMargin;
        }

        if (this._$rightMargin) {
            width += this._$rightMargin;
        }

        return width;
    }

    /**
     * @return {string}
     * @method
     * @private
     */
    _$generateFontStyle (): string
    {
        let fontStyle = "";
        if (this._$italic) {
            fontStyle = "italic ";
        }
        if (this._$bold) {
            fontStyle += "bold ";
        }

        return `${fontStyle}${this._$size}px '${this._$font}',sans-serif`;
    }
}
