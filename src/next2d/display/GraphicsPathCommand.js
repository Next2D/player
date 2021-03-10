/**
 * @class
 * @memberOf next2d.display
 */
class GraphicsPathCommand
{
    /**
     * @constructor
     * @public
     */
    constructor () {}

    /**
     * @description 指定されたクラスのストリングを返します。
     *              Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default [class GraphicsPathCommand]
     * @method
     * @static
     */
    static toString()
    {
        return "[class GraphicsPathCommand]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return  {string}
     * @default next2d.display:Bitmap
     * @const
     * @static
     */
    static get namespace ()
    {
        return "next2d.display:GraphicsPathCommand";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return  {string}
     * @default [object GraphicsPathCommand]
     * @method
     * @public
     */
    toString ()
    {
        return "[object GraphicsPathCommand]";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @return  {string}
     * @default next2d.display:GraphicsPathCommand
     * @const
     * @static
     */
    get namespace ()
    {
        return "next2d.display:GraphicsPathCommand";
    }

    /**
     * @param  {number} x
     * @param  {number} y
     * @return {string}
     * @method
     * @static
     */
    static MOVE_TO (x, y)
    {
        return `ctx.moveTo(${x}, ${y});`;
    }

    /**
     * @param  {number} x
     * @param  {number} y
     * @return {string}
     * @method
     * @static
     */
    static LINE_TO (x, y)
    {
        return `ctx.lineTo(${x}, ${y});`;
    }

    /**
     * @param  {number} cpx
     * @param  {number} cpy
     * @param  {number} x
     * @param  {number} y
     * @return {string}
     * @method
     * @static
     */
    static CURVE_TO (cpx, cpy, x, y)
    {
        return `ctx.quadraticCurveTo(${cpx},${cpy},${x},${y});`;
    }

    /**
     * @param  {number} r
     * @param  {number} g
     * @param  {number} b
     * @param  {number} a
     * @return {string}
     * @method
     * @static
     */
    static FILL_STYLE (r, g, b, a)
    {
        return `
if (!is_clip && !options) {
    ctx._$style = ctx._$contextStyle;
    ctx._$style._$fillStyle[0] = Math.max(0, Math.min((${r} * ct[0]) + ct[4], 255)) / 255;
    ctx._$style._$fillStyle[1] = Math.max(0, Math.min((${g} * ct[1]) + ct[5], 255)) / 255;
    ctx._$style._$fillStyle[2] = Math.max(0, Math.min((${b} * ct[2]) + ct[6], 255)) / 255;
    ctx._$style._$fillStyle[3] = Math.max(0, Math.min((${a} * ct[3]) + ct[7], 255)) / 255;
}`;
    }

    /**
     * @return  {string}
     * @method
     * @static
     */
    static END_FILL ()
    {
        return `
if (options) {
    if (ctx.isPointInPath(options.x, options.y)) { 
        return true; 
    }
    if ("isPointInStroke" in ctx && ctx.isPointInStroke(options.x, options.y)) {
        return true; 
    }
}
if (!is_clip && !options) {
    ctx.fill();
}`;
    }

    /**
     * @return  {string}
     * @method
     * @static
     */
    static BEGIN_PATH ()
    {
        return `ctx.beginPath();`;
    }

    /**
     * @param  {number} cp1x
     * @param  {number} cp1y
     * @param  {number} cp2x
     * @param  {number} cp2y
     * @param  {number} x
     * @param  {number} y
     * @return {string}
     * @method
     * @static
     */
    static CUBIC (cp1x, cp1y, cp2x, cp2y, x, y)
    {
        return `ctx.bezierCurveTo(${cp1x},${cp1y},${cp2x},${cp2y},${x},${y});`;
    }



}
