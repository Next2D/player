import {
    $Math,
    $clamp,
    $SHORT_INT_MIN,
    $SHORT_INT_MAX
} from "@next2d/share";

/**
 * Point オブジェクトは 2 次元の座標系の位置を表します。
 * x は水平方向の軸を表し、y は垂直方向の軸を表します。
 *
 * The Point object represents a location in a two-dimensional coordinate system,
 * where x represents the horizontal axis and y represents the vertical axis.
 *
 * @example <caption>Example usage of Point.</caption>
 * // new Point
 * const {Point} = next2d.geom;
 * const point   = new Point();
 *
 * @class
 * @memberOf next2d.geom
 */
export class Point
{
    private _$x: number;
    private _$y: number;

    /**
     * @param {number} [x=0]
     * @param {number} [y=0]
     *
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
        this._$x = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$y = 0;

        // setup
        this.x = x;
        this.y = y;
    }

    /**
     * 指定されたクラスのストリングを返します。
     * Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default [class Point]
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
     * @default next2d.geom.Point
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
        return `(x=${this.x}, y=${this.y})`;
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
        return $Math.sqrt($Math.pow(this.x, 2) + $Math.pow(this.y, 2));
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
        this._$x = $clamp(+x, $SHORT_INT_MIN, $SHORT_INT_MAX, 0);
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
        this._$y = $clamp(+y, $SHORT_INT_MIN, $SHORT_INT_MAX, 0);
    }

    /**
     * @description このポイントの座標に他のポイントの座標を加算して、新しいポイントを作成します。
     *              Adds the coordinates of another point
     *              to the coordinates of this point to create a new point.
     *
     * @param   {Point} v
     * @returns {Point}
     * @method
     * @public
     */
    add (v: Point): Point
    {
        return new Point(this.x + v.x, this.y + v.y);
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
        return new Point(this.x, this.y);
    }

    /**
     * @description すべてのポイントデータを、ソース Point オブジェクトから、
     *              呼び出し元の Point オブジェクトにコピーします。
     *              Copies all of the point data from
     *              the source Point object into the calling Point object.
     *
     * @param   {Point} source_point
     * @returns void
     * @public
     */
    copyFrom (source_point: Point): void
    {
        this._$x = source_point._$x;
        this._$y = source_point._$y;
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
        return $Math.sqrt(
            $Math.pow(point1._$x - point2._$x, 2)
            + $Math.pow(point1._$y - point2._$y, 2)
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
        this.x = this.x * thickness / length;
        this.y = this.y * thickness / length;
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
    offset (dx: number, dy: number)
    {
        this.x += dx;
        this.y += dy;
    }

    /**
     * @description 極座標ペアを直交点座標に変換します。
     *              Converts a pair of polar coordinates to a Cartesian point coordinate.
     *
     * @param  {number} len
     * @param  {number} angle
     * @return {Point}
     * @method
     * @static
     */
    static polar (len: number, angle: number): Point
    {
        return new Point(len * $Math.cos(angle), len * $Math.sin(angle));
    }

    /**
     * @description Point のメンバーを指定の値に設定します。
     *              Sets the members of Point to the specified values
     *
     * @param  {number} xa
     * @param  {number} ya
     * @return {void}
     * @method
     * @public
     */
    setTo (xa: number, ya: number): void
    {
        this.x = xa;
        this.y = ya;
    }

    /**
     * @description このポイントの座標から他のポイントの座標を減算して、新しいポイントを作成します。
     *              Subtracts the coordinates of another point
     *              from the coordinates of this point to create a new point.
     *
     * @param  {Point} v
     * @return {Point}
     * @method
     * @public
     */
    subtract (v: Point): Point
    {
        return new Point(this.x - v.x, this.y - v.y);
    }
}
