import type { LoaderInfo } from "./LoaderInfo";
import type { Sprite } from "./Sprite";
import type { IParent } from "./interface/IParent";
import type { IPlaceObject } from "./interface/IPlaceObject";
import type { IBlendMode } from "./interface/IBlendMode";
import type { IFilterArray } from "./interface/IFilterArray";
import type { MovieClip } from "./MovieClip";
import { execute as displayObjectGetPlaceObjectService } from "./DisplayObject/service/DisplayObjectGetPlaceObjectService";
import { execute as displayObjectBuildFilterService } from "./DisplayObject/service/DisplayObjectBuildFilterService";
import { execute as displayObjectApplyChangesService } from "./DisplayObject/service/DisplayObjectApplyChangesService";
import { EventDispatcher } from "@next2d/events";
import type {
    ColorTransform,
    Matrix,
    Rectangle
} from "@next2d/geom";
import {
    $getInstanceId,
    $parentMap,
    $loaderInfoMap,
    $rootMap
} from "./DisplayObjectUtil";

/**
 * @description DisplayObject クラスは、表示リストに含めることのできるすべてのオブジェクトに関する基本クラスです。
 *              DisplayObject クラス自体は、画面上でのコンテンツの描画のための API を含みません。
 *              そのため、DisplayObject クラスのカスタムサブクラスを作成する場合は、
 *              Shape、Sprite、TextField または MovieClip など、画面上にコンテンツを描画する API を持つサブクラスの 1 つを拡張する必要があります。
 *
 *              The DisplayObject class is the base class for all objects that can be placed on the display list.
 *              The DisplayObject class itself does not include any APIs for rendering content onscreen.
 *              For that reason, if you want create a custom subclass of the DisplayObject class,
 *              you will want to extend one of its subclasses that do have APIs for rendering content onscreen, such as the Shape, Sprite, TextField, or MovieClip class.
 *
 * @class
 * @memberOf next2d.display
 * @extends  EventDispatcher
 */
export class DisplayObject extends EventDispatcher
{
    /**
     * @description DisplayObject のユニークなインスタンスID
     *              Unique instance ID of DisplayObject
     * 
     * @type {number}
     * @readonly
     * @public
     */
    public readonly instanceId: number;

    /**
     * @description DisplayObject の生成元ID
     *              Source ID of DisplayObject
     * 
     * @type {number}
     * @default -1
     * @public
     */
    public dictionaryId: number;

    /**
     * @description コンテナの機能を所持しているかを返却
     *              Returns whether the display object has container functionality.
     *
     * @type {boolean}
     * @readonly
     * @public
     */
    public readonly isContainerEnabled: boolean;

    /**
     * @description MovieClipの機能を所持しているかを返却
     *              Returns whether the display object has MovieClip functionality.
     *
     * @type {boolean}
     * @readonly
     * @public
     */
    public readonly isTimelineEnabled: boolean;
    
    /**
     * @description Shapeの機能を所持しているかを返却
     *              Returns whether the display object has Shape functionality.
     *
     * @type {boolean}
     * @readonly
     * @public
     */
    public readonly isShape: boolean;

    /**
     * @description Videoの機能を所持しているかを返却
     *              Returns whether the display object has Video functionality.
     *
     * @type {boolean}
     * @readonly
     * @public
     */
    public readonly isVideo: boolean;

    /**
     * @description Textの機能を所持しているかを返却
     *              Returns whether the display object has Text functionality.
     *
     * @type {boolean}
     * @readonly
     * @public
     */
    public readonly isText: boolean;

    /**
     * @description 表示オブジェクトのPlaceObjectのIDを返却します。
     *              Returns the ID of the PlaceObject of the display object.
     * 
     * @type {number}
     * @default -1
     * @public
     */
    public placeId: number;

    /**
     * @description 現在のフレームの表示オブジェクトのPlaceObjectを返却します。
     *             Returns the PlaceObject of the current frame of the display object.
     * 
     * @type {IPlaceObject|null}
     * @default null
     * @public
     */
    public placeObject: IPlaceObject | null;

    /**
     * @description 構築に利用したキャラクターIDを返却します。
     *              Returns the character ID used for construction.
     * 
     * @type {number}
     * @default -1
     * @public
     */
    public characterId: number;

    /**
     * @description マスク対象の深度を返却します。
     *              Returns the depth of the mask target.
     * 
     * @type {number}
     * @default 0
     * @public
     */
    public clipDepth: number;

    /**
     * @description 名前を返却します。 getChildByName() で使用されます。
     *              Returns the name. Used by getChildByName().
     * 
     * @see {DisplayObjectContainer.getChildByName}
     * @type {string}
     * @default ""
     * @public
     */
    public name: string;

    /**
     * @description 開始フレームを返却します。
     *              Returns the start frame.
     * 
     * @type {number}
     * @default 1
     * @public
     */
    public startFrame: number;

    /**
     * @description 終了フレームを返却します。
     *              Returns the end frame.
     * 
     * @type {number}
     * @default 0
     * @public
     */
    public endFrame: number;

    /**
     * @description 描画に関連する何らかの変更が加えられたかを示します。
     *              Indicates whether any changes related to drawing have been made.
     * 
     * @type {boolean}
     * @default true
     * @public
     */
    public changed: boolean;

    /**
     * @description DisplayObjectの追加イベントが発火したかを示します。
     *              Indicates whether the DisplayObject addition event has been fired.
     * 
     * @type {boolean}
     * @default false
     * @public
     */
    public $added: boolean;

    /**
     * @description DisplayObjectのステージ追加イベントが発火したかを示します。
     *              Indicates whether the DisplayObject stage addition event has been fired.
     * 
     * @type {boolean}
     * @default false
     * @public
     */
    public $addedToStage: boolean;

    /**
     * @description キャッシュで利用するユニークキー
     *              Unique key used for caching
     */
    public uniqueKey: string;

    /**
     * @description 固定された変換行列、nullの場合はPlaceObjectの変換行列を検索します。
     *              Fixed transformation matrix, if null, search for PlaceObject transformation matrix.
     * 
     * @type {Matrix}
     * @default null
     * @protected
     */
    protected _$matrix: Matrix | null;
    protected _$colorTransform: ColorTransform | null;
    protected _$filters: IFilterArray | null;
    protected _$blendMode: IBlendMode | null;


    // todo
    protected _$scaleX: number | null;
    protected _$scaleY: number | null;
    protected _$rotation: number | null;
    protected _$scale9Grid: Rectangle | null;
    protected _$isMask: boolean;
    protected _$hitObject: Sprite | null;
    protected _$mask: DisplayObjectImpl<any> | null;
    protected _$visible: boolean;
    protected _$variables: Map<any, any> | null;
    

    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super();

        this.instanceId   = $getInstanceId();
        this.dictionaryId = -1;
        this.uniqueKey    = "";

        this.isContainerEnabled = false;
        this.isTimelineEnabled  = false;
        this.isShape            = false;
        this.isVideo            = false;
        this.isText             = false;
        
        this.placeId       = -1;
        this.placeObject   = null;
        
        this.characterId = -1;
        this.clipDepth   = 0;
        this.name        = "";
        this.startFrame  = 1;
        this.endFrame    = 0;

        this.changed = true;

        this.$added        = false;
        this.$addedToStage = false;

        this._$filters = null;
        this._$blendMode = null;

        this._$hitObject = null;
        this._$isMask = false;
        
        this._$visible = true;
        this._$mask = null;
        this._$scale9Grid = null;
        this._$variables = null;
        
        this._$scaleX   = null;
        this._$scaleY   = null;
        this._$rotation = null;
    }

    // /**
    //  * @description 指定されたオブジェクトのアルファ透明度値を示します。
    //  *              有効な値は 0.0（完全な透明）～ 1.0（完全な不透明）です。
    //  *              デフォルト値は 1.0 です。alpha が 0.0 に設定されている表示オブジェクトは、
    //  *              表示されない場合でも、アクティブです。
    //  *              Indicates the alpha transparency value of the object specified.
    //  *              Valid values are 0.0 (fully transparent) to 1.0 (fully opaque).
    //  *              The default value is 1.0. Display objects with alpha set to 0.0 are active,
    //  *              even though they are invisible.
    //  *
    //  * @member  {number}
    //  * @default 1
    //  * @public
    //  */
    // get alpha (): number
    // {
    //     const colorTransform: Float32Array = this
    //         ._$transform
    //         ._$rawColorTransform();

    //     return colorTransform[3] + colorTransform[7] / 255;
    // }
    // set alpha (alpha: number)
    // {
    //     alpha = $clamp(alpha, 0, 1, 0);

    //     const transform: Transform = this._$transform;

    //     // clone
    //     if (!transform._$colorTransform) {
    //         const colorTransform: ColorTransform = transform.colorTransform;

    //         colorTransform._$colorTransform[3] = alpha;
    //         colorTransform._$colorTransform[7] = 0;

    //         transform.colorTransform = colorTransform;
    //         $poolColorTransform(colorTransform);

    //     } else {
    //         const colorTransform: ColorTransform = transform._$colorTransform;

    //         colorTransform._$colorTransform[3] = alpha;
    //         colorTransform._$colorTransform[7] = 0;

    //         this._$doChanged();
    //         $doUpdated();
    //     }
    // }

    /**
     * @description 使用するブレンドモードを指定する BlendMode クラスの値です。
     *              A value from the BlendMode class that specifies which blend mode to use.
     *
     * @member  {string}
     * @default BlendMode.NORMAL
     * @public
     */
    get blendMode (): IBlendMode
    {
        if (this._$blendMode) {
            return this._$blendMode;
        }

        const placeObject = displayObjectGetPlaceObjectService(this);
        return placeObject && placeObject.blendMode 
            ? placeObject.blendMode
            : "normal";
    }
    set blendMode (blend_mode: IBlendMode)
    {
        if (this._$blendMode === blend_mode) {
            return ;
        }
        this._$blendMode = blend_mode;
        displayObjectApplyChangesService(this);
    }

    /**
     * @description 表示オブジェクトに現在関連付けられている各フィルターオブジェクトの配列です。
     *              An array of filter objects currently associated with the display object.
     *
     * @member  {array}
     * @default null
     * @public
     */
    get filters (): IFilterArray | null
    {
        if (this._$filters) {
            return this._$filters;
        }

        const placeObject = displayObjectGetPlaceObjectService(this);
        if (placeObject && placeObject.surfaceFilterList) {

            // build filter
            if (!placeObject.filters) {
                placeObject.filters = displayObjectBuildFilterService(
                    placeObject.surfaceFilterList
                );
            }

            return placeObject.filters;
        }

        return null;
    }
    set filters (filters: IFilterArray | null)
    {
        if (this._$filters === filters) {
            return ;
        }
        this._$filters = filters;
        displayObjectApplyChangesService(this);
    }

    // /**
    //  * @description 表示オブジェクトの高さを示します（ピクセル単位）。
    //  *              Indicates the height of the display object, in pixels.
    //  *
    //  * @member {number}
    //  * @public
    //  */
    // get height (): number
    // {
    //     const baseBounds: BoundsImpl = "_$getBounds" in this && typeof this._$getBounds === "function"
    //         ? this._$getBounds() as BoundsImpl
    //         : $getBoundsObject();

    //     const bounds: BoundsImpl = $boundsMatrix(
    //         baseBounds,
    //         this._$transform._$rawMatrix()
    //     );
    //     $poolBoundsObject(baseBounds);

    //     const height: number = $Math.abs(bounds.yMax - bounds.yMin);

    //     // object pool
    //     $poolBoundsObject(bounds);

    //     switch (height) {

    //         case 0:
    //         case $Infinity:
    //         case -$Infinity:
    //             return 0;

    //         default:
    //             return +height.toFixed(2);

    //     }
    // }
    // set height (height: number)
    // {
    //     height = +height;
    //     if (!$isNaN(height) && height > -1) {

    //         const baseBounds: BoundsImpl = "_$getBounds" in this && typeof this._$getBounds === "function"
    //             ? this._$getBounds() as BoundsImpl
    //             : $getBoundsObject();

    //         const rotation: number = this.rotation;
    //         const bounds: BoundsImpl = rotation
    //             ? $boundsMatrix(baseBounds, this._$transform._$rawMatrix())
    //             : baseBounds;

    //         if (rotation) {
    //             $poolBoundsObject(baseBounds);
    //         }

    //         const exHeight: number = $Math.abs(bounds.yMax - bounds.yMin);
    //         $poolBoundsObject(bounds);

    //         switch (exHeight) {

    //             case 0:
    //             case $Infinity:
    //             case -$Infinity:
    //                 this.scaleY = 0;
    //                 break;

    //             default:
    //                 this.scaleY = height / exHeight;
    //                 break;

    //         }
    //     }
    // }

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
        return $loaderInfoMap.has(this) 
            ? $loaderInfoMap.get(this) as NonNullable<LoaderInfo>
            : null;
    }

    // /**
    //  * @description 呼び出し元の表示オブジェクトは、指定された mask オブジェクトによってマスクされます。
    //  *              The calling display object is masked by the specified mask object.
    //  *
    //  * @member {DisplayObject|null}
    //  * @public
    //  */
    // get mask (): DisplayObjectImpl<any> | null
    // {
    //     return this._$mask;
    // }
    // set mask (mask: DisplayObjectImpl<any> | null)
    // {
    //     if (mask === this._$mask) {
    //         return ;
    //     }

    //     // reset
    //     if (this._$mask) {
    //         if ($rendererWorker && this._$mask.stage) {
    //             this._$mask._$removeWorkerInstance();
    //         }

    //         this._$mask._$isMask = false;
    //         this._$mask = null;
    //     }

    //     if (mask) {
    //         if ($rendererWorker
    //             && "_$createWorkerInstance" in mask
    //             && typeof mask._$createWorkerInstance === "function"
    //         ) {
    //             mask._$createWorkerInstance();
    //         }

    //         mask._$isMask = true;
    //         this._$mask   = mask;
    //     }

    //     this._$doChanged();
    // }

    // /**
    //  * @description マウスまたはユーザー入力デバイスの x 軸の位置をピクセルで示します。
    //  *              Indicates the x coordinate of the mouse or user input device position, in pixels.
    //  *
    //  * @member  {number}
    //  * @default 0
    //  * @readonly
    //  * @public
    //  */
    // get mouseX (): number
    // {
    //     return $getEvent()
    //         ? this.globalToLocal($currentMousePoint()).x
    //         : 0;
    // }

    // /**
    //  * @description マウスまたはユーザー入力デバイスの y 軸の位置をピクセルで示します。
    //  *              Indicates the y coordinate of the mouse or user input device position, in pixels.
    //  *
    //  * @member  {number}
    //  * @default 0
    //  * @readonly
    //  * @public
    //  */
    // get mouseY (): number
    // {
    //     return $getEvent()
    //         ? this.globalToLocal($currentMousePoint()).y
    //         : 0;
    // }

    /**
     * @description このDisplayObjectの親のDisplayObjectContainerを返却します。
     *              通常であれば、親のDisplayObjectContainerを継承しているのは、Sprite、または MovieClip となります。
     *              Returns the DisplayObjectContainer of this DisplayObject's parent.
     *              Under normal circumstances, the parent DisplayObjectContainer would inherit from Sprite or MovieClip.
     *
     * @member  {Sprite | MovieClip | null}
     * @readonly
     * @public
     */
    get parent (): IParent<any> | null
    {
        return $parentMap.has(this)
            ? $parentMap.get(this) as NonNullable<IParent<MovieClip | Sprite>>
            : null;
    }

    /**
     * @description DisplayObject のルートである DisplayObjectContainer を返します。
     *              Returns the DisplayObjectContainer object that contains this display object.
     *
     * @member   {MovieClip | Sprite | null}
     * @readonly
     * @public
     */
    get root (): IParent<MovieClip | Sprite> | null
    {
        return $rootMap.has(this)
            ? $rootMap.get(this) as NonNullable<IParent<MovieClip | Sprite>>
            : null;
    }

    // /**
    //  * @description DisplayObject インスタンスの元の位置からの回転角を度単位で示します。
    //  *              Indicates the rotation of the DisplayObject instance,
    //  *              in degrees, from its original orientation.
    //  *
    //  * @member {number}
    //  * @public
    //  */
    // get rotation (): number
    // {
    //     if (this._$rotation !== null) {
    //         return this._$rotation;
    //     }

    //     const matrix: Float32Array = this._$transform._$rawMatrix();
    //     return $Math.atan2(matrix[1], matrix[0]) * $Rad2Deg;
    // }
    // set rotation (rotation: number)
    // {
    //     rotation = $clamp(rotation % 360, 0 - 360, 360, 0);
    //     if (this._$rotation === rotation) {
    //         return ;
    //     }

    //     const transform: Transform = this._$transform;

    //     const hasMatrix: boolean = transform._$matrix !== null;

    //     const matrix: Matrix = hasMatrix
    //         ? transform._$matrix as NonNullable<Matrix>
    //         : transform.matrix;

    //     const scaleX: number = $Math.sqrt(matrix.a * matrix.a + matrix.b * matrix.b);
    //     const scaleY: number = $Math.sqrt(matrix.c * matrix.c + matrix.d * matrix.d);
    //     if (rotation === 0) {

    //         matrix.a = scaleX;
    //         matrix.b = 0;
    //         matrix.c = 0;
    //         matrix.d = scaleY;

    //     } else {

    //         let radianX: number = $Math.atan2(matrix.b,  matrix.a);
    //         let radianY: number = $Math.atan2(0 - matrix.c, matrix.d);

    //         const radian: number = rotation * $Deg2Rad;
    //         radianY = radianY + radian - radianX;
    //         radianX = radian;

    //         matrix.b = scaleX * $Math.sin(radianX);
    //         if (matrix.b === 1 || matrix.b === -1) {
    //             matrix.a = 0;
    //         } else {
    //             matrix.a = scaleX * $Math.cos(radianX);
    //         }

    //         matrix.c = -scaleY * $Math.sin(radianY);
    //         if (matrix.c === 1 || matrix.c === -1) {
    //             matrix.d = 0;
    //         } else {
    //             matrix.d = scaleY * $Math.cos(radianY);
    //         }
    //     }

    //     if (hasMatrix) {
    //         this._$doChanged();
    //         $doUpdated();
    //     } else {
    //         transform.matrix = matrix;
    //         $poolMatrix(matrix);
    //     }

    //     this._$rotation = rotation;
    // }

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
        if (this._$scale9Grid === scale_9_grid) {
            return ;
        }
        this._$scale9Grid = scale_9_grid;
        displayObjectApplyChangesService(this);
    }

    // /**
    //  * @description 基準点から適用されるオブジェクトの水平スケール（パーセンテージ）を示します。
    //  *              Indicates the horizontal scale (percentage)
    //  *              of the object as applied from the registration point.
    //  *
    //  * @member {number}
    //  * @public
    //  */
    // get scaleX (): number
    // {
    //     if (this._$scaleX !== null) {
    //         return this._$scaleX;
    //     }

    //     const matrix: Float32Array = this._$transform._$rawMatrix();

    //     let xScale: number = $Math.sqrt(
    //         matrix[0] * matrix[0]
    //         + matrix[1] * matrix[1]
    //     );
    //     if (!$Number.isInteger(xScale)) {
    //         const value: string = xScale.toString();
    //         const index: number = value.indexOf("e");
    //         if (index !== -1) {
    //             xScale = +value.slice(0, index);
    //         }
    //         xScale = +xScale.toFixed(4);
    //     }

    //     return 0 > matrix[0] ? xScale * -1 : xScale;
    // }
    // set scaleX (scale_x: number)
    // {
    //     scale_x = $clamp(+scale_x,
    //         $SHORT_INT_MIN, $SHORT_INT_MAX
    //     );

    //     if (!$Number.isInteger(scale_x)) {
    //         const value: string = scale_x.toString();
    //         const index: number = value.indexOf("e");
    //         if (index !== -1) {
    //             scale_x = +value.slice(0, index);
    //         }
    //         scale_x = +scale_x.toFixed(4);
    //     }

    //     if (this._$scaleX === scale_x) {
    //         return ;
    //     }

    //     const transform: Transform = this._$transform;

    //     const hasMatrix: boolean = transform._$matrix !== null;

    //     const matrix: Matrix = hasMatrix
    //         ? transform._$matrix as NonNullable<Matrix>
    //         : transform.matrix;

    //     if (matrix.b === 0 || $isNaN(matrix.b)) {

    //         matrix.a = scale_x;

    //     } else {

    //         let radianX = $Math.atan2(matrix.b, matrix.a);
    //         if (radianX === -$Math.PI) {
    //             radianX = 0;
    //         }

    //         matrix.b = scale_x * $Math.sin(radianX);
    //         matrix.a = scale_x * $Math.cos(radianX);

    //     }

    //     if (hasMatrix) {
    //         this._$doChanged();
    //         $doUpdated();
    //     } else {
    //         transform.matrix = matrix;
    //         $poolMatrix(matrix);
    //     }

    //     this._$scaleX = scale_x;
    // }

    // /**
    //  * @description 基準点から適用されるオブジェクトの垂直スケール（パーセンテージ）を示します。
    //  *              IIndicates the vertical scale (percentage)
    //  *              of an object as applied from the registration point.
    //  *
    //  * @member {number}
    //  * @public
    //  */
    // get scaleY (): number
    // {
    //     if (this._$scaleY !== null) {
    //         return this._$scaleY;
    //     }

    //     const matrix: Float32Array = this._$transform._$rawMatrix();

    //     let yScale: number = $Math.sqrt(
    //         matrix[2] * matrix[2]
    //         + matrix[3] * matrix[3]
    //     );

    //     if (!$Number.isInteger(yScale)) {
    //         const value: string = yScale.toString();
    //         const index: number = value.indexOf("e");
    //         if (index !== -1) {
    //             yScale = +value.slice(0, index);
    //         }
    //         yScale = +yScale.toFixed(4);
    //     }

    //     return 0 > matrix[3] ? yScale * -1 : yScale;
    // }
    // set scaleY (scale_y: number)
    // {
    //     scale_y = $clamp(+scale_y,
    //         $SHORT_INT_MIN, $SHORT_INT_MAX
    //     );

    //     if (!$Number.isInteger(scale_y)) {
    //         const value: string = scale_y.toString();
    //         const index: number = value.indexOf("e");
    //         if (index !== -1) {
    //             scale_y = +value.slice(0, index);
    //         }
    //         scale_y = +scale_y.toFixed(4);
    //     }

    //     if (this._$scaleY === scale_y) {
    //         return ;
    //     }

    //     const transform: Transform = this._$transform;

    //     const hasMatrix: boolean = transform._$matrix !== null;

    //     const matrix: Matrix = hasMatrix
    //         ? transform._$matrix as NonNullable<Matrix>
    //         : transform.matrix;

    //     if (matrix.c === 0 || $isNaN(matrix.c)) {

    //         matrix.d = scale_y;

    //     } else {

    //         let radianY = $Math.atan2(-matrix.c, matrix.d);
    //         if (radianY === -$Math.PI) {
    //             radianY = 0;
    //         }
    //         matrix.c = -scale_y * $Math.sin(radianY);
    //         matrix.d = scale_y  * $Math.cos(radianY);

    //     }

    //     if (hasMatrix) {
    //         this._$doChanged();
    //         $doUpdated();
    //     } else {
    //         transform.matrix = matrix;
    //         $poolMatrix(matrix);
    //     }

    //     this._$scaleY = scale_y;
    // }

    // /**
    //  * @description 表示オブジェクトのマトリックス、カラー変換、
    //  *              ピクセル境界に関係するプロパティを持つオブジェクトです。
    //  *              An object with properties pertaining
    //  *              to a display object's matrix, color transform, and pixel bounds.
    //  *
    //  * @member {Transform}
    //  * @public
    //  */
    // get transform (): Transform
    // {
    //     return this._$transform;
    // }
    // set transform (transform: Transform)
    // {
    //     this._$transform = transform;
    // }

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
        if (this._$visible === visible) {
            return ;
        }
        this._$visible = !!visible;
        displayObjectApplyChangesService(this);
    }

    // /**
    //  * @description 表示オブジェクトの幅を示します（ピクセル単位）。
    //  *              Indicates the width of the display object, in pixels.
    //  *
    //  * @member {number}
    //  * @public
    //  */
    // get width (): number
    // {
    //     const baseBounds: BoundsImpl = "_$getBounds" in this && typeof this._$getBounds === "function"
    //         ? this._$getBounds() as BoundsImpl
    //         : $getBoundsObject();

    //     const bounds: BoundsImpl = $boundsMatrix(
    //         baseBounds,
    //         this._$transform._$rawMatrix()
    //     );

    //     $poolBoundsObject(baseBounds);

    //     const width: number = $Math.abs(bounds.xMax - bounds.xMin);
    //     $poolBoundsObject(bounds);

    //     switch (true) {

    //         case width === 0:
    //         case width === $Infinity:
    //         case width === 0 - $Infinity:
    //             return 0;

    //         default:
    //             return +width.toFixed(2);

    //     }
    // }
    // set width (width: number)
    // {
    //     width = +width;
    //     if (!$isNaN(width) && width > -1) {

    //         const baseBounds: BoundsImpl = "_$getBounds" in this && typeof this._$getBounds === "function"
    //             ? this._$getBounds() as BoundsImpl
    //             : $getBoundsObject();

    //         const rotation: number = this.rotation;
    //         const bounds = rotation
    //             ? $boundsMatrix(baseBounds, this._$transform._$rawMatrix())
    //             : baseBounds;

    //         if (rotation) {
    //             $poolBoundsObject(baseBounds);
    //         }

    //         const exWidth = $Math.abs(bounds.xMax - bounds.xMin);
    //         $poolBoundsObject(bounds);

    //         switch (true) {

    //             case exWidth === 0:
    //             case exWidth === $Infinity:
    //             case exWidth === -$Infinity:
    //                 this.scaleX = 0;
    //                 break;

    //             default:
    //                 this.scaleX = width / exWidth;
    //                 break;

    //         }
    //     }
    // }

    // /**
    //  * @description 親 DisplayObjectContainer のローカル座標を基準にした
    //  *              DisplayObject インスタンスの x 座標を示します。
    //  *              Indicates the x coordinate
    //  *              of the DisplayObject instance relative to the local coordinates
    //  *              of the parent DisplayObjectContainer.
    //  *
    //  * @member {number}
    //  * @public
    //  */
    // get x (): number
    // {
    //     return this._$transform._$rawMatrix()[4];
    // }
    // set x (x: number)
    // {
    //     const transform: Transform = this._$transform;

    //     if (!transform._$matrix) {
    //         const matrix: Matrix = transform.matrix;
    //         matrix.tx = x;
    //         transform.matrix = matrix;
    //         $poolMatrix(matrix);
    //     } else {
    //         transform._$matrix.tx = x;
    //         this._$doChanged();
    //         $doUpdated();
    //     }
    // }

    // /**
    //  * @description 親 DisplayObjectContainer のローカル座標を基準にした
    //  *              DisplayObject インスタンスの y 座標を示します。
    //  *              Indicates the y coordinate
    //  *              of the DisplayObject instance relative to the local coordinates
    //  *              of the parent DisplayObjectContainer.
    //  *
    //  * @member {number}
    //  * @public
    //  */
    // get y (): number
    // {
    //     return this._$transform._$rawMatrix()[5];
    // }
    // set y (y: number)
    // {
    //     const transform: Transform = this._$transform;

    //     if (!transform._$matrix) {
    //         const matrix = transform.matrix;
    //         matrix.ty = y;

    //         transform.matrix = matrix;
    //         $poolMatrix(matrix);
    //     } else {
    //         transform._$matrix.ty = y;
    //         this._$doChanged();
    //         $doUpdated();
    //     }
    // }

    // /**
    //  * @description targetCoordinateSpace オブジェクトの座標系を基準にして、
    //  *              表示オブジェクトの領域を定義する矩形を返します。
    //  *              Returns a rectangle that defines the area
    //  *              of the display object relative to the coordinate system
    //  *              of the targetCoordinateSpace object.
    //  *
    //  * @param  {DisplayObject} [target=null]
    //  * @return {Rectangle}
    //  */
    // getBounds (target: DisplayObjectImpl<any> | null = null): Rectangle
    // {
    //     const baseBounds: BoundsImpl = "_$getBounds" in this && typeof this._$getBounds === "function"
    //         ? this._$getBounds() as BoundsImpl
    //         : $getBoundsObject();

    //     const matrix: Matrix = this._$transform.concatenatedMatrix;

    //     // to global
    //     const bounds: BoundsImpl = $boundsMatrix(baseBounds, matrix._$matrix);

    //     // pool
    //     $poolMatrix(matrix);
    //     $poolBoundsObject(baseBounds);

    //     // create bounds object
    //     const targetBaseBounds: BoundsImpl = $getBoundsObject(
    //         bounds.xMin,
    //         bounds.xMax,
    //         bounds.yMin,
    //         bounds.yMax
    //     );

    //     // pool
    //     $poolBoundsObject(bounds);

    //     if (!target) {
    //         target = this;
    //     }

    //     const targetMatrix: Matrix = target._$transform.concatenatedMatrix;
    //     targetMatrix.invert();

    //     const resultBounds: BoundsImpl = $boundsMatrix(
    //         targetBaseBounds, targetMatrix._$matrix
    //     );
    //     $poolBoundsObject(targetBaseBounds);
    //     $poolMatrix(targetMatrix);

    //     const xMin: number = resultBounds.xMin;
    //     const yMin: number = resultBounds.yMin;
    //     const xMax: number = resultBounds.xMax;
    //     const yMax: number = resultBounds.yMax;

    //     // pool
    //     $poolBoundsObject(resultBounds);

    //     return new Rectangle(
    //         xMin, yMin,
    //         $Math.abs(xMax - xMin),
    //         $Math.abs(yMax - yMin)
    //     );
    // }

    // /**
    //  * @description point オブジェクトをステージ（グローバル）座標から
    //  *              表示オブジェクトの（ローカル）座標に変換します。
    //  *              Converts the point object from the Stage (global) coordinates
    //  *              to the display object's (local) coordinates.
    //  *
    //  * @param  {Point} point
    //  * @return {Point}
    //  * @public
    //  */
    // globalToLocal (point: Point): Point
    // {
    //     const matrix: Matrix = this._$transform.concatenatedMatrix;
    //     matrix.invert();

    //     const newPoint: Point = new Point(
    //         point.x * matrix.a + point.y * matrix.c + matrix.tx,
    //         point.x * matrix.b + point.y * matrix.d + matrix.ty
    //     );

    //     $poolMatrix(matrix);

    //     return newPoint;
    // }

    // /**
    //  * @description 表示オブジェクトの境界ボックスを評価して、
    //  *              obj 表示オブジェクトの境界ボックスと重複または交差するかどうかを調べます。
    //  *              Evaluates the bounding box of the display object to see
    //  *              if it overlaps or intersects with the bounding box of the obj display object.
    //  *
    //  * @param   {DisplayObject} object
    //  * @returns {boolean}
    //  * @public
    //  */
    // hitTestObject (object: DisplayObjectImpl<any>): boolean
    // {
    //     const baseBounds1: BoundsImpl = "_$getBounds" in this && typeof this._$getBounds === "function"
    //         ? this._$getBounds() as BoundsImpl
    //         : $getBoundsObject();

    //     const matrix1: Matrix = this._$transform.concatenatedMatrix;
    //     const bounds1: BoundsImpl = $boundsMatrix(baseBounds1, matrix1._$matrix);

    //     // pool
    //     $poolMatrix(matrix1);
    //     $poolBoundsObject(baseBounds1);

    //     const baseBounds2: BoundsImpl = object._$getBounds(null);
    //     const matrix2: Matrix = object._$transform.concatenatedMatrix;
    //     const bounds2: BoundsImpl = $boundsMatrix(baseBounds2, matrix2._$matrix);

    //     // pool
    //     $poolMatrix(matrix2);
    //     $poolBoundsObject(baseBounds2);

    //     // calc
    //     const sx: number = $Math.max(bounds1.xMin, bounds2.xMin);
    //     const sy: number = $Math.max(bounds1.yMin, bounds2.yMin);
    //     const ex: number = $Math.min(bounds1.xMax, bounds2.xMax);
    //     const ey: number = $Math.min(bounds1.yMax, bounds2.yMax);

    //     // pool
    //     $poolBoundsObject(bounds1);
    //     $poolBoundsObject(bounds2);

    //     return ex - sx >= 0 && ey - sy >= 0;
    // }

    // /**
    //  * @description 表示オブジェクトを評価して、x および y パラメーターで指定された
    //  *              ポイントと重複または交差するかどうかを調べます。
    //  *              Evaluates the display object to see if it overlaps
    //  *              or intersects with the point specified by the x and y parameters.
    //  *
    //  * @param   {number}  x
    //  * @param   {number}  y
    //  * @param   {boolean} [shape_flag=false]
    //  * @returns {boolean}
    //  * @public
    //  */
    // hitTestPoint (
    //     x: number, y: number,
    //     shape_flag: boolean = false
    // ): boolean {

    //     if (shape_flag) {

    //         let matrix: Float32Array = $MATRIX_ARRAY_IDENTITY;

    //         let parent: ParentImpl<any> | null = this._$parent;
    //         while (parent) {

    //             matrix = $multiplicationMatrix(
    //                 parent._$transform._$rawMatrix(),
    //                 matrix
    //             );

    //             parent = parent._$parent;
    //         }

    //         $hitContext.setTransform(1, 0, 0, 1, 0, 0);
    //         $hitContext.beginPath();

    //         let result: boolean = false;
    //         if ("_$hit" in this && typeof this._$hit === "function") {
    //             result = this._$hit($hitContext, matrix, { "x": x, "y": y }, true);
    //         }

    //         if (matrix !== $MATRIX_ARRAY_IDENTITY) {
    //             $poolFloat32Array6(matrix);
    //         }

    //         return result;
    //     }

    //     const baseBounds: BoundsImpl = "_$getBounds" in this && typeof this._$getBounds === "function"
    //         ? this._$getBounds() as BoundsImpl
    //         : $getBoundsObject();

    //     const bounds: BoundsImpl = $boundsMatrix(baseBounds, this._$transform._$rawMatrix());
    //     $poolBoundsObject(baseBounds);

    //     const rectangle: Rectangle = new Rectangle(
    //         bounds.xMin, bounds.yMin,
    //         bounds.xMax - bounds.xMin,
    //         bounds.yMax - bounds.yMin
    //     );

    //     // pool
    //     $poolBoundsObject(bounds);

    //     const point: Point = this._$parent
    //         ? this._$parent.globalToLocal(new Point(x, y))
    //         : new Point(x, y);

    //     return rectangle.containsPoint(point);
    // }

    // /**
    //  * @description point オブジェクトを表示オブジェクトの（ローカル）座標から
    //  *              ステージ（グローバル）座標に変換します。
    //  *              Converts the point object from the display object's (local) coordinates
    //  *              to the Stage (global) coordinates.
    //  *
    //  *
    //  * @param   {Point} point
    //  * @returns {Point}
    //  * @public
    //  */
    // localToGlobal (point: Point): Point
    // {
    //     const matrix: Matrix = this
    //         ._$transform
    //         .concatenatedMatrix;

    //     const newPoint: Point = new Point(
    //         point.x * matrix.a + point.y * matrix.c + matrix.tx,
    //         point.x * matrix.b + point.y * matrix.d + matrix.ty
    //     );

    //     $poolMatrix(matrix);

    //     return newPoint;
    // }

    // /**
    //  * @description クラスのローカル変数空間から値を取得
    //  *              Get a value from the local variable space of the class
    //  *
    //  * @param  {*} key
    //  * @return {*}
    //  * @method
    //  * @public
    //  */
    // getLocalVariable (key: any): any
    // {
    //     if (!this._$variables) {
    //         return null;
    //     }

    //     if (this._$variables.has(key)) {
    //         return this._$variables.get(key);
    //     }
    // }

    // /**
    //  * @description クラスのローカル変数空間へ値を保存
    //  *              Store values in the local variable space of the class
    //  *
    //  * @param  {*} key
    //  * @param  {*} value
    //  * @return {void}
    //  * @method
    //  * @public
    //  */
    // setLocalVariable (key: any, value: any): void
    // {
    //     if (!this._$variables) {
    //         this._$variables = $getMap();
    //     }
    //     this._$variables.set(key, value);
    // }

    // /**
    //  * @description クラスのローカル変数空間に値があるかどうかを判断します。
    //  *              Determines if there is a value in the local variable space of the class.
    //  *
    //  * @param  {*} key
    //  * @return {boolean}
    //  * @method
    //  * @public
    //  */
    // hasLocalVariable (key: any): boolean
    // {
    //     return this._$variables
    //         ? this._$variables.has(key)
    //         : false;
    // }

    // /**
    //  * @description クラスのローカル変数空間の値を削除
    //  *              Remove values from the local variable space of a class
    //  *
    //  * @param  {*} key
    //  * @return {void}
    //  * @method
    //  * @public
    //  */
    // deleteLocalVariable (key: any): void
    // {
    //     if (this._$variables && this._$variables.has(key)) {
    //         this._$variables.delete(key);
    //         if (!this._$variables.size) {
    //             $poolMap(this._$variables);
    //             this._$variables = null;
    //         }
    //     }
    // }

    // /**
    //  * @description グローバル変数空間から値を取得
    //  *              Get a value from the global variable space
    //  *
    //  * @param  {*} key
    //  * @return {*}
    //  * @method
    //  * @public
    //  */
    // getGlobalVariable (key: any): any
    // {
    //     if ($variables.has(key)) {
    //         return $variables.get(key);
    //     }
    //     return null;
    // }

    // /**
    //  * @description グローバル変数空間へ値を保存
    //  *              Save values to global variable space
    //  *
    //  * @param  {*} key
    //  * @param  {*} value
    //  * @return {void}
    //  * @method
    //  * @public
    //  */
    // setGlobalVariable (key: any, value: any): void
    // {
    //     $variables.set(key, value);
    // }

    // /**
    //  * @description グローバル変数空間に値があるかどうかを判断します。
    //  *              Determines if there is a value in the global variable space.
    //  *
    //  * @param  {*} key
    //  * @return {boolean}
    //  * @method
    //  * @public
    //  */
    // hasGlobalVariable (key: any): boolean
    // {
    //     return $variables.has(key);
    // }

    // /**
    //  * @description グローバル変数空間の値を削除
    //  *              Remove values from global variable space.
    //  *
    //  * @param  {*} key
    //  * @return {void}
    //  * @method
    //  * @public
    //  */
    // deleteGlobalVariable (key: any): void
    // {
    //     if ($variables.has(key)) {
    //         $variables.delete(key);
    //     }
    // }

    // /**
    //  * @description グローバル変数空間に値を全てクリアします。
    //  *              Clear all values in the global variable space.
    //  *
    //  * @return {void}
    //  * @method
    //  * @public
    //  */
    // clearGlobalVariable (): void
    // {
    //     return $variables.clear();
    // }

    // /**
    //  * @return {void}
    //  * @method
    //  * @private
    //  */
    // _$updateState (): void
    // {
    //     this._$isNext = true;

    //     const parent: ParentImpl<any> | null = this._$parent;
    //     if (parent) {
    //         parent._$updateState();
    //     }
    // }

    // /**
    //  * @param  {CanvasToWebGLContext} context
    //  * @param  {Float32Array}         matrix
    //  * @param  {array}                filters
    //  * @param  {number}               width
    //  * @param  {number}               height
    //  * @param  {WebGLTexture}         [target_texture = null]
    //  * @return {object}
    //  * @method
    //  * @private
    //  */
    // _$drawFilter (
    //     context: CanvasToWebGLContext,
    //     matrix: Float32Array,
    //     filters: FilterArrayImpl,
    //     width: number,
    //     height: number,
    //     target_texture: WebGLTexture | null = null
    // ): CachePositionImpl {

    //     const cacheKeys: any[] = $getArray(this._$instanceId, "f");
    //     let position: CachePositionImpl | void = $cacheStore.get(cacheKeys);

    //     const updated: boolean = this._$isFilterUpdated(matrix, filters, true);

    //     if (position && !updated) {
    //         context.cachePosition = position;
    //         return position;
    //     }

    //     // cache clear
    //     if (position) {
    //         $cacheStore.set(cacheKeys, null);
    //     }

    //     const manager: FrameBufferManager = context.frameBuffer;
    //     const targetTexture: WebGLTexture = target_texture
    //         ? target_texture
    //         : context.getTextureFromRect(
    //             context.cachePosition as NonNullable<CachePositionImpl>
    //         );

    //     const texture: WebGLTexture = this._$applyFilter(
    //         context, filters, targetTexture,
    //         matrix, width, height
    //     );
    //     manager.textureManager.release(targetTexture);

    //     const bounds: BoundsImpl = this._$getLayerBounds(matrix);
    //     position = manager.createCachePosition(
    //         $Math.ceil($Math.abs(bounds.xMax - bounds.xMin)),
    //         $Math.ceil($Math.abs(bounds.yMax - bounds.yMin))
    //     );
    //     $poolBoundsObject(bounds);

    //     position.filterState = true;
    //     position.matrix      = `${matrix[0]}_${matrix[1]}_${matrix[2]}_${matrix[3]}_0_0`;
    //     position.offsetX     = texture.offsetX;
    //     position.offsetY     = texture.offsetY;

    //     // 関数先でtextureがreleaseされる
    //     context.drawTextureFromRect(texture, position);

    //     $cacheStore.set(cacheKeys, position);
    //     $poolArray(cacheKeys);

    //     return position;
    // }

    // /**
    //  * @param   {Float32Array} multi_matrix
    //  * @returns {object}
    //  * @private
    //  */
    // _$getLayerBounds (multi_matrix: Float32Array): BoundsImpl
    // {
    //     const baseBounds: BoundsImpl = "_$getBounds" in this && typeof this._$getBounds === "function"
    //         ? this._$getBounds() as BoundsImpl
    //         : $getBoundsObject();

    //     const bounds: BoundsImpl = $boundsMatrix(baseBounds, multi_matrix);
    //     $poolBoundsObject(baseBounds);

    //     const filters: FilterArrayImpl = this._$filters || this.filters;
    //     if (!filters.length) {
    //         return bounds;
    //     }

    //     let filterBounds: BoundsImpl = $getBoundsObject(
    //         0,
    //         $Math.abs(bounds.xMax - bounds.xMin),
    //         0,
    //         $Math.abs(bounds.yMax - bounds.yMin)
    //     );
    //     $poolBoundsObject(bounds);

    //     let xScale: number = +$Math.sqrt(
    //         multi_matrix[0] * multi_matrix[0]
    //         + multi_matrix[1] * multi_matrix[1]
    //     );
    //     let yScale: number = +$Math.sqrt(
    //         multi_matrix[2] * multi_matrix[2]
    //         + multi_matrix[3] * multi_matrix[3]
    //     );

    //     xScale /= $devicePixelRatio;
    //     yScale /= $devicePixelRatio;

    //     xScale *= 2;
    //     yScale *= 2;

    //     for (let idx: number = 0; idx < filters.length; ++idx) {
    //         filterBounds = filters[idx]
    //             ._$generateFilterRect(filterBounds, xScale, yScale);
    //     }

    //     return filterBounds;
    // }

    // /**
    //  * @return {boolean}
    //  * @method
    //  * @private
    //  */
    // _$nextFrame (): boolean
    // {
    //     // added event
    //     this._$executeAddedEvent();

    //     this._$isNext = false;

    //     return false;
    // }

    // /**
    //  * @param  {array} [filters=null]
    //  * @return {boolean}
    //  * @private
    //  */
    // _$canApply (filters: FilterArrayImpl | null = null): boolean
    // {
    //     if (filters) {
    //         for (let idx: number = 0; idx < filters.length; ++idx) {
    //             if (filters[idx]._$canApply()) {
    //                 return true;
    //             }
    //         }
    //     }
    //     return false;
    // }

    // /**
    //  * @param  {Float32Array} matrix
    //  * @param  {array}        [filters=null]
    //  * @param  {boolean}      [can_apply=false]
    //  * @param  {number}       [position_x=0]
    //  * @param  {number}       [position_y=0]
    //  * @return {boolean}
    //  * @private
    //  */
    // _$isFilterUpdated (
    //     matrix: Float32Array,
    //     filters: FilterArrayImpl | null = null,
    //     can_apply: boolean = false
    // ): boolean {

    //     // cache flag
    //     if (this._$isUpdated()) {
    //         return true;
    //     }

    //     // check filter data
    //     if (can_apply && filters) {

    //         for (let idx: number = 0; idx < filters.length; ++idx) {

    //             if (!filters[idx]._$isUpdated()) {
    //                 continue;
    //             }

    //             return true;
    //         }

    //     }

    //     // check status
    //     const cache: CachePositionImpl = $cacheStore.get([this._$instanceId, "f"]);
    //     if (!cache) {
    //         return true;
    //     }

    //     if (cache.filterState !== can_apply) {
    //         return true;
    //     }

    //     if (cache.matrix !== `${matrix[0]}_${matrix[1]}_${matrix[2]}_${matrix[3]}`) {
    //         return true;
    //     }

    //     return false;
    // }

    // /**
    //  * @param  {CanvasToWebGLContext} context
    //  * @param  {array} filters
    //  * @param  {WebGLTexture} target_texture
    //  * @param  {Float32Array} matrix
    //  * @param  {number} width
    //  * @param  {number} height
    //  * @return {WebGLTexture}
    //  * @private
    //  */
    // _$applyFilter (
    //     context: CanvasToWebGLContext,
    //     filters: FilterArrayImpl,
    //     target_texture: WebGLTexture,
    //     matrix: Float32Array,
    //     width: number,
    //     height: number
    // ): WebGLTexture {

    //     const xScale: number = +$Math.sqrt(
    //         matrix[0] * matrix[0]
    //         + matrix[1] * matrix[1]
    //     );
    //     const yScale: number = +$Math.sqrt(
    //         matrix[2] * matrix[2]
    //         + matrix[3] * matrix[3]
    //     );

    //     const radianX: number = $Math.atan2(matrix[1], matrix[0]);
    //     const radianY: number = $Math.atan2(-matrix[2], matrix[3]);

    //     const parentMatrix: Float32Array = $getFloat32Array6(
    //         $Math.cos(radianX), $Math.sin(radianX),
    //         -$Math.sin(radianY), $Math.cos(radianY),
    //         width / 2, height / 2
    //     );

    //     const baseMatrix: Float32Array = $getFloat32Array6(
    //         1, 0, 0, 1,
    //         -target_texture.width / 2,
    //         -target_texture.height / 2
    //     );

    //     const multiMatrix: Float32Array = $multiplicationMatrix(
    //         parentMatrix, baseMatrix
    //     );
    //     $poolFloat32Array6(parentMatrix);
    //     $poolFloat32Array6(baseMatrix);

    //     const manager: FrameBufferManager = context.frameBuffer;
    //     const currentAttachment: AttachmentImpl | null = manager.currentAttachment;

    //     const attachment: AttachmentImpl = manager
    //         .createCacheAttachment(width, height);
    //     context._$bind(attachment);

    //     context.reset();
    //     context.setTransform(
    //         multiMatrix[0], multiMatrix[1],
    //         multiMatrix[2], multiMatrix[3],
    //         multiMatrix[4], multiMatrix[5]
    //     );
    //     $poolFloat32Array6(multiMatrix);

    //     context.drawImage(target_texture,
    //         0, 0, target_texture.width, target_texture.height
    //     );

    //     // init
    //     context._$offsetX = 0;
    //     context._$offsetY = 0;

    //     const filterMatrix: Float32Array = $getFloat32Array6(
    //         xScale, 0, 0, yScale, 0, 0
    //     );

    //     let texture: WebGLTexture | null = null;
    //     for (let idx: number = 0; idx < filters.length; ++idx) {
    //         texture = filters[idx]._$applyFilter(context, filterMatrix);
    //     }

    //     $poolFloat32Array6(filterMatrix);

    //     if (!texture) {
    //         return target_texture;
    //     }

    //     const offsetX: number = context._$offsetX;
    //     const offsetY: number = context._$offsetY;

    //     // reset
    //     context._$offsetX = 0;
    //     context._$offsetY = 0;

    //     // set offset
    //     texture.offsetX = offsetX;
    //     texture.offsetY = offsetY;

    //     context._$bind(currentAttachment);
    //     manager.releaseAttachment(attachment, false);

    //     return texture;
    // }

    // /**
    //  * @description AnimationToolのシンボルと同期
    //  *              Synchronize with AnimationTool symbol
    //  * 
    //  * @param {number} character_id 
    //  * @param {object} character 
    //  * @param {LoaderInfo} loaderInfo 
    //  * @return {void}
    //  * @method
    //  * @protected
    //  */
    // _$sync (
    //     character_id: number,
    //     character: ICharacter,
    //     loaderInfo: LoaderInfo
    // ): void {

    //     // setup
    //     this.characterId = character_id;
    //     $loaderInfoMap.set(this, loaderInfo);

    //     // build
    //     this._$buildCharacter(character);
    // }
}
