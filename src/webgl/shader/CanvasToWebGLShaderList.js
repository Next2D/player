/**
 * @class
 */
class CanvasToWebGLShaderList
{
    /**
     * @param {CanvasToWebGLContext}  context
     * @param {WebGLRenderingContext} gl
     * @constructor
     * @public
     */
    constructor (context, gl)
    {
        const keyword = new WebGLShaderKeyword(gl, context._$isWebGL2Context);
        this._$currentProgramId = -1;

        this._$shapeShaderVariants    = new ShapeShaderVariantCollection(context, gl, keyword);
        this._$bitmapShaderVariants   = new BitmapShaderVariantCollection(context, gl, keyword);
        this._$gradientShaderVariants = new GradientShaderVariantCollection(context, gl, keyword);
        this._$filterShaderVariants   = new FilterShaderVariantCollection(context, gl, keyword);
        this._$blendShaderVariants    = new BlendShaderVariantCollection(context, gl, keyword);

        // BitmapData
        const colorTransform = {
            opaque:      new WebGLShaderProxy(context, gl, keyword, VertexShaderSourceBitmapData.SRC_TEX_COORD, FragmentShaderSourceBitmapData.COLOR_TRANSFORM.bind(null, false)),
            transparent: new WebGLShaderProxy(context, gl, keyword, VertexShaderSourceBitmapData.SRC_TEX_COORD, FragmentShaderSourceBitmapData.COLOR_TRANSFORM.bind(null, true))
        };
        const copyChannel = {
            opaque:      new WebGLShaderProxy(context, gl, keyword, VertexShaderSourceBitmapData.SRC_AND_DST_TEX_COORD, FragmentShaderSourceBitmapData.COPY_CHANNEL.bind(null, false)),
            transparent: new WebGLShaderProxy(context, gl, keyword, VertexShaderSourceBitmapData.SRC_AND_DST_TEX_COORD, FragmentShaderSourceBitmapData.COPY_CHANNEL.bind(null, true))
        };
        const merge = {
            opaque:      new WebGLShaderProxy(context, gl, keyword, VertexShaderSourceBitmapData.SRC_AND_DST_TEX_COORD, FragmentShaderSourceBitmapData.MERGE.bind(null, false)),
            transparent: new WebGLShaderProxy(context, gl, keyword, VertexShaderSourceBitmapData.SRC_AND_DST_TEX_COORD, FragmentShaderSourceBitmapData.MERGE.bind(null, true))
        };
        const paletteMap = {
            opaque:      new WebGLShaderProxy(context, gl, keyword, VertexShaderSourceBitmapData.SRC_TEX_COORD, FragmentShaderSourceBitmapData.PALETTE_MAP.bind(null, false)),
            transparent: new WebGLShaderProxy(context, gl, keyword, VertexShaderSourceBitmapData.SRC_TEX_COORD, FragmentShaderSourceBitmapData.PALETTE_MAP.bind(null, true))
        };
        const pixelDissolve = {
            color: new WebGLShaderProxy(context, gl, keyword, VertexShaderSourceBitmapData.POSITION_ONLY, FragmentShaderSourceBitmapData.FILL_COLOR),
            texture: {
                opaque:      new WebGLShaderProxy(context, gl, keyword, VertexShaderSourceBitmapData.PIXEL_DISSOLVE_TEXTURE, FragmentShaderSourceBitmapData.PIXEL_DISSOLVE_TEXTURE.bind(null, false)),
                transparent: new WebGLShaderProxy(context, gl, keyword, VertexShaderSourceBitmapData.PIXEL_DISSOLVE_TEXTURE, FragmentShaderSourceBitmapData.PIXEL_DISSOLVE_TEXTURE.bind(null, true))
            }
        };
        const copySrcTex = new WebGLShaderProxy(context, gl, keyword, VertexShaderSourceBitmapData.SRC_TEX_COORD, FragmentShaderSourceBitmapData.COPY_SRC_TEX);
        const copyPixels = {
            withAlphaBitmapData: new WebGLShaderProxy(context, gl, keyword, VertexShaderSourceBitmapData.SRC_AND_ALPHA_TEX_COORD, FragmentShaderSourceBitmapData.COPY_PIXELS_WITH_ALPHA_BITMAP_DATA),
            noAlphaBitmapData: copySrcTex
        };
        const fillRect = new WebGLShaderProxy(context, gl, keyword, VertexShaderSourceBitmapData.POSITION_ONLY, FragmentShaderSourceBitmapData.FILL_COLOR);
        const noise = new WebGLShaderProxy(context, gl, keyword, VertexShaderSourceBitmapData.POSITION_ONLY, FragmentShaderSourceBitmapData.NOISE);

        const thresholdBuilder = function(operation) {
            return {
                discardSource: {
                    opaque:      new WebGLShaderProxy(context, gl, keyword, VertexShaderSourceBitmapData.SRC_TEX_COORD, FragmentShaderSourceBitmapData.THRESHOLD.bind(null, operation, false, false)),
                    transparent: new WebGLShaderProxy(context, gl, keyword, VertexShaderSourceBitmapData.SRC_TEX_COORD, FragmentShaderSourceBitmapData.THRESHOLD.bind(null, operation, false, true))
                },
                copySource: {
                    opaque:      new WebGLShaderProxy(context, gl, keyword, VertexShaderSourceBitmapData.SRC_TEX_COORD, FragmentShaderSourceBitmapData.THRESHOLD.bind(null, operation, true, false)),
                    transparent: new WebGLShaderProxy(context, gl, keyword, VertexShaderSourceBitmapData.SRC_TEX_COORD, FragmentShaderSourceBitmapData.THRESHOLD.bind(null, operation, true, true))
                }
            };
        };
        const threshold = {
            less:         thresholdBuilder("less"),
            lessEqual:    thresholdBuilder("lessEqual"),
            greater:      thresholdBuilder("greater"),
            greaterEqual: thresholdBuilder("greaterEqual"),
            equal:        thresholdBuilder("thresholdEqual"),
            notEqual:     thresholdBuilder("thresholdNotEqual"),

            subtotal: new WebGLShaderProxy(context, gl, keyword, VertexShaderSourceBitmapData.SRC_TEX_COORD, FragmentShaderSourceBitmapData.THRESHOLD_SUBTOTAL)
        };

        const getColorBoundsRect = {
            findColor   : new WebGLShaderProxy(context, gl, keyword, VertexShaderSourceBitmapData.SRC_TEX_COORD, FragmentShaderSourceBitmapData.GET_COLOR_BOUNDS_RECT.bind(null, true)),
            findNotColor: new WebGLShaderProxy(context, gl, keyword, VertexShaderSourceBitmapData.SRC_TEX_COORD, FragmentShaderSourceBitmapData.GET_COLOR_BOUNDS_RECT.bind(null, false))
        };

        const getPixels = {
            RGBA: new WebGLShaderProxy(context, gl, keyword, VertexShaderSourceBitmapData.SRC_TEX_COORD, FragmentShaderSourceBitmapData.GET_PIXELS.bind(null, "RGBA")),
            BGRA: new WebGLShaderProxy(context, gl, keyword, VertexShaderSourceBitmapData.SRC_TEX_COORD, FragmentShaderSourceBitmapData.GET_PIXELS.bind(null, "BGRA")),
            ARGB: new WebGLShaderProxy(context, gl, keyword, VertexShaderSourceBitmapData.SRC_TEX_COORD, FragmentShaderSourceBitmapData.GET_PIXELS.bind(null, "ARGB")),
        };
        const setPixels = {
            RGBA: new WebGLShaderProxy(context, gl, keyword, VertexShaderSourceBitmapData.SRC_TEX_COORD, FragmentShaderSourceBitmapData.SET_PIXELS.bind(null, "RGBA")),
            BGRA: new WebGLShaderProxy(context, gl, keyword, VertexShaderSourceBitmapData.SRC_TEX_COORD, FragmentShaderSourceBitmapData.SET_PIXELS.bind(null, "BGRA")),
            ARGB: new WebGLShaderProxy(context, gl, keyword, VertexShaderSourceBitmapData.SRC_TEX_COORD, FragmentShaderSourceBitmapData.SET_PIXELS.bind(null, "ARGB"))
        };
        const setPixelQueue = new WebGLShaderProxy(context, gl, keyword, VertexShaderSourceBitmapData.SET_PIXEL_QUEUE, FragmentShaderSourceBitmapData.SET_PIXEL_QUEUE);

        this._$bitmapData = {
            colorTransform,
            copyChannel,
            merge,
            paletteMap,
            pixelDissolve,
            copyPixels,
            scroll: copySrcTex,
            fillRect,
            noise,
            threshold,
            getColorBoundsRect,
            getPixels,
            setPixels,
            setPixelQueue
        };
    }

    /**
     * @memberof CanvasToWebGLShaderList#
     * @property {ShapeShaderVariantCollection} shapeShaderVariants
     * @return {ShapeShaderVariantCollection}
     * @readonly
     * @public
     */
    get shapeShaderVariants ()
    {
        return this._$shapeShaderVariants;
    }

    /**
     * @memberof CanvasToWebGLShaderList#
     * @property {BitmapShaderVariantCollection} bitmapShaderVariants
     * @return {BitmapShaderVariantCollection}
     * @readonly
     * @public
     */
    get bitmapShaderVariants ()
    {
        return this._$bitmapShaderVariants;
    }

    /**
     * @memberof CanvasToWebGLShaderList#
     * @property {GradientShaderVariantCollection} gradientShaderVariants
     * @return {GradientShaderVariantCollection}
     * @readonly
     * @public
     */
    get gradientShaderVariants ()
    {
        return this._$gradientShaderVariants;
    }

    /**
     * @memberof CanvasToWebGLShaderList#
     * @property {FilterShaderVariantCollection} filterShaderVariants
     * @return {FilterShaderVariantCollection}
     * @readonly
     * @public
     */
    get filterShaderVariants ()
    {
        return this._$filterShaderVariants;
    }

    /**
     * @memberof CanvasToWebGLShaderList#
     * @property {BlendShaderVariantCollection} blendShaderVariants
     * @return {BlendShaderVariantCollection}
     * @readonly
     * @public
     */
    get blendShaderVariants ()
    {
        return this._$blendShaderVariants;
    }
}
