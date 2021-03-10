/**
 * @class
 */
class CanvasToWebGLContextMask
{
    /**
     * @constructor
     */
    constructor (context, gl)
    {
        this._$context       = context;
        this._$gl            = gl;

        this._$clips         = [];
        this._$clipStatus    = false;
        this._$containerClip = false;
        this._$poolClip      = [];
        this._$currentClip   = false;
    }

    _$onClear (mask)
    {
        if (mask) {
            this._$gl.enable(this._$gl.STENCIL_TEST);
            this._$currentClip = true;
        }
    }

    _$onBind (mask)
    {
        if (!mask && this._$currentClip) {
            // キャッシュ作成前は、一旦マスクを無効にする
            this._$gl.disable(this._$gl.STENCIL_TEST);
            this._$currentClip = false;
        } else if (mask && !this._$currentClip) {
            // キャッシュ作成後は、マスクの状態を復元する
            this._$gl.enable(this._$gl.STENCIL_TEST);
            this._$currentClip = true;
            this._$endClipDef();
        }
    }

    _$onClearRect ()
    {
        this._$gl.disable(this._$gl.STENCIL_TEST);
        this._$currentClip = false;
    }

    /**
     * @private
     */
    _$endClip ()
    {
        const manager = this._$context._$frameBufferManager;

        const texture = manager.getTextureFromCurrentAttachment();
        const currentBuffer = manager.currentAttachment;

        this._$context._$bind(this._$context._$cacheCurrentBuffer);
        this._$context._$cacheCurrentBuffer = null;

        // blend off
        this._$context._$blend.disable();

        const x = this._$context._$cacheCurrentBounds.x;
        const y = this._$context._$cacheCurrentBounds.y;
        const w = this._$context._$cacheCurrentBounds.w;
        const h = this._$context._$cacheCurrentBounds.h;


        Util.$resetContext(this._$context);
        this._$context.setTransform(1, 0, 0, 1, 0, 0);
        this._$context.drawImage(texture, x, y, w, h);

        // blend restart
        this._$context._$blend.enable();

        manager.releaseAttachment(currentBuffer, true);
    }

    /**
     * @param  {DisplayObject} display_object
     * @param  {Float64Array} matrix
     * @return {Float64Array}
     * @public
     */
    _$startClip (display_object, matrix)
    {

        const tMatrix = Util.$multiplicationMatrix(
            matrix,
            display_object._$transform._$rawMatrix()
        );


        const baseBounds = display_object._$getBounds(null);
        const bounds = Util.$boundsMatrix(baseBounds, tMatrix);
        Util.$poolMatrixArray(tMatrix);
        Util.$poolBoundsObject(baseBounds);

        // size
        let x      = bounds.xMin;
        let y      = bounds.yMin;
        let width  = Util.$abs(bounds.xMax - bounds.xMin);
        let height = Util.$abs(bounds.yMax - bounds.yMin);
        Util.$poolBoundsObject(bounds);

        // resize
        const manager = this._$context._$frameBufferManager;
        const currentBuffer = manager.currentAttachment;
        if ((width + x) > currentBuffer.texture.width) {
            width -= width - currentBuffer.texture.width + x;
        }

        if ((height + y) > currentBuffer.texture.height) {
            height -= height - currentBuffer.texture.height + y;
        }

        if (0 > x) {
            width += x;
            x = 0;
        }

        if (0 > y) {
            height += y;
            y = 0;
        }

        if (0 >= width || 0 >= height) {
            return null;
        }

        width  = Util.$ceil(width);
        height = Util.$ceil(height);

        // set bounds
        this._$context._$cacheCurrentBounds.x = x;
        this._$context._$cacheCurrentBounds.y = y;
        this._$context._$cacheCurrentBounds.w = width;
        this._$context._$cacheCurrentBounds.h = height;


        // cache
        const texture = manager.getTextureFromCurrentAttachment();

        this._$context._$cacheCurrentBuffer = currentBuffer;

        const player = Util.$currentPlayer();

        const samples = (this._$context._$isWebGL2Context
            && (player._$quality === StageQuality.LOW || player._$quality === StageQuality.MIDDLE))
            ? Util.$min(Util.$HIGH_SAMPLES, this._$gl.getParameter(this._$gl.MAX_SAMPLES))
            : 0;

        // create new buffer
        const buffer = manager
            .createCacheAttachment(width, height, true, samples);
        this._$context._$bind(buffer);

        // draw background
        Util.$resetContext(this._$context);
        this._$context.setTransform(1, 0, 0, 1, 0, 0);
        this._$context.drawImage(texture, -x, -y, texture.width, texture.height);


        return Util.$getMatrixArray(
            matrix[0], matrix[1], matrix[2], matrix[3],
            matrix[4] - x,
            matrix[5] - y
        );
    }

    /**
     * @return void
     * @public
     */
    _$enterClip ()
    {
        if (!this._$currentClip) {
            this._$gl.enable(this._$gl.STENCIL_TEST);
            this._$currentClip = true;
        }

        // buffer mask on
        const currentBuffer = this._$context._$frameBufferManager.currentAttachment;
        currentBuffer.mask  = true;
        ++currentBuffer.clipLevel;
    }

    /**
     * @return void
     * @public
     */
    _$beginClipDef ()
    {
        const currentBuffer = this._$context._$frameBufferManager.currentAttachment;

        this._$gl.enable(this._$gl.SAMPLE_ALPHA_TO_COVERAGE);
        this._$gl.stencilFunc(this._$gl.ALWAYS, 0, 0xff);
        this._$gl.stencilOp(this._$gl.KEEP, this._$gl.INVERT, this._$gl.INVERT);
        this._$gl.stencilMask(1 << (currentBuffer.clipLevel - 1));
        this._$gl.colorMask(false, false, false, false);
    }

    /**
     * @return void
     * @public
     */
    _$endClipDef ()
    {
        const currentBuffer = this._$context._$frameBufferManager.currentAttachment;
        const clipLevel = currentBuffer.clipLevel;

        let mask = 0;
        for (let idx = 0; idx < clipLevel; ++idx) {
            mask |= ((1 << (clipLevel - idx)) - 1);
        }

        this._$gl.disable(this._$gl.SAMPLE_ALPHA_TO_COVERAGE);
        this._$gl.stencilFunc(this._$gl.EQUAL, mask & 0xff, mask);
        this._$gl.stencilOp(this._$gl.KEEP, this._$gl.KEEP, this._$gl.KEEP);
        this._$gl.stencilMask(0xff);
        this._$gl.colorMask(true, true, true, true);
    }

    /**
     * @return void
     * @public
     */
    _$leaveClip ()
    {
        const currentBuffer = this._$context._$frameBufferManager.currentAttachment;
        --currentBuffer.clipLevel;
        currentBuffer.mask = Util.$toBoolean(currentBuffer.clipLevel);

        // end clip
        if (!currentBuffer.clipLevel) {
            this._$context._$clearRectStencil(0, 0, currentBuffer.width, currentBuffer.height);
            if (this._$context._$cacheCurrentBuffer) {
                this._$endClip();
            }
            return;
        }


        // replace
        const w = currentBuffer.width;
        const h = currentBuffer.height;

        // create buffer
        const vertices = this._$context._$path.createRectVertices(0, 0, w, h);
        const object = this._$context._$vao.createFill(vertices);
        Util.$poolArray(vertices.pop());
        Util.$poolArray(vertices);

        const variants = this._$context._$shaderList.shapeShaderVariants;
        const shader = variants.getMaskShapeShader(false, false);
        const uniform = shader.uniform;
        variants.setMaskShapeUniformIdentity(uniform, w, h);

        const range = object.indexRanges[0];

        // deny
        if (!this._$currentClip) {
            this._$currentClip = true;
            this._$gl.enable(this._$gl.STENCIL_TEST);
        }

        this._$gl.enable(this._$gl.SAMPLE_ALPHA_TO_COVERAGE);
        this._$gl.stencilFunc(this._$gl.ALWAYS, 0, 0xff);
        this._$gl.stencilOp(this._$gl.REPLACE, this._$gl.REPLACE, this._$gl.REPLACE);
        this._$gl.stencilMask(1 << currentBuffer.clipLevel);
        this._$gl.colorMask(false, false, false, false);

        shader._$containerClip(object, range.first, range.count);

        // object pool
        this._$context._$vao.release(object);
        Util.$poolArray(object.indexRanges);

        this._$context._$endClipDef();
    }

    /**
     * @return void
     * @public
     */
    _$drawContainerClip ()
    {
        const currentBuffer = this._$context._$frameBufferManager.currentAttachment;
        const currentClipLevel = currentBuffer.clipLevel;

        const length = this._$poolClip.length;
        const variants = this._$context._$shaderList.shapeShaderVariants;
        const shader = variants.getMaskShapeShader(false, false);
        const uniform = shader.uniform;

        let useLevel = currentClipLevel;

        // create buffer
        const w = currentBuffer.width;
        const h = currentBuffer.height;

        this._$gl.enable(this._$gl.SAMPLE_ALPHA_TO_COVERAGE);
        this._$gl.stencilFunc(this._$gl.ALWAYS, 0, 0xff);
        this._$gl.stencilOp(this._$gl.KEEP, this._$gl.INVERT, this._$gl.INVERT);
        this._$gl.colorMask(false, false, false, false);
        for (let idx = 0; idx < length; ++idx) {

            const object = this._$poolClip.shift(); // fixed

            variants.setMaskShapeUniform(
                uniform, false,
                object.matrixA, object.matrixB, object.matrixC,
                object.matrixD, object.matrixE, object.matrixF,
                object.matrixG, object.matrixH, object.matrixI,
                object.viewportWidth, object.viewportHeight, null
            );

            const oLen = object.fillBuffer.indexRanges.length;
            for (let idx = 0; idx < oLen; ++idx) {

                const range = object.fillBuffer.indexRanges[idx];

                this._$gl.stencilMask(1 << (useLevel - 1));
                shader._$containerClip(object.fillBuffer, range.first, range.count);

            }

            ++useLevel;

            // union
            if (useLevel > 7) {

                // union
                this._$context._$unionStencilMask(currentClipLevel, w, h);

                // reset
                useLevel = currentClipLevel;

            }

        }

        // last union
        if (useLevel > (currentClipLevel + 1)) {
            this._$context._$unionStencilMask(currentClipLevel, w, h);
        }
    };

    /**
     * @param  {uint} level
     * @param  {uint} w
     * @param  {uint} h
     * @return void
     * @private
     */
    _$unionStencilMask (level, w, h)
    {
        // create buffer
        const vertices = this._$context._$path.createRectVertices(0, 0, w, h);
        const object = this._$context._$vao.createFill(vertices);
        Util.$poolArray(vertices.pop());
        Util.$poolArray(vertices);

        const variants = this._$context._$shaderList.shapeShaderVariants;
        const shader = variants.getMaskShapeShader(false, false);
        const uniform = shader.uniform;
        variants.setMaskShapeUniformIdentity(uniform, w, h);

        const range = object.indexRanges[0];


        // 例として level=4 の場合
        //
        // ステンシルバッファの4ビット目以上を4ビット目に統合する。
        //   |?|?|?|?|?|*|*|*|  ->  | | | | |?|*|*|*|
        //
        // このとき、4ビット目以上に1のビットが1つでもあれば4ビット目を1、
        // そうでなければ4ビット目を0とする。
        //
        //   00000***  ->  00000***
        //   00001***  ->  00001***
        //   00010***  ->  00001***
        //   00011***  ->  00001***
        //   00100***  ->  00001***
        //    ...
        //   11101***  ->  00001***
        //   11110***  ->  00001***
        //   11111***  ->  00001***
        //
        // したがってステンシルの現在の値を 00001000 と比較すればよい。
        // 比較して 00001000 以上であれば 00001*** で更新し、そうでなければ 00000*** で更新する。
        // 下位3ビットは元の値を保持する必要があるので 11111000 でマスクする。

        this._$gl.stencilFunc(this._$gl.LEQUAL, 1 << (level - 1), 0xff);
        this._$gl.stencilOp(this._$gl.ZERO, this._$gl.REPLACE, this._$gl.REPLACE);
        this._$gl.stencilMask(~((1 << (level - 1)) - 1));

        shader._$containerClip(object, range.first, range.count);

        // reset
        if (this._$poolClip.length) {
            this._$gl.stencilFunc(this._$gl.ALWAYS, 0, 0xff);
            this._$gl.stencilOp(this._$gl.KEEP, this._$gl.INVERT, this._$gl.INVERT);
        }

        // object pool
        this._$context._$vao.release(object);
        Util.$poolArray(object.indexRanges);

    }

    /**
     * @return {boolean}
     */
    _$onClip (matrix, viewportWidth, viewportHeight)
    {
        this._$clipStatus = true;

        if (this._$containerClip) {

            this._$poolClip[this._$poolClip.length] = {
                "fillBuffer": this._$context._$fillBuffer,
                "matrixA": matrix[0],
                "matrixB": matrix[1],
                "matrixC": matrix[2],
                "matrixD": matrix[3],
                "matrixE": matrix[4],
                "matrixF": matrix[5],
                "matrixG": matrix[6],
                "matrixH": matrix[7],
                "matrixI": matrix[8],
                "viewportWidth": viewportWidth,
                "viewportHeight": viewportHeight
            };

            return true;
        }

        return false;
    }

    /**
     * @return void
     * @public
     */
    _$onSave ()
    {
        this._$clips[this._$clips.length] = this._$clipStatus;
    }

    /**
     * @return void
     * @public
     */
    _$onRestore ()
    {
        if (this._$clips.length) {
            this._$clipStatus = Util.$toBoolean(this._$clips.pop());
        }
    }
}
