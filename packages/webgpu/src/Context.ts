import type { IAttachmentObject } from "./interface/IAttachmentObject";
import type { IBlendMode } from "./interface/IBlendMode";
import type { IBounds } from "./interface/IBounds";
import type { Node } from "@next2d/texture-packer";
import { TexturePacker } from "@next2d/texture-packer";
import { WebGPUUtil, $setContext } from "./WebGPUUtil";
import { PathCommand } from "./PathCommand";
import { BufferManager } from "./BufferManager";
import { TextureManager } from "./TextureManager";
import { FrameBufferManager } from "./FrameBufferManager";
import { AttachmentManager } from "./AttachmentManager";
import { PipelineManager } from "./Shader/PipelineManager";
import { $rootNodes } from "./AtlasManager";
import { addDisplayObjectToInstanceArray, getInstancedShaderManager } from "./Blend/BlendInstancedManager";
// Note: MeshStrokeGenerateUseCase is now used via ContextStrokeUseCase
import { execute as maskBeginMaskService } from "./Mask/service/MaskBeginMaskService";
import { execute as maskSetMaskBoundsService } from "./Mask/service/MaskSetMaskBoundsService";
import { execute as maskEndMaskService } from "./Mask/service/MaskEndMaskService";
import { execute as maskLeaveMaskUseCase } from "./Mask/usecase/MaskLeaveMaskUseCase";
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
import { execute as contextStrokeUseCase } from "./Context/usecase/ContextStrokeUseCase";
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
            device: device,
            format: preferred_format,
            alphaMode: "premultiplied"
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
     * @description 背景色で塗りつぶす（メインキャンバス）
     * @return {void}
     */
    fillBackgroundColor (): void
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

        const renderPassDescriptor: GPURenderPassDescriptor = {
            colorAttachments: [{
                view: this.mainTextureView!,
                clearValue: {
                    r: this.$clearColorR,
                    g: this.$clearColorG,
                    b: this.$clearColorB,
                    a: this.$clearColorA
                },
                loadOp: "clear",
                storeOp: "store"
            }]
        };

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
        // キャンバスのサイズを更新
        const canvas = this.canvasContext.canvas;
        
        // 型チェックを安全に実行（Worker環境対応）
        if (canvas && 'width' in canvas && 'height' in canvas) {
            (canvas as any).width = width;
            (canvas as any).height = height;
        }

        // 共有アタッチメントをクリア
        if (cache_clear) {
            $clearGradientAttachmentObjects();
            $clearFilterGradientAttachment();
        }

        // canvasContextを再設定
        this.canvasContext.configure({
            device: this.device,
            format: this.preferredFormat,
            alphaMode: "premultiplied"
        });
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
        if (pathVertices.length === 0) return;

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

            const renderPassDescriptor = this.frameBufferManager.createRenderPassDescriptor(
                textureView,
                0, 0, 0, 0,
                "load"
            );

            this.renderPassEncoder = this.commandEncoder!.beginRenderPass(renderPassDescriptor);
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
            this.fillSimple(vertexBuffer, mesh.indexCount, viewportWidth, viewportHeight);
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
     * @return {void}
     */
    private fillSimple(
        vertexBuffer: GPUBuffer,
        vertexCount: number,
        viewportWidth: number,
        viewportHeight: number
    ): void
    {
        contextFillSimpleService(
            this.device,
            this.renderPassEncoder!,
            this.bufferManager,
            this.pipelineManager,
            vertexBuffer,
            vertexCount,
            viewportWidth,
            viewportHeight,
            !!this.currentRenderTarget
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
     * @description 線の描画を実行
     * @return {void}
     */
    stroke (): void
    {
        const paths = this.pathCommand.getAllPaths();
        if (paths.length === 0) return;

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
        const textureView = this.getCurrentTextureView();

        const renderPassDescriptor = this.frameBufferManager.createRenderPassDescriptor(
            textureView,
            0, 0, 0, 0,
            "load"
        );

        this.renderPassEncoder = this.commandEncoder!.beginRenderPass(renderPassDescriptor);

        contextStrokeUseCase(
            this.device,
            this.renderPassEncoder,
            this.bufferManager,
            this.pipelineManager,
            paths,
            this.thickness / 2,
            this.$matrix,
            this.$strokeStyle,
            this.globalAlpha,
            !!this.currentRenderTarget
        );

        this.renderPassEncoder.end();
        this.renderPassEncoder = null;
    }

    /**
     * @description グラデーションの塗りつぶしを実行
     * @param {number} type - 0: linear, 1: radial
     * @param {number[]} stops - グラデーションストップ配列 [offset, R, G, B, A, ...]
     * @param {Float32Array} matrix - グラデーション変換行列 [a, b, c, d, tx, ty]
     * @param {number} spread - スプレッドメソッド (0: pad, 1: reflect, 2: repeat)
     * @param {number} interpolation - 補間方法 (0: RGB, 1: linearRGB)
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
        if (pathVertices.length === 0) return;

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

        contextGradientFillUseCase(
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
            !!this.currentRenderTarget
        );
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
        if (pathVertices.length === 0) return;

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

        contextBitmapFillUseCase(
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
            !!this.currentRenderTarget
        );
    }

    /**
     * @description グラデーション線の描画を実行
     * @param {number} type - 0: linear, 1: radial
     * @param {number[]} stops - グラデーションストップ配列 [offset, R, G, B, A, ...]
     * @param {Float32Array} matrix - グラデーション変換行列 [a, b, c, d, tx, ty]
     * @param {number} spread - スプレッドメソッド (0: pad, 1: reflect, 2: repeat)
     * @param {number} interpolation - 補間方法 (0: RGB, 1: linearRGB)
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
        const paths = this.pathCommand.getAllPaths();
        if (paths.length === 0) return;

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

        contextGradientStrokeUseCase(
            this.device,
            this.renderPassEncoder!,
            this.bufferManager,
            this.pipelineManager,
            paths,
            this.thickness / 2,
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
        const paths = this.pathCommand.getAllPaths();
        if (paths.length === 0) return;

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

        contextBitmapStrokeUseCase(
            this.device,
            this.renderPassEncoder!,
            this.bufferManager,
            this.pipelineManager,
            paths,
            this.thickness / 2,
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
     * @return {void}
     */
    clip (): void
    {
        const currentAttachment = this.frameBufferManager.getCurrentAttachment();
        if (!currentAttachment) {
            return;
        }

        const pathVertices = this.pathCommand.$getVertices;
        if (pathVertices.length === 0) {
            return;
        }

        if (!this.renderPassEncoder) {
            return;
        }

        contextClipUseCase(
            this.renderPassEncoder,
            this.bufferManager,
            this.pipelineManager,
            currentAttachment,
            pathVertices,
            this.$matrix,
            this.$fillStyle,
            this.globalAlpha
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
     * @return {IAttachmentObject | null}
     */
    get currentAttachmentObject (): IAttachmentObject | null
    {
        return this.frameBufferManager.getCurrentAttachment();
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

            // ステンシルバッファ付きレンダーパス（2パスステンシルフィル用）
            if (attachment.stencil?.view) {
                const renderPassDescriptor = this.frameBufferManager.createStencilRenderPassDescriptor(
                    attachment.texture.view,
                    attachment.stencil.view,
                    "load", // カラーは既存の内容を保持
                    "clear" // ステンシルはクリア
                );
                this.renderPassEncoder = this.commandEncoder!.beginRenderPass(renderPassDescriptor);
            } else {
                // ステンシルがない場合は通常のレンダーパス（フォールバック）
                const renderPassDescriptor = this.frameBufferManager.createRenderPassDescriptor(
                    attachment.texture.view,
                    0, 0, 0, 0,
                    "load"
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
        this.renderPassEncoder = contextDrawArraysInstancedUseCase(
            this.device,
            this.commandEncoder!,
            this.renderPassEncoder,
            this.mainTextureView!,
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
     * @param {Node} node
     * @param {Uint8Array} pixels
     * @return {void}
     */
    drawPixels (node: Node, pixels: Uint8Array): void
    {
        // WebGPU draw pixels
        // アトラステクスチャの指定位置にピクセルデータを書き込む
        const attachment = this.frameBufferManager.getAttachment("atlas");
        if (!attachment) return;

        // ピクセルデータをテクスチャにコピー
        if (!attachment.texture) return;

        this.device.queue.writeTexture(
            {
                texture: attachment.texture.resource,
                origin: { x: node.x, y: node.y, z: 0 }
            },
            pixels.buffer,
            {
                bytesPerRow: node.w * 4, // RGBA
                rowsPerImage: node.h,
                offset: pixels.byteOffset
            },
            {
                width: node.w,
                height: node.h,
                depthOrArrayLayers: 1
            }
        );
    }

    /**
     * @description OffscreenCanvasをNodeの指定箇所に転送
     * @param {Node} node
     * @param {OffscreenCanvas | ImageBitmap} element
     * @return {void}
     */
    drawElement (node: Node, element: OffscreenCanvas | ImageBitmap): void
    {
        // WebGPU draw element
        // OffscreenCanvasまたはImageBitmapをアトラステクスチャにコピー
        const attachment = this.frameBufferManager.getAttachment("atlas");
        if (!attachment || !attachment.texture) return;

        try {
            this.device.queue.copyExternalImageToTexture(
                {
                    source: element as ImageBitmap,
                    flipY: false
                },
                {
                    texture: attachment.texture.resource,
                    origin: { x: node.x, y: node.y, z: 0 },
                    premultipliedAlpha: true
                },
                {
                    width: element.width || node.w,
                    height: element.height || node.h,
                    depthOrArrayLayers: 1
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
            device: this.device,
            commandEncoder: this.commandEncoder!,
            frameBufferManager: this.frameBufferManager,
            pipelineManager: this.pipelineManager,
            textureManager: this.textureManager
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
        
        if (!($rootNodes[index])) {
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
     * @return {void}
     */
    transferMainCanvas (): void
    {
        // WebGPUでは明示的な転送は不要
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
        const bytesPerRow = Math.ceil((width * bytesPerPixel) / 256) * 256; // 256バイトアライメント
        const bufferSize = bytesPerRow * height;
        
        // ピクセルバッファを作成
        const pixelBuffer = this.device.createBuffer({
            size: bufferSize,
            usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ
        });
        
        // コマンドエンコーダーを作成
        const commandEncoder = this.device.createCommandEncoder();
        
        // アトラステクスチャからピクセルバッファにコピー
        if (!attachment.texture) {
            throw new Error("Attachment texture is null");
        }

        commandEncoder.copyTextureToBuffer(
            {
                texture: attachment.texture.resource,
                mipLevel: 0,
                origin: { x: 0, y: 0, z: 0 }
            },
            {
                buffer: pixelBuffer,
                bytesPerRow: bytesPerRow,
                rowsPerImage: height
            },
            {
                width: width,
                height: height,
                depthOrArrayLayers: 1
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
        if (typeof createImageBitmap !== 'undefined') {
            return await createImageBitmap(imageData, {
                premultiplyAlpha: "none",
                colorSpaceConversion: "none"
            });
        } else {
            // Fallback: createImageBitmapがない環境用
            throw new Error("[WebGPU] createImageBitmap not available in this environment");
        }
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
        maskBeginMaskService();
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
        maskEndMaskService();
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
        maskLeaveMaskUseCase();
    }
}
