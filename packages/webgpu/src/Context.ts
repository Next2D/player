import type { IAttachmentObject } from "./interface/IAttachmentObject";
import type { IBlendMode } from "./interface/IBlendMode";
import type { IBounds } from "./interface/IBounds";
import type { IPath } from "./interface/IPath";
import type { Node } from "@next2d/texture-packer";
import { TexturePacker } from "@next2d/texture-packer";
import { WebGPUUtil, $setContext } from "./WebGPUUtil";
import { PathCommand } from "./PathCommand";
import { BufferManager } from "./BufferManager";
import { TextureManager } from "./TextureManager";
import { FrameBufferManager } from "./FrameBufferManager";
import { AttachmentManager } from "./AttachmentManager";
import { PipelineManager } from "./Shader/PipelineManager";
import { $rootNodes, $resetAtlas } from "./AtlasManager";
import { addDisplayObjectToInstanceArray, getInstancedShaderManager } from "./Blend/BlendInstancedManager";
// Note: MeshStrokeGenerateUseCase is now used via ContextStrokeUseCase
import { execute as maskBeginMaskService } from "./Mask/service/MaskBeginMaskService";
import { execute as maskSetMaskBoundsService } from "./Mask/service/MaskSetMaskBoundsService";
import { execute as maskEndMaskService } from "./Mask/service/MaskEndMaskService";
import { execute as maskLeaveMaskUseCase } from "./Mask/usecase/MaskLeaveMaskUseCase";
import {
    $isMaskTestEnabled,
    $getMaskStencilReference,
    $resetMaskState
} from "./Mask";
import { execute as meshFillGenerateUseCase } from "./Mesh/usecase/MeshFillGenerateUseCase";
// Note: MeshGradientStrokeGenerateUseCase and MeshBitmapStrokeGenerateUseCase
// are now used via ContextGradientStrokeUseCase and ContextBitmapStrokeUseCase
// Note: Filter usecases are now used via ContextApplyFilterUseCase
// Note: $clipBounds, $clipLevels are used via ContextClipUseCase
// Note: generateGradientLUT, getAdaptiveResolution are used via ContextGradientFillUseCase
import {
    $gridDataMap,
    $fillBufferIndex,
    $terminateGrid
} from "./Grid";
import {
    $setGradientLUTDevice,
    $clearGradientAttachmentObjects
} from "./Gradient/GradientLUTCache";
import {
    $setFilterGradientLUTDevice,
    $clearFilterGradientAttachment
} from "./Filter/FilterGradientLUTCache";

// Context services
import { execute as contextFillWithStencilService } from "./Context/service/ContextFillWithStencilService";
import { execute as contextFillSimpleService } from "./Context/service/ContextFillSimpleService";
// Note: contextComputeGradientMatrixService and contextComputeBitmapMatrixService
// are now used via ContextGradientFillUseCase and ContextBitmapFillUseCase

// Context usecases
import { execute as contextGradientFillUseCase } from "./Context/usecase/ContextGradientFillUseCase";
import { execute as contextBitmapFillUseCase } from "./Context/usecase/ContextBitmapFillUseCase";
import { execute as contextGradientStrokeUseCase } from "./Context/usecase/ContextGradientStrokeUseCase";
import { execute as contextBitmapStrokeUseCase } from "./Context/usecase/ContextBitmapStrokeUseCase";
// Note: ContextStrokeUseCase is no longer used - stroke rendering is now inline in stroke() method
import { execute as contextClipUseCase } from "./Context/usecase/ContextClipUseCase";
import { execute as contextDrawArraysInstancedUseCase } from "./Context/usecase/ContextDrawArraysInstancedUseCase";
import { execute as contextProcessComplexBlendQueueUseCase } from "./Context/usecase/ContextProcessComplexBlendQueueUseCase";
import { execute as contextApplyFilterUseCase } from "./Context/usecase/ContextApplyFilterUseCase";

/**
 * @description WebGPU版、Next2Dのコンテキスト
 *              WebGPU version, Next2D context
 *
 * @class
 */
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

    private device: GPUDevice;
    private canvasContext: GPUCanvasContext;
    private preferredFormat: GPUTextureFormat;
    private commandEncoder: GPUCommandEncoder | null = null;
    private renderPassEncoder: GPURenderPassEncoder | null = null;

    // Main canvas texture (for final display) - acquired once per frame
    private mainTexture: GPUTexture | null = null;
    private mainTextureView: GPUTextureView | null = null;
    private frameStarted: boolean = false;

    // フレームごとの一時テクスチャ（endFrame()で解放）
    private frameTextures: GPUTexture[] = [];

    // Current rendering target (could be main or atlas)
    private currentRenderTarget: GPUTextureView | null = null;

    // Current viewport size (WebGL版と同じ: アトラス描画時はアトラスサイズを使用)
    private viewportWidth: number = 0;
    private viewportHeight: number = 0;

    private pathCommand: PathCommand;
    private bufferManager: BufferManager;
    private textureManager: TextureManager;
    private frameBufferManager: FrameBufferManager;
    private pipelineManager: PipelineManager;
    private attachmentManager: AttachmentManager;

    public newDrawState: boolean = false;

    // マスク描画モードフラグ（beginMask〜endMask間でtrue）
    private inMaskMode: boolean = false;

    /**
     * @param {GPUDevice} device
     * @param {GPUCanvasContext} canvas_context
     * @param {GPUTextureFormat} preferred_format
     * @param {number} [device_pixel_ratio=1]
     * @constructor
     * @public
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

        // Set render max size similar to WebGL (half of max texture size, capped at 4096)
        const maxTextureSize = device.limits.maxTextureDimension2D;
        const renderMaxSize = Math.min(4096, maxTextureSize / 2);
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
        this.caps       = 1;
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
        this.attachmentManager = new AttachmentManager(device);

        // グラデーションLUT共有アタッチメントにGPUDeviceを設定
        $setGradientLUTDevice(device);
        $setFilterGradientLUTDevice(device);

        // コンテキストをグローバル変数にセット
        $setContext(this);
    }

    /**
     * @description 転送範囲をリセット（フレーム開始）
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
     * @param {number} red
     * @param {number} green
     * @param {number} blue
     * @param {number} alpha
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
     * @return {void}
     */
    fillBackgroundColor (): void
    {
        // メインアタッチメントがない場合はスキップ
        if (!this.$mainAttachmentObject || !this.$mainAttachmentObject.texture) {
            console.warn("[WebGPU] fillBackgroundColor: main attachment not initialized");
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
        const renderPassDescriptor: GPURenderPassDescriptor = {
            "colorAttachments": [{
                "view": this.$mainAttachmentObject.texture.view,
                "clearValue": {
                    "r": this.$clearColorR,
                    "g": this.$clearColorG,
                    "b": this.$clearColorB,
                    "a": this.$clearColorA
                },
                "loadOp": "clear",
                "storeOp": "store"
            }]
        };

        // ステンシルバッファもクリア
        if (this.$mainAttachmentObject.stencil?.view) {
            renderPassDescriptor.depthStencilAttachment = {
                "view": this.$mainAttachmentObject.stencil.view,
                "stencilClearValue": 0,
                "stencilLoadOp": "clear",
                "stencilStoreOp": "store"
            };
        }

        // 背景クリア用のレンダーパスを開始して即座に終了
        this.renderPassEncoder = this.commandEncoder!.beginRenderPass(renderPassDescriptor);
        this.renderPassEncoder.end();
        this.renderPassEncoder = null;
    }

    /**
     * @description メインcanvasのサイズを変更
     * @param {number} width
     * @param {number} height
     * @param {boolean} cache_clear
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
        this.frameTextures = [];

        // フレーム状態をリセット（リサイズ中は新しいフレームを開始できるようにする）
        this.frameStarted = false;
        this.commandEncoder = null;
        this.renderPassEncoder = null;
        this.currentRenderTarget = null;

        // マスク状態をリセット
        $resetMaskState();

        // キャンバスのサイズを更新
        const canvas = this.canvasContext.canvas;

        // 型チェックを安全に実行（Worker環境対応）
        if (canvas && "width" in canvas && "height" in canvas) {
            (canvas as any).width = width;
            (canvas as any).height = height;
        }

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
            $clearFilterGradientAttachment();
            // アトラスのパッキングデータをリセット（WebGL版と同じ）
            $resetAtlas();
            // FrameBufferManagerのアトラステクスチャを再作成（古いコンテンツをクリア）
            this.frameBufferManager.destroyAttachment("atlas");
            this.frameBufferManager.createAttachment("atlas", 4096, 4096);
        }

        // アンバインド（WebGL版と同じ）
        this.frameBufferManager.setCurrentAttachment(null);

        // canvasContextを再設定
        this.canvasContext.configure({
            "device": this.device,
            "format": this.preferredFormat,
            "alphaMode": "premultiplied"
        });

        // リサイズ時にスワップチェーンテクスチャをリセット
        // 古いテクスチャ参照を解放して、次のフレームで新しいサイズのテクスチャを取得
        this.mainTexture = null;
        this.mainTextureView = null;

        // メインアタッチメントを作成（ステンシル付き、マスク描画用）
        // WebGL版と同じ: $mainAttachmentObject = frameBufferManagerGetAttachmentObjectUseCase(width, height, true)
        this.$mainAttachmentObject = this.frameBufferManager.createAttachment(
            "main", width, height, false, false
        );

        // メインアタッチメントをバインド
        this.bind(this.$mainAttachmentObject);
    }

    /**
     * @description 指定範囲をクリアする
     * @param {number} x
     * @param {number} y
     * @param {number} w
     * @param {number} h
     * @return {void}
     */
    clearRect (_x: number, _y: number, _w: number, _h: number): void
    {
        // WebGPU clear rect implementation
        // WebGPUではclearはレンダーパス開始時に行うため、ここでは何もしない
        // 実際のクリアはbeginNodeRenderingやbeginFrameで行われる
    }

    /**
     * @description 現在の2D変換行列を保存
     * @return {void}
     */
    save (): void
    {
        const matrix = new Float32Array(9);
        matrix.set(this.$matrix);
        this.$stack.push(matrix);
    }

    /**
     * @description 2D変換行列を復元
     * @return {void}
     */
    restore (): void
    {
        const matrix = this.$stack.pop();
        if (matrix) {
            this.$matrix.set(matrix);
        }
    }

    /**
     * @description 2D変換行列を設定
     * @param {number} a
     * @param {number} b
     * @param {number} c
     * @param {number} d
     * @param {number} e
     * @param {number} f
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
     * @param {number} a
     * @param {number} b
     * @param {number} c
     * @param {number} d
     * @param {number} e
     * @param {number} f
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
     * @return {void}
     */
    beginPath (): void
    {
        this.pathCommand.beginPath();
    }

    /**
     * @description パスを移動
     * @param {number} x
     * @param {number} y
     * @return {void}
     */
    moveTo (x: number, y: number): void
    {
        this.pathCommand.moveTo(x, y);
    }

    /**
     * @description パスを線で結ぶ
     * @param {number} x
     * @param {number} y
     * @return {void}
     */
    lineTo (x: number, y: number): void
    {
        this.pathCommand.lineTo(x, y);
    }

    /**
     * @description 二次ベジェ曲線を描画
     * @param {number} cx
     * @param {number} cy
     * @param {number} x
     * @param {number} y
     * @return {void}
     */
    quadraticCurveTo (cx: number, cy: number, x: number, y: number): void
    {
        this.pathCommand.quadraticCurveTo(cx, cy, x, y);
    }

    /**
     * @description 塗りつぶしスタイルを設定
     * @param {number} red
     * @param {number} green
     * @param {number} blue
     * @param {number} alpha
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
     * @param {number} red
     * @param {number} green
     * @param {number} blue
     * @param {number} alpha
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
     * @return {void}
     */
    closePath (): void
    {
        this.pathCommand.closePath();
    }

    /**
     * @description 円弧を描画
     * @param {number} x
     * @param {number} y
     * @param {number} radius
     * @return {void}
     */
    arc (x: number, y: number, radius: number): void
    {
        this.pathCommand.arc(x, y, radius);
    }

    /**
     * @description 3次ベジェ曲線を描画
     * @param {number} cx1
     * @param {number} cy1
     * @param {number} cx2
     * @param {number} cy2
     * @param {number} x
     * @param {number} y
     * @return {void}
     */
    bezierCurveTo (cx1: number, cy1: number, cx2: number, cy2: number, x: number, y: number): void
    {
        this.pathCommand.bezierCurveTo(cx1, cy1, cx2, cy2, x, y);
    }

    /**
     * @description 塗りつぶしを実行（Loop-Blinn方式対応）
     * @return {void}
     */
    fill (): void
    {
        const pathVertices = this.pathCommand.$getVertices;
        if (pathVertices.length === 0) { return }

        // フレームが開始されていない場合は開始
        if (!this.frameStarted) {
            this.beginFrame();
        }

        // コマンドエンコーダーを確保
        this.ensureCommandEncoder();

        // 既存のレンダーパスがない場合のみ新規作成
        if (!this.renderPassEncoder) {
            // 現在のレンダーターゲットを取得（メインまたはオフスクリーン）
            const textureView = this.getCurrentTextureView();
            const attachment = this.frameBufferManager.getAttachment("atlas");

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

                const renderPassDescriptor = this.frameBufferManager.createStencilRenderPassDescriptor(
                    colorView,
                    stencilView,
                    "load",
                    "load",
                    resolveTarget
                );
                this.renderPassEncoder = this.commandEncoder!.beginRenderPass(renderPassDescriptor);
            } else if (!this.currentRenderTarget && $isMaskTestEnabled() && this.$mainAttachmentObject?.stencil?.view) {
                // マスクテスト有効時のメインアタッチメントへの描画（ステンシル付き）
                const renderPassDescriptor = this.frameBufferManager.createStencilRenderPassDescriptor(
                    this.$mainAttachmentObject.texture!.view,
                    this.$mainAttachmentObject.stencil.view,
                    "load",
                    "load"  // ステンシルは既存の値を保持（マスク情報）
                );
                this.renderPassEncoder = this.commandEncoder!.beginRenderPass(renderPassDescriptor);
                // ステンシル参照値を設定
                this.renderPassEncoder.setStencilReference($getMaskStencilReference());
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

        // WebGL版と同じ: 現在のビューポートサイズを使用（アトラス描画時はアトラスサイズ）
        const viewportWidth = this.viewportWidth;
        const viewportHeight = this.viewportHeight;

        // WebGL版と同じ: 色はストレート形式（プリマルチプライドはシェーダーで行う）
        // globalAlphaはアトラス描画時ではなく、インスタンス描画時に適用される
        const red = this.$fillStyle[0];
        const green = this.$fillStyle[1];
        const blue = this.$fillStyle[2];
        const alpha = this.$fillStyle[3];

        // WebGL版と同じ: 行列はそのまま渡す（MeshFillGenerateUseCaseで正規化）
        const a  = this.$matrix[0];
        const b  = this.$matrix[1];
        const c  = this.$matrix[3];
        const d  = this.$matrix[4];
        const tx = this.$matrix[6];
        const ty = this.$matrix[7];

        // MeshFillGenerateUseCaseで頂点データを生成
        // WebGL版と同じ: ビューポートサイズを渡して行列を正規化
        const mesh = meshFillGenerateUseCase(
            pathVertices,
            a, b, c, d, tx, ty,
            red, green, blue, alpha,
            viewportWidth, viewportHeight
        );

        if (mesh.indexCount === 0) {
            // メッシュがない場合は何もしない（レンダーパスは終了しない）
            return;
        }

        // 頂点バッファを作成（17 floats per vertex）
        const vertexBuffer = this.bufferManager.createVertexBuffer(
            `fill_${Date.now()}`,
            mesh.buffer
        );

        // アトラスへの描画（ステンシルあり）の場合は2パスステンシルフィル
        const attachment = this.frameBufferManager.getAttachment("atlas");
        if (this.currentRenderTarget && attachment?.stencil?.view) {
            // 2パスステンシルフィル（WebGL版と同じアルゴリズム）
            this.fillWithStencil(vertexBuffer, mesh.indexCount);
        } else {
            // キャンバスへの描画またはステンシルなしの場合は単純なフィル
            // マスクモード時またはマスクテスト有効時はステンシル付きパイプラインを使用
            const useStencilPipeline = (this.inMaskMode || $isMaskTestEnabled()) && !!this.$mainAttachmentObject?.stencil?.view && !this.currentRenderTarget;
            this.fillSimple(vertexBuffer, mesh.indexCount, viewportWidth, viewportHeight, useStencilPipeline);
        }

        // レンダーパスは終了しない（drawFill()またはendNodeRendering()で終了する）
    }

    /**
     * @description 2パスステンシルフィル（WebGL版と同じアルゴリズム）
     *              Pass 1: Front面でインクリメント、Back面でデクリメント（1回の描画で両面処理）
     *              Pass 2: ステンシル値 != 0 の部分に色を描画
     *
     * @param {GPUBuffer} vertexBuffer
     * @param {number} vertexCount
     * @return {void}
     */
    private fillWithStencil(
        vertexBuffer: GPUBuffer,
        vertexCount: number
    ): void
    {
        contextFillWithStencilService(
            this.renderPassEncoder!,
            this.pipelineManager,
            vertexBuffer,
            vertexCount
        );
    }

    /**
     * @description 単純なフィル（ステンシルなし、キャンバス描画用）
     * @param {GPUBuffer} vertexBuffer
     * @param {number} vertexCount
     * @param {number} viewportWidth
     * @param {number} viewportHeight
     * @param {boolean} useStencilPipeline - マスクモード時にステンシル付きパイプラインを使用
     * @return {void}
     */
    private fillSimple(
        vertexBuffer: GPUBuffer,
        vertexCount: number,
        viewportWidth: number,
        viewportHeight: number,
        useStencilPipeline: boolean = false
    ): void
    {
        // マスク描画時のクリップレベルを取得
        const clipLevel = this.$mainAttachmentObject?.clipLevel ?? 1;

        contextFillSimpleService(
            this.device,
            this.renderPassEncoder!,
            this.bufferManager,
            this.pipelineManager,
            vertexBuffer,
            vertexCount,
            viewportWidth,
            viewportHeight,
            !!this.currentRenderTarget,
            useStencilPipeline,
            clipLevel
        );
    }

    /**
     * @description オフスクリーンアタッチメントにバインド
     * WebGL: FrameBufferManagerBindAttachmentObjectService
     * @param {IAttachmentObject} attachment
     * @return {void}
     */
    bindAttachment(attachment: IAttachmentObject): void
    {
        this.attachmentManager.bindAttachment(attachment);

        // 現在のレンダーターゲットをオフスクリーンに切り替え
        // color?.view または texture?.view を使用
        const view = attachment.color?.view ?? attachment.texture?.view;
        if (view) {
            this.currentRenderTarget = view;
        }
    }

    /**
     * @description メインキャンバスにバインド
     * WebGL: FrameBufferManagerUnBindAttachmentObjectService
     * @return {void}
     */
    unbindAttachment(): void
    {
        this.attachmentManager.unbindAttachment();
        this.currentRenderTarget = null;
    }

    /**
     * @description アタッチメントオブジェクトを取得
     * WebGL: FrameBufferManagerGetAttachmentObjectUseCase
     * @param {number} width
     * @param {number} height
     * @param {boolean} msaa
     * @return {IAttachmentObject}
     */
    getAttachmentObject(width: number, height: number, msaa: boolean = false): IAttachmentObject
    {
        return this.attachmentManager.getAttachmentObject(width, height, msaa);
    }

    /**
     * @description アタッチメントオブジェクトを解放
     * WebGL: FrameBufferManagerReleaseAttachmentObjectUseCase
     * @param {IAttachmentObject} attachment
     * @return {void}
     */
    releaseAttachment(attachment: IAttachmentObject): void
    {
        this.attachmentManager.releaseAttachment(attachment);
    }

    /**
     * @description 線の描画を実行（WebGL版と同じ仕様）
     *              WebGL版と同様に、ストロークを塗りとして描画する
     * @return {void}
     */
    stroke (): void
    {
        // WebGL版と同じ: IPath[]形式で頂点を取得
        const vertices = this.pathCommand.getVerticesForStroke();
        if (vertices.length === 0) { return }

        // フレームが開始されていない場合は開始
        if (!this.frameStarted) {
            this.beginFrame();
        }

        // コマンドエンコーダーを確保
        this.ensureCommandEncoder();

        // 既存のレンダーパスがない場合のみ新規作成
        if (!this.renderPassEncoder) {
            // 現在のレンダーターゲットを取得（メインまたはオフスクリーン）
            const textureView = this.getCurrentTextureView();
            const attachment = this.frameBufferManager.getAttachment("atlas");

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

                const renderPassDescriptor = this.frameBufferManager.createStencilRenderPassDescriptor(
                    colorView,
                    stencilView,
                    "load",
                    "load",
                    resolveTarget
                );
                this.renderPassEncoder = this.commandEncoder!.beginRenderPass(renderPassDescriptor);
            } else if (!this.currentRenderTarget && $isMaskTestEnabled() && this.$mainAttachmentObject?.stencil?.view) {
                // マスクテスト有効時のメインアタッチメントへの描画（ステンシル付き）
                const renderPassDescriptor = this.frameBufferManager.createStencilRenderPassDescriptor(
                    this.$mainAttachmentObject.texture!.view,
                    this.$mainAttachmentObject.stencil.view,
                    "load",
                    "load"  // ステンシルは既存の値を保持（マスク情報）
                );
                this.renderPassEncoder = this.commandEncoder!.beginRenderPass(renderPassDescriptor);
                // ステンシル参照値を設定
                this.renderPassEncoder.setStencilReference($getMaskStencilReference());
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

        // WebGL版と同じ: 現在のビューポートサイズを使用（アトラス描画時はアトラスサイズ）
        const viewportWidth = this.viewportWidth;
        const viewportHeight = this.viewportHeight;

        // WebGL版と同じ: ストロークスタイルの色を使用
        const red = this.$strokeStyle[0];
        const green = this.$strokeStyle[1];
        const blue = this.$strokeStyle[2];
        const alpha = this.$strokeStyle[3];

        // WebGL版と同じ: 行列はそのまま渡す（MeshFillGenerateUseCaseで正規化）
        const a  = this.$matrix[0];
        const b  = this.$matrix[1];
        const c  = this.$matrix[3];
        const d  = this.$matrix[4];
        const tx = this.$matrix[6];
        const ty = this.$matrix[7];

        // WebGL版と同じ: ストロークの輪郭を塗りとして生成
        // thickness/2はここで行う（generateStrokeOutlinesに半分の太さを渡す）
        const strokeOutlines = this.generateStrokeOutlines(vertices, this.thickness / 2);
        if (strokeOutlines.length === 0) { return }

        // WebGL版と同じ: MeshFillGenerateUseCaseで頂点データを生成
        const mesh = meshFillGenerateUseCase(
            strokeOutlines,
            a, b, c, d, tx, ty,
            red, green, blue, alpha,
            viewportWidth, viewportHeight
        );

        if (mesh.indexCount === 0) {
            return;
        }

        // 頂点バッファを作成（17 floats per vertex）
        const vertexBuffer = this.bufferManager.createVertexBuffer(
            `stroke_${Date.now()}`,
            mesh.buffer
        );

        // アトラスへの描画（ステンシルあり）の場合は2パスステンシルフィル
        const attachment = this.frameBufferManager.getAttachment("atlas");
        if (this.currentRenderTarget && attachment?.stencil?.view) {
            // 2パスステンシルフィル（WebGL版と同じアルゴリズム）
            this.fillWithStencil(vertexBuffer, mesh.indexCount);
        } else {
            // キャンバスへの描画またはステンシルなしの場合は単純なフィル
            const useStencilPipeline = (this.inMaskMode || $isMaskTestEnabled()) && !!this.$mainAttachmentObject?.stencil?.view && !this.currentRenderTarget;
            this.fillSimple(vertexBuffer, mesh.indexCount, viewportWidth, viewportHeight, useStencilPipeline);
        }
    }

    /**
     * @description ストロークの輪郭を生成（WebGL版のMeshGenerateStrokeOutlineUseCaseと同等）
     * @param {IPath[]} vertices - パス頂点配列
     * @param {number} thickness - 線の太さの半分
     * @return {IPath[]} 輪郭パス配列
     */
    private generateStrokeOutlines(vertices: IPath[], thickness: number): IPath[]
    {
        const outlines: IPath[] = [];

        for (const path of vertices) {
            if (path.length < 6) { continue }

            const pathOutlines = this.generateStrokeOutlineForPath(path, thickness);
            for (const outline of pathOutlines) {
                outlines.push(outline);
            }
        }

        return outlines;
    }

    /**
     * @description 単一パスのストローク輪郭を生成
     * @param {IPath} path - 単一パス
     * @param {number} thickness - 線の太さの半分
     * @return {IPath[]} 輪郭パス配列
     */
    private generateStrokeOutlineForPath(path: IPath, thickness: number): IPath[]
    {
        const rectangles: IPath[] = [];

        let startX = path[0] as number;
        let startY = path[1] as number;
        let prevEndUp: { x: number, y: number } | null = null;
        let prevEndDown: { x: number, y: number } | null = null;

        for (let idx = 3; idx < path.length; idx += 3) {
            const x = path[idx] as number;
            const y = path[idx + 1] as number;
            const isCurve = path[idx + 2] as boolean;

            if (isCurve) {
                continue;
            }

            const endX = x;
            const endY = y;

            // 方向ベクトル
            const dx = endX - startX;
            const dy = endY - startY;
            const magnitude = Math.sqrt(dx * dx + dy * dy);

            if (magnitude < 0.0001) {
                startX = endX;
                startY = endY;
                continue;
            }

            // 法線ベクトル
            const nx = -(dy / magnitude) * thickness;
            const ny = dx / magnitude * thickness;

            // 矩形の4頂点
            const startUpX = startX + nx;
            const startUpY = startY + ny;
            const startDownX = startX - nx;
            const startDownY = startY - ny;
            const endUpX = endX + nx;
            const endUpY = endY + ny;
            const endDownX = endX - nx;
            const endDownY = endY - ny;

            // IPath形式で矩形を追加（WebGL版と同じフォーマット）
            const rectPath: IPath = [
                startUpX, startUpY, false,
                endUpX, endUpY, false,
                endDownX, endDownY, false,
                startDownX, startDownY, false,
                startUpX, startUpY, false  // 閉じる
            ];
            rectangles.push(rectPath);

            // 結合処理（前の線分がある場合）
            if (prevEndUp && prevEndDown) {
                const joinPath = this.generateJoin(
                    prevEndUp.x, prevEndUp.y,
                    prevEndDown.x, prevEndDown.y,
                    startUpX, startUpY,
                    startDownX, startDownY,
                    startX, startY,
                    thickness
                );
                if (joinPath) {
                    rectangles.push(joinPath);
                }
            }

            prevEndUp = { "x": endUpX, "y": endUpY };
            prevEndDown = { "x": endDownX, "y": endDownY };

            startX = endX;
            startY = endY;
        }

        // パスが閉じている場合は最後と最初も結合
        if (path[0] === path[path.length - 3] &&
            path[1] === path[path.length - 2] &&
            rectangles.length > 1 && prevEndUp && prevEndDown) {

            // 最初の矩形の情報を取得
            const firstRect = rectangles[0];
            const firstStartUpX = firstRect[0] as number;
            const firstStartUpY = firstRect[1] as number;
            const firstStartDownX = firstRect[9] as number;
            const firstStartDownY = firstRect[10] as number;
            const centerX = path[0] as number;
            const centerY = path[1] as number;

            const joinPath = this.generateJoin(
                prevEndUp.x, prevEndUp.y,
                prevEndDown.x, prevEndDown.y,
                firstStartUpX, firstStartUpY,
                firstStartDownX, firstStartDownY,
                centerX, centerY,
                thickness
            );
            if (joinPath) {
                rectangles.push(joinPath);
            }
        }

        return rectangles;
    }

    /**
     * @description 結合部分のパスを生成
     * @return {IPath | null}
     */
    private generateJoin(
        prevEndUpX: number, prevEndUpY: number,
        prevEndDownX: number, prevEndDownY: number,
        currStartUpX: number, currStartUpY: number,
        currStartDownX: number, currStartDownY: number,
        centerX: number, centerY: number,
        thickness: number
    ): IPath | null
    {
        switch (this.joints) {
            case 0: // bevel
                return this.generateBevelJoin(
                    prevEndUpX, prevEndUpY,
                    prevEndDownX, prevEndDownY,
                    currStartUpX, currStartUpY,
                    currStartDownX, currStartDownY,
                    centerX, centerY
                );

            case 2: // round
                return this.generateRoundJoin(
                    prevEndUpX, prevEndUpY,
                    prevEndDownX, prevEndDownY,
                    currStartUpX, currStartUpY,
                    currStartDownX, currStartDownY,
                    centerX, centerY,
                    thickness
                );

            case 1: // miter
            default:
                return this.generateBevelJoin(
                    prevEndUpX, prevEndUpY,
                    prevEndDownX, prevEndDownY,
                    currStartUpX, currStartUpY,
                    currStartDownX, currStartDownY,
                    centerX, centerY
                );
        }
    }

    /**
     * @description ベベル結合のパスを生成
     */
    private generateBevelJoin(
        prevEndUpX: number, prevEndUpY: number,
        prevEndDownX: number, prevEndDownY: number,
        currStartUpX: number, currStartUpY: number,
        currStartDownX: number, currStartDownY: number,
        centerX: number, centerY: number
    ): IPath
    {
        // 上側と下側の三角形を1つのパスとして結合
        return [
            centerX, centerY, false,
            prevEndUpX, prevEndUpY, false,
            currStartUpX, currStartUpY, false,
            centerX, centerY, false,  // 閉じて次の三角形
            currStartDownX, currStartDownY, false,
            prevEndDownX, prevEndDownY, false,
            centerX, centerY, false   // 閉じる
        ];
    }

    /**
     * @description ラウンド結合のパスを生成
     */
    private generateRoundJoin(
        prevEndUpX: number, prevEndUpY: number,
        prevEndDownX: number, prevEndDownY: number,
        currStartUpX: number, currStartUpY: number,
        currStartDownX: number, currStartDownY: number,
        centerX: number, centerY: number,
        thickness: number
    ): IPath
    {
        const path: IPath = [];
        const segments = 8;

        // 上側の扇形
        const angleA = Math.atan2(prevEndUpY - centerY, prevEndUpX - centerX);
        const angleB = Math.atan2(currStartUpY - centerY, currStartUpX - centerX);
        let angleDiff = angleB - angleA;
        if (angleDiff > Math.PI) { angleDiff -= 2 * Math.PI }
        else if (angleDiff < -Math.PI) { angleDiff += 2 * Math.PI }
        const step = angleDiff / segments;

        for (let i = 0; i < segments; i++) {
            const a1 = angleA + i * step;
            const a2 = angleA + (i + 1) * step;
            const x1 = centerX + thickness * Math.cos(a1);
            const y1 = centerY + thickness * Math.sin(a1);
            const x2 = centerX + thickness * Math.cos(a2);
            const y2 = centerY + thickness * Math.sin(a2);

            path.push(centerX, centerY, false);
            path.push(x1, y1, false);
            path.push(x2, y2, false);
        }

        // 下側の扇形
        const angleC = Math.atan2(prevEndDownY - centerY, prevEndDownX - centerX);
        const angleD = Math.atan2(currStartDownY - centerY, currStartDownX - centerX);
        let angleDiff2 = angleD - angleC;
        if (angleDiff2 > Math.PI) { angleDiff2 -= 2 * Math.PI }
        else if (angleDiff2 < -Math.PI) { angleDiff2 += 2 * Math.PI }
        const step2 = angleDiff2 / segments;

        for (let i = 0; i < segments; i++) {
            const a1 = angleC + i * step2;
            const a2 = angleC + (i + 1) * step2;
            const x1 = centerX + thickness * Math.cos(a1);
            const y1 = centerY + thickness * Math.sin(a1);
            const x2 = centerX + thickness * Math.cos(a2);
            const y2 = centerY + thickness * Math.sin(a2);

            path.push(centerX, centerY, false);
            path.push(x1, y1, false);
            path.push(x2, y2, false);
        }

        // パスを閉じる
        if (path.length > 0) {
            path.push(path[0] as number, path[1] as number, false);
        }

        return path;
    }

    /**
     * @description グラデーションの塗りつぶしを実行
     * @param {number} type - 0: linear, 1: radial
     * @param {number[]} stops - グラデーションストップ配列 [offset, R, G, B, A, ...] (R,G,B,A: 0-255)
     * @param {Float32Array} matrix - グラデーション変換行列 [a, b, c, d, tx, ty]
     * @param {number} spread - スプレッドメソッド (0: reflect, 1: repeat, 2: pad)
     * @param {number} interpolation - 補間方法 (0: linearRGB, 1: RGB)
     * @param {number} focal - ラジアルグラデーションのフォーカルポイント
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

        // フレームが開始されていない場合は開始
        if (!this.frameStarted) {
            this.beginFrame();
        }

        // コマンドエンコーダーを確保
        this.ensureCommandEncoder();

        // 既存のレンダーパスがない場合のみ新規作成
        if (!this.renderPassEncoder) {
            const textureView = this.getCurrentTextureView();
            // マスクテスト有効時のメインアタッチメントへの描画（ステンシル付き）
            if (!this.currentRenderTarget && $isMaskTestEnabled() && this.$mainAttachmentObject?.stencil?.view) {
                const renderPassDescriptor = this.frameBufferManager.createStencilRenderPassDescriptor(
                    this.$mainAttachmentObject.texture!.view,
                    this.$mainAttachmentObject.stencil.view,
                    "load",
                    "load"  // ステンシルは既存の値を保持（マスク情報）
                );
                this.renderPassEncoder = this.commandEncoder!.beginRenderPass(renderPassDescriptor);
                // ステンシル参照値を設定
                this.renderPassEncoder.setStencilReference($getMaskStencilReference());
            } else {
                const renderPassDescriptor = this.frameBufferManager.createRenderPassDescriptor(
                    textureView,
                    0, 0, 0, 0,
                    "load"
                );
                this.renderPassEncoder = this.commandEncoder!.beginRenderPass(renderPassDescriptor);
            }
        }

        // ステンシル付きレンダーパスかどうかを判定
        // - マスクモード時またはマスクテスト有効時（メインアタッチメントへの描画）
        // - アトラス描画時（ステンシル付きレンダーパス）
        const atlasAttachment = this.frameBufferManager.getAttachment("atlas");
        const useAtlasStencil = this.currentRenderTarget && atlasAttachment?.stencil?.view;
        const useMainStencil = (this.inMaskMode || $isMaskTestEnabled()) && this.$mainAttachmentObject?.stencil?.view && !this.currentRenderTarget;
        const useStencilPipeline = useAtlasStencil || useMainStencil;

        // マスク描画時のクリップレベルを取得
        const clipLevel = this.$mainAttachmentObject?.clipLevel ?? 1;

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
            this.viewportWidth,
            this.viewportHeight,
            !!this.currentRenderTarget,
            !!useStencilPipeline,
            clipLevel
        );

        // LUTテクスチャをフレーム終了時に解放するリストに追加
        if (lutTexture) {
            this.addFrameTexture(lutTexture);
        }
    }

    /**
     * @description ビットマップの塗りつぶしを実行
     * @param {Uint8Array} pixels
     * @param {Float32Array} matrix - ビットマップ変換行列 [a, b, c, d, tx, ty]
     * @param {number} width
     * @param {number} height
     * @param {boolean} repeat
     * @param {boolean} smooth
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

        // フレームが開始されていない場合は開始
        if (!this.frameStarted) {
            this.beginFrame();
        }

        // コマンドエンコーダーを確保
        this.ensureCommandEncoder();

        // 既存のレンダーパスがない場合のみ新規作成
        if (!this.renderPassEncoder) {
            const textureView = this.getCurrentTextureView();
            // マスクテスト有効時のメインアタッチメントへの描画（ステンシル付き）
            if (!this.currentRenderTarget && $isMaskTestEnabled() && this.$mainAttachmentObject?.stencil?.view) {
                const renderPassDescriptor = this.frameBufferManager.createStencilRenderPassDescriptor(
                    this.$mainAttachmentObject.texture!.view,
                    this.$mainAttachmentObject.stencil.view,
                    "load",
                    "load"  // ステンシルは既存の値を保持（マスク情報）
                );
                this.renderPassEncoder = this.commandEncoder!.beginRenderPass(renderPassDescriptor);
                // ステンシル参照値を設定
                this.renderPassEncoder.setStencilReference($getMaskStencilReference());
            } else {
                const renderPassDescriptor = this.frameBufferManager.createRenderPassDescriptor(
                    textureView,
                    0, 0, 0, 0,
                    "load"
                );
                this.renderPassEncoder = this.commandEncoder!.beginRenderPass(renderPassDescriptor);
            }
        }

        // ステンシル付きレンダーパスかどうかを判定
        // - マスクモード時またはマスクテスト有効時（メインアタッチメントへの描画）
        // - アトラス描画時（ステンシル付きレンダーパス）
        const atlasAttachment = this.frameBufferManager.getAttachment("atlas");
        const useAtlasStencil = this.currentRenderTarget && atlasAttachment?.stencil?.view;
        const useMainStencil = (this.inMaskMode || $isMaskTestEnabled()) && this.$mainAttachmentObject?.stencil?.view && !this.currentRenderTarget;
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
            !!this.currentRenderTarget,
            !!useStencilPipeline,
            clipLevel
        );

        // ビットマップテクスチャをフレーム終了時に解放するリストに追加
        if (bitmapTexture) {
            this.addFrameTexture(bitmapTexture);
        }
    }

    /**
     * @description グラデーション線の描画を実行
     * @param {number} type - 0: linear, 1: radial
     * @param {number[]} stops - グラデーションストップ配列 [offset, R, G, B, A, ...] (R,G,B,A: 0-255)
     * @param {Float32Array} matrix - グラデーション変換行列 [a, b, c, d, tx, ty]
     * @param {number} spread - スプレッドメソッド (0: reflect, 1: repeat, 2: pad)
     * @param {number} interpolation - 補間方法 (0: linearRGB, 1: RGB)
     * @param {number} focal - ラジアルグラデーションのフォーカルポイント
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

        // フレームが開始されていない場合は開始
        if (!this.frameStarted) {
            this.beginFrame();
        }

        // コマンドエンコーダーを確保
        this.ensureCommandEncoder();

        // 既存のレンダーパスがない場合のみ新規作成
        if (!this.renderPassEncoder) {
            const textureView = this.getCurrentTextureView();
            const renderPassDescriptor = this.frameBufferManager.createRenderPassDescriptor(
                textureView,
                0, 0, 0, 0,
                "load"
            );
            this.renderPassEncoder = this.commandEncoder!.beginRenderPass(renderPassDescriptor);
        }

        // WebGL版と同じ: thicknessをそのまま渡し、内部で/2される
        contextGradientStrokeUseCase(
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
            !!this.currentRenderTarget
        );
    }

    /**
     * @description ビットマップ線の描画を実行
     * @param {Uint8Array} pixels
     * @param {Float32Array} matrix - ビットマップ変換行列 [a, b, c, d, tx, ty]
     * @param {number} width
     * @param {number} height
     * @param {boolean} repeat
     * @param {boolean} smooth
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

        // フレームが開始されていない場合は開始
        if (!this.frameStarted) {
            this.beginFrame();
        }

        // コマンドエンコーダーを確保
        this.ensureCommandEncoder();

        // 既存のレンダーパスがない場合のみ新規作成
        if (!this.renderPassEncoder) {
            const textureView = this.getCurrentTextureView();
            const renderPassDescriptor = this.frameBufferManager.createRenderPassDescriptor(
                textureView,
                0, 0, 0, 0,
                "load"
            );
            this.renderPassEncoder = this.commandEncoder!.beginRenderPass(renderPassDescriptor);
        }

        // WebGL版と同じ: thicknessをそのまま渡し、内部で/2される
        contextBitmapStrokeUseCase(
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
            !!this.currentRenderTarget
        );
    }

    /**
     * @description マスク処理を実行
     *              WebGL版と同様にステンシルバッファを使用したクリッピング
     *              Note: ステンシルバッファが必要なため、アトラスへの描画時のみ動作
     * @return {void}
     */
    clip (): void
    {
        const currentAttachment = this.frameBufferManager.getCurrentAttachment();
        if (!currentAttachment) {
            console.warn("[WebGPU] clip() skipped: no current attachment");
            return;
        }

        // 現在のアタッチメントにステンシルバッファがない場合はスキップ（メインキャンバスなど）
        if (!currentAttachment.stencil) {
            console.warn("[WebGPU] clip() skipped: current attachment has no stencil buffer", {
                "attachmentId": currentAttachment.id,
                "width": currentAttachment.width,
                "height": currentAttachment.height
            });
            return;
        }

        const pathVertices = this.pathCommand.$getVertices;
        if (pathVertices.length === 0) {
            return;
        }

        if (!this.renderPassEncoder) {
            return;
        }

        // メインアタッチメントかどうかを判定
        const isMainAttachment = currentAttachment === this.$mainAttachmentObject;

        contextClipUseCase(
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
     * @param {IAttachmentObject} attachment_object
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
     *              アトラスがバインドされていない場合はメインアタッチメントを返す
     *              When no atlas is bound, returns the main attachment
     * @return {IAttachmentObject | null}
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
     * @return {IAttachmentObject | null}
     */
    get atlasAttachmentObject (): IAttachmentObject | null
    {
        const atlas = this.frameBufferManager.getAttachment("atlas");
        return atlas || null;
    }

    /**
     * @description グリッドの描画データをセット
     * @param {Float32Array | null} grid_data
     * @return {void}
     */
    useGrid (grid_data: Float32Array | null): void
    {
        $gridDataMap.set($fillBufferIndex, grid_data);
    }

    /**
     * @description 指定のノード範囲で描画を開始（アトラステクスチャへの描画）
     *              2パスステンシルフィル対応: ステンシルバッファ付きレンダーパスを使用
     * @param {Node} node
     * @return {void}
     */
    beginNodeRendering (node: Node): void
    {
        // フレームが開始されていない場合は開始
        if (!this.frameStarted) {
            this.beginFrame();
        }

        // 既存のレンダーパスを終了
        if (this.renderPassEncoder) {
            this.renderPassEncoder.end();
            this.renderPassEncoder = null;
        }

        // アトラステクスチャの該当箇所をレンダーターゲットに設定
        const attachment = this.frameBufferManager.getAttachment("atlas");
        if (attachment && attachment.texture) {
            this.currentRenderTarget = attachment.texture.view;

            // WebGL版と同じ: ビューポートサイズはアトラスのサイズを使用
            this.viewportWidth = attachment.width;
            this.viewportHeight = attachment.height;

            // コマンドエンコーダーを確保
            this.ensureCommandEncoder();

            // MSAAテクスチャを使用するかどうか
            const useMsaa = attachment.msaa && attachment.msaaTexture?.view;
            const colorView = useMsaa ? attachment.msaaTexture!.view : attachment.texture.view;
            const resolveTarget = useMsaa ? attachment.texture.view : null;

            // ステンシルバッファ付きレンダーパス（2パスステンシルフィル用）
            if (attachment.stencil?.view) {
                // MSAAステンシルテクスチャを使用
                const stencilView = useMsaa && attachment.msaaStencil?.view
                    ? attachment.msaaStencil.view
                    : attachment.stencil.view;

                const renderPassDescriptor = this.frameBufferManager.createStencilRenderPassDescriptor(
                    colorView,
                    stencilView,
                    "load", // カラーは既存の内容を保持
                    "clear", // ステンシルはクリア
                    resolveTarget
                );
                this.renderPassEncoder = this.commandEncoder!.beginRenderPass(renderPassDescriptor);
            } else {
                // ステンシルがない場合は通常のレンダーパス（フォールバック）
                const renderPassDescriptor = this.frameBufferManager.createRenderPassDescriptor(
                    colorView,
                    0, 0, 0, 0,
                    "load",
                    resolveTarget
                );
                this.renderPassEncoder = this.commandEncoder!.beginRenderPass(renderPassDescriptor);
            }

            // シザーレクトで描画範囲を制限
            // シェーダーでY軸反転(-ndc.y)しているため、描画結果はWebGPU座標系でnode.y位置になる
            // WebGPUのシザーは左上原点なのでnode.yをそのまま使用
            let scissorX = Math.max(0, node.x);
            let scissorY = Math.max(0, node.y);
            let scissorW = Math.min(node.w, attachment.width - scissorX);
            let scissorH = Math.min(node.h, attachment.height - scissorY);

            // レンダーターゲット範囲内にクランプ
            scissorX = Math.min(scissorX, attachment.width);
            scissorY = Math.min(scissorY, attachment.height);
            scissorW = Math.max(0, Math.min(scissorW, attachment.width - scissorX));
            scissorH = Math.max(0, Math.min(scissorH, attachment.height - scissorY));

            if (scissorW > 0 && scissorH > 0) {
                this.renderPassEncoder.setScissorRect(scissorX, scissorY, scissorW, scissorH);
            }
        }
    }

    /**
     * @description 指定のノード範囲で描画を終了
     * @return {void}
     */
    endNodeRendering (): void
    {
        // レンダーパスを終了
        if (this.renderPassEncoder) {
            this.renderPassEncoder.end();
            this.renderPassEncoder = null;
        }

        // メインテクスチャに戻す
        this.currentRenderTarget = null;

        // ビューポートをキャンバスサイズに戻す
        this.viewportWidth = this.canvasContext.canvas.width;
        this.viewportHeight = this.canvasContext.canvas.height;
    }

    /**
     * @description 塗りの描画を実行
     * @return {void}
     */
    drawFill (): void
    {
        // fill()で描画を実行（レンダーパスは継続）
        this.fill();

        // drawFill()呼び出し後、レンダーパスを終了
        if (this.renderPassEncoder) {
            this.renderPassEncoder.end();
            this.renderPassEncoder = null;
        }

        // グリッドデータをクリア
        $terminateGrid();
    }

    /**
     * @description インスタンスを描画
     * @param {Node} node
     * @param {number} x_min
     * @param {number} y_min
     * @param {number} x_max
     * @param {number} y_max
     * @param {Float32Array} color_transform
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
        const canvasWidth = this.canvasContext.canvas.width;
        const canvasHeight = this.canvasContext.canvas.height;
        const renderMaxSize = WebGPUUtil.getRenderMaxSize();

        addDisplayObjectToInstanceArray(
            node,
            x_min, y_min, x_max, y_max,
            color_transform,
            this.$matrix,
            this.globalCompositeOperation,
            canvasWidth,
            canvasHeight,
            renderMaxSize,
            this.globalAlpha  // WebGL版と同じ: globalAlphaを渡す
        );
    }

    /**
     * @description インスタンス配列を描画
     * @return {void}
     */
    drawArraysInstanced (): void
    {
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

        // UseCaseでインスタンス描画を実行
        // メインアタッチメントがない場合は初期化が必要
        if (!this.$mainAttachmentObject) {
            console.warn("[WebGPU] drawArraysInstanced: main attachment not initialized");
            return;
        }

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

        // 複雑なブレンドモードの処理
        this.processComplexBlendQueue();
    }

    /**
     * @description 複雑なブレンドモードのキューを処理
     * @return {void}
     */
    private processComplexBlendQueue (): void
    {
        // コマンドエンコーダーを確保
        this.ensureCommandEncoder();

        contextProcessComplexBlendQueueUseCase(
            this.device,
            this.commandEncoder!,
            this.mainTexture,
            this.frameBufferManager,
            this.textureManager,
            this.pipelineManager
        );
    }

    /**
     * @description インスタンス配列をクリア
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
     *              WebGPUでは、Shapeのシェーダーが-ndc.yでY軸反転しているため、
     *              Bitmapも同じ方向になるよう画像を上下反転して書き込む
     * @param {Node} node
     * @param {Uint8Array} pixels
     * @return {void}
     */
    drawPixels (node: Node, pixels: Uint8Array): void
    {
        // WebGPU draw pixels
        // アトラステクスチャの指定位置にピクセルデータを書き込む
        const attachment = this.frameBufferManager.getAttachment("atlas");
        if (!attachment) { return }

        // ピクセルデータをテクスチャにコピー
        if (!attachment.texture) { return }

        // ピクセルデータを上下反転してコピー（Shapeの描画方向と一致させる）
        // Shapeはシェーダーで-ndc.yにより上下反転されるため、
        // Bitmapも同様に上下反転して書き込む
        const width = node.w;
        const height = node.h;
        const rowBytes = width * 4;
        const flippedPixels = new Uint8Array(pixels.length);

        for (let y = 0; y < height; y++) {
            const srcOffset = pixels.byteOffset + y * rowBytes;
            const dstOffset = (height - 1 - y) * rowBytes;
            flippedPixels.set(
                new Uint8Array(pixels.buffer, srcOffset, rowBytes),
                dstOffset
            );
        }

        this.device.queue.writeTexture(
            {
                "texture": attachment.texture.resource,
                "origin": { "x": node.x, "y": node.y, "z": 0 }
            },
            flippedPixels.buffer,
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

    /**
     * @description OffscreenCanvasをNodeの指定箇所に転送
     *              WebGPUでは、Shapeのシェーダーが-ndc.yでY軸反転しているため、
     *              Bitmapも同じ方向になるよう画像を上下反転して書き込む
     * @param {Node} node
     * @param {OffscreenCanvas | ImageBitmap} element
     * @return {void}
     */
    drawElement (node: Node, element: OffscreenCanvas | ImageBitmap): void
    {
        // WebGPU draw element
        // OffscreenCanvasまたはImageBitmapをアトラステクスチャにコピー
        const attachment = this.frameBufferManager.getAttachment("atlas");
        if (!attachment || !attachment.texture) { return }

        try {
            this.device.queue.copyExternalImageToTexture(
                {
                    "source": element as ImageBitmap,
                    "flipY": true  // 画像を上下反転してShapeの描画方向と一致させる
                },
                {
                    "texture": attachment.texture.resource,
                    "origin": { "x": node.x, "y": node.y, "z": 0 },
                    "premultipliedAlpha": true
                },
                {
                    "width": element.width || node.w,
                    "height": element.height || node.h,
                    "depthOrArrayLayers": 1
                }
            );
        } catch (e) {
            console.error("[WebGPU] Failed to copy external image to texture:", e);
        }
    }

    /**
     * @description フィルターを適用
     * @param {Node} node
     * @param {string} unique_key
     * @param {boolean} updated
     * @param {number} width
     * @param {number} height
     * @param {boolean} is_bitmap
     * @param {Float32Array} matrix
     * @param {Float32Array} color_transform
     * @param {IBlendMode} blend_mode
     * @param {Float32Array} bounds
     * @param {Float32Array} params
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

        // 既存のレンダーパスを終了
        if (this.renderPassEncoder) {
            this.renderPassEncoder.end();
            this.renderPassEncoder = null;
        }

        // コマンドエンコーダーを確保
        this.ensureCommandEncoder();

        const config = {
            "device": this.device,
            "commandEncoder": this.commandEncoder!,
            "frameBufferManager": this.frameBufferManager,
            "pipelineManager": this.pipelineManager,
            "textureManager": this.textureManager
        };

        contextApplyFilterUseCase(
            node,
            width,
            height,
            matrix,
            color_transform,
            blend_mode,
            bounds,
            params,
            config,
            this.mainTextureView!,
            this.bufferManager,
            this.canvasContext.canvas.width,
            this.canvasContext.canvas.height
        );
    }

    /**
     * @description メインテクスチャを確保（フレーム開始時に一度だけgetCurrentTexture呼び出し）
     * @return {void}
     * @private
     */
    private ensureMainTexture(): void
    {
        if (!this.mainTexture) {
            this.mainTexture = this.canvasContext.getCurrentTexture();
            this.mainTextureView = this.mainTexture.createView();
        }
    }

    /**
     * @description 現在の描画ターゲットのテクスチャビューを取得
     * @return {GPUTextureView}
     * @private
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
     * @return {void}
     * @private
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
     * @return {void}
     * @public
     */
    beginFrame(): void
    {
        if (!this.frameStarted) {
            this.ensureMainTexture();
            this.ensureCommandEncoder();
            this.frameStarted = true;

            // 注意: グラデーションLUTは共有テクスチャに描画されるため、
            // キャッシュは使用しません。各フレームで再描画が必要です。
        }
    }

    /**
     * @description フレームごとの一時テクスチャを追加（endFrame()で解放）
     * @param {GPUTexture} texture
     * @return {void}
     */
    addFrameTexture (texture: GPUTexture): void
    {
        this.frameTextures.push(texture);
    }

    /**
     * @description フレーム終了とコマンド送信（レンダリング完了後に呼ぶ）
     * @return {void}
     * @public
     */
    endFrame(): void
    {
        if (!this.frameStarted) {
            console.warn("[WebGPU] endFrame called without beginFrame");
            return;
        }

        // 開いているRenderPassEncoderがあれば終了
        if (this.renderPassEncoder) {
            this.renderPassEncoder.end();
            this.renderPassEncoder = null;
        }

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
        this.frameTextures = [];

        // 次のフレーム用にクリア
        this.commandEncoder = null;
        this.renderPassEncoder = null;
        this.currentRenderTarget = null;

        // テクスチャ参照をクリア（次フレームで新しく取得）
        this.mainTexture = null;
        this.mainTextureView = null;
        this.frameStarted = false;
    }

    /**
     * @description コマンドを送信（後方互換性のため残す）
     * @return {void}
     */
    submit (): void
    {
        this.endFrame();
    }

    /**
     * @description ノードを作成
     * @param {number} width
     * @param {number} height
     * @return {Node}
     */
    createNode (width: number, height: number): Node
    {
        // WebGPU node creation implementation using texture-packer
        const index = 0; // For now, use single atlas

        if (!$rootNodes[index]) {
            const maxSize = WebGPUUtil.getRenderMaxSize();
            $rootNodes[index] = new TexturePacker(index, maxSize, maxSize);
        }

        const rootNode = $rootNodes[index];
        const node = rootNode.insert(width, height);

        if (!node) {
            throw new Error(`Failed to create node: ${width}x${height} - atlas full`);
        }

        return node;
    }

    /**
     * @description ノードを削除
     * @param {Node} node
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
     *              スワップチェーンはCopyDstをサポートしないため、レンダーパスでブリット
     * @return {void}
     */
    transferMainCanvas (): void
    {
        // メインアタッチメントの内容をスワップチェーン（キャンバス）にコピー
        if (!this.$mainAttachmentObject || !this.$mainAttachmentObject.texture) {
            console.warn("[WebGPU] transferMainCanvas: main attachment not initialized");
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

        // Uniform: scale = (1, 1), offset = (0, 0) で 1:1 コピー
        const uniformData = new Float32Array([1.0, 1.0, 0.0, 0.0]);
        const uniformBuffer = this.bufferManager.createUniformBuffer(
            `transfer_uniform_${Date.now()}`,
            uniformData.byteLength
        );
        this.device.queue.writeBuffer(uniformBuffer, 0, uniformData.buffer, uniformData.byteOffset, uniformData.byteLength);

        // サンプラーを作成
        const sampler = this.textureManager.createSampler("transfer_sampler", false);

        // バインドグループを作成
        const bindGroup = this.device.createBindGroup({
            "layout": bindGroupLayout,
            "entries": [
                { "binding": 0, "resource": { "buffer": uniformBuffer } },
                { "binding": 1, "resource": sampler },
                { "binding": 2, "resource": this.$mainAttachmentObject.texture.view }
            ]
        });

        // スワップチェーンへのレンダーパスを作成
        const renderPassDescriptor: GPURenderPassDescriptor = {
            "colorAttachments": [{
                "view": this.mainTextureView!,
                "clearValue": { "r": 0, "g": 0, "b": 0, "a": 0 },
                "loadOp": "clear",
                "storeOp": "store"
            }]
        };

        const passEncoder = this.commandEncoder!.beginRenderPass(renderPassDescriptor);
        passEncoder.setPipeline(pipeline);
        passEncoder.setBindGroup(0, bindGroup);
        passEncoder.draw(6, 1, 0, 0); // フルスクリーンクワッド（6頂点）
        passEncoder.end();

        // endFrame()でsubmitされる
        this.endFrame();
    }

    /**
     * @description ImageBitmapを生成
     * @param {number} width
     * @param {number} height
     * @return {Promise<ImageBitmap>}
     */
    async createImageBitmap (width: number, height: number): Promise<ImageBitmap>
    {
        // アトラステクスチャから現在の描画内容を取得
        const attachment = this.frameBufferManager.getAttachment("atlas");
        if (!attachment) {
            throw new Error("[WebGPU] Atlas attachment not found");
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

        // コマンドエンコーダーを作成
        const commandEncoder = this.device.createCommandEncoder();

        // アトラステクスチャからピクセルバッファにコピー
        if (!attachment.texture) {
            throw new Error("Attachment texture is null");
        }

        commandEncoder.copyTextureToBuffer(
            {
                "texture": attachment.texture.resource,
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

        // コマンドを送信
        this.device.queue.submit([commandEncoder.finish()]);

        // バッファをマップして読み込み
        await pixelBuffer.mapAsync(GPUMapMode.READ);
        const mappedRange = pixelBuffer.getMappedRange();
        const pixels = new Uint8Array(mappedRange);

        // ピクセルデータをコピー（アライメントを考慮）
        const resultPixels = new Uint8Array(width * height * 4);
        for (let y = 0; y < height; y++) {
            const srcOffset = y * bytesPerRow;
            const dstOffset = y * width * 4;
            resultPixels.set(
                pixels.subarray(srcOffset, srcOffset + width * 4),
                dstOffset
            );
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
     * @method
     * @public
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

            const renderPassDescriptor = this.frameBufferManager.createStencilRenderPassDescriptor(
                this.$mainAttachmentObject.texture.view,
                this.$mainAttachmentObject.stencil.view,
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
     * @param  {number} x_min
     * @param  {number} y_min
     * @param  {number} x_max
     * @param  {number} y_max
     * @return {void}
     * @method
     * @public
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
     * @method
     * @public
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
     *              Mask end processing
     *
     * @return {void}
     * @method
     * @public
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

        if (wasLastMask && this.$mainAttachmentObject?.stencil) {
            // 単体マスク（最後のマスク）の場合、ステンシルバッファをクリア
            // WebGL: gl.clear(STENCIL_BUFFER_BIT)
            const clearPassDescriptor: GPURenderPassDescriptor = {
                "colorAttachments": [{
                    "view": this.$mainAttachmentObject.texture!.view,
                    "loadOp": "load", // カラーは保持
                    "storeOp": "store"
                }],
                "depthStencilAttachment": {
                    "view": this.$mainAttachmentObject.stencil.view,
                    "stencilLoadOp": "clear", // ステンシルをクリア
                    "stencilStoreOp": "store",
                    "stencilClearValue": 0
                }
            };
            const clearPass = this.commandEncoder!.beginRenderPass(clearPassDescriptor);
            clearPass.end();
        } else if (currentClipLevel > 1 && this.$mainAttachmentObject?.stencil) {
            // ネストされたマスクの場合、上位レベルのステンシルビットをクリア
            // WebGL: stencilMask(1 << clipLevel), stencilOp(REPLACE, REPLACE, REPLACE)
            // 全画面矩形を描画してステンシルビットをクリア
            const clearLevel = currentClipLevel; // デクリメント前のレベル
            const clampedLevel = Math.min(8, Math.max(1, clearLevel));
            const pipelineName = `clip_clear_main_${clampedLevel}`;
            const pipeline = this.pipelineManager.getPipeline(pipelineName);

            if (pipeline) {
                // ステンシル付きレンダーパスを開始
                const renderPassDescriptor = this.frameBufferManager.createStencilRenderPassDescriptor(
                    this.$mainAttachmentObject.texture!.view,
                    this.$mainAttachmentObject.stencil.view,
                    "load", // カラーは保持
                    "load"  // ステンシルは保持（特定のビットのみクリア）
                );
                const passEncoder = this.commandEncoder!.beginRenderPass(renderPassDescriptor);

                // 全画面矩形を描画（ステンシルビットをクリア）
                // 17-float vertex buffer format for clip pipelines
                // Format: position(2) + bezier(2) + color(4) + matrix(9) = 17 floats
                // Matrix is identity: row0=(1,0,0), row1=(0,1,0), row2=(0,0,1)
                const fullScreenMesh = new Float32Array([
                    // Triangle 1: (0,0), (1,0), (0,1)
                    0, 0, 0.5, 0.5, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1,
                    1, 0, 0.5, 0.5, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1,
                    0, 1, 0.5, 0.5, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1,
                    // Triangle 2: (1,0), (1,1), (0,1)
                    1, 0, 0.5, 0.5, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1,
                    1, 1, 0.5, 0.5, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1,
                    0, 1, 0.5, 0.5, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1
                ]);
                const meshBuffer = this.bufferManager.createVertexBuffer(
                    `stencil_clear_mesh_${Date.now()}`,
                    fullScreenMesh
                );

                passEncoder.setPipeline(pipeline);
                passEncoder.setStencilReference(0); // 参照値0でREPLACE
                passEncoder.setVertexBuffer(0, meshBuffer);
                passEncoder.draw(6, 1, 0, 0);
                passEncoder.end();
            }
        }
    }
}
