import { Point } from "./Point";
import { execute as rectangleCloneService } from "../src/Rectangle/service/RectangleCloneService";
import { execute as rectangleContainsService } from "../src/Rectangle/service/RectangleContainsService";
import { execute as rectangleContainsPointService } from "../src/Rectangle/service/RectangleContainsPointService";
import { execute as rectangleContainsRectService } from "../src/Rectangle/service/RectangleContainsRectService";
import { execute as rectangleCopyFromService } from "../src/Rectangle/service/RectangleCopyFromService";
import { execute as rectangleEqualsService } from "../src/Rectangle/service/RectangleEqualsService";
import { execute as rectangleInflateService } from "../src/Rectangle/service/RectangleInflateService";
import { execute as rectangleInflatePointService } from "../src/Rectangle/service/RectangleInflatePointService";
import { execute as rectangleIntersectionService } from "../src/Rectangle/service/RectangleIntersectionService";
import { execute as rectangleIntersectsService } from "../src/Rectangle/service/RectangleIntersectsService";
import { execute as rectangleIsEmptyService } from "../src/Rectangle/service/RectangleIsEmptyService";
import { execute as rectangleOffsetService } from "../src/Rectangle/service/RectangleOffsetService";
import { execute as rectangleOffsetPointService } from "../src/Rectangle/service/RectangleOffsetPointService";
import { execute as rectangleSetEmptyService } from "../src/Rectangle/service/RectangleSetEmptyService";
import { execute as rectangleSetToService } from "../src/Rectangle/service/RectangleSetToService";
import { execute as rectangleUnionService } from "../src/Rectangle/service/RectangleUnionService";

/**
 * @description Rectangle オブジェクトは、その位置（左上隅のポイント (x, y) で示される)、および幅と高さで定義される領域です。
 *              Rectangle クラスの x、y、width、および height の各プロパティは、互いに独立しているため、
 *              あるプロパティの値を変更しても、他のプロパティに影響はありません。
 *              ただし、right プロパティと bottom プロパティはこれら 4 つのプロパティと不可分に関連しています。
 *              例えば、right プロパティの値を変更すると width プロパティの値も変更されます。
 *              bottom プロパティの値を変更すると、height プロパティの値も変更されます。
 *
 *              A Rectangle object is an area defined by its position,
 *              as indicated by its top-left corner point (x, y) and by its width and its height.
 *              The x, y, width, and height properties of the Rectangle class are independent of each other;
 *              changing the value of one property has no effect on the others. However,
 *              the right and bottom properties are integrally related to those four properties.
 *              For example, if you change the value of the right property, the value of the width property changes;
 *              if you change the bottom property, the value of the height property changes.
 *
 * @class
 * @memberOf next2d.geom
 */
export class Rectangle
{
    /**
     * @description 矩形の左上隅の x 座標です。
     *              The x coordinate of the top-left corner of the rectangle.
     *
     * @member {number}
     * @public
     */
    public x: number;

    /**
     * @description 矩形の左上隅の y 座標です。
     *              The y coordinate of the top-left corner of the rectangle.
     *
     * @member {number}
     * @public
     */
    public y: number;

    /**
     * @description 矩形の幅（ピクセル単位）です。
     *              The width of the rectangle, in pixels.
     *
     * @member {number}
     * @public
     */
    public width: number;

    /**
     * @description 矩形の高さ（ピクセル単位）です。
     *              The height of the rectangle, in pixels.
     *
     * @member {number}
     * @public
     */
    public height: number;

    /**
     * @param   {number} [x=0]
     * @param   {number} [y=0]
     * @param   {number} [width=0]
     * @param   {number} [height=0]
     *
     * @constructor
     * @public
     */
    constructor (
        x: number = 0, y: number = 0,
        width: number = 0, height: number = 0
    ) {
        this.x = x;
        this.y = y;
        this.width  = width;
        this.height = height;
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @member {string}
     * @const
     * @static
     */
    static get namespace (): string
    {
        return "next2d.geom.Rectangle";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @member {string}
     * @const
     * @public
     */
    get namespace (): string
    {
        return "next2d.geom.Rectangle";
    }

    /**
     * @description y プロパティと height プロパティの合計です。
     *              The sum of the y and height properties.
     *
     * @member {number}
     * @public
     */
    get bottom (): number
    {
        return this.y + this.height;
    }
    set bottom (bottom: number)
    {
        this.height = bottom - this.y;
    }

    /**
     * @description Rectangle オブジェクトの右下隅の位置で、
     *              right プロパティと bottom プロパティの値で決まります。
     *              The location of the Rectangle object's bottom-right corner,
     *              determined by the values of the right and bottom properties.
     *
     * @member {Point}
     * @public
     */
    get bottomRight (): Point
    {
        return new Point(this.right, this.bottom);
    }
    set bottomRight (point: Point)
    {
        this.right  = point.x;
        this.bottom = point.y;
    }

    /**
     * @description 矩形の左上隅の x 座標です。
     *              The x coordinate of the top-left corner of the rectangle.
     *
     * @member {number}
     * @public
     */
    get left (): number
    {
        return this.x;
    }
    set left (left: number)
    {
        this.width = this.right - left;
        this.x     = left;
    }

    /**
     * @description x プロパティと width プロパティの合計です。
     *              The sum of the x and width properties.
     *
     * @member {number}
     * @public
     */
    get right (): number
    {
        return this.x + this.width;
    }
    set right (right: number)
    {
        this.width = right - this.x;
    }

    /**
     * @description Rectangle オブジェクトのサイズで、
     *              width プロパティと height プロパティの値を持つ Point オブジェクトとして表現されます。
     *              The size of the Rectangle object,
     *              expressed as a Point object with the values of the width and height properties.
     *
     * @member {Point}
     * @public
     */
    get size (): Point
    {
        return new Point(this.width, this.height);
    }
    set size (point: Point)
    {
        this.width  = point.x;
        this.height = point.y;
    }

    /**
     * @description 矩形の左上隅の y 座標です。
     *              The y coordinate of the top-left corner of the rectangle.
     *
     * @member {number}
     * @public
     */
    get top (): number
    {
        return this.y;
    }
    set top (top: number)
    {
        this.height = this.bottom - top;
        this.y      = top;
    }

    /**
     * @description Rectangle オブジェクトの左上隅の位置で、
     *              そのポイントの x 座標と y 座標で決まります。
     *              The location of the Rectangle object's top-left corner,
     *              determined by the x and y coordinates of the point.
     *
     * @member {Point}
     * @public
     */
    get topLeft (): Point
    {
        return new Point(this.x, this.y);
    }
    set topLeft (point: Point)
    {
        this.left = point.x;
        this.top  = point.y;
    }

    /**
     * @description 元の Rectangle オブジェクトと x、y、width、および height の各プロパティの値が同じである、
     *              新しい Rectangle オブジェクトを返します。
     *              Returns a new Rectangle object with the same values for the x, y, width,
     *              and height properties as the original Rectangle object.
     *
     * @return {Rectangle}
     * @method
     * @public
     */
    clone (): Rectangle
    {
        return rectangleCloneService(this);
    }

    /**
     * @description 指定されたポイントがこの Rectangle オブジェクトで定義される矩形領域内にあるかどうかを判別します。
     *              Determines whether the specified point is contained within
     *              the rectangular region defined by this Rectangle object.
     *
     * @param  {number} x
     * @param  {number} y
     * @return {boolean}
     * @method
     * @public
     */
    contains (x: number, y: number): boolean
    {
        return rectangleContainsService(this, x, y);
    }

    /**
     * @description 指定されたポイントがこの Rectangle オブジェクトで定義される矩形領域内にあるかどうかを判別します。
     *              Determines whether the specified point is contained within
     *              the rectangular region defined by this Rectangle object.
     *
     * @param  {Point}   point
     * @return {boolean}
     * @method
     * @public
     */
    containsPoint (point: Point): boolean
    {
        return rectangleContainsPointService(this, point);
    }

    /**
     * @description rect パラメーターで指定された Rectangle オブジェクトがこの Rectangle オブジェクト内にあるかどうかを判別します。
     *              Determines whether the Rectangle object specified by
     *              the rect parameter is contained within this Rectangle object.
     *
     * @param  {Rectangle} rectangle
     * @return {boolean}
     * @method
     * @public
     */
    containsRect (rectangle: Rectangle): boolean
    {
        return rectangleContainsRectService(this, rectangle);
    }

    /**
     * @description すべての矩形データを、ソース Rectangle オブジェクトから、
     *              呼び出し元の Rectangle オブジェクトにコピーします。
     *              Copies all of rectangle data from
     *              the source Rectangle object into the calling Rectangle object.
     *
     * @param  {Rectangle} rectangle
     * @return {void}
     * @method
     * @public
     */
    copyFrom (rectangle: Rectangle): void
    {
        rectangleCopyFromService(this, rectangle);
    }

    /**
     * @description toCompare パラメーターで指定されたオブジェクトが
     *              この Rectangle オブジェクトと等しいかどうかを判別します。
     *              Determines whether the object specified
     *              in the toCompare parameter is equal to this Rectangle object.
     *
     * @param  {Rectangle} rectangle
     * @return {boolean}
     * @method
     * @public
     */
    equals (rectangle: Rectangle): boolean
    {
        return rectangleEqualsService(this, rectangle);
    }

    /**
     * @description Rectangle オブジェクトのサイズを、指定された量（ピクセル単位）だけ大きくします。
     *              Increases the size of the Rectangle object by the specified amounts, in pixels.
     *
     * @param  {number} dx
     * @param  {number} dy
     * @return {void}
     * @method
     * @public
     */
    inflate (dx: number, dy: number): void
    {
        rectangleInflateService(this, dx, dy);
    }

    /**
     * @description Rectangle オブジェクトのサイズを大きくします。
     *              Increases the size of the Rectangle object.
     *
     * @param  {Point} point
     * @return {void}
     * @method
     * @public
     */
    inflatePoint (point: Point): void
    {
        rectangleInflatePointService(this, point);
    }

    /**
     * @description toIntersect パラメーターで指定された Rectangle オブジェクトが
     *              この Rectangle オブジェクトと交差する場合に、交差領域を Rectangle オブジェクトとして返します。
     *              If the Rectangle object specified in the toIntersect parameter intersects
     *              with this Rectangle object, returns the area of intersection as a Rectangle object.
     *
     * @param  {Rectangle} rectangle
     * @return {Rectangle}
     * @method
     * @public
     */
    intersection (rectangle: Rectangle): Rectangle
    {
        return rectangleIntersectionService(this, rectangle);
    }

    /**
     * @description toIntersect パラメーターで指定されたオブジェクトが
     *              この Rectangle オブジェクトと交差するかどうかを判別します。
     *              Determines whether the object specified
     *              in the toIntersect parameter intersects with this Rectangle object.
     *
     * @param  {Rectangle} rectangle
     * @return {boolean}
     * @method
     * @public
     */
    intersects (rectangle: Rectangle): boolean
    {
        return rectangleIntersectsService(this, rectangle);
    }

    /**
     * @description この Rectangle オブジェクトが空かどうかを判別します。
     *              Determine if this Rectangle object is empty.
     *
     * @return {boolean}
     * @method
     * @public
     */
    isEmpty (): boolean
    {
        return rectangleIsEmptyService(this);
    }

    /**
     * @description Rectangle オブジェクトの位置（左上隅で決定される）を、指定された量だけ調整します。
     *              Adjusts the location of the Rectangle object,
     *              as determined by its top-left corner, by the specified amounts.
     *
     * @param  {number} dx
     * @param  {number} dy
     * @return {void}
     * @method
     * @public
     */
    offset (dx: number ,dy: number): void
    {
        rectangleOffsetService(this, dx, dy);
    }

    /**
     * @description Point オブジェクトをパラメーターとして使用して、Rectangle オブジェクトの位置を調整します。
     *              Adjusts the location of the Rectangle object using a Point object as a parameter.
     *
     * @param  {Point} point
     * @return {void}
     * @method
     * @public
     */
    offsetPoint (point: Point): void
    {
        rectangleOffsetPointService(this, point);
    }

    /**
     * @description Rectangle オブジェクトのすべてのプロパティを 0 に設定します。
     *              Sets all properties of the Rectangle object to 0.
     *
     * @return {void}
     * @method
     * @public
     */
    setEmpty (): void
    {
        rectangleSetEmptyService(this);
    }

    /**
     * @description Rectangle のメンバーを指定の値に設定します。
     *              Sets the members of Rectangle to the specified values
     *
     * @param  {number} x
     * @param  {number} y
     * @param  {number} width
     * @param  {number} height
     * @return {void}
     * @method
     * @public
     */
    setTo (x: number, y: number, width: number, height: number): void
    {
        rectangleSetToService(this, x, y, width, height);
    }

    /**
     * @description 2 つの矩形間の水平と垂直の空間を塗りつぶすことにより、
     *              2 つの矩形を加算して新しい Rectangle オブジェクトを作成します。
     *              Adds two rectangles together to create a new Rectangle object,
     *              by filling in the horizontal and vertical space between the two rectangles.
     *
     * @param  {Rectangle} rectangle
     * @return {Rectangle}
     * @method
     * @public
     */
    union (rectangle: Rectangle): Rectangle
    {
        return rectangleUnionService(this, rectangle);
    }
}
