/**
 * @class
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
     * @constructor
     */
    constructor(
        red_multiplier = 1, green_multiplier = 1, blue_multiplier = 1, alpha_multiplier = 1,
        red_offset = 0, green_offset = 0, blue_offset = 0, alpha_offset = 0
    ) {
        this._$colorTransform = new Float64Array([
            red_multiplier, green_multiplier, blue_multiplier, alpha_multiplier,
            red_offset, green_offset, blue_offset, alpha_offset
        ]);
    }

    /**
     * @description 指定されたクラスのストリングを返します。
     *              Returns the string representation of the specified class.
     *
     * @return {string}
     * @static
     */
    static toString()
    {
        return "[class ColorTransform]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return {string}
     * @const
     */
    static get namespace ()
    {
        return "next2d.geom:ColorTransform";
    }

    /**
     * @description アルファ透明度チャンネル値に乗算する 10 進数値です。
     *              A decimal value that is multiplied with the alpha transparency channel value.
     *
     * @return {number} alphaMultiplier
     * @public
     */
    get alphaMultiplier ()
    {
        return this._$colorTransform[3];
    }

    /**
     * @description アルファ透明度チャンネル値に乗算する 10 進数値です。
     *              A decimal value that is multiplied with the alpha transparency channel value.
     *
     * @param  {number} alpha_multiplier
     * @return {void}
     * @public
     */
    set alphaMultiplier (alpha_multiplier)
    {
        this._$colorTransform[3] = Util.$clamp(0, 1, alpha_multiplier, 0);
    }

    /**
     * @description アルファ透明度チャンネル値に alphaMultiplier 値を乗算した後に加算する数値です。
     *              数値の範囲は -255 ～ 255 です。
     *              A number from -255 to 255 that is added to the alpha transparency channel value after
     *              it has been multiplied by the alphaMultiplier value.
     *
     * @return {number} alphaOffset
     * @public
     */
    get alphaOffset ()
    {
        return this._$colorTransform[7];
    }

    /**
     * @description アルファ透明度チャンネル値に alphaMultiplier 値を乗算した後に加算する数値です。
     *              数値の範囲は -255 ～ 255 です。
     *              A number from -255 to 255 that is added to the alpha transparency channel value after
     *              it has been multiplied by the alphaMultiplier value.
     *
     * @param  {number} alpha_offset
     * @return {void}
     * @public
     */
    set alphaOffset (alpha_offset)
    {
        this._$colorTransform[7] = Util.$clamp(-255, 255, alpha_offset|0);
    }

    /**
     * @description 青チャンネル値に乗算する 10 進数値です。
     *              A decimal value that is multiplied with the blue channel value.
     *
     * @return {number} blueMultiplier
     * @public
     */
    get blueMultiplier ()
    {
        return this._$colorTransform[2];
    }

    /**
     * @description 青チャンネル値に乗算する 10 進数値です。
     *              A decimal value that is multiplied with the blue channel value.
     *
     * @param  {number} blue_multiplier
     * @return {void}
     * @public
     */
    set blueMultiplier (blue_multiplier)
    {
        this._$colorTransform[2] = Util.$clamp(0, 1, blue_multiplier, 0);
    }

    /**
     * @description 青チャンネル値に blueMultiplier 値を乗算した後に加算する数値です。
     *              数値の範囲は -255 ～ 255 です。
     *              A number from -255 to 255 that is added to the blue channel value after
     *              it has been multiplied by the blueMultiplier value.
     *
     * @return {number} blueOffset
     * @public
     */
    get blueOffset ()
    {
        return this._$colorTransform[6];
    }

    /**
     * @description 青チャンネル値に blueMultiplier 値を乗算した後に加算する数値です。
     *              数値の範囲は -255 ～ 255 です。
     *              A number from -255 to 255 that is added to the blue channel value after
     *              it has been multiplied by the blueMultiplier value.
     *
     * @param  {number} blue_offset
     * @return {void}
     * @public
     */
    set blueOffset (blue_offset)
    {
        this._$colorTransform[6] = Util.$clamp(-255, 255, blue_offset|0);
    }

    /**
     * @description 緑チャンネル値に乗算する 10 進数値です。
     *              A decimal value that is multiplied with the green channel value.
     *
     * @return {number} greenMultiplier
     * @public
     */
    get greenMultiplier ()
    {
        return this._$colorTransform[1];
    }

    /**
     * @description 緑チャンネル値に乗算する 10 進数値です。
     *              A decimal value that is multiplied with the green channel value.
     *
     * @param  {number} green_multiplier
     * @return {void}
     * @public
     */
    set greenMultiplier (green_multiplier)
    {
        this._$colorTransform[1] = Util.$clamp(0, 1, green_multiplier, 0);
    }

    /**
     * @description 緑チャンネル値に greenMultiplier 値を乗算した後に加算する数値です。
     *              数値の範囲は -255 ～ 255 です。
     *              A number from -255 to 255 that is added to the green channel value after
     *              it has been multiplied by the greenMultiplier value.
     *
     * @return {number} greenOffset
     * @public
     */
    get greenOffset ()
    {
        return this._$colorTransform[5];
    }

    /**
     * @description 緑チャンネル値に greenMultiplier 値を乗算した後に加算する数値です。
     *              数値の範囲は -255 ～ 255 です。
     *              A number from -255 to 255 that is added to the green channel value after
     *              it has been multiplied by the greenMultiplier value.
     *
     * @param  {number} green_offset
     * @return {void}
     * @public
     */
    set greenOffset (green_offset)
    {
        this._$colorTransform[5] = Util.$clamp(-255, 255, green_offset|0);
    }

    /**
     * @description 赤チャンネル値に乗算する 10 進数値です。
     *              A decimal value that is multiplied with the red channel value.
     *
     * @return {number} redMultiplier
     * @public
     */
    get redMultiplier ()
    {
        return this._$colorTransform[0];
    }

    /**
     * @description 赤チャンネル値に乗算する 10 進数値です。
     *              A decimal value that is multiplied with the red channel value.
     *
     * @param  {number} red_multiplier
     * @return {void}
     * @public
     */
    set redMultiplier (red_multiplier)
    {
        this._$colorTransform[0] = Util.$clamp(0, 1, red_multiplier, 0);
    }

    /**
     * @description 赤チャンネル値に redMultiplier 値を乗算した後に加算する数値です。
     *              数値の範囲は -255 ～ 255 です。
     *              A number from -255 to 255 that is added to the red channel value after
     *              it has been multiplied by the redMultiplier value.
     *
     * @return {number} redOffset
     * @public
     */
    get redOffset ()
    {
        return this._$colorTransform[4];
    }

    /**
     * @description 赤チャンネル値に redMultiplier 値を乗算した後に加算する数値です。
     *              数値の範囲は -255 ～ 255 です。
     *              A number from -255 to 255 that is added to the red channel value after
     *              it has been multiplied by the redMultiplier value.
     *
     * @param  {number} red_offset
     * @return {void}
     * @public
     */
    set redOffset (red_offset)
    {
        this._$colorTransform[4] = Util.$clamp(-255, 255, red_offset|0);
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return {string}
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
     * @return {string}
     * @const
     */
    get namespace ()
    {
        return "next2d.geom:ColorTransform";
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
     * @param   {ColorTransform} second - ColorTransformオブジェクト
     * @returns void
     * @public
     */
    concat (second)
    {
        const multiColor = Util.$multiplicationColor(
            this._$colorTransform,
            second._$colorTransform
        );

        // pool
        Util.$poolColorArray(this._$colorTransform);

        // update
        this._$colorTransform = multiColor;
    }

    /**
     * @return {ColorTransform}
     * @private
     */
    _$clone ()
    {
        const clone = new ColorTransform();

        clone._$colorTransform = Util.$getColorArray(
            this._$colorTransform[0], this._$colorTransform[1],
            this._$colorTransform[2], this._$colorTransform[3],
            this._$colorTransform[4], this._$colorTransform[5],
            this._$colorTransform[6], this._$colorTransform[7]
        );

        return clone;
    }
}