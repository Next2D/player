/*!
 * licenses: MIT Licenses.
 * version: 1.0.0
 * author: Toshiyuki Ienaga <ienaga@tvon.jp>
 * copyright: (c) 2021 Toshiyuki Ienaga.
 */
if (!("next2d" in window)) {
    (function(window) {

"use strict";

let instanceId    = 0;
let programId     = 0;

/**
 * @description Global Object
 * @type {object}
 */
const Util = {};

/**
 * @type {number}
 */
Util.$TWIPS = 20;

// matrix array constants
Util.$MATRIX_ARRAY_IDENTITY                    = new Float64Array([1, 0, 0, 1, 0, 0]);
Util.$MATRIX_ARRAY_20_0_0_20_0_0               = new Float64Array([20, 0, 0, 20, 0, 0]);
Util.$MATRIX_ARRAY_20_0_0_20_0_0_INVERSE       = new Float64Array([0.05, 0, 0, 0.05, 0, 0]);
Util.$MATRIX_ARRAY_RATIO_0_0_RATIO_0_0         = new Float64Array([20 / Util.$devicePixelRatio, 0, 0, 20 / Util.$devicePixelRatio, 0, 0]);
Util.$MATRIX_ARRAY_RATIO_0_0_RATIO_0_0_INVERSE = new Float64Array([1 / 20 * Util.$devicePixelRatio, 0, 0, 1 / 20 * Util.$devicePixelRatio, 0, 0]);

// color array constant
Util.$COLOR_ARRAY_IDENTITY = new Float64Array([1, 1, 1, 1, 0, 0, 0, 0]);


// shortcut
Util.$isNaN           = window.isNaN;
Util.$min             = Math.min;
Util.$max             = Math.max;
Util.$sin             = Math.sin;
Util.$cos             = Math.cos;
Util.$tan             = Math.tan;
Util.$sqrt            = Math.sqrt;
Util.$pow             = Math.pow;
Util.$abs             = Math.abs;
Util.$Array           = Math.Array;

// params
Util.$currentPlayerId  = 0;
Util.$isUpdated        = false;
Util.$devicePixelRatio = Util.$min(2, window.devicePixelRatio);
Util.$players          = [];
Util.$colorArray       = [];
Util.$matrixArray      = [];
Util.$bounds           = [];
Util.$arrays           = [];

/**
 * @param  {*} source
 * @return {boolean}
 * @static
 */
Util.$isArray = function (source)
{
    return Util.$Array.isArray(source);
};

/**
 * @return {array}
 * @static
 */
Util.$getArray = function ()
{
    return Util.$arrays.pop() || [];
}

/**
 * @param  {array} array
 * @return {void}
 * @static
 */
Util.$poolArray = function (array)
{
    if (array.length) {
        array.length = 0;
    }
    Util.$arrays.push(array);
}

/**
 * @param  {number} min
 * @param  {number} max
 * @param  {number} value
 * @param  {number} [default_value=null]
 * @return {number}
 * @static
 */
Util.$clamp = function (min, max, value, default_value)
{

    const number = +value;
    if (Util.$isNaN(number) && default_value !== null) {
        return default_value;
    }
    return Util.$min(Util.$max(min, Util.$isNaN(number) ? 0 : number), max);
}

/**
 * @return {Float64Array}
 * @static
 */
Util.$getColorArray = function (
    a = 1, b = 1, c = 1, d = 1,
    e = 0, f = 0, g = 0, h = 0
) {

    const color = Util.$colorArray.pop() || new Float64Array(8);

    color[0] = a;
    color[1] = b;
    color[2] = c;
    color[3] = d;
    color[4] = e;
    color[5] = f;
    color[6] = g;
    color[7] = h;

    return color;
};

/**
 * @param  {Float64Array} array
 * @return {void}
 * @static
 */
Util.$poolColorArray = function (array)
{
    Util.$colorArray.push(array);
}

/**
 * @param   {Float64Array} a
 * @param   {Float64Array} b
 * @returns {Float64Array}
 * @static
 */
Util.$multiplicationColor = function (a, b)
{
    return Util.$getColorArray(
        a[0] * b[0],
        a[1] * b[1],
        a[2] * b[2],
        a[3] * b[3],
        a[0] * b[4] + a[4],
        a[1] * b[5] + a[5],
        a[2] * b[6] + a[6],
        a[3] * b[7] + a[7]
    );
}

/**
 * @param  {number} [a=1]
 * @param  {number} [b=0]
 * @param  {number} [c=0]
 * @param  {number} [d=1]
 * @param  {number} [tx=0]
 * @param  {number} [ty=0]
 * @return {Float64Array}
 * @static
 */
Util.$getMatrixArray = function (a = 1, b = 0, c = 0, d = 1, tx = 0, ty = 0)
{
    const matrix = Util.$matrixArray.pop() || new Float64Array(6);

    matrix[0] = a;
    matrix[1] = b;
    matrix[2] = c;
    matrix[3] = d;
    matrix[4] = tx * Util.$TWIPS;
    matrix[5] = ty * Util.$TWIPS;

    return matrix;
};

/**
 * @return {Float64Array}
 * @static
 */
Util.$poolMatrixArray = function (array)
{
    Util.$matrixArray.push(array);
}

/**
 * @param   {Float64Array} a
 * @param   {Float64Array} b
 * @returns {Float64Array}
 * @static
 */
Util.$multiplicationMatrix = function(a, b)
{
    return Util.$getMatrixArray(
        a[0] * b[0] + a[2] * b[1],
        a[1] * b[0] + a[3] * b[1],
        a[0] * b[2] + a[2] * b[3],
        a[1] * b[2] + a[3] * b[3],
        a[0] * b[4] + a[2] * b[5] + a[4],
        a[1] * b[4] + a[3] * b[5] + a[5]
    );
};

/**
 * @param  {number} x_min
 * @param  {number} x_max
 * @param  {number} y_min
 * @param  {number} y_max
 * @return {object}
 * @static
 */
Util.$getBoundsObject = function (x_min = 0, x_max = 0, y_min = 0, y_max = 0)
{
    const object = Util.$bounds.pop() || { "xMin": 0, "xMax": 0, "yMin": 0, "yMax": 0, };

    object.xMin = x_min;
    object.xMax = x_max;
    object.yMin = y_min;
    object.yMax = y_max;

    return object;
};

/**
 * @return {object}
 * @static
 */
Util.$poolBoundsObject = function (bounds)
{
    Util.$bounds.push(bounds);
};

/**
 * @class
 * @memberOf next2d.events
 */
class Event
{
    /**
     * Event クラスのメソッドは、イベントリスナー関数で使用してイベントオブジェクトの動作に影響を与えることができます。
     * 一部のイベントにはデフォルトの動作が関連付けられています。
     * 例えば、doubleClick イベントには、イベント時にマウスポインター位置の単語がハイライト表示されるというデフォルトの動作が関連付けられています。
     * イベントリスナーで preventDefault() メソッドを呼び出してこの動作をキャンセルできます。
     * また、stopPropagation() メソッドまたは stopImmediatePropagation() メソッドを呼び出すと、
     * 現在のイベントリスナーを、イベントを処理する最後のイベントリスナーにすることができます。
     *
     * The methods of the Event class can be used in event listener functions to affect the behavior of the event object.
     * Some events have an associated default behavior. For example,
     * the doubleClick event has an associated default behavior that highlights the word under the mouse pointer at the time of the event.
     * Your event listener can cancel this behavior by calling the preventDefault() method.
     * You can also make the current event listener the last one to process
     * an event by calling the stopPropagation() or stopImmediatePropagation() method.
     *
     * @param   {string}  type
     * @param   {boolean} [bubbles=false]
     * @param   {boolean} [cancelable=false]
     *
     * @example <caption>Example usage of Event.</caption>
     * // new Event
     * const {Event} = next2d.events;
     * displayObject.dispatchEvent(new Event(Event.ENTER_FRAME));
     *
     * @constructor
     * @public
     */
    constructor (type, bubbles = false, cancelable = false)
    {
        this._$type                     = `${type}`.toLowerCase();
        this._$bubbles                  = bubbles;
        this._$cancelable               = cancelable;

        this._$target                   = null;
        this._$currentTarget            = null;
        this._$eventPhase               = EventPhase.AT_TARGET;

        this._$stopImmediatePropagation = false;
        this._$stopPropagation          = false;
        this._$preventDefault           = false;
    }

    /**
     * 指定されたクラスのストリングを返します。
     * Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default [class Event]
     * @method
     * @static
     */
    static toString()
    {
        return "[class Event]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @member  {string}
     * @default next2d.events:Event
     * @const
     * @static
     */
    static get namespace ()
    {
        return "next2d.events:Event";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return {string}
     * @method
     * @public
     */
    toString ()
    {
        return this.formatToString("Event", "type", "bubbles", "cancelable", "eventPhase");
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @member  {string}
     * @default next2d.events:Event
     * @const
     * @public
     */
    get namespace ()
    {
        return "next2d.events:Event";
    }

    /**
     * @description ACTIVATE 定数は、type プロパティ（activate イベントオブジェクト）の値を定義します。
     *              The ACTIVATE constant defines the value
     *              of the type property of an activate event object.
     *
     * @return  {string}
     * @default activate
     * @const
     * @static
     */
    static get ACTIVATE ()
    {
        return "activate";
    }

    /**
     * @description Event.ADDED 定数は、added イベントオブジェクトの type プロパティの値を定義します。
     *              The Event.ADDED constant defines the value
     *              of the type property of an added event object.
     *
     * @return  {string}
     * @default added
     * @const
     * @static
     */
    static get ADDED ()
    {
        return "added";
    }

    /**
     * @description Event.ADDED_TO_STAGE 定数は、type プロパティ（addedToStage イベントオブジェクト）の値を定義します。
     *              The Event.ADDED_TO_STAGE constant defines the value
     *              of the type property of an addedToStage event object.
     *
     * @return  {string}
     * @default addedToStage
     * @const
     * @static
     */
    static get ADDED_TO_STAGE ()
    {
        return "addedToStage";
    }

    /**
     * @description Event.CHANGE 定数は、type プロパティ（change イベントオブジェクト）の値を定義します。
     *              The Event.CHANGE constant defines the value
     *              of the type property of a change event object.
     *
     * @return  {string}
     * @default change
     * @const
     * @static
     */
    static get CHANGE ()
    {
        return "change";
    }

    /**
     * @description Event.COMPLETE 定数は、complete イベントオブジェクトの type プロパティの値を定義します。
     *              The Event.COMPLETE constant defines the value
     *              of the type property of a complete event object.
     *
     * @return  {string}
     * @default complete
     * @const
     * @static
     */
    static get COMPLETE ()
    {
        return "complete";
    }

    /**
     * @description Event.DEACTIVATE 定数は、deactivate イベントオブジェクトの type プロパティの値を定義します。
     *              The Event.DEACTIVATE constant defines the value
     *              of the type property of a deactivate event object.
     *
     * @return  {string}
     * @default deactivate
     * @const
     * @static
     */
    static get DEACTIVATE ()
    {
        return "deactivate";
    }

    /**
     * @description Event.ENTER_FRAME 定数は、enterFrame イベントオブジェクトの type プロパティの値を定義します。
     *              The Event.ENTER_FRAME constant defines the value
     *              of the type property of an enterFrame event object.
     *
     * @return  {string}
     * @default enterFrame
     * @const
     * @static
     */
    static get ENTER_FRAME ()
    {
        return "enterFrame";
    }

    /**
     * @description Event.EXIT_FRAME 定数は、exitFrame イベントオブジェクトの type プロパティの値を定義します。
     *              The Event.EXIT_FRAME constant defines the value
     *              of the type property of an exitFrame event object.
     *
     * @return  {string}
     * @default exitFrame
     * @const
     * @static
     */
    static get EXIT_FRAME ()
    {
        return "exitFrame";
    }

    /**
     * @description Event.FRAME_CONSTRUCTED 定数は、frameConstructed イベントオブジェクトの type プロパティの値を定義します。
     *              The Event.FRAME_CONSTRUCTED constant defines the value
     *              of the type property of an frameConstructed event object.
     *
     * @return  {string}
     * @default frameConstructed
     * @const
     * @static
     */
    static get FRAME_CONSTRUCTED ()
    {
        return "frameConstructed";
    }

    /**
     * @description Event.INIT 定数は、init イベントオブジェクトの type プロパティの値を定義します。
     *              The Event.INIT constant defines the value
     *              of the type property of an init event object.
     *
     * @return  {string}
     * @default frameConstructed
     * @const
     * @static
     */
    static get INIT ()
    {
        return "init";
    }

    /**
     * @description Event.MOUSE_LEAVE 定数は、mouseLeave イベントオブジェクトの type プロパティの値を定義します。
     *              The Event.MOUSE_LEAVE constant defines the value
     *              of the type property of a mouseLeave event object.
     *
     * @return  {string}
     * @default mouseLeave
     * @const
     * @static
     */
    static get MOUSE_LEAVE ()
    {
        return "mouseLeave";
    }

    /**
     * @description Event.REMOVED 定数は、removed プロパティ（paste イベントオブジェクト）の値を定義します。
     *              The Event.REMOVED constant defines the value
     *              of the type property of a removed event object.
     *
     * @return  {string}
     * @default removed
     * @const
     * @static
     */
    static get REMOVED ()
    {
        return "removed";
    }

    /**
     * @description Event.REMOVED_FROM_STAGE 定数は、removedFromStage イベントオブジェクトの type プロパティの値を定義します。
     *              The Event.REMOVED_FROM_STAGE constant defines the value
     *              of the type property of a removedFromStage event object.
     *
     * @return  {string}
     * @default removedFromStage
     * @const
     * @static
     */
    static get REMOVED_FROM_STAGE ()
    {
        return "removedFromStage";
    }

    /**
     * @description Event.REMOVED 定数は、render イベントオブジェクトの type プロパティの値を定義します。
     *              The Event.REMOVED constant defines the value
     *              of the type property of a render event object.
     *
     * @return  {string}
     * @default render
     * @const
     * @static
     */
    static get RENDER ()
    {
        return "render";
    }

    /**
     * @description Event.SOUND_COMPLETE 定数は、soundComplete イベントオブジェクトの type プロパティの値を定義します。
     *              The Event.SOUND_COMPLETE constant defines the value
     *              of the type property of a soundComplete event object.
     *
     * @return  {string}
     * @default render
     * @const
     * @static
     */
    static get SOUND_COMPLETE ()
    {
        return "soundComplete";
    }


}



/**
 * @returns void
 * @private
 */
Event.prototype._$initialization = function (type, bubbles = false, cancelable = false)
{
    this._$target                   = null;
    this._$currentTarget            = null;
    this._$eventPhase               = EventPhase.AT_TARGET;
    this._$type                     = type + "";
    this._$bubbles                  = Util.$toBoolean(bubbles);
    this._$cancelable               = Util.$toBoolean(cancelable);
    this._$stopImmediatePropagation = false;
    this._$stopPropagation          = false;
    this._$preventDefault           = false;

    // extends
    this._$called = false;
    OriginalObject.call(this);
};

/**
 * properties
 */
Util.$Object.defineProperties(Event.prototype, {
    /**
     * @description イベントがバブリングイベントかどうかを示します。
     *              Indicates whether an event is a bubbling event.
     *
     * @memberof Event#
     * @property {boolean} bubbles
     * @readonly
     * @public
     */
    bubbles: {
        /**
         * @return {boolean}
         */
        get: function () {
            return this._$bubbles;
        }
    },
    /**
     * @description イベントに関連付けられた動作を回避できるかどうかを示します。
     *              Indicates whether the behavior associated
     *              with the event can be prevented.
     *
     * @memberof Event#
     * @property {boolean} cancelable
     * @readonly
     * @public
     */
    cancelable: {
        /**
         * @return {boolean}
         */
        get: function () {
            return this._$cancelable;
        }
    },
    /**
     * @description イベントリスナーで Event オブジェクトをアクティブに処理しているオブジェクトです。
     *              The object that is actively processing the Event object
     *              with an event listener.
     *
     * @memberof Event#
     * @property {object} currentTarget
     * @readonly
     * @public
     */
    currentTarget: {
        /**
         * @return {object}
         */
        get: function () {
            return this._$currentTarget;
        }
    },
    /**
     * @description イベントフローの現在の段階です。
     *              The current phase in the event flow.
     *
     * @memberof Event#
     * @property {uint} eventPhase
     * @readonly
     * @public
     */
    eventPhase: {
        /**
         * @return {uint}
         */
        get: function () {
            return this._$eventPhase;
        }
    },
    /**
     * @description イベントターゲットです。
     *              The event target.
     *
     * @memberof Event#
     * @property {object} target
     * @readonly
     * @public
     */
    target: {
        /**
         * @return {object}
         */
        get: function () {
            return (this._$target) ? this._$target : this._$currentTarget;
        }
    },
    /**
     * @description イベントのタイプです。
     *              The type of event.
     *
     * @memberof Event#
     * @property {string} type
     * @readonly
     * @public
     */
    type: {
        /**
         * @return {string}
         */
        get: function () {
            return this._$type;
        }
    }
});

/**
 * @description Event サブクラスのインスタンスを複製します。
 *              Duplicates an instance of an Event subclass.
 *
 * @return {Event}
 * @public
 */
Event.prototype.clone = function ()
{
    var event = new Event(this.type, this.bubbles, this.cancelable);
    event._$currentTarget = this._$currentTarget;
    return event;
};

/**
 * @description カスタム ActionScript 3.0 Event クラスに
 *              toString() メソッドを実装するためのユーティリティ関数です。
 *              A utility function for implementing the toString() method
 *              in custom ActionScript 3.0 Event classes.
 *
 * @return {string}
 * @public
 */
Event.prototype.formatToString = function ()
{
    let str = "[" + arguments[0];

    const length = arguments.length;
    for (let idx = 1; idx < length; ++idx) {
        str += " " + arguments[idx];

        const value = this[arguments[idx]];
        switch (true) {

            case typeof value === "string":
                str += "=\"" + value + "\"";
                break;

            default:
                str += "=" + value;
                break;

        }
    }
    str += "]";

    return str;
};

/**
 * @description イベントで preventDefault() メソッドが呼び出されたかどうかを確認します。
 *              Checks whether the preventDefault() method has been called on the event.
 *
 * @return {boolean}
 * @public
 */
Event.prototype.isDefaultPrevented = function ()
{
    return (Util.$event) ? Util.$event.defaultPrevented : false;
};

/**
 * TODO
 * @description イベントのデフォルト動作をキャンセルできる場合に、その動作をキャンセルします。
 *              Cancels an event's default behavior if that behavior can be canceled.
 *
 * @return {void}
 * @public
 */
Event.prototype.preventDefault = function ()
{
    this._$preventDefault = true;
};

/**
 * @description イベントフローの現在のノードおよび後続するノードで、
 *              イベントリスナーが処理されないようにします。
 *              Prevents processing of any event listeners in the current node
 *              and any subsequent nodes in the event flow.
 *
 * @return {void}
 * @public
 */
Event.prototype.stopImmediatePropagation = function ()
{
    this._$stopImmediatePropagation = true;
};

/**
 * @description イベントフローの現在のノードに後続するノードで
 *              イベントリスナーが処理されないようにします。
 *              Prevents processing of any event listeners in nodes subsequent
 *              to the current node in the event flow.
 *
 * @return {void}
 * @public
 */
Event.prototype.stopPropagation = function ()
{
    this._$stopPropagation = true;
};

/**
 * @description 指定されたオブジェクトのストリングを返します。
 *              Returns the string representation of the specified object.
 *
 * @returns {string}
 * @public
 */
Event.prototype.toString = function ()
{
    return this.formatToString("Event", "type", "bubbles", "cancelable", "eventPhase");
};
/**
 * @class
 * @memberOf next2d.events
 */
class EventDispatcher
{
    /**
     *
     *
     * @example <caption>Example usage of EventDispatcher.</caption>
     * // new ColorTransform
     * const {EventDispatcher} = next2d.events;
     * const eventDispatcher   = new EventDispatcher();
     * eventDispatcher.addEventListener(Event.ENTER_FRAME, function (event)
     * {
     *     // more...
     * });
     *
     * @constructor
     * @public
     */
    constructor()
    {
    }
}
/**
 * @class
 * @memberOf next2d.events
 */
class EventPhase
{
    /**
     * EventPhase クラスは、Event クラスの eventPhase プロパティの値を提供します。
     * The EventPhase class provides values for the eventPhase property of the Event class.
     *
     * @example <caption>Example usage of EventPhase.</caption>
     * // static EventPhase
     * const {EventPhase} = next2d.events;
     * EventPhase.AT_TARGET
     *
     * @constructor
     * @public
     */
    constructor () {}

    /**
     * 指定されたクラスのストリングを返します。
     * Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default [class EventPhase]
     * @method
     * @static
     */
    static toString()
    {
        return "[class EventPhase]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @member  {string}
     * @default next2d.events:EventPhase
     * @const
     * @static
     */
    static get namespace ()
    {
        return "next2d.events:EventPhase";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return {string}
     * @default [object EventPhase]
     * @method
     * @public
     */
    toString ()
    {
        return "[object EventPhase]";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @member  {string}
     * @default next2d.events:EventPhase
     * @const
     * @public
     */
    get namespace ()
    {
        return "next2d.events:EventPhase";
    }

    /**
     * @description ターゲット段階（イベントフローの 2 番目の段階）です。
     *              The target phase, which is the second phase of the event flow.
     *
     * @return  {number}
     * @default 2
     * @const
     * @static
     */
    static get AT_TARGET ()
    {
        return 2;
    }

    /**
     * @description ターゲット段階（イベントフローの 2 番目の段階）です。
     *              The target phase, which is the second phase of the event flow.
     *
     * @return  {number}
     * @default 3
     * @const
     * @static
     */
    static get BUBBLING_PHASE ()
    {
        return 3;
    }

    /**
     * @description キャプチャ段階（イベントフローの最初の段階）です。
     *              The capturing phase, which is the first phase of the event flow.
     *
     * @return  {number}
     * @default 1
     * @const
     * @static
     */
    static get CAPTURING_PHASE ()
    {
        return 1;
    }
}
/**
 * @class
 * @memberOf next2d.geom
 */
class ColorTransform
{
    /**
     * ColorTransform クラスを使用すると、表示オブジェクトのカラー値を調整することができます。
     * カラー調整、つまり "カラー変換" は、赤、緑、青、アルファ透明度の 4 つのチャンネルすべてに適用できます。
     * <ul>
     *     <li>新しい red 値 = (古い red 値 * redMultiplier ) + redOffset</li>
     *     <li>新しい green 値 = (古い green 値 * greenMultiplier ) + greenOffset</li>
     *     <li>新しい blue 値 = (古い blue 値 * blueMultiplier ) + blueOffset</li>
     *     <li>新しい alpha 値 = (古い alpha 値 * alphaMultiplier ) + alphaOffset</li>
     * </ul>
     * 算出後、カラーチャンネル値が 255 よりも大きい場合は 255 に設定されます。
     * 0 より小さい場合は 0 に設定されます。
     *
     * The ColorTransform class lets you adjust the color values in a display object.
     * The color adjustment or color transformation can be applied
     * to all four channels: red, green, blue, and alpha transparency.
     * <ul>
     *     <li>New red value = (old red value * redMultiplier) + redOffset</li>
     *     <li>New green value = (old green value * greenMultiplier) + greenOffset</li>
     *     <li>New blue value = (old blue value * blueMultiplier) + blueOffset</li>
     *     <li>New alpha value = (old alpha value * alphaMultiplier) + alphaOffset</li>
     * </ul>
     * If any of the color channel values is greater than 255 after the calculation,
     * it is set to 255. If it is less than 0, it is set to 0.
     *
     * @param {number} [red_multiplier=1]
     * @param {number} [green_multiplier=1]
     * @param {number} [blue_multiplier=1]
     * @param {number} [alpha_multiplier=1]
     * @param {number} [red_offset=0]
     * @param {number} [green_offset=0]
     * @param {number} [blue_offset=0]
     * @param {number} [alpha_offset=0]
     *
     * @example <caption>Example usage of ColorTransform.</caption>
     * // new ColorTransform
     * const {ColorTransform} = next2d.geom;
     * const colorTransform   = new ColorTransform();
     * // set new ColorTransform
     * const {MovieClip} = next2d.display;
     * const movieClip   = new MovieClip();
     * movieClip.transform.colorTransform = colorTransform;
     *
     * @constructor
     * @public
     */
    constructor(
        red_multiplier = 1, green_multiplier = 1, blue_multiplier = 1, alpha_multiplier = 1,
        red_offset = 0, green_offset = 0, blue_offset = 0, alpha_offset = 0
    ) {
        this._$colorTransform = Util.$getColorArray(
            red_multiplier, green_multiplier, blue_multiplier, alpha_multiplier,
            red_offset, green_offset, blue_offset, alpha_offset
        );
    }

    /**
     * 指定されたクラスのストリングを返します。
     * Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default [class ColorTransform]
     * @method
     * @static
     */
    static toString()
    {
        return "[class ColorTransform]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @member {string}
     * @default next2d.geom:ColorTransform
     * @const
     * @static
     */
    static get namespace ()
    {
        return "next2d.geom:ColorTransform";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return {string}
     * @method
     * @public
     */
    toString ()
    {
        return "(redMultiplier=" + this._$colorTransform[0] + ", " +
            "greenMultiplier="   + this._$colorTransform[1] + ", " +
            "blueMultiplier="    + this._$colorTransform[2] + ", " +
            "alphaMultiplier="   + this._$colorTransform[3] + ", " +
            "redOffset="         + this._$colorTransform[4] + ", " +
            "greenOffset="       + this._$colorTransform[5] + ", " +
            "blueOffset="        + this._$colorTransform[6] + ", " +
            "alphaOffset="       + this._$colorTransform[7] + ")";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @member  {string}
     * @default next2d.geom:ColorTransform
     * @public
     * @const
     */
    get namespace ()
    {
        return "next2d.geom:ColorTransform";
    }

    /**
     * @description アルファ透明度チャンネル値に乗算する 10 進数値です。
     *              A decimal value that is multiplied with the alpha transparency channel value.
     *
     * @member {number}
     * @default 1
     * @public
     */
    get alphaMultiplier ()
    {
        return this._$colorTransform[3];
    }
    set alphaMultiplier (alpha_multiplier)
    {
        this._$colorTransform[3] = Util.$clamp(0, 1, alpha_multiplier, 0);
    }

    /**
     * @description アルファ透明度チャンネル値に alphaMultiplier 値を乗算した後に加算する数値です。
     *              数値の範囲は -255 ～ 255 です。
     *              A number from -255 to 255 that is added to the alpha transparency channel value after
     *              it has been multiplied by the alphaMultiplier value.
     *
     * @member {number}
     * @default 0
     * @public
     */
    get alphaOffset ()
    {
        return this._$colorTransform[7];
    }
    set alphaOffset (alpha_offset)
    {
        this._$colorTransform[7] = Util.$clamp(-255, 255, alpha_offset|0);
    }

    /**
     * @description 青チャンネル値に乗算する 10 進数値です。
     *              A decimal value that is multiplied with the blue channel value.
     *
     * @member {number}
     * @default 1
     * @public
     */
    get blueMultiplier ()
    {
        return this._$colorTransform[2];
    }
    set blueMultiplier (blue_multiplier)
    {
        this._$colorTransform[2] = Util.$clamp(0, 1, blue_multiplier, 0);
    }

    /**
     * @description 青チャンネル値に blueMultiplier 値を乗算した後に加算する数値です。
     *              数値の範囲は -255 ～ 255 です。
     *              A number from -255 to 255 that is added to the blue channel value after
     *              it has been multiplied by the blueMultiplier value.
     *
     * @member {number}
     * @default 0
     * @public
     */
    get blueOffset ()
    {
        return this._$colorTransform[6];
    }
    set blueOffset (blue_offset)
    {
        this._$colorTransform[6] = Util.$clamp(-255, 255, blue_offset|0);
    }

    /**
     * @description 緑チャンネル値に乗算する 10 進数値です。
     *              A decimal value that is multiplied with the green channel value.
     *
     * @member {number}
     * @default 1
     * @public
     */
    get greenMultiplier ()
    {
        return this._$colorTransform[1];
    }
    set greenMultiplier (green_multiplier)
    {
        this._$colorTransform[1] = Util.$clamp(0, 1, green_multiplier, 0);
    }

    /**
     * @description 緑チャンネル値に greenMultiplier 値を乗算した後に加算する数値です。
     *              数値の範囲は -255 ～ 255 です。
     *              A number from -255 to 255 that is added to the green channel value after
     *              it has been multiplied by the greenMultiplier value.
     *
     * @member {number}
     * @default 0
     * @public
     */
    get greenOffset ()
    {
        return this._$colorTransform[5];
    }
    set greenOffset (green_offset)
    {
        this._$colorTransform[5] = Util.$clamp(-255, 255, green_offset|0);
    }

    /**
     * @description 赤チャンネル値に乗算する 10 進数値です。
     *              A decimal value that is multiplied with the red channel value.
     *
     * @member {number}
     * @default 1
     * @public
     */
    get redMultiplier ()
    {
        return this._$colorTransform[0];
    }
    set redMultiplier (red_multiplier)
    {
        this._$colorTransform[0] = Util.$clamp(0, 1, red_multiplier, 0);
    }

    /**
     * @description 赤チャンネル値に redMultiplier 値を乗算した後に加算する数値です。
     *              数値の範囲は -255 ～ 255 です。
     *              A number from -255 to 255 that is added to the red channel value after
     *              it has been multiplied by the redMultiplier value.
     *
     * @member {number}
     * @default 0
     * @public
     */
    get redOffset ()
    {
        return this._$colorTransform[4];
    }
    set redOffset (red_offset)
    {
        this._$colorTransform[4] = Util.$clamp(-255, 255, red_offset|0);
    }

    /**
     * @description 2 番目のパラメーターで指定された ColorTransform オブジェクトと
     *              現在の ColorTransform オブジェクトを連結し
     *              2 つのカラー変換を加算的に組み合わせた結果を現在のオブジェクトに設定します。
     *              Concatenates the ColorTransform object specified
     *              by the second parameter with the current ColorTransform object
     *              and sets the current object as the result,
     *              which is an additive combination of the two color transformations.
     *
     * @param  {ColorTransform} second - ColorTransformオブジェクト
     * @return {void}
     * @method
     * @public
     */
    concat (second)
    {
        const multiColor = Util.$multiplicationColor(
            this._$colorTransform,
            second._$colorTransform
        );

        // pool
        Util.$poolColorArray(this._$colorTransform);

        // update
        this._$colorTransform = multiColor;
    }

    /**
     * @return {ColorTransform}
     * @method
     * @private
     */
    _$clone ()
    {
        const colorTransform = new ColorTransform();

        colorTransform._$colorTransform = Util.$getColorArray(
            this._$colorTransform[0], this._$colorTransform[1],
            this._$colorTransform[2], this._$colorTransform[3],
            this._$colorTransform[4], this._$colorTransform[5],
            this._$colorTransform[6], this._$colorTransform[7]
        );

        return colorTransform;
    }
}
/**
 * @class
 * @memberOf next2d.geom
 */
class Matrix
{
    /**
     * Matrix クラスは、2 つの座標空間の間におけるポイントのマッピング方法を決定する変換マトリックスを表します。
     * Matrix オブジェクトのプロパティを設定し、Matrix オブジェクトを Transform オブジェクトの matrix プロパティに適用し、
     * 次に Transform オブジェクトを表示オブジェクトの transform プロパティとして適用することで、表示オブジェクトに対する各種グラフィック変換を実行できます。
     * これらの変換機能には、平行移動（x と y の位置変更）、回転、拡大 / 縮小、傾斜などが含まれます。
     *
     * The Matrix class represents a transformation matrix that determines how to map points from one coordinate space to another.
     * You can perform various graphical transformations on a display object by setting the properties of a Matrix object,
     * applying that Matrix object to the matrix property of a Transform object,
     * and then applying that Transform object as the transform property of the display object.
     * These transformation functions include translation (x and y repositioning), rotation, scaling, and skewing.
     *
     * @param   {number} [a=1]
     * @param   {number} [b=0]
     * @param   {number} [c=0]
     * @param   {number} [d=1]
     * @param   {number} [tx=0]
     * @param   {number} [ty=0]
     *
     * @example <caption>Example usage of Matrix.</caption>
     * // new Matrix
     * const {Matrix} = next2d.geom;
     * const matrix   = new Matrix();
     * // set new Matrix
     * const {MovieClip} = next2d.display;
     * const movieClip   = new MovieClip();
     * movieClip.transform.matrix = matrix;
     *
     * @constructor
     * @public
     */
    constructor(a = 1, b = 0, c = 0, d = 1, tx = 0, ty = 0)
    {
        this._$matrix = Util.$getMatrixArray(a, b, c, d, tx, ty);
    }

    /**
     * 指定されたクラスのストリングを返します。
     * Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default [class Matrix]
     * @method
     * @static
     */
    static toString ()
    {
        return "[class Matrix]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @member  {string}
     * @default next2d.geom:Matrix
     * @const
     * @static
     */
    static get namespace ()
    {
        return "next2d.geom:Matrix";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return {string}
     * @method
     * @public
     */
    toString ()
    {
        return `(a=${this.a}, b=${this.b}, c=${this.c}, d=${this.d}, tx=${this.tx}, ty=${this.ty})`;
    };

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @member  {string}
     * @default next2d.geom:Matrix
     * @public
     * @const
     */
    get namespace ()
    {
        return "next2d.geom:Matrix";
    }

    /**
     * @description イメージを拡大 / 縮小または回転するときに x 軸方向のピクセルの配置に影響を与える値です。
     *              The value that affects the positioning
     *              of pixels along the x axis when scaling or rotating an image.
     *
     * @member {number}
     * @default 1
     * @public
     */
    get a ()
    {
        return this._$matrix[0];
    }
    set a (a)
    {
        this._$matrix[0] = +a;
    }

    /**
     * @description イメージを回転または傾斜させるときに y 軸方向のピクセルの配置に影響を与える値です。
     *              The value that affects the positioning
     *              of pixels along the y axis when rotating or skewing an image.
     *
     * @member {number}
     * @default 0
     * @public
     */
    get b ()
    {
        return this._$matrix[1];
    }
    set b (b)
    {
        this._$matrix[1] = +b;
    }

    /**
     * @description イメージを回転または傾斜させるときに x 軸方向のピクセルの配置に影響を与える値です。
     *              The value that affects the positioning
     *              of pixels along the x axis when rotating or skewing an image.
     *
     * @member {number}
     * @default 0
     * @public
     */
    get c ()
    {
        return this._$matrix[2];
    }
    set c (c)
    {
        this._$matrix[2] = +c;
    }

    /**
     * @description イメージを拡大 / 縮小または回転するときに y 軸方向のピクセルの配置に影響を与える値です。
     *              The value that affects the positioning
     *              of pixels along the y axis when scaling or rotating an image.
     *
     * @member {number}
     * @default 1
     * @public
     */
    get d ()
    {
        return this._$matrix[3];
    }
    set d (d)
    {
        this._$matrix[3] = +d;
    }

    /**
     * @description x 軸方向に各ポイントを平行移動する距離です。
     *              The distance by which to translate each point along the x axis.
     *
     * @member {number}
     * @default 0
     * @public
     */
    get tx ()
    {
        return this._$matrix[4] / Util.$TWIPS;
    }
    set tx (tx)
    {
        this._$matrix[4] = +tx * Util.$TWIPS;
    }

    /**
     * @description y 軸方向に各ポイントを平行移動する距離です。
     *              The distance by which to translate each point along the y axis.
     *
     * @member {number}
     * @default 0
     * @public
     */
    get ty ()
    {
        return this._$matrix[5] / Util.$TWIPS;
    }
    set ty (ty)
    {
        this._$matrix[5] = +ty * Util.$TWIPS;
    }

    /**
     * @return {Matrix}
     * @method
     * @private
     */
    _$clone ()
    {
        return this.clone();
    }

    /**
     * @description 新しい Matrix オブジェクトとして、このマトリックスのクローンを返します。
     *              含まれるオブジェクトはまったく同じコピーになります。
     *              Returns a new Matrix object that is a clone of this matrix,
     *              with an exact copy of the contained object.
     *
     * @return {Matrix}
     * @method
     * @public
     */
    clone ()
    {
        const matrix = new Matrix(
            this._$matrix[0], this._$matrix[1],
            this._$matrix[2], this._$matrix[3],
            0, 0
        );

        matrix._$matrix[4] = this._$matrix[4];
        matrix._$matrix[5] = this._$matrix[5];

        return matrix;
    }

    /**
     * @description マトリックスを現在のマトリックスと連結して、
     *              2 つのマトリックスの図形効果を効果的に組み合わせます。
     *              Concatenates a matrix with the current matrix,
     *              effectively combining the geometric effects of the two.
     *
     * @param  {Matrix} m
     * @return {void}
     * @method
     * @public
     */
    concat (m)
    {
        const matrix = this._$matrix;
        const target = m._$matrix;

        let a =  matrix[0] * target[0];
        let b =  0.0;
        let c =  0.0;
        let d =  matrix[3] * target[3];
        let tx = matrix[4] * target[0] + target[4];
        let ty = matrix[5] * target[3] + target[5];

        switch (true) {

            case (matrix[1] !== 0):
            case (matrix[2] !== 0):
            case (target[1] !== 0):
            case (target[2] !== 0):

                a  += (matrix[1] * target[2]);
                d  += (matrix[2] * target[1]);
                b  += (matrix[0] * target[1] + matrix[1] * target[3]);
                c  += (matrix[2] * target[0] + matrix[3] * target[2]);
                tx += (matrix[5] * target[2]);
                ty += (matrix[4] * target[1]);

                break;

            default:
                break;

        }

        this._$matrix[0] = a;
        this._$matrix[1] = b;
        this._$matrix[2] = c;
        this._$matrix[3] = d;
        this._$matrix[4] = tx;
        this._$matrix[5] = ty;
    }

    /**
     * @description すべてのマトリックスデータを、ソース Matrix オブジェクトから、
     *              呼び出し元の Matrix オブジェクトにコピーします。
     *
     * @param  {Matrix} source_matrix
     * @method
     * @return {void}
     */
    copyFrom (source_matrix)
    {
        this.a  = source_matrix.a;
        this.b  = source_matrix.b;
        this.c  = source_matrix.c;
        this.d  = source_matrix.d;
        this.tx = source_matrix.tx;
        this.ty = source_matrix.ty;
    }

    /**
     * @description 拡大 / 縮小、回転、平行移動に関するパラメーターなどがあります。
     *              Includes parameters for scaling, rotation, and translation.
     *
     * @param  {number} scale_x
     * @param  {number} scale_y
     * @param  {number} [rotation=0]
     * @param  {number} [tx=0]
     * @param  {number} [ty=0]
     * @return {void}
     * @method
     * @public
     */
    createBox (scale_x, scale_y, rotation = 0, tx = 0, ty = 0)
    {
        this.identity();
        this.rotate(rotation);
        this.scale(scale_x, scale_y);
        this.translate(tx, ty);
    }

    /**
     * @description Graphics クラスの beginGradientFill() メソッドで使用する特定のスタイルを作成します。
     *              Creates the specific style of matrix expected
     *              by the beginGradientFill() and lineGradientStyle() methods of the Graphics class.
     *
     * @param  {number} width
     * @param  {number} height
     * @param  {number} [rotation=0]
     * @param  {number} [tx=0]
     * @param  {number} [ty=0]
     * @return {void}
     * @method
     * @public
     */
    createGradientBox (width, height, rotation = 0, tx = 0, ty = 0)
    {
        this.createBox(width / 1638.4, height / 1638.4, rotation, tx + width / 2, ty + height / 2);
    }

    /**
     * @description 変換前の座標空間内のポイントが指定されると、そのポイントの変換後の座標を返します。
     *              Given a point in the pretransform coordinate space,
     *              returns the coordinates of that point after the transformation occurs.
     *
     * @param  {Point} point
     * @return {Point}
     * @method
     * @public
     */
    deltaTransformPoint (point)
    {
        return new Point(
            point.x * this._$matrix[0] + point.y * this._$matrix[2],
            point.x * this._$matrix[1] + point.y * this._$matrix[3]
        );
    }

    /**
     * @description 各行列プロパティを null 変換になる値に設定します。
     *              Sets each matrix property to a value that causes a null transformation.
     *
     * @return {void}
     * @method
     * @public
     */
    identity ()
    {
        this._$matrix[0] = 1;
        this._$matrix[1] = 0;
        this._$matrix[2] = 0;
        this._$matrix[3] = 1;
        this._$matrix[4] = 0;
        this._$matrix[5] = 0;
    }

    /**
     * @description 元のマトリックスの逆の変換を実行します。
     *              Performs the opposite transformation of the original matrix.
     *
     * @return {void}
     * @method
     * @public
     */
    invert ()
    {
        let a  = this._$matrix[0];
        let b  = this._$matrix[1];
        let c  = this._$matrix[2];
        let d  = this._$matrix[3];
        let tx = this._$matrix[4] / Util.$TWIPS;
        let ty = this._$matrix[5] / Util.$TWIPS;

        if (b === 0 && c === 0) {

            this.a  = 1 / a;
            this.b  = 0;
            this.c  = 0;
            this.d  = 1 / d;
            this.tx = -this.a * tx;
            this.ty = -this.d * ty;

        } else {

            const det = a * d - b * c;

            if (det === 0) {

                this.identity();

            } else {

                const rdet = 1 / det;

                this.a  = d  * rdet;
                this.b  = -b * rdet;
                this.c  = -c * rdet;
                this.d  = a  * rdet;
                this.tx = -(this.a * tx + this.c * ty);
                this.ty = -(this.b * tx + this.d * ty);

            }

        }
    }

    /**
     * @description Matrix オブジェクトに回転変換を適用します。
     *              Applies a rotation transformation to the Matrix object.
     *
     * @param  {number} rotation
     * @return {void}
     * @method
     * @public
     */
    rotate (rotation)
    {
        const a  = this._$matrix[0];
        const b  = this._$matrix[1];
        const c  = this._$matrix[2];
        const d  = this._$matrix[3];
        const tx = this._$matrix[4];
        const ty = this._$matrix[5];

        this._$matrix[0] = a  * Util.$cos(rotation) - b  * Util.$sin(rotation);
        this._$matrix[1] = a  * Util.$sin(rotation) + b  * Util.$cos(rotation);
        this._$matrix[2] = c  * Util.$cos(rotation) - d  * Util.$sin(rotation);
        this._$matrix[3] = c  * Util.$sin(rotation) + d  * Util.$cos(rotation);
        this._$matrix[4] = tx * Util.$cos(rotation) - ty * Util.$sin(rotation);
        this._$matrix[5] = tx * Util.$sin(rotation) + ty * Util.$cos(rotation);
    }

    /**
     * @description 行列に拡大 / 縮小の変換を適用します。
     *              Applies a scaling transformation to the matrix.
     *
     * @param  {number} sx
     * @param  {number} sy
     * @return {void}
     * @method
     * @public
     */
    scale (sx, sy)
    {
        this._$matrix[0] *= sx;
        this._$matrix[2] *= sx;
        this._$matrix[4] *= sx;

        this._$matrix[1] *= sy;
        this._$matrix[3] *= sy;
        this._$matrix[5] *= sy;
    }

    /**
     * @description Matrix のメンバーを指定の値に設定します。
     *              Sets the members of Matrix to the specified values
     *
     * @param  {number} aa
     * @param  {number} ba
     * @param  {number} ca
     * @param  {number} da
     * @param  {number} txa
     * @param  {number} tya
     * @return {void}
     * @method
     * @public
     */
    setTo (aa, ba, ca, da, txa, tya)
    {
        this.a  = aa;
        this.b  = ba;
        this.c  = ca;
        this.d  = da;
        this.tx = txa;
        this.ty = tya;
    }

    /**
     * @description Matrix オブジェクトで表現される図形変換を、指定されたポイントに適用した結果を返します。
     *              Returns the result of applying the geometric transformation represented
     *              by the Matrix object to the specified point.
     *
     * @param  {Point} point
     * @return {Point}
     * @method
     * @public
     */
    transformPoint (point)
    {
        return new Point(
            point.x * this._$matrix[0] + point.y * this._$matrix[2] + this._$matrix[4] / Util.$TWIPS,
            point.x * this._$matrix[1] + point.y * this._$matrix[3] + this._$matrix[5] / Util.$TWIPS
        );
    }

    /**
     * @description 行列を x 軸と y 軸に沿って、
     *              dx パラメーターと dy パラメーターで指定された量だけ平行移動します。
     *              Translates the matrix along the x and y axes,
     *              as specified by the dx and dy parameters.
     *
     * @param  {number} dx
     * @param  {number} dy
     * @return {void}
     * @method
     * @public
     */
    translate (dx, dy)
    {
        this.tx += dx;
        this.ty += dy;
    }
}
/**
 * @class
 * @memberOf next2d.geom
 */
class Point
{
    /**
     * Point オブジェクトは 2 次元の座標系の位置を表します。
     * x は水平方向の軸を表し、y は垂直方向の軸を表します。
     *
     * The Point object represents a location in a two-dimensional coordinate system,
     * where x represents the horizontal axis and y represents the vertical axis.
     *
     * @param {number} [x=0]
     * @param {number} [y=0]
     *
     * @example <caption>Example usage of Point.</caption>
     * // new Point
     * const {Point} = next2d.geom;
     * const point   = new Point();
     *
     * @constructor
     * @public
     */
    constructor(x = 0, y = 0)
    {
        this._$x = +x * Util.$TWIPS;
        this._$y = +y * Util.$TWIPS;
    }

    /**
     * 指定されたクラスのストリングを返します。
     * Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default [class Point]
     * @method
     * @static
     */
    static toString()
    {
        return "[class Point]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @member  {string}
     * @default next2d.geom:Point
     * @const
     * @static
     */
    static get namespace ()
    {
        return "next2d.geom:Point";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return {string}
     * @method
     * @public
     */
    toString ()
    {
        return `(x=${this.x}, y=${this.y})`;
    };

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @member  {string}
     * @default next2d.geom:Point
     * @public
     * @const
     */
    get namespace ()
    {
        return "next2d.geom:Point";
    }

    /**
     * @description (0,0) からこのポイントまでの線のセグメントの長さです。
     *              The length of the line segment from (0,0) to this point.
     *
     * @member {number}
     * @default 0
     * @readonly
     * @public
     */
    get length ()
    {
        return Util.$sqrt(Util.$pow(this.x, 2) + Util.$pow(this.y, 2));
    }

    /**
     * @description ポイントの水平座標です。
     *              The horizontal coordinate of the point.
     *
     * @member {number}
     * @default 0
     * @public
     */
    get x ()
    {
        return this._$x / Util.$TWIPS;
    }
    set x (x)
    {
        this._$x = +x * Util.$TWIPS;
    }

    /**
     * @description ポイントの垂直座標です。
     *              The vertical coordinate of the point.
     *
     * @member {number}
     * @default 0
     * @public
     */
    get y ()
    {
        return this._$y / Util.$TWIPS;
    }
    set y (y)
    {
        this._$y = +y * Util.$TWIPS;
    }

    /**
     * @description このポイントの座標に他のポイントの座標を加算して、新しいポイントを作成します。
     *              Adds the coordinates of another point
     *              to the coordinates of this point to create a new point.
     *
     * @param   {Point} v
     * @returns {Point}
     * @method
     * @public
     */
    add (v)
    {
        return new Point(this.x + v.x, this.y + v.y);
    }

    /**
     * @description この Point オブジェクトのコピーを作成します。
     *              Creates a copy of this Point object.
     *
     * @returns {Point}
     * @method
     * @public
     */
    clone ()
    {
        return new Point(this.x, this.y);
    }

    /**
     * @description すべてのポイントデータを、ソース Point オブジェクトから、
     *              呼び出し元の Point オブジェクトにコピーします。
     *              Copies all of the point data from
     *              the source Point object into the calling Point object.
     *
     * @param   {Point} source_point
     * @returns void
     * @public
     */
    copyFrom (source_point)
    {
        this._$x = source_point._$x;
        this._$y = source_point._$y;
    }

    /**
     * @description pt1 と pt2 との距離を返します。
     *              Returns the distance between pt1 and pt2.
     *
     * @param  {Point} pt1
     * @param  {Point} pt2
     * @return {number}
     * @method
     * @static
     */
    static distance (pt1, pt2)
    {
        return Util.$sqrt(
              Util.$pow((pt1._$x - pt2._$x) / Util.$TWIPS, 2)
            + Util.$pow((pt1._$y - pt2._$y) / Util.$TWIPS, 2)
        );
    }

    /**
     * @description 2 つのポイントが等しいかどうかを判別します。
     *              Determines whether two points are equal.
     *
     * @param  {Point} to_compare
     * @return {boolean}
     * @method
     * @public
     */
    equals (to_compare)
    {
        return (this._$x === to_compare._$x && this._$y === to_compare._$y);
    }

    /**
     * @description 2 つの指定されたポイント間にあるポイントを判別します。
     *              Determines a point between two specified points.
     *
     * @param  {Point}  pt1
     * @param  {Point}  pt2
     * @param  {number} f
     * @return {Point}
     * @static
     */
    static interpolate (pt1, pt2, f)
    {
        return new Point(
            pt1.x + (pt2.x - pt1.x) * (1 - f),
            pt1.y + (pt2.y - pt1.y) * (1 - f)
        );
    }

    /**
     * @description (0,0) と現在のポイント間の線のセグメントを設定された長さに拡大 / 縮小します。
     *              Scales the line segment between (0,0) and the current point to a set length.
     *
     * @param  {number} thickness
     * @return {void}
     * @method
     * @public
     */
    normalize (thickness)
    {
        const length = this.length;
        this.x = this.x * thickness / length;
        this.y = this.y * thickness / length;
    }

    /**
     * @description Point オブジェクトを指定された量だけオフセットします。
     *              Offsets the Point object by the specified amount.
     *
     * @param  {number} dx
     * @param  {number} dy
     * @return {Point}
     * @method
     * @public
     */
    offset (dx, dy)
    {
        this.x += dx;
        this.y += dy;
    }

    /**
     * @description 極座標ペアを直交点座標に変換します。
     *              Converts a pair of polar coordinates to a Cartesian point coordinate.
     *
     * @param  {number} len
     * @param  {number} angle
     * @return {Point}
     * @method
     * @static
     */
    static polar (len, angle)
    {
        return new Point(len * Util.$cos(angle), len * Util.$sin(angle));
    }


    /**
     * @description Point のメンバーを指定の値に設定します。
     *              Sets the members of Point to the specified values
     *
     * @param  {number} xa
     * @param  {number} ya
     * @return {void}
     * @method
     * @public
     */
    setTo (xa, ya)
    {
        this.x = xa;
        this.y = ya;
    }

    /**
     * @description このポイントの座標から他のポイントの座標を減算して、新しいポイントを作成します。
     *              Subtracts the coordinates of another point
     *              from the coordinates of this point to create a new point.
     *
     * @param  {Point} v
     * @return {Point}
     * @method
     * @public
     */
    subtract (v)
    {
        return new Point(this.x - v.x, this.y - v.y);
    }
}
/**
 * @class
 * @memberOf next2d.geom
 */
class Rectangle
{
    /**
     * Rectangle オブジェクトは、その位置（左上隅のポイント (x, y) で示される)、および幅と高さで定義される領域です。
     * Rectangle クラスの x、y、width、および height の各プロパティは、互いに独立しているため、
     * あるプロパティの値を変更しても、他のプロパティに影響はありません。
     * ただし、right プロパティと bottom プロパティはこれら 4 つのプロパティと不可分に関連しています。
     * 例えば、right プロパティの値を変更すると width プロパティの値も変更されます。
     * bottom プロパティの値を変更すると、height プロパティの値も変更されます。
     *
     * A Rectangle object is an area defined by its position,
     * as indicated by its top-left corner point (x, y) and by its width and its height.
     * The x, y, width, and height properties of the Rectangle class are independent of each other;
     * changing the value of one property has no effect on the others. However,
     * the right and bottom properties are integrally related to those four properties.
     * For example, if you change the value of the right property, the value of the width property changes;
     * if you change the bottom property, the value of the height property changes.
     *
     * @param   {number} [x=0]
     * @param   {number} [y=0]
     * @param   {number} [width=0]
     * @param   {number} [height=0]
     *
     * @example <caption>Example usage of Rectangle.</caption>
     * // new Rectangle
     * const {Rectangle} = next2d.geom;
     * const rectangle   = new Rectangle(0, 0, 100, 100);
     *
     * @constructor
     * @public
     */
    constructor (x = 0, y = 0, width = 0, height = 0)
    {
        this.setTo(x, y, width, height);
    }

    /**
     * 指定されたクラスのストリングを返します。
     * Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default [class Rectangle]
     * @method
     * @static
     */
    static toString()
    {
        return "[class Rectangle]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @member  {string}
     * @default next2d.geom:Rectangle
     * @const
     * @static
     */
    static get namespace ()
    {
        return "next2d.geom:Rectangle";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return {string}
     * @method
     * @public
     */
    toString ()
    {
        return `(x=${this.x}, y=${this.y}, w=${this.width}, h=${this.height})`;
    };

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @member  {string}
     * @default next2d.geom:Rectangle
     * @public
     * @const
     */
    get namespace ()
    {
        return "next2d.geom:Rectangle";
    }

    /**
     * @description y プロパティと height プロパティの合計です。
     *              The sum of the y and height properties.
     *
     * @member {number}
     * @public
     */
    get bottom ()
    {
        return this.y + this.height;
    }
    set bottom (bottom)
    {
        this.height = +bottom - this.y;
    }

    /**
     * @description Rectangle オブジェクトの右下隅の位置で、
     *              right プロパティと bottom プロパティの値で決まります。
     *              The location of the Rectangle object's bottom-right corner,
     *              determined by the values of the right and bottom properties.
     *
     * @member {Point}
     * @public
     */
    get bottomRight ()
    {
        return new Point(this.right, this.bottom);
    }
    set bottomRight (point)
    {
        this.right  = point.x;
        this.bottom = point.y;
    }

    /**
     * @description 矩形の高さ（ピクセル単位）です。
     *              The height of the rectangle, in pixels.
     *
     * @member {number}
     * @public
     */
    get height ()
    {
        return this._$height / Util.$TWIPS;
    }
    set height (height)
    {
        this._$height = +height * Util.$TWIPS;
    }

    /**
     * @description 矩形の左上隅の x 座標です。
     *              The x coordinate of the top-left corner of the rectangle.
     *
     * @member {number}
     * @public
     */
    get left ()
    {
        return this.x;
    }
    set left (left)
    {
        this.width = this.right - +left;
        this.x     = left;
    }

    /**
     * @description x プロパティと width プロパティの合計です。
     *              The sum of the x and width properties.
     *
     * @member {number}
     * @public
     */
    get right ()
    {
        return this.x + this.width;
    }
    set right (right)
    {
        this.width = +right - this.x;
    }

    /**
     * @description Rectangle オブジェクトのサイズで、
     *              width プロパティと height プロパティの値を持つ Point オブジェクトとして表現されます。
     *              The size of the Rectangle object,
     *              expressed as a Point object with the values of the width and height properties.
     *
     * @member {Point}
     * @public
     */
    get size ()
    {
        return new Point(this.width, this.height);
    }
    set size (point)
    {
        this.width  = point.x;
        this.height = point.y;
    }

    /**
     * @description 矩形の左上隅の y 座標です。
     *              The y coordinate of the top-left corner of the rectangle.
     *
     * @member {number}
     * @public
     */
    get top ()
    {
        return this.y;
    }
    set top (top)
    {
        this.height = +(this.bottom - +top);
        this.y      = top;
    }

    /**
     * @description Rectangle オブジェクトの左上隅の位置で、
     *              そのポイントの x 座標と y 座標で決まります。
     *              The location of the Rectangle object's top-left corner,
     *              determined by the x and y coordinates of the point.
     *
     * @member {Point}
     * @public
     */
    get topLeft ()
    {
        return new Point(this.x, this.y);
    }
    set topLeft (point)
    {
        this.left = point.x;
        this.top  = point.y;
    }

    /**
     * @description 矩形の幅（ピクセル単位）です。
     *              The width of the rectangle, in pixels.
     *
     * @member {number}
     * @public
     */
    get width ()
    {
        return this._$width / Util.$TWIPS;
    }
    set width (width)
    {
        this._$width = +width * Util.$TWIPS;
    }

    /**
     * @description 矩形の左上隅の x 座標です。
     *              The x coordinate of the top-left corner of the rectangle.
     *
     * @member {number}
     * @public
     */
    get x ()
    {
        return this._$x / Util.$TWIPS;
    }
    set x (x)
    {
        this._$x = +x * Util.$TWIPS;
    }

    /**
     * @description 矩形の左上隅の y 座標です。
     *              The y coordinate of the top-left corner of the rectangle.
     *
     * @member {number}
     * @public
     */
    get y ()
    {
        return this._$y / Util.$TWIPS;
    }
    set y (y)
    {
        this._$y = +y * Util.$TWIPS;
    }

    /**
     * @description 元の Rectangle オブジェクトと x、y、width、および height の各プロパティの値が同じである、
     *              新しい Rectangle オブジェクトを返します。
     *              Returns a new Rectangle object with the same values for the x, y, width,
     *              and height properties as the original Rectangle object.
     *
     * @return {Rectangle}
     *
     * @public
     */
    clone ()
    {
        return new Rectangle(this.x, this.y, this.width, this.height);
    }

    /**
     * @description 指定されたポイントがこの Rectangle オブジェクトで定義される矩形領域内にあるかどうかを判別します。
     *              Determines whether the specified point is contained within
     *              the rectangular region defined by this Rectangle object.
     *
     * @param  {number} x
     * @param  {number} y
     * @return {boolean}
     * @method
     * @public
     */
    contains (x, y)
    {
        return (this.x <= x && this.y <= y && this.right > x && this.bottom > y);
    }

    /**
     * @description 指定されたポイントがこの Rectangle オブジェクトで定義される矩形領域内にあるかどうかを判別します。
     *              Determines whether the specified point is contained within
     *              the rectangular region defined by this Rectangle object.
     *
     * @param  {Point}   point
     * @return {boolean}
     * @method
     * @public
     */
    containsPoint (point)
    {
        return (this.x <= point.x && this.y <= point.y &&
            this.right > point.x && this.bottom > point.y);
    }

    /**
     * @description rect パラメーターで指定された Rectangle オブジェクトがこの Rectangle オブジェクト内にあるかどうかを判別します。
     *              Determines whether the Rectangle object specified by
     *              the rect parameter is contained within this Rectangle object.
     *
     * @param  {Rectangle} rect
     * @return {boolean}
     * @method
     * @public
     */
    containsRect (rect)
    {
        return (this.x <= rect.x && this.y <= rect.y &&
            this.right >= rect.right && this.bottom >= rect.bottom);
    }

    /**
     * @description すべての矩形データを、ソース Rectangle オブジェクトから、
     *              呼び出し元の Rectangle オブジェクトにコピーします。
     *              Copies all of rectangle data from
     *              the source Rectangle object into the calling Rectangle object.
     *
     * @param  {Rectangle} source_rect
     * @return {void}
     * @method
     * @public
     */
    copyFrom (source_rect)
    {
        this.x      = source_rect.x;
        this.y      = source_rect.y;
        this.width  = source_rect.width;
        this.height = source_rect.height;
    }

    /**
     * @description toCompare パラメーターで指定されたオブジェクトが
     *              この Rectangle オブジェクトと等しいかどうかを判別します。
     *              Determines whether the object specified
     *              in the toCompare parameter is equal to this Rectangle object.
     *
     * @param  {Rectangle} to_compare
     * @return {boolean}
     * @method
     * @public
     */
    equals (to_compare)
    {
        return (this.x === to_compare.x && this.y === to_compare.y &&
            this.width === to_compare.width && this.height === to_compare.height);
    }

    /**
     * @description Rectangle オブジェクトのサイズを、指定された量（ピクセル単位）だけ大きくします。
     *              Increases the size of the Rectangle object by the specified amounts, in pixels.
     *
     * @param  {number} dx
     * @param  {number} dy
     * @return void
     * @method
     * @public
     */
    inflate (dx, dy)
    {
        this.x      = this.x - +dx;
        this.width  = this.width + 2 * +dx;

        this.y      = this.y - +dy;
        this.height = this.height + 2 * +dy;
    }

    /**
     * @description Rectangle オブジェクトのサイズを大きくします。
     *              Increases the size of the Rectangle object.
     *
     * @param  {Point} point
     * @return {void}
     * @method
     * @public
     */
    inflatePoint (point)
    {
        this.x      = this.x - point.x;
        this.width  = this.width + 2 * point.x;

        this.y      = this.y - point.y;
        this.height = this.height + 2 * point.y;
    }

    /**
     * @description toIntersect パラメーターで指定された Rectangle オブジェクトが
     *              この Rectangle オブジェクトと交差する場合に、交差領域を Rectangle オブジェクトとして返します。
     *              If the Rectangle object specified in the toIntersect parameter intersects
     *              with this Rectangle object, returns the area of intersection as a Rectangle object.
     *
     * @param  {Rectangle} to_intersect
     * @return {Rectangle}
     * @method
     * @public
     */
    intersection (to_intersect)
    {
        const sx = Util.$max(this.x, to_intersect.x);
        const sy = Util.$max(this.y, to_intersect.y);
        const ex = Util.$min(this.right,  to_intersect.right);
        const ey = Util.$min(this.bottom, to_intersect.bottom);

        const w = ex - sx;
        const h = ey - sy;
        return (w > 0 && h > 0) ? new Rectangle(sx, sy, w, h) : new Rectangle(0, 0, 0, 0);
    }

    /**
     * @description toIntersect パラメーターで指定されたオブジェクトが
     *              この Rectangle オブジェクトと交差するかどうかを判別します。
     *              Determines whether the object specified
     *              in the toIntersect parameter intersects with this Rectangle object.
     *
     * @param  {Rectangle} to_intersect
     * @return {boolean}
     * @method
     * @public
     */
    intersects (to_intersect)
    {
        const sx = Util.$max(this.x, to_intersect.x);
        const sy = Util.$max(this.y, to_intersect.y);
        const ex = Util.$min(this.right,  to_intersect.right);
        const ey = Util.$min(this.bottom, to_intersect.bottom);
        return ((ex - sx) > 0 && (ey - sy) > 0);
    }

    /**
     * @description この Rectangle オブジェクトが空かどうかを判別します。
     *              Determines whether or not this Rectangle object is empty.
     *
     * @return {boolean}
     * @method
     * @public
     */
    isEmpty ()
    {
        return (this.width <= 0 || this.height <= 0);
    }

    /**
     * @description Rectangle オブジェクトの位置（左上隅で決定される）を、指定された量だけ調整します。
     *              Adjusts the location of the Rectangle object,
     *              as determined by its top-left corner, by the specified amounts.
     *
     * @param  {number} dx
     * @param  {number} dy
     * @return {void}
     * @method
     * @public
     */
    offset (dx ,dy)
    {
        this.x += dx;
        this.y += dy;
    }

    /**
     * @description Point オブジェクトをパラメーターとして使用して、Rectangle オブジェクトの位置を調整します。
     *              Adjusts the location of the Rectangle object using a Point object as a parameter.
     *
     * @param  {Point} point
     * @return {void}
     * @method
     * @public
     */
    offsetPoint (point)
    {
        this.x += point.x;
        this.y += point.y;
    }

    /**
     * @description Rectangle オブジェクトのすべてのプロパティを 0 に設定します。
     *              Sets all of the Rectangle object's properties to 0.
     *
     * @return {void}
     * @method
     * @public
     */
    setEmpty ()
    {
        this._$x      = 0;
        this._$y      = 0;
        this._$width  = 0;
        this._$height = 0;
    }

    /**
     * @description Rectangle のメンバーを指定の値に設定します。
     *              Sets the members of Rectangle to the specified values
     *
     * @param  {number} x
     * @param  {number} y
     * @param  {number} width
     * @param  {number} height
     * @return {void}
     * @method
     * @public
     */
    setTo (x, y, width, height)
    {
        this.x      = x;
        this.y      = y;
        this.width  = width;
        this.height = height;
    }

    /**
     * @description 2 つの矩形間の水平と垂直の空間を塗りつぶすことにより、
     *              2 つの矩形を加算して新しい Rectangle オブジェクトを作成します。
     *              Adds two rectangles together to create a new Rectangle object,
     *              by filling in the horizontal and vertical space between the two rectangles.
     *
     * @param  {Rectangle} to_union
     * @return {Rectangle}
     * @method
     * @public
     */
    union (to_union)
    {
        if (this.isEmpty()) {
            return to_union.clone();
        }

        if (to_union.isEmpty()) {
            return this.clone();
        }

        return new Rectangle(
            Util.$min(this.x, to_union.x),
            Util.$min(this.y, to_union.y),
            Util.$max(this.right - to_union.left, to_union.right - this.left),
            Util.$max(this.bottom - to_union.top, to_union.bottom - this.top)
        );
    }
}
/**
 * @class
 * @memberOf next2d.geom
 */
class Transform
{
    /**
     * Transform クラスは、表示オブジェクトに適用されるカラー調整プロパティと 2 次元の変換オブジェクトへのアクセスを提供します。
     * 変換時に、表示オブジェクトのカラーまたは方向と位置が、現在の値または座標から新しい値または座標に調整（オフセット）されます。
     * Transform クラスは、表示オブジェクトおよびすべての親オブジェクトに適用されるカラー変換と 2 次元マトリックス変換に関するデータも収集します。
     * concatenatedColorTransform プロパティと concatenatedMatrix プロパティを使用して、これらの結合された変換にアクセスできます。
     * カラー変換を適用するには、ColorTransform オブジェクトを作成し、オブジェクトのメソッドとプロパティを使用してカラー調整を設定した後、
     * colorTransformation プロパティ（表示オブジェクトの transform プロパティの）を新しい ColorTransformation オブジェクトに割り当てます。
     * 2 次元変換を適用するには、Matrix オブジェクトを作成し、マトリックスの 2 次元変換を設定した後、表示オブジェクトの transform.matrix プロパティを新しい Matrix オブジェクトに割り当てます。
     *
     * The Transform class provides access to color adjustment properties and two--dimensional transformation objects that can be applied to a display object.
     * During the transformation, the color or the orientation and position of a display object is adjusted (offset) from the current values or coordinates to new values or coordinates.
     * The Transform class also collects data about color and two-dimensional matrix transformations that are applied to a display object and all of its parent objects.
     * You can access these combined transformations through the concatenatedColorTransform and concatenatedMatrix properties.
     * To apply color transformations: create a ColorTransform object,
     * set the color adjustments using the object's methods and properties,
     * and then assign the colorTransformation property of the transform property of the display object to the new ColorTransformation object.
     * To apply two-dimensional transformations: create a Matrix object,
     * set the matrix's two-dimensional transformation,
     * and then assign the transform.matrix property of the display object to the new Matrix object.
     *
     * @param {DisplayObject} src
     *
     * @example <caption>Example usage of Transform.</caption>
     * // new Transform
     * const {Transform} = next2d.geom;
     * const transform   = new Transform(displayObject);
     *
     * @constructor
     * @public
     */
    constructor(src)
    {
        if (src instanceof DisplayObject) {
            throw new Error("Transform params is DisplayObject only.");
        }

        this._$displayObject  = src;
        this._$matrix         = null;
        this._$colorTransform = null;
        this._$blendMode      = null;
        this._$filters        = null;
    }

    /**
     * 指定されたクラスのストリングを返します。
     * Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default [class Transform]
     * @method
     * @static
     */
    static toString()
    {
        return "[class Transform]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @member  {string}
     * @default next2d.geom:Transform
     * @const
     * @static
     */
    static get namespace ()
    {
        return "next2d.geom:Transform";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return {string}
     * @method
     * @public
     */
    toString ()
    {
        return "[object Transform]";
    };

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @member  {string}
     * @default next2d.geom:Transform
     * @public
     * @const
     */
    get namespace ()
    {
        return "next2d.geom:Transform";
    }

    /**
     * @description 表示オブジェクトのカラーを全体的に調整する値を格納している
     *              ColorTransform オブジェクトです。
     *              A ColorTransform object containing values that universally adjust
     *              the colors in the display object.
     *
     * @member {ColorTransform}
     * @public
     */
    get colorTransform ()
    {
        if (this._$colorTransform) {
            return this._$colorTransform._$clone();
        }

        const object = this
            ._$displayObject
            ._$getPlaceObject();

        if (object) {

            const buffer = object.colorTransform;
            const colorTransform = new ColorTransform();
            colorTransform._$colorTransform = Util.$getColorArray(
                buffer[0], buffer[1], buffer[2], buffer[3],
                buffer[4], buffer[5], buffer[6], buffer[7]
            );

            return colorTransform;
        }

        this._$transform();
        return this._$colorTransform._$clone();
    }
    set colorTransform (color_transform)
    {
        if (color_transform instanceof ColorTransform) {
            this._$transform(null, color_transform._$colorTransform);
        }
    }

    /**
     * @description この表示オブジェクトおよびルートレベルまでのすべての親オブジェクトに適用される、
     *              結合されたカラー変換を表す ColorTransform オブジェクトです。
     *              A ColorTransform object representing
     *              the combined color transformations applied to the display object
     *              and all of its parent objects, back to the root level.
     *
     * @member {ColorTransform}
     * @readonly
     * @public
     */
    get concatenatedColorTransform ()
    {
        let colorTransform = this._$rawColorTransform();

        let parent = this._$displayObject._$parent;
        while (parent) {

            colorTransform = Util.$multiplicationColor(
                parent._$transform._$rawColorTransform(),
                colorTransform
            );

            parent = parent._$parent;
        }

        return new ColorTransform(
            colorTransform[0], colorTransform[1], colorTransform[2], colorTransform[3],
            colorTransform[4], colorTransform[5], colorTransform[6], colorTransform[7]
        );
    }

    /**
     * @description この表示オブジェクトおよびルートレベルまでのそのすべての親オブジェクトの結合された
     *              変換マトリックスを表す Matrix オブジェクトです。
     *              A Matrix object representing the combined transformation matrixes
     *              of the display object and all of its parent objects, back to the root level.
     *
     * @member {Matrix}
     * @readonly
     * @public
     */
    concatenatedMatrix ()
    {
        let matrix = this._$rawMatrix();

        let parent = this._$displayObject._$parent;
        while (parent) {

            matrix = Util.$multiplicationMatrix(
                parent._$transform._$rawMatrix(),
                matrix
            );

            parent = parent._$parent;
        }

        return new Matrix(
            matrix[0], matrix[1], matrix[2],
            matrix[3], matrix[4] / 20, matrix[5] / 20
        );
    }

    /**
     * @description 表示オブジェクトの拡大 / 縮小、回転、および移動を変更する値を格納している
     *              Matrix オブジェクトです。
     *              A Matrix object containing values that alter the scaling,
     *              rotation, and translation of the display object.
     *
     * @member {Matrix}
     * @public
     */
    get matrix ()
    {
        if (this._$matrix) {
            return this._$matrix._$clone();
        }

        const object = this
            ._$displayObject
            ._$getPlaceObject();

        if (object) {

            const buffer = object.colorTransform;
            const matrix = new Matrix();
            matrix._$matrix = Util.$getColorArray(
                buffer[0], buffer[1], buffer[2],
                buffer[3], buffer[4], buffer[5]
            );

            return matrix;
        }

        this._$transform();
        return this._$matrix._$clone();
    }
    set matrix (matrix)
    {
        if (matrix instanceof Matrix) {
            this._$transform(matrix._$matrix, null);
        }
    }

    /**
     * @description ステージ上の表示オブジェクトの境界を示す矩形を定義する Transform オブジェクトです。
     *              A Transform object that defines the bounding rectangle of
     *              the display object on the stage.
     *
     * @member {Transform}
     * @readonly
     * @public
     */
    pixelBounds ()
    {
        const rectangle = new Rectangle(0, 0, 0, 0);

        if (!this._$displayObject) {
            return rectangle;
        }

        const bounds = this._$displayObject._$getBounds(null);

        rectangle._$x      = bounds.xMin;
        rectangle._$y      = bounds.yMin;
        rectangle._$width  = +Util.$abs(bounds.xMax - bounds.xMin);
        rectangle._$height = +Util.$abs(bounds.yMax - bounds.yMin);

        Util.$poolBoundsObject(bounds);

        return rectangle;
    }

    /**
     * matrix プロパティから取得される Matrix の Matrix._$matrix と同じ値を返しますが、matrix プロパティと異なり Matrix を複製しません。
     * 返される値は一時的に使用することのみできます。返される値の要素を直接更新してはいけません。返される値をプール（Util.$poolMatrixArray）してはいけません。
     *
     * @return {Float64Array}
     * @private
     */
    _$rawMatrix ()
    {
        if (this._$matrix !== null) {
            return this._$matrix._$matrix;
        }

        const placeObject = this._$displayObject._$getPlaceObject();
        if (placeObject) {
            return placeObject.matrix;
        }

        return Util.$MATRIX_ARRAY_IDENTITY;
    }

    /**
     * colorTransform プロパティから取得される ColorTransform の colorTransform._$colorTransform と同じ値を返しますが、colorTransform プロパティと異なり ColorTransform を複製しません。
     * 返される値は一時的に使用することのみできます。返される値の要素を直接更新してはいけません。返される値をプール（Util.$poolColorArray）してはいけません。
     *
     * @return {Float64Array}
     * @private
     */
    _$rawColorTransform ()
    {
        if (this._$colorTransform !== null) {
            return this._$colorTransform._$colorTransform;
        }

        const placeObject = this._$displayObject._$getPlaceObject();
        if (placeObject) {
            return placeObject.colorTransform;
        }

        return Util.$COLOR_ARRAY_IDENTITY;
    }

    /**
     * @param  {Float64Array} [matrix=null]
     * @param  {Float64Array} [color_transform=null]
     * @param  {array}        [filters=null]
     * @param  {string}       [blend_mode=""]
     * @return {void}
     * @method
     * @private
     */
    _$transform (matrix = null, color_transform = null, filters = null, blend_mode = "")
    {

        const object = this
            ._$displayObject
            ._$getPlaceObject();

        // Matrix
        this._$setMatrix(matrix, object);

        // ColorTransform
        this._$setColorTransform(color_transform, object);

        // Filter
        this._$setFilters(filters, object);

        // BlendMode
        this._$setBlendMode(blend_mode, object);

    }

    /**
     * @param {Float64Array} [matrix=null]
     * @param {object} [object=null]
     * @method
     * @private
     */
    _$setMatrix (matrix = null, object = null)
    {
        // Matrix
        if (!this._$matrix) {
            this._$matrix = new Matrix();
        }

        if (matrix) {

            Util.$poolMatrixArray(this._$matrix._$matrix);

            this
                ._$matrix
                ._$matrix = Util.$getMatrixArray(
                matrix[0], matrix[1], matrix[2],
                matrix[3], matrix[4], matrix[5]
            );

            this._$displayObject._$doChanged();
            Util.$isUpdated = true;

            return ;
        }


        if (object) {

            Util.$poolMatrixArray(this._$matrix._$matrix);

            const matrix = object.matrix;

            this
                ._$matrix
                ._$matrix = Util.$getMatrixArray(
                matrix[0], matrix[1], matrix[2],
                matrix[3], matrix[4], matrix[5]
            );

        }
    }

    /**
     * @param {Float64Array} [color_transform=null]
     * @param {object} [object=null]
     * @method
     * @private
     */
    _$setColorTransform (color_transform = null, object = null)
    {

        if (!this._$colorTransform) {
            this._$colorTransform = new ColorTransform();
        }

        if (color_transform) {

            Util.$poolColorArray(this._$colorTransform._$colorTransform);

            this
                ._$colorTransform
                ._$colorTransform = Util.$getColorArray(
                    color_transform[0], color_transform[1],
                    color_transform[2], color_transform[3],
                    color_transform[4], color_transform[5],
                    color_transform[6], color_transform[7]
                );

            this._$displayObject._$doChanged();
            Util.$isUpdated = true;

            return ;
        }

        if (object) {

            Util.$poolColorArray(this._$colorTransform._$colorTransform);

            const colorTransform = object.colorTransform;

            this
                ._$colorTransform
                ._$colorTransform = Util.$getColorArray(
                    colorTransform[0], colorTransform[1],
                    colorTransform[2], colorTransform[3],
                    colorTransform[4], colorTransform[5],
                    colorTransform[6], colorTransform[7]
                );

        }
    }

    /**
     * @param {array}  [filters=null]
     * @param {object} [object=null]
     * @method
     * @private
     */
    _$setFilters (filters = null, object = null)
    {

        if (Util.$isArray(filters)) {

            if (this._$filters) {
                Util.$poolArray(this._$filters);
            }

            this._$filters = filters.slice(0);

            this._$displayObject._$doChanged();
            Util.$isUpdated = true;

            return ;
        }

        if (this._$filters) {
            return ;
        }

        if (!object) {
            this._$filters = Util.$getArray();
            return ;
        }

        if (object.filters) {
            this._$filters = object.filters.slice(0);
            return ;
        }

        if (object.surfaceFilterList) {

            const filterList = Util.$getArray();

            const length = object.surfaceFilterList.length;
            for (let idx = 0; idx < length; ++idx) {

                const filter = object.surfaceFilterList[idx];

                const filterClass = next2d.filters[filter.class];

                filterList.push(
                    new (filterClass.bind.apply(filterClass, filter.params))()
                );

            }

            object.filters = filterList;
            this._$filters = filterList.slice(0);
        }

    }

    /**
     * @param {string} [blend_mode=""]
     * @param {object} [object=null]
     * @method
     * @private
     */
    _$setBlendMode (blend_mode = "", object = null)
    {
        if (blend_mode) {

            this._$blendMode = blend_mode;

            this._$displayObject._$doChanged();
            Util.$isUpdated = true;

            return ;
        }

        if (this._$blendMode) {
            return ;
        }

        this._$blendMode = (object)
            ? object.blendMode
            : BlendMode.NORMAL;

    }
}

/**
 * @class
 * @memberOf next2d.display
 */
class BlendMode
{
    /**
     * @constructor
     * @public
     */
    constructor() {}

    /**
     * @description 指定されたクラスのストリングを返します。
     *              Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default [class BlendMode]
     * @method
     * @static
     */
    static toString()
    {
        return "[class BlendMode]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return  {string}
     * @default next2d.display:BlendMode
     * @const
     * @static
     */
    static get namespace ()
    {
        return "next2d.display:BlendMode";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return  {string}
     * @default [object BlendMode]
     * @method
     * @public
     */
    toString ()
    {
        return "[object BlendMode]";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @return  {string}
     * @default next2d.display:BlendMode
     * @const
     * @static
     */
    get namespace ()
    {
        return "next2d.display:BlendMode";
    }

    /**
     * @description 表示オブジェクトの要素カラーの値を背景色に加算し、その際に上限 0xFF を適用します。
     *              Adds the values of the constituent colors of the display object
     *              to the colors of its background, applying a ceiling of 0xFF.
     *
     * @return  {string}
     * @default add
     * @const
     * @static
     */
    static get ADD ()
    {
        return "add";
    }

    /**
     * @description 表示オブジェクトの各ピクセルのアルファ値を背景に適用します。
     *              Applies the alpha value of each pixel of the display object to the background.
     *
     * @return  {string}
     * @default alpha
     * @const
     * @static
     */
    static get ALPHA ()
    {
        return "alpha";
    }

    /**
     * @description 表示オブジェクトの要素カラーと背景色のうち暗い方（値が小さい方）の色を選択します。
     *              Selects the darker of the constituent colors of the display object
     *              and the colors of the background (the colors with the smaller values).
     *
     * @return  {string}
     * @default darken
     * @const
     * @static
     */
    static get DARKEN ()
    {
        return "darken";
    }

    /**
     * @description 表示オブジェクトの要素カラーと背景色を比較し、2 つの要素カラーのうち明るい方の値から暗い方の値を差し引きます。
     *              Compares the constituent colors of the display object with the colors of its background,
     *              and subtracts the darker of the values of the two constituent colors from the lighter value.
     *
     * @return  {string}
     * @default difference
     * @const
     * @static
     */
    static get DIFFERENCE ()
    {
        return "difference";
    }

    /**
     * @description 表示オブジェクトのアルファ値に基づいて背景を消去します。
     *              Erases the background based on the alpha value of the display object.
     *
     * @return  {string}
     * @default erase
     * @const
     * @static
     */
    static get ERASE ()
    {
        return "erase";
    }

    /**
     * @description 表示オブジェクトの暗さに基づいて、各ピクセルの色を調整します。
     *              Adjusts the color of each pixel based on the darkness of the display object.
     *
     * @return  {string}
     * @default hardlight
     * @const
     * @static
     */
    static get HARDLIGHT ()
    {
        return "hardlight";
    }

    /**
     * @description 背景を反転します。
     *              Inverts the background.
     *
     * @return  {string}
     * @default invert
     * @const
     * @static
     */
    static get INVERT ()
    {
        return "invert";
    }

    /**
     * @description 表示オブジェクトに関する透明度グループを強制的に作成します。
     *              Forces the creation of a transparency group for the display object.
     *
     * @return  {string}
     * @default layer
     * @const
     * @static
     */
    static get LAYER ()
    {
        return "layer";
    }

    /**
     * @description 表示オブジェクトの要素カラーと背景色のうち明るい方（値が大きい方）の色を選択します。
     *              Selects the lighter of the constituent colors of the display object
     *              and the colors of the background (the colors with the larger values).
     *
     * @return  {string}
     * @default lighten
     * @const
     * @static
     */
    static get LIGHTEN ()
    {
        return "lighten";
    }

    /**
     * @description 表示オブジェクトの要素カラーの値と背景色の要素カラーの値を乗算した後、0xFF で割って正規化し、色を暗くします。
     *              Multiplies the values of the display object constituent colors by the constituent colors
     *              of the background color, and normalizes by dividing by 0xFF, resulting in darker colors.
     *
     * @return  {string}
     * @default multiply
     * @const
     * @static
     */
    static get MULTIPLY ()
    {
        return "multiply";
    }

    /**
     * @description 表示オブジェクトは、背景の前に表示されます。
     *              The display object appears in front of the background.
     *
     * @return  {string}
     * @default normal
     * @const
     * @static
     */
    static get NORMAL ()
    {
        return "normal";
    }

    /**
     * @description 背景の暗さに基づいて、各ピクセルの色を調整します。
     *              Adjusts the color of each pixel based on the darkness of the background.
     *
     * @return  {string}
     * @default overlay
     * @const
     * @static
     */
    static get OVERLAY ()
    {
        return "overlay";
    }

    /**
     * @description 表示オブジェクトの色の補数（逆）と背景色の補数を乗算して、ブリーチ効果を得ます。
     *              Multiplies the complement (inverse) of the display object color by the complement
     *              of the background color, resulting in a bleaching effect.
     *
     * @return  {string}
     * @default screen
     * @const
     * @static
     */
    static get SCREEN ()
    {
        return "screen";
    }

    /**
     * @description 結果の下限を 0 として、表示オブジェクトの要素カラーの値をその背景色の値から減算します。
     *              Subtracts the values of the constituent colors in the display object
     *              from the values of the background color, applying a floor of 0.
     *
     * @return  {string}
     * @default subtract
     * @const
     * @static
     */
    static get SUBTRACT ()
    {
        return "subtract";
    }
}
/**
 * @class
 * @memberOf next2d.display
 */
class DisplayObject extends EventDispatcher
{
    constructor()
    {
        super();

    }

    /**
     * @return {object}
     * @private
     */
    _$getPlaceObject ()
    {

    }

    /**
     * @return {object}
     * @private
     */
    _$getBounds ()
    {

    }

    /**
     * @return {object}
     * @private
     */
    _$doChanged ()
    {

    }
}
/**
 * @class
 * @memberOf next2d.display
 * @extends  InteractiveObject
 */
class DisplayObjectContainer extends InteractiveObject
{
    constructor()
    {
        super();

    }
}
/**
 * @class
 * @memberOf next2d.display
 * @extends  DisplayObject
 */
class InteractiveObject extends DisplayObject
{
    constructor()
    {
        super();

    }
}
/**
 * @class
 * @memberOf next2d.display
 * @extends  Sprite
 */
class MovieClip extends Sprite
{
    constructor()
    {
        super();

    }

}
/**
 * @class
 * @memberOf next2d.display
 * @extends  DisplayObjectContainer
 */
class Sprite extends DisplayObjectContainer
{
    constructor()
    {
        super();

    }
}
/**
 * @class
 */
class CacheStore
{
    /**
     * @constructor
     */
    constructor ()
    {
        // params
        this._$pool  = [];
        this._$store = Util.$getMap();
        this._$lives = Util.$getMap();

        // cache
        this._$lifeCount      = 2;
        this._$delayLifeCheck = this.lifeCheck.bind(this);

        this._$playerId = null;

        const timer = Util.$setTimeout;
        timer(this._$delayLifeCheck, 5000);
    }

    /**
     * @returns void
     * @public
     */
    reset ()
    {
        for (const [id, data] of this._$store) {

            for (const [type, value] of data) {

                this.destroy(value);

                this._$lives.delete(
                    this.generateLifeKey(id, type)
                );
            }

            Util.$poolMap(data);
        }

        this._$store.clear();
    }

    /**
     * @param   {CanvasRenderingContext2D|WebGLTexture} object
     * @returns void
     * @public
     */
    destroy (object)
    {
        if (!object) {
            return ;
        }

        switch (true) {

            case (object.constructor === Util.$WebGLTexture):
                const player = Util.$players[this._$playerId];
                if (player) {

                    // cache to buffer
                    if (object._$bitmapData) {
                        object._$bitmapData._$buffer = object._$bitmapData._$getPixels(
                            0, 0, object._$bitmapData.width, object._$bitmapData.height, "RGBA", size => new Util.$Uint8Array(size));
                        delete object._$bitmapData;
                    }

                    if (player._$context) {
                        player
                            ._$context
                            .frameBuffer
                            .releaseTexture(object);
                    }
                }
                break;

            case (object.constructor === Util.$CanvasRenderingContext2D):

                const canvas = object.canvas;
                const width  = canvas.width|0;
                const height = canvas.height|0;

                object.clearRect(0, 0, width + 1, height + 1);

                // canvas reset
                canvas.width = canvas.height = 1;

                // pool
                this._$pool[this._$pool.length] = canvas;
                break;

            case (typeof object === "object"):
                Util.$poolInstance(object);
                break;

            default:
                break;

        }
    }

    /**
     * @returns {HTMLCanvasElement}
     * @public
     */
    getCanvas ()
    {
        return this._$pool.pop() || Util.$document.createElement("canvas");
    }

    /**
     * @param   {string|number} id
     * @returns void
     * @public
     */
    removeCache (id)
    {
        id += "";
        if (this._$store.has(id)) {

            const data = this._$store.get(id);

            for (const [type, value] of data) {

                this.destroy(value);

                this._$lives.delete(
                    this.generateLifeKey(id, type)
                );
            }

            Util.$poolMap(data);
            this._$store.delete(id);
        }
    }

    /**
     * @param  {*} id
     * @param  {*} type
     * @return {string}
     */
    generateLifeKey (id, type)
    {
        return id + ":" + type;
    }

    /**
     * @param   {array} keys
     * @returns {*}
     * @public
     */
    get (keys)
    {
        const id   = keys[0] + "";
        const type = keys[1] + "";

        if (this._$store.has(id)) {

            const data = this._$store.get(id);

            if (data.has(type)) {

                const key = this.generateLifeKey(id, type);
                const lifeCount = this._$lives.get(key);

                if (lifeCount === 1) {
                    this._$lives.set(key, this._$lifeCount);
                }

                return data.get(type);
            }

        }

        return null;
    }

    /**
     * @param {array} keys
     * @param {*} value
     * @public
     */
    set (keys, value)
    {
        const id   = keys[0] + "";
        const type = keys[1] + "";

        // init
        if (!this._$store.has(id)) {
            this._$store.set(id, Util.$getMap());
        }

        // life key
        const key = this.generateLifeKey(id, type);

        const data = this._$store.get(id);

        if (!value) {

            data.delete(type);
            this._$lives.delete(key);

            if (!data.size) {
                Util.$poolMap(data);
                this._$store.delete(id);
            }

            return ;

        } else {
            const oldValue = data.get(type);
            if (oldValue && oldValue !== value) {
                console.log("TODO delete cache");
                //this.destroy(oldValue);
            }
        }

        // set cache
        data.set(type, value);

        // set life count
        this._$lives.set(key, this._$lifeCount);
    }

    /**
     * @param   {string|number} unique_key
     * @param   {array} matrix
     * @param   {array} [color=null]
     * @returns {array}
     * @public
     */
    generateShapeKeys (unique_key, matrix, color = null)
    {
        // to string
        unique_key = unique_key + "";

        const keys = Util.$getArray();
        keys[0] = unique_key;

        let str = "";
        str += matrix[0] + "_" + matrix[1] + "_" + matrix[2] + "_" + matrix[3];

        // color
        if (color && color.length === 8 && (
            color[0] !== 1 || color[1] !== 1 || color[2] !== 1 ||
            color[4] !== 0 || color[5] !== 0 || color[6] !== 0 || color[7] !== 0
        )) {
            str += color[0] +"_"+ color[1] +"_"+ color[2]
                +"_"+ color[4] +"_"+ color[5]
                +"_"+ color[6] +"_"+ color[7];
        }

        keys[1] = (str) ? this.generateHash(str) : "_0";

        return keys;

    }

    /**
     * @param   {string|number} unique_key
     * @param   {array} [matrix=null]
     * @param   {array} [color=null]
     * @returns {array}
     * @public
     */
    generateKeys (unique_key, matrix = null, color = null)
    {
        // to string
        unique_key = unique_key + "";

        const keys = Util.$getArray();
        keys[0] = unique_key;

        let str = "";
        if (matrix) {
            str += matrix[0] + "_" + matrix[1];
        }

        // color
        if (color && color.length === 8 && (
            color[0] !== 1 || color[1] !== 1 || color[2] !== 1 ||
            color[4] !== 0 || color[5] !== 0 || color[6] !== 0 || color[7] !== 0
        )) {
            str += "_"+ color[0] +"_"+ color[1] +"_"+ color[2]
                +"_"+ color[4] +"_"+ color[5] +"_"+ color[6] +"_"+ color[7];
        }

        keys[1] = (str) ? this.generateHash(str) : "_0";

        return keys;
    }

    /**
     * @param  {string} str
     * @return {string}
     */
    generateHash (str)
    {
        let hash = 0;
        const length = str.length;
        for (let idx = 0; idx < length; idx++) {
            const chr = str.charCodeAt(idx);

            hash  = ((hash << 5) - hash) + chr;
            hash |= 0;
        }
        return "_" + hash;
    }

    /**
     * @return void
     * @public
     */
    lifeCheck ()
    {
        for (const [id, data] of this._$store) {

            for (const [type, value] of data) {

                const key = this.generateLifeKey(id, type);
                const lifeCount = this._$lives.get(key) - 1;
                if (!lifeCount) {

                    // destroy
                    this.destroy(value);

                    // delete key
                    data.delete(type);

                    this._$lives.delete(key);

                    continue;
                }

                // update life count
                this._$lives.set(key, lifeCount);

            }

            // delete id
            if (!data.size) {
                Util.$poolMap(data);
                this._$store.delete(id);
            }

        }

        const timer = Util.$setTimeout;
        timer(this._$delayLifeCheck, 5000);
    }
}

/**
 * @class
 */
class Player
{
    /**
     * @constructor
     */
    constructor()
    {

    }

    /**
     * @return {void}
     * @method
     * @public
     */
    play ()
    {

    }

    /**
     * @return {void}
     * @method
     * @public
     */
    stop ()
    {

    }
}
/**
 * @class
 */
class Next2D
{
    /**
     * @constructor
     */
    constructor () {}

    /**
     * @param  {string} url
     * @param  {object} [options=null]
     * @return {void}
     * @method
     * @public
     */
    load (url, options)
    {
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    reset ()
    {
    }

    /**
     * @param  {uint}   [width=240]
     * @param  {uint}   [height=240]
     * @param  {uint}   [fps=60]
     * @param  {object} [options=null]
     * @return {MovieClip}
     * @method
     * @public
     */
    createRootMovieClip (width = 240, height = 240, fps = 60, options = null)
    {
    }
}

window.next2d = new Next2D();


        // output build version
        console.log("%c next2d.js %c 1.1614173220 %c https://next2d.app",
        "color: #fff; background: #5f5f5f",
        "color: #fff; background: #4bc729",
        "");

    })(window);
}