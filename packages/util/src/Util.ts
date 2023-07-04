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
    UnzipQueueImpl,
    ImageTypeImpl,
    DropTargetImpl,
    ParentImpl,
    BitmapDrawObjectImpl
} from "@next2d/interface";
import { $getEvent } from "./Global";
import {
    $document,
    $window,
    $devicePixelRatio
} from "./Shortcut";
import {
    $getArray,
    $poolArray,
    $Math,
    $clearTimeout,
    $setTimeout
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
const $unzipURL = URL.createObjectURL(new Blob(["(()=>{\"use strict\";var r=Uint8Array,n=Uint16Array,e=Int32Array,a=new r([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),t=new r([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),i=new r([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),o=function(r,a){for(var t=new n(31),i=0;i<31;++i)t[i]=a+=1<<r[i-1];var o=new e(t[30]);for(i=1;i<30;++i)for(var f=t[i];f<t[i+1];++f)o[f]=f-t[i]<<5|i;return{b:t,r:o}},f=o(a,2),u=f.b,v=f.r;u[28]=258,v[258]=28;for(var c=o(t,0),l=c.b,d=(c.r,new n(32768)),s=0;s<32768;++s){var w=(43690&s)>>1|(21845&s)<<1;w=(61680&(w=(52428&w)>>2|(13107&w)<<2))>>4|(3855&w)<<4,d[s]=((65280&w)>>8|(255&w)<<8)>>1}var h=function(r,e,a){for(var t=r.length,i=0,o=new n(e);i<t;++i)r[i]&&++o[r[i]-1];var f,u=new n(e);for(i=1;i<e;++i)u[i]=u[i-1]+o[i-1]<<1;if(a){f=new n(1<<e);var v=15-e;for(i=0;i<t;++i)if(r[i])for(var c=i<<4|r[i],l=e-r[i],s=u[r[i]-1]++<<l,w=s|(1<<l)-1;s<=w;++s)f[d[s]>>v]=c}else for(f=new n(t),i=0;i<t;++i)r[i]&&(f[i]=d[u[r[i]-1]++]>>15-r[i]);return f},y=new r(288);for(s=0;s<144;++s)y[s]=8;for(s=144;s<256;++s)y[s]=9;for(s=256;s<280;++s)y[s]=7;for(s=280;s<288;++s)y[s]=8;var b=new r(32);for(s=0;s<32;++s)b[s]=5;var g=h(y,9,1),p=h(b,5,1),m=function(r){for(var n=r[0],e=1;e<r.length;++e)r[e]>n&&(n=r[e]);return n},k=function(r,n,e){var a=n/8|0;return(r[a]|r[a+1]<<8)>>(7&n)&e},x=function(r,n){var e=n/8|0;return(r[e]|r[e+1]<<8|r[e+2]<<16)>>(7&n)},T=[\"unexpected EOF\",\"invalid block type\",\"invalid length/literal\",\"invalid distance\",\"stream finished\",\"no stream handler\",,\"no callback\",\"invalid UTF-8 data\",\"extra field too long\",\"date not in range 1980-2099\",\"filename too long\",\"stream finishing\",\"invalid zip data\"],z=function(r,n,e){var a=new Error(n||T[r]);if(a.code=r,Error.captureStackTrace&&Error.captureStackTrace(a,z),!e)throw a;return a},E=function(n,e,o,f){var v=n.length,c=f?f.length:0;if(!v||e.f&&!e.l)return o||new r(0);var d=!o||2!=e.i,s=e.i;o||(o=new r(3*v));var w,y=function(n){var e=o.length;if(n>e){var a=new r(Math.max(2*e,n));a.set(o),o=a}},b=e.f||0,T=e.p||0,E=e.b||0,M=e.l,S=e.d,U=e.m,A=e.n,C=8*v;do{if(!M){b=k(n,T,1);var q=k(n,T+1,3);if(T+=3,!q){var D=n[(w=T,(G=4+((w+7)/8|0))-4)]|n[G-3]<<8,F=G+D;if(F>v){s&&z(0);break}d&&y(E+D),o.set(n.subarray(G,F),E),e.b=E+=D,e.p=T=8*F,e.f=b;continue}if(1==q)M=g,S=p,U=9,A=5;else if(2==q){var I=k(n,T,31)+257,O=k(n,T+10,15)+4,J=I+k(n,T+5,31)+1;T+=14;for(var L=new r(J),N=new r(19),P=0;P<O;++P)N[i[P]]=k(n,T+3*P,7);T+=3*O;var R=m(N),j=(1<<R)-1,B=h(N,R,1);for(P=0;P<J;){var G,H=B[k(n,T,j)];if(T+=15&H,(G=H>>4)<16)L[P++]=G;else{var K=0,Q=0;for(16==G?(Q=3+k(n,T,3),T+=2,K=L[P-1]):17==G?(Q=3+k(n,T,7),T+=3):18==G&&(Q=11+k(n,T,127),T+=7);Q--;)L[P++]=K}}var V=L.subarray(0,I),W=L.subarray(I);U=m(V),A=m(W),M=h(V,U,1),S=h(W,A,1)}else z(1);if(T>C){s&&z(0);break}}d&&y(E+131072);for(var X=(1<<U)-1,Y=(1<<A)-1,Z=T;;Z=T){var $=(K=M[x(n,T)&X])>>4;if((T+=15&K)>C){s&&z(0);break}if(K||z(2),$<256)o[E++]=$;else{if(256==$){Z=T,M=null;break}var _=$-254;if($>264){var rr=a[P=$-257];_=k(n,T,(1<<rr)-1)+u[P],T+=rr}var nr=S[x(n,T)&Y],er=nr>>4;if(nr||z(3),T+=15&nr,W=l[er],er>3&&(rr=t[er],W+=x(n,T)&(1<<rr)-1,T+=rr),T>C){s&&z(0);break}d&&y(E+131072);var ar=E+_;if(E<W){var tr=c-W,ir=Math.min(W,ar);for(tr+E<0&&z(3);E<ir;++E)o[E]=f[tr+E]}for(;E<ar;E+=4)o[E]=o[E-W],o[E+1]=o[E+1-W],o[E+2]=o[E+2-W],o[E+3]=o[E+3-W];E=ar}}e.l=M,e.p=Z,e.b=E,e.f=b,M&&(b=1,e.m=U,e.d=S,e.n=A)}while(!b);return E==o.length?o:function(n,e,a){(null==e||e<0)&&(e=0),(null==a||a>n.length)&&(a=n.length);var t=new r(a-e);return t.set(n.subarray(e,a)),t}(o,0,E)},M=new r(0);function S(n,e){var a,t,i=function(r){31==r[0]&&139==r[1]&&8==r[2]||z(6,\"invalid gzip data\");var n=r[3],e=10;4&n&&(e+=2+(r[10]|r[11]<<8));for(var a=(n>>3&1)+(n>>4&1);a>0;a-=!r[e++]);return e+(2&n)}(n);return i+8>n.length&&z(6,\"invalid gzip data\"),E(n.subarray(i,-8),{i:2},e&&e.out||new r((t=(a=n).length,(a[t-4]|a[t-3]<<8|a[t-2]<<16|a[t-1]<<24)>>>0)),e&&e.dictionary)}function U(r,n){return E(r.subarray((e=r,a=n&&n.dictionary,(8!=(15&e[0])||e[0]>>4>7||(e[0]<<8|e[1])%31)&&z(6,\"invalid zlib data\"),(e[1]>>5&1)==+!a&&z(6,\"invalid zlib data: \"+(32&e[1]?\"need\":\"unexpected\")+\" dictionary\"),2+(e[1]>>3&4)),-4),{i:2},n&&n.out,n&&n.dictionary);var e,a}var A=\"undefined\"!=typeof TextDecoder&&new TextDecoder;try{A.decode(M,{stream:!0})}catch(r){}\"function\"==typeof queueMicrotask?queueMicrotask:\"function\"==typeof setTimeout&&setTimeout;self.addEventListener(\"message\",(r=>{return n=void 0,e=void 0,t=function*(){const n=31==(e=r.data)[0]&&139==e[1]&&8==e[2]?S(e,a):8!=(15&e[0])||e[0]>>4>7||(e[0]<<8|e[1])%31?function(r,n){return E(r,{i:2},n&&n.out,n&&n.dictionary)}(e,a):U(e,a);var e,a;let t=\"\";for(let r=0;r<n.length;r+=4096)t+=String.fromCharCode(...n.slice(r,r+4096));self.postMessage(JSON.parse(decodeURIComponent(t)))},new((a=void 0)||(a=Promise))((function(r,i){function o(r){try{u(t.next(r))}catch(r){i(r)}}function f(r){try{u(t.throw(r))}catch(r){i(r)}}function u(n){var e;n.done?r(n.value):(e=n.value,e instanceof a?e:new a((function(r){r(e)}))).then(o,f)}u((t=t.apply(n,e||[])).next())}));var n,e,a,t}))})();"], { "type": "text/javascript" }));

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
export const $useUnzipWorker = (): boolean =>
{
    return $unzipWorkerActive;
};

/**
 * @type {string}
 * @public
 */
const $renderURL: string = "(()=>{\"use strict\";let t=0,e=!1;const i=1/0,r=Math,s=Array,n=Map,a=Number,h=Float32Array,o=Int32Array,l=Int16Array,_=OffscreenCanvas,c=isNaN,$=requestAnimationFrame,u=setTimeout,d=clearTimeout,g=new h([1,0,0,1,0,0]),f=new h([1,1,1,1,0,0,0,0]),p=r.PI/180,m=(r.PI,[]),x=[],b=[],v=[],T=[],A=[],M=[],y=[],E=new _(1,1).getContext(\"2d\"),C=(t=0,e=0,i=0,r=0)=>{const s=y.pop()||{xMin:0,xMax:0,yMin:0,yMax:0};return s.xMin=t,s.xMax=e,s.yMin=i,s.yMax=r,s},S=t=>{y.push(t)},w=(t=0,e=0,i=0,r=0)=>{const s=x.pop()||new h(4);return s[0]=t,s[1]=e,s[2]=i,s[3]=r,s},B=t=>{x.push(t)},F=(t=0,e=0,i=0,r=0,s=0,n=0)=>{const a=b.pop()||new h(6);return a[0]=t,a[1]=e,a[2]=i,a[3]=r,a[4]=s,a[5]=n,a},R=t=>{b.push(t)},I=(t=1,e=1,i=1,r=1,s=0,n=0,a=0,o=0)=>{const l=v.pop()||new h(8);return l[0]=t,l[1]=e,l[2]=i,l[3]=r,l[4]=s,l[5]=n,l[6]=a,l[7]=o,l},P=t=>{v.push(t)},k=(t=0,e=0,i=0,r=0,s=0,n=0,a=0,o=0,l=0)=>{const _=T.pop()||new h(9);return _[0]=t,_[1]=e,_[2]=i,_[3]=r,_[4]=s,_[5]=n,_[6]=a,_[7]=o,_[8]=l,_},L=(...t)=>{const e=A.pop()||[];return t.length&&e.push(...t),e},N=(t=null)=>{t&&(t.length&&(t.length=0),A.push(t))},U=t=>{t.size&&t.clear(),M.push(t)},O=()=>M.pop()||new n,D=t=>(t--,t|=t>>1,t|=t>>2,t|=t>>4,t|=t>>8,t|=t>>16,++t),X=t=>{const e=1/(t[0]*t[4]-t[3]*t[1]),i=t[3]*t[7]-t[4]*t[6],r=t[1]*t[6]-t[0]*t[7];return k(t[4]*e,0-t[1]*e,0,0-t[3]*e,t[0]*e,0,i*e,r*e,1)},V=(t,e,i,s=null)=>{const n=+t;return c(n)&&null!==s?s:r.min(r.max(e,c(n)?0:n),i)},Y=(t,e)=>F(t[0]*e[0]+t[2]*e[1],t[1]*e[0]+t[3]*e[1],t[0]*e[2]+t[2]*e[3],t[1]*e[2]+t[3]*e[3],t[0]*e[4]+t[2]*e[5]+t[4],t[1]*e[4]+t[3]*e[5]+t[5]),G=(t,e)=>I(t[0]*e[0],t[1]*e[1],t[2]*e[2],t[3]*e[3],t[0]*e[4]+t[4],t[1]*e[5]+t[5],t[2]*e[6]+t[6],t[3]*e[7]+t[7]),z=(t,e)=>{const i=t.xMax*e[0]+t.yMax*e[2]+e[4],s=t.xMax*e[0]+t.yMin*e[2]+e[4],n=t.xMin*e[0]+t.yMax*e[2]+e[4],h=t.xMin*e[0]+t.yMin*e[2]+e[4],o=t.xMax*e[1]+t.yMax*e[3]+e[5],l=t.xMax*e[1]+t.yMin*e[3]+e[5],_=t.xMin*e[1]+t.yMax*e[3]+e[5],c=t.xMin*e[1]+t.yMin*e[3]+e[5],$=r.min(a.MAX_VALUE,i,s,n,h),u=r.max(0-a.MAX_VALUE,i,s,n,h),d=r.min(a.MAX_VALUE,o,l,_,c),g=r.max(0-a.MAX_VALUE,o,l,_,c);return C($,u,d,g)},W=t=>c(+t)?(t=>{if(!E)return 0;E.fillStyle=t;const e=+`0x${E.fillStyle.slice(1)}`;return E.fillStyle=\"rgba(0, 0, 0, 1)\",e})(`${t}`):+t,H=(t,e,i)=>(t>>16)*(i?e:1)/255,q=(t,e,i)=>(t>>8&255)*(i?e:1)/255,j=(t,e,i)=>(255&t)*(i?e:1)/255,Q=(t,e=1)=>({R:(16711680&t)>>16,G:(65280&t)>>8,B:255&t,A:255*e}),J=(t,e,i=!1,r=!1)=>{let s=\"\";return i&&(s=\"italic \"),r&&(s+=\"bold \"),`${s}${e}px '${t}','sans-serif'`},K=t=>{t.color&&P(t.color),t.isFilter=!1,t.isUpdated=null,t.canApply=null,t.matrix=null,t.color=null,t.baseMatrix=null,t.baseColor=null,t.filters=null,t.blendMode=\"normal\",m.push(t)};class Z{constructor(){this._$pool=[],this._$store=new Map,this._$timerMap=new Map,this._$context=null}set context(t){this._$context=t}reset(){for(const t of this._$store.values()){for(const e of t.values())this.destroy(e);U(t)}this._$store.clear()}destroy(t=null){if(t)if(t instanceof WebGLTexture)$((()=>{this._$context&&this._$context.frameBuffer.releaseTexture(t)}));else if(t instanceof CanvasRenderingContext2D){const e=t.canvas,i=e.width,r=e.height;t.clearRect(0,0,i+1,r+1),e.width=e.height=1,this._$pool.push(e)}}getCanvas(){return this._$pool.pop()||document.createElement(\"canvas\")}remove(t,e){if(!this._$store.has(t))return;const i=this._$store.get(t);i.has(e)&&(i.delete(e),i.size||(U(i),this._$store.delete(t)))}stopTimer(t){t=`${t}`,this._$timerMap.has(t)&&(d(this._$timerMap.get(t)),this._$timerMap.delete(t))}removeCache(t){if(t=`${t}`,this._$store.has(t)){const e=this._$store.get(t);for(const t of e.values())this.destroy(t);e.clear(),U(e),this._$store.delete(t)}this._$timerMap.delete(t)}setRemoveTimer(t){if(t=`${t}`,this.stopTimer(t),this._$store.has(t)){const e=u((()=>{this.removeCache(t)}),5e3);this._$timerMap.set(t,e)}}get(t){const e=`${t[0]}`,i=`${t[1]}`;if(this._$store.has(e)){this.stopTimer(e);const t=this._$store.get(e);if(t.has(i))return t.get(i)}return null}set(t,e=null){const i=`${t[0]}`,r=`${t[1]}`;this._$store.has(i)||this._$store.set(i,O());const s=this._$store.get(i);if(!e)return s.delete(r),void(s.size||(U(s),this._$store.delete(i)));const n=s.get(r);n&&n!==e&&this.destroy(n),s.set(r,e)}has(t){const e=`${t[0]}`;return!!this._$store.has(e)&&this._$store.get(e).has(`${t[1]}`)}generateKeys(t,e=null,i=null){let r=\"\";e&&(r+=`${e.join(\"_\")}`),i&&(r+=this.colorToString(i));const s=L();return s[1]=r?this.generateHash(r):\"_0\",s[0]=`${t}`,s}colorToString(t){return 0===t[7]?\"\":`_${t[7]}`}generateHash(t){let e=0;const i=t.length;for(let r=0;r<i;r++)e=(e<<5)-e+t.charCodeAt(r),e|=0;return`_${e}`}}class tt{constructor(){this._$updated=!0}static toString(){return\"[class BitmapFilter]\"}static get namespace(){return\"next2d.filters.BitmapFilter\"}toString(){return\"[object BitmapFilter]\"}get namespace(){return\"next2d.filters.BitmapFilter\"}_$isUpdated(){return this._$updated}_$doChanged(){this._$updated=!0,((t=!0)=>{e=t})()}}class et extends tt{constructor(t=4,e=4,i=1){super(),this._$blurX=4,this._$blurY=4,this._$quality=1,this.blurX=t,this.blurY=e,this.quality=i}static toString(){return\"[class BlurFilter]\"}static get namespace(){return\"next2d.filters.BlurFilter\"}toString(){return\"[object BlurFilter]\"}get namespace(){return\"next2d.filters.BlurFilter\"}static get STEP(){return[.5,1.05,1.4,1.55,1.75,1.9,2,2.15,2.2,2.3,2.5,3,3,3.5,3.5]}get blurX(){return this._$blurX}set blurX(t){(t=V(+t,0,255,0))!==this._$blurX&&(this._$blurX=t,this._$doChanged())}get blurY(){return this._$blurY}set blurY(t){(t=V(+t,0,255,0))!==this._$blurY&&(this._$blurY=t,this._$doChanged())}get quality(){return this._$quality}set quality(t){(t=V(0|t,0,15,1))!==this._$quality&&(this._$quality=t,this._$doChanged())}clone(){return new et(this._$blurX,this._$blurY,this._$quality)}_$toArray(){return L(1,this._$blurX,this._$blurY,this._$quality)}_$generateFilterRect(t,e=0,i=0){const s=C(t.xMin,t.xMax,t.yMin,t.yMax);if(!this._$quality)return s;const n=et.STEP[this._$quality-1];let a=0>=this._$blurX?1:this._$blurX*n,h=0>=this._$blurY?1:this._$blurY*n;return e?a*=e:a=r.round(a),i?h*=i:h=r.round(h),s.xMin-=a,s.xMax+=2*a,s.yMin-=h,s.yMax+=2*h,s}_$canApply(){return 0!==this._$blurX&&0!==this._$blurY}_$applyFilter(t,e,i=!0){this._$updated=!1;const s=t.frameBuffer,n=s.currentAttachment,a=s.getTextureFromCurrentAttachment();if(!this._$canApply())return i?a:s.createTextureFromCurrentAttachment();const h=r.sqrt(e[0]*e[0]+e[1]*e[1]),o=r.sqrt(e[2]*e[2]+e[3]*e[3]),l=C(0,a.width,0,a.height),_=this._$generateFilterRect(l,h,o);S(l);const c=0|r.ceil(_.xMax),$=0|r.ceil(_.yMax),u=r.ceil(r.abs(_.xMin)+.5*r.abs(c-_.xMax)),d=r.ceil(r.abs(_.yMin)+.5*r.abs($-_.yMax));t._$offsetX=u+t._$offsetX,t._$offsetY=d+t._$offsetY;const g=this._$blurX*h,f=this._$blurY*o;let p=1,m=1;g>128?p=.0625:g>64?p=.125:g>32?p=.25:g>16&&(p=.5),f>128?m=.0625:f>64?m=.125:f>32?m=.25:f>16&&(m=.5);const x=g*p,b=f*m,v=r.ceil(c*p),T=r.ceil($*m),A=s.createTextureAttachment(v,T),M=[A,s.createTextureAttachment(v,T)];let y=0;t._$bind(A),t.reset(),t.setTransform(p,0,0,m,0,0),t.drawImage(a,u,d,a.width,a.height),t.blend.toOneZero();let E=s.getTextureFromCurrentAttachment();for(let e=0;e<this._$quality;++e){if(this._$blurX>0){y=(y+1)%2;const e=M[y];t._$bind(e),t._$applyBlurFilter(E,!0,x),E=s.getTextureFromCurrentAttachment()}if(this._$blurY>0){y=(y+1)%2;const e=M[y];t._$bind(e),t._$applyBlurFilter(E,!1,b),E=s.getTextureFromCurrentAttachment()}}if(t.blend.reset(),1!==p||1!==m){const e=s.createTextureAttachment(c,$);t._$bind(e),t.reset(),t.imageSmoothingEnabled=!0,t.setTransform(1/p,0,0,1/m,0,0),t.drawImage(E,0,0,v,T),E=s.getTextureFromCurrentAttachment(),t.reset(),t.setTransform(1,0,0,1,0,0),s.releaseAttachment(M[0],!0),s.releaseAttachment(M[1],!0),i?s.releaseAttachment(n,!0):s.releaseAttachment(e,!1)}else s.releaseAttachment(M[(y+1)%2],!0),i?s.releaseAttachment(n,!0):s.releaseAttachment(M[y],!1);return E}}class it extends tt{constructor(t=4,e=45,i=16777215,r=1,s=0,n=1,a=4,h=4,o=1,l=1,_=\"inner\",c=!1){super(),this._$blurFilter=new et(a,h,l),this._$distance=4,this._$angle=45,this._$highlightColor=16777215,this._$highlightAlpha=1,this._$shadowColor=0,this._$shadowAlpha=1,this._$strength=1,this._$type=\"inner\",this._$knockout=!1,this.distance=t,this.angle=e,this.highlightColor=i,this.highlightAlpha=r,this.shadowColor=s,this.shadowAlpha=n,this.strength=o,this.type=_,this.knockout=c}static toString(){return\"[class BevelFilter]\"}static get namespace(){return\"next2d.filters.BevelFilter\"}toString(){return\"[object BevelFilter]\"}get namespace(){return\"next2d.filters.BevelFilter\"}get angle(){return this._$angle}set angle(t){(t%=360)!==this._$angle&&(this._$angle=V(t,-360,360,45),this._$doChanged())}get blurX(){return this._$blurFilter.blurX}set blurX(t){this._$blurFilter.blurX=t}get blurY(){return this._$blurFilter.blurY}set blurY(t){this._$blurFilter.blurY=t}get distance(){return this._$distance}set distance(t){(t=V(+t,-255,255,4))!==this._$distance&&(this._$distance=t,this._$doChanged())}get highlightAlpha(){return this._$highlightAlpha}set highlightAlpha(t){(t=V(+t,0,1,0))!==this._$highlightAlpha&&(this._$highlightAlpha=t,this._$doChanged())}get highlightColor(){return this._$highlightColor}set highlightColor(t){(t=V(W(t),0,16777215,16777215))!==this._$highlightColor&&(this._$highlightColor=t,this._$doChanged())}get knockout(){return this._$knockout}set knockout(t){t!==this._$knockout&&(this._$knockout=!!t,this._$doChanged())}get quality(){return this._$blurFilter.quality}set quality(t){this._$blurFilter.quality=t}get shadowAlpha(){return this._$shadowAlpha}set shadowAlpha(t){(t=V(+t,0,1,0))!==this._$shadowAlpha&&(this._$shadowAlpha=t,this._$doChanged())}get shadowColor(){return this._$shadowColor}set shadowColor(t){(t=V(W(t),0,16777215,0))!==this._$shadowColor&&(this._$shadowColor=t,this._$doChanged())}get strength(){return this._$strength}set strength(t){(t=V(0|t,0,255,0))!==this._$strength&&(this._$strength=t,this._$doChanged())}get type(){return this._$type}set type(t){(t=`${t}`)!==this._$type&&(this._$type=t,this._$doChanged())}clone(){return new it(this._$distance,this._$angle,this._$highlightColor,this._$highlightAlpha,this._$shadowColor,this._$shadowAlpha,this._$blurFilter.blurX,this._$blurFilter.blurY,this._$strength,this._$blurFilter.quality,this._$type,this._$knockout)}_$toArray(){return L(0,this._$distance,this._$angle,this._$highlightColor,this._$highlightAlpha,this._$shadowColor,this._$shadowAlpha,this._$blurFilter.blurX,this._$blurFilter.blurY,this._$strength,this._$blurFilter.quality,this._$type,this._$knockout)}_$isUpdated(){return this._$updated||this._$blurFilter._$isUpdated()}_$generateFilterRect(t,e=0,i=0){let s=C(t.xMin,t.xMax,t.yMin,t.yMax);if(!this._$canApply())return s;s=this._$blurFilter._$generateFilterRect(s,e,i);const n=this._$angle*p,a=r.abs(r.cos(n)*this._$distance),h=r.abs(r.sin(n)*this._$distance);return s.xMin+=-a,s.xMax+=a,s.yMin+=-h,s.yMax+=2*h,s}_$canApply(){return this._$strength>0&&0!==this._$distance&&this._$blurFilter._$canApply()}_$applyFilter(t,e){this._$updated=!1;const i=t.frameBuffer,s=i.currentAttachment;if(!s)throw new Error(\"the current attachment is null.\");t.setTransform(1,0,0,1,0,0);const n=i.getTextureFromCurrentAttachment();if(!this._$canApply())return n;const a=s.width,h=s.height,o=t._$offsetX,l=t._$offsetY,_=r.sqrt(e[0]*e[0]+e[1]*e[1]),c=r.sqrt(e[2]*e[2]+e[3]*e[3]),$=this._$angle*p,u=r.cos($)*this._$distance*_,d=r.sin($)*this._$distance*c,g=i.createTextureAttachment(a,h);t._$bind(g),t.reset(),t.drawImage(n,0,0,a,h),t.globalCompositeOperation=\"erase\",t.drawImage(n,2*u,2*d,a,h);const f=this._$blurFilter._$applyFilter(t,e,!1),m=f.width,x=f.height,b=r.ceil(m+2*r.abs(u)),v=r.ceil(x+2*r.abs(d)),T=\"inner\"===this._$type,A=T?a:b,M=T?h:v,y=r.abs(u),E=r.abs(d),C=(m-a)/2,S=(x-h)/2,w=T?0:y+C,B=T?0:E+S,F=T?-C-u:y-u,R=T?-S-d:E-d;return t._$bind(s),i.releaseAttachment(g,!0),t._$applyBitmapFilter(f,A,M,a,h,w,B,m,x,F,R,!1,this._$type,this._$knockout,this._$strength,null,null,null,H(this._$highlightColor,this._$highlightAlpha,!0),q(this._$highlightColor,this._$highlightAlpha,!0),j(this._$highlightColor,this._$highlightAlpha,!0),this._$highlightAlpha,H(this._$shadowColor,this._$shadowAlpha,!0),q(this._$shadowColor,this._$shadowAlpha,!0),j(this._$shadowColor,this._$shadowAlpha,!0),this._$shadowAlpha),t._$offsetX=o+w,t._$offsetY=l+B,i.releaseTexture(f),i.getTextureFromCurrentAttachment()}}class rt extends tt{constructor(t=null){super(),this._$matrix=[1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0],this.matrix=t}static toString(){return\"[class ColorMatrixFilter]\"}static get namespace(){return\"next2d.filters.ColorMatrixFilter\"}toString(){return\"[object ColorMatrixFilter]\"}get namespace(){return\"next2d.filters.ColorMatrixFilter\"}get matrix(){return this._$matrix}set matrix(t){if(t&&s.isArray(t)&&20===t.length){for(let e=0;e<20;++e)if(t[e]!==this._$matrix[e]){this._$doChanged();break}this._$matrix=t}}clone(){return new rt(this._$matrix)}_$toArray(){return L(2,this._$matrix)}_$generateFilterRect(t){return t}_$canApply(){return!0}_$applyFilter(t){this._$updated=!1;const e=t.frameBuffer,i=e.currentAttachment;t.setTransform(1,0,0,1,0,0);const r=e.getTextureFromCurrentAttachment(),s=r.width,n=r.height,a=e.createTextureAttachment(s,n);return t._$bind(a),t.reset(),t._$applyColorMatrixFilter(r,this._$matrix),e.releaseAttachment(i,!0),e.getTextureFromCurrentAttachment()}}class st extends tt{constructor(t=0,e=0,i=null,r=1,s=0,n=!0,a=!0,h=0,o=0){super(),this._$matrixX=0,this._$matrixY=0,this._$matrix=null,this._$divisor=1,this._$bias=0,this._$preserveAlpha=!0,this._$clamp=!0,this._$color=0,this._$alpha=0,this.matrixX=t,this.matrixY=e,this.matrix=i,this.divisor=r,this.bias=s,this.preserveAlpha=n,this.clamp=a,this.color=h,this.alpha=o}static toString(){return\"[class ConvolutionFilter]\"}static get namespace(){return\"next2d.filters.ConvolutionFilter\"}toString(){return\"[object ConvolutionFilter]\"}get namespace(){return\"next2d.filters.ConvolutionFilter\"}get alpha(){return this._$alpha}set alpha(t){(t=V(+t,0,1,0))!==this._$alpha&&(this._$alpha=t,this._$doChanged())}get bias(){return this._$bias}set bias(t){t!==this._$bias&&(this._$bias=0|t,this._$doChanged())}get clamp(){return this._$clamp}set clamp(t){t!==this._$clamp&&(this._$clamp=!!t,this._$doChanged())}get color(){return this._$color}set color(t){(t=V(W(t),0,16777215,0))!==this._$color&&(this._$color=t,this._$doChanged())}get divisor(){return this._$divisor}set divisor(t){t!==this._$divisor&&(this._$divisor=0|t,this._$doChanged())}get matrix(){return this._$matrix}set matrix(t){s.isArray(this._$matrix)&&N(this._$matrix),this._$matrix=s.isArray(t)?t:null,this._$doChanged()}get matrixX(){return this._$matrixX}set matrixX(t){(t=0|V(0|t,0,15,0))!==this._$matrixX&&(this._$matrixX=t,this._$doChanged())}get matrixY(){return this._$matrixY}set matrixY(t){(t=0|V(0|t,0,15,0))!==this._$matrixY&&(this._$matrixY=t,this._$doChanged())}get preserveAlpha(){return this._$preserveAlpha}set preserveAlpha(t){t!==this._$preserveAlpha&&(this._$preserveAlpha=!!t,this._$doChanged())}clone(){return new st(this._$matrixX,this._$matrixY,this._$matrix?this._$matrix.slice():null,this._$divisor,this._$bias,this._$preserveAlpha,this._$clamp,this._$color,this._$alpha)}_$toArray(){return L(3,this._$matrixX,this._$matrixY,this._$matrix,this._$divisor,this._$bias,this._$preserveAlpha,this._$clamp,this._$color,this._$alpha)}_$generateFilterRect(t){return t}_$canApply(){return null!==this._$matrix&&this._$matrixX*this._$matrixY===this._$matrix.length}_$applyFilter(t){this._$updated=!1;const e=t.frameBuffer,i=e.currentAttachment;t.setTransform(1,0,0,1,0,0);const r=e.getTextureFromCurrentAttachment();return this._$canApply()&&this._$matrix?(t._$applyConvolutionFilter(r,this._$matrixX,this._$matrixY,this._$matrix,this._$divisor,this._$bias,this._$preserveAlpha,this._$clamp,H(this._$color,this._$alpha,!1),q(this._$color,this._$alpha,!1),j(this._$color,this._$alpha,!1),this._$alpha),e.releaseAttachment(i,!0),e.getTextureFromCurrentAttachment()):r}}class nt extends tt{constructor(t=null,e=null,i=0,r=0,s=0,n=0,a=\"wrap\",h=0,o=0){super(),this._$mapBitmap=null,this._$mapPoint=null,this._$componentX=0,this._$componentY=0,this._$scaleX=0,this._$scaleY=0,this._$mode=\"wrap\",this._$color=0,this._$alpha=0,this.mapBitmap=t,this.mapPoint=e,this.componentX=i,this.componentY=r,this.scaleX=s,this.scaleY=n,this.mode=a,this.color=h,this.alpha=o}static toString(){return\"[class DisplacementMapFilter]\"}static get namespace(){return\"next2d.filters.DisplacementMapFilter\"}toString(){return\"[object DisplacementMapFilter]\"}get namespace(){return\"next2d.filters.DisplacementMapFilter\"}get alpha(){return this._$alpha}set alpha(t){(t=V(+t,0,1,0))!==this._$alpha&&(this._$alpha=t,this._$doChanged())}get color(){return this._$color}set color(t){(t=V(W(t),0,16777215,0))!==this._$color&&(this._$color=t,this._$doChanged())}get componentX(){return this._$componentX}set componentX(t){t!==this._$componentX&&(this._$componentX=t,this._$doChanged())}get componentY(){return this._$componentY}set componentY(t){t!==this._$componentY&&(this._$componentY=t,this._$doChanged())}get mapBitmap(){return this._$mapBitmap}set mapBitmap(t){t!==this._$mapBitmap&&(this._$mapBitmap=t,this._$doChanged())}get mapPoint(){return this._$mapPoint}set mapPoint(t){t!==this._$mapPoint&&(this._$mapPoint=t,this._$doChanged())}get mode(){return this._$mode}set mode(t){t!==this._$mode&&(this._$mode=t,this._$doChanged())}get scaleX(){return this._$scaleX}set scaleX(t){(t=V(+t,-65535,65535,0))!==this._$scaleX&&(this._$scaleX=t,this._$doChanged())}get scaleY(){return this._$scaleY}set scaleY(t){(t=V(+t,-65535,65535,0))!==this._$scaleY&&(this._$scaleY=t,this._$doChanged())}clone(){return new nt(this._$mapBitmap,this._$mapPoint,this._$componentX,this._$componentY,this._$scaleX,this._$scaleY,this._$mode,this._$color,this._$alpha)}_$toArray(){return L(4,this._$mapBitmap,this._$mapPoint,this._$componentX,this._$componentY,this._$scaleX,this._$scaleY,this._$mode,this._$color,this._$alpha)}_$generateFilterRect(t){return t}_$canApply(){return null!==this._$mapBitmap&&this._$componentX>0&&this._$componentY>0&&0!==this._$scaleX&&0!==this._$scaleY}_$applyFilter(t,e){this._$updated=!1;const i=t.frameBuffer,s=i.currentAttachment;t.setTransform(1,0,0,1,0,0);const n=i.getTextureFromCurrentAttachment();if(!this._$canApply()||!s||!this._$mapBitmap)return n;const a=r.sqrt(e[0]*e[0]+e[1]*e[1]),h=r.sqrt(e[2]*e[2]+e[3]*e[3]);return t._$applyDisplacementMapFilter(n,this._$mapBitmap,n.width/a,n.height/h,this._$mapPoint,this._$componentX,this._$componentY,this._$scaleX,this._$scaleY,this._$mode,H(this._$color,this._$alpha,!0),q(this._$color,this._$alpha,!0),j(this._$color,this._$alpha,!0),this._$alpha),i.releaseAttachment(s,!0),i.getTextureFromCurrentAttachment()}}class at extends tt{constructor(t=4,e=45,i=0,r=1,s=4,n=4,a=1,h=1,o=!1,l=!1,_=!1){super(),this._$blurFilter=new et(s,n,h),this._$distance=4,this._$angle=45,this._$color=0,this._$alpha=1,this._$strength=1,this._$inner=!1,this._$knockout=!1,this._$hideObject=!1,this.distance=t,this.angle=e,this.color=i,this.alpha=r,this.strength=a,this.inner=o,this.knockout=l,this.hideObject=_}static toString(){return\"[class DropShadowFilter]\"}static get namespace(){return\"next2d.filters.DropShadowFilter\"}toString(){return\"[object DropShadowFilter]\"}get namespace(){return\"next2d.filters.DropShadowFilter\"}get alpha(){return this._$alpha}set alpha(t){(t=V(+t,0,1,0))!==this._$alpha&&(this._$alpha=t,this._$doChanged())}get angle(){return this._$angle}set angle(t){(t%=360)!==this._$angle&&(this._$angle=V(t,-360,360,45),this._$doChanged())}get blurX(){return this._$blurFilter.blurX}set blurX(t){this._$blurFilter.blurX=t}get blurY(){return this._$blurFilter.blurY}set blurY(t){this._$blurFilter.blurY=t}get color(){return this._$color}set color(t){(t=V(W(t),0,16777215,0))!==this._$color&&(this._$color=t,this._$doChanged())}get distance(){return this._$distance}set distance(t){(t=V(+t,-255,255,4))!==this._$distance&&(this._$distance=t,this._$doChanged())}get hideObject(){return this._$hideObject}set hideObject(t){t!==this._$hideObject&&(this._$hideObject=!!t,this._$doChanged())}get inner(){return this._$inner}set inner(t){t!==this._$inner&&(this._$inner=!!t,this._$doChanged())}get knockout(){return this._$knockout}set knockout(t){t!==this._$knockout&&(this._$knockout=!!t,this._$doChanged())}get quality(){return this._$blurFilter.quality}set quality(t){this._$blurFilter.quality=t}get strength(){return this._$strength}set strength(t){(t=V(0|t,0,255,0))!==this._$strength&&(this._$strength=t,this._$doChanged())}clone(){return new at(this._$distance,this._$angle,this._$color,this._$alpha,this._$blurFilter.blurX,this._$blurFilter.blurY,this._$strength,this._$blurFilter.quality,this._$inner,this._$knockout,this._$hideObject)}_$toArray(){return L(5,this._$distance,this._$angle,this._$color,this._$alpha,this._$blurFilter.blurX,this._$blurFilter.blurY,this._$strength,this._$blurFilter.quality,this._$inner,this._$knockout,this._$hideObject)}_$isUpdated(){return this._$updated||this._$blurFilter._$isUpdated()}_$generateFilterRect(t,e=0,i=0){let s=C(t.xMin,t.xMax,t.yMin,t.yMax);if(!this._$canApply())return s;s=this._$blurFilter._$generateFilterRect(s,e,i);const n=this._$angle*p,a=r.cos(n)*this._$distance*2,h=r.sin(n)*this._$distance*2;return s.xMin=r.min(s.xMin,a),s.xMax+=r.abs(a),s.yMin=r.min(s.yMin,h),s.yMax+=r.abs(h),s}_$canApply(){return this._$alpha>0&&this._$strength>0&&this._$blurFilter._$canApply()}_$applyFilter(t,e){const i=t.frameBuffer,s=i.currentAttachment;if(!s)throw new Error(\"the current attachment is null.\");if(t.setTransform(1,0,0,1,0,0),!this._$canApply())return i.getTextureFromCurrentAttachment();const n=s.width,a=s.height,h=t._$offsetX,o=t._$offsetY,l=this._$blurFilter._$applyFilter(t,e,!1),_=l.width,c=l.height,$=t._$offsetX,u=t._$offsetY,d=$-h,g=u-o,f=r.sqrt(e[0]*e[0]+e[1]*e[1]),m=r.sqrt(e[2]*e[2]+e[3]*e[3]),x=this._$angle*p,b=r.cos(x)*this._$distance*f,v=r.sin(x)*this._$distance*m,T=this._$inner?n:_+r.max(0,r.abs(b)-d),A=this._$inner?a:c+r.max(0,r.abs(v)-g),M=r.ceil(T),y=r.ceil(A),E=(M-T)/2,C=(y-A)/2,S=this._$inner?0:r.max(0,d-b)+E,w=this._$inner?0:r.max(0,g-v)+C,B=this._$inner?b-$:(b>0?r.max(0,b-d):0)+E,F=this._$inner?v-u:(v>0?r.max(0,v-g):0)+C;let R,I;return this._$inner?(R=\"inner\",I=this._$knockout||this._$hideObject):!this._$knockout&&this._$hideObject?(R=\"full\",I=!0):(R=\"outer\",I=this._$knockout),t._$bind(s),t._$applyBitmapFilter(l,M,y,n,a,S,w,_,c,B,F,!0,R,I,this._$strength,null,null,null,H(this._$color,this._$alpha,!0),q(this._$color,this._$alpha,!0),j(this._$color,this._$alpha,!0),this._$alpha,0,0,0,0),t._$offsetX=h+S,t._$offsetY=o+w,i.releaseTexture(l),i.getTextureFromCurrentAttachment()}}class ht extends tt{constructor(t=0,e=1,i=4,r=4,s=1,n=1,a=!1,h=!1){super(),this._$blurFilter=new et(i,r,n),this._$color=0,this._$alpha=1,this._$strength=1,this._$inner=!1,this._$knockout=!1,this.color=t,this.alpha=e,this.strength=s,this.inner=a,this.knockout=h}static toString(){return\"[class GlowFilter]\"}static get namespace(){return\"next2d.filters.GlowFilter\"}toString(){return\"[object GlowFilter]\"}get namespace(){return\"next2d.filters.GlowFilter\"}get alpha(){return this._$alpha}set alpha(t){(t=V(+t,0,1,0))!==this._$alpha&&(this._$alpha=t,this._$doChanged())}get blurX(){return this._$blurFilter.blurX}set blurX(t){this._$blurFilter.blurX=t}get blurY(){return this._$blurFilter.blurY}set blurY(t){this._$blurFilter.blurY=t}get color(){return this._$color}set color(t){(t=V(W(t),0,16777215,4))!==this._$color&&(this._$color=t,this._$doChanged())}get inner(){return this._$inner}set inner(t){t!==this._$inner&&(this._$inner=!!t,this._$doChanged())}get knockout(){return this._$knockout}set knockout(t){t!==this._$knockout&&(this._$knockout=!!t,this._$doChanged())}get quality(){return this._$blurFilter.quality}set quality(t){this._$blurFilter.quality=t}get strength(){return this._$strength}set strength(t){(t=V(0|t,0,255,0))!==this._$strength&&(this._$strength=t,this._$doChanged())}clone(){return new ht(this._$color,this._$alpha,this._$blurFilter.blurX,this._$blurFilter.blurY,this._$strength,this._$blurFilter.quality,this._$inner,this._$knockout)}_$toArray(){return L(6,this._$color,this._$alpha,this._$blurFilter.blurX,this._$blurFilter.blurY,this._$strength,this._$blurFilter.quality,this._$inner,this._$knockout)}_$isUpdated(){return this._$updated||this._$blurFilter._$isUpdated()}_$generateFilterRect(t,e=0,i=0){const r=C(t.xMin,t.xMax,t.yMin,t.yMax);return this._$canApply()?this._$blurFilter._$generateFilterRect(r,e,i):r}_$canApply(){return this._$alpha>0&&this._$strength>0&&this._$blurFilter._$canApply()}_$applyFilter(t,e){const i=t.frameBuffer,r=i.currentAttachment;if(!r)throw new Error(\"the current attachment is null.\");if(this._$updated=!1,t.setTransform(1,0,0,1,0,0),!this._$canApply())return i.getTextureFromCurrentAttachment();const s=r.width,n=r.height,a=t._$offsetX,h=t._$offsetY,o=this._$blurFilter._$applyFilter(t,e,!1),l=o.width,_=o.height,c=t._$offsetX,$=t._$offsetY,u=this._$inner?s:l,d=this._$inner?n:_,g=this._$inner?0:c-a,f=this._$inner?0:$-h,p=this._$inner?-c:0,m=this._$inner?-$:0,x=this._$inner?\"inner\":\"outer\";return t._$bind(r),t._$applyBitmapFilter(o,u,d,s,n,g,f,l,_,p,m,!0,x,this._$knockout,this._$strength,null,null,null,H(this._$color,this._$alpha,!0),q(this._$color,this._$alpha,!0),j(this._$color,this._$alpha,!0),this._$alpha,0,0,0,0),t._$offsetX=a+g,t._$offsetY=h+f,i.releaseTexture(o),i.getTextureFromCurrentAttachment()}}class ot extends tt{constructor(t=4,e=45,i=null,r=null,s=null,n=4,a=4,h=1,o=1,l=\"inner\",_=!1){super(),this._$blurFilter=new et(n,a,o),this._$distance=4,this._$angle=45,this._$colors=null,this._$alphas=null,this._$ratios=null,this._$strength=1,this._$type=\"inner\",this._$knockout=!1,this.distance=t,this.angle=e,this.colors=i,this.alphas=r,this.ratios=s,this.strength=h,this.type=l,this.knockout=_}static toString(){return\"[class GradientBevelFilter]\"}static get namespace(){return\"next2d.filters.GradientBevelFilter\"}toString(){return\"[object GradientBevelFilter]\"}get namespace(){return\"next2d.filters.GradientBevelFilter\"}get alphas(){return this._$alphas}set alphas(t){if(t!==this._$alphas){if(this._$alphas=t,s.isArray(t)){for(let e=0;e<t.length;++e){const i=t[e];t[e]=V(+i,0,1,0)}this._$alphas=t}this._$doChanged()}}get angle(){return this._$angle}set angle(t){(t=V(t%360,-360,360,45))!==this._$angle&&(this._$angle=t,this._$doChanged())}get blurX(){return this._$blurFilter.blurX}set blurX(t){this._$blurFilter.blurX=t}get blurY(){return this._$blurFilter.blurY}set blurY(t){this._$blurFilter.blurY=t}get colors(){return this._$colors}set colors(t){if(this._$colors!==t){if(this._$colors=t,s.isArray(t)){for(let e=0;e<t.length;++e)t[e]=V(W(t[e]),0,16777215,0);this._$colors=t}this._$doChanged()}}get distance(){return this._$distance}set distance(t){(t=V(+t,-255,255,4))!==this._$distance&&(this._$distance=t,this._$doChanged())}get knockout(){return this._$knockout}set knockout(t){t!==this._$knockout&&(this._$knockout=!!t,this._$doChanged())}get quality(){return this._$blurFilter.quality}set quality(t){this._$blurFilter.quality=t}get ratios(){return this._$ratios}set ratios(t){if(this._$ratios!==t){if(this._$ratios=t,s.isArray(t)){for(let e=0;e<t.length;++e)t[e]=V(+t[e],0,255,0);this._$ratios=t}this._$doChanged()}}get strength(){return this._$strength}set strength(t){(t=V(0|t,0,255,0))!==this._$strength&&(this._$strength=t,this._$doChanged())}get type(){return this._$type}set type(t){t!==this._$type&&(this._$type=t,this._$doChanged())}clone(){return new ot(this._$distance,this._$angle,this._$colors?this._$colors.slice():null,this._$alphas?this._$alphas.slice():null,this._$ratios?this._$ratios.slice():null,this._$blurFilter.blurX,this._$blurFilter.blurY,this._$strength,this._$blurFilter.quality,this._$type,this._$knockout)}_$toArray(){return L(7,this._$distance,this._$angle,this._$colors,this._$alphas,this._$ratios,this._$blurFilter.blurX,this._$blurFilter.blurY,this._$strength,this._$blurFilter.quality,this._$type,this._$knockout)}_$isUpdated(){return this._$updated||this._$blurFilter._$isUpdated()}_$generateFilterRect(t,e=0,i=0){let s=C(t.xMin,t.xMax,t.yMin,t.yMax);if(!this._$canApply())return s;s=this._$blurFilter._$generateFilterRect(s,e,i);const n=this._$angle*p,a=r.abs(r.cos(n)*this._$distance),h=r.abs(r.sin(n)*this._$distance);return s.xMin+=-a,s.xMax+=a,s.yMin+=-h,s.yMax+=2*h,s}_$canApply(){return this._$strength>0&&this._$distance>0&&null!==this._$alphas&&null!==this._$ratios&&null!==this._$colors&&this._$blurFilter._$canApply()}_$applyFilter(t,e){this._$updated=!1;const i=t.frameBuffer,s=i.currentAttachment;t.setTransform(1,0,0,1,0,0);const n=i.getTextureFromCurrentAttachment();if(!this._$canApply()||!s)return n;const a=s.width,h=s.height,o=t._$offsetX,l=t._$offsetY,_=r.sqrt(e[0]*e[0]+e[1]*e[1]),c=r.sqrt(e[2]*e[2]+e[3]*e[3]),$=+this._$angle*p,u=+r.cos($)*this._$distance*_,d=+r.sin($)*this._$distance*c,g=i.createTextureAttachment(a,h);t._$bind(g),t.reset(),t.drawImage(n,0,0,a,h),t.globalCompositeOperation=\"erase\",t.drawImage(n,2*u,2*d,a,h);const f=this._$blurFilter._$applyFilter(t,e,!1),m=f.width,x=f.height,b=r.ceil(m+2*r.abs(u)),v=r.ceil(x+2*r.abs(d)),T=\"inner\"===this._$type,A=T?a:b,M=T?h:v,y=r.abs(u),E=r.abs(d),C=(m-a)/2,S=(x-h)/2,w=T?0:y+C,B=T?0:E+S,F=T?-C-u:y-u,R=T?-S-d:E-d;return t._$bind(s),t._$applyBitmapFilter(f,A,M,a,h,w,B,m,x,F,R,!1,this._$type,this._$knockout,this._$strength,this._$ratios,this._$colors,this._$alphas,0,0,0,0,0,0,0,0),t._$offsetX=o+w,t._$offsetY=l+B,i.releaseAttachment(g,!0),i.getTextureFromCurrentAttachment()}}class lt extends tt{constructor(t=4,e=45,i=null,r=null,s=null,n=4,a=4,h=1,o=1,l=\"inner\",_=!1){super(),this._$blurFilter=new et(n,a,o),this._$distance=4,this._$angle=45,this._$colors=null,this._$alphas=null,this._$ratios=null,this._$strength=1,this._$type=\"inner\",this._$knockout=!1,this.distance=t,this.angle=e,this.colors=i,this.alphas=r,this.ratios=s,this.strength=h,this.type=l,this.knockout=_}static toString(){return\"[class GradientGlowFilter]\"}static get namespace(){return\"next2d.filters.GradientGlowFilter\"}toString(){return\"[object GradientGlowFilter]\"}get namespace(){return\"next2d.filters.GradientGlowFilter\"}get alphas(){return this._$alphas}set alphas(t){if(t!==this._$alphas){if(this._$alphas=t,s.isArray(t)){for(let e=0;e<t.length;++e)t[e]=V(+t[e],0,1,0);this._$alphas=t}this._$doChanged()}}get angle(){return this._$angle}set angle(t){(t=V(t%360,-360,360,45))!==this._$angle&&(this._$angle=t,this._$doChanged())}get blurX(){return this._$blurFilter.blurX}set blurX(t){this._$blurFilter.blurX=t}get blurY(){return this._$blurFilter.blurY}set blurY(t){this._$blurFilter.blurY=t}get colors(){return this._$colors}set colors(t){if(this._$colors!==t){if(this._$colors=t,s.isArray(t)){for(let e=0;e<t.length;++e)t[e]=V(W(t[e]),0,16777215,0);this._$colors=t}this._$doChanged()}}get distance(){return this._$distance}set distance(t){(t=V(+t,-255,255,4))!==this._$distance&&(this._$distance=t,this._$doChanged())}get knockout(){return this._$knockout}set knockout(t){t!==this._$knockout&&(this._$knockout=!!t,this._$doChanged())}get quality(){return this._$blurFilter.quality}set quality(t){this._$blurFilter.quality=t}get ratios(){return this._$ratios}set ratios(t){if(this._$ratios!==t){if(this._$ratios=t,s.isArray(t)){for(let e=0;e<t.length;++e)t[e]=V(+t[e],0,255,0);this._$ratios=t}this._$doChanged()}}get strength(){return this._$strength}set strength(t){(t=V(0|t,0,255,0))!==this._$strength&&(this._$strength=t,this._$doChanged())}get type(){return this._$type}set type(t){t!==this._$type&&(this._$type=t,this._$doChanged())}clone(){return new lt(this._$distance,this._$angle,this._$colors,this._$alphas,this._$ratios,this._$blurFilter.blurX,this._$blurFilter.blurY,this._$strength,this._$blurFilter.quality,this._$type,this._$knockout)}_$toArray(){return L(8,this._$distance,this._$angle,this._$colors,this._$alphas,this._$ratios,this._$blurFilter.blurX,this._$blurFilter.blurY,this._$strength,this._$blurFilter.quality,this._$type,this._$knockout)}_$isUpdated(){return this._$updated||this._$blurFilter._$isUpdated()}_$generateFilterRect(t,e=0,i=0){let s=C(t.xMin,t.xMax,t.yMin,t.yMax);if(!this._$canApply())return s;s=this._$blurFilter._$generateFilterRect(s,e,i);const n=this._$angle*p,a=r.abs(r.cos(n)*this._$distance),h=r.abs(r.sin(n)*this._$distance);return s.xMin+=-a,s.xMax+=a,s.yMin+=-h,s.yMax+=2*h,s}_$canApply(){return this._$strength>0&&this._$distance>0&&null!==this._$alphas&&null!==this._$ratios&&null!==this._$colors&&this._$blurFilter._$canApply()}_$applyFilter(t,e){this._$updated=!1;const i=t.frameBuffer,s=i.currentAttachment;if(t.setTransform(1,0,0,1,0,0),!this._$canApply()||!s)return i.getTextureFromCurrentAttachment();const n=s.width,a=s.height,h=t._$offsetX,o=t._$offsetY,l=this._$blurFilter._$applyFilter(t,e,!1),_=l.width,c=l.height,$=t._$offsetX,u=t._$offsetY,d=$-h,g=u-o,f=r.sqrt(e[0]*e[0]+e[1]*e[1]),m=r.sqrt(e[2]*e[2]+e[3]*e[3]),x=+this._$angle*p,b=+r.cos(x)*this._$distance*f,v=+r.sin(x)*this._$distance*m,T=\"inner\"===this.type,A=T?n:_+r.max(0,r.abs(b)-d),M=T?a:c+r.max(0,r.abs(v)-g),y=r.ceil(A),E=r.ceil(M),C=(y-A)/2,S=(E-M)/2,w=T?0:r.max(0,d-b)+C,B=T?0:r.max(0,g-v)+S,F=T?b-$:(b>0?r.max(0,b-d):0)+C,R=T?v-u:(v>0?r.max(0,v-g):0)+S;return t._$bind(s),t._$applyBitmapFilter(l,y,E,n,a,w,B,_,c,F,R,!0,this._$type,this._$knockout,this._$strength,this._$ratios,this._$colors,this._$alphas,0,0,0,0,0,0,0,0),t._$offsetX=h+w,t._$offsetY=o+B,i.releaseTexture(l),i.getTextureFromCurrentAttachment()}}class _t{constructor(){this._$instanceId=-1,this._$parentId=-1,this._$loaderInfoId=-1,this._$characterId=-1,this._$clipDepth=0,this._$depth=0,this._$isMask=!1,this._$updated=!0,this._$matrix=F(1,0,0,1,0,0),this._$colorTransform=I(1,1,1,1,0,0,0,0),this._$blendMode=\"normal\",this._$filters=null,this._$visible=!0,this._$maskId=-1,this._$maskMatrix=null,this._$isMask=!1,this._$xMin=0,this._$yMin=0,this._$xMax=0,this._$yMax=0,this._$scale9Grid=null,this._$matrixBase=null}_$shouldClip(t){const e=this._$getBounds(t),i=r.abs(e.xMax-e.xMin),s=r.abs(e.yMax-e.yMin);return S(e),!(!i||!s)}_$getLayerBounds(t=null){const e=this._$getBounds(t),i=this._$filters;if(!i||!i.length)return e;let r=C(e.xMin,e.xMax-e.xMin,e.yMin,e.yMax-e.yMin);S(e);for(let t=0;t<i.length;++t)r=i[t]._$generateFilterRect(r,0,0);const s=r.xMin,n=r.xMin+r.xMax,a=r.yMin,h=r.yMin+r.yMax;return S(r),C(s,n,a,h)}_$getBounds(t=null){const e=C(this._$xMin,this._$xMax,this._$yMin,this._$yMax);if(!t)return e;let i=t;const r=this._$matrix;1===r[0]&&0===r[1]&&0===r[2]&&1===r[3]&&0===r[4]&&0===r[5]||(i=Y(t,r));const s=z(e,i);return S(e),i!==t&&R(i),s}_$startClip(t,e){let i=null;if(!t.cacheAttachment){let r=e;const s=this._$matrix;1===s[0]&&0===s[1]&&0===s[2]&&1===s[3]&&0===s[4]&&0===s[5]||(r=Y(e,s));const n=this._$getBounds(null),a=z(n,r);if(S(n),i=t._$startClip(e,a),S(a),r!==e&&R(r),!i)return!1}t._$enterClip(),t._$beginClipDef();let r=!1;return\"_$children\"in this&&(r=!0,t._$updateContainerClipFlag(!0)),this._$clip(t,i||e),this._$updated=!1,r&&(t._$updateContainerClipFlag(!1),t._$drawContainerClip()),t._$endClipDef(),i}_$doChanged(){if(this._$updated=!0,this._$parentId>-1){const t=se.instances;if(!t.has(this._$parentId))return;const e=t.get(this._$parentId);e._$updated||e._$doChanged()}}_$update(t){if(this._$doChanged(),this._$visible=t.visible,\"depth\"in t&&(this._$depth=t.depth),\"isMask\"in t&&(this._$isMask=t.isMask),\"clipDepth\"in t&&(this._$clipDepth=t.clipDepth),\"maskId\"in t&&(this._$maskId=t.maskId,this._$maskId>-1&&t.maskMatrix&&(this._$maskMatrix=t.maskMatrix)),this._$matrix[0]=\"a\"in t?t.a:1,this._$matrix[1]=\"b\"in t?t.b:0,this._$matrix[2]=\"c\"in t?t.c:0,this._$matrix[3]=\"d\"in t?t.d:1,this._$matrix[4]=\"tx\"in t?t.tx:0,this._$matrix[5]=\"ty\"in t?t.ty:0,this._$colorTransform[0]=\"f0\"in t?t.f0:1,this._$colorTransform[1]=\"f1\"in t?t.f1:1,this._$colorTransform[2]=\"f2\"in t?t.f2:1,this._$colorTransform[3]=\"f3\"in t?t.f3:1,this._$colorTransform[4]=\"f4\"in t?t.f4:0,this._$colorTransform[5]=\"f5\"in t?t.f5:0,this._$colorTransform[6]=\"f6\"in t?t.f6:0,this._$colorTransform[7]=\"f7\"in t?t.f7:0,this._$blendMode=t.blendMode||\"normal\",this._$filters=null,t.filters&&t.filters.length){this._$filters=L();for(let e=0;e<t.filters.length;++e){const i=t.filters[e];switch(i.shift()){case 0:this._$filters.push(new it(...i));break;case 1:this._$filters.push(new et(...i));break;case 2:this._$filters.push(new rt(...i));break;case 3:this._$filters.push(new st(...i));break;case 4:this._$filters.push(new nt(...i));break;case 5:this._$filters.push(new at(...i));break;case 6:this._$filters.push(new ht(...i));break;case 7:this._$filters.push(new ot(...i));break;case 8:this._$filters.push(new lt(...i))}}}t.grid&&(this._$scale9Grid=t.grid,t.matrixBase&&(this._$matrixBase=t.matrixBase))}_$canApply(t=null){if(t)for(let e=0;e<t.length;++e)if(t[e]._$canApply())return!0;return!1}_$remove(){this._$doChanged();const t=se,e=t.cacheStore;e.setRemoveTimer(this._$instanceId),this._$loaderInfoId>-1&&this._$characterId&&e.setRemoveTimer(`${this._$loaderInfoId}@${this._$characterId}`),t.instances.delete(this._$instanceId),this._$instanceId=-1,this._$parentId=-1,this._$loaderInfoId=-1,this._$characterId=-1,this._$blendMode=\"normal\",this._$filters=null,this._$visible=!0,this._$maskId=-1,this._$isMask=!1,this._$depth=0,this._$clipDepth=0,this._$scale9Grid=null}_$isUpdated(){return this._$updated}_$isFilterUpdated(t,e,i,s=null,n=!1,a=0,h=0){if(this._$isUpdated())return!0;if(s&&n)for(let t=0;t<s.length;++t)if(s[t]._$isUpdated())return!0;const o=se.cacheStore.get([this._$instanceId,\"f\"]);if(!o)return!0;switch(!0){case o.filterState!==n:case o.layerWidth!==r.ceil(t):case o.layerHeight!==r.ceil(e):case o.matrix!==i[0]+\"_\"+i[1]+\"_\"+i[2]+\"_\"+i[3]+\"_\"+a+\"_\"+h:return!0;default:return!1}}_$applyFilter(t,e,i,s,n,a){const h=+r.sqrt(s[0]*s[0]+s[1]*s[1]),o=+r.sqrt(s[2]*s[2]+s[3]*s[3]),l=r.atan2(s[1],s[0]),_=r.atan2(0-s[2],s[3]),c=F(r.cos(l),r.sin(l),0-r.sin(_),r.cos(_),n/2,a/2),$=F(1,0,0,1,0-i.width/2,0-i.height/2),u=Y(c,$);R(c),R($);const d=t.frameBuffer,g=d.currentAttachment,f=d.createCacheAttachment(n,a);t._$bind(f),t.reset(),t.setTransform(u[0],u[1],u[2],u[3],u[4],u[5]),R(u),t.drawImage(i,0,0,i.width,i.height),t._$offsetX=0,t._$offsetY=0;const p=F(h,0,0,o,0,0);let m=null;for(let i=0;i<e.length;++i)m=e[i]._$applyFilter(t,p);if(R(p),!m)return i;const x=t._$offsetX,b=t._$offsetY;return t._$offsetX=0,t._$offsetY=0,m._$offsetX=x,m._$offsetY=b,m.matrix=s[0]+\"_\"+s[1]+\"_\"+s[2]+\"_\"+s[3],m.filterState=!0,m.layerWidth=n,m.layerHeight=a,t._$bind(g),d.releaseAttachment(f,!1),m}_$drawFilter(t,e,i,r,s,n){const a=se.cacheStore,h=[this._$instanceId,\"f\"],o=a.get(h),l=this._$isFilterUpdated(s,n,i,r,!0);if(o&&!l)return o;if(o&&(a.set(h,null),o.layerWidth=0,o.layerHeight=0,o._$offsetX=0,o._$offsetY=0,o.matrix=null,o.colorTransform=null,t.frameBuffer.releaseTexture(o)),!o||l){const o=this._$applyFilter(t,r,e,i,s,n);return a.set(h,o),o}return o}}class ct extends _t{constructor(){super(),this._$recodes=null,this._$maxAlpha=0,this._$canDraw=!1}_$clip(t,e){this._$recodes&&(t.setTransform(e[0],e[1],e[2],e[3],e[4],e[5]),this._$runCommand(t,this._$recodes,null,!0),t.clip())}_$draw(t,e,s,n=\"normal\",h=null){if(!(this._$visible&&this._$recodes&&this._$maxAlpha&&this._$canDraw))return;const o=V(s[3]+s[7]/255,0,1,0);if(!o)return;const l=this._$matrix;let _=null!==this._$scale9Grid;_&&(_=_&&r.abs(l[1])<.001&&r.abs(l[2])<1e-4);const c=C(this._$xMin,this._$xMax,this._$yMin,this._$yMax),$=z(c,e),u=$.xMax,d=$.xMin,g=$.yMax,f=$.yMin;S($);const p=r.ceil(r.abs(u-d)),m=r.ceil(r.abs(g-f));switch(!0){case 0===p:case 0===m:case p===-1/0:case m===-1/0:case p===i:case m===i:return}const x=t.frameBuffer,b=x.currentAttachment;if(!b||d>b.width||f>b.height)return;let v=+r.sqrt(e[0]*e[0]+e[1]*e[1]);if(!a.isInteger(v)){const t=v.toString(),e=t.indexOf(\"e\");-1!==e&&(v=+t.slice(0,e)),v=+v.toFixed(4)}let T=+r.sqrt(e[2]*e[2]+e[3]*e[3]);if(!a.isInteger(T)){const t=T.toString(),e=t.indexOf(\"e\");-1!==e&&(T=+t.slice(0,e)),T=+T.toFixed(4)}if(0>d+p||0>f+m){if(!(h&&h.length&&this._$canApply(h)))return;{let t=C(0,p,0,m);for(let e=0;e<h.length;++e)t=h[e]._$generateFilterRect(t,v,T);if(0>t.xMin+t.xMax||0>t.yMin+t.yMax)return void S(t);S(t)}}const A=L(v,T);let M=`${this._$instanceId}`;!_&&this._$loaderInfoId>-1&&this._$characterId>-1&&(M=`${this._$loaderInfoId}@${this._$characterId}`);const y=se.cacheStore,E=y.generateKeys(M,A,s);N(A);let w=y.get(E);if(!w){let i=r.ceil(r.abs(c.xMax-c.xMin)*v),n=r.ceil(r.abs(c.yMax-c.yMin)*T);const a=t._$getTextureScale(i,n);a<1&&(i*=a,n*=a);const h=x.createCacheAttachment(i,n,!0);if(t._$bind(h),t.reset(),t.setTransform(v,0,0,T,0-c.xMin*v,0-c.yMin*T),_){const i=se.scaleX,s=F(i,0,0,i,0,0),n=Y(s,l);R(s);const a=this._$matrixBase,h=F(a[0],a[1],a[2],a[3],a[4]*i-d,a[5]*i-f),o=Y(h,n),_=o[4]-(e[4]-d),$=o[5]-(e[5]-f);R(o);const u=z(c,n),g=+u.xMax,p=+u.xMin,m=+u.yMax,x=+u.yMin,b=r.ceil(r.abs(g-p)),v=r.ceil(r.abs(m-x));S(u),t.grid.enable(p,x,b,v,c,this._$scale9Grid,i,n[0],n[1],n[2],n[3],n[4],n[5],h[0],h[1],h[2],h[3],h[4]-_,h[5]-$),R(n),R(h)}s[3]=1,this._$runCommand(t,this._$recodes,s,!1),_&&t.grid.disable(),w=x.getTextureFromCurrentAttachment(),y.set(E,w),x.releaseAttachment(h,!1),t._$bind(b)}let B=!1,I=0,P=0;h&&h.length&&this._$canApply(h)&&(B=!0,w=this._$drawFilter(t,w,e,h,p,m),I=w._$offsetX,P=w._$offsetY);const k=r.atan2(e[1],e[0]),U=r.atan2(0-e[2],e[3]);if(B||!k&&!U)t.setTransform(1,0,0,1,d-I,f-P);else{const i=c.xMin*v,s=c.yMin*T,n=r.cos(k),a=r.sin(k),h=r.cos(U),o=r.sin(U);t.setTransform(n,a,0-o,h,i*n-s*o+e[4],i*a+s*h+e[5])}t.reset(),t.globalAlpha=o,t.imageSmoothingEnabled=!0,t.globalCompositeOperation=n,t.drawImage(w,0,0,w.width,w.height,s),N(E),S(c)}setupStroke(t,e,i,r,s){switch(t.lineWidth=e,i){case 0:t.lineCap=\"none\";break;case 1:t.lineCap=\"round\";break;case 2:t.lineCap=\"square\"}switch(r){case 0:t.lineJoin=\"bevel\";break;case 1:t.lineJoin=\"miter\";break;case 2:t.lineJoin=\"round\"}t.miterLimit=s}createGradientStyle(t,e,i,s,n,a,h,o=null){let l,_=\"pad\";switch(n){case 0:_=\"reflect\";break;case 1:_=\"repeat\"}if(0===e){const e=(t=>{const e=-819.2*t[0]-819.2*t[2]+t[4],i=819.2*t[0]-819.2*t[2]+t[4],s=-819.2*t[0]+819.2*t[2]+t[4],n=-819.2*t[1]-819.2*t[3]+t[5],a=819.2*t[1]-819.2*t[3]+t[5];let h=s-e,o=-819.2*t[1]+819.2*t[3]+t[5]-n;const l=r.sqrt(h*h+o*o);l?(h/=l,o/=l):(h=0,o=0);const _=(i-e)*h+(a-n)*o;return w(e+_*h,n+_*o,i,a)})(s);l=t.createLinearGradient(e[0],e[1],e[2],e[3],a?\"rgb\":\"linearRGB\",_)}else t.save(),t.transform(s[0],s[1],s[2],s[3],s[4],s[5]),l=t.createRadialGradient(0,0,0,0,0,819.2,a?\"rgb\":\"linearRGB\",_,h);for(let t=0;t<i.length;++t){const e=i[t];let s=e.A;o&&(1===o[3]&&0===o[7]||(s=0|r.max(0,r.min(e.A*o[3]+o[7],255)))),l.addColorStop(e.ratio,w(e.R,e.G,e.B,s))}return l}_$runCommand(t,e,i=null,s=!1){t.reset(),t.beginPath();const n=e.length;for(let a=0;a<n;)switch(e[a++]){case 9:t.beginPath();break;case 0:t.moveTo(e[a++],e[a++]);break;case 2:t.lineTo(e[a++],e[a++]);break;case 1:t.quadraticCurveTo(e[a++],e[a++],e[a++],e[a++]);break;case 5:{if(s){a+=4;continue}const n=w();n[0]=e[a++]/255,n[1]=e[a++]/255,n[2]=e[a++]/255,n[3]=e[a++]/255,null!==i&&(1===i[3]&&0===i[7]||(n[3]=r.max(0,r.min(n[3]*i[3]+i[7],255))/255)),t.fillStyle=n}break;case 7:s||t.fill();break;case 6:{if(s){a+=8;continue}this.setupStroke(t,e[a++],e[a++],e[a++],e[a++]);const n=w();n[0]=e[a++]/255,n[1]=e[a++]/255,n[2]=e[a++]/255,n[3]=e[a++]/255,null!==i&&(1===i[3]&&0===i[7]||(n[3]=r.max(0,r.min(n[3]*i[3]+i[7],255))/255)),t.strokeStyle=n}break;case 8:s||t.stroke();break;case 12:t.closePath();break;case 3:t.bezierCurveTo(e[a++],e[a++],e[a++],e[a++],e[a++],e[a++]);break;case 4:t.arc(e[a++],e[a++],e[a++]);break;case 10:{if(s){a+=1;const t=e[a++];a+=5*t,a+=9;continue}const r=e[a++];let n=e[a++];const h=L();for(;n;)h.push({ratio:e[a++],R:e[a++],G:e[a++],B:e[a++],A:e[a++]}),n--;const o=F(e[a++],e[a++],e[a++],e[a++],e[a++],e[a++]);t.fillStyle=this.createGradientStyle(t,r,h,o,e[a++],e[a++],e[a++],i),t.fill(),1===r&&t.restore(),R(o),N(h)}break;case 11:{if(s){a+=5;const t=e[a++];a+=5*t,a+=9;continue}this.setupStroke(t,e[a++],e[a++],e[a++],e[a++]);const r=e[a++];let n=e[a++];const h=L();for(;n;)h.push({ratio:e[a++],R:e[a++],G:e[a++],B:e[a++],A:e[a++]}),n--;const o=F(e[a++],e[a++],e[a++],e[a++],e[a++],e[a++]);t.strokeStyle=this.createGradientStyle(t,r,h,o,e[a++],e[a++],e[a++],i),t.stroke(),1===r&&t.restore(),R(o),N(h)}break;case 13:{const r=e[a++],n=e[a++],h=e[a++],o=e[a++],l=e[a++];if(s){a+=l,a+=8;continue}const _=new Uint8Array(e.subarray(a,l+a));a+=l;const c=F(e[a++],e[a++],e[a++],e[a++],e[a++],e[a++]),$=!!e[a++],u=!!e[a++];t.save(),1===c[0]&&0===c[1]&&0===c[2]&&1===c[3]&&0===c[4]&&0===c[5]||t.transform(c[0],c[1],c[2],c[3],c[4],c[5]),R(c);const d=t.frameBuffer,g=d.createTextureFromPixels(r,n,_,!0);$||r!==h||n!==o?(t.fillStyle=t.createPattern(g,$,i||I()),t.imageSmoothingEnabled=u,t.fill()):(t.drawImage(g,0,0,r,n),d.releaseTexture(g)),t.restore(),t.imageSmoothingEnabled=!1}break;case 14:{if(s){a+=4;const t=e[a++];a+=t,a+=8;continue}t.save(),this.setupStroke(t,e[a++],e[a++],e[a++],e[a++]);const r=e[a++],n=e[a++],h=e[a++],o=new Uint8Array(e.subarray(a,h+a));a+=h;const l=F(e[a++],e[a++],e[a++],e[a++],e[a++],e[a++]);1===l[0]&&0===l[1]&&0===l[2]&&1===l[3]&&0===l[4]&&0===l[5]||t.transform(l[0],l[1],l[2],l[3],l[4],l[5]),R(l);const _=!!e[a++],c=!!e[a++],$=t.frameBuffer.createTextureFromPixels(r,n,o,!0);t.strokeStyle=t.createPattern($,_,i||I()),t.imageSmoothingEnabled=c,t.stroke(),t.restore(),t.imageSmoothingEnabled=!1}}}_$update(t){if(super._$update(t),t.recodes){this._$recodes=t.recodes,this._$xMin=t.xMin,this._$yMin=t.yMin,this._$xMax=t.xMax,this._$yMax=t.yMax,this._$maxAlpha=t.maxAlpha,this._$canDraw=t.canDraw;const e=se.cacheStore;e.removeCache(this._$instanceId),this._$loaderInfoId>-1&&this._$characterId>-1&&e.removeCache(`${this._$loaderInfoId}@${this._$characterId}`)}}}class $t extends ct{constructor(){super(),this._$children=L()}_$clip(t,e){let i=e;const r=this._$matrix;1===r[0]&&0===r[1]&&0===r[2]&&1===r[3]&&0===r[4]&&0===r[5]||(i=Y(e,r)),this._$recodes&&this._$canDraw&&super._$clip(t,i);const s=se.instances,n=this._$children;for(let e=0;e<this._$children.length;++e){const r=n[e];if(!s.has(r))continue;const a=s.get(r);a&&!a._$isMask&&(a._$clip(t,i),a._$updated=!1)}i!==e&&R(i)}_$draw(t,e,i){if(!this._$visible)return;let s=i;const n=this._$colorTransform;if(1===n[0]&&1===n[1]&&1===n[2]&&1===n[3]&&0===n[4]&&0===n[5]&&0===n[6]&&0===n[7]||(s=G(i,n)),!V(s[3]+s[7]/255,0,1,0))return;const a=this._$children,h=a.length;if(!(h||this._$recodes&&this._$canDraw))return;const o=this._$preDraw(t,e);if(!o)return;if(o.isFilter&&!o.isUpdated)return void this._$postDraw(t,e,s,o);let l=o.matrix;const _=o.isFilter&&o.color?o.color:s;this._$recodes&&this._$canDraw&&this._$maxAlpha>0&&super._$draw(t,l,_);let c=!0,$=0;const u=L(),d=L(),f=L(),p=L(),m=se.instances,x=t.isLayer;for(let e=0;e<h;++e){const i=a[e];if(!m.has(i))continue;const s=m.get(i);if(s._$isMask)continue;const n=s._$blendMode;if((\"alpha\"===n||\"erase\"===n)&&!x)continue;if($&&(s._$placeId>$||s._$clipDepth>0)){if(t.restore(),c&&(t._$leaveClip(),u.length)){const t=u.pop();t&&(R(l),l=t)}$=f.length&&f.pop()||0,c=!!p.pop()}if(!c)continue;if(s._$clipDepth>0){if(t.save(),$&&f.push($),p.push(c),$=s._$clipDepth,c=s._$shouldClip(l),c){const e=s._$startClip(t,l);if(!1===e){c=!1;continue}e instanceof Float32Array&&(u.push(l),l=e)}continue}const h=s._$maskId>-1&&m.has(s._$maskId)?m.get(s._$maskId):null;if(h){let e;if(h._$updated=!1,this._$instanceId===h._$parentId)e=l;else{e=g;let i=m.get(h._$parentId);for(;i||i._$instanceId!==i._$parentId;)e=Y(i._$matrix,e),i=m.get(i._$parentId);const r=se.scaleX,s=F(r,0,0,r,0,0);if(e=Y(s,e),R(s),t.isLayer){const i=t.getCurrentPosition();e[4]-=i.xMin,e[5]-=i.yMin}t.cacheBounds&&(e[4]-=t.cacheBounds.xMin,e[5]-=t.cacheBounds.yMin)}if(!h._$shouldClip(e))continue;const i=h._$startClip(t,e);if(t.save(),!1===i){t.restore();continue}if(i instanceof Float32Array){if(d.push(l),this!==h._$parent){const e=this._$matrix;i[0]=r.abs(l[0])*r.sign(e[0]),i[1]=r.abs(l[1])*r.sign(e[1]),i[2]=r.abs(l[2])*r.sign(e[2]),i[3]=r.abs(l[3])*r.sign(e[3]),i[4]=l[4]-t.cacheBounds.xMin,i[5]=l[5]-t.cacheBounds.yMin}l=i}}if(s._$draw(t,l,_),s._$updated=!1,h&&(t.restore(),t._$leaveClip(),d.length)){const t=d.pop();t&&(R(l),l=t)}}if($&&(t.restore(),p.pop()&&t._$leaveClip()),N(u),N(d),N(f),N(p),o.isFilter)return this._$postDraw(t,e,s,o);o.matrix!==e&&R(o.matrix),s!==i&&P(s),K(o)}_$getLayerBounds(t=null){let e=g;if(t){e=t;const i=this._$matrix;i!==g&&(e=Y(t,i))}const i=!!this._$recodes,s=this._$children;if(!s.length&&!i){const i=C(e[4],-e[4],e[5],-e[5]);return t&&e!==t&&R(e),i}const n=a.MAX_VALUE;let h=n,o=-n,l=n,_=-n;if(i){const t=C(this._$xMin,this._$xMax,this._$yMin,this._$yMax),i=z(t,e);S(t),h=+i.xMin,o=+i.xMax,l=+i.yMin,_=+i.yMax,S(i)}const c=se.instances;for(let t=0;t<s.length;++t){const i=s[t];if(!c.has(i))continue;const n=c.get(i)._$getLayerBounds(e);h=r.min(h,n.xMin),o=r.max(o,n.xMax),l=r.min(l,n.yMin),_=r.max(_,n.yMax),S(n)}if(t&&e!==t&&R(e),!t)return C(h,o,l,_);if(!this._$filters)return C(h,o,l,_);let $=C(h,o-h,l,_-l);for(let t=0;t<this._$filters.length;++t)$=this._$filters[t]._$generateFilterRect($,0,0);return h=$.xMin,o=$.xMin+$.xMax,l=$.yMin,_=$.yMin+$.yMax,S($),C(h,o,l,_)}_$getBounds(t=null){let e=g;if(t){e=t;const i=this._$matrix;1===i[0]&&0===i[1]&&0===i[2]&&1===i[3]&&0===i[4]&&0===i[5]||(e=Y(t,i))}const i=!!this._$recodes,s=this._$children;if(!s.length&&!i){const i=C(e[4],-e[4],e[5],-e[5]);return t&&e!==t&&R(e),i}const n=a.MAX_VALUE;let h=n,o=-n,l=n,_=-n;if(i){const t=C(this._$xMin,this._$xMax,this._$yMin,this._$yMax);S(t);const i=z(t,e);h=i.xMin,o=i.xMax,l=i.yMin,_=i.yMax,S(i)}const c=se.instances;for(let t=0;t<s.length;++t){const i=s[t];if(!c.has(i))continue;const n=c.get(i)._$getBounds(e);h=r.min(h,n.xMin),o=r.max(o,n.xMax),l=r.min(l,n.yMin),_=r.max(_,n.yMax),S(n)}return t&&e!==t&&R(e),C(h,o,l,_)}_$preDraw(t,e){let i=e;const s=this._$matrix;if(1===s[0]&&0===s[1]&&0===s[2]&&1===s[3]&&0===s[4]&&0===s[5]||(i=Y(e,s)),!i[0]&&!i[1]||!i[2]&&!i[3])return null;const n=m.pop()||{isFilter:!1,isUpdated:null,canApply:null,matrix:null,color:null,basePosition:{x:0,y:0},position:{dx:0,dy:0},baseMatrix:null,baseColor:null,blendMode:\"normal\",filters:null,layerWidth:0,layerHeight:0};n.matrix=i;const a=this._$blendMode;if(\"normal\"!==a||this._$filters&&this._$filters.length>0){const e=this._$getBounds(null),h=z(e,i);S(e);const o=+h.xMax,l=+h.xMin,_=+h.yMax,c=+h.yMin;S(h);const $=r.abs(o-l),u=r.abs(_-c);if(0>=$||0>=u)return K(n),null;if(0>l+$||0>c+u)return K(n),null;const d=t.frameBuffer.currentAttachment;if(!d||!d.texture||l>d.width||c>d.height)return K(n),null;n.basePosition.x=s[4],n.basePosition.y=s[5];const g=this._$getLayerBounds(null),f=z(g,i);let p=r.abs(f.xMax-f.xMin),m=r.abs(f.yMax-f.yMin);S(f);let x=i[4]-r.floor(l),b=i[5]-r.floor(c),v=r.floor(l),T=r.floor(c),A=l,M=c;if(p!==$||m!==u){const t=F(i[0],i[1],i[2],i[3],0,0),e=z(g,t);R(t),x+=-r.floor(e.xMin)-x,b+=-r.floor(e.yMin)-b,v-=-r.floor(e.xMin)-(i[4]-v),T-=-r.floor(e.yMin)-(i[5]-T),A-=-e.xMin-(i[4]-A),M-=-e.yMin-(i[5]-M),S(e)}if(S(g),n.position.dx=v>0?v:0,n.position.dy=T>0?T:0,p+A>d.texture.width&&(p-=p-d.texture.width+A),m+M>d.texture.height&&(m-=m-d.texture.height+M),0>v&&(x+=v,p+=A),0>T&&(b+=T,m+=M),0>=p||0>=m||!p||!m)return K(n),null;t._$startLayer(C(A,0,M,0)),n.canApply=this._$canApply(this._$filters);const y=this._$isFilterUpdated(p,m,i,this._$filters,n.canApply,n.basePosition.x,n.basePosition.y);t._$saveCurrentMask(),y&&t._$saveAttachment(r.ceil(p),r.ceil(m),!1),n.isFilter=!0,n.isUpdated=y,n.color=I(),n.baseMatrix=i,n.filters=this._$filters,n.blendMode=a,n.layerWidth=p,n.layerHeight=m,n.matrix=F(i[0],i[1],i[2],i[3],x,b)}return n}_$postDraw(t,e,i,r){const s=L(this._$instanceId,\"f\"),n=se.cacheStore,a=t.frameBuffer;let h;if(r.isUpdated){h=a.getTextureFromCurrentAttachment();const t=n.get(s);t&&(n.set(s,null),a.releaseTexture(t))}else if(h=n.get(s),!h)throw new Error(\"the texture is null.\");r.canApply||(h._$offsetX=0,h._$offsetY=0);let o=h._$offsetX,l=h._$offsetY;if(r.isUpdated&&r.canApply){const i=n.get(s);i&&(n.set(s,null),i.layerWidth=0,i.layerHeight=0,i._$offsetX=0,i._$offsetY=0,i.matrix=null,i.colorTransform=null,a.releaseTexture(i));const _=r.filters;if(_&&_.length){t._$offsetX=0,t._$offsetY=0;for(let i=0;i<_.length;++i)h=_[i]._$applyFilter(t,e);o=t._$offsetX,l=t._$offsetY,t._$offsetX=0,t._$offsetY=0,h._$offsetX=o,h._$offsetY=l}}if(r.isUpdated){h.filterState=r.canApply;const t=r.baseMatrix;t&&(h.matrix=`${t[0]}_${t[1]}_${t[2]}_${t[3]}`),h.layerWidth=r.layerWidth,h.layerHeight=r.layerHeight}n.set(s,h),N(s),r.isUpdated&&t._$restoreAttachment(),t.reset(),t.globalAlpha=V(i[3]+i[7]/255,0,1),t.globalCompositeOperation=r.blendMode,t.setTransform(1,0,0,1,0,0),t.drawImage(h,-o+r.position.dx,-l+r.position.dy,h.width,h.height,i),t._$endLayer(),t._$restoreCurrentMask(),r.baseMatrix!==e&&R(r.baseMatrix),R(r.matrix),K(r)}_$remove(){this._$children.length=0,this._$recodes=null,super._$remove(),he.push(this)}}class ut{constructor(){this._$rgb=\"rgb\",this._$mode=\"pad\",this._$type=\"linear\",this._$focalPointRatio=0,this._$points=F(),this._$stops=L()}dispose(){const t=this._$stops;for(let e=0;e<t.length;++e)B(t[e][1]);R(this._$points)}get mode(){return this._$mode}get type(){return this._$type}get rgb(){return this._$rgb}get points(){return this._$points}get focalPointRatio(){return this._$focalPointRatio}get stops(){return this._$stops.sort(((t,e)=>{switch(!0){case t[0]>e[0]:return 1;case e[0]>t[0]:return-1;default:return 0}})),this._$stops}linear(t,e,i,r,s=\"rgb\",n=\"pad\"){return this._$type=\"linear\",this._$points[0]=t,this._$points[1]=e,this._$points[2]=i,this._$points[3]=r,this._$rgb=s,this._$mode=n,this._$stops.length&&(this._$stops.length=0),this}radial(t,e,i,r,s,n,a=\"rgb\",h=\"pad\",o=0){return this._$type=\"radial\",this._$points[0]=t,this._$points[1]=e,this._$points[2]=i,this._$points[3]=r,this._$points[4]=s,this._$points[5]=n,this._$rgb=a,this._$mode=h,this._$focalPointRatio=V(o,-.975,.975,0),this._$stops.length&&(this._$stops.length=0),this}addColorStop(t,e){this._$stops.push(L(t,e))}}class dt{constructor(t,e,i,r){this._$context=t,this._$texture=e,this._$repeat=i,this._$colorTransform=r}dispose(){this._$context.frameBuffer.releaseTexture(this._$texture)}get texture(){return this._$texture}get repeat(){return this._$repeat}get colorTransform(){return this._$colorTransform}}class gt{constructor(){this._$fillStyle=w(1,1,1,1),this._$strokeStyle=w(1,1,1,1),this._$lineWidth=1,this._$lineCap=\"round\",this._$lineJoin=\"round\",this._$miterLimit=5}get miterLimit(){return this._$miterLimit}set miterLimit(t){this._$miterLimit=t}get lineWidth(){return this._$lineWidth}set lineWidth(t){this._$lineWidth=t}get lineCap(){return this._$lineCap}set lineCap(t){this._$lineCap=t}get lineJoin(){return this._$lineJoin}set lineJoin(t){this._$lineJoin=t}get fillStyle(){return this._$fillStyle}set fillStyle(t){this._$fillStyle instanceof h&&B(this._$fillStyle),this._$fillStyle=t}get strokeStyle(){return this._$strokeStyle}set strokeStyle(t){this._$strokeStyle instanceof h&&B(this._$strokeStyle),this._$strokeStyle=t}clear(){this._$lineWidth=1,this._$lineCap=\"round\",this._$lineJoin=\"round\",this._$miterLimit=5,this._$clearFill(),this._$clearStroke()}_$clearFill(){return this._$fillStyle instanceof ut||this._$fillStyle instanceof dt?(this._$fillStyle.dispose(),void(this._$fillStyle=w(1,1,1,1))):void this._$fillStyle.fill(1)}_$clearStroke(){return this._$strokeStyle instanceof ut||this._$strokeStyle instanceof dt?(this._$strokeStyle.dispose(),void(this._$strokeStyle=w(1,1,1,1))):void this._$strokeStyle.fill(1)}}class ft{constructor(t){this._$gl=t,this._$objectPool=[],this._$objectPoolArea=0,this._$activeTexture=-1,this._$boundTextures=[null,null,null],this._$maxWidth=0,this._$maxHeight=0,this._$gl.pixelStorei(this._$gl.UNPACK_ALIGNMENT,1),this._$gl.pixelStorei(this._$gl.UNPACK_FLIP_Y_WEBGL,!0)}_$createTexture(t,e){const i=this._$gl.createTexture();return i.width=0,i.height=0,i.area=0,i.dirty=!0,i.smoothing=!0,i._$offsetX=0,i._$offsetY=0,this.bind0(i,!1),this._$gl.texParameteri(this._$gl.TEXTURE_2D,this._$gl.TEXTURE_WRAP_S,this._$gl.CLAMP_TO_EDGE),this._$gl.texParameteri(this._$gl.TEXTURE_2D,this._$gl.TEXTURE_WRAP_T,this._$gl.CLAMP_TO_EDGE),i.width=t,i.height=e,i.area=t*e,i.dirty=!1,this._$gl.texStorage2D(this._$gl.TEXTURE_2D,1,this._$gl.RGBA8,t,e),i}_$getTexture(t,e){for(let i=0;i<this._$objectPool.length;i++){const r=this._$objectPool[i];if(r.width===t&&r.height===e)return this._$objectPool.splice(i,1),this._$objectPoolArea-=r.area,this.bind0(r,!1),r}return this._$createTexture(t,e)}create(t,e,i=null,r=!1,s=!0){const n=this._$getTexture(t,e);return r&&this._$gl.pixelStorei(this._$gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!0),s||this._$gl.pixelStorei(this._$gl.UNPACK_FLIP_Y_WEBGL,!1),n.width!==t||n.height!==e?(n.width=t,n.height=e,n.area=t*e,n.dirty=!1,this._$gl.texImage2D(this._$gl.TEXTURE_2D,0,this._$gl.RGBA,t,e,0,this._$gl.RGBA,this._$gl.UNSIGNED_BYTE,i)):i&&(n.dirty=!1,this._$gl.texSubImage2D(this._$gl.TEXTURE_2D,0,0,0,t,e,this._$gl.RGBA,this._$gl.UNSIGNED_BYTE,i)),r&&this._$gl.pixelStorei(this._$gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),s||this._$gl.pixelStorei(this._$gl.UNPACK_FLIP_Y_WEBGL,!0),n}createFromImage(t,e=!1){return this._$createFromElement(t.width,t.height,t,e)}createFromCanvas(t){return this._$createFromElement(t.width,t.height,t,!1)}createFromVideo(t,e=!1){return this._$createFromElement(t.videoWidth,t.videoHeight,t,e)}_$createFromElement(t,e,i,r=!1){const s=this._$getTexture(t,e);return s.dirty=!1,this.bind0(s,r),this._$gl.pixelStorei(this._$gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!0),s.width!==t||s.height!==e?(s.width=t,s.height=e,s.area=t*e,this._$gl.texImage2D(this._$gl.TEXTURE_2D,0,this._$gl.RGBA,this._$gl.RGBA,this._$gl.UNSIGNED_BYTE,i)):this._$gl.texSubImage2D(this._$gl.TEXTURE_2D,0,0,0,this._$gl.RGBA,this._$gl.UNSIGNED_BYTE,i),this._$gl.pixelStorei(this._$gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),s}release(t){if(t.area>this._$maxWidth*this._$maxHeight*2)this._$gl.deleteTexture(t);else if(t.dirty=!0,this._$objectPool.push(t),this._$objectPoolArea+=t.area,this._$objectPool.length&&this._$objectPoolArea>this._$maxWidth*this._$maxHeight*10){const t=this._$objectPool.shift();this._$objectPoolArea-=t.area,this._$gl.deleteTexture(t)}}bind0(t,e=null){this._$bindTexture(2,this._$gl.TEXTURE2,null,null),this._$bindTexture(1,this._$gl.TEXTURE1,null,null),this._$bindTexture(0,this._$gl.TEXTURE0,t,e)}bind01(t,e,i=null){this._$bindTexture(2,this._$gl.TEXTURE2,null,null),this._$bindTexture(1,this._$gl.TEXTURE1,e,i),this._$bindTexture(0,this._$gl.TEXTURE0,t,i)}bind012(t,e,i,r=null){this._$bindTexture(2,this._$gl.TEXTURE2,i,r),this._$bindTexture(1,this._$gl.TEXTURE1,e,null),this._$bindTexture(0,this._$gl.TEXTURE0,t,null)}bind02(t,e,i=null){this._$bindTexture(2,this._$gl.TEXTURE2,e,i),this._$bindTexture(1,this._$gl.TEXTURE1,null,null),this._$bindTexture(0,this._$gl.TEXTURE0,t,null)}_$bindTexture(t,e,i=null,r=null){const s=i!==this._$boundTextures[t],n=null!==r&&null!==i&&r!==i.smoothing;if((s||n||e===this._$gl.TEXTURE0)&&e!==this._$activeTexture&&(this._$activeTexture=e,this._$gl.activeTexture(e)),s&&(this._$boundTextures[t]=i,this._$gl.bindTexture(this._$gl.TEXTURE_2D,i)),n){i&&(i.smoothing=!!r);const t=r?this._$gl.LINEAR:this._$gl.NEAREST;this._$gl.texParameteri(this._$gl.TEXTURE_2D,this._$gl.TEXTURE_MIN_FILTER,t),this._$gl.texParameteri(this._$gl.TEXTURE_2D,this._$gl.TEXTURE_MAG_FILTER,t)}}}class pt{constructor(t){this._$gl=t,this._$objectPool=L(),this._$objectPoolArea=0,this._$maxWidth=0,this._$maxHeight=0}set maxWidth(t){this._$maxWidth=t}set maxHeight(t){this._$maxHeight=t}_$createStencilBuffer(){const t=this._$gl.createRenderbuffer();if(!t)throw new Error(\"the stencil buffer is null.\");return t.width=0,t.height=0,t.area=0,t.dirty=!0,t}_$getStencilBuffer(t,e){const i=this._$objectPool.length;for(let r=0;r<i;++r){const i=this._$objectPool[r];if(i.width===t&&i.height===e)return this._$objectPool.splice(r,1),this._$objectPoolArea-=i.area,i}if(i>100){const t=this._$objectPool.shift();if(t)return this._$objectPoolArea-=t.area,t}return this._$createStencilBuffer()}create(t,e){const i=this._$getStencilBuffer(t,e);return i.width===t&&i.height===e||(i.width=t,i.height=e,i.area=t*e,i.dirty=!1,this._$gl.bindRenderbuffer(this._$gl.RENDERBUFFER,i),this._$gl.renderbufferStorage(this._$gl.RENDERBUFFER,this._$gl.STENCIL_INDEX8,t,e)),i}release(t){if(t.area>this._$maxWidth*this._$maxHeight*2)this._$gl.deleteRenderbuffer(t);else if(t.dirty=!0,this._$objectPool.push(t),this._$objectPoolArea+=t.area,this._$objectPoolArea>this._$maxWidth*this._$maxHeight*10){const t=this._$objectPool.shift();t&&(this._$objectPoolArea-=t.area,this._$gl.deleteRenderbuffer(t))}}}class mt{constructor(t,e){this._$gl=t,this._$samples=e,this._$objectPool=L()}set samples(t){this._$samples=t}_$createColorBuffer(){const t=this._$gl.createRenderbuffer();if(!t)throw new Error(\"the color buffer is null.\");const e=this._$gl.createRenderbuffer();if(!e)throw new Error(\"the stencil buffer is null.\");return t.stencil=e,t.samples=0,t.width=0,t.height=0,t.area=0,t.dirty=!0,t}_$getColorBuffer(t){if(!this._$objectPool.length)return this._$createColorBuffer();const e=this._$bsearch(t);if(e<this._$objectPool.length){const t=this._$objectPool[e];return this._$objectPool.splice(e,1),t}const i=this._$objectPool.shift();if(!i)throw new Error(\"the color buffer is void.\");return i}create(t,e,i=0){t=r.max(256,D(t)),e=r.max(256,D(e));const s=this._$getColorBuffer(t*e);return i||(i=this._$samples),(s.width<t||s.height<e||s.samples!==i)&&(t=r.max(t,s.width),e=r.max(e,s.height),s.samples=i,s.width=t,s.height=e,s.area=t*e,s.dirty=!1,this._$gl.bindRenderbuffer(this._$gl.RENDERBUFFER,s),this._$gl.renderbufferStorageMultisample(this._$gl.RENDERBUFFER,i,this._$gl.RGBA8,t,e),this._$gl.bindRenderbuffer(this._$gl.RENDERBUFFER,s.stencil),this._$gl.renderbufferStorageMultisample(this._$gl.RENDERBUFFER,i,this._$gl.STENCIL_INDEX8,t,e)),s}release(t){t.dirty=!0;const e=this._$bsearch(t.area);this._$objectPool.splice(e,0,t)}_$bsearch(t){let e=-1,i=this._$objectPool.length;for(;r.abs(i-e)>1;){const s=r.floor((i+e)/2);t<=this._$objectPool[s].area?i=s:e=s}return i}}class xt{constructor(t,e){this._$gl=t,this._$objectPool=[],this._$frameBuffer=t.createFramebuffer(),t.bindFramebuffer(t.READ_FRAMEBUFFER,this._$frameBuffer),this._$frameBufferTexture=t.createFramebuffer(),this._$currentAttachment=null,this._$isBinding=!1,this._$textureManager=new ft(t),this._$stencilBufferPool=new pt(t),this._$colorBufferPool=new mt(t,e)}get currentAttachment(){return this._$currentAttachment}get textureManager(){return this._$textureManager}createCacheAttachment(t,e,i=!1,r=0){const s=this._$objectPool.pop()||{width:0,height:0,color:null,texture:null,msaa:!1,stencil:null,mask:!1,clipLevel:0,isActive:!1},n=this._$textureManager.create(t,e);return s.width=t,s.height=e,i?(s.color=this._$colorBufferPool.create(t,e,r),s.texture=n,s.msaa=!0,s.stencil=s.color.stencil):(s.color=n,s.texture=n,s.msaa=!1,s.stencil=this._$stencilBufferPool.create(t,e)),s.mask=!1,s.clipLevel=0,s.isActive=!0,s}setMaxSize(t,e){this._$stencilBufferPool._$maxWidth=t,this._$stencilBufferPool._$maxHeight=e,this._$textureManager._$maxWidth=t,this._$textureManager._$maxHeight=e}createTextureAttachment(t,e){const i=this._$objectPool.pop()||{width:0,height:0,color:null,texture:null,msaa:!1,stencil:null,mask:!1,clipLevel:0,isActive:!1},r=this._$textureManager.create(t,e);return i.width=t,i.height=e,i.color=r,i.texture=r,i.msaa=!1,i.stencil=null,i.mask=!1,i.clipLevel=0,i.isActive=!0,i}createTextureAttachmentFrom(t){const e=this._$objectPool.pop()||{width:0,height:0,color:null,texture:null,msaa:!1,stencil:null,mask:!1,clipLevel:0,isActive:!0};return e.width=t.width,e.height=t.height,e.color=t,e.texture=t,e.msaa=!1,e.stencil=null,e.mask=!1,e.clipLevel=0,e.isActive=!0,e}releaseAttachment(t=null,e=!1){t&&t.isActive&&(t.msaa?t.color instanceof WebGLRenderbuffer&&this._$colorBufferPool.release(t.color):t.stencil&&this._$stencilBufferPool.release(t.stencil),e&&t.texture&&this._$textureManager.release(t.texture),t.color=null,t.texture=null,t.stencil=null,t.isActive=!1,this._$objectPool.push(t))}bind(t){this._$currentAttachment=t,this._$isBinding||(this._$isBinding=!0,this._$gl.bindFramebuffer(this._$gl.FRAMEBUFFER,this._$frameBuffer)),t.msaa?t.color instanceof WebGLRenderbuffer&&(this._$gl.bindRenderbuffer(this._$gl.RENDERBUFFER,t.color),this._$gl.framebufferRenderbuffer(this._$gl.FRAMEBUFFER,this._$gl.COLOR_ATTACHMENT0,this._$gl.RENDERBUFFER,t.color)):t.color instanceof WebGLTexture&&(t.color&&this._$textureManager.bind0(t.color),this._$gl.framebufferTexture2D(this._$gl.FRAMEBUFFER,this._$gl.COLOR_ATTACHMENT0,this._$gl.TEXTURE_2D,t.color,0)),this._$gl.bindRenderbuffer(this._$gl.RENDERBUFFER,t.stencil),this._$gl.framebufferRenderbuffer(this._$gl.FRAMEBUFFER,this._$gl.STENCIL_ATTACHMENT,this._$gl.RENDERBUFFER,t.stencil)}unbind(){this._$currentAttachment=null,this._$isBinding&&(this._$isBinding=!1,this._$gl.bindFramebuffer(this._$gl.FRAMEBUFFER,null))}getTextureFromCurrentAttachment(){if(!this._$currentAttachment)throw new Error(\"the current attachment is null.\");if(!this._$currentAttachment.msaa&&this._$currentAttachment.texture)return this._$currentAttachment.texture;const t=this._$currentAttachment.width,e=this._$currentAttachment.height,i=this._$currentAttachment.texture;if(!i)throw new Error(\"the texture is null.\");return i.dirty=!1,this._$gl.bindFramebuffer(this._$gl.DRAW_FRAMEBUFFER,this._$frameBufferTexture),this._$textureManager.bind0(i),this._$gl.framebufferTexture2D(this._$gl.FRAMEBUFFER,this._$gl.COLOR_ATTACHMENT0,this._$gl.TEXTURE_2D,i,0),this._$gl.blitFramebuffer(0,0,t,e,0,0,t,e,this._$gl.COLOR_BUFFER_BIT,this._$gl.NEAREST),this._$gl.bindFramebuffer(this._$gl.FRAMEBUFFER,this._$frameBuffer),i}createTextureFromPixels(t,e,i=null,r=!1,s=!0){return this._$textureManager.create(t,e,i,r,s)}createTextureFromCanvas(t){return this._$textureManager.createFromCanvas(t)}createTextureFromImage(t,e=!1){return this._$textureManager.createFromImage(t,e)}createTextureFromVideo(t,e=!1){return this._$textureManager.createFromVideo(t,e)}createTextureFromCurrentAttachment(){if(!this._$currentAttachment)throw new Error(\"the current attachment is null.\");const t=this._$currentAttachment.width,e=this._$currentAttachment.height,i=this._$textureManager.create(t,e);return this._$textureManager.bind0(i),this._$gl.copyTexSubImage2D(this._$gl.TEXTURE_2D,0,0,0,0,0,t,e),i}releaseTexture(t){this._$textureManager.release(t)}}class bt{constructor(){this._$bezierConverterBuffer=new h(32)}cubicToQuad(t,e,i,r,s,n,a,h){this._$split2Cubic(t,e,i,r,s,n,a,h,0,16),this._$split2Cubic(this._$bezierConverterBuffer[0],this._$bezierConverterBuffer[1],this._$bezierConverterBuffer[2],this._$bezierConverterBuffer[3],this._$bezierConverterBuffer[4],this._$bezierConverterBuffer[5],this._$bezierConverterBuffer[6],this._$bezierConverterBuffer[7],0,8),this._$split2Cubic(this._$bezierConverterBuffer[16],this._$bezierConverterBuffer[17],this._$bezierConverterBuffer[18],this._$bezierConverterBuffer[19],this._$bezierConverterBuffer[20],this._$bezierConverterBuffer[21],this._$bezierConverterBuffer[22],this._$bezierConverterBuffer[23],16,24),this._$split2Quad(this._$bezierConverterBuffer[0],this._$bezierConverterBuffer[1],this._$bezierConverterBuffer[2],this._$bezierConverterBuffer[3],this._$bezierConverterBuffer[4],this._$bezierConverterBuffer[5],this._$bezierConverterBuffer[6],this._$bezierConverterBuffer[7],0),this._$split2Quad(this._$bezierConverterBuffer[8],this._$bezierConverterBuffer[9],this._$bezierConverterBuffer[10],this._$bezierConverterBuffer[11],this._$bezierConverterBuffer[12],this._$bezierConverterBuffer[13],this._$bezierConverterBuffer[14],this._$bezierConverterBuffer[15],8),this._$split2Quad(this._$bezierConverterBuffer[16],this._$bezierConverterBuffer[17],this._$bezierConverterBuffer[18],this._$bezierConverterBuffer[19],this._$bezierConverterBuffer[20],this._$bezierConverterBuffer[21],this._$bezierConverterBuffer[22],this._$bezierConverterBuffer[23],16),this._$split2Quad(this._$bezierConverterBuffer[24],this._$bezierConverterBuffer[25],this._$bezierConverterBuffer[26],this._$bezierConverterBuffer[27],this._$bezierConverterBuffer[28],this._$bezierConverterBuffer[29],this._$bezierConverterBuffer[30],this._$bezierConverterBuffer[31],24)}_$split2Cubic(t,e,i,r,s,n,a,h,o,l){const _=.125*(t+3*(i+s)+a),c=.125*(e+3*(r+n)+h),$=.125*(a+s-i-t),u=.125*(h+n-r-e);this._$bezierConverterBuffer[o]=t,this._$bezierConverterBuffer[o+1]=e,this._$bezierConverterBuffer[o+2]=.5*(t+i),this._$bezierConverterBuffer[o+3]=.5*(e+r),this._$bezierConverterBuffer[o+4]=_-$,this._$bezierConverterBuffer[o+5]=c-u,this._$bezierConverterBuffer[o+6]=_,this._$bezierConverterBuffer[o+7]=c,this._$bezierConverterBuffer[l]=_,this._$bezierConverterBuffer[l+1]=c,this._$bezierConverterBuffer[l+2]=_+$,this._$bezierConverterBuffer[l+3]=c+u,this._$bezierConverterBuffer[l+4]=.5*(s+a),this._$bezierConverterBuffer[l+5]=.5*(n+h),this._$bezierConverterBuffer[l+6]=a,this._$bezierConverterBuffer[l+7]=h}_$split2Quad(t,e,i,r,s,n,a,h,o){const l=.125*(t+3*(i+s)+a),_=.125*(e+3*(r+n)+h);this._$bezierConverterBuffer[o]=.25*t+.75*i,this._$bezierConverterBuffer[o+1]=.25*e+.75*r,this._$bezierConverterBuffer[o+2]=l,this._$bezierConverterBuffer[o+3]=_,this._$bezierConverterBuffer[o+4]=.75*s+.25*a,this._$bezierConverterBuffer[o+5]=.75*n+.25*h,this._$bezierConverterBuffer[o+6]=a,this._$bezierConverterBuffer[o+7]=h}}class vt{constructor(){this._$currentPath=L(),this._$vertices=L(),this._$bezierConverter=new bt}get vertices(){return this._$pushCurrentPathToVertices(),this._$vertices}begin(){for(this._$currentPath.length=0;this._$vertices.length;)N(this._$vertices.pop())}moveTo(t,e){this._$currentPath.length?this._$equalsToLastPoint(t,e)||(this._$pushCurrentPathToVertices(),this._$pushPointToCurrentPath(t,e,!1)):this._$pushPointToCurrentPath(t,e,!1)}lineTo(t,e){this._$currentPath.length||this.moveTo(0,0),this._$equalsToLastPoint(t,e)||this._$pushPointToCurrentPath(t,e,!1)}quadTo(t,e,i,r){this._$currentPath.length||this.moveTo(0,0),this._$equalsToLastPoint(i,r)||(this._$pushPointToCurrentPath(t,e,!0),this._$pushPointToCurrentPath(i,r,!1))}cubicTo(t,e,i,r,s,n){if(this._$currentPath.length||this.moveTo(0,0),this._$equalsToLastPoint(s,n))return;const a=+this._$currentPath[this._$currentPath.length-3],h=+this._$currentPath[this._$currentPath.length-2];this._$bezierConverter.cubicToQuad(a,h,t,e,i,r,s,n);const o=this._$bezierConverter._$bezierConverterBuffer;for(let t=0;t<32;)this.quadTo(o[t++],o[t++],o[t++],o[t++])}drawCircle(t,e,i){const r=i,s=.5522847498307936*i;this.cubicTo(t+r,e+s,t+s,e+r,t,e+r),this.cubicTo(t-s,e+r,t-r,e+s,t-r,e),this.cubicTo(t-r,e-s,t-s,e-r,t,e-r),this.cubicTo(t+s,e-r,t+r,e-s,t+r,e)}close(){if(this._$currentPath.length<=6)return;const t=+this._$currentPath[0],e=+this._$currentPath[1];this._$equalsToLastPoint(t,e)||this._$pushPointToCurrentPath(t,e,!1)}_$equalsToLastPoint(t,e){const i=+this._$currentPath[this._$currentPath.length-3],r=+this._$currentPath[this._$currentPath.length-2];return t===i&&e===r}_$pushPointToCurrentPath(t,e,i){this._$currentPath.push(t,e,i)}_$pushCurrentPathToVertices(){this._$currentPath.length<4?this._$currentPath.length=0:(this._$vertices.push(this._$currentPath),this._$currentPath=L())}createRectVertices(t,e,i,r){return L(L(t,e,!1,t+i,e,!1,t+i,e+r,!1,t,e+r,!1))}}class Tt{constructor(){this.enabled=!1,this.parentMatrixA=1,this.parentMatrixB=0,this.parentMatrixC=0,this.parentMatrixD=0,this.parentMatrixE=1,this.parentMatrixF=0,this.parentMatrixG=0,this.parentMatrixH=0,this.parentMatrixI=1,this.ancestorMatrixA=1,this.ancestorMatrixB=0,this.ancestorMatrixC=0,this.ancestorMatrixD=0,this.ancestorMatrixE=1,this.ancestorMatrixF=0,this.ancestorMatrixG=0,this.ancestorMatrixH=0,this.ancestorMatrixI=1,this.parentViewportX=0,this.parentViewportY=0,this.parentViewportW=0,this.parentViewportH=0,this.minXST=1e-5,this.minYST=1e-5,this.minXPQ=1e-5,this.minYPQ=1e-5,this.maxXST=.99999,this.maxYST=.99999,this.maxXPQ=.99999,this.maxYPQ=.99999}enable(t,e,i,s,n,a,h,o,l,_,c,$,u,d,g,f,p,m,x){const b=n.xMax-n.xMin,v=n.yMax-n.yMin,T=a.w,A=a.h,M=r.abs(r.ceil(b*h)),y=r.abs(r.ceil(v*h)),E=T>0?(a.x-n.xMin)/b:1e-5,C=A>0?(a.y-n.yMin)/v:1e-5,S=T>0?(a.x+a.w-n.xMin)/b:.99999,w=A>0?(a.y+a.h-n.yMin)/v:.99999;let B=M*E/i,F=y*C/s,R=(i-M*(1-S))/i,I=(s-y*(1-w))/s;if(B>=R){const t=E/(E+(1-S));B=r.max(t-1e-5,0),R=r.min(t+1e-5,1)}if(F>=I){const t=C/(C+(1-w));F=r.max(t-1e-5,0),I=r.min(t+1e-5,1)}this.enabled=!0,this.parentMatrixA=o,this.parentMatrixB=l,this.parentMatrixD=_,this.parentMatrixE=c,this.parentMatrixG=$,this.parentMatrixH=u,this.ancestorMatrixA=d,this.ancestorMatrixB=g,this.ancestorMatrixD=f,this.ancestorMatrixE=p,this.ancestorMatrixG=m,this.ancestorMatrixH=x,this.parentViewportX=t,this.parentViewportY=e,this.parentViewportW=i,this.parentViewportH=s,this.minXST=E,this.minYST=C,this.minXPQ=B,this.minYPQ=F,this.maxXST=S,this.maxYST=w,this.maxXPQ=R,this.maxYPQ=I}disable(){this.enabled=!1}}class At{constructor(t,e){this._$gl=t,this._$array=[],this._$map=O();const i=this._$gl.getProgramParameter(e,this._$gl.ACTIVE_UNIFORMS);for(let t=0;t<i;t++){const i=this._$gl.getActiveUniform(e,t);if(!i)throw new Error(\"the WebGLActiveInfo is null.\");const r=i.name.endsWith(\"[0]\")?i.name.slice(0,-3):i.name,s=this._$gl.getUniformLocation(e,r);if(!s)throw new Error(\"the WebGLUniformLocation is null.\");if(i.type===this._$gl.SAMPLER_2D&&1===i.size)continue;const n={};switch(i.type){case this._$gl.FLOAT_VEC4:n.method=this._$gl.uniform4fv.bind(this._$gl,s),n.array=new h(4*i.size),n.assign=-1;break;case this._$gl.INT_VEC4:n.method=this._$gl.uniform4iv.bind(this._$gl,s),n.array=new o(4*i.size),n.assign=-1;break;case this._$gl.SAMPLER_2D:n.method=this._$gl.uniform1iv.bind(this._$gl,s),n.array=new o(i.size),n.assign=1;break;case this._$gl.FLOAT:case this._$gl.FLOAT_VEC2:case this._$gl.FLOAT_VEC3:case this._$gl.FLOAT_MAT2:case this._$gl.FLOAT_MAT3:case this._$gl.FLOAT_MAT4:case this._$gl.INT:case this._$gl.INT_VEC2:case this._$gl.INT_VEC3:default:throw new Error(\"Use gl.FLOAT_VEC4 or gl.INT_VEC4 instead\")}this._$array.push(n),this._$map.set(r,n)}}getArray(t){const e=this._$map.get(t);if(!e||!e.array)throw new Error(\"the UniformData is null.\");return e.array}get textures(){const t=this._$map.get(\"u_textures\");if(!t||!t.array)throw new Error(\"the UniformData is null.\");return t.array}get highp(){const t=this._$map.get(\"u_highp\");if(!t||!t.array)throw new Error(\"the UniformData is null.\");return t.array}get mediump(){const t=this._$map.get(\"u_mediump\");if(!t||!t.array)throw new Error(\"the UniformData is null.\");return t.array}get integer(){const t=this._$map.get(\"u_integer\");if(!t||!t.array)throw new Error(\"the UniformData is null.\");return t.array}bindUniforms(){const t=this._$array.length;for(let e=0;e<t;e++){const t=this._$array[e];void 0!==t.method&&void 0!==t.assign&&(t.assign<0?t.method(t.array):t.assign>0&&(t.assign--,t.method(t.array)))}}}class Mt{constructor(t,e,i,r){this._$gl=t,this._$context=e,this._$program=this._$createProgram(i,r),this._$uniform=new At(t,this._$program)}get uniform(){return this._$uniform}_$createProgram(e,i){const r=this._$gl.createProgram();if(!r)throw new Error(\"WebGL program error\");r.id=t++;const s=this._$gl.createShader(this._$gl.VERTEX_SHADER);if(!s)throw new Error(\"WebGL vertex shader error\");this._$gl.shaderSource(s,e),this._$gl.compileShader(s);const n=this._$gl.createShader(this._$gl.FRAGMENT_SHADER);if(!n)throw new Error(\"WebGL fragment shader error\");return this._$gl.shaderSource(n,i),this._$gl.compileShader(n),this._$gl.attachShader(r,s),this._$gl.attachShader(r,n),this._$gl.linkProgram(r),this._$gl.detachShader(r,s),this._$gl.detachShader(r,n),this._$gl.deleteShader(s),this._$gl.deleteShader(n),r}_$attachProgram(){const t=this._$context.shaderList;t.currentProgramId!==this._$program.id&&(t.currentProgramId=this._$program.id,this._$gl.useProgram(this._$program))}_$drawImage(){this._$attachProgram(),this._$uniform.bindUniforms(),this._$context.vao.bindCommonVertexArray(),this._$gl.drawArrays(this._$gl.TRIANGLE_STRIP,0,4)}_$drawGradient(t,e){this._$attachProgram(),this._$uniform.bindUniforms(),this._$context.vao.bindGradientVertexArray(t,e),this._$gl.drawArrays(this._$gl.TRIANGLE_STRIP,0,4)}_$stroke(t){this._$attachProgram(),this._$context.blend.reset(),this._$uniform.bindUniforms(),this._$context.vao.bind(t),this._$gl.drawElements(this._$gl.TRIANGLES,t.indexCount,this._$gl.UNSIGNED_SHORT,0)}_$fill(t){this._$attachProgram(),this._$context.blend.reset(),this._$uniform.bindUniforms(),this._$context.vao.bind(t);const e=t.indexRanges,i=e[e.length-1],r=i.first+i.count;this._$gl.drawArrays(this._$gl.TRIANGLES,0,r)}_$containerClip(t,e,i){this._$attachProgram(),this._$context.blend.reset(),this._$uniform.bindUniforms(),this._$context.vao.bind(t),this._$gl.drawArrays(this._$gl.TRIANGLES,e,i)}_$drawPoints(t,e,i){this._$attachProgram(),this._$uniform.bindUniforms(),this._$context.vao.bind(t),this._$gl.drawArrays(this._$gl.POINTS,e,i)}}class yt{static FUNCTION_GRID_OFF(){return\"\\n\\nvec2 applyMatrix(in vec2 vertex) {\\n    mat3 matrix = mat3(\\n        u_highp[0].xyz,\\n        u_highp[1].xyz,\\n        u_highp[2].xyz\\n    );\\n\\n    vec2 position = (matrix * vec3(vertex, 1.0)).xy;\\n\\n    return position;\\n}\\n\\n\"}static FUNCTION_GRID_ON(t){return`\\n\\nvec2 applyMatrix(in vec2 vertex) {\\n    mat3 parent_matrix = mat3(\\n        u_highp[${t}].xyz,\\n        u_highp[${t+1}].xyz,\\n        u_highp[${t+2}].xyz\\n    );\\n    mat3 ancestor_matrix = mat3(\\n        u_highp[${t+3}].xyz,\\n        u_highp[${t+4}].xyz,\\n        u_highp[${t+5}].xyz\\n    );\\n    vec2 parent_offset = vec2(u_highp[${t+2}].w, u_highp[${t+3}].w);\\n    vec2 parent_size   = vec2(u_highp[${t+4}].w, u_highp[${t+5}].w);\\n    vec4 grid_min = u_highp[${t+6}];\\n    vec4 grid_max = u_highp[${t+7}];\\n\\n    vec2 position = (parent_matrix * vec3(vertex, 1.0)).xy;\\n    position = (position - parent_offset) / parent_size;\\n\\n    vec4 ga = grid_min;\\n    vec4 gb = grid_max  - grid_min;\\n    vec4 gc = vec4(1.0) - grid_max;\\n\\n    vec2 pa = position;\\n    vec2 pb = position - grid_min.st;\\n    vec2 pc = position - grid_max.st;\\n\\n    position = (ga.pq / ga.st) * min(pa, ga.st)\\n             + (gb.pq / gb.st) * clamp(pb, vec2(0.0), gb.st)\\n             + (gc.pq / gc.st) * max(vec2(0.0), pc);\\n\\n    position = position * parent_size + parent_offset;\\n    position = (ancestor_matrix * vec3(position, 1.0)).xy;\\n\\n    return position;\\n}\\n\\n`}}class Et{static TEMPLATE(t,e,i,r){const s=e-1,n=i?this.VARYING_UV_ON():\"\",a=i?this.STATEMENT_UV_ON():\"\";return`#version 300 es\\n\\nlayout (location = 0) in vec2 a_vertex;\\nlayout (location = 1) in vec2 a_option1;\\nlayout (location = 2) in vec2 a_option2;\\nlayout (location = 3) in float a_type;\\n\\nuniform vec4 u_highp[${t}];\\n\\n${n}\\n\\n${r?yt.FUNCTION_GRID_ON(i?5:0):yt.FUNCTION_GRID_OFF()}\\n\\nfloat crossVec2(in vec2 v1, in vec2 v2) {\\n    return v1.x * v2.y - v2.x * v1.y;\\n}\\n\\nvec2 perpendicularVec2(in vec2 v1) {\\n    float face = u_highp[${s}][1];\\n\\n    return face * vec2(v1.y, -v1.x);\\n}\\n\\nvec2 calculateNormal(in vec2 direction) {\\n    vec2 normalized = normalize(direction);\\n    return perpendicularVec2(normalized);\\n}\\n\\nvec2 calculateIntersection(in vec2 v1, in vec2 v2, in vec2 o1, in vec2 o2) {\\n    float t = crossVec2(o2 - o1, v2) / crossVec2(v1, v2);\\n    return (o1 + t * v1);\\n}\\n\\nvec2 calculateAnchor(in vec2 position, in float convex, out vec2 v1, out vec2 v2, out vec2 o1, out vec2 o2) {\\n    float miter_limit = u_highp[${s}][2];\\n\\n    vec2 a = applyMatrix(a_option1);\\n    vec2 b = applyMatrix(a_option2);\\n\\n    v1 = convex * (position - a);\\n    v2 = convex * (b - position);\\n    o1 = calculateNormal(v1) + a;\\n    o2 = calculateNormal(v2) + position;\\n\\n    vec2 anchor = calculateIntersection(v1, v2, o1, o2) - position;\\n    return normalize(anchor) * min(length(anchor), miter_limit);\\n}\\n\\nvoid main() {\\n    vec2 viewport = vec2(u_highp[0].w, u_highp[1].w);\\n    float half_width = u_highp[${s}][0];\\n\\n    vec2 position = applyMatrix(a_vertex);\\n    vec2 offset = vec2(0.0);\\n    vec2 v1, v2, o1, o2;\\n\\n    if (a_type == 1.0 || a_type == 2.0) { // 線分\\n        offset = calculateNormal(a_option2 * (applyMatrix(a_option1) - position));\\n    } else if (a_type == 10.0) { // スクエア線端\\n        offset = normalize(position - applyMatrix(a_option1));\\n        offset += a_option2 * perpendicularVec2(offset);\\n    } else if (a_type == 21.0) { // マイター結合（線分Bの凸側）\\n        offset = calculateAnchor(position, 1.0, v1, v2, o1, o2);\\n        offset = calculateIntersection(v2, perpendicularVec2(offset), o2, position + offset) - position;\\n    } else if (a_type == 22.0) { // マイター結合（線分Aの凸側）\\n        offset = calculateAnchor(position, 1.0, v1, v2, o1, o2);\\n        offset = calculateIntersection(v1, perpendicularVec2(offset), o1, position + offset) - position;\\n    } else if (a_type == 23.0) { // マイター結合（線分Aの凹側）\\n        offset = calculateAnchor(position, -1.0, v1, v2, o1, o2);\\n        offset = calculateIntersection(v1, perpendicularVec2(offset), o1, position + offset) - position;\\n    } else if (a_type == 24.0) { // マイター結合（線分Bの凹側）\\n        offset = calculateAnchor(position, -1.0, v1, v2, o1, o2);\\n        offset = calculateIntersection(v2, perpendicularVec2(offset), o2, position + offset) - position;\\n    } else if (a_type >= 30.0) { // ラウンド結合\\n        float face = u_highp[${s}][1];\\n        float rad = face * (a_type - 30.0) * 0.3488888889; /* 0.3488888889 = PI / 9.0 */\\n        offset = mat2(cos(rad), sin(rad), -sin(rad), cos(rad)) * vec2(1.0, 0.0);\\n    }\\n    \\n    offset *= half_width;\\n    position += offset;\\n    ${a}\\n\\n    position /= viewport;\\n    position = position * 2.0 - 1.0;\\n    gl_Position = vec4(position.x, -position.y, 0.0, 1.0);\\n}\\n\\n`}static VARYING_UV_ON(){return\"\\nout vec2 v_uv;\\n\"}static STATEMENT_UV_ON(){return\"\\n    mat3 uv_matrix = mat3(\\n        u_highp[0].xyz,\\n        u_highp[1].xyz,\\n        u_highp[2].xyz\\n    );\\n    mat3 inverse_matrix = mat3(\\n        u_highp[3].xyz,\\n        u_highp[4].xyz,\\n        vec3(u_highp[2].w, u_highp[3].w, u_highp[4].w)\\n    );\\n\\n    v_uv = (uv_matrix * vec3(a_vertex, 1.0)).xy;\\n    v_uv += offset;\\n    v_uv = (inverse_matrix * vec3(v_uv, 1.0)).xy;\\n\"}}class Ct{static TEMPLATE(t,e,i,r){const s=i?this.ATTRIBUTE_BEZIER_ON():\"\",n=i?this.VARYING_BEZIER_ON():e?this.VARYING_UV_ON():\"\",a=i?this.STATEMENT_BEZIER_ON():e?this.STATEMENT_UV_ON():\"\";return`#version 300 es\\n\\nlayout (location = 0) in vec2 a_vertex;\\n${s}\\n\\nuniform vec4 u_highp[${t}];\\n\\n${n}\\n\\n${r?yt.FUNCTION_GRID_ON(e?5:0):yt.FUNCTION_GRID_OFF()}\\n\\nvoid main() {\\n    vec2 viewport = vec2(u_highp[0].w, u_highp[1].w);\\n\\n    ${a}\\n\\n    vec2 pos = applyMatrix(a_vertex) / viewport;\\n    pos = pos * 2.0 - 1.0;\\n    gl_Position = vec4(pos.x, -pos.y, 0.0, 1.0);\\n}\\n\\n`}static ATTRIBUTE_BEZIER_ON(){return\"\\nlayout (location = 1) in vec2 a_bezier;\\n\"}static VARYING_UV_ON(){return\"\\nout vec2 v_uv;\\n\"}static VARYING_BEZIER_ON(){return\"\\nout vec2 v_bezier;\\n\"}static STATEMENT_UV_ON(){return\"\\n    mat3 uv_matrix = mat3(\\n        u_highp[0].xyz,\\n        u_highp[1].xyz,\\n        u_highp[2].xyz\\n    );\\n    mat3 inverse_matrix = mat3(\\n        u_highp[3].xyz,\\n        u_highp[4].xyz,\\n        vec3(u_highp[2].w, u_highp[3].w, u_highp[4].w)\\n    );\\n\\n    v_uv = (inverse_matrix * uv_matrix * vec3(a_vertex, 1.0)).xy;\\n\"}static STATEMENT_BEZIER_ON(){return\"\\n    v_bezier = a_bezier;\\n\"}}class St{static FUNCTION_IS_INSIDE(){return\"\\n\\nfloat isInside(in vec2 uv) {\\n    return step(4.0, dot(step(vec4(0.0, uv.x, 0.0, uv.y), vec4(uv.x, 1.0, uv.y, 1.0)), vec4(1.0)));\\n}\\n\\n\"}static STATEMENT_COLOR_TRANSFORM_ON(t){return`\\n    vec4 mul = u_mediump[${t}];\\n    vec4 add = u_mediump[${t+1}];\\n\\n    src.rgb /= max(0.0001, src.a);\\n    src = clamp(src * mul + add, 0.0, 1.0);\\n    src.rgb *= src.a;\\n`}}class wt{static SOLID_COLOR(){return\"#version 300 es\\nprecision mediump float;\\n\\nuniform vec4 u_mediump;\\n\\nout vec4 o_color;\\n\\nvoid main() {\\n    o_color = vec4(u_mediump.rgb * u_mediump.a, u_mediump.a);\\n}\\n\\n\"}static BITMAP_CLIPPED(){return`#version 300 es\\nprecision mediump float;\\n\\nuniform sampler2D u_texture;\\nuniform vec4 u_mediump[3];\\n\\nin vec2 v_uv;\\nout vec4 o_color;\\n\\nvoid main() {\\n    vec2 uv = vec2(v_uv.x, u_mediump[0].y - v_uv.y) / u_mediump[0].xy;\\n\\n    vec4 src = texture(u_texture, uv);\\n    ${St.STATEMENT_COLOR_TRANSFORM_ON(1)}\\n    o_color = src;\\n}`}static BITMAP_PATTERN(){return`#version 300 es\\nprecision mediump float;\\n\\nuniform sampler2D u_texture;\\nuniform vec4 u_mediump[3];\\n\\nin vec2 v_uv;\\nout vec4 o_color;\\n\\nvoid main() {\\n    vec2 uv = fract(vec2(v_uv.x, -v_uv.y) / u_mediump[0].xy);\\n    \\n    vec4 src = texture(u_texture, uv);\\n    ${St.STATEMENT_COLOR_TRANSFORM_ON(1)}\\n    o_color = src;\\n}`}static MASK(){return\"#version 300 es\\nprecision mediump float;\\n\\nin vec2 v_bezier;\\nout vec4 o_color;\\n\\nvoid main() {\\n    vec2 px = dFdx(v_bezier);\\n    vec2 py = dFdy(v_bezier);\\n\\n    vec2 f = (2.0 * v_bezier.x) * vec2(px.x, py.x) - vec2(px.y, py.y);\\n    float alpha = 0.5 - (v_bezier.x * v_bezier.x - v_bezier.y) / length(f);\\n\\n    if (alpha > 0.0) {\\n        o_color = vec4(min(alpha, 1.0));\\n    } else {\\n        discard;\\n    }    \\n}\\n\\n\"}}class Bt{constructor(t,e){this._$context=t,this._$gl=e,this._$collection=O()}getSolidColorShapeShader(t,e){const i=`s${t?\"y\":\"n\"}${e?\"y\":\"n\"}`;if(this._$collection.has(i)){const t=this._$collection.get(i);if(t)return t}const r=(e?8:3)+(t?1:0),s=r;let n;n=t?Et.TEMPLATE(r,s,!1,e):Ct.TEMPLATE(r,!1,!1,e);const a=new Mt(this._$gl,this._$context,n,wt.SOLID_COLOR());return this._$collection.set(i,a),a}getBitmapShapeShader(t,e,i){const r=`b${t?\"y\":\"n\"}${e?\"y\":\"n\"}${i?\"y\":\"n\"}`;if(this._$collection.has(r)){const t=this._$collection.get(r);if(t)return t}const s=(i?13:5)+(t?1:0),n=s;let a;a=t?Et.TEMPLATE(s,n,!0,i):Ct.TEMPLATE(s,!0,!1,i);const h=e?wt.BITMAP_PATTERN():wt.BITMAP_CLIPPED(),o=new Mt(this._$gl,this._$context,a,h);return this._$collection.set(r,o),o}getMaskShapeShader(t,e){const i=`m${t?\"y\":\"n\"}${e?\"y\":\"n\"}`;if(this._$collection.has(i)){const t=this._$collection.get(i);if(t)return t}const r=(e?8:3)+(t?1:0),s=r;let n;n=t?Et.TEMPLATE(r,s,!1,e):Ct.TEMPLATE(r,!1,!0,e);const a=new Mt(this._$gl,this._$context,n,wt.MASK());return this._$collection.set(i,a),a}setSolidColorShapeUniform(t,e,i,r,s,n,a,h,o,l,_,c){const $=t.highp;let u;n?($[0]=l.parentMatrixA,$[1]=l.parentMatrixB,$[2]=l.parentMatrixC,$[4]=l.parentMatrixD,$[5]=l.parentMatrixE,$[6]=l.parentMatrixF,$[8]=l.parentMatrixG,$[9]=l.parentMatrixH,$[10]=l.parentMatrixI,$[12]=l.ancestorMatrixA,$[13]=l.ancestorMatrixB,$[14]=l.ancestorMatrixC,$[16]=l.ancestorMatrixD,$[17]=l.ancestorMatrixE,$[18]=l.ancestorMatrixF,$[20]=l.ancestorMatrixG,$[21]=l.ancestorMatrixH,$[22]=l.ancestorMatrixI,$[3]=h,$[7]=o,$[11]=l.parentViewportX,$[15]=l.parentViewportY,$[19]=l.parentViewportW,$[23]=l.parentViewportH,$[24]=l.minXST,$[25]=l.minYST,$[26]=l.minXPQ,$[27]=l.minYPQ,$[28]=l.maxXST,$[29]=l.maxYST,$[30]=l.maxXPQ,$[31]=l.maxYPQ,u=32):($[0]=a[0],$[1]=a[1],$[2]=a[2],$[4]=a[3],$[5]=a[4],$[6]=a[5],$[8]=a[6],$[9]=a[7],$[10]=a[8],$[3]=h,$[7]=o,u=12),e&&($[u]=i,$[u+1]=r,$[u+2]=s);const d=t.mediump;d[0]=_[0],d[1]=_[1],d[2]=_[2],d[3]=_[3]*c}setBitmapShapeUniform(t,e,i,r,s,n,a,h,o,l,_,c,$,u,d,g,f,p,m,x,b){const v=t.highp;let T;v[0]=a[0],v[1]=a[1],v[2]=a[2],v[4]=a[3],v[5]=a[4],v[6]=a[5],v[8]=a[6],v[9]=a[7],v[10]=a[8],v[12]=h[0],v[13]=h[1],v[14]=h[2],v[16]=h[3],v[17]=h[4],v[18]=h[5],v[11]=h[6],v[15]=h[7],v[19]=h[8],v[3]=o,v[7]=l,T=20,n&&(v[T]=_.parentMatrixA,v[T+1]=_.parentMatrixB,v[T+2]=_.parentMatrixC,v[T+4]=_.parentMatrixD,v[T+5]=_.parentMatrixE,v[T+6]=_.parentMatrixF,v[T+8]=_.parentMatrixG,v[T+9]=_.parentMatrixH,v[T+10]=_.parentMatrixI,v[T+12]=_.ancestorMatrixA,v[T+13]=_.ancestorMatrixB,v[T+14]=_.ancestorMatrixC,v[T+16]=_.ancestorMatrixD,v[T+17]=_.ancestorMatrixE,v[T+18]=_.ancestorMatrixF,v[T+20]=_.ancestorMatrixG,v[T+21]=_.ancestorMatrixH,v[T+22]=_.ancestorMatrixI,v[T+11]=_.parentViewportX,v[T+15]=_.parentViewportY,v[T+19]=_.parentViewportW,v[T+23]=_.parentViewportH,v[T+24]=_.minXST,v[T+25]=_.minYST,v[T+26]=_.minXPQ,v[T+27]=_.minYPQ,v[T+28]=_.maxXST,v[T+29]=_.maxYST,v[T+30]=_.maxXPQ,v[T+31]=_.maxYPQ,T=52),e&&(v[T]=i,v[T+1]=r,v[T+2]=s);const A=t.mediump;A[0]=c,A[1]=$,A[4]=u,A[5]=d,A[6]=g,A[7]=f,A[8]=p,A[9]=m,A[10]=x,A[11]=b}setMaskShapeUniform(t,e,i,r,s,n,a,h,o,l,_,c,$,u=null){const d=t.highp;e&&u?(d[0]=u.parentMatrixA,d[1]=u.parentMatrixB,d[2]=u.parentMatrixC,d[4]=u.parentMatrixD,d[5]=u.parentMatrixE,d[6]=u.parentMatrixF,d[8]=u.parentMatrixG,d[9]=u.parentMatrixH,d[10]=u.parentMatrixI,d[12]=u.ancestorMatrixA,d[13]=u.ancestorMatrixB,d[14]=u.ancestorMatrixC,d[16]=u.ancestorMatrixD,d[17]=u.ancestorMatrixE,d[18]=u.ancestorMatrixF,d[20]=u.ancestorMatrixG,d[21]=u.ancestorMatrixH,d[22]=u.ancestorMatrixI,d[3]=c,d[7]=$,d[11]=u.parentViewportX,d[15]=u.parentViewportY,d[19]=u.parentViewportW,d[23]=u.parentViewportH,d[24]=u.minXST,d[25]=u.minYST,d[26]=u.minXPQ,d[27]=u.minYPQ,d[28]=u.maxXST,d[29]=u.maxYST,d[30]=u.maxXPQ,d[31]=u.maxYPQ):(d[0]=i,d[1]=r,d[2]=s,d[4]=n,d[5]=a,d[6]=h,d[8]=o,d[9]=l,d[10]=_,d[3]=c,d[7]=$)}setMaskShapeUniformIdentity(t,e,i){const r=t.highp;r[0]=1,r[1]=0,r[2]=0,r[4]=0,r[5]=1,r[6]=0,r[8]=0,r[9]=0,r[10]=1,r[3]=e,r[7]=i}}class Ft{static TEMPLATE(t,e,i,r,s){const n=i?this.STATEMENT_GRADIENT_TYPE_RADIAL(e,r):this.STATEMENT_GRADIENT_TYPE_LINEAR(e);let a;switch(s){case\"reflect\":a=\"1.0 - abs(fract(t * 0.5) * 2.0 - 1.0)\";break;case\"repeat\":a=\"fract(t)\";break;default:a=\"clamp(t, 0.0, 1.0)\"}return`#version 300 es\\nprecision highp float;\\n\\nuniform sampler2D u_texture;\\nuniform vec4 u_highp[${t}];\\n\\nin vec2 v_uv;\\nout vec4 o_color;\\n\\nvoid main() {\\n    vec2 p = v_uv;\\n    ${n}\\n    t = ${a};\\n    o_color = texture(u_texture, vec2(t, 0.5));\\n}\\n\\n`}static STATEMENT_GRADIENT_TYPE_LINEAR(t){return`\\n    vec2 a = u_highp[${t}].xy;\\n    vec2 b = u_highp[${t}].zw;\\n\\n    vec2 ab = b - a;\\n    vec2 ap = p - a;\\n\\n    float t = dot(ab, ap) / dot(ab, ab);\\n`}static STATEMENT_GRADIENT_TYPE_RADIAL(t,e){return`\\n    float radius = u_highp[${t}][0];\\n\\n    vec2 coord = p / radius;\\n    ${e?this.STATEMENT_FOCAL_POINT_ON(t):this.STATEMENT_FOCAL_POINT_OFF()}\\n`}static STATEMENT_FOCAL_POINT_OFF(){return\"\\n    float t = length(coord);\\n\"}static STATEMENT_FOCAL_POINT_ON(t){return`\\n    vec2 focal = vec2(u_highp[${t}][1], 0.0);\\n\\n    vec2 dir = normalize(coord - focal);\\n\\n    float a = dot(dir, dir);\\n    float b = 2.0 * dot(dir, focal);\\n    float c = dot(focal, focal) - 1.0;\\n    float x = (-b + sqrt(b * b - 4.0 * a * c)) / (2.0 * a);\\n\\n    float t = distance(focal, coord) / distance(focal, focal + dir * x);\\n`}}class Rt{constructor(t,e){this._$context=t,this._$gl=e,this._$collection=O()}getGradientShapeShader(t,e,i,r,s){const n=this.createCollectionKey(t,e,i,r,s);if(this._$collection.has(n)){const t=this._$collection.get(n);if(t)return t}const a=(e?13:5)+(t?1:0)+1,h=a-1;let o;o=t?Et.TEMPLATE(a,h,!0,e):Ct.TEMPLATE(a,!0,!1,e);const l=new Mt(this._$gl,this._$context,o,Ft.TEMPLATE(a,h,i,r,s));return this._$collection.set(n,l),l}createCollectionKey(t,e,i,r,s){const n=t?\"y\":\"n\",a=e?\"y\":\"n\",h=i?\"y\":\"n\",o=i&&r?\"y\":\"n\";let l=0;switch(s){case\"reflect\":l=1;break;case\"repeat\":l=2}return`${n}${a}${h}${o}${l}`}setGradientShapeUniform(t,e,i,r,s,n,a,h,o,l,_,c,$,u){const d=t.highp;d[0]=a[0],d[1]=a[1],d[2]=a[2],d[4]=a[3],d[5]=a[4],d[6]=a[5],d[8]=a[6],d[9]=a[7],d[10]=a[8],d[12]=h[0],d[13]=h[1],d[14]=h[2],d[16]=h[3],d[17]=h[4],d[18]=h[5],d[11]=h[6],d[15]=h[7],d[19]=h[8],d[3]=o,d[7]=l;let g=20;n&&(d[g]=_.parentMatrixA,d[g+1]=_.parentMatrixB,d[g+2]=_.parentMatrixC,d[g+4]=_.parentMatrixD,d[g+5]=_.parentMatrixE,d[g+6]=_.parentMatrixF,d[g+8]=_.parentMatrixG,d[g+9]=_.parentMatrixH,d[g+10]=_.parentMatrixI,d[g+12]=_.ancestorMatrixA,d[g+13]=_.ancestorMatrixB,d[g+14]=_.ancestorMatrixC,d[g+16]=_.ancestorMatrixD,d[g+17]=_.ancestorMatrixE,d[g+18]=_.ancestorMatrixF,d[g+20]=_.ancestorMatrixG,d[g+21]=_.ancestorMatrixH,d[g+22]=_.ancestorMatrixI,d[g+11]=_.parentViewportX,d[g+15]=_.parentViewportY,d[g+19]=_.parentViewportW,d[g+23]=_.parentViewportH,d[g+24]=_.minXST,d[g+25]=_.minYST,d[g+26]=_.minXPQ,d[g+27]=_.minYPQ,d[g+28]=_.maxXST,d[g+29]=_.maxYST,d[g+30]=_.maxXPQ,d[g+31]=_.maxYPQ,g=52),e&&(d[g]=i,d[g+1]=r,d[g+2]=s,g+=4),c?(d[g]=$[5],d[g+1]=u):(d[g]=$[0],d[g+1]=$[1],d[g+2]=$[2],d[g+3]=$[3])}}class It{static TEXTURE(){return\"#version 300 es\\n\\nlayout (location = 0) in vec2 a_vertex;\\n\\nout vec2 v_coord;\\n\\nvoid main() {\\n    v_coord = a_vertex;\\n\\n    vec2 position = a_vertex * 2.0 - 1.0;\\n    gl_Position = vec4(position, 0.0, 1.0);\\n}\\n\\n\"}static BLEND(){return\"#version 300 es\\n\\nlayout (location = 0) in vec2 a_vertex;\\n\\nuniform vec4 u_highp[4];\\n\\nout vec2 v_coord;\\n\\nvoid main() {\\n    v_coord = a_vertex;\\n\\n    vec2 offset   = u_highp[0].xy;\\n    vec2 size     = u_highp[0].zw;\\n    mat3 matrix   = mat3(u_highp[1].xyz, u_highp[2].xyz, u_highp[3].xyz);\\n    vec2 viewport = vec2(u_highp[1].w, u_highp[2].w);\\n\\n    vec2 position = vec2(a_vertex.x, 1.0 - a_vertex.y);\\n    position = position * size + offset;\\n    position = (matrix * vec3(position, 1.0)).xy;\\n    position /= viewport;\\n\\n    position = position * 2.0 - 1.0;\\n    gl_Position = vec4(position.x, -position.y, 0.0, 1.0);\\n}\\n\\n\"}static BLEND_CLIP(){return\"#version 300 es\\n\\nlayout (location = 0) in vec2 a_vertex;\\n\\nuniform vec4 u_highp[4];\\n\\nout vec2 v_coord;\\n\\nvoid main() {\\n    v_coord = a_vertex;\\n\\n    vec2 offset     = u_highp[0].xy;\\n    vec2 size       = u_highp[0].zw;\\n    mat3 inv_matrix = mat3(u_highp[1].xyz, u_highp[2].xyz, u_highp[3].xyz);\\n    vec2 viewport   = vec2(u_highp[1].w, u_highp[2].w);\\n\\n    vec2 position = vec2(a_vertex.x, 1.0 - a_vertex.y);\\n    position *= viewport;\\n    position = (inv_matrix * vec3(position, 1.0)).xy;\\n    position = (position - offset) / size;\\n\\n    position = position * 2.0 - 1.0;\\n    gl_Position = vec4(position.x, -position.y, 0.0, 1.0);\\n}\\n\\n\"}}class Pt{static TEMPLATE(t,e,i){let s=\"\";for(let t=1;t<e;t++){const i=t-1,n=t,a=`u_mediump[${e+r.floor(i/4)}][${i%4}]`,h=`u_mediump[${e+r.floor(n/4)}][${n%4}]`;s+=`\\n    if (t <= ${h}) {\\n        return mix(u_mediump[${i}], u_mediump[${n}], (t - ${a}) / (${h} - ${a}));\\n    }\\n`}return`#version 300 es\\nprecision mediump float;\\n\\nuniform vec4 u_mediump[${t}];\\n\\nin vec2 v_coord;\\nout vec4 o_color;\\n\\nvec4 getGradientColor(in float t) {\\n    if (t <= u_mediump[${e}][0]) {\\n        return u_mediump[0];\\n    }\\n    ${s}\\n    return u_mediump[${e-1}];\\n}\\n\\nvoid main() {\\n    vec4 color = getGradientColor(v_coord.x);\\n    ${i?\"color = pow(color, vec4(0.45454545));\":\"\"}\\n    color.rgb *= color.a;\\n\\n    o_color = color;\\n}\\n\\n`}}class kt{constructor(t,e){this._$context=t,this._$gl=e,this._$collection=O()}getGradientLUTShader(t,e){const i=`l${(\"00\"+t).slice(-3)}${e?\"y\":\"n\"}`;if(this._$collection.has(i)){const t=this._$collection.get(i);if(t)return t}const s=r.ceil(5*t/4),n=new Mt(this._$gl,this._$context,It.TEXTURE(),Pt.TEMPLATE(s,t,e));return this._$collection.set(i,n),n}setGradientLUTUniformForShape(t,e,i,r,s){let n=0;const a=t.mediump;for(let t=i;t<r;t++){const i=e[t][1];a[n++]=s[i[0]],a[n++]=s[i[1]],a[n++]=s[i[2]],a[n++]=s[i[3]]}for(let t=i;t<r;t++)a[n++]=e[t][0]}setGradientLUTUniformForFilter(t,e,i,r,s,n){let a=0;const h=t.mediump;for(let t=s;t<n;t++){const e=i[t];h[a++]=(e>>16)/255,h[a++]=(e>>8&255)/255,h[a++]=(255&e)/255,h[a++]=r[t]}for(let t=s;t<n;t++)h[a++]=e[t]}}class Lt{static TEMPLATE(t,e,i,r,s,n,a,h,o){let l=0;const _=i?this.STATEMENT_BASE_TEXTURE_TRANSFORM(l++):\"\",c=r?this.STATEMENT_BLUR_TEXTURE_TRANSFORM(l++):this.STATEMENT_BLUR_TEXTURE(),$=\"inner\"===n,u=l;let d,g,f=4*l;switch(o?d=s?this.STATEMENT_GLOW(!1,i,h,o,u,f):this.STATEMENT_BEVEL(i,r,h,o,u,f):s?(f+=4,d=this.STATEMENT_GLOW($,i,h,o,u,f)):(f+=8,d=this.STATEMENT_BEVEL(i,r,h,o,u,f)),n){case\"outer\":g=a?\"blur - blur * base.a\":\"base + blur - blur * base.a\";break;case\"full\":g=a?\"blur\":\"base - base * blur.a + blur\";break;default:g=\"blur\"}return`#version 300 es\\nprecision mediump float;\\n\\nuniform sampler2D u_textures[${t}];\\nuniform vec4 u_mediump[${e}];\\n\\nin vec2 v_coord;\\nout vec4 o_color;\\n\\n${St.FUNCTION_IS_INSIDE()}\\n\\nvoid main() {\\n    ${_}\\n    ${c}\\n    ${d}\\n    o_color = ${g};\\n}\\n\\n`}static STATEMENT_BASE_TEXTURE_TRANSFORM(t){return`\\n    vec2 base_scale  = u_mediump[${t}].xy;\\n    vec2 base_offset = u_mediump[${t}].zw;\\n\\n    vec2 uv = v_coord * base_scale - base_offset;\\n    vec4 base = mix(vec4(0.0), texture(u_textures[1], uv), isInside(uv));\\n`}static STATEMENT_BLUR_TEXTURE(){return\"\\n    vec4 blur = texture(u_textures[0], v_coord);\\n\"}static STATEMENT_BLUR_TEXTURE_TRANSFORM(t){return`\\n    vec2 blur_scale  = u_mediump[${t}].xy;\\n    vec2 blur_offset = u_mediump[${t}].zw;\\n\\n    vec2 st = v_coord * blur_scale - blur_offset;\\n    vec4 blur = mix(vec4(0.0), texture(u_textures[0], st), isInside(st));\\n`}static STATEMENT_GLOW(t,e,i,r,s,n){return`\\n    ${t?\"blur.a = 1.0 - blur.a;\":\"\"}\\n    ${i?this.STATEMENT_GLOW_STRENGTH(n):\"\"}\\n    ${r?this.STATEMENT_GLOW_GRADIENT_COLOR(e):this.STATEMENT_GLOW_SOLID_COLOR(s)}\\n`}static STATEMENT_GLOW_STRENGTH(t){return`\\n    float strength = u_mediump[${r.floor(t/4)}][${t%4}];\\n    blur.a = clamp(blur.a * strength, 0.0, 1.0);\\n`}static STATEMENT_GLOW_SOLID_COLOR(t){return`\\n    vec4 color = u_mediump[${t}];\\n    blur = color * blur.a;\\n`}static STATEMENT_GLOW_GRADIENT_COLOR(t){return`\\n    blur = texture(u_textures[${t?2:1}], vec2(blur.a, 0.5));\\n`}static STATEMENT_BEVEL(t,e,i,r,s,n){return`\\n    ${e?this.STATEMENT_BLUR_TEXTURE_TRANSFORM_2():this.STATEMENT_BLUR_TEXTURE_2()}\\n    float highlight_alpha = blur.a - blur2.a;\\n    float shadow_alpha    = blur2.a - blur.a;\\n    ${i?this.STATEMENT_BEVEL_STRENGTH(n):\"\"}\\n    highlight_alpha = clamp(highlight_alpha, 0.0, 1.0);\\n    shadow_alpha    = clamp(shadow_alpha, 0.0, 1.0);\\n    ${r?this.STATEMENT_BEVEL_GRADIENT_COLOR(t):this.STATEMENT_BEVEL_SOLID_COLOR(s)}\\n`}static STATEMENT_BLUR_TEXTURE_2(){return\"\\n    vec4 blur2 = texture(u_textures[0], 1.0 - v_coord);\\n\"}static STATEMENT_BLUR_TEXTURE_TRANSFORM_2(){return\"\\n    vec2 pq = (1.0 - v_coord) * blur_scale - blur_offset;\\n    vec4 blur2 = mix(vec4(0.0), texture(u_textures[0], pq), isInside(pq));\\n\"}static STATEMENT_BEVEL_STRENGTH(t){return`\\n    float strength = u_mediump[${r.floor(t/4)}][${t%4}];\\n    highlight_alpha *= strength;\\n    shadow_alpha    *= strength;\\n`}static STATEMENT_BEVEL_SOLID_COLOR(t){return`\\n    vec4 highlight_color = u_mediump[${t}];\\n    vec4 shadow_color    = u_mediump[${t+1}];\\n    blur = highlight_color * highlight_alpha + shadow_color * shadow_alpha;\\n`}static STATEMENT_BEVEL_GRADIENT_COLOR(t){return`\\n    blur = texture(u_textures[${t?2:1}], vec2(\\n        0.5019607843137255 - 0.5019607843137255 * shadow_alpha + 0.4980392156862745 * highlight_alpha,\\n        0.5\\n    ));\\n`}}class Nt{static TEMPLATE(t){const e=t.toFixed(1);return`#version 300 es\\nprecision mediump float;\\n\\nuniform sampler2D u_texture;\\nuniform vec4 u_mediump;\\n\\nin vec2 v_coord;\\nout vec4 o_color;\\n\\nvoid main() {\\n    vec2  offset   = u_mediump.xy;\\n    float fraction = u_mediump.z;\\n    float samples  = u_mediump.w;\\n    \\n    vec4 color = texture(u_texture, v_coord);\\n\\n    for (float i = 1.0; i < ${e}; i += 1.0) {\\n        color += texture(u_texture, v_coord + offset * i);\\n        color += texture(u_texture, v_coord - offset * i);\\n    }\\n    color += texture(u_texture, v_coord + offset * ${e}) * fraction;\\n    color += texture(u_texture, v_coord - offset * ${e}) * fraction;\\n    color /= samples;\\n\\n    o_color = color;\\n}\\n\\n`}}class Ut{static TEMPLATE(){return\"#version 300 es\\nprecision mediump float;\\n\\nuniform sampler2D u_texture;\\nuniform vec4 u_mediump[5];\\n\\nin vec2 v_coord;\\nout vec4 o_color;\\n\\nvoid main() {\\n    mat4 mul = mat4(u_mediump[0], u_mediump[1], u_mediump[2], u_mediump[3]);\\n    vec4 add = u_mediump[4];\\n    \\n    vec4 color = texture(u_texture, v_coord);\\n\\n    color.rgb /= max(0.0001, color.a);\\n    color = clamp(color * mul + add, 0.0, 1.0);\\n    color.rgb *= color.a;\\n\\n    o_color = color;\\n}\\n\\n\"}}class Ot{static TEMPLATE(t,e,i,s,n){const a=r.floor(.5*e),h=r.floor(.5*i),o=e*i;let l=\"\";const _=n?1:2;for(let t=0;t<o;++t)l+=`\\n    result += getWeightedColor(${t}, u_mediump[${_+r.floor(t/4)}][${t%4}]);\\n`;const c=s?\"result.a = texture(u_texture, v_coord).a;\":\"\",$=n?\"\":\"\\n    vec4 substitute_color = u_mediump[1];\\n    color = mix(substitute_color, color, isInside(uv));\\n\";return`#version 300 es\\nprecision mediump float;\\n\\nuniform sampler2D u_texture;\\nuniform vec4 u_mediump[${t}];\\n\\nin vec2 v_coord;\\nout vec4 o_color;\\n\\n${St.FUNCTION_IS_INSIDE()}\\n\\nvec4 getWeightedColor (in int i, in float weight) {\\n    vec2 rcp_size = u_mediump[0].xy;\\n\\n    int i_div_x = i / ${e};\\n    int i_mod_x = i - ${e} * i_div_x;\\n    vec2 offset = vec2(i_mod_x - ${a}, ${h} - i_div_x);\\n    vec2 uv = v_coord + offset * rcp_size;\\n\\n    vec4 color = texture(u_texture, uv);\\n    color.rgb /= max(0.0001, color.a);\\n    ${$}\\n\\n    return color * weight;\\n}\\n\\nvoid main() {\\n    float rcp_divisor = u_mediump[0].z;\\n    float bias        = u_mediump[0].w;\\n\\n    vec4 result = vec4(0.0);\\n    ${l}\\n    result = clamp(result * rcp_divisor + bias, 0.0, 1.0);\\n    ${c}\\n\\n    result.rgb *= result.a;\\n    o_color = result;\\n}\\n\\n`}}class Dt{static TEMPLATE(t,e,i,r){let s,n,a;switch(e){case 1:s=\"map_color.r\";break;case 2:s=\"map_color.g\";break;case 4:s=\"map_color.b\";break;case 8:s=\"map_color.a\";break;default:s=\"0.5\"}switch(i){case 1:n=\"map_color.r\";break;case 2:n=\"map_color.g\";break;case 4:n=\"map_color.b\";break;case 8:n=\"map_color.a\";break;default:n=\"0.5\"}switch(r){case\"clamp\":a=\"\\n    vec4 source_color = texture(u_textures[0], uv);\\n\";break;case\"ignore\":a=\"\\n    vec4 source_color =texture(u_textures[0], mix(v_coord, uv, step(abs(uv - vec2(0.5)), vec2(0.5))));\\n\";break;case\"color\":a=\"\\n    vec4 substitute_color = u_mediump[2];\\n    vec4 source_color = mix(substitute_color, texture(u_textures[0], uv), isInside(uv));\\n\";break;default:a=\"\\n    vec4 source_color = texture(u_textures[0], fract(uv));\\n\"}return`#version 300 es\\nprecision mediump float;\\n\\nuniform sampler2D u_textures[2];\\nuniform vec4 u_mediump[${t}];\\n\\nin vec2 v_coord;\\nout vec4 o_color;\\n\\n${St.FUNCTION_IS_INSIDE()}\\n\\nvoid main() {\\n    vec2 uv_to_st_scale  = u_mediump[0].xy;\\n    vec2 uv_to_st_offset = u_mediump[0].zw;\\n    vec2 scale           = u_mediump[1].xy;\\n\\n    vec2 st = v_coord * uv_to_st_scale - uv_to_st_offset;\\n    vec4 map_color = texture(u_textures[1], st);\\n\\n    vec2 offset = vec2(${s}, ${n}) - 0.5;\\n    vec2 uv = v_coord + offset * scale;\\n    ${a}\\n\\n    o_color = mix(texture(u_textures[0], v_coord), source_color, isInside(st));\\n}\\n\\n`}}class Xt{constructor(t,e){this._$context=t,this._$gl=e,this._$collection=O()}getBlurFilterShader(t){const e=`b${t}`;if(this._$collection.has(e)){const t=this._$collection.get(e);if(t)return t}const i=new Mt(this._$gl,this._$context,It.TEXTURE(),Nt.TEMPLATE(t));return this._$collection.set(e,i),i}getBitmapFilterShader(t,e,i,s,n,a,h){const o=`f${t?\"y\":\"n\"}${e?\"y\":\"n\"}${i?\"y\":\"n\"}${s}${n?\"y\":\"n\"}${a?\"y\":\"n\"}`;if(this._$collection.has(o)){const t=this._$collection.get(o);if(t)return t}let l=1;t&&l++,h&&l++;let _=(t?4:0)+(e?4:0)+(a?1:0);h||(_+=i?4:8),_=r.ceil(_/4);const c=new Mt(this._$gl,this._$context,It.TEXTURE(),Lt.TEMPLATE(l,_,t,e,i,s,n,a,h));return this._$collection.set(o,c),c}getColorMatrixFilterShader(){if(this._$collection.has(\"m\")){const t=this._$collection.get(\"m\");if(t)return t}const t=new Mt(this._$gl,this._$context,It.TEXTURE(),Ut.TEMPLATE());return this._$collection.set(\"m\",t),t}getConvolutionFilterShader(t,e,i,s){const n=`c${(\"0\"+t).slice(-2)}${(\"0\"+e).slice(-2)}${i?\"y\":\"n\"}${s?\"y\":\"n\"}`;if(this._$collection.has(n)){const t=this._$collection.get(n);if(t)return t}const a=(s?1:2)+r.ceil(t*e/4),h=new Mt(this._$gl,this._$context,It.TEXTURE(),Ot.TEMPLATE(a,t,e,i,s));return this._$collection.set(n,h),h}getDisplacementMapFilterShader(t,e,i){const r=`d${t}${e}${i}`;if(this._$collection.has(r)){const t=this._$collection.get(r);if(t)return t}const s=\"color\"===i?3:2,n=new Mt(this._$gl,this._$context,It.TEXTURE(),Dt.TEMPLATE(s,t,e,i));return this._$collection.set(r,n),n}setBlurFilterUniform(t,e,i,r,s,n){const a=t.mediump;r?(a[0]=1/e,a[1]=0):(a[0]=0,a[1]=1/i),a[2]=s,a[3]=n}setBitmapFilterUniform(t,e,i,r,s,n,a,h,o,l,_,c,$,u,d,g,f,p,m,x,b,v,T,A,M){let y;v?(y=t.textures,y[0]=0,y[1]=1,M&&(y[2]=2)):M&&(y=t.textures,y[0]=0,y[1]=2);const E=t.mediump;let C=0;v&&(E[C]=e/r,E[C+1]=i/s,E[C+2]=n/r,E[C+3]=(i-s-a)/s,C+=4),T&&(E[C]=e/h,E[C+1]=i/o,E[C+2]=l/h,E[C+3]=(i-o-_)/o,C+=4),M||(c?(E[C]=u,E[C+1]=d,E[C+2]=g,E[C+3]=f,C+=4):(E[C]=u,E[C+1]=d,E[C+2]=g,E[C+3]=f,E[C+4]=p,E[C+5]=m,E[C+6]=x,E[C+7]=b,C+=8)),A&&(E[C]=$)}setColorMatrixFilterUniform(t,e){const i=t.mediump;i[0]=e[0],i[1]=e[1],i[2]=e[2],i[3]=e[3],i[4]=e[5],i[5]=e[6],i[6]=e[7],i[7]=e[8],i[8]=e[10],i[9]=e[11],i[10]=e[12],i[11]=e[13],i[12]=e[15],i[13]=e[16],i[14]=e[17],i[15]=e[18],i[16]=e[4]/255,i[17]=e[9]/255,i[18]=e[14]/255,i[19]=e[19]/255}setConvolutionFilterUniform(t,e,i,r,s,n,a,h,o,l,_){const c=t.mediump;c[0]=1/e,c[1]=1/i,c[2]=1/s,c[3]=n/255;let $=4;a||(c[$]=h,c[$+1]=o,c[$+2]=l,c[$+3]=_,$+=4);const u=r.length;for(let t=0;t<u;t++)c[$++]=r[t]}setDisplacementMapFilterUniform(t,e,i,r,s,n,a,h,o,l,_,c,$,u){const d=t.textures;d[0]=0,d[1]=1;const g=t.mediump;g[0]=r/e,g[1]=s/i,g[2]=n/e,g[3]=(s-i-a)/i,g[4]=h/r,g[5]=-o/s,\"color\"===l&&(g[8]=_,g[9]=c,g[10]=$,g[11]=u)}}class Vt{static TEMPLATE(t){return`#version 300 es\\nprecision mediump float;\\n\\nuniform sampler2D u_texture;\\n${t?\"uniform vec4 u_mediump[2];\":\"\"}\\n\\nin vec2 v_coord;\\nout vec4 o_color;\\n\\nvoid main() {\\n    vec4 src = texture(u_texture, v_coord);\\n    ${t?St.STATEMENT_COLOR_TRANSFORM_ON(0):\"\"}\\n    o_color = src;\\n}\\n\\n`}}class Yt{static TEMPLATE(t,e){let i;switch(t){case\"subtract\":i=this.FUNCTION_SUBTRACT();break;case\"multiply\":i=this.FUNCTION_MULTIPLY();break;case\"lighten\":i=this.FUNCTION_LIGHTEN();break;case\"darken\":i=this.FUNCTION_DARKEN();break;case\"overlay\":i=this.FUNCTION_OVERLAY();break;case\"hardlight\":i=this.FUNCTION_HARDLIGHT();break;case\"difference\":i=this.FUNCTION_DIFFERENCE();break;case\"invert\":i=this.FUNCTION_INVERT();break;default:i=this.FUNCTION_NORMAL()}return`#version 300 es\\nprecision mediump float;\\n\\nuniform sampler2D u_textures[2];\\n${e?\"uniform vec4 u_mediump[2];\":\"\"}\\n\\nin vec2 v_coord;\\nout vec4 o_color;\\n\\n${i}\\n\\nvoid main() {\\n    vec4 dst = texture(u_textures[0], v_coord);\\n    vec4 src = texture(u_textures[1], v_coord);\\n    ${e?St.STATEMENT_COLOR_TRANSFORM_ON(0):\"\"}\\n    o_color = blend(src, dst);\\n}\\n\\n`}static FUNCTION_NORMAL(){return\"\\n\\nvec4 blend (in vec4 src, in vec4 dst) {\\n    return src + dst - dst * src.a;\\n}\\n\\n\"}static FUNCTION_SUBTRACT(){return\"\\n\\nvec4 blend (in vec4 src, in vec4 dst) {\\n    if (src.a == 0.0) { return dst; }\\n    if (dst.a == 0.0) { return src; }\\n\\n    vec4 a = src - src * dst.a;\\n    vec4 b = dst - dst * src.a;\\n\\n    src.rgb /= src.a;\\n    dst.rgb /= dst.a;\\n\\n    vec4 c = vec4(dst.rgb - src.rgb, src.a * dst.a);\\n    c.rgb *= c.a;\\n\\n    return a + b + c;\\n}\\n\\n\"}static FUNCTION_MULTIPLY(){return\"\\n\\nvec4 blend (in vec4 src, in vec4 dst) {\\n    vec4 a = src - src * dst.a;\\n    vec4 b = dst - dst * src.a;\\n    vec4 c = src * dst;\\n\\n    return a + b + c;\\n}\\n\\n\"}static FUNCTION_LIGHTEN(){return\"\\n\\nvec4 blend (in vec4 src, in vec4 dst) {\\n    if (src.a == 0.0) { return dst; }\\n    if (dst.a == 0.0) { return src; }\\n\\n    vec4 a = src - src * dst.a;\\n    vec4 b = dst - dst * src.a;\\n\\n    src.rgb /= src.a;\\n    dst.rgb /= dst.a;\\n\\n    vec4 c = vec4(mix(src.rgb, dst.rgb, step(src.rgb, dst.rgb)), src.a * dst.a);\\n    c.rgb *= c.a;\\n\\n    return a + b + c;\\n}\\n\\n\"}static FUNCTION_DARKEN(){return\"\\n\\nvec4 blend (in vec4 src, in vec4 dst) {\\n    if (src.a == 0.0) { return dst; }\\n    if (dst.a == 0.0) { return src; }\\n\\n    vec4 a = src - src * dst.a;\\n    vec4 b = dst - dst * src.a;\\n\\n    src.rgb /= src.a;\\n    dst.rgb /= dst.a;\\n\\n    vec4 c = vec4(mix(src.rgb, dst.rgb, step(dst.rgb, src.rgb)), src.a * dst.a);\\n    c.rgb *= c.a;\\n\\n    return a + b + c;\\n}\\n\\n\"}static FUNCTION_OVERLAY(){return\"\\n\\nvec4 blend (in vec4 src, in vec4 dst) {\\n    if (src.a == 0.0) { return dst; }\\n    if (dst.a == 0.0) { return src; }\\n\\n    vec4 a = src - src * dst.a;\\n    vec4 b = dst - dst * src.a;\\n\\n    src.rgb /= src.a;\\n    dst.rgb /= dst.a;\\n\\n    vec4 mul = src * dst;\\n    vec3 c1 = 2.0 * mul.rgb;\\n    vec3 c2 = 2.0 * (src.rgb + dst.rgb - mul.rgb) - 1.0;\\n    vec4 c = vec4(mix(c1, c2, step(vec3(0.5), dst.rgb)), mul.a);\\n    c.rgb *= c.a;\\n\\n    return a + b + c;\\n}\\n\\n\"}static FUNCTION_HARDLIGHT(){return\"\\n\\nvec4 blend (in vec4 src, in vec4 dst) {\\n    if (src.a == 0.0) { return dst; }\\n    if (dst.a == 0.0) { return src; }\\n\\n    vec4 a = src - src * dst.a;\\n    vec4 b = dst - dst * src.a;\\n\\n    src.rgb /= src.a;\\n    dst.rgb /= dst.a;\\n\\n    vec4 mul = src * dst;\\n    vec3 c1 = 2.0 * mul.rgb;\\n    vec3 c2 = 2.0 * (src.rgb + dst.rgb - mul.rgb) - 1.0;\\n    vec4 c = vec4(mix(c1, c2, step(vec3(0.5), src.rgb)), mul.a);\\n    c.rgb *= c.a;\\n\\n    return a + b + c;\\n}\\n\\n\"}static FUNCTION_DIFFERENCE(){return\"\\n\\nvec4 blend (in vec4 src, in vec4 dst) {\\n    if (src.a == 0.0) { return dst; }\\n    if (dst.a == 0.0) { return src; }\\n\\n    vec4 a = src - src * dst.a;\\n    vec4 b = dst - dst * src.a;\\n\\n    src.rgb /= src.a;\\n    dst.rgb /= dst.a;\\n\\n    vec4 c = vec4(abs(src.rgb - dst.rgb), src.a * dst.a);\\n    c.rgb *= c.a;\\n\\n    return a + b + c;\\n}\\n\\n\"}static FUNCTION_INVERT(){return\"\\n\\nvec4 blend (in vec4 src, in vec4 dst) {\\n    if (src.a == 0.0) { return dst; }\\n    if (dst.a == 0.0) { return src; }\\n\\n    vec4 b = dst - dst * src.a;\\n    vec4 c = vec4(src.a - dst.rgb * src.a, src.a);\\n\\n    return b + c;\\n}\\n\\n\"}}class Gt{constructor(t,e){this._$context=t,this._$gl=e,this._$collection=O()}getNormalBlendShader(t){const e=\"n\"+(t?\"y\":\"n\");if(this._$collection.has(e)){const t=this._$collection.get(e);if(t)return t}const i=new Mt(this._$gl,this._$context,It.BLEND(),Vt.TEMPLATE(t));return this._$collection.set(e,i),i}getClipShader(){if(this._$collection.has(\"c\")){const t=this._$collection.get(\"c\");if(t)return t}const t=new Mt(this._$gl,this._$context,It.BLEND_CLIP(),Vt.TEMPLATE(!1));return this._$collection.set(\"c\",t),t}getBlendShader(t,e){const i=`${t}${e?\"y\":\"n\"}`;if(this._$collection.has(i)){const t=this._$collection.get(i);if(t)return t}const r=new Mt(this._$gl,this._$context,It.BLEND(),Yt.TEMPLATE(t,e));return this._$collection.set(i,r),r}setNormalBlendUniform(t,e,i,r,s,n,a,h,o,l,_,c,$,u,d,g,f){const p=t.highp;if(p[0]=e,p[1]=i,p[2]=r,p[3]=s,p[4]=n[0],p[5]=n[1],p[6]=n[2],p[8]=n[3],p[9]=n[4],p[10]=n[5],p[12]=n[6],p[13]=n[7],p[14]=n[8],p[7]=a,p[11]=h,o){const e=t.mediump;e[0]=l,e[1]=_,e[2]=c,e[3]=$,e[4]=u,e[5]=d,e[6]=g,e[7]=f}}setClipUniform(t,e,i,r,s,n,a,h){const o=t.highp;o[0]=e,o[1]=i,o[2]=r,o[3]=s,o[4]=n[0],o[5]=n[1],o[6]=n[2],o[8]=n[3],o[9]=n[4],o[10]=n[5],o[12]=n[6],o[13]=n[7],o[14]=n[8],o[7]=a,o[11]=h}setBlendUniform(t,e,i,r,s,n,a,h,o,l,_,c,$,u,d,g,f){const p=t.textures;p[0]=0,p[1]=1;const m=t.highp;if(m[0]=e,m[1]=i,m[2]=r,m[3]=s,m[4]=n[0],m[5]=n[1],m[6]=n[2],m[8]=n[3],m[9]=n[4],m[10]=n[5],m[12]=n[6],m[13]=n[7],m[14]=n[8],m[7]=a,m[11]=h,o){const e=t.mediump;e[0]=l,e[1]=_,e[2]=c,e[3]=$,e[4]=u,e[5]=d,e[6]=g,e[7]=f}}}class zt{constructor(t,e){this._$currentProgramId=-1,this._$shapeShaderVariants=new Bt(t,e),this._$gradientShapeShaderVariants=new Rt(t,e),this._$gradientLUTShaderVariants=new kt(t,e),this._$filterShaderVariants=new Xt(t,e),this._$blendShaderVariants=new Gt(t,e)}get currentProgramId(){return this._$currentProgramId}set currentProgramId(t){this._$currentProgramId=t}get shapeShaderVariants(){return this._$shapeShaderVariants}get gradientShapeShaderVariants(){return this._$gradientShapeShaderVariants}get gradientLUTShaderVariants(){return this._$gradientLUTShaderVariants}get filterShaderVariants(){return this._$filterShaderVariants}get blendShaderVariants(){return this._$blendShaderVariants}}class Wt{constructor(t,e){this._$context=t,this._$gl=e,this._$attachment=t.frameBuffer.createTextureAttachment(512,1),this._$maxLength=r.floor(.75*e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS)),this._$rgbToLinearTable=new Float32Array(256),this._$rgbIdentityTable=new Float32Array(256);for(let t=0;t<256;t++){const e=t/255;this._$rgbToLinearTable[t]=r.pow(e,2.23333333),this._$rgbIdentityTable[t]=e}}generateForShape(t,e){const i=this._$context.frameBuffer.currentAttachment;this._$context._$bind(this._$attachment);const s=t.length,n=this._$context.shaderList.gradientLUTShaderVariants,a=e?this._$rgbToLinearTable:this._$rgbIdentityTable;this._$context.blend.toOneZero();for(let i=0;i<s;i+=this._$maxLength-1){const h=r.min(i+this._$maxLength,s),o=n.getGradientLUTShader(h-i,e),l=o.uniform;n.setGradientLUTUniformForShape(l,t,i,h,a),o._$drawGradient(0===i?0:t[i][0],h===s?1:t[h-1][0])}if(this._$context._$bind(i),!this._$attachment.texture)throw new Error(\"the texture is null.\");return this._$attachment.texture}generateForFilter(t,e,i){const s=this._$context.frameBuffer.currentAttachment;this._$context._$bind(this._$attachment);const n=t.length,a=this._$context.shaderList.gradientLUTShaderVariants;this._$context.blend.toOneZero();for(let s=0;s<n;s+=this._$maxLength-1){const h=r.min(s+this._$maxLength,n),o=a.getGradientLUTShader(h-s,!1),l=o.uniform;a.setGradientLUTUniformForFilter(l,t,e,i,s,h),o._$drawGradient(0===s?0:t[s],h===n?1:t[h-1])}if(this._$context._$bind(s),!this._$attachment.texture)throw new Error(\"the texture is null.\");return this._$attachment.texture}}class Ht{static get indexRangePool(){return this._$indexRangePool}static generate(t){let e=0;for(let i=0;i<t.length;++i)e+=12*(t[i].length/3-2);this._$vertexBufferData=new h(e),this._$indexRanges=L(),this._$currentIndex=0;for(let e=0;e<t.length;++e){const i=this._$currentIndex;this._$generateMesh(t[e]);const r=this._$currentIndex-i,s=this._$indexRangePool.pop()||{first:0,count:0};s.first=i,s.count=r,this._$indexRanges.push(s)}return{vertexBufferData:this._$vertexBufferData,indexRanges:this._$indexRanges}}static _$generateMesh(t){const e=this._$vertexBufferData;let i=this._$currentIndex;const r=t.length-5;for(let s=3;s<r;s+=3){let r=4*i;t[s+2]?(e[r++]=t[s-3],e[r++]=t[s-2],e[r++]=0,e[r++]=0,e[r++]=t[s],e[r++]=t[s+1],e[r++]=.5,e[r++]=0,e[r++]=t[s+3],e[r++]=t[s+4],e[r++]=1,e[r++]=1):t[s+5]?(e[r++]=t[0],e[r++]=t[1],e[r++]=.5,e[r++]=.5,e[r++]=t[s],e[r++]=t[s+1],e[r++]=.5,e[r++]=.5,e[r++]=t[s+6],e[r++]=t[s+7],e[r++]=.5,e[r++]=.5):(e[r++]=t[0],e[r++]=t[1],e[r++]=.5,e[r++]=.5,e[r++]=t[s],e[r++]=t[s+1],e[r++]=.5,e[r++]=.5,e[r++]=t[s+3],e[r++]=t[s+4],e[r++]=.5,e[r++]=.5),i+=3}this._$currentIndex=i}}Ht._$indexRangePool=L();class qt{static generate(t,e,i){this._$vertexBufferData=this._$vertexBufferData||new h(1024),this._$vertexBufferPos=0,this._$indexBufferData=this._$indexBufferData||new Int16Array(256),this._$indexBufferPos=0,this._$lineCap=e,this._$lineJoin=i;for(let e=0;e<t.length;e++){const i=this._$vertexBufferPos;this._$generateLineSegment(t[e]);const r=this._$vertexBufferPos;this._$generateLineJoin(i,r),this._$generateLineCap(i,r)}return{vertexBufferData:this._$vertexBufferData.slice(0,this._$vertexBufferPos),indexBufferData:this._$indexBufferData.slice(0,this._$indexBufferPos)}}static _$expandVertexBufferIfNeeded(t){if(this._$vertexBufferPos+t>this._$vertexBufferData.length){const t=new h(2*this._$vertexBufferData.length);t.set(this._$vertexBufferData),this._$vertexBufferData=t}}static _$expandIndexBufferIfNeeded(t){if(this._$indexBufferPos+t>this._$indexBufferData.length){const t=new l(2*this._$indexBufferData.length);t.set(this._$indexBufferData),this._$indexBufferData=t}}static _$generateLineSegment(t){const e=t.length-5;for(let i=0;i<e;i+=3)t[i+2]||(t[i+5]?this._$addQuadSegmentMesh(t[i],t[i+1],t[i+3],t[i+4],t[i+6],t[i+7]):this._$addLineSegmentMesh(t[i],t[i+1],t[i+3],t[i+4]))}static _$addQuadSegmentMesh(t,e,i,r,s,n){let a=t,h=e;for(let o=1;o<11;o++){const l=o/11,_=1-l,c=(t*_+i*l)*_+(i*_+s*l)*l,$=(e*_+r*l)*_+(r*_+n*l)*l;this._$addLineSegmentMesh(a,h,c,$,2),a=c,h=$}this._$addLineSegmentMesh(a,h,s,n)}static _$addLineSegmentMesh(t,e,i,r,s=1){const n=this._$vertexBufferPos/7,a=n+1,h=n+2,o=n+3;this._$expandIndexBufferIfNeeded(6);const l=this._$indexBufferData;let _=this._$indexBufferPos;l[_++]=n,l[_++]=a,l[_++]=o,l[_++]=o,l[_++]=h,l[_++]=n,this._$indexBufferPos=_,this._$expandVertexBufferIfNeeded(28);const c=this._$vertexBufferData;let $=this._$vertexBufferPos;c[$++]=t,c[$++]=e,c[$++]=i,c[$++]=r,c[$++]=1,c[$++]=1,c[$++]=1,c[$++]=t,c[$++]=e,c[$++]=i,c[$++]=r,c[$++]=-1,c[$++]=-1,c[$++]=1,c[$++]=i,c[$++]=r,c[$++]=t,c[$++]=e,c[$++]=-1,c[$++]=-1,c[$++]=s,c[$++]=i,c[$++]=r,c[$++]=t,c[$++]=e,c[$++]=1,c[$++]=1,c[$++]=s,this._$vertexBufferPos=$}static _$generateLineJoin(t,e){const i=this._$vertexBufferData,r=e-55;for(let e=t;e<r;e+=28){const t=e/7;this._$addLineJoinMesh(i[e],i[e+1],i[e+21],i[e+22],i[e+27],i[e+49],i[e+50],t+2,t+3,t+4,t+5)}}static _$addLineJoinMesh(t,e,i,s,n,a,h,o,l,_=0,c=0){const $=i-t,u=s-e,d=a-i,g=h-s,f=this._$cross($,u,d,g);if(!(r.abs(f)<1e-4))if(2!==n)switch(this._$lineJoin){case\"round\":this._$addRoundJoinMesh(i,s);break;case\"miter\":this._$addMiterJoinMesh(i,s,t,e,a,h,_,o,l,c);break;default:this._$addBevelJoinMesh(i,s,_,o,l,c)}else this._$addBevelJoinMesh(i,s,_,o,l,c)}static _$addRoundJoinMesh(t,e){const i=this._$vertexBufferPos/7;this._$expandIndexBufferIfNeeded(57);const r=this._$indexBufferData;let s=this._$indexBufferPos;for(let t=1;t<18;t++){const e=i+t;r[s++]=i,r[s++]=e,r[s++]=e+1}r[s++]=i,r[s++]=i+18,r[s++]=i+1,this._$indexBufferPos=s,this._$expandVertexBufferIfNeeded(133);const n=this._$vertexBufferData;let a=this._$vertexBufferPos;n[a++]=t,n[a++]=e,n[a++]=0,n[a++]=0,n[a++]=0,n[a++]=0,n[a++]=0;for(let i=0;i<18;i++)n[a++]=t,n[a++]=e,n[a++]=0,n[a++]=0,n[a++]=0,n[a++]=0,n[a++]=30+i;this._$vertexBufferPos=a}static _$addMiterJoinMesh(t,e,i,r,s,n,a,h,o,l){const _=this._$vertexBufferPos/7,c=_+1,$=_+2,u=_+3,d=_+4;this._$expandIndexBufferIfNeeded(18);const g=this._$indexBufferData;let f=this._$indexBufferPos;g[f++]=_,g[f++]=a,g[f++]=c,g[f++]=_,g[f++]=c,g[f++]=$,g[f++]=_,g[f++]=$,g[f++]=h,g[f++]=_,g[f++]=o,g[f++]=u,g[f++]=_,g[f++]=u,g[f++]=d,g[f++]=_,g[f++]=d,g[f++]=l,this._$indexBufferPos=f,this._$expandVertexBufferIfNeeded(35);const p=this._$vertexBufferData;let m=this._$vertexBufferPos;p[m++]=t,p[m++]=e,p[m++]=i,p[m++]=r,p[m++]=s,p[m++]=n,p[m++]=0,p[m++]=t,p[m++]=e,p[m++]=i,p[m++]=r,p[m++]=s,p[m++]=n,p[m++]=21,p[m++]=t,p[m++]=e,p[m++]=i,p[m++]=r,p[m++]=s,p[m++]=n,p[m++]=22,p[m++]=t,p[m++]=e,p[m++]=i,p[m++]=r,p[m++]=s,p[m++]=n,p[m++]=23,p[m++]=t,p[m++]=e,p[m++]=i,p[m++]=r,p[m++]=s,p[m++]=n,p[m++]=24,this._$vertexBufferPos=m}static _$addBevelJoinMesh(t,e,i,r,s,n){const a=this._$vertexBufferPos/7;this._$expandIndexBufferIfNeeded(6);const h=this._$indexBufferData;let o=this._$indexBufferPos;h[o++]=a,h[o++]=i,h[o++]=r,h[o++]=a,h[o++]=s,h[o++]=n,this._$indexBufferPos=o,this._$expandVertexBufferIfNeeded(7);const l=this._$vertexBufferData;let _=this._$vertexBufferPos;l[_++]=t,l[_++]=e,l[_++]=0,l[_++]=0,l[_++]=0,l[_++]=0,l[_++]=0,this._$vertexBufferPos=_}static _$generateLineCap(t,e){const i=this._$vertexBufferData,r=i[t],s=i[t+1],n=i[t+2],a=i[t+3],h=i[e-7],o=i[e-6],l=i[e-5],_=i[e-4],c=t/7,$=e/7;r!==h||s!==o?(this._$addLineCapMesh(r,s,n,a,c,c+1),this._$addLineCapMesh(h,o,l,_,$-1,$-2)):this._$addLineJoinMesh(l,_,r,s,n,a,$-2,$-1,c,c+1)}static _$addLineCapMesh(t,e,i,r,s,n){switch(this._$lineCap){case\"round\":this._$addRoundJoinMesh(t,e);break;case\"square\":this._$addSquareCapMesh(t,e,i,r,s,n)}}static _$addSquareCapMesh(t,e,i,r,s,n){const a=this._$vertexBufferPos/7,h=a+1;this._$expandIndexBufferIfNeeded(6);const o=this._$indexBufferData;let l=this._$indexBufferPos;o[l++]=s,o[l++]=a,o[l++]=h,o[l++]=h,o[l++]=n,o[l++]=s,this._$indexBufferPos=l,this._$expandVertexBufferIfNeeded(14);const _=this._$vertexBufferData;let c=this._$vertexBufferPos;_[c++]=t,_[c++]=e,_[c++]=i,_[c++]=r,_[c++]=-1,_[c++]=-1,_[c++]=10,_[c++]=t,_[c++]=e,_[c++]=i,_[c++]=r,_[c++]=1,_[c++]=1,_[c++]=10,this._$vertexBufferPos=c}}qt._$cross=(t,e,i,r)=>t*r-i*e;class jt{constructor(t){this._$gl=t,this._$fillVertexArrayPool=[],this._$strokeVertexArrayPool=[],this._$boundVertexArray=null,this._$fillAttrib_vertex=0,this._$fillAttrib_bezier=1,this._$strokeAttrib_vertex=0,this._$strokeAttrib_option1=1,this._$strokeAttrib_option2=2,this._$strokeAttrib_type=3,this._$vertexBufferData=new Float32Array([0,0,0,1,1,0,1,1]),this._$commonVertexArray=this._$getVertexArray(0,1)}_$getVertexArray(t,e){const i=this._$gl.createVertexArray();if(!i)throw new Error(\"the WebGLVertexArrayObject is null.\");this.bind(i);const r=this._$gl.createBuffer();return this._$gl.bindBuffer(this._$gl.ARRAY_BUFFER,r),this._$vertexBufferData[0]=t,this._$vertexBufferData[2]=t,this._$vertexBufferData[4]=e,this._$vertexBufferData[6]=e,this._$gl.bufferData(this._$gl.ARRAY_BUFFER,this._$vertexBufferData,this._$gl.STATIC_DRAW),this._$gl.enableVertexAttribArray(0),this._$gl.vertexAttribPointer(0,2,this._$gl.FLOAT,!1,0,0),i}_$getFillVertexArray(){if(this._$fillVertexArrayPool.length){const t=this._$fillVertexArrayPool.pop();if(t)return t}const t=this._$gl.createVertexArray();if(!t)throw new Error(\"the WebGLVertexArrayObject is null.\");this.bind(t);const e=this._$gl.createBuffer();if(!e)throw new Error(\"the WebGLBuffer is null.\");return t.vertexBuffer=e,t.vertexLength=0,this._$gl.bindBuffer(this._$gl.ARRAY_BUFFER,e),this._$gl.enableVertexAttribArray(0),this._$gl.enableVertexAttribArray(1),this._$gl.vertexAttribPointer(this._$fillAttrib_vertex,2,this._$gl.FLOAT,!1,16,0),this._$gl.vertexAttribPointer(this._$fillAttrib_bezier,2,this._$gl.FLOAT,!1,16,8),t}_$getStrokeVertexArray(){if(this._$strokeVertexArrayPool.length){const t=this._$strokeVertexArrayPool.pop();if(t)return t}const t=this._$gl.createVertexArray();if(!t)throw new Error(\"the WebGLVertexArrayObject is null.\");this.bind(t);const e=this._$gl.createBuffer();if(!e)throw new Error(\"the WebGLBuffer is null.\");t.vertexBuffer=e,t.vertexLength=0,this._$gl.bindBuffer(this._$gl.ARRAY_BUFFER,e);const i=this._$gl.createBuffer();if(!i)throw new Error(\"the WebGLBuffer is null.\");return t.indexBuffer=i,t.indexLength=0,this._$gl.bindBuffer(this._$gl.ELEMENT_ARRAY_BUFFER,i),this._$gl.enableVertexAttribArray(0),this._$gl.enableVertexAttribArray(1),this._$gl.enableVertexAttribArray(2),this._$gl.enableVertexAttribArray(3),this._$gl.vertexAttribPointer(this._$strokeAttrib_vertex,2,this._$gl.FLOAT,!1,28,0),this._$gl.vertexAttribPointer(this._$strokeAttrib_option1,2,this._$gl.FLOAT,!1,28,8),this._$gl.vertexAttribPointer(this._$strokeAttrib_option2,2,this._$gl.FLOAT,!1,28,16),this._$gl.vertexAttribPointer(this._$strokeAttrib_type,1,this._$gl.FLOAT,!1,28,24),t}createFill(t){const e=Ht.generate(t),i=e.vertexBufferData,r=this._$getFillVertexArray();return r.indexRanges=e.indexRanges,this.bind(r),this._$gl.bindBuffer(this._$gl.ARRAY_BUFFER,r.vertexBuffer),r.vertexLength<i.length&&(r.vertexLength=D(i.length),this._$gl.bufferData(this._$gl.ARRAY_BUFFER,4*r.vertexLength,this._$gl.DYNAMIC_DRAW)),this._$gl.bufferSubData(this._$gl.ARRAY_BUFFER,0,i),r}createStroke(t,e,i){const r=qt.generate(t,e,i),s=r.vertexBufferData,n=r.indexBufferData,a=this._$getStrokeVertexArray();return a.indexCount=n.length,this.bind(a),this._$gl.bindBuffer(this._$gl.ARRAY_BUFFER,a.vertexBuffer),this._$gl.bindBuffer(this._$gl.ELEMENT_ARRAY_BUFFER,a.indexBuffer),a.vertexLength<s.length&&(a.vertexLength=D(s.length),this._$gl.bufferData(this._$gl.ARRAY_BUFFER,4*a.vertexLength,this._$gl.DYNAMIC_DRAW)),a.indexLength<n.length&&(a.indexLength=D(n.length),this._$gl.bufferData(this._$gl.ELEMENT_ARRAY_BUFFER,2*a.indexLength,this._$gl.DYNAMIC_DRAW)),this._$gl.bufferSubData(this._$gl.ARRAY_BUFFER,0,s),this._$gl.bufferSubData(this._$gl.ELEMENT_ARRAY_BUFFER,0,n),a}releaseFill(t){this._$fillVertexArrayPool.push(t)}releaseStroke(t){this._$strokeVertexArrayPool.push(t)}bind(t=null){t!==this._$boundVertexArray&&(this._$boundVertexArray=t,this._$gl.bindVertexArray(t))}bindCommonVertexArray(){this.bind(this._$commonVertexArray)}bindGradientVertexArray(t,e){const i=this._$getVertexArray(t,e);this.bind(i)}}class Qt{constructor(t,e){this._$context=t,this._$gl=e,this._$clips=[],this._$poolClip=[],this._$clipStatus=!1,this._$containerClip=!1,this._$currentClip=!1}get containerClip(){return this._$containerClip}set containerClip(t){this._$containerClip=t}_$onClear(t){t&&(this._$gl.enable(this._$gl.STENCIL_TEST),this._$currentClip=!0)}_$onBind(t){!t&&this._$currentClip?(this._$gl.disable(this._$gl.STENCIL_TEST),this._$currentClip=!1):t&&!this._$currentClip&&(this._$gl.enable(this._$gl.STENCIL_TEST),this._$currentClip=!0,this._$endClipDef())}_$onClearRect(){this._$gl.disable(this._$gl.STENCIL_TEST),this._$currentClip=!1}_$endClip(){const t=this._$context.frameBuffer,e=t.currentAttachment,i=t.getTextureFromCurrentAttachment();this._$context._$bind(this._$context.cacheAttachment),this._$context.cacheAttachment=null,this._$context.blend.disable();const r=this._$context.cacheBounds;this._$context.reset(),this._$context.setTransform(1,0,0,1,0,0),this._$context.drawImage(i,r.xMin,r.yMin,i.width,i.height),this._$context.blend.enable(),t.releaseAttachment(e,!0)}_$enterClip(){this._$currentClip||(this._$gl.enable(this._$gl.STENCIL_TEST),this._$currentClip=!0);const t=this._$context.frameBuffer.currentAttachment;if(!t)throw new Error(\"mask currentAttachment is null.\");t.mask=!0,++t.clipLevel}_$beginClipDef(){const t=this._$context.frameBuffer.currentAttachment;if(!t)throw new Error(\"mask currentAttachment is null.\");this._$gl.enable(this._$gl.SAMPLE_ALPHA_TO_COVERAGE),this._$gl.stencilFunc(this._$gl.ALWAYS,0,255),this._$gl.stencilOp(this._$gl.KEEP,this._$gl.INVERT,this._$gl.INVERT),this._$gl.stencilMask(1<<t.clipLevel-1),this._$gl.colorMask(!1,!1,!1,!1)}_$endClipDef(){const t=this._$context.frameBuffer.currentAttachment;if(!t)throw new Error(\"mask currentAttachment is null.\");const e=t.clipLevel;let i=0;for(let t=0;t<e;++t)i|=(1<<e-t)-1;this._$gl.disable(this._$gl.SAMPLE_ALPHA_TO_COVERAGE),this._$gl.stencilFunc(this._$gl.EQUAL,255&i,i),this._$gl.stencilOp(this._$gl.KEEP,this._$gl.KEEP,this._$gl.KEEP),this._$gl.stencilMask(255),this._$gl.colorMask(!0,!0,!0,!0)}_$leaveClip(){const t=this._$context.frameBuffer.currentAttachment;if(!t)throw new Error(\"mask currentAttachment is null.\");if(--t.clipLevel,t.mask=!!t.clipLevel,!t.clipLevel)return this._$context._$clearRectStencil(0,0,t.width,t.height),void(this._$context.cacheAttachment&&this._$endClip());const e=t.width,i=t.height,r=this._$context.path.createRectVertices(0,0,e,i),s=this._$context.vao.createFill(r);N(r.pop()),N(r);const n=this._$context.shaderList.shapeShaderVariants,a=n.getMaskShapeShader(!1,!1),h=a.uniform;n.setMaskShapeUniformIdentity(h,e,i);const o=s.indexRanges[0];this._$currentClip||(this._$currentClip=!0,this._$gl.enable(this._$gl.STENCIL_TEST)),this._$gl.enable(this._$gl.SAMPLE_ALPHA_TO_COVERAGE),this._$gl.stencilFunc(this._$gl.ALWAYS,0,255),this._$gl.stencilOp(this._$gl.REPLACE,this._$gl.REPLACE,this._$gl.REPLACE),this._$gl.stencilMask(1<<t.clipLevel),this._$gl.colorMask(!1,!1,!1,!1),a._$containerClip(s,o.first,o.count);const l=s.indexRanges;for(let t=0;t<l.length;++t)Ht.indexRangePool.push(l[t]);N(s.indexRanges),this._$context.vao.releaseFill(s),this._$endClipDef()}_$drawContainerClip(){const t=this._$context.frameBuffer.currentAttachment;if(!t)throw new Error(\"mask currentAttachment is null.\");const e=t.clipLevel,i=this._$context.shaderList.shapeShaderVariants,r=i.getMaskShapeShader(!1,!1),s=r.uniform;let n=e;const a=t.width,h=t.height;this._$gl.enable(this._$gl.SAMPLE_ALPHA_TO_COVERAGE),this._$gl.stencilFunc(this._$gl.ALWAYS,0,255),this._$gl.stencilOp(this._$gl.KEEP,this._$gl.INVERT,this._$gl.INVERT),this._$gl.colorMask(!1,!1,!1,!1);const o=this._$poolClip.length;for(let t=0;t<o;++t){const t=this._$poolClip.shift();if(!t)continue;i.setMaskShapeUniform(s,!1,t.matrixA,t.matrixB,t.matrixC,t.matrixD,t.matrixE,t.matrixF,t.matrixG,t.matrixH,t.matrixI,t.viewportWidth,t.viewportHeight,null);const o=t.vertexArrayObject.indexRanges;for(let e=0;e<o.length;++e){const i=o[e];this._$gl.stencilMask(1<<n-1),r._$containerClip(t.vertexArrayObject,i.first,i.count),Ht.indexRangePool.push(i)}N(o),this._$context.vao.releaseFill(t.vertexArrayObject),++n,n>7&&(this._$unionStencilMask(e,a,h),n=e)}n>e+1&&this._$unionStencilMask(e,a,h)}_$unionStencilMask(t,e,i){const r=this._$context.path.createRectVertices(0,0,e,i),s=this._$context.vao.createFill(r);N(r.pop()),N(r);const n=this._$context.shaderList.shapeShaderVariants,a=n.getMaskShapeShader(!1,!1),h=a.uniform;n.setMaskShapeUniformIdentity(h,e,i);const o=s.indexRanges[0];this._$gl.stencilFunc(this._$gl.LEQUAL,1<<t-1,255),this._$gl.stencilOp(this._$gl.ZERO,this._$gl.REPLACE,this._$gl.REPLACE),this._$gl.stencilMask(~((1<<t-1)-1)),a._$containerClip(s,o.first,o.count),this._$poolClip.length&&(this._$gl.stencilFunc(this._$gl.ALWAYS,0,255),this._$gl.stencilOp(this._$gl.KEEP,this._$gl.INVERT,this._$gl.INVERT));const l=s.indexRanges;for(let t=0;t<l.length;++t)Ht.indexRangePool.push(l[t]);N(s.indexRanges),this._$context.vao.releaseFill(s)}_$onClip(t,e,i,r){return this._$clipStatus=!0,!!this._$containerClip&&(this._$poolClip.push({vertexArrayObject:t,matrixA:e[0],matrixB:e[1],matrixC:e[2],matrixD:e[3],matrixE:e[4],matrixF:e[5],matrixG:e[6],matrixH:e[7],matrixI:e[8],viewportWidth:i,viewportHeight:r}),!0)}_$onSave(){this._$clips.push(this._$clipStatus)}_$onRestore(){this._$clips.length&&(this._$clipStatus=!!this._$clips.pop())}}class Jt{constructor(t,e){this._$context=t,this._$gl=e,this._$enabled=!1,this._$funcCode=600,this.enable()}enable(){this._$enabled||(this._$enabled=!0,this._$gl.enable(this._$gl.BLEND)),this.reset()}disable(){this._$enabled&&(this._$enabled=!1,this._$gl.disable(this._$gl.BLEND))}reset(){613!==this._$funcCode&&(this._$funcCode=613,this._$gl.blendFunc(this._$gl.ONE,this._$gl.ONE_MINUS_SRC_ALPHA))}toOneZero(){610!==this._$funcCode&&(this._$funcCode=610,this._$gl.blendFunc(this._$gl.ONE,this._$gl.ZERO))}toZeroOne(){601!==this._$funcCode&&(this._$funcCode=601,this._$gl.blendFuncSeparate(this._$gl.ZERO,this._$gl.ONE,this._$gl.ONE,this._$gl.ZERO))}toAdd(){611!==this._$funcCode&&(this._$funcCode=611,this._$gl.blendFunc(this._$gl.ONE,this._$gl.ONE))}toScreen(){641!==this._$funcCode&&(this._$funcCode=641,this._$gl.blendFunc(this._$gl.ONE_MINUS_DST_COLOR,this._$gl.ONE))}toAlpha(){606!==this._$funcCode&&(this._$funcCode=606,this._$gl.blendFunc(this._$gl.ZERO,this._$gl.SRC_ALPHA))}toErase(){603!==this._$funcCode&&(this._$funcCode=603,this._$gl.blendFunc(this._$gl.ZERO,this._$gl.ONE_MINUS_SRC_ALPHA))}toSourceAtop(){673!==this._$funcCode&&(this._$funcCode=673,this._$gl.blendFunc(this._$gl.DST_ALPHA,this._$gl.ONE_MINUS_SRC_ALPHA))}toSourceIn(){670!==this._$funcCode&&(this._$funcCode=670,this._$gl.blendFunc(this._$gl.DST_ALPHA,this._$gl.ZERO))}toOperation(t){switch(t){case\"add\":this.toAdd();break;case\"screen\":this.toScreen();break;case\"alpha\":this.toAlpha();break;case\"erase\":this.toErase();break;case\"copy\":this.toOneZero();break;default:this.reset()}}drawImage(t,e,i,s,n,h,o,l,_,c,$,u,d,g,f,p,m,x){const b=this._$context.frameBuffer,v=b.currentAttachment,T=1!==h||1!==o||1!==l||1!==_||0!==c||0!==$||0!==u||0!==d,A=this._$context.shaderList.blendShaderVariants;switch(g){case\"normal\":case\"layer\":case\"add\":case\"screen\":case\"alpha\":case\"erase\":case\"copy\":{b.textureManager.bind0(t,x);const v=A.getNormalBlendShader(T);A.setNormalBlendUniform(v.uniform,e,i,s,n,m,f,p,T,h,o,l,_,c,$,u,d);const M=m[0],y=m[1],E=m[3],C=m[4],S=m[6],w=m[7];if(1!==M||0!==y||0!==E||1!==C){const t=e+s,h=i+n,o=+(t*M+h*E+S),l=+(t*M+i*E+S),_=+(e*M+h*E+S),c=+(e*M+i*E+S),$=+(t*y+h*C+w),u=+(t*y+i*C+w),d=+(e*y+h*C+w),g=+(e*y+i*C+w),m=a.MAX_VALUE,x=+r.min(r.min(r.min(r.min(m,o),l),_),c),b=+r.max(r.max(r.max(r.max(-m,o),l),_),c),v=+r.min(r.min(r.min(r.min(m,$),u),d),g),T=+r.max(r.max(r.max(r.max(-m,$),u),d),g),A=r.max(0,x),B=r.max(0,v),F=r.min(r.max(0,f-A),r.ceil(r.abs(b-x))),R=r.min(r.max(0,p-B),r.ceil(r.abs(T-v)));if(!F||!R)return;this._$gl.enable(this._$gl.SCISSOR_TEST),this._$gl.scissor(A,r.max(0,p-(B+R)),F+1,R+1)}else{const t=r.max(0,e+S),a=r.max(0,i+w),h=r.min(r.max(0,f-t),s),o=r.min(r.max(0,p-a),n);if(!h||!o)return;this._$gl.enable(this._$gl.SCISSOR_TEST),this._$gl.scissor(t,Math.max(0,p-(a+o)),h+1,o+1)}this.toOperation(g),v._$drawImage(),this._$gl.disable(this._$gl.SCISSOR_TEST)}break;default:{const r=Math.max(0,e+m[6]),a=Math.max(0,i+m[7]),M=Math.min(Math.max(0,f-r),s),y=Math.min(Math.max(0,p-a),n);if(!M||!y)return;const E=b.getTextureFromCurrentAttachment(),C=this._$context.frameBuffer.createTextureAttachment(s,n);this._$context._$bind(C),b.textureManager.bind0(E);const S=A.getClipShader(),w=S.uniform;A.setClipUniform(w,e,i,s,n,X(m),f,p),this.reset(),S._$drawImage();const B=b.getTextureFromCurrentAttachment();this._$context._$bind(v),b.textureManager.bind01(B,t,x);const F=A.getBlendShader(g,T);A.setBlendUniform(F.uniform,e,i,s,n,m,f,p,T,h,o,l,_,c,$,u,d),this._$gl.enable(this._$gl.SCISSOR_TEST),this._$gl.scissor(r,Math.max(0,p-(a+y)),M,y),this.toOneZero(),F._$drawImage(),this._$gl.disable(this._$gl.SCISSOR_TEST),b.releaseAttachment(C,!0)}}}}class Kt{constructor(t,e){this._$gl=t;const i=r.min(e,t.getParameter(t.MAX_SAMPLES));this._$maxTextureSize=r.min(8192,t.getParameter(t.MAX_TEXTURE_SIZE))-2,this._$contextStyle=new gt,this._$cacheBounds=C(),this._$matrix=k(1,0,0,0,1,0,0,0,1),this._$cacheAttachment=null,this._$stack=[],this._$globalAlpha=1,this._$imageSmoothingEnabled=!1,this._$globalCompositeOperation=\"normal\",this._$clearColorR=1,this._$clearColorG=1,this._$clearColorB=1,this._$clearColorA=1,this._$viewportWidth=0,this._$viewportHeight=0,this._$frameBufferManager=new xt(t,i),this._$path=new vt,this._$grid=new Tt,this._$offsetX=0,this._$offsetY=0,this._$blends=L(),this._$positions=L(),this._$isLayer=!1,this._$shaderList=new zt(this,t),this._$gradientLUT=new Wt(this,t),this._$vao=new jt(t),this._$mask=new Qt(this,t),this._$blend=new Jt(this,t),this._$maskBufferArray=[],this._$maskBoundsArray=[],this._$attachmentArray=[]}reset(){this._$globalAlpha=1,this._$globalCompositeOperation=\"normal\",this._$imageSmoothingEnabled=!1,this._$contextStyle.clear()}get isLayer(){return this._$isLayer}get canvas(){return this._$gl.canvas}get cacheAttachment(){return this._$cacheAttachment}set cacheAttachment(t){this._$cacheAttachment=t}get cacheBounds(){return this._$cacheBounds}get fillStyle(){return this._$contextStyle.fillStyle}set fillStyle(t){this._$contextStyle.fillStyle=t}get strokeStyle(){return this._$contextStyle.strokeStyle}set strokeStyle(t){this._$contextStyle.strokeStyle=t}get lineWidth(){return this._$contextStyle.lineWidth}set lineWidth(t){this._$contextStyle.lineWidth=t}get lineCap(){return this._$contextStyle.lineCap}set lineCap(t){this._$contextStyle.lineCap=t}get lineJoin(){return this._$contextStyle.lineJoin}set lineJoin(t){this._$contextStyle.lineJoin=t}get miterLimit(){return this._$contextStyle.miterLimit}set miterLimit(t){this._$contextStyle.miterLimit=t}get globalAlpha(){return this._$globalAlpha}set globalAlpha(t){this._$globalAlpha=V(t,0,1,1)}get imageSmoothingEnabled(){return this._$imageSmoothingEnabled}set imageSmoothingEnabled(t){this._$imageSmoothingEnabled=t}get globalCompositeOperation(){return this._$globalCompositeOperation}set globalCompositeOperation(t){this._$globalCompositeOperation=t}get frameBuffer(){return this._$frameBufferManager}get shaderList(){return this._$shaderList}get path(){return this._$path}get grid(){return this._$grid}get vao(){return this._$vao}get blend(){return this._$blend}_$getCurrentPosition(){return this._$positions[this._$positions.length-1]}_$getTextureScale(t,e){const i=r.max(t,e);return i>this._$maxTextureSize?this._$maxTextureSize/i:1}_$bind(t=null){if(!t)return;this._$frameBufferManager.bind(t);const e=t.color,i=t.stencil,r=t.width,s=t.height;this._$viewportWidth===r&&this._$viewportHeight===s||(this._$viewportWidth=r,this._$viewportHeight=s,this._$gl.viewport(0,0,r,s)),(e&&e.dirty||i&&i.dirty)&&(e&&(e.dirty=!1),i&&(i.dirty=!1),this._$gl.clearColor(0,0,0,0),this.clearRect(0,0,this._$viewportWidth,this._$viewportHeight),this._$gl.clearColor(this._$clearColorR,this._$clearColorG,this._$clearColorB,this._$clearColorA),this._$mask._$onClear(t.mask)),this._$mask._$onBind(t.mask)}setTransform(t,e,i,r,s,n){this._$matrix[0]=t,this._$matrix[1]=e,this._$matrix[3]=i,this._$matrix[4]=r,this._$matrix[6]=s,this._$matrix[7]=n}setMaxSize(t,e){this._$frameBufferManager.setMaxSize(t,e)}transform(t,e,i,r,s,n){const a=this._$matrix[0],h=this._$matrix[1],o=this._$matrix[3],l=this._$matrix[4],_=this._$matrix[6],c=this._$matrix[7];this._$matrix[0]=t*a+e*o,this._$matrix[1]=t*h+e*l,this._$matrix[3]=i*a+r*o,this._$matrix[4]=i*h+r*l,this._$matrix[6]=s*a+n*o+_,this._$matrix[7]=s*h+n*l+c}drawImage(t,e,i,r,s,n=null){let a=1,h=1,o=1,l=0,_=0,c=0;const $=this._$globalAlpha;n&&(a=n[0],h=n[1],o=n[2],l=n[4]/255,_=n[5]/255,c=n[6]/255),this.blend.drawImage(t,e,i,r,s,a,h,o,$,l,_,c,0,this._$globalCompositeOperation,this._$viewportWidth,this._$viewportHeight,this._$matrix,this._$imageSmoothingEnabled)}_$setColor(t=0,e=0,i=0,r=0){this._$clearColorR=t,this._$clearColorG=e,this._$clearColorB=i,this._$clearColorA=r,this._$gl.clearColor(t,e,i,r)}clearRect(t,e,i,r){this._$mask._$onClearRect(),this._$gl.enable(this._$gl.SCISSOR_TEST),this._$gl.scissor(t,e,i,r),this._$gl.clear(this._$gl.COLOR_BUFFER_BIT|this._$gl.STENCIL_BUFFER_BIT),this._$gl.disable(this._$gl.SCISSOR_TEST)}_$clearRectStencil(t,e,i,r){this._$mask._$onClearRect(),this._$gl.enable(this._$gl.SCISSOR_TEST),this._$gl.scissor(t,e,i,r),this._$gl.clear(this._$gl.STENCIL_BUFFER_BIT),this._$gl.disable(this._$gl.SCISSOR_TEST)}moveTo(t,e){this._$path.moveTo(t,e)}lineTo(t,e){this._$path.lineTo(t,e)}beginPath(){this._$path.begin()}quadraticCurveTo(t,e,i,r){this._$path.quadTo(t,e,i,r)}bezierCurveTo(t,e,i,r,s,n){this._$path.cubicTo(t,e,i,r,s,n)}fill(){const t=this._$path.vertices;if(!t.length)return;const e=L();for(let i=0;i<t.length;++i){const r=t[i];10>r.length||e.push(r)}if(!e.length)return void N(e);const i=this._$vao.createFill(e),r=this.fillStyle;let s,n,a,h=this._$matrix;const o=this._$grid.enabled;if(r instanceof ut){const t=r.stops,e=\"linearRGB\"===r.rgb;if(s=this._$gradientLUT.generateForShape(t,e),this._$frameBufferManager.textureManager.bind0(s,!0),n=this._$shaderList.gradientShapeShaderVariants,\"linear\"===r.type)a=n.getGradientShapeShader(!1,o,!1,!1,r.mode),n.setGradientShapeUniform(a.uniform,!1,0,0,0,o,h,X(this._$matrix),this._$viewportWidth,this._$viewportHeight,this._$grid,!1,r.points,0);else{h=this._$stack[this._$stack.length-1];const t=0!==r.focalPointRatio;a=n.getGradientShapeShader(!1,o,!0,t,r.mode),n.setGradientShapeUniform(a.uniform,!1,0,0,0,o,h,X(this._$matrix),this._$viewportWidth,this._$viewportHeight,this._$grid,!0,r.points,r.focalPointRatio)}}else if(r instanceof dt){h=this._$stack[this._$stack.length-1];const t=r.colorTransform;s=r.texture,this._$frameBufferManager.textureManager.bind0(s,this._$imageSmoothingEnabled),n=this._$shaderList.shapeShaderVariants,a=n.getBitmapShapeShader(!1,r.repeat,o),t?n.setBitmapShapeUniform(a.uniform,!1,0,0,0,o,h,X(this._$matrix),this._$viewportWidth,this._$viewportHeight,this._$grid,s.width,s.height,t[0],t[1],t[2],this._$globalAlpha,t[4]/255,t[5]/255,t[6]/255,0):n.setBitmapShapeUniform(a.uniform,!1,0,0,0,o,h,X(this._$matrix),this._$viewportWidth,this._$viewportHeight,this._$grid,s.width,s.height,1,1,1,this._$globalAlpha,0,0,0,0)}else n=this._$shaderList.shapeShaderVariants,a=n.getSolidColorShapeShader(!1,this._$grid.enabled),n.setSolidColorShapeUniform(a.uniform,!1,0,0,0,o,h,this._$viewportWidth,this._$viewportHeight,this._$grid,r,this._$globalAlpha);const l=this._$shaderList.shapeShaderVariants,_=l.getMaskShapeShader(!1,o);l.setMaskShapeUniform(_.uniform,o,h[0],h[1],h[2],h[3],h[4],h[5],h[6],h[7],h[8],this._$viewportWidth,this._$viewportHeight,this._$grid),this._$gl.enable(this._$gl.STENCIL_TEST),this._$gl.stencilMask(255),this._$gl.enable(this._$gl.SAMPLE_ALPHA_TO_COVERAGE),this._$gl.stencilFunc(this._$gl.ALWAYS,0,255),this._$gl.stencilOp(this._$gl.KEEP,this._$gl.INVERT,this._$gl.INVERT),this._$gl.colorMask(!1,!1,!1,!1),_._$fill(i),this._$gl.disable(this._$gl.SAMPLE_ALPHA_TO_COVERAGE),this._$gl.stencilFunc(this._$gl.NOTEQUAL,0,255),this._$gl.stencilOp(this._$gl.KEEP,this._$gl.ZERO,this._$gl.ZERO),this._$gl.colorMask(!0,!0,!0,!0),a._$fill(i),this._$gl.disable(this._$gl.STENCIL_TEST),this.releaseFillVertexArray(i)}releaseFillVertexArray(t){this._$vao.releaseFill(t);const e=t.indexRanges;for(let t=0;t<e.length;++t)Ht.indexRangePool.push(e[t]);N(e)}_$enterClip(){this._$mask._$enterClip()}_$beginClipDef(){this._$mask._$beginClipDef()}_$updateContainerClipFlag(t){this._$mask.containerClip=t}_$startClip(t,e){let i=e.xMin,s=e.yMin,n=Math.abs(e.xMax-e.xMin),a=Math.abs(e.yMax-e.yMin);const h=this._$frameBufferManager,o=h.currentAttachment;if(!o||!o.texture)throw new Error(\"the current Attachment is null.\");if(i>o.width||s>o.height)return null;if(n+i>o.width&&(n=o.width-i),a+s>o.height&&(a=o.height-s),0>i&&(n+=i,i=0),0>s&&(a+=s,s=0),0>=n||0>=a)return null;n=r.ceil(n),a=r.ceil(a),this._$cacheBounds.xMin=i,this._$cacheBounds.yMin=s,this._$cacheBounds.xMax=n,this._$cacheBounds.yMax=a,this._$cacheAttachment=o,this._$bind(h.createCacheAttachment(n,a,!0));const l=o.texture;return this.reset(),this.setTransform(1,0,0,1,0,0),this.drawImage(l,-i,-s,l.width,l.height),F(t[0],t[1],t[2],t[3],t[4]-e.xMin,t[5]-e.yMin)}_$endClipDef(){this._$mask._$endClipDef()}_$leaveClip(){this._$mask._$leaveClip()}_$drawContainerClip(){this._$mask._$drawContainerClip()}closePath(){this._$path.close()}stroke(){const t=this._$path.vertices;if(!t.length)return;const e=L();for(let i=0;i<t.length;++i){const r=t[i];6>r.length||e.push(r)}if(!e.length)return void N(e);const i=this._$vao.createStroke(t,this.lineCap,this.lineJoin);let s=this._$matrix;const n=this.strokeStyle;let a=r.sign(s[0]*s[4]);a>0&&0!==s[1]&&0!==s[3]&&(a=-r.sign(s[1]*s[3]));let h,o,l=.5*this.lineWidth;this._$grid.enabled?(h=r.abs(this._$grid.ancestorMatrixA+this._$grid.ancestorMatrixD),o=r.abs(this._$grid.ancestorMatrixB+this._$grid.ancestorMatrixE)):(h=r.abs(s[0]+s[3]),o=r.abs(s[1]+s[4]));const _=r.min(h,o),c=r.max(h,o);l*=c*(1-.3*r.cos(.5*r.PI*(_/c))),l=r.max(1,l);const $=this._$grid.enabled;let u,d,g;if(n instanceof ut){\"radial\"===n.type&&(s=this._$stack[this._$stack.length-1]);const t=n.stops,e=\"linearRGB\"===n.rgb;if(u=this._$gradientLUT.generateForShape(t,e),this._$frameBufferManager.textureManager.bind0(u,!0),d=this._$shaderList.gradientShapeShaderVariants,\"linear\"===n.type)g=d.getGradientShapeShader(!0,$,!1,!1,n.mode),d.setGradientShapeUniform(g.uniform,!0,l,a,this.miterLimit,$,s,X(this._$matrix),this._$viewportWidth,this._$viewportHeight,this._$grid,!1,n.points,0);else{s=this._$stack[this._$stack.length-1];const t=0!==n.focalPointRatio;g=d.getGradientShapeShader(!0,$,!0,t,n.mode),d.setGradientShapeUniform(g.uniform,!0,l,a,this.miterLimit,$,s,X(this._$matrix),this._$viewportWidth,this._$viewportHeight,this._$grid,!0,n.points,n.focalPointRatio)}}else if(n instanceof dt){s=this._$stack[this._$stack.length-1];const t=n.colorTransform;u=n.texture,this._$frameBufferManager.textureManager.bind0(u),d=this._$shaderList.shapeShaderVariants,g=d.getBitmapShapeShader(!0,n.repeat,this._$grid.enabled),t?d.setBitmapShapeUniform(g.uniform,!0,l,a,this.miterLimit,$,s,X(this._$matrix),this._$viewportWidth,this._$viewportHeight,this._$grid,u.width,u.height,t[0],t[1],t[2],this._$globalAlpha,t[4]/255,t[5]/255,t[6]/255,0):d.setBitmapShapeUniform(g.uniform,!0,l,a,this.miterLimit,$,s,X(this._$matrix),this._$viewportWidth,this._$viewportHeight,this._$grid,u.width,u.height,1,1,1,this._$globalAlpha,0,0,0,0)}else d=this._$shaderList.shapeShaderVariants,g=d.getSolidColorShapeShader(!0,this._$grid.enabled),d.setSolidColorShapeUniform(g.uniform,!0,l,a,this.miterLimit,$,s,this._$viewportWidth,this._$viewportHeight,this._$grid,n,this._$globalAlpha);g._$stroke(i),this._$vao.releaseStroke(i)}arc(t,e,i){this._$path.drawCircle(t,e,i)}clip(){const t=this._$path.vertices;if(!t.length)return;const e=L();for(let i=0;i<t.length;++i){const r=t[i];10>r.length||e.push(r)}if(!e.length)return void N(e);const i=this._$vao.createFill(e),r=this._$shaderList.shapeShaderVariants,s=r.getMaskShapeShader(!1,!1),n=s.uniform;r.setMaskShapeUniform(n,!1,this._$matrix[0],this._$matrix[1],this._$matrix[2],this._$matrix[3],this._$matrix[4],this._$matrix[5],this._$matrix[6],this._$matrix[7],this._$matrix[8],this._$viewportWidth,this._$viewportHeight,null),this._$mask._$onClip(i,this._$matrix,this._$viewportWidth,this._$viewportHeight)||(s._$fill(i),this.beginPath())}save(){const t=this._$matrix;this._$stack.push(k(t[0],t[1],t[2],t[3],t[4],t[5],t[6],t[7],t[8])),this._$mask._$onSave()}restore(){var t;this._$stack.length&&(t=this._$matrix,T.push(t),this._$matrix=this._$stack.pop()||k()),this._$mask._$onRestore()}createPattern(t,e,i){return new dt(this,t,e,i)}createLinearGradient(t,e,i,r,s=\"rgb\",n=\"pad\"){return(new ut).linear(t,e,i,r,s,n)}createRadialGradient(t,e,i,r,s,n,a=\"rgb\",h=\"pad\",o=0){return(new ut).radial(t,e,i,r,s,n,a,h,o)}_$applyBlurFilter(t,e,i){const s=this._$frameBufferManager,n=s.currentAttachment;if(!n)throw new Error(\"the current attachment is null.\");const a=n.width,h=n.height;s.textureManager.bind0(t,!0);const o=r.ceil(.5*i),l=1-(o-.5*i),_=1+i,c=this._$shaderList.filterShaderVariants,$=c.getBlurFilterShader(o);c.setBlurFilterUniform($.uniform,a,h,e,l,_),$._$drawImage()}_$applyBitmapFilter(t,e,i,r,s,n,a,h,o,l,_,c,$,u,d,g=null,f=null,p=null,m=0,x=0,b=0,v=0,T=0,A=0,M=0,y=0){const E=this._$frameBufferManager,C=\"inner\"===$,S=E.currentAttachment,w=E.getTextureFromCurrentAttachment();let B=null;const F=null!==g&&null!==f&&null!==p;let R;null!==g&&null!==f&&null!==p&&(B=this._$gradientLUT.generateForFilter(g,f,p)),C?F&&B?E.textureManager.bind02(t,B,!0):E.textureManager.bind0(t):(R=this._$frameBufferManager.createTextureAttachment(e,i),this._$bind(R),F&&B?E.textureManager.bind012(t,w,B,!0):E.textureManager.bind01(t,w));const I=!(C||\"full\"===$&&u),P=!(e===h&&i===o&&0===l&&0===_),k=!(1===d),L=this._$shaderList.filterShaderVariants,N=L.getBitmapFilterShader(I,P,c,$,u,k,F);L.setBitmapFilterUniform(N.uniform,e,i,r,s,n,a,h,o,l,_,c,d,m,x,b,v,T,A,M,y,I,P,k,F),C?u?this.blend.toSourceIn():this.blend.toSourceAtop():this.blend.toOneZero(),N._$drawImage(),C||E.releaseAttachment(S,!0)}_$applyColorMatrixFilter(t,e){this._$frameBufferManager.textureManager.bind0(t,!0);const i=this._$shaderList.filterShaderVariants,r=i.getColorMatrixFilterShader();i.setColorMatrixFilterUniform(r.uniform,e),this.blend.reset(),r._$drawImage()}_$applyConvolutionFilter(t,e,i,r,s,n,a,h,o,l,_,c){const $=t.width,u=t.height,d=this._$frameBufferManager.createTextureAttachment($,u);this._$bind(d),this._$frameBufferManager.textureManager.bind0(t,!0);const g=this._$shaderList.filterShaderVariants,f=g.getConvolutionFilterShader(e,i,a,h);g.setConvolutionFilterUniform(f.uniform,$,u,r,s,n,h,o,l,_,c),this.blend.reset(),f._$drawImage()}_$applyDisplacementMapFilter(t,e,i,r,s,n,a,h,o,l,_,c,$,u){const d=t.width,g=t.height,f=this._$frameBufferManager.createTextureAttachment(d,g);this._$bind(f),s||(s={x:0,y:0});const p=this._$frameBufferManager.createTextureFromImage(e);this._$frameBufferManager.textureManager.bind01(t,p);const m=this._$shaderList.filterShaderVariants,x=m.getDisplacementMapFilterShader(n,a,l);m.setDisplacementMapFilterUniform(x.uniform,e.width,e.height,i,r,s.x,s.y,h,o,l,_,c,$,u),this.blend.reset(),x._$drawImage(),this._$frameBufferManager.releaseTexture(p)}_$startLayer(t){this._$positions.push(t),this._$blends.push(this._$isLayer),this._$isLayer=!0}_$endLayer(){const t=this._$positions.pop();t&&S(t),this._$isLayer=!!this._$blends.pop()}_$saveCurrentMask(){this._$maskBufferArray.push(this._$cacheAttachment),this._$cacheAttachment=null;const t=this._$cacheBounds;this._$maskBoundsArray.push(C(t.xMin,t.xMax,t.yMin,t.yMax))}_$saveAttachment(t,e,i=!1){const r=this._$frameBufferManager;this._$attachmentArray.push(r.currentAttachment),this._$bind(r.createCacheAttachment(t,e,i))}_$restoreAttachment(t=!1){const e=this._$frameBufferManager;e.releaseAttachment(e.currentAttachment,t),this._$bind(this._$attachmentArray.pop())}_$restoreCurrentMask(){this._$cacheAttachment=this._$maskBufferArray.pop()||null,this._$cacheBounds=this._$maskBoundsArray.pop()||C()}getCurrentPosition(){return this._$positions[this._$positions.length-1]}textureScale(t,e){const i=r.max(t,e);return i>this._$maxTextureSize?this._$maxTextureSize/i:1}}class Zt extends ct{_$clip(t,e){let s=e;const n=this._$matrix;1===n[0]&&0===n[1]&&0===n[2]&&1===n[3]&&0===n[4]&&0===n[5]||(s=Y(e,n));const a=this._$getBounds(),h=z(a,s);S(a);const o=r.ceil(r.abs(h.xMax-h.xMin)),l=r.ceil(r.abs(h.yMax-h.yMin));switch(S(h),!0){case 0===o:case 0===l:case o===-1/0:case l===-1/0:case o===i:case l===i:return}super._$clip(t,s),s!==e&&R(s)}_$draw(t,e,i){if(!this._$visible||!this._$maxAlpha||!this._$canDraw)return;let r=i;const s=this._$colorTransform;if(1===s[0]&&1===s[1]&&1===s[2]&&1===s[3]&&0===s[4]&&0===s[5]&&0===s[6]&&0===s[7]||(r=G(i,s)),!V(r[3]+r[7]/255,0,1,0))return void(r!==i&&P(r));let n=e;const a=this._$matrix;1===a[0]&&0===a[1]&&0===a[2]&&1===a[3]&&0===a[4]&&0===a[5]||(n=Y(e,a)),super._$draw(t,n,r,this._$blendMode,this._$filters),n!==e&&R(n),r!==i&&P(r)}_$remove(){this._$xMin=0,this._$yMin=0,this._$xMax=0,this._$yMax=0,this._$recodes=null,super._$remove(),ne.push(this)}}class te extends _t{constructor(){super(),this._$background=!1,this._$backgroundColor=16777215,this._$border=!1,this._$borderColor=0,this._$wordWrap=!1,this._$textData=L(),this._$textAreaActive=!1,this._$thickness=0,this._$thicknessColor=0,this._$limitWidth=0,this._$limitHeight=0,this._$autoSize=\"none\",this._$widthTable=L(),this._$heightTable=L(),this._$objectTable=L(),this._$textHeightTable=L(),this._$xMin=0,this._$yMin=0,this._$xMax=0,this._$yMax=0,this._$maxScrollV=null,this._$scrollV=1,this._$textHeight=0,this._$verticalAlign=\"top\"}get width(){const t=z(this._$getBounds(null),this._$matrix),e=r.abs(t.xMax-t.xMin);switch(S(t),!0){case 0===e:case e===i:case e===-1/0:return 0;default:return e}}get height(){const t=z(this._$getBounds(null),this._$matrix),e=r.abs(t.yMax-t.yMin);switch(S(t),e){case 0:case i:case-1/0:return 0;default:return e}}get maxScrollV(){if(null===this._$maxScrollV){this._$maxScrollV=1;const t=this._$textHeightTable.length,e=this.height;if(e>this._$textHeight)return this._$maxScrollV;let i=0,r=0;for(;t>r&&(i+=this._$textHeightTable[r++],!(i>e));)this._$maxScrollV++}return this._$maxScrollV}_$clip(t,e){const i=this._$getBounds(),s=i.xMax,n=i.xMin,a=i.yMax,h=i.yMin;S(i);const o=r.ceil(r.abs(s-n)),l=r.ceil(r.abs(a-h));if(!o||!l)return;let _=e;const c=this._$matrix;1===c[0]&&0===c[1]&&0===c[2]&&1===c[3]&&0===c[4]&&0===c[5]||(_=Y(e,c)),t.reset(),t.setTransform(e[0],e[1],e[2],e[3],e[4],e[5]),t.beginPath(),t.moveTo(0,0),t.lineTo(o,0),t.lineTo(o,l),t.lineTo(0,l),t.lineTo(0,0),t.clip(),_!==e&&R(_)}_$draw(t,e,s){if(!this._$visible||this._$textAreaActive)return;if(!this._$background&&!this._$border&&2>this._$textData.length)return;let n=s;const h=this._$colorTransform;1===h[0]&&1===h[1]&&1===h[2]&&1===h[3]&&0===h[4]&&0===h[5]&&0===h[6]&&0===h[7]||(n=G(s,h));const o=V(n[3]+n[7]/255,0,1);if(!o)return;let l=e;const _=this._$matrix;1===_[0]&&0===_[1]&&0===_[2]&&1===_[3]&&0===_[4]&&0===_[5]||(l=Y(e,_));const c=this._$getBounds(null);c.xMin-=this._$thickness,c.xMax+=this._$thickness,c.yMin-=this._$thickness,c.yMax+=this._$thickness;const $=z(c,l),u=+$.xMax,d=+$.xMin,g=+$.yMax,f=+$.yMin;S($);const p=r.ceil(r.abs(u-d)),m=r.ceil(r.abs(g-f));switch(!0){case 0===p:case 0===m:case p===-1/0:case m===-1/0:case p===i:case m===i:return}if(0>d+p||0>f+m)return;const x=t.frameBuffer,b=x.currentAttachment;if(!b||d>b.width||f>b.height)return;let v=+r.sqrt(l[0]*l[0]+l[1]*l[1]);if(!a.isInteger(v)){const t=v.toString(),e=t.indexOf(\"e\");-1!==e&&(v=+t.slice(0,e)),v=+v.toFixed(4)}let T=+r.sqrt(l[2]*l[2]+l[3]*l[3]);if(!a.isInteger(T)){const t=T.toString(),e=t.indexOf(\"e\");-1!==e&&(T=+t.slice(0,e)),T=+T.toFixed(4)}if(0>d+p||0>f+m){if(!(this._$filters&&this._$filters.length&&this._$canApply(this._$filters)))return;{let t=C(0,p,0,m);for(let e=0;e<this._$filters.length;++e)t=this._$filters[e]._$generateFilterRect(t,v,T);if(0>t.xMin+t.xMax||0>t.yMin+t.yMax)return void S(t);S(t)}}const A=L(v,T),M=this._$instanceId,y=se.cacheStore,E=y.generateKeys(M,A);N(A);let w=y.get(E);if(this._$isUpdated()&&(y.removeCache(M),w=null),!w){const t=r.min(1,r.max(v,T)),i=r.ceil(r.abs(c.xMax-c.xMin)*v),a=r.ceil(r.abs(c.yMax-c.yMin)*T);n[3]=1;const h=new OffscreenCanvas(i+2*t,a+2*t).getContext(\"2d\");if(!h)return;if(this._$background||this._$border){if(h.beginPath(),h.moveTo(0,0),h.lineTo(i,0),h.lineTo(i,a),h.lineTo(0,a),h.lineTo(0,0),this._$background){const t=Q(this._$backgroundColor),e=r.max(0,r.min(255*t.A*s[3]+s[7],255))/255;h.fillStyle=`rgba(${t.R},${t.G},${t.B},${e})`,h.fill()}if(this._$border){const e=Q(this._$borderColor),i=r.max(0,r.min(255*e.A*s[3]+s[7],255))/255;h.lineWidth=t,h.strokeStyle=`rgba(${e.R},${e.G},${e.B},${i})`,h.stroke()}}h.save(),h.beginPath(),h.moveTo(2,2),h.lineTo(i-2,2),h.lineTo(i-2,a-2),h.lineTo(2,a-2),h.lineTo(2,2),h.clip(),h.beginPath(),h.setTransform(v,0,0,T,0,0),this._$doDraw(h,e,s,i/v),h.restore(),w=x.createTextureFromCanvas(h.canvas),y.set(E,w)}let B=!1,F=0,I=0;this._$filters&&this._$filters.length&&this._$canApply(this._$filters)&&(B=!0,w=this._$drawFilter(t,w,l,this._$filters,p,m),F=w._$offsetX,I=w._$offsetY);const k=r.atan2(l[1],l[0]),U=r.atan2(0-l[2],l[3]);if(B||!k&&!U)t.setTransform(1,0,0,1,d-F,f-I);else{const e=c.xMin*v,i=c.yMin*T,s=r.cos(k),n=r.sin(k),a=r.cos(U),h=r.sin(U);t.setTransform(s,n,0-h,a,e*s-i*h+l[4],e*n+i*a+l[5])}t.reset(),t.globalAlpha=o,t.imageSmoothingEnabled=!0,t.globalCompositeOperation=this._$blendMode,t.drawImage(w,0,0,w.width,w.height,n),N(E),S(c),l!==e&&R(l),n!==s&&P(n)}_$doDraw(t,e,i,s){const n=this.width,a=this.height;let h=0,o=0,l=0,_=0;if(\"top\"!==this._$verticalAlign&&this.height>this._$textHeight)switch(this._$verticalAlign){case\"middle\":_=(this.height-this._$textHeight+2)/2;break;case\"bottom\":_=this.height-this._$textHeight+2}const c=this._$textData.length;for(let $=0;$<c;++$){const c=this._$textData[$];if(0===c.width)continue;const u=h+c.x;if(\"none\"===this._$autoSize&&(o>a||u>n))continue;const d=c.textFormat,g=Q(c.textFormat._$color),f=r.max(0,r.min(255*g.A*i[3]+i[7],255))/255;if(t.fillStyle=`rgba(${g.R},${g.G},${g.B},${f})`,this._$thickness){const e=Q(this._$thicknessColor),s=r.max(0,r.min(255*e.A*i[3]+i[7],255))/255;t.lineWidth=this._$thickness,t.strokeStyle=`rgba(${e.R},${e.G},${e.B},${s})`}const p=c.yIndex;switch(c.mode){case\"break\":case\"wrap\":if(l++,this._$scrollV>l)continue;if(o+=this._$textHeightTable[p],h=this._$getAlignOffset(this._$objectTable[p],s),d._$underline){const s=c.textFormat._$size/12,n=Q(d._$color),a=r.max(0,r.min(255*n.A*i[3]+i[7],255))/255;t.lineWidth=r.max(1,1/r.min(e[0],e[3])),t.strokeStyle=`rgba(${n.R},${n.G},${n.B},${a})`,t.beginPath(),t.moveTo(h,_+o-s),t.lineTo(h+this._$widthTable[p],_+o-s),t.stroke()}break;case\"text\":{if(this._$scrollV>l)continue;let e=o-this._$heightTable[0];re||(e+=c.textFormat._$size/12*2),t.beginPath(),t.textBaseline=\"top\",t.font=J(d._$font,d._$size,d._$italic,d._$bold),this._$thickness&&t.strokeText(c.text,u,_+e),t.fillText(c.text,u,_+e)}break;case\"image\":if(!c.loaded)continue;t.beginPath(),t.drawImage(c.image,c.hspace,_+c.y,c.width,c.height)}}}_$getAlignOffset(t,e){const i=this._$widthTable[t.yIndex],s=t.textFormat,n=s._$blockIndent+s._$leftMargin>0?s._$blockIndent+s._$leftMargin:0;switch(!0){case!this._$wordWrap&&i>e:return r.max(0,n);case\"center\"===s._$align:case\"center\"===this._$autoSize:return r.max(0,e/2-n-s._$rightMargin-i/2);case\"right\"===s._$align:case\"right\"===this._$autoSize:return r.max(0,e-n-i-s._$rightMargin-2);default:return r.max(0,n+2)}}_$remove(){this._$xMin=0,this._$yMin=0,this._$xMax=0,this._$yMax=0,this._$textData.length=0,this._$widthTable.length=0,this._$heightTable.length=0,this._$objectTable.length=0,this._$textHeightTable.length=0,this._$textAreaActive=!1,super._$remove(),ae.push(this)}_$updateProperty(t){this._$textAreaActive=!!t.textAreaActive,this._$textData.length=0,this._$widthTable.length=0,this._$heightTable.length=0,this._$objectTable.length=0,this._$textHeightTable.length=0,this._$textData.push(...t.textData),this._$widthTable.push(...t.widthTable),this._$heightTable.push(...t.heightTable),this._$objectTable.push(...t.objectTable),this._$textHeightTable.push(...t.textHeightTable),this._$wordWrap=t.wordWrap,this._$limitWidth=t.limitWidth,this._$limitHeight=t.limitHeight,this._$autoSize=t.autoSize,this._$scrollV=t.scrollV,this._$textHeight=t.textHeight,this._$verticalAlign=t.verticalAlign,this._$border=t.border,this._$border&&(this._$borderColor=t.borderColor),this._$background=t.background,this._$background&&(this._$backgroundColor=t.backgroundColor),\"thickness\"in t&&(this._$thickness=t.thickness,this._$thicknessColor=t.thicknessColor)}_$update(t){super._$update(t),this._$textAreaActive=!!t.textAreaActive,this._$xMin=t.xMin,this._$yMin=t.yMin,this._$xMax=t.xMax,this._$yMax=t.yMax,t.textData&&this._$updateProperty(t)}}class ee extends _t{constructor(){super(),this._$imageBitmap=null,this._$context=null,this._$smoothing=!0}_$clip(t,e){const i=this._$xMax,r=this._$yMax;if(!i||!r)return;let s=e;const n=this._$matrix;1===n[0]&&0===n[1]&&0===n[2]&&1===n[3]&&0===n[4]&&0===n[5]||(s=Y(e,n)),t.reset(),t.setTransform(s[0],s[1],s[2],s[3],s[4],s[5]),t.beginPath(),t.moveTo(0,0),t.lineTo(i,0),t.lineTo(i,r),t.lineTo(0,r),t.lineTo(0,0),t.clip(),s!==e&&R(s)}_$draw(t,e,s){if(!this._$visible||!this._$imageBitmap||!this._$context)return;let n=s;const a=this._$colorTransform;1===a[0]&&1===a[1]&&1===a[2]&&1===a[3]&&0===a[4]&&0===a[5]&&0===a[6]&&0===a[7]||(n=G(s,a));const h=V(n[3]+n[7]/255,0,1,0);if(!h)return void(n!==s&&P(n));let o=e;const l=this._$matrix;1===l[0]&&0===l[1]&&0===l[2]&&1===l[3]&&0===l[4]&&0===l[5]||(o=Y(e,l));const _=this._$getBounds();S(_);const c=z(_,o),$=+c.xMax,u=+c.xMin,d=+c.yMax,g=+c.yMin;S(c);const f=r.ceil(r.abs($-u)),p=r.ceil(r.abs(d-g));switch(!0){case 0===f:case 0===p:case f===-1/0:case p===-1/0:case f===i:case p===i:return}const m=t.frameBuffer,x=m.currentAttachment;if(!x||u>x.width||g>x.height)return;if(0>u+f||0>g+p){if(!(this._$filters&&this._$filters.length&&this._$canApply(this._$filters)))return;{const t=+r.sqrt(o[0]*o[0]+o[1]*o[1]),e=+r.sqrt(o[2]*o[2]+o[3]*o[3]);let i=C(0,f,0,p);for(let r=0;r<this._$filters.length;++r)i=this._$filters[r]._$generateFilterRect(i,t,e);if(0>i.xMin+i.xMax||0>i.yMin+i.yMax)return void S(i);S(i)}}this._$context.drawImage(this._$imageBitmap,0,0);let b=m.textureManager._$createFromElement(this._$imageBitmap.width,this._$imageBitmap.height,this._$context.canvas,this._$smoothing);if(this._$filters&&this._$filters.length&&this._$canApply(this._$filters)){const e=+r.sqrt(o[0]*o[0]+o[1]*o[1]),i=+r.sqrt(o[2]*o[2]+o[3]*o[3]);if(1!==e||1!==i){const r=m.currentAttachment,s=m.createCacheAttachment(f,p,!1);t._$bind(s);const n=F(e,0,0,i,f/2,p/2),a=F(1,0,0,1,0-b.width/2,0-b.height/2),h=Y(n,a);R(n),R(a),t.reset(),t.setTransform(h[0],h[1],h[2],h[3],h[4],h[5]),t.drawImage(b,0,0,b.width,b.height),m.releaseTexture(b),R(h),b=m.getTextureFromCurrentAttachment(),m.releaseAttachment(s,!1),t._$bind(r)}b=this._$drawFilter(t,b,o,this._$filters,f,p),t.reset(),t.globalAlpha=h,t.imageSmoothingEnabled=this._$smoothing,t.globalCompositeOperation=this._$blendMode;const n=this._$getBounds(),a=z(n,o);S(n),t.setTransform(1,0,0,1,a.xMin-b._$offsetX,a.yMin-b._$offsetY),S(a),t.drawImage(b,0,0,b.width,b.height,s)}else t.reset(),t.globalAlpha=h,t.imageSmoothingEnabled=this._$smoothing,t.globalCompositeOperation=this._$blendMode,t.setTransform(o[0],o[1],o[2],o[3],o[4],o[5]),t.drawImage(b,0,0,b.width,b.height,s),m.releaseTexture(b);o!==e&&R(o),n!==s&&P(n)}_$remove(){this._$xMin=0,this._$yMin=0,this._$xMax=0,this._$yMax=0,this._$context=null,this._$imageBitmap=null,this._$smoothing=!0,super._$remove(),oe.push(this)}_$updateProperty(t){if(this._$xMin=t.xMin,this._$yMin=t.yMin,this._$xMax=t.xMax,this._$yMax=t.yMax,this._$imageBitmap=t.imageBitmap,this._$smoothing=t.smoothing,!this._$context&&this._$imageBitmap){const t=new _(this._$imageBitmap.width,this._$imageBitmap.height);this._$context=t.getContext(\"2d\")}}_$update(t){super._$update(t),this._$updateProperty(t)}}let ie=2;let re=!1;const se=new class{constructor(){this._$instances=new Map,this._$cacheStore=new Z,this._$matrix=F(1,0,0,1,0,0),this._$colorTransform=new h([1,1,1,1,0,0,0,0]),this._$width=0,this._$height=0,this._$stage=new $t,this._$samples=4,this._$canvas=null,this._$context=null,this._$attachment=null}get instances(){return this._$instances}get cacheStore(){return this._$cacheStore}get context(){return this._$context}get scaleX(){return this._$matrix[0]}stop(){this._$cacheStore.reset()}_$initialize(t,e=4,i=2){(t=>{ie=t})(i),this._$samples=e,this._$canvas=t;const r=t.getContext(\"webgl2\",{stencil:!0,premultipliedAlpha:!0,antialias:!1,depth:!1,preserveDrawingBuffer:!0});if(r){const t=new Kt(r,e);this._$context=t,this._$cacheStore.context=t}}_$setBackgroundColor(t=\"transparent\"){var e;if(this._$context)if(\"transparent\"===t)this._$context._$setColor(0,0,0,0);else{const i={A:(e=W(t))>>>24,R:(16711680&e)>>16,G:(65280&e)>>8,B:255&e};this._$context._$setColor(i.R/255,i.G/255,i.B/255,1)}}_$bitmapDraw(t,e,i,r){const s=this._$context;if(!s)return;s._$bind(this._$attachment),s.reset(),s.setTransform(1,0,0,1,0,0),s.clearRect(0,0,this._$width,this._$height),s.beginPath(),t._$draw(s,e,i);const n=s.frameBuffer,a=n.getTextureFromCurrentAttachment();n.unbind(),s.reset(),s.setTransform(1,0,0,1,0,0),s.clearRect(0,0,this._$width,this._$height),s.drawImage(a,0,0,this._$width,this._$height),s._$bind(this._$attachment);const h=r.getContext(\"2d\");h&&this._$canvas&&h.drawImage(this._$canvas,0,0)}_$draw(){if(!this._$width||!this._$height)return;const t=this._$context;if(!t)return;t._$bind(this._$attachment),t.reset(),t.setTransform(1,0,0,1,0,0),t.clearRect(0,0,this._$width,this._$height),t.beginPath(),this._$stage._$draw(t,this._$matrix,f),this._$stage._$updated=!1;const e=t.frameBuffer,i=e.getTextureFromCurrentAttachment();e.unbind(),t.reset(),t.setTransform(1,0,0,1,0,0),t.clearRect(0,0,this._$width,this._$height),t.drawImage(i,0,0,this._$width,this._$height),t._$bind(this._$attachment)}_$resize(t,e,i,r=0,s=0){if(this._$width=t,this._$height=e,!this._$canvas)return;if(this._$canvas.width===t&&this._$canvas.height===e)return;this._$canvas.width=t,this._$canvas.height=e;const n=this._$context;if(!n)return;n._$gl.viewport(0,0,t,e);const a=n.frameBuffer;this._$attachment&&(a.unbind(),a.releaseAttachment(this._$attachment,!0)),this._$attachment=a.createCacheAttachment(t,e,!1),this._$matrix[0]=i,this._$matrix[3]=i,this._$matrix[4]=r,this._$matrix[5]=s,a.setMaxSize(t,e),this._$stage._$updated=!0,this._$cacheStore.reset()}_$setStage(t){this._$stage._$instanceId=t,this._$instances.set(t,this._$stage)}_$updateStage(){this._$stage._$updated=!0}_$createDisplayObjectContainer(t){const e=le();e._$instanceId=t.instanceId,t.recodes&&(e._$recodes=t.recodes,e._$maxAlpha=t.maxAlpha||1,e._$canDraw=t.canDraw||!0,e._$xMin=t.xMin||0,e._$yMin=t.yMin||0,e._$xMax=t.xMax||0,e._$yMax=t.yMax||0),t.grid&&(e._$scale9Grid=t.grid),this._$instances.set(e._$instanceId,e)}_$createShape(t){const e=$e();e._$instanceId=t.instanceId,e._$parentId=t.parentId,t.recodes&&(e._$recodes=t.recodes),e._$maxAlpha=t.maxAlpha||1,e._$canDraw=t.canDraw||!0,e._$xMin=t.xMin||0,e._$yMin=t.yMin||0,e._$xMax=t.xMax||0,e._$yMax=t.yMax||0,t.characterId&&(e._$characterId=t.characterId),\"loaderInfoId\"in t&&(e._$loaderInfoId=t.loaderInfoId||0),t.grid&&(e._$scale9Grid=t.grid),this._$instances.set(e._$instanceId,e)}_$createVideo(t){const e=ce();e._$instanceId=t.instanceId,t.characterId&&(e._$characterId=t.characterId),\"loaderInfoId\"in t&&(e._$loaderInfoId=t.loaderInfoId||0),e._$updateProperty(t),this._$instances.set(e._$instanceId,e)}_$createTextField(t){const e=_e();e._$instanceId=t.instanceId,e._$xMin=t.xMin||0,e._$yMin=t.yMin||0,e._$xMax=t.xMax||0,e._$yMax=t.yMax||0,t.characterId&&(e._$characterId=t.characterId),\"loaderInfoId\"in t&&(e._$loaderInfoId=t.loaderInfoId||0),e._$updateProperty(t),this._$instances.set(e._$instanceId,e)}},ne=[],ae=[],he=[],oe=[],le=()=>he.pop()||new $t,_e=()=>ae.pop()||new te,ce=()=>oe.pop()||new ee,$e=()=>ne.pop()||new Zt;const ue=new class{constructor(){this.state=\"deactivate\",this.queue=[]}execute(){for(this.state=\"active\";this.queue.length;){const e=this.queue.shift();switch(e.command){case\"draw\":se._$draw();break;case\"setProperty\":{const t=se.instances;if(!t.has(e.instanceId))continue;t.get(e.instanceId)._$update(e)}break;case\"setChildren\":{const t=se.instances;if(!t.has(e.instanceId))continue;const i=t.get(e.instanceId);i._$doChanged(),i._$children=e.children}break;case\"remove\":{const t=se.instances;if(!t.has(e.instanceId))continue;t.get(e.instanceId)._$remove(),t.delete(e.instanceId)}break;case\"createShape\":se._$createShape(e);break;case\"createDisplayObjectContainer\":se._$createDisplayObjectContainer(e);break;case\"createTextField\":se._$createTextField(e);break;case\"createVideo\":se._$createVideo(e);break;case\"resize\":se._$resize(e.width,e.height,e.scale,e.tx,e.ty);break;case\"initialize\":se._$initialize(e.canvas,e.samples,e.devicePixelRatio);break;case\"setSafari\":t=e.isSafari,re=t;break;case\"setBackgroundColor\":se._$setBackgroundColor(e.backgroundColor);break;case\"setStage\":se._$setStage(e.instanceId);break;case\"stop\":se.stop();break;case\"removeCache\":se.cacheStore.removeCache(e.id);break;case\"bitmapDraw\":{const t=se.instances;if(!t.has(e.sourceId))continue;const i=t.get(e.sourceId),r=new _(e.width,e.height);se._$bitmapDraw(i,e.matrix||g,e.colorTransform||f,r);const s=r.transferToImageBitmap();globalThis.postMessage({command:\"bitmapDraw\",sourceId:e.sourceId,imageBitmap:s},[s])}}}var t;this.state=\"deactivate\"}};self.addEventListener(\"message\",(t=>{return e=void 0,i=void 0,s=function*(){ue.queue.push(t.data),\"deactivate\"===ue.state&&ue.execute()},new((r=void 0)||(r=Promise))((function(t,n){function a(t){try{o(s.next(t))}catch(t){n(t)}}function h(t){try{o(s.throw(t))}catch(t){n(t)}}function o(e){var i;e.done?t(e.value):(i=e.value,i instanceof r?i:new r((function(t){t(i)}))).then(a,h)}o((s=s.apply(e,i||[])).next())}));var e,i,r,s}))})();";

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
                if (event.data.command !== "bitmapDraw") {
                    return ;
                }

                const sourceId: number = event.data.sourceId;
                const object: BitmapDrawObjectImpl | void = $bitmapDrawMap.get(sourceId);
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