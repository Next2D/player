import { Event as Next2DEvent } from "../events/Event";
import { EventDispatcher } from "../events/EventDispatcher";
import { Transform } from "../geom/Transform";
import { Rectangle } from "../geom/Rectangle";
import { Point } from "../geom/Point";
import type { Stage } from "./Stage";
import type { LoaderInfo } from "./LoaderInfo";
import type { Sprite } from "./Sprite";
import type { FilterArrayImpl } from "../../../interface/FilterArrayImpl";
import type { BlendModeImpl } from "../../../interface/BlendModeImpl";
import type { ParentImpl } from "../../../interface/ParentImpl";
import type { ColorTransform } from "../geom/ColorTransform";
import type { PlaceObjectImpl }  from "../../../interface/PlaceObjectImpl";
import type { BoundsImpl } from "../../../interface/BoundsImpl";
import type { DictionaryTagImpl } from "../../../interface/DictionaryTagImpl";
import type { PropertyMessageMapImpl } from "../../../interface/PropertyMessageMapImpl";
import type { Player } from "../../player/Player";
import type { CacheStore } from "../../util/CacheStore";
import type { CanvasToWebGLContext } from "../../../webgl/CanvasToWebGLContext";
import type { DisplayObjectImpl } from "../../../interface/DisplayObjectImpl";
import type { Matrix } from "../geom/Matrix";
import type { Character } from "../../../interface/Character";
import type { FrameBufferManager } from "../../../webgl/FrameBufferManager";
import type { AttachmentImpl } from "../../../interface/AttachmentImpl";
import type { PropertyMessageImpl } from "../../../interface/PropertyMessageImpl";
import { $window } from "../../util/Shortcut";
import {
    $doUpdated,
    $getCurrentLoaderInfo, $getEvent,
    $getInstanceId
} from "../../util/Global";
import {
    $currentMousePoint,
    $currentPlayer,
    $poolColorTransform,
    $rendererWorker,
    $poolMatrix,
    $hitContext,
    $variables
} from "../../util/Util";
import {
    $clamp,
    $getArray,
    $boundsMatrix,
    $Math,
    $poolBoundsObject,
    $Infinity,
    $getBoundsObject,
    $isNaN,
    $Deg2Rad,
    $Number,
    $Rad2Deg,
    $SHORT_INT_MIN,
    $SHORT_INT_MAX,
    $MATRIX_ARRAY_IDENTITY,
    $multiplicationMatrix,
    $poolFloat32Array6,
    $getMap,
    $poolMap,
    $getFloat32Array6
} from "../../util/RenderUtil";

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
export class DisplayObject extends EventDispatcher
{
    public readonly _$instanceId: number;
    protected _$id: number;
    protected _$stage: Stage | null;
    protected _$parent: ParentImpl<any> | null;
    protected _$scale9Grid: Rectangle | null;
    protected _$characterId: number;
    protected _$active: boolean;
    protected _$isMask: boolean;
    public _$updated: boolean;
    protected _$added: boolean;
    protected _$addedStage: boolean;
    protected _$filters: FilterArrayImpl | null;
    protected _$blendMode: BlendModeImpl | null;
    protected _$transform: Transform;
    public _$hitObject: Sprite | null;
    protected _$isNext: boolean;
    protected _$created: boolean;
    protected _$posted: boolean;
    protected _$clipDepth: number;
    protected _$name: string;
    protected _$mask: DisplayObjectImpl<any> | null;
    protected _$visible: boolean;
    protected _$root: ParentImpl<any> | null;
    public _$loaderInfo: LoaderInfo | null;
    protected _$scaleX: number | null;
    protected _$scaleY: number | null;
    protected _$variables: Map<any, any> | null;
    protected _$placeObject: PlaceObjectImpl | null;
    protected _$rotation: number | null;
    protected _$changePlace: boolean;
    protected _$currentPlaceId: number;
    protected _$placeId: number;
    protected _$startFrame: number;
    protected _$endFrame: number;

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
        this._$instanceId = $getInstanceId();

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
         * @type {Sprite | null}
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
        this._$placeId = -1;

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
    get alpha (): number
    {
        const colorTransform: Float32Array = this
            ._$transform
            ._$rawColorTransform();

        return colorTransform[3] + colorTransform[7] / 255;
    }
    set alpha (alpha: number)
    {
        alpha = $clamp(alpha, 0, 1, 0);

        // clone
        const colorTransform: ColorTransform = this
            ._$transform
            .colorTransform;

        colorTransform._$colorTransform[3] = alpha;
        colorTransform._$colorTransform[7] = 0;

        this._$transform.colorTransform = colorTransform;
        $poolColorTransform(colorTransform);
    }

    /**
     * @description 使用するブレンドモードを指定する BlendMode クラスの値です。
     *              A value from the BlendMode class that specifies which blend mode to use.
     *
     * @member  {string}
     * @default BlendMode.NORMAL
     * @public
     */
    get blendMode (): BlendModeImpl
    {
        // use cache
        if (this._$blendMode) {
            return this._$blendMode;
        }

        const transform: Transform = this._$transform;
        if (transform._$blendMode) {

            // cache
            this._$blendMode = transform._$blendMode;

            return transform._$blendMode;
        }

        const placeObject: PlaceObjectImpl | null = this._$getPlaceObject();
        if (placeObject && placeObject.blendMode) {

            // cache
            this._$blendMode = placeObject.blendMode;

            return placeObject.blendMode;
        }

        // cache
        this._$blendMode = "normal";

        return "normal";
    }
    set blendMode (blend_mode: BlendModeImpl)
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
    get filters (): FilterArrayImpl
    {
        // use cache
        if (this._$filters) {
            const filters: FilterArrayImpl = $getArray();
            for (let idx: number = 0; idx < this._$filters.length; ++idx) {
                filters[idx] = this._$filters[idx].clone();
            }
            return filters;
        }

        const transform: Transform = this._$transform;
        if (transform._$filters) {

            const clone: FilterArrayImpl   = $getArray();
            const filters: FilterArrayImpl = $getArray();
            for (let idx: number = 0; idx < transform._$filters.length; ++idx) {
                const filter = transform._$filters[idx];
                clone[idx]   = filter.clone();
                filters[idx] = filter.clone();
            }

            // cache
            this._$filters = clone;

            return filters;
        }

        const placeObject: PlaceObjectImpl | null = this._$getPlaceObject();
        if (placeObject && placeObject.surfaceFilterList) {

            // create filter
            if (!placeObject.filters) {
                placeObject.filters = transform
                    ._$buildFilter(placeObject.surfaceFilterList);
            }

            const clone: FilterArrayImpl = $getArray();

            // @ts-ignore
            const filters: FilterArrayImpl = $getArray();
            for (let idx: number = 0; idx < placeObject.filters.length; ++idx) {
                const filter = placeObject.filters[idx];
                clone[idx]   = filter.clone();
                filters[idx] = filter.clone();
            }

            // cache
            this._$filters = clone;

            return filters;
        }

        const filters: FilterArrayImpl = $getArray();

        // cache
        this._$filters = filters;

        return filters;
    }
    set filters (filters: FilterArrayImpl | null)
    {
        if (!filters) {
            filters = $getArray();
        }

        this._$transform._$transform(null, null, filters);
        this._$filters = filters;
    }

    /**
     * @description 表示オブジェクトの高さを示します（ピクセル単位）。
     *              Indicates the height of the display object, in pixels.
     *
     * @member {number}
     * @public
     */
    get height (): number
    {
        const baseBounds: BoundsImpl = "_$getBounds" in this && typeof this._$getBounds === "function"
            ? this._$getBounds() as BoundsImpl
            : $getBoundsObject();

        const bounds: BoundsImpl = $boundsMatrix(
            baseBounds,
            this._$transform._$rawMatrix()
        );
        $poolBoundsObject(baseBounds);

        const height: number = $Math.abs(bounds.yMax - bounds.yMin);

        // object pool
        $poolBoundsObject(bounds);

        switch (height) {

            case 0:
            case $Infinity:
            case -$Infinity:
                return 0;

            default:
                return +height.toFixed(2);

        }
    }
    set height (height: number)
    {
        height = +height;
        if (!$isNaN(height) && height > -1) {

            const baseBounds: BoundsImpl = "_$getBounds" in this && typeof this._$getBounds === "function"
                ? this._$getBounds() as BoundsImpl
                : $getBoundsObject();

            const rotation: number = this.rotation;
            const bounds = rotation
                ? $boundsMatrix(baseBounds, this._$transform._$rawMatrix())
                : baseBounds;

            if (rotation) {
                $poolBoundsObject(baseBounds);
            }

            const exHeight = $Math.abs(bounds.yMax - bounds.yMin);
            $poolBoundsObject(bounds);

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
     * @member  {LoaderInfo}
     * @default null
     * @readonly
     * @public
     */
    get loaderInfo (): LoaderInfo | null
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
    get mask (): DisplayObjectImpl<any> | null
    {
        return this._$mask;
    }
    set mask (mask: DisplayObjectImpl<any> | null)
    {
        if (mask === this._$mask) {
            return ;
        }

        // reset
        if (this._$mask) {
            if ($rendererWorker && this._$mask.stage) {
                this._$mask._$removeWorkerInstance();
            }

            this._$mask._$isMask = false;
            this._$mask = null;
        }

        if (mask) {
            if ($rendererWorker
                && "_$createWorkerInstance" in mask
                && typeof mask._$createWorkerInstance === "function"
            ) {
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
    get mouseX (): number
    {
        return $getEvent()
            ? this.globalToLocal($currentMousePoint()).x
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
    get mouseY (): number
    {
        return $getEvent()
            ? this.globalToLocal($currentMousePoint()).y
            : 0;
    }

    /**
     * @description DisplayObject のインスタンス名を示します。
     *              Indicates the instance name of the DisplayObject.
     *
     * @member {string}
     * @public
     */
    get name (): string
    {
        if (this._$name) {
            return this._$name;
        }
        return `instance${this._$instanceId}`;
    }
    set name (name: string)
    {
        this._$name = `${name}`;

        const parent: ParentImpl<any> | null = this._$parent;
        if (parent && parent._$names) {

            parent._$names.clear();

            const children: DisplayObjectImpl<any>[] = parent._$getChildren();
            for (let idx: number = 0; idx < children.length; ++idx) {
                const child: DisplayObjectImpl<any> = children[idx];
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
     * @member  {DisplayObjectContainer | null}
     * @readonly
     * @public
     */
    get parent (): ParentImpl<any> | null
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
    get root (): ParentImpl<any>
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
    get rotation (): number
    {
        if (this._$rotation !== null) {
            return this._$rotation;
        }

        const matrix: Float32Array = this._$transform._$rawMatrix();
        return $Math.atan2(matrix[1], matrix[0]) * $Rad2Deg;
    }
    set rotation (rotation: number)
    {
        rotation = $clamp(rotation % 360, 0 - 360, 360, 0);
        if (this._$rotation === rotation) {
            return ;
        }

        const transform: Transform = this._$transform;
        const matrix: Matrix = transform.matrix;

        const scaleX: number = $Math.sqrt(matrix.a * matrix.a + matrix.b * matrix.b);
        const scaleY: number = $Math.sqrt(matrix.c * matrix.c + matrix.d * matrix.d);
        if (rotation === 0) {

            matrix.a = scaleX;
            matrix.b = 0;
            matrix.c = 0;
            matrix.d = scaleY;

        } else {

            let radianX: number = $Math.atan2(matrix.b,  matrix.a);
            let radianY: number = $Math.atan2(0 - matrix.c, matrix.d);

            const radian: number = rotation * $Deg2Rad;
            radianY = radianY + radian - radianX;
            radianX = radian;

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
        $poolMatrix(matrix);

        this._$rotation = rotation;
    }

    /**
     * @description 現在有効な拡大 / 縮小グリッドです。
     *              The current scaling grid that is in effect.
     *
     * @member {Rectangle}
     * @public
     */
    get scale9Grid (): Rectangle | null
    {
        return this._$scale9Grid;
    }
    set scale9Grid (scale_9_grid: Rectangle | null)
    {
        if (this._$scale9Grid !== scale_9_grid) {
            this._$scale9Grid = scale_9_grid;
            this._$doChanged();
            $doUpdated();
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
    get scaleX (): number
    {
        if (this._$scaleX !== null) {
            return this._$scaleX;
        }

        const matrix: Float32Array = this._$transform._$rawMatrix();

        let xScale: number = $Math.sqrt(
            matrix[0] * matrix[0]
            + matrix[1] * matrix[1]
        );
        if (!$Number.isInteger(xScale)) {
            const value: string = xScale.toString();
            const index: number = value.indexOf("e");
            if (index !== -1) {
                xScale = +value.slice(0, index);
            }
            xScale = +xScale.toFixed(4);
        }

        return 0 > matrix[0] ? xScale * -1 : xScale;
    }
    set scaleX (scale_x: number)
    {
        scale_x = $clamp(+scale_x,
            $SHORT_INT_MIN, $SHORT_INT_MAX
        );

        if (!$Number.isInteger(scale_x)) {
            const value: string = scale_x.toString();
            const index: number = value.indexOf("e");
            if (index !== -1) {
                scale_x = +value.slice(0, index);
            }
            scale_x = +scale_x.toFixed(4);
        }

        if (this._$scaleX === scale_x) {
            return ;
        }

        const transform: Transform = this._$transform;
        const matrix: Matrix = transform.matrix;
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
        $poolMatrix(matrix);

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
    get scaleY (): number
    {
        if (this._$scaleY !== null) {
            return this._$scaleY;
        }

        const matrix: Float32Array = this._$transform._$rawMatrix();

        let yScale: number = $Math.sqrt(
            matrix[2] * matrix[2]
            + matrix[3] * matrix[3]
        );

        if (!$Number.isInteger(yScale)) {
            const value: string = yScale.toString();
            const index: number = value.indexOf("e");
            if (index !== -1) {
                yScale = +value.slice(0, index);
            }
            yScale = +yScale.toFixed(4);
        }

        return 0 > matrix[3] ? yScale * -1 : yScale;
    }
    set scaleY (scale_y: number)
    {
        scale_y = $clamp(+scale_y,
            $SHORT_INT_MIN, $SHORT_INT_MAX
        );

        if (!$Number.isInteger(scale_y)) {
            const value: string = scale_y.toString();
            const index: number = value.indexOf("e");
            if (index !== -1) {
                scale_y = +value.slice(0, index);
            }
            scale_y = +scale_y.toFixed(4);
        }

        if (this._$scaleY === scale_y) {
            return ;
        }

        const transform: Transform = this._$transform;
        const matrix: Matrix = transform.matrix;

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
        $poolMatrix(matrix);

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
    get stage (): Stage | null
    {
        if (this._$stage) {
            return this._$stage;
        }

        // find parent
        const parent: ParentImpl<any> | null = this._$parent;
        if (parent) {
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
    get transform (): Transform
    {
        return this._$transform;
    }
    set transform (transform: Transform)
    {
        this._$transform = transform;
    }

    /**
     * @description 表示オブジェクトが可視かどうかを示します。
     *              Whether or not the display object is visible.
     *
     * @member {boolean}
     * @public
     */
    get visible (): boolean
    {
        return this._$visible;
    }
    set visible (visible: boolean)
    {
        if (this._$visible !== visible) {
            this._$visible = !!visible;
            this._$doChanged();
            $doUpdated();
        }
    }

    /**
     * @description 表示オブジェクトの幅を示します（ピクセル単位）。
     *              Indicates the width of the display object, in pixels.
     *
     * @member {number}
     * @public
     */
    get width (): number
    {
        const baseBounds: BoundsImpl = "_$getBounds" in this && typeof this._$getBounds === "function"
            ? this._$getBounds() as BoundsImpl
            : $getBoundsObject();

        const bounds: BoundsImpl = $boundsMatrix(
            baseBounds,
            this._$transform._$rawMatrix()
        );

        $poolBoundsObject(baseBounds);

        const width: number = $Math.abs(bounds.xMax - bounds.xMin);
        $poolBoundsObject(bounds);

        switch (true) {

            case width === 0:
            case width === $Infinity:
            case width === 0 - $Infinity:
                return 0;

            default:
                return +width.toFixed(2);

        }
    }
    set width (width: number)
    {
        width = +width;
        if (!$isNaN(width) && width > -1) {

            const baseBounds: BoundsImpl = "_$getBounds" in this && typeof this._$getBounds === "function"
                ? this._$getBounds() as BoundsImpl
                : $getBoundsObject();

            const rotation: number = this.rotation;
            const bounds = rotation
                ? $boundsMatrix(baseBounds, this._$transform._$rawMatrix())
                : baseBounds;

            if (rotation) {
                $poolBoundsObject(baseBounds);
            }

            const exWidth = $Math.abs(bounds.xMax - bounds.xMin);
            $poolBoundsObject(bounds);

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
    get x (): number
    {
        return this._$transform._$rawMatrix()[4];
    }
    set x (x: number)
    {
        const transform: Transform = this._$transform;

        const matrix: Matrix = transform.matrix;

        matrix.tx = x;

        transform.matrix = matrix;
        $poolMatrix(matrix);
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
    get y (): number
    {
        return this._$transform._$rawMatrix()[5];
    }
    set y (y: number)
    {
        const transform: Transform = this._$transform;

        const matrix = transform.matrix;

        matrix.ty = y;

        transform.matrix = matrix;
        $poolMatrix(matrix);
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
    getBounds (target: DisplayObjectImpl<any> | null = null): Rectangle
    {
        const baseBounds: BoundsImpl = "_$getBounds" in this && typeof this._$getBounds === "function"
            ? this._$getBounds() as BoundsImpl
            : $getBoundsObject();

        const matrix: Matrix = this._$transform.concatenatedMatrix;

        // to global
        const bounds: BoundsImpl = $boundsMatrix(baseBounds, matrix._$matrix);

        // pool
        $poolMatrix(matrix);
        $poolBoundsObject(baseBounds);

        // create bounds object
        const targetBaseBounds: BoundsImpl = $getBoundsObject(
            bounds.xMin,
            bounds.xMax,
            bounds.yMin,
            bounds.yMax
        );

        // pool
        $poolBoundsObject(bounds);

        if (!target) {
            target = this;
        }

        const targetMatrix: Matrix = target._$transform.concatenatedMatrix;
        targetMatrix.invert();

        const resultBounds: BoundsImpl = $boundsMatrix(
            targetBaseBounds, targetMatrix._$matrix
        );
        $poolBoundsObject(targetBaseBounds);
        $poolMatrix(targetMatrix);

        const xMin: number = resultBounds.xMin;
        const yMin: number = resultBounds.yMin;
        const xMax: number = resultBounds.xMax;
        const yMax: number = resultBounds.yMax;

        // pool
        $poolBoundsObject(resultBounds);

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
    globalToLocal (point: Point): Point
    {
        const matrix: Matrix = this._$transform.concatenatedMatrix;
        matrix.invert();

        const newPoint: Point = new Point(
            point.x * matrix.a + point.y * matrix.c + matrix.tx,
            point.x * matrix.b + point.y * matrix.d + matrix.ty
        );

        $poolMatrix(matrix);

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
    hitTestObject (object: DisplayObjectImpl<any>): boolean
    {
        const baseBounds1: BoundsImpl = "_$getBounds" in this && typeof this._$getBounds === "function"
            ? this._$getBounds() as BoundsImpl
            : $getBoundsObject();

        const matrix1: Matrix = this._$transform.concatenatedMatrix;
        const bounds1: BoundsImpl = $boundsMatrix(baseBounds1, matrix1._$matrix);

        // pool
        $poolMatrix(matrix1);
        $poolBoundsObject(baseBounds1);

        const baseBounds2: BoundsImpl = object._$getBounds(null);
        const matrix2: Matrix = object._$transform.concatenatedMatrix;
        const bounds2: BoundsImpl = $boundsMatrix(baseBounds2, matrix2._$matrix);

        // pool
        $poolMatrix(matrix2);
        $poolBoundsObject(baseBounds2);

        // calc
        const sx: number = $Math.max(bounds1.xMin, bounds2.xMin);
        const sy: number = $Math.max(bounds1.yMin, bounds2.yMin);
        const ex: number = $Math.min(bounds1.xMax, bounds2.xMax);
        const ey: number = $Math.min(bounds1.yMax, bounds2.yMax);

        // pool
        $poolBoundsObject(bounds1);
        $poolBoundsObject(bounds2);

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
    hitTestPoint (
        x: number, y: number,
        shape_flag: boolean = false
    ): boolean {

        if (shape_flag) {

            let matrix: Float32Array = $MATRIX_ARRAY_IDENTITY;

            let parent: ParentImpl<any> | null = this._$parent;
            while (parent) {

                matrix = $multiplicationMatrix(
                    parent._$transform._$rawMatrix(),
                    matrix
                );

                parent = parent._$parent;
            }

            $hitContext.setTransform(1, 0, 0, 1, 0, 0);
            $hitContext.beginPath();

            let result: boolean = false;
            if ("_$hit" in this && typeof this._$hit === "function") {
                result = this._$hit($hitContext, matrix, { "x": x, "y": y }, true);
            }

            if (matrix !== $MATRIX_ARRAY_IDENTITY) {
                $poolFloat32Array6(matrix);
            }

            return result;
        }

        const baseBounds: BoundsImpl = "_$getBounds" in this && typeof this._$getBounds === "function"
            ? this._$getBounds() as BoundsImpl
            : $getBoundsObject();

        const bounds: BoundsImpl = $boundsMatrix(baseBounds, this._$transform._$rawMatrix());
        $poolBoundsObject(baseBounds);

        const rectangle: Rectangle = new Rectangle(
            bounds.xMin, bounds.yMin,
            bounds.xMax - bounds.xMin,
            bounds.yMax - bounds.yMin
        );

        // pool
        $poolBoundsObject(bounds);

        const point: Point = this._$parent
            ? this._$parent.globalToLocal(new Point(x, y))
            : new Point(x, y);

        return rectangle.containsPoint(point);
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
    localToGlobal (point: Point): Point
    {
        const matrix: Matrix = this
            ._$transform
            .concatenatedMatrix;

        const newPoint: Point = new Point(
            point.x * matrix.a + point.y * matrix.c + matrix.tx,
            point.x * matrix.b + point.y * matrix.d + matrix.ty
        );

        $poolMatrix(matrix);

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
    getLocalVariable (key: any): any
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
    setLocalVariable (key: any, value: any): void
    {
        if (!this._$variables) {
            this._$variables = $getMap();
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
    hasLocalVariable (key: any): boolean
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
    deleteLocalVariable (key: any): void
    {
        if (this._$variables && this._$variables.has(key)) {
            this._$variables.delete(key);
            if (!this._$variables.size) {
                $poolMap(this._$variables);
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
    getGlobalVariable (key: any): any
    {
        if ($variables.has(key)) {
            return $variables.get(key);
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
    setGlobalVariable (key: any, value: any): void
    {
        $variables.set(key, value);
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
    hasGlobalVariable (key: any): boolean
    {
        return $variables.has(key);
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
    deleteGlobalVariable (key: any): void
    {
        if ($variables.has(key)) {
            $variables.delete(key);
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
    clearGlobalVariable (): void
    {
        return $variables.clear();
    }

    /**
     * @return {object}
     * @method
     * @private
     */
    _$getPlaceObject (): PlaceObjectImpl | null
    {
        if (!this._$placeObject) {

            const placeId = this._$placeId;
            if (placeId === -1) {
                return null;
            }

            const parent: ParentImpl<any> | null = this._$parent;
            if (!parent || !parent._$placeObjects) {
                return null;
            }

            const placeMap: Array<Array<number>> | null = parent._$placeMap;
            if (!placeMap || !placeMap.length) {
                return null;
            }

            const frame: number = "currentFrame" in parent ? parent.currentFrame : 1;
            const places: number[] | void = placeMap[frame];
            if (!places) {
                return null;
            }

            const currentPlaceId: number = places[placeId] | 0;
            const placeObject: PlaceObjectImpl | void = parent._$placeObjects[currentPlaceId];
            if (!placeObject) {
                return null;
            }

            this._$changePlace    = currentPlaceId !== this._$currentPlaceId;
            this._$currentPlaceId = currentPlaceId;
            this._$placeObject    = placeObject;

            return placeObject;
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
        const name = this.namespace;

        let loaderInfo: LoaderInfo | null = null;
        if ($window.next2d.fw && $window.next2d.fw.loaderInfo.has(name)) {
            loaderInfo = $window.next2d.fw.loaderInfo.get(name)._$loaderInfo;
        }

        if (!loaderInfo) {
            loaderInfo = this._$loaderInfo || $getCurrentLoaderInfo();
        }

        if (!loaderInfo || !loaderInfo._$data) {
            return null;
        }

        const characterId: number | void  = loaderInfo._$data.symbols.get(name);
        if (!characterId) {
            return null;
        }

        const character: Character<any> = loaderInfo._$data.characters[characterId];
        if (!character) {
            return null;
        }

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
    _$baseBuild<T> (
        tag: DictionaryTagImpl,
        parent: ParentImpl<any>
    ): T {

        const loaderInfo: LoaderInfo | null = parent._$loaderInfo;
        if (!loaderInfo || !loaderInfo._$data) {
            throw new Error("the loaderInfo or data is nul.");
        }

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

        const parent: ParentImpl<any> | null = this._$parent;
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
        if ($rendererWorker && this._$created) {
            $rendererWorker.postMessage({
                "command": "doChanged",
                "instanceId": this._$instanceId
            });
        }

        this._$posted  = false;
        this._$isNext  = true;
        this._$updated = true;

        const parent: ParentImpl<any> | null = this._$parent;
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
        context: CanvasToWebGLContext,
        target_texture: WebGLTexture,
        matrix: Float32Array,
        filters: FilterArrayImpl,
        width: number, height: number
    ): WebGLTexture {

        const player: Player = $currentPlayer();
        const cacheStore: CacheStore = player.cacheStore;

        const cacheKeys: any[] = [this._$instanceId, "f"];
        const cache: WebGLTexture | void = cacheStore.get(cacheKeys);

        const updated: boolean = this._$isFilterUpdated(
            width, height, matrix, filters, true
        );

        if (cache && !updated) {
            return cache;
        }

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
        }

        if (!cache || updated) {

            const texture = this._$applyFilter(
                context, filters, target_texture,
                matrix, width, height
            );

            cacheStore.set(cacheKeys, texture);

            return texture;
        }

        return cache;
    }

    /**
     * @param   {array}  [matrix=null]
     * @returns {object}
     * @private
     */
    _$getLayerBounds (matrix: Float32Array | null = null): BoundsImpl
    {
        const baseBounds: BoundsImpl = "_$getBounds" in this && typeof this._$getBounds === "function"
            ? this._$getBounds(matrix) as BoundsImpl
            : $getBoundsObject();

        if (!matrix) {
            return baseBounds;
        }

        const filters: FilterArrayImpl = this._$filters || this.filters;
        if (!filters.length) {
            return baseBounds;
        }

        let rect: Rectangle = new Rectangle(
            baseBounds.xMin,
            baseBounds.yMin,
            baseBounds.xMax - baseBounds.xMin,
            baseBounds.yMax - baseBounds.yMin
        );
        $poolBoundsObject(baseBounds);

        for (let idx: number = 0; idx < filters.length; ++idx) {
            rect = filters[idx]
                ._$generateFilterRect(rect, 0, 0);
        }

        return $getBoundsObject(
            rect.x, rect.x + rect.width,
            rect.y, rect.y + rect.height
        );
    }

    /**
     * @return {void}
     * @method
     * @private
     */
    _$executeAddedEvent (): void
    {
        if (!this._$parent) {
            return ;
        }

        // add event
        if (!this._$added) {

            // added event
            if (this.willTrigger(Next2DEvent.ADDED)) {
                this.dispatchEvent(new Next2DEvent(Next2DEvent.ADDED, true));
            }

            // update
            this._$added = true;
        }

        if (!this._$addedStage && this._$stage !== null) {

            if (this.willTrigger(Next2DEvent.ADDED_TO_STAGE)) {
                this.dispatchEvent(new Next2DEvent(Next2DEvent.ADDED_TO_STAGE));
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
    _$prepareActions (): void
    {
        this._$nextFrame();
    }

    /**
     * @return {boolean}
     * @method
     * @private
     */
    _$nextFrame (): boolean
    {
        // added event
        this._$executeAddedEvent();

        this._$isNext = false;

        if (!this._$posted && $rendererWorker) {
            // @ts-ignore
            this._$postProperty();
        }

        return false;
    }

    /**
     * @param  {array} [filters=null]
     * @return {boolean}
     * @private
     */
    _$canApply (filters: FilterArrayImpl | null = null): boolean
    {
        if (filters) {
            for (let idx: number = 0; idx < filters.length; ++idx) {
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
        width: number, height: number,
        matrix: Float32Array,
        filters: FilterArrayImpl | null = null,
        can_apply: boolean = false,
        position_x: number = 0, position_y: number = 0
    ): boolean {

        // cache flag
        if (this._$isUpdated()) {
            return true;
        }

        // check filter data
        if (can_apply && filters) {

            for (let idx: number = 0; idx < filters.length; ++idx) {

                if (!filters[idx]._$isUpdated()) {
                    continue;
                }

                return true;
            }

        }

        // check status
        const player: Player = $currentPlayer();
        const cache: WebGLTexture = player.cacheStore.get([this._$instanceId, "f"]);
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
        context: CanvasToWebGLContext,
        filters: FilterArrayImpl,
        target_texture: WebGLTexture,
        matrix: Float32Array,
        width: number, height: number
    ): WebGLTexture {

        const xScale: number = +$Math.sqrt(
            matrix[0] * matrix[0]
            + matrix[1] * matrix[1]
        );
        const yScale: number = +$Math.sqrt(
            matrix[2] * matrix[2]
            + matrix[3] * matrix[3]
        );

        const radianX: number = $Math.atan2(matrix[1], matrix[0]);
        const radianY: number = $Math.atan2(-matrix[2], matrix[3]);

        const parentMatrix: Float32Array = $getFloat32Array6(
            $Math.cos(radianX), $Math.sin(radianX),
            -$Math.sin(radianY), $Math.cos(radianY),
            width / 2, height / 2
        );

        const baseMatrix: Float32Array = $getFloat32Array6(
            1, 0, 0, 1,
            -target_texture.width / 2,
            -target_texture.height / 2
        );

        const multiMatrix: Float32Array = $multiplicationMatrix(
            parentMatrix, baseMatrix
        );
        $poolFloat32Array6(parentMatrix);
        $poolFloat32Array6(baseMatrix);

        const manager: FrameBufferManager = context.frameBuffer;
        const currentAttachment: AttachmentImpl | null = manager.currentAttachment;

        const attachment: AttachmentImpl = manager
            .createCacheAttachment(width, height);
        context._$bind(attachment);

        context.reset();
        context.setTransform(
            multiMatrix[0], multiMatrix[1],
            multiMatrix[2], multiMatrix[3],
            multiMatrix[4], multiMatrix[5]
        );
        $poolFloat32Array6(multiMatrix);

        context.drawImage(target_texture,
            0, 0, target_texture.width, target_texture.height
        );

        // init
        context._$offsetX = 0;
        context._$offsetY = 0;

        const filterMatrix: Float32Array = $getFloat32Array6(
            xScale, 0, 0, yScale, 0, 0
        );

        let texture: WebGLTexture | null = null;
        for (let idx: number = 0; idx < filters.length; ++idx) {
            texture = filters[idx]._$applyFilter(context, filterMatrix);
        }

        $poolFloat32Array6(filterMatrix);

        if (!texture) {
            return target_texture;
        }

        const offsetX: number = context._$offsetX;
        const offsetY: number = context._$offsetY;

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
    _$shouldClip (matrix: Float32Array): boolean
    {
        const bounds: BoundsImpl = "_$getBounds" in this && typeof this._$getBounds === "function"
            ? this._$getBounds(matrix) as BoundsImpl
            : $getBoundsObject();

        const width  = $Math.abs(bounds.xMax - bounds.xMin);
        const height = $Math.abs(bounds.yMax - bounds.yMin);
        $poolBoundsObject(bounds);

        // size 0
        return !(!width || !height);
    }

    /**
     * @param  {CanvasToWebGLContext} context
     * @param  {Float32Array} matrix
     * @return {Float32Array|boolean|null}
     * @method
     * @private
     */
    _$startClip (
        context: CanvasToWebGLContext,
        matrix: Float32Array
    ): Float32Array | boolean | null {

        let clipMatrix: Float32Array | null = null;

        // ネストしてない初回のマスクだけ実行
        // ネストしてる場合は初回に作られたbufferを流用
        if (!context.cacheAttachment) {

            let multiMatrix: Float32Array = matrix;
            const rawMatrix: Float32Array = this._$transform._$rawMatrix();
            if (rawMatrix[0] !== 1 || rawMatrix[1] !== 0
                || rawMatrix[2] !== 0 || rawMatrix[3] !== 1
                || rawMatrix[4] !== 0 || rawMatrix[5] !== 0
            ) {
                multiMatrix = $multiplicationMatrix(matrix, rawMatrix);
            }

            const baseBounds: BoundsImpl = "_$getBounds" in this && typeof this._$getBounds === "function"
                ? this._$getBounds() as BoundsImpl
                : $getBoundsObject();

            const bounds: BoundsImpl = $boundsMatrix(baseBounds, multiMatrix);
            $poolBoundsObject(baseBounds);

            clipMatrix = context._$startClip(matrix, bounds);
            $poolBoundsObject(bounds);

            if (multiMatrix !== matrix) {
                $poolFloat32Array6(multiMatrix);
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
        if ("_$children" in this) {
            containerClip = true;
            context._$updateContainerClipFlag(true);
        }

        // @ts-ignore
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
        if ($rendererWorker) {
            $rendererWorker.postMessage({
                "command": "remove",
                "instanceId": this._$instanceId
            });
        }
    }

    /**
     * @return {object}
     * @method
     * @private
     */
    _$createMessage (): PropertyMessageMapImpl<any>
    {
        const message: PropertyMessageImpl = {
            "command": "setProperty",
            "instanceId": this._$instanceId,
            "parentId": this._$parent ? this._$parent._$instanceId : -1,
            "visible": this._$visible,
            "isMask": this._$isMask,
            "clipDepth": this._$clipDepth,
            "depth": this._$placeId,
            "maskId": -1
        };

        const mask: DisplayObjectImpl<any> | null = this._$mask;
        if (mask) {
            message.maskId = mask._$instanceId;

            let maskMatrix: Float32Array = $MATRIX_ARRAY_IDENTITY;
            let parent: ParentImpl<any> | null = mask._$parent;
            while (parent) {

                maskMatrix = $multiplicationMatrix(
                    parent._$transform._$rawMatrix(),
                    maskMatrix
                );

                parent = parent._$parent;
            }

            message.maskMatrix = maskMatrix;
        }

        if (this._$visible) {

            const transform: Transform = this._$transform;

            const matrix: Float32Array = transform._$rawMatrix();
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

            const filters: FilterArrayImpl | null = this._$filters || this.filters;
            if (filters && filters.length) {
                const parameters: any[] = $getArray();
                for (let idx: number = 0; idx < filters.length; ++idx) {
                    parameters.push(filters[idx]._$toArray());
                }

                message.filters = parameters;
            }

            const blendMode: BlendModeImpl = this._$blendMode || this.blendMode;
            if (blendMode !== "normal") {
                message.blendMode = blendMode;
            }

            const scale9Grid: Rectangle | null = this._$scale9Grid;
            if (scale9Grid && this._$isUpdated()) {

                const baseMatrix: Matrix = this
                    ._$parent
                    ._$transform
                    .concatenatedMatrix;

                message.matrixBase = baseMatrix._$matrix.slice();
                $poolMatrix(baseMatrix);

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
