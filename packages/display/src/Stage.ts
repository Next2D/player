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
     * @param  {DisplayObject} child
     * @return {DisplayObject}
     * @method
     * @protected
     */
    _$addChild (child: DisplayObjectImpl<any>): DisplayObjectImpl<any>
    {
        child._$stage  = this;
        child._$root   = child;

        return super._$addChild(child);
    }
}

export const $stage = new Stage();