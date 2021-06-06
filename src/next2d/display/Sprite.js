/**
 * @class
 * @memberOf next2d.display
 * @extends  DisplayObjectContainer
 */
class Sprite extends DisplayObjectContainer
{
    /**
     * Sprite クラスは、表示リストの基本的要素です。
     * グラフィックを表示でき、子を持つこともできる表示リストノードです。
     *
     * The Sprite class is a basic display list building block:
     * a display list node that can display graphics and can also contain children.
     *
     * @constructor
     * @public
     */
    constructor()
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

        /**
         * @type {Graphics|null}
         * @default null
         * @private
         */
        this._$graphics = null;
    }

    /**
     * @description 指定されたクラスのストリングを返します。
     *              Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default [class Sprite]
     * @method
     * @static
     */
    static toString()
    {
        return "[class Sprite]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return  {string}
     * @default next2d.display.Sprite
     * @const
     * @static
     */
    static get namespace ()
    {
        return "next2d.display.Sprite";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return  {string}
     * @default [object Sprite]
     * @method
     * @public
     */
    toString ()
    {
        return "[object Sprite]";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @return  {string}
     * @default next2d.display.Sprite
     * @const
     * @static
     */
    get namespace ()
    {
        return "next2d.display.Sprite";
    }

    /**
     * @description このスプライトのボタンモードを指定します。
     *              Specifies the button mode of this sprite.
     *
     * @member  {string}
     * @default false
     * @public
     */
    get buttonMode ()
    {
        return this._$buttonMode;
    }
    set buttonMode (button_mode)
    {
        this._$buttonMode = button_mode;
    }

    /**
     * @description スプライトのドラッグ先またはスプライトがドロップされた先の表示オブジェクトを指定します。
     *              Specifies the display object over which the sprite is being dragged,
     *              or on which the sprite was dropped.
     *
     * @member  {DisplayObject|null}
     * @readonly
     * @public
     */
    get dropTarget ()
    {
        return Util.$dropTarget;
    }

    /**
     * @description ベクターの描画コマンドが発生するこのスプライトに属する Graphics オブジェクトを指定します。
     *              Specifies the Graphics object that belongs to this sprite
     *              where vector drawing commands can occur.
     *
     * @member  {Graphics}
     * @readonly
     * @public
     */
    get graphics ()
    {
        if (!this._$graphics) {
            this._$graphics = new Graphics();
            this._$graphics
                ._$displayObject = this;
        }
        return this._$graphics;
    }

    /**
     * @description スプライトのヒット領域となる別のスプライトを指定します。
     *              Designates another sprite to serve as the hit area for a sprite.
     *
     * @member {Sprite|null}
     * @public
     */
    get hitArea ()
    {
        return this._$hitArea;
    }
    set hitArea (hit_area)
    {
        // reset
        if (this._$hitArea) {
            this._$hitArea._$hitObject = null;
        }

        this._$hitArea = null;
        if (hit_area instanceof Sprite) {
            this._$hitArea = hit_area;
            hit_area._$hitObject = this;
        }
    }

    /**
     * @description このスプライト内のサウンドを制御します。
     *              Controls sound within this sprite.
     *
     * @member  {SoundTransform}
     * @public
     */
    get soundTransform ()
    {
        if (!this._$soundTransform) {
            this._$soundTransform = new SoundTransform()
        }
        return this._$soundTransform;
    }
    set soundTransform (sound_transform)
    {
        if (sound_transform instanceof SoundTransform) {
            this._$soundTransform = sound_transform;
        }
    }

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
    get useHandCursor ()
    {
        return this._$useHandCursor;
    }
    set useHandCursor (use_hand_cursor)
    {
        this._$useHandCursor = use_hand_cursor;
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
    startDrag (lock_center = false, bounds = null)
    {
        let x = 0;
        let y = 0;

        if (!lock_center) {
            const point = this._$dragMousePoint();
            x = this.x - point.x;
            y = this.y - point.y;
        }

        Util.$dropTarget           = this;
        Util.$dragRules.lock       = lock_center;
        Util.$dragRules.position.x = x;
        Util.$dragRules.position.y = y;
        Util.$dragRules.bounds     = bounds;
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
        // reset
        Util.$dropTarget           = null;
        Util.$dragRules.lock       = false;
        Util.$dragRules.position.x = 0;
        Util.$dragRules.position.y = 0;
        Util.$dragRules.bounds     = null;
    }


    /**
     * @param  {object} tag
     * @param  {DisplayObjectContainer} parent
     * @return {object}
     * @method
     * @private
     */
    _$build (tag, parent)
    {
        const character = super._$build(tag, parent);

        this._$controller   = character.controller;
        this._$dictionary   = character.dictionary;
        this._$placeMap     = character.placeMap;
        this._$placeObjects = character.placeObjects;

        return character;
    }

    /**
     * @return {Point}
     * @method
     * @private
     */
    _$dragMousePoint ()
    {
        return (this._$parent)
            ? this._$parent.globalToLocal(Util.$currentMousePoint())
            : this.globalToLocal(Util.$currentMousePoint());
    }
}