import { RenderDisplayObjectContainer } from "./display/RenderDisplayObjectContainer";
import { CanvasToWebGLContext } from "@next2d/webgl";
import type { RenderShape } from "./display/RenderShape";
import type { RenderVideo } from "./media/RenderVideo";
import type { RenderTextField } from "./text/RenderTextField";
import type { RenderDisplayObjectImpl } from "./interface/RenderDisplayObjectImpl";
import type { AttachmentImpl } from "./interface/AttachmentImpl";
import type { PropertyTextMessageImpl } from "./interface/PropertyTextMessageImpl";
import type { PropertyVideoMessageImpl } from "./interface/PropertyVideoMessageImpl";
import type { RGBAImpl } from "./interface/RGBAImpl";
import type { FrameBufferManager } from "@next2d/webgl";
import {
    $cacheStore,
    $COLOR_ARRAY_IDENTITY,
    $getFloat32Array6,
    $uintToRGBA,
    $setDevicePixelRatio,
    $blendToString,
    $poolFloat32Array6
} from "@next2d/share";
import {
    $getDisplayObjectContainer,
    $getShape,
    $getTextField,
    $getVideo,
    $setSafari
} from "./RenderGlobal";

/**
 * @class
 */
export class RenderPlayer
{
    private readonly _$instances: Map<number, RenderDisplayObjectImpl<any>>;
    private readonly _$matrix: Float32Array;
    private _$context: CanvasToWebGLContext | null;
    private _$canvas: OffscreenCanvas | null;
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
         * @type {Float32Array}
         * @default null
         * @private
         */
        this._$matrix = $getFloat32Array6(1, 0, 0, 1, 0, 0);

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
        $cacheStore.reset();
    }

    /**
     * @description WebGLを起動
     *
     * @param  {Float32Array} buffer
     * @param  {OffscreenCanvas} canvas
     * @return {void}
     * @method
     * @public
     */
    _$initialize (
        buffer: Float32Array,
        canvas: OffscreenCanvas
    ): void {

        let index = 0;

        // set stage
        this._$setStage(buffer[index++]);

        // update
        $setSafari(buffer[index++] === 1);
        $setDevicePixelRatio(buffer[index++]);

        this._$canvas = canvas;

        const gl: WebGL2RenderingContext | null = canvas.getContext("webgl2", {
            "stencil": true,
            "premultipliedAlpha": true,
            "antialias": false,
            "depth": false,
            "preserveDrawingBuffer": true
        });

        if (gl) {
            const context: CanvasToWebGLContext = new CanvasToWebGLContext(gl, buffer[index++]);
            this._$context = context;
            $cacheStore.context = context;
        }
    }

    /**
     * @description 背景色をセット
     *
     * @param  {Float32Array} buffer
     * @return {void}
     * @method
     * @public
     */
    _$setBackgroundColor (buffer: Float32Array): void
    {
        if (!this._$context) {
            return ;
        }

        const backgroundColor: number = buffer[0];
        if (backgroundColor === -1) {

            this._$context._$setColor(0, 0, 0, 0);

        } else {

            const color: RGBAImpl = $uintToRGBA(backgroundColor);

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

        context
            .frameBuffer
            .transferToMainTexture();

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

        context.drawInstacedArray();
        context
            .frameBuffer
            .transferToMainTexture();
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
    _$resize (buffer: Float32Array): void
    {

        let index: number = 0;
        const width: number  = buffer[index++];
        const height: number = buffer[index++];

        this._$width  = width;
        this._$height = height;

        if (!this._$canvas) {
            return ;
        }

        if (this._$canvas.width === width && this._$canvas.height === height) {
            return ;
        }

        const context: CanvasToWebGLContext | null = this._$context;
        if (!context) {
            return ;
        }

        const scale: number = buffer[index++];
        this._$matrix[0] = scale;
        this._$matrix[3] = scale;
        this._$matrix[4] = buffer[index++];
        this._$matrix[5] = buffer[index++];

        this._$stage._$updated = true;
        $cacheStore.reset();

        context.clearInstacedArray();

        this._$canvas.width  = width;
        this._$canvas.height = height;

        context._$gl.viewport(0, 0, width, height);

        const manager: FrameBufferManager = context.frameBuffer;
        if (this._$attachment) {
            manager.unbind();
            manager.releaseAttachment(this._$attachment, true);
        }

        this._$attachment = manager
            .createCacheAttachment(width, height, true);

        // update cache max size
        context.setMaxSize(width, height);

        context._$bind(this._$attachment);
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
     * @param  {Float32Array} buffer
     * @return {void}
     * @method
     * @private
     */
    _$createDisplayObjectContainer (buffer: Float32Array): void
    {
        const sprite: RenderDisplayObjectContainer = $getDisplayObjectContainer();

        let index = 0;
        sprite._$instanceId = buffer[index++];
        sprite._$parentId   = buffer[index++];

        this._$setProperty(sprite, buffer, index);

        this._$instances.set(sprite._$instanceId, sprite);
    }

    /**
     * @param  {object} instance
     * @param  {Float32Array} buffer
     * @param  {number} index
     * @return {void}
     * @method
     * @private
     */
    _$setProperty (
        instance: RenderDisplayObjectImpl<any>,
        buffer: Float32Array,
        index: number
    ): void {

        // visible
        instance._$visible = buffer[index++] === 1;

        // depth
        instance._$depth = buffer[index++];

        // clip depth
        instance._$clipDepth = buffer[index++];

        // isMask
        instance._$isMask = buffer[index++] === 1;

        const mask: boolean = buffer[index++] === 1;
        if (mask) {

            instance._$maskId = buffer[index++];

            if (!instance._$maskMatrix) {
                instance._$maskMatrix = $getFloat32Array6();
            }

            instance._$maskMatrix[0] = buffer[index++];
            instance._$maskMatrix[1] = buffer[index++];
            instance._$maskMatrix[2] = buffer[index++];
            instance._$maskMatrix[3] = buffer[index++];
            instance._$maskMatrix[4] = buffer[index++];
            instance._$maskMatrix[5] = buffer[index++];

        } else {

            instance._$maskId = -1;
            if (instance._$maskMatrix) {
                $poolFloat32Array6(instance._$maskMatrix);
                instance._$maskMatrix = null;
            }
            index += 7;

        }

        if (instance._$visible) {

            // matrix
            instance._$matrix[0] = buffer[index++];
            instance._$matrix[1] = buffer[index++];
            instance._$matrix[2] = buffer[index++];
            instance._$matrix[3] = buffer[index++];
            instance._$matrix[4] = buffer[index++];
            instance._$matrix[5] = buffer[index++];

            // colorTransform
            instance._$colorTransform[0] = buffer[index++];
            instance._$colorTransform[1] = buffer[index++];
            instance._$colorTransform[2] = buffer[index++];
            instance._$colorTransform[3] = buffer[index++];
            instance._$colorTransform[4] = buffer[index++];
            instance._$colorTransform[5] = buffer[index++];
            instance._$colorTransform[6] = buffer[index++];
            instance._$colorTransform[7] = buffer[index++];

        } else {

            index += 6; // matrix
            index += 8; // colorTransform

        }

        // blend mode
        instance._$blendMode = $blendToString(buffer[index++]);

        // scale9Grid
        if (buffer[index++]) {
            instance._$scale9Grid = {
                "x": buffer[index++],
                "y": buffer[index++],
                "w": buffer[index++],
                "h": buffer[index++]
            };
        } else {
            instance._$scale9Grid = null;
        }

        // blend mode
        instance._$blendMode = $blendToString(buffer[index++]);

        // scale9Grid
        if (buffer[index++]) {
            instance._$scale9Grid = {
                "x": buffer[index++],
                "y": buffer[index++],
                "w": buffer[index++],
                "h": buffer[index++]
            };
        } else {
            instance._$scale9Grid = null;
        }
    }

    /**
     * @description Shapeの描画レコードを登録
     *
     * @param  {number} instance_id
     * @param  {Float32Array} recodes
     * @return {void}
     * @method
     * @private
     */
    _$registerShapeRecodes (instance_id: number, recodes: Float32Array): void
    {
        if (!this._$instances.has(instance_id)) {
            this._$instances.set(instance_id, $getShape());
        }

        const shape: RenderShape = this._$instances.get(instance_id);
        shape._$recodes = recodes;
    }

    /**
     * @description Shapeクラスを生成
     *
     * @param  {Float32Array} buffer
     * @return {void}
     * @method
     * @private
     */
    _$createShape (buffer: Float32Array): void
    {
        let index = 0;
        const instanceId = buffer[index++];

        if (!this._$instances.has(instanceId)) {
            this._$instances.set(instanceId, $getShape());
        }
        const shape: RenderShape = this._$instances.get(instanceId);

        shape._$instanceId = instanceId;
        shape._$parentId   = buffer[index++];
        shape._$maxAlpha   = buffer[index++];
        shape._$canDraw    = buffer[index++] === 1;

        shape._$xMin = buffer[index++];
        shape._$yMin = buffer[index++];
        shape._$xMax = buffer[index++];
        shape._$yMax = buffer[index++];

        shape._$characterId  = buffer[index++];
        shape._$loaderInfoId = buffer[index++];

        this._$setProperty(shape, buffer, index);
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

        // video._$instanceId = object.instanceId;

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

        // textField._$instanceId = object.instanceId;

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