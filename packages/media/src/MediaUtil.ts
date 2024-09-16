import type { Sound } from "./Sound";
import type { Video } from "./Video";
import type { IAjaxOption } from "./interface/IAjaxOption";

/**
 * @type {AudioContext}
 * @static
 */
let $audioContext: AudioContext | null = null;

/**
 * @description AudioContext を返却
 *              Returns AudioContext.
 * 
 * @return {AudioContext}
 * @method
 * @protected
 */
export const $getAudioContext = (): AudioContext =>
{
    if (!$audioContext) {
        $audioContext = new AudioContext();
        $audioContext.resume();
    }
    return $audioContext;
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
 * @description 値が最小値と最大値の間に収まるように調整します。
 *              Adjust the value so that it falls between the minimum and maximum values.
 * 
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
    min: number,
    max: number,
    default_value: number | null = null
): number => {

    const number: number = +value;

    return isNaN(number) && default_value !== null
        ? default_value
        : Math.min(Math.max(min, isNaN(number) ? 0 : number), max);
};

/**
 * @type {number}
 * @private
 */
let $volume: number = 1;

/**
 * @description 音量を返却
 *              Returns the volume.
 *
 * @return {number}
 * @method
 * @public
 */
export const $getVolume = (): number =>
{
    return $volume;
};

/**
 * @description 音量を設定
 *              Set the volume.
 *
 * @param {number} volume
 * @method
 * @public
 */
export const $setVolume = (volume: number): void =>
{
    $volume = $clamp(volume, 0, 1, 1);
};

/**
 * @type {Sound[]}
 * @private
 */
const $playingSounds: Sound[] = [];

/**
 * @description 再生中のサウンドを返却
 *              Returns the sound being played.
 *
 * @returns {Sound[]}
 * @method
 * @public
 */
export const $getPlayingSounds = (): Sound[] =>
{
    return $playingSounds;
};

/**
 * @type {Video[]}
 * @private
 */
const $playingVideos: Video[] = [];

/**
 * @description 再生中のビデオを返却
 *              Returns the video being played.
 *
 * @returns {Video[]}
 * @method
 * @public
 */
export const $getPlayingVideos = (): Video[] =>
{
    return $playingVideos;
};