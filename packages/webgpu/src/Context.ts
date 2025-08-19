import type { IAttachmentObject } from "./interface/IAttachmentObject";
import {
    $setRenderMaxSize,
    $setWebGPUDevice,
    $setWebGPUCanvasContext,
    $setSamples,
    $getFloat32Array9,
    $setContext,
    $setDevicePixelRatio
} from "./WebGPUUtil";

/**
 * @description WebGPU版、Next2Dのコンテキスト
 *              WebGPU version, Next2D context
 *
 * @class
 */
export class Context
{
    /**
     * @description matrixのデータを保持するスタック
     *              Stack to hold matrix data
     *
     * @type {Float32Array[]}
     * @protected
     */
    public readonly $stack: Float32Array[];

    /**
     * @description 2D変換行列
     *              2D transformation matrix
     *
     * @type {Float32Array}
     * @protected
     */
    public readonly $matrix: Float32Array;

    /**
     * @description 背景色のR
     *              Background color R
     *
     * @type {number}
     * @protected
     */
    public $clearColorR: number;

    /**
     * @description 背景色のG
     *              Background color G
     *
     * @type {number}
     * @protected
     */
    public $clearColorG: number;

    /**
     * @description 背景色のB
     *              Background color B
     *
     * @type {number}
     * @protected
     */
    public $clearColorB: number;

    /**
     * @description 背景色のA
     *              Background color A
     *
     * @type {number}
     * @protected
     */
    public $clearColorA: number;

    /**
     * @description メインのアタッチメントオブジェクト
     *              Main attachment object
     *
     * @type {IAttachmentObject}
     * @protected
     */
    public $mainAttachmentObject: IAttachmentObject | null;

    /**
     * @description アタッチメントオブジェクトを保持するスタック
     *              Stack to hold attachment objects
     *
     * @type {IAttachmentObject[]}
     * @protected
     */
    public readonly $attachmentStack: IAttachmentObject[];

    /**
     * @description 現在のアタッチメントオブジェクト
     *              Current attachment object
     *
     * @type {IAttachmentObject | null}
     * @protected
     */
    public currentAttachmentObject: IAttachmentObject | null;

    /**
     * @description WebGPUデバイス
     *              WebGPU device
     *
     * @type {GPUDevice}
     * @protected
     */
    public readonly $device: GPUDevice;

    /**
     * @description WebGPUキャンバスコンテキスト
     *              WebGPU canvas context
     *
     * @type {GPUCanvasContext}
     * @protected
     */
    public readonly $canvasContext: GPUCanvasContext;

    /**
     * @param {GPUDevice} device
     * @param {GPUCanvasContext} canvas_context
     * @param {number} samples
     * @param {number} [device_pixel_ratio=1]
     * @constructor
     * @public
     */
    constructor (
        device: GPUDevice,
        canvas_context: GPUCanvasContext,
        samples: number,
        device_pixel_ratio: number = 1
    ) {
        this.$device = device;
        this.$canvasContext = canvas_context;
        this.$stack = [];
        this.$matrix = $getFloat32Array9();
        this.$clearColorR = 1;
        this.$clearColorG = 1;
        this.$clearColorB = 1;
        this.$clearColorA = 1;
        this.$mainAttachmentObject = null;
        this.$attachmentStack = [];
        this.currentAttachmentObject = null;

        // Set global WebGPU context
        $setWebGPUDevice(device);
        $setWebGPUCanvasContext(canvas_context);
        $setSamples(samples);
        $setDevicePixelRatio(device_pixel_ratio);

        // Configure canvas context
        const canvasFormat = navigator.gpu?.getPreferredCanvasFormat() ?? "bgra8unorm";
        canvas_context.configure({
            "device": device,
            "format": canvasFormat,
            "alphaMode": "premultiplied"
        });

        // Get device limits and set render max size
        const limits = device.limits;
        $setRenderMaxSize(Math.min(limits.maxTextureDimension2D, 4096));

        // Initialize WebGPU-specific components
        // TODO: Initialize equivalent WebGPU managers and services

        // Set context reference
        $setContext(this);
    }

    /**
     * @description コンテキストを指定のアタッチメントオブジェクトにバインド
     *              Bind context to specified attachment object
     *
     * @param  {IAttachmentObject} attachment_object
     * @return {void}
     * @method
     * @public
     */
    bind (attachment_object: IAttachmentObject): void
    {
        // TODO: Implement WebGPU binding logic
        this.currentAttachmentObject = attachment_object;
    }

    /**
     * @description コンテキストのサイズを変更
     *              Resize the context
     *
     * @param  {number} _width
     * @param  {number} _height
     * @return {void}
     * @method
     * @public
     */
    resize (_width: number, _height: number): void
    {
        // TODO: Implement WebGPU resize logic
    }

    /**
     * @description 背景色を更新
     *              Update background color
     *
     * @param  {number} r
     * @param  {number} g
     * @param  {number} b
     * @param  {number} a
     * @return {void}
     * @method
     * @public
     */
    updateBackgroundColor (r: number, g: number, b: number, a: number): void
    {
        this.$clearColorR = r;
        this.$clearColorG = g;
        this.$clearColorB = b;
        this.$clearColorA = a;
    }

    /**
     * @description 背景色で塗りつぶし
     *              Fill with background color
     *
     * @return {void}
     * @method
     * @public
     */
    fillBackgroundColor (): void
    {
        // TODO: Implement WebGPU background fill
    }

    /**
     * @description 指定の矩形領域をクリア
     *              Clear specified rectangular area
     *
     * @param  {number} _x
     * @param  {number} _y
     * @param  {number} _width
     * @param  {number} _height
     * @return {void}
     * @method
     * @public
     */
    clearRect (_x: number, _y: number, _width: number, _height: number): void
    {
        // TODO: Implement WebGPU clear rect
    }

    /**
     * @description コンテキストの状態を保存
     *              Save context state
     *
     * @return {void}
     * @method
     * @public
     */
    save (): void
    {
        const matrix = $getFloat32Array9();
        matrix.set(this.$matrix);
        this.$stack.push(matrix);
    }

    /**
     * @description コンテキストの状態を復元
     *              Restore context state
     *
     * @return {void}
     * @method
     * @public
     */
    restore (): void
    {
        const matrix = this.$stack.pop();
        if (matrix) {
            this.$matrix.set(matrix);
        }
    }

    /**
     * @description 変換行列をセット
     *              Set transformation matrix
     *
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
        this.$matrix[0] = a;
        this.$matrix[1] = b;
        this.$matrix[2] = c;
        this.$matrix[3] = d;
        this.$matrix[4] = e;
        this.$matrix[5] = f;
    }

    /**
     * @description 変換行列を乗算
     *              Multiply transformation matrix
     *
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
        const ma = this.$matrix[0], mb = this.$matrix[1], mc = this.$matrix[2];
        const md = this.$matrix[3], me = this.$matrix[4], mf = this.$matrix[5];

        this.$matrix[0] = ma * a + mc * b;
        this.$matrix[1] = mb * a + md * b;
        this.$matrix[2] = ma * c + mc * d;
        this.$matrix[3] = mb * c + md * d;
        this.$matrix[4] = ma * e + mc * f + me;
        this.$matrix[5] = mb * e + md * f + mf;
    }

    /**
     * @description コンテキストの値を初期化する
     *              Initialize the values of the context
     *
     * @return {void}
     * @method
     * @public
     */
    reset (): void
    {
        // TODO: Implement WebGPU context reset
    }

    /**
     * @description パスを開始
     *              Start the path
     *
     * @return {void}
     * @method
     * @public
     */
    beginPath (): void
    {
        // TODO: Implement WebGPU begin path
    }

    /**
     * @description パスを移動
     *              Move the path
     *
     * @param  {number} _x
     * @param  {number} _y
     * @return {void}
     * @method
     * @public
     */
    moveTo (_x: number, _y: number): void
    {
        // TODO: Implement WebGPU move to
    }

    /**
     * @description パスに線を追加
     *              Add line to path
     *
     * @param  {number} _x
     * @param  {number} _y
     * @return {void}
     * @method
     * @public
     */
    lineTo (_x: number, _y: number): void
    {
        // TODO: Implement WebGPU line to
    }

    /**
     * @description パスを閉じる
     *              Close the path
     *
     * @return {void}
     * @method
     * @public
     */
    closePath (): void
    {
        // TODO: Implement WebGPU close path
    }

    /**
     * @description パスを塗りつぶし
     *              Fill the path
     *
     * @return {void}
     * @method
     * @public
     */
    fill (): void
    {
        // TODO: Implement WebGPU fill
    }

    /**
     * @description パスをストローク
     *              Stroke the path
     *
     * @return {void}
     * @method
     * @public
     */
    stroke (): void
    {
        // TODO: Implement WebGPU stroke
    }

    /**
     * @description パスをクリップ
     *              Clip the path
     *
     * @return {void}
     * @method
     * @public
     */
    clip (): void
    {
        // TODO: Implement WebGPU clip
    }
}