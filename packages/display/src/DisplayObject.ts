import type { LoaderInfo } from "./LoaderInfo";
import type { Sprite } from "./Sprite";
import type { IParent } from "./interface/IParent";
import type { IPlaceObject } from "./interface/IPlaceObject";
import type { IBlendMode } from "./interface/IBlendMode";
import type { IFilterArray } from "./interface/IFilterArray";
import type { IDisplayObject } from "./interface/IDisplayObject";
import type { MovieClip } from "./MovieClip";
import type {
    ColorTransform,
    Matrix,
    Rectangle,
    Point
} from "@next2d/geom";
import { EventDispatcher } from "@next2d/events";
import { execute as displayObjectApplyChangesService } from "./DisplayObject/service/DisplayObjectApplyChangesService";
import { execute as displayObjectConcatenatedMatrixUseCase } from "./DisplayObject/usecase/DisplayObjectConcatenatedMatrixUseCase";
import { execute as displayObjectGetAlphaUseCase } from "./DisplayObject/usecase/DisplayObjectGetAlphaUseCase";
import { execute as displayObjectSetAlphaUseCase } from "./DisplayObject/usecase/DisplayObjectSetAlphaUseCase";
import { execute as displayObjectGetFiltersUseCase } from "./DisplayObject/usecase/DisplayObjectGetFiltersUseCase";
import { execute as displayObjectSetFiltersUseCase } from "./DisplayObject/usecase/DisplayObjectSetFiltersUseCase";
import { execute as displayObjectGetBlendModeUseCase } from "./DisplayObject/usecase/DisplayObjectGetBlendModeUseCase";
import { execute as displayObjectSetBlendModeUseCase } from "./DisplayObject/usecase/DisplayObjectSetBlendModeUseCase";
import { execute as displayObjectGetRotationUseCase } from "./DisplayObject/usecase/DisplayObjectGetRotationUseCase";
import { execute as displayObjectSetRotationUseCase } from "./DisplayObject/usecase/DisplayObjectSetRotationUseCase";
import { execute as displayObjectGetScaleXUseCase } from "./DisplayObject/usecase/DisplayObjectGetScaleXUseCase";
import { execute as displayObjectSetScaleXUseCase } from "./DisplayObject/usecase/DisplayObjectSetScaleXUseCase";
import { execute as displayObjectGetScaleYUseCase } from "./DisplayObject/usecase/DisplayObjectGetScaleYUseCase";
import { execute as displayObjectSetScaleYUseCase } from "./DisplayObject/usecase/DisplayObjectSetScaleYUseCase";
import { execute as displayObjectGetXUseCase } from "./DisplayObject/usecase/DisplayObjectGetXUseCase";
import { execute as displayObjectSetXUseCase } from "./DisplayObject/usecase/DisplayObjectSetXUseCase";
import { execute as displayObjectGetYUseCase } from "./DisplayObject/usecase/DisplayObjectGetYUseCase";
import { execute as displayObjectSetYUseCase } from "./DisplayObject/usecase/DisplayObjectSetYUseCase";
import { execute as displayObjectGetWidthUseCase } from "./DisplayObject/usecase/DisplayObjectGetWidthUseCase";
import { execute as displayObjectSetWidthUseCase } from "./DisplayObject/usecase/DisplayObjectSetWidthUseCase";
import { execute as displayObjectLocalToGlobalService } from "./DisplayObject/service/DisplayObjectLocalToGlobalService";
import { execute as displayObjectGlobalToLocalService } from "./DisplayObject/service/DisplayObjectGlobalToLocalService";
import { execute as displayObjectGetHeightUseCase } from "./DisplayObject/usecase/DisplayObjectGetHeightUseCase";
import { execute as displayObjectSetHeightUseCase } from "./DisplayObject/usecase/DisplayObjectSetHeightUseCase";
import {
    $getInstanceId,
    $parentMap,
    $loaderInfoMap,
    $rootMap,
    $variables
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
     * @description Spriteの機能を所持しているかを返却
     *              Returns whether Sprite functions are possessed.
     *
     * @type {boolean}
     * @readonly
     * @public
     */
    public readonly isSprite: boolean;

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
     *
     * @type {string}
     * @public
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
    public $matrix: Matrix | null;

    /**
     * @description 固定されたカラートランスフォーム、nullの場合はPlaceObjectのカラートランスフォームを検索します。
     *              Fixed color transform, if null, search for PlaceObject color transform.
     *
     * @type {ColorTransform}
     * @default null
     * @protected
     */
    public $colorTransform: ColorTransform | null;

    /**
     * @description 表示オブジェクトに現在関連付けられている各フィルターオブジェクトの配列です。
     *              An array of filter objects currently associated with the display object.
     *
     * @type {array}
     * @default null
     * @protected
     */
    public $filters: IFilterArray | null;

    /**
     * @description 使用するブレンドモードを指定する BlendMode クラスの値です。
     *              A value from the BlendMode class that specifies which blend mode to use.
     *
     * @type {string}
     * @default BlendMode.NORMAL
     * @protected
     */
    public $blendMode: IBlendMode | null;

    /**
     * @description キャッシュした scaleX の値を返却します。
     *              Returns the cached scaleX value.
     *
     * @type {number}
     * @default null
     * @protected
     */
    public $scaleX: number | null;

    /**
     * @description キャッシュした scaleY の値を返却します。
     *              Returns the cached scaleY value.
     *
     * @type {number}
     * @default null
     * @protected
     */
    public $scaleY: number | null;

    /**
     * @description キャッシュした rotation の値を返却します。
     *              Returns the cached rotation value.
     *
     * @type {number}
     * @default null
     * @protected
     */
    public $rotation: number | null;

    /**
     * @description キャッシュした alpha の値を返却します。
     *              Returns the cached alpha value.
     *
     * @type {number}
     * @default null
     * @protected
     */
    public $alpha: number | null;

    /**
     * @description 表示オブジェクトのスケール9グリッドを示します。
     *              Indicates the scale9 grid of the display object.
     *
     * @type {Rectangle}
     * @private
     */
    private _$scale9Grid: Rectangle | null;

    /**
     * @description 表示オブジェクトの可視性を示します。
     *              Indicates the visibility of the display object.
     *
     * @type {boolean}
     * @private
     */
    private _$visible: boolean;

    /**
     * @description 表示オブジェクト単位の変数を保持するマップ
     *              Map that holds variables for display objects
     *
     * @type {Map<any, any>}
     * @default null
     * @private
     */
    private _$variables: Map<any, any> | null;

    /**
     * @description セットされてるDisplayObjectがマスクとして使用されます。
     *              The DisplayObject set is used as a mask.
     * 
     * @type {IDisplayObject<any>|null}
     * @default null
     * @private
     */
    private _$mask: IDisplayObject<any> | null;

    /**
     * @description マスクとしてDisplayObjectにセットされているかを示します。
     *              Indicates whether the DisplayObject is set as a mask.
     * 
     * @type {boolean}
     * @default false
     * @private
     */
    public isMask: boolean;

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

        // 各小クラスの機能を所持しているか
        this.isSprite           = false;
        this.isContainerEnabled = false;
        this.isTimelineEnabled  = false;
        this.isShape            = false;
        this.isVideo            = false;
        this.isText             = false;

        // PlaceObject
        this.placeId       = -1;
        this.placeObject   = null;

        // Characterパラメーター
        this.characterId = -1;
        this.clipDepth   = 0;
        this.name        = "";
        this.startFrame  = 1;
        this.endFrame    = 0;

        // フラグ
        this.isMask        = false;
        this.changed       = true;
        this.$added        = false;
        this.$addedToStage = false;

        // Transform変数
        this.$matrix         = null;
        this.$colorTransform = null;
        this.$filters        = null;
        this.$blendMode      = null;

        this._$visible    = true;
        this._$mask       = null;
        this._$scale9Grid = null;
        this._$variables  = null;

        // キャッシュ
        this.$alpha    = null;
        this.$scaleX   = null;
        this.$scaleY   = null;
        this.$rotation = null;
    }

    /**
     * @description この表示オブジェクトおよびルートレベルまでのそのすべての親オブジェクトの結合された Matrix を返却します。
     *              Returns a concatenated Matrix object representing the combined transformation matrixes of the display object and all of its parent objects, back to the root level.
     *
     * @member  {Matrix}
     * @readonly
     */
    get concatenatedMatrix (): Matrix
    {
        return displayObjectConcatenatedMatrixUseCase(this);
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
        return displayObjectGetAlphaUseCase(this);
    }
    set alpha (alpha: number)
    {
        displayObjectSetAlphaUseCase(this, alpha);
    }

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
        return displayObjectGetBlendModeUseCase(this);
    }
    set blendMode (blend_mode: IBlendMode)
    {
        displayObjectSetBlendModeUseCase(this, blend_mode);
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
        return displayObjectGetFiltersUseCase(this);
    }
    set filters (filters: IFilterArray | null)
    {
        displayObjectSetFiltersUseCase(this, filters);
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
        return displayObjectGetHeightUseCase(this);
    }
    set height (height: number)
    {
        displayObjectSetHeightUseCase(this, height);
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
        return $loaderInfoMap.has(this)
            ? $loaderInfoMap.get(this) as NonNullable<LoaderInfo>
            : null;
    }

    /**
     * @description 呼び出し元の表示オブジェクトは、指定された mask オブジェクトによってマスクされます。
     *              The calling display object is masked by the specified mask object.
     *
     * @member {DisplayObject|null}
     * @public
     */
    get mask (): IDisplayObject<any> | null
    {
        return this._$mask;
    }
    set mask (mask: IDisplayObject<any> | null)
    {
        if (mask === this._$mask) {
            return ;
        }

        // 初期化
        if (this._$mask) {
            this._$mask.isMask = false;
            this._$mask = null;
        }

        if (mask) {
            mask.isMask = true;
            this._$mask = mask;
        }

        displayObjectApplyChangesService(this);
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
    get parent (): IParent<MovieClip | Sprite> | null
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
        return displayObjectGetRotationUseCase(this);
    }
    set rotation (rotation: number)
    {
        displayObjectSetRotationUseCase(this, rotation);
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
        if (this._$scale9Grid === scale_9_grid) {
            return ;
        }
        this._$scale9Grid = scale_9_grid;
        displayObjectApplyChangesService(this);
    }

    /**
     * @description 基準点から適用されるオブジェクトの水平スケール値を返却します。
     *              Returns the horizontal scale value of the object applied from the reference point.
     *
     * @member {number}
     * @public
     */
    get scaleX (): number
    {
        return displayObjectGetScaleXUseCase(this);
    }
    set scaleX (scale_x: number)
    {
        displayObjectSetScaleXUseCase(this, scale_x);
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
        return displayObjectGetScaleYUseCase(this);
    }
    set scaleY (scale_y: number)
    {
        displayObjectSetScaleYUseCase(this, scale_y);
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
        if (this._$visible === visible) {
            return ;
        }
        this._$visible = !!visible;
        displayObjectApplyChangesService(this);
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
        return displayObjectGetWidthUseCase(this);
    }
    set width (width: number)
    {
        displayObjectSetWidthUseCase(this, width);
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
        return displayObjectGetXUseCase(this);
    }
    set x (x: number)
    {
        displayObjectSetXUseCase(this, x);
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
        return displayObjectGetYUseCase(this);
    }
    set y (y: number)
    {
        displayObjectSetYUseCase(this, y);
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
        return displayObjectGlobalToLocalService(this, point);
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

    /**
     * @description point オブジェクトを表示オブジェクトの（ローカル）座標からステージ（グローバル）座標に変換します。
     *              Converts the point object from the display object's (local) coordinates to the Stage (global) coordinates.
     *
     * @param   {Point} point
     * @returns {Point}
     * @public
     */
    localToGlobal (point: Point): Point
    {
        return displayObjectLocalToGlobalService(this, point);
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
            this._$variables = new Map();
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