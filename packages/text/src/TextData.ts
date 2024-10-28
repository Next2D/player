import type { ITextObject } from "./interface/ITextObject";

/**
 * @description テキストの文字毎のデータ
 *              Data for each character of text
 * @class
 * @public
 */
export class TextData
{
    private _$textWidth: number;
    private _$textHeight: number;

    /**
     * @description テキストの行ごとの高さ
     *              Height of each line of text
     * 
     * @type {array}
     * @public
     */
    public readonly heightTable: number[];

    /**
     * @description テキストの行ごとのベースラインから上方線までの距離
     *              Distance from the baseline to the top line of each line of text
     *
     * @type {array}
     * @public
     */
    public readonly ascentTable: number[];

    /**
     * @description テキストの行ごとの幅
     *              Width of each line of text
     *
     * @type {array}
     * @public
     */
    public readonly widthTable: number[];

    /**
     * @description テキストの行ごとのテキストオブジェクト
     *              Text object for each line of text
     *
     * @type {array}
     * @public
     */
    public readonly textTable: ITextObject[];

    /**
     * @description テキストの行ごとのテキストオブジェクト
     *              Text object for each line of text
     *
     * @type {array}
     * @public
     */
    public readonly lineTable: ITextObject[];

    /**
     * @class
     * @public
     */
    constructor ()
    {
        /**
         * @type {number}
         * @private
         */
        this._$textWidth = -1;

        /**
         * @type {number}
         * @private
         */
        this._$textHeight = -1;

        this.widthTable  = [];
        this.heightTable = [];
        this.ascentTable = [];
        this.textTable   = [];
        this.lineTable   = [];
    }

    /**
     * @description テキストエリアの幅
     *              Width of text area
     *
     * @member {number}
     * @readonly
     * @public
     */
    get textWidth (): number
    {
        if (this._$textWidth !== -1) {
            return this._$textWidth;
        }

        this._$textWidth = 0;
        for (let idx = 0; idx < this.widthTable.length; ++idx) {
            this._$textWidth = Math.max(this._$textWidth, this.widthTable[idx]);
        }
        return this._$textWidth;
    }

    /**
     * @description テキストエリアの高さ
     *              Height of text area
     * 
     * @member {number}
     * @readonly
     * @public
     */
    get textHeight (): number
    {
        if (this._$textHeight !== -1) {
            return this._$textHeight;
        }

        this._$textHeight = 0;
        for (let idx = 0; idx < this.heightTable.length; ++idx) {
            this._$textHeight += this.heightTable[idx];
        }
        return this._$textHeight;
    }

    /**
     * @description 指定した行のテキストの幅
    *               Width of text for the specified line
    * 
     * @param  {number} line_index
     * @return {number}
     * @method
     * @public
     */
    getLineWidth (line_index: number): number
    {
        return line_index in this.widthTable ? this.widthTable[line_index] : 0;
    }

    /**
     * @description 指定した行のテキストの高さ
     *              Height of text for the specified line
     * 
     * @param  {number} line_index
     * @return {number}
     * @method
     * @public
     */
    getLineHeight (line_index: number): number
    {
        return line_index in this.heightTable ? this.heightTable[line_index] : 0;
    }

    /**
     * @description 設定を初期化
     *              Initialize settings
     * 
     * @return {void}
     * @method
     * @public
     */
    clear (): void 
    {
        this._$textWidth  = -1;
        this._$textHeight = -1;
        this.widthTable.length  = 0;
        this.heightTable.length = 0;
        this.ascentTable.length = 0;
        this.textTable.length   = 0;
        this.lineTable.length   = 0;
    }
}