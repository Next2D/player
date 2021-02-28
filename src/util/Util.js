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


// const
Util.$TWIPS     = 20;
Util.$PREFIX    = "__next2d__";
Util.$MAX_VALUE = window.Number.MAX_VALUE;
Util.$MIN_VALUE = window.Number.MIN_VALUE;


// matrix array constants
Util.$MATRIX_ARRAY_IDENTITY                    = new Float64Array([1, 0, 0, 1, 0, 0]);
Util.$MATRIX_ARRAY_20_0_0_20_0_0               = new Float64Array([20, 0, 0, 20, 0, 0]);
Util.$MATRIX_ARRAY_20_0_0_20_0_0_INVERSE       = new Float64Array([0.05, 0, 0, 0.05, 0, 0]);
Util.$MATRIX_ARRAY_RATIO_0_0_RATIO_0_0         = new Float64Array([20 / Util.$devicePixelRatio, 0, 0, 20 / Util.$devicePixelRatio, 0, 0]);
Util.$MATRIX_ARRAY_RATIO_0_0_RATIO_0_0_INVERSE = new Float64Array([1 / 20 * Util.$devicePixelRatio, 0, 0, 1 / 20 * Util.$devicePixelRatio, 0, 0]);

// color array constant
Util.$COLOR_ARRAY_IDENTITY = new Float64Array([1, 1, 1, 1, 0, 0, 0, 0]);


// shortcut
Util.$window       = window;
Util.$document     = window.document;
Util.$navigator    = window.navigator;
Util.$userAgent    = window.navigator.userAgent;
Util.$location     = window.location;
Util.$isNaN        = window.isNaN;
Util.$min          = Math.min;
Util.$max          = Math.max;
Util.$sin          = Math.sin;
Util.$cos          = Math.cos;
Util.$tan          = Math.tan;
Util.$sqrt         = Math.sqrt;
Util.$pow          = Math.pow;
Util.$abs          = Math.abs;
Util.$atan2        = Math.atan2;
Util.$PI           = Math.PI;
Util.$Deg2Rad      = Util.$PI / 180;
Util.$Rad2Deg      = 180 / Util.$PI;
Util.$Array        = window.Array;
Util.$Map          = window.Map;
Util.$setTimeout   = window.setTimeout;
Util.$Infinity     = window.Infinity;
Util.$WebGLTexture = window.WebGLTexture;
Util.$CanvasRenderingContext2D = window.CanvasRenderingContext2D;


// params
Util.$currentPlayerId  = 0;
Util.$isUpdated        = false;
Util.$event            = null;
Util.$dropTarget       = null;
Util.$dragRules        = { "lock": false, "position": { "x": 0, "y": 0 }, "bounds": null };
Util.$devicePixelRatio = Util.$min(2, window.devicePixelRatio);
Util.$players          = [];
Util.$colorArray       = [];
Util.$matrixArray      = [];
Util.$bounds           = [];
Util.$arrays           = [];
Util.$maps             = [];
Util.$loaderInfos      = [];
Util.$matrices         = [];
Util.$colors           = [];

// OS
Util.$isAndroid         = (Util.$userAgent.indexOf("Android") > -1);
Util.isiOS              = (Util.$userAgent.indexOf("iPhone") > -1 || Util.$userAgent.indexOf("iPod") > -1);
Util.$isTouch           = (Util.$isAndroid || Util.isiOS);
Util.$isChrome          = (Util.$userAgent.indexOf("Chrome") > -1);
Util.$isFireFox         = (Util.$userAgent.indexOf("Firefox") > -1);
Util.$isSafari          = (Util.$userAgent.indexOf("Safari") > -1);
Util.$isIE              = (Util.$userAgent.indexOf("Trident") > -1);
Util.$isEdge            = (Util.$userAgent.indexOf("Edge") > -1);
Util.$isMac             = (Util.$userAgent.indexOf("Mac") > -1);
Util.$isWindows         = (Util.$isMac === false);


// hit test canvas
const hitCanvas              = window.document.createElement("canvas");
hitCanvas.width              = 1;
hitCanvas.height             = 1;
Util.$hitContext             = hitCanvas.getContext("2d");
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
    return Util.$arrays.pop() || [];
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
 * @return {Float64Array}
 * @method
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
 * @method
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
 * @method
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
 * @method
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
 * @method
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
 * @param  {Float64Array} matrix
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
        matrix._$matrix = Util.$getMatrixArray(a, b, c, d, tx, ty);
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
    Util.$poolMatrixArray(matrix._$matrix);
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
)
{
    if (Util.$colors.length) {
        const colorTransform = Util.$colors.pop();
        colorTransform._$colorTransform = Util.$getColorArray(
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
    Util.$poolColorArray(color_transform._$colorTransform);
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
 * @param  {Next2D} object
 * @return {void}
 * @method
 * @static
 */
Util.$packages = function (object)
{
    object["display"] = {
        "Bitmap": Bitmap,
        "BlendMode": BlendMode,
        "DisplayObject": DisplayObject,
        "DisplayObjectContainer": DisplayObjectContainer,
        "FrameLabel": FrameLabel,
        "Graphics": Graphics,
        "InteractiveObject": InteractiveObject,
        "MovieClip": MovieClip,
        "Shape": Shape,
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
        "SoundTransform": SoundTransform
    };

    object["net"] = {
    };

    object["text"] = {
    };
}