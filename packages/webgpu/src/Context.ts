import type { IBlendMode } from "./interface/IBlendMode";
import type { IBounds } from "./interface/IBounds";
import {
    $setRenderMaxSize,
    $setDevice,
    $setCanvasContext,
    $setSamples,
    $getArray,
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
     * @description 現在の塗りつぶしスタイル
     *              Current fill style
     *
     * @type {Float32Array}
     * @protected
     */
    public readonly $fillStyle: Float32Array;

    /**
     * @description 現在のストロークスタイル
     *              Current stroke style
     *
     * @type {Float32Array}
     * @protected
     */
    public readonly $strokeStyle: Float32Array;

    /**
     * @description マスクの描画範囲
     *              Mask drawing bounds
     *
     * @type {object}
     * @protected
     */
    public readonly maskBounds: IBounds;

    /**
     * @description グローバル合成操作
     *              Global composite operation
     *
     * @type {string}
     * @protected
     */
    public globalCompositeOperation: IBlendMode;

    /**
     * @description 画像スムージングが有効かどうか
     *              Whether image smoothing is enabled
     *
     * @type {boolean}
     * @protected
     */
    public imageSmoothingEnabled: boolean;

    /**
     * @param {GPUDevice} device
     * @param {GPUCanvasContext} canvasContext
     * @param {number} samples
     * @param {number} [device_pixel_ratio=1]
     * @constructor
     * @public
     */
    constructor (
        device: GPUDevice,
        canvasContext: GPUCanvasContext,
        samples: number,
        device_pixel_ratio: number = 1
    ) {

        // WebGPUデバイスとコンテキストを設定
        $setDevice(device);
        $setCanvasContext(canvasContext);

        // デバイスピクセル比率を設定
        $setDevicePixelRatio(device_pixel_ratio);

        // サンプリング数を設定
        $setSamples(samples);

        // 最大描画サイズを設定 (デバイスの制限を考慮)
        const maxTextureSize = device.limits.maxTextureDimension2D;
        $setRenderMaxSize(maxTextureSize);

        // マトリックススタックの初期化
        this.$stack = $getArray() as Float32Array[];

        // 2D変換行列の初期化 (単位行列)
        this.$matrix = new Float32Array([
            1, 0, 0,
            0, 1, 0,
            0, 0, 1
        ]);

        // 背景色の初期化 (透明)
        this.$clearColorR = 0;
        this.$clearColorG = 0;
        this.$clearColorB = 0;
        this.$clearColorA = 0;

        // グローバル合成操作の初期化
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

        // WebGPUテクスチャの設定は不要 (WebGLのpixelStoreiに相当する設定がWebGPUにはない)

        // TODO: FrameBufferManagerの初期起動 (WebGPU版)
        // TODO: VertexArrayObjectの初期起動 (WebGPU版)
        // TODO: ブレンドモードを起動 (WebGPU版)
        // TODO: グラデーションの最大長を設定 (WebGPU版)

        // コンテキストをセット
        $setContext(this);
    }

    /**
     * @description 転送範囲をリセット
     *              Reset the transfer range
     *
     * @return {void}
     * @method
     * @public
     */
    clearTransferBounds (): void
    {
        // TODO: WebGPU版の転送範囲リセット実装
    }

    /**
     * @description 描画をリサイズ
     *              Resize drawing
     *
     * @param  {number} width
     * @param  {number} height
     * @return {void}
     * @method
     * @public
     */
    resize (_width: number, _height: number): void
    {
        // TODO: WebGPU版のリサイズ実装
    }

    /**
     * @description 描画をクリア
     *              Clear drawing
     *
     * @param  {number} x
     * @param  {number} y
     * @param  {number} width
     * @param  {number} height
     * @return {void}
     * @method
     * @public
     */
    clearRect (_x: number, _y: number, _width: number, _height: number): void
    {
        // TODO: WebGPU版のクリア実装
    }

    /**
     * @description 現在の状態を保存
     *              Save the current state
     *
     * @return {void}
     * @method
     * @public
     */
    save (): void
    {
        // TODO: WebGPU版の状態保存実装
    }

    /**
     * @description 保存された状態を復元
     *              Restore the saved state
     *
     * @return {void}
     * @method
     * @public
     */
    restore (): void
    {
        // TODO: WebGPU版の状態復元実装
    }

    /**
     * @description 変換行列を設定
     *              Set the transformation matrix
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
    setTransform (_a: number, _b: number, _c: number, _d: number, _e: number, _f: number): void
    {
        // TODO: WebGPU版の変換行列設定実装
    }

    /**
     * @description 変換行列を変換
     *              Transform the transformation matrix
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
    transform (_a: number, _b: number, _c: number, _d: number, _e: number, _f: number): void
    {
        // TODO: WebGPU版の変換行列変換実装
    }

    /**
     * @description パスを開始
     *              Begin path
     *
     * @return {void}
     * @method
     * @public
     */
    beginPath (): void
    {
        // TODO: WebGPU版のパス開始実装
    }

    /**
     * @description 指定座標に移動
     *              Move to the specified coordinates
     *
     * @param  {number} x
     * @param  {number} y
     * @return {void}
     * @method
     * @public
     */
    moveTo (_x: number, _y: number): void
    {
        // TODO: WebGPU版のmoveTo実装
    }

    /**
     * @description 指定座標に線を描画
     *              Draw a line to the specified coordinates
     *
     * @param  {number} x
     * @param  {number} y
     * @return {void}
     * @method
     * @public
     */
    lineTo (_x: number, _y: number): void
    {
        // TODO: WebGPU版のlineTo実装
    }

    /**
     * @description パスをクローズ
     *              Close path
     *
     * @return {void}
     * @method
     * @public
     */
    closePath (): void
    {
        // TODO: WebGPU版のパスクローズ実装
    }

    /**
     * @description パスを塗りつぶし
     *              Fill path
     *
     * @return {void}
     * @method
     * @public
     */
    fill (): void
    {
        // TODO: WebGPU版の塗りつぶし実装
    }

    /**
     * @description パスをストローク
     *              Stroke path
     *
     * @return {void}
     * @method
     * @public
     */
    stroke (): void
    {
        // TODO: WebGPU版のストローク実装
    }
}