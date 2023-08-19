import { URLRequestHeader } from "@next2d/net";
import { Player } from "@next2d/core";
import { Event as Next2DEvent } from "@next2d/events";
import {
    Matrix,
    ColorTransform,
    Point
} from "@next2d/geom";
import {
    Stage,
    Sprite,
    MovieClip,
    Shape
} from "@next2d/display";
import { TextField } from "@next2d/text";
import {
    Video,
    Sound
} from "@next2d/media";
import {
    DisplayObjectImpl,
    DragRulesImpl,
    AjaxOptionImpl,
    ImageTypeImpl,
    DropTargetImpl,
    ParentImpl,
    BitmapDrawObjectImpl,
    NoCodeDataZlibImpl,
    PropertyMessageMapImpl,
    BlendModeImpl
} from "@next2d/interface";
import { $getEvent } from "./Global";
import {
    $document,
    $window
} from "./Shortcut";
import {
    $getArray,
    $poolArray,
    $Math,
    $clearTimeout,
    $setTimeout,
    $devicePixelRatio
} from "@next2d/share";

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

const div: HTMLDivElement = $document.createElement("div");
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
const textCanvas: HTMLCanvasElement = $document.createElement("canvas");
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
 * @type {Float32Array[]}
 * @private
 */
const $renderBufferArray: Float32Array[] = [];

/**
 * @type {array}
 * @private
 */
const $renderMessageArray: PropertyMessageMapImpl<any>[] = [];

/**
 * @return {Float32Array}
 * @method
 * @public
 */
export const $getRenderBufferArray = (): Float32Array =>
{
    return $renderBufferArray.length
        ? $renderBufferArray.pop() as NonNullable<Float32Array>
        : new Float32Array(64);
};

/**
 * @param  {Float32Array} buffer
 * @return {void}
 * @method
 * @public
 */
export const $poolRenderBufferArray = (buffer: Float32Array): void =>
{
    $renderBufferArray.push(buffer);
    console.log("renderBufferArray: ", $renderBufferArray);
};

/**
 * @return {object}
 * @method
 * @public
 */
export const $getRenderMessageObject = (): PropertyMessageMapImpl<any> =>
{
    return $renderMessageArray.length
        ? $renderMessageArray.pop() as NonNullable<PropertyMessageMapImpl<any>>
        : { "command": "" };
};

/**
 * @param  {object} object
 * @return {void}
 * @method
 * @public
 */
export const $poolRenderMessageObject = (object: PropertyMessageMapImpl<any>): void =>
{
    object.buffer = null;
    $renderMessageArray.push(object);
    console.log("renderMessageArray: ", $renderMessageArray);
};

/**
 * @return {Player}
 * @method
 * @static
 */
export const $currentPlayer = (): Player =>
{
    return $window.next2d.player;
};

/**
 * @return {Point}
 * @method
 * @static
 */
export const $currentMousePoint = (): Point =>
{
    const event: MouseEvent | TouchEvent | Event | null = $getEvent();
    if (!event) {
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
    if ("changedTouches" in event) {
        const changedTouche: Touch = event.changedTouches[0];
        touchX = changedTouche.pageX;
        touchY = changedTouche.pageY;
    } else if ("pageX" in event) {
        touchX = event.pageX;
        touchY = event.pageY;
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
 * @type {Map}
 * @private
 */
const blendMap: Map<BlendModeImpl, number> = new Map([
    ["normal", 1],
    ["layer", 2],
    ["multiply", 3],
    ["screen", 4],
    ["lighten", 5],
    ["darken", 6],
    ["difference", 7],
    ["add", 8],
    ["subtract", 9],
    ["invert", 10],
    ["alpha", 11],
    ["erase", 12],
    ["overlay", 13],
    ["hardlight", 14]
]);

/**
 * @param  {string} blend
 * @return {number}
 * @method
 * @public
 */
export const $blendToNumber = (blend: BlendModeImpl): number =>
{
    return blendMap.has(blend) ? blendMap.get(blend) || 1 : 1;
};

/**
 * @param  {string} character_extends
 * @return {DisplayObject}
 * @method
 * @public
 */
export const $createInstance = (character_extends: string): DisplayObjectImpl<any> =>
{
    switch (character_extends) {

        case MovieClip.namespace:
            return new MovieClip;

        case Shape.namespace:
            return new Shape;

        case TextField.namespace:
            return new TextField();

        case Sprite.namespace:
            return new Sprite;

        case Video.namespace:
            return new Video();

    }
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
 * @static
 */
const $unzipURL: string = URL.createObjectURL(new Blob(["(()=>{\"use strict\";var r=Uint8Array,n=Uint16Array,e=Int32Array,a=new r([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),t=new r([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),i=new r([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),o=function(r,a){for(var t=new n(31),i=0;i<31;++i)t[i]=a+=1<<r[i-1];var o=new e(t[30]);for(i=1;i<30;++i)for(var f=t[i];f<t[i+1];++f)o[f]=f-t[i]<<5|i;return{b:t,r:o}},f=o(a,2),u=f.b,v=f.r;u[28]=258,v[258]=28;for(var c=o(t,0),l=c.b,d=(c.r,new n(32768)),s=0;s<32768;++s){var w=(43690&s)>>1|(21845&s)<<1;w=(61680&(w=(52428&w)>>2|(13107&w)<<2))>>4|(3855&w)<<4,d[s]=((65280&w)>>8|(255&w)<<8)>>1}var h=function(r,e,a){for(var t=r.length,i=0,o=new n(e);i<t;++i)r[i]&&++o[r[i]-1];var f,u=new n(e);for(i=1;i<e;++i)u[i]=u[i-1]+o[i-1]<<1;if(a){f=new n(1<<e);var v=15-e;for(i=0;i<t;++i)if(r[i])for(var c=i<<4|r[i],l=e-r[i],s=u[r[i]-1]++<<l,w=s|(1<<l)-1;s<=w;++s)f[d[s]>>v]=c}else for(f=new n(t),i=0;i<t;++i)r[i]&&(f[i]=d[u[r[i]-1]++]>>15-r[i]);return f},y=new r(288);for(s=0;s<144;++s)y[s]=8;for(s=144;s<256;++s)y[s]=9;for(s=256;s<280;++s)y[s]=7;for(s=280;s<288;++s)y[s]=8;var b=new r(32);for(s=0;s<32;++s)b[s]=5;var g=h(y,9,1),p=h(b,5,1),m=function(r){for(var n=r[0],e=1;e<r.length;++e)r[e]>n&&(n=r[e]);return n},k=function(r,n,e){var a=n/8|0;return(r[a]|r[a+1]<<8)>>(7&n)&e},x=function(r,n){var e=n/8|0;return(r[e]|r[e+1]<<8|r[e+2]<<16)>>(7&n)},T=[\"unexpected EOF\",\"invalid block type\",\"invalid length/literal\",\"invalid distance\",\"stream finished\",\"no stream handler\",,\"no callback\",\"invalid UTF-8 data\",\"extra field too long\",\"date not in range 1980-2099\",\"filename too long\",\"stream finishing\",\"invalid zip data\"],z=function(r,n,e){var a=new Error(n||T[r]);if(a.code=r,Error.captureStackTrace&&Error.captureStackTrace(a,z),!e)throw a;return a},E=function(n,e,o,f){var v=n.length,c=f?f.length:0;if(!v||e.f&&!e.l)return o||new r(0);var d=!o||2!=e.i,s=e.i;o||(o=new r(3*v));var w,y=function(n){var e=o.length;if(n>e){var a=new r(Math.max(2*e,n));a.set(o),o=a}},b=e.f||0,T=e.p||0,E=e.b||0,M=e.l,S=e.d,U=e.m,A=e.n,C=8*v;do{if(!M){b=k(n,T,1);var q=k(n,T+1,3);if(T+=3,!q){var D=n[(w=T,(G=4+((w+7)/8|0))-4)]|n[G-3]<<8,F=G+D;if(F>v){s&&z(0);break}d&&y(E+D),o.set(n.subarray(G,F),E),e.b=E+=D,e.p=T=8*F,e.f=b;continue}if(1==q)M=g,S=p,U=9,A=5;else if(2==q){var I=k(n,T,31)+257,O=k(n,T+10,15)+4,J=I+k(n,T+5,31)+1;T+=14;for(var L=new r(J),N=new r(19),P=0;P<O;++P)N[i[P]]=k(n,T+3*P,7);T+=3*O;var R=m(N),j=(1<<R)-1,B=h(N,R,1);for(P=0;P<J;){var G,H=B[k(n,T,j)];if(T+=15&H,(G=H>>4)<16)L[P++]=G;else{var K=0,Q=0;for(16==G?(Q=3+k(n,T,3),T+=2,K=L[P-1]):17==G?(Q=3+k(n,T,7),T+=3):18==G&&(Q=11+k(n,T,127),T+=7);Q--;)L[P++]=K}}var V=L.subarray(0,I),W=L.subarray(I);U=m(V),A=m(W),M=h(V,U,1),S=h(W,A,1)}else z(1);if(T>C){s&&z(0);break}}d&&y(E+131072);for(var X=(1<<U)-1,Y=(1<<A)-1,Z=T;;Z=T){var $=(K=M[x(n,T)&X])>>4;if((T+=15&K)>C){s&&z(0);break}if(K||z(2),$<256)o[E++]=$;else{if(256==$){Z=T,M=null;break}var _=$-254;if($>264){var rr=a[P=$-257];_=k(n,T,(1<<rr)-1)+u[P],T+=rr}var nr=S[x(n,T)&Y],er=nr>>4;if(nr||z(3),T+=15&nr,W=l[er],er>3&&(rr=t[er],W+=x(n,T)&(1<<rr)-1,T+=rr),T>C){s&&z(0);break}d&&y(E+131072);var ar=E+_;if(E<W){var tr=c-W,ir=Math.min(W,ar);for(tr+E<0&&z(3);E<ir;++E)o[E]=f[tr+E]}for(;E<ar;E+=4)o[E]=o[E-W],o[E+1]=o[E+1-W],o[E+2]=o[E+2-W],o[E+3]=o[E+3-W];E=ar}}e.l=M,e.p=Z,e.b=E,e.f=b,M&&(b=1,e.m=U,e.d=S,e.n=A)}while(!b);return E==o.length?o:function(n,e,a){(null==e||e<0)&&(e=0),(null==a||a>n.length)&&(a=n.length);var t=new r(a-e);return t.set(n.subarray(e,a)),t}(o,0,E)},M=new r(0);function S(n,e){var a,t,i=function(r){31==r[0]&&139==r[1]&&8==r[2]||z(6,\"invalid gzip data\");var n=r[3],e=10;4&n&&(e+=2+(r[10]|r[11]<<8));for(var a=(n>>3&1)+(n>>4&1);a>0;a-=!r[e++]);return e+(2&n)}(n);return i+8>n.length&&z(6,\"invalid gzip data\"),E(n.subarray(i,-8),{i:2},e&&e.out||new r((t=(a=n).length,(a[t-4]|a[t-3]<<8|a[t-2]<<16|a[t-1]<<24)>>>0)),e&&e.dictionary)}function U(r,n){return E(r.subarray((e=r,a=n&&n.dictionary,(8!=(15&e[0])||e[0]>>4>7||(e[0]<<8|e[1])%31)&&z(6,\"invalid zlib data\"),(e[1]>>5&1)==+!a&&z(6,\"invalid zlib data: \"+(32&e[1]?\"need\":\"unexpected\")+\" dictionary\"),2+(e[1]>>3&4)),-4),{i:2},n&&n.out,n&&n.dictionary);var e,a}var A=\"undefined\"!=typeof TextDecoder&&new TextDecoder;try{A.decode(M,{stream:!0})}catch(r){}\"function\"==typeof queueMicrotask?queueMicrotask:\"function\"==typeof setTimeout&&setTimeout;self.addEventListener(\"message\",(r=>{return n=void 0,e=void 0,t=function*(){const n=31==(e=r.data)[0]&&139==e[1]&&8==e[2]?S(e,a):8!=(15&e[0])||e[0]>>4>7||(e[0]<<8|e[1])%31?function(r,n){return E(r,{i:2},n&&n.out,n&&n.dictionary)}(e,a):U(e,a);var e,a;let t=\"\";for(let r=0;r<n.length;r+=4096)t+=String.fromCharCode(...n.slice(r,r+4096));self.postMessage(JSON.parse(decodeURIComponent(t)))},new((a=void 0)||(a=Promise))((function(r,i){function o(r){try{u(t.next(r))}catch(r){i(r)}}function f(r){try{u(t.throw(r))}catch(r){i(r)}}function u(n){var e;n.done?r(n.value):(e=n.value,e instanceof a?e:new a((function(r){r(e)}))).then(o,f)}u((t=t.apply(n,e||[])).next())}));var n,e,a,t}))})();"], { "type": "text/javascript" }));

/**
 * @type {array}
 * @static
 */
export const $unzipQueues: NoCodeDataZlibImpl[] = [];

/**
 * @default null
 * @type {Worker}
 * @static
 */
let $unzipWorker: Worker | null = null;
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
let $unzipWorkerActive: boolean = false;
export const $updateUnzipWorkerStatus = (status: boolean): void =>
{
    $unzipWorkerActive = status;
};
export const $useUnzipWorker = (): boolean =>
{
    return $unzipWorkerActive;
};

/**
 * @type {string}
 * @public
 */
const $renderURL: string = "(()=>{\"use strict\";let t=1,e=0,i=!1;const s=1/0,r=Math,n=Array,a=Map,h=Number,o=Float32Array,_=Int32Array,l=Int16Array,c=OffscreenCanvas,$=isNaN,u=requestAnimationFrame,d=setTimeout,g=clearTimeout,f=new o([1,0,0,1,0,0]),m=new o([1,1,1,1,0,0,0,0]),p=r.PI/180,x=(r.PI,[]),b=[],v=[],T=[],A=[],M=[],y=[],E=[],C=new c(1,1).getContext(\"2d\"),S=(t=0,e=0,i=0,s=0)=>{const r=E.pop()||{xMin:0,xMax:0,yMin:0,yMax:0};return r.xMin=t,r.xMax=e,r.yMin=i,r.yMax=s,r},F=t=>{E.push(t)},B=(t=0,e=0,i=0,s=0)=>{const r=b.pop()||new o(4);return r[0]=t,r[1]=e,r[2]=i,r[3]=s,r},w=t=>{b.push(t)},R=(t=0,e=0,i=0,s=0,r=0,n=0)=>{const a=v.pop()||new o(6);return a[0]=t,a[1]=e,a[2]=i,a[3]=s,a[4]=r,a[5]=n,a},I=t=>{v.push(t)},P=(t=1,e=1,i=1,s=1,r=0,n=0,a=0,h=0)=>{const _=T.pop()||new o(8);return _[0]=t,_[1]=e,_[2]=i,_[3]=s,_[4]=r,_[5]=n,_[6]=a,_[7]=h,_},N=t=>{T.push(t)},k=(t=0,e=0,i=0,s=0,r=0,n=0,a=0,h=0,_=0)=>{const l=A.pop()||new o(9);return l[0]=t,l[1]=e,l[2]=i,l[3]=s,l[4]=r,l[5]=n,l[6]=a,l[7]=h,l[8]=_,l},L=(...t)=>{const e=M.pop()||[];return t.length&&e.push(...t),e},O=(t=null)=>{t&&(t.length&&(t.length=0),M.push(t))},U=t=>{t.size&&t.clear(),y.push(t)},D=()=>y.pop()||new a,X=t=>(t--,t|=t>>1,t|=t>>2,t|=t>>4,t|=t>>8,t|=t>>16,++t),V=t=>{const e=1/(t[0]*t[4]-t[3]*t[1]),i=t[3]*t[7]-t[4]*t[6],s=t[1]*t[6]-t[0]*t[7];return k(t[4]*e,0-t[1]*e,0,0-t[3]*e,t[0]*e,0,i*e,s*e,1)},Y=(t,e,i,s=null)=>{const n=+t;return $(n)&&null!==s?s:r.min(r.max(e,$(n)?0:n),i)},z=(t,e)=>R(t[0]*e[0]+t[2]*e[1],t[1]*e[0]+t[3]*e[1],t[0]*e[2]+t[2]*e[3],t[1]*e[2]+t[3]*e[3],t[0]*e[4]+t[2]*e[5]+t[4],t[1]*e[4]+t[3]*e[5]+t[5]),G=(t,e)=>P(t[0]*e[0],t[1]*e[1],t[2]*e[2],t[3]*e[3],t[0]*e[4]+t[4],t[1]*e[5]+t[5],t[2]*e[6]+t[6],t[3]*e[7]+t[7]),H=(t,e)=>{const i=t.xMax*e[0]+t.yMax*e[2]+e[4],s=t.xMax*e[0]+t.yMin*e[2]+e[4],n=t.xMin*e[0]+t.yMax*e[2]+e[4],a=t.xMin*e[0]+t.yMin*e[2]+e[4],o=t.xMax*e[1]+t.yMax*e[3]+e[5],_=t.xMax*e[1]+t.yMin*e[3]+e[5],l=t.xMin*e[1]+t.yMax*e[3]+e[5],c=t.xMin*e[1]+t.yMin*e[3]+e[5],$=r.min(h.MAX_VALUE,i,s,n,a),u=r.max(0-h.MAX_VALUE,i,s,n,a),d=r.min(h.MAX_VALUE,o,_,l,c),g=r.max(0-h.MAX_VALUE,o,_,l,c);return S($,u,d,g)},W=t=>$(+t)?(t=>{if(!C)return 0;C.fillStyle=t;const e=+`0x${C.fillStyle.slice(1)}`;return C.fillStyle=\"rgba(0, 0, 0, 1)\",e})(`${t}`):+t,q=(t,e,i)=>(t>>16)*(i?e:1)/255,j=(t,e,i)=>(t>>8&255)*(i?e:1)/255,K=(t,e,i)=>(255&t)*(i?e:1)/255,Q=(t,e=1)=>({R:(16711680&t)>>16,G:(65280&t)>>8,B:255&t,A:255*e}),J=(t,e,i=!1,s=!1)=>{let r=\"\";return i&&(r=\"italic \"),s&&(r+=\"bold \"),`${r}${e}px '${t}','sans-serif'`},Z=t=>{t.color&&N(t.color),t.isLayer=!1,t.isUpdated=null,t.canApply=null,t.matrix=null,t.color=null,t.filters=null,t.blendMode=\"normal\",t.sw=0,t.sh=0,x.push(t)},tt=new Map([[1,\"normal\"],[2,\"layer\"],[3,\"multiply\"],[4,\"screen\"],[5,\"lighten\"],[6,\"darken\"],[7,\"difference\"],[8,\"add\"],[9,\"subtract\"],[10,\"invert\"],[11,\"alpha\"],[12,\"erase\"],[13,\"overlay\"],[14,\"hardlight\"]]),et=new class{constructor(){this._$pool=[],this._$store=new Map,this._$timerMap=new Map,this._$context=null}set context(t){this._$context=t}reset(){for(const t of this._$store.values()){for(const e of t.values())this.destroy(e);U(t)}this._$store.clear(),this._$context&&this._$context.frameBuffer.clearCache()}destroy(t=null){if(t&&\"object\"==typeof t)if(t instanceof WebGLTexture)u((()=>{this._$context&&this._$context.frameBuffer.releaseTexture(t)}));else{if(\"canvas\"in t&&t instanceof CanvasRenderingContext2D){const e=t.canvas,i=e.width,s=e.height;t.clearRect(0,0,i+1,s+1),e.width=e.height=1,this._$pool.push(e)}this._$context&&\"index\"in t&&this._$context.frameBuffer.textureManager.releasePosition(t)}}getCanvas(){return this._$pool.pop()||document.createElement(\"canvas\")}remove(t,e){if(!this._$store.has(t))return;const i=this._$store.get(t);i.has(e)&&(i.delete(e),i.size||(U(i),this._$store.delete(t)))}stopTimer(t){t=`${t}`,this._$timerMap.has(t)&&(g(this._$timerMap.get(t)),this._$timerMap.delete(t))}removeCache(t){if(t=`${t}`,this._$store.has(t)){const e=this._$store.get(t);for(const t of e.values())this.destroy(t);e.clear(),U(e),this._$store.delete(t)}this._$timerMap.delete(t)}setRemoveTimer(t){if(t=`${t}`,this.stopTimer(t),this._$store.has(t)){const e=d((()=>{this.removeCache(t)}),5e3);this._$timerMap.set(t,e)}}get(t){const e=`${t[0]}`,i=`${t[1]}`;if(this._$store.has(e)){this.stopTimer(e);const t=this._$store.get(e);if(t.has(i))return t.get(i)}return null}set(t,e=null){const i=`${t[0]}`,s=`${t[1]}`;this._$store.has(i)||this._$store.set(i,D());const r=this._$store.get(i);if(null===e){if(!r.has(s))return;return this.destroy(r.get(s)),r.delete(s),void(r.size||(U(r),this._$store.delete(i)))}r.set(s,e)}has(t){const e=`${t[0]}`;return!!this._$store.has(e)&&this._$store.get(e).has(`${t[1]}`)}generateKeys(t,e=null,i=null){let s=\"\";e&&e.length&&(s+=`${e[0]}_${e[1]}`),i&&i.length&&(s+=0===i[7]?\"\":`_${i[7]}`);const r=L();if(s){let t=0;const e=s.length;for(let i=0;i<e;i++)t=(t<<5)-t+s.charCodeAt(i),t|=0;r[1]=`_${t}`}else r[1]=\"_0\";return r[0]=`${t}`,r}};class it{constructor(){this._$updated=!0}static toString(){return\"[class BitmapFilter]\"}static get namespace(){return\"next2d.filters.BitmapFilter\"}toString(){return\"[object BitmapFilter]\"}get namespace(){return\"next2d.filters.BitmapFilter\"}_$isUpdated(){return this._$updated}_$doChanged(){this._$updated=!0,((t=!0)=>{i=t})()}}class st extends it{constructor(t=4,e=4,i=1){super(),this._$blurX=4,this._$blurY=4,this._$quality=1,this.blurX=t,this.blurY=e,this.quality=i}static toString(){return\"[class BlurFilter]\"}static get namespace(){return\"next2d.filters.BlurFilter\"}toString(){return\"[object BlurFilter]\"}get namespace(){return\"next2d.filters.BlurFilter\"}static get STEP(){return[.5,1.05,1.4,1.55,1.75,1.9,2,2.15,2.2,2.3,2.5,3,3,3.5,3.5]}get blurX(){return this._$blurX}set blurX(t){(t=Y(+t,0,255,0))!==this._$blurX&&(this._$blurX=t,this._$doChanged())}get blurY(){return this._$blurY}set blurY(t){(t=Y(+t,0,255,0))!==this._$blurY&&(this._$blurY=t,this._$doChanged())}get quality(){return this._$quality}set quality(t){(t=Y(0|t,0,15,1))!==this._$quality&&(this._$quality=t,this._$doChanged())}clone(){return new st(this._$blurX,this._$blurY,this._$quality)}_$toArray(){return L(1,this._$blurX,this._$blurY,this._$quality)}_$generateFilterRect(t,e=0,i=0){const s=S(t.xMin,t.xMax,t.yMin,t.yMax);if(!this._$quality)return s;const n=st.STEP[this._$quality-1];let a=0>=this._$blurX?1:this._$blurX*n,h=0>=this._$blurY?1:this._$blurY*n;return e?a*=e:a=r.round(a),i?h*=i:h=r.round(h),s.xMin-=a,s.xMax+=2*a,s.yMin-=h,s.yMax+=2*h,s}_$canApply(){return 0!==this._$blurX&&0!==this._$blurY}_$applyFilter(e,i,s=!0){this._$updated=!1;const n=e.frameBuffer,a=n.currentAttachment,h=n.getTextureFromCurrentAttachment();if(!this._$canApply())return s?h:n.createTextureFromCurrentAttachment();let o=r.sqrt(i[0]*i[0]+i[1]*i[1]),_=r.sqrt(i[2]*i[2]+i[3]*i[3]);o/=t,_/=t,o*=2,_*=2;const l=S(0,h.width,0,h.height),c=this._$generateFilterRect(l,o,_);F(l);const $=0|r.ceil(c.xMax),u=0|r.ceil(c.yMax),d=r.ceil(r.abs(c.xMin)+.5*r.abs($-c.xMax)),g=r.ceil(r.abs(c.yMin)+.5*r.abs(u-c.yMax));e._$offsetX=d+e._$offsetX,e._$offsetY=g+e._$offsetY;const f=this._$blurX*o,m=this._$blurY*_;let p=1,x=1;f>128?p=.0625:f>64?p=.125:f>32?p=.25:f>16&&(p=.5),m>128?x=.0625:m>64?x=.125:m>32?x=.25:m>16&&(x=.5);const b=f*p,v=m*x,T=r.ceil($*p),A=r.ceil(u*x),M=n.createTextureAttachment(T,A),y=[M,n.createTextureAttachment(T,A)];let E=0;e._$bind(M),e.reset(),e.setTransform(p,0,0,x,0,0),e.drawImage(h,d,g,h.width,h.height),e.blend.toOneZero();let C=n.getTextureFromCurrentAttachment();for(let t=0;t<this._$quality;++t){if(this._$blurX>0){E=(E+1)%2;const t=y[E];e._$bind(t),e._$applyBlurFilter(C,!0,b),C=n.getTextureFromCurrentAttachment()}if(this._$blurY>0){E=(E+1)%2;const t=y[E];e._$bind(t),e._$applyBlurFilter(C,!1,v),C=n.getTextureFromCurrentAttachment()}}if(e.blend.reset(),1!==p||1!==x){const t=n.createTextureAttachment($,u);e._$bind(t),e.reset(),e.imageSmoothingEnabled=!0,e.setTransform(1/p,0,0,1/x,0,0),e.drawImage(C,0,0,T,A),C=n.getTextureFromCurrentAttachment(),e.reset(),e.setTransform(1,0,0,1,0,0),n.releaseAttachment(y[0],!0),n.releaseAttachment(y[1],!0),s?n.releaseAttachment(a,!0):n.releaseAttachment(t,!1)}else n.releaseAttachment(y[(E+1)%2],!0),s?n.releaseAttachment(a,!0):n.releaseAttachment(y[E],!1);return C}}class rt extends it{constructor(t=4,e=45,i=16777215,s=1,r=0,n=1,a=4,h=4,o=1,_=1,l=\"inner\",c=!1){super(),this._$blurFilter=new st(a,h,_),this._$distance=4,this._$angle=45,this._$highlightColor=16777215,this._$highlightAlpha=1,this._$shadowColor=0,this._$shadowAlpha=1,this._$strength=1,this._$type=\"inner\",this._$knockout=!1,this.distance=t,this.angle=e,this.highlightColor=i,this.highlightAlpha=s,this.shadowColor=r,this.shadowAlpha=n,this.strength=o,this.type=l,this.knockout=c}static toString(){return\"[class BevelFilter]\"}static get namespace(){return\"next2d.filters.BevelFilter\"}toString(){return\"[object BevelFilter]\"}get namespace(){return\"next2d.filters.BevelFilter\"}get angle(){return this._$angle}set angle(t){(t%=360)!==this._$angle&&(this._$angle=Y(t,-360,360,45),this._$doChanged())}get blurX(){return this._$blurFilter.blurX}set blurX(t){this._$blurFilter.blurX=t}get blurY(){return this._$blurFilter.blurY}set blurY(t){this._$blurFilter.blurY=t}get distance(){return this._$distance}set distance(t){(t=Y(+t,-255,255,4))!==this._$distance&&(this._$distance=t,this._$doChanged())}get highlightAlpha(){return this._$highlightAlpha}set highlightAlpha(t){(t=Y(+t,0,1,0))!==this._$highlightAlpha&&(this._$highlightAlpha=t,this._$doChanged())}get highlightColor(){return this._$highlightColor}set highlightColor(t){(t=Y(W(t),0,16777215,16777215))!==this._$highlightColor&&(this._$highlightColor=t,this._$doChanged())}get knockout(){return this._$knockout}set knockout(t){t!==this._$knockout&&(this._$knockout=!!t,this._$doChanged())}get quality(){return this._$blurFilter.quality}set quality(t){this._$blurFilter.quality=t}get shadowAlpha(){return this._$shadowAlpha}set shadowAlpha(t){(t=Y(+t,0,1,0))!==this._$shadowAlpha&&(this._$shadowAlpha=t,this._$doChanged())}get shadowColor(){return this._$shadowColor}set shadowColor(t){(t=Y(W(t),0,16777215,0))!==this._$shadowColor&&(this._$shadowColor=t,this._$doChanged())}get strength(){return this._$strength}set strength(t){(t=Y(0|t,0,255,0))!==this._$strength&&(this._$strength=t,this._$doChanged())}get type(){return this._$type}set type(t){(t=`${t}`)!==this._$type&&(this._$type=t,this._$doChanged())}clone(){return new rt(this._$distance,this._$angle,this._$highlightColor,this._$highlightAlpha,this._$shadowColor,this._$shadowAlpha,this._$blurFilter.blurX,this._$blurFilter.blurY,this._$strength,this._$blurFilter.quality,this._$type,this._$knockout)}_$toArray(){return L(0,this._$distance,this._$angle,this._$highlightColor,this._$highlightAlpha,this._$shadowColor,this._$shadowAlpha,this._$blurFilter.blurX,this._$blurFilter.blurY,this._$strength,this._$blurFilter.quality,this._$type,this._$knockout)}_$isUpdated(){return this._$updated||this._$blurFilter._$isUpdated()}_$generateFilterRect(t,e=0,i=0){let s=S(t.xMin,t.xMax,t.yMin,t.yMax);if(!this._$canApply())return s;s=this._$blurFilter._$generateFilterRect(s,e,i);const n=this._$angle*p;let a=r.abs(r.cos(n)*this._$distance),h=r.abs(r.sin(n)*this._$distance);return e&&(a*=e),i&&(h*=i),s.xMin=r.min(s.xMin,a),a>0&&(s.xMax+=a),s.yMin=r.min(s.yMin,h),h>0&&(s.yMax+=h),s}_$canApply(){return this._$strength>0&&0!==this._$distance&&this._$blurFilter._$canApply()}_$applyFilter(e,i){this._$updated=!1;const s=e.frameBuffer,n=s.currentAttachment;if(!n)throw new Error(\"the current attachment is null.\");e.setTransform(1,0,0,1,0,0);const a=s.getTextureFromCurrentAttachment();if(!this._$canApply())return a;const h=n.width,o=n.height,_=e._$offsetX,l=e._$offsetY;let c=r.sqrt(i[0]*i[0]+i[1]*i[1]),$=r.sqrt(i[2]*i[2]+i[3]*i[3]);c/=t,$/=t,c*=2,$*=2;const u=this._$angle*p,d=r.cos(u)*this._$distance*c,g=r.sin(u)*this._$distance*$,f=s.createTextureAttachment(h,o);e._$bind(f),e.reset(),e.drawImage(a,0,0,h,o),e.globalCompositeOperation=\"erase\",e.drawImage(a,2*d,2*g,h,o);const m=this._$blurFilter._$applyFilter(e,i,!1),x=m.width,b=m.height,v=r.ceil(x+2*r.abs(d)),T=r.ceil(b+2*r.abs(g)),A=\"inner\"===this._$type,M=A?h:v,y=A?o:T,E=r.abs(d),C=r.abs(g),S=(x-h)/2,F=(b-o)/2,B=A?0:E+S,w=A?0:C+F,R=A?-S-d:E-d,I=A?-F-g:C-g;return e._$bind(n),s.releaseAttachment(f,!0),e._$applyBitmapFilter(m,M,y,h,o,B,w,x,b,R,I,!1,this._$type,this._$knockout,this._$strength,null,null,null,q(this._$highlightColor,this._$highlightAlpha,!0),j(this._$highlightColor,this._$highlightAlpha,!0),K(this._$highlightColor,this._$highlightAlpha,!0),this._$highlightAlpha,q(this._$shadowColor,this._$shadowAlpha,!0),j(this._$shadowColor,this._$shadowAlpha,!0),K(this._$shadowColor,this._$shadowAlpha,!0),this._$shadowAlpha),e._$offsetX=_+B,e._$offsetY=l+w,s.releaseTexture(m),s.getTextureFromCurrentAttachment()}}class nt extends it{constructor(t=null){super(),this._$matrix=[1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0],this.matrix=t}static toString(){return\"[class ColorMatrixFilter]\"}static get namespace(){return\"next2d.filters.ColorMatrixFilter\"}toString(){return\"[object ColorMatrixFilter]\"}get namespace(){return\"next2d.filters.ColorMatrixFilter\"}get matrix(){return this._$matrix}set matrix(t){if(t&&n.isArray(t)&&20===t.length){for(let e=0;e<20;++e)if(t[e]!==this._$matrix[e]){this._$doChanged();break}this._$matrix=t}}clone(){return new nt(this._$matrix)}_$toArray(){return L(2,this._$matrix)}_$generateFilterRect(t){return t}_$canApply(){return!0}_$applyFilter(t){this._$updated=!1;const e=t.frameBuffer,i=e.currentAttachment;t.setTransform(1,0,0,1,0,0);const s=e.getTextureFromCurrentAttachment(),r=s.width,n=s.height,a=e.createTextureAttachment(r,n);return t._$bind(a),t.reset(),t._$applyColorMatrixFilter(s,this._$matrix),e.releaseAttachment(i,!0),e.getTextureFromCurrentAttachment()}}class at extends it{constructor(t=0,e=0,i=null,s=1,r=0,n=!0,a=!0,h=0,o=0){super(),this._$matrixX=0,this._$matrixY=0,this._$matrix=null,this._$divisor=1,this._$bias=0,this._$preserveAlpha=!0,this._$clamp=!0,this._$color=0,this._$alpha=0,this.matrixX=t,this.matrixY=e,this.matrix=i,this.divisor=s,this.bias=r,this.preserveAlpha=n,this.clamp=a,this.color=h,this.alpha=o}static toString(){return\"[class ConvolutionFilter]\"}static get namespace(){return\"next2d.filters.ConvolutionFilter\"}toString(){return\"[object ConvolutionFilter]\"}get namespace(){return\"next2d.filters.ConvolutionFilter\"}get alpha(){return this._$alpha}set alpha(t){(t=Y(+t,0,1,0))!==this._$alpha&&(this._$alpha=t,this._$doChanged())}get bias(){return this._$bias}set bias(t){t!==this._$bias&&(this._$bias=0|t,this._$doChanged())}get clamp(){return this._$clamp}set clamp(t){t!==this._$clamp&&(this._$clamp=!!t,this._$doChanged())}get color(){return this._$color}set color(t){(t=Y(W(t),0,16777215,0))!==this._$color&&(this._$color=t,this._$doChanged())}get divisor(){return this._$divisor}set divisor(t){t!==this._$divisor&&(this._$divisor=0|t,this._$doChanged())}get matrix(){return this._$matrix}set matrix(t){n.isArray(this._$matrix)&&O(this._$matrix),this._$matrix=n.isArray(t)?t:null,this._$doChanged()}get matrixX(){return this._$matrixX}set matrixX(t){(t=0|Y(0|t,0,15,0))!==this._$matrixX&&(this._$matrixX=t,this._$doChanged())}get matrixY(){return this._$matrixY}set matrixY(t){(t=0|Y(0|t,0,15,0))!==this._$matrixY&&(this._$matrixY=t,this._$doChanged())}get preserveAlpha(){return this._$preserveAlpha}set preserveAlpha(t){t!==this._$preserveAlpha&&(this._$preserveAlpha=!!t,this._$doChanged())}clone(){return new at(this._$matrixX,this._$matrixY,this._$matrix?this._$matrix.slice():null,this._$divisor,this._$bias,this._$preserveAlpha,this._$clamp,this._$color,this._$alpha)}_$toArray(){return L(3,this._$matrixX,this._$matrixY,this._$matrix,this._$divisor,this._$bias,this._$preserveAlpha,this._$clamp,this._$color,this._$alpha)}_$generateFilterRect(t){return t}_$canApply(){return null!==this._$matrix&&this._$matrixX*this._$matrixY===this._$matrix.length}_$applyFilter(t){this._$updated=!1;const e=t.frameBuffer,i=e.currentAttachment;t.setTransform(1,0,0,1,0,0);const s=e.getTextureFromCurrentAttachment();return this._$canApply()&&this._$matrix?(t._$applyConvolutionFilter(s,this._$matrixX,this._$matrixY,this._$matrix,this._$divisor,this._$bias,this._$preserveAlpha,this._$clamp,q(this._$color,this._$alpha,!1),j(this._$color,this._$alpha,!1),K(this._$color,this._$alpha,!1),this._$alpha),e.releaseAttachment(i,!0),e.getTextureFromCurrentAttachment()):s}}class ht extends it{constructor(t=null,e=null,i=0,s=0,r=0,n=0,a=\"wrap\",h=0,o=0){super(),this._$mapBitmap=null,this._$mapPoint=null,this._$componentX=0,this._$componentY=0,this._$scaleX=0,this._$scaleY=0,this._$mode=\"wrap\",this._$color=0,this._$alpha=0,this.mapBitmap=t,this.mapPoint=e,this.componentX=i,this.componentY=s,this.scaleX=r,this.scaleY=n,this.mode=a,this.color=h,this.alpha=o}static toString(){return\"[class DisplacementMapFilter]\"}static get namespace(){return\"next2d.filters.DisplacementMapFilter\"}toString(){return\"[object DisplacementMapFilter]\"}get namespace(){return\"next2d.filters.DisplacementMapFilter\"}get alpha(){return this._$alpha}set alpha(t){(t=Y(+t,0,1,0))!==this._$alpha&&(this._$alpha=t,this._$doChanged())}get color(){return this._$color}set color(t){(t=Y(W(t),0,16777215,0))!==this._$color&&(this._$color=t,this._$doChanged())}get componentX(){return this._$componentX}set componentX(t){t!==this._$componentX&&(this._$componentX=t,this._$doChanged())}get componentY(){return this._$componentY}set componentY(t){t!==this._$componentY&&(this._$componentY=t,this._$doChanged())}get mapBitmap(){return this._$mapBitmap}set mapBitmap(t){t!==this._$mapBitmap&&(this._$mapBitmap=t,this._$doChanged())}get mapPoint(){return this._$mapPoint}set mapPoint(t){t!==this._$mapPoint&&(this._$mapPoint=t,this._$doChanged())}get mode(){return this._$mode}set mode(t){t!==this._$mode&&(this._$mode=t,this._$doChanged())}get scaleX(){return this._$scaleX}set scaleX(t){(t=Y(+t,-65535,65535,0))!==this._$scaleX&&(this._$scaleX=t,this._$doChanged())}get scaleY(){return this._$scaleY}set scaleY(t){(t=Y(+t,-65535,65535,0))!==this._$scaleY&&(this._$scaleY=t,this._$doChanged())}clone(){return new ht(this._$mapBitmap,this._$mapPoint,this._$componentX,this._$componentY,this._$scaleX,this._$scaleY,this._$mode,this._$color,this._$alpha)}_$toArray(){return L(4,this._$mapBitmap,this._$mapPoint,this._$componentX,this._$componentY,this._$scaleX,this._$scaleY,this._$mode,this._$color,this._$alpha)}_$generateFilterRect(t){return t}_$canApply(){return null!==this._$mapBitmap&&this._$componentX>0&&this._$componentY>0&&0!==this._$scaleX&&0!==this._$scaleY}_$applyFilter(t,e){this._$updated=!1;const i=t.frameBuffer,s=i.currentAttachment;t.setTransform(1,0,0,1,0,0);const n=i.getTextureFromCurrentAttachment();if(!this._$canApply()||!s||!this._$mapBitmap)return n;const a=r.sqrt(e[0]*e[0]+e[1]*e[1]),h=r.sqrt(e[2]*e[2]+e[3]*e[3]);return t._$applyDisplacementMapFilter(n,this._$mapBitmap,n.width/a,n.height/h,this._$mapPoint,this._$componentX,this._$componentY,this._$scaleX,this._$scaleY,this._$mode,q(this._$color,this._$alpha,!0),j(this._$color,this._$alpha,!0),K(this._$color,this._$alpha,!0),this._$alpha),i.releaseAttachment(s,!0),i.getTextureFromCurrentAttachment()}}class ot extends it{constructor(t=4,e=45,i=0,s=1,r=4,n=4,a=1,h=1,o=!1,_=!1,l=!1){super(),this._$blurFilter=new st(r,n,h),this._$distance=4,this._$angle=45,this._$color=0,this._$alpha=1,this._$strength=1,this._$inner=!1,this._$knockout=!1,this._$hideObject=!1,this.distance=t,this.angle=e,this.color=i,this.alpha=s,this.strength=a,this.inner=o,this.knockout=_,this.hideObject=l}static toString(){return\"[class DropShadowFilter]\"}static get namespace(){return\"next2d.filters.DropShadowFilter\"}toString(){return\"[object DropShadowFilter]\"}get namespace(){return\"next2d.filters.DropShadowFilter\"}get alpha(){return this._$alpha}set alpha(t){(t=Y(+t,0,1,0))!==this._$alpha&&(this._$alpha=t,this._$doChanged())}get angle(){return this._$angle}set angle(t){(t%=360)!==this._$angle&&(this._$angle=Y(t,-360,360,45),this._$doChanged())}get blurX(){return this._$blurFilter.blurX}set blurX(t){this._$blurFilter.blurX=t}get blurY(){return this._$blurFilter.blurY}set blurY(t){this._$blurFilter.blurY=t}get color(){return this._$color}set color(t){(t=Y(W(t),0,16777215,0))!==this._$color&&(this._$color=t,this._$doChanged())}get distance(){return this._$distance}set distance(t){(t=Y(+t,-255,255,4))!==this._$distance&&(this._$distance=t,this._$doChanged())}get hideObject(){return this._$hideObject}set hideObject(t){t!==this._$hideObject&&(this._$hideObject=!!t,this._$doChanged())}get inner(){return this._$inner}set inner(t){t!==this._$inner&&(this._$inner=!!t,this._$doChanged())}get knockout(){return this._$knockout}set knockout(t){t!==this._$knockout&&(this._$knockout=!!t,this._$doChanged())}get quality(){return this._$blurFilter.quality}set quality(t){this._$blurFilter.quality=t}get strength(){return this._$strength}set strength(t){(t=Y(0|t,0,255,0))!==this._$strength&&(this._$strength=t,this._$doChanged())}clone(){return new ot(this._$distance,this._$angle,this._$color,this._$alpha,this._$blurFilter.blurX,this._$blurFilter.blurY,this._$strength,this._$blurFilter.quality,this._$inner,this._$knockout,this._$hideObject)}_$toArray(){return L(5,this._$distance,this._$angle,this._$color,this._$alpha,this._$blurFilter.blurX,this._$blurFilter.blurY,this._$strength,this._$blurFilter.quality,this._$inner,this._$knockout,this._$hideObject)}_$isUpdated(){return this._$updated||this._$blurFilter._$isUpdated()}_$generateFilterRect(t,e=0,i=0){let s=S(t.xMin,t.xMax,t.yMin,t.yMax);if(!this._$canApply())return s;s=this._$blurFilter._$generateFilterRect(s,e,i);const n=this._$angle*p;let a=r.cos(n)*this._$distance,h=r.sin(n)*this._$distance;return e&&(a*=e),i&&(h*=i),s.xMin=r.min(s.xMin,a),a>0&&(s.xMax+=a),s.yMin=r.min(s.yMin,h),h>0&&(s.yMax+=h),s}_$canApply(){return this._$alpha>0&&this._$strength>0&&this._$blurFilter._$canApply()}_$applyFilter(e,i){const s=e.frameBuffer,n=s.currentAttachment;if(!n)throw new Error(\"the current attachment is null.\");if(e.setTransform(1,0,0,1,0,0),!this._$canApply())return s.getTextureFromCurrentAttachment();const a=n.width,h=n.height,o=e._$offsetX,_=e._$offsetY,l=this._$blurFilter._$applyFilter(e,i,!1),c=l.width,$=l.height,u=e._$offsetX,d=e._$offsetY,g=u-o,f=d-_;let m=r.sqrt(i[0]*i[0]+i[1]*i[1]),x=r.sqrt(i[2]*i[2]+i[3]*i[3]);m/=t,x/=t,m*=2,x*=2;const b=this._$angle*p,v=r.cos(b)*this._$distance*m,T=r.sin(b)*this._$distance*x,A=this._$inner?a:c+r.max(0,r.abs(v)-g),M=this._$inner?h:$+r.max(0,r.abs(T)-f),y=r.ceil(A),E=r.ceil(M),C=(y-A)/2,S=(E-M)/2,F=this._$inner?0:r.max(0,g-v)+C,B=this._$inner?0:r.max(0,f-T)+S,w=this._$inner?v-u:(v>0?r.max(0,v-g):0)+C,R=this._$inner?T-d:(T>0?r.max(0,T-f):0)+S;let I,P;return this._$inner?(I=\"inner\",P=this._$knockout||this._$hideObject):!this._$knockout&&this._$hideObject?(I=\"full\",P=!0):(I=\"outer\",P=this._$knockout),e._$bind(n),e._$applyBitmapFilter(l,y,E,a,h,F,B,c,$,w,R,!0,I,P,this._$strength,null,null,null,q(this._$color,this._$alpha,!0),j(this._$color,this._$alpha,!0),K(this._$color,this._$alpha,!0),this._$alpha,0,0,0,0),e._$offsetX=o+F,e._$offsetY=_+B,s.releaseTexture(l),s.getTextureFromCurrentAttachment()}}class _t extends it{constructor(t=0,e=1,i=4,s=4,r=1,n=1,a=!1,h=!1){super(),this._$blurFilter=new st(i,s,n),this._$color=0,this._$alpha=1,this._$strength=1,this._$inner=!1,this._$knockout=!1,this.color=t,this.alpha=e,this.strength=r,this.inner=a,this.knockout=h}static toString(){return\"[class GlowFilter]\"}static get namespace(){return\"next2d.filters.GlowFilter\"}toString(){return\"[object GlowFilter]\"}get namespace(){return\"next2d.filters.GlowFilter\"}get alpha(){return this._$alpha}set alpha(t){(t=Y(+t,0,1,0))!==this._$alpha&&(this._$alpha=t,this._$doChanged())}get blurX(){return this._$blurFilter.blurX}set blurX(t){this._$blurFilter.blurX=t}get blurY(){return this._$blurFilter.blurY}set blurY(t){this._$blurFilter.blurY=t}get color(){return this._$color}set color(t){(t=Y(W(t),0,16777215,4))!==this._$color&&(this._$color=t,this._$doChanged())}get inner(){return this._$inner}set inner(t){t!==this._$inner&&(this._$inner=!!t,this._$doChanged())}get knockout(){return this._$knockout}set knockout(t){t!==this._$knockout&&(this._$knockout=!!t,this._$doChanged())}get quality(){return this._$blurFilter.quality}set quality(t){this._$blurFilter.quality=t}get strength(){return this._$strength}set strength(t){(t=Y(0|t,0,255,0))!==this._$strength&&(this._$strength=t,this._$doChanged())}clone(){return new _t(this._$color,this._$alpha,this._$blurFilter.blurX,this._$blurFilter.blurY,this._$strength,this._$blurFilter.quality,this._$inner,this._$knockout)}_$toArray(){return L(6,this._$color,this._$alpha,this._$blurFilter.blurX,this._$blurFilter.blurY,this._$strength,this._$blurFilter.quality,this._$inner,this._$knockout)}_$isUpdated(){return this._$updated||this._$blurFilter._$isUpdated()}_$generateFilterRect(t,e=0,i=0){const s=S(t.xMin,t.xMax,t.yMin,t.yMax);return this._$canApply()?this._$blurFilter._$generateFilterRect(s,e,i):s}_$canApply(){return this._$alpha>0&&this._$strength>0&&this._$blurFilter._$canApply()}_$applyFilter(t,e){const i=t.frameBuffer,s=i.currentAttachment;if(!s)throw new Error(\"the current attachment is null.\");if(this._$updated=!1,t.setTransform(1,0,0,1,0,0),!this._$canApply())return i.getTextureFromCurrentAttachment();const r=s.width,n=s.height,a=t._$offsetX,h=t._$offsetY,o=this._$blurFilter._$applyFilter(t,e,!1),_=o.width,l=o.height,c=t._$offsetX,$=t._$offsetY,u=this._$inner?r:_,d=this._$inner?n:l,g=this._$inner?0:c-a,f=this._$inner?0:$-h,m=this._$inner?-c:0,p=this._$inner?-$:0,x=this._$inner?\"inner\":\"outer\";return t._$bind(s),t._$applyBitmapFilter(o,u,d,r,n,g,f,_,l,m,p,!0,x,this._$knockout,this._$strength,null,null,null,q(this._$color,this._$alpha,!0),j(this._$color,this._$alpha,!0),K(this._$color,this._$alpha,!0),this._$alpha,0,0,0,0),t._$offsetX=a+g,t._$offsetY=h+f,i.releaseTexture(o),i.getTextureFromCurrentAttachment()}}class lt extends it{constructor(t=4,e=45,i=null,s=null,r=null,n=4,a=4,h=1,o=1,_=\"inner\",l=!1){super(),this._$blurFilter=new st(n,a,o),this._$distance=4,this._$angle=45,this._$colors=null,this._$alphas=null,this._$ratios=null,this._$strength=1,this._$type=\"inner\",this._$knockout=!1,this.distance=t,this.angle=e,this.colors=i,this.alphas=s,this.ratios=r,this.strength=h,this.type=_,this.knockout=l}static toString(){return\"[class GradientBevelFilter]\"}static get namespace(){return\"next2d.filters.GradientBevelFilter\"}toString(){return\"[object GradientBevelFilter]\"}get namespace(){return\"next2d.filters.GradientBevelFilter\"}get alphas(){return this._$alphas}set alphas(t){if(t!==this._$alphas){if(this._$alphas=t,n.isArray(t)){for(let e=0;e<t.length;++e){const i=t[e];t[e]=Y(+i,0,1,0)}this._$alphas=t}this._$doChanged()}}get angle(){return this._$angle}set angle(t){(t=Y(t%360,-360,360,45))!==this._$angle&&(this._$angle=t,this._$doChanged())}get blurX(){return this._$blurFilter.blurX}set blurX(t){this._$blurFilter.blurX=t}get blurY(){return this._$blurFilter.blurY}set blurY(t){this._$blurFilter.blurY=t}get colors(){return this._$colors}set colors(t){if(this._$colors!==t){if(this._$colors=t,n.isArray(t)){for(let e=0;e<t.length;++e)t[e]=Y(W(t[e]),0,16777215,0);this._$colors=t}this._$doChanged()}}get distance(){return this._$distance}set distance(t){(t=Y(+t,-255,255,4))!==this._$distance&&(this._$distance=t,this._$doChanged())}get knockout(){return this._$knockout}set knockout(t){t!==this._$knockout&&(this._$knockout=!!t,this._$doChanged())}get quality(){return this._$blurFilter.quality}set quality(t){this._$blurFilter.quality=t}get ratios(){return this._$ratios}set ratios(t){if(this._$ratios!==t){if(this._$ratios=t,n.isArray(t)){for(let e=0;e<t.length;++e)t[e]=Y(+t[e],0,255,0);this._$ratios=t}this._$doChanged()}}get strength(){return this._$strength}set strength(t){(t=Y(0|t,0,255,0))!==this._$strength&&(this._$strength=t,this._$doChanged())}get type(){return this._$type}set type(t){t!==this._$type&&(this._$type=t,this._$doChanged())}clone(){return new lt(this._$distance,this._$angle,this._$colors?this._$colors.slice():null,this._$alphas?this._$alphas.slice():null,this._$ratios?this._$ratios.slice():null,this._$blurFilter.blurX,this._$blurFilter.blurY,this._$strength,this._$blurFilter.quality,this._$type,this._$knockout)}_$toArray(){return L(7,this._$distance,this._$angle,this._$colors,this._$alphas,this._$ratios,this._$blurFilter.blurX,this._$blurFilter.blurY,this._$strength,this._$blurFilter.quality,this._$type,this._$knockout)}_$isUpdated(){return this._$updated||this._$blurFilter._$isUpdated()}_$generateFilterRect(t,e=0,i=0){let s=S(t.xMin,t.xMax,t.yMin,t.yMax);if(!this._$canApply())return s;s=this._$blurFilter._$generateFilterRect(s,e,i);const n=this._$angle*p;let a=r.abs(r.cos(n)*this._$distance),h=r.abs(r.sin(n)*this._$distance);return e&&(a*=e),i&&(h*=i),s.xMin=r.min(s.xMin,a),a>0&&(s.xMax+=a),s.yMin=r.min(s.yMin,h),h>0&&(s.yMax+=h),s}_$canApply(){return this._$strength>0&&this._$distance>0&&null!==this._$alphas&&null!==this._$ratios&&null!==this._$colors&&this._$blurFilter._$canApply()}_$applyFilter(e,i){this._$updated=!1;const s=e.frameBuffer,n=s.currentAttachment;e.setTransform(1,0,0,1,0,0);const a=s.getTextureFromCurrentAttachment();if(!this._$canApply()||!n)return a;const h=n.width,o=n.height,_=e._$offsetX,l=e._$offsetY;let c=r.sqrt(i[0]*i[0]+i[1]*i[1]),$=r.sqrt(i[2]*i[2]+i[3]*i[3]);c/=t,$/=t,c*=2,$*=2;const u=+this._$angle*p,d=+r.cos(u)*this._$distance*c,g=+r.sin(u)*this._$distance*$,f=s.createTextureAttachment(h,o);e._$bind(f),e.reset(),e.drawImage(a,0,0,h,o),e.globalCompositeOperation=\"erase\",e.drawImage(a,2*d,2*g,h,o);const m=this._$blurFilter._$applyFilter(e,i,!1),x=m.width,b=m.height,v=r.ceil(x+2*r.abs(d)),T=r.ceil(b+2*r.abs(g)),A=\"inner\"===this._$type,M=A?h:v,y=A?o:T,E=r.abs(d),C=r.abs(g),S=(x-h)/2,F=(b-o)/2,B=A?0:E+S,w=A?0:C+F,R=A?-S-d:E-d,I=A?-F-g:C-g;return e._$bind(n),e._$applyBitmapFilter(m,M,y,h,o,B,w,x,b,R,I,!1,this._$type,this._$knockout,this._$strength,this._$ratios,this._$colors,this._$alphas,0,0,0,0,0,0,0,0),e._$offsetX=_+B,e._$offsetY=l+w,s.releaseAttachment(f,!0),s.getTextureFromCurrentAttachment()}}class ct extends it{constructor(t=4,e=45,i=null,s=null,r=null,n=4,a=4,h=1,o=1,_=\"inner\",l=!1){super(),this._$blurFilter=new st(n,a,o),this._$distance=4,this._$angle=45,this._$colors=null,this._$alphas=null,this._$ratios=null,this._$strength=1,this._$type=\"inner\",this._$knockout=!1,this.distance=t,this.angle=e,this.colors=i,this.alphas=s,this.ratios=r,this.strength=h,this.type=_,this.knockout=l}static toString(){return\"[class GradientGlowFilter]\"}static get namespace(){return\"next2d.filters.GradientGlowFilter\"}toString(){return\"[object GradientGlowFilter]\"}get namespace(){return\"next2d.filters.GradientGlowFilter\"}get alphas(){return this._$alphas}set alphas(t){if(t!==this._$alphas){if(this._$alphas=t,n.isArray(t)){for(let e=0;e<t.length;++e)t[e]=Y(+t[e],0,1,0);this._$alphas=t}this._$doChanged()}}get angle(){return this._$angle}set angle(t){(t=Y(t%360,-360,360,45))!==this._$angle&&(this._$angle=t,this._$doChanged())}get blurX(){return this._$blurFilter.blurX}set blurX(t){this._$blurFilter.blurX=t}get blurY(){return this._$blurFilter.blurY}set blurY(t){this._$blurFilter.blurY=t}get colors(){return this._$colors}set colors(t){if(this._$colors!==t){if(this._$colors=t,n.isArray(t)){for(let e=0;e<t.length;++e)t[e]=Y(W(t[e]),0,16777215,0);this._$colors=t}this._$doChanged()}}get distance(){return this._$distance}set distance(t){(t=Y(+t,-255,255,4))!==this._$distance&&(this._$distance=t,this._$doChanged())}get knockout(){return this._$knockout}set knockout(t){t!==this._$knockout&&(this._$knockout=!!t,this._$doChanged())}get quality(){return this._$blurFilter.quality}set quality(t){this._$blurFilter.quality=t}get ratios(){return this._$ratios}set ratios(t){if(this._$ratios!==t){if(this._$ratios=t,n.isArray(t)){for(let e=0;e<t.length;++e)t[e]=Y(+t[e],0,255,0);this._$ratios=t}this._$doChanged()}}get strength(){return this._$strength}set strength(t){(t=Y(0|t,0,255,0))!==this._$strength&&(this._$strength=t,this._$doChanged())}get type(){return this._$type}set type(t){t!==this._$type&&(this._$type=t,this._$doChanged())}clone(){return new ct(this._$distance,this._$angle,this._$colors,this._$alphas,this._$ratios,this._$blurFilter.blurX,this._$blurFilter.blurY,this._$strength,this._$blurFilter.quality,this._$type,this._$knockout)}_$toArray(){return L(8,this._$distance,this._$angle,this._$colors,this._$alphas,this._$ratios,this._$blurFilter.blurX,this._$blurFilter.blurY,this._$strength,this._$blurFilter.quality,this._$type,this._$knockout)}_$isUpdated(){return this._$updated||this._$blurFilter._$isUpdated()}_$generateFilterRect(t,e=0,i=0){let s=S(t.xMin,t.xMax,t.yMin,t.yMax);if(!this._$canApply())return s;s=this._$blurFilter._$generateFilterRect(s,e,i);const n=this._$angle*p;let a=r.abs(r.cos(n)*this._$distance),h=r.abs(r.sin(n)*this._$distance);return e&&(a*=e),i&&(h*=i),s.xMin=r.min(s.xMin,a),a>0&&(s.xMax+=a),s.yMin=r.min(s.yMin,h),h>0&&(s.yMax+=h),s}_$canApply(){return this._$strength>0&&this._$distance>0&&null!==this._$alphas&&null!==this._$ratios&&null!==this._$colors&&this._$blurFilter._$canApply()}_$applyFilter(e,i){this._$updated=!1;const s=e.frameBuffer,n=s.currentAttachment;if(e.setTransform(1,0,0,1,0,0),!this._$canApply()||!n)return s.getTextureFromCurrentAttachment();const a=n.width,h=n.height,o=e._$offsetX,_=e._$offsetY,l=this._$blurFilter._$applyFilter(e,i,!1),c=l.width,$=l.height,u=e._$offsetX,d=e._$offsetY,g=u-o,f=d-_;let m=r.sqrt(i[0]*i[0]+i[1]*i[1]),x=r.sqrt(i[2]*i[2]+i[3]*i[3]);m/=t,x/=t,m*=2,x*=2;const b=+this._$angle*p,v=+r.cos(b)*this._$distance*m,T=+r.sin(b)*this._$distance*x,A=\"inner\"===this.type,M=A?a:c+r.max(0,r.abs(v)-g),y=A?h:$+r.max(0,r.abs(T)-f),E=r.ceil(M),C=r.ceil(y),S=(E-M)/2,F=(C-y)/2,B=A?0:r.max(0,g-v)+S,w=A?0:r.max(0,f-T)+F,R=A?v-u:(v>0?r.max(0,v-g):0)+S,I=A?T-d:(T>0?r.max(0,T-f):0)+F;return e._$bind(n),e._$applyBitmapFilter(l,E,C,a,h,B,w,c,$,R,I,!0,this._$type,this._$knockout,this._$strength,this._$ratios,this._$colors,this._$alphas,0,0,0,0,0,0,0,0),e._$offsetX=o+B,e._$offsetY=_+w,s.releaseTexture(l),s.getTextureFromCurrentAttachment()}}class $t{constructor(){this._$instanceId=-1,this._$parentId=-1,this._$loaderInfoId=-1,this._$characterId=-1,this._$clipDepth=0,this._$depth=0,this._$isMask=!1,this._$updated=!0,this._$matrix=R(1,0,0,1,0,0),this._$colorTransform=P(1,1,1,1,0,0,0,0),this._$blendMode=\"normal\",this._$filters=null,this._$visible=!0,this._$maskId=-1,this._$maskMatrix=null,this._$isMask=!1,this._$xMin=0,this._$yMin=0,this._$xMax=0,this._$yMax=0,this._$scale9Grid=null,this._$matrixBase=null}_$shouldClip(t){const e=this._$getBounds(t),i=r.abs(e.xMax-e.xMin),s=r.abs(e.yMax-e.yMin);return F(e),!(!i||!s)}_$getLayerBounds(e){const i=this._$getBounds(),s=H(i,e);F(i);const n=this._$filters;if(!n||!n.length)return s;let a=S(0,r.abs(s.xMax-s.xMin),0,r.abs(s.yMax-s.yMin));F(s);let h=+r.sqrt(e[0]*e[0]+e[1]*e[1]),o=+r.sqrt(e[2]*e[2]+e[3]*e[3]);h/=t,o/=t,h*=2,o*=2;for(let t=0;t<n.length;++t)a=n[t]._$generateFilterRect(a,h,o);return a}_$getBounds(t=null){const e=S(this._$xMin,this._$xMax,this._$yMin,this._$yMax);if(!t)return e;let i=t;const s=this._$matrix;1===s[0]&&0===s[1]&&0===s[2]&&1===s[3]&&0===s[4]&&0===s[5]||(i=z(t,s));const r=H(e,i);return F(e),i!==t&&I(i),r}_$startClip(t,e){t.drawInstacedArray();const i=this._$getBounds(e),s=t._$startClip(i);if(F(i),!s)return!1;t._$enterClip(),t._$beginClipDef();let r=!1;return\"_$children\"in this&&(r=!0,t._$updateContainerClipFlag(!0)),this._$clip(t,e),this._$updated=!1,r&&(t._$updateContainerClipFlag(!1),t._$drawContainerClip()),t._$endClipDef(),!0}_$doChanged(){if(this._$updated=!0,this._$parentId>-1){const t=he.instances;if(!t.has(this._$parentId))return;const e=t.get(this._$parentId);e._$updated||e._$doChanged()}}_$update(t){if(this._$doChanged(),this._$visible=t.visible,\"depth\"in t&&(this._$depth=t.depth),\"isMask\"in t&&(this._$isMask=t.isMask),\"clipDepth\"in t&&(this._$clipDepth=t.clipDepth),\"maskId\"in t&&(this._$maskId=t.maskId,this._$maskId>-1&&t.maskMatrix&&(this._$maskMatrix=t.maskMatrix)),this._$matrix[0]=\"a\"in t?t.a:1,this._$matrix[1]=\"b\"in t?t.b:0,this._$matrix[2]=\"c\"in t?t.c:0,this._$matrix[3]=\"d\"in t?t.d:1,this._$matrix[4]=\"tx\"in t?t.tx:0,this._$matrix[5]=\"ty\"in t?t.ty:0,this._$colorTransform[0]=\"f0\"in t?t.f0:1,this._$colorTransform[1]=\"f1\"in t?t.f1:1,this._$colorTransform[2]=\"f2\"in t?t.f2:1,this._$colorTransform[3]=\"f3\"in t?t.f3:1,this._$colorTransform[4]=\"f4\"in t?t.f4:0,this._$colorTransform[5]=\"f5\"in t?t.f5:0,this._$colorTransform[6]=\"f6\"in t?t.f6:0,this._$colorTransform[7]=\"f7\"in t?t.f7:0,this._$blendMode=t.blendMode||\"normal\",this._$filters=null,t.filters&&t.filters.length){this._$filters=L();for(let e=0;e<t.filters.length;++e){const i=t.filters[e];switch(i.shift()){case 0:this._$filters.push(new rt(...i));break;case 1:this._$filters.push(new st(...i));break;case 2:this._$filters.push(new nt(...i));break;case 3:this._$filters.push(new at(...i));break;case 4:this._$filters.push(new ht(...i));break;case 5:this._$filters.push(new ot(...i));break;case 6:this._$filters.push(new _t(...i));break;case 7:this._$filters.push(new lt(...i));break;case 8:this._$filters.push(new ct(...i))}}}t.grid&&(this._$scale9Grid=t.grid,t.matrixBase&&(this._$matrixBase=t.matrixBase))}_$canApply(t=null){if(t)for(let e=0;e<t.length;++e)if(t[e]._$canApply())return!0;return!1}_$remove(){this._$doChanged();const t=he;et.setRemoveTimer(this._$instanceId),this._$loaderInfoId>-1&&this._$characterId&&et.setRemoveTimer(`${this._$loaderInfoId}@${this._$characterId}`),t.instances.delete(this._$instanceId),this._$instanceId=-1,this._$parentId=-1,this._$loaderInfoId=-1,this._$characterId=-1,this._$blendMode=\"normal\",this._$filters=null,this._$visible=!0,this._$maskId=-1,this._$isMask=!1,this._$depth=0,this._$clipDepth=0,this._$scale9Grid=null}_$isUpdated(){return this._$updated}_$isFilterUpdated(t,e=null,i=!1){if(this._$isUpdated())return!0;if(i&&e)for(let t=0;t<e.length;++t)if(e[t]._$isUpdated())return!0;const s=et.get([this._$instanceId,\"f\"]);return!s||s.filterState!==i||s.matrix!==`${t[0]}_${t[1]}_${t[2]}_${t[3]}`}_$applyFilter(t,e,i,s,n,a){const h=+r.sqrt(s[0]*s[0]+s[1]*s[1]),o=+r.sqrt(s[2]*s[2]+s[3]*s[3]),_=r.atan2(s[1],s[0]),l=r.atan2(0-s[2],s[3]),c=R(r.cos(_),r.sin(_),0-r.sin(l),r.cos(l),n/2,a/2),$=R(1,0,0,1,0-i.width/2,0-i.height/2),u=z(c,$);I(c),I($);const d=t.frameBuffer,g=d.currentAttachment,f=d.createCacheAttachment(n,a);t._$bind(f),t.reset(),t.setTransform(u[0],u[1],u[2],u[3],u[4],u[5]),I(u),t.drawImage(i,0,0,i.width,i.height),t._$offsetX=0,t._$offsetY=0;const m=R(h,0,0,o,0,0);let p=null;for(let i=0;i<e.length;++i)p=e[i]._$applyFilter(t,m);if(I(m),!p)return i;const x=t._$offsetX,b=t._$offsetY;return t._$offsetX=0,t._$offsetY=0,p.offsetX=x,p.offsetY=b,p.matrix=s[0]+\"_\"+s[1]+\"_\"+s[2]+\"_\"+s[3],p.filterState=!0,t._$bind(g),d.releaseAttachment(f,!1),p}_$drawFilter(t,e,i,s,n,a=null){const h=L(this._$instanceId,\"f\");let o=et.get(h);const _=this._$isFilterUpdated(e,i,!0);if(o&&!_)return t.cachePosition=o,o;o&&et.set(h,null);const l=t.frameBuffer,c=a||t.getTextureFromRect(t.cachePosition),$=this._$applyFilter(t,i,c,e,s,n);l.textureManager.release(c);const u=this._$getLayerBounds(e);return o=l.createCachePosition(r.ceil(r.abs(u.xMax-u.xMin)),r.ceil(r.abs(u.yMax-u.yMin))),F(u),o.filterState=!0,o.matrix=`${e[0]}_${e[1]}_${e[2]}_${e[3]}_0_0`,o.offsetX=$.offsetX,o.offsetY=$.offsetY,t.drawTextureFromRect($,o),et.set(h,o),O(h),o}}class ut extends $t{constructor(){super(),this._$recodes=null,this._$maxAlpha=0,this._$canDraw=!1,this._$uniqueKey=\"\",this._$cacheKeys=L(),this._$cacheParams=L(0,0,0),this._$bitmapId=0,this._$mode=\"shape\"}_$clip(t,e){if(!this._$recodes)return;const i=this._$getBounds(),n=H(i,e);F(i);const a=r.ceil(r.abs(n.xMax-n.xMin)),h=r.ceil(r.abs(n.yMax-n.yMin));switch(F(n),!0){case 0===a:case 0===h:case a===-1/0:case h===-1/0:case a===s:case h===s:return}t.reset(),t.setTransform(e[0],e[1],e[2],e[3],e[4],e[5]),this._$runCommand(t,this._$recodes,null,!0),t.clip()}_$createCacheKey(){if(!this._$recodes)return\"\";let t=0;for(let e=0;e<this._$recodes.length;e++)t=(t<<5)-t+this._$recodes[e],t|=0;return`${t}`}_$createBitmapTexture(t,e,i,s,r,n){if(\"bitmap\"!==this._$mode)return null;t.drawInstacedArray();const a=t.frameBuffer,h=a.currentAttachment,o=a.createCacheAttachment(r,n);t._$bind(o),t.reset();const _=R(i,0,0,s,r/2,n/2),l=t.getTextureFromRect(e),c=R(1,0,0,1,-l.width/2,-l.height/2),$=z(_,c);I(_),I(c),t.setTransform($[0],$[1],$[2],$[3],$[4],$[5]),t.drawImage(l,0,0,l.width,l.height);const u=a.getTextureFromCurrentAttachment();return t._$bind(h),a.releaseAttachment(o),a.textureManager.release(l),u}_$draw(t,e,i,n=\"normal\",a=null){if(!(this._$visible&&this._$recodes&&this._$maxAlpha&&this._$canDraw))return;const o=Y(i[3]+i[7]/255,0,1,0);if(!o)return;const _=this._$matrix;let l=null!==this._$scale9Grid;l&&(l=l&&r.abs(_[1])<.001&&r.abs(_[2])<1e-4);const c=S(this._$xMin,this._$xMax,this._$yMin,this._$yMax),$=H(c,e),u=$.xMax,d=$.xMin,g=$.yMax,f=$.yMin;F($);const m=r.ceil(r.abs(u-d)),p=r.ceil(r.abs(g-f));switch(!0){case 0===m:case 0===p:case m===-1/0:case p===-1/0:case m===s:case p===s:return}let x=+r.sqrt(e[0]*e[0]+e[1]*e[1]);if(!h.isInteger(x)){const t=x.toString(),e=t.indexOf(\"e\");-1!==e&&(x=+t.slice(0,e)),x=+x.toFixed(4)}let b=+r.sqrt(e[2]*e[2]+e[3]*e[3]);if(!h.isInteger(b)){const t=b.toString(),e=t.indexOf(\"e\");-1!==e&&(b=+t.slice(0,e)),b=+b.toFixed(4)}const v=null!==a&&a.length>0&&this._$canApply(a);let T=S(0,m,0,p);if(v&&a)for(let t=0;t<a.length;++t)T=a[t]._$generateFilterRect(T,x,b);const A=t.frameBuffer,M=A.currentAttachment;if(!M||d-T.xMin>M.width||f-T.yMin>M.height)return void F(T);if(0>d+T.xMax||0>f+T.yMax)return void F(T);if(F(T),\"\"===this._$uniqueKey&&(!l&&this._$loaderInfoId>-1&&this._$characterId>-1?this._$uniqueKey=`${this._$loaderInfoId}@${this._$characterId}`:this._$uniqueKey=this._$createCacheKey()),\"bitmap\"===this._$mode)this._$cacheKeys.length||(this._$cacheKeys=et.generateKeys(this._$uniqueKey));else if(!this._$cacheKeys.length||this._$cacheParams[0]!==x||this._$cacheParams[1]!==b||this._$cacheParams[2]!==i[7]){const t=L();t[0]=x,t[1]=b,this._$cacheKeys=et.generateKeys(this._$uniqueKey,t,i),O(t),this._$cacheParams[0]=x,this._$cacheParams[1]=b,this._$cacheParams[2]=i[7]}if(t.cachePosition=et.get(this._$cacheKeys),!t.cachePosition){const s=A.currentAttachment;s&&s.mask&&t.stopStencil();let n=0,a=0;if(\"shape\"===this._$mode){n=r.ceil(r.abs(c.xMax-c.xMin)*x),a=r.ceil(r.abs(c.yMax-c.yMin)*b);const e=t._$getTextureScale(n,a);e<1&&(n*=e,a*=e)}else n=r.ceil(r.abs(c.xMax-c.xMin)),a=r.ceil(r.abs(c.yMax-c.yMin));if(t.cachePosition=A.createCachePosition(n,a),t.bindRenderBuffer(t.cachePosition),t.reset(),\"shape\"===this._$mode?t.setTransform(x,0,0,b,-c.xMin*x,-c.yMin*b):t.setTransform(1,0,0,1,-c.xMin,-c.yMin),l){const i=he.scaleX,s=R(i,0,0,i,0,0),n=z(s,_);I(s);const a=this._$matrixBase,h=R(a[0],a[1],a[2],a[3],a[4]*i-d,a[5]*i-f),o=z(h,n),l=o[4]-(e[4]-d),$=o[5]-(e[5]-f);I(o);const u=H(c,n),g=+u.xMax,m=+u.xMin,p=+u.yMax,x=+u.yMin,b=r.ceil(r.abs(g-m)),v=r.ceil(r.abs(p-x));F(u),t.grid.enable(m,x,b,v,c,this._$scale9Grid,i,n[0],n[1],n[2],n[3],n[4],n[5],h[0],h[1],h[2],h[3],h[4]-l,h[5]-$),I(n),I(h)}this._$runCommand(t,this._$recodes,i,!1),l&&t.grid.disable(),A.transferTexture(t.cachePosition),et.set(this._$cacheKeys,t.cachePosition),t._$bind(s)}let y=0,E=0;if(v&&a){const i=this._$createBitmapTexture(t,t.cachePosition,x,b,m,p),s=this._$drawFilter(t,e,a,m,p,i);s.offsetX&&(y=s.offsetX),s.offsetY&&(E=s.offsetY),t.cachePosition=s}if(v||\"bitmap\"!==this._$mode){const i=r.atan2(e[1],e[0]),s=r.atan2(-e[2],e[3]);if(v||!i&&!s)t.setTransform(1,0,0,1,d-y,f-E);else{const n=c.xMin*x,a=c.yMin*b,h=r.cos(i),o=r.sin(i),_=r.cos(s),l=r.sin(s);t.setTransform(h,o,-l,_,n*h-a*l+e[4],n*o+a*_+e[5])}}else t.setTransform(e[0],e[1],e[2],e[3],c.xMin*e[0]+c.yMin*e[2]+e[4],c.xMin*e[1]+c.yMin*e[3]+e[5]);t.cachePosition&&(t.globalAlpha=o,t.imageSmoothingEnabled=\"shape\"===this._$mode,t.globalCompositeOperation=n,t.drawInstance(d-y,f-E,u,g,i),t.cachePosition=null),F(c)}setupStroke(t,e,i,s,r){switch(t.lineWidth=e,i){case 0:t.lineCap=\"none\";break;case 1:t.lineCap=\"round\";break;case 2:t.lineCap=\"square\"}switch(s){case 0:t.lineJoin=\"bevel\";break;case 1:t.lineJoin=\"miter\";break;case 2:t.lineJoin=\"round\"}t.miterLimit=r}createGradientStyle(t,e,i,s,n,a,h,o=null){let _,l=\"pad\";switch(n){case 0:l=\"reflect\";break;case 1:l=\"repeat\"}if(0===e){const e=(t=>{const e=-819.2*t[0]-819.2*t[2]+t[4],i=819.2*t[0]-819.2*t[2]+t[4],s=-819.2*t[0]+819.2*t[2]+t[4],n=-819.2*t[1]-819.2*t[3]+t[5],a=819.2*t[1]-819.2*t[3]+t[5];let h=s-e,o=-819.2*t[1]+819.2*t[3]+t[5]-n;const _=r.sqrt(h*h+o*o);_?(h/=_,o/=_):(h=0,o=0);const l=(i-e)*h+(a-n)*o;return B(e+l*h,n+l*o,i,a)})(s);_=t.createLinearGradient(e[0],e[1],e[2],e[3],a?\"rgb\":\"linearRGB\",l)}else t.save(),t.transform(s[0],s[1],s[2],s[3],s[4],s[5]),_=t.createRadialGradient(0,0,0,0,0,819.2,a?\"rgb\":\"linearRGB\",l,h);for(let t=0;t<i.length;++t){const e=i[t];let s=e.A;o&&(1===o[3]&&0===o[7]||(s=0|r.max(0,r.min(e.A*o[3]+o[7],255)))),_.addColorStop(e.ratio,B(e.R,e.G,e.B,s))}return _}_$runCommand(t,e,i=null,s=!1){t.reset(),t.beginPath();const n=e.length;for(let a=0;a<n;)switch(e[a++]){case 9:t.beginPath();break;case 0:t.moveTo(e[a++],e[a++]);break;case 2:t.lineTo(e[a++],e[a++]);break;case 1:t.quadraticCurveTo(e[a++],e[a++],e[a++],e[a++]);break;case 5:{if(s){a+=4;continue}const n=B();n[0]=e[a++]/255,n[1]=e[a++]/255,n[2]=e[a++]/255,n[3]=e[a++]/255,null!==i&&(1===i[3]&&0===i[7]||(n[3]=r.max(0,r.min(n[3]*i[3]+i[7],255))/255)),t.fillStyle=n}break;case 7:s||t.fill();break;case 6:{if(s){a+=8;continue}this.setupStroke(t,e[a++],e[a++],e[a++],e[a++]);const n=B();n[0]=e[a++]/255,n[1]=e[a++]/255,n[2]=e[a++]/255,n[3]=e[a++]/255,null!==i&&(1===i[3]&&0===i[7]||(n[3]=r.max(0,r.min(n[3]*i[3]+i[7],255))/255)),t.strokeStyle=n}break;case 8:s||t.stroke();break;case 12:t.closePath();break;case 3:t.bezierCurveTo(e[a++],e[a++],e[a++],e[a++],e[a++],e[a++]);break;case 4:t.arc(e[a++],e[a++],e[a++]);break;case 10:{if(s){a+=1;const t=e[a++];a+=5*t,a+=9;continue}const r=e[a++];let n=e[a++];const h=L();for(;n;)h.push({ratio:e[a++],R:e[a++],G:e[a++],B:e[a++],A:e[a++]}),n--;const o=R(e[a++],e[a++],e[a++],e[a++],e[a++],e[a++]);t.fillStyle=this.createGradientStyle(t,r,h,o,e[a++],e[a++],e[a++],i),t.fill(),1===r&&t.restore(),I(o),O(h)}break;case 11:{if(s){a+=5;const t=e[a++];a+=5*t,a+=9;continue}this.setupStroke(t,e[a++],e[a++],e[a++],e[a++]);const r=e[a++];let n=e[a++];const h=L();for(;n;)h.push({ratio:e[a++],R:e[a++],G:e[a++],B:e[a++],A:e[a++]}),n--;const o=R(e[a++],e[a++],e[a++],e[a++],e[a++],e[a++]);t.strokeStyle=this.createGradientStyle(t,r,h,o,e[a++],e[a++],e[a++],i),t.stroke(),1===r&&t.restore(),I(o),O(h)}break;case 13:{const r=e[a++],n=e[a++],h=e[a++],o=e[a++],_=e[a++];if(s){a+=_,a+=8;continue}const l=new Uint8Array(e.subarray(a,_+a));a+=_;const c=R(e[a++],e[a++],e[a++],e[a++],e[a++],e[a++]),$=!!e[a++],u=!!e[a++];t.save(),1===c[0]&&0===c[1]&&0===c[2]&&1===c[3]&&0===c[4]&&0===c[5]||t.transform(c[0],c[1],c[2],c[3],c[4],c[5]),I(c);const d=t.frameBuffer,g=d.createTextureFromPixels(r,n,l,!0);$||r!==h||n!==o?(t.fillStyle=t.createPattern(g,$,i||P()),t.imageSmoothingEnabled=u,t.fill()):(t.drawImage(g,0,0,r,n),d.releaseTexture(g)),t.restore(),t.imageSmoothingEnabled=!1}break;case 14:{if(s){a+=4;const t=e[a++];a+=t,a+=8;continue}t.save(),this.setupStroke(t,e[a++],e[a++],e[a++],e[a++]);const r=e[a++],n=e[a++],h=e[a++],o=new Uint8Array(e.subarray(a,h+a));a+=h;const _=R(e[a++],e[a++],e[a++],e[a++],e[a++],e[a++]);1===_[0]&&0===_[1]&&0===_[2]&&1===_[3]&&0===_[4]&&0===_[5]||t.transform(_[0],_[1],_[2],_[3],_[4],_[5]),I(_);const l=!!e[a++],c=!!e[a++],$=t.frameBuffer.createTextureFromPixels(r,n,o,!0);t.strokeStyle=t.createPattern($,l,i||P()),t.imageSmoothingEnabled=c,t.stroke(),t.restore(),t.imageSmoothingEnabled=!1}}}_$update(t){super._$update(t),t.recodes&&(this._$recodes=t.recodes,this._$xMin=t.xMin,this._$yMin=t.yMin,this._$xMax=t.xMax,this._$yMax=t.yMax,this._$maxAlpha=t.maxAlpha,this._$canDraw=t.canDraw,et.removeCache(this._$instanceId),this._$loaderInfoId>-1&&this._$characterId>-1&&et.removeCache(`${this._$loaderInfoId}@${this._$characterId}`))}}class dt extends ut{constructor(){super(),this._$children=new Int32Array}_$clip(t,e){let i=e;const s=this._$matrix;1===s[0]&&0===s[1]&&0===s[2]&&1===s[3]&&0===s[4]&&0===s[5]||(i=z(e,s)),this._$recodes&&this._$canDraw&&super._$clip(t,i);const r=he.instances,n=this._$children;for(let e=0;e<this._$children.length;++e){const s=n[e];if(!r.has(s))continue;const a=r.get(s);a&&!a._$isMask&&(a._$clip(t,i),a._$updated=!1)}i!==e&&I(i)}_$draw(t,e,i){if(!this._$visible)return;let s=i;const r=this._$colorTransform;if(1===r[0]&&1===r[1]&&1===r[2]&&1===r[3]&&0===r[4]&&0===r[5]&&0===r[6]&&0===r[7]||(s=G(i,r)),!Y(s[3]+s[7]/255,0,1,0))return;const n=this._$children,a=n.length;if(!(a||this._$recodes&&this._$canDraw))return;const h=this._$preDraw(t,e);if(!h)return;if(h.isLayer&&!h.isUpdated)return void this._$postDraw(t,e,s,h);const o=h.matrix,_=h.isLayer&&h.color?h.color:s;this._$recodes&&this._$canDraw&&this._$maxAlpha>0&&super._$draw(t,o,_);let l=!0,c=0;const $=he.instances,u=t.isLayer;for(let e=0;e<a;++e){const i=n[e];if(!$.has(i))continue;const s=$.get(i);if(s._$isMask)continue;const r=s._$blendMode;if((\"alpha\"===r||\"erase\"===r)&&!u)continue;if(c&&(s._$depth>c||s._$clipDepth>0)&&(t.restore(),l&&t._$leaveClip(),c=0,l=!0),!l)continue;if(s._$clipDepth>0){c=s._$clipDepth,l=s._$shouldClip(o),l&&(t.save(),l=s._$startClip(t,o));continue}const a=s._$maskId>-1&&$.has(s._$maskId)?$.get(s._$maskId):null;if(a){let e;if(a._$updated=!1,this._$instanceId===a._$parentId)e=o;else{e=f;let i=$.get(a._$parentId);for(;i||i._$instanceId!==i._$parentId;)e=z(i._$matrix,e),i=$.get(i._$parentId);const s=he.scaleX,r=R(s,0,0,s,0,0);if(e=z(r,e),I(r),t.isLayer){const i=t.getCurrentPosition();e[4]-=i.xMin,e[5]-=i.yMin}}if(!a._$shouldClip(e))continue;const i=a._$startClip(t,e);if(t.save(),!i){t.restore();continue}}s._$draw(t,o,_),s._$updated=!1,a&&(t.restore(),t._$leaveClip())}if(c&&(t.restore(),l&&t._$leaveClip()),h.isLayer)return this._$postDraw(t,e,s,h);h.matrix!==e&&I(h.matrix),s!==i&&N(s),Z(h)}_$getLayerBounds(e){const i=!!this._$recodes,s=this._$children;if(!s.length&&!i)return S(0,0,0,0);const n=h.MAX_VALUE;let a=n,o=-n,_=n,l=-n;if(i){const t=S(this._$xMin,this._$xMax,this._$yMin,this._$yMax),i=H(t,e);F(t),a=+i.xMin,o=+i.xMax,_=+i.yMin,l=+i.yMax,F(i)}const c=he.instances;for(let t=0;t<s.length;++t){const i=s[t];if(!c.has(i))continue;const n=c.get(i);let h=e;const $=n._$matrix;1===$[0]&&0===$[1]&&0===$[2]&&1===$[3]&&0===$[4]&&0===$[5]||(h=z(e,$));const u=n._$getLayerBounds(h);a=r.min(a,u.xMin),o=r.max(o,u.xMax),_=r.min(_,u.yMin),l=r.max(l,u.yMax),F(u),h!==e&&I(h)}if(!this._$filters||!this._$filters.length)return S(a,o,_,l);let $=S(0,o-a,0,l-_),u=+r.sqrt(e[0]*e[0]+e[1]*e[1]),d=+r.sqrt(e[2]*e[2]+e[3]*e[3]);u/=t,d/=t,u*=2,d*=2;for(let t=0;t<this._$filters.length;++t)$=this._$filters[t]._$generateFilterRect($,u,d);return o+=$.xMax-(o-a),l+=$.yMax-(l-_),a+=$.xMin,_+=$.yMin,F($),S(a,o,_,l)}_$getBounds(t=null){let e=f;if(t){e=t;const i=this._$matrix;1===i[0]&&0===i[1]&&0===i[2]&&1===i[3]&&0===i[4]&&0===i[5]||(e=z(t,i))}const i=!!this._$recodes,s=this._$children;if(!s.length&&!i){const i=S(e[4],-e[4],e[5],-e[5]);return t&&e!==t&&I(e),i}const n=h.MAX_VALUE;let a=n,o=-n,_=n,l=-n;if(i){const t=S(this._$xMin,this._$xMax,this._$yMin,this._$yMax);F(t);const i=H(t,e);a=i.xMin,o=i.xMax,_=i.yMin,l=i.yMax,F(i)}const c=he.instances;for(let t=0;t<s.length;++t){const i=s[t];if(!c.has(i))continue;const n=c.get(i)._$getBounds(e);a=r.min(a,n.xMin),o=r.max(o,n.xMax),_=r.min(_,n.yMin),l=r.max(l,n.yMax),F(n)}return t&&e!==t&&I(e),S(a,o,_,l)}_$preDraw(t,e){let i=e;const s=this._$matrix;if(1===s[0]&&0===s[1]&&0===s[2]&&1===s[3]&&0===s[4]&&0===s[5]||(i=z(e,s)),!i[0]&&!i[1]||!i[2]&&!i[3])return null;const n=x.pop()||{isLayer:!1,isUpdated:null,canApply:null,matrix:null,color:null,blendMode:\"normal\",filters:null,sw:0,sh:0};n.matrix=i;const a=this._$blendMode;if(\"normal\"!==a||this._$filters&&this._$filters.length>0){const s=this._$getBounds(null),o=H(s,i);F(s);const _=+o.xMax,l=+o.xMin,c=+o.yMax,$=+o.yMin;F(o);const u=r.ceil(r.abs(_-l)),d=r.ceil(r.abs(c-$));if(0>=u||0>=d)return Z(n),i!==e&&I(i),null;let g=+r.sqrt(i[0]*i[0]+i[1]*i[1]);if(!h.isInteger(g)){const t=g.toString(),e=t.indexOf(\"e\");-1!==e&&(g=+t.slice(0,e)),g=+g.toFixed(4)}let f=+r.sqrt(i[2]*i[2]+i[3]*i[3]);if(!h.isInteger(f)){const t=f.toString(),e=t.indexOf(\"e\");-1!==e&&(f=+t.slice(0,e)),f=+f.toFixed(4)}n.canApply=this._$canApply(this._$filters);let m=S(0,u,0,d);if(n.canApply&&this._$filters)for(let t=0;t<this._$filters.length;++t)m=this._$filters[t]._$generateFilterRect(m,g,f);const p=t.frameBuffer.currentAttachment;if(!p||!p.texture||l-m.xMin>p.width||$-m.yMin>p.height)return F(m),Z(n),i!==e&&I(i),null;if(0>l+m.xMax||0>$+m.yMax)return F(m),Z(n),i!==e&&I(i),null;let x=i[4]-l,b=i[5]-$;t._$startLayer(S(l,_,$,c));const v=this._$isFilterUpdated(i,this._$filters,n.canApply),T=this._$getLayerBounds(i),A=r.ceil(r.abs(T.xMax-T.xMin)),M=r.ceil(r.abs(T.yMax-T.yMin));F(T);const y=A-m.xMax+m.xMin,E=M-m.yMax+m.yMin;x+=y,b+=E,n.sw=y,n.sh=E,v&&t._$saveAttachment(r.ceil(u+y),r.ceil(d+E),!0),n.isLayer=!0,n.isUpdated=v,n.filters=this._$filters,n.blendMode=a,n.color=P(),n.matrix=R(i[0],i[1],i[2],i[3],x,b),i!==e&&I(i),F(m)}return n}_$postDraw(t,e,i,s){t.drawInstacedArray();const r=L(this._$instanceId,\"f\"),n=t.frameBuffer,a=s.matrix;let h=0,o=0,_=et.get(r);if(!_||s.isUpdated){_&&et.set(r,null),_=n.getTextureFromCurrentAttachment();const i=s.filters;let l=!1;if(i&&i.length){for(let s=0;s<i.length;++s)_=i[s]._$applyFilter(t,e);l=!0,h=t._$offsetX,o=t._$offsetY,t._$offsetX=0,t._$offsetY=0}_.filterState=l,_.matrix=`${a[0]}_${a[1]}_${a[2]}_${a[3]}`,_.offsetX=h,_.offsetY=o,et.set(r,_),t._$restoreAttachment()}_.offsetX&&(h=_.offsetX),_.offsetY&&(o=_.offsetY),t.reset(),t.globalAlpha=Y(i[3]+i[7]/255,0,1),t.globalCompositeOperation=s.blendMode;const l=t.getCurrentPosition();t.setTransform(1,0,0,1,l.xMin-h-s.sw,l.yMin-o-s.sh),t.drawImage(_,0,0,_.width,_.height,i),t._$endLayer(),t._$endLayer(),I(s.matrix),Z(s),t.cachePosition=null}_$remove(){this._$children=new Int32Array,this._$recodes=null,super._$remove(),le.push(this)}}class gt{constructor(){this._$rgb=\"rgb\",this._$mode=\"pad\",this._$type=\"linear\",this._$focalPointRatio=0,this._$points=R(),this._$stops=L()}dispose(){const t=this._$stops;for(let e=0;e<t.length;++e)w(t[e][1]);I(this._$points)}get mode(){return this._$mode}get type(){return this._$type}get rgb(){return this._$rgb}get points(){return this._$points}get focalPointRatio(){return this._$focalPointRatio}get stops(){return this._$stops.sort(((t,e)=>{switch(!0){case t[0]>e[0]:return 1;case e[0]>t[0]:return-1;default:return 0}})),this._$stops}linear(t,e,i,s,r=\"rgb\",n=\"pad\"){return this._$type=\"linear\",this._$points[0]=t,this._$points[1]=e,this._$points[2]=i,this._$points[3]=s,this._$rgb=r,this._$mode=n,this._$stops.length&&(this._$stops.length=0),this}radial(t,e,i,s,r,n,a=\"rgb\",h=\"pad\",o=0){return this._$type=\"radial\",this._$points[0]=t,this._$points[1]=e,this._$points[2]=i,this._$points[3]=s,this._$points[4]=r,this._$points[5]=n,this._$rgb=a,this._$mode=h,this._$focalPointRatio=Y(o,-.975,.975,0),this._$stops.length&&(this._$stops.length=0),this}addColorStop(t,e){this._$stops.push(L(t,e))}}class ft{constructor(t,e,i,s){this._$context=t,this._$texture=e,this._$repeat=i,this._$colorTransform=s}get texture(){return this._$texture}get repeat(){return this._$repeat}get colorTransform(){return this._$colorTransform}}class mt{constructor(){this._$fillStyle=B(1,1,1,1),this._$strokeStyle=B(1,1,1,1),this._$lineWidth=1,this._$lineCap=\"round\",this._$lineJoin=\"round\",this._$miterLimit=5}get miterLimit(){return this._$miterLimit}set miterLimit(t){this._$miterLimit=t}get lineWidth(){return this._$lineWidth}set lineWidth(t){this._$lineWidth=t}get lineCap(){return this._$lineCap}set lineCap(t){this._$lineCap=t}get lineJoin(){return this._$lineJoin}set lineJoin(t){this._$lineJoin=t}get fillStyle(){return this._$fillStyle}set fillStyle(t){this._$fillStyle instanceof o&&w(this._$fillStyle),this._$fillStyle=t}get strokeStyle(){return this._$strokeStyle}set strokeStyle(t){this._$strokeStyle instanceof o&&w(this._$strokeStyle),this._$strokeStyle=t}clear(){this._$lineWidth=1,this._$lineCap=\"round\",this._$lineJoin=\"round\",this._$miterLimit=5,this._$clearFill(),this._$clearStroke()}_$clearFill(){if(this._$fillStyle instanceof gt)return this._$fillStyle.dispose(),void(this._$fillStyle=B(1,1,1,1));this._$fillStyle instanceof ft?this._$fillStyle=B(1,1,1,1):this._$fillStyle.fill(1)}_$clearStroke(){if(this._$strokeStyle instanceof gt)return this._$strokeStyle.dispose(),void(this._$strokeStyle=B(1,1,1,1));this._$strokeStyle instanceof ft?this._$strokeStyle=B(1,1,1,1):this._$strokeStyle.fill(1)}}let pt=2048;class xt{constructor(t){t.pixelStorei(t.UNPACK_ALIGNMENT,1),t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,!0),this._$gl=t,this._$objectPool=[],this._$objectPoolArea=0,this._$activeTexture=-1,this._$boundTextures=[null,null,null],this._$maxWidth=0,this._$maxHeight=0,this._$atlasTextures=[],this._$atlasCacheMap=new Map,this._$positionObjectArray=[],this._$nodeObjectArray=[],this._$atlasNodes=new Map}createTextureAtlas(){const t=this._$gl.createTexture();t.width=pt,t.height=pt,this._$gl.activeTexture(this._$gl.TEXTURE3),this._$gl.bindTexture(this._$gl.TEXTURE_2D,t),this._$gl.texParameteri(this._$gl.TEXTURE_2D,this._$gl.TEXTURE_WRAP_S,this._$gl.CLAMP_TO_EDGE),this._$gl.texParameteri(this._$gl.TEXTURE_2D,this._$gl.TEXTURE_WRAP_T,this._$gl.CLAMP_TO_EDGE),this._$gl.texParameteri(this._$gl.TEXTURE_2D,this._$gl.TEXTURE_MIN_FILTER,this._$gl.NEAREST),this._$gl.texParameteri(this._$gl.TEXTURE_2D,this._$gl.TEXTURE_MAG_FILTER,this._$gl.NEAREST),this._$gl.texStorage2D(this._$gl.TEXTURE_2D,1,this._$gl.RGBA8,pt,pt),this._$gl.bindTexture(this._$gl.TEXTURE_2D,null),this._$activeTexture>-1&&this._$gl.activeTexture(this._$activeTexture);const e=this._$atlasTextures.length;this._$atlasNodes.set(e,[]),this._$atlasCacheMap.set(e,[]),this._$atlasTextures.push(t)}getAtlasTexture(t){return this._$atlasTextures[t]}getNode(t,e,i,s){const r=this._$nodeObjectArray.length?this._$nodeObjectArray.pop():{x:0,y:0,w:0,h:0};return r.x=t,r.y=e,r.w=i,r.h=s,r}createCachePosition(t,e){const i=this._$positionObjectArray.length?this._$positionObjectArray.pop():{index:0,x:0,y:0,w:0,h:0};i.x=i.y=0,i.w=t,i.h=e;for(const[s,r]of this._$atlasNodes){if(!r.length)return t>e?(pt-t-1>0&&r.push(this.getNode(t+1,0,pt-t-1,e)),pt-e-1>0&&r.push(this.getNode(0,e+1,pt,pt-e-1))):(pt-e-1>0&&r.push(this.getNode(0,e+1,t,pt-e-1)),pt-t-1>0&&r.push(this.getNode(t+1,0,pt-t-1,pt))),i.index=s,this._$atlasCacheMap.get(i.index).push(i),i;const n=r.length;for(let a=0;a<n;++a){const n=r[a];if(!(t>n.w||e>n.h))return i.index=s,i.x=n.x,i.y=n.y,this._$atlasCacheMap.get(i.index).push(i),n.w!==t||n.h!==e?t>e?(n.h-e-1>0&&r.push(this.getNode(n.x,n.y+e+1,n.w,n.h-e-1)),n.w-t-1>0?(n.x=n.x+t+1,n.w=n.w-t-1,n.h=e):(r.splice(a,1),this._$nodeObjectArray.push(n))):(n.w-t-1>0&&r.push(this.getNode(n.x+t+1,n.y,n.w-t-1,n.h)),n.h-e-1>0?(n.y=n.y+e+1,n.w=t,n.h=n.h-e-1):(r.splice(a,1),this._$nodeObjectArray.push(n))):(r.splice(a,1),this._$nodeObjectArray.push(n)),i}}const s=this._$atlasTextures.length;this.createTextureAtlas();const r=this._$atlasNodes.get(s);return t>e?(pt-t-1>0&&r.push(this.getNode(t+1,0,pt-t-1,e)),pt-e-1>0&&r.push(this.getNode(0,e+1,pt,pt-e-1))):(pt-e-1>0&&r.push(this.getNode(0,e+1,t,pt-e-1)),pt-t-1>0&&r.push(this.getNode(t+1,0,pt-t-1,pt))),i.index=s,this._$atlasCacheMap.get(i.index).push(i),i}releasePosition(t){var e;this._$atlasNodes.has(t.index)&&(null===(e=this._$atlasNodes.get(t.index))||void 0===e||e.unshift(this.getNode(t.x,t.y,t.w,t.h)),this._$positionObjectArray.push(t))}clearCache(){for(const t of this._$atlasCacheMap.values())t.length=0;for(const t of this._$atlasNodes.values())t.length=0}_$createTexture(t,e){const i=this._$gl.createTexture();return i.width=0,i.height=0,i.area=0,i.dirty=!0,i.smoothing=!0,this.bind0(i,!1),this._$gl.texParameteri(this._$gl.TEXTURE_2D,this._$gl.TEXTURE_WRAP_S,this._$gl.CLAMP_TO_EDGE),this._$gl.texParameteri(this._$gl.TEXTURE_2D,this._$gl.TEXTURE_WRAP_T,this._$gl.CLAMP_TO_EDGE),i.width=t,i.height=e,i.area=t*e,i.dirty=!1,this._$gl.texStorage2D(this._$gl.TEXTURE_2D,1,this._$gl.RGBA8,t,e),i}_$getTexture(t,e){for(let i=0;i<this._$objectPool.length;i++){const s=this._$objectPool[i];if(s.width===t&&s.height===e)return this._$objectPool.splice(i,1),this._$objectPoolArea-=s.area,this.bind0(s,!1),s}return this._$createTexture(t,e)}create(t,e,i=null,s=!1,r=!0){const n=this._$getTexture(t,e);return s&&this._$gl.pixelStorei(this._$gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!0),r||this._$gl.pixelStorei(this._$gl.UNPACK_FLIP_Y_WEBGL,!1),n.width!==t||n.height!==e?(n.width=t,n.height=e,n.area=t*e,n.dirty=!1,this._$gl.texImage2D(this._$gl.TEXTURE_2D,0,this._$gl.RGBA,t,e,0,this._$gl.RGBA,this._$gl.UNSIGNED_BYTE,i)):i&&(n.dirty=!1,this._$gl.texSubImage2D(this._$gl.TEXTURE_2D,0,0,0,t,e,this._$gl.RGBA,this._$gl.UNSIGNED_BYTE,i)),s&&this._$gl.pixelStorei(this._$gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),r||this._$gl.pixelStorei(this._$gl.UNPACK_FLIP_Y_WEBGL,!0),n}createFromImage(t,e=!1){return this._$createFromElement(t.width,t.height,t,e)}createFromCanvas(t){return this._$createFromElement(t.width,t.height,t,!1)}createFromVideo(t,e=!1){return this._$createFromElement(t.videoWidth,t.videoHeight,t,e)}_$createFromElement(t,e,i,s=!1){const r=this._$getTexture(t,e);return r.dirty=!1,this.bind0(r,s),this._$gl.pixelStorei(this._$gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!0),r.width!==t||r.height!==e?(r.width=t,r.height=e,r.area=t*e,this._$gl.texImage2D(this._$gl.TEXTURE_2D,0,this._$gl.RGBA,this._$gl.RGBA,this._$gl.UNSIGNED_BYTE,i)):this._$gl.texSubImage2D(this._$gl.TEXTURE_2D,0,0,0,this._$gl.RGBA,this._$gl.UNSIGNED_BYTE,i),this._$gl.pixelStorei(this._$gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),r}release(t){if(t.area>this._$maxWidth*this._$maxHeight*2)this._$gl.deleteTexture(t);else if(t.dirty=!0,this._$objectPool.push(t),this._$objectPoolArea+=t.area,this._$objectPool.length&&this._$objectPoolArea>this._$maxWidth*this._$maxHeight*10){const t=this._$objectPool.shift();this._$objectPoolArea-=t.area,this._$gl.deleteTexture(t)}}bind0(t,e=null){this._$bindTexture(2,this._$gl.TEXTURE2,null,null),this._$bindTexture(1,this._$gl.TEXTURE1,null,null),this._$bindTexture(0,this._$gl.TEXTURE0,t,e)}bind01(t,e,i=null){this._$bindTexture(2,this._$gl.TEXTURE2,null,null),this._$bindTexture(1,this._$gl.TEXTURE1,e,i),this._$bindTexture(0,this._$gl.TEXTURE0,t,i)}bind012(t,e,i,s=null){this._$bindTexture(2,this._$gl.TEXTURE2,i,s),this._$bindTexture(1,this._$gl.TEXTURE1,e,null),this._$bindTexture(0,this._$gl.TEXTURE0,t,null)}bind02(t,e,i=null){this._$bindTexture(2,this._$gl.TEXTURE2,e,i),this._$bindTexture(1,this._$gl.TEXTURE1,null,null),this._$bindTexture(0,this._$gl.TEXTURE0,t,null)}_$bindTexture(t,e,i=null,s=null){const r=i!==this._$boundTextures[t],n=null!==s&&null!==i&&s!==i.smoothing;if((r||n||e===this._$gl.TEXTURE0)&&e!==this._$activeTexture&&(this._$activeTexture=e,this._$gl.activeTexture(e)),r&&(this._$boundTextures[t]=i,this._$gl.bindTexture(this._$gl.TEXTURE_2D,i)),n){i&&(i.smoothing=!!s);const t=s?this._$gl.LINEAR:this._$gl.NEAREST;this._$gl.texParameteri(this._$gl.TEXTURE_2D,this._$gl.TEXTURE_MIN_FILTER,t),this._$gl.texParameteri(this._$gl.TEXTURE_2D,this._$gl.TEXTURE_MAG_FILTER,t)}}}class bt{constructor(t){this._$gl=t,this._$objectPool=L(),this._$objectPoolArea=0,this._$maxWidth=0,this._$maxHeight=0}set maxWidth(t){this._$maxWidth=t}set maxHeight(t){this._$maxHeight=t}_$createStencilBuffer(){const t=this._$gl.createRenderbuffer();if(!t)throw new Error(\"the stencil buffer is null.\");return t.width=0,t.height=0,t.area=0,t.dirty=!0,t}_$getStencilBuffer(t,e){const i=this._$objectPool.length;for(let s=0;s<i;++s){const i=this._$objectPool[s];if(i.width===t&&i.height===e)return this._$objectPool.splice(s,1),this._$objectPoolArea-=i.area,i}if(i>100){const t=this._$objectPool.shift();if(t)return this._$objectPoolArea-=t.area,t}return this._$createStencilBuffer()}create(t,e){const i=this._$getStencilBuffer(t,e);return i.width===t&&i.height===e||(i.width=t,i.height=e,i.area=t*e,i.dirty=!1,this._$gl.bindRenderbuffer(this._$gl.RENDERBUFFER,i),this._$gl.renderbufferStorage(this._$gl.RENDERBUFFER,this._$gl.STENCIL_INDEX8,t,e)),i}release(t){if(t.area>this._$maxWidth*this._$maxHeight*2)this._$gl.deleteRenderbuffer(t);else if(t.dirty=!0,this._$objectPool.push(t),this._$objectPoolArea+=t.area,this._$objectPoolArea>this._$maxWidth*this._$maxHeight*10){const t=this._$objectPool.shift();t&&(this._$objectPoolArea-=t.area,this._$gl.deleteRenderbuffer(t))}}}class vt{constructor(t,e){this._$gl=t,this._$samples=e,this._$objectPool=L()}set samples(t){this._$samples=t}_$createColorBuffer(){const t=this._$gl.createRenderbuffer();if(!t)throw new Error(\"the color buffer is null.\");const e=this._$gl.createRenderbuffer();if(!e)throw new Error(\"the stencil buffer is null.\");return t.stencil=e,t.samples=0,t.width=0,t.height=0,t.area=0,t.dirty=!0,t}_$getColorBuffer(t){if(!this._$objectPool.length)return this._$createColorBuffer();const e=this._$bsearch(t);if(e<this._$objectPool.length){const t=this._$objectPool[e];return this._$objectPool.splice(e,1),t}const i=this._$objectPool.shift();if(!i)throw new Error(\"the color buffer is void.\");return i}create(t,e,i=0){t=r.max(256,X(t)),e=r.max(256,X(e));const s=this._$getColorBuffer(t*e);return i||(i=this._$samples),(s.width<t||s.height<e||s.samples!==i)&&(t=r.max(t,s.width),e=r.max(e,s.height),s.samples=i,s.width=t,s.height=e,s.area=t*e,s.dirty=!1,this._$gl.bindRenderbuffer(this._$gl.RENDERBUFFER,s),this._$gl.renderbufferStorageMultisample(this._$gl.RENDERBUFFER,i,this._$gl.RGBA8,t,e),this._$gl.bindRenderbuffer(this._$gl.RENDERBUFFER,s.stencil),this._$gl.renderbufferStorageMultisample(this._$gl.RENDERBUFFER,i,this._$gl.STENCIL_INDEX8,t,e)),s}release(t){t.dirty=!0;const e=this._$bsearch(t.area);this._$objectPool.splice(e,0,t)}_$bsearch(t){let e=-1,i=this._$objectPool.length;for(;r.abs(i-e)>1;){const s=r.floor((i+e)/2);t<=this._$objectPool[s].area?i=s:e=s}return i}}class Tt{constructor(t,e){this._$gl=t,this._$objectPool=[],this._$frameBuffer=t.createFramebuffer(),t.bindFramebuffer(t.READ_FRAMEBUFFER,this._$frameBuffer),this._$frameBufferTexture=t.createFramebuffer(),this._$currentAttachment=null,this._$isBinding=!1,this._$textureManager=new xt(t),this._$stencilBufferPool=new bt(t),this._$colorBufferPool=new vt(t,e),this._$isRenderBinding=!1,this._$colorBuffer=this._$gl.createRenderbuffer(),this._$gl.bindRenderbuffer(this._$gl.RENDERBUFFER,this._$colorBuffer),this._$gl.renderbufferStorageMultisample(this._$gl.RENDERBUFFER,e,this._$gl.RGBA8,pt,pt),this._$stencilBuffer=this._$gl.createRenderbuffer(),this._$gl.bindRenderbuffer(this._$gl.RENDERBUFFER,this._$stencilBuffer),this._$gl.renderbufferStorageMultisample(this._$gl.RENDERBUFFER,e,this._$gl.STENCIL_INDEX8,pt,pt)}bindRenderBuffer(){this._$isBinding||(this._$isBinding=!0,this._$gl.bindFramebuffer(this._$gl.FRAMEBUFFER,this._$frameBuffer)),this._$isRenderBinding||(this._$isRenderBinding=!0,this._$gl.bindRenderbuffer(this._$gl.RENDERBUFFER,this._$colorBuffer),this._$gl.framebufferRenderbuffer(this._$gl.FRAMEBUFFER,this._$gl.COLOR_ATTACHMENT0,this._$gl.RENDERBUFFER,this._$colorBuffer),this._$gl.bindRenderbuffer(this._$gl.RENDERBUFFER,this._$stencilBuffer),this._$gl.framebufferRenderbuffer(this._$gl.FRAMEBUFFER,this._$gl.STENCIL_ATTACHMENT,this._$gl.RENDERBUFFER,this._$stencilBuffer))}get currentAttachment(){return this._$currentAttachment}get textureManager(){return this._$textureManager}createCacheAttachment(t,e,i=!1,s=0){const r=this._$objectPool.pop()||{width:0,height:0,color:null,texture:null,msaa:!1,stencil:null,mask:!1,clipLevel:0,isActive:!1},n=this._$textureManager.create(t,e);return r.width=t,r.height=e,i?(r.color=this._$colorBufferPool.create(t,e,s),r.texture=n,r.msaa=!0,r.stencil=r.color.stencil):(r.color=n,r.texture=n,r.msaa=!1,r.stencil=this._$stencilBufferPool.create(t,e)),r.mask=!1,r.clipLevel=0,r.isActive=!0,r}clearCache(){this._$textureManager.clearCache()}setMaxSize(t,e){this._$stencilBufferPool._$maxWidth=t,this._$stencilBufferPool._$maxHeight=e,this._$textureManager._$maxWidth=t,this._$textureManager._$maxHeight=e}createTextureAttachment(t,e){const i=this._$objectPool.pop()||{width:0,height:0,color:null,texture:null,msaa:!1,stencil:null,mask:!1,clipLevel:0,isActive:!1},s=this._$textureManager.create(t,e);return i.width=t,i.height=e,i.color=s,i.texture=s,i.msaa=!1,i.stencil=null,i.mask=!1,i.clipLevel=0,i.isActive=!0,i}createTextureAttachmentFrom(t){const e=this._$objectPool.pop()||{width:0,height:0,color:null,texture:null,msaa:!1,stencil:null,mask:!1,clipLevel:0,isActive:!0};return e.width=t.width,e.height=t.height,e.color=t,e.texture=t,e.msaa=!1,e.stencil=null,e.mask=!1,e.clipLevel=0,e.isActive=!0,e}releaseAttachment(t=null,e=!1){t&&t.isActive&&(t.msaa?t.color instanceof WebGLRenderbuffer&&this._$colorBufferPool.release(t.color):t.stencil&&this._$stencilBufferPool.release(t.stencil),e&&t.texture&&this._$textureManager.release(t.texture),t.color=null,t.texture=null,t.stencil=null,t.isActive=!1,this._$objectPool.push(t))}bind(t){this._$currentAttachment=t,this._$isBinding||(this._$isBinding=!0,this._$gl.bindFramebuffer(this._$gl.FRAMEBUFFER,this._$frameBuffer)),t.msaa?t.color instanceof WebGLRenderbuffer&&(this._$gl.bindRenderbuffer(this._$gl.RENDERBUFFER,t.color),this._$gl.framebufferRenderbuffer(this._$gl.FRAMEBUFFER,this._$gl.COLOR_ATTACHMENT0,this._$gl.RENDERBUFFER,t.color)):t.color instanceof WebGLTexture&&(t.color&&this._$textureManager.bind0(t.color),this._$gl.framebufferTexture2D(this._$gl.FRAMEBUFFER,this._$gl.COLOR_ATTACHMENT0,this._$gl.TEXTURE_2D,t.color,0)),this._$gl.bindRenderbuffer(this._$gl.RENDERBUFFER,t.stencil),this._$gl.framebufferRenderbuffer(this._$gl.FRAMEBUFFER,this._$gl.STENCIL_ATTACHMENT,this._$gl.RENDERBUFFER,t.stencil),this._$isRenderBinding=!1}unbind(){this._$currentAttachment=null,this._$isBinding&&(this._$isBinding=!1,this._$gl.bindFramebuffer(this._$gl.FRAMEBUFFER,null))}transferToMainTexture(){if(!this._$currentAttachment)throw new Error(\"the current attachment is null.\");const t=this._$currentAttachment.width,e=this._$currentAttachment.height,i=this._$currentAttachment.texture;if(!i)throw new Error(\"the texture is null.\");this._$gl.bindFramebuffer(this._$gl.DRAW_FRAMEBUFFER,this._$frameBufferTexture),this._$textureManager.bind0(i),this._$gl.framebufferTexture2D(this._$gl.FRAMEBUFFER,this._$gl.COLOR_ATTACHMENT0,this._$gl.TEXTURE_2D,i,0),this._$gl.bindFramebuffer(this._$gl.DRAW_FRAMEBUFFER,null),this._$gl.blitFramebuffer(0,0,t,e,0,0,t,e,this._$gl.COLOR_BUFFER_BIT,this._$gl.NEAREST),this._$gl.bindFramebuffer(this._$gl.DRAW_FRAMEBUFFER,this._$frameBuffer)}createCachePosition(t,e){return this._$textureManager.createCachePosition(t,e)}transferTexture(t){this._$gl.disable(this._$gl.SCISSOR_TEST),this._$gl.bindFramebuffer(this._$gl.DRAW_FRAMEBUFFER,this._$frameBufferTexture);const e=this._$textureManager.getAtlasTexture(t.index);this._$textureManager.bind0(e),this._$gl.framebufferTexture2D(this._$gl.FRAMEBUFFER,this._$gl.COLOR_ATTACHMENT0,this._$gl.TEXTURE_2D,e,0);const i=r.max(0,t.x-1),s=r.max(0,t.y-1),n=r.min(pt,t.x+t.w+1),a=r.min(pt,t.y+t.h+1);this._$gl.blitFramebuffer(i,s,n,a,i,s,n,a,this._$gl.COLOR_BUFFER_BIT,this._$gl.NEAREST),this._$gl.bindFramebuffer(this._$gl.FRAMEBUFFER,this._$frameBuffer)}getTextureFromCurrentAttachment(){if(!this._$currentAttachment)throw new Error(\"the current attachment is null.\");if(!this._$currentAttachment.msaa&&this._$currentAttachment.texture)return this._$currentAttachment.texture;const t=this._$currentAttachment.width,e=this._$currentAttachment.height,i=this._$currentAttachment.texture;if(!i)throw new Error(\"the texture is null.\");return i.dirty=!1,this._$gl.bindFramebuffer(this._$gl.DRAW_FRAMEBUFFER,this._$frameBufferTexture),this._$textureManager.bind0(i),this._$gl.framebufferTexture2D(this._$gl.FRAMEBUFFER,this._$gl.COLOR_ATTACHMENT0,this._$gl.TEXTURE_2D,i,0),this._$gl.blitFramebuffer(0,0,t,e,0,0,t,e,this._$gl.COLOR_BUFFER_BIT,this._$gl.NEAREST),this._$gl.bindFramebuffer(this._$gl.FRAMEBUFFER,this._$frameBuffer),i}createTextureFromPixels(t,e,i=null,s=!1,r=!0){return this._$textureManager.create(t,e,i,s,r)}createTextureFromCanvas(t){return this._$textureManager.createFromCanvas(t)}createTextureFromImage(t,e=!1){return this._$textureManager.createFromImage(t,e)}createTextureFromVideo(t,e=!1){return this._$textureManager.createFromVideo(t,e)}createTextureFromCurrentAttachment(){if(!this._$currentAttachment)throw new Error(\"the current attachment is null.\");const t=this._$currentAttachment.width,e=this._$currentAttachment.height,i=this._$textureManager.create(t,e);return this._$textureManager.bind0(i),this._$gl.copyTexSubImage2D(this._$gl.TEXTURE_2D,0,0,0,0,0,t,e),i}releaseTexture(t){this._$textureManager.release(t)}}class At{constructor(){this._$bezierConverterBuffer=new o(32)}cubicToQuad(t,e,i,s,r,n,a,h){this._$split2Cubic(t,e,i,s,r,n,a,h,0,16),this._$split2Cubic(this._$bezierConverterBuffer[0],this._$bezierConverterBuffer[1],this._$bezierConverterBuffer[2],this._$bezierConverterBuffer[3],this._$bezierConverterBuffer[4],this._$bezierConverterBuffer[5],this._$bezierConverterBuffer[6],this._$bezierConverterBuffer[7],0,8),this._$split2Cubic(this._$bezierConverterBuffer[16],this._$bezierConverterBuffer[17],this._$bezierConverterBuffer[18],this._$bezierConverterBuffer[19],this._$bezierConverterBuffer[20],this._$bezierConverterBuffer[21],this._$bezierConverterBuffer[22],this._$bezierConverterBuffer[23],16,24),this._$split2Quad(this._$bezierConverterBuffer[0],this._$bezierConverterBuffer[1],this._$bezierConverterBuffer[2],this._$bezierConverterBuffer[3],this._$bezierConverterBuffer[4],this._$bezierConverterBuffer[5],this._$bezierConverterBuffer[6],this._$bezierConverterBuffer[7],0),this._$split2Quad(this._$bezierConverterBuffer[8],this._$bezierConverterBuffer[9],this._$bezierConverterBuffer[10],this._$bezierConverterBuffer[11],this._$bezierConverterBuffer[12],this._$bezierConverterBuffer[13],this._$bezierConverterBuffer[14],this._$bezierConverterBuffer[15],8),this._$split2Quad(this._$bezierConverterBuffer[16],this._$bezierConverterBuffer[17],this._$bezierConverterBuffer[18],this._$bezierConverterBuffer[19],this._$bezierConverterBuffer[20],this._$bezierConverterBuffer[21],this._$bezierConverterBuffer[22],this._$bezierConverterBuffer[23],16),this._$split2Quad(this._$bezierConverterBuffer[24],this._$bezierConverterBuffer[25],this._$bezierConverterBuffer[26],this._$bezierConverterBuffer[27],this._$bezierConverterBuffer[28],this._$bezierConverterBuffer[29],this._$bezierConverterBuffer[30],this._$bezierConverterBuffer[31],24)}_$split2Cubic(t,e,i,s,r,n,a,h,o,_){const l=.125*(t+3*(i+r)+a),c=.125*(e+3*(s+n)+h),$=.125*(a+r-i-t),u=.125*(h+n-s-e);this._$bezierConverterBuffer[o]=t,this._$bezierConverterBuffer[o+1]=e,this._$bezierConverterBuffer[o+2]=.5*(t+i),this._$bezierConverterBuffer[o+3]=.5*(e+s),this._$bezierConverterBuffer[o+4]=l-$,this._$bezierConverterBuffer[o+5]=c-u,this._$bezierConverterBuffer[o+6]=l,this._$bezierConverterBuffer[o+7]=c,this._$bezierConverterBuffer[_]=l,this._$bezierConverterBuffer[_+1]=c,this._$bezierConverterBuffer[_+2]=l+$,this._$bezierConverterBuffer[_+3]=c+u,this._$bezierConverterBuffer[_+4]=.5*(r+a),this._$bezierConverterBuffer[_+5]=.5*(n+h),this._$bezierConverterBuffer[_+6]=a,this._$bezierConverterBuffer[_+7]=h}_$split2Quad(t,e,i,s,r,n,a,h,o){const _=.125*(t+3*(i+r)+a),l=.125*(e+3*(s+n)+h);this._$bezierConverterBuffer[o]=.25*t+.75*i,this._$bezierConverterBuffer[o+1]=.25*e+.75*s,this._$bezierConverterBuffer[o+2]=_,this._$bezierConverterBuffer[o+3]=l,this._$bezierConverterBuffer[o+4]=.75*r+.25*a,this._$bezierConverterBuffer[o+5]=.75*n+.25*h,this._$bezierConverterBuffer[o+6]=a,this._$bezierConverterBuffer[o+7]=h}}class Mt{constructor(){this._$currentPath=L(),this._$vertices=L(),this._$bezierConverter=new At}get vertices(){return this._$pushCurrentPathToVertices(),this._$vertices}begin(){for(this._$currentPath.length=0;this._$vertices.length;)O(this._$vertices.pop())}moveTo(t,e){this._$currentPath.length?this._$equalsToLastPoint(t,e)||(this._$pushCurrentPathToVertices(),this._$pushPointToCurrentPath(t,e,!1)):this._$pushPointToCurrentPath(t,e,!1)}lineTo(t,e){this._$currentPath.length||this.moveTo(0,0),this._$equalsToLastPoint(t,e)||this._$pushPointToCurrentPath(t,e,!1)}quadTo(t,e,i,s){this._$currentPath.length||this.moveTo(0,0),this._$equalsToLastPoint(i,s)||(this._$pushPointToCurrentPath(t,e,!0),this._$pushPointToCurrentPath(i,s,!1))}cubicTo(t,e,i,s,r,n){if(this._$currentPath.length||this.moveTo(0,0),this._$equalsToLastPoint(r,n))return;const a=+this._$currentPath[this._$currentPath.length-3],h=+this._$currentPath[this._$currentPath.length-2];this._$bezierConverter.cubicToQuad(a,h,t,e,i,s,r,n);const o=this._$bezierConverter._$bezierConverterBuffer;for(let t=0;t<32;)this.quadTo(o[t++],o[t++],o[t++],o[t++])}drawCircle(t,e,i){const s=i,r=.5522847498307936*i;this.cubicTo(t+s,e+r,t+r,e+s,t,e+s),this.cubicTo(t-r,e+s,t-s,e+r,t-s,e),this.cubicTo(t-s,e-r,t-r,e-s,t,e-s),this.cubicTo(t+r,e-s,t+s,e-r,t+s,e)}close(){if(this._$currentPath.length<=6)return;const t=+this._$currentPath[0],e=+this._$currentPath[1];this._$equalsToLastPoint(t,e)||this._$pushPointToCurrentPath(t,e,!1)}_$equalsToLastPoint(t,e){const i=+this._$currentPath[this._$currentPath.length-3],s=+this._$currentPath[this._$currentPath.length-2];return t===i&&e===s}_$pushPointToCurrentPath(t,e,i){this._$currentPath.push(t,e,i)}_$pushCurrentPathToVertices(){this._$currentPath.length<4?this._$currentPath.length=0:(this._$vertices.push(this._$currentPath),this._$currentPath=L())}createRectVertices(t,e,i,s){return L(L(t,e,!1,t+i,e,!1,t+i,e+s,!1,t,e+s,!1))}}class yt{constructor(){this.enabled=!1,this.parentMatrixA=1,this.parentMatrixB=0,this.parentMatrixC=0,this.parentMatrixD=0,this.parentMatrixE=1,this.parentMatrixF=0,this.parentMatrixG=0,this.parentMatrixH=0,this.parentMatrixI=1,this.ancestorMatrixA=1,this.ancestorMatrixB=0,this.ancestorMatrixC=0,this.ancestorMatrixD=0,this.ancestorMatrixE=1,this.ancestorMatrixF=0,this.ancestorMatrixG=0,this.ancestorMatrixH=0,this.ancestorMatrixI=1,this.parentViewportX=0,this.parentViewportY=0,this.parentViewportW=0,this.parentViewportH=0,this.minXST=1e-5,this.minYST=1e-5,this.minXPQ=1e-5,this.minYPQ=1e-5,this.maxXST=.99999,this.maxYST=.99999,this.maxXPQ=.99999,this.maxYPQ=.99999}enable(t,e,i,s,n,a,h,o,_,l,c,$,u,d,g,f,m,p,x){const b=n.xMax-n.xMin,v=n.yMax-n.yMin,T=a.w,A=a.h,M=r.abs(r.ceil(b*h)),y=r.abs(r.ceil(v*h)),E=T>0?(a.x-n.xMin)/b:1e-5,C=A>0?(a.y-n.yMin)/v:1e-5,S=T>0?(a.x+a.w-n.xMin)/b:.99999,F=A>0?(a.y+a.h-n.yMin)/v:.99999;let B=M*E/i,w=y*C/s,R=(i-M*(1-S))/i,I=(s-y*(1-F))/s;if(B>=R){const t=E/(E+(1-S));B=r.max(t-1e-5,0),R=r.min(t+1e-5,1)}if(w>=I){const t=C/(C+(1-F));w=r.max(t-1e-5,0),I=r.min(t+1e-5,1)}this.enabled=!0,this.parentMatrixA=o,this.parentMatrixB=_,this.parentMatrixD=l,this.parentMatrixE=c,this.parentMatrixG=$,this.parentMatrixH=u,this.ancestorMatrixA=d,this.ancestorMatrixB=g,this.ancestorMatrixD=f,this.ancestorMatrixE=m,this.ancestorMatrixG=p,this.ancestorMatrixH=x,this.parentViewportX=t,this.parentViewportY=e,this.parentViewportW=i,this.parentViewportH=s,this.minXST=E,this.minYST=C,this.minXPQ=B,this.minYPQ=w,this.maxXST=S,this.maxYST=F,this.maxXPQ=R,this.maxYPQ=I}disable(){this.enabled=!1}}class Et{constructor(t,e){this._$gl=t,this._$array=[],this._$map=D();const i=this._$gl.getProgramParameter(e,this._$gl.ACTIVE_UNIFORMS);for(let t=0;t<i;t++){const i=this._$gl.getActiveUniform(e,t),s=i.name.endsWith(\"[0]\")?i.name.slice(0,-3):i.name,r=this._$gl.getUniformLocation(e,s);if(i.type===this._$gl.SAMPLER_2D&&1===i.size)continue;const n={};switch(i.type){case this._$gl.FLOAT_VEC4:n.method=this._$gl.uniform4fv.bind(this._$gl,r),n.array=new o(4*i.size),n.assign=-1;break;case this._$gl.INT_VEC4:n.method=this._$gl.uniform4iv.bind(this._$gl,r),n.array=new _(4*i.size),n.assign=-1;break;case this._$gl.SAMPLER_2D:n.method=this._$gl.uniform1iv.bind(this._$gl,r),n.array=new _(i.size),n.assign=1;break;case this._$gl.FLOAT:case this._$gl.FLOAT_VEC2:case this._$gl.FLOAT_VEC3:case this._$gl.FLOAT_MAT2:case this._$gl.FLOAT_MAT3:case this._$gl.FLOAT_MAT4:case this._$gl.INT:case this._$gl.INT_VEC2:case this._$gl.INT_VEC3:default:throw new Error(\"Use gl.FLOAT_VEC4 or gl.INT_VEC4 instead\")}this._$array.push(n),this._$map.set(s,n)}}getArray(t){const e=this._$map.get(t);if(!e||!e.array)throw new Error(\"the UniformData is null.\");return e.array}get textures(){const t=this._$map.get(\"u_textures\");if(!t||!t.array)throw new Error(\"the UniformData is null.\");return t.array}get highp(){const t=this._$map.get(\"u_highp\");if(!t||!t.array)throw new Error(\"the UniformData is null.\");return t.array}get mediump(){const t=this._$map.get(\"u_mediump\");if(!t||!t.array)throw new Error(\"the UniformData is null.\");return t.array}get integer(){const t=this._$map.get(\"u_integer\");if(!t||!t.array)throw new Error(\"the UniformData is null.\");return t.array}bindUniforms(){const t=this._$array.length;for(let e=0;e<t;e++){const t=this._$array[e];void 0!==t.method&&void 0!==t.assign&&(t.assign<0?t.method(t.array):t.assign>0&&(t.assign--,t.method(t.array)))}}}class Ct{constructor(){this._$attributes=[],this._$count=0}get attributes(){return this._$attributes}get count(){return this._$count}set count(t){this._$count=t}clear(){this._$attributes.length=0,this._$count=0}}class St{constructor(t,e,i,s){this._$gl=t,this._$context=e,this._$program=this._$createProgram(i,s),this._$uniform=new Et(t,this._$program),this._$instance=null}get instance(){return this._$instance||(this._$instance=new Ct),this._$instance}get uniform(){return this._$uniform}_$createProgram(t,i){const s=this._$gl.createProgram();s.id=e++;const r=this._$gl.createShader(this._$gl.VERTEX_SHADER);this._$gl.shaderSource(r,t),this._$gl.compileShader(r);const n=this._$gl.createShader(this._$gl.FRAGMENT_SHADER);return this._$gl.shaderSource(n,i),this._$gl.compileShader(n),this._$gl.attachShader(s,r),this._$gl.attachShader(s,n),this._$gl.linkProgram(s),this._$gl.detachShader(s,r),this._$gl.detachShader(s,n),this._$gl.deleteShader(r),this._$gl.deleteShader(n),s}_$attachProgram(){const t=this._$context.shaderList;t.currentProgramId!==this._$program.id&&(t.currentProgramId=this._$program.id,this._$gl.useProgram(this._$program))}drawArraysInstanced(t){this._$attachProgram(),this._$context.vao.bindInstnceArray(t),this._$gl.drawArraysInstanced(this._$gl.TRIANGLE_STRIP,0,4,t.count)}_$drawImage(){this._$attachProgram(),this._$uniform.bindUniforms(),this._$context.vao.bindCommonVertexArray(),this._$gl.drawArrays(this._$gl.TRIANGLE_STRIP,0,4)}_$drawGradient(t,e){this._$attachProgram(),this._$uniform.bindUniforms(),this._$context.vao.bindGradientVertexArray(t,e),this._$gl.drawArrays(this._$gl.TRIANGLE_STRIP,0,4)}_$stroke(t){this._$attachProgram(),this._$context.blend.reset(),this._$uniform.bindUniforms(),this._$context.vao.bind(t),this._$gl.drawElements(this._$gl.TRIANGLES,t.indexCount,this._$gl.UNSIGNED_SHORT,0)}_$fill(t){this._$attachProgram(),this._$context.blend.reset(),this._$uniform.bindUniforms(),this._$context.vao.bind(t);const e=t.indexRanges,i=e[e.length-1];this._$gl.drawArrays(this._$gl.TRIANGLES,0,i.first+i.count)}_$containerClip(t,e,i){this._$attachProgram(),this._$context.blend.reset(),this._$uniform.bindUniforms(),this._$context.vao.bind(t),this._$gl.drawArrays(this._$gl.TRIANGLES,e,i)}_$drawPoints(t,e,i){this._$attachProgram(),this._$uniform.bindUniforms(),this._$context.vao.bind(t),this._$gl.drawArrays(this._$gl.POINTS,e,i)}}class Ft{static FUNCTION_GRID_OFF(){return\"\\n\\nvec2 applyMatrix(in vec2 vertex) {\\n    mat3 matrix = mat3(\\n        u_highp[0].xyz,\\n        u_highp[1].xyz,\\n        u_highp[2].xyz\\n    );\\n\\n    vec2 position = (matrix * vec3(vertex, 1.0)).xy;\\n\\n    return position;\\n}\\n\\n\"}static FUNCTION_GRID_ON(t){return`\\n\\nvec2 applyMatrix(in vec2 vertex) {\\n    mat3 parent_matrix = mat3(\\n        u_highp[${t}].xyz,\\n        u_highp[${t+1}].xyz,\\n        u_highp[${t+2}].xyz\\n    );\\n    mat3 ancestor_matrix = mat3(\\n        u_highp[${t+3}].xyz,\\n        u_highp[${t+4}].xyz,\\n        u_highp[${t+5}].xyz\\n    );\\n    vec2 parent_offset = vec2(u_highp[${t+2}].w, u_highp[${t+3}].w);\\n    vec2 parent_size   = vec2(u_highp[${t+4}].w, u_highp[${t+5}].w);\\n    vec4 grid_min = u_highp[${t+6}];\\n    vec4 grid_max = u_highp[${t+7}];\\n\\n    vec2 position = (parent_matrix * vec3(vertex, 1.0)).xy;\\n    position = (position - parent_offset) / parent_size;\\n\\n    vec4 ga = grid_min;\\n    vec4 gb = grid_max  - grid_min;\\n    vec4 gc = vec4(1.0) - grid_max;\\n\\n    vec2 pa = position;\\n    vec2 pb = position - grid_min.st;\\n    vec2 pc = position - grid_max.st;\\n\\n    position = (ga.pq / ga.st) * min(pa, ga.st)\\n             + (gb.pq / gb.st) * clamp(pb, vec2(0.0), gb.st)\\n             + (gc.pq / gc.st) * max(vec2(0.0), pc);\\n\\n    position = position * parent_size + parent_offset;\\n    position = (ancestor_matrix * vec3(position, 1.0)).xy;\\n\\n    return position;\\n}\\n\\n`}}class Bt{static TEMPLATE(t,e,i,s){const r=e-1,n=i?this.VARYING_UV_ON():\"\",a=i?this.STATEMENT_UV_ON():\"\";return`#version 300 es\\n\\nlayout (location = 0) in vec2 a_vertex;\\nlayout (location = 1) in vec2 a_option1;\\nlayout (location = 2) in vec2 a_option2;\\nlayout (location = 3) in float a_type;\\n\\nuniform vec4 u_highp[${t}];\\n\\n${n}\\n\\n${s?Ft.FUNCTION_GRID_ON(i?5:0):Ft.FUNCTION_GRID_OFF()}\\n\\nfloat crossVec2(in vec2 v1, in vec2 v2) {\\n    return v1.x * v2.y - v2.x * v1.y;\\n}\\n\\nvec2 perpendicularVec2(in vec2 v1) {\\n    float face = u_highp[${r}][1];\\n\\n    return face * vec2(v1.y, -v1.x);\\n}\\n\\nvec2 calculateNormal(in vec2 direction) {\\n    vec2 normalized = normalize(direction);\\n    return perpendicularVec2(normalized);\\n}\\n\\nvec2 calculateIntersection(in vec2 v1, in vec2 v2, in vec2 o1, in vec2 o2) {\\n    float t = crossVec2(o2 - o1, v2) / crossVec2(v1, v2);\\n    return (o1 + t * v1);\\n}\\n\\nvec2 calculateAnchor(in vec2 position, in float convex, out vec2 v1, out vec2 v2, out vec2 o1, out vec2 o2) {\\n    float miter_limit = u_highp[${r}][2];\\n\\n    vec2 a = applyMatrix(a_option1);\\n    vec2 b = applyMatrix(a_option2);\\n\\n    v1 = convex * (position - a);\\n    v2 = convex * (b - position);\\n    o1 = calculateNormal(v1) + a;\\n    o2 = calculateNormal(v2) + position;\\n\\n    vec2 anchor = calculateIntersection(v1, v2, o1, o2) - position;\\n    return normalize(anchor) * min(length(anchor), miter_limit);\\n}\\n\\nvoid main() {\\n    vec2 viewport = vec2(u_highp[0].w, u_highp[1].w);\\n    float half_width = u_highp[${r}][0];\\n\\n    vec2 position = applyMatrix(a_vertex);\\n    vec2 offset = vec2(0.0);\\n    vec2 v1, v2, o1, o2;\\n\\n    if (a_type == 1.0 || a_type == 2.0) { // 線分\\n        offset = calculateNormal(a_option2 * (applyMatrix(a_option1) - position));\\n    } else if (a_type == 10.0) { // スクエア線端\\n        offset = normalize(position - applyMatrix(a_option1));\\n        offset += a_option2 * perpendicularVec2(offset);\\n    } else if (a_type == 21.0) { // マイター結合（線分Bの凸側）\\n        offset = calculateAnchor(position, 1.0, v1, v2, o1, o2);\\n        offset = calculateIntersection(v2, perpendicularVec2(offset), o2, position + offset) - position;\\n    } else if (a_type == 22.0) { // マイター結合（線分Aの凸側）\\n        offset = calculateAnchor(position, 1.0, v1, v2, o1, o2);\\n        offset = calculateIntersection(v1, perpendicularVec2(offset), o1, position + offset) - position;\\n    } else if (a_type == 23.0) { // マイター結合（線分Aの凹側）\\n        offset = calculateAnchor(position, -1.0, v1, v2, o1, o2);\\n        offset = calculateIntersection(v1, perpendicularVec2(offset), o1, position + offset) - position;\\n    } else if (a_type == 24.0) { // マイター結合（線分Bの凹側）\\n        offset = calculateAnchor(position, -1.0, v1, v2, o1, o2);\\n        offset = calculateIntersection(v2, perpendicularVec2(offset), o2, position + offset) - position;\\n    } else if (a_type >= 30.0) { // ラウンド結合\\n        float face = u_highp[${r}][1];\\n        float rad = face * (a_type - 30.0) * 0.3488888889; /* 0.3488888889 = PI / 9.0 */\\n        offset = mat2(cos(rad), sin(rad), -sin(rad), cos(rad)) * vec2(1.0, 0.0);\\n    }\\n    \\n    offset *= half_width;\\n    position += offset;\\n    ${a}\\n\\n    position /= viewport;\\n    position = position * 2.0 - 1.0;\\n    gl_Position = vec4(position.x, -position.y, 0.0, 1.0);\\n}\\n\\n`}static VARYING_UV_ON(){return\"\\nout vec2 v_uv;\\n\"}static STATEMENT_UV_ON(){return\"\\n    mat3 uv_matrix = mat3(\\n        u_highp[0].xyz,\\n        u_highp[1].xyz,\\n        u_highp[2].xyz\\n    );\\n    mat3 inverse_matrix = mat3(\\n        u_highp[3].xyz,\\n        u_highp[4].xyz,\\n        vec3(u_highp[2].w, u_highp[3].w, u_highp[4].w)\\n    );\\n\\n    v_uv = (uv_matrix * vec3(a_vertex, 1.0)).xy;\\n    v_uv += offset;\\n    v_uv = (inverse_matrix * vec3(v_uv, 1.0)).xy;\\n\"}}class wt{static TEMPLATE(t,e,i,s){const r=i?this.ATTRIBUTE_BEZIER_ON():\"\",n=i?this.VARYING_BEZIER_ON():e?this.VARYING_UV_ON():\"\",a=i?this.STATEMENT_BEZIER_ON():e?this.STATEMENT_UV_ON():\"\";return`#version 300 es\\n\\nlayout (location = 0) in vec2 a_vertex;\\n${r}\\n\\nuniform vec4 u_highp[${t}];\\n\\n${n}\\n\\n${s?Ft.FUNCTION_GRID_ON(e?5:0):Ft.FUNCTION_GRID_OFF()}\\n\\nvoid main() {\\n    vec2 viewport = vec2(u_highp[0].w, u_highp[1].w);\\n\\n    ${a}\\n\\n    vec2 pos = applyMatrix(a_vertex) / viewport;\\n    pos = pos * 2.0 - 1.0;\\n    gl_Position = vec4(pos.x, -pos.y, 0.0, 1.0);\\n}\\n\\n`}static ATTRIBUTE_BEZIER_ON(){return\"\\nlayout (location = 1) in vec2 a_bezier;\\n\"}static VARYING_UV_ON(){return\"\\nout vec2 v_uv;\\n\"}static VARYING_BEZIER_ON(){return\"\\nout vec2 v_bezier;\\n\"}static STATEMENT_UV_ON(){return\"\\n    mat3 uv_matrix = mat3(\\n        u_highp[0].xyz,\\n        u_highp[1].xyz,\\n        u_highp[2].xyz\\n    );\\n    mat3 inverse_matrix = mat3(\\n        u_highp[3].xyz,\\n        u_highp[4].xyz,\\n        vec3(u_highp[2].w, u_highp[3].w, u_highp[4].w)\\n    );\\n\\n    v_uv = (inverse_matrix * uv_matrix * vec3(a_vertex, 1.0)).xy;\\n\"}static STATEMENT_BEZIER_ON(){return\"\\n    v_bezier = a_bezier;\\n\"}}class Rt{static FUNCTION_IS_INSIDE(){return\"\\n\\nfloat isInside(in vec2 uv) {\\n    return step(4.0, dot(step(vec4(0.0, uv.x, 0.0, uv.y), vec4(uv.x, 1.0, uv.y, 1.0)), vec4(1.0)));\\n}\\n\\n\"}static STATEMENT_INSTANCED_COLOR_TRANSFORM_ON(){return\"\\n    src.rgb /= max(0.0001, src.a);\\n    src = clamp(src * mul + add, 0.0, 1.0);\\n    src.rgb *= src.a;\\n\"}static STATEMENT_COLOR_TRANSFORM_ON(t){return`\\n    vec4 mul = u_mediump[${t}];\\n    vec4 add = u_mediump[${t+1}];\\n${Rt.STATEMENT_INSTANCED_COLOR_TRANSFORM_ON()}\\n`}}class It{static SOLID_COLOR(){return\"#version 300 es\\nprecision mediump float;\\n\\nuniform vec4 u_mediump;\\n\\nout vec4 o_color;\\n\\nvoid main() {\\n    o_color = vec4(u_mediump.rgb * u_mediump.a, u_mediump.a);\\n}\\n\\n\"}static BITMAP_CLIPPED(){return`#version 300 es\\nprecision mediump float;\\n\\nuniform sampler2D u_texture;\\nuniform vec4 u_mediump[3];\\n\\nin vec2 v_uv;\\nout vec4 o_color;\\n\\nvoid main() {\\n    vec2 uv = vec2(v_uv.x, u_mediump[0].y - v_uv.y) / u_mediump[0].xy;\\n\\n    vec4 src = texture(u_texture, uv);\\n    ${Rt.STATEMENT_COLOR_TRANSFORM_ON(1)}\\n    o_color = src;\\n}`}static BITMAP_PATTERN(){return`#version 300 es\\nprecision mediump float;\\n\\nuniform sampler2D u_texture;\\nuniform vec4 u_mediump[3];\\n\\nin vec2 v_uv;\\nout vec4 o_color;\\n\\nvoid main() {\\n    vec2 uv = fract(vec2(v_uv.x, -v_uv.y) / u_mediump[0].xy);\\n    \\n    vec4 src = texture(u_texture, uv);\\n    ${Rt.STATEMENT_COLOR_TRANSFORM_ON(1)}\\n    o_color = src;\\n}`}static MASK(){return\"#version 300 es\\nprecision mediump float;\\n\\nin vec2 v_bezier;\\nout vec4 o_color;\\n\\nvoid main() {\\n    vec2 px = dFdx(v_bezier);\\n    vec2 py = dFdy(v_bezier);\\n\\n    vec2 f = (2.0 * v_bezier.x) * vec2(px.x, py.x) - vec2(px.y, py.y);\\n    float alpha = 0.5 - (v_bezier.x * v_bezier.x - v_bezier.y) / length(f);\\n\\n    if (alpha > 0.0) {\\n        o_color = vec4(min(alpha, 1.0));\\n    } else {\\n        discard;\\n    }    \\n}\\n\\n\"}}class Pt{constructor(t,e){this._$context=t,this._$gl=e,this._$collection=D()}getSolidColorShapeShader(t,e){const i=`s${t?\"y\":\"n\"}${e?\"y\":\"n\"}`;if(this._$collection.has(i)){const t=this._$collection.get(i);if(t)return t}const s=(e?8:3)+(t?1:0),r=s;let n;n=t?Bt.TEMPLATE(s,r,!1,e):wt.TEMPLATE(s,!1,!1,e);const a=new St(this._$gl,this._$context,n,It.SOLID_COLOR());return this._$collection.set(i,a),a}getBitmapShapeShader(t,e,i){const s=`b${t?\"y\":\"n\"}${e?\"y\":\"n\"}${i?\"y\":\"n\"}`;if(this._$collection.has(s)){const t=this._$collection.get(s);if(t)return t}const r=(i?13:5)+(t?1:0),n=r;let a;a=t?Bt.TEMPLATE(r,n,!0,i):wt.TEMPLATE(r,!0,!1,i);const h=e?It.BITMAP_PATTERN():It.BITMAP_CLIPPED(),o=new St(this._$gl,this._$context,a,h);return this._$collection.set(s,o),o}getMaskShapeShader(t,e){const i=`m${t?\"y\":\"n\"}${e?\"y\":\"n\"}`;if(this._$collection.has(i)){const t=this._$collection.get(i);if(t)return t}const s=(e?8:3)+(t?1:0),r=s;let n;n=t?Bt.TEMPLATE(s,r,!1,e):wt.TEMPLATE(s,!1,!0,e);const a=new St(this._$gl,this._$context,n,It.MASK());return this._$collection.set(i,a),a}setSolidColorShapeUniform(t,e,i,s,r,n,a,h,o,_,l,c){const $=t.highp;let u;n?($[0]=_.parentMatrixA,$[1]=_.parentMatrixB,$[2]=_.parentMatrixC,$[4]=_.parentMatrixD,$[5]=_.parentMatrixE,$[6]=_.parentMatrixF,$[8]=_.parentMatrixG,$[9]=_.parentMatrixH,$[10]=_.parentMatrixI,$[12]=_.ancestorMatrixA,$[13]=_.ancestorMatrixB,$[14]=_.ancestorMatrixC,$[16]=_.ancestorMatrixD,$[17]=_.ancestorMatrixE,$[18]=_.ancestorMatrixF,$[20]=_.ancestorMatrixG,$[21]=_.ancestorMatrixH,$[22]=_.ancestorMatrixI,$[3]=h,$[7]=o,$[11]=_.parentViewportX,$[15]=_.parentViewportY,$[19]=_.parentViewportW,$[23]=_.parentViewportH,$[24]=_.minXST,$[25]=_.minYST,$[26]=_.minXPQ,$[27]=_.minYPQ,$[28]=_.maxXST,$[29]=_.maxYST,$[30]=_.maxXPQ,$[31]=_.maxYPQ,u=32):($[0]=a[0],$[1]=a[1],$[2]=a[2],$[4]=a[3],$[5]=a[4],$[6]=a[5],$[8]=a[6],$[9]=a[7],$[10]=a[8],$[3]=h,$[7]=o,u=12),e&&($[u]=i,$[u+1]=s,$[u+2]=r);const d=t.mediump;d[0]=l[0],d[1]=l[1],d[2]=l[2],d[3]=l[3]*c}setBitmapShapeUniform(t,e,i,s,r,n,a,h,o,_,l,c,$,u,d,g,f,m,p,x,b){const v=t.highp;let T;v[0]=a[0],v[1]=a[1],v[2]=a[2],v[4]=a[3],v[5]=a[4],v[6]=a[5],v[8]=a[6],v[9]=a[7],v[10]=a[8],v[12]=h[0],v[13]=h[1],v[14]=h[2],v[16]=h[3],v[17]=h[4],v[18]=h[5],v[11]=h[6],v[15]=h[7],v[19]=h[8],v[3]=o,v[7]=_,T=20,n&&(v[T]=l.parentMatrixA,v[T+1]=l.parentMatrixB,v[T+2]=l.parentMatrixC,v[T+4]=l.parentMatrixD,v[T+5]=l.parentMatrixE,v[T+6]=l.parentMatrixF,v[T+8]=l.parentMatrixG,v[T+9]=l.parentMatrixH,v[T+10]=l.parentMatrixI,v[T+12]=l.ancestorMatrixA,v[T+13]=l.ancestorMatrixB,v[T+14]=l.ancestorMatrixC,v[T+16]=l.ancestorMatrixD,v[T+17]=l.ancestorMatrixE,v[T+18]=l.ancestorMatrixF,v[T+20]=l.ancestorMatrixG,v[T+21]=l.ancestorMatrixH,v[T+22]=l.ancestorMatrixI,v[T+11]=l.parentViewportX,v[T+15]=l.parentViewportY,v[T+19]=l.parentViewportW,v[T+23]=l.parentViewportH,v[T+24]=l.minXST,v[T+25]=l.minYST,v[T+26]=l.minXPQ,v[T+27]=l.minYPQ,v[T+28]=l.maxXST,v[T+29]=l.maxYST,v[T+30]=l.maxXPQ,v[T+31]=l.maxYPQ,T=52),e&&(v[T]=i,v[T+1]=s,v[T+2]=r);const A=t.mediump;A[0]=c,A[1]=$,A[4]=u,A[5]=d,A[6]=g,A[7]=f,A[8]=m,A[9]=p,A[10]=x,A[11]=b}setMaskShapeUniform(t,e,i,s,r,n,a,h,o,_,l,c,$,u=null){const d=t.highp;e&&u?(d[0]=u.parentMatrixA,d[1]=u.parentMatrixB,d[2]=u.parentMatrixC,d[4]=u.parentMatrixD,d[5]=u.parentMatrixE,d[6]=u.parentMatrixF,d[8]=u.parentMatrixG,d[9]=u.parentMatrixH,d[10]=u.parentMatrixI,d[12]=u.ancestorMatrixA,d[13]=u.ancestorMatrixB,d[14]=u.ancestorMatrixC,d[16]=u.ancestorMatrixD,d[17]=u.ancestorMatrixE,d[18]=u.ancestorMatrixF,d[20]=u.ancestorMatrixG,d[21]=u.ancestorMatrixH,d[22]=u.ancestorMatrixI,d[3]=c,d[7]=$,d[11]=u.parentViewportX,d[15]=u.parentViewportY,d[19]=u.parentViewportW,d[23]=u.parentViewportH,d[24]=u.minXST,d[25]=u.minYST,d[26]=u.minXPQ,d[27]=u.minYPQ,d[28]=u.maxXST,d[29]=u.maxYST,d[30]=u.maxXPQ,d[31]=u.maxYPQ):(d[0]=i,d[1]=s,d[2]=r,d[4]=n,d[5]=a,d[6]=h,d[8]=o,d[9]=_,d[10]=l,d[3]=c,d[7]=$)}setMaskShapeUniformIdentity(t,e,i){const s=t.highp;s[0]=1,s[1]=0,s[2]=0,s[4]=0,s[5]=1,s[6]=0,s[8]=0,s[9]=0,s[10]=1,s[3]=e,s[7]=i}}class Nt{static TEMPLATE(t,e,i,s,r){const n=i?this.STATEMENT_GRADIENT_TYPE_RADIAL(e,s):this.STATEMENT_GRADIENT_TYPE_LINEAR(e);let a;switch(r){case\"reflect\":a=\"1.0 - abs(fract(t * 0.5) * 2.0 - 1.0)\";break;case\"repeat\":a=\"fract(t)\";break;default:a=\"clamp(t, 0.0, 1.0)\"}return`#version 300 es\\nprecision highp float;\\n\\nuniform sampler2D u_texture;\\nuniform vec4 u_highp[${t}];\\n\\nin vec2 v_uv;\\nout vec4 o_color;\\n\\nvoid main() {\\n    vec2 p = v_uv;\\n    ${n}\\n    t = ${a};\\n    o_color = texture(u_texture, vec2(t, 0.5));\\n}\\n\\n`}static STATEMENT_GRADIENT_TYPE_LINEAR(t){return`\\n    vec2 a = u_highp[${t}].xy;\\n    vec2 b = u_highp[${t}].zw;\\n\\n    vec2 ab = b - a;\\n    vec2 ap = p - a;\\n\\n    float t = dot(ab, ap) / dot(ab, ab);\\n`}static STATEMENT_GRADIENT_TYPE_RADIAL(t,e){return`\\n    float radius = u_highp[${t}][0];\\n\\n    vec2 coord = p / radius;\\n    ${e?this.STATEMENT_FOCAL_POINT_ON(t):this.STATEMENT_FOCAL_POINT_OFF()}\\n`}static STATEMENT_FOCAL_POINT_OFF(){return\"\\n    float t = length(coord);\\n\"}static STATEMENT_FOCAL_POINT_ON(t){return`\\n    vec2 focal = vec2(u_highp[${t}][1], 0.0);\\n\\n    vec2 dir = normalize(coord - focal);\\n\\n    float a = dot(dir, dir);\\n    float b = 2.0 * dot(dir, focal);\\n    float c = dot(focal, focal) - 1.0;\\n    float x = (-b + sqrt(b * b - 4.0 * a * c)) / (2.0 * a);\\n\\n    float t = distance(focal, coord) / distance(focal, focal + dir * x);\\n`}}class kt{constructor(t,e){this._$context=t,this._$gl=e,this._$collection=D()}getGradientShapeShader(t,e,i,s,r){const n=this.createCollectionKey(t,e,i,s,r);if(this._$collection.has(n)){const t=this._$collection.get(n);if(t)return t}const a=(e?13:5)+(t?1:0)+1,h=a-1;let o;o=t?Bt.TEMPLATE(a,h,!0,e):wt.TEMPLATE(a,!0,!1,e);const _=new St(this._$gl,this._$context,o,Nt.TEMPLATE(a,h,i,s,r));return this._$collection.set(n,_),_}createCollectionKey(t,e,i,s,r){const n=t?\"y\":\"n\",a=e?\"y\":\"n\",h=i?\"y\":\"n\",o=i&&s?\"y\":\"n\";let _=0;switch(r){case\"reflect\":_=1;break;case\"repeat\":_=2}return`${n}${a}${h}${o}${_}`}setGradientShapeUniform(t,e,i,s,r,n,a,h,o,_,l,c,$,u){const d=t.highp;d[0]=a[0],d[1]=a[1],d[2]=a[2],d[4]=a[3],d[5]=a[4],d[6]=a[5],d[8]=a[6],d[9]=a[7],d[10]=a[8],d[12]=h[0],d[13]=h[1],d[14]=h[2],d[16]=h[3],d[17]=h[4],d[18]=h[5],d[11]=h[6],d[15]=h[7],d[19]=h[8],d[3]=o,d[7]=_;let g=20;n&&(d[g]=l.parentMatrixA,d[g+1]=l.parentMatrixB,d[g+2]=l.parentMatrixC,d[g+4]=l.parentMatrixD,d[g+5]=l.parentMatrixE,d[g+6]=l.parentMatrixF,d[g+8]=l.parentMatrixG,d[g+9]=l.parentMatrixH,d[g+10]=l.parentMatrixI,d[g+12]=l.ancestorMatrixA,d[g+13]=l.ancestorMatrixB,d[g+14]=l.ancestorMatrixC,d[g+16]=l.ancestorMatrixD,d[g+17]=l.ancestorMatrixE,d[g+18]=l.ancestorMatrixF,d[g+20]=l.ancestorMatrixG,d[g+21]=l.ancestorMatrixH,d[g+22]=l.ancestorMatrixI,d[g+11]=l.parentViewportX,d[g+15]=l.parentViewportY,d[g+19]=l.parentViewportW,d[g+23]=l.parentViewportH,d[g+24]=l.minXST,d[g+25]=l.minYST,d[g+26]=l.minXPQ,d[g+27]=l.minYPQ,d[g+28]=l.maxXST,d[g+29]=l.maxYST,d[g+30]=l.maxXPQ,d[g+31]=l.maxYPQ,g=52),e&&(d[g]=i,d[g+1]=s,d[g+2]=r,g+=4),c?(d[g]=$[5],d[g+1]=u):(d[g]=$[0],d[g+1]=$[1],d[g+2]=$[2],d[g+3]=$[3])}}class Lt{static TEXTURE(){return\"#version 300 es\\n\\nlayout (location = 0) in vec2 a_vertex;\\n\\nout vec2 v_coord;\\n\\nvoid main() {\\n    v_coord = a_vertex;\\n\\n    vec2 position = a_vertex * 2.0 - 1.0;\\n    gl_Position = vec4(position, 0.0, 1.0);\\n}\\n\\n\"}static BLEND(){return\"#version 300 es\\n\\nlayout (location = 0) in vec2 a_vertex;\\n\\nuniform vec4 u_highp[4];\\n\\nout vec2 v_coord;\\n\\nvoid main() {\\n    v_coord = a_vertex;\\n\\n    vec2 offset   = u_highp[0].xy;\\n    vec2 size     = u_highp[0].zw;\\n    mat3 matrix   = mat3(u_highp[1].xyz, u_highp[2].xyz, u_highp[3].xyz);\\n    vec2 viewport = vec2(u_highp[1].w, u_highp[2].w);\\n\\n    vec2 position = vec2(a_vertex.x, 1.0 - a_vertex.y);\\n    position = position * size + offset;\\n    position = (matrix * vec3(position, 1.0)).xy;\\n    position /= viewport;\\n\\n    position = position * 2.0 - 1.0;\\n    gl_Position = vec4(position.x, -position.y, 0.0, 1.0);\\n}\\n\\n\"}static INSTANCE_BLEND(){return\"#version 300 es\\n\\nlayout (location = 0) in vec2 a_vertex;\\n\\nuniform vec4 u_highp[5];\\n\\nout vec2 v_src_coord;\\nout vec2 v_dst_coord;\\n\\nvoid main() {\\n    vec4 rect     = vec4(u_highp[0].x, u_highp[0].y, u_highp[0].z, u_highp[0].w);\\n    vec2 size     = vec2(u_highp[4].x, u_highp[4].y);\\n    mat3 matrix   = mat3(u_highp[1].xyz, u_highp[2].xyz, u_highp[3].xyz);\\n    vec2 viewport = vec2(u_highp[1].w, u_highp[2].w);\\n\\n    v_src_coord = a_vertex * rect.zw + rect.xy;\\n    v_dst_coord = a_vertex;\\n\\n    vec2 position = vec2(a_vertex.x, 1.0 - a_vertex.y);\\n    position = position * size;\\n    position = (matrix * vec3(position, 1.0)).xy;\\n    position /= viewport;\\n\\n    position = position * 2.0 - 1.0;\\n    gl_Position = vec4(position.x, -position.y, 0.0, 1.0);\\n}\\n\\n\"}static INSTANCE(){return\"#version 300 es\\n\\nlayout (location = 0) in vec2 a_vertex;\\nlayout (location = 1) in vec4 a_rect;\\nlayout (location = 2) in vec4 a_size;\\nlayout (location = 3) in vec2 a_offset;\\nlayout (location = 4) in vec4 a_matrix;\\nlayout (location = 5) in vec4 a_mul;\\nlayout (location = 6) in vec4 a_add;\\n\\nout vec2 v_coord;\\nout vec4 mul;\\nout vec4 add;\\n\\nvoid main() {\\n    v_coord = a_vertex * a_rect.zw + a_rect.xy;\\n    mul = a_mul;\\n    add = a_add;\\n\\n    vec2 position = vec2(a_vertex.x, 1.0 - a_vertex.y);\\n    position = position * a_size.xy;\\n    mat3 matrix = mat3(a_matrix.x, a_matrix.y, 0.0, a_matrix.z, a_matrix.w, 0.0, a_offset.x, a_offset.y, 1.0);\\n    position = (matrix * vec3(position, 1.0)).xy;\\n    position /= a_size.zw;\\n\\n    position = position * 2.0 - 1.0;\\n    gl_Position = vec4(position.x, -position.y, 0.0, 1.0);\\n}\\n\\n\"}static BLEND_CLIP(){return\"#version 300 es\\n\\nlayout (location = 0) in vec2 a_vertex;\\n\\nuniform vec4 u_highp[4];\\n\\nout vec2 v_coord;\\n\\nvoid main() {\\n    v_coord = a_vertex;\\n\\n    vec2 offset     = u_highp[0].xy;\\n    vec2 size       = u_highp[0].zw;\\n    mat3 inv_matrix = mat3(u_highp[1].xyz, u_highp[2].xyz, u_highp[3].xyz);\\n    vec2 viewport   = vec2(u_highp[1].w, u_highp[2].w);\\n\\n    vec2 position = vec2(a_vertex.x, 1.0 - a_vertex.y);\\n    position *= viewport;\\n    position = (inv_matrix * vec3(position, 1.0)).xy;\\n    position = (position - offset) / size;\\n\\n    position = position * 2.0 - 1.0;\\n    gl_Position = vec4(position.x, -position.y, 0.0, 1.0);\\n}\\n\\n\"}}class Ot{static TEMPLATE(t,e,i){let s=\"\";for(let t=1;t<e;t++){const i=t-1,n=t,a=`u_mediump[${e+r.floor(i/4)}][${i%4}]`,h=`u_mediump[${e+r.floor(n/4)}][${n%4}]`;s+=`\\n    if (t <= ${h}) {\\n        return mix(u_mediump[${i}], u_mediump[${n}], (t - ${a}) / (${h} - ${a}));\\n    }\\n`}return`#version 300 es\\nprecision mediump float;\\n\\nuniform vec4 u_mediump[${t}];\\n\\nin vec2 v_coord;\\nout vec4 o_color;\\n\\nvec4 getGradientColor(in float t) {\\n    if (t <= u_mediump[${e}][0]) {\\n        return u_mediump[0];\\n    }\\n    ${s}\\n    return u_mediump[${e-1}];\\n}\\n\\nvoid main() {\\n    vec4 color = getGradientColor(v_coord.x);\\n    ${i?\"color = pow(color, vec4(0.45454545));\":\"\"}\\n    color.rgb *= color.a;\\n\\n    o_color = color;\\n}\\n\\n`}}class Ut{constructor(t,e){this._$context=t,this._$gl=e,this._$collection=D()}getGradientLUTShader(t,e){const i=`l${(\"00\"+t).slice(-3)}${e?\"y\":\"n\"}`;if(this._$collection.has(i)){const t=this._$collection.get(i);if(t)return t}const s=r.ceil(5*t/4),n=new St(this._$gl,this._$context,Lt.TEXTURE(),Ot.TEMPLATE(s,t,e));return this._$collection.set(i,n),n}setGradientLUTUniformForShape(t,e,i,s,r){let n=0;const a=t.mediump;for(let t=i;t<s;t++){const i=e[t][1];a[n++]=r[i[0]],a[n++]=r[i[1]],a[n++]=r[i[2]],a[n++]=r[i[3]]}for(let t=i;t<s;t++)a[n++]=e[t][0]}setGradientLUTUniformForFilter(t,e,i,s,r,n){let a=0;const h=t.mediump;for(let t=r;t<n;t++){const e=i[t];h[a++]=(e>>16)/255,h[a++]=(e>>8&255)/255,h[a++]=(255&e)/255,h[a++]=s[t]}for(let t=r;t<n;t++)h[a++]=e[t]}}class Dt{static TEMPLATE(t,e,i,s,r,n,a,h,o){let _=0;const l=i?this.STATEMENT_BASE_TEXTURE_TRANSFORM(_++):\"\",c=s?this.STATEMENT_BLUR_TEXTURE_TRANSFORM(_++):this.STATEMENT_BLUR_TEXTURE(),$=\"inner\"===n,u=_;let d,g,f=4*_;switch(o?d=r?this.STATEMENT_GLOW(!1,i,h,o,u,f):this.STATEMENT_BEVEL(i,s,h,o,u,f):r?(f+=4,d=this.STATEMENT_GLOW($,i,h,o,u,f)):(f+=8,d=this.STATEMENT_BEVEL(i,s,h,o,u,f)),n){case\"outer\":g=a?\"blur - blur * base.a\":\"base + blur - blur * base.a\";break;case\"full\":g=a?\"blur\":\"base - base * blur.a + blur\";break;default:g=\"blur\"}return`#version 300 es\\nprecision mediump float;\\n\\nuniform sampler2D u_textures[${t}];\\nuniform vec4 u_mediump[${e}];\\n\\nin vec2 v_coord;\\nout vec4 o_color;\\n\\n${Rt.FUNCTION_IS_INSIDE()}\\n\\nvoid main() {\\n    ${l}\\n    ${c}\\n    ${d}\\n    o_color = ${g};\\n}\\n\\n`}static STATEMENT_BASE_TEXTURE_TRANSFORM(t){return`\\n    vec2 base_scale  = u_mediump[${t}].xy;\\n    vec2 base_offset = u_mediump[${t}].zw;\\n\\n    vec2 uv = v_coord * base_scale - base_offset;\\n    vec4 base = mix(vec4(0.0), texture(u_textures[1], uv), isInside(uv));\\n`}static STATEMENT_BLUR_TEXTURE(){return\"\\n    vec4 blur = texture(u_textures[0], v_coord);\\n\"}static STATEMENT_BLUR_TEXTURE_TRANSFORM(t){return`\\n    vec2 blur_scale  = u_mediump[${t}].xy;\\n    vec2 blur_offset = u_mediump[${t}].zw;\\n\\n    vec2 st = v_coord * blur_scale - blur_offset;\\n    vec4 blur = mix(vec4(0.0), texture(u_textures[0], st), isInside(st));\\n`}static STATEMENT_GLOW(t,e,i,s,r,n){return`\\n    ${t?\"blur.a = 1.0 - blur.a;\":\"\"}\\n    ${i?this.STATEMENT_GLOW_STRENGTH(n):\"\"}\\n    ${s?this.STATEMENT_GLOW_GRADIENT_COLOR(e):this.STATEMENT_GLOW_SOLID_COLOR(r)}\\n`}static STATEMENT_GLOW_STRENGTH(t){return`\\n    float strength = u_mediump[${r.floor(t/4)}][${t%4}];\\n    blur.a = clamp(blur.a * strength, 0.0, 1.0);\\n`}static STATEMENT_GLOW_SOLID_COLOR(t){return`\\n    vec4 color = u_mediump[${t}];\\n    blur = color * blur.a;\\n`}static STATEMENT_GLOW_GRADIENT_COLOR(t){return`\\n    blur = texture(u_textures[${t?2:1}], vec2(blur.a, 0.5));\\n`}static STATEMENT_BEVEL(t,e,i,s,r,n){return`\\n    ${e?this.STATEMENT_BLUR_TEXTURE_TRANSFORM_2():this.STATEMENT_BLUR_TEXTURE_2()}\\n    float highlight_alpha = blur.a - blur2.a;\\n    float shadow_alpha    = blur2.a - blur.a;\\n    ${i?this.STATEMENT_BEVEL_STRENGTH(n):\"\"}\\n    highlight_alpha = clamp(highlight_alpha, 0.0, 1.0);\\n    shadow_alpha    = clamp(shadow_alpha, 0.0, 1.0);\\n    ${s?this.STATEMENT_BEVEL_GRADIENT_COLOR(t):this.STATEMENT_BEVEL_SOLID_COLOR(r)}\\n`}static STATEMENT_BLUR_TEXTURE_2(){return\"\\n    vec4 blur2 = texture(u_textures[0], 1.0 - v_coord);\\n\"}static STATEMENT_BLUR_TEXTURE_TRANSFORM_2(){return\"\\n    vec2 pq = (1.0 - v_coord) * blur_scale - blur_offset;\\n    vec4 blur2 = mix(vec4(0.0), texture(u_textures[0], pq), isInside(pq));\\n\"}static STATEMENT_BEVEL_STRENGTH(t){return`\\n    float strength = u_mediump[${r.floor(t/4)}][${t%4}];\\n    highlight_alpha *= strength;\\n    shadow_alpha    *= strength;\\n`}static STATEMENT_BEVEL_SOLID_COLOR(t){return`\\n    vec4 highlight_color = u_mediump[${t}];\\n    vec4 shadow_color    = u_mediump[${t+1}];\\n    blur = highlight_color * highlight_alpha + shadow_color * shadow_alpha;\\n`}static STATEMENT_BEVEL_GRADIENT_COLOR(t){return`\\n    blur = texture(u_textures[${t?2:1}], vec2(\\n        0.5019607843137255 - 0.5019607843137255 * shadow_alpha + 0.4980392156862745 * highlight_alpha,\\n        0.5\\n    ));\\n`}}class Xt{static TEMPLATE(t){const e=t.toFixed(1);return`#version 300 es\\nprecision mediump float;\\n\\nuniform sampler2D u_texture;\\nuniform vec4 u_mediump;\\n\\nin vec2 v_coord;\\nout vec4 o_color;\\n\\nvoid main() {\\n    vec2  offset   = u_mediump.xy;\\n    float fraction = u_mediump.z;\\n    float samples  = u_mediump.w;\\n    \\n    vec4 color = texture(u_texture, v_coord);\\n\\n    for (float i = 1.0; i < ${e}; i += 1.0) {\\n        color += texture(u_texture, v_coord + offset * i);\\n        color += texture(u_texture, v_coord - offset * i);\\n    }\\n    color += texture(u_texture, v_coord + offset * ${e}) * fraction;\\n    color += texture(u_texture, v_coord - offset * ${e}) * fraction;\\n    color /= samples;\\n\\n    o_color = color;\\n}\\n\\n`}}class Vt{static TEMPLATE(){return\"#version 300 es\\nprecision mediump float;\\n\\nuniform sampler2D u_texture;\\nuniform vec4 u_mediump[5];\\n\\nin vec2 v_coord;\\nout vec4 o_color;\\n\\nvoid main() {\\n    mat4 mul = mat4(u_mediump[0], u_mediump[1], u_mediump[2], u_mediump[3]);\\n    vec4 add = u_mediump[4];\\n    \\n    vec4 color = texture(u_texture, v_coord);\\n\\n    color.rgb /= max(0.0001, color.a);\\n    color = clamp(color * mul + add, 0.0, 1.0);\\n    color.rgb *= color.a;\\n\\n    o_color = color;\\n}\\n\\n\"}}class Yt{static TEMPLATE(t,e,i,s,n){const a=r.floor(.5*e),h=r.floor(.5*i),o=e*i;let _=\"\";const l=n?1:2;for(let t=0;t<o;++t)_+=`\\n    result += getWeightedColor(${t}, u_mediump[${l+r.floor(t/4)}][${t%4}]);\\n`;const c=s?\"result.a = texture(u_texture, v_coord).a;\":\"\",$=n?\"\":\"\\n    vec4 substitute_color = u_mediump[1];\\n    color = mix(substitute_color, color, isInside(uv));\\n\";return`#version 300 es\\nprecision mediump float;\\n\\nuniform sampler2D u_texture;\\nuniform vec4 u_mediump[${t}];\\n\\nin vec2 v_coord;\\nout vec4 o_color;\\n\\n${Rt.FUNCTION_IS_INSIDE()}\\n\\nvec4 getWeightedColor (in int i, in float weight) {\\n    vec2 rcp_size = u_mediump[0].xy;\\n\\n    int i_div_x = i / ${e};\\n    int i_mod_x = i - ${e} * i_div_x;\\n    vec2 offset = vec2(i_mod_x - ${a}, ${h} - i_div_x);\\n    vec2 uv = v_coord + offset * rcp_size;\\n\\n    vec4 color = texture(u_texture, uv);\\n    color.rgb /= max(0.0001, color.a);\\n    ${$}\\n\\n    return color * weight;\\n}\\n\\nvoid main() {\\n    float rcp_divisor = u_mediump[0].z;\\n    float bias        = u_mediump[0].w;\\n\\n    vec4 result = vec4(0.0);\\n    ${_}\\n    result = clamp(result * rcp_divisor + bias, 0.0, 1.0);\\n    ${c}\\n\\n    result.rgb *= result.a;\\n    o_color = result;\\n}\\n\\n`}}class zt{static TEMPLATE(t,e,i,s){let r,n,a;switch(e){case 1:r=\"map_color.r\";break;case 2:r=\"map_color.g\";break;case 4:r=\"map_color.b\";break;case 8:r=\"map_color.a\";break;default:r=\"0.5\"}switch(i){case 1:n=\"map_color.r\";break;case 2:n=\"map_color.g\";break;case 4:n=\"map_color.b\";break;case 8:n=\"map_color.a\";break;default:n=\"0.5\"}switch(s){case\"clamp\":a=\"\\n    vec4 source_color = texture(u_textures[0], uv);\\n\";break;case\"ignore\":a=\"\\n    vec4 source_color =texture(u_textures[0], mix(v_coord, uv, step(abs(uv - vec2(0.5)), vec2(0.5))));\\n\";break;case\"color\":a=\"\\n    vec4 substitute_color = u_mediump[2];\\n    vec4 source_color = mix(substitute_color, texture(u_textures[0], uv), isInside(uv));\\n\";break;default:a=\"\\n    vec4 source_color = texture(u_textures[0], fract(uv));\\n\"}return`#version 300 es\\nprecision mediump float;\\n\\nuniform sampler2D u_textures[2];\\nuniform vec4 u_mediump[${t}];\\n\\nin vec2 v_coord;\\nout vec4 o_color;\\n\\n${Rt.FUNCTION_IS_INSIDE()}\\n\\nvoid main() {\\n    vec2 uv_to_st_scale  = u_mediump[0].xy;\\n    vec2 uv_to_st_offset = u_mediump[0].zw;\\n    vec2 scale           = u_mediump[1].xy;\\n\\n    vec2 st = v_coord * uv_to_st_scale - uv_to_st_offset;\\n    vec4 map_color = texture(u_textures[1], st);\\n\\n    vec2 offset = vec2(${r}, ${n}) - 0.5;\\n    vec2 uv = v_coord + offset * scale;\\n    ${a}\\n\\n    o_color = mix(texture(u_textures[0], v_coord), source_color, isInside(st));\\n}\\n\\n`}}class Gt{constructor(t,e){this._$context=t,this._$gl=e,this._$collection=D()}getBlurFilterShader(t){const e=`b${t}`;if(this._$collection.has(e)){const t=this._$collection.get(e);if(t)return t}const i=new St(this._$gl,this._$context,Lt.TEXTURE(),Xt.TEMPLATE(t));return this._$collection.set(e,i),i}getBitmapFilterShader(t,e,i,s,n,a,h){const o=`f${t?\"y\":\"n\"}${e?\"y\":\"n\"}${i?\"y\":\"n\"}${s}${n?\"y\":\"n\"}${a?\"y\":\"n\"}`;if(this._$collection.has(o)){const t=this._$collection.get(o);if(t)return t}let _=1;t&&_++,h&&_++;let l=(t?4:0)+(e?4:0)+(a?1:0);h||(l+=i?4:8),l=r.ceil(l/4);const c=new St(this._$gl,this._$context,Lt.TEXTURE(),Dt.TEMPLATE(_,l,t,e,i,s,n,a,h));return this._$collection.set(o,c),c}getColorMatrixFilterShader(){if(this._$collection.has(\"m\")){const t=this._$collection.get(\"m\");if(t)return t}const t=new St(this._$gl,this._$context,Lt.TEXTURE(),Vt.TEMPLATE());return this._$collection.set(\"m\",t),t}getConvolutionFilterShader(t,e,i,s){const n=`c${(\"0\"+t).slice(-2)}${(\"0\"+e).slice(-2)}${i?\"y\":\"n\"}${s?\"y\":\"n\"}`;if(this._$collection.has(n)){const t=this._$collection.get(n);if(t)return t}const a=(s?1:2)+r.ceil(t*e/4),h=new St(this._$gl,this._$context,Lt.TEXTURE(),Yt.TEMPLATE(a,t,e,i,s));return this._$collection.set(n,h),h}getDisplacementMapFilterShader(t,e,i){const s=`d${t}${e}${i}`;if(this._$collection.has(s)){const t=this._$collection.get(s);if(t)return t}const r=\"color\"===i?3:2,n=new St(this._$gl,this._$context,Lt.TEXTURE(),zt.TEMPLATE(r,t,e,i));return this._$collection.set(s,n),n}setBlurFilterUniform(t,e,i,s,r,n){const a=t.mediump;s?(a[0]=1/e,a[1]=0):(a[0]=0,a[1]=1/i),a[2]=r,a[3]=n}setBitmapFilterUniform(t,e,i,s,r,n,a,h,o,_,l,c,$,u,d,g,f,m,p,x,b,v,T,A,M){let y;v?(y=t.textures,y[0]=0,y[1]=1,M&&(y[2]=2)):M&&(y=t.textures,y[0]=0,y[1]=2);const E=t.mediump;let C=0;v&&(E[C]=e/s,E[C+1]=i/r,E[C+2]=n/s,E[C+3]=(i-r-a)/r,C+=4),T&&(E[C]=e/h,E[C+1]=i/o,E[C+2]=_/h,E[C+3]=(i-o-l)/o,C+=4),M||(c?(E[C]=u,E[C+1]=d,E[C+2]=g,E[C+3]=f,C+=4):(E[C]=u,E[C+1]=d,E[C+2]=g,E[C+3]=f,E[C+4]=m,E[C+5]=p,E[C+6]=x,E[C+7]=b,C+=8)),A&&(E[C]=$)}setColorMatrixFilterUniform(t,e){const i=t.mediump;i[0]=e[0],i[1]=e[1],i[2]=e[2],i[3]=e[3],i[4]=e[5],i[5]=e[6],i[6]=e[7],i[7]=e[8],i[8]=e[10],i[9]=e[11],i[10]=e[12],i[11]=e[13],i[12]=e[15],i[13]=e[16],i[14]=e[17],i[15]=e[18],i[16]=e[4]/255,i[17]=e[9]/255,i[18]=e[14]/255,i[19]=e[19]/255}setConvolutionFilterUniform(t,e,i,s,r,n,a,h,o,_,l){const c=t.mediump;c[0]=1/e,c[1]=1/i,c[2]=1/r,c[3]=n/255;let $=4;a||(c[$]=h,c[$+1]=o,c[$+2]=_,c[$+3]=l,$+=4);const u=s.length;for(let t=0;t<u;t++)c[$++]=s[t]}setDisplacementMapFilterUniform(t,e,i,s,r,n,a,h,o,_,l,c,$,u){const d=t.textures;d[0]=0,d[1]=1;const g=t.mediump;g[0]=s/e,g[1]=r/i,g[2]=n/e,g[3]=(r-i-a)/i,g[4]=h/s,g[5]=-o/r,\"color\"===_&&(g[8]=l,g[9]=c,g[10]=$,g[11]=u)}}class Ht{static TEMPLATE(t){return`#version 300 es\\nprecision mediump float;\\n\\nuniform sampler2D u_texture;\\n${t?\"uniform vec4 u_mediump[2];\":\"\"}\\n\\nin vec2 v_coord;\\nout vec4 o_color;\\n\\nvoid main() {\\n    vec4 src = texture(u_texture, v_coord);\\n    ${t?Rt.STATEMENT_COLOR_TRANSFORM_ON(0):\"\"}\\n    o_color = src;\\n}\\n\\n`}static INSTANCE_TEMPLATE(){return\"#version 300 es\\nprecision mediump float;\\n\\nuniform sampler2D u_texture;\\n\\nin vec4 mul;\\nin vec4 add;\\nin vec2 v_coord;\\nout vec4 o_color;\\n\\nvoid main() {\\n    vec4 src = texture(u_texture, v_coord);\\n\\n    if (mul.x != 1.0 || mul.y != 1.0 || mul.z != 1.0 || mul.w != 1.0\\n        || add.x != 0.0 || add.y != 0.0 || add.z != 0.0 || add.w != 0.0\\n    ) {\\n        src.rgb /= max(0.0001, src.a);\\n        src = clamp(src * mul + add, 0.0, 1.0);\\n        src.rgb *= src.a;\\n    }\\n    \\n    o_color = src;\\n}\\n\\n\"}}class Wt{static TEMPLATE(t,e){let i;switch(t){case\"subtract\":i=this.FUNCTION_SUBTRACT();break;case\"multiply\":i=this.FUNCTION_MULTIPLY();break;case\"lighten\":i=this.FUNCTION_LIGHTEN();break;case\"darken\":i=this.FUNCTION_DARKEN();break;case\"overlay\":i=this.FUNCTION_OVERLAY();break;case\"hardlight\":i=this.FUNCTION_HARDLIGHT();break;case\"difference\":i=this.FUNCTION_DIFFERENCE();break;case\"invert\":i=this.FUNCTION_INVERT();break;default:i=this.FUNCTION_NORMAL()}return`#version 300 es\\nprecision mediump float;\\n\\nuniform sampler2D u_textures[2];\\n${e?\"uniform vec4 u_mediump[2];\":\"\"}\\n\\nin vec2 v_coord;\\nout vec4 o_color;\\n\\n${i}\\n\\nvoid main() {\\n    vec4 dst = texture(u_textures[0], v_coord);\\n    vec4 src = texture(u_textures[1], v_coord);\\n    ${e?Rt.STATEMENT_COLOR_TRANSFORM_ON(0):\"\"}\\n    o_color = blend(src, dst);\\n}\\n\\n`}static INSTANCE_TEMPLATE(t,e){let i;switch(t){case\"subtract\":i=this.FUNCTION_SUBTRACT();break;case\"multiply\":i=this.FUNCTION_MULTIPLY();break;case\"lighten\":i=this.FUNCTION_LIGHTEN();break;case\"darken\":i=this.FUNCTION_DARKEN();break;case\"overlay\":i=this.FUNCTION_OVERLAY();break;case\"hardlight\":i=this.FUNCTION_HARDLIGHT();break;case\"difference\":i=this.FUNCTION_DIFFERENCE();break;case\"invert\":i=this.FUNCTION_INVERT();break;default:i=this.FUNCTION_NORMAL()}return`#version 300 es\\nprecision mediump float;\\n\\nuniform sampler2D u_textures[2];\\n${e?\"uniform vec4 u_mediump[2];\":\"\"}\\n\\nin vec2 v_src_coord;\\nin vec2 v_dst_coord;\\nout vec4 o_color;\\n\\n${i}\\n\\nvoid main() {\\n    vec4 dst = texture(u_textures[0], v_dst_coord);\\n    vec4 src = texture(u_textures[1], v_src_coord);\\n    ${e?Rt.STATEMENT_COLOR_TRANSFORM_ON(0):\"\"}\\n    o_color = blend(src, dst);\\n}\\n\\n`}static FUNCTION_NORMAL(){return\"\\n\\nvec4 blend (in vec4 src, in vec4 dst) {\\n    return src + dst - dst * src.a;\\n}\\n\\n\"}static FUNCTION_SUBTRACT(){return\"\\n\\nvec4 blend (in vec4 src, in vec4 dst) {\\n    if (src.a == 0.0) { return dst; }\\n    if (dst.a == 0.0) { return src; }\\n\\n    vec4 a = src - src * dst.a;\\n    vec4 b = dst - dst * src.a;\\n\\n    src.rgb /= src.a;\\n    dst.rgb /= dst.a;\\n\\n    vec4 c = vec4(dst.rgb - src.rgb, src.a * dst.a);\\n    c.rgb *= c.a;\\n\\n    return a + b + c;\\n}\\n\\n\"}static FUNCTION_MULTIPLY(){return\"\\n\\nvec4 blend (in vec4 src, in vec4 dst) {\\n    vec4 a = src - src * dst.a;\\n    vec4 b = dst - dst * src.a;\\n    vec4 c = src * dst;\\n\\n    return a + b + c;\\n}\\n\\n\"}static FUNCTION_LIGHTEN(){return\"\\n\\nvec4 blend (in vec4 src, in vec4 dst) {\\n    if (src.a == 0.0) { return dst; }\\n    if (dst.a == 0.0) { return src; }\\n\\n    vec4 a = src - src * dst.a;\\n    vec4 b = dst - dst * src.a;\\n\\n    src.rgb /= src.a;\\n    dst.rgb /= dst.a;\\n\\n    vec4 c = vec4(mix(src.rgb, dst.rgb, step(src.rgb, dst.rgb)), src.a * dst.a);\\n    c.rgb *= c.a;\\n\\n    return a + b + c;\\n}\\n\\n\"}static FUNCTION_DARKEN(){return\"\\n\\nvec4 blend (in vec4 src, in vec4 dst) {\\n    if (src.a == 0.0) { return dst; }\\n    if (dst.a == 0.0) { return src; }\\n\\n    vec4 a = src - src * dst.a;\\n    vec4 b = dst - dst * src.a;\\n\\n    src.rgb /= src.a;\\n    dst.rgb /= dst.a;\\n\\n    vec4 c = vec4(mix(src.rgb, dst.rgb, step(dst.rgb, src.rgb)), src.a * dst.a);\\n    c.rgb *= c.a;\\n\\n    return a + b + c;\\n}\\n\\n\"}static FUNCTION_OVERLAY(){return\"\\n\\nvec4 blend (in vec4 src, in vec4 dst) {\\n    if (src.a == 0.0) { return dst; }\\n    if (dst.a == 0.0) { return src; }\\n\\n    vec4 a = src - src * dst.a;\\n    vec4 b = dst - dst * src.a;\\n\\n    src.rgb /= src.a;\\n    dst.rgb /= dst.a;\\n\\n    vec4 mul = src * dst;\\n    vec3 c1 = 2.0 * mul.rgb;\\n    vec3 c2 = 2.0 * (src.rgb + dst.rgb - mul.rgb) - 1.0;\\n    vec4 c = vec4(mix(c1, c2, step(vec3(0.5), dst.rgb)), mul.a);\\n    c.rgb *= c.a;\\n\\n    return a + b + c;\\n}\\n\\n\"}static FUNCTION_HARDLIGHT(){return\"\\n\\nvec4 blend (in vec4 src, in vec4 dst) {\\n    if (src.a == 0.0) { return dst; }\\n    if (dst.a == 0.0) { return src; }\\n\\n    vec4 a = src - src * dst.a;\\n    vec4 b = dst - dst * src.a;\\n\\n    src.rgb /= src.a;\\n    dst.rgb /= dst.a;\\n\\n    vec4 mul = src * dst;\\n    vec3 c1 = 2.0 * mul.rgb;\\n    vec3 c2 = 2.0 * (src.rgb + dst.rgb - mul.rgb) - 1.0;\\n    vec4 c = vec4(mix(c1, c2, step(vec3(0.5), src.rgb)), mul.a);\\n    c.rgb *= c.a;\\n\\n    return a + b + c;\\n}\\n\\n\"}static FUNCTION_DIFFERENCE(){return\"\\n\\nvec4 blend (in vec4 src, in vec4 dst) {\\n    if (src.a == 0.0) { return dst; }\\n    if (dst.a == 0.0) { return src; }\\n\\n    vec4 a = src - src * dst.a;\\n    vec4 b = dst - dst * src.a;\\n\\n    src.rgb /= src.a;\\n    dst.rgb /= dst.a;\\n\\n    vec4 c = vec4(abs(src.rgb - dst.rgb), src.a * dst.a);\\n    c.rgb *= c.a;\\n\\n    return a + b + c;\\n}\\n\\n\"}static FUNCTION_INVERT(){return\"\\n\\nvec4 blend (in vec4 src, in vec4 dst) {\\n    if (src.a == 0.0) { return dst; }\\n    if (dst.a == 0.0) { return src; }\\n\\n    vec4 b = dst - dst * src.a;\\n    vec4 c = vec4(src.a - dst.rgb * src.a, src.a);\\n\\n    return b + c;\\n}\\n\\n\"}}class qt{constructor(t,e){this._$context=t,this._$gl=e,this._$collection=D()}getInstanceShader(){if(this._$collection.has(\"i\")){const t=this._$collection.get(\"i\");if(t)return t}const t=new St(this._$gl,this._$context,Lt.INSTANCE(),Ht.INSTANCE_TEMPLATE());return this._$collection.set(\"i\",t),t}getNormalBlendShader(t){const e=\"n\"+(t?\"y\":\"n\");if(this._$collection.has(e)){const t=this._$collection.get(e);if(t)return t}const i=new St(this._$gl,this._$context,Lt.BLEND(),Ht.TEMPLATE(t));return this._$collection.set(e,i),i}getClipShader(){if(this._$collection.has(\"c\")){const t=this._$collection.get(\"c\");if(t)return t}const t=new St(this._$gl,this._$context,Lt.BLEND_CLIP(),Ht.TEMPLATE(!1));return this._$collection.set(\"c\",t),t}getBlendShader(t,e){const i=`${t}${e?\"y\":\"n\"}`;if(this._$collection.has(i)){const t=this._$collection.get(i);if(t)return t}const s=new St(this._$gl,this._$context,Lt.BLEND(),Wt.TEMPLATE(t,e));return this._$collection.set(i,s),s}getInstanceBlendShader(t,e){const i=`i${t}${e?\"y\":\"n\"}`;if(this._$collection.has(i)){const t=this._$collection.get(i);if(t)return t}const s=new St(this._$gl,this._$context,Lt.INSTANCE_BLEND(),Wt.INSTANCE_TEMPLATE(t,e));return this._$collection.set(i,s),s}setNormalBlendUniform(t,e,i,s,r,n,a,h,o,_,l,c,$,u,d,g,f){const m=t.highp;if(m[0]=e,m[1]=i,m[2]=s,m[3]=r,m[4]=n[0],m[5]=n[1],m[6]=n[2],m[8]=n[3],m[9]=n[4],m[10]=n[5],m[12]=n[6],m[13]=n[7],m[14]=n[8],m[7]=a,m[11]=h,o){const e=t.mediump;e[0]=_,e[1]=l,e[2]=c,e[3]=$,e[4]=u,e[5]=d,e[6]=g,e[7]=f}}pushNormalBlend(t,e,i,s,r,n,a,h,o=1,_=1,l=1,c=1,$=0,u=0,d=0,g=0){t.attributes.push(e/pt,i/pt,s/pt,r/pt,s,r,a,h,n[6],n[7],n[0],n[1],n[3],n[4],o,_,l,c,$,u,d,g),t.count++}setClipUniform(t,e,i,s,r,n,a,h){const o=t.highp;o[0]=e,o[1]=i,o[2]=s,o[3]=r,o[4]=n[0],o[5]=n[1],o[6]=n[2],o[8]=n[3],o[9]=n[4],o[10]=n[5],o[12]=n[6],o[13]=n[7],o[14]=n[8],o[7]=a,o[11]=h}setInstanceBlendUniform(t,e,i,s,r,n,a,h,o,_,l,c,$,u,d,g,f,m,p){const x=t.textures;x[0]=0,x[1]=1;const b=t.highp;if(b[0]=e,b[1]=i,b[2]=s,b[3]=r,b[4]=h[0],b[5]=h[1],b[6]=h[2],b[8]=h[3],b[9]=h[4],b[10]=h[5],b[12]=h[6],b[13]=h[7],b[14]=h[8],b[7]=o,b[11]=_,b[16]=n,b[17]=a,l){const e=t.mediump;e[0]=c,e[1]=$,e[2]=u,e[3]=d,e[4]=g,e[5]=f,e[6]=m,e[7]=p}}setBlendUniform(t,e,i,s,r,n,a,h,o,_,l,c,$,u,d,g,f){const m=t.textures;m[0]=0,m[1]=1;const p=t.highp;if(p[0]=e,p[1]=i,p[2]=s,p[3]=r,p[4]=n[0],p[5]=n[1],p[6]=n[2],p[8]=n[3],p[9]=n[4],p[10]=n[5],p[12]=n[6],p[13]=n[7],p[14]=n[8],p[7]=a,p[11]=h,o){const e=t.mediump;e[0]=_,e[1]=l,e[2]=c,e[3]=$,e[4]=u,e[5]=d,e[6]=g,e[7]=f}}}class jt{constructor(t,e){this._$currentProgramId=-1,this._$shapeShaderVariants=new Pt(t,e),this._$gradientShapeShaderVariants=new kt(t,e),this._$gradientLUTShaderVariants=new Ut(t,e),this._$filterShaderVariants=new Gt(t,e),this._$blendShaderVariants=new qt(t,e)}get currentProgramId(){return this._$currentProgramId}set currentProgramId(t){this._$currentProgramId=t}get shapeShaderVariants(){return this._$shapeShaderVariants}get gradientShapeShaderVariants(){return this._$gradientShapeShaderVariants}get gradientLUTShaderVariants(){return this._$gradientLUTShaderVariants}get filterShaderVariants(){return this._$filterShaderVariants}get blendShaderVariants(){return this._$blendShaderVariants}}class Kt{constructor(t,e){this._$context=t,this._$gl=e,this._$attachment=t.frameBuffer.createTextureAttachment(512,1),this._$maxLength=r.floor(.75*e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS)),this._$rgbToLinearTable=new Float32Array(256),this._$rgbIdentityTable=new Float32Array(256);for(let t=0;t<256;t++){const e=t/255;this._$rgbToLinearTable[t]=r.pow(e,2.23333333),this._$rgbIdentityTable[t]=e}}generateForShape(t,e){const i=this._$context.frameBuffer.currentAttachment,s=this._$context.cachePosition;s&&this._$gl.disable(this._$gl.SCISSOR_TEST),this._$context._$bind(this._$attachment);const n=t.length,a=this._$context.shaderList.gradientLUTShaderVariants,h=e?this._$rgbToLinearTable:this._$rgbIdentityTable;this._$context.blend.toOneZero();for(let i=0;i<n;i+=this._$maxLength-1){const s=r.min(i+this._$maxLength,n),o=a.getGradientLUTShader(s-i,e),_=o.uniform;a.setGradientLUTUniformForShape(_,t,i,s,h),o._$drawGradient(0===i?0:t[i][0],s===n?1:t[s-1][0])}if(this._$context._$bind(i),!this._$attachment.texture)throw new Error(\"the texture is null.\");return s&&this._$context.bindRenderBuffer(s),this._$attachment.texture}generateForFilter(t,e,i){const s=this._$context.frameBuffer.currentAttachment;this._$context._$bind(this._$attachment);const n=t.length,a=this._$context.shaderList.gradientLUTShaderVariants;this._$context.blend.toOneZero();for(let s=0;s<n;s+=this._$maxLength-1){const h=r.min(s+this._$maxLength,n),o=a.getGradientLUTShader(h-s,!1),_=o.uniform;a.setGradientLUTUniformForFilter(_,t,e,i,s,h),o._$drawGradient(0===s?0:t[s],h===n?1:t[h-1])}if(this._$context._$bind(s),!this._$attachment.texture)throw new Error(\"the texture is null.\");return this._$attachment.texture}}class Qt{static get indexRangePool(){return this._$indexRangePool}static generate(t){let e=0;for(let i=0;i<t.length;++i)e+=12*(t[i].length/3-2);this._$vertexBufferData=new o(e),this._$indexRanges=L(),this._$currentIndex=0;for(let e=0;e<t.length;++e){const i=this._$currentIndex;this._$generateMesh(t[e]);const s=this._$currentIndex-i,r=this._$indexRangePool.pop()||{first:0,count:0};r.first=i,r.count=s,this._$indexRanges.push(r)}return{vertexBufferData:this._$vertexBufferData,indexRanges:this._$indexRanges}}static _$generateMesh(t){const e=this._$vertexBufferData;let i=this._$currentIndex;const s=t.length-5;for(let r=3;r<s;r+=3){let s=4*i;t[r+2]?(e[s++]=t[r-3],e[s++]=t[r-2],e[s++]=0,e[s++]=0,e[s++]=t[r],e[s++]=t[r+1],e[s++]=.5,e[s++]=0,e[s++]=t[r+3],e[s++]=t[r+4],e[s++]=1,e[s++]=1):t[r+5]?(e[s++]=t[0],e[s++]=t[1],e[s++]=.5,e[s++]=.5,e[s++]=t[r],e[s++]=t[r+1],e[s++]=.5,e[s++]=.5,e[s++]=t[r+6],e[s++]=t[r+7],e[s++]=.5,e[s++]=.5):(e[s++]=t[0],e[s++]=t[1],e[s++]=.5,e[s++]=.5,e[s++]=t[r],e[s++]=t[r+1],e[s++]=.5,e[s++]=.5,e[s++]=t[r+3],e[s++]=t[r+4],e[s++]=.5,e[s++]=.5),i+=3}this._$currentIndex=i}}Qt._$indexRangePool=L();class Jt{static generate(t,e,i){this._$vertexBufferData=this._$vertexBufferData||new o(1024),this._$vertexBufferPos=0,this._$indexBufferData=this._$indexBufferData||new Int16Array(256),this._$indexBufferPos=0,this._$lineCap=e,this._$lineJoin=i;for(let e=0;e<t.length;e++){const i=this._$vertexBufferPos;this._$generateLineSegment(t[e]);const s=this._$vertexBufferPos;this._$generateLineJoin(i,s),this._$generateLineCap(i,s)}return{vertexBufferData:this._$vertexBufferData.slice(0,this._$vertexBufferPos),indexBufferData:this._$indexBufferData.slice(0,this._$indexBufferPos)}}static _$expandVertexBufferIfNeeded(t){if(this._$vertexBufferPos+t>this._$vertexBufferData.length){const t=new o(2*this._$vertexBufferData.length);t.set(this._$vertexBufferData),this._$vertexBufferData=t}}static _$expandIndexBufferIfNeeded(t){if(this._$indexBufferPos+t>this._$indexBufferData.length){const t=new l(2*this._$indexBufferData.length);t.set(this._$indexBufferData),this._$indexBufferData=t}}static _$generateLineSegment(t){const e=t.length-5;for(let i=0;i<e;i+=3)t[i+2]||(t[i+5]?this._$addQuadSegmentMesh(t[i],t[i+1],t[i+3],t[i+4],t[i+6],t[i+7]):this._$addLineSegmentMesh(t[i],t[i+1],t[i+3],t[i+4]))}static _$addQuadSegmentMesh(t,e,i,s,r,n){let a=t,h=e;for(let o=1;o<11;o++){const _=o/11,l=1-_,c=(t*l+i*_)*l+(i*l+r*_)*_,$=(e*l+s*_)*l+(s*l+n*_)*_;this._$addLineSegmentMesh(a,h,c,$,2),a=c,h=$}this._$addLineSegmentMesh(a,h,r,n)}static _$addLineSegmentMesh(t,e,i,s,r=1){const n=this._$vertexBufferPos/7,a=n+1,h=n+2,o=n+3;this._$expandIndexBufferIfNeeded(6);const _=this._$indexBufferData;let l=this._$indexBufferPos;_[l++]=n,_[l++]=a,_[l++]=o,_[l++]=o,_[l++]=h,_[l++]=n,this._$indexBufferPos=l,this._$expandVertexBufferIfNeeded(28);const c=this._$vertexBufferData;let $=this._$vertexBufferPos;c[$++]=t,c[$++]=e,c[$++]=i,c[$++]=s,c[$++]=1,c[$++]=1,c[$++]=1,c[$++]=t,c[$++]=e,c[$++]=i,c[$++]=s,c[$++]=-1,c[$++]=-1,c[$++]=1,c[$++]=i,c[$++]=s,c[$++]=t,c[$++]=e,c[$++]=-1,c[$++]=-1,c[$++]=r,c[$++]=i,c[$++]=s,c[$++]=t,c[$++]=e,c[$++]=1,c[$++]=1,c[$++]=r,this._$vertexBufferPos=$}static _$generateLineJoin(t,e){const i=this._$vertexBufferData,s=e-55;for(let e=t;e<s;e+=28){const t=e/7;this._$addLineJoinMesh(i[e],i[e+1],i[e+21],i[e+22],i[e+27],i[e+49],i[e+50],t+2,t+3,t+4,t+5)}}static _$addLineJoinMesh(t,e,i,s,n,a,h,o,_,l=0,c=0){const $=i-t,u=s-e,d=a-i,g=h-s,f=this._$cross($,u,d,g);if(!(r.abs(f)<1e-4))if(2!==n)switch(this._$lineJoin){case\"round\":this._$addRoundJoinMesh(i,s);break;case\"miter\":this._$addMiterJoinMesh(i,s,t,e,a,h,l,o,_,c);break;default:this._$addBevelJoinMesh(i,s,l,o,_,c)}else this._$addBevelJoinMesh(i,s,l,o,_,c)}static _$addRoundJoinMesh(t,e){const i=this._$vertexBufferPos/7;this._$expandIndexBufferIfNeeded(57);const s=this._$indexBufferData;let r=this._$indexBufferPos;for(let t=1;t<18;t++){const e=i+t;s[r++]=i,s[r++]=e,s[r++]=e+1}s[r++]=i,s[r++]=i+18,s[r++]=i+1,this._$indexBufferPos=r,this._$expandVertexBufferIfNeeded(133);const n=this._$vertexBufferData;let a=this._$vertexBufferPos;n[a++]=t,n[a++]=e,n[a++]=0,n[a++]=0,n[a++]=0,n[a++]=0,n[a++]=0;for(let i=0;i<18;i++)n[a++]=t,n[a++]=e,n[a++]=0,n[a++]=0,n[a++]=0,n[a++]=0,n[a++]=30+i;this._$vertexBufferPos=a}static _$addMiterJoinMesh(t,e,i,s,r,n,a,h,o,_){const l=this._$vertexBufferPos/7,c=l+1,$=l+2,u=l+3,d=l+4;this._$expandIndexBufferIfNeeded(18);const g=this._$indexBufferData;let f=this._$indexBufferPos;g[f++]=l,g[f++]=a,g[f++]=c,g[f++]=l,g[f++]=c,g[f++]=$,g[f++]=l,g[f++]=$,g[f++]=h,g[f++]=l,g[f++]=o,g[f++]=u,g[f++]=l,g[f++]=u,g[f++]=d,g[f++]=l,g[f++]=d,g[f++]=_,this._$indexBufferPos=f,this._$expandVertexBufferIfNeeded(35);const m=this._$vertexBufferData;let p=this._$vertexBufferPos;m[p++]=t,m[p++]=e,m[p++]=i,m[p++]=s,m[p++]=r,m[p++]=n,m[p++]=0,m[p++]=t,m[p++]=e,m[p++]=i,m[p++]=s,m[p++]=r,m[p++]=n,m[p++]=21,m[p++]=t,m[p++]=e,m[p++]=i,m[p++]=s,m[p++]=r,m[p++]=n,m[p++]=22,m[p++]=t,m[p++]=e,m[p++]=i,m[p++]=s,m[p++]=r,m[p++]=n,m[p++]=23,m[p++]=t,m[p++]=e,m[p++]=i,m[p++]=s,m[p++]=r,m[p++]=n,m[p++]=24,this._$vertexBufferPos=p}static _$addBevelJoinMesh(t,e,i,s,r,n){const a=this._$vertexBufferPos/7;this._$expandIndexBufferIfNeeded(6);const h=this._$indexBufferData;let o=this._$indexBufferPos;h[o++]=a,h[o++]=i,h[o++]=s,h[o++]=a,h[o++]=r,h[o++]=n,this._$indexBufferPos=o,this._$expandVertexBufferIfNeeded(7);const _=this._$vertexBufferData;let l=this._$vertexBufferPos;_[l++]=t,_[l++]=e,_[l++]=0,_[l++]=0,_[l++]=0,_[l++]=0,_[l++]=0,this._$vertexBufferPos=l}static _$generateLineCap(t,e){const i=this._$vertexBufferData,s=i[t],r=i[t+1],n=i[t+2],a=i[t+3],h=i[e-7],o=i[e-6],_=i[e-5],l=i[e-4],c=t/7,$=e/7;s!==h||r!==o?(this._$addLineCapMesh(s,r,n,a,c,c+1),this._$addLineCapMesh(h,o,_,l,$-1,$-2)):this._$addLineJoinMesh(_,l,s,r,n,a,$-2,$-1,c,c+1)}static _$addLineCapMesh(t,e,i,s,r,n){switch(this._$lineCap){case\"round\":this._$addRoundJoinMesh(t,e);break;case\"square\":this._$addSquareCapMesh(t,e,i,s,r,n)}}static _$addSquareCapMesh(t,e,i,s,r,n){const a=this._$vertexBufferPos/7,h=a+1;this._$expandIndexBufferIfNeeded(6);const o=this._$indexBufferData;let _=this._$indexBufferPos;o[_++]=r,o[_++]=a,o[_++]=h,o[_++]=h,o[_++]=n,o[_++]=r,this._$indexBufferPos=_,this._$expandVertexBufferIfNeeded(14);const l=this._$vertexBufferData;let c=this._$vertexBufferPos;l[c++]=t,l[c++]=e,l[c++]=i,l[c++]=s,l[c++]=-1,l[c++]=-1,l[c++]=10,l[c++]=t,l[c++]=e,l[c++]=i,l[c++]=s,l[c++]=1,l[c++]=1,l[c++]=10,this._$vertexBufferPos=c}}Jt._$cross=(t,e,i,s)=>t*s-i*e;class Zt{constructor(t){this._$gl=t,this._$fillVertexArrayPool=[],this._$strokeVertexArrayPool=[],this._$boundVertexArray=null,this._$fillAttrib_vertex=0,this._$fillAttrib_bezier=1,this._$strokeAttrib_vertex=0,this._$strokeAttrib_option1=1,this._$strokeAttrib_option2=2,this._$strokeAttrib_type=3,this._$vertexBufferData=new Float32Array([0,0,0,1,1,0,1,1]),this._$attributeVertexBuffer=t.createBuffer(),this._$attributeBuffer=new Float32Array(22),this._$instanceVertexArray=this._$getCommonVertexArray(),this._$commonVertexArray=this._$getVertexArray(0,1)}_$getCommonVertexArray(){const t=this._$gl.createVertexArray();this.bind(t);const e=this._$gl.createBuffer();return this._$gl.bindBuffer(this._$gl.ARRAY_BUFFER,e),this._$gl.bufferData(this._$gl.ARRAY_BUFFER,new Float32Array([0,0,0,1,1,0,1,1]),this._$gl.STATIC_DRAW),this._$gl.enableVertexAttribArray(0),this._$gl.vertexAttribPointer(0,2,this._$gl.FLOAT,!1,0,0),this._$gl.bindBuffer(this._$gl.ARRAY_BUFFER,this._$attributeVertexBuffer),this._$gl.bufferData(this._$gl.ARRAY_BUFFER,this._$attributeBuffer.byteLength,this._$gl.DYNAMIC_DRAW),this._$gl.enableVertexAttribArray(1),this._$gl.vertexAttribPointer(1,4,this._$gl.FLOAT,!1,88,0),this._$gl.vertexAttribDivisor(1,1),this._$gl.enableVertexAttribArray(2),this._$gl.vertexAttribPointer(2,4,this._$gl.FLOAT,!1,88,16),this._$gl.vertexAttribDivisor(2,1),this._$gl.enableVertexAttribArray(3),this._$gl.vertexAttribPointer(3,2,this._$gl.FLOAT,!1,88,32),this._$gl.vertexAttribDivisor(3,1),this._$gl.enableVertexAttribArray(4),this._$gl.vertexAttribPointer(4,4,this._$gl.FLOAT,!1,88,40),this._$gl.vertexAttribDivisor(4,1),this._$gl.enableVertexAttribArray(5),this._$gl.vertexAttribPointer(5,4,this._$gl.FLOAT,!1,88,56),this._$gl.vertexAttribDivisor(5,1),this._$gl.enableVertexAttribArray(6),this._$gl.vertexAttribPointer(6,4,this._$gl.FLOAT,!1,88,72),this._$gl.vertexAttribDivisor(6,1),t}_$getVertexArray(t,e){const i=this._$gl.createVertexArray();this.bind(i);const s=this._$gl.createBuffer();return this._$gl.bindBuffer(this._$gl.ARRAY_BUFFER,s),this._$vertexBufferData[0]=t,this._$vertexBufferData[2]=t,this._$vertexBufferData[4]=e,this._$vertexBufferData[6]=e,this._$gl.bufferData(this._$gl.ARRAY_BUFFER,this._$vertexBufferData,this._$gl.STATIC_DRAW),this._$gl.enableVertexAttribArray(0),this._$gl.vertexAttribPointer(0,2,this._$gl.FLOAT,!1,0,0),i}_$getFillVertexArray(){if(this._$fillVertexArrayPool.length){const t=this._$fillVertexArrayPool.pop();if(t)return t}const t=this._$gl.createVertexArray();this.bind(t);const e=this._$gl.createBuffer();return t.vertexBuffer=e,t.vertexLength=0,this._$gl.bindBuffer(this._$gl.ARRAY_BUFFER,e),this._$gl.enableVertexAttribArray(0),this._$gl.enableVertexAttribArray(1),this._$gl.vertexAttribPointer(this._$fillAttrib_vertex,2,this._$gl.FLOAT,!1,16,0),this._$gl.vertexAttribPointer(this._$fillAttrib_bezier,2,this._$gl.FLOAT,!1,16,8),t}_$getStrokeVertexArray(){if(this._$strokeVertexArrayPool.length){const t=this._$strokeVertexArrayPool.pop();if(t)return t}const t=this._$gl.createVertexArray();this.bind(t);const e=this._$gl.createBuffer();t.vertexBuffer=e,t.vertexLength=0,this._$gl.bindBuffer(this._$gl.ARRAY_BUFFER,e);const i=this._$gl.createBuffer();return t.indexBuffer=i,t.indexLength=0,this._$gl.bindBuffer(this._$gl.ELEMENT_ARRAY_BUFFER,i),this._$gl.enableVertexAttribArray(0),this._$gl.enableVertexAttribArray(1),this._$gl.enableVertexAttribArray(2),this._$gl.enableVertexAttribArray(3),this._$gl.vertexAttribPointer(this._$strokeAttrib_vertex,2,this._$gl.FLOAT,!1,28,0),this._$gl.vertexAttribPointer(this._$strokeAttrib_option1,2,this._$gl.FLOAT,!1,28,8),this._$gl.vertexAttribPointer(this._$strokeAttrib_option2,2,this._$gl.FLOAT,!1,28,16),this._$gl.vertexAttribPointer(this._$strokeAttrib_type,1,this._$gl.FLOAT,!1,28,24),t}createFill(t){const e=Qt.generate(t),i=e.vertexBufferData,s=this._$getFillVertexArray();return s.indexRanges=e.indexRanges,this.bind(s),this._$gl.bindBuffer(this._$gl.ARRAY_BUFFER,s.vertexBuffer),s.vertexLength<i.length&&(s.vertexLength=X(i.length),this._$gl.bufferData(this._$gl.ARRAY_BUFFER,4*s.vertexLength,this._$gl.DYNAMIC_DRAW)),this._$gl.bufferSubData(this._$gl.ARRAY_BUFFER,0,i),s}createStroke(t,e,i){const s=Jt.generate(t,e,i),r=s.vertexBufferData,n=s.indexBufferData,a=this._$getStrokeVertexArray();return a.indexCount=n.length,this.bind(a),this._$gl.bindBuffer(this._$gl.ARRAY_BUFFER,a.vertexBuffer),this._$gl.bindBuffer(this._$gl.ELEMENT_ARRAY_BUFFER,a.indexBuffer),a.vertexLength<r.length&&(a.vertexLength=X(r.length),this._$gl.bufferData(this._$gl.ARRAY_BUFFER,4*a.vertexLength,this._$gl.DYNAMIC_DRAW)),a.indexLength<n.length&&(a.indexLength=X(n.length),this._$gl.bufferData(this._$gl.ELEMENT_ARRAY_BUFFER,2*a.indexLength,this._$gl.DYNAMIC_DRAW)),this._$gl.bufferSubData(this._$gl.ARRAY_BUFFER,0,r),this._$gl.bufferSubData(this._$gl.ELEMENT_ARRAY_BUFFER,0,n),a}releaseFill(t){this._$fillVertexArrayPool.push(t)}releaseStroke(t){this._$strokeVertexArrayPool.push(t)}bind(t=null){t!==this._$boundVertexArray&&(this._$boundVertexArray=t,this._$gl.bindVertexArray(t))}bindInstnceArray(t){this.bind(this._$instanceVertexArray),this._$gl.bindBuffer(this._$gl.ARRAY_BUFFER,this._$attributeVertexBuffer),t.attributes.length>this._$attributeBuffer.length&&(this._$attributeBuffer=new Float32Array(t.attributes.length),this._$gl.bufferData(this._$gl.ARRAY_BUFFER,this._$attributeBuffer.byteLength,this._$gl.DYNAMIC_DRAW)),this._$attributeBuffer.set(t.attributes),this._$gl.bufferSubData(this._$gl.ARRAY_BUFFER,0,this._$attributeBuffer.subarray(0,t.attributes.length))}bindCommonVertexArray(){this.bind(this._$commonVertexArray)}bindGradientVertexArray(t,e){const i=this._$getVertexArray(t,e);this.bind(i)}}class te{constructor(t,e){this._$context=t,this._$gl=e,this._$clips=[],this._$poolClip=[],this._$clipStatus=!1,this._$containerClip=!1,this._$currentClip=!1}get containerClip(){return this._$containerClip}set containerClip(t){this._$containerClip=t}_$onClear(t){t&&(this._$gl.enable(this._$gl.STENCIL_TEST),this._$currentClip=!0)}_$onBind(t){!t&&this._$currentClip?(this._$gl.disable(this._$gl.STENCIL_TEST),this._$currentClip=!1):t&&!this._$currentClip&&(this._$gl.enable(this._$gl.STENCIL_TEST),this._$currentClip=!0,this._$endClipDef())}_$onClearRect(){this._$gl.disable(this._$gl.STENCIL_TEST),this._$currentClip=!1}_$enterClip(){this._$currentClip||(this._$gl.enable(this._$gl.STENCIL_TEST),this._$currentClip=!0);const t=this._$context.frameBuffer.currentAttachment;if(!t)throw new Error(\"mask currentAttachment is null.\");t.mask=!0,++t.clipLevel}_$beginClipDef(){const t=this._$context.frameBuffer.currentAttachment;if(!t)throw new Error(\"mask currentAttachment is null.\");this._$gl.enable(this._$gl.SAMPLE_ALPHA_TO_COVERAGE),this._$gl.stencilFunc(this._$gl.ALWAYS,0,255),this._$gl.stencilOp(this._$gl.KEEP,this._$gl.INVERT,this._$gl.INVERT),this._$gl.stencilMask(1<<t.clipLevel-1),this._$gl.colorMask(!1,!1,!1,!1)}_$endClipDef(){const t=this._$context.frameBuffer.currentAttachment;if(!t)throw new Error(\"mask currentAttachment is null.\");const e=t.clipLevel;let i=0;for(let t=0;t<e;++t)i|=(1<<e-t)-1;this._$gl.disable(this._$gl.SAMPLE_ALPHA_TO_COVERAGE),this._$gl.stencilFunc(this._$gl.EQUAL,255&i,i),this._$gl.stencilOp(this._$gl.KEEP,this._$gl.KEEP,this._$gl.KEEP),this._$gl.stencilMask(255),this._$gl.colorMask(!0,!0,!0,!0)}_$leaveClip(){const t=this._$context.frameBuffer.currentAttachment;if(!t)throw new Error(\"mask currentAttachment is null.\");if(--t.clipLevel,t.mask=!!t.clipLevel,!t.clipLevel)return void this._$context._$clearRectStencil();const e=t.width,i=t.height,s=this._$context.path.createRectVertices(0,0,e,i),r=this._$context.vao.createFill(s);O(s.pop()),O(s);const n=this._$context.shaderList.shapeShaderVariants,a=n.getMaskShapeShader(!1,!1),h=a.uniform;n.setMaskShapeUniformIdentity(h,e,i);const o=r.indexRanges[0];this._$currentClip||(this._$currentClip=!0,this._$gl.enable(this._$gl.STENCIL_TEST)),this._$gl.enable(this._$gl.SAMPLE_ALPHA_TO_COVERAGE),this._$gl.stencilFunc(this._$gl.ALWAYS,0,255),this._$gl.stencilOp(this._$gl.REPLACE,this._$gl.REPLACE,this._$gl.REPLACE),this._$gl.stencilMask(1<<t.clipLevel),this._$gl.colorMask(!1,!1,!1,!1),a._$containerClip(r,o.first,o.count);const _=r.indexRanges;for(let t=0;t<_.length;++t)Qt.indexRangePool.push(_[t]);O(r.indexRanges),this._$context.vao.releaseFill(r),this._$endClipDef()}_$drawContainerClip(){const t=this._$context.frameBuffer.currentAttachment;if(!t)throw new Error(\"mask currentAttachment is null.\");const e=t.clipLevel,i=this._$context.shaderList.shapeShaderVariants,s=i.getMaskShapeShader(!1,!1),r=s.uniform;let n=e;const a=t.width,h=t.height;this._$gl.enable(this._$gl.SAMPLE_ALPHA_TO_COVERAGE),this._$gl.stencilFunc(this._$gl.ALWAYS,0,255),this._$gl.stencilOp(this._$gl.KEEP,this._$gl.INVERT,this._$gl.INVERT),this._$gl.colorMask(!1,!1,!1,!1);const o=this._$poolClip.length;for(let t=0;t<o;++t){const t=this._$poolClip.shift();if(!t)continue;i.setMaskShapeUniform(r,!1,t.matrixA,t.matrixB,t.matrixC,t.matrixD,t.matrixE,t.matrixF,t.matrixG,t.matrixH,t.matrixI,t.viewportWidth,t.viewportHeight,null);const o=t.vertexArrayObject.indexRanges;for(let e=0;e<o.length;++e){const i=o[e];this._$gl.stencilMask(1<<n-1),s._$containerClip(t.vertexArrayObject,i.first,i.count),Qt.indexRangePool.push(i)}O(o),this._$context.vao.releaseFill(t.vertexArrayObject),++n,n>7&&(this._$unionStencilMask(e,a,h),n=e)}n>e+1&&this._$unionStencilMask(e,a,h)}_$unionStencilMask(t,e,i){const s=this._$context.path.createRectVertices(0,0,e,i),r=this._$context.vao.createFill(s);O(s.pop()),O(s);const n=this._$context.shaderList.shapeShaderVariants,a=n.getMaskShapeShader(!1,!1),h=a.uniform;n.setMaskShapeUniformIdentity(h,e,i);const o=r.indexRanges[0];this._$gl.stencilFunc(this._$gl.LEQUAL,1<<t-1,255),this._$gl.stencilOp(this._$gl.ZERO,this._$gl.REPLACE,this._$gl.REPLACE),this._$gl.stencilMask(~((1<<t-1)-1)),a._$containerClip(r,o.first,o.count),this._$poolClip.length&&(this._$gl.stencilFunc(this._$gl.ALWAYS,0,255),this._$gl.stencilOp(this._$gl.KEEP,this._$gl.INVERT,this._$gl.INVERT));const _=r.indexRanges;for(let t=0;t<_.length;++t)Qt.indexRangePool.push(_[t]);O(r.indexRanges),this._$context.vao.releaseFill(r)}_$onClip(t,e,i,s){return this._$clipStatus=!0,!!this._$containerClip&&(this._$poolClip.push({vertexArrayObject:t,matrixA:e[0],matrixB:e[1],matrixC:e[2],matrixD:e[3],matrixE:e[4],matrixF:e[5],matrixG:e[6],matrixH:e[7],matrixI:e[8],viewportWidth:i,viewportHeight:s}),!0)}_$onSave(){this._$clips.push(this._$clipStatus)}_$onRestore(){this._$clips.length&&(this._$clipStatus=!!this._$clips.pop())}}class ee{constructor(t,e){this._$context=t,this._$gl=e,this._$enabled=!1,this._$funcCode=600,this._$currentOperation=\"normal\",this._$currentIndex=-1,this._$currentSmoothing=null,this._$variants=t.shaderList.blendShaderVariants,this._$instanceShader=this._$variants.getInstanceShader(),this.enable()}enable(){this._$enabled||(this._$enabled=!0,this._$gl.enable(this._$gl.BLEND)),this.reset()}disable(){this._$enabled&&(this._$enabled=!1,this._$gl.disable(this._$gl.BLEND))}reset(){613!==this._$funcCode&&(this._$funcCode=613,this._$gl.blendFunc(this._$gl.ONE,this._$gl.ONE_MINUS_SRC_ALPHA))}toOneZero(){610!==this._$funcCode&&(this._$funcCode=610,this._$gl.blendFunc(this._$gl.ONE,this._$gl.ZERO))}toZeroOne(){601!==this._$funcCode&&(this._$funcCode=601,this._$gl.blendFuncSeparate(this._$gl.ZERO,this._$gl.ONE,this._$gl.ONE,this._$gl.ZERO))}toAdd(){611!==this._$funcCode&&(this._$funcCode=611,this._$gl.blendFunc(this._$gl.ONE,this._$gl.ONE))}toScreen(){641!==this._$funcCode&&(this._$funcCode=641,this._$gl.blendFunc(this._$gl.ONE_MINUS_DST_COLOR,this._$gl.ONE))}toAlpha(){606!==this._$funcCode&&(this._$funcCode=606,this._$gl.blendFunc(this._$gl.ZERO,this._$gl.SRC_ALPHA))}toErase(){603!==this._$funcCode&&(this._$funcCode=603,this._$gl.blendFunc(this._$gl.ZERO,this._$gl.ONE_MINUS_SRC_ALPHA))}toSourceAtop(){673!==this._$funcCode&&(this._$funcCode=673,this._$gl.blendFunc(this._$gl.DST_ALPHA,this._$gl.ONE_MINUS_SRC_ALPHA))}toSourceIn(){670!==this._$funcCode&&(this._$funcCode=670,this._$gl.blendFunc(this._$gl.DST_ALPHA,this._$gl.ZERO))}toOperation(t){switch(t){case\"add\":this.toAdd();break;case\"screen\":this.toScreen();break;case\"alpha\":this.toAlpha();break;case\"erase\":this.toErase();break;case\"copy\":this.toOneZero();break;default:this.reset()}}clearInstacedArray(){const t=this._$instanceShader.instance;t.count&&t.clear()}drawInstacedArray(){const t=this._$instanceShader.instance;if(!t.count)return;const e=this._$context.frameBuffer,i=e.textureManager.getAtlasTexture(this._$currentIndex);e.textureManager.bind0(i,this._$currentSmoothing),this.toOperation(this._$currentOperation),this._$instanceShader.drawArraysInstanced(t),t.clear()}drawInstance(t,e,i,s,r,n,a,h,o,_,l,c,$,u){this._$currentOperation||(this._$currentOperation=_),-1===this._$currentIndex&&(this._$currentIndex=t.index),null===this._$currentSmoothing&&(this._$currentSmoothing=u),this._$currentOperation===_&&this._$currentIndex===t.index&&this._$currentSmoothing===u||(this.drawInstacedArray(),this._$currentOperation=_,this._$currentIndex=t.index,this._$currentSmoothing=u),this._$variants.pushNormalBlend(this._$instanceShader.instance,t.x,t.y,t.w,t.h,$,l,c,e,i,s,r,n,a,h,o)}drawInstanceBlend(t,e,i,s,n,a,h,o,_,l,c,$,u,d,g,f,m,p,x){this.drawInstacedArray();const b=this._$context.frameBuffer,v=b.currentAttachment,T=1!==a||1!==h||1!==o||1!==_||0!==l||0!==c||0!==$||0!==u,A=b.getTextureFromCurrentAttachment(),M=this._$context.frameBuffer.createTextureAttachment(d.w,d.h);this._$context._$bind(M),b.textureManager.bind0(A);const y=this._$variants.getClipShader(),E=y.uniform;this._$variants.setClipUniform(E,0,0,d.w,d.h,V(p),f,m),this.reset(),y._$drawImage();const C=b.getTextureFromCurrentAttachment();this._$context._$bind(v),b.textureManager.bind01(C,t,x);const S=this._$variants.getInstanceBlendShader(g,T);this._$variants.setInstanceBlendUniform(S.uniform,d.x/t.width,d.y/t.height,d.w/t.width,d.h/t.height,d.w,d.h,p,f,m,T,a,h,o,_,l,c,$,u);const F=r.abs(s-e),B=r.abs(n-i);this._$gl.enable(this._$gl.SCISSOR_TEST),this._$gl.scissor(e,m-(i+B),F,B),this.toOneZero(),S._$drawImage(),this._$gl.disable(this._$gl.SCISSOR_TEST),b.releaseAttachment(M,!0)}drawImage(t,e,i,s,n,a,o,_,l,c,$,u,d,g,f,m,p,x){const b=this._$context.frameBuffer,v=b.currentAttachment,T=1!==a||1!==o||1!==_||1!==l||0!==c||0!==$||0!==u||0!==d;switch(g){case\"normal\":case\"layer\":case\"add\":case\"screen\":case\"alpha\":case\"erase\":case\"copy\":{b.textureManager.bind0(t,x);const v=this._$variants.getNormalBlendShader(T);this._$variants.setNormalBlendUniform(v.uniform,e,i,s,n,p,f,m,T,a,o,_,l,c,$,u,d);const A=p[0],M=p[1],y=p[3],E=p[4],C=p[6],S=p[7];if(1!==A||0!==M||0!==y||1!==E){const t=e+s,a=i+n,o=+(t*A+a*y+C),_=+(t*A+i*y+C),l=+(e*A+a*y+C),c=+(e*A+i*y+C),$=+(t*M+a*E+S),u=+(t*M+i*E+S),d=+(e*M+a*E+S),g=+(e*M+i*E+S),p=h.MAX_VALUE,x=+r.min(r.min(r.min(r.min(p,o),_),l),c),b=+r.max(r.max(r.max(r.max(-p,o),_),l),c),v=+r.min(r.min(r.min(r.min(p,$),u),d),g),T=+r.max(r.max(r.max(r.max(-p,$),u),d),g),F=r.max(0,x),B=r.max(0,v),w=r.min(r.max(0,f-F),r.ceil(r.abs(b-x))),R=r.min(r.max(0,m-B),r.ceil(r.abs(T-v)));if(!w||!R)return;this._$gl.enable(this._$gl.SCISSOR_TEST),this._$gl.scissor(F,r.max(0,m-(B+R)),w+1,R+1)}else{const t=r.max(0,e+C),a=r.max(0,i+S),h=r.min(r.max(0,f-t),s),o=r.min(r.max(0,m-a),n);if(!h||!o)return;this._$gl.enable(this._$gl.SCISSOR_TEST),this._$gl.scissor(t,r.max(0,m-(a+o)),h+1,o+1)}this.toOperation(g),v._$drawImage(),this._$gl.disable(this._$gl.SCISSOR_TEST)}break;default:{const h=r.max(0,e+p[6]),A=r.max(0,i+p[7]),M=r.min(r.max(0,f-h),s),y=r.min(r.max(0,m-A),n);if(!M||!y)return;const E=b.getTextureFromCurrentAttachment(),C=this._$context.frameBuffer.createTextureAttachment(s,n);this._$context._$bind(C),b.textureManager.bind0(E);const S=this._$variants.getClipShader(),F=S.uniform;this._$variants.setClipUniform(F,e,i,s,n,V(p),f,m),this.reset(),S._$drawImage();const B=b.getTextureFromCurrentAttachment();this._$context._$bind(v),b.textureManager.bind01(B,t,x);const w=this._$variants.getBlendShader(g,T);this._$variants.setBlendUniform(w.uniform,e,i,s,n,p,f,m,T,a,o,_,l,c,$,u,d),this._$gl.enable(this._$gl.SCISSOR_TEST),this._$gl.scissor(h,r.max(0,m-(A+y)),M,y),this.toOneZero(),w._$drawImage(),this._$gl.disable(this._$gl.SCISSOR_TEST),b.releaseAttachment(C,!0)}}}}class ie{constructor(t,e){var i;i=t.getParameter(t.MAX_TEXTURE_SIZE),pt=Math.min(4096,i/2),this._$gl=t;const s=r.min(e,t.getParameter(t.MAX_SAMPLES));this._$maxTextureSize=r.min(8192,t.getParameter(t.MAX_TEXTURE_SIZE))-2,this._$contextStyle=new mt,this._$cacheBounds=S(),this._$matrix=k(1,0,0,0,1,0,0,0,1),this._$cacheAttachment=null,this._$stack=[],this._$globalAlpha=1,this._$imageSmoothingEnabled=!1,this._$globalCompositeOperation=\"normal\",this._$clearColorR=1,this._$clearColorG=1,this._$clearColorB=1,this._$clearColorA=1,this._$viewportWidth=0,this._$viewportHeight=0,this._$frameBufferManager=new Tt(t,s),this._$path=new Mt,this._$grid=new yt,this._$offsetX=0,this._$offsetY=0,this._$blends=L(),this._$positions=L(),this._$isLayer=!1,this._$shaderList=new jt(this,t),this._$gradientLUT=new Kt(this,t),this._$vao=new Zt(t),this._$mask=new te(this,t),this._$blend=new ee(this,t),this._$attachmentArray=[],this._$maskBounds=S(0,0,0,0),this._$cachePosition=null}get cachePosition(){return this._$cachePosition}set cachePosition(t){this._$cachePosition=t}reset(){this._$globalAlpha=1,this._$globalCompositeOperation=\"normal\",this._$imageSmoothingEnabled=!1,this._$contextStyle.clear()}get isLayer(){return this._$isLayer}get canvas(){return this._$gl.canvas}get cacheAttachment(){return this._$cacheAttachment}set cacheAttachment(t){this._$cacheAttachment=t}get cacheBounds(){return this._$cacheBounds}get fillStyle(){return this._$contextStyle.fillStyle}set fillStyle(t){this._$contextStyle.fillStyle=t}get strokeStyle(){return this._$contextStyle.strokeStyle}set strokeStyle(t){this._$contextStyle.strokeStyle=t}get lineWidth(){return this._$contextStyle.lineWidth}set lineWidth(t){this._$contextStyle.lineWidth=t}get lineCap(){return this._$contextStyle.lineCap}set lineCap(t){this._$contextStyle.lineCap=t}get lineJoin(){return this._$contextStyle.lineJoin}set lineJoin(t){this._$contextStyle.lineJoin=t}get miterLimit(){return this._$contextStyle.miterLimit}set miterLimit(t){this._$contextStyle.miterLimit=t}get globalAlpha(){return this._$globalAlpha}set globalAlpha(t){this._$globalAlpha=Y(t,0,1,1)}get imageSmoothingEnabled(){return this._$imageSmoothingEnabled}set imageSmoothingEnabled(t){this._$imageSmoothingEnabled=t}get globalCompositeOperation(){return this._$globalCompositeOperation}set globalCompositeOperation(t){this._$globalCompositeOperation=t}get frameBuffer(){return this._$frameBufferManager}get shaderList(){return this._$shaderList}get path(){return this._$path}get grid(){return this._$grid}get vao(){return this._$vao}get blend(){return this._$blend}_$getCurrentPosition(){return this._$positions[this._$positions.length-1]}_$getTextureScale(t,e){const i=r.max(t,e);return i>this._$maxTextureSize?this._$maxTextureSize/i:1}drawInstacedArray(){this.blend.drawInstacedArray()}clearInstacedArray(){this.blend.clearInstacedArray()}bindRenderBuffer(t){this._$frameBufferManager.bindRenderBuffer(),this._$gl.clearColor(0,0,0,0),this._$gl.clear(this._$gl.COLOR_BUFFER_BIT|this._$gl.STENCIL_BUFFER_BIT),this._$viewportWidth=t.w,this._$viewportHeight=t.h,this._$gl.viewport(t.x,t.y,t.w,t.h),this._$gl.enable(this._$gl.SCISSOR_TEST),this._$gl.scissor(t.x,t.y,t.w,t.h)}getTextureFromRect(t){const e=this._$frameBufferManager,i=e.textureManager.getAtlasTexture(t.index),s=e.currentAttachment,r=e.createTextureAttachment(t.w,t.h);this._$bind(r),this.save(),this.setTransform(1,0,0,1,0,0),this.reset(),this.drawImage(i,-t.x,-i.height+t.h+t.y,i.width,i.height),this.restore();const n=r.texture;return e.releaseAttachment(r),this._$bind(s),n}drawBitmap(t){const e=this._$shaderList.blendShaderVariants,i=e.getNormalBlendShader(!1);e.setNormalBlendUniform(i.uniform,0,0,t.width,t.height,this._$matrix,this._$viewportWidth,this._$viewportHeight,!1,1,1,1,1,0,0,0,0),this._$frameBufferManager.textureManager.bind0(t,this._$imageSmoothingEnabled),this.blend.toOperation(\"normal\"),i._$drawImage()}drawTextureFromRect(t,e){const i=this._$frameBufferManager,s=i.currentAttachment;this.bindRenderBuffer(e),i.transferTexture(e);const r=i.textureManager.getAtlasTexture(e.index),n=i.createTextureAttachmentFrom(r);this._$bind(n),this._$gl.enable(this._$gl.SCISSOR_TEST),this._$gl.scissor(e.x,e.y,e.w,e.h),this._$gl.clearColor(0,0,0,0),this._$gl.disable(this._$gl.SCISSOR_TEST),this.save(),this.setTransform(1,0,0,1,0,0),this.reset(),this.drawImage(t,e.x,r.height-e.h-e.y,t.width,t.height),this.restore(),i.releaseAttachment(n),this._$bind(s),i.textureManager.release(t)}stopStencil(){this._$mask._$onClearRect()}_$bind(t=null){if(!t)return;this._$frameBufferManager.bind(t);const e=t.color,i=t.stencil,s=t.width,r=t.height;this._$viewportWidth===s&&this._$viewportHeight===r||(this._$viewportWidth=s,this._$viewportHeight=r,this._$gl.viewport(0,0,s,r)),(e&&e.dirty||i&&i.dirty)&&(e&&(e.dirty=!1),i&&(i.dirty=!1),this._$gl.clearColor(0,0,0,0),this.clearRect(0,0,this._$viewportWidth,this._$viewportHeight),this._$gl.clearColor(this._$clearColorR,this._$clearColorG,this._$clearColorB,this._$clearColorA),this._$mask._$onClear(t.mask)),this._$mask._$onBind(t.mask)}setTransform(t,e,i,s,r,n){this._$matrix[0]=t,this._$matrix[1]=e,this._$matrix[3]=i,this._$matrix[4]=s,this._$matrix[6]=r,this._$matrix[7]=n}setMaxSize(t,e){this._$frameBufferManager.setMaxSize(t,e)}transform(t,e,i,s,r,n){const a=this._$matrix[0],h=this._$matrix[1],o=this._$matrix[3],_=this._$matrix[4],l=this._$matrix[6],c=this._$matrix[7];this._$matrix[0]=t*a+e*o,this._$matrix[1]=t*h+e*_,this._$matrix[3]=i*a+s*o,this._$matrix[4]=i*h+s*_,this._$matrix[6]=r*a+n*o+l,this._$matrix[7]=r*h+n*_+c}debug(t=0){const e=this._$frameBufferManager,i=e.textureManager.getAtlasTexture(t),s=e.currentAttachment,r=e.createTextureAttachmentFrom(i);this._$bind(r);const n=new Uint8Array(i.width*i.height*4);this._$gl.readPixels(0,0,i.width,i.height,this._$gl.RGBA,this._$gl.UNSIGNED_BYTE,n);const a=document.createElement(\"canvas\");a.width=i.width,a.height=i.height;const h=a.getContext(\"2d\"),o=new ImageData(i.width,i.height);for(let t=0;t<n.length;++t)o.data[t]=n[t];null==h||h.putImageData(o,0,0),console.log(a.toDataURL()),this._$bind(s),e.releaseAttachment(r)}drawInstance(t,e,i,s,r){let n=1,a=1,h=1,o=0,_=0,l=0;const c=this._$globalAlpha;r&&(n=r[0],a=r[1],h=r[2],o=r[4]/255,_=r[5]/255,l=r[6]/255);const $=this._$cachePosition;if($)switch(this._$globalCompositeOperation){case\"normal\":case\"layer\":case\"add\":case\"screen\":case\"alpha\":case\"erase\":case\"copy\":this.blend.drawInstance($,n,a,h,c,o,_,l,0,this._$globalCompositeOperation,this._$viewportWidth,this._$viewportHeight,this._$matrix,this._$imageSmoothingEnabled);break;default:{const r=this._$frameBufferManager.textureManager.getAtlasTexture($.index);this.blend.drawInstanceBlend(r,t,e,i,s,n,a,h,c,o,_,l,0,$,this._$globalCompositeOperation,this._$viewportWidth,this._$viewportHeight,this._$matrix,this._$imageSmoothingEnabled)}}}drawImage(t,e,i,s,r,n=null){let a=1,h=1,o=1,_=0,l=0,c=0;const $=this._$globalAlpha;n&&(a=n[0],h=n[1],o=n[2],_=n[4]/255,l=n[5]/255,c=n[6]/255),this.blend.drawImage(t,e,i,s,r,a,h,o,$,_,l,c,0,this._$globalCompositeOperation,this._$viewportWidth,this._$viewportHeight,this._$matrix,this._$imageSmoothingEnabled)}_$setColor(t=0,e=0,i=0,s=0){this._$clearColorR=t,this._$clearColorG=e,this._$clearColorB=i,this._$clearColorA=s,this._$gl.clearColor(t,e,i,s)}clearRect(t,e,i,s){this._$mask._$onClearRect(),this._$gl.enable(this._$gl.SCISSOR_TEST),this._$gl.scissor(t,e,i,s),this._$gl.clear(this._$gl.COLOR_BUFFER_BIT|this._$gl.STENCIL_BUFFER_BIT),this._$gl.disable(this._$gl.SCISSOR_TEST)}_$clearRectStencil(){this._$mask._$onClearRect(),this._$gl.enable(this._$gl.SCISSOR_TEST),this._$gl.scissor(this._$maskBounds.xMin,this._$maskBounds.yMin,this._$maskBounds.xMax,this._$maskBounds.yMax),this._$gl.clear(this._$gl.STENCIL_BUFFER_BIT),this._$gl.disable(this._$gl.SCISSOR_TEST)}moveTo(t,e){this._$path.moveTo(t,e)}lineTo(t,e){this._$path.lineTo(t,e)}beginPath(){this._$path.begin()}quadraticCurveTo(t,e,i,s){this._$path.quadTo(t,e,i,s)}bezierCurveTo(t,e,i,s,r,n){this._$path.cubicTo(t,e,i,s,r,n)}fill(){const t=this._$path.vertices;if(!t.length)return;const e=L();for(let i=0;i<t.length;++i){const s=t[i];10>s.length||e.push(s)}if(!e.length)return void O(e);const i=this._$vao.createFill(e),s=this.fillStyle;let r,n,a,h=this._$matrix;const o=this._$grid.enabled;if(s instanceof gt){const t=s.stops,e=\"linearRGB\"===s.rgb;if(r=this._$gradientLUT.generateForShape(t,e),this._$frameBufferManager.textureManager.bind0(r,!0),this._$frameBufferManager.bindRenderBuffer(),n=this._$shaderList.gradientShapeShaderVariants,\"linear\"===s.type)a=n.getGradientShapeShader(!1,o,!1,!1,s.mode),n.setGradientShapeUniform(a.uniform,!1,0,0,0,o,h,V(this._$matrix),this._$viewportWidth,this._$viewportHeight,this._$grid,!1,s.points,0);else{h=this._$stack[this._$stack.length-1];const t=0!==s.focalPointRatio;a=n.getGradientShapeShader(!1,o,!0,t,s.mode),n.setGradientShapeUniform(a.uniform,!1,0,0,0,o,h,V(this._$matrix),this._$viewportWidth,this._$viewportHeight,this._$grid,!0,s.points,s.focalPointRatio)}}else if(s instanceof ft){h=this._$stack[this._$stack.length-1];const t=s.colorTransform;r=s.texture,this._$frameBufferManager.textureManager.bind0(r,this._$imageSmoothingEnabled),n=this._$shaderList.shapeShaderVariants,a=n.getBitmapShapeShader(!1,s.repeat,o),t?n.setBitmapShapeUniform(a.uniform,!1,0,0,0,o,h,V(this._$matrix),this._$viewportWidth,this._$viewportHeight,this._$grid,r.width,r.height,t[0],t[1],t[2],this._$globalAlpha,t[4]/255,t[5]/255,t[6]/255,0):n.setBitmapShapeUniform(a.uniform,!1,0,0,0,o,h,V(this._$matrix),this._$viewportWidth,this._$viewportHeight,this._$grid,r.width,r.height,1,1,1,this._$globalAlpha,0,0,0,0)}else n=this._$shaderList.shapeShaderVariants,a=n.getSolidColorShapeShader(!1,this._$grid.enabled),n.setSolidColorShapeUniform(a.uniform,!1,0,0,0,o,h,this._$viewportWidth,this._$viewportHeight,this._$grid,s,this._$globalAlpha);const _=this._$shaderList.shapeShaderVariants,l=_.getMaskShapeShader(!1,o);_.setMaskShapeUniform(l.uniform,o,h[0],h[1],h[2],h[3],h[4],h[5],h[6],h[7],h[8],this._$viewportWidth,this._$viewportHeight,this._$grid),this._$gl.enable(this._$gl.STENCIL_TEST),this._$gl.stencilMask(255),this._$gl.enable(this._$gl.SAMPLE_ALPHA_TO_COVERAGE),this._$gl.stencilFunc(this._$gl.ALWAYS,0,255),this._$gl.stencilOp(this._$gl.KEEP,this._$gl.INVERT,this._$gl.INVERT),this._$gl.colorMask(!1,!1,!1,!1),l._$fill(i),this._$gl.disable(this._$gl.SAMPLE_ALPHA_TO_COVERAGE),this._$gl.stencilFunc(this._$gl.NOTEQUAL,0,255),this._$gl.stencilOp(this._$gl.KEEP,this._$gl.ZERO,this._$gl.ZERO),this._$gl.colorMask(!0,!0,!0,!0),a._$fill(i),this._$gl.disable(this._$gl.STENCIL_TEST),this.releaseFillVertexArray(i)}releaseFillVertexArray(t){this._$vao.releaseFill(t);const e=t.indexRanges;for(let t=0;t<e.length;++t)Qt.indexRangePool.push(e[t]);O(e)}_$enterClip(){this._$mask._$enterClip()}_$beginClipDef(){this._$mask._$beginClipDef()}_$updateContainerClipFlag(t){this._$mask.containerClip=t}_$startClip(t){const e=t.xMin,i=t.yMin,s=Math.abs(t.xMax-t.xMin),n=Math.abs(t.yMax-t.yMin),a=this._$frameBufferManager.currentAttachment;if(!a)throw new Error(\"the current Attachment is null.\");return!(e>a.width||i>a.height||0>e&&0>=s+e||0>i&&0>=n+i||(this._$maskBounds.xMin=r.max(0,r.min(this._$maskBounds.xMin,e)),this._$maskBounds.yMin=r.max(0,r.min(this._$maskBounds.yMin,i)),this._$maskBounds.xMax=r.min(a.width,r.min(this._$maskBounds.xMax,s)),this._$maskBounds.yMax=r.min(a.height,r.min(this._$maskBounds.yMax,n)),0))}_$endClipDef(){this._$mask._$endClipDef()}_$leaveClip(){this.drawInstacedArray(),this._$mask._$leaveClip()}_$drawContainerClip(){this._$mask._$drawContainerClip()}closePath(){this._$path.close()}stroke(){const t=this._$path.vertices;if(!t.length)return;const e=L();for(let i=0;i<t.length;++i){const s=t[i];6>s.length||e.push(s)}if(!e.length)return void O(e);const i=this._$vao.createStroke(t,this.lineCap,this.lineJoin);let s=this._$matrix;const n=this.strokeStyle;let a=r.sign(s[0]*s[4]);a>0&&0!==s[1]&&0!==s[3]&&(a=-r.sign(s[1]*s[3]));let h,o,_=.5*this.lineWidth;this._$grid.enabled?(h=r.abs(this._$grid.ancestorMatrixA+this._$grid.ancestorMatrixD),o=r.abs(this._$grid.ancestorMatrixB+this._$grid.ancestorMatrixE)):(h=r.abs(s[0]+s[3]),o=r.abs(s[1]+s[4]));const l=r.min(h,o),c=r.max(h,o);_*=c*(1-.3*r.cos(.5*r.PI*(l/c))),_=r.max(1,_);const $=this._$grid.enabled;let u,d,g;if(n instanceof gt){\"radial\"===n.type&&(s=this._$stack[this._$stack.length-1]);const t=n.stops,e=\"linearRGB\"===n.rgb;if(u=this._$gradientLUT.generateForShape(t,e),this._$frameBufferManager.textureManager.bind0(u,!0),d=this._$shaderList.gradientShapeShaderVariants,\"linear\"===n.type)g=d.getGradientShapeShader(!0,$,!1,!1,n.mode),d.setGradientShapeUniform(g.uniform,!0,_,a,this.miterLimit,$,s,V(this._$matrix),this._$viewportWidth,this._$viewportHeight,this._$grid,!1,n.points,0);else{s=this._$stack[this._$stack.length-1];const t=0!==n.focalPointRatio;g=d.getGradientShapeShader(!0,$,!0,t,n.mode),d.setGradientShapeUniform(g.uniform,!0,_,a,this.miterLimit,$,s,V(this._$matrix),this._$viewportWidth,this._$viewportHeight,this._$grid,!0,n.points,n.focalPointRatio)}}else if(n instanceof ft){s=this._$stack[this._$stack.length-1];const t=n.colorTransform;u=n.texture,this._$frameBufferManager.textureManager.bind0(u),d=this._$shaderList.shapeShaderVariants,g=d.getBitmapShapeShader(!0,n.repeat,this._$grid.enabled),t?d.setBitmapShapeUniform(g.uniform,!0,_,a,this.miterLimit,$,s,V(this._$matrix),this._$viewportWidth,this._$viewportHeight,this._$grid,u.width,u.height,t[0],t[1],t[2],this._$globalAlpha,t[4]/255,t[5]/255,t[6]/255,0):d.setBitmapShapeUniform(g.uniform,!0,_,a,this.miterLimit,$,s,V(this._$matrix),this._$viewportWidth,this._$viewportHeight,this._$grid,u.width,u.height,1,1,1,this._$globalAlpha,0,0,0,0)}else d=this._$shaderList.shapeShaderVariants,g=d.getSolidColorShapeShader(!0,this._$grid.enabled),d.setSolidColorShapeUniform(g.uniform,!0,_,a,this.miterLimit,$,s,this._$viewportWidth,this._$viewportHeight,this._$grid,n,this._$globalAlpha);g._$stroke(i),this._$vao.releaseStroke(i)}arc(t,e,i){this._$path.drawCircle(t,e,i)}clip(){const t=this._$path.vertices;if(!t.length)return;const e=L();for(let i=0;i<t.length;++i){const s=t[i];10>s.length||e.push(s)}if(!e.length)return void O(e);const i=this._$vao.createFill(e),s=this._$shaderList.shapeShaderVariants,r=s.getMaskShapeShader(!1,!1),n=r.uniform;s.setMaskShapeUniform(n,!1,this._$matrix[0],this._$matrix[1],this._$matrix[2],this._$matrix[3],this._$matrix[4],this._$matrix[5],this._$matrix[6],this._$matrix[7],this._$matrix[8],this._$viewportWidth,this._$viewportHeight,null),this._$mask._$onClip(i,this._$matrix,this._$viewportWidth,this._$viewportHeight)||(r._$fill(i),this.beginPath())}save(){const t=this._$matrix;this._$stack.push(k(t[0],t[1],t[2],t[3],t[4],t[5],t[6],t[7],t[8])),this._$mask._$onSave()}restore(){var t;this._$stack.length&&(t=this._$matrix,A.push(t),this._$matrix=this._$stack.pop()||k()),this._$mask._$onRestore()}createPattern(t,e,i){return new ft(this,t,e,i)}createLinearGradient(t,e,i,s,r=\"rgb\",n=\"pad\"){return(new gt).linear(t,e,i,s,r,n)}createRadialGradient(t,e,i,s,r,n,a=\"rgb\",h=\"pad\",o=0){return(new gt).radial(t,e,i,s,r,n,a,h,o)}_$applyBlurFilter(t,e,i){const s=this._$frameBufferManager,n=s.currentAttachment;if(!n)throw new Error(\"the current attachment is null.\");const a=n.width,h=n.height;s.textureManager.bind0(t,!0);const o=r.ceil(.5*i),_=1-(o-.5*i),l=1+i,c=this._$shaderList.filterShaderVariants,$=c.getBlurFilterShader(o);c.setBlurFilterUniform($.uniform,a,h,e,_,l),$._$drawImage()}_$applyBitmapFilter(t,e,i,s,r,n,a,h,o,_,l,c,$,u,d,g=null,f=null,m=null,p=0,x=0,b=0,v=0,T=0,A=0,M=0,y=0){const E=this._$frameBufferManager,C=\"inner\"===$,S=E.currentAttachment,F=E.getTextureFromCurrentAttachment();let B=null;const w=null!==g&&null!==f&&null!==m;let R;null!==g&&null!==f&&null!==m&&(B=this._$gradientLUT.generateForFilter(g,f,m)),C?w&&B?E.textureManager.bind02(t,B,!0):E.textureManager.bind0(t):(R=this._$frameBufferManager.createTextureAttachment(e,i),this._$bind(R),w&&B?E.textureManager.bind012(t,F,B,!0):E.textureManager.bind01(t,F));const I=!(C||\"full\"===$&&u),P=!(e===h&&i===o&&0===_&&0===l),N=!(1===d),k=this._$shaderList.filterShaderVariants,L=k.getBitmapFilterShader(I,P,c,$,u,N,w);k.setBitmapFilterUniform(L.uniform,e,i,s,r,n,a,h,o,_,l,c,d,p,x,b,v,T,A,M,y,I,P,N,w),C?u?this.blend.toSourceIn():this.blend.toSourceAtop():this.blend.toOneZero(),L._$drawImage(),C||E.releaseAttachment(S,!0)}_$applyColorMatrixFilter(t,e){this._$frameBufferManager.textureManager.bind0(t,!0);const i=this._$shaderList.filterShaderVariants,s=i.getColorMatrixFilterShader();i.setColorMatrixFilterUniform(s.uniform,e),this.blend.reset(),s._$drawImage()}_$applyConvolutionFilter(t,e,i,s,r,n,a,h,o,_,l,c){const $=t.width,u=t.height,d=this._$frameBufferManager.createTextureAttachment($,u);this._$bind(d),this._$frameBufferManager.textureManager.bind0(t,!0);const g=this._$shaderList.filterShaderVariants,f=g.getConvolutionFilterShader(e,i,a,h);g.setConvolutionFilterUniform(f.uniform,$,u,s,r,n,h,o,_,l,c),this.blend.reset(),f._$drawImage()}_$applyDisplacementMapFilter(t,e,i,s,r,n,a,h,o,_,l,c,$,u){const d=t.width,g=t.height,f=this._$frameBufferManager.createTextureAttachment(d,g);this._$bind(f),r||(r={x:0,y:0});const m=this._$frameBufferManager.createTextureFromImage(e);this._$frameBufferManager.textureManager.bind01(t,m);const p=this._$shaderList.filterShaderVariants,x=p.getDisplacementMapFilterShader(n,a,_);p.setDisplacementMapFilterUniform(x.uniform,e.width,e.height,i,s,r.x,r.y,h,o,_,l,c,$,u),this.blend.reset(),x._$drawImage(),this._$frameBufferManager.releaseTexture(m)}_$startLayer(t){this._$positions.push(t),this._$blends.push(this._$isLayer),this._$isLayer=!0}_$endLayer(){const t=this._$positions.pop();t&&F(t),this._$isLayer=!!this._$blends.pop()}_$saveAttachment(t,e,i=!1){this.drawInstacedArray();const s=this._$frameBufferManager;this._$attachmentArray.push(s.currentAttachment),this._$bind(s.createCacheAttachment(t,e,i))}_$restoreAttachment(t=!1){const e=this._$frameBufferManager;e.releaseAttachment(e.currentAttachment,t),this._$bind(this._$attachmentArray.pop())}getCurrentPosition(){return this._$positions[this._$positions.length-1]}textureScale(t,e){const i=r.max(t,e);return i>this._$maxTextureSize?this._$maxTextureSize/i:1}}class se extends ut{_$clip(t,e){let i=e;const n=this._$matrix;1===n[0]&&0===n[1]&&0===n[2]&&1===n[3]&&0===n[4]&&0===n[5]||(i=z(e,n));const a=this._$getBounds(),h=H(a,i);F(a);const o=r.ceil(r.abs(h.xMax-h.xMin)),_=r.ceil(r.abs(h.yMax-h.yMin));switch(F(h),!0){case 0===o:case 0===_:case o===-1/0:case _===-1/0:case o===s:case _===s:return}super._$clip(t,i),i!==e&&I(i)}_$draw(t,e,i){if(!this._$visible||!this._$maxAlpha||!this._$canDraw)return;let s=i;const r=this._$colorTransform;if(1===r[0]&&1===r[1]&&1===r[2]&&1===r[3]&&0===r[4]&&0===r[5]&&0===r[6]&&0===r[7]||(s=G(i,r)),!Y(s[3]+s[7]/255,0,1,0))return void(s!==i&&N(s));let n=e;const a=this._$matrix;1===a[0]&&0===a[1]&&0===a[2]&&1===a[3]&&0===a[4]&&0===a[5]||(n=z(e,a)),super._$draw(t,n,s,this._$blendMode,this._$filters),n!==e&&I(n),s!==i&&N(s)}_$remove(){this._$xMin=0,this._$yMin=0,this._$xMax=0,this._$yMax=0,this._$recodes=null,super._$remove(),oe.push(this)}}class re extends $t{constructor(){super(),this._$background=!1,this._$backgroundColor=16777215,this._$border=!1,this._$borderColor=0,this._$wordWrap=!1,this._$textData=L(),this._$textAreaActive=!1,this._$thickness=0,this._$thicknessColor=0,this._$limitWidth=0,this._$limitHeight=0,this._$autoSize=\"none\",this._$widthTable=L(),this._$heightTable=L(),this._$objectTable=L(),this._$textHeightTable=L(),this._$xMin=0,this._$yMin=0,this._$xMax=0,this._$yMax=0,this._$maxScrollV=null,this._$scrollV=1,this._$textHeight=0,this._$verticalAlign=\"top\",this._$cacheKeys=L(),this._$cacheParams=L(0,0,0)}get width(){const t=H(this._$getBounds(null),this._$matrix),e=r.abs(t.xMax-t.xMin);switch(F(t),!0){case 0===e:case e===s:case e===-1/0:return 0;default:return e}}get height(){const t=H(this._$getBounds(null),this._$matrix),e=r.abs(t.yMax-t.yMin);switch(F(t),e){case 0:case s:case-1/0:return 0;default:return e}}get maxScrollV(){if(null===this._$maxScrollV){this._$maxScrollV=1;const t=this._$textHeightTable.length,e=this.height;if(e>this._$textHeight)return this._$maxScrollV;let i=0,s=0;for(;t>s&&(i+=this._$textHeightTable[s++],!(i>e));)this._$maxScrollV++}return this._$maxScrollV}_$clip(t,e){const i=this._$getBounds(),s=i.xMax,n=i.xMin,a=i.yMax,h=i.yMin;F(i);const o=r.ceil(r.abs(s-n)),_=r.ceil(r.abs(a-h));if(!o||!_)return;let l=e;const c=this._$matrix;1===c[0]&&0===c[1]&&0===c[2]&&1===c[3]&&0===c[4]&&0===c[5]||(l=z(e,c)),t.reset(),t.setTransform(e[0],e[1],e[2],e[3],e[4],e[5]),t.beginPath(),t.moveTo(0,0),t.lineTo(o,0),t.lineTo(o,_),t.lineTo(0,_),t.lineTo(0,0),t.clip(),l!==e&&I(l)}_$draw(t,e,i){if(!this._$visible||this._$textAreaActive)return;if(!this._$background&&!this._$border&&2>this._$textData.length)return;let n=i;const a=this._$colorTransform;1===a[0]&&1===a[1]&&1===a[2]&&1===a[3]&&0===a[4]&&0===a[5]&&0===a[6]&&0===a[7]||(n=G(i,a));const o=Y(n[3]+n[7]/255,0,1);if(!o)return;let _=e;const l=this._$matrix;1===l[0]&&0===l[1]&&0===l[2]&&1===l[3]&&0===l[4]&&0===l[5]||(_=z(e,l));const c=this._$getBounds(null);c.xMin-=this._$thickness,c.xMax+=this._$thickness,c.yMin-=this._$thickness,c.yMax+=this._$thickness;const $=H(c,_),u=+$.xMax,d=+$.xMin,g=+$.yMax,f=+$.yMin;F($);const m=r.ceil(r.abs(u-d)),p=r.ceil(r.abs(g-f));switch(!0){case 0===m:case 0===p:case m===-1/0:case p===-1/0:case m===s:case p===s:return}let x=+r.sqrt(_[0]*_[0]+_[1]*_[1]);if(!h.isInteger(x)){const t=x.toString(),e=t.indexOf(\"e\");-1!==e&&(x=+t.slice(0,e)),x=+x.toFixed(4)}let b=+r.sqrt(_[2]*_[2]+_[3]*_[3]);if(!h.isInteger(b)){const t=b.toString(),e=t.indexOf(\"e\");-1!==e&&(b=+t.slice(0,e)),b=+b.toFixed(4)}const v=this._$filters,T=null!==v&&v.length>0&&this._$canApply(v);let A=S(0,m,0,p);if(T&&v)for(let t=0;t<v.length;++t)A=v[t]._$generateFilterRect(A,x,b);const M=t.frameBuffer,y=M.currentAttachment;if(!y||d-A.xMin>y.width||f-A.yMin>y.height)return void F(A);if(0>d+A.xMax||0>f+A.yMax)return void F(A);if(F(A),this._$isUpdated()&&(et.removeCache(this._$instanceId),t.cachePosition=null,this._$cacheKeys.length=0),!this._$cacheKeys.length||this._$cacheParams[0]!==x||this._$cacheParams[1]!==b||this._$cacheParams[2]!==i[7]){const t=L(x,b);this._$cacheKeys=et.generateKeys(this._$instanceId,t),O(t),this._$cacheParams[0]=x,this._$cacheParams[1]=b,this._$cacheParams[2]=i[7]}if(t.cachePosition=et.get(this._$cacheKeys),!t.cachePosition){const s=r.min(1,r.max(x,b)),a=r.ceil(r.abs(c.xMax-c.xMin)*x),h=r.ceil(r.abs(c.yMax-c.yMin)*b);n[3]=1;const o=new OffscreenCanvas(a+2*s,h+2*s).getContext(\"2d\");if(!o)return;if(this._$background||this._$border){if(o.beginPath(),o.moveTo(0,0),o.lineTo(a,0),o.lineTo(a,h),o.lineTo(0,h),o.lineTo(0,0),this._$background){const t=Q(this._$backgroundColor),e=r.max(0,r.min(255*t.A*i[3]+i[7],255))/255;o.fillStyle=`rgba(${t.R},${t.G},${t.B},${e})`,o.fill()}if(this._$border){const t=Q(this._$borderColor),e=r.max(0,r.min(255*t.A*i[3]+i[7],255))/255;o.lineWidth=s,o.strokeStyle=`rgba(${t.R},${t.G},${t.B},${e})`,o.stroke()}}o.save(),o.beginPath(),o.moveTo(2,2),o.lineTo(a-2,2),o.lineTo(a-2,h-2),o.lineTo(2,h-2),o.lineTo(2,2),o.clip(),o.beginPath(),o.setTransform(x,0,0,b,0,0),this._$doDraw(o,e,i,a/x),o.restore();const _=M.createCachePosition(m,p),l=M.createTextureFromCanvas(o.canvas);t.drawTextureFromRect(l,_),t.cachePosition=_,et.set(this._$cacheKeys,_)}let E=!1,C=0,B=0;if(v&&v.length&&this._$canApply(v)){E=!0;const e=this._$drawFilter(t,_,v,m,p);e.offsetX&&(C=e.offsetX),e.offsetY&&(B=e.offsetY),t.cachePosition=e}const w=r.atan2(_[1],_[0]),R=r.atan2(-_[2],_[3]);if(E||!w&&!R)t.setTransform(1,0,0,1,d-C,f-B);else{const e=c.xMin*x,i=c.yMin*b,s=r.cos(w),n=r.sin(w),a=r.cos(R),h=r.sin(R);t.setTransform(s,n,-h,a,e*s-i*h+_[4],e*n+i*a+_[5])}t.cachePosition&&(t.globalAlpha=o,t.imageSmoothingEnabled=!0,t.globalCompositeOperation=this._$blendMode,t.drawInstance(d-C,f-B,u,g,i),t.cachePosition=null),F(c),_!==e&&I(_),n!==i&&N(n)}_$doDraw(t,e,i,s){const n=this.width,a=this.height;let h=0,o=0,_=0,l=0;if(\"top\"!==this._$verticalAlign&&this.height>this._$textHeight)switch(this._$verticalAlign){case\"middle\":l=(this.height-this._$textHeight+2)/2;break;case\"bottom\":l=this.height-this._$textHeight+2}const c=this._$textData.length;for(let $=0;$<c;++$){const c=this._$textData[$];if(0===c.width)continue;const u=h+c.x;if(\"none\"===this._$autoSize&&(o>a||u>n))continue;const d=c.textFormat,g=Q(c.textFormat._$color),f=r.max(0,r.min(255*g.A*i[3]+i[7],255))/255;if(t.fillStyle=`rgba(${g.R},${g.G},${g.B},${f})`,this._$thickness){const e=Q(this._$thicknessColor),s=r.max(0,r.min(255*e.A*i[3]+i[7],255))/255;t.lineWidth=this._$thickness,t.strokeStyle=`rgba(${e.R},${e.G},${e.B},${s})`}const m=c.yIndex;switch(c.mode){case\"break\":case\"wrap\":if(_++,this._$scrollV>_)continue;if(o+=this._$textHeightTable[m],h=this._$getAlignOffset(this._$objectTable[m],s),d._$underline){const s=c.textFormat._$size/12,n=Q(d._$color),a=r.max(0,r.min(255*n.A*i[3]+i[7],255))/255;t.lineWidth=r.max(1,1/r.min(e[0],e[3])),t.strokeStyle=`rgba(${n.R},${n.G},${n.B},${a})`,t.beginPath(),t.moveTo(h,l+o-s),t.lineTo(h+this._$widthTable[m],l+o-s),t.stroke()}break;case\"text\":{if(this._$scrollV>_)continue;let e=o-this._$heightTable[0];ae||(e+=c.textFormat._$size/12*2),t.beginPath(),t.textBaseline=\"top\",t.font=J(d._$font,d._$size,d._$italic,d._$bold),this._$thickness&&t.strokeText(c.text,u,l+e),t.fillText(c.text,u,l+e)}break;case\"image\":if(!c.loaded)continue;t.beginPath(),t.drawImage(c.image,c.hspace,l+c.y,c.width,c.height)}}}_$getAlignOffset(t,e){const i=this._$widthTable[t.yIndex],s=t.textFormat,n=s._$blockIndent+s._$leftMargin>0?s._$blockIndent+s._$leftMargin:0;switch(!0){case!this._$wordWrap&&i>e:return r.max(0,n);case\"center\"===s._$align:case\"center\"===this._$autoSize:return r.max(0,e/2-n-s._$rightMargin-i/2);case\"right\"===s._$align:case\"right\"===this._$autoSize:return r.max(0,e-n-i-s._$rightMargin-2);default:return r.max(0,n+2)}}_$remove(){this._$xMin=0,this._$yMin=0,this._$xMax=0,this._$yMax=0,this._$textData.length=0,this._$widthTable.length=0,this._$heightTable.length=0,this._$objectTable.length=0,this._$textHeightTable.length=0,this._$textAreaActive=!1,super._$remove(),_e.push(this)}_$updateProperty(t){this._$textAreaActive=!!t.textAreaActive,this._$textData.length=0,this._$widthTable.length=0,this._$heightTable.length=0,this._$objectTable.length=0,this._$textHeightTable.length=0,this._$textData.push(...t.textData),this._$widthTable.push(...t.widthTable),this._$heightTable.push(...t.heightTable),this._$objectTable.push(...t.objectTable),this._$textHeightTable.push(...t.textHeightTable),this._$wordWrap=t.wordWrap,this._$limitWidth=t.limitWidth,this._$limitHeight=t.limitHeight,this._$autoSize=t.autoSize,this._$scrollV=t.scrollV,this._$textHeight=t.textHeight,this._$verticalAlign=t.verticalAlign,this._$border=t.border,this._$border&&(this._$borderColor=t.borderColor),this._$background=t.background,this._$background&&(this._$backgroundColor=t.backgroundColor),\"thickness\"in t&&(this._$thickness=t.thickness,this._$thicknessColor=t.thicknessColor)}_$update(t){super._$update(t),this._$textAreaActive=!!t.textAreaActive,this._$xMin=t.xMin,this._$yMin=t.yMin,this._$xMax=t.xMax,this._$yMax=t.yMax,t.textData&&this._$updateProperty(t)}}class ne extends $t{constructor(){super(),this._$imageBitmap=null,this._$context=null,this._$smoothing=!0,this._$cacheKeys=L(),this._$cacheParams=L(0,0,0)}_$clip(t,e){const i=this._$xMax,s=this._$yMax;if(!i||!s)return;let r=e;const n=this._$matrix;1===n[0]&&0===n[1]&&0===n[2]&&1===n[3]&&0===n[4]&&0===n[5]||(r=z(e,n)),t.reset(),t.setTransform(r[0],r[1],r[2],r[3],r[4],r[5]),t.beginPath(),t.moveTo(0,0),t.lineTo(i,0),t.lineTo(i,s),t.lineTo(0,s),t.lineTo(0,0),t.clip(),r!==e&&I(r)}_$draw(t,e,i){if(!this._$visible||!this._$imageBitmap||!this._$context)return;let n=i;const a=this._$colorTransform;1===a[0]&&1===a[1]&&1===a[2]&&1===a[3]&&0===a[4]&&0===a[5]&&0===a[6]&&0===a[7]||(n=G(i,a));const o=Y(n[3]+n[7]/255,0,1,0);if(!o)return void(n!==i&&N(n));let _=e;const l=this._$matrix;1===l[0]&&0===l[1]&&0===l[2]&&1===l[3]&&0===l[4]&&0===l[5]||(_=z(e,l));const c=this._$getBounds();F(c);const $=H(c,_),u=+$.xMax,d=+$.xMin,g=+$.yMax,f=+$.yMin;F($);const m=r.ceil(r.abs(u-d)),p=r.ceil(r.abs(g-f));switch(!0){case 0===m:case 0===p:case m===-1/0:case p===-1/0:case m===s:case p===s:return}let x=+r.sqrt(_[0]*_[0]+_[1]*_[1]);if(!h.isInteger(x)){const t=x.toString(),e=t.indexOf(\"e\");-1!==e&&(x=+t.slice(0,e)),x=+x.toFixed(4)}let b=+r.sqrt(_[2]*_[2]+_[3]*_[3]);if(!h.isInteger(b)){const t=b.toString(),e=t.indexOf(\"e\");-1!==e&&(b=+t.slice(0,e)),b=+b.toFixed(4)}const v=this._$filters,T=null!==v&&v.length>0&&this._$canApply(v);let A=S(0,m,0,p);if(T&&v)for(let t=0;t<v.length;++t)A=v[t]._$generateFilterRect(A,x,b);const M=t.frameBuffer,y=M.currentAttachment;if(!y||d-A.xMin>y.width||f-A.yMin>y.height)return void F(A);if(0>d+A.xMax||0>f+A.yMax)return void F(A);if(F(A),!this._$cacheKeys.length||this._$cacheParams[0]!==x||this._$cacheParams[1]!==b||this._$cacheParams[2]!==i[7]){const t=L();t[0]=x,t[1]=b,this._$cacheKeys=et.generateKeys(this._$instanceId,t,i),O(t),this._$cacheParams[0]=x,this._$cacheParams[1]=b,this._$cacheParams[2]=i[7]}if(t.cachePosition=et.get(this._$cacheKeys),!t.cachePosition){const e=r.ceil(r.abs(this._$xMax-this._$xMin)),i=r.ceil(r.abs(this._$yMax-this._$yMin)),s=M.createCachePosition(e,i);t.cachePosition=s,et.set(this._$cacheKeys,s)}this._$context.drawImage(this._$imageBitmap,0,0);const E=M.textureManager._$createFromElement(this._$imageBitmap.width,this._$imageBitmap.height,this._$context.canvas,this._$smoothing);let C=0,B=0;if(T&&v){const e=M.currentAttachment,i=M.createCacheAttachment(m,p);t._$bind(i),t.reset();const s=R(x,0,0,b,m/2,p/2),r=R(1,0,0,1,-E.width/2,-E.height/2),n=z(s,r);I(s),I(r),t.setTransform(n[0],n[1],n[2],n[3],n[4],n[5]),t.drawImage(E,0,0,E.width,E.height);const a=M.getTextureFromCurrentAttachment();t._$bind(e),M.releaseAttachment(i),t.drawTextureFromRect(E,t.cachePosition);const h=this._$drawFilter(t,_,v,m,p,a);h.offsetX&&(C=h.offsetX),h.offsetY&&(B=h.offsetY),t.cachePosition=h,t.setTransform(1,0,0,1,d-C,f-B)}else t.drawTextureFromRect(E,t.cachePosition),t.setTransform(_[0],_[1],_[2],_[3],_[4],_[5]);t.cachePosition&&(t.globalAlpha=o,t.imageSmoothingEnabled=!0,t.globalCompositeOperation=this._$blendMode,t.drawInstance(d-C,f-B,u,g,i),t.cachePosition=null),_!==e&&I(_),n!==i&&N(n)}_$remove(){this._$xMin=0,this._$yMin=0,this._$xMax=0,this._$yMax=0,this._$context=null,this._$imageBitmap=null,this._$smoothing=!0,super._$remove(),ce.push(this)}_$updateProperty(t){if(this._$xMin=t.xMin,this._$yMin=t.yMin,this._$xMax=t.xMax,this._$yMax=t.yMax,this._$imageBitmap=t.imageBitmap,this._$smoothing=t.smoothing,!this._$context&&this._$imageBitmap){const t=new c(this._$imageBitmap.width,this._$imageBitmap.height);this._$context=t.getContext(\"2d\")}}_$update(t){super._$update(t),this._$updateProperty(t)}}let ae=!1;const he=new class{constructor(){this._$instances=new Map,this._$matrix=R(1,0,0,1,0,0),this._$width=0,this._$height=0,this._$stage=new dt,this._$canvas=null,this._$context=null,this._$attachment=null}get instances(){return this._$instances}get context(){return this._$context}get scaleX(){return this._$matrix[0]}stop(){et.reset()}_$initialize(e,i){let s=0;var r,n;this._$setStage(e[s++]),n=1===e[s++],ae=n,r=e[s++],t=r,this._$canvas=i;const a=i.getContext(\"webgl2\",{stencil:!0,premultipliedAlpha:!0,antialias:!1,depth:!1,preserveDrawingBuffer:!0});if(a){const t=new ie(a,e[s++]);this._$context=t,et.context=t}}_$setBackgroundColor(t){if(!this._$context)return;const e=t[0];if(-1===e)this._$context._$setColor(0,0,0,0);else{const t={A:(i=e)>>>24,R:(16711680&i)>>16,G:(65280&i)>>8,B:255&i};this._$context._$setColor(t.R/255,t.G/255,t.B/255,1)}var i}_$bitmapDraw(t,e,i,s){const r=this._$context;if(!r)return;r._$bind(this._$attachment),r.reset(),r.setTransform(1,0,0,1,0,0),r.clearRect(0,0,this._$width,this._$height),r.beginPath(),t._$draw(r,e,i),r.frameBuffer.transferToMainTexture();const n=s.getContext(\"2d\");n&&this._$canvas&&n.drawImage(this._$canvas,0,0)}_$draw(){if(!this._$width||!this._$height)return;const t=this._$context;t&&(t.reset(),t.setTransform(1,0,0,1,0,0),t.clearRect(0,0,this._$width,this._$height),t.beginPath(),this._$stage._$draw(t,this._$matrix,m),this._$stage._$updated=!1,t.drawInstacedArray(),t.frameBuffer.transferToMainTexture())}_$resize(t){let e=0;const i=t[e++],s=t[e++];if(this._$width=i,this._$height=s,!this._$canvas)return;if(this._$canvas.width===i&&this._$canvas.height===s)return;const r=this._$context;if(!r)return;const n=t[e++];this._$matrix[0]=n,this._$matrix[3]=n,this._$matrix[4]=t[e++],this._$matrix[5]=t[e++],this._$stage._$updated=!0,et.reset(),r.clearInstacedArray(),this._$canvas.width=i,this._$canvas.height=s,r._$gl.viewport(0,0,i,s);const a=r.frameBuffer;this._$attachment&&(a.unbind(),a.releaseAttachment(this._$attachment,!0)),this._$attachment=a.createCacheAttachment(i,s,!0),r.setMaxSize(i,s),r._$bind(this._$attachment)}_$setStage(t){this._$stage._$instanceId=t,this._$instances.set(t,this._$stage)}_$updateStage(){this._$stage._$updated=!0}_$createDisplayObjectContainer(t,e=null){const i=$e();let s=0;i._$instanceId=t[s++],i._$parentId=t[s++],e&&(i._$recodes=e,i._$maxAlpha=t[s++],i._$canDraw=1===t[s++],i._$xMin=t[s++],i._$yMin=t[s++],i._$xMax=t[s++],i._$yMax=t[s++]),this._$instances.set(i._$instanceId,i)}_$registerShapeRecodes(t,e){this._$instances.has(t)||this._$instances.set(t,ge()),this._$instances.get(t)._$recodes=e}_$createShape(t){let e=0;const i=t[e++];this._$instances.has(i)||this._$instances.set(i,ge());const s=this._$instances.get(i);var r;s._$instanceId=i,s._$parentId=t[e++],s._$maxAlpha=t[e++],s._$canDraw=1===t[e++],s._$xMin=t[e++],s._$yMin=t[e++],s._$xMax=t[e++],s._$yMax=t[e++],s._$characterId=t[e++],s._$loaderInfoId=t[e++],t[e++]&&(s._$visible=1===t[e++],s._$depth=t[e++],s._$clipDepth=t[e++],s._$isMask=1===t[e++],1===t[e++]?(s._$maskId=t[e++],s._$maskMatrix||(s._$maskMatrix=R()),s._$maskMatrix[0]=t[e++],s._$maskMatrix[1]=t[e++],s._$maskMatrix[2]=t[e++],s._$maskMatrix[3]=t[e++],s._$maskMatrix[4]=t[e++],s._$maskMatrix[5]=t[e++]):(s._$maskId=-1,s._$maskMatrix&&(I(s._$maskMatrix),s._$maskMatrix=null),e+=7),s._$visible?(s._$matrix[0]=t[e++],s._$matrix[1]=t[e++],s._$matrix[2]=t[e++],s._$matrix[3]=t[e++],s._$matrix[4]=t[e++],s._$matrix[5]=t[e++],s._$colorTransform[0]=t[e++],s._$colorTransform[1]=t[e++],s._$colorTransform[2]=t[e++],s._$colorTransform[3]=t[e++],s._$colorTransform[4]=t[e++],s._$colorTransform[5]=t[e++],s._$colorTransform[6]=t[e++],s._$colorTransform[7]=t[e++]):(e+=6,e+=8),s._$blendMode=(r=t[e++],tt.has(r)&&tt.get(r)||\"normal\"),t[e++]?s._$scale9Grid={x:t[e++],y:t[e++],w:t[e++],h:t[e++]}:s._$scale9Grid=null)}_$createVideo(t){const e=de();t.characterId&&(e._$characterId=t.characterId),\"loaderInfoId\"in t&&(e._$loaderInfoId=t.loaderInfoId||0),e._$updateProperty(t),this._$instances.set(e._$instanceId,e)}_$createTextField(t){const e=ue();e._$xMin=t.xMin||0,e._$yMin=t.yMin||0,e._$xMax=t.xMax||0,e._$yMax=t.yMax||0,t.characterId&&(e._$characterId=t.characterId),\"loaderInfoId\"in t&&(e._$loaderInfoId=t.loaderInfoId||0),e._$updateProperty(t),this._$instances.set(e._$instanceId,e)}},oe=[],_e=[],le=[],ce=[],$e=()=>le.pop()||new dt,ue=()=>_e.pop()||new re,de=()=>ce.pop()||new ne,ge=()=>oe.pop()||new se;const fe=new class{constructor(){this.state=\"deactivate\",this.queue=[],this._$options=[]}execute(){this.state=\"active\";let t=!0;for(;this.queue.length;){const e=this.queue.shift();if(console.log(e),e){switch(t=!0,e.command){case\"draw\":he._$draw();break;case\"setProperty\":{const t=he.instances;if(!t.has(e.instanceId))continue;t.get(e.instanceId)._$update(e)}break;case\"setChildren\":{t=!1;const i=e.buffer,s=he.instances;if(!s.has(i[0]))continue;const r=s.get(i[0]);r._$doChanged(),r._$children=i.subarray(1),console.log(r)}break;case\"remove\":{const t=he.instances;if(!t.has(e.instanceId))continue;t.get(e.instanceId)._$remove(),t.delete(e.instanceId)}break;case\"createShape\":he._$createShape(e.buffer);break;case\"createDisplayObjectContainer\":he._$createDisplayObjectContainer(e.buffer,e.recodes);break;case\"createTextField\":he._$createTextField(e);break;case\"createVideo\":he._$createVideo(e);break;case\"resize\":he._$resize(e.buffer);break;case\"initialize\":he._$initialize(e.buffer,e.canvas);break;case\"setBackgroundColor\":he._$setBackgroundColor(e.buffer);break;case\"stop\":he.stop();break;case\"removeCache\":et.removeCache(e.id);break;case\"bitmapDraw\":{const t=he.instances;if(!t.has(e.sourceId))continue;const i=t.get(e.sourceId),s=new c(e.width,e.height);he._$bitmapDraw(i,e.matrix||f,e.colorTransform||m,s);const r=s.transferToImageBitmap();globalThis.postMessage({command:\"bitmapDraw\",sourceId:e.sourceId,imageBitmap:r},[r])}break;default:if(e.command.indexOf(\"shapeRecodes\")>-1){t=!1;const i=+e.command.split(\"@\")[1];he._$registerShapeRecodes(i,e.buffer)}}e.buffer&&t&&(this._$options.length=0)}}this.state=\"deactivate\"}};self.addEventListener(\"message\",(t=>{return e=void 0,i=void 0,r=function*(){fe.queue.push(t.data),\"deactivate\"===fe.state&&fe.execute()},new((s=void 0)||(s=Promise))((function(t,n){function a(t){try{o(r.next(t))}catch(t){n(t)}}function h(t){try{o(r.throw(t))}catch(t){n(t)}}function o(e){var i;e.done?t(e.value):(i=e.value,i instanceof s?i:new s((function(t){t(i)}))).then(a,h)}o((r=r.apply(e,i||[])).next())}));var e,i,s,r}))})();";

/**
 * @method
 * @public
 */
export const $initialize = (): Promise<void> =>
{
    $document.body.appendChild($DIV);

    if ("OffscreenCanvas" in window) {

        const offscreen: OffscreenCanvas = new OffscreenCanvas(0, 0);
        const context: WebGL2RenderingContext | null = offscreen.getContext("webgl2");

        /**
         * @default null
         * @type {Worker}
         * @static
         */
        $rendererWorker = context !== null
            ? new Worker(URL.createObjectURL(new Blob([$renderURL], { "type": "text/javascript" })))
            : null;

        // $rendererWorker = null;
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

                const children: DisplayObjectImpl<any>[] = source._$needsChildren
                    ? source._$getChildren()
                    : source._$children;

                const childrenIds: number[] = $getArray();

                for (let idx: number = 0; idx < children.length; ++idx) {

                    const instance: DisplayObjectImpl<any> = children[idx];
                    if (!instance) {
                        continue;
                    }

                    childrenIds.push(instance._$instanceId);

                    if ("_$children" in instance) {
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

                const children: DisplayObjectImpl<any>[] = source._$needsChildren
                    ? source._$getChildren()
                    : source._$children;

                for (let idx: number = 0; idx < children.length; ++idx) {

                    const instance: DisplayObjectImpl<any> = children[idx];
                    if (!instance) {
                        continue;
                    }

                    if ("_$children" in instance) {

                        // @ts-ignore
                        $removeContainerWorker(instance);

                    } else {
                        instance._$removeWorkerInstance();
                    }
                }
            };

            $rendererWorker.onmessage = (event: MessageEvent) =>
            {

                switch (event.data.command) {

                    case "renderBuffer":
                        $poolRenderBufferArray(event.data.buffer);
                        break;

                    case "bitmapDraw":
                        {
                            const sourceId: number = event.data.sourceId;
                            const object: BitmapDrawObjectImpl | void = $bitmapDrawMap
                                .get(sourceId);

                            $bitmapDrawMap.delete(sourceId);
                            if (!object) {
                                return ;
                            }

                            // reset
                            const source: DisplayObjectImpl<any> = object.source;
                            if ("_$children" in source) {
                                // @ts-ignore
                                $removeContainerWorker(source);
                            } else {
                                source._$removeWorkerInstance();
                            }

                            if (object.callback) {
                                const context = object.context;
                                context.drawImage(event.data.imageBitmap, 0, 0);
                                object.callback(context.canvas);
                            }
                        }
                        break;

                    default:
                        break;

                }
            };
        }
    }

    return new Promise((resolve): void =>
    {
        // @ts-ignore
        const userAgentData: any = navigator.userAgentData;
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

                    resolve();
                });

        } else {

            const userAgent = navigator.userAgent;

            $isAndroid = userAgent.indexOf("Android") > -1;

            $isiOS = userAgent.indexOf("iPhone") > -1
                || userAgent.indexOf("iPod") > -1;

            $isChrome = userAgent.indexOf("Chrome") > -1;

            $isFireFox = userAgent.indexOf("Firefox") > -1;

            $isSafari = userAgent.indexOf("Chrome") === -1
                && userAgent.indexOf("Safari") > -1;

            $isTouch = $isAndroid || $isiOS;

            resolve();
        }
    });
};