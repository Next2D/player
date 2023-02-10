/**
 * @class
 */
class Renderer
{
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