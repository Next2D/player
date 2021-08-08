/**
 * ColorTransform クラスを使用すると、表示オブジェクトのカラー値を調整することができます。
 * カラー調整、つまり "カラー変換" は、赤、緑、青、アルファ透明度の 4 つのチャンネルすべてに適用できます。
 * <ul>
 *     <li>新しい red 値 = (古い red 値 * redMultiplier ) + redOffset</li>
 *     <li>新しい green 値 = (古い green 値 * greenMultiplier ) + greenOffset</li>
 *     <li>新しい blue 値 = (古い blue 値 * blueMultiplier ) + blueOffset</li>
 *     <li>新しい alpha 値 = (古い alpha 値 * alphaMultiplier ) + alphaOffset</li>
 * </ul>
 * 算出後、カラーチャンネル値が 255 よりも大きい場合は 255 に設定されます。
 * 0 より小さい場合は 0 に設定されます。
 *
 * The ColorTransform class lets you adjust the color values in a display object.
 * The color adjustment or color transformation can be applied
 * to all four channels: red, green, blue, and alpha transparency.
 * <ul>
 *     <li>New red value = (old red value * redMultiplier) + redOffset</li>
 *     <li>New green value = (old green value * greenMultiplier) + greenOffset</li>
 *     <li>New blue value = (old blue value * blueMultiplier) + blueOffset</li>
 *     <li>New alpha value = (old alpha value * alphaMultiplier) + alphaOffset</li>
 * </ul>
 * If any of the color channel values is greater than 255 after the calculation,
 * it is set to 255. If it is less than 0, it is set to 0.
 *
 * @class
 * @memberOf next2d.geom
 */
class ColorTransform
{
    /**
     * @param {number} [red_multiplier=1]
     * @param {number} [green_multiplier=1]
     * @param {number} [blue_multiplier=1]
     * @param {number} [alpha_multiplier=1]
     * @param {number} [red_offset=0]
     * @param {number} [green_offset=0]
     * @param {number} [blue_offset=0]
     * @param {number} [alpha_offset=0]
     *
     * @example <caption>Example usage of ColorTransform.</caption>
     * // new ColorTransform
     * const {ColorTransform} = next2d.geom;
     * const colorTransform   = new ColorTransform();
     * // set new ColorTransform
     * const {MovieClip} = next2d.display;
     * const movieClip   = new MovieClip();
     * movieClip.transform.colorTransform = colorTransform;
     *
     * @constructor
     * @public
     */
    constructor(
        red_multiplier = 1, green_multiplier = 1, blue_multiplier = 1, alpha_multiplier = 1,
        red_offset = 0, green_offset = 0, blue_offset = 0, alpha_offset = 0
    ) {
        /**
         * @type {Float32Array}
         * @private
         */
        this._$colorTransform = Util.$getFloat32Array8(
            red_multiplier, green_multiplier, blue_multiplier, alpha_multiplier,
            red_offset, green_offset, blue_offset, alpha_offset
        );
    }

    /**
     * 指定されたクラスのストリングを返します。
     * Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default [class ColorTransform]
     * @method
     * @static
     */
    static toString ()
    {
        return "[class ColorTransform]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @member {string}
     * @default next2d.geom.ColorTransform
     * @const
     * @static
     */
    static get namespace ()
    {
        return "next2d.geom.ColorTransform";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return {string}
     * @method
     * @public
     */
    toString ()
    {
        return "(redMultiplier=" + this._$colorTransform[0] + ", " +
            "greenMultiplier="   + this._$colorTransform[1] + ", " +
            "blueMultiplier="    + this._$colorTransform[2] + ", " +
            "alphaMultiplier="   + this._$colorTransform[3] + ", " +
            "redOffset="         + this._$colorTransform[4] + ", " +
            "greenOffset="       + this._$colorTransform[5] + ", " +
            "blueOffset="        + this._$colorTransform[6] + ", " +
            "alphaOffset="       + this._$colorTransform[7] + ")";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @member  {string}
     * @default next2d.geom.ColorTransform
     * @public
     * @const
     */
    get namespace ()
    {
        return "next2d.geom.ColorTransform";
    }

    /**
     * @description アルファ透明度チャンネル値に乗算する 10 進数値です。
     *              A decimal value that is multiplied with the alpha transparency channel value.
     *
     * @member {number}
     * @default 1
     * @public
     */
    get alphaMultiplier ()
    {
        return this._$colorTransform[3];
    }
    set alphaMultiplier (alpha_multiplier)
    {
        this._$colorTransform[3] = Util.$clamp(alpha_multiplier, 0, 1, 0);
    }

    /**
     * @description アルファ透明度チャンネル値に alphaMultiplier 値を乗算した後に加算する数値です。
     *              数値の範囲は -255 ～ 255 です。
     *              A number from -255 to 255 that is added to the alpha transparency channel value after
     *              it has been multiplied by the alphaMultiplier value.
     *
     * @member {number}
     * @default 0
     * @public
     */
    get alphaOffset ()
    {
        return this._$colorTransform[7];
    }
    set alphaOffset (alpha_offset)
    {
        this._$colorTransform[7] = Util.$clamp(alpha_offset | 0, -255, 255);
    }

    /**
     * @description 青チャンネル値に乗算する 10 進数値です。
     *              A decimal value that is multiplied with the blue channel value.
     *
     * @member {number}
     * @default 1
     * @public
     */
    get blueMultiplier ()
    {
        return this._$colorTransform[2];
    }
    set blueMultiplier (blue_multiplier)
    {
        this._$colorTransform[2] = Util.$clamp(blue_multiplier, 0, 1, 0);
    }

    /**
     * @description 青チャンネル値に blueMultiplier 値を乗算した後に加算する数値です。
     *              数値の範囲は -255 ～ 255 です。
     *              A number from -255 to 255 that is added to the blue channel value after
     *              it has been multiplied by the blueMultiplier value.
     *
     * @member {number}
     * @default 0
     * @public
     */
    get blueOffset ()
    {
        return this._$colorTransform[6];
    }
    set blueOffset (blue_offset)
    {
        this._$colorTransform[6] = Util.$clamp(blue_offset | 0, -255, 255);
    }

    /**
     * @description 緑チャンネル値に乗算する 10 進数値です。
     *              A decimal value that is multiplied with the green channel value.
     *
     * @member {number}
     * @default 1
     * @public
     */
    get greenMultiplier ()
    {
        return this._$colorTransform[1];
    }
    set greenMultiplier (green_multiplier)
    {
        this._$colorTransform[1] = Util.$clamp(green_multiplier, 0, 1, 0);
    }

    /**
     * @description 緑チャンネル値に greenMultiplier 値を乗算した後に加算する数値です。
     *              数値の範囲は -255 ～ 255 です。
     *              A number from -255 to 255 that is added to the green channel value after
     *              it has been multiplied by the greenMultiplier value.
     *
     * @member {number}
     * @default 0
     * @public
     */
    get greenOffset ()
    {
        return this._$colorTransform[5];
    }
    set greenOffset (green_offset)
    {
        this._$colorTransform[5] = Util.$clamp(green_offset | 0, -255, 255);
    }

    /**
     * @description 赤チャンネル値に乗算する 10 進数値です。
     *              A decimal value that is multiplied with the red channel value.
     *
     * @member {number}
     * @default 1
     * @public
     */
    get redMultiplier ()
    {
        return this._$colorTransform[0];
    }
    set redMultiplier (red_multiplier)
    {
        this._$colorTransform[0] = Util.$clamp(red_multiplier, 0, 1, 0);
    }

    /**
     * @description 赤チャンネル値に redMultiplier 値を乗算した後に加算する数値です。
     *              数値の範囲は -255 ～ 255 です。
     *              A number from -255 to 255 that is added to the red channel value after
     *              it has been multiplied by the redMultiplier value.
     *
     * @member {number}
     * @default 0
     * @public
     */
    get redOffset ()
    {
        return this._$colorTransform[4];
    }
    set redOffset (red_offset)
    {
        this._$colorTransform[4] = Util.$clamp(red_offset | 0, -255, 255);
    }

    /**
     * @description 2 番目のパラメーターで指定された ColorTransform オブジェクトと
     *              現在の ColorTransform オブジェクトを連結し
     *              2 つのカラー変換を加算的に組み合わせた結果を現在のオブジェクトに設定します。
     *              Concatenates the ColorTransform object specified
     *              by the second parameter with the current ColorTransform object
     *              and sets the current object as the result,
     *              which is an additive combination of the two color transformations.
     *
     * @param  {ColorTransform} second - ColorTransformオブジェクト
     * @return {void}
     * @method
     * @public
     */
    concat (second)
    {
        const multiColor = Util.$multiplicationColor(
            this._$colorTransform,
            second._$colorTransform
        );

        // update
        this._$colorTransform[0] = multiColor[0];
        this._$colorTransform[1] = multiColor[1];
        this._$colorTransform[2] = multiColor[2];
        this._$colorTransform[3] = multiColor[3];
        this._$colorTransform[4] = multiColor[4];
        this._$colorTransform[5] = multiColor[5];
        this._$colorTransform[6] = multiColor[6];
        this._$colorTransform[7] = multiColor[7];

        Util.$poolFloat32Array8(multiColor);
    }

    /**
     * @return {ColorTransform}
     * @method
     * @private
     */
    _$clone ()
    {
        return Util.$getColorTransform(
            this._$colorTransform[0], this._$colorTransform[1],
            this._$colorTransform[2], this._$colorTransform[3],
            this._$colorTransform[4], this._$colorTransform[5],
            this._$colorTransform[6], this._$colorTransform[7]
        );
    }
}