import type { IAttachmentObject } from "./interface/IAttachmentObject";
import type { IBlendMode } from "./interface/IBlendMode";
import type { IBounds } from "./interface/IBounds";
import type { Node } from "@next2d/texture-packer";
import { TexturePacker } from "@next2d/texture-packer";
import { $cacheStore } from "@next2d/cache";
import { WebGPUUtil, $setContext } from "./WebGPUUtil";
import { PathCommand } from "./PathCommand";
import { BufferManager } from "./BufferManager";
import { TextureManager } from "./TextureManager";
import { FrameBufferManager } from "./FrameBufferManager";
import { PipelineManager } from "./Shader/PipelineManager";
import {
    $rootNodes,
    $resetAtlas,
    $getActiveAtlasIndex,
    $setActiveAtlasIndex,
    $setAtlasCreator,
    $getAtlasAttachmentObject,
    $getAtlasAttachmentObjectByIndex
} from "./AtlasManager";
import { addDisplayObjectToInstanceArray, getInstancedShaderManager } from "./Blend/BlendInstancedManager";
import { execute as maskBeginMaskService } from "./Mask/service/MaskBeginMaskService";
import { execute as maskSetMaskBoundsService } from "./Mask/service/MaskSetMaskBoundsService";
import { execute as maskEndMaskService } from "./Mask/service/MaskEndMaskService";
import { execute as maskLeaveMaskUseCase } from "./Mask/usecase/MaskLeaveMaskUseCase";
import {
    $isMaskTestEnabled,
    $isMaskDrawing,
    $getMaskStencilReference,
    $resetMaskState
} from "./Mask";
import { execute as meshFillGenerateUseCase } from "./Mesh/usecase/MeshFillGenerateUseCase";
import { generateStrokeMesh } from "./Mesh/usecase/MeshStrokeGenerateUseCase";
import {
    $gridDataMap,
    $fillBufferIndex,
    $terminateGrid
} from "./Grid";
import {
    $setGradientLUTDevice,
    $clearGradientAttachmentObjects,
    $cleanupLUTCache,
    $clearLUTCache
} from "./Gradient/GradientLUTCache";
import {
    $releaseFillTexture,
    $acquireRenderTexture,
    $releaseRenderTexture,
    $clearFillTexturePool,
    $getOrCreateView
} from "./FillTexturePool";
import {
    $setFilterGradientLUTDevice,
    $clearFilterGradientAttachment
} from "./Filter/FilterGradientLUTCache";

// Context services
import { execute as contextFillWithStencilService } from "./Context/service/ContextFillWithStencilService";
import { execute as contextFillWithStencilMainService } from "./Context/service/ContextFillWithStencilMainService";
import { execute as contextFillSimpleService } from "./Context/service/ContextFillSimpleService";

// Context usecases
import { execute as contextGradientFillUseCase } from "./Context/usecase/ContextGradientFillUseCase";
import { execute as contextBitmapFillUseCase } from "./Context/usecase/ContextBitmapFillUseCase";
import { execute as contextGradientStrokeUseCase } from "./Context/usecase/ContextGradientStrokeUseCase";
import { execute as contextBitmapStrokeUseCase } from "./Context/usecase/ContextBitmapStrokeUseCase";
import { execute as contextClipUseCase } from "./Context/usecase/ContextClipUseCase";
import { execute as contextDrawArraysInstancedUseCase } from "./Context/usecase/ContextDrawArraysInstancedUseCase";
import { execute as contextDrawIndirectUseCase } from "./Context/usecase/ContextDrawIndirectUseCase";
import { execute as contextProcessComplexBlendQueueUseCase } from "./Context/usecase/ContextProcessComplexBlendQueueUseCase";
import { execute as contextApplyFilterUseCase } from "./Context/usecase/ContextApplyFilterUseCase";
import { execute as contextContainerEndLayerUseCase } from "./Context/usecase/ContextContainerEndLayerUseCase";

/**
 * @description スワップチェーン転送用のIdentity UV定数: scale=(1,1), offset=(0,0)
 *              Identity UV constant for swap-chain transfer: scale=(1,1), offset=(0,0)
 */
const $IDENTITY_UV = new Float32Array([1.0, 1.0, 0.0, 0.0]);

/**
 * @description save()/restore()用の Float32Array プール
 *              Float32Array pool for save()/restore() operations
 */
const $matrixPool: Float32Array[] = [];

/**
 * @description leaveMask() 用フルスクリーンメッシュ定数
 *              Full-screen mesh constant for leaveMask()
 */
const $FULLSCREEN_MESH = new Float32Array([
    // Triangle 1: (0,0), (1,0), (0,1)
    0, 0, 0.5, 0.5, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1,
    1, 0, 0.5, 0.5, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1,
    0, 1, 0.5, 0.5, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1,
    // Triangle 2: (1,0), (1,1), (0,1)
    1, 0, 0.5, 0.5, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1,
    1, 1, 0.5, 0.5, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1,
    0, 1, 0.5, 0.5, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1
]);

/**
 * @description clearNodeArea() 用クワッド頂点定数
 *              Quad vertex constant for clearNodeArea()
 */
const $QUAD_VERTICES = new Float32Array([
    0, 0,  // 左上
    1, 0,  // 右上
    0, 1,  // 左下
    1, 0,  // 右上
    1, 1,  // 右下
    0, 1   // 左下
]);

/**
 * @description containerDrawCachedFilter() 用 CT uniform プリアロケート
 *              Pre-allocated CT uniform for containerDrawCachedFilter()
 */
const $ctUniform8 = new Float32Array(8);

/**
 * @description copyTempToAtlasNode() 用 uniform プリアロケート (scale=1,-1, offset=0,1)
 *              Pre-allocated uniform for atlas node copy with Y-flip
 */
const $atlasNodeCopyUniform = new Float32Array([1, -1, 0, 1]);

/**
 * @description fill() 用 uniform プリアロケート (color + matrix = 16 floats = 64 bytes)
 *              Pre-allocated uniform for fill() (color + matrix = 16 floats = 64 bytes)
 */
const $fillUniform16 = new Float32Array(16);

// present() 用 Static BindGroup キャッシュ
let $presentBindGroup: GPUBindGroup | null = null;
let $presentBindGroupView: GPUTextureView | null = null;
let $presentUniformBuffer: GPUBuffer | null = null;

// present() 用 RenderPassDescriptor プリアロケート
const $presentClearValue: GPUColorDict = { "r": 0, "g": 0, "b": 0, "a": 0 };
const $presentColorAttachment: GPURenderPassColorAttachment = {
    "view": null as unknown as GPUTextureView,
    "clearValue": $presentClearValue,
    "loadOp": "clear" as GPULoadOp,
    "storeOp": "store" as GPUStoreOp
};
const $presentDescriptor: GPURenderPassDescriptor = {
    "colorAttachments": [$presentColorAttachment]
};

// BindGroup entries 事前割り当て
const $entries3: GPUBindGroupEntry[] = [
    { "binding": 0, "resource": { "buffer": null as unknown as GPUBuffer } },
    { "binding": 1, "resource": null as unknown as GPUSampler },
    { "binding": 2, "resource": null as unknown as GPUTextureView }
];

// fillBackgroundColor() 用 RenderPassDescriptor プリアロケート
const $bgClearValue: GPUColorDict = { "r": 0, "g": 0, "b": 0, "a": 0 };
const $bgColorAttachment: GPURenderPassColorAttachment = {
    "view": null as unknown as GPUTextureView,
    "clearValue": $bgClearValue,
    "loadOp": "clear" as GPULoadOp,
    "storeOp": "store" as GPUStoreOp,
    "resolveTarget": undefined
};
const $bgStencilAttachment: GPURenderPassDepthStencilAttachment = {
    "view": null as unknown as GPUTextureView,
    "stencilClearValue": 0,
    "stencilLoadOp": "clear" as GPULoadOp,
    "stencilStoreOp": "store" as GPUStoreOp
};
const $bgDescriptor: GPURenderPassDescriptor = {
    "colorAttachments": [$bgColorAttachment]
};

// MSAA描画用 RenderPassDescriptor プリアロケート
const $msaaColorAttachment: GPURenderPassColorAttachment = {
    "view": null as unknown as GPUTextureView,
    "resolveTarget": undefined,
    "loadOp": "load" as GPULoadOp,
    "storeOp": "store" as GPUStoreOp
};
const $msaaStencilAttachment: GPURenderPassDepthStencilAttachment = {
    "view": null as unknown as GPUTextureView,
    "stencilLoadOp": "load" as GPULoadOp,
    "stencilStoreOp": "store" as GPUStoreOp
};
const $msaaDescriptor: GPURenderPassDescriptor = {
    "colorAttachments": [$msaaColorAttachment]
};

/**
 * @description WebGPU版、Next2Dのコンテキスト
 *              WebGPU version, Next2D context
 *
 * @class
 */
export class Context
{
    /** @description 変換行列スタック / Transform matrix stack */
    public readonly $stack: Float32Array[];
    /** @description 現在の2D変換行列 / Current 2D transform matrix */
    public readonly $matrix: Float32Array;
    /** @description 背景クリア色R / Background clear color R */
    public $clearColorR: number;
    /** @description 背景クリア色G / Background clear color G */
    public $clearColorG: number;
    /** @description 背景クリア色B / Background clear color B */
    public $clearColorB: number;
    /** @description 背景クリア色A / Background clear color A */
    public $clearColorA: number;
    /** @description メインアタッチメントオブジェクト / Main attachment object */
    public $mainAttachmentObject: IAttachmentObject | null;
    /** @description アタッチメントオブジェクトのスタック / Attachment object stack */
    public readonly $stackAttachmentObject: IAttachmentObject[];
    /** @description グローバルアルファ値 / Global alpha value */
    public globalAlpha: number;
    /** @description グローバル合成操作 / Global composite operation */
    public globalCompositeOperation: IBlendMode;
    /** @description 画像スムージングの有効/無効 / Whether image smoothing is enabled */
    public imageSmoothingEnabled: boolean;
    /** @description 塗りつぶしスタイル / Fill style color */
    public $fillStyle: Float32Array;
    /** @description 線スタイル / Stroke style color */
    public $strokeStyle: Float32Array;
    /** @description マスク描画範囲 / Mask drawing bounds */
    public readonly maskBounds: IBounds;
    /** @description 線の太さ / Line thickness */
    public thickness: number;
    /** @description 線端の形状 / Line cap style */
    public caps: number;
    /** @description 線の結合スタイル / Line joint style */
    public joints: number;
    /** @description マイターリミット / Miter limit */
    public miterLimit: number;

    /** @description GPUデバイス / GPU device instance */
    private device: GPUDevice;
    /** @description GPUキャンバスコンテキスト / GPU canvas context */
    private canvasContext: GPUCanvasContext;
    /** @description 優先テクスチャフォーマット / Preferred texture format */
    private preferredFormat: GPUTextureFormat;
    /** @description コマンドエンコーダー / Command encoder */
    private commandEncoder: GPUCommandEncoder | null = null;
    /** @description レンダーパスエンコーダー / Render pass encoder */
    private renderPassEncoder: GPURenderPassEncoder | null = null;

    /** @description メインキャンバステクスチャ（最終表示用、フレームごとに1回取得） / Main canvas texture (for final display, acquired once per frame) */
    private mainTexture: GPUTexture | null = null;
    /** @description メインキャンバステクスチャビュー / Main canvas texture view */
    private mainTextureView: GPUTextureView | null = null;
    /** @description フレーム開始済みフラグ / Whether the frame has been started */
    private frameStarted: boolean = false;

    /** @description フレームごとの一時テクスチャ（endFrame()でdestroy） / Per-frame temporary textures (destroyed in endFrame()) */
    private frameTextures: GPUTexture[] = [];

    /** @description フレームごとのプール管理テクスチャ（endFrame()でプールに返却） / Per-frame pooled textures (returned to pool in endFrame()) */
    private pooledTextures: GPUTexture[] = [];

    /** @description フレームごとのレンダーテクスチャプール管理（endFrame()でプールに返却） / Per-frame render texture pool (returned to pool in endFrame()) */
    private pooledRenderTextures: GPUTexture[] = [];

    /** @description 現在のレンダーターゲット（メインまたはアトラス） / Current render target (could be main or atlas) */
    private currentRenderTarget: GPUTextureView | null = null;

    /** @description 現在のビューポート幅（アトラス描画時はアトラスサイズ） / Current viewport width (atlas size during atlas rendering) */
    private viewportWidth: number = 0;
    /** @description 現在のビューポート高さ（アトラス描画時はアトラスサイズ） / Current viewport height (atlas size during atlas rendering) */
    private viewportHeight: number = 0;

    /** @description パスコマンド / Path command handler */
    private pathCommand: PathCommand;
    /** @description バッファマネージャー / Buffer manager */
    private bufferManager: BufferManager;
    /** @description テクスチャマネージャー / Texture manager */
    private textureManager: TextureManager;
    /** @description フレームバッファマネージャー / Frame buffer manager */
    private frameBufferManager: FrameBufferManager;
    /** @description パイプラインマネージャー / Pipeline manager */
    private pipelineManager: PipelineManager;

    /** @description 新しい描画状態フラグ / New draw state flag */
    public newDrawState: boolean = false;

    /** @description cacheAsBitmap用の保留中アトラスノードスタック / Pending atlas nodes stack for cacheAsBitmap */
    private readonly _pendingAtlasNodes: Node[] = [];

    /** @description コンテナレイヤースタック（フィルター/ブレンド用） / Container layer stack (for filter/blend) */
    private readonly $containerLayerStack: IAttachmentObject[] = [];
    /** @description コンテナレイヤーのコンテンツサイズ / Container layer content sizes */
    private containerLayerContentSizes: { width: number; height: number }[] = [];

    /** @description マスク描画モードフラグ（beginMask〜endMask間でtrue） / Mask drawing mode flag (true between beginMask and endMask) */
    private inMaskMode: boolean = false;

    /** @description ノード領域クリア済みフラグ（beginNodeRendering〜endNodeRendering間で使用） / Node area cleared flag (used between beginNodeRendering and endNodeRendering) */
    private nodeAreaCleared: boolean = false;

    /** @description 現在のノードのシザー範囲（クリア後に戻すため） / Current node scissor rect (to restore after clearing) */
    private currentNodeScissor: { x: number; y: number; w: number; h: number } | null = null;

    /** @description アトラスレンダーパス統合: 同一アトラスへの連続描画でパスを再利用 / Atlas render pass integration: reuse pass for consecutive draws to the same atlas */
    private nodeRenderPassAtlasIndex: number = -1;

    /** @description Dynamic Uniform BindGroup（fill/stencilパイプライン共有、フレームごとに1回作成） / Dynamic Uniform BindGroup (shared by fill/stencil pipelines, created once per frame) */
    private fillDynamicBindGroup: GPUBindGroup | null = null;
    /** @description Dynamic Uniform BindGroupのバッファ / Dynamic Uniform BindGroup buffer */
    private fillDynamicBindGroupBuffer: GPUBuffer | null = null;

    /** @description clearNodeArea() 用頂点バッファキャッシュ / Vertex buffer cache for clearNodeArea() */
    private nodeClearQuadBuffer: GPUBuffer | null = null;

    /** @description Storage Buffer + Indirect Drawing を使用するかどうか / Whether to use Storage Buffer + Indirect Drawing */
    private useOptimizedInstancing: boolean = true;

    /** @description リサイズ後にcanvasContextの再設定が必要かどうか / Whether canvasContext reconfiguration is needed after resize */
    private $needsReconfigure: boolean = false;

    /** @description Hot Path 用の事前割り当てバッファ / Pre-allocated buffer for hot path */
    private readonly $uniformData8 = new Float32Array(8);
    /** @description Hot Path 用の事前割り当てシザーレクト / Pre-allocated scissor rect for hot path */
    private readonly $scissorRect: { "x": number; "y": number; "w": number; "h": number } = { "x": 0, "y": 0, "w": 0, "h": 0 };

    /** @description フィルター/コンテナレイヤー用のプリアロケートされた設定オブジェクト / Pre-allocated config object for filter/container layers */
    private readonly $filterConfig: {
        device: GPUDevice;
        commandEncoder: GPUCommandEncoder;
        bufferManager: BufferManager;
        frameBufferManager: FrameBufferManager;
        pipelineManager: PipelineManager;
        textureManager: TextureManager;
        mainAttachment?: IAttachmentObject;
        frameTextures: GPUTexture[];
    };

    /**
     * @description WebGPUコンテキストを初期化する
     *              Initialize the WebGPU context
     *
     * @param  {GPUDevice} device - GPUデバイス / GPU device instance
     * @param  {GPUCanvasContext} canvas_context - GPUキャンバスコンテキスト / GPU canvas context
     * @param  {GPUTextureFormat} preferred_format - 優先テクスチャフォーマット / Preferred texture format
     * @param  {number} device_pixel_ratio - デバイスピクセル比 / Device pixel ratio
     */
    constructor (
        device: GPUDevice,
        canvas_context: GPUCanvasContext,
        preferred_format: GPUTextureFormat,
        device_pixel_ratio: number = 1
    ) {
        this.device = device;
        this.canvasContext = canvas_context;
        this.preferredFormat = preferred_format;

        WebGPUUtil.setDevice(device);
        WebGPUUtil.setDevicePixelRatio(device_pixel_ratio);

        // Set render max size same as WebGL (half of max texture size, minimum 2048)
        const maxTextureSize = device.limits.maxTextureDimension2D;
        const renderMaxSize = Math.max(2048, maxTextureSize / 2);
        WebGPUUtil.setRenderMaxSize(renderMaxSize);

        this.$stack = WebGPUUtil.createArray();
        this.$stackAttachmentObject = WebGPUUtil.createArray();
        this.$matrix = WebGPUUtil.createFloat32Array(9);
        this.$matrix.set([1, 0, 0, 0, 1, 0, 0, 0, 1]);

        this.$clearColorR = 0;
        this.$clearColorG = 0;
        this.$clearColorB = 0;
        this.$clearColorA = 0;

        this.thickness  = 1;
        this.caps       = 0;
        this.joints     = 2;
        this.miterLimit = 0;

        this.$mainAttachmentObject = null;

        this.globalAlpha              = 1;
        this.globalCompositeOperation = "normal";
        this.imageSmoothingEnabled    = false;

        this.$fillStyle   = new Float32Array([1, 1, 1, 1]);
        this.$strokeStyle = new Float32Array([1, 1, 1, 1]);

        this.maskBounds = {
            "xMin": 0,
            "yMin": 0,
            "xMax": 0,
            "yMax": 0
        };

        canvas_context.configure({
            "device": device,
            "format": preferred_format,
            "alphaMode": "premultiplied"
        });

        // 初期ビューポートサイズをキャンバスサイズに設定
        this.viewportWidth = canvas_context.canvas.width;
        this.viewportHeight = canvas_context.canvas.height;

        this.pathCommand = new PathCommand();
        this.bufferManager = new BufferManager(device);
        this.textureManager = new TextureManager(device);
        this.frameBufferManager = new FrameBufferManager(device, preferred_format);
        this.pipelineManager = new PipelineManager(device, preferred_format);
        // 遅延パイプライン群を即座に先行作成（初回アクセス時のレイテンシ解消）
        this.pipelineManager.preloadLazyGroups();

        // グラデーションLUT共有アタッチメントにGPUDeviceを設定
        $setGradientLUTDevice(device);
        $setFilterGradientLUTDevice(device);

        // アトラス生成関数を登録（複数アトラス対応）
        $setAtlasCreator((index: number): IAttachmentObject => {
            const maxSize = WebGPUUtil.getRenderMaxSize();
            return this.frameBufferManager.createAttachment(
                `atlas_${index}`,
                maxSize,
                maxSize,
                false,
                true
            );
        });

        // フィルター/コンテナレイヤー用の設定オブジェクトを事前割り当て
        this.$filterConfig = {
            "device": this.device,
            "commandEncoder": null as unknown as GPUCommandEncoder,
            "bufferManager": this.bufferManager,
            "frameBufferManager": this.frameBufferManager,
            "pipelineManager": this.pipelineManager,
            "textureManager": this.textureManager,
            "frameTextures": this.frameTextures
        };

        // コンテキストをグローバル変数にセット
        $setContext(this);
    }

    /**
     * @description 転送範囲をリセット（フレーム開始）
     *              Reset transfer bounds (frame start)
     *
     * @return {void}
     */
    clearTransferBounds (): void
    {
        // フレーム開始時に呼ばれる
        // テクスチャを取得してフレームを開始
        this.beginFrame();
    }

    /**
     * @description 背景色を更新
     *              Update the background color
     *
     * @param  {number} red   - 赤色成分 / Red component
     * @param  {number} green - 緑色成分 / Green component
     * @param  {number} blue  - 青色成分 / Blue component
     * @param  {number} alpha - アルファ成分 / Alpha component
     * @return {void}
     */
    updateBackgroundColor (red: number, green: number, blue: number, alpha: number): void
    {
        this.$clearColorR = red;
        this.$clearColorG = green;
        this.$clearColorB = blue;
        this.$clearColorA = alpha;
    }

    /**
     * @description 背景色で塗りつぶす（メインアタッチメント）
     *              Fill with background color (main attachment)
     *
     * @return {void}
     */
    fillBackgroundColor (): void
    {
        // メインアタッチメントがない場合はスキップ
        if (!this.$mainAttachmentObject || !this.$mainAttachmentObject.texture) {
            return;
        }

        // フレームが開始されていない場合は開始
        if (!this.frameStarted) {
            this.beginFrame();
        }

        // 既存のレンダーパスを終了
        if (this.renderPassEncoder) {
            this.renderPassEncoder.end();
            this.renderPassEncoder = null;
        }

        // コマンドエンコーダーを確保
        this.ensureCommandEncoder();

        // メインアタッチメントにステンシルがある場合はステンシル付きレンダーパスを使用
        // MSAA有効時はmsaaTextureをクリアしresolveTargetで非MSAAテクスチャにも反映
        const clearUseMsaa = this.$mainAttachmentObject.msaa && this.$mainAttachmentObject.msaaTexture?.view;

        $bgColorAttachment.view = clearUseMsaa
            ? this.$mainAttachmentObject.msaaTexture!.view
            : this.$mainAttachmentObject.texture.view;
        $bgColorAttachment.resolveTarget = clearUseMsaa
            ? this.$mainAttachmentObject.texture.view : undefined;
        $bgClearValue.r = this.$clearColorR;
        $bgClearValue.g = this.$clearColorG;
        $bgClearValue.b = this.$clearColorB;
        $bgClearValue.a = this.$clearColorA;

        // ステンシルバッファもクリア
        const clearStencilView = clearUseMsaa && this.$mainAttachmentObject.msaaStencil?.view
            ? this.$mainAttachmentObject.msaaStencil.view
            : this.$mainAttachmentObject.stencil?.view;
        if (clearStencilView) {
            $bgStencilAttachment.view = clearStencilView;
            $bgDescriptor.depthStencilAttachment = $bgStencilAttachment;
        } else {
            $bgDescriptor.depthStencilAttachment = undefined;
        }

        // 背景クリア用のレンダーパスを開始して即座に終了
        this.renderPassEncoder = this.commandEncoder!.beginRenderPass($bgDescriptor);
        this.renderPassEncoder.end();
        this.renderPassEncoder = null;
    }

    /**
     * @description メインcanvasのサイズを変更
     *              Resize the main canvas
     *
     * @param  {number}  width       - 新しい幅 / New width
     * @param  {number}  height      - 新しい高さ / New height
     * @param  {boolean} cache_clear - キャッシュをクリアするか / Whether to clear cache
     * @return {void}
     */
    resize (width: number, height: number, cache_clear: boolean = true): void
    {
        // インスタンス配列をクリア（WebGL版と同じ）
        this.clearArraysInstanced();

        // フレームごとの一時テクスチャをクリア
        for (const texture of this.frameTextures) {
            texture.destroy();
        }
        this.frameTextures.length = 0;

        // プール管理テクスチャをプールに返却し、プール自体もクリア
        for (const texture of this.pooledTextures) {
            $releaseFillTexture(texture);
        }
        this.pooledTextures.length = 0;
        for (const texture of this.pooledRenderTextures) {
            $releaseRenderTexture(texture);
        }
        this.pooledRenderTextures.length = 0;
        $clearFillTexturePool();

        // フレーム状態をリセット（リサイズ中は新しいフレームを開始できるようにする）
        this.frameStarted = false;
        this.commandEncoder = null;
        this.renderPassEncoder = null;
        this.currentRenderTarget = null;

        // マスク状態をリセット
        $resetMaskState();

        // キャンバスのサイズ更新は$resizeComplete()に任せる
        // WebGPUではcanvas.width/height設定でコンテキストが暗黙的にunconfigureされるため、
        // 描画フレーム開始前に$resizeComplete()→configure()→getCurrentTexture()の順で実行する

        // WebGL版と同じ: スタックにあるアタッチメントも解放
        if (this.$stackAttachmentObject.length) {
            for (let idx = 0; idx < this.$stackAttachmentObject.length; ++idx) {
                const attachmentObject = this.$stackAttachmentObject[idx];
                if (!attachmentObject) {
                    continue;
                }
                // アタッチメントのリソースを直接解放
                // Note: スタック内のアタッチメントは名前で管理されていないため、
                // リソースを直接破棄する
                if (attachmentObject.texture) {
                    attachmentObject.texture.resource.destroy();
                }
                if (attachmentObject.stencil) {
                    attachmentObject.stencil.resource.destroy();
                }
                if (attachmentObject.msaaTexture) {
                    attachmentObject.msaaTexture.resource.destroy();
                }
                if (attachmentObject.msaaStencil) {
                    attachmentObject.msaaStencil.resource.destroy();
                }
            }
            this.$stackAttachmentObject.length = 0;
        }

        // 既存のメインアタッチメントを破棄
        if (this.$mainAttachmentObject) {
            this.frameBufferManager.destroyAttachment("main");
        }

        // 共有アタッチメントをクリア
        if (cache_clear) {
            $clearGradientAttachmentObjects();
            $clearLUTCache();
            $clearFilterGradientAttachment();
            // アトラスのパッキングデータをリセット（WebGL版と同じ）
            $resetAtlas();
            // FrameBufferManagerのアトラステクスチャを再作成（古いコンテンツをクリア）
            // ステンシルバッファを有効にする（2パスステンシルフィル用）
            this.frameBufferManager.destroyAttachment("atlas");
            this.frameBufferManager.createAttachment("atlas", 4096, 4096, false, true);
        }

        // アンバインド（WebGL版と同じ）
        this.frameBufferManager.setCurrentAttachment(null);

        // canvasContextの再設定はensureMainTexture()で行う
        // $resizeComplete()でcanvas.width/heightが設定された後にconfigure()→getCurrentTexture()を実行するため
        this.$needsReconfigure = true;

        // リサイズ時にスワップチェーンテクスチャをリセット
        // 古いテクスチャ参照を解放して、次のフレームで新しいサイズのテクスチャを取得
        this.mainTexture = null;
        this.mainTextureView = null;

        // メインアタッチメントを作成（MSAA + ステンシル付き、マスク描画用）
        // WebGL版と同じ: $mainAttachmentObject = frameBufferManagerGetAttachmentObjectUseCase(width, height, true)
        // msaa=true でMSAAを有効化（曲線のアンチエイリアス品質向上のため）
        // mask=true でステンシルバッファを有効化
        // グラデーション塗りつぶしの中抜き描画（hollow shape）にも必要
        this.$mainAttachmentObject = this.frameBufferManager.createAttachment(
            "main", width, height, true, true
        );

        // メインアタッチメントをバインド
        this.bind(this.$mainAttachmentObject);
    }

    /**
     * @description 現在の2D変換行列を保存
     *              Save the current 2D transform matrix
     *
     * @return {void}
     */
    save (): void
    {
        const matrix = $matrixPool.length > 0 ? $matrixPool.pop()! : new Float32Array(9);
        matrix.set(this.$matrix);
        this.$stack.push(matrix);
    }

    /**
     * @description 2D変換行列を復元
     *              Restore the 2D transform matrix
     *
     * @return {void}
     */
    restore (): void
    {
        const matrix = this.$stack.pop();
        if (matrix) {
            this.$matrix.set(matrix);
            $matrixPool.push(matrix);
        }
    }

    /**
     * @description 2D変換行列を設定
     *              Set the 2D transform matrix
     *
     * @param  {number} a - 水平スケール / Horizontal scale
     * @param  {number} b - 垂直スキュー / Vertical skew
     * @param  {number} c - 水平スキュー / Horizontal skew
     * @param  {number} d - 垂直スケール / Vertical scale
     * @param  {number} e - 水平移動 / Horizontal translation
     * @param  {number} f - 垂直移動 / Vertical translation
     * @return {void}
     */
    setTransform (
        a: number, b: number, c: number,
        d: number, e: number, f: number
    ): void {
        this.$matrix[0] = a;
        this.$matrix[1] = b;
        this.$matrix[3] = c;
        this.$matrix[4] = d;
        this.$matrix[6] = e;
        this.$matrix[7] = f;
    }

    /**
     * @description 現在の2D変換行列に対して乗算を行います
     *              Multiply the current 2D transform matrix
     *
     * @param  {number} a - 水平スケール / Horizontal scale
     * @param  {number} b - 垂直スキュー / Vertical skew
     * @param  {number} c - 水平スキュー / Horizontal skew
     * @param  {number} d - 垂直スケール / Vertical scale
     * @param  {number} e - 水平移動 / Horizontal translation
     * @param  {number} f - 垂直移動 / Vertical translation
     * @return {void}
     */
    transform (
        a: number, b: number, c: number,
        d: number, e: number, f: number
    ): void {
        const m = this.$matrix;
        const m0 = m[0], m1 = m[1], m3 = m[3], m4 = m[4], m6 = m[6], m7 = m[7];

        m[0] = a * m0 + b * m3;
        m[1] = a * m1 + b * m4;
        m[3] = c * m0 + d * m3;
        m[4] = c * m1 + d * m4;
        m[6] = e * m0 + f * m3 + m6;
        m[7] = e * m1 + f * m4 + m7;
    }

    /**
     * @description コンテキストの値を初期化する
     *              Reset all context values to their initial state
     *
     * @return {void}
     */
    reset (): void
    {
        this.$matrix.set([1, 0, 0, 0, 1, 0, 0, 0, 1]);
        this.$stack.length = 0;
        this.$stackAttachmentObject.length = 0;
        this.globalAlpha = 1;
        this.globalCompositeOperation = "normal";
        this.imageSmoothingEnabled = false;
    }

    /**
     * @description パスを開始
     *              Begin a new path
     *
     * @return {void}
     */
    beginPath (): void
    {
        this.pathCommand.beginPath();
    }

    /**
     * @description パスを移動
     *              Move the path to the specified point
     *
     * @param  {number} x - X座標 / X coordinate
     * @param  {number} y - Y座標 / Y coordinate
     * @return {void}
     */
    moveTo (x: number, y: number): void
    {
        this.pathCommand.moveTo(x, y);
    }

    /**
     * @description パスを線で結ぶ
     *              Draw a line to the specified point
     *
     * @param  {number} x - X座標 / X coordinate
     * @param  {number} y - Y座標 / Y coordinate
     * @return {void}
     */
    lineTo (x: number, y: number): void
    {
        this.pathCommand.lineTo(x, y);
    }

    /**
     * @description 二次ベジェ曲線を描画
     *              Draw a quadratic Bézier curve
     *
     * @param  {number} cx - 制御点X / Control point X
     * @param  {number} cy - 制御点Y / Control point Y
     * @param  {number} x  - 終点X / End point X
     * @param  {number} y  - 終点Y / End point Y
     * @return {void}
     */
    quadraticCurveTo (cx: number, cy: number, x: number, y: number): void
    {
        this.pathCommand.quadraticCurveTo(cx, cy, x, y);
    }

    /**
     * @description 塗りつぶしスタイルを設定
     *              Set the fill style color
     *
     * @param  {number} red   - 赤色成分 / Red component
     * @param  {number} green - 緑色成分 / Green component
     * @param  {number} blue  - 青色成分 / Blue component
     * @param  {number} alpha - アルファ成分 / Alpha component
     * @return {void}
     */
    fillStyle (red: number, green: number, blue: number, alpha: number): void
    {
        this.$fillStyle[0] = red;
        this.$fillStyle[1] = green;
        this.$fillStyle[2] = blue;
        this.$fillStyle[3] = alpha;
    }

    /**
     * @description 線のスタイルを設定
     *              Set the stroke style color
     *
     * @param  {number} red   - 赤色成分 / Red component
     * @param  {number} green - 緑色成分 / Green component
     * @param  {number} blue  - 青色成分 / Blue component
     * @param  {number} alpha - アルファ成分 / Alpha component
     * @return {void}
     */
    strokeStyle (red: number, green: number, blue: number, alpha: number): void
    {
        this.$strokeStyle[0] = red;
        this.$strokeStyle[1] = green;
        this.$strokeStyle[2] = blue;
        this.$strokeStyle[3] = alpha;
    }

    /**
     * @description パスを閉じる
     *              Close the current path
     *
     * @return {void}
     */
    closePath (): void
    {
        this.pathCommand.closePath();
    }

    /**
     * @description 円弧を描画
     *              Draw an arc
     *
     * @param  {number} x      - 中心X / Center X
     * @param  {number} y      - 中心Y / Center Y
     * @param  {number} radius - 半径 / Radius
     * @return {void}
     */
    arc (x: number, y: number, radius: number): void
    {
        this.pathCommand.arc(x, y, radius);
    }

    /**
     * @description 3次ベジェ曲線を描画
     *              Draw a cubic Bézier curve
     *
     * @param  {number} cx1 - 第1制御点X / First control point X
     * @param  {number} cy1 - 第1制御点Y / First control point Y
     * @param  {number} cx2 - 第2制御点X / Second control point X
     * @param  {number} cy2 - 第2制御点Y / Second control point Y
     * @param  {number} x   - 終点X / End point X
     * @param  {number} y   - 終点Y / End point Y
     * @return {void}
     */
    bezierCurveTo (cx1: number, cy1: number, cx2: number, cy2: number, x: number, y: number): void
    {
        this.pathCommand.bezierCurveTo(cx1, cy1, cx2, cy2, x, y);
    }

    /**
     * @description 描画メソッド共通: レンダーパスの確保とノード領域クリア
     *              Common drawing method: ensure render pass and clear node area
     *              fill(), stroke(), gradientFill(), bitmapFill(), gradientStroke(), bitmapStroke() で使用
     *
     * @return {void}
     */
    private ensureFillRenderPass (): void
    {
        // フレームが開始されていない場合は開始
        if (!this.frameStarted) {
            this.beginFrame();
        }

        // コマンドエンコーダーを確保
        this.ensureCommandEncoder();

        // 既存のレンダーパスがある場合はearlyリターン（ノード領域クリアのみ確認）
        if (this.renderPassEncoder) {
            if (this.currentRenderTarget) {
                this.ensureNodeAreaCleared();
            }
            return;
        }

        // レンダーパスがない場合のみ新規作成
        {
            // 現在のレンダーターゲットを取得（メインまたはオフスクリーン）
            const textureView = this.getCurrentTextureView();
            const attachment = $getAtlasAttachmentObject();

            // MSAAテクスチャを使用するかどうか
            const useMsaa = attachment?.msaa && attachment?.msaaTexture?.view;
            const colorView = useMsaa ? attachment!.msaaTexture!.view : textureView;
            const resolveTarget = useMsaa ? textureView : null;

            // アトラスへの描画でステンシルが必要な場合はステンシル付きレンダーパスを作成
            if (this.currentRenderTarget && attachment?.stencil?.view) {
                // MSAAステンシルテクスチャを使用
                const stencilView = useMsaa && attachment?.msaaStencil?.view
                    ? attachment.msaaStencil.view
                    : attachment.stencil.view;

                // ステンシルは常にクリア（2パスフィル描画のため）
                // 各描画ごとにステンシルを0からスタートする必要がある
                const renderPassDescriptor = this.frameBufferManager.createStencilRenderPassDescriptor(
                    colorView,
                    stencilView,
                    "load",
                    "clear",  // ステンシルをクリア
                    resolveTarget
                );
                this.renderPassEncoder = this.commandEncoder!.beginRenderPass(renderPassDescriptor);
            } else if (!this.currentRenderTarget && ($isMaskTestEnabled() || $isMaskDrawing()) && this.$mainAttachmentObject?.stencil?.view) {
                // マスク描画時またはマスクテスト有効時のメインアタッチメントへの描画（ステンシル付き）
                // マスク描画時: ステンシルバッファにマスク形状を書き込む
                // マスクテスト時: ステンシル値をテストしてマスク領域のみ描画
                const mainUseMsaa = this.$mainAttachmentObject.msaa && this.$mainAttachmentObject.msaaTexture?.view;
                const mainColorView = mainUseMsaa ? this.$mainAttachmentObject.msaaTexture!.view : this.$mainAttachmentObject.texture!.view;
                const mainStencilView = mainUseMsaa && this.$mainAttachmentObject.msaaStencil?.view
                    ? this.$mainAttachmentObject.msaaStencil.view
                    : this.$mainAttachmentObject.stencil.view;
                const mainResolveTarget = mainUseMsaa ? this.$mainAttachmentObject.texture!.view : null;

                const renderPassDescriptor = this.frameBufferManager.createStencilRenderPassDescriptor(
                    mainColorView,
                    mainStencilView,
                    "load",
                    "load",  // ステンシルは既存の値を保持（マスク情報）
                    mainResolveTarget
                );
                this.renderPassEncoder = this.commandEncoder!.beginRenderPass(renderPassDescriptor);
                // マスクテスト時はステンシル参照値を設定
                if ($isMaskTestEnabled()) {
                    this.renderPassEncoder.setStencilReference($getMaskStencilReference());
                }
            } else if (!this.currentRenderTarget && this.$mainAttachmentObject) {
                // メインアタッチメントへの通常描画（MSAA対応）
                // 2パスステンシルフィルを使用するため、常にステンシル付きレンダーパスを作成
                const mainUseMsaa = this.$mainAttachmentObject.msaa && this.$mainAttachmentObject.msaaTexture?.view;
                const mainColorView = mainUseMsaa ? this.$mainAttachmentObject.msaaTexture!.view : this.$mainAttachmentObject.texture!.view;
                const mainResolveTarget = mainUseMsaa ? this.$mainAttachmentObject.texture!.view : null;

                if (this.$mainAttachmentObject.stencil?.view) {
                    // ステンシル付きレンダーパス（2パスステンシルフィル用）
                    const mainStencilView = mainUseMsaa && this.$mainAttachmentObject.msaaStencil?.view
                        ? this.$mainAttachmentObject.msaaStencil.view
                        : this.$mainAttachmentObject.stencil.view;

                    const renderPassDescriptor = this.frameBufferManager.createStencilRenderPassDescriptor(
                        mainColorView,
                        mainStencilView,
                        "load",
                        "clear",  // ステンシルをクリア（各描画でステンシルを0からスタート）
                        mainResolveTarget
                    );
                    this.renderPassEncoder = this.commandEncoder!.beginRenderPass(renderPassDescriptor);
                } else {
                    // ステンシルなし（フォールバック）
                    const renderPassDescriptor = this.frameBufferManager.createRenderPassDescriptor(
                        mainColorView,
                        0, 0, 0, 0,
                        "load",
                        mainResolveTarget
                    );
                    this.renderPassEncoder = this.commandEncoder!.beginRenderPass(renderPassDescriptor);
                }
            } else {
                const renderPassDescriptor = this.frameBufferManager.createRenderPassDescriptor(
                    colorView,
                    0, 0, 0, 0,
                    "load",
                    resolveTarget
                );
                this.renderPassEncoder = this.commandEncoder!.beginRenderPass(renderPassDescriptor);
            }
        }

        // ノードレンダリング中の場合、最初の描画前にノード領域をクリア
        // renderPassEncoder作成後に呼び出す必要がある
        if (this.currentRenderTarget) {
            this.ensureNodeAreaCleared();
        }
    }

    /**
     * @description 塗りつぶしを実行（Loop-Blinn方式対応）
     *              Execute fill operation (with Loop-Blinn support)
     *
     * @return {void}
     */
    fill (): void
    {
        const pathVertices = this.pathCommand.$getVertices;
        if (pathVertices.length === 0) { return }

        this.ensureFillRenderPass();

        // WebGL版と同じ: 現在のビューポートサイズを使用（アトラス描画時はアトラスサイズ）
        const viewportWidth = this.viewportWidth;
        const viewportHeight = this.viewportHeight;

        // MeshFillGenerateUseCaseで頂点データを生成（4 floats/vertex: position + bezier）
        const mesh = meshFillGenerateUseCase(pathVertices);

        if (mesh.indexCount === 0) {
            return;
        }

        // 頂点バッファを取得（プールから再利用）
        const vertexBuffer = this.bufferManager.acquireVertexBuffer(mesh.buffer.byteLength, mesh.buffer);

        // color/matrixをDynamic Uniform Bufferに書き込み
        const uniformOffset = this.writeFillUniform(
            this.$fillStyle[0], this.$fillStyle[1], this.$fillStyle[2], this.$fillStyle[3],
            this.$matrix[0], this.$matrix[1], this.$matrix[3], this.$matrix[4],
            this.$matrix[6], this.$matrix[7],
            viewportWidth, viewportHeight
        );
        const bindGroup = this.getOrCreateFillDynamicBindGroup();

        // アトラスへの描画（ステンシルあり）の場合は2パスステンシルフィル
        const attachment = $getAtlasAttachmentObject();
        if (this.currentRenderTarget && attachment?.stencil?.view) {
            this.fillWithStencil(vertexBuffer, mesh.indexCount, bindGroup, uniformOffset);
        } else if (!this.currentRenderTarget && !this.inMaskMode && !$isMaskTestEnabled() && this.$mainAttachmentObject?.stencil?.view) {
            this.fillWithStencilMain(vertexBuffer, mesh.indexCount, bindGroup, uniformOffset);
        } else {
            const useStencilPipeline = (this.inMaskMode || $isMaskTestEnabled()) && !!this.$mainAttachmentObject?.stencil?.view && !this.currentRenderTarget;
            this.fillSimple(vertexBuffer, mesh.indexCount, useStencilPipeline, bindGroup, uniformOffset);
        }

        // レンダーパスは終了しない（drawFill()またはendNodeRendering()で終了する）
    }

    /**
     * @description Dynamic Uniform BindGroupを取得（フレーム内で初回呼び出し時に作成）
     *              Get or create the Dynamic Uniform BindGroup (created on first call within a frame)
     *
     * @return {GPUBindGroup} Dynamic Uniform BindGroup
     */
    private getOrCreateFillDynamicBindGroup(): GPUBindGroup
    {
        const currentBuffer = this.bufferManager.dynamicUniform.getBuffer();
        if (!this.fillDynamicBindGroup || this.fillDynamicBindGroupBuffer !== currentBuffer) {
            const layout = this.pipelineManager.getBindGroupLayout("fill_dynamic");
            if (!layout) {
                throw new Error("[WebGPU] fill_dynamic bind group layout not found");
            }
            this.fillDynamicBindGroup = this.device.createBindGroup({
                "layout": layout,
                "entries": [{
                    "binding": 0,
                    "resource": {
                        "buffer": currentBuffer,
                        "size": 256
                    }
                }]
            });
            this.fillDynamicBindGroupBuffer = currentBuffer;
        }
        return this.fillDynamicBindGroup;
    }

    /**
     * @description fill/stroke用のcolor/matrix uniformを書き込む
     *              Write color/matrix uniform for fill/stroke operations
     *              FillUniforms構造体: color(vec4) + matrix0(vec4) + matrix1(vec4) + matrix2(vec4) = 64 bytes
     *
     * @param  {number} red              - 赤色成分 / Red component
     * @param  {number} green            - 緑色成分 / Green component
     * @param  {number} blue             - 青色成分 / Blue component
     * @param  {number} alpha            - アルファ成分 / Alpha component
     * @param  {number} a                - 変換行列a / Transform matrix a
     * @param  {number} b                - 変換行列b / Transform matrix b
     * @param  {number} c                - 変換行列c / Transform matrix c
     * @param  {number} d                - 変換行列d / Transform matrix d
     * @param  {number} tx               - 変換行列tx / Transform matrix tx
     * @param  {number} ty               - 変換行列ty / Transform matrix ty
     * @param  {number} viewport_width   - ビューポート幅 / Viewport width
     * @param  {number} viewport_height  - ビューポート高さ / Viewport height
     * @return {number} Dynamic Uniform Buffer内のアライメント済みオフセット / Aligned offset in the Dynamic Uniform Buffer
     */
    private writeFillUniform(
        red: number, green: number, blue: number, alpha: number,
        a: number, b: number, c: number, d: number,
        tx: number, ty: number,
        viewport_width: number, viewport_height: number
    ): number
    {
        // color
        $fillUniform16[0] = red;
        $fillUniform16[1] = green;
        $fillUniform16[2] = blue;
        $fillUniform16[3] = alpha;
        // matrix0 (a, b, 0, pad) — ビューポート正規化
        $fillUniform16[4] = a / viewport_width;
        $fillUniform16[5] = b / viewport_height;
        $fillUniform16[6] = 0;
        $fillUniform16[7] = 0;
        // matrix1 (c, d, 0, pad)
        $fillUniform16[8] = c / viewport_width;
        $fillUniform16[9] = d / viewport_height;
        $fillUniform16[10] = 0;
        $fillUniform16[11] = 0;
        // matrix2 (tx, ty, 1, pad)
        $fillUniform16[12] = tx / viewport_width;
        $fillUniform16[13] = ty / viewport_height;
        $fillUniform16[14] = 1;
        $fillUniform16[15] = 0;

        return this.bufferManager.dynamicUniform.allocate($fillUniform16);
    }

    /**
     * @description 2パスステンシルフィル（アトラス用）
     *              Two-pass stencil fill (for atlas)
     *
     * @param  {GPUBuffer}   vertex_buffer  - 頂点バッファ / Vertex buffer
     * @param  {number}      vertex_count   - 頂点数 / Vertex count
     * @param  {GPUBindGroup} bind_group    - バインドグループ / Bind group
     * @param  {number}      uniform_offset - ユニフォームオフセット / Uniform offset
     * @return {void}
     */
    private fillWithStencil(
        vertex_buffer: GPUBuffer,
        vertex_count: number,
        bind_group: GPUBindGroup,
        uniform_offset: number
    ): void
    {
        contextFillWithStencilService(
            this.renderPassEncoder!,
            this.pipelineManager,
            vertex_buffer,
            vertex_count,
            bind_group,
            uniform_offset
        );
    }

    /**
     * @description 2パスステンシルフィル（メインキャンバス用）
     *              Two-pass stencil fill (for main canvas)
     *
     * @param  {GPUBuffer}   vertex_buffer  - 頂点バッファ / Vertex buffer
     * @param  {number}      vertex_count   - 頂点数 / Vertex count
     * @param  {GPUBindGroup} bind_group    - バインドグループ / Bind group
     * @param  {number}      uniform_offset - ユニフォームオフセット / Uniform offset
     * @return {void}
     */
    private fillWithStencilMain(
        vertex_buffer: GPUBuffer,
        vertex_count: number,
        bind_group: GPUBindGroup,
        uniform_offset: number
    ): void
    {
        contextFillWithStencilMainService(
            this.renderPassEncoder!,
            this.pipelineManager,
            vertex_buffer,
            vertex_count,
            bind_group,
            uniform_offset
        );
    }

    /**
     * @description 単純なフィル（ステンシルなし、キャンバス描画用）
     *              Simple fill (no stencil, for canvas rendering)
     *
     * @param  {GPUBuffer}    vertex_buffer        - 頂点バッファ / Vertex buffer
     * @param  {number}       vertex_count         - 頂点数 / Vertex count
     * @param  {boolean}      use_stencil_pipeline - ステンシルパイプラインを使用するか / Whether to use stencil pipeline
     * @param  {GPUBindGroup} bind_group           - バインドグループ / Bind group
     * @param  {number}       uniform_offset       - ユニフォームオフセット / Uniform offset
     * @return {void}
     */
    private fillSimple(
        vertex_buffer: GPUBuffer,
        vertex_count: number,
        use_stencil_pipeline: boolean,
        bind_group: GPUBindGroup,
        uniform_offset: number
    ): void
    {
        const clipLevel = this.$mainAttachmentObject?.clipLevel ?? 1;

        contextFillSimpleService(
            this.renderPassEncoder!,
            this.pipelineManager,
            vertex_buffer,
            vertex_count,
            bind_group,
            uniform_offset,
            this.currentRenderTarget !== null,
            use_stencil_pipeline,
            clipLevel
        );
    }

    /**
     * @description 線の描画を実行（WebGL版と同じ仕様）
     *              Execute stroke drawing (same specification as WebGL version)
     *              WebGL版と同様に、ストロークを塗りとして描画する
     *
     * @return {void}
     */
    stroke (): void
    {
        // WebGL版と同じ: IPath[]形式で頂点を取得
        const vertices = this.pathCommand.getVerticesForStroke();
        if (vertices.length === 0) { return }

        this.ensureFillRenderPass();

        const viewportWidth = this.viewportWidth;
        const viewportHeight = this.viewportHeight;

        const strokeOutlines = generateStrokeMesh(vertices, this.thickness);
        if (strokeOutlines.length === 0) { return }

        // ストロークもmeshFillGenerateUseCaseを使用（4 floats/vertex）
        const mesh = meshFillGenerateUseCase(strokeOutlines);

        if (mesh.indexCount === 0) {
            return;
        }

        const vertexBuffer = this.bufferManager.acquireVertexBuffer(mesh.buffer.byteLength, mesh.buffer);

        // color/matrixをDynamic Uniform Bufferに書き込み
        const uniformOffset = this.writeFillUniform(
            this.$strokeStyle[0], this.$strokeStyle[1], this.$strokeStyle[2], this.$strokeStyle[3],
            this.$matrix[0], this.$matrix[1], this.$matrix[3], this.$matrix[4],
            this.$matrix[6], this.$matrix[7],
            viewportWidth, viewportHeight
        );
        const bindGroup = this.getOrCreateFillDynamicBindGroup();

        const attachment = $getAtlasAttachmentObject();
        if (this.currentRenderTarget && attachment?.stencil?.view) {
            this.fillWithStencil(vertexBuffer, mesh.indexCount, bindGroup, uniformOffset);
        } else if (!this.currentRenderTarget && !this.inMaskMode && !$isMaskTestEnabled() && this.$mainAttachmentObject?.stencil?.view) {
            this.fillWithStencilMain(vertexBuffer, mesh.indexCount, bindGroup, uniformOffset);
        } else {
            const useStencilPipeline = (this.inMaskMode || $isMaskTestEnabled()) && !!this.$mainAttachmentObject?.stencil?.view && !this.currentRenderTarget;
            this.fillSimple(vertexBuffer, mesh.indexCount, useStencilPipeline, bindGroup, uniformOffset);
        }

        // ストローク描画後はpathCommandをクリアする
        // 理由: drawFill()がfill()を呼び出すため、クリアしないと同じパスが白で塗りつぶされる
        this.pathCommand.reset();
    }

    /**
     * @description グラデーションの塗りつぶしを実行
     *              Execute gradient fill
     *
     * @param  {number}       type          - グラデーションタイプ / Gradient type
     * @param  {number[]}     stops         - カラーストップ配列 / Color stop array
     * @param  {Float32Array} matrix        - グラデーション変換行列 / Gradient transform matrix
     * @param  {number}       spread        - スプレッドメソッド / Spread method
     * @param  {number}       interpolation - 補間方法 / Interpolation method
     * @param  {number}       focal         - 焦点距離 / Focal point ratio
     * @return {void}
     */
    gradientFill (
        type: number,
        stops: number[],
        matrix: Float32Array,
        spread: number,
        interpolation: number,
        focal: number
    ): void {
        const pathVertices = this.pathCommand.$getVertices;
        if (pathVertices.length === 0) { return }

        this.ensureFillRenderPass();

        // WebGL版と同じ: ビューポートサイズ
        const viewportWidth = this.viewportWidth;
        const viewportHeight = this.viewportHeight;

        // ステンシル付きパイプラインを使用するかどうかを判定
        // グラデーション塗りつぶしでは、マスクモード時のみステンシルテストが必要
        const useMainStencil = !!((this.inMaskMode || $isMaskTestEnabled()) && this.$mainAttachmentObject?.stencil?.view && !this.currentRenderTarget);
        const useStencilPipeline = useMainStencil;

        // アトラスへの描画かどうか
        const useAtlasTarget = this.currentRenderTarget !== null;

        const lutTexture = contextGradientFillUseCase(
            this.device,
            this.renderPassEncoder!,
            this.bufferManager,
            this.pipelineManager,
            pathVertices,
            this.$matrix,
            this.$fillStyle,
            type,
            stops,
            matrix,
            spread,
            interpolation,
            focal,
            viewportWidth,
            viewportHeight,
            useAtlasTarget,
            useStencilPipeline,
            this.$mainAttachmentObject?.clipLevel ?? 1
        );
        if (lutTexture) {
            this.addFrameTexture(lutTexture);
        }

        // グラデーション描画後にパスをクリア
        // これにより、後続のfill()呼び出しで同じパスが再描画されるのを防ぐ
        this.beginPath();
    }

    /**
     * @description ビットマップの塗りつぶしを実行
     *              Execute bitmap fill
     *
     * @param  {Uint8Array}   pixels - ピクセルデータ / Pixel data
     * @param  {Float32Array} matrix - ビットマップ変換行列 / Bitmap transform matrix
     * @param  {number}       width  - ビットマップ幅 / Bitmap width
     * @param  {number}       height - ビットマップ高さ / Bitmap height
     * @param  {boolean}      repeat - 繰り返しフラグ / Repeat flag
     * @param  {boolean}      smooth - スムージングフラグ / Smoothing flag
     * @return {void}
     */
    bitmapFill (
        pixels: Uint8Array,
        matrix: Float32Array,
        width: number,
        height: number,
        repeat: boolean,
        smooth: boolean
    ): void {
        const pathVertices = this.pathCommand.$getVertices;
        if (pathVertices.length === 0) { return }

        this.ensureFillRenderPass();

        // アトラスのアタッチメントを取得（ステンシル判定で使用）
        const atlasAttachment = $getAtlasAttachmentObject();

        // ステンシル付きレンダーパスかどうかを判定
        // - マスクモード時またはマスクテスト有効時（メインアタッチメントへの描画）
        // - アトラス描画時（ステンシル付きレンダーパス）
        const useAtlasStencil = !!(this.currentRenderTarget && atlasAttachment?.stencil?.view);
        const useMainStencil = !!((this.inMaskMode || $isMaskTestEnabled()) && this.$mainAttachmentObject?.stencil?.view && !this.currentRenderTarget);
        const useStencilPipeline = useAtlasStencil || useMainStencil;

        // マスク描画時のクリップレベルを取得
        const clipLevel = this.$mainAttachmentObject?.clipLevel ?? 1;

        const bitmapTexture = contextBitmapFillUseCase(
            this.device,
            this.renderPassEncoder!,
            this.bufferManager,
            this.pipelineManager,
            pathVertices,
            this.$matrix,
            this.$fillStyle,
            pixels,
            matrix,
            width,
            height,
            repeat,
            smooth,
            this.viewportWidth,
            this.viewportHeight,
            this.currentRenderTarget !== null,
            !!useStencilPipeline,
            clipLevel
        );

        // ビットマップテクスチャをフレーム終了時に解放するリストに追加
        if (bitmapTexture) {
            this.addFrameTexture(bitmapTexture);
        }

        // ビットマップ描画後にパスをクリア
        // これにより、後続のfill()呼び出しで同じパスが再描画されるのを防ぐ
        this.beginPath();
    }

    /**
     * @description グラデーション線の描画を実行
     *              Execute gradient stroke drawing
     *
     * @param  {number}       type          - グラデーションタイプ / Gradient type
     * @param  {number[]}     stops         - カラーストップ配列 / Color stop array
     * @param  {Float32Array} matrix        - グラデーション変換行列 / Gradient transform matrix
     * @param  {number}       spread        - スプレッドメソッド / Spread method
     * @param  {number}       interpolation - 補間方法 / Interpolation method
     * @param  {number}       focal         - 焦点距離 / Focal point ratio
     * @return {void}
     */
    gradientStroke (
        type: number,
        stops: number[],
        matrix: Float32Array,
        spread: number,
        interpolation: number,
        focal: number
    ): void {
        // WebGL版と同じ: IPath[]形式で頂点を取得
        const vertices = this.pathCommand.getVerticesForStroke();
        if (vertices.length === 0) { return }

        this.ensureFillRenderPass();

        // アトラスのアタッチメントを取得（ステンシル判定で使用）
        const atlasAttachment = $getAtlasAttachmentObject();

        // レンダーパスがステンシルアタッチメントを持つ場合はステンシル互換パイプラインを使用
        const useAtlasStencil = !!(this.currentRenderTarget && atlasAttachment?.stencil?.view);
        const useMainStencil = !!(!this.currentRenderTarget && this.$mainAttachmentObject?.stencil?.view);
        const useStencilPipeline = useAtlasStencil || useMainStencil;

        // WebGL版と同じ: thicknessをそのまま渡し、内部で/2される
        const lutTexture = contextGradientStrokeUseCase(
            this.device,
            this.renderPassEncoder!,
            this.bufferManager,
            this.pipelineManager,
            vertices,
            this.thickness,
            this.$matrix,
            this.$strokeStyle,
            type,
            stops,
            matrix,
            spread,
            interpolation,
            focal,
            this.viewportWidth,
            this.viewportHeight,
            this.currentRenderTarget !== null,
            useStencilPipeline
        );

        // LUTテクスチャをフレーム終了時に解放するリストに追加
        if (lutTexture) {
            this.addFrameTexture(lutTexture);
        }

        // ストローク描画後はpathCommandをクリアする
        // 理由: drawFill()がfill()を呼び出すため、クリアしないと同じパスが白で塗りつぶされる
        this.pathCommand.reset();
    }

    /**
     * @description ビットマップ線の描画を実行
     *              Execute bitmap stroke drawing
     *
     * @param  {Uint8Array}   pixels - ピクセルデータ / Pixel data
     * @param  {Float32Array} matrix - ビットマップ変換行列 / Bitmap transform matrix
     * @param  {number}       width  - ビットマップ幅 / Bitmap width
     * @param  {number}       height - ビットマップ高さ / Bitmap height
     * @param  {boolean}      repeat - 繰り返しフラグ / Repeat flag
     * @param  {boolean}      smooth - スムージングフラグ / Smoothing flag
     * @return {void}
     */
    bitmapStroke (
        pixels: Uint8Array,
        matrix: Float32Array,
        width: number,
        height: number,
        repeat: boolean,
        smooth: boolean
    ): void {
        // WebGL版と同じ: IPath[]形式で頂点を取得
        const vertices = this.pathCommand.getVerticesForStroke();
        if (vertices.length === 0) { return }

        this.ensureFillRenderPass();

        // アトラスのアタッチメントを取得（ステンシル判定で使用）
        const atlasAttachment = $getAtlasAttachmentObject();

        // レンダーパスがステンシルアタッチメントを持つ場合はステンシル互換パイプラインを使用
        const useAtlasStencil = !!(this.currentRenderTarget && atlasAttachment?.stencil?.view);
        const useMainStencil = !!(!this.currentRenderTarget && this.$mainAttachmentObject?.stencil?.view);
        const useStencilPipeline = useAtlasStencil || useMainStencil;

        // WebGL版と同じ: thicknessをそのまま渡し、内部で/2される
        const bitmapTexture = contextBitmapStrokeUseCase(
            this.device,
            this.renderPassEncoder!,
            this.bufferManager,
            this.pipelineManager,
            vertices,
            this.thickness,
            this.$matrix,
            this.$strokeStyle,
            pixels,
            matrix,
            width,
            height,
            repeat,
            smooth,
            this.viewportWidth,
            this.viewportHeight,
            this.currentRenderTarget !== null,
            useStencilPipeline
        );

        // ビットマップテクスチャをフレーム終了時に解放するリストに追加
        if (bitmapTexture) {
            this.addFrameTexture(bitmapTexture);
        }

        // ストローク描画後はpathCommandをクリアする
        // 理由: drawFill()がfill()を呼び出すため、クリアしないと同じパスが白で塗りつぶされる
        this.pathCommand.reset();
    }

    /**
     * @description マスク処理を実行
     *              Execute mask clipping operation
     *              WebGL版と同様にステンシルバッファを使用したクリッピング
     *              メインアタッチメントとアトラス両方でマスク処理をサポート
     *
     * @return {void}
     */
    clip (): void
    {
        // メインアタッチメントまたはアトラスのいずれかを使用
        // currentAttachmentがない場合はメインアタッチメントを使用（メインキャンバスでのマスク処理用）
        let currentAttachment = this.frameBufferManager.getCurrentAttachment();
        const isMainAttachment = !currentAttachment || currentAttachment === this.$mainAttachmentObject;

        if (!currentAttachment && this.$mainAttachmentObject) {
            currentAttachment = this.$mainAttachmentObject;
        }

        if (!currentAttachment) {
            return;
        }

        // ステンシルバッファがない場合はスキップ
        if (!currentAttachment.stencil) {
            return;
        }

        const pathVertices = this.pathCommand.$getVertices;
        if (pathVertices.length === 0) {
            return;
        }

        // レンダーパスがない場合は作成
        if (!this.renderPassEncoder) {
            this.ensureCommandEncoder();

            // メインアタッチメントの場合はステンシル付きレンダーパスを作成（MSAA対応）
            if (isMainAttachment && this.$mainAttachmentObject?.stencil?.view) {
                const clipUseMsaa = this.$mainAttachmentObject.msaa && this.$mainAttachmentObject.msaaTexture?.view;
                const clipColorView = clipUseMsaa
                    ? this.$mainAttachmentObject.msaaTexture!.view
                    : this.$mainAttachmentObject.texture!.view;
                const clipStencilView = clipUseMsaa && this.$mainAttachmentObject.msaaStencil?.view
                    ? this.$mainAttachmentObject.msaaStencil.view
                    : this.$mainAttachmentObject.stencil.view;
                // resolveTargetなし: clip()はwriteMask=0でcolorを変更しない
                const renderPassDescriptor = this.frameBufferManager.createStencilRenderPassDescriptor(
                    clipColorView,
                    clipStencilView,
                    "load",
                    "load"
                );
                this.renderPassEncoder = this.commandEncoder!.beginRenderPass(renderPassDescriptor);
            } else {
                return;
            }
        }

        contextClipUseCase(
            this.device,
            this.renderPassEncoder,
            this.bufferManager,
            this.pipelineManager,
            currentAttachment,
            pathVertices,
            this.$matrix,
            this.$fillStyle,
            this.globalAlpha,
            isMainAttachment
        );
    }

    /**
     * @description アタッチメントオブジェクトをバインド
     *              Bind an attachment object
     *
     * @param  {IAttachmentObject} attachment_object - バインドするアタッチメント / Attachment to bind
     * @return {void}
     */
    bind (attachment_object: IAttachmentObject): void
    {
        this.frameBufferManager.setCurrentAttachment(attachment_object);

        // WebGL版と同じ: ビューポートサイズをアタッチメントのサイズに設定
        this.viewportWidth = attachment_object.width;
        this.viewportHeight = attachment_object.height;
    }

    /**
     * @description 現在のアタッチメントオブジェクトを取得
     *              Get the current attachment object
     *              アトラスがバインドされていない場合はメインアタッチメントを返す
     *              When no atlas is bound, returns the main attachment
     *
     * @return {IAttachmentObject | null} 現在のアタッチメント / Current attachment
     */
    get currentAttachmentObject (): IAttachmentObject | null
    {
        // WebGL版と同じ: currentAttachmentがない場合はmainAttachmentを返す
        // これによりマスク操作がメインキャンバスでも正しく動作する
        const current = this.frameBufferManager.getCurrentAttachment();
        return current || this.$mainAttachmentObject;
    }

    /**
     * @description アトラス専用のアタッチメントオブジェクトを取得
     *              Get the atlas-specific attachment object
     *
     * @return {IAttachmentObject | null} アトラスアタッチメント / Atlas attachment
     */
    get atlasAttachmentObject (): IAttachmentObject | null
    {
        return $getAtlasAttachmentObject();
    }

    /**
     * @description グリッドの描画データをセット
     *              Set grid drawing data
     *
     * @param  {Float32Array | null} grid_data - グリッドデータ / Grid data
     * @return {void}
     */
    useGrid (grid_data: Float32Array | null): void
    {
        $gridDataMap.set($fillBufferIndex, grid_data);
    }

    /**
     * @description 指定のノード範囲で描画を開始（アトラステクスチャへの描画）
     *              Begin rendering for the specified node region (drawing to atlas texture)
     *              2パスステンシルフィル対応: ステンシルバッファ付きレンダーパスを使用
     *
     * @param  {Node} node - 描画対象ノード / Target node for rendering
     * @return {void}
     */
    beginNodeRendering (node: Node): void
    {
        // ノード領域クリアフラグをリセット
        this.nodeAreaCleared = false;

        // フレームが開始されていない場合は開始
        if (!this.frameStarted) {
            this.beginFrame();
        }

        // アトラステクスチャの該当箇所をレンダーターゲットに設定
        const attachment = $getAtlasAttachmentObjectByIndex(node.index) || $getAtlasAttachmentObject();
        if (attachment && attachment.texture) {

            // 同一アトラスへの連続描画ならレンダーパスを再利用
            if (this.renderPassEncoder && this.nodeRenderPassAtlasIndex === node.index) {
                // レンダーパスを再利用 — シザーレクトのみ更新
                this.currentRenderTarget = attachment.texture.view;
                this.viewportWidth = attachment.width;
                this.viewportHeight = attachment.height;
            } else {
                // アトラスが変わった or パスがない → 新規作成
                if (this.renderPassEncoder) {
                    this.renderPassEncoder.end();
                    this.renderPassEncoder = null;
                }

                this.currentRenderTarget = attachment.texture.view;
                this.viewportWidth = attachment.width;
                this.viewportHeight = attachment.height;

                this.ensureCommandEncoder();

                const useMsaa = attachment.msaa && attachment.msaaTexture?.view;
                const colorView = useMsaa ? attachment.msaaTexture!.view : attachment.texture.view;
                const resolveTarget = useMsaa ? attachment.texture.view : null;

                if (attachment.stencil?.view) {
                    const stencilView = useMsaa && attachment.msaaStencil?.view
                        ? attachment.msaaStencil.view
                        : attachment.stencil.view;

                    const renderPassDescriptor = this.frameBufferManager.createStencilRenderPassDescriptor(
                        colorView,
                        stencilView,
                        "load",
                        "load",
                        resolveTarget
                    );
                    this.renderPassEncoder = this.commandEncoder!.beginRenderPass(renderPassDescriptor);
                } else {
                    const renderPassDescriptor = this.frameBufferManager.createRenderPassDescriptor(
                        colorView,
                        0, 0, 0, 0,
                        "load",
                        resolveTarget
                    );
                    this.renderPassEncoder = this.commandEncoder!.beginRenderPass(renderPassDescriptor);
                }

                this.nodeRenderPassAtlasIndex = node.index;
            }

            // シザーレクトで描画範囲を制限
            let scissorX = Math.max(0, node.x);
            let scissorY = Math.max(0, node.y);
            let scissorW = Math.min(node.w, attachment.width - scissorX);
            let scissorH = Math.min(node.h, attachment.height - scissorY);

            scissorX = Math.min(scissorX, attachment.width);
            scissorY = Math.min(scissorY, attachment.height);
            scissorW = Math.max(0, Math.min(scissorW, attachment.width - scissorX));
            scissorH = Math.max(0, Math.min(scissorH, attachment.height - scissorY));

            this.$scissorRect.x = scissorX;
            this.$scissorRect.y = scissorY;
            this.$scissorRect.w = scissorW;
            this.$scissorRect.h = scissorH;
            this.currentNodeScissor = this.$scissorRect;

            if (scissorW > 0 && scissorH > 0) {
                const clearW = Math.min(scissorW + 1, attachment.width - scissorX);
                const clearH = Math.min(scissorH + 1, attachment.height - scissorY);
                this.renderPassEncoder.setScissorRect(scissorX, scissorY, clearW, clearH);
            }
        }
    }

    /**
     * @description ノード領域がまだクリアされていない場合にクリアを実行
     *              Clear the node area if it has not been cleared yet
     *              最初の描画操作（fill, gradientFill, gradientStroke等）で呼び出される
     *
     * @return {void}
     */
    private ensureNodeAreaCleared (): void
    {
        if (this.nodeAreaCleared) { return }
        this.nodeAreaCleared = true;
        this.clearNodeArea();
    }

    /**
     * @description ノード領域をクリア（透明色 + ステンシル=0）
     *              Clear the node area (transparent color + stencil=0)
     *              WebGL版の gl.clear(COLOR_BUFFER_BIT | STENCIL_BUFFER_BIT) と同等
     *
     * @return {void}
     */
    private clearNodeArea (): void
    {
        if (!this.renderPassEncoder) {
            return;
        }

        // ノードクリア用パイプラインを取得
        const clearPipeline = this.pipelineManager.getPipeline("node_clear_atlas");
        if (!clearPipeline) {
            return;
        }

        // 初回のみ頂点バッファを作成、以降はキャッシュを再利用
        // clearFrameBuffers()で破棄されないよう、BufferManagerのMapに登録せず直接作成
        if (!this.nodeClearQuadBuffer) {
            const buf = this.device.createBuffer({
                "size": $QUAD_VERTICES.byteLength,
                "usage": GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
                "mappedAtCreation": true
            });
            new Float32Array(buf.getMappedRange()).set($QUAD_VERTICES);
            buf.unmap();
            this.nodeClearQuadBuffer = buf;
        }
        const vertexBuffer = this.nodeClearQuadBuffer;

        // クリア描画を実行（シザーは+1pxで設定済み）
        this.renderPassEncoder.setPipeline(clearPipeline);
        this.renderPassEncoder.setVertexBuffer(0, vertexBuffer);
        this.renderPassEncoder.draw(6);

        // WebGL版と同じ: クリア後にシザーを元のサイズに戻す
        if (this.currentNodeScissor) {
            this.renderPassEncoder.setScissorRect(
                this.currentNodeScissor.x,
                this.currentNodeScissor.y,
                this.currentNodeScissor.w,
                this.currentNodeScissor.h
            );
        }
    }

    /**
     * @description 指定のノード範囲で描画を終了
     *              End rendering for the current node region
     *              レンダーパスは終了しない（次のbeginNodeRenderingで再利用するため）
     *
     * @return {void}
     */
    endNodeRendering (): void
    {
        // レンダーパスは終了しない（次のbeginNodeRenderingで同一アトラスなら再利用）

        // メインテクスチャに戻す
        this.currentRenderTarget = null;

        // ノードシザー範囲をクリア
        this.currentNodeScissor = null;

        // ビューポートをキャンバスサイズに戻す
        this.viewportWidth = this.canvasContext.canvas.width;
        this.viewportHeight = this.canvasContext.canvas.height;
    }

    /**
     * @description 塗りの描画を実行
     *              Execute fill drawing
     *
     * @return {void}
     */
    drawFill (): void
    {
        // WebGL版ではfill()がバッファに蓄積し、drawFill()がまとめてGPU描画する
        // WebGPU版ではfill()が直接GPU描画するため、ここでfill()を再呼び出しする必要はない
        // （END_FILLコマンドからfill()は既に呼ばれている）

        // レンダーパスは終了しない（アトラスレンダーパス統合で次のノードと共有する）
        // stencil_fillパイプラインのpassOp: "zero"でステンシルは自動リセット済み

        // グリッドデータをクリア
        $terminateGrid();
    }

    /**
     * @description インスタンスを描画
     *              Draw a display object instance
     *
     * @param  {Node}         node            - 描画対象ノード / Target node
     * @param  {number}       x_min           - バウンディングボックス左端 / Bounding box left
     * @param  {number}       y_min           - バウンディングボックス上端 / Bounding box top
     * @param  {number}       x_max           - バウンディングボックス右端 / Bounding box right
     * @param  {number}       y_max           - バウンディングボックス下端 / Bounding box bottom
     * @param  {Float32Array} color_transform - カラー変換パラメータ / Color transform parameters
     * @return {void}
     */
    drawDisplayObject (
        node: Node,
        x_min: number,
        y_min: number,
        x_max: number,
        y_max: number,
        color_transform: Float32Array
    ): void {
        // WebGPU display object drawing
        // インスタンス配列に追加
        // WebGL版と同じ: ビューポートサイズを使用（コンテナレイヤー時はレイヤーサイズ）
        const renderMaxSize = WebGPUUtil.getRenderMaxSize();

        addDisplayObjectToInstanceArray(
            node,
            x_min, y_min, x_max, y_max,
            color_transform,
            this.$matrix,
            this.globalCompositeOperation,
            this.viewportWidth,
            this.viewportHeight,
            renderMaxSize,
            this.globalAlpha  // WebGL版と同じ: globalAlphaを渡す
        );
    }

    /**
     * @description インスタンス配列を描画
     *              Draw instanced arrays
     *
     *              useOptimizedInstancingがtrueの場合、Storage BufferとIndirect Drawingを使用。
     *              - Storage Buffer: メモリアロケーション削減、CPU負荷15-25%軽減
     *              - Indirect Drawing: CPU-GPUオーバーヘッド5-15%削減
     *
     * @return {void}
     */
    drawArraysInstanced (): void
    {
        // フレームが開始されていない場合は開始
        if (!this.frameStarted) {
            this.beginFrame();
        }

        // 既存のレンダーパスを終了（アトラスパス統合をリセット）
        if (this.renderPassEncoder) {
            this.renderPassEncoder.end();
            this.renderPassEncoder = null;
        }
        this.nodeRenderPassAtlasIndex = -1;

        // コマンドエンコーダーを確保
        this.ensureCommandEncoder();

        // UseCaseでインスタンス描画を実行
        // メインアタッチメントがない場合は初期化が必要
        if (!this.$mainAttachmentObject) {
            return;
        }

        if (this.useOptimizedInstancing) {
            // 最適化版: Storage Buffer + Indirect Drawing
            this.renderPassEncoder = contextDrawIndirectUseCase(
                this.device,
                this.commandEncoder!,
                this.renderPassEncoder,
                this.$mainAttachmentObject,
                this.bufferManager,
                this.frameBufferManager,
                this.textureManager,
                this.pipelineManager,
                true, // useIndirect
                true  // useStorageBuffer
            );
        } else {
            // 従来版: 毎フレームVertex Buffer新規生成
            this.renderPassEncoder = contextDrawArraysInstancedUseCase(
                this.device,
                this.commandEncoder!,
                this.renderPassEncoder,
                this.$mainAttachmentObject,
                this.bufferManager,
                this.frameBufferManager,
                this.textureManager,
                this.pipelineManager
            );
        }

        // 複雑なブレンドモードの処理
        this.processComplexBlendQueue();
    }

    /**
     * @description 複雑なブレンドモードのキューを処理
     *              Process the complex blend mode queue
     *
     * @return {void}
     */
    private processComplexBlendQueue (): void
    {
        // コマンドエンコーダーを確保
        this.ensureCommandEncoder();

        // $mainAttachmentObjectを渡す（レンダーパスベースのコピーに必要）
        contextProcessComplexBlendQueueUseCase(
            this.device,
            this.commandEncoder!,
            this.$mainAttachmentObject,
            this.frameBufferManager,
            this.textureManager,
            this.pipelineManager,
            this.bufferManager
        );
    }

    /**
     * @description インスタンス配列をクリア
     *              Clear instanced arrays
     *
     * @return {void}
     */
    clearArraysInstanced (): void
    {
        // WebGPU clear instanced arrays
        const shaderManager = getInstancedShaderManager();
        shaderManager.clear();
    }

    /**
     * @description ピクセルバッファをNodeの指定箇所に転送
     *              Transfer pixel buffer to the specified position of the Node
     *              WebGPUでは、Shapeのシェーダーが-ndc.yでY軸反転しているため、
     *              Bitmapも同じ方向になるよう画像を上下反転して書き込む
     *
     * @param  {Node}       node   - 描画対象ノード / Target node
     * @param  {Uint8Array} pixels - ピクセルデータ / Pixel data
     * @return {void}
     */
    drawPixels (node: Node, pixels: Uint8Array): void
    {
        // WebGPU draw pixels
        // アトラステクスチャの指定位置にピクセルデータを描画
        // ノードのインデックスを使用して正しいアトラスを取得
        const attachment = $getAtlasAttachmentObjectByIndex(node.index) || $getAtlasAttachmentObject();
        if (!attachment || !attachment.texture) { return }

        const width = node.w;
        const height = node.h;

        // レンダーパスがアクティブな場合はマージンクリアしてから終了
        if (this.renderPassEncoder) {
            this.ensureNodeAreaCleared();
            this.renderPassEncoder.end();
            this.renderPassEncoder = null;
        }
        // commandEncoderはsubmitしない — drawPixelsToMsaa()内で同じエンコーダを再利用
        // writeTexture()はキュー操作でありエンコーダ不要
        this.nodeRenderPassAtlasIndex = -1;

        // MSAAが有効な場合は一時テクスチャ経由でMSAAテクスチャに直接描画
        // MSAAが無効な場合は従来通りresolve targetに直接書き込み
        if (attachment.msaa && attachment.msaaTexture?.view) {
            this.drawPixelsToMsaa(attachment, node, pixels, width, height);
        } else {
            const rowBytes = width * 4;
            this.device.queue.writeTexture(
                {
                    "texture": attachment.texture.resource,
                    "origin": { "x": node.x, "y": node.y, "z": 0 }
                },
                pixels as unknown as ArrayBufferView<ArrayBuffer>,
                {
                    "bytesPerRow": rowBytes,
                    "rowsPerImage": height,
                    "offset": 0
                },
                {
                    "width": width,
                    "height": height,
                    "depthOrArrayLayers": 1
                }
            );
        }
    }

    /**
     * @description 一時テクスチャ経由でピクセルデータをMSAAテクスチャに描画
     *              Draw pixel data to MSAA texture via a temporary texture
     *
     * @param  {IAttachmentObject} attachment - アタッチメントオブジェクト / Attachment object
     * @param  {Node}              node       - 描画対象ノード / Target node
     * @param  {Uint8Array}        pixels     - ピクセルデータ / Pixel data
     * @param  {number}            width      - 幅 / Width
     * @param  {number}            height     - 高さ / Height
     * @return {void}
     */
    private drawPixelsToMsaa (
        attachment: IAttachmentObject,
        node: Node,
        pixels: Uint8Array,
        width: number,
        height: number
    ): void
    {
        // 一時テクスチャをプールから取得
        const tempTexture = $acquireRenderTexture(this.device, width, height);

        // ピクセルデータを一時テクスチャに書き込む
        const rowBytes = width * 4;
        this.device.queue.writeTexture(
            { "texture": tempTexture },
            pixels as unknown as ArrayBufferView<ArrayBuffer>,
            {
                "bytesPerRow": rowBytes,
                "rowsPerImage": height
            },
            {
                "width": width,
                "height": height
            }
        );

        const pipeline = this.pipelineManager.getPipeline("bitmap_render_msaa");
        if (!pipeline) {
            $releaseRenderTexture(tempTexture);
            return;
        }

        const bindGroupLayout = this.pipelineManager.getBindGroupLayout("positioned_texture");
        if (!bindGroupLayout) {
            $releaseRenderTexture(tempTexture);
            return;
        }

        const uniformData = this.$uniformData8;
        uniformData[0] = node.x;
        uniformData[1] = node.y;
        uniformData[2] = width;
        uniformData[3] = height;
        uniformData[4] = attachment.width;
        uniformData[5] = attachment.height;
        uniformData[6] = 0.0;
        uniformData[7] = 0.0;
        const uniformBuffer = this.bufferManager.acquireAndWriteUniformBuffer(uniformData);

        const sampler = this.textureManager.createSampler("linear_sampler", true);
        const tempTextureView = $getOrCreateView(tempTexture);

        ($entries3[0].resource as GPUBufferBinding).buffer = uniformBuffer;
        $entries3[1].resource = sampler;
        $entries3[2].resource = tempTextureView;
        const bindGroup = this.device.createBindGroup({
            "layout": bindGroupLayout,
            "entries": $entries3
        });

        // フレームエンコーダーを使用してMSAAテクスチャに描画
        this.ensureCommandEncoder();
        $msaaColorAttachment.view = attachment.msaaTexture!.view;
        $msaaColorAttachment.resolveTarget = attachment.texture!.view;

        const stencilView = attachment.msaaStencil?.view;
        if (stencilView) {
            $msaaStencilAttachment.view = stencilView;
            $msaaDescriptor.depthStencilAttachment = $msaaStencilAttachment;
        } else {
            $msaaDescriptor.depthStencilAttachment = undefined;
        }

        const renderPass = this.commandEncoder!.beginRenderPass($msaaDescriptor);
        renderPass.setViewport(0, 0, attachment.width, attachment.height, 0, 1);
        renderPass.setScissorRect(node.x, node.y, width, height);
        renderPass.setPipeline(pipeline);
        renderPass.setBindGroup(0, bindGroup);
        renderPass.draw(6);
        renderPass.end();

        // endFrame()でプールに返却
        this.pooledRenderTextures.push(tempTexture);
    }

    /**
     * @description OffscreenCanvasをNodeの指定箇所に転送
     *              Transfer OffscreenCanvas to the specified position of the Node
     *              WebGPUでは、Shapeのシェーダーが-ndc.yでY軸反転しているため、
     *              Bitmapも同じ方向になるよう画像を上下反転して書き込む
     *
     * @param  {Node}                              node    - 描画対象ノード / Target node
     * @param  {OffscreenCanvas | ImageBitmap}     element - 描画要素 / Element to draw
     * @param  {boolean}                           flip_y  - Y軸反転フラグ / Y-axis flip flag
     * @return {void}
     */
    drawElement (node: Node, element: OffscreenCanvas | ImageBitmap, flip_y: boolean = false): void
    {
        // WebGPU draw element
        // OffscreenCanvasまたはImageBitmapをアトラステクスチャに描画
        // ノードのインデックスを使用して正しいアトラスを取得
        const attachment = $getAtlasAttachmentObjectByIndex(node.index) || $getAtlasAttachmentObject();
        if (!attachment || !attachment.texture) { return }

        const width = node.w;
        const height = node.h;

        // レンダーパスがアクティブな場合は終了
        if (this.renderPassEncoder) {
            this.ensureNodeAreaCleared();
            this.renderPassEncoder.end();
            this.renderPassEncoder = null;
        }
        // commandEncoderはsubmitしない — drawElementToMsaa()/drawElementToTexture()内で同じエンコーダを再利用
        // copyExternalImageToTexture()はキュー操作でありエンコーダ不要
        this.nodeRenderPassAtlasIndex = -1;

        // MSAAが有効な場合は一時テクスチャ経由でMSAAテクスチャに直接描画
        // MSAAが無効な場合もシェーダー経由で描画（WebGLと同じ処理フロー）
        if (attachment.msaa && attachment.msaaTexture?.view) {
            this.drawElementToMsaa(attachment, node, element, width, height, flip_y);
        } else {
            this.drawElementToTexture(attachment, node, element, width, height, flip_y);
        }
    }

    /**
     * @description 一時テクスチャ経由でMSAAテクスチャに直接描画
     *              Draw to MSAA texture directly via a temporary texture
     *
     * @param  {IAttachmentObject}             attachment - アタッチメントオブジェクト / Attachment object
     * @param  {Node}                          node       - 描画対象ノード / Target node
     * @param  {OffscreenCanvas | ImageBitmap} element    - 描画要素 / Element to draw
     * @param  {number}                        width      - 幅 / Width
     * @param  {number}                        height     - 高さ / Height
     * @param  {boolean}                       flip_y     - Y軸反転フラグ / Y-axis flip flag
     * @return {void}
     */
    private drawElementToMsaa (
        attachment: IAttachmentObject,
        node: Node,
        element: OffscreenCanvas | ImageBitmap,
        width: number,
        height: number,
        flip_y: boolean
    ): void
    {
        // 一時テクスチャをプールから取得
        const tempTexture = $acquireRenderTexture(this.device, width, height);

        this.device.queue.copyExternalImageToTexture(
            {
                "source": element as ImageBitmap,
                "flipY": flip_y
            },
            {
                "texture": tempTexture,
                "premultipliedAlpha": true
            },
            {
                "width": width,
                "height": height
            }
        );

        const pipeline = this.pipelineManager.getPipeline("bitmap_render_msaa");
        if (!pipeline) {
            $releaseRenderTexture(tempTexture);
            return;
        }

        const bindGroupLayout = this.pipelineManager.getBindGroupLayout("positioned_texture");
        if (!bindGroupLayout) {
            $releaseRenderTexture(tempTexture);
            return;
        }

        const uniformData = this.$uniformData8;
        uniformData[0] = node.x;
        uniformData[1] = node.y;
        uniformData[2] = width;
        uniformData[3] = height;
        uniformData[4] = attachment.width;
        uniformData[5] = attachment.height;
        uniformData[6] = 0.0;
        uniformData[7] = 0.0;
        const uniformBuffer = this.bufferManager.acquireAndWriteUniformBuffer(uniformData);

        const sampler = this.textureManager.createSampler("linear_sampler", true);
        const tempTextureView = $getOrCreateView(tempTexture);

        ($entries3[0].resource as GPUBufferBinding).buffer = uniformBuffer;
        $entries3[1].resource = sampler;
        $entries3[2].resource = tempTextureView;
        const bindGroup = this.device.createBindGroup({
            "layout": bindGroupLayout,
            "entries": $entries3
        });

        // フレームエンコーダーを使用してMSAAテクスチャに描画
        this.ensureCommandEncoder();
        $msaaColorAttachment.view = attachment.msaaTexture!.view;
        $msaaColorAttachment.resolveTarget = attachment.texture!.view;

        const stencilView = attachment.msaaStencil?.view;
        if (stencilView) {
            $msaaStencilAttachment.view = stencilView;
            $msaaDescriptor.depthStencilAttachment = $msaaStencilAttachment;
        } else {
            $msaaDescriptor.depthStencilAttachment = undefined;
        }

        const renderPass = this.commandEncoder!.beginRenderPass($msaaDescriptor);
        renderPass.setViewport(0, 0, attachment.width, attachment.height, 0, 1);
        renderPass.setScissorRect(node.x, node.y, width, height);
        renderPass.setPipeline(pipeline);
        renderPass.setBindGroup(0, bindGroup);
        renderPass.draw(6);
        renderPass.end();

        // endFrame()でプールに返却
        this.pooledRenderTextures.push(tempTexture);
    }

    /**
     * @description 一時テクスチャ経由で通常テクスチャに描画（非MSAA版）
     *              Draw to a regular texture via a temporary texture (non-MSAA version)
     *
     * @param  {IAttachmentObject}             attachment - アタッチメントオブジェクト / Attachment object
     * @param  {Node}                          node       - 描画対象ノード / Target node
     * @param  {OffscreenCanvas | ImageBitmap} element    - 描画要素 / Element to draw
     * @param  {number}                        width      - 幅 / Width
     * @param  {number}                        height     - 高さ / Height
     * @param  {boolean}                       flip_y     - Y軸反転フラグ / Y-axis flip flag
     * @return {void}
     */
    private drawElementToTexture (
        attachment: IAttachmentObject,
        node: Node,
        element: OffscreenCanvas | ImageBitmap,
        width: number,
        height: number,
        flip_y: boolean
    ): void
    {
        // 一時テクスチャをプールから取得
        const tempTexture = $acquireRenderTexture(this.device, width, height);

        // ImageBitmapを一時テクスチャにコピー
        // flipYパラメータで画像の上下反転を制御（Videoはtrue、TextFieldはfalse）
        this.device.queue.copyExternalImageToTexture(
            {
                "source": element as ImageBitmap,
                "flipY": flip_y
            },
            {
                "texture": tempTexture,
                "premultipliedAlpha": true
            },
            {
                "width": width,
                "height": height
            }
        );

        const pipeline = this.pipelineManager.getPipeline("bitmap_render");
        if (!pipeline) {
            $releaseRenderTexture(tempTexture);
            return;
        }

        const bindGroupLayout = this.pipelineManager.getBindGroupLayout("positioned_texture");
        if (!bindGroupLayout) {
            $releaseRenderTexture(tempTexture);
            return;
        }

        const uniformData = this.$uniformData8;
        uniformData[0] = node.x;
        uniformData[1] = node.y;
        uniformData[2] = width;
        uniformData[3] = height;
        uniformData[4] = attachment.width;
        uniformData[5] = attachment.height;
        uniformData[6] = 0.0;
        uniformData[7] = 0.0;
        const uniformBuffer = this.bufferManager.acquireAndWriteUniformBuffer(uniformData);

        const sampler = this.textureManager.createSampler("linear_sampler", true);
        const tempTextureView = $getOrCreateView(tempTexture);

        ($entries3[0].resource as GPUBufferBinding).buffer = uniformBuffer;
        $entries3[1].resource = sampler;
        $entries3[2].resource = tempTextureView;
        const bindGroup = this.device.createBindGroup({
            "layout": bindGroupLayout,
            "entries": $entries3
        });

        // フレームエンコーダーを使用して通常テクスチャに描画
        this.ensureCommandEncoder();
        $msaaColorAttachment.view = attachment.texture!.view;
        $msaaColorAttachment.resolveTarget = undefined;

        const stencilView = attachment.stencil?.view;
        if (stencilView) {
            $msaaStencilAttachment.view = stencilView;
            $msaaDescriptor.depthStencilAttachment = $msaaStencilAttachment;
        } else {
            $msaaDescriptor.depthStencilAttachment = undefined;
        }

        const renderPass = this.commandEncoder!.beginRenderPass($msaaDescriptor);
        renderPass.setViewport(0, 0, attachment.width, attachment.height, 0, 1);
        renderPass.setScissorRect(node.x, node.y, width, height);
        renderPass.setPipeline(pipeline);
        renderPass.setBindGroup(0, bindGroup);
        renderPass.draw(6);
        renderPass.end();

        // endFrame()でプールに返却
        this.pooledRenderTextures.push(tempTexture);
    }

    /**
     * @description フィルターを適用
     *              Apply filter effects
     *
     * @param  {Node}         node            - 描画対象ノード / Target node
     * @param  {string}       _unique_key     - ユニークキー / Unique key
     * @param  {boolean}      _updated        - 更新フラグ / Updated flag
     * @param  {number}       width           - 幅 / Width
     * @param  {number}       height          - 高さ / Height
     * @param  {boolean}      _is_bitmap      - ビットマップかどうか / Whether it is a bitmap
     * @param  {Float32Array} matrix          - 変換行列 / Transform matrix
     * @param  {Float32Array} color_transform - カラー変換パラメータ / Color transform parameters
     * @param  {IBlendMode}   blend_mode      - ブレンドモード / Blend mode
     * @param  {Float32Array} bounds          - バウンディングボックス / Bounding box
     * @param  {Float32Array} params          - フィルターパラメータ / Filter parameters
     * @return {void}
     */
    applyFilter (
        node: Node,
        _unique_key: string,
        _updated: boolean,
        width: number,
        height: number,
        _is_bitmap: boolean,
        matrix: Float32Array,
        color_transform: Float32Array,
        blend_mode: IBlendMode,
        bounds: Float32Array,
        params: Float32Array
    ): void {
        // インスタンス配列を先に描画
        this.drawArraysInstanced();

        // フレームが開始されていない場合は開始
        if (!this.frameStarted) {
            this.beginFrame();
        }

        // 既存のレンダーパスを終了（アトラスパス統合をリセット）
        if (this.renderPassEncoder) {
            this.renderPassEncoder.end();
            this.renderPassEncoder = null;
        }
        this.nodeRenderPassAtlasIndex = -1;

        // コマンドエンコーダーを確保
        this.ensureCommandEncoder();

        this.$filterConfig.commandEncoder = this.commandEncoder!;
        this.$filterConfig.mainAttachment = this.$mainAttachmentObject as IAttachmentObject;

        contextApplyFilterUseCase(
            node,
            width,
            height,
            _is_bitmap,
            matrix,
            color_transform,
            blend_mode,
            bounds,
            params,
            this.$filterConfig,
            this.mainTextureView!,
            this.bufferManager
        );
    }

    /**
     * @description コンテナのフィルター/ブレンド用のレイヤーを開始
     *              Begin a container layer for filter/blend processing
     *
     * @param  {number} width  - レイヤー幅 / Layer width
     * @param  {number} height - レイヤー高さ / Layer height
     * @return {void}
     */
    containerBeginLayer (width: number, height: number): void
    {
        this.drawArraysInstanced();

        // フレームが開始されていない場合は開始
        if (!this.frameStarted) {
            this.beginFrame();
        }

        // 既存のレンダーパスを終了
        if (this.renderPassEncoder) {
            this.renderPassEncoder.end();
            this.renderPassEncoder = null;
        }

        const mainAttachment = this.$mainAttachmentObject as IAttachmentObject;
        this.$containerLayerStack.push(mainAttachment);

        // コンテナのコンテンツサイズを保存（containerEndLayerでの抽出範囲計算に使用）
        this.containerLayerContentSizes.push({ width, height });

        // WebGL版と同じ: コンテンツサイズのbgra8unormアタッチメントを作成（mask=trueでステンシル付き）
        // children の transform は layerBounds で相対化されるため、コンテンツはレイヤー内の (0,0) から描画される
        const tempAttachment = this.frameBufferManager.createAttachment(
            "container_layer",
            width,
            height,
            mainAttachment.msaa,
            true
        );

        this.$mainAttachmentObject = tempAttachment;
        this.bind(tempAttachment);
    }

    /**
     * @description コンテナのフィルター/ブレンド用レイヤーを終了し、結果を元のメインに合成
     *              End the container layer and composite the result back to the original main
     *
     * @param  {IBlendMode}          blend_mode      - ブレンドモード / Blend mode
     * @param  {Float32Array}        matrix          - 変換行列 / Transform matrix
     * @param  {Float32Array | null} color_transform - カラー変換パラメータ / Color transform parameters
     * @param  {boolean}             use_filter      - フィルター使用フラグ / Whether to use filter
     * @param  {Float32Array | null} filter_bounds   - フィルターバウンド / Filter bounds
     * @param  {Float32Array | null} filter_params   - フィルターパラメータ / Filter parameters
     * @param  {string}              unique_key      - ユニークキー / Unique key
     * @param  {string}              filter_key      - フィルターキー / Filter key
     * @return {void}
     */
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
        this.drawArraysInstanced();

        // 既存のレンダーパスを終了
        if (this.renderPassEncoder) {
            this.renderPassEncoder.end();
            this.renderPassEncoder = null;
        }

        this.ensureCommandEncoder();

        const tempAttachment = this.$mainAttachmentObject as IAttachmentObject;
        const contentSize = this.containerLayerContentSizes.pop() || { "width": tempAttachment.width, "height": tempAttachment.height };

        // mainを復元
        this.$mainAttachmentObject = this.$containerLayerStack.pop() as IAttachmentObject;

        this.$filterConfig.commandEncoder = this.commandEncoder!;
        this.$filterConfig.mainAttachment = undefined;

        contextContainerEndLayerUseCase(
            tempAttachment,
            this.$mainAttachmentObject,
            "container_layer",
            blend_mode,
            matrix,
            color_transform,
            use_filter,
            filter_bounds,
            filter_params,
            unique_key,
            filter_key,
            contentSize.width,
            contentSize.height,
            this.$filterConfig,
            this.bufferManager
        );

        // メインのアタッチメントをバインド
        this.bind(this.$mainAttachmentObject);
    }

    /**
     * @description cacheAsBitmap: temp FBO作成→子要素描画開始
     *              Begin container cacheAsBitmap: create temp bgra8unorm FBO for children,
     *              allocate atlas node for later copy
     *
     * @param  {number} width  - ノード幅 / Node width
     * @param  {number} height - ノード高さ / Node height
     * @return {Node}
     */
    containerBeginAtlasNode (width: number, height: number): Node
    {
        this.drawArraysInstanced();

        // アトラスノードを確保（後でコピー先として使用）
        const node = this.createNode(width, height);
        this._pendingAtlasNodes.push(node);

        // mainをスタックに保存
        const mainAttachment = this.$mainAttachmentObject as IAttachmentObject;
        this.$containerLayerStack.push(mainAttachment);

        // 既存のレンダーパスを終了
        if (this.renderPassEncoder) {
            this.renderPassEncoder.end();
            this.renderPassEncoder = null;
        }

        // bgra8unormのtemp FBOを作成（全パイプラインが互換）
        const tempAttachment = this.frameBufferManager.createAttachment(
            "container_layer", width, height, mainAttachment.msaa, true
        );

        this.$mainAttachmentObject = tempAttachment;
        this.bind(tempAttachment);

        return node;
    }

    /**
     * @description cacheAsBitmap: temp FBO→アトラスノードへコピー
     *              End container cacheAsBitmap: copy temp FBO content to atlas node,
     *              release temp FBO
     *
     * @return {void}
     */
    containerEndAtlasNode (): void
    {
        this.drawArraysInstanced();

        // 既存のレンダーパスを終了（temp FBOのMSAAリゾルブが実行される）
        if (this.renderPassEncoder) {
            this.renderPassEncoder.end();
            this.renderPassEncoder = null;
        }

        this.ensureCommandEncoder();

        const tempAttachment = this.$mainAttachmentObject as IAttachmentObject;
        const node = this._pendingAtlasNodes.pop()!;

        // mainを復元
        this.$mainAttachmentObject = this.$containerLayerStack.pop() as IAttachmentObject;

        // temp FBO → アトラスノードへコピー
        this.copyTempToAtlasNode(tempAttachment, node);

        // temp FBOをリリース
        this.frameBufferManager.releaseTemporaryAttachment(tempAttachment);

        // メインをバインド
        this.bind(this.$mainAttachmentObject);
    }

    /**
     * @description temp FBOの内容をアトラスノード領域にコピー
     *              Copy temp FBO content to the atlas node region using texture_copy pipeline
     *
     * @param  {IAttachmentObject} temp_attachment - コピー元のtemp FBO / Source temp FBO
     * @param  {Node}              node            - コピー先のアトラスノード / Destination atlas node
     * @return {void}
     */
    private copyTempToAtlasNode (temp_attachment: IAttachmentObject, node: Node): void
    {
        const atlas = $getAtlasAttachmentObjectByIndex(node.index) || $getAtlasAttachmentObject();
        if (!atlas || !atlas.texture || !temp_attachment.texture) {
            return;
        }

        // アトラスはrgba8unormフォーマット（FrameBufferManagerCreateAttachmentUseCase参照）
        // atlas_*テクスチャはcopyExternalImageToTextureとの互換性のためrgba8unormで作成される
        const useMsaa = atlas.msaa && atlas.msaaTexture?.view;
        const pipelineName = useMsaa ? "texture_copy_rgba8_msaa" : "texture_copy_rgba8";
        const pipeline = this.pipelineManager.getPipeline(pipelineName);
        const bindGroupLayout = this.pipelineManager.getBindGroupLayout("texture_copy");
        if (!pipeline || !bindGroupLayout) {
            return;
        }

        // uniform: temp FBO全体をサンプリング（Y軸反転してアトラスに格納）
        // アトラスのShape描画はFillVertexのyFlipSign=1.0によりY反転で格納されるため、
        // cacheAsBitmapのコピーも同じ規則に合わせてY反転する
        // UV.y = texCoord.y * scaleY + offsetY = texCoord.y * (-1) + 1 = 1 - texCoord.y
        const uniformBuffer = this.bufferManager.acquireAndWriteUniformBuffer($atlasNodeCopyUniform);

        // サンプラーとソーステクスチャ（MSAAリゾルブ済みのテクスチャ）
        const sampler = this.textureManager.createSampler("container_atlas_copy", false);
        const srcView = temp_attachment.texture.view;

        const bindGroup = this.device.createBindGroup({
            "layout": bindGroupLayout,
            "entries": [
                { "binding": 0, "resource": { "buffer": uniformBuffer } },
                { "binding": 1, "resource": sampler },
                { "binding": 2, "resource": srcView }
            ]
        });

        // アトラスのノード領域にレンダーパスを作成
        const colorView = useMsaa ? atlas.msaaTexture!.view : atlas.texture.view;
        const resolveTarget = useMsaa ? atlas.texture.view : null;

        const renderPassDescriptor = this.frameBufferManager.createRenderPassDescriptor(
            colorView, 0, 0, 0, 0, "load", resolveTarget
        );

        const passEncoder = this.commandEncoder!.beginRenderPass(renderPassDescriptor);

        // ビューポートとシザーでノード領域に制限
        passEncoder.setViewport(node.x, node.y, node.w, node.h, 0, 1);
        passEncoder.setScissorRect(node.x, node.y, node.w, node.h);

        passEncoder.setPipeline(pipeline);
        passEncoder.setBindGroup(0, bindGroup);
        passEncoder.draw(6, 1, 0, 0);
        passEncoder.end();

        // アトラスレンダーパスインデックスをリセット（次のbeginNodeRenderingで新規作成させる）
        this.nodeRenderPassAtlasIndex = -1;
    }

    /**
     * @description キャッシュされたコンテナフィルターテクスチャをメインに描画
     *              Draw a cached container filter texture to the main attachment
     *
     * @param  {IBlendMode}   blend_mode      - ブレンドモード / Blend mode
     * @param  {Float32Array} matrix          - 変換行列 / Transform matrix
     * @param  {Float32Array} color_transform - カラー変換パラメータ / Color transform parameters
     * @param  {Float32Array} filter_bounds   - フィルターバウンド / Filter bounds
     * @param  {string}       unique_key      - ユニークキー / Unique key
     * @param  {string}       filter_key      - フィルターキー / Filter key
     * @return {void}
     */
    containerDrawCachedFilter (
        blend_mode: IBlendMode,
        matrix: Float32Array,
        color_transform: Float32Array,
        filter_bounds: Float32Array,
        unique_key: string,
        filter_key: string
    ): void {
        const cachedKey = $cacheStore.get(unique_key, "fKey");
        if (cachedKey !== filter_key) {
            return;
        }

        const cachedAttachment = $cacheStore.get(unique_key, "fTexture") as IAttachmentObject;
        if (!cachedAttachment || !cachedAttachment.texture) {
            return;
        }

        this.drawArraysInstanced();

        if (!this.frameStarted) {
            this.beginFrame();
        }

        if (this.renderPassEncoder) {
            this.renderPassEncoder.end();
            this.renderPassEncoder = null;
        }

        this.ensureCommandEncoder();

        const mainAttachment = this.$mainAttachmentObject as IAttachmentObject;
        if (!mainAttachment || !mainAttachment.texture) {
            return;
        }

        // ColorTransformが恒等変換でない場合、キャッシュのコピーにCTを適用
        let drawAttachment = cachedAttachment;
        let ctAttachment: IAttachmentObject | null = null;
        const isIdentityCt = color_transform[0] === 1 && color_transform[1] === 1
            && color_transform[2] === 1 && color_transform[3] === 1
            && color_transform[4] === 0 && color_transform[5] === 0
            && color_transform[6] === 0 && color_transform[7] === 0;
        if (!isIdentityCt) {
            ctAttachment = this.frameBufferManager.createTemporaryAttachment(
                cachedAttachment.width, cachedAttachment.height
            );
            const ctPipeline = this.pipelineManager.getPipeline("color_transform");
            const ctBindGroupLayout = this.pipelineManager.getBindGroupLayout("texture_copy");
            if (ctPipeline && ctBindGroupLayout && ctAttachment.texture) {
                $ctUniform8[0] = color_transform[0];
                $ctUniform8[1] = color_transform[1];
                $ctUniform8[2] = color_transform[2];
                $ctUniform8[3] = color_transform[3];
                $ctUniform8[4] = color_transform[4];
                $ctUniform8[5] = color_transform[5];
                $ctUniform8[6] = color_transform[6];
                $ctUniform8[7] = 0;
                const ctUniformData = $ctUniform8;
                const ctUniformBuffer = this.bufferManager.acquireAndWriteUniformBuffer(ctUniformData);
                const ctSampler = this.textureManager.createSampler("cached_ct_sampler", false);
                ($entries3[0].resource as GPUBufferBinding).buffer = ctUniformBuffer;
                $entries3[1].resource = ctSampler;
                $entries3[2].resource = cachedAttachment.texture.view;
                const ctBindGroup = this.device.createBindGroup({
                    "layout": ctBindGroupLayout,
                    "entries": $entries3
                });
                const ctRenderPass = this.frameBufferManager.createRenderPassDescriptor(
                    ctAttachment.texture.view, 0, 0, 0, 0, "clear"
                );
                const ctPass = this.commandEncoder!.beginRenderPass(ctRenderPass);
                ctPass.setPipeline(ctPipeline);
                ctPass.setBindGroup(0, ctBindGroup);
                ctPass.draw(6, 1, 0, 0);
                ctPass.end();
                drawAttachment = ctAttachment;
            }
        }

        const devicePixelRatio = WebGPUUtil.getDevicePixelRatio();
        const scaleX = Math.sqrt(matrix[0] * matrix[0] + matrix[1] * matrix[1]);
        const scaleY = Math.sqrt(matrix[2] * matrix[2] + matrix[3] * matrix[3]);
        const boundsXMin = filter_bounds[0] * (scaleX / devicePixelRatio);
        const boundsYMin = filter_bounds[1] * (scaleY / devicePixelRatio);

        // WebGL版と同じ: boundsXMin + matrix[4] で絶対位置（$offsetは使わない）
        const drawX = Math.floor(boundsXMin + matrix[4]);
        const drawY = Math.floor(boundsYMin + matrix[5]);

        // シンプルなブレンドモード判定
        const useMsaa = mainAttachment.msaa && mainAttachment.msaaTexture?.view;
        let pipelineName: string;
        switch (blend_mode) {
            case "add":
                pipelineName = useMsaa ? "filter_output_add_msaa" : "filter_output_add";
                break;
            case "screen":
                pipelineName = useMsaa ? "filter_output_screen_msaa" : "filter_output_screen";
                break;
            case "alpha":
                pipelineName = useMsaa ? "filter_output_alpha_msaa" : "filter_output_alpha";
                break;
            case "erase":
                pipelineName = useMsaa ? "filter_output_erase_msaa" : "filter_output_erase";
                break;
            default:
                pipelineName = useMsaa ? "filter_output_msaa" : "filter_output";
                break;
        }

        const pipeline = this.pipelineManager.getPipeline(pipelineName);
        const bindGroupLayout = this.pipelineManager.getBindGroupLayout("texture_copy");
        if (!pipeline || !bindGroupLayout) {
            return;
        }

        const sampler = this.textureManager.createSampler("cached_filter_sampler", true);
        const uniformBuffer = this.bufferManager.acquireAndWriteUniformBuffer($IDENTITY_UV);

        ($entries3[0].resource as GPUBufferBinding).buffer = uniformBuffer;
        $entries3[1].resource = sampler;
        $entries3[2].resource = drawAttachment.texture!.view;
        const bindGroup = this.device.createBindGroup({
            "layout": bindGroupLayout,
            "entries": $entries3
        });

        const colorView = useMsaa ? mainAttachment.msaaTexture!.view : mainAttachment.texture.view;
        const resolveTarget = useMsaa ? mainAttachment.texture.view : null;
        const renderPassDescriptor = this.frameBufferManager.createRenderPassDescriptor(
            colorView, 0, 0, 0, 0, "load", resolveTarget
        );

        const vpX = Math.max(0, drawX);
        const vpY = Math.max(0, drawY);
        const vpW = Math.max(1, drawAttachment.width);
        const vpH = Math.max(1, drawAttachment.height);
        const mainWidth = mainAttachment.width;
        const mainHeight = mainAttachment.height;
        const scissorW = Math.max(1, Math.min(vpW, mainWidth - vpX));
        const scissorH = Math.max(1, Math.min(vpH, mainHeight - vpY));

        if (scissorW <= 0 || scissorH <= 0 || vpX >= mainWidth || vpY >= mainHeight) {
            if (ctAttachment) {
                this.frameBufferManager.releaseTemporaryAttachment(ctAttachment);
            }
            return;
        }

        const passEncoder = this.commandEncoder!.beginRenderPass(renderPassDescriptor);
        passEncoder.setPipeline(pipeline);
        passEncoder.setBindGroup(0, bindGroup);
        passEncoder.setViewport(vpX, vpY, vpW, vpH, 0, 1);
        passEncoder.setScissorRect(vpX, vpY, scissorW, scissorH);
        passEncoder.draw(6, 1, 0, 0);
        passEncoder.end();

        // CT一時アタッチメントを解放
        if (ctAttachment) {
            this.frameBufferManager.releaseTemporaryAttachment(ctAttachment);
        }

        this.bind(mainAttachment);
    }

    /**
     * @description メインテクスチャを確保（フレーム開始時に一度だけgetCurrentTexture呼び出し）
     *              Ensure the main texture is acquired (calls getCurrentTexture once per frame)
     *
     * @return {void}
     */
    private ensureMainTexture(): void
    {
        if (!this.mainTexture) {
            // リサイズ後はcanvas.width/heightが$resizeComplete()で更新されているので
            // ここでconfigure()を呼んでからgetCurrentTexture()を取得する
            if (this.$needsReconfigure) {
                this.canvasContext.configure({
                    "device": this.device,
                    "format": this.preferredFormat,
                    "alphaMode": "premultiplied"
                });
                this.$needsReconfigure = false;
            }
            this.mainTexture = this.canvasContext.getCurrentTexture();
            this.mainTextureView = this.mainTexture.createView();
        }
    }

    /**
     * @description 現在の描画ターゲットのテクスチャビューを取得
     *              Get the texture view of the current render target
     *
     * @return {GPUTextureView} 現在のテクスチャビュー / Current texture view
     */
    private getCurrentTextureView(): GPUTextureView
    {
        // アトラステクスチャへのレンダリング中の場合
        if (this.currentRenderTarget) {
            return this.currentRenderTarget;
        }

        // メインキャンバステクスチャを確保
        this.ensureMainTexture();
        return this.mainTextureView!;
    }

    /**
     * @description コマンドエンコーダーが存在することを保証
     *              Ensure the command encoder exists
     *
     * @return {void}
     */
    private ensureCommandEncoder(): void
    {
        // Note: RenderPassEncoderの終了はここでは行わない
        // 呼び出し側で適切に管理すること

        if (!this.commandEncoder) {
            this.commandEncoder = this.device.createCommandEncoder();
        }
    }

    /**
     * @description フレーム開始（レンダリング開始前に呼ぶ）
     *              Begin a new frame (call before rendering starts)
     *
     * @return {void}
     */
    beginFrame(): void
    {
        if (!this.frameStarted) {
            this.ensureMainTexture();
            this.ensureCommandEncoder();
            this.frameStarted = true;
            this.frameBufferManager.beginFrame();

            // 注意: グラデーションLUTは共有テクスチャに描画されるため、
            // キャッシュは使用しません。各フレームで再描画が必要です。
        }
    }

    /**
     * @description フレームごとのプール管理テクスチャを追加（endFrame()でプールに返却）
     *              Add a pooled texture for the current frame (returned to pool in endFrame())
     *
     * @param  {GPUTexture} texture - プール管理テクスチャ / Pooled texture
     * @return {void}
     */
    addFrameTexture (texture: GPUTexture): void
    {
        this.pooledTextures.push(texture);
    }

    /**
     * @description フレーム終了とコマンド送信（レンダリング完了後に呼ぶ）
     *              End the frame and submit commands (call after rendering is complete)
     *
     * @return {void}
     */
    endFrame(): void
    {
        if (!this.frameStarted) {
            return;
        }

        // 開いているRenderPassEncoderがあれば終了
        if (this.renderPassEncoder) {
            this.renderPassEncoder.end();
            this.renderPassEncoder = null;
        }

        // DynamicUniformAllocatorのステージングバッファをGPUに一括書き込み
        this.bufferManager.dynamicUniform.flush();

        // コマンドをsubmit
        if (this.commandEncoder) {
            try {
                const commandBuffer = this.commandEncoder.finish();
                this.device.queue.submit([commandBuffer]);
            } catch (e) {
                console.error("Failed to submit frame commands:", e);
            }
        }

        // submit後に一時テクスチャを解放
        this.frameBufferManager.flushPendingReleases();

        // フレームごとの一時バッファを解放
        this.bufferManager.clearFrameBuffers();

        // フレームごとの一時テクスチャを解放
        for (const texture of this.frameTextures) {
            texture.destroy();
        }
        this.frameTextures.length = 0;

        // プール管理テクスチャをプールに返却
        for (const texture of this.pooledTextures) {
            $releaseFillTexture(texture);
        }
        this.pooledTextures.length = 0;

        // レンダーテクスチャをプールに返却
        for (const texture of this.pooledRenderTextures) {
            $releaseRenderTexture(texture);
        }
        this.pooledRenderTextures.length = 0;

        // Gradient LUTキャッシュのTTL超過エントリを解放
        $cleanupLUTCache();

        // Dynamic Uniform BindGroupをリセット（バッファオフセットがリセットされるため）
        this.fillDynamicBindGroup = null;
        this.fillDynamicBindGroupBuffer = null;

        // 次のフレーム用にクリア
        this.commandEncoder = null;
        this.renderPassEncoder = null;
        this.currentRenderTarget = null;
        this.nodeRenderPassAtlasIndex = -1;

        // テクスチャ参照をクリア（次フレームで新しく取得）
        this.mainTexture = null;
        this.mainTextureView = null;
        this.frameStarted = false;
    }

    /**
     * @description コマンドを送信（後方互換性のため残す）
     *              Submit commands (kept for backward compatibility)
     *
     * @return {void}
     */
    submit (): void
    {
        this.endFrame();
    }

    /**
     * @description ノードを作成
     *              Create a node in the texture atlas
     *              アトラスがいっぱいの場合は新しいアトラスを作成して再試行
     *
     * @param  {number} width  - ノード幅 / Node width
     * @param  {number} height - ノード高さ / Node height
     * @return {Node} 作成されたノード / Created node
     */
    createNode (width: number, height: number): Node
    {
        // WebGPU node creation implementation using texture-packer
        const index = $getActiveAtlasIndex();

        if (!$rootNodes[index]) {
            const maxSize = WebGPUUtil.getRenderMaxSize();
            $rootNodes[index] = new TexturePacker(index, maxSize, maxSize);
        }

        const rootNode = $rootNodes[index];
        const node = rootNode.insert(width, height);

        if (!node) {
            // アトラスがいっぱいの場合、新しいアトラスインデックスに切り替えて再試行
            $setActiveAtlasIndex(index + 1);
            return this.createNode(width, height);
        }

        return node;
    }

    /**
     * @description ノードを削除
     *              Remove a node from the texture atlas
     *
     * @param  {Node} node - 削除対象ノード / Node to remove
     * @return {void}
     */
    removeNode (node: Node): void
    {
        // WebGPU node removal implementation
        const index = node.index;
        const rootNode = $rootNodes[index];

        if (rootNode) {
            rootNode.dispose(node.x, node.y, node.w, node.h);
        }
    }

    /**
     * @description フレームバッファの描画情報をキャンバスに転送
     *              Transfer frame buffer contents to the canvas
     *              スワップチェーンはCopyDstをサポートしないため、レンダーパスでブリット
     *
     * @return {void}
     */
    transferMainCanvas (): void
    {
        // メインアタッチメントの内容をスワップチェーン（キャンバス）にコピー
        if (!this.$mainAttachmentObject || !this.$mainAttachmentObject.texture) {
            this.endFrame();
            return;
        }

        // 既存のレンダーパスを終了
        if (this.renderPassEncoder) {
            this.renderPassEncoder.end();
            this.renderPassEncoder = null;
        }

        // コマンドエンコーダーを確保
        this.ensureCommandEncoder();

        // メインテクスチャビューを確保
        this.ensureMainTexture();

        // スワップチェーンはCopyDstをサポートしないため、レンダーパスでブリット
        const pipeline = this.pipelineManager.getPipeline("texture_copy_bgra");
        const bindGroupLayout = this.pipelineManager.getBindGroupLayout("texture_copy");

        if (!pipeline || !bindGroupLayout) {
            console.error("[WebGPU] texture_copy_bgra pipeline not found");
            this.endFrame();
            return;
        }

        // Static BindGroup キャッシュ: mainAttachment.texture.viewが同じ間は再利用
        const currentView = this.$mainAttachmentObject.texture.view;
        if (!$presentBindGroup || $presentBindGroupView !== currentView) {
            if (!$presentUniformBuffer) {
                $presentUniformBuffer = this.device.createBuffer({
                    "size": $IDENTITY_UV.byteLength,
                    "usage": GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
                });
                this.device.queue.writeBuffer($presentUniformBuffer, 0, $IDENTITY_UV.buffer, $IDENTITY_UV.byteOffset, $IDENTITY_UV.byteLength);
            }
            const sampler = this.textureManager.createSampler("transfer_sampler", false);
            $entries3[0].resource = { "buffer": $presentUniformBuffer };
            $entries3[1].resource = sampler;
            $entries3[2].resource = currentView;
            $presentBindGroup = this.device.createBindGroup({
                "layout": bindGroupLayout,
                "entries": $entries3
            });
            $presentBindGroupView = currentView;
        }
        const bindGroup = $presentBindGroup;

        // スワップチェーンへのレンダーパスを作成（プリアロケート版）
        $presentColorAttachment.view = this.mainTextureView!;

        const passEncoder = this.commandEncoder!.beginRenderPass($presentDescriptor);
        passEncoder.setPipeline(pipeline);
        passEncoder.setBindGroup(0, bindGroup);
        passEncoder.draw(6, 1, 0, 0); // フルスクリーンクワッド（6頂点）
        passEncoder.end();

        // endFrame()でsubmitされる
        this.endFrame();
    }

    /**
     * @description ImageBitmapを生成
     *              Create an ImageBitmap from the current rendering result
     *
     * @param  {number} width  - 画像幅 / Image width
     * @param  {number} height - 画像高さ / Image height
     * @return {Promise<ImageBitmap>} 生成されたImageBitmap / Created ImageBitmap
     */
    async createImageBitmap (width: number, height: number): Promise<ImageBitmap>
    {
        // メインアタッチメントから合成済み描画結果を取得
        // （drawArraysInstanced()がアトラスからメインアタッチメントへ合成済み）
        const mainAttachment = this.$mainAttachmentObject;
        if (!mainAttachment || !mainAttachment.texture) {
            throw new Error("[WebGPU] Main attachment not found");
        }

        // 描画を完了
        if (this.renderPassEncoder) {
            this.renderPassEncoder.end();
            this.renderPassEncoder = null;
        }

        // GPUバッファにピクセルデータを読み込み
        const bytesPerPixel = 4;
        const bytesPerRow = Math.ceil(width * bytesPerPixel / 256) * 256; // 256バイトアライメント
        const bufferSize = bytesPerRow * height;

        // ピクセルバッファを作成
        const pixelBuffer = this.device.createBuffer({
            "size": bufferSize,
            "usage": GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ
        });

        // フレームのcommandEncoderにcopyコマンドを追加
        // 描画コマンドの後にコピーが実行されるため、正しい順序が保証される
        this.ensureCommandEncoder();

        this.commandEncoder!.copyTextureToBuffer(
            {
                "texture": mainAttachment.texture.resource,
                "mipLevel": 0,
                "origin": { "x": 0, "y": 0, "z": 0 }
            },
            {
                "buffer": pixelBuffer,
                "bytesPerRow": bytesPerRow,
                "rowsPerImage": height
            },
            {
                "width": width,
                "height": height,
                "depthOrArrayLayers": 1
            }
        );

        // endFrame()で描画コマンドとcopyコマンドを一括submit
        // swap chain textureの参照もクリアされる
        this.endFrame();

        // バッファをマップして読み込み
        await pixelBuffer.mapAsync(GPUMapMode.READ);
        const mappedRange = pixelBuffer.getMappedRange();
        const pixels = new Uint8Array(mappedRange);

        // メインアタッチメントはbgra8unormフォーマットのため、
        // ImageData（RGBA）用にB⇔Rチャンネルをスワップしつつコピー
        const isBgra = this.preferredFormat === "bgra8unorm";
        const resultPixels = new Uint8Array(width * height * 4);
        const rowBytes = width * 4;
        for (let y = 0; y < height; y++) {
            const srcOffset = y * bytesPerRow;
            const dstOffset = y * rowBytes;
            if (isBgra) {
                for (let x = 0; x < rowBytes; x += 4) {
                    resultPixels[dstOffset + x    ] = pixels[srcOffset + x + 2]; // R ← B
                    resultPixels[dstOffset + x + 1] = pixels[srcOffset + x + 1]; // G
                    resultPixels[dstOffset + x + 2] = pixels[srcOffset + x    ]; // B ← R
                    resultPixels[dstOffset + x + 3] = pixels[srcOffset + x + 3]; // A
                }
            } else {
                resultPixels.set(
                    pixels.subarray(srcOffset, srcOffset + rowBytes),
                    dstOffset
                );
            }
        }

        pixelBuffer.unmap();
        pixelBuffer.destroy();

        // プリマルチプライドアルファをストレートアルファに変換
        const inv = new Float32Array(256);
        for (let a = 1; a < 256; a++) {
            inv[a] = 255 / a;
        }

        for (let idx = 0; idx < resultPixels.length; idx += 4) {
            const alpha = resultPixels[idx + 3];

            if (alpha === 0 || alpha === 255) {
                continue;
            }

            const f = inv[alpha];
            resultPixels[idx    ] = Math.min(255, Math.round(resultPixels[idx    ] * f));
            resultPixels[idx + 1] = Math.min(255, Math.round(resultPixels[idx + 1] * f));
            resultPixels[idx + 2] = Math.min(255, Math.round(resultPixels[idx + 2] * f));
        }

        // ImageBitmapを作成
        const imageData = new ImageData(new Uint8ClampedArray(resultPixels), width, height);

        // グローバルのcreateBitmapが存在するかチェック
        if (typeof createImageBitmap !== "undefined") {
            return await createImageBitmap(imageData, {
                "premultiplyAlpha": "none",
                "colorSpaceConversion": "none"
            });
        }
        // Fallback: createImageBitmapがない環境用
        throw new Error("[WebGPU] createImageBitmap not available in this environment");

    }

    /**
     * @description マスク描画の開始準備
     *              Prepare to start drawing the mask
     *
     * @return {void}
     */
    beginMask(): void
    {
        // メインアタッチメントをバインド（マスクはメインアタッチメントのステンシルに書き込む）
        if (this.$mainAttachmentObject) {
            this.bind(this.$mainAttachmentObject);
        }

        // マスクモードではメインアタッチメントに描画するため、currentRenderTargetをnullに設定
        // これにより、fill()等がメイン用シェーダー（Y反転あり）を使用する
        this.currentRenderTarget = null;

        // 既存のレンダーパスを終了
        if (this.renderPassEncoder) {
            this.renderPassEncoder.end();
            this.renderPassEncoder = null;
        }

        // フレームが開始されていない場合は開始
        if (!this.frameStarted) {
            this.beginFrame();
        }

        // コマンドエンコーダーを確保
        this.ensureCommandEncoder();

        // ステンシル付きレンダーパスを開始（マスク描画用）
        if (this.$mainAttachmentObject?.texture && this.$mainAttachmentObject?.stencil?.view) {
            // 最初のマスク（clipLevel == 0）の場合はステンシルをクリア
            // ネストされたマスクの場合は既存のステンシル値を保持
            const isFirstMask = this.$mainAttachmentObject.clipLevel === 0;
            const stencilLoadOp = isFirstMask ? "clear" : "load";

            // MSAA有効時はmsaaTexture/msaaStencilを使用（sampleCount一致が必要）
            // resolveTargetは設定しない: clip()はwriteMask=0でcolorを変更しないため、
            // resolveでtexture.viewを上書きすると、先にtexture.viewに描画された内容が消える
            const mainUseMsaa = this.$mainAttachmentObject.msaa && this.$mainAttachmentObject.msaaTexture?.view;
            const colorView = mainUseMsaa
                ? this.$mainAttachmentObject.msaaTexture!.view
                : this.$mainAttachmentObject.texture.view;
            const stencilView = mainUseMsaa && this.$mainAttachmentObject.msaaStencil?.view
                ? this.$mainAttachmentObject.msaaStencil.view
                : this.$mainAttachmentObject.stencil.view;

            const renderPassDescriptor = this.frameBufferManager.createStencilRenderPassDescriptor(
                colorView,
                stencilView,
                "load", // カラーは既存の内容を保持
                stencilLoadOp  // 最初のマスク: クリア、ネスト: 保持
            );
            this.renderPassEncoder = this.commandEncoder!.beginRenderPass(renderPassDescriptor);

            // ビューポートサイズを更新
            this.viewportWidth = this.$mainAttachmentObject.width;
            this.viewportHeight = this.$mainAttachmentObject.height;
        }

        maskBeginMaskService();

        // マスクモードフラグを設定
        this.inMaskMode = true;
    }

    /**
     * @description マスクの描画範囲を設定
     *              Set the mask drawing bounds
     *
     * @param  {number} x_min - 最小X座標 / Minimum X coordinate
     * @param  {number} y_min - 最小Y座標 / Minimum Y coordinate
     * @param  {number} x_max - 最大X座標 / Maximum X coordinate
     * @param  {number} y_max - 最大Y座標 / Maximum Y coordinate
     * @return {void}
     */
    setMaskBounds(
        x_min: number,
        y_min: number,
        x_max: number,
        y_max: number
    ): void {
        maskSetMaskBoundsService(x_min, y_min, x_max, y_max);
    }

    /**
     * @description マスクの描画を終了
     *              End mask drawing
     *
     * @return {void}
     */
    endMask(): void
    {
        // マスク描画用のレンダーパスを終了
        if (this.renderPassEncoder) {
            this.renderPassEncoder.end();
            this.renderPassEncoder = null;
        }

        maskEndMaskService();

        // マスクモードフラグをクリア
        this.inMaskMode = false;
    }

    /**
     * @description マスクの終了処理
     *              Mask end processing (leave the mask)
     *
     * @return {void}
     */
    leaveMask(): void
    {
        this.drawArraysInstanced();

        // 現在のclipLevelを保存（leaveMaskUseCase内でデクリメントされる）
        const currentAttachment = this.frameBufferManager.getCurrentAttachment();
        const currentClipLevel = currentAttachment?.clipLevel ?? 0;
        const wasLastMask = currentClipLevel === 1;

        maskLeaveMaskUseCase();

        // 現在のレンダーパスを終了
        if (this.renderPassEncoder) {
            this.renderPassEncoder.end();
            this.renderPassEncoder = null;
        }

        // コマンドエンコーダーを確保
        this.ensureCommandEncoder();

        // MSAA有効時はmsaaTexture/msaaStencilを使用
        const leaveMsaa = this.$mainAttachmentObject?.msaa && this.$mainAttachmentObject?.msaaTexture?.view;
        const leaveColorView = leaveMsaa
            ? this.$mainAttachmentObject!.msaaTexture!.view
            : this.$mainAttachmentObject?.texture!.view;
        const leaveStencilView = leaveMsaa && this.$mainAttachmentObject?.msaaStencil?.view
            ? this.$mainAttachmentObject!.msaaStencil!.view
            : this.$mainAttachmentObject?.stencil?.view;
        if (wasLastMask && leaveStencilView) {
            // 単体マスク（最後のマスク）の場合、ステンシルバッファをクリア
            // WebGL: gl.clear(STENCIL_BUFFER_BIT)
            // resolveTargetは設定しない（ステンシルクリアのみが目的で、カラーの上書きを防ぐ）
            const clearPassDescriptor: GPURenderPassDescriptor = {
                "colorAttachments": [{
                    "view": leaveColorView!,
                    "loadOp": "load" as GPULoadOp,
                    "storeOp": "store" as GPUStoreOp
                }],
                "depthStencilAttachment": {
                    "view": leaveStencilView,
                    "stencilLoadOp": "clear", // ステンシルをクリア
                    "stencilStoreOp": "store",
                    "stencilClearValue": 0
                }
            };
            const clearPass = this.commandEncoder!.beginRenderPass(clearPassDescriptor);
            clearPass.end();
        } else if (currentClipLevel > 1 && leaveStencilView) {
            // ネストされたマスクの場合、上位レベルのステンシルビットをクリア
            // WebGL: stencilMask(1 << clipLevel), stencilOp(REPLACE, REPLACE, REPLACE)
            // 全画面矩形を描画してステンシルビットをクリア
            const clearLevel = currentClipLevel; // デクリメント前のレベル
            const clampedLevel = Math.min(8, Math.max(1, clearLevel));
            const pipelineName = `clip_clear_main_${clampedLevel}`;
            const pipeline = this.pipelineManager.getPipeline(pipelineName);

            if (pipeline) {
                // ステンシル付きレンダーパスを開始
                // resolveTargetなし: clip_clear_mainはwriteMask=0でcolorを変更しない
                const renderPassDescriptor = this.frameBufferManager.createStencilRenderPassDescriptor(
                    leaveColorView!,
                    leaveStencilView,
                    "load", // カラーは保持
                    "load"  // ステンシルは保持（特定のビットのみクリア）
                );
                const passEncoder = this.commandEncoder!.beginRenderPass(renderPassDescriptor);

                // 全画面矩形を描画（ステンシルビットをクリア）
                // 17-float vertex buffer format for clip pipelines
                // Format: position(2) + bezier(2) + color(4) + matrix(9) = 17 floats
                // Matrix is identity: row0=(1,0,0), row1=(0,1,0), row2=(0,0,1)
                const meshBuffer = this.bufferManager.acquireVertexBuffer($FULLSCREEN_MESH.byteLength, $FULLSCREEN_MESH);

                passEncoder.setPipeline(pipeline);
                passEncoder.setStencilReference(0); // 参照値0でREPLACE
                passEncoder.setVertexBuffer(0, meshBuffer);
                passEncoder.draw(6, 1, 0, 0);
                passEncoder.end();
            }
        }
    }

}
