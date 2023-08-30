import type { TextObjectImpl } from "./interface/TextObjectImpl";

/**
 * @class
 */
export class TextData
{
    private _$textWidth: number;
    private _$textHeight: number;
    private readonly _$heightTable: number[];
    private readonly _$ascentTable: number[];
    private readonly _$widthTable: number[];
    private readonly _$textTable: TextObjectImpl[];
    private readonly _$lineTable: TextObjectImpl[];

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

        /**
         * @type {array}
         * @private
         */
        this._$widthTable = [];

        /**
         * @type {array}
         * @private
         */
        this._$heightTable = [];

        /**
         * @type {array}
         * @private
         */
        this._$ascentTable = [];

        /**
         * @type {array}
         * @private
         */
        this._$textTable = [];

        /**
         * @type {array}
         * @private
         */
        this._$lineTable = [];
    }

    /**
     * @member {number}
     * @readonly
     * @public
     */
    get textWidth (): number
    {
        if (this._$textWidth === -1) {
            this._$textWidth = 0;
            for (let idx: number = 0; idx < this._$widthTable.length; ++idx) {
                this._$textWidth = Math.max(this._$textWidth, this._$widthTable[idx]);
            }
        }
        return this._$textWidth;
    }

    /**
     * @member {number}
     * @readonly
     * @public
     */
    get textHeight (): number
    {
        if (this._$textHeight === -1) {
            this._$textHeight = 0;
            for (let idx: number = 0; idx < this._$heightTable.length; ++idx) {
                this._$textHeight += this._$heightTable[idx];
                if (idx) {
                    this._$textHeight += 1;
                }
            }
        }
        return this._$textHeight;
    }

    /**
     * @param  {number} line_index
     * @return {number}
     * @method
     * @public
     */
    getLineWidth (line_index: number): number
    {
        return line_index in this._$widthTable ? this._$widthTable[line_index] : 0;
    }

    /**
     * @param  {number} line_index
     * @return {number}
     * @method
     * @public
     */
    getLineHeight (line_index: number): number
    {
        return line_index in this._$heightTable ? this._$heightTable[line_index] : 0;
    }

    /**
     * @member {array}
     * @readonly
     * @public
     */
    get widthTable (): number[]
    {
        return this._$widthTable;
    }

    /**
     * @member {array}
     * @readonly
     * @public
     */
    get heightTable (): number[]
    {
        return this._$heightTable;
    }

    /**
     * @member {array}
     * @readonly
     * @public
     */
    get ascentTable (): number[]
    {
        return this._$ascentTable;
    }

    /**
     * @member {array}
     * @readonly
     * @public
     */
    get textTable (): TextObjectImpl[]
    {
        return this._$textTable;
    }

    /**
     * @member {array}
     * @readonly
     * @public
     */
    get lineTable (): TextObjectImpl[]
    {
        return this._$lineTable;
    }
}