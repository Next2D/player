import { execute as beginPath } from "./PathCommand/service/PathCommandBeginPathService"
import {
    $setRenderSize,
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
     * @private
     */
    private readonly _$stack: Float32Array[];

    /**
     * @description 2D変換行列
     *              2D transformation matrix
     * 
     * @type {Float32Array}
     * @private
     */
    private readonly _$matrix: Float32Array;

    /**
     * @param {WebGL2RenderingContext} gl
     * @param {number} samples
     * @constructor
     * @public
     */
    constructor (gl: WebGL2RenderingContext, samples: number) 
    {
        $setWebGL2RenderingContext(gl);
        $setRenderSize(gl.getParameter(gl.MAX_TEXTURE_SIZE));
        $setSamples(samples);

        this._$stack  = $getArray();
        this._$matrix = $getFloat32Array9(1, 0, 0, 0, 1, 0, 0, 0, 1);
    }

    bind (): void
    {
        // todo
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
        this._$stack.push($getFloat32Array9(
            this._$matrix[0], this._$matrix[1], this._$matrix[2],
            this._$matrix[3], this._$matrix[4], this._$matrix[5],
            this._$matrix[6], this._$matrix[7], this._$matrix[8]
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
        if (!this._$stack.length) {
            return ;
        }

        const matrix = this._$stack.pop() as Float32Array;
        this._$matrix[0] = matrix[0];
        this._$matrix[1] = matrix[1];
        this._$matrix[3] = matrix[3];
        this._$matrix[4] = matrix[4];
        this._$matrix[6] = matrix[6];
        this._$matrix[7] = matrix[7];

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
        this._$matrix[0] = a;
        this._$matrix[1] = b;
        this._$matrix[3] = c;
        this._$matrix[4] = d;
        this._$matrix[6] = e;
        this._$matrix[7] = f;
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