import type { BoundsImpl } from "./interface/BoundsImpl";
import type { RGBAImpl } from "./interface/RGBAImpl";
import type { PreObjectImpl } from "./interface/PreObjectImpl";
import { BlendModeImpl } from "./interface/BlendModeImpl";

/**
 * @type {number}
 * @public
 */
export let $devicePixelRatio: number = 1;

/**
 * @param {number} device_pixel_ratio
 * @method
 * @public
 */
export const $setDevicePixelRatio = (device_pixel_ratio: number): void =>
{
    $devicePixelRatio = device_pixel_ratio;
};

/**
 * @type {number}
 */
let programId: number = 0;

/**
 * @return {number}
 * @method
 * @public
 */
export const $getProgramId = (): number =>
{
    return programId++;
};

/**
 * @return {number}
 * @public
 */
let $updated: boolean = false;

/**
 * @return {boolean}
 * @method
 * @public
 */
export const $isUpdated = (): boolean =>
{
    return $updated;
};

/**
 * @param  {boolean} update
 * @return {void}
 * @method
 * @public
 */
export const $doUpdated = (update: boolean = true) =>
{
    $updated = update;
};

/**
 * @shortcut
 * @type {number}
 * @const
 */
export const $Infinity: number = Infinity;

/**
 * @shortcut
 * @type {Math}
 * @const
 */
export const $Math: Math = Math;

/**
 * @shortcut
 * @type {ArrayConstructor}
 * @const
 */
export const $Array: ArrayConstructor = Array;

/**
 * @shortcut
 * @type {MapConstructor}
 * @const
 */
export const $Map: MapConstructor = Map;

/**
 * @shortcut
 * @type {NumberConstructor}
 * @const
 */
export const $Number: NumberConstructor = Number;

/**
 * @shortcut
 * @type {Float32Array}
 * @const
 */
export const $Float32Array: Float32ArrayConstructor = Float32Array;

/**
 * @shortcut
 * @type {Int32Array}
 * @const
 */
export const $Int32Array: Int32ArrayConstructor = Int32Array;

/**
 * @shortcut
 * @type {Int16Array}
 * @const
 */
export const $Int16Array: Int16ArrayConstructor = Int16Array;

/**
 * @shortcut
 * @type {OffscreenCanvas}
 * @const
 */
export const $OffscreenCanvas: typeof OffscreenCanvas = OffscreenCanvas;

/**
 * @shortcut
 * @type {object}
 * @const
 */
export const $CanvasRenderingContext2D = null;

/**
 * @shortcut
 * @type {(number: number) => boolean}
 * @const
 */
export const $isNaN: typeof isNaN = isNaN;

/**
 * @shortcut
 * @type {function}
 * @const
 */
export const $requestAnimationFrame: typeof requestAnimationFrame = requestAnimationFrame;

/**
 * @shortcut
 * @type {function}
 * @const
 */
export const $cancelAnimationFrame: typeof cancelAnimationFrame = cancelAnimationFrame;

/**
 * @shortcut
 * @type {Performance}
 * @const
 */
export const $performance: Performance = performance;

/**
 * @shortcut
 * @type {function}
 * @const
 * @static
 */
export const $setTimeout: typeof setTimeout = setTimeout;

/**
 * @shortcut
 * @type {function}
 * @const
 * @static
 */
export const $clearTimeout: typeof clearTimeout = clearTimeout;

/**
 * @type {Float32Array}
 * @const
 * @static
 */
export const $MATRIX_ARRAY_IDENTITY: Float32Array = new $Float32Array([1, 0, 0, 1, 0, 0]);

/**
 * @type {Float32Array}
 * @const
 * @static
 */
export const $COLOR_ARRAY_IDENTITY = new $Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);

/**
 * @type {number}
 * @const
 * @static
 */
export const $SHORT_INT_MIN = 0 - 32768;

/**
 * @type {number}
 * @const
 * @static
 */
export const $SHORT_INT_MAX = 32767;

/**
 * @shortcut
 * @type {number}
 * @const
 * @static
 */
export const $Deg2Rad = $Math.PI / 180;

/**
 * @shortcut
 * @type {number}
 * @const
 * @static
 */
export const $Rad2Deg = 180 / $Math.PI;

/**
 * @type {array}
 * @static
 */
export const $preObjects: PreObjectImpl[] = [];

/**
 * 使用済みになったInt32Arrayをプール、サイズは4固定
 * Pool used Int32Array, size fixed at 4.
 *
 * @type {Int32Array[]}
 * @const
 * @static
 */
export const $int32Array4: Int32Array[] = [];

/**
 * 使用済みになったFloat32Arrayをプール、サイズは4固定
 * Pool used Float32Array, size fixed at 4.
 *
 * @type {Float32Array[]}
 * @const
 * @static
 */
export const $float32Array4: Float32Array[] = [];

/**
 * 使用済みになったFloat32Arrayをプール、サイズは6固定
 * Pool used Float32Array, size fixed at 6.
 *
 * @type {Float32Array[]}
 * @const
 * @static
 */
export const $float32Array6: Float32Array[] = [];

/**
 * 使用済みになったFloat32Arrayをプール、サイズは8固定
 * Pool used Float32Array, size fixed at 8.
 *
 * @type {Float32Array[]}
 * @const
 * @static
 */
export const $float32Array8: Float32Array[] = [];

/**
 * 使用済みになったFloat32Arrayをプール、サイズは9固定
 * Pool used Float32Array, size fixed at 9.
 *
 * @type {Float32Array[]}
 * @const
 * @static
 */
export const $float32Array9: Float32Array[] = [];

/**
 * 使用済みになったArray Objectをプール
 * Pool Array objects that are no longer in use.
 *
 * @type {array[]}
 * @const
 * @static
 */
export const $arrays: any[] = [];

/**
 * 使用済みになったMap Objectをプール
 * Pool Map objects that are no longer in use.
 *
 * @type {Map[]}
 * @const
 * @static
 */
export const $maps: Map<any, any>[] = [];

/**
 * 使用済みになったbounds Objectをプール
 * Pool bounds objects that are no longer in use.
 *
 * @type {object[]}
 * @const
 * @static
 */
export const $bounds: BoundsImpl[] = [];

/**
 * @type {CanvasRenderingContext2D}
 * @static
 */
const $colorContext: OffscreenCanvasRenderingContext2D | null = new $OffscreenCanvas(1, 1).getContext("2d");

/**
 * @param  {number} x_min
 * @param  {number} x_max
 * @param  {number} y_min
 * @param  {number} y_max
 * @return {object}
 * @method
 * @static
 */
export const $getBoundsObject = (
    x_min: number = 0, x_max: number = 0,
    y_min: number = 0, y_max: number = 0
): BoundsImpl =>
{
    const object: BoundsImpl = $bounds.pop() || { "xMin": 0, "xMax": 0, "yMin": 0, "yMax": 0 };

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
export const $poolBoundsObject = (bounds: BoundsImpl): void =>
{
    $bounds.push(bounds);
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
export const $getFloat32Array4 = (
    f0: number = 0, f1: number = 0,
    f2: number = 0, f3: number = 0
): Float32Array => {

    const array: Float32Array = $float32Array4.pop() || new $Float32Array(4);

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
export const $poolFloat32Array4 = (array: Float32Array): void =>
{
    $float32Array4.push(array);
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
export const $getInt32Array4 = (
    f0: number = 0, f1: number = 0,
    f2: number = 0, f3: number = 0
): Int32Array => {

    const array: Int32Array = $int32Array4.pop() || new $Int32Array(4);

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
export const $poolInt32Array4 = (array: Int32Array): void =>
{
    $int32Array4.push(array);
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
export const $getFloat32Array6 = (
    f0: number = 0, f1: number = 0,
    f2: number = 0, f3: number = 0,
    f4: number = 0, f5: number = 0
): Float32Array => {

    const array: Float32Array = $float32Array6.pop() || new $Float32Array(6);

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
export const $poolFloat32Array6 = (array: Float32Array): void =>
{
    $float32Array6.push(array);
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
export const $getFloat32Array8 = (
    f0: number = 1, f1: number = 1,
    f2: number = 1, f3: number = 1,
    f4: number = 0, f5: number = 0,
    f6: number = 0, f7: number = 0
): Float32Array => {

    const array: Float32Array = $float32Array8.pop() || new $Float32Array(8);

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
export const $poolFloat32Array8 = (array: Float32Array): void =>
{
    $float32Array8.push(array);
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
export const $getFloat32Array9 = (
    f0: number = 0, f1: number = 0, f2: number = 0,
    f3: number = 0, f4: number = 0, f5: number = 0,
    f6: number = 0, f7: number = 0, f8: number = 0
): Float32Array => {

    const array: Float32Array = $float32Array9.pop() || new $Float32Array(9);

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
export const $poolFloat32Array9 = (array: Float32Array): void =>
{
    $float32Array9.push(array);
};

/**
 * @param  {array} args
 * @return {array}
 * @method
 * @static
 */
export const $getArray = (...args: any[]): any[] =>
{
    const array: any[] = $arrays.pop() || [];
    if (args.length) {
        array.push(...args);
    }
    return array;
};

/**
 * @param  {array} array
 * @return {void}
 * @method
 * @static
 */
export const $poolArray = (array: any[] | null = null): void =>
{
    if (!array) {
        return ;
    }

    if (array.length) {
        array.length = 0;
    }

    $arrays.push(array);
};

/**
 * @param  {Map} map
 * @return void
 * @method
 * @static
 */
export const $poolMap = (map: Map<any, any>): void =>
{
    if (map.size) {
        map.clear();
    }
    $maps.push(map);
};

/**
 * @return {Map}
 * @method
 * @static
 */
export const $getMap = (): Map<any, any> =>
{
    return $maps.pop() || new $Map();
};

/**
 * @param  {number} v
 * @return {number}
 * @method
 * @static
 */
export const $upperPowerOfTwo = (v: number): number =>
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
 * @param  {Float32Array} matrix
 * @return {Float32Array}
 * @method
 * @static
 */
export const $linearGradientXY = (matrix: Float32Array): Float32Array =>
{
    const x0: number = -819.2 * matrix[0] - 819.2 * matrix[2] + matrix[4];
    const x1: number =  819.2 * matrix[0] - 819.2 * matrix[2] + matrix[4];
    const x2: number = -819.2 * matrix[0] + 819.2 * matrix[2] + matrix[4];
    const y0: number = -819.2 * matrix[1] - 819.2 * matrix[3] + matrix[5];
    const y1: number =  819.2 * matrix[1] - 819.2 * matrix[3] + matrix[5];
    const y2: number = -819.2 * matrix[1] + 819.2 * matrix[3] + matrix[5];

    let vx2: number = x2 - x0;
    let vy2: number = y2 - y0;

    const r1: number = $Math.sqrt(vx2 * vx2 + vy2 * vy2);
    if (r1) {
        vx2 = vx2 / r1;
        vy2 = vy2 / r1;
    } else {
        vx2 = 0;
        vy2 = 0;
    }

    const r2: number = (x1 - x0) * vx2 + (y1 - y0) * vy2;

    return $getFloat32Array4(x0 + r2 * vx2, y0 + r2 * vy2, x1, y1);
};

/**
 * @param   {Float32Array} m
 * @returns {Float32Array}
 * @method
 * @static
 */
export const $inverseMatrix = (m: Float32Array): Float32Array =>
{
    const rdet: number = 1 / (m[0] * m[4] - m[3] * m[1]);
    const tx: number  = m[3] * m[7] - m[4] * m[6];
    const ty: number  = m[1] * m[6] - m[0] * m[7];

    return $getFloat32Array9(
        m[4] * rdet,  0 - m[1] * rdet, 0,
        0 - m[3] * rdet,  m[0] * rdet, 0,
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
export const $clamp = (
    value: number,
    min: number, max: number,
    default_value: number|null = null
): number => {

    const number: number = +value;

    return $isNaN(number) && default_value !== null
        ? default_value
        : $Math.min($Math.max(min, $isNaN(number) ? 0 : number), max);
};

/**
 * @param  {Float32Array} a
 * @param  {Float32Array} b
 * @return {Float32Array}
 * @method
 * @static
 */
export const $multiplicationMatrix = (a: Float32Array, b: Float32Array): Float32Array =>
{
    return $getFloat32Array6(
        a[0] * b[0] + a[2] * b[1],
        a[1] * b[0] + a[3] * b[1],
        a[0] * b[2] + a[2] * b[3],
        a[1] * b[2] + a[3] * b[3],
        a[0] * b[4] + a[2] * b[5] + a[4],
        a[1] * b[4] + a[3] * b[5] + a[5]
    );
};

/**
 * @param  {Float32Array} a
 * @param  {Float32Array} b
 * @return {Float32Array}
 * @method
 * @static
 */
export const $multiplicationColor = (a: Float32Array, b: Float32Array): Float32Array =>
{
    return $getFloat32Array8(
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
 * @param  {object} bounds
 * @param  {Float32Array} matrix
 * @return {object}
 * @method
 * @static
 */
export const $boundsMatrix = (bounds: BoundsImpl, matrix: Float32Array): BoundsImpl =>
{
    const x0: number = bounds.xMax * matrix[0] + bounds.yMax * matrix[2] + matrix[4];
    const x1: number = bounds.xMax * matrix[0] + bounds.yMin * matrix[2] + matrix[4];
    const x2: number = bounds.xMin * matrix[0] + bounds.yMax * matrix[2] + matrix[4];
    const x3: number = bounds.xMin * matrix[0] + bounds.yMin * matrix[2] + matrix[4];
    const y0: number = bounds.xMax * matrix[1] + bounds.yMax * matrix[3] + matrix[5];
    const y1: number = bounds.xMax * matrix[1] + bounds.yMin * matrix[3] + matrix[5];
    const y2: number = bounds.xMin * matrix[1] + bounds.yMax * matrix[3] + matrix[5];
    const y3: number = bounds.xMin * matrix[1] + bounds.yMin * matrix[3] + matrix[5];

    const xMin: number = $Math.min( $Number.MAX_VALUE, x0, x1, x2, x3);
    const xMax: number = $Math.max(0 - $Number.MAX_VALUE, x0, x1, x2, x3);
    const yMin: number = $Math.min( $Number.MAX_VALUE, y0, y1, y2, y3);
    const yMax: number = $Math.max(0 - $Number.MAX_VALUE, y0, y1, y2, y3);

    return $getBoundsObject(xMin, xMax, yMin, yMax);
};

/**
 * @param  {string} str
 * @return {number}
 * @method
 * @static
 */
export const $colorStringToInt = (str: string): number =>
{
    if (!$colorContext) {
        return 0;
    }

    $colorContext.fillStyle = str;
    const color: number = +`0x${$colorContext.fillStyle.slice(1)}`;

    // reset
    $colorContext.fillStyle = "rgba(0, 0, 0, 1)";

    return color;
};

/**
 * @param  {number|string} rgb
 * @return {number}
 * @method
 * @static
 */
export const $toColorInt = (rgb: any): number =>
{
    return $isNaN(+rgb)
        ? $colorStringToInt(`${rgb}`)
        : +rgb;
};

/**
 * @param  {number} uint
 * @return {RGBAImpl}
 * @method
 * @static
 */
export const $uintToRGBA = (uint: number): RGBAImpl =>
{
    return {
        "A": uint >>> 24,
        "R": (uint & 0x00ff0000) >> 16,
        "G": (uint & 0x0000ff00) >> 8,
        "B": uint & 0x000000ff
    };
};

/**
 * @param  {number}  int
 * @param  {number}  alpha
 * @param  {boolean} premultiplied
 * @return {number}
 * @method
 * @static
 */
export const $intToR = (
    int: number, alpha: number,
    premultiplied: boolean
): number => {
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
export const $intToG = (
    int: number, alpha: number,
    premultiplied: boolean
): number => {
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
export const $intToB = (
    int: number, alpha: number,
    premultiplied: boolean
): number => {
    return (int & 0xFF) * (premultiplied ? alpha : 1) / 255;
};

/**
 * @param   {number} color
 * @param   {number} [alpha=1]
 * @returns {RGBAImpl}
 * @method
 * @static
 */
export const $intToRGBA = (color: number, alpha: number = 1): RGBAImpl =>
{
    return {
        "R": (color & 0xff0000) >> 16,
        "G": (color & 0x00ff00) >> 8,
        "B": color & 0x0000ff,
        "A": alpha * 255
    };
};

/**
 * @param  {string} font
 * @param  {number} size
 * @param  {boolean} [italic=false]
 * @param  {boolean} [bold=false]
 * @return {string}
 * @method
 * @static
 */
export const $generateFontStyle = (
    font: string, size: number,
    italic: boolean = false, bold: boolean = false
): string => {

    let fontStyle: string = "";

    if (italic) {
        fontStyle = "italic ";
    }

    if (bold) {
        fontStyle += "bold ";
    }

    return `${fontStyle}${size}px '${font}','sans-serif'`;
};

/**
 * @return {object}
 * @method
 * @static
 */
export const $getPreObject = (): PreObjectImpl =>
{
    return $preObjects.pop() ||
        {
            "isLayer":   false,
            "isUpdated": null,
            "canApply":  null,
            "matrix":    null,
            "color":     null,
            "blendMode": "normal",
            "filters":   null,
            "sw":        0,
            "sh":        0
        };
};

/**
 * @param  {PreObjectImpl} object
 * @return {void}
 * @method
 * @static
 */
export const $poolPreObject = (object: PreObjectImpl): void =>
{
    if (object.color) {
        $poolFloat32Array8(object.color);
    }

    // reset
    object.isLayer     = false;
    object.isUpdated   = null;
    object.canApply    = null;
    object.matrix      = null;
    object.color       = null;
    object.filters     = null;
    object.blendMode   = "normal";
    object.sw          = 0;
    object.sh          = 0;

    // pool
    $preObjects.push(object);
};

/**
 * @type {Map}
 * @private
 */
const blendMap: Map<number, BlendModeImpl> = new Map([
    [1, "normal"],
    [2, "layer"],
    [3, "multiply"],
    [4, "screen"],
    [5, "lighten"],
    [6, "darken"],
    [7, "difference"],
    [8, "add"],
    [9, "subtract"],
    [10, "invert"],
    [11, "alpha"],
    [12, "erase"],
    [13, "overlay"],
    [14, "hardlight"]
]);

/**
 * @return {string}
 * @method
 * @public
 */
export const $blendToString = (number: number): BlendModeImpl =>
{
    return blendMap.has(number) ? blendMap.get(number) || "normal" : "normal";
};