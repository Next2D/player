import { RenderPlayer } from "./RenderPlayer";
import { RenderShape } from "./display/RenderShape";
import { RenderTextField } from "./display/RenderTextField";
import { RenderDisplayObjectContainer } from "./display/RenderDisplayObjectContainer";
import { RenderVideo } from "./media/RenderVideo";

/**
 * @type {boolean}
 * @public
 */
export let $isSafari: boolean = false;

/**
 * @param {boolean} is_safari
 * @method
 * @public
 */
export const $setSafari = (is_safari: boolean): void =>
{
    $isSafari = is_safari;
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