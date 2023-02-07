/**
 * @class
 */
class Renderer
{
    /**
     * @description Videoの描画
     *
     * @param {next2d.media.Video} video
     * @param {Float32Array} matrix
     * @param {Float32Array} color_transform
     * @param {number} width
     * @param {number} height
     * @param {number} alpha
     * @param {string} blend_mode
     * @param {array} [filters=null]
     * @return {void}
     * @method
     * @public
     */
    drawVideo (
        video, matrix, color_transform, width, height,
        alpha, blend_mode, filters = null
    ) {
        if (this._$worker) {

            video._$context.drawImage(video._$video, 0, 0);

            const imageBitmap = video
                ._$context
                .canvas
                .transferToImageBitmap();

            const options = Util.$getArray(imageBitmap);

            const message = {
                "command": "drawVideo",
                "smoothing": video._$smoothing,
                "imageBitmap": imageBitmap
            };

            if (alpha !== 1) {
                message.alpha = alpha;
            }

            if (matrix[0] !== 1 || matrix[1] !== 0
                || matrix[2] !== 0 || matrix[3] !== 1
                || matrix[4] !== 0 || matrix[5] !== 0
            ) {
                message.matrix = matrix.slice();
                options.push(message.matrix.buffer);
            }

            if (color_transform[0] !== 1 || color_transform[1] !== 1
                || color_transform[2] !== 1 || color_transform[3] !== 1
                || color_transform[4] !== 0 || color_transform[5] !== 0
                || color_transform[6] !== 0 || color_transform[7] !== 0
            ) {
                message.colorTransform = color_transform.slice();
                options.push(message.colorTransform.buffer);
            }

            if (filters && filters.length
                && video._$canApply(filters)
            ) {

                const parameters = Util.$getArray();
                for (let idx = 0; idx < filters.length; ++idx) {
                    parameters.push(filters[idx]._$toArray());
                }

                message.isFilter   = true;
                message.baseBounds = video._$bounds;
                message.width      = width;
                message.height     = height;
                message.filters    = parameters;
            }

            if (blend_mode !== BlendMode.NORMAL) {
                message.blendMode = blend_mode;
            }

            this._$worker.postMessage(message, [imageBitmap]);

            Util.$poolArray(options);

        } else {

            const context = this._$context;
            if (!context) {
                return ;
            }

            const manager = context._$frameBufferManager;

            let texture = manager.createTextureFromVideo(
                video._$video, video._$smoothing
            );

            if (filters && filters.length
                && video._$canApply(filters)
            ) {

                // draw filter
                texture = video._$drawFilter(
                    context, texture, matrix,
                    filters, width, height
                );

                // reset
                Util.$resetContext(context);

                // draw
                context._$globalAlpha = alpha;
                context._$imageSmoothingEnabled = video._$smoothing;
                context._$globalCompositeOperation = blend_mode;

                // size
                const bounds = Util.$boundsMatrix(video._$bounds, matrix);
                context.setTransform(1, 0, 0, 1,
                    bounds.xMin - texture._$offsetX,
                    bounds.yMin - texture._$offsetY
                );
                context.drawImage(texture,
                    0, 0, texture.width, texture.height,
                    color_transform
                );

                // pool
                Util.$poolBoundsObject(bounds);

            } else {

                // reset
                Util.$resetContext(context);

                // draw
                context._$globalAlpha = alpha;
                context._$imageSmoothingEnabled = video._$smoothing;
                context._$globalCompositeOperation = blend_mode;

                context.setTransform(
                    matrix[0], matrix[1], matrix[2],
                    matrix[3], matrix[4], matrix[5]
                );

                context.drawImage(
                    texture, 0, 0,
                    texture.width, texture.height, color_transform
                );
            }

            manager.releaseTexture(texture);
        }
    }

    /**
     * @description テキストを描画
     *
     * @return {void}
     * @method
     * @public
     */
    drawText (text_field,
        cache_keys, base_bounds, width, height, x_scale, y_scale,
        matrix, color_transform, filters, alpha, blend_mode,
        x_min, y_min
    ) {

        if (this._$worker) {

            const options = Util.$getArray();

            const message = {
                "command": "drawText",
                "instanceId": text_field._$instanceId,
                "textData": text_field._$getTextData(),
                "cacheKeys": cache_keys,
                "baseBounds": base_bounds,
                "updated": text_field._$renew || text_field._$isUpdated(),
                "xMin": x_min,
                "yMin": y_min,
                "xScale": x_scale,
                "yScale": y_scale,
                "scrollV": text_field.scrollV,
                "widthTable": text_field._$widthTable,
                "heightTable": text_field._$heightTable,
                "textHeightTable": text_field._$textHeightTable,
                "objectTable": text_field._$objectTable,
                "limitWidth": text_field.width,
                "limitHeight": text_field.height,
                "textHeight": text_field.textHeight,
                "verticalAlign": text_field._$verticalAlign,
                "autoSize": text_field._$autoSize,
                "useCache": Util.$useCache,
                "isSafari": Util.$isSafari
            };

            if (text_field._$thickness) {
                message.thickness = text_field._$thickness;
                message.thicknessColor = text_field._$thicknessColor;
            }

            if (text_field._$background) {
                message.background = text_field._$background;
                message.backgroundColor = text_field._$backgroundColor;
            }

            if (text_field._$border) {
                message.border = text_field._$border;
                message.borderColor = text_field._$borderColor;
            }

            if (alpha !== 1) {
                message.alpha = alpha;
            }

            if (matrix[0] !== 1 || matrix[1] !== 0
                || matrix[2] !== 0 || matrix[3] !== 1
                || matrix[4] !== 0 || matrix[5] !== 0
            ) {
                message.matrix = matrix.slice();
                options.push(message.matrix.buffer);
            }

            if (color_transform[0] !== 1 || color_transform[1] !== 1
                || color_transform[2] !== 1 || color_transform[3] !== 1
                || color_transform[4] !== 0 || color_transform[5] !== 0
                || color_transform[6] !== 0 || color_transform[7] !== 0
            ) {
                message.colorTransform = color_transform.slice();
                options.push(message.colorTransform.buffer);
            }

            if (filters && filters.length
                && text_field._$canApply(filters)
            ) {
                let updated = text_field._$isUpdated();
                if (!updated) {
                    for (let idx = 0; idx < filters.length; ++idx) {

                        if (!filters[idx]._$isUpdated()) {
                            continue;
                        }

                        updated = true;
                        break;
                    }
                }

                const parameters = Util.$getArray();
                for (let idx = 0; idx < filters.length; ++idx) {
                    parameters.push(filters[idx]._$toArray());
                }

                message.isFilter = true;
                message.width    = width;
                message.height   = height;
                message.updated  = updated;
                message.filters  = parameters;
            }

            if (blend_mode !== BlendMode.NORMAL) {
                message.blendMode = blend_mode;
            }

            this._$worker.postMessage(message, options);

            text_field._$renew = false;

        } else {

            const context = this._$context;
            if (!context) {
                return ;
            }

            const instanceId = text_field._$instanceId;

            const cacheStore = Util.$cacheStore();
            const cacheKeys  = cacheStore.generateKeys(
                instanceId, cache_keys
            );

            let texture = cacheStore.get(cacheKeys);

            // texture is small or renew
            if (text_field._$renew || text_field._$isUpdated()) {
                cacheStore.removeCache(instanceId);
                texture = null;
            }

            if (!texture) {

                // resize
                const lineWidth  = $Math.min(1, $Math.max(x_scale, y_scale));
                const baseWidth  = $Math.ceil($Math.abs(base_bounds.xMax - base_bounds.xMin) * x_scale);
                const baseHeight = $Math.ceil($Math.abs(base_bounds.yMax - base_bounds.yMin) * y_scale);

                text_field._$renew = false;

                // alpha reset
                color_transform[3] = 1;

                // new canvas
                const canvas  = cacheStore.getCanvas();
                canvas.width  = baseWidth  + lineWidth * 2;
                canvas.height = baseHeight + lineWidth * 2;
                const ctx     = canvas.getContext("2d");

                // border and background
                if (text_field._$background || text_field._$border) {

                    ctx.beginPath();
                    ctx.moveTo(0, 0);
                    ctx.lineTo(baseWidth, 0);
                    ctx.lineTo(baseWidth, baseHeight);
                    ctx.lineTo(0, baseHeight);
                    ctx.lineTo(0, 0);

                    if (text_field._$background) {

                        const rgb   = Util.$intToRGBA(text_field._$backgroundColor);
                        const alpha = $Math.max(0, $Math.min(
                            rgb.A * 255 * color_transform[3] + color_transform[7], 255)
                        ) / 255;

                        ctx.fillStyle = `rgba(${rgb.R},${rgb.G},${rgb.B},${alpha})`;
                        ctx.fill();
                    }

                    if (text_field._$border) {

                        const rgb   = Util.$intToRGBA(text_field._$borderColor);
                        const alpha = $Math.max(0, $Math.min(
                            rgb.A * 255 * color_transform[3] + color_transform[7], 255)
                        ) / 255;

                        ctx.lineWidth   = lineWidth;
                        ctx.strokeStyle = `rgba(${rgb.R},${rgb.G},${rgb.B},${alpha})`;
                        ctx.stroke();

                    }

                }

                // mask start
                ctx.save();
                ctx.beginPath();
                ctx.moveTo(2, 2);
                ctx.lineTo(baseWidth - 2, 2);
                ctx.lineTo(baseWidth - 2, baseHeight - 2);
                ctx.lineTo(2, baseHeight - 2);
                ctx.lineTo(2, 2);
                ctx.clip();

                ctx.beginPath();
                ctx.setTransform(x_scale, 0, 0, y_scale, 0, 0);
                text_field._$doDraw(ctx, matrix, color_transform, baseWidth / matrix[0]);
                ctx.restore();

                texture = context
                    .frameBuffer
                    .createTextureFromCanvas(ctx.canvas);

                // set cache
                if (Util.$useCache) {
                    cacheStore.set(cacheKeys, texture);
                }

                // destroy cache
                cacheStore.destroy(ctx);

            }

            let drawFilter = false;
            let offsetX = 0;
            let offsetY = 0;
            if (filters && filters.length
                && text_field._$canApply(filters)
            ) {

                drawFilter = true;

                texture = text_field._$drawFilter(
                    context, texture, matrix,
                    filters, width, height
                );

                offsetX = texture._$offsetX;
                offsetY = texture._$offsetY;
            }

            const radianX = drawFilter ? 0 : $Math.atan2(matrix[1], matrix[0]);
            const radianY = drawFilter ? 0 : $Math.atan2(-matrix[2], matrix[3]);
            if (radianX || radianY) {

                const tx = base_bounds.xMin * x_scale;
                const ty = base_bounds.yMin * y_scale;

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

                context.setTransform(1, 0, 0, 1,
                    x_min - offsetX, y_min - offsetY
                );

            }

            // reset
            Util.$resetContext(context);

            // draw
            context._$globalAlpha = alpha;
            context._$imageSmoothingEnabled = true;
            context._$globalCompositeOperation = blend_mode;

            context.drawImage(texture,
                0, 0, texture.width, texture.height, color_transform
            );
        }
    }

    /**
     * @description 指定したDisplayObjectをBitmapDataに転写
     *
     * @param  {BitmapData}        bitmap_data
     * @param  {DisplayObject}     source
     * @param  {Matrix}            [matrix=null]
     * @param  {ColorTransform}    [color_transform=null]
     * @param  {HTMLCanvasElement} [canvas=null]
     * @return {HTMLCanvasElement}
     * @method
     * @public
     */
    drawBitmapData (
        bitmap_data, source,
        matrix = null, color_transform = null, canvas = null
    ) {

        const width  = bitmap_data._$width;
        const height = bitmap_data._$height;

        const player = Util.$currentPlayer();
        const cacheWidth  = player._$canvas.width;
        const cacheHeight = player._$canvas.height;

        const resize = width > cacheWidth || height > cacheHeight;
        if (resize) {
            this.resize(width, height);
        }

        const colorTransform = color_transform
            ? color_transform._$colorTransform
            : Util.$COLOR_ARRAY_IDENTITY;

        let tMatrix = matrix
            ? matrix._$matrix
            : Util.$MATRIX_ARRAY_IDENTITY;

        // matrix invert
        let clone = null;
        if (matrix) {
            clone = source._$transform.matrix;
            clone.invert();

            tMatrix = Util.$multiplicationMatrix(
                tMatrix, clone._$matrix
            );
        }

        if (!canvas) {
            canvas = Util.$cacheStore().getCanvas();
        }

        // Util.$useCache = false;
        if (this._$worker) {

            this.begin(this._$width, this._$height);
            source._$draw(this, tMatrix, colorTransform);

            // canvas = document.createElement("canvas");
            canvas.width  = width;
            canvas.height = height;
            const offscreenCanvas = canvas.transferControlToOffscreen();

            this._$worker.postMessage({
                "command": "drawBitmapData",
                "canvas": offscreenCanvas,
                "width": width,
                "height": height
            }, [offscreenCanvas]);

            // this._$canvases.push(canvas);

        } else {

            const context = this._$context;
            if (!context) {
                return ;
            }

            const manager = context._$frameBufferManager;

            const currentAttachment = manager.currentAttachment;

            this.begin(this._$width, this._$height);
            source._$draw(this, tMatrix, colorTransform);

            const texture = manager
                .getTextureFromCurrentAttachment();

            // reset and draw to main canvas
            manager.unbind();

            Util.$resetContext(context);
            context.setTransform(1, 0, 0, 1, 0, 0);
            context.clearRect(0, 0, texture.width, texture.height);
            context.drawImage(texture, 0, 0, texture.width, texture.height);

            canvas.width  = width;
            canvas.height = height;

            const ctx = canvas.getContext("2d");
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, width, height);
            ctx.drawImage(player._$canvas, 0, 0);

            if (currentAttachment) {
                context._$bind(currentAttachment);
            }
        }

        // reset
        // Util.$useCache = true;

        return canvas;
    }
}