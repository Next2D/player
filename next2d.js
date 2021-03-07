/*!
 * licenses: MIT Licenses.
 * version: 1.1615127463
 * author: Toshiyuki Ienaga <ienaga@tvon.jp>
 * copyright: (c) 2020-2021 Toshiyuki Ienaga.
 */
if (!("next2d" in window)) {
    (function(window) {

"use strict";

/**
 * @type {number}
 */
let instanceId = 0;

/**
 * @type {number}
 */
let packageId  = 0;

/**
 * @type {number}
 */
let programId  = 0;

/**
 * @description Global Object
 * @type {object}
 */
const Util = {};


/**
 * @type {number}
 * @const
 * @static
 */
Util.$TWIPS = 20;

/**
 * @type {string}
 * @const
 * @static
 */
Util.$PREFIX = "__next2d__";

/**
 * @type {number}
 * @const
 * @static
 */
Util.$MAX_VALUE = window.Number.MAX_VALUE;

/**
 * @type {number}
 * @const
 * @static
 */
Util.$MIN_VALUE = window.Number.MIN_VALUE;

/**
 * @type {number}
 * @const
 * @static
 */
Util.$HIGH_SAMPLES = 4;

/**
 * @type {number}
 * @const
 * @static
 */
Util.$MEDIUM_SAMPLES = 2;

/**
 * @type {number}
 * @const
 * @static
 */
Util.$LOW_SAMPLES = 0;

/**
 * @type {number}
 * @const
 * @static
 */
Util.$LOAD_START = "loadstart";

/**
 * @type {number}
 * @const
 * @static
 */
Util.$PROGRESS = "progress";

/**
 * @type {number}
 * @const
 * @static
 */
Util.$LOADEND = "loadend";

/**
 * @type {number}
 * @const
 * @static
 */
Util.$TOUCH_START = "touchstart";

/**
 * @type {number}
 * @const
 * @static
 */
Util.$TOUCH_MOVE = "touchmove";

/**
 * @type {number}
 * @const
 * @static
 */
Util.$TOUCH_END = "touchend";

/**
 * @type {number}
 * @const
 * @static
 */
Util.$MOUSE_DOWN = "mousedown";

/**
 * @type {number}
 * @const
 * @static
 */
Util.$MOUSE_MOVE = "mousemove";

/**
 * @type {number}
 * @const
 * @static
 */
Util.$MOUSE_UP = "mouseup";

/**
 * @type {number}
 * @const
 * @static
 */
Util.$MOUSE_WHEEL = "wheel";

/**
 * @type {number}
 * @const
 * @static
 */
Util.$DOUBLE_CLICK = "dblclick";

/**
 * @type {number}
 * @const
 * @static
 */
Util.$MOUSE_LEAVE = "mouseleave";

/**
 * @type {number}
 * @const
 * @static
 */
Util.$KEY_DOWN = "keydown";

/**
 * @type {number}
 * @const
 * @static
 */
Util.$KEY_UP = "keyup";

/**
 * @type {number}
 * @const
 * @static
 */
Util.$SCROLL = "scroll";

/**
 * @type {Float32Array}
 * @const
 * @static
 */
Util.$MATRIX_ARRAY_IDENTITY = new Float32Array([1, 0, 0, 1, 0, 0]);

/**
 * @type {Float32Array}
 * @const
 * @static
 */
Util.$MATRIX_ARRAY_20_0_0_20_0_0 = new Float32Array([Util.$TWIPS, 0, 0, Util.$TWIPS, 0, 0]);

/**
 * @type {Float32Array}
 * @const
 * @static
 */
Util.$MATRIX_ARRAY_20_0_0_20_0_0_INVERSE = new Float32Array([0.05, 0, 0, 0.05, 0, 0]);

/**
 * @type {Float32Array}
 * @const
 * @static
 */
Util.$MATRIX_ARRAY_RATIO_0_0_RATIO_0_0 = new Float32Array([
    Util.$TWIPS / Util.$devicePixelRatio, 0, 0,
    Util.$TWIPS / Util.$devicePixelRatio, 0, 0
]);

/**
 * @type {Float32Array}
 * @const
 * @static
 */
Util.$MATRIX_ARRAY_RATIO_0_0_RATIO_0_0_INVERSE = new Float32Array([
    1 / Util.$TWIPS * Util.$devicePixelRatio, 0, 0,
    1 / Util.$TWIPS * Util.$devicePixelRatio, 0, 0
]);

/**
 * @type {Float32Array}
 * @const
 * @static
 */
Util.$COLOR_ARRAY_IDENTITY = new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);


/**
 * @shortcut
 * @type {Window}
 * @const
 * @static
 */
Util.$window = window;

/**
 * @shortcut
 * @type {Document}
 * @const
 * @static
 */
Util.$document = window.document;

/**
 * @shortcut
 * @type {Navigator}
 * @const
 * @static
 */
Util.$navigator = window.navigator;

/**
 * @shortcut
 * @type {string}
 * @const
 * @static
 */
Util.$userAgent = window.navigator.userAgent;

/**
 * @shortcut
 * @type {Location}
 * @const
 * @static
 */
Util.$location = window.location;

/**
 * @shortcut
 * @type {function}
 * @const
 * @static
 */
Util.$isNaN = window.isNaN;

/**
 * @shortcut
 * @type {function}
 * @const
 * @static
 */
Util.$min = Math.min;

/**
 * @shortcut
 * @type {function}
 * @const
 * @static
 */
Util.$max = Math.max;

/**
 * @shortcut
 * @type {function}
 * @const
 * @static
 */
Util.$sin = Math.sin;

/**
 * @shortcut
 * @type {function}
 * @const
 * @static
 */
Util.$cos = Math.cos;

/**
 * @shortcut
 * @type {function}
 * @const
 * @static
 */
Util.$tan = Math.tan;

/**
 * @shortcut
 * @type {function}
 * @const
 * @static
 */
Util.$sqrt = Math.sqrt;

/**
 * @shortcut
 * @type {function}
 * @const
 * @static
 */
Util.$pow = Math.pow;

/**
 * @shortcut
 * @type {function}
 * @const
 * @static
 */
Util.$abs = Math.abs;

/**
 * @shortcut
 * @type {function}
 * @const
 * @static
 */
Util.$atan2 = Math.atan2;

/**
 * @shortcut
 * @type {function}
 * @const
 * @static
 */
Util.$floor = Math.floor;

/**
 * @shortcut
 * @type {number}
 * @const
 * @static
 */
Util.$SQRT2 = Math.SQRT2;

/**
 * @shortcut
 * @type {number}
 * @const
 * @static
 */
Util.$PI = Math.PI;

/**
 * @shortcut
 * @type {number}
 * @const
 * @static
 */
Util.$Deg2Rad = Util.$PI / 180;

/**
 * @shortcut
 * @type {number}
 * @const
 * @static
 */
Util.$Rad2Deg = 180 / Util.$PI;

/**
 * @shortcut
 * @type {ArrayConstructor}
 * @const
 * @static
 */
Util.$Array = window.Array;

/**
 * @shortcut
 * @type {MapConstructor}
 * @const
 * @static
 */
Util.$Map = window.Map;

/**
 * @shortcut
 * @type {function}
 * @const
 * @static
 */
Util.$setTimeout = window.setTimeout;

/**
 * @shortcut
 * @type {function}
 * @const
 * @static
 */
Util.$encodeURIComponent = window.encodeURIComponent;

/**
 * @shortcut
 * @type {number}
 * @const
 * @static
 */
Util.$Infinity = window.Infinity;

/**
 * @shortcut
 * @type {function}
 * @const
 * @static
 */
Util.$WebGLTexture = window.WebGLTexture;

/**
 * @shortcut
 * @type {function}
 * @const
 * @static
 */
Util.$clearTimeout = window.clearTimeout;

/**
 * @shortcut
 * @type {function}
 * @const
 * @static
 */
Util.$setTimeout = window.setTimeout;

/**
 * @type {AudioContext}
 * @static
 */
Util.$audioContext = null;

/**
 * @shortcut
 * @type {function}
 * @const
 * @static
 */
Util.$CanvasRenderingContext2D = window.CanvasRenderingContext2D;

/**
 * @shortcut
 * @type {function}
 * @const
 * @static
 */
Util.$requestAnimationFrame = window.requestAnimationFrame;

/**
 * @shortcut
 * @type {function}
 * @const
 * @static
 */
Util.$cancelAnimationFrame = window.cancelAnimationFrame;

/**
 * @shortcut
 * @type {function}
 * @const
 * @static
 */
Util.$performance = window.performance;


/**
 * 現在稼働中のPlayer ID
 * Currently running Player ID
 *
 * @type {number}
 * @default 0
 * @static
 */
Util.$currentPlayerId  = 0;

/**
 * @type {boolean}
 * @default false
 * @static
 */
Util.$isUpdated = false;

/**
 * @type {window.Event|null}
 * @default null
 * @static
 */
Util.$event = null;

/**
 * @type {DisplayObject|null}
 * @default null
 * @static
 */
Util.$dropTarget = null;

/**
 * @type {{bounds: null, lock: boolean, position: {x: number, y: number}}}
 * @const
 * @static
 */
Util.$dragRules = {
    "lock": false,
    "position": {
        "x": 0,
        "y": 0
    },
    "bounds": null
};

/**
 * @type {number}
 * @const
 * @static
 */
Util.$devicePixelRatio = Util.$min(2, window.devicePixelRatio);

/**
 * Player Object を格納
 * Stores the Player Object
 *
 * @type {Player[]}
 * @const
 * @static
 */
Util.$players = [];

/**
 * LoaderInfo Object を格納
 * Stores the LoaderInfo Object.
 *
 * @type {LoaderInfo[]}
 * @const
 * @static
 */
Util.$loaderInfos = [];

/**
 * 使用済みになったbounds Objectをプール
 * Pool bounds objects that are no longer in use.
 *
 * @type {object[]}
 * @const
 * @static
 */
Util.$bounds = [];

/**
 * 使用済みになったArray Objectをプール
 * Pool Array objects that are no longer in use.
 *
 * @type {array[]}
 * @const
 * @static
 */
Util.$arrays = [];

/**
 * @type {Sound[]}
 * @const
 * @static
 */
Util.$audios = [];

/**
 * 使用済みになったMap Objectをプール
 * Pool Map objects that are no longer in use.
 *
 * @type {Map[]}
 * @const
 * @static
 */
Util.$maps = [];

/**
 * 使用済みになったMatrix Objectをプール
 * Pool Matrix objects that are no longer in use.
 *
 * @type {Matrix[]}
 * @const
 * @static
 */
Util.$matrices = [];

/**
 * 使用済みになったColorTransform Objectをプール
 * Pool ColorTransform objects that are no longer in use.
 *
 * @type {ColorTransform[]}
 * @const
 * @static
 */
Util.$colors = [];

/**
 * 使用済みになったFloat32Arrayをプール
 * Pool used Float32Array.
 *
 * @type {Map}
 * @const
 * @static
 */
Util.$float32Array = new Map();

/**
 * @type {boolean}
 * @const
 * @static
 */
Util.$isAndroid = (Util.$userAgent.indexOf("Android") > -1);

/**
 * @type {boolean}
 * @const
 * @static
 */
Util.isiOS = (Util.$userAgent.indexOf("iPhone") > -1 || Util.$userAgent.indexOf("iPod") > -1);

/**
 * @type {boolean}
 * @const
 * @static
 */
Util.$isTouch = (Util.$isAndroid || Util.isiOS);

/**
 * @type {boolean}
 * @const
 * @static
 */
Util.$isChrome = (Util.$userAgent.indexOf("Chrome") > -1);

/**
 * @type {boolean}
 * @const
 * @static
 */
Util.$isFireFox = (Util.$userAgent.indexOf("Firefox") > -1);

/**
 * @type {boolean}
 * @const
 * @static
 */
Util.$isSafari = (Util.$userAgent.indexOf("Safari") > -1);

/**
 * @type {boolean}
 * @const
 * @static
 */
Util.$isEdge = (Util.$userAgent.indexOf("Edge") > -1);

/**
 * @type {boolean}
 * @const
 * @static
 */
Util.$isMac = (Util.$userAgent.indexOf("Mac") > -1);

/**
 * @type {boolean}
 * @const
 * @static
 */
Util.$isWindows = (Util.$isMac === false);


/**
 * @type {HTMLCanvasElement}
 * @const
 */
const hitCanvas  = window.document.createElement("canvas");
hitCanvas.width  = 1;
hitCanvas.height = 1;

/**
 * @type {CanvasRenderingContext2D}
 * @const
 * @static
 */
Util.$hitContext = hitCanvas.getContext("2d");
Util.$hitContext.globalAlpha = 0;
Util.$hitContext.imageSmoothingEnabled = false;

/**
 * @param  {*} source
 * @return {boolean}
 * @method
 * @static
 */
Util.$isArray = function (source)
{
    return Util.$Array.isArray(source);
};

/**
 * @return {array}
 * @method
 * @static
 */
Util.$getArray = function ()
{
    const array = Util.$arrays.pop() || [];
    if (arguments.length) {
        array.push.apply(array, arguments);
    }
    return array;
}

/**
 * @param  {array} array
 * @return {void}
 * @method
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
 * @method
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
 * @param   {Float32Array} a
 * @param   {Float32Array} b
 * @returns {Float32Array}
 * @method
 * @static
 */
Util.$multiplicationColor = function (a, b)
{
    if (a === Util.$COLOR_ARRAY_IDENTITY
        && b === Util.$COLOR_ARRAY_IDENTITY
    ) {
        return Util.$COLOR_ARRAY_IDENTITY;
    }

    return Util.$getFloat32Array(
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
 * @param   {Float32Array} a
 * @param   {Float32Array} b
 * @returns {Float32Array}
 * @static
 */
Util.$multiplicationMatrix = function(a, b)
{
    if (a === Util.$MATRIX_ARRAY_IDENTITY
        && b === Util.$MATRIX_ARRAY_IDENTITY
    ) {
        return Util.$MATRIX_ARRAY_IDENTITY;
    }

    return Util.$getFloat32Array(
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
 * @method
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
 * @method
 * @static
 */
Util.$poolBoundsObject = function (bounds)
{
    Util.$bounds.push(bounds);
};

/**
 * @param  {Map} map
 * @return void
 * @method
 * @static
 */
Util.$poolMap = function (map)
{
    if (map.size) {
        map.clear();
    }
    Util.$maps.push(map);
};

/**
 * @return {Map}
 * @method
 * @static
 */
Util.$getMap = function ()
{
    return Util.$maps.pop() || new Util.$Map();
};

/**
 * @return {Float32Array}
 * @method
 * @static
 */
Util.$getFloat32Array = function ()
{
    const length = arguments.length;
    if (!Util.$float32Array.has(length)) {
        Util.$float32Array.set(length, Util.$getArray());
    }

    let array = Util.$float32Array.get(length).pop();
    if (!array) {
        array = new Float32Array(length);
    }

    for (let idx = 0; idx < length; ++idx) {
        array[idx] = arguments[idx];
    }

    return array;
}

/**
 * @param  {Float32Array} array
 * @return {void}
 * @method
 * @static
 */
Util.$poolFloat32Array = function (array)
{
    const length = array.length;
    if (!length) {
        return ;
    }

    if (!Util.$float32Array.has(length)) {
        Util.$float32Array.set(length, Util.$getArray());
    }

    Util.$float32Array.get(length).push(array);
}

/**
 * @return {Player}
 * @method
 * @static
 */
Util.$currentPlayer = function ()
{
    return Util.$players[Util.$currentPlayerId];
}

/**
 * @return {Point}
 * @method
 * @static
 */
Util.$currentMousePoint = function ()
{
    // setup
    const player = Util.$currentPlayer();

    let x = Util.$window.pageXOffset;
    let y = Util.$window.pageYOffset;

    const div = Util.$document.getElementById(player.contentElementId);
    if (div) {
        const rect = div.getBoundingClientRect();
        x += rect.left;
        y += rect.top;
    }

    let touchX = 0;
    let touchY = 0;

    switch (true) {

        case (Util.$isTouch):
            const changedTouche = Util.$event.changedTouches[0];
            touchX = changedTouche.pageX;
            touchY = changedTouche.pageY;
            break;

        default:
            touchX = Util.$event.pageX;
            touchY = Util.$event.pageY;
            break;

    }

    const pointX = ((touchX - x) / player._$scale)|0;
    const pointY = ((touchY - y) / player._$scale)|0;

    return new Point(pointX, pointY);
};

/**
 * @param  {object} bounds
 * @param  {Float32Array} matrix
 * @return {object}
 * @method
 * @static
 */
Util.$boundsMatrix = function (bounds, matrix)
{
    const x0 = bounds.xMax * matrix[0] + bounds.yMax * matrix[2] + matrix[4];
    const x1 = bounds.xMax * matrix[0] + bounds.yMin * matrix[2] + matrix[4];
    const x2 = bounds.xMin * matrix[0] + bounds.yMax * matrix[2] + matrix[4];
    const x3 = bounds.xMin * matrix[0] + bounds.yMin * matrix[2] + matrix[4];
    const y0 = bounds.xMax * matrix[1] + bounds.yMax * matrix[3] + matrix[5];
    const y1 = bounds.xMax * matrix[1] + bounds.yMin * matrix[3] + matrix[5];
    const y2 = bounds.xMin * matrix[1] + bounds.yMax * matrix[3] + matrix[5];
    const y3 = bounds.xMin * matrix[1] + bounds.yMin * matrix[3] + matrix[5];

    const no   = Util.$MAX_VALUE;
    const xMin = Util.$min(Util.$min(Util.$min(Util.$min( no, x0), x1), x2), x3);
    const xMax = Util.$max(Util.$max(Util.$max(Util.$max(-no, x0), x1), x2), x3);
    const yMin = Util.$min(Util.$min(Util.$min(Util.$min( no, y0), y1), y2), y3);
    const yMax = Util.$max(Util.$max(Util.$max(Util.$max(-no, y0), y1), y2), y3);

    return Util.$getBoundsObject(xMin, xMax, yMin, yMax);
};

/**
 * @param  {number} [a=1]
 * @param  {number} [b=0]
 * @param  {number} [c=0]
 * @param  {number} [d=1]
 * @param  {number} [tx=0]
 * @param  {number} [ty=0]
 * @return {Matrix}
 */
Util.$getMatrix = function (a = 1, b = 0, c = 0, d = 1, tx = 0, ty = 0)
{
    if (Util.$matrices.length) {
        const matrix = Util.$matrices.pop();
        matrix._$matrix = Util.$getFloat32Array(a, b, c, d, tx, ty);
    }
    return new Matrix(a, b, c, d, tx / Util.$TWIPS, ty / Util.$TWIPS);
}

/**
 * @param  {Matrix} matrix
 * @return {void}
 * @method
 * @static
 */
Util.$poolMatrix = function (matrix)
{
    Util.$poolFloat32Array(matrix._$matrix);
    matrix._$matrix = null;
    Util.$matrices.push(matrix);
}

/**
 * @param  {number} [red_multiplier=1]
 * @param  {number} [green_multiplier=1]
 * @param  {number} [blue_multiplier=1]
 * @param  {number} [alpha_multiplier=1]
 * @param  {number} [red_offset=0]
 * @param  {number} [green_offset=0]
 * @param  {number} [blue_offset=0]
 * @param  {number} [alpha_offset=0]
 * @return {ColorTransform}
 */
Util.$getColorTransform = function (
    red_multiplier = 1, green_multiplier = 1, blue_multiplier = 1, alpha_multiplier = 1,
    red_offset = 0, green_offset = 0, blue_offset = 0, alpha_offset = 0
) {

    if (Util.$colors.length) {
        const colorTransform = Util.$colors.pop();
        colorTransform._$colorTransform = Util.$getFloat32Array(
            red_multiplier, green_multiplier, blue_multiplier, alpha_multiplier,
            red_offset, green_offset, blue_offset, alpha_offset
        );
    }

    return new ColorTransform(
        red_multiplier, green_multiplier, blue_multiplier, alpha_multiplier,
        red_offset, green_offset, blue_offset, alpha_offset
    );
}

/**
 * @param  {ColorTransform} color_transform
 * @return {void}
 * @method
 * @static
 */
Util.$poolColorTransform = function (color_transform)
{
    Util.$poolFloat32Array(color_transform._$colorTransform);
    color_transform._$colorTransform = null;
    Util.$colors.push(color_transform);
}

/**
 * @param   {number|string} rgb
 * @returns {number}
 * @method
 * @static
 */
Util.$toColorInt = function (rgb)
{
    return (typeof rgb === "number") ? rgb : this.$colorStringToInt(rgb);
};

/**
 * @param   {string} str
 * @returns {number}
 * @method
 * @static
 */
Util.$colorStringToInt = function(str)
{
    Util.$hitContext.fillStyle = str;
    const color = Util.$hitContext.fillStyle.substr(1);

    // reset
    Util.$hitContext.fillStyle = "rgba(0, 0, 0, 1)";

    return `0x${color}`|0;
};

/**
 * @param  {number} uint
 * @return {object}
 * @method
 * @static
 */
Util.$uintToRGBA = function (uint)
{
    return {
        "A": uint >>> 24,
        "R": (uint & 0x00ff0000) >> 16,
        "G": (uint & 0x0000ff00) >> 8,
        "B": (uint & 0x000000ff)
    };
};


/**
 * @param   {number} color
 * @param   {number} [alpha=1]
 * @returns {{R: number, G: number, B: number, A: number}}
 * @method
 * @static
 */
Util.$intToRGBA = function (color, alpha = 1)
{
    return {
        "R": (color & 0xff0000) >> 16,
        "G": (color & 0x00ff00) >> 8,
        "B": (color & 0x0000ff),
        "A": (alpha * 255)
    };
};

/**
 * @return {CacheStore}
 * @method
 * @static
 */
Util.$cacheStore = function ()
{
    return Util.$currentPlayer()._$cacheStore;
};

/**
 * @param   {Float32Array} m
 * @returns {Float32Array}
 * @method
 * @static
 */
Util.$inverseMatrix = function(m)
{
    const rdet = 1 / (m[0] * m[4] - m[3] * m[1]);
    const tx  = m[3] * m[7] - m[4] * m[6];
    const ty  = m[1] * m[6] - m[0] * m[7];

    return Util.$getFloat32Array(
        m[4] * rdet,  -m[1] * rdet, 0,
        -m[3] * rdet,  m[0] * rdet, 0,
        tx * rdet, ty * rdet, 1
    );
};

/**
 * @return {void}
 * @method
 * @static
 */
Util.$decodeAudioFailed = function ()
{
    const buffer = new Util.$Uint8Array(this._$data);

    let idx = 0;
    while (true) {

        idx = buffer.indexOf(0xff, idx);

        if (idx === -1 || ((buffer[idx + 1] & 0xe0) === 0xe0)) {
            break;
        }

        ++idx;

    }

    if (idx > -1) {

        Util
            .$audioContext
            .decodeAudioData(
                buffer.buffer.slice(idx),
                Util.$decodeAudioSuccess.bind(this)
            );

    }
}

/**
 * @param  {Uint8Array} data
 * @return {void}
 * @method
 * @static
 */
Util.$decodeAudioSuccess = function (data)
{
    this._$buffer = data;
    this._$data   = null;
}

/**
 * @return {void}
 * @method
 * @static
 */
Util.$loadAudioData = function ()
{

    // create AudioContext
    if (!Util.$audioContext) {

        Util.$audioContext = new Util.$window.AudioContext();
        Util.$audioContext.resume();

    }

    if (Util.$audioContext) {

        const length = Util.$audios.length;
        for (let idx = 0; idx < length; ++idx) {

            const sound = Util.$audios[idx];

            if (!sound._$data.length) {
                return ;
            }

            // const buffer = new Util.$Uint8Array(sound._$data);

            Util
                .$audioContext
                .decodeAudioData(
                    sound._$data.buffer,
                    Util.$decodeAudioSuccess.bind(sound),
                    Util.$decodeAudioFailed.bind(sound)
                );

        }

        // reset
        Util.$audios.length = 0;
    }

};

/**
 * @type {number}
 * @static
 */
Util.$resizeTimerId = 0;

/**
 * @return {void}
 * @method
 * @static
 */
Util.$resize = function ()
{
    const clearTimer = Util.$clearTimeout;
    clearTimer(Util.$resizeTimerId);

    const timer = Util.$setTimeout;
    Util.$resizeTimerId = timer(Util.$resizeExecute, 300);
};

/**
 * @return {void}
 * @method
 * @static
 */
Util.$resizeExecute = function ()
{
    const length = Util.$players.length;
    for (let idx = 0; idx < length; ++idx) {

        const player = Util.$players[idx];
        if (!player) {
            continue;
        }

        if (player._$loadStatus === 4) {
            player._$resize();
        }

    }
};

/**
 * @param  {CanvasToWebGLContext} context
 * @return {void}
 * @method
 * @static
 */
Util.$resetContext = function (context)
{
    // reset color
    context._$contextStyle._$fillStyle[0] = 1;
    context._$contextStyle._$fillStyle[1] = 1;
    context._$contextStyle._$fillStyle[2] = 1;
    context._$contextStyle._$fillStyle[3] = 1;

    context._$contextStyle._$strokeStyle[0] = 1;
    context._$contextStyle._$strokeStyle[1] = 1;
    context._$contextStyle._$strokeStyle[2] = 1;
    context._$contextStyle._$strokeStyle[3] = 1;

    // reset
    context._$style                    = context._$contextStyle;
    context._$globalAlpha              = 1;
    context._$globalCompositeOperation = BlendMode.NORMAL;
    context._$imageSmoothingEnabled    = false;
}








/**
 * @param  {Next2D} object
 * @return {void}
 * @method
 * @static
 */
Util.$packages = function (object)
{
    object["display"] = {
        "Bitmap": Bitmap,
        "BitmapData": BitmapData,
        "BitmapDataChannel": BitmapDataChannel,
        "BlendMode": BlendMode,
        "CapsStyle": CapsStyle,
        "DisplayObject": DisplayObject,
        "DisplayObjectContainer": DisplayObjectContainer,
        "FrameLabel": FrameLabel,
        "GradientType": GradientType,
        "Graphics": Graphics,
        "InteractiveObject": InteractiveObject,
        "InterpolationMethod": InterpolationMethod,
        "JointStyle": JointStyle,
        "Loader": Loader,
        "LoaderInfo": LoaderInfo,
        "MovieClip": MovieClip,
        "Shape": Shape,
        "SimpleButton": SimpleButton,
        "SpreadMethod": SpreadMethod,
        "Sprite": Sprite,
        "Stage": Stage
    };

    object["events"] = {
        "Event": Event,
        "EventDispatcher": EventDispatcher,
        "EventPhase": EventPhase
    };

    object["filters"] = {
    };

    object["geom"] = {
        "ColorTransform": ColorTransform,
        "Matrix": Matrix,
        "Point": Point,
        "Rectangle": Rectangle,
        "Transform": Transform
    };

    object["media"] = {
        "Sound": Sound,
        "SoundTransform": SoundTransform
    };

    object["net"] = {
        "URLRequest": URLRequest,
        "URLRequestHeader": URLRequestHeader,
        "URLRequestMethod": URLRequestMethod,
    };

    object["text"] = {
        "TextField": TextField,
        "TextFormat": TextFormat
    };
}
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
     * @param {string}  type
     * @param {boolean} [bubbles=false]
     * @param {boolean} [cancelable=false]
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
        /**
         * @type {string}
         * @private
         */
        this._$type = `${type}`;

        /**
         * @type {boolean}
         * @private
         */
        this._$bubbles = bubbles;

        /**
         * @type {boolean}
         * @private
         */
        this._$cancelable = cancelable;

        /**
         * @type {object|null}
         * @private
         */
        this._$target = null;

        /**
         * @type {object|null}
         * @private
         */
        this._$currentTarget = null;

        /**
         * @type    {number}
         * @default EventPhase.AT_TARGET
         * @private
         */
        this._$eventPhase = EventPhase.AT_TARGET;

        /**
         * @type {boolean}
         * @private
         */
        this._$stopImmediatePropagation = false;

        /**
         * @type {boolean}
         * @private
         */
        this._$stopPropagation = false;

        /**
         * @type {boolean}
         * @private
         */
        this._$preventDefault = false;
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
     * @description Event.FRAME_LABEL 定数は、frameLabel イベントオブジェクトの type プロパティの値を定義します。
     *              The Event.FRAME_LABEL constant defines the value
     *              of the type property of an frameLabel event object.
     *
     * @return  {string}
     * @default frameLabel
     * @const
     * @static
     */
    static get FRAME_LABEL ()
    {
        return "frameLabel";
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
     * @return {string}
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
     * @return {string}
     * @default render
     * @const
     * @static
     */
    static get SOUND_COMPLETE ()
    {
        return "soundComplete";
    }

    /**
     * @description イベントがバブリングイベントかどうかを示します。
     *              Indicates whether an event is a bubbling event.
     *
     * @member {boolean}
     * @readonly
     * @public
     */
    get bubbles ()
    {
        return this._$bubbles;
    }

    /**
     * @description イベントに関連付けられた動作を回避できるかどうかを示します。
     *              Indicates whether the behavior associated
     *              with the event can be prevented.
     *
     * @member {boolean}
     * @readonly
     * @public
     */
    get cancelable ()
    {
        return this._$cancelable;
    }

    /**
     * @description イベントリスナーで Event オブジェクトをアクティブに処理しているオブジェクトです。
     *              The object that is actively processing the Event object
     *              with an event listener.
     *
     * @member {object}
     * @readonly
     * @public
     */
    get currentTarget ()
    {
        return this._$currentTarget;
    }

    /**
     * @description イベントフローの現在の段階です。
     *              The current phase in the event flow.
     *
     * @member {number}
     * @readonly
     * @public
     */
    get eventPhase ()
    {
        return this._$eventPhase;
    }

    /**
     * @description イベントターゲットです。
     *              The event target.
     *
     * @member {object}
     * @readonly
     * @public
     */
    get target ()
    {
        return (this._$target) ? this._$target : this._$currentTarget;
    }

    /**
     * @description イベントのタイプです。
     *              The type of event.
     *
     * @member {string}
     * @readonly
     * @public
     */
    get type ()
    {
        return this._$type;
    }

    /**
     * @description カスタム ActionScript 3.0 Event クラスに
     *              toString() メソッドを実装するためのユーティリティ関数です。
     *              A utility function for implementing the toString() method
     *              in custom ActionScript 3.0 Event classes.
     *
     * @return {string}
     * @method
     * @public
     */
    formatToString ()
    {
        let str = `[${arguments[0]}`;

        for (let idx = 1; idx < arguments.length; ++idx) {

            const name = arguments[idx];

            str += ` ${name}=`;

            const value = this[name];
            if (typeof value === "string") {
                str += `"${value}"`;
            } else {
                str += `${value}`;
            }

        }

        return `${str}]`;
    }

    /**
     * @description イベントで preventDefault() メソッドが呼び出されたかどうかを確認します。
     *              Checks whether the preventDefault() method has been called on the event.
     *
     * @return {boolean}
     * @method
     * @public
     */
    isDefaultPrevented ()
    {
        return (Util.$event) ? Util.$event.defaultPrevented : false;
    }

    /**
     * @description イベントのデフォルト動作をキャンセルできる場合に、その動作をキャンセルします。
     *              Cancels an event's default behavior if that behavior can be canceled.
     *
     * @return {void}
     * @method
     * @public
     */
    preventDefault ()
    {
        this._$preventDefault = true;
    }

    /**
     * @description イベントフローの現在のノードおよび後続するノードで、
     *              イベントリスナーが処理されないようにします。
     *              Prevents processing of any event listeners in the current node
     *              and any subsequent nodes in the event flow.
     *
     * @return {void}
     * @method
     * @public
     */
    stopImmediatePropagation ()
    {
        this._$stopImmediatePropagation = true;
    }

    /**
     * @description イベントフローの現在のノードに後続するノードで
     *              イベントリスナーが処理されないようにします。
     *              Prevents processing of any event listeners in nodes subsequent
     *              to the current node in the event flow.
     *
     * @return {void}
     * @method
     * @public
     */
    stopPropagation ()
    {
        this._$stopPropagation = true;
    }
}
/**
 * @class
 * @memberOf next2d.events
 */
class EventDispatcher
{
    /**
     * EventDispatcher クラスは、イベントを送出するすべてのクラスの基本クラスです。
     * The EventDispatcher class is the base class for all classes that dispatch events.
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
        /**
         * @type {Map}
         * @private
         */
        this._$events = Util.$getMap();
    }

    /**
     * 指定されたクラスのストリングを返します。
     * Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default [class EventDispatcher]
     * @method
     * @static
     */
    static toString()
    {
        return "[class EventDispatcher]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @member  {string}
     * @default next2d.events:EventDispatcher
     * @const
     * @static
     */
    static get namespace ()
    {
        return "next2d.events:EventDispatcher";
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
        return "[object EventDispatcher]";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @member  {string}
     * @default next2d.events:EventDispatcher
     * @const
     * @public
     */
    get namespace ()
    {
        return "next2d.events:EventDispatcher";
    }

    /**
     * @description イベントリスナーオブジェクトを EventDispatcher オブジェクトに登録し、
     *              リスナーがイベントの通知を受け取るようにします。
     *              Registers an event listener object with an EventDispatcher object
     *              so that the listener receives notification of an event.
     *
     * @param  {string}   type
     * @param  {function} listener
     * @param  {boolean}  [use_capture=false]
     * @param  {number}   [priority=0]
     * @return {void}
     * @method
     * @public
     */
    addEventListener (type, listener, use_capture = false, priority = 0)
    {

        let events,
            player,
            isBroadcast = false;

        type = `${type}`;
        switch (type) {

            // broadcast event
            case Event.ENTER_FRAME:
            case Event.EXIT_FRAME:
            case Event.FRAME_CONSTRUCTED:
            case Event.RENDER:
            case Event.ACTIVATE:
            case Event.DEACTIVATE:
            case "keyDown":
            case "keyUp":

                player = Util.$currentPlayer();
                if (!player.broadcastEvents.size
                    || !player.broadcastEvents.has(type)
                ) {
                    player.broadcastEvents.set(type, Util.$getArray());
                }

                events = player.broadcastEvents.get(type);

                isBroadcast = true;

                break;

            // normal event
            default:

                // init
                if (!this._$events.size || !this._$events.has(type)) {
                    this._$events.set(type, Util.$getArray());
                }

                events = this._$events.get(type);

                break;

        }


        // duplicate check
        let length = events.length;
        for (let idx = 0; idx < length; ++idx) {

            const event = events[idx];
            if (use_capture !== event.useCapture) {
                continue;
            }

            if (event.target !== this) {
                continue;
            }

            if (event.listener === listener) {
                length = idx;
            }

        }

        // add or overwrite
        events[length] = {
            "listener":   listener,
            "priority":   priority,
            "useCapture": use_capture,
            "target":     this
        };

        // set new event
        if (isBroadcast) {

            player.broadcastEvents.set(type, events);

        } else {

            // sort(DESC)
            events.sort(function (a, b)
            {
                switch (true) {

                    case (a.priority > b.priority):
                        return -1;

                    case (a.priority < b.priority):
                        return 1;

                    default:
                        return 0;

                }
            });

            this._$events.set(type, events);
        }
    }

    /**
     * @description イベントをイベントフローに送出します。
     *              Dispatches an event into the event flow.
     *
     * @param  {Event} event
     * @return {boolean}
     * @method
     * @public
     */
    dispatchEvent (event)
    {
        switch (event.type) {

            case Event.ENTER_FRAME:
            case Event.EXIT_FRAME:
            case Event.FRAME_CONSTRUCTED:
            case Event.RENDER:
            case Event.ACTIVATE:
            case Event.DEACTIVATE:
            case "keyDown":
            case "keyUp":
                {
                    const stage = this.stage;

                    const player = (stage)
                        ? stage._$player
                        : Util.$currentPlayer();

                    if (player && player.broadcastEvents.size
                        && player.broadcastEvents.has(event.type)
                    ) {

                        const events = player.broadcastEvents.get(event.type);

                        const length = events.length;
                        for (let idx = 0; idx < length; ++idx) {

                            const obj = events[idx];
                            if (obj.target !== this) {
                                continue;
                            }

                            // start target
                            event._$eventPhase = EventPhase.AT_TARGET;

                            // event execute
                            event._$currentTarget = obj.target;

                            try {

                                obj.listener.call(Util.$window, event);

                            } catch (e) {

                                // TODO
                                // player
                                //     .stage
                                //     .loaderInfo
                                //     .uncaughtErrorEvents
                                //     .dispatchEvent(
                                //         new UncaughtErrorEvent(
                                //             UncaughtErrorEvent.UNCAUGHT_ERROR, true, true, Util.$errorObject
                                //         )
                                //     );

                                return false;

                            }
                        }

                        return true;
                    }
                }
                break;

            default:
                {

                    let events = Util.$getArray();
                    if (this._$events.size && this._$events.has(event.type)) {
                        events = this._$events.get(event.type).slice(0);
                    }

                    // parent
                    const parentEvents = Util.$getArray();
                    if (this instanceof DisplayObject) {

                        let parent = this._$parent;
                        while (parent) {

                            if (parent.hasEventListener(event.type)) {
                                parentEvents[parentEvents.length] = parent._$events.get(event.type);
                            }

                            parent = parent._$parent;

                        }

                    }

                    event._$target = this;
                    if (events.length || parentEvents.length) {

                        // start capture
                        event._$eventPhase = EventPhase.CAPTURING_PHASE;

                        // stage => parent... end
                        if (parentEvents.length) {

                            switch (true) {

                                case event._$stopImmediatePropagation:
                                case event._$stopPropagation:
                                    break;

                                default:

                                    parentEvents.reverse();
                                    for (let idx = 0; idx < parentEvents.length; ++idx) {

                                        const targets = parentEvents[idx];
                                        for (let idx = 0; idx < targets.length; ++idx) {

                                            const obj = targets[idx];
                                            if (!obj.useCapture) {
                                                continue;
                                            }

                                            // event execute
                                            event._$currentTarget = obj.target;

                                            try {

                                                obj.listener.call(Util.$window, event);

                                            } catch (e) {

                                                // TODO
                                                // player
                                                //     .stage
                                                //     .loaderInfo
                                                //     .uncaughtErrorEvents
                                                //     .dispatchEvent(
                                                //         new UncaughtErrorEvent(
                                                //             UncaughtErrorEvent.UNCAUGHT_ERROR, true, true, Util.$errorObject
                                                //         )
                                                //     );
                                                return false;
                                            }

                                            if (event._$stopImmediatePropagation) {
                                                break;
                                            }

                                        }

                                        if (event._$stopImmediatePropagation) {
                                            break;
                                        }

                                    }
                                    parentEvents.reverse();

                                    break;
                            }

                        }


                        // start target
                        event._$eventPhase = EventPhase.AT_TARGET;
                        switch (true) {

                            case event._$stopImmediatePropagation:
                            case event._$stopPropagation:
                                break;

                            default:

                                const length = events.length;
                                for (let idx = 0; idx < length; ++idx) {

                                    const obj = events[idx];
                                    if (obj.useCapture) {
                                        continue;
                                    }

                                    // event execute
                                    event._$currentTarget = obj.target;

                                    try {

                                        obj.listener.call(Util.$window, event);

                                    } catch (e) {

                                        // TODO
                                        // player
                                        //     .stage
                                        //     .loaderInfo
                                        //     .uncaughtErrorEvents
                                        //     .dispatchEvent(
                                        //         new UncaughtErrorEvent(
                                        //             UncaughtErrorEvent.UNCAUGHT_ERROR, true, true, Util.$errorObject
                                        //         )
                                        //     );
                                        return false;
                                    }

                                    if (event._$stopImmediatePropagation) {
                                        break;
                                    }

                                }

                                break;

                        }


                        // start bubbling
                        event._$eventPhase = EventPhase.BUBBLING_PHASE;
                        switch (true) {

                            case event._$stopImmediatePropagation:
                            case event._$stopPropagation:
                            case !event.bubbles:
                                break;

                            default:

                                // this => parent... => stage end
                                for (let idx = 0; idx < parentEvents.length; ++idx) {

                                    const targets = parentEvents[idx];
                                    for (let idx = 0; idx < targets.length; ++idx) {

                                        const obj = targets[idx];
                                        if (obj.useCapture) {
                                            continue;
                                        }

                                        // event execute
                                        event._$currentTarget = obj.target;

                                        try {

                                            obj.listener.call(Util.$window, event);

                                        } catch (e) {

                                            // TODO
                                            // player
                                            //     .stage
                                            //     .loaderInfo
                                            //     .uncaughtErrorEvents
                                            //     .dispatchEvent(
                                            //         new UncaughtErrorEvent(
                                            //             UncaughtErrorEvent.UNCAUGHT_ERROR, true, true, Util.$errorObject
                                            //         )
                                            //     );

                                            return false;
                                        }

                                        if (event._$stopImmediatePropagation) {
                                            break;
                                        }
                                    }

                                    if (event._$stopImmediatePropagation) {
                                        break;
                                    }

                                }

                                break;

                        }

                        Util.$poolArray(events);
                        Util.$poolArray(parentEvents);

                        return true;

                    }

                    Util.$poolArray(events);
                    Util.$poolArray(parentEvents);
                }
                break;

        }

        return false;
    }

    /**
     * @description EventDispatcher オブジェクトに、特定のイベントタイプに対して登録されたリスナーがあるかどうかを確認します。
     *              Checks whether the EventDispatcher object has any listeners registered for a specific type of event.
     *
     * @param  {string}  type
     * @return {boolean}
     * @method
     * @public
     */
    hasEventListener (type)
    {
        type = `${type}`;
        switch (type) {

            case Event.ENTER_FRAME:
            case Event.EXIT_FRAME:
            case Event.FRAME_CONSTRUCTED:
            case Event.RENDER:
            case Event.ACTIVATE:
            case Event.DEACTIVATE:
            case "keyDown":
            case "keyUp":

                const stage  = this.stage;
                const player = (stage)
                    ? stage._$player
                    : Util.$currentPlayer();

                if (player && player.broadcastEvents.size
                    && player.broadcastEvents.has(type)
                ) {
                    const events = player.broadcastEvents.get(type);

                    for (let idx = 0; idx < events.length; idx++) {
                        if (events[idx].target === this) {
                            return true;
                        }
                    }
                }
                return false;

            default:
                return this._$events.size && this._$events.has(type);

        }
    }

    /**
     * @description EventDispatcher オブジェクトからリスナーを削除します。
     *              Removes a listener from the EventDispatcher object.
     *
     * @param  {string}   type
     * @param  {function} listener
     * @param  {boolean}  [use_capture=false]
     * @return {void}
     * @method
     * @public
     */
    removeEventListener (type, listener, use_capture = false)
    {
        type = `${type}`;
        if (!this.hasEventListener(type)) {
            return;
        }

        let
            events,
            player,
            isBroadcast = false;

        switch (type) {

            case Event.ENTER_FRAME:
            case Event.EXIT_FRAME:
            case Event.FRAME_CONSTRUCTED:
            case Event.RENDER:
            case Event.ACTIVATE:
            case Event.DEACTIVATE:
            case "keyDown":
            case "keyUp":

                isBroadcast = true;

                player = Util.$currentPlayer();
                if (player) {
                    events = player.broadcastEvents.get(type);
                }

                break;

            default:
                events = this._$events.get(type);
                break;

        }


        // remove listener
        const length = events.length;
        for (let idx = 0; idx < length; ++idx) {

            // event object
            const obj = events[idx];
            if (use_capture === obj.useCapture
                && obj.listener === listener
            ) {
                events.splice(idx, 1);
                break;
            }

        }


        if (!events.length) {

            if (isBroadcast) {

                player.broadcastEvents.delete(type);

            } else {

                this._$events.delete(type);

            }

            return ;
        }


        if (isBroadcast) {

            player.broadcastEvents.set(type, events);

        } else {

            // event sort
            events.sort(function (a, b)
            {
                switch (true) {

                    case a.priority > b.priority:
                        return -1;

                    case a.priority < b.priority:
                        return 1;

                    default:
                        return 0;

                }
            });

            this._$events.set(type, events);

        }
    }

    /**
     * @description 指定されたイベントタイプについて、
     *              この EventDispatcher オブジェクトまたはその祖先にイベントリスナーが
     *              登録されているかどうかを確認します。
     *              Checks whether an event listener is registered
     *              with this EventDispatcher object or
     *              any of its ancestors for the specified event type.
     *
     * @param  {string}  type
     * @return {boolean}
     * @method
     * @public
     */
    willTrigger (type)
    {
        if (this.hasEventListener(type)) {
            return true;
        }

        let parent = this._$parent;
        while (parent) {

            if (parent.hasEventListener(type)) {
                return true;
            }

            parent = parent._$parent;
        }

        return false;
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
 * @memberOf next2d.events
 * @extends  Event
 */
class FocusEvent extends Event
{
    /**
     * FocusEvent オブジェクトは、ユーザーが表示リストの1つのオブジェクトから
     * 別のオブジェクトにフォーカスを変更したときにオブジェクトによって送出されます。
     * 次の2種類のフォーカスイベントがあります。
     *
     * An object dispatches a FocusEvent object when the user changes
     * the focus from one object in the display list to another.
     * There are two types of focus events:
     *
     * <ul>
     *     <li>FocusEvent.FOCUS_IN</li>
     *     <li>FocusEvent.FOCUS_OUT</li>
     * </ul>
     *
     * @param {string}  type
     * @param {boolean} [bubbles=true]
     * @param {boolean} [cancelable=false]
     *
     * @constructor
     * @public
     */
    constructor (type, bubbles = true, cancelable = false)
    {
        super(type, bubbles, cancelable);

    }

    /**
     * 指定されたクラスのストリングを返します。
     * Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default [class FocusEvent]
     * @method
     * @static
     */
    static toString()
    {
        return "[class FocusEvent]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @member  {string}
     * @default next2d.events:FocusEvent
     * @const
     * @static
     */
    static get namespace ()
    {
        return "next2d.events:FocusEvent";
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
        return this.formatToString(
            "FocusEvent", "type", "bubbles", "cancelable", "eventPhase"
        );
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @member  {string}
     * @default next2d.events:FocusEvent
     * @const
     * @public
     */
    get namespace ()
    {
        return "next2d.events:FocusEvent";
    }

    /**
     * @description focusIn イベントオブジェクトの type プロパティ値を定義します。
     *              Defines the value of the type property of a focusIn event object.
     *
     * @return {string}
     * @default focusIn
     * @const
     * @static
     */
    static get FOCUS_IN ()
    {
        return "focusIn";
    }

    /**
     * @description focusOut イベントオブジェクトの type プロパティ値を定義します。
     *              Defines the value of the type property of a focusOut event object.
     *
     * @return {string}
     * @default focusOut
     * @const
     * @static
     */
    static get FOCUS_OUT ()
    {
        return "focusOut";
    }
}
/**
 * @class
 * @memberOf next2d.events
 * @extends  Event
 */
class MouseEvent extends Event
{

    /**
     * MouseEvent オブジェクトは、マウスイベントが発生するたびにイベントフローに送出されます。
     * 通常、マウスイベントは、マウスやトラックボールなど、ポインターを使用したユーザー入力デバイスによって生成されます。
     *
     * A MouseEvent object is dispatched into the event flow whenever mouse events occur.
     * A mouse event is usually generated by a user input device,
     * such as a mouse or a trackball, that uses a pointer.
     *
     * @param {string}  type
     * @param {boolean} [bubbles=true]
     * @param {boolean} [cancelable=false]
     * @param {number}  [local_x=NaN]
     * @param {number}  [local_y=NaN]
     *
     * @constructor
     * @public
     */
    constructor (
        type, bubbles = true, cancelable = false,
        local_x = NaN, local_y = NaN
    ) {

        super(type, bubbles, cancelable);

        return new Proxy(this, {
            "get": function (object, name)
            {
                if (name in object) {
                    return object[name];
                }

                if (Util.$event && name in Util.$event) {
                    return Util.$event[name];
                }

                return undefined;
            }
        });

    }

    /**
     * 指定されたクラスのストリングを返します。
     * Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default [class MouseEvent]
     * @method
     * @static
     */
    static toString()
    {
        return "[class MouseEvent]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @member  {string}
     * @default next2d.events:MouseEvent
     * @const
     * @static
     */
    static get namespace ()
    {
        return "next2d.events:MouseEvent";
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
        return this.formatToString(
            "MouseEvent",
            "type", "bubbles", "cancelable", "eventPhase",
            "localX", "localY", "stageX", "stageY",
            "ctrlKey", "altKey", "shiftKey", "buttonDown",
            "delta", "commandKey", "controlKey", "clickCount"
        );
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @member  {string}
     * @default next2d.events:MouseEvent
     * @const
     * @public
     */
    get namespace ()
    {
        return "next2d.events:MouseEvent";
    }

    /**
     * @description click イベントオブジェクトの type プロパティ値を定義します。
     *              Defines the value of the type property of a click event object.
     *
     * @return {string}
     * @default click
     * @const
     * @static
     */
    static get CLICK ()
    {
        return "click";
    }

    /**
     * @description dblclick イベントオブジェクトの type プロパティ値を定義します。
     *              Defines the value of the type property of a dblclick event object.
     *
     * @return {string}
     * @default dblclick
     * @const
     * @static
     */
    static get DOUBLE_CLICK ()
    {
        return "dblclick";
    }

    /**
     * @description mouseDown イベントオブジェクトの type プロパティ値を定義します。
     *              Defines the value of the type property of a mouseDown event object.
     *
     * @return {string}
     * @default mouseDown
     * @const
     * @static
     */
    static get MOUSE_DOWN ()
    {
        return "mouseDown";
    }

    /**
     * @description mouseMove イベントオブジェクトの type プロパティ値を定義します。
     *              Defines the value of the type property of a mouseMove event object.
     *
     * @return {string}
     * @default mouseMove
     * @const
     * @static
     */
    static get MOUSE_MOVE ()
    {
        return "mouseMove";
    }

    /**
     * @description mouseOut イベントオブジェクトの type プロパティ値を定義します。
     *              Defines the value of the type property of a mouseOut event object.
     *
     * @return {string}
     * @default mouseOut
     * @const
     * @static
     */
    static get MOUSE_OUT ()
    {
        return "mouseOut";
    }

    /**
     * @description mouseOver イベントオブジェクトの type プロパティ値を定義します。
     *              Defines the value of the type property of a mouseOver event object.
     *
     * @return {string}
     * @default mouseOver
     * @const
     * @static
     */
    static get MOUSE_OVER ()
    {
        return "mouseOver";
    }

    /**
     * @description mouseUp イベントオブジェクトの type プロパティ値を定義します。
     *              Defines the value of the type property of a mouseUp event object.
     *
     * @return {string}
     * @default mouseUp
     * @const
     * @static
     */
    static get MOUSE_UP ()
    {
        return "mouseUp";
    }

    /**
     * @description mouseWheel イベントオブジェクトの type プロパティ値を定義します。
     *              Defines the value of the type property of a mouseWheel event object.
     *
     * @return {string}
     * @default mouseWheel
     * @const
     * @static
     */
    static get MOUSE_WHEEL ()
    {
        return "mouseWheel";
    }

    /**
     * @description rollOut イベントオブジェクトの type プロパティ値を定義します。
     *              Defines the value of the type property of a rollOut event object.
     *
     * @return {string}
     * @default rollOut
     * @const
     * @static
     */
    static get ROLL_OUT ()
    {
        return "rollOut";
    }

    /**
     * @description rollOver イベントオブジェクトの type プロパティ値を定義します。
     *              Defines the value of the type property of a rollOver event object.
     *
     * @return {string}
     * @default rollOver
     * @const
     * @static
     */
    static get ROLL_OVER ()
    {
        return "rollOver";
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
        /**
         * @type {Float32Array}
         * @private
         */
        this._$colorTransform = Util.$getFloat32Array(
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

        // update
        this._$colorTransform[0] = multiColor[0];
        this._$colorTransform[1] = multiColor[1];
        this._$colorTransform[2] = multiColor[2];
        this._$colorTransform[3] = multiColor[3];
        this._$colorTransform[4] = multiColor[4];
        this._$colorTransform[5] = multiColor[5];
        this._$colorTransform[6] = multiColor[6];
        this._$colorTransform[7] = multiColor[7];

        Util.$poolFloat32Array(multiColor);
    }

    /**
     * @return {ColorTransform}
     * @method
     * @private
     */
    _$clone ()
    {
        const colorTransform = new ColorTransform();

        colorTransform._$colorTransform = Util.$getFloat32Array(
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
        /**
         * @type {Float32Array}
         * @private
         */
        this._$matrix = Util.$getFloat32Array(a, b, c, d, tx, ty);
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
        return Util.$getMatrix(
            this._$matrix[0], this._$matrix[1],
            this._$matrix[2], this._$matrix[3],
            this._$matrix[4], this._$matrix[5]
        );
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
        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$x = +x * Util.$TWIPS;

        /**
         * @type {number}
         * @default 0
         * @private
         */
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
        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$x = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$y = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$width = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$height = 0;

        // init
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
        if (!(src instanceof DisplayObject)) {
            throw new Error("Transform params is DisplayObject only.");
        }

        /**
         * @type {DisplayObject}
         * @private
         */
        this._$displayObject = src;

        /**
         * @type {Matrix|null}
         * @default null
         * @private
         */
        this._$matrix = null;

        /**
         * @type {ColorTransform|null}
         * @default null
         * @private
         */
        this._$colorTransform = null;

        /**
         * @type {string|null}
         * @default null
         * @private
         */
        this._$blendMode = null;

        /**
         * @type {array|null}
         * @default null
         * @private
         */
        this._$filters = null;
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
            colorTransform._$colorTransform = Util.$getFloat32Array(
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

        return Util.$getColorTransform(
            colorTransform[0], colorTransform[1],
            colorTransform[2], colorTransform[3],
            colorTransform[4], colorTransform[5],
            colorTransform[6], colorTransform[7]
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

        return Util.$getMatrix(
            matrix[0], matrix[1], matrix[2],
            matrix[3], matrix[4], matrix[5]
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
            const buffer = object.matrix;
            return Util.$getMatrix(
                buffer[0], buffer[1], buffer[2],
                buffer[3], buffer[4], buffer[5]
            );
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
     * 返される値は一時的に使用することのみできます。返される値の要素を直接更新してはいけません。返される値をプール（Util.$poolFloat32Array）してはいけません。
     *
     * @return {Float32Array}
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
     * 返される値は一時的に使用することのみできます。返される値の要素を直接更新してはいけません。返される値をプール（Util.$poolFloat32Array）してはいけません。
     *
     * @return {Float32Array}
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
     * @param  {Float32Array} [matrix=null]
     * @param  {Float32Array} [color_transform=null]
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
     * @param {Float32Array} [matrix=null]
     * @param {object} [object=null]
     * @method
     * @private
     */
    _$setMatrix (matrix = null, object = null)
    {
        // Matrix
        if (!this._$matrix) {
            this._$matrix = Util.$getMatrix();
        }

        if (matrix) {

            Util.$poolFloat32Array(this._$matrix._$matrix);

            this
                ._$matrix
                ._$matrix = Util.$getFloat32Array(
                matrix[0], matrix[1], matrix[2],
                matrix[3], matrix[4], matrix[5]
            );

            this._$displayObject._$doChanged();
            Util.$isUpdated = true;

            return ;
        }


        if (object) {

            Util.$poolFloat32Array(this._$matrix._$matrix);

            const matrix = object.matrix;

            this
                ._$matrix
                ._$matrix = Util.$getFloat32Array(
                matrix[0], matrix[1], matrix[2],
                matrix[3], matrix[4], matrix[5]
            );

        }
    }

    /**
     * @param {Float32Array} [color_transform=null]
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

            Util.$poolFloat32Array(this._$colorTransform._$colorTransform);

            this
                ._$colorTransform
                ._$colorTransform = Util.$getFloat32Array(
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

            Util.$poolFloat32Array(this._$colorTransform._$colorTransform);

            const colorTransform = object.colorTransform;

            this
                ._$colorTransform
                ._$colorTransform = Util.$getFloat32Array(
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
class DisplayObject extends EventDispatcher
{
    /**
     * DisplayObject クラスは、表示リストに含めることのできるすべてのオブジェクトに関する基本クラスです。
     * DisplayObject クラス自体は、画面上でのコンテンツの描画のための API を含みません。
     * そのため、DisplayObject クラスのカスタムサブクラスを作成する場合は、
     * Shape、Sprite、Bitmap、SimpleButton、TextField または MovieClip など、
     * 画面上にコンテンツを描画する API を持つサブクラスの 1 つを拡張する必要があります。
     *
     * The DisplayObject class is the base class for all objects that can be placed on the display list.
     * The DisplayObject class itself does not include any APIs for rendering content onscreen.
     * For that reason, if you want create a custom subclass of the DisplayObject class,
     * you will want to extend one of its subclasses that do have APIs for rendering content onscreen,
     * such as the Shape, Sprite, Bitmap, SimpleButton, TextField, or MovieClip class.
     *
     * @constructor
     * @public
     */
    constructor()
    {
        super();

        /**
         * @type {number}
         * @private
         */
        this._$id = 0;

        /**
         * @type {number}
         * @private
         */
        this._$instanceId = instanceId++;

        /**
         * @type {number}
         * @private
         */
        this._$dictionaryId = 0;

        /**
         * @type {number}
         * @private
         */
        this._$characterId = 0;

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$active = false;

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$isMask = false;

        /**
         * TODO
         * @type {null}
         * @default null
         * @private
         */
        this._$buffer = null;

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$updated = true;

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$added = false;

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$addedStage = false;

        /**
         * @type {array|null}
         * @default null
         * @private
         */
        this._$filters = null;

        /**
         * @type {string|null}
         * @default null
         * @private
         */
        this._$blendMode = null;

        /**
         * @type {Sprite|null}
         * @default null
         * @private
         */
        this._$hitObject = null;

        /**
         * @type {boolean}
         * @default true
         * @private
         */
        this._$isNext = true;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$clipDepth = 0;

        /**
         * @type {string}
         * @default ""
         * @private
         */
        this._$name = "";

        /**
         * @type {boolean}
         * @default true
         * @private
         */
        this._$visible = true;

        /**
         * @type {DisplayObject|null}
         * @default null
         * @private
         */
        this._$mask = null;

        /**
         * @type {Rectangle|null}
         * @default null
         * @private
         */
        this._$scale9Grid = null;

        /**
         * @type {DisplayObjectContainer|null}
         * @default null
         * @private
         */
        this._$parent = null;

        /**
         * @type {Stage|null}
         * @default null
         * @private
         */
        this._$stage = null;

        /**
         * @type {Sprite|null}
         * @default null
         * @private
         */
        this._$root = null;

        /**
         * @type {number|null}
         * @default null
         * @private
         */
        this._$loaderInfoId = null;

        /**
         * @type {number|null}
         * @default null
         * @private
         */
        this._$fixLoaderInfoId = null;

        /**
         * @type {number|null}
         * @default null
         * @private
         */
        this._$placeId = null;

        /**
         * @type {number}
         * @default null
         * @private
         */
        this._$startFrame = 1;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$endFrame = 0;

        /**
         * @type {Transform}
         * @private
         */
        this._$transform = new Transform(this);
    }

    /**
     * @description 指定されたクラスのストリングを返します。
     *              Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default [class DisplayObject]
     * @method
     * @static
     */
    static toString()
    {
        return "[class DisplayObject]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return  {string}
     * @default next2d.display:DisplayObject
     * @const
     * @static
     */
    static get namespace ()
    {
        return "next2d.display:DisplayObject";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return  {string}
     * @default [object DisplayObject]
     * @method
     * @public
     */
    toString ()
    {
        return "[object DisplayObject]";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @return  {string}
     * @default next2d.display:DisplayObject
     * @const
     * @static
     */
    get namespace ()
    {
        return "next2d.display:DisplayObject";
    }

    /**
     * @description 指定されたオブジェクトのアルファ透明度値を示します。
     *              有効な値は 0.0（完全な透明）～ 1.0（完全な不透明）です。
     *              デフォルト値は 1.0 です。alpha が 0.0 に設定されている表示オブジェクトは、
     *              表示されない場合でも、アクティブです。
     *              Indicates the alpha transparency value of the object specified.
     *              Valid values are 0.0 (fully transparent) to 1.0 (fully opaque).
     *              The default value is 1.0. Display objects with alpha set to 0.0 are active,
     *              even though they are invisible.
     *
     * @member  {number}
     * @default 1
     * @public
     */
    get alpha ()
    {
        const colorTransform = this._$transform._$rawColorTransform();
        return colorTransform[3] + colorTransform[7] / 255;
    }
    set alpha (alpha)
    {
        alpha = Util.$clamp(0, 1, alpha, 0);

        // clone
        const colorTransform = this._$transform.colorTransform;

        colorTransform._$colorTransform[3] = alpha;
        colorTransform._$colorTransform[7] = 0;

        this._$transform.colorTransform = colorTransform;
        Util.$poolColorTransform(colorTransform);
    }

    /**
     * @description 使用するブレンドモードを指定する BlendMode クラスの値です。
     *              A value from the BlendMode class that specifies which blend mode to use.
     *
     * @member  {string}
     * @default BlendMode.NORMAL
     * @public
     */
    get blendMode ()
    {
        if (this._$blendMode) {
            return this._$blendMode;
        }

        const transform = this._$transform;
        if (transform._$blendMode) {
            this._$blendMode = transform._$blendMode;
            return this._$blendMode;
        }

        const placeObject = this._$getPlaceObject();
        if (placeObject) {
            this._$blendMode = placeObject.blendMode;
            return this._$blendMode;
        }

        // create Transform
        transform._$transform();
        this._$blendMode = transform._$blendMode;
        return this._$blendMode;
    }
    set blendMode (blend_mode)
    {
        this._$transform._$transform(null, null, null, blend_mode);
        this._$blendMode = blend_mode;
    }

    /**
     * @description 表示オブジェクトに現在関連付けられている各フィルターオブジェクトが
     *              格納されているインデックス付きの配列です。
     *              An indexed array that contains each filter object
     *              currently associated with the display object.
     *
     * @member  {array}
     * @default {array}
     * @public
     */
    get filters ()
    {
        if (this._$filters) {
            return this._$filters;
        }

        const transform = this._$transform;
        if (transform._$filters) {
            this._$filters = transform._$filters.slice(0);
            return this._$filters;
        }

        const placeObject = this._$getPlaceObject();
        if (placeObject) {

            // create filter
            if (!placeObject.filters) {

                const filters = [];

                if (placeObject.surfaceFilterList) {

                    const length = placeObject.surfaceFilterList.length;
                    for (let idx = 0; idx < length; ++idx) {

                        const filter = placeObject.surfaceFilterList[idx];

                        const filterClass = next2d.filters[filter.class];

                        filters.push(
                            new (filterClass.bind.apply(filterClass, filter.params))()
                        );

                    }

                }

                this._$filters      = filters;
                placeObject.filters = filters;
            }

            return this._$filters.slice(0);
        }

        transform._$transform();
        this._$filters = transform._$filters;
        return this._$filters.slice(0);
    }
    set filters (filters)
    {
        this._$transform._$transform(null, null, filters, null);
        this._$filters = filters;
    }

    /**
     * @description 表示オブジェクトの高さを示します（ピクセル単位）。
     *              Indicates the height of the display object, in pixels.
     *
     * @member {number}
     * @public
     */
    get height ()
    {
        const bounds = Util.$boundsMatrix(
            this._$getBounds(null),
            this._$transform._$rawMatrix()
        );

        const height = Util.$abs(bounds.yMax - bounds.yMin) / Util.$TWIPS;

        // object pool
        Util.$poolBoundsObject(bounds);

        switch (height) {

            case 0:
            case Util.$Infinity:
            case -Util.$Infinity:
                return 0;

            default:
                return height;

        }
    }
    set height (height)
    {
        if (height > -1) {

            const bounds = (this.rotation)
                ? Util.$boundsMatrix(this._$getBounds(null), this._$transform._$rawMatrix())
                : this._$getBounds(null);

            const exHeight = Util.$abs(bounds.yMax - bounds.yMin) / Util.$TWIPS;
            Util.$poolBoundsObject(bounds);

            switch (exHeight) {

                case 0:
                case Util.$Infinity:
                case -Util.$Infinity:
                    this.scaleY = 0;
                    break;

                default:
                    this.scaleY = height / exHeight;
                    break;

            }
        }
    }

    /**
     * @description この表示オブジェクトが属するファイルの読み込み情報を含む LoaderInfo オブジェクトを返します。
     *              Returns a LoaderInfo object containing information
     *              about loading the file to which this display object belongs.
     *
     * @member   {LoaderInfo}
     * @readonly
     * @public
     */
    get loaderInfo ()
    {
        if (this._$fixLoaderInfoId === null) {

            return (this._$loaderInfoId !== null)
                ? Util.$loaderInfos[this._$loaderInfoId]
                : null;

        }

        return Util.$loaderInfos[this._$fixLoaderInfoId];
    }

    /**
     * @description 呼び出し元の表示オブジェクトは、指定された mask オブジェクトによってマスクされます。
     *              The calling display object is masked by the specified mask object.
     *
     * @member {DisplayObject|null}
     * @public
     */
    get mask ()
    {
        return this._$mask;
    }
    set mask (mask)
    {
        if (mask === this._$mask) {
            return ;
        }

        // reset
        if (this._$mask) {
            this._$mask._$isMask = false;
            this._$mask = null;
        }

        if (mask instanceof DisplayObject) {
            mask._$isMask = true;
            this._$mask   = mask;
        }

        this._$doChanged();
    }

    /**
     * @description マウスまたはユーザー入力デバイスの x 軸の位置をピクセルで示します。
     *              Indicates the x coordinate of the mouse or user input device position, in pixels.
     *
     * @member  {number}
     * @default 0
     * @readonly
     * @public
     */
    get mouseX ()
    {
        if (!Util.$event) {
            return 0;
        }
        return this.globalToLocal(Util.$currentMousePoint()).x;
    }

    /**
     * @description マウスまたはユーザー入力デバイスの y 軸の位置をピクセルで示します。
     *              Indicates the y coordinate of the mouse or user input device position, in pixels.
     *
     * @member  {number}
     * @default 0
     * @readonly
     * @public
     */
    get mouseY ()
    {
        if (!Util.$event) {
            return 0;
        }
        return this.globalToLocal(Util.$currentMousePoint()).y;
    }

    /**
     * @description DisplayObject のインスタンス名を示します。
     *              Indicates the instance name of the DisplayObject.
     *
     * @member {string}
     * @public
     */
    get name ()
    {
        if (this._$name) {
            return this._$name;
        }
        return `instance${this._$instanceId}`;
    }
    set name (name)
    {
        this._$name = `${name}`;

        const parent = this._$parent;
        if (parent && parent._$names) {

            parent._$names.clear();

            const children = parent._$getChildren();
            const length = children.length;
            for (let idx = 0; idx < length; ++idx) {
                const child = children[idx];
                if (child._$name) {
                    parent._$names.set(child.name, child);
                }
            }
        }
    }

    /**
     * @description この表示オブジェクトを含む DisplayObjectContainer オブジェクトを示します。
     *              Indicates the DisplayObjectContainer object that contains this display object.
     *
     * @member  {DisplayObjectContainer|null}
     * @readonly
     * @public
     */
    get parent ()
    {
        return this._$parent;
    }

    /**
     * @description 読み込まれた SWF ファイル内の表示オブジェクトの場合、
     *              root プロパティはその SWF ファイルが表す表示リストのツリー構造部分の一番上にある表示オブジェクトとなります。
     *              For a display object in a loaded SWF file,
     *              the root property is the top-most display object
     *              in the portion of the display list's tree structure represented by that SWF file.
     *
     * @member   {DisplayObject|null}
     * @readonly
     * @public
     */
    get root ()
    {
        return this._$root;
    }

    /**
     * @description DisplayObject インスタンスの元の位置からの回転角を度単位で示します。
     *              Indicates the rotation of the DisplayObject instance,
     *              in degrees, from its original orientation.
     *
     * @member {number}
     * @public
     */
    get rotation ()
    {
        const matrix = this._$transform._$rawMatrix();
        return Util.$atan2(matrix[1], matrix[0]) * Util.$Rad2Deg;
    }
    set rotation (rotation)
    {
        const sign = (rotation < 0) ? -1 : 1;

        // clamp
        let value = Util.$abs(rotation);
        if (value >= 360) {

            while (value >= 360) {
                value = value - 360;
            }

            rotation = value * sign;

        }

        const transform = this._$transform;
        const matrix    = transform.matrix;

        const scaleX = Util.$sqrt(matrix.a * matrix.a + matrix.b * matrix.b);
        const scaleY = Util.$sqrt(matrix.c * matrix.c + matrix.d * matrix.d);

        if (rotation === 0) {

            matrix.a = scaleX;
            matrix.b = 0;
            matrix.c = 0;
            matrix.d = scaleY;

        } else {

            let radianX  = Util.$atan2(matrix.b,  matrix.a);
            let radianY  = Util.$atan2(-matrix.c, matrix.d);

            const radian = rotation * Util.$Deg2Rad;
            radianY      = radianY + radian - radianX;
            radianX      = radian;

            matrix.b = scaleX  * Util.$sin(radianX);
            if (matrix.b === 1 || matrix.b === -1) {
                matrix.a = 0;
            } else {
                matrix.a = scaleX  * Util.$cos(radianX);
            }

            matrix.c = -scaleY * Util.$sin(radianY);
            if (matrix.c === 1 || matrix.c === -1) {
                matrix.d = 0;
            } else {
                matrix.d = scaleY  * Util.$cos(radianY);
            }
        }

        transform.matrix = matrix;
        Util.$poolMatrix(matrix);
    }

    /**
     * @description 現在有効な拡大 / 縮小グリッドです。
     *              The current scaling grid that is in effect.
     *
     * @member {Rectangle}
     * @public
     */
    get scale9Grid ()
    {
        return this._$scale9Grid;
    }
    set scale9Grid (scale_9_grid)
    {
        this._$scale9Grid = null;
        if (scale_9_grid instanceof Rectangle) {
            this._$scale9Grid = scale_9_grid;
        }
    }

    /**
     * @description 基準点から適用されるオブジェクトの水平スケール（パーセンテージ）を示します。
     *              Indicates the horizontal scale (percentage)
     *              of the object as applied from the registration point.
     *
     * @member {number}
     * @public
     */
    get scaleX ()
    {
        const matrix = this._$transform._$rawMatrix();
        let xScale   = Util.$sqrt(matrix[0] * matrix[0] + matrix[1] * matrix[1]);
        if (0 > matrix.a) {
            xScale *= -1;
        }
        return xScale;
    }
    set scaleX (scale_x)
    {
        const transform = this._$transform;
        const matrix    = transform.matrix;
        switch (true) {

            case Util.$isNaN(matrix.b):
            case (matrix.b === 0):
                matrix.a = scale_x;
                break;

            default:
                const radianX = Util.$atan2(matrix.b, matrix.a);
                matrix.b = scale_x * Util.$sin(radianX);
                if (matrix.b === 1 || matrix.b === -1) {
                    matrix.a = 0;
                } else {
                    matrix.a = scale_x * Util.$cos(radianX);
                }
                break;

        }

        transform.matrix = matrix;
        Util.$poolMatrix(matrix);
    }

    /**
     * @description 基準点から適用されるオブジェクトの垂直スケール（パーセンテージ）を示します。
     *              IIndicates the vertical scale (percentage)
     *              of an object as applied from the registration point.
     *
     * @member {number}
     * @public
     */
    get scaleY ()
    {
        const matrix = this._$transform._$rawMatrix();
        let yScale   = Util.$sqrt(matrix[2] * matrix[2] + matrix[3] * matrix[3]);
        if (0 > matrix.d) {
            yScale *= -1;
        }
        return yScale;
    }
    set scaleY (scale_y)
    {
        const transform = this._$transform;
        const matrix    = transform.matrix;
        switch (true) {

            case Util.$isNaN(matrix.c):
            case (matrix.c === 0):
                matrix.d = scale_y;
                break;

            default:
                const radianY = Util.$atan2(-matrix.c, matrix.d);
                matrix.c = -scale_y * Util.$sin(radianY);
                if (matrix.c === 1 || matrix.c === -1) {
                    matrix.d = 0;
                } else {
                    matrix.d = scale_y  * Util.$cos(radianY);
                }
                break;

        }

        transform.matrix = matrix;
        Util.$poolMatrix(matrix);
    }

    /**
     * @description 表示オブジェクトのステージです。
     *              The Stage of the display object.
     *
     * @member   {Stage}
     * @readonly
     * @public
     */
    get stage ()
    {
        if (this._$stage) {
            return this._$stage;
        }

        // find parent
        const parent = this._$parent;
        if (parent) {

            if (parent instanceof Stage) {
                return parent;
            }

            return parent._$stage;
        }

        return null;
    }

    /**
     * @description 表示オブジェクトのマトリックス、カラー変換、
     *              ピクセル境界に関係するプロパティを持つオブジェクトです。
     *              An object with properties pertaining
     *              to a display object's matrix, color transform, and pixel bounds.
     *
     * @member {Transform}
     * @public
     */
    get transform ()
    {
        return this._$transform;
    }
    set transform (transform)
    {
        if (transform instanceof Transform) {
            this._$transform = transform;
        }
    }

    /**
     * @description 表示オブジェクトが可視かどうかを示します。
     *              Whether or not the display object is visible.
     *
     * @member {boolean}
     * @public
     */
    get visible ()
    {
        return this._$visible;
    }
    set visible (visible)
    {
        if (this._$visible !== visible) {
            this._$doChanged();
            Util.$isUpdated = true;
            this._$visible = visible;
        }
    }

    /**
     * @description 表示オブジェクトの幅を示します（ピクセル単位）。
     *              Indicates the width of the display object, in pixels.
     *
     * @member {number}
     * @public
     */
    get width ()
    {
        const bounds = Util.$boundsMatrix(
            this._$getBounds(null),
            this._$transform._$rawMatrix()
        );

        const width = Util.$abs(bounds.xMax - bounds.xMin) / Util.$TWIPS;
        Util.$poolBoundsObject(bounds);

        switch (true) {

            case width === 0:
            case width === Util.$Infinity:
            case width === -Util.$Infinity:
                return 0;

            default:
                return width;

        }
    }
    set width (width)
    {
        if (width > -1) {

            const bounds = (this.rotation)
                ? Util.$boundsMatrix(this._$getBounds(null), this._$transform._$rawMatrix())
                : this._$getBounds(null);

            const exWidth = Util.$abs(bounds.xMax - bounds.xMin) / Util.$TWIPS;
            Util.$poolBoundsObject(bounds);

            switch (true) {

                case exWidth === 0:
                case exWidth === Util.$Infinity:
                case exWidth === -Util.$Infinity:
                    this.scaleX = 0;
                    break;

                default:
                    this.scaleX = width / exWidth;
                    break;

            }
        }
    }

    /**
     * @description 親 DisplayObjectContainer のローカル座標を基準にした
     *              DisplayObject インスタンスの x 座標を示します。
     *              Indicates the x coordinate
     *              of the DisplayObject instance relative to the local coordinates
     *              of the parent DisplayObjectContainer.
     *
     * @member {number}
     * @public
     */
    get x ()
    {
        return this._$transform._$rawMatrix()[4] / Util.$TWIPS;
    }
    set x (x)
    {
        const transform = this._$transform;

        const matrix = this._$transform.matrix;

        matrix.tx = x;

        transform.matrix = matrix;
        Util.$poolMatrix(matrix);
    }

    /**
     * @description 親 DisplayObjectContainer のローカル座標を基準にした
     *              DisplayObject インスタンスの y 座標を示します。
     *              Indicates the y coordinate
     *              of the DisplayObject instance relative to the local coordinates
     *              of the parent DisplayObjectContainer.
     *
     * @member {number}
     * @public
     */
    get y ()
    {
        return this._$transform._$rawMatrix()[5] / Util.$TWIPS;
    }
    set y (y)
    {
        const transform = this._$transform;

        const matrix = transform.matrix;

        matrix.ty = y;

        transform.matrix = matrix;
        Util.$poolMatrix(matrix);
    }

    /**
     * @description targetCoordinateSpace オブジェクトの座標系を基準にして、
     *              表示オブジェクトの領域を定義する矩形を返します。
     *              Returns a rectangle that defines the area
     *              of the display object relative to the coordinate system
     *              of the targetCoordinateSpace object.
     *
     * @param  {DisplayObject} target
     * @return {Rectangle}
     */
    getBounds (target)
    {
        const baseBounds = this._$getBounds(null);

        const matrix = this._$transform.concatenatedMatrix();

        // to global
        const bounds = Util.$boundsMatrix(baseBounds, matrix._$matrix);

        // pool
        Util.$poolMatrix(matrix);
        Util.$poolBoundsObject(baseBounds);

        // create bounds object
        const targetBaseBounds = Util.$getBoundsObject(
            bounds.xMin,
            bounds.xMax,
            bounds.yMin,
            bounds.yMax
        );

        // pool
        Util.$poolBoundsObject(bounds);


        if (!target) {
            target = this;
        }

        const targetMatrix = target._$transform.concatenatedMatrix();
        targetMatrix.invert();

        const resultBounds = Util.$boundsMatrix(
            targetBaseBounds, targetMatrix._$matrix
        );

        const xMin = resultBounds.xMin / Util.$TWIPS;
        const yMin = resultBounds.yMin / Util.$TWIPS;
        const xMax = resultBounds.xMax / Util.$TWIPS;
        const yMax = resultBounds.yMax / Util.$TWIPS;

        // pool
        Util.$poolBoundsObject(targetBaseBounds);
        Util.$poolBoundsObject(resultBounds);
        Util.$poolMatrix(targetMatrix);

        return new Rectangle(
            xMin, yMin,
            Util.$abs(xMax - xMin),
            Util.$abs(yMax - yMin)
        );
    }

    /**
     * @description point オブジェクトをステージ（グローバル）座標から
     *              表示オブジェクトの（ローカル）座標に変換します。
     *              Converts the point object from the Stage (global) coordinates
     *              to the display object's (local) coordinates.
     *
     * @param   {Point} point
     * @returns {Point}
     * @public
     */
    globalToLocal (point)
    {
        const matrix = this._$transform.concatenatedMatrix();
        matrix.invert();

        const newPoint =  new Point(
            point.x * matrix.a + point.y * matrix.c + matrix.tx,
            point.x * matrix.b + point.y * matrix.d + matrix.ty
        );

        Util.$poolMatrix(matrix);

        return newPoint;
    }

    /**
     * @description 表示オブジェクトの境界ボックスを評価して、
     *              obj 表示オブジェクトの境界ボックスと重複または交差するかどうかを調べます。
     *              Evaluates the bounding box of the display object to see
     *              if it overlaps or intersects with the bounding box of the obj display object.
     *
     * @param   {DisplayObject} object
     * @returns {boolean}
     * @public
     */
    hitTestObject (object)
    {
        const baseBounds1 = this._$getBounds(null);
        const matrix1 = this._$transform.concatenatedMatrix();
        const bounds1 = Util.$boundsMatrix(baseBounds1, matrix1._$matrix);

        // pool
        Util.$poolMatrix(matrix1);
        Util.$poolBoundsObject(baseBounds1);

        const baseBounds2 = object._$getBounds(null);
        const matrix2 = object._$transform.concatenatedMatrix();
        const bounds2 = Util.$boundsMatrix(baseBounds2, matrix2._$matrix);

        // pool
        Util.$poolMatrix(matrix2);
        Util.$poolBoundsObject(baseBounds2);

        // calc
        const sx = Util.$max(bounds1.xMin, bounds2.xMin);
        const sy = Util.$max(bounds1.yMin, bounds2.yMin);
        const ex = Util.$min(bounds1.xMax, bounds2.xMax);
        const ey = Util.$min(bounds1.yMax, bounds2.yMax);

        // pool
        Util.$poolBoundsObject(bounds1);
        Util.$poolBoundsObject(bounds2);

        return ((ex - sx) >= 0 && (ey - sy) >= 0);
    }

    /**
     * @description 表示オブジェクトを評価して、x および y パラメーターで指定された
     *              ポイントと重複または交差するかどうかを調べます。
     *              Evaluates the display object to see if it overlaps
     *              or intersects with the point specified by the x and y parameters.
     *
     * @param   {number}  x
     * @param   {number}  y
     * @param   {boolean} [shape_flag=false]
     * @returns {boolean}
     * @public
     */
    hitTestPoint (x, y, shape_flag = false)
    {
        if (shape_flag) {

            let matrix = Util.$MATRIX_ARRAY_IDENTITY;
            let parent = this._$parent;

            while (parent) {

                matrix = Util.$multiplicationMatrix(
                    parent._$transform._$rawMatrix(),
                    matrix
                );

                parent = parent._$parent;
            }

            // 1 / 20 matrix
            matrix = Util.$multiplicationMatrix(
                Util.$MATRIX_ARRAY_20_0_0_20_0_0_INVERSE,
                matrix
            );

            Util.$hitContext.setTransform(1, 0, 0, 1, 0, 0);
            Util.$hitContext.beginPath();
            const result = this._$hit(Util.$hitContext, matrix, { "x": x, "y": y }, true);

            Util.$poolFloat32Array(matrix);

            return result;
        }


        const baseBounds = this._$getBounds(null);
        const bounds = Util.$boundsMatrix(baseBounds, this._$transform._$rawMatrix());

        const rectX = bounds.xMin / Util.$TWIPS;
        const rectY = bounds.yMin / Util.$TWIPS;
        const rectW = (bounds.xMax - bounds.xMin) / Util.$TWIPS;
        const rectH = (bounds.yMax - bounds.yMin) / Util.$TWIPS;

        const point = (this._$parent)
            ? this._$parent.globalToLocal(new Point(x, y))
            : new Point(x, y);

        // pool
        Util.$poolBoundsObject(bounds);
        Util.$poolBoundsObject(baseBounds);

        return (new Rectangle(rectX, rectY, rectW, rectH)).containsPoint(point);
    }

    /**
     * @description point オブジェクトを表示オブジェクトの（ローカル）座標から
     *              ステージ（グローバル）座標に変換します。
     *              Converts the point object from the display object's (local) coordinates
     *              to the Stage (global) coordinates.
     *
     *
     * @param   {Point} point
     * @returns {Point}
     * @public
     */
    localToGlobal (point)
    {
        const matrix = this
            ._$transform
            .concatenatedMatrix();

        const newPoint = new Point(
            point.x * matrix.a + point.y * matrix.c + matrix.tx,
            point.x * matrix.b + point.y * matrix.d + matrix.ty
        );

        Util.$poolMatrix(matrix);

        return newPoint;
    }

    /**
     * @return {object}
     * @method
     * @private
     */
    _$getPlaceObject ()
    {
        const placeId = this._$placeId;
        if (placeId === null) {
            return null;
        }

        const parent = this._$parent;
        if (!parent) {
            return null;
        }

        if (!parent._$placeController.length) {
            return null;
        }

        const frame = parent._$currentFrame || 1;
        const id = parent._$placeController[frame][placeId];
        return parent._$placeObjects[id];
    }

    /**
     * @return {boolean}
     * @method
     * @private
     */
    _$isUpdated ()
    {
        return this._$updated;
    }

    /**
     * @return {void}
     * @method
     * @private
     */
    _$updateState ()
    {
        this._$isNext = true;

        let parent = this._$parent;
        if (parent) {
            parent._$updateState();
        }
    }

    /**
     * @param  {boolean} [flag=true]
     * @return {object}
     * @method
     * @private
     */
    _$doChanged (flag = true)
    {
        this._$updateState();

        if (!this._$updated) {

            this._$updated = flag;

            let parent = this._$parent;
            if (parent) {

                // check
                const filters   = parent._$filters   || parent.filters;
                const blendMode = parent._$blendMode || parent.blendMode;
                if (filters.length > 0 || blendMode !== BlendMode.NORMAL) {
                    parent._$doChanged();
                } else {
                    parent._$doChanged(false);
                }
            }

        }
    }

    /**
     * @return {void}
     * @method
     * @private
     */
    _$executeAddedEvent ()
    {
        if (!this._$parent) {
            return ;
        }

        // add event
        if (!this._$added) {

            // added event
            if (this.willTrigger(Event.ADDED)) {
                this.dispatchEvent(new Event(Event.ADDED, true));
            }

            // update
            this._$added = true;
        }


        if (!this._$addedStage && this._$stage !== null) {

            if (this.willTrigger(Event.ADDED_TO_STAGE)) {
                this.dispatchEvent(new Event(Event.ADDED_TO_STAGE));
            }

            // update
            this._$addedStage = true;
        }
    }

    /**
     * @return {void}
     * @method
     * @private
     */
    _$prepareActions ()
    {
        this._$nextFrame();
    }

    /**
     * @return {boolean}
     * @method
     * @private
     */
    _$nextFrame ()
    {
        // added event
        this._$executeAddedEvent();

        this._$isNext = false;

        return false;
    }


}
/**
 * @class
 * @memberOf next2d.display
 * @extends  DisplayObject
 */
class InteractiveObject extends DisplayObject
{

    /**
     * InteractiveObject クラスは、マウス、キーボードまたは他のユーザー入力デバイスを使用して
     * ユーザーが操作できるすべての表示オブジェクトの抽象基本クラスです。
     *
     * The InteractiveObject class is the abstract base class for all display objects
     * with which the user can interact, using the mouse, keyboard, or other user input device.
     *
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

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$isFocus = false;

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$isComposing = false;
    }

    /**
     * @description 指定されたクラスのストリングを返します。
     *              Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default [class InteractiveObject]
     * @method
     * @static
     */
    static toString()
    {
        return "[class InteractiveObject]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return  {string}
     * @default next2d.display:InteractiveObject
     * @const
     * @static
     */
    static get namespace ()
    {
        return "next2d.display:InteractiveObject";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return  {string}
     * @default [object InteractiveObject]
     * @method
     * @public
     */
    toString ()
    {
        return "[object InteractiveObject]";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @return  {string}
     * @default next2d.display:InteractiveObject
     * @const
     * @static
     */
    get namespace ()
    {
        return "next2d.display:InteractiveObject";
    }

    /**
     * @description このオブジェクトでマウスまたはその他のユーザー入力メッセージを
     *              受け取るかどうかを指定します。
     *              Specifies whether this object receives mouse,
     *              or other user input, messages.
     *
     * @member {boolean}
     * @public
     */
    get mouseEnabled ()
    {
        return this._$mouseEnabled;
    }
    set mouseEnabled (mouse_enabled)
    {
        this._$mouseEnabled = mouse_enabled;
    }
}
/**
 * @class
 * @memberOf next2d.display
 * @extends  InteractiveObject
 */
class DisplayObjectContainer extends InteractiveObject
{
    /**
     * DisplayObjectContainer クラスは、表示リストで表示オブジェクトコンテナとして機能するすべてのオブジェクトの基本クラスです。
     * このクラス自体は、画面上でのコンテンツの描画のための API を含みません。
     * そのため、DisplayObject クラスのカスタムサブクラスを作成する場合は、
     * Sprite、または MovieClip など、画面上にコンテンツを描画する API を持つサブクラスの 1 つを拡張する必要があります。
     *
     * The DisplayObjectContainer class is the base class for all objects that can serve
     * as display object containers on the display list.
     * This class itself does not contain any API for drawing content on the screen.
     * Therefore, if you want to create a custom subclass of the DisplayObject class,
     * you need to extend one of its subclasses that has an API for drawing content on the screen,
     * such as Sprite or MovieClip.
     *
     * @constructor
     * @public
     */
    constructor()
    {
        super();

        /**
         * @type {array}
         * @private
         */
        this._$placeController = Util.$getArray();

        /**
         * @type {array}
         * @private
         */
        this._$placeObjects = Util.$getArray();

        /**
         * @type {array}
         * @private
         */
        this._$controller = Util.$getArray();

        /**
         * @type {array}
         * @private
         */
        this._$dictionary = Util.$getArray();

        /**
         * @type {array}
         * @private
         */
        this._$instances = Util.$getArray();

        /**
         * @type {array}
         * @private
         */
        this._$children = Util.$getArray();

        /**
         * @type {boolean}
         * @default true
         * @private
         */
        this._$needsChildren = true;

        /**
         * @type {boolean}
         * @default true
         * @private
         */
        this._$mouseChildren = true;

        /**
         * @type {boolean}
         * @default true
         * @private
         */
        this._$wait = true;

        /**
         * @type {Map}
         * @private
         */
        this._$names = Util.$getMap();

        return new Proxy(this, {
            "get": function (object, name)
            {
                if (object._$names.size
                    && object._$names.has(name)
                ) {
                    return object._$names.get(name);
                }

                return object[name];
            }
        });
    }

    /**
     * @description 指定されたクラスのストリングを返します。
     *              Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default [class DisplayObjectContainer]
     * @method
     * @static
     */
    static toString()
    {
        return "[class DisplayObjectContainer]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return  {string}
     * @default next2d.display:DisplayObjectContainer
     * @const
     * @static
     */
    static get namespace ()
    {
        return "next2d.display:DisplayObjectContainer";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return  {string}
     * @default [object DisplayObjectContainer]
     * @method
     * @public
     */
    toString ()
    {
        return "[object DisplayObjectContainer]";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @return  {string}
     * @default next2d.display:DisplayObjectContainer
     * @const
     * @static
     */
    get namespace ()
    {
        return "next2d.display:DisplayObjectContainer";
    }

    /**
     * @description オブジェクトの子がマウスまたはユーザー入力デバイスに対応しているかどうかを判断します。
     *              Determines whether or not the children of the object are mouse, or user input device, enabled.
     *
     * @member {boolean}
     * @public
     */
    get mouseChildren ()
    {
        return this._$mouseChildren;
    }
    set mouseChildren (mouse_children)
    {
        this._$mouseChildren = mouse_children;
    }

    /**
     * @description このオブジェクトの子の数を返します。
     *              Returns the number of children of this object.
     *
     * @member   {number}
     * @readonly
     * @public
     */
    get numChildren ()
    {
        return (this._$needsChildren)
            ? this._$getChildren().length
            : this._$children.length;
    }

    /**
     * @description この DisplayObjectContainer インスタンスに子 DisplayObject インスタンスを追加します。
     *              Adds a child DisplayObject instance to this DisplayObjectContainer instance.
     *
     * @param  {DisplayObject} child
     * @return {DisplayObject}
     * @method
     * @public
     */
    addChild (child)
    {
        if (!(child instanceof DisplayObject)) {
            throw new TypeError("TypeError: addChild: not DisplayObject.");
        }

        if (child._$parent) {

            child._$parent._$remove(child,
                !(child._$parent._$instanceId === this._$instanceId)
            );

        }

        const children = this._$getChildren();
        children.push(child);

        if (child._$name) {
            this._$names.set(child._$name, child);
        }

        return this._$addChild(child);
    }

    /**
     * @description この DisplayObjectContainer インスタンスに子 DisplayObject インスタンスを追加します。
     *              Adds a child DisplayObject instance to this DisplayObjectContainer instance.
     *
     * @param  {DisplayObject} child
     * @param  {number}        index
     * @return {DisplayObject}
     * @method
     * @public
     */
    addChildAt (child, index)
    {
        if (!(child instanceof DisplayObject)) {
            throw new TypeError("TypeError: addChildAt: not DisplayObject.");
        }

        if (child._$parent) {
            child._$parent._$remove(child,
                !(child._$parent._$instanceId === this._$instanceId)
            );
        }

        const children = this._$getChildren();
        const length = children.length;
        if (0 > index || index > length) {
            throw new RangeError(`RangeError: addChildAt: index error: ${index}`);
        }

        if (length && length > index) {

            children.splice(index, 0, child);

            for (let idx = 0; idx < index; ++idx) {
                const instance = children[idx];
                if (instance._$name) {
                    this._$names.set(instance._$name, instance);
                }
            }

        } else {

            children.push(child);
            if (child._$name) {
                this._$names.set(child._$name, child);
            }

        }

        return this._$addChild(child);
    }

    /**
     * @description 指定された表示オブジェクトが、DisplayObjectContainer インスタンスの子であるか
     *              インスタンス自体であるかを指定します。
     *              Determines whether the specified display object is a child
     *              of the DisplayObjectContainer instance or the instance itself.
     *
     * @param  {DisplayObject} child
     * @return {boolean}
     * @method
     * @public
     */
    contains (child)
    {
        if (!(child instanceof DisplayObject)) {
            throw new TypeError("TypeError: contains: not DisplayObject.");
        }

        if (this._$instanceId === child._$instanceId) {
            return true;
        }

        const children = this._$getChildren();
        const length   = children.length;
        for (let idx = 0; idx < length; ++idx) {

            const instance = children[idx];

            if (instance._$instanceId === child._$instanceId) {
                return true;
            }

            if (instance instanceof DisplayObjectContainer) {

                if (instance.contains(child)) {
                    return true;
                }

            }

        }

        return false;
    }

    /**
     * @description 指定のインデックス位置にある子表示オブジェクトインスタンスを返します。
     *              Returns the child display object instance that exists at the specified index.
     *
     * @param  {number} index
     * @return {DisplayObject}
     * @method
     * @public
     */
    getChildAt (index)
    {
        const children = this._$getChildren();

        const numChildren = children.length;
        if (0 > index || index > numChildren) {
            throw new RangeError(`RangeError: getChildAt: index error: ${index}`);
        }

        return (index in children) ? children[index] : null;
    }

    /**
     * @description 指定された名前に一致する子表示オブジェクトを返します。
     *              Returns the child display object that exists with the specified name.
     *
     * @param  {string} name
     * @return {{DisplayObject}|null}
     * @method
     * @public
     */
    getChildByName (name)
    {
        if (!name) {
            return null;
        }

        // fixed logic
        const children = this._$getChildren();
        const length   = children.length;
        for (let idx = 0; idx < length; ++idx) {

            const child = children[idx];
            if (child.name !== name) {
                continue;
            }

            return child;
        }

        return null;
    }

    /**
     * @description 子 DisplayObject インスタンスのインデックス位置を返します。
     *              Returns the index position of a child DisplayObject instance.
     *
     * @param  {DisplayObject} child
     * @return {number}
     * @method
     * @public
     */
    getChildIndex (child)
    {
        if (!(child instanceof DisplayObject)) {
            throw new TypeError("TypeError: getChildIndex: not DisplayObject.");
        }

        if (child._$parent !== this) {
            throw new ArgumentError(`ArgumentError: getChildIndex: index error: ${index}`);
        }

        const children = this._$getChildren();
        const index = children.indexOf(child);
        if (index === -1) {
            throw new ArgumentError("ArgumentError: getChildIndex: not found.");
        }

        return index;
    }


    /**
     * @description DisplayObjectContainer インスタンスの子リストから指定の
     *              child DisplayObject インスタンスを削除します。
     *              Removes the specified child DisplayObject instance from the
     *              child list of the DisplayObjectContainer instance.
     *
     * @param  {DisplayObject} child
     * @return {DisplayObject}
     * @method
     * @public
     */
    removeChild (child)
    {
        if (!(child instanceof DisplayObject)) {
            throw new TypeError("TypeError: removeChild: not DisplayObject.");
        }

        if (child._$parent !== this) {
            throw new ArgumentError(`ArgumentError: removeChild: index error: ${index}`);
        }

        return this._$remove(child);
    }

    /**
     * @description DisplayObjectContainer の子リストの指定された index 位置から子 DisplayObject を削除します。
     *              Removes a child DisplayObject from the specified index position
     *              in the child list of the DisplayObjectContainer.
     *
     * @param  {number} index
     * @return {DisplayObject}
     * @method
     * @public
     */
    removeChildAt (index)
    {
        return this._$remove(this.getChildAt(index));
    }

    /**
     * @description DisplayObjectContainer インスタンスの子リストから
     *              すべての child DisplayObject インスタンスを削除します。
     *              Removes all child DisplayObject instances from
     *              the child list of the DisplayObjectContainer instance.
     *
     * @param  {number} [begin_index=0]
     * @param  {number} [end_index=0x7fffffff]
     * @return {void}
     * @method
     * @public
     */
    removeChildren (begin_index = 0, end_index = 0x7fffffff)
    {
        const children = this._$getChildren();
        const numChildren = children.length;
        if (!numChildren) {
            return ;
        }

        begin_index = Util.$clamp(begin_index, 0, 0x7ffffffe, 0) - 1;
        end_index   = Util.$clamp(end_index, 1, 0x7ffffff, 0x7ffffff);

        for (let idx = Util.$min(end_index, numChildren - 1); idx > begin_index; --idx) {
            this._$remove(children[idx]);
        }
    }

    /**
     * @description 表示オブジェクトコンテナの既存の子の位置を変更します。
     *              Changes the position of an existing child in the display object container.
     *
     * @param  {DisplayObject} child
     * @param  {number} index
     * @return {void}
     * @method
     * @public
     */
    setChildIndex (child, index)
    {
        if (!(child instanceof DisplayObject)) {
            throw new TypeError("TypeError: removeChild: not DisplayObject.");
        }

        const currentIndex = this.getChildIndex(child);
        if (currentIndex === index) {
            return ;
        }

        const children = this._$getChildren();
        children.splice(currentIndex, 1);
        children.splice(index, 0, child);
    }

    /**
     * @description 指定された 2 つの子オブジェクトの z 順序（重ね順）を入れ替えます。
     *              Swaps the z-order (front-to-back order) of the two specified child objects.
     *
     * @param  {DisplayObject} child1
     * @param  {DisplayObject} child2
     * @return {void}
     * @method
     * @public
     */
    swapChildren (child1, child2)
    {
        if (!(child1 instanceof DisplayObject)
            || !(child2 instanceof DisplayObject)
        ) {
            throw new TypeError("TypeError: removeChild: not DisplayObject.");
        }

        const children = this._$getChildren();
        const index1 = this.getChildIndex(child1);
        const index2 = this.getChildIndex(child2);

        children[index1] = child2;
        children[index2] = child1;
    }

    /**
     * @description 子リスト内の指定されたインデックス位置に該当する 2 つの子オブジェクトの z 順序（重ね順）を入れ替えます。
     *              Swaps the z-order (front-to-back order) of the child objects at
     *              the two specified index positions in the child list.
     *
     * @param  {number} index1
     * @param  {number} index2
     * @return {void}
     * @method
     * @public
     */
    swapChildrenAt (index1, index2)
    {
        this.swapChildren(
            this.getChildAt(index1),
            this.getChildAt(index2)
        );
    }

    /**
     * @return {array}
     * @private
     */
    _$getChildren ()
    {
        if (this._$needsChildren) {

            // set flag
            this._$needsChildren = false;

            if (!this._$instances.length) {
                return this._$children;
            }

            const frame = this._$currentFrame || 1;

            let controller = this._$controller[frame];
            if (controller) {
                if (controller.length) {
                    controller = controller.filter(() => true);
                } else {
                    controller = undefined;
                }
            }

            // first build
            const length = this._$children.length;
            if (!length) {

                if (controller) {

                    // MovieClip
                    const length = controller.length;
                    for (let idx = 0; idx < length; ++idx) {

                        const id = controller[idx];
                        const instance = this._$instances[id];
                        if (!instance || instance._$id !== id) {
                            continue;
                        }

                        this._$children.push(instance);
                        if (instance._$name) {
                            this._$names.set(instance.name, instance);
                        }
                    }

                } else {

                    // MovieClip
                    if (frame > 1) {
                        return this._$children;
                    }

                    // Sprite
                    const length = this._$instances.length;
                    for (let idx = 0; idx < length; ++idx) {

                        const instance = this._$instances[idx];
                        if (instance && instance._$startFrame === 1) {
                            this._$children.push(instance);
                            if (instance._$name) {
                                this._$names.set(instance._$name, instance);
                            }
                        }

                    }

                }

                return this._$children;
            }


            const skipIds = Util.$getMap();

            let depth = 0;
            const children = Util.$getArray();
            for (let idx = 0; idx < length; ++idx) {

                const instance = this._$children[idx];

                if (!instance._$parent
                    || instance._$parent._$instanceId !== this._$instanceId
                ) {
                    continue;
                }

                if (instance._$startFrame <= frame
                    && (instance._$endFrame === 0 || instance._$endFrame > frame)
                ) {

                    instance._$filters   = null;
                    instance._$blendMode = null;

                    if (instance._$id === null || !controller) {
                        children.push(instance);
                        if (instance._$name) {
                            this._$names.set(instance._$name, instance);
                        }
                        continue;
                    }


                    if (skipIds.has(instance._$id)) {
                        continue;
                    }


                    let id = controller[depth++];
                    skipIds.set(id, 1);

                    if (instance._$id === id) {
                        children.push(instance);
                        if (instance._$name) {
                            this._$names.set(instance._$name, instance);
                        }
                        continue;
                    }


                    const child = this._$instances[id];
                    if (child && child._$id === id) {
                        children.push(child);
                        if (child._$name) {
                            this._$names.set(child._$name, instance);
                        }
                    }


                    while (true) {

                        id = controller[depth++];
                        skipIds.set(id, 1);

                        const child = this._$instances[id];
                        if (!child || child._$id !== id) {
                            continue;
                        }

                        children.push(child);
                        if (child._$name) {
                            this._$names.set(child._$name, instance);
                        }

                        if (instance._$id === id) {
                            break;
                        }

                    }

                    continue;
                }


                // remove event
                instance.dispatchEvent(new Event(Event.REMOVED, true));
                instance.dispatchEvent(new Event(Event.REMOVED_FROM_STAGE, true));

                instance._$added      = false;
                instance._$addedStage = false;
                instance._$active     = false;
                instance._$updated    = true;
                instance._$filters    = null;
                instance._$blendMode  = null;
                instance._$isNext     = true;
                if (instance instanceof DisplayObjectContainer) {
                    instance._$executeRemovedFromStage();
                    instance._$removeParentAndStage();
                }

                this._$createInstance(instance._$dictionaryId);
            }


            if (controller) {

                const length = controller.length;
                for ( ; depth < length; ++depth) {

                    const id = controller[depth];
                    const instance = this._$instances[id];
                    if (!instance || instance._$id !== id) {
                        continue;
                    }

                    children.push(instance);
                    if (instance._$name) {
                        this._$names.set(instance._$name, instance);
                    }
                }

            }

            Util.$poolMap(skipIds);
            Util.$poolArray(this._$children);

            this._$children = children;
        }

        return this._$children;
    }

    /**
     * @return void
     * @private
     */
    _$clearChildren ()
    {
        this._$doChanged();
        Util.$isUpdated = true;

        // reset
        this._$names.clear();

        // clear
        this._$needsChildren = true;
    }

    /**
     * @param   {DisplayObject} child
     * @returns {DisplayObject}
     * @private
     */
    _$addChild (child)
    {

        // init
        child._$stage        = this._$stage;
        child._$parent       = this;
        child._$loaderInfoId = (this._$fixLoaderInfoId === null)
            ? this._$loaderInfoId
            : this._$fixLoaderInfoId;

        if (this.constructor !== Stage) {
            child._$root = this._$root;
        }


        // setup
        if (child instanceof DisplayObjectContainer) {
            child._$setParentAndStage();
            child._$wait = true;
        }


        // add
        this._$instances.push(child);


        // added event
        if (!child._$added) {
            child.dispatchEvent(new Event(Event.ADDED, true));
            child._$added = true;
        }


        if (this._$stage !== null && !child._$addedStage) {

            child.dispatchEvent(new Event(Event.ADDED_TO_STAGE));
            child._$addedStage = true;

            // set params
            if (child instanceof DisplayObjectContainer) {
                child._$executeAddedToStage();
            }
        }


        this._$doChanged();
        child._$active  = true;
        child._$updated = true;
        child._$isNext  = true;

        return child;
    }

    /**
     * @return  {void}
     * @private
     */
    _$setParentAndStage ()
    {
        const length = this._$instances.length;
        for (let idx = 0; idx < length; ++idx) {

            const instance = this._$instances[idx];
            if (!instance) {
                continue;
            }

            instance._$stage        = this._$stage;
            instance._$root         = this._$root;
            instance._$loaderInfoId = (this._$fixLoaderInfoId === null)
                ? this._$loaderInfoId
                : this._$fixLoaderInfoId;

            if (instance instanceof DisplayObjectContainer) {
                instance._$setParentAndStage();
                instance._$wait = true;
            }

        }
    }

    /**
     * @return  void
     * @private
     */
    _$executeAddedToStage ()
    {
        const children = this._$getChildren();
        const length   = children.length;
        for (let idx = 0; idx < length; ++idx) {

            const instance = children[idx];
            if (!instance) {
                continue;
            }

            if (!instance._$addedStage) {
                instance.dispatchEvent(new Event(Event.ADDED_TO_STAGE));
                instance._$addedStage = true;
            }

            if (instance instanceof DisplayObjectContainer) {
                instance._$executeAddedToStage();
            }

        }
    }

    /**
     * @param  {DisplayObject} child
     * @param  {boolean} do_event
     * @return {DisplayObject}
     * @private
     */
    _$remove (child, do_event = true)
    {
        child._$transform._$transform();

        // remove
        const children = this._$getChildren();
        const depth = this.getChildIndex(child);
        children.splice(depth, 1);


        this._$names.delete(child.name);
        const index = this._$instances.indexOf(child);
        if (child._$id === null) {

            if ((this._$instances.length - 1) === index) {

                this._$instances.pop();

            } else {

                this._$instances.splice(index, 1);

            }

        } else {

            this._$instances[index] = null;

        }

        if (do_event) {

            // event
            child.dispatchEvent(new Event(Event.REMOVED, true));

            // remove stage event
            if (this._$stage !== null) {

                child.dispatchEvent(new Event(Event.REMOVED_FROM_STAGE));

                if (child instanceof DisplayObjectContainer) {
                    child._$executeRemovedFromStage();
                }
            }

            // reset params
            if (child instanceof DisplayObjectContainer) {
                child._$removeParentAndStage();
            }

            // reset
            child._$stage        = null;
            child._$parent       = null;
            child._$root         = null;
            child._$loaderInfoId = null;
            child._$active       = false;
            child._$wait         = true;
            child._$updated      = true;
            child._$added        = false;
            child._$addedStage   = false;
            this._$doChanged();

        }

        return child;
    }

    /**
     * @return {void}
     * @private
     */
    _$executeRemovedFromStage ()
    {
        const children = this._$getChildren().slice(0);
        const length   = children.length;
        for (let idx = 0; idx < length; ++idx) {

            const instance = children[idx];
            if (!instance) {
                continue;
            }

            if (instance._$addedStage) {
                instance.dispatchEvent(new Event(Event.REMOVED_FROM_STAGE));
                instance._$addedStage = false;
            }

            if (instance instanceof DisplayObjectContainer) {
                instance._$executeRemovedFromStage();
            }

        }
    }

    /**
     * @return {void}
     * @private
     */
    _$removeParentAndStage ()
    {
        const length = this._$instances.length;
        for (let idx = 0; idx < length; ++idx) {

            const instance = this._$instances[idx];

            if (!instance) {
                continue;
            }

            if (instance instanceof DisplayObjectContainer) {
                instance._$removeParentAndStage();
            }

            instance._$stage        = null;
            instance._$root         = null;
            instance._$loaderInfoId = null;
            instance._$addedStage   = false;
        }
    }

    /**
     * @return {void}
     * @method
     * @private
     */
    _$prepareActions ()
    {
        const children = (this._$needsChildren)
            ? this._$getChildren()
            : this._$children;

        for (let idx = children.length - 1; idx > -1; --idx) {
            children[idx]._$prepareActions();
        }

        // added event
        this._$executeAddedEvent();
    }

    /**
     * @return {boolean}
     * @method
     * @private
     */
    _$nextFrame ()
    {
        let isNext = false;

        const children = (this._$needsChildren)
            ? this._$getChildren()
            : this._$children;

        for (let idx = children.length - 1; idx > -1; --idx) {

            const child = children[idx];

            if (!child._$isNext) {
                continue;
            }


            if (isNext) {

                child._$nextFrame();

            } else {

                isNext = child._$nextFrame();

            }
        }


        // added event
        this._$executeAddedEvent();

        this._$isNext = isNext;

        return this._$isNext;
    }

    _$draw ()
    {

    }

    _$mouseHit ()
    {

    }
}
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
     * @default next2d.display:Sprite
     * @const
     * @static
     */
    static get namespace ()
    {
        return "next2d.display:Sprite";
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
     * @default next2d.display:Sprite
     * @const
     * @static
     */
    get namespace ()
    {
        return "next2d.display:Sprite";
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
     * @return {void}
     * @method
     * @private
     */
    _$build ()
    {

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
/**
 * @class
 * @memberOf next2d.display
 * @extends  Sprite
 */
class MovieClip extends Sprite
{
    /**
     * MovieClip クラスは、Sprite、DisplayObjectContainer、InteractiveObject、DisplayObject
     * および EventDispatcher クラスを継承します。
     * MovieClip オブジェクトには、Sprite オブジェクトとは違ってタイムラインがあります。
     * タイムラインの再生ヘッドが停止されても、その MovieClip オブジェクトの子 MovieClip オブジェクトの再生ヘッドは停止しません。
     *
     * The MovieClip class inherits from the following classes: Sprite, DisplayObjectContainer,
     * InteractiveObject, DisplayObject, and EventDispatcher.
     * Unlike the Sprite object, a MovieClip object has a timeline.
     * When the playback head of the timeline is stopped,
     * the playback head of the child MovieClip object of that MovieClip object will not be stopped.
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
        this._$stopFlag = false;

        /**
         * @type {boolean}
         * @default true
         * @private
         */
        this._$canAction = true;

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$childRemove = false;

        /**
         * @type {boolean}
         * @default true
         * @private
         */
        this._$canSound = true;

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$actionProcess = false;

        /**
         * @type {Map}
         * @private
         */
        this._$actions = Util.$getMap();

        /**
         * @type {Map}
         * @private
         */
        this._$frameCache = Util.$getMap();

        /**
         * @type {array}
         * @private
         */
        this._$frameLabels = Util.$getArray();

        /**
         * @type {Map}
         * @private
         */
        this._$sounds = Util.$getMap();

        /**
         * @type {Map}
         * @private
         */
        this._$channels = Util.$getMap();

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$actionOffset = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$actionLimit = 0;

        /**
         * @type {number}
         * @default 1
         * @private
         */
        this._$currentFrame = 1;

        /**
         * @type {number}
         * @default 1
         * @private
         */
        this._$totalFrames = 1;

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$isPlaying = false;

        /**
         * @type {boolean}
         * @default true
         * @private
         */
        this._$enabled = true;
    }

    /**
     * @description 指定されたクラスのストリングを返します。
     *              Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default [class MovieClip]
     * @method
     * @static
     */
    static toString()
    {
        return "[class MovieClip]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return  {string}
     * @default next2d.display:MovieClip
     * @const
     * @static
     */
    static get namespace ()
    {
        return "next2d.display:MovieClip";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return  {string}
     * @default [object MovieClip]
     * @method
     * @public
     */
    toString ()
    {
        return "[object MovieClip]";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @return  {string}
     * @default next2d.display:MovieClip
     * @const
     * @static
     */
    get namespace ()
    {
        return "next2d.display:MovieClip";
    }

    /**
     * @description MovieClip インスタンスのタイムライン内の再生ヘッドが置かれているフレームの番号を示します。
     *              Specifies the number of the frame in which the playhead is located
     *              in the timeline of the MovieClip instance.
     *
     * @member {number}
     * @default 1
     * @readonly
     * @public
     */
    get currentFrame ()
    {
        return this._$currentFrame;
    }

    /**
     * @description MovieClip インスタンスのタイムライン内の現在のフレームにあるラベルです。
     *              The label at the current frame in the timeline of the MovieClip instance.
     *
     * @member  {FrameLabel|null}
     * @readonly
     * @public
     */
    get currentFrameLabel ()
    {
        const frame = this._$currentFrame;

        const frameLabels = this._$frameLabels;

        const length = frameLabels.length;
        for (let idx = 0; idx < length; ++idx) {

            const frameLabel = frameLabels[idx];
            if (frameLabel.frame === frame) {
                return frameLabel;
            }
        }

        return null;
    }

    /**
     * @description 現在のシーンの FrameLabel オブジェクトの配列を返します。
     *              Returns an array of FrameLabel objects from the current scene.
     *
     * @member  {array}
     * @readonly
     * @public
     */
    get currentLabels ()
    {
        return this._$frameLabels;
    }

    /**
     * @description ムービークリップが現在再生されているかどうかを示すブール値です。
     *              A Boolean value that indicates whether a movie clip is curently playing.
     *
     * @member  {boolean}
     * @default false
     * @readonly
     * @public
     */
    get isPlaying ()
    {
        return this._$isPlaying;
    }

    /**
     * @description MovieClip インスタンス内のフレーム総数です。
     *              The total number of frames in the MovieClip instance.
     *
     * @member  {number}
     * @default 1
     * @readonly
     * @public
     */
    get totalFrames ()
    {
        return this._$totalFrames;
    }

    /**
     * @description 指定されたフレームで SWF ファイルの再生を開始します。
     *              Starts playing the SWF file at the specified frame.
     *
     * @param   {number|string} frame
     * @return {void}
     * @method
     * @public
     */
    gotoAndPlay (frame)
    {
        this.play();
        this._$goToFrame(frame);
    }

    /**
     * @description このムービークリップの指定されたフレームに再生ヘッドを送り、そこで停止させます。
     *              Brings the playhead to the specified frame
     *              of the movie clip and stops it there.
     *
     * @param  {number|string} frame
     * @return {void}
     * @method
     * @public
     */
    gotoAndStop (frame)
    {
        this.stop();
        this._$goToFrame(frame);
    }

    /**
     * @description 次のフレームに再生ヘッドを送り、停止します。
     *              Sends the playhead to the next frame and stops it.
     *
     * @return {void}
     * @method
     * @public
     */
    nextFrame ()
    {
        this.stop();
        if (this._$totalFrames > this._$currentFrame) {
            this._$goToFrame(this._$currentFrame + 1);
        }
    }

    /**
     * @description ムービークリップのタイムライン内で再生ヘッドを移動します。
     *              Moves the playhead in the timeline of the movie clip.
     *
     * @return {void}
     * @method
     * @public
     */
    play ()
    {
        this._$stopFlag  = false;
        this._$isPlaying = true;
        this._$updateState();
    }

    /**
     * @description 直前のフレームに再生ヘッドを戻し、停止します。
     *              Sends the playhead to the previous frame and stops it.
     *
     * @return {void}
     * @method
     * @public
     */
    prevFrame ()
    {
        const frame = this._$currentFrame - 1;
        if (frame) {
            this.stop();
            this._$goToFrame(frame);
        }
    }

    /**
     * @description ムービークリップ内の再生ヘッドを停止します。
     *              Stops the playhead in the movie clip.
     *
     * @return {void}
     * @method
     * @public
     */
    stop ()
    {
        this._$stopFlag  = true;
        this._$isPlaying = false;
    }

    /**
     * @description タイムラインに対して動的にLabelを追加できます。
     *              Labels can be added dynamically to the timeline.
     *
     * @example <caption>Example1 usage of addFrameLabel.</caption>
     * // case 1
     * const {MovieClip, FrameLabel} = next2d.display;
     * const movieClip = new MovieClip();
     * movieClip.addFrameLabel(new FrameLabel(1, "start"));
     *
     * @param  {FrameLabel} frame_label
     * @return {void}
     * @private
     */
    addFrameLabel (frame_label)
    {
        if (frame_label instanceof FrameLabel) {
            this._$frameLabels.push(frame_label);
        }
    }

    /**
     * @description 指定のフレームのアクションを追加できます
     *              You can add an action for a given frame.
     *
     * @example <caption>Example1 usage of addFrameScript.</caption>
     * // case 1
     * const {MovieClip} = next2d.display;
     * const movieClip = new MovieClip();
     * movieClip.addFrameScript(1 , function ()
     * {
     *     this.stop();
     * });
     *
     * @example <caption>Example3 usage of addFrameScript.</caption>
     * // case 2
     * const {MovieClip} = next2d.display;
     * const movieClip = new MovieClip();
     * movieClip.addFrameScript(1, method_1, 2, method_2, 10, method_10);
     *
     * @return {void}
     * @method
     * @public
     */
    addFrameScript ()
    {
        const length = arguments.length;
        for (let idx = 0; idx < length; idx += 2) {

            let frame = arguments[idx];
            if (Util.$isNaN(frame|0)) {
                frame = this._$getFrameForLabel(frame);
            }

            const script = arguments[idx + 1];
            if (script && frame && this._$totalFrames >= frame) {
                this._$addAction(frame, script);
            }

            // end action add
            if (frame === this._$currentFrame) {

                // set action position
                const player = Util.$currentPlayer();
                player._$actionOffset = player._$actions.length;

                // execute action stack
                this._$canAction = true;
                this._$setAction();

                // adjustment
                if (player._$actionOffset !== player._$actions.length) {

                    // marge
                    const actions = player._$actions.splice(0, player._$actionOffset);
                    player._$actions.push.apply(player._$actions, actions);

                    // reset
                    player._$actionOffset = 0;
                }

            }
        }
    }

    /**
     * @param  {string} name
     * @return {number}
     * @private
     */
    _$getFrameForLabel (name)
    {
        const length = this._$frameLabels.length;
        for (let idx = 0; idx < length; ++idx) {

            const frameLabel = this._$frameLabels[idx];
            if (frameLabel.name === name) {
                return frameLabel.frame;
            }

        }
        return 0;
    }

    /**
     * @param {number}   frame
     * @param {function} script
     * @private
     */
    _$addAction(frame, script)
    {
        frame |= 0;
        if (frame) {
            if (!this._$actions.has(frame)) {
                this._$actions.set(frame, Util.$getArray());
            }
            this._$actions.get(frame).push(script);
        }
    }

    /**
     * @return {void}
     * @private
     */
    _$setAction ()
    {
        // added event
        this._$executeAddedEvent();

        if (this._$canAction) {

            // frame label event
            if (this._$frameLabels.length) {
                const frameLabel = this.currentFrameLabel();
                if (frameLabel && frameLabel.willTrigger(Event.FRAME_LABEL)) {
                    frameLabel.dispatchEvent(new Event(Event.FRAME_LABEL));
                }
            }

            // add action queue
            const frame = this._$currentFrame;
            if (this._$actions.size && this._$actions.has(frame)) {

                const player = Util.$currentPlayer();
                if (player) {
                    const index = player._$actions.indexOf(this);
                    if (index === -1) {
                        player._$actions.push(this);
                    }
                }
            }
        }
    }

    /**
     * @param  {number|string} frame
     * @return {void}
     * @private
     */
    _$goToFrame (frame)
    {
        if (Util.$isNaN(frame|0)) {
            frame = this._$getFrameForLabel(frame);
        }

        if (frame < 1) {
            frame = 1;
        }

        // over
        if (frame > this._$totalFrames) {
            this._$currentFrame = this._$totalFrames;
            this._$clearChildren();

            // flag off
            this._$canAction = false;
            this._$wait      = false;

            return ;
        }


        const player = Util.$currentPlayer();
        switch (true) {

            case frame !== this._$currentFrame:
                {
                    // flag off
                    this._$wait = false;

                    const currentFrame = this._$currentFrame;

                    if (this._$actionProcess) {
                        this._$frameCache.set("nextFrame", frame);
                        this._$frameCache.set("stopFlag",  this._$stopFlag);
                        this._$frameCache.set("isPlaying", this._$isPlaying);
                    }

                    // setup
                    this._$currentFrame = frame;
                    this._$clearChildren();


                    // set action position
                    player._$actionOffset = player._$actions.length;
                    const position = (player._$actionOffset)
                        ? player._$actions.indexOf(this)
                        : -1;


                    this._$canAction = true;
                    this._$prepareActions();


                    // adjustment
                    if (player._$actionOffset && player._$actionOffset !== player._$actions.length) {

                        // marge
                        const actions = player._$actions.splice(0, player._$actionOffset);
                        player._$actions.push.apply(player._$actions, actions);

                        // reset
                        player._$actionOffset = 0;
                    }


                    if (!this._$actionProcess && (position > -1 || !player._$actionOffset)) {

                        while (player._$actions.length) {

                            if (player._$actions.length === position) {
                                break;
                            }

                            // target object
                            const mc = player._$actions.pop();
                            mc._$canAction    = false;
                            mc._$actionOffset = 0;
                            mc._$actionLimit  = 0;

                            if (mc._$actionProcess && mc._$frameCache.size) {

                                mc._$currentFrame = mc._$frameCache.get("nextFrame");
                                mc._$clearChildren();

                                mc._$stopFlag  = mc._$frameCache.get("stopFlag");
                                mc._$isPlaying = mc._$frameCache.get("isPlaying");
                                mc._$frameCache.clear();
                            }

                            const frame = mc._$currentFrame;
                            if (!mc._$actions.has(frame)) {
                                continue;
                            }

                            const actions = mc._$actions.get(frame);
                            const length  = actions.length;
                            for (let idx = 0; idx < length; ++idx) {

                                try {

                                    actions[idx].apply(mc);

                                } catch (e) {

                                    mc.stop();

                                    // TODO

                                }
                            }
                        }
                    }

                    if (this._$actionProcess) {
                        this._$currentFrame = currentFrame;
                        this._$clearChildren();
                    }
                }
                break;

            case !this._$actionProcess && player._$actions.indexOf(this) > -1:
                {
                    if (!this._$actionLimit) {
                        break;
                    }

                    // flag off
                    this._$wait = false;

                    const myActions = player._$actions.splice(
                        this._$actionOffset, this._$actionLimit
                    );

                    while (myActions.length) {

                        const mc = myActions.pop();

                        // target reset
                        mc._$canAction    = false;
                        mc._$actionOffset = 0;
                        mc._$actionLimit  = 0;

                        const frame = mc._$currentFrame;
                        if (!mc._$actions.has(frame)) {
                            continue;
                        }

                        const actions = mc._$actions.get(frame);
                        const length  = actions.length;
                        for (let idx = 0; idx < length; ++idx) {

                            try {

                                actions[idx].apply(mc);

                            } catch (e) {

                                mc.stop();

                                // TODO
                                // mc
                                //     .loaderInfo
                                //     .uncaughtErrorEvents
                                //     .dispatchEvent(
                                //         new UncaughtErrorEvent(
                                //             UncaughtErrorEvent.UNCAUGHT_ERROR, true, true, Util.$errorObject
                                //         )
                                //     );

                            }

                        }


                    }

                }
                break;

            default:
                break;

        }

        // set sound
        if (this._$canSound
            && this._$sounds.size
            && this._$sounds.has(this._$currentFrame)
            && player._$sounds.indexOf(this) === -1
        ) {
            player._$sounds.push(this);
        }
    }

    /**
     * @return {void}
     * @method
     * @private
     */
    _$prepareActions ()
    {
        // draw flag
        this._$wait = false;

        const children = (this._$needsChildren)
            ? this._$getChildren()
            : this._$children;

        for (let idx = children.length - 1; idx > -1; --idx) {
            children[idx]._$prepareActions();
        }

        this._$setAction();
    }

    _$nextFrame ()
    {

    }

}
/**
 * @class
 * @memberOf next2d.display
 * @extends  DisplayObject
 */
class Bitmap extends DisplayObject
{
    /**
     *
     *
     * @param {BitmapData} [bitmap_data=null]
     * @param {boolean}    [smoothing=false]
     *
     * @constructor
     * @public
     */
    constructor(bitmap_data, smoothing = false)
    {
        super();
    }

    /**
     * @description 指定されたクラスのストリングを返します。
     *              Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default [class Bitmap]
     * @method
     * @static
     */
    static toString()
    {
        return "[class Bitmap]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return  {string}
     * @default next2d.display:Bitmap
     * @const
     * @static
     */
    static get namespace ()
    {
        return "next2d.display:Bitmap";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return  {string}
     * @default [object Bitmap]
     * @method
     * @public
     */
    toString ()
    {
        return "[object Bitmap]";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @return  {string}
     * @default next2d.display:Bitmap
     * @const
     * @static
     */
    get namespace ()
    {
        return "next2d.display:Bitmap";
    }




}
/**
 * @class
 * @memberOf next2d.display
 */
class BitmapData
{
    /**
     *
     *
     * @param   {number}  [width=0]
     * @param   {number}  [height=0]
     * @param   {boolean} [transparent=true]
     * @param   {number}  [color=0xffffffff]
     *
     * @constructor
     * @public
     */
    constructor(width = 0, height = 0, transparent = true, color = 0xffffffff)
    {
        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$width = width|0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$height = height|0;

        /**
         * @type {boolean}
         * @default true
         * @private
         */
        this._$transparent = transparent;

        /**
         * @type {number}
         * @default 0xffffffff
         * @private
         */
        this._$color = color;
    }

    /**
     * @description 指定されたクラスのストリングを返します。
     *              Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default [class BitmapData]
     * @method
     * @static
     */
    static toString()
    {
        return "[class BitmapData]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return  {string}
     * @default next2d.display:BitmapData
     * @const
     * @static
     */
    static get namespace ()
    {
        return "next2d.display:BitmapData";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return  {string}
     * @default [object BitmapData]
     * @method
     * @public
     */
    toString ()
    {
        return "[object BitmapData]";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @return  {string}
     * @default next2d.display:BitmapData
     * @const
     * @static
     */
    get namespace ()
    {
        return "next2d.display:BitmapData";
    }

    /**
     * @description ビットマップイメージの高さ（ピクセル単位）です。
     *              The height of the bitmap image in pixels.
     *
     * @return  {number}
     * @readonly
     * @public
     */
    get height ()
    {
        return this._$height;
    }

    /**
     * @description ビットマップイメージがピクセル単位の透明度をサポートするかどうかを定義します。
     *              Defines whether the bitmap image supports per-pixel transparency.
     *
     * @return  {boolean}
     * @readonly
     * @public
     */
    get transparent ()
    {
        return this._$transparent;
    }

    /**
     * @description ビットマップイメージの幅（ピクセル単位）です。
     *              The width of the bitmap image in pixels.
     *
     * @return  {number}
     * @readonly
     * @public
     */
    get width ()
    {
        return this._$width;
    }


    snapShot ()
    {

    }

    load ()
    {

    }



}
/**
 * @class
 * @memberOf next2d.display
 */
class BitmapDataChannel
{
    /**
     * BitmapDataChannel クラスは、赤、青、緑、またはアルファ透明度の
     * いずれのチャンネルを使用するかを示す定数値の列挙です。
     * メソッドを呼び出すとき、ビット単位の OR 演算子（|）を使って
     * BitmapDataChannel 定数を結合すれば、複数のカラーチャンネルを指定することができます。
     *
     * The BitmapDataChannel class is an enumeration of constant values that indicate
     * which channel to use: red, blue, green, or alpha transparency.
     * When you call some methods, you can use the bitwise OR operator (|)
     * to combine BitmapDataChannel constants to indicate multiple color channels.
     *
     * @constructor
     * @public
     */
    constructor () {}

    /**
     * @description 指定されたクラスのストリングを返します。
     *              Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default [class BitmapDataChannel]
     * @method
     * @static
     */
    static toString()
    {
        return "[class BitmapDataChannel]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return  {string}
     * @default next2d.display:BitmapDataChannel
     * @const
     * @static
     */
    static get namespace ()
    {
        return "next2d.display:BitmapDataChannel";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return  {string}
     * @default [object BitmapDataChannel]
     * @method
     * @public
     */
    toString ()
    {
        return "[object BitmapDataChannel]";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @return  {string}
     * @default next2d.display:BitmapDataChannel
     * @const
     * @static
     */
    get namespace ()
    {
        return "next2d.display:BitmapDataChannel";
    }

    /**
     * @description アルファチャンネルです。
     *              The alpha channel.
     *
     * @return  {number}
     * @default 8
     * @const
     * @static
     */
    static get ALPHA ()
    {
        return 8;
    }

    /**
     * @description 青チャンネルです。
     *              The blue channel.
     *
     * @return  {number}
     * @default 4
     * @const
     * @static
     */
    static get BLUE ()
    {
        return 4;
    }

    /**
     * @description 緑チャンネルです。
     *              The green channel.
     *
     * @return  {number}
     * @default 2
     * @const
     * @static
     */
    static get GREEN ()
    {
        return 2;
    }

    /**
     * @description 赤チャンネルです。
     *              The red channel.
     *
     * @return  {number}
     * @default 1
     * @const
     * @static
     */
    static get RED ()
    {
        return 1;
    }
}
/**
 * @class
 * @memberOf next2d.display
 */
class BlendMode
{
    /**
     * ブレンドモードの視覚効果のために定数値を提供するクラスです。
     * A class that provides constant values for visual blend mode effects.
     *
     * @example <caption>Example usage of BlendMode.</caption>
     * // static BlendMode
     * const {BlendMode, MovieClip} = next2d.display;
     * const movieClip = new MovieClip();
     * movieClip.blendMode = BlendMode.ADD;
     *
     * @constructor
     * @public
     */
    constructor () {}

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
class CapsStyle
{
    /**
     * CapsStyle クラスは、線の描画で使用されるキャップのスタイルを指定する定数値の列挙です。
     * この定数は、caps パラメーター（next2d.display.Graphics.lineStyle() メソッドのパラメーター）の値として使用されます。
     *
     * he CapsStyle class is an enumeration of constant values that specify the caps style to use in drawing lines.
     * The constants are provided for use as values in the caps parameter of the next2d.display.Graphics.lineStyle() method.
     *
     * @constructor
     * @public
     */
    constructor () {}

    /**
     * @description 指定されたクラスのストリングを返します。
     *              Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default [class CapsStyle]
     * @method
     * @static
     */
    static toString()
    {
        return "[class CapsStyle]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return  {string}
     * @default next2d.display:CapsStyle
     * @const
     * @static
     */
    static get namespace ()
    {
        return "next2d.display:CapsStyle";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return  {string}
     * @default [object CapsStyle]
     * @method
     * @public
     */
    toString ()
    {
        return "[object CapsStyle]";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @return  {string}
     * @default next2d.display:CapsStyle
     * @const
     * @static
     */
    get namespace ()
    {
        return "next2d.display:CapsStyle";
    }

    /**
     * @description flash.display.Graphics.lineStyle() メソッドの caps パラメーターで
     *              キャップなしを指定するのに使用します。
     *              Used to specify no caps in the caps parameter of the
     *              flash.display.Graphics.lineStyle() method.
     *
     * @return  {string}
     * @default none
     * @const
     * @static
     */
    static get NONE ()
    {
        return "none";
    }

    /**
     * @description flash.display.Graphics.lineStyle() メソッドの caps パラメーターで
     *              丸いキャップを指定するのに使用します。
     *              Used to specify round caps in the caps parameter of the
     *              flash.display.Graphics.lineStyle() method.
     *
     * @return  {string}
     * @default round
     * @const
     * @static
     */
    static get ROUND ()
    {
        return "round";
    }

    /**
     * @description flash.display.Graphics.lineStyle() メソッドの caps パラメーターで
     *              四角形のキャップを指定するのに使用します。
     *              Used to specify square caps in the caps parameter of the
     *              flash.display.Graphics.lineStyle() method.
     *
     * @return  {string}
     * @default square
     * @const
     * @static
     */
    static get SQUARE ()
    {
        return "square";
    }
}
/**
 * @class
 * @memberOf next2d.display
 * @extends  EventDispatcher
 */
class FrameLabel extends EventDispatcher
{
    /**
     * FrameLabel オブジェクトには、フレーム番号および対応するラベル名を指定するプロパティがあります。
     * MovieClip クラスには、currentLabels プロパティがあります。
     * これは、現在のシーンの FrameLabel オブジェクトの配列です。
     * MovieClip インスタンスがシーンを使用していない場合、配列には MovieClip インスタンス全体のすべてのフレームラベルが含まれます。
     *
     * The FrameLabel object contains properties that specify a frame number and the corresponding label name.
     * The MovieClip class includes a currentLabels property,
     * which is an Array of FrameLabel objects for the current scene.
     * If the MovieClip instance does not use scenes,
     * the Array includes all frame labels from the entire MovieClip instance.
     *
     * @example <caption>Example usage of FrameLabel.</caption>
     * // static BlendMode
     * const {FrameLabel} = next2d.display;
     * const frameLabel = new FrameLabel();
     * frameLabel.addEventListener(Event.FRAME_LABEL, function (event)
     * {
     *     // more...
     * }
     *
     * @param {string} name
     * @param {number} frame
     *
     * @constructor
     * @public
     */
    constructor (name, frame)
    {
        super();

        /**
         * @type {string}
         * @private
         */
        this._$name = `${name}`;

        /**
         * @type {number}
         * @private
         */
        this._$frame = frame|0;
    }

    /**
     * @description 指定されたクラスのストリングを返します。
     *              Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default [class FrameLabel]
     * @method
     * @static
     */
    static toString()
    {
        return "[class FrameLabel]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return  {string}
     * @default next2d.display:FrameLabel
     * @const
     * @static
     */
    static get namespace ()
    {
        return "next2d.display:FrameLabel";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return  {string}
     * @default [object FrameLabel]
     * @method
     * @public
     */
    toString ()
    {
        return "[object FrameLabel]";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @return  {string}
     * @default next2d.display:FrameLabel
     * @const
     * @static
     */
    get namespace ()
    {
        return "next2d.display:FrameLabel";
    }

    /**
     * @description ラベルを含むフレームの番号。
     *              The frame number containing the label.
     *
     * @return  {number}
     * @method
     * @readonly
     * @public
     */
    get frame ()
    {
        return this._$frame;
    }

    /**
     * @description ラベルの名前。
     *              The name of the label.
     *
     * @return  {string}
     * @method
     * @readonly
     * @public
     */
    get name ()
    {
        return this._$name;
    }
}
/**
 * @class
 * @memberOf next2d.display
 */
class GradientType
{
    /**
     * GradientType クラスは、type パラメーター（next2d.display.Graphics クラスの beginGradientFill() メソッドおよび
     * lineGradientStyle() メソッド内のパラメーター）に値を提供します。
     *
     * The GradientType class provides values for the type parameter in the beginGradientFill()
     * and lineGradientStyle() methods of the flash.display.Graphics class.
     *
     * @constructor
     * @public
     */
    constructor () {}

    /**
     * @description 指定されたクラスのストリングを返します。
     *              Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default [class GradientType]
     * @method
     * @static
     */
    static toString()
    {
        return "[class GradientType]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return  {string}
     * @default next2d.display:GradientType
     * @const
     * @static
     */
    static get namespace ()
    {
        return "next2d.display:GradientType";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return  {string}
     * @default [object GradientType]
     * @method
     * @public
     */
    toString ()
    {
        return "[object GradientType]";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @return  {string}
     * @default next2d.display:GradientType
     * @const
     * @static
     */
    get namespace ()
    {
        return "next2d.display:GradientType";
    }

    /**
     * @description 線状グラデーションの塗りを指定する値です。
     *              Value used to specify a linear gradient fill.
     *
     * @return  {string}
     * @default linear
     * @const
     * @static
     */
    static get LINEAR ()
    {
        return "linear";
    }

    /**
     * @description 放射状グラデーションの塗りを指定する値です。
     *              Value used to specify a radial gradient fill.
     *
     * @return  {string}
     * @default radial
     * @const
     * @static
     */
    static get RADIAL ()
    {
        return "radial";
    }
}
/**
 * @class
 * @memberOf next2d.display
 */
class Graphics
{
    /**
     * Graphics クラスには、ベクターシェイプの作成に使用できる一連のメソッドがあります。
     * 描画をサポートする表示オブジェクトには、Sprite および Shape オブジェクトがあります。
     * これらの各クラスには、Graphics オブジェクトである graphics プロパティがあります。
     * 以下は、簡単に使用できるように用意されているヘルパー関数の一例です。
     * drawRect()、drawRoundRect()、drawCircle()、および drawEllipse()。
     *
     * The Graphics class contains a set of methods that you can use to create a vector shape.
     * Display objects that support drawing include Sprite and Shape objects.
     * Each of these classes includes a graphics property that is a Graphics object.
     * The following are among those helper functions provided for ease of use:
     * drawRect(), drawRoundRect(), drawCircle(), and drawEllipse().
     *
     * @constructor
     * @public
     */
    constructor ()
    {
        this._$maxAlpha      = 0;
        this._$displayObject = null;
        this._$data          = Util.$getArray();
        this._$fills         = Util.$getArray();
        this._$lines         = Util.$getArray();
        this._$fillStyle     = null;
        this._$lineStyle     = null;
        this._$lineStack     = Util.$getArray();
        this._$pixels        = Util.$getMap();
        this._$lineWidth     = 0;
        this._$miterLimit    = 0;
        this._$caps          = null;
        this._$bounds        = null;
        this._$edgeBounds    = null;
        this._$fillBounds    = null;
        this._$lineBounds    = null;
        this._$doFill        = false;
        this._$doLine        = false;
        this._$pointer       = { "x": 0, "y": 0 };
        this._$lineStart     = { "x": 0, "y": 0 };
        this._$canDraw       = false;

    }

    /**
     * @description 指定されたクラスのストリングを返します。
     *              Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default [class Graphics]
     * @method
     * @static
     */
    static toString()
    {
        return "[class Graphics]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return  {string}
     * @default next2d.display:Bitmap
     * @const
     * @static
     */
    static get namespace ()
    {
        return "next2d.display:Graphics";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return  {string}
     * @default [object Graphics]
     * @method
     * @public
     */
    toString ()
    {
        return "[object Graphics]";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @return  {string}
     * @default next2d.display:Graphics
     * @const
     * @static
     */
    get namespace ()
    {
        return "next2d.display:Graphics";
    }

    /**
     * @return {number}
     * @default 0
     * @const
     * @static
     */
    static get MOVE_TO ()
    {
        return 0;
    }

    /**
     * @return {number}
     * @default 1
     * @const
     * @static
     */
    static get CURVE_TO ()
    {
        return 1;
    }

    /**
     * @return {number}
     * @default 2
     * @const
     * @static
     */
    static get LINE_TO ()
    {
        return 2;
    }

    /**
     * @return {number}
     * @default 3
     * @const
     * @static
     */
    static get CUBIC ()
    {
        return 3;
    }

    /**
     * @return {number}
     * @default 4
     * @const
     * @static
     */
    static get ARC ()
    {
        return 4;
    }

    /**
     * @return {number}
     * @default 5
     * @const
     * @static
     */
    static get FILL_STYLE ()
    {
        return 5;
    }

    /**
     * @return {number}
     * @default 6
     * @const
     * @static
     */
    static get STROKE_STYLE ()
    {
        return 6;
    }

    /**
     * @return {number}
     * @default 7
     * @const
     * @static
     */
    static get END_FILL ()
    {
        return 7;
    }

    /**
     * @return {number}
     * @default 8
     * @const
     * @static
     */
    static get END_STROKE ()
    {
        return 8;
    }

    /**
     * @return {number}
     * @default 9
     * @const
     * @static
     */
    static get BEGIN_PATH ()
    {
        return 9;
    }

    /**
     * @return {number}
     * @default 10
     * @const
     * @static
     */
    static get GRADIENT_FILL ()
    {
        return 10;
    }

    /**
     * @return {number}
     * @default 11
     * @const
     * @static
     */
    static get GRADIENT_STROKE ()
    {
        return 11;
    }

    /**
     * @return {number}
     * @default 12
     * @const
     * @static
     */
    static get CLOSE_PATH ()
    {
        return 12;
    }

    /**
     * @return {number}
     * @default 13
     * @const
     * @static
     */
    static get BITMAP_FILL ()
    {
        return 13;
    }

    /**
     * TODO
     * @description 描画領域をビットマップイメージで塗りつぶします。
     *              Fills a drawing area with a bitmap image.
     *
     * @param {BitmapData} bitmap_data
     * @param {Matrix}     [matrix=null]
     * @param {boolean}    [repeat=true]
     * @param {boolean}    [smooth=false]
     * @method
     * @public
     */
    beginBitmapFill (bitmap_data, matrix = null, repeat = true, smooth = false)
    {
        this._$maxAlpha = 1;

        // init fill style
        this.endFill();

        // beginPath
        this._$fills.push(Util.$getArray(Graphics.BEGIN_PATH));
    }

    /**
     * @description 描画のときに他の Graphics メソッド（lineTo() や drawCircle() など）
     *              に対する今後の呼び出しに使用する単純な一色塗りを指定します。
     *              Specifies a simple one-color fill that subsequent calls
     *              to other Graphics methods (such as lineTo() or drawCircle()) use when drawing.
     *
     * @param  {string|number} color
     * @param  {number} [alpha=1.0]
     * @return {Graphics}
     * @method
     * @public
     */
    beginFill (color, alpha = 1)
    {
        // valid
        color = Util.$clamp(Util.$toColorInt(color), 0, 0xffffff, 0);
        alpha = Util.$clamp(alpha, 0, 1, 1);

        this._$maxAlpha = Util.$max(this._$maxAlpha, alpha);

        // end fill
        this.endFill();

        // beginPath
        this._$fills.push(Util.$getArray(Graphics.BEGIN_PATH));

        // add Fill Style
        const object = Util.$intToRGBA(color, alpha);
        this._$fillStyle = Util.$getArray(
            Graphics.FILL_STYLE,
            object.R, object.G, object.B, object.A
        );

        // start
        this._$doFill = true;

        return this;
    }

    /**
     * TODO
     * @description Graphics の他のメソッド（lineTo()、drawCircle() など）に対する、
     *              オブジェクトの後続の呼び出しに使用するグラデーション塗りを指定します。
     *              Specifies a gradient fill used by subsequent calls
     *              to other Graphics methods (such as lineTo() or drawCircle()) for the object.
     *
     * @param  {string} type
     * @param  {array}  colors
     * @param  {array}  alphas
     * @param  {array}  ratios
     * @param  {Matrix} [matrix=null]
     * @param  {string} [spread_method=pad]
     * @param  {string} [interpolation_method=rgb]
     * @param  {number} [focal_point_ratio=0]
     * @return {Graphics}
     * @method
     * @public
     */
    beginGradientFill (
        type, colors, alphas, ratios, matrix = null,
        spread_method = "pad", interpolation_method = "rgb", focal_point_ratio = 0
    ) {

    }

    /**
     * @description この Graphics オブジェクトに描画されているグラフィックをクリアし、
     *              塗りと線のスタイルの設定をリセットします。
     *              Clears the graphics that were drawn to this Graphics object,
     *              and resets fill and line style settings.
     *
     * @return {void}
     * @method
     * @public
     */
    clear ()
    {
        // origin param clear
        this._$maxAlpha     = 0;
        this._$lineWidth    = 0;
        this._$caps         = null;
        this._$fillBounds   = null;
        this._$lineBounds   = null;
        this._$doFill       = false;
        this._$doLine       = false;
        this._$pointer.x    = 0;
        this._$pointer.y    = 0;
        this._$lineStart.x  = 0;
        this._$lineStart.y  = 0;
        this._$canDraw      = false;
        this._$fillStyle    = null;
        this._$lineStyle    = null;

        // reset array
        if (this._$data.length) {
            this._$data.length = 0;
        }
        if (this._$fills.length) {
            this._$fills.length = 0;
        }
        if (this._$lines.length) {
            this._$lines.length = 0;
        }
        if (this._$pixels.size) {
            this._$pixels.clear();
        }

        // restart
        this._$restart();
    }

    /**
     * TODO
     * @description すべての描画コマンドをソース Graphics オブジェクトから、呼び出し Graphics オブジェクトにコピーします。
     *              Copies all of drawing commands from the source Graphics object into the calling Graphics object.
     *
     * @return {Graphics}
     * @method
     * @public
     */
    clone ()
    {

    }

    /**
     * @description 現在の描画位置から指定されたアンカーポイントに 3 次ベジェ曲線を描画します。
     *              Draws a cubic Bezier curve from the current drawing position to the specified anchor point.
     *
     * @param  {number} control_x1
     * @param  {number} control_y1
     * @param  {number} control_x2
     * @param  {number} control_y2
     * @param  {number} anchor_x
     * @param  {number} anchor_y
     * @return {Graphics}
     * @method
     * @public
     */
    cubicCurveTo (
        control_x1, control_y1, control_x2, control_y2,
        anchor_x, anchor_y
    ) {

        anchor_x = +anchor_x * Util.$TWIPS || 0;
        anchor_y = +anchor_y * Util.$TWIPS || 0;

        if (this._$pointer.x === anchor_x && this._$pointer.y === anchor_y) {
            return this;
        }

        control_x1 = +control_x1 * Util.$TWIPS || 0;
        control_y1 = +control_y1 * Util.$TWIPS || 0;
        control_x2 = +control_x2 * Util.$TWIPS || 0;
        control_y2 = +control_y2 * Util.$TWIPS || 0;

        // set bounds
        this._$setBounds(
            control_x1, control_y1,
            control_x2, control_y2,
            anchor_x,   anchor_y
        );

        this._$margePath(Util.$getArray(
            Graphics.CUBIC,
            control_x1, control_y1,
            control_x2, control_y2,
            anchor_x, anchor_y
        ));

        this._$pointer.x = anchor_x;
        this._$pointer.y = anchor_y;

        // restart
        this._$restart();

        return this;
    }

    /**
     * @description (controlX, controlY) で指定されたコントロールポイントを使用し、
     *              現在の描画位置から (anchorX, anchorY) まで、現在の線のスタイルで 2 次ベジェ曲線を描画します。
     *              Draws a quadratic Bezier curve using the current line style from
     *              the current drawing position to (anchorX, anchorY)
     *              and using the control point that (controlX, controlY) specifies.
     *
     * @param  {number} control_x
     * @param  {number} control_y
     * @param  {number} anchor_x
     * @param  {number} anchor_y
     * @return {Graphics}
     * @method
     * @public
     */
    curveTo (control_x, control_y, anchor_x, anchor_y)
    {

        anchor_x = +anchor_x * Util.$TWIPS || 0;
        anchor_y = +anchor_y * Util.$TWIPS || 0;

        if (this._$pointer.x === anchor_x && this._$pointer.y === anchor_y) {
            return this;
        }

        control_x = +control_x * Util.$TWIPS || 0;
        control_y = +control_y * Util.$TWIPS || 0;

        this._$setBounds(
            control_x, control_y,
            anchor_x,  anchor_y
        );

        this._$margePath(Util.$getArray(
            Graphics.CURVE_TO,
            control_x, control_y,
            anchor_x, anchor_y
        ));

        this._$pointer.x = anchor_x;
        this._$pointer.y = anchor_y;

        // restart
        this._$restart();

        return this;
    }

    /**
     * @description 円を描画します。
     *              Draws a circle.
     *
     * @param  {number} x
     * @param  {number} y
     * @param  {number} radius
     * @return {Graphics}
     * @method
     * @public
     */
    drawCircle (x, y, radius)
    {
        x      = +x * Util.$TWIPS || 0;
        y      = +y * Util.$TWIPS || 0;
        radius = +radius * Util.$TWIPS || 0;

        this._$setBounds(
            x - radius, y - radius,
            x + radius, y + radius
        );

        this._$margePath(Util.$getArray(
            Graphics.ARC,
            x, y, radius
        ));

        this._$pointer.x = x;
        this._$pointer.y = y;

        // restart
        this._$restart();

        return this;
    }

    /**
     * @description 楕円を描画します。
     *              Draws an ellipse.
     *
     * @param  {number} x
     * @param  {number} y
     * @param  {number} width
     * @param  {number} height
     * @return {Graphics}
     * @method
     * @public
     */
    drawEllipse (x, y, width, height)
    {
        x = +x || 0;
        y = +y || 0;
        width  = +width  || 0;
        height = +height || 0;

        const hw = width  / 2; // half width
        const hh = height / 2; // half height
        const x0 = x + hw;
        const y0 = y + hh;
        const x1 = x + width;
        const y1 = y + height;
        const c  = 1.3333333333333333 * (Util.$SQRT2 - 1); // 4 / 3
        const cw = c * hw;
        const ch = c * hh;

        this.moveTo(x0, y);
        this.cubicCurveTo(x0 + cw, y,       x1,      y0 - ch, x1, y0);
        this.cubicCurveTo(x1,      y0 + ch, x0 + cw, y1,      x0, y1);
        this.cubicCurveTo(x0 - cw, y1,      x,       y0 + ch, x,  y0);
        this.cubicCurveTo(x,       y0 - ch, x0 - cw, y,       x0, y );

        return this;
    }

    /**
     * @description 矩形を描画します。
     *              Draws a rectangle.
     *
     * @param  {number} x
     * @param  {number} y
     * @param  {number} width
     * @param  {number} height
     * @return {Graphics}
     * @method
     * @public
     */
    drawRect (x, y, width, height)
    {
        // valid
        x = +x || 0;
        y = +y || 0;

        width  = +width  || 0;
        height = +height || 0;

        const xMax = x + width;
        const yMax = y + height;

        this
            .moveTo(x,    y)
            .lineTo(xMax, y)
            .lineTo(xMax, yMax)
            .lineTo(x,    yMax)
            .lineTo(x,    y);

        return this;
    }

    /**
     * @description 角丸矩形を描画します。
     *              Draws a rounded rectangle.
     *
     * @param  {number} x
     * @param  {number} y
     * @param  {number} width
     * @param  {number} height
     * @param  {number} ellipse_width
     * @param  {number} [ellipse_height=NaN]
     * @return {Graphics}
     * @method
     * @public
     */
    drawRoundRect (
        x, y, width, height, ellipse_width, ellipse_height = NaN
    ) {

        x = +x || 0;
        y = +y || 0;

        width  = +width  || 0;
        height = +height || 0;

        ellipse_width  = +ellipse_width  || 0;
        ellipse_height = +ellipse_height || ellipse_width;

        const hew = ellipse_width  / 2;
        const heh = ellipse_height / 2;
        const c   = 4 / 3 * (Util.$SQRT2 - 1);
        const cw  = c * hew;
        const ch  = c * heh;

        const dx0 = x   + hew;
        const dx1 = x   + width;
        const dx2 = dx1 - hew;

        const dy0 = y   + heh;
        const dy1 = y   + height;
        const dy2 = dy1 - heh;

        this.moveTo(dx0, y);
        this.lineTo(dx2, y);
        this.cubicCurveTo(dx2 + cw, y, dx1, dy0 - ch, dx1, dy0);
        this.lineTo(dx1, dy2);
        this.cubicCurveTo(dx1, dy2 + ch, dx2 + cw, dy1, dx2, dy1);
        this.lineTo(dx0, dy1);
        this.cubicCurveTo(dx0 - cw, dy1, x, dy2 + ch, x, dy2);
        this.lineTo(x, dy0);
        this.cubicCurveTo(x, dy0 - ch, dx0 - cw, y, dx0, y);

        return this;
    }

    /**
     * @description beginFill()、beginGradientFill()、または beginBitmapFill() メソッドへの
     *              最後の呼び出し以降に追加された線と曲線に塗りを適用します。
     *              Applies a fill to the lines and curves that were added since
     *              the last call to the beginFill(), beginGradientFill(),
     *              or beginBitmapFill() method.
     *
     * @return {Graphics}
     * @method
     * @public
     */
    endFill ()
    {
        if (this._$doFill) {

            if (this._$fillStyle) {

                this._$fills.push.apply(this._$fills, this._$fillStyle);

                if (this._$fillStyle[0] === Graphics.FILL_STYLE) {
                    this._$fills.push(Util.$getArray(Graphics.END_FILL));
                }

                Util.$poolArray(this._$fillStyle);
                this._$fillStyle = null;
            }

            if (this._$fills.length) {

                // marge
                this._$data.push.apply(this._$data, this._$fills);

                // clear
                this._$fills.length = 0;

            }

        }

        this._$doFill  = false;
        this._$canDraw = true;

        // restart
        this._$restart();

        return this;
    }

    /**
     * TODO
     * @description 線の描画で使用するグラデーションを指定します。
     *              Specifies a gradient to use for the stroke when drawing lines.
     *
     * @param  {string} type
     * @param  {array}  colors
     * @param  {array}  alphas
     * @param  {array}  ratios
     * @param  {Matrix} [matrix=null]
     * @param  {string} [spread_method=SpreadMethod.PAD]
     * @param  {string} [interpolation_method=InterpolationMethod.RGB]
     * @param  {number} [focal_point_ratio=0]
     * @return {Graphics}
     * @method
     * @public
     */
    lineGradientStyle (
        type, colors, alphas, ratios, matrix = null,
        spread_method = "pad", interpolation_method = "rgb", focal_point_ratio = 0
    ) {

    }

    /**
     * TODO
     * @description lineTo() メソッドや drawCircle() メソッドなど、
     *              Graphics のメソッドの後続の呼び出しに使用する線スタイルを指定します。
     *              Specifies a line style used for subsequent calls
     *              to Graphics methods such as the lineTo() method
     *              or the drawCircle() method.
     *
     * @param  {number}  [thickness=NaN]
     * @param  {number}  [color=0]
     * @param  {number}  [alpha=1]
     * @param  {boolean} [pixel_hinting=false]
     * @param  {string}  [scale_mode=LineScaleMode.NORMAL]
     * @param  {string}  [caps=null]
     * @param  {string}  [joints=null]
     * @param  {number}  [miter_limit=3]
     * @return {Graphics}
     * @method
     * @public
     */
    lineStyle (
        thickness = NaN, color = 0, alpha = 1, pixel_hinting = false,
        scale_mode = "normal", caps = null, joints = null, miter_limit = 3
    ) {


    }

    /**
     * @description 現在の描画位置から (x, y) まで、現在の線のスタイルを使用して線を描画します。
     *              その後で、現在の描画位置は (x, y) に設定されます。
     *              Draws a line using the current line style from the current drawing position to (x, y);
     *              the current drawing position is then set to (x, y).
     *
     * @param   {number} x
     * @param   {number} y
     * @returns {Graphics}
     * @method
     * @public
     */
    lineTo (x, y)
    {
        x = +x * Util.$TWIPS || 0;
        y = +y * Util.$TWIPS || 0;

        if (this._$pointer.x === x && this._$pointer.y === y) {
            return this;
        }

        this._$setBounds(x, y);

        this._$margePath(Util.$getArray(Graphics.LINE_TO, x, y));

        this._$pointer.x = x;
        this._$pointer.y = y;

        // restart
        this._$restart();

        return this;
    }

    /**
     * @description 現在の描画位置を (x, y) に移動します。
     *              Moves the current drawing position to (x, y).
     *
     * @param   {number} x
     * @param   {number} y
     * @returns {Graphics}
     * @method
     * @public
     */
    moveTo (x, y)
    {
        x = +x * Util.$TWIPS || 0;
        y = +y * Util.$TWIPS || 0;

        this._$pointer.x = x;
        this._$pointer.y = y;

        this._$setBounds(x, y);

        this._$margePath(Util.$getArray(Graphics.MOVE_TO, x, y));

        // restart
        this._$restart();

        return this;
    }

    /**
     * @param  {CanvasToWebGLContext} context
     * @param  {Float32Array}  matrix
     * @param  {Float32Array}  color_transform
     * @param  {string} [blend_mode=BlendMode.NORMAL]
     * @param  {array}  [filters=null]
     * @return {void}
     * @method
     * @private
     */
    _$draw (
        context, matrix, color_transform,
        blend_mode = BlendMode.NORMAL, filters = null
    ) {

        if (!this._$maxAlpha) {
            return ;
        }

        const boundsBase = this._$getBounds();
        if (!boundsBase) {
            return ;
        }

        const displayObject = this._$displayObject;

        // set grid data
        let hasGrid = displayObject._$scale9Grid !== null;

        // 9スライスを有効にしたオブジェクトが回転・傾斜成分を含む場合は、9スライスは無効になる
        let parentMatrix = null;
        if (hasGrid) {
            parentMatrix = displayObject._$transform._$rawMatrix();
            hasGrid = hasGrid
                && (Util.$abs(parentMatrix[1]) < 0.001)
                && (Util.$abs(parentMatrix[2]) < 0.0001);
        }

        // size
        const bounds = Util.$boundsMatrix(boundsBase, matrix);
        const xMax   = +bounds.xMax;
        const xMin   = +bounds.xMin;
        const yMax   = +bounds.yMax;
        const yMin   = +bounds.yMin;
        Util.$poolBoundsObject(bounds);


        let width  = Util.$ceil(Util.$abs(xMax - xMin));
        let height = Util.$ceil(Util.$abs(yMax - yMin));
        if (!width || !height) {
            return;
        }

        if (0 > (xMin + width) || 0 > (yMin + height)) {
            return;
        }

        // cache current buffer
        const currentBuffer = context.frameBuffer.currentAttachment;
        if (xMin > currentBuffer.width || yMin > currentBuffer.height) {
            return;
        }


        // resize
        const textureScale = context._$textureScale(width, height);
        if (textureScale < 1) {
            width  *= textureScale;
            height *= textureScale;
        }

        const cacheColor   = color_transform[3];
        color_transform[3] = 1;

        // get cache
        const id        = displayObject._$instanceId;
        const cacheKeys = Util
            .$cacheStore()
            .generateShapeKeys(id, matrix, color_transform);

        // cache
        let texture = Util.$cacheStore().get(cacheKeys);
        if (!texture) {

            // create cache buffer
            const buffer = context
                .frameBuffer
                .createCacheAttachment(width, height, true);
            context._$bind(buffer);


            // reset
            Util.$resetContext(context);
            context.setTransform(
                matrix[0], matrix[1], matrix[2], matrix[3],
                matrix[4] - xMin,
                matrix[5] - yMin
            );

            if (hasGrid) {
                const player = Util.$currentPlayer();
                const mScale = player._$scale * player._$ratio / 20;
                const baseMatrix = Util.$getFloat32Array(mScale, 0, 0, mScale, 0, 0);

                const pMatrix = Util.$multiplicationMatrix(
                    baseMatrix, parentMatrix
                );

                Util.$poolFloat32Array(baseMatrix);

                const aMatrixBase = displayObject
                    ._$parent
                    ._$transform
                    ._$calculateConcatenatedMatrix()
                    ._$matrix;

                const aMatrix = Util.$getFloat32Array(
                    aMatrixBase[0], aMatrixBase[1], aMatrixBase[2], aMatrixBase[3],
                    aMatrixBase[4] * mScale - xMin,
                    aMatrixBase[5] * mScale - yMin
                );

                const apMatrix = Util.$multiplicationMatrix(aMatrix, pMatrix);
                const aOffsetX = apMatrix[4] - (matrix[4] - xMin);
                const aOffsetY = apMatrix[5] - (matrix[5] - yMin);
                Util.$poolFloat32Array(apMatrix);

                const parentBounds = Util.$boundsMatrix(boundsBase, pMatrix);
                const parentXMax   = +parentBounds.xMax;
                const parentXMin   = +parentBounds.xMin;
                const parentYMax   = +parentBounds.yMax;
                const parentYMin   = +parentBounds.yMin;
                const parentWidth  = Util.$ceil(Util.$abs(parentXMax - parentXMin));
                const parentHeight = Util.$ceil(Util.$abs(parentYMax - parentYMin));

                Util.$poolBoundsObject(parentBounds);

                context.grid.enable(
                    parentXMin, parentYMin, parentWidth, parentHeight,
                    boundsBase, displayObject._$scale9Grid,
                    pMatrix[0], pMatrix[1], pMatrix[2], pMatrix[3], pMatrix[4], pMatrix[5],
                    aMatrix[0], aMatrix[1], aMatrix[2], aMatrix[3], aMatrix[4] - aOffsetX, aMatrix[5] - aOffsetY
                );

                Util.$poolFloat32Array(pMatrix);
                Util.$poolFloat32Array(aMatrix);
            }

            this._$doDraw(context, color_transform, false);

            if (hasGrid) {
                context.grid.disable();
            }

            texture = context
                .frameBuffer
                .getTextureFromCurrentAttachment();

            // set cache
            Util.$cacheStore().set(cacheKeys, texture);

            // release buffer
            context.frameBuffer.releaseAttachment(buffer, false);

            // end draw and reset current buffer
            context._$bind(currentBuffer);

        }
        color_transform[3] = cacheColor;

        let isFilter = false;
        let offsetX  = 0;
        let offsetY  = 0;
        if (filters) {

            const canApply = displayObject._$canApply(filters);
            if (canApply) {

                isFilter = true;

                const cacheKeys = [displayObject._$instanceId, "f"];
                let cache = Util.$cacheStore().get(cacheKeys);

                const updated = displayObject._$isFilterUpdated(
                    width, height, matrix, color_transform, filters, canApply
                );

                if (!cache || updated) {

                    // cache clear
                    if (cache) {

                        Util.$cacheStore().set(cacheKeys, null);
                        cache.layerWidth     = 0;
                        cache.layerHeight    = 0;
                        cache._$offsetX      = 0;
                        cache._$offsetY      = 0;
                        cache.matrix         = null;
                        cache.colorTransform = null;
                        context.frameBuffer.releaseTexture(cache);

                        cache = null;
                    }


                    const currentAttachment = context.frameBuffer.currentAttachment;

                    const buffer = context
                        .frameBuffer
                        .createCacheAttachment(width, height, false);
                    context._$bind(buffer);

                    const mat = Util.$autopoolMatrixArray(Util.$multiplicationMatrix(
                        matrix, Util.$MATRIX_ARRAY_20_0_0_20_0_0
                    ));


                    Util.$resetContext(context);
                    context.setTransform(mat[0], mat[1], mat[2], mat[3], mat[4] - xMin, mat[5] - yMin);
                    context.drawImage(texture, 0, 0, texture.width, texture.height, color_transform);

                    const targetTexture = context
                        .frameBuffer
                        .getTextureFromCurrentAttachment()

                    context._$bind(currentAttachment);

                    texture = displayObject._$getFilterTexture(
                        context, filters, targetTexture, matrix, color_transform
                    );

                    context
                        .frameBuffer
                        .releaseAttachment(buffer, true);

                    Util.$cacheStore().set(cacheKeys, texture);

                }

                if (cache) {
                    texture = cache;
                }

                Util.$poolArray(cacheKeys);

                offsetX = texture._$offsetX;
                offsetY = texture._$offsetY;
            }

        }

        // reset
        Util.$resetContext(context);

        // draw
        context._$globalAlpha = alpha;
        context._$imageSmoothingEnabled = true;
        context._$globalCompositeOperation = blend_mode;

        if (isFilter) {
            context.setTransform(1, 0, 0, 1, matrix[4], matrix[5]);
            context.drawImage(texture,
                -offsetX - (matrix[4] - xMin), -offsetY - (matrix[5] - yMin),
                texture.width, texture.height, color_transform
            );
        } else {
            context.setTransform(1, 0, 0, 1, 0, 0);
            context.drawImage(texture, xMin, yMin, width, height, color_transform);
        }

        // pool
        Util.$poolArray(cacheKeys);
        if (parentMatrix) {
            Util.$poolMatrix(parentMatrix);
        }
        Util.$poolBoundsObject(boundsBase);

    }

    /**
     * @return {object}
     * @method
     * @private
     */
    _$getBounds ()
    {
        const displayObject = this._$displayObject;
        if (displayObject && displayObject._$bounds) {
            return Util.$getBoundsObject(
                displayObject._$bounds.xMin, displayObject._$bounds.xMax,
                displayObject._$bounds.yMin, displayObject._$bounds.yMax
            );
        }

        // size zero
        if (!this._$fillBounds && !this._$lineBounds) {
            return null;
        }

        // build bounds
        if (!this._$bounds) {

            // init
            const no = Util.$MAX_VALUE;

            this._$bounds = Util.$getBoundsObject(no, -no, no, -no);

            // fill bounds
            if (this._$fillBounds) {

                this._$bounds.xMin = Util.$min(this._$bounds.xMin, this._$fillBounds.xMin);
                this._$bounds.xMax = Util.$max(this._$bounds.xMax, this._$fillBounds.xMax);
                this._$bounds.yMin = Util.$min(this._$bounds.yMin, this._$fillBounds.yMin);
                this._$bounds.yMax = Util.$max(this._$bounds.yMax, this._$fillBounds.yMax);

            }

            // line bounds
            if (this._$lineBounds) {

                this._$bounds.xMin = Util.$min(this._$bounds.xMin, this._$lineBounds.xMin);
                this._$bounds.xMax = Util.$max(this._$bounds.xMax, this._$lineBounds.xMax);
                this._$bounds.yMin = Util.$min(this._$bounds.yMin, this._$lineBounds.yMin);
                this._$bounds.yMax = Util.$max(this._$bounds.yMax, this._$lineBounds.yMax);

            }

        }

        return Util.$getBoundsObject(
            this._$bounds.xMin, this._$bounds.xMax,
            this._$bounds.yMin, this._$bounds.yMax
        );
    }




    /**
     * @return {void}
     * @method
     * @private
     */
    _$restart ()
    {
        this._$command = null;

        if (this._$bounds) {
            Util.$poolBoundsObject(this._$bounds);
            this._$bounds = null;
        }

        if (!this._$displayObject._$isUpdated()) {
            Util.$isUpdated = true;
            this._$displayObject._$doChanged();
            Util
                .$cacheStore()
                .removeCache(
                    this._$displayObject._$characterId
                    || this._$displayObject._$instanceId
                );
        }
    }

    /**
     * @return {void}
     * @method
     * @private
     */
    _$setBounds ()
    {
        const length = arguments.length;
        for (let idx = 0; idx < length; idx += 2) {

            const x = arguments[idx];
            const y = arguments[idx + 1];

            this._$setFillBounds(x, y);
            if (this._$doLine) {
                this._$setLineBounds(x, y);
            }

        }

    }

    /**
     * @param  {number} x
     * @param  {number} y
     * @return {void}
     * @method
     * @private
     */
    _$setFillBounds (x, y)
    {

    }

    /**
     * @param  {number} x
     * @param  {number} y
     * @return {void}
     * @method
     * @private
     */
    _$setLineBounds (x, y)
    {

    }

    /**
     * @param {array} data
     * @method
     * @private
     */
    _$margePath = function (data)
    {
        if (this._$doFill) {
            this._$fills.push.apply(this._$fills, data);
        }

        if (this._$doLine) {
            this._$lines.push.apply(this._$lines, data);
        }

        Util.$poolArray(data);
    }


    _$buildCommand ()
    {

    }
}
/**
 * @class
 * @memberOf next2d.display
 */
class InterpolationMethod
{
    /**
     * InterpolationMethod クラスは、interpolationMethod パラメーター（Graphics.beginGradientFill()
     * および Graphics.lineGradientStyle() メソッドのパラメーター）の値を提供します。
     * このパラメーターは、グラデーションをレンダリングするときに使用する RGB スペースを決定します。
     *
     * The InterpolationMethod class provides values for the interpolationMethod parameter 
     * in the Graphics.beginGradientFill() and Graphics.lineGradientStyle() methods. 
     * This parameter determines the RGB space to use when rendering the gradient.
     *
     * @constructor
     * @public
     */
    constructor () {}

    /**
     * @description 指定されたクラスのストリングを返します。
     *              Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default [class InterpolationMethod]
     * @method
     * @static
     */
    static toString()
    {
        return "[class InterpolationMethod]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return  {string}
     * @default next2d.display:InterpolationMethod
     * @const
     * @static
     */
    static get namespace ()
    {
        return "next2d.display:InterpolationMethod";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return  {string}
     * @default [object InterpolationMethod]
     * @method
     * @public
     */
    toString ()
    {
        return "[object InterpolationMethod]";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @return  {string}
     * @default next2d.display:InterpolationMethod
     * @const
     * @static
     */
    get namespace ()
    {
        return "next2d.display:InterpolationMethod";
    }

    /**
     * @description 線形 RGB 補間メソッドを使用することを指定します。
     *              Specifies that the linear RGB interpolation method should be used.
     *
     * @return  {string}
     * @default linearRGB
     * @const
     * @static
     */
    static get LINEAR_RGB ()
    {
        return "linearRGB";
    }

    /**
     * @description RGB 補間メソッドを使用することを指定します。
     *              Specifies that the RGB interpolation method should be used.
     *
     * @return  {string}
     * @default rgb
     * @const
     * @static
     */
    static get RGB ()
    {
        return "rgb";
    }
}
/**
 * @class
 * @memberOf next2d.display
 */
class JointStyle
{
    /**
     * JointStyle クラスは、線の描画で使用される結合スタイルを指定する定数値の列挙です。
     * これらの定数は、joints パラメーター（next2d.display.Graphics.lineStyle() メソッドのパラメーター）の値として使用されます。
     * このメソッドは、マイター、ラウンド、ベベルの 3 種類の結合をサポートします。
     *
     * The JointStyle class is an enumeration of constant values that specify the joint style to use in drawing lines.
     * These constants are provided for use as values in the joints parameter of the next2d.display.Graphics.lineStyle() method.
     * The method supports three types of joints: miter, round, and bevel, as the following
     *
     * @constructor
     * @public
     */
    constructor () {}

    /**
     * @description 指定されたクラスのストリングを返します。
     *              Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default [class JointStyle]
     * @method
     * @static
     */
    static toString()
    {
        return "[class JointStyle]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return  {string}
     * @default next2d.display:JointStyle
     * @const
     * @static
     */
    static get namespace ()
    {
        return "next2d.display:JointStyle";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return  {string}
     * @default [object JointStyle]
     * @method
     * @public
     */
    toString ()
    {
        return "[object JointStyle]";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @return  {string}
     * @default next2d.display:JointStyle
     * @const
     * @static
     */
    get namespace ()
    {
        return "next2d.display:JointStyle";
    }

    /**
     * @description next2d.display.Graphics.lineStyle() メソッドの joints パラメーターでベベル結合を指定します。
     *              Specifies beveled joints in the joints parameter of
     *              the next2d.display.Graphics.lineStyle() method.
     *
     * @return  {string}
     * @default bevel
     * @const
     * @static
     */
    static get BEVEL ()
    {
        return "bevel";
    }

    /**
     * @description next2d.display.Graphics.lineStyle() メソッドの joints パラメーターでマイター結合を指定します。
     *              Specifies mitered joints in the joints parameter of
     *              the next2d.display.Graphics.lineStyle() method.
     *
     * @return  {string}
     * @default miter
     * @const
     * @static
     */
    static get MITER ()
    {
        return "miter";
    }

    /**
     * @description next2d.display.Graphics.lineStyle() メソッドの joints パラメーターでラウンド結合を指定します。
     *              Specifies round joints in the joints parameter of
     *              the next2d.display.Graphics.lineStyle() method.
     *
     * @return  {string}
     * @default round
     * @const
     * @static
     */
    static get ROUND ()
    {
        return "round";
    }
}
/**
 * @class
 * @memberOf next2d.display
 * @extends  DisplayObjectContainer
 */
class Loader extends DisplayObjectContainer
{
    /**
     * @constructor
     * @public
     */
    constructor()
    {
        super();
    }


}
/**
 * @class
 * @memberOf next2d.display
 * @extends  EventDispatcher
 */
class LoaderInfo extends EventDispatcher
{
    /**
     * @constructor
     * @public
     */
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
class MorphShape extends DisplayObject
{
    /**
     * @constructor
     * @public
     */
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
class Shape extends DisplayObject
{
    /**
     * Shape クラスには、Graphics クラスからメソッドにアクセスできる graphics プロパティがあります。
     *
     * The Shape class includes a graphics property,
     * which lets you access methods from the Graphics class.
     *
     * @constructor
     * @public
     */
    constructor()
    {
        super();

        /**
         * @type {Graphics|null}
         * @default null
         * @private
         */
        this._$graphics = null;

        /**
         * @type {object|null}
         * @default null
         * @private
         */
        this._$bounds = null;
    }

    /**
     * @description 指定されたクラスのストリングを返します。
     *              Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default [class Shape]
     * @method
     * @static
     */
    static toString()
    {
        return "[class Shape]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return  {string}
     * @default next2d.display:Shape
     * @const
     * @static
     */
    static get namespace ()
    {
        return "next2d.display:Shape";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return  {string}
     * @default [object Shape]
     * @method
     * @public
     */
    toString ()
    {
        return "[object Shape]";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @return  {string}
     * @default next2d.display:Shape
     * @const
     * @static
     */
    get namespace ()
    {
        return "next2d.display:Shape";
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
     * @param  {object}    tag
     * @param  {object}    character
     * @param  {MovieClip} parent
     * @return {Shape}
     * @method
     * @private
     */
    _$build (tag, character, parent)
    {

    }

    /**
     * @param   {Float32Array} [matrix=null]
     * @returns {object}
     * @method
     * @private
     */
    _$getBounds (matrix = null)
    {
        if (!this._$graphics) {
            return Util.$getBoundsObject(0, 0, 0, 0);
        }

        const bounds = this._$graphics._$getBounds();
        if (!bounds) {
            Util.$poolBoundsObject(bounds);
            return Util.$getBoundsObject(0, 0, 0, 0);
        }

        if (matrix) {

            const tMatrix = Util.$multiplicationMatrix(
                matrix, this._$transform._$rawMatrix()
            );

            const result = Util.$boundsMatrix(bounds, tMatrix);
            Util.$poolBoundsObject(bounds);

            return result;
        }

        const result = Util.$getBoundsObject(
            bounds.xMin, bounds.xMax,
            bounds.yMin, bounds.yMax
        );
        Util.$poolBoundsObject(bounds);

        return result;
    }

    /**
     * @param  {CanvasToWebGLContext} context
     * @param  {Float32Array} matrix
     * @param  {Float32Array} color_transform
     * @return {void}
     * @method
     * @private
     */
    _$draw (context, matrix, color_transform)
    {
        if (!this._$visible) {
            return ;
        }

        let multiColor = color_transform;
        const rawColor = this._$transform._$rawColorTransform();
        if (rawColor !== Util.$COLOR_ARRAY_IDENTITY) {
            multiColor = Util.$multiplicationColor(color_transform, rawColor);
        }

        const alpha = Util.$clamp(multiColor[3] + (multiColor[7] / 255), 0, 1);
        if (!alpha) {
            if (multiColor !== color_transform) {
                Util.$poolFloat32Array(multiColor);
            }
            return ;
        }


        let multiMatrix = matrix;
        const rawMatrix = this._$transform._$rawMatrix();
        if (rawMatrix !== Util.$MATRIX_ARRAY_IDENTITY) {
            multiMatrix = Util.$multiplicationMatrix(matrix, rawMatrix);
        }


        if (this._$graphics && this._$graphics._$canDraw) {

            const filters   = this._$filters   || this.filters;
            const blendMode = this._$blendMode || this.blendMode;

            this
                ._$graphics
                ._$draw(context, multiMatrix, multiColor, blendMode, filters);

        }

        if (multiColor !== color_transform) {
            Util.$poolFloat32Array(multiColor);
        }

        if (multiMatrix !== matrix) {
            Util.$poolFloat32Array(multiMatrix);
        }
    }

}
/**
 * @class
 * @memberOf next2d.display
 * @extends  InteractiveObject
 */
class SimpleButton extends InteractiveObject
{
    /**
     * @constructor
     * @public
     */
    constructor()
    {
        super();
    }
}
/**
 * @class
 */
class SpreadMethod
{
    /**
     * SpreadMethod クラスは、spreadMethod パラメーター（Graphics クラスの beginGradientFill() メソッド
     * および lineGradientStyle() メソッドのパラメーター）の値を提供します。
     *
     * The SpreadMethod class provides values for the spreadMethod parameter 
     * in the beginGradientFill() and lineGradientStyle() methods of the Graphics class.
     *
     * @constructor
     * @public
     */
    constructor () {}

    /**
     * @description 指定されたクラスのストリングを返します。
     *              Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default [class SpreadMethod]
     * @method
     * @static
     */
    static toString()
    {
        return "[class SpreadMethod]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return  {string}
     * @default next2d.display:SpreadMethod
     * @const
     * @static
     */
    static get namespace ()
    {
        return "next2d.display:SpreadMethod";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return  {string}
     * @default [object SpreadMethod]
     * @method
     * @public
     */
    toString ()
    {
        return "[object SpreadMethod]";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @return  {string}
     * @default next2d.display:SpreadMethod
     * @const
     * @static
     */
    get namespace ()
    {
        return "next2d.display:SpreadMethod";
    }

    /**
     * @description グラデーションで spread メソッド pad を使用することを指定します。
     *              Specifies that the gradient use the pad spread method.
     *
     * @return  {string}
     * @default pad
     * @const
     * @static
     */
    static get PAD ()
    {
        return "pad";
    }

    /**
     * @description グラデーションで spread メソッド reflect を使用することを指定します。
     *              Specifies that the gradient use the reflect spread method.
     *
     * @return  {string}
     * @default reflect
     * @const
     * @static
     */
    static get REFLECT ()
    {
        return "reflect";
    }

    /**
     * @description グラデーションで spread メソッド repeat を使用することを指定します。
     *              Specifies that the gradient use the repeat spread method.
     *
     * @return  {string}
     * @default repeat
     * @const
     * @static
     */
    static get REPEAT ()
    {
        return "repeat";
    }
}
/**
 * @class
 * @memberOf next2d.display
 * @extends  DisplayObjectContainer
 */
class Stage extends DisplayObjectContainer
{
    /**
     * Stage クラスはメイン描画領域を表します。
     * The Stage class represents the main drawing area.
     *
     * @constructor
     * @public
     */
    constructor()
    {
        super();

        /**
         * @type {number|null}
         * @default null
         * @private
         */
        this._$playerId   = null;

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

        /**
         * @type {number}
         * @default 0xffffffff
         * @private
         */
        this._$color = 0xffffffff;

        /**
         * @type {number}
         * @default 60
         * @private
         */
        this._$frameRate = 60;
    }

    /**
     * @description 指定されたクラスのストリングを返します。
     *              Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default [class Stage]
     * @method
     * @static
     */
    static toString()
    {
        return "[class Stage]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return  {string}
     * @default next2d.display:Stage
     * @const
     * @static
     */
    static get namespace ()
    {
        return "next2d.display:Stage";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return  {string}
     * @default [object Stage]
     * @method
     * @public
     */
    toString ()
    {
        return "[object Stage]";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @return  {string}
     * @default next2d.display:Stage
     * @const
     * @static
     */
    get namespace ()
    {
        return "next2d.display:Stage";
    }

    /**
     * @description 背景色です。
     *              background color.
     *
     * @member {number}
     * @public
     */
    get color ()
    {
        return this._$color;
    }
    set color (color)
    {
        this._$color = Util.$toColorInt(color);
        const player = this._$player;
        if (player) {
            const rgba = Util.$uintToRGBA(this._$color);
            player
                ._$context
                ._$setColor(
                    rgba.R / 255,
                    rgba.G / 255,
                    rgba.B / 255,
                    rgba.A / 255
                );
        }
    }

    /**
     * @description ステージのフレームレートを取得または設定します。
     *              Gets and sets the frame rate of the stage.
     *
     * @member {number}
     * @public
     */
    get frameRate ()
    {
        return this._$frameRate;
    }
    set frameRate (frame_rate)
    {
        this._$frameRate = Util.$clamp(1, 60, frame_rate, 60)
        if (this._$player && !this._$player._$stopFlag) {
            this._$player.stop();
            this._$player.play();
        }
    }

    /**
     * @description 現在のステージの高さ（ピクセル数）です。
     *              The current height, in pixels, of the Stage.
     *
     * @member {number}
     * @readonly
     * @public
     */
    get stageHeight ()
    {
        return (this._$player)
            ? this._$player._$height / this._$player._$scale / this._$player._$ratio
            : 0;
    }

    /**
     * @description ステージの現在の幅をピクセル単位で指定します。
     *              Specifies the current width, in pixels, of the Stage.
     *
     * @member {number}
     * @readonly
     * @public
     */
    get stageWidth ()
    {
        return (this._$player)
            ? this._$player._$width / this._$player._$scale / this._$player._$ratio
            : 0;
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
    invalidate ()
    {
        this._$invalidate = true;
    }

    /**
     * @return {Player}
     * @private
     */
    get _$player ()
    {
        return Util.$players[this._$playerId];
    }
}
/**
 * @class
 * @memberOf next2d.display
 */
class StageQuality
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
     * @default [class StageQuality]
     * @method
     * @static
     */
    static toString()
    {
        return "[class StageQuality]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return  {string}
     * @default next2d.display:StageQuality
     * @const
     * @static
     */
    static get namespace ()
    {
        return "next2d.display:StageQuality";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return  {string}
     * @default [object StageQuality]
     * @method
     * @public
     */
    toString ()
    {
        return "[object StageQuality]";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @return  {string}
     * @default next2d.display:StageQuality
     * @const
     * @static
     */
    get namespace ()
    {
        return "next2d.display:StageQuality";
    }
    
    /**
     * @description 高いレンダリング品質を指定します。
     *              Specifies high rendering quality.
     *
     * @return  {string}
     * @default high
     * @method
     * @static
     */
    static get HIGH ()
    {
        return "high";
    }

    /**
     * @description 低いレンダリング品質を指定します。
     *              Specifies low rendering quality.
     *
     * @return  {string}
     * @default low
     * @method
     * @static
     */
    static get LOW ()
    {
        return "low";
    }

    /**
     * @description 中程度のレンダリング品質を指定します。
     *              Specifies medium rendering quality.
     *
     * @return  {string}
     * @default medium
     * @method
     * @static
     */
    static get MEDIUM ()
    {
        return "medium";
    }
}
/**
 * @class
 * @memberOf next2d.filters
 */
class BitmapFilter
{
    /**
     * BitmapFilter クラスは、すべてのイメージフィルター効果の基本クラスです。
     * BevelFilter、BlurFilter、ColorMatrixFilter、ConvolutionFilter、DisplacementMapFilter、DropShadowFilter、GlowFilter、GradientBevelFilter、
     * および GradientGlowFilter クラスはすべて、BitmapFilter クラスを継承します。
     * このフィルター効果は、あらゆる表示オブジェクトに適用できます。
     *
     * The BitmapFilter class is the base class for all image filter effects.
     * The BevelFilter, BlurFilter, ColorMatrixFilter, ConvolutionFilter, DisplacementMapFilter, DropShadowFilter, GlowFilter, GradientBevelFilter,
     * and GradientGlowFilter classes all extend the BitmapFilter class.
     * You can apply these filter effects to any display object.
     * You can neither directly instantiate nor extend BitmapFilter.
     *
     * @constructor
     * @public
     */
    constructor()
    {
        /**
         * @type {boolean}
         * @default true
         * @private
         */
        this._$updated = true;
    }

    /**
     * @description 指定されたクラスのストリングを返します。
     *              Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default [class BitmapFilter]
     * @method
     * @static
     */
    static toString()
    {
        return "[class BitmapFilter]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return  {string}
     * @default next2d.filters:BitmapFilter
     * @const
     * @static
     */
    static get namespace ()
    {
        return "next2d.filters:BitmapFilter";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return  {string}
     * @default [object BitmapFilter]
     * @method
     * @public
     */
    toString ()
    {
        return "[object BitmapFilter]";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @return  {string}
     * @default next2d.filters:BitmapFilter
     * @const
     * @static
     */
    get namespace ()
    {
        return "next2d.filters:BitmapFilter";
    }

    /**
     * @return {boolean}
     * @method
     * @private
     */
    _$isUpdated ()
    {
        return this._$updated;
    }

    /**
     * @param {boolean} flag
     * @method
     * @private
     */
    _$doChanged (flag)
    {
        this._$updated = flag;
    }
}
/**
 * @class
 * @memberOf next2d.filters
 */
class BitmapFilterType
{
    /**
     * BitmapFilterType クラスには、BitmapFilter の型を設定する値が含まれます。
     * The BitmapFilterType class contains values to set the type of a BitmapFilter.
     *
     * @constructor
     * @public
     */
    constructor() {}

    /**
     * @description 指定されたクラスのストリングを返します。
     *              Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default [class BitmapFilterType]
     * @method
     * @static
     */
    static toString()
    {
        return "[class BitmapFilterType]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return  {string}
     * @default next2d.filters:BitmapFilterType
     * @const
     * @static
     */
    static get namespace ()
    {
        return "next2d.filters:BitmapFilterType";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return  {string}
     * @default [object BitmapFilterType]
     * @method
     * @public
     */
    toString ()
    {
        return "[object BitmapFilterType]";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @return  {string}
     * @default next2d.filters:BitmapFilterType
     * @const
     * @static
     */
    get namespace ()
    {
        return "next2d.filters:BitmapFilterType";
    }

    /**
     * @description オブジェクトの領域全体にフィルターを適用する設定を定義します。
     *              Defines the setting that applies a filter to the entire area of an object.
     *
     * @return  {string}
     * @default full
     * @const
     * @static
     */
    static get FULL ()
    {
        return "full";
    }

    /**
     * @description オブジェクトの内側の領域にフィルターを適用する設定を定義します。
     *              Defines the setting that applies a filter to the inner area of an object.
     *
     * @return  {string}
     * @default inner
     * @const
     * @static
     */
    static get INNER ()
    {
        return "inner";
    }

    /**
     * @description オブジェクトの外側の領域にフィルターを適用する設定を定義します。
     *              Defines the setting that applies a filter to the outer area of an object.
     *
     * @return  {string}
     * @default outer
     * @const
     * @static
     */
    static get OUTER ()
    {
        return "outer";
    }
}
/**
 * @class
 * @memberOf next2d.media
 */
class Sound
{
    /**
     * @constructor
     * @public
     */
    constructor()
    {

    }

}
/**
 * @class
 * @memberOf next2d.media
 */
class SoundTransform
{
    /**
     *
     * @param {number} [volume=1]
     *
     * @constructor
     * @public
     */
    constructor (volume = 1)
    {
        /**
         * @type {number}
         * @default 1
         * @private
         */
        this._$volume = volume;
    }

}
/**
 * @class
 * @memberOf next2d.net
 */
class URLRequest
{
    /**
     *
     * @param {string} [url=""]
     *
     * @constructor
     * @public
     */
    constructor (url = "")
    {
        /**
         * @type {string}
         * @default ""
         * @private
         */
        this._$url = url

        /**
         * @type {string}
         * @default application/json
         * @private
         */
        this._$contentType = "application/json";

        /**
         * @type {object|null}
         * @default null
         * @private
         */
        this._$data = null;

        /**
         * @type {string}
         * @default URLRequestMethod.GET
         * @private
         */
        this._$method = URLRequestMethod.GET;

        /**
         * @type {array}
         * @private
         */
        this._$requestHeaders  = Util.$getArray();

        /**
         * @type {string}
         * @default navigator.userAgent
         * @private
         */
        this._$userAgent = Util.$navigator.userAgent;
    }

    /**
     * @description 指定されたクラスのストリングを返します。
     *              Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default [class URLRequest]
     * @method
     * @static
     */
    static toString()
    {
        return "[class URLRequest]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return  {string}
     * @default next2d.net:URLRequest
     * @const
     * @static
     */
    static get namespace ()
    {
        return "next2d.net:URLRequest";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return  {string}
     * @default [object URLRequest]
     * @method
     * @public
     */
    toString ()
    {
        return "[object URLRequest]";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @return  {string}
     * @default next2d.net:URLRequest
     * @const
     * @static
     */
    get namespace ()
    {
        return "next2d.net:URLRequest";
    }

    /**
     * @description data プロパティのコンテンツの MIME コンテンツタイプです。
     *              The MIME content type of the content in the the data property.
     *
     * @member {string}
     * @default application/json
     * @public
     */
    get contentType ()
    {
        return this._$contentType;
    }
    set contentType (content_type)
    {
        this._$contentType = `${content_type}`;
    }

    /**
     * @description URL リクエストで送信されるデータを含むオブジェクトです。
     *              An object containing data to be transmitted with the URL request.
     *
     * @member {string|object}
     * @public
     */
    get data ()
    {
        return this._$data;
    }
    set data (data)
    {
        this._$data = data;
    }

    /**
     * @description HTTP フォーム送信メソッドを制御します。
     *              Controls the HTTP form submission method.
     *
     * @member  {string}
     * @default URLRequestMethod.GET
     * @public
     */
    get method ()
    {
        return this._$method;
    }
    set method (method)
    {
        this._$method = method;
    }

    /**
     * @description HTTP リクエストヘッダーの配列が HTTP リクエストに追加されます。
     *              The array of HTTP request headers to be appended to the HTTP request.
     *
     * @member {URLRequestHeader[]}
     * @public
     */
    get requestHeaders ()
    {
        return this._$requestHeaders;
    }
    set requestHeaders (request_headers)
    {
        this._$requestHeaders = request_headers;
    }

    /**
     * @description リクエストされる URL です。
     *              The URL to be requested.
     *
     * @member {string}
     * @public
     */
    get url ()
    {
        if (this._$url && this._$url.indexOf("//") === -1) {

            const urls = this._$url.split("/");
            if (urls[0] === "" || urls[0] === ".") {
                urls.shift();
            }

            const player = Util.$currentPlayer();
            if (player) {
                return `${player.base}${urls.join("/")}`;
            }
        }

        return this._$url;
    }
    set url (url)
    {
        this._$url = `${url}`;
    }

    /**
     * @description HTTP 要求で使用されるユーザーエージェントストリングを指定します。
     *              Specifies the user-agent string to be used in the HTTP request.
     *
     * @member {string}
     * @readonly
     * @public
     */
    get userAgent ()
    {
        return this._$userAgent;
    }

    /**
     * @description リクエストされる Header Object
     *              Header Object to be requested.
     *
     * @member {object}
     * @readonly
     * @public
     */
    get headers ()
    {
        const headers = {
            "Content-Type": `${this._$contentType}`
        };

        const length = this._$requestHeaders.length;
        for (let idx = 0; idx < length; ++idx) {

            const urlRequestHeader = this._$requestHeaders[idx];

            if (urlRequestHeader instanceof URLRequestHeader) {
                headers[urlRequestHeader.name] = urlRequestHeader.value;
            }
        }

        return headers;
    }
}
/**
 * @class
 * @memberOf next2d.net
 */
class URLRequestHeader
{
    /**
     *
     *
     * @param {string} [name=""]
     * @param {string} [value=""]
     *
     * @constructor
     * @public
     */
    constructor (name = "", value = "")
    {
        /**
         * @type {string}
         * @default ""
         * @private
         */
        this._$name = `${name}`;

        /**
         * @type {string}
         * @default ""
         * @private
         */
        this._$value = `${value}`;
    }

    /**
     * @description 指定されたクラスのストリングを返します。
     *              Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default [class URLRequestHeader]
     * @method
     * @static
     */
    static toString()
    {
        return "[class URLRequestHeader]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return  {string}
     * @default next2d.net:URLRequestHeader
     * @const
     * @static
     */
    static get namespace ()
    {
        return "next2d.net:URLRequestHeader";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return  {string}
     * @default [object URLRequestHeader]
     * @method
     * @public
     */
    toString ()
    {
        return "[object URLRequestHeader]";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @return  {string}
     * @default next2d.net:URLRequestHeader
     * @const
     * @static
     */
    get namespace ()
    {
        return "next2d.net:URLRequestHeader";
    }

    /**
     * @description HTTP リクエストヘッダー名（Content-Type や SOAPAction など）です。
     *              An HTTP request header name (such as Content-Type or SOAPAction).
     *
     * @member {string}
     * @default ""
     * @public
     */
    get name ()
    {
        return this._$name;
    }
    set name (name)
    {
        this._$name = `${name}`;
    }

    /**
     * @description name プロパティに関連付けられた値（text/plain など）です。
     *              The value associated with the name property (such as text/plain).
     *
     * @member {string}
     * @default ""
     * @public
     */
    get value ()
    {
        return this._$value;
    }
    set value (value)
    {
        this._$value = `${value}`;
    }
}
/**
 * @class
 * @memberOf next2d.net
 */
class URLRequestMethod
{
    /**
     * URLRequestMethod クラスは、URLRequest オブジェクトがデータをサーバーに送信するときに
     * POST または GET のどちらのメソッドを使用するかを指定する値を提供します。
     *
     * The URLRequestMethod class provides values that specify whether the URLRequest object should use the
     * POST method or the GET method when sending data to a server.
     *
     * @constructor
     * @public
     */
    constructor () {}

    /**
     * @description 指定されたクラスのストリングを返します。
     *              Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default [class URLRequestMethod]
     * @method
     * @static
     */
    static toString()
    {
        return "[class URLRequestMethod]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return  {string}
     * @default next2d.net:URLRequestMethod
     * @const
     * @static
     */
    static get namespace ()
    {
        return "next2d.net:URLRequestMethod";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return  {string}
     * @default [object URLRequestMethod]
     * @method
     * @public
     */
    toString ()
    {
        return "[object URLRequestMethod]";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @return  {string}
     * @default next2d.net:URLRequestMethod
     * @const
     * @static
     */
    get namespace ()
    {
        return "next2d.net:URLRequestMethod";
    }

    /**
     * @description URLRequest オブジェクトが DELETE であることを指定します。
     *              Specifies that the URLRequest object is a DELETE.
     *
     * @return  {string}
     * @default DELETE
     * @const
     * @static
     */
    static get DELETE ()
    {
        return "DELETE";
    }

    /**
     * @description URLRequest オブジェクトが GET であることを指定します。
     *              Specifies that the URLRequest object is a GET.
     *
     * @return  {string}
     * @default GET
     * @const
     * @static
     */
    static get GET ()
    {
        return "GET";
    }

    /**
     * @description URLRequest オブジェクトが HEAD であることを指定します。
     *              Specifies that the URLRequest object is a HEAD.
     *
     * @return  {string}
     * @default HEAD
     * @const
     * @static
     */
    static get HEAD ()
    {
        return "HEAD";
    }

    /**
     * @description URLRequest オブジェクトが OPTIONS であることを指定します。
     *              Specifies that the URLRequest object is OPTIONS.
     *
     * @return  {string}
     * @default OPTIONS
     * @const
     * @static
     */
    static get OPTIONS ()
    {
        return "OPTIONS";
    }

    /**
     * @description URLRequest オブジェクトが POST であることを指定します。
     *              Specifies that the URLRequest object is a POST.
     *
     * @return  {string}
     * @default POST
     * @const
     * @static
     */
    static get POST ()
    {
        return "POST";
    }

    /**
     * @description URLRequest オブジェクトが PUT であることを指定します。
     *              Specifies that the URLRequest object is a PUT.
     *
     * @return  {string}
     * @default PUT
     * @const
     * @static
     */
    static get PUT ()
    {
        return "PUT";
    }
}
/**
 * @class
 * @memberOf next2d.text
 * @extends  DisplayObject
 */
class StaticText extends DisplayObject
{
    /**
     * @constructor
     * @public
     */
    constructor()
    {
        super();
    }
}
/**
 * @class
 * @memberOf next2d.text
 * @extends  InteractiveObject
 */
class TextField extends InteractiveObject
{
    /**
     * @constructor
     * @public
     */
    constructor()
    {
        super();
    }

}
/**
 * @class
 * @memberOf next2d.text
 */
class TextFormat
{
    /**
     * @constructor
     * @public
     */
    constructor()
    {
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
        /**
         * @type {array}
         * @private
         */
        this._$pool  = Util.$getArray();

        /**
         * @type {Map}
         * @private
         */
        this._$store = Util.$getMap();

        /**
         * @type {Map}
         * @private
         */
        this._$lives = Util.$getMap();

        /**
         * @type {number}
         * @default 2
         * @private
         */
        this._$lifeCount = 2;

        /**
         * @type {function}
         * @private
         */
        this._$delayLifeCheck = this.lifeCheck.bind(this);

        /**
         * @type {number|null}
         * @default null
         * @private
         */
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

        switch (object.constructor) {

            case Util.$WebGLTexture:
                const player = Util.$players[this._$playerId];
                if (player) {

                    // TODO
                    // // cache to buffer
                    // if (object._$bitmapData) {
                    //     object._$bitmapData._$buffer = object._$bitmapData._$getPixels(
                    //         0, 0, object._$bitmapData.width, object._$bitmapData.height, "RGBA", size => new Util.$Uint8Array(size));
                    //     delete object._$bitmapData;
                    // }
                    //
                    // if (player._$context) {
                    //     player
                    //         ._$context
                    //         .frameBuffer
                    //         .releaseTexture(object);
                    // }

                }
                break;

            case Util.$CanvasRenderingContext2D:

                const canvas = object.canvas;
                const width  = canvas.width;
                const height = canvas.height;

                object.clearRect(0, 0, width + 1, height + 1);

                // canvas reset
                canvas.width = canvas.height = 1;

                // pool
                this._$pool[this._$pool.length] = canvas;
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
        id = `${id}`;
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
        return `${id}:${type}`;
    }

    /**
     * @param   {array} keys
     * @returns {*}
     * @public
     */
    get (keys)
    {
        const id   = `${keys[0]}`;
        const type = `${keys[1]}`;

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
        const id   = `${keys[0]}`;
        const type = `${keys[1]}`;

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
     * @param   {Float32Array} matrix
     * @param   {Float32Array} [color=null]
     * @returns {array}
     * @public
     */
    generateShapeKeys (unique_key, matrix, color = null)
    {
        const str = `${matrix[0]}_${matrix[1]}_${matrix[2]}_${matrix[3]}${this.colorToString(color)}`;

        const keys = Util.$getArray();

        keys[0] = `${unique_key}`;
        keys[1] = this.generateHash(str);

        return keys;

    }

    /**
     * @param   {string|number} unique_key
     * @param   {Float32Array} [matrix=null]
     * @param   {Float32Array} [color=null]
     * @returns {array}
     * @public
     */
    generateKeys (unique_key, matrix = null, color = null)
    {

        let str = "";
        if (matrix) {
            str += `${matrix[0]}_${matrix[1]}`;
        }

        // color
        str += this.colorToString(color);

        const keys = Util.$getArray();
        keys[1] = (str) ? this.generateHash(str) : "_0";
        keys[0] = `${unique_key}`;

        return keys;
    }

    /**
     * @param  {Float32Array} [c=null]
     * @return {string}
     */
    colorToString (c = null)
    {
        if (!c) {
            return "";
        }

        switch (true) {

            case c[0] !== 1:
            case c[1] !== 1:
            case c[2] !== 1:
            case c[4] !== 0:
            case c[5] !== 0:
            case c[6] !== 0:
            case c[7] !== 0:
                return `_${c[0]}_${c[1]}_${c[2]}_${c[4]}_${c[5]}_${c[6]}_${c[7]}`;

            default:
                return "";
        }
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
        return `_${hash}`;
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
class VertexShaderLibrary
{
    /**
     * @return {string}
     * @method
     * @static
     */
    static FUNCTION_GRID_OFF ()
    {
        return `

vec2 applyMatrix(in vec2 vertex) {
    mat3 matrix = mat3(
        u_highp[0].xyz,
        u_highp[1].xyz,
        u_highp[2].xyz
    );

    vec2 position = (matrix * vec3(vertex, 1.0)).xy;

    return position;
}

`;
    }

    /**
     * @param  {number} index
     * @return {string}
     * @method
     * @static
     */
    static FUNCTION_GRID_ON (index)
    {
        return `

vec2 applyMatrix(in vec2 vertex) {
    mat3 parent_matrix = mat3(
        u_highp[${index    }].xyz,
        u_highp[${index + 1}].xyz,
        u_highp[${index + 2}].xyz
    );
    mat3 ancestor_matrix = mat3(
        u_highp[${index + 3}].xyz,
        u_highp[${index + 4}].xyz,
        u_highp[${index + 5}].xyz
    );
    vec2 parent_offset = vec2(u_highp[${index + 2}].w, u_highp[${index + 3}].w);
    vec2 parent_size   = vec2(u_highp[${index + 4}].w, u_highp[${index + 5}].w);
    vec4 grid_min = u_highp[${index + 6}];
    vec4 grid_max = u_highp[${index + 7}];

    vec2 position = (parent_matrix * vec3(vertex, 1.0)).xy;
    position = (position - parent_offset) / parent_size;

    vec4 ga = grid_min;
    vec4 gb = grid_max  - grid_min;
    vec4 gc = vec4(1.0) - grid_max;

    vec2 pa = position;
    vec2 pb = position - grid_min.st;
    vec2 pc = position - grid_max.st;

    position = (ga.pq / ga.st) * min(pa, ga.st)
             + (gb.pq / gb.st) * clamp(pb, vec2(0.0), gb.st)
             + (gc.pq / gc.st) * max(vec2(0.0), pc);

    position = position * parent_size + parent_offset;
    position = (ancestor_matrix * vec3(position, 1.0)).xy;

    return position;
}

`;
    }
}

/**
 * @class
 */
class VertexShaderSource
{
    /**
     * @param  {WebGLShaderKeyword} k
     * @return {string}
     * @method
     * @static
     */
    static TEXTURE (k)
    {
        return `${k.version()}

${k.attribute(0)} vec2 a_vertex;

${k.varyingOut()} vec2 v_coord;

void main() {
    v_coord = a_vertex;

    vec2 position = a_vertex * 2.0 - 1.0;
    gl_Position = vec4(position, 0.0, 1.0);
}

`;
    }

    /**
     * @param  {WebGLShaderKeyword} k
     * @return {string}
     * @method
     * @static
     */
    static BLEND (k)
    {
        return `${k.version()}

${k.attribute(0)} vec2 a_vertex;

uniform vec4 u_highp[4];

${k.varyingOut()} vec2 v_coord;

void main() {
    v_coord = a_vertex;

    vec2 offset   = u_highp[0].xy;
    vec2 size     = u_highp[0].zw;
    mat3 matrix   = mat3(u_highp[1].xyz, u_highp[2].xyz, u_highp[3].xyz);
    vec2 viewport = vec2(u_highp[1].w, u_highp[2].w);

    vec2 position = vec2(a_vertex.x, 1.0 - a_vertex.y);
    position = position * size + offset;
    position = (matrix * vec3(position, 1.0)).xy;
    position /= viewport;

    position = position * 2.0 - 1.0;
    gl_Position = vec4(position.x, -position.y, 0.0, 1.0);
}

`;
    }

    /**
     * @param  {WebGLShaderKeyword} k
     * @return {string}
     * @method
     * @static
     */
    static BLEND_CLIP (k)
    {
        return `${k.version()}

${k.attribute(0)} vec2 a_vertex;

uniform vec4 u_highp[4];

${k.varyingOut()} vec2 v_coord;

void main() {
    v_coord = a_vertex;

    vec2 offset     = u_highp[0].xy;
    vec2 size       = u_highp[0].zw;
    mat3 inv_matrix = mat3(u_highp[1].xyz, u_highp[2].xyz, u_highp[3].xyz);
    vec2 viewport   = vec2(u_highp[1].w, u_highp[2].w);

    vec2 position = vec2(a_vertex.x, 1.0 - a_vertex.y);
    position *= viewport;
    position = (inv_matrix * vec3(position, 1.0)).xy;
    position = (position - offset) / size;

    position = position * 2.0 - 1.0;
    gl_Position = vec4(position.x, -position.y, 0.0, 1.0);
}

`;
    }
}

/**
 * @class
 */
class VertexShaderSourceBitmapData
{
    /**
     * @param  {WebGLShaderKeyword} k
     * @return {string}
     * @method
     * @static
     */
    static POSITION_ONLY (k)
    {
        return `${k.version()}

${k.attribute(0)} vec2 a_vertex;

uniform vec4 u_highp[3];

void main() {
    mat3 matrix = mat3(u_highp[0].xyz, u_highp[1].xyz, u_highp[2].xyz);

    vec2 position = (matrix * vec3(a_vertex, 1.0)).xy * 2.0 - 1.0;
    gl_Position = vec4(position, 0.0, 1.0);
}

`;
    }

    /**
     * @param  {WebGLShaderKeyword} k
     * @return {string}
     * @method
     * @static
     */
    static SRC_AND_DST_TEX_COORD (k)
    {
        return `${k.version()}

${k.attribute(0)} vec2 a_vertex;

uniform vec4 u_highp[5];

${k.varyingOut()} vec2 v_src_tex_coord;
${k.varyingOut()} vec2 v_dst_tex_coord;

void main() {
    mat3 matrix = mat3(u_highp[0].xyz, u_highp[1].xyz, u_highp[2].xyz);
    mat3 src_tex_matrix = mat3(
        u_highp[3].xyz,
        u_highp[4].xyz,
        vec3(u_highp[0].w, u_highp[1].w, u_highp[2].w)
    );

    v_src_tex_coord = (src_tex_matrix * vec3(a_vertex, 1.0)).xy;
    v_dst_tex_coord = vec2(a_vertex.x, 1.0 - a_vertex.y);

    vec2 position = (matrix * vec3(a_vertex, 1.0)).xy * 2.0 - 1.0;
    gl_Position = vec4(position, 0.0, 1.0);
}

`;
    }

    /**
     * @param  {WebGLShaderKeyword} k
     * @return {string}
     * @method
     * @static
     */
    static SRC_TEX_COORD (k)
    {
        return `${k.version()}

${k.attribute(0)} vec2 a_vertex;

uniform vec4 u_highp[5];

${k.varyingOut()} vec2 v_src_tex_coord;

void main() {
    mat3 matrix = mat3(u_highp[0].xyz, u_highp[1].xyz, u_highp[2].xyz);
    mat3 src_tex_matrix = mat3(
        u_highp[3].xyz,
        u_highp[4].xyz,
        vec3(u_highp[0].w, u_highp[1].w, u_highp[2].w)
    );

    v_src_tex_coord = (src_tex_matrix * vec3(a_vertex, 1.0)).xy;

    vec2 position = (matrix * vec3(a_vertex, 1.0)).xy * 2.0 - 1.0;
    gl_Position = vec4(position, 0.0, 1.0);
}

`;
    }

    /**
     * @param  {WebGLShaderKeyword} k
     * @return {string}
     * @method
     * @static
     */
    static SRC_AND_ALPHA_TEX_COORD (k)
    {
        return `${k.version()}

${k.attribute(0)} vec2 a_vertex;

uniform vec4 u_highp[7];

${k.varyingOut()} vec2 v_src_tex_coord;
${k.varyingOut()} vec2 v_alpha_tex_coord;

void main() {
    mat3 matrix = mat3(u_highp[0].xyz, u_highp[1].xyz, u_highp[2].xyz);
    mat3 src_tex_matrix = mat3(u_highp[3].xyz, u_highp[4].xyz, u_highp[5].xyz);
    mat3 alpha_tex_matrix = mat3(
        u_highp[6].xyz,
        vec3(u_highp[0].w, u_highp[1].w, u_highp[2].w),
        vec3(u_highp[3].w, u_highp[4].w, u_highp[5].w)
    );

    v_src_tex_coord = (src_tex_matrix * vec3(a_vertex, 1.0)).xy;
    v_alpha_tex_coord = (alpha_tex_matrix * vec3(a_vertex, 1.0)).xy;

    vec2 position = (matrix * vec3(a_vertex, 1.0)).xy * 2.0 - 1.0;
    gl_Position = vec4(position, 0.0, 1.0);
}

`;
    }

    /**
     * @param  {WebGLShaderKeyword} k
     * @return {string}
     * @method
     * @static
     */
    static PIXEL_DISSOLVE_COLOR (k)
    {
        return `${k.version()}

${k.attribute(0)} vec2 a_vertex;

uniform mat3 u_highp[3];

void main() {
    mat3 matrix = mat3(u_highp[0].xyz, u_highp[1].xyz, u_highp[2].xyz);

    vec2 position = (matrix * vec3(a_vertex, 1.0)).xy * 2.0 - 1.0;
    gl_Position = vec4(position, 0.0, 1.0);

    gl_PointSize = 1.0;
}

`;
    }

    /**
     * @param  {WebGLShaderKeyword} k
     * @return {string}
     * @method
     * @static
     */
    static PIXEL_DISSOLVE_TEXTURE (k)
    {
        return `${k.version()}

${k.attribute(0)} vec2 a_vertex;

uniform mat3 u_highp[5];

${k.varyingOut()} vec2 v_src_tex_coord;

void main() {
    mat3 matrix = mat3(u_highp[0].xyz, u_highp[1].xyz, u_highp[2].xyz);
    mat3 src_tex_matrix = mat3(
        u_highp[3].xyz,
        u_highp[4].xyz,
        vec3(u_highp[0].w, u_highp[1].w, u_highp[2].w)
    );

    v_src_tex_coord = (u_src_tex_matrix * vec3(a_vertex, 1.0)).xy;

    vec2 position = (u_matrix * vec3(a_vertex, 1.0)).xy * 2.0 - 1.0;
    gl_Position = vec4(position, 0.0, 1.0);

    gl_PointSize = 1.0;
}

`;
    }

    /**
     * @param  {WebGLShaderKeyword} k
     * @return {string}
     * @method
     * @static
     */
    static SET_PIXEL_QUEUE (k)
    {
        return `${k.version()}

${k.attribute(0)} vec2 a_vertex;
${k.attribute(1)} vec4 a_color;

uniform mat3 u_highp[3];

${k.varyingOut()} vec2 v_dst_tex_coord;
${k.varyingOut()} vec4 v_color;

void main() {
    mat3 matrix = mat3(u_highp[0].xyz, u_highp[1].xyz, u_highp[2].xyz);

    v_dst_tex_coord = vec2(a_vertex.x, 1.0 - a_vertex.y);
    v_color = a_color;

    vec2 position = (matrix * vec3(a_vertex, 1.0)).xy * 2.0 - 1.0;
    gl_Position = vec4(position, 0.0, 1.0);
}

`;
    }
}

/**
 * @class
 */
class VertexShaderSourceFill
{
    /**
     * @param  {WebGLShaderKeyword} k
     * @param  {number}  highpLength
     * @param  {boolean} withUV
     * @param  {boolean} forMask
     * @param  {boolean} hasGrid
     * @return {string}
     * @method
     * @static
     */
    static TEMPLATE (k, highpLength, withUV, forMask, hasGrid)
    {
        const bezierAttribute = (forMask)
            ? this.ATTRIBUTE_BEZIER_ON(k)
            : "";
        const uvVarying =
              (forMask) ? this.VARYING_BEZIER_ON(k)
            : (withUV)  ? this.VARYING_UV_ON(k)
            : "";
        const uvStatement = 
              (forMask) ? this.STATEMENT_BEZIER_ON()
            : (withUV)  ? this.STATEMENT_UV_ON()
            : "";
        const gridFunction = (hasGrid)
            ? VertexShaderLibrary.FUNCTION_GRID_ON((withUV) ? 5 : 0)
            : VertexShaderLibrary.FUNCTION_GRID_OFF();

        return `${k.version()}

${k.attribute(0)} vec2 a_vertex;
${bezierAttribute}

uniform vec4 u_highp[${highpLength}];

${uvVarying}

${gridFunction}

void main() {
    vec2 viewport = vec2(u_highp[0].w, u_highp[1].w);

    ${uvStatement}

    vec2 pos = applyMatrix(a_vertex) / viewport;
    pos = pos * 2.0 - 1.0;
    gl_Position = vec4(pos.x, -pos.y, 0.0, 1.0);
}

`;
    }

    /**
     * @param  {WebGLShaderKeyword} k
     * @return {string}
     */
    static ATTRIBUTE_BEZIER_ON (k)
    {
        return `
${k.attribute(1)} vec2 a_bezier;
`;
    }

    /**
     * @param  {WebGLShaderKeyword} k
     * @return {string}
     * @method
     * @static
     */
    static VARYING_UV_ON (k)
    {
        return `
${k.varyingOut()} vec2 v_uv;
`;
    }

    /**
     * @param  {WebGLShaderKeyword} k
     * @return {string}
     * @method
     * @static
     */
    static VARYING_BEZIER_ON (k)
    {
        return `
${k.varyingOut()} vec2 v_bezier;
`;
    }

    /**
     * @return {string}
     * @method
     * @static
     */
    static STATEMENT_UV_ON ()
    {
        return `
    mat3 uv_matrix = mat3(
        u_highp[0].xyz,
        u_highp[1].xyz,
        u_highp[2].xyz
    );
    mat3 inverse_matrix = mat3(
        u_highp[3].xyz,
        u_highp[4].xyz,
        vec3(u_highp[2].w, u_highp[3].w, u_highp[4].w)
    );

    v_uv = (inverse_matrix * uv_matrix * vec3(a_vertex, 1.0)).xy;
`;
    }

    /**
     * @return {string}
     * @method
     * @static
     */
    static STATEMENT_BEZIER_ON ()
    {
        return `
    v_bezier = a_bezier;
`;
    }
}

/**
 * @class
 */
class VertexShaderSourceStroke
{
    /**
     * @param  {WebGLShaderKeyword} k
     * @param  {number}  highpLength
     * @param  {number}  fragmentIndex
     * @param  {boolean} withUV
     * @param  {boolean} forMask
     * @param  {boolean} hasGrid
     * @return {string}
     * @method
     * @static
     */
    static TEMPLATE (k, highpLength, fragmentIndex, withUV, forMask, hasGrid)
    {
        const strokeIndex = fragmentIndex - 1;

        const uvVarying = (withUV)
            ? this.VARYING_UV_ON(k)
            : "";
        const uvStatement = (withUV)
            ? this.STATEMENT_UV_ON()
            : "";
        const gridFunction = (hasGrid)
            ? VertexShaderLibrary.FUNCTION_GRID_ON((withUV) ? 5 : 0)
            : VertexShaderLibrary.FUNCTION_GRID_OFF();

        return `${k.version()}

${k.attribute(0)} vec2 a_vertex;
${k.attribute(1)} vec2 a_option1;
${k.attribute(2)} vec2 a_option2;
${k.attribute(3)} float a_type;

uniform vec4 u_highp[${highpLength}];

${uvVarying}

${gridFunction}

float crossVec2(in vec2 v1, in vec2 v2) {
    return v1.x * v2.y - v2.x * v1.y;
}

vec2 perpendicularVec2(in vec2 v1) {
    float face = u_highp[${strokeIndex}][1];

    return face * vec2(v1.y, -v1.x);
}

vec2 calculateNormal(in vec2 direction) {
    vec2 normalized = normalize(direction);
    return perpendicularVec2(normalized);
}

vec2 calculateIntersection(in vec2 v1, in vec2 v2, in vec2 o1, in vec2 o2) {
    float t = crossVec2(o2 - o1, v2) / crossVec2(v1, v2);
    return (o1 + t * v1);
}

vec2 calculateAnchor(in vec2 position, in float convex, out vec2 v1, out vec2 v2, out vec2 o1, out vec2 o2) {
    float miter_limit = u_highp[${strokeIndex}][2];

    vec2 a = applyMatrix(a_option1);
    vec2 b = applyMatrix(a_option2);

    v1 = convex * (position - a);
    v2 = convex * (b - position);
    o1 = calculateNormal(v1) + a;
    o2 = calculateNormal(v2) + position;

    vec2 anchor = calculateIntersection(v1, v2, o1, o2) - position;
    return normalize(anchor) * min(length(anchor), miter_limit);
}

void main() {
    vec2 viewport = vec2(u_highp[0].w, u_highp[1].w);
    float half_width = u_highp[${strokeIndex}][0];

    vec2 position = applyMatrix(a_vertex);
    vec2 offset = vec2(0.0);
    vec2 v1, v2, o1, o2;

    if (a_type == 1.0 || a_type == 2.0) { // 線分
        offset = calculateNormal(a_option2 * (applyMatrix(a_option1) - position));
    } else if (a_type == 10.0) { // スクエア線端
        offset = normalize(position - applyMatrix(a_option1));
        offset += a_option2 * perpendicularVec2(offset);
    } else if (a_type == 21.0) { // マイター結合（線分Bの凸側）
        offset = calculateAnchor(position, 1.0, v1, v2, o1, o2);
        offset = calculateIntersection(v2, perpendicularVec2(offset), o2, position + offset) - position;
    } else if (a_type == 22.0) { // マイター結合（線分Aの凸側）
        offset = calculateAnchor(position, 1.0, v1, v2, o1, o2);
        offset = calculateIntersection(v1, perpendicularVec2(offset), o1, position + offset) - position;
    } else if (a_type == 23.0) { // マイター結合（線分Aの凹側）
        offset = calculateAnchor(position, -1.0, v1, v2, o1, o2);
        offset = calculateIntersection(v1, perpendicularVec2(offset), o1, position + offset) - position;
    } else if (a_type == 24.0) { // マイター結合（線分Bの凹側）
        offset = calculateAnchor(position, -1.0, v1, v2, o1, o2);
        offset = calculateIntersection(v2, perpendicularVec2(offset), o2, position + offset) - position;
    } else if (a_type >= 30.0) { // ラウンド結合
        float face = u_highp[${strokeIndex}][1];
        float rad = face * (a_type - 30.0) * 0.3488888889; /* 0.3488888889 = PI / 9.0 */
        offset = mat2(cos(rad), sin(rad), -sin(rad), cos(rad)) * vec2(1.0, 0.0);
    }
    
    offset *= half_width;
    position += offset;
    ${uvStatement}

    position /= viewport;
    position = position * 2.0 - 1.0;
    gl_Position = vec4(position.x, -position.y, 0.0, 1.0);
}

`;
    }

    /**
     * @param  {WebGLShaderKeyword} k
     * @return {string}
     * @method
     * @static
     */
    static VARYING_UV_ON (k)
    {
        return `
${k.varyingOut()} vec2 v_uv;
`;
    }

    /**
     * @return {string}
     */
    static STATEMENT_UV_ON ()
    {
        return `
    mat3 uv_matrix = mat3(
        u_highp[0].xyz,
        u_highp[1].xyz,
        u_highp[2].xyz
    );
    mat3 inverse_matrix = mat3(
        u_highp[3].xyz,
        u_highp[4].xyz,
        vec3(u_highp[2].w, u_highp[3].w, u_highp[4].w)
    );

    v_uv = (uv_matrix * vec3(a_vertex, 1.0)).xy;
    v_uv += offset;
    v_uv = (inverse_matrix * vec3(v_uv, 1.0)).xy;
`;
    }
}

/**
 * @class
 */
class FragmentShaderLibrary
{
    /**
     * @return {string}
     * @method
     * @static
     */
    static FUNCTION_IS_INSIDE ()
    {
        return `

float isInside(in vec2 uv) {
    return step(4.0, dot(step(vec4(0.0, uv.x, 0.0, uv.y), vec4(uv.x, 1.0, uv.y, 1.0)), vec4(1.0)));
}

`;
    }

    /**
     * @return {string}
     * @method
     * @static
     */
    static STATEMENT_COLOR_TRANSFORM_ON (mediumpIndex)
    {
        return `
    vec4 mul = u_mediump[${mediumpIndex}];
    vec4 add = u_mediump[${mediumpIndex + 1}];

    src.rgb /= max(0.0001, src.a);
    src = clamp(src * mul + add, 0.0, 1.0);
    src.rgb *= src.a;
`;
    }

    /**
     * @param  {number}  stopsLength
     * @param  {number}  uniformIndex
     * @param  {boolean} isHighPrecision
     * @return {string}
     * @method
     * @static
     */
    static FUNCTION_GRADIENT_COLOR (stopsLength, uniformIndex, isHighPrecision)
    {
        // c[i]: uniform[uniformIndex + i]
        // t[i]: uniform[uniformIndex + stopsLength + floor(i / 4)][i % 4]
        // if (t <= t[i]) return mix(c[i - 1], c[i], (t - t[i - 1]) / (t[i] - t[i - 1])))

        const uniformName = (isHighPrecision) ? "u_highp" : "u_mediump";

        let loopStatement = "";
        for (let i = 1; i < stopsLength; i++) {
            const i0 = i - 1;
            const i1 = i;
            const t0 = `${uniformName}[${uniformIndex + stopsLength + Util.$floor(i0 / 4)}][${i0 % 4}]`;
            const t1 = `${uniformName}[${uniformIndex + stopsLength + Util.$floor(i1 / 4)}][${i1 % 4}]`;
            const c0 = `${uniformName}[${uniformIndex + i0}]`;
            const c1 = `${uniformName}[${uniformIndex + i1}]`;
            loopStatement += `
    if (t <= ${t1}) {
        return mix(${c0}, ${c1}, (t - ${t0}) / (${t1} - ${t0}));
    }
`;
        }

        return `

vec4 getGradientColor(in float t) {
    if (t <= ${uniformName}[${uniformIndex + stopsLength}][0]) {
        return ${uniformName}[${uniformIndex}];
    }
    ${loopStatement}
    return ${uniformName}[${uniformIndex + stopsLength - 1}];
}

`;
    }
}

/**
 * @class
 */
class FragmentShaderSource
{
    /**
     * @param  {WebGLShaderKeyword} k
     * @return {string}
     * @method
     * @static
     */
    static SOLID_COLOR (k)
    {
        return `${k.version()}
precision mediump float;

uniform vec4 u_mediump;

${k.outColor()}

void main() {
    ${k.fragColor()} = vec4(u_mediump.rgb * u_mediump.a, u_mediump.a);
}

`;
    }

    /**
     * @param  {WebGLShaderKeyword} k
     * @return {string}
     * @method
     * @static
     */
    static BITMAP_CLIPPED (k)
    {
        return `${k.version()}
precision mediump float;

uniform sampler2D u_texture;
uniform vec4 u_mediump[3];

${k.varyingIn()} vec2 v_uv;
${k.outColor()}

void main() {
    vec2 uv = vec2(v_uv.x, u_mediump[0].y - v_uv.y) / u_mediump[0].xy;

    vec4 src = ${k.texture2D()}(u_texture, uv);
    ${FragmentShaderLibrary.STATEMENT_COLOR_TRANSFORM_ON(1)}
    ${k.fragColor()} = src;
}`;
    }

    /**
     * @param  {WebGLShaderKeyword} k
     * @return {string}
     * @method
     * @static
     */
    static BITMAP_PATTERN (k)
    {
        return `${k.version()}
precision mediump float;

uniform sampler2D u_texture;
uniform vec4 u_mediump[3];

${k.varyingIn()} vec2 v_uv;
${k.outColor()}

void main() {
    vec2 uv = fract(vec2(v_uv.x, -v_uv.y) / u_mediump[0].xy);
    
    vec4 src = ${k.texture2D()}(u_texture, uv);
    ${FragmentShaderLibrary.STATEMENT_COLOR_TRANSFORM_ON(1)}
    ${k.fragColor()} = src;
}`;
    }

    /**
     * @param  {WebGLShaderKeyword} k
     * @return {string}
     * @method
     * @static
     */
    static MASK (k)
    {
        return `${k.version()}
${k.extensionDerivatives()}
precision mediump float;

${k.varyingIn()} vec2 v_bezier;
${k.outColor()}

void main() {
    vec2 px = dFdx(v_bezier);
    vec2 py = dFdy(v_bezier);

    vec2 f = (2.0 * v_bezier.x) * vec2(px.x, py.x) - vec2(px.y, py.y);
    float alpha = 0.5 - (v_bezier.x * v_bezier.x - v_bezier.y) / length(f);

    if (alpha > 0.0) {
        ${k.fragColor()} = vec4(min(alpha, 1.0));
    } else {
        discard;
    }    
}

`;
    }
}

/**
 * @class
 */
class FragmentShaderSourceBitmapData
{
    /**
     * @param  {WebGLShaderKeyword} k
     * @return {string}
     * @method
     * @static
     */
    static FILL_COLOR (k)
    {
        return `${k.version()}
precision mediump float;

uniform vec4 u_mediump;

${k.outColor()}

void main() {
    ${k.fragColor()} = u_mediump;
}

`;
    }

    /**
     * @param  {WebGLShaderKeyword} k
     * @return {string}
     * @method
     * @static
     */
    static COPY_SRC_TEX (k)
    {
        return `${k.version()}
precision mediump float;

uniform sampler2D u_src_tex;

${k.varyingIn()} vec2 v_src_tex_coord;
${k.outColor()}

void main() {
    ${k.fragColor()} = ${k.texture2D()}(u_src_tex, v_src_tex_coord);
}

`;
    }

    /**
     * @param  {boolean} transparent
     * @param  {WebGLShaderKeyword} k
     * @return {string}
     * @method
     * @static
     */
    static COPY_CHANNEL (transparent, k)
    {
        transparent |= 0;

        return `${k.version()}
precision mediump float;

uniform sampler2D u_textures[2];
uniform vec4 u_mediump[2];

${k.varyingIn()} vec2 v_src_tex_coord;
${k.varyingIn()} vec2 v_dst_tex_coord;
${k.outColor()}

void main() {
    vec4 src_ch = u_mediump[0];
    vec4 dst_ch = u_mediump[1];

    vec4 src_color = ${k.texture2D()}(u_textures[0], v_src_tex_coord);
    vec4 dst_color = ${k.texture2D()}(u_textures[1], v_dst_tex_coord);

    src_color = vec4(src_color.rgb/max(0.0001, src_color.a), src_color.a);
    dst_color = vec4(dst_color.rgb/max(0.0001, dst_color.a), dst_color.a);

    // src_color から必要なチャンネルのスカラー値を取り出したもの
    float src_value = dot(src_color, src_ch);

    // コピー先の他のチャンネルと合成
    vec4 mixed = mix(dst_color, vec4(src_value), dst_ch);

#if ${transparent}
    ${k.fragColor()} = vec4(mixed.rgb * mixed.a, mixed.a);
#else
    ${k.fragColor()} = vec4(mixed.rgb, 1.0);
#endif
}

`;
    }

    /**
     * @param  {boolean} transparent
     * @param  {WebGLShaderKeyword} k
     * @return {string}
     * @method
     * @static
     */
    static MERGE (transparent, k)
    {
        transparent |= 0;

        return `${k.version()}
precision mediump float;

uniform sampler2D u_textures[2];
uniform vec4 u_mediump;

${k.varyingIn()} vec2 v_src_tex_coord;
${k.varyingIn()} vec2 v_dst_tex_coord;
${k.outColor()}

void main() {
    vec4 src_color = ${k.texture2D()}(u_textures[0], v_src_tex_coord);
    vec4 dst_color = ${k.texture2D()}(u_textures[1], v_dst_tex_coord);

    src_color = vec4(src_color.rgb/max(0.0001, src_color.a), src_color.a);
    dst_color = vec4(dst_color.rgb/max(0.0001, dst_color.a), dst_color.a);

    vec4 merged = mix(dst_color, src_color, u_mediump);

#if ${transparent}
    ${k.fragColor()} = vec4(merged.rgb * merged.a, merged.a);
#else
    ${k.fragColor()} = vec4(merged.rgb, 1.0);
#endif
}

`;
    }

    /**
     * @param  {WebGLShaderKeyword} k
     * @return {string}
     * @method
     * @static
     */
    static COPY_PIXELS_WITH_ALPHA_BITMAP_DATA (k)
    {
        return `${k.version()}
precision mediump float;

uniform sampler2D u_textures[2];

${k.varyingIn()} vec2 v_src_tex_coord;
${k.varyingIn()} vec2 v_alpha_tex_coord;
${k.outColor()}

void main() {
    vec4 src_color = ${k.texture2D()}(u_textures[0], v_src_tex_coord);
    float alpha = ${k.texture2D()}(u_textures[1], v_alpha_tex_coord).a;

    src_color = vec4(src_color.rgb/max(0.0001, src_color.a), src_color.a);
    alpha *= src_color.a;

    ${k.fragColor()} = vec4(src_color.rgb * alpha, alpha);
}

`;
    }

    /**
     * @param  {boolean} transparent
     * @param  {WebGLShaderKeyword} k
     * @return {string}
     * @method
     * @static
     */
    static PALETTE_MAP (transparent, k)
    {
        transparent |= 0;

        return `${k.version()}
precision mediump float;

uniform sampler2D u_textures[2];

${k.varyingIn()} vec2 v_src_tex_coord;
${k.outColor()}

void main() {
    vec4 src_color = ${k.texture2D()}(u_textures[0], v_src_tex_coord);
    src_color = vec4(src_color.rgb/max(0.0001, src_color.a), src_color.a);

                                                // ↓ 256*4のテクスチャの画素の中心をサンプリング
    vec4 map_r = ${k.texture2D()}(u_textures[1], vec2((0.5+src_color.r*255.0)/256.0, 0.125));
    vec4 map_g = ${k.texture2D()}(u_textures[1], vec2((0.5+src_color.g*255.0)/256.0, 0.375));
    vec4 map_b = ${k.texture2D()}(u_textures[1], vec2((0.5+src_color.b*255.0)/256.0, 0.625));
    vec4 map_a = ${k.texture2D()}(u_textures[1], vec2((0.5+src_color.a*255.0)/256.0, 0.875));

    // u_plt_tex(u_textures[1]) のパレットデータは BGRA で格納されているので、これを取り出すには .bgra
    // TODO プラットフォームのバイトオーダーがビッグエンディアンの場合は ARGB で格納されるので、これを取り出すには .gbar
    vec4 color = (map_r + map_g + map_b + map_a).bgra;

    // fract は 1.0, 2.0, ... のときに 0.0 を返すが 1.0 が欲しい
    vec4 color_fract = fract(color);
    color = color_fract + sign(color) - sign(color_fract);

#if ${transparent}
    ${k.fragColor()} = vec4(color.rgb * color.a, color.a);
#else
    ${k.fragColor()} = vec4(color.rgb, 1.0);
#endif
}

`;
    }

    /**
     * @param  {boolean} transparent
     * @param  {WebGLShaderKeyword} k
     * @return {string}
     * @method
     * @static
     */
    static PIXEL_DISSOLVE_TEXTURE (transparent, k)
    {
        transparent |= 0;

        return `${k.version()}
precision mediump float;

uniform sampler2D u_src_tex;

${k.varyingIn()} vec2 v_src_tex_coord;
${k.outColor()}

void main() {
    vec4 src_color = ${k.texture2D()}(u_src_tex, v_src_tex_coord);

#if ${transparent}
    ${k.fragColor()} = src_color;
#else
    ${k.fragColor()} = vec4(src_color.rgb, 1.0);
#endif
}

`;
    }

    /**
     * @param  {boolean} transparent
     * @param  {WebGLShaderKeyword} k
     * @return {string}
     * @method
     * @static
     */
    static COLOR_TRANSFORM (transparent, k)
    {
        transparent |= 0;

        return `${k.version()}
precision mediump float;

uniform sampler2D u_src_tex;
uniform vec4 u_mediump[2];

${k.varyingIn()} vec2 v_src_tex_coord;
${k.outColor()}

void main() {
    vec4 ct_mul = u_mediump[0];
    vec4 ct_add = u_mediump[1];

    vec4 src_color = ${k.texture2D()}(u_src_tex, v_src_tex_coord);
    src_color = vec4(src_color.rgb/max(0.0001, src_color.a), src_color.a);

    vec4 color = clamp(ct_mul * src_color + ct_add, 0.0, 1.0);

    color = vec4(color.rgb * color.a, color.a);

#if !${transparent}
    color.a = 1.0;
#endif

    ${k.fragColor()} = color * sign(src_color.a);  // 元の色が無色透明の場合、結果も常に無色透明になる。
}

`;
    }

    /**
     * @return {string}
     * @method
     * @static
     */
    static bitwiseAnd() {
        return `
#if __VERSION__ < 130
// 8bitまでの整数どうしのビット積
int bitwiseAnd(int a, int b) {
    //ivec4 c1 = ivec4(1,2,4,8);
    //ivec4 c2 = ivec4(16,32,64,128);

    //ivec4 a1 = ivec4(a) / c1;
    //ivec4 a2 = ivec4(a) / c2;
    //ivec4 b1 = ivec4(b) / c1;
    //ivec4 b2 = ivec4(b) / c2;

    //ivec4 r = (a1-a1/2*2) * (b1-b1/2*2) * c1
    //        + (a2-a2/2*2) * (b2-b2/2*2) * c2;

    //return r.x + r.y + r.z + r.w;

    // ↑ intのままで計算した場合（rakusanの開発環境ではintの方が遅かった）
    // ↓ floatに変換してから計算した場合

    vec4 a0 = vec4(float(a));
    vec4 b0 = vec4(float(b));
    vec4 a1 = floor(a0 * vec4(1.0, 0.5, 0.25, 0.125));
    vec4 a2 = floor(a0 * vec4(0.0625, 0.03125, 0.015625, 0.0078125));
    vec4 b1 = floor(b0 * vec4(1.0, 0.5, 0.25, 0.125));
    vec4 b2 = floor(b0 * vec4(0.0625, 0.03125, 0.015625, 0.0078125));

    return int(dot((a1-floor(a1*0.5)*2.0)*(b1-floor(b1*0.5)*2.0), vec4(1.0,2.0,4.0,8.0))
             + dot((a2-floor(a2*0.5)*2.0)*(b2-floor(b2*0.5)*2.0), vec4(16.0,32.0,64.0,128.0)));
}

ivec4 bitwiseAnd(ivec4 a, ivec4 b) {
    return ivec4(bitwiseAnd(a.r, b.r),
                 bitwiseAnd(a.g, b.g),
                 bitwiseAnd(a.b, b.b),
                 bitwiseAnd(a.a, b.a));
}
#else
#define bitwiseAnd(a, b) ((a)&(b))
#endif
`;
    }

    /**
     * @param  {string} operation
     * @param  {boolean} copy_source
     * @param  {boolean} transparent
     * @param  {WebGLShaderKeyword} k
     * @return {string}
     * @method
     * @static
     */
    static THRESHOLD (operation, copy_source, transparent, k)
    {
        copy_source |= 0;
        transparent |= 0;

        return `${k.version()}
#if __VERSION__ < 130
#extension GL_EXT_draw_buffers : require
#endif

precision mediump float;

uniform sampler2D u_src_tex;
uniform vec4 u_mediump[2]; // u_threshold(u_mediump[0]) はJS側でマスク済み
uniform ivec4 u_integer;

${k.varyingIn()} vec2 v_src_tex_coord;

#if __VERSION__ < 130
#define outColor0 gl_FragData[0]
#define outColor1 gl_FragData[1]
#else
layout (location = 0) out vec4 outColor0;
layout (location = 1) out vec4 outColor1;
#endif

${FragmentShaderSourceBitmapData.bitwiseAnd()}

bool less(vec4 x) {
    return dot(sign(x - u_mediump[0]), vec4(4.0, 2.0, 1.0, 8.0)) < 0.0;
}

bool greater(vec4 x) {
    return dot(sign(x - u_mediump[0]), vec4(4.0, 2.0, 1.0, 8.0)) > 0.0;
}

bool lessEqual(vec4 x) {
    return !greater(x);
}

bool greaterEqual(vec4 x) {
    return !less(x);
}

// 組込関数に equal があるので thresholdEqual にしている。
bool thresholdEqual(vec4 x) {
    return all(equal(x, u_mediump[0]));
}

// 組込関数に notEqual があるので thresholdNotEqual にしている。
bool thresholdNotEqual(vec4 x) {
    return any(notEqual(x, u_mediump[0]));
}

void main() {
    // 乗算済みのままで比較するとFlash Playerと一致する。

    vec4 src_color = ${k.texture2D()}(u_src_tex, v_src_tex_coord);
    ivec4 masked = bitwiseAnd(ivec4(src_color * 255.0), u_integer);

    if (${operation}(vec4(masked))) {
        outColor0 = u_mediump[1];
        outColor1 = vec4(1.0);
    } else {
#if ${copy_source}
    #if ${transparent}
        outColor0 = src_color;
    #else
        outColor0 = vec4(src_color.rgb, 1.0);
    #endif
        outColor1 = vec4(0.0);
#else
        discard;
#endif
    }
}

`;
    }

    /**
     * @param  {WebGLShaderKeyword} k
     * @return {string}
     * @method
     * @static
     */
    static THRESHOLD_SUBTOTAL (k)
    {
        return `${k.version()}
precision mediump float;

uniform sampler2D u_src_tex;
uniform vec4 u_mediump;

${k.varyingIn()} vec2 v_src_tex_coord;
${k.outColor()}

void main() {
    vec2 src_tex_step   = u_mediump.xy;
    float subtotal_loop = u_mediump.z;

    float subtotal = 0.0;

#if __VERSION__ < 130
    float j = 0.0;
    for (float i = 0.0; i < 4095.0; ++i) {      // この 4095.0 というマジックナンバーについては
        if (j++ >= subtotal_loop) {           // BitmapData.prototype.threshold のコメントを見てください。
            break;
        }
#else
    for (float i = 0.0; i < subtotal_loop; ++i) {
#endif
        subtotal += ${k.texture2D()}(u_src_tex, v_src_tex_coord + src_tex_step * i).a;
    }

    vec4 v1 = floor(subtotal * vec4(1.0, 0.00390625, 0.0000152587890625, 5.960464477539063e-8));  // vec4(1.0, 1.0/256.0, 1.0/65536.0, 1.0/16777216.0)
    vec4 v2 = vec4(v1.yzw, 0.0);
    ${k.fragColor()} = (v1 - v2*256.0) * 0.00392156862745098;  // 1.0/255.0
}

`;
    }

    /**
     * @param  {boolean} find_color
     * @param  {WebGLShaderKeyword} k
     * @return {string}
     * @method
     * @static
     */
    static GET_COLOR_BOUNDS_RECT (find_color, k)
    {
        find_color |= 0;

        return `${k.version()}
precision mediump float;

uniform sampler2D u_src_tex;
uniform vec4 u_mediump;
uniform ivec4 u_integer[2];

${k.varyingIn()} vec2 v_src_tex_coord;
${k.outColor()}

${FragmentShaderSourceBitmapData.bitwiseAnd()}

void main() {
    vec2 src_tex_step = u_mediump.xy;
    float scan_loop   = u_mediump.z;
    ivec4 mask  = u_integer[0];
    ivec4 color = u_integer[1];

    float found = 0.0;

#if __VERSION__ < 130
    float j = 0.0;
    for (float i = 0.0; i < 8191.0; ++i) {      // BitmapData の幅または高さの最大サイズは 8191 ピクセル
        if (j++ >= scan_loop) {
            break;
        }
#else
    for (float i = 0.0; i < scan_loop; ++i) {
#endif
        vec4 src_color = ${k.texture2D()}(u_src_tex, v_src_tex_coord + src_tex_step * i);
        ivec4 masked = bitwiseAnd(ivec4(src_color * 255.0), mask);

#if ${find_color}
        if (all(equal(masked, color))) {
#else
        if (any(notEqual(masked, color))) {
#endif
            found = 1.0;
            break;
        }
    }

    ${k.fragColor()} = vec4(found);
}

`;
    }

    /**
     * @param  {WebGLShaderKeyword} k
     * @return {string}
     * @method
     * @static
     */
    static NOISE (k)
    {
        return `${k.version()}
precision mediump float;

uniform vec4 u_mediump[3];

${k.outColor()}

// https://stackoverflow.com/a/28095165
//
// Gold Noise ©2015 dcerisano@standard3d.com
// - based on the Golden Ratio
// - uniform normalized distribution
// - fastest static noise generator function (also runs at low precision)

float PHI = 1.61803398874989484820459;  // Φ = Golden Ratio

vec4 gold_noise(vec2 xy, vec4 seed) {
    return fract(tan(distance(xy*PHI, xy)*seed)*xy.x);
}

void main() {
    vec4 seed = u_mediump[0];
    vec4 amp  = u_mediump[1];
    vec4 low  = u_mediump[2];

    vec4 noise = gold_noise(gl_FragCoord.xy, seed);
    vec4 color = noise * amp + low;
    ${k.fragColor()} = vec4(color.rgb * color.a, color.a);
}

`;
    }

    /**
     * @param  {string} byteOrder
     * @param  {WebGLShaderKeyword} k
     * @return {string}
     * @method
     * @static
     */
    static GET_PIXELS (byteOrder, k)
    {
        switch (byteOrder) {
            case "RGBA":
                byteOrder = 1;
                break;
            case "BGRA":
                byteOrder = 2;
                break;
            default: // ARGB
                byteOrder = 0;
                break;
        }

        return `${k.version()}
precision mediump float;

uniform sampler2D u_src_tex;

${k.varyingIn()} vec2 v_src_tex_coord;
${k.outColor()}

void main() {
    vec4 color = ${k.texture2D()}(u_src_tex, v_src_tex_coord);

#if ${byteOrder} == 1  // RGBA
    ${k.fragColor()} = vec4(color.rgb / max(0.0001, color.a), color.a);
#elif ${byteOrder} == 2  // BGRA
    ${k.fragColor()} = vec4(color.bgr / max(0.0001, color.a), color.a);
#else  // ARGB
    ${k.fragColor()} = vec4(color.a, color.rgb / max(0.0001, color.a));
#endif
}

`;
    }

    /**
     * @param  {string} byteOrder
     * @param  {WebGLShaderKeyword} k
     * @return {string}
     * @method
     * @static
     */
    static SET_PIXELS (byteOrder, k)
    {
        switch (byteOrder) {
            case "RGBA":
                byteOrder = 1;
                break;
            case "BGRA":
                byteOrder = 2;
                break;
            default: // ARGB
                byteOrder = 0;
                break;
        }

        return `${k.version()}
precision mediump float;

uniform sampler2D u_src_tex;

${k.varyingIn()} vec2 v_src_tex_coord;
${k.outColor()}

void main() {
    vec4 color = ${k.texture2D()}(u_src_tex, v_src_tex_coord);

#if ${byteOrder} == 1  // RGBA
    ${k.fragColor()} = vec4(color.rgb * color.a, color.a);
#elif ${byteOrder} == 2  // BGRA
    ${k.fragColor()} = vec4(color.bgr * color.a, color.a);
#else  // ARGB
    ${k.fragColor()} = vec4(color.gba * color.r, color.r);
#endif
}

`;
    }

    /**
     * @param  {WebGLShaderKeyword} k
     * @return {string}
     * @method
     * @static
     */
    static SET_PIXEL_QUEUE (k)
    {
        return `${k.version()}
precision mediump float;

uniform sampler2D u_dst_tex;

${k.varyingIn()} vec2 v_dst_tex_coord;
${k.varyingIn()} vec4 v_color;
${k.outColor()}

void main() {
    float da = ${k.texture2D()}(u_dst_tex, v_dst_tex_coord).a;
    float a = v_color.a;

    ${k.fragColor()} = max( a, 0.0) * v_color
                     + max(-a, 0.0) * vec4(v_color.rgb * da, da);
}

`;
    }
}

/**
 * @class
 */
class FragmentShaderSourceBlend
{
    /**
     * @param  {WebGLShaderKeyword} k
     * @param  {string}  operation
     * @param  {boolean} withColorTransform
     * @return {string}
     * @method
     * @static
     */
    static TEMPLATE (k, operation, withColorTransform)
    {
        let blendFunction;
        switch (operation) {
            case BlendMode.SUBTRACT:
                blendFunction = this.FUNCTION_SUBTRACT();
                break;
            case BlendMode.MULTIPLY:
                blendFunction = this.FUNCTION_MULTIPLY();
                break;
            case BlendMode.LIGHTEN:
                blendFunction = this.FUNCTION_LIGHTEN();
                break;
            case BlendMode.DARKEN:
                blendFunction = this.FUNCTION_DARKEN();
                break;
            case BlendMode.OVERLAY:
                blendFunction = this.FUNCTION_OVERLAY();
                break;
            case BlendMode.HARDLIGHT:
                blendFunction = this.FUNCTION_HARDLIGHT();
                break;
            case BlendMode.DIFFERENCE:
                blendFunction = this.FUNCTION_DIFFERENCE();
                break;
            case BlendMode.INVERT:
                blendFunction = this.FUNCTION_INVERT();
                break;
            default:
                blendFunction = this.FUNCTION_NORMAL();
                break;
        }

        const colorTransformUniform = (withColorTransform)
            ? `uniform vec4 u_mediump[2];`
            : "";
        const colorTransformStatement = (withColorTransform)
            ? FragmentShaderLibrary.STATEMENT_COLOR_TRANSFORM_ON(0)
            : "";

        return `${k.version()}
precision mediump float;

uniform sampler2D u_textures[2];
${colorTransformUniform}

${k.varyingIn()} vec2 v_coord;
${k.outColor()}

${blendFunction}

void main() {
    vec4 dst = ${k.texture2D()}(u_textures[0], v_coord);
    vec4 src = ${k.texture2D()}(u_textures[1], v_coord);
    ${colorTransformStatement}
    ${k.fragColor()} = blend(src, dst);
}

`;
    }

    /**
     * @return {string}
     * @method
     * @static
     */
    static FUNCTION_NORMAL ()
    {
        return `

vec4 blend (in vec4 src, in vec4 dst) {
    return src + dst - dst * src.a;
}

`;
    }

    // 各ブレンド式は、前景と背景の両方のアルファを考慮する必要がある
    // https://odashi.hatenablog.com/entry/20110921/1316610121
    // https://hakuhin.jp/as3/blend.html
    //
    // [基本計算式]
    // ・色(rgb)はストレートアルファ
    // ・アルファ(a)が0の場合は例外処理をする
    // 前景色 a: src.rgb * (src.a * (1.0 - dst.a))
    // 背景色 b: dst.rgb * (dst.a * (1.0 - src.a))
    // 合成色 c: mix.rgb * (src.a * dst.a) 
    // 最終結果: a + b + c

    /**
     * @return {string}
     * @method
     * @static
     */
    static FUNCTION_SUBTRACT ()
    {
        // [合成色計算式]
        // dst - src
        return `

vec4 blend (in vec4 src, in vec4 dst) {
    if (src.a == 0.0) { return dst; }
    if (dst.a == 0.0) { return src; }

    vec4 a = src - src * dst.a;
    vec4 b = dst - dst * src.a;

    src.rgb /= src.a;
    dst.rgb /= dst.a;

    vec4 c = vec4(dst.rgb - src.rgb, src.a * dst.a);
    c.rgb *= c.a;

    return a + b + c;
}

`;
    }

    /**
     * @return {string}
     * @method
     * @static
     */
    static FUNCTION_MULTIPLY ()
    {
        // [合成色計算式]
        // src * dst
        return `

vec4 blend (in vec4 src, in vec4 dst) {
    vec4 a = src - src * dst.a;
    vec4 b = dst - dst * src.a;
    vec4 c = src * dst;

    return a + b + c;
}

`;
    }

    /**
     * @return {string}
     * @method
     * @static
     */
    static FUNCTION_LIGHTEN ()
    {
        // [合成色計算式]
        // (src > dst) ? src : dst
        return `

vec4 blend (in vec4 src, in vec4 dst) {
    if (src.a == 0.0) { return dst; }
    if (dst.a == 0.0) { return src; }

    vec4 a = src - src * dst.a;
    vec4 b = dst - dst * src.a;

    src.rgb /= src.a;
    dst.rgb /= dst.a;

    vec4 c = vec4(mix(src.rgb, dst.rgb, step(src.rgb, dst.rgb)), src.a * dst.a);
    c.rgb *= c.a;

    return a + b + c;
}

`;
    }

    /**
     * @return {string}
     * @method
     * @static
     */
    static FUNCTION_DARKEN ()
    {
        // [合成色計算式]
        // (src < dst) ? src : dst
        return `

vec4 blend (in vec4 src, in vec4 dst) {
    if (src.a == 0.0) { return dst; }
    if (dst.a == 0.0) { return src; }

    vec4 a = src - src * dst.a;
    vec4 b = dst - dst * src.a;

    src.rgb /= src.a;
    dst.rgb /= dst.a;

    vec4 c = vec4(mix(src.rgb, dst.rgb, step(dst.rgb, src.rgb)), src.a * dst.a);
    c.rgb *= c.a;

    return a + b + c;
}

`;
    }

    /**
     * @return {string}
     * @method
     * @static
     */
    static FUNCTION_OVERLAY ()
    {
        // [合成色計算式]
        // if (dst < 0.5) {
        //     return 2.0 * src * dst
        // } else {
        //     return 1.0 - 2.0 * (1.0 - src) * (1.0 - dst)
        // }
        return `

vec4 blend (in vec4 src, in vec4 dst) {
    if (src.a == 0.0) { return dst; }
    if (dst.a == 0.0) { return src; }

    vec4 a = src - src * dst.a;
    vec4 b = dst - dst * src.a;

    src.rgb /= src.a;
    dst.rgb /= dst.a;

    vec4 mul = src * dst;
    vec3 c1 = 2.0 * mul.rgb;
    vec3 c2 = 2.0 * (src.rgb + dst.rgb - mul.rgb) - 1.0;
    vec4 c = vec4(mix(c1, c2, step(vec3(0.5), dst.rgb)), mul.a);
    c.rgb *= c.a;

    return a + b + c;
}

`;
    }

    /**
     * @return {string}
     * @method
     * @static
     */
    static FUNCTION_HARDLIGHT ()
    {
        // [合成色計算式]
        // if (src < 0.5) {
        //     return 2.0 * src * dst
        // } else {
        //     return 1.0 - 2.0 * (1.0 - src) * (1.0 - dst)
        // }
        return `

vec4 blend (in vec4 src, in vec4 dst) {
    if (src.a == 0.0) { return dst; }
    if (dst.a == 0.0) { return src; }

    vec4 a = src - src * dst.a;
    vec4 b = dst - dst * src.a;

    src.rgb /= src.a;
    dst.rgb /= dst.a;

    vec4 mul = src * dst;
    vec3 c1 = 2.0 * mul.rgb;
    vec3 c2 = 2.0 * (src.rgb + dst.rgb - mul.rgb) - 1.0;
    vec4 c = vec4(mix(c1, c2, step(vec3(0.5), src.rgb)), mul.a);
    c.rgb *= c.a;

    return a + b + c;
}

`;
    }

    /**
     * @return {string}
     * @method
     * @static
     */
    static FUNCTION_DIFFERENCE ()
    {
        // [合成色計算式]
        // abs(src - dst)
        return `

vec4 blend (in vec4 src, in vec4 dst) {
    if (src.a == 0.0) { return dst; }
    if (dst.a == 0.0) { return src; }

    vec4 a = src - src * dst.a;
    vec4 b = dst - dst * src.a;

    src.rgb /= src.a;
    dst.rgb /= dst.a;

    vec4 c = vec4(abs(src.rgb - dst.rgb), src.a * dst.a);
    c.rgb *= c.a;

    return a + b + c;
}

`;
    }

    /**
     * @return {string}
     * @method
     * @static
     */
    static FUNCTION_INVERT ()
    {
        // [基本計算式]
        // ((1.0 - dst) * src.a) + (dst * (1.0 - src.a))
        return `

vec4 blend (in vec4 src, in vec4 dst) {
    if (src.a == 0.0) { return dst; }
    if (dst.a == 0.0) { return src; }

    vec4 b = dst - dst * src.a;
    vec4 c = vec4(src.a - dst.rgb * src.a, src.a);

    return b + c;
}

`;
    }
}

/**
 * @class
 */
class FragmentShaderSourceGradient
{
    /**
     * @param  {WebGLShaderKeyword} k
     * @param  {number}  highpLength
     * @param  {number}  fragmentIndex
     * @param  {boolean} isRadial
     * @param  {boolean} hasFocalPoint
     * @param  {string}  spreadMethod
     * @param  {number}  stopsLength
     * @param  {boolean} isLinearSpace
     * @return {string}
     * @method
     * @static
     */
    static TEMPLATE (k, highpLength, fragmentIndex, isRadial, hasFocalPoint, spreadMethod, stopsLength, isLinearSpace)
    {
        const gradientTypeStatement = (isRadial)
            ? this.STATEMENT_GRADIENT_TYPE_RADIAL(fragmentIndex * 4 + stopsLength * 5, hasFocalPoint)
            : this.STATEMENT_GRADIENT_TYPE_LINEAR(fragmentIndex);
        const gradientColorIndex = fragmentIndex + ((isRadial) ? 0 : 1);
        
        let spreadMethodExpression;
        switch (spreadMethod) {
            case "reflect":
                spreadMethodExpression = "1.0 - abs(fract(t * 0.5) * 2.0 - 1.0)";
                break;
            case "repeat":
                spreadMethodExpression = "fract(t)";
                break;
            default:
                spreadMethodExpression = "clamp(t, 0.0, 1.0)";
                break;
        }

        const colorSpaceStatement = (isLinearSpace)
            ? "color = pow(color, vec4(0.45454545));"
            : "";

        return `${k.version()}
precision highp float;

uniform vec4 u_highp[${highpLength}];

${k.varyingIn()} vec2 v_uv;
${k.outColor()}

${FragmentShaderLibrary.FUNCTION_GRADIENT_COLOR(stopsLength, gradientColorIndex, true)}

void main() {
    vec2 p = v_uv;
    ${gradientTypeStatement}
    t = ${spreadMethodExpression};
    vec4 color = getGradientColor(t);
    ${colorSpaceStatement}
    color.rgb *= color.a;
    ${k.fragColor()} = color;
}

`;
    }

    /**
     * @param  {number} index
     * @return {string}
     * @method
     * @static
     */
    static STATEMENT_GRADIENT_TYPE_LINEAR (index)
    {
        return `
    vec2 a = u_highp[${index}].xy;
    vec2 b = u_highp[${index}].zw;

    vec2 ab = b - a;
    vec2 ap = p - a;

    float t = dot(ab, ap) / dot(ab, ab);
`;
    }

    /**
     * @param  {number} offset
     * @param  {boolean} hasFocalPoint
     * @return {string}
     * @method
     * @static
     */
    static STATEMENT_GRADIENT_TYPE_RADIAL (offset, hasFocalPoint)
    {
        const index     = Util.$floor(offset / 4);
        const component = offset % 4;
        const focalPointStatement = (hasFocalPoint)
            ? this.STATEMENT_FOCAL_POINT_ON(offset + 1)
            : this.STATEMENT_FOCAL_POINT_OFF();
        return `
    float radius = u_highp[${index}][${component}];

    vec2 coord = p / radius;
    ${focalPointStatement}
`;
    }

    /**
     * @return {string}
     * @method
     * @static
     */
    static STATEMENT_FOCAL_POINT_OFF ()
    {
        return `
    float t = length(coord);
`;
    }

    /**
     * @param  {number} offset
     * @return {string}
     * @method
     * @static
     */
    static STATEMENT_FOCAL_POINT_ON (offset)
    {
        const index     = Util.$floor(offset / 4);
        const component = offset % 4;
        return `
    vec2 focal = vec2(u_highp[${index}][${component}], 0.0);

    vec2 dir = normalize(coord - focal);

    float a = dot(dir, dir);
    float b = 2.0 * dot(dir, focal);
    float c = dot(focal, focal) - 1.0;
    float x = (-b + sqrt(b * b - 4.0 * a * c)) / (2.0 * a);

    float t = distance(focal, coord) / distance(focal, focal + dir * x);
`;
    }
}

/**
 * @class
 */
class FragmentShaderSourceTexture
{
    /**
     * @param  {WebGLShaderKeyword} k
     * @param  {boolean} withColorTransform
     * @return {string}
     * @method
     * @static
     */
    static TEMPLATE (k, withColorTransform)
    {
        const colorTransformUniform = (withColorTransform)
            ? `uniform vec4 u_mediump[2];`
            : "";
        const colorTransformStatement = (withColorTransform)
            ? FragmentShaderLibrary.STATEMENT_COLOR_TRANSFORM_ON(0)
            : "";

        return `${k.version()}
precision mediump float;

uniform sampler2D u_texture;
${colorTransformUniform}

${k.varyingIn()} vec2 v_coord;
${k.outColor()}

void main() {
    vec4 src = ${k.texture2D()}(u_texture, v_coord);
    ${colorTransformStatement}
    ${k.fragColor()} = src;
}

`;
    }
}

/**
 * @class
 */
class BitmapShaderVariantCollection
{
    /**
     * @param {CanvasToWebGLContext}  context
     * @param {WebGLRenderingContext} gl
     * @param {WebGLShaderKeyword}    keyword
     * @constructor
     */
    constructor (context, gl, keyword)
    {
        this._$context    = context;
        this._$gl         = gl;
        this._$keyword    = keyword;
        this._$collection = new Map();
    }

    /**
     * @return {CanvasToWebGLShader}
     * @public
     */
    getBitmapShader ()
    {
        const key = `b`;

        if (!this._$collection.has(key)) {
            this._$collection.set(key, new CanvasToWebGLShader(
                this._$gl, this._$context,
                VertexShaderSource.TEXTURE(this._$keyword),
                FragmentShaderSourceTexture.TEMPLATE(this._$keyword, 0, 0, false)
            ));
        }

        return this._$collection.get(key);
    }

    /**
     * @param {WebGLShaderUniform} uniform
     * @public
     */
    setBitmapUniform (uniform)
    {
        // uniform設定不要
    }

    /**
     * @param {WebGLShaderUniform} uniform
     * @param {number} sx
     * @param {number} sy
     * @param {number} tx
     * @param {number} ty
     * @public
     */
    setGetPixelsUniform (uniform, sx, sy, tx, ty)
    {
        const highp = uniform.highp;

        // vertex: u_matrix
        highp[0]  = 1;
        highp[1]  = 0;
        highp[2]  = 0;

        highp[4]  = 0;
        highp[5]  = 1;
        highp[6]  = 0;

        highp[8]  = 0;
        highp[9]  = 0;
        highp[10] = 1;

        // vertex: u_src_tex_matrix
        highp[12] = sx;
        highp[13] = 0;
        highp[14] = 0;

        highp[16] = 0;
        highp[17] = sy;
        highp[18] = 0;

        highp[3]  = tx;
        highp[7]  = ty;
        highp[11] = 1;
    }

    /**
     * @param {WebGLShaderUniform} uniform
     * @param {number} sx1
     * @param {number} sy1
     * @param {number} tx1
     * @param {number} ty1
     * @param {number} sx2
     * @param {number} sy2
     * @param {number} tx2
     * @param {number} ty2
     * @public
     */
    setSetPixelsUniform (uniform, sx1, sy1, tx1, ty1, sx2, sy2, tx2, ty2)
    {
        const highp = uniform.highp;

        // vertex: u_matrix
        highp[0]  = sx1;
        highp[1]  = 0;
        highp[2]  = 0;

        highp[4]  = 0;
        highp[5]  = sy1;
        highp[6]  = 0;

        highp[8]  = tx1;
        highp[9]  = ty1;
        highp[10] = 1;

        // vertex: u_src_tex_matrix
        highp[12] = sx2;
        highp[13] = 0;
        highp[14] = 0;

        highp[16] = 0;
        highp[17] = sy2;
        highp[18] = 0;

        highp[3]  = tx2;
        highp[7]  = ty2;
        highp[11] = 1;
    }

    /**
     * @param {array} colorTransform
     * @public
     */
    setColorTransformUniform (uniform, colorTransform)
    {
        const mediump = uniform.mediump;

        // fragment: u_color_transform_mul
        mediump[0] = colorTransform[0];
        mediump[1] = colorTransform[1];
        mediump[2] = colorTransform[2];
        mediump[3] = colorTransform[3];
        // fragment: u_color_transform_add
        mediump[4] = colorTransform[4] / 255;
        mediump[5] = colorTransform[5] / 255;
        mediump[6] = colorTransform[6] / 255;
        mediump[7] = colorTransform[7] / 255;
    }

    /**
     * @param {WebGLShaderUniform} uniform
     * @param {array}      matrix
     * @param {boolean}    useSourceTexture
     * @param {array}      srcTexMat
     * @param {BitmapData} alphaBitmapData
     * @param {array}      alphaTexMat
     * @public
     */
    setManipulatePixelsUniform (uniform, matrix, useSourceTexture, srcTexMat, alphaBitmapData, alphaTexMat)
    {
        const highp = uniform.highp;

        // vertex: u_matrix
        highp[0]  = matrix[0];
        highp[1]  = matrix[1];
        highp[2]  = matrix[2];

        highp[4]  = matrix[3];
        highp[5]  = matrix[4];
        highp[6]  = matrix[5];

        highp[8]  = matrix[6];
        highp[9]  = matrix[7];
        highp[10] = matrix[8];

        if (alphaBitmapData) {
            // vertex: u_src_tex_matrix
            highp[12] = srcTexMat[0];
            highp[13] = srcTexMat[1];
            highp[14] = srcTexMat[2];

            highp[16] = srcTexMat[3];
            highp[17] = srcTexMat[4];
            highp[18] = srcTexMat[5];

            highp[20] = srcTexMat[6];
            highp[21] = srcTexMat[7];
            highp[22] = srcTexMat[8];

            // vertex: u_alpha_tex_matrix
            highp[24] = alphaTexMat[0];
            highp[25] = alphaTexMat[1];
            highp[26] = alphaTexMat[2];

            highp[3]  = alphaTexMat[3];
            highp[7]  = alphaTexMat[4];
            highp[11] = alphaTexMat[5];

            highp[15] = alphaTexMat[6];
            highp[19] = alphaTexMat[7];
            highp[23] = alphaTexMat[8];
        } else if (useSourceTexture) {
            // vertex: u_src_tex_matrix
            highp[12] = srcTexMat[0];
            highp[13] = srcTexMat[1];
            highp[14] = srcTexMat[2];

            highp[16] = srcTexMat[3];
            highp[17] = srcTexMat[4];
            highp[18] = srcTexMat[5];

            highp[3]  = srcTexMat[6];
            highp[7]  = srcTexMat[7];
            highp[11] = srcTexMat[8];
        }
    }

    /**
     * @param {WebGLShaderUniform} uniform
     * @param {number} sourceChannel
     * @param {number} destChannel
     * @public
     */
    setCopyChannelUniform (uniform, sourceChannel, destChannel)
    {
        const textures = uniform.textures;
        textures[0] = 0;
        textures[1] = 1;

        const mediump = uniform.mediump;

        // fragment: u_src_ch
        mediump[0] =  sourceChannel       & 0x01;
        mediump[1] = (sourceChannel >> 1) & 0x01;
        mediump[2] = (sourceChannel >> 2) & 0x01;
        mediump[3] = (sourceChannel >> 3) & 0x01;
        // fragment: u_dst_ch
        mediump[4] =  destChannel       & 0x01;
        mediump[5] = (destChannel >> 1) & 0x01;
        mediump[6] = (destChannel >> 2) & 0x01;
        mediump[7] = (destChannel >> 3) & 0x01;
    }

    /**
     * @param {WebGLShaderUniform} uniform
     * @param {WebGLTexture} alphaTex
     * @public
     */
    setCopyPixelsUniform (uniform, alphaTex)
    {
        if (alphaTex) {
            const textures = uniform.textures;
            textures[0] = 0;
            textures[1] = 1;
        }
    }

    /**
     * @param {WebGLShaderUniform} uniform
     * @param {number} r
     * @param {number} g
     * @param {number} b
     * @param {number} a
     * @public
     */
    setFillRectUniform (uniform, r, g, b, a)
    {
        const mediump = uniform.mediump;

        // fragment: u_color
        mediump[0] = r;
        mediump[1] = g;
        mediump[2] = b;
        mediump[3] = a;
    }

    /**
     * @param {WebGLShaderUniform} uniform
     * @param {array}  texMatrix
     * @param {array}  texStep
     * @param {number} scanLoop
     * @param {array}  mask
     * @param {array}  color
     * @public
     */
    setGetColorBoundsRectUniform (uniform, texMatrix, texStep, scanLoop, mask, color)
    {
        const highp = uniform.highp;

        // vertex: u_matrix
        highp[0]  = 1;
        highp[1]  = 0;
        highp[2]  = 0;

        highp[4]  = 0;
        highp[5]  = 1;
        highp[6]  = 0;

        highp[8]  = 0;
        highp[9]  = 0;
        highp[10] = 1;

        // vertex: u_tex_matrix
        highp[12] = texMatrix[0];
        highp[13] = texMatrix[1];
        highp[14] = texMatrix[2];

        highp[16] = texMatrix[3];
        highp[17] = texMatrix[4];
        highp[18] = texMatrix[5];

        highp[3]  = texMatrix[6];
        highp[7]  = texMatrix[7];
        highp[11] = texMatrix[8];

        const mediump = uniform.mediump;

        // fragment: u_src_tex_step
        mediump[0] = texStep[0];
        mediump[1] = texStep[1];

        // fragment: u_scan_loop
        mediump[2] = scanLoop;

        const integer = uniform.integer;

        // fragment: u_mask
        integer[0] = mask[0];
        integer[1] = mask[1];
        integer[2] = mask[2];
        integer[3] = mask[3];

        // fragment: u_color
        integer[4] = color[0];
        integer[5] = color[1];
        integer[6] = color[2];
        integer[7] = color[3];
    }

    /**
     * @param {WebGLShaderUniform} uniform
     * @param {number} r
     * @param {number} g
     * @param {number} b
     * @param {number} a
     * @public
     */
    setMergeUniform (uniform, r, g, b, a)
    {
        const textures = uniform.textures;
        textures[0] = 0;
        textures[1] = 1;

        const mediump = uniform.mediump;
        
        // fragment: u_multipliers
        mediump[0] = r;
        mediump[1] = g;
        mediump[2] = b;
        mediump[3] = a;
    }

    /**
     * @param {WebGLShaderUniform} uniform
     * @param {number} seedR
     * @param {number} seedG
     * @param {number} seedB
     * @param {number} seedA
     * @param {number} ampR
     * @param {number} ampG
     * @param {number} ampB
     * @param {number} ampA
     * @param {number} lowR
     * @param {number} lowG
     * @param {number} lowB
     * @param {number} lowA
     * @public
     */
    setNoiseUniform (
        uniform,
        seedR, seedG, seedB, seedA,
        ampR, ampG, ampB, ampA,
        lowR, lowG, lowB, lowA
    ) {
        const mediump = uniform.mediump;

        // fragment: u_seed
        mediump[0]  = seedR;
        mediump[1]  = seedG;
        mediump[2]  = seedB;
        mediump[3]  = seedA;

        // fragment: u_amp
        mediump[4]  = ampR;
        mediump[5]  = ampG;
        mediump[6]  = ampB;
        mediump[7]  = ampA;

        // fragment: u_low
        mediump[8]  = lowR;
        mediump[9]  = lowG;
        mediump[10] = lowB;
        mediump[11] = lowA;
    }

    /**
     * @param {WebGLShaderUniform} uniform
     * @public
     */
    setPaletteMapUniform (uniform)
    {
        const textures = uniform.textures;
        textures[0] = 0;
        textures[1] = 2;
    }

    /**
     * @param {WebGLShaderUniform} uniform
     * @param {number} r
     * @param {number} g
     * @param {number} b
     * @param {number} a
     * @public
     */
    setPixelDissolveUniform (uniform, r, g, b, a)
    {
        const mediump = uniform.mediump;

        // fragment: u_color
        mediump[0] = r;
        mediump[1] = g;
        mediump[2] = b;
        mediump[3] = a;
    }

    /**
     * @param {WebGLShaderUniform} uniform
     * @public
     */
    setFlushSetPixelQueueUniform (uniform)
    {
        const highp = uniform.highp;

        // vertex: u_matrix
        highp[0] = 1;
        highp[1] = 0;
        highp[2] = 0;

        highp[3] = 0;
        highp[4] = -1;
        highp[5] = 0;

        highp[6] = 0;
        highp[7] = 1;
        highp[8] = 1;
    }

    /**
     * @param {WebGLShaderUniform} uniform
     * @param {number} tr
     * @param {number} tg
     * @param {number} tb
     * @param {number} ta
     * @param {number} cr
     * @param {number} cg
     * @param {number} cb
     * @param {number} ca
     * @param {number} mr
     * @param {number} mg
     * @param {number} mb
     * @param {number} ma
     * @public
     */
    setThresholdUniform (uniform, tr, tg, tb, ta, cr, cg, cb, ca, mr, mg, mb, ma)
    {
        const mediump = uniform.mediump;

        // fragment: u_threshold
        mediump[0] = tr;
        mediump[1] = tg;
        mediump[2] = tb;
        mediump[3] = ta;

        // fragment: u_out_color
        mediump[4] = cr;
        mediump[5] = cg;
        mediump[6] = cb;
        mediump[7] = ca;

        const integer = uniform.integer;

        // fragment: u_masked
        integer[0] = mr;
        integer[1] = mg;
        integer[2] = mb;
        integer[3] = ma;
    }
}

/**
 * @class
 */
class BlendShaderVariantCollection
{
    /**
     * @param {CanvasToWebGLContext}  context
     * @param {WebGLRenderingContext} gl
     * @param {WebGLShaderKeyword}    keyword
     * @constructor
     * @public
     */
    constructor (context, gl, keyword)
    {
        this._$context    = context;
        this._$gl         = gl;
        this._$keyword    = keyword;
        this._$collection = new Map();
    }

    /**
     * @param  {boolean} withColorTransform
     * @return {CanvasToWebGLShader}
     * @method
     * @public
     */
    getNormalBlendShader (withColorTransform)
    {
        const key = `n${(withColorTransform) ? "y" : "n"}`;

        if (!this._$collection.has(key)) {
            this._$collection.set(key, new CanvasToWebGLShader(
                this._$gl, this._$context,
                VertexShaderSource.BLEND(this._$keyword),
                FragmentShaderSourceTexture.TEMPLATE(this._$keyword, withColorTransform)
            ));
        }

        return this._$collection.get(key);
    }

    /**
     * @return {CanvasToWebGLShader}
     * @method
     * @public
     */
    getClipShader ()
    {
        const key = `c`;

        if (!this._$collection.has(key)) {
            this._$collection.set(key, new CanvasToWebGLShader(
                this._$gl, this._$context,
                VertexShaderSource.BLEND_CLIP(this._$keyword),
                FragmentShaderSourceTexture.TEMPLATE(this._$keyword, false)
            ));
        }

        return this._$collection.get(key);
    }

    /**
     * @param  {string} operation
     * @param  {boolean} withColorTransform
     * @return {CanvasToWebGLShader}
     * @method
     * @public
     */
    getBlendShader (operation, withColorTransform)
    {
        const key = `${operation}${(withColorTransform) ? "y" : "n"}`;

        if (!this._$collection.has(key)) {
            this._$collection.set(key, new CanvasToWebGLShader(
                this._$gl, this._$context,
                VertexShaderSource.BLEND(this._$keyword),
                FragmentShaderSourceBlend.TEMPLATE(this._$keyword, operation, withColorTransform)
            ));
        }

        return this._$collection.get(key);
    }

    /**
     * @param {WebGLShaderUniform} uniform
     * @param {number}  x
     * @param {number}  y
     * @param {number}  w
     * @param {number}  h
     * @param {array}   matrix
     * @param {number}  renderWidth
     * @param {number}  renderHeight
     * @param {boolean} withCT
     * @param {number}  ct0
     * @param {number}  ct1
     * @param {number}  ct2
     * @param {number}  ct3
     * @param {number}  ct4
     * @param {number}  ct5
     * @param {number}  ct6
     * @param {number}  ct7
     * @method
     * @public
     */
    setNormalBlendUniform (
        uniform, x, y, w, h, matrix, renderWidth, renderHeight,
        withCT, ct0, ct1, ct2, ct3, ct4, ct5, ct6, ct7)
    {
        const highp = uniform.highp;

        // vertex: u_offset
        highp[0] = x;
        highp[1] = y;
        // vertex: u_size
        highp[2] = w;
        highp[3] = h;

        // vertex: u_matrix
        highp[4]  = matrix[0];
        highp[5]  = matrix[1];
        highp[6]  = matrix[2];

        highp[8]  = matrix[3];
        highp[9]  = matrix[4];
        highp[10] = matrix[5];

        highp[12] = matrix[6];
        highp[13] = matrix[7];
        highp[14] = matrix[8];

        // vertex: u_viewport
        highp[7]  = renderWidth;
        highp[11] = renderHeight;

        if (withCT) {
            const mediump = uniform.mediump;

            // fragment: u_color_transform_mul
            mediump[0] = ct0;
            mediump[1] = ct1;
            mediump[2] = ct2;
            mediump[3] = ct3;
            // fragment: u_color_transform_add
            mediump[4] = ct4;
            mediump[5] = ct5;
            mediump[6] = ct6;
            mediump[7] = ct7;
        }
    }

    /**
     * @param {WebGLShaderUniform} uniform
     * @param {number}  x
     * @param {number}  y
     * @param {number}  w
     * @param {number}  h
     * @param {array}   inverseMatrix
     * @param {number}  renderWidth
     * @param {number}  renderHeight
     * @method
     * @public
     */
    setClipUniform (uniform, x, y, w, h, inverseMatrix, renderWidth, renderHeight)
    {
        const highp = uniform.highp;

        // vertex: u_offset
        highp[0] = x;
        highp[1] = y;
        // vertex: u_size
        highp[2] = w;
        highp[3] = h;

        // vertex: u_inverse_matrix
        highp[4]  = inverseMatrix[0];
        highp[5]  = inverseMatrix[1];
        highp[6]  = inverseMatrix[2];

        highp[8]  = inverseMatrix[3];
        highp[9]  = inverseMatrix[4];
        highp[10] = inverseMatrix[5];

        highp[12] = inverseMatrix[6];
        highp[13] = inverseMatrix[7];
        highp[14] = inverseMatrix[8];

        // vertex: u_viewport
        highp[7]  = renderWidth;
        highp[11] = renderHeight;
    }

    /**
     * @param {WebGLShaderUniform} uniform
     * @param {number}  x
     * @param {number}  y
     * @param {number}  w
     * @param {number}  h
     * @param {array}   matrix
     * @param {number}  renderWidth
     * @param {number}  renderHeight
     * @param {boolean} withCT
     * @param {number}  ct0
     * @param {number}  ct1
     * @param {number}  ct2
     * @param {number}  ct3
     * @param {number}  ct4
     * @param {number}  ct5
     * @param {number}  ct6
     * @param {number}  ct7
     * @method
     * @public
     */
    setBlendUniform (
        uniform, x, y, w, h, matrix, renderWidth, renderHeight,
        withCT, ct0, ct1, ct2, ct3, ct4, ct5, ct6, ct7
    ) {
        const textures = uniform.textures;
        textures[0] = 0;
        textures[1] = 1;

        const highp = uniform.highp;

        // vertex: u_offset
        highp[0] = x;
        highp[1] = y;
        // vertex: u_size
        highp[2] = w;
        highp[3] = h;

        // vertex: u_matrix
        highp[4]  = matrix[0];
        highp[5]  = matrix[1];
        highp[6]  = matrix[2];

        highp[8]  = matrix[3];
        highp[9]  = matrix[4];
        highp[10] = matrix[5];

        highp[12] = matrix[6];
        highp[13] = matrix[7];
        highp[14] = matrix[8];

        // vertex: u_viewport
        highp[7]  = renderWidth;
        highp[11] = renderHeight;

        if (withCT) {
            const mediump = uniform.mediump;

            // fragment: u_color_transform_mul
            mediump[0] = ct0;
            mediump[1] = ct1;
            mediump[2] = ct2;
            mediump[3] = ct3;
            // fragment: u_color_transform_add
            mediump[4] = ct4;
            mediump[5] = ct5;
            mediump[6] = ct6;
            mediump[7] = ct7;
        }
    }
}

/**
 * @class
 */
class FilterShaderVariantCollection
{
    /**
     * @param {CanvasToWebGLContext}  context
     * @param {WebGLRenderingContext} gl
     * @param {WebGLShaderKeyword}    keyword
     * @constructor
     * @public
     */
    constructor (context, gl, keyword)
    {
        this._$context    = context;
        this._$gl         = gl;
        this._$keyword    = keyword;
        this._$collection = new Map();
    }

    /**
     * @param  {number}  halfBlur
     * @return {CanvasToWebGLShader}
     * @method
     * @public
     */
    getBlurFilterShader (halfBlur)
    {
        const key = `b${halfBlur}`;

        if (!this._$collection.has(key)) {
            this._$collection.set(key, new CanvasToWebGLShader(
                this._$gl, this._$context,
                VertexShaderSource.TEXTURE(this._$keyword),
                FragmentShaderSourceBlurFilter.TEMPLATE(this._$keyword, halfBlur)
            ));
        }

        return this._$collection.get(key);
    }

    /**
     * @param  {boolean} transformsBase
     * @param  {boolean} transformsBlur
     * @param  {boolean} isGlow
     * @param  {string}  type
     * @param  {boolean} knockout
     * @param  {boolean} appliesStrength
     * @param  {number}  gradientStopsLength
     * @return {CanvasToWebGLShader}
     * @method
     * @public
     */
    getBitmapFilterShader (transformsBase, transformsBlur, isGlow, type, knockout, appliesStrength, gradientStopsLength)
    {
        const key1 = (transformsBase) ? "y" : "n";
        const key2 = (transformsBlur) ? "y" : "n";
        const key3 = (isGlow) ? "y" : "n";
        const key4 = (knockout) ? "y" : "n";
        const key5 = (appliesStrength) ? "y" : "n";
        const key = `f${key1}${key2}${key3}${type}${key4}${key5}${gradientStopsLength}`;

        if (!this._$collection.has(key)) {
            const texturesLength = (transformsBase) ? 2 : 1;
            let mediumpLength = ((transformsBase) ? 4 : 0)
                + ((transformsBlur) ? 4 : 0)
                + ((appliesStrength) ? 1 : 0);
            if (gradientStopsLength > 0) {
                mediumpLength += gradientStopsLength * 5;
            } else {
                mediumpLength += (isGlow) ? 4 : 8;
            }
            mediumpLength = Util.$ceil(mediumpLength / 4);

            this._$collection.set(key, new CanvasToWebGLShader(
                this._$gl, this._$context,
                VertexShaderSource.TEXTURE(this._$keyword),
                FragmentShaderSourceFilter.TEMPLATE(
                    this._$keyword, texturesLength, mediumpLength,
                    transformsBase, transformsBlur,
                    isGlow, type, knockout,
                    appliesStrength, gradientStopsLength
                )
            ));
        }

        return this._$collection.get(key);
    }

    /**
     * @return {CanvasToWebGLShader}
     * @method
     * @public
     */
    getColorMatrixFilterShader ()
    {
        const key = `m`;

        if (!this._$collection.has(key)) {
            this._$collection.set(key, new CanvasToWebGLShader(
                this._$gl, this._$context,
                VertexShaderSource.TEXTURE(this._$keyword),
                FragmentShaderSourceColorMatrixFilter.TEMPLATE(this._$keyword)
            ));
        }

        return this._$collection.get(key);
    }

    /**
     * @param  {number}  x
     * @param  {number}  y
     * @param  {boolean} preserveAlpha
     * @param  {boolean} clamp
     * @return {CanvasToWebGLShader}
     * @method
     * @public
     */
    getConvolutionFilterShader (x, y, preserveAlpha, clamp)
    {
        const key1 = ("0" + x).slice(-2);
        const key2 = ("0" + y).slice(-2);
        const key3 = (preserveAlpha) ? "y" : "n";
        const key4 = (clamp) ? "y" : "n";
        const key = `c${key1}${key2}${key3}${key4}`;

        if (!this._$collection.has(key)) {
            const mediumpLength = ((clamp) ? 1 : 2) + Util.$ceil((x * y) / 4);

            this._$collection.set(key, new CanvasToWebGLShader(
                this._$gl, this._$context,
                VertexShaderSource.TEXTURE(this._$keyword),
                FragmentShaderSourceConvolutionFilter.TEMPLATE(
                    this._$keyword, mediumpLength,
                    x, y, preserveAlpha, clamp
                )
            ));
        }

        return this._$collection.get(key);
    }

    /**
     * @param  {number} componentX
     * @param  {number} componentY
     * @param  {string} mode
     * @return {CanvasToWebGLShader}
     * @method
     * @public
     */
    getDisplacementMapFilterShader (componentX, componentY, mode)
    {
        const key = `d${componentX}${componentY}${mode}`;

        if (!this._$collection.has(key)) {
            const mediumpLength = (mode === DisplacementMapFilterMode.COLOR) ? 3 : 2;

            this._$collection.set(key, new CanvasToWebGLShader(
                this._$gl, this._$context,
                VertexShaderSource.TEXTURE(this._$keyword),
                FragmentShaderSourceDisplacementMapFilter.TEMPLATE(
                    this._$keyword, mediumpLength,
                    componentX, componentY, mode
                )
            ));
        }

        return this._$collection.get(key);
    }

    /**
     * @param {WebGLShaderUniform} uniform
     * @param {number}  width
     * @param {number}  height
     * @param {boolean} isHorizontal
     * @param {number}  fraction
     * @param {number}  samples
     * @method
     * @public
     */
    setBlurFilterUniform (uniform, width, height, isHorizontal, fraction, samples)
    {
        const mediump = uniform.mediump;

        // fragment: u_offset
        if (isHorizontal) {
            mediump[0] = 1 / width;
            mediump[1] = 0;
        } else {
            mediump[0] = 0;
            mediump[1] = 1 / height;
        }

        // fragment: u_fraction
        mediump[2] = fraction;

        // fragment: u_samples
        mediump[3] = samples;
    }

    /**
     * @param {WebGLShaderUniform} uniform
     * @param {number}  width
     * @param {number}  height
     * @param {number}  baseWidth
     * @param {number}  baseHeight
     * @param {number}  baseOffsetX
     * @param {number}  baseOffsetY
     * @param {number}  blurWidth
     * @param {number}  blurHeight
     * @param {number}  blurOffsetX
     * @param {number}  blurOffsetY
     * @param {boolean} isGlow
     * @param {number}  strength
     * @param {array}   ratios
     * @param {array}   colors1
     * @param {array}   colors2
     * @param {boolean} transformsBase
     * @param {boolean} transformsBlur
     * @param {boolean} appliesStrength
     * @param {number}  gradientStopsLength
     * @method
     * @public
     */
    setBitmapFilterUniform (
        uniform, width, height,
        baseWidth, baseHeight, baseOffsetX, baseOffsetY,
        blurWidth, blurHeight, blurOffsetX, blurOffsetY,
        isGlow, strength, ratios, colors1, colors2,
        transformsBase, transformsBlur, appliesStrength, gradientStopsLength
    ) {
        if (transformsBase) {
            // fragment: u_textures
            const textures = uniform.textures;
            textures[0] = 0;
            textures[1] = 1;
        }

        const mediump = uniform.mediump;
        let i = 0;

        if (transformsBase) {
            // fragment: u_uv_scale
            mediump[i]     = width / baseWidth;
            mediump[i + 1] = height / baseHeight;
            // fragment: u_uv_offset
            mediump[i + 2] = baseOffsetX / baseWidth;
            mediump[i + 3] = (height - baseHeight - baseOffsetY) / baseHeight;
            i += 4;
        }

        if (transformsBlur) {
            // fragment: u_st_scale
            mediump[i]     = width / blurWidth;
            mediump[i + 1] = height / blurHeight;
            // fragment: u_st_offset
            mediump[i + 2] = blurOffsetX / blurWidth;
            mediump[i + 3] = (height - blurHeight - blurOffsetY) / blurHeight;
            i += 4;
        }

        if (gradientStopsLength > 0) {
            // fragment: u_gradient_color
            for (let j = 0; j < gradientStopsLength; j++) {
                const color1 = colors1[j];
                mediump[i]     = ((color1 >> 16)       ) / 255;
                mediump[i + 1] = ((color1 >>  8) & 0xFF) / 255;
                mediump[i + 2] = ( color1        & 0xFF) / 255;
                mediump[i + 3] = colors2[j];
                i += 4;
            }
            // fragment: u_gradient_t
            for (let j = 0; j < gradientStopsLength; j++) {
                mediump[i++] = ratios[j];
            }
        } else if (isGlow) {
            // fragment: u_color
            mediump[i]     = colors1[0];
            mediump[i + 1] = colors1[1];
            mediump[i + 2] = colors1[2];
            mediump[i + 3] = colors1[3];
            i += 4;
        } else {
            // fragment: u_highlight_color
            mediump[i]     = colors1[0];
            mediump[i + 1] = colors1[1];
            mediump[i + 2] = colors1[2];
            mediump[i + 3] = colors1[3];
            // fragment: u_shadow_color
            mediump[i + 4] = colors2[0];
            mediump[i + 5] = colors2[1];
            mediump[i + 6] = colors2[2];
            mediump[i + 7] = colors2[3];
            i+= 8;
        }

        if (appliesStrength) {
            // fragment: u_strength
            mediump[i++] = strength;
        }
    }

    /**
     * @param {WebGLShaderUniform} uniform
     * @param {array} matrix
     * @method
     * @public
     */
    setColorMatrixFilterUniform (uniform, matrix)
    {
        const mediump = uniform.mediump;

        // fragment: u_mul
        mediump[0]  = matrix[0];
        mediump[1]  = matrix[1];
        mediump[2]  = matrix[2];
        mediump[3]  = matrix[3];

        mediump[4]  = matrix[5];
        mediump[5]  = matrix[6];
        mediump[6]  = matrix[7];
        mediump[7]  = matrix[8];

        mediump[8]  = matrix[10];
        mediump[9]  = matrix[11];
        mediump[10] = matrix[12];
        mediump[11] = matrix[13];

        mediump[12] = matrix[15];
        mediump[13] = matrix[16];
        mediump[14] = matrix[17];
        mediump[15] = matrix[18];

        // fragment: u_add
        mediump[16] = matrix[4]  / 255;
        mediump[17] = matrix[9]  / 255;
        mediump[18] = matrix[14] / 255;
        mediump[19] = matrix[19] / 255;
    }

    /**
     * @param {WebGLShaderUniform} uniform
     * @param {number}  width
     * @param {number}  height
     * @param {array}   matrix
     * @param {number}  divisor
     * @param {number}  bias
     * @param {boolean} clamp
     * @param {array}   color
     * @method
     * @public
     */
    setConvolutionFilterUniform (uniform, width, height, matrix, divisor, bias, clamp, color)
    {
        const mediump = uniform.mediump;

        // fragment: u_rcp_size
        mediump[0] = 1 / width;
        mediump[1] = 1 / height;

        // fragment: u_rcp_divisor
        mediump[2] = 1 / divisor;

        // fragment: u_bias
        mediump[3] = bias / 255;

        let i = 4;

        if (!clamp) {
            // fragment: u_substitute_color
            mediump[i]     = color[0];
            mediump[i + 1] = color[1];
            mediump[i + 2] = color[2];
            mediump[i + 3] = color[3];
            i += 4;
        }

        // fragment: u_matrix
        const length = matrix.length;
        for (let j = 0; j < length; j++) {
            mediump[i++] = matrix[j];
        }
    }

    /**
     * @param {WebGLShaderUniform} uniform
     * @param {number} mapWidth
     * @param {number} mapHeight
     * @param {number} baseWidth
     * @param {number} baseHeight
     * @param {number} pointX
     * @param {number} pointY
     * @param {number} scaleX
     * @param {number} scaleY
     * @param {string} mode
     * @param {array}  color
     * @method
     * @public
     */
    setDisplacementMapFilterUniform (
        uniform, mapWidth, mapHeight, baseWidth, baseHeight,
        pointX, pointY, scaleX, scaleY, mode, color
    ) {
        const textures = uniform.textures;
        textures[0] = 0;
        textures[1] = 1;

        const mediump = uniform.mediump;

        // fragment: u_uv_to_st_scale
        mediump[0] = baseWidth  / mapWidth;
        mediump[1] = baseHeight / mapHeight;
        // fragment: u_uv_to_st_offset
        mediump[2] = pointX / mapWidth;
        mediump[3] = (baseHeight - mapHeight - pointY) / mapHeight;

        // fragment: u_scale
        mediump[4] =  scaleX / baseWidth;
        mediump[5] = -scaleY / baseHeight;

        if (mode === DisplacementMapFilterMode.COLOR) {
            // fragment: u_substitute_color
            mediump[8]  = color[0];
            mediump[9]  = color[1];
            mediump[10] = color[2];
            mediump[11] = color[3];
        }
    }
}

/**
 * @class
 */
class GradientShaderVariantCollection
{
    /**
     * @param {CanvasToWebGLContext}  context
     * @param {WebGLRenderingContext} gl
     * @param {WebGLShaderKeyword}    keyword
     * @constructor
     * @public
     */
    constructor (context, gl, keyword)
    {
        this._$context    = context;
        this._$gl         = gl;
        this._$keyword    = keyword;
        this._$collection = new Map();
    }

    /**
     * @param  {boolean} isStroke
     * @param  {boolean} hasGrid
     * @param  {boolean} isRadial
     * @param  {boolean} hasFocalPoint
     * @param  {string}  spreadMethod
     * @param  {number}  stopsLength
     * @param  {boolean} isLinearSpace
     * @return {CanvasToWebGLShader}
     * @method
     * @public
     */
    getGradientShader (isStroke, hasGrid, isRadial, hasFocalPoint, spreadMethod, stopsLength, isLinearSpace)
    {
        const key = this.createCollectionKey(isStroke, hasGrid, isRadial, hasFocalPoint, spreadMethod, stopsLength, isLinearSpace);
        
        if (!this._$collection.has(key)) {
            let highpLength = ((hasGrid) ? 13 : 5) + ((isStroke) ? 1 : 0);
            const fragmentIndex = highpLength;

            if (isRadial) {
                highpLength += Util.$ceil((stopsLength * 5 + ((hasFocalPoint) ? 2 : 1)) / 4);
            } else {
                highpLength += 1 + Util.$ceil((stopsLength * 5) / 4);
            }

            let vertexShaderSource;
            if (isStroke) {
                vertexShaderSource = VertexShaderSourceStroke.TEMPLATE(
                    this._$keyword, highpLength, fragmentIndex,
                    true, false, hasGrid
                );
            } else {
                vertexShaderSource = VertexShaderSourceFill.TEMPLATE(
                    this._$keyword, highpLength,
                    true, false, hasGrid
                );
            }

            this._$collection.set(key, new CanvasToWebGLShader(
                this._$gl, this._$context,
                vertexShaderSource,
                FragmentShaderSourceGradient.TEMPLATE(
                    this._$keyword, highpLength, fragmentIndex,
                    isRadial, hasFocalPoint, spreadMethod, stopsLength, isLinearSpace
                )
            ));
        }
        
        return this._$collection.get(key);
    }

    /**
     * @param  {boolean} isStroke
     * @param  {boolean} hasGrid
     * @param  {boolean} isRadial
     * @param  {boolean} hasFocalPoint
     * @param  {string}  spreadMethod
     * @param  {number}  stopsLength
     * @param  {boolean} isLinearSpace
     * @return {string}
     * @method
     * @private
     */
    createCollectionKey (isStroke, hasGrid, isRadial, hasFocalPoint, spreadMethod, stopsLength, isLinearSpace)
    {
        const key1 = (isStroke) ? "y" : "n";
        const key2 = (hasGrid) ? "y" : "n";
        const key3 = (isRadial) ? "y" : "n";
        const key4 = (isRadial && hasFocalPoint) ? "y" : "n";
        let key5 = 0;
        switch (spreadMethod) {
            case "reflect":
                key5 = 1;
                break;
            case "repeat":
                key5 = 2;
                break;
        }
        const key6 = ("0" + stopsLength).slice(-2);
        const key7 = (isLinearSpace) ? "y" : "n";

        return `${key1}${key2}${key3}${key4}${key5}${key6}${key7}`;
    }

    /**
     * @param {WebGLShaderUniform} uniform
     * @param {boolean} isStroke
     * @param {number}  halfWidth
     * @param {number}  face
     * @param {number}  miterLimit
     * @param {boolean} hasGrid
     * @param {array}   matrix
     * @param {array}   inverseMatrix
     * @param {array}   viewport
     * @param {CanvasToWebGLContextGrid} grid
     * @param {boolean} isRadial
     * @param {array}   points
     * @param {boolean} hasFocalPoint
     * @param {number}  focalPointRatio
     * @param {array}   stops
     * @param {number}  stopsLength
     * @param {boolean} isLinearSpace
     * @method
     * @public
     */
    setGradientUniform (
        uniform,
        isStroke, halfWidth, face, miterLimit,
        hasGrid, matrix, inverseMatrix, viewport, grid,
        isRadial, points, hasFocalPoint, focalPointRatio, stops, stopsLength, isLinearSpace
    ) {
        let i = 0;
        const highp = uniform.highp;

        // vertex: u_matrix
        highp[0]  = matrix[0];
        highp[1]  = matrix[1];
        highp[2]  = matrix[2];

        highp[4]  = matrix[3];
        highp[5]  = matrix[4];
        highp[6]  = matrix[5];

        highp[8]  = matrix[6];
        highp[9]  = matrix[7];
        highp[10] = matrix[8];

        // vertex: u_inverse_matrix
        highp[12] = inverseMatrix[0];
        highp[13] = inverseMatrix[1];
        highp[14] = inverseMatrix[2];

        highp[16] = inverseMatrix[3];
        highp[17] = inverseMatrix[4];
        highp[18] = inverseMatrix[5];

        highp[11] = inverseMatrix[6];
        highp[15] = inverseMatrix[7];
        highp[19] = inverseMatrix[8];

        // vertex: u_viewport
        highp[3] = viewport[0];
        highp[7] = viewport[1];

        i = 20;

        if (hasGrid) {
            const parentMatrix = grid._$parentMatrix;
            const ancestorMatrix = grid._$ancestorMatrix;
            const parentViewport = grid._$parentViewport;
            const gridMin = grid._$gridMin;
            const gridMax = grid._$gridMax;

            // vertex: u_parent_matrix
            highp[i]      = parentMatrix[0];
            highp[i + 1]  = parentMatrix[1];
            highp[i + 2]  = parentMatrix[2];

            highp[i + 4]  = parentMatrix[3];
            highp[i + 5]  = parentMatrix[4];
            highp[i + 6]  = parentMatrix[5];

            highp[i + 8]  = parentMatrix[6];
            highp[i + 9]  = parentMatrix[7];
            highp[i + 10] = parentMatrix[8];

            // vertex: u_ancestor_matrix
            highp[i + 12] = ancestorMatrix[0];
            highp[i + 13] = ancestorMatrix[1];
            highp[i + 14] = ancestorMatrix[2];

            highp[i + 16] = ancestorMatrix[3];
            highp[i + 17] = ancestorMatrix[4];
            highp[i + 18] = ancestorMatrix[5];

            highp[i + 20] = ancestorMatrix[6];
            highp[i + 21] = ancestorMatrix[7];
            highp[i + 22] = ancestorMatrix[8];

            // vertex: u_parent_viewport
            highp[i + 11] = parentViewport[0];
            highp[i + 15] = parentViewport[1];
            highp[i + 19] = parentViewport[2];
            highp[i + 23] = parentViewport[3];

            // vertex: u_grid_min
            highp[i + 24] = gridMin[0];
            highp[i + 25] = gridMin[1];
            highp[i + 26] = gridMin[2];
            highp[i + 27] = gridMin[3];
            // vertex: u_grid_max
            highp[i + 28] = gridMax[0];
            highp[i + 29] = gridMax[1];
            highp[i + 30] = gridMax[2];
            highp[i + 31] = gridMax[3];

            i = 52;
        }

        if (isStroke) {
            // vertex: u_half_width
            highp[i]     = halfWidth;
            // vertex: u_face
            highp[i + 1] = face;
            // vertex: u_miter_limit
            highp[i + 2] = miterLimit;

            i += 4;
        }

        if (!isRadial) {
            // fragment: u_linear_points
            highp[i]     = points[0];
            highp[i + 1] = points[1];
            highp[i + 2] = points[2];
            highp[i + 3] = points[3];

            i += 4;
        }

        const table = (isLinearSpace)
            ? Util.$rgbToLinearTable
            : Util.$rgbIdentityTable;
        // fragment: u_gradient_color
        for (let j = 0; j < stopsLength; j++) {
            const color = stops[j][1];
            highp[i]     = table[color[0]];
            highp[i + 1] = table[color[1]];
            highp[i + 2] = table[color[2]];
            highp[i + 3] = table[color[3]];

            i += 4;
        }
        // fragment: u_gradient_t
        for (let j = 0; j < stopsLength; j++) {
            highp[i++] = stops[j][0];
        }

        if (isRadial) {
            // fragment: u_radial_point
            highp[i++] = points[5];
            if (hasFocalPoint) {
                // fragment: u_focal_point_ratio
                highp[i++] = focalPointRatio;
            }
        }
    }
}

/**
 * @class
 */
class ShapeShaderVariantCollection
{
    /**
     * @param {CanvasToWebGLContext}  context
     * @param {WebGLRenderingContext} gl
     * @param {WebGLShaderKeyword}    keyword
     * @constructor
     * @public
     */
    constructor (context, gl, keyword)
    {
        this._$context    = context;
        this._$gl         = gl;
        this._$keyword    = keyword;
        this._$collection = new Map();
    }

    /**
     * @param  {boolean} isStroke
     * @param  {boolean} hasGrid
     * @return {CanvasToWebGLShader}
     * @method
     * @public
     */
    getSolidColorShapeShader (isStroke, hasGrid)
    {
        const key = `s${(isStroke) ? "y" : "n"}${(hasGrid) ? "y" : "n"}`;        

        if (!this._$collection.has(key)) {
            const highpLength = ((hasGrid) ? 8 : 3) + ((isStroke) ? 1 : 0);
            const fragmentIndex = highpLength;

            let vertexShaderSource;
            if (isStroke) {
                vertexShaderSource = VertexShaderSourceStroke.TEMPLATE(
                    this._$keyword, highpLength, fragmentIndex,
                    false, false, hasGrid
                );
            } else {
                vertexShaderSource = VertexShaderSourceFill.TEMPLATE(
                    this._$keyword, highpLength,
                    false, false, hasGrid
                );
            }

            this._$collection.set(key, new CanvasToWebGLShader(
                this._$gl, this._$context,
                vertexShaderSource,
                FragmentShaderSource.SOLID_COLOR(this._$keyword)
            ));
        }

        return this._$collection.get(key);
    }

    /**
     * @param  {boolean} isStroke
     * @param  {boolean} repeat
     * @param  {boolean} hasGrid
     * @return {CanvasToWebGLShader}
     * @method
     * @public
     */
    getBitmapShapeShader (isStroke, repeat, hasGrid)
    {
        const key = `b${(isStroke) ? "y" : "n"}${(repeat) ? "y" : "n"}${(hasGrid) ? "y" : "n"}`;

        if (!this._$collection.has(key)) {
            const highpLength = ((hasGrid) ? 13 : 5) + ((isStroke) ? 1 : 0);
            const fragmentIndex = highpLength;

            let vertexShaderSource;
            if (isStroke) {
                vertexShaderSource = VertexShaderSourceStroke.TEMPLATE(
                    this._$keyword, highpLength, fragmentIndex,
                    true, false, hasGrid
                );
            } else {
                vertexShaderSource = VertexShaderSourceFill.TEMPLATE(
                    this._$keyword, highpLength,
                    true, false, hasGrid
                );
            }

            const fragmentShaderSource = (repeat)
                ? FragmentShaderSource.BITMAP_PATTERN(this._$keyword)
                : FragmentShaderSource.BITMAP_CLIPPED(this._$keyword);

            this._$collection.set(key, new CanvasToWebGLShader(
                this._$gl, this._$context,
                vertexShaderSource,
                fragmentShaderSource
            ));
        }

        return this._$collection.get(key);
    }

    /**
     * @param  {boolean} isStroke
     * @param  {boolean} hasGrid
     * @return {CanvasToWebGLShader}
     * @method
     * @public
     */
    getMaskShapeShader (isStroke, hasGrid)
    {
        const key = `m${(isStroke) ? "y" : "n"}${(hasGrid) ? "y" : "n"}`;

        if (!this._$collection.has(key)) {
            const highpLength = ((hasGrid) ? 8 : 3) + ((isStroke) ? 1 : 0);
            const fragmentIndex = highpLength;

            let vertexShaderSource;
            if (isStroke) {
                vertexShaderSource = VertexShaderSourceStroke.TEMPLATE(
                    this._$keyword, highpLength, fragmentIndex,
                    false, true, hasGrid
                );
            } else {
                vertexShaderSource = VertexShaderSourceFill.TEMPLATE(
                    this._$keyword, highpLength,
                    false, true, hasGrid
                );
            }

            this._$collection.set(key, new CanvasToWebGLShader(
                this._$gl, this._$context,
                vertexShaderSource,
                FragmentShaderSource.MASK(this._$keyword)
            ));
        }

        return this._$collection.get(key);
    }

    /**
     * @param {WebGLShaderUniform} uniform
     * @param isStroke
     * @param halfWidth
     * @param face
     * @param miterLimit
     * @param hasGrid
     * @param matrix
     * @param viewport
     * @param grid
     * @param color
     * @param alpha
     * @method
     * @public
     */
    setSolidColorShapeUniform (
        uniform,
        isStroke, halfWidth, face, miterLimit,
        hasGrid, matrix, viewport, grid,
        color, alpha
    ) {
        const highp = uniform.highp;
        let i;

        if (hasGrid) {
            const parentMatrix = grid._$parentMatrix;
            const ancestorMatrix = grid._$ancestorMatrix;
            const parentViewport = grid._$parentViewport;
            const gridMin = grid._$gridMin;
            const gridMax = grid._$gridMax;

            // vertex: u_parent_matrix
            highp[0]  = parentMatrix[0];
            highp[1]  = parentMatrix[1];
            highp[2]  = parentMatrix[2];

            highp[4]  = parentMatrix[3];
            highp[5]  = parentMatrix[4];
            highp[6]  = parentMatrix[5];

            highp[8]  = parentMatrix[6];
            highp[9]  = parentMatrix[7];
            highp[10] = parentMatrix[8];

            // vertex: u_ancestor_matrix
            highp[12] = ancestorMatrix[0];
            highp[13] = ancestorMatrix[1];
            highp[14] = ancestorMatrix[2];

            highp[16] = ancestorMatrix[3];
            highp[17] = ancestorMatrix[4];
            highp[18] = ancestorMatrix[5];

            highp[20] = ancestorMatrix[6];
            highp[21] = ancestorMatrix[7];
            highp[22] = ancestorMatrix[8];

            // vertex: u_viewport
            highp[3] = viewport[0];
            highp[7] = viewport[1];

            // vertex: u_parent_viewport
            highp[11] = parentViewport[0];
            highp[15] = parentViewport[1];
            highp[19] = parentViewport[2];
            highp[23] = parentViewport[3];

            // vertex: u_grid_min
            highp[24] = gridMin[0];
            highp[25] = gridMin[1];
            highp[26] = gridMin[2];
            highp[27] = gridMin[3];
            // vertex: u_grid_max
            highp[28] = gridMax[0];
            highp[29] = gridMax[1];
            highp[30] = gridMax[2];
            highp[31] = gridMax[3];

            i = 32;
        } else {
            // vertex: u_matrix
            highp[0]  = matrix[0];
            highp[1]  = matrix[1];
            highp[2]  = matrix[2];

            highp[4]  = matrix[3];
            highp[5]  = matrix[4];
            highp[6]  = matrix[5];

            highp[8]  = matrix[6];
            highp[9]  = matrix[7];
            highp[10] = matrix[8];

            // vertex: u_viewport
            highp[3] = viewport[0];
            highp[7] = viewport[1];

            i = 12;
        }

        if (isStroke) {
            // vertex: u_half_width
            highp[i]     = halfWidth;
            // vertex: u_face
            highp[i + 1] = face;
            // vertex: u_miter_limit
            highp[i + 2] = miterLimit;
        }

        const mediump = uniform.mediump;

        // fragment: u_color
        mediump[0] = color[0];
        mediump[1] = color[1];
        mediump[2] = color[2];
        mediump[3] = color[3] * alpha;
    }

    /**
     * @param {WebGLShaderUniform} uniform
     * @param isStroke
     * @param halfWidth
     * @param face
     * @param miterLimit
     * @param hasGrid
     * @param matrix
     * @param inverseMatrix
     * @param viewport
     * @param grid
     * @param textureWidth
     * @param textureHeight
     * @param mul1
     * @param mul2
     * @param mul3
     * @param mul4
     * @param add1
     * @param add2
     * @param add3
     * @param add4
     * @method
     * @public
     */
    setBitmapShapeUniform (
        uniform,
        isStroke, halfWidth, face, miterLimit,
        hasGrid, matrix, inverseMatrix, viewport, grid,
        textureWidth, textureHeight,
        mul1, mul2, mul3, mul4,
        add1, add2, add3, add4
    ) {
        const highp = uniform.highp;
        let i;

        // vertex: u_matrix
        highp[0]  = matrix[0];
        highp[1]  = matrix[1];
        highp[2]  = matrix[2];

        highp[4]  = matrix[3];
        highp[5]  = matrix[4];
        highp[6]  = matrix[5];

        highp[8]  = matrix[6];
        highp[9]  = matrix[7];
        highp[10] = matrix[8];

        // vertex: u_inverse_matrix
        highp[12] = inverseMatrix[0];
        highp[13] = inverseMatrix[1];
        highp[14] = inverseMatrix[2];

        highp[16] = inverseMatrix[3];
        highp[17] = inverseMatrix[4];
        highp[18] = inverseMatrix[5];

        highp[11] = inverseMatrix[6];
        highp[15] = inverseMatrix[7];
        highp[19] = inverseMatrix[8];

        // vertex: u_viewport
        highp[3] = viewport[0];
        highp[7] = viewport[1];

        i = 20;

        if (hasGrid) {
            const parentMatrix = grid._$parentMatrix;
            const ancestorMatrix = grid._$ancestorMatrix;
            const parentViewport = grid._$parentViewport;
            const gridMin = grid._$gridMin;
            const gridMax = grid._$gridMax;

            // vertex: u_parent_matrix
            highp[i]      = parentMatrix[0];
            highp[i + 1]  = parentMatrix[1];
            highp[i + 2]  = parentMatrix[2];

            highp[i + 4]  = parentMatrix[3];
            highp[i + 5]  = parentMatrix[4];
            highp[i + 6]  = parentMatrix[5];

            highp[i + 8]  = parentMatrix[6];
            highp[i + 9]  = parentMatrix[7];
            highp[i + 10] = parentMatrix[8];

            // vertex: u_ancestor_matrix
            highp[i + 12] = ancestorMatrix[0];
            highp[i + 13] = ancestorMatrix[1];
            highp[i + 14] = ancestorMatrix[2];

            highp[i + 16] = ancestorMatrix[3];
            highp[i + 17] = ancestorMatrix[4];
            highp[i + 18] = ancestorMatrix[5];

            highp[i + 20] = ancestorMatrix[6];
            highp[i + 21] = ancestorMatrix[7];
            highp[i + 22] = ancestorMatrix[8];

            // vertex: u_parent_viewport
            highp[i + 11] = parentViewport[0];
            highp[i + 15] = parentViewport[1];
            highp[i + 19] = parentViewport[2];
            highp[i + 23] = parentViewport[3];

            // vertex: u_grid_min
            highp[i + 24] = gridMin[0];
            highp[i + 25] = gridMin[1];
            highp[i + 26] = gridMin[2];
            highp[i + 27] = gridMin[3];
            // vertex: u_grid_max
            highp[i + 28] = gridMax[0];
            highp[i + 29] = gridMax[1];
            highp[i + 30] = gridMax[2];
            highp[i + 31] = gridMax[3];

            i = 52;
        }

        if (isStroke) {
            // vertex: u_half_width
            highp[i]     = halfWidth;
            // vertex: u_face
            highp[i + 1] = face;
            // vertex: u_miter_limit
            highp[i + 2] = miterLimit;
        }

        const mediump = uniform.mediump;

        // fragment: u_uv
        mediump[0] = textureWidth;
        mediump[1] = textureHeight;

        // fragment: u_color_transform_mul
        mediump[4] = mul1;
        mediump[5] = mul2;
        mediump[6] = mul3;
        mediump[7] = mul4;
        // fragment: u_color_transform_add
        mediump[8]  = add1;
        mediump[9]  = add2;
        mediump[10] = add3;
        mediump[11] = add4;
    }

    /**
     * @param {WebGLShaderUniform} uniform
     * @param hasGrid
     * @param matrix
     * @param viewport
     * @param grid
     * @method
     * @public
     */
    setMaskShapeUniform (uniform, hasGrid, matrix, viewport, grid)
    {
        const highp = uniform.highp;

        if (hasGrid) {
            const parentMatrix = grid._$parentMatrix;
            const ancestorMatrix = grid._$ancestorMatrix;
            const parentViewport = grid._$parentViewport;
            const gridMin = grid._$gridMin;
            const gridMax = grid._$gridMax;

            // vertex: u_parent_matrix
            highp[0]  = parentMatrix[0];
            highp[1]  = parentMatrix[1];
            highp[2]  = parentMatrix[2];

            highp[4]  = parentMatrix[3];
            highp[5]  = parentMatrix[4];
            highp[6]  = parentMatrix[5];

            highp[8]  = parentMatrix[6];
            highp[9]  = parentMatrix[7];
            highp[10] = parentMatrix[8];

            // vertex: u_ancestor_matrix
            highp[12] = ancestorMatrix[0];
            highp[13] = ancestorMatrix[1];
            highp[14] = ancestorMatrix[2];

            highp[16] = ancestorMatrix[3];
            highp[17] = ancestorMatrix[4];
            highp[18] = ancestorMatrix[5];

            highp[20] = ancestorMatrix[6];
            highp[21] = ancestorMatrix[7];
            highp[22] = ancestorMatrix[8];

            // vertex: u_viewport
            highp[3] = viewport[0];
            highp[7] = viewport[1];

            // vertex: u_parent_viewport
            highp[11] = parentViewport[0];
            highp[15] = parentViewport[1];
            highp[19] = parentViewport[2];
            highp[23] = parentViewport[3];

            // vertex: u_grid_min
            highp[24] = gridMin[0];
            highp[25] = gridMin[1];
            highp[26] = gridMin[2];
            highp[27] = gridMin[3];
            // vertex: u_grid_max
            highp[28] = gridMax[0];
            highp[29] = gridMax[1];
            highp[30] = gridMax[2];
            highp[31] = gridMax[3];
        } else {
            // vertex: u_matrix
            highp[0]  = matrix[0];
            highp[1]  = matrix[1];
            highp[2]  = matrix[2];

            highp[4]  = matrix[3];
            highp[5]  = matrix[4];
            highp[6]  = matrix[5];

            highp[8]  = matrix[6];
            highp[9]  = matrix[7];
            highp[10] = matrix[8];

            // vertex: u_viewport
            highp[3] = viewport[0];
            highp[7] = viewport[1];
        }
    }

    /**
     * @param {WebGLShaderUniform} uniform
     * @param {number} width
     * @param {number} height
     * @method
     * @public
     */
    setMaskShapeUniformIdentity (uniform, width, height)
    {
        const highp = uniform.highp;

        // vertex: u_matrix
        highp[0]  = 1;
        highp[1]  = 0;
        highp[2]  = 0;

        highp[4]  = 0;
        highp[5]  = 1;
        highp[6]  = 0;

        highp[8]  = 0;
        highp[9]  = 0;
        highp[10] = 1;

        // vertex: u_viewport
        highp[3] = width;
        highp[7] = height;
    }
}

/**
 * @class
 */
class FragmentShaderSourceBlurFilter
{
    /**
     * @param  {WebGLShaderKeyword} k
     * @param  {number} halfBlur
     * @return {string}
     * @method
     * @static
     */
    static TEMPLATE (k, halfBlur)
    {
        const halfBlurFixed = halfBlur.toFixed(1);

        return `${k.version()}
precision mediump float;

uniform sampler2D u_texture;
uniform vec4 u_mediump;

${k.varyingIn()} vec2 v_coord;
${k.outColor()}

void main() {
    vec2  offset   = u_mediump.xy;
    float fraction = u_mediump.z;
    float samples  = u_mediump.w;
    
    vec4 color = ${k.texture2D()}(u_texture, v_coord);

    for (float i = 1.0; i < ${halfBlurFixed}; i += 1.0) {
        color += ${k.texture2D()}(u_texture, v_coord + offset * i);
        color += ${k.texture2D()}(u_texture, v_coord - offset * i);
    }
    color += ${k.texture2D()}(u_texture, v_coord + offset * ${halfBlurFixed}) * fraction;
    color += ${k.texture2D()}(u_texture, v_coord - offset * ${halfBlurFixed}) * fraction;
    color /= samples;

    ${k.fragColor()} = color;
}

`;
    }
}

/**
 * @class
 */
class FragmentShaderSourceColorMatrixFilter
{
    /**
     * @param  {WebGLShaderKeyword} k
     * @return {string}
     * @method
     * @static
     */
    static TEMPLATE (k)
    {
        return `${k.version()}
precision mediump float;

uniform sampler2D u_texture;
uniform vec4 u_mediump[5];

${k.varyingIn()} vec2 v_coord;
${k.outColor()}

void main() {
    mat4 mul = mat4(u_mediump[0], u_mediump[1], u_mediump[2], u_mediump[3]);
    vec4 add = u_mediump[4];
    
    vec4 color = ${k.texture2D()}(u_texture, v_coord);

    color.rgb /= max(0.0001, color.a);
    color = clamp(color * mul + add, 0.0, 1.0);
    color.rgb *= color.a;

    ${k.fragColor()} = color;
}

`;
    }
}

/**
 * @class
 */
class FragmentShaderSourceConvolutionFilter
{
    /**
     * @param  {WebGLShaderKeyword} k
     * @param  {number}  mediumpLength
     * @param  {number}  x
     * @param  {number}  y
     * @param  {boolean} preserveAlpha
     * @param  {boolean} clamp
     * @return {string}
     * @method
     * @static
     */
    static TEMPLATE (k, mediumpLength, x, y, preserveAlpha, clamp)
    {
        const halfX = Util.$floor(x * 0.5);
        const halfY = Util.$floor(y * 0.5);
        const size = x * y;

        let matrixStatement = "";
        const matrixIndex = (clamp) ? 1 : 2;
        for (let i = 0; i < size; i++) {
            const index     = matrixIndex + Util.$floor(i / 4);
            const component = i % 4;
            matrixStatement += `
    result += getWeightedColor(${i}, u_mediump[${index}][${component}]);
`;
        }      

        const preserveAlphaStatement = (preserveAlpha)
            ? `result.a = ${k.texture2D()}(u_texture, v_coord).a;`
            : "";
        const clampStatement = (clamp)
            ? ""
            : `
    vec4 substitute_color = u_mediump[1];
    color = mix(substitute_color, color, isInside(uv));
`;

        return `${k.version()}
precision mediump float;

uniform sampler2D u_texture;
uniform vec4 u_mediump[${mediumpLength}];

${k.varyingIn()} vec2 v_coord;
${k.outColor()}

${FragmentShaderLibrary.FUNCTION_IS_INSIDE()}

vec4 getWeightedColor (in int i, in float weight) {
    vec2 rcp_size = u_mediump[0].xy;

    int i_div_x = i / ${x};
    int i_mod_x = i - ${x} * i_div_x;
    vec2 offset = vec2(i_mod_x - ${halfX}, ${halfY} - i_div_x);
    vec2 uv = v_coord + offset * rcp_size;

    vec4 color = ${k.texture2D()}(u_texture, uv);
    color.rgb /= max(0.0001, color.a);
    ${clampStatement}

    return color * weight;
}

void main() {
    float rcp_divisor = u_mediump[0].z;
    float bias        = u_mediump[0].w;

    vec4 result = vec4(0.0);
    ${matrixStatement}
    result = clamp(result * rcp_divisor + bias, 0.0, 1.0);
    ${preserveAlphaStatement}

    result.rgb *= result.a;
    ${k.fragColor()} = result;
}

`;
    }
}

/**
 * @class
 */
class FragmentShaderSourceDisplacementMapFilter
{
    /**
     * @param  {WebGLShaderKeyword} k
     * @param  {number} mediumpLength
     * @param  {number} componentX
     * @param  {number} componentY
     * @param  {string} mode
     * @return {string}
     * @method
     * @static
     */
    static TEMPLATE (k, mediumpLength, componentX, componentY, mode)
    {
        let cx, cy, modeStatement;

        switch (componentX) {
            case BitmapDataChannel.RED:
                cx = "map_color.r";
                break;
            case BitmapDataChannel.GREEN:
                cx = "map_color.g";
                break;
            case BitmapDataChannel.BLUE:
                cx = "map_color.b";
                break;
            case BitmapDataChannel.ALPHA:
                cx = "map_color.a";
                break;
            default:
                cx = "0.5";
                break;
        }

        switch (componentY) {
            case BitmapDataChannel.RED:
                cy = "map_color.r";
                break;
            case BitmapDataChannel.GREEN:
                cy = "map_color.g";
                break;
            case BitmapDataChannel.BLUE:
                cy = "map_color.b";
                break;
            case BitmapDataChannel.ALPHA:
                cy = "map_color.a";
                break;
            default:
                cy = "0.5";
                break;
        }

        switch (mode) {
            case DisplacementMapFilterMode.CLAMP:
                modeStatement = `
    vec4 source_color = ${k.texture2D()}(u_textures[0], uv);
`;
                break;
            case DisplacementMapFilterMode.IGNORE:
                // 置き換え後の座標が範囲外なら、置き換え前の座標をとる（x軸とy軸を別々に判定する）
                modeStatement = `
    vec4 source_color =${k.texture2D()}(u_textures[0], mix(v_coord, uv, step(abs(uv - vec2(0.5)), vec2(0.5))));
`;
                break;
            case DisplacementMapFilterMode.COLOR:
                modeStatement = `
    vec4 substitute_color = u_mediump[2];
    vec4 source_color = mix(substitute_color, ${k.texture2D()}(u_textures[0], uv), isInside(uv));
`;
                break;
            case DisplacementMapFilterMode.WRAP:
            default:
                modeStatement = `
    vec4 source_color = ${k.texture2D()}(u_textures[0], fract(uv));
`;
                break;
        }

        return `${k.version()}
precision mediump float;

uniform sampler2D u_textures[2];
uniform vec4 u_mediump[${mediumpLength}];

${k.varyingIn()} vec2 v_coord;
${k.outColor()}

${FragmentShaderLibrary.FUNCTION_IS_INSIDE()}

void main() {
    vec2 uv_to_st_scale  = u_mediump[0].xy;
    vec2 uv_to_st_offset = u_mediump[0].zw;
    vec2 scale           = u_mediump[1].xy;

    vec2 st = v_coord * uv_to_st_scale - uv_to_st_offset;
    vec4 map_color = ${k.texture2D()}(u_textures[1], st);

    vec2 offset = vec2(${cx}, ${cy}) - 0.5;
    vec2 uv = v_coord + offset * scale;
    ${modeStatement}

    ${k.fragColor()} = mix(${k.texture2D()}(u_textures[0], v_coord), source_color, isInside(st));
}

`;
    }
}

/**
 * @class
 */
class FragmentShaderSourceFilter
{
    /**
     * @param  {WebGLShaderKeyword} k
     * @param  {number}  texturesLength
     * @param  {number}  mediumpLength
     * @param  {boolean} transformsBase
     * @param  {boolean} transformsBlur
     * @param  {boolean} isGlow
     * @param  {string}  type
     * @param  {boolean} knockout
     * @param  {boolean} appliesStrength
     * @param  {number}  gradientStopsLength
     * @return {string}
     * @method
     * @static
     */
    static TEMPLATE (
        k, texturesLength, mediumpLength,
        transformsBase, transformsBlur,
        isGlow, type, knockout,
        appliesStrength, gradientStopsLength
    ) {
        let index = 0;

        const baseStatement = (transformsBase)
            ? this.STATEMENT_BASE_TEXTURE_TRANSFORM(k, index++)
            : "";
        const blurStatement = (transformsBlur)
            ? this.STATEMENT_BLUR_TEXTURE_TRANSFORM(k, index++)
            : this.STATEMENT_BLUR_TEXTURE(k);
        const isInner = (type === BitmapFilterType.INNER);
        const isGradient = (gradientStopsLength > 0);

        const colorIndex = index;
        let strengthOffset = index * 4;
        let gradientFunction, colorStatement;
        if (isGradient) {
            strengthOffset += gradientStopsLength * 5;
            gradientFunction = FragmentShaderLibrary.FUNCTION_GRADIENT_COLOR(gradientStopsLength, colorIndex, false);
            colorStatement = (isGlow)
                ? this.STATEMENT_GLOW(false, appliesStrength, isGradient, colorIndex, strengthOffset)
                : this.STATEMENT_BEVEL(k, transformsBlur, appliesStrength, isGradient, colorIndex, strengthOffset);
        } else if (isGlow) {
            strengthOffset += 4;
            gradientFunction = "";
            colorStatement = this.STATEMENT_GLOW(isInner, appliesStrength, isGradient, colorIndex, strengthOffset);
        } else {
            strengthOffset += 8;
            gradientFunction = "";
            colorStatement = this.STATEMENT_BEVEL(k, transformsBlur, appliesStrength, isGradient, colorIndex, strengthOffset);
        }

        let modeExpression;
        switch (type) {
            case BitmapFilterType.OUTER:
                modeExpression = (knockout)
                    ? "blur - blur * base.a"
                    : "base + blur - blur * base.a";
                break;
            case BitmapFilterType.FULL:
                modeExpression = (knockout)
                    ? "blur"
                    : "base - base * blur.a + blur";
                break;
            case BitmapFilterType.INNER:
            default:
                modeExpression = "blur";
                break;
        }

        return `${k.version()}
precision mediump float;

uniform sampler2D u_textures[${texturesLength}];
uniform vec4 u_mediump[${mediumpLength}];

${k.varyingIn()} vec2 v_coord;
${k.outColor()}

${FragmentShaderLibrary.FUNCTION_IS_INSIDE()}
${gradientFunction}

void main() {
    ${baseStatement}
    ${blurStatement}
    ${colorStatement}
    ${k.fragColor()} = ${modeExpression};
}

`;
    }

    /**
     * @return {string}
     * @method
     * @static
     */
    static STATEMENT_BASE_TEXTURE_TRANSFORM (k, index)
    {
        return `
    vec2 base_scale  = u_mediump[${index}].xy;
    vec2 base_offset = u_mediump[${index}].zw;

    vec2 uv = v_coord * base_scale - base_offset;
    vec4 base = mix(vec4(0.0), ${k.texture2D()}(u_textures[1], uv), isInside(uv));
`;
    }

    /**
     * @return {string}
     * @method
     * @static
     */
    static STATEMENT_BLUR_TEXTURE (k)
    {
        return `
    vec4 blur = ${k.texture2D()}(u_textures[0], v_coord);
`;
    }

    /**
     * @return {string}
     * @method
     * @static
     */
    static STATEMENT_BLUR_TEXTURE_TRANSFORM (k, index)
    {
        return `
    vec2 blur_scale  = u_mediump[${index}].xy;
    vec2 blur_offset = u_mediump[${index}].zw;

    vec2 st = v_coord * blur_scale - blur_offset;
    vec4 blur = mix(vec4(0.0), ${k.texture2D()}(u_textures[0], st), isInside(st));
`;
    }

    /**
     * @return {string}
     * @method
     * @static
     */
    static STATEMENT_GLOW (isInner, appliesStrength, isGradient, colorIndex, strengthOffset)
    {
        const innerStatement = (isInner)
            ? "blur.a = 1.0 - blur.a;"
            : "";
        const strengthStatement = (appliesStrength)
            ? this.STATEMENT_GLOW_STRENGTH(strengthOffset)
            : "";
        const colorStatement = (isGradient)
            ? this.STATEMENT_GLOW_GRADIENT_COLOR()
            : this.STATEMENT_GLOW_SOLID_COLOR(colorIndex);

        return `
    ${innerStatement}
    ${strengthStatement}
    ${colorStatement}
`;
    }

    /**
     * @return {string}
     * @method
     * @static
     */
    static STATEMENT_GLOW_STRENGTH (offset)
    {
        const index     = Util.$floor(offset / 4);
        const component = offset % 4;
        return `
    float strength = u_mediump[${index}][${component}];
    blur.a = clamp(blur.a * strength, 0.0, 1.0);
`;
    }

    /**
     * @return {string}
     * @method
     * @static
     */
    static STATEMENT_GLOW_SOLID_COLOR (index)
    {
        return `
    vec4 color = u_mediump[${index}];
    blur = color * blur.a;
`;
    }

    /**
     * @return {string}
     * @method
     * @static
     */
    static STATEMENT_GLOW_GRADIENT_COLOR ()
    {
        return `
    blur = getGradientColor(blur.a);
    blur.rgb *= blur.a;
`;
    }

    /**
     * @return {string}
     * @method
     * @static
     */
    static STATEMENT_BEVEL (k, transformsBlur, appliesStrength, isGradient, colorIndex, strengthOffset)
    {
        const blur2Statement = (transformsBlur)
            ? this.STATEMENT_BLUR_TEXTURE_TRANSFORM_2(k)
            : this.STATEMENT_BLUR_TEXTURE_2(k);
        const strengthStatement = (appliesStrength)
            ? this.STATEMENT_BEVEL_STRENGTH(strengthOffset)
            : "";
        const colorStatement = (isGradient)
            ? this.STATEMENT_BEVEL_GRADIENT_COLOR()
            : this.STATEMENT_BEVEL_SOLID_COLOR(colorIndex);

        return `
    ${blur2Statement}
    float highlight_alpha = blur.a - blur2.a;
    float shadow_alpha    = blur2.a - blur.a;
    ${strengthStatement}
    highlight_alpha = clamp(highlight_alpha, 0.0, 1.0);
    shadow_alpha    = clamp(shadow_alpha, 0.0, 1.0);
    ${colorStatement}
`;
    }

    /**
     * @return {string}
     * @method
     * @static
     */
    static STATEMENT_BLUR_TEXTURE_2 (k)
    {
        return `
    vec4 blur2 = ${k.texture2D()}(u_textures[0], 1.0 - v_coord);
`;
    }

    /**
     * @return {string}
     * @method
     * @static
     */
    static STATEMENT_BLUR_TEXTURE_TRANSFORM_2 (k)
    {
        return `
    vec2 pq = (1.0 - v_coord) * blur_scale - blur_offset;
    vec4 blur2 = mix(vec4(0.0), ${k.texture2D()}(u_textures[0], pq), isInside(pq));
`;
    }

    /**
     * @return {string}
     * @method
     * @static
     */
    static STATEMENT_BEVEL_STRENGTH (offset)
    {
        const index     = Util.$floor(offset / 4);
        const component = offset % 4;
        return `
    float strength = u_mediump[${index}][${component}];
    highlight_alpha *= strength;
    shadow_alpha    *= strength;
`;
    }

    /**
     * @return {string}
     * @method
     * @static
     */
    static STATEMENT_BEVEL_SOLID_COLOR (index)
    {
        return `
    vec4 highlight_color = u_mediump[${index}];
    vec4 shadow_color    = u_mediump[${index + 1}];
    blur = highlight_color * highlight_alpha + shadow_color * shadow_alpha;
`;
    }

    /**
     * @return {string}
     * @method
     * @static
     */
    static STATEMENT_BEVEL_GRADIENT_COLOR ()
    {
        return `
    blur = getGradientColor(
        0.5019607843137255
        - 0.5019607843137255 * shadow_alpha
        + 0.4980392156862745 * highlight_alpha
    );
    blur.rgb *= blur.a;
`;
    }
}

/**
 * @class
 */
class BezierConverter
{
    /**
     * @param  {number} fromX
     * @param  {number} fromY
     * @param  {number} cx1
     * @param  {number} cy1
     * @param  {number} cx2
     * @param  {number} cy2
     * @param  {number} x
     * @param  {number} y
     * @return {array}
     * @method
     * @static
     */
    static cubicToQuad (fromX, fromY, cx1, cy1, cx2, cy2, x, y)
    {
        const array  = Util.$getArray(Util.$getArray(fromX, fromY, cx1, cy1, cx2, cy2, x, y));
        const cubic2 = this.split2Cubic(array);
        const cubic4 = this.split2Cubic(cubic2);
        const result = this.split2Quad(cubic4);

        Util.$poolArray(array[0]);
        Util.$poolArray(array);
        Util.$poolArray(cubic2[0]);
        Util.$poolArray(cubic2[1]);
        Util.$poolArray(cubic2);
        Util.$poolArray(cubic4[0]);
        Util.$poolArray(cubic4[1]);
        Util.$poolArray(cubic4[2]);
        Util.$poolArray(cubic4[3]);
        Util.$poolArray(cubic4);

        return result;
    }

    /**
     * @description 3次ベジェ配列の各要素を、2つの3次ベジェに分割する
     * @param  {array} cubics
     * @return {array}
     * @method
     * @static
     */
    static split2Cubic (cubics)
    {
        const result = Util.$getArray();
        for (let i = 0; i < cubics.length; i++) {
            const b  = cubics[i];
            const mx = (b[0] + 3 * (b[2] + b[4]) + b[6]) * 0.125;
            const my = (b[1] + 3 * (b[3] + b[5]) + b[7]) * 0.125;
            const dx = (b[6] + b[4] - b[2] - b[0]) * 0.125;
            const dy = (b[7] + b[5] - b[3] - b[1]) * 0.125;

            result.push(Util.$getArray(
                b[0], b[1],
                (b[0] + b[2]) * 0.5, (b[1] + b[3]) * 0.5,
                mx - dx, my - dy,
                mx, my
            ));

            result.push(Util.$getArray(
                mx, my,
                mx + dx, my + dy,
                (b[4] + b[6]) * 0.5, (b[5] + b[7]) * 0.5,
                b[6], b[7]
            ));
        }
        return result;
    }

    /**
     * @description 3次ベジェ配列の各要素を、2つの2次ベジェに分割する
     * @param  {array} cubics
     * @return {array}
     * @method
     * @static
     */
    static split2Quad (cubics)
    {
        const result = Util.$getArray();
        for (let i = 0; i < cubics.length; i++) {
            const b  = cubics[i];
            const mx = (b[0] + 3 * (b[2] + b[4]) + b[6]) * 0.125;
            const my = (b[1] + 3 * (b[3] + b[5]) + b[7]) * 0.125;

            result.push(Util.$getArray(
                b[0], b[1],
                b[0] * 0.25 + b[2] * 0.75, b[1] * 0.25 + b[3] * 0.75, 
                mx, my
            ));

            result.push(Util.$getArray(
                mx, my,
                b[4] * 0.75 + b[6] * 0.25, b[5] * 0.75 + b[7] * 0.25,
                b[6], b[7]
            ));
        }
        return result;
    }
}

/**
 * @class
 */
class CanvasGradientToWebGL
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        this._$rgb             = InterpolationMethod.RGB;
        this._$mode            = SpreadMethod.PAD;
        this._$focalPointRatio = 0;
        this._$points          = Util.$getFloat32Array(0,0,0,0,0,0);
        this._$stops           = Util.$getArray();
        this._$type            = null;
    }

    /**
     * @return {CanvasGradientToWebGL}
     * @method
     * @private
     */
    _$initialization ()
    {
        // reset
        this._$type  = null;
        if (this._$stops.length) {
            this._$stops.length = 0;
        }

        const length = arguments.length;
        if (!length) {

            // reset
            this._$rgb             = InterpolationMethod.RGB;
            this._$mode            = SpreadMethod.PAD;
            this._$focalPointRatio = 0;
            this._$points.fill(0);

            return this;
        }


        if (length === 6) {

            this._$type = GradientType.LINEAR;

            if (this._$points && this._$points.length === 4) {

                this._$points[0] = arguments[0];
                this._$points[1] = arguments[1];
                this._$points[2] = arguments[2];
                this._$points[3] = arguments[3];

            } else {

                this._$points = Util.$getFloat32Array(
                    arguments[0], arguments[1], arguments[2], arguments[3]
                );

            }

            this._$rgb  = arguments[4] || InterpolationMethod.RGB;
            this._$mode = arguments[5] || SpreadMethod.PAD;

            return this;
        }

        this._$type = GradientType.RADIAL;
        if (this._$points && this._$points.length === 6) {

            this._$points[0] = arguments[0];
            this._$points[1] = arguments[1];
            this._$points[2] = arguments[2];
            this._$points[3] = arguments[3];
            this._$points[4] = arguments[4];
            this._$points[5] = arguments[5];

        } else {

            this._$points = Util.$getFloat32Array(
                arguments[0], arguments[1], arguments[2],
                arguments[3], arguments[4], arguments[5]
            );

        }

        this._$rgb             = arguments[6] || InterpolationMethod.RGB;
        this._$mode            = arguments[7] || SpreadMethod.PAD;
        this._$focalPointRatio = Util.$clamp(arguments[8], -0.975, 0.975, 0);

        return this;
    }

    /**
     * @param {number} offset
     * @param {array}  color
     * @method
     * @public
     */
    addColorStop (offset, color)
    {
        // add
        this._$stops.push([offset, color]);

        // sort
        this._$stops.sort(function(a, b)
        {
            switch (true) {

                case (a[0] > b[0]):
                    return 1;

                case (b[0] > a[0]):
                    return -1;

                default:
                    return 0;

            }
        });
    }
}
/**
 * @class
 */
class CanvasPatternToWebGL
{
    /**
     * @param {WebGLTexture} [texture=null]
     * @param {string}       [repeat=null]
     * @param {array}        [color_transform=null]
     * @constructor
     * @public
     */
    constructor (texture = null, repeat = null, color_transform = null)
    {
        this._$initialization(texture, repeat, color_transform);
    }

    /**
     * @param  {WebGLTexture} [texture=null]
     * @param  {string}       [repeat=null]
     * @param  {array}        [color_transform=null]
     * @return {CanvasPatternToWebGL}
     * @method
     * @private
     */
    _$initialization (texture = null, repeat = null, color_transform = null)
    {
        this._$texture         = texture;
        this._$repeat          = repeat;
        this._$color_transform = color_transform;
        return this;
    }

    /**
     * @memberof CanvasToWebGLContext#
     * @property {WebGLTexture}
     * @readonly
     * @public
     */
    get texture ()
    {
        return this._$texture;
    }

    /**
     * @memberof CanvasToWebGLContext#
     * @property {string}
     * @readonly
     * @public
     */
    get repeat ()
    {
        return this._$repeat;
    }

    /**
     * @memberof CanvasToWebGLContext#
     * @property {array}
     * @readonly
     * @public
     */
    get colorTransform ()
    {
        return this._$color_transform;
    }

}
/**
 * @class
 */
class CanvasToWebGLContext
{
    /**
     * @param {WebGLRenderingContext} gl
     * @param {boolean}               isWebGL2Context
     * @constructor
     */
    constructor (gl, isWebGL2Context)
    {
        this._$gl = gl;

        const samples = (isWebGL2Context)
            ? Util.$min(Util.$currentPlayer().getSamples(), gl.getParameter(gl.MAX_SAMPLES))
            : 0;

        // setup
        this._$isWebGL2Context = isWebGL2Context;
        this._$maxTextureSize  = Util.$min(8192, gl.getParameter(gl.MAX_TEXTURE_SIZE)) - 2;

        // render params
        this._$contextStyle             = new CanvasToWebGLContextStyle();
        this._$style                    = this._$contextStyle;
        this._$fillBuffer               = null;
        this._$strokeBuffer             = null;
        this._$cacheCurrentBounds       = { "x": 0, "y": 0, "w": 0, "h": 0 };
        this._$cacheCurrentBuffer       = null;
        this._$stack                    = [];
        this._$globalAlpha              = 1;
        this._$imageSmoothingEnabled    = false;
        this._$globalCompositeOperation = BlendMode.NORMAL;
        this._$matrix                   = Util.$getFloat32Array(1, 0, 0, 0, 1, 0, 0, 0, 1);

        this._$clearColor = Util.$getFloat32Array(1, 1, 1, 1);
        this._$viewport   = Util.$getFloat32Array(0, 0);

        this._$frameBufferManager = new FrameBufferManager(gl, isWebGL2Context, samples);
        this._$path = new CanvasToWebGLContextPath();
        this._$grid = new CanvasToWebGLContextGrid();

        // filter params
        this._$offsetX = 0;
        this._$offsetY = 0;

        // layer
        this._$blends    = [];
        this._$positions = [];
        this._$isLayer   = false;

        // shader
        this._$shaderList = new CanvasToWebGLShaderList(this, gl);

        // vertex array object
        this._$vao = new VertexArrayObjectManager(gl, isWebGL2Context);
        // pixel buffer object
        this._$pbo = new PixelBufferObjectManager(gl, isWebGL2Context);

        this._$mask  = new CanvasToWebGLContextMask(this, gl);
        this._$blend = new CanvasToWebGLContextBlend(this, gl);

        // singleton
        this._$canvasPatternToWebGL  = new CanvasPatternToWebGL();
        this._$canvasGradientToWebGL = new CanvasGradientToWebGL();
    }

    /**
     * @memberof CanvasToWebGLContext#
     * @return {HTMLCanvasElement}
     * @public
     */
    get canvas ()
    {
        return this._$gl.canvas;
    }

    /**
     * @memberof CanvasToWebGLContext#
     * @property {array|CanvasGradientToWebGL}
     * @return   {array|CanvasGradientToWebGL}
     * @public
     */
    get fillStyle ()
    {
        return this._$style._$fillStyle;
    }

    /**
     * @memberof CanvasToWebGLContext#
     * @property {array|CanvasGradientToWebGL}
     * @param    {*} fill_style
     * @return   void
     * @public
     */
    set fillStyle (fill_style)
    {
        this._$style._$fillStyle = fill_style;
    }

    /**
     * @memberof CanvasToWebGLContext#
     * @property {array}
     * @return {array|CanvasGradientToWebGL}
     * @public
     */
    get strokeStyle ()
    {
        return this._$style._$strokeStyle;
    }

    /**
     * @memberof CanvasToWebGLContext#
     * @property {array}
     * @param  {*} stroke_style
     * @return {void}
     * @public
     */
    set strokeStyle (stroke_style)
    {
        this._$style._$strokeStyle = stroke_style;
    }

    /**
     * @memberof CanvasToWebGLContext#
     * @property {number}
     * @return {number}
     * @public
     */
    get lineWidth ()
    {
        return this._$style._$lineWidth;
    }

    /**
     * @memberof CanvasToWebGLContext#
     * @property {number}
     * @param {number} line_width
     * @return {void}
     * @public
     */
    set lineWidth (line_width)
    {
        this._$style._$lineWidth = line_width;
    }

    /**
     * @memberof CanvasToWebGLContext#
     * @property {string}
     * @return {string}
     * @public
     */
    get lineCap ()
    {
        return this._$style._$lineCap;
    }

    /**
     * @memberof CanvasToWebGLContext#
     * @property {string}
     * @param {string} line_cap
     * @return {void}
     * @public
     */
    set lineCap (line_cap)
    {
        switch (line_cap) {

            case CapsStyle.NONE:
            case CapsStyle.SQUARE:
                this._$style._$lineCap = line_cap;
                break;

            default:
                this._$style._$lineCap = CapsStyle.ROUND;
                break;

        }
    }

    /**
     * @memberof CanvasToWebGLContext#
     * @property {number}
     * @return {string}
     * @public
     */
    get lineJoin ()
    {
        return this._$style._$lineJoin;
    }

    /**
     * @memberof CanvasToWebGLContext#
     * @property {number}
     * @param {string} line_join
     * @return {void}
     * @public
     */
    set lineJoin (line_join)
    {

        switch (line_join) {

            case JointStyle.BEVEL:
            case JointStyle.MITER:
                this._$style._$lineJoin = line_join;
                break;

            default:
                this._$style._$lineJoin = JointStyle.ROUND;
                break;

        }

    }

    /**
     * @memberof CanvasToWebGLContext#
     * @property {number}
     * @return {number}
     * @public
     */
    get miterLimit ()
    {
        return this._$style._$miterLimit;
    }

    /**
     * @memberof CanvasToWebGLContext#
     * @property {number}
     * @param {number} miter_limit
     * @return {void}
     * @public
     */
    set miterLimit (miter_limit)
    {
        this._$style._$miterLimit = miter_limit;
    }

    /**
     * @memberof CanvasToWebGLContext#
     * @property {number}
     * @return {number}
     * @public
     */
    get globalAlpha ()
    {
        return this._$globalAlpha;
    }

    /**
     * @memberof CanvasToWebGLContext#
     * @property {number}
     * @param {number} global_alpha
     * @return {void}
     * @public
     */
    set globalAlpha (global_alpha)
    {
        this._$globalAlpha = Util.$clamp(global_alpha, 0, 1, 1);
    }

    /**
     * @memberof CanvasToWebGLContext#
     * @property {boolean} [imageSmoothingEnabled=false]
     * @return {boolean}
     * @public
     */
    get imageSmoothingEnabled ()
    {
        return this._$imageSmoothingEnabled;
    }

    /**
     * @memberof CanvasToWebGLContext#
     * @property {boolean} [imageSmoothingEnabled=false]
     * @param {boolean} image_smoothing_enabled
     * @return void
     * @public
     */
    set imageSmoothingEnabled (image_smoothing_enabled)
    {
        this._$imageSmoothingEnabled = Util.$toBoolean(image_smoothing_enabled);
    }

    /**
     * @memberof CanvasToWebGLContext#
     * @property {string} [globalCompositeOperation=BlendMode.NORMAL]
     * @return {string}
     * @public
     */
    get globalCompositeOperation ()
    {
        return this._$globalCompositeOperation;
    }

    /**
     * @memberof CanvasToWebGLContext#
     * @property {string} [globalCompositeOperation=BlendMode.NORMAL]
     * @param {string} global_composite_operation
     * @return {void}
     * @public
     */
    set globalCompositeOperation (global_composite_operation)
    {
        this._$globalCompositeOperation = global_composite_operation;
    }

    /**
     * @memberof CanvasToWebGLContext#
     * @property {FrameBufferManager}
     * @return {FrameBufferManager}
     * @public
     */
    get frameBuffer ()
    {
        return this._$frameBufferManager;
    }

    /**
     * @memberof CanvasToWebGLContext#
     * @property {CanvasToWebGLContextPath}
     * @return {CanvasToWebGLContextPath}
     * @public
     */
    get path ()
    {
        return this._$path;
    }

    /**
     * @memberof CanvasToWebGLContext#
     * @property {CanvasToWebGLContextGrid}
     * @return {CanvasToWebGLContextGrid}
     * @public
     */
    get grid ()
    {
        return this._$grid;
    }

    /**
     * @memberof CanvasToWebGLContext#
     * @property {VertexArrayObjectManager}
     * @return {VertexArrayObjectManager}
     * @public
     */
    get vao ()
    {
        return this._$vao;
    }

    /**
     * @memberof CanvasToWebGLContext#
     * @property {PixelBufferObjectManager}
     * @return {PixelBufferObjectManager}
     * @public
     */
    get pbo ()
    {
        return this._$pbo;
    }

    /**
     * @memberof CanvasToWebGLContext#
     * @property {CanvasToWebGLContextBlend}
     * @return {CanvasToWebGLContextBlend}
     * @public
     */
    get blend ()
    {
        return this._$blend;
    }

    /**
     * @param  {object} attachment
     * @return void
     * @public
     */
    _$bind (attachment)
    {
        if (!attachment) {
            return;
        }

        this._$frameBufferManager.bind(attachment);

        const colorBuffer   = attachment.color;
        const stencilBuffer = attachment.stencil;
        const width         = attachment.width;
        const height        = attachment.height;

        if (this._$viewport[0] !== width || this._$viewport[1] !== height) {
            this._$viewport[0] = width;
            this._$viewport[1] = height;
            this._$gl.viewport(0, 0, width, height);
        }

        // カラーバッファorステンシルバッファが、未初期化の場合はクリアする
        if (colorBuffer.dirty || (stencilBuffer && stencilBuffer.dirty)) {
            colorBuffer.dirty = false;
            if (stencilBuffer) {
                stencilBuffer.dirty = false;
            }

            this._$gl.clearColor(0, 0, 0, 0);
            this.clearRect(0, 0, this._$viewport[0], this._$viewport[1]);
            this._$gl.clearColor(
                this._$clearColor[0],
                this._$clearColor[1],
                this._$clearColor[2],
                this._$clearColor[3]
            );

            this._$mask._$onClear(attachment.mask);
        }

        this._$mask._$onBind(attachment.mask);
    }

    /**
     * @param  {number} x
     * @param  {number} y
     * @param  {number} w
     * @param  {number} h
     * @return void
     * @public
     */
    fillRect (x, y, w, h)
    {
        if (!w || !h) {
            return ;
        }

        // set size
        this._$viewport[0]  = w;
        this._$viewport[1]  = h;

        // create buffer
        let removed = false;
        if (!this._$fillBuffer) {

            removed = true;

            const vertices = this._$path.createRectVertices(x, y, w, h);
            this._$fillBuffer = this._$vao.createFill(vertices);

            // object pool
            Util.$poolArray(vertices.pop());
            Util.$poolArray(vertices);
        }

        const hasGrid = this._$grid.enabled;
        const variants = this._$shaderList.shapeShaderVariants;
        const shader = variants.getSolidColorShapeShader(false, hasGrid);
        const uniform = shader.uniform;
        variants.setSolidColorShapeUniform(
            uniform, false, 0, 0, 0,
            hasGrid, this._$matrix, this._$viewport, this._$grid,
            this.fillStyle, this._$globalAlpha
        );

        shader._$fill(this._$fillBuffer);

        if (removed) {
            this._$vao.release(this._$fillBuffer);
            Util.$poolArray(this._$fillBuffer.indexRanges);
        }

        // reset
        this.beginPath();
    }

    /**
     * @param  {number} a
     * @param  {number} b
     * @param  {number} c
     * @param  {number} d
     * @param  {number} e
     * @param  {number} f
     * @return void
     * @public
     */
    setTransform (a, b, c, d, e, f)
    {
        this._$matrix[0] = a;
        this._$matrix[1] = b;
        this._$matrix[3] = c;
        this._$matrix[4] = d;
        this._$matrix[6] = e;
        this._$matrix[7] = f;
    }

    /**
     * @param  {number} a
     * @param  {number} b
     * @param  {number} c
     * @param  {number} d
     * @param  {number} e
     * @param  {number} f
     * @return void
     * @public
     */
    transform (a, b, c, d, e, f)
    {
        const a00 = this._$matrix[0];
        const a01 = this._$matrix[1];
        const a10 = this._$matrix[3];
        const a11 = this._$matrix[4];
        const a20 = this._$matrix[6];
        const a21 = this._$matrix[7];

        this._$matrix[0] = a * a00 + b * a10;
        this._$matrix[1] = a * a01 + b * a11;
        this._$matrix[3] = c * a00 + d * a10;
        this._$matrix[4] = c * a01 + d * a11;
        this._$matrix[6] = e * a00 + f * a10 + a20;
        this._$matrix[7] = e * a01 + f * a11 + a21;
    }

    /**
     * @param  {WebGLTexture|object} image
     * @param  {number} x
     * @param  {number} y
     * @param  {number} w
     * @param  {number} h
     * @param  {Float64Array} [color_transform=null]
     * @return void
     * @public
     */
    drawImage (image, x, y, w, h, color_transform = null)
    {
        let ct0 = 1, ct1 = 1, ct2 = 1, ct3 = this._$globalAlpha;
        let ct4 = 0, ct5 = 0, ct6 = 0, ct7 = 0;
        if (color_transform) {
            ct0 = color_transform[0];
            ct1 = color_transform[1];
            ct2 = color_transform[2];
            ct4 = color_transform[4] / 255;
            ct5 = color_transform[5] / 255;
            ct6 = color_transform[6] / 255;
        }

        this._$blend.drawImage(
            image, x, y, w, h,
            ct0, ct1, ct2, ct3, ct4, ct5, ct6, ct7,
            this._$globalCompositeOperation,
            this._$viewport[0], this._$viewport[1],
            this._$matrix,
            this._$imageSmoothingEnabled
        );
    }

    /**
     * @param  {number} r
     * @param  {number} g
     * @param  {number} b
     * @param  {number} a
     * @return void
     * @public
     */
    _$setColor (r = 0, g = 0, b = 0, a = 0)
    {
        this._$clearColor = [r, g, b, a];
        this._$gl.clearColor(r, g, b, a);
    }

    /**
     * @param  {number} x
     * @param  {number} y
     * @param  {number} w
     * @param  {number} h
     * @return void
     * @public
     */
    clearRect (x, y, w, h)
    {
        
        this._$mask._$onClearRect();
        this._$gl.enable(this._$gl.SCISSOR_TEST);
        this._$gl.scissor(x, y, w, h);
        this._$gl.clear(this._$gl.COLOR_BUFFER_BIT | this._$gl.STENCIL_BUFFER_BIT);
        this._$gl.disable(this._$gl.SCISSOR_TEST);
    }

    /**
     * @param  {number} x
     * @param  {number} y
     * @param  {number} w
     * @param  {number} h
     * @return void
     * @private
     */
    _$clearRectStencil (x, y, w, h)
    {
        this._$mask._$onClearRect();
        this._$gl.enable(this._$gl.SCISSOR_TEST);
        this._$gl.scissor(x, y, w, h);
        this._$gl.clear(this._$gl.STENCIL_BUFFER_BIT);
        this._$gl.disable(this._$gl.SCISSOR_TEST);
    }

    /**
     * @param  {DisplayObject} display_object
     * @param  {Float64Array} matrix
     * @return {Float64Array}
     * @public
     */
    _$startClip (display_object, matrix)
    {
        return this._$mask._$startClip(display_object, matrix);
    }

    /**
     * @param {number} x
     * @param {number} y
     * @return void
     * @public
     */
    moveTo (x, y)
    {
        this._$path.moveTo(x, y);
    }

    /**
     * @param  {number} x
     * @param  {number} y
     * @return void
     * @public
     */
    lineTo (x, y)
    {
        this._$path.lineTo(x, y);
    }

    /**
     * @return void
     * @public
     */
    beginPath ()
    {
        this._$path.begin();

        if (this._$isGraphics) {

            if (this._$fillBuffer) {

                this.vao.release(this._$fillBuffer);
                this.vao.release(this._$fillBuffer.boundObject);

                Util.$poolArray(this._$fillBuffer.indexRanges);
                Util.$poolArray(this._$fillBuffer.boundObject.indexRanges);
            }

            if (this._$strokeBuffer) {
                this.vao.release(this._$strokeBuffer);
            }

        }

        this._$isGraphics   = false;
        this._$fillBuffer   = null;
        this._$strokeBuffer = null;
    }

    /**
     * @param  {number} cx
     * @param  {number} cy
     * @param  {number} x
     * @param  {number} y
     * @return void
     * @public
     */
    quadraticCurveTo (cx, cy, x ,y)
    {
        this._$path.quadTo(cx, cy, x, y);
    }

    /**
     * @param {number} cp1x
     * @param {number} cp1y
     * @param {number} cp2x
     * @param {number} cp2y
     * @param {number} dx
     * @param {number} dy
     * @return void
     * @public
     */
    bezierCurveTo (cp1x, cp1y, cp2x, cp2y, dx, dy)
    {
        this._$path.cubicTo(cp1x, cp1y, cp2x, cp2y, dx, dy);
    }

    /**
     * @return {array}
     * @public
     */
    _$getVertices ()
    {
        return this._$path.vertices;
    }

    /**
     * @return void
     * @public
     */
    fill ()
    {
        let matrix = this._$matrix;
        switch (true) {
            case this.fillStyle.constructor === CanvasGradientToWebGL:
                switch (this.fillStyle._$type) {
                    case GradientType.LINEAR:
                        break;
                    default:
                        matrix = this._$stack[this._$stack.length - 1];
                        break;
                }
                break;
            case this.fillStyle.constructor === CanvasPatternToWebGL:
                matrix = this._$stack[this._$stack.length - 1];
                break;
        }

        let variants, shader;

        const hasGrid = this._$grid.enabled;

        switch (true) {

            // Gradient
            case this.fillStyle.constructor === CanvasGradientToWebGL:

                const gradient = this.fillStyle;
                const stops = gradient._$stops;
                const stopsLength = Util.$clamp(stops.length, 0, 16);
                const isLinearSpace = (gradient._$rgb === "linearRGB");
               
                variants = this._$shaderList.gradientShaderVariants;
                if (gradient._$type === GradientType.LINEAR) {
                    shader = variants.getGradientShader(
                        false, hasGrid, false, false,
                        gradient._$mode, stopsLength, isLinearSpace
                    );
                    variants.setGradientUniform(
                        shader.uniform, false, 0, 0, 0,
                        hasGrid, matrix, Util.$inverseMatrix(this._$matrix), this._$viewport, this._$grid,
                        false, gradient._$points,
                        false, 0,
                        stops, stopsLength, isLinearSpace
                    );
                } else {
                    const hasFocalPoint = (gradient._$focalPointRatio !== 0);
                    shader = variants.getGradientShader(
                        false, hasGrid, true, hasFocalPoint,
                        gradient._$mode, stopsLength, isLinearSpace
                    );
                    variants.setGradientUniform(
                        shader.uniform, false, 0, 0, 0,
                        hasGrid, matrix, Util.$inverseMatrix(this._$matrix), this._$viewport, this._$grid,
                        true, gradient._$points,
                        hasFocalPoint, gradient._$focalPointRatio,
                        stops, stopsLength, isLinearSpace
                    );
                }

                break;

            case this.fillStyle.constructor === CanvasPatternToWebGL:
 
                const pattern = this.fillStyle;
                const pct = pattern.colorTransform;

                const texture = pattern.texture;
                this._$frameBufferManager._$textureManager.bindAndSmoothing(this._$imageSmoothingEnabled, texture);
               
                variants = this._$shaderList.shapeShaderVariants;
                shader = variants.getBitmapShapeShader(false, (pattern.repeat !== ""), hasGrid);

                if (pct) {
                    variants.setBitmapShapeUniform(
                        shader.uniform, false, 0, 0, 0,
                        hasGrid, matrix, Util.$inverseMatrix(this._$matrix), this._$viewport, this._$grid,
                        texture.width, texture.height,
                        pct[0], pct[1], pct[2], this._$globalAlpha,
                        pct[4] / 255, pct[5] / 255, pct[6] / 255, 0
                    );
                } else {
                    variants.setBitmapShapeUniform(
                        shader.uniform, false, 0, 0, 0,
                        hasGrid, matrix, Util.$inverseMatrix(this._$matrix), this._$viewport, this._$grid,
                        texture.width, texture.height,
                        1, 1, 1, this._$globalAlpha,
                        0, 0, 0, 0
                    );
                }

                break;

            // Shape
            default:

                variants = this._$shaderList.shapeShaderVariants;
                shader = variants.getSolidColorShapeShader(false, this._$grid.enabled);
                variants.setSolidColorShapeUniform(
                    shader.uniform, false, 0, 0, 0,
                    hasGrid, matrix, this._$viewport, this._$grid,
                    this.fillStyle, this._$globalAlpha
                );

                break;

        }

        const coverageVariants = this._$shaderList.shapeShaderVariants;
        const coverageShader = coverageVariants.getMaskShapeShader(false, hasGrid);
        coverageVariants.setMaskShapeUniform(coverageShader.uniform, hasGrid, matrix, this._$viewport, this._$grid);

        // to triangle
        if (!this._$fillBuffer) {

            const fillVertices = this._$getVertices();
            if (!fillVertices.length) {
                return ;
            }

            const checkVertices = Util.$getArray();
            for (let idx = 0; idx < fillVertices.length; ++idx) {

                const vertices = fillVertices[idx];
                if (9 > vertices.length) {
                    continue;
                }

                checkVertices.push(vertices);
            }

            if (!checkVertices.length) {
                return ;
            }

            this._$isGraphics = true;
            this._$fillBuffer = this._$vao.createFill(checkVertices);

            const vertices = this._$path.getBoundsVertices();
            this._$fillBuffer.boundObject = this._$vao.createFill(vertices);

            // object pool
            Util.$poolArray(vertices.pop());
            Util.$poolArray(vertices);

        }

        // mask on
        this._$gl.enable(this._$gl.STENCIL_TEST);
        this._$gl.stencilMask(0xff);

        // shape clip
        this._$gl.enable(this._$gl.SAMPLE_ALPHA_TO_COVERAGE);
        this._$gl.stencilFunc(this._$gl.ALWAYS, 0, 0xff);
        this._$gl.stencilOp(this._$gl.KEEP, this._$gl.INVERT, this._$gl.INVERT);
        this._$gl.colorMask(false, false, false, false);
        coverageShader._$fill(this._$fillBuffer);
        this._$gl.disable(this._$gl.SAMPLE_ALPHA_TO_COVERAGE);

        // draw shape
        this._$gl.stencilFunc(this._$gl.NOTEQUAL, 0, 0xff);
        this._$gl.stencilOp(this._$gl.KEEP, this._$gl.ZERO, this._$gl.ZERO);
        this._$gl.colorMask(true, true, true, true);
        shader._$fill(this._$fillBuffer.boundObject);

        // mask off
        this._$gl.disable(this._$gl.STENCIL_TEST);
    }

    /**
     * @return void
     * @public
     */
    _$enterClip ()
    {
        this._$mask._$enterClip();
    }

    /**
     * @return void
     * @public
     */
    _$beginClipDef ()
    {
        this._$mask._$beginClipDef();
    }

    /**
     * @return void
     * @public
     */
    _$endClipDef ()
    {
        this._$mask._$endClipDef();
    }

    /**
     * @return void
     * @public
     */
    _$leaveClip ()
    {
        this._$mask._$leaveClip();
    }

    /**
     * @return void
     * @public
     */
    _$drawContainerClip ()
    {
        this._$mask._$drawContainerClip();
    };

    /**
     * @param  {uint} level
     * @param  {uint} w
     * @param  {uint} h
     * @return void
     * @private
     */
    _$unionStencilMask (level, w, h)
    {
        this._$mask._$unionStencilMask(level, w, h);
    }

    /**
     * @return void
     * @public
     */
    closePath ()
    {
        this._$path.close();
    }

    /**
     * @return void
     * @public
     */
    stroke ()
    {

        // set
        if (!this._$strokeBuffer) {

            const strokeVertices = this._$getVertices();

            if (!strokeVertices.length) {
                return;
            }

            const checkVertices = Util.$getArray();
            for (let idx = 0; idx < strokeVertices.length; ++idx) {

                const vertices = strokeVertices[idx];
                if (6 > vertices.length) {
                    continue;
                }

                checkVertices.push(vertices);
            }

            if (!checkVertices.length) {
                return ;
            }

            this._$isGraphics = true;

            this._$strokeBuffer = this._$vao.createStroke(
                strokeVertices,
                this.lineCap,
                this.lineJoin
            );
        }

        let matrix = this._$matrix;
        switch (true) {
            case this.strokeStyle.constructor === CanvasGradientToWebGL:
                switch (this.strokeStyle._$type) {
                    case GradientType.LINEAR:
                        break;
                    default:
                        matrix = this._$stack[this._$stack.length - 1];
                        break;
                }
                break;
            case this.strokeStyle.constructor === CanvasPatternToWebGL:
                matrix = this._$stack[this._$stack.length - 1];
                break;
        }

        let face = Util.$sign(matrix[0] * matrix[4]);
        if (face > 0 && matrix[1] !== 0 && matrix[3] !== 0) {
            face = -Util.$sign(matrix[1] * matrix[3]);
        }

        let lineWidth = this.lineWidth * 0.5;
        let scaleMatrix;
        if (this._$grid.enabled) {
            lineWidth *= Util.$getSameScaleBase();
            scaleMatrix = this._$grid._$ancestorMatrix;
        } else {
            scaleMatrix = matrix;
        }
        const scaleX   = Util.$abs(scaleMatrix[0] + scaleMatrix[3]);
        const scaleY   = Util.$abs(scaleMatrix[1] + scaleMatrix[4]);
        const scaleMin = Util.$min(scaleX, scaleY);
        const scaleMax = Util.$max(scaleX, scaleY);
        lineWidth *= scaleMax * (1 - 0.3 * Util.$cos(Util.$PI * 0.5 * (scaleMin / scaleMax)));
        lineWidth = Util.$max(1, lineWidth);

        let variants, shader;
        
        const hasGrid = this._$grid.enabled;

        switch (true) {

            // Gradient
            case this.strokeStyle.constructor === CanvasGradientToWebGL:

                const gradient = this.strokeStyle;
                const stops = gradient._$stops;
                const stopsLength = Util.$clamp(stops.length, 0, 16);
                const isLinearSpace = (gradient._$rgb === "linearRGB");

                variants = this._$shaderList.gradientShaderVariants;
                if (gradient._$type === GradientType.LINEAR) {
                    shader = variants.getGradientShader(
                        true, hasGrid, false, false,
                        gradient._$mode, stopsLength, isLinearSpace
                    );
                    variants.setGradientUniform(
                        shader.uniform, true, lineWidth, face, this.miterLimit,
                        hasGrid, matrix, Util.$inverseMatrix(this._$matrix), this._$viewport, this._$grid,
                        false, gradient._$points,
                        false, 0,
                        stops, stopsLength, isLinearSpace
                    );
                } else {
                    const hasFocalPoint = (gradient._$focalPointRatio !== 0);
                    shader = variants.getGradientShader(
                        true, hasGrid, true, hasFocalPoint,
                        gradient._$mode, stopsLength, isLinearSpace
                    );
                    variants.setGradientUniform(
                        shader.uniform, true, lineWidth, face, this.miterLimit,
                        hasGrid, matrix, Util.$inverseMatrix(this._$matrix), this._$viewport, this._$grid,
                        true, gradient._$points,
                        hasFocalPoint, gradient._$focalPointRatio,
                        stops, stopsLength, isLinearSpace
                    );
                }
                
                break;

            case this.strokeStyle.constructor === CanvasPatternToWebGL:

                const pattern = this.strokeStyle;
                const pct = pattern.colorTransform;

                const texture = pattern.texture;
                this._$frameBufferManager._$textureManager.bind(texture);
                
                variants = this._$shaderList.shapeShaderVariants;
                shader = variants.getBitmapShapeShader(true, (pattern.repeat !== ""), this._$grid.enabled);

                if (pct) {
                    variants.setBitmapShapeUniform(
                        shader.uniform, true, lineWidth, face, this.miterLimit,
                        hasGrid, matrix, Util.$inverseMatrix(this._$matrix), this._$viewport, this._$grid,
                        texture.width, texture.height,
                        pct[0], pct[1], pct[2], this._$globalAlpha,
                        pct[4] / 255, pct[5] / 255, pct[6] / 255, 0
                    );
                } else {
                    variants.setBitmapShapeUniform(
                        shader.uniform, true, lineWidth, face, this.miterLimit,
                        hasGrid, matrix, Util.$inverseMatrix(this._$matrix), this._$viewport, this._$grid,
                        texture.width, texture.height,
                        1, 1, 1, this._$globalAlpha,
                        0, 0, 0, 0
                    );
                }

                break;

            default:

                variants = this._$shaderList.shapeShaderVariants;
                shader = variants.getSolidColorShapeShader(true, this._$grid.enabled);
                variants.setSolidColorShapeUniform(
                    shader.uniform, true, lineWidth, face, this.miterLimit,
                    hasGrid, matrix, this._$viewport, this._$grid,
                    this.strokeStyle, this._$globalAlpha
                );

                break;
        }

        shader._$stroke(this._$strokeBuffer);
    }

    /**
     * @param  {number} x
     * @param  {number} y
     * @param  {number} radius
     * @return void
     * @public
     */
    arc (x, y, radius)
    {
        this._$path.drawCircle(x, y, radius);
    }

    /**
     * @param  {boolean} [removed = false]
     * @return void
     * @public
     */
    clip (removed = false)
    {
        const variants = this._$shaderList.shapeShaderVariants;
        const shader = variants.getMaskShapeShader(false, false);
        const uniform = shader.uniform;
        variants.setMaskShapeUniform(uniform, false, this._$matrix, this._$viewport, null);

        // to triangle
        if (!this._$fillBuffer) {

            this._$fillBuffer = this._$vao.createFill(this._$getVertices());

            const vertices = this._$path.getBoundsVertices();
            this._$fillBuffer.boundObject = this._$vao.createFill(vertices);

            // object pool
            Util.$poolArray(vertices.pop());
            Util.$poolArray(vertices);
        }

        if (this._$mask._$onClip(this._$matrix, this._$viewport)) {
            return;
        }

        // mask render
        shader._$fill(this._$fillBuffer);

        if (removed) {

            // pool
            this._$vao.release(this._$fillBuffer);
            this._$vao.release(this._$fillBuffer.boundObject);

            Util.$poolArray(this._$fillBuffer.indexRanges);
            Util.$poolArray(this._$fillBuffer.boundObject.indexRanges);

            // reset
            this._$fillBuffer = null;
        }

        this.beginPath();
    }

    /**
     * @return void
     * @public
     */
    save ()
    {

        // matrix
        const m = this._$matrix;
        this._$stack[this._$stack.length] = Util.$getFloat32Array(m[0], m[1], m[2], m[3], m[4], m[5], m[6], m[7], m[8]);

        // mask
        this._$mask._$onSave();
    }

    /**
     * @return void
     * @public
     */
    restore ()
    {
        //matrix
        if (this._$stack.length) {
            Util.$poolFloat32Array(this._$matrix);
            this._$matrix = this._$stack.pop();
        }

        // mask
        this._$mask._$onRestore();
    }

    /**
     * @param  {WebGLTexture} texture
     * @param  {string}       repeat
     * @param  {Float32Array} color_transform
     * @return {CanvasPatternToWebGL}
     * @public
     */
    createPattern (texture, repeat, color_transform)
    {
        return this
            ._$canvasPatternToWebGL
            ._$initialization(texture, repeat, color_transform);
    }

    /**
     * @param  {number} x0
     * @param  {number} y0
     * @param  {number} x1
     * @param  {number} y1
     * @param  {string} [rgb=SpreadMethod.RGB]
     * @param  {string} [mode=SpreadMethod.PAD]
     * @return {CanvasGradientToWebGL}
     * @public
     */
    createLinearGradient (x0, y0, x1, y1, rgb, mode)
    {
        return this
            ._$canvasGradientToWebGL
            ._$initialization(x0, y0, x1, y1, rgb, mode);
    }

    /**
     * @param  {number} x0
     * @param  {number} y0
     * @param  {number} r0
     * @param  {number} x1
     * @param  {number} y1
     * @param  {number} r1
     * @param  {string} [rgb=SpreadMethod.RGB]
     * @param  {string} [mode=SpreadMethod.PAD]
     * @param  {number} [focalPointRatio=0]
     * @return {CanvasGradientToWebGL}
     * @public
     */
    createRadialGradient (x0, y0, r0, x1, y1, r1, rgb, mode, focalPointRatio)
    {
        return this
            ._$canvasGradientToWebGL
            ._$initialization(x0, y0, r0, x1, y1, r1, rgb, mode, focalPointRatio);
    }

    /**
     * @param  {WebGLTexture} texture
     * @param  {boolean}      isHorizontal
     * @param  {number}       blur
     * @return {void}
     * @public
     */
    _$applyBlurFilter (texture, isHorizontal, blur)
    {
        const currentBuffer = this._$frameBufferManager.currentAttachment;
        const width  = currentBuffer.width;
        const height = currentBuffer.height;

        this._$frameBufferManager._$textureManager.bindAndSmoothing(true, texture);

        const halfBlur = Util.$ceil(blur * 0.5);
        const fraction = 1 - (halfBlur - blur * 0.5);
        const samples  = 1 + blur;

        const variants = this._$shaderList.filterShaderVariants;
        const shader = variants.getBlurFilterShader(halfBlur);
        variants.setBlurFilterUniform(shader.uniform, width, height, isHorizontal, fraction, samples);
        shader._$drawImage();
    }

    /**
     * @param  {WebGLTexture}       blurTexture
     * @param  {number}             width
     * @param  {number}             height
     * @param  {number}             baseWidth
     * @param  {number}             baseHeight
     * @param  {number}             baseOffsetX
     * @param  {number}             baseOffsetY
     * @param  {number}             blurWidth
     * @param  {number}             blurHeight
     * @param  {number}             blurOffsetX
     * @param  {number}             blurOffsetY
     * @param  {boolean}            isGlow
     * @param  {string}             type
     * @param  {boolean}            knockout
     * @param  {number}             strength
     * @param  {number}             blurX
     * @param  {number}             blurY
     * @param  {array}              ratios
     * @param  {array|Float32Array} colors1
     * @param  {array|Float32Array} colors2
     * @return {void}
     * @public
     */
    _$applyBitmapFilter (
        blurTexture, width, height,
        baseWidth, baseHeight, baseOffsetX, baseOffsetY,
        blurWidth, blurHeight, blurOffsetX, blurOffsetY,
        isGlow, type, knockout,
        strength, blurX, blurY,
        ratios, colors1, colors2
    ) {
        const isInner = (type === BitmapFilterType.INNER);
        
        const baseAttachment = this._$frameBufferManager.currentAttachment;
        const baseTexture = this._$frameBufferManager.getTextureFromCurrentAttachment();

        let targetTextureAttachment;
        if (isInner) {
            this._$frameBufferManager._$textureManager.bind(blurTexture);
        } else {
            targetTextureAttachment = this._$frameBufferManager.createTextureAttachment(width, height);
            this._$bind(targetTextureAttachment);

            this._$frameBufferManager._$textureManager.bind(blurTexture, baseTexture);
        }

        if (blurX < 2 && blurY < 2 && (blurX > 0 || blurY > 0)) {
            // ぼかし幅が2より小さい場合は、強さを調整して見た目を合わせる
            strength *= (Util.$max(1, blurX, blurY) - 1) * 0.4 + 0.2;
        }

        const transformsBase = !(isInner || (type === BitmapFilterType.FULL && knockout));
        const transformsBlur = !(width === blurWidth && height === blurHeight && blurOffsetX === 0 && blurOffsetY === 0);
        const appliesStrength = !(strength === 1);
        const gradientStopsLength = (ratios !== null) ? Util.$clamp(ratios.length, 0, 16) : 0;

        const variants = this._$shaderList.filterShaderVariants;
        const shader = variants.getBitmapFilterShader(
            transformsBase, transformsBlur,
            isGlow, type, knockout,
            appliesStrength, gradientStopsLength
        );
        variants.setBitmapFilterUniform(
            shader.uniform, width, height,
            baseWidth, baseHeight, baseOffsetX, baseOffsetY,
            blurWidth, blurHeight, blurOffsetX, blurOffsetY,
            isGlow, strength, ratios, colors1, colors2,
            transformsBase, transformsBlur, appliesStrength, gradientStopsLength
        );
      
        if (!isInner) {
            this.blend.toOneZero();
        } else if (knockout) {
            this.blend.toSourceIn();
        } else {
            this.blend.toSourceAtop();
        }

        shader._$drawImage();

        if (!isInner) {
            this._$frameBufferManager.releaseAttachment(baseAttachment, true);
        }
    }

    /**
     * @param  {WebGLTexture} texture
     * @param  {array} matrix
     * @return void
     * @public
     */
    _$applyColorMatrixFilter (texture, matrix)
    {
        this._$frameBufferManager._$textureManager.bindAndSmoothing(true, texture);

        const variants = this._$shaderList.filterShaderVariants;
        const shader = variants.getColorMatrixFilterShader();
        variants.setColorMatrixFilterUniform(shader.uniform, matrix);

        this.blend.reset();
        shader._$drawImage();
    }

    /**
     * @param  {WebGLTexture} texture
     * @param  {number}       matrix_x
     * @param  {number}       matrix_y
     * @param  {array}        matrix
     * @param  {number}       divisor
     * @param  {number}       bias
     * @param  {boolean}      preserve_alpha
     * @param  {boolean}      clamp
     * @param  {Float32Array} color
     * @return void
     * @public
     */
    _$applyConvolutionFilter (
        texture, matrix_x, matrix_y, matrix,
        divisor, bias, preserve_alpha, clamp, color
    ) {
        const width  = texture.width;
        const height = texture.height;

        const targetTextureAttachment = this._$frameBufferManager.createTextureAttachment(width, height);
        this._$bind(targetTextureAttachment);

        this._$frameBufferManager._$textureManager.bindAndSmoothing(true, texture);

        const variants = this._$shaderList.filterShaderVariants;
        const shader = variants.getConvolutionFilterShader(matrix_x, matrix_y, preserve_alpha, clamp);
        variants.setConvolutionFilterUniform(shader.uniform, width, height, matrix, divisor, bias, clamp, color);

        this.blend.reset();
        shader._$drawImage();
    }

    /**
     * @param  {WebGLTexture} source
     * @param  {WebGLTexture} map
     * @param  {number}       base_width
     * @param  {number}       base_height
     * @param  {Point}        [point=null]
     * @param  {number}       component_x
     * @param  {number}       component_y
     * @param  {number}       scale_x
     * @param  {number}       scale_y
     * @param  {string}       mode
     * @param  {Float32Array} color
     * @return void
     * @private
     */
    _$applyDisplacementMapFilter (
        source, map, base_width, base_height, point,
        component_x, component_y, scale_x, scale_y, mode, color
    ) {
        const width  = source.width;
        const height = source.height;

        const targetTextureAttachment = this._$frameBufferManager.createTextureAttachment(width, height);
        this._$bind(targetTextureAttachment);

        if (!point) {
            point = { "x": 0, "y": 0 };
        }

        this._$frameBufferManager._$textureManager.bind(source, map);

        const variants = this._$shaderList.filterShaderVariants;
        const shader = variants.getDisplacementMapFilterShader(component_x, component_y, mode);
        variants.setDisplacementMapFilterUniform(
            shader.uniform, map.width, map.height, base_width, base_height,
            point.x, point.y, scale_x, scale_y, mode, color
        );

        this.blend.reset();
        shader._$drawImage();
    }

    /**
     * @param  {number} x
     * @param  {number} y
     * @param  {number} w
     * @param  {number} h
     * @return {Uint8Array}
     * @public
     */
    getImageData (x, y, w, h)
    {
        const length = w * h * 4;
        const data = Util.$getUint8Array(length);

        this._$gl.readPixels(
            x, (h - (h - y)), w, h,
            this._$gl.RGBA, this._$gl.UNSIGNED_BYTE,
            data
        );

        // アルファ値を除算
        for (let idx = 0; idx < length; idx += 4) {

            const a = data[idx + 3];
            if (a) {
                data[idx    ] = Util.$min(data[idx    ] * 255 / a, 255) & 0xff;
                data[idx + 1] = Util.$min(data[idx + 1] * 255 / a, 255) & 0xff;
                data[idx + 2] = Util.$min(data[idx + 2] * 255 / a, 255) & 0xff;
            }

        }

        return data;
    }

    /**
     * @param  {object} position
     * @return void
     */
    _$startLayer (position)
    {
        this._$positions.push(position);
        this._$blends.push(this._$isLayer);
        this._$isLayer = true;
    }

    /**
     * @return void
     */
    _$endLayer ()
    {
        Util.$poolBoundsObject(this._$positions.pop());
        this._$isLayer = Util.$toBoolean(this._$blends.pop());
    }

    /**
     * @return {object}
     * @private
     */
    _$getCurrentPosition ()
    {
        return this._$positions[this._$positions.length - 1];
    }

    /**
     * @description 最大テクスチャサイズを超えないスケール値を取得する
     * @param  {number} width
     * @param  {number} height
     * @return {number}
     */
    _$textureScale (width, height)
    {
        const maxSize = Util.$max(width, height);
        if (maxSize > this._$maxTextureSize) {
            return this._$maxTextureSize / maxSize;
        }
        return 1;
    }

    /**
     * @param  {object} character
     * @return {WebGLTexture}
     * @public
     */
    characterToTexture (character)
    {
        if (!character.state) {

            if (character.jpegData) {
                if (character.image.complete) {
                    character.width = character.image.width;
                    character.height = character.image.height;
                } else {
                    Util.$jpegDecoder.parse(character.jpegData);

                    character.width  = Util.$jpegDecoder.width;
                    character.height = Util.$jpegDecoder.height;
                    character.pixels = Util.$getUint8Array(
                        Util.$jpegDecoder.width * Util.$jpegDecoder.height * 4
                    );

                    Util.$jpegDecoder.copyToImageData(character);
                    character.image = null;
                }
            }

            if (!character.alphaData
                && character.alpha && character.alpha.length
            ) {

                const pixels = new Zlib.Inflate(character.alpha, {
                    "bufferSize": character.width * character.height
                }).decompress();

                Util.$poolUint8Array(character.alpha);
                character.alpha     = null;
                character.alphaData = pixels;

            }

            character.state = 1;
        }


        const manager = this._$frameBufferManager;

        // saved current attachment
        const currentAttachment = manager.currentAttachment;

        const texture = character.image
            ? manager.createTextureFromImage(character.image)
            : manager.createTextureFromPixels(
                character.width, character.height, character.pixels, true);


        if (character.alphaData) {

            const textureAttachment = manager.createTextureAttachmentFrom(texture);
            this._$bind(textureAttachment);

            const alphaTexture = manager
                .createAlphaTextureFromPixels(
                    character.width, character.height, character.alphaData
                );

            const variants = this._$shaderList.bitmapShaderVariants;
            const shader = variants.getBitmapShader();

            // uniform設定不要のため、以下のコードは実行しなくてよい
            // const uniform = shader.uniform;
            // variants.setBitmapUniform(uniform);

            this.blend.toZeroOne();
            shader._$drawImage();

            // pool
            manager.releaseAttachment(textureAttachment, false);
            // this._$gl.deleteTexture(alphaTexture);

        }

        this._$bind(currentAttachment);

        return texture;
    }

    /**
     * @param  {uint} samples
     * @return void
     * @public
     */
    changeSamples (samples = 4)
    {
        if (this._$isWebGL2Context) {

            samples = Util.$min(samples, this._$gl.getParameter(this._$gl.MAX_SAMPLES));

            const manager = this._$frameBufferManager;

            // reset
            manager._$objectPool = [];
            manager._$colorBufferPool._$objectPool   = [];
            manager._$stencilBufferPool._$objectPool = [];

            // edit param
            manager._$colorBufferPool._$samples       = samples;

        }
    }
}

/**
 * @class
 */
class CanvasToWebGLContextBlend
{
    /**
     * @constructor
     */
    constructor (context, gl)
    {
        this._$context  = context;
        this._$gl       = gl;
        this._$enabled  = false;
        this._$funcCode = 600;

        this.enable();
    }

    /**
     * @return void
     * @public
     */
    enable ()
    {
        if (!this._$enabled) {
            this._$enabled = true;
            this._$gl.enable(this._$gl.BLEND);
        }

        this.reset();
    }

    /**
     * @return void
     * @public
     */
    disable ()
    {
        if (this._$enabled) {
            this._$enabled = false;
            this._$gl.disable(this._$gl.BLEND);
        }
    }

    /**
     * @return void
     * @public
     */
    reset ()
    {
        if (this._$funcCode !== 613) {
            this._$funcCode = 613;
            this._$gl.blendFunc(this._$gl.ONE, this._$gl.ONE_MINUS_SRC_ALPHA);
        }
    }

    /**
     * @return void
     * @public
     */
    toOneZero ()
    {
        if (this._$funcCode !== 610) {
            this._$funcCode = 610;
            this._$gl.blendFunc(this._$gl.ONE, this._$gl.ZERO);
        }
    }

    /**
     * @return void
     * @public
     */
    toZeroOne ()
    {
        if (this._$funcCode !== 601) {
            this._$funcCode = 601;
            this._$gl.blendFuncSeparate(
                this._$gl.ZERO, this._$gl.ONE,
                this._$gl.ONE, this._$gl.ZERO
            );
        }
    }

    /**
     * @return void
     * @public
     */
    toAdd ()
    {
        if (this._$funcCode !== 611) {
            this._$funcCode = 611;
            this._$gl.blendFunc(this._$gl.ONE, this._$gl.ONE);
        }
    }

    /**
     * @return void
     * @public
     */
    toScreen ()
    {
        if (this._$funcCode !== 641) {
            this._$funcCode = 641;
            this._$gl.blendFunc(this._$gl.ONE_MINUS_DST_COLOR, this._$gl.ONE);
        }
    }

    /**
     * @return void
     * @public
     */
    toAlpha ()
    {
        if (this._$funcCode !== 606) {
            this._$funcCode = 606;
            this._$gl.blendFunc(this._$gl.ZERO, this._$gl.SRC_ALPHA);
        }
    }

    /**
     * @return void
     * @public
     */
    toErase ()
    {
        if (this._$funcCode !== 603) {
            this._$funcCode = 603;
            this._$gl.blendFunc(this._$gl.ZERO, this._$gl.ONE_MINUS_SRC_ALPHA);
        }
    }

    /**
     * @return void
     * @public
     */
    toSourceAtop ()
    {
        if (this._$funcCode !== 673) {
            this._$funcCode = 673;
            this._$gl.blendFunc(this._$gl.DST_ALPHA, this._$gl.ONE_MINUS_SRC_ALPHA);
        }
    }/**
     * @return void
     * @public
     */
    toSourceIn ()
    {
        if (this._$funcCode !== 670) {
            this._$funcCode = 670;
            this._$gl.blendFunc(this._$gl.DST_ALPHA, this._$gl.ZERO);
        }
    }

    toOperation (operation)
    {
        switch (operation) {
            case BlendMode.ADD:
                this.toAdd();
                break;
            case BlendMode.SCREEN:
                this.toScreen();
                break;
            case BlendMode.ALPHA:
                this.toAlpha();
                break;
            case BlendMode.ERASE:
                this.toErase();
                break;
            case "copy":
                this.toOneZero();
                break;
            default:
                this.reset();
                break;
        }
    }

    /**
     * @return void
     * @public
     */
    drawImage (
        image, x, y, w, h,
        ct0, ct1, ct2, ct3, ct4, ct5, ct6, ct7,
        operation, renderWidth, renderHeight, matrix, imageSmoothingEnabled
    )　{
        const currentBuffer = this._$context._$frameBufferManager.currentAttachment;

        const withCT = (
            ct0 !== 1 || ct1 !== 1 || ct2 !== 1 || ct3 !== 1 ||
            ct4 !== 0 || ct5 !== 0 || ct6 !== 0 || ct7 !== 0
        );

        const variants = this._$context._$shaderList.blendShaderVariants;

        switch (operation) {
            case BlendMode.NORMAL:
            case BlendMode.LAYER:
            case BlendMode.ADD:
            case BlendMode.SCREEN:
            case BlendMode.ALPHA:
            case BlendMode.ERASE:
            case "copy":
                {
                    this._$context._$frameBufferManager._$textureManager.bindAndSmoothing(imageSmoothingEnabled, image);

                    const shader = variants.getNormalBlendShader(withCT);
                    variants.setNormalBlendUniform(
                        shader.uniform, x, y, w, h, matrix, renderWidth, renderHeight,
                        withCT, ct0, ct1, ct2, ct3, ct4, ct5, ct6, ct7
                    );

                    const a  = matrix[0];
                    const b  = matrix[1];
                    const c  = matrix[3];
                    const d  = matrix[4];
                    const tx = matrix[6];
                    const ty = matrix[7];

                    if (a !== 1 || b !== 0 || c !== 0 || d !== 1) {
                        const left   = x;
                        const right  = x + w;
                        const top    = y;
                        const bottom = y + h;

                        const x0 = +(right * a + bottom * c + tx);
                        const x1 = +(right * a + top    * c + tx);
                        const x2 = +(left  * a + bottom * c + tx);
                        const x3 = +(left  * a + top    * c + tx);
                        const y0 = +(right * b + bottom * d + ty);
                        const y1 = +(right * b + top    * d + ty);
                        const y2 = +(left  * b + bottom * d + ty);
                        const y3 = +(left  * b + top    * d + ty);

                        const no = Util.MAX_VALUE;
                        const xMin = +Util.$min(Util.$min(Util.$min(Util.$min( no, x0), x1), x2), x3);
                        const xMax = +Util.$max(Util.$max(Util.$max(Util.$max(-no, x0), x1), x2), x3);
                        const yMin = +Util.$min(Util.$min(Util.$min(Util.$min( no, y0), y1), y2), y3);
                        const yMax = +Util.$max(Util.$max(Util.$max(Util.$max(-no, y0), y1), y2), y3);

                        const sx = Util.$max(0, xMin|0);
                        const sy = Util.$max(0, yMin|0);
                        const sw = Util.$min(Util.$max(0, renderWidth  - sx), Util.$ceil(Util.$abs(xMax - xMin)));
                        const sh = Util.$min(Util.$max(0, renderHeight - sy), Util.$ceil(Util.$abs(yMax - yMin)));

                        if (!sw || !sh) {
                            return ;
                        }

                        this._$gl.enable(this._$gl.SCISSOR_TEST);
                        this._$gl.scissor(sx, Util.$max(0, (renderHeight - (sy + sh))), sw + 1, sh + 1);
                    } else {
                        const sx = Util.$max(0, (x + tx)|0);
                        const sy = Util.$max(0, (y + ty)|0);
                        const sw = Util.$min(Util.$max(0, renderWidth  - sx), w);
                        const sh = Util.$min(Util.$max(0, renderHeight - sy), h);

                        if (!sw || !sh) {
                            return ;
                        }

                        this._$gl.enable(this._$gl.SCISSOR_TEST);
                        this._$gl.scissor(sx, Util.$max(0, (renderHeight - (sy + sh))), sw + 1, sh + 1);
                    }

                    this.toOperation(operation);
                    shader._$drawImage();

                    this._$gl.disable(this._$gl.SCISSOR_TEST);
                }
                break;

            default:
                {
                    const sx = Util.$max(0, (x + matrix[6])|0);
                    const sy = Util.$max(0, (y + matrix[7])|0);
                    const sw = Util.$min(Util.$max(0, renderWidth  - sx), w);
                    const sh = Util.$min(Util.$max(0, renderHeight - sy), h);

                    if (!sw || !sh) {
                        return ;
                    }

                    const texture = this._$context._$frameBufferManager.getTextureFromCurrentAttachment();

                    const backTextureAttachment = this._$context._$frameBufferManager.createTextureAttachment(w, h);
                    this._$context._$bind(backTextureAttachment);
                    this._$context._$frameBufferManager._$textureManager.bindAndSmoothing(false, texture);

                    const clipShader = variants.getClipShader();
                    const clipUniform = clipShader.uniform;
                    variants.setClipUniform(clipUniform, x, y, w, h, Util.$inverseMatrix(matrix), renderWidth, renderHeight);

                    this.reset();
                    clipShader._$drawImage();
                    const backTexture = this._$context._$frameBufferManager.getTextureFromCurrentAttachment();

                    this._$context._$bind(currentBuffer);
                    
                    this._$context._$frameBufferManager._$textureManager.bindAndSmoothing(imageSmoothingEnabled, backTexture, image);

                    const shader = variants.getBlendShader(operation, withCT);
                    variants.setBlendUniform(
                        shader.uniform, x, y, w, h, matrix, renderWidth, renderHeight,
                        withCT, ct0, ct1, ct2, ct3, ct4, ct5, ct6, ct7
                    );

                    this._$gl.enable(this._$gl.SCISSOR_TEST);
                    this._$gl.scissor(sx, Util.$max(0, (renderHeight - (sy + sh))), sw, sh);

                    this.toOneZero();
                    shader._$drawImage();

                    this._$gl.disable(this._$gl.SCISSOR_TEST);

                    this._$context._$frameBufferManager.releaseAttachment(backTextureAttachment, true);

                }
                break;
        }
    }
}

/**
 * @class
 */
class CanvasToWebGLContextGrid
{
    /**
     * @constructor
     */
    constructor ()
    {
        this._$enabled        = false;
        this._$parentMatrix   = Util.$getFloat32Array(1, 0, 0, 0, 1, 0, 0, 0, 1);
        this._$ancestorMatrix = Util.$getFloat32Array(1, 0, 0, 0, 1, 0, 0, 0, 1);
        this._$parentViewport = Util.$getFloat32Array(0, 0, 0, 0);
        this._$gridMin        = Util.$getFloat32Array(0.00001, 0.00001, 0.00001, 0.00001);
        this._$gridMax        = Util.$getFloat32Array(0.99999, 0.99999, 0.99999, 0.99999);
    }

    /**
     * @memberof CanvasToWebGLContextGrid#
     * @property {boolean} enabled
     * @return {boolean}
     * @readonly
     * @public
     */
    get enabled ()
    {
        return this._$enabled;
    }

    /**
     * @param {number} width
     * @param {number} height
     * @param {object} bounds
     * @param {Rectangle} grid
     * @param {number} parentA
     * @param {number} parentB
     * @param {number} parentC
     * @param {number} parentD
     * @param {number} parentE
     * @param {number} parentF
     * @param {number} ancestorA
     * @param {number} ancestorB
     * @param {number} ancestorC
     * @param {number} ancestorD
     * @param {number} ancestorE
     * @param {number} ancestorF
     * @return void
     * @public
     */
    enable (
        x, y, width, height, bounds, grid,
        parentA, parentB, parentC, parentD, parentE, parentF,
        ancestorA, ancestorB, ancestorC, ancestorD, ancestorE, ancestorF
    ) {
        const boundsWidth  = bounds.xMax - bounds.xMin;
        const boundsHeight = bounds.yMax - bounds.yMin;
        const gridWidth  = grid._$width;
        const gridHeight = grid._$height;

        const sameScale  = Util.$getSameScaleBase();
        const sameWidth  = Util.$abs(Util.$ceil(boundsWidth  * sameScale));
        const sameHeight = Util.$abs(Util.$ceil(boundsHeight * sameScale));

        // 等倍サイズでの正規化grid
        const xMinST = (gridWidth  > 0) ? (grid._$x - bounds.xMin) / boundsWidth  : 0.00001;
        const yMinST = (gridHeight > 0) ? (grid._$y - bounds.yMin) / boundsHeight : 0.00001;
        const xMaxST = (gridWidth  > 0) ? ((grid._$x + grid._$width)  - bounds.xMin) / boundsWidth  : 0.99999;
        const yMaxST = (gridHeight > 0) ? ((grid._$y + grid._$height) - bounds.yMin) / boundsHeight : 0.99999;

        // 現在サイズでの正規化grid
        let xMinPQ = (sameWidth  * xMinST) / width;
        let yMinPQ = (sameHeight * yMinST) / height;
        let xMaxPQ = (width  - sameWidth  * (1 - xMaxST)) / width;
        let yMaxPQ = (height - sameHeight * (1 - yMaxST)) / height;

        if (xMinPQ >= xMaxPQ) {
            const m = xMinST / (xMinST + (1 - xMaxST));
            xMinPQ = Util.$max(m - 0.00001, 0);
            xMaxPQ = Util.$min(m + 0.00001, 1);
        }

        if (yMinPQ >= yMaxPQ) {
            const m = yMinST / (yMinST + (1 - yMaxST));
            yMinPQ = Util.$max(m - 0.00001, 0);
            yMaxPQ = Util.$min(m + 0.00001, 1);
        }

        this._$enabled = true;

        this._$parentMatrix[0] = parentA;
        this._$parentMatrix[1] = parentB;
        this._$parentMatrix[3] = parentC;
        this._$parentMatrix[4] = parentD;
        this._$parentMatrix[6] = parentE;
        this._$parentMatrix[7] = parentF;

        this._$ancestorMatrix[0] = ancestorA;
        this._$ancestorMatrix[1] = ancestorB;
        this._$ancestorMatrix[3] = ancestorC;
        this._$ancestorMatrix[4] = ancestorD;
        this._$ancestorMatrix[6] = ancestorE;
        this._$ancestorMatrix[7] = ancestorF;

        this._$parentViewport[0] = x;
        this._$parentViewport[1] = y;
        this._$parentViewport[2] = width;
        this._$parentViewport[3] = height;

        this._$gridMin[0] = xMinST;
        this._$gridMin[1] = yMinST;
        this._$gridMin[2] = xMinPQ;
        this._$gridMin[3] = yMinPQ;

        this._$gridMax[0] = xMaxST;
        this._$gridMax[1] = yMaxST;
        this._$gridMax[2] = xMaxPQ;
        this._$gridMax[3] = yMaxPQ;
    }

    /**
     * @return void
     * @public
     */
    disable ()
    {
        this._$enabled = false;
    }
}

/**
 * @class
 */
class CanvasToWebGLContextMask
{
    /**
     * @constructor
     */
    constructor (context, gl)
    {
        this._$context       = context;
        this._$gl            = gl;

        this._$clips         = [];
        this._$clipStatus    = false;
        this._$containerClip = false;
        this._$poolClip      = [];
        this._$currentClip   = false;
    }

    _$onClear (mask)
    {
        if (mask) {
            this._$gl.enable(this._$gl.STENCIL_TEST);
            this._$currentClip = true;
        }
    }

    _$onBind (mask)
    {
        if (!mask && this._$currentClip) {
            // キャッシュ作成前は、一旦マスクを無効にする
            this._$gl.disable(this._$gl.STENCIL_TEST);
            this._$currentClip = false;
        } else if (mask && !this._$currentClip) {
            // キャッシュ作成後は、マスクの状態を復元する
            this._$gl.enable(this._$gl.STENCIL_TEST);
            this._$currentClip = true;
            this._$endClipDef();
        }
    }

    _$onClearRect ()
    {
        this._$gl.disable(this._$gl.STENCIL_TEST);
        this._$currentClip = false;
    }

    /**
     * @private
     */
    _$endClip ()
    {
        const manager = this._$context._$frameBufferManager;

        const texture = manager.getTextureFromCurrentAttachment();
        const currentBuffer = manager.currentAttachment;

        this._$context._$bind(this._$context._$cacheCurrentBuffer);
        this._$context._$cacheCurrentBuffer = null;

        // blend off
        this._$context._$blend.disable();

        const x = this._$context._$cacheCurrentBounds.x;
        const y = this._$context._$cacheCurrentBounds.y;
        const w = this._$context._$cacheCurrentBounds.w;
        const h = this._$context._$cacheCurrentBounds.h;


        Util.$resetContext(this._$context);
        this._$context.setTransform(1, 0, 0, 1, 0, 0);
        this._$context.drawImage(texture, x, y, w, h);

        // blend restart
        this._$context._$blend.enable();

        manager.releaseAttachment(currentBuffer, true);
    }

    /**
     * @param  {DisplayObject} display_object
     * @param  {Float64Array} matrix
     * @return {Float64Array}
     * @public
     */
    _$startClip (display_object, matrix)
    {

        const tMatrix = Util.$multiplicationMatrix(
            matrix,
            display_object._$transform._$rawMatrix()
        );


        const baseBounds = display_object._$getBounds(null);
        const bounds = Util.$boundsMatrix(baseBounds, tMatrix);
        Util.$poolMatrixArray(tMatrix);
        Util.$poolBoundsObject(baseBounds);

        // size
        let x      = bounds.xMin;
        let y      = bounds.yMin;
        let width  = Util.$abs(bounds.xMax - bounds.xMin);
        let height = Util.$abs(bounds.yMax - bounds.yMin);
        Util.$poolBoundsObject(bounds);

        // resize
        const manager = this._$context._$frameBufferManager;
        const currentBuffer = manager.currentAttachment;
        if ((width + x) > currentBuffer.texture.width) {
            width -= width - currentBuffer.texture.width + x;
        }

        if ((height + y) > currentBuffer.texture.height) {
            height -= height - currentBuffer.texture.height + y;
        }

        if (0 > x) {
            width += x;
            x = 0;
        }

        if (0 > y) {
            height += y;
            y = 0;
        }

        if (0 >= width || 0 >= height) {
            return null;
        }

        width  = Util.$ceil(width);
        height = Util.$ceil(height);

        // set bounds
        this._$context._$cacheCurrentBounds.x = x;
        this._$context._$cacheCurrentBounds.y = y;
        this._$context._$cacheCurrentBounds.w = width;
        this._$context._$cacheCurrentBounds.h = height;


        // cache
        const texture = manager.getTextureFromCurrentAttachment();

        this._$context._$cacheCurrentBuffer = currentBuffer;

        const player = Util.$currentPlayer();

        const samples = (this._$context._$isWebGL2Context
            && (player._$quality === StageQuality.LOW || player._$quality === StageQuality.MIDDLE))
            ? Util.$min(Util.$HIGH_SAMPLES, this._$gl.getParameter(this._$gl.MAX_SAMPLES))
            : 0;

        // create new buffer
        const buffer = manager
            .createCacheAttachment(width, height, true, samples);
        this._$context._$bind(buffer);

        // draw background
        Util.$resetContext(this._$context);
        this._$context.setTransform(1, 0, 0, 1, 0, 0);
        this._$context.drawImage(texture, -x, -y, texture.width, texture.height);


        return Util.$getMatrixArray(
            matrix[0], matrix[1], matrix[2], matrix[3],
            matrix[4] - x,
            matrix[5] - y
        );
    }

    /**
     * @return void
     * @public
     */
    _$enterClip ()
    {
        if (!this._$currentClip) {
            this._$gl.enable(this._$gl.STENCIL_TEST);
            this._$currentClip = true;
        }

        // buffer mask on
        const currentBuffer = this._$context._$frameBufferManager.currentAttachment;
        currentBuffer.mask  = true;
        ++currentBuffer.clipLevel;
    }

    /**
     * @return void
     * @public
     */
    _$beginClipDef ()
    {
        const currentBuffer = this._$context._$frameBufferManager.currentAttachment;

        this._$gl.enable(this._$gl.SAMPLE_ALPHA_TO_COVERAGE);
        this._$gl.stencilFunc(this._$gl.ALWAYS, 0, 0xff);
        this._$gl.stencilOp(this._$gl.KEEP, this._$gl.INVERT, this._$gl.INVERT);
        this._$gl.stencilMask(1 << (currentBuffer.clipLevel - 1));
        this._$gl.colorMask(false, false, false, false);
    }

    /**
     * @return void
     * @public
     */
    _$endClipDef ()
    {
        const currentBuffer = this._$context._$frameBufferManager.currentAttachment;
        const clipLevel = currentBuffer.clipLevel;

        let mask = 0;
        for (let idx = 0; idx < clipLevel; ++idx) {
            mask |= ((1 << (clipLevel - idx)) - 1);
        }

        this._$gl.disable(this._$gl.SAMPLE_ALPHA_TO_COVERAGE);
        this._$gl.stencilFunc(this._$gl.EQUAL, mask & 0xff, mask);
        this._$gl.stencilOp(this._$gl.KEEP, this._$gl.KEEP, this._$gl.KEEP);
        this._$gl.stencilMask(0xff);
        this._$gl.colorMask(true, true, true, true);
    }

    /**
     * @return void
     * @public
     */
    _$leaveClip ()
    {
        const currentBuffer = this._$context._$frameBufferManager.currentAttachment;
        --currentBuffer.clipLevel;
        currentBuffer.mask = Util.$toBoolean(currentBuffer.clipLevel);

        // end clip
        if (!currentBuffer.clipLevel) {
            this._$context._$clearRectStencil(0, 0, currentBuffer.width, currentBuffer.height);
            if (this._$context._$cacheCurrentBuffer) {
                this._$endClip();
            }
            return;
        }


        // replace
        const w = currentBuffer.width;
        const h = currentBuffer.height;

        // create buffer
        const vertices = this._$context._$path.createRectVertices(0, 0, w, h);
        const object = this._$context._$vao.createFill(vertices);
        Util.$poolArray(vertices.pop());
        Util.$poolArray(vertices);

        const variants = this._$context._$shaderList.shapeShaderVariants;
        const shader = variants.getMaskShapeShader(false, false);
        const uniform = shader.uniform;
        variants.setMaskShapeUniformIdentity(uniform, w, h);

        const range = object.indexRanges[0];

        // deny
        if (!this._$currentClip) {
            this._$currentClip = true;
            this._$gl.enable(this._$gl.STENCIL_TEST);
        }

        this._$gl.enable(this._$gl.SAMPLE_ALPHA_TO_COVERAGE);
        this._$gl.stencilFunc(this._$gl.ALWAYS, 0, 0xff);
        this._$gl.stencilOp(this._$gl.REPLACE, this._$gl.REPLACE, this._$gl.REPLACE);
        this._$gl.stencilMask(1 << currentBuffer.clipLevel);
        this._$gl.colorMask(false, false, false, false);

        shader._$containerClip(object, range.first, range.count);

        // object pool
        this._$context._$vao.release(object);
        Util.$poolArray(object.indexRanges);

        this._$context._$endClipDef();
    }

    /**
     * @return void
     * @public
     */
    _$drawContainerClip ()
    {
        const currentBuffer = this._$context._$frameBufferManager.currentAttachment;
        const currentClipLevel = currentBuffer.clipLevel;

        const length = this._$poolClip.length;
        const variants = this._$context._$shaderList.shapeShaderVariants;
        const shader = variants.getMaskShapeShader(false, false);
        const uniform = shader.uniform;

        let useLevel = currentClipLevel;

        // create buffer
        const w = currentBuffer.width;
        const h = currentBuffer.height;

        this._$gl.enable(this._$gl.SAMPLE_ALPHA_TO_COVERAGE);
        this._$gl.stencilFunc(this._$gl.ALWAYS, 0, 0xff);
        this._$gl.stencilOp(this._$gl.KEEP, this._$gl.INVERT, this._$gl.INVERT);
        this._$gl.colorMask(false, false, false, false);
        for (let idx = 0; idx < length; ++idx) {

            const object = this._$poolClip.shift(); // fixed

            variants.setMaskShapeUniform(uniform, false, object.matrix, object.viewport, null);

            const oLen = object.fillBuffer.indexRanges.length;
            for (let idx = 0; idx < oLen; ++idx) {

                const range = object.fillBuffer.indexRanges[idx];

                this._$gl.stencilMask(1 << (useLevel - 1));
                shader._$containerClip(object.fillBuffer, range.first, range.count);

            }

            ++useLevel;

            // union
            if (useLevel > 7) {

                // union
                this._$context._$unionStencilMask(currentClipLevel, w, h);

                // reset
                useLevel = currentClipLevel;

            }

        }

        // last union
        if (useLevel > (currentClipLevel + 1)) {
            this._$context._$unionStencilMask(currentClipLevel, w, h);
        }
    };

    /**
     * @param  {uint} level
     * @param  {uint} w
     * @param  {uint} h
     * @return void
     * @private
     */
    _$unionStencilMask (level, w, h)
    {
        // create buffer
        const vertices = this._$context._$path.createRectVertices(0, 0, w, h);
        const object = this._$context._$vao.createFill(vertices);
        Util.$poolArray(vertices.pop());
        Util.$poolArray(vertices);

        const variants = this._$context._$shaderList.shapeShaderVariants;
        const shader = variants.getMaskShapeShader(false, false);
        const uniform = shader.uniform;
        variants.setMaskShapeUniformIdentity(uniform, w, h);

        const range = object.indexRanges[0];


        // 例として level=4 の場合
        //
        // ステンシルバッファの4ビット目以上を4ビット目に統合する。
        //   |?|?|?|?|?|*|*|*|  ->  | | | | |?|*|*|*|
        //
        // このとき、4ビット目以上に1のビットが1つでもあれば4ビット目を1、
        // そうでなければ4ビット目を0とする。
        //
        //   00000***  ->  00000***
        //   00001***  ->  00001***
        //   00010***  ->  00001***
        //   00011***  ->  00001***
        //   00100***  ->  00001***
        //    ...
        //   11101***  ->  00001***
        //   11110***  ->  00001***
        //   11111***  ->  00001***
        //
        // したがってステンシルの現在の値を 00001000 と比較すればよい。
        // 比較して 00001000 以上であれば 00001*** で更新し、そうでなければ 00000*** で更新する。
        // 下位3ビットは元の値を保持する必要があるので 11111000 でマスクする。

        this._$gl.stencilFunc(this._$gl.LEQUAL, 1 << (level - 1), 0xff);
        this._$gl.stencilOp(this._$gl.ZERO, this._$gl.REPLACE, this._$gl.REPLACE);
        this._$gl.stencilMask(~((1 << (level - 1)) - 1));

        shader._$containerClip(object, range.first, range.count);

        // reset
        if (this._$poolClip.length) {
            this._$gl.stencilFunc(this._$gl.ALWAYS, 0, 0xff);
            this._$gl.stencilOp(this._$gl.KEEP, this._$gl.INVERT, this._$gl.INVERT);
        }

        // object pool
        this._$context._$vao.release(object);
        Util.$poolArray(object.indexRanges);

    }

    /**
     * @return {boolean}
     */
    _$onClip (matrix, viewport)
    {
        this._$clipStatus = true;

        if (this._$containerClip) {

            this._$poolClip[this._$poolClip.length] = {
                "fillBuffer": this._$context._$fillBuffer,
                "matrix":     [matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5], matrix[6], matrix[7], matrix[8]],
                "viewport":   [viewport[0], viewport[1]]
            };

            return true;
        }

        return false;
    }

    /**
     * @return void
     * @public
     */
    _$onSave ()
    {
        this._$clips[this._$clips.length] = this._$clipStatus;
    }

    /**
     * @return void
     * @public
     */
    _$onRestore ()
    {
        if (this._$clips.length) {
            this._$clipStatus = Util.$toBoolean(this._$clips.pop());
        }
    }
}

/**
 * @class
 */
class CanvasToWebGLContextPath
{
    /**
     * @constructor
     */
    constructor ()
    {
        this._$currentPath = [];
        this._$vertices    = [];
        this._$bounds      = { "xMin": 0, "xMax": 0, "yMin": 0, "yMax": 0 };

        this._$resetBounds();
    }

    /**
     * @memberof CanvasToWebGLContextPath#
     * @property {array}
     * @return {array}
     * @public
     */
    get vertices ()
    {
        this._$pushCurrentPathToVertices();
        return this._$vertices;
    }

    /**
     * @return void
     * @public
     */
    begin ()
    {
        this._$currentPath.length = 0;

        while (this._$vertices.length) {
            Util.$poolArray(this._$vertices.pop());
        }

        this._$resetBounds();
    }

    /**
     * @param {number} x
     * @param {number} y
     * @return void
     * @public
     */
    moveTo (x, y)
    {
        if (!this._$currentPath.length) {
            this._$pushPointToCurrentPath(x, y, false);
            return;
        }

        if (this._$equalsToLastPoint(x, y)) {
            return;
        }

        this._$pushCurrentPathToVertices();
        this._$pushPointToCurrentPath(x, y, false);
    }

    /**
     * @param  {number} x
     * @param  {number} y
     * @return void
     * @public
     */
    lineTo (x, y)
    {
        if (!this._$currentPath.length) {
            this.moveTo(0, 0);
        }

        if (this._$equalsToLastPoint(x, y)) {
            return;
        }

        this._$pushPointToCurrentPath(x, y, false);
    }

    /**
     * @param  {number} cx
     * @param  {number} cy
     * @param  {number} x
     * @param  {number} y
     * @return void
     * @public
     */
    quadTo (cx, cy, x, y)
    {
        if (!this._$currentPath.length) {
            this.moveTo(0, 0);
        }

        if (this._$equalsToLastPoint(x, y)) {
            return;
        }

        this._$pushPointToCurrentPath(cx, cy, true);
        this._$pushPointToCurrentPath(x, y, false);
    }

    /**
     * @param {number} cx1
     * @param {number} cy1
     * @param {number} cx2
     * @param {number} cy2
     * @param {number} x
     * @param {number} y
     * @return void
     * @public
     */
    cubicTo (cx1, cy1, cx2, cy2, x, y)
    {
        if (!this._$currentPath.length) {
            this.moveTo(0, 0);
        }

        if (this._$equalsToLastPoint(x, y)) {
            return;
        }

        const fromX = this._$currentPath[this._$currentPath.length - 3];
        const fromY = this._$currentPath[this._$currentPath.length - 2];
        const quads = BezierConverter.cubicToQuad(fromX, fromY, cx1, cy1, cx2, cy2, x, y);
        for (let i = 0; i < quads.length; i++) {
            const quad = quads[i];
            this.quadTo(quad[2], quad[3], quad[4], quad[5]);
        }
    }

    /**
     * @param {number} x
     * @param {number} y
     * @param {number} radius
     * @return void
     * @public
     */
    drawCircle (x, y, radius)
    {
        const r = radius;
        const k = radius * 0.5522847498307936;
        this.cubicTo(x + r, y + k, x + k, y + r, x, y + r);
        this.cubicTo(x - k, y + r, x - r, y + k, x - r, y);
        this.cubicTo(x - r, y - k, x - k, y - r, x, y - r);
        this.cubicTo(x + k, y - r, x + r, y - k, x + r, y);
    }

    /**
     * @return void
     * @public
     */
    close ()
    {
        if (this._$currentPath.length <= 6) {
            return;
        }

        const x = this._$currentPath[0];
        const y = this._$currentPath[1];

        if (this._$equalsToLastPoint(x, y)) {
            return;
        }

        this._$pushPointToCurrentPath(x, y, false);
    }

    /**
     * @param  {number} x
     * @param  {number} y
     * @return {boolean}
     * @private
     */
    _$equalsToLastPoint (x, y)
    {
        const lastX = this._$currentPath[this._$currentPath.length - 3];
        const lastY = this._$currentPath[this._$currentPath.length - 2];
        return (x === lastX && y === lastY);
    }

    /**
     * @param {number} x
     * @param {number} y
     * @param {boolean} isControlPoint
     * @return void
     * @private
     */
    _$pushPointToCurrentPath (x, y, isControlPoint)
    {
        this._$currentPath.push(x);
        this._$currentPath.push(y);
        this._$currentPath.push(isControlPoint);

        this._$bounds.xMin = Util.$min(x, this._$bounds.xMin);
        this._$bounds.xMax = Util.$max(x, this._$bounds.xMax);
        this._$bounds.yMin = Util.$min(y, this._$bounds.yMin);
        this._$bounds.yMax = Util.$max(y, this._$bounds.yMax);
    }

    /**
     * @return void
     * @private
     */
    _$pushCurrentPathToVertices ()
    {
        if (this._$currentPath.length <= 3) {
            this._$currentPath.length = 0;
            return;
        }

        this._$vertices.push(this._$currentPath);
        this._$currentPath = Util.$getArray();
    }

    /**
     * @return void
     * @private
     */
    _$resetBounds ()
    {
        const v = Util.$MAX_VALUE;
        this._$bounds.xMin =  v;
        this._$bounds.xMax = -v;
        this._$bounds.yMin =  v;
        this._$bounds.yMax = -v;
    }

    /**
     * @return {array}
     * @public
     */
    getBoundsVertices ()
    {
        return Util.$getArray(Util.$getArray(
            this._$bounds.xMin, this._$bounds.yMin, false,
            this._$bounds.xMax, this._$bounds.yMin, false,
            this._$bounds.xMax, this._$bounds.yMax, false,
            this._$bounds.xMin, this._$bounds.yMax, false
        ));
    }

    /**
     * @param  {number} x
     * @param  {number} y
     * @param  {number} w
     * @param  {number} h
     * @return {array}
     * @public
     */
    createRectVertices (x, y, w, h)
    {
        return Util.$getArray(Util.$getArray(
            x,     y,     false,
            x + w, y,     false,
            x + w, y + h, false,
            x,     y + h, false
        ));
    }
}

/**
 * @class
 */
class CanvasToWebGLContextStyle
{
    /**
     * @constructor
     */
    constructor ()
    {
        this._$fillStyle   = Util.$getFloat32Array(1, 1, 1, 1);
        this._$strokeStyle = Util.$getFloat32Array(1, 1, 1, 1);
        this._$lineWidth   = 1;
        this._$lineCap     = 0;
        this._$lineJoin    = 0;
        this._$miterLimit  = 5;
    }
}

/**
 * @class
 */
class ColorBufferPool
{
    /**
     * @param {WebGLRenderingContext} gl
     * @param {number}                samples
     * @constructor
     */
    constructor (gl, samples)
    {
        this._$gl         = gl;
        this._$samples    = samples;
        this._$objectPool = [];
    }

    /**
     * @return {WebGLRenderbuffer}
     * @private
     */
    _$createColorBuffer ()
    {
        const colorBuffer   = this._$gl.createRenderbuffer();
        colorBuffer.stencil = this._$gl.createRenderbuffer();
        colorBuffer.width   = 0;
        colorBuffer.height  = 0;
        colorBuffer.area    = 0;
        colorBuffer.dirty   = true;
        return colorBuffer;
    }

    /**
     * @param  {number} area
     * @return {WebGLRenderbuffer}
     * @private
     */
    _$getColorBuffer (area)
    {
        if (!this._$objectPool.length) {
            return this._$createColorBuffer();
        }

        const index = this._$bsearch(area);
        if (index < this._$objectPool.length) {
            const colorBuffer = this._$objectPool[index];
            this._$objectPool.splice(index, 1);
            return colorBuffer;
        }

        return this._$objectPool.shift();
    }

    /**
     * @param  {number} width
     * @param  {number} height
     * @param  {uint}   [samples=0]
     * @return {WebGLRenderbuffer}
     * @public
     */
    create (width, height, samples = 0)
    {
        // 128以下で描画崩れが発生する場合がある？ため、256を最小サイズにする
        width  = Util.$max(256, Util.$upperPowerOfTwo(width));
        height = Util.$max(256, Util.$upperPowerOfTwo(height));

        const colorBuffer = this._$getColorBuffer(width * height);

        if (colorBuffer.width < width
            || colorBuffer.height < height
            || (samples && colorBuffer.samples !== samples)
        ) {
            width  = Util.$max(width,  colorBuffer.width);
            height = Util.$max(height, colorBuffer.height);

            colorBuffer.samples = samples || this._$samples;
            colorBuffer.width   = width;
            colorBuffer.height  = height;
            colorBuffer.area    = width * height;
            colorBuffer.dirty   = false;

            this._$gl.bindRenderbuffer(this._$gl.RENDERBUFFER, colorBuffer);
            this._$gl.renderbufferStorageMultisample(
                this._$gl.RENDERBUFFER,
                samples || this._$samples,
                this._$gl.RGBA8,
                width, height
            );

            this._$gl.bindRenderbuffer(this._$gl.RENDERBUFFER, colorBuffer.stencil);
            this._$gl.renderbufferStorageMultisample(
                this._$gl.RENDERBUFFER,
                samples || this._$samples,
                this._$gl.STENCIL_INDEX8,
                width, height
            );
        }

        return colorBuffer;
    }

    /**
     * @param  {WebGLRenderbuffer} colorBuffer
     * @return void
     * @public
     */
    release (colorBuffer)
    {
        colorBuffer.dirty = true;

        const index = this._$bsearch(colorBuffer.area);
        this._$objectPool.splice(index, 0, colorBuffer);
    }

    /**
     * @description 「めぐる式二分探索法」で面積が引数以上の要素のインデックスを求める
     * @param  {number} area
     * @return {number}
     * @private
     */
    _$bsearch (area)
    {
        let ng = -1;
        let ok = this._$objectPool.length;

        while (Util.$abs(ok - ng) > 1) {
            const mid = Util.$floor((ok + ng) / 2);
            if (area <= this._$objectPool[mid].area) {
                ok = mid;
            } else {
                ng = mid;
            }
        }

        return ok;
    }
}

/**
 * @class
 */
class ConvexHull
{
    /**
     * @param  {array} vertices
     * @return {array}
     */
    static compute (vertices)
    {
        // 頂点数が3以下ならそのまま返す
        if (vertices.length <= 9) {
            return vertices;
        }

        const points = Util.$getArray();
        const verticesLength = vertices.length;
        for (let i = 0; i < verticesLength; i += 3) {
            points.push({
                "x": vertices[i],
                "y": vertices[i + 1]
            });
        }

        // const hulls = this.giftWrapping(points);
        // const hulls = this.monotoneChain(points);
        const hulls = this.chansAlgorithm(points);

        const result = Util.$getArray();
        const hullsLength = hulls.length;
        for (let i = 0; i < hullsLength; i++) {
            const hull = hulls[i];
            result.push(hull.x, hull.y, false);
        }

        Util.$poolArray(points);
        Util.$poolArray(hulls);

        return result;
    }

    /**
     * @description 「Chan's Algorithm」で、点列から凸包を求める
     * @param  {array} points
     * @return {array}
     * @private
     */
    static chansAlgorithm (points)
    {
        const result = Util.$getArray();

        for (let t = 2; ; t++) {
            result.length = 0;
            const m = Util.$pow(2, Util.$pow(2, t));

            // 点集合を要素数mの部分集合に分割し、部分凸包を求める
            const subsets  = this.getSubsets(points, m);
            const subhulls = this.getSubhulls(subsets);
            const subhullsLength = subhulls.length;

            // x座標が最も小さい点を、初期の基準点にする
            const extremeHullIndex  = this.extremePointOfSubhulls(subhulls);
            const extremePointIndex = 0;

            let currentHullIndex  = extremeHullIndex;
            let currentPointIndex = extremePointIndex;
            let currentPoint      = subhulls[currentHullIndex][currentPointIndex];
            let isComplete        = false;
            while (true) {
                // 基準点を、凸包に追加する
                result.push(currentPoint);

                // もし凸包サイズがmに達したら、tを更新して再計算する
                if (result.length >= m) {
                    break;
                }

                // 次の基準点候補の初期値は、基準点以外の点にする
                let nextHullIndex;
                let nextPointIndex;
                if (subhulls[currentHullIndex].length > 2) {
                    nextHullIndex  = currentHullIndex;
                    nextPointIndex = (currentPointIndex + 1) % subhulls[currentHullIndex].length;
                } else {
                    nextHullIndex  = (currentHullIndex + 1) % subhulls.length;
                    nextPointIndex = 0;
                }
                let nextPoint = subhulls[nextHullIndex][nextPointIndex];

                // 基準点から最も時計回り側にある点を、次の基準点にする
                for (let i = 0; i < subhullsLength; i++) {
                    // const pointIndex = this.linearSearch(subhulls[i], currentPoint);
                    const pointIndex = this.binarySearch(subhulls[i], currentPoint);
                    const point = subhulls[i][pointIndex];

                    if (this.orientation(nextPoint, point, currentPoint) > 0) {
                        nextHullIndex  = i;
                        nextPointIndex = pointIndex;
                        nextPoint      = point;
                    }
                }

                currentHullIndex  = nextHullIndex;
                currentPointIndex = nextPointIndex;
                currentPoint      = subhulls[currentHullIndex][currentPointIndex];

                // 基準点とx座標が最も小さい点が一致しているなら、凸包が完成している
                if (currentHullIndex === extremeHullIndex && currentPointIndex === extremePointIndex) {
                    isComplete = true;
                    break;
                }
            }

            Util.$poolArray(subsets);
            Util.$poolArray(subhulls);

            if (isComplete) {
                return result;
            }
        }
    }

    /**
     * @description 点集合を、要素数mの部分集合に分割する
     * @param  {array}  points
     * @param  {number} m
     * @return {array}
     * @private
     */
    static getSubsets (points, m)
    {
        const result = Util.$getArray();
        const length = points.length;
        for (let i = 0; i < length; i += m) {
            result.push(points.slice(i, Util.$min(i + m, length)));
        }
        return result;
    }

    /**
     * @description 部分集合から、部分凸包を求める
     * @param  {array} subsets
     * @return {array}
     * @private
     */
    static getSubhulls (subsets)
    {
        const result = Util.$getArray();
        const length = subsets.length;
        for (let i = 0; i < length; i++) {
            result.push(this.monotoneChain(subsets[i]));
        }
        return result;
    }

    /**
     * @description 「MonotoneChain」で、点集合から凸包を求める
     * @param  {array} points
     * @return {array}
     * @private
     */
    static monotoneChain (points)
    {
        // 点集合のソートが不要なら、そのまま返す
        if (points.length < 2) {
            return points;
        }

        // 点集合をx座標が小さい順にソートする
        points.sort(function(a, b) { return a.x - b.x || a.y - b.y; });
        const length = points.length;

        // 下包を求める
        const lower = Util.$getArray();
        for (let i = 0; i < length; i++) {
            const point = points[i];
            while (lower.length >= 2) {
                if (this.orientation(lower[lower.length - 1], point, lower[lower.length - 2]) < 0) {
                    break;
                }
                lower.pop();
            }

            // 座標がほぼ同じ点は含めない
            if (lower.length > 0) {
                const top = lower[lower.length - 1];
                const abs1 = Util.$abs(point.x - top.x);
                const abs2 = Util.$abs(point.y - top.y);
                if (abs1 < 0.001 && abs2 < 0.001) {
                    lower.pop();
                }
            }

            lower.push(point);
        }

        // 上包を求める
        const upper = Util.$getArray();
        for (let i = length - 1; i >= 0; i--) {
            const point = points[i];
            while (upper.length >= 2) {
                if (this.orientation(upper[upper.length - 1], point, upper[upper.length - 2]) < 0) {
                    break;
                }
                upper.pop();
            }

            // 座標がほぼ同じ点は含めない
            if (upper.length > 0) {
                const top = upper[upper.length - 1];
                const abs1 = Util.$abs(point.x - top.x);
                const abs2 = Util.$abs(point.y - top.y);
                if (abs1 < 0.001 && abs2 < 0.001) {
                    upper.pop();
                }
            }

            upper.push(point);
        }

        // 重複する点は削除する
        lower.pop();
        upper.pop();

        // 下包と上包をマージする
        const result = lower.concat(upper);

        Util.$poolArray(lower);
        Util.$poolArray(upper);

        return result;
    }

    /**
     * @param  {object} p1
     * @param  {object} p2
     * @param  {object} origin
     * @return {number}
     * @private
     */
    static orientation (p1, p2, origin)
    {
        // p1よりp2が時計回り側にあるなら正の値を返す
        return Util.$cross(p1.x - origin.x, p1.y - origin.y, p2.x - origin.x, p2.y - origin.y);
    }

    /**
     * @description 部分凸包の中で、x座標が最も小さい点を含む凸包のインデックスを返す
     * @param  {array}  subhulls
     * @return {number}
     * @private
     */
    static extremePointOfSubhulls (subhulls)
    {
        const extremePoints = Util.$getArray();
        const length = subhulls.length;
        for (let i = 0; i < length; i++) {
            // （x座標が小さい順にソートされている）凸包の始点を取る
            extremePoints.push(subhulls[i][0]);
        }

        const result = this.extremePoint(extremePoints);

        Util.$poolArray(extremePoints);

        return result;
    }

    /**
     * @description 点集合の中で、x座標が最も小さい点のインデックスを返す
     * @param  {array}  points
     * @return {number}
     * @private
     */
    static extremePoint (points)
    {
        let minIndex = 0;
        const length = points.length;
        for (let i = 1; i < length; i++) {
            if (points[i].x < points[minIndex].x) {
                minIndex = i;
            }
        }
        return minIndex;
    }

    /**
     * @description （x座標が小さい順にソートされている）凸包の中で、基準点から最も時計回り側にある点のインデックスを返す
     * @param  {array}  hullPoints
     * @param  {object} currentPoint
     * @return {number}
     * @private
     */
    static binarySearch (hullPoints, currentPoint)
    {
        const length = hullPoints.length;

        let beginIndex = 0;
        let endIndex   = length;

        while (beginIndex < endIndex) {
            // 始点と基準点が同じ座標なら、始点の次の点が最も時計回り側にある点になる
            if (this.equalsPoint(hullPoints[beginIndex], currentPoint)) {
                return (beginIndex + 1) % length;
            }
            const beginPrev = this.orientation(hullPoints[beginIndex], hullPoints[(beginIndex + length - 1) % length], currentPoint);
            const beginNext = this.orientation(hullPoints[beginIndex], hullPoints[(beginIndex + 1) % length], currentPoint);

            // 中心点と基準点が同じ座標なら、中心点の次の点が最も時計回り側にある点になる
            const centerIndex = Util.$floor((beginIndex + endIndex) / 2);
            if (this.equalsPoint(hullPoints[centerIndex], currentPoint)) {
                return (centerIndex + 1) % length;
            }
            const centerPrev = this.orientation(hullPoints[centerIndex], hullPoints[(centerIndex + length - 1) % length], currentPoint);
            const centerNext = this.orientation(hullPoints[centerIndex], hullPoints[(centerIndex + 1) % length], currentPoint);

            // 中心点の前の点と次の点が、中心点より反時計回り側にあるなら、中心点が最も時計回り側にある点になる
            if (centerPrev <= 0 && centerNext <= 0) {
                return centerIndex;
            }

            // 探索する方向を求める
            const centerSide = this.orientation(hullPoints[beginIndex], hullPoints[centerIndex], currentPoint);
            const ptn1 = (centerSide   < 0 && (beginPrev <= 0 && beginNext <= 0)); // 始点が最も時計回り側にあるパターン
            const ptn2 = (centerSide   < 0 && (beginPrev  < 0 || beginNext  > 0)); // 中心点が始点より反時計回り側にあるパターン
            const ptn3 = (centerSide   > 0 && (centerPrev > 0 || centerNext < 0)); // 中心点が始点より時計回り側にあるパターン
            const ptn4 = (centerSide === 0 && (centerPrev > 0 || centerNext < 0)); // 中心点と始点が平行しているパターン
            if (ptn1 || ptn2 || ptn3 || ptn4) {
                endIndex = centerIndex;
            } else {
                beginIndex = centerIndex + 1;
            }
        }

        return beginIndex;
    }

    /**
     * @description 凸包の中で、基準点から最も時計回り側にある点のインデックスを返す（テスト用）
     * @param  {array}  hullPoints
     * @param  {object} currentPoint
     * @return {number}
     * @private
     */
    static linearSearch (hullPoints, currentPoint)
    {
        let minIndex = 0;
        const length = hullPoints.length;
        for (let i = 0; i < length; i++) {
            if (this.equalsPoint(hullPoints[i], currentPoint)) {
                return (i + 1) % length;
            }
            if (this.orientation(hullPoints[minIndex], hullPoints[i], currentPoint) > 0) {
                minIndex = i;
            }
        }
        return minIndex;
    }

    /**
     * @param  {object} p1
     * @param  {object} p2
     * @return {boolean}
     * @private
     */
    static equalsPoint (p1, p2)
    {
        return p1.x === p2.x && p1.y === p2.y;
    }

    /**
     * @description 「ギフト包装法」で、点集合から凸包を求める（テスト用）
     * @param  {array} points
     * @return {array}
     * @private
     */
    static giftWrapping (points)
    {
        const result = Util.$getArray();
        const length = points.length;

        // x座標が最も小さい点を、初期の基準点にする
        const extremePointIndex = this.extremePoint(points);

        let currentIndex = extremePointIndex;
        do {
            // 基準点を、凸包に追加する
            result.push(points[currentIndex]);

            let nextIndex = (currentIndex + 1) % length;
            let nx = points[nextIndex].x - points[currentIndex].x;
            let ny = points[nextIndex].y - points[currentIndex].y;

            // 基準点から最も時計回り側にある点を、次の基準点にする
            for (let i = 0; i < length; i++) {
                const ix = points[i].x - points[currentIndex].x;
                const iy = points[i].y - points[currentIndex].y;

                if (Util.$cross(nx, ny, ix, iy) > 0) {
                    nextIndex = i;
                    nx = ix;
                    ny = iy;
                }
            }

            currentIndex = nextIndex;
        } while (currentIndex !== extremePointIndex);

        return result;
    }
}

/**
 * @class
 */
class FrameBufferManager
{
    /**
     * @param {WebGLRenderingContext} gl
     * @param {boolean}               isWebGL2Context
     * @param {number}                samples
     * @constructor
     */
    constructor (gl, isWebGL2Context, samples)
    {
        this._$gl                 = gl;
        this._$isWebGL2Context    = isWebGL2Context;
        this._$objectPool         = [];
        this._$frameBuffer        = gl.createFramebuffer();
        this._$frameBufferTexture = null;
        this._$currentAttachment  = null;
        this._$isBinding          = false;
        this._$textureManager     = new TextureManager(gl, isWebGL2Context);
        this._$colorBufferPool    = null;
        this._$stencilBufferPool  = new StencilBufferPool(gl);

        if (isWebGL2Context) {
            this._$frameBufferTexture = gl.createFramebuffer();
            this._$colorBufferPool    = new ColorBufferPool(gl, samples);

            gl.bindFramebuffer(gl.READ_FRAMEBUFFER, this._$frameBuffer);
        }
    }

    /**
     * @memberof FrameBufferManager#
     * @property {object}
     * @return   {object}
     * @public
     */
    get currentAttachment ()
    {
        return this._$currentAttachment;
    }

    /**
     * @param  {number}  width
     * @param  {number}  height
     * @param  {boolean} [multisample=false]
     * @param  {uint}    [samples=0]
     * @return {object}
     * @public
     */
    createCacheAttachment (width, height, multisample = false, samples = 0)
    {
        const attachment = (this._$objectPool.length)
            ? this._$objectPool.pop()
            : {};
        const texture = this._$textureManager.create(width, height);

        attachment.width  = width;
        attachment.height = height;

        if (this._$isWebGL2Context && multisample) {
            attachment.color   = this._$colorBufferPool.create(width, height, samples);
            attachment.texture = texture;
            attachment.msaa    = true;
            attachment.stencil = attachment.color.stencil;
        } else {
            attachment.color   = texture;
            attachment.texture = texture;
            attachment.msaa    = false;
            attachment.stencil = this._$stencilBufferPool.create(texture.width, texture.height);
        }

        attachment.mask      = false;
        attachment.clipLevel = 0;
        attachment.isActive  = true;

        return attachment;
    }

    /**
     * @param  {number} width
     * @param  {number} height
     * @return {object}
     * @public
     */
    createTextureAttachment (width, height)
    {
        const attachment = (this._$objectPool.length)
            ? this._$objectPool.pop()
            : {};
        const texture = this._$textureManager.create(width, height);

        attachment.width     = width;
        attachment.height    = height;
        attachment.color     = texture;
        attachment.texture   = texture;
        attachment.msaa      = false;
        attachment.stencil   = null;
        attachment.mask      = false;
        attachment.clipLevel = 0;
        attachment.isActive  = true;

        return attachment;
    }

    /**
     * @param  {WebGLTexture} texture
     * @return {object}
     * @public
     */
    createTextureAttachmentFrom (texture)
    {
        const attachment = (this._$objectPool.length)
            ? this._$objectPool.pop()
            : {};

        attachment.width     = texture.width;
        attachment.height    = texture.height;
        attachment.color     = texture;
        attachment.texture   = texture;
        attachment.msaa      = false;
        attachment.stencil   = null;
        attachment.mask      = false;
        attachment.clipLevel = 0;
        attachment.isActive  = true;

        return attachment;
    }

    /**
     * @param  {object}  attachment
     * @param  {boolean} [shouldReleaseTexture=false]
     * @return void
     * @public
     */
    releaseAttachment (attachment, shouldReleaseTexture = false)
    {
        if (!attachment.isActive) {
            return;
        }

        if (attachment.msaa) {
            this._$colorBufferPool.release(attachment.color);
        } else if (attachment.stencil) {
            this._$stencilBufferPool.release(attachment.stencil);
        }

        if (shouldReleaseTexture) {
            this._$textureManager.release(attachment.texture);
        }

        attachment.color    = null;
        attachment.texture  = null;
        attachment.stencil  = null;
        attachment.isActive = false;

        this._$objectPool.push(attachment);
    }

    /**
     * @param  {object} attachment
     * @return void
     * @public
     */
    bind (attachment)
    {
        this._$currentAttachment = attachment;
        if (!this._$isBinding) {
            this._$isBinding = true;
            this._$gl.bindFramebuffer(this._$gl.FRAMEBUFFER, this._$frameBuffer);
        }

        if (attachment.msaa) {
            this._$gl.bindRenderbuffer(this._$gl.RENDERBUFFER, attachment.color);
            this._$gl.framebufferRenderbuffer(
                this._$gl.FRAMEBUFFER, this._$gl.COLOR_ATTACHMENT0,
                this._$gl.RENDERBUFFER, attachment.color
            );
        } else {
            this._$textureManager.bind(attachment.color);

            this._$gl.framebufferTexture2D(
                this._$gl.FRAMEBUFFER, this._$gl.COLOR_ATTACHMENT0,
                this._$gl.TEXTURE_2D, attachment.color, 0
            );
        }

        this._$gl.bindRenderbuffer(this._$gl.RENDERBUFFER, attachment.stencil);
        this._$gl.framebufferRenderbuffer(
            this._$gl.FRAMEBUFFER, this._$gl.STENCIL_ATTACHMENT,
            this._$gl.RENDERBUFFER, attachment.stencil
        );
    }

    /**
     * @return void
     * @public
     */
    unbind ()
    {
        this._$currentAttachment = null;
        if (this._$isBinding) {
            this._$isBinding = false;
            this._$gl.bindFramebuffer(this._$gl.FRAMEBUFFER, null);
        }
    }

    /**
     * @return {WebGLTexture}
     * @public
     */
    getTextureFromCurrentAttachment ()
    {
        if (!this._$currentAttachment.msaa) {
            return this._$currentAttachment.texture;
        }

        const width   = this._$currentAttachment.width;
        const height  = this._$currentAttachment.height;
        const texture = this._$currentAttachment.texture;
        texture.dirty = false;

        this._$gl.bindFramebuffer(this._$gl.DRAW_FRAMEBUFFER, this._$frameBufferTexture);

        this._$textureManager.bind(texture);

        this._$gl.framebufferTexture2D(
            this._$gl.FRAMEBUFFER, this._$gl.COLOR_ATTACHMENT0,
            this._$gl.TEXTURE_2D, texture, 0
        );

        this._$gl.blitFramebuffer(
            0, 0, width, height,
            0, 0, width, height,
            this._$gl.COLOR_BUFFER_BIT,
            this._$gl.NEAREST
        );

        this._$gl.bindFramebuffer(this._$gl.FRAMEBUFFER, this._$frameBuffer);

        return texture;
    }

    /**
     * @param  {number}     width
     * @param  {number}     height
     * @param  {Uint8Array} [pixels=null]
     * @param  {boolean}    [premultipliedAlpha=false]
     * @param  {boolean}    [flipY=true]
     * @return {WebGLTexture}
     * @public
     */
    createTextureFromPixels (width, height, pixels = null, premultipliedAlpha = false, flipY = true)
    {
        return this._$textureManager.create(width, height, pixels, premultipliedAlpha, flipY);
    }

    /**
     * @param  {HTMLCanvasElement} canvas
     * @return {WebGLTexture}
     * @public
     */
    createTextureFromCanvas (canvas)
    {
        return this._$textureManager.createFromCanvas(canvas);
    }

    /**
     * @param  {HTMLImageElement} image
     * @return {WebGLTexture}
     * @public
     */
    createTextureFromImage (image)
    {
        return this._$textureManager.createFromImage(image);
    }

    /**
     * @param  {number}     width
     * @param  {number}     height
     * @param  {Uint8Array} pixels
     * @return {WebGLTexture}
     * @public
     */
    createAlphaTextureFromPixels (width, height, pixels)
    {
        return this._$textureManager.createAlpha(width, height, pixels);
    }

    /**
     * @param  {HTMLVideoElement} video
     * @param  {boolean} [smoothing=false]
     * @param  {WebGLTexture} [target_texture=null]
     * @return {WebGLTexture}
     * @public
     */
    createTextureFromVideo (video, smoothing = false, target_texture = null)
    {
        return this._$textureManager.createFromVideo(video, smoothing, target_texture);
    }

    /**
     * @return {WebGLTexture}
     * @public
     */
    createTextureFromCurrentAttachment ()
    {
        const width   = this._$currentAttachment.width;
        const height  = this._$currentAttachment.height;
        const texture = this._$textureManager.create(width, height);

        this._$textureManager.bind(texture);

        this._$gl.copyTexSubImage2D(
            this._$gl.TEXTURE_2D, 0,
            0, 0, 0, 0, width, height
        );

        return texture;
    }

    /**
     * @param  {WebGLTexture} texture
     * @return void
     * @public
     */
    releaseTexture (texture)
    {
        this._$textureManager.release(texture);
    }

}

/**
 * @class
 */
class PixelBufferObjectManager
{
    /**
     * @param {WebGLRenderingContext} gl
     * @param {boolean}               isWebGL2Context
     * @constructor
     */
    constructor (gl, isWebGL2Context)
    {
        this._$gl              = gl;
        this._$isWebGL2Context = isWebGL2Context;
        this._$objectPool      = [];
    }

    /**
     * @param  {number} size
     * @return {WebGLBuffer}
     * @private
     */
    _$getPixelBufferObject (size)
    {
        if (!this._$objectPool.length) {
            const pixelBufferObject = this._$gl.createBuffer();
            pixelBufferObject.size  = 0;
            return pixelBufferObject;
        }

        for (let i = 0; i < this._$objectPool.length; i++) {
            const pixelBufferObject = this._$objectPool[i];
            if (pixelBufferObject.size === size) {
                this._$objectPool.splice(i, 1);
                return pixelBufferObject;
            }
        }

        return this._$objectPool.shift();
    }

    /**
     * @param  {number} x
     * @param  {number} y
     * @param  {number} width
     * @param  {number} height
     * @return {WebGLBuffer}
     * @public
     */
    readPixelsAsync (x, y, width, height)
    {
        if (!this._$isWebGL2Context) {
            return null;
        }

        const size              = width * height * 4;
        const pixelBufferObject = this._$getPixelBufferObject(size);

        this._$gl.bindBuffer(this._$gl.PIXEL_PACK_BUFFER, pixelBufferObject);

        if (pixelBufferObject.size !== size) {
            pixelBufferObject.size = size;
            this._$gl.bufferData(this._$gl.PIXEL_PACK_BUFFER, size, this._$gl.DYNAMIC_COPY);
        }

        this._$gl.readPixels(
            x, y, width, height,
            this._$gl.RGBA, this._$gl.UNSIGNED_BYTE,
            0
        );
        this._$gl.bindBuffer(this._$gl.PIXEL_PACK_BUFFER, null);

        return pixelBufferObject;
    }

    /**
     * @param  {WebGLBuffer} pixelBufferObject
     * @return {Uint8Array}
     * @public
     */
    getBufferSubDataAsync (pixelBufferObject)
    {
        const data = Util.$getUint8Array(pixelBufferObject.size);

        this._$gl.bindBuffer(this._$gl.PIXEL_PACK_BUFFER, pixelBufferObject);
        this._$gl.getBufferSubData(this._$gl.PIXEL_PACK_BUFFER, 0, data);
        this._$gl.bindBuffer(this._$gl.PIXEL_PACK_BUFFER, null);

        this._$objectPool.push(pixelBufferObject);

        return data;
    }

    /**
     * @param  {WebGLBuffer} pixelBufferObject
     * @return void
     * @public
     */
    release (pixelBufferObject)
    {
        this._$objectPool.push(pixelBufferObject);
    }
}

/**
 * @class
 */
class StencilBufferPool
{
    /**
     * @param {WebGLRenderingContext} gl
     * @constructor
     */
    constructor (gl)
    {
        this._$gl             = gl;
        this._$objectPool     = [];
        this._$objectPoolArea = 0;
        this._$maxWidth       = 0;
        this._$maxHeight      = 0;
    }

    /**
     * @return {WebGLRenderbuffer}
     * @private
     */
    _$createStencilBuffer ()
    {
        const stencilBuffer  = this._$gl.createRenderbuffer();
        stencilBuffer.width  = 0;
        stencilBuffer.height = 0;
        stencilBuffer.area   = 0;
        stencilBuffer.dirty  = true;
        return stencilBuffer;
    }

    /**
     * @param  {number}  width
     * @param  {number}  height
     * @return {WebGLRenderbuffer}
     * @private
     */
    _$getStencilBuffer (width, height)
    {
        const length = this._$objectPool.length;
        for (let i = 0; i < length; i++) {
            const stencilBuffer = this._$objectPool[i];
            if (stencilBuffer.width === width && stencilBuffer.height === height) {
                this._$objectPool.splice(i, 1);
                this._$objectPoolArea -= stencilBuffer.area;
                return stencilBuffer;
            }
        }

        if (length > 100) {
            const stencilBuffer = this._$objectPool.shift();
            this._$objectPoolArea -= stencilBuffer.area;
            return stencilBuffer;
        }

        return this._$createStencilBuffer();
    }

    /**
     * @param  {number}  width
     * @param  {number}  height
     * @return {WebGLRenderbuffer}
     * @public
     */
    create (width, height)
    {
        const stencilBuffer = this._$getStencilBuffer(width, height);

        if (stencilBuffer.width !== width || stencilBuffer.height !== height) {
            stencilBuffer.width  = width;
            stencilBuffer.height = height;
            stencilBuffer.area   = width * height;
            stencilBuffer.dirty  = false;

            this._$gl.bindRenderbuffer(this._$gl.RENDERBUFFER, stencilBuffer);
            this._$gl.renderbufferStorage(
                this._$gl.RENDERBUFFER,
                this._$gl.STENCIL_INDEX8,
                width, height
            );
        }

        return stencilBuffer;
    }

    /**
     * @param  {WebGLRenderbuffer} stencilBuffer
     * @return void
     * @public
     */
    release (stencilBuffer)
    {
        // ステンシルバッファのサイズが非常に大きい場合はプールしない
        if (stencilBuffer.area > (this._$maxWidth * this._$maxHeight * 1.2)|0) {
            this._$gl.deleteRenderbuffer(stencilBuffer);
            return;
        }

        stencilBuffer.dirty = true;
        this._$objectPool.push(stencilBuffer);
        this._$objectPoolArea += stencilBuffer.area;


        // プール容量が一定を超えたら、古いステンシルバッファから削除していく
        if (this._$objectPoolArea > (this._$maxWidth * this._$maxHeight * 10)) {
            const oldStencilBuffer = this._$objectPool.shift();
            this._$objectPoolArea -= oldStencilBuffer.area;
            this._$gl.deleteRenderbuffer(oldStencilBuffer);
        }
    }
}

/**
 * @class
 */
class TextureManager
{
    /**
     * @param {WebGLRenderingContext} gl
     * @param {boolean}               isWebGL2Context
     * @constructor
     */
    constructor (gl, isWebGL2Context)
    {
        this._$gl              = gl;
        this._$isWebGL2Context = isWebGL2Context;
        this._$objectPool      = [];
        this._$objectPoolArea  = 0;
        this._$boundTexture0   = null;
        this._$boundTexture1   = null;
        this._$maxWidth        = 0;
        this._$maxHeight       = 0;

        this._$gl.pixelStorei(this._$gl.UNPACK_ALIGNMENT, 1);
        this._$gl.pixelStorei(this._$gl.UNPACK_FLIP_Y_WEBGL, true);
    }

    /**
     * @param  {number} width
     * @param  {number} height
     * @return {WebGLTexture}
     * @private
     */
    _$createTexture (width, height)
    {
        const texture = this._$gl.createTexture();

        texture.width     = 0;
        texture.height    = 0;
        texture.area      = 0;
        texture.dirty     = true;
        texture.smoothing = true;
        texture._$offsetX = 0;
        texture._$offsetY = 0;

        this.bindAndSmoothing(false, texture);

        this._$gl.texParameteri(this._$gl.TEXTURE_2D, this._$gl.TEXTURE_WRAP_S, this._$gl.CLAMP_TO_EDGE);
        this._$gl.texParameteri(this._$gl.TEXTURE_2D, this._$gl.TEXTURE_WRAP_T, this._$gl.CLAMP_TO_EDGE);

        if (this._$isWebGL2Context) {
            texture.width  = width;
            texture.height = height;
            texture.area   = width * height;
            texture.dirty  = false;
            this._$gl.texStorage2D(this._$gl.TEXTURE_2D, 1, this._$gl.RGBA8, width, height);

            if (window.glstats) {
                glstats.ontex(texture.area);
            }
        }

        return texture;
    }

    /**
     * @param  {number} width
     * @param  {number} height
     * @return {WebGLTexture}
     * @private
     */
    _$getTexture (width, height)
    {
        // プールに同じサイズのテクスチャがあれば、それを使い回す
        for (let i = 0; i < this._$objectPool.length; i++) {
            const texture = this._$objectPool[i];
            if (texture.width === width && texture.height === height) {
                this._$objectPool.splice(i, 1);
                this._$objectPoolArea -= texture.area;

                this.bindAndSmoothing(false, texture);

                return texture;
            }
        }

        return this._$createTexture(width, height);
    }

    /**
     * @param  {number}     width
     * @param  {number}     height
     * @param  {Uint8Array} pixels
     * @return {WebGLTexture}
     * @public
     */
    createAlpha (width, height, pixels)
    {
        if (!this._$alphaTexture) {
            this._$alphaTexture = this._$gl.createTexture();

            this.bind(this._$alphaTexture);
            this._$gl.texParameteri(this._$gl.TEXTURE_2D, this._$gl.TEXTURE_WRAP_S, this._$gl.CLAMP_TO_EDGE);
            this._$gl.texParameteri(this._$gl.TEXTURE_2D, this._$gl.TEXTURE_WRAP_T, this._$gl.CLAMP_TO_EDGE);
            this._$gl.texParameteri(this._$gl.TEXTURE_2D, this._$gl.TEXTURE_MIN_FILTER, this._$gl.NEAREST);
            this._$gl.texParameteri(this._$gl.TEXTURE_2D, this._$gl.TEXTURE_MAG_FILTER, this._$gl.NEAREST);
        } else {

            this.bind(this._$alphaTexture);

        }

        this._$alphaTexture.width  = width;
        this._$alphaTexture.height = height;
        this._$alphaTexture.dirty  = false;

        this._$gl.texImage2D(
            this._$gl.TEXTURE_2D, 0, this._$gl.ALPHA, width, height,
            0, this._$gl.ALPHA, this._$gl.UNSIGNED_BYTE, pixels
        );

        return this._$alphaTexture;
    }

    /**
     * @param  {number}     width
     * @param  {number}     height
     * @param  {Uint8Array} [pixels=null]
     * @param  {boolean}    [premultipliedAlpha=false]
     * @param  {boolean}    [flipY=true]
     * @return {WebGLTexture}
     */
    create (width, height, pixels = null, premultipliedAlpha = false, flipY = true)
    {
        const texture = this._$getTexture(width, height);

        if (premultipliedAlpha) {
            this._$gl.pixelStorei(this._$gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
        }

        if (!flipY) {
            this._$gl.pixelStorei(this._$gl.UNPACK_FLIP_Y_WEBGL, false);
        }

        if (texture.width !== width || texture.height !== height) {
            texture.width  = width;
            texture.height = height;
            texture.area   = width * height;
            texture.dirty  = false;

            this._$gl.texImage2D(
                this._$gl.TEXTURE_2D, 0, this._$gl.RGBA, width, height,
                0, this._$gl.RGBA, this._$gl.UNSIGNED_BYTE, pixels
            );

            if (window.glstats) {
                glstats.ontex(texture.area);
            }
        } else if (pixels) {
            texture.dirty = false;

            this._$gl.texSubImage2D(
                this._$gl.TEXTURE_2D, 0, 0, 0, width, height,
                this._$gl.RGBA, this._$gl.UNSIGNED_BYTE, pixels
            );
        }

        if (premultipliedAlpha) {
            this._$gl.pixelStorei(this._$gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
        }

        if (!flipY) {
            this._$gl.pixelStorei(this._$gl.UNPACK_FLIP_Y_WEBGL, true);
        }

        return texture;
    }

    /**
     * @param  {HTMLImageElement} image
     * @return {WebGLTexture}
     * @public
     */
    createFromImage (image)
    {
        return this._$createFromElement(image.width, image.height, image, false, null);
    }

    /**
     * @param  {HTMLCanvasElement} canvas
     * @return {WebGLTexture}
     */
    createFromCanvas (canvas)
    {
        return this._$createFromElement(canvas.width, canvas.height, canvas, false, null);
    }

    /**
     * @param  {HTMLVideoElement} video
     * @param  {boolean} [smoothing=false]
     * @param  {WebGLTexture} [target_texture=null]
     * @return {WebGLTexture}
     */
    createFromVideo (video, smoothing = false, target_texture = null)
    {
        return this._$createFromElement(video.videoWidth, video.videoHeight, video, smoothing, target_texture);
    }

    /**
     * @param  {number} width
     * @param  {number} height
     * @param  {ImageData|HTMLImageElement|HTMLCanvasElement|HTMLVideoElement} element
     * @param  {boolean} [smoothing=false]
     * @param  {WebGLTexture} [target_texture=null]
     * @return {WebGLTexture}
     * @private
     */
    _$createFromElement (width, height, element, smoothing = false, target_texture = null)
    {
        const texture = target_texture || this._$getTexture(width, height);

        texture.dirty = false;
        this.bindAndSmoothing(smoothing, texture);

        this._$gl.pixelStorei(this._$gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);

        if (texture.width !== width || texture.height !== height) {
            texture.width  = width;
            texture.height = height;
            texture.area   = width * height;

            this._$gl.texImage2D(
                this._$gl.TEXTURE_2D, 0, this._$gl.RGBA,
                this._$gl.RGBA, this._$gl.UNSIGNED_BYTE, element
            );

            if (window.glstats) {
                glstats.ontex(texture.area);
            }
        } else {
            this._$gl.texSubImage2D(
                this._$gl.TEXTURE_2D, 0, 0, 0,
                this._$gl.RGBA, this._$gl.UNSIGNED_BYTE, element
            );
        }
        
        this._$gl.pixelStorei(this._$gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);

        return texture;
    }

    /**
     * @param  {WebGLTexture} texture
     * @return void
     */
    release (texture)
    {
        // テクスチャのサイズが非常に大きい場合はプールしない
        if (texture.area > (this._$maxWidth * this._$maxHeight * 1.2)|0) {
            this._$gl.deleteTexture(texture);
            return;
        }

        texture.dirty = true;
        this._$objectPool.push(texture);
        this._$objectPoolArea += texture.area;

        // プール容量が一定を超えたら、古いテクスチャから削除していく
        if (this._$objectPoolArea > (this._$maxWidth * this._$maxHeight * 10)) {
            const oldTexture = this._$objectPool.shift();
            this._$objectPoolArea -= oldTexture.area;
            this._$gl.deleteTexture(oldTexture);
        }
    }

    /**
     * @param  {WebGLTexture} texture0
     * @param  {WebGLTexture} [texture1=null]
     * @return void
     */
    bind (texture0, texture1 = null)
    {
        if (texture0 !== this._$boundTexture0) {
            this._$boundTexture0 = texture0;
            this._$gl.bindTexture(this._$gl.TEXTURE_2D, texture0);
        }

        if (texture1) {
            if (texture1 !== this._$boundTexture1) {
                this._$boundTexture1 = texture1;
                this._$gl.activeTexture(this._$gl.TEXTURE1);
                this._$gl.bindTexture(this._$gl.TEXTURE_2D, texture1);
                this._$gl.activeTexture(this._$gl.TEXTURE0);
            }
        } else if (this._$boundTexture1) {
            this._$boundTexture1 = null;
            this._$gl.activeTexture(this._$gl.TEXTURE1);
            this._$gl.bindTexture(this._$gl.TEXTURE_2D, null);
            this._$gl.activeTexture(this._$gl.TEXTURE0);
        }
    }

    /**
     * @param  {boolean}      smoothing
     * @param  {WebGLTexture} texture0
     * @param  {WebGLTexture} [texture1=null]
     * @return void
     */
    bindAndSmoothing (smoothing, texture0, texture1 = null)
    {
        const filter = (smoothing && Util.$currentPlayer()._$quality !== StageQuality.LOW)
            ? this._$gl.LINEAR
            : this._$gl.NEAREST;
        
        if (texture0 !== this._$boundTexture0) {
            this._$boundTexture0 = texture0;
            this._$gl.bindTexture(this._$gl.TEXTURE_2D, texture0);
        }

        if (smoothing !== this._$boundTexture0.smoothing) {
            this._$boundTexture0.smoothing = smoothing;
            this._$gl.texParameteri(this._$gl.TEXTURE_2D, this._$gl.TEXTURE_MIN_FILTER, filter);
            this._$gl.texParameteri(this._$gl.TEXTURE_2D, this._$gl.TEXTURE_MAG_FILTER, filter);
        }

        if (texture1) {
            let active1 = false;

            if (texture1 !== this._$boundTexture1) {
                this._$boundTexture1 = texture1;

                active1 = true;
                this._$gl.activeTexture(this._$gl.TEXTURE1);

                this._$gl.bindTexture(this._$gl.TEXTURE_2D, texture1);
            }

            if (smoothing !== this._$boundTexture1.smoothing) {
                this._$boundTexture1.smoothing = smoothing;

                if (!active1) {
                    active1 = true;
                    this._$gl.activeTexture(this._$gl.TEXTURE1);
                }

                this._$gl.texParameteri(this._$gl.TEXTURE_2D, this._$gl.TEXTURE_MIN_FILTER, filter);
                this._$gl.texParameteri(this._$gl.TEXTURE_2D, this._$gl.TEXTURE_MAG_FILTER, filter);  
            }

            if (active1) {
                this._$gl.activeTexture(this._$gl.TEXTURE0);
            }
        } else if (this._$boundTexture1) {
            this._$boundTexture1 = null;
            this._$gl.activeTexture(this._$gl.TEXTURE1);
            this._$gl.bindTexture(this._$gl.TEXTURE_2D, null);
            this._$gl.activeTexture(this._$gl.TEXTURE0);
        }
    }
}

/**
 * @class
 */
class VertexArrayObjectManager
{
    /**
     * @param {WebGLRenderingContext} gl
     * @param {boolean}               isWebGL2Context
     * @constructor
     * @public
     */
    constructor (gl, isWebGL2Context)
    {
        this._$gl                     = gl;
        this._$isWebGL2Context        = isWebGL2Context;
        this._$fillVertexArrayPool    = [];
        this._$strokeVertexArrayPool  = [];
        this._$boundVertexArray       = null;

        this._$extension = isWebGL2Context ? null : gl.getExtension("OES_vertex_array_object");
        this._$fillAttrib_vertex    = 0;
        this._$fillAttrib_bezier    = 1;
        this._$strokeAttrib_vertex  = 0;
        this._$strokeAttrib_option1 = 1;
        this._$strokeAttrib_option2 = 2;
        this._$strokeAttrib_type    = 3;

        this._$commonVertexArray = this._$getCommonVertexArray();
    }

    /**
     * @return {WebGLVertexArrayObject}
     * @method
     * @private
     */
    _$createVertexArray ()
    {
        return (this._$isWebGL2Context)
            ? this._$gl.createVertexArray()
            : this._$extension.createVertexArrayOES();
    }

    /**
     * @return {WebGLVertexArrayObject}
     * @method
     * @private
     */
    _$getCommonVertexArray ()
    {
        const vertexBufferData = Util.$getFloat32Array(0, 0, 0, 1, 1, 0, 1, 1);

        const vertexArray = this._$createVertexArray();
        this.bind(vertexArray);

        const vertexBuffer = this._$gl.createBuffer();
        this._$gl.bindBuffer(this._$gl.ARRAY_BUFFER, vertexBuffer);
        this._$gl.bufferData(this._$gl.ARRAY_BUFFER, vertexBufferData, this._$gl.STATIC_DRAW);
        
        this._$gl.enableVertexAttribArray(0);
        this._$gl.vertexAttribPointer(0, 2, this._$gl.FLOAT, false, 0, 0);

        return vertexArray;
    }

    /**
     * @return {WebGLVertexArrayObject}
     * @method
     * @private
     */
    _$getFillVertexArray ()
    {
        if (this._$fillVertexArrayPool.length) {
            return this._$fillVertexArrayPool.pop();
        }

        const vertexArray = this._$createVertexArray();
        this.bind(vertexArray);
        
        const vertexBuffer = this._$gl.createBuffer();
        vertexArray.vertexBuffer = vertexBuffer;
        vertexArray.vertexLength = 0;
        this._$gl.bindBuffer(this._$gl.ARRAY_BUFFER, vertexBuffer);

        this._$gl.enableVertexAttribArray(0);
        this._$gl.enableVertexAttribArray(1);
        this._$gl.vertexAttribPointer(this._$fillAttrib_vertex, 2, this._$gl.FLOAT, false, 16, 0);
        this._$gl.vertexAttribPointer(this._$fillAttrib_bezier, 2, this._$gl.FLOAT, false, 16, 8);

        return vertexArray;
    }

    /**
     * @return {WebGLVertexArrayObject}
     * @method
     * @private
     */
    _$getStrokeVertexArray ()
    {
        if (this._$strokeVertexArrayPool.length) {
            return this._$strokeVertexArrayPool.pop();
        }

        const vertexArray = this._$createVertexArray();
        this.bind(vertexArray);
        
        const vertexBuffer = this._$gl.createBuffer();
        vertexArray.vertexBuffer = vertexBuffer;
        vertexArray.vertexLength = 0;
        this._$gl.bindBuffer(this._$gl.ARRAY_BUFFER, vertexBuffer);
        
        const indexBuffer = this._$gl.createBuffer();
        vertexArray.indexBuffer = indexBuffer;
        vertexArray.indexLength  = 0;
        this._$gl.bindBuffer(this._$gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

        this._$gl.enableVertexAttribArray(0);
        this._$gl.enableVertexAttribArray(1);
        this._$gl.enableVertexAttribArray(2);
        this._$gl.enableVertexAttribArray(3);
        this._$gl.vertexAttribPointer(this._$strokeAttrib_vertex,  2, this._$gl.FLOAT, false, 28, 0);
        this._$gl.vertexAttribPointer(this._$strokeAttrib_option1, 2, this._$gl.FLOAT, false, 28, 8);
        this._$gl.vertexAttribPointer(this._$strokeAttrib_option2, 2, this._$gl.FLOAT, false, 28, 16);
        this._$gl.vertexAttribPointer(this._$strokeAttrib_type,    1, this._$gl.FLOAT, false, 28, 24);

        return vertexArray;
    }

    /**
     * @param vertices
     * @return {WebGLVertexArrayObject}
     * @method
     * @public
     */
    createFill (vertices)
    {
        const mesh = WebGLFillMeshGenerator.generate(vertices);
        const vertexBufferData = mesh.vertexBufferData;

        const vertexArray = this._$getFillVertexArray();
        vertexArray.indexRanges = mesh.indexRanges;
        this.bind(vertexArray);

        this._$gl.bindBuffer(this._$gl.ARRAY_BUFFER, vertexArray.vertexBuffer);

        if (vertexArray.vertexLength < vertexBufferData.length) {
            vertexArray.vertexLength = Util.$upperPowerOfTwo(vertexBufferData.length);
            this._$gl.bufferData(this._$gl.ARRAY_BUFFER, vertexArray.vertexLength * 4, this._$gl.DYNAMIC_DRAW);
        }

        this._$gl.bufferSubData(this._$gl.ARRAY_BUFFER, 0, vertexBufferData);

        return vertexArray;
    }

    /**
     * @param vertices
     * @param lineCap
     * @param lineJoin
     * @return {WebGLVertexArrayObject}
     * @method
     * @public
     */
    createStroke (vertices, lineCap, lineJoin)
    {
        const mesh = WebGLStrokeMeshGenerator.generate(vertices, lineCap, lineJoin);
        const vertexBufferData = mesh.vertexBufferData;
        const indexBufferData  = mesh.indexBufferData;

        const vertexArray = this._$getStrokeVertexArray();
        vertexArray.indexCount = indexBufferData.length;
        this.bind(vertexArray);

        this._$gl.bindBuffer(this._$gl.ARRAY_BUFFER, vertexArray.vertexBuffer);
        this._$gl.bindBuffer(this._$gl.ELEMENT_ARRAY_BUFFER, vertexArray.indexBuffer);

        if (vertexArray.vertexLength < vertexBufferData.length) {
            vertexArray.vertexLength = Util.$upperPowerOfTwo(vertexBufferData.length);
            this._$gl.bufferData(this._$gl.ARRAY_BUFFER, vertexArray.vertexLength * 4, this._$gl.DYNAMIC_DRAW);
        }

        if (vertexArray.indexLength < indexBufferData.length) {
            vertexArray.indexLength = Util.$upperPowerOfTwo(indexBufferData.length);
            this._$gl.bufferData(this._$gl.ELEMENT_ARRAY_BUFFER, vertexArray.indexLength * 2, this._$gl.DYNAMIC_DRAW);
        }

        this._$gl.bufferSubData(this._$gl.ARRAY_BUFFER, 0, vertexBufferData);
        this._$gl.bufferSubData(this._$gl.ELEMENT_ARRAY_BUFFER, 0, indexBufferData);

        return vertexArray;
    }

    /**
     * @param  {WebGLVertexArrayObject} vertexArray
     * @return {void}
     * @method
     * @public
     */
    release (vertexArray)
    {
        if (!vertexArray.indexBuffer) {
            this._$fillVertexArrayPool.push(vertexArray);
        } else {
            this._$strokeVertexArrayPool.push(vertexArray);
        }
    }

    /**
     * @param  {WebGLVertexArrayObject} vertexArray
     * @return {void}
     * @method
     * @public
     */
    bind (vertexArray)
    {
        if (!vertexArray) {
            this._$boundVertexArray = null;
        } else if (vertexArray === this._$boundVertexArray) {
            return;
        } else {
            this._$boundVertexArray = vertexArray;
        }

        if (this._$isWebGL2Context) {
            this._$gl.bindVertexArray(vertexArray);
        } else {
            this._$extension.bindVertexArrayOES(vertexArray);
        }
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    bindCommonVertexArray ()
    {
        this.bind(this._$commonVertexArray);
    }    
}

/**
 * @class
 */
class WebGLFillMeshGenerator
{
    /**
     * @param  {array}  vertices
     * @return {object}
     * @method
     * @static
     */
    static generate (vertices)
    {
        let vertexBufferLen = 0;
        for (let i = 0; i < vertices.length; i++) {
            vertexBufferLen += (vertices[i].length / 3 - 2) * 12;
        }

        this._$vertexBufferData = new Util.$Float32Array(vertexBufferLen);
        this._$indexRanges      = Util.$getArray();
        this._$currentIndex     = 0;

        for (let i = 0; i < vertices.length; i++) {
            const first = this._$currentIndex;
            this._$generateMesh(vertices[i]);
            const count = this._$currentIndex - first;

            this._$indexRanges.push({ "first": first, "count": count });
        }

        return {
            "vertexBufferData": this._$vertexBufferData,
            "indexRanges"     : this._$indexRanges
        };
    }

    /**
     * @param  {array} vertex
     * @return {void}
     * @method
     * @static
     * @private
     */
    static _$generateMesh (vertex)
    {
        const vbd = this._$vertexBufferData;
        let currentIndex = this._$currentIndex;

        const length = vertex.length - 5;
        for (let v = 3; v < length; v += 3) {
            let i = currentIndex * 4;
            if (vertex[v + 2]) {
                vbd[i++] = vertex[v - 3];
                vbd[i++] = vertex[v - 2];
                vbd[i++] = 0;
                vbd[i++] = 0;

                vbd[i++] = vertex[v];
                vbd[i++] = vertex[v + 1];
                vbd[i++] = 0.5;
                vbd[i++] = 0;

                vbd[i++] = vertex[v + 3];
                vbd[i++] = vertex[v + 4];
                vbd[i++] = 1;
                vbd[i++] = 1;

            } else if (vertex[v + 5]) {
                vbd[i++] = vertex[0];
                vbd[i++] = vertex[1];
                vbd[i++] = 0.5;
                vbd[i++] = 0.5;

                vbd[i++] = vertex[v];
                vbd[i++] = vertex[v + 1];
                vbd[i++] = 0.5;
                vbd[i++] = 0.5;

                vbd[i++] = vertex[v + 6];
                vbd[i++] = vertex[v + 7];
                vbd[i++] = 0.5;
                vbd[i++] = 0.5;

            } else {
                vbd[i++] = vertex[0];
                vbd[i++] = vertex[1];
                vbd[i++] = 0.5;
                vbd[i++] = 0.5;

                vbd[i++] = vertex[v];
                vbd[i++] = vertex[v + 1];
                vbd[i++] = 0.5;
                vbd[i++] = 0.5;

                vbd[i++] = vertex[v + 3];
                vbd[i++] = vertex[v + 4];
                vbd[i++] = 0.5;
                vbd[i++] = 0.5;

            }
            currentIndex += 3;
        }
        
        this._$currentIndex = currentIndex;
    }
}

/**
 * @class
 */
class WebGLStrokeMeshGenerator
{
    /**
     * @param  {array}  vertices
     * @param  {string} lineCap
     * @param  {string} lineJoin
     * @return {object}
     * @method
     * @static
     */
    static generate (vertices, lineCap, lineJoin)
    {
        this._$vertexBufferData = this._$vertexBufferData || new Util.$Float32Array(1024);
        this._$vertexBufferPos = 0;

        this._$indexBufferData = this._$indexBufferData || new Util.$Int16Array(256);
        this._$indexBufferPos = 0;

        this._$lineCap  = lineCap;
        this._$lineJoin = lineJoin;

        for (let i = 0; i < vertices.length; i++) {
            const vertexBeginOffset = this._$vertexBufferPos;
            this._$generateLineSegment(vertices[i]);
            const vertexEndOffset   = this._$vertexBufferPos;

            this._$generateLineJoin(vertexBeginOffset, vertexEndOffset);
            this._$generateLineCap(vertexBeginOffset, vertexEndOffset);
        }

        return {
            "vertexBufferData": this._$vertexBufferData.slice(0, this._$vertexBufferPos),
            "indexBufferData" : this._$indexBufferData.slice(0, this._$indexBufferPos)
        };
    }

    /**
     * @param  {number} deltaLength
     * @return {void}
     * @method
     * @static
     * @private
     */
    static _$expandVertexBufferIfNeeded(deltaLength) {
        if (this._$vertexBufferPos + deltaLength > this._$vertexBufferData.length) {
            const biggerBuffer = new Util.$Float32Array(this._$vertexBufferData.length * 2);
            biggerBuffer.set(this._$vertexBufferData);
            this._$vertexBufferData = biggerBuffer;
        }
    }

    /**
     * @param  {number} deltaLength
     * @return {void}
     * @method
     * @static
     * @private
     */
    static _$expandIndexBufferIfNeeded(deltaLength) {
        if (this._$indexBufferPos + deltaLength > this._$indexBufferData.length) {
            const biggerBuffer = new Util.$Int16Array(this._$indexBufferData.length * 2);
            biggerBuffer.set(this._$indexBufferData);
            this._$indexBufferData = biggerBuffer;
        }
    }

    /**
     * @param  {array} vertex
     * @return {void}
     * @method
     * @static
     * @private
     */
    static _$generateLineSegment (vertex)
    {
        const length = vertex.length - 5;
        for (let v = 0; v < length; v += 3) {
            if (vertex[v + 2]) {
                continue;
            }

            if (vertex[v + 5]) {
                this._$addQuadSegmentMesh(
                    vertex[v],     vertex[v + 1],
                    vertex[v + 3], vertex[v + 4],
                    vertex[v + 6], vertex[v + 7]
                );
            } else {
                this._$addLineSegmentMesh(
                    vertex[v],     vertex[v + 1],
                    vertex[v + 3], vertex[v + 4]
                );
            }
        }
    }

    /**
     * @param  {number} x1 線分の始点のx座標
     * @param  {number} y1 線分の始点のy座標
     * @param  {number} cx 線分の制御点のx座標
     * @param  {number} cy 線分の制御点のy座標
     * @param  {number} x2 線分の終点のx座標
     * @param  {number} y2 線分の終点のy座標
     * @return {void}
     * @method
     * @static
     * @private
     */
    static _$addQuadSegmentMesh (x1, y1, cx, cy, x2, y2)
    {
        const div = 11;

        let stx = x1;
        let sty = y1;
        for (let i = 1; i < div; i++) {
            const t = i / div;
            const rt = 1 - t;
            const edx = (x1 * rt + cx * t) * rt + (cx * rt + x2 * t) * t;
            const edy = (y1 * rt + cy * t) * rt + (cy * rt + y2 * t) * t;
            this._$addLineSegmentMesh(stx, sty, edx, edy, 2);

            stx = edx;
            sty = edy;
        }
        this._$addLineSegmentMesh(stx, sty, x2, y2);
    }

    /**
     * @param  {number} x1 線分の始点のx座標
     * @param  {number} y1 線分の始点のy座標
     * @param  {number} x2 線分の終点のx座標
     * @param  {number} y2 線分の終点のy座標
     * @param  {number} [type = 1]
     * @return {void}
     * @method
     * @static
     * @private
     */
    static _$addLineSegmentMesh (x1, y1, x2, y2, type = 1)
    {
        const index0 = this._$vertexBufferPos / 7;
        const index1 = index0 + 1;
        const index2 = index0 + 2;
        const index3 = index0 + 3;

        this._$expandIndexBufferIfNeeded(6);
        const ibd = this._$indexBufferData;
        let ibp = this._$indexBufferPos;

        ibd[ibp++] = index0;
        ibd[ibp++] = index1;
        ibd[ibp++] = index3;

        ibd[ibp++] = index3;
        ibd[ibp++] = index2;
        ibd[ibp++] = index0;

        this._$indexBufferPos = ibp;


        this._$expandVertexBufferIfNeeded(28);
        const vbd = this._$vertexBufferData;
        let vbp = this._$vertexBufferPos;

        vbd[vbp++] = x1;
        vbd[vbp++] = y1;
        vbd[vbp++] = x2;
        vbd[vbp++] = y2;
        vbd[vbp++] = 1;
        vbd[vbp++] = 1;
        vbd[vbp++] = 1;

        vbd[vbp++] = x1;
        vbd[vbp++] = y1;
        vbd[vbp++] = x2;
        vbd[vbp++] = y2;
        vbd[vbp++] = -1;
        vbd[vbp++] = -1;
        vbd[vbp++] = 1;

        vbd[vbp++] = x2;
        vbd[vbp++] = y2;
        vbd[vbp++] = x1;
        vbd[vbp++] = y1;
        vbd[vbp++] = -1;
        vbd[vbp++] = -1;
        vbd[vbp++] = type;

        vbd[vbp++] = x2;
        vbd[vbp++] = y2;
        vbd[vbp++] = x1;
        vbd[vbp++] = y1;
        vbd[vbp++] = 1;
        vbd[vbp++] = 1;
        vbd[vbp++] = type;

        this._$vertexBufferPos = vbp;
    }

    /**
     * @param  {number} vertexBeginOffset 結合対象の頂点の範囲（開始）
     * @param  {number} vertexEndOffset   結合対象の頂点の範囲（終了）
     * @return {void}
     * @method
     * @static
     * @private
     */
    static _$generateLineJoin (vertexBeginOffset, vertexEndOffset)
    {
        const vbd = this._$vertexBufferData;
        const length = vertexEndOffset - 55;
        for (let v = vertexBeginOffset; v < length; v += 28) {
            const indexOffset = v / 7;
            this._$addLineJoinMesh(
                vbd[v],      vbd[v + 1],
                vbd[v + 21], vbd[v + 22], vbd[v + 27],
                vbd[v + 49], vbd[v + 50],
                indexOffset + 2, indexOffset + 3, indexOffset + 4, indexOffset + 5
            );
        }
    }

    /**
     * @param  {number} x1           線分Aの始点のx座標
     * @param  {number} y1           線分Aの始点のy座標
     * @param  {number} x2           結合点のx座標
     * @param  {number} y2           結合点のy座標
     * @param  {number} type         線分タイプ
     * @param  {number} x3           線分Bの終点のx座標
     * @param  {number} y3           線分Bの終点のy座標
     * @param  {number} indexOffset2 線分Aの凸側の頂点インデックス
     * @param  {number} indexOffset3 線分Aの凹側の頂点インデックス
     * @param  {number} indexOffset4 線分Bの凸側の頂点インデックス
     * @param  {number} indexOffset5 線分Bの凹側の頂点インデックス
     * @return {void}
     * @method
     * @static
     * @private
     */
    static _$addLineJoinMesh (x1, y1, x2, y2, type, x3, y3, indexOffset2, indexOffset3, indexOffset4, indexOffset5)
    {
        // AとBがほぼ平行なら、結合せずに終了
        const ax = x2 - x1;
        const ay = y2 - y1;
        const bx = x3 - x2;
        const by = y3 - y2;
        const det = Util.$cross(ax, ay, bx, by);
        if (Util.$abs(det) < 0.0001) { return; }

        // 分割したベジェ曲線はベベルで結合する
        if (type === 2) {
            this._$addBevelJoinMesh(x2, y2, indexOffset4, indexOffset2, indexOffset3, indexOffset5);
            return;
        }

        // 結合タイプに合わせたメッシュを追加する
        switch (this._$lineJoin) {
            case JointStyle.ROUND:
                this._$addRoundJoinMesh(x2, y2);
                break;
            case JointStyle.MITER:
                this._$addMiterJoinMesh(x2, y2, x1, y1, x3, y3, indexOffset4, indexOffset2, indexOffset3, indexOffset5);
                break;
            default:
                this._$addBevelJoinMesh(x2, y2, indexOffset4, indexOffset2, indexOffset3, indexOffset5);
                break;
        }
    }

    /**
     * @param  {number} x 結合点のx座標
     * @param  {number} y 結合点のy座標
     * @return {void}
     * @method
     * @static
     * @private
     */
    static _$addRoundJoinMesh (x, y)
    {
        const index0 = this._$vertexBufferPos / 7;

        this._$expandIndexBufferIfNeeded(57);
        const ibd = this._$indexBufferData;
        let ibp = this._$indexBufferPos;

        for (let i = 1; i < 18; i++) {
            const indexN = index0 + i;
            ibd[ibp++] = index0;
            ibd[ibp++] = indexN;
            ibd[ibp++] = indexN + 1;
        }
        ibd[ibp++] = index0;
        ibd[ibp++] = index0 + 18;
        ibd[ibp++] = index0 + 1;

        this._$indexBufferPos = ibp;


        this._$expandVertexBufferIfNeeded(133);
        const vbd = this._$vertexBufferData;
        let vbp = this._$vertexBufferPos;

        vbd[vbp++] = x;
        vbd[vbp++] = y;
        vbd[vbp++] = 0;
        vbd[vbp++] = 0;
        vbd[vbp++] = 0;
        vbd[vbp++] = 0;
        vbd[vbp++] = 0;

        for (let i = 0; i < 18; i++) {
            vbd[vbp++] = x;
            vbd[vbp++] = y;
            vbd[vbp++] = 0;
            vbd[vbp++] = 0;
            vbd[vbp++] = 0;
            vbd[vbp++] = 0;
            vbd[vbp++] = 30 + i;
        }

        this._$vertexBufferPos = vbp;
    }

    /**
     * @param  {number} x      結合点のx座標
     * @param  {number} y      結合点のy座標
     * @param  {number} ax     線分Aの始点のx座標
     * @param  {number} ay     線分Aの始点のy座標
     * @param  {number} bx     線分Bの終点のx座標
     * @param  {number} by     線分Bの終点のy座標
     * @param  {number} index1
     * @param  {number} index4
     * @param  {number} index5
     * @param  {number} index8
     * @return {void}
     * @method
     * @static
     * @private
     */
    static _$addMiterJoinMesh (x, y, ax, ay, bx, by, index1, index4, index5, index8)
    {
        const index0 = this._$vertexBufferPos / 7;
        const index2 = index0 + 1;
        const index3 = index0 + 2;
        const index6 = index0 + 3;
        const index7 = index0 + 4;

        this._$expandIndexBufferIfNeeded(18);
        const ibd = this._$indexBufferData;
        let ibp = this._$indexBufferPos;

        ibd[ibp++] = index0;
        ibd[ibp++] = index1;
        ibd[ibp++] = index2;

        ibd[ibp++] = index0;
        ibd[ibp++] = index2;
        ibd[ibp++] = index3;

        ibd[ibp++] = index0;
        ibd[ibp++] = index3;
        ibd[ibp++] = index4;

        ibd[ibp++] = index0;
        ibd[ibp++] = index5;
        ibd[ibp++] = index6;

        ibd[ibp++] = index0;
        ibd[ibp++] = index6;
        ibd[ibp++] = index7;

        ibd[ibp++] = index0;
        ibd[ibp++] = index7;
        ibd[ibp++] = index8;

        this._$indexBufferPos = ibp;


        this._$expandVertexBufferIfNeeded(35);
        const vbd = this._$vertexBufferData;
        let vbp = this._$vertexBufferPos;

        vbd[vbp++] = x;
        vbd[vbp++] = y;
        vbd[vbp++] = ax;
        vbd[vbp++] = ay;
        vbd[vbp++] = bx;
        vbd[vbp++] = by;
        vbd[vbp++] = 0;

        vbd[vbp++] = x;
        vbd[vbp++] = y;
        vbd[vbp++] = ax;
        vbd[vbp++] = ay;
        vbd[vbp++] = bx;
        vbd[vbp++] = by;
        vbd[vbp++] = 21;

        vbd[vbp++] = x;
        vbd[vbp++] = y;
        vbd[vbp++] = ax;
        vbd[vbp++] = ay;
        vbd[vbp++] = bx;
        vbd[vbp++] = by;
        vbd[vbp++] = 22;

        vbd[vbp++] = x;
        vbd[vbp++] = y;
        vbd[vbp++] = ax;
        vbd[vbp++] = ay;
        vbd[vbp++] = bx;
        vbd[vbp++] = by;
        vbd[vbp++] = 23;

        vbd[vbp++] = x;
        vbd[vbp++] = y;
        vbd[vbp++] = ax;
        vbd[vbp++] = ay;
        vbd[vbp++] = bx;
        vbd[vbp++] = by;
        vbd[vbp++] = 24;

        this._$vertexBufferPos = vbp;
    }

    /**
     * @param  {number} x      結合点のx座標
     * @param  {number} y      結合点のy座標
     * @param  {number} index1 
     * @param  {number} index2 
     * @param  {number} index3 
     * @param  {number} index4 
     * @return {void}
     * @method
     * @static
     * @private
     */
    static _$addBevelJoinMesh (x, y, index1, index2, index3, index4)
    {
        const index0 = this._$vertexBufferPos / 7;

        this._$expandIndexBufferIfNeeded(6);
        const ibd = this._$indexBufferData;
        let ibp = this._$indexBufferPos;

        ibd[ibp++] = index0;
        ibd[ibp++] = index1;
        ibd[ibp++] = index2;

        ibd[ibp++] = index0;
        ibd[ibp++] = index3;
        ibd[ibp++] = index4;

        this._$indexBufferPos = ibp;


        this._$expandVertexBufferIfNeeded(7);
        const vbd = this._$vertexBufferData;
        let vbp = this._$vertexBufferPos;

        vbd[vbp++] = x;
        vbd[vbp++] = y;
        vbd[vbp++] = 0;
        vbd[vbp++] = 0;
        vbd[vbp++] = 0;
        vbd[vbp++] = 0;
        vbd[vbp++] = 0;

        this._$vertexBufferPos = vbp;
    }

    /**
     * @param  {number} vertexBeginOffset 結合対象の頂点の範囲（開始）
     * @param  {number} vertexEndOffset   結合対象の頂点の範囲（終了）
     * @return {void}
     * @method
     * @static
     * @private
     */
    static _$generateLineCap (vertexBeginOffset, vertexEndOffset)
    {
        const vbd = this._$vertexBufferData;
        const stx1 = vbd[vertexBeginOffset];
        const sty1 = vbd[vertexBeginOffset + 1];
        const stx2 = vbd[vertexBeginOffset + 2];
        const sty2 = vbd[vertexBeginOffset + 3];
        const edx1 = vbd[vertexEndOffset - 7];
        const edy1 = vbd[vertexEndOffset - 6];
        const edx2 = vbd[vertexEndOffset - 5];
        const edy2 = vbd[vertexEndOffset - 4];

        const indexBeginOffset = vertexBeginOffset / 7;
        const indexEndOffset   = vertexEndOffset / 7;

        // 始点st1と終点ed1が同じなら、線端は追加せずに結合する
        if (stx1 === edx1 && sty1 === edy1) {
            this._$addLineJoinMesh(
                edx2, edy2, stx1, sty1, stx2, sty2,
                indexEndOffset - 2, indexEndOffset - 1,
                indexBeginOffset, indexBeginOffset + 1
            );
            return;
        }

        // 始点の線端を追加する
        this._$addLineCapMesh(stx1, sty1, stx2, sty2, indexBeginOffset, indexBeginOffset + 1);

        // 終点の線端を追加する
        this._$addLineCapMesh(edx1, edy1, edx2, edy2, indexEndOffset - 1, indexEndOffset - 2);
    }

    /**
     * @param  {number} x1     線端のx座標
     * @param  {number} y1     線端のy座標
     * @param  {number} x2     もう一方の端点のx座標
     * @param  {number} y2     もう一方の端点のy座標
     * @param  {number} index1 端点から反時計回り側の頂点インデックス
     * @param  {number} index2 端点から時計回り側の頂点インデックス
     * @return {void}
     * @method
     * @static
     * @private
     */
    static _$addLineCapMesh (x1, y1, x2, y2, index1, index2)
    {
        // 線端タイプに合わせたメッシュを追加する
        switch (this._$lineCap) {
            case CapsStyle.ROUND:
                this._$addRoundJoinMesh(x1, y1);
                break;
            case CapsStyle.SQUARE:
                this._$addSquareCapMesh(x1, y1, x2, y2, index1, index2);
                break;
        }
    }

    /**
     * @param  {number} x1     線端のx座標
     * @param  {number} y1     線端のy座標
     * @param  {number} x2     もう一方の端点のx座標
     * @param  {number} y2     もう一方の端点のy座標
     * @param  {number} index1 端点から反時計回り側の頂点インデックス
     * @param  {number} index2 端点から時計回り側の頂点インデックス
     * @return {void}
     * @method
     * @static
     * @private
     */
    static _$addSquareCapMesh (x1, y1, x2, y2, index1, index2)
    {
        const index3 = this._$vertexBufferPos / 7;
        const index4 = index3 + 1;

        this._$expandIndexBufferIfNeeded(6);
        const ibd = this._$indexBufferData;
        let ibp = this._$indexBufferPos;

        ibd[ibp++] = index1;
        ibd[ibp++] = index3;
        ibd[ibp++] = index4;

        ibd[ibp++] = index4;
        ibd[ibp++] = index2;
        ibd[ibp++] = index1;

        this._$indexBufferPos = ibp;


        this._$expandVertexBufferIfNeeded(14);
        const vbd = this._$vertexBufferData;
        let vbp = this._$vertexBufferPos;

        vbd[vbp++] = x1;
        vbd[vbp++] = y1;
        vbd[vbp++] = x2;
        vbd[vbp++] = y2;
        vbd[vbp++] = -1;
        vbd[vbp++] = -1;
        vbd[vbp++] = 10;

        vbd[vbp++] = x1;
        vbd[vbp++] = y1;
        vbd[vbp++] = x2;
        vbd[vbp++] = y2;
        vbd[vbp++] = 1;
        vbd[vbp++] = 1;
        vbd[vbp++] = 10;

        this._$vertexBufferPos = vbp;
    }
}

/**
 * @class
 */
class CanvasToWebGLShader
{
    /**
     * @param   {WebGLRenderingContext} gl
     * @param   {CanvasToWebGLContext}  context
     * @param   {string} vertex_source
     * @param   {string} fragment_source
     * @constructor
     * @public
     */
    constructor (gl, context, vertex_source, fragment_source)
    {
        this._$gl      = gl;
        this._$context = context;
        this._$program = this._$createProgram(vertex_source, fragment_source);
        this._$uniform = new WebGLShaderUniform(gl, this._$program);
    }

    /**
     * @return {WebGLShaderUniform}
     * @readonly
     * @public
     */
    get uniform ()
    {
        return this._$uniform;
    }

    /**
     * @param  {string} vertex_source
     * @param  {string} fragment_source
     * @return {WebGLProgram}
     * @method
     * @private
     */
    _$createProgram (vertex_source, fragment_source)
    {
        const program = this._$gl.createProgram();

        // control number
        program.id = programId++;

        const vertexShader = this._$gl.createShader(this._$gl.VERTEX_SHADER);
        this._$gl.shaderSource(vertexShader, vertex_source);
        this._$gl.compileShader(vertexShader);

        const fragmentShader = this._$gl.createShader(this._$gl.FRAGMENT_SHADER);
        this._$gl.shaderSource(fragmentShader, fragment_source);
        this._$gl.compileShader(fragmentShader);

        if (!this._$context._$isWebGL2Context) {
            // https://www.khronos.org/registry/OpenGL-Refpages/es2.0/xhtml/glBindAttribLocation.xml
            //
            // It is also permissible to bind a generic attribute index to an attribute variable name that is never used in a vertex shader.
            // 頂点シェーダ内で使用されていない属性変数名を属性インデックスにバインドすることができる。
            //
            // If name was bound previously, that information is lost. Thus you cannot bind one user-defined attribute variable to multiple indices,
            // but you can bind multiple user-defined attribute variables to the same index.
            // 属性変数名を複数のインデックスにバインドすることはできないが、複数の属性変数名を1つのインデックスにバインドすることはできる。

            // 上に引用した仕様により、以下の属性変数名がシェーダに存在しなくても問題なく、
            // また、a_bezier と a_option1 のどちらも 1 にバインドすることも問題ない。

            this._$gl.bindAttribLocation(program, 0, "a_vertex");
            this._$gl.bindAttribLocation(program, 1, "a_bezier");
            this._$gl.bindAttribLocation(program, 1, "a_option1");
            this._$gl.bindAttribLocation(program, 2, "a_option2");
            this._$gl.bindAttribLocation(program, 3, "a_type");
        }

        this._$gl.attachShader(program, vertexShader);
        this._$gl.attachShader(program, fragmentShader);
        this._$gl.linkProgram(program);

        this._$gl.detachShader(program, vertexShader);
        this._$gl.detachShader(program, fragmentShader);

        this._$gl.deleteShader(vertexShader);
        this._$gl.deleteShader(fragmentShader);

        return program;
    }

    /**
     * @return void
     * @private
     */
    _$attachProgram ()
    {
        if (this._$context._$shaderList._$currentProgramId !== this._$program.id) {
            this._$context._$shaderList._$currentProgramId = this._$program.id;
            this._$gl.useProgram(this._$program);
        }
    }

    /**
     * @return void
     * @public
     */
    _$drawImage ()
    {
        if (window.glstats) {
            glstats.ondraw();
        }

        this._$attachProgram();
        this._$uniform.bindUniforms();
        this._$context.vao.bindCommonVertexArray();
        this._$gl.drawArrays(this._$gl.TRIANGLE_STRIP, 0, 4);
    }

    /**
     * @param  {object} object
     * @return void
     * @public
     */
    _$stroke (object)
    {
        if (window.glstats) {
            glstats.ondraw();
        }

        // setup
        this._$attachProgram();

        // set alpha
        this._$context.blend.reset();

        // update data
        this._$uniform.bindUniforms();

        // bind vertex array
        this._$context.vao.bind(object);

        // draw
        this._$gl.drawElements(this._$gl.TRIANGLES, object.indexCount, this._$gl.UNSIGNED_SHORT, 0);
    }

    /**
     * @param  {object} object
     * @return void
     * @public
     */
    _$fill (object)
    {
        if (window.glstats) {
            glstats.ondraw();
        }

        // setup
        this._$attachProgram();

        // set alpha
        this._$context.blend.reset();

        // update data
        this._$uniform.bindUniforms();

        // bind vertex array
        this._$context.vao.bind(object);

        // draw fill
        const range = object.indexRanges[object.indexRanges.length - 1];
        const count = range.first + range.count;
        this._$gl.drawArrays(this._$gl.TRIANGLES, 0, count);
    }

    /**
     * @param {WebGLVertexArrayObjectOES} vertexArray
     * @param {uint} first
     * @param {uint} count
     * @public
     */
    _$containerClip (vertexArray, first, count)
    {
        if (window.glstats) {
            glstats.ondraw();
        }

        // setup
        this._$attachProgram();

        // set alpha
        this._$context.blend.reset();

        // update data
        this._$uniform.bindUniforms();

        // bind vertex array
        this._$context.vao.bind(vertexArray);

        // draw fill
        this._$gl.drawArrays(this._$gl.TRIANGLES, first, count);
    }

    /**
     * @param {WebGLVertexArrayObjectOES} vertexArray
     * @param {uint} first
     * @param {uint} count
     * @public
     */
    _$drawPoints (vertexArray, first, count)
    {
        if (window.glstats) {
            glstats.ondraw();
        }

        // setup
        this._$attachProgram();

        // ここでblendの設定はしない
        // this._$context.blend.reset();

        // update data
        this._$uniform.bindUniforms();

        // bind vertex array
        this._$context.vao.bind(vertexArray);

        // draw fill
        this._$gl.drawArrays(this._$gl.POINTS, first, count);
    }
}

/**
 * @class
 */
class CanvasToWebGLShaderList
{
    /**
     * @param {CanvasToWebGLContext}  context
     * @param {WebGLRenderingContext} gl
     * @constructor
     * @public
     */
    constructor (context, gl)
    {
        const keyword = new WebGLShaderKeyword(gl, context._$isWebGL2Context);
        this._$currentProgramId = -1;

        this._$shapeShaderVariants    = new ShapeShaderVariantCollection(context, gl, keyword);
        this._$bitmapShaderVariants   = new BitmapShaderVariantCollection(context, gl, keyword);
        this._$gradientShaderVariants = new GradientShaderVariantCollection(context, gl, keyword);
        this._$filterShaderVariants   = new FilterShaderVariantCollection(context, gl, keyword);
        this._$blendShaderVariants    = new BlendShaderVariantCollection(context, gl, keyword);

        // BitmapData
        const colorTransform = {
            opaque:      new WebGLShaderProxy(context, gl, keyword, VertexShaderSourceBitmapData.SRC_TEX_COORD, FragmentShaderSourceBitmapData.COLOR_TRANSFORM.bind(null, false)),
            transparent: new WebGLShaderProxy(context, gl, keyword, VertexShaderSourceBitmapData.SRC_TEX_COORD, FragmentShaderSourceBitmapData.COLOR_TRANSFORM.bind(null, true))
        };
        const copyChannel = {
            opaque:      new WebGLShaderProxy(context, gl, keyword, VertexShaderSourceBitmapData.SRC_AND_DST_TEX_COORD, FragmentShaderSourceBitmapData.COPY_CHANNEL.bind(null, false)),
            transparent: new WebGLShaderProxy(context, gl, keyword, VertexShaderSourceBitmapData.SRC_AND_DST_TEX_COORD, FragmentShaderSourceBitmapData.COPY_CHANNEL.bind(null, true))
        };
        const merge = {
            opaque:      new WebGLShaderProxy(context, gl, keyword, VertexShaderSourceBitmapData.SRC_AND_DST_TEX_COORD, FragmentShaderSourceBitmapData.MERGE.bind(null, false)),
            transparent: new WebGLShaderProxy(context, gl, keyword, VertexShaderSourceBitmapData.SRC_AND_DST_TEX_COORD, FragmentShaderSourceBitmapData.MERGE.bind(null, true))
        };
        const paletteMap = {
            opaque:      new WebGLShaderProxy(context, gl, keyword, VertexShaderSourceBitmapData.SRC_TEX_COORD, FragmentShaderSourceBitmapData.PALETTE_MAP.bind(null, false)),
            transparent: new WebGLShaderProxy(context, gl, keyword, VertexShaderSourceBitmapData.SRC_TEX_COORD, FragmentShaderSourceBitmapData.PALETTE_MAP.bind(null, true))
        };
        const pixelDissolve = {
            color: new WebGLShaderProxy(context, gl, keyword, VertexShaderSourceBitmapData.POSITION_ONLY, FragmentShaderSourceBitmapData.FILL_COLOR),
            texture: {
                opaque:      new WebGLShaderProxy(context, gl, keyword, VertexShaderSourceBitmapData.PIXEL_DISSOLVE_TEXTURE, FragmentShaderSourceBitmapData.PIXEL_DISSOLVE_TEXTURE.bind(null, false)),
                transparent: new WebGLShaderProxy(context, gl, keyword, VertexShaderSourceBitmapData.PIXEL_DISSOLVE_TEXTURE, FragmentShaderSourceBitmapData.PIXEL_DISSOLVE_TEXTURE.bind(null, true))
            }
        };
        const copySrcTex = new WebGLShaderProxy(context, gl, keyword, VertexShaderSourceBitmapData.SRC_TEX_COORD, FragmentShaderSourceBitmapData.COPY_SRC_TEX);
        const copyPixels = {
            withAlphaBitmapData: new WebGLShaderProxy(context, gl, keyword, VertexShaderSourceBitmapData.SRC_AND_ALPHA_TEX_COORD, FragmentShaderSourceBitmapData.COPY_PIXELS_WITH_ALPHA_BITMAP_DATA),
            noAlphaBitmapData: copySrcTex
        };
        const fillRect = new WebGLShaderProxy(context, gl, keyword, VertexShaderSourceBitmapData.POSITION_ONLY, FragmentShaderSourceBitmapData.FILL_COLOR);
        const noise = new WebGLShaderProxy(context, gl, keyword, VertexShaderSourceBitmapData.POSITION_ONLY, FragmentShaderSourceBitmapData.NOISE);

        const thresholdBuilder = function(operation) {
            return {
                discardSource: {
                    opaque:      new WebGLShaderProxy(context, gl, keyword, VertexShaderSourceBitmapData.SRC_TEX_COORD, FragmentShaderSourceBitmapData.THRESHOLD.bind(null, operation, false, false)),
                    transparent: new WebGLShaderProxy(context, gl, keyword, VertexShaderSourceBitmapData.SRC_TEX_COORD, FragmentShaderSourceBitmapData.THRESHOLD.bind(null, operation, false, true))
                },
                copySource: {
                    opaque:      new WebGLShaderProxy(context, gl, keyword, VertexShaderSourceBitmapData.SRC_TEX_COORD, FragmentShaderSourceBitmapData.THRESHOLD.bind(null, operation, true, false)),
                    transparent: new WebGLShaderProxy(context, gl, keyword, VertexShaderSourceBitmapData.SRC_TEX_COORD, FragmentShaderSourceBitmapData.THRESHOLD.bind(null, operation, true, true))
                }
            };
        };
        const threshold = {
            less:         thresholdBuilder("less"),
            lessEqual:    thresholdBuilder("lessEqual"),
            greater:      thresholdBuilder("greater"),
            greaterEqual: thresholdBuilder("greaterEqual"),
            equal:        thresholdBuilder("thresholdEqual"),
            notEqual:     thresholdBuilder("thresholdNotEqual"),

            subtotal: new WebGLShaderProxy(context, gl, keyword, VertexShaderSourceBitmapData.SRC_TEX_COORD, FragmentShaderSourceBitmapData.THRESHOLD_SUBTOTAL)
        };

        const getColorBoundsRect = {
            findColor   : new WebGLShaderProxy(context, gl, keyword, VertexShaderSourceBitmapData.SRC_TEX_COORD, FragmentShaderSourceBitmapData.GET_COLOR_BOUNDS_RECT.bind(null, true)),
            findNotColor: new WebGLShaderProxy(context, gl, keyword, VertexShaderSourceBitmapData.SRC_TEX_COORD, FragmentShaderSourceBitmapData.GET_COLOR_BOUNDS_RECT.bind(null, false))
        };

        const getPixels = {
            RGBA: new WebGLShaderProxy(context, gl, keyword, VertexShaderSourceBitmapData.SRC_TEX_COORD, FragmentShaderSourceBitmapData.GET_PIXELS.bind(null, "RGBA")),
            BGRA: new WebGLShaderProxy(context, gl, keyword, VertexShaderSourceBitmapData.SRC_TEX_COORD, FragmentShaderSourceBitmapData.GET_PIXELS.bind(null, "BGRA")),
            ARGB: new WebGLShaderProxy(context, gl, keyword, VertexShaderSourceBitmapData.SRC_TEX_COORD, FragmentShaderSourceBitmapData.GET_PIXELS.bind(null, "ARGB")),
        };
        const setPixels = {
            RGBA: new WebGLShaderProxy(context, gl, keyword, VertexShaderSourceBitmapData.SRC_TEX_COORD, FragmentShaderSourceBitmapData.SET_PIXELS.bind(null, "RGBA")),
            BGRA: new WebGLShaderProxy(context, gl, keyword, VertexShaderSourceBitmapData.SRC_TEX_COORD, FragmentShaderSourceBitmapData.SET_PIXELS.bind(null, "BGRA")),
            ARGB: new WebGLShaderProxy(context, gl, keyword, VertexShaderSourceBitmapData.SRC_TEX_COORD, FragmentShaderSourceBitmapData.SET_PIXELS.bind(null, "ARGB"))
        };
        const setPixelQueue = new WebGLShaderProxy(context, gl, keyword, VertexShaderSourceBitmapData.SET_PIXEL_QUEUE, FragmentShaderSourceBitmapData.SET_PIXEL_QUEUE);

        this._$bitmapData = {
            colorTransform,
            copyChannel,
            merge,
            paletteMap,
            pixelDissolve,
            copyPixels,
            scroll: copySrcTex,
            fillRect,
            noise,
            threshold,
            getColorBoundsRect,
            getPixels,
            setPixels,
            setPixelQueue
        };
    }

    /**
     * @memberof CanvasToWebGLShaderList#
     * @property {ShapeShaderVariantCollection} shapeShaderVariants
     * @return {ShapeShaderVariantCollection}
     * @readonly
     * @public
     */
    get shapeShaderVariants ()
    {
        return this._$shapeShaderVariants;
    }

    /**
     * @memberof CanvasToWebGLShaderList#
     * @property {BitmapShaderVariantCollection} bitmapShaderVariants
     * @return {BitmapShaderVariantCollection}
     * @readonly
     * @public
     */
    get bitmapShaderVariants ()
    {
        return this._$bitmapShaderVariants;
    }

    /**
     * @memberof CanvasToWebGLShaderList#
     * @property {GradientShaderVariantCollection} gradientShaderVariants
     * @return {GradientShaderVariantCollection}
     * @readonly
     * @public
     */
    get gradientShaderVariants ()
    {
        return this._$gradientShaderVariants;
    }

    /**
     * @memberof CanvasToWebGLShaderList#
     * @property {FilterShaderVariantCollection} filterShaderVariants
     * @return {FilterShaderVariantCollection}
     * @readonly
     * @public
     */
    get filterShaderVariants ()
    {
        return this._$filterShaderVariants;
    }

    /**
     * @memberof CanvasToWebGLShaderList#
     * @property {BlendShaderVariantCollection} blendShaderVariants
     * @return {BlendShaderVariantCollection}
     * @readonly
     * @public
     */
    get blendShaderVariants ()
    {
        return this._$blendShaderVariants;
    }
}

/**
 * @class
 */
class WebGLShaderKeyword
{
    /**
     * @param {WebGLRenderingContext} gl
     * @param {boolean} isWebGL2Context
     * @constructor
     * @public
     */
    constructor (gl, isWebGL2Context)
    {
        this._$isWebGL2Context = isWebGL2Context;

        if (!isWebGL2Context) {
            gl.getExtension("OES_standard_derivatives");
        }
    }

    /**
     * @return {string}
     * @method
     * @public
     */
    version ()
    {
        return (this._$isWebGL2Context)
            ? "#version 300 es"
            : "";
    }

    /**
     * @param  {number} index
     * @return {string}
     * @method
     * @public
     */
    attribute (index)
    {
        return (this._$isWebGL2Context)
            ? `layout (location = ${index}) in`
            : "attribute";
    }

    /**
     * @param  {boolean} [centroid=false]
     * @return {string}
     * @method
     * @public
     */
    varyingOut (centroid = false)
    {
        return (this._$isWebGL2Context)
            ? `${(centroid) ? "centroid " : ""}out`
            : "varying";
    }

    /**
     * @param  {boolean} [centroid=false]
     * @return {string}
     * @method
     * @public
     */
    varyingIn (centroid = false)
    {
        return (this._$isWebGL2Context)
            ? `${(centroid) ? "centroid " : ""}in`
            : "varying";
    }

    /**
     * @return {string}
     * @method
     * @public
     */
    outColor ()
    {
        return (this._$isWebGL2Context)
            ? "out vec4 o_color;"
            : "";
    }

    /**
     * @return {string}
     * @method
     * @public
     */
    fragColor ()
    {
        return (this._$isWebGL2Context)
            ? "o_color"
            : "gl_FragColor"
    }

    /**
     * @return {string}
     * @method
     * @public
     */
    texture2D ()
    {
        return (this._$isWebGL2Context)
            ? "texture"
            : "texture2D"
    }

    /**
     * @return {string}
     * @method
     * @public
     */
    extensionDerivatives ()
    {
        return (this._$isWebGL2Context)
            ? ""
            : "#extension GL_OES_standard_derivatives : enable"
    }
}

/**
 * @class
 */
class WebGLShaderProxy
{
    /**
     * @param {CanvasToWebGLContext}  context
     * @param {WebGLRenderingContext} gl
     * @param {WebGLShaderKeyword}    keyword
     * @param {function} vertexSource
     * @param {function} fragmentSource
     * @constructor
     * @public
     */
    constructor (context, gl, keyword, vertexSource, fragmentSource)
    {
        this._$context        = context;
        this._$gl             = gl;
        this._$keyword        = keyword;
        this._$vertexSource   = vertexSource;
        this._$fragmentSource = fragmentSource;
        this._$instance       = null;
    }

    /**
     * @memberof WebGLShaderProxy#
     * @property {CanvasToWebGLShader}
     * @readonly
     * @public
     */
    get instance ()
    {
        if (!this._$instance) {
            this._$instance = new CanvasToWebGLShader(
                this._$gl, this._$context,
                this._$vertexSource(this._$keyword),
                this._$fragmentSource(this._$keyword)
            );
        }
        return this._$instance;
    }
}

/**
 * @class
 */
class WebGLShaderUniform
{
    /**
     * @param {WebGLRenderingContext} gl
     * @param {WebGLProgram}          program
     * @constructor
     * @public
     */
    constructor (gl, program)
    {
        this._$gl     = gl;
        this._$array = [];
        this._$map    = new Map();

        const activeUniforms = this._$gl.getProgramParameter(program, this._$gl.ACTIVE_UNIFORMS);
        for (let i = 0; i < activeUniforms; i++) {
            const info = this._$gl.getActiveUniform(program, i);
            const name = (info.name.endsWith("[0]")) ? info.name.slice(0, -3) : info.name;

            // console.log("info:", info.name, info.type, info.size);

            const data = {};
            const location = this._$gl.getUniformLocation(program, name);

            // WebGLの仕様でuniformのint型のデフォルト値は0に設定されるため、
            // sampler2D（size=1）の値の更新は不要
            if (info.type === this._$gl.SAMPLER_2D && info.size === 1) {
                continue;
            }

            switch (info.type) {
                // uniformの値の設定は、gl.uniform4[fi]v()が最速のため、
                // 可能な限りFloat32Arrayに値をパックして転送するようにする
                case this._$gl.FLOAT_VEC4:
                    data.method = this._$gl.uniform4fv.bind(this._$gl, location);
                    data.array = new Float32Array(4 * info.size);
                    data.assign = -1;
                    break;
                case this._$gl.INT_VEC4:
                    data.method = this._$gl.uniform4iv.bind(this._$gl, location);
                    data.array = new Int32Array(4 * info.size);
                    data.assign = -1;
                    break;
                // uniformの値の設定は、programに保持されるため、 
                // sampler2Dは一度だけ設定するようにする
                case this._$gl.SAMPLER_2D:
                    data.method = this._$gl.uniform1iv.bind(this._$gl, location);
                    data.array = new Int32Array(info.size);
                    data.assign = 1;
                    break;
                case this._$gl.FLOAT:
                case this._$gl.FLOAT_VEC2:
                case this._$gl.FLOAT_VEC3:
                case this._$gl.FLOAT_MAT2:
                case this._$gl.FLOAT_MAT3:
                case this._$gl.FLOAT_MAT4:
                case this._$gl.INT:
                case this._$gl.INT_VEC2:
                case this._$gl.INT_VEC3:
                default:
                    throw new Error("Use gl.FLOAT_VEC4 or gl.INT_VEC4 instead");
            }

            this._$array.push(data);
            this._$map.set(name, data);
        }

        // console.log(this._$map);
        // console.log("------------------");
    }

    /**
     * @param {string} name
     * @method
     * @public
     */
    getArray (name)
    {
        return this._$map.get(name).array;
    }

    /**
     * @memberof WebGLShaderUniform#
     * @property {Int32Array}
     * @return {Int32Array}
     * @readonly
     * @public
     */
    get textures ()
    {
        return this._$map.get("u_textures").array;
    }

    /**
     * @memberof WebGLShaderUniform#
     * @property {Float32Array}
     * @return {Float32Array}
     * @readonly
     * @public
     */
    get highp ()
    {
        return this._$map.get("u_highp").array;
    }

    /**
     * @memberof WebGLShaderUniform#
     * @property {Float32Array}
     * @return {Float32Array}
     * @readonly
     * @public
     */
    get mediump ()
    {
        return this._$map.get("u_mediump").array;
    }

    /**
     * @memberof WebGLShaderUniform#
     * @property {Int32Array}
     * @return {Int32Array}
     * @readonly
     * @public
     */
    get integer ()
    {
        return this._$map.get("u_integer").array;
    }
    
    /**
     * @return {void}
     * @method
     * @public
     */
    bindUniforms ()
    {
        const length = this._$array.length;
        for (let i = 0; i < length; i++) {
            const data = this._$array[i];
            if (data.assign < 0) {
                data.method(data.array);
            } else if (data.assign > 0) {
                data.assign--;
                data.method(data.array);
            }
        }
    }
}

/**
 * @class
 */
class Player
{
    /**
     * @constructor
     * @public
     */
    constructor()
    {
        /**
         * @type {number}
         * @private
         */
        this._$id = Util.$players.length;
        Util.$players.push(this);

        /**
         * @type {Stage}
         * @private
         */
        this._$stage = new Stage();
        this._$stage._$playerId = this._$id;

        /**
         * @type {CacheStore}
         * @private
         */
        this._$cacheStore = new CacheStore();
        this._$cacheStore._$playerId = this._$id;

        /**
         * @type {string}
         * @private
         */
        this._$mode = "loader";

        /**
         * @type {number}
         * @private
         */
        this._$actionOffset = 0;

        /**
         * @type {array}
         * @private
         */
        this._$actions = Util.$getArray();

        /**
         * @type {array}
         * @private
         */
        this._$loaders  = Util.$getArray();

        /**
         * @type {array}
         * @private
         */
        this._$sounds  = Util.$getArray();

        /**
         * @type {object}
         * @private
         */
        this._$hitObject = {
            "x": 0,
            "y": 0,
            "pointer": "",
            "hit": null,
        };

        /**
         * @type {DisplayObject|null}
         * @default null
         * @private
         */
        this._$rollOverObject = null;

        /**
         * @type {DisplayObject|null}
         * @default null
         * @private
         */
        this._$mouseOverTarget = null;

        /**
         * @type {DisplayObject|null}
         * @default null
         * @private
         */
        this._$mouseWheelEvent  = null;

        /**
         * @type {number}
         * @private
         */
        this._$ratio = Util.$devicePixelRatio;

        /**
         * @type {boolean}
         * @default true
         * @private
         */
        this._$stopFlag = true;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$startTime = 0;

        /**
         * @type {number}
         * @default 60
         * @private
         */
        this._$fps = 60;

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$isLoad = false;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$loadStatus = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$width = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$height = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$baseWidth = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$baseHeight = 0;

        /**
         * @type {number}
         * @default 1
         * @private
         */
        this._$scale = 1;

        /**
         * @type {Float32Array}
         * @private
         */
        this._$matrix = Util.$getFloat32Array(1, 0, 0, 1, 0, 0);

        /**
         * @type {string|number}
         * @default transparent
         * @private
         */
        this._$backgroundColor = "transparent";

        /**
         * @type {string}
         * @default up
         * @private
         */
        this._$state = "up";

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$hitTestStart = false;

        /**
         * @type {number}
         * @default -1
         * @private
         */
        this._$stageX = -1;

        /**
         * @type {number}
         * @default -1
         * @private
         */
        this._$stageY = -1;

        /**
         * @type {TextField|null}
         * @default null
         * @private
         */
        this._$textarea = null;

        /**
         * @type {Map}
         * @private
         */
        this._$broadcastEvents = Util.$getMap();


        /**
         * @type {null}
         * @default null
         * @private
         */
        this._$context = null;

        /**
         * @type {null}
         * @default null
         * @private
         */
        this._$canvas = null;

        /**
         * @type {null}
         * @default null
         * @private
         */
        this._$buffer = null;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$optionWidth = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$optionHeight = 0;

        /**
         * @type {string|null}
         * @default null
         * @private
         */
        this._$tagId = null;

        /**
         * @type {string}
         * @default ""
         * @private
         */
        this._$bgcolor = "";

        /**
         * @type {string}
         * @default ""
         * @private
         */
        this._$base = "";

        /**
         * @type {string}
         * @default StageQuality.HIGH
         * @private
         */
        this._$quality = StageQuality.HIGH;

        // delay
        this._$bindRun = this._$run.bind(this);
        this._$timerId = -1;
        this._$loadId  = -1;
    }

    /**
     * @return {Map}
     * @readonly
     * @public
     */
    get broadcastEvents ()
    {
        return this._$broadcastEvents;
    }

    /**
     * @member {string}
     * @default ""
     * @public
     */
    get base ()
    {
        return this._$base;
    }
    set base (base)
    {
        if (typeof base === "string") {

            if (base.indexOf("//") === -1) {

                const urls = base.split("/");
                if (urls[0] === "" || urls[0] === ".") {
                    urls.shift();
                }
                urls.pop();

                this._$base = `${Util.$location.origin}/`;
                if (urls.length) {
                    this._$base += `${urls.join("/")}/`;
                }

            } else {

                const urls = base.split("?")[0].split("/");
                urls.pop();

                this._$base = `${urls.join("/")}/`;

            }
        }
    }

    /**
     * @return {Stage}
     * @readonly
     * @public
     */
    get stage ()
    {
        return this._$stage;
    }

    /**
     * @return {string}
     * @readonly
     * @public
     */
    get contentElementId ()
    {
        return `${Util.$PREFIX}${this._$id}`;
    }

    /**
     * @member {number}
     * @public
     */
    get width ()
    {
        return this._$baseWidth;
    }
    set width (width)
    {
        this._$baseWidth = width|0;
    }

    /**
     * @member {number}
     * @public
     */
    get height ()
    {
        return this._$baseHeight;
    }
    set height (height)
    {
        this._$baseHeight = height|0;
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    play ()
    {
        if (this._$stopFlag) {

            this._$stopFlag = false;

            if (this._$timerId > -1) {
                const clearTimer = Util.$cancelAnimationFrame;
                clearTimer(this._$timerId);
            }

            this._$startTime = Util.$performance.now();

            this._$fps = 1000 / this._$stage._$frameRate;

            const timer = Util.$requestAnimationFrame;
            this._$timerId = timer(this._$bindRun);
        }
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    stop ()
    {
        const clearTimer = Util.$cancelAnimationFrame;
        clearTimer(this._$timerId);

        this._$stopFlag = true;
        this._$timerId  = -1;
    }

    /**
     * @param  {object} [options=null]
     * @return {void}
     * @public
     */
    setOptions (options = null)
    {
        if (options) {
            this._$optionWidth  = options.width   || this._$optionWidth;
            this._$optionHeight = options.height  || this._$optionHeight;
            this._$tagId        = options.tagId   || this._$tagId;
            this._$bgcolor      = options.bgcolor || this._$bgcolor;
            this.base           = options.base    || this._$base;
        }

        this._$initialize();
    }

    /**
     * @return {void}
     * @method
     * @private
     */
    _$updateLoadStatus ()
    {
        switch (this._$loadStatus) {

            case 2: // end load
                {
                    this._$resize();
                    this._$loadStatus = 3;
                    const timer = Util.$requestAnimationFrame;
                    this._$loadId = timer(this._$updateLoadStatus.bind(this));
                }
                break;

            case 3: // end parse
                this._$loaded();
                break;

            default:
                {
                    const timer = Util.$requestAnimationFrame;
                    this._$loadId = timer(this._$updateLoadStatus.bind(this));
                }
                break;

        }
    }

    /**
     * @return {void}
     * @method
     * @private
     */
    _$loaded ()
    {
        this._$loadStatus = 4;

        // set current player id
        Util.$currentPlayerId = this._$id;

        const element = Util.$document.getElementById(this.contentElementId);
        if (element) {

            // set backgroundColor
            if (this._$bgcolor) {
                this._$backgroundColor = this._$bgcolor;
            }

            // background color
            switch (this._$backgroundColor) {

                case "transparent":
                case false:
                    this._$context._$setColor(0, 0, 0, 0);
                    break;

                default:
                    this._$context._$setColor(
                        this._$backgroundColor[0],
                        this._$backgroundColor[1],
                        this._$backgroundColor[2],
                        this._$backgroundColor[3]
                    );
                    break;

            }


            // DOM
            this._$deleteNode();

            // append canvas
            element.appendChild(this._$canvas);


            // start
            this.play();


            // stage init action
            this._$stage._$prepareActions();


            // constructed event
            if (this._$broadcastEvents.has(Event.FRAME_CONSTRUCTED)) {
                this._$dispatchEvent(new Event(Event.FRAME_CONSTRUCTED));
            }


            // frame1 action
            this._$doAction();


            // exit event
            if (this._$broadcastEvents.has(Event.EXIT_FRAME)) {
                this._$dispatchEvent(new Event(Event.EXIT_FRAME));
            }


            // loader events
            const length = this._$loaders.length|0;
            for (let idx = 0; idx < length; ++idx) {

                const loader = this._$loaders.shift();

                // unlock
                if (loader instanceof LoaderInfo) {
                    loader._$lock = false;
                }

                // init event
                if (loader.hasEventListener(Event.INIT)) {
                    loader.dispatchEvent(new Event(Event.INIT));
                }

                // complete event
                if (loader.hasEventListener(Event.COMPLETE)) {
                    loader.dispatchEvent(new Event(Event.COMPLETE));
                }

                // reset scope player
                loader._$player = null;
            }


            // activate event
            if (this._$broadcastEvents.has(Event.ACTIVATE)) {
                this._$dispatchEvent(new Event(Event.ACTIVATE));
            }




            // frame action
            this._$doAction();


            // render
            this._$draw(0);



        }

    }

    /**
     * @return {void}
     * @method
     * @private
     */
    _$initialize ()
    {
        const doc = Util.$document;
        if (doc.readyState === "loading") {

            const initialize = function (event)
            {
                event.target.removeEventListener("DOMContentLoaded", initialize);
                this._$initialize();

            }.bind(this);

            Util.$window.addEventListener("DOMContentLoaded", initialize);

            return ;
        }

        const contentElementId = this.contentElementId;
        switch (true) {

            case this._$tagId === null:
                doc
                    .body
                    .insertAdjacentHTML(
                        "beforeend", `<div id="${contentElementId}"></div>`
                    );
                break;

            default:

                const container = doc.getElementById(this._$tagId);
                if (!container) {
                    alert("Not Found Tag ID:" + this._$tagId);
                    return ;
                }

                const div = doc.getElementById(contentElementId);
                switch (true) {

                    case (div === null):
                        const element    = doc.createElement("div");
                        element.id       = contentElementId;
                        element.tabIndex = -1;
                        container.appendChild(element);
                        break;

                    default:
                        this._$deleteNode();
                        break;

                }
                break;

        }


        if (!this._$canvas) {
            this._$initializeCanvas();
        }


        const element = doc.getElementById(contentElementId);
        const parent = element.parentNode;
        if (parent) {

            this._$initStyle(element);
            this._$buildWait();

            const width  = this._$optionWidth
                ? this._$optionWidth
                : (parent.tagName === "BODY")
                    ? Util.$window.innerWidth
                    : parent.offsetWidth;

            const height = this._$optionHeight
                ? this._$optionHeight
                : (parent.tagName === "BODY")
                    ? Util.$window.innerHeight
                    : parent.offsetHeight;

            // set center
            if (width && height) {
                this._$baseWidth  = width;
                this._$baseHeight = height;
                this._$resize();
            }
        }

        if (this._$mode === "loader") {
            this._$loadStatus++;
            this._$updateLoadStatus();
        } else {
            this._$resize();
            this._$loaded();
        }
    }

    /**
     * @param   {object} element
     * @returns {void}
     * @method
     * @private
     */
    _$initStyle (element)
    {
        const style = element.style;

        // set css
        style.position        = "relative";
        style.top             = "0";
        style.left            = "0";
        style.backgroundColor = "transparent";
        style.overflow        = "hidden";
        style.padding         = "0";
        style.margin          = "0";
        style.userSelect      = "none";
        style.outline         = "none";

        const width  = this._$optionWidth;
        const height = this._$optionHeight;

        const parent = element.parentNode;
        if (parent.tagName === "BODY") {
            style.width  = (width)  ? `${width}px`  : `${window.innerWidth}px`;
            style.height = (height) ? `${height}px` : `${window.innerHeight}px`;
            return ;
        }

        style.width  = (width)  ? `${width}px`  : `${parent.offsetWidth}px`;
        style.height = (height) ? `${height}px` : `${parent.offsetHeight}px`;
    }

    /**
     * @return {void}
     * @method
     * @private
     */
    _$buildWait ()
    {
        const element = Util.$document.getElementById(this.contentElementId);
        if (element) {

            const loadingId = `${this.contentElementId}_loading`;

            element.innerHTML = `<style>
#${loadingId} {
    position: absolute;
    top: 50%;
    left: 50%;
    margin: -24px 0 0 -24px;
    width: 50px;
    height: 50px;
    border-radius: 50px;
    border: 8px solid #dcdcdc;
    border-right-color: transparent;
    box-sizing: border-box;
    animation: ${loadingId} 0.8s infinite linear;
}
@keyframes ${loadingId} {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
</style>`;

            const div = Util.$document.createElement("div");
            div.id    = loadingId;

            element.appendChild(div);
        }
    }

    /**
     * @returns {void}
     * @method
     * @private
     */
    _$deleteNode ()
    {
        const element = Util.$document.getElementById(this.contentElementId);
        if (element) {
            while (element.childNodes.length) {
                element.removeChild(element.childNodes[0]);
            }
        }
    }

    /**
     * @return {void}
     * @private
     */
    _$initializeCanvas ()
    {
        // main canvas
        const canvas  = Util.$document.createElement("canvas");
        canvas.width  = 1;
        canvas.height = 1;
        this._$canvas = canvas;


        // create gl context
        const option = {
            "stencil": true,
            "premultipliedAlpha": true,
            "antialias": false,
            "depth": false
        };


        let isWebGL2Context = true;

        let gl = canvas.getContext("webgl2", option);
        if (!gl) {
            gl = canvas.getContext("webgl", option)
                || canvas.getContext("experimental-webgl", option);
            isWebGL2Context = false;
        }

        if (!gl) {
            alert("WebGLに関するエラーが発生しました\nブラウザを再起動してください");
            throw new Error("WebGL setting is off. Please turn the setting on.");
        }


        this._$context = new CanvasToWebGLContext(gl, isWebGL2Context);


        if (window.glstats) {
            glstats.init(gl, isWebGL2Context, Util.$isChrome, Util.$isFireFox);
        }


        // set event
        switch (true) {

            case Util.$isTouch:

                const loadSpAudio = function ()
                {
                    this.removeEventListener(Util.$TOUCH_END, loadSpAudio);
                    Util.$loadAudioData();
                };

                // audio context load event
                canvas.addEventListener(Util.$TOUCH_END, loadSpAudio);

                // touch event
                canvas.addEventListener(Util.$TOUCH_START, function (event)
                {
                    Util.$event     = event;
                    Util.$eventType = Util.$TOUCH_START;

                    this._$hitTest();
                }.bind(this));

                canvas.addEventListener(Util.$TOUCH_MOVE, function (event)
                {
                    Util.$event     = event;
                    Util.$eventType = Util.$TOUCH_MOVE;

                    this._$hitTest();
                }.bind(this));

                canvas.addEventListener(Util.$TOUCH_END, function (event)
                {
                    Util.$event     = event;
                    Util.$eventType = Util.$TOUCH_END;

                    this._$hitTest();
                }.bind(this));
                break;

            default:

                const loadWebAudio = function (event)
                {
                    event.target.removeEventListener(Util.$MOUSE_UP, loadWebAudio);
                    Util.$loadAudioData();
                };

                // audio context load event
                canvas.addEventListener(Util.$MOUSE_UP, loadWebAudio);

                // mouse event
                canvas.addEventListener(Util.$MOUSE_DOWN, function (event)
                {
                    Util.$event     = event;
                    Util.$eventType = Util.$MOUSE_DOWN;

                    if (!event.button) {
                        this._$hitTest();
                    }
                }.bind(this));

                canvas.addEventListener(Util.$DOUBLE_CLICK, function (event)
                {
                    Util.$event     = event;
                    Util.$eventType = Util.$DOUBLE_CLICK;

                    if (!event.button) {
                        this._$hitTest();
                    }
                }.bind(this));

                canvas.addEventListener(Util.$MOUSE_LEAVE, function (event)
                {
                    Util.$event     = event;
                    Util.$eventType = Util.$MOUSE_LEAVE;

                    this._$hitTest();

                    Util.$event = null;
                    this._$stageX = -1;
                    this._$stageY = -1;
                }.bind(this));

                canvas.addEventListener(Util.$MOUSE_UP, function (event)
                {
                    Util.$event     = event;
                    Util.$eventType = Util.$MOUSE_UP;

                    if (!event.button) {
                        this._$hitTest();
                    }
                }.bind(this));

                canvas.addEventListener(Util.$MOUSE_MOVE, function (event)
                {
                    Util.$event     = event;
                    Util.$eventType = Util.$MOUSE_MOVE;

                    this._$hitTest();
                }.bind(this));

                // mouse wheel
                canvas.addEventListener(Util.$MOUSE_WHEEL, function (event)
                {
                    this._$mouseWheelEvent = event;
                }.bind(this));

                break;

        }

        // set css
        const style = canvas.style;
        style.position                = "absolute";
        style.top                     = "0";
        style.left                    = "0";
        style.webkitTapHighlightColor = "rgba(0,0,0,0)";
        style.backfaceVisibility      = "hidden";
        style.transformOrigin         = "0 0";
        if (Util.$devicePixelRatio !== 1) {
            style.transform = `scale(${1 / Util.$devicePixelRatio})`;
        }

    }

    /**
     * @return {void}
     * @method
     * @private
     */
    _$resize ()
    {
        const div = Util.$document.getElementById(this.contentElementId);
        if (div) {

            const parent  = div.parentNode;

            const innerWidth = this._$optionWidth
                ? this._$optionWidth : (parent.tagName === "BODY")
                    ? Util.$window.innerWidth
                    : parent.offsetWidth;

            const innerHeight = this._$optionHeight
                ? this._$optionHeight : (parent.tagName === "BODY")
                    ? Util.$window.innerHeight
                    : parent.offsetHeight;

            const screenWidth = (parent.tagName === "BODY")
                ? Util.$window.innerWidth
                : parent.offsetWidth;


            const scale = Util.$min(
                (innerWidth / this._$baseWidth),
                (innerHeight / this._$baseHeight)
            );

            let width  = (this._$baseWidth  * scale)|0;
            let height = (this._$baseHeight * scale)|0;

            // div
            const style  = div.style;
            style.width  = `${width}px`;
            style.height = `${height}px`;
            style.top    = "0";
            style.left   = `${(screenWidth / 2) - (width / 2)}px`;

            if (width !== (this._$width / this._$ratio)
                || height !== (this._$height / this._$ratio)
            ) {

                width  = (width  * Util.$devicePixelRatio)|0;
                height = (height * Util.$devicePixelRatio)|0;

                // params
                this._$scale  = scale;
                this._$width  = width;
                this._$height = height;

                // main
                this._$canvas.width  = width;
                this._$canvas.height = height;
                this._$context._$gl.viewport(0, 0, width, height);

                this._$canvas.style.transform = (this._$ratio === 1 && Util.$devicePixelRatio === 1)
                    ? ""
                    : `scale(${1 / this._$ratio})`;

                // stage buffer
                if (this._$context) { // unit test

                    const manager = this._$context._$frameBufferManager;
                    if (this._$buffer) {
                        manager.unbind();
                        manager.releaseAttachment(this._$buffer, true);
                    }


                    this._$buffer = manager
                        .createCacheAttachment(width, height, false);

                    // update cache max size
                    manager._$stencilBufferPool._$maxWidth  = width;
                    manager._$stencilBufferPool._$maxHeight = height;
                    manager._$textureManager._$maxWidth     = width;
                    manager._$textureManager._$maxHeight    = height;
                }

                const mScale = this._$scale * this._$ratio / 20;
                this._$matrix[0] = mScale;
                this._$matrix[3] = mScale;

                // cache reset
                this._$cacheStore.reset();
            }
        }
    }

    /**
     * @return {uint}
     * @method
     * @public
     */
    getSamples ()
    {
        switch (this._$quality) {

            case StageQuality.HIGH:
                return Util.$HIGH_SAMPLES;

            case StageQuality.MEDIUM:
                return Util.$MEDIUM_SAMPLES;

            default:
                return Util.$LOW_SAMPLES;

        }
    }

    /**
     * @param  {Event} event
     * @return {boolean}
     * @method
     * @private
     */
    _$dispatchEvent (event)
    {
        if (this._$broadcastEvents.size
            && this._$broadcastEvents.has(event.type)
        ) {

            // clone
            const events = this
                ._$broadcastEvents
                .get(event.type)
                .slice(0);

            // start target
            event._$eventPhase = EventPhase.AT_TARGET;

            const length = events.length;
            for (let idx = 0; idx < length; ++idx) {

                const obj = events[idx];

                // event execute
                event._$currentTarget = obj.target;
                obj.listener.call(Util.$window, event);

                if (event._$stopImmediatePropagation) {
                    break;
                }

            }

            Util.$poolArray(events);

            return true;

        }
    }

    /**
     * @return void
     * @public
     */
    _$wheelEvent ()
    {
        const event = this._$mouseWheelEvent;
        if (event) {

            if (!event.defaultPrevented) {

                Util.$event     = event;
                Util.$eventType = Util.$MOUSE_WHEEL;

                this._$hitTest();
            }

            this._$mouseWheelEvent = null;
        }
    }

    /**
     * @param  {number} timestamp
     * @return {void}
     * @method
     * @private
     */
    _$run (timestamp = 0)
    {
        if (this._$stopFlag) {
            return ;
        }

        if (window.stats) {
            stats.begin();
        }

        if (window.glstats) {
            glstats.begin();
        }




        // set current player id
        Util.$currentPlayerId = this._$id;

        this._$wheelEvent();

        // delay action
        this._$doAction();

        let delta = timestamp - this._$startTime;
        if (delta > this._$fps) {

            // update
            this._$startTime = timestamp - (delta % this._$fps);

            // execute
            this._$action();
            this._$draw(0);

            // draw event
            if (!this._$hitTestStart 
                && this._$state === "up" && Util.$event
                && this._$stageX > -1 && this._$stageY > -1
            ) {
                this._$pointerCheck();
            }
        }




        if (window.stats) {
            stats.end();
        }

        if (window.glstats) {
            glstats.end();
        }


        // next frame
        const timer = Util.$requestAnimationFrame;
        this._$timerId = timer(this._$bindRun);
    }

    /**
     * @return {void}
     * @method
     * @private
     */
    _$pointerCheck ()
    {
        const stageX = this._$stageX;
        const stageY = this._$stageY;

        // setup
        this._$hitObject.x       = stageX;
        this._$hitObject.y       = stageY;
        this._$hitObject.pointer = "";
        this._$hitObject.hit     = null;

        // reset
        Util.$hitContext.setTransform(1, 0, 0, 1, 0, 0);
        Util.$hitContext.beginPath();

        // hit test
        this._$stage._$mouseHit(
            Util.$hitContext, Util.$MATRIX_ARRAY_20_0_0_20_0_0_INVERSE,
            this._$hitObject, true
        );


        // change state
        // params
        let instance       = null;
        let target         = null;
        let canPointerText = false;
        let canPointer     = false;

        // execute
        if (this._$hitObject.hit) {

            instance = this._$hitObject.hit;


            // (1) mouseOut
            if (this._$mouseOverTarget
                && this._$mouseOverTarget !== instance
            ) {

                const outInstance = this._$mouseOverTarget;

                if (outInstance.willTrigger(MouseEvent.MOUSE_OUT)) {
                    outInstance.dispatchEvent(new MouseEvent(
                        MouseEvent.MOUSE_OUT, true, false,
                        outInstance.mouseX, outInstance.mouseY,
                    ));
                }


                if (outInstance instanceof SimpleButton
                    && outInstance._$status === "over"
                ) {

                    outInstance._$changeState("up");
                }

            }


            // rollOut and rollOver
            if (this._$rollOverObject !== instance) {

                let hitParent = null;
                if (this._$rollOverObject) {

                    // (2) prev object rollOut
                    target = this._$rollOverObject;

                    if (target.willTrigger(MouseEvent.ROLL_OUT)) {
                        target.dispatchEvent(new MouseEvent(
                            MouseEvent.ROLL_OUT, false, false,
                            target.mouseX, target.mouseY
                        ));
                    }

                    // rollOver flag instance
                    hitParent = target._$parent;
                    while (hitParent && hitParent._$root !== hitParent) {

                        if (hitParent === instance) {
                            break;
                        }

                        if (hitParent._$mouseEnabled
                            && hitParent._$outCheck(stageX, stageY)
                        ) {

                            let isUpperLayer = false;
                            let check = instance;
                            while (check && check._$root !== check) {

                                if (check !== hitParent) {
                                    check = check._$parent;
                                    continue;
                                }

                                isUpperLayer = true;

                                break;
                            }

                            if (!isUpperLayer && hitParent._$parent === instance._$parent
                                && hitParent._$index > instance._$index
                            ) {
                                isUpperLayer = true;
                            }

                            if (isUpperLayer) {
                                break;
                            }

                        }

                        if (hitParent.willTrigger(MouseEvent.ROLL_OUT)) {
                            hitParent.dispatchEvent(new MouseEvent(
                                MouseEvent.ROLL_OUT, false, false,
                                hitParent.mouseX, hitParent.mouseY
                            ));
                        }

                        hitParent = hitParent._$parent;

                    }
                }


                // (3) current object rollOver
                target = instance;
                while (true) {

                    if (target.willTrigger(MouseEvent.ROLL_OVER)) {
                        target.dispatchEvent(new MouseEvent(
                            MouseEvent.ROLL_OVER, false, false,
                            target.mouseX, target.mouseY
                        ));
                    }

                    target = target._$parent;
                    if (!target || target === hitParent
                        || target.stage === target
                    ) {
                        break;
                    }

                }

            }

            this._$rollOverObject = instance;


            // (4) mouseOver
            switch (true) {

                case this._$mouseOverTarget === null:
                case this._$mouseOverTarget !== instance:

                    if (instance.willTrigger(MouseEvent.MOUSE_OVER)) {
                        instance.dispatchEvent(new MouseEvent(
                            MouseEvent.MOUSE_OVER, true, false,
                            instance.mouseX, instance.mouseY
                        ));
                    }

                    // set target
                    this._$mouseOverTarget = instance;
                    break;

            }


            // (5) over button
            if (instance instanceof SimpleButton
                && instance._$status !== "over"
            ) {

                instance._$changeState("over");

            }


            // click reset
            if (this._$state === "up") {
                this._$clickTarget = null;
            }


            // PC
            if (!Util.$isTouch && this._$state === "up") {

                let done = false;
                target = instance;
                while (target && target.root !== target) {

                    switch (true) {

                        case (target instanceof TextField):
                            if (target.type === TextFieldType.INPUT && target.selectable) {
                                canPointerText = true;
                            }

                            done = true;
                            break;

                        case target instanceof SimpleButton:
                        case target.buttonMode:
                            canPointer = true;
                            break;

                    }

                    if (done || canPointerText || canPointer) {
                        break;
                    }

                    target = target._$parent;

                }

            }

        } else {

            // (1) mouseOut
            if (this._$mouseOverTarget) {

                instance = this._$mouseOverTarget;

                if (instance.willTrigger(MouseEvent.MOUSE_OUT)) {
                    instance.dispatchEvent(new MouseEvent(
                        MouseEvent.MOUSE_OUT, true, false,
                        instance.mouseX, instance.mouseY
                    ));
                }
            }


            // (2) rollOut
            if (this._$rollOverObject) {

                target = this._$rollOverObject;

                // parent target
                while (target && target.root !== target) {

                    if (target.willTrigger(MouseEvent.ROLL_OUT)) {
                        target.dispatchEvent(new MouseEvent(
                            MouseEvent.ROLL_OUT, false, false,
                            target.mouseX, target.mouseY
                        ));
                    }

                    target = target._$parent;

                }

            }

            // reset
            this._$rollOverObject  = null;
            this._$mouseOverTarget = null;
        }


        // change cursor
        switch (true) {

            case canPointerText:
                this._$canvas.style.cursor = "text";
                break;

            case canPointer:
                this._$canvas.style.cursor = "pointer";
                break;

            case !Util.$isTouch && this._$state === "up":
                this._$canvas.style.cursor = "auto";
                break;

        }


        if (this._$actions.length > 1) {
            this._$doAction();
        }
    }

    /**
     * @return {void}
     * @method
     * @private
     */
    _$action ()
    {

        if (this._$stopFlag) {
            return ;
        }

        // move frame and construct action
        const loaders = this._$loaders.slice(0);

        // array reset
        this._$loaders.length = 0;

        let length = loaders.length;
        for (let idx = 0; idx < length; ++idx) {

            const loader = loaders[idx];

            // first action
            if ("content" in loader) {
                loader.content._$prepareActions();
            }
        }
        this._$stage._$nextFrame();


        // enter frame event
        if (this._$broadcastEvents.has(Event.ENTER_FRAME)) {
            this._$dispatchEvent(new Event(Event.ENTER_FRAME));
        }

        // constructed event
        if (this._$broadcastEvents.has(Event.FRAME_CONSTRUCTED)) {
            this._$dispatchEvent(new Event(Event.FRAME_CONSTRUCTED));
        }


        // execute frame action
        this._$doAction();


        // exit event
        if (this._$broadcastEvents.has(Event.EXIT_FRAME)) {
            this._$dispatchEvent(new Event(Event.EXIT_FRAME));
        }

        // render event
        if (this._$stage._$invalidate) {

            // reset
            this._$stage._$invalidate = false;

            // execute render event
            this._$dispatchEvent(new Event(Event.RENDER));

        }


        // loader events
        length = loaders.length;
        for (let idx = 0; idx < length; ++idx) {

            const loader = loaders[idx];

            // unlock
            if (loader instanceof LoaderInfo) {
                loader._$lock = false;
            }

            // init event
            if (loader.hasEventListener(Event.INIT)) {
                loader.dispatchEvent(new Event(Event.INIT));
            }

            // complete event
            if (loader.hasEventListener(Event.COMPLETE)) {
                loader.dispatchEvent(new Event(Event.COMPLETE));
            }

            // remove scope player
            loader._$player = null;
        }

        Util.$poolArray(loaders);

        // execute frame action
        this._$doAction();
    };

    /**
     * @param {number} [timestamp=0]
     * @returns void
     * @public
     */
    _$draw (timestamp = 0)
    {
        const canvas  = this._$canvas;
        const width   = canvas.width;
        const height  = canvas.height;
        const context = this._$context;

        if (context && width > 0 && height > 0) {

            context._$bind(this._$buffer);

            // pre draw
            Util.$resetContext(context);
            context.setTransform(1, 0, 0, 1, 0, 0);
            context.clearRect(0, 0, width, height);

            // draw
            context.beginPath();

            this
                ._$stage
                ._$draw(
                    context,
                    this._$matrix,
                    Util.$COLOR_ARRAY_IDENTITY,
                    false
                );

            // stage end
            this._$stage._$updated = false;


            // start sound
            while (this._$sounds.length) {
                this._$sounds.pop()._$soundPlay();
            }

            const bufferTexture = context
                .frameBuffer
                .getTextureFromCurrentAttachment();

            context.frameBuffer.unbind();

            // reset and draw to canvas
            Util.$resetContext(context);
            context.setTransform(1, 0, 0, 1, 0, 0);
            context.clearRect(0, 0, width, height);
            context.drawImage(bufferTexture, 0, 0, width, height);

            context._$bind(this._$buffer);
        }

    }

    /**
     * @return {void}
     * @method
     * @private
     */
    _$doAction ()
    {
        while (this._$actions.length) {

            Util.$actionProcess = true;

            // target object
            const mc = this._$actions.pop();
            mc._$canAction    = false;
            mc._$actionOffset = 0;
            mc._$actionLimit  = 0;

            const frame = mc._$currentFrame;
            if (!mc._$actions.has(frame)) {
                continue;
            }

            mc._$actionProcess = true;
            const actions = mc._$actions.get(frame);
            const length  = actions.length;
            for (let idx = 0; idx < length; ++idx) {
                actions[idx].apply(mc);
            }
            mc._$actionProcess = false;


            // adjustment
            if (mc._$frameCache.size) {
                mc._$currentFrame = mc._$frameCache.get("nextFrame");
                mc._$clearChildren();

                mc._$stopFlag  = mc._$frameCache.get("stopFlag");
                mc._$isPlaying = mc._$frameCache.get("isPlaying");
                mc._$frameCache.clear();
            }

        }
        Util.$actionProcess = false;
    }

    /**
     * @return {void}
     * @method
     * @private
     */
    _$hitTest ()
    {

        if (this._$stopFlag) {
            return ;
        }

        // update flags
        this._$hitTestStart = true;
        Util.$isUpdated     = false;


        // setup
        const event = Util.$event;

        // set current player id
        const cachePlayerId   = Util.$currentPlayerId;
        Util.$currentPlayerId = this._$id;

        // params
        let instance  = null;
        let target    = null;
        let textField = null;


        let x = Util.$window.pageXOffset;
        let y = Util.$window.pageYOffset;

        const div = Util.$document.getElementById(this.contentElementId);
        if (div) {
            const rect = div.getBoundingClientRect();
            x += rect.left;
            y += rect.top;
        }

        let stageX = 0;
        let stageY = 0;

        if (Util.$isTouch) {
            const changedTouche = event.changedTouches[0];
            stageX = changedTouche.pageX;
            stageY = changedTouche.pageY;
        } else {
            stageX = event.pageX;
            stageY = event.pageY;
        }

        // drop point
        stageX = (stageX - x) / this._$scale;
        stageY = (stageY - y) / this._$scale;

        // update
        event._$stageX = stageX;
        event._$stageY = stageY;
        this._$stageX  = stageX;
        this._$stageY  = stageY;

        // setup
        this._$hitObject.x = stageX;
        this._$hitObject.y = stageY;
        this._$hitObject.pointer = "";
        this._$hitObject.hit = null;

        // reset
        Util.$hitContext.setTransform(1, 0, 0, 1, 0, 0);
        Util.$hitContext.beginPath();


        // hit test
        this._$stage._$mouseHit(
            Util.$hitContext, Util.$MATRIX_ARRAY_20_0_0_20_0_0_INVERSE,
            this._$hitObject, true
        );


        // change state
        let canPointerText = false;
        let staticPointer  = false;
        let canPointer     = false;
        switch (Util.$eventType) {

            case Util.$TOUCH_MOVE:
            case Util.$MOUSE_MOVE:

                if (Util.$dropTarget) {

                    const point = Util.$dropTarget._$dragMousePoint();

                    let dragX = point.x;
                    let dragY = point.y;

                    if (!Util.$dragRules.lock) {
                        dragX += Util.$dragRules.position.x;
                        dragY += Util.$dragRules.position.y;
                    }

                    const bounds = Util.$dragRules.bounds;
                    if (bounds) {

                        dragX = Util.$clamp(dragX, bounds.left, bounds.right);
                        dragY = Util.$clamp(dragY, bounds.top,  bounds.bottom);

                    }

                    // set move xy
                    Util.$dropTarget.x = dragX;
                    Util.$dropTarget.y = dragY;

                }

                break;

            case Util.$TOUCH_START:
            case Util.$MOUSE_DOWN:
                this._$state  = "down";
                canPointer    = (this._$canvas.style.cursor === "pointer");
                staticPointer = true;
                break;

            case Util.$TOUCH_END:
            case Util.$MOUSE_UP:
            case Util.$DOUBLE_CLICK:
                this._$state = "up";
                break;

        }


        // execute
        switch (true) {

            case this._$hitObject.hit === null:
            case Util.$eventType === Util.$MOUSE_LEAVE:

                // (1) mouseOut
                if (this._$mouseOverTarget) {

                    instance = this._$mouseOverTarget;
                    if (instance.willTrigger(MouseEvent.MOUSE_OUT)) {
                        instance.dispatchEvent(new MouseEvent(
                            MouseEvent.MOUSE_OUT, true, false,
                            instance.mouseX, instance.mouseY
                        ));
                    }

                    if (instance instanceof SimpleButton
                        && instance._$status === "over"
                    ) {

                        instance._$changeState("up");
                    }
                }


                // (2) rollOut
                if (this._$rollOverObject) {

                    target = this._$rollOverObject;

                    // parent target
                    while (target && target.root !== target) {

                        if (target.willTrigger(MouseEvent.ROLL_OUT)) {
                            target.dispatchEvent(new MouseEvent(
                                MouseEvent.ROLL_OUT, false, false,
                                target.mouseX, target.mouseY
                            ));
                        }

                        target = target._$parent;

                    }

                }


                // reset
                this._$rollOverObject  = null;
                this._$mouseOverTarget = null;


                // stage event
                switch (Util.$eventType) {

                    case Util.$MOUSE_WHEEL:
                        if (this._$stage.hasEventListener(MouseEvent.MOUSE_WHEEL)) {

                            this._$stage.dispatchEvent(new MouseEvent(
                                MouseEvent.MOUSE_WHEEL, true, false,
                                this._$stage.mouseX, this._$stage.mouseY
                            ));

                        }
                        break;

                    case Util.$TOUCH_START:
                    case Util.$MOUSE_DOWN:
                        if (this._$stage.hasEventListener(MouseEvent.MOUSE_DOWN)) {
                            this._$stage.dispatchEvent(new MouseEvent(
                                MouseEvent.MOUSE_DOWN, true, false,
                                this._$stage.mouseX, this._$stage.mouseY
                            ));
                        }
                        break;

                    case Util.$TOUCH_END:
                    case Util.$MOUSE_UP:

                        // active textarea
                        if (this._$textarea) {

                            textField = this._$textarea._$instance;

                            // execute
                            this._$textarea.dispatchEvent(
                                new Util.$window.Event("swf2js_blur")
                            );

                            // focus out event
                            if (textField.willTrigger(FocusEvent.FOCUS_OUT)) {
                                textField.dispatchEvent(new FocusEvent(
                                    FocusEvent.FOCUS_OUT, true
                                ));
                            }

                            // clear
                            this._$textarea  = null;
                            this.stage.focus = null;

                        }

                        if (this._$stage.hasEventListener(MouseEvent.CLICK)) {
                            this._$stage.dispatchEvent(new MouseEvent(
                                MouseEvent.CLICK, true, false,
                                this._$stage.mouseX, this._$stage.mouseY
                            ));
                        }

                        if (this._$stage.hasEventListener(MouseEvent.MOUSE_UP)) {
                            this._$stage.dispatchEvent(new MouseEvent(
                                MouseEvent.MOUSE_UP, true, false,
                                this._$stage.mouseX, this._$stage.mouseY
                            ));
                        }

                        break;

                    case Util.$TOUCH_MOVE:
                    case Util.$MOUSE_MOVE:
                        if (this._$stage.hasEventListener(MouseEvent.MOUSE_MOVE)) {
                            this._$stage.dispatchEvent(new MouseEvent(
                                MouseEvent.MOUSE_MOVE, true, false,
                                this._$stage.mouseX, this._$stage.mouseY
                            ));
                        }
                        break;

                    case Util.$DOUBLE_CLICK:
                        if (this._$stage.hasEventListener(MouseEvent.DOUBLE_CLICK)) {
                            this._$stage.dispatchEvent(new MouseEvent(
                                MouseEvent.DOUBLE_CLICK, true, false,
                                this._$stage.mouseX, this._$stage.mouseY
                            ));
                        }
                        break;

                }

                break;

            default:

                instance = options.hit;

                switch (Util.$eventType) {

                    // move event
                    case Util.$TOUCH_MOVE:
                    case Util.$MOUSE_MOVE:

                        // (1) mouseMove
                        if (instance.willTrigger(MouseEvent.MOUSE_MOVE)) {
                            instance.dispatchEvent(new MouseEvent(
                                MouseEvent.MOUSE_MOVE, true, false,
                                instance.mouseX, instance.mouseY
                            ));
                        }


                        // (2) mouseOut
                        if (this._$mouseOverTarget
                            && this._$mouseOverTarget !== instance
                        ) {

                            const outInstance = this._$mouseOverTarget;

                            if (outInstance.willTrigger(MouseEvent.MOUSE_OUT)) {
                                outInstance.dispatchEvent(new MouseEvent(
                                    MouseEvent.MOUSE_OUT, true, false,
                                    outInstance.mouseX, outInstance.mouseY
                                ));
                            }


                            if (outInstance instanceof SimpleButton
                                && outInstance._$status === "over"
                            ) {

                                outInstance._$changeState("up");
                            }

                        }


                        // rollOut and rollOver
                        if (this._$rollOverObject !== instance) {

                            let hitParent = null;
                            if (this._$rollOverObject) {

                                // (3) prev object rollOut
                                target = this._$rollOverObject;

                                if (target.willTrigger(MouseEvent.ROLL_OUT)) {
                                    target.dispatchEvent(new MouseEvent(
                                        MouseEvent.ROLL_OUT, false, false,
                                        target.mouseX, target.mouseY
                                    ));
                                }


                                // rollOver flag instance
                                hitParent = target._$parent;
                                while (hitParent && hitParent._$root !== hitParent) {

                                    if (hitParent === instance) {
                                        break;
                                    }

                                    if (hitParent._$mouseEnabled
                                        && hitParent._$outCheck(stageX, stageY)
                                    ) {

                                        let isUpperLayer = false;
                                        let check = instance;
                                        while (check && check._$root !== check) {

                                            if (check !== hitParent) {
                                                check = check._$parent;
                                                continue;
                                            }

                                            isUpperLayer = true;

                                            break;
                                        }

                                        if (!isUpperLayer && hitParent._$parent === instance._$parent
                                            && hitParent._$index > instance._$index
                                        ) {
                                            isUpperLayer = true;
                                        }

                                        if (isUpperLayer) {
                                            break;
                                        }

                                    }

                                    if (hitParent.willTrigger(MouseEvent.ROLL_OUT)) {
                                        hitParent.dispatchEvent(new MouseEvent(
                                            MouseEvent.ROLL_OUT, false, false,
                                            hitParent.mouseX, hitParent.mouseY
                                        ));
                                    }

                                    hitParent = hitParent._$parent;

                                }
                            }


                            // (4) current object rollOver
                            target = instance;
                            while (true) {

                                if (target.willTrigger(MouseEvent.ROLL_OVER)) {
                                    target.dispatchEvent(new MouseEvent(
                                        MouseEvent.ROLL_OVER, false, false,
                                        target.mouseX, target.mouseY
                                    ));
                                }

                                target = target._$parent;
                                if (!target || target === hitParent
                                    || target.stage === target
                                ) {
                                    break;
                                }

                            }

                        }

                        this._$rollOverObject = instance;


                        // (5) mouseOver
                        switch (true) {

                            case this._$mouseOverTarget === null:
                            case this._$mouseOverTarget !== instance:

                                if (instance.willTrigger(MouseEvent.MOUSE_OVER)) {
                                    instance.dispatchEvent(new MouseEvent(
                                        MouseEvent.MOUSE_OVER, true, false,
                                        instance.mouseX, instance.mouseY
                                    ));
                                }

                                // set target
                                this._$mouseOverTarget = instance;
                                break;

                        }


                        // (6) over button
                        if (instance instanceof SimpleButton
                            && instance._$status !== "over"
                        ) {

                            instance._$changeState("over");

                        }


                        // click reset
                        if (this._$state === "up") {
                            this._$clickTarget = null;
                        }

                        break;

                    // down event
                    case Util.$TOUCH_START:
                    case Util.$MOUSE_DOWN:

                        const focus = this.stage._$focus;
                        if (focus !== instance) {

                            switch (true) {

                                case instance instanceof TextField:
                                    this._$stage.focus = instance;
                                    break;

                                case instance instanceof SimpleButton:
                                    this._$stage.focus = instance;
                                    break;

                                default:
                                    this._$stage.focus = null;
                                    break;

                            }

                        }

                        // (3) mouseDown
                        if (instance.willTrigger(MouseEvent.MOUSE_DOWN)) {
                            instance.dispatchEvent(new MouseEvent(
                                MouseEvent.MOUSE_DOWN, true, false,
                                instance.mouseX, instance.mouseY
                            ));
                        }


                        // (4) click
                        this._$clickTarget = instance;


                        // (5) button event
                        if (instance instanceof SimpleButton
                            && instance._$status !== "down"
                        ) {

                            instance._$changeState("down");

                        }

                        break;

                    // up event
                    case Util.$TOUCH_END:
                    case Util.$MOUSE_UP:

                        // (1) mouseUp
                        if (instance.willTrigger(MouseEvent.MOUSE_UP)) {
                            instance.dispatchEvent(new MouseEvent(
                                MouseEvent.MOUSE_UP, true, false,
                                instance.mouseX, instance.mouseY
                            ));
                        }


                        // (2) click
                        if (this._$clickTarget === instance) {

                            if (instance.willTrigger(MouseEvent.CLICK)) {
                                instance.dispatchEvent(new MouseEvent(
                                    MouseEvent.CLICK, true, false,
                                    instance.mouseX, instance.mouseY
                                ));
                            }

                            // (3) button event
                            if (instance instanceof SimpleButton) {

                                instance._$changeState("up");

                            }

                        }

                        // reset
                        this._$clickTarget = null;

                        break;

                    case Util.$MOUSE_WHEEL:
                        if (instance.willTrigger(MouseEvent.MOUSE_WHEEL)) {
                            instance.dispatchEvent(new MouseEvent(MouseEvent.MOUSE_WHEEL));
                        }

                        if (instance instanceof TextField) {
                            instance.scrollV += event.deltaY;
                        }
                        break;

                    case Util.$DOUBLE_CLICK:
                        if (instance.willTrigger(MouseEvent.DOUBLE_CLICK)) {
                            instance.dispatchEvent(new MouseEvent(MouseEvent.DOUBLE_CLICK));
                        }
                        break;

                    default:
                        break;

                }


                // PC
                if (!staticPointer) {

                    if (!Util.$isTouch && this._$state === "up") {

                        let done = false;
                        target = instance;
                        while (target && target.root !== target) {

                            switch (true) {

                                case (target instanceof TextField):
                                    if (target.type === TextFieldType.INPUT && target.selectable) {
                                        canPointerText = true;
                                    }

                                    done = true;
                                    break;

                                case target instanceof SimpleButton:
                                case target.buttonMode:
                                    canPointer = true;
                                    break;

                            }

                            if (done || canPointerText || canPointer) {
                                break;
                            }

                            target = target._$parent;

                        }

                    }

                }

                break;

        }


        // change cursor
        switch (true) {

            case canPointerText:
                this._$canvas.style.cursor = "text";
                break;

            case canPointer:
                this._$canvas.style.cursor = "pointer";
                break;

            case !Util.$isTouch && this._$state === "up":
                this._$canvas.style.cursor = "auto";
                break;

        }


        // execute action
        if (!Util.$actionProcess && this._$actions.length > 1) {
            this._$doAction();
        }


        if (Util.$isUpdated) {

            // stop event
            event.preventDefault();

            // action script
            this._$stage._$prepareActions();
            if (!Util.$actionProcess) {
                this._$doAction();
            }

        }

        this._$hitTestStart = false;

        // reload
        Util.$currentPlayerId = cachePlayerId;
    }


}
/**
 * @class
 */
class Next2D
{
    /**
     * @constructor
     * @public
     */
    constructor () {}

    /**
     * @param  {string} url
     * @param  {object} [options=null]
     * @return {void}
     * @method
     * @public
     */
    load (url, options = null)
    {
        if (url === "develop") {
            url = Util.$location.search.substr(1).split("&")[0];
        }

        if (!url) {
            return ;
        }

        const player = new Player();
        Util.$currentPlayerId = player._$id;


        // base set
        if (!options || !("base" in options)) {
            player.base = url;
        }

        player.setOptions(options);



    }

    /**
     * @param  {number} [width=240]
     * @param  {number} [height=240]
     * @param  {number} [fps=60]
     * @param  {object} [options=null]
     * @return {MovieClip}
     * @method
     * @public
     */
    createRootMovieClip (width = 240, height = 240, fps = 60, options = null)
    {
        const player = new Player();
        Util.$currentPlayerId = player._$id;

        player._$mode = "create";
        player._$stage.frameRate = fps|0;

        // setup
        player.width  = width;
        player.height = height;
        player.setOptions(options);

        return player._$stage.addChild(new MovieClip());
    }
}

Util.$window.next2d = new Next2D();
Util.$packages(Util.$window.next2d);


        // output build version
        console.log("%c next2d.js %c 1.1615127463 %c https://next2d.app",
        "color: #fff; background: #5f5f5f",
        "color: #fff; background: #4bc729",
        "");

    })(window);
}