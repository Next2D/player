import { Event } from "./Event";
import { $getEvent } from "./EventUtil";

/**
 * @description 転送対象のポインターイベント発火中であれば、アクティブなネイティブイベントを返す。
 *              旧実装ではProxyのgetトラップで同じ判定を行っていたが、pointermove毎の
 *              Proxy生成とプロパティアクセス毎のトラップ実行がCPU負荷になるため、
 *              明示的なgetterと本ヘルパーに置き換えた。判定対象のイベント種別は旧実装と同一。
 *              Returns the active native event while a forwardable pointer event
 *              is being dispatched. The former Proxy-based implementation created
 *              a Proxy per pointermove and executed a get trap per property
 *              access, so it was replaced with explicit getters and this helper.
 *              The forwardable event types are identical to the old implementation.
 *
 * @return {PointerEvent | null}
 * @method
 * @private
 */
const $getNativePointerEvent = (): globalThis.PointerEvent | null =>
{
    const event = $getEvent();
    if (!event) {
        return null;
    }

    switch (event.type) {

        case PointerEvent.POINTER_DOWN:
        case PointerEvent.POINTER_MOVE:
        case PointerEvent.POINTER_UP:
        case PointerEvent.POINTER_LEAVE:
        case PointerEvent.POINTER_OVER:
        case PointerEvent.POINTER_OUT:
            return event as globalThis.PointerEvent;

        default:
            return null;

    }
};

/**
 * @description ポインターは、入力機器（マウス、ペン、またはタッチ可能な面の上の接触点など）のハードウェアにとらわれない表現です。
 *              ポインターは、画面などの接触面上の特定の座標（または座標の集合）をターゲットにすることができます。
 *              A pointer is a hardware-agnostic representation of an input device (such as a mouse, pen, or point of contact on a touchable surface).
 *              A pointer can target a specific coordinate (or set of coordinates) on a screen or other contact surface.
 *
 * @class
 * @memberOf next2d.events
 * @extends  Event
 */
export class PointerEvent extends Event
{
    /**
     * @param {string}  type
     * @param {boolean} [bubbles=true]
     *
     * @constructor
     * @public
     */
    constructor (type: string, bubbles: boolean = true)
    {
        super(type, bubbles);
    }

    /**
     * @description ポインターの一意な識別子
     *              Unique identifier of the pointer
     *
     * @return {number | undefined}
     * @readonly
     * @public
     */
    get pointerId (): number | undefined
    {
        return $getNativePointerEvent()?.pointerId;
    }

    /**
     * @description ポインターのデバイス種別(mouse, pen, touch)
     *              Device type of the pointer (mouse, pen, touch)
     *
     * @return {string | undefined}
     * @readonly
     * @public
     */
    get pointerType (): string | undefined
    {
        return $getNativePointerEvent()?.pointerType;
    }

    /**
     * @description ポインターの接触ジオメトリの幅
     *              Width of the contact geometry of the pointer
     *
     * @return {number | undefined}
     * @readonly
     * @public
     */
    get width (): number | undefined
    {
        return $getNativePointerEvent()?.width;
    }

    /**
     * @description ポインターの接触ジオメトリの高さ
     *              Height of the contact geometry of the pointer
     *
     * @return {number | undefined}
     * @readonly
     * @public
     */
    get height (): number | undefined
    {
        return $getNativePointerEvent()?.height;
    }

    /**
     * @description ポインター入力の正規化された圧力(0〜1)
     *              Normalized pressure of the pointer input (0-1)
     *
     * @return {number | undefined}
     * @readonly
     * @public
     */
    get pressure (): number | undefined
    {
        return $getNativePointerEvent()?.pressure;
    }

    /**
     * @description ポインター入力の正規化された接線圧力
     *              Normalized tangential pressure of the pointer input
     *
     * @return {number | undefined}
     * @readonly
     * @public
     */
    get tangentialPressure (): number | undefined
    {
        return $getNativePointerEvent()?.tangentialPressure;
    }

    /**
     * @description Y-Z平面とポインター軸を含む平面の間の角度
     *              Angle between the Y-Z plane and the plane containing the pointer axis
     *
     * @return {number | undefined}
     * @readonly
     * @public
     */
    get tiltX (): number | undefined
    {
        return $getNativePointerEvent()?.tiltX;
    }

    /**
     * @description X-Z平面とポインター軸を含む平面の間の角度
     *              Angle between the X-Z plane and the plane containing the pointer axis
     *
     * @return {number | undefined}
     * @readonly
     * @public
     */
    get tiltY (): number | undefined
    {
        return $getNativePointerEvent()?.tiltY;
    }

    /**
     * @description ポインターの長軸周りの回転角
     *              Rotation of the pointer around its major axis
     *
     * @return {number | undefined}
     * @readonly
     * @public
     */
    get twist (): number | undefined
    {
        return $getNativePointerEvent()?.twist;
    }

    /**
     * @description プライマリポインターかどうか
     *              Whether the pointer is the primary pointer
     *
     * @return {boolean | undefined}
     * @readonly
     * @public
     */
    get isPrimary (): boolean | undefined
    {
        return $getNativePointerEvent()?.isPrimary;
    }

    /**
     * @description クライアント座標X
     *              Client X coordinate
     *
     * @return {number | undefined}
     * @readonly
     * @public
     */
    get clientX (): number | undefined
    {
        return $getNativePointerEvent()?.clientX;
    }

    /**
     * @description クライアント座標Y
     *              Client Y coordinate
     *
     * @return {number | undefined}
     * @readonly
     * @public
     */
    get clientY (): number | undefined
    {
        return $getNativePointerEvent()?.clientY;
    }

    /**
     * @description ページ座標X
     *              Page X coordinate
     *
     * @return {number | undefined}
     * @readonly
     * @public
     */
    get pageX (): number | undefined
    {
        return $getNativePointerEvent()?.pageX;
    }

    /**
     * @description ページ座標Y
     *              Page Y coordinate
     *
     * @return {number | undefined}
     * @readonly
     * @public
     */
    get pageY (): number | undefined
    {
        return $getNativePointerEvent()?.pageY;
    }

    /**
     * @description スクリーン座標X
     *              Screen X coordinate
     *
     * @return {number | undefined}
     * @readonly
     * @public
     */
    get screenX (): number | undefined
    {
        return $getNativePointerEvent()?.screenX;
    }

    /**
     * @description スクリーン座標Y
     *              Screen Y coordinate
     *
     * @return {number | undefined}
     * @readonly
     * @public
     */
    get screenY (): number | undefined
    {
        return $getNativePointerEvent()?.screenY;
    }

    /**
     * @description 要素のパディング辺からの相対座標X
     *              X coordinate relative to the padding edge of the element
     *
     * @return {number | undefined}
     * @readonly
     * @public
     */
    get offsetX (): number | undefined
    {
        return $getNativePointerEvent()?.offsetX;
    }

    /**
     * @description 要素のパディング辺からの相対座標Y
     *              Y coordinate relative to the padding edge of the element
     *
     * @return {number | undefined}
     * @readonly
     * @public
     */
    get offsetY (): number | undefined
    {
        return $getNativePointerEvent()?.offsetY;
    }

    /**
     * @description 直前のイベントからのX方向の移動量
     *              Movement on the X axis since the previous event
     *
     * @return {number | undefined}
     * @readonly
     * @public
     */
    get movementX (): number | undefined
    {
        return $getNativePointerEvent()?.movementX;
    }

    /**
     * @description 直前のイベントからのY方向の移動量
     *              Movement on the Y axis since the previous event
     *
     * @return {number | undefined}
     * @readonly
     * @public
     */
    get movementY (): number | undefined
    {
        return $getNativePointerEvent()?.movementY;
    }

    /**
     * @description クライアント座標X(clientXのエイリアス)
     *              Client X coordinate (alias of clientX)
     *
     * @return {number | undefined}
     * @readonly
     * @public
     */
    get x (): number | undefined
    {
        return $getNativePointerEvent()?.x;
    }

    /**
     * @description クライアント座標Y(clientYのエイリアス)
     *              Client Y coordinate (alias of clientY)
     *
     * @return {number | undefined}
     * @readonly
     * @public
     */
    get y (): number | undefined
    {
        return $getNativePointerEvent()?.y;
    }

    /**
     * @description 押されたボタンの番号
     *              Number of the pressed button
     *
     * @return {number | undefined}
     * @readonly
     * @public
     */
    get button (): number | undefined
    {
        return $getNativePointerEvent()?.button;
    }

    /**
     * @description 押されているボタンのビットフラグ
     *              Bit flags of the buttons being pressed
     *
     * @return {number | undefined}
     * @readonly
     * @public
     */
    get buttons (): number | undefined
    {
        return $getNativePointerEvent()?.buttons;
    }

    /**
     * @description Altキーが押されているかどうか
     *              Whether the Alt key is pressed
     *
     * @return {boolean | undefined}
     * @readonly
     * @public
     */
    get altKey (): boolean | undefined
    {
        return $getNativePointerEvent()?.altKey;
    }

    /**
     * @description Ctrlキーが押されているかどうか
     *              Whether the Ctrl key is pressed
     *
     * @return {boolean | undefined}
     * @readonly
     * @public
     */
    get ctrlKey (): boolean | undefined
    {
        return $getNativePointerEvent()?.ctrlKey;
    }

    /**
     * @description Metaキーが押されているかどうか
     *              Whether the Meta key is pressed
     *
     * @return {boolean | undefined}
     * @readonly
     * @public
     */
    get metaKey (): boolean | undefined
    {
        return $getNativePointerEvent()?.metaKey;
    }

    /**
     * @description Shiftキーが押されているかどうか
     *              Whether the Shift key is pressed
     *
     * @return {boolean | undefined}
     * @readonly
     * @public
     */
    get shiftKey (): boolean | undefined
    {
        return $getNativePointerEvent()?.shiftKey;
    }

    /**
     * @description イベントの詳細情報(クリック回数など)
     *              Detail information of the event (e.g. click count)
     *
     * @return {number | undefined}
     * @readonly
     * @public
     */
    get detail (): number | undefined
    {
        return $getNativePointerEvent()?.detail;
    }

    /**
     * @description イベント発生時のタイムスタンプ
     *              Timestamp when the event occurred
     *
     * @return {number | undefined}
     * @readonly
     * @public
     */
    get timeStamp (): number | undefined
    {
        return $getNativePointerEvent()?.timeStamp;
    }

    /**
     * @description ボタンが連続で押された時に発生します。
     *              Occurs when a button is pressed continuously.
     *
     * @return {string}
     * @const
     * @static
     */
    static get DOUBLE_CLICK (): string
    {
        return "dblclick";
    }

    /**
     * @description ボタンが押されていない状態から 1 つ以上のボタンが押されている状態に遷移したときに発生します
     *              Occurs when one or more buttons are pressed from the state where no buttons are pressed.
     *
     * @return {string}
     * @const
     * @static
     */
    static get POINTER_DOWN (): string
    {
        return "pointerdown";
    }

    /**
     * @description ポインティングデバイスが要素のヒットテスト領域を出た時に発生します
     *              Occurs when the pointing device leaves the hit test area of an element
     *
     * @return {string}
     * @const
     * @static
     */
    static get POINTER_LEAVE (): string
    {
        return "pointerleave";
    }

    /**
     * @description ポインターの座標が変化し、かつタッチ操作によってポインターがキャンセルされていないときに発生します。
     *              Occurs when the pointer coordinates change and the pointer is not canceled by a touch operation.
     *
     * @return {string}
     * @const
     * @static
     */
    static get POINTER_MOVE (): string
    {
        return "pointermove";
    }

    /**
     * @description ヒットテスト境界を出たに発生します。ホバーに対応していない端末では発生しません。
     *              Occurs when the hit test boundary is exited. Does not occur on devices that do not support hover.
     *
     * @return {string}
     * @const
     * @static
     */
    static get POINTER_OUT (): string
    {
        return "pointerout";
    }

    /**
     * @description インティングデバイスが要素のヒットテスト境界内に移動したときに発生します。
     *              Occurs when the pointing device moves into the hit test boundary of an element.
     *
     * @return {string}
     * @const
     * @static
     */
    static get POINTER_OVER (): string
    {
        return "pointerover";
    }

    /**
     * @description ポインターがアクティブではなくなったときに発生します。
     *              Occurs when the pointer is no longer active.
     *
     * @return {string}
     * @const
     * @static
     */
    static get POINTER_UP (): string
    {
        return "pointerup";
    }

    /**
     * @description ポインターのキャンセル時に発生します。
     *              Occurs when the pointer is canceled.
     *
     * @return {string}
     * @const
     * @static
     */
    static get POINTER_CANCEL (): string
    {
        return "pointercancel";
    }
}