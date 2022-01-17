/**
 * @class
 */
class CanvasToWebGLContextPath
{
    /**
     * @constructor
     */
    constructor ()
    {
        this._$currentPath = [];
        this._$vertices    = [];
        this._$bounds      = { "xMin": 0, "xMax": 0, "yMin": 0, "yMax": 0 };
        this._$resetBounds();
    }

    /**
     * @memberof CanvasToWebGLContextPath#
     * @property {array}
     * @return {array}
     * @public
     */
    get vertices ()
    {
        this._$pushCurrentPathToVertices();
        return this._$vertices;
    }

    /**
     * @return void
     * @public
     */
    begin ()
    {
        this._$currentPath.length = 0;

        while (this._$vertices.length) {
            Util.$poolArray(this._$vertices.pop());
        }

        this._$resetBounds();
    }

    /**
     * @param {number} x
     * @param {number} y
     * @return void
     * @public
     */
    moveTo (x, y)
    {
        if (!this._$currentPath.length) {
            this._$pushPointToCurrentPath(x, y, false);
            return;
        }

        if (this._$equalsToLastPoint(x, y)) {
            return;
        }

        this._$pushCurrentPathToVertices();
        this._$pushPointToCurrentPath(x, y, false);
    }

    /**
     * @param  {number} x
     * @param  {number} y
     * @return void
     * @public
     */
    lineTo (x, y)
    {
        if (!this._$currentPath.length) {
            this.moveTo(0, 0);
        }

        if (this._$equalsToLastPoint(x, y)) {
            return;
        }

        this._$pushPointToCurrentPath(x, y, false);
    }

    /**
     * @param  {number} cx
     * @param  {number} cy
     * @param  {number} x
     * @param  {number} y
     * @return void
     * @public
     */
    quadTo (cx, cy, x, y)
    {
        if (!this._$currentPath.length) {
            this.moveTo(0, 0);
        }

        if (this._$equalsToLastPoint(x, y)) {
            return;
        }

        this._$pushPointToCurrentPath(cx, cy, true);
        this._$pushPointToCurrentPath(x, y, false);
    }

    /**
     * @param {number} cx1
     * @param {number} cy1
     * @param {number} cx2
     * @param {number} cy2
     * @param {number} x
     * @param {number} y
     * @return void
     * @public
     */
    cubicTo (cx1, cy1, cx2, cy2, x, y)
    {
        if (!this._$currentPath.length) {
            this.moveTo(0, 0);
        }

        if (this._$equalsToLastPoint(x, y)) {
            return;
        }

        const fromX = this._$currentPath[this._$currentPath.length - 3];
        const fromY = this._$currentPath[this._$currentPath.length - 2];
        BezierConverter.cubicToQuad(fromX, fromY, cx1, cy1, cx2, cy2, x, y);

        const length = Util.$bezierConverterBuffer.length;
        for (let i = 0; i < length; ) {
            this.quadTo(
                Util.$bezierConverterBuffer[i++],
                Util.$bezierConverterBuffer[i++],
                Util.$bezierConverterBuffer[i++],
                Util.$bezierConverterBuffer[i++]
            );
        }
    }

    /**
     * @param {number} x
     * @param {number} y
     * @param {number} radius
     * @return void
     * @public
     */
    drawCircle (x, y, radius)
    {
        const r = radius;
        const k = radius * 0.5522847498307936;
        this.cubicTo(x + r, y + k, x + k, y + r, x, y + r);
        this.cubicTo(x - k, y + r, x - r, y + k, x - r, y);
        this.cubicTo(x - r, y - k, x - k, y - r, x, y - r);
        this.cubicTo(x + k, y - r, x + r, y - k, x + r, y);
    }

    /**
     * @return void
     * @public
     */
    close ()
    {
        if (this._$currentPath.length <= 6) {
            return;
        }

        const x = this._$currentPath[0];
        const y = this._$currentPath[1];

        if (this._$equalsToLastPoint(x, y)) {
            return;
        }

        this._$pushPointToCurrentPath(x, y, false);
    }

    /**
     * @param  {number} x
     * @param  {number} y
     * @return {boolean}
     * @private
     */
    _$equalsToLastPoint (x, y)
    {
        const lastX = this._$currentPath[this._$currentPath.length - 3];
        const lastY = this._$currentPath[this._$currentPath.length - 2];
        return x === lastX && y === lastY;
    }

    /**
     * @param {number} x
     * @param {number} y
     * @param {boolean} isControlPoint
     * @return void
     * @private
     */
    _$pushPointToCurrentPath (x, y, isControlPoint)
    {
        this._$currentPath.push(x);
        this._$currentPath.push(y);
        this._$currentPath.push(isControlPoint);

        this._$bounds.xMin = $Math.min(x, this._$bounds.xMin);
        this._$bounds.xMax = $Math.max(x, this._$bounds.xMax);
        this._$bounds.yMin = $Math.min(y, this._$bounds.yMin);
        this._$bounds.yMax = $Math.max(y, this._$bounds.yMax);
    }

    /**
     * @return void
     * @private
     */
    _$pushCurrentPathToVertices ()
    {
        if (this._$currentPath.length <= 3) {
            this._$currentPath.length = 0;
            return;
        }

        this._$vertices.push(this._$currentPath);
        this._$currentPath = Util.$getArray();
    }

    /**
     * @return void
     * @private
     */
    _$resetBounds ()
    {
        const v = $Number.MAX_VALUE;
        this._$bounds.xMin =  v;
        this._$bounds.xMax = -v;
        this._$bounds.yMin =  v;
        this._$bounds.yMax = -v;
    }

    /**
     * @return {array}
     * @public
     */
    getBoundsVertices ()
    {
        return Util.$getArray(Util.$getArray(
            this._$bounds.xMin, this._$bounds.yMin, false,
            this._$bounds.xMax, this._$bounds.yMin, false,
            this._$bounds.xMax, this._$bounds.yMax, false,
            this._$bounds.xMin, this._$bounds.yMax, false
        ));
    }

    /**
     * @param  {number} x
     * @param  {number} y
     * @param  {number} w
     * @param  {number} h
     * @return {array}
     * @public
     */
    createRectVertices (x, y, w, h)
    {
        return Util.$getArray(Util.$getArray(
            x,     y,     false,
            x + w, y,     false,
            x + w, y + h, false,
            x,     y + h, false
        ));
    }
}
