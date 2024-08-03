import { Event } from "./Event";

/**
 * @description IOErrorEvent オブジェクトは、エラーが発生して入力操作または出力操作が失敗したときに送出されます。
 *              An IOErrorEvent object is dispatched when an error causes input or output operations to fail.
 *
 * @class
 * @memberOf next2d.events
 * @extends  Event
 */
export class IOErrorEvent extends Event
{
    private readonly _$text: string;

    /**
     * @param {string}  type
     * @param {boolean} [bubbles=true]
     * @param {string}  [text=""]
     *
     * @constructor
     * @public
     */
    constructor (
        type: string,
        bubbles: boolean = false,
        text: string = ""
    ) {

        super(type, bubbles);

        /**
         * @type {string}
         * @default ""
         * @private
         */
        this._$text = `${text}`;
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @member {string}
     * @const
     * @static
     */
    static get namespace (): string
    {
        return "next2d.events.IOErrorEvent";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @member {string}
     * @const
     * @public
     */
    get namespace (): string
    {
        return "next2d.events.IOErrorEvent";
    }

    /**
     * @description ioError イベントオブジェクトの type プロパティ値を定義します。
     *              Defines the value of the type property of an ioError event object.
     *
     * @return {string}
     * @const
     * @static
     */
    static get IO_ERROR (): string
    {
        return "ioError";
    }

    /**
     * @description エラーテキストです。
     *              error text.
     *
     * @return {string}
     * @default ""
     * @readonly
     * @public
     */
    get text (): string
    {
        return this._$text;
    }
}