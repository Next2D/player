/**
 * Transform クラスは、表示オブジェクトに適用されるカラー調整プロパティと 2 次元の変換オブジェクトへのアクセスを提供します。
 * 変換時に、表示オブジェクトのカラーまたは方向と位置が、現在の値または座標から新しい値または座標に調整（オフセット）されます。
 * Transform クラスは、表示オブジェクトおよびすべての親オブジェクトに適用されるカラー変換と 2 次元マトリックス変換に関するデータも収集します。
 * concatenatedColorTransform プロパティと concatenatedMatrix プロパティを使用して、これらの結合された変換にアクセスできます。
 * カラー変換を適用するには、ColorTransform オブジェクトを作成し、オブジェクトのメソッドとプロパティを使用してカラー調整を設定した後、
 * colorTransformation プロパティ（表示オブジェクトの transform プロパティの）を新しい ColorTransformation オブジェクトに割り当てます。
 * 2 次元変換を適用するには、Matrix オブジェクトを作成し、マトリックスの 2 次元変換を設定した後、表示オブジェクトの transform.matrix プロパティを新しい Matrix オブジェクトに割り当てます。
 *
 * The Transform class provides access to color adjustment properties and two--dimensional transformation objects that can be applied to a display object.
 * During the transformation, the color or the orientation and position of a display object is adjusted (offset) from the current values or coordinates to new values or coordinates.
 * The Transform class also collects data about color and two-dimensional matrix transformations that are applied to a display object and all of its parent objects.
 * You can access these combined transformations through the concatenatedColorTransform and concatenatedMatrix properties.
 * To apply color transformations: create a ColorTransform object,
 * set the color adjustments using the object's methods and properties,
 * and then assign the colorTransformation property of the transform property of the display object to the new ColorTransformation object.
 * To apply two-dimensional transformations: create a Matrix object,
 * set the matrix's two-dimensional transformation,
 * and then assign the transform.matrix property of the display object to the new Matrix object.
 *
 * @example <caption>Example usage of Transform.</caption>
 * // new Transform
 * const {Transform} = next2d.geom;
 * const transform   = new Transform(displayObject);
 *
 * @class
 * @memberOf next2d.geom
 */
class Transform
{
    /**
     * @param {DisplayObject} src
     *
     * @constructor
     * @public
     */
    constructor(src)
    {
        if (!(src instanceof DisplayObject)) {
            throw new Error("Transform params is DisplayObject only.");
        }

        /**
         * @type {DisplayObject}
         * @private
         */
        this._$displayObject = src;

        /**
         * @type {Matrix|null}
         * @default null
         * @private
         */
        this._$matrix = null;

        /**
         * @type {ColorTransform|null}
         * @default null
         * @private
         */
        this._$colorTransform = null;

        /**
         * @type {string|null}
         * @default null
         * @private
         */
        this._$blendMode = null;

        /**
         * @type {array|null}
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
     * @default [class Transform]
     * @method
     * @static
     */
    static toString ()
    {
        return "[class Transform]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @member  {string}
     * @default next2d.geom.Transform
     * @const
     * @static
     */
    static get namespace ()
    {
        return "next2d.geom.Transform";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return {string}
     * @method
     * @public
     */
    toString ()
    {
        return "[object Transform]";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @member  {string}
     * @default next2d.geom.Transform
     * @const
     * @public
     */
    get namespace ()
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
    get colorTransform ()
    {
        if (this._$colorTransform) {
            return this._$colorTransform._$clone();
        }

        const object = this
            ._$displayObject
            ._$getPlaceObject();

        if (object) {

            const buffer = object.colorTransform;
            const colorTransform = new ColorTransform();
            colorTransform._$colorTransform = Util.$getFloat32Array8(
                buffer[0], buffer[1], buffer[2], buffer[3],
                buffer[4], buffer[5], buffer[6], buffer[7]
            );

            return colorTransform;
        }

        this._$transform();
        return this._$colorTransform._$clone();
    }
    set colorTransform (color_transform)
    {
        if (color_transform instanceof ColorTransform) {
            this._$transform(null, color_transform._$colorTransform);
        }
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
    get concatenatedColorTransform ()
    {
        let colorTransform = this._$rawColorTransform();

        let parent = this._$displayObject._$parent;
        while (parent) {

            colorTransform = Util.$multiplicationColor(
                parent._$transform._$rawColorTransform(),
                colorTransform
            );

            parent = parent._$parent;
        }

        return Util.$getColorTransform(
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
    get matrix ()
    {
        if (this._$matrix) {
            return this._$matrix._$clone();
        }

        const object = this
            ._$displayObject
            ._$getPlaceObject();

        if (object) {
            const buffer = object.matrix;
            return Util.$getMatrix(
                buffer[0], buffer[1], buffer[2],
                buffer[3], buffer[4], buffer[5]
            );
        }

        this._$transform();
        return this._$matrix._$clone();
    }
    set matrix (matrix)
    {
        if (matrix instanceof Matrix) {
            this._$transform(matrix._$matrix, null);
        }
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
    get concatenatedMatrix ()
    {
        let matrix = this._$rawMatrix();

        let parent = this._$displayObject._$parent;
        while (parent) {

            matrix = Util.$multiplicationMatrix(
                parent._$transform._$rawMatrix(),
                matrix
            );

            parent = parent._$parent;
        }

        return Util.$getMatrix(
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
    pixelBounds ()
    {
        const rectangle = new Rectangle(0, 0, 0, 0);

        if (!this._$displayObject) {
            return rectangle;
        }

        const bounds = this._$displayObject._$getBounds(null);

        rectangle._$x      = bounds.xMin;
        rectangle._$y      = bounds.yMin;
        rectangle._$width  = +$Math.abs(bounds.xMax - bounds.xMin);
        rectangle._$height = +$Math.abs(bounds.yMax - bounds.yMin);

        Util.$poolBoundsObject(bounds);

        return rectangle;
    }

    /**
     * matrix プロパティから取得される Matrix の Matrix._$matrix と同じ値を返しますが、matrix プロパティと異なり Matrix を複製しません。
     * 返される値は一時的に使用することのみできます。返される値の要素を直接更新してはいけません。返される値をプール（Util.$poolFloat32Array）してはいけません。
     *
     * @return {Float32Array}
     * @method
     * @private
     */
    _$rawMatrix ()
    {
        if (this._$matrix !== null) {
            return this._$matrix._$matrix;
        }

        const placeObject = this._$displayObject._$getPlaceObject();
        if (placeObject) {
            return placeObject.matrix;
        }

        return Util.$MATRIX_ARRAY_IDENTITY;
    }

    /**
     * colorTransform プロパティから取得される ColorTransform の colorTransform._$colorTransform と同じ値を返しますが、colorTransform プロパティと異なり ColorTransform を複製しません。
     * 返される値は一時的に使用することのみできます。返される値の要素を直接更新してはいけません。返される値をプール（Util.$poolFloat32Array）してはいけません。
     *
     * @return {Float32Array}
     * @method
     * @private
     */
    _$rawColorTransform ()
    {
        if (this._$colorTransform !== null) {
            return this._$colorTransform._$colorTransform;
        }

        const placeObject = this._$displayObject._$getPlaceObject();
        if (placeObject) {
            return placeObject.colorTransform;
        }

        return Util.$COLOR_ARRAY_IDENTITY;
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
    _$transform (matrix = null, color_transform = null, filters = null, blend_mode = "")
    {

        const object = this
            ._$displayObject
            ._$getPlaceObject();

        // Matrix
        this._$setMatrix(matrix, object);

        // ColorTransform
        this._$setColorTransform(color_transform, object);

        // Filter
        this._$setFilters(filters, object);

        // BlendMode
        this._$setBlendMode(blend_mode, object);

    }

    /**
     * @param {Float32Array} [matrix=null]
     * @param {object} [object=null]
     * @method
     * @private
     */
    _$setMatrix (matrix = null, object = null)
    {
        if (matrix || object) {
            this._$displayObject._$doChanged();
            Util.$isUpdated = true;
        }

        // Matrix
        if (!this._$matrix) {
            this._$matrix = Util.$getMatrix(1, 0, 0, 1, 0, 0);
            if (!matrix && object) {
                matrix = object.matrix;
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
     * @param {Float32Array} [color_transform=null]
     * @param {object} [object=null]
     * @method
     * @private
     */
    _$setColorTransform (color_transform = null, object = null)
    {
        if (color_transform || object) {
            this._$displayObject._$doChanged();
            Util.$isUpdated = true;
        }

        if (!this._$colorTransform) {
            this._$colorTransform = Util.$getColorTransform(1, 1, 1, 1, 0, 0, 0, 0);
            if (!color_transform && object) {
                color_transform = object.colorTransform;
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
     * @param {array}  [filters=null]
     * @param {object} [object=null]
     * @method
     * @private
     */
    _$setFilters (filters = null, object = null)
    {

        if (Util.$isArray(filters)) {

            if (this._$filters) {
                Util.$poolArray(this._$filters);
            }

            this._$filters = filters.slice(0);

            this._$displayObject._$doChanged();
            Util.$isUpdated = true;

            return ;
        }

        if (this._$filters) {
            return ;
        }

        if (!object) {
            this._$filters = Util.$getArray();
            return ;
        }

        if (object.filters) {
            this._$filters = object.filters.slice(0);
            return ;
        }

        if (object.surfaceFilterList) {

            const filterList = Util.$getArray();

            const length = object.surfaceFilterList.length;
            for (let idx = 0; idx < length; ++idx) {

                const filter = object.surfaceFilterList[idx];

                const filterClass = next2d.filters[filter.class];

                filterList.push(
                    new (filterClass.bind.apply(filterClass, filter.params))()
                );

            }

            object.filters = filterList;
            this._$filters = filterList.slice(0);
        }

    }

    /**
     * @param {string} [blend_mode=""]
     * @param {object} [object=null]
     * @method
     * @private
     */
    _$setBlendMode (blend_mode = "", object = null)
    {
        if (blend_mode) {

            this._$blendMode = blend_mode;

            this._$displayObject._$doChanged();
            Util.$isUpdated = true;

            return ;
        }

        if (this._$blendMode) {
            return ;
        }

        this._$blendMode = object
            ? object.blendMode
            : BlendMode.NORMAL;

    }
}
