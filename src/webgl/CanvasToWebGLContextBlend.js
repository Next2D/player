/**
 * @class
 */
class CanvasToWebGLContextBlend
{
    /**
     * @constructor
     */
    constructor (context, gl)
    {
        this._$context  = context;
        this._$gl       = gl;
        this._$enabled  = false;
        this._$funcCode = 600;

        this.enable();
    }

    /**
     * @return void
     * @public
     */
    enable ()
    {
        if (!this._$enabled) {
            this._$enabled = true;
            this._$gl.enable(this._$gl.BLEND);
        }

        this.reset();
    }

    /**
     * @return void
     * @public
     */
    disable ()
    {
        if (this._$enabled) {
            this._$enabled = false;
            this._$gl.disable(this._$gl.BLEND);
        }
    }

    /**
     * @return void
     * @public
     */
    reset ()
    {
        if (this._$funcCode !== 613) {
            this._$funcCode = 613;
            this._$gl.blendFunc(this._$gl.ONE, this._$gl.ONE_MINUS_SRC_ALPHA);
        }
    }

    /**
     * @return void
     * @public
     */
    toOneZero ()
    {
        if (this._$funcCode !== 610) {
            this._$funcCode = 610;
            this._$gl.blendFunc(this._$gl.ONE, this._$gl.ZERO);
        }
    }

    /**
     * @return void
     * @public
     */
    toZeroOne ()
    {
        if (this._$funcCode !== 601) {
            this._$funcCode = 601;
            this._$gl.blendFuncSeparate(
                this._$gl.ZERO, this._$gl.ONE,
                this._$gl.ONE, this._$gl.ZERO
            );
        }
    }

    /**
     * @return void
     * @public
     */
    toAdd ()
    {
        if (this._$funcCode !== 611) {
            this._$funcCode = 611;
            this._$gl.blendFunc(this._$gl.ONE, this._$gl.ONE);
        }
    }

    /**
     * @return void
     * @public
     */
    toScreen ()
    {
        if (this._$funcCode !== 641) {
            this._$funcCode = 641;
            this._$gl.blendFunc(this._$gl.ONE_MINUS_DST_COLOR, this._$gl.ONE);
        }
    }

    /**
     * @return void
     * @public
     */
    toAlpha ()
    {
        if (this._$funcCode !== 606) {
            this._$funcCode = 606;
            this._$gl.blendFunc(this._$gl.ZERO, this._$gl.SRC_ALPHA);
        }
    }

    /**
     * @return void
     * @public
     */
    toErase ()
    {
        if (this._$funcCode !== 603) {
            this._$funcCode = 603;
            this._$gl.blendFunc(this._$gl.ZERO, this._$gl.ONE_MINUS_SRC_ALPHA);
        }
    }

    /**
     * @return void
     * @public
     */
    toSourceAtop ()
    {
        if (this._$funcCode !== 673) {
            this._$funcCode = 673;
            this._$gl.blendFunc(this._$gl.DST_ALPHA, this._$gl.ONE_MINUS_SRC_ALPHA);
        }
    }/**
     * @return void
     * @public
     */
    toSourceIn ()
    {
        if (this._$funcCode !== 670) {
            this._$funcCode = 670;
            this._$gl.blendFunc(this._$gl.DST_ALPHA, this._$gl.ZERO);
        }
    }

    toOperation (operation)
    {
        switch (operation) {
            case BlendMode.ADD:
                this.toAdd();
                break;
            case BlendMode.SCREEN:
                this.toScreen();
                break;
            case BlendMode.ALPHA:
                this.toAlpha();
                break;
            case BlendMode.ERASE:
                this.toErase();
                break;
            case "copy":
                this.toOneZero();
                break;
            default:
                this.reset();
                break;
        }
    }

    /**
     * @return void
     * @public
     */
    drawImage (
        image, x, y, w, h,
        ct0, ct1, ct2, ct3, ct4, ct5, ct6, ct7,
        operation, renderWidth, renderHeight, matrix, imageSmoothingEnabled
    ) {
        const currentBuffer = this._$context._$frameBufferManager.currentAttachment;

        const withCT =
            ct0 !== 1 || ct1 !== 1 || ct2 !== 1 || ct3 !== 1 ||
            ct4 !== 0 || ct5 !== 0 || ct6 !== 0 || ct7 !== 0
        ;

        const variants = this._$context._$shaderList.blendShaderVariants;

        switch (operation) {
            case BlendMode.NORMAL:
            case BlendMode.LAYER:
            case BlendMode.ADD:
            case BlendMode.SCREEN:
            case BlendMode.ALPHA:
            case BlendMode.ERASE:
            case "copy":
                {
                    this._$context._$frameBufferManager._$textureManager.bind0(image, imageSmoothingEnabled);

                    const shader = variants.getNormalBlendShader(withCT);
                    variants.setNormalBlendUniform(
                        shader.uniform, x, y, w, h, matrix, renderWidth, renderHeight,
                        withCT, ct0, ct1, ct2, ct3, ct4, ct5, ct6, ct7
                    );

                    const a  = matrix[0];
                    const b  = matrix[1];
                    const c  = matrix[3];
                    const d  = matrix[4];
                    const tx = matrix[6];
                    const ty = matrix[7];

                    if (a !== 1 || b !== 0 || c !== 0 || d !== 1) {
                        const left   = x;
                        const right  = x + w;
                        const top    = y;
                        const bottom = y + h;

                        const x0 = +(right * a + bottom * c + tx);
                        const x1 = +(right * a + top    * c + tx);
                        const x2 = +(left  * a + bottom * c + tx);
                        const x3 = +(left  * a + top    * c + tx);
                        const y0 = +(right * b + bottom * d + ty);
                        const y1 = +(right * b + top    * d + ty);
                        const y2 = +(left  * b + bottom * d + ty);
                        const y3 = +(left  * b + top    * d + ty);

                        const no = Util.$MAX_VALUE;
                        const xMin = +Util.$min(Util.$min(Util.$min(Util.$min( no, x0), x1), x2), x3);
                        const xMax = +Util.$max(Util.$max(Util.$max(Util.$max(-no, x0), x1), x2), x3);
                        const yMin = +Util.$min(Util.$min(Util.$min(Util.$min( no, y0), y1), y2), y3);
                        const yMax = +Util.$max(Util.$max(Util.$max(Util.$max(-no, y0), y1), y2), y3);

                        const sx = Util.$max(0, xMin | 0);
                        const sy = Util.$max(0, yMin | 0);
                        const sw = Util.$min(Util.$max(0, renderWidth  - sx), Util.$ceil(Util.$abs(xMax - xMin)));
                        const sh = Util.$min(Util.$max(0, renderHeight - sy), Util.$ceil(Util.$abs(yMax - yMin)));

                        if (!sw || !sh) {
                            return ;
                        }

                        this._$gl.enable(this._$gl.SCISSOR_TEST);
                        this._$gl.scissor(sx, Util.$max(0, renderHeight - (sy + sh)), sw + 1, sh + 1);
                    } else {
                        const sx = Util.$max(0, x + tx | 0);
                        const sy = Util.$max(0, y + ty | 0);
                        const sw = Util.$min(Util.$max(0, renderWidth  - sx), w);
                        const sh = Util.$min(Util.$max(0, renderHeight - sy), h);

                        if (!sw || !sh) {
                            return ;
                        }

                        this._$gl.enable(this._$gl.SCISSOR_TEST);
                        this._$gl.scissor(sx, Util.$max(0, renderHeight - (sy + sh)), sw + 1, sh + 1);
                    }

                    this.toOperation(operation);
                    shader._$drawImage();

                    this._$gl.disable(this._$gl.SCISSOR_TEST);
                }
                break;

            default:
                {
                    const sx = Util.$max(0, x + matrix[6] | 0);
                    const sy = Util.$max(0, y + matrix[7] | 0);
                    const sw = Util.$min(Util.$max(0, renderWidth  - sx), w);
                    const sh = Util.$min(Util.$max(0, renderHeight - sy), h);

                    if (!sw || !sh) {
                        return ;
                    }

                    const texture = this._$context._$frameBufferManager.getTextureFromCurrentAttachment();

                    const backTextureAttachment = this._$context._$frameBufferManager.createTextureAttachment(w, h);
                    this._$context._$bind(backTextureAttachment);
                    this._$context._$frameBufferManager._$textureManager.bind0(texture);

                    const clipShader = variants.getClipShader();
                    const clipUniform = clipShader.uniform;
                    variants.setClipUniform(clipUniform, x, y, w, h, Util.$inverseMatrix(matrix), renderWidth, renderHeight);

                    this.reset();
                    clipShader._$drawImage();
                    const backTexture = this._$context._$frameBufferManager.getTextureFromCurrentAttachment();

                    this._$context._$bind(currentBuffer);

                    this._$context._$frameBufferManager._$textureManager.bind01(backTexture, image, imageSmoothingEnabled);

                    const shader = variants.getBlendShader(operation, withCT);
                    variants.setBlendUniform(
                        shader.uniform, x, y, w, h, matrix, renderWidth, renderHeight,
                        withCT, ct0, ct1, ct2, ct3, ct4, ct5, ct6, ct7
                    );

                    this._$gl.enable(this._$gl.SCISSOR_TEST);
                    this._$gl.scissor(sx, Util.$max(0, renderHeight - (sy + sh)), sw, sh);

                    this.toOneZero();
                    shader._$drawImage();

                    this._$gl.disable(this._$gl.SCISSOR_TEST);

                    this._$context._$frameBufferManager.releaseAttachment(backTextureAttachment, true);

                }
                break;
        }
    }
}