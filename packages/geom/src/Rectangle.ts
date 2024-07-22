import { Point } from "./Point";

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
    private _$x: number;
    private _$y: number;
    private _$width: number;
    private _$height: number;

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

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$width = width;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$height = height;
    }

    /**
     * 指定されたクラスのストリングを返します。
     * Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default "[class Rectangle]"
     * @method
     * @static
     */
    static toString (): string
    {
        return "[class Rectangle]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @member  {string}
     * @default "next2d.geom.Rectangle"
     * @const
     * @static
     */
    static get namespace (): string
    {
        return "next2d.geom.Rectangle";
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
        return `(x=${this.x}, y=${this.y}, w=${this.width}, h=${this.height})`;
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @member  {string}
     * @default "next2d.geom.Rectangle"
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
        return this._$y + this._$height;
    }
    set bottom (bottom: number)
    {
        this._$height = bottom - this._$y;
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
     * @description 矩形の高さ（ピクセル単位）です。
     *              The height of the rectangle, in pixels.
     *
     * @member {number}
     * @public
     */
    get height (): number
    {
        return this._$height;
    }
    set height (height: number)
    {
        this._$height = height;
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
        return this._$x;
    }
    set left (left: number)
    {
        this._$width = this.right - left;
        this._$x     = left;
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
        return this._$x + this.width;
    }
    set right (right: number)
    {
        this._$width = right - this._$x;
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
        return new Point(this._$width, this._$height);
    }
    set size (point: Point)
    {
        this._$width  = point.x;
        this._$height = point.y;
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
        return this._$y;
    }
    set top (top: number)
    {
        this._$height = this.bottom - top;
        this._$y      = top;
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
        return new Point(this._$x, this._$y);
    }
    set topLeft (point: Point)
    {
        this.left = point.x;
        this.top  = point.y;
    }

    /**
     * @description 矩形の幅（ピクセル単位）です。
     *              The width of the rectangle, in pixels.
     *
     * @member {number}
     * @public
     */
    get width (): number
    {
        return this._$width;
    }
    set width (width: number)
    {
        this._$width = width;
    }

    /**
     * @description 矩形の左上隅の x 座標です。
     *              The x coordinate of the top-left corner of the rectangle.
     *
     * @member {number}
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
     * @description 矩形の左上隅の y 座標です。
     *              The y coordinate of the top-left corner of the rectangle.
     *
     * @member {number}
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
        return new Rectangle(this._$x, this._$y, this._$width, this._$height);
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
        return this._$x <= x && this._$y <= y && this.right > x && this.bottom > y;
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
        return this._$x <= point.x && this._$y <= point.y &&
            this.right > point.x && this.bottom > point.y;
    }

    /**
     * @description rect パラメーターで指定された Rectangle オブジェクトがこの Rectangle オブジェクト内にあるかどうかを判別します。
     *              Determines whether the Rectangle object specified by
     *              the rect parameter is contained within this Rectangle object.
     *
     * @param  {Rectangle} rect
     * @return {boolean}
     * @method
     * @public
     */
    containsRect (rect: Rectangle): boolean
    {
        return this._$x <= rect.x && this._$y <= rect.y &&
            this.right >= rect.right && this.bottom >= rect.bottom;
    }

    /**
     * @description すべての矩形データを、ソース Rectangle オブジェクトから、
     *              呼び出し元の Rectangle オブジェクトにコピーします。
     *              Copies all of rectangle data from
     *              the source Rectangle object into the calling Rectangle object.
     *
     * @param  {Rectangle} source_rect
     * @return {void}
     * @method
     * @public
     */
    copyFrom (source_rect: Rectangle): void
    {
        this._$x      = source_rect.x;
        this._$y      = source_rect.y;
        this._$width  = source_rect.width;
        this._$height = source_rect.height;
    }

    /**
     * @description toCompare パラメーターで指定されたオブジェクトが
     *              この Rectangle オブジェクトと等しいかどうかを判別します。
     *              Determines whether the object specified
     *              in the toCompare parameter is equal to this Rectangle object.
     *
     * @param  {Rectangle} to_compare
     * @return {boolean}
     * @method
     * @public
     */
    equals (to_compare: Rectangle): boolean
    {
        return this._$x === to_compare.x && this._$y === to_compare.y &&
            this._$width === to_compare.width && this._$height === to_compare.height;
    }

    /**
     * @description Rectangle オブジェクトのサイズを、指定された量（ピクセル単位）だけ大きくします。
     *              Increases the size of the Rectangle object by the specified amounts, in pixels.
     *
     * @param  {number} dx
     * @param  {number} dy
     * @return void
     * @method
     * @public
     */
    inflate (dx: number, dy: number): void
    {
        this._$x      = this._$x - dx;
        this._$width  = this._$width + 2 * dx;

        this._$y      = this._$y - dy;
        this._$height = this._$height + 2 * dy;
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
        this._$x      = this._$x - point.x;
        this._$width  = this._$width + 2 * point.x;

        this._$y      = this._$y - point.y;
        this._$height = this._$height + 2 * point.y;
    }

    /**
     * @description toIntersect パラメーターで指定された Rectangle オブジェクトが
     *              この Rectangle オブジェクトと交差する場合に、交差領域を Rectangle オブジェクトとして返します。
     *              If the Rectangle object specified in the toIntersect parameter intersects
     *              with this Rectangle object, returns the area of intersection as a Rectangle object.
     *
     * @param  {Rectangle} to_intersect
     * @return {Rectangle}
     * @method
     * @public
     */
    intersection (to_intersect: Rectangle): Rectangle
    {
        const sx = Math.max(this._$x, to_intersect.x);
        const sy = Math.max(this._$y, to_intersect.y);
        const ex = Math.min(this.right,  to_intersect.right);
        const ey = Math.min(this.bottom, to_intersect.bottom);

        const w = ex - sx;
        const h = ey - sy;
        return w > 0 && h > 0 ? new Rectangle(sx, sy, w, h) : new Rectangle(0, 0, 0, 0);
    }

    /**
     * @description toIntersect パラメーターで指定されたオブジェクトが
     *              この Rectangle オブジェクトと交差するかどうかを判別します。
     *              Determines whether the object specified
     *              in the toIntersect parameter intersects with this Rectangle object.
     *
     * @param  {Rectangle} to_intersect
     * @return {boolean}
     * @method
     * @public
     */
    intersects (to_intersect: Rectangle): boolean
    {
        const sx = Math.max(this._$x, to_intersect.x);
        const sy = Math.max(this._$y, to_intersect.y);
        const ex = Math.min(this.right,  to_intersect.right);
        const ey = Math.min(this.bottom, to_intersect.bottom);
        return ex - sx > 0 && ey - sy > 0;
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
        return this._$width <= 0 || this._$height <= 0;
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
        this._$x += dx;
        this._$y += dy;
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
        this._$x += point.x;
        this._$y += point.y;
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
        this._$x      = 0;
        this._$y      = 0;
        this._$width  = 0;
        this._$height = 0;
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
        this._$x      = x;
        this._$y      = y;
        this._$width  = width;
        this._$height = height;
    }

    /**
     * @description 2 つの矩形間の水平と垂直の空間を塗りつぶすことにより、
     *              2 つの矩形を加算して新しい Rectangle オブジェクトを作成します。
     *              Adds two rectangles together to create a new Rectangle object,
     *              by filling in the horizontal and vertical space between the two rectangles.
     *
     * @param  {Rectangle} to_union
     * @return {Rectangle}
     * @method
     * @public
     */
    union (to_union: Rectangle): Rectangle
    {
        if (this.isEmpty()) {
            return to_union.clone();
        }

        if (to_union.isEmpty()) {
            return this.clone();
        }

        return new Rectangle(
            Math.min(this._$x, to_union.x),
            Math.min(this._$y, to_union.y),
            Math.max(this.right - to_union.left, to_union.right - this.left),
            Math.max(this.bottom - to_union.top, to_union.bottom - this.top)
        );
    }
}
