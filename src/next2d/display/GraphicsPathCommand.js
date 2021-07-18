/**
 * @class
 * @private
 */
class GraphicsPathCommand
{
    /**
     * @constructor
     * @private
     */
    constructor () {}

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
    return false;
}
if (!is_clip) {
    ctx.fill();
}`;
    }

    /**
     * @return {string}
     * @method
     * @static
     */
    static BEGIN_PATH ()
    {
        return "ctx.beginPath();";
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

    /**
     * @return {string}
     * @method
     * @static
     */
    static CLOSE_PATH ()
    {
        return "ctx.closePath();";
    }

    /**
     * @param  {number} thickness
     * @param  {string} caps
     * @param  {string} joints
     * @param  {number} miter_limit
     * @param  {number} r
     * @param  {number} g
     * @param  {number} b
     * @param  {number} a
     * @return {string}
     * @method
     * @static
     */
    static STROKE_STYLE (thickness, caps, joints, miter_limit, r, g, b, a)
    {
        return `
if (!is_clip && !options) {
    ctx._$style = ctx._$contextStyle;
    ctx._$style._$strokeStyle[0] = Math.max(0, Math.min((${r} * ct[0]) + ct[4], 255)) / 255;
    ctx._$style._$strokeStyle[1] = Math.max(0, Math.min((${g} * ct[1]) + ct[5], 255)) / 255;
    ctx._$style._$strokeStyle[2] = Math.max(0, Math.min((${b} * ct[2]) + ct[6], 255)) / 255;
    ctx._$style._$strokeStyle[3] = Math.max(0, Math.min((${a} * ct[3]) + ct[7], 255)) / 255;
    ctx.lineWidth = ${thickness};
    ctx.lineCap = "${caps}";
    ctx.lineJoin = "${joints}";
    ctx.miterLimit = ${miter_limit};
}`;
    }

    /**
     * @return {string}
     * @method
     * @static
     */
    static END_STROKE ()
    {
        return `
if (options) {
    if ("isPointInStroke" in ctx && ctx.isPointInStroke(options.x, options.y)) {
        return true; 
    }
    return false;
}
if (!is_clip) {
    ctx.stroke();
}`;
    }

    /**
     * @param  {number} x
     * @param  {number} y
     * @param  {number} radius
     * @return {string}
     * @method
     * @static
     */
    static ARC (x, y, radius)
    {
        return `
ctx.moveTo((${x} + ${radius}),${y});
ctx.arc(${x},${y},${radius},0,2 * Math.PI);`;
    }

    /**
     * @param  {string} type
     * @param  {array}  colors
     * @param  {array}  matrix
     * @param  {string} spread_method
     * @param  {string} interpolation_method
     * @param  {number} [focal_point_ratio=0]
     * @return {string}
     * @method
     * @static
     */
    static GRADIENT (
        type, colors, matrix,
        spread_method, interpolation_method, focal_point_ratio = 0
    ) {

        let gradient = "";
        switch (type) {

            case GradientType.LINEAR:
                const xy = Util.$linearGradientXY(matrix);
                gradient += `const css = ctx.createLinearGradient(
${xy[0]},${xy[1]},${xy[2]},${xy[3]},"${interpolation_method}","${spread_method}");`;
                break;

            case GradientType.RADIAL:
                gradient += `ctx.save();
ctx.transform(${matrix[0]},${matrix[1]},${matrix[2]},${matrix[3]},${matrix[4]},${matrix[5]});
const css = ctx.createRadialGradient(0,0,0,0,0,819.2,"${interpolation_method}","${spread_method}",${focal_point_ratio});`;
                break;

        }

        const length = colors.length;
        for (let idx = 0; idx < length; ++idx) {

            const color = colors[idx];

            gradient += `css.addColorStop(${color.ratio}, new Float32Array([
Math.max(0,Math.min(${color.R}*ct[0]+ct[4],255))|0,
Math.max(0,Math.min(${color.G}*ct[1]+ct[5],255))|0,
Math.max(0,Math.min(${color.B}*ct[2]+ct[6],255))|0,
Math.max(0,Math.min(${color.A}*ct[3]+ct[7],255))|0
]));`;

        }

        return gradient;
    }

    /**
     * @param  {string} type
     * @param  {array}  colors
     * @param  {array}  matrix
     * @param  {string} spread_method
     * @param  {string} interpolation_method
     * @param  {number} focal_point_ratio
     * @return {string}
     * @method
     * @static
     */
    static GRADIENT_FILL (
        type, colors, matrix,
        spread_method, interpolation_method, focal_point_ratio
    ) {
        return `
if (options) {
    if (ctx.isPointInPath(options.x, options.y)) {
        return true;
    }
    if ("isPointInStroke" in ctx && ctx.isPointInStroke(options.x, options.y)) {
        return true;
    }
    return false;
}
if (!is_clip) {
    ${GraphicsPathCommand.GRADIENT(
        type, colors, matrix, spread_method, 
        interpolation_method, focal_point_ratio
    )}
    ctx.fillStyle = css;
    ctx.fill();
    ${type === GradientType.RADIAL ? "ctx.restore();" : ""}
}`;
    }

    /**
     * @param  {number} thickness
     * @param  {string} caps
     * @param  {string} joints
     * @param  {number} miter_limit
     * @param  {string} type
     * @param  {array}  colors
     * @param  {array}  matrix
     * @param  {string} spread_method
     * @param  {string} interpolation_method
     * @param  {number} focal_point_ratio
     * @return {string}
     * @method
     * @static
     */
    static GRADIENT_STROKE (
        thickness, caps, joints, miter_limit, type, colors, matrix,
        spread_method, interpolation_method, focal_point_ratio
    ) {
        return `
if (options) {
    if (ctx.isPointInPath(options.x, options.y)) {
        return true;
    }
    if ("isPointInStroke" in ctx && ctx.isPointInStroke(options.x, options.y)) {
        return true;
    }
    return false;
}
if (!is_clip) {
    ${GraphicsPathCommand.GRADIENT(
        type, colors, matrix, spread_method, 
        interpolation_method, focal_point_ratio
    )}
    ctx.strokeStyle = css;
    ctx.lineWidth = ${thickness};
    ctx.lineCap = "${caps}";
    ctx.lineJoin = "${joints}";
    ctx.miterLimit = ${miter_limit};
    ctx.stroke();
}`;
    }

    /**
     * @param {BitmapData} width
     * @param {BitmapData} height
     * @param {array}      buffer
     * @param {array}      matrix
     * @param {string}     [repeat="repeat"]
     * @param {boolean}    [smooth=false]
     * @constructor
     */
    static BITMAP_FILL (
        width, height, buffer, matrix,
        repeat = "repeat", smooth = false
    ) {
        return `
if (options) {
    if (ctx.isPointInPath(options.x, options.y)) {
        return true;
    }
    if ("isPointInStroke" in ctx && ctx.isPointInStroke(options.x, options.y)) {
        return true;
    }
    return false;
}
if (!is_clip) {
    ctx.save();
    const texture = ctx.frameBuffer.createTextureFromPixels(${width}, ${height}, new Uint8Array([${buffer.toString()}]));
    ctx.fillStyle = ctx.createPattern(texture, "${repeat}", ct);
    ctx.transform(${matrix[0]},${matrix[1]},${matrix[2]},${matrix[3]},${matrix[4]},${matrix[5]});
    ctx._$imageSmoothingEnabled = ${smooth};
    ctx.fill();
    ctx.restore();
    ctx._$imageSmoothingEnabled = false;
    ctx.frameBuffer.releaseTexture(texture);
}`;
    }
}
