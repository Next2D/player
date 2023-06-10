import { ShapeShaderVariantCollection } from "./variants/ShapeShaderVariantCollection";
import { GradientShapeShaderVariantCollection } from "./variants/GradientShapeShaderVariantCollection";
import { GradientLUTShaderVariantCollection } from "./variants/GradientLUTShaderVariantCollection";
import { FilterShaderVariantCollection } from "./variants/FilterShaderVariantCollection";
import { BlendShaderVariantCollection } from "./variants/BlendShaderVariantCollection";
import { CanvasToWebGLContext } from "../CanvasToWebGLContext";

/**
 * @class
 */
export class CanvasToWebGLShaderList
{
    private _$currentProgramId: number;
    private readonly _$shapeShaderVariants: ShapeShaderVariantCollection;
    private readonly _$gradientShapeShaderVariants: GradientShapeShaderVariantCollection;
    private readonly _$gradientLUTShaderVariants: GradientLUTShaderVariantCollection;
    private readonly _$filterShaderVariants: FilterShaderVariantCollection;
    private readonly _$blendShaderVariants: BlendShaderVariantCollection;

    /**
     * @param {CanvasToWebGLContext}  context
     * @param {WebGL2RenderingContext} gl
     * @constructor
     * @public
     */
    constructor (context: CanvasToWebGLContext, gl: WebGL2RenderingContext)
    {
        /**
         * @type {number}
         * @default -1
         * @public
         */
        this._$currentProgramId = -1;

        /**
         * @type {ShapeShaderVariantCollection}
         * @private
         */
        this._$shapeShaderVariants = new ShapeShaderVariantCollection(context, gl);

        /**
         * @type {GradientShapeShaderVariantCollection}
         * @private
         */
        this._$gradientShapeShaderVariants = new GradientShapeShaderVariantCollection(context, gl);

        /**
         * @type {GradientLUTShaderVariantCollection}
         * @private
         */
        this._$gradientLUTShaderVariants = new GradientLUTShaderVariantCollection(context, gl);

        /**
         * @type {FilterShaderVariantCollection}
         * @private
         */
        this._$filterShaderVariants = new FilterShaderVariantCollection(context, gl);

        /**
         * @type {BlendShaderVariantCollection}
         * @private
         */
        this._$blendShaderVariants = new BlendShaderVariantCollection(context, gl);
    }

    /**
     * @member {number}
     * @public
     */
    get currentProgramId (): number
    {
        return this._$currentProgramId;
    }
    set currentProgramId (current_program_id: number)
    {
        this._$currentProgramId = current_program_id;
    }

    /**
     * @memberof CanvasToWebGLShaderList#
     * @property {ShapeShaderVariantCollection} shapeShaderVariants
     * @return {ShapeShaderVariantCollection}
     * @readonly
     * @public
     */
    get shapeShaderVariants (): ShapeShaderVariantCollection
    {
        return this._$shapeShaderVariants;
    }

    /**
     * @memberof CanvasToWebGLShaderList#
     * @property {GradientShapeShaderVariantCollection} gradientShapeShaderVariants
     * @return {GradientShapeShaderVariantCollection}
     * @readonly
     * @public
     */
    get gradientShapeShaderVariants (): GradientShapeShaderVariantCollection
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
    get gradientLUTShaderVariants (): GradientLUTShaderVariantCollection
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
    get filterShaderVariants (): FilterShaderVariantCollection
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
    get blendShaderVariants (): BlendShaderVariantCollection
    {
        return this._$blendShaderVariants;
    }
}