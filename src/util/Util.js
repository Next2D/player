/**
 * @description Global Object
 * @type {object}
 */
const Util = {};

// shortcut
Util.$isNaN        = window.isNaN;
Util.$min          = Math.min;
Util.$max          = Math.max;

// params
Util.$colorArray = [];


/**
 * @description 値を範囲内に収める。
 *              Keep the value within the range.
 *
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
 * @description ColorTransformで利用終了したFloat64Arrayを再利用
 *              Reusing Float64Array that is no longer used by ColorTransform
 *
 * @return {Float64Array}
 * @static
 */
Util.$getColorArray = function (
    a = 1, b = 1, c = 1, d = 1,
    e = 0, f = 0, g = 0, h = 0
) {

    const color = Util.$colorArray.pop() || new Util.$Float64Array(8);

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
 * @description ColorTransformで利用終了したFloat64Arrayを再利用
 *              Reusing Float64Array that is no longer used by ColorTransform
 *
 * @param  {Float64Array} array
 * @return {void}
 * @static
 */
Util.$poolColorArray = function (array)
{
    Util.$colorArray.push(array);
}

/**
 * @description
 *
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