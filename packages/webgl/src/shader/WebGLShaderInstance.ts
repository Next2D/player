/**
 * @class
 */
export class WebGLShaderInstance
{
    private readonly _$rect: number[];
    private readonly _$size: number[];
    private readonly _$offset: number[];
    private readonly _$matrix: number[];
    private readonly _$mulColor: number[];
    private readonly _$addColor: number[];
    private _$count: number;

    /**
     * @param {WebGL2RenderingContext} gl
     * @constructor
     * @public
     */
    constructor ()
    {
        /**
         * @type {array}
         * @private
         */
        this._$rect = [];

        /**
         * @type {array}
         * @private
         */
        this._$size = [];

        /**
         * @type {array}
         * @private
         */
        this._$offset = [];

        /**
         * @type {array}
         * @private
         */
        this._$matrix = [];

        /**
         * @type {array}
         * @private
         */
        this._$mulColor = [];

        /**
         * @type {array}
         * @private
         */
        this._$addColor = [];

        /**
         * @type {number}
         * @private
         */
        this._$count = 0;
    }

    /**
     * @member {array}
     * @readonly
     * @public
     */
    get size (): number[]
    {
        return this._$size;
    }

    /**
     * @member {array}
     * @readonly
     * @public
     */
    get offset (): number[]
    {
        return this._$offset;
    }

    /**
     * @member {array}
     * @readonly
     * @public
     */
    get rect (): number[]
    {
        return this._$rect;
    }

    /**
     * @member {array}
     * @readonly
     * @public
     */
    get matrix (): number[]
    {
        return this._$matrix;
    }

    /**
     * @member {array}
     * @readonly
     * @public
     */
    get mulColor (): number[]
    {
        return this._$mulColor;
    }

    /**
     * @member {array}
     * @readonly
     * @public
     */
    get addColor (): number[]
    {
        return this._$addColor;
    }

    /**
     * @member {number}
     * @public
     */
    get count (): number
    {
        return this._$count;
    }
    set count (count: number)
    {
        this._$count = count;
    }

    /**
     * @method
     * @public
     */
    clear (): void
    {
        this._$rect.length     = 0;
        this._$size.length     = 0;
        this._$offset.length   = 0;
        this._$matrix.length   = 0;
        this._$mulColor.length = 0;
        this._$addColor.length = 0;
        this._$count           = 0;
    }

}