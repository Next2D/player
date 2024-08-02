import type { PlayerModeImpl } from "./interface/PlayerModeImpl";
import type { EventDispatcherImpl } from "./interface/EventDispatcherImpl";
// import type { ParentImpl } from "./interface/ParentImpl";
// import type { PlayerHitObjectImpl } from "./interface/PlayerHitObjectImpl";
import type { PlayerOptionsImpl } from "./interface/PlayerOptionsImpl";
// import type {
//     MovieClip,
//     TextField
// } from "@next2d/display";
import { SoundMixer } from "@next2d/media";
import { $cacheStore } from "@next2d/cache";
import {
    $devicePixelRatio,
    $LOAD_START,
    $LOAD_END,
    $PREFIX
} from "./CoreUtil";
import { execute as playerCreateContainerElementService } from "./Player/PlayerCreateContainerElementService";
import { execute as playerApplyContainerElementStyleService } from "./Player/PlayerApplyContainerElementStyleService";
import { execute as playerLoadingAnimationService } from "./Player/PlayerLoadingAnimationService";
import { execute as playerResizeEventService } from "./Player/PlayerResizeEventService";
import { execute as playerResizeRegisterService } from "./Player/PlayerResizeRegisterService";
import { execute as playerUpdateBackgroundColorPostMessageService } from "./Player/PlayerUpdateBackgroundColorPostMessageService";

/**
 * @description Next2Dの描画、イベント、設定、コントロールの管理クラスです。
 *              This class manages Next2D drawings, events, settings, and controls.
 *
 * @class
 * @public
 */
export class Player
{
    // private readonly _$actions: MovieClip[];
    private readonly _$loaders: EventDispatcherImpl<any>[];
    // private readonly _$sounds: Map<any, MovieClip>;
    // private readonly _$hitObject: PlayerHitObjectImpl;
    private readonly _$matrix: Float32Array;
    private _$rendererWidth: number;
    private _$rendererHeight: number;
    private _$rendererScale: number;
    private _$stageWidth: number;
    private _$stageHeight: number;
    private _$fixedWidth: number;
    private _$fixedHeight: number;
    private _$frameRate: number;
    private _$stopFlag: boolean;
    private _$loadStatus: number;
    private _$scale: number;
    // private _$state: "up" | "down";
    // private _$textField: TextField | null;
    private _$mode: PlayerModeImpl;
    // private _$rollOverObject: EventDispatcherImpl<any> | null;
    // private _$mouseOverTarget: EventDispatcherImpl<any> | null;
    // private _$startTime: number;
    // private _$fps: number;
    // private _$hitTestStart: boolean;
    // private _$stageX: number;
    // private _$stageY: number;
    private _$tagId: string;
    private _$bgColor: string;
    private _$fullScreen: boolean;
    private _$timerId: number;
    private _$loadId: number;
    // private _$deltaX: number;
    // private _$deltaY: number;
    // private _$clickTarget: ParentImpl<any> | null;
    // private _$actionProcess: boolean;

    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        /**
         * @type {string}
         * @private
         */
        this._$mode = "loader";

        // /**
        //  * @type {array}
        //  * @private
        //  */
        // this._$actions = [];

        /**
         * @type {array}
         * @public
         */
        this._$loaders = [];

        // /**
        //  * @type {Map}
        //  * @private
        //  */
        // this._$sounds = new Map();

        // /**
        //  * @type {object}
        //  * @private
        //  */
        // this._$hitObject = {
        //     "x": 0,
        //     "y": 0,
        //     "pointer": "",
        //     "hit": null
        // };

        // /**
        //  * @type {DisplayObject}
        //  * @default null
        //  * @private
        //  */
        // this._$rollOverObject = null;

        // /**
        //  * @type {DisplayObject}
        //  * @default null
        //  * @private
        //  */
        // this._$mouseOverTarget = null;

        /**
         * @type {number}
         * @default 60
         * @private
         */
        this._$frameRate = 60;

        /**
         * @type {boolean}
         * @default true
         * @private
         */
        this._$stopFlag = true;

        // /**
        //  * @type {number}
        //  * @default 0
        //  * @private
        //  */
        // this._$startTime = 0;

        // /**
        //  * @type {number}
        //  * @default 16
        //  * @private
        //  */
        // this._$fps = 16;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$loadStatus = 0;

        // /**
        //  * @type {number}
        //  * @default 0
        //  * @private
        //  */
        // this._$width = 0;

        // /**
        //  * @type {number}
        //  * @default 0
        //  * @private
        //  */
        // this._$height = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$stageWidth = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$stageHeight = 0;

        /**
         * @type {number}
         * @default 1
         * @private
         */
        this._$rendererWidth = 0;

        /**
         * @type {number}
         * @default 1
         * @private
         */
        this._$rendererHeight = 0;

        /**
         * @type {number}
         * @default 1
         * @private
         */
        this._$rendererScale = 1;

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
        this._$matrix = new Float32Array([1, 0, 0, 1, 0, 0]);

        // /**
        //  * @type {string}
        //  * @default up
        //  * @private
        //  */
        // this._$state = "up";

        // /**
        //  * @type {boolean}
        //  * @default false
        //  * @private
        //  */
        // this._$hitTestStart = false;

        // /**
        //  * @type {number}
        //  * @default -1
        //  * @private
        //  */
        // this._$stageX = -1;

        // /**
        //  * @type {number}
        //  * @default -1
        //  * @private
        //  */
        // this._$stageY = -1;

        // /**
        //  * @type {number}
        //  * @default 0
        //  * @private
        //  */
        // this._$deltaX = 0;

        // /**
        //  * @type {number}
        //  * @default 0
        //  * @private
        //  */
        // this._$deltaY = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$fixedWidth = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$fixedHeight = 0;

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
         * @type {boolean}
         * @default false
         * @private
         */
        this._$fullScreen = false;

        // /**
        //  * @type {TextField}
        //  * @default null
        //  * @private
        //  */
        // this._$textField = null;

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

        // /**
        //  * @type {DisplayObject}
        //  * @default null
        //  * @private
        //  */
        // this._$clickTarget = null;

        // /**
        //  * @type {boolean}
        //  * @default false
        //  * @private
        //  */
        // this._$actionProcess = false;
    }

    /**
     * @description フルスクリーンモード時の画面全体を基準としたステージのx座標
     *              The x-coordinate of the stage with the entire screen as the reference in full-screen mode
     *
     * @member {number}
     * @default 0
     * @readonly
     * @public
     */
    get x (): number
    {
        return this._$matrix[5];
    }

    /**
     * @description フルスクリーンモード時の画面全体を基準としたステージのy座標
     *              The y-coordinate of the stage with the entire screen as the reference in full-screen mode
     *
     * @member {number}
     * @default 0
     * @readonly
     * @public
     */
    get y (): number
    {
        return this._$matrix[4];
    }

    /**
     * @description ステージ設定と画面表示のx拡大率
     *              The x magnification of the stage setting and screen display
     *
     * @member {number}
     * @readonly
     * @public
     */
    get scaleX (): number
    {
        return this._$matrix[0];
    }

    /**
     * @description ステージ設定と画面表示のy拡大率
     *              The y magnification of the stage setting and screen display
     *
     * @member {number}
     * @readonly
     * @public
     */
    get scaleY (): number
    {
        return this._$matrix[3];
    }

    /**
     * @description フルスクリーンモード時のステージサイズを基準としたステージのx座標
     *              The x-coordinate of the stage with the stage size in full-screen mode as the reference
     *
     * @member {number}
     * @readonly
     * @public
     */
    get tx (): number
    {
        return this._$matrix[4] / this._$scale / $devicePixelRatio;
    }

    /**
     * @description フルスクリーンモード時のステージサイズを基準としたステージのy座標
     *              The y-coordinate of the stage with the stage size in full-screen mode as the reference
     *
     * @member {number}
     * @readonly
     * @public
     */
    get ty (): number
    {
        return this._$matrix[5] / this._$scale / $devicePixelRatio;
    }

    /**
     * @description Playerの利用モード、load関数を利用している場合は "loader"、createRootMovieClip関数を利用している場合は "create"
     *              The usage mode of Player, "loader" if the load function is used, "create" if the createRootMovieClip function is used
     *
     * @member {string}
     * @default "loader"
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
     * @description canvasの描画領域の幅
     *              The width of the drawing area of the canvas
     *
     * @member {number}
     * @default 0
     * @public
     */
    get rendererWidth (): number
    {
        return this._$rendererWidth;
    }
    set rendererWidth (renderer_width: number)
    {
        this._$rendererWidth = renderer_width | 0;
    }

    /**
     * @description canvasの描画領域の高さ
     *              The height of the drawing area of the canvas
     *
     * @member {number}
     * @default 0
     * @public
     */
    get rendererHeight (): number
    {
        return this._$rendererHeight;
    }
    set rendererHeight (renderer_height: number)
    {
        this._$rendererHeight = renderer_height | 0;
    }

    /**
     * @description canvasの描画領域の拡大率
     *              The magnification of the drawing area of the canvas
     *
     * @member {number}
     * @default 1
     * @public
     */
    get rendererScale (): number
    {
        return this._$rendererScale;
    }
    set rendererScale (renderer_scale: number)
    {
        this._$rendererScale = renderer_scale;
    }

    /**
     * @description フルスクリーンモードの設定
     *              Full screen mode setting
     *
     * @member {boolean}
     * @default false
     * @public
     */
    get fullScreen (): boolean
    {
        return this._$fullScreen;
    }
    set fullScreen (full_screen: boolean)
    {
        if (this._$fullScreen === full_screen) {
            return ;
        }

        this._$fullScreen = full_screen;

        // display resize
        playerResizeEventService(this);
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
        if (this._$bgColor === bg_color) {
            return ;
        }

        this._$bgColor = `${bg_color}`;
        playerUpdateBackgroundColorPostMessageService(this._$bgColor);
    }

    /**
     * @member {number}
     * @public
     */
    get frameRate (): number
    {
        return this._$frameRate;
    }
    set frameRate (frame_rate: number)
    {
        this._$frameRate = frame_rate;
    }

    /**
     * @description ステージの幅
     *              Stage width
     *
     * @member {number}
     * @default 0
     * @public
     */
    get stageWidth (): number
    {
        return this._$stageWidth;
    }
    set stageWidth (stage_width: number)
    {
        this._$stageWidth = stage_width;
    }

    /**
     * @description ステージの高さ
     *              Stage height
     *
     * @member {number}
     * @default 0
     * @public
     */
    get stageHeight (): number
    {
        return this._$stageHeight;
    }
    set stageHeight (stage_height: number)
    {
        this._$stageHeight = stage_height;
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    play (): void
    {
        if (!this._$stopFlag) {
            return ;
        }

        this._$stopFlag = false;

        // if (this._$timerId > -1) {
        //     cancelAnimationFrame(this._$timerId);
        // }

        // this._$fps = 1000 / this._$frameRate | 0;

        // this._$startTime = performance.now();
        // this._$timerId = requestAnimationFrame(async (timestamp: number): Promise<void> =>
        // {
        //     await this._$run(timestamp);
        // });
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    stop (): void
    {
        if (this._$timerId > -1) {
            cancelAnimationFrame(this._$timerId);
        }

        this._$stopFlag = true;
        this._$timerId  = -1;

        SoundMixer.stopAll();
    }

    // /**
    //  * @param  {string} id
    //  * @return {void}
    //  * @method
    //  * @public
    //  */
    // removeCache (id: string): void
    // {
    //     $cacheStore.removeCache(id);
    //     if ($rendererWorker) {
    //         $rendererWorker.postMessage({
    //             "command": "removeCache",
    //             "id": id
    //         });
    //     }
    // }

    /**
     * @param  {object} [options=null]
     * @return {void}
     * @public
     */
    setOptions (options: PlayerOptionsImpl | null = null): void
    {
        if (!options) {
            return ;
        }

        this._$fixedWidth  = options.width   || this._$fixedWidth;
        this._$fixedHeight = options.height  || this._$fixedHeight;
        this._$tagId       = options.tagId   || this._$tagId;
        this._$bgColor     = options.bgColor || this._$bgColor;
        this._$fullScreen  = !!options.fullScreen;
    }

    /**
     * @description Playerの初期起動処理
     *              Initial startup processing of Player
     *
     * @return {void}
     * @method
     * @public
     */
    boot (options: PlayerOptionsImpl | null = null): void
    {
        this.setOptions(options);

        // create element
        const element = playerCreateContainerElementService();

        // apply base style
        playerApplyContainerElementStyleService(
            element, this._$fixedWidth, this._$fixedHeight
        );

        // start loading
        playerLoadingAnimationService(element);

        // register resize event
        if (!this._$fixedWidth && !this._$fixedHeight) {
            playerResizeRegisterService(this);
        }

        // initialize resize
        playerResizeEventService(this);
    }

    // /**
    //  * @return {void}
    //  * @method
    //  * @private
    //  */
    // _$updateLoadStatus (): void
    // {
    //     if (this._$loadStatus === $LOAD_END) {
    //         if (this._$loadId > -1) {
    //             $cancelAnimationFrame(this._$loadId);
    //         }

    //         this._$loadId = -1;
    //         this._$loaded();
    //         return ;
    //     }

    //     this._$loadId = $requestAnimationFrame(() =>
    //     {
    //         this._$updateLoadStatus();
    //     });
    // }

    // /**
    //  * @return {void}
    //  * @method
    //  * @private
    //  */
    // _$loaded (): void
    // {
    //     const element: HTMLElement | null = $document
    //         .getElementById($PREFIX);

    //     if (element) {

    //         // background color
    //         this._$setBackgroundColor(this._$bgColor);

    //         // DOM
    //         this._$deleteNode();

    //         // append canvas
    //         element.appendChild(this._$canvas);
    //         element.appendChild($textArea);

    //         // stage init action
    //         this._$stage._$prepareActions();

    //         // constructed event
    //         if (this._$broadcastEvents.has(Next2DEvent.FRAME_CONSTRUCTED)) {
    //             this._$dispatchEvent(new Next2DEvent(Next2DEvent.FRAME_CONSTRUCTED));
    //         }

    //         // frame1 action
    //         this._$doAction();

    //         // exit event
    //         if (this._$broadcastEvents.has(Next2DEvent.EXIT_FRAME)) {
    //             this._$dispatchEvent(new Next2DEvent(Next2DEvent.EXIT_FRAME));
    //         }

    //         // loader events
    //         const length: number = this._$loaders.length;
    //         for (let idx: number = 0; idx < length; ++idx) {

    //             const loader: EventDispatcherImpl<any> = this._$loaders.shift();

    //             // init event
    //             if (loader.hasEventListener(Next2DEvent.INIT)) {
    //                 loader.dispatchEvent(new Next2DEvent(Next2DEvent.INIT));
    //             }

    //             // complete event
    //             if (loader.hasEventListener(Next2DEvent.COMPLETE)) {
    //                 loader.dispatchEvent(new Next2DEvent(Next2DEvent.COMPLETE));
    //             }
    //         }

    //         // activate event
    //         if (this._$broadcastEvents.has(Next2DEvent.ACTIVATE)) {
    //             this._$dispatchEvent(new Next2DEvent(Next2DEvent.ACTIVATE));
    //         }

    //         // frame action
    //         this._$doAction();

    //         // render
    //         this._$draw();

    //         // start
    //         this.play();
    //     }

    // }

    // /**
    //  * @return {void}
    //  * @method
    //  * @private
    //  */
    // _$initialize (): void
    // {
    //     if (!this._$tagId) {

    //         $document
    //             .body
    //             .insertAdjacentHTML(
    //                 "beforeend", `<div id="${$PREFIX}" tabindex="-1"></div>`
    //             );

    //     } else {

    //         const container: HTMLElement | null = $document.getElementById(this._$tagId);
    //         if (!container) {
    //             alert("Not Found Tag ID:" + this._$tagId);
    //             return ;
    //         }

    //         const div: HTMLElement | null = $document.getElementById($PREFIX);
    //         if (!div) {

    //             const element: HTMLDivElement = $document.createElement("div");
    //             element.id       = $PREFIX;
    //             element.tabIndex = -1;
    //             container.appendChild(element);

    //         } else {

    //             this._$deleteNode();

    //         }

    //     }

    //     const element: HTMLElement | null = $document.getElementById($PREFIX);
    //     if (!element) {
    //         throw new Error("the content element is null.");
    //     }

    //     const parent: HTMLElement | null = element.parentElement;
    //     if (parent) {

    //         this._$initStyle(element);
    //         this._$buildWait();

    //         const width: number = this._$fixedWidth
    //             ? this._$fixedWidth
    //             : parent.tagName === "BODY"
    //                 ? window.innerWidth
    //                 : parent.clientWidth;

    //         const height: number = this._$fixedHeight
    //             ? this._$fixedHeight
    //             : parent.tagName === "BODY"
    //                 ? window.innerHeight
    //                 : parent.clientHeight;

    //         // set center
    //         if (this._$mode === "loader" && width && height) {
    //             this._$baseWidth  = width;
    //             this._$baseHeight = height;
    //             this._$resize();
    //         }
    //     }

    //     if (this._$mode === "loader") {
    //         this._$loadStatus = $LOAD_START;
    //         this._$updateLoadStatus();
    //     } else {
    //         this._$resize();
    //         this._$loaded();
    //     }
    // }

    // /**
    //  * @returns {void}
    //  * @method
    //  * @private
    //  */
    // _$deleteNode (): void
    // {
    //     const element: HTMLElement | null = $document.getElementById($PREFIX);
    //     if (element) {
    //         while (element.childNodes.length) {
    //             element.removeChild(element.childNodes[0]);
    //         }
    //     }
    // }

    //     // @ts-ignore
    //     this._$canvas.addEventListener($TOUCH_START, (event: TouchEvent) =>
    //     {
    //         $setEvent(event);
    //         $setEventType($TOUCH_START);

    //         // start position
    //         this._$hitTest();
    //     });

    //     // @ts-ignore
    //     this._$canvas.addEventListener($TOUCH_MOVE, (event: TouchEvent) =>
    //     {
    //         $setEvent(event);
    //         $setEventType($TOUCH_MOVE);
    //         this._$hitTest();
    //     });

    //     // @ts-ignore
    //     this._$canvas.addEventListener($TOUCH_END, (event: TouchEvent) =>
    //     {
    //         $setEvent(event);
    //         $setEventType($TOUCH_END);
    //         this._$hitTest();
    //     });

    //     // @ts-ignore
    //     this._$canvas.addEventListener($TOUCH_MOVE, (event: TouchEvent) =>
    //     {
    //         $setEvent(event);
    //         $setEventType($TOUCH_MOVE);

    //         this._$hitTest();
    //     }, { "passive": false });

    //     // @ts-ignore
    //     this._$canvas.addEventListener($MOUSE_DOWN, (event: MouseEvent) =>
    //     {
    //         $setEvent(event);
    //         $setEventType($MOUSE_DOWN);

    //         if (!event.button) {
    //             this._$hitTest();
    //         }
    //     });

    //     // @ts-ignore
    //     this._$canvas.addEventListener($DOUBLE_CLICK, (event: MouseEvent) =>
    //     {
    //         $setEvent(event);
    //         $setEventType($DOUBLE_CLICK);

    //         if (!event.button) {
    //             this._$hitTest();
    //         }
    //     });

    //     // @ts-ignore
    //     this._$canvas.addEventListener($MOUSE_LEAVE, (event: MouseEvent) =>
    //     {
    //         $setEvent(event);
    //         $setEventType($MOUSE_LEAVE);

    //         this._$hitTest();

    //         $setEvent(null);
    //         this._$stageX = -1;
    //         this._$stageY = -1;
    //     });

    //     // @ts-ignore
    //     this._$canvas.addEventListener($MOUSE_UP, (event: MouseEvent) =>
    //     {
    //         $setEvent(event);
    //         $setEventType($MOUSE_UP);

    //         if (!event.button) {
    //             this._$hitTest();
    //         }
    //     });

    //     // @ts-ignore
    //     this._$canvas.addEventListener($MOUSE_MOVE, (event: MouseEvent) =>
    //     {
    //         $setEvent(event);
    //         $setEventType($MOUSE_MOVE);

    //         this._$hitTest();
    //     });

    //     // @ts-ignore
    //     this._$canvas.addEventListener($MOUSE_WHEEL, (event: MouseEvent) =>
    //     {
    //         if (!event.defaultPrevented) {

    //             $setEvent(event);
    //             $setEventType($MOUSE_WHEEL);

    //             this._$hitTest();
    //         }
    //     }, { "passive": false });
    // }

    // /**
    //  * @return {void}
    //  * @method
    //  * @private
    //  */
    // _$resize (): void
    // {
    //     const div: HTMLElement | null = $document
    //         .getElementById($PREFIX);

    //     if (div) {

    //         const parent: HTMLElement | null = div.parentElement;
    //         if (!parent) {
    //             throw new Error("the parentElement is null.");
    //         }

    //         const innerWidth: number = this._$fixedWidth
    //             ? this._$fixedWidth
    //             : parent.tagName === "BODY"
    //                 ? window.innerWidth
    //                 : parent.clientWidth;

    //         const innerHeight: number = this._$fixedHeight
    //             ? this._$fixedHeight
    //             : parent.tagName === "BODY"
    //                 ? window.innerHeight
    //                 : parent.clientHeight;

    //         const screenWidth: number = parent.tagName === "BODY"
    //             ? $window.innerWidth
    //             : parent.offsetWidth;

    //         const scale: number = $Math.min(
    //             innerWidth  / this._$baseWidth,
    //             innerHeight / this._$baseHeight
    //         );z

    //         let width: number = this._$fullScreen
    //             ? innerWidth
    //             : this._$baseWidth * scale | 0;

    //         let height: number = this._$fullScreen
    //             ? innerHeight
    //             : this._$baseHeight * scale | 0;

    //         // div
    //         const style: CSSStyleDeclaration  = div.style;
    //         style.width  = `${width}px`;
    //         style.height = `${height}px`;
    //         style.top    = "0";
    //         style.left   = this._$fullScreen
    //             ? "0"
    //             : `${screenWidth / 2 - width / 2}px`;

    //         width  *= $devicePixelRatio;
    //         height *= $devicePixelRatio;

    //         // no resize
    //         if (this._$width === width && this._$height === height) {
    //             return ;
    //         }

    //         // cache reset
    //         this._$stage._$doChanged();
    //         $cacheStore.reset();

    //         // params
    //         this._$scale  = scale;
    //         this._$width  = width;
    //         this._$height = height;

    //         const mScale: number = this._$scale * $devicePixelRatio;
    //         this._$matrix[0] = mScale;
    //         this._$matrix[3] = mScale;

    //         if (this._$fullScreen) {

    //             const tx = (width -
    //                 this._$baseWidth
    //                 * scale
    //                 * $devicePixelRatio) / 2;

    //             const ty = (height -
    //                 this._$baseHeight
    //                 * scale
    //                 * $devicePixelRatio) / 2;

    //             this._$matrix[4] = tx;
    //             this._$matrix[5] = ty;

    //         }

    //         // main canvas resize
    //         this._$resizeCanvas(width, height, mScale, this._$matrix[4], this._$matrix[5]);

    //         if (div.children.length > 1) {
    //             div.children[1].dispatchEvent(
    //                 new Event(`${$PREFIX}_blur`)
    //             );
    //         }
    //     }
    // }

    // /**
    //  * @description 表示用のcanvasを更新
    //  *              Update canvas for display
    //  *
    //  * @param  {string} [background_color=transparent]
    //  * @return {void}
    //  * @method
    //  * @public
    //  */
    // _$setBackgroundColor (background_color: string = "transparent"): void
    // {
    //     if ($rendererWorker) {

    //         const buffer: Float32Array = $getRenderBufferArray();

    //         buffer[0] = background_color === "transparent"
    //             ? -1
    //             : $toColorInt(background_color);

    //         const message: PropertyMessageMapImpl<any> = $getRenderMessageObject();
    //         message.command = "setBackgroundColor";
    //         message.buffer  = buffer;

    //         const options: ArrayBuffer[] = $getArray(buffer.buffer);

    //         $rendererWorker.postMessage(message, options);

    //         $poolRenderMessageObject(message);
    //         $poolArray(options);

    //     } else {

    //         const context: CanvasToWebGLContext | null = this._$context;
    //         if (!context) {
    //             return ;
    //         }

    //         if (background_color === "transparent") {

    //             context._$setColor(0, 0, 0, 0);

    //         } else {

    //             const color: RGBAImpl = $uintToRGBA(
    //                 $toColorInt(background_color)
    //             );

    //             context._$setColor(
    //                 color.R / 255,
    //                 color.G / 255,
    //                 color.B / 255,
    //                 1
    //             );

    //         }

    //     }
    // }

    // /**
    //  * @param  {Event} event
    //  * @return {boolean}
    //  * @method
    //  * @private
    //  */
    // _$dispatchEvent (event: Next2DEvent): boolean
    // {
    //     if (this._$broadcastEvents.size
    //         && this._$broadcastEvents.has(event.type)
    //     ) {

    //         // clone
    //         const events: EventListenerImpl[] = this
    //             ._$broadcastEvents
    //             .get(event.type)
    //             .slice(0);

    //         // start target
    //         event.eventPhase = EventPhase.AT_TARGET;

    //         for (let idx: number = 0; idx < events.length; ++idx) {

    //             const obj: EventListenerImpl = events[idx];

    //             // event execute
    //             event.currentTarget = obj.target;

    //             event.listener = obj.listener;
    //             obj.listener.call(null, event);

    //             if (event._$stopImmediatePropagation) {
    //                 break;
    //             }

    //         }

    //         $poolArray(events);

    //         return true;

    //     }

    //     return false;
    // }

    // /**
    //  * @param  {number} timestamp
    //  * @return {void}
    //  * @method
    //  * @private
    //  */
    // async _$run (timestamp: number = 0): Promise<void>
    // {
    //     if (this._$stopFlag) {
    //         return ;
    //     }

    //     // delay action
    //     this._$doAction();

    //     const delta: number = timestamp - this._$startTime;
    //     if (delta > this._$fps) {

    //         // update
    //         this._$startTime = timestamp - delta % this._$fps;

    //         // execute
    //         this._$action();

    //         // start sound
    //         if (this._$sounds.size) {
    //             for (const movieClip of this._$sounds.values()) {
    //                 movieClip._$soundPlay();
    //             }
    //             this._$sounds.clear();
    //         }

    //         // draw
    //         this._$draw();

    //         // draw event
    //         if (!$isTouch
    //             && !this._$hitTestStart
    //             && this._$state === "up"
    //             && this._$stageX > -1
    //             && this._$stageY > -1
    //             && $getEvent()
    //         ) {
    //             this._$pointerCheck();
    //         }

    //     }

    //     // next frame
    //     this._$timerId = requestAnimationFrame((timestamp: number) =>
    //     {
    //         this._$run(timestamp);
    //     });
    // }

    // /**
    //  * @return {void}
    //  * @method
    //  * @private
    //  */
    // _$pointerCheck (): void
    // {
    //     const stageX: number = this._$stageX;
    //     const stageY: number = this._$stageY;

    //     // setup
    //     this._$hitObject.x       = stageX;
    //     this._$hitObject.y       = stageY;
    //     this._$hitObject.pointer = "";
    //     this._$hitObject.hit     = null;

    //     // reset
    //     $hitContext.setTransform(1, 0, 0, 1, 0, 0);
    //     $hitContext.beginPath();

    //     // hit test
    //     $MATRIX_HIT_ARRAY_IDENTITY[4] = this.tx;
    //     $MATRIX_HIT_ARRAY_IDENTITY[5] = this.ty;
    //     this._$stage._$mouseHit(
    //         $hitContext, $MATRIX_HIT_ARRAY_IDENTITY,
    //         this._$hitObject, true
    //     );

    //     // change state
    //     // params
    //     let instance: DisplayObjectImpl<any> = null;
    //     let target: DisplayObjectImpl<any>   = null;
    //     let canPointerText: boolean = false;
    //     let canPointer: boolean     = false;

    //     // execute
    //     if (this._$hitObject.hit) {

    //         instance = this._$hitObject.hit;

    //         // (1) mouseOut
    //         if (this._$mouseOverTarget
    //             && this._$mouseOverTarget !== instance
    //         ) {

    //             const outInstance: DisplayObjectImpl<any> = this._$mouseOverTarget;

    //             if (outInstance.willTrigger(Next2DMouseEvent.MOUSE_OUT)) {
    //                 outInstance.dispatchEvent(new Next2DMouseEvent(
    //                     Next2DMouseEvent.MOUSE_OUT, true, false
    //                 ));
    //             }

    //         }

    //         // rollOut and rollOver
    //         if (this._$rollOverObject !== instance) {

    //             let hitParent = null;
    //             if (this._$rollOverObject) {

    //                 // (2) prev object rollOut
    //                 target = this._$rollOverObject;

    //                 if (target.willTrigger(Next2DMouseEvent.ROLL_OUT)) {
    //                     target.dispatchEvent(new Next2DMouseEvent(
    //                         Next2DMouseEvent.ROLL_OUT, false, false
    //                     ));
    //                 }

    //                 // rollOver flag instance
    //                 hitParent = target._$parent;
    //                 while (hitParent && hitParent._$root !== hitParent) {

    //                     if (hitParent === instance) {
    //                         break;
    //                     }

    //                     if (hitParent._$mouseEnabled
    //                         && hitParent._$outCheck(stageX, stageY)
    //                     ) {

    //                         let isUpperLayer = false;
    //                         let check = instance;
    //                         while (check && check._$root !== check) {

    //                             if (check !== hitParent) {
    //                                 check = check._$parent;
    //                                 continue;
    //                             }

    //                             isUpperLayer = true;

    //                             break;
    //                         }

    //                         if (!isUpperLayer && hitParent._$parent === instance._$parent
    //                             && hitParent._$index > instance._$index
    //                         ) {
    //                             isUpperLayer = true;
    //                         }

    //                         if (isUpperLayer) {
    //                             break;
    //                         }

    //                     }

    //                     if (hitParent.willTrigger(Next2DMouseEvent.ROLL_OUT)) {
    //                         hitParent.dispatchEvent(new Next2DMouseEvent(
    //                             Next2DMouseEvent.ROLL_OUT, false, false
    //                         ));
    //                     }

    //                     hitParent = hitParent._$parent;

    //                 }
    //             }

    //             // (3) current object rollOver
    //             target = instance;
    //             for (;;) {

    //                 if (target.willTrigger(Next2DMouseEvent.ROLL_OVER)) {
    //                     target.dispatchEvent(new Next2DMouseEvent(
    //                         Next2DMouseEvent.ROLL_OVER, false, false
    //                     ));
    //                 }

    //                 target = target._$parent;
    //                 if (!target || target === hitParent
    //                     || target.stage === target
    //                 ) {
    //                     break;
    //                 }

    //             }

    //         }

    //         this._$rollOverObject = instance;

    //         // (4) mouseOver
    //         switch (true) {

    //             case this._$mouseOverTarget === null:
    //             case this._$mouseOverTarget !== instance:

    //                 if (instance && instance.willTrigger(Next2DMouseEvent.MOUSE_OVER)) {
    //                     instance.dispatchEvent(new Next2DMouseEvent(
    //                         Next2DMouseEvent.MOUSE_OVER, true, false
    //                     ));
    //                 }

    //                 // set target
    //                 this._$mouseOverTarget = instance;
    //                 break;

    //         }

    //         // click reset
    //         if (this._$state === "up") {
    //             this._$clickTarget = null;
    //         }

    //         // PC
    //         if (!$isTouch && this._$state === "up") {

    //             target = instance;
    //             while (target && target.root !== target) {

    //                 if ("_$text" in target) {
    //                     if (target.type === "input") {
    //                         canPointerText = true;
    //                         break;
    //                     }
    //                 }

    //                 if ("buttonMode" in target && target.buttonMode) {
    //                     canPointer = true;
    //                     break;
    //                 }

    //                 target = target._$parent;

    //             }

    //         }

    //     } else {

    //         // (1) mouseOut
    //         if (this._$mouseOverTarget) {

    //             instance = this._$mouseOverTarget;

    //             if (instance.willTrigger(Next2DMouseEvent.MOUSE_OUT)) {
    //                 instance.dispatchEvent(new Next2DMouseEvent(
    //                     Next2DMouseEvent.MOUSE_OUT, true, false
    //                 ));
    //             }
    //         }

    //         // (2) rollOut
    //         if (this._$rollOverObject) {

    //             target = this._$rollOverObject;

    //             // parent target
    //             while (target && target.root !== target) {

    //                 if (target.willTrigger(Next2DMouseEvent.ROLL_OUT)) {
    //                     target.dispatchEvent(new Next2DMouseEvent(
    //                         Next2DMouseEvent.ROLL_OUT, false, false
    //                     ));
    //                 }

    //                 target = target._$parent;

    //             }

    //         }

    //         // reset
    //         this._$rollOverObject  = null;
    //         this._$mouseOverTarget = null;
    //     }

    //     // change cursor
    //     switch (true) {

    //         case canPointerText:
    //             this._$canvas.style.cursor = "text";
    //             break;

    //         case canPointer:
    //             this._$canvas.style.cursor = "pointer";
    //             break;

    //         case !$isTouch && this._$state === "up":
    //             this._$canvas.style.cursor = "auto";
    //             break;

    //     }

    //     if (this._$actions.length > 1) {
    //         this._$doAction();
    //     }
    // }

    // /**
    //  * @return {void}
    //  * @method
    //  * @private
    //  */
    // _$action (): void
    // {

    //     if (this._$stopFlag) {
    //         return ;
    //     }

    //     let loaders = null;

    //     const length = this._$loaders.length;
    //     if (length) {

    //         // clone
    //         loaders = this._$loaders.slice(0);

    //         // array reset
    //         this._$loaders.length = 0;

    //         for (let idx = 0; idx < length; ++idx) {

    //             const loader = loaders[idx];

    //             // first action
    //             if ("content" in loader) {
    //                 loader.content._$prepareActions();
    //             }
    //         }
    //     }

    //     // next frame
    //     this._$stage._$nextFrame();

    //     // enter frame event
    //     if (this._$broadcastEvents.has(Next2DEvent.ENTER_FRAME)) {
    //         this._$dispatchEvent(new Next2DEvent(Next2DEvent.ENTER_FRAME));
    //     }

    //     // constructed event
    //     if (this._$broadcastEvents.has(Next2DEvent.FRAME_CONSTRUCTED)) {
    //         this._$dispatchEvent(new Next2DEvent(Next2DEvent.FRAME_CONSTRUCTED));
    //     }

    //     // execute frame action
    //     this._$doAction();

    //     // exit event
    //     if (this._$broadcastEvents.has(Next2DEvent.EXIT_FRAME)) {
    //         this._$dispatchEvent(new Next2DEvent(Next2DEvent.EXIT_FRAME));
    //     }

    //     // render event
    //     if (this._$stage._$invalidate) {

    //         // reset
    //         this._$stage._$invalidate = false;

    //         // execute render event
    //         this._$dispatchEvent(new Next2DEvent(Next2DEvent.RENDER));

    //     }

    //     // loader events
    //     if (loaders) {

    //         for (let idx: number = 0; idx < loaders.length; ++idx) {

    //             const loader = loaders[idx];

    //             // init event
    //             if (loader.hasEventListener(Next2DEvent.INIT)) {
    //                 loader.dispatchEvent(new Next2DEvent(Next2DEvent.INIT));
    //             }

    //             // complete event
    //             if (loader.hasEventListener(Next2DEvent.COMPLETE)) {
    //                 loader.dispatchEvent(new Next2DEvent(Next2DEvent.COMPLETE));
    //             }

    //         }

    //         // pool
    //         $poolArray(loaders);
    //     }

    //     // execute frame action
    //     this._$doAction();
    // }

    // /**
    //  * @returns void
    //  * @private
    //  */
    // _$draw (): void
    // {
    //     if (!this._$width || !this._$height) {
    //         return ;
    //     }

    //     if (!this._$stage._$isUpdated()) {
    //         return ;
    //     }

    //     if ($rendererWorker) {
    //         $rendererWorker.postMessage({
    //             "command": "draw"
    //         });
    //     }

    //     const context: CanvasToWebGLContext | null = this._$context;
    //     if (!context) {
    //         return ;
    //     }

    //     // reset
    //     context.reset();
    //     context.setTransform(1, 0, 0, 1, 0, 0);
    //     context.clearRect(0, 0, this._$width, this._$height);
    //     context.beginPath();

    //     this._$stage._$draw(
    //         context,
    //         this._$matrix,
    //         $COLOR_ARRAY_IDENTITY
    //     );

    //     // stage end
    //     this._$stage._$updated = false;

    //     context.drawInstacedArray();
    //     context
    //         .frameBuffer
    //         .transferToMainTexture();
    // }

    // /**
    //  * @return {void}
    //  * @method
    //  * @private
    //  */
    // _$doAction (): void
    // {
    //     while (this._$actions.length) {

    //         this._$actionProcess = true;

    //         // target object
    //         const mc: MovieClip | void = this._$actions.pop();
    //         if (!mc) {
    //             continue;
    //         }

    //         mc._$canAction    = false;
    //         mc._$actionOffset = 0;
    //         mc._$actionLimit  = 0;

    //         const frame: number = mc._$currentFrame;
    //         if (!mc._$actions.has(frame)) {
    //             continue;
    //         }

    //         const actions: Function[] | void = mc._$actions.get(frame);
    //         if (!actions) {
    //             continue;
    //         }

    //         mc._$actionProcess = true;
    //         for (let idx: number = 0; idx < actions.length; ++idx) {
    //             $setCurrentLoaderInfo(mc._$loaderInfo);
    //             actions[idx].apply(mc);
    //         }
    //         mc._$actionProcess = false;

    //         // adjustment
    //         if (mc._$frameCache.size) {
    //             mc._$currentFrame = mc._$frameCache.get("nextFrame");
    //             mc._$clearChildren();

    //             mc._$stopFlag  = mc._$frameCache.get("stopFlag");
    //             mc._$isPlaying = mc._$frameCache.get("isPlaying");
    //             mc._$frameCache.clear();
    //         }

    //     }

    //     this._$actionProcess = false;
    //     $setCurrentLoaderInfo(null);
    // }

    // /**
    //  * @return {void}
    //  * @method
    //  * @private
    //  */
    // _$hitTest (): void
    // {
    //     if (this._$stopFlag) {
    //         return ;
    //     }

    //     // setup
    //     const event: MouseEvent | TouchEvent | Event | null = $getEvent();
    //     if (!event) {
    //         return ;
    //     }

    //     // update flags
    //     this._$hitTestStart = true;
    //     $doUpdated(false);

    //     // params
    //     let instance: DisplayObjectImpl<any> | null = null;
    //     let target: DisplayObjectImpl<any> | null   = null;

    //     let x = $window.scrollX;
    //     let y = $window.scrollY;

    //     const div: HTMLElement | null = $document
    //         .getElementById($PREFIX);

    //     if (div) {
    //         const rect: DOMRect = div.getBoundingClientRect();
    //         x += rect.left;
    //         y += rect.top;
    //     }

    //     let pageX: number = 0;
    //     let pageY: number = 0;
    //     if ("changedTouches" in event) {
    //         const changedTouche: Touch = event.changedTouches[0];
    //         pageX = changedTouche.pageX;
    //         pageY = changedTouche.pageY;
    //     } else if ("pageX" in event) {
    //         pageX = event.pageX;
    //         pageY = event.pageY;
    //     }

    //     // drop point
    //     const stageX: number = (pageX - x) / this._$scale;
    //     const stageY: number = (pageY - y) / this._$scale;

    //     // update
    //     this._$stageX = stageX;
    //     this._$stageY = stageY;

    //     // setup
    //     this._$hitObject.x       = stageX;
    //     this._$hitObject.y       = stageY;
    //     this._$hitObject.pointer = "";
    //     this._$hitObject.hit     = null;

    //     // reset
    //     $hitContext.setTransform(1, 0, 0, 1, 0, 0);
    //     $hitContext.beginPath();

    //     // hit test
    //     $MATRIX_HIT_ARRAY_IDENTITY[4] = this.tx;
    //     $MATRIX_HIT_ARRAY_IDENTITY[5] = this.ty;
    //     this._$stage._$mouseHit(
    //         $hitContext, $MATRIX_HIT_ARRAY_IDENTITY,
    //         this._$hitObject, true
    //     );

    //     // stop event
    //     if (this._$hitObject.hit) {
    //         event.preventDefault();
    //     }

    //     // change state
    //     let canPointerText: boolean = false;
    //     let staticPointer: boolean  = false;
    //     let canPointer: boolean     = false;

    //     const eventType: string = $getEventType();
    //     switch (eventType) {

    //         case $TOUCH_MOVE:
    //         case $MOUSE_MOVE:

    //             if ($dropTarget) {

    //                 const point: Point = $dropTarget._$dragMousePoint();

    //                 let dragX: number = point.x;
    //                 let dragY: number = point.y;

    //                 if (!$dragRules.lock) {
    //                     dragX += $dragRules.position.x;
    //                     dragY += $dragRules.position.y;
    //                 }

    //                 const bounds: Rectangle | null = $dragRules.bounds;
    //                 if (bounds) {
    //                     dragX = $clamp(dragX, bounds.left, bounds.right);
    //                     dragY = $clamp(dragY, bounds.top,  bounds.bottom);
    //                 }

    //                 // set move xy
    //                 $dropTarget.x = dragX;
    //                 $dropTarget.y = dragY;

    //             }

    //             if (this._$clickTarget
    //                 && "_$text" in this._$clickTarget
    //                 && this._$clickTarget.scrollEnabled
    //                 && this._$clickTarget.selectIndex === -1
    //             ) {

    //                 const deltaX: number = this._$deltaX - pageX;
    //                 const deltaY: number = this._$deltaY - pageY;

    //                 // @ts-ignore
    //                 this._$clickTarget.scrollX += deltaX / (this._$clickTarget.textWidth / this._$clickTarget.width);

    //                 // @ts-ignore
    //                 this._$clickTarget.scrollY += deltaY / (this._$clickTarget.textHeight / this._$clickTarget.height);
    //             }

    //             this._$deltaX = pageX;
    //             this._$deltaY = pageY;
    //             break;

    //         case $TOUCH_START:
    //         case $MOUSE_DOWN:
    //             this._$deltaX = pageX;
    //             this._$deltaY = pageY;
    //             this._$state  = "down";
    //             canPointer    = this._$canvas.style.cursor === "pointer";
    //             staticPointer = true;
    //             break;

    //         case $TOUCH_END:
    //         case $MOUSE_UP:
    //         case $DOUBLE_CLICK:
    //             this._$deltaX = 0;
    //             this._$deltaY = 0;
    //             this._$state = "up";
    //             break;

    //     }

    //     // execute
    //     switch (true) {

    //         case this._$hitObject.hit === null:
    //         case eventType === $MOUSE_LEAVE:

    //             // (1) mouseOut
    //             if (this._$mouseOverTarget) {

    //                 instance = this._$mouseOverTarget;
    //                 if (instance.willTrigger(Next2DMouseEvent.MOUSE_OUT)) {
    //                     instance.dispatchEvent(new Next2DMouseEvent(
    //                         Next2DMouseEvent.MOUSE_OUT, true, false
    //                     ));
    //                 }

    //             }

    //             // (2) rollOut
    //             if (this._$rollOverObject) {

    //                 target = this._$rollOverObject;

    //                 // parent target
    //                 while (target && target.root !== target) {

    //                     if (target.willTrigger(Next2DMouseEvent.ROLL_OUT)) {
    //                         target.dispatchEvent(new Next2DMouseEvent(
    //                             Next2DMouseEvent.ROLL_OUT, false, false
    //                         ));
    //                     }

    //                     target = target._$parent;

    //                 }

    //             }

    //             // reset
    //             this._$rollOverObject  = null;
    //             this._$mouseOverTarget = null;

    //             // stage event
    //             switch (eventType) {

    //                 case $MOUSE_WHEEL:
    //                     if (this._$stage.hasEventListener(Next2DMouseEvent.MOUSE_WHEEL)) {
    //                         this._$stage.dispatchEvent(new Next2DMouseEvent(
    //                             Next2DMouseEvent.MOUSE_WHEEL, true, false
    //                         ));
    //                     }
    //                     break;

    //                 case $TOUCH_START:
    //                 case $MOUSE_DOWN:
    //                     if (this._$textField && "focus" in this._$textField) {
    //                         this._$textField.focus = false;
    //                         this._$textField       = null;
    //                     }

    //                     if (this._$stage.hasEventListener(Next2DMouseEvent.MOUSE_DOWN)) {
    //                         this._$stage.dispatchEvent(new Next2DMouseEvent(
    //                             Next2DMouseEvent.MOUSE_DOWN, true, false
    //                         ));
    //                     }
    //                     break;

    //                 case $TOUCH_END:
    //                 case $MOUSE_UP:

    //                     if (this._$stage.hasEventListener(Next2DMouseEvent.CLICK)) {
    //                         this._$stage.dispatchEvent(new Next2DMouseEvent(
    //                             Next2DMouseEvent.CLICK, true, false
    //                         ));
    //                     }

    //                     if (this._$stage.hasEventListener(Next2DMouseEvent.MOUSE_UP)) {
    //                         this._$stage.dispatchEvent(new Next2DMouseEvent(
    //                             Next2DMouseEvent.MOUSE_UP, true, false
    //                         ));
    //                     }

    //                     break;

    //                 case $TOUCH_MOVE:
    //                 case $MOUSE_MOVE:
    //                     if (this._$stage.hasEventListener(Next2DMouseEvent.MOUSE_MOVE)) {
    //                         this._$stage.dispatchEvent(new Next2DMouseEvent(
    //                             Next2DMouseEvent.MOUSE_MOVE, true, false
    //                         ));
    //                     }
    //                     break;

    //                 case $DOUBLE_CLICK:
    //                     if (this._$stage.hasEventListener(Next2DMouseEvent.DOUBLE_CLICK)) {
    //                         this._$stage.dispatchEvent(new Next2DMouseEvent(
    //                             Next2DMouseEvent.DOUBLE_CLICK, true, false
    //                         ));
    //                     }
    //                     break;

    //             }

    //             break;

    //         default:

    //             instance = this._$hitObject.hit;
    //             switch (eventType) {

    //                 // move event
    //                 case $TOUCH_MOVE:
    //                 case $MOUSE_MOVE:

    //                     // (1) mouseMove
    //                     if (instance.willTrigger(Next2DMouseEvent.MOUSE_MOVE)) {
    //                         instance.dispatchEvent(new Next2DMouseEvent(
    //                             Next2DMouseEvent.MOUSE_MOVE, true, false
    //                         ));
    //                     }

    //                     // (2) mouseOut
    //                     if (this._$mouseOverTarget
    //                         && this._$mouseOverTarget !== instance
    //                     ) {

    //                         const outInstance: DisplayObjectImpl<any> = this._$mouseOverTarget;

    //                         if (outInstance.willTrigger(Next2DMouseEvent.MOUSE_OUT)) {
    //                             outInstance.dispatchEvent(new Next2DMouseEvent(
    //                                 Next2DMouseEvent.MOUSE_OUT, true, false
    //                             ));
    //                         }

    //                     }

    //                     // rollOut and rollOver
    //                     if (this._$rollOverObject !== instance) {

    //                         let hitParent: DisplayObjectImpl<any> | null = null;
    //                         if (this._$rollOverObject) {

    //                             // (3) prev object rollOut
    //                             target = this._$rollOverObject;

    //                             if (target.willTrigger(Next2DMouseEvent.ROLL_OUT)) {
    //                                 target.dispatchEvent(new Next2DMouseEvent(
    //                                     Next2DMouseEvent.ROLL_OUT, false, false
    //                                 ));
    //                             }

    //                             // rollOver flag instance
    //                             hitParent = target._$parent;
    //                             while (hitParent && hitParent._$root !== hitParent) {

    //                                 if (hitParent === instance) {
    //                                     break;
    //                                 }

    //                                 if (hitParent._$mouseEnabled
    //                                     && hitParent._$outCheck(stageX, stageY)
    //                                 ) {

    //                                     let isUpperLayer: boolean = false;
    //                                     let check: DisplayObjectImpl<any> | null = instance;
    //                                     while (check && check._$root !== check) {

    //                                         if (check !== hitParent) {
    //                                             check = check._$parent;
    //                                             continue;
    //                                         }

    //                                         isUpperLayer = true;

    //                                         break;
    //                                     }

    //                                     if (!isUpperLayer && hitParent._$parent === instance._$parent
    //                                         && hitParent._$index > instance._$index
    //                                     ) {
    //                                         isUpperLayer = true;
    //                                     }

    //                                     if (isUpperLayer) {
    //                                         break;
    //                                     }

    //                                 }

    //                                 if (hitParent.willTrigger(Next2DMouseEvent.ROLL_OUT)) {
    //                                     hitParent.dispatchEvent(new Next2DMouseEvent(
    //                                         Next2DMouseEvent.ROLL_OUT, false, false
    //                                     ));
    //                                 }

    //                                 hitParent = hitParent._$parent;

    //                             }
    //                         }

    //                         // (4) current object rollOver
    //                         target = instance;
    //                         for (;;) {

    //                             if (target.willTrigger(Next2DMouseEvent.ROLL_OVER)) {
    //                                 target.dispatchEvent(new Next2DMouseEvent(
    //                                     Next2DMouseEvent.ROLL_OVER, false, false
    //                                 ));
    //                             }

    //                             target = target._$parent;
    //                             if (!target || target === hitParent
    //                                 || target.stage === target
    //                             ) {
    //                                 break;
    //                             }

    //                         }

    //                     }

    //                     this._$rollOverObject = instance;

    //                     // (5) mouseOver
    //                     switch (true) {

    //                         case this._$mouseOverTarget === null:
    //                         case this._$mouseOverTarget !== instance:

    //                             if (instance.willTrigger(Next2DMouseEvent.MOUSE_OVER)) {
    //                                 instance.dispatchEvent(new Next2DMouseEvent(
    //                                     Next2DMouseEvent.MOUSE_OVER, true, false
    //                                 ));
    //                             }

    //                             // set target
    //                             this._$mouseOverTarget = instance;
    //                             break;

    //                     }

    //                     // click reset
    //                     if (this._$state === "up") {
    //                         this._$clickTarget = null;
    //                     } else {
    //                         if (this._$textField) {
    //                             this._$textField._$setIndex(
    //                                 stageX - $MATRIX_HIT_ARRAY_IDENTITY[4],
    //                                 stageY - $MATRIX_HIT_ARRAY_IDENTITY[5]
    //                             );
    //                         }
    //                     }

    //                     break;

    //                 // down event
    //                 case $TOUCH_START:
    //                 case $MOUSE_DOWN:

    //                     if (this._$textField
    //                         && instance !== this._$textField
    //                     ) {
    //                         this._$textField.focus = false;
    //                         this._$textField       = null;
    //                     }

    //                     // TextField focus out
    //                     if ("_$text" in instance) {
    //                         instance.focus   = true;
    //                         instance._$setIndex(
    //                             stageX - $MATRIX_HIT_ARRAY_IDENTITY[4],
    //                             stageY - $MATRIX_HIT_ARRAY_IDENTITY[5]
    //                         );
    //                         this._$textField = instance;

    //                         // move text area element
    //                         $textArea.style.left = `${pageX}px`;
    //                         $textArea.style.top  = `${pageY}px`;
    //                     }

    //                     // (3) mouseDown
    //                     if (instance.willTrigger(Next2DMouseEvent.MOUSE_DOWN)) {
    //                         instance.dispatchEvent(new Next2DMouseEvent(
    //                             Next2DMouseEvent.MOUSE_DOWN, true, false
    //                         ));
    //                     }

    //                     // (4) click
    //                     this._$clickTarget = instance;

    //                     break;

    //                 // up event
    //                 case $TOUCH_END:
    //                 case $MOUSE_UP:

    //                     // (1) mouseUp
    //                     if (instance.willTrigger(Next2DMouseEvent.MOUSE_UP)) {
    //                         instance.dispatchEvent(new Next2DMouseEvent(
    //                             Next2DMouseEvent.MOUSE_UP, true, false
    //                         ));
    //                     }

    //                     // (2) click
    //                     if (this._$clickTarget === instance) {

    //                         if (instance.willTrigger(Next2DMouseEvent.CLICK)) {
    //                             instance.dispatchEvent(new Next2DMouseEvent(
    //                                 Next2DMouseEvent.CLICK, true, false
    //                             ));
    //                         }

    //                     }

    //                     // reset
    //                     this._$clickTarget = null;

    //                     break;

    //                 case $MOUSE_WHEEL:
    //                     if (instance.willTrigger(Next2DMouseEvent.MOUSE_WHEEL)) {
    //                         instance.dispatchEvent(
    //                             new Next2DMouseEvent(Next2DMouseEvent.MOUSE_WHEEL)
    //                         );
    //                     }

    //                     if (instance.scrollEnabled) {
    //                         if ("deltaX" in event) {
    //                             // @ts-ignore
    //                             instance.scrollX += event.deltaX / (instance.textWidth / instance.width);
    //                         }

    //                         if ("deltaY" in event) {
    //                             // @ts-ignore
    //                             instance.scrollY += event.deltaY / (instance.textHeight / instance.height);
    //                         }
    //                     }

    //                     break;

    //                 case $DOUBLE_CLICK:
    //                     if (instance.willTrigger(Next2DMouseEvent.DOUBLE_CLICK)) {
    //                         instance.dispatchEvent(
    //                             new Next2DMouseEvent(Next2DMouseEvent.DOUBLE_CLICK)
    //                         );
    //                     }
    //                     break;

    //                 default:
    //                     break;

    //             }

    //             // PC
    //             if (!staticPointer) {

    //                 if (!$isTouch && this._$state === "up") {

    //                     target = instance;
    //                     while (target && target.root !== target) {

    //                         if ("_$text" in target) {

    //                             if (target.type === "input") {
    //                                 canPointerText = true;
    //                                 break;
    //                             }

    //                         } else {

    //                             if (target._$buttonMode) {
    //                                 canPointer = true;
    //                                 break;
    //                             }

    //                         }

    //                         target = target._$parent;

    //                     }
    //                 }
    //             }
    //             break;

    //     }

    //     // change cursor
    //     switch (true) {

    //         case canPointerText:
    //             this._$canvas.style.cursor = "text";
    //             break;

    //         case canPointer:
    //             this._$canvas.style.cursor = "pointer";
    //             break;

    //         case !$isTouch && this._$state === "up":
    //             this._$canvas.style.cursor = "auto";
    //             break;

    //     }

    //     // execute action
    //     if (!this._$actionProcess && this._$actions.length > 1) {
    //         this._$doAction();
    //     }

    //     if ($isUpdated()) {

    //         // action script
    //         this._$stage._$prepareActions();
    //         if (!this._$actionProcess) {
    //             this._$doAction();
    //         }

    //     }

    //     this._$hitTestStart = false;
    // }
}

export const $player = new Player();