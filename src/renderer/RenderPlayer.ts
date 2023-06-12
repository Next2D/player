import { CacheStore } from "../player/util/CacheStore";
import { RenderDisplayObjectContainer } from "./RenderDisplayObjectContainer";
import { Rectangle } from "../player/next2d/geom/Rectangle";
import type { CanvasToWebGLContext } from "../webgl/CanvasToWebGLContext";
import type { AttachmentImpl } from "../interface/AttachmentImpl";
import type { RenderDisplayObjectImpl } from "../interface/RenderDisplayObjectImpl";
import type { FrameBufferManager } from "../webgl/FrameBufferManager";
import type { PropertyContainerMessageImpl } from "../interface/PropertyContainerMessageImpl";
import {
    $cancelAnimationFrame,
    $COLOR_ARRAY_IDENTITY,
    $Float32Array,
    $getFloat32Array6,
    $performance,
    $requestAnimationFrame
} from "../player/util/RenderUtil";
import {
    $getDisplayObjectContainer,
    $getShape,
    $getTextField,
    $getVideo
} from "./RenderGlobal";

/**
 * @class
 */
export class RenderPlayer
{
    public readonly _$instances: Map<number, RenderDisplayObjectImpl<any>>;
    public readonly _$cacheStore: CacheStore;
    public readonly _$matrix: Float32Array;
    private readonly _$colorTransform: Float32Array;
    public _$canvas: OffscreenCanvas | null;
    public _$context: CanvasToWebGLContext | null;
    private _$stopFlag: boolean;
    private _$timerId: number;
    private _$startTime: number;
    private _$frameRate: number;
    private _$fps: number;
    private _$width: number;
    private _$height: number;
    private readonly _$stage: RenderDisplayObjectContainer;
    private _$videos: number;
    private _$samples: number;
    private _$attachment: AttachmentImpl | null;

    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        /**
         * @type {Map}
         * @private
         */
        this._$instances = new Map();

        /**
         * @type {CacheStore}
         * @private
         */
        this._$cacheStore = new CacheStore();

        /**
         * @type {Float32Array}
         * @default null
         * @private
         */
        this._$matrix = $getFloat32Array6(1, 0, 0, 1, 0, 0);

        /**
         * @type {Float32Array}
         * @default null
         * @private
         */
        this._$colorTransform = new $Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$stopFlag = true;

        /**
         * @type {number}
         * @default -1
         * @private
         */
        this._$timerId = -1;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$startTime = 0;

        /**
         * @type {number}
         * @default 60
         * @private
         */
        this._$frameRate = 60;

        /**
         * @type {number}
         * @private
         */
        this._$fps = 1000 / 60;

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
         * @type {RenderDisplayObjectContainer}
         * @default null
         * @private
         */
        this._$stage = new RenderDisplayObjectContainer();

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$videos = 0;

        /**
         * @type {number}
         * @default 4
         * @private
         */
        this._$samples = 4;

        /**
         * @type {OffscreenCanvas}
         * @default null
         * @private
         */
        this._$canvas = null;

        /**
         * @type {CanvasToWebGLContext}
         * @default null
         * @private
         */
        this._$context = null;

        /**
         * @type {object}
         * @default null
         * @private
         */
        this._$attachment = null;
    }

    /**
     * @description 描画を開始
     *
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
                this._$timerId = -1;
            }

            this._$startTime = $performance.now();

            this._$fps = 1000 / this._$frameRate;

            this._$timerId = $requestAnimationFrame((timestamp: number) =>
            {
                this._$run(timestamp);
            });
        }
    }

    /**
     * @description 描画の停止
     *
     * @return {void}
     * @method
     * @public
     */
    stop (): void
    {
        $cancelAnimationFrame(this._$timerId);

        this._$stopFlag = true;
        this._$timerId  = -1;
        this._$cacheStore.reset();
    }

    /**
     * @description フレームレートに合わせて描画を実行
     *
     * @param  {number} timestamp
     * @return {void}
     * @method
     * @public
     */
    _$run (timestamp: number = 0): void
    {
        if (this._$stopFlag) {
            return ;
        }

        const delta: number = timestamp - this._$startTime;
        if (delta > this._$fps) {

            // update
            this._$startTime = timestamp - delta % this._$fps;

            // execute
            this._$draw();

        } else {

            if (this._$videos) {
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
     * @description 指定canvasに転写
     *
     * @param  {RenderDisplayObject} source
     * @param  {Float32Array} matrix
     * @param  {Float32Array} color_transform
     * @param  {OffscreenCanvas} canvas
     * @return {void}
     * @method
     * @private
     */
    _$bitmapDraw (
        source: RenderDisplayObjectImpl<any>,
        matrix: Float32Array,
        color_transform: Float32Array,
        canvas: OffscreenCanvas
    ): void {

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

        source._$draw(context, matrix, color_transform);

        const manager: FrameBufferManager = context.frameBuffer;
        const texture: WebGLTexture = manager.getTextureFromCurrentAttachment();

        manager.unbind();

        // reset and draw to main canvas
        context.reset();
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.clearRect(0, 0, this._$width, this._$height);
        context.drawImage(texture, 0, 0, this._$width, this._$height);

        // re bind
        context._$bind(this._$attachment);

        const ctx: OffscreenCanvasRenderingContext2D | null = canvas.getContext("2d");
        if (ctx && this._$canvas) {
            ctx.drawImage(this._$canvas, 0, 0);
        }
    }

    /**
     * @description 描画処理を実行
     *
     * @return {void}
     * @method
     * @private
     */
    _$draw (): void
    {
        if (!this._$width || !this._$height) {
            return ;
        }

        if (!this._$stage._$updated) {
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
        const texture: WebGLTexture = manager.getTextureFromCurrentAttachment();

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
     * @description 描画範囲のサイズを変更
     *
     * @param  {number} width
     * @param  {number} height
     * @param  {number} scale
     * @param  {number} [tx = 0]
     * @param  {number} [ty = 0]
     * @return {void}
     * @method
     * @private
     */
    _$resize (
        width: number, height: number, scale: number,
        tx: number = 0,
        ty: number = 0
    ): void {

        this._$width  = width;
        this._$height = height;

        if (!this._$canvas) {
            return ;
        }

        this._$canvas.width  = width;
        this._$canvas.height = height;

        const context = this._$context;
        if (!context) {
            return ;
        }

        context._$gl.viewport(0, 0, width, height);

        const manager: FrameBufferManager = context.frameBuffer;
        if (this._$attachment) {
            manager.unbind();
            manager.releaseAttachment(this._$attachment, true);
        }

        this._$attachment = manager
            .createCacheAttachment(width, height, false);

        this._$matrix[0] = scale;
        this._$matrix[3] = scale;
        this._$matrix[4] = tx;
        this._$matrix[5] = ty;

        // update cache max size
        manager.setMaxSize(width, height);

        this._$stage._$updated = true;
        this._$cacheStore.reset();
    }

    /**
     * @param  {number} instance_id
     * @return {void}
     * @method
     * @private
     */
    _$setStage (instance_id: number): void
    {
        this._$stage._$instanceId = instance_id;
        this._$instances.set(instance_id, this._$stage);
    }

    /**
     * @description Stageの更新情報をセット
     *
     * @return {void}
     * @method
     * @private
     */
    _$updateStage ()
    {
        this._$stage._$updated = true;
    }

    /**
     * @description DisplayObjectContainerクラスを生成
     *
     * @param  {object} object
     * @return {void}
     * @method
     * @private
     */
    _$createDisplayObjectContainer (object: PropertyContainerMessageImpl)
    {
        const sprite = $getDisplayObjectContainer();

        sprite._$instanceId = object.instanceId;

        if (object.recodes) {
            sprite._$recodes  = object.recodes;
            sprite._$maxAlpha = object.maxAlpha;
            sprite._$canDraw  = object.canDraw;
            sprite._$xMin     = object.xMin;
            sprite._$yMin     = object.yMin;
            sprite._$xMax     = object.xMax;
            sprite._$yMax     = object.yMax;
        }

        if (object.grid) {
            sprite._$scale9Grid = new Rectangle(
                object.grid.x, object.grid.y,
                object.grid.w, object.grid.h
            );
        }

        this._$instances.set(sprite._$instanceId, sprite);
    }

    /**
     * @description Shapeクラスを生成
     *
     * @param  {object} object
     * @return {void}
     * @method
     * @private
     */
    _$createShape (object)
    {
        const shape = $getShape();

        shape._$instanceId = object.instanceId;
        shape._$recodes    = object.recodes;
        shape._$maxAlpha   = object.maxAlpha;
        shape._$canDraw    = object.canDraw;

        shape._$xMin = object.xMin;
        shape._$yMin = object.yMin;
        shape._$xMax = object.xMax;
        shape._$yMax = object.yMax;

        if ("characterId" in object) {
            shape._$characterId = object.characterId;
        }
        if ("loaderInfoId" in object) {
            shape._$loaderInfoId = object.loaderInfoId;
        }

        if (object.grid) {
            shape._$scale9Grid = new Rectangle(
                object.grid.x, object.grid.y,
                object.grid.w, object.grid.h
            );
        }

        this._$instances.set(shape._$instanceId, shape);
    }

    /**
     * @description Videoクラスを生成
     *
     * @param  {object} object
     * @return {void}
     * @method
     * @private
     */
    _$createVideo (object)
    {
        const video = $getVideo();

        video._$instanceId = object.instanceId;

        if ("characterId" in object) {
            video._$characterId = object.characterId;
        }
        if ("loaderInfoId" in object) {
            video._$loaderInfoId = object.loaderInfoId;
        }

        video._$updateProperty(object);

        this._$instances.set(video._$instanceId, video);

        this._$videos++;
    }

    /**
     * @description TextFieldクラスを生成
     *
     * @param  {object} object
     * @return {void}
     * @method
     * @private
     */
    _$createTextField (object)
    {
        const textField = $getTextField();

        textField._$instanceId = object.instanceId;

        // bounds
        textField._$xMin = object.xMin;
        textField._$yMin = object.yMin;
        textField._$xMax = object.xMax;
        textField._$yMax = object.yMax;

        if ("characterId" in object) {
            textField._$characterId = object.characterId;
        }
        if ("loaderInfoId" in object) {
            textField._$loaderInfoId = object.loaderInfoId;
        }

        textField._$updateProperty(object);

        this._$instances.set(textField._$instanceId, textField);
    }
}