import type { IAttachmentObject } from "./interface/IAttachmentObject";
import type { IBlendMode } from "./interface/IBlendMode";
import type { IBounds } from "./interface/IBounds";
import type { Node } from "@next2d/texture-packer";
import { execute as beginPath } from "./PathCommand/service/PathCommandBeginPathService";
import { execute as moveTo } from "./PathCommand/usecase/PathCommandMoveToUseCase";
import { execute as lineTo } from "./PathCommand/usecase/PathCommandLineToUseCase";
import { execute as quadraticCurveTo } from "./PathCommand/usecase/PathCommandQuadraticCurveToUseCase";
import { execute as closePath } from "./PathCommand/usecase/PathCommandClosePathUseCase";
import { execute as arc } from "./PathCommand/usecase/PathCommandArcUseCase";
import { execute as bezierCurveTo } from "./PathCommand/usecase/PathCommandBezierCurveToUseCase";
import { execute as contextUpdateBackgroundColorService } from "./Context/service/ContextUpdateBackgroundColorService";
import { execute as contextFillBackgroundColorService } from "./Context/service/ContextFillBackgroundColorService";
import { execute as contextResizeUseCase } from "./Context/usecase/ContextResizeUseCase";
import { execute as contextClearRectUseCase } from "./Context/usecase/ContextClearRectUseCase";
import { execute as contextBindUseCase } from "./Context/usecase/ContextBindUseCase";
import { execute as contextSaveService } from "./Context/service/ContextSaveService";
import { execute as contextRestoreService } from "./Context/service/ContextRestoreService";
import { execute as contextSetTransformService } from "./Context/service/ContextSetTransformService";
import { execute as contextTransformService } from "./Context/service/ContextTransformService";
import { execute as contextResetService } from "./Context/service/ContextResetService";
import { execute as contextResetStyleService } from "./Context/service/ContextResetStyleService";
import { execute as contextBeginNodeRenderingService } from "./Context/service/ContextBeginNodeRenderingService";
import { execute as contextEndNodeRenderingService } from "./Context/service/ContextEndNodeRenderingService";
import { execute as contextFillUseCase } from "./Context/usecase/ContextFillUseCase";
import { execute as contextGradientFillUseCase } from "./Context/usecase/ContextGradientFillUseCase";
import { execute as contextGradientStrokeUseCase } from "./Context/usecase/ContextGradientStrokeUseCase";
import { execute as contextUseGridService } from "./Context/service/ContextUseGridService";
import { execute as contextClipUseCase } from "./Context/usecase/ContextClipUseCase";
import { execute as atlasManagerCreateNodeService } from "./AtlasManager/service/AtlasManagerCreateNodeService";
import { execute as atlasManagerRemoveNodeService } from "./AtlasManager/service/AtlasManagerRemoveNodeService";
import { execute as blnedDrawDisplayObjectUseCase } from "./Blend/usecase/BlnedDrawDisplayObjectUseCase";
import { execute as blnedClearArraysInstancedUseCase } from "./Blend/usecase/BlnedClearArraysInstancedUseCase";
import { execute as blnedDrawArraysInstancedUseCase } from "./Blend/usecase/BlnedDrawArraysInstancedUseCase";
import { execute as vertexArrayObjectBootUseCase } from "./VertexArrayObject/usecase/VertexArrayObjectBootUseCase";
import { execute as frameBufferManagerTransferMainCanvasService } from "./FrameBufferManager/service/FrameBufferManagerTransferMainCanvasService";
import { execute as blendBootUseCase } from "./Blend/usecase/BlendBootUseCase";
import { execute as maskBeginMaskService } from "./Mask/service/MaskBeginMaskService";
import { execute as maskSetMaskBoundsService } from "./Mask/service/MaskSetMaskBoundsService";
import { execute as maskEndMaskService } from "./Mask/service/MaskEndMaskService";
import { execute as maskLeaveMaskUseCase } from "./Mask/usecase/MaskLeaveMaskUseCase";
import { execute as contextDrawPixelsUseCase } from "./Context/usecase/ContextDrawPixelsUseCase";
import { execute as contextDrawElementUseCase } from "./Context/usecase/ContextDrawElementUseCase";
import { execute as contextBitmapFillUseCase } from "./Context/usecase/ContextBitmapFillUseCase";
import { execute as contextBitmapStrokeUseCase } from "./Context/usecase/ContextBitmapStrokeUseCase";
import { execute as contextStrokeUseCase } from "./Context/usecase/ContextStrokeUseCase";
import { execute as contextApplyFilterUseCase } from "./Context/usecase/ContextApplyFilterUseCase";
import { execute as contextContainerBeginLayerUseCase } from "./Context/usecase/ContextContainerBeginLayerUseCase";
import { execute as contextContainerEndLayerUseCase } from "./Context/usecase/ContextContainerEndLayerUseCase";
import { execute as contextContainerDrawCachedFilterUseCase } from "./Context/usecase/ContextContainerDrawCachedFilterUseCase";
import { execute as contextUpdateTransferBoundsService } from "./Context/service/ContextUpdateTransferBoundsService";
import { execute as contextDrawFillUseCase } from "./Context/usecase/ContextDrawFillUseCase";
import { execute as contextCreateImageBitmapService } from "./Context/service/ContextCreateImageBitmapService";
import { $setGradientLUTGeneratorMaxLength } from "./Shader/GradientLUTGenerator";
import {
    $getAtlasAttachmentObject,
    $clearTransferBounds,
    $getAtlasTextureObject
} from "./AtlasManager";
import {
    $setReadFrameBuffer,
    $setDrawFrameBuffer,
    $currentAttachment,
    $setAtlasFrameBuffer,
    $setBitmapFrameBuffer
} from "./FrameBufferManager";
import {
    $setRenderMaxSize,
    $setWebGL2RenderingContext,
    $setSamples,
    $getFloat32Array9,
    $getArray,
    $setContext,
    $setDevicePixelRatio
} from "./WebGLUtil";

export class Context
{
    public readonly $stack: Float32Array[];
    public readonly $matrix: Float32Array;
    public $clearColorR: number;
    public $clearColorG: number;
    public $clearColorB: number;
    public $clearColorA: number;
    public $mainAttachmentObject: IAttachmentObject | null;
    public readonly $stackAttachmentObject: IAttachmentObject[];
    public globalAlpha: number;
    public globalCompositeOperation: IBlendMode;
    public imageSmoothingEnabled: boolean;
    public $fillStyle: Float32Array;
    public $strokeStyle: Float32Array;
    public readonly maskBounds: IBounds;
    public thickness: number;
    public caps: number;
    public joints: number;
    public miterLimit: number;
    public newDrawState: boolean = false;

    constructor (
        gl: WebGL2RenderingContext,
        samples: number,
        device_pixel_ratio: number = 1
    ) {

        $setWebGL2RenderingContext(gl);
        $setRenderMaxSize(gl.getParameter(gl.MAX_TEXTURE_SIZE));
        $setSamples(samples);
        $setDevicePixelRatio(device_pixel_ratio);

        this.$stack = $getArray();
        this.$stackAttachmentObject = $getArray();
        this.$matrix = $getFloat32Array9(1, 0, 0, 0, 1, 0, 0, 0, 1);

        // bakground color
        this.$clearColorR = 0;
        this.$clearColorG = 0;
        this.$clearColorB = 0;
        this.$clearColorA = 0;

        // stroke
        this.thickness  = 1;
        this.caps       = 0;
        this.joints     = 2;
        this.miterLimit = 0;

        // メインのアタッチメントオブジェクト
        this.$mainAttachmentObject = null;

        // グローバルアルファ、合成モード、イメージのスムージング設定
        this.globalAlpha              = 1;
        this.globalCompositeOperation = "normal";
        this.imageSmoothingEnabled    = false;

        // 塗りつぶしタイプ、ストロークタイプ
        this.$fillStyle   = new Float32Array([1, 1, 1, 1]);
        this.$strokeStyle = new Float32Array([1, 1, 1, 1]);

        // マスクの描画範囲
        this.maskBounds = {
            "xMin": 0,
            "yMin": 0,
            "xMax": 0,
            "yMax": 0
        };

        // WebTextureの設定
        gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

        // FrameBufferManagerの初期起動
        $setReadFrameBuffer(gl);
        $setDrawFrameBuffer(gl);
        $setAtlasFrameBuffer(gl, $getAtlasTextureObject());
        $setBitmapFrameBuffer(gl);

        // VertexArrayObjectの初期起動
        vertexArrayObjectBootUseCase(gl);

        // ブレンドモードを起動する
        blendBootUseCase();

        // グラデーションの最大長を設定
        $setGradientLUTGeneratorMaxLength(gl);

        // コンテキストをセット
        $setContext(this);
    }

    clearTransferBounds (): void
    {
        $clearTransferBounds();
    }

    updateBackgroundColor (red: number, green: number, blue: number, alpha: number): void
    {
        contextUpdateBackgroundColorService(this, red, green, blue, alpha);
    }

    fillBackgroundColor (): void
    {
        contextFillBackgroundColorService(
            this.$clearColorR,
            this.$clearColorG,
            this.$clearColorB,
            this.$clearColorA
        );
    }

    resize (width: number, height: number, cache_clear: boolean = true): void
    {
        contextResizeUseCase(this, width, height, cache_clear);
    }

    clearRect (x: number, y: number, w: number, h: number): void
    {
        contextClearRectUseCase(x, y, w, h);
    }

    bind (attachment_object: IAttachmentObject): void
    {
        contextBindUseCase(this, attachment_object);
    }

    save (): void
    {
        contextSaveService(this);
    }

    restore (): void
    {
        contextRestoreService(this);
    }

    setTransform (
        a: number, b: number, c: number,
        d: number, e: number, f: number
    ): void {
        contextSetTransformService(this.$matrix, a, b, c, d, e, f);
    }

    transform (
        a: number, b: number, c: number,
        d: number, e: number, f: number
    ): void {
        contextTransformService(this, a, b, c, d, e, f);
    }

    reset (): void
    {
        contextResetService(this);
    }

    beginPath (): void
    {
        // reset color style
        contextResetStyleService(this);

        // begin path
        beginPath();
    }

    moveTo (x: number, y: number): void
    {
        moveTo(x, y);
    }

    lineTo (x: number, y: number): void
    {
        lineTo(x, y);
    }

    quadraticCurveTo (cx: number, cy: number, x: number, y: number): void
    {
        quadraticCurveTo(cx, cy, x, y);
    }

    fillStyle (red: number, green: number, blue: number, alpha: number): void
    {
        this.$fillStyle[0] = red;
        this.$fillStyle[1] = green;
        this.$fillStyle[2] = blue;
        this.$fillStyle[3] = alpha;
    }

    strokeStyle (red: number, green: number, blue: number, alpha: number): void
    {
        this.$strokeStyle[0] = red;
        this.$strokeStyle[1] = green;
        this.$strokeStyle[2] = blue;
        this.$strokeStyle[3] = alpha;
    }

    closePath (): void
    {
        closePath();
    }

    arc (x: number, y: number, radius: number): void
    {
        arc(x, y, radius);
    }

    bezierCurveTo (cx1: number, cy1: number, cx2: number, cy2: number, x: number, y: number): void
    {
        bezierCurveTo(cx1, cy1, cx2, cy2, x, y);
    }

    fill (): void
    {
        contextFillUseCase("fill");
    }

    gradientFill (
        type: number,
        stops: number[],
        matrix: Float32Array,
        spread: number,
        interpolation: number,
        focal: number
    ): void {
        contextGradientFillUseCase(
            type, stops, matrix,
            spread, interpolation, focal
        );
    }

    bitmapFill (
        pixels: Uint8Array,
        matrix: Float32Array,
        width: number,
        height: number,
        repeat: boolean,
        smooth: boolean
    ): void {
        contextBitmapFillUseCase(
            pixels, matrix, width, height, repeat, smooth
        );
    }

    stroke (): void
    {
        contextStrokeUseCase();
    }

    gradientStroke (
        type: number,
        stops: number[],
        matrix: Float32Array,
        spread: number,
        interpolation: number,
        focal: number
    ): void {
        contextGradientStrokeUseCase(
            type, stops, matrix,
            spread, interpolation, focal
        );
    }

    bitmapStroke (
        pixels: Uint8Array,
        matrix: Float32Array,
        width: number,
        height: number,
        repeat: boolean,
        smooth: boolean
    ): void {
        contextBitmapStrokeUseCase(
            pixels, matrix, width, height, repeat, smooth
        );
    }

    clip (): void
    {
        contextClipUseCase();
    }

    get currentAttachmentObject (): IAttachmentObject | null
    {
        return $currentAttachment;
    }

    get atlasAttachmentObject (): IAttachmentObject
    {
        return $getAtlasAttachmentObject();
    }

    createNode (width: number, height: number): Node
    {
        return atlasManagerCreateNodeService(width, height);
    }

    removeNode (node: Node): void
    {
        atlasManagerRemoveNodeService(node);
    }

    beginNodeRendering (node: Node): void
    {
        this.newDrawState = true;
        contextUpdateTransferBoundsService(node);
        contextBeginNodeRenderingService(node.x, node.y, node.w, node.h);
    }

    endNodeRendering (): void
    {
        contextEndNodeRenderingService();
    }

    drawFill (): void
    {
        contextDrawFillUseCase();
    }

    drawDisplayObject (
        node: Node,
        x_min: number,
        y_min: number,
        x_max: number,
        y_max: number,
        color_transform: Float32Array
    ): void {
        contextUpdateTransferBoundsService(node);
        blnedDrawDisplayObjectUseCase(
            node, x_min, y_min, x_max, y_max, color_transform
        );
    }

    drawArraysInstanced (): void
    {
        blnedDrawArraysInstancedUseCase();
    }

    clearArraysInstanced (): void
    {
        blnedClearArraysInstancedUseCase();
    }

    transferMainCanvas (): void
    {
        frameBufferManagerTransferMainCanvasService();
    }

    drawPixels (node: Node, pixels: Uint8Array): void
    {
        contextDrawPixelsUseCase(node, pixels);
    }

    drawElement (node: Node, element: OffscreenCanvas | ImageBitmap, _flipY: boolean = false): void
    {
        contextDrawElementUseCase(node, element);
    }

    beginMask (): void
    {
        maskBeginMaskService();
    }

    setMaskBounds (
        x_min: number,
        y_min: number,
        x_max: number,
        y_max: number
    ): void {
        maskSetMaskBoundsService(x_min, y_min, x_max, y_max);
    }

    endMask (): void
    {
        maskEndMaskService();
    }

    leaveMask (): void
    {
        this.drawArraysInstanced();
        maskLeaveMaskUseCase();
    }

    useGrid (grid_data: Float32Array | null): void
    {
        contextUseGridService(grid_data);
    }

    applyFilter (
        node: Node,
        unique_key: string,
        updated: boolean,
        width: number,
        height: number,
        is_bitmap: boolean,
        matrix: Float32Array,
        color_transform: Float32Array,
        blend_mode: IBlendMode,
        bounds: Float32Array,
        params: Float32Array
    ): void {
        this.drawArraysInstanced();
        contextApplyFilterUseCase(
            node, unique_key, updated,
            width, height, is_bitmap,
            matrix, color_transform, blend_mode,
            bounds, params
        );
    }

    containerBeginLayer (width: number, height: number): void
    {
        this.drawArraysInstanced();
        contextContainerBeginLayerUseCase(width, height);
    }

    containerEndLayer (
        blend_mode: IBlendMode,
        matrix: Float32Array,
        color_transform: Float32Array | null,
        use_filter: boolean,
        filter_bounds: Float32Array | null,
        filter_params: Float32Array | null,
        unique_key: string,
        filter_key: string
    ): void {
        contextContainerEndLayerUseCase(
            blend_mode, matrix, color_transform,
            use_filter, filter_bounds, filter_params,
            unique_key, filter_key
        );
    }

    containerDrawCachedFilter (
        blend_mode: IBlendMode,
        matrix: Float32Array,
        color_transform: Float32Array,
        filter_bounds: Float32Array,
        unique_key: string,
        filter_key: string
    ): void {
        contextContainerDrawCachedFilterUseCase(
            blend_mode, matrix, color_transform,
            filter_bounds, unique_key, filter_key
        );
    }

    async createImageBitmap (width: number, height: number): Promise<ImageBitmap>
    {
        return await contextCreateImageBitmapService(width, height);
    }
}
