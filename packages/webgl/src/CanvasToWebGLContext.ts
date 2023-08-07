import { CanvasToWebGLContextStyle } from "./CanvasToWebGLContextStyle";
import { FrameBufferManager } from "./FrameBufferManager";
import { CanvasToWebGLContextPath } from "./CanvasToWebGLContextPath";
import { CanvasToWebGLContextGrid } from "./CanvasToWebGLContextGrid";
import { CanvasToWebGLShaderList } from "./shader/CanvasToWebGLShaderList";
import { GradientLUTGenerator } from "./shader/GradientLUTGenerator";
import { VertexArrayObjectManager } from "./VertexArrayObjectManager";
import { CanvasToWebGLContextMask } from "./CanvasToWebGLContextMask";
import { CanvasToWebGLContextBlend } from "./CanvasToWebGLContextBlend";
import { CanvasPatternToWebGL } from "./CanvasPatternToWebGL";
import { CanvasGradientToWebGL } from "./CanvasGradientToWebGL";
import { WebGLFillMeshGenerator } from "./WebGLFillMeshGenerator";
import type { CanvasToWebGLShader } from "./shader/CanvasToWebGLShader";
import type { GradientShapeShaderVariantCollection } from "./shader/variants/GradientShapeShaderVariantCollection";
import type { ShapeShaderVariantCollection } from "./shader/variants/ShapeShaderVariantCollection";
import type { WebGLShaderUniform } from "./shader/WebGLShaderUniform";
import type { FilterShaderVariantCollection } from "./shader/variants/FilterShaderVariantCollection";
import type { BlendShaderVariantCollection } from "./shader/variants/BlendShaderVariantCollection";
import type { AttachmentImpl } from "./interface/AttachmentImpl";
import type { BoundsImpl } from "./interface/BoundsImpl";
import type { BlendModeImpl } from "./interface/BlendModeImpl";
import type { IndexRangeImpl } from "./interface/IndexRangeImpl";
import type { PointImpl } from "./interface/PointImpl";
import type { VerticesImpl } from "./interface/VerticesImpl";
import type { InterpolationMethodImpl } from "./interface/InterpolationMethodImpl";
import type { SpreadMethodImpl } from "./interface/SpreadMethodImpl";
import type { CapsStyleImpl } from "./interface/CapsStyleImpl";
import type { JointStyleImpl } from "./interface/JointStyleImpl";
import type { CachePositionImpl } from "./interface/CachePositionImpl";
import {
    $Math,
    $getFloat32Array9,
    $getArray,
    $clamp,
    $poolArray,
    $inverseMatrix,
    $poolFloat32Array9,
    $poolBoundsObject,
    $getBoundsObject
} from "@next2d/share";

/**
 * @class
 */
export class CanvasToWebGLContext
{
    public readonly _$gl: WebGL2RenderingContext;
    private readonly _$maxTextureSize: number;
    private readonly _$contextStyle: CanvasToWebGLContextStyle;
    private _$cacheBounds: BoundsImpl;
    private _$matrix: Float32Array;
    private _$cacheAttachment: AttachmentImpl|null;
    private readonly _$stack: Float32Array[];
    private _$globalAlpha: number;
    private _$imageSmoothingEnabled: boolean;
    private _$globalCompositeOperation: BlendModeImpl;
    private _$clearColorR: number;
    private _$clearColorG: number;
    private _$clearColorB: number;
    private _$clearColorA: number;
    private _$viewportWidth: number;
    private _$viewportHeight: number;
    private readonly _$frameBufferManager: FrameBufferManager;
    private readonly _$path: CanvasToWebGLContextPath;
    private readonly _$grid: CanvasToWebGLContextGrid;
    public _$offsetX: number;
    public _$offsetY: number;
    private readonly _$blends: boolean[];
    private readonly _$positions: BoundsImpl[];
    private _$isLayer: boolean;
    private readonly _$shaderList: CanvasToWebGLShaderList;
    private readonly _$gradientLUT: GradientLUTGenerator;
    private readonly _$vao: VertexArrayObjectManager;
    private readonly _$mask: CanvasToWebGLContextMask;
    private readonly _$blend: CanvasToWebGLContextBlend;
    private readonly _$maskBounds: BoundsImpl;
    private readonly _$attachmentArray: Array<AttachmentImpl|null>;
    private _$cachePosition: CachePositionImpl | null;

    /**
     * @param {WebGL2RenderingContext} gl
     * @param {number} sample
     * @constructor
     * @public
     */
    constructor (gl: WebGL2RenderingContext, sample: number)
    {
        /**
         * @type {WebGL2RenderingContext}
         * @private
         */
        this._$gl = gl;

        /**
         * @type {number}
         * @private
         */
        const samples = $Math.min(
            sample,
            gl.getParameter(gl.MAX_SAMPLES)
        );

        /**
         * @type {number}
         * @private
         */
        this._$maxTextureSize = $Math.min(8192,
            gl.getParameter(gl.MAX_TEXTURE_SIZE)
        ) - 2;

        /**
         * @type {CanvasToWebGLContextStyle}
         * @private
         */
        this._$contextStyle = new CanvasToWebGLContextStyle();

        /**
         * @type {BoundsImpl}
         * @private
         */
        this._$cacheBounds = $getBoundsObject();

        /**
         * @type {Float32Array}
         * @private
         */
        this._$matrix = $getFloat32Array9(1, 0, 0, 0, 1, 0, 0, 0, 1);

        /**
         * @type {AttachmentImpl}
         * @default null
         * @private
         */
        this._$cacheAttachment = null;

        /**
         * @type {array}
         * @private
         */
        this._$stack = [];

        /**
         * @type {number}
         * @default 1
         * @private
         */
        this._$globalAlpha = 1;

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$imageSmoothingEnabled = false;

        /**
         * @type {string}
         * @default "normal"
         * @private
         */
        this._$globalCompositeOperation = "normal";

        /**
         * @type {number}
         * @default 1
         * @private
         */
        this._$clearColorR = 1;

        /**
         * @type {number}
         * @default 1
         * @private
         */
        this._$clearColorG = 1;

        /**
         * @type {number}
         * @default 1
         * @private
         */
        this._$clearColorB = 1;

        /**
         * @type {number}
         * @default 1
         * @private
         */
        this._$clearColorA = 1;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$viewportWidth  = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$viewportHeight = 0;

        /**
         * @type {FrameBufferManager}
         * @private
         */
        this._$frameBufferManager = new FrameBufferManager(gl, samples);

        /**
         * @type {CanvasToWebGLContextPath}
         * @private
         */
        this._$path = new CanvasToWebGLContextPath();

        /**
         * @type {CanvasToWebGLContextGrid}
         * @private
         */
        this._$grid = new CanvasToWebGLContextGrid();

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$offsetX = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$offsetY = 0;

        /**
         * @type {array}
         * @private
         */
        this._$blends = $getArray();

        /**
         * @type {array}
         * @private
         */
        this._$positions = $getArray();

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$isLayer = false;

        /**
         * @type {CanvasToWebGLShaderList}
         * @private
         */
        this._$shaderList = new CanvasToWebGLShaderList(this, gl);

        /**
         * @type {GradientLUTGenerator}
         * @private
         */
        this._$gradientLUT = new GradientLUTGenerator(this, gl);

        /**
         * @type {VertexArrayObjectManager}
         * @private
         */
        this._$vao = new VertexArrayObjectManager(gl);

        /**
         * @type {CanvasToWebGLContextMask}
         * @private
         */
        this._$mask = new CanvasToWebGLContextMask(this, gl);

        /**
         * @type {CanvasToWebGLContextBlend}
         * @private
         */
        this._$blend = new CanvasToWebGLContextBlend(this, gl);

        /**
         * @type {array}
         * @private
         */
        this._$attachmentArray = [];

        /**
         * @type {object}
         * @private
         */
        this._$maskBounds = $getBoundsObject(0, 0, 0, 0);

        /**
         * @type {object}
         * @default null
         * @private
         */
        this._$cachePosition = null;
    }

    /**
     * @member {object}
     * @public
     */
    get cachePosition (): CachePositionImpl | null
    {
        return this._$cachePosition;
    }
    set cachePosition (cache_position: CachePositionImpl | null)
    {
        this._$cachePosition = cache_position;
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    reset (): void
    {
        // reset
        this._$globalAlpha              = 1;
        this._$globalCompositeOperation = "normal";
        this._$imageSmoothingEnabled    = false;

        // reset color
        this._$contextStyle.clear();
    }

    /**
     * @return {boolean}
     * @public
     */
    get isLayer ()
    {
        return this._$isLayer;
    }

    /**
     * @memberof CanvasToWebGLContext#
     * @return {HTMLCanvasElement}
     * @public
     */
    get canvas ()
    {
        return this._$gl.canvas;
    }

    /**
     * @return {AttachmentImpl|null}
     * @public
     */
    get cacheAttachment (): AttachmentImpl | null
    {
        return this._$cacheAttachment;
    }
    set cacheAttachment (attachment:  AttachmentImpl | null)
    {
        this._$cacheAttachment = attachment;
    }

    /**
     * @return {BoundsImpl}
     * @readonly
     * @public
     */
    get cacheBounds (): BoundsImpl
    {
        return this._$cacheBounds;
    }

    /**
     * @member {Float32Array|CanvasGradientToWebGL|CanvasPatternToWebGL}
     * @public
     */
    get fillStyle (): Float32Array|CanvasGradientToWebGL|CanvasPatternToWebGL
    {
        return this._$contextStyle.fillStyle;
    }
    set fillStyle (fill_style: Float32Array|CanvasGradientToWebGL|CanvasPatternToWebGL)
    {
        this._$contextStyle.fillStyle = fill_style;
    }

    /**
     * @member {Float32Array|CanvasGradientToWebGL|CanvasPatternToWebGL}
     * @public
     */
    get strokeStyle (): Float32Array|CanvasGradientToWebGL|CanvasPatternToWebGL
    {
        return this._$contextStyle.strokeStyle;
    }
    set strokeStyle (stroke_style: Float32Array|CanvasGradientToWebGL|CanvasPatternToWebGL)
    {
        this._$contextStyle.strokeStyle = stroke_style;
    }

    /**
     * @member {number}
     * @public
     */
    get lineWidth (): number
    {
        return this._$contextStyle.lineWidth;
    }
    set lineWidth (line_width: number)
    {
        this._$contextStyle.lineWidth = line_width;
    }

    /**
     * @member {string}
     * @public
     */
    get lineCap (): CapsStyleImpl
    {
        return this._$contextStyle.lineCap;
    }
    set lineCap (line_cap: CapsStyleImpl)
    {
        this._$contextStyle.lineCap = line_cap;
    }

    /**
     * @member {string}
     * @public
     */
    get lineJoin (): JointStyleImpl
    {
        return this._$contextStyle.lineJoin;
    }
    set lineJoin (line_join: JointStyleImpl)
    {
        this._$contextStyle.lineJoin = line_join;
    }

    /**
     * @member {number}
     * @public
     */
    get miterLimit (): number
    {
        return this._$contextStyle.miterLimit;
    }
    set miterLimit (miter_limit: number)
    {
        this._$contextStyle.miterLimit = miter_limit;
    }

    /**
     * @member {number}
     * @public
     */
    get globalAlpha (): number
    {
        return this._$globalAlpha;
    }
    set globalAlpha (global_alpha: number)
    {
        this._$globalAlpha = $clamp(global_alpha, 0, 1, 1);
    }

    /**
     * @member {boolean}
     * @public
     */
    get imageSmoothingEnabled (): boolean
    {
        return this._$imageSmoothingEnabled;
    }
    set imageSmoothingEnabled (image_smoothing_enabled: boolean)
    {
        this._$imageSmoothingEnabled = image_smoothing_enabled;
    }

    /**
     * @member {BlendModeImpl}
     * @public
     */
    get globalCompositeOperation (): BlendModeImpl
    {
        return this._$globalCompositeOperation;
    }
    set globalCompositeOperation (global_composite_operation: BlendModeImpl)
    {
        this._$globalCompositeOperation = global_composite_operation;
    }

    /**
     * @member {FrameBufferManager}
     * @readonly
     * @public
     */
    get frameBuffer (): FrameBufferManager
    {
        return this._$frameBufferManager;
    }

    /**
     * @member {CanvasToWebGLShaderList}
     * @readonly
     * @public
     */
    get shaderList (): CanvasToWebGLShaderList
    {
        return this._$shaderList;
    }

    /**
     * @member {CanvasToWebGLContextPath}
     * @readonly
     * @public
     */
    get path (): CanvasToWebGLContextPath
    {
        return this._$path;
    }

    /**
     * @member {CanvasToWebGLContextGrid}
     * @readonly
     * @public
     */
    get grid (): CanvasToWebGLContextGrid
    {
        return this._$grid;
    }

    /**
     * @member {VertexArrayObjectManager}
     * @readonly
     * @public
     */
    get vao (): VertexArrayObjectManager
    {
        return this._$vao;
    }

    /**
     * @member {CanvasToWebGLContextBlend}
     * @readonly
     * @public
     */
    get blend (): CanvasToWebGLContextBlend
    {
        return this._$blend;
    }

    /**
     * @return {object}
     * @private
     */
    _$getCurrentPosition (): BoundsImpl
    {
        return this._$positions[this._$positions.length - 1];
    }

    /**
     * @description textureの最大描画可能サイズからリサイズの比率を算出して返す
     *              Calculate and return the resize ratio from the maximum drawable size of texture
     *
     * @param  {number} width
     * @param  {number} height
     * @return {number}
     * @method
     * @public
     */
    _$getTextureScale (width: number, height: number): number
    {
        const maxSize = $Math.max(width, height);
        if (maxSize > this._$maxTextureSize) {
            return this._$maxTextureSize / maxSize;
        }
        return 1;
    }

    /**
     * @description 描画用のbufferをbind
     *
     * @return {void}
     * @method
     * @public
     */
    drawInstacedArray (): void
    {
        this.blend.drawInstacedArray();
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    clearInstacedArray (): void
    {
        this.blend.clearInstacedArray();
    }

    /**
     * @description 描画用のbufferをbind
     *
     * @param  {object} position
     * @return {void}
     * @method
     * @public
     */
    bindRenderBuffer (position: CachePositionImpl): void
    {
        this
            ._$frameBufferManager
            .bindRenderBuffer();

        // 初期化
        this._$gl.clearColor(0, 0, 0, 0);
        this._$gl.clear(this._$gl.COLOR_BUFFER_BIT | this._$gl.STENCIL_BUFFER_BIT);

        // 描画領域をあらためて設定
        this._$viewportWidth  = position.w;
        this._$viewportHeight = position.h;
        this._$gl.viewport(position.x, position.y, position.w, position.h);

        this._$gl.enable(this._$gl.SCISSOR_TEST);
        this._$gl.scissor(
            position.x, position.y,
            position.w, position.h
        );
    }

    /**
     * @param  {object} position
     * @return {WebGLTexture}
     * @method
     * @public
     */
    getTextureFromRect (position: CachePositionImpl): WebGLTexture
    {
        const manager: FrameBufferManager = this._$frameBufferManager;

        const atlasTexture: WebGLTexture = manager
            .textureManager
            .getAtlasTexture(position.index);

        const currentAttachment: AttachmentImpl | null = manager.currentAttachment;

        const attachment: AttachmentImpl = manager
            .createTextureAttachment(
                position.w, position.h
            );

        this._$bind(attachment);

        this.save();
        this.setTransform(1, 0, 0, 1, 0, 0);

        this.reset();
        this.drawImage(
            atlasTexture,
            -position.x, -atlasTexture.height + position.h + position.y,
            atlasTexture.width, atlasTexture.height
        );

        this.restore();

        const texture: WebGLTexture = attachment.texture as NonNullable<WebGLTexture>;
        manager.releaseAttachment(attachment);

        // reset
        this._$bind(currentAttachment);

        return texture;
    }

    /**
     * @param  {WebGLTexture} texture
     * @return {void}
     * @method
     * @public
     */
    drawBitmap (texture: WebGLTexture): void
    {
        const variants: BlendShaderVariantCollection = this
            ._$shaderList
            .blendShaderVariants;

        const shader: CanvasToWebGLShader = variants
            .getNormalBlendShader(false);

        variants.setNormalBlendUniform(
            shader.uniform, 0, 0, texture.width, texture.height,
            this._$matrix,
            this._$viewportWidth, this._$viewportHeight,
            false, 1, 1, 1, 1, 0, 0, 0, 0
        );

        this
            ._$frameBufferManager
            .textureManager
            .bind0(texture, this._$imageSmoothingEnabled);

        this.blend.toOperation("normal");
        shader._$drawImage();
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    drawTextureFromRect (texture: WebGLTexture, position: CachePositionImpl): void
    {
        const manager: FrameBufferManager = this._$frameBufferManager;

        const currentAttachment: AttachmentImpl | null = manager.currentAttachment;

        this.bindRenderBuffer(position);
        manager.transferTexture(position);

        const atlasTexture: WebGLTexture = manager
            .textureManager
            .getAtlasTexture(position.index);

        const attachment: AttachmentImpl = manager
            .createTextureAttachmentFrom(atlasTexture);
        this._$bind(attachment);

        this._$gl.enable(this._$gl.SCISSOR_TEST);
        this._$gl.scissor(
            position.x, position.y,
            position.w, position.h
        );
        this._$gl.clearColor(0, 0, 0, 0);
        this._$gl.disable(this._$gl.SCISSOR_TEST);

        this.save();
        this.setTransform(1, 0, 0, 1, 0, 0);

        this.reset();
        this.drawImage(
            texture,
            position.x, atlasTexture.height - position.h - position.y,
            texture.width, texture.height
        );

        this.restore();
        manager.releaseAttachment(attachment);

        // reset
        this._$bind(currentAttachment);

        manager.textureManager.release(texture);
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    stopStencil (): void
    {
        this._$mask._$onClearRect();
    }

    /**
     * @param  {object} [attachment = null]
     * @return {void}
     * @method
     * @public
     */
    _$bind (attachment: AttachmentImpl | null = null): void
    {
        if (!attachment) {
            return;
        }

        this._$frameBufferManager.bind(attachment);

        const colorBuffer: WebGLTexture | WebGLRenderbuffer | null = attachment.color;
        const stencilBuffer: WebGLRenderbuffer | null = attachment.stencil;

        const width: number  = attachment.width;
        const height: number = attachment.height;

        if (this._$viewportWidth !== width || this._$viewportHeight !== height) {
            this._$viewportWidth  = width;
            this._$viewportHeight = height;
            this._$gl.viewport(0, 0, width, height);
        }

        // カラーバッファorステンシルバッファが、未初期化の場合はクリアする
        if (colorBuffer && colorBuffer.dirty
            || stencilBuffer && stencilBuffer.dirty
        ) {

            if (colorBuffer) {
                colorBuffer.dirty = false;
            }

            if (stencilBuffer) {
                stencilBuffer.dirty = false;
            }

            this._$gl.clearColor(0, 0, 0, 0);
            this.clearRect(0, 0, this._$viewportWidth, this._$viewportHeight);
            this._$gl.clearColor(this._$clearColorR, this._$clearColorG, this._$clearColorB, this._$clearColorA);

            this._$mask._$onClear(attachment.mask);
        }

        this._$mask._$onBind(attachment.mask);
    }

    /**
     * @param  {number} a
     * @param  {number} b
     * @param  {number} c
     * @param  {number} d
     * @param  {number} e
     * @param  {number} f
     * @return {void}
     * @method
     * @public
     */
    setTransform (
        a: number, b: number, c: number,
        d: number, e: number, f: number
    ): void {
        this._$matrix[0] = a;
        this._$matrix[1] = b;
        this._$matrix[3] = c;
        this._$matrix[4] = d;
        this._$matrix[6] = e;
        this._$matrix[7] = f;
    }

    /**
     * @param  {number} width
     * @param  {number} height
     * @return {void}
     * @method
     * @public
     */
    setMaxSize (width: number, height: number): void
    {
        this._$frameBufferManager.setMaxSize(width, height);
    }

    /**
     * @param  {number} a
     * @param  {number} b
     * @param  {number} c
     * @param  {number} d
     * @param  {number} e
     * @param  {number} f
     * @return {void}
     * @method
     * @public
     */
    transform (
        a: number, b: number, c: number,
        d: number, e: number, f: number
    ): void {

        const a00: number = this._$matrix[0];
        const a01: number = this._$matrix[1];
        const a10: number = this._$matrix[3];
        const a11: number = this._$matrix[4];
        const a20: number = this._$matrix[6];
        const a21: number = this._$matrix[7];

        this._$matrix[0] = a * a00 + b * a10;
        this._$matrix[1] = a * a01 + b * a11;
        this._$matrix[3] = c * a00 + d * a10;
        this._$matrix[4] = c * a01 + d * a11;
        this._$matrix[6] = e * a00 + f * a10 + a20;
        this._$matrix[7] = e * a01 + f * a11 + a21;
    }

    debug (index: number = 0)
    {
        const manager: FrameBufferManager = this._$frameBufferManager;
        const atlasTexture: WebGLTexture = manager
            .textureManager
            .getAtlasTexture(index);

        const currentAttachment = manager.currentAttachment;

        const attachment: AttachmentImpl = manager.createTextureAttachmentFrom(atlasTexture);
        this._$bind(attachment);

        const pixels = new Uint8Array(atlasTexture.width * atlasTexture.height * 4);
        this._$gl.readPixels(
            0, 0, atlasTexture.width, atlasTexture.height,
            this._$gl.RGBA, this._$gl.UNSIGNED_BYTE, pixels
        );

        const canvas  = document.createElement("canvas");
        canvas.width  = atlasTexture.width;
        canvas.height = atlasTexture.height;
        const ctx = canvas.getContext("2d");

        const imageData = new ImageData(atlasTexture.width, atlasTexture.height);
        for (let idx = 0; idx < pixels.length; ++idx) {
            imageData.data[idx] = pixels[idx];
        }

        ctx?.putImageData(imageData, 0, 0);
        console.log(canvas.toDataURL());

        this._$bind(currentAttachment);
        manager.releaseAttachment(attachment);
    }

    /**
     * @param  {number} x_min
     * @param  {number} y_min
     * @param  {number} x_max
     * @param  {number} y_max
     * @param  {Float32Array} color_transform
     * @return {void}
     * @method
     * @public
     */
    drawInstance (
        x_min: number, y_min: number, x_max: number, y_max: number,
        color_transform: Float32Array
    ): void {

        let ct0: number = 1;
        let ct1: number = 1;
        let ct2: number = 1;
        let ct4: number = 0;
        let ct5: number = 0;
        let ct6: number = 0;

        const ct3: number = this._$globalAlpha;
        const ct7: number = 0;

        if (color_transform) {
            ct0 = color_transform[0];
            ct1 = color_transform[1];
            ct2 = color_transform[2];
            ct4 = color_transform[4] / 255;
            ct5 = color_transform[5] / 255;
            ct6 = color_transform[6] / 255;
        }

        const position: CachePositionImpl | null = this._$cachePosition;
        if (position) {

            switch (this._$globalCompositeOperation) {

                case "normal":
                case "layer":
                case "add":
                case "screen":
                case "alpha":
                case "erase":
                case "copy":
                    this.blend.drawInstance(
                        position,
                        ct0, ct1, ct2, ct3, ct4, ct5, ct6, ct7,
                        this._$globalCompositeOperation,
                        this._$viewportWidth, this._$viewportHeight,
                        this._$matrix,
                        this._$imageSmoothingEnabled
                    );
                    break;

                default:
                    {
                        const atlasTexture: WebGLTexture = this
                            ._$frameBufferManager
                            .textureManager
                            .getAtlasTexture(position.index);

                        this.blend.drawInstanceBlend(
                            atlasTexture, x_min, y_min, x_max, y_max,
                            ct0, ct1, ct2, ct3, ct4, ct5, ct6, ct7,
                            position,
                            this._$globalCompositeOperation,
                            this._$viewportWidth, this._$viewportHeight,
                            this._$matrix,
                            this._$imageSmoothingEnabled
                        );
                    }
                    break;

            }
        }
    }

    /**
     * @param  {WebGLTexture} image
     * @param  {number} x
     * @param  {number} y
     * @param  {number} w
     * @param  {number} h
     * @param  {Float32Array} [color_transform=null]
     * @return {void}
     * @method
     * @public
     */
    drawImage (
        image: WebGLTexture,
        x: number, y: number, w: number, h: number,
        color_transform: Float32Array | null = null
    ): void {

        let ct0: number = 1;
        let ct1: number = 1;
        let ct2: number = 1;
        let ct4: number = 0;
        let ct5: number = 0;
        let ct6: number = 0;

        const ct3: number = this._$globalAlpha;
        const ct7: number = 0;

        if (color_transform) {
            ct0 = color_transform[0];
            ct1 = color_transform[1];
            ct2 = color_transform[2];
            ct4 = color_transform[4] / 255;
            ct5 = color_transform[5] / 255;
            ct6 = color_transform[6] / 255;
        }

        this.blend.drawImage(
            image, x, y, w, h,
            ct0, ct1, ct2, ct3, ct4, ct5, ct6, ct7,
            this._$globalCompositeOperation,
            this._$viewportWidth, this._$viewportHeight,
            this._$matrix,
            this._$imageSmoothingEnabled
        );
    }

    /**
     * @param  {number} r
     * @param  {number} g
     * @param  {number} b
     * @param  {number} a
     * @return {void}
     * @method
     * @public
     */
    _$setColor (
        r: number = 0, g: number = 0,
        b: number = 0, a: number = 0
    ): void {
        this._$clearColorR = r;
        this._$clearColorG = g;
        this._$clearColorB = b;
        this._$clearColorA = a;
        this._$gl.clearColor(r, g, b, a);
    }

    /**
     * @param  {number} x
     * @param  {number} y
     * @param  {number} w
     * @param  {number} h
     * @return {void}
     * @method
     * @public
     */
    clearRect (
        x: number, y: number,
        w: number, h: number
    ): void {
        this._$mask._$onClearRect();
        this._$gl.enable(this._$gl.SCISSOR_TEST);
        this._$gl.scissor(x, y, w, h);
        this._$gl.clear(this._$gl.COLOR_BUFFER_BIT | this._$gl.STENCIL_BUFFER_BIT);
        this._$gl.disable(this._$gl.SCISSOR_TEST);
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    _$clearRectStencil (): void
    {
        // stencilを終了
        this._$mask._$onClearRect();

        // マスクの描画領域に限定してstencil情報をクリア
        this._$gl.enable(this._$gl.SCISSOR_TEST);
        this._$gl.scissor(
            this._$maskBounds.xMin,
            this._$maskBounds.yMin,
            this._$maskBounds.xMax,
            this._$maskBounds.yMax
        );
        this._$gl.clear(this._$gl.STENCIL_BUFFER_BIT);
        this._$gl.disable(this._$gl.SCISSOR_TEST);
    }

    /**
     * @param  {number} x
     * @param  {number} y
     * @return {void}
     * @method
     * @public
     */
    moveTo (x: number, y: number): void
    {
        this._$path.moveTo(x, y);
    }

    /**
     * @param  {number} x
     * @param  {number} y
     * @return {void}
     * @method
     * @public
     */
    lineTo (x: number, y: number): void
    {
        this._$path.lineTo(x, y);
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    beginPath (): void
    {
        this._$path.begin();
    }

    /**
     * @param  {number} cx
     * @param  {number} cy
     * @param  {number} x
     * @param  {number} y
     * @return {void}
     * @method
     * @public
     */
    quadraticCurveTo (
        cx: number, cy: number,
        x: number ,y: number
    ): void {
        this._$path.quadTo(cx, cy, x, y);
    }

    /**
     * @param  {number} cp1x
     * @param  {number} cp1y
     * @param  {number} cp2x
     * @param  {number} cp2y
     * @param  {number} dx
     * @param  {number} dy
     * @return {void}
     * @method
     * @public
     */
    bezierCurveTo (
        cp1x: number, cp1y: number,
        cp2x: number, cp2y: number,
        dx: number, dy: number
    ): void {
        this._$path.cubicTo(cp1x, cp1y, cp2x, cp2y, dx, dy);
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    fill (): void
    {
        // to triangle
        const fillVertices: VerticesImpl = this._$path.vertices;
        if (!fillVertices.length) {
            return ;
        }

        const checkVertices: any[] = $getArray();
        for (let idx: number = 0; idx < fillVertices.length; ++idx) {

            const vertices: any[] = fillVertices[idx];
            if (10 > vertices.length) {
                continue;
            }

            checkVertices.push(vertices);
        }

        if (!checkVertices.length) {
            $poolArray(checkVertices);
            return ;
        }

        const fillVertexArrayObject: WebGLVertexArrayObject  = this._$vao.createFill(checkVertices);

        const fillStyle: Float32Array|CanvasGradientToWebGL|CanvasPatternToWebGL = this.fillStyle;

        let matrix: Float32Array = this._$matrix;
        let texture: WebGLTexture;
        let variants: GradientShapeShaderVariantCollection | ShapeShaderVariantCollection;
        let shader: CanvasToWebGLShader;

        const hasGrid: boolean = this._$grid.enabled;
        if (fillStyle instanceof CanvasGradientToWebGL) {

            const stops: any[] = fillStyle.stops;
            const isLinearSpace: boolean = fillStyle.rgb === "linearRGB";

            texture = this
                ._$gradientLUT
                .generateForShape(stops, isLinearSpace);

            this
                ._$frameBufferManager
                .textureManager
                .bind0(texture, true);

            this
                ._$frameBufferManager
                .bindRenderBuffer();

            variants = this
                ._$shaderList
                .gradientShapeShaderVariants;

            if (fillStyle.type === "linear") {

                shader = variants
                    .getGradientShapeShader(
                        false, hasGrid, false, false, fillStyle.mode
                    );

                variants.setGradientShapeUniform(
                    shader.uniform, false, 0, 0, 0,
                    hasGrid, matrix, $inverseMatrix(this._$matrix),
                    this._$viewportWidth, this._$viewportHeight, this._$grid,
                    false, fillStyle.points, 0
                );

            } else {

                matrix = this._$stack[this._$stack.length - 1];

                const hasFocalPoint: boolean = fillStyle.focalPointRatio !== 0;

                shader = variants
                    .getGradientShapeShader(
                        false, hasGrid, true, hasFocalPoint, fillStyle.mode
                    );

                variants.setGradientShapeUniform(
                    shader.uniform, false, 0, 0, 0,
                    hasGrid, matrix, $inverseMatrix(this._$matrix),
                    this._$viewportWidth, this._$viewportHeight, this._$grid,
                    true, fillStyle.points, fillStyle.focalPointRatio
                );

            }

        } else if (fillStyle instanceof CanvasPatternToWebGL) {

            matrix = this._$stack[this._$stack.length - 1];

            const pct: Float32Array = fillStyle.colorTransform;

            texture = fillStyle.texture;

            this
                ._$frameBufferManager
                .textureManager
                .bind0(texture, this._$imageSmoothingEnabled);

            variants = this
                ._$shaderList
                .shapeShaderVariants;

            shader = variants
                .getBitmapShapeShader(
                    false, fillStyle.repeat, hasGrid
                );

            if (pct) {

                variants.setBitmapShapeUniform(
                    shader.uniform, false, 0, 0, 0,
                    hasGrid, matrix, $inverseMatrix(this._$matrix),
                    this._$viewportWidth, this._$viewportHeight, this._$grid,
                    texture.width, texture.height,
                    pct[0], pct[1], pct[2], this._$globalAlpha,
                    pct[4] / 255, pct[5] / 255, pct[6] / 255, 0
                );

            } else {

                variants.setBitmapShapeUniform(
                    shader.uniform, false, 0, 0, 0,
                    hasGrid, matrix, $inverseMatrix(this._$matrix),
                    this._$viewportWidth, this._$viewportHeight, this._$grid,
                    texture.width, texture.height,
                    1, 1, 1, this._$globalAlpha,
                    0, 0, 0, 0
                );

            }

        } else {

            variants = this
                ._$shaderList
                .shapeShaderVariants;

            shader = variants
                .getSolidColorShapeShader(false, this._$grid.enabled);

            variants.setSolidColorShapeUniform(
                shader.uniform, false, 0, 0, 0,
                hasGrid, matrix,
                this._$viewportWidth, this._$viewportHeight, this._$grid,
                fillStyle, this._$globalAlpha
            );

        }

        const coverageVariants: ShapeShaderVariantCollection = this
            ._$shaderList
            .shapeShaderVariants;

        const coverageShader: CanvasToWebGLShader = coverageVariants
            .getMaskShapeShader(false, hasGrid);

        coverageVariants.setMaskShapeUniform(
            coverageShader.uniform, hasGrid,
            matrix[0], matrix[1], matrix[2],
            matrix[3], matrix[4], matrix[5],
            matrix[6], matrix[7], matrix[8],
            this._$viewportWidth, this._$viewportHeight, this._$grid
        );

        // mask on
        this._$gl.enable(this._$gl.STENCIL_TEST);
        this._$gl.stencilMask(0xff);

        // draw shape
        this._$gl.enable(this._$gl.SAMPLE_ALPHA_TO_COVERAGE);
        this._$gl.stencilFunc(this._$gl.ALWAYS, 0, 0xff);
        this._$gl.stencilOp(this._$gl.KEEP, this._$gl.INVERT, this._$gl.INVERT);
        this._$gl.colorMask(false, false, false, false);
        coverageShader._$fill(fillVertexArrayObject);
        this._$gl.disable(this._$gl.SAMPLE_ALPHA_TO_COVERAGE);

        // draw shape range
        this._$gl.stencilFunc(this._$gl.NOTEQUAL, 0, 0xff);
        this._$gl.stencilOp(this._$gl.KEEP, this._$gl.ZERO, this._$gl.ZERO);
        this._$gl.colorMask(true, true, true, true);
        shader._$fill(fillVertexArrayObject);

        // mask off
        this._$gl.disable(this._$gl.STENCIL_TEST);

        // release vertex array
        this.releaseFillVertexArray(fillVertexArrayObject);
    }

    /**
     * @param  {WebGLVertexArrayObject} vertex_array
     * @return {void}
     * @method
     * @public
     */
    releaseFillVertexArray (vertex_array: WebGLVertexArrayObject): void
    {
        // release shape vertex array object
        this._$vao.releaseFill(vertex_array);

        const indexRanges: IndexRangeImpl[] = vertex_array.indexRanges;
        for (let idx = 0; idx < indexRanges.length; ++idx) {
            WebGLFillMeshGenerator
                .indexRangePool
                .push(indexRanges[idx]);
        }

        $poolArray(indexRanges);
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    _$enterClip (): void
    {
        this._$mask._$enterClip();
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    _$beginClipDef (): void
    {
        this._$mask._$beginClipDef();
    }

    /**
     * @param  {boolean} flag
     * @return {void}
     * @method
     * @private
     */
    _$updateContainerClipFlag (flag: boolean): void
    {
        this._$mask.containerClip = flag;
    }

    /**
     * @description マスク処理の開始関数
     *              Mask processing start function
     *
     * @param  {object} bounds
     * @return {void}
     * @method
     * @public
     */
    _$startClip (bounds: BoundsImpl): boolean
    {
        const x: number      = bounds.xMin;
        const y: number      = bounds.yMin;
        const width: number  = Math.abs(bounds.xMax - bounds.xMin);
        const height: number = Math.abs(bounds.yMax - bounds.yMin);

        // resize
        const manager: FrameBufferManager = this._$frameBufferManager;
        const currentAttachment: AttachmentImpl | null = manager.currentAttachment;
        if (!currentAttachment) {
            throw new Error("the current Attachment is null.");
        }

        if (x > currentAttachment.width
            || y > currentAttachment.height
        ) {
            return false;
        }

        if (0 > x && 0 >= width + x) {
            return false;
        }

        if (0 > y && 0 >= height + y) {
            return false;
        }

        this._$maskBounds.xMin = $Math.max(0, $Math.min(this._$maskBounds.xMin, x));
        this._$maskBounds.yMin = $Math.max(0, $Math.min(this._$maskBounds.yMin, y));
        this._$maskBounds.xMax = $Math.min(currentAttachment.width,  $Math.min(this._$maskBounds.xMax, width));
        this._$maskBounds.yMax = $Math.min(currentAttachment.height, $Math.min(this._$maskBounds.yMax, height));

        return true;
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    _$endClipDef (): void
    {
        this._$mask._$endClipDef();
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    _$leaveClip (): void
    {
        this.drawInstacedArray();
        this._$mask._$leaveClip();
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    _$drawContainerClip (): void
    {
        this._$mask._$drawContainerClip();
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    closePath (): void
    {
        this._$path.close();
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    stroke (): void
    {

        const strokeVertices: any[] = this._$path.vertices;
        if (!strokeVertices.length) {
            return ;
        }

        const checkVertices = $getArray();
        for (let idx = 0; idx < strokeVertices.length; ++idx) {

            const vertices = strokeVertices[idx];
            if (6 > vertices.length) {
                continue;
            }

            checkVertices.push(vertices);
        }

        if (!checkVertices.length) {
            $poolArray(checkVertices);
            return ;
        }

        const strokeBuffer: WebGLVertexArrayObject = this._$vao.createStroke(
            strokeVertices,
            this.lineCap,
            this.lineJoin
        );

        let matrix: Float32Array = this._$matrix;

        const strokeStyle: Float32Array|CanvasGradientToWebGL|CanvasPatternToWebGL = this.strokeStyle;

        let face: number = $Math.sign(matrix[0] * matrix[4]);
        if (face > 0 && matrix[1] !== 0 && matrix[3] !== 0) {
            face = -$Math.sign(matrix[1] * matrix[3]);
        }

        let lineWidth: number = this.lineWidth * 0.5;
        let scaleX: number;
        let scaleY: number;
        if (this._$grid.enabled) {
            // lineWidth *= $getSameScaleBase();
            scaleX = $Math.abs(this._$grid.ancestorMatrixA + this._$grid.ancestorMatrixD);
            scaleY = $Math.abs(this._$grid.ancestorMatrixB + this._$grid.ancestorMatrixE);
        } else {
            scaleX = $Math.abs(matrix[0] + matrix[3]);
            scaleY = $Math.abs(matrix[1] + matrix[4]);
        }

        const scaleMin: number = $Math.min(scaleX, scaleY);
        const scaleMax: number = $Math.max(scaleX, scaleY);
        lineWidth *= scaleMax * (1 - 0.3 * $Math.cos($Math.PI * 0.5 * (scaleMin / scaleMax)));
        lineWidth = $Math.max(1, lineWidth);

        const hasGrid: boolean = this._$grid.enabled;

        let texture: WebGLTexture;
        let variants: GradientShapeShaderVariantCollection | ShapeShaderVariantCollection;
        let shader: CanvasToWebGLShader;
        if (strokeStyle instanceof CanvasGradientToWebGL) {

            if (strokeStyle.type === "radial") {
                matrix = this._$stack[this._$stack.length - 1];
            }

            const stops: any[] = strokeStyle.stops;
            const isLinearSpace: boolean = strokeStyle.rgb === "linearRGB";

            texture = this
                ._$gradientLUT
                .generateForShape(stops, isLinearSpace);

            this
                ._$frameBufferManager
                .textureManager
                .bind0(texture, true);

            variants = this
                ._$shaderList
                .gradientShapeShaderVariants;

            if (strokeStyle.type === "linear") {

                shader = variants
                    .getGradientShapeShader(
                        true, hasGrid, false, false, strokeStyle.mode
                    );

                variants.setGradientShapeUniform(
                    shader.uniform, true, lineWidth, face, this.miterLimit,
                    hasGrid, matrix, $inverseMatrix(this._$matrix),
                    this._$viewportWidth, this._$viewportHeight, this._$grid,
                    false, strokeStyle.points, 0
                );

            } else {

                matrix = this._$stack[this._$stack.length - 1];

                const hasFocalPoint: boolean = strokeStyle.focalPointRatio !== 0;

                shader = variants
                    .getGradientShapeShader(
                        true, hasGrid, true, hasFocalPoint, strokeStyle.mode
                    );

                variants.setGradientShapeUniform(
                    shader.uniform, true, lineWidth, face, this.miterLimit,
                    hasGrid, matrix, $inverseMatrix(this._$matrix),
                    this._$viewportWidth, this._$viewportHeight, this._$grid,
                    true, strokeStyle.points, strokeStyle.focalPointRatio
                );
            }

        } else if (strokeStyle instanceof CanvasPatternToWebGL) {

            matrix = this._$stack[this._$stack.length - 1];

            const pct = strokeStyle.colorTransform;

            texture = strokeStyle.texture;

            this
                ._$frameBufferManager
                .textureManager
                .bind0(texture);

            variants = this
                ._$shaderList
                .shapeShaderVariants;

            shader = variants
                .getBitmapShapeShader(
                    true, strokeStyle.repeat, this._$grid.enabled
                );

            if (pct) {

                variants.setBitmapShapeUniform(
                    shader.uniform, true, lineWidth, face, this.miterLimit,
                    hasGrid, matrix, $inverseMatrix(this._$matrix),
                    this._$viewportWidth, this._$viewportHeight, this._$grid,
                    texture.width, texture.height,
                    pct[0], pct[1], pct[2], this._$globalAlpha,
                    pct[4] / 255, pct[5] / 255, pct[6] / 255, 0
                );

            } else {

                variants.setBitmapShapeUniform(
                    shader.uniform, true, lineWidth, face, this.miterLimit,
                    hasGrid, matrix, $inverseMatrix(this._$matrix),
                    this._$viewportWidth, this._$viewportHeight, this._$grid,
                    texture.width, texture.height,
                    1, 1, 1, this._$globalAlpha,
                    0, 0, 0, 0
                );
            }

        } else {

            variants = this
                ._$shaderList
                .shapeShaderVariants;

            shader = variants
                .getSolidColorShapeShader(true, this._$grid.enabled);

            variants.setSolidColorShapeUniform(
                shader.uniform, true, lineWidth, face, this.miterLimit,
                hasGrid, matrix,
                this._$viewportWidth, this._$viewportHeight, this._$grid,
                strokeStyle, this._$globalAlpha
            );

        }

        shader._$stroke(strokeBuffer);

        this._$vao.releaseStroke(strokeBuffer);
    }

    /**
     * @param  {number} x
     * @param  {number} y
     * @param  {number} radius
     * @return {void}
     * @method
     * @public
     */
    arc (x: number, y: number, radius: number): void
    {
        this._$path.drawCircle(x, y, radius);
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    clip (): void
    {
        // to triangle
        const fillVertices: any[] = this._$path.vertices;
        if (!fillVertices.length) {
            return ;
        }

        const checkVertices: any[] = $getArray();
        for (let idx: number = 0; idx < fillVertices.length; ++idx) {

            const vertices: any[] = fillVertices[idx];
            if (10 > vertices.length) {
                continue;
            }

            checkVertices.push(vertices);
        }

        if (!checkVertices.length) {
            $poolArray(checkVertices);
            return ;
        }

        const fillVertexArrayObject: WebGLVertexArrayObject = this._$vao.createFill(checkVertices);

        // mask render
        const variants: ShapeShaderVariantCollection = this
            ._$shaderList
            .shapeShaderVariants;

        const shader: CanvasToWebGLShader = variants.getMaskShapeShader(false, false);

        const uniform: WebGLShaderUniform = shader.uniform;

        variants.setMaskShapeUniform(
            uniform, false,
            this._$matrix[0], this._$matrix[1], this._$matrix[2],
            this._$matrix[3], this._$matrix[4], this._$matrix[5],
            this._$matrix[6], this._$matrix[7], this._$matrix[8],
            this._$viewportWidth, this._$viewportHeight, null
        );

        if (this._$mask._$onClip(fillVertexArrayObject,
            this._$matrix,
            this._$viewportWidth,
            this._$viewportHeight
        )) {
            return;
        }

        shader._$fill(fillVertexArrayObject);

        this.beginPath();
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    save (): void
    {
        // matrix
        const matrix: Float32Array = this._$matrix;

        this._$stack.push($getFloat32Array9(
            matrix[0], matrix[1], matrix[2],
            matrix[3], matrix[4], matrix[5],
            matrix[6], matrix[7], matrix[8]
        ));

        // mask
        this._$mask._$onSave();
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    restore (): void
    {
        //matrix
        if (this._$stack.length) {
            $poolFloat32Array9(this._$matrix);
            this._$matrix = this._$stack.pop() || $getFloat32Array9();
        }

        // mask
        this._$mask._$onRestore();
    }

    /**
     * @param  {WebGLTexture} texture
     * @param  {boolean}      repeat
     * @param  {Float32Array} color_transform
     * @return {CanvasPatternToWebGL}
     * @method
     * @public
     */
    createPattern (
        texture: WebGLTexture,
        repeat: boolean,
        color_transform: Float32Array
    ): CanvasPatternToWebGL {
        return new CanvasPatternToWebGL(this, texture, repeat, color_transform);
    }

    /**
     * @param  {number} x0
     * @param  {number} y0
     * @param  {number} x1
     * @param  {number} y1
     * @param  {string} [rgb=InterpolationMethod.RGB]
     * @param  {string} [mode=SpreadMethod.PAD]
     * @return {CanvasGradientToWebGL}
     * @method
     * @public
     */
    createLinearGradient (
        x0: number, y0: number, x1: number, y1: number,
        rgb: InterpolationMethodImpl = "rgb",
        mode: SpreadMethodImpl = "pad"
    ): CanvasGradientToWebGL {
        return new CanvasGradientToWebGL()
            .linear(x0, y0, x1, y1, rgb, mode);
    }

    /**
     * @param  {number} x0
     * @param  {number} y0
     * @param  {number} r0
     * @param  {number} x1
     * @param  {number} y1
     * @param  {number} r1
     * @param  {string} [rgb=InterpolationMethod.RGB]
     * @param  {string} [mode=SpreadMethod.PAD]
     * @param  {number} [focal_point_ratio=0]
     * @return {CanvasGradientToWebGL}
     * @method
     * @public
     */
    createRadialGradient (
        x0: number, y0: number, r0: number,
        x1: number, y1: number, r1: number,
        rgb: InterpolationMethodImpl = "rgb",
        mode: SpreadMethodImpl = "pad",
        focal_point_ratio: number = 0
    ): CanvasGradientToWebGL {
        return new CanvasGradientToWebGL()
            .radial(
                x0, y0, r0, x1, y1, r1,
                rgb, mode, focal_point_ratio
            );
    }

    /**
     * @param  {WebGLTexture} texture
     * @param  {boolean}      is_horizontal
     * @param  {number}       blur
     * @return {void}
     * @method
     * @public
     */
    _$applyBlurFilter (
        texture: WebGLTexture,
        is_horizontal: boolean,
        blur: number
    ): void {

        const manager: FrameBufferManager = this._$frameBufferManager;

        const currentAttachment: AttachmentImpl | null = manager.currentAttachment;
        if (!currentAttachment) {
            throw new Error("the current attachment is null.");
        }

        const width: number  = currentAttachment.width;
        const height: number = currentAttachment.height;

        manager
            .textureManager
            .bind0(texture, true);

        const halfBlur: number = $Math.ceil(blur * 0.5);
        const fraction: number = 1 - (halfBlur - blur * 0.5);
        const samples: number  = 1 + blur;

        const variants: FilterShaderVariantCollection = this
            ._$shaderList
            .filterShaderVariants;

        const shader: CanvasToWebGLShader = variants
            .getBlurFilterShader(halfBlur);

        variants
            .setBlurFilterUniform(
                shader.uniform,
                width, height,
                is_horizontal, fraction, samples
            );

        shader._$drawImage();
    }

    /**
     * @param  {WebGLTexture} texture
     * @param  {number}  width
     * @param  {number}  height
     * @param  {number}  base_width
     * @param  {number}  base_height
     * @param  {number}  base_offset_x
     * @param  {number}  base_offset_y
     * @param  {number}  blur_width
     * @param  {number}  blur_height
     * @param  {number}  blur_offset_x
     * @param  {number}  blur_offset_y
     * @param  {boolean} is_glow
     * @param  {string}  type
     * @param  {boolean} knockout
     * @param  {number}  strength
     * @param  {array | null} [ratios = null]
     * @param  {array | null} [colors = null]
     * @param  {array | null} [alphas = null]
     * @param  {number} [color_r1 = 0]
     * @param  {number} [color_g1 = 0]
     * @param  {number} [color_b1 = 0]
     * @param  {number} [color_a1 = 0]
     * @param  {number} [color_r2 = 0]
     * @param  {number} [color_g2 = 0]
     * @param  {number} [color_b2 = 0]
     * @param  {number} [color_a2 = 0]
     * @return {void}
     * @method
     * @public
     */
    _$applyBitmapFilter (
        texture: WebGLTexture,
        width: number, height: number,
        base_width: number, base_height: number,
        base_offset_x: number, base_offset_y: number,
        blur_width: number, blur_height: number,
        blur_offset_x: number, blur_offset_y: number,
        is_glow: boolean, type: string,
        knockout: boolean, strength: number,
        ratios: number[] | null = null,
        colors: number[] | null = null,
        alphas: number[] | null = null,
        color_r1: number = 0, color_g1: number = 0,
        color_b1: number = 0, color_a1: number = 0,
        color_r2: number = 0, color_g2: number = 0,
        color_b2: number = 0, color_a2: number = 0
    ): void {

        const manager: FrameBufferManager = this._$frameBufferManager;
        const isInner: boolean = type === "inner";

        const baseAttachment = manager.currentAttachment;
        const baseTexture = manager.getTextureFromCurrentAttachment();

        let lut: WebGLTexture | null = null;

        const isGradient: boolean = ratios !== null && colors !== null && alphas !== null;

        if (ratios !== null && colors !== null && alphas !== null) {
            lut = this
                ._$gradientLUT
                .generateForFilter(ratios, colors, alphas);
        }

        let targetTextureAttachment;
        if (isInner) {

            if (isGradient && lut) {

                manager
                    .textureManager
                    .bind02(texture, lut, true);

            } else {

                manager
                    .textureManager
                    .bind0(texture);

            }

        } else {

            targetTextureAttachment = this
                ._$frameBufferManager
                .createTextureAttachment(width, height);

            this._$bind(targetTextureAttachment);

            if (isGradient && lut) {

                manager
                    .textureManager
                    .bind012(texture, baseTexture, lut, true);

            } else {

                manager
                    .textureManager
                    .bind01(texture, baseTexture);

            }
        }

        const transformsBase: boolean  = !(isInner || type === "full" && knockout);
        const transformsBlur: boolean  = !(width === blur_width && height === blur_height && blur_offset_x === 0 && blur_offset_y === 0);
        const appliesStrength: boolean = !(strength === 1);

        const variants: FilterShaderVariantCollection = this
            ._$shaderList
            .filterShaderVariants;

        const shader: CanvasToWebGLShader = variants.getBitmapFilterShader(
            transformsBase, transformsBlur,
            is_glow, type, knockout,
            appliesStrength, isGradient
        );

        variants.setBitmapFilterUniform(
            shader.uniform, width, height,
            base_width, base_height, base_offset_x, base_offset_y,
            blur_width, blur_height, blur_offset_x, blur_offset_y,
            is_glow, strength,
            color_r1, color_g1, color_b1, color_a1,
            color_r2, color_g2, color_b2, color_a2,
            transformsBase, transformsBlur, appliesStrength, isGradient
        );

        if (!isInner) {

            this.blend.toOneZero();

        } else if (knockout) {

            this.blend.toSourceIn();

        } else {

            this.blend.toSourceAtop();

        }

        shader._$drawImage();

        if (!isInner) {
            manager
                .releaseAttachment(baseAttachment, true);
        }
    }

    /**
     * @param  {WebGLTexture} texture
     * @param  {array} matrix
     * @return {void}
     * @method
     * @public
     */
    _$applyColorMatrixFilter (
        texture: WebGLTexture,
        matrix: number[]
    ): void {

        this
            ._$frameBufferManager
            .textureManager
            .bind0(texture, true);

        const variants: FilterShaderVariantCollection = this
            ._$shaderList
            .filterShaderVariants;

        const shader = variants
            .getColorMatrixFilterShader();

        variants
            .setColorMatrixFilterUniform(
                shader.uniform, matrix
            );

        this.blend.reset();

        shader._$drawImage();
    }

    /**
     * @param  {WebGLTexture} texture
     * @param  {number}  matrix_x
     * @param  {number}  matrix_y
     * @param  {Float32Array}   matrix
     * @param  {number}  divisor
     * @param  {number}  bias
     * @param  {boolean} preserve_alpha
     * @param  {boolean} clamp
     * @param  {number}  color_r
     * @param  {number}  color_g
     * @param  {number}  color_b
     * @param  {number}  color_a
     * @return {void}
     * @method
     * @public
     */
    _$applyConvolutionFilter (
        texture: WebGLTexture,
        matrix_x: number, matrix_y: number,
        matrix: number[],
        divisor: number, bias: number,
        preserve_alpha: boolean, clamp: boolean,
        color_r: number, color_g: number,
        color_b: number, color_a: number
    ): void {

        const width: number  = texture.width;
        const height: number = texture.height;

        const targetTextureAttachment: AttachmentImpl = this
            ._$frameBufferManager
            .createTextureAttachment(width, height);

        this._$bind(targetTextureAttachment);

        this
            ._$frameBufferManager
            .textureManager
            .bind0(texture, true);

        const variants: FilterShaderVariantCollection = this
            ._$shaderList
            .filterShaderVariants;

        const shader = variants
            .getConvolutionFilterShader(
                matrix_x, matrix_y, preserve_alpha, clamp
            );

        variants.setConvolutionFilterUniform(
            shader.uniform,
            width, height, matrix, divisor, bias, clamp,
            color_r, color_g, color_b, color_a
        );

        this.blend.reset();

        shader._$drawImage();
    }

    /**
     * @param  {WebGLTexture} texture
     * @param  {HTMLImageElement} map
     * @param  {number} base_width
     * @param  {number} base_height
     * @param  {PointImpl}  [point=null]
     * @param  {number} component_x
     * @param  {number} component_y
     * @param  {number} scale_x
     * @param  {number} scale_y
     * @param  {string} mode
     * @param  {number} color_r
     * @param  {number} color_g
     * @param  {number} color_b
     * @param  {number} color_a
     * @return {void}
     * @method
     * @private
     */
    _$applyDisplacementMapFilter (
        texture: WebGLTexture,
        map: HTMLImageElement,
        base_width: number, base_height: number,
        point: PointImpl | null,
        component_x: number, component_y: number,
        scale_x: number, scale_y: number,
        mode: string,
        color_r: number, color_g: number,
        color_b: number, color_a: number
    ): void {

        const width: number  = texture.width;
        const height: number = texture.height;

        const targetTextureAttachment: AttachmentImpl = this
            ._$frameBufferManager
            .createTextureAttachment(width, height);

        this._$bind(targetTextureAttachment);

        if (!point) {
            point = { "x": 0, "y": 0 };
        }

        const mapTexture: WebGLTexture = this
            ._$frameBufferManager
            .createTextureFromImage(map);

        this
            ._$frameBufferManager
            .textureManager
            .bind01(texture, mapTexture);

        const variants: FilterShaderVariantCollection = this
            ._$shaderList
            .filterShaderVariants;

        const shader: CanvasToWebGLShader = variants
            .getDisplacementMapFilterShader(
                component_x, component_y, mode
            );

        variants.setDisplacementMapFilterUniform(
            shader.uniform, map.width, map.height, base_width, base_height,
            point.x, point.y, scale_x, scale_y, mode,
            color_r, color_g, color_b, color_a
        );

        this.blend.reset();

        shader._$drawImage();

        this
            ._$frameBufferManager
            .releaseTexture(mapTexture);
    }

    /**
     * @param  {BoundsImpl} position
     * @return {void}
     * @method
     * @private
     */
    _$startLayer (position: BoundsImpl): void
    {
        this._$positions.push(position);
        this._$blends.push(this._$isLayer);
        this._$isLayer = true;
    }

    /**
     * @return {void}
     * @method
     * @private
     */
    _$endLayer (): void
    {
        const bounds: BoundsImpl | void = this._$positions.pop();
        if (bounds) {
            $poolBoundsObject(bounds);
        }

        this._$isLayer = !!this._$blends.pop();
    }

    /**
     * @param  {number} width
     * @param  {number} height
     * @param  {boolean} [multisample=false]
     * @return {void}
     * @method
     * @private
     */
    _$saveAttachment (
        width: number, height: number,
        multisample: boolean = false
    ): void {

        this.drawInstacedArray();

        const manager: FrameBufferManager = this._$frameBufferManager;

        this
            ._$attachmentArray
            .push(manager.currentAttachment);

        this._$bind(
            manager.createCacheAttachment(width, height, multisample)
        );
    }

    /**
     * @param  {boolean} [release_texture = false]
     * @return {void}
     * @method
     * @private
     */
    _$restoreAttachment (release_texture: boolean = false): void
    {
        const manager: FrameBufferManager = this._$frameBufferManager;

        manager.releaseAttachment(
            manager.currentAttachment, release_texture
        );

        this._$bind(
            this._$attachmentArray.pop()
        );
    }

    /**
     * @return {object}
     * @method
     * @private
     */
    getCurrentPosition (): BoundsImpl
    {
        return this._$positions[this._$positions.length - 1];
    }

    /**
     * @description 最大テクスチャサイズを超えないスケール値を取得する
     * @param  {number} width
     * @param  {number} height
     * @return {number}
     * @method
     * @public
     */
    textureScale (width: number, height: number): number
    {
        const maxSize = $Math.max(width, height);
        if (maxSize > this._$maxTextureSize) {
            return this._$maxTextureSize / maxSize;
        }
        return 1;
    }
}
