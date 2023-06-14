import { RenderPlayer } from "./RenderPlayer";
import { RenderShape } from "./RenderShape";
import { RenderTextField } from "./RenderTextField";
import { RenderDisplayObjectContainer } from "./RenderDisplayObjectContainer";
import { RenderVideo } from "./RenderVideo";

export let $devicePixelRatio = 2;

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
 * @type {RenderPlayer}
 * @const
 */
export const $renderPlayer: RenderPlayer = new RenderPlayer();

/**
 * @type {array}
 * @static
 */
export const $shapes: RenderShape[] = [];

/**
 * @type {array}
 * @static
 */
export const $textFields: RenderTextField[] = [];

/**
 * @type {array}
 * @static
 */
export const $containers: RenderDisplayObjectContainer[] = [];

/**
 * @type {array}
 * @static
 */
export const $videos: RenderVideo[] = [];

/**
 * @return {RenderDisplayObjectContainer}
 * @method
 * @static
 */
export const $getDisplayObjectContainer = (): RenderDisplayObjectContainer =>
{
    return $containers.pop() || new RenderDisplayObjectContainer();
};

/**
 * @return {RenderTextField}
 * @method
 * @static
 */
export const $getTextField = (): RenderTextField =>
{
    return $textFields.pop() || new RenderTextField();
};

/**
 * @return {RenderVideo}
 * @method
 * @static
 */
export const $getVideo = (): RenderVideo =>
{
    return $videos.pop() || new RenderVideo();
};

/**
 * @return {RenderShape}
 * @method
 * @static
 */
export const $getShape = (): RenderShape =>
{
    return $shapes.pop() || new RenderShape();
};