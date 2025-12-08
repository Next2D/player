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
import { renderQueue } from "@next2d/render-queue";
import { generateStrokeMesh } from "./Mesh/usecase/MeshStrokeGenerateUseCase";
import { execute as maskBeginMaskService } from "./Mask/service/MaskBeginMaskService";
import { execute as maskSetMaskBoundsService } from "./Mask/service/MaskSetMaskBoundsService";
import { execute as maskEndMaskService } from "./Mask/service/MaskEndMaskService";
import { execute as maskLeaveMaskUseCase } from "./Mask/usecase/MaskLeaveMaskUseCase";
import { execute as meshFillGenerateUseCase } from "./Mesh/usecase/MeshFillGenerateUseCase";

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
        WebGPUUtil.setContext(canvas_context);
        WebGPUUtil.setPreferredFormat(preferred_format);
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

        this.pathCommand = new PathCommand();
        this.bufferManager = new BufferManager(device);
        this.textureManager = new TextureManager(device);
        this.frameBufferManager = new FrameBufferManager(device, preferred_format);
        this.pipelineManager = new PipelineManager(device, preferred_format);
        this.attachmentManager = new AttachmentManager(device);

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

        const passEncoder = this.commandEncoder!.beginRenderPass(renderPassDescriptor);
        passEncoder.end();
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

        // キャッシュをクリア
        if (cache_clear) {
            // TODO: キャッシュクリア実装
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
    clearRect (x: number, y: number, w: number, h: number): void
    {
        // WebGPU clear rect implementation
        console.log("[WebGPU] clearRect()", { x, y, w, h });
        
        // フレームが開始されていない場合は開始
        if (!this.frameStarted) {
            this.beginFrame();
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
        
        // 指定領域を透明でクリア
        // TODO: シザーとクリアを使用した実装
        
        this.renderPassEncoder.end();
        this.renderPassEncoder = null;
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

        // 既存のレンダーパスを終了
        if (this.renderPassEncoder) {
            this.renderPassEncoder.end();
            this.renderPassEncoder = null;
        }

        // コマンドエンコーダーを確保
        this.ensureCommandEncoder();

        // 現在のレンダーターゲットを取得（メインまたはオフスクリーン）
        const textureView = this.getCurrentTextureView();

        const renderPassDescriptor = this.frameBufferManager.createRenderPassDescriptor(
            textureView,
            0, 0, 0, 0,
            "load"
        );

        this.renderPassEncoder = this.commandEncoder!.beginRenderPass(renderPassDescriptor);

        // ビューポートサイズ
        const canvasWidth = this.canvasContext.canvas.width;
        const canvasHeight = this.canvasContext.canvas.height;

        // 色（プリマルチプライドアルファ）
        const red = this.$fillStyle[0] * this.globalAlpha;
        const green = this.$fillStyle[1] * this.globalAlpha;
        const blue = this.$fillStyle[2] * this.globalAlpha;
        const alpha = this.$fillStyle[3] * this.globalAlpha;

        // MeshFillGenerateUseCaseでLoop-Blinn対応頂点データを生成
        const mesh = meshFillGenerateUseCase(
            pathVertices,
            this.$matrix[0], this.$matrix[1],
            this.$matrix[3], this.$matrix[4],
            this.$matrix[6], this.$matrix[7],
            red, green, blue, alpha
        );

        if (mesh.indexCount === 0) {
            this.renderPassEncoder.end();
            this.renderPassEncoder = null;
            return;
        }

        // 頂点バッファを作成（17 floats per vertex）
        const vertexBuffer = this.bufferManager.createVertexBuffer(
            `fill_${Date.now()}`,
            mesh.buffer
        );

        // Uniform data: viewport size only (8 bytes → 16 bytes aligned)
        const uniformData = new Float32Array(4);
        uniformData[0] = canvasWidth;
        uniformData[1] = canvasHeight;
        uniformData[2] = 0;
        uniformData[3] = 0;

        const uniformBuffer = this.bufferManager.createUniformBuffer(
            `fill_uniform_${Date.now()}`,
            uniformData.byteLength
        );
        this.device.queue.writeBuffer(uniformBuffer, 0, uniformData.buffer, uniformData.byteOffset, uniformData.byteLength);

        // バインドグループを作成
        const bindGroupLayout = this.pipelineManager.getBindGroupLayout("fill");
        if (!bindGroupLayout) {
            console.error("[WebGPU] Fill bind group layout not found");
            this.renderPassEncoder.end();
            this.renderPassEncoder = null;
            return;
        }

        const bindGroup = this.device.createBindGroup({
            layout: bindGroupLayout,
            entries: [{
                binding: 0,
                resource: { buffer: uniformBuffer }
            }]
        });

        // パイプラインを取得して描画
        const pipeline = this.pipelineManager.getPipeline("fill");
        if (!pipeline) {
            console.error("[WebGPU] Fill pipeline not found");
            this.renderPassEncoder.end();
            this.renderPassEncoder = null;
            return;
        }

        this.renderPassEncoder.setPipeline(pipeline);
        this.renderPassEncoder.setVertexBuffer(0, vertexBuffer);
        this.renderPassEncoder.setBindGroup(0, bindGroup);
        this.renderPassEncoder.draw(mesh.indexCount, 1, 0, 0);

        this.renderPassEncoder.end();
        this.renderPassEncoder = null;
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
        if (attachment.colorTexture) {
            this.currentRenderTarget = attachment.colorTexture.view;
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
        // WebGPU stroke implementation
        const paths = this.pathCommand.getAllPaths();
        if (paths.length === 0) return;

        // フレームが開始されていない場合は開始
        if (!this.frameStarted) {
            this.beginFrame();
        }

        // ストロークメッシュを生成
        const thickness = this.thickness / 2;
        const vertices = generateStrokeMesh(paths, thickness);

        if (vertices.length === 0) return;

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
        
        // 頂点バッファを作成
        const vertexBuffer = this.bufferManager.createVertexBuffer(
            `stroke_${Date.now()}`,
            vertices
        );

        // Uniformバッファを作成
        const uniformData = new Float32Array([
            ...this.$matrix,        // 9 floats for matrix
            ...this.$strokeStyle,   // 4 floats for color
            this.globalAlpha        // 1 float for alpha
        ]);

        const uniformBuffer = this.bufferManager.createUniformBuffer(
            `stroke_uniform_${Date.now()}`,
            uniformData.byteLength
        );
        this.device.queue.writeBuffer(uniformBuffer, 0, uniformData.buffer, uniformData.byteOffset, uniformData.byteLength);

        // バインドグループを作成
        const bindGroupLayout = this.pipelineManager.getBindGroupLayout("basic");
        if (!bindGroupLayout) {
            console.error("[WebGPU] Basic bind group layout not found");
            this.renderPassEncoder.end();
            this.renderPassEncoder = null;
            return;
        }

        const bindGroup = this.device.createBindGroup({
            layout: bindGroupLayout,
            entries: [{
                binding: 0,
                resource: { buffer: uniformBuffer }
            }]
        });

        // パイプラインを取得して描画
        const pipeline = this.pipelineManager.getPipeline("basic");
        if (!pipeline) {
            console.error("[WebGPU] Basic pipeline not found");
            this.renderPassEncoder.end();
            this.renderPassEncoder = null;
            return;
        }

        this.renderPassEncoder.setPipeline(pipeline);
        this.renderPassEncoder.setVertexBuffer(0, vertexBuffer);
        this.renderPassEncoder.setBindGroup(0, bindGroup);
        this.renderPassEncoder.draw(vertices.length / 4, 1, 0, 0);
        
        this.renderPassEncoder.end();
        this.renderPassEncoder = null;
    }

    /**
     * @description グラデーションの塗りつぶしを実行
     * @param {number} type
     * @param {number[]} stops
     * @param {Float32Array} matrix
     * @param {number} spread
     * @param {number} interpolation
     * @param {number} focal
     * @return {void}
     */
    gradientFill (
        type: number,
        stops: number[],
        _matrix: Float32Array,
        _spread: number,
        _interpolation: number,
        _focal: number
    ): void {
        // WebGPU gradient fill implementation
        const vertices = this.pathCommand.generateVertices();
        if (vertices.length === 0) return;

        // フレームが開始されていない場合は開始
        if (!this.frameStarted) {
            this.beginFrame();
        }

        console.log("[WebGPU] gradientFill()", {
            type,
            stops: stops.length,
            spread: _spread,
            interpolation: _interpolation,
            focal: _focal
        });

        // TODO: グラデーションLUTテクスチャを生成
        // TODO: グラデーション用のシェーダーを使用
        // 現在は基本的なfill()として実装
        this.fill();
    }

    /**
     * @description ビットマップの塗りつぶしを実行
     * @param {Uint8Array} pixels
     * @param {Float32Array} matrix
     * @param {number} width
     * @param {number} height
     * @param {boolean} repeat
     * @param {boolean} smooth
     * @return {void}
     */
    bitmapFill (
        pixels: Uint8Array,
        _matrix: Float32Array,
        width: number,
        height: number,
        repeat: boolean,
        smooth: boolean
    ): void {
        // WebGPU bitmap fill implementation
        const vertices = this.pathCommand.generateVertices();
        if (vertices.length === 0) return;

        // フレームが開始されていない場合は開始
        if (!this.frameStarted) {
            this.beginFrame();
        }

        // テクスチャを作成
        const textureName = `bitmap_fill_${Date.now()}`;
        this.textureManager.createTextureFromPixels(
            textureName,
            pixels,
            width,
            height
        );

        const texture = this.textureManager.getTexture(textureName);
        if (!texture) {
            console.error("[WebGPU] Failed to create bitmap texture");
            return;
        }

        // サンプラーを作成
        const samplerName = repeat ? "repeat" : (smooth ? "linear" : "nearest");
        const sampler = this.textureManager.getSampler(samplerName);
        if (!sampler) {
            console.error("[WebGPU] Sampler not found");
            return;
        }

        console.log("[WebGPU] bitmapFill()", { width, height, repeat, smooth });

        // TODO: ビットマップ塗りつぶし用のシェーダーを使用
        // 現在は基本的なfill()として実装
        this.fill();

        // テクスチャをクリーンアップ
        this.textureManager.destroyTexture(textureName);
    }

    /**
     * @description グラデーション線の描画を実行
     * @param {number} type
     * @param {number[]} stops
     * @param {Float32Array} matrix
     * @param {number} spread
     * @param {number} interpolation
     * @param {number} focal
     * @return {void}
     */
    gradientStroke (
        type: number,
        stops: number[],
        _matrix: Float32Array,
        _spread: number,
        _interpolation: number,
        _focal: number
    ): void {
        // WebGPU gradient stroke implementation
        console.log("[WebGPU] gradientStroke()", { type, stops: stops.length });
        
        // TODO: グラデーションストローク実装
        this.stroke();
    }

    /**
     * @description ビットマップ線の描画を実行
     * @param {Uint8Array} pixels
     * @param {Float32Array} matrix
     * @param {number} width
     * @param {number} height
     * @param {boolean} repeat
     * @param {boolean} smooth
     * @return {void}
     */
    bitmapStroke (
        _pixels: Uint8Array,
        _matrix: Float32Array,
        width: number,
        height: number,
        repeat: boolean,
        smooth: boolean
    ): void {
        // WebGPU bitmap stroke implementation
        console.log("[WebGPU] bitmapStroke()", { width, height, repeat, smooth });
        
        // TODO: ビットマップストローク実装
        this.stroke();
    }

    /**
     * @description マスク処理を実行
     * @return {void}
     */
    clip (): void
    {
        // WebGPU clip implementation
        // ステンシルバッファを使用したクリッピング
        const vertices = this.pathCommand.generateVertices();
        if (vertices.length === 0) return;

        console.log("[WebGPU] clip() - stencil clipping");
        
        // TODO: ステンシルバッファを使用したクリッピング実装
        // 現在は基本的なfill()として実装
        this.fill();
    }

    /**
     * @description アタッチメントオブジェクトをバインド
     * @param {IAttachmentObject} attachment_object
     * @return {void}
     */
    bind (attachment_object: IAttachmentObject): void
    {
        this.frameBufferManager.setCurrentAttachment(attachment_object);
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
        // WebGPU grid implementation
        if (grid_data) {
            console.log("[WebGPU] useGrid() - 9-slice grid data set", grid_data.length);
            // TODO: Grid/9-slice transformation implementation
        }
    }

    /**
     * @description 指定のノード範囲で描画を開始（アトラステクスチャへの描画）
     * @param {Node} node
     * @return {void}
     */
    beginNodeRendering (node: Node): void
    {
        // フレームが開始されていない場合は開始
        if (!this.frameStarted) {
            this.beginFrame();
        }

        // アトラステクスチャの該当箇所をレンダーターゲットに設定
        const attachment = this.frameBufferManager.getAttachment("atlas");
        if (attachment) {
            this.currentRenderTarget = attachment.textureView;
            
            // コマンドエンコーダーを確保
            this.ensureCommandEncoder();
            
            // ノード領域のビューポートを設定してレンダーパスを開始
            const renderPassDescriptor = this.frameBufferManager.createRenderPassDescriptor(
                attachment.textureView,
                0, 0, 0, 0,
                "load" // 既存の内容を保持
            );
            
            this.renderPassEncoder = this.commandEncoder!.beginRenderPass(renderPassDescriptor);
            
            // ビューポートとシザーを設定（node範囲のみ描画）
            this.renderPassEncoder.setViewport(
                node.x, node.y,
                node.w, node.h,
                0, 1
            );
            this.renderPassEncoder.setScissorRect(
                node.x, node.y,
                node.w, node.h
            );
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
    }

    /**
     * @description 塗りの描画を実行
     * @return {void}
     */
    drawFill (): void
    {
        // WebGPU draw fill
        // fill()と同じ処理
        this.fill();
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
            renderMaxSize
        );
    }

    /**
     * @description インスタンス配列を描画
     * @return {void}
     */
    drawArraysInstanced (): void
    {
        // WebGPU instanced arrays drawing
        const shaderManager = getInstancedShaderManager();
        
        if (shaderManager.count === 0) {
            return;
        }

        // フレームが開始されていない場合は開始
        if (!this.frameStarted) {
            this.beginFrame();
        }

        console.log(`[WebGPU] drawArraysInstanced: ${shaderManager.count} instances, offset: ${renderQueue.offset}`);

        // 既存のレンダーパスを終了
        if (this.renderPassEncoder) {
            this.renderPassEncoder.end();
            this.renderPassEncoder = null;
        }

        // コマンドエンコーダーを確保
        this.ensureCommandEncoder();
        
        // メインテクスチャにレンダリング
        const renderPassDescriptor = this.frameBufferManager.createRenderPassDescriptor(
            this.mainTextureView!,
            0, 0, 0, 0,
            "load" // 既存の内容を保持
        );

        this.renderPassEncoder = this.commandEncoder!.beginRenderPass(renderPassDescriptor);

        // パイプラインを取得
        const pipeline = this.pipelineManager.getPipeline("instanced");
        if (!pipeline) {
            console.error("[WebGPU] Instanced pipeline not found");
            this.renderPassEncoder.end();
            this.renderPassEncoder = null;
            return;
        }

        this.renderPassEncoder.setPipeline(pipeline);

        // インスタンスバッファを作成
        // renderQueue.offsetは配列のインデックスなので、そのまま使用
        const instanceData = new Float32Array(
            renderQueue.buffer.buffer,
            renderQueue.buffer.byteOffset,
            renderQueue.offset  // 要素数
        );
        
        console.log(`[WebGPU] Instance buffer: ${instanceData.length} floats (${instanceData.byteLength} bytes) for ${shaderManager.count} instances`);
        
        const instanceBuffer = this.bufferManager.createVertexBuffer(
            `instance_${Date.now()}`,
            instanceData
        );

        // 頂点バッファ（矩形）を作成
        const vertices = this.bufferManager.createRectVertices(0, 0, 1, 1);
        const vertexBuffer = this.bufferManager.createVertexBuffer(
            `vertex_${Date.now()}`,
            vertices
        );

        // アトラステクスチャをバインド
        const atlasAttachment = this.frameBufferManager.getAttachment("atlas");
        if (!atlasAttachment) {
            console.error("[WebGPU] Atlas attachment not found");
            this.renderPassEncoder.end();
            this.renderPassEncoder = null;
            return;
        }

        // サンプラーを作成
        const sampler = this.textureManager.createSampler("atlas_sampler", false);
        
        // バインドグループを作成
        const bindGroupLayout = this.pipelineManager.getBindGroupLayout("instanced");
        if (!bindGroupLayout) {
            console.error("[WebGPU] Instanced bind group layout not found");
            this.renderPassEncoder.end();
            this.renderPassEncoder = null;
            return;
        }

        const bindGroup = this.device.createBindGroup({
            layout: bindGroupLayout,
            entries: [
                {
                    binding: 0,
                    resource: sampler
                },
                {
                    binding: 1,
                    resource: atlasAttachment.textureView
                }
            ]
        });

        // 描画
        this.renderPassEncoder.setVertexBuffer(0, vertexBuffer);
        this.renderPassEncoder.setVertexBuffer(1, instanceBuffer);
        this.renderPassEncoder.setBindGroup(0, bindGroup);
        this.renderPassEncoder.draw(6, shaderManager.count, 0, 0);

        // レンダーパスを終了
        this.renderPassEncoder.end();
        this.renderPassEncoder = null;

        // インスタンスデータをクリア
        shaderManager.clear();
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
        this.device.queue.writeTexture(
            {
                texture: attachment.texture,
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
        if (!attachment) return;

        try {
            this.device.queue.copyExternalImageToTexture(
                {
                    source: element as ImageBitmap,
                    flipY: false
                },
                {
                    texture: attachment.texture,
                    origin: { x: node.x, y: node.y, z: 0 },
                    premultipliedAlpha: true  // Use premultiplied alpha for consistency
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
        unique_key: string,
        updated: boolean,
        _width: number,
        _height: number,
        is_bitmap: boolean,
        _matrix: Float32Array,
        color_transform: Float32Array,
        blend_mode: IBlendMode,
        bounds: Float32Array,
        params: Float32Array
    ): void {
        // インスタンス配列を先に描画
        this.drawArraysInstanced();
        
        // WebGPU filter application
        console.log("[WebGPU] applyFilter()", {
            unique_key,
            updated,
            width: _width,
            height: _height,
            is_bitmap,
            blend_mode,
            paramsLength: params.length
        });
        
        // TODO: フィルター実装
        // - Blur filter
        // - Glow filter
        // - Drop shadow filter
        // - Color matrix filter
        // - Convolution filter
        
        // 現在は基本的な描画として実装
        this.drawDisplayObject(node, bounds[0], bounds[1], bounds[2], bounds[3], color_transform);
    }

    /**
     * @description メインテクスチャを確保（フレーム開始時に一度だけgetCurrentTexture呼び出し）
     * @return {void}
     * @private
     */
    private ensureMainTexture(): void
    {
        if (!this.mainTexture && !this.frameStarted) {
            console.log("[WebGPU] Getting main canvas texture for new frame");
            this.mainTexture = this.canvasContext.getCurrentTexture();
            this.mainTextureView = this.mainTexture.createView();
            this.frameStarted = true;
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
        // 既存のRenderPassEncoderがある場合は終了
        if (this.renderPassEncoder) {
            this.renderPassEncoder.end();
            this.renderPassEncoder = null;
        }
        
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
            console.log("[WebGPU] Beginning new frame");
            this.ensureMainTexture();
            this.ensureCommandEncoder();
            this.frameStarted = true;
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

        console.log("[WebGPU] endFrame: submitting commands");
        
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
                console.log("[WebGPU] Commands submitted successfully");
            } catch (e) {
                console.error("Failed to submit frame commands:", e);
            }
        }
        
        // 次のフレーム用にクリア
        this.commandEncoder = null;
        this.renderPassEncoder = null;
        this.currentRenderTarget = null;
        
        // テクスチャ参照をクリア（次フレームで新しく取得）
        this.mainTexture = null;
        this.mainTextureView = null;
        this.frameStarted = false;
        
        console.log("[WebGPU] Frame ended, ready for next frame");
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
        commandEncoder.copyTextureToBuffer(
            {
                texture: attachment.texture,
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
                premultiplyAlpha: "premultiply",
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
        // drawArraysInstanced(); // TODO: WebGPU版のインスタンス描画を実装後に追加
        maskLeaveMaskUseCase();
    }
}
