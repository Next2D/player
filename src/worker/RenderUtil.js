"use strict";

/**
 * @type {number}
 */
// eslint-disable-next-line no-unused-vars
let programId = 0;

/**
 * @shortcut
 * @type {Math}
 * @const
 */
const $Math = Math;

/**
 * @shortcut
 * @type {NumberConstructor}
 * @const
 */
const $Number = Number;

/**
 * @shortcut
 * @type {WebGLTexture}
 * @const
 */
const $WebGLTexture = WebGLTexture;

/**
 * @shortcut
 * @type {Float32Array}
 * @const
 */
const $Float32Array = Float32Array;

/**
 * @shortcut
 * @type {Int16Array}
 * @const
 */
const $Int16Array = Int16Array;

/**
 * @shortcut
 * @type {(number: number) => boolean}
 * @const
 */
const $isNaN = isNaN;

/**
 * @shortcut
 * @type {(callback: FrameRequestCallback) => number}
 * @const
 */
const $requestAnimationFrame = requestAnimationFrame;

/**
 * @shortcut
 * @type {function}
 * @const
 * @static
 */
const $setTimeout = setTimeout;

/**
 * @type {object}
 */
const Util = {};

/**
 * @type {array}
 * @static
 */
Util.$bezierConverterBuffer = new Array(32);

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
 * 使用済みになったFloat32Arrayをプール、サイズは9固定
 * Pool used Float32Array, size fixed at 9.
 *
 * @type {Float32Array[]}
 * @const
 * @static
 */
Util.$float32Array9 = [];

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
 * 使用済みになったMap Objectをプール
 * Pool Map objects that are no longer in use.
 *
 * @type {Map[]}
 * @const
 * @static
 */
Util.$maps = [];

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
    return Util.$maps.pop() || new Map();
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
            {
                const stops = style._$fillStyle._$stops
                for (let idx = 0; idx < stops.length; ++idx) {
                    Util.$poolFloat32Array4(stops[idx]);
                }
                style._$fillStyle = Util.$getFloat32Array4(1, 1, 1, 1); // fixed size 4
            }
            break;

        case CanvasPatternToWebGL:
            context
                ._$frameBufferManager
                .releaseTexture(style._$fillStyle._$texture);
            style._$fillStyle = Util.$getFloat32Array4(1, 1, 1, 1); // fixed size 4
            break;

        default:
            style._$fillStyle.fill(1);
            break;

    }

    switch (style._$strokeStyle.constructor) {

        case CanvasGradientToWebGL:
            {
                const stops = style._$fillStyle._$stops
                for (let idx = 0; idx < stops.length; ++idx) {
                    Util.$poolFloat32Array4(stops[idx]);
                }
                style._$strokeStyle = Util.$getFloat32Array4(1, 1, 1, 1); // fixed size 4
            }
            break;

        case CanvasPatternToWebGL:
            context
                ._$frameBufferManager
                .releaseTexture(style._$strokeStyle._$texture);
            style._$strokeStyle = Util.$getFloat32Array4(1, 1, 1, 1); // fixed size 4
            break;

        default:
            style._$strokeStyle.fill(1);
            break;

    }

    // reset
    context._$style                    = style;
    context._$globalAlpha              = 1;
    context._$globalCompositeOperation = BlendMode.NORMAL;
    context._$imageSmoothingEnabled    = false;
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
    return $isNaN(number) && default_value !== null
        ? default_value
        : $Math.min($Math.max(min, $isNaN(number) ? 0 : number), max);
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