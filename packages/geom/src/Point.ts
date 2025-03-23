import { execute as pointAddService } from "./Point/service/PointAddService";
import { execute as pointCloneService } from "./Point/service/PointCloneService";
import { execute as pointCopyFromService } from "./Point/service/PointCopyFromService";
import { execute as pointDistanceService } from "./Point/service/PointDistanceService";
import { execute as pointEqualsService } from "./Point/service/PointEqualsService";
import { execute as pointInterpolateService } from "./Point/service/PointInterpolateService";
import { execute as pointNormalizeService } from "./Point/service/PointNormalizeService";
import { execute as pointOffsetService } from "./Point/service/PointOffsetService";
import { execute as pointPolarService } from "./Point/service/PointPolarService";
import { execute as pointSetToService } from "./Point/service/PointSetToService";
import { execute as pointSubtractService } from "./Point/service/PointSubtractService";

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
    /**
     * @description ポイントの水平座標です。
     *              The horizontal coordinate of the point.
     *
     * @member  {number}
     * @default 0
     * @public
     */
    public x: number;

    /**
     * @description ポイントの垂直座標です。
     *              The vertical coordinate of the point.
     *
     * @member  {number}
     * @default 0
     * @public
     */
    public y: number;

    /**
     * @param {number} [x = 0]
     * @param {number} [y = 0]
     * @constructor
     * @public
     */
    constructor (x: number = 0, y: number = 0)
    {
        this.x = x;
        this.y = y;
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
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
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
        return pointAddService(this, point);
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
        return pointCloneService(this);
    }

    /**
     * @description すべてのポイントデータを、ソース Point オブジェクトから、
     *              呼び出し元の Point オブジェクトにコピーします。
     *              Copies all of the point data from
     *              the source Point object into the calling Point object.
     *
     * @param   {Point} point
     * @returns void
     * @method
     * @public
     */
    copyFrom (point: Point): void
    {
        pointCopyFromService(this, point);
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
        return pointDistanceService(point1, point2);
    }

    /**
     * @description 2 つのポイントが等しいかどうかを判別します。
     *              Determines whether two points are equal.
     *
     * @param  {Point} point
     * @return {boolean}
     * @method
     * @public
     */
    equals (point: Point): boolean
    {
        return pointEqualsService(this, point);
    }

    /**
     * @description 2 つの指定されたポイント間にあるポイントを判別します。
     *              Determines a point between two specified points.
     *
     * @param  {Point}  point1
     * @param  {Point}  point2
     * @param  {number} f
     * @return {Point}
     * @method
     * @static
     */
    static interpolate (point1: Point, point2: Point, f: number): Point
    {
        return pointInterpolateService(point1, point2, f);
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
        pointNormalizeService(this, thickness);
    }

    /**
     * @description Point オブジェクトを指定された量だけオフセットします。
     *              Offsets the Point object by the specified amount.
     *
     * @param  {number} dx
     * @param  {number} dy
     * @return {void}
     * @method
     * @public
     */
    offset (dx: number, dy: number): void
    {
        pointOffsetService(this, dx, dy);
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
        return pointPolarService(length, angle);
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
        pointSetToService(this, x, y);
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
        return pointSubtractService(this, point);
    }
}