/**
 * @description Point オブジェクトは 2 次元の座標系の位置を表します。
 *              x は水平方向の軸を表し、y は垂直方向の軸を表します。
 *              The Point object represents a location in a two-dimensional coordinate system,
 *              where x represents the horizontal axis and y represents the vertical axis.
 *
 * @class
 * @memberOf next2d.geom
 */
export class Point
{
    private _$x: number;
    private _$y: number;

    /**
     * @param {number} [x = 0]
     * @param {number} [y = 0]
     * @constructor
     * @public
     */
    constructor (x: number = 0, y: number = 0)
    {
        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$x = x;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$y = y;
    }

    /**
     * 指定されたクラスのストリングを返します。
     * Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default "[class Point]"
     * @method
     * @static
     */
    static toString (): string
    {
        return "[class Point]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @member  {string}
     * @default "next2d.geom.Point"
     * @const
     * @static
     */
    static get namespace (): string
    {
        return "next2d.geom.Point";
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
        return `(x=${this._$x}, y=${this._$y})`;
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @member  {string}
     * @default next2d.geom.Point
     * @const
     * @public
     */
    get namespace (): string
    {
        return "next2d.geom.Point";
    }

    /**
     * @description (0,0) からこのポイントまでの線のセグメントの長さです。
     *              The length of the line segment from (0,0) to this point.
     *
     * @member  {number}
     * @default 0
     * @readonly
     * @public
     */
    get length (): number
    {
        return Math.sqrt(Math.pow(this._$x, 2) + Math.pow(this._$y, 2));
    }

    /**
     * @description ポイントの水平座標です。
     *              The horizontal coordinate of the point.
     *
     * @member  {number}
     * @default 0
     * @public
     */
    get x (): number
    {
        return this._$x;
    }
    set x (x: number)
    {
        this._$x = x;
    }

    /**
     * @description ポイントの垂直座標です。
     *              The vertical coordinate of the point.
     *
     * @member  {number}
     * @default 0
     * @public
     */
    get y (): number
    {
        return this._$y;
    }
    set y (y: number)
    {
        this._$y = y;
    }

    /**
     * @description このポイントの座標に他のポイントの座標を加算して、新しいポイントを作成します。
     *              Adds the coordinates of another point
     *              to the coordinates of this point to create a new point.
     *
     * @param   {Point} point
     * @returns {Point}
     * @method
     * @public
     */
    add (point: Point): Point
    {
        return new Point(this._$x + point.x, this._$y + point.y);
    }

    /**
     * @description この Point オブジェクトのコピーを作成します。
     *              Creates a copy of this Point object.
     *
     * @returns {Point}
     * @method
     * @public
     */
    clone (): Point
    {
        return new Point(this._$x, this._$y);
    }

    /**
     * @description すべてのポイントデータを、ソース Point オブジェクトから、
     *              呼び出し元の Point オブジェクトにコピーします。
     *              Copies all of the point data from
     *              the source Point object into the calling Point object.
     *
     * @param   {Point} point
     * @returns void
     * @public
     */
    copyFrom (point: Point): void
    {
        this._$x = point.x;
        this._$y = point.y;
    }

    /**
     * @description point1 と point2 との距離を返します。
     *              Returns the distance between point1 and point2.
     *
     * @param  {Point} point1
     * @param  {Point} point2
     * @return {number}
     * @method
     * @static
     */
    static distance (point1: Point, point2: Point): number
    {
        return Math.sqrt(
            Math.pow(point1._$x - point2._$x, 2)
            + Math.pow(point1._$y - point2._$y, 2)
        );
    }

    /**
     * @description 2 つのポイントが等しいかどうかを判別します。
     *              Determines whether two points are equal.
     *
     * @param  {Point} to_compare
     * @return {boolean}
     * @method
     * @public
     */
    equals (to_compare: Point): boolean
    {
        return this._$x === to_compare._$x && this._$y === to_compare._$y;
    }

    /**
     * @description 2 つの指定されたポイント間にあるポイントを判別します。
     *              Determines a point between two specified points.
     *
     * @param  {Point}  point1
     * @param  {Point}  point2
     * @param  {number} f
     * @return {Point}
     * @static
     */
    static interpolate (point1: Point, point2: Point, f: number): Point
    {
        return new Point(
            point1.x + (point2.x - point1.x) * (1 - f),
            point1.y + (point2.y - point1.y) * (1 - f)
        );
    }

    /**
     * @description (0,0) と現在のポイント間の線のセグメントを設定された長さに拡大 / 縮小します。
     *              Scales the line segment between (0,0) and the current point to a set length.
     *
     * @param  {number} thickness
     * @return {void}
     * @method
     * @public
     */
    normalize (thickness: number): void
    {
        const length = this.length;
        this._$x = this._$x * thickness / length;
        this._$y = this._$y * thickness / length;
    }

    /**
     * @description Point オブジェクトを指定された量だけオフセットします。
     *              Offsets the Point object by the specified amount.
     *
     * @param  {number} dx
     * @param  {number} dy
     * @return {Point}
     * @method
     * @public
     */
    offset (dx: number, dy: number): void
    {
        this._$x += dx;
        this._$y += dy;
    }

    /**
     * @description 極座標ペアを直交点座標に変換します。
     *              Converts a pair of polar coordinates to a Cartesian point coordinate.
     *
     * @param  {number} length
     * @param  {number} angle
     * @return {Point}
     * @method
     * @static
     */
    static polar (length: number, angle: number): Point
    {
        return new Point(length * Math.cos(angle), length * Math.sin(angle));
    }

    /**
     * @description Point のメンバーを指定の値に設定します。
     *              Sets the members of Point to the specified values
     *
     * @param  {number} x
     * @param  {number} y
     * @return {void}
     * @method
     * @public
     */
    setTo (x: number, y: number): void
    {
        this._$x = x;
        this._$y = y;
    }

    /**
     * @description このポイントの座標から他のポイントの座標を減算して、新しいポイントを作成します。
     *              Subtracts the coordinates of another point
     *              from the coordinates of this point to create a new point.
     *
     * @param  {Point} point
     * @return {Point}
     * @method
     * @public
     */
    subtract (point: Point): Point
    {
        return new Point(this._$x - point.x, this._$y - point.y);
    }
}
