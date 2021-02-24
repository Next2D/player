/**
 * @description Global Object
 * @type {object}
 */
const Util = {};

// const
Util.$TWIPS = 20;

// shortcut
Util.$isNaN        = window.isNaN;
Util.$min          = Math.min;
Util.$max          = Math.max;
Util.$sin          = Math.sin;
Util.$cos          = Math.cos;
Util.$tan          = Math.tan;
Util.$sqrt         = Math.sqrt;
Util.$pow          = Math.pow;

// params
Util.$colorArray  = [];
Util.$matrixArray = [];


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