import { Stage } from "../next2d/display/Stage";
import { CacheStore } from "../util/CacheStore";
import { Event as Next2DEvent } from "../next2d/events/Event";
import { MouseEvent as Next2DMouseEvent } from "../next2d/events/MouseEvent";
import { Video } from "../next2d/media/Video";
import { Sound } from "../next2d/media/Sound";
import { EventPhase } from "../next2d/events/EventPhase";
import { CanvasToWebGLContext } from "../webgl/CanvasToWebGLContext";
import { SoundMixer } from "../next2d/media/SoundMixer";
import type { TextField } from "../next2d/text/TextField";
import type { StageQualityImpl } from "../interface/StageQualityImpl";
import type { PlayerOptionsImpl } from "../interface/PlayerOptionsImpl";
import type { PlayerHitObjectImpl } from "../interface/PlayerHitObjectImpl";
import type { PlayerModeImpl } from "../interface/PlayerModeImpl";
import type { AttachmentImpl } from "../interface/AttachmentImpl";
import type { EventListenerImpl } from "../interface/EventListenerImpl";
import type { FrameBufferManager } from "../webgl/FrameBufferManager";
import type { DisplayObjectImpl } from "../interface/DisplayObjectImpl";
import type { EventDispatcherImpl } from "../interface/EventDispatcherImpl";
import type { ParentImpl } from "../interface/ParentImpl";
import type { MovieClip } from "../next2d/display/MovieClip";
import type { Point } from "../next2d/geom/Point";
import type { Rectangle } from "../next2d/geom/Rectangle";
import type { RGBAImpl } from "../interface/RGBAImpl";
import {
    $devicePixelRatio,
    $document,
    $window
} from "../util/Shortcut";
import {
    $rendererWorker,
    $PREFIX,
    $audioContext,
    $TOUCH_START,
    $TOUCH_MOVE,
    $TOUCH_END,
    $MOUSE_DOWN,
    $MOUSE_MOVE,
    $MOUSE_UP,
    $MOUSE_WHEEL,
    $DOUBLE_CLICK,
    $MOUSE_LEAVE,
    $loadAudioData,
    $MATRIX_HIT_ARRAY_IDENTITY,
    $hitContext,
    $isTouch,
    $dropTarget,
    $dragRules, $isSafari
} from "../util/Util";
import {
    $Math,
    $performance,
    $getArray,
    $getFloat32Array6,
    $getMap,
    $uintToRGBA,
    $toColorInt,
    $requestAnimationFrame,
    $cancelAnimationFrame,
    $poolArray,
    $COLOR_ARRAY_IDENTITY,
    $clamp
} from "../util/RenderUtil";
import {
    $getEvent,
    $setEvent,
    $setEventType,
    $doUpdated,
    $setCurrentLoaderInfo,
    $getEventType,
    $isUpdated
} from "../util/Global";

/**
 * 描画のイベントや設定やコントロールの管理クラス
 * Management classes for drawing events, settings and controls
 *
 * @class
 */
export class Player
{
    private readonly _$stage: Stage;
    private readonly _$cacheStore: CacheStore;
    private _$mode: PlayerModeImpl;
    public _$actionOffset: number;
    public _$actions: MovieClip[];
    public _$loaders: EventDispatcherImpl<any>[];
    public _$sounds: Map<any, MovieClip>;
    private _$context: CanvasToWebGLContext|null;
    private readonly _$hitObject: PlayerHitObjectImpl;
    private _$rollOverObject: DisplayObjectImpl<any> | null;
    private _$mouseOverTarget: DisplayObjectImpl<any> | null;
    private readonly _$ratio: number;
    public _$stopFlag: boolean;
    private _$startTime: number;
    private _$fps: number;
    private _$isLoad: boolean;
    public _$loadStatus: number;
    public _$width: number;
    public _$height: number;
    private _$baseWidth: number;
    private _$baseHeight: number;
    public _$scale: number;
    private readonly _$matrix: Float32Array;
    private _$tx: number;
    private _$ty: number;
    public _$state: "up" | "down";
    private _$hitTestStart: boolean;
    private _$stageX: number;
    private _$stageY: number;
    private readonly _$broadcastEvents: Map<any, any>;
    private _$optionWidth: number;
    private _$optionHeight: number;
    private _$tagId: string;
    private _$bgColor: string;
    private _$base: string;
    public readonly _$videos: Video[];
    public readonly _$sources: Sound[];
    private _$fullScreen: boolean;
    private readonly _$quality: StageQualityImpl;
    private _$textField: TextField | null;
    private _$touchY: number;
    private _$timerId: number;
    private _$loadId: number;
    public _$attachment: AttachmentImpl | null;
    private readonly _$canvas: HTMLCanvasElement;
    private _$deltaX: number;
    private _$deltaY: number;
    private _$clickTarget: ParentImpl<any> | null;
    private _$actionProcess: boolean;

    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        /**
         * @type {Stage}
         * @private
         */
        this._$stage = new Stage();
        this._$stage._$player = this;

        /**
         * @type {CacheStore}
         * @private
         */
        this._$cacheStore = new CacheStore();

        /**
         * @type {string}
         * @private
         */
        this._$mode = "loader";

        /**
         * @type {number}
         * @private
         */
        this._$actionOffset = 0;

        /**
         * @type {array}
         * @private
         */
        this._$actions = $getArray();

        /**
         * @type {array}
         * @public
         */
        this._$loaders = $getArray();

        /**
         * @type {Map}
         * @private
         */
        this._$sounds = $getMap();

        /**
         * @type {object}
         * @private
         */
        this._$hitObject = {
            "x": 0,
            "y": 0,
            "pointer": "",
            "hit": null
        };

        /**
         * @type {DisplayObject}
         * @default null
         * @private
         */
        this._$rollOverObject = null;

        /**
         * @type {DisplayObject}
         * @default null
         * @private
         */
        this._$mouseOverTarget = null;

        /**
         * @type {number}
         * @private
         */
        this._$ratio = $devicePixelRatio;

        /**
         * @type {boolean}
         * @default true
         * @private
         */
        this._$stopFlag = true;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$startTime = 0;

        /**
         * @type {number}
         * @default 16
         * @private
         */
        this._$fps = 16;

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$isLoad = false;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$loadStatus = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$width = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$height = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$baseWidth = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$baseHeight = 0;

        /**
         * @type {number}
         * @default 1
         * @private
         */
        this._$scale = 1;

        /**
         * @type {Float32Array}
         * @private
         */
        this._$matrix = $getFloat32Array6(1, 0, 0, 1, 0, 0); // fixed size 6

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$tx = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$ty = 0;

        /**
         * @type {string}
         * @default up
         * @private
         */
        this._$state = "up";

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$hitTestStart = false;

        /**
         * @type {number}
         * @default -1
         * @private
         */
        this._$stageX = -1;

        /**
         * @type {number}
         * @default -1
         * @private
         */
        this._$stageY = -1;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$deltaX = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$deltaY = 0;

        /**
         * @type {Map}
         * @private
         */
        this._$broadcastEvents = $getMap();

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$optionWidth = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$optionHeight = 0;

        /**
         * @type {string}
         * @default ""
         * @private
         */
        this._$tagId = "";

        /**
         * @type {string}
         * @default "transparent"
         * @private
         */
        this._$bgColor = "transparent";

        /**
         * @type {string}
         * @default ""
         * @private
         */
        this._$base = "";

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$fullScreen = false;

        /**
         * @type {string}
         * @default high
         * @private
         */
        this._$quality = "high";

        /**
         * @type {array}
         * @private
         */
        this._$sources = $getArray();

        /**
         * @type {array}
         * @private
         */
        this._$videos = $getArray();

        /**
         * @type {TextField}
         * @default null
         * @private
         */
        this._$textField = null;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$touchY = 0;

        /**
         * @type {number}
         * @default -1
         * @private
         */
        this._$timerId = -1;

        /**
         * @type {number}
         * @default -1
         * @private
         */
        this._$loadId  = -1;

        /**
         * @type {CanvasToWebGLContext}
         * @default null
         * @private
         */
        this._$context = null;

        /**
         * @type {AttachmentImpl}
         * @default null
         * @private
         */
        this._$attachment = null;

        /**
         * @type {DisplayObject}
         * @default null
         * @private
         */
        this._$clickTarget = null;

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$actionProcess = false;

        /**
         * @type {HTMLCanvasElement}
         * @private
         */
        this._$canvas = $document.createElement("canvas");
    }

    /**
     * @return  {number}
     * @default 1
     * @const
     * @static
     */
    static get LOAD_START (): number
    {
        return 1;
    }

    /**
     * @return {number}
     * @default 2
     * @const
     * @static
     */
    static get LOAD_END (): number
    {
        return 2;
    }

    /**
     * @type {HTMLCanvasElement}
     * @readonly
     * @public
     */
    get canvas (): HTMLCanvasElement
    {
        return this._$canvas;
    }

    /**
     * @return {Map}
     * @readonly
     * @public
     */
    get broadcastEvents (): Map<string, EventListenerImpl[]>
    {
        return this._$broadcastEvents;
    }

    /**
     * @member {CacheStore}
     * @return {CacheStore}
     * @readonly
     * @public
     */
    get cacheStore (): CacheStore
    {
        return this._$cacheStore;
    }

    /**
     * @member {CanvasToWebGLContext|null}
     * @default null
     * @public
     */
    get context (): CanvasToWebGLContext|null
    {
        return this._$context;
    }
    set context (context: CanvasToWebGLContext|null)
    {
        this._$context = context;
    }

    /**
     * @member {string}
     * @default ""
     * @public
     */
    get base (): string
    {
        return this._$base;
    }
    set base (base: string)
    {
        if (base.indexOf("//") === -1) {

            const urls = base.split("/");
            if (urls[0] === "" || urls[0] === ".") {
                urls.shift();
            }
            urls.pop();

            this._$base = `${location.origin}/`;
            if (urls.length) {
                this._$base += `${urls.join("/")}/`;
            }

        } else {

            if (base.indexOf("?") === -1) {

                this._$base = base.slice(-1) === "/" ? base : `${base}/`;

            } else {

                const path  = base.split("?")[0];
                this._$base = path.slice(-1) === "/" ? path : `${path}/`;

            }

        }
    }

    /**
     * @return {Stage}
     * @readonly
     * @public
     */
    get stage (): Stage
    {
        return this._$stage;
    }

    /**
     * @member {number}
     * @readonly
     * @public
     */
    get x (): number
    {
        return this._$tx;
    }

    /**
     * @member {number}
     * @readonly
     * @public
     */
    get y (): number
    {
        return this._$ty;
    }

    /**
     * @member {number}
     * @readonly
     * @public
     */
    get scaleX (): number
    {
        return this._$matrix[0];
    }

    /**
     * @member {number}
     * @readonly
     * @public
     */
    get scaleY (): number
    {
        return this._$matrix[3];
    }

    /**
     * @member {string}
     * @public
     */
    get mode (): PlayerModeImpl
    {
        return this._$mode;
    }
    set mode (mode: PlayerModeImpl)
    {
        this._$mode = mode;
    }

    /**
     * @return {string}
     * @readonly
     * @public
     */
    get contentElementId (): string
    {
        return $PREFIX;
    }

    /**
     * @member {number}
     * @public
     */
    get width (): number
    {
        return this._$baseWidth;
    }
    set width (width: number)
    {
        this._$baseWidth = width | 0;
    }

    /**
     * @member {number}
     * @public
     */
    get height (): number
    {
        return this._$baseHeight;
    }
    set height (height: number)
    {
        this._$baseHeight = height | 0;
    }

    /**
     * @member {string}
     * @public
     */
    get bgColor (): string
    {
        return this._$bgColor;
    }
    set bgColor (bg_color: string)
    {
        this._$bgColor = `${bg_color}`;
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    play (): void
    {
        if (this._$stopFlag) {

            this._$stopFlag = false;

            if (this._$timerId > -1) {
                $cancelAnimationFrame(this._$timerId);
            }

            this._$startTime = $performance.now();

            const frameRate: number = this._$stage._$frameRate;
            this._$fps = 1000 / frameRate | 0;

            this._$timerId = $requestAnimationFrame((timestamp: number) =>
            {
                this._$run(timestamp);
            });
        }
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    stop (): void
    {
        if (this._$timerId > -1) {
            $cancelAnimationFrame(this._$timerId);
        }

        this._$stopFlag = true;
        this._$timerId  = -1;

        SoundMixer.stopAll();
        this._$cacheStore.reset();

        if ($rendererWorker) {
            $rendererWorker.postMessage({
                "command": "stop"
            });
        }
    }

    /**
     * @param  {string} id
     * @return {void}
     * @method
     * @public
     */
    removeCache (id: string): void
    {
        this._$cacheStore.removeCache(id);
        if ($rendererWorker) {
            $rendererWorker.postMessage({
                "command": "removeCache",
                "id": id
            });
        }
    }

    /**
     * @param  {object} [options=null]
     * @return {void}
     * @public
     */
    setOptions (options: PlayerOptionsImpl|null = null): void
    {
        if (options) {
            this._$optionWidth  = options.width   || this._$optionWidth;
            this._$optionHeight = options.height  || this._$optionHeight;
            this._$tagId        = options.tagId   || this._$tagId;
            this.base           = options.base    || this._$base;
            this._$bgColor      = options.bgColor || this._$bgColor;
            this._$fullScreen   = !!options.fullScreen;
        }
    }

    /**
     * @description NoCode Toolからのアクセスのみ
     *              Access from NoCode Tool only
     *
     * @param  {MouseEvent} [event = null]
     * @return {void}
     * @method
     * @private
     */
    _$loadWebAudio (event: MouseEvent | null = null): void
    {
        if (event) {
            // @ts-ignore
            this._$canvas.removeEventListener($MOUSE_UP, this._$loadWebAudio);
        }

        if (!$audioContext) {
            $loadAudioData();
        }
    }

    /**
     * @return {void}
     * @method
     * @private
     */
    _$updateLoadStatus (): void
    {
        if (this._$loadStatus === Player.LOAD_END) {
            if (this._$loadId > -1) {
                $cancelAnimationFrame(this._$loadId);
            }

            this._$loadId = -1;
            this._$loaded();
            return ;
        }

        this._$loadId = $requestAnimationFrame(() =>
        {
            this._$updateLoadStatus();
        });
    }

    /**
     * @return {void}
     * @method
     * @private
     */
    _$loaded (): void
    {
        const element: HTMLElement | null = $document
            .getElementById(this.contentElementId);

        if (element) {

            // background color
            this._$setBackgroundColor(this._$bgColor);

            // DOM
            this._$deleteNode();

            // append canvas
            element.appendChild(this._$canvas);

            // stage init action
            this._$stage._$prepareActions();

            // constructed event
            if (this._$broadcastEvents.has(Next2DEvent.FRAME_CONSTRUCTED)) {
                this._$dispatchEvent(new Next2DEvent(Next2DEvent.FRAME_CONSTRUCTED));
            }

            // frame1 action
            this._$doAction();

            // exit event
            if (this._$broadcastEvents.has(Next2DEvent.EXIT_FRAME)) {
                this._$dispatchEvent(new Next2DEvent(Next2DEvent.EXIT_FRAME));
            }

            // loader events
            const length: number = this._$loaders.length;
            for (let idx: number = 0; idx < length; ++idx) {

                const loader: EventDispatcherImpl<any> = this._$loaders.shift();

                // init event
                if (loader.hasEventListener(Next2DEvent.INIT)) {
                    loader.dispatchEvent(new Next2DEvent(Next2DEvent.INIT));
                }

                // complete event
                if (loader.hasEventListener(Next2DEvent.COMPLETE)) {
                    loader.dispatchEvent(new Next2DEvent(Next2DEvent.COMPLETE));
                }
            }

            // activate event
            if (this._$broadcastEvents.has(Next2DEvent.ACTIVATE)) {
                this._$dispatchEvent(new Next2DEvent(Next2DEvent.ACTIVATE));
            }

            // frame action
            this._$doAction();

            // render
            this._$draw();

            // start
            this.play();
        }

    }

    /**
     * @return {void}
     * @method
     * @private
     */
    _$initialize (): void
    {
        if ($document.readyState === "loading") {

            $window.addEventListener("DOMContentLoaded", () =>
            {
                this._$initialize();
            });

            return ;
        }

        const contentElementId: string = this.contentElementId;
        if (!this._$tagId) {

            $document
                .body
                .insertAdjacentHTML(
                    "beforeend", `<div id="${contentElementId}" tabindex="-1"></div>`
                );

        } else {

            const container: HTMLElement | null = $document.getElementById(this._$tagId);
            if (!container) {
                alert("Not Found Tag ID:" + this._$tagId);
                return ;
            }

            const div: HTMLElement | null = $document.getElementById(contentElementId);
            if (!div) {

                const element: HTMLDivElement = $document.createElement("div");
                element.id       = contentElementId;
                element.tabIndex = -1;
                container.appendChild(element);

            } else {

                this._$deleteNode();

            }

        }

        const element: HTMLElement | null = $document.getElementById(contentElementId);
        if (!element) {
            throw new Error("the content element is null.");
        }

        const parent: HTMLElement | null = element.parentElement;
        if (parent) {

            this._$initStyle(element);
            this._$buildWait();

            const width: number = this._$optionWidth
                ? this._$optionWidth
                : parent.tagName === "BODY"
                    ? $window.innerWidth
                    : parent.offsetWidth;

            const height: number = this._$optionHeight
                ? this._$optionHeight
                : parent.tagName === "BODY"
                    ? $window.innerHeight
                    : parent.offsetHeight;

            // set center
            if (this._$mode === "loader" && width && height) {
                this._$baseWidth  = width;
                this._$baseHeight = height;
                this._$resize();
            }
        }

        if (this._$mode === "loader") {
            this._$loadStatus = Player.LOAD_START;
            this._$updateLoadStatus();
        } else {
            this._$resize();
            this._$loaded();
        }
    }

    /**
     * @param   {object} element
     * @returns {void}
     * @method
     * @private
     */
    _$initStyle (element: HTMLElement): void
    {
        const style: CSSStyleDeclaration = element.style;

        // set css
        style.position        = "relative";
        style.top             = "0";
        style.left            = "0";
        style.backgroundColor = "transparent";
        style.overflow        = "hidden";
        style.padding         = "0";
        style.margin          = "0";
        style.userSelect      = "none";
        style.outline         = "none";

        const width: number  = this._$optionWidth;
        const height: number = this._$optionHeight;

        const parent: HTMLElement | null = element.parentElement;
        if (!parent) {
            throw new Error("the parentElement is null.");
        }

        if (parent.tagName === "BODY") {
            style.width  = width  ? `${width}px`  : `${window.innerWidth}px`;
            style.height = height ? `${height}px` : `${window.innerHeight}px`;
            return ;
        }

        style.width  = width  ? `${width}px`  : `${parent.offsetWidth}px`;
        style.height = height ? `${height}px` : `${parent.offsetHeight}px`;
    }

    /**
     * @return {void}
     * @method
     * @private
     */
    _$buildWait (): void
    {
        const element: HTMLElement | null = $document
            .getElementById(this.contentElementId);

        if (element) {

            const loadingId: string = `${this.contentElementId}_loading`;

            element.innerHTML = `<style>
#${loadingId} {
    position: absolute;
    top: 50%;
    left: 50%;
    margin: -24px 0 0 -24px;
    width: 50px;
    height: 50px;
    border-radius: 50px;
    border: 8px solid #dcdcdc;
    border-right-color: transparent;
    box-sizing: border-box;
    animation: ${loadingId} 0.8s infinite linear;
}
@keyframes ${loadingId} {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
</style>`;

            const div: HTMLDivElement = $document.createElement("div");
            div.id = loadingId;

            element.appendChild(div);
        }
    }

    /**
     * @returns {void}
     * @method
     * @private
     */
    _$deleteNode (): void
    {
        const element: HTMLElement | null = $document.getElementById(this.contentElementId);
        if (element) {
            while (element.childNodes.length) {
                element.removeChild(element.childNodes[0]);
            }
        }
    }

    /**
     * @return {void}
     * @private
     */
    _$initializeCanvas (): void
    {
        // main canvas
        this._$canvas.width  = 1;
        this._$canvas.height = 1;

        if ($rendererWorker) {

            $rendererWorker.postMessage({
                "command": "setStage",
                "instanceId": this._$stage._$instanceId
            });

            const offscreenCanvas: OffscreenCanvas = this
                ._$canvas
                .transferControlToOffscreen();

            $rendererWorker.postMessage({
                "command": "initialize",
                "canvas": offscreenCanvas,
                "samples": this._$getSamples(),
                "devicePixelRatio": $devicePixelRatio,
                "isSafari": $isSafari
            }, [offscreenCanvas]);

        } else {

            // create gl context
            const gl: WebGL2RenderingContext | null = this._$canvas.getContext("webgl2", {
                "stencil": true,
                "premultipliedAlpha": true,
                "antialias": false,
                "depth": false,
                "preserveDrawingBuffer": true
            });

            if (gl) {

                this._$context = new CanvasToWebGLContext(
                    gl, this._$getSamples()
                );

                this._$cacheStore.context = this._$context;

            } else {
                alert("WebGL setting is off. Please turn the setting on.");
            }

        }

        /**
         * @return {void}
         * @method
         * @private
         */
        const loadWebAudio = (): void =>
        {
            this._$canvas.removeEventListener($MOUSE_UP,  loadWebAudio);
            this._$canvas.removeEventListener($TOUCH_END, loadWebAudio);

            if (!$audioContext) {
                $loadAudioData();

                for (let idx = 0; idx < this._$videos.length; ++idx) {
                    const video: Video = this._$videos[idx];
                    if (!video._$video) {
                        continue;
                    }

                    video._$video.muted = false;
                }
            }
        };

        // @ts-ignore
        this._$canvas.addEventListener($TOUCH_END, loadWebAudio);

        // @ts-ignore
        this._$canvas.addEventListener($MOUSE_UP, loadWebAudio);

        // touch event
        this._$canvas.addEventListener($TOUCH_START, (event: TouchEvent) =>
        {
            $setEvent(event);
            $setEventType($TOUCH_START);

            // start position
            this._$touchY = event.changedTouches[0].pageY;
            this._$hitTest();
        });

        this._$canvas.addEventListener($TOUCH_MOVE, (event: TouchEvent) =>
        {
            $setEvent(event);
            $setEventType($TOUCH_MOVE);
            this._$hitTest();
        });

        this._$canvas.addEventListener($TOUCH_END, (event: TouchEvent) =>
        {
            $setEvent(event);
            $setEventType($TOUCH_END);
            this._$hitTest();
        });

        // mouse wheel
        this._$canvas.addEventListener($TOUCH_MOVE, (event: TouchEvent) =>
        {
            // update
            const pageY   = event.changedTouches[0].pageY;
            this._$deltaY = this._$touchY - pageY;
            this._$touchY = pageY;

            $setEvent(event);
            $setEventType($TOUCH_MOVE);

            this._$hitTest();
        }, { "passive": false });

        // mouse event
        this._$canvas.addEventListener($MOUSE_DOWN, (event: MouseEvent) =>
        {
            $setEvent(event);
            $setEventType($MOUSE_DOWN);

            if (!event.button) {
                this._$hitTest();
            }
        });

        this._$canvas.addEventListener($DOUBLE_CLICK, (event: MouseEvent) =>
        {
            $setEvent(event);
            $setEventType($DOUBLE_CLICK);

            if (!event.button) {
                this._$hitTest();
            }
        });

        this._$canvas.addEventListener($MOUSE_LEAVE, (event: MouseEvent) =>
        {
            $setEvent(event);
            $setEventType($MOUSE_LEAVE);

            this._$hitTest();

            $setEvent(null);
            this._$stageX = -1;
            this._$stageY = -1;
        });

        this._$canvas.addEventListener($MOUSE_UP, (event: MouseEvent) =>
        {
            $setEvent(event);
            $setEventType($MOUSE_UP);

            if (!event.button) {
                this._$hitTest();
            }
        });

        this._$canvas.addEventListener($MOUSE_MOVE, (event: MouseEvent) =>
        {
            $setEvent(event);
            $setEventType($MOUSE_MOVE);

            this._$hitTest();
        });

        // mouse wheel
        this._$canvas.addEventListener($MOUSE_WHEEL, (event: MouseEvent) =>
        {
            if (!event.defaultPrevented) {

                $setEvent(event);
                $setEventType($MOUSE_WHEEL);

                this._$hitTest();
            }
        }, { "passive": false });

        // set css
        let style: string = "";
        style += "position: absolute;";
        style += "top: 0;";
        style += "left: 0;";
        style += "-webkit-tap-highlight-color: rgba(0,0,0,0);";
        style += "backface-visibility: hidden;";
        style += "transform-origin: 0 0;";

        if ($devicePixelRatio !== 1) {
            style += `transform: scale(${1 / $devicePixelRatio});`;
        }

        this._$canvas.setAttribute("style", style);
    }

    /**
     * @return {void}
     * @method
     * @private
     */
    _$resize (): void
    {
        const div: HTMLElement | null = $document
            .getElementById(this.contentElementId);

        if (div) {

            // cache reset
            this._$stage._$doChanged();
            this._$cacheStore.reset();

            const parent: HTMLElement | null = div.parentElement;
            if (!parent) {
                throw new Error("the parentElement is null.");
            }

            const innerWidth: number = this._$optionWidth
                ? this._$optionWidth
                : parent.tagName === "BODY"
                    ? $window.innerWidth
                    : parent.offsetWidth
                        ? parent.offsetWidth
                        : parseFloat(parent.style.width);

            const innerHeight: number = this._$optionHeight
                ? this._$optionHeight
                : parent.tagName === "BODY"
                    ? $window.innerHeight
                    : parent.offsetHeight
                        ? parent.offsetHeight
                        : parseFloat(parent.style.height);

            const screenWidth: number = parent.tagName === "BODY"
                ? $window.innerWidth
                : parent.offsetWidth;

            const scale: number = $Math.min(
                innerWidth  / this._$baseWidth,
                innerHeight / this._$baseHeight
            );

            let width: number = this._$fullScreen
                ? innerWidth
                : this._$baseWidth * scale | 0;

            let height: number = this._$fullScreen
                ? innerHeight
                : this._$baseHeight * scale | 0;

            // div
            const style: CSSStyleDeclaration  = div.style;
            style.width  = `${width}px`;
            style.height = `${height}px`;
            style.top    = "0";
            style.left   = this._$fullScreen
                ? "0"
                : `${screenWidth / 2 - width / 2}px`;

            width  *= $devicePixelRatio;
            height *= $devicePixelRatio;

            // params
            this._$scale  = scale;
            this._$width  = width;
            this._$height = height;

            const mScale: number = this._$scale * this._$ratio;
            this._$matrix[0] = mScale;
            this._$matrix[3] = mScale;

            if (this._$fullScreen) {

                this._$tx = (width -
                    this._$baseWidth
                    * scale
                    * $devicePixelRatio) / 2;

                this._$ty = (height -
                    this._$baseHeight
                    * scale
                    * $devicePixelRatio) / 2;

                this._$matrix[4] = this._$tx;
                this._$matrix[5] = this._$ty;

            }

            // main canvas resize
            this._$resizeCanvas(width, height, mScale, this._$tx, this._$ty);

            if (this._$ratio > 1 && $devicePixelRatio > 1) {
                this._$canvas.style.transform = `scale(${1 / this._$ratio})`;
            }

            if (div.children.length > 1) {
                div.children[1].dispatchEvent(
                    new Event(`${$PREFIX}_blur`)
                );
            }
        }
    }

    /**
     * @description 表示用のcanvasを更新
     *              Update canvas for display
     *
     * @param  {string} [background_color=transparent]
     * @return {void}
     * @method
     * @public
     */
    _$setBackgroundColor (background_color = "transparent"): void
    {
        if ($rendererWorker) {

            $rendererWorker.postMessage({
                "command": "setBackgroundColor",
                "backgroundColor": background_color
            });

        } else {

            const context: CanvasToWebGLContext | null = this._$context;
            if (!context) {
                return ;
            }

            if (background_color === "transparent") {

                context._$setColor(0, 0, 0, 0);

            } else {

                const color: RGBAImpl = $uintToRGBA(
                    $toColorInt(background_color)
                );

                context._$setColor(
                    color.R / 255,
                    color.G / 255,
                    color.B / 255,
                    1
                );

            }

        }
    }

    /**
     * @param  {number} width
     * @param  {number} height
     * @param  {number} scale
     * @param  {number} [tx = 0]
     * @param  {number} [ty = 0]
     * @return {void}
     * @method
     * @private
     */
    _$resizeCanvas (
        width: number, height: number,
        scale: number, tx: number = 0, ty: number = 0
    ): void {

        if ($rendererWorker) {

            $rendererWorker.postMessage({
                "command": "resize",
                "width": width,
                "height": height,
                "scale": scale,
                "tx": tx,
                "ty": ty
            });

        } else {

            const context = this._$context;
            if (!context) { // unit test
                return ;
            }

            this._$canvas.width  = width;
            this._$canvas.height = height;

            context._$gl.viewport(0, 0, width, height);

            const manager: FrameBufferManager = context.frameBuffer;
            if (this._$attachment) {
                manager.unbind();
                manager.releaseAttachment(this._$attachment, true);
            }

            this._$attachment = manager
                .createCacheAttachment(width, height, false);

            // update cache max size
            context.setMaxSize(width, height);
        }
    }

    /**
     * @return {number}
     * @method
     * @private
     */
    _$getSamples (): number
    {
        switch (this._$quality) {

            case "high":
                return 4;

            case "medium":
                return 2;

            default:
                return 0;

        }
    }

    /**
     * @param  {Event} event
     * @return {boolean}
     * @method
     * @private
     */
    _$dispatchEvent (event: Next2DEvent): boolean
    {
        if (this._$broadcastEvents.size
            && this._$broadcastEvents.has(event.type)
        ) {

            // clone
            const events: EventListenerImpl[] = this
                ._$broadcastEvents
                .get(event.type)
                .slice(0);

            // start target
            event.eventPhase = EventPhase.AT_TARGET;

            for (let idx: number = 0; idx < events.length; ++idx) {

                const obj: EventListenerImpl = events[idx];

                // event execute
                event.currentTarget = obj.target;

                event.listener = obj.listener;
                obj.listener.call(null, event);

                if (event._$stopImmediatePropagation) {
                    break;
                }

            }

            $poolArray(events);

            return true;

        }

        return false;
    }

    /**
     * @param  {number} timestamp
     * @return {void}
     * @method
     * @private
     */
    _$run (timestamp: number = 0): void
    {
        if (this._$stopFlag) {
            return ;
        }

        // delay action
        this._$doAction();

        const delta: number = timestamp - this._$startTime;
        if (delta > this._$fps) {

            // update
            this._$startTime = timestamp - delta % this._$fps;

            // execute
            this._$action();

            // start sound
            if (this._$sounds.size) {
                for (const movieClip of this._$sounds.values()) {
                    movieClip._$soundPlay();
                }
                this._$sounds.clear();
            }

            // draw
            this._$draw();

            // draw event
            if (!$isTouch
                && !this._$hitTestStart
                && this._$state === "up"
                && this._$stageX > -1
                && this._$stageY > -1
                && $getEvent()
            ) {
                this._$pointerCheck();
            }

        } else {

            if (this._$videos.length && !$rendererWorker) {
                this._$draw();
            }

        }

        // next frame
        this._$timerId = $requestAnimationFrame((timestamp: number) =>
        {
            this._$run(timestamp);
        });
    }

    /**
     * @return {void}
     * @method
     * @private
     */
    _$pointerCheck ()
    {
        const stageX: number = this._$stageX;
        const stageY: number = this._$stageY;

        // setup
        this._$hitObject.x       = stageX;
        this._$hitObject.y       = stageY;
        this._$hitObject.pointer = "";
        this._$hitObject.hit     = null;

        // reset
        $hitContext.setTransform(1, 0, 0, 1, 0, 0);
        $hitContext.beginPath();

        // hit test
        $MATRIX_HIT_ARRAY_IDENTITY[4] = this._$tx / this._$scale / $devicePixelRatio;
        $MATRIX_HIT_ARRAY_IDENTITY[5] = this._$ty / this._$scale / $devicePixelRatio;
        this._$stage._$mouseHit(
            $hitContext, $MATRIX_HIT_ARRAY_IDENTITY,
            this._$hitObject, true
        );

        // change state
        // params
        let instance: DisplayObjectImpl<any> = null;
        let target: DisplayObjectImpl<any>   = null;
        let canPointerText: boolean = false;
        let canPointer: boolean     = false;

        // execute
        if (this._$hitObject.hit) {

            instance = this._$hitObject.hit;

            // (1) mouseOut
            if (this._$mouseOverTarget
                && this._$mouseOverTarget !== instance
            ) {

                const outInstance: DisplayObjectImpl<any> = this._$mouseOverTarget;

                if (outInstance.willTrigger(Next2DMouseEvent.MOUSE_OUT)) {
                    outInstance.dispatchEvent(new Next2DMouseEvent(
                        Next2DMouseEvent.MOUSE_OUT, true, false
                    ));
                }

            }

            // rollOut and rollOver
            if (this._$rollOverObject !== instance) {

                let hitParent = null;
                if (this._$rollOverObject) {

                    // (2) prev object rollOut
                    target = this._$rollOverObject;

                    if (target.willTrigger(Next2DMouseEvent.ROLL_OUT)) {
                        target.dispatchEvent(new Next2DMouseEvent(
                            Next2DMouseEvent.ROLL_OUT, false, false
                        ));
                    }

                    // rollOver flag instance
                    hitParent = target._$parent;
                    while (hitParent && hitParent._$root !== hitParent) {

                        if (hitParent === instance) {
                            break;
                        }

                        if (hitParent._$mouseEnabled
                            && hitParent._$outCheck(stageX, stageY)
                        ) {

                            let isUpperLayer = false;
                            let check = instance;
                            while (check && check._$root !== check) {

                                if (check !== hitParent) {
                                    check = check._$parent;
                                    continue;
                                }

                                isUpperLayer = true;

                                break;
                            }

                            if (!isUpperLayer && hitParent._$parent === instance._$parent
                                && hitParent._$index > instance._$index
                            ) {
                                isUpperLayer = true;
                            }

                            if (isUpperLayer) {
                                break;
                            }

                        }

                        if (hitParent.willTrigger(Next2DMouseEvent.ROLL_OUT)) {
                            hitParent.dispatchEvent(new Next2DMouseEvent(
                                Next2DMouseEvent.ROLL_OUT, false, false
                            ));
                        }

                        hitParent = hitParent._$parent;

                    }
                }

                // (3) current object rollOver
                target = instance;
                for (;;) {

                    if (target.willTrigger(Next2DMouseEvent.ROLL_OVER)) {
                        target.dispatchEvent(new Next2DMouseEvent(
                            Next2DMouseEvent.ROLL_OVER, false, false
                        ));
                    }

                    target = target._$parent;
                    if (!target || target === hitParent
                        || target.stage === target
                    ) {
                        break;
                    }

                }

            }

            this._$rollOverObject = instance;

            // (4) mouseOver
            switch (true) {

                case this._$mouseOverTarget === null:
                case this._$mouseOverTarget !== instance:

                    if (instance && instance.willTrigger(Next2DMouseEvent.MOUSE_OVER)) {
                        instance.dispatchEvent(new Next2DMouseEvent(
                            Next2DMouseEvent.MOUSE_OVER, true, false
                        ));
                    }

                    // set target
                    this._$mouseOverTarget = instance;
                    break;

            }

            // click reset
            if (this._$state === "up") {
                this._$clickTarget = null;
            }

            // PC
            if (!$isTouch && this._$state === "up") {

                target = instance;
                while (target && target.root !== target) {

                    if ("_$text" in target) {
                        if (target.type === "input") {
                            canPointerText = true;
                            break;
                        }
                    }

                    if ("buttonMode" in target && target.buttonMode) {
                        canPointer = true;
                        break;
                    }

                    target = target._$parent;

                }

            }

        } else {

            // (1) mouseOut
            if (this._$mouseOverTarget) {

                instance = this._$mouseOverTarget;

                if (instance.willTrigger(Next2DMouseEvent.MOUSE_OUT)) {
                    instance.dispatchEvent(new Next2DMouseEvent(
                        Next2DMouseEvent.MOUSE_OUT, true, false
                    ));
                }
            }

            // (2) rollOut
            if (this._$rollOverObject) {

                target = this._$rollOverObject;

                // parent target
                while (target && target.root !== target) {

                    if (target.willTrigger(Next2DMouseEvent.ROLL_OUT)) {
                        target.dispatchEvent(new Next2DMouseEvent(
                            Next2DMouseEvent.ROLL_OUT, false, false
                        ));
                    }

                    target = target._$parent;

                }

            }

            // reset
            this._$rollOverObject  = null;
            this._$mouseOverTarget = null;
        }

        // change cursor
        switch (true) {

            case canPointerText:
                this._$canvas.style.cursor = "text";
                break;

            case canPointer:
                this._$canvas.style.cursor = "pointer";
                break;

            case !$isTouch && this._$state === "up":
                this._$canvas.style.cursor = "auto";
                break;

        }

        if (this._$actions.length > 1) {
            this._$doAction();
        }
    }

    /**
     * @return {void}
     * @method
     * @private
     */
    _$action ()
    {

        if (this._$stopFlag) {
            return ;
        }

        let loaders = null;

        const length = this._$loaders.length;
        if (length) {

            // clone
            loaders = this._$loaders.slice(0);

            // array reset
            this._$loaders.length = 0;

            for (let idx = 0; idx < length; ++idx) {

                const loader = loaders[idx];

                // first action
                if ("content" in loader) {
                    loader.content._$prepareActions();
                }
            }
        }

        // next frame
        this._$stage._$nextFrame();

        // enter frame event
        if (this._$broadcastEvents.has(Next2DEvent.ENTER_FRAME)) {
            this._$dispatchEvent(new Next2DEvent(Next2DEvent.ENTER_FRAME));
        }

        // constructed event
        if (this._$broadcastEvents.has(Next2DEvent.FRAME_CONSTRUCTED)) {
            this._$dispatchEvent(new Next2DEvent(Next2DEvent.FRAME_CONSTRUCTED));
        }

        // execute frame action
        this._$doAction();

        // exit event
        if (this._$broadcastEvents.has(Next2DEvent.EXIT_FRAME)) {
            this._$dispatchEvent(new Next2DEvent(Next2DEvent.EXIT_FRAME));
        }

        // render event
        if (this._$stage._$invalidate) {

            // reset
            this._$stage._$invalidate = false;

            // execute render event
            this._$dispatchEvent(new Next2DEvent(Next2DEvent.RENDER));

        }

        // loader events
        if (loaders) {

            for (let idx: number = 0; idx < loaders.length; ++idx) {

                const loader = loaders[idx];

                // init event
                if (loader.hasEventListener(Next2DEvent.INIT)) {
                    loader.dispatchEvent(new Next2DEvent(Next2DEvent.INIT));
                }

                // complete event
                if (loader.hasEventListener(Next2DEvent.COMPLETE)) {
                    loader.dispatchEvent(new Next2DEvent(Next2DEvent.COMPLETE));
                }

            }

            // pool
            $poolArray(loaders);
        }

        // execute frame action
        this._$doAction();
    }

    /**
     * @returns void
     * @private
     */
    _$draw ()
    {
        if (!this._$width || !this._$height) {
            return ;
        }

        if ($rendererWorker) {
            $rendererWorker.postMessage({
                "command": "draw"
            });
        }

        if (!this._$stage._$isUpdated()) {
            return ;
        }

        const context: CanvasToWebGLContext | null = this._$context;
        if (!context) {
            return ;
        }

        context._$bind(this._$attachment);

        // reset
        context.reset();
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.clearRect(0, 0, this._$width, this._$height);
        context.beginPath();

        this._$stage._$draw(
            context,
            this._$matrix,
            $COLOR_ARRAY_IDENTITY
        );

        // stage end
        this._$stage._$updated = false;

        const manager: FrameBufferManager = context.frameBuffer;
        const texture: WebGLTexture = manager
            .getTextureFromCurrentAttachment();

        manager.unbind();

        // reset and draw to main canvas
        context.reset();
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.clearRect(0, 0, this._$width, this._$height);
        context.drawImage(texture, 0, 0, this._$width, this._$height);

        // re bind
        context._$bind(this._$attachment);
    }

    /**
     * @return {void}
     * @method
     * @private
     */
    _$doAction (): void
    {
        while (this._$actions.length) {

            this._$actionProcess = true;

            // target object
            const mc: MovieClip | void = this._$actions.pop();
            if (!mc) {
                continue;
            }

            mc._$canAction    = false;
            mc._$actionOffset = 0;
            mc._$actionLimit  = 0;

            const frame: number = mc._$currentFrame;
            if (!mc._$actions.has(frame)) {
                continue;
            }

            const actions: Function[] | void = mc._$actions.get(frame);
            if (!actions) {
                continue;
            }

            mc._$actionProcess = true;
            for (let idx: number = 0; idx < actions.length; ++idx) {
                $setCurrentLoaderInfo(mc._$loaderInfo);
                actions[idx].apply(mc);
            }
            mc._$actionProcess = false;

            // adjustment
            if (mc._$frameCache.size) {
                mc._$currentFrame = mc._$frameCache.get("nextFrame");
                mc._$clearChildren();

                mc._$stopFlag  = mc._$frameCache.get("stopFlag");
                mc._$isPlaying = mc._$frameCache.get("isPlaying");
                mc._$frameCache.clear();
            }

        }

        this._$actionProcess = false;
        $setCurrentLoaderInfo(null);
    }

    /**
     * @return {void}
     * @method
     * @private
     */
    _$hitTest (): void
    {
        if (this._$stopFlag) {
            return ;
        }

        // setup
        const event: MouseEvent | TouchEvent | Event | null = $getEvent();
        if (!event) {
            return ;
        }

        // update flags
        this._$hitTestStart = true;
        $doUpdated(false);

        // params
        let instance: DisplayObjectImpl<any> | null = null;
        let target: DisplayObjectImpl<any> | null   = null;

        let x = $window.scrollX;
        let y = $window.scrollY;

        const div: HTMLElement | null = $document
            .getElementById(this.contentElementId);

        if (div) {
            const rect: DOMRect = div.getBoundingClientRect();
            x += rect.left;
            y += rect.top;
        }

        let stageX: number = 0;
        let stageY: number = 0;

        if ("changedTouches" in event) {
            const changedTouche: Touch = event.changedTouches[0];
            stageX = changedTouche.pageX;
            stageY = changedTouche.pageY;
        } else if ("pageX" in event) {
            stageX = event.pageX;
            stageY = event.pageY;
        }

        // drop point
        stageX = (stageX - x) / this._$scale;
        stageY = (stageY - y) / this._$scale;

        // update
        this._$stageX = stageX;
        this._$stageY = stageY;

        // setup
        this._$hitObject.x       = stageX;
        this._$hitObject.y       = stageY;
        this._$hitObject.pointer = "";
        this._$hitObject.hit     = null;

        // reset
        $hitContext.setTransform(1, 0, 0, 1, 0, 0);
        $hitContext.beginPath();

        // hit test
        $MATRIX_HIT_ARRAY_IDENTITY[4] = this._$tx / this._$scale / $devicePixelRatio;
        $MATRIX_HIT_ARRAY_IDENTITY[5] = this._$ty / this._$scale / $devicePixelRatio;
        this._$stage._$mouseHit(
            $hitContext, $MATRIX_HIT_ARRAY_IDENTITY,
            this._$hitObject, true
        );

        // stop event
        if (this._$hitObject.hit) {
            event.preventDefault();
        }

        // change state
        let canPointerText: boolean = false;
        let staticPointer: boolean  = false;
        let canPointer: boolean     = false;

        const eventType: string = $getEventType();
        switch (eventType) {

            case $TOUCH_MOVE:
            case $MOUSE_MOVE:

                if ($dropTarget) {

                    const point: Point = $dropTarget._$dragMousePoint();

                    let dragX: number = point.x;
                    let dragY: number = point.y;

                    if (!$dragRules.lock) {
                        dragX += $dragRules.position.x;
                        dragY += $dragRules.position.y;
                    }

                    const bounds: Rectangle | null = $dragRules.bounds;
                    if (bounds) {
                        dragX = $clamp(dragX, bounds.left, bounds.right);
                        dragY = $clamp(dragY, bounds.top,  bounds.bottom);
                    }

                    // set move xy
                    $dropTarget.x = dragX;
                    $dropTarget.y = dragY;

                }

                break;

            case $TOUCH_START:
            case $MOUSE_DOWN:
                this._$state  = "down";
                canPointer    = this._$canvas.style.cursor === "pointer";
                staticPointer = true;
                break;

            case $TOUCH_END:
            case $MOUSE_UP:
            case $DOUBLE_CLICK:
                this._$state = "up";
                break;

        }

        // execute
        switch (true) {

            case this._$hitObject.hit === null:
            case eventType === $MOUSE_LEAVE:

                // (1) mouseOut
                if (this._$mouseOverTarget) {

                    instance = this._$mouseOverTarget;
                    if (instance.willTrigger(Next2DMouseEvent.MOUSE_OUT)) {
                        instance.dispatchEvent(new Next2DMouseEvent(
                            Next2DMouseEvent.MOUSE_OUT, true, false
                        ));
                    }

                }

                // (2) rollOut
                if (this._$rollOverObject) {

                    target = this._$rollOverObject;

                    // parent target
                    while (target && target.root !== target) {

                        if (target.willTrigger(Next2DMouseEvent.ROLL_OUT)) {
                            target.dispatchEvent(new Next2DMouseEvent(
                                Next2DMouseEvent.ROLL_OUT, false, false
                            ));
                        }

                        target = target._$parent;

                    }

                }

                // reset
                this._$rollOverObject  = null;
                this._$mouseOverTarget = null;

                // stage event
                switch (eventType) {

                    case $MOUSE_WHEEL:
                        if (this._$stage.hasEventListener(Next2DMouseEvent.MOUSE_WHEEL)) {
                            this._$stage.dispatchEvent(new Next2DMouseEvent(
                                Next2DMouseEvent.MOUSE_WHEEL, true, false
                            ));
                        }
                        break;

                    case $TOUCH_START:
                    case $MOUSE_DOWN:
                        if (this._$stage.hasEventListener(Next2DMouseEvent.MOUSE_DOWN)) {
                            this._$stage.dispatchEvent(new Next2DMouseEvent(
                                Next2DMouseEvent.MOUSE_DOWN, true, false
                            ));
                        }

                        // TextField focus out
                        if (this._$textField) {
                            this._$textField.focus = false;
                            this._$textField = null;
                        }
                        break;

                    case $TOUCH_END:
                    case $MOUSE_UP:

                        // TextField focus out
                        if (this._$textField) {
                            this._$textField.focus = false;
                            this._$textField = null;
                        }

                        if (this._$stage.hasEventListener(Next2DMouseEvent.CLICK)) {
                            this._$stage.dispatchEvent(new Next2DMouseEvent(
                                Next2DMouseEvent.CLICK, true, false
                            ));
                        }

                        if (this._$stage.hasEventListener(Next2DMouseEvent.MOUSE_UP)) {
                            this._$stage.dispatchEvent(new Next2DMouseEvent(
                                Next2DMouseEvent.MOUSE_UP, true, false
                            ));
                        }

                        break;

                    case $TOUCH_MOVE:
                    case $MOUSE_MOVE:
                        if (this._$stage.hasEventListener(Next2DMouseEvent.MOUSE_MOVE)) {
                            this._$stage.dispatchEvent(new Next2DMouseEvent(
                                Next2DMouseEvent.MOUSE_MOVE, true, false
                            ));
                        }
                        break;

                    case $DOUBLE_CLICK:
                        if (this._$stage.hasEventListener(Next2DMouseEvent.DOUBLE_CLICK)) {
                            this._$stage.dispatchEvent(new Next2DMouseEvent(
                                Next2DMouseEvent.DOUBLE_CLICK, true, false
                            ));
                        }
                        break;

                }

                break;

            default:

                instance = this._$hitObject.hit;
                switch (eventType) {

                    // move event
                    case $TOUCH_MOVE:
                    case $MOUSE_MOVE:

                        // (1) mouseMove
                        if (instance.willTrigger(Next2DMouseEvent.MOUSE_MOVE)) {
                            instance.dispatchEvent(new Next2DMouseEvent(
                                Next2DMouseEvent.MOUSE_MOVE, true, false
                            ));
                        }

                        // (2) mouseOut
                        if (this._$mouseOverTarget
                            && this._$mouseOverTarget !== instance
                        ) {

                            const outInstance: DisplayObjectImpl<any> = this._$mouseOverTarget;

                            if (outInstance.willTrigger(Next2DMouseEvent.MOUSE_OUT)) {
                                outInstance.dispatchEvent(new Next2DMouseEvent(
                                    Next2DMouseEvent.MOUSE_OUT, true, false
                                ));
                            }

                        }

                        // rollOut and rollOver
                        if (this._$rollOverObject !== instance) {

                            let hitParent: DisplayObjectImpl<any> | null = null;
                            if (this._$rollOverObject) {

                                // (3) prev object rollOut
                                target = this._$rollOverObject;

                                if (target.willTrigger(Next2DMouseEvent.ROLL_OUT)) {
                                    target.dispatchEvent(new Next2DMouseEvent(
                                        Next2DMouseEvent.ROLL_OUT, false, false
                                    ));
                                }

                                // rollOver flag instance
                                hitParent = target._$parent;
                                while (hitParent && hitParent._$root !== hitParent) {

                                    if (hitParent === instance) {
                                        break;
                                    }

                                    if (hitParent._$mouseEnabled
                                        && hitParent._$outCheck(stageX, stageY)
                                    ) {

                                        let isUpperLayer: boolean = false;
                                        let check: DisplayObjectImpl<any> | null = instance;
                                        while (check && check._$root !== check) {

                                            if (check !== hitParent) {
                                                check = check._$parent;
                                                continue;
                                            }

                                            isUpperLayer = true;

                                            break;
                                        }

                                        if (!isUpperLayer && hitParent._$parent === instance._$parent
                                            && hitParent._$index > instance._$index
                                        ) {
                                            isUpperLayer = true;
                                        }

                                        if (isUpperLayer) {
                                            break;
                                        }

                                    }

                                    if (hitParent.willTrigger(Next2DMouseEvent.ROLL_OUT)) {
                                        hitParent.dispatchEvent(new Next2DMouseEvent(
                                            Next2DMouseEvent.ROLL_OUT, false, false
                                        ));
                                    }

                                    hitParent = hitParent._$parent;

                                }
                            }

                            // (4) current object rollOver
                            target = instance;
                            for (;;) {

                                if (target.willTrigger(Next2DMouseEvent.ROLL_OVER)) {
                                    target.dispatchEvent(new Next2DMouseEvent(
                                        Next2DMouseEvent.ROLL_OVER, false, false
                                    ));
                                }

                                target = target._$parent;
                                if (!target || target === hitParent
                                    || target.stage === target
                                ) {
                                    break;
                                }

                            }

                        }

                        this._$rollOverObject = instance;

                        // (5) mouseOver
                        switch (true) {

                            case this._$mouseOverTarget === null:
                            case this._$mouseOverTarget !== instance:

                                if (instance.willTrigger(Next2DMouseEvent.MOUSE_OVER)) {
                                    instance.dispatchEvent(new Next2DMouseEvent(
                                        Next2DMouseEvent.MOUSE_OVER, true, false
                                    ));
                                }

                                // set target
                                this._$mouseOverTarget = instance;
                                break;

                        }

                        // click reset
                        if (this._$state === "up") {
                            this._$clickTarget = null;
                        }

                        break;

                    // down event
                    case $TOUCH_START:
                    case $MOUSE_DOWN:

                        // TextField focus out
                        if (this._$textField
                            && instance !== this._$textField
                            && "_$text" in this._$textField
                        ) {
                            this._$textField.focus = false;
                            this._$textField       = null;
                        }

                        // TextField focus out
                        if ("_$text" in instance) {
                            instance.focus   = true;
                            this._$textField = instance;
                        }

                        // (3) mouseDown
                        if (instance.willTrigger(Next2DMouseEvent.MOUSE_DOWN)) {
                            instance.dispatchEvent(new Next2DMouseEvent(
                                Next2DMouseEvent.MOUSE_DOWN, true, false
                            ));
                        }

                        // (4) click
                        this._$clickTarget = instance;

                        break;

                    // up event
                    case $TOUCH_END:
                    case $MOUSE_UP:

                        // TextField focus out
                        if (this._$textField
                            && instance !== this._$textField
                            && "_$text" in this._$textField
                        ) {
                            this._$textField.focus = false;
                            this._$textField       = null;
                        }

                        // (1) mouseUp
                        if (instance.willTrigger(Next2DMouseEvent.MOUSE_UP)) {
                            instance.dispatchEvent(new Next2DMouseEvent(
                                Next2DMouseEvent.MOUSE_UP, true, false
                            ));
                        }

                        // (2) click
                        if (this._$clickTarget === instance) {

                            if (instance.willTrigger(Next2DMouseEvent.CLICK)) {
                                instance.dispatchEvent(new Next2DMouseEvent(
                                    Next2DMouseEvent.CLICK, true, false
                                ));
                            }

                        }

                        // reset
                        this._$clickTarget = null;

                        break;

                    case $MOUSE_WHEEL:
                        if (instance.willTrigger(Next2DMouseEvent.MOUSE_WHEEL)) {
                            instance.dispatchEvent(
                                new Next2DMouseEvent(Next2DMouseEvent.MOUSE_WHEEL)
                            );
                        }

                        if ("deltaY" in event && instance.scrollEnabled) {
                            // @ts-ignore
                            instance.scrollV += $clamp(event.deltaY, -1, 1, 0);
                        }
                        break;

                    case $DOUBLE_CLICK:
                        if (instance.willTrigger(Next2DMouseEvent.DOUBLE_CLICK)) {
                            instance.dispatchEvent(
                                new Next2DMouseEvent(Next2DMouseEvent.DOUBLE_CLICK)
                            );
                        }
                        break;

                    default:
                        break;

                }

                // PC
                if (!staticPointer) {

                    if (!$isTouch && this._$state === "up") {

                        target = instance;
                        while (target && target.root !== target) {

                            if ("_$text" in target) {

                                if (target.type === "input") {
                                    canPointerText = true;
                                    break;
                                }

                            } else {

                                if (target._$buttonMode) {
                                    canPointer = true;
                                    break;
                                }

                            }

                            target = target._$parent;

                        }
                    }
                }
                break;

        }

        // change cursor
        switch (true) {

            case canPointerText:
                this._$canvas.style.cursor = "text";
                break;

            case canPointer:
                this._$canvas.style.cursor = "pointer";
                break;

            case !$isTouch && this._$state === "up":
                this._$canvas.style.cursor = "auto";
                break;

        }

        // execute action
        if (!this._$actionProcess && this._$actions.length > 1) {
            this._$doAction();
        }

        if ($isUpdated()) {

            // action script
            this._$stage._$prepareActions();
            if (!this._$actionProcess) {
                this._$doAction();
            }

        }

        this._$hitTestStart = false;
    }
}
