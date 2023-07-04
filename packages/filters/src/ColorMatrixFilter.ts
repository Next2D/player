import { BitmapFilter } from "./BitmapFilter";
import type { AttachmentImpl } from "./interface/AttachmentImpl";
import type { BoundsImpl } from "./interface/BoundsImpl";
import type {
    CanvasToWebGLContext,
    FrameBufferManager
} from "@next2d/webgl";
import {
    $Array,
    $getArray
} from "@next2d/share";

/**
 * ColorMatrixFilter クラスを使用すると、表示オブジェクトにぼかし効果を適用できます。
 * ぼかし効果は、イメージの細部をぼかします。ソフトフォーカスがかかっているように見えるぼかしから、
 * 半透明ガラスを通してイメージを見るようにかすんで見えるガウスぼかしまで作成できます。
 * このフィルターの quality プロパティを低く設定すると、ソフトフォーカスがかかっているように見えるぼかしになります。
 * quality プロパティを高く設定すると、ガウスぼかしフィルターに似たものになります。
 *
 * The ColorMatrixFilter class lets you apply a blur visual effect to display objects.
 * A blur effect softens the details of an image.
 * You can produce blurs that range from a softly unfocused look to a Gaussian blur,
 * a hazy appearance like viewing an image through semi-opaque glass.
 * When the quality property of this filter is set to low, the result is a softly unfocused look.
 * When the quality property is set to high, it approximates a Gaussian blur filter.
 *
 * @class
 * @memberOf next2d.filters
 * @extends  BitmapFilter
 */
export class ColorMatrixFilter extends BitmapFilter
{
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

        /**
         * @type {array}
         * @default {array}
         * @private
         */
        this._$matrix = [
            1, 0, 0, 0, 0,
            0, 1, 0, 0, 0,
            0, 0, 1, 0, 0,
            0, 0, 0, 1, 0
        ];

        // setup
        this.matrix = matrix;
    }

    /**
     * @description 指定されたクラスのストリングを返します。
     *              Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default [class ColorMatrixFilter]
     * @method
     * @static
     */
    static toString (): string
    {
        return "[class ColorMatrixFilter]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return  {string}
     * @default next2d.filters.ColorMatrixFilter
     * @const
     * @static
     */
    static get namespace (): string
    {
        return "next2d.filters.ColorMatrixFilter";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return  {string}
     * @default [object ColorMatrixFilter]
     * @method
     * @public
     */
    toString (): string
    {
        return "[object ColorMatrixFilter]";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @return  {string}
     * @default next2d.filters.ColorMatrixFilter
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
    set matrix (matrix: number[] | null)
    {
        if (!matrix || !$Array.isArray(matrix) || matrix.length !== 20) {
            return ;
        }

        for (let idx: number = 0; idx < 20; ++idx) {

            if (matrix[idx] === this._$matrix[idx]) {
                continue;
            }

            this._$doChanged();
            break;
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
     * @return {array}
     * @method
     * @public
     */
    _$toArray (): any[]
    {
        return $getArray(2,
            this._$matrix
        );
    }

    /**
     * @param  {object} bounds
     * @return {object}
     * @method
     * @private
     */
    _$generateFilterRect (bounds: BoundsImpl): BoundsImpl
    {
        return bounds;
    }

    /**
     * @return {boolean}
     * @method
     * @private
     */
    _$canApply (): boolean
    {
        return true;
    }

    /**
     * @param  {CanvasToWebGLContext} context
     * @return {WebGLTexture}
     * @method
     * @private
     */
    _$applyFilter (context: CanvasToWebGLContext)
    {
        this._$updated = false;

        const manager: FrameBufferManager = context.frameBuffer;

        const currentAttachment: AttachmentImpl | null = manager.currentAttachment;

        // reset
        context.setTransform(1, 0, 0, 1, 0, 0);

        const texture: WebGLTexture = manager
            .getTextureFromCurrentAttachment();

        const width: number  = texture.width;
        const height: number = texture.height;

        // new buffer
        const targetTextureAttachment: AttachmentImpl = manager
            .createTextureAttachment(width, height);

        context._$bind(targetTextureAttachment);

        // apply
        context.reset();
        context._$applyColorMatrixFilter(texture, this._$matrix);

        // reset
        manager.releaseAttachment(currentAttachment, true);

        return manager.getTextureFromCurrentAttachment();

    }
}
