import type { DisplayObject } from "./DisplayObject";
import type { IDisplayObject } from "./interface/IDisplayObject";
import { execute as displayObjectApplyChangesService } from "./DisplayObject/service/DisplayObjectApplyChangesService";
import { execute as displayObjectContainerAddChildUseCase } from "./DisplayObjectContainer/usecase/DisplayObjectContainerAddChildUseCase";
import { execute as displayObjectContainerRemoveChildUseCase } from "./DisplayObjectContainer/usecase/DisplayObjectContainerRemoveChildUseCase";
import { execute as displayObjectContainerGetChildAtService } from "./DisplayObjectContainer/service/DisplayObjectContainerGetChildAtService";
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
     * @description 指定された表示オブジェクトが、DisplayObjectContainer インスタンスの子であるか
     *              インスタンス自体であるかを指定します。
     *              Determines whether the specified display object is a child
     *              of the DisplayObjectContainer instance or the instance itself.
     *
     * @param  {DisplayObject} child
     * @return {boolean}
     * @method
     * @public
     */
    // contains (child: DisplayObjectImpl<any>): boolean
    // {
    //     if (this._$instanceId === child._$instanceId) {
    //         return true;
    //     }

    //     const children: DisplayObjectImpl<any>[] = this._$getChildren();
    //     for (let idx: number = 0; idx < children.length; ++idx) {

    //         const instance: DisplayObjectImpl<any> = children[idx];

    //         if (instance._$instanceId === child._$instanceId) {
    //             return true;
    //         }

    //         if (instance instanceof DisplayObjectContainer) {

    //             if (instance.contains(child)) {
    //                 return true;
    //             }

    //         }

    //     }

    //     return false;
    // }

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
    // getChildByName (name: string): DisplayObjectImpl<any> | null
    // {
    //     if (!name) {
    //         return null;
    //     }

    //     // fixed logic
    //     const children: DisplayObjectImpl<any>[] = this._$getChildren();
    //     for (let idx: number = 0; idx < children.length; ++idx) {

    //         const child: DisplayObjectImpl<any> = children[idx];
    //         if (child.name !== name) {
    //             continue;
    //         }

    //         return child;
    //     }

    //     return null;
    // }

    /**
     * @description 子 DisplayObject インスタンスのインデックス位置を返します。
     *              Returns the index position of a child DisplayObject instance.
     *
     * @param  {DisplayObject} display_object
     * @return {number}
     * @method
     * @public
     */
    getChildIndex <D extends DisplayObject>(display_object: D): number
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
    removeChild <D extends DisplayObject>(display_object: D): void
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
        const child = this.getChildAt(index);
        if (child) {
            this.removeChild(child);
        }
    }

    /**
     * @description DisplayObjectContainer インスタンスの子リストから
     *              すべての child DisplayObject インスタンスを削除します。
     *              Removes all child DisplayObject instances from
     *              the child list of the DisplayObjectContainer instance.
     *
     * @param  {number} [begin_index=0]
     * @param  {number} [end_index=0x7fffffff]
     * @return {void}
     * @method
     * @public
     */
    // removeChildren (
    //     begin_index: number = 0,
    //     end_index: number = 0x7fffffff
    // ): void {

    //     const children: DisplayObjectImpl<any>[] = this._$getChildren();
    //     if (!children.length) {
    //         return ;
    //     }

    //     begin_index = $clamp(begin_index, 0, 0x7ffffffe, 0) - 1;
    //     end_index   = $clamp(end_index, 1, 0x7ffffff, 0x7ffffff);

    //     for (let idx: number = $Math.min(end_index, children.length - 1); idx > begin_index; --idx) {
    //         this._$remove(children[idx]);
    //     }
    // }

    /**
     * @description 表示オブジェクトコンテナの既存の子の位置を変更します。
     *              Changes the position of an existing child in the display object container.
     *
     * @param  {DisplayObject} child
     * @param  {number} index
     * @return {void}
     * @method
     * @public
     */
    // setChildIndex (
    //     child: DisplayObjectImpl<any>,
    //     index: number
    // ): void {

    //     const currentIndex: number = this.getChildIndex(child);
    //     if (currentIndex === index) {
    //         return ;
    //     }

    //     const children: DisplayObjectImpl<any>[] = this._$getChildren();
    //     children.splice(currentIndex, 1);
    //     children.splice(index, 0, child);

    //     if ($rendererWorker) {
    //         this._$postChildrenIds();
    //     }

    //     this._$doChanged();
    // }

    /**
     * @description 指定された 2 つの子オブジェクトの z 順序（重ね順）を入れ替えます。
     *              Swaps the z-order (front-to-back order) of the two specified child objects.
     *
     * @param  {DisplayObject} child1
     * @param  {DisplayObject} child2
     * @return {void}
     * @method
     * @public
     */
    // swapChildren (
    //     child1: DisplayObjectImpl<any>,
    //     child2: DisplayObjectImpl<any>
    // ): void {

    //     const children: DisplayObjectImpl<any>[] = this._$getChildren();
    //     const index1: number = this.getChildIndex(child1);
    //     const index2: number = this.getChildIndex(child2);

    //     children[index1] = child2;
    //     children[index2] = child1;

    //     if ($rendererWorker) {
    //         this._$postChildrenIds();
    //     }

    //     this._$doChanged();
    // }

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
    // swapChildrenAt (index1: number, index2: number): void
    // {
    //     this.swapChildren(
    //         this.getChildAt(index1),
    //         this.getChildAt(index2)
    //     );
    // }

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
}