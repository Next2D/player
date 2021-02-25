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
Util.$isNaN = window.isNaN;
Util.$min   = Math.min;
Util.$max   = Math.max;
Util.$sin   = Math.sin;
Util.$cos   = Math.cos;
Util.$tan   = Math.tan;
Util.$sqrt  = Math.sqrt;
Util.$pow   = Math.pow;
Util.$abs   = Math.abs;
Util.$Array = window.Array;
Util.$Map   = window.Map;


// params
Util.$currentPlayerId  = 0;
Util.$isUpdated        = false;
Util.$event            = null;
Util.$devicePixelRatio = Util.$min(2, window.devicePixelRatio);
Util.$players          = [];
Util.$colorArray       = [];
Util.$matrixArray      = [];
Util.$bounds           = [];
Util.$arrays           = [];
Util.$maps             = [];

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
 * @param  {Next2D} object
 * @return {void}
 * @method
 * @static
 */
Util.$packages = function (object)
{
    object["display"] = {
        "BlendMode": BlendMode,
        "DisplayObject": DisplayObject,
        "DisplayObjectContainer": DisplayObjectContainer,
        "InteractiveObject": InteractiveObject,
        "MovieClip": MovieClip,
        "Sprite": Sprite
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
    };

    object["net"] = {
    };

    object["text"] = {
    };
}

