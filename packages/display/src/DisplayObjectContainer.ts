import type { DisplayObject } from "./DisplayObject";
import type { IDisplayObject } from "./interface/IDisplayObject";
import type { IParent } from "./interface/IParent";
import { execute as displayObjectApplyChangesService } from "./DisplayObject/service/DisplayObjectApplyChangesService";
import { execute as displayObjectContainerAddChildUseCase } from "./DisplayObjectContainer/usecase/DisplayObjectContainerAddChildUseCase";
import { execute as displayObjectContainerRemoveChildUseCase } from "./DisplayObjectContainer/usecase/DisplayObjectContainerRemoveChildUseCase";
import { execute as displayObjectContainerRemoveChildAtUseCase } from "./DisplayObjectContainer/usecase/DisplayObjectContainerRemoveChildAtUseCase";
import { execute as displayObjectContainerGetChildAtService } from "./DisplayObjectContainer/service/DisplayObjectContainerGetChildAtService";
import { execute as displayObjectContainerContainsService } from "./DisplayObjectContainer/service/DisplayObjectContainerContainsService";
import { execute as displayObjectContainerGetChildByNameService } from "./DisplayObjectContainer/service/DisplayObjectContainerGetChildByNameService";
import { execute as displayObjectContainerRemoveChildrenUseCase } from "./DisplayObjectContainer/usecase/DisplayObjectContainerRemoveChildrenUseCase";
import { execute as displayObjectContainerSetChildIndexUseCase } from "./DisplayObjectContainer/usecase/DisplayObjectContainerSetChildIndexUseCase";
import { execute as displayObjectContainerSwapChildrenUseCase } from "./DisplayObjectContainer/usecase/DisplayObjectContainerSwapChildrenUseCase";
import { execute as displayObjectContainerSwapChildrenAtUseCase } from "./DisplayObjectContainer/usecase/DisplayObjectContainerSwapChildrenAtUseCase";
import { $getArray } from "./DisplayObjectUtil";
import { InteractiveObject } from "./InteractiveObject";

/**
 * @description DisplayObjectContainer クラスは、表示リストで表示オブジェクトコンテナとして機能するすべてのオブジェクトの基本クラスです。
 *              このクラス自体は、画面上でのコンテンツの描画のための API を含みません。
 *              そのため、DisplayObject クラスのカスタムサブクラスを作成する場合は、
 *              Sprite、または MovieClip など、画面上にコンテンツを描画する API を持つサブクラスの 1 つを拡張する必要があります。
 *
 *              The DisplayObjectContainer class is the base class for all objects that can serve
 *              as display object containers on the display list.
 *              This class itself does not contain any API for drawing content on the screen.
 *              Therefore, if you want to create a custom subclass of the DisplayObject class,
 *              you need to extend one of its subclasses that has an API for drawing content on the screen,
 *              such as Sprite or MovieClip.
 *
 * @class
 * @memberOf next2d.display
 * @extends  InteractiveObject
 */
export class DisplayObjectContainer extends InteractiveObject
{
    /**
     * @description 描画対象となるDisplayObjectの配列です。
     *              An array of DisplayObjects to be drawn.
     *
     * @type {array}
     * @readonly
     * @private
     */
    protected readonly _$children: IDisplayObject<any>[];

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
     * @description オブジェクトの子がマウスまたはユーザー入力デバイスに対応しているかどうかを判断します。
     *              Determine if the object's children are compatible with mouse or user input devices.
     *
     * @type {boolean}
     * @default true
     * @public
     */
    public mouseChildren: boolean;

    /**
     * @description このコンテナ何にセットされているコンテナだけの配列
     *              An array of containers set in this container
     *
     * @type {IParent<any>[] | null}
     * @public
     */
    public $container: IParent<any>[] | null;

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
     * @constructor
     * @public
     */
    constructor ()
    {
        super();

        // public
        this.isContainerEnabled = true;
        this.mouseChildren      = true;

        // private
        this._$mask     = null;
        this._$children = $getArray();

        // protected
        this.$container = null;
    }

    /**
     * @description コンテナのアクティブな子要素を返却
     *              Returns the active child elements of the container.
     *
     * @return {array}
     * @method
     * @protected
     */
    get children (): IDisplayObject<any>[]
    {
        return this._$children;
    }

    /**
     * @description このオブジェクトの子の数を返します。
     *              Returns the number of children of this object.
     *
     * @member   {number}
     * @readonly
     * @public
     */
    get numChildren (): number
    {
        return this.children.length;
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
     * @description この DisplayObjectContainer インスタンスに子 DisplayObject インスタンスを追加します。
     *              Adds a child DisplayObject instance to this DisplayObjectContainer instance.
     *
     * @param  {DisplayObject} display_object
     * @return {DisplayObject}
     * @method
     * @public
     */
    addChild<D extends DisplayObject> (display_object: D): D
    {
        return displayObjectContainerAddChildUseCase(this, display_object);
    }

    /**
     * @description この DisplayObjectContainer インスタンスに子 DisplayObject インスタンスを追加します。
     *              Adds a child DisplayObject instance to this DisplayObjectContainer instance.
     *
     * @param  {DisplayObject} display_object
     * @param  {number}        index
     * @return {DisplayObject}
     * @method
     * @public
     */
    addChildAt<D extends DisplayObject> (
        display_object: D,
        index: number
    ): D {
        return displayObjectContainerAddChildUseCase(this, display_object, index);
    }

    /**
     * @description 指定された DisplayObject が、DisplayObjectContainer インスタンスの子孫であるか
     *              もしくは、インスタンス自体であるかを指定します。
     *              Whether the specified DisplayObject is a descendant of a DisplayObjectContainer instance.
     *              or the instance itself.
     *
     * @param  {DisplayObject} display_object
     * @return {boolean}
     * @method
     * @public
     */
    contains<D extends DisplayObject> (display_object: D): boolean
    {
        return displayObjectContainerContainsService(this, display_object);
    }

    /**
     * @description 指定のインデックス位置にある子表示オブジェクトインスタンスを返します。
     *              Returns the child display object instance that exists at the specified index.
     *
     * @param  {number} index
     * @return {DisplayObject}
     * @method
     * @public
     */
    getChildAt<D extends DisplayObject> (index: number): D | null
    {
        return displayObjectContainerGetChildAtService(this, index);
    }

    /**
     * @description 指定された名前に一致する子表示オブジェクトを返します。
     *              Returns the child display object that exists with the specified name.
     *
     * @param  {string} name
     * @return {{DisplayObject}|null}
     * @method
     * @public
     */
    getChildByName<D extends DisplayObject> (name: string): D | null
    {
        return displayObjectContainerGetChildByNameService(this, name);
    }

    /**
     * @description 子 DisplayObject インスタンスのインデックス位置を返します。
     *              Returns the index position of a child DisplayObject instance.
     *
     * @param  {DisplayObject} display_object
     * @return {number}
     * @method
     * @public
     */
    getChildIndex<D extends DisplayObject> (display_object: D): number
    {
        return this.children.indexOf(display_object);
    }

    /**
     * @description DisplayObjectContainer インスタンスの子リストから指定の
     *              child DisplayObject インスタンスを削除します。
     *              Removes the specified child DisplayObject instance from the
     *              child list of the DisplayObjectContainer instance.
     *
     * @param  {DisplayObject} display_object
     * @return {void}
     * @method
     * @public
     */
    removeChild<D extends DisplayObject> (display_object: D): void
    {
        displayObjectContainerRemoveChildUseCase(this, display_object);
    }

    /**
     * @description DisplayObjectContainer の子リストの指定された index 位置から子 DisplayObject を削除します。
     *              Removes a child DisplayObject from the specified index position
     *              in the child list of the DisplayObjectContainer.
     *
     * @param  {number} index
     * @return {void}
     * @method
     * @public
     */
    removeChildAt (index: number): void
    {
        displayObjectContainerRemoveChildAtUseCase(this, index);
    }

    /**
     * @description 配列で指定されたインデックスの子をコンテナから削除します
     *              Removes children of the index specified in the array from the container
     *
     * @param  {number[]} indexes
     * @return {void}
     * @method
     * @public
     */
    removeChildren (...indexes: number[]): void
    {
        displayObjectContainerRemoveChildrenUseCase(this, indexes);
    }

    /**
     * @description 表示オブジェクトコンテナの既存の子の位置を変更します。
     *              Changes the position of an existing child in the display object container.
     *
     * @param  {DisplayObject} display_object
     * @param  {number} index
     * @return {void}
     * @method
     * @public
     */
    setChildIndex<D extends DisplayObject> (
        display_object: D,
        index: number
    ): void {
        displayObjectContainerSetChildIndexUseCase(this, display_object, index);
    }

    /**
     * @description 指定された 2 つの子オブジェクトの z 順序（重ね順）を入れ替えます。
     *              Swaps the z-order (front-to-back order) of the two specified child objects.
     *
     * @param  {DisplayObject} display_object1
     * @param  {DisplayObject} display_object2
     * @return {void}
     * @method
     * @public
     */
    swapChildren<D extends DisplayObject> (
        display_object1: D,
        display_object2: D
    ): void {
        displayObjectContainerSwapChildrenUseCase(this, display_object1, display_object2);
    }

    /**
     * @description 子リスト内の指定されたインデックス位置に該当する 2 つの子オブジェクトの z 順序（重ね順）を入れ替えます。
     *              Swaps the z-order (front-to-back order) of the child objects at
     *              the two specified index positions in the child list.
     *
     * @param  {number} index1
     * @param  {number} index2
     * @return {void}
     * @method
     * @public
     */
    swapChildrenAt (index1: number, index2: number): void
    {
        displayObjectContainerSwapChildrenAtUseCase(this, index1, index2);
    }
}