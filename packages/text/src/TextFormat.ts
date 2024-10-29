import type { ITextFormatAlign } from "./interface/ITextFormatAlign";

/**
 * @description TextFormat クラスは、文字フォーマット情報を表します。
 *              TextFormat クラスを使用して、テキストフィールドに特定のテキストフォーマットを作成します。
 *
 *              The TextFormat class represents character formatting information.
 *              Use the TextFormat class to create specific text formatting for text fields.
 *
 * @class
 * @memberOf next2d.text
 */
export class TextFormat
{
    /**
     * @description 段落の行揃えの設定を示します。
     *              Indicates the alignment of the paragraph.
     *
     * @member {string}
     * @default null
     * @public
     */
    public align: ITextFormatAlign | null;

    /**
     * @description テキストをボールドにするかどうかを指定します。
     *              Specifies whether the text is boldface.
     *
     * @member {boolean}
     * @default null
     * @public
     */
    public bold: boolean | null;

    /**
     * @description テキストの色を示します。
     *              Indicates the color of the text.
     *
     * @member {number}
     * @default null
     * @public
     */
    public color: number | null;

    /**
     * @description このテキストフォーマットでのテキストフォント名を示すストリングです。
     *              The name of the font for text in this text format, as a string.
     *
     * @member {string}
     * @default null
     * @public
     */
    public font: string | null;

    /**
     * @description このテキストフォーマットのテキストをイタリックにするかどうかを示します。
     *              Indicates whether text in this text format is italicized.
     *
     * @member {boolean}
     * @default null
     * @public
     */
    public italic: boolean | null;

    /**
     * @description 行間の垂直の行送りを示す整数です。
     *              An integer representing the amount
     *              of vertical space (called leading) between lines.
     *
     * @member {number}
     * @default null
     * @public
     */
    public leading: number | null;

    /**
     * @description 段落の左インデントをピクセル単位で示します。
     *              The left margin of the paragraph, in pixels.
     *
     * @member {number}
     * @default null
     * @public
     */
    public leftMargin: number | null;

    /**
     * @description すべての文字の間に均等に配分されるスペースの量を表す数値です。
     *              A object representing the amount
     *              of space that is uniformly distributed between all characters.
     *
     * @member {number}
     * @default null
     * @public
     */
    public letterSpacing: number | null;

    /**
     * @description 段落の右インデントをピクセル単位で示します。
     *              The right margin of the paragraph, in pixels.
     *
     * @member {number}
     * @default null
     * @public
     */
    public rightMargin: number | null;

    /**
     * @description このテキストフォーマットのテキストのサイズ（ピクセル単位）です。
     *              The size in pixels of text in this text format.
     *
     * @member {number}
     * @default null
     * @public
     */
    public size: number | null;

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
    public underline: boolean | null;
    
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
        align: ITextFormatAlign | null = null,
        left_margin: number | null = null,
        right_margin: number | null = null,
        leading: number | null = null,
        letter_Spacing: number | null = null
    ) {
        this.font          = font;
        this.size          = size;
        this.color         = color;
        this.bold          = bold;
        this.italic        = italic;
        this.underline     = underline;
        this.align         = align;
        this.leftMargin    = left_margin;
        this.rightMargin   = right_margin;
        this.leading       = leading;
        this.letterSpacing = letter_Spacing;
    }

    /**
     * @description この TextFormat オブジェクトのコピーを作成して返します。
     *             Creates a copy of the TextFormat object and returns it.
     * 
     * @return {next2d.text.TextFormat}
     * @method
     * @public
     */
    clone (): TextFormat
    {
        return new TextFormat(
            this.font, this.size, this.color, this.bold,
            this.italic, this.underline, this.align,
            this.leftMargin, this.rightMargin, this.leading, this.letterSpacing
        );
    }
}