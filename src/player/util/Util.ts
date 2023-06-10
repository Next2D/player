import { Matrix } from "../next2d/geom/Matrix";
import { ColorTransform } from "../next2d/geom/ColorTransform";
import { DisplayObjectContainer } from "../next2d/display/DisplayObjectContainer";
import { URLRequestHeader } from "../next2d/net/URLRequestHeader";
import { Player } from "../player/Player";
import { Point } from "../next2d/geom/Point";
import { Event as Next2DEvent } from "../next2d/events/Event";
import { Stage } from "../next2d/display/Stage";
import { Next2D } from "../player/Next2D";
import type { Sound } from "../next2d/media/Sound";
import type { DragRulesImpl } from "../../interface/DragRulesImpl";
import type { AjaxOptionImpl } from "../../interface/AjaxOptionImpl";
import type { UnzipQueueImpl } from "../../interface/UnzipQueueImpl";
import type { ImageTypeImpl } from "../../interface/ImageTypeImpl";
import type { DropTargetImpl } from "../../interface/DropTargetImpl";
import type { ParentImpl } from "../../interface/ParentImpl";
import type { BitmapDrawObjectImpl } from "../../interface/BitmapDrawObjectImpl";
import {
    $document,
    $window,
    $navigator,
    $devicePixelRatio
} from "./Shortcut";
import {
    $getArray,
    $poolArray,
    $Math,
    $clearTimeout,
    $setTimeout
} from "./RenderUtil";

export let next2d: Next2D;

/**
 * @type {Event}
 */
// eslint-disable-next-line
export let $event: MouseEvent | TouchEvent | null = null;

/**
 * @type {string}
 * @const
 * @static
 */
export const $PREFIX: string = "__next2d__";

/**
 * @type {number}
 * @const
 * @static
 */
export const $HIGH_SAMPLES: number = 4;

/**
 * @type {number}
 * @const
 * @static
 */
export const $MEDIUM_SAMPLES: number = 2;

/**
 * @type {number}
 * @const
 * @static
 */
export const $LOW_SAMPLES: number = 0;

/**
 * @type {string}
 * @const
 * @static
 */
export const $LOAD_START: string = "loadstart";

/**
 * @type {string}
 * @const
 * @static
 */
export const $PROGRESS: string = "progress";

/**
 * @type {string}
 * @const
 * @static
 */
export const $LOADEND: string = "loadend";

/**
 * @type {string}
 * @const
 * @static
 */
export const $TOUCH_START: string = "touchstart";

/**
 * @type {string}
 * @const
 * @static
 */
export const $TOUCH_MOVE: string = "touchmove";

/**
 * @type {string}
 * @const
 * @static
 */
export const $TOUCH_END: string = "touchend";

/**
 * @type {string}
 * @const
 * @static
 */
export const $MOUSE_DOWN: string = "mousedown";

/**
 * @type {string}
 * @const
 * @static
 */
export const $MOUSE_MOVE: string = "mousemove";

/**
 * @type {string}
 * @const
 * @static
 */
export const $MOUSE_UP: string = "mouseup";

/**
 * @type {string}
 * @const
 * @static
 */
export const $MOUSE_WHEEL: string = "wheel";

/**
 * @type {string}
 * @const
 * @static
 */
export const $DOUBLE_CLICK: string = "dblclick";

/**
 * @type {string}
 * @const
 * @static
 */
export const $MOUSE_LEAVE: string = "mouseleave";

/**
 * @type {string}
 * @const
 * @static
 */
export const $KEY_DOWN: string = "keydown";

/**
 * @type {string}
 * @const
 * @static
 */
export const $KEY_UP: string = "keyup";

/**
 * @type {string}
 * @const
 * @static
 */
export const $SCROLL: string = "scroll";

/**
 * @type {HTMLParagraphElement}
 * @const
 * @static
 */
export const $P_TAG: HTMLParagraphElement = $document.createElement("p");

const div = $document.createElement("div");
div.innerHTML             = "a";
div.style.display         = "block";
div.style.position        = "absolute";
div.style.top             = "-9999px";
div.style.left            = "-9999px";
div.style.padding         = "0";
div.style.margin          = "0";
div.style.padding         = "0";
div.style.border          = "0";
div.style.outline         = "0";
div.style.verticalAlign   = "bottom";
div.style.lineHeight      = "100%";

export const $DIV: HTMLDivElement = div;

/**
 * @type {number}
 * @static
 */
// eslint-disable-next-line
export let $soundMixerVolume: number = 1;

/**
 * @type {AudioContext}
 * @static
 */
// eslint-disable-next-line
export let $audioContext: AudioContext|null = null;

/**
 * @type {Map}
 * @const
 * @static
 */
export const $variables: Map<any, any> = new Map();

/**
 * @type {DisplayObject|null}
 * @default null
 * @static
 */
// eslint-disable-next-line
export let $dropTarget: DropTargetImpl<any> | null = null;

/**
 * @param  {DisplayObject} drop_target
 * @return {void}
 * @method
 * @public
 */
export const $setDropTarget = (drop_target: DropTargetImpl<any> | null): void =>
{
    $dropTarget = drop_target;
};

/**
 * @type {{bounds: null, lock: boolean, position: {x: number, y: number}}}
 * @const
 * @static
 */
export const $dragRules: DragRulesImpl = {
    "lock": false,
    "position": {
        "x": 0,
        "y": 0
    },
    "bounds": null
};

/**
 * @description RGB to Linear Table
 * @type {Float32Array}
 * @const
 * @static
 */
export const $rgbToLinearTable: Float32Array = new Float32Array(256);

/**
 * @description RGB to Linear Table
 * @type {Float32Array}
 * @const
 * @static
 */
export const $rgbIdentityTable: Float32Array = new Float32Array(256);
for (let idx = 0; idx < 256; ++idx) {
    $rgbToLinearTable[idx] = $Math.pow(idx / 255, 2.23333333);
    $rgbToLinearTable[idx] = idx / 255;
}

/**
 * @type {Float32Array}
 * @const
 * @static
 */
export const $MATRIX_HIT_ARRAY_IDENTITY: Float32Array = new Float32Array([1, 0, 0, 1, 0, 0]);

/**
 * @type {Float32Array}
 * @const
 * @static
 */
export const $MATRIX_ARRAY_RATIO_0_0_RATIO_0_0: Float32Array = new Float32Array([
    $devicePixelRatio, 0, 0,
    $devicePixelRatio, 0, 0
]);

/**
 * @type {array}
 * @const
 * @static
 */
export const $audios: Sound[] = [];

/**
 * 使用済みになったMatrix Objectをプール
 * Pool Matrix objects that are no longer in use.
 *
 * @type {Matrix[]}
 * @const
 * @static
 */
const $matrices: Matrix[] = [];

/**
 * 使用済みになったColorTransform Objectをプール
 * Pool ColorTransform objects that are no longer in use.
 *
 * @type {ColorTransform[]}
 * @const
 * @static
 */
const $colors: ColorTransform[] = [];

/**
 * @type {Map}
 * @const
 * @static
 */
export const $bitmapDrawMap: Map<number, BitmapDrawObjectImpl> = new Map();

// eslint-disable-next-line
export let $isChrome: boolean = false;
// eslint-disable-next-line
export let $isSafari: boolean = false;
// eslint-disable-next-line
export let $isFireFox: boolean = false;
// eslint-disable-next-line
export let $isAndroid: boolean = false;
// eslint-disable-next-line
export let $isiOS: boolean = false;
// eslint-disable-next-line
export let $isTouch: boolean = false;

/**
 * @type {HTMLCanvasElement}
 * @const
 */
const textCanvas  = $document.createElement("canvas");
textCanvas.width  = 1;
textCanvas.height = 1;

/**
 * @type {CanvasRenderingContext2D}
 * @const
 * @static
 */
export const $textContext: CanvasRenderingContext2D | null = textCanvas.getContext("2d");
if ($textContext) {
    $textContext.globalAlpha = 0;
    $textContext.imageSmoothingEnabled = false;
}

/**
 * @type {HTMLCanvasElement}
 * @const
 */
const hitCanvas: HTMLCanvasElement = $document.createElement("canvas");
hitCanvas.width  = 1;
hitCanvas.height = 1;

const hitContext: CanvasRenderingContext2D | null = hitCanvas.getContext("2d");
if (!hitContext) {
    throw new Error("the CanvasRenderingContext2D is null.");
}

hitContext.globalAlpha = 0;
hitContext.imageSmoothingEnabled = false;

export const $hitContext: CanvasRenderingContext2D = hitContext;

/**
 * @return {Player}
 * @method
 * @static
 */
export const $currentPlayer = (): Player =>
{
    return next2d.player;
};

/**
 * @return {Point}
 * @method
 * @static
 */
export const $currentMousePoint = (): Point =>
{
    if (!$event) {
        return new Point();
    }

    // setup
    const player: Player = $currentPlayer();

    let x: number = $window.scrollX;
    let y: number = $window.scrollY;

    const div: HTMLElement | null = $document
        .getElementById(player.contentElementId);

    if (div) {
        const rect: DOMRect = div.getBoundingClientRect();
        x += rect.left;
        y += rect.top;
    }

    let touchX: number = 0;
    let touchY: number = 0;
    if ($event instanceof MouseEvent) {
        touchX = $event.pageX;
        touchY = $event.pageY;
    }
    if ($event instanceof TouchEvent) {
        const changedTouche: Touch = $event.changedTouches[0];
        touchX = changedTouche.pageX;
        touchY = changedTouche.pageY;
    }

    const pointX: number = (touchX - x) / player._$scale - player.x / player._$scale / $devicePixelRatio;
    const pointY: number = (touchY - y) / player._$scale - player.y / player._$scale / $devicePixelRatio;

    return new Point(pointX, pointY);
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
export const $getMatrix = (
    a: number = 1, b: number = 0,
    c: number = 0, d: number = 1,
    tx: number = 0, ty: number = 0
): Matrix => {

    const matrix = $matrices.pop();
    if (!matrix) {
        return new Matrix(a, b, c, d, tx, ty);
    }

    matrix.setTo(a, b, c, d, tx, ty);

    return matrix;
};

/**
 * @param  {Matrix} matrix
 * @return {void}
 * @method
 * @static
 */
export const $poolMatrix = (matrix: Matrix): void =>
{
    $matrices.push(matrix);
};

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
 * @method
 * @public
 */
export const $getColorTransform = (
    red_multiplier: number = 1, green_multiplier: number = 1,
    blue_multiplier: number = 1, alpha_multiplier: number = 1,
    red_offset: number = 0, green_offset: number = 0,
    blue_offset: number = 0, alpha_offset: number = 0
): ColorTransform => {

    const colorTransform = $colors.length ? $colors.pop() : null;
    if (!colorTransform) {
        return new ColorTransform(
            red_multiplier, green_multiplier, blue_multiplier, alpha_multiplier,
            red_offset, green_offset, blue_offset, alpha_offset
        );
    }

    colorTransform.redMultiplier   = red_multiplier;
    colorTransform.greenMultiplier = green_multiplier;
    colorTransform.blueMultiplier  = blue_multiplier;
    colorTransform.alphaMultiplier = alpha_multiplier;
    colorTransform.redOffset       = red_offset;
    colorTransform.greenOffset     = green_offset;
    colorTransform.blueOffset      = blue_offset;
    colorTransform.alphaOffset     = alpha_offset;

    return colorTransform;

};

/**
 * @param  {ColorTransform} color_transform
 * @return {void}
 * @method
 * @static
 */
export const $poolColorTransform = (color_transform: ColorTransform): void =>
{
    $colors.push(color_transform);
};

/**
 * @param  {Sound} sound
 * @param  {AudioBuffer} audio_buffer
 * @return {void}
 * @method
 * @static
 */
const $decodeAudioSuccess = (sound: Sound, audio_buffer: AudioBuffer): void =>
{
    if (sound._$character) {

        sound._$character.audioBuffer = audio_buffer;

    } else {

        sound._$audioBuffer = audio_buffer;

    }
};

/**
 * @param  {Sound} sound
 * @param  {ArrayBuffer} array_buffer
 * @return {Promise}
 * @method
 * @static
 */
const $decodeAudioFailed = (
    sound: Sound,
    array_buffer: ArrayBuffer
): Promise<Sound> => {

    if (!$audioContext) {
        throw new Error("the Audio Context is null.");
    }

    const buffer: Uint8Array = new Uint8Array(array_buffer);

    let idx: number = 0;
    for(;;) {

        idx = buffer.indexOf(0xff, idx);

        if (idx === -1 || (buffer[idx + 1] & 0xe0) === 0xe0) {
            break;
        }

        ++idx;

    }

    if (idx > -1) {

        return $audioContext
            .decodeAudioData(buffer.subarray(idx).buffer)
            .then((audio_buffer: AudioBuffer) =>
            {
                $decodeAudioSuccess(sound, audio_buffer);
                return Promise.resolve(sound);
            })
            .catch(() =>
            {
                throw new Error("This voice data is not available.");
            });

    }

    throw new Error("This voice data is not available.");
};

/**
 * @param  {Sound} sound
 * @return {Promise}
 * @method
 * @static
 */
export const $decodeAudioData = (sound: Sound): Promise<Sound> =>
{
    if (!$audioContext) {
        throw new Error("the AudioContext is null.");
    }

    let buffer: ArrayBuffer | null = null;
    if (sound._$character) {
        const array: number[] | null = sound._$character.buffer;
        if (array) {
            buffer = new Uint8Array(array).buffer;
            $poolArray(array);
            sound._$character.buffer = null;
        }
    } else {
        buffer = sound._$arrayBuffer;
    }

    if (!buffer) {
        return Promise.resolve(sound);
    }

    return $audioContext
        .decodeAudioData(buffer)
        .then((audio_buffer: AudioBuffer) =>
        {
            $decodeAudioSuccess(sound, audio_buffer);
            return Promise.resolve(sound);
        })
        .catch(() =>
        {
            if (!buffer) {
                throw new Error();
            }

            return $decodeAudioFailed(sound, buffer);
        });
};

/**
 * @return {void}
 * @method
 * @static
 */
export const $loadAudioData = (): void =>
{
    // create AudioContext
    if (!$audioContext) {

        $audioContext = new AudioContext();
        $audioContext.resume();

    }

    if ($audioContext) {

        const promises: Promise<Sound>[] = $getArray();
        for (let idx: number = 0; idx < $audios.length; ++idx) {

            const sound = $audios[idx];

            if (sound._$character && sound._$character.audioBuffer) {
                promises.push(Promise.resolve(sound));
            }

            if (sound._$audioBuffer) {
                promises.push(Promise.resolve(sound));
            }

            promises.push($decodeAudioData(sound));
        }

        Promise
            .all(promises)
            .then((sounds) =>
            {
                // reset
                $audios.length = 0;

                const player: Player = $currentPlayer();
                player._$loaders.push(...sounds);
            });
    }

};

/**
 * @param  {Uint8Array} buffer
 * @return {string}
 * @method
 * @static
 */
export const $getImageType = (buffer: Uint8Array): ImageTypeImpl =>
{
    if (buffer[0] === 0xff && buffer[1] === 0xd8) {
        return "jpeg";
    }

    if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46) {
        return "gif";
    }

    if (buffer[0] === 0x89 && buffer[1] === 0x50 &&
        buffer[2] === 0x4E && buffer[3] === 0x47 &&
        buffer[4] === 0x0D && buffer[5] === 0x0A &&
        buffer[6] === 0x1A && buffer[7] === 0x0A
    ) {
        return "png";
    }

    if (buffer[0] === 0x42 && buffer[1] === 0x4d) {
        return "bmp";
    }

    throw new Error("Unsupported image formats.");
};

/**
 * @type {number}
 * @static
 */
let $resizeTimerId: number = -1;

/**
 * @return {void}
 * @method
 * @static
 */
const $resizeExecute = (): void =>
{
    const player: Player = $currentPlayer();
    if (player._$loadStatus === Player.LOAD_END) {

        player._$resize();

        const stage: Stage = player.stage;
        if (stage.willTrigger(Next2DEvent.RESIZE)) {
            stage.dispatchEvent(new Next2DEvent(Next2DEvent.RESIZE));
        }
    }
};

/**
 * added resize event
 */
$window.addEventListener("resize", (): void =>
{
    $clearTimeout($resizeTimerId);
    // @ts-ignore
    $resizeTimerId = $setTimeout($resizeExecute, 300);
});

/**
 * @param  {AjaxOptionImpl} option
 * @return void
 * @method
 * @public
 */
export const $ajax = (option: AjaxOptionImpl) =>
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
    const xmlHttpRequest: XMLHttpRequest = new XMLHttpRequest();

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

        $poolArray(keys);
    }

    // set request header
    for (let idx: number = 0; idx < option.headers.length; ++idx) {
        const header: URLRequestHeader = option.headers[idx];
        xmlHttpRequest.setRequestHeader(header.name, header.value);
    }

    xmlHttpRequest.send(postData);
};

/**
 * @param  {string} header
 * @return {array}
 */
export const $headerToArray = (header: string) =>
{
    const results: URLRequestHeader[] = $getArray();
    if (header) {

        const headers = header.trim().split("\n");

        const length = headers.length;
        for (let idx = 0; idx < length; ++idx) {

            const values = headers[idx].split(":");

            results.push(new URLRequestHeader(
                `${values[0].trim()}`,
                `${values[1].trim()}`
            ));

        }

    }
    return results;
};

/**
 * @param  {string} symbol
 * @return {function}
 * @method
 * @static
 */
export const $getClass = (symbol: string) =>
{
    const names = symbol.split(".");

    let object = $window;
    for (let idx: number = 0; idx < names.length; ++idx) {

        const name = names[idx];
        if (!(name in object)) {
            return null;
        }

        // @ts-ignore
        object = object[name];
    }

    return object;
};

/**
 * @type {Worker|null}
 */
export let $rendererWorker: Worker | null = null;

/**
 * @type {Function|null}
 */
export let $removeContainerWorker: Function|null = null;

/**
 * @type {Function|null}
 */
export let $postContainerWorker: Function|null = null;

/**
 * @type {string}
 * @private
 */
// const $UNZIP_WORKER_SOURCE = require("../../worker/UnzipWorker.min.js");
// console.log($UNZIP_WORKER_SOURCE);
// .replace(/\\/g, "\\\\")
// .replace(/"/g, "\\\"")
// .replace(/\n/g, "");

/**
 * @type {string}
 * @static
 */
const $unzipURL = URL.createObjectURL(
    new Blob([""], { "type": "text/javascript" })
);

/**
 * @type {array}
 * @static
 */
export const $unzipQueues: UnzipQueueImpl[] = [];

/**
 * @default null
 * @type {Worker}
 * @static
 */
export let $unzipWorker: Worker | null = null;
export const $getUnzipWorker = (): Worker =>
{
    if (!$unzipWorker) {
        $unzipWorker = new Worker($unzipURL);
    }
    return $unzipWorker;
};

/**
 * @type {boolean}
 * @static
 */
let $unzipWorkerActive = false;
export const $updateUnzipWorkerStatus = (status: boolean): void =>
{
    $unzipWorkerActive = status;
};
export const $canUnzipWorker = (): boolean =>
{
    return $unzipWorkerActive;
};

/**
 * @method
 * @public
 */
export const $initialize = (): Promise<Next2D> =>
{
    $document.body.appendChild($DIV);

    if ("OffscreenCanvas" in window) {

        // const offscreen = new OffscreenCanvas(0,0);
        // const context = offscreen.getContext("webgl2");

        /**
         * @default null
         * @type {Worker}
         * @static
         */
        $rendererWorker = null;
        // $rendererWorker = context !== null
        //     ? new Worker(URL.createObjectURL(new Blob(["###RENDER_WORKER###"], { "type": "text/javascript" })))
        //     : null;

        if ($rendererWorker) {

            /**
             * @param  {DisplayObjectContainer} source
             * @return {void}
             * @method
             * @private
             */
            $postContainerWorker = (source: ParentImpl<any>): void =>
            {
                source._$createWorkerInstance();
                source._$postProperty();

                const children = source._$needsChildren
                    ? source._$getChildren()
                    : source._$children;

                const childrenIds = $getArray();

                const length = children.length;
                for (let idx = 0; idx < length; ++idx) {

                    const instance = children[idx];
                    if (!instance) {
                        continue;
                    }

                    childrenIds.push(instance._$instanceId);

                    if (instance instanceof DisplayObjectContainer) {
                        // @ts-ignore
                        $postContainerWorker(instance);
                        continue;
                    }

                    instance._$createWorkerInstance();
                    instance._$postProperty();
                }

                source._$postChildrenIds(childrenIds);

                $poolArray(childrenIds);
            };

            /**
             * @param  {DisplayObjectContainer} source
             * @return {void}
             * @method
             * @static
             */
            $removeContainerWorker = (source: ParentImpl<any>): void =>
            {
                source._$removeWorkerInstance();

                const children = source._$needsChildren
                    ? source._$getChildren()
                    : source._$children;

                const length = children.length;
                for (let idx = 0; idx < length; ++idx) {

                    const instance = children[idx];
                    if (!instance) {
                        continue;
                    }

                    if (instance instanceof DisplayObjectContainer) {

                        // @ts-ignore
                        $removeContainerWorker(instance);

                    } else {
                        instance._$removeWorkerInstance();
                    }
                }
            };

            // $rendererWorker.onmessage = (event: MessageEvent) =>
            // {
            //     if (event.data.command !== "bitmapDraw") {
            //         return ;
            //     }
            //
            //     const sourceId = event.data.sourceId;
            //     const object: BitmapDrawObjectImpl | void = $bitmapDrawMap.get(sourceId);
            //     $bitmapDrawMap.delete(sourceId);
            //     if (!object) {
            //         return ;
            //     }
            //
            //     // reset
            //     const source = object.source;
            //     if (source instanceof DisplayObjectContainer) {
            //         // @ts-ignore
            //         $removeContainerWorker(source);
            //     } else {
            //         source._$removeWorkerInstance();
            //     }
            //
            //     if (object.callback) {
            //         const context = object.context;
            //         context.drawImage(event.data.imageBitmap, 0, 0);
            //         object.callback(context.canvas);
            //     }
            // };
        }
    }

    next2d = new Next2D();

    return new Promise((resolve): void =>
    {
        // @ts-ignore
        const userAgentData: any = $navigator.userAgentData;
        if (userAgentData) {

            userAgentData
                .getHighEntropyValues(["platform", "mobile"])
                .then((object: any) =>
                {
                    const brands: any = object.brands;
                    for (let idx: number = 0; idx < brands.length; ++idx) {
                        if (brands[idx].brand.indexOf("Chrome") === -1) {
                            continue;
                        }

                        $isChrome = true;
                        break;
                    }

                    $isAndroid = object.platform === "Android";
                    $isiOS     = object.platform === "iOS";
                    $isTouch   = $isAndroid || $isiOS;

                    resolve(next2d);
                });

        } else {

            const userAgent = $navigator.userAgent;

            $isAndroid = userAgent.indexOf("Android") > -1;

            $isiOS = userAgent.indexOf("iPhone") > -1
                || userAgent.indexOf("iPod") > -1;

            $isChrome = userAgent.indexOf("Chrome") > -1;

            $isFireFox = userAgent.indexOf("Firefox") > -1;

            $isSafari = userAgent.indexOf("Chrome") === -1
                && userAgent.indexOf("Safari") > -1;

            $isTouch = $isAndroid || $isiOS;

            resolve(next2d);
        }
    });
};