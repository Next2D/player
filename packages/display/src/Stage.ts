import type { DisplayObject } from "./DisplayObject";
import type { IPlayerHitObject } from "./interface/IPlayerHitObject";
import type { Point } from "@next2d/geom";
import { renderQueue } from "@next2d/render-queue";
import { DisplayObjectContainer } from "./DisplayObjectContainer";
import { execute as stageReadyUseCase } from "./Stage/usecase/StageReadyUseCase";
import { execute as displayObjectContainerGenerateRenderQueueUseCase } from "./DisplayObjectContainer/usecase/DisplayObjectContainerGenerateRenderQueueUseCase";
import { execute as stageTickerUseCase } from "./Stage/usecase/StageTickerUseCase";
import { execute as displayObjectContainerMouseHitUseCase } from "./DisplayObjectContainer/usecase/DisplayObjectContainerMouseHitUseCase";
import {
    $pointer,
    $rootMap,
    $stageAssignedMap
} from "./DisplayObjectUtil";

/**
 * @type {Float32Array}
 * @private
 */
export const $COLOR_ARRAY_IDENTITY: Float32Array = new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);

/**
 * @description Stage クラスはメイン描画領域を表します。
 *              The Stage class represents the main drawing area.
 *
 * @class
 * @memberOf next2d.display
 * @extends  DisplayObjectContainer
 */
export class Stage extends DisplayObjectContainer
{
    /**
     * @description 初期起動の準備完了したかどうか
     *              Whether the initial startup is ready
     *
     * @type {boolean}
     * @default false
     * @private
     */
    private _$ready: boolean;

    /**
     * @description ステージ幅
     *              Stage width
     *
     * @type {number}
     * @public
     */
    public stageWidth: number;

    /**
     * @description ステージ高さ
     *              Stage height
     *
     * @type {number}
     * @public
     */
    public stageHeight: number;

    /**
     * @description フレームレート
     *              Frame rate
     *
     * @type {number}
     * @public
     */
    public frameRate: number;

    /**
     * @description devicePixelRatioを含んだcanvasの描画領域の拡大率
     *              The magnification of the drawing area of the canvas including devicePixelRatio
     *
     * @member {number}
     * @default 1
     * @public
     */
    public rendererScale: number;

    /**
     * @description devicePixelRatioを含んだcanvasの描画領域の幅
     *              The width of the drawing area of the canvas including devicePixelRatio
     *
     * @member {number}
     * @default 0
     * @public
     */
    public rendererWidth: number;

    /**
     * @description devicePixelRatioを含んだcanvasの描画領域の高さ
     *              The height of the drawing area of the canvas including devicePixelRatio
     *
     * @member {number}
     * @default 0
     * @public
     */
    public rendererHeight: number;

    /**
     * @description 背景色
     *              Background color
     *
     * @type {number}
     * @public
     */
    private _$backgroundColor: number;

    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super();

        this.stageWidth  = 0;
        this.stageHeight = 0;
        this.frameRate   = 1;

        this.rendererScale  = 1;
        this.rendererWidth  = 0;
        this.rendererHeight = 0;

        // private
        this._$ready           = false;
        this._$backgroundColor = -1;
    }

    /**
     * @description 背景色
     *              Background color
     *
     * @member {number}
     * @public
     */
    get backgroundColor (): number
    {
        return this._$backgroundColor;
    }
    set backgroundColor (color: string)
    {
        this._$backgroundColor = color === "transparent"
            ? -1
            : parseInt(color.replace("#", ""), 16);
    }

    /**
     * @description ポインターの最終座標
     *              The final coordinates of the pointer
     *
     * @type {Point}
     * @readonly
     * @public
     */
    get pointer (): Point
    {
        return $pointer;
    }

    /**
     * @description 初期起動の準備完了したかどうか
     *              Whether the initial startup is ready
     *
     * @type {boolean}
     * @writeonly
     * @public
     */
    set ready (ready: boolean)
    {
        if (!ready || this._$ready) {
            return ;
        }

        this._$ready = ready;

        // Stage の起動準備完了のUseCase
        stageReadyUseCase(this);
    }

    /**
     * @description Stage に追加した DisplayObject は rootとして rootMap に追加
     *              DisplayObject added to Stage is added to rootMap as root
     *
     * @param  {DisplayObject} display_object
     * @return {DisplayObject}
     * @method
     * @public
     */
    addChild<T extends DisplayObject>(display_object: T): T
    {
        $rootMap.set(display_object, display_object);
        $stageAssignedMap.add(display_object);

        return super.addChild(display_object);
    }

    /**
     * @description Stage に追加した DisplayObject の定期処理、描画処理を実行
     *              Execute regular processing and drawing processing of DisplayObject added to Stage
     *
     * @return {void}
     * @method
     * @protected
     */
    $ticker (): void
    {
        stageTickerUseCase();
    }

    /**
     * @description renderer workerに渡す描画データを生成
     *              Generate drawing data to pass to the renderer worker
     *
     * @param  {Array<Promise<ImageBitmap>>} image_bitmaps
     * @param  {Float32Array} matrix
     * @return {void}
     * @method
     * @protected
     */
    $generateRenderQueue (
        image_bitmaps: Array<Promise<ImageBitmap>>,
        matrix: Float32Array
    ): void {

        // set background color
        renderQueue.push(this._$backgroundColor);

        displayObjectContainerGenerateRenderQueueUseCase(
            this, image_bitmaps,
            matrix, $COLOR_ARRAY_IDENTITY,
            this.rendererWidth, this.rendererHeight,
            matrix[4], matrix[5]
        );

        this.changed = false;
    }

    /**
     * @description タップポイントの当たり判定
     *              Hit test of tap point
     *
     * @param  {CanvasRenderingContext2D} hit_context
     * @param  {Float32Array} matrix
     * @param  {IPlayerHitObject} hit_object
     * @return {void}
     * @method
     * @protected
     */
    $mouseHit (
        hit_context: CanvasRenderingContext2D,
        matrix: Float32Array,
        hit_object: IPlayerHitObject
    ): void {
        displayObjectContainerMouseHitUseCase(
            this, hit_context, matrix, hit_object, true
        );
    }
}

/**
 * @type {Stage}
 * @public
 */
export const stage: Stage = new Stage();
$stageAssignedMap.add(stage);