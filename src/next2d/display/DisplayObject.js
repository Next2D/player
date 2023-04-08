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
    constructor ()
    {
        super();

        /**
         * @type {number}
         * @private
         */
        this._$id = -1;

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
         * @type {boolean}
         * @default false
         * @private
         */
        this._$created = false;

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$posted = false;

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

        /**
         * @type {number}
         * @default -1
         * @private
         */
        this._$currentPlaceId = -1;

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$changePlace = false;

        /**
         * @type {number}
         * @default null
         * @private
         */
        this._$scaleX = null;

        /**
         * @type {number}
         * @default null
         * @private
         */
        this._$scaleY = null;

        /**
         * @type {number}
         * @default null
         * @private
         */
        this._$rotation = null;
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
     * @public
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

        const height = $Math.abs(bounds.yMax - bounds.yMin);

        // object pool
        Util.$poolBoundsObject(bounds);

        switch (height) {

            case 0:
            case $Infinity:
            case -$Infinity:
                return 0;

            default:
                return +height.toFixed(2);

        }
    }
    set height (height)
    {
        height = +height;
        if (!$isNaN(height) && height > -1) {

            const bounds = this.rotation
                ? Util.$boundsMatrix(this._$getBounds(null), this._$transform._$rawMatrix())
                : this._$getBounds(null);

            const exHeight = $Math.abs(bounds.yMax - bounds.yMin);
            Util.$poolBoundsObject(bounds);

            switch (exHeight) {

                case 0:
                case $Infinity:
                case -$Infinity:
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
            if (Util.$rendererWorker && this._$mask._$stage) {
                this._$mask._$removeWorkerInstance();
            }

            this._$mask._$isMask = false;
            this._$mask = null;
        }

        if (mask instanceof DisplayObject) {
            if (Util.$rendererWorker) {
                mask._$createWorkerInstance();
            }

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
        if (this._$rotation !== null) {
            return this._$rotation;
        }

        const matrix = this._$transform._$rawMatrix();
        return $Math.atan2(matrix[1], matrix[0]) * Util.$Rad2Deg;
    }
    set rotation (rotation)
    {
        rotation = Util.$clamp(rotation % 360, 0 - 360, 360, 0);
        if (this._$rotation === rotation) {
            return ;
        }

        const transform = this._$transform;
        const matrix    = transform.matrix;

        const scaleX = $Math.sqrt(matrix.a * matrix.a + matrix.b * matrix.b);
        const scaleY = $Math.sqrt(matrix.c * matrix.c + matrix.d * matrix.d);
        if (rotation === 0) {

            matrix.a = scaleX;
            matrix.b = 0;
            matrix.c = 0;
            matrix.d = scaleY;

        } else {

            let radianX  = $Math.atan2(matrix.b,  matrix.a);
            let radianY  = $Math.atan2(0 - matrix.c, matrix.d);

            const radian = rotation * Util.$Deg2Rad;
            radianY      = radianY + radian - radianX;
            radianX      = radian;

            matrix.b = scaleX * $Math.sin(radianX);
            if (matrix.b === 1 || matrix.b === -1) {
                matrix.a = 0;
            } else {
                matrix.a = scaleX * $Math.cos(radianX);
            }

            matrix.c = -scaleY * $Math.sin(radianY);
            if (matrix.c === 1 || matrix.c === -1) {
                matrix.d = 0;
            } else {
                matrix.d = scaleY * $Math.cos(radianY);
            }
        }

        transform.matrix = matrix;
        Util.$poolMatrix(matrix);

        this._$rotation = rotation;
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
            this._$doChanged();
            Util.$isUpdated = true;
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
        if (this._$scaleX !== null) {
            return this._$scaleX;
        }

        const matrix = this._$transform._$rawMatrix();

        let xScale = $Math.sqrt(
            matrix[0] * matrix[0]
            + matrix[1] * matrix[1]
        );
        if (!$Number.isInteger(xScale)) {
            const value = xScale.toString();
            const index = value.indexOf("e");
            if (index !== -1) {
                xScale = +value.slice(0, index);
            }
            xScale = +xScale.toFixed(4);
        }

        return 0 > matrix[0] ? xScale * -1 : xScale;
    }
    set scaleX (scale_x)
    {
        scale_x = Util.$clamp(+scale_x,
            Util.$SHORT_INT_MIN, Util.$SHORT_INT_MAX
        );

        if (!$Number.isInteger(scale_x)) {
            const value = scale_x.toString();
            const index = value.indexOf("e");
            if (index !== -1) {
                scale_x = +value.slice(0, index);
            }
            scale_x = +scale_x.toFixed(4);
        }

        if (this._$scaleX === scale_x) {
            return ;
        }

        const transform = this._$transform;
        const matrix    = transform.matrix;
        if (matrix.b === 0 || $isNaN(matrix.b)) {

            matrix.a = scale_x;

        } else {

            let radianX = $Math.atan2(matrix.b, matrix.a);
            if (radianX === -$Math.PI) {
                radianX = 0;
            }

            matrix.b = scale_x * $Math.sin(radianX);
            matrix.a = scale_x * $Math.cos(radianX);

        }

        transform.matrix = matrix;
        Util.$poolMatrix(matrix);

        this._$scaleX = scale_x;
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
        if (this._$scaleY !== null) {
            return this._$scaleY;
        }

        const matrix = this._$transform._$rawMatrix();

        let yScale = $Math.sqrt(
            matrix[2] * matrix[2]
            + matrix[3] * matrix[3]
        );

        if (!$Number.isInteger(yScale)) {
            const value = yScale.toString();
            const index = value.indexOf("e");
            if (index !== -1) {
                yScale = +value.slice(0, index);
            }
            yScale = +yScale.toFixed(4);
        }

        return 0 > matrix[3] ? yScale * -1 : yScale;
    }
    set scaleY (scale_y)
    {
        scale_y = Util.$clamp(+scale_y,
            Util.$SHORT_INT_MIN, Util.$SHORT_INT_MAX
        );

        if (!$Number.isInteger(scale_y)) {
            const value = scale_y.toString();
            const index = value.indexOf("e");
            if (index !== -1) {
                scale_y = +value.slice(0, index);
            }
            scale_y = +scale_y.toFixed(4);
        }

        if (this._$scaleY === scale_y) {
            return ;
        }

        const transform = this._$transform;
        const matrix    = transform.matrix;

        if (matrix.c === 0 || $isNaN(matrix.c)) {

            matrix.d = scale_y;

        } else {

            let radianY = $Math.atan2(-matrix.c, matrix.d);
            if (radianY === -$Math.PI) {
                radianY = 0;
            }
            matrix.c = -scale_y * $Math.sin(radianY);
            matrix.d = scale_y  * $Math.cos(radianY);

        }

        transform.matrix = matrix;
        Util.$poolMatrix(matrix);

        this._$scaleY = scale_y;
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

        const width = $Math.abs(bounds.xMax - bounds.xMin);
        Util.$poolBoundsObject(bounds);

        switch (true) {

            case width === 0:
            case width === $Infinity:
            case width === 0 - $Infinity:
                return 0;

            default:
                return +width.toFixed(2);

        }
    }
    set width (width)
    {
        width = +width;
        if (!$isNaN(width) && width > -1) {

            const bounds = this.rotation
                ? Util.$boundsMatrix(this._$getBounds(null), this._$transform._$rawMatrix())
                : this._$getBounds(null);

            const exWidth = $Math.abs(bounds.xMax - bounds.xMin);
            Util.$poolBoundsObject(bounds);

            switch (true) {

                case exWidth === 0:
                case exWidth === $Infinity:
                case exWidth === -$Infinity:
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
            $Math.abs(xMax - xMin),
            $Math.abs(yMax - yMin)
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
        const sx = $Math.max(bounds1.xMin, bounds2.xMin);
        const sy = $Math.max(bounds1.yMin, bounds2.yMin);
        const ex = $Math.min(bounds1.xMax, bounds2.xMax);
        const ey = $Math.min(bounds1.yMax, bounds2.yMax);

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
        this._$variables.set(key, value);
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

            const index = this._$placeId;
            if (index === null) {
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

            const currentPlaceId  = map[index];
            this._$changePlace    = currentPlaceId !== this._$currentPlaceId;
            this._$currentPlaceId = currentPlaceId;
            this._$placeObject    = parent._$placeObjects[currentPlaceId];
        }
        return this._$placeObject;
    }

    /**
     * @return {object}
     * @method
     * @private
     */
    _$sync ()
    {
        const name = this.contentName;

        let loaderInfo = null;
        if (next2d.fw.response.has(name)) {
            loaderInfo = next2d.fw.response.get(name)._$loaderInfo;
        }

        if (!loaderInfo && next2d.fw.cache.has(name)) {
            loaderInfo = next2d.fw.cache.get(name)._$loaderInfo;
        }

        if (!loaderInfo) {
            loaderInfo = this._$loaderInfo || Util.$currentLoaderInfo;
        }

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
        if (Util.$rendererWorker && this._$created) {
            Util.$rendererWorker.postMessage({
                "command": "doChanged",
                "instanceId": this._$instanceId
            });
        }

        this._$posted  = false;
        this._$isNext  = true;
        this._$updated = true;

        let parent = this._$parent;
        if (parent) {
            parent._$doChanged();
        }
    }

    /**
     * @param  {CanvasToWebGLContext} context
     * @param  {WebGLTexture}         target_texture
     * @param  {Float32Array}         matrix
     * @param  {array}                filters
     * @param  {number}               width
     * @param  {number}               height
     * @return {WebGLTexture}
     * @method
     * @private
     */
    _$drawFilter (
        context, target_texture, matrix,
        filters, width, height
    ) {

        const cacheStore = Util.$cacheStore();

        const cacheKeys = [this._$instanceId, "f"];
        let cache = cacheStore.get(cacheKeys);

        const updated = this._$isFilterUpdated(
            width, height, matrix, filters, true
        );

        let texture;
        if (!cache || updated) {

            // cache clear
            if (cache) {

                cacheStore.set(cacheKeys, null);
                cache.layerWidth     = 0;
                cache.layerHeight    = 0;
                cache._$offsetX      = 0;
                cache._$offsetY      = 0;
                cache.matrix         = null;
                cache.colorTransform = null;

                context
                    .frameBuffer
                    .releaseTexture(cache);

                cache = null;
            }

            texture = this._$applyFilter(
                context, filters, target_texture,
                matrix, width, height
            );

            cacheStore.set(cacheKeys, texture);
        }

        if (cache) {
            texture = cache;
        }

        return texture;
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

        if (!this._$posted && Util.$rendererWorker) {
            this._$postProperty();
        }

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
     * @param  {Float32Array} matrix
     * @param  {array}        [filters=null]
     * @param  {boolean}      [can_apply=false]
     * @param  {number}       [position_x=0]
     * @param  {number}       [position_y=0]
     * @return {boolean}
     * @private
     */
    _$isFilterUpdated (
        width, height, matrix,
        filters = null, can_apply = false,
        position_x = 0, position_y = 0
    ) {

        // cache flag
        if (this._$isUpdated()) {
            return true;
        }

        // check filter data
        if (can_apply) {

            for (let idx = 0; idx < filters.length; ++idx) {

                if (!filters[idx]._$isUpdated()) {
                    continue;
                }

                return true;
            }

        }

        // check status
        const cache = Util.$cacheStore().get([this._$instanceId, "f"]);
        switch (true) {

            case cache === null:
            case cache.filterState !== can_apply:
            case cache.layerWidth  !== $Math.ceil(width):
            case cache.layerHeight !== $Math.ceil(height):
            case cache.matrix !==
            matrix[0] + "_" + matrix[1] + "_" + matrix[2] + "_" + matrix[3] + "_" +
            position_x + "_" + position_y:
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
     * @param  {Float32Array} matrix
     * @param  {number} width
     * @param  {number} height
     * @return {WebGLTexture}
     * @private
     */
    _$applyFilter (
        context, filters, target_texture,
        matrix, width, height
    ) {

        const xScale = +$Math.sqrt(
            matrix[0] * matrix[0]
            + matrix[1] * matrix[1]
        );
        const yScale = +$Math.sqrt(
            matrix[2] * matrix[2]
            + matrix[3] * matrix[3]
        );

        const radianX = $Math.atan2(matrix[1], matrix[0]);
        const radianY = $Math.atan2(-matrix[2], matrix[3]);

        const parentMatrix = Util.$getFloat32Array6(
            $Math.cos(radianX), $Math.sin(radianX),
            -$Math.sin(radianY), $Math.cos(radianY),
            width / 2, height / 2
        );

        const baseMatrix = Util.$getFloat32Array6(
            1, 0, 0, 1,
            -target_texture.width / 2,
            -target_texture.height / 2
        );

        const multiMatrix = Util.$multiplicationMatrix(
            parentMatrix, baseMatrix
        );
        Util.$poolFloat32Array6(parentMatrix);
        Util.$poolFloat32Array6(baseMatrix);

        const manager = context._$frameBufferManager;
        const currentAttachment = manager.currentAttachment;
        const attachment = manager.createCacheAttachment(width, height);
        context._$bind(attachment);

        Util.$resetContext(context);
        context.setTransform(
            multiMatrix[0], multiMatrix[1],
            multiMatrix[2], multiMatrix[3],
            multiMatrix[4], multiMatrix[5]
        );
        Util.$poolFloat32Array6(multiMatrix);

        context.drawImage(target_texture,
            0, 0, target_texture.width, target_texture.height
        );

        // init
        context._$offsetX = 0;
        context._$offsetY = 0;

        const filterMatrix = Util.$getFloat32Array6(
            xScale, 0, 0, yScale, 0, 0
        );

        let texture = null;
        for (let idx = 0; idx < filters.length; ++idx) {
            texture = filters[idx]._$applyFilter(context, filterMatrix);
        }

        Util.$poolFloat32Array6(filterMatrix);

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
              matrix[0] + "_" + matrix[1] + "_"
            + matrix[2] + "_" + matrix[3];

        texture.filterState = true;
        texture.layerWidth  = width;
        texture.layerHeight = height;

        context._$bind(currentAttachment);
        manager.releaseAttachment(attachment, false);

        return texture;
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
        const width  = $Math.abs(bounds.xMax - bounds.xMin);
        const height = $Math.abs(bounds.yMax - bounds.yMin);
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

            let multiMatrix = matrix;
            const rawMatrix = this._$transform._$rawMatrix();
            if (rawMatrix[0] !== 1 || rawMatrix[1] !== 0
                || rawMatrix[2] !== 0 || rawMatrix[3] !== 1
                || rawMatrix[4] !== 0 || rawMatrix[5] !== 0
            ) {
                multiMatrix = Util.$multiplicationMatrix(matrix, rawMatrix);
            }

            const baseBounds = this._$getBounds(null);
            const bounds = Util.$boundsMatrix(baseBounds, multiMatrix);
            Util.$poolBoundsObject(baseBounds);

            clipMatrix = context._$startClip(matrix, bounds);
            Util.$poolBoundsObject(bounds);

            if (multiMatrix !== matrix) {
                Util.$poolFloat32Array6(multiMatrix);
            }

            if (!clipMatrix) {
                return false;
            }

        }

        // start clip
        context._$enterClip();

        // mask start
        context._$beginClipDef();

        let containerClip = false;
        if (this instanceof DisplayObjectContainer) {
            containerClip = true;
            context._$updateContainerClipFlag(true);
        }

        this._$clip(context, clipMatrix || matrix);
        this._$updated = false;

        // container clip
        if (containerClip) {

            // update flag
            context._$updateContainerClipFlag(false);

            // execute clip
            context._$drawContainerClip();
        }

        // mask end
        context._$endClipDef();

        return clipMatrix;
    }

    /**
     * @return {void}
     * @method
     * @private
     */
    _$removeWorkerInstance ()
    {
        Util.$rendererWorker.postMessage({
            "command": "remove",
            "instanceId": this._$instanceId
        });
    }

    /**
     * @return {object}
     * @method
     * @private
     */
    _$postProperty ()
    {
        const message = {
            "command": "setProperty",
            "instanceId": this._$instanceId,
            "visible": this._$visible,
            "isMask": this._$isMask,
            "clipDepth": this._$clipDepth,
            "depth": this._$placeId,
            "maskId": -1
        };

        const mask = this._$mask;
        if (mask) {
            message.maskId = mask._$instanceId;

            let maskMatrix = Util.$MATRIX_ARRAY_IDENTITY;
            let parent = mask._$parent;
            while (parent) {

                maskMatrix = Util.$multiplicationMatrix(
                    parent._$transform._$rawMatrix(),
                    maskMatrix
                );

                parent = parent._$parent;
            }

            message.maskMatrix = maskMatrix;
        }

        if (this._$visible) {

            const transform = this._$transform;

            const matrix = transform._$rawMatrix();
            if (matrix[0] !== 1) {
                message.a = matrix[0];
            }

            if (matrix[1] !== 0) {
                message.b = matrix[1];
            }

            if (matrix[2] !== 0) {
                message.c = matrix[2];
            }

            if (matrix[3] !== 1) {
                message.d = matrix[3];
            }

            if (matrix[4] !== 0) {
                message.tx = matrix[4];
            }

            if (matrix[5] !== 0) {
                message.ty = matrix[5];
            }

            const colorTransform = transform._$rawColorTransform();
            if (colorTransform[0] !== 1) {
                message.f0 = colorTransform[0];
            }

            if (colorTransform[1] !== 1) {
                message.f1 = colorTransform[1];
            }

            if (colorTransform[2] !== 1) {
                message.f2 = colorTransform[2];
            }

            if (colorTransform[3] !== 1) {
                message.f3 = colorTransform[3];
            }

            if (colorTransform[4] !== 0) {
                message.f4 = colorTransform[4];
            }

            if (colorTransform[5] !== 0) {
                message.f5 = colorTransform[5];
            }

            if (colorTransform[6] !== 0) {
                message.f6 = colorTransform[6];
            }

            if (colorTransform[7] !== 0) {
                message.f7 = colorTransform[7];
            }

            const filters = this._$filters || this.filters;
            if (filters && filters.length) {
                const parameters = Util.$getArray();
                for (let idx = 0; idx < filters.length; ++idx) {
                    parameters.push(filters[idx]._$toArray());
                }

                message.filters = parameters;
            }

            const blendMode = this._$blendMode || this.blendMode;
            if (blendMode !== BlendMode.NORMAL) {
                message.blendMode = blendMode;
            }

            const scale9Grid = this._$scale9Grid;
            if (scale9Grid && this._$isUpdated()) {

                const baseMatrix = this
                    ._$parent
                    ._$transform
                    .concatenatedMatrix;

                message.matrixBase = baseMatrix._$matrix.slice();
                Util.$poolMatrix(baseMatrix);

                message.grid = {
                    "x": scale9Grid.x,
                    "y": scale9Grid.y,
                    "w": scale9Grid.width,
                    "h": scale9Grid.height
                };
            }
        }

        return message;
    }
}
