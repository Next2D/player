import { Point } from "./Point";
import { $getMatrix } from "../../util/Util";
import {
    $getFloat32Array6,
    $clamp,
    $Math,
    $SHORT_INT_MIN,
    $SHORT_INT_MAX
} from "../../util/RenderUtil";

/**
 * Matrix クラスは、2 つの座標空間の間におけるポイントのマッピング方法を決定する変換マトリックスを表します。
 * Matrix オブジェクトのプロパティを設定し、Matrix オブジェクトを Transform オブジェクトの matrix プロパティに適用し、
 * 次に Transform オブジェクトを表示オブジェクトの transform プロパティとして適用することで、表示オブジェクトに対する各種グラフィック変換を実行できます。
 * これらの変換機能には、平行移動（x と y の位置変更）、回転、拡大 / 縮小、傾斜などが含まれます。
 *
 * The Matrix class represents a transformation matrix that determines how to map points from one coordinate space to another.
 * You can perform various graphical transformations on a display object by setting the properties of a Matrix object,
 * applying that Matrix object to the matrix property of a Transform object,
 * and then applying that Transform object as the transform property of the display object.
 * These transformation functions include translation (x and y repositioning), rotation, scaling, and skewing.
 *
 * @example <caption>Example usage of Matrix.</caption>
 * // new Matrix
 * const {Matrix} = next2d.geom;
 * const matrix   = new Matrix();
 * // set new Matrix
 * const {MovieClip} = next2d.display;
 * const movieClip   = new MovieClip();
 * movieClip.transform.matrix = matrix;
 *
 * @class
 * @memberOf next2d.geom
 */
export class Matrix
{
    public readonly _$matrix: Float32Array;

    /**
     * @param   {number} [a=1]
     * @param   {number} [b=0]
     * @param   {number} [c=0]
     * @param   {number} [d=1]
     * @param   {number} [tx=0]
     * @param   {number} [ty=0]
     *
     * @constructor
     * @public
     */
    constructor (
        a: number = 1, b: number = 0,
        c: number = 0, d: number = 1,
        tx: number = 0, ty: number = 0
    ) {
        /**
         * @type {Float32Array}
         * @private
         */
        this._$matrix = $getFloat32Array6(1, 0, 0, 1, 0, 0);

        // setup
        this.a  = a;
        this.b  = b;
        this.c  = c;
        this.d  = d;
        this.tx = tx;
        this.ty = ty;
    }

    /**
     * 指定されたクラスのストリングを返します。
     * Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default [class Matrix]
     * @method
     * @static
     */
    static toString (): string
    {
        return "[class Matrix]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @member  {string}
     * @default next2d.geom.Matrix
     * @const
     * @static
     */
    static get namespace (): string
    {
        return "next2d.geom.Matrix";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return {string}
     * @method
     * @public
     */
    toString (): string
    {
        return `(a=${this.a}, b=${this.b}, c=${this.c}, d=${this.d}, tx=${this.tx}, ty=${this.ty})`;
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @member  {string}
     * @default next2d.geom.Matrix
     * @const
     * @public
     */
    get namespace (): string
    {
        return "next2d.geom.Matrix";
    }

    /**
     * @description イメージを拡大 / 縮小または回転するときに x 軸方向のピクセルの配置に影響を与える値です。
     *              The value that affects the positioning
     *              of pixels along the x axis when scaling or rotating an image.
     *
     * @member {number}
     * @default 1
     * @public
     */
    get a (): number
    {
        return this._$matrix[0];
    }
    set a (a: number)
    {
        this._$matrix[0] = $clamp(+a, $SHORT_INT_MIN, $SHORT_INT_MAX, 0);
    }

    /**
     * @description イメージを回転または傾斜させるときに y 軸方向のピクセルの配置に影響を与える値です。
     *              The value that affects the positioning
     *              of pixels along the y axis when rotating or skewing an image.
     *
     * @member {number}
     * @default 0
     * @public
     */
    get b (): number
    {
        return this._$matrix[1];
    }
    set b (b: number)
    {
        this._$matrix[1] = $clamp(+b, $SHORT_INT_MIN, $SHORT_INT_MAX, 0);
    }

    /**
     * @description イメージを回転または傾斜させるときに x 軸方向のピクセルの配置に影響を与える値です。
     *              The value that affects the positioning
     *              of pixels along the x axis when rotating or skewing an image.
     *
     * @member {number}
     * @default 0
     * @public
     */
    get c (): number
    {
        return this._$matrix[2];
    }
    set c (c: number)
    {
        this._$matrix[2] = $clamp(+c, $SHORT_INT_MIN, $SHORT_INT_MAX, 0);
    }

    /**
     * @description イメージを拡大 / 縮小または回転するときに y 軸方向のピクセルの配置に影響を与える値です。
     *              The value that affects the positioning
     *              of pixels along the y axis when scaling or rotating an image.
     *
     * @member {number}
     * @default 1
     * @public
     */
    get d (): number
    {
        return this._$matrix[3];
    }
    set d (d: number)
    {
        this._$matrix[3] = $clamp(+d, $SHORT_INT_MIN, $SHORT_INT_MAX, 0);
    }

    /**
     * @description x 軸方向に各ポイントを平行移動する距離です。
     *              The distance by which to translate each point along the x axis.
     *
     * @member {number}
     * @default 0
     * @public
     */
    get tx (): number
    {
        return this._$matrix[4];
    }
    set tx (tx: number)
    {
        this._$matrix[4] = $clamp(+tx, $SHORT_INT_MIN, $SHORT_INT_MAX, 0);
    }

    /**
     * @description y 軸方向に各ポイントを平行移動する距離です。
     *              The distance by which to translate each point along the y axis.
     *
     * @member {number}
     * @default 0
     * @public
     */
    get ty (): number
    {
        return this._$matrix[5];
    }
    set ty (ty: number)
    {
        this._$matrix[5] = $clamp(+ty, $SHORT_INT_MIN, $SHORT_INT_MAX, 0);
    }

    /**
     * @return {Matrix}
     * @method
     * @private
     */
    _$clone (): Matrix
    {
        return this.clone();
    }

    /**
     * @description 新しい Matrix オブジェクトとして、このマトリックスのクローンを返します。
     *              含まれるオブジェクトはまったく同じコピーになります。
     *              Returns a new Matrix object that is a clone of this matrix,
     *              with an exact copy of the contained object.
     *
     * @return {Matrix}
     * @method
     * @public
     */
    clone (): Matrix
    {
        return $getMatrix(
            this._$matrix[0], this._$matrix[1],
            this._$matrix[2], this._$matrix[3],
            this._$matrix[4], this._$matrix[5]
        );
    }

    /**
     * @description マトリックスを現在のマトリックスと連結して、
     *              2 つのマトリックスの図形効果を効果的に組み合わせます。
     *              Concatenates a matrix with the current matrix,
     *              effectively combining the geometric effects of the two.
     *
     * @param  {Matrix} m
     * @return {void}
     * @method
     * @public
     */
    concat (m: Matrix): void
    {
        const matrix = this._$matrix;
        const target = m._$matrix;

        let a =  matrix[0] * target[0];
        let b =  0.0;
        let c =  0.0;
        let d =  matrix[3] * target[3];
        let tx = matrix[4] * target[0] + target[4];
        let ty = matrix[5] * target[3] + target[5];

        if (matrix[1] || matrix[2] || target[1] || target[2]) {
            a  += matrix[1] * target[2];
            d  += matrix[2] * target[1];
            b  += matrix[0] * target[1] + matrix[1] * target[3];
            c  += matrix[2] * target[0] + matrix[3] * target[2];
            tx += matrix[5] * target[2];
            ty += matrix[4] * target[1];
        }

        this.a  = a;
        this.b  = b;
        this.c  = c;
        this.d  = d;
        this.tx = tx;
        this.ty = ty;
    }

    /**
     * @description すべてのマトリックスデータを、ソース Matrix オブジェクトから、
     *              呼び出し元の Matrix オブジェクトにコピーします。
     *
     * @param  {Matrix} source_matrix
     * @method
     * @return {void}
     */
    copyFrom (source_matrix: Matrix): void
    {
        this.a  = source_matrix.a;
        this.b  = source_matrix.b;
        this.c  = source_matrix.c;
        this.d  = source_matrix.d;
        this.tx = source_matrix.tx;
        this.ty = source_matrix.ty;
    }

    /**
     * @description 拡大 / 縮小、回転、平行移動に関するパラメーターなどがあります。
     *              Includes parameters for scaling, rotation, and translation.
     *
     * @param  {number} scale_x
     * @param  {number} scale_y
     * @param  {number} [rotation=0]
     * @param  {number} [tx=0]
     * @param  {number} [ty=0]
     * @return {void}
     * @method
     * @public
     */
    createBox (
        scale_x: number, scale_y: number,
        rotation: number = 0,
        tx: number = 0, ty: number = 0
    ): void {
        this.identity();
        this.rotate(rotation);
        this.scale(scale_x, scale_y);
        this.translate(tx, ty);
    }

    /**
     * @description Graphics クラスの beginGradientFill() メソッドで使用する特定のスタイルを作成します。
     *              Creates the specific style of matrix expected
     *              by the beginGradientFill() and lineGradientStyle() methods of the Graphics class.
     *
     * @param  {number} width
     * @param  {number} height
     * @param  {number} [rotation=0]
     * @param  {number} [tx=0]
     * @param  {number} [ty=0]
     * @return {void}
     * @method
     * @public
     */
    createGradientBox (
        width: number, height: number,
        rotation: number = 0,
        tx: number = 0, ty: number = 0
    ): void {
        this.createBox(width / 1638.4, height / 1638.4, rotation, tx + width / 2, ty + height / 2);
    }

    /**
     * @description 変換前の座標空間内のポイントが指定されると、そのポイントの変換後の座標を返します。
     *              Given a point in the pretransform coordinate space,
     *              returns the coordinates of that point after the transformation occurs.
     *
     * @param  {Point} point
     * @return {Point}
     * @method
     * @public
     */
    deltaTransformPoint (point: Point): Point
    {
        return new Point(
            point.x * this._$matrix[0] + point.y * this._$matrix[2],
            point.x * this._$matrix[1] + point.y * this._$matrix[3]
        );
    }

    /**
     * @description 各行列プロパティを null 変換になる値に設定します。
     *              Sets each matrix property to a value that causes a null transformation.
     *
     * @return {void}
     * @method
     * @public
     */
    identity (): void
    {
        this._$matrix[0] = 1;
        this._$matrix[1] = 0;
        this._$matrix[2] = 0;
        this._$matrix[3] = 1;
        this._$matrix[4] = 0;
        this._$matrix[5] = 0;
    }

    /**
     * @description 元のマトリックスの逆の変換を実行します。
     *              Performs the opposite transformation of the original matrix.
     *
     * @return {void}
     * @method
     * @public
     */
    invert (): void
    {
        const a: number  = this._$matrix[0];
        const b: number  = this._$matrix[1];
        const c: number  = this._$matrix[2];
        const d: number  = this._$matrix[3];
        const tx: number = this._$matrix[4];
        const ty: number = this._$matrix[5];

        if (b === 0 && c === 0) {

            this.a  = 1 / a;
            this.b  = 0;
            this.c  = 0;
            this.d  = 1 / d;
            this.tx = -this.a * tx;
            this.ty = -this.d * ty;

        } else {

            const det = a * d - b * c;

            if (det) {

                const rdet: number = 1 / det;

                this.a  = d  * rdet;
                this.b  = -b * rdet;
                this.c  = -c * rdet;
                this.d  = a  * rdet;
                this.tx = -(this.a * tx + this.c * ty);
                this.ty = -(this.b * tx + this.d * ty);

            }

        }
    }

    /**
     * @description Matrix オブジェクトに回転変換を適用します。
     *              Applies a rotation transformation to the Matrix object.
     *
     * @param  {number} rotation
     * @return {void}
     * @method
     * @public
     */
    rotate (rotation: number): void
    {
        const a  = this._$matrix[0];
        const b  = this._$matrix[1];
        const c  = this._$matrix[2];
        const d  = this._$matrix[3];
        const tx = this._$matrix[4];
        const ty = this._$matrix[5];

        this.a  = a  * $Math.cos(rotation) - b  * $Math.sin(rotation);
        this.b  = a  * $Math.sin(rotation) + b  * $Math.cos(rotation);
        this.c  = c  * $Math.cos(rotation) - d  * $Math.sin(rotation);
        this.d  = c  * $Math.sin(rotation) + d  * $Math.cos(rotation);
        this.tx = tx * $Math.cos(rotation) - ty * $Math.sin(rotation);
        this.ty = tx * $Math.sin(rotation) + ty * $Math.cos(rotation);
    }

    /**
     * @description 行列に拡大 / 縮小の変換を適用します。
     *              Applies a scaling transformation to the matrix.
     *
     * @param  {number} sx
     * @param  {number} sy
     * @return {void}
     * @method
     * @public
     */
    scale (sx: number, sy: number): void
    {
        this.a  *= sx;
        this.c  *= sx;
        this.tx *= sx;

        this.b  *= sy;
        this.d  *= sy;
        this.ty *= sy;
    }

    /**
     * @description Matrix のメンバーを指定の値に設定します。
     *              Sets the members of Matrix to the specified values
     *
     * @param  {number} a
     * @param  {number} b
     * @param  {number} c
     * @param  {number} d
     * @param  {number} tx
     * @param  {number} ty
     * @return {void}
     * @method
     * @public
     */
    setTo (
        a: number, b: number,
        c: number, d: number,
        tx: number, ty: number
    ): void {
        this.a  = a;
        this.b  = b;
        this.c  = c;
        this.d  = d;
        this.tx = tx;
        this.ty = ty;
    }

    /**
     * @description Matrix オブジェクトで表現される図形変換を、指定されたポイントに適用した結果を返します。
     *              Returns the result of applying the geometric transformation represented
     *              by the Matrix object to the specified point.
     *
     * @param  {Point} point
     * @return {Point}
     * @method
     * @public
     */
    transformPoint (point: Point): Point
    {
        return new Point(
            point.x * this._$matrix[0] + point.y * this._$matrix[2] + this._$matrix[4],
            point.x * this._$matrix[1] + point.y * this._$matrix[3] + this._$matrix[5]
        );
    }

    /**
     * @description 行列を x 軸と y 軸に沿って、
     *              dx パラメーターと dy パラメーターで指定された量だけ平行移動します。
     *              Translates the matrix along the x and y axes,
     *              as specified by the dx and dy parameters.
     *
     * @param  {number} dx
     * @param  {number} dy
     * @return {void}
     * @method
     * @public
     */
    translate (dx: number, dy: number): void
    {
        this.tx += dx;
        this.ty += dy;
    }
}
