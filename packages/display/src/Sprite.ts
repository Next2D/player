import type { ISprite } from "./interface/ISprite";
import type { Rectangle } from "@next2d/geom";
import { DisplayObjectContainer } from "./DisplayObjectContainer";
import { SoundTransform } from "@next2d/media";
import { execute as spriteStartDragService } from "./Sprite/service/SpriteStartDragService";
import { execute as spriteStopDragService } from "./Sprite/service/SpriteStopDragService";

/**
 * @description Sprite クラスは、表示リストの基本的要素です。
 *              グラフィックを表示でき、子を持つこともできる表示リストノードです。
 *
 *              The Sprite class is a basic display list building block:
 *              a display list node that can display graphics and can also contain children.
 *
 * @class
 * @memberOf next2d.display
 * @extends  DisplayObjectContainer
 */
export class Sprite extends DisplayObjectContainer
{
    /**
     * @description このスプライトのボタンモードを指定します。
     *              Specifies the button mode of this sprite.
     *
     * @member  {boolean}
     * @default false
     * @public
     */
    public buttonMode: boolean;

    /**
     * @description buttonMode プロパティが true に設定されたスプライト上にポインターが移動したときに、
     *              指差しハンドポインター（ハンドカーソル）を表示するかどうかを示すブール値です。
     *              A Boolean value that indicates whether the pointing hand (hand cursor)
     *              appears when the pointer rolls over a sprite
     *              in which the buttonMode property is set to true.
     *
     * @member  {boolean}
     * @default true
     * @public
     */
    public useHandCursor: boolean;

    /**
     * @description Spriteの機能を所持しているかを返却
     *              Returns whether Sprite functions are possessed.
     *
     * @type {boolean}
     * @readonly
     * @public
     */
    public readonly isSprite: boolean;

    /**
     * @type {Sprite|null}
     * @private
     */
    private _$hitArea: ISprite<any> | null;

    /**
     * @type {SoundTransform|null}
     * @private
     */
    private _$soundTransform: SoundTransform | null;

    /**
     * @description ドラッグ時のオフセットX
     *              Offset X during drag
     *
     * @type {number}
     * @public
     */
    public $offsetX: number = 0;

    /**
     * @description ドラッグ時のオフセットY
     *              Offset Y during drag
     *
     * @type {number}
     * @public
     */
    public $offsetY: number = 0;

    /**
     * @description 中心をロックするかどうか
     *              Whether to lock the center
     *
     * @type {boolean}
     * @public
     */
    public $lockCenter: boolean = false;

    /**
     * @description バウンドされた矩形
     *              Bounded rectangle
     *
     * @type {Rectangle|null}
     * @public
     */
    public $boundedRect: Rectangle | null = null;

    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super();

        // public
        this.isSprite      = true;
        this.buttonMode    = false;
        this.useHandCursor = true;

        // drag rules
        this.$offsetX      = 0;
        this.$offsetY      = 0;
        this.$lockCenter   = false;
        this.$boundedRect  = null;

        // private
        this._$hitArea        = null;
        this._$soundTransform = null;
    }

    /**
     * @description スプライトのヒット領域となる別のスプライトを指定します。
     *              Designates another sprite to serve as the hit area for a sprite.
     *
     * @member {ISprite|null}
     * @public
     */
    get hitArea (): ISprite<any> | null
    {
        return this._$hitArea;
    }
    // set hitArea (hit_area: SpriteImpl<any> | null)
    // {
    //     // reset
    //     if (this._$hitArea) {
    //         this._$hitArea._$hitObject = null;
    //     }

    //     this._$hitArea = hit_area;
    //     if (hit_area) {
    //         hit_area._$hitObject = this;
    //     }
    // }

    /**
     * @description このスプライト内のサウンドを制御します。
     *              Controls sound within this sprite.
     *
     * @member  {SoundTransform}
     * @public
     */
    get soundTransform (): SoundTransform
    {
        if (!this._$soundTransform) {
            this._$soundTransform = new SoundTransform();
        }
        return this._$soundTransform;
    }
    set soundTransform (sound_transform: SoundTransform | null)
    {
        this._$soundTransform = sound_transform;
    }

    /**
     * @description 指定されたスプライトをユーザーがドラッグできるようにします。
     *              Lets the user drag the specified sprite.
     *
     * @param  {boolean}   [lock_center=false]
     * @param  {Rectangle} [bounds=null]
     * @return {void}
     * @method
     * @public
     */
    startDrag (
        lock_center: boolean = false,
        bounds: Rectangle | null = null
    ): void {
        spriteStartDragService(this, lock_center, bounds);
    }

    /**
     * @description startDrag() メソッドを終了します。
     *              Ends the startDrag() method.
     *
     * @return void
     * @method
     * @public
     */
    stopDrag ()
    {
        spriteStopDragService(this);
    }
}