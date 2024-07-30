import { DisplayObjectContainer } from "./DisplayObjectContainer";
import type { DisplayObjectImpl } from "@next2d/interface";

/**
 * @description Stage クラスはメイン描画領域を表します。
 *              The Stage class represents the main drawing area.
 *
 * @class
 * @memberOf next2d.display
 * @extends  DisplayObjectContainer
 */
export class Stage extends DisplayObjectContainer
{
    public _$invalidate: boolean;

    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super();

        /**
         * @type {Stage}
         * @private
         */
        this._$root = this;

        /**
         * @type {Stage}
         * @private
         */
        this._$stage = this;

        /**
         * @type {boolean}
         * @default true
         * @private
         */
        this._$invalidate = true;
    }

    /**
     * @description 指定されたクラスのストリングを返します。
     *              Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default "[class Stage]"
     * @method
     * @static
     */
    static toString (): string
    {
        return "[class Stage]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return  {string}
     * @default "next2d.display.Stage"
     * @const
     * @static
     */
    static get namespace (): string
    {
        return "next2d.display.Stage";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return  {string}
     * @default "[object Stage]"
     * @method
     * @public
     */
    toString (): string
    {
        return "[object Stage]";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @return  {string}
     * @default "next2d.display.Stage"
     * @const
     * @public
     */
    get namespace (): string
    {
        return "next2d.display.Stage";
    }

    /**
     * @description 表示リストをレンダリングする必要のある次の機会に、
     *              表示オブジェクトに警告するようランタイムに通知します。
     *              (例えば、再生ヘッドを新しいフレームに進める場合などです。)
     *              Calling the invalidate() method signals runtimes
     *              to alert display objects on the next opportunity
     *              it has to render the display list.
     *              (for example, when the playhead advances to a new frame)
     *
     * @return {void}
     * @method
     * @public
     */
    invalidate (): void
    {
        this._$invalidate = true;
    }

    /**
     * @param  {DisplayObject} child
     * @return {DisplayObject}
     * @method
     * @private
     */
    _$addChild (child: DisplayObjectImpl<any>): DisplayObjectImpl<any>
    {
        child._$stage  = this;
        child._$root   = child;

        // worker flag updated
        this._$created = true;

        return super._$addChild(child);
    }
}

export const $stage = new Stage();