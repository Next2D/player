import { DisplayObject } from "./DisplayObject";

/**
 * @description InteractiveObject クラスは、マウス、キーボードまたは他のユーザー入力デバイスを使用して
 *              ユーザーが操作できるすべての表示オブジェクトの抽象基本クラスです。
 *
 *              The InteractiveObject class is the abstract base class for all display objects
 *              with which the user can interact, using the mouse, keyboard, or other user input device.
 *
 * @class
 * @memberOf next2d.display
 * @extends  DisplayObject
 */
export class InteractiveObject extends DisplayObject
{
    /**
     * @description このオブジェクトでマウスまたはその他のユーザー入力メッセージを受け取るかどうかを指定します。
     *              Specifies whether this object receives mouse, or other user input, messages.
     *
     * @member  {boolean}
     * @default true
     * @public
     */
    public mouseEnabled: boolean;

    /**
     * @description InteractiveObject の機能を所持しているかを返却
     *              Returns whether InteractiveObject functions are possessed.
     *
     * @type {boolean}
     * @readonly
     * @public
     */
    public readonly isInteractive: boolean;

    /**
     * @constructor
     * @public
     */
    constructor()
    {
        super();

        this.isInteractive = true;
        this.mouseEnabled  = true;
    }
}