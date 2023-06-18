import { DisplayObject } from "./DisplayObject";

/**
 * InteractiveObject クラスは、マウス、キーボードまたは他のユーザー入力デバイスを使用して
 * ユーザーが操作できるすべての表示オブジェクトの抽象基本クラスです。
 *
 * The InteractiveObject class is the abstract base class for all display objects
 * with which the user can interact, using the mouse, keyboard, or other user input device.
 *
 * @class
 * @memberOf next2d.display
 * @extends  DisplayObject
 */
export class InteractiveObject extends DisplayObject
{
    protected _$mouseEnabled: boolean;

    /**
     * @constructor
     * @public
     */
    constructor()
    {
        super();

        /**
         * @type {boolean}
         * @default true
         * @private
         */
        this._$mouseEnabled = true;
    }

    /**
     * @description このオブジェクトでマウスまたはその他のユーザー入力メッセージを
     *              受け取るかどうかを指定します。
     *              Specifies whether this object receives mouse,
     *              or other user input, messages.
     *
     * @member  {boolean}
     * @default true
     * @public
     */
    get mouseEnabled (): boolean
    {
        return this._$mouseEnabled;
    }
    set mouseEnabled (mouse_enabled: boolean)
    {
        this._$mouseEnabled = !!mouse_enabled;
    }
}
