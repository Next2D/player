/**
 * @class
 */
class CanvasToWebGLContext
{
    /**
     * @param {WebGLRenderingContext} gl
     * @param {boolean}               isWebGL2Context
     * @constructor
     */
    constructor (gl, isWebGL2Context)
    {
        this._$gl = gl;

        const samples = isWebGL2Context
            ? $Math.min(Util.$currentPlayer().getSamples(), gl.getParameter(gl.MAX_SAMPLES))
            : 0;

        // setup
        this._$isWebGL2Context = isWebGL2Context;
        this._$maxTextureSize  = $Math.min(8192, gl.getParameter(gl.MAX_TEXTURE_SIZE)) - 2;

        // render params
        this._$contextStyle             = new CanvasToWebGLContextStyle();
        this._$style                    = this._$contextStyle;
        this._$fillBuffer               = null;
        this._$strokeBuffer             = null;
        this._$cacheCurrentBounds       = { "x": 0, "y": 0, "w": 0, "h": 0 };
        this._$cacheCurrentBuffer       = null;
        this._$stack                    = [];
        this._$globalAlpha              = 1;
        this._$imageSmoothingEnabled    = false;
        this._$globalCompositeOperation = BlendMode.NORMAL;
        this._$matrix                   = Util.$getFloat32Array9(1, 0, 0, 0, 1, 0, 0, 0, 1);

        this._$clearColorR = 1;
        this._$clearColorG = 1;
        this._$clearColorB = 1;
        this._$clearColorA = 1;

        this._$viewportWidth  = 0;
        this._$viewportHeight = 0;

        this._$frameBufferManager = new FrameBufferManager(gl, isWebGL2Context, samples);
        this._$path = new CanvasToWebGLContextPath();
        this._$grid = new CanvasToWebGLContextGrid();

        // filter params
        this._$offsetX = 0;
        this._$offsetY = 0;

        // layer
        this._$blends    = [];
        this._$positions = [];
        this._$isLayer   = false;

        // shader
        this._$shaderList = new CanvasToWebGLShaderList(this, gl);
        this._$gradientLUT = new GradientLUTGenerator(this, gl);

        // vertex array object
        this._$vao = new VertexArrayObjectManager(gl, isWebGL2Context);
        // pixel buffer object
        this._$pbo = new PixelBufferObjectManager(gl, isWebGL2Context);

        this._$mask  = new CanvasToWebGLContextMask(this, gl);
        this._$blend = new CanvasToWebGLContextBlend(this, gl);

        // singleton
        this._$canvasPatternToWebGL  = new CanvasPatternToWebGL();
        this._$canvasGradientToWebGL = new CanvasGradientToWebGL();
    }

    /**
     * @memberof CanvasToWebGLContext#
     * @return {HTMLCanvasElement}
     * @public
     */
    get canvas ()
    {
        return this._$gl.canvas;
    }

    /**
     * @memberof CanvasToWebGLContext#
     * @property {Float32Array|CanvasGradientToWebGL}
     * @return   {Float32Array|CanvasGradientToWebGL}
     * @public
     */
    get fillStyle ()
    {
        return this._$style._$fillStyle;
    }

    /**
     * @memberof CanvasToWebGLContext#
     * @property {Float32Array|CanvasGradientToWebGL}
     * @param    {Float32Array|CanvasGradientToWebGL} fill_style
     * @return   void
     * @public
     */
    set fillStyle (fill_style)
    {
        if (this._$style._$fillStyle.constructor === Float32Array) {
            Util.$poolFloat32Array4(this._$style._$fillStyle);
        }
        this._$style._$fillStyle = fill_style;
    }

    /**
     * @memberof CanvasToWebGLContext#
     * @property {Float32Array}
     * @return {Float32Array|CanvasGradientToWebGL}
     * @public
     */
    get strokeStyle ()
    {
        return this._$style._$strokeStyle;
    }

    /**
     * @memberof CanvasToWebGLContext#
     * @property {array}
     * @param  {*} stroke_style
     * @return {void}
     * @public
     */
    set strokeStyle (stroke_style)
    {
        if (this._$style._$strokeStyle.constructor === Float32Array) {
            Util.$poolFloat32Array4(this._$style._$strokeStyle);
        }
        this._$style._$strokeStyle = stroke_style;
    }

    /**
     * @memberof CanvasToWebGLContext#
     * @property {number}
     * @return {number}
     * @public
     */
    get lineWidth ()
    {
        return this._$style._$lineWidth;
    }

    /**
     * @memberof CanvasToWebGLContext#
     * @property {number}
     * @param {number} line_width
     * @return {void}
     * @public
     */
    set lineWidth (line_width)
    {
        this._$style._$lineWidth = line_width;
    }

    /**
     * @memberof CanvasToWebGLContext#
     * @property {string}
     * @return {string}
     * @public
     */
    get lineCap ()
    {
        return this._$style._$lineCap;
    }

    /**
     * @memberof CanvasToWebGLContext#
     * @property {string}
     * @param {string} line_cap
     * @return {void}
     * @public
     */
    set lineCap (line_cap)
    {
        switch (line_cap) {

            case CapsStyle.NONE:
            case CapsStyle.SQUARE:
                this._$style._$lineCap = line_cap;
                break;

            default:
                this._$style._$lineCap = CapsStyle.ROUND;
                break;

        }
    }

    /**
     * @memberof CanvasToWebGLContext#
     * @property {number}
     * @return {string}
     * @public
     */
    get lineJoin ()
    {
        return this._$style._$lineJoin;
    }

    /**
     * @memberof CanvasToWebGLContext#
     * @property {number}
     * @param {string} line_join
     * @return {void}
     * @public
     */
    set lineJoin (line_join)
    {

        switch (line_join) {

            case JointStyle.BEVEL:
            case JointStyle.MITER:
                this._$style._$lineJoin = line_join;
                break;

            default:
                this._$style._$lineJoin = JointStyle.ROUND;
                break;

        }

    }

    /**
     * @memberof CanvasToWebGLContext#
     * @property {number}
     * @return {number}
     * @public
     */
    get miterLimit ()
    {
        return this._$style._$miterLimit;
    }

    /**
     * @memberof CanvasToWebGLContext#
     * @property {number}
     * @param {number} miter_limit
     * @return {void}
     * @public
     */
    set miterLimit (miter_limit)
    {
        this._$style._$miterLimit = miter_limit;
    }

    /**
     * @memberof CanvasToWebGLContext#
     * @property {number}
     * @return {number}
     * @public
     */
    get globalAlpha ()
    {
        return this._$globalAlpha;
    }

    /**
     * @memberof CanvasToWebGLContext#
     * @property {number}
     * @param {number} global_alpha
     * @return {void}
     * @public
     */
    set globalAlpha (global_alpha)
    {
        this._$globalAlpha = Util.$clamp(global_alpha, 0, 1, 1);
    }

    /**
     * @memberof CanvasToWebGLContext#
     * @property {boolean} [imageSmoothingEnabled=false]
     * @return {boolean}
     * @public
     */
    get imageSmoothingEnabled ()
    {
        return this._$imageSmoothingEnabled;
    }

    /**
     * @memberof CanvasToWebGLContext#
     * @property {boolean} [imageSmoothingEnabled=false]
     * @param {boolean} image_smoothing_enabled
     * @return void
     * @public
     */
    set imageSmoothingEnabled (image_smoothing_enabled)
    {
        this._$imageSmoothingEnabled = Util.$toBoolean(image_smoothing_enabled);
    }

    /**
     * @memberof CanvasToWebGLContext#
     * @property {string} [globalCompositeOperation=BlendMode.NORMAL]
     * @return {string}
     * @public
     */
    get globalCompositeOperation ()
    {
        return this._$globalCompositeOperation;
    }

    /**
     * @memberof CanvasToWebGLContext#
     * @property {string} [globalCompositeOperation=BlendMode.NORMAL]
     * @param {string} global_composite_operation
     * @return {void}
     * @public
     */
    set globalCompositeOperation (global_composite_operation)
    {
        this._$globalCompositeOperation = global_composite_operation;
    }

    /**
     * @memberof CanvasToWebGLContext#
     * @property {FrameBufferManager}
     * @return {FrameBufferManager}
     * @public
     */
    get frameBuffer ()
    {
        return this._$frameBufferManager;
    }

    /**
     * @memberof CanvasToWebGLContext#
     * @property {CanvasToWebGLContextPath}
     * @return {CanvasToWebGLContextPath}
     * @public
     */
    get path ()
    {
        return this._$path;
    }

    /**
     * @memberof CanvasToWebGLContext#
     * @property {CanvasToWebGLContextGrid}
     * @return {CanvasToWebGLContextGrid}
     * @public
     */
    get grid ()
    {
        return this._$grid;
    }

    /**
     * @memberof CanvasToWebGLContext#
     * @property {VertexArrayObjectManager}
     * @return {VertexArrayObjectManager}
     * @public
     */
    get vao ()
    {
        return this._$vao;
    }

    /**
     * @memberof CanvasToWebGLContext#
     * @property {PixelBufferObjectManager}
     * @return {PixelBufferObjectManager}
     * @public
     */
    get pbo ()
    {
        return this._$pbo;
    }

    /**
     * @memberof CanvasToWebGLContext#
     * @property {CanvasToWebGLContextBlend}
     * @return {CanvasToWebGLContextBlend}
     * @public
     */
    get blend ()
    {
        return this._$blend;
    }

    /**
     * @param  {object} attachment
     * @return void
     * @public
     */
    _$bind (attachment)
    {
        if (!attachment) {
            return;
        }

        this._$frameBufferManager.bind(attachment);

        const colorBuffer   = attachment.color;
        const stencilBuffer = attachment.stencil;
        const width         = attachment.width;
        const height        = attachment.height;

        if (this._$viewportWidth !== width || this._$viewportHeight !== height) {
            this._$viewportWidth  = width;
            this._$viewportHeight = height;
            this._$gl.viewport(0, 0, width, height);
        }

        // カラーバッファorステンシルバッファが、未初期化の場合はクリアする
        if (colorBuffer.dirty || stencilBuffer && stencilBuffer.dirty) {
            colorBuffer.dirty = false;
            if (stencilBuffer) {
                stencilBuffer.dirty = false;
            }

            this._$gl.clearColor(0, 0, 0, 0);
            this.clearRect(0, 0, this._$viewportWidth, this._$viewportHeight);
            this._$gl.clearColor(this._$clearColorR, this._$clearColorG, this._$clearColorB, this._$clearColorA);

            this._$mask._$onClear(attachment.mask);
        }

        this._$mask._$onBind(attachment.mask);
    }

    /**
     * @param  {number} x
     * @param  {number} y
     * @param  {number} w
     * @param  {number} h
     * @return void
     * @public
     */
    fillRect (x, y, w, h)
    {
        if (!w || !h) {
            return ;
        }

        // set size
        this._$viewportWidth  = w;
        this._$viewportHeight = h;

        // create buffer
        let removed = false;
        if (!this._$fillBuffer) {

            removed = true;

            const vertices = this._$path.createRectVertices(x, y, w, h);
            this._$fillBuffer = this._$vao.createFill(vertices);

            // object pool
            Util.$poolArray(vertices.pop());
            Util.$poolArray(vertices);
        }

        const hasGrid = this._$grid.enabled;
        const variants = this._$shaderList.shapeShaderVariants;
        const shader = variants.getSolidColorShapeShader(false, hasGrid);
        const uniform = shader.uniform;
        variants.setSolidColorShapeUniform(
            uniform, false, 0, 0, 0,
            hasGrid, this._$matrix,
            this._$viewportWidth, this._$viewportHeight, this._$grid,
            this.fillStyle, this._$globalAlpha
        );

        shader._$fill(this._$fillBuffer);

        if (removed) {
            this._$vao.release(this._$fillBuffer);
            Util.$poolArray(this._$fillBuffer.indexRanges);
        }

        // reset
        this.beginPath();
    }

    /**
     * @param  {number} a
     * @param  {number} b
     * @param  {number} c
     * @param  {number} d
     * @param  {number} e
     * @param  {number} f
     * @return void
     * @public
     */
    setTransform (a, b, c, d, e, f)
    {
        this._$matrix[0] = a;
        this._$matrix[1] = b;
        this._$matrix[3] = c;
        this._$matrix[4] = d;
        this._$matrix[6] = e;
        this._$matrix[7] = f;
    }

    /**
     * @param  {number} a
     * @param  {number} b
     * @param  {number} c
     * @param  {number} d
     * @param  {number} e
     * @param  {number} f
     * @return void
     * @public
     */
    transform (a, b, c, d, e, f)
    {
        const a00 = this._$matrix[0];
        const a01 = this._$matrix[1];
        const a10 = this._$matrix[3];
        const a11 = this._$matrix[4];
        const a20 = this._$matrix[6];
        const a21 = this._$matrix[7];

        this._$matrix[0] = a * a00 + b * a10;
        this._$matrix[1] = a * a01 + b * a11;
        this._$matrix[3] = c * a00 + d * a10;
        this._$matrix[4] = c * a01 + d * a11;
        this._$matrix[6] = e * a00 + f * a10 + a20;
        this._$matrix[7] = e * a01 + f * a11 + a21;
    }

    /**
     * @param  {WebGLTexture|object} image
     * @param  {number} x
     * @param  {number} y
     * @param  {number} w
     * @param  {number} h
     * @param  {Float32Array} [color_transform=null]
     * @return void
     * @public
     */
    drawImage (image, x, y, w, h, color_transform = null)
    {
        let ct0 = 1, ct1 = 1, ct2 = 1, ct3 = this._$globalAlpha;
        let ct4 = 0, ct5 = 0, ct6 = 0, ct7 = 0;
        if (color_transform) {
            ct0 = color_transform[0];
            ct1 = color_transform[1];
            ct2 = color_transform[2];
            ct4 = color_transform[4] / 255;
            ct5 = color_transform[5] / 255;
            ct6 = color_transform[6] / 255;
        }

        this._$blend.drawImage(
            image, x, y, w, h,
            ct0, ct1, ct2, ct3, ct4, ct5, ct6, ct7,
            this._$globalCompositeOperation,
            this._$viewportWidth, this._$viewportHeight,
            this._$matrix,
            this._$imageSmoothingEnabled
        );
    }

    /**
     * @param  {number} r
     * @param  {number} g
     * @param  {number} b
     * @param  {number} a
     * @return void
     * @public
     */
    _$setColor (r = 0, g = 0, b = 0, a = 0)
    {
        this._$clearColorR = r;
        this._$clearColorG = g;
        this._$clearColorB = b;
        this._$clearColorA = a;
        this._$gl.clearColor(r, g, b, a);
    }

    /**
     * @param  {number} x
     * @param  {number} y
     * @param  {number} w
     * @param  {number} h
     * @return void
     * @public
     */
    clearRect (x, y, w, h)
    {
        this._$mask._$onClearRect();
        this._$gl.enable(this._$gl.SCISSOR_TEST);
        this._$gl.scissor(x, y, w, h);
        this._$gl.clear(this._$gl.COLOR_BUFFER_BIT | this._$gl.STENCIL_BUFFER_BIT);
        this._$gl.disable(this._$gl.SCISSOR_TEST);
    }

    /**
     * @param  {number} x
     * @param  {number} y
     * @param  {number} w
     * @param  {number} h
     * @return void
     * @private
     */
    _$clearRectStencil (x, y, w, h)
    {
        this._$mask._$onClearRect();
        this._$gl.enable(this._$gl.SCISSOR_TEST);
        this._$gl.scissor(x, y, w, h);
        this._$gl.clear(this._$gl.STENCIL_BUFFER_BIT);
        this._$gl.disable(this._$gl.SCISSOR_TEST);
    }

    /**
     * @param  {DisplayObject} display_object
     * @param  {Float32Array} matrix
     * @return {Float32Array}
     * @public
     */
    _$startClip (display_object, matrix)
    {
        return this._$mask._$startClip(display_object, matrix);
    }

    /**
     * @param {number} x
     * @param {number} y
     * @return void
     * @public
     */
    moveTo (x, y)
    {
        this._$path.moveTo(x, y);
    }

    /**
     * @param  {number} x
     * @param  {number} y
     * @return void
     * @public
     */
    lineTo (x, y)
    {
        this._$path.lineTo(x, y);
    }

    /**
     * @return void
     * @public
     */
    beginPath ()
    {
        this._$path.begin();

        if (this._$isGraphics) {

            if (this._$fillBuffer) {

                this.vao.release(this._$fillBuffer);
                this.vao.release(this._$fillBuffer.boundObject);

                Util.$poolArray(this._$fillBuffer.indexRanges);
                Util.$poolArray(this._$fillBuffer.boundObject.indexRanges);
            }

            if (this._$strokeBuffer) {
                this.vao.release(this._$strokeBuffer);
            }

        }

        this._$isGraphics   = false;
        this._$fillBuffer   = null;
        this._$strokeBuffer = null;
    }

    /**
     * @param  {number} cx
     * @param  {number} cy
     * @param  {number} x
     * @param  {number} y
     * @return void
     * @public
     */
    quadraticCurveTo (cx, cy, x ,y)
    {
        this._$path.quadTo(cx, cy, x, y);
    }

    /**
     * @param {number} cp1x
     * @param {number} cp1y
     * @param {number} cp2x
     * @param {number} cp2y
     * @param {number} dx
     * @param {number} dy
     * @return void
     * @public
     */
    bezierCurveTo (cp1x, cp1y, cp2x, cp2y, dx, dy)
    {
        this._$path.cubicTo(cp1x, cp1y, cp2x, cp2y, dx, dy);
    }

    /**
     * @return {array}
     * @public
     */
    _$getVertices ()
    {
        return this._$path.vertices;
    }

    /**
     * @return void
     * @public
     */
    fill ()
    {
        let matrix = this._$matrix;
        switch (true) {
            case this.fillStyle.constructor === CanvasGradientToWebGL:
                switch (this.fillStyle._$type) {
                    case GradientType.LINEAR:
                        break;
                    default:
                        matrix = this._$stack[this._$stack.length - 1];
                        break;
                }
                break;
            case this.fillStyle.constructor === CanvasPatternToWebGL:
                matrix = this._$stack[this._$stack.length - 1];
                break;
        }

        let texture, variants, shader;

        const hasGrid = this._$grid.enabled;

        switch (true) {

            // Gradient
            case this.fillStyle.constructor === CanvasGradientToWebGL:
                {
                    const gradient = this.fillStyle;
                    const stops = gradient._$stops;
                    const isLinearSpace = gradient._$rgb === "linearRGB";

                    texture = this._$gradientLUT.generateForShape(stops, isLinearSpace);
                    this._$frameBufferManager._$textureManager.bind0(texture, true);

                    variants = this._$shaderList.gradientShapeShaderVariants;
                    if (gradient._$type === GradientType.LINEAR) {
                        shader = variants.getGradientShapeShader(false, hasGrid, false, false, gradient._$mode);
                        variants.setGradientShapeUniform(
                            shader.uniform, false, 0, 0, 0,
                            hasGrid, matrix, Util.$inverseMatrix(this._$matrix),
                            this._$viewportWidth, this._$viewportHeight, this._$grid,
                            false, gradient._$points, 0
                        );
                    } else {
                        const hasFocalPoint = gradient._$focalPointRatio !== 0;
                        shader = variants.getGradientShapeShader(false, hasGrid, true, hasFocalPoint, gradient._$mode);
                        variants.setGradientShapeUniform(
                            shader.uniform, false, 0, 0, 0,
                            hasGrid, matrix, Util.$inverseMatrix(this._$matrix),
                            this._$viewportWidth, this._$viewportHeight, this._$grid,
                            true, gradient._$points, gradient._$focalPointRatio
                        );
                    }
                }
                break;

            case this.fillStyle.constructor === CanvasPatternToWebGL:
                {
                    const pattern = this.fillStyle;
                    const pct = pattern.colorTransform;

                    texture = pattern.texture;
                    this._$frameBufferManager._$textureManager.bind0(texture, this._$imageSmoothingEnabled);

                    variants = this._$shaderList.shapeShaderVariants;
                    shader = variants.getBitmapShapeShader(false, pattern.repeat !== "", hasGrid);

                    if (pct) {
                        variants.setBitmapShapeUniform(
                            shader.uniform, false, 0, 0, 0,
                            hasGrid, matrix, Util.$inverseMatrix(this._$matrix),
                            this._$viewportWidth, this._$viewportHeight, this._$grid,
                            texture.width, texture.height,
                            pct[0], pct[1], pct[2], this._$globalAlpha,
                            pct[4] / 255, pct[5] / 255, pct[6] / 255, 0
                        );
                    } else {
                        variants.setBitmapShapeUniform(
                            shader.uniform, false, 0, 0, 0,
                            hasGrid, matrix, Util.$inverseMatrix(this._$matrix),
                            this._$viewportWidth, this._$viewportHeight, this._$grid,
                            texture.width, texture.height,
                            1, 1, 1, this._$globalAlpha,
                            0, 0, 0, 0
                        );
                    }
                }
                break;

            // Shape
            default:

                variants = this._$shaderList.shapeShaderVariants;
                shader = variants.getSolidColorShapeShader(false, this._$grid.enabled);
                variants.setSolidColorShapeUniform(
                    shader.uniform, false, 0, 0, 0,
                    hasGrid, matrix,
                    this._$viewportWidth, this._$viewportHeight, this._$grid,
                    this.fillStyle, this._$globalAlpha
                );

                break;

        }

        const coverageVariants = this._$shaderList.shapeShaderVariants;
        const coverageShader = coverageVariants.getMaskShapeShader(false, hasGrid);
        coverageVariants.setMaskShapeUniform(
            coverageShader.uniform, hasGrid,
            matrix[0], matrix[1], matrix[2],
            matrix[3], matrix[4], matrix[5],
            matrix[6], matrix[7], matrix[8],
            this._$viewportWidth, this._$viewportHeight, this._$grid
        );

        // to triangle
        if (!this._$fillBuffer) {

            const fillVertices = this._$getVertices();
            if (!fillVertices.length) {
                return ;
            }

            const checkVertices = Util.$getArray();
            for (let idx = 0; idx < fillVertices.length; ++idx) {

                const vertices = fillVertices[idx];
                if (9 > vertices.length) {
                    continue;
                }

                checkVertices.push(vertices);
            }

            if (!checkVertices.length) {
                return ;
            }

            this._$isGraphics = true;
            this._$fillBuffer = this._$vao.createFill(checkVertices);

            const vertices = this._$path.getBoundsVertices();
            this._$fillBuffer.boundObject = this._$vao.createFill(vertices);

            // object pool
            Util.$poolArray(vertices.pop());
            Util.$poolArray(vertices);

        }

        // mask on
        this._$gl.enable(this._$gl.STENCIL_TEST);
        this._$gl.stencilMask(0xff);

        // shape clip
        this._$gl.enable(this._$gl.SAMPLE_ALPHA_TO_COVERAGE);
        this._$gl.stencilFunc(this._$gl.ALWAYS, 0, 0xff);
        this._$gl.stencilOp(this._$gl.KEEP, this._$gl.INVERT, this._$gl.INVERT);
        this._$gl.colorMask(false, false, false, false);
        coverageShader._$fill(this._$fillBuffer);
        this._$gl.disable(this._$gl.SAMPLE_ALPHA_TO_COVERAGE);

        // draw shape
        this._$gl.stencilFunc(this._$gl.NOTEQUAL, 0, 0xff);
        this._$gl.stencilOp(this._$gl.KEEP, this._$gl.ZERO, this._$gl.ZERO);
        this._$gl.colorMask(true, true, true, true);
        shader._$fill(this._$fillBuffer.boundObject);

        // mask off
        this._$gl.disable(this._$gl.STENCIL_TEST);
    }

    /**
     * @return void
     * @public
     */
    _$enterClip ()
    {
        this._$mask._$enterClip();
    }

    /**
     * @return void
     * @public
     */
    _$beginClipDef ()
    {
        this._$mask._$beginClipDef();
    }

    /**
     * @return void
     * @public
     */
    _$endClipDef ()
    {
        this._$mask._$endClipDef();
    }

    /**
     * @return void
     * @public
     */
    _$leaveClip ()
    {
        this._$mask._$leaveClip();
    }

    /**
     * @return void
     * @public
     */
    _$drawContainerClip ()
    {
        this._$mask._$drawContainerClip();
    }

    /**
     * @param  {uint} level
     * @param  {uint} w
     * @param  {uint} h
     * @return void
     * @private
     */
    _$unionStencilMask (level, w, h)
    {
        this._$mask._$unionStencilMask(level, w, h);
    }

    /**
     * @return void
     * @public
     */
    closePath ()
    {
        this._$path.close();
    }

    /**
     * @return void
     * @public
     */
    stroke ()
    {

        // set
        if (!this._$strokeBuffer) {

            const strokeVertices = this._$getVertices();

            if (!strokeVertices.length) {
                return;
            }

            const checkVertices = Util.$getArray();
            for (let idx = 0; idx < strokeVertices.length; ++idx) {

                const vertices = strokeVertices[idx];
                if (6 > vertices.length) {
                    continue;
                }

                checkVertices.push(vertices);
            }

            if (!checkVertices.length) {
                return ;
            }

            this._$isGraphics = true;

            this._$strokeBuffer = this._$vao.createStroke(
                strokeVertices,
                this.lineCap,
                this.lineJoin
            );
        }

        let matrix = this._$matrix;
        switch (true) {
            case this.strokeStyle.constructor === CanvasGradientToWebGL:
                switch (this.strokeStyle._$type) {
                    case GradientType.LINEAR:
                        break;
                    default:
                        matrix = this._$stack[this._$stack.length - 1];
                        break;
                }
                break;
            case this.strokeStyle.constructor === CanvasPatternToWebGL:
                matrix = this._$stack[this._$stack.length - 1];
                break;
        }

        let face = $Math.sign(matrix[0] * matrix[4]);
        if (face > 0 && matrix[1] !== 0 && matrix[3] !== 0) {
            face = -$Math.sign(matrix[1] * matrix[3]);
        }

        let lineWidth = this.lineWidth * 0.5;
        let scaleX, scaleY;
        if (this._$grid.enabled) {
            lineWidth *= Util.$getSameScaleBase();
            scaleX = $Math.abs(this._$grid.ancestorMatrixA + this._$grid.ancestorMatrixD);
            scaleY = $Math.abs(this._$grid.ancestorMatrixB + this._$grid.ancestorMatrixE);
        } else {
            scaleX = $Math.abs(matrix[0] + matrix[3]);
            scaleY = $Math.abs(matrix[1] + matrix[4]);
        }
        const scaleMin = $Math.min(scaleX, scaleY);
        const scaleMax = $Math.max(scaleX, scaleY);
        lineWidth *= scaleMax * (1 - 0.3 * $Math.cos($Math.PI * 0.5 * (scaleMin / scaleMax)));
        lineWidth = $Math.max(1, lineWidth);

        let texture, variants, shader;

        const hasGrid = this._$grid.enabled;

        switch (true) {

            // Gradient
            case this.strokeStyle.constructor === CanvasGradientToWebGL:
                {
                    const gradient = this.strokeStyle;
                    const stops = gradient._$stops;
                    const isLinearSpace = gradient._$rgb === "linearRGB";

                    texture = this._$gradientLUT.generateForShape(stops, isLinearSpace);
                    this._$frameBufferManager._$textureManager.bind0(texture, true);

                    variants = this._$shaderList.gradientShapeShaderVariants;
                    if (gradient._$type === GradientType.LINEAR) {
                        shader = variants.getGradientShapeShader(true, hasGrid, false, false, gradient._$mode);
                        variants.setGradientShapeUniform(
                            shader.uniform, true, lineWidth, face, this.miterLimit,
                            hasGrid, matrix, Util.$inverseMatrix(this._$matrix),
                            this._$viewportWidth, this._$viewportHeight, this._$grid,
                            false, gradient._$points, 0
                        );
                    } else {
                        const hasFocalPoint = gradient._$focalPointRatio !== 0;
                        shader = variants.getGradientShapeShader(true, hasGrid, true, hasFocalPoint, gradient._$mode);
                        variants.setGradientShapeUniform(
                            shader.uniform, true, lineWidth, face, this.miterLimit,
                            hasGrid, matrix, Util.$inverseMatrix(this._$matrix),
                            this._$viewportWidth, this._$viewportHeight, this._$grid,
                            true, gradient._$points, gradient._$focalPointRatio
                        );
                    }
                }
                break;

            case this.strokeStyle.constructor === CanvasPatternToWebGL:
                {
                    const pattern = this.strokeStyle;
                    const pct = pattern.colorTransform;

                    texture = pattern.texture;
                    this._$frameBufferManager._$textureManager.bind0(texture);

                    variants = this._$shaderList.shapeShaderVariants;
                    shader = variants.getBitmapShapeShader(true, pattern.repeat !== "", this._$grid.enabled);

                    if (pct) {
                        variants.setBitmapShapeUniform(
                            shader.uniform, true, lineWidth, face, this.miterLimit,
                            hasGrid, matrix, Util.$inverseMatrix(this._$matrix),
                            this._$viewportWidth, this._$viewportHeight, this._$grid,
                            texture.width, texture.height,
                            pct[0], pct[1], pct[2], this._$globalAlpha,
                            pct[4] / 255, pct[5] / 255, pct[6] / 255, 0
                        );
                    } else {
                        variants.setBitmapShapeUniform(
                            shader.uniform, true, lineWidth, face, this.miterLimit,
                            hasGrid, matrix, Util.$inverseMatrix(this._$matrix),
                            this._$viewportWidth, this._$viewportHeight, this._$grid,
                            texture.width, texture.height,
                            1, 1, 1, this._$globalAlpha,
                            0, 0, 0, 0
                        );
                    }
                }
                break;

            default:

                variants = this._$shaderList.shapeShaderVariants;
                shader = variants.getSolidColorShapeShader(true, this._$grid.enabled);
                variants.setSolidColorShapeUniform(
                    shader.uniform, true, lineWidth, face, this.miterLimit,
                    hasGrid, matrix,
                    this._$viewportWidth, this._$viewportHeight, this._$grid,
                    this.strokeStyle, this._$globalAlpha
                );

                break;
        }

        shader._$stroke(this._$strokeBuffer);
    }

    /**
     * @param  {number} x
     * @param  {number} y
     * @param  {number} radius
     * @return void
     * @public
     */
    arc (x, y, radius)
    {
        this._$path.drawCircle(x, y, radius);
    }

    /**
     * @param  {boolean} [removed = false]
     * @return void
     * @public
     */
    clip (removed = false)
    {
        const variants = this._$shaderList.shapeShaderVariants;
        const shader = variants.getMaskShapeShader(false, false);
        const uniform = shader.uniform;
        variants.setMaskShapeUniform(
            uniform, false,
            this._$matrix[0], this._$matrix[1], this._$matrix[2],
            this._$matrix[3], this._$matrix[4], this._$matrix[5],
            this._$matrix[6], this._$matrix[7], this._$matrix[8],
            this._$viewportWidth, this._$viewportHeight, null
        );

        // to triangle
        if (!this._$fillBuffer) {

            this._$fillBuffer = this._$vao.createFill(this._$getVertices());

            const vertices = this._$path.getBoundsVertices();
            this._$fillBuffer.boundObject = this._$vao.createFill(vertices);

            // object pool
            Util.$poolArray(vertices.pop());
            Util.$poolArray(vertices);
        }

        if (this._$mask._$onClip(this._$matrix, this._$viewportWidth, this._$viewportHeight)) {
            return;
        }

        // mask render
        shader._$fill(this._$fillBuffer);

        if (removed) {

            // pool
            this._$vao.release(this._$fillBuffer);
            this._$vao.release(this._$fillBuffer.boundObject);

            Util.$poolArray(this._$fillBuffer.indexRanges);
            Util.$poolArray(this._$fillBuffer.boundObject.indexRanges);

            // reset
            this._$fillBuffer = null;
        }

        this.beginPath();
    }

    /**
     * @return void
     * @public
     */
    save ()
    {

        // matrix
        const m = this._$matrix;
        this._$stack.push(Util.$getFloat32Array9(
            m[0], m[1], m[2], m[3], m[4], m[5], m[6], m[7], m[8]
        ));

        // mask
        this._$mask._$onSave();
    }

    /**
     * @return void
     * @public
     */
    restore ()
    {
        //matrix
        if (this._$stack.length) {
            Util.$poolFloat32Array9(this._$matrix);
            this._$matrix = this._$stack.pop();
        }

        // mask
        this._$mask._$onRestore();
    }

    /**
     * @param  {WebGLTexture} texture
     * @param  {string}       repeat
     * @param  {Float32Array} color_transform
     * @return {CanvasPatternToWebGL}
     * @public
     */
    createPattern (texture, repeat, color_transform)
    {
        return this
            ._$canvasPatternToWebGL
            ._$initialization(texture, repeat, color_transform);
    }

    /**
     * @param  {number} x0
     * @param  {number} y0
     * @param  {number} x1
     * @param  {number} y1
     * @param  {string} [rgb=InterpolationMethod.RGB]
     * @param  {string} [mode=SpreadMethod.PAD]
     * @return {CanvasGradientToWebGL}
     * @public
     */
    createLinearGradient (
        x0, y0, x1, y1,
        rgb = InterpolationMethod.RGB, mode = SpreadMethod.PAD
    ) {
        return this
            ._$canvasGradientToWebGL
            .linear(x0, y0, x1, y1, rgb, mode);
    }

    /**
     * @param  {number} x0
     * @param  {number} y0
     * @param  {number} r0
     * @param  {number} x1
     * @param  {number} y1
     * @param  {number} r1
     * @param  {string} [rgb=InterpolationMethod.RGB]
     * @param  {string} [mode=SpreadMethod.PAD]
     * @param  {number} [focal_point_ratio=0]
     * @return {CanvasGradientToWebGL}
     * @public
     */
    createRadialGradient (
        x0, y0, r0, x1, y1, r1,
        rgb = InterpolationMethod.RGB, mode = SpreadMethod.PAD,
        focal_point_ratio = 0
    ) {
        return this
            ._$canvasGradientToWebGL
            .radial(x0, y0, r0, x1, y1, r1, rgb, mode, focal_point_ratio);
    }

    /**
     * @param  {WebGLTexture} texture
     * @param  {boolean}      isHorizontal
     * @param  {number}       blur
     * @return {void}
     * @public
     */
    _$applyBlurFilter (texture, isHorizontal, blur)
    {
        const currentBuffer = this._$frameBufferManager.currentAttachment;
        const width  = currentBuffer.width;
        const height = currentBuffer.height;

        this._$frameBufferManager._$textureManager.bind0(texture, true);

        const halfBlur = $Math.ceil(blur * 0.5);
        const fraction = 1 - (halfBlur - blur * 0.5);
        const samples  = 1 + blur;

        const variants = this._$shaderList.filterShaderVariants;
        const shader = variants.getBlurFilterShader(halfBlur);
        variants.setBlurFilterUniform(shader.uniform, width, height, isHorizontal, fraction, samples);
        shader._$drawImage();
    }

    /**
     * @param  {WebGLTexture} blurTexture
     * @param  {number}  width
     * @param  {number}  height
     * @param  {number}  baseWidth
     * @param  {number}  baseHeight
     * @param  {number}  baseOffsetX
     * @param  {number}  baseOffsetY
     * @param  {number}  blurWidth
     * @param  {number}  blurHeight
     * @param  {number}  blurOffsetX
     * @param  {number}  blurOffsetY
     * @param  {boolean} isGlow
     * @param  {string}  type
     * @param  {boolean} knockout
     * @param  {number}  strength
     * @param  {number}  blurX
     * @param  {number}  blurY
     * @param  {array}   ratios
     * @param  {array}   colors
     * @param  {array}   alphas
     * @param  {number}  colorR1
     * @param  {number}  colorG1
     * @param  {number}  colorB1
     * @param  {number}  colorA1
     * @param  {number}  colorR2
     * @param  {number}  colorG2
     * @param  {number}  colorB2
     * @param  {number}  colorA2
     * @return {void}
     * @public
     */
    _$applyBitmapFilter (
        blurTexture, width, height,
        baseWidth, baseHeight, baseOffsetX, baseOffsetY,
        blurWidth, blurHeight, blurOffsetX, blurOffsetY,
        isGlow, type, knockout,
        strength, ratios, colors, alphas,
        colorR1, colorG1, colorB1, colorA1,
        colorR2, colorG2, colorB2, colorA2
    ) {
        const isInner = type === BitmapFilterType.INNER;

        const baseAttachment = this._$frameBufferManager.currentAttachment;
        const baseTexture = this._$frameBufferManager.getTextureFromCurrentAttachment();

        let lut;
        const isGradient = ratios !== null;
        if (isGradient) {
            lut = this._$gradientLUT.generateForFilter(ratios, colors, alphas);
        }

        let targetTextureAttachment;
        if (isInner) {
            if (isGradient) {
                this._$frameBufferManager._$textureManager.bind02(blurTexture, lut, true);
            } else {
                this._$frameBufferManager._$textureManager.bind0(blurTexture);
            }
        } else {
            targetTextureAttachment = this._$frameBufferManager.createTextureAttachment(width, height);
            this._$bind(targetTextureAttachment);

            if (isGradient) {
                this._$frameBufferManager._$textureManager.bind012(blurTexture, baseTexture, lut, true);
            } else {
                this._$frameBufferManager._$textureManager.bind01(blurTexture, baseTexture);
            }
        }

        // if (blurX < 2 && blurY < 2 && (blurX > 0 || blurY > 0)) {
        //    // ぼかし幅が2より小さい場合は、強さを調整して見た目を合わせる
        //    strength *= ($Math.max(1, blurX, blurY) - 1) * 0.4 + 0.2;
        // }

        const transformsBase = !(isInner || type === BitmapFilterType.FULL && knockout);
        const transformsBlur = !(width === blurWidth && height === blurHeight && blurOffsetX === 0 && blurOffsetY === 0);
        const appliesStrength = !(strength === 1);

        const variants = this._$shaderList.filterShaderVariants;
        const shader = variants.getBitmapFilterShader(
            transformsBase, transformsBlur,
            isGlow, type, knockout,
            appliesStrength, isGradient
        );
        variants.setBitmapFilterUniform(
            shader.uniform, width, height,
            baseWidth, baseHeight, baseOffsetX, baseOffsetY,
            blurWidth, blurHeight, blurOffsetX, blurOffsetY,
            isGlow, strength,
            colorR1, colorG1, colorB1, colorA1,
            colorR2, colorG2, colorB2, colorA2,
            transformsBase, transformsBlur, appliesStrength, isGradient
        );

        if (!isInner) {
            this.blend.toOneZero();
        } else if (knockout) {
            this.blend.toSourceIn();
        } else {
            this.blend.toSourceAtop();
        }

        shader._$drawImage();

        if (!isInner) {
            this._$frameBufferManager.releaseAttachment(baseAttachment, true);
        }
    }

    /**
     * @param  {WebGLTexture} texture
     * @param  {array} matrix
     * @return void
     * @public
     */
    _$applyColorMatrixFilter (texture, matrix)
    {
        this._$frameBufferManager._$textureManager.bind0(texture, true);

        const variants = this._$shaderList.filterShaderVariants;
        const shader = variants.getColorMatrixFilterShader();
        variants.setColorMatrixFilterUniform(shader.uniform, matrix);

        this.blend.reset();
        shader._$drawImage();
    }

    /**
     * @param  {WebGLTexture} texture
     * @param  {number}  matrix_x
     * @param  {number}  matrix_y
     * @param  {array}   matrix
     * @param  {number}  divisor
     * @param  {number}  bias
     * @param  {boolean} preserve_alpha
     * @param  {boolean} clamp
     * @param  {number}  colorR
     * @param  {number}  colorG
     * @param  {number}  colorB
     * @param  {number}  colorA
     * @return void
     * @public
     */
    _$applyConvolutionFilter (
        texture, matrix_x, matrix_y, matrix,
        divisor, bias, preserve_alpha, clamp,
        colorR, colorG, colorB, colorA
    ) {
        const width  = texture.width;
        const height = texture.height;

        const targetTextureAttachment = this._$frameBufferManager.createTextureAttachment(width, height);
        this._$bind(targetTextureAttachment);

        this._$frameBufferManager._$textureManager.bind0(texture, true);

        const variants = this._$shaderList.filterShaderVariants;
        const shader = variants.getConvolutionFilterShader(matrix_x, matrix_y, preserve_alpha, clamp);
        variants.setConvolutionFilterUniform(
            shader.uniform,
            width, height, matrix, divisor, bias, clamp,
            colorR, colorG, colorB, colorA
        );

        this.blend.reset();
        shader._$drawImage();
    }

    /**
     * @param  {WebGLTexture} source
     * @param  {WebGLTexture} map
     * @param  {number} base_width
     * @param  {number} base_height
     * @param  {Point}  [point=null]
     * @param  {number} component_x
     * @param  {number} component_y
     * @param  {number} scale_x
     * @param  {number} scale_y
     * @param  {string} mode
     * @param  {number} colorR
     * @param  {number} colorG
     * @param  {number} colorB
     * @param  {number} colorA
     * @return void
     * @private
     */
    _$applyDisplacementMapFilter (
        source, map, base_width, base_height, point,
        component_x, component_y, scale_x, scale_y, mode,
        colorR, colorG, colorB, colorA
    ) {
        const width  = source.width;
        const height = source.height;

        const targetTextureAttachment = this._$frameBufferManager.createTextureAttachment(width, height);
        this._$bind(targetTextureAttachment);

        if (!point) {
            point = { "x": 0, "y": 0 };
        }

        this._$frameBufferManager._$textureManager.bind01(source, map);

        const variants = this._$shaderList.filterShaderVariants;
        const shader = variants.getDisplacementMapFilterShader(component_x, component_y, mode);
        variants.setDisplacementMapFilterUniform(
            shader.uniform, map.width, map.height, base_width, base_height,
            point.x, point.y, scale_x, scale_y, mode,
            colorR, colorG, colorB, colorA
        );

        this.blend.reset();
        shader._$drawImage();
    }

    /**
     * @param  {number} x
     * @param  {number} y
     * @param  {number} w
     * @param  {number} h
     * @return {Uint8Array}
     * @public
     */
    getImageData (x, y, w, h)
    {
        const length = w * h * 4;
        const data = Util.$getUint8Array(length);

        this._$gl.readPixels(
            x, h - (h - y), w, h,
            this._$gl.RGBA, this._$gl.UNSIGNED_BYTE,
            data
        );

        // アルファ値を除算
        for (let idx = 0; idx < length; idx += 4) {

            const a = data[idx + 3];
            if (a) {
                data[idx    ] = $Math.min(data[idx    ] * 255 / a, 255) & 0xff;
                data[idx + 1] = $Math.min(data[idx + 1] * 255 / a, 255) & 0xff;
                data[idx + 2] = $Math.min(data[idx + 2] * 255 / a, 255) & 0xff;
            }

        }

        return data;
    }

    /**
     * @param  {object} position
     * @return void
     */
    _$startLayer (position)
    {
        this._$positions.push(position);
        this._$blends.push(this._$isLayer);
        this._$isLayer = true;
    }

    /**
     * @return void
     */
    _$endLayer ()
    {
        Util.$poolBoundsObject(this._$positions.pop());
        this._$isLayer = Util.$toBoolean(this._$blends.pop());
    }

    /**
     * @return {object}
     * @private
     */
    _$getCurrentPosition ()
    {
        return this._$positions[this._$positions.length - 1];
    }

    /**
     * @description 最大テクスチャサイズを超えないスケール値を取得する
     * @param  {number} width
     * @param  {number} height
     * @return {number}
     */
    _$textureScale (width, height)
    {
        const maxSize = $Math.max(width, height);
        if (maxSize > this._$maxTextureSize) {
            return this._$maxTextureSize / maxSize;
        }
        return 1;
    }

    /**
     * @param  {uint} samples
     * @return void
     * @public
     */
    changeSamples (samples = 4)
    {
        if (this._$isWebGL2Context) {

            samples = $Math.min(samples, this._$gl.getParameter(this._$gl.MAX_SAMPLES));

            const manager = this._$frameBufferManager;

            // reset
            manager._$objectPool = [];
            manager._$colorBufferPool._$objectPool   = [];
            manager._$stencilBufferPool._$objectPool = [];

            // edit param
            manager._$colorBufferPool._$samples       = samples;

        }
    }
}
