import { execute as colorTransformConcatService } from "../src/ColorTransform/service/ColorTransformConcatService";
import {
    $getFloat32Array8,
    $poolFloat32Array8,
    $clamp
} from "./GeomUtil";

/**
 * @description ColorTransform クラスを使用すると、表示オブジェクトのカラー値を調整することができます。
 *              カラー調整、つまり "カラー変換" は、赤、緑、青、アルファ透明度の 4 つのチャンネルすべてに適用できます。
 *              <ul>
 *                  <li>新しい red 値 = (古い red 値 * redMultiplier ) + redOffset</li>
 *                  <li>新しい green 値 = (古い green 値 * greenMultiplier ) + greenOffset</li>
 *                  <li>新しい blue 値 = (古い blue 値 * blueMultiplier ) + blueOffset</li>
 *                  <li>新しい alpha 値 = (古い alpha 値 * alphaMultiplier ) + alphaOffset</li>
 *              </ul>
 *              算出後、カラーチャンネル値が 255 よりも大きい場合は 255 に設定されます。
 *              0 より小さい場合は 0 に設定されます。
 *
 *              The ColorTransform class lets you adjust the color values in a display object.
 *              The color adjustment or color transformation can be applied
 *              to all four channels: red, green, blue, and alpha transparency.
 *              <ul>
 *                  <li>New red value = (old red value * redMultiplier) + redOffset</li>
 *                  <li>New green value = (old green value * greenMultiplier) + greenOffset</li>
 *                  <li>New blue value = (old blue value * blueMultiplier) + blueOffset</li>
 *               <li>New alpha value = (old alpha value * alphaMultiplier) + alphaOffset</li>
 *              </ul>
 *              If any of the color channel values is greater than 255 after the calculation,
 *              it is set to 255. If it is less than 0, it is set to 0.
 *
 * @class
 * @memberOf next2d.geom
 */
export class ColorTransform
{
    /**
     * @type {Float32Array}
     * @private
     */
    public readonly _$colorTransform: Float32Array;

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
     * @constructor
     * @public
     */
    constructor (
        red_multiplier: number = 1, green_multiplier: number = 1,
        blue_multiplier: number = 1, alpha_multiplier: number = 1,
        red_offset: number = 0, green_offset: number = 0,
        blue_offset: number = 0, alpha_offset: number = 0
    ) {
        this._$colorTransform = $getFloat32Array8(
            red_multiplier, green_multiplier, blue_multiplier, alpha_multiplier,
            red_offset, green_offset, blue_offset, alpha_offset
        );
    }

    /**
     * @description ColorTransform の内部Float32Arrayデータを返却
     *              Returns the internal Float32Array data of ColorTransform
     *
     * @member {Float32Array}
     * @readonly
     * @public
     */
    get rawData (): Float32Array
    {
        return this._$colorTransform;
    }

    /**
     * @description アルファ透明度チャンネル値に乗算する 10 進数値です。
     *              A decimal value that is multiplied with the alpha transparency channel value.
     *
     * @member {number}
     * @default 1
     * @public
     */
    get alphaMultiplier (): number
    {
        return this._$colorTransform[3];
    }
    set alphaMultiplier (alpha_multiplier: number)
    {
        this._$colorTransform[3] = $clamp(alpha_multiplier, 0, 1, 1);
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
    get alphaOffset (): number
    {
        return this._$colorTransform[7];
    }
    set alphaOffset (alpha_offset: number)
    {
        this._$colorTransform[7] = $clamp(alpha_offset, -255, 255, 0);
    }

    /**
     * @description 青チャンネル値に乗算する 10 進数値です。
     *              A decimal value that is multiplied with the blue channel value.
     *
     * @member {number}
     * @default 1
     * @public
     */
    get blueMultiplier (): number
    {
        return this._$colorTransform[2];
    }
    set blueMultiplier (blue_multiplier: number)
    {
        this._$colorTransform[2] = $clamp(blue_multiplier, 0, 1, 1);
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
    get blueOffset (): number
    {
        return this._$colorTransform[6];
    }
    set blueOffset (blue_offset: number)
    {
        this._$colorTransform[6] = $clamp(blue_offset, -255, 255, 0);
    }

    /**
     * @description 緑チャンネル値に乗算する 10 進数値です。
     *              A decimal value that is multiplied with the green channel value.
     *
     * @member {number}
     * @default 1
     * @public
     */
    get greenMultiplier (): number
    {
        return this._$colorTransform[1];
    }
    set greenMultiplier (green_multiplier: number)
    {
        this._$colorTransform[1] = $clamp(green_multiplier, 0, 1, 1);
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
    get greenOffset (): number
    {
        return this._$colorTransform[5];
    }
    set greenOffset (green_offset: number)
    {
        this._$colorTransform[5] = $clamp(green_offset, -255, 255, 0);
    }

    /**
     * @description 赤チャンネル値に乗算する 10 進数値です。
     *              A decimal value that is multiplied with the red channel value.
     *
     * @member {number}
     * @default 1
     * @public
     */
    get redMultiplier (): number
    {
        return this._$colorTransform[0];
    }
    set redMultiplier (red_multiplier: number)
    {
        this._$colorTransform[0] = $clamp(red_multiplier, 0, 1, 1);
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
    get redOffset (): number
    {
        return this._$colorTransform[4];
    }
    set redOffset (red_offset: number)
    {
        this._$colorTransform[4] = $clamp(red_offset, -255, 255, 0);
    }

    /**
     * @description オブジェクトの複製を返します。
     *              Returns a copy of this ColorTransform object.
     *
     * @return {ColorTransform}
     * @method
     * @public
     */
    clone (): ColorTransform
    {
        return new ColorTransform(...this._$colorTransform);
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
     * @param  {ColorTransform} color_transform
     * @return {void}
     * @method
     * @public
     */
    concat (color_transform: ColorTransform): void
    {
        colorTransformConcatService(this, color_transform);
    }

    /**
     * @description 指定された配列の値を乗算します
     *              Multiplies the value of the specified array.
     *
     * @param  {Float32Array} a
     * @param  {Float32Array} b
     * @return {Float32Array}
     * @method
     * @private
     */
    static multiply (a: Float32Array, b: Float32Array): Float32Array
    {
        return $getFloat32Array8(
            a[0] * b[0],
            a[1] * b[1],
            a[2] * b[2],
            a[3] * b[3],
            a[0] * b[4] + a[4],
            a[1] * b[5] + a[5],
            a[2] * b[6] + a[6],
            a[3] * b[7] + a[7]
        );
    }

    /**
     * @description 利用したFloat32Arrayを再利用する為にプールします。
     *              Pool the Float32Array used for reuse.
     *
     * @param {Float32Array} buffer
     * @method
     * @private
     */
    static release (buffer: Float32Array): void
    {
        $poolFloat32Array8(buffer);
    }
}
