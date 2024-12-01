import type { DisplayObject } from "./DisplayObject";
import type { IDisplayObject } from "./interface/IDisplayObject";
import { execute as displayObjectApplyChangesService } from "./DisplayObject/service/DisplayObjectApplyChangesService";
import { execute as displayObjectContainerAddChildUseCase } from "./DisplayObjectContainer/usecase/DisplayObjectContainerAddChildUseCase";
import { execute as displayObjectContainerRemoveChildUseCase } from "./DisplayObjectContainer/usecase/DisplayObjectContainerRemoveChildUseCase";
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
        return this.addChildAt(display_object, this.numChildren - 1);
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

        const parent = display_object.parent;
        if (parent) {
            parent.removeChild(display_object);
        }

        displayObjectContainerAddChildUseCase(this, display_object, index);

        return display_object;
    }

    // /**
    //  * @description 指定された表示オブジェクトが、DisplayObjectContainer インスタンスの子であるか
    //  *              インスタンス自体であるかを指定します。
    //  *              Determines whether the specified display object is a child
    //  *              of the DisplayObjectContainer instance or the instance itself.
    //  *
    //  * @param  {DisplayObject} child
    //  * @return {boolean}
    //  * @method
    //  * @public
    //  */
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

    // /**
    //  * @description 指定のインデックス位置にある子表示オブジェクトインスタンスを返します。
    //  *              Returns the child display object instance that exists at the specified index.
    //  *
    //  * @param  {number} index
    //  * @return {DisplayObject}
    //  * @method
    //  * @public
    //  */
    // getChildAt (index: number): DisplayObjectImpl<any>
    // {
    //     const children: DisplayObjectImpl<any>[] = this._$getChildren();

    //     if (0 > index || index > children.length) {
    //         throw new RangeError(`RangeError: getChildAt: index error: ${index}`);
    //     }

    //     return index in children ? children[index] : null;
    // }

    // /**
    //  * @description 指定された名前に一致する子表示オブジェクトを返します。
    //  *              Returns the child display object that exists with the specified name.
    //  *
    //  * @param  {string} name
    //  * @return {{DisplayObject}|null}
    //  * @method
    //  * @public
    //  */
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
     * @return {DisplayObject}
     * @method
     * @public
     */
    removeChild <D extends DisplayObject>(display_object: D): D
    {
        // if (display_object.parent && display_object.parent !== this) {
        //     throw new Error("ArgumentError: Parent-child relationship does not match.");
        // }

        return displayObjectContainerRemoveChildUseCase(this, display_object);
    }

    // /**
    //  * @description DisplayObjectContainer の子リストの指定された index 位置から子 DisplayObject を削除します。
    //  *              Removes a child DisplayObject from the specified index position
    //  *              in the child list of the DisplayObjectContainer.
    //  *
    //  * @param  {number} index
    //  * @return {DisplayObject}
    //  * @method
    //  * @public
    //  */
    // removeChildAt (index: number): DisplayObjectImpl<any>
    // {
    //     return this._$remove(this.getChildAt(index));
    // }

    // /**
    //  * @description DisplayObjectContainer インスタンスの子リストから
    //  *              すべての child DisplayObject インスタンスを削除します。
    //  *              Removes all child DisplayObject instances from
    //  *              the child list of the DisplayObjectContainer instance.
    //  *
    //  * @param  {number} [begin_index=0]
    //  * @param  {number} [end_index=0x7fffffff]
    //  * @return {void}
    //  * @method
    //  * @public
    //  */
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

    // /**
    //  * @description 表示オブジェクトコンテナの既存の子の位置を変更します。
    //  *              Changes the position of an existing child in the display object container.
    //  *
    //  * @param  {DisplayObject} child
    //  * @param  {number} index
    //  * @return {void}
    //  * @method
    //  * @public
    //  */
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

    // /**
    //  * @description 指定された 2 つの子オブジェクトの z 順序（重ね順）を入れ替えます。
    //  *              Swaps the z-order (front-to-back order) of the two specified child objects.
    //  *
    //  * @param  {DisplayObject} child1
    //  * @param  {DisplayObject} child2
    //  * @return {void}
    //  * @method
    //  * @public
    //  */
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

    // /**
    //  * @description 子リスト内の指定されたインデックス位置に該当する 2 つの子オブジェクトの z 順序（重ね順）を入れ替えます。
    //  *              Swaps the z-order (front-to-back order) of the child objects at
    //  *              the two specified index positions in the child list.
    //  *
    //  * @param  {number} index1
    //  * @param  {number} index2
    //  * @return {void}
    //  * @method
    //  * @public
    //  */
    // swapChildrenAt (index1: number, index2: number): void
    // {
    //     this.swapChildren(
    //         this.getChildAt(index1),
    //         this.getChildAt(index2)
    //     );
    // }

    // /**
    //  * @param  {Float32Array} multi_matrix
    //  * @return {object}
    //  * @private
    //  */
    // _$getLayerBounds (multi_matrix: Float32Array): BoundsImpl
    // {

    //     const children: DisplayObjectImpl<any>[] = this._$needsChildren
    //         ? this._$getChildren()
    //         : this._$children;

    //     // size zero
    //     if (!children.length) {
    //         return $getBoundsObject(0, 0, 0, 0);
    //     }

    //     // data init
    //     const no: number = $Number.MAX_VALUE;
    //     let xMin: number = no;
    //     let xMax: number = -no;
    //     let yMin: number = no;
    //     let yMax: number = -no;
    //     for (let idx: number = 0; idx < children.length; ++idx) {

    //         const instance = children[idx];

    //         let multiMatrix = multi_matrix;
    //         const rawMatrix: Float32Array = instance._$transform._$rawMatrix();
    //         if (rawMatrix[0] !== 1 || rawMatrix[1] !== 0
    //             || rawMatrix[2] !== 0 || rawMatrix[3] !== 1
    //             || rawMatrix[4] !== 0 || rawMatrix[5] !== 0
    //         ) {
    //             multiMatrix = $multiplicationMatrix(multi_matrix, rawMatrix);
    //         }

    //         const bounds: BoundsImpl = instance._$getLayerBounds(multiMatrix);

    //         xMin = $Math.min(xMin, bounds.xMin);
    //         xMax = $Math.max(xMax, bounds.xMax);
    //         yMin = $Math.min(yMin, bounds.yMin);
    //         yMax = $Math.max(yMax, bounds.yMax);

    //         $poolBoundsObject(bounds);

    //         if (multiMatrix !== multi_matrix) {
    //             $poolFloat32Array6(multiMatrix);
    //         }
    //     }

    //     const filters: FilterArrayImpl = this._$filters || this.filters;
    //     if (!filters.length) {
    //         return $getBoundsObject(xMin, xMax, yMin, yMax);
    //     }

    //     let filterBounds: BoundsImpl = $getBoundsObject(
    //         0, xMax - xMin,
    //         0, yMax - yMin
    //     );

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

    //     xMax += filterBounds.xMax - (xMax - xMin);
    //     yMax += filterBounds.yMax - (yMax - yMin);
    //     xMin += filterBounds.xMin;
    //     yMin += filterBounds.yMin;

    //     $poolBoundsObject(filterBounds);

    //     return $getBoundsObject(xMin, xMax, yMin, yMax);
    // }

    // /**
    //  * @return {void}
    //  * @method
    //  * @private
    //  */
    // _$executeAddedToStage (): void
    // {
    //     const children: DisplayObjectImpl<any>[] = this._$needsChildren
    //         ? this._$getChildren()
    //         : this._$children;

    //     const childrenIds: number[] = $getArray();

    //     for (let idx: number = 0; idx < children.length; ++idx) {

    //         const instance: DisplayObjectImpl<any> = children[idx];
    //         if (!instance) {
    //             continue;
    //         }

    //         childrenIds.push(instance._$instanceId);
    //         if (!instance._$addedStage) {

    //             if ($rendererWorker) {
    //                 instance._$createWorkerInstance();
    //             }

    //             if (instance.willTrigger(Next2DEvent.ADDED_TO_STAGE)) {
    //                 instance.dispatchEvent(
    //                     new Next2DEvent(Next2DEvent.ADDED_TO_STAGE)
    //                 );
    //             }

    //             instance._$addedStage = true;
    //         }

    //         if (instance instanceof DisplayObjectContainer) {
    //             instance._$executeAddedToStage();
    //         }

    //     }

    //     if ($rendererWorker) {
    //         this._$postChildrenIds(childrenIds);
    //     }

    //     $poolArray(childrenIds);
    // }

    // /**
    //  * @param  {DisplayObject} child
    //  * @param  {boolean} do_event
    //  * @return {DisplayObject}
    //  * @private
    //  */
    // _$remove (
    //     child: DisplayObjectImpl<any>,
    //     do_event: boolean = true
    // ): DisplayObjectImpl<any> {

    //     child._$transform._$transform();

    //     // remove all broadcast events
    //     if (child.hasEventListener(Next2DEvent.ENTER_FRAME)) {
    //         child.removeAllEventListener(Next2DEvent.ENTER_FRAME);
    //     }

    //     if (child.hasEventListener("keyDown")) {
    //         child.removeAllEventListener("keyDown");
    //     }

    //     if (child.hasEventListener("keyUp")) {
    //         child.removeAllEventListener("keyUp");
    //     }

    //     // remove
    //     const children: DisplayObjectImpl<any>[] = this._$needsChildren
    //         ? this._$getChildren()
    //         : this._$children;

    //     const depth: number = this.getChildIndex(child);
    //     children.splice(depth, 1);

    //     this._$names.delete(child.name);
    //     if (do_event) {

    //         // event
    //         if (child.willTrigger(Next2DEvent.REMOVED)) {
    //             child.dispatchEvent(
    //                 new Next2DEvent(Next2DEvent.REMOVED, true)
    //             );
    //         }

    //         // remove stage event
    //         if (this._$stage !== null) {

    //             // worker側のDisplayObjectも削除
    //             if ($rendererWorker) {
    //                 child._$removeWorkerInstance();
    //                 this._$postChildrenIds();
    //             }

    //             if (child.willTrigger(Next2DEvent.REMOVED_FROM_STAGE)) {
    //                 child.dispatchEvent(
    //                     new Next2DEvent(Next2DEvent.REMOVED_FROM_STAGE)
    //                 );
    //             }

    //             if (child instanceof DisplayObjectContainer) {
    //                 child._$executeRemovedFromStage();
    //             }
    //         }

    //         $cacheStore.setRemoveTimer(child._$instanceId);
    //         if (child._$loaderInfo && child._$characterId) {
    //             $cacheStore.setRemoveTimer(
    //                 `${child._$loaderInfo._$id}@${child._$characterId}`
    //             );
    //         }
    //         if (child._$graphics) {
    //             $cacheStore.setRemoveTimer(child._$graphics._$uniqueKey);
    //         }

    //         // reset params
    //         if (child instanceof DisplayObjectContainer) {
    //             child._$removeParentAndStage();
    //         }

    //         // reset
    //         child._$stage      = null;
    //         child._$parent     = null;
    //         child._$root       = null;
    //         child._$active     = false;
    //         child._$wait       = true;
    //         child._$updated    = true;
    //         child._$added      = false;
    //         child._$addedStage = false;
    //         child._$created    = false;
    //         child._$posted     = false;
    //         this._$doChanged();

    //     }

    //     return child;
    // }

    // /**
    //  * @return {void}
    //  * @method
    //  * @private
    //  */
    // _$executeRemovedFromStage (): void
    // {
    //     const children: DisplayObjectImpl<any>[] = this._$getChildren().slice(0);
    //     for (let idx: number = 0; idx < children.length; ++idx) {

    //         const instance: DisplayObjectImpl<any> = children[idx];
    //         if (!instance) {
    //             continue;
    //         }

    //         if (instance._$addedStage) {

    //             // workerのDisplayObjectを削除
    //             if ($rendererWorker) {
    //                 instance._$removeWorkerInstance();
    //             }

    //             if (instance.willTrigger(Next2DEvent.REMOVED_FROM_STAGE)) {
    //                 instance.dispatchEvent(
    //                     new Next2DEvent(Next2DEvent.REMOVED_FROM_STAGE)
    //                 );
    //             }

    //             instance._$created    = false;
    //             instance._$posted     = false;
    //             instance._$addedStage = false;
    //         }

    //         if (instance instanceof DisplayObjectContainer) {
    //             instance._$executeRemovedFromStage();
    //         }

    //     }
    // }

    // /**
    //  * @return {void}
    //  * @method
    //  * @private
    //  */
    // _$removeParentAndStage (): void
    // {
    //     const children: DisplayObjectImpl<any>[] = this._$needsChildren
    //         ? this._$getChildren()
    //         : this._$children;

    //     for (let idx: number = 0; idx < children.length; ++idx) {

    //         const instance: DisplayObjectImpl<any> = children[idx];

    //         $cacheStore.setRemoveTimer(instance._$instanceId);
    //         if (instance._$loaderInfo && instance._$characterId) {
    //             $cacheStore.setRemoveTimer(
    //                 `${instance._$loaderInfo._$id}@${instance._$characterId}`
    //             );
    //         }
    //         if (instance._$graphics) {
    //             $cacheStore.setRemoveTimer(instance._$graphics._$uniqueKey);
    //         }

    //         if (instance instanceof DisplayObjectContainer) {
    //             instance._$removeParentAndStage();
    //         }

    //         instance._$stage      = null;
    //         instance._$root       = null;
    //         instance._$addedStage = false;
    //     }

    //     if ("_$sounds" in this) {
    //         const soundsMap: Map<number, Sound[]> = this._$sounds as Map<number, Sound[]>;
    //         if (soundsMap.size) {
    //             for (const sounds of soundsMap.values()) {
    //                 for (let idx: number = 0; idx < sounds.length; ++idx) {
    //                     const sound: Sound = sounds[idx];
    //                     sound.stop();
    //                 }
    //             }
    //         }
    //     }

    //     this._$needsChildren = true;
    // }

    // /**
    //  * @param  {CanvasToWebGLContext} context
    //  * @param  {Float32Array} matrix
    //  * @return {object}
    //  * @private
    //  */
    // _$preDraw (
    //     context: CanvasToWebGLContext,
    //     matrix: Float32Array
    // ): PreObjectImpl | null {

    //     let multiMatrix: Float32Array = matrix;
    //     const rawMatrix: Float32Array = this._$transform._$rawMatrix();
    //     if (rawMatrix !== $MATRIX_HIT_ARRAY_IDENTITY
    //         && rawMatrix[0] !== 1 || rawMatrix[1] !== 0
    //         || rawMatrix[2] !== 0 || rawMatrix[3] !== 1
    //         || rawMatrix[4] !== 0 || rawMatrix[5] !== 0
    //     ) {
    //         multiMatrix = $multiplicationMatrix(matrix, rawMatrix);
    //     }

    //     // size zero
    //     if (!multiMatrix[0] && !multiMatrix[1]
    //         || !multiMatrix[2] && !multiMatrix[3]
    //     ) {
    //         if (multiMatrix !== matrix) {
    //             $poolFloat32Array6(multiMatrix);
    //         }
    //         return null;
    //     }

    //     // return object
    //     const object: PreObjectImpl = $getPreObject();

    //     // setup
    //     object.matrix = multiMatrix;

    //     // check
    //     const filters: FilterArrayImpl = this._$filters   || this.filters;
    //     const blendMode: BlendModeImpl = this._$blendMode || this.blendMode;
    //     if (filters.length > 0 || blendMode !== "normal") {

    //         // check size
    //         const baseBounds: BoundsImpl = this._$getBounds(null);
    //         const bounds: BoundsImpl = $boundsMatrix(baseBounds, multiMatrix);
    //         $poolBoundsObject(baseBounds);

    //         const xMax: number = +bounds.xMax;
    //         const xMin: number = +bounds.xMin;
    //         const yMax: number = +bounds.yMax;
    //         const yMin: number = +bounds.yMin;
    //         $poolBoundsObject(bounds);

    //         const width: number  = $Math.ceil($Math.abs(xMax - xMin));
    //         const height: number = $Math.ceil($Math.abs(yMax - yMin));
    //         if (0 >= width || 0 >= height) {
    //             $poolPreObject(object);
    //             if (multiMatrix !== matrix) {
    //                 $poolFloat32Array6(multiMatrix);
    //             }
    //             return null;
    //         }

    //         let xScale: number = +$Math.sqrt(
    //             multiMatrix[0] * multiMatrix[0]
    //             + multiMatrix[1] * multiMatrix[1]
    //         );
    //         if (!$Number.isInteger(xScale)) {
    //             const value: string = xScale.toString();
    //             const index: number = value.indexOf("e");
    //             if (index !== -1) {
    //                 xScale = +value.slice(0, index);
    //             }
    //             xScale = +xScale.toFixed(4);
    //         }

    //         let yScale: number = +$Math.sqrt(
    //             multiMatrix[2] * multiMatrix[2]
    //             + multiMatrix[3] * multiMatrix[3]
    //         );
    //         if (!$Number.isInteger(yScale)) {
    //             const value: string = yScale.toString();
    //             const index: number = value.indexOf("e");
    //             if (index !== -1) {
    //                 yScale = +value.slice(0, index);
    //             }
    //             yScale = +yScale.toFixed(4);
    //         }

    //         object.canApply = this._$canApply(filters);
    //         let filterBounds: BoundsImpl = $getBoundsObject(0, width, 0, height);
    //         if (object.canApply && filters) {
    //             for (let idx: number = 0; idx < filters.length ; ++idx) {
    //                 filterBounds = filters[idx]
    //                     ._$generateFilterRect(filterBounds, xScale, yScale);
    //             }
    //         }

    //         const currentAttachment: AttachmentImpl | null = context
    //             .frameBuffer
    //             .currentAttachment;

    //         if (!currentAttachment
    //             || !currentAttachment.texture
    //             || xMin - filterBounds.xMin > currentAttachment.width
    //             || yMin - filterBounds.yMin > currentAttachment.height
    //         ) {
    //             $poolBoundsObject(filterBounds);
    //             $poolPreObject(object);
    //             if (multiMatrix !== matrix) {
    //                 $poolFloat32Array6(multiMatrix);
    //             }
    //             return null;
    //         }

    //         if (0 > xMin + filterBounds.xMax || 0 > yMin + filterBounds.yMax) {
    //             $poolBoundsObject(filterBounds);
    //             $poolPreObject(object);
    //             if (multiMatrix !== matrix) {
    //                 $poolFloat32Array6(multiMatrix);
    //             }
    //             return null;
    //         }

    //         // move size
    //         let tx: number = multiMatrix[4] - xMin;
    //         let ty: number = multiMatrix[5] - yMin;

    //         // start layer
    //         context._$startLayer(
    //             $getBoundsObject(xMin, xMax, yMin, yMax)
    //         );

    //         // check cache
    //         const updated: boolean = this._$isFilterUpdated(
    //             multiMatrix, filters, object.canApply
    //         );

    //         const layerBounds: BoundsImpl = this._$getLayerBounds(multiMatrix);

    //         const layerWidth: number  = $Math.ceil($Math.abs(layerBounds.xMax - layerBounds.xMin));
    //         const layerHeight: number = $Math.ceil($Math.abs(layerBounds.yMax - layerBounds.yMin));
    //         $poolBoundsObject(layerBounds);

    //         const sw = layerWidth  - filterBounds.xMax + filterBounds.xMin;
    //         const sh = layerHeight - filterBounds.yMax + filterBounds.yMin;

    //         tx += sw;
    //         ty += sh;

    //         object.sw = sw;
    //         object.sh = sh;
    //         if (updated) {
    //             context._$saveAttachment(
    //                 $Math.ceil(width  + sw),
    //                 $Math.ceil(height + sh),
    //                 true
    //             );
    //         }

    //         // setup
    //         object.isLayer   = true;
    //         object.isUpdated = updated;
    //         object.filters   = filters;
    //         object.blendMode = blendMode;
    //         object.color     = $getFloat32Array8();
    //         object.matrix    = $getFloat32Array6(
    //             multiMatrix[0], multiMatrix[1],
    //             multiMatrix[2], multiMatrix[3],
    //             tx, ty
    //         );

    //         if (multiMatrix !== matrix) {
    //             $poolFloat32Array6(multiMatrix);
    //         }

    //         $poolBoundsObject(filterBounds);
    //     }

    //     return object;
    // }

    // /**
    //  * @param  {CanvasToWebGLContext} context
    //  * @param  {Float32Array} matrix
    //  * @param  {Float32Array} color_transform
    //  * @param  {object} object
    //  * @return {void}
    //  * @method
    //  * @private
    //  */
    // _$postDraw (
    //     context: CanvasToWebGLContext,
    //     matrix: Float32Array,
    //     color_transform: Float32Array,
    //     object: PreObjectImpl
    // ): void {

    //     context.drawInstacedArray();

    //     // cache
    //     const cacheKeys: any[] = $getArray(this._$instanceId, "f");

    //     const manager: FrameBufferManager = context.frameBuffer;
    //     const multiMatrix: Float32Array = object.matrix as NonNullable<Float32Array>;

    //     let offsetX: number = 0;
    //     let offsetY: number = 0;
    //     let texture: WebGLTexture | null = $cacheStore.get(cacheKeys);

    //     if (!texture || object.isUpdated) {

    //         // remove
    //         if (texture) {
    //             $cacheStore.set(cacheKeys, null);
    //         }

    //         texture = manager
    //             .getTextureFromCurrentAttachment();

    //         const filters: FilterArrayImpl | null = object.filters;
    //         let filterState = false;
    //         if (filters && filters.length) {

    //             for (let idx: number = 0; idx < filters.length; ++idx) {
    //                 texture = filters[idx]
    //                     ._$applyFilter(context, matrix);
    //             }

    //             // update
    //             filterState = true;
    //             offsetX = context._$offsetX;
    //             offsetY = context._$offsetY;

    //             // reset
    //             context._$offsetX = 0;
    //             context._$offsetY = 0;
    //         }

    //         texture.filterState = filterState;
    //         texture.matrix = `${multiMatrix[0]}_`
    //             + `${multiMatrix[1]}_`
    //             + `${multiMatrix[2]}_`
    //             + `${multiMatrix[3]}`;

    //         texture.offsetX = offsetX;
    //         texture.offsetY = offsetY;

    //         $cacheStore.set(cacheKeys, texture);

    //         context._$restoreAttachment();
    //     }

    //     if (texture.offsetX) {
    //         offsetX = texture.offsetX;
    //     }

    //     if (texture.offsetY) {
    //         offsetY = texture.offsetY;
    //     }

    //     // set
    //     context.reset();
    //     context.globalAlpha = $clamp(
    //         color_transform[3] + color_transform[7] / 255, 0, 1
    //     );
    //     context.globalCompositeOperation = object.blendMode;

    //     const bounds: BoundsImpl = context.getCurrentPosition();

    //     context.setTransform(
    //         1, 0, 0, 1,
    //         bounds.xMin - offsetX - object.sw,
    //         bounds.yMin - offsetY - object.sh
    //     );

    //     context.drawImage(texture,
    //         0, 0, texture.width, texture.height,
    //         color_transform
    //     );

    //     // end blend
    //     context._$endLayer();

    //     // object pool
    //     $poolFloat32Array6(object.matrix as NonNullable<Float32Array>);
    //     $poolPreObject(object);

    //     // reset
    //     context.cachePosition = null;
    // }

    // /**
    //  * @param  {number} x
    //  * @param  {number} y
    //  * @return {boolean}
    //  * @method
    //  * @private
    //  */
    // _$outCheck (x: number, y: number): boolean
    // {
    //     let matrix: Float32Array = $MATRIX_ARRAY_IDENTITY;
    //     let parent: ParentImpl<any> | null = this._$parent;
    //     while (parent) {

    //         matrix = $multiplicationMatrix(
    //             parent._$transform._$rawMatrix(),
    //             matrix
    //         );

    //         parent = parent._$parent;
    //     }

    //     $hitContext.setTransform(1, 0, 0, 1, 0, 0);
    //     $hitContext.beginPath();

    //     const options: PlayerHitObjectImpl = {
    //         "x": x,
    //         "y": y,
    //         "pointer": "",
    //         "hit": null
    //     };

    //     return this._$mouseHit($hitContext, matrix, options);
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
