import { DisplayObjectContainer } from "./DisplayObjectContainer";
import { SoundTransform } from "@next2d/media";
import type {
    Rectangle,
    Point
} from "@next2d/geom";

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
    protected _$buttonMode: boolean;
    protected _$hitArea: SpriteImpl<any> | null;
    protected _$soundTransform: SoundTransform | null;
    protected _$useHandCursor: boolean;

    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super();

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$buttonMode = false;

        /**
         * @type {Sprite|null}
         * @default null
         * @private
         */
        this._$hitArea = null;

        /**
         * @type {SoundTransform}
         * @default null
         * @private
         */
        this._$soundTransform = null;

        /**
         * @type {boolean}
         * @default true
         * @private
         */
        this._$useHandCursor = true;
    }

    /**
     * @description 指定されたクラスのストリングを返します。
     *              Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default "[class Sprite]"
     * @method
     * @static
     */
    static toString (): string
    {
        return "[class Sprite]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return  {string}
     * @default "next2d.display.Sprite"
     * @const
     * @static
     */
    static get namespace (): string
    {
        return "next2d.display.Sprite";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return  {string}
     * @default "[object Sprite]"
     * @method
     * @public
     */
    toString (): string
    {
        return "[object Sprite]";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @return  {string}
     * @default "next2d.display.Sprite"
     * @const
     * @public
     */
    get namespace (): string
    {
        return "next2d.display.Sprite";
    }

    /**
     * @description このスプライトのボタンモードを指定します。
     *              Specifies the button mode of this sprite.
     *
     * @member  {boolean}
     * @default false
     * @public
     */
    get buttonMode (): boolean
    {
        return this._$buttonMode;
    }
    set buttonMode (button_mode: boolean)
    {
        this._$buttonMode = !!button_mode;
    }

    // /**
    //  * @description スプライトのドラッグ先またはスプライトがドロップされた先の表示オブジェクトを指定します。
    //  *              Specifies the display object over which the sprite is being dragged,
    //  *              or on which the sprite was dropped.
    //  *
    //  * @member  {DisplayObject|null}
    //  * @readonly
    //  * @public
    //  */
    // get dropTarget (): DropTargetImpl
    // {
    //     return $dropTarget;
    // }

    // /**
    //  * @description スプライトのヒット領域となる別のスプライトを指定します。
    //  *              Designates another sprite to serve as the hit area for a sprite.
    //  *
    //  * @member {Sprite|null}
    //  * @public
    //  */
    // get hitArea (): SpriteImpl<any> | null
    // {
    //     return this._$hitArea;
    // }
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

    // /**
    //  * @description このスプライト内のサウンドを制御します。
    //  *              Controls sound within this sprite.
    //  *
    //  * @member  {SoundTransform}
    //  * @public
    //  */
    // get soundTransform (): SoundTransform
    // {
    //     if (!this._$soundTransform) {
    //         this._$soundTransform = new SoundTransform();
    //     }
    //     return this._$soundTransform;
    // }
    // set soundTransform (sound_transform: SoundTransform | null)
    // {
    //     this._$soundTransform = sound_transform;
    // }

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
    get useHandCursor (): boolean
    {
        return this._$useHandCursor;
    }
    set useHandCursor (use_hand_cursor: boolean)
    {
        this._$useHandCursor = use_hand_cursor;
    }

    // /**
    //  * @description 指定されたスプライトをユーザーがドラッグできるようにします。
    //  *              Lets the user drag the specified sprite.
    //  *
    //  * @param  {boolean}   [lock_center=false]
    //  * @param  {Rectangle} [bounds=null]
    //  * @return {void}
    //  * @method
    //  * @public
    //  */
    // startDrag (
    //     lock_center: boolean = false,
    //     bounds: Rectangle | null = null
    // ): void {

    //     let x: number = 0;
    //     let y: number = 0;

    //     if (!lock_center) {
    //         const point: Point = this._$dragMousePoint();
    //         x = this.x - point.x;
    //         y = this.y - point.y;
    //     }

    //     $setDropTarget(this);
    //     $dragRules.lock       = lock_center;
    //     $dragRules.position.x = x;
    //     $dragRules.position.y = y;
    //     $dragRules.bounds     = bounds;
    // }

    // /**
    //  * @description startDrag() メソッドを終了します。
    //  *              Ends the startDrag() method.
    //  *
    //  * @return void
    //  * @method
    //  * @public
    //  */
    // stopDrag ()
    // {
    //     // reset
    //     $setDropTarget(null);
    //     $dragRules.lock       = false;
    //     $dragRules.position.x = 0;
    //     $dragRules.position.y = 0;
    //     $dragRules.bounds     = null;
    // }

    // /**
    //  * @param  {object} character
    //  * @return {void}
    //  * @method
    //  * @private
    //  */
    // _$sync (character: MovieClipCharacterImpl): void
    // {
    //     if ($rendererWorker && this._$stage) {
    //         this._$createWorkerInstance();
    //     }

    //     this._$controller   = character.controller;
    //     this._$dictionary   = character.dictionary;
    //     this._$placeMap     = character.placeMap;
    //     this._$placeObjects = character.placeObjects;
    // }

    // /**
    //  * @param  {object} tag
    //  * @param  {DisplayObjectContainer} parent
    //  * @return {object}
    //  * @method
    //  * @private
    //  */
    // _$build (
    //     tag: DictionaryTagImpl,
    //     parent: ParentImpl<any>
    // ): MovieClipCharacterImpl {

    //     const character: MovieClipCharacterImpl = this
    //         ._$baseBuild<MovieClipCharacterImpl>(tag, parent);

    //     if ($rendererWorker && this._$stage) {
    //         this._$createWorkerInstance();
    //     }

    //     this._$controller   = character.controller;
    //     this._$dictionary   = character.dictionary;
    //     this._$placeMap     = character.placeMap;
    //     this._$placeObjects = character.placeObjects;

    //     return character;
    // }

    // /**
    //  * @return {Point}
    //  * @method
    //  * @private
    //  */
    // _$dragMousePoint (): Point
    // {
    //     return this._$parent
    //         ? this._$parent.globalToLocal($currentMousePoint())
    //         : this.globalToLocal($currentMousePoint());
    // }
}
