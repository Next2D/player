import { Rectangle } from "./Rectangle";
import type { ColorTransform } from "./ColorTransform";
import type { Matrix } from "./Matrix";
import {
    BevelFilter,
    BlurFilter,
    ColorMatrixFilter,
    ConvolutionFilter,
    DisplacementMapFilter,
    DropShadowFilter,
    GlowFilter,
    GradientBevelFilter,
    GradientGlowFilter
} from "@next2d/filters";
import type {
    PlaceObjectImpl,
    DisplayObjectImpl,
    ParentImpl,
    BoundsImpl,
    FilterArrayImpl,
    BlendModeImpl,
    SurfaceFilterImpl
} from "@next2d/interface";
import {
    $getColorTransform,
    $getMatrix
} from "@next2d/util";
import {
    $Array,
    $doUpdated,
    $getFloat32Array6,
    $getArray,
    $poolArray,
    $multiplicationColor,
    $multiplicationMatrix,
    $poolBoundsObject,
    $getFloat32Array8
} from "@next2d/share";

/**
 * @type {Float32Array}
 * @private
 */
const $MATRIX_ARRAY_IDENTITY: Float32Array = new Float32Array([1, 0, 0, 1, 0, 0]);

/**
 * @type {Float32Array}
 * @private
 */
const $COLOR_ARRAY_IDENTITY: Float32Array = new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);

/**
 * @description Transform クラスは、表示オブジェクトに適用されるカラー調整プロパティと 2 次元の変換オブジェクトへのアクセスを提供します。
 *              変換時に、表示オブジェクトのカラーまたは方向と位置が、現在の値または座標から新しい値または座標に調整（オフセット）されます。
 *              Transform クラスは、表示オブジェクトおよびすべての親オブジェクトに適用されるカラー変換と 2 次元マトリックス変換に関するデータも収集します。
 *              concatenatedColorTransform プロパティと concatenatedMatrix プロパティを使用して、これらの結合された変換にアクセスできます。
 *              カラー変換を適用するには、ColorTransform オブジェクトを作成し、オブジェクトのメソッドとプロパティを使用してカラー調整を設定した後、
 *              colorTransformation プロパティ（表示オブジェクトの transform プロパティの）を新しい ColorTransformation オブジェクトに割り当てます。
 *              2 次元変換を適用するには、Matrix オブジェクトを作成し、マトリックスの 2 次元変換を設定した後、表示オブジェクトの transform.matrix プロパティを新しい Matrix オブジェクトに割り当てます。
 *
 *              The Transform class provides access to color adjustment properties and two--dimensional transformation objects that can be applied to a display object.
 *              During the transformation, the color or the orientation and position of a display object is adjusted (offset) from the current values or coordinates to new values or coordinates.
 *              The Transform class also collects data about color and two-dimensional matrix transformations that are applied to a display object and all of its parent objects.
 *              You can access these combined transformations through the concatenatedColorTransform and concatenatedMatrix properties.
 *              To apply color transformations: create a ColorTransform object,
 *              set the color adjustments using the object's methods and properties,
 *              and then assign the colorTransformation property of the transform property of the display object to the new ColorTransformation object.
 *              To apply two-dimensional transformations: create a Matrix object,
 *              set the matrix's two-dimensional transformation,
 *              and then assign the transform.matrix property of the display object to the new Matrix object.
 *
 * @class
 * @memberOf next2d.geom
 */
export class Transform
{
    private readonly _$displayObject: DisplayObjectImpl<any>;
    public _$matrix: Matrix | null;
    public _$colorTransform: ColorTransform | null;
    public _$blendMode: BlendModeImpl | null;
    public _$filters: FilterArrayImpl | null;

    /**
     * @param {DisplayObject} src
     *
     * @constructor
     * @public
     */
    constructor (src: DisplayObjectImpl<any> = null)
    {
        /**
         * @type {DisplayObject}
         * @private
         */
        this._$displayObject = src;

        /**
         * @type {Matrix}
         * @default null
         * @private
         */
        this._$matrix = null;

        /**
         * @type {ColorTransform}
         * @default null
         * @private
         */
        this._$colorTransform = null;

        /**
         * @type {string}
         * @default null
         * @private
         */
        this._$blendMode = null;

        /**
         * @type {array}
         * @default null
         * @private
         */
        this._$filters = null;
    }

    /**
     * 指定されたクラスのストリングを返します。
     * Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default "[class Transform]"
     * @method
     * @static
     */
    static toString (): string
    {
        return "[class Transform]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @member  {string}
     * @default "next2d.geom.Transform"
     * @const
     * @static
     */
    static get namespace (): string
    {
        return "next2d.geom.Transform";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return {string}
     * @default "[object Transform]"
     * @method
     * @public
     */
    toString (): string
    {
        return "[object Transform]";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @member  {string}
     * @default "next2d.geom.Transform"
     * @const
     * @public
     */
    get namespace (): string
    {
        return "next2d.geom.Transform";
    }

    /**
     * @description 表示オブジェクトのカラーを全体的に調整する値を格納している
     *              ColorTransform オブジェクトです。
     *              A ColorTransform object containing values that universally adjust
     *              the colors in the display object.
     *
     * @member {ColorTransform}
     * @public
     */
    get colorTransform (): ColorTransform
    {
        if (this._$colorTransform) {
            return this._$colorTransform._$clone();
        }

        const displayObject = this._$displayObject;
        const placeObject: PlaceObjectImpl | null = displayObject._$placeObject || displayObject._$getPlaceObject();

        if (placeObject && placeObject.colorTransform) {
            const buffer: number[] | Float32Array = placeObject.colorTransform;
            return $getColorTransform(
                buffer[0], buffer[1], buffer[2], buffer[3],
                buffer[4], buffer[5], buffer[6], buffer[7]
            );
        }

        this._$transform();
        if (!this._$colorTransform) {
            this._$colorTransform = $getColorTransform();
        }

        return this._$colorTransform._$clone();
    }
    set colorTransform (color_transform: ColorTransform)
    {
        this._$transform(null, color_transform._$colorTransform);
    }

    /**
     * @description この表示オブジェクトおよびルートレベルまでのすべての親オブジェクトに適用される、
     *              結合されたカラー変換を表す ColorTransform オブジェクトです。
     *              A ColorTransform object representing
     *              the combined color transformations applied to the display object
     *              and all of its parent objects, back to the root level.
     *
     * @member {ColorTransform}
     * @readonly
     * @public
     */
    get concatenatedColorTransform (): ColorTransform
    {
        let colorTransform: Float32Array = this._$rawColorTransform();

        let parent: ParentImpl<any> | null = this._$displayObject._$parent;
        while (parent) {

            colorTransform = $multiplicationColor(
                parent._$transform._$rawColorTransform(),
                colorTransform
            );

            parent = parent._$parent;
        }

        return $getColorTransform(
            colorTransform[0], colorTransform[1],
            colorTransform[2], colorTransform[3],
            colorTransform[4], colorTransform[5],
            colorTransform[6], colorTransform[7]
        );
    }

    /**
     * @description 表示オブジェクトの拡大 / 縮小、回転、および移動を変更する値を格納している
     *              Matrix オブジェクトです。
     *              A Matrix object containing values that alter the scaling,
     *              rotation, and translation of the display object.
     *
     * @member {Matrix}
     * @public
     */
    get matrix (): Matrix
    {
        if (this._$matrix) {
            return this._$matrix._$clone();
        }

        const displayObject = this._$displayObject;
        const placeObject: PlaceObjectImpl | null = displayObject._$placeObject || displayObject._$getPlaceObject();

        if (placeObject && placeObject.matrix) {
            const buffer: number[] | Float32Array = placeObject.matrix;
            return $getMatrix(
                buffer[0], buffer[1], buffer[2],
                buffer[3], buffer[4], buffer[5]
            );
        }

        this._$transform();
        if (!this._$matrix) {
            this._$matrix = $getMatrix();
        }

        return this._$matrix._$clone();
    }
    set matrix (matrix: Matrix)
    {
        this._$transform(matrix._$matrix, null);
    }

    /**
     * @description この表示オブジェクトおよびルートレベルまでのそのすべての親オブジェクトの結合された
     *              変換マトリックスを表す Matrix オブジェクトです。
     *              A Matrix object representing the combined transformation matrixes
     *              of the display object and all of its parent objects, back to the root level.
     *
     * @member {Matrix}
     * @readonly
     * @method
     * @public
     */
    get concatenatedMatrix (): Matrix
    {
        let matrix: Float32Array = this._$rawMatrix();

        let parent: ParentImpl<any> | null = this._$displayObject._$parent;
        while (parent) {

            matrix = $multiplicationMatrix(
                parent._$transform._$rawMatrix(),
                matrix
            );

            parent = parent._$parent;
        }

        return $getMatrix(
            matrix[0], matrix[1], matrix[2],
            matrix[3], matrix[4], matrix[5]
        );
    }

    /**
     * @description ステージ上の表示オブジェクトの境界を示す矩形を定義する Transform オブジェクトです。
     *              A Transform object that defines the bounding rectangle of
     *              the display object on the stage.
     *
     * @member {Transform}
     * @readonly
     * @method
     * @public
     */
    pixelBounds (): Rectangle
    {
        if (!this._$displayObject) {
            return new Rectangle(0, 0, 0, 0);
        }

        const bounds: BoundsImpl = this
            ._$displayObject
            ._$getBounds(null);

        const rectangle: Rectangle = new Rectangle(
            bounds.xMin,
            bounds.yMin,
            +Math.abs(bounds.xMax - bounds.xMin),
            +Math.abs(bounds.yMax - bounds.yMin)
        );

        $poolBoundsObject(bounds);

        return rectangle;
    }

    /**
     * @description matrix プロパティから取得される Matrix の Matrix._$matrix と同じ値を返しますが、matrix プロパティと異なり Matrix を複製しません。
     *              返される値は一時的に使用することのみできます。返される値の要素を直接更新してはいけません。
     *              Returns the same value as Matrix._$matrix of Matrix obtained from the matrix property, but unlike the matrix property, does not duplicate Matrix.
     *              The returned value may only be used temporarily. Elements of the returned value must not be updated directly.
     *
     * @return {Float32Array}
     * @method
     * @private
     */
    _$rawMatrix (): Float32Array
    {
        if (this._$matrix !== null) {
            return this._$matrix._$matrix;
        }

        const displayObject = this._$displayObject;
        const placeObject: PlaceObjectImpl | null = displayObject._$placeObject || displayObject._$getPlaceObject();

        if (placeObject && placeObject.matrix) {
            if ($Array.isArray(placeObject.matrix)) {
                const matrix: number[] = placeObject.matrix;
                placeObject.matrix = $getFloat32Array6(
                    matrix[0], matrix[1], matrix[2],
                    matrix[3], matrix[4], matrix[5]
                );
                $poolArray(matrix);
            }
            return placeObject.matrix;
        }

        return $MATRIX_ARRAY_IDENTITY;
    }

    /**
     * colorTransform プロパティから取得される ColorTransform の colorTransform._$colorTransform と同じ値を返しますが、colorTransform プロパティと異なり ColorTransform を複製しません。
     * 返される値は一時的に使用することのみできます。返される値の要素を直接更新してはいけません。返される値をプール（Util.$poolFloat32Array）してはいけません。
     *
     * @return {Float32Array}
     * @method
     * @private
     */
    _$rawColorTransform (): Float32Array
    {
        if (this._$colorTransform !== null) {
            return this._$colorTransform._$colorTransform;
        }

        const displayObject = this._$displayObject;
        const placeObject: PlaceObjectImpl | null = displayObject._$placeObject || displayObject._$getPlaceObject();

        if (placeObject && placeObject.colorTransform) {
            if ($Array.isArray(placeObject.colorTransform)) {
                const colorTransform: number[] = placeObject.colorTransform;
                placeObject.colorTransform = $getFloat32Array8(
                    colorTransform[0], colorTransform[1],
                    colorTransform[2], colorTransform[3],
                    colorTransform[4], colorTransform[5],
                    colorTransform[6], colorTransform[7]
                );
                $poolArray(colorTransform);
            }
            return placeObject.colorTransform;
        }

        return $COLOR_ARRAY_IDENTITY;
    }

    /**
     * @param  {Float32Array} [matrix=null]
     * @param  {Float32Array} [color_transform=null]
     * @param  {array}        [filters=null]
     * @param  {string}       [blend_mode=""]
     * @return {void}
     * @method
     * @private
     */
    _$transform (
        matrix: Float32Array | null = null,
        color_transform: Float32Array | null = null,
        filters: FilterArrayImpl | null = null,
        blend_mode: BlendModeImpl | "" = ""
    ): void {

        const displayObject = this._$displayObject;
        const placeObject: PlaceObjectImpl | null = displayObject._$placeObject || displayObject._$getPlaceObject();

        // Matrix
        this._$setMatrix(matrix, placeObject);

        // ColorTransform
        this._$setColorTransform(color_transform, placeObject);

        // Filter
        this._$setFilters(filters, placeObject);

        // BlendMode
        this._$setBlendMode(blend_mode, placeObject);

    }

    /**
     * @param  {Float32Array} [matrix=null]
     * @param  {object} [place_object=null]
     * @return {void}
     * @method
     * @private
     */
    _$setMatrix (
        matrix: Float32Array | number[] | null = null,
        place_object: PlaceObjectImpl | null = null
    ): void {

        if (matrix || place_object) {
            this._$displayObject._$doChanged();
            $doUpdated();
        }

        // Matrix
        if (!this._$matrix) {
            this._$matrix = $getMatrix(1, 0, 0, 1, 0, 0);
            if (!matrix
                && place_object
                && place_object.matrix
            ) {
                matrix = place_object.matrix;
            }
        }

        // update
        if (matrix) {
            const currentMatrix = this._$matrix._$matrix;
            currentMatrix[0] = matrix[0];
            currentMatrix[1] = matrix[1];
            currentMatrix[2] = matrix[2];
            currentMatrix[3] = matrix[3];
            currentMatrix[4] = matrix[4];
            currentMatrix[5] = matrix[5];
        }
    }

    /**
     * @param  {Float32Array} [color_transform=null]
     * @param  {object} [place_object=null]
     * @return {void}
     * @method
     * @private
     */
    _$setColorTransform (
        color_transform: Float32Array | number[] | null = null,
        place_object: PlaceObjectImpl | null = null
    ): void {

        if (color_transform || place_object) {
            this._$displayObject._$doChanged();
            $doUpdated();
        }

        if (!this._$colorTransform) {
            this._$colorTransform = $getColorTransform(1, 1, 1, 1, 0, 0, 0, 0);
            if (!color_transform
                && place_object
                && place_object.colorTransform
            ) {
                color_transform = place_object.colorTransform;
            }
        }

        if (color_transform) {
            const colorTransform = this._$colorTransform._$colorTransform;
            colorTransform[0] = color_transform[0];
            colorTransform[1] = color_transform[1];
            colorTransform[2] = color_transform[2];
            colorTransform[3] = color_transform[3];
            colorTransform[4] = color_transform[4];
            colorTransform[5] = color_transform[5];
            colorTransform[6] = color_transform[6];
            colorTransform[7] = color_transform[7];
        }
    }

    /**
     * @param  {array}  [filters=null]
     * @param  {object} [place_object=null]
     * @return {void}
     * @method
     * @private
     */
    _$setFilters (
        filters: FilterArrayImpl | null = null,
        place_object: PlaceObjectImpl | null = null
    ): void {

        if ($Array.isArray(filters)) {

            if (this._$filters) {
                $poolArray(this._$filters);
            }

            this._$filters = filters.slice(0);

            this._$displayObject._$doChanged();
            $doUpdated();

            return ;
        }

        if (this._$filters) {
            return ;
        }

        if (!place_object) {
            this._$filters = $getArray();
            return ;
        }

        if (place_object.filters) {
            this._$filters = place_object.filters.slice(0);
            for (let idx: number = 0; idx < this._$filters.length; ++idx) {
                this._$filters[idx] = this._$filters[idx].clone();
            }
            return ;
        }

        if (place_object.surfaceFilterList) {

            // build origin
            place_object.filters = this._$buildFilter(
                place_object.surfaceFilterList
            );

            // use clone
            this._$filters = place_object.filters.slice(0);
            for (let idx: number = 0; idx < this._$filters.length; ++idx) {
                this._$filters[idx] = this._$filters[idx].clone();
            }
        }

    }

    /**
     * @param  {array} surface_filter_list
     * @return {array}
     * @method
     * @public
     */
    _$buildFilter (surface_filter_list: SurfaceFilterImpl[]): FilterArrayImpl
    {
        const filters: FilterArrayImpl = $getArray();

        const length: number = surface_filter_list.length;
        for (let idx: number = 0; idx < length; ++idx) {

            const filter = surface_filter_list[idx];
            if (filter.params[0] === null) {
                filter.params.shift();
            }

            switch (filter.class) {

                case "BevelFilter":
                    filters.push(
                        new BevelFilter(...filter.params)
                    );
                    break;

                case "BlurFilter":
                    filters.push(
                        new BlurFilter(...filter.params)
                    );
                    break;

                case "ColorMatrixFilter":
                    filters.push(
                        new ColorMatrixFilter(...filter.params)
                    );
                    break;

                case "ConvolutionFilter":
                    filters.push(
                        new ConvolutionFilter(...filter.params)
                    );
                    break;

                case "DisplacementMapFilter":
                    filters.push(
                        new DisplacementMapFilter(...filter.params)
                    );
                    break;

                case "DropShadowFilter":
                    filters.push(
                        new DropShadowFilter(...filter.params)
                    );
                    break;

                case "GlowFilter":
                    filters.push(
                        new GlowFilter(...filter.params)
                    );
                    break;

                case "GradientBevelFilter":
                    filters.push(
                        new GradientBevelFilter(...filter.params)
                    );
                    break;

                case "GradientGlowFilter":
                    filters.push(
                        new GradientGlowFilter(...filter.params)
                    );
                    break;

            }
        }

        return filters;
    }

    /**
     * @param  {string} [blend_mode=""]
     * @param  {object} [place_object=null]
     * @return {void}
     * @method
     * @private
     */
    _$setBlendMode (
        blend_mode: BlendModeImpl | "" = "",
        place_object: PlaceObjectImpl | null = null
    ): void {

        if (blend_mode) {

            this._$blendMode = blend_mode;

            this._$displayObject._$doChanged();
            $doUpdated();

            return ;
        }

        if (this._$blendMode) {
            return ;
        }

        if (place_object && place_object.blendMode) {
            this._$blendMode = place_object.blendMode;
            return ;
        }

        this._$blendMode = "normal";
    }
}
