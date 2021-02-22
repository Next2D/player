const BenchMark = {};

BenchMark.$LOOP_COUNT = 1000000;

/**
 * @param {object} object
 * @param {string} name
 * @param {array}  [params=null]
 * @static
 */
BenchMark.executeFunction = function (object, name, params = null)
{
    const start = Date.now();
    for (let idx = 0; idx < BenchMark.$LOOP_COUNT; ++idx) {
        object[name].apply(object, params || []);
    }

    const time = (Date.now() - start) / 1000;
    if (1 > time) {
        return ;
    }

    throw new Error(`slow function [${name}]. time ${time}.`);
}

/**
 * @param {object} object
 * @param {string} name
 * @static
 */
BenchMark.executeGetProperty = function (object, name)
{
    const start = Date.now();
    for (let idx = 0; idx < BenchMark.$LOOP_COUNT; ++idx) {
        const value = object[name];
    }

    const time = (Date.now() - start) / 1000;
    if (1 > time) {
        return ;
    }

    throw new Error(`slow get property [${name}]. time ${time}.`);
}

/**
 * @param {object} object
 * @param {string} name
 * @param {*}      [value=null]
 * @static
 */
BenchMark.executeSetProperty = function (object, name, value = null)
{
    const start = Date.now();
    for (let idx = 0; idx < BenchMark.$LOOP_COUNT; ++idx) {
        object[name] = value;
    }

    const time = (Date.now() - start) / 1000;
    if (1 > time) {
        return ;
    }

    throw new Error(`slow set property [${name}]. time ${time}.`);
}