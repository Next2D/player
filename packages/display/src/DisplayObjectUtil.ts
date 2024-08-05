import type { IAjaxOption } from "./interface/IAjaxOption";
import type { IDisplayObject } from "./interface/IDisplayObject";
import type { IParent } from "./interface/IParent";
import type { IURLRequestHeader } from "./interface/IURLRequestHeader";
import type { LoaderInfo } from "./LoaderInfo";

/**
 * @type {number}
 */
let instanceId: number = 0;

/**
 * @description インスタンスユニークIDを返却
 *              Returns the instance unique ID
 *
 * @return {number}
 * @method
 * @public
 */
export const $getInstanceId = (): number =>
{
    return instanceId++;
};

/**
 * @description 使用済みになったArrayのプール配列
 *              Pool array of used Array.
 *
 * @type {array[]}
 * @const
 * @static
 */
export const $arrays: any[] = [];

/**
 * @description 使用済みになったFloat32Arrayをプール、サイズは6固定
 *              Pool used Float32Array, size fixed at 6.
 *
 * @type {Float32Array[]}
 * @const
 * @static
 */
export const $float32Array6: Float32Array[] = [];

/**
 * @description 使用済みになったFloat32Arrayをプール、サイズは8固定
 *              Pool used Float32Array, size fixed at 8.
 *
 * @type {Float32Array[]}
 * @const
 * @static
 */
export const $float32Array8: Float32Array[] = [];

/**
 * @description プールされたFloat32Arrayがあればプールから。なければ新規作成して返却、サイズは6固定
 *              If there is a pooled Float32Array, it is taken from the pool.
 *              If not, create a new one and return it. Size is fixed at 6.
 *
 * @param  {number} [f0=0]
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

    const array: Float32Array = $float32Array6.pop() || new Float32Array(6);

    array[0] = f0;
    array[1] = f1;
    array[2] = f2;
    array[3] = f3;
    array[4] = f4;
    array[5] = f5;

    return array;
};

/**
 * @description 使用済みになったFloat32Arrayをプール
 *              Pool used Float32Array.
 *
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
 * @description プールされたFloat32Arrayがあればプールから。なければ新規作成して返却、サイズは8固定
 *              If there is a pooled Float32Array, it is taken from the pool.
 *              If not, create a new one and return it. Size is fixed at 8.
 *
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

    const array: Float32Array = $float32Array8.pop() || new Float32Array(8);

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
 * @description 使用済みになったFloat32Arrayをプール
 *              Pool used Float32Array.
 *
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
 * @description プールされたArrayがあればプールから、なければ新規作成して返却
 *              If there is a pooled Array, return it from the pool,
 *              otherwise create a new one and return it.
 *
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
 * @description 使用済みになったArrayをプール
 *              Pool used Array.
 *
 * @param  {array} array
 * @return {void}
 * @method
 * @static
 */
export const $poolArray = (array: any[]): void =>
{
    if (array.length) {
        array.length = 0;
    }

    $arrays.push(array);
};

/**
 * @param  {object} option
 * @return {void}
 * @method
 * @public
 */
export const $ajax = (option: IAjaxOption): void =>
{
    // get or post
    let postData: string | null = null;
    switch (option.method.toUpperCase()) {

        case "GET":
            if (option.data) {
                const urls = option.url.split("?");

                urls[1] = urls.length === 1
                    ? option.data.toString()
                    : `${urls[1]}&${option.data.toString()}`;

                option.url = urls.join("?");
            }
            break;

        case "PUT":
        case "POST":
            if (option.data) {
                postData = option.data.toString();
            }
            break;

        default:
            break;

    }

    // start
    const xmlHttpRequest = new XMLHttpRequest();

    // init
    xmlHttpRequest.open(option.method, option.url, true);

    // set mimeType
    xmlHttpRequest.responseType = option.format;

    // use cookie
    xmlHttpRequest.withCredentials = option.withCredentials;

    // add event
    if (option.event) {
        const keys: string[] = Object.keys(option.event);
        for (let idx = 0; idx < keys.length; ++idx) {

            const name: string = keys[idx];

            // @ts-ignore
            xmlHttpRequest.addEventListener(name, option.event[name]);
        }
    }

    // set request header
    for (let idx: number = 0; idx < option.headers.length; ++idx) {
        const header = option.headers[idx];
        if (!header) {
            continue;
        }
        xmlHttpRequest.setRequestHeader(header.name, header.value);
    }

    xmlHttpRequest.send(postData);
};

/**
 * @description ヘッダー文字列を配列に変換
 *              Convert header string to array
 *
 * @param  {string} header
 * @return {array}
 * @method
 * @public
 */
export const $headerStringToArray = (header: string): IURLRequestHeader[] =>
{
    const results = $getArray();
    if (header) {

        const headers = header.trim().split("\n");
        for (let idx = 0; idx < headers.length; ++idx) {

            const values = headers[idx].split(":");

            results.push({
                "name": values[0].trim(),
                "value": values[1].trim()
            });

        }

    }
    return results;
};

/**
 * @description 親子関係のマップデータ
 *              Parent-child relationship map data
 * 
 * @type {Map}
 * @protected
 */
export const $parentMap: WeakMap<IDisplayObject<any>, IParent<any>> = new WeakMap();

/**
 * @description 親子関係のマップデータ
 *              Parent-child relationship map data
 * 
 * @type {Map}
 * @protected
 */
export const $loaderInfoMap: WeakMap<IDisplayObject<any>, LoaderInfo> = new WeakMap();