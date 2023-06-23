import { Sprite } from "./Sprite";
import { FrameLabel } from "./FrameLabel";
import { Sound } from "../media/Sound";
import { Event } from "../events/Event";
import type { PlaceObjectImpl } from "../../interface/PlaceObjectImpl";
import type { LoopConfigImpl } from "../../interface/LoopConfigImpl";
import type { Player } from "../../player/Player";
import type { DisplayObjectImpl } from "../../interface/DisplayObjectImpl";
import type { ParentImpl } from "../../interface/ParentImpl";
import type { MovieClipCharacterImpl } from "../../interface/MovieClipCharacterImpl";
import type { MovieClipSoundObjectImpl } from "../../interface/MovieClipSoundObjectImpl";
import type { MovieClipActionObjectImpl } from "../../interface/MovieClipActionObjectImpl";
import type { MovieClipLabelObjectImpl } from "../../interface/MovieClipLabelObjectImpl";
import type { DictionaryTagImpl } from "../../interface/DictionaryTagImpl";
import type { SoundTransform } from "../media/SoundTransform";
import type { Character } from "../../interface/Character";
import { $setCurrentLoaderInfo } from "../../util/Global";
import {
    $currentPlayer,
    $rendererWorker
} from "../../util/Util";
import {
    $Array,
    $getArray,
    $getMap,
    $isNaN, $Math
} from "../../util/RenderUtil";

/**
 * MovieClip クラスは、Sprite、DisplayObjectContainer、InteractiveObject、DisplayObject
 * および EventDispatcher クラスを継承します。
 * MovieClip オブジェクトには、Sprite オブジェクトとは違ってタイムラインがあります。
 * タイムラインの再生ヘッドが停止されても、その MovieClip オブジェクトの子 MovieClip オブジェクトの再生ヘッドは停止しません。
 *
 * The MovieClip class inherits from the following classes: Sprite, DisplayObjectContainer,
 * InteractiveObject, DisplayObject, and EventDispatcher.
 * Unlike the Sprite object, a MovieClip object has a timeline.
 * When the playback head of the timeline is stopped,
 * the playback head of the child MovieClip object of that MovieClip object will not be stopped.
 *
 * @class
 * @memberOf next2d.display
 * @extends  Sprite
 */
export class MovieClip extends Sprite
{
    private _$labels: Map<number, FrameLabel> | null;
    public _$currentFrame: number;
    public _$stopFlag: boolean;
    public _$canAction: boolean;
    private _$childRemove: boolean;
    public _$canSound: boolean;
    public _$actionProcess: boolean;
    public _$actions: Map<number, Function[]>;
    public _$frameCache: Map<string, any>;
    public _$sounds: Map<number, Sound[]>;
    public _$actionOffset: number;
    public _$actionLimit: number;
    public _$totalFrames: number;
    public _$isPlaying: boolean;
    public _$loopConfig: LoopConfigImpl | null;
    private _$tweenFrame: number;

    /**
     * @constructor
     * @public
     */
    constructor()
    {
        super();

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$stopFlag = false;

        /**
         * @type {boolean}
         * @default true
         * @private
         */
        this._$canAction = true;

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$childRemove = false;

        /**
         * @type {boolean}
         * @default true
         * @private
         */
        this._$canSound = true;

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$actionProcess = false;

        /**
         * @type {Map}
         * @private
         */
        this._$actions = $getMap();

        /**
         * @type {Map}
         * @private
         */
        this._$frameCache = $getMap();

        /**
         * @type {Map}
         * @default null
         * @private
         */
        this._$labels = null;

        /**
         * @type {Map}
         * @private
         */
        this._$sounds = $getMap();

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$actionOffset = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$actionLimit = 0;

        /**
         * @type {number}
         * @default 1
         * @private
         */
        this._$currentFrame = 1;

        /**
         * @type {number}
         * @default 1
         * @private
         */
        this._$totalFrames = 1;

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$isPlaying = false;

        /**
         * @type {LoopConfig}
         * @default null
         * @private
         */
        this._$loopConfig = null;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$tweenFrame = 0;
    }

    /**
     * @description 指定されたクラスのストリングを返します。
     *              Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default [class MovieClip]
     * @method
     * @static
     */
    static toString (): string
    {
        return "[class MovieClip]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return  {string}
     * @default next2d.display.MovieClip
     * @const
     * @static
     */
    static get namespace (): string
    {
        return "next2d.display.MovieClip";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return  {string}
     * @default [object MovieClip]
     * @method
     * @public
     */
    toString (): string
    {
        return "[object MovieClip]";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @return  {string}
     * @default next2d.display.MovieClip
     * @const
     * @public
     */
    get namespace (): string
    {
        return "next2d.display.MovieClip";
    }

    /**
     * @description MovieClip インスタンスのタイムライン内の再生ヘッドが置かれているフレームの番号を示します。
     *              Specifies the number of the frame in which the playhead is located
     *              in the timeline of the MovieClip instance.
     *
     * @member {number}
     * @default 1
     * @readonly
     * @public
     */
    get currentFrame (): number
    {
        return this._$currentFrame;
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
        if (!this._$labels) {
            return null;
        }

        const frame = this._$currentFrame;
        if (!this._$labels.has(frame)) {
            return null;
        }

        return this._$labels.get(frame) || null;
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
        return !this._$labels || !this._$labels.size
            ? null
            : $Array.from(this._$labels.values());
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
        return this._$isPlaying;
    }

    /**
     * @description MovieClip インスタンス内のフレーム総数です。
     *              The total number of frames in the MovieClip instance.
     *
     * @member  {number}
     * @default 1
     * @readonly
     * @public
     */
    get totalFrames (): number
    {
        return this._$totalFrames;
    }

    /**
     * @description MovieClipのフレームヘッダーの移動方法の設定オブジェクトを返します。
     *              Returns a configuration object for how MovieClip's frame headers are moved.
     *
     * @member  {object}
     * @default null
     * @public
     */
    get loopConfig (): LoopConfigImpl | null
    {
        if (this._$loopConfig) {
            return this._$loopConfig;
        }

        const place: PlaceObjectImpl | null = this._$getPlaceObject();
        if (!place || !place.loop) {
            return null;
        }

        if (this._$tweenFrame) {
            this._$changePlace = this._$tweenFrame !== this._$parent._$currentFrame;
            this._$tweenFrame  = 0;
        }

        if (place.loop.tweenFrame) {
            this._$tweenFrame = place.loop.tweenFrame;
        }

        return place.loop;
    }
    set loopConfig (loop_config: LoopConfigImpl | null)
    {
        this._$loopConfig = loop_config;
        if (loop_config) {
            loop_config.frame   = this._$startFrame;
            this._$loopConfig   = loop_config;
            this._$currentFrame = this._$getLoopFrame(loop_config);
        }
    }

    /**
     * @description 指定されたフレームで SWF ファイルの再生を開始します。
     *              Starts playing the SWF file at the specified frame.
     *
     * @param  {number|string} frame
     * @return {void}
     * @method
     * @public
     */
    gotoAndPlay (frame: string | number): void
    {
        this.play();
        this._$goToFrame(frame);
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
        this.stop();
        this._$goToFrame(frame);
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
        this.stop();
        if (this._$totalFrames > this._$currentFrame) {
            this._$goToFrame(this._$currentFrame + 1);
        }
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
        this._$stopFlag  = false;
        this._$isPlaying = true;
        this._$updateState();
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
        const frame: number = this._$currentFrame - 1;
        if (frame) {
            this.stop();
            this._$goToFrame(frame);
        }
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
        this._$stopFlag  = true;
        this._$isPlaying = false;
    }

    /**
     * @description タイムラインに対して動的にLabelを追加できます。
     *              Labels can be added dynamically to the timeline.
     *
     * @example <caption>Example1 usage of addFrameLabel.</caption>
     * // case 1
     * const {MovieClip, FrameLabel} = next2d.display;
     * const movieClip = new MovieClip();
     * movieClip.addFrameLabel(new FrameLabel(1, "start"));
     *
     * @param  {FrameLabel} frame_label
     * @return {void}
     * @public
     */
    addFrameLabel (frame_label: FrameLabel): void
    {
        if (!this._$labels) {
            this._$labels = $getMap();
        }

        this._$labels.set(frame_label.frame, frame_label);
    }

    /**
     * @description 指定のフレームのアクションを追加できます
     *              You can add an action for a given frame.
     *
     * @example <caption>Example1 usage of addFrameScript.</caption>
     * // case 1
     * const {MovieClip} = next2d.display;
     * const movieClip = new MovieClip();
     * movieClip.addFrameScript(1 , function ()
     * {
     *     this.stop();
     * });
     *
     * @example <caption>Example3 usage of addFrameScript.</caption>
     * // case 2
     * const {MovieClip} = next2d.display;
     * const movieClip = new MovieClip();
     * movieClip.addFrameScript(1, method_1, 2, method_2, 10, method_10);
     *
     * @return {void}
     * @method
     * @public
     */
    addFrameScript (...args: any[]): void
    {
        for (let idx = 0; idx < args.length; idx += 2) {

            const value: string | number = args[idx];

            let frame: number = +value;
            if ($isNaN(frame)) {
                frame = this._$getFrameForLabel(`${value}`);
            }

            const script: Function = args[idx + 1];
            if (script && frame && this._$totalFrames >= frame) {
                this._$addAction(frame, script);
            }

            // end action add
            if (frame === this._$currentFrame) {

                // set action position
                const player: Player = $currentPlayer();
                player._$actionOffset = player._$actions.length;

                // execute action stack
                this._$canAction = true;
                this._$setAction();

                // adjustment
                if (player._$actionOffset !== player._$actions.length) {

                    // marge
                    const actions: MovieClip[] = player._$actions.splice(0, player._$actionOffset);
                    player._$actions.push(
                        ...player._$actions,
                        ...actions
                    );

                    // reset
                    player._$actionOffset = 0;
                }

            }
        }
    }

    /**
     * @param  {string} name
     * @return {number}
     * @private
     */
    _$getFrameForLabel (name: string): number
    {
        if (!this._$labels) {
            return 0;
        }

        for (const [frame, frameLabel] of this._$labels) {
            if (frameLabel.name === name) {
                return frame;
            }
        }

        return 0;
    }

    /**
     * @param  {number}   frame
     * @param  {function} script
     * @return {void}
     * @method
     * @private
     */
    _$addAction (frame: number, script: Function): void
    {
        if (frame) {
            if (!this._$actions.has(frame)) {
                this._$actions.set(frame, $getArray());
            }

            const actions: Function[] | void = this._$actions.get(frame);
            if (actions) {
                actions.push(script);
            }

        }
    }

    /**
     * @return {void}
     * @private
     */
    _$setAction (): void
    {
        // added event
        this._$executeAddedEvent();

        if (this._$canAction) {

            const frame: number = this._$currentFrame;

            // frame label event
            if (this._$labels && this._$labels.has(frame)) {

                const frameLabel: FrameLabel | void = this._$labels.get(frame);

                if (frameLabel && frameLabel.willTrigger(Event.FRAME_LABEL)) {
                    frameLabel.dispatchEvent(new Event(Event.FRAME_LABEL));
                }
            }

            // add action queue
            if (this._$actions.size && this._$actions.has(frame)) {

                const player: Player = $currentPlayer();
                const index = player._$actions.indexOf(this);
                if (index === -1) {
                    player._$actions.push(this);
                }

            }
        }
    }

    /**
     * @param  {number|string} value
     * @return {void}
     * @private
     */
    _$goToFrame (value: string | number): void
    {
        let frame: number = +value;
        if ($isNaN(frame)) {
            frame = this._$getFrameForLabel(`${value}`);
        }

        if (frame < 1) {
            frame = 1;
        }

        // over
        if (frame > this._$totalFrames) {
            this._$currentFrame = this._$totalFrames;
            this._$clearChildren();

            // flag off
            this._$canAction = false;
            this._$wait      = false;

            return ;
        }

        const player: Player = $currentPlayer();
        switch (true) {

            case frame !== this._$currentFrame:
                {
                    // flag off
                    this._$wait = false;

                    const currentFrame: number = this._$currentFrame;

                    if (this._$actionProcess) {
                        this._$frameCache.set("nextFrame", frame);
                        this._$frameCache.set("stopFlag",  this._$stopFlag);
                        this._$frameCache.set("isPlaying", this._$isPlaying);
                    }

                    // setup
                    this._$currentFrame = frame;
                    this._$clearChildren();

                    // set action position
                    player._$actionOffset = player._$actions.length;
                    const position: number = player._$actionOffset
                        ? player._$actions.indexOf(this)
                        : -1;

                    this._$canAction = true;
                    this._$prepareActions();

                    // adjustment
                    if (player._$actionOffset
                        && player._$actionOffset !== player._$actions.length
                    ) {

                        // marge
                        const actions: MovieClip[] = player._$actions.splice(0, player._$actionOffset);
                        player._$actions.push(
                            ...player._$actions,
                            ...actions
                        );

                        // reset
                        player._$actionOffset = 0;
                    }

                    if (!this._$actionProcess && (position > -1 || !player._$actionOffset)) {

                        while (player._$actions.length) {

                            if (player._$actions.length === position) {
                                break;
                            }

                            // target object
                            const mc: MovieClip | void = player._$actions.pop();
                            if (!mc) {
                                continue;
                            }

                            mc._$canAction    = false;
                            mc._$actionOffset = 0;
                            mc._$actionLimit  = 0;

                            if (mc._$actionProcess && mc._$frameCache.size) {

                                mc._$currentFrame = mc._$frameCache.get("nextFrame");
                                mc._$clearChildren();

                                mc._$stopFlag  = mc._$frameCache.get("stopFlag");
                                mc._$isPlaying = mc._$frameCache.get("isPlaying");
                                mc._$frameCache.clear();
                            }

                            const frame: number = mc._$currentFrame;
                            if (!mc._$actions.has(frame)) {
                                continue;
                            }

                            const actions: Function[] | void = mc._$actions.get(frame);
                            if (!actions) {
                                continue;
                            }

                            for (let idx: number = 0; idx < actions.length; ++idx) {

                                try {

                                    $setCurrentLoaderInfo(mc._$loaderInfo);
                                    actions[idx].apply(mc);

                                } catch (e) {

                                    mc.stop();

                                }
                            }
                        }
                    }

                    if (this._$actionProcess) {
                        this._$currentFrame = currentFrame;
                        this._$clearChildren();
                    }
                }
                break;

            case !this._$actionProcess && player._$actions.indexOf(this) > -1:
                {
                    if (!this._$actionLimit) {
                        break;
                    }

                    // flag off
                    this._$wait = false;

                    const myActions: MovieClip[] = player._$actions.splice(
                        this._$actionOffset, this._$actionLimit
                    );

                    while (myActions.length) {

                        const mc: MovieClip | void = myActions.pop();
                        if (!mc) {
                            continue;
                        }

                        // target reset
                        mc._$canAction    = false;
                        mc._$actionOffset = 0;
                        mc._$actionLimit  = 0;

                        const frame = mc._$currentFrame;
                        if (!mc._$actions.has(frame)) {
                            continue;
                        }

                        const actions: Function[] | void = mc._$actions.get(frame);
                        if (!actions) {
                            continue;
                        }

                        for (let idx: number = 0; idx < actions.length; ++idx) {

                            try {

                                $setCurrentLoaderInfo(mc._$loaderInfo);
                                // @ts-ignore
                                actions[idx].apply(mc);

                            } catch (e) {

                                mc.stop();

                            }

                        }

                    }
                }
                break;

            default:
                break;

        }

        $setCurrentLoaderInfo(null);

        // set sound
        if (this._$canSound && this._$sounds.size
            && this._$sounds.has(this._$currentFrame)
            && !player._$sounds.has(this._$instanceId)
        ) {
            player._$sounds.set(this._$instanceId, this);
        }
    }

    /**
     * @return {void}
     * @method
     * @private
     */
    _$prepareActions (): void
    {
        // draw flag
        this._$wait = false;

        const children: DisplayObjectImpl<any>[] = this._$needsChildren
            ? this._$getChildren()
            : this._$children;

        for (let idx: number = children.length - 1; idx > -1; --idx) {
            children[idx]._$prepareActions();
        }

        this._$setAction();
    }

    /**
     * @return {boolean}
     * @method
     * @private
     */
    _$nextFrame (): boolean
    {
        let isNext: boolean = this._$needsChildren;
        switch (true) {

            case this._$wait:
                isNext = true;
                this._$wait = false;
                break;

            case this._$stopFlag:
            case this._$totalFrames === 1:
                break;

            default:
                {
                    isNext = true;

                    // action on
                    this._$canAction = true;

                    // sound on
                    this._$canSound = true;

                    const loopConfig: LoopConfigImpl | null = this.loopConfig;
                    if (!loopConfig) {

                        // next frame point
                        ++this._$currentFrame;
                        if (this._$currentFrame > this._$totalFrames) {
                            this._$currentFrame = 1;
                        }

                    } else {

                        const totalFrames: number = loopConfig.end
                            ? loopConfig.end
                            : this._$totalFrames;

                        switch (loopConfig.type) {

                            case 0: // REPEAT
                                if (this._$changePlace) {

                                    this._$currentFrame = loopConfig.start;

                                } else {

                                    ++this._$currentFrame;
                                    if (this._$currentFrame > totalFrames) {
                                        this._$currentFrame = loopConfig.start;
                                    }

                                }
                                break;

                            case 1: // NO_REPEAT
                                if (this._$changePlace) {

                                    this._$currentFrame = loopConfig.start;

                                } else {

                                    ++this._$currentFrame;
                                    if (this._$currentFrame > totalFrames) {

                                        this._$currentFrame = totalFrames;
                                        isNext = false;

                                        // action on
                                        this._$canAction = false;

                                        // sound on
                                        this._$canSound = false;
                                    }

                                }
                                break;

                            case 2: // FIXED
                                if (this._$changePlace) {

                                    this._$currentFrame = loopConfig.start;

                                } else {

                                    isNext = false;

                                    // action on
                                    this._$canAction = false;

                                    // sound on
                                    this._$canSound = false;

                                }
                                break;

                            case 3: // NO_REPEAT_REVERSAL
                                if (this._$changePlace) {

                                    this._$currentFrame = totalFrames;

                                } else {

                                    --this._$currentFrame;
                                    if (loopConfig.start > this._$currentFrame) {
                                        this._$currentFrame = loopConfig.start;

                                        isNext = false;

                                        // action on
                                        this._$canAction = false;

                                        // sound on
                                        this._$canSound = false;
                                    }

                                }
                                break;

                            case 4: // REPEAT_REVERSAL
                                if (this._$changePlace) {

                                    this._$currentFrame = totalFrames;

                                } else {

                                    --this._$currentFrame;
                                    if (loopConfig.start > this._$currentFrame) {
                                        this._$currentFrame = totalFrames;
                                    }

                                }
                                break;

                        }
                    }

                    // clear
                    if (isNext) {
                        this._$clearChildren();
                    }

                    // set sound
                    if (this._$canSound && this._$sounds.size
                        && this._$sounds.has(this._$currentFrame)
                    ) {
                        const player: Player = $currentPlayer();
                        if (!player._$sounds.has(this._$instanceId)) {
                            player._$sounds.set(this._$instanceId, this);
                        }
                    }

                }
                break;

        }

        const children: DisplayObjectImpl<any>[] = this._$needsChildren
            ? this._$getChildren()
            : this._$children;

        for (let idx: number = children.length - 1; idx > -1; --idx) {

            const child: DisplayObjectImpl<any> = children[idx];

            if (!child._$isNext) {
                continue;
            }

            if (isNext) {

                child._$nextFrame();

            } else {

                isNext = child._$nextFrame();

            }

        }

        // frame action
        this._$setAction();

        this._$isNext = isNext;

        if (!this._$posted && $rendererWorker) {
            this._$postProperty();
        }

        return this._$isNext;
    }

    /**
     * @param  {LoopConfig} loop_config
     * @return {number}
     * @method
     * @private
     */
    _$getLoopFrame (loop_config: LoopConfigImpl): number
    {
        const parent: ParentImpl<any> = this._$parent;
        const length: number = parent._$currentFrame - loop_config.frame;

        let frame: number = 1;
        switch (loop_config.type) {

            case 0: // REPEAT
                {
                    const totalFrame = loop_config.end
                        ? loop_config.end
                        : this._$totalFrames;

                    frame = loop_config.start;
                    for (let idx = 0; idx < length; ++idx) {

                        ++frame;

                        if (frame > totalFrame) {
                            frame = loop_config.start;
                        }

                    }
                }
                break;

            case 1: // NO_REPEAT
                {
                    const totalFrame = loop_config.end
                        ? loop_config.end
                        : this._$totalFrames;

                    frame = $Math.min(totalFrame, loop_config.start + length);
                }
                break;

            case 2: // FIXED
                frame = loop_config.start;
                break;

            case 3: // NO_REPEAT_REVERSAL

                frame = loop_config.end
                    ? loop_config.end
                    : this._$totalFrames;

                frame = $Math.max(loop_config.start, frame - length);
                break;

            case 4: // REPEAT_REVERSAL
                {
                    const totalFrame: number = loop_config.end
                        ? loop_config.end
                        : this._$totalFrames;

                    frame = totalFrame;
                    for (let idx: number = 0; idx < length; ++idx) {

                        --frame;

                        if (loop_config.start > frame) {
                            frame = totalFrame;
                        }

                    }
                }
                break;

        }

        return frame;
    }

    /**
     * @param  {object} character
     * @return {void}
     * @method
     * @private
     */
    _$buildCharacter (character: MovieClipCharacterImpl)
    {
        if (character.sounds) {
            for (let idx: number = 0; idx < character.sounds.length; ++idx) {

                const object: MovieClipSoundObjectImpl = character.sounds[idx];

                const sounds: Sound[] = $getArray();
                for (let idx: number = 0; idx < object.sound.length; ++idx) {

                    const sound: Sound = new Sound();
                    sound._$build(object.sound[idx], this);

                    sounds.push(sound);
                }

                this._$sounds.set(object.frame, sounds);
            }
        }

        if (character.actions) {
            for (let idx: number = 0; idx < character.actions.length; ++idx) {

                const object: MovieClipActionObjectImpl = character.actions[idx];
                if (!object.script) {
                    object.script = Function(object.action);
                }

                this._$addAction(object.frame, object.script);
            }
        }

        if (character.labels) {
            for (let idx: number = 0; idx < character.labels.length; ++idx) {

                const label: MovieClipLabelObjectImpl = character.labels[idx];

                this.addFrameLabel(new FrameLabel(label.name, label.frame));

            }
        }

        this._$totalFrames = character.totalFrame || 1;
    }

    /**
     * @param  {object} character
     * @return {void}
     * @method
     * @private
     */
    _$sync (character: Character<MovieClipCharacterImpl>): void
    {
        super._$sync(character);
        this._$buildCharacter(character);
    }

    /**
     * @param  {object} tag
     * @param  {DisplayObjectContainer} parent
     * @return {object}
     * @method
     * @private
     */
    _$build (
        tag: DictionaryTagImpl,
        parent: ParentImpl<any>
    ): MovieClipCharacterImpl {

        const character: MovieClipCharacterImpl = super._$build(tag, parent);

        this._$buildCharacter(character);

        return character;
    }

    /**
     * @return {void}
     * @method
     * @private
     */
    _$soundPlay (): void
    {
        if (!this._$sounds.has(this._$currentFrame)) {
            return ;
        }

        const sounds: Sound[] = this._$sounds.get(this._$currentFrame) as NonNullable<Sound[]>;
        if (sounds.length) {

            // set SoundTransform
            let soundTransform: SoundTransform | null = this._$soundTransform;

            let parent = this._$parent;
            while (parent) {

                if (parent._$soundTransform) {
                    soundTransform = parent._$soundTransform;
                }

                parent = parent._$parent;
            }

            // play sound
            for (let idx: number = 0; idx < sounds.length; ++idx) {

                const sound = sounds[idx];

                if (soundTransform) {
                    sound.loopCount = soundTransform.loop ? 0xffffff : 0;
                    sound.volume = soundTransform.volume;
                }
                sound.play();
            }
        }

        this._$canSound = false;
    }
}
