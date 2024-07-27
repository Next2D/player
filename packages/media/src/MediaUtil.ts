import type { Sound } from "./Sound";
import type { Video } from "./Video";

/**
 * @type {AudioContext}
 * @static
 */
export const $audioContext: AudioContext | null = "AudioContext" in window ? new AudioContext() : null;

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
    $volume = volume;
};

/**
 * @type {Sound[]}
 * @private
 */
const $sounds: Sound[] = [];

/**
 * @description 再生中のサウンドを返却
 *              Returns the sound being played.
 *
 * @returns {Sound[]}
 * @method
 * @public
 */
export const $getSounds = (): Sound[] =>
{
    return $sounds;
};

/**
 * @type {Video[]}
 * @private
 */
const $videos: Video[] = [];

/**
 * @description 再生中のビデオを返却
 *              Returns the video being played.
 *
 * @returns {Video[]}
 * @method
 * @public
 */
export const $getVideos = (): Video[] =>
{
    return $videos;
};