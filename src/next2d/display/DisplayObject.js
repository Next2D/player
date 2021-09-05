/**
 * DisplayObject クラスは、表示リストに含めることのできるすべてのオブジェクトに関する基本クラスです。
 * DisplayObject クラス自体は、画面上でのコンテンツの描画のための API を含みません。
 * そのため、DisplayObject クラスのカスタムサブクラスを作成する場合は、
 * Shape、Sprite、Bitmap、TextField または MovieClip など、
 * 画面上にコンテンツを描画する API を持つサブクラスの 1 つを拡張する必要があります。
 *
 * The DisplayObject class is the base class for all objects that can be placed on the display list.
 * The DisplayObject class itself does not include any APIs for rendering content onscreen.
 * For that reason, if you want create a custom subclass of the DisplayObject class,
 * you will want to extend one of its subclasses that do have APIs for rendering content onscreen,
 * such as the Shape, Sprite, Bitmap, TextField, or MovieClip class.
 *
 * @class
 * @memberOf next2d.display
 * @extends  EventDispatcher
 */
class DisplayObject extends EventDispatcher
{
    /**
     * @constructor
     * @public
     */
    constructor()
    {
        super();

        /**
         * @type {number}
         * @private
         */
        this._$id = 0;

        /**
         * @type {number}
         * @private
         */
        this._$instanceId = instanceId++;

        /**
         * @type {number}
         * @private
         */
        this._$dictionaryId = 0;

        /**
         * @type {number}
         * @private
         */
        this._$characterId = 0;

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$active = false;

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$isMask = false;

        /**
         * TODO
         * @type {null}
         * @default null
         * @private
         */
        this._$buffer = null;

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$updated = true;

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$added = false;

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$addedStage = false;

        /**
         * @type {array|null}
         * @default null
         * @private
         */
        this._$filters = null;

        /**
         * @type {string|null}
         * @default null
         * @private
         */
        this._$blendMode = null;

        /**
         * @type {Sprite|null}
         * @default null
         * @private
         */
        this._$hitObject = null;

        /**
         * @type {boolean}
         * @default true
         * @private
         */
        this._$isNext = true;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$clipDepth = 0;

        /**
         * @type {string}
         * @default ""
         * @private
         */
        this._$name = "";

        /**
         * @type {boolean}
         * @default true
         * @private
         */
        this._$visible = true;

        /**
         * @type {DisplayObject|null}
         * @default null
         * @private
         */
        this._$mask = null;

        /**
         * @type {Rectangle|null}
         * @default null
         * @private
         */
        this._$scale9Grid = null;

        /**
         * @type {DisplayObjectContainer|null}
         * @default null
         * @private
         */
        this._$parent = null;

        /**
         * @type {Stage|null}
         * @default null
         * @private
         */
        this._$stage = null;

        /**
         * @type {Sprite|null}
         * @default null
         * @private
         */
        this._$root = null;

        /**
         * @type {number|null}
         * @default null
         * @private
         */
        this._$loaderInfo = null;

        /**
         * @type {number|null}
         * @default null
         * @private
         */
        this._$placeId = null;

        /**
         * @type {number}
         * @default null
         * @private
         */
        this._$startFrame = 1;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$endFrame = 0;

        /**
         * @type {Transform}
         * @private
         */
        this._$transform = new Transform(this);

        /**
         * @type {Map}
         * @default null
         * @private
         */
        this._$variables = null;

        /**
         * @type {object}
         * @default null
         * @private
         */
        this._$placeObject = null;
    }

    /**
     * @description 指定されたクラスのストリングを返します。
     *              Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default [class DisplayObject]
     * @method
     * @static
     */
    static toString ()
    {
        return "[class DisplayObject]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return  {string}
     * @default next2d.display.DisplayObject
     * @const
     * @static
     */
    static get namespace ()
    {
        return "next2d.display.DisplayObject";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return  {string}
     * @default [object DisplayObject]
     * @method
     * @public
     */
    toString ()
    {
        return "[object DisplayObject]";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @return  {string}
     * @default next2d.display.DisplayObject
     * @const
     * @static
     */
    get namespace ()
    {
        return "next2d.display.DisplayObject";
    }

    /**
     * @description 指定されたオブジェクトのアルファ透明度値を示します。
     *              有効な値は 0.0（完全な透明）～ 1.0（完全な不透明）です。
     *              デフォルト値は 1.0 です。alpha が 0.0 に設定されている表示オブジェクトは、
     *              表示されない場合でも、アクティブです。
     *              Indicates the alpha transparency value of the object specified.
     *              Valid values are 0.0 (fully transparent) to 1.0 (fully opaque).
     *              The default value is 1.0. Display objects with alpha set to 0.0 are active,
     *              even though they are invisible.
     *
     * @member  {number}
     * @default 1
     * @public
     */
    get alpha ()
    {
        const colorTransform = this._$transform._$rawColorTransform();
        return colorTransform[3] + colorTransform[7] / 255;
    }
    set alpha (alpha)
    {
        alpha = Util.$clamp(alpha, 0, 1, 0);

        // clone
        const colorTransform = this._$transform.colorTransform;

        colorTransform._$colorTransform[3] = alpha;
        colorTransform._$colorTransform[7] = 0;

        this._$transform.colorTransform = colorTransform;
        Util.$poolColorTransform(colorTransform);
    }

    /**
     * @description 使用するブレンドモードを指定する BlendMode クラスの値です。
     *              A value from the BlendMode class that specifies which blend mode to use.
     *
     * @member  {string}
     * @default BlendMode.NORMAL
     * @public
     */
    get blendMode ()
    {
        if (this._$blendMode) {
            return this._$blendMode;
        }

        const transform = this._$transform;
        if (transform._$blendMode) {
            this._$blendMode = transform._$blendMode;
            return this._$blendMode;
        }

        const placeObject = this._$getPlaceObject();
        if (placeObject) {
            this._$blendMode = placeObject.blendMode;
            return this._$blendMode;
        }

        // create Transform
        transform._$transform();
        this._$blendMode = transform._$blendMode;
        return this._$blendMode;
    }
    set blendMode (blend_mode)
    {
        this._$transform._$transform(null, null, null, blend_mode);
        this._$blendMode = blend_mode;
    }

    /**
     * @description 表示オブジェクトに現在関連付けられている各フィルターオブジェクトが
     *              格納されているインデックス付きの配列です。
     *              An indexed array that contains each filter object
     *              currently associated with the display object.
     *
     * @member  {array}
     * @default {array}
     * @public
     */
    get filters ()
    {
        if (this._$filters) {
            return this._$filters;
        }

        const transform = this._$transform;
        if (transform._$filters) {
            this._$filters = transform._$filters.slice(0);
            return this._$filters;
        }

        const placeObject = this._$getPlaceObject();
        if (placeObject) {

            // create filter
            if (!placeObject.filters) {

                const filters = [];

                if (placeObject.surfaceFilterList) {

                    const length = placeObject.surfaceFilterList.length;
                    for (let idx = 0; idx < length; ++idx) {

                        const filter = placeObject.surfaceFilterList[idx];

                        const filterClass = next2d.filters[filter.class];

                        filters.push(
                            new (filterClass.bind.apply(filterClass, filter.params))()
                        );

                    }

                }

                placeObject.filters = filters;
            }

            if (!this._$filters) {
                this._$filters = placeObject.filters ;
            }

            return placeObject.filters.slice(0);
        }

        transform._$transform();
        this._$filters = transform._$filters;
        return this._$filters.slice(0);
    }
    set filters (filters)
    {
        if (!filters) {
            filters = Util.$getArray();
        }

        this._$transform._$transform(null, null, filters, null);
        this._$filters = filters;
    }

    /**
     * @description 表示オブジェクトの高さを示します（ピクセル単位）。
     *              Indicates the height of the display object, in pixels.
     *
     * @member {number}
     * @public
     */
    get height ()
    {
        const bounds = Util.$boundsMatrix(
            this._$getBounds(null),
            this._$transform._$rawMatrix()
        );

        const height = Util.$abs(bounds.yMax - bounds.yMin);

        // object pool
        Util.$poolBoundsObject(bounds);

        switch (height) {

            case 0:
            case Util.$Infinity:
            case -Util.$Infinity:
                return 0;

            default:
                return height;

        }
    }
    set height (height)
    {
        height = +height;
        if (!Util.$isNaN(height) && height > -1) {

            const bounds = this.rotation
                ? Util.$boundsMatrix(this._$getBounds(null), this._$transform._$rawMatrix())
                : this._$getBounds(null);

            const exHeight = Util.$abs(bounds.yMax - bounds.yMin);
            Util.$poolBoundsObject(bounds);

            switch (exHeight) {

                case 0:
                case Util.$Infinity:
                case -Util.$Infinity:
                    this.scaleY = 0;
                    break;

                default:
                    this.scaleY = height / exHeight;
                    break;

            }
        }
    }

    /**
     * @description この表示オブジェクトが属するファイルの読み込み情報を含む LoaderInfo オブジェクトを返します。
     *              Returns a LoaderInfo object containing information
     *              about loading the file to which this display object belongs.
     *
     * @member   {LoaderInfo}
     * @readonly
     * @public
     */
    get loaderInfo ()
    {
        return this._$loaderInfo;
    }

    /**
     * @description 呼び出し元の表示オブジェクトは、指定された mask オブジェクトによってマスクされます。
     *              The calling display object is masked by the specified mask object.
     *
     * @member {DisplayObject|null}
     * @public
     */
    get mask ()
    {
        return this._$mask;
    }
    set mask (mask)
    {
        if (mask === this._$mask) {
            return ;
        }

        // reset
        if (this._$mask) {
            this._$mask._$isMask = false;
            this._$mask = null;
        }

        if (mask instanceof DisplayObject) {
            mask._$isMask = true;
            this._$mask   = mask;
        }

        this._$doChanged();
    }

    /**
     * @description マウスまたはユーザー入力デバイスの x 軸の位置をピクセルで示します。
     *              Indicates the x coordinate of the mouse or user input device position, in pixels.
     *
     * @member  {number}
     * @default 0
     * @readonly
     * @public
     */
    get mouseX ()
    {
        return Util.$event
            ? this.globalToLocal(Util.$currentMousePoint()).x
            : 0;
    }

    /**
     * @description マウスまたはユーザー入力デバイスの y 軸の位置をピクセルで示します。
     *              Indicates the y coordinate of the mouse or user input device position, in pixels.
     *
     * @member  {number}
     * @default 0
     * @readonly
     * @public
     */
    get mouseY ()
    {
        return Util.$event
            ? this.globalToLocal(Util.$currentMousePoint()).y
            : 0;
    }

    /**
     * @description DisplayObject のインスタンス名を示します。
     *              Indicates the instance name of the DisplayObject.
     *
     * @member {string}
     * @public
     */
    get name ()
    {
        if (this._$name) {
            return this._$name;
        }
        return `instance${this._$instanceId}`;
    }
    set name (name)
    {
        this._$name = `${name}`;

        const parent = this._$parent;
        if (parent && parent._$names) {

            parent._$names.clear();

            const children = parent._$getChildren();
            const length = children.length;
            for (let idx = 0; idx < length; ++idx) {
                const child = children[idx];
                if (child._$name) {
                    parent._$names.set(child.name, child);
                }
            }
        }
    }

    /**
     * @description この表示オブジェクトを含む DisplayObjectContainer オブジェクトを示します。
     *              Indicates the DisplayObjectContainer object that contains this display object.
     *
     * @member  {DisplayObjectContainer|null}
     * @readonly
     * @public
     */
    get parent ()
    {
        return this._$parent;
    }

    /**
     * @description 読み込まれた SWF ファイル内の表示オブジェクトの場合、
     *              root プロパティはその SWF ファイルが表す表示リストのツリー構造部分の一番上にある表示オブジェクトとなります。
     *              For a display object in a loaded SWF file,
     *              the root property is the top-most display object
     *              in the portion of the display list's tree structure represented by that SWF file.
     *
     * @member   {DisplayObject|null}
     * @readonly
     * @public
     */
    get root ()
    {
        return this._$root;
    }

    /**
     * @description DisplayObject インスタンスの元の位置からの回転角を度単位で示します。
     *              Indicates the rotation of the DisplayObject instance,
     *              in degrees, from its original orientation.
     *
     * @member {number}
     * @public
     */
    get rotation ()
    {
        const matrix = this._$transform._$rawMatrix();
        return Util.$atan2(matrix[1], matrix[0]) * Util.$Rad2Deg;
    }
    set rotation (rotation)
    {
        rotation = Util.$clamp(rotation % 360, -360, 360, 0);

        const transform = this._$transform;
        const matrix    = transform.matrix;

        const scaleX = Util.$sqrt(matrix.a * matrix.a + matrix.b * matrix.b);
        const scaleY = Util.$sqrt(matrix.c * matrix.c + matrix.d * matrix.d);
        if (rotation === 0) {

            matrix.a = scaleX;
            matrix.b = 0;
            matrix.c = 0;
            matrix.d = scaleY;

        } else {

            let radianX  = Util.$atan2(matrix.b,  matrix.a);
            let radianY  = Util.$atan2(-matrix.c, matrix.d);

            const radian = rotation * Util.$Deg2Rad;
            radianY      = radianY + radian - radianX;
            radianX      = radian;

            matrix.b = scaleX * Util.$sin(radianX);
            if (matrix.b === 1 || matrix.b === -1) {
                matrix.a = 0;
            } else {
                matrix.a = scaleX * Util.$cos(radianX);
            }

            matrix.c = -scaleY * Util.$sin(radianY);
            if (matrix.c === 1 || matrix.c === -1) {
                matrix.d = 0;
            } else {
                matrix.d = scaleY * Util.$cos(radianY);
            }
        }

        transform.matrix = matrix;
        Util.$poolMatrix(matrix);
    }

    /**
     * @description 現在有効な拡大 / 縮小グリッドです。
     *              The current scaling grid that is in effect.
     *
     * @member {Rectangle}
     * @public
     */
    get scale9Grid ()
    {
        return this._$scale9Grid;
    }
    set scale9Grid (scale_9_grid)
    {
        this._$scale9Grid = null;
        if (scale_9_grid instanceof Rectangle) {
            this._$scale9Grid = scale_9_grid;
        }
    }

    /**
     * @description 基準点から適用されるオブジェクトの水平スケール（パーセンテージ）を示します。
     *              Indicates the horizontal scale (percentage)
     *              of the object as applied from the registration point.
     *
     * @member {number}
     * @public
     */
    get scaleX ()
    {
        const matrix = this._$transform._$rawMatrix();
        const xScale = Util.$sqrt(matrix[0] * matrix[0] + matrix[1] * matrix[1]);
        return 0 > matrix[0] ? xScale * -1 : xScale;
    }
    set scaleX (scale_x)
    {
        const transform = this._$transform;
        const matrix    = transform.matrix;
        if (matrix.b === 0 || Util.$isNaN(matrix.b)) {

            matrix.a = scale_x;

        } else {

            const radianX = Util.$atan2(matrix.b, matrix.a);

            matrix.b = scale_x * Util.$sin(radianX);
            matrix.a = matrix.b === 1 || matrix.b === -1
                ? 0
                : scale_x * Util.$cos(radianX);

        }

        transform.matrix = matrix;
        Util.$poolMatrix(matrix);
    }

    /**
     * @description 基準点から適用されるオブジェクトの垂直スケール（パーセンテージ）を示します。
     *              IIndicates the vertical scale (percentage)
     *              of an object as applied from the registration point.
     *
     * @member {number}
     * @public
     */
    get scaleY ()
    {
        const matrix = this._$transform._$rawMatrix();
        const yScale = Util.$sqrt(matrix[2] * matrix[2] + matrix[3] * matrix[3]);
        return 0 > matrix[3] ? yScale * -1 : yScale;
    }
    set scaleY (scale_y)
    {
        const transform = this._$transform;
        const matrix    = transform.matrix;

        if (matrix.c === 0 || Util.$isNaN(matrix.c)) {

            matrix.d = scale_y;

        } else {

            const radianY = Util.$atan2(-matrix.c, matrix.d);
            matrix.c = -scale_y * Util.$sin(radianY);
            matrix.d = matrix.c === 1 || matrix.c === -1
                ? 0
                : scale_y  * Util.$cos(radianY);

        }

        transform.matrix = matrix;
        Util.$poolMatrix(matrix);
    }

    /**
     * @description 表示オブジェクトのステージです。
     *              The Stage of the display object.
     *
     * @member   {Stage}
     * @readonly
     * @public
     */
    get stage ()
    {
        if (this._$stage) {
            return this._$stage;
        }

        // find parent
        const parent = this._$parent;
        if (parent) {

            if (parent instanceof Stage) {
                return parent;
            }

            return parent._$stage;
        }

        return null;
    }

    /**
     * @description 表示オブジェクトのマトリックス、カラー変換、
     *              ピクセル境界に関係するプロパティを持つオブジェクトです。
     *              An object with properties pertaining
     *              to a display object's matrix, color transform, and pixel bounds.
     *
     * @member {Transform}
     * @public
     */
    get transform ()
    {
        return this._$transform;
    }
    set transform (transform)
    {
        if (transform instanceof Transform) {
            this._$transform = transform;
        }
    }

    /**
     * @description 表示オブジェクトが可視かどうかを示します。
     *              Whether or not the display object is visible.
     *
     * @member {boolean}
     * @public
     */
    get visible ()
    {
        return this._$visible;
    }
    set visible (visible)
    {
        visible = !!visible;
        if (this._$visible !== visible) {
            this._$doChanged();
            Util.$isUpdated = true;
        }
        this._$visible = !!visible;
    }

    /**
     * @description 表示オブジェクトの幅を示します（ピクセル単位）。
     *              Indicates the width of the display object, in pixels.
     *
     * @member {number}
     * @public
     */
    get width ()
    {
        const bounds = Util.$boundsMatrix(
            this._$getBounds(null),
            this._$transform._$rawMatrix()
        );

        const width = Util.$abs(bounds.xMax - bounds.xMin);
        Util.$poolBoundsObject(bounds);

        switch (true) {

            case width === 0:
            case width === Util.$Infinity:
            case width === -Util.$Infinity:
                return 0;

            default:
                return width;

        }
    }
    set width (width)
    {
        width = +width;
        if (!Util.$isNaN(width) && width > -1) {

            const bounds = this.rotation
                ? Util.$boundsMatrix(this._$getBounds(null), this._$transform._$rawMatrix())
                : this._$getBounds(null);

            const exWidth = Util.$abs(bounds.xMax - bounds.xMin);
            Util.$poolBoundsObject(bounds);

            switch (true) {

                case exWidth === 0:
                case exWidth === Util.$Infinity:
                case exWidth === -Util.$Infinity:
                    this.scaleX = 0;
                    break;

                default:
                    this.scaleX = width / exWidth;
                    break;

            }
        }
    }

    /**
     * @description 親 DisplayObjectContainer のローカル座標を基準にした
     *              DisplayObject インスタンスの x 座標を示します。
     *              Indicates the x coordinate
     *              of the DisplayObject instance relative to the local coordinates
     *              of the parent DisplayObjectContainer.
     *
     * @member {number}
     * @public
     */
    get x ()
    {
        return this._$transform._$rawMatrix()[4];
    }
    set x (x)
    {
        const transform = this._$transform;

        const matrix = this._$transform.matrix;

        matrix.tx = x;

        transform.matrix = matrix;
        Util.$poolMatrix(matrix);
    }

    /**
     * @description 親 DisplayObjectContainer のローカル座標を基準にした
     *              DisplayObject インスタンスの y 座標を示します。
     *              Indicates the y coordinate
     *              of the DisplayObject instance relative to the local coordinates
     *              of the parent DisplayObjectContainer.
     *
     * @member {number}
     * @public
     */
    get y ()
    {
        return this._$transform._$rawMatrix()[5];
    }
    set y (y)
    {
        const transform = this._$transform;

        const matrix = transform.matrix;

        matrix.ty = y;

        transform.matrix = matrix;
        Util.$poolMatrix(matrix);
    }

    /**
     * @description targetCoordinateSpace オブジェクトの座標系を基準にして、
     *              表示オブジェクトの領域を定義する矩形を返します。
     *              Returns a rectangle that defines the area
     *              of the display object relative to the coordinate system
     *              of the targetCoordinateSpace object.
     *
     * @param  {DisplayObject} [target=null]
     * @return {Rectangle}
     */
    getBounds (target = null)
    {
        const baseBounds = this._$getBounds(null);

        const matrix = this._$transform.concatenatedMatrix;

        // to global
        const bounds = Util.$boundsMatrix(baseBounds, matrix._$matrix);

        // pool
        Util.$poolMatrix(matrix);
        Util.$poolBoundsObject(baseBounds);

        // create bounds object
        const targetBaseBounds = Util.$getBoundsObject(
            bounds.xMin,
            bounds.xMax,
            bounds.yMin,
            bounds.yMax
        );

        // pool
        Util.$poolBoundsObject(bounds);

        if (!target) {
            target = this;
        }

        const targetMatrix = target._$transform.concatenatedMatrix;
        targetMatrix.invert();

        const resultBounds = Util.$boundsMatrix(
            targetBaseBounds, targetMatrix._$matrix
        );

        const xMin = resultBounds.xMin;
        const yMin = resultBounds.yMin;
        const xMax = resultBounds.xMax;
        const yMax = resultBounds.yMax;

        // pool
        Util.$poolBoundsObject(targetBaseBounds);
        Util.$poolBoundsObject(resultBounds);
        Util.$poolMatrix(targetMatrix);

        return new Rectangle(
            xMin, yMin,
            Util.$abs(xMax - xMin),
            Util.$abs(yMax - yMin)
        );
    }

    /**
     * @description point オブジェクトをステージ（グローバル）座標から
     *              表示オブジェクトの（ローカル）座標に変換します。
     *              Converts the point object from the Stage (global) coordinates
     *              to the display object's (local) coordinates.
     *
     * @param  {Point} point
     * @return {Point}
     * @public
     */
    globalToLocal (point)
    {
        const matrix = this._$transform.concatenatedMatrix;
        matrix.invert();

        const newPoint = new Point(
            point.x * matrix.a + point.y * matrix.c + matrix.tx,
            point.x * matrix.b + point.y * matrix.d + matrix.ty
        );

        Util.$poolMatrix(matrix);

        return newPoint;
    }

    /**
     * @description 表示オブジェクトの境界ボックスを評価して、
     *              obj 表示オブジェクトの境界ボックスと重複または交差するかどうかを調べます。
     *              Evaluates the bounding box of the display object to see
     *              if it overlaps or intersects with the bounding box of the obj display object.
     *
     * @param   {DisplayObject} object
     * @returns {boolean}
     * @public
     */
    hitTestObject (object)
    {
        const baseBounds1 = this._$getBounds(null);
        const matrix1 = this._$transform.concatenatedMatrix;
        const bounds1 = Util.$boundsMatrix(baseBounds1, matrix1._$matrix);

        // pool
        Util.$poolMatrix(matrix1);
        Util.$poolBoundsObject(baseBounds1);

        const baseBounds2 = object._$getBounds(null);
        const matrix2 = object._$transform.concatenatedMatrix;
        const bounds2 = Util.$boundsMatrix(baseBounds2, matrix2._$matrix);

        // pool
        Util.$poolMatrix(matrix2);
        Util.$poolBoundsObject(baseBounds2);

        // calc
        const sx = Util.$max(bounds1.xMin, bounds2.xMin);
        const sy = Util.$max(bounds1.yMin, bounds2.yMin);
        const ex = Util.$min(bounds1.xMax, bounds2.xMax);
        const ey = Util.$min(bounds1.yMax, bounds2.yMax);

        // pool
        Util.$poolBoundsObject(bounds1);
        Util.$poolBoundsObject(bounds2);

        return ex - sx >= 0 && ey - sy >= 0;
    }

    /**
     * @description 表示オブジェクトを評価して、x および y パラメーターで指定された
     *              ポイントと重複または交差するかどうかを調べます。
     *              Evaluates the display object to see if it overlaps
     *              or intersects with the point specified by the x and y parameters.
     *
     * @param   {number}  x
     * @param   {number}  y
     * @param   {boolean} [shape_flag=false]
     * @returns {boolean}
     * @public
     */
    hitTestPoint (x, y, shape_flag = false)
    {
        if (shape_flag) {

            let matrix = Util.$MATRIX_ARRAY_IDENTITY;
            let parent = this._$parent;

            while (parent) {

                matrix = Util.$multiplicationMatrix(
                    parent._$transform._$rawMatrix(),
                    matrix
                );

                parent = parent._$parent;
            }

            Util.$hitContext.setTransform(1, 0, 0, 1, 0, 0);
            Util.$hitContext.beginPath();
            const result = this._$hit(Util.$hitContext, matrix, { "x": x, "y": y }, true);

            Util.$poolFloat32Array6(matrix);

            return result;
        }

        const baseBounds = this._$getBounds(null);
        const bounds = Util.$boundsMatrix(baseBounds, this._$transform._$rawMatrix());

        const rectX = bounds.xMin;
        const rectY = bounds.yMin;
        const rectW = bounds.xMax - bounds.xMin;
        const rectH = bounds.yMax - bounds.yMin;

        const point = this._$parent
            ? this._$parent.globalToLocal(new Point(x, y))
            : new Point(x, y);

        // pool
        Util.$poolBoundsObject(bounds);
        Util.$poolBoundsObject(baseBounds);

        return new Rectangle(rectX, rectY, rectW, rectH).containsPoint(point);
    }

    /**
     * @description point オブジェクトを表示オブジェクトの（ローカル）座標から
     *              ステージ（グローバル）座標に変換します。
     *              Converts the point object from the display object's (local) coordinates
     *              to the Stage (global) coordinates.
     *
     *
     * @param   {Point} point
     * @returns {Point}
     * @public
     */
    localToGlobal (point)
    {
        const matrix = this
            ._$transform
            .concatenatedMatrix;

        const newPoint = new Point(
            point.x * matrix.a + point.y * matrix.c + matrix.tx,
            point.x * matrix.b + point.y * matrix.d + matrix.ty
        );

        Util.$poolMatrix(matrix);

        return newPoint;
    }

    /**
     * @description クラスのローカル変数空間から値を取得
     *              Get a value from the local variable space of the class
     *
     * @param  {*} key
     * @return {*}
     * @method
     * @public
     */
    getLocalVariable (key)
    {
        if (!this._$variables) {
            return null;
        }

        if (this._$variables.has(key)) {
            return this._$variables.get(key);
        }
    }

    /**
     * @description クラスのローカル変数空間へ値を保存
     *              Store values in the local variable space of the class
     *
     * @param  {*} key
     * @param  {*} value
     * @return {void}
     * @method
     * @public
     */
    setLocalVariable (key, value)
    {
        if (!this._$variables) {
            this._$variables = Util.$getMap();
        }
        Util.$variables.set(key, value);
    }

    /**
     * @description クラスのローカル変数空間に値があるかどうかを判断します。
     *              Determines if there is a value in the local variable space of the class.
     *
     * @param  {*} key
     * @return {boolean}
     * @method
     * @public
     */
    hasLocalVariable (key)
    {
        return this._$variables
            ? this._$variables.has(key)
            : false;
    }

    /**
     * @description クラスのローカル変数空間の値を削除
     *              Remove values from the local variable space of a class
     *
     * @param  {*} key
     * @return {void}
     * @method
     * @public
     */
    deleteLocalVariable (key)
    {
        if (this._$variables && this._$variables.has(key)) {
            this._$variables.delete(key);
            if (!this._$variables.size) {
                Util.$poolMap(this._$variables);
                this._$variables = null;
            }
        }
    }

    /**
     * @description グローバル変数空間から値を取得
     *              Get a value from the global variable space
     *
     * @param  {*} key
     * @return {*}
     * @method
     * @public
     */
    getGlobalVariable (key)
    {
        if (Util.$variables.has(key)) {
            return Util.$variables.get(key);
        }
        return null;
    }

    /**
     * @description グローバル変数空間へ値を保存
     *              Save values to global variable space
     *
     * @param  {*} key
     * @param  {*} value
     * @return {void}
     * @method
     * @public
     */
    setGlobalVariable (key, value)
    {
        Util.$variables.set(key, value);
    }

    /**
     * @description グローバル変数空間に値があるかどうかを判断します。
     *              Determines if there is a value in the global variable space.
     *
     * @param  {*} key
     * @return {boolean}
     * @method
     * @public
     */
    hasGlobalVariable (key)
    {
        return Util.$variables.has(key);
    }

    /**
     * @description グローバル変数空間の値を削除
     *              Remove values from global variable space.
     *
     * @param  {*} key
     * @return {void}
     * @method
     * @public
     */
    deleteGlobalVariable (key)
    {
        if (Util.$variables.has(key)) {
            Util.$variables.delete(key);
        }
    }

    /**
     * @description グローバル変数空間に値を全てクリアします。
     *              Clear all values in the global variable space.
     *
     * @return {void}
     * @method
     * @public
     */
    clearGlobalVariable ()
    {
        return Util.$variables.clear();
    }

    /**
     * @return {object}
     * @method
     * @private
     */
    _$getPlaceObject ()
    {
        if (!this._$placeObject) {

            const placeId = this._$placeId;
            if (placeId === null) {
                return null;
            }

            const parent = this._$parent;
            if (!parent) {
                return null;
            }

            const placeMap = parent._$placeMap;
            if (!placeMap || !placeMap.length) {
                return null;
            }

            const map = placeMap[parent._$currentFrame || 1];
            if (!map) {
                return null;
            }

            this._$placeObject = parent._$placeObjects[map[placeId]];

        }
        return this._$placeObject;
    }

    /**
     * @return {object}
     * @private
     */
    _$sync ()
    {
        if (this._$loaderInfo) {
            return null;
        }

        const loaderInfo = Util.$currentLoaderInfo;
        if (!loaderInfo) {
            return null;
        }

        const characterId  = loaderInfo._$data.symbols.get(this.namespace);
        const character    = loaderInfo._$data.characters[characterId];

        this._$characterId = characterId;
        this._$loaderInfo  = loaderInfo;

        return character;
    }

    /**
     * @param  {object} tag
     * @param  {DisplayObjectContainer} parent
     * @return {object}
     * @method
     * @private
     */
    _$build (tag, parent)
    {
        const loaderInfo = parent._$loaderInfo;

        // setup
        this._$parent     = parent;
        this._$root       = parent._$root;
        this._$stage      = parent._$stage;
        this._$loaderInfo = loaderInfo;

        // bind tag data
        this._$characterId = tag.characterId | 0;
        this._$clipDepth   = tag.clipDepth | 0;
        this._$startFrame  = tag.startFrame | 0;
        this._$endFrame    = tag.endFrame | 0;
        this._$name        = tag.name || "";

        return loaderInfo._$data.characters[tag.characterId];
    }

    /**
     * @return {boolean}
     * @method
     * @private
     */
    _$isUpdated ()
    {
        return this._$updated;
    }

    /**
     * @return {void}
     * @method
     * @private
     */
    _$updateState ()
    {
        this._$isNext = true;

        let parent = this._$parent;
        if (parent) {
            parent._$updateState();
        }
    }

    /**
     * @return {object}
     * @method
     * @private
     */
    _$doChanged ()
    {
        this._$isNext  = true;
        this._$updated = true;

        let parent = this._$parent;
        if (parent) {
            parent._$doChanged();
        }
    }

    /**
     * @param   {array}  [matrix=null]
     * @returns {object}
     * @private
     */
    _$getLayerBounds (matrix = null)
    {
        const baseBounds = this._$getBounds(matrix);
        if (!matrix) {
            return baseBounds;
        }

        const filters = this._$filters || this.filters;
        const length = filters.length;
        if (!length) {
            return baseBounds;
        }

        let rect = new Rectangle(
            baseBounds.xMin,
            baseBounds.yMin,
            baseBounds.xMax - baseBounds.xMin,
            baseBounds.yMax - baseBounds.yMin
        );
        Util.$poolBoundsObject(baseBounds);

        for (let idx = 0; idx < length; ++idx) {
            rect = filters[idx]._$generateFilterRect(rect, null, null, true);
        }

        const xMin = rect._$x;
        const xMax = rect._$x + rect._$width;
        const yMin = rect._$y;
        const yMax = rect._$y + rect._$height;

        return Util.$getBoundsObject(xMin, xMax, yMin, yMax);
    }

    /**
     * @return {void}
     * @method
     * @private
     */
    _$executeAddedEvent ()
    {
        if (!this._$parent) {
            return ;
        }

        // add event
        if (!this._$added) {

            // added event
            if (this.willTrigger(Event.ADDED)) {
                this.dispatchEvent(new Event(Event.ADDED, true));
            }

            // update
            this._$added = true;
        }

        if (!this._$addedStage && this._$stage !== null) {

            if (this.willTrigger(Event.ADDED_TO_STAGE)) {
                this.dispatchEvent(new Event(Event.ADDED_TO_STAGE));
            }

            // update
            this._$addedStage = true;
        }
    }

    /**
     * @return {void}
     * @method
     * @private
     */
    _$prepareActions ()
    {
        this._$nextFrame();
    }

    /**
     * @return {boolean}
     * @method
     * @private
     */
    _$nextFrame ()
    {
        // added event
        this._$executeAddedEvent();

        this._$isNext = false;

        return false;
    }

    /**
     * @param  {array} [filters=null]
     * @return {boolean}
     * @private
     */
    _$canApply (filters = null)
    {
        if (filters) {
            for (let idx = 0; idx < filters.length; ++idx) {
                if (filters[idx]._$canApply()) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * @param  {number}       width
     * @param  {number}       height
     * @param  {Float64Array} matrix
     * @param  {Float64Array} color_transform
     * @param  {array}        [filters=null]
     * @param  {boolean}      [can_apply=false]
     * @param  {number}       [position_x=0]
     * @param  {number}       [position_y=0]
     * @return {boolean}
     * @private
     */
    _$isFilterUpdated (
        width, height, matrix, color_transform,
        filters = null, can_apply = false, position_x = 0, position_y = 0
    ) {

        // cache flag
        let updated = this._$isUpdated();
        if (updated) {
            return true;
        }

        // check filter data
        if (can_apply) {

            for (let idx = 0; idx < filters.length; ++idx) {

                if (filters[idx]._$isUpdated()) {
                    return true;
                }

            }

        }

        // check status
        const cache = Util.$cacheStore().get([this._$instanceId, "f"]);
        switch (true) {

            case cache === null:
            case cache.filterState !== can_apply:
            case cache.layerWidth  !== Util.$ceil(width):
            case cache.layerHeight !== Util.$ceil(height):
            case cache.matrix !==
            matrix[0] + "_" + matrix[1] + "_" + matrix[2] + "_" + matrix[3] + "_" +
            position_x + "_" + position_y:
            case cache.colorTransform !==
            color_transform[0] + "_" + color_transform[1] + "_" + color_transform[2] + "_" + color_transform[3] + "_" +
            color_transform[4] + "_" + color_transform[5] + "_" + color_transform[6] + "_" + color_transform[7]:
                return true;

            default:
                break;

        }

        return false;
    }

    /**
     * @param  {CanvasToWebGLContext} context
     * @param  {array} filters
     * @param  {WebGLTexture} target_texture
     * @param  {Float64Array} matrix
     * @param  {Float64Array} color_transform
     * @return {WebGLTexture}
     * @private
     */
    _$getFilterTexture (
        context, filters, target_texture, matrix, color_transform
    ) {

        const currentAttachment = context
            .frameBuffer
            .currentAttachment;

        const buffer = context
            .frameBuffer
            .createCacheAttachment(
                target_texture.width,
                target_texture.height
            );

        context._$bind(buffer);

        Util.$resetContext(context);
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.drawImage(target_texture,
            0, 0, target_texture.width, target_texture.height
        );

        // init
        context._$offsetX = 0;
        context._$offsetY = 0;

        let texture = null;
        for (let idx = 0; idx < filters.length; ++idx) {
            texture = filters[idx]._$applyFilter(context, matrix);
        }

        let offsetX = context._$offsetX;
        let offsetY = context._$offsetY;

        // reset
        context._$offsetX = 0;
        context._$offsetY = 0;

        // set offset
        texture._$offsetX = offsetX;
        texture._$offsetY = offsetY;

        // cache texture
        texture.matrix =
            matrix[0] + "_" + matrix[1] + "_" + matrix[2] + "_" + matrix[3]
            + "_0_0";

        texture.colorTransform =
            color_transform[0] + "_" + color_transform[1] + "_" + color_transform[2] + "_" + color_transform[3] + "_" +
            color_transform[4] + "_" + color_transform[5] + "_" + color_transform[6] + "_" + color_transform[7];

        texture.filterState = true;
        texture.layerWidth  = target_texture.width;
        texture.layerHeight = target_texture.height;

        context._$bind(currentAttachment);
        context
            .frameBuffer
            .releaseAttachment(buffer, false);

        return texture;
    }

    /**
     * @param  {CanvasToWebGLContext} context
     * @param  {array} matrix
     * @param  {array} color_transform
     * @return {object}
     * @private
     */
    _$preDraw (context, matrix, color_transform)
    {
        const originMatrix = this._$transform._$rawMatrix();
        const tMatrix = Util.$multiplicationMatrix(matrix, originMatrix);

        // size zero
        if (!tMatrix[0] && !tMatrix[1] || !tMatrix[2] && !tMatrix[3]) {
            return false;
        }

        // return object
        const object = Util.$getPreObject();

        // setup
        object.matrix = tMatrix;

        // check
        const filters   = this._$filters   || this.filters;
        const blendMode = this._$blendMode || this.blendMode;
        if (filters.length > 0 || blendMode !== BlendMode.NORMAL) {

            // check size
            const baseBounds = this._$getBounds(null);
            const bounds = Util.$boundsMatrix(baseBounds, tMatrix);
            const xMax   = +bounds.xMax;
            const xMin   = +bounds.xMin;
            const yMax   = +bounds.yMax;
            const yMin   = +bounds.yMin;

            // pool
            Util.$poolBoundsObject(baseBounds);
            Util.$poolBoundsObject(bounds);

            const width  = Util.$abs(xMax - xMin);
            const height = Util.$abs(yMax - yMin);
            if (0 >= width || 0 >= height) {
                return false;
            }

            if (0 > xMin + width || 0 > yMin + height) {
                return false;
            }

            const currentAttachment = context
                .frameBuffer
                .currentAttachment;
            if (xMin > currentAttachment.width
                || yMin > currentAttachment.height
            ) {
                return false;
            }

            // set origin position
            object.basePosition.x = originMatrix[4];
            object.basePosition.y = originMatrix[5];

            // check after size
            let baseLayerBounds = this._$getLayerBounds(null);
            const layerBounds = Util.$boundsMatrix(baseLayerBounds, tMatrix);

            // filter size
            let layerWidth  = Util.$abs(layerBounds.xMax - layerBounds.xMin);
            let layerHeight = Util.$abs(layerBounds.yMax - layerBounds.yMin);
            Util.$poolBoundsObject(layerBounds);

            if (layerWidth === width && layerHeight === height) {
                Util.$poolBoundsObject(baseLayerBounds);
                baseLayerBounds = null;
            }

            // move size
            let tx = tMatrix[4] - Util.$floor(xMin);
            let ty = tMatrix[5] - Util.$floor(yMin);

            let moveBounds = null;
            if (baseLayerBounds) {

                const layerMatrix = Util.$getFloat32Array6(
                    tMatrix[0], tMatrix[1], tMatrix[2], tMatrix[3], 0, 0
                );
                moveBounds = Util.$boundsMatrix(baseLayerBounds, layerMatrix);

                // pool
                Util.$poolBoundsObject(baseLayerBounds);
                Util.$poolFloat32Array6(layerMatrix);

                tx += -Util.$floor(moveBounds.xMin) - tx;
                ty += -Util.$floor(moveBounds.yMin) - ty;
            }

            let dx = Util.$floor(xMin);
            let dy = Util.$floor(yMin);
            let originX = xMin;
            let originY = yMin;

            if (moveBounds) {
                dx -= -Util.$floor(moveBounds.xMin) - (tMatrix[4] - dx);
                dy -= -Util.$floor(moveBounds.yMin) - (tMatrix[5] - dy);

                originX -= -moveBounds.xMin - (tMatrix[4] - originX);
                originY -= -moveBounds.yMin - (tMatrix[5] - originY);

                Util.$poolBoundsObject(moveBounds);
            }

            // set position
            object.position.dx = dx > 0 ? dx : 0;
            object.position.dy = dy > 0 ? dy : 0;

            // resize
            if (layerWidth + originX > currentAttachment.texture.width) {
                layerWidth -= layerWidth - currentAttachment.texture.width + originX;
            }

            if (layerHeight + originY > currentAttachment.texture.height) {
                layerHeight -= layerHeight - currentAttachment.texture.height + originY;
            }

            if (0 > dx) {
                tx += dx;
                layerWidth += originX;
            }

            if (0 > dy) {
                ty += dy;
                layerHeight += originY;
            }

            if (0 >= layerWidth || 0 >= layerHeight // size (-)
                || !layerWidth || !layerHeight // NaN or Infinity
            ) {
                Util.$poolPreObject(object);
                return false;
            }

            // start layer
            context._$startLayer(
                Util.$getBoundsObject(originX, 0, originY, 0)
            );

            // check cache
            object.canApply = this._$canApply(filters);
            let updated = this._$isFilterUpdated(
                layerWidth, layerHeight, tMatrix, color_transform, filters,
                object.canApply, object.basePosition.x, object.basePosition.y
            );

            // cache
            const currentMaskBuffer = context._$cacheCurrentBuffer;
            context._$cacheCurrentBuffer = null;

            const rect = context._$cacheCurrentBounds;
            const currentMaskBounds = Util.$getBoundsObject(rect.x, rect.w, rect.y, rect.h);

            if (updated) {
                this._$buffer = context
                    .frameBuffer
                    .createCacheAttachment(
                        Util.$ceil(layerWidth),
                        Util.$ceil(layerHeight),
                        false
                    );
                context._$bind(this._$buffer);
            }

            // setup
            object.isFilter          = true;
            object.isUpdated         = updated;
            object.color             = Util.$getFloat32Array8();
            object.baseMatrix        = tMatrix;
            object.baseColor         = color_transform;
            object.currentAttachment = currentAttachment;
            object.currentMaskBuffer = currentMaskBuffer;
            object.currentMaskBounds = currentMaskBounds;
            object.filters           = filters;
            object.blendMode         = blendMode;
            object.layerWidth        = layerWidth;
            object.layerHeight       = layerHeight;
            object.matrix            = Util.$getFloat32Array6(
                tMatrix[0], tMatrix[1], tMatrix[2], tMatrix[3], tx, ty
            );
        }

        return object;
    }

    /**
     * @param  {CanvasToWebGLContext} context
     * @param  {Float32Array} matrix
     * @param  {Float32Array} color_transform
     * @param  {object} object
     * @return {void}
     * @method
     * @private
     */
    _$postDraw (context, matrix, color_transform, object)
    {

        // cache
        const cacheKeys = [this._$instanceId, "f"];

        // cache or new texture
        let texture = null;
        if (this._$buffer) {

            texture = context
                .frameBuffer
                .getTextureFromCurrentAttachment();

            const cacheTexture = Util.$cacheStore().get(cacheKeys);
            if (cacheTexture) {
                Util.$cacheStore().set(cacheKeys, null);
                context
                    .frameBuffer
                    .releaseTexture(cacheTexture);
            }

        } else {
            texture = Util.$cacheStore().get(cacheKeys);
        }

        // blend only
        if (!object.canApply) {
            texture._$offsetX = 0;
            texture._$offsetY = 0;
        }

        // set cache offset
        let offsetX = texture._$offsetX;
        let offsetY = texture._$offsetY;

        // execute filter
        if (object.isUpdated && object.canApply) {

            // cache clear
            let cache = Util.$cacheStore().get(cacheKeys);
            if (cache) {

                // reset cache params
                Util.$cacheStore().set(cacheKeys, null);
                cache.layerWidth     = 0;
                cache.layerHeight    = 0;
                cache._$offsetX      = 0;
                cache._$offsetY      = 0;
                cache.matrix         = null;
                cache.colorTransform = null;
                context.frameBuffer.releaseTexture(cache);

                cache  = null;
            }

            // apply filter
            const length = object.filters.length;
            if (length) {

                // init
                context._$offsetX = 0;
                context._$offsetY = 0;

                for (let idx = 0; idx < length; ++idx) {
                    texture = object.filters[idx]._$applyFilter(context, matrix);
                }

                offsetX = context._$offsetX;
                offsetY = context._$offsetY;

                // reset
                context._$offsetX = 0;
                context._$offsetY = 0;

                // set offset
                texture._$offsetX = offsetX;
                texture._$offsetY = offsetY;

            }
        }

        // update cache params
        if (object.isUpdated) {

            texture.filterState = object.canApply;

            // cache texture
            const mat = object.baseMatrix;
            texture.matrix = mat[0] + "_" + mat[1] + "_" + mat[2] + "_" + mat[3]
                + "_" + object.basePosition.x + "_" + object.basePosition.y;

            const col = object.baseColor;
            texture.colorTransform =
                col[0] + "_" + col[1] + "_" + col[2] + "_" + col[3] + "_" +
                col[4] + "_" + col[5] + "_" + col[6] + "_" + col[7];

            texture.layerWidth  = object.layerWidth;
            texture.layerHeight = object.layerHeight;
        }

        // cache texture
        Util.$cacheStore().set(cacheKeys, texture);
        Util.$poolArray(cacheKeys);

        // set current buffer
        context._$bind(object.currentAttachment);

        // setup
        const width  = texture.width;
        const height = texture.height;

        // set
        Util.$resetContext(context);
        context.setTransform(1, 0, 0, 1, 0, 0);
        context._$globalAlpha = Util.$clamp(color_transform[3] + color_transform[7] / 255, 0, 1);
        context._$globalCompositeOperation = object.blendMode;
        context.drawImage(texture,
            -offsetX + object.position.dx,
            -offsetY + object.position.dy,
            width, height,
            color_transform
        );

        // end blend
        context._$endLayer();

        // pool buffer
        if (this._$buffer) {

            context
                .frameBuffer
                .releaseAttachment(this._$buffer, false);

            this._$buffer = null;
        }

        // reset
        context._$cacheCurrentBuffer   = object.currentMaskBuffer;
        context._$cacheCurrentBounds.x = object.currentMaskBounds.xMin;
        context._$cacheCurrentBounds.y = object.currentMaskBounds.yMin;
        context._$cacheCurrentBounds.w = object.currentMaskBounds.xMax;
        context._$cacheCurrentBounds.h = object.currentMaskBounds.yMax;

        // object pool
        Util.$poolFloat32Array8(object.color);
        Util.$poolFloat32Array6(object.matrix);
        Util.$poolFloat32Array6(object.baseMatrix);
        Util.$poolBoundsObject(object.currentMaskBounds);
        Util.$poolPreObject(object);
    }

    /**
     * @param  {Float32Array} matrix
     * @return {boolean}
     * @method
     * @private
     */
    _$shouldClip (matrix)
    {
        if (this instanceof TextField) {
            if (!this.textWidth || !this.textHeight) {
                return false;
            }
            return true;
        }

        const bounds = this._$getBounds(matrix);
        const width  = Util.$abs(bounds.xMax - bounds.xMin);
        const height = Util.$abs(bounds.yMax - bounds.yMin);
        Util.$poolBoundsObject(bounds);

        // size 0
        if (!width || !height) {
            return false;
        }
        return true;
    }

    /**
     * @param  {CanvasToWebGLContext} context
     * @param  {Float32Array} matrix
     * @return {Float32Array|boolean|null}
     * @method
     * @private
     */
    _$startClip (context, matrix)
    {
        let clipMatrix = null;

        // ネストしてない初回のマスクだけ実行
        // ネストしてる場合は初回に作られたbufferを流用
        if (!context._$cacheCurrentBuffer) {

            clipMatrix = context._$startClip(this, matrix);
            if (!clipMatrix) {
                return false;
            }

        }

        // start clip
        context._$enterClip();

        // mask start
        context._$beginClipDef();

        if (this instanceof DisplayObjectContainer) {
            context._$mask._$containerClip = true;
        }

        this._$clip(context, clipMatrix || matrix);
        this._$updated = false;

        // container clip
        if (context._$mask._$containerClip) {

            // update flag
            context._$mask._$containerClip = false;

            // execute clip
            context._$drawContainerClip();
        }

        // mask end
        context._$endClipDef();

        return clipMatrix;
    }
}