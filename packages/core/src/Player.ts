import type { IPlayerOptions } from "./interface/IPlayerOptions";
import { $cacheStore } from "@next2d/cache";
import { $rendererWorker } from "./RendererWorker";
import { execute as playerResizeEventService } from "./Player/usecase/PlayerResizeEventUseCase";
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
class Player
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
     * @public
     */
    public fixedWidth: number;

    /**
     * @description optionで指定された描画領域の固定高さ、optionで指定されない場合は0
     *              The fixed height of the drawing area specified by the option, 0 if not specified by the option
     *
     * @type {number}
     * @default 0
     * @public
     */
    public fixedHeight: number;

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
        this.fixedWidth   = 0;
        this.fixedHeight  = 0;
        this._$tagId      = "";
        this._$fullScreen = false;

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

        this.fixedWidth   = options.width   || this.fixedWidth;
        this.fixedHeight  = options.height  || this.fixedHeight;
        this._$tagId      = options.tagId   || this._$tagId;
        this._$fullScreen = !!options.fullScreen;
    }
}

export const $player = new Player();