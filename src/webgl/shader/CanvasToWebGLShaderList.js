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
        this._$currentProgramId = -1;

        this._$shapeShaderVariants         = new ShapeShaderVariantCollection(context, gl);
        this._$bitmapShaderVariants        = new BitmapShaderVariantCollection(context, gl);
        this._$gradientShapeShaderVariants = new GradientShapeShaderVariantCollection(context, gl);
        this._$gradientLUTShaderVariants   = new GradientLUTShaderVariantCollection(context, gl);
        this._$filterShaderVariants        = new FilterShaderVariantCollection(context, gl);
        this._$blendShaderVariants         = new BlendShaderVariantCollection(context, gl);
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
     * @property {GradientShapeShaderVariantCollection} gradientShapeShaderVariants
     * @return {GradientShapeShaderVariantCollection}
     * @readonly
     * @public
     */
    get gradientShapeShaderVariants ()
    {
        return this._$gradientShapeShaderVariants;
    }

    /**
     * @memberof CanvasToWebGLShaderList#
     * @property {GradientLUTShaderVariantCollection} gradientLUTShaderVariants
     * @return {GradientLUTShaderVariantCollection}
     * @readonly
     * @public
     */
    get gradientLUTShaderVariants ()
    {
        return this._$gradientLUTShaderVariants;
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