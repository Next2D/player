/**
 * @class
 * @memberOf next2d.display
 */
class DisplayObject extends EventDispatcher
{
    /**
     * DisplayObject クラスは、表示リストに含めることのできるすべてのオブジェクトに関する基本クラスです。
     * DisplayObject クラス自体は、画面上でのコンテンツの描画のための API を含みません。
     * そのため、DisplayObject クラスのカスタムサブクラスを作成する場合は、
     * Shape、Sprite、Bitmap、SimpleButton、TextField または MovieClip など、
     * 画面上にコンテンツを描画する API を持つサブクラスの 1 つを拡張する必要があります。
     *
     * The DisplayObject class is the base class for all objects that can be placed on the display list.
     * The DisplayObject class itself does not include any APIs for rendering content onscreen.
     * For that reason, if you want create a custom subclass of the DisplayObject class,
     * you will want to extend one of its subclasses that do have APIs for rendering content onscreen,
     * such as the Shape, Sprite, Bitmap, SimpleButton, TextField, or MovieClip class.
     *
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
        this._$loaderInfoId = null;

        /**
         * @type {number|null}
         * @default null
         * @private
         */
        this._$fixLoaderInfoId = null;

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
    static toString()
    {
        return "[class DisplayObject]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return  {string}
     * @default next2d.display:DisplayObject
     * @const
     * @static
     */
    static get namespace ()
    {
        return "next2d.display:DisplayObject";
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
     * @default next2d.display:DisplayObject
     * @const
     * @static
     */
    get namespace ()
    {
        return "next2d.display:DisplayObject";
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
        alpha = Util.$clamp(0, 1, alpha, 0);

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

                this._$filters      = filters;
                placeObject.filters = filters;
            }

            return this._$filters.slice(0);
        }

        transform._$transform();
        this._$filters = transform._$filters;
        return this._$filters.slice(0);
    }
    set filters (filters)
    {
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

        const height = Util.$abs(bounds.yMax - bounds.yMin) / Util.$TWIPS;

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
        if (height > -1) {

            const bounds = (this.rotation)
                ? Util.$boundsMatrix(this._$getBounds(null), this._$transform._$rawMatrix())
                : this._$getBounds(null);

            const exHeight = Util.$abs(bounds.yMax - bounds.yMin) / Util.$TWIPS;
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
        if (this._$fixLoaderInfoId === null) {

            return (this._$loaderInfoId !== null)
                ? Util.$loaderInfos[this._$loaderInfoId]
                : null;

        }

        return Util.$loaderInfos[this._$fixLoaderInfoId];
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
        if (!Util.$event) {
            return 0;
        }
        return this.globalToLocal(Util.$currentMousePoint()).x;
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
        if (!Util.$event) {
            return 0;
        }
        return this.globalToLocal(Util.$currentMousePoint()).y;
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
        const sign = (rotation < 0) ? -1 : 1;

        // clamp
        let value = Util.$abs(rotation);
        if (value >= 360) {

            while (value >= 360) {
                value = value - 360;
            }

            rotation = value * sign;

        }

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

            matrix.b = scaleX  * Util.$sin(radianX);
            if (matrix.b === 1 || matrix.b === -1) {
                matrix.a = 0;
            } else {
                matrix.a = scaleX  * Util.$cos(radianX);
            }

            matrix.c = -scaleY * Util.$sin(radianY);
            if (matrix.c === 1 || matrix.c === -1) {
                matrix.d = 0;
            } else {
                matrix.d = scaleY  * Util.$cos(radianY);
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
        let xScale   = Util.$sqrt(matrix[0] * matrix[0] + matrix[1] * matrix[1]);
        if (0 > matrix.a) {
            xScale *= -1;
        }
        return xScale;
    }
    set scaleX (scale_x)
    {
        const transform = this._$transform;
        const matrix    = transform.matrix;
        switch (true) {

            case Util.$isNaN(matrix.b):
            case (matrix.b === 0):
                matrix.a = scale_x;
                break;

            default:
                const radianX = Util.$atan2(matrix.b, matrix.a);
                matrix.b = scale_x * Util.$sin(radianX);
                if (matrix.b === 1 || matrix.b === -1) {
                    matrix.a = 0;
                } else {
                    matrix.a = scale_x * Util.$cos(radianX);
                }
                break;

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
        let yScale   = Util.$sqrt(matrix[2] * matrix[2] + matrix[3] * matrix[3]);
        if (0 > matrix.d) {
            yScale *= -1;
        }
        return yScale;
    }
    set scaleY (scale_y)
    {
        const transform = this._$transform;
        const matrix    = transform.matrix;
        switch (true) {

            case Util.$isNaN(matrix.c):
            case (matrix.c === 0):
                matrix.d = scale_y;
                break;

            default:
                const radianY = Util.$atan2(-matrix.c, matrix.d);
                matrix.c = -scale_y * Util.$sin(radianY);
                if (matrix.c === 1 || matrix.c === -1) {
                    matrix.d = 0;
                } else {
                    matrix.d = scale_y  * Util.$cos(radianY);
                }
                break;

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
        if (this._$visible !== visible) {
            this._$doChanged();
            Util.$isUpdated = true;
            this._$visible = visible;
        }
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

        const width = Util.$abs(bounds.xMax - bounds.xMin) / Util.$TWIPS;
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
        if (width > -1) {

            const bounds = (this.rotation)
                ? Util.$boundsMatrix(this._$getBounds(null), this._$transform._$rawMatrix())
                : this._$getBounds(null);

            const exWidth = Util.$abs(bounds.xMax - bounds.xMin) / Util.$TWIPS;
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
        return this._$transform._$rawMatrix()[4] / Util.$TWIPS;
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
        return this._$transform._$rawMatrix()[5] / Util.$TWIPS;
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
     * @return {object}
     * @private
     */
    _$getPlaceObject ()
    {
        const placeId = this._$placeId;
        if (placeId === null) {
            return null;
        }

        const parent = this._$parent;
        if (!parent) {
            return null;
        }

        if (!parent._$placeController.length) {
            return null;
        }

        const frame = parent._$currentFrame || 1;
        const id = parent._$placeController[frame][placeId];
        return parent._$placeObjects[id];
    }

    /**
     * @return {object}
     * @private
     */
    _$getBounds ()
    {

    }

    /**
     * @return {object}
     * @private
     */
    _$doChanged ()
    {

    }

    /**
     * @return {void}
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
            this.dispatchEvent(new Event(Event.ADDED, true));

            // update
            this._$added = true;
        }


        if (!this._$addedStage && this._$stage !== null) {

            this.dispatchEvent(new Event(Event.ADDED_TO_STAGE));

            // update
            this._$addedStage = true;
        }
    }




}