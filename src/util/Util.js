/**
 * @description Global Object
 * @type {object}
 */
const Util = {};

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
 * @type {HTMLParagraphElement}
 * @const
 * @static
 */
Util.$P_TAG = window.document.createElement("p");

/**
 * @type {Float32Array}
 * @const
 * @static
 */
Util.$COLOR_ARRAY_IDENTITY = new $Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);

/**
 * @type {array}
 * @const
 * @static
 */
Util.$COLOR_MATRIX_FILTER = [
    1, 0, 0, 0, 0,
    0, 1, 0, 0, 0,
    0, 0, 1, 0, 0,
    0, 0, 0, 1, 0
];

/**
 * @type {boolean}
 * @static
 */
Util.$useCache = true;

/**
 * @type {number}
 * @static
 */
Util.$soundMixerVolume = 1;

/**
 * @type {array}
 * @static
 */
Util.$bezierConverterBuffer = new Array(32);

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
 * @type {number}
 * @const
 * @static
 */
Util.$Deg2Rad = $Math.PI / 180;

/**
 * @shortcut
 * @type {number}
 * @const
 * @static
 */
Util.$Rad2Deg = 180 / $Math.PI;

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
 * @type {Image}
 * @const
 * @static
 */
Util.$Image = window.Image;

/**
 * @shortcut
 * @type {URL}
 * @const
 * @static
 */
Util.$URL = window.URL;

/**
 * @shortcut
 * @type {Blob}
 * @const
 * @static
 */
Util.$Blob = window.Blob;

/**
 * @shortcut
 * @type {function}
 * @const
 * @static
 */
Util.$parseFloat = window.parseFloat;

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
 * @type {Map}
 * @const
 * @static
 */
Util.$variables = new Map();

/**
 * @type {Map}
 * @const
 * @static
 */
Util.$loadedImages = new Map();

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
 * @description RGB to Linear Table
 * @type {Float32Array}
 * @const
 * @static
 */
Util.$rgbToLinearTable = new $Float32Array(256);

/**
 * @description RGB to Linear Table
 * @type {Float32Array}
 * @const
 * @static
 */
Util.$rgbIdentityTable = new $Float32Array(256);
for (let idx = 0; idx < 256; ++idx) {
    Util.$rgbToLinearTable[idx] = $Math.pow(idx / 255, 2.23333333);
    Util.$rgbIdentityTable[idx] = idx / 255;
}

/**
 * @type {number}
 * @const
 * @static
 */
Util.$SHORT_INT_MIN = -32768;

/**
 * @type {number}
 * @const
 * @static
 */
Util.$SHORT_INT_MAX = 32767;

/**
 * @type {number}
 * @const
 * @static
 */
Util.$devicePixelRatio = $Math.min(2, window.devicePixelRatio);

/**
 * @type {Float32Array}
 * @const
 * @static
 */
Util.$MATRIX_HIT_ARRAY_IDENTITY = new $Float32Array([1, 0, 0, 1, 0, 0]);

/**
 * @type {Float32Array}
 * @const
 * @static
 */
Util.$MATRIX_ARRAY_IDENTITY = new $Float32Array([1, 0, 0, 1, 0, 0]);

/**
 * @type {Float32Array}
 * @const
 * @static
 */
Util.$MATRIX_ARRAY_RATIO_0_0_RATIO_0_0 = new Float32Array([
    Util.$devicePixelRatio, 0, 0,
    Util.$devicePixelRatio, 0, 0
]);

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
 * フィルター・ブレンドモードで使用済みになったPre Objectをプール
 * Pools Pre Objects that are no longer used in Filter Blend mode.
 *
 * @type {Object[]}
 * @const
 * @static
 */
Util.$preObjects = [];

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
 * 使用済みになったFloat32Arrayをプール、サイズは4固定
 * Pool used Float32Array, size fixed at 4.
 *
 * @type {Float32Array[]}
 * @const
 * @static
 */
Util.$float32Array4 = [];

/**
 * 使用済みになったFloat32Arrayをプール、サイズは6固定
 * Pool used Float32Array, size fixed at 6.
 *
 * @type {Float32Array[]}
 * @const
 * @static
 */
Util.$float32Array6 = [];

/**
 * 使用済みになったFloat32Arrayをプール、サイズは8固定
 * Pool used Float32Array, size fixed at 8.
 *
 * @type {Float32Array[]}
 * @const
 * @static
 */
Util.$float32Array8 = [];

/**
 * 使用済みになったFloat32Arrayをプール、サイズは9固定
 * Pool used Float32Array, size fixed at 9.
 *
 * @type {Float32Array[]}
 * @const
 * @static
 */
Util.$float32Array9 = [];

const userAgentData = window.navigator.userAgentData;
if (userAgentData) {
    userAgentData
        .getHighEntropyValues(["platform", "mobile"])
        .then((object) =>
        {
            /**
             * @type {boolean}
             * @const
             * @static
             */
            Util.$isTouch = object.mobile;

            for (let idx = 0; idx < object.brands.length; ++idx) {

                if (object.brands[idx].brand.indexOf("Chrome") === -1) {
                    continue;
                }

                /**
                 * @type {boolean}
                 * @const
                 * @static
                 */
                Util.$isChrome = true;

                break;
            }

            Util.$isSafari = Util.$isFireFox = false;
        });
} else {

    const userAgent = window.navigator.userAgent;

    /**
     * @type {boolean}
     * @const
     * @static
     */
    Util.$isAndroid = userAgent.indexOf("Android") > -1;

    /**
     * @type {boolean}
     * @const
     * @static
     */
    Util.isiOS = userAgent.indexOf("iPhone") > -1 || userAgent.indexOf("iPod") > -1;

    /**
     * @type {boolean}
     * @const
     * @static
     */
    Util.$isTouch = Util.$isAndroid || Util.isiOS;

    /**
     * @type {boolean}
     * @const
     * @static
     */
    Util.$isChrome = userAgent.indexOf("Chrome") > -1;

    /**
     * @type {boolean}
     * @const
     * @static
     */
    Util.$isFireFox = userAgent.indexOf("Firefox") > -1;

    /**
     * @type {boolean}
     * @const
     * @static
     */
    Util.$isSafari = userAgent.indexOf("Chrome") === -1 && userAgent.indexOf("Safari") > -1;
}

/**
 * @type {LoaderInfo}
 * @default null
 * @static
 */
Util.$currentLoaderInfo = null;

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
 * @type {HTMLCanvasElement}
 * @const
 */
const textCanvas  = window.document.createElement("canvas");
textCanvas.width  = 1;
textCanvas.height = 1;

/**
 * @type {CanvasRenderingContext2D}
 * @const
 * @static
 */
Util.$textContext = textCanvas.getContext("2d");
Util.$hitContext.globalAlpha = 0;
Util.$hitContext.imageSmoothingEnabled = false;

/**
 * @type {HTMLDivElement}
 * @default null
 * @static
 */
Util.$DIV = null;

/**
 * @param  {*} source
 * @return {boolean}
 * @method
 * @static
 */
Util.$isArray = (source) =>
{
    return Util.$Array.isArray(source);
};

/**
 * @param  {array} args
 * @return {array}
 * @method
 * @static
 */
Util.$getArray = (...args) =>
{
    const array = Util.$arrays.pop() || [];
    if (args.length) {
        array.push.apply(array, args);
    }
    return array;
};

/**
 * @param  {array} array
 * @return {void}
 * @method
 * @static
 */
Util.$poolArray = (array) =>
{
    if (array.length) {
        array.length = 0;
    }
    Util.$arrays.push(array);
};

/**
 * @param  {number} value
 * @param  {number} min
 * @param  {number} max
 * @param  {number} [default_value=null]
 * @return {number}
 * @method
 * @static
 */
Util.$clamp = (value, min, max, default_value = null) =>
{
    const number = +value;
    return Util.$isNaN(number) && default_value !== null
        ? default_value
        : $Math.min($Math.max(min, Util.$isNaN(number) ? 0 : number), max);
};

/**
 * @param   {Float32Array} a
 * @param   {Float32Array} b
 * @returns {Float32Array}
 * @method
 * @static
 */
Util.$multiplicationColor = (a, b) =>
{
    return Util.$getFloat32Array8(
        a[0] * b[0],
        a[1] * b[1],
        a[2] * b[2],
        a[3] * b[3],
        a[0] * b[4] + a[4],
        a[1] * b[5] + a[5],
        a[2] * b[6] + a[6],
        a[3] * b[7] + a[7]
    );
};

/**
 * @param   {Float32Array} a
 * @param   {Float32Array} b
 * @returns {Float32Array}
 * @static
 */
Util.$multiplicationMatrix = (a, b) =>
{
    return Util.$getFloat32Array6(
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
Util.$getBoundsObject = (x_min = 0, x_max = 0, y_min = 0, y_max = 0) =>
{
    const object = Util.$bounds.pop() || { "xMin": 0, "xMax": 0, "yMin": 0, "yMax": 0 };

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
Util.$poolBoundsObject = (bounds) =>
{
    Util.$bounds.push(bounds);
};

/**
 * @param  {Map} map
 * @return void
 * @method
 * @static
 */
Util.$poolMap = (map) =>
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
Util.$getMap = () =>
{
    return Util.$maps.pop() || new Util.$Map();
};

/**
 * @param  {number} [f0=0]
 * @param  {number} [f1=0]
 * @param  {number} [f2=0]
 * @param  {number} [f3=0]
 * @return {Float32Array}
 * @method
 * @static
 */
Util.$getFloat32Array4 = (f0 = 0, f1 = 0, f2 = 0, f3 = 0) =>
{
    const array = Util.$float32Array4.pop()
        || new $Float32Array(4);

    array[0] = f0;
    array[1] = f1;
    array[2] = f2;
    array[3] = f3;

    return array;
};

/**
 * @param  {Float32Array} array
 * @return {void}
 * @method
 * @static
 */
Util.$poolFloat32Array4 = (array) =>
{
    Util.$float32Array4.push(array);
};

/**
 * @param  {number} [f0=0]
 * @param  {number} [f1=0]
 * @param  {number} [f2=0]
 * @param  {number} [f3=0]
 * @param  {number} [f4=0]
 * @param  {number} [f5=0]
 * @return {Float32Array}
 * @method
 * @static
 */
Util.$getFloat32Array6 = (f0 = 0, f1 = 0, f2 = 0, f3 = 0, f4 = 0, f5 = 0) =>
{
    const array = Util.$float32Array6.pop()
        || new $Float32Array(6);

    array[0] = f0;
    array[1] = f1;
    array[2] = f2;
    array[3] = f3;
    array[4] = f4;
    array[5] = f5;

    return array;
};

/**
 * @param  {Float32Array} array
 * @return {void}
 * @method
 * @static
 */
Util.$poolFloat32Array6 = (array) =>
{
    Util.$float32Array6.push(array);
};

/**
 * @param  {number} [f0=0]
 * @param  {number} [f1=0]
 * @param  {number} [f2=0]
 * @param  {number} [f3=0]
 * @param  {number} [f4=0]
 * @param  {number} [f5=0]
 * @param  {number} [f6=0]
 * @param  {number} [f7=0]
 * @return {Float32Array}
 * @method
 * @static
 */
Util.$getFloat32Array8 = (
    f0 = 1, f1 = 1, f2 = 1, f3 = 1, f4 = 0, f5 = 0, f6 = 0, f7 = 0
) => {
    const array = Util.$float32Array8.pop()
        || new $Float32Array(8);

    array[0] = f0;
    array[1] = f1;
    array[2] = f2;
    array[3] = f3;
    array[4] = f4;
    array[5] = f5;
    array[6] = f6;
    array[7] = f7;

    return array;
};

/**
 * @param  {Float32Array} array
 * @return {void}
 * @method
 * @static
 */
Util.$poolFloat32Array8 = (array) =>
{
    Util.$float32Array8.push(array);
};

/**
 * @param  {number} [f0=0]
 * @param  {number} [f1=0]
 * @param  {number} [f2=0]
 * @param  {number} [f3=0]
 * @param  {number} [f4=0]
 * @param  {number} [f5=0]
 * @param  {number} [f6=0]
 * @param  {number} [f7=0]
 * @param  {number} [f8=0]
 * @return {Float32Array}
 * @method
 * @static
 */
Util.$getFloat32Array9 = (
    f0 = 0, f1 = 0, f2 = 0, f3 = 0, f4 = 0, f5 = 0, f6 = 0, f7 = 0, f8 = 0
) => {
    const array = Util.$float32Array9.pop()
        || new $Float32Array(9);

    array[0] = f0;
    array[1] = f1;
    array[2] = f2;
    array[3] = f3;
    array[4] = f4;
    array[5] = f5;
    array[6] = f6;
    array[7] = f7;
    array[8] = f8;

    return array;
};

/**
 * @param  {Float32Array} array
 * @return {void}
 * @method
 * @static
 */
Util.$poolFloat32Array9 = (array) =>
{
    Util.$float32Array9.push(array);
};

/**
 * @return {Player}
 * @method
 * @static
 */
Util.$currentPlayer = () =>
{
    return window.next2d._$player;
};

/**
 * @return {Point}
 * @method
 * @static
 */
Util.$currentMousePoint = () =>
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

    let touchX = Util.$event.pageX;
    let touchY = Util.$event.pageY;
    if (Util.$isTouch) {
        const changedTouche = Util.$event.changedTouches[0];
        touchX = changedTouche.pageX;
        touchY = changedTouche.pageY;
    }

    const pointX = (touchX - x) / player._$scale - player._$tx / player._$scale / Util.$devicePixelRatio;
    const pointY = (touchY - y) / player._$scale - player._$ty / player._$scale / Util.$devicePixelRatio;

    return new Point(pointX, pointY);
};

/**
 * @param  {object} bounds
 * @param  {Float32Array} matrix
 * @return {object}
 * @method
 * @static
 */
Util.$boundsMatrix = (bounds, matrix) =>
{
    const x0 = bounds.xMax * matrix[0] + bounds.yMax * matrix[2] + matrix[4];
    const x1 = bounds.xMax * matrix[0] + bounds.yMin * matrix[2] + matrix[4];
    const x2 = bounds.xMin * matrix[0] + bounds.yMax * matrix[2] + matrix[4];
    const x3 = bounds.xMin * matrix[0] + bounds.yMin * matrix[2] + matrix[4];
    const y0 = bounds.xMax * matrix[1] + bounds.yMax * matrix[3] + matrix[5];
    const y1 = bounds.xMax * matrix[1] + bounds.yMin * matrix[3] + matrix[5];
    const y2 = bounds.xMin * matrix[1] + bounds.yMax * matrix[3] + matrix[5];
    const y3 = bounds.xMin * matrix[1] + bounds.yMin * matrix[3] + matrix[5];

    const xMin = $Math.min( $Number.MAX_VALUE, x0, x1, x2, x3);
    const xMax = $Math.max(-$Number.MAX_VALUE, x0, x1, x2, x3);
    const yMin = $Math.min( $Number.MAX_VALUE, y0, y1, y2, y3);
    const yMax = $Math.max(-$Number.MAX_VALUE, y0, y1, y2, y3);

    return Util.$getBoundsObject(xMin, xMax, yMin, yMax);
};

/**
 * @param  {number} v
 * @return {number}
 * @method
 * @static
 */
Util.$upperPowerOfTwo = (v) =>
{
    v--;
    v |= v >> 1;
    v |= v >> 2;
    v |= v >> 4;
    v |= v >> 8;
    v |= v >> 16;
    v++;
    return v;
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
Util.$getMatrix = (a = 1, b = 0, c = 0, d = 1, tx = 0, ty = 0) =>
{
    if (!Util.$matrices.length) {
        return new Matrix(a, b, c, d, tx, ty);
    }
    const matrix = Util.$matrices.pop();
    matrix._$matrix = Util.$getFloat32Array6(a, b, c, d, tx, ty);
    return matrix;
};

/**
 * @param  {Matrix} matrix
 * @return {void}
 * @method
 * @static
 */
Util.$poolMatrix = (matrix) =>
{
    Util.$poolFloat32Array6(matrix._$matrix);
    matrix._$matrix = null;
    Util.$matrices.push(matrix);
};

/**
 * @description ECMA-262 section 9.2
 * @param  {*} value
 * @return {boolean}
 */
Util.$toBoolean = (value = false) =>
{
    switch (typeof value) {

        case "boolean":
            return value;

        case "function":
            return true;

        case "object":
        case "string":
        case "number":
            return value ? true : false;

        default:
            return false;

    }
};

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
Util.$getColorTransform = (
    red_multiplier = 1, green_multiplier = 1, blue_multiplier = 1, alpha_multiplier = 1,
    red_offset = 0, green_offset = 0, blue_offset = 0, alpha_offset = 0
) => {

    if (!Util.$colors.length) {
        return new ColorTransform(
            red_multiplier, green_multiplier, blue_multiplier, alpha_multiplier,
            red_offset, green_offset, blue_offset, alpha_offset
        );
    }

    const colorTransform = Util.$colors.pop();
    colorTransform._$colorTransform = Util.$getFloat32Array8(
        red_multiplier, green_multiplier, blue_multiplier, alpha_multiplier,
        red_offset, green_offset, blue_offset, alpha_offset
    );

    return colorTransform;

};

/**
 * @param  {ColorTransform} color_transform
 * @return {void}
 * @method
 * @static
 */
Util.$poolColorTransform = (color_transform) =>
{
    Util.$poolFloat32Array8(color_transform._$colorTransform);
    color_transform._$colorTransform = null;
    Util.$colors.push(color_transform);
};

/**
 * @param   {number|string} rgb
 * @returns {number}
 * @method
 * @static
 */
Util.$toColorInt = (rgb) =>
{
    return Util.$isNaN(+rgb)
        ? Util.$colorStringToInt(rgb)
        : +rgb;
};

/**
 * @param   {string} str
 * @returns {number}
 * @method
 * @static
 */
Util.$colorStringToInt = (str) =>
{
    Util.$hitContext.fillStyle = str;
    const color = Util.$hitContext.fillStyle.substr(1);

    // reset
    Util.$hitContext.fillStyle = "rgba(0, 0, 0, 1)";

    return `0x${color}` | 0;
};

/**
 * @param  {number}  int
 * @param  {number}  alpha
 * @param  {boolean} premultiplied
 * @return {number}
 * @method
 * @static
 */
Util.$intToR = (int, alpha, premultiplied) =>
{
    return (int >> 16) * (premultiplied ? alpha : 1) / 255;
};

/**
 * @param  {number}  int
 * @param  {number}  alpha
 * @param  {boolean} premultiplied
 * @return {number}
 * @method
 * @static
 */
Util.$intToG = (int, alpha, premultiplied) =>
{
    return (int >> 8 & 0xFF) * (premultiplied ? alpha : 1) / 255;
};

/**
 * @param  {number}  int
 * @param  {number}  alpha
 * @param  {boolean} premultiplied
 * @return {number}
 * @method
 * @static
 */
Util.$intToB = (int, alpha, premultiplied) =>
{
    return (int & 0xFF) * (premultiplied ? alpha : 1) / 255;
};

/**
 * @param  {number} uint
 * @return {object}
 * @method
 * @static
 */
Util.$uintToRGBA = (uint) =>
{
    return {
        "A": uint >>> 24,
        "R": (uint & 0x00ff0000) >> 16,
        "G": (uint & 0x0000ff00) >> 8,
        "B": uint & 0x000000ff
    };
};

/**
 * @param   {number} color
 * @param   {number} [alpha=1]
 * @returns {{R: number, G: number, B: number, A: number}}
 * @method
 * @static
 */
Util.$intToRGBA = (color, alpha = 1) =>
{
    return {
        "R": (color & 0xff0000) >> 16,
        "G": (color & 0x00ff00) >> 8,
        "B": color & 0x0000ff,
        "A": alpha * 255
    };
};

/**
 * @param  {object} object
 * @param  {Float32Array} color
 * @return {object}
 * @method
 * @static
 */
Util.$generateColorTransform = (object, color) =>
{
    return {
        "R": $Math.max(0, $Math.min(object.R * color[0] + color[4], 255)),
        "G": $Math.max(0, $Math.min(object.G * color[1] + color[5], 255)),
        "B": $Math.max(0, $Math.min(object.B * color[2] + color[6], 255)),
        "A": $Math.max(0, $Math.min(object.A * 255 * color[3] + color[7], 255)) / 255
    };
};

/**
 * @return {CacheStore}
 * @method
 * @static
 */
Util.$cacheStore = () =>
{
    return Util.$currentPlayer()._$cacheStore;
};

/**
 * @param   {Float32Array} m
 * @returns {Float32Array}
 * @method
 * @static
 */
Util.$inverseMatrix = (m) =>
{
    const rdet = 1 / (m[0] * m[4] - m[3] * m[1]);
    const tx  = m[3] * m[7] - m[4] * m[6];
    const ty  = m[1] * m[6] - m[0] * m[7];

    return Util.$getFloat32Array9(
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
    const buffer = this._$character
        ? this._$character.buffer
        : this._$buffer;

    let idx = 0;
    for(;;) {

        idx = buffer.indexOf(0xff, idx);

        if (idx === -1 || (buffer[idx + 1] & 0xe0) === 0xe0) {
            break;
        }

        ++idx;

    }

    if (idx > -1) {

        Util
            .$audioContext
            .decodeAudioData(
                buffer.buffer.subarray(idx),
                Util.$decodeAudioSuccess.bind(this)
            );

    }
};

/**
 * @param  {Uint8Array} buffer
 * @return {void}
 * @method
 * @static
 */
Util.$decodeAudioSuccess = function (buffer)
{
    if (this._$character) {

        this._$character.buffer      = null;
        this._$character.audioBuffer = buffer;

    } else {

        this._$buffer      = null;
        this._$audioBuffer = buffer;

    }
};

/**
 * @param  {Sound} sound
 * @return {void}
 * @method
 * @static
 */
Util.$decodeAudioData = (sound) =>
{
    const buffer = sound._$character
        ? sound._$character.buffer
        : sound._$buffer;

    if (!buffer) {
        return ;
    }

    Util
        .$audioContext
        .decodeAudioData(
            buffer.buffer,
            Util.$decodeAudioSuccess.bind(sound),
            Util.$decodeAudioFailed.bind(sound)
        );
};

/**
 * @return {void}
 * @method
 * @static
 */
Util.$loadAudioData = () =>
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

            if (sound._$character && sound._$character.audioBuffer) {
                return ;
            }

            if (sound._$audioBuffer) {
                return ;
            }

            Util.$decodeAudioData(sound);
        }

        // reset
        Util.$audios.length = 0;
    }

};

/**
 * @param  {Uint8Array} buffer
 * @return {string|null}
 * @method
 * @static
 */
Util.$getImageType = (buffer) =>
{
    if (buffer[0] === 0xff && buffer[1] === 0xd8) {
        return "jpeg";
    }

    if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46) {
        return "gif";
    }

    if (buffer[0] === 0x89 && buffer[1] === 0x50 &&
        buffer[2] === 0x4E && buffer[3] === 0x47 &&
        buffer[4] === 0x0D && buffer[5] === 0x0A &&
        buffer[6] === 0x1A && buffer[7] === 0x0A
    ) {
        return "png";
    }

    if (buffer[0] === 0x42 && buffer[1] === 0x4d) {
        return "bmp";
    }

    return null;
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
Util.$resize = () =>
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
Util.$resizeExecute = () =>
{
    const player = Util.$currentPlayer();
    if (player._$loadStatus === Player.LOAD_END) {

        player._$resize();

        const stage = player._$stage;
        if (stage.willTrigger(Event.RESIZE)) {
            stage.dispatchEvent(new Event(Event.RESIZE));
        }
    }
};

/**
 * added resize event
 */
Util.$window.addEventListener("resize", Util.$resize);

/**
 * @param  {CanvasToWebGLContext} context
 * @return {void}
 * @method
 * @static
 */
Util.$resetContext = (context) =>
{
    // reset color
    const style = context._$contextStyle;
    switch (style._$fillStyle.constructor) {

        case CanvasGradientToWebGL:
        case CanvasPatternToWebGL:
            style._$fillStyle = Util.$getFloat32Array4(1, 1, 1, 1); // fixed size 4
            break;

        default:
            style._$fillStyle[0] = 1;
            style._$fillStyle[1] = 1;
            style._$fillStyle[2] = 1;
            style._$fillStyle[3] = 1;
            break;

    }

    switch (style._$strokeStyle.constructor) {

        case CanvasGradientToWebGL:
        case CanvasPatternToWebGL:
            style._$strokeStyle = Util.$getFloat32Array4(1, 1, 1, 1); // fixed size 4
            break;

        default:
            style._$strokeStyle[0] = 1;
            style._$strokeStyle[1] = 1;
            style._$strokeStyle[2] = 1;
            style._$strokeStyle[3] = 1;
            break;

    }

    // reset
    context._$style                    = style;
    context._$globalAlpha              = 1;
    context._$globalCompositeOperation = BlendMode.NORMAL;
    context._$imageSmoothingEnabled    = false;
};

/**
 * @return {object}
 * @static
 */
Util.$getPreObject = () =>
{
    return Util.$preObjects.pop() ||
        {
            "isFilter":           false,
            "isUpdated":          null,
            "canApply":           null,
            "matrix":             null,
            "color":              null,
            "basePosition":       { "x": 0, "y": 0 },
            "position":           { "dx": 0, "dy": 0 },
            "baseMatrix":         null,
            "baseColor":          null,
            "currentAttachment":  null,
            "currentMaskBuffer":  null,
            "currentMaskBounds":  null,
            "cacheCurrentBounds": null,
            "blendMode":          null,
            "filters":            null,
            "layerWidth":         null,
            "layerHeight":        null
        };
};

/**
 * @param {object} object
 * @return void
 * @static
 */
Util.$poolPreObject = (object) =>
{
    // reset
    object.isFilter           = false;
    object.isUpdated          = null;
    object.canApply           = null;
    object.matrix             = null;
    object.color              = null;
    object.baseMatrix         = null;
    object.baseColor          = null;
    object.currentAttachment  = null;
    object.currentMaskBuffer  = null;
    object.currentMaskBounds  = null;
    object.cacheCurrentBounds = null;
    object.blendMode          = null;
    object.filters            = null;
    object.layerWidth         = null;
    object.layerHeight        = null;

    // pool
    Util.$preObjects.push(object);
};

/**
 * @param  {number} x1
 * @param  {number} y1
 * @param  {number} x2
 * @param  {number} y2
 * @return {number}
 * @method
 * @static
 */
Util.$cross = (x1, y1, x2, y2) =>
{
    return x1 * y2 - x2 * y1;
};

/**
 * @param   {Float32Array} matrix
 * @returns {Float32Array}
 */
Util.$linearGradientXY = (matrix) =>
{
    const x0  = -819.2 * matrix[0] - 819.2 * matrix[2] + matrix[4];
    const x1  =  819.2 * matrix[0] - 819.2 * matrix[2] + matrix[4];
    const x2  = -819.2 * matrix[0] + 819.2 * matrix[2] + matrix[4];
    const y0  = -819.2 * matrix[1] - 819.2 * matrix[3] + matrix[5];
    const y1  =  819.2 * matrix[1] - 819.2 * matrix[3] + matrix[5];
    const y2  = -819.2 * matrix[1] + 819.2 * matrix[3] + matrix[5];

    let vx2 = x2 - x0;
    let vy2 = y2 - y0;

    const r1 = $Math.sqrt(vx2 * vx2 + vy2 * vy2);
    if (r1) {
        vx2 = vx2 / r1;
        vy2 = vy2 / r1;
    } else {
        vx2 = 0;
        vy2 = 0;
    }

    const r2 = (x1 - x0) * vx2 + (y1 - y0) * vy2;

    return Util.$getArray(x0 + r2 * vx2, y0 + r2 * vy2, x1, y1);
};

/**
 * @param  {object} [option = null]
 * @return void
 */
Util.$ajax = (option = null) =>
{

    if (!option) {
        option = {
            "method": "GET"
        };
    }

    if (!("method" in option)) {
        option.method = "GET";
    }

    // get or post
    let postData = null;
    switch (option.method.toUpperCase()) {

        case URLRequestMethod.GET:
            if (option.data) {
                const urls = option.url.split("?");

                urls[1] = urls.length === 1
                    ? option.data.toString()
                    : urls[1] + "&" + option.data.toString();

                option.url = urls.join("?");
            }
            break;

        case URLRequestMethod.PUT:
        case URLRequestMethod.POST:
            postData = option.data ? option.data.toString() : null;
            break;

        default:
            break;

    }

    // start
    const xmlHttpRequest = new XMLHttpRequest();

    xmlHttpRequest.open(option.method, option.url, true);

    // use cookie
    if (option.withCredentials) {
        xmlHttpRequest.withCredentials = true;
    }

    // add event
    if (option.event) {

        const keys = Object.keys(option.event);

        const length = keys.length;
        for (let idx = 0; idx < length; ++idx) {

            const name = keys[idx];

            xmlHttpRequest.addEventListener(name, option.event[name]);
        }

        Util.$poolArray(keys);
    }

    // set mimeType
    if (option.format === URLLoaderDataFormat.ARRAY_BUFFER) {
        xmlHttpRequest.responseType = URLLoaderDataFormat.ARRAY_BUFFER;
    }

    // set request header
    if (option.headers) {
        for (const [name, value] of option.headers) {
            xmlHttpRequest.setRequestHeader(name, value);
        }
    }

    xmlHttpRequest.send(postData);
};

/**
 * @param  {string} header
 * @return {array}
 */
Util.$headerToArray = (header) =>
{
    const results = Util.$getArray();
    if (header) {

        const headers = header.trim().split("\n");

        const length = headers.length;
        for (let idx = 0; idx < length; ++idx) {

            const values = headers[idx].split(":");
            results.push({
                "name":  values[0],
                "value": values[1].trim()
            });

        }

    }
    return results;
};

/**
 * @param  {string} symbol
 * @return {function}
 * @method
 * @static
 */
Util.$getClass = (symbol) =>
{
    const names = symbol.split(".");

    let object = Util.$window;
    for (let idx = 0; idx < names.length; ++idx) {

        const name = names[idx];
        if (!(name in object)) {
            return null;
        }

        object = object[name];
    }

    return object;
};

/**
 * @type {boolean}
 * @static
 */
Util.$imageWorkerActive = false;

/**
 * @type {array}
 * @static
 */
Util.$imageQueues = [];

/**
 * @return void
 * @static
 */
Util.$decodeImage = function ()
{
    const player = Util.$currentPlayer();

    // size
    const width  = this.image.width;
    const height = this.image.height;

    const bitmapData = new BitmapData(width, height, true, 0xff000000);

    const context = player._$context;

    const currentAttachment = context
        .frameBuffer
        .currentAttachment;

    bitmapData._$texture = context
        .frameBuffer
        .createTextureFromImage(this.image);

    const shape = new Shape();

    shape
        .graphics
        .beginBitmapFill(bitmapData, null, false)
        .drawRect(0, 0, width, height);

    // setup
    const loaderInfo = this.scope.contentLoaderInfo;
    loaderInfo._$content = shape;
    shape._$loaderInfo   = loaderInfo;

    player._$loaders.push(loaderInfo);

    if (currentAttachment) {
        context._$bind(currentAttachment);
    } else {
        context.frameBuffer.unbind();
    }

    // next
    if (Util.$imageQueues.length) {

        const object = Util.$imageQueues.shift();

        object.image.decode()
            .then(Util.$decodeImage.bind(object))
            .catch(() =>
            {
                throw new Error("image encoding error");
            });

    } else {

        Util.$imageWorkerActive = false;

    }
};

/**
 * @type {string}
 * @static
 */
Util.$unzipURL = URL.createObjectURL(
    new Blob(["###UNZIP_WORKER###"], { "type": "text/javascript" })
);

/**
 * @default null
 * @type {Worker}
 * @static
 */
Util.$unzipWorker = null;

/**
 * @type {array}
 * @static
 */
Util.$unzipQueues = [];

/**
 * @type {boolean}
 * @static
 */
Util.$unzipWorkerActive = false;

/**
 *
 * @param  {MessageEvent} event
 * @method
 * @static
 */
Util.$unzipHandler = function (event)
{
    this._$build(event.data);

    if (Util.$unzipQueues.length) {

        const object = Util.$unlzmaQueues.pop();

        const buffer = new Uint8Array(object.json.buffer);
        Util.$unzipWorker.onmessage = Util.$unzipHandler.bind(object.scope);
        Util.$unzipWorker.postMessage(buffer, [buffer.buffer]);

    } else {

        Util.$unzipWorkerActive = false;

    }
};

/**
 * @param  {Next2D} object
 * @return {void}
 * @method
 * @static
 */
Util.$packages = (object) =>
{
    object.display = {
        "BitmapData": BitmapData,
        "BitmapDataChannel": BitmapDataChannel,
        "BlendMode": BlendMode,
        "CapsStyle": CapsStyle,
        "DisplayObject": DisplayObject,
        "DisplayObjectContainer": DisplayObjectContainer,
        "FrameLabel": FrameLabel,
        "GradientType": GradientType,
        "Graphics": Graphics,
        "GraphicsGradientFill": GraphicsGradientFill,
        "InteractiveObject": InteractiveObject,
        "InterpolationMethod": InterpolationMethod,
        "JointStyle": JointStyle,
        "Loader": Loader,
        "LoaderInfo": LoaderInfo,
        "LoopConfig": LoopConfig,
        "LoopType": LoopType,
        "MovieClip": MovieClip,
        "Shape": Shape,
        "SpreadMethod": SpreadMethod,
        "Sprite": Sprite,
        "Stage": Stage
    };

    object.events = {
        "Event": Event,
        "EventDispatcher": EventDispatcher,
        "EventPhase": EventPhase,
        "FocusEvent": FocusEvent,
        "HTTPStatusEvent": HTTPStatusEvent,
        "IOErrorEvent": IOErrorEvent,
        "MouseEvent": MouseEvent,
        "ProgressEvent": ProgressEvent,
        "VideoEvent": VideoEvent
    };

    object.filters = {
        "BevelFilter": BevelFilter,
        "BitmapFilterQuality": BitmapFilterQuality,
        "BitmapFilterType": BitmapFilterType,
        "BlurFilter": BlurFilter,
        "ColorMatrixFilter": ColorMatrixFilter,
        "ConvolutionFilter": ConvolutionFilter,
        "DisplacementMapFilter": DisplacementMapFilter,
        "DisplacementMapFilterMode": DisplacementMapFilterMode,
        "DropShadowFilter": DropShadowFilter,
        "GlowFilter": GlowFilter,
        "GradientBevelFilter": GradientBevelFilter,
        "GradientGlowFilter": GradientGlowFilter
    };

    object.geom = {
        "ColorTransform": ColorTransform,
        "Matrix": Matrix,
        "Point": Point,
        "Rectangle": Rectangle,
        "Transform": Transform
    };

    object.media = {
        "Sound": Sound,
        "SoundMixer": SoundMixer,
        "SoundTransform": SoundTransform,
        "Video": Video
    };

    object.net = {
        "URLLoaderDataFormat": URLLoaderDataFormat,
        "URLRequest": URLRequest,
        "URLRequestHeader": URLRequestHeader,
        "URLRequestMethod": URLRequestMethod
    };

    object.text = {
        "TextField": TextField,
        "TextFieldAutoSize": TextFieldAutoSize,
        "TextFieldType": TextFieldType,
        "TextFormat": TextFormat,
        "TextFormatAlign": TextFormatAlign,
        "TextFormatVerticalAlign": TextFormatVerticalAlign
    };

    object.ui = {
        "Easing": Easing,
        "Job": Job,
        "Tween": Tween
    };
};
