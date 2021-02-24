/**
 * @class
 */
class Rectangle
{
    /**
     * Rectangle オブジェクトは、その位置（左上隅のポイント (x, y) で示される)、および幅と高さで定義される領域です。
     * Rectangle クラスの x、y、width、および height の各プロパティは、互いに独立しているため、
     * あるプロパティの値を変更しても、他のプロパティに影響はありません。
     * ただし、right プロパティと bottom プロパティはこれら 4 つのプロパティと不可分に関連しています。
     * 例えば、right プロパティの値を変更すると width プロパティの値も変更されます。
     * bottom プロパティの値を変更すると、height プロパティの値も変更されます。
     *
     * A Rectangle object is an area defined by its position,
     * as indicated by its top-left corner point (x, y) and by its width and its height.
     * The x, y, width, and height properties of the Rectangle class are independent of each other;
     * changing the value of one property has no effect on the others. However,
     * the right and bottom properties are integrally related to those four properties.
     * For example, if you change the value of the right property, the value of the width property changes;
     * if you change the bottom property, the value of the height property changes.
     *
     * @param   {number} [x=0]
     * @param   {number} [y=0]
     * @param   {number} [width=0]
     * @param   {number} [height=0]
     *
     * @example <caption>Example usage of Rectangle.</caption>
     * // new Rectangle
     * const {Rectangle} = next2d.geom;
     * const rectangle   = new Rectangle(0, 0, 100, 100);
     *
     * @constructor
     * @public
     */
    constructor (x = 0, y = 0, width = 0, height = 0)
    {
        this.setTo(x, y, width, height);
    }

    /**
     * 指定されたクラスのストリングを返します。
     * Returns the string representation of the specified class.
     *
     * @return {string}
     * @method
     * @static
     */
    static toString()
    {
        return "[class Rectangle]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @member {number}
     * @default next2d.geom:Rectangle
     * @const
     * @static
     */
    static get namespace ()
    {
        return "next2d.geom:Rectangle";
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
        return `(x=${this.x}, y=${this.y}, w=${this.width}, h=${this.height})`;
    };

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @member  {string}
     * @default next2d.geom:Rectangle
     * @public
     * @const
     */
    get namespace ()
    {
        return "next2d.geom:Rectangle";
    }

    /**
     * @description y プロパティと height プロパティの合計です。
     *              The sum of the y and height properties.
     *
     * @member {number}
     * @public
     */
    get bottom ()
    {
        return this.y + this.height;
    }
    set bottom (bottom)
    {
        this.height = +bottom - this.y;
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
    get bottomRight ()
    {
        return new Point(this.right, this.bottom);
    }
    set bottomRight (point)
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
    get height ()
    {
        return this._$height / Util.$TWIPS;
    }
    set height (height)
    {
        this._$height = +height * Util.$TWIPS;
    }

    /**
     * @description 矩形の左上隅の x 座標です。
     *              The x coordinate of the top-left corner of the rectangle.
     *
     * @member {number}
     * @public
     */
    get left ()
    {
        return this.x;
    }
    set left (left)
    {
        this.width = this.right - +left;
        this.x     = left;
    }

    /**
     * @description x プロパティと width プロパティの合計です。
     *              The sum of the x and width properties.
     *
     * @member {number}
     * @public
     */
    get right ()
    {
        return this.x + this.width;
    }
    set right (right)
    {
        this.width = +right - this.x;
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
    get size ()
    {
        return new Point(this.width, this.height);
    }
    set size (point)
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
    get top ()
    {
        return this.y;
    }
    set top (top)
    {
        this.height = +(this.bottom - +top);
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
    get topLeft ()
    {
        return new Point(this.x, this.y);
    }
    set topLeft (point)
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
    get width ()
    {
        return this._$width / Util.$TWIPS;
    }
    set width (width)
    {
        this._$width = +width * Util.$TWIPS;
    }

    /**
     * @description 矩形の左上隅の x 座標です。
     *              The x coordinate of the top-left corner of the rectangle.
     *
     * @member {number}
     * @public
     */
    get x ()
    {
        return this._$x / Util.$TWIPS;
    }
    set x (x)
    {
        this._$x = +x * Util.$TWIPS;
    }

    /**
     * @description 矩形の左上隅の y 座標です。
     *              The y coordinate of the top-left corner of the rectangle.
     *
     * @member {number}
     * @public
     */
    get y ()
    {
        return this._$y / Util.$TWIPS;
    }
    set y (y)
    {
        this._$y = +y * Util.$TWIPS;
    }

    /**
     * @description 元の Rectangle オブジェクトと x、y、width、および height の各プロパティの値が同じである、
     *              新しい Rectangle オブジェクトを返します。
     *              Returns a new Rectangle object with the same values for the x, y, width,
     *              and height properties as the original Rectangle object.
     *
     * @return {Rectangle}
     *
     * @public
     */
    clone ()
    {
        return new Rectangle(this.x, this.y, this.width, this.height);
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
    contains (x, y)
    {
        return (this.x <= x && this.y <= y && this.right > x && this.bottom > y);
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
    containsPoint (point)
    {
        return (this.x <= point.x && this.y <= point.y &&
            this.right > point.x && this.bottom > point.y);
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
    containsRect (rect)
    {
        return (this.x <= rect.x && this.y <= rect.y &&
            this.right >= rect.right && this.bottom >= rect.bottom);
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
    copyFrom (source_rect)
    {
        this.x      = source_rect.x;
        this.y      = source_rect.y;
        this.width  = source_rect.width;
        this.height = source_rect.height;
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
    equals (to_compare)
    {
        return (this.x === to_compare.x && this.y === to_compare.y &&
            this.width === to_compare.width && this.height === to_compare.height);
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
    inflate (dx, dy)
    {
        this.x      = this.x - +dx;
        this.width  = this.width + 2 * +dx;

        this.y      = this.y - +dy;
        this.height = this.height + 2 * +dy;
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
    inflatePoint (point)
    {
        this.x      = this.x - point.x;
        this.width  = this.width + 2 * point.x;

        this.y      = this.y - point.y;
        this.height = this.height + 2 * point.y;
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
    intersection (to_intersect)
    {
        const sx = Util.$max(this.x, to_intersect.x);
        const sy = Util.$max(this.y, to_intersect.y);
        const ex = Util.$min(this.right,  to_intersect.right);
        const ey = Util.$min(this.bottom, to_intersect.bottom);

        const w = ex - sx;
        const h = ey - sy;
        return (w > 0 && h > 0) ? new Rectangle(sx, sy, w, h) : new Rectangle(0, 0, 0, 0);
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
    intersects (to_intersect)
    {
        const sx = Util.$max(this.x, to_intersect.x);
        const sy = Util.$max(this.y, to_intersect.y);
        const ex = Util.$min(this.right,  to_intersect.right);
        const ey = Util.$min(this.bottom, to_intersect.bottom);
        return ((ex - sx) > 0 && (ey - sy) > 0);
    }

    /**
     * @description この Rectangle オブジェクトが空かどうかを判別します。
     *              Determines whether or not this Rectangle object is empty.
     *
     * @return {boolean}
     * @method
     * @public
     */
    isEmpty ()
    {
        return (this.width <= 0 || this.height <= 0);
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
    offset (dx ,dy)
    {
        this.x += dx;
        this.y += dy;
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
    offsetPoint (point)
    {
        this.x += point.x;
        this.y += point.y;
    }

    /**
     * @description Rectangle オブジェクトのすべてのプロパティを 0 に設定します。
     *              Sets all of the Rectangle object's properties to 0.
     *
     * @return {void}
     * @method
     * @public
     */
    setEmpty ()
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
    setTo (x, y, width, height)
    {
        this.x      = x;
        this.y      = y;
        this.width  = width;
        this.height = height;
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
    union (to_union)
    {
        if (this.isEmpty()) {
            return to_union.clone();
        }

        if (to_union.isEmpty()) {
            return this.clone();
        }

        return new Rectangle(
            Util.$min(this.x, to_union.x),
            Util.$min(this.y, to_union.y),
            Util.$max(this.right - to_union.left, to_union.right - this.left),
            Util.$max(this.bottom - to_union.top, to_union.bottom - this.top)
        );
    }
}