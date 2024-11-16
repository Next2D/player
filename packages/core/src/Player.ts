import type { IPlayerOptions } from "./interface/IPlayerOptions";
import { $cacheStore } from "@next2d/cache";
import { $rendererWorker } from "./RendererWorker";
import { execute as playerCreateContainerElementService } from "./Player/service/PlayerCreateContainerElementService";
import { execute as playerApplyContainerElementStyleService } from "./Player/service/PlayerApplyContainerElementStyleService";
import { execute as playerLoadingAnimationService } from "./Player/service/PlayerLoadingAnimationService";
import { execute as playerResizeEventService } from "./Player/usecase/PlayerResizeEventUseCase";
import { execute as playerResizeRegisterService } from "./Player/usecase/PlayerResizeRegisterUseCase";
import { execute as playerPlayUseCase } from "./Player/usecase/PlayerPlayUseCase";
import { execute as playerStopService } from "./Player/service/PlayerStopService";
import { execute as playerRegisterEventUseCase } from "./Player/usecase/PlayerRegisterEventUseCase";

/**
 * @description Next2Dの描画、イベント、設定、コントロールの管理クラスです。
 *              This class manages Next2D drawings, events, settings, and controls.
 *
 * @class
 * @public
 */
export class Player
{
    /**
     * @description devicePixelRatioを含んだcanvasの描画領域の幅
     *              The width of the drawing area of the canvas including devicePixelRatio
     *
     * @type {number}
     * @default 0
     * @private
     */
    public rendererWidth: number;

    /**
     * @description devicePixelRatioを含んだcanvasの描画領域の高さ
     *              The height of the drawing area of the canvas including devicePixelRatio
     *
     * @type {number}
     * @default 0
     * @private
     */
    public rendererHeight: number;

    /**
     * @description メインのdiv elementの幅
     *              Width of the main div element
     *
     * @type {number}
     * @default 0
     * @public
     */
    public screenWidth: number;

    /**
     * @description メインのdiv elementの高さ
     *              Height of the main div element
     *
     * @type {number}
     * @default 0
     * @public
     */
    public screenHeight: number;

    /**
     * @description devicePixelRatioを含んだcanvasの描画領域の拡大率
     *              The magnification of the drawing area of the canvas including devicePixelRatio
     *
     * @type {number}
     * @default 1
     * @private
     */
    public rendererScale: number;

    /**
     * @description optionで指定された描画領域の固定幅、optionで指定されない場合は0
     *              The fixed width of the drawing area specified by the option, 0 if not specified by the option
     *
     * @type {number}
     * @default 0
     * @private
     */
    private _$fixedWidth: number;

    /**
     * @description optionで指定された描画領域の固定高さ、optionで指定されない場合は0
     *              The fixed height of the drawing area specified by the option, 0 if not specified by the option
     *
     * @type {number}
     * @default 0
     * @private
     */
    private _$fixedHeight: number;

    /**
     * @description Playerの停止フラグ
     *              Player stop flag
     *
     * @type {boolean}
     * @default true
     * @private
     */
    public stopFlag: boolean;

    /**
     * @description Playerの描画開始時間
     *              Player drawing start time
     *
     * @type {number}
     * @default 0
     * @private
     */
    public startTime: number;

    /**
     * @description PlayerのFPS
     *              Player FPS
     *
     * @type {number}
     * @default 16
     * @private
     */
    public fps: number;

    /**
     * @description optionで指定されたcanvasのID、optionで指定されない場合は空文字
     *              The ID of the canvas specified by the option, an empty string if not specified by the option
     *
     * @type {string}
     * @default ""
     * @private
     */
    private _$tagId: string;

    /**
     * @description フルスクリーンモードの設定
     *              Full screen mode setting
     *
     * @type {boolean}
     * @default false
     * @private
     */
    private _$fullScreen: boolean;

    /**
     * @description Playerの描画処理関数のタイマーID
     *              Timer ID of the drawing process function of Player
     *
     * @type {number}
     * @default -1
     * @private
     */
    public timerId: number;

    /**
     * @description マウスの状態
     *             Mouse state
     *
     * @type {"up" | "down"}
     * @default "up"
     * @public
     */
    public mouseState: "up" | "down";

    // private _$textField: TextField | null;
    // private _$rollOverObject: EventDispatcherImpl<any> | null;
    // private _$mouseOverTarget: EventDispatcherImpl<any> | null;
    // private _$hitTestStart: boolean;
    // private _$stageX: number;
    // private _$stageY: number;
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
        this.rendererWidth  = 0;
        this.rendererHeight = 0;
        this.rendererScale  = 1;
        this.screenWidth    = 0;
        this.screenHeight   = 0;

        this.stopFlag   = true;
        this.startTime  = 0;
        this.fps        = 16;
        this.timerId    = -1;
        this.mouseState = "up";

        // options
        this._$fixedWidth  = 0;
        this._$fixedHeight = 0;
        this._$tagId       = "";
        this._$fullScreen  = false;

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
        //  * @type {TextField}
        //  * @default null
        //  * @private
        //  */
        // this._$textField = null;

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

        playerRegisterEventUseCase();
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
        playerResizeEventService();
    }

    /**
     * @description Playerの描画を開始します。
     *              Start drawing Player.
     *
     * @return {void}
     * @method
     * @public
     */
    play (): void
    {
        playerPlayUseCase(this);
    }

    /**
     * @description Playerの描画を停止します。
     *              Stop drawing Player.
     *
     * @return {void}
     * @method
     * @public
     */
    stop (): void
    {
        playerStopService(this);
    }

    /**
     * @description Playerの描画キャッシュを全て初期化
     *              Initialize all drawing caches of Player
     *
     * @param  {string} id
     * @return {void}
     * @method
     * @public
     */
    cacheClear (id: string): void
    {
        $cacheStore.removeById(id);
        $rendererWorker.postMessage({
            "command": "cacheClear"
        });
    }

    /**
     * @description Playerのオプション設定を変更
     *              Change the Player option settings
     *
     * @param  {object} [options=null]
     * @return {void}
     * @public
     */
    setOptions (options: IPlayerOptions | null = null): void
    {
        if (!options) {
            return ;
        }

        this._$fixedWidth  = options.width   || this._$fixedWidth;
        this._$fixedHeight = options.height  || this._$fixedHeight;
        this._$tagId       = options.tagId   || this._$tagId;
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
    boot (options: IPlayerOptions | null = null): void
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
            playerResizeRegisterService();
        }

        // initialize resize
        playerResizeEventService();
    }

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
}

export const $player = new Player();