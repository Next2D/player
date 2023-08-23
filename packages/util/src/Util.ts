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
import { TextField } from "@next2d/display";
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
const $renderURL: string = "";

/**
 * @method
 * @public
 */
export const $initialize = (): Promise<void> =>
{
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

        $rendererWorker = null;
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

            // $rendererWorker.onmessage = (event: MessageEvent) =>
            // {

            //     switch (event.data.command) {

            //         case "renderBuffer":
            //             $poolRenderBufferArray(event.data.buffer);
            //             break;

            //         case "bitmapDraw":
            //             {
            //                 const sourceId: number = event.data.sourceId;
            //                 const object: BitmapDrawObjectImpl | void = $bitmapDrawMap
            //                     .get(sourceId);

            //                 $bitmapDrawMap.delete(sourceId);
            //                 if (!object) {
            //                     return ;
            //                 }

            //                 // reset
            //                 const source: DisplayObjectImpl<any> = object.source;
            //                 if ("_$children" in source) {
            //                     // @ts-ignore
            //                     $removeContainerWorker(source);
            //                 } else {
            //                     source._$removeWorkerInstance();
            //                 }

            //                 if (object.callback) {
            //                     const context = object.context;
            //                     context.drawImage(event.data.imageBitmap, 0, 0);
            //                     object.callback(context.canvas);
            //                 }
            //             }
            //             break;

            //         default:
            //             break;

            //     }
            // };
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