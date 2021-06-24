/**
 * @class
 * @memberOf next2d.geom
 */
class Matrix
{
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
     * @param   {number} [a=1]
     * @param   {number} [b=0]
     * @param   {number} [c=0]
     * @param   {number} [d=1]
     * @param   {number} [tx=0]
     * @param   {number} [ty=0]
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
     * @constructor
     * @public
     */
    constructor(a = 1, b = 0, c = 0, d = 1, tx = 0, ty = 0)
    {
        /**
         * @type {Float32Array}
         * @private
         */
        this._$matrix = Util.$getFloat32Array6(a, b, c, d, tx, ty);
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
    static toString ()
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
    static get namespace ()
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
    toString ()
    {
        return `(a=${this.a}, b=${this.b}, c=${this.c}, d=${this.d}, tx=${this.tx}, ty=${this.ty})`;
    };

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @member  {string}
     * @default next2d.geom.Matrix
     * @public
     * @const
     */
    get namespace ()
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
    get a ()
    {
        return this._$matrix[0];
    }
    set a (a)
    {
        this._$matrix[0] = +a;
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
    get b ()
    {
        return this._$matrix[1];
    }
    set b (b)
    {
        this._$matrix[1] = +b;
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
    get c ()
    {
        return this._$matrix[2];
    }
    set c (c)
    {
        this._$matrix[2] = +c;
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
    get d ()
    {
        return this._$matrix[3];
    }
    set d (d)
    {
        this._$matrix[3] = +d;
    }

    /**
     * @description x 軸方向に各ポイントを平行移動する距離です。
     *              The distance by which to translate each point along the x axis.
     *
     * @member {number}
     * @default 0
     * @public
     */
    get tx ()
    {
        return this._$matrix[4];
    }
    set tx (tx)
    {
        this._$matrix[4] = +tx;
    }

    /**
     * @description y 軸方向に各ポイントを平行移動する距離です。
     *              The distance by which to translate each point along the y axis.
     *
     * @member {number}
     * @default 0
     * @public
     */
    get ty ()
    {
        return this._$matrix[5];
    }
    set ty (ty)
    {
        this._$matrix[5] = +ty;
    }

    /**
     * @return {Matrix}
     * @method
     * @private
     */
    _$clone ()
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
    clone ()
    {
        return Util.$getMatrix(
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
    concat (m)
    {
        const matrix = this._$matrix;
        const target = m._$matrix;

        let a =  matrix[0] * target[0];
        let b =  0.0;
        let c =  0.0;
        let d =  matrix[3] * target[3];
        let tx = matrix[4] * target[0] + target[4];
        let ty = matrix[5] * target[3] + target[5];

        switch (true) {

            case (matrix[1] !== 0):
            case (matrix[2] !== 0):
            case (target[1] !== 0):
            case (target[2] !== 0):

                a  += (matrix[1] * target[2]);
                d  += (matrix[2] * target[1]);
                b  += (matrix[0] * target[1] + matrix[1] * target[3]);
                c  += (matrix[2] * target[0] + matrix[3] * target[2]);
                tx += (matrix[5] * target[2]);
                ty += (matrix[4] * target[1]);

                break;

            default:
                break;

        }

        this._$matrix[0] = a;
        this._$matrix[1] = b;
        this._$matrix[2] = c;
        this._$matrix[3] = d;
        this._$matrix[4] = tx;
        this._$matrix[5] = ty;
    }

    /**
     * @description すべてのマトリックスデータを、ソース Matrix オブジェクトから、
     *              呼び出し元の Matrix オブジェクトにコピーします。
     *
     * @param  {Matrix} source_matrix
     * @method
     * @return {void}
     */
    copyFrom (source_matrix)
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
    createBox (scale_x, scale_y, rotation = 0, tx = 0, ty = 0)
    {
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
    createGradientBox (width, height, rotation = 0, tx = 0, ty = 0)
    {
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
    deltaTransformPoint (point)
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
    identity ()
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
    invert ()
    {
        let a  = this._$matrix[0];
        let b  = this._$matrix[1];
        let c  = this._$matrix[2];
        let d  = this._$matrix[3];
        let tx = this._$matrix[4];
        let ty = this._$matrix[5];

        if (b === 0 && c === 0) {

            this.a  = 1 / a;
            this.b  = 0;
            this.c  = 0;
            this.d  = 1 / d;
            this.tx = -this.a * tx;
            this.ty = -this.d * ty;

        } else {

            const det = a * d - b * c;

            if (det === 0) {

                this.identity();

            } else {

                const rdet = 1 / det;

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
    rotate (rotation)
    {
        const a  = this._$matrix[0];
        const b  = this._$matrix[1];
        const c  = this._$matrix[2];
        const d  = this._$matrix[3];
        const tx = this._$matrix[4];
        const ty = this._$matrix[5];

        this._$matrix[0] = a  * Util.$cos(rotation) - b  * Util.$sin(rotation);
        this._$matrix[1] = a  * Util.$sin(rotation) + b  * Util.$cos(rotation);
        this._$matrix[2] = c  * Util.$cos(rotation) - d  * Util.$sin(rotation);
        this._$matrix[3] = c  * Util.$sin(rotation) + d  * Util.$cos(rotation);
        this._$matrix[4] = tx * Util.$cos(rotation) - ty * Util.$sin(rotation);
        this._$matrix[5] = tx * Util.$sin(rotation) + ty * Util.$cos(rotation);
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
    scale (sx, sy)
    {
        this._$matrix[0] *= sx;
        this._$matrix[2] *= sx;
        this._$matrix[4] *= sx;

        this._$matrix[1] *= sy;
        this._$matrix[3] *= sy;
        this._$matrix[5] *= sy;
    }

    /**
     * @description Matrix のメンバーを指定の値に設定します。
     *              Sets the members of Matrix to the specified values
     *
     * @param  {number} aa
     * @param  {number} ba
     * @param  {number} ca
     * @param  {number} da
     * @param  {number} txa
     * @param  {number} tya
     * @return {void}
     * @method
     * @public
     */
    setTo (aa, ba, ca, da, txa, tya)
    {
        this.a  = aa;
        this.b  = ba;
        this.c  = ca;
        this.d  = da;
        this.tx = txa;
        this.ty = tya;
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
    transformPoint (point)
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
    translate (dx, dy)
    {
        this.tx += dx;
        this.ty += dy;
    }
}