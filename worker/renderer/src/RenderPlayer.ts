import { RenderDisplayObjectContainer } from "./RenderDisplayObjectContainer";
import { CanvasToWebGLContext } from "@next2d/webgl";
import type { RenderShape } from "./RenderShape";
import type { RenderVideo } from "./RenderVideo";
import type { RenderTextField } from "./RenderTextField";
import type { RenderDisplayObjectImpl } from "./interface/RenderDisplayObjectImpl";
import type { AttachmentImpl } from "./interface/AttachmentImpl";
import type { PropertyContainerMessageImpl } from "./interface/PropertyContainerMessageImpl";
import type { PropertyShapeMessageImpl } from "./interface/PropertyShapeMessageImpl";
import type { PropertyTextMessageImpl } from "./interface/PropertyTextMessageImpl";
import type { PropertyVideoMessageImpl } from "./interface/PropertyVideoMessageImpl";
import type { RGBAImpl } from "./interface/RGBAImpl";
import type { FrameBufferManager } from "@next2d/webgl";
import {
    CacheStore,
    $COLOR_ARRAY_IDENTITY,
    $Float32Array,
    $getFloat32Array6,
    $toColorInt,
    $uintToRGBA
} from "@next2d/share";
import {
    $getDisplayObjectContainer,
    $getShape,
    $getTextField,
    $getVideo,
    $setDevicePixelRatio
} from "./RenderGlobal";

/**
 * @class
 */
export class RenderPlayer
{
    private readonly _$instances: Map<number, RenderDisplayObjectImpl<any>>;
    private readonly _$cacheStore: CacheStore;
    private readonly _$matrix: Float32Array;
    private readonly _$colorTransform: Float32Array;
    private _$context: CanvasToWebGLContext | null;
    private _$canvas: OffscreenCanvas | null;
    private _$samples: number;
    private _$width: number;
    private _$height: number;
    private readonly _$stage: RenderDisplayObjectContainer;
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
     * @return {Map}
     * @readonly
     * @public
     */
    get instances (): Map<number, RenderDisplayObjectImpl<any>>
    {
        return this._$instances;
    }

    /**
     * @return {CacheStore}
     * @readonly
     * @public
     */
    get cacheStore (): CacheStore
    {
        return this._$cacheStore;
    }

    /**
     * @return {CanvasToWebGLContext}
     * @readonly
     * @public
     */
    get context (): CanvasToWebGLContext | null
    {
        return this._$context;
    }

    /**
     * @return {number}
     * @readonly
     * @public
     */
    get scaleX (): number
    {
        return this._$matrix[0];
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
        this._$cacheStore.reset();
    }

    /**
     * @description WebGLを起動
     *
     * @param  {OffscreenCanvas} canvas
     * @param  {number} [samples=4]
     * @param  {number} [device_pixel_ratio=2]
     * @return {void}
     * @method
     * @public
     */
    _$initialize (
        canvas: OffscreenCanvas,
        samples: number = 4,
        device_pixel_ratio: number = 2
    ): void {

        // update
        $setDevicePixelRatio(device_pixel_ratio);

        this._$samples = samples;
        this._$canvas  = canvas;

        const gl: WebGL2RenderingContext | null = canvas.getContext("webgl2", {
            "stencil": true,
            "premultipliedAlpha": true,
            "antialias": false,
            "depth": false,
            "preserveDrawingBuffer": true
        });

        if (gl) {
            const context: CanvasToWebGLContext = new CanvasToWebGLContext(gl, samples);
            this._$context = context;
            this._$cacheStore.context = context;
        }
    }

    /**
     * @description 背景色をセット
     *
     * @param  {string} [background_color="transparent"]
     * @return {void}
     * @method
     * @public
     */
    _$setBackgroundColor (background_color = "transparent"): void
    {
        if (!this._$context) {
            return ;
        }

        if (background_color === "transparent") {

            this._$context._$setColor(0, 0, 0, 0);

        } else {

            const color: RGBAImpl = $uintToRGBA(
                $toColorInt(background_color)
            );

            this._$context._$setColor(
                color.R / 255,
                color.G / 255,
                color.B / 255,
                1
            );

        }
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

        // if (!this._$stage._$updated) {
        //     return ;
        // }

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
        width: number, height: number,
        scale: number, tx: number = 0, ty: number = 0
    ): void {

        this._$width  = width;
        this._$height = height;

        if (!this._$canvas) {
            return ;
        }

        if (this._$canvas.width === width && this._$canvas.height === height) {
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
    _$updateStage (): void
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
    _$createDisplayObjectContainer (object: PropertyContainerMessageImpl): void
    {
        const sprite: RenderDisplayObjectContainer = $getDisplayObjectContainer();

        sprite._$instanceId = object.instanceId;

        if (object.recodes) {
            sprite._$recodes  = object.recodes;
            sprite._$maxAlpha = object.maxAlpha || 1;
            sprite._$canDraw  = object.canDraw || true;
            sprite._$xMin     = object.xMin || 0;
            sprite._$yMin     = object.yMin || 0;
            sprite._$xMax     = object.xMax || 0;
            sprite._$yMax     = object.yMax || 0;
        }

        if (object.grid) {
            sprite._$scale9Grid = object.grid;
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
    _$createShape (object: PropertyShapeMessageImpl): void
    {
        const shape: RenderShape = $getShape();

        shape._$instanceId = object.instanceId;
        shape._$parentId   = object.parentId;
        if (object.recodes) {
            shape._$recodes = object.recodes;
        }

        shape._$maxAlpha = object.maxAlpha || 1;
        shape._$canDraw  = object.canDraw || true;

        shape._$xMin = object.xMin || 0;
        shape._$yMin = object.yMin || 0;
        shape._$xMax = object.xMax || 0;
        shape._$yMax = object.yMax || 0;

        if (object.characterId) {
            shape._$characterId = object.characterId;
        }

        if ("loaderInfoId" in object) {
            shape._$loaderInfoId = object.loaderInfoId || 0;
        }

        if (object.grid) {
            shape._$scale9Grid = object.grid;
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
    _$createVideo (object: PropertyVideoMessageImpl): void
    {
        const video: RenderVideo = $getVideo();

        video._$instanceId = object.instanceId;

        if (object.characterId) {
            video._$characterId = object.characterId;
        }
        if ("loaderInfoId" in object) {
            video._$loaderInfoId = object.loaderInfoId || 0;
        }

        video._$updateProperty(object);

        this._$instances.set(video._$instanceId, video);
    }

    /**
     * @description TextFieldクラスを生成
     *
     * @param  {object} object
     * @return {void}
     * @method
     * @private
     */
    _$createTextField (object: PropertyTextMessageImpl): void
    {
        const textField: RenderTextField = $getTextField();

        textField._$instanceId = object.instanceId;

        // bounds
        textField._$xMin = object.xMin || 0;
        textField._$yMin = object.yMin || 0;
        textField._$xMax = object.xMax || 0;
        textField._$yMax = object.yMax || 0;

        if (object.characterId) {
            textField._$characterId = object.characterId;
        }
        if ("loaderInfoId" in object) {
            textField._$loaderInfoId = object.loaderInfoId || 0;
        }

        textField._$updateProperty(object);

        this._$instances.set(textField._$instanceId, textField);
    }
}