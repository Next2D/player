import { Point } from "./Point";
import { execute as matrixCloneService } from "../src/Matrix/service/MatrixCloneService";
import { execute as matirxConcatService } from "../src/Matrix/service/MatirxConcatService";
import { execute as matrixCopyFromService } from "../src/Matrix/service/MatrixCopyFromService";
import { execute as matrixCreateBoxService } from "../src/Matrix/service/MatrixCreateBoxService";
import { execute as matrixCreateGradientBoxService } from "../src/Matrix/service/MatrixCreateGradientBoxService";
import { execute as matrixDeltaTransformPointService } from "../src/Matrix/service/MatrixDeltaTransformPointService";
import { execute as matrixIdentityService } from "../src/Matrix/service/MatrixIdentityService";
import { execute as matrixInvertService } from "../src/Matrix/service/MatrixInvertService";
import { execute as matrixRotateService } from "../src/Matrix/service/MatrixRotateService";
import { execute as matrixScaleService } from "../src/Matrix/service/MatrixScaleService";
import { execute as matrixSetToService } from "../src/Matrix/service/MatrixSetToService";
import { execute as matrixTransformPointService } from "../src/Matrix/service/MatrixTransformPointService";
import { execute as matrixTranslateService } from "../src/Matrix/service/MatrixTranslateService";
import {
    $getFloat32Array6,
    $poolFloat32Array6
} from "./GeomUtil";

/**
 * @description Matrix クラスは、2 つの座標空間の間におけるポイントのマッピング方法を決定する変換マトリックスを表します。
 *              Matrix オブジェクトのプロパティを設定し、Matrix オブジェクトを Transform オブジェクトの matrix プロパティに適用し、
 *              次に Transform オブジェクトを表示オブジェクトの transform プロパティとして適用することで、表示オブジェクトに対する各種グラフィック変換を実行できます。
 *              これらの変換機能には、平行移動（x と y の位置変更）、回転、拡大 / 縮小、傾斜などが含まれます。
 *
 *              The Matrix class represents a transformation matrix that determines how to map points from one coordinate space to another.
 *              You can perform various graphical transformations on a display object by setting the properties of a Matrix object,
 *              applying that Matrix object to the matrix property of a Transform object,
 *              and then applying that Transform object as the transform property of the display object.
 *              These transformation functions include translation (x and y repositioning), rotation, scaling, and skewing.
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
        this._$matrix = $getFloat32Array6(a, b, c, d, tx, ty);
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
        this._$matrix[0] = a;
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
        this._$matrix[1] = b;
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
        this._$matrix[2] = c;
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
        this._$matrix[3] = d;
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
        this._$matrix[4] = tx;
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
        this._$matrix[5] = ty;
    }

    /**
     * @description Matrixの内部Float32Arrayデータを返却
     *              Returns the internal Float32Array data of Matrix
     *
     * @member {Float32Array}
     * @readonly
     * @public
     */
    get rawData (): Float32Array
    {
        return this._$matrix;
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
        return matrixCloneService(this);
    }

    /**
     * @description マトリックスを現在のマトリックスと連結して、
     *              2 つのマトリックスの図形効果を効果的に組み合わせます。
     *              Concatenates a matrix with the current matrix,
     *              effectively combining the geometric effects of the two.
     *
     * @param  {Matrix} matrix
     * @return {void}
     * @method
     * @public
     */
    concat (matrix: Matrix): void
    {
        matirxConcatService(this, matrix);
    }

    /**
     * @description すべてのマトリックスデータを、ソース Matrix オブジェクトから、
     *              呼び出し元の Matrix オブジェクトにコピーします。
     *
     * @param  {Matrix} matrix
     * @return {void}
     * @method
     * @public
     */
    copyFrom (matrix: Matrix): void
    {
        matrixCopyFromService(this, matrix);
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
        matrixCreateBoxService(this, scale_x, scale_y, rotation, tx, ty);
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
        matrixCreateGradientBoxService(this, width, height, rotation, tx, ty);
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
        return matrixDeltaTransformPointService(this, point);
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
        matrixIdentityService(this);
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
        matrixInvertService(this);
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
        matrixRotateService(this, rotation);
    }

    /**
     * @description 行列に拡大 / 縮小の変換を適用します。
     *              Applies a scaling transformation to the matrix.
     *
     * @param  {number} scale_x
     * @param  {number} scale_y
     * @return {void}
     * @method
     * @public
     */
    scale (scale_x: number, scale_y: number): void
    {
        matrixScaleService(this, scale_x, scale_y);
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
        matrixSetToService(this, a, b, c, d, tx, ty);
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
        return matrixTransformPointService(this, point);
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
        matrixTranslateService(this, dx, dy);
    }

    /**
     * @description 指定された配列の値を乗算します
     *              Multiplies the value of the specified array.
     *
     * @param  {Float32Array} a
     * @param  {Float32Array} b
     * @return {Float32Array}
     * @method
     * @private
     */
    static multiply (a: Float32Array, b: Float32Array): Float32Array
    {
        return $getFloat32Array6(
            a[0] * b[0] + a[2] * b[1],
            a[1] * b[0] + a[3] * b[1],
            a[0] * b[2] + a[2] * b[3],
            a[1] * b[2] + a[3] * b[3],
            a[0] * b[4] + a[2] * b[5] + a[4],
            a[1] * b[4] + a[3] * b[5] + a[5]
        );
    }

    /**
     * @description 利用したFloat32Arrayを再利用する為にプールします。
     *              Pool the Float32Array used for reuse.
     *
     * @param {Float32Array} buffer
     * @method
     * @private
     */
    static release (buffer: Float32Array): void
    {
        $poolFloat32Array6(buffer);
    }
}