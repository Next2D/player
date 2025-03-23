import type { IDisplayObject } from "./interface/IDisplayObject";
import type { ICharacter } from "./interface/ICharacter";
import type { LoaderInfo } from "./LoaderInfo";
import type { IMovieClipCharacter } from "./interface/IMovieClipCharacter";
import { Sprite } from "./Sprite";
import { FrameLabel } from "./FrameLabel";
import { Sound } from "@next2d/media";
import { execute as movieClipGetChildrenService } from "./MovieClip/service/MovieClipGetChildrenService";
import { execute as movieClipAddFrameLabelService } from "./MovieClip/service/MovieClipAddFrameLabelService";
import { execute as movieClipCurrentFrameLabelService } from "./MovieClip/service/MovieClipCurrentFrameLabelService";
import { execute as movieClipCurrentLabelsService } from "./MovieClip/service/MovieClipCurrentLabelsService";
import { execute as displayObjectApplyChangesService } from "./DisplayObject/service/DisplayObjectApplyChangesService";
import { execute as movieClipGotoAndPlayUseCase } from "./MovieClip/usecase/MovieClipGotoAndPlayUseCase";
import { execute as movieClipGotoAndStopUseCase } from "./MovieClip/usecase/MovieClipGotoAndStopUseCase";
import { execute as movieClipNextFrameUseCase } from "./MovieClip/usecase/MovieClipNextFrameUseCase";
import { execute as movieClipPrevFrameUseCase } from "./MovieClip/usecase/MovieClipPrevFrameUseCase";
import { execute as movieClipBuildFromCharacterUseCase } from "./MovieClip/usecase/MovieClipBuildFromCharacterUseCase";

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
     * @default true
     * @private
     */
    public $canAction: boolean;

    /**
     * @description 待機フラグ
     *              Wait flag
     *
     * @type {boolean}
     * @default false
     * @private
     */
    public $wait: boolean;

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
    public $canSound: boolean;

    /**
     * @description タイムラインヘッドが移動したかどうか
     *              Whether the timeline head has moved
     *
     * @type {boolean}
     * @default true
     * @private
     */
    public $hasTimelineHeadMoved: boolean;

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

        // public
        this.currentFrame = 1;
        this.totalFrames  = 1;
        this.isTimelineEnabled = true;

        // protected
        this.$actions   = null;
        this.$labels    = null;
        this.$sounds    = null;
        this.$canAction = true;
        this.$wait      = false;
        this.$canSound  = true;
        this.$hasTimelineHeadMoved = true;

        // private
        this._$stopFlag = false;
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
        return movieClipCurrentFrameLabelService(this);
    }

    /**
     * @description 現在のシーンの FrameLabel オブジェクトの配列を返します。
     *              Returns an array of FrameLabel objects from the current scene.
     *
     * @member  {FrameLabel[]|null}
     * @readonly
     * @public
     */
    get currentLabels (): FrameLabel[] | null
    {
        return movieClipCurrentLabelsService(this);
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
     * @param  {string|number} frame
     * @return {void}
     * @method
     * @public
     */
    gotoAndPlay (frame: string | number): void
    {
        movieClipGotoAndPlayUseCase(this, frame);
    }

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
    gotoAndStop (frame: string | number): void
    {
        movieClipGotoAndStopUseCase(this, frame);
    }

    /**
     * @description 次のフレームに再生ヘッドを送り、停止します。
     *              Sends the playhead to the next frame and stops it.
     *
     * @return {void}
     * @method
     * @public
     */
    nextFrame (): void
    {
        movieClipNextFrameUseCase(this);
    }

    /**
     * @description ムービークリップのタイムライン内で再生ヘッドを移動します。
     *              Moves the playhead in the timeline of the movie clip.
     *
     * @return {void}
     * @method
     * @public
     */
    play (): void
    {
        this._$stopFlag = false;
        displayObjectApplyChangesService(this);
    }

    /**
     * @description 直前のフレームに再生ヘッドを戻し、停止します。
     *              Sends the playhead to the previous frame and stops it.
     *
     * @return {void}
     * @method
     * @public
     */
    prevFrame (): void
    {
        movieClipPrevFrameUseCase(this);
    }

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
        movieClipAddFrameLabelService(this, frame_label);
    }

    /**
     * @description character 情報を元に DisplayObject を構築
     *              Build DisplayObject based on character
     *
     * @param  {ICharacter} character
     * @param  {LoaderInfo} [loader_info=null]
     * @return {void}
     * @method
     * @protected
     */
    $sync (character: ICharacter, loader_info: LoaderInfo | null = null): void
    {
        if (loader_info) {
            super.$syncLoaderInfo(loader_info);
        }
        movieClipBuildFromCharacterUseCase(this, character as IMovieClipCharacter);
    }
}