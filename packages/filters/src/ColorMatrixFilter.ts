import { BitmapFilter } from "./BitmapFilter";

/**
 * @description ColorMatrixFilter クラスを使用すると、表示オブジェクトにぼかし効果を適用できます。
 *              ぼかし効果は、イメージの細部をぼかします。ソフトフォーカスがかかっているように見えるぼかしから、
 *              半透明ガラスを通してイメージを見るようにかすんで見えるガウスぼかしまで作成できます。
 *              このフィルターの quality プロパティを低く設定すると、ソフトフォーカスがかかっているように見えるぼかしになります。
 *              quality プロパティを高く設定すると、ガウスぼかしフィルターに似たものになります。
 *
 *              The ColorMatrixFilter class lets you apply a blur visual effect to display objects.
 *              A blur effect softens the details of an image.
 *              You can produce blurs that range from a softly unfocused look to a Gaussian blur,
 *              a hazy appearance like viewing an image through semi-opaque glass.
 *              When the quality property of this filter is set to low, the result is a softly unfocused look.
 *              When the quality property is set to high, it approximates a Gaussian blur filter.
 *
 * @class
 * @memberOf next2d.filters
 * @extends  BitmapFilter
 */
export class ColorMatrixFilter extends BitmapFilter
{
    /**
     * @type {array}
     * @private
     */
    private _$matrix: number[];

    /**
     * @param {array} [matrix=null]
     *
     * @constructor
     * @public
     */
    constructor (matrix: number[] | null = null)
    {
        super();

        // default
        this._$matrix = [
            1, 0, 0, 0, 0,
            0, 1, 0, 0, 0,
            0, 0, 1, 0, 0,
            0, 0, 0, 1, 0
        ];

        // setup
        if (matrix && matrix.length === 20) {
            this.matrix = matrix;
        }
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return {string}
     * @const
     * @static
     */
    static get namespace (): string
    {
        return "next2d.filters.ColorMatrixFilter";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @return {string}
     * @const
     * @public
     */
    get namespace (): string
    {
        return "next2d.filters.ColorMatrixFilter";
    }

    /**
     * @description 4×5 カラー変換用の20個のアイテムの配列
     *              An array of 20 items for 4x5 color transform.
     *
     * @member  {array}
     * @default null
     * @public
     */
    get matrix (): number[]
    {
        return this._$matrix;
    }
    set matrix (matrix: number[])
    {
        if (this._$matrix === matrix) {
            return ;
        }

        if (!Array.isArray(matrix) || matrix.length !== 20) {
            return ;
        }

        for (let idx = 0; idx < 20; idx++) {
            if (matrix[idx] === this._$matrix[idx]) {
                continue;
            }

            this.$updated = true;
            break;
        }

        if (!this.$updated) {
            return ;
        }

        this._$matrix = matrix;
    }

    /**
     * @description オブジェクトのコピーを返します。
     *              Returns a copy of this filter object.
     *
     * @return {ColorMatrixFilter}
     * @method
     * @public
     */
    clone (): ColorMatrixFilter
    {
        return new ColorMatrixFilter(this._$matrix);
    }

    /**
     * @description 設定されたフィルターの値を配列で返します。
     *              Returns the value of the specified filter as an array.
     *
     * @return {array}
     * @method
     * @public
     */
    toArray (): Array<number | number[]>
    {
        return [2, this._$matrix];
    }
}