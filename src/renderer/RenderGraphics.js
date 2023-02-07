/**
 * @class
 */
class RenderGraphics extends RenderDisplayObject
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super();

        /**
         * @type {Float32Array}
         * @default null
         * @private
         */
        this._$recodes = null;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$maxAlpha = 0;

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$canDraw = false;
    }

    /**
     * @description strokeのセットアップ
     *
     * @param  {CanvasToWebGLContext|CanvasRenderingContext2D} context
     * @param  {number} line_width
     * @param  {number} line_cap
     * @param  {number} line_join
     * @param  {number} miter_limit
     * @return {void}
     * @method
     * @public
     */
    setupStroke (context, line_width, line_cap, line_join, miter_limit)
    {
        context.lineWidth = line_width;

        switch (line_cap) {

            case 0:
                context.lineCap = CapsStyle.NONE;
                break;

            case 1:
                context.lineCap = CapsStyle.ROUND;
                break;

            case 2:
                context.lineCap = CapsStyle.SQUARE;
                break;

        }

        switch (line_join) {

            case 0:
                context.lineJoin = JointStyle.BEVEL;
                break;

            case 1:
                context.lineJoin = JointStyle.MITER;
                break;

            case 2:
                context.lineJoin = JointStyle.ROUND;
                break;

        }

        context.miterLimit = miter_limit;
    }

    /**
     * @description CanvasGradientToWebGLオブジェクトを生成
     *
     * @param  {CanvasToWebGLContext|CanvasRenderingContext2D} context
     * @param  {number} type
     * @param  {array} stops
     * @param  {Float32Array} matrix
     * @param  {number} spread
     * @param  {number} interpolation
     * @param  {number} focal
     * @param  {Float32Array} [color_transform=null]
     * @return {CanvasGradientToWebGL}
     * @method
     * @public
     */
    createGradientStyle (
        context, type, stops, matrix,
        spread, interpolation, focal,
        color_transform = null
    ) {

        let spreadMethod = "pad";
        switch (spread) {

            case 0:// REFLECT
                spreadMethod = "reflect";
                break;

            case 1: // REPEAT
                spreadMethod = "repeat";
                break;

        }

        let css = null;
        if (type === 0) {

            // LINEAR
            const xy = Util.$linearGradientXY(matrix);
            css = context.createLinearGradient(
                xy[0], xy[1], xy[2], xy[3],
                interpolation ? "rgb" : "linearRGB",
                spreadMethod
            );

        } else {

            // RADIAL
            context.save();
            context.transform(
                matrix[0], matrix[1], matrix[2],
                matrix[3], matrix[4], matrix[5]
            );

            css = context.createRadialGradient(
                0, 0, 0, 0, 0, 819.2,
                interpolation ? "rgb" : "linearRGB",
                spreadMethod, focal
            );

        }

        for (let idx = 0; idx < stops.length; ++idx) {

            const color = stops[idx];

            if (!color_transform) {

                css.addColorStop(color.ratio,
                    Util.$getFloat32Array4(
                        $Math.max(0, $Math.min(color.R, 255)),
                        $Math.max(0, $Math.min(color.G, 255)),
                        $Math.max(0, $Math.min(color.B, 255)),
                        $Math.max(0, $Math.min(color.A, 255))
                    )
                );

            } else {

                css.addColorStop(color.ratio, Util.$getFloat32Array4(
                    $Math.max(0, $Math.min(color.R * color_transform[0] + color_transform[4], 255)),
                    $Math.max(0, $Math.min(color.G * color_transform[1] + color_transform[5], 255)),
                    $Math.max(0, $Math.min(color.B * color_transform[2] + color_transform[6], 255)),
                    $Math.max(0, $Math.min(color.A * color_transform[3] + color_transform[7], 255))
                ));

            }
        }

        return css;
    }

    /**
     * @description Graphicsクラスの描画を実行
     *              Execute drawing in the Graphics class
     *
     * @param  {CanvasToWebGLContext|CanvasRenderingContext2D} context
     * @param  {Float32Array} recodes
     * @param  {Float32Array} [color_transform=null]
     * @param  {boolean} [is_clip=false]
     * @return {void}
     * @method
     * @public
     */
    _$runCommand (context, recodes, color_transform = null, is_clip = false)
    {
        // reset
        Util.$resetContext(context);
        context.beginPath();

        const length = recodes.length;
        for (let idx = 0; idx < length; ) {

            switch (recodes[idx++]) {

                case 9: // BEGIN_PATH
                    context.beginPath();
                    break;

                case 0: // MOVE_TO
                    context.moveTo(recodes[idx++], recodes[idx++]);
                    break;

                case 2: // LINE_TO
                    context.lineTo(recodes[idx++], recodes[idx++]);
                    break;

                case 1: // CURVE_TO
                    context.quadraticCurveTo(
                        recodes[idx++], recodes[idx++],
                        recodes[idx++], recodes[idx++]
                    );
                    break;

                case 5: // FILL_STYLE
                    {
                        if (is_clip) {
                            idx += 4;
                            continue;
                        }

                        const fillStyle = context._$contextStyle;

                        fillStyle._$fillStyle[0] = recodes[idx++] / 255;
                        fillStyle._$fillStyle[1] = recodes[idx++] / 255;
                        fillStyle._$fillStyle[2] = recodes[idx++] / 255;

                        fillStyle._$fillStyle[3] = !color_transform || color_transform[3] === 1 && color_transform[7] === 0
                            ? recodes[idx++] / 255
                            : $Math.max(0, $Math.min(
                                recodes[idx++] * color_transform[3] + color_transform[7], 255)
                            ) / 255;

                        context._$style = fillStyle;
                    }
                    break;

                case 7: // END_FILL

                    if (!is_clip) {
                        context.fill();
                    }

                    break;

                case 6: // STROKE_STYLE
                    {
                        if (is_clip) {
                            idx += 8;
                            continue;
                        }

                        this.setupStroke(
                            context,
                            recodes[idx++], recodes[idx++],
                            recodes[idx++], recodes[idx++]
                        );

                        const strokeStyle = context._$contextStyle;

                        strokeStyle._$strokeStyle[0] = recodes[idx++] / 255;
                        strokeStyle._$strokeStyle[1] = recodes[idx++] / 255;
                        strokeStyle._$strokeStyle[2] = recodes[idx++] / 255;

                        strokeStyle._$strokeStyle[3] = !color_transform || color_transform[3] === 1 && color_transform[7] === 0
                            ? recodes[idx++] / 255
                            : $Math.max(0, $Math.min(
                                recodes[idx++] * color_transform[3] + color_transform[7], 255)
                            ) / 255;

                        context._$style = strokeStyle;
                    }
                    break;

                case 8: // END_STROKE
                    if (!is_clip) {
                        context.stroke();
                    }
                    break;

                case 12: // CLOSE_PATH
                    context.closePath();
                    break;

                case 3: // CUBIC
                    context.bezierCurveTo(
                        recodes[idx++], recodes[idx++],
                        recodes[idx++], recodes[idx++],
                        recodes[idx++], recodes[idx++]
                    );
                    break;

                case 4: // ARC
                    context.arc(
                        recodes[idx++], recodes[idx++], recodes[idx++],
                        0, 2 * $Math.PI
                    );
                    break;

                case 10: // GRADIENT_FILL
                    {
                        if (is_clip) {
                            idx += 1;
                            const length = recodes[idx++];
                            idx += length * 5;
                            idx += 9;
                            continue;
                        }

                        const type = recodes[idx++];

                        let stopLength = recodes[idx++];

                        const stops = Util.$getArray();
                        while (stopLength) {
                            stops.push({
                                "ratio": recodes[idx++],
                                "R": recodes[idx++],
                                "G": recodes[idx++],
                                "B": recodes[idx++],
                                "A": recodes[idx++]
                            });
                            stopLength--;
                        }

                        const matrix = Util.$getFloat32Array6(
                            recodes[idx++], recodes[idx++], recodes[idx++],
                            recodes[idx++], recodes[idx++], recodes[idx++]
                        );

                        context.fillStyle = this.createGradientStyle(
                            context, type, stops, matrix,
                            recodes[idx++], recodes[idx++], recodes[idx++],
                            color_transform
                        );

                        context.fill();

                        // if RADIAL
                        if (type === 1) {
                            context.restore();
                        }

                        Util.$poolFloat32Array6(matrix);
                        Util.$poolArray(stops);
                    }
                    break;

                case 11: // GRADIENT_STROKE
                    {
                        if (is_clip) {
                            idx += 5;
                            const length = recodes[idx++];
                            idx += length * 5;
                            idx += 9;
                            continue;
                        }

                        this.setupStroke(
                            context,
                            recodes[idx++], recodes[idx++],
                            recodes[idx++], recodes[idx++]
                        );

                        const type = recodes[idx++];

                        let stopLength = recodes[idx++];

                        const stops = Util.$getArray();
                        while (stopLength) {
                            stops.push({
                                "ratio": recodes[idx++],
                                "R": recodes[idx++],
                                "G": recodes[idx++],
                                "B": recodes[idx++],
                                "A": recodes[idx++]
                            });
                            stopLength--;
                        }

                        const matrix = Util.$getFloat32Array6(
                            recodes[idx++], recodes[idx++], recodes[idx++],
                            recodes[idx++], recodes[idx++], recodes[idx++]
                        );

                        context.strokeStyle = this.createGradientStyle(
                            context, type, stops, matrix,
                            recodes[idx++], recodes[idx++], recodes[idx++],
                            color_transform
                        );

                        context.stroke();

                        // if RADIAL
                        if (type === 1) {
                            context.restore();
                        }

                        Util.$poolFloat32Array6(matrix);
                        Util.$poolArray(stops);
                    }
                    break;

                case 13: // BITMAP_FILL
                    {
                        const width  = recodes[idx++];
                        const height = recodes[idx++];
                        const graphicsWidth  = recodes[idx++];
                        const graphicsHeight = recodes[idx++];
                        const bitmapLength = recodes[idx++];
                        if (is_clip) {
                            idx += bitmapLength;
                            idx += 8;
                            continue;
                        }

                        const buffer = new Uint8Array(
                            recodes.subarray(idx, bitmapLength + idx)
                        );

                        idx += bitmapLength;
                        const matrix = Util.$getFloat32Array6(
                            recodes[idx++], recodes[idx++], recodes[idx++],
                            recodes[idx++], recodes[idx++], recodes[idx++]
                        );

                        const repeat = recodes[idx++] ? "repeat" : "no-repeat";
                        const smooth = !!recodes[idx++];

                        context.save();

                        if (matrix[0] !== 1 || matrix[1] !== 0
                            || matrix[2] !== 0 || matrix[3] !== 1
                            || matrix[4] !== 0 || matrix[5] !== 0
                        ) {
                            context.transform(
                                matrix[0], matrix[1], matrix[2],
                                matrix[3], matrix[4], matrix[5]
                            );
                        }
                        Util.$poolFloat32Array6(matrix);

                        const manager = context._$frameBufferManager;
                        const texture = manager.createTextureFromPixels(
                            width, height, buffer, true
                        );

                        if (repeat === "no-repeat"
                            && width  === graphicsWidth
                            && height === graphicsHeight
                        ) {

                            context.drawImage(texture, 0, 0, width, height);
                            manager.releaseTexture(texture);

                        } else {

                            context.fillStyle = context.createPattern(
                                texture, repeat, color_transform
                            );

                            context._$imageSmoothingEnabled = smooth;
                            context.fill();

                        }

                        // restore
                        context.restore();
                        context._$imageSmoothingEnabled = false;

                    }
                    break;

                case 14: // BITMAP_STROKE
                    {
                        if (is_clip) {
                            idx += 4;
                            const bitmapLength = recodes[idx++];
                            idx += bitmapLength;
                            idx += 8;
                            continue;
                        }

                        context.save();

                        this.setupStroke(
                            context,
                            recodes[idx++], recodes[idx++],
                            recodes[idx++], recodes[idx++]
                        );

                        const width  = recodes[idx++];
                        const height = recodes[idx++];
                        const bitmapLength = recodes[idx++];

                        const buffer = new Uint8Array(
                            recodes.subarray(idx, bitmapLength + idx)
                        );

                        idx += bitmapLength;
                        const matrix = Util.$getFloat32Array6(
                            recodes[idx++], recodes[idx++], recodes[idx++],
                            recodes[idx++], recodes[idx++], recodes[idx++]
                        );

                        if (matrix[0] !== 1 || matrix[1] !== 0
                            || matrix[2] !== 0 || matrix[3] !== 1
                            || matrix[4] !== 0 || matrix[5] !== 0
                        ) {
                            context.transform(
                                matrix[0], matrix[1], matrix[2],
                                matrix[3], matrix[4], matrix[5]
                            );
                        }
                        Util.$poolFloat32Array6(matrix);

                        const repeat = recodes[idx++] ? "repeat" : "no-repeat";
                        const smooth = !!recodes[idx++];

                        const manager = context._$frameBufferManager;
                        const texture = manager.createTextureFromPixels(
                            width, height, buffer, true
                        );

                        context.strokeStyle = context.createPattern(
                            texture, repeat, color_transform
                        );

                        context._$imageSmoothingEnabled = smooth;
                        context.stroke();

                        // restore
                        context.restore();
                        context._$imageSmoothingEnabled = false;
                    }
                    break;

                default:
                    break;

            }
        }
    }
}