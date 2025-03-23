/**
 * @description ブレンドモードの視覚効果のために定数値を提供するクラスです。
 *              全てのDisplayObjectに設定が可能です。
 *              A class that provides constant values for visual blend mode effects.
 *              It can be set for all DisplayObjects.
 *
 * @class
 * @memberOf next2d.display
 */
export class BlendMode
{
    /**
     * @description 表示オブジェクトの要素カラーの値を背景色に加算し、その際に上限 0xFF を適用します。
     *              Adds the values of the constituent colors of the display object
     *              to the colors of its background, applying a ceiling of 0xFF.
     *
     * @return  {string}
     * @default add
     * @const
     * @static
     */
    static get ADD (): string
    {
        return "add";
    }

    /**
     * @description 表示オブジェクトの各ピクセルのアルファ値を背景に適用します。
     *              Applies the alpha value of each pixel of the display object to the background.
     *
     * @return  {string}
     * @default alpha
     * @const
     * @static
     */
    static get ALPHA (): string
    {
        return "alpha";
    }

    /**
     * @description 表示オブジェクトの要素カラーと背景色のうち暗い方（値が小さい方）の色を選択します。
     *              Selects the darker of the constituent colors of the display object
     *              and the colors of the background (the colors with the smaller values).
     *
     * @return  {string}
     * @default darken
     * @const
     * @static
     */
    static get DARKEN (): string
    {
        return "darken";
    }

    /**
     * @description 表示オブジェクトの要素カラーと背景色を比較し、2 つの要素カラーのうち明るい方の値から暗い方の値を差し引きます。
     *              Compares the constituent colors of the display object with the colors of its background,
     *              and subtracts the darker of the values of the two constituent colors from the lighter value.
     *
     * @return  {string}
     * @default difference
     * @const
     * @static
     */
    static get DIFFERENCE (): string
    {
        return "difference";
    }

    /**
     * @description 表示オブジェクトのアルファ値に基づいて背景を消去します。
     *              Erases the background based on the alpha value of the display object.
     *
     * @return  {string}
     * @default erase
     * @const
     * @static
     */
    static get ERASE (): string
    {
        return "erase";
    }

    /**
     * @description 表示オブジェクトの暗さに基づいて、各ピクセルの色を調整します。
     *              Adjusts the color of each pixel based on the darkness of the display object.
     *
     * @return  {string}
     * @default hardlight
     * @const
     * @static
     */
    static get HARDLIGHT (): string
    {
        return "hardlight";
    }

    /**
     * @description 背景を反転します。
     *              Inverts the background.
     *
     * @return  {string}
     * @default invert
     * @const
     * @static
     */
    static get INVERT (): string
    {
        return "invert";
    }

    /**
     * @description 表示オブジェクトに関する透明度グループを強制的に作成します。
     *              Forces the creation of a transparency group for the display object.
     *
     * @return  {string}
     * @default layer
     * @const
     * @static
     */
    static get LAYER (): string
    {
        return "layer";
    }

    /**
     * @description 表示オブジェクトの要素カラーと背景色のうち明るい方（値が大きい方）の色を選択します。
     *              Selects the lighter of the constituent colors of the display object
     *              and the colors of the background (the colors with the larger values).
     *
     * @return  {string}
     * @default lighten
     * @const
     * @static
     */
    static get LIGHTEN (): string
    {
        return "lighten";
    }

    /**
     * @description 表示オブジェクトの要素カラーの値と背景色の要素カラーの値を乗算した後、0xFF で割って正規化し、色を暗くします。
     *              Multiplies the values of the display object constituent colors by the constituent colors
     *              of the background color, and normalizes by dividing by 0xFF, resulting in darker colors.
     *
     * @return  {string}
     * @default multiply
     * @const
     * @static
     */
    static get MULTIPLY (): string
    {
        return "multiply";
    }

    /**
     * @description 表示オブジェクトは、背景の前に表示されます。
     *              The display object appears in front of the background.
     *
     * @return  {string}
     * @default normal
     * @const
     * @static
     */
    static get NORMAL (): string
    {
        return "normal";
    }

    /**
     * @description 背景の暗さに基づいて、各ピクセルの色を調整します。
     *              Adjusts the color of each pixel based on the darkness of the background.
     *
     * @return  {string}
     * @default overlay
     * @const
     * @static
     */
    static get OVERLAY (): string
    {
        return "overlay";
    }

    /**
     * @description 表示オブジェクトの色の補数（逆）と背景色の補数を乗算して、ブリーチ効果を得ます。
     *              Multiplies the complement (inverse) of the display object color by the complement
     *              of the background color, resulting in a bleaching effect.
     *
     * @return  {string}
     * @default screen
     * @const
     * @static
     */
    static get SCREEN (): string
    {
        return "screen";
    }

    /**
     * @description 結果の下限を 0 として、表示オブジェクトの要素カラーの値をその背景色の値から減算します。
     *              Subtracts the values of the constituent colors in the display object
     *              from the values of the background color, applying a floor of 0.
     *
     * @return  {string}
     * @default subtract
     * @const
     * @static
     */
    static get SUBTRACT (): string
    {
        return "subtract";
    }
}