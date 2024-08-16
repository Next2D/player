import type { IAttachmentObject } from "./interface/IAttachmentObject";
import { execute as beginPath } from "./PathCommand/service/PathCommandBeginPathService"
import { execute as contextUpdateBackgroundColorService } from "./Context/service/ContextUpdateBackgroundColorService";
import { execute as contextResizeUseCase } from "./Context/usecase/ContextResizeUseCase";
import { execute as contextClearRectService } from "./Context/service/ContextClearRectService";
import { execute as contextBindUseCase } from "./Context/usecase/ContextBindUseCase";
import {
    $setReadFrameBuffer,
    $setDrawFrameBuffer
} from "./FrameBufferManager";
import {
    $setRenderMaxSize,
    $setWebGL2RenderingContext,
    $setSamples,
    $getFloat32Array9,
    $poolFloat32Array9,
    $getArray
} from "./WebGLUtil";

/**
 * @description WebGL版、Next2Dのコンテキスト
 *              WebGL version, Next2D context
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
    public $mainAttachment: IAttachmentObject | null;

    /**
     * @param {WebGL2RenderingContext} gl
     * @param {number} samples
     * @constructor
     * @public
     */
    constructor (gl: WebGL2RenderingContext, samples: number) 
    {
        $setWebGL2RenderingContext(gl);
        $setRenderMaxSize(gl.getParameter(gl.MAX_TEXTURE_SIZE));
        $setSamples(samples);

        this.$stack  = $getArray();
        this.$matrix = $getFloat32Array9(1, 0, 0, 0, 1, 0, 0, 0, 1);

        this.$clearColorR = 0;
        this.$clearColorG = 0;
        this.$clearColorB = 0;
        this.$clearColorA = 0;

        this.$mainAttachment = null;

        // カラー設定
        gl.clearColor(0, 0, 0, 0);

        // WebTextureの設定
        gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

        // FrameBufferManagerの初期起動
        $setReadFrameBuffer(gl);
        $setDrawFrameBuffer(gl);
    }

    /**
     * @description 背景色を更新
     *              Update background color
     * 
     * @param  {number} red 
     * @param  {number} green 
     * @param  {number} blue 
     * @param  {number} alpha 
     * @return {void}
     * @method
     * @public
     */
    updateBackgroundColor (red: number, green: number, blue: number, alpha: number): void
    {
        contextUpdateBackgroundColorService(this, red, green, blue, alpha);
    }

    /**
     * @description メインcanvasのサイズを変更
     *              Change the size of the main canvas
     *
     * @param  {number} width
     * @param  {number} height
     * @return {void}
     * @method
     * @public
     */
    resize (width: number, height: number): void
    {
        contextResizeUseCase(this, width, height);
    }

    /**
     * @description 指定範囲をクリアする
     *              Clear the specified range
     * 
     * @param  {number} x 
     * @param  {number} y 
     * @param  {number} w 
     * @param  {number} h 
     * @return {void}
     * @method
     * @purotected
     */
    clearRect (x: number, y: number, w: number, h: number): void
    {
        contextClearRectService(x, y, w, h);
    }

    /**
     * @description アタッチメントオブジェクトをバインド
     *              Bind the attachment object
     * 
     * @param {IAttachmentObject} attachment_object
     * @return {void}
     * @method
     * @public
     */
    bind (attachment_object: IAttachmentObject): void
    {
        contextBindUseCase(this, attachment_object);
    }

    /**
     * @description 現在の2D変換行列を保存
     *             Save the current 2D transformation matrix
     * 
     * @return {void}
     * @method
     * @public
     */
    save (): void
    {
        this.$stack.push($getFloat32Array9(
            this.$matrix[0], this.$matrix[1], this.$matrix[2],
            this.$matrix[3], this.$matrix[4], this.$matrix[5],
            this.$matrix[6], this.$matrix[7], this.$matrix[8]
        ));

        // todo mask
    }

    /**
     * @description 2D変換行列を復元
     *              Restore 2D transformation matrix
     *
     * @return {void}
     * @method
     * @public
     */
    restore (): void
    {
        if (!this.$stack.length) {
            return ;
        }

        const matrix = this.$stack.pop() as Float32Array;
        this.$matrix[0] = matrix[0];
        this.$matrix[1] = matrix[1];
        this.$matrix[3] = matrix[3];
        this.$matrix[4] = matrix[4];
        this.$matrix[6] = matrix[6];
        this.$matrix[7] = matrix[7];

        $poolFloat32Array9(matrix);

        // todo mask
    }

    /**
     * @description 2D変換行列を設定
     *              Set 2D transformation matrix
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
        this.$matrix[3] = c;
        this.$matrix[4] = d;
        this.$matrix[6] = e;
        this.$matrix[7] = f;
    }

    /**
     * @description 現在の2D変換行列に対して乗算を行います。
     *              Multiply the current 2D transformation matrix.
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

        const a00: number = this.$matrix[0];
        const a01: number = this.$matrix[1];
        const a10: number = this.$matrix[3];
        const a11: number = this.$matrix[4];
        const a20: number = this.$matrix[6];
        const a21: number = this.$matrix[7];

        this.$matrix[0] = a * a00 + b * a10;
        this.$matrix[1] = a * a01 + b * a11;
        this.$matrix[3] = c * a00 + d * a10;
        this.$matrix[4] = c * a01 + d * a11;
        this.$matrix[6] = e * a00 + f * a10 + a20;
        this.$matrix[7] = e * a01 + f * a11 + a21;
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
        beginPath();
    }
}