let context = null;

/**
 * @class
 */
class CommandController
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        /**
         * @type {HTMLCanvasElement}
         * @default null
         * @private
         */
        this._$canvas = null;

        /**
         * @type {CanvasToWebGLContext}
         * @default null
         * @private
         */
        this._$context = null;

        /**
         * @type {object}
         * @default null
         * @private
         */
        this._$buffer = null;

        /**
         * @type {number}
         * @default 4
         * @private
         */
        this._$samples = 4;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$width = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$height = 0;

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$wait = false;

        /**
         * @type {CacheStore}
         * @private
         */
        this._$cacheStore = new CacheStore();
    }

    /**
     * @description アンチエイリアスのサンプル数
     *              Number of anti-aliasing samples
     *
     * @member {number}
     * @readonly
     * @public
     */
    get samples ()
    {
        return this._$samples;
    }
    set samples (samples)
    {
        this._$samples = samples;
    }

    /**
     * @description 初期起動関数、CanvasToWebGLContextを起動
     *              Initial startup function, CanvasToWebGLContext
     *
     * @param  {HTMLCanvasElement} canvas
     * @param  {number} [samples=4]
     * @return {void}
     * @method
     * @public
     */
    initialize (canvas, samples = 4)
    {
        // setup
        this._$canvas  = canvas
        this._$samples = samples;

        const option = {
            "stencil": true,
            "premultipliedAlpha": true,
            "antialias": false,
            "depth": false,
            "preserveDrawingBuffer": true
        };

        let gl = canvas.getContext("webgl2", option);
        if (!gl) {
            gl = canvas.getContext("webgl", option)
                || canvas.getContext("experimental-webgl", option);
        }

        this._$context = new CanvasToWebGLContext(gl, true, this.samples);
        this._$cacheStore._$context = this._$context;

        this._$maxTextureSize = $Math.min(8192,
            gl.getParameter(gl.MAX_TEXTURE_SIZE)
        ) - 2;

        globalThis.postMessage({
            "command": "initialize",
            "maxTextureSize": this._$maxTextureSize
        });
    }

    /**
     * @description 描画範囲をリサイズ
     *              Resize drawing area
     *
     * @param  {number} width
     * @param  {number} height
     * @return {void}
     * @method
     * @public
     */
    resize (width, height)
    {
        this._$canvas.width  = this._$width  = width;
        this._$canvas.height = this._$height = height;

        const context = this._$context;

        context._$gl.viewport(0, 0, width, height);

        const manager = context._$frameBufferManager;
        if (this._$buffer) {
            manager.unbind();
            manager.releaseAttachment(this._$buffer, true);
        }

        this._$buffer = manager
            .createCacheAttachment(width, height, false);

        // update cache max size
        manager._$stencilBufferPool._$maxWidth  = width;
        manager._$stencilBufferPool._$maxHeight = height;
        manager._$textureManager._$maxWidth     = width;
        manager._$textureManager._$maxHeight    = height;
        context._$pbo._$maxWidth                = width;
        context._$pbo._$maxHeight               = height;
    }

    /**
     * @description 描画の初期化
     *              Drawing initialization
     *
     * @return {void}
     * @method
     * @public
     */
    begin ()
    {
        const context = this._$context;

        context._$bind(this._$buffer);

        // reset
        Util.$resetContext(context);
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.clearRect(0, 0, this._$width, this._$height);
        context.beginPath();
    }

    /**
     * @description 表示用のcanvasを更新
     *              Update canvas for display
     *
     * @return {void}
     * @method
     * @public
     */
    updateMain ()
    {
        const context = this._$context;

        const manager = context._$frameBufferManager;
        const texture = manager.getTextureFromCurrentAttachment();

        manager.unbind();

        // reset and draw to main canvas
        Util.$resetContext(context);
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.clearRect(0, 0, this._$width, this._$height);
        context.drawImage(texture, 0, 0, this._$width, this._$height);

        // re bind
        context._$bind(this._$buffer);
    }

    /**
     * @description 表示用のcanvasを更新
     *              Update canvas for display
     *
     * @param  {string|number|null} [background_color=null]
     * @return {void}
     * @method
     * @public
     */
    setBackgroundColor (background_color)
    {
        if (!background_color
            || background_color === "transparent"
        ) {

            this._$context._$setColor(0, 0, 0, 0);

        } else {

            this._$context._$setColor(
                background_color[0],
                background_color[1],
                background_color[2],
                background_color[3]
            );

        }
    }

    /**
     * @description textureの最大描画可能サイズからリサイズの比率を算出して返す
     *              Calculate and return the resize ratio from the maximum drawable size of texture
     *
     * @param  {number} width
     * @param  {number} height
     * @return {number}
     * @method
     * @public
     */
    getTextureScale (width, height)
    {
        const maxSize = Math.max(width, height);
        if (maxSize > this._$maxTextureSize) {
            return this._$maxTextureSize / maxSize;
        }
        return 1;
    }

    /**
     * @description Graphicsクラスの描画処理を実行
     *
     * @param  {object} object
     * @return {void}
     * @method
     * @public
     */
    beginGraphics (object)
    {
        const context = this._$context;

        const matrix = object.matrix;
        const colorTransform = object.colorTransform;

        const baseBounds = object.baseBounds;
        const xScale = object.xScale;
        const yScale = object.yScale;

        let texture = this._$cacheStore.get(object.cacheKeys);
        if (!texture) {

            const manager = context._$frameBufferManager;
            const currentAttachment = manager.currentAttachment;

            // resize
            let width  = $Math.ceil($Math.abs(baseBounds.xMax - baseBounds.xMin) * xScale);
            let height = $Math.ceil($Math.abs(baseBounds.yMax - baseBounds.yMin) * yScale);
            const textureScale = this.getTextureScale(width, height);
            if (textureScale < 1) {
                width  *= textureScale;
                height *= textureScale;
            }

            // create cache buffer
            const buffer = manager
                .createCacheAttachment(width, height, true);
            context._$bind(buffer);

            Util.$resetContext(context);
            context.setTransform(
                xScale, 0, 0, yScale,
                -baseBounds.xMin * xScale,
                -baseBounds.yMin * yScale
            );

            if (object.hasGrid) {
                // TODO
            }

            // plain alpha
            if (colorTransform) {
                colorTransform[3] = 1;
            }

            // execute draw
            this.drawGraphics(object.recodes, colorTransform);

            texture = manager.getTextureFromCurrentAttachment();

            if (object.useCache) {
                this._$cacheStore.set(object.cacheKeys, texture);
            }

            // release buffer
            manager.releaseAttachment(buffer, false);

            // end draw and reset current buffer
            context._$bind(currentAttachment);
        }

        // reset
        Util.$resetContext(context);

        // draw setup
        context._$globalAlpha = object.alpha;
        context._$imageSmoothingEnabled = true;
        context._$globalCompositeOperation = object.blendMode
            ? object.blendMode
            : BlendMode.NORMAL;

        let radianX = 0;
        let radianY = 0;
        if (matrix) {
            radianX = $Math.atan2(matrix[1], matrix[0]);
            radianY = $Math.atan2(-matrix[2], matrix[3]);
        }

        if (radianX || radianY) {

            const tx = baseBounds.xMin * xScale;
            const ty = baseBounds.yMin * yScale;

            const cosX = $Math.cos(radianX);
            const sinX = $Math.sin(radianX);
            const cosY = $Math.cos(radianY);
            const sinY = $Math.sin(radianY);

            context.setTransform(
                cosX, sinX, -sinY, cosY,
                tx * cosX - ty * sinY + matrix[4],
                tx * sinX + ty * cosY + matrix[5]
            );

        } else {

            context.setTransform(1, 0, 0, 1, object.xMin, object.yMin);

        }

        context.drawImage(texture,
            0, 0, texture.width, texture.height, colorTransform
        );
    }

    /**
     * @description Graphicsクラスのマスク描画処理を実行
     *
     * @param  {Float32Array} recodes
     * @param  {Float32Array} matrix
     * @return {void}
     * @method
     * @public
     */
    clipGraphics (recodes, matrix)
    {
        const context = this._$context;

        Util.$resetContext(context);

        context.setTransform(
            matrix[0], matrix[1], matrix[2],
            matrix[3], matrix[4], matrix[5]
        );

        this.drawGraphics(recodes, null, true);

        context.clip();
    }

    /**
     * @description Graphicsクラスの描画を実行
     *              Execute drawing in the Graphics class
     *
     * @param  {Float32Array} recodes
     * @param  {Float32Array} [color_transform=null]
     * @param  {boolean} [is_clip=false]
     * @return {void}
     * @method
     * @public
     */
    drawGraphics (recodes, color_transform = null, is_clip = false)
    {
        const context = this._$context;

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

                        context.lineWidth  = recodes[idx++];
                        context.lineCap    = recodes[idx++];
                        context.lineJoin   = recodes[idx++];
                        context.miterLimit = recodes[idx++];

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
                            idx += 6;
                            continue;
                        }

                        const type          = recodes[idx++];
                        const stops         = recodes[idx++];
                        const matrix        = recodes[idx++];
                        const spread        = recodes[idx++];
                        const interpolation = recodes[idx++];
                        const focal         = recodes[idx++];

                        let css = null;
                        if (type === GradientType.LINEAR) {

                            const xy = Util.$linearGradientXY(matrix);
                            css = context.createLinearGradient(
                                xy[0], xy[1], xy[2], xy[3],
                                interpolation, spread
                            );

                        } else {

                            context.save();
                            context.transform(
                                matrix[0], matrix[1], matrix[2],
                                matrix[3], matrix[4], matrix[5]
                            );

                            css = context.createRadialGradient(
                                0, 0, 0, 0, 0, 819.2,
                                interpolation, spread, focal
                            );

                        }

                        const length = stops.length;
                        for (let idx = 0; idx < length; ++idx) {

                            const color = stops[idx];

                            css.addColorStop(color.ratio, Util.$getFloat32Array4(
                                $Math.max(0, $Math.min(color.R * color_transform[0] + color_transform[4], 255)) | 0,
                                $Math.max(0, $Math.min(color.G * color_transform[1] + color_transform[5], 255)) | 0,
                                $Math.max(0, $Math.min(color.B * color_transform[2] + color_transform[6], 255)) | 0,
                                $Math.max(0, $Math.min(color.A * color_transform[3] + color_transform[7], 255)) | 0
                            ));

                        }

                        context.fillStyle = css;
                        context.fill();

                        if (type === GradientType.RADIAL) {
                            context.restore();
                        }
                    }
                    break;

                case 11: // GRADIENT_STROKE
                    {
                        if (is_clip) {
                            idx += 12;
                            continue;
                        }

                        const lineWidth     = recodes[idx++];
                        const caps          = recodes[idx++];
                        const joints        = recodes[idx++];
                        const miterLimit    = recodes[idx++];
                        const type          = recodes[idx++];
                        const stops         = recodes[idx++];
                        const matrix        = recodes[idx++];
                        const spread        = recodes[idx++];
                        const interpolation = recodes[idx++];
                        const focal         = recodes[idx++];

                        let css = null;
                        if (type === GradientType.LINEAR) {

                            const xy = Util.$linearGradientXY(matrix);
                            css = context.createLinearGradient(
                                xy[0], xy[1], xy[2], xy[3],
                                interpolation, spread
                            );

                        } else {

                            context.save();
                            context.transform(
                                matrix[0], matrix[1], matrix[2],
                                matrix[3], matrix[4], matrix[5]
                            );

                            css = context.createRadialGradient(
                                0, 0, 0, 0, 0, 819.2,
                                interpolation, spread, focal
                            );

                        }

                        const length = stops.length;
                        for (let idx = 0; idx < length; ++idx) {

                            const color = stops[idx];

                            css.addColorStop(color.ratio, Util.$getFloat32Array4(
                                $Math.max(0, $Math.min(color.R * color_transform[0] + color_transform[4], 255)) | 0,
                                $Math.max(0, $Math.min(color.G * color_transform[1] + color_transform[5], 255)) | 0,
                                $Math.max(0, $Math.min(color.B * color_transform[2] + color_transform[6], 255)) | 0,
                                $Math.max(0, $Math.min(color.A * color_transform[3] + color_transform[7], 255)) | 0
                            ));

                        }

                        context.strokeStyle = css;
                        context.lineWidth   = lineWidth;
                        context.lineCap     = caps;
                        context.lineJoin    = joints;
                        context.miterLimit  = miterLimit;
                        context.stroke();

                        if (type === GradientType.RADIAL) {
                            context.restore();
                        }

                    }
                    break;

                case 13: // BITMAP_FILL
                    {
                        if (is_clip) {
                            idx += 6;
                            continue;
                        }

                        context.save();

                        const bitmapData = recodes[idx++];
                        const matrix     = recodes[idx++];
                        const repeat     = recodes[idx++];
                        const smooth     = recodes[idx++];

                        if (matrix) {
                            context.transform(
                                matrix[0], matrix[1], matrix[2],
                                matrix[3], matrix[4], matrix[5]
                            );
                        }

                        if (repeat === "no-repeat"
                            && bitmapData.width  === this._$xMax - this._$xMin
                            && bitmapData.height === this._$yMax - this._$yMin
                        ) {

                            context.drawImage(bitmapData._$texture,
                                0, 0, bitmapData.width, bitmapData.height
                            );

                        } else {

                            context.fillStyle = context.createPattern(
                                bitmapData._$texture, repeat, color_transform
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
                            idx += 9;
                            continue;
                        }

                        context.save();

                        const lineWidth  = recodes[idx++];
                        const caps       = recodes[idx++];
                        const joints     = recodes[idx++];
                        const miterLimit = recodes[idx++];
                        const bitmapData = recodes[idx++];
                        const matrix     = recodes[idx++];
                        const repeat     = recodes[idx++];
                        const smooth     = recodes[idx++];

                        if (matrix) {
                            context.transform(
                                matrix[0], matrix[1], matrix[2],
                                matrix[3], matrix[4], matrix[5]
                            );
                        }

                        context.lineWidth   = lineWidth;
                        context.lineCap     = caps;
                        context.lineJoin    = joints;
                        context.miterLimit  = miterLimit;
                        context.strokeStyle = context.createPattern(
                            bitmapData._$texture, repeat, color_transform
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

    /**
     * @description マスク処理の開始関数
     *              Mask processing start function
     *
     * @param  {number} x
     * @param  {number} y
     * @param  {number} width
     * @param  {number} height
     * @return {void}
     * @method
     * @public
     */
    startClip (x, y, width, height)
    {
        const context = this._$context;

        context._$cacheCurrentBounds.x = x;
        context._$cacheCurrentBounds.y = y;
        context._$cacheCurrentBounds.w = width;
        context._$cacheCurrentBounds.h = height;

        const manager = context._$frameBufferManager;
        const currentAttachment = manager.currentAttachment;

        context._$cacheCurrentBuffer = currentAttachment;
        const texture = currentAttachment.texture;

        // create new buffer
        context._$bind(
            manager.createCacheAttachment(width, height, true)
        );

        // draw background
        Util.$resetContext(context);
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.drawImage(texture, -x, -y, texture.width, texture.height);
    }

    /**
     * @description 処理を実行
     *              Execute process
     *
     * @return {void}
     * @method
     * @public
     */
    execute ()
    {
        state = "active";

        while (queue.length) {

            if (this._$wait) {
                continue;
            }

            const object = queue.shift();
            switch (object.command) {

                case "initialize":
                    this.initialize(object.canvas, object.samples);
                    break;

                case "resize":
                    this.resize(object.width, object.height);
                    break;

                case "begin":
                    this.begin();
                    break;

                case "updateMain":
                    this.updateMain();
                    break;

                case "setBackgroundColor":
                    this.setBackgroundColor(object.backgroundColor);
                    break;

                case "beginGraphics":
                    this.beginGraphics(object);
                    break;

                case "clipGraphics":
                    this.clipGraphics(
                        object.recodes, object.matrix
                    );
                    break;

                case "save":
                    this._$context.save();
                    break;

                case "restore":
                    this._$context.restore();
                    break;

                case "startClip":
                    this.startClip(
                        object.x, object.y,
                        object.width, object.height
                    );
                    break;

                case "enterClip":
                    this._$context._$enterClip();
                    break;

                case "leaveClip":
                    this._$context._$leaveClip();
                    break;

                case "beginClipDef":
                    this._$context._$beginClipDef();
                    break;

                case "endClipDef":
                    this._$context._$endClipDef();
                    break;

                case "updateContainerClipFlag":
                    this
                        ._$context
                        ._$mask
                        ._$containerClip = object.flag;
                    break;

                case "drawContainerClip":
                    this._$context._$drawContainerClip();
                    break;

                default:
                    break;

            }
        }

        state = "deactivate";
    }

}
const command = new CommandController();
const queue   = [];
let state     = "deactivate";

/**
 * @public
 */
this.addEventListener("message", function (event)
{
    queue.push(event.data);
    if (state === "deactivate") {
        command.execute();
    }
});