import type { IDisplayObject } from "./interface/IDisplayObject";
import { Sprite } from "./Sprite";
import { FrameLabel } from "./FrameLabel";
import { Sound } from "@next2d/media";
import { execute as movieClipGetChildrenService } from "./MovieClip/service/MovieClipGetChildrenService";

/**
 * @description MovieClip クラスは、Sprite、DisplayObjectContainer、InteractiveObject、DisplayObject
 *              および EventDispatcher クラスを継承します。
 *              MovieClip オブジェクトには、Sprite オブジェクトとは違ってタイムラインがあります。
 *              タイムラインの再生ヘッドが停止されても、その MovieClip オブジェクトの子 MovieClip オブジェクトの再生ヘッドは停止しません。
 *
 *              The MovieClip class inherits from the following classes: Sprite, DisplayObjectContainer,
 *              InteractiveObject, DisplayObject, and EventDispatcher.
 *              Unlike the Sprite object, a MovieClip object has a timeline.
 *              When the playback head of the timeline is stopped,
 *              the playback head of the child MovieClip object of that MovieClip object will not be stopped.
 *
 * @class
 * @memberOf next2d.display
 * @extends  Sprite
 */
export class MovieClip extends Sprite
{
    /**
     * @description フレーム毎のラベルマップ
     *              Label map per frame
     *
     * @type {Map<number, FrameLabel>}
     * @default null
     * @private
     */
    public $labels: Map<number, FrameLabel> | null;

    /**
     * @description フレーム毎のアクションマップ
     *              Action map per frame
     *
     * @type {Map<number, Function[]>}
     * @default null
     * @private
     */
    public $actions: Map<number, Function[]> | null;

    /**
     * @description フレーム毎のサウンドマップ
     *              Sound map per frame
     *
     * @type {Map<number, Sound[]>}
     * @default null
     * @private
     */
    public $sounds: Map<number, Sound[]> | null;

    /**
     * @description アクション実行フラグ
     *              Action execution flag
     *
     * @type {boolean}
     * @default false
     * @private
     */
    public $canAction: boolean;

    /**
     * @description MovieClip インスタンス内のフレーム総数です。
     *              The total number of frames in the MovieClip instance.
     *
     * @member  {number}
     * @default 1
     * @readonly
     * @public
     */
    public totalFrames: number;

    /**
     * @description MovieClipのタイムライン内の再生ヘッドが置かれているフレームの番号を示します。
     *              Specifies the number of the frame in which the playhead is located
     *
     * @member {number}
     * @default 1
     * @readonly
     * @public
     */
    public currentFrame: number;

    /**
     * @description 停止フラグ
     *              Stop flag
     *
     * @type {boolean}
     * @default false
     * @private
     */
    private _$stopFlag: boolean;

    /**
     * @description サウンド実行フラグ
     *              Sound execution flag
     *
     * @type {boolean}
     * @default true
     * @private
     */
    private _$canSound: boolean;

    /**
     * @description タイムラインヘッドが移動したかどうか
     *              Whether the timeline head has moved
     *
     * @type {boolean}
     * @default true
     * @private
     */
    public $hasTimelineHeadMoved: boolean;

    // private _$actionProcess: boolean;
    // private _$frameCache: Map<string, any> | null;
    // private _$actionOffset: number;
    // private _$actionLimit: number;

    /**
     * @description MovieClipの機能を所持しているかを返却
     *              Returns whether the display object has MovieClip functionality.
     *
     * @type {boolean}
     * @readonly
     * @public
     */
    public readonly isTimelineEnabled: boolean;

    /**
     * @constructor
     * @public
     */
    constructor()
    {
        super();

        this.currentFrame = 1;
        this.totalFrames  = 1;
        this.isTimelineEnabled = true;

        this.$actions   = null;
        this.$labels    = null;
        this.$sounds    = null;
        this.$canAction = true;

        this.$hasTimelineHeadMoved = true;

        this._$stopFlag = false;
        this._$canSound = true;
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return {string}
     * @const
     * @static
     */
    static get namespace (): string
    {
        return "next2d.display.MovieClip";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @return {string}
     * @const
     * @public
     */
    get namespace (): string
    {
        return "next2d.display.MovieClip";
    }

    /**
     * @description MovieClip インスタンスのタイムライン内の現在のフレームにあるラベルです。
     *              The label at the current frame in the timeline of the MovieClip instance.
     *
     * @member  {FrameLabel|null}
     * @readonly
     * @public
     */
    get currentFrameLabel (): FrameLabel | null
    {
        if (!this.$labels) {
            return null;
        }

        const frame = this.currentFrame;
        if (!this.$labels.has(frame)) {
            return null;
        }

        return this.$labels.get(frame) || null;
    }

    /**
     * @description 現在のシーンの FrameLabel オブジェクトの配列を返します。
     *              Returns an array of FrameLabel objects from the current scene.
     *
     * @member  {array|null}
     * @readonly
     * @public
     */
    get currentLabels (): FrameLabel[] | null
    {
        return !this.$labels || !this.$labels.size
            ? null
            : Array.from(this.$labels.values());
    }

    /**
     * @description ムービークリップが現在再生されているかどうかを示すブール値です。
     *              A Boolean value that indicates whether a movie clip is curently playing.
     *
     * @member  {boolean}
     * @default false
     * @readonly
     * @public
     */
    get isPlaying (): boolean
    {
        return !this._$stopFlag;
    }

    /**
     * @description MovieClipのフレームヘッダーの移動方法の設定オブジェクトを返します。
     *              Returns a configuration object for how MovieClip's frame headers are moved.
     *
     * @member  {object}
     * @default null
     * @public
     */
    // get loopConfig (): LoopConfigImpl | null
    // {
    //     if (this._$loopConfig) {
    //         return this._$loopConfig;
    //     }

    //     const place: PlaceObjectImpl | null = this._$placeObject || this._$getPlaceObject();
    //     if (!place || !place.loop) {
    //         return null;
    //     }

    //     if (this._$tweenFrame) {
    //         this._$changePlace = this._$tweenFrame !== this._$parent._$currentFrame;
    //         this._$tweenFrame  = 0;
    //     }

    //     if (place.loop.tweenFrame) {
    //         this._$tweenFrame = place.loop.tweenFrame;
    //     }

    //     return place.loop;
    // }
    // set loopConfig (loop_config: LoopConfigImpl | null)
    // {
    //     this._$loopConfig = loop_config;
    //     if (loop_config) {
    //         loop_config.frame   = this._$startFrame;
    //         this._$loopConfig   = loop_config;
    //         this._$currentFrame = this._$getLoopFrame(loop_config);
    //     }
    // }

    /**
     * @description 指定されたフレームで SWF ファイルの再生を開始します。
     *              Starts playing the SWF file at the specified frame.
     *
     * @param  {number|string} frame
     * @return {void}
     * @method
     * @public
     */
    // gotoAndPlay (frame: string | number): void
    // {
    //     this.play();
    //     this._$goToFrame(frame);
    // }

    /**
     * @description このムービークリップの指定されたフレームに再生ヘッドを送り、そこで停止させます。
     *              Brings the playhead to the specified frame
     *              of the movie clip and stops it there.
     *
     * @param  {number|string} frame
     * @return {void}
     * @method
     * @public
     */
    // gotoAndStop (frame: string | number): void
    // {
    //     this.stop();
    //     this._$goToFrame(frame);
    // }

    /**
     * @description 次のフレームに再生ヘッドを送り、停止します。
     *              Sends the playhead to the next frame and stops it.
     *
     * @return {void}
     * @method
     * @public
     */
    // nextFrame (): void
    // {
    //     this.stop();
    //     if (this._$totalFrames > this._$currentFrame) {
    //         this._$goToFrame(this._$currentFrame + 1);
    //     }
    // }

    /**
     * @description ムービークリップのタイムライン内で再生ヘッドを移動します。
     *              Moves the playhead in the timeline of the movie clip.
     *
     * @return {void}
     * @method
     * @public
     */
    // play (): void
    // {
    //     this._$stopFlag = false;
    //     this._$updateState();
    // }

    /**
     * @description 直前のフレームに再生ヘッドを戻し、停止します。
     *              Sends the playhead to the previous frame and stops it.
     *
     * @return {void}
     * @method
     * @public
     */
    // prevFrame (): void
    // {
    //     const frame: number = this._$currentFrame - 1;
    //     if (frame) {
    //         this.stop();
    //         this._$goToFrame(frame);
    //     }
    // }

    /**
     * @description ムービークリップ内の再生ヘッドを停止します。
     *              Stops the playhead in the movie clip.
     *
     * @return {void}
     * @method
     * @public
     */
    stop (): void
    {
        this._$stopFlag = true;
    }

    /**
     * @description タイムラインに対して動的にLabelを追加できます。
     *              Labels can be added dynamically to the timeline.
     *
     * @param  {FrameLabel} frame_label
     * @return {void}
     * @public
     */
    addFrameLabel (frame_label: FrameLabel): void
    {
        if (!this.$labels) {
            this.$labels = new Map();
        }

        this.$labels.set(frame_label.frame, frame_label);
    }

    // /**
    //  * @description 指定のフレームのアクションを追加できます
    //  *              You can add an action for a given frame.
    //  *
    //  * @example <caption>Example1 usage of addFrameScript.</caption>
    //  * // case 1
    //  * const {MovieClip} = next2d.display;
    //  * const movieClip = new MovieClip();
    //  * movieClip.addFrameScript(1 , function ()
    //  * {
    //  *     this.stop();
    //  * });
    //  *
    //  * @example <caption>Example3 usage of addFrameScript.</caption>
    //  * // case 2
    //  * const {MovieClip} = next2d.display;
    //  * const movieClip = new MovieClip();
    //  * movieClip.addFrameScript(1, method_1, 2, method_2, 10, method_10);
    //  *
    //  * @return {void}
    //  * @method
    //  * @public
    //  */
    // addFrameScript (...args: any[]): void
    // {
    //     for (let idx = 0; idx < args.length; idx += 2) {

    //         const value: string | number = args[idx];

    //         let frame: number = +value;
    //         if ($isNaN(frame)) {
    //             frame = this._$getFrameForLabel(`${value}`);
    //         }

    //         const script: Function = args[idx + 1];
    //         if (script && frame && this._$totalFrames >= frame) {
    //             this._$addAction(frame, script);
    //         }

    //         // end action add
    //         if (frame === this._$currentFrame) {

    //             // set action position
    //             const player: Player = $currentPlayer();
    //             player._$actionOffset = player._$actions.length;

    //             // execute action stack
    //             this._$canAction = true;
    //             this._$setAction();

    //             // adjustment
    //             if (player._$actionOffset !== player._$actions.length) {

    //                 // marge
    //                 const actions: MovieClip[] = player._$actions.splice(0, player._$actionOffset);
    //                 player._$actions.push(
    //                     ...player._$actions,
    //                     ...actions
    //                 );

    //                 // reset
    //                 player._$actionOffset = 0;
    //             }

    //         }
    //     }
    // }

    /**
     * @description コンテナのアクティブな子要素を返却
     *              Returns the active child elements of the container.
     *
     * @return {array}
     * @method
     * @protected
     */
    get children (): IDisplayObject<any>
    {
        if (!this.$hasTimelineHeadMoved || this.characterId === -1) {
            return this._$children;
        }

        this.$hasTimelineHeadMoved = false;

        return movieClipGetChildrenService(this, this._$children);
    }
}