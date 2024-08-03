import { Event } from "./Event";

/**
 * @description ProgressEvent オブジェクトは、ロード処理が開始されたとき、またはソケットがデータを受信したときに送出されます。
 *              これらのイベントは通常、JSON ファイル、イメージまたはデータがアプリケーションにロードされるときに生成されます。
 *              A ProgressEvent object is dispatched when a load operation has begun or a socket has received data.
 *              These events are usually generated when JSON files, images or data are loaded into an application.
 *
 * @class
 * @memberOf next2d.events
 * @extends  Event
 */
export class ProgressEvent extends Event
{
    private readonly _$bytesLoaded: number;
    private readonly _$bytesTotal: number;

    /**
     * @param {string}  type
     * @param {boolean} [bubbles=true]
     * @param {number}  [bytes_loaded=0]
     * @param {number}  [bytes_total=0]
     *
     * @constructor
     * @public
     */
    constructor (
        type: string, bubbles: boolean = false,
        bytes_loaded: number = 0, bytes_total: number = 0
    ) {

        super(type, bubbles);

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$bytesLoaded = bytes_loaded | 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$bytesTotal  = bytes_total | 0;
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
        return "next2d.events.ProgressEvent";
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
        return "next2d.events.ProgressEvent";
    }

    /**
     * @description progress イベントオブジェクトの type プロパティ値を定義します。
     *              Defines the value of the type property of a progress event object.
     *
     * @return {string}
     * @const
     * @static
     */
    static get PROGRESS (): string
    {
        return "progress";
    }

    /**
     * @description リスナーがイベントを処理しているときに読み込まれたアイテム数またはバイト数です。
     *              The number of items or bytes loaded when the listener processes the event.
     *
     * @return {number}
     * @default 0
     * @readonly
     * @public
     */
    get bytesLoaded (): number
    {
        return this._$bytesLoaded;
    }

    /**
     * @description 読み込みプロセスが成功した場合に読み込まれるアイテムまたはバイトの総数です。
     *              The total number of items or bytes that will be loaded
     *              if the loading process succeeds.
     *
     * @return {number}
     * @default 0
     * @readonly
     * @public
     */
    get bytesTotal (): number
    {
        return this._$bytesTotal;
    }
}